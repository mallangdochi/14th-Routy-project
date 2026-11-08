import type { NotificationItem } from "./notification.types";

const counts = new Map<string, number>();
const listeners = new Set<() => void>();
export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
export const serverSnapshot = () => 0;

/** 처리 상태와 무관하게 전체 알림 내역을 셉니다. 탭 필터 결과를 전달하지 않습니다. */
export function setPendingNotificationItems(userId: string, items: readonly NotificationItem[]) {
  const uniquePending = new Set(items.map((item) => item.id));
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

export function getNotificationCount(userId: string | null | undefined) {
  return userId ? counts.get(userId) ?? 0 : 0;
}
