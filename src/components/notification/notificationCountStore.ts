import { useSyncExternalStore } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotificationSync } from "./useNotificationSync";
import { subscribe, serverSnapshot, getNotificationCount } from "./notificationCountState";
export { setPendingNotificationItems, setPendingNotificationCount } from "./notificationCountState";

/** 기존 사이드바/모바일 헤더의 호출부를 유지하면서 전체 알림 수를 동기화합니다. */
export function usePendingNotificationCount(userId?: string | null) {
  const { user, loading } = useAuth();
  useNotificationSync(user?.id ?? null, loading);
  return useSyncExternalStore(subscribe, () => getNotificationCount(userId), serverSnapshot);
}
