/** Server-only: search TourAPI for an attraction photo in a selected travel region. */
export type TourRegionPhoto = {
  image: string | null;
  title: string | null;
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
type Response<T> = {
  response?: {
    header?: { resultCode?: string };
    body?: { items?: { item?: T | T[] } | string };
  };
};

const ROOT = "https://apis.data.go.kr/B551011/KorService2";
const EMPTY: TourRegionPhoto = { image: null, title: null, source: null };
const cache = new Map<string, { value: TourRegionPhoto; expires: number }>();
const pending = new Map<string, Promise<TourRegionPhoto>>();

function safePhotoUrl(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol === "https:") return url.toString();
    if (
      url.protocol === "http:" &&
      (url.hostname === "visitkorea.or.kr" ||
        url.hostname.endsWith(".visitkorea.or.kr"))
    ) {
      url.protocol = "https:";
      return url.toString();
    }
  } catch {
    /* Ignore invalid external URLs. */
  }
  return null;
}

function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const rad = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
    Math.cos(lat1 * rad) *
      Math.cos(lat2 * rad) *
      Math.sin(((lng2 - lng1) * rad) / 2) ** 2;
  return 12742000 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function keywordCandidates(regionName: string): string[] {
  const parts = regionName.split(/\s+/).filter(Boolean);
  const terms = parts
    .slice(-2)
    .reverse()
    .map((word) =>
      word.replace(
        /(특별자치도|특별자치시|특별시|광역시|도|시|군|구|읍|면|동|리)$/u,
        "",
      ),
    );
  return [...new Set(terms.filter((term) => term.length >= 2))];
}

function matchesRegion(
  item: TourItem,
  regionName: string,
  latitude?: number,
  longitude?: number,
) {
  const address = item.addr1?.trim() ?? "";
  const normalized = regionName.trim().replace(/\s+/g, " ");
  const addressMatch = Boolean(
    address && (address === normalized || address.startsWith(`${normalized} `)),
  );
  const itemLat = Number(item.mapy);
  const itemLng = Number(item.mapx);
  const validPoint =
    latitude !== undefined &&
    longitude !== undefined &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Number.isFinite(itemLat) &&
    Number.isFinite(itemLng) &&
    itemLat !== 0 &&
    itemLng !== 0;
  const radius =
    regionName.split(/\s+/).length >= 3
      ? 12000
      : regionName.split(/\s+/).length === 2
        ? 35000
        : 80000;
  // For precise region names, never use images from a neighboring region.
  if (addressMatch) return true;
  // Fallback only when location coordinates verify the match.
  return (
    validPoint &&
    distanceMeters(latitude!, longitude!, itemLat, itemLng) <= radius &&
    (regionName.split(/\s+/).length <= 2 ||
      address.includes(regionName.split(/\s+/).at(-1)!))
  );
}

/** Exported separately so regional image choice can be tested with mock API data. */
export function bestRegionPhoto(
  items: TourItem[],
  regionName: string,
  lat?: number,
  lng?: number,
): TourRegionPhoto {
  const eligible = items
    .filter(
      (item) =>
        matchesRegion(item, regionName, lat, lng) &&
        Boolean(
          safePhotoUrl(item.firstimage) || safePhotoUrl(item.firstimage2),
        ),
    )
    .sort((a, b) => {
      const exactA = (a.addr1 ?? "").startsWith(`${regionName} `) ? 1 : 0;
      const exactB = (b.addr1 ?? "").startsWith(`${regionName} `) ? 1 : 0;
      if (exactA !== exactB) return exactB - exactA;
      if (lat === undefined || lng === undefined) return 0;
      const distance = (item: TourItem) => {
        const itemLat = Number(item.mapy);
        const itemLng = Number(item.mapx);
        return itemLat && itemLng
          ? distanceMeters(lat, lng, itemLat, itemLng)
          : Infinity;
      };
      return distance(a) - distance(b);
    });
  const selected = eligible[0];
  if (!selected) return EMPTY;
  return {
    image:
      safePhotoUrl(selected.firstimage) ?? safePhotoUrl(selected.firstimage2),
    title: (selected.title ?? "").replace(/<[^>]*>/g, "").trim() || null,
    source: "한국관광공사 TourAPI",
  };
}

async function requestItems(
  endpoint: string,
  query: Record<string, string>,
  key: string,
): Promise<TourItem[]> {
  const url = new URL(`${ROOT}/${endpoint}`);
  url.search = new URLSearchParams({
    serviceKey: key,
    MobileOS: "ETC",
    MobileApp: "Routy",
    _type: "json",
    numOfRows: "80",
    pageNo: "1",
    ...query,
  }).toString();
  // Never log the URL, which contains a server-only key.
  const response = await fetch(url, {
    signal: AbortSignal.timeout(6500),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`TourAPI HTTP ${response.status}`);
  const payload = (await response.json()) as Response<TourItem>;
  if (
    payload.response?.header?.resultCode &&
    payload.response.header.resultCode !== "0000"
  ) {
    throw new Error("TourAPI returned an error");
  }
  const item = payload.response?.body?.items;
  if (!item || typeof item !== "object" || !item.item) return [];
  return Array.isArray(item.item) ? item.item : [item.item];
}

export async function lookupRegionPhoto(
  name: string,
  lat?: number,
  lng?: number,
): Promise<TourRegionPhoto> {
  const key = process.env.TOUR_API_SERVICE_KEY?.trim();
  if (!key) throw new Error("Missing TOUR_API_SERVICE_KEY");
  const cacheKey = JSON.stringify([name, lat ?? null, lng ?? null]);
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.value;
  const inflight = pending.get(cacheKey);
  if (inflight) return inflight;

  const task = (async () => {
    let value: TourRegionPhoto = EMPTY;
    for (const keyword of keywordCandidates(name)) {
      const items = await requestItems(
        "searchKeyword2",
        { keyword, arrange: "Q" },
        key,
      );
      value = bestRegionPhoto(items, name, lat, lng);
      if (value.image) break;
    }
    if (!value.image && lat !== undefined && lng !== undefined) {
      const items = await requestItems(
        "locationBasedList2",
        {
          mapX: String(lng),
          mapY: String(lat),
          radius: "20000",
        },
        key,
      );
      value = bestRegionPhoto(items, name, lat, lng);
    }
    if (cache.size > 350) cache.clear();
    cache.set(cacheKey, {
      value,
      expires:
        Date.now() + (value.image ? 12 * 60 * 60 * 1000 : 20 * 60 * 1000),
    });
    return value;
  })();
  pending.set(cacheKey, task);
  try {
    return await task;
  } finally {
    pending.delete(cacheKey);
  }
}
