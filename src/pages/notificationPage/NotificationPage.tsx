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

/** 데이터 조회와 권한 처리는 상위에서 연결하고 UI에 전달합니다. */
export default function NotificationPage(props: NotificationProps) {
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
        <Notification {...props} />
      </S.Main>
    </S.Page>
  );
}
