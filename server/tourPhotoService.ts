/**
 * 한국관광공사 TourAPI 대표 이미지 조회.
 * 브라우저로 인증키를 전달하지 않습니다.
 * 장소명이 강하게 일치하고 좌표가 가까운 이미지에 한해 사용합니다.
 */
export type TourPhotoResult = {
  image: string | null;
  source: "한국관광공사 TourAPI" | null;
};

type TourItem = {
  title?: string;
  addr1?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx?: string;
  mapy?: string;
};

type TourPayload = {
  response?: {
    header?: { resultCode?: string; resultMsg?: string };
    body?: { items?: { item?: TourItem | TourItem[] } | string };
  };
};

const API_ROOT = "https://apis.data.go.kr/B551011/KorService2/searchKeyword2";
const CACHE_TTL = 1000 * 60 * 60 * 12;
const cache = new Map<string, { expires: number; data: TourPhotoResult }>();
const pending = new Map<string, Promise<TourPhotoResult>>();
const EMPTY: TourPhotoResult = { image: null, source: null };

const normalize = (text: string) =>
  text
    .replace(/<[^>]*>/g, "")
    .replace(/\([^)]*\)|\[[^\]]*\]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLocaleLowerCase();

function samePlaceName(a: string, b: string): boolean {
  const cleanA = normalize(a);
  const cleanB = normalize(b);
  if (!cleanA || !cleanB) return false;
  if (cleanA === cleanB) return true;
  // '광안리해수욕장' vs '광안리해수욕장(부산)' 등의 부가 설명 허용.
  const short = cleanA.length < cleanB.length ? cleanA : cleanB;
  const long = cleanA.length >= cleanB.length ? cleanA : cleanB;
  return short.length >= 6 && long.startsWith(short) && short.length / long.length >= 0.85;
}

function metersBetween(lat1: number, lng1: number, lat2: number, lng2: number) {
  const r = Math.PI / 180;
  const dLat = (lat2 - lat1) * r;
  const dLng = (lng2 - lng1) * r;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function matchesLocation(item: TourItem, address: string, lat?: number, lng?: number) {
  const itemLat = Number(item.mapy);
  const itemLng = Number(item.mapx);
  if (Number.isFinite(lat) && Number.isFinite(lng) &&
      Number.isFinite(itemLat) && Number.isFinite(itemLng) &&
      itemLat !== 0 && itemLng !== 0) {
    // 이름이 같아도 다른 지역의 관광지가면 사용하지 않습니다.
    return metersBetween(lat!, lng!, itemLat, itemLng) <= 5000;
  }

  // 좌표가 없으면 시/군/구 또는 읍/면/동의 공통 행정구역 확인.
  const locationWords = address.match(/[가-힣]{2,}(?:시|군|구|읍|면|동)/g) ?? [];
  const tourAddr = item.addr1 ?? "";
  if (locationWords.length === 0) return false;
  return locationWords.some((word) => tourAddr.includes(word));
}

function imageUrl(item: TourItem): string | null {
  for (const candidate of [item.firstimage, item.firstimage2]) {
    if (!candidate) continue;
    try {
      const url = new URL(candidate);
      if (url.protocol === "https:") return url.toString();
      // TourAPI의 오래된 이미지 중에는 http://tong.visitkorea.or.kr 주소가 있습니다.
      if (url.protocol === "http:" &&
          (url.hostname === "visitkorea.or.kr" || url.hostname.endsWith(".visitkorea.or.kr"))) {
        url.protocol = "https:";
        return url.toString();
      }
    } catch { /* 잘못된 이미지 주소 제외 */ }
  }
  return null;
}

export function bestTourImage(
  items: TourItem[],
  name: string,
  address: string,
  lat?: number,
  lng?: number,
): TourPhotoResult {
  for (const item of items) {
    const url = imageUrl(item);
    if (!url || !samePlaceName(item.title ?? "", name)) continue;
    if (matchesLocation(item, address, lat, lng)) {
      return { image: url, source: "한국관광공사 TourAPI" };
    }
  }
  return EMPTY;
}

export function isTourKeyConfigured() {
  return Boolean(process.env.TOUR_API_SERVICE_KEY?.trim());
}

export async function lookupTourImage(
  name: string,
  address: string,
  lat?: number,
  lng?: number,
): Promise<TourPhotoResult> {
  const key = process.env.TOUR_API_SERVICE_KEY?.trim();
  if (!key) throw new Error("TOUR_API_SERVICE_KEY가 서버에 설정되지 않았습니다.");
  const cacheKey = JSON.stringify([name, address, lat ?? null, lng ?? null]);
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.data;
  const inFlight = pending.get(cacheKey);
  if (inFlight) return inFlight;

  const task = (async () => {
    const url = new URL(API_ROOT);
    url.searchParams.set("serviceKey", key);
    url.searchParams.set("MobileOS", "ETC");
    url.searchParams.set("MobileApp", "Routy");
    url.searchParams.set("_type", "json");
    url.searchParams.set("numOfRows", "15");
    url.searchParams.set("pageNo", "1");
    url.searchParams.set("keyword", name);

    // 키가 포함된 URL을 절대 로깅하지 마세요.
    const response = await fetch(url, {
      signal: AbortSignal.timeout(7000),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`TourAPI HTTP ${response.status}`);
    const payload = (await response.json()) as TourPayload;
    const header = payload.response?.header;
    if (header?.resultCode && header.resultCode !== "0000") {
      throw new Error(`TourAPI 응답 오류 (${header.resultCode})`);
    }
    const raw = payload.response?.body?.items;
    const arr = raw && typeof raw === "object" ? raw.item : undefined;
    const items = Array.isArray(arr) ? arr : arr ? [arr] : [];
    const data = bestTourImage(items, name, address, lat, lng);
    if (cache.size >= 350) cache.delete(cache.keys().next().value ?? "");
    cache.set(cacheKey, { expires: Date.now() + CACHE_TTL, data });
    return data;
  })();
  pending.set(cacheKey, task);
  try { return await task; } finally { pending.delete(cacheKey); }
}
