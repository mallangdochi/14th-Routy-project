export interface TripNameResult { tripId: string; name: string; updatedAt: string }
export async function saveTripName(tripId: string, name: string): Promise<TripNameResult> {
  const response = await fetch("/api/trips/share", {
    method: "POST", credentials: "include", cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "update", tripId, name }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? "여행 이름을 저장하지 못했습니다.");
  if (data?.tripId !== tripId || typeof data?.name !== "string" || typeof data?.updatedAt !== "string") throw new Error("저장 결과를 확인하지 못했습니다.");
  return data;
}
