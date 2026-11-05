/**
 * TourAPI 사진 조회 - 대표 이미지가 없을 때 detailImage2까지 확인하는 버전.
 * 카카오 API/프런트 UI/키 설정은 변경하지 않습니다.
 */
export type TourPhotoResult = {
  image: string | null;
  source: "한국관광공사 TourAPI" | null;
};

type TourItem = {
  title?: string;
  addr1?: string;
  contentid?: string | number;
  firstimage?: string;
  firstimage2?: string;
  mapx?: string;
  mapy?: string;
};
type DetailPhotoItem = {
  originimgurl?: string;
  smallimageurl?: string;
  cpyrhtDivCd?: string;
};
type ApiPayload<T> = {
  response?: {
    header?: { resultCode?: string; resultMsg?: string };
    body?: { items?: { item?: T | T[] } | string };
  };
};

const API_ROOT = "https://apis.data.go.kr/B551011/KorService2";
const cache = new Map<string, { expires: number; data: TourPhotoResult }>();
const pending = new Map<string, Promise<TourPhotoResult>>();
const EMPTY: TourPhotoResult = { image: null, source: null };
const SUCCESS_TTL = 12 * 60 * 60 * 1000;
const NO_PHOTO_TTL = 30 * 60 * 1000;

const normalize = (s: string) => s
  .replace(/<[^>]*>/g, "")
  .replace(/\([^)]*\)|\[[^\]]*\]/g, "")
  .replace(/[^\p{L}\p{N}]/gu, "")
  .toLocaleLowerCase("ko");

function metersBetween(lat1: number, lng1: number, lat2: number, lng2: number) {
  const r = Math.PI / 180;
  const dLat = (lat2 - lat1) * r;
  const dLng = (lng2 - lng1) * r;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nameSimilarity(a: string, b: string): number {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  const short = x.length <= y.length ? x : y;
  const long = x.length > y.length ? x : y;
  if (short.length < 5 || !long.startsWith(short)) return 0;
  return short.length / long.length;
}

function matchesPlace(item: TourItem, name: string, address: string, lat?: number, lng?: number): boolean {
  const similarity = nameSimilarity(item.title ?? "", name);
  if (similarity < 0.72) return false;
  const itemLat = Number(item.mapy);
  const itemLng = Number(item.mapx);
  const hasCoords = lat !== undefined && lng !== undefined &&
    Number.isFinite(lat) && Number.isFinite(lng) &&
    Number.isFinite(itemLat) && Number.isFinite(itemLng) &&
    itemLat !== 0 && itemLng !== 0;
  if (hasCoords) {
    const distance = metersBetween(lat!, lng!, itemLat, itemLng);
    // 비슷한 이름의 다른 장소 사진이 붙지 않게 부분일치일 때 거리 제한 강화.
    return distance <= (similarity === 1 ? 5000 : 650);
  }
  const words = address.match(/[가-힣]{2,}(?:시|군|구|읍|면|동)/g) ?? [];
  return words.length > 0 && words.some(word => (item.addr1 ?? "").includes(word));
}

function safePhotoURL(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "https:") return parsed.toString();
    if (parsed.protocol === "http:" && (
      parsed.hostname === "visitkorea.or.kr" ||
      parsed.hostname.endsWith(".visitkorea.or.kr")
    )) {
      parsed.protocol = "https:";
      return parsed.toString();
    }
  } catch { /* URL 형식 오류 */ }
  return null;
}

function representativeURL(item: TourItem): string | null {
  return safePhotoURL(item.firstimage) ?? safePhotoURL(item.firstimage2);
}

export function bestTourImage(items: TourItem[], name: string, address: string, lat?: number, lng?: number): TourPhotoResult {
  for (const item of items) {
    if (!matchesPlace(item, name, address, lat, lng)) continue;
    const image = representativeURL(item);
    if (image) return { image, source: "한국관광공사 TourAPI" };
  }
  return EMPTY;
}

export function isTourKeyConfigured() {
  return Boolean(process.env.TOUR_API_SERVICE_KEY?.trim());
}

async function getItems<T>(endpoint: string, params: Record<string, string>, key: string): Promise<T[]> {
  const url = new URL(`${API_ROOT}/${endpoint}`);
  const query = new URLSearchParams({
    serviceKey: key,
    MobileOS: "ETC",
    MobileApp: "Routy",
    _type: "json",
    numOfRows: "30",
    pageNo: "1",
    ...params,
  });
  url.search = query.toString();
  // 인증키가 포함된 URL을 기록하거나 브라우저로 보내지 마세요.
  const response = await fetch(url, {
    signal: AbortSignal.timeout(6500),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`TourAPI HTTP ${response.status}`);
  const payload = (await response.json()) as ApiPayload<T>;
  const code = payload.response?.header?.resultCode;
  if (code && code !== "0000") throw new Error(`TourAPI 응답 오류 (${code})`);
  const rawItems = payload.response?.body?.items;
  const raw = rawItems && typeof rawItems === "object" ? rawItems.item : undefined;
  return raw === undefined ? [] : Array.isArray(raw) ? raw : [raw];
}

export async function lookupTourImage(name: string, address: string, lat?: number, lng?: number): Promise<TourPhotoResult> {
  const key = process.env.TOUR_API_SERVICE_KEY?.trim();
  if (!key) throw new Error("TOUR_API_SERVICE_KEY가 서버에 설정되지 않았습니다.");
  const cacheKey = JSON.stringify([name, address, lat ?? null, lng ?? null]);
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.data;
  const inFlight = pending.get(cacheKey);
  if (inFlight) return inFlight;

  const task = (async (): Promise<TourPhotoResult> => {
    const items = await getItems<TourItem>("searchKeyword2", { keyword: name }, key);
    let result = bestTourImage(items, name, address, lat, lng);

    // 대표 사진이 없지만 이름과 위치가 확인된 관광지에만 상세 이미지 조회.
    if (!result.image) {
      const verified = items.find(item => matchesPlace(item, name, address, lat, lng) && item.contentid);
      if (verified?.contentid) {
        try {
          const details = await getItems<DetailPhotoItem>("detailImage2", {
            contentId: String(verified.contentid), imageYN: "Y", numOfRows: "10",
          }, key);
          const detailed = details.map(item => safePhotoURL(item.originimgurl) ?? safePhotoURL(item.smallimageurl))
            .find((image): image is string => Boolean(image));
          if (detailed) result = { image: detailed, source: "한국관광공사 TourAPI" };
        } catch {
          // 상세 사진 API가 실패해도 검색 기능은 유지하고 기본 이미지로 처리.
        }
      }
    }

    if (cache.size >= 350) cache.delete(cache.keys().next().value ?? "");
    cache.set(cacheKey, {
      expires: Date.now() + (result.image ? SUCCESS_TTL : NO_PHOTO_TTL),
      data: result,
    });
    return result;
  })();

  pending.set(cacheKey, task);
  try { return await task; } finally { pending.delete(cacheKey); }
}
