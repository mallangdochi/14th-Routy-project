import { useEffect, useMemo, useState } from "react";
import { Bike, BusFront, CarFront, Footprints, Route, TramFront } from "lucide-react";
import * as S from "./TravelRouteSummaryStyle";

import type { TravelMode, RoutePoint, RouteLine } from "../map/RouteMapInfo";
export type { TravelMode, RouteLine } from "../map/RouteMapInfo";
export type RouteStop = { id: number; title: string; time?: string; address?: string; description?: string; lat?: number; lng?: number };
export type TravelRouteData = {
  mode: TravelMode;
  distanceMeters: number;
  durationSeconds: number;
  path: RoutePoint[];
  link: string | null;
  transfers?: number;
  fareWon?: number;
};

type LegStatus = {
  id: string;
  from: RouteStop;
  to: RouteStop;
  data?: TravelRouteData;
  error?: string;
};

const modes = [
  { id: "walk", label: "도보", Icon: Footprints },
  { id: "bike", label: "자전거", Icon: Bike },
  { id: "car", label: "자동차", Icon: CarFront },
  { id: "bus", label: "버스", Icon: BusFront },
  { id: "subway", label: "지하철", Icon: TramFront },
] as const;
const routeCache = new Map<string, TravelRouteData>();
const valid = (stop: RouteStop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng) &&
  stop.lat! >= 33 && stop.lat! <= 43 && stop.lng! >= 124 && stop.lng! <= 132;

function distanceText(meters: number) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${Math.round(meters)}m`;
}
function durationText(seconds: number) {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}시간 ${minutes % 60 ? `${minutes % 60}분` : ""}` : `${minutes}분`;
}

async function fetchOne(from: RouteStop, to: RouteStop, mode: TravelMode, signal: AbortSignal) {
  const key = `${mode}|${from.lat},${from.lng}|${to.lat},${to.lng}`;
  const existing = routeCache.get(key);
  if (existing) return existing;
  const query = new URLSearchParams({
    mode,
    fromLat: String(from.lat), fromLng: String(from.lng),
    toLat: String(to.lat), toLng: String(to.lng),
  });
  const response = await fetch(`/api/travel/route?${query}`, { signal });
  const result = await response.json() as TravelRouteData & { message?: string };
  if (!response.ok) throw new Error(result.message || "이동 경로를 조회할 수 없습니다.");
  if (!Number.isFinite(result.distanceMeters) || !Number.isFinite(result.durationSeconds)) {
    throw new Error("경로 정보 형식이 올바르지 않습니다.");
  }
  routeCache.set(key, result);
  return result;
}

export default function TravelRouteSummary({ stops, onRoutesReady, mode: controlledMode, onModeChange }: {
  stops: RouteStop[];
  onRoutesReady: (routes: RouteLine[]) => void;
  mode?: TravelMode;
  onModeChange?: (mode: TravelMode) => void;
}) {
  const [localMode, setLocalMode] = useState<TravelMode>("walk");
  const mode = controlledMode ?? localMode;
  const setMode = (next: TravelMode) => {
    if (controlledMode === undefined) setLocalMode(next);
    onModeChange?.(next);
  };
  const [results, setResults] = useState<LegStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const legs = useMemo(() => stops.slice(1).map((to, i) => ({
    id: `${stops[i].id}-${to.id}`,
    from: stops[i], to,
  })), [stops]);

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;
    const initial: LegStatus[] = legs.map((leg) => ({
      ...leg,
      ...(!valid(leg.from) || !valid(leg.to) ? { error: "장소 좌표 없음 · 지도에서 다시 추가해 주세요." } : {}),
    }));
    setResults(initial);
    onRoutesReady([]);
    if (!legs.length) { setLoading(false); return () => controller.abort(); }
    setLoading(true);
    // 동시에 수십 건을 호출하지 않도록 3개씩 처리합니다.
    void (async () => {
      const next = [...initial];
      for (let start = 0; start < legs.length; start += 3) {
        if (controller.signal.aborted) break;
        const batch = legs.slice(start, start + 3);
        await Promise.all(batch.map(async (leg, idx) => {
          const index = start + idx;
          if (next[index].error) return;
          try {
            next[index] = { ...leg, data: await fetchOne(leg.from, leg.to, mode, controller.signal) };
          } catch (error) {
            if (!controller.signal.aborted) next[index] = {
              ...leg, error: error instanceof Error ? error.message : "경로 조회 실패",
            };
          }
        }));
        if (!alive) return;
        setResults([...next]);
        onRoutesReady(next.flatMap((leg, index): RouteLine[] => {
          if (!leg.data?.path || leg.data.path.length < 2) return [];
          return [{
            path: leg.data.path,
            order: index + 1,
            fromId: leg.from.id,
            toId: leg.to.id,
            fromName: leg.from.title,
            toName: leg.to.title,
            fromAddress: leg.from.address,
            toAddress: leg.to.address,
            fromDescription: leg.from.description,
            toDescription: leg.to.description,
            fromTime: leg.from.time,
            toTime: leg.to.time,
            mode: leg.data.mode ?? mode,
            distanceMeters: leg.data.distanceMeters,
            durationSeconds: leg.data.durationSeconds,
            link: leg.data.link,
            transfers: leg.data.transfers,
            fareWon: leg.data.fareWon,
          }];
        }));
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; controller.abort(); };
  }, [legs, mode, onRoutesReady]);

  const successful = results.flatMap((leg) => leg.data ? [leg.data] : []);
  const totalDistance = successful.reduce((sum, item) => sum + item.distanceMeters, 0);
  const totalSeconds = successful.reduce((sum, item) => sum + item.durationSeconds, 0);
  const missing = results.length - successful.length;

  return (
    <S.Panel aria-label="교통수단별 이동 경로 및 시간">
      <S.Heading><Route size={21}/><strong>이동 거리 · 예상 시간</strong><span>선택한 Day의 장소 순서 기준</span></S.Heading>
      <S.Modes role="group" aria-label="교통수단 선택">
        {modes.map(({ id, label, Icon }) => (
          <S.ModeButton key={id} type="button" $active={mode === id} aria-pressed={mode === id}
            onClick={() => setMode(id)}><Icon size={17}/>{label}</S.ModeButton>
        ))}
      </S.Modes>
      {legs.length === 0 ? <S.Notice>장소를 2개 이상 추가하면 이동 경로와 시간이 표시됩니다.</S.Notice> : (
        <>
          <S.Total>
            {loading ? "경로 계산 중…" : successful.length > 0 ? `조회된 ${successful.length}구간 합계 · ${distanceText(totalDistance)} · ${durationText(totalSeconds)}` : "경로 조회 결과 없음"}
            {missing > 0 && <small>전체 {legs.length}구간 중 {missing}구간 미조회</small>}
          </S.Total>
          <S.Legs>
            {results.map((leg) => (
              <S.Leg key={leg.id}>
                <S.LegName><strong>{leg.from.title} → {leg.to.title}</strong><span>{modes.find((item) => item.id === mode)?.label}</span></S.LegName>
                <S.Metric>
                  {leg.data ? `${distanceText(leg.data.distanceMeters)} · ${durationText(leg.data.durationSeconds)}` :
                    leg.error ? leg.error : "조회 중…"}
                  {leg.data?.transfers !== undefined && ` · 환승 ${leg.data.transfers}회`}
                  {leg.data?.fareWon !== undefined && ` · ${leg.data.fareWon.toLocaleString()}원`}
                  {leg.data?.link && <a href={leg.data.link} target="_blank" rel="noopener noreferrer">카카오맵 보기</a>}
                </S.Metric>
              </S.Leg>
            ))}
          </S.Legs>
          <S.Notice>거리와 시간은 카카오 경로 API 조회값입니다. 교통 상황, 대기 및 운영 시간에 따라 실제 이동 시간은 달라집니다. 경로 조회에 실패한 구간은 합계에 포함하지 않습니다.</S.Notice>
        </>
      )}
    </S.Panel>
  );
}
