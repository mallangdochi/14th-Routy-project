/* eslint-disable react-refresh/only-export-components -- 기존 import 호환을 위해 지도 컴포넌트와 공용 유틸을 한 파일에서 내보냅니다. */
import { useEffect, useLayoutEffect, useRef, useState, type TouchEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { CarFront, BusFront, TramFront, Bike, Footprints, MapPin } from "lucide-react";
import * as S from "./RouteMapInfoStyle";

export type TravelMode = "walk" | "bike" | "car" | "bus" | "subway" | "transit";
export type RoutePoint = { lat: number; lng: number };
export type RouteLine = {
  path: RoutePoint[];
  /** 직선 안내 경로 여부 (실제 경로 API 조회 실패·누락 시 true). */
  isFallback?: boolean;
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
  taxiFareWon?: number;
  transitSteps?: string[];
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
    const actual = matched && !matched.isFallback && matched.path.length >= 2 &&
      matched.path.every(point => Number.isFinite(point.lat) && Number.isFinite(point.lng));
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
  { id: "transit", name: "대중교통(혼합)" },
];

export const modeName = (mode?: TravelMode) =>
  modes.find((m) => m.id === mode)?.name ?? "이동수단 미설정";

export const distanceLabel = (meters?: number) =>
  typeof meters === "number" && Number.isFinite(meters) && meters >= 0
    ? meters >= 1000
      ? `${(meters / 1000).toFixed(1)}km`
      : `${Math.round(meters)}m`
    : "거리 조회 안 됨";

export const durationLabel = (seconds?: number) => {
  if (typeof seconds !== "number" || (!Number.isFinite(seconds) || seconds < 0))
    return "시간 조회 안 됨";
  const min = Math.max(1, Math.ceil(seconds / 60));
  return min >= 60 ? `${Math.floor(min / 60)}시간 ${min % 60}분` : `${min}분`;
};

// Preserve the existing call signature while using one color for every transport mode.
export const routeColor = (mode?: TravelMode) => {
  void mode;
  return "#0D5C52";
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
  if (!target || typeof target.setOptions !== "function") return;
  target.setOptions({
    strokeColor: active ? "#EB654B" : routeColor(route.mode),
    strokeWeight: active ? (route.isFallback ? 8 : 12) : route.isFallback ? 5 : 9,
    strokeOpacity: active ? 1 : route.isFallback ? 0.7 : 0.92,
  });
}

/** 호버 지원 여부에 따라 지도 팝업의 마우스/터치 동작을 구분합니다. */
export function useTouchMap() {
  const [isTouch, setIsTouch] = useState(() => typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches);
  useEffect(() => {
    const query = window.matchMedia("(hover: hover)");
    const update = () => setIsTouch(!query.matches);
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

/** Content shared by mouse hover and accessible route details. No guessed fare values. */
export function getRouteHoverRows(route: RouteLine): Array<{ label: string; value: string }> {
  if (route.isFallback) return [{ label: "경로 정보", value: "실제 경로 조회 안 됨" }];
  const rows = [
    { label: "이동거리", value: typeof route.distanceMeters === "number" && route.distanceMeters >= 0 ? distanceLabel(route.distanceMeters) : "거리 조회 안 됨" },
    { label: "예상 이동시간", value: typeof route.durationSeconds === "number" && Number.isFinite(route.durationSeconds) && route.durationSeconds >= 0 ? `약 ${durationLabel(route.durationSeconds)}` : "시간 조회 안 됨" },
  ];
  const money = (n: number | undefined) => typeof n === "number" && Number.isFinite(n) && n >= 0;
  if (route.mode === "transit" || route.mode === "bus" || route.mode === "subway") {
    rows.push({ label: "환승", value: typeof route.transfers === "number" && Number.isFinite(route.transfers) && route.transfers >= 0 ? `${route.transfers}회` : "조회 정보 없음" });
    if (money(route.fareWon)) rows.push({ label: "예상 교통요금", value: `약 ${route.fareWon!.toLocaleString("ko-KR")}원` });
  } else if (route.mode === "car") {
    rows.push({ label: "예상 택시비", value: money(route.taxiFareWon) ? `약 ${route.taxiFareWon!.toLocaleString("ko-KR")}원` : "조회 정보 없음" });
  }
  return rows;
}

function placeRouteHint(element: HTMLDivElement, pointer: { x: number; y: number } | null) {
  const viewport = element.parentElement;
  if (!viewport) return;
  const bounds = viewport.getBoundingClientRect();
  const width = element.offsetWidth || 300, height = element.offsetHeight || 230;
  let x = pointer ? pointer.x - bounds.left + 18 : 12;
  let y = pointer ? pointer.y - bounds.top + 18 : 12;
  if (x + width > bounds.width - 8 && pointer) x = pointer.x - bounds.left - width - 18;
  if (y + height > bounds.height - 8 && pointer) y = pointer.y - bounds.top - height - 18;
  element.style.left = `${Math.max(8, Math.min(x, bounds.width - width - 8))}px`;
  element.style.top = `${Math.max(8, Math.min(y, bounds.height - height - 8))}px`;
  element.style.visibility = "visible";
}

/** A single-route tooltip. Leg badges and direction arrows stay on the map. */
export function RouteHoverHint({ selection, onDismiss }: { selection: RouteSelection | null; onDismiss?: () => void }) {
  const hintRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.target instanceof window.Node && hintRef.current?.contains(event.target)) return;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      if (hintRef.current) placeRouteHint(hintRef.current, pointerRef.current);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true, capture: true });
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", move, true); };
  }, []);
  useLayoutEffect(() => {
    if (hintRef.current) placeRouteHint(hintRef.current, pointerRef.current);
  }, [selection]);
  if (!selection) return null;
  if (selection.kind === "stop") return null;
  const route = selection.route;
  const rows = getRouteHoverRows(route);
  const transport = route.transportLabel || modeName(route.mode);
  const taxi = route.mode === "car";
  const steps = !route.isFallback && (route.mode === "transit" || route.mode === "bus" || route.mode === "subway") ? (Array.isArray(route.transitSteps) ? route.transitSteps : []).filter(step => step === "버스" || step === "지하철").join(" → ") : "";
  return (
    <S.HoverHint
      ref={hintRef}
      role={onDismiss ? "dialog" : "tooltip"}
      onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => { if (event.key === "Escape") onDismiss?.(); }}
      aria-label={`${route.fromName || "출발"}에서 ${route.toName || "도착"}까지 이동 정보`}
      style={{ position: "absolute", width: 300, maxWidth: "calc(100% - 16px)", maxHeight: "calc(100% - 16px)", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10, padding: 16, border: "1px solid #DCE6E3", borderRadius: 12, background: "#FFFFFF", color: "#0D3E41", boxShadow: "0 4px 18px rgba(13,62,65,.16)", whiteSpace: "normal", overflowWrap: "anywhere", pointerEvents: onDismiss ? "auto" : "none", visibility: "hidden", zIndex: 30 }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <strong style={{ flex: 1, fontSize: 16, lineHeight: 1.5 }}>{route.fromName || "출발"} → {route.toName || "도착"}</strong>
        {onDismiss && <button type="button" onClick={onDismiss} aria-label="이동 정보 닫기" style={{ border: 0, background: "transparent", color: "#0D3E41", fontSize: 20, padding: "0 4px", minWidth: 28, minHeight: 28, cursor: "pointer" }}>×</button>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14 }}>
        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", gap: 3, flex: "0 0 auto" }}>
          {route.mode === "bus" ? <BusFront size={18} /> : route.mode === "subway" ? <TramFront size={18} /> : route.mode === "transit" ? transport === "버스" ? <BusFront size={18} /> : transport === "지하철" ? <TramFront size={18} /> : <><TramFront size={18} /><BusFront size={18} /></> : route.mode === "car" ? <CarFront size={18} /> : route.mode === "bike" ? <Bike size={18} /> : route.mode === "walk" ? <Footprints size={18} /> : <MapPin size={18} />}
        </span>
        {transport}
      </div>
      <dl style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", alignItems: "start", columnGap: 12, rowGap: 8, borderTop: "1px solid #E2E6E9", paddingTop: 10, margin: 0, fontSize: 14, lineHeight: 1.5 }}>
        {rows.map(row => <div key={row.label} style={{ display: "contents" }}><dt style={{ margin: 0 }}>{row.label}</dt><dd style={{ margin: 0, textAlign: "right", fontWeight: 600 }}>{row.value}</dd></div>)}
      </dl>
      {(steps || taxi || route.isFallback) && <div style={{ borderTop: "1px solid #E2E6E9", paddingTop: 8, color: "#596D75", fontSize: 12, lineHeight: 1.5 }}>
        {route.isFallback ? route.error || "방문 순서만 나타내는 직선 연결선입니다." : taxi ? "교통 상황과 요금제에 따라 달라질 수 있어요." : steps}
      </div>}
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
  // 기존 호출부 호환용 패널입니다. 데스크톱은 RouteHoverHint를 사용합니다.
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
  const link = safeKakaoLink(stop?.externalUrl ?? route?.link);

  return (
    <S.DetailPanel
      $touch={isTouch}
      $expanded={expanded}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label={stop ? "선택한 일정 장소 상세" : "선택한 이동 구간 상세"}
    >
      <S.DetailHeader>
        <S.TitleButton
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <span>{headline}</span>
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
              {getRouteHoverRows(route).filter(row => row.label !== "이동거리" && row.label !== "예상 이동시간" && row.label !== "경로 정보").map(row => <div key={row.label}><strong>{row.label}</strong><span>{row.value}</span></div>)}
              {!route.isFallback && <S.Disclaimer>예상 이동 시간은 API 조회값이며 교통 상황에 따라 달라질 수 있습니다.</S.Disclaimer>}
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
