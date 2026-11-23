// import type { NotificationItem } from "../components/notification/notification.types";
// async function request(action: string, ids?: string[], signal?: AbortSignal) {
//  const response = await fetch(`/api/profile/notifications?action=${ids ? (action === "notification_dismiss" ? "dismiss" : "restore") : "feed"}`, {
//   method: ids ? "POST" : "GET", credentials: "include", cache: "no-store", signal,
//   ...(ids ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ids }) } : {}),
//  });
//  const data = await response.json().catch(() => null);
//  if (!response.ok) throw new Error(data?.message ?? "알림을 처리하지 못했습니다.");
//  return data;
// }
// export async function loadNotifications(signal?: AbortSignal): Promise<NotificationItem[]> {
//  const data = await request("notifications", undefined, signal);
//  if (!Array.isArray(data?.items) || data.items.some((v: NotificationItem) => !v ||
//   typeof v.id !== "string" || typeof v.tripId !== "string" || typeof v.tripName !== "string" ||
//   typeof v.requesterName !== "string" || !["editor","viewer"].includes(v.permission) ||
//   !["pending","approved","rejected"].includes(v.status) || !Number.isFinite(Date.parse(v.requestedAt))))
//   throw new Error("알림 응답을 확인하지 못했습니다.");
//  return data.items;
// }
// export async function dismissNotifications(ids: string[]) {
//  const data = await request("notification_dismiss", ids);
//  if (data?.success !== true) throw new Error("알림 삭제 결과를 확인하지 못했습니다.");
// }
// export async function restoreNotifications(ids: string[]) {
//  const data = await request("notification_restore", ids);
//  if (data?.success !== true) throw new Error("알림 복원 결과를 확인하지 못했습니다.");
// }

import type {
  NotificationItem,
  NotificationKind,
} from "../components/notification/notification.types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function normalizeNotification(value: unknown): NotificationItem {
  if (!isRecord(value)) {
    throw new Error("알림 응답을 확인하지 못했습니다.");
  }

  const kind: unknown = value.kind ?? "invite";

  if (
    kind !== "invite" &&
    kind !== "schedule_changed" &&
    kind !== "trip_start"
  ) {
    throw new Error("지원하지 않는 알림 종류입니다.");
  }

  const id = value.id;
  const tripId = value.tripId ?? value.trip_id;
  const tripName = value.tripName ?? value.trip_name;
  const requestedAt = value.requestedAt ?? value.created_at;

  if (
    typeof id !== "string" ||
    typeof tripId !== "string" ||
    typeof tripName !== "string" ||
    !isValidDate(requestedAt)
  ) {
    throw new Error("알림 응답을 확인하지 못했습니다.");
  }

  const requesterName = value.requesterName ?? value.requester_name;
  const permission = value.permission;
  const status = value.status;

  if (
    kind === "invite" &&
    (typeof requesterName !== "string" ||
      (permission !== "editor" && permission !== "viewer") ||
      (status !== "pending" && status !== "approved" && status !== "rejected"))
  ) {
    throw new Error("여행 초대 알림 응답을 확인하지 못했습니다.");
  }

  const readAt = value.readAt ?? value.read_at;
  const decidedAt = value.decidedAt ?? value.decided_at;
  const avatarUrl = value.avatarUrl ?? value.avatar_url;
  const message = value.message ?? value.body;
  const placeName = value.placeName ?? value.place_name;
  const previousTime = value.previousTime ?? value.previous_time;
  const nextTime = value.nextTime ?? value.next_time;
  const tripDateLabel = value.tripDateLabel ?? value.trip_date_label;

  return {
    id,
    requestId:
      typeof value.requestId === "string" ? value.requestId : undefined,
    kind: kind as NotificationKind,
    tripId,
    tripName,
    requestedAt,

    // 기존 NotificationItem의 필수 필드 호환용입니다.
    // 일정 변경·여행 시작 알림의 실제 승인 상태를 뜻하지 않습니다.
    requesterName: typeof requesterName === "string" ? requesterName : "",
    permission: permission === "editor" ? "editor" : "viewer",
    status: status === "pending" || status === "rejected" ? status : "approved",

    readAt: isValidDate(readAt) ? readAt : null,
    decidedAt: isValidDate(decidedAt) ? decidedAt : null,
    avatarUrl: typeof avatarUrl === "string" ? avatarUrl : null,
    message: typeof message === "string" ? message : undefined,
    placeName: typeof placeName === "string" ? placeName : undefined,
    previousTime: typeof previousTime === "string" ? previousTime : undefined,
    nextTime: typeof nextTime === "string" ? nextTime : undefined,
    tripDateLabel:
      typeof tripDateLabel === "string" ? tripDateLabel : undefined,
    day:
      typeof value.day === "number" && Number.isFinite(value.day)
        ? value.day
        : undefined,
  };
}

async function request(
  action: "feed" | "dismiss" | "restore",
  ids?: string[],
  signal?: AbortSignal,
): Promise<unknown> {
  const isMutation = action !== "feed";

  const response = await fetch(`/api/profile/notifications?action=${action}`, {
    method: isMutation ? "POST" : "GET",
    credentials: "include",
    cache: "no-store",
    signal,
    ...(isMutation
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        }
      : {}),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      isRecord(data) && typeof data.message === "string"
        ? data.message
        : "알림을 처리하지 못했습니다.",
    );
  }

  return data;
}

export async function loadNotifications(
  signal?: AbortSignal,
): Promise<NotificationItem[]> {
  const data = await request("feed", undefined, signal);

  const items = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.items)
      ? data.items
      : null;

  if (!items) {
    throw new Error("알림 응답을 확인하지 못했습니다.");
  }

  return items.map(normalizeNotification);
}

export async function dismissNotifications(ids: string[]) {
  const data = await request("dismiss", ids);

  if (!isRecord(data) || data.success !== true) {
    throw new Error("알림 삭제 결과를 확인하지 못했습니다.");
  }
}

export async function restoreNotifications(ids: string[]) {
  const data = await request("restore", ids);

  if (!isRecord(data) || data.success !== true) {
    throw new Error("알림 복원 결과를 확인하지 못했습니다.");
  }
}
