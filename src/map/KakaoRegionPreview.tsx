import { useEffect, useRef, useState } from "react";
import type { TravelRegion } from "../data/regions";

type LatLng = object;

type MapInstance = {
  setCenter(position: LatLng): void;
  setLevel(level: number): void;
  relayout(): void;
};

type MarkerInstance = {
  setMap(map: MapInstance | null): void;
};

type Coordinate = { x: string; y: string };

type KakaoMaps = {
  load(callback: () => void): void;
  LatLng: new (lat: number, lng: number) => LatLng;
  Map: new (
    container: HTMLElement,
    options: { center: LatLng; level: number },
  ) => MapInstance;
  Marker: new (options: {
    map: MapInstance;
    position: LatLng;
  }) => MarkerInstance;
  services: {
    Geocoder: new () => {
      addressSearch(
        address: string,
        callback: (results: Coordinate[], status: string) => void,
      ): void;
    };
    Places: new () => {
      keywordSearch(
        keyword: string,
        callback: (results: Coordinate[], status: string) => void,
      ): void;
    };
    Status: { OK: string };
  };
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

let sharedSdkPromise: Promise<KakaoMaps> | null = null;

function getKakaoMaps(key: string): Promise<KakaoMaps> {
  if (sharedSdkPromise) return sharedSdkPromise;

  sharedSdkPromise = new Promise<KakaoMaps>((resolve, reject) => {
    const initialize = () => {
      const maps = window.kakao?.maps;
      if (!maps) {
        reject(new Error("카카오 지도 SDK를 찾지 못했습니다."));
        return;
      }
      maps.load(() => {
        if (!maps.services?.Geocoder) {
          reject(
            new Error("카카오 장소 검색 라이브러리를 불러오지 못했습니다."),
          );
          return;
        }
        resolve(maps);
      });
    };

    if (window.kakao?.maps) {
      initialize();
      return;
    }

    // 다른 지도 화면에서 같은 SDK를 이미 요청했다면 해당 스크립트를 재사용합니다.
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="dapi.kakao.com/v2/maps/sdk.js"]',
    );
    if (existing) {
      existing.addEventListener("load", initialize, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("카카오 지도 스크립트 로드에 실패했습니다.")),
        { once: true },
      );
      // 스크립트가 이미 로드된 상황이면 SDK 등록을 기다립니다.
      if (window.kakao?.maps) initialize();
      return;
    }

    const script = document.createElement("script");
    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}` +
      "&autoload=false&libraries=services";
    script.async = true;
    script.addEventListener("load", initialize, { once: true });
    script.addEventListener(
      "error",
      () =>
        reject(
          new Error(
            "카카오 지도 연결에 실패했습니다. JavaScript 키와 도메인을 확인하세요.",
          ),
        ),
      { once: true },
    );
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    sharedSdkPromise = null;
    throw error;
  });

  return sharedSdkPromise;
}

const DEFAULT_CENTER = { latitude: 36.35, longitude: 127.85 };

export default function KakaoRegionPreview({
  region,
}: {
  region: TravelRegion | null;
}) {
  const key = import.meta.env.VITE_KAKAO_MAP_KEY?.trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapsRef = useRef<KakaoMaps | null>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const markerRef = useRef<MarkerInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState(
    key
      ? "지도를 불러오는 중입니다."
      : "카카오 JavaScript 키를 .env.local에 입력해주세요.",
  );

  useEffect(() => {
    if (!key || !containerRef.current) return;

    let active = true;
    let observer: ResizeObserver | null = null;

    void getKakaoMaps(key)
      .then((maps) => {
        if (!active || !containerRef.current) return;
        const map = new maps.Map(containerRef.current, {
          center: new maps.LatLng(
            DEFAULT_CENTER.latitude,
            DEFAULT_CENTER.longitude,
          ),
          level: 13,
        });
        mapsRef.current = maps;
        mapRef.current = map;
        setIsReady(true);
        setMessage("");
        observer = new ResizeObserver(() => map.relayout());
        observer.observe(containerRef.current);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setMessage(
          error instanceof Error ? error.message : "지도를 표시할 수 없습니다.",
        );
      });

    return () => {
      active = false;
      observer?.disconnect();
      markerRef.current?.setMap(null);
      markerRef.current = null;
      mapsRef.current = null;
      mapRef.current = null;
    };
  }, [key]);

  useEffect(() => {
    const maps = mapsRef.current;
    const map = mapRef.current;
    if (!isReady || !maps || !map) return;

    let active = true;
    markerRef.current?.setMap(null);
    markerRef.current = null;

    const moveTo = (lat: number, lng: number) => {
      if (!active || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const position = new maps.LatLng(lat, lng);
      map.setCenter(position);
      map.setLevel(region?.id.includes("-") ? 7 : 10);
      markerRef.current?.setMap(null);
      markerRef.current = new maps.Marker({ map, position });
      setMessage("");
    };

    if (!region) {
      map.setCenter(
        new maps.LatLng(DEFAULT_CENTER.latitude, DEFAULT_CENTER.longitude),
      );
      map.setLevel(13);
      queueMicrotask(() => {
        if (active) setMessage("");
      });
      return () => {
        active = false;
      };
    }

    if (region.latitude !== undefined && region.longitude !== undefined) {
      moveTo(region.latitude, region.longitude);
      return () => {
        active = false;
      };
    }

    const onResult = (results: Coordinate[], status: string) => {
      if (!active) return;
      if (status === maps.services.Status.OK && results.length > 0) {
        moveTo(Number(results[0].y), Number(results[0].x));
      } else {
        setMessage(`${region.name} 위치를 찾지 못했습니다.`);
      }
    };

    // 주소/행정구역 검색이 실패하면 키워드 장소 검색으로 한 번 더 찾습니다.
    new maps.services.Geocoder().addressSearch(
      region.name,
      (results, status) => {
        if (!active) return;
        if (status === maps.services.Status.OK && results.length > 0) {
          onResult(results, status);
        } else {
          new maps.services.Places().keywordSearch(region.name, onResult);
        }
      },
    );

    return () => {
      active = false;
    };
  }, [isReady, region]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 240,
        position: "relative",
      }}
    >
      <div
        ref={containerRef}
        aria-label={`${region?.name ?? "대한민국"} 카카오 지도`}
        style={{ width: "100%", height: "100%", minHeight: 240 }}
      />
      {message && (
        <div
          role="status"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 20,
            backgroundColor: "#F5FAF7",
            color: "#0A414B",
            fontSize: 16,
            lineHeight: 1.5,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
