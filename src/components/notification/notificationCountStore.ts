import { useSyncExternalStore } from "react";
import type { NotificationItem } from "./notification.types";

const counts = new Map<string, number>();
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
const serverSnapshot = () => 0;

/** 전체 승인 요청 목록을 전달합니다. 탭별 필터링 결과를 전달하면 안 됩니다. */
export function setPendingNotificationItems(userId: string, items: readonly NotificationItem[]) {
  const uniquePending = new Set(items.filter((item) => item.status === "pending").map((item) => item.id));
  setPendingNotificationCount(userId, uniquePending.size);
}
/** 전체 미처리 건수를 조회하는 API를 연결할 때 사용할 수 있습니다. */
export function setPendingNotificationCount(userId: string, value: number) {
  if (!userId) return;
  const count = Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
  if ((counts.get(userId) ?? 0) === count) return;
  counts.set(userId, count);
  for (const listener of listeners) listener();
}
export function usePendingNotificationCount(userId?: string | null) {
  return useSyncExternalStore(subscribe, () => userId ? counts.get(userId) ?? 0 : 0, serverSnapshot);
}
