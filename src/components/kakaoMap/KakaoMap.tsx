import { useEffect, useRef, useState } from "react";
import { MapRoot, Message, Note } from "./KakaoMapStyle";
import { loadKakaoMaps, getKakaoMapKey } from "../../api/kakao/kakaoSdk";
import {
  DEFAULT_MAP_CENTER,
  resolveKakaoPlace,
} from "../../api/kakao/kakaoPlaces";
import { getKakaoMapPointUrl } from "../../api/kakao/kakaoLinks";
import {
  RouteMapDetails, RouteModePicker, buildDisplayRoutes, useTouchMap, routeColor,
  type RouteLine, type RouteSelection, type TravelMode,
} from "../map/RouteMapInfo";
import type {
  KakaoMapsSDK,
  MapInstance,
  OverlayInstance,
} from "../../api/kakao/kakaoTypes";
import type { KakaoStop, LocatedStop } from "../../api/kakao/kakaoPlaces";
import { getAllowedCurrentLocation } from "../../utils/locationService";

const KAKAO_KEY = getKakaoMapKey();

type Props = {
  stops: KakaoStop[];
  category: string;
  routePaths?: RouteLine[];
  routeMode?: TravelMode;
  onRouteModeChange?: (next: TravelMode) => void;
  showRoute: boolean;
  zoom: number;
};

function createMarkerContent(stop: KakaoStop, order: number, total: number): HTMLElement {
  const box = document.createElement("button");
  box.type = "button";
  const kind = total === 1 ? "출발·도착" : order === 1 ? "출발" : order === total ? "도착" : "경유";
  const color = order === total && order > 1 ? "#D8673C" : order === 1 ? "#188575" : "#0A414B";
  box.title = `${kind} ${order}. ${stop.title}${stop.time ? ` · ${stop.time}` : ""}`;
  box.setAttribute("aria-label", box.title);
  box.style.cssText =
    "display:flex;align-items:center;gap:6px;max-width:200px;padding:5px 9px 5px 5px;background:white;border:1px solid #dcebe9;border-radius:22px;box-shadow:0 2px 9px rgba(0,0,0,.16);cursor:pointer;white-space:nowrap;color:#183f43;font-size:15px;font-weight:700;";
  const number = document.createElement("span");
  number.textContent = String(order);
  number.style.cssText = `display:grid;place-items:center;width:28px;height:28px;flex-shrink:0;border-radius:50%;background:${color};color:white;font-size:15px;`;
  const text = document.createElement("span");
  text.textContent = `${stop.title}${stop.time ? ` · ${stop.time}` : ""}`;
  text.style.cssText = "overflow:hidden;text-overflow:ellipsis;";
  box.append(number, text);
  return box;
}

type KakaoEventAPI = {
  event?: { addListener: (target: object, event: string, handler: () => void) => void };
};

export default function KakaoMap({
  stops, category, routePaths, showRoute, zoom, routeMode, onRouteModeChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const layersRef = useRef<OverlayInstance[]>([]);
  const locatedRef = useRef<LocatedStop[]>([]);
  const initialLevelRef = useRef(9);
  const [sdk, setSdk] = useState<KakaoMapsSDK | null>(null);
  const [error, setError] = useState("");
  const [unresolved, setUnresolved] = useState(0);
  const [loading, setLoading] = useState(Boolean(KAKAO_KEY));
  const [selection, setSelection] = useState<RouteSelection | null>(null);
  const isTouch = useTouchMap();
  const pinnedRef = useRef(false);

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

  // 일정이 비어 있으면, 허용한 사용자의 현재 위치를 초기 중심으로 활용합니다.
  useEffect(() => {
    if (!sdk || !mapRef.current || stops.length > 0) return;
    let cancelled = false;
    void getAllowedCurrentLocation().then((point) => {
      if (cancelled || !point || !mapRef.current) return;
      mapRef.current.setCenter(new sdk.LatLng(point.lat, point.lng));
      mapRef.current.setLevel(5);
      initialLevelRef.current = 5;
    }).catch(() => { /* 위치 거부 시 기존 중심 유지 */ });
    return () => { cancelled = true; };
  }, [sdk, stops.length]);

  // 지도 위의 검색 결과를 클릭했을 때 지도 중심 변경
  useEffect(() => {
    if (!sdk) return;
    const onFocus = (event: Event) => {
      const pos = (event as CustomEvent<{lat: number; lng: number}>).detail;
      if (!pos || !Number.isFinite(pos.lat) || !Number.isFinite(pos.lng)) return;
      mapRef.current?.setCenter(new sdk.LatLng(pos.lat, pos.lng));
      mapRef.current?.setLevel(4);
    };
    window.addEventListener("routy:map:focus", onFocus);
    return () => window.removeEventListener("routy:map:focus", onFocus);
  }, [sdk]);

  // 마커는 방문 순서와 예정 시간을 표시하고, 경로선은 실제 API 좌표만 사용합니다.
  useEffect(() => {
    const map = mapRef.current;
    if (!sdk || !map || loading) return;
    layersRef.current.forEach((layer) => layer.setMap(null));
    layersRef.current = [];
    const eventApi = (sdk as unknown as KakaoEventAPI).event;
    const openInfo = (next: RouteSelection, pinned: boolean) => {
      pinnedRef.current = pinned;
      setSelection(next);
    };
    const hoverInfo = (next: RouteSelection) => {
      if (!isTouch && !pinnedRef.current) setSelection(next);
    };
    const endHover = () => {
      if (!isTouch && !pinnedRef.current) setSelection(null);
    };

    if (showRoute) {
      const ordered = stops.map((stop) => {
        const point = locatedRef.current.find((row) => String(row.stop.id) === String(stop.id));
        return { id: stop.id, title: stop.title, time: stop.time, address: stop.address,
          description: "description" in stop && typeof stop.description === "string" ? stop.description : undefined,
          lat: point?.latitude, lng: point?.longitude };
      });
      buildDisplayRoutes(ordered, routePaths, routeMode).forEach((route) => {
        const line = new sdk.Polyline({
          map,
          path: route.path.map(({ lat, lng }) => new sdk.LatLng(lat, lng)),
          strokeWeight: route.isFallback ? 5 : 9,
          strokeColor: route.isFallback ? "#778D90" : routeColor(route.mode),
          strokeOpacity: route.isFallback ? 0.7 : 0.92,
          strokeStyle: route.isFallback ? "shortdash" : "solid",
        });
        layersRef.current.push(line);
        const info: RouteSelection = { kind: "route", route, order: route.order ?? 1 };
        eventApi?.addListener(line, "mouseover", () => hoverInfo(info));
        eventApi?.addListener(line, "mouseout", endHover);
        eventApi?.addListener(line, "click", () => openInfo(info, true));
      });
    }
    locatedRef.current.forEach(({ stop, latitude, longitude }) => {
      if (category !== "전체" && stop.category !== category) return;
      const order = stops.findIndex((item) => item.id === stop.id) + 1;
      const content = createMarkerContent(stop, order, stops.length);
      const info: RouteSelection = {
        kind: "stop",
        order,
        total: stops.length,
        stop: {
          id: stop.id,
          title: stop.title,
          time: stop.time,
          address: stop.address,
          category: stop.category,
          description: "description" in stop && typeof stop.description === "string" ? stop.description : undefined,
          externalUrl: getKakaoMapPointUrl(stop.title, latitude, longitude),
        },
      };
      content.addEventListener("click", () => openInfo(info, true));
      content.addEventListener("mouseenter", () => hoverInfo(info));
      content.addEventListener("mouseleave", endHover);
      layersRef.current.push(new sdk.CustomOverlay({
        map,
        position: new sdk.LatLng(latitude, longitude),
        content,
        yAnchor: 1.15,
        zIndex: 3,
      }));
    });
    return () => {
      layersRef.current.forEach((layer) => layer.setMap(null));
      layersRef.current = [];
    };
  }, [sdk, stops, category, routePaths, routeMode, showRoute, loading, isTouch]);

  useEffect(() => {
    setSelection(null);
    pinnedRef.current = false;
  }, [stops, routePaths, routeMode, showRoute]);

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
      <RouteModePicker mode={routeMode} onChange={onRouteModeChange} />
      <RouteMapDetails
        selection={selection}
        isTouch={isTouch}
        onClose={() => { pinnedRef.current = false; setSelection(null); }}
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
          {routePaths?.length ? "실선: 실제 API 경로 · 점선: 조회되지 않은 구간" : "점선은 방문 순서이며 실제 경로는 조회되지 않았습니다."}
        </Note>
      )}
    </MapRoot>
  );
}
