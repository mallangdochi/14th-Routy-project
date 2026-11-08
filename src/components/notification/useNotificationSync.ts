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
   return;
  }
  if (!active || active.userId !== userId) {
   active?.stop();
   selectNotificationUser(userId);
   const refresh = () => { if (document.visibilityState === "visible") void refreshNotifications(); };
   const timer = window.setInterval(refresh, 30000);
   window.addEventListener("focus", refresh);
   document.addEventListener("visibilitychange", refresh);
   active = { userId, consumers: 0, stop: () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", refresh);
    document.removeEventListener("visibilitychange", refresh);
   } };
   // 페이지 진입 시에는 탭 표시 상태와 무관하게 최초 조회합니다.
   void refreshNotifications();
  }
  const session = active;
  session.consumers++;
  return () => {
   session.consumers--;
   if (active === session && session.consumers === 0) {
    session.stop(); active = null;
    // 페이지 이동으로 소비자가 잠시 없어져도 현재 계정의 조회 결과는 유지합니다.
   }
  };
 }, [userId, loading]);
}
