import styled from "@emotion/styled";
import { dropdownAnimation } from "../../styles/animation";
export const SidebarShell = styled.div({
  position: "relative",
  display: "flex",
  flexShrink: 0,
  height: "100%",
  minHeight: "100vh",

});

export const SidebarContainer = styled.aside({
  position: "relative",

  display: "flex",
  flexDirection: "column",
  width: "200px",
  minWidth: "200px",

  height: "100%",
  minHeight: "100vh",

  padding: "16px 13px 15px",
  backgroundColor: "#FFFFFF",
  overflowY: "auto",
  scrollbarWidth: "thin",
  transition: "width 0.28s ease, min-width 0.28s ease",

  '&[data-collapsed="true"]': {
    width: "104px",
    minWidth: "104px",

    "& [data-sidebar-header]": {

      justifyContent: "center",
      gap: "2px",

    },
    "& [data-sidebar-logo]": {

      width: "auto",

      flex: "0 0 56px",

      height: "40px",

      "& img": {

        objectFit: "contain",

      },
    },

    "& [data-profile-button]": {
      justifyContent: "center",
      padding: "10px 6px",
      gap: "4px",
    },
    "& [data-profile-name], & [data-menu-label], & [data-create-label], & [data-sidebar-banner]":
      {
        display: "none",
      },
    "& [data-profile-arrow]": {
      marginLeft: 0,
      flexShrink: 0,
      "& svg": { width: "18px", height: "18px" },
    },
    "& [data-create-button]": {
      width: "56px",
      height: "56px",
      alignSelf: "center",
      borderRadius: "50%",
      marginBottom: "20px",
      gap: 0,

      "& svg": {
        strokeWidth: 3,
      },
    },
    "& [data-menu-button]": {
      justifyContent: "center",
      height: "52px",
      padding: 0,
      gap: 0,
      "&::before": { top: "4px", height: "44px" },
    },
    "& [data-menu-icon]": {
      width: "28px",
      height: "28px",
      "& svg": { width: "28px", height: "28px" },
    },
    "& [data-create-button] svg": {
      width: "28px",
      height: "28px",
    },

    "& [data-main-navigation]": { gap: "12px" },
    "& [data-bottom-navigation]": { gap: "12px", marginBottom: 0 },
  },
});
export const HeaderStyle = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  width: "100%",
  minWidth: 0,
  gap: "8px",
  padding: "30px 0 20px",
});

export const LogoWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "1 1 0",
  minWidth: 0,
  height: "40px",
  marginBottom: "12px",
  order: -1,
});

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
  borderRadius: "12px",
  backgroundColor: "#ECF8F5",
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
  fontSize: "16px",
  fontWeight: 700,
  whiteSpace: "nowrap",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

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

export const ProfileDropdown = styled.div({
  ...dropdownAnimation,
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
  zIndex: 10,

});

export const DropdownItem = styled.button({
  display: "flex",
  alignItems: "center",
  width: "100%",
  minHeight: "38px",
  padding: "9px 10px",
  gap: "12px",
  borderRadius: "8px",
  color: "#172F32",
  fontSize: "16px",
  fontWeight: 500,
  textAlign: "left",
  whiteSpace: "nowrap",
  transition: "background-color 0.2s ease, color 0.2s ease",

  "& svg": {
    flexShrink: 0,
  },

  "&:hover": {
    backgroundColor: "#ECF8F5",
    color: "#005259",
  },
});

export const DropdownDivider = styled.div({
  width: "100%",
  height: "1px",
  margin: "5px 0",
  backgroundColor: "#E5E9E8",
  flexShrink: 0,
});

export const CreateTripButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "38px",
  gap: "7px",
  marginBottom: "12px",
  borderRadius: "9px",
  backgroundColor: "#005259",
  color: "#FFFFFF",
  fontSize: "16px",
  fontWeight: 700,
  whiteSpace: "nowrap",
  flexShrink: 0,
  transition: "background-color 0.2s ease",

  "&:hover": {
    backgroundColor: "#003E43",
  },
});

export const MainNavigation = styled.nav({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "5px",
});

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
  borderRadius: "9px",

  color: $active ? "#005259" : "#333333",
  fontSize: "16px",
  fontWeight: $active ? 700 : 400,
  textAlign: "left",
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

export const BottomSection = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginTop: "auto",
  paddingTop: "30px",
  flexShrink: 0,
});

export const BottomNavigation = styled.nav({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "5px",
  marginBottom: "20px",
});

export const BannerWrapper = styled.div({
  width: "100%",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  borderRadius: "12px",
  backgroundColor: "#C7F2F1",
  flexShrink: 0,
});

export const BannerImage = styled.img({
  height: "100%",
  objectFit: "cover",
});

export const CollapseButton = styled.button({
  position: "absolute",
  top: 0,
  right: 0,
  left: "auto",
  zIndex: 20,
  transform: "none",

  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-end",
  width: "48px",
  height: "52px",
  padding: "7px 5px 0 0",

  borderRadius: 0,
  color: "#FFFFFF",
  isolation: "isolate",
  filter: "drop-shadow(-3px 5px 4px rgba(13, 62, 65, 0.2))",

  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: -1,
    background: "linear-gradient(135deg, #D6E6E2 0%, #F7FCFA 48%, #FFFFFF 75%)",
    clipPath: "polygon(0 0, 100% 100%, 20% 62%, 16% 30%)",
    pointerEvents: "none",
  },

  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: -1,

    backgroundColor: "#00666b",
    clipPath: "polygon(0 0, 100% 0, 100% 100%)",
    transition: "filter 0.2s ease",
    pointerEvents: "none",
  },

  "& svg": {
    width: "20px",
    height: "20px",
    flexShrink: 0,
    transition: "transform 0.28s ease",
  },

  '&[aria-expanded="true"] svg': {
    transform: "rotate(180deg)",
  },

  "&:hover::after": {
    filter: "brightness(1.12)",
  },

  "&:focus-visible": {
    outline: "3px solid #EB654B",
    outlineOffset: "3px",
  },

  "@media (prefers-reduced-motion: reduce)": {
    "&::after, & svg": {
      transition: "none",
    },
  },
});

export const Tooltip = styled.div({
  position: "fixed",
  zIndex: 1000,
  transform: "translateY(-50%)",
  maxWidth: "calc(100vw - 16px)",
  padding: "8px 12px",
  borderRadius: "8px",
  backgroundColor: "#005259",
  color: "#FFFFFF",
  fontSize: "16px",
  fontWeight: 500,
  overflowWrap: "anywhere",
  pointerEvents: "none",
});
