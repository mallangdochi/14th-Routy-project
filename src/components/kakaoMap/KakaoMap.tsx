import { useEffect, useRef, useState } from "react";
import { MapRoot, Message, Note } from "./KakaoMapStyle";
import { loadKakaoMaps, getKakaoMapKey } from "../../api/kakao/kakaoSdk";
import {
  DEFAULT_MAP_CENTER,
  resolveKakaoPlace,
} from "../../api/kakao/kakaoPlaces";
import { getKakaoMapPointUrl } from "../../api/kakao/kakaoLinks";
import type {
  KakaoMapsSDK,
  MapInstance,
  OverlayInstance,
} from "../../api/kakao/kakaoTypes";
import type { KakaoStop, LocatedStop } from "../../api/kakao/kakaoPlaces";

const KAKAO_KEY = getKakaoMapKey();

type Props = {
  stops: KakaoStop[];
  category: string;
  showRoute: boolean;
  zoom: number;
};

function createMarkerContent(stop: KakaoStop, order: number): HTMLElement {
  const box = document.createElement("button");
  box.type = "button";
  box.title = `${order}. ${stop.title} · 카카오맵에서 보기`;
  box.setAttribute("aria-label", `${stop.title} 카카오맵에서 보기`);
  box.style.cssText =
    "display:flex;align-items:center;gap:6px;max-width:180px;padding:5px 9px 5px 5px;background:white;border:1px solid #dcebe9;border-radius:22px;box-shadow:0 2px 9px rgba(0,0,0,.16);cursor:pointer;white-space:nowrap;color:#183f43;font-size:12px;font-weight:700;";
  const number = document.createElement("span");
  number.textContent = String(order);
  number.style.cssText =
    "display:grid;place-items:center;width:25px;height:25px;flex-shrink:0;border-radius:50%;background:#005259;color:white;font-size:12px;";
  const text = document.createElement("span");
  text.textContent = stop.title;
  text.style.cssText = "overflow:hidden;text-overflow:ellipsis;";
  box.append(number, text);
  return box;
}

export default function KakaoMap({ stops, category, showRoute, zoom }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const layersRef = useRef<OverlayInstance[]>([]);
  const locatedRef = useRef<LocatedStop[]>([]);
  const initialLevelRef = useRef(9);
  const [sdk, setSdk] = useState<KakaoMapsSDK | null>(null);
  const [error, setError] = useState("");
  const [unresolved, setUnresolved] = useState(0);
  const [loading, setLoading] = useState(Boolean(KAKAO_KEY));

  useEffect(() => {
    if (!KAKAO_KEY) return;
    let cancelled = false;
    void loadKakaoMaps()
      .then((maps) => {
        if (cancelled || !containerRef.current) return;
        const map = new maps.Map(containerRef.current, {
          center: new maps.LatLng(
            DEFAULT_MAP_CENTER.latitude,
            DEFAULT_MAP_CENTER.longitude,
          ),
          level: 9,
        });
        mapRef.current = map;
        setSdk(maps);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(
            reason instanceof Error
              ? reason.message
              : "지도 연결에 실패했습니다.",
          );
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      layersRef.current.forEach((layer) => layer.setMap(null));
      layersRef.current = [];
      mapRef.current = null;
    };
  }, []);

  // 일정/날짜 변경 시 위치를 다시 찾되, API 응답이 늦게 오면 기존 결과를 표시하지 않습니다.
  useEffect(() => {
    const map = mapRef.current;
    if (!sdk || !map) return;
    let cancelled = false;
    setLoading(true);
    const places = new sdk.services.Places();
    void Promise.all(stops.map((stop) => resolveKakaoPlace(sdk, places, stop)))
      .then((found) => {
        if (cancelled) return;
        locatedRef.current = found.filter(
          (item): item is LocatedStop => item !== null,
        );
        setUnresolved(found.length - locatedRef.current.length);
        const coordinates = locatedRef.current;
        map.relayout();
        if (coordinates.length > 0) {
          if (coordinates.length === 1) {
            map.setCenter(
              new sdk.LatLng(coordinates[0].latitude, coordinates[0].longitude),
            );
            map.setLevel(4);
          } else {
            const bounds = new sdk.LatLngBounds();
            coordinates.forEach(({ latitude, longitude }) =>
              bounds.extend(new sdk.LatLng(latitude, longitude)),
            );
            map.setBounds(bounds, 70);
          }
          initialLevelRef.current = map.getLevel();
        } else {
          map.setCenter(
            new sdk.LatLng(
              DEFAULT_MAP_CENTER.latitude,
              DEFAULT_MAP_CENTER.longitude,
            ),
          );
          map.setLevel(9);
          initialLevelRef.current = 9;
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("장소 위치를 조회하는 중 문제가 발생했습니다.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sdk, stops]);

  // 마커·순서 연결선은 동일 좌표 데이터를 사용합니다.
  useEffect(() => {
    const map = mapRef.current;
    if (!sdk || !map || loading) return;
    layersRef.current.forEach((layer) => layer.setMap(null));
    layersRef.current = [];
    const coordinatePoints = locatedRef.current;
    if (showRoute && coordinatePoints.length >= 2) {
      layersRef.current.push(
        new sdk.Polyline({
          map,
          path: coordinatePoints.map(
            ({ latitude, longitude }) => new sdk.LatLng(latitude, longitude),
          ),
          strokeWeight: 3,
          strokeColor: "#005259",
          strokeOpacity: 0.8,
          strokeStyle: "solid",
        }),
      );
    }
    coordinatePoints.forEach(({ stop, latitude, longitude }) => {
      if (category !== "전체" && stop.category !== category) return;
      const order = stops.findIndex((item) => item.id === stop.id) + 1;
      const content = createMarkerContent(stop, order);
      content.addEventListener("click", () => {
        const url = getKakaoMapPointUrl(stop.title, latitude, longitude);
        window.open(url, "_blank", "noopener,noreferrer");
      });
      layersRef.current.push(
        new sdk.CustomOverlay({
          map,
          position: new sdk.LatLng(latitude, longitude),
          content,
          yAnchor: 1.15,
          zIndex: 3,
        }),
      );
    });
    return () => {
      layersRef.current.forEach((layer) => layer.setMap(null));
      layersRef.current = [];
    };
  }, [sdk, stops, category, showRoute, loading]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || loading) return;
    map.setLevel(
      Math.max(
        1,
        Math.min(14, initialLevelRef.current - Math.round((zoom - 1) * 10)),
      ),
      { animate: true },
    );
  }, [zoom, loading]);

  useEffect(() => {
    const map = mapRef.current;
    const element = containerRef.current;
    if (!map || !element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => map.relayout());
    observer.observe(element);
    return () => observer.disconnect();
  }, [sdk]);

  return (
    <MapRoot>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%" }}
        aria-label="카카오 지도"
      />
      {!KAKAO_KEY ? (
        <Message role="status">
          <strong>카카오맵 API 키가 필요해요.</strong>
          <span>
            프로젝트 루트의 .env.local에 VITE_KAKAO_MAP_JS_KEY를 설정해 주세요.
          </span>
        </Message>
      ) : error ? (
        <Message role="alert">
          <strong>카카오 지도를 표시할 수 없어요.</strong>
          <span>{error}</span>
          <span>
            카카오맵 사용 설정 및 localhost 도메인 등록을 확인해 주세요.
          </span>
        </Message>
      ) : loading ? (
        <Message role="status">카카오 지도와 장소를 불러오는 중이에요.</Message>
      ) : (
        <Note>
          {unresolved > 0
            ? `위치를 확인할 수 없는 장소 ${unresolved}개 · `
            : ""}
          연결선은 방문 순서이며 실제 도로 경로가 아닙니다.
        </Note>
      )}
    </MapRoot>
  );
}
