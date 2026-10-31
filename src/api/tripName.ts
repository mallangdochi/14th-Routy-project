export interface TripNameResult {
  tripId: string;
  name: string;
  updatedAt: string;
}

export async function saveTripName(
  tripId: string,
  name: string,
): Promise<TripNameResult> {
  const response = await fetch("/api/trips/name", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tripId, name }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "여행 이름을 저장하지 못했습니다.");
  }

  if (
    !data ||
    data.tripId !== tripId ||
    typeof data.name !== "string" ||
    typeof data.updatedAt !== "string"
  ) {
    throw new Error(
      "저장 결과를 확인하지 못했습니다. 새로고침 후 확인해주세요.",
    );
  }

  return data as TripNameResult;
}
