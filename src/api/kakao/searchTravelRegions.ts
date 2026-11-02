import { loadKakaoMaps } from "./kakaoSdk";
import type { TravelRegion } from "../../data/regions";

// Kakao's address / place APIs return location data, not a downloadable
// nationwide administrative-division directory. Use both search sources and
// derive region candidates from *real* returned addresses (no mock REGIONS).
type AddressDocument = {
  address_name?: string;
  x?: string;
  y?: string;
  address?: {
    region_1depth_name?: string;
    region_2depth_name?: string;
    region_3depth_name?: string;
  } | null;
};

type PlaceDocument = {
  place_name?: string;
  address_name?: string;
  road_address_name?: string;
  x?: string;
  y?: string;
};

type SearchStatus = "OK" | "ZERO_RESULT" | "ERROR" | string;
type RegionServices = {
  Status: { OK: string; ZERO_RESULT?: string };
  Geocoder: new () => {
    addressSearch: (
      keyword: string,
      callback: (results: AddressDocument[], status: SearchStatus) => void,
      options?: { size?: number; analyze_type?: "SIMILAR" },
    ) => void;
  };
  Places: new () => {
    keywordSearch: (
      keyword: string,
      callback: (results: PlaceDocument[], status: SearchStatus) => void,
      options?: { size?: number; page?: number },
    ) => void;
  };
};

const aliases: Record<string, string> = {
  서울: "서울특별시",
  부산: "부산광역시",
  대구: "대구광역시",
  인천: "인천광역시",
  대전: "대전광역시",
  광주: "광주광역시",
  세종: "세종특별자치시",
  울산: "울산광역시",
  경기: "경기도",
  강원: "강원특별자치도",
  강원도: "강원특별자치도",
  충북: "충청북도",
  충남: "충청남도",
  전북: "전북특별자치도",
  전라북도: "전북특별자치도",
  전남: "전라남도",
  경북: "경상북도",
  경남: "경상남도",
  제주: "제주특별자치도",
};

const normalize = (value: string) => value.replace(/\s+/g, "").toLowerCase();

function regionNames(address: string): string[] {
  const words = address.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  // Kakao Places commonly returns abbreviated province names in address_name:
  // "울산 남구 삼산동 ...", "서울 강남구 역삼동 ...", "경기 광주시 ...".
  // Normalize only the province heading found in a *real API response*.
  // Nothing in this function manufactures a result when the API returns none.
  const normalizedWords = words
    .slice(0, 3)
    .map((part, index) => (index === 0 ? (aliases[part] ?? part) : part));
  const parts: string[] = [];
  for (const part of normalizedWords) {
    // Stop at the first non-administrative token instead of skipping over
    // building/road names and mixing unrelated components into a region.
    if (
      !/(특별시|광역시|특별자치시|특별자치도|도|시|군|구|읍|면|동|리)$/.test(
        part,
      )
    )
      break;
    parts.push(part);
  }
  const names: string[] = [];
  for (let i = 1; i <= parts.length; i += 1) {
    names.push(parts.slice(0, i).join(" "));
  }
  return names;
}

function matched(region: string, keyword: string): boolean {
  const normalKeyword = normalize(keyword);
  const expanded = keyword
    .trim()
    .split(/\s+/)
    .map((word) => aliases[word] ?? word)
    .join(" ");
  const normalRegion = normalize(region);
  return (
    normalRegion.includes(normalKeyword) ||
    normalRegion.includes(normalize(expanded))
  );
}

function toRegion(
  name: string,
  latitude?: number,
  longitude?: number,
): TravelRegion {
  return {
    id: `kakao-region:${encodeURIComponent(name)}`,
    name,
    country: "대한민국",
    ...(Number.isFinite(latitude) && Number.isFinite(longitude)
      ? { latitude, longitude }
      : {}),
  };
}

function sourceRequest<T>(
  invoke: (callback: (results: T[], status: SearchStatus) => void) => void,
  ok: string,
): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error("검색 요청 시간 초과")),
      6500,
    );
    try {
      invoke((results, status) => {
        window.clearTimeout(timeout);
        if (status === ok) resolve(results);
        else if (status === "ZERO_RESULT") resolve([]);
        else reject(new Error("카카오 장소/주소 검색 오류"));
      });
    } catch (err) {
      window.clearTimeout(timeout);
      reject(err);
    }
  });
}

const CACHE = new Map<string, TravelRegion[]>();

/**
 * Search Kakao address/place data, never an invented list of search results.
 * Kakao can parse a single city name (such as "울산") as a location modifier,
 * so keywordSearch("울산") may return ZERO_RESULT even though the city exists.
 * When that happens, search for actual places such as "울산광역시청" and derive
 * the region name from the returned real address.
 */
export async function searchTravelRegions(
  query: string,
  signal: AbortSignal,
): Promise<TravelRegion[]> {
  const trimmed = query.trim().replace(/\s+/g, " ");
  if (!trimmed || signal.aborted) return [];
  const cached = CACHE.get(trimmed);
  if (cached) return cached;

  const maps = await loadKakaoMaps();
  if (signal.aborted) return [];
  const service = maps.services as unknown as RegionServices;
  if (!service.Geocoder || !service.Places) {
    throw new Error("카카오 SDK의 장소 검색 라이브러리가 로드되지 않았습니다.");
  }

  const geocoder = new service.Geocoder();
  const places = new service.Places();
  const regions = new Map<string, TravelRegion>();
  let completedRequests = 0;

  const offer = (name: string, latitude?: number, longitude?: number) => {
    if (!matched(name, trimmed)) return;
    const existing = regions.get(name);
    // A returned point is used only when it represents this region,
    // or is the city/province hall used as a reasonable map preview center.
    if (
      !existing ||
      (latitude !== undefined && existing.latitude === undefined)
    ) {
      regions.set(name, toRegion(name, latitude, longitude));
    }
  };

  const collectAddress = (items: AddressDocument[]) => {
    for (const item of items) {
      const structured = item.address;
      const address = structured
        ? [
            structured.region_1depth_name,
            structured.region_2depth_name,
            structured.region_3depth_name,
          ]
            .filter(Boolean)
            .join(" ")
        : (item.address_name ?? "");
      const candidates = regionNames(address);
      const lat = Number(item.y);
      const lng = Number(item.x);
      candidates.forEach((name, index) => {
        offer(
          name,
          index === candidates.length - 1 ? lat : undefined,
          index === candidates.length - 1 ? lng : undefined,
        );
      });
    }
  };

  const collectPlaces = (items: PlaceDocument[]) => {
    for (const item of items) {
      const candidates = regionNames(
        item.address_name || item.road_address_name || "",
      );
      // For a provincial/city hall, its coordinate is a useful center for the
      // *parent* municipality. Do not attach its point to a district/road.
      const governmentHall = /(시청|도청|군청|구청)$/.test(
        (item.place_name ?? "").replace(/\s+/g, ""),
      );
      const lat = Number(item.y);
      const lng = Number(item.x);
      candidates.forEach((name, index) => {
        const cityHallCenter =
          governmentHall && index === 0 && candidates.length > 0;
        offer(
          name,
          cityHallCenter ? lat : undefined,
          cityHallCenter ? lng : undefined,
        );
      });
    }
  };

  const canonical = aliases[trimmed] ?? trimmed;
  // The alias is used as another *live geocoder query*, not as a result item.
  // For "울산", geocode "울산광역시" directly as well as searching "울산".
  const primary = await Promise.allSettled([
    sourceRequest<AddressDocument>(
      (callback) =>
        geocoder.addressSearch(trimmed, callback, {
          size: 30,
          analyze_type: "SIMILAR",
        }),
      service.Status.OK,
    ),
    sourceRequest<PlaceDocument>(
      (callback) => places.keywordSearch(trimmed, callback, { size: 15 }),
      service.Status.OK,
    ),
    ...(canonical !== trimmed
      ? [
          sourceRequest<AddressDocument>(
            (callback) =>
              geocoder.addressSearch(canonical, callback, {
                size: 30,
                analyze_type: "SIMILAR",
              }),
            service.Status.OK,
          ),
        ]
      : []),
  ]);
  if (signal.aborted) return [];

  if (primary[0].status === "fulfilled") {
    completedRequests += 1;
    collectAddress(primary[0].value);
  }
  if (primary[1].status === "fulfilled") {
    completedRequests += 1;
    collectPlaces(primary[1].value);
  }
  if (primary[2]?.status === "fulfilled") {
    completedRequests += 1;
    collectAddress(primary[2].value);
  }

  if (regions.size === 0 && trimmed.length >= 2) {
    // '울산' => '울산광역시청', plus '울산 관광지'. The location words by
    // themselves sometimes yield no place documents, but these queries do.
    const probes = Array.from(
      new Set([`${canonical}청`, `${trimmed} 시청`, `${trimmed} 관광지`]),
    ).slice(0, 3);
    const fallback = await Promise.allSettled(
      probes.map((keyword) =>
        sourceRequest<PlaceDocument>(
          (callback) => places.keywordSearch(keyword, callback, { size: 15 }),
          service.Status.OK,
        ),
      ),
    );
    if (signal.aborted) return [];
    for (const response of fallback) {
      if (response.status === "fulfilled") {
        completedRequests += 1;
        collectPlaces(response.value);
      }
    }
  }

  if (!completedRequests) {
    throw new Error(
      "카카오 지역 검색이 실패했습니다. API 연결을 확인해 주세요.",
    );
  }

  const result = [...regions.values()].sort((a, b) => {
    const q = normalize(trimmed);
    const score = (name: string) => {
      const parts = name.split(" ");
      const last = normalize(parts[parts.length - 1]);
      const normalizedName = normalize(name);
      return last === q
        ? 0
        : last.startsWith(q)
          ? 1
          : normalizedName.endsWith(q)
            ? 2
            : normalizedName.includes(q)
              ? 3
              : 4;
    };
    return score(a.name) - score(b.name) || a.name.localeCompare(b.name, "ko");
  });

  // Never permanently cache 0 results: transient API limits must be retryable.
  if (result.length > 0) {
    if (CACHE.size > 40) CACHE.clear();
    CACHE.set(trimmed, result);
  }
  return result;
}
