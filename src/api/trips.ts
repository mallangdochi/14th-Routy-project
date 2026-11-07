import { getTripPermission, type TripPermission } from "../utils/tripPermissions";
import { getSharedTripDetail } from "./tripSharing";

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
  permission?: TripPermission;
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

  // Older list handlers omit permission. Verify it against the existing authenticated
  // detail API rather than rejecting an otherwise valid list or assuming host access.
  // Bound only the compatibility requests; the new list API needs no extra lookups.
  const trips: SavedTrip[] = [];
  for (let offset = 0; offset < result.trips.length; offset += 4) {
    signal?.throwIfAborted();
    const batch = await Promise.all(result.trips.slice(offset, offset + 4).map(async (trip) => {
      if (!trip || typeof trip.id !== "string" || !trip.id) {
        throw new Error("여행 목록 응답을 확인하지 못했습니다.");
      }
      const permission = getTripPermission(trip);
      if (permission) return { ...trip, permission };

      const detail = await getSharedTripDetail(trip.id, signal);
      const confirmedPermission = getTripPermission(detail);
      if (detail.trip?.id !== trip.id || !confirmedPermission) {
        throw new Error("여행 권한을 확인하지 못했습니다. 다시 불러와주세요.");
      }
      return { ...trip, permission: confirmedPermission };
    }));
    trips.push(...batch);
  }
  signal?.throwIfAborted();
  return trips;
}
export async function deleteTrip(tripId: string): Promise<void> {
  const response = await fetch("/api/trips/delete", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tripId }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "여행을 삭제하지 못했습니다.");
  }

  if (data?.tripId !== tripId || data?.deleted !== true) {
    throw new Error(
      "삭제 결과를 확인하지 못했습니다. 내 여행 목록에서 확인해주세요.",
    );
  }
}
