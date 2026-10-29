import { loadKakaoMaps } from "./kakaoSdk";

/** Kakao Places SDK returns place metadata, not ratings, reviews or descriptive articles. */
export type KakaoPlaceInfo = {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  place_url: string;
  x: string;
  y: string;
};

type SearchOptions = {
  category_group_code?: string;
  location?: { getLat(): number; getLng(): number };
  radius?: number;
  size?: number;
};

type Client = {
  keywordSearch: (
    keyword: string,
    callback: (items: KakaoPlaceInfo[], status: string) => void,
    options?: SearchOptions,
  ) => void;
  categorySearch: (
    category: string,
    callback: (items: KakaoPlaceInfo[], status: string) => void,
    options: SearchOptions,
  ) => void;
};

function query(
  client: Client,
  value: string,
  options: SearchOptions = {},
  byCategory = false,
): Promise<KakaoPlaceInfo[]> {
  return new Promise((resolve, reject) => {
    const callback = (items: KakaoPlaceInfo[], status: string) => {
      if (status === "OK") resolve(items);
      else if (status === "ZERO_RESULT") resolve([]);
      else reject(new Error(`카카오 장소 검색 오류: ${status}`));
    };
    if (byCategory) client.categorySearch(value, callback, options);
    else client.keywordSearch(value, callback, options);
  });
}

function sameName(a: string, b: string) {
  return (
    a.replace(/\s+/g, "").toLowerCase() === b.replace(/\s+/g, "").toLowerCase()
  );
}

/** Queries the Kakao SDK again so refreshed/bookmarked detail URLs still work. */
export async function findPlaceDetail(args: {
  id?: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
}): Promise<KakaoPlaceInfo | null> {
  const sdk = await loadKakaoMaps();
  const client = new sdk.services.Places() as unknown as Client;
  const options: SearchOptions = { size: 15 };
  if (Number.isFinite(args.lat) && Number.isFinite(args.lng)) {
    options.location = new sdk.LatLng(args.lat!, args.lng!);
    options.radius = 20000;
  }
  const records = await query(client, args.name, options);
  const id = args.id?.replace(/^kakao-/, "");
  const byId = id && records.find((item) => item.id === id);
  if (byId) return byId;
  const byName = records.filter((item) => sameName(item.place_name, args.name));
  if (byName.length === 0) return null;
  if (!args.address) return byName[0];
  return (
    byName.find(
      (item) =>
        item.road_address_name === args.address ||
        item.address_name === args.address,
    ) ?? byName[0]
  );
}

export async function findNearbyPlaces(
  lat: number,
  lng: number,
  category: string,
): Promise<KakaoPlaceInfo[]> {
  const sdk = await loadKakaoMaps();
  const client = new sdk.services.Places() as unknown as Client;
  const loc = new sdk.LatLng(lat, lng);
  const codes =
    category === "전체"
      ? ["AT4", "FD6", "CE7", "AD5"]
      : category === "관광지"
        ? ["AT4"]
        : category === "맛집"
          ? ["FD6"]
          : category === "카페"
            ? ["CE7"]
            : ["AD5"];
  const responses = await Promise.allSettled(
    codes.map((code) =>
      query(
        client,
        code,
        {
          location: loc,
          radius: 3000,
          size: 8,
        },
        true,
      ),
    ),
  );
  const places = responses.flatMap((r) =>
    r.status === "fulfilled" ? r.value : [],
  );
  if (!responses.some((r) => r.status === "fulfilled")) {
    throw new Error("주변 장소를 조회할 수 없습니다.");
  }
  return [...new Map(places.map((place) => [place.id, place])).values()].slice(
    0,
    18,
  );
}
