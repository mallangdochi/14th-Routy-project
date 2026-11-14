import { useEffect, useMemo, useState } from "react";
import type { RouteLine } from "../components/map/RouteMapInfo";
import { resolveScheduleTransport, type TransportChoice } from "../utils/scheduleTransport";

export type ScheduleRouteStop = {
  id: number; title: string; time?: string; address?: string; description?: string;
  transport?: string | null; lat?: number; lng?: number;
};
export type ScheduleLeg = {
  key: string; from: ScheduleRouteStop; to: ScheduleRouteStop; order: number;
  choice: TransportChoice;
  status: "loading" | "ready" | "error" | "unsupported";
  route?: RouteLine; error?: string;
};
type RouteResponse = {
  mode: string; path: Array<{ lat: number; lng: number }>;
  distanceMeters: number; durationSeconds: number; link?: string | null;
  transfers?: number; fareWon?: number; taxiFareWon?: number; transitSteps?: string[];
};
const TTL = 120_000;
const cache = new Map<string, { expires: number; data: RouteResponse }>();
const validPoint = (p: { lat?: number; lng?: number }) =>
  typeof p.lat === "number" && Number.isFinite(p.lat) && p.lat >= 33 && p.lat <= 43 &&
  typeof p.lng === "number" && Number.isFinite(p.lng) && p.lng >= 124 && p.lng <= 132;

async function fetchLeg(leg: ScheduleLeg, signal: AbortSignal): Promise<RouteResponse> {
  const { from, to, choice } = leg;
  const key = `${choice.mode}|${choice.transitType ?? ""}|${from.lat},${from.lng}|${to.lat},${to.lng}`;
  const found = cache.get(key);
  if (found && found.expires > Date.now()) return found.data;
  const params = new URLSearchParams({
    mode: choice.mode!, fromLat: String(from.lat), fromLng: String(from.lng),
    toLat: String(to.lat), toLng: String(to.lng),
    ...(choice.transitType ? { transitType: choice.transitType } : {}),
  });
  const response = await fetch(`/api/travel/route?${params}`, { signal });
  const raw = await response.json().catch(() => null);
  if (!response.ok) throw new Error(raw?.message || "이동 경로 조회 실패");
  if (!raw || raw.mode !== choice.mode || !Number.isFinite(raw.distanceMeters) || raw.distanceMeters < 0 ||
      !Number.isFinite(raw.durationSeconds) || raw.durationSeconds < 0 || !Array.isArray(raw.path) ||
      !raw.path.every((point: { lat?: number; lng?: number }) => point && validPoint(point))) {
    throw new Error("경로 응답 형식이 올바르지 않습니다.");
  }
  const data: RouteResponse = {
    ...raw,
    taxiFareWon: typeof raw.taxiFareWon === "number" && Number.isFinite(raw.taxiFareWon) && raw.taxiFareWon >= 0 ? raw.taxiFareWon : undefined,
    transitSteps: Array.isArray(raw.transitSteps) ? raw.transitSteps.filter((step: unknown): step is string => step === "버스" || step === "지하철") : undefined,
  };
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  if (cache.size >= 300) cache.delete(cache.keys().next().value!);
  cache.set(key, { expires: Date.now() + TTL, data });
  return data;
}

/** Shared result for the map and cards; state is tagged so an old day's response never leaks into a new day. */
export function useScheduleRoutes(stops: ScheduleRouteStop[], defaultTransport: string | null | undefined, scope: string) {
  const signature = JSON.stringify([scope, defaultTransport, stops.map(s => [s.id, s.title, s.time, s.address, s.description, s.lat, s.lng, s.transport])]);
  const initial = useMemo<ScheduleLeg[]>(() => {
    const [, defaultValue, values] = JSON.parse(signature) as [string, string | null, Array<[number, string, string?, string?, string?, number?, number?, string?]>];
    const input = values.map(([id, title, time, address, description, lat, lng, transport]) => ({ id, title, time, address, description, lat, lng, transport }));
    return input.slice(1).map((to, i) => {
      const from = input[i];
      const choice = resolveScheduleTransport(from.transport, defaultValue);
      const unsupported = !choice.mode;
      const missing = !validPoint(from) || !validPoint(to);
      return {
        key: `${from.id}:${to.id}:${i}`, order: i + 1, from, to, choice,
        status: unsupported ? "unsupported" : missing ? "error" : "loading",
        error: unsupported ? "경로 조회 미지원" : missing ? "장소 좌표 확인 필요" : undefined,
      };
    });
  }, [signature]);
  const [snapshot, setSnapshot] = useState<{ signature: string; legs: ScheduleLeg[] } | null>(null);
  const [retryVersion, setRetryVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    void (async () => {
      const next = initial.map(leg => ({ ...leg }));
      // Start inside the async job, never synchronously set state in an effect.
      await Promise.resolve();
      if (!active) return;
      setSnapshot({ signature, legs: [...next] });
      for (let start = 0; start < next.length; start += 3) {
        await Promise.all(next.slice(start, start + 3).map(async (leg, offset) => {
          if (leg.status !== "loading" || !active) return;
          const index = start + offset;
          try {
            const data = await fetchLeg(leg, controller.signal);
            const route: RouteLine = {
              ...data, mode: leg.choice.mode, transportLabel: leg.choice.label,
              order: leg.order, fromId: leg.from.id, toId: leg.to.id,
              fromName: leg.from.title, toName: leg.to.title,
              fromTime: leg.from.time, toTime: leg.to.time,
              fromAddress: leg.from.address, toAddress: leg.to.address,
              fromDescription: leg.from.description, toDescription: leg.to.description,
            };
            next[index] = { ...leg, status: "ready", route };
          } catch (error) {
            if (active) next[index] = { ...leg, status: "error", error: error instanceof Error ? error.message : "경로 조회 실패" };
          }
        }));
        if (!active) return;
        setSnapshot({ signature, legs: [...next] });
      }
    })();
    return () => { active = false; controller.abort(); };
  }, [signature, initial, retryVersion]);
  const legs = snapshot?.signature === signature ? snapshot.legs : initial;
  const routes = useMemo<RouteLine[]>(() => legs.map(leg => leg.route ?? ({
    path: [], order: leg.order, fromId: leg.from.id, toId: leg.to.id,
    mode: leg.choice.mode, transportLabel: leg.choice.label, error: leg.error,
    isFallback: true,
  })), [legs]);
  return { legs, routes, retry: () => setRetryVersion(v => v + 1) };
}
