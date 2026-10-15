import styled from "@emotion/styled";

interface MenuButtonProps {
  $active: boolean;
}

export const SidebarContainer = styled.aside({
  width: "230px",
  minWidth: "230px",
  height: "100dvh",
  position: "sticky",
  top: 0,
  alignSelf: "flex-start",
  flexShrink: 0,
  overflowY: "auto",
  zIndex: 10,
  padding: "16px 16px 17px",

  display: "flex",
  flexDirection: "column",

  background: "#005044",
  color: "#ffffff",
});

export const LogoArea = styled.div({
  height: "36px",
  paddingLeft: "6px",
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
});

export const Logo = styled.img({
  width: "88px",
  height: "auto",
  display: "block",
  objectFit: "contain",
  filter: "brightness(0) invert(1)",
});

export const UserSection = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "17px",
  flexShrink: 0,
});

export const Avatar = styled.img({
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  objectFit: "cover",
});

export const UserName = styled.span({
  marginTop: "18px",
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: 700,
  lineHeight: "28px",
  textAlign: "center",
});

export const Navigation = styled.nav({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  marginTop: "28px",
});

export const MenuButton = styled.button<MenuButtonProps>(({ $active }) => ({
  width: "100%",
  height: "48px",
  padding: "0 16px",

  display: "flex",
  alignItems: "center",
  gap: "13px",

  borderRadius: "9px",

  background: $active ? "#edf8f5" : "transparent",
  color: $active ? "#005044" : "#ffffff",

  fontSize: "16px",
  fontWeight: $active ? 700 : 500,
  textAlign: "left",
  whiteSpace: "nowrap",

  transition: "background 0.2s, color 0.2s",

  "& svg": {
    flexShrink: 0,
  },

  "&:hover": {
    background: $active ? "#edf8f5" : "rgba(255, 255, 255, 0.1)",
  },
}));

export const Footer = styled.div({
  marginTop: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "3px",

  "@media (max-height: 520px)": {
    marginTop: "28px",
  },
});

export const Divider = styled.div({
  width: "100%",
  height: "2px",
  marginBottom: "14px",
  background: "rgba(255, 255, 255, 0.35)",
});

export const FooterButton = styled.button({
  width: "100%",
  minHeight: "48px",
  padding: "0 16px",

  display: "flex",
  alignItems: "center",
  gap: "13px",

  borderRadius: "8px",
  background: "transparent",

  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 500,
  textAlign: "left",
  whiteSpace: "nowrap",

  transition: "background 0.2s",

  "& svg": {
    flexShrink: 0,
  },

  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
  },
});
