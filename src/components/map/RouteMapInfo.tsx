import { useEffect, useRef, useState, type TouchEvent } from "react";
import * as S from "./RouteMapInfoStyle";
export { MapDock, MapViewport } from "./RouteMapInfoStyle";

export type TravelMode = "walk" | "bike" | "car" | "transit";
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
  distanceMeters?: number;
  durationSeconds?: number;
  transfers?: number;
  fareWon?: number;
  link?: string | null;
  /** 안내용 직선 연결선: 실제 도로 경로/거리/시간이 아님 */
  isFallback?: boolean;
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
    id: number | string; title: string; time?: string; address?: string;
    description?: string; lat?: number; lng?: number;
  }>,
  routes: RouteLine[] = [],
  mode?: TravelMode,
): RouteLine[] {
  return stops.slice(1).flatMap((to, index) => {
    const from = stops[index];
    const order = index + 1;
    const matched = routes.find((route) =>
      route.order === order &&
      (route.fromId == null || String(route.fromId) === String(from.id)) &&
      (route.toId == null || String(route.toId) === String(to.id)),
    );
    const actual = matched && matched.path.length >= 2;
    const valid = (stop: typeof from) =>
      typeof stop.lat === "number" && Number.isFinite(stop.lat) &&
      typeof stop.lng === "number" && Number.isFinite(stop.lng);
    if (!actual && (!valid(from) || !valid(to))) return [];
    const path = actual ? matched.path : [
      { lat: from.lat!, lng: from.lng! },
      { lat: to.lat!, lng: to.lng! },
    ];
    return [{
      ...(actual ? matched : {}),
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
      mode: actual ? matched.mode ?? mode : mode,
      isFallback: !actual,
    }];
  });
}

export type RouteSelection =
  | { kind: "route"; route: RouteLine; order: number }
  | { kind: "stop"; stop: MapStopInfo; order: number; total: number };

const modes: { id: TravelMode; name: string }[] = [
  { id: "walk", name: "도보" },
  { id: "bike", name: "자전거" },
  { id: "car", name: "자동차" },
  { id: "transit", name: "대중교통" },
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
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return "시간 조회 안 됨";
  const min = Math.max(1, Math.ceil(seconds / 60));
  return min >= 60 ? `${Math.floor(min / 60)}시간 ${min % 60}분` : `${min}분`;
};

export const routeColor = (mode?: TravelMode) => {
  switch (mode) {
    case "walk": return "#167A75";
    case "bike": return "#2877A1";
    case "car": return "#A65A30";
    case "transit": return "#7148A7";
    default: return "#0A414B";
  }
};

/** PC 경로선 호버 강조: 색상과 두께만 변경하고 실제 경로 데이터는 유지합니다. */
export function setRouteLineHoverStyle(
  polyline: unknown,
  route: Pick<RouteLine, "mode" | "isFallback">,
  active: boolean,
) {
  // Kakao Maps Polyline.setOptions() is supported by the Web SDK.
  const target = polyline as {
    setOptions(options: {
      strokeColor: string;
      strokeWeight: number;
      strokeOpacity: number;
    }): void;
  };
  target.setOptions({
    strokeColor: active ? "#8B5CF6" : route.isFallback ? "#778D90" : routeColor(route.mode),
    strokeWeight: active ? (route.isFallback ? 8 : 12) : route.isFallback ? 5 : 9,
    strokeOpacity: active ? 1 : route.isFallback ? 0.7 : 0.92,
  });
}

/** For mouse use a compact tooltip; for touch use an expandable bottom drawer. */
export function useTouchMap() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: none) and (pointer: coarse)");
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
      {modes.map((item) => (
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
    return url.protocol === "https:" && url.hostname === "map.kakao.com" ? url.toString() : null;
  } catch { return null; }
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
      const x = Math.max(8, Math.min(event.clientX - bounds.left + 18, bounds.width - width - 8));
      const y = Math.max(8, Math.min(event.clientY - bounds.top + 18, bounds.height - height - 8));
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
        <strong>{selection.order}. {selection.stop.title}</strong>
        <span>{selection.stop.time ? `방문 ${selection.stop.time}` : "장소를 클릭하면 상세 설명을 볼 수 있어요"}</span>
      </S.HoverHint>
    );
  }
  const { route } = selection;
  return (
    <S.HoverHint ref={hintRef} role="status">
      <strong>{selection.order}구간 · {route.fromName || "출발"} → {route.toName || "도착"}</strong>
      <span>{modeName(route.mode)} · {route.isFallback ? "직선 연결 · 실제 경로 조회 안 됨" : `${distanceLabel(route.distanceMeters)} · ${durationLabel(route.durationSeconds)}`}</span>
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
  const role = selection.kind === "stop"
    ? selection.total === 1 ? "출발·도착" : selection.order === 1 ? "출발지" : selection.order === selection.total ? "도착지" : "경유지"
    : "";
  const headline = stop
    ? `${selection.order}번 ${role} · ${stop.title}`
    : `${selection.order}구간 · ${route?.fromName || "출발"} → ${route?.toName || "도착"}`;
  const summary = stop
    ? stop.time ? `방문 예정 ${stop.time}` : "장소 정보"
    : route?.isFallback ? "실제 경로 조회 안 됨"
    : `${modeName(route?.mode)} · ${distanceLabel(route?.distanceMeters)} · ${durationLabel(route?.durationSeconds)}`;
  const link = safeKakaoLink(stop?.externalUrl ?? route?.link);

  return (
    <S.DetailPanel
      $touch={isTouch}
      $expanded={expanded}
      aria-label={stop ? "선택한 일정 장소 상세" : "선택한 이동 구간 상세"}
      onTouchStart={isTouch ? onTouchStart : undefined}
      onTouchEnd={isTouch ? onTouchEnd : undefined}
    >
      {isTouch && <S.DrawerHandle aria-hidden="true" />}
      <S.DetailHeader>
        <S.TitleButton type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
          <strong>{headline}</strong>
          <span>{summary}</span>
          <S.ExpandIndicator aria-hidden="true">{expanded ? "⌄" : "⌃"}</S.ExpandIndicator>
        </S.TitleButton>
        <S.CloseButton type="button" onClick={onClose} aria-label="상세 닫기">×</S.CloseButton>
      </S.DetailHeader>
      {expanded && (
        <S.DetailBody>
          {stop ? (
            <>
              {stop.time && <div><strong>방문 예정</strong><span>{stop.time}</span></div>}
              {stop.category && <div><strong>분류</strong><span>{stop.category}</span></div>}
              {stop.address && <div><strong>주소</strong><span>{stop.address}</span></div>}
              <S.Description>{stop.description || "등록된 장소 설명이 없습니다."}</S.Description>
            </>
          ) : route ? (
            <>
              <div><strong>이동 방식</strong><span>{modeName(route.mode)}</span></div>
              {route.isFallback ? (
                <S.Description>방문 순서만 나타낸 직선 연결선입니다. 실제 도로 경로·거리·시간은 조회되지 않았습니다.</S.Description>
              ) : (
                <div><strong>거리 · 예상 시간</strong><span>{distanceLabel(route.distanceMeters)} · {durationLabel(route.durationSeconds)}</span></div>
              )}
              {route.fromTime && <div><strong>출발 예정</strong><span>{route.fromTime}</span></div>}
              {route.fromAddress && <div><strong>출발지 주소</strong><span>{route.fromAddress}</span></div>}
              {route.fromDescription && <S.Description><strong>출발 장소 설명</strong> · {route.fromDescription}</S.Description>}
              {route.toTime && <div><strong>도착 예정</strong><span>{route.toTime}</span></div>}
              {route.toAddress && <div><strong>도착지 주소</strong><span>{route.toAddress}</span></div>}
              {route.toDescription && <S.Description><strong>도착 장소 설명</strong> · {route.toDescription}</S.Description>}
              {typeof route.transfers === "number" && <div><strong>환승</strong><span>{route.transfers}회</span></div>}
              {typeof route.fareWon === "number" && <div><strong>요금</strong><span>{route.fareWon.toLocaleString()}원</span></div>}
              {!route.isFallback && <S.Disclaimer>예상 이동 시간은 API 조회값이며 교통 상황에 따라 달라질 수 있습니다.</S.Disclaimer>}
            </>
          ) : null}
          {link && <S.ExternalLink href={link} target="_blank" rel="noopener noreferrer">카카오맵에서 상세 보기</S.ExternalLink>}
        </S.DetailBody>
      )}
    </S.DetailPanel>
  );
}
