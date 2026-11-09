import type { NotificationItem, NotificationTab, NotificationCategory } from "./notification.types";

export const isInviteNotification = (item: NotificationItem) => !item.kind || item.kind === "invite";
export const isPendingInvite = (item: NotificationItem) => isInviteNotification(item) && item.status === "pending";
export function filterNotifications(items: readonly NotificationItem[], tab: NotificationTab, category: NotificationCategory = "all") {
  return items.filter(item => (category === "all" || (item.kind ?? "invite") === category) &&
    (tab === "all" || (isInviteNotification(item) && (tab === "pending" ? item.status === "pending" : item.status === "approved" || item.status === "rejected"))));
}

export function relativeTime(value: string, now: number) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const minutes = Math.max(0, Math.floor((now - date.getTime()) / 60000));
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`;
  return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric" }).format(date);
}
