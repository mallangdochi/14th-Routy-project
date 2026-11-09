import type { NotificationItem } from "./notification.types";

import { isPendingInvite, isInviteNotification } from "./notification.utils";
import { getNotificationReadAt } from "./notificationReadState";

const counts = new Map<string, number>();
const listeners = new Set<() => void>();
export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const serverSnapshot = () => 0;

/** 미처리 초대 + 읽지 않은 일정 변경/여행 시작. 항상 전체 목록을 전달합니다. */
export function setPendingNotificationItems(
  userId: string,
  items: readonly NotificationItem[],
) {
  const uniquePending = new Set(
    items.filter((item) => isPendingInvite(item) || (!isInviteNotification(item) && !item.readAt && !getNotificationReadAt(userId, item.id))).map((item) => item.id),
  );
  setPendingNotificationCount(userId, uniquePending.size);
}
/** 위 두 조건의 합산 건수를 조회하는 API를 연결할 때 사용할 수 있습니다. */
export function setPendingNotificationCount(userId: string, value: number) {
  if (!userId) return;
  const count = Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
  if ((counts.get(userId) ?? 0) === count) return;
  counts.set(userId, count);
  for (const listener of listeners) listener();
}

export function getNotificationCount(userId: string | null | undefined) {
  return userId ? (counts.get(userId) ?? 0) : 0;
}
