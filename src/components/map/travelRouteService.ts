/** 카카오 경로 API는 서버에서만 호출합니다. REST API 키를 브라우저에 공개하지 않습니다. */
export type TravelMode = "walk" | "bike" | "car" | "transit";
export type TransitType = "all" | "bus" | "subway";
export type TravelPoint = { lat: number; lng: number };
export type TravelRoute = {
  mode: TravelMode;
  distanceMeters: number;
  durationSeconds: number;
  path: TravelPoint[];
  link: string | null;
  transfers?: number;
  fareWon?: number;
  taxiFareWon?: number;
  transitSteps?: string[];
};

export function validPoint(point: TravelPoint): boolean {
  return (
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lng) &&
    point.lat >= 33 &&
    point.lat <= 43 &&
    point.lng >= 124 &&
    point.lng <= 132
  );
}

export function validMode(mode: string): mode is TravelMode {
  return ["walk", "bike", "car", "transit"].includes(mode);
}

function safePath(points: unknown): TravelPoint[] {
  if (!Array.isArray(points)) return [];
  const result: TravelPoint[] = [];
  for (const pair of points) {
    if (!Array.isArray(pair)) continue;
    const lng = Number(pair[0]);
    const lat = Number(pair[1]);
    if (validPoint({ lat, lng })) result.push({ lat, lng });
  }
  // 큰 응답이 지도 렌더링을 느리게 만들지 않도록 정점 수 제한
  if (result.length <= 1800) return result;
  const step = Math.ceil(result.length / 1800);
  return result.filter(
    (_, index) => index % step === 0 || index === result.length - 1,
  );
}

function safeLink(input: unknown): string | null {
  if (typeof input !== "string") return null;
  try {
    const link = new URL(input);
    return link.protocol === "https:" && link.hostname === "map.kakao.com"
      ? link.toString()
      : null;
  } catch {
    return null;
  }
}

type JsonRecord = Record<string, unknown>;
function obj(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}
function items(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
function positive(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : NaN;
}
function collectPoints(steps: unknown[]): TravelPoint[] {
  const points: TravelPoint[] = [];
  for (const step of steps) {
    points.push(...safePath(obj(obj(step).path).points));
  }
  // 다른 단계가 많을 때도 결과 제한
  if (points.length <= 1800) return points;
  const skip = Math.ceil(points.length / 1800);
  return points.filter((_, i) => i % skip === 0 || i === points.length - 1);
}

export function parseKakaoRoute(mode: TravelMode, data: unknown, transitType: TransitType = "all"): TravelRoute {
  const root = obj(data);
  let distanceMeters: number;
  let durationSeconds: number;
  let path: TravelPoint[] = [];
  let link: string | null = null;
  let transfers: number | undefined;
  let fareWon: number | undefined;
  let taxiFareWon: number | undefined;
  let transitSteps: string[] | undefined;

  if (mode === "car") {
    const route = obj(items(root.routes)[0]);
    if (route.result_code !== 0)
      throw new Error("자동차 경로를 찾을 수 없습니다.");
    const summary = obj(route.summary);
    distanceMeters = positive(summary.distance);
    durationSeconds = positive(summary.duration);
    const taxiFare = positive(obj(summary.fare).taxi);
    if (Number.isFinite(taxiFare)) taxiFareWon = taxiFare;
    for (const section of items(route.sections)) {
      for (const road of items(obj(section).roads)) {
        const vertexes = obj(road).vertexes;
        if (!Array.isArray(vertexes)) continue;
        const segment: unknown[] = [];
        for (let i = 0; i < vertexes.length - 1; i += 2)
          segment.push([vertexes[i], vertexes[i + 1]]);
        path.push(...safePath(segment));
      }
    }
  } else if (mode === "transit") {
    if (root.status !== "OK")
      throw new Error("대중교통 경로를 찾을 수 없습니다.");
    const routes = items(root.routes).map(obj);
    const candidate = routes
      .filter((route) => {
        const properties = obj(route.properties);
        if (!Number.isFinite(positive(properties.totalTime)) || !Number.isFinite(positive(properties.totalDistance))) return false;
        const types = items(route.steps).map(step => obj(obj(step).properties).type);
        if (transitType === "bus") {
          return properties.type === "BUS" && types.length > 0 && types.includes("BUS") &&
            types.every(type => type === "BUS" || type === "WALKING");
        }
        if (transitType === "subway") {
          return properties.type === "SUBWAY" && types.length > 0 && types.includes("SUBWAY") &&
            types.every(type => type === "SUBWAY" || type === "WALKING");
        }
        return ["BUS", "SUBWAY", "BUS_AND_SUBWAY"].includes(String(properties.type));
      })
      .sort(
        (a, b) =>
          Number(obj(a.properties).totalTime) -
          Number(obj(b.properties).totalTime),
      )[0];
    if (!candidate) throw new Error(transitType === "bus" ? "버스만 이용하는 경로가 없습니다." : transitType === "subway" ? "지하철만 이용하는 경로가 없습니다." : "대중교통 경로를 찾을 수 없습니다.");
    const properties = obj(candidate.properties);
    distanceMeters = positive(properties.totalDistance);
    durationSeconds = positive(properties.totalTime);
    const transferCount = positive(properties.transfers);
    if (Number.isFinite(transferCount)) transfers = transferCount;
    const fare = positive(obj(properties.fare).value);
    if (Number.isFinite(fare)) fareWon = fare;
    transitSteps = items(candidate.steps).flatMap(step => {
      const type = obj(obj(step).properties).type;
      return type === "BUS" ? ["버스"] : type === "SUBWAY" ? ["지하철"] : [];
    });
    path = collectPoints(items(candidate.steps));
    link = safeLink(obj(root.properties).landingURL);
  } else {
    if (root.status !== "OK")
      throw new Error(
        `${mode === "walk" ? "도보" : "자전거"} 경로를 찾을 수 없습니다.`,
      );
    const route = obj(root.route);
    const properties = obj(route.properties);
    distanceMeters = positive(properties.totalDistance);
    durationSeconds = positive(properties.totalTime);
    link = safeLink(properties.landingUrl);
    for (const leg of items(route.legs)) {
      path.push(...collectPoints(items(obj(leg).steps)));
    }
  }
  if (!Number.isFinite(distanceMeters) || !Number.isFinite(durationSeconds)) {
    throw new Error("경로 거리 또는 시간 정보가 없습니다.");
  }
  if (path.length > 1800) {
    const step = Math.ceil(path.length / 1800);
    path = path.filter((_, i) => i % step === 0 || i === path.length - 1);
  }
  return {
    mode,
    distanceMeters,
    durationSeconds,
    path,
    link,
    ...(transfers !== undefined ? { transfers } : {}),
    ...(fareWon !== undefined ? { fareWon } : {}),
    ...(taxiFareWon !== undefined ? { taxiFareWon } : {}),
    ...(transitSteps?.length ? { transitSteps } : {}),
  };
}

export async function lookupTravelRoute(
  mode: TravelMode,
  from: TravelPoint,
  to: TravelPoint,
  transitType: TransitType = "all",
): Promise<TravelRoute> {
  const runtime = globalThis as typeof globalThis & {
    process?: {
      env?: Record<string, string | undefined>;
    };
  };
  const key = runtime.process?.env?.KAKAO_REST_API_KEY?.trim();
  if (!key) throw new Error("서버에 KAKAO_REST_API_KEY를 설정해야 합니다.");
  if (!validPoint(from) || !validPoint(to))
    throw new Error("국내 장소의 정확한 위도·경도가 필요합니다.");
  const isCar = mode === "car";
  const url = new URL(
    isCar
      ? "https://apis-navi.kakaomobility.com/v1/directions"
      : `https://dapi.kakao.com/v2/routing/${mode === "walk" ? "walk" : mode === "bike" ? "bicycle" : "publictraffic"}`,
  );
  if (isCar) {
    url.searchParams.set("origin", `${from.lng},${from.lat}`);
    url.searchParams.set("destination", `${to.lng},${to.lat}`);
    url.searchParams.set("priority", "RECOMMEND");
    url.searchParams.set("summary", "false");
  } else {
    url.searchParams.set("start_x", String(from.lng));
    url.searchParams.set("start_y", String(from.lat));
    url.searchParams.set("end_x", String(to.lng));
    url.searchParams.set("end_y", String(to.lat));
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(url, {
      headers: { Authorization: `KakaoAK ${key}`, Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403)
        throw new Error(
          "카카오 REST API 키 또는 경로 API 사용 권한을 확인해 주세요.",
        );
      if (response.status === 429)
        throw new Error("카카오 API 호출 한도에 도달했습니다.");
      throw new Error(`카카오 경로 조회 오류 (${response.status})`);
    }
    return parseKakaoRoute(mode, await response.json(), transitType);
  } finally {
    clearTimeout(timer);
  }
}
