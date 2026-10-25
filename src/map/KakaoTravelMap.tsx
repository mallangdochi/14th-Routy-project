import { useEffect, useRef, useState, type FormEvent } from "react";
import * as S from "./KakaoTravelMapStyle";

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
  lat?: number;
  lng?: number;
};

type Props = {
  region: string;
  stops: MapStop[];
  routeStops: MapStop[];
  showRoute: boolean;
  zoom: number;
  onAddPlace: (place: KakaoPlace) => void;
};

type LatLng = {
  getLat(): number;
  getLng(): number;
};

type MapInstance = {
  setCenter(position: LatLng): void;
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
  load(callback: () => void): void;
  LatLng: new (lat: number, lng: number) => LatLng;
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
  showRoute,
  zoom,
  onAddPlace,
}: Props) {
  const key = import.meta.env.VITE_KAKAO_MAP_KEY?.trim();

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

  // 일정 장소 마커 및 방문 순서 표시
  useEffect(() => {
    const map = mapRef.current;
    const sdk = sdkRef.current;

    if (!ready || !map || !sdk) return;

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    for (const stop of stops) {
      if (stop.lat === undefined || stop.lng === undefined) {
        continue;
      }

      overlaysRef.current.push(
        new sdk.Marker({
          map,
          position: new sdk.LatLng(stop.lat, stop.lng),
          title: `${stop.title} (${stop.time})`,
        }),
      );
    }

    const path = routeStops
      .filter((stop) => stop.lat !== undefined && stop.lng !== undefined)
      .map((stop) => new sdk.LatLng(stop.lat!, stop.lng!));

    if (showRoute && path.length > 1) {
      overlaysRef.current.push(
        new sdk.Polyline({
          map,
          path,
          strokeWeight: 4,
          strokeColor: "#0A414B",
          strokeOpacity: 0.85,
        }),
      );
    }

    return () => {
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
    };
  }, [stops, routeStops, showRoute, ready]);

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

      <S.SearchArea>
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
      </S.SearchArea>
    </>
  );
}
