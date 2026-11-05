import { useEffect, useRef, useState, type FormEvent } from "react";
import { getKakaoMapKey } from "../api/kakao/kakaoSdk";
import { getAllowedCurrentLocation } from "../utils/locationService";
import * as S from "./KakaoTravelMapStyle";
import {
  RouteMapDetails, RouteModePicker, useTouchMap, routeColor,
  type RouteLine, type RouteSelection, type TravelMode,
} from "../components/map/RouteMapInfo";
import { getKakaoMapPointUrl } from "../api/kakao/kakaoLinks";

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

  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selection, setSelection] = useState<RouteSelection | null>(null);
  const isTouch = useTouchMap();
  const pinnedRef = useRef(false);

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

        observer = new ResizeObserver(() => map.relayout());
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

      overlaysRef.current.forEach((overlay) => overlay.setMap(null));

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
    if (!ready || !map || !sdk) return;

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    const show = (value: RouteSelection, pinned: boolean) => {
      pinnedRef.current = pinned;
      setSelection(value);
    };
    const hover = (value: RouteSelection) => {
      if (!isTouch && !pinnedRef.current) setSelection(value);
    };
    const leave = () => {
      if (!isTouch && !pinnedRef.current) setSelection(null);
    };

    const ordered = routeStops.length ? routeStops : stops;
    ordered.forEach((stop, index) => {
      if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) return;
      const order = index + 1;
      const isEnd = index === ordered.length - 1 && index > 0;
      const color = isEnd ? "#D8673C" : index === 0 ? "#188575" : "#0A414B";
      const content = document.createElement("button");
      content.type = "button";
      content.title = `${isEnd ? "도착" : index === 0 ? "출발" : "경유"} ${order}. ${stop.title} ${stop.time || ""}`;
      content.setAttribute("aria-label", content.title);
      content.style.cssText = `border:2px solid white;background:${color};color:white;border-radius:22px;padding:6px 10px;min-width:36px;min-height:36px;font-size:15px;font-weight:700;box-shadow:0 2px 10px #0004;cursor:pointer;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`;
      content.textContent = `${order}${stop.time ? ` · ${stop.time}` : ""}`;
      const info: RouteSelection = {
        kind: "stop", order, total: ordered.length,
        stop: {
          id: stop.id,
          title: stop.title,
          time: stop.time,
          description: stop.description,
          category: stop.category,
          address: stop.address,
          externalUrl: getKakaoMapPointUrl(stop.title, stop.lat!, stop.lng!),
        },
      };
      content.addEventListener("click", () => show(info, true));
      content.addEventListener("mouseenter", () => hover(info));
      content.addEventListener("mouseleave", leave);
      overlaysRef.current.push(new sdk.CustomOverlay({
        map,
        position: new sdk.LatLng(stop.lat!, stop.lng!),
        content,
        yAnchor: 1.15,
        zIndex: 3,
      }));
    });

    if (showRoute) {
      routePaths?.forEach((route, index) => {
        if (route.path.length < 2) return;
        const polyline = new sdk.Polyline({
          map,
          path: route.path.map(({ lat, lng }) => new sdk.LatLng(lat, lng)),
          strokeWeight: 6,
          strokeColor: routeColor(route.mode),
          strokeOpacity: 0.92,
        });
        overlaysRef.current.push(polyline);
        const info: RouteSelection = { kind: "route", route, order: index + 1 };
        sdk.event?.addListener(polyline, "mouseover", () => hover(info));
        sdk.event?.addListener(polyline, "mouseout", leave);
        sdk.event?.addListener(polyline, "click", () => show(info, true));
      });
    }
    return () => {
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
    };
  }, [stops, routeStops, routePaths, showRoute, ready, isTouch]);

  useEffect(() => {
    setSelection(null);
    pinnedRef.current = false;
  }, [stops, routeStops, routePaths, showRoute]);

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
    <>
      <S.MapCanvas ref={mapNode} />
      <RouteModePicker mode={routeMode} onChange={onRouteModeChange} />
      <RouteMapDetails
        selection={selection}
        isTouch={isTouch}
        onClose={() => { pinnedRef.current = false; setSelection(null); }}
      />

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
    </>
  );
}
