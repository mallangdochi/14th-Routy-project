export interface CreateTripInput {
  name?: string;
  region: string;
  startDate: string;
  endDate: string;
  startTime: string;
  transport?: string;
  people?: number;
  styles?: string[];
  budget?: number;
}

export interface SavedTrip {
  id: string;
  name: string;
  region: string;
  startDate: string;
  endDate: string;
  startTime: string;
  transport: string | null;
  people: number;
  styles: string[];
  budget: number | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateTripResponse {
  message?: string;
  trip?: SavedTrip;
}

export async function saveTrip(input: CreateTripInput): Promise<SavedTrip> {
  const response = await fetch("/api/trips/create", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result: CreateTripResponse | null = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ??
        (response.status === 401
          ? "로그인이 필요합니다. 다시 로그인해주세요."
          : "여행 정보를 저장하지 못했습니다."),
    );
  }

  if (!result?.trip?.id) {
    throw new Error("저장 결과를 확인하지 못했습니다.");
  }

  return result.trip;
}
interface TripListResponse {
  message?: string;
  trips?: SavedTrip[];
}

export async function getMyTrips(signal?: AbortSignal): Promise<SavedTrip[]> {
  const response = await fetch("/api/trips/list", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    signal,
  });

  const result: TripListResponse | null = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ??
        (response.status === 401
          ? "로그인이 필요합니다. 다시 로그인해주세요."
          : "여행 목록을 조회하지 못했습니다."),
    );
  }

  if (!Array.isArray(result?.trips)) {
    throw new Error("여행 목록 응답을 확인하지 못했습니다.");
  }

  return result.trips;
}
