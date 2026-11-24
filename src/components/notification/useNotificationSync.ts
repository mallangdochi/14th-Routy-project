import { syncBrowserPushSession } from "../../api/browserPush";
import { useEffect } from "react";
import { refreshNotifications, selectNotificationUser } from "./notificationLiveStore";

type Session = { userId: string; consumers: number; stop: () => void };
let active: Session | null = null;

/** App과 알림 페이지에서 함께 사용해도 타이머와 이벤트는 하나만 등록합니다. */
export function useNotificationSync(userId: string | null, loading: boolean) {
 useEffect(() => {
  if (loading && !userId) return;
  if (!userId) {
   active?.stop(); active = null;
   selectNotificationUser(null);
   void syncBrowserPushSession(null).catch(() => undefined);
   return;
  }
  if (!active || active.userId !== userId) {
   active?.stop();
   selectNotificationUser(userId);
   void syncBrowserPushSession(userId).catch(() => undefined);
   let lastRefresh = Date.now();
   const refresh = () => {
    if (document.visibilityState !== "visible" || Date.now() - lastRefresh < 5000) return;
    lastRefresh = Date.now();
    void refreshNotifications();
   };
   const settingsRefresh = () => { void refreshNotifications(true); };
   const timer = window.setInterval(refresh, 30000);
   window.addEventListener("focus", refresh);
   window.addEventListener("routy:schedule-saved", settingsRefresh);
   window.addEventListener("routy:notification-settings-changed", settingsRefresh);
   document.addEventListener("visibilitychange", refresh);
   active = { userId, consumers: 0, stop: () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", refresh);
    window.removeEventListener("routy:schedule-saved", settingsRefresh);
    window.removeEventListener("routy:notification-settings-changed", settingsRefresh);
    document.removeEventListener("visibilitychange", refresh);
   } };
   // 페이지 진입 시에는 탭 표시 상태와 무관하게 최초 조회합니다.
   void refreshNotifications();
  }
  const session = active;
  session.consumers++;
  return () => {
   session.consumers--;
   // StrictMode's immediate cleanup/setup reuses the same session.
   queueMicrotask(() => {
    if (active === session && session.consumers === 0) {
     session.stop(); active = null;
    }
   });
  };
 }, [userId, loading]);
}
