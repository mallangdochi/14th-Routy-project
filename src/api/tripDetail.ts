import type { SavedTrip } from "./trips";

interface TripDetailResponse {
  message?: string;
  trip?: SavedTrip;
}

export async function getTripDetail(
  tripId: string,
  signal?: AbortSignal,
): Promise<SavedTrip> {
  const response = await fetch(
    `/api/trips/detail?id=${encodeURIComponent(tripId)}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal,
    },
  );

  const result: TripDetailResponse | null = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message ?? "여행 정보를 조회하지 못했습니다.");
  }

  if (!result?.trip?.id) {
    throw new Error("여행 정보 응답을 확인하지 못했습니다.");
  }

  return result.trip;
}
