import styled from "@emotion/styled";
import { Link } from "react-router";

interface MenuButtonProps {
  $active: boolean;
}

export const SidebarContainer = styled.aside({
  width: "207px",
  minWidth: "207px",
  height: "100dvh",

  position: "sticky",
  top: 0,
  alignSelf: "flex-start",
  flexShrink: 0,
  overflowY: "auto",
  zIndex: 10,
  padding: "14.4px 14.4px 15.3px",

  display: "flex",
  flexDirection: "column",

  background: "#005044",
  color: "#ffffff",

  "& .guest-avatar": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    height: 72,
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: "#E8F6F2",
    color: "#8FBDBB",

    "& svg": {
      width: "39.6px",
      height: "39.6px",
    },
  },

  "@media (max-width: 767px)": {
    position: "relative",
    width: "100%",
    minWidth: 0,
    height: "100%",
    minHeight: 0,
    alignSelf: "stretch",

    '&[data-logged-in="false"]': {
      display: "none",
    },
  },
});

export const LogoArea = styled(Link)({
  height: "40px",
  paddingLeft: "5.4px",
  display: "flex",
  alignItems: "center",
  alignSelf: "flex-start",
  flexShrink: 0,
  borderRadius: "3.6px",
  margin: "18px 0",

  "&:focus-visible": {
    outline: "2.7px solid #ffffff",
    outlineOffset: "3.6px",
  },
});

export const Logo = styled.img({
  width: "auto",
  height: "100%",
  display: "block",
  objectFit: "contain",
  flexShrink: 0,
  filter: "brightness(0) invert(1)",
});

export const UserSection = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "15.3px",
  flexShrink: 0,
});

export const Avatar = styled.img({
  width: "81px",
  height: "81px",
  borderRadius: "50%",
  objectFit: "cover",
});

export const UserName = styled.span({
  marginTop: "16.2px",
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 700,
  lineHeight: "25.2px",
  textAlign: "center",
});

export const Navigation = styled.nav({
  display: "flex",
  flexDirection: "column",
  gap: "4.5px",
  marginTop: "25.2px",
  flexShrink: 0,
});

export const MenuButton = styled.button<MenuButtonProps>(({ $active }) => ({
  width: "100%",
  height: "43.2px",
  padding: "0 14.4px",

  display: "flex",
  alignItems: "center",
  gap: "11.7px",
  flexShrink: 0,

  borderRadius: "8.1px",
  background: $active ? "#edf8f5" : "transparent",
  color: $active ? "#005044" : "#ffffff",

  fontSize: "14.4px",
  fontWeight: $active ? 700 : 500,
  textAlign: "left",
  whiteSpace: "nowrap",

  transition: "background 0.2s, color 0.2s",

  "& svg": {
    width: "18px",
    height: "18px",
    flexShrink: 0,
  },

  "&:hover": {
    background: $active ? "#edf8f5" : "rgba(255, 255, 255, 0.1)",
  },
}));

export const Footer = styled.div({
  marginTop: "auto",
  paddingTop: "25.2px",
  display: "flex",
  flexDirection: "column",
  gap: "2.7px",
  flexShrink: 0,

  "@media (max-height: 520px)": {
    marginTop: "25.2px",
    paddingTop: 0,
  },
});

export const Divider = styled.div({
  width: "100%",
  height: "1.8px",
  marginBottom: "12.6px",
  background: "rgba(255, 255, 255, 0.35)",
  flexShrink: 0,
});

export const FooterButton = styled.button({
  width: "100%",
  minHeight: "43.2px",
  padding: "0 14.4px",

  display: "flex",
  alignItems: "center",
  gap: "11.7px",
  flexShrink: 0,

  borderRadius: "7.2px",
  background: "transparent",
  color: "#ffffff",

  fontSize: "14.4px",
  fontWeight: 500,
  textAlign: "left",
  whiteSpace: "nowrap",

  transition: "background 0.2s",

  "& svg": {
    width: "18.9px",
    height: "18.9px",
    flexShrink: 0,
  },

  "& svg.lucide-plane": {
    width: "19.8px",
    height: "19.8px",
  },

  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
  },
});
