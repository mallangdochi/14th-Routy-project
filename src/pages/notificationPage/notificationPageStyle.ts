import styled from "@emotion/styled";
export const Page = styled.div({
  position: "fixed", inset: 0, backgroundColor: "#FEFBF5",
  "--notification-sidebar-width": "230px",
  "--notification-header-height": "64px",
  "--notification-nav-height": "80px",
});
export const DesktopNavigation = styled.div({ position: "absolute", inset: "0 auto 0 0" });
export const MobileTop = styled.div({ position: "fixed", top: 0, insetInline: 0, zIndex: 100 });
export const MobileBottom = styled.div({ position: "fixed", bottom: 0, insetInline: 0, zIndex: 100 });
export const Main = styled.main({
  position: "absolute", inset: 0, marginLeft: "var(--notification-sidebar-width)", minWidth: 0,
  overflowY: "auto", overflowX: "hidden", overscrollBehaviorY: "contain", scrollbarGutter: "stable",
  "@media (max-width: 767px)": {
    marginLeft: 0, top: "var(--notification-header-height)", bottom: "var(--notification-nav-height)",
    scrollbarGutter: "auto",
  },
});
