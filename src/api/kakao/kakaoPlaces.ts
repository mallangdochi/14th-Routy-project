import type { KakaoMapsSDK } from "./kakaoTypes";

export type KakaoStop = {
  id: string | number;
  title: string;
  address?: string;
  time?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
};

export type LocatedStop = {
  stop: KakaoStop;
  latitude: number;
  longitude: number;
};

export const DEFAULT_MAP_CENTER = { latitude: 36.4, longitude: 127.8 };

export function resolveKakaoPlace(
  sdk: KakaoMapsSDK,
  places: InstanceType<KakaoMapsSDK["services"]["Places"]>,
  stop: KakaoStop,
): Promise<LocatedStop | null> {
  if (
    typeof stop.latitude === "number" &&
    Number.isFinite(stop.latitude) &&
    typeof stop.longitude === "number" &&
    Number.isFinite(stop.longitude)
  ) {
    return Promise.resolve({
      stop,
      latitude: stop.latitude,
      longitude: stop.longitude,
    });
  }

  const queries = [
    `${stop.title} ${stop.address ?? ""}`.trim(),
    stop.title.trim(),
  ].filter(Boolean);
  const search = (index: number): Promise<LocatedStop | null> =>
    new Promise((resolve) => {
      if (index >= queries.length) {
        resolve(null);
        return;
      }
      places.keywordSearch(queries[index], (results, status) => {
        if (status === sdk.services.Status.OK && results.length > 0) {
          const latitude = Number(results[0].y);
          const longitude = Number(results[0].x);
          if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
            resolve({ stop, latitude, longitude });
            return;
          }
        }
        void search(index + 1).then(resolve);
      });
    });
  return search(0);
}
