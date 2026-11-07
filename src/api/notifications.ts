import type { NotificationItem } from "../components/notification/notification.types";
async function request(action: string, ids?: string[], signal?: AbortSignal) {
 const response = await fetch(ids ? "/api/trips/share" : "/api/trips/share?operation=notifications", {
  method: ids ? "POST" : "GET", credentials: "include", cache: "no-store", signal,
  ...(ids ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ids }) } : {}),
 });
 const data = await response.json().catch(() => null);
 if (!response.ok) throw new Error(data?.message ?? "알림을 처리하지 못했습니다.");
 return data;
}
export async function loadNotifications(signal?: AbortSignal): Promise<NotificationItem[]> {
 const data = await request("notifications", undefined, signal);
 if (!Array.isArray(data?.items) || data.items.some((v: NotificationItem) => !v ||
  typeof v.id !== "string" || typeof v.tripId !== "string" || typeof v.tripName !== "string" ||
  typeof v.requesterName !== "string" || !["editor","viewer"].includes(v.permission) ||
  !["pending","approved","rejected"].includes(v.status) || !Number.isFinite(Date.parse(v.requestedAt))))
  throw new Error("알림 응답을 확인하지 못했습니다.");
 return data.items;
}
export async function dismissNotifications(ids: string[]) {
 const data = await request("notification_dismiss", ids);
 if (data?.success !== true) throw new Error("알림 삭제 결과를 확인하지 못했습니다.");
}
export async function restoreNotifications(ids: string[]) {
 const data = await request("notification_restore", ids);
 if (data?.success !== true) throw new Error("알림 복원 결과를 확인하지 못했습니다.");
}
