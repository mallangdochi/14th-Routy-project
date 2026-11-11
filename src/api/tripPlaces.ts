export type StoredStop = {
  date: string; id: number; title: string; time: string; description: string;
  address: string; category: "맛집" | "카페" | "관광지" | "숙소" | "쇼핑" | "교통";
  image: string; x: number; y: number; placeId?: string; stayDurationMinutes?: number;
  transport?: string | null; lat?: number; lng?: number;
};
export type TripPlacesResult = { tripId: string; version: number; places: StoredStop[] };
type WritePayload = { action: "append" | "replace"; date?: string; version?: number; places: StoredStop[] | Omit<StoredStop, "date">[] };
const normalizeTransport = (value?: string | null) => value?.trim() || null;
async function request(tripId: string, body?: WritePayload, signal?: AbortSignal): Promise<TripPlacesResult> {
  const payload = body ? { ...body, places: body.places.map(place => ({ ...place, transport: normalizeTransport(place.transport) })) } : undefined;
  const response = await fetch(`/api/trips/places${body ? "" : `?tripId=${encodeURIComponent(tripId)}`}`, {
    method: body ? "POST" : "GET", credentials: "include", cache: "no-store", signal,
    ...(payload ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, tripId }) } : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? "일정을 저장하거나 조회하지 못했습니다.");
  if (data?.tripId !== tripId || !Number.isSafeInteger(data.version) || !Array.isArray(data.places)) throw new Error("일정 응답을 확인해주세요.");
  if (body) {
    for (const sent of body.places) {
      const date = "date" in sent ? sent.date : body.date;
      const stored = (data.places as StoredStop[]).find(place => place.date === date && place.id === sent.id);
      if (!stored || normalizeTransport(stored.transport) !== normalizeTransport(sent.transport)) {
        // The RPC may have committed. Do not claim success or automatically retry the write.
        throw new Error("일정 저장 후 교통수단 확인에 실패했습니다. 새로고침 후 저장 상태를 확인하고 routy_schedule 함수의 transport 저장·반환 처리를 점검해주세요.");
      }
    }
  }
  return data;
}
export const getTripPlaces = (tripId: string, signal?: AbortSignal) => request(tripId, undefined, signal);
export const appendTripPlaces = (tripId: string, date: string, places: Omit<StoredStop,"date">[]) => request(tripId, { action: "append", date, places });
export const replaceTripPlaces = (tripId: string, version: number, places: StoredStop[]) => request(tripId, { action: "replace", version, places });
