import type { SavedTrip } from "./trips";
import type { TripParticipantsSource } from "../components/modal/trip-participants/TripParticipants";
export type SharePermission = "editor" | "viewer";
export type TripPermission = SharePermission | "owner";
export type InviteResult = {
  tripId: string;
  token: string;
  permission: SharePermission;
  expiresAt: string;
};
async function request<T>(
  action: string,
  tripId: string,
  body?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(
    body
      ? "/api/trips/share"
      : `/api/trips/share?${new URLSearchParams({ operation: action, tripId })}`,
    {
      method: body ? "POST" : "GET",
      credentials: "include",
      cache: "no-store",
      signal,
      ...(body
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...body, action, tripId }),
          }
        : {}),
    },
  );
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(data?.message ?? "여행 공유 요청을 처리하지 못했습니다.");
  if (!data || typeof data !== "object")
    throw new Error("서버 응답을 확인하지 못했습니다.");
  return data as T;
}
export const loadTripParticipants: TripParticipantsSource = (tripId, signal) =>
  request("participants", tripId, undefined, signal);
export async function getSharedTripDetail(
  tripId: string,
  signal?: AbortSignal,
) {
  const result = await request<{ trip: SavedTrip; permission: TripPermission }>(
    "detail",
    tripId,
    undefined,
    signal,
  );
  if (
    result.trip?.id !== tripId ||
    !["owner", "editor", "viewer"].includes(result.permission)
  )
    throw new Error("여행 조회 응답을 확인하지 못했습니다.");
  return result;
}
export async function createTripInvite(
  tripId: string,
  permission: SharePermission,
) {
  const result = await request<InviteResult>("create", tripId, { permission });
  if (
    result.tripId !== tripId ||
    result.permission !== permission ||
    !/^[a-f0-9]{64}$/.test(result.token)
  )
    throw new Error("초대 링크 응답을 확인하지 못했습니다.");
  return result;
}
export async function acceptTripInvite(tripId: string, token: string) {
  const result = await request<{ tripId: string; permission: TripPermission }>(
    "accept",
    tripId,
    { token },
  );
  if (
    result.tripId !== tripId ||
    !["owner", "editor", "viewer"].includes(result.permission)
  )
    throw new Error("초대 수락 응답을 확인하지 못했습니다.");
  return result;
}
export function revokeTripInvites(tripId: string, permission: SharePermission) {
  return request<{ revoked: boolean }>("revoke", tripId, { permission });
}

export type TripMembersResult = {
  tripId: string;
  participants: import("../components/modal/trip-participants/TripParticipants").TripParticipant[];
  permission: TripPermission;
  editorLimit: number;
  editorCount: number;
};
export async function getTripMembers(tripId: string, signal?: AbortSignal) {
  const result = await request<TripMembersResult>(
    "participants",
    tripId,
    undefined,
    signal,
  );
  if (
    result.tripId !== tripId ||
    !Array.isArray(result.participants) ||
    !Number.isInteger(result.editorLimit) ||
    result.editorLimit < 1 ||
    !["owner", "editor", "viewer"].includes(result.permission)
  )
    throw new Error(
      "멤버 조회 결과를 확인하지 못했습니다. 멤버 관리 SQL 적용 여부를 확인해주세요.",
    );
  const ids = new Set<string>();
  for (const member of result.participants) {
    if (
      !member ||
      typeof member.userId !== "string" ||
      ids.has(member.userId) ||
      typeof member.nickname !== "string" ||
      !["owner", "editor", "viewer"].includes(member.permission)
    )
      throw new Error("참여자 응답을 확인해주세요.");
    ids.add(member.userId);
  }
  return result;
}
export function saveTripMembers(
  tripId: string,
  changes: {
    editorLimit: number;
    removedUserIds?: string[];
    permissions: { userId: string; permission: SharePermission }[];
  },
) {
  return request<{ tripId: string; editorLimit: number; updatedAt: string }>(
    "members_save",
    tripId,
    changes,
  );
}
export function removeTripMember(tripId: string, userId: string) {
  return request<{ tripId: string; removed: boolean }>(
    "member_remove",
    tripId,
    { userId },
  );
}
export function leaveTrip(tripId: string) {
  return request<{ tripId: string; left: boolean }>("leave", tripId, {});
}
