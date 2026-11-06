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
export type JoinRequestResult =
  | { tripId: string; status: "approved"; permission: TripPermission }
  | { tripId: string; status: "pending"; requestedPermission: SharePermission };
/** 승인 전에는 permission이 없으므로 상세 페이지로 이동하면 안 됩니다. */
export async function acceptTripInvite(tripId: string, token: string, password?: string) {
  const result = await request<JoinRequestResult>("accept", tripId, { token, password });
  if (result.tripId !== tripId ||
      (result.status !== "pending" && result.status !== "approved"))
    throw new Error("승인 요청 응답을 확인하지 못했습니다.");
  if (result.status === "approved" &&
      !["owner", "editor", "viewer"].includes(result.permission))
    throw new Error("참여 권한을 확인하지 못했습니다.");
  return result;
}
export function getRoomPassword(tripId: string, signal?: AbortSignal) {
  return request<{ tripId: string; password: string | null }>("password_get", tripId, undefined, signal);
}
export async function refreshRoomPassword(tripId: string): Promise<string> {
  const result = await request<{ tripId: string; password: string }>("password_refresh", tripId, {});
  if (result.tripId !== tripId || !/^[a-f0-9]{32}$/.test(result.password))
    throw new Error("방 비밀번호를 확인하지 못했습니다.");
  return result.password;
}
export type TripJoinRequest = {
  requestId: string;
  userId: string;
  nickname: string;
  permission: SharePermission;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  decidedAt: string | null;
};
export function getTripJoinRequests(tripId: string, signal?: AbortSignal) {
  return request<{ tripId: string; requests: TripJoinRequest[] }>("requests", tripId, undefined, signal);
}
export function getTripJoinStatus(tripId: string, signal?: AbortSignal) {
  return request<{
    tripId: string;
    status: "none" | "pending" | "approved" | "rejected" | "removed";
    permission?: TripPermission;
    requestedPermission?: SharePermission | null;
  }>("request_status", tripId, undefined, signal);
}
export function decideTripJoinRequest(tripId: string, requestId: string, approve: boolean) {
  return request<{ tripId: string; requestId: string; status: "approved" | "rejected" }>(
    approve ? "request_approve" : "request_reject", tripId, { requestId });
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

export type TripInvitePreview = {
  tripId: string;
  tripName: string;
  permission: SharePermission;
  expiresAt: string;
  status: "ready" | "expired";
};
export async function previewTripInvite(token: string, signal?: AbortSignal): Promise<TripInvitePreview> {
  const response = await fetch(`/api/trips/share?${new URLSearchParams({ operation: "preview", token })}`, {
    credentials: "include", cache: "no-store", signal,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message ?? "초대 링크를 확인하지 못했습니다.");
  if (typeof result?.tripId !== "string" || typeof result.tripName !== "string" ||
      !["editor", "viewer"].includes(result.permission) || !["ready", "expired"].includes(result.status))
    throw new Error("초대 링크 응답을 확인하지 못했습니다.");
  return result as TripInvitePreview;
}
