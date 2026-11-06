import type { NotificationItem, NotificationTab } from "./notification.types";

export function filterNotifications(items: readonly NotificationItem[], tab: NotificationTab) {
  return items.filter((item) => tab === "all" || (tab === "pending"
    ? item.status === "pending"
    : item.status === "approved" || item.status === "rejected"));
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
