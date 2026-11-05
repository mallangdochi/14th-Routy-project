import { loadKakaoMaps } from "./kakaoSdk";
import fallbackImage from "../../assets/where.webp";

/**
 * Adapter for the existing place-add modal. Kakao Places provides location metadata,
 * while /api/tour/photos tries TourAPI first and Daum image search if necessary.
 * Daum results are not guaranteed to match the exact place.
 */
type KakaoItem = {
  id: string;
  place_name: string;
  address_name?: string;
  road_address_name?: string;
  category_group_code?: string;
  category_name?: string;
  place_url?: string;
  phone?: string;
  x: string;
  y: string;
};

type KakaoService = {
  keywordSearch: (
    keyword: string,
    callback: (items: KakaoItem[], status: string) => void,
    options?: { page?: number; size?: number; category_group_code?: string },
  ) => void;
};

type ModalSearchRequest = { query: string; region: string; category: string };
export type ModalSearchPlace = {
  id: string;
  name: string;
  title: string;
  address: string;
  category: string;
  image: string;
  thumbnail: string;
  thumbnailUrl: string;
  imageUrl: string;
  lat: number;
  lng: number;
  latitude: number;
  longitude: number;
  placeUrl: string;
  description: string;
};

/** Array and common response aliases for older versions of PlaceAddModal. */
export type ModalSearchPayload = ModalSearchPlace[] & {
  places: ModalSearchPlace[];
  items: ModalSearchPlace[];
  results: ModalSearchPlace[];
  data: ModalSearchPlace[];
  total: number;
  totalCount: number;
  count: number;
  nextCursor: null;
  hasMore: false;
};

const CATEGORY_MAP: Record<string, string> = {
  관광지: "AT4",
  관광: "AT4",
  맛집: "FD6",
  음식점: "FD6",
  카페: "CE7",
  숙소: "AD5",
};

function categoryOf(place: KakaoItem): string {
  return place.category_group_code === "FD6" ? "맛집"
    : place.category_group_code === "CE7" ? "카페"
    : place.category_group_code === "AD5" ? "숙소"
    : "관광지";
}

const knownPlaces = new Map<string, ModalSearchPlace>();
export function getKnownModalPlace(id: string): ModalSearchPlace | undefined {
  return knownPlaces.get(id) ?? knownPlaces.get(id.replace(/^kakao-/, ""));
}

function parseRequest(args: unknown[]): ModalSearchRequest {
  const request: ModalSearchRequest = { query: "", category: "전체", region: "" };
  const textArgs: string[] = [];
  for (const arg of args) {
    if (typeof arg === "string") {
      textArgs.push(arg.trim());
    } else if (arg && typeof arg === "object") {
      const obj = arg as Record<string, unknown>;
      const first = (...names: string[]) => {
        for (const key of names) {
          if (typeof obj[key] === "string" && String(obj[key]).trim()) return String(obj[key]).trim();
        }
        return "";
      };
      request.query ||= first("keyword", "query", "search", "searchTerm", "searchText", "term", "q");
      request.region ||= first("region", "regionName", "location", "city");
      const category = first("category", "filter", "categoryName");
      if (category) request.category = category;
    }
  }
  for (const word of textArgs) {
    if (!word) continue;
    if (word === "전체" || word in CATEGORY_MAP) request.category = word;
    else if (/^(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충청|전라|경상|제주|경기도|강원도|충북|충남|전북|전남|경북|경남)/.test(word) && word.includes(" ")) request.region ||= word;
    else request.query ||= word;
  }
  return request;
}

function matchesRegion(item: KakaoItem, region: string) {
  if (!region) return true;
  const address = `${item.road_address_name || ""} ${item.address_name || ""}`.replace(/\s+/g, " ");
  const normalized = (value: string) => value
    .replace(/특별자치도|특별자치시|광역시|특별시|자치도|자치시|도|시|군|구/g, "")
    .replace(/\s+/g, "");
  const parts = region.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return parts.every((part) => normalized(address).includes(normalized(part)));
  return normalized(address).includes(normalized(region));
}

function keywordSearch(service: KakaoService, query: string, categoryCode?: string, page = 1): Promise<KakaoItem[]> {
  return new Promise((resolve, reject) => {
    service.keywordSearch(query, (items, status) => {
      if (status === "OK") resolve(items);
      else if (status === "ZERO_RESULT") resolve([]);
      else reject(new Error(`카카오 장소 검색 실패 (${status})`));
    }, { page, size: 15, ...(categoryCode ? { category_group_code: categoryCode } : {}) });
  });
}

const imageCache = new Map<string, { image: string; expires: number }>();
const imageInFlight = new Map<string, Promise<string>>();
async function findPlaceImage(item: KakaoItem): Promise<string> {
  const key = `${item.place_name}|${item.address_name}|${item.x}|${item.y}`;
  const saved = imageCache.get(key);
  if (saved && saved.expires > Date.now()) return saved.image;
  const running = imageInFlight.get(key);
  if (running) return running;
  const promise = (async () => {
    const params = new URLSearchParams({
      v: "photo-balanced-4",
      name: item.place_name,
      address: item.road_address_name || item.address_name || "",
      lat: item.y,
      lng: item.x,
    });
    try {
      // TourAPI 검색 후 Daum으로 넘어갈 수 있으므로 기존 4.5초보다 긴 시간 허용.
      const response = await fetch(`/api/tour/photos?${params}`, {
        signal: AbortSignal.timeout(18000),
      });
      if (!response.ok) return fallbackImage;
      const data: unknown = await response.json();
      if (!data || typeof data !== "object") return fallbackImage;
      const image = (data as { image?: unknown }).image;
      return typeof image === "string" && image.startsWith("https://")
        ? image
        : fallbackImage;
    } catch {
      return fallbackImage;
    }
  })().then((image) => {
    if (imageCache.size > 350) imageCache.clear();
    // 실패한 사진은 2분만 기억하여 키 설정/서버 장애 후 재시도가 가능하게 합니다.
    imageCache.set(key, {
      image,
      expires: Date.now() + (image === fallbackImage ? 30 * 1000 : 6 * 60 * 60 * 1000),
    });
    return image;
  }).finally(() => imageInFlight.delete(key));
  imageInFlight.set(key, promise);
  return promise;
}

export async function searchPlaceModal(...args: unknown[]): Promise<ModalSearchPayload> {
  const { query, region, category } = parseRequest(args);
  const sdk = await loadKakaoMaps();
  const service = new sdk.services.Places() as unknown as KakaoService;
  const categoryCode = CATEGORY_MAP[category];
  // Blank input: search a few real places near the selected travel destination.
  const terms = query
    ? [query, ...(region && !query.includes(region) ? [`${region} ${query}`] : [])]
    : [
      `${region || "대한민국"} 관광지`,
      `${region || "대한민국"} 맛집`,
      `${region || "대한민국"} 카페`,
    ];
  const outcomes = await Promise.allSettled(terms.map(term => keywordSearch(service, term, categoryCode)));
  const good = outcomes.filter((entry): entry is PromiseFulfilledResult<KakaoItem[]> => entry.status === "fulfilled");
  if (!good.length) {
    const fail = outcomes.find((entry): entry is PromiseRejectedResult => entry.status === "rejected");
    throw fail?.reason instanceof Error ? fail.reason : new Error("카카오 장소 검색에 실패했습니다.");
  }
  const unique = new Map<string, KakaoItem>();
  for (const outcome of good) for (const item of outcome.value) {
    if (item.id && Number.isFinite(Number(item.y)) && Number.isFinite(Number(item.x))) unique.set(item.id, item);
  }
  let items = [...unique.values()].filter(item => matchesRegion(item, region));
  if (categoryCode) items = items.filter(item => item.category_group_code === categoryCode);
  items = items.slice(0, 30);
  // Do not block the first results for many photos. Look up a limited number of thumbnails.
  const photos = await Promise.all(items.slice(0, 10).map(findPlaceImage));
  const places: ModalSearchPlace[] = items.map((item, index) => {
    const image = photos[index] ?? fallbackImage;
    const place: ModalSearchPlace = {
      id: `kakao-${item.id}`,
      name: item.place_name,
      title: item.place_name,
      address: item.road_address_name || item.address_name || "",
      category: categoryOf(item),
      image,
      thumbnail: image,
      imageUrl: image,
      thumbnailUrl: image,
      lat: Number(item.y), lng: Number(item.x),
      latitude: Number(item.y), longitude: Number(item.x),
      placeUrl: item.place_url || "",
      description: item.category_name || "",
    };
    knownPlaces.set(place.id, place);
    knownPlaces.set(item.id, place);
    return place;
  });
  // Preserve both array and object-response conventions while the exact modal
  // implementation is not present in the supplied project snapshot.
  return Object.assign([...places], {
    places, items: places, results: places, data: places,
    total: places.length, totalCount: places.length, count: places.length,
    nextCursor: null, hasMore: false,
  });
}
