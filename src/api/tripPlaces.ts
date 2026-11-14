export type StoredStop = {
  date: string; id: number; title: string; time: string; description: string;
  address: string; category: "맛집" | "카페" | "관광지" | "숙소" | "쇼핑" | "교통";
  image: string; x: number; y: number; placeId?: string; stayDurationMinutes?: number;
  transport?: string | null; lat?: number; lng?: number;
};
export type TripPlacesResult = { tripId: string; version: number; places: StoredStop[] };
type WritePayload = { action: "append" | "replace"; date?: string; version?: number; dates?: string[]; expectedDates?: string[]; places: StoredStop[] | Omit<StoredStop, "date">[] };
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
      if (!stored) {
        // Do not retry a write that may already have committed.
        throw new Error("추가하거나 수정한 장소의 저장 결과를 확인하지 못했어요. 새로고침 후 일정을 확인해주세요.");
      }
      // Append success is determined by the saved place, not by transport or
      // route availability. Keep the authoritative server response unchanged.
      // Explicit detail edits still verify that their transport was persisted.
      if (body.action === "replace" &&
          normalizeTransport(stored.transport) !== normalizeTransport(sent.transport)) {
        throw new Error("변경한 교통수단이 저장 결과에 반영되지 않았어요. 새로고침 후 확인해주세요.");
      }
    }
  }
  return data;
}
export const getTripPlaces = (tripId: string, signal?: AbortSignal) => request(tripId, undefined, signal);
export const appendTripPlaces = (tripId: string, date: string, places: Omit<StoredStop,"date">[]) => request(tripId, { action: "append", date, places });
export const replaceTripPlaces = (tripId: string, version: number, places: StoredStop[], dates?: string[], expectedDates?: string[]) => request(tripId, { action: "replace", version, places, dates, expectedDates });
