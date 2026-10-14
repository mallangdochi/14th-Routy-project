import styled from "@emotion/styled";

// 사이드바 전체
export const SidebarContainer = styled.aside({
  display: "flex",
  flexDirection: "column",
  width: "200px",
  minWidth: "200px",

  height: "100%",
  minHeight: "100vh",

  padding: "16px 13px 15px",
  backgroundColor: "#FFFFFF",
  boxSizing: "border-box",
  overflowY: "auto",
  scrollbarWidth: "thin",
});

// 로고
export const LogoWrapper = styled.div({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  height: "47px",
  marginBottom: "12px",
  flexShrink: 0,
});

export const LogoImage = styled.img({
  display: "block",
  width: "100px",
  height: "auto",
  objectFit: "contain",
});

// 프로필
export const ProfileWrapper = styled.div({
  position: "relative",
  width: "100%",
  marginBottom: "19px",
  flexShrink: 0,
});

export const ProfileButton = styled.button({
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "67px",
  padding: "10px 12px",
  gap: "12px",
  border: "none",
  borderRadius: "12px",
  backgroundColor: "#ECF8F5",
  cursor: "pointer",
  boxSizing: "border-box",
});

export const ProfileImage = styled.img({
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
});

export const ProfileName = styled.span({
  color: "#183B40",
  fontSize: "13px",
  fontWeight: 700,
  whiteSpace: "nowrap",
});

// 프로필 화살표 Props
interface ProfileArrowProps {
  $isOpen: boolean;
}

export const ProfileArrow = styled.span<ProfileArrowProps>(({ $isOpen }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "auto",
  color: "#172F32",
  transform: $isOpen ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 0.2s ease",
}));

// 프로필 드롭다운
export const ProfileDropdown = styled.div({
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  width: "100%",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  borderRadius: "12px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 5px 18px rgba(0, 0, 0, 0.12)",
  boxSizing: "border-box",
  zIndex: 10,
});

// 드롭다운 항목
export const DropdownItem = styled.button({
  display: "flex",
  alignItems: "center",
  width: "100%",
  minHeight: "38px",
  padding: "9px 10px",
  gap: "12px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "transparent",
  color: "#172F32",
  fontSize: "12px",
  fontWeight: 500,
  textAlign: "left",
  whiteSpace: "nowrap",
  cursor: "pointer",
  boxSizing: "border-box",
  transition: "background-color 0.2s ease, color 0.2s ease",

  "& svg": {
    flexShrink: 0,
  },

  "&:hover": {
    backgroundColor: "#ECF8F5",
    color: "#005259",
  },
});

// 로그아웃 구분선
export const DropdownDivider = styled.div({
  width: "100%",
  height: "1px",
  margin: "5px 0",
  backgroundColor: "#E5E9E8",
  flexShrink: 0,
});

// 새 여행 만들기
export const CreateTripButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "38px",
  gap: "7px",
  marginBottom: "12px",
  border: "none",
  borderRadius: "9px",
  backgroundColor: "#005259",
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 700,
  whiteSpace: "nowrap",
  cursor: "pointer",
  flexShrink: 0,
  transition: "background-color 0.2s ease",

  "&:hover": {
    backgroundColor: "#003E43",
  },
});

// 메인 메뉴
export const MainNavigation = styled.nav({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "5px",
});

// 메뉴 버튼 Props
interface MenuButtonProps {
  $active: boolean;
}

export const MenuButton = styled.button<MenuButtonProps>(({ $active }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "35px",
  padding: "0 13px",
  gap: "12px",
  border: "none",
  borderRadius: "9px",

  color: $active ? "#005259" : "#333333",
  fontSize: "12px",
  fontWeight: $active ? 700 : 400,
  textAlign: "left",
  cursor: "pointer",
  isolation: "isolate",

  transition: "color 0.25s ease",

  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "9px",
    backgroundColor: "#ECF8F5",
    zIndex: -1,

    clipPath: $active
      ? "inset(0 0 0 0 round 9px)"
      : "inset(0 0 100% 0 round 9px)",

    transition: "clip-path 0.24s cubic-bezier(0.22, 1, 0.36, 1)",
  },

  "&::before": {
    content: '""',
    position: "absolute",
    left: "-9px",
    top: "2px",
    width: "3px",
    height: "29px",
    borderRadius: "3px",
    backgroundColor: "#005259",

    clipPath: $active ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",

    transition: "clip-path 0.24s cubic-bezier(0.22, 1, 0.36, 1)",
  },

  "&:hover": {
    color: "#005259",
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",

    "&::before, &::after": {
      transition: "none",
    },
  },
}));

export const MenuIcon = styled.span({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "18px",
  height: "18px",
  flexShrink: 0,
});

export const MenuLabel = styled.span({
  whiteSpace: "nowrap",
});

// 하단 전체
export const BottomSection = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginTop: "auto",
  paddingTop: "30px",
  flexShrink: 0,
});

// 하단 메뉴
export const BottomNavigation = styled.nav({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "5px",
  marginBottom: "20px",
});

// 하단 마스코트 배너
export const BannerWrapper = styled.div({
  width: "100%",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  borderRadius: "12px",
  backgroundColor: "#C7F2F1",
  flexShrink: 0,
});

export const BannerImage = styled.img({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
});
