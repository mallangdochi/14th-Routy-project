export type StoredStop = {
  date: string; id: number; title: string; time: string; description: string;
  address: string; category: "맛집" | "카페" | "관광지" | "숙소" | "쇼핑" | "교통";
  image: string; x: number; y: number; placeId?: string; stayDurationMinutes?: number;
  transport?: string; lat?: number; lng?: number;
};
export type TripPlacesResult = { tripId: string; version: number; places: StoredStop[] };
async function request(tripId: string, body?: object, signal?: AbortSignal): Promise<TripPlacesResult> {
  const response = await fetch(`/api/trips/places${body ? "" : `?tripId=${encodeURIComponent(tripId)}`}`, {
    method: body ? "POST" : "GET", credentials: "include", cache: "no-store", signal,
    ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, tripId }) } : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? "일정을 저장하거나 조회하지 못했습니다.");
  if (data?.tripId !== tripId || !Number.isSafeInteger(data.version) || !Array.isArray(data.places)) throw new Error("일정 응답을 확인해주세요.");
  return data;
}
export const getTripPlaces = (tripId: string, signal?: AbortSignal) => request(tripId, undefined, signal);
export const appendTripPlaces = (tripId: string, date: string, places: Omit<StoredStop,"date">[]) => request(tripId, { action: "append", date, places });
export const replaceTripPlaces = (tripId: string, version: number, places: StoredStop[]) => request(tripId, { action: "replace", version, places });
