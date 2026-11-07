import { useNotificationSync } from "../../components/notification/useNotificationSync";
import { useAuth } from "../../contexts/AuthContext";
import { decideTripJoinRequest } from "../../api/tripSharing";
import { dismissNotifications, restoreNotifications } from "../../api/notifications";
import { refreshNotifications, updateNotificationItems, useNotificationState } from "../../components/notification/notificationLiveStore";
import type { NotificationItem } from "../../components/notification/notification.types";
import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import MobileHeader from "../../components/mobileBanner/MobileHeader";
import MobileNav from "../../components/mobileBanner/MobileFooter";
import Notification, {
  type NotificationProps,
} from "../../components/notification/Notification";
import * as S from "./notificationPageStyle";

const mobileQuery = "(max-width: 767px)";
const subscribe = (notify: () => void) => {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const getMobile = () => window.matchMedia(mobileQuery).matches;
const getServerMobile = () => false;

export default function NotificationPage() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const state = useNotificationState();
  const userId = user?.id ?? "";
  useNotificationSync(userId || null, authLoading);
  const current = state.userId === userId;
  const props: NotificationProps = {
    items: current ? state.items : [],
    loading: (authLoading && !userId) || (Boolean(userId) && (!current || state.loading)),
    error: authError || (!userId && !authLoading ? "로그인 후 알림을 확인해주세요." : current ? state.error : ""),
    onRetry: () => { void refreshNotifications(); },
    onDecision: async (item, decision) => {
      const result = await decideTripJoinRequest(item.tripId, item.id, decision === "approved");
      if (result.tripId !== item.tripId || result.requestId !== item.id || result.status !== decision)
        throw new Error("승인 처리 결과를 확인하지 못했습니다.");
      updateNotificationItems(userId, items => items.map(entry => entry.id === item.id
        ? { ...entry, status: result.status, decidedAt: new Date().toISOString() } : entry));
      void refreshNotifications();
    },
    onDelete: async (item) => {
      await dismissNotifications([item.id]);
      updateNotificationItems(userId, items => items.filter(entry => entry.id !== item.id));
    },
    onRestore: async (items: NotificationItem[]) => {
      await restoreNotifications(items.map(item => item.id));
      updateNotificationItems(userId, previous => [...previous.filter(entry => !items.some(item => item.id === entry.id)), ...items]
        .sort((a,b) => Date.parse(b.requestedAt)-Date.parse(a.requestedAt)));
    },
  };
  const mobile = useSyncExternalStore(subscribe, getMobile, getServerMobile);
  const pageRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    // 공통 컴포넌트의 실제 너비/높이에 맞춰 콘텐츠 공간을 확보합니다.
    const bindings = mobile
      ? ([
          [headerRef.current, "--notification-header-height"],
          [navRef.current, "--notification-nav-height"],
        ] as const)
      : ([[sidebarRef.current, "--notification-sidebar-width"]] as const);
    const observer = new ResizeObserver(() => measure());
    const measure = () => {
      for (const [wrapper, property] of bindings) {
        const element = wrapper?.firstElementChild;
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        const value =
          property === "--notification-sidebar-width"
            ? rect.width
            : rect.height;
        if (value > 0) page.style.setProperty(property, `${value}px`);
      }
    };
    for (const [wrapper] of bindings)
      if (wrapper?.firstElementChild)
        observer.observe(wrapper.firstElementChild);
    measure();
    return () => observer.disconnect();
  }, [mobile]);
  return (
    <S.Page ref={pageRef}>
      {mobile ? (
        <>
          <S.MobileTop ref={headerRef}>
            <MobileHeader />
          </S.MobileTop>
          <S.MobileBottom ref={navRef}>
            <MobileNav />
          </S.MobileBottom>
        </>
      ) : (
        <S.DesktopNavigation ref={sidebarRef}>
          <MainSidebar />
        </S.DesktopNavigation>
      )}
      <S.Main>
        <Notification key={userId || "guest"} {...props} />
      </S.Main>
    </S.Page>
  );
}
