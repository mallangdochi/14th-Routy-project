import { useEffect, useRef, useState } from "react";
import { MapRoot, Message, Note } from "./KakaoMapStyle";
import { loadKakaoMaps } from "../../api/kakao/kakaoSdk";
import {
  DEFAULT_MAP_CENTER,
  resolveKakaoPlace,
} from "../../api/kakao/kakaoPlaces";
import { getKakaoMapPointUrl } from "../../api/kakao/kakaoLinks";
import {
  MapDock,
  MapViewport,
  RouteHoverHint,
  RouteMapDetails,
  RouteModePicker,
  buildDisplayRoutes,
  useTouchMap,
  routeColor,
  setRouteLineHoverStyle,
  type RouteLine,
  type RouteSelection,
  type TravelMode,
} from "../map/RouteMapInfo";
import type {
  KakaoMapsSDK,
  MapInstance,
  OverlayInstance,
} from "../../api/kakao/kakaoTypes";
import type { KakaoStop, LocatedStop } from "../../api/kakao/kakaoPlaces";
import { getAllowedCurrentLocation } from "../../utils/locationService";

const KAKAO_KEY = () =>
  (
    import.meta.env.VITE_KAKAO_MAP_KEY ||
    import.meta.env.KAKAO_MAP_KEY ||
    ""
  ).trim();

type Props = {
  stops: KakaoStop[];
  category: string;
  routePaths?: RouteLine[];
  routeMode?: TravelMode;
  onRouteModeChange?: (next: TravelMode) => void;
  showRoute: boolean;
  zoom: number;
};

type KakaoEventAPI = {
  event?: {
    addListener: (target: object, event: string, handler: () => void) => void;
  };
};

function createMarkerContent(
  stop: KakaoStop,
  order: number,
  total: number,
): HTMLElement {
  const box = document.createElement("button");
  box.type = "button";

  const kind =
    total === 1
      ? "출발·도착"
      : order === 1
        ? "출발"
        : order === total
          ? "도착"
          : "경유";

  const color =
    order === total && order > 1
      ? "#D8673C"
      : order === 1
        ? "#188575"
        : "#0A414B";

  box.title = `${kind} ${order}. ${stop.title}${
    stop.time ? ` · ${stop.time}` : ""
  }`;
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

export default function KakaoMap({
  stops,
  category,
  routePaths,
  showRoute,
  zoom,
  routeMode,
  onRouteModeChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const layersRef = useRef<OverlayInstance[]>([]);
  const locatedRef = useRef<LocatedStop[]>([]);
  const initialLevelRef = useRef(9);
  const pinnedRef = useRef(false);
  const selectedRouteRef = useRef<RouteLine | null>(null);

  const [sdk, setSdk] = useState<KakaoMapsSDK | null>(null);
  const [error, setError] = useState("");
  const [unresolved, setUnresolved] = useState(0);
  const [loading, setLoading] = useState(Boolean(KAKAO_KEY));
  const [selection, setSelection] = useState<RouteSelection | null>(null);
  const [hoverSelection, setHoverSelection] = useState<RouteSelection | null>(
    null,
  );

  const isTouch = useTouchMap();

  const [selectionContext, setSelectionContext] = useState({
    stops,
    routePaths,
    routeMode,
    showRoute,
    category,
    isTouch,
  });

  const [locationContext, setLocationContext] = useState({
    sdk,
    stops,
  });

  // 입력이 바뀌었을 때만 현재 컴포넌트의 선택 상태를 초기화합니다.
  if (
    selectionContext.stops !== stops ||
    selectionContext.routePaths !== routePaths ||
    selectionContext.routeMode !== routeMode ||
    selectionContext.showRoute !== showRoute ||
    selectionContext.category !== category ||
    selectionContext.isTouch !== isTouch
  ) {
    setSelectionContext({
      stops,
      routePaths,
      routeMode,
      showRoute,
      category,
      isTouch,
    });
    setSelection(null);
    setHoverSelection(null);
  }

  // 위치 조회에 필요한 입력이 바뀌면 로딩 상태를 초기화합니다.
  if (locationContext.sdk !== sdk || locationContext.stops !== stops) {
    setLocationContext({ sdk, stops });

    if (sdk) {
      setLoading(true);
      setError("");
      setUnresolved(0);
    }
  }

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
        if (cancelled) return;

        setError(
          reason instanceof Error
            ? reason.message
            : "지도 연결에 실패했습니다.",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
      layersRef.current.forEach((layer) => layer.setMap(null));
      layersRef.current = [];
      mapRef.current = null;
    };
  }, []);

  // 일정/날짜 변경 시 위치를 다시 조회합니다.
  useEffect(() => {
    const map = mapRef.current;
    if (!sdk || !map) return;

    let cancelled = false;
    const places = new sdk.services.Places();

    void Promise.all(stops.map((stop) => resolveKakaoPlace(sdk, places, stop)))
      .then((found) => {
        if (cancelled) return;

        const coordinates = found.filter(
          (item): item is LocatedStop => item !== null,
        );

        locatedRef.current = coordinates;
        setUnresolved(found.length - coordinates.length);

        map.relayout();

        if (coordinates.length === 1) {
          map.setCenter(
            new sdk.LatLng(coordinates[0].latitude, coordinates[0].longitude),
          );
          map.setLevel(4);
        } else if (coordinates.length > 1) {
          const bounds = new sdk.LatLngBounds();

          coordinates.forEach(({ latitude, longitude }) => {
            bounds.extend(new sdk.LatLng(latitude, longitude));
          });

          map.setBounds(bounds, 70);
        } else {
          map.setCenter(
            new sdk.LatLng(
              DEFAULT_MAP_CENTER.latitude,
              DEFAULT_MAP_CENTER.longitude,
            ),
          );
          map.setLevel(9);
        }

        initialLevelRef.current = map.getLevel();
        setError("");
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;

        locatedRef.current = [];
        setError("장소 위치를 조회하는 중 문제가 발생했습니다.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sdk, stops]);

  // 빈 일정의 기본 중심 설정이 끝난 뒤 현재 위치를 적용합니다.
  useEffect(() => {
    if (!sdk || !mapRef.current || stops.length > 0 || loading || error) {
      return;
    }

    let cancelled = false;

    void getAllowedCurrentLocation()
      .then((point) => {
        if (cancelled || !point || !mapRef.current) return;

        mapRef.current.setCenter(new sdk.LatLng(point.lat, point.lng));
        mapRef.current.setLevel(5);
        initialLevelRef.current = 5;
      })
      .catch(() => {
        // 위치 거부 시 기존 중심을 유지합니다.
      });

    return () => {
      cancelled = true;
    };
  }, [sdk, stops.length, loading, error]);

  useEffect(() => {
    if (!sdk) return;

    const onFocus = (event: Event) => {
      const pos = (event as CustomEvent<{ lat: number; lng: number }>).detail;

      if (!pos || !Number.isFinite(pos.lat) || !Number.isFinite(pos.lng)) {
        return;
      }

      mapRef.current?.setCenter(new sdk.LatLng(pos.lat, pos.lng));
      mapRef.current?.setLevel(4);
    };

    window.addEventListener("routy:map:focus", onFocus);

    return () => {
      window.removeEventListener("routy:map:focus", onFocus);
    };
  }, [sdk]);

  // 지도 관련 ref는 effect에서 초기화합니다.
  useEffect(() => {
    pinnedRef.current = false;
    selectedRouteRef.current = null;
  }, [stops, routePaths, routeMode, showRoute, category, isTouch]);

  // 마커와 경로선을 외부 지도 SDK에 동기화합니다.
  useEffect(() => {
    const map = mapRef.current;
    if (!sdk || !map) return;

    layersRef.current.forEach((layer) => layer.setMap(null));
    layersRef.current = [];

    if (loading || error) return;

    const eventApi = (sdk as unknown as KakaoEventAPI).event;

    const openInfo = (next: RouteSelection, pinned: boolean) => {
      if (!isTouch) {
        pinnedRef.current = false;
        selectedRouteRef.current = null;
        setSelection(null);
        setHoverSelection(next);
        return;
      }

      pinnedRef.current = pinned;
      selectedRouteRef.current = next.kind === "route" ? next.route : null;

      setHoverSelection(null);
      setSelection(next);
    };

    const hoverInfo = (next: RouteSelection) => {
      if (!isTouch && !pinnedRef.current) {
        setHoverSelection(next);
      }
    };

    const endHover = () => {
      setHoverSelection(null);
    };

    if (showRoute) {
      const ordered = stops.map((stop) => {
        const point = locatedRef.current.find(
          (row) => String(row.stop.id) === String(stop.id),
        );

        return {
          id: stop.id,
          title: stop.title,
          time: stop.time,
          address: stop.address,
          description:
            "description" in stop && typeof stop.description === "string"
              ? stop.description
              : undefined,
          lat: point?.latitude,
          lng: point?.longitude,
        };
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

        const info: RouteSelection = {
          kind: "route",
          route,
          order: route.order ?? 1,
        };

        eventApi?.addListener(line, "mouseover", () => {
          if (!isTouch) {
            setRouteLineHoverStyle(line, route, true);
          }
          hoverInfo(info);
        });

        eventApi?.addListener(line, "mouseout", () => {
          if (!isTouch) {
            setRouteLineHoverStyle(line, route, false);
          }
          endHover();
        });

        eventApi?.addListener(line, "click", () => {
          openInfo(info, true);
        });
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
          description:
            "description" in stop && typeof stop.description === "string"
              ? stop.description
              : undefined,
          externalUrl: getKakaoMapPointUrl(stop.title, latitude, longitude),
        },
      };

      content.addEventListener("click", () => openInfo(info, true));
      content.addEventListener("mouseenter", () => hoverInfo(info));
      content.addEventListener("mouseleave", endHover);

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
  }, [
    sdk,
    stops,
    category,
    routePaths,
    routeMode,
    showRoute,
    loading,
    error,
    isTouch,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || loading || error) return;

    map.setLevel(
      Math.max(
        1,
        Math.min(14, initialLevelRef.current - Math.round((zoom - 1) * 10)),
      ),
      { animate: true },
    );
  }, [zoom, loading, error]);

  useEffect(() => {
    const map = mapRef.current;
    const element = containerRef.current;

    if (!map || !element || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      map.relayout();

      const points = selectedRouteRef.current?.path ?? [];

      if (points.length > 1 && sdk) {
        const bounds = new sdk.LatLngBounds();

        points.forEach(({ lat, lng }) => {
          bounds.extend(new sdk.LatLng(lat, lng));
        });

        map.setBounds(bounds, 60);
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [sdk]);

  const closeDetails = () => {
    pinnedRef.current = false;
    selectedRouteRef.current = null;
    setSelection(null);
    setHoverSelection(null);
  };

  return (
    <MapDock>
      <MapViewport>
        <MapRoot>
          <div
            ref={containerRef}
            style={{ width: "100%", height: "100%" }}
            aria-label="카카오 지도"
          />

          <RouteModePicker mode={routeMode} onChange={onRouteModeChange} />

          {!isTouch && <RouteHoverHint selection={hoverSelection} />}

          {!KAKAO_KEY ? (
            <Message role="status">
              <strong>카카오맵 API 키가 필요해요.</strong>
              <span>
                개발 환경은 .env.local에, 배포 환경은 Vercel 환경변수에
                VITE_KAKAO_MAP_JS_KEY를 설정해 주세요.
              </span>
            </Message>
          ) : error ? (
            <Message role="alert">
              <strong>카카오 지도를 표시할 수 없어요.</strong>
              <span>{error}</span>
              <span>
                카카오맵 사용 설정 및 현재 접속 도메인 등록을 확인해 주세요.
              </span>
            </Message>
          ) : loading ? (
            <Message role="status">
              카카오 지도와 장소를 불러오는 중이에요.
            </Message>
          ) : (
            <Note>
              {unresolved > 0
                ? `위치를 확인할 수 없는 장소 ${unresolved}개 · `
                : ""}
              {routePaths?.length
                ? "실선: 실제 API 경로 · 점선: 조회되지 않은 구간"
                : "점선은 방문 순서이며 실제 경로는 조회되지 않았습니다."}
            </Note>
          )}
        </MapRoot>
      </MapViewport>

      {isTouch && (
        <RouteMapDetails
          key={`${selection?.kind ?? "none"}-${selection?.order ?? ""}-${isTouch}`}
          selection={selection}
          isTouch={isTouch}
          onClose={closeDetails}
        />
      )}
    </MapDock>
  );
}
