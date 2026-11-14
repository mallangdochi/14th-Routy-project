import { useEffect, useRef, useState, type FormEvent } from "react";
import { getKakaoMapKey } from "../api/kakao/kakaoSdk";
import { getAllowedCurrentLocation } from "../utils/locationService";
import * as S from "./KakaoTravelMapStyle";
import {
  MapDock, MapViewport, RouteHoverHint, RouteModePicker, buildDisplayRoutes, useTouchMap,
  type RouteLine, type RouteSelection, type TravelMode,
} from "../components/map/RouteMapInfo";
import { createMapPlacePin, closeMapPlacePins } from "../components/map/MapPlacePin";
import { mountRouteOverlapLayer } from "../components/map/RouteOverlapLayer";

export type KakaoPlace = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type MapStop = {
  id: number;
  title: string;
  time: string;
  category: string;
  address?: string;
  description?: string;
  lat?: number;
  lng?: number;
};

type Props = {
  region: string;
  stops: MapStop[];
  routeStops: MapStop[];
  routePaths?: RouteLine[];
  routeMode?: TravelMode;
  onRouteModeChange?: (next: TravelMode) => void;
  showRoute: boolean;
  zoom: number;
  onAddPlace: (place: KakaoPlace) => void;
  hideSearch?: boolean;
};

type LatLng = {
  getLat(): number;
  getLng(): number;
};

type MapInstance = {
  setCenter(position: LatLng): void;
  setBounds(bounds: { extend(position: LatLng): void }, padding?: number): void;
  setLevel(level: number): void;
  getLevel(): number;
  relayout(): void;
};

type Overlay = {
  setMap(map: MapInstance | null): void;
};

type PlaceRecord = {
  id: string;
  place_name: string;
  road_address_name?: string;
  address_name: string;
  x: string;
  y: string;
};

type KakaoSDK = {
  event?: { addListener: (target: object, event: string, handler: () => void) => void };
  CustomOverlay: new (options: {
    map: MapInstance;
    position: LatLng;
    content: HTMLElement;
    yAnchor: number;
    zIndex: number;
  }) => Overlay;
  load(callback: () => void): void;
  LatLng: new (lat: number, lng: number) => LatLng;
  LatLngBounds: new () => { extend(position: LatLng): void };
  Map: new (
    element: HTMLElement,
    options: { center: LatLng; level: number },
  ) => MapInstance;
  Marker: new (options: {
    position: LatLng;
    map: MapInstance;
    title: string;
  }) => Overlay;
  Polyline: new (options: {
    path: LatLng[];
    map: MapInstance;
    strokeWeight: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeStyle?: "solid" | "shortdash";
  }) => Overlay;
  services: {
    Places: new () => {
      keywordSearch(
        keyword: string,
        callback: (results: PlaceRecord[], status: string) => void,
        options?: { size: number },
      ): void;
    };
    Status: {
      OK: string;
      ZERO_RESULT: string;
    };
  };
};

type KakaoWindow = Window & {
  kakao?: { maps: KakaoSDK };
};

let sdkPromise: Promise<KakaoSDK> | null = null;

function loadKakao(key: string): Promise<KakaoSDK> {
  const existing = (window as unknown as KakaoWindow).kakao?.maps;

  if (existing?.services) {
    return Promise.resolve(existing);
  }

  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<KakaoSDK>((resolve, reject) => {
    const script = document.createElement("script");

    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false&libraries=services`;

    script.async = true;

    script.onload = () => {
      const sdk = (window as unknown as KakaoWindow).kakao?.maps;

      if (!sdk) {
        reject(new Error("카카오 SDK를 찾을 수 없습니다."));
        return;
      }

      sdk.load(() => resolve(sdk));
    };

    script.onerror = () => {
      reject(
        new Error("카카오 SDK 로드 실패: 앱 키와 허용 도메인을 확인하세요."),
      );
    };

    document.head.appendChild(script);
  }).catch((error: unknown) => {
    sdkPromise = null;
    throw error;
  });

  return sdkPromise;
}

function getCenter(region: string) {
  if (region.includes("부산")) {
    return { lat: 35.1796, lng: 129.0756 };
  }
  if (region.includes("강릉")) {
    return { lat: 37.7519, lng: 128.8761 };
  }
  if (region.includes("서울")) {
    return { lat: 37.5665, lng: 126.978 };
  }
  return { lat: 33.4808, lng: 126.5312 };
}

export default function KakaoTravelMap({
  region,
  stops,
  routeStops,
  routePaths,
  showRoute,
  zoom,
  onAddPlace,
  hideSearch = false,
  routeMode,
  onRouteModeChange,
}: Props) {
  const key = getKakaoMapKey();

  const mapNode = useRef<HTMLDivElement>(null);
  const sdkRef = useRef<KakaoSDK | null>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const placesRef = useRef<InstanceType<KakaoSDK["services"]["Places"]> | null>(
    null,
  );
  const overlaysRef = useRef<Overlay[]>([]);
  const routeLayerRef = useRef<ReturnType<typeof mountRouteOverlapLayer> | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selection, setSelection] = useState<RouteSelection | null>(null);
  const [hoverSelection, setHoverSelection] = useState<RouteSelection | null>(null);
  const isTouch = useTouchMap();
  const pinnedRef = useRef(false);
  const selectedRouteRef = useRef<RouteLine | null>(null);

  const center = getCenter(region);

  // 카카오 지도 불러오기
  useEffect(() => {
    if (!key || !mapNode.current) return;

    let cancelled = false;
    let observer: ResizeObserver | undefined;

    setReady(false);
    setError("");

    void loadKakao(key)
      .then((sdk) => {
        if (cancelled || !mapNode.current) return;

        const map = new sdk.Map(mapNode.current, {
          center: new sdk.LatLng(center.lat, center.lng),
          level: 7,
        });

        sdkRef.current = sdk;
        mapRef.current = map;
        placesRef.current = new sdk.services.Places();

        observer = new ResizeObserver(() => {
          map.relayout();
          const points = selectedRouteRef.current?.path ?? [];
          if (points.length > 1) {
            const bounds = new sdk.LatLngBounds();
            points.forEach(({ lat, lng }) => { bounds.extend(new sdk.LatLng(lat, lng)); });
            map.setBounds(bounds, 60);
          }
        });
        observer.observe(mapNode.current);

        setReady(true);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(
            reason instanceof Error
              ? reason.message
              : "지도를 불러오지 못했습니다.",
          );
        }
      });

    return () => {
      cancelled = true;
      observer?.disconnect();

      overlaysRef.current.forEach((overlay) => { overlay.setMap(null); });

      overlaysRef.current = [];
      mapRef.current = null;
      sdkRef.current = null;
      placesRef.current = null;
    };
  }, [key, region, center.lat, center.lng]);

  useEffect(() => {
    const sdk = sdkRef.current;
    const map = mapRef.current;
    if (!ready || !sdk || !map || stops.length > 0) return;
    let cancelled = false;
    void getAllowedCurrentLocation().then((point) => {
      if (cancelled || !point) return;
      map.setCenter(new sdk.LatLng(point.lat, point.lng));
      map.setLevel(5);
    }).catch(() => { /* 거부 시 여행 지역 기준 지도를 유지 */ });
    return () => { cancelled = true; };
  }, [ready, stops.length]);

  useEffect(() => {
    if (!ready) return;
    const onFocus = (event: Event) => {
      const pos = (event as CustomEvent<{lat: number; lng: number}>).detail;
      if (!pos || !Number.isFinite(pos.lat) || !Number.isFinite(pos.lng)) return;
      const sdk = sdkRef.current;
      if (!sdk) return;
      mapRef.current?.setCenter(new sdk.LatLng(pos.lat, pos.lng));
      mapRef.current?.setLevel(4);
    };
    window.addEventListener("routy:map:focus", onFocus);
    return () => window.removeEventListener("routy:map:focus", onFocus);
  }, [ready]);

  // 방문 순서, 출발·도착 마커, 경로선 정보 제공.
  useEffect(() => {
    const map = mapRef.current;
    const sdk = sdkRef.current;
    const mapContainer = mapNode.current;
    if (!ready || !map || !sdk || !mapContainer) return;

    overlaysRef.current.forEach((overlay) => { overlay.setMap(null); });
    overlaysRef.current = [];

    const pinCleanups: Array<() => void> = [];
    let routeLayer: ReturnType<typeof mountRouteOverlapLayer> | null = null;

    const show = (value: RouteSelection, pinned: boolean) => {
      if (!isTouch) {
        pinnedRef.current = false;
        selectedRouteRef.current = null;
        setSelection(null);
        setHoverSelection(value);
        return;
      }
      pinnedRef.current = pinned;
      selectedRouteRef.current = value.kind === "route" ? value.route : null;
      setHoverSelection(null);
      setSelection(value);
    };
    const hover = (value: RouteSelection) => {
      if (!isTouch && !pinnedRef.current) setHoverSelection(value);
    };
    const leave = () => { setHoverSelection(null); };

    const ordered = routeStops.length ? routeStops : stops;
    ordered.forEach((stop, index) => {
      if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) return;
      const order = index + 1;
      let overlay: Overlay & { setZIndex?: (index: number) => void };
      const pin = createMapPlacePin({
        sdk, map, container: mapContainer, isTouch, order, total: ordered.length,
        stop: { id: stop.id, title: stop.title, time: stop.time, address: stop.address, description: stop.description, category: stop.category },
        onActiveChange: active => { overlay?.setZIndex?.(active ? 20 : 3); if (active) routeLayer?.clearSelection(); },
      });
      pinCleanups.push(pin.destroy);
      overlay = new sdk.CustomOverlay({ map, position: new sdk.LatLng(stop.lat!,stop.lng!), content: pin.element, yAnchor: 1, zIndex: 3 });
      overlaysRef.current.push(overlay);
    });

    if (showRoute && mapNode.current) {
      routeLayer = mountRouteOverlapLayer({
        sdk, map, container: mapNode.current,
        routes: buildDisplayRoutes(ordered, routePaths, routeMode),
        isTouch,
        pinPositions: ordered.filter(stop => Number.isFinite(stop.lat) && Number.isFinite(stop.lng)).map(stop => ({ lat: stop.lat!, lng: stop.lng! })),
        onHover: value => { if (value) { closeMapPlacePins(mapContainer); hover(value); } else leave(); },
        onSelect: value => { closeMapPlacePins(mapContainer); show(value, true); },
        onClear: () => { pinnedRef.current = false; selectedRouteRef.current = null; setSelection(null); setHoverSelection(null); },
      });
      routeLayerRef.current = routeLayer;
    }
    return () => {
      pinCleanups.forEach(cleanup => { cleanup(); });
      routeLayer?.setMap(null);
      if (routeLayerRef.current === routeLayer) routeLayerRef.current = null;
      overlaysRef.current.forEach((overlay) => { overlay.setMap(null); });
      overlaysRef.current = [];
    };
  }, [stops, routeStops, routePaths, routeMode, showRoute, ready, isTouch]);

  useEffect(() => {
    pinnedRef.current = false;
    selectedRouteRef.current = null;
    const frame = window.requestAnimationFrame(() => {
      setSelection(null);
      setHoverSelection(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [stops, routeStops, routePaths, routeMode, showRoute]);

  // 일정 변경 시 해당 장소들이 보이도록 한 번만 지도 범위를 조정합니다.
  useEffect(() => {
    const sdk = sdkRef.current;
    const map = mapRef.current;
    if (!ready || !sdk || !map) return;
    const located = stops.filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng));
    if (located.length === 1) {
      map.setCenter(new sdk.LatLng(located[0].lat!, located[0].lng!));
      map.setLevel(4);
    } else if (located.length > 1) {
      const bounds = new sdk.LatLngBounds();
      for (const stop of located) bounds.extend(new sdk.LatLng(stop.lat!, stop.lng!));
      map.setBounds(bounds, 70);
    }
  }, [stops, ready]);

  // 지도 확대 및 축소
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    const level = Math.max(1, Math.min(14, 7 - Math.round((zoom - 1) * 10)));

    mapRef.current.setLevel(level);
  }, [zoom, ready]);

  // 장소 검색
  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim() || !placesRef.current || !sdkRef.current) {
      return;
    }

    setError("");
    setSearching(true);
    setSearched(false);

    placesRef.current.keywordSearch(
      `${region} ${query.trim()}`,
      (data, status) => {
        setSearching(false);
        setSearched(true);

        if (status === sdkRef.current?.services.Status.ZERO_RESULT) {
          setResults([]);
        } else if (status !== sdkRef.current?.services.Status.OK) {
          setError("검색에 실패했습니다. 지도 API 설정을 확인해주세요.");
          setResults([]);
        } else {
          setResults(
            data
              .map((item) => ({
                name: item.place_name,
                address: item.road_address_name || item.address_name,
                lat: Number(item.y),
                lng: Number(item.x),
              }))
              .filter(
                (item) =>
                  Number.isFinite(item.lat) && Number.isFinite(item.lng),
              ),
          );
        }
      },
      { size: 10 },
    );
  };

  return (
    <MapDock>
      <MapViewport>
        <S.MapCanvas ref={mapNode} />
      <RouteModePicker mode={routeMode} onChange={onRouteModeChange} />
      <RouteHoverHint selection={isTouch ? selection : hoverSelection} onDismiss={isTouch ? () => routeLayerRef.current?.clearSelection() : undefined} />

      {!key && (
        <S.Status>
          카카오 JavaScript 키가 없습니다. .env.local에 VITE_KAKAO_MAP_KEY를
          입력해주세요.
        </S.Status>
      )}

      {error && <S.Status role="alert">{error}</S.Status>}

      {key && !ready && !error && (
        <S.Status>카카오 지도를 불러오는 중입니다.</S.Status>
      )}

      {!hideSearch && <S.SearchArea>
        <S.SearchForm onSubmit={onSearch}>
          <S.SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${region} 장소 검색`}
            aria-label="카카오 장소 검색"
          />
          <S.SearchButton type="submit" disabled={!ready || searching}>
            {searching ? "검색 중" : "검색"}
          </S.SearchButton>
        </S.SearchForm>

        {searched && results.length === 0 && !error && (
          <S.Help>검색 결과가 없습니다.</S.Help>
        )}

        {results.length > 0 && (
          <S.ResultList>
            {results.map((place, index) => (
              <S.ResultButton
                key={`${place.lat}-${place.lng}-${index}`}
                type="button"
                onClick={() => {
                  mapRef.current?.setCenter(
                    new sdkRef.current!.LatLng(place.lat, place.lng),
                  );

                  onAddPlace(place);
                  setResults([]);
                  setSearched(false);
                  setQuery("");
                }}
              >
                <strong>{place.name} · 일정에 추가</strong>
                <span>{place.address}</span>
              </S.ResultButton>
            ))}
          </S.ResultList>
        )}
      </S.SearchArea>}
      </MapViewport>
    </MapDock>
  );
}
