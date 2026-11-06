/** 여행 지역 사진: 한국관광공사 → 다음 이미지 검색 순서로 조회합니다. */
import { lookupRegionPhoto as lookupFromTourAPI } from "./tourApiRegionPhotoService.js";
import { lookupDaumImage, EMPTY_PHOTO, type PhotoResult } from "./tourPhotoService.js";

export type TourRegionPhoto = PhotoResult;
const cache = new Map<string, { data: PhotoResult; expires: number }>();
const pending = new Map<string, Promise<PhotoResult>>();

export async function lookupRegionPhoto(
  name: string,
  lat?: number,
  lng?: number,
  preferDaum = false,
): Promise<TourRegionPhoto> {
  const trimmed = name.trim();
  if (!trimmed) return EMPTY_PHOTO;
  const key = JSON.stringify([trimmed, lat ?? null, lng ?? null, preferDaum]);
  const current = cache.get(key);
  if (current && current.expires > Date.now()) return current.data;
  const inflight = pending.get(key);
  if (inflight) return inflight;

  const task = (async (): Promise<PhotoResult> => {
    let anyRequestSucceeded = false;
    let failure: unknown;
    if (!preferDaum && process.env.TOUR_API_SERVICE_KEY?.trim()) {
      try {
        const tour = await lookupFromTourAPI(trimmed, lat, lng);
        anyRequestSucceeded = true;
        if (tour.image) {
          const value: PhotoResult = { ...tour, sourceUrl: null };
          cache.set(key, { data: value, expires: Date.now() + 6 * 60 * 60 * 1000 });
          return value;
        }
      } catch (error) { failure = error; }
    }
    if (process.env.KAKAO_REST_API_KEY?.trim()) {
      try {
        const value = await lookupDaumImage(`${trimmed} 여행 명소 풍경`, { name: trimmed, address: trimmed, kind: "region" });
        anyRequestSucceeded = true;
        if (cache.size > 350) cache.clear();
        cache.set(key, { data: value, expires: Date.now() + (value.image ? 6 * 60 * 60 * 1000 : 10 * 60 * 1000) });
        return value;
      } catch (error) { failure = error; }
    }
    if (!anyRequestSucceeded && failure) throw new Error("REGION_IMAGE_SERVICES_UNAVAILABLE");
    cache.set(key, { data: EMPTY_PHOTO, expires: Date.now() + 10 * 60 * 1000 });
    return EMPTY_PHOTO;
  })().finally(() => pending.delete(key));
  pending.set(key, task);
  return task;
}
