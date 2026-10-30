export interface TripDaysResult {
  tripId: string;
  dates: string[];
  startDate: string;
  endDate: string;
  updatedAt: string;
}

async function readResult(response: Response): Promise<TripDaysResult> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "여행 날짜를 처리하지 못했습니다.");
  }

  if (
    !data ||
    typeof data.tripId !== "string" ||
    !Array.isArray(data.dates) ||
    data.dates.length === 0 ||
    !data.dates.every((date: unknown) => typeof date === "string") ||
    typeof data.startDate !== "string" ||
    typeof data.endDate !== "string" ||
    typeof data.updatedAt !== "string"
  ) {
    throw new Error(
      "여행 날짜 응답을 확인하지 못했습니다. DB 초기화 SQL 실행 여부를 확인해주세요.",
    );
  }

  return data as TripDaysResult;
}

export async function getTripDays(
  tripId: string,
  signal?: AbortSignal,
): Promise<TripDaysResult> {
  const response = await fetch(
    `/api/trips/days?tripId=${encodeURIComponent(tripId)}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal,
    },
  );

  return readResult(response);
}

export async function saveTripDays(
  tripId: string,
  dates: string[],
  expectedDates: string[],
): Promise<TripDaysResult> {
  const response = await fetch("/api/trips/days", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tripId,
      dates,
      expectedDates,
    }),
  });

  return readResult(response);
}
