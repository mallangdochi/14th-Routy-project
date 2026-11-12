import { useEffect, useState } from "react";
import * as S from "./RouteMapInfoStyle";

export type TravelMode = "walk" | "bike" | "car" | "bus" | "subway" | "transit";
export type RoutePoint = { lat: number; lng: number };
export type RouteLine = {
  path: RoutePoint[];
  /** From/to fields are optional for compatibility with older callers. */
  order?: number;
  fromId?: string | number;
  toId?: string | number;
  fromName?: string;
  toName?: string;
  fromAddress?: string;
  toAddress?: string;
  fromDescription?: string;
  toDescription?: string;
  fromTime?: string;
  toTime?: string;
  mode?: TravelMode;
  transportLabel?: string;
  error?: string;
  distanceMeters?: number;
  durationSeconds?: number;
  transfers?: number;
  fareWon?: number;
  link?: string | null;
};
export type MapStopInfo = {
  id: string | number;
  title: string;
  time?: string;
  address?: string;
  description?: string;
  category?: string;
  externalUrl?: string;
};
/** 일정에 저장된 방문 순서를 보존하며 API 누락 구간만 직선으로 표시합니다. */
export function buildDisplayRoutes(
  stops: Array<{
    id: number | string;
    title: string;
    time?: string;
    address?: string;
    description?: string;
    lat?: number;
    lng?: number;
  }>,
  routes: RouteLine[] = [],
  mode?: TravelMode,
): RouteLine[] {
  return stops.slice(1).flatMap((to, index) => {
    const from = stops[index];
    const order = index + 1;
    const matched = routes.find(
      (route) =>
        route.order === order &&
        (route.fromId == null || String(route.fromId) === String(from.id)) &&
        (route.toId == null || String(route.toId) === String(to.id)),
    );
    const actual = matched && matched.path.length >= 2;
    const valid = (stop: typeof from) =>
      typeof stop.lat === "number" &&
      Number.isFinite(stop.lat) &&
      typeof stop.lng === "number" &&
      Number.isFinite(stop.lng);
    if (!actual && (!valid(from) || !valid(to))) return [];
    const path = actual
      ? matched.path
      : [
          { lat: from.lat!, lng: from.lng! },
          { lat: to.lat!, lng: to.lng! },
        ];
    return [
      {
        ...matched,
        path,
        order,
        fromId: from.id,
        toId: to.id,
        fromName: from.title,
        toName: to.title,
        fromTime: from.time,
        toTime: to.time,
        fromAddress: from.address,
        toAddress: to.address,
        fromDescription: from.description,
        toDescription: to.description,
        mode: matched?.mode ?? mode,
        isFallback: !actual,
      },
    ];
  });
}

export type RouteSelection =
  | { kind: "route"; route: RouteLine; order: number }
  | { kind: "stop"; stop: MapStopInfo; order: number; total: number };

const modes: { id: TravelMode; name: string }[] = [
  { id: "walk", name: "도보" },
  { id: "bike", name: "자전거" },
  { id: "car", name: "자동차" },
  { id: "bus", name: "버스" },
  { id: "subway", name: "지하철" },
  // 기존 경로 데이터 호환 전용: 새 교통 선택기에는 표시하지 않음.
  { id: "transit", name: "대중교통(기존)" },
];

export const modeName = (mode?: TravelMode) =>
  modes.find((m) => m.id === mode)?.name ?? "이동수단 미설정";

export const distanceLabel = (meters?: number) =>
  typeof meters === "number" && Number.isFinite(meters)
    ? meters >= 1000
      ? `${(meters / 1000).toFixed(1)}km`
      : `${Math.round(meters)}m`
    : "거리 조회 안 됨";

export const durationLabel = (seconds?: number) => {
  if (typeof seconds !== "number" || !Number.isFinite(seconds))
    return "시간 조회 안 됨";
  const min = Math.max(1, Math.ceil(seconds / 60));
  return min >= 60 ? `${Math.floor(min / 60)}시간 ${min % 60}분` : `${min}분`;
};

export const routeColor = (mode?: TravelMode) => {
  switch (mode) {
    case "walk":
      return "#167A75";
    case "bike":
      return "#2877A1";
    case "car":
      return "#A65A30";
    case "bus":
      return "#267C57";
    case "subway":
      return "#7754B7";
    case "transit":
      return "#7148A7";
    default:
      return "#0A414B";
  }
};

/** For mouse use a compact tooltip; for touch use an expandable bottom drawer. */
export function useTouchMap() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsTouch(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return isTouch;
}

export function RouteModePicker({
  mode,
  onChange,
}: {
  mode?: TravelMode;
  onChange?: (mode: TravelMode) => void;
}) {
  if (!onChange || !mode) return null;
  return (
    <S.ModePicker role="group" aria-label="교통수단별 경로 조회">
      {modes
        .filter((item) => item.id !== "transit")
        .map((item) => (
          <S.ModeButton
            type="button"
            key={item.id}
            aria-pressed={mode === item.id}
            $active={mode === item.id}
            onClick={() => onChange(item.id)}
          >
            {item.name}
          </S.ModeButton>
        ))}
    </S.ModePicker>
  );
}

function safeKakaoLink(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "map.kakao.com"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

/** The map itself never loses its interaction area to the desktop tooltip. */
export function RouteHoverHint({
  selection,
}: {
  selection: RouteSelection | null;
}) {
  const hintRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selection) return;
    const element = hintRef.current;
    const viewport = element?.parentElement;
    if (!element || !viewport) return;
    const onMove = (event: PointerEvent) => {
      const bounds = viewport.getBoundingClientRect();
      // The hint follows the pointer, but never extends beyond the map.
      const width = element.offsetWidth || 230;
      const height = element.offsetHeight || 72;
      const x = Math.max(
        8,
        Math.min(event.clientX - bounds.left + 18, bounds.width - width - 8),
      );
      const y = Math.max(
        8,
        Math.min(event.clientY - bounds.top + 18, bounds.height - height - 8),
      );
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [selection]);
  if (!selection) return null;
  if (selection.kind === "stop") {
    return (
      <S.HoverHint ref={hintRef} role="status">
        <strong>
          {selection.order}. {selection.stop.title}
        </strong>
        <span>
          {selection.stop.time
            ? `방문 ${selection.stop.time}`
            : "장소를 클릭하면 상세 설명을 볼 수 있어요"}
        </span>
      </S.HoverHint>
    );
  }
  const { route } = selection;
  return (
    <S.HoverHint ref={hintRef} role="status">
      <strong>
        {selection.order}구간 · {route.fromName || "출발"} →{" "}
        {route.toName || "도착"}
      </strong>
      <span>
        {route.transportLabel || modeName(route.mode)} ·{" "}
        {route.isFallback
          ? `직선 연결 · ${route.error || "실제 경로 조회 안 됨"}`
          : `${distanceLabel(route.distanceMeters)} · ${durationLabel(route.durationSeconds)}`}
      </span>
    </S.HoverHint>
  );
}

/** Render as a flex sibling BELOW the map viewport, never over its route. */
export function RouteMapDetails({
  selection,
  isTouch,
  onClose,
}: {
  selection: RouteSelection | null;
  isTouch: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(!isTouch);
  const touchStartY = useRef<number | null>(null);
  // Desktop intentionally has no expanded details panel; only compact hover hints.
  if (!selection || !isTouch) return null;

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };
  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartY.current === null) return;
    const delta = event.changedTouches[0]?.clientY - touchStartY.current;
    touchStartY.current = null;
    if (delta === undefined) return;
    if (delta < -35) setExpanded(true);
    else if (delta > 35) setExpanded(false);
  };

  const stop = selection.kind === "stop" ? selection.stop : null;
  const route = selection.kind === "route" ? selection.route : null;
  const role =
    selection.kind === "stop"
      ? selection.total === 1
        ? "출발·도착"
        : selection.order === 1
          ? "출발지"
          : selection.order === selection.total
            ? "도착지"
            : "경유지"
      : "";
  const headline = stop
    ? `${selection.order}번 ${role} · ${stop.title}`
    : `${selection.order}구간 · ${route?.fromName || "출발"} → ${route?.toName || "도착"}`;
  const summary = stop
    ? stop.time
      ? `방문 예정 ${stop.time}`
      : "장소 정보"
    : route?.isFallback
      ? "실제 경로 조회 안 됨"
      : `${route?.transportLabel || modeName(route?.mode)} · ${distanceLabel(route?.distanceMeters)} · ${durationLabel(route?.durationSeconds)}`;
  const link = safeKakaoLink(stop?.externalUrl ?? route?.link);

  return (
    <S.DetailPanel
      $touch={isTouch}
      $expanded={expanded}
      aria-label="선택한 이동 구간 상세"
    >
      <S.DetailHeader>
        <S.TitleButton
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <span>
            {order}구간 · {route.fromName || "출발"} → {route.toName || "도착"}
          </span>
          {isTouch ? (
            <span aria-hidden="true">{expanded ? "⌄" : "⌃"}</span>
          ) : null}
        </S.TitleButton>
        <S.CloseButton type="button" onClick={onClose} aria-label="상세 닫기">
          ×
        </S.CloseButton>
      </S.DetailHeader>
      {expanded && (
        <S.DetailBody>
          {stop ? (
            <>
              {stop.time && (
                <div>
                  <strong>방문 예정</strong>
                  <span>{stop.time}</span>
                </div>
              )}
              {stop.category && (
                <div>
                  <strong>분류</strong>
                  <span>{stop.category}</span>
                </div>
              )}
              {stop.address && (
                <div>
                  <strong>주소</strong>
                  <span>{stop.address}</span>
                </div>
              )}
              <S.Description>
                {stop.description || "등록된 장소 설명이 없습니다."}
              </S.Description>
            </>
          ) : route ? (
            <>
              <div>
                <strong>이동 방식</strong>
                <span>{route.transportLabel || modeName(route.mode)}</span>
              </div>
              {route.isFallback ? (
                <S.Description>
                  방문 순서만 나타낸 직선 연결선입니다. 실제 도로
                  경로·거리·시간은 조회되지 않았습니다.
                </S.Description>
              ) : (
                <div>
                  <strong>거리 · 예상 시간</strong>
                  <span>
                    {distanceLabel(route.distanceMeters)} ·{" "}
                    {durationLabel(route.durationSeconds)}
                  </span>
                </div>
              )}
              {route.fromTime && (
                <div>
                  <strong>출발 예정</strong>
                  <span>{route.fromTime}</span>
                </div>
              )}
              {route.fromAddress && (
                <div>
                  <strong>출발지 주소</strong>
                  <span>{route.fromAddress}</span>
                </div>
              )}
              {route.fromDescription && (
                <S.Description>
                  <strong>출발 장소 설명</strong> · {route.fromDescription}
                </S.Description>
              )}
              {route.toTime && (
                <div>
                  <strong>도착 예정</strong>
                  <span>{route.toTime}</span>
                </div>
              )}
              {route.toAddress && (
                <div>
                  <strong>도착지 주소</strong>
                  <span>{route.toAddress}</span>
                </div>
              )}
              {route.toDescription && (
                <S.Description>
                  <strong>도착 장소 설명</strong> · {route.toDescription}
                </S.Description>
              )}
              {typeof route.transfers === "number" && (
                <div>
                  <strong>환승</strong>
                  <span>{route.transfers}회</span>
                </div>
              )}
              {typeof route.fareWon === "number" && (
                <div>
                  <strong>요금</strong>
                  <span>{route.fareWon.toLocaleString()}원</span>
                </div>
              )}
              {!route.isFallback && (
                <S.Disclaimer>
                  예상 이동 시간은 API 조회값이며 교통 상황에 따라 달라질 수
                  있습니다.
                </S.Disclaimer>
              )}
            </>
          ) : null}
          {link && (
            <S.ExternalLink
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              카카오맵에서 상세 보기
            </S.ExternalLink>
          )}
        </S.DetailBody>
      )}
    </S.DetailPanel>
  );
}

// ROUTY_COMPAT_EXPORTS_V2
/** Schedule 내부의 지도 SDK가 100% 크기를 갖도록 하는 뷰포트 */
export function MapViewport({
  children,
}: {
  children: import("react").ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 0,
      }}
    >
      {children}
    </div>
  );
}

/** 데스크톱에서 지도 경로/마커 위에 포인터를 올렸을 때 표시하는 안내 */
export function RouteHoverHint({
  selection,
}: {
  selection: RouteSelection | null;
}) {
  if (!selection) return null;
  const heading =
    selection.kind === "stop"
      ? String(selection.order) + "번 · " + selection.stop.title
      : (selection.route.fromName || "출발") +
        " → " +
        (selection.route.toName || "도착");
  const description =
    selection.kind === "stop"
      ? selection.stop.time || selection.stop.address || "등록된 장소"
      : "isFallback" in selection.route && selection.route.isFallback === true
        ? "방문 순서를 표시한 직선 안내선입니다. 실제 도로 경로가 아닙니다."
        : [
            modeName(selection.route.mode),
            distanceLabel(selection.route.distanceMeters),
            durationLabel(selection.route.durationSeconds),
          ].join(" · ");
  return (
    <div
      role="status"
      style={{
        position: "absolute",
        zIndex: 10,
        top: 12,
        left: 12,
        maxWidth: "min(360px, calc(100% - 24px))",
        pointerEvents: "none",
        border: "1px solid #D7E6E5",
        borderRadius: 10,
        background: "#FFF",
        boxShadow: "0 4px 14px #0002",
        padding: "10px 14px",
        color: "#0A414B",
        fontSize: 15,
      }}
    >
      <strong style={{ display: "block", marginBottom: 3 }}>{heading}</strong>
      <span>{description}</span>
    </div>
  );
}

type RoutyRouteStop = {
  id: string | number;
  title: string;
  lat?: number;
  lng?: number;
  time?: string;
  address?: string;
  description?: string;
};

/** 실제 API 경로를 먼저 매칭하고, 없으면 방문순서 안내 직선으로만 표시 (요금/시간은 추정하지 않음). */
export function buildDisplayRoutes(
  stops: RoutyRouteStop[],
  routePaths: RouteLine[] = [],
  mode: TravelMode = "walk",
): Array<RouteLine & { isFallback: boolean }> {
  const isValid = (s: RoutyRouteStop) =>
    typeof s.lat === "number" &&
    Number.isFinite(s.lat) &&
    typeof s.lng === "number" &&
    Number.isFinite(s.lng);
  const routes = routePaths.filter(
    (line) =>
      Array.isArray(line.path) &&
      line.path.length >= 2 &&
      (line.mode === undefined || line.mode === mode),
  );
  return stops.slice(0, -1).flatMap((from, idx) => {
    const to = stops[idx + 1];
    const order = idx + 1;
    // 다른 구간에 전용 경로를 잘못 적용하지 않도록 ID -> 순번 -> 전체 일치 순서를 사용합니다.
    const matched =
      routes.find(
        (line) =>
          line.fromId !== undefined &&
          line.toId !== undefined &&
          String(line.fromId) === String(from.id) &&
          String(line.toId) === String(to.id),
      ) ??
      routes.find(
        (line) =>
          line.fromId === undefined &&
          line.toId === undefined &&
          line.order === order,
      ) ??
      (routes.length === stops.length - 1 &&
      routes.every(
        (line) =>
          line.fromId === undefined &&
          line.toId === undefined &&
          line.order === undefined,
      )
        ? routes[idx]
        : undefined);
    if (!matched && (!isValid(from) || !isValid(to))) return [];
    const path: RoutePoint[] = matched
      ? matched.path
      : [
          { lat: from.lat!, lng: from.lng! },
          { lat: to.lat!, lng: to.lng! },
        ];
    return [
      {
        ...(matched ?? {}),
        path,
        isFallback: !matched,
        order,
        fromId: from.id,
        toId: to.id,
        fromName: from.title,
        toName: to.title,
        fromAddress: from.address,
        toAddress: to.address,
        fromDescription: from.description,
        toDescription: to.description,
        fromTime: from.time,
        toTime: to.time,
        mode: matched?.mode ?? mode,
      },
    ];
  });
}

/** 카카오 Polyline의 hover 상태 표시. 지도 SDK 인스턴스 형식과 충돌하지 않도록 구조적 타입 사용. */
export function setRouteLineHoverStyle(
  polyline: unknown,
  route: RouteLine & { isFallback?: boolean },
  hovered: boolean,
): void {
  const line = polyline as {
    setOptions?: (options: {
      strokeWeight: number;
      strokeOpacity: number;
    }) => void;
  } | null;
  if (!line || typeof line.setOptions !== "function") return;
  const normalWeight = route.isFallback ? 5 : 9;
  line.setOptions({
    strokeWeight: hovered ? normalWeight + 3 : normalWeight,
    strokeOpacity: hovered ? 1 : route.isFallback ? 0.7 : 0.92,
  });
}
// END_ROUTY_COMPAT_EXPORTS_V2

/**
 * 여러 지도에서 사용하는 제어 UI 래퍼입니다.
 * 내부 교통수단 선택기와 상세 패널은 자체적으로 absolute 위치를 사용하므로
 * 부모의 지도 크기나 클릭 처리에 영향을 주지 않도록 display: contents로 둡니다.
 */
export function MapDock({
  children,
  style,
  ...rest
}: import("react").HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} style={{ ...style, display: "contents" }}>
      {children}
    </div>
  );
}
