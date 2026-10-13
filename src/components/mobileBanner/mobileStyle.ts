import styled from "@emotion/styled";
import { Link } from "react-router";

export const HeaderStyle = styled.header({
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 10,

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  width: "100%",
  minHeight: "56px",
  padding: "15px 20px",
  backgroundColor: "#fefefd",

  "& .logo-wrapper": {
    width: 97,
    height: 36,
  },
  "& .alarmbell-svg": {
    width: 19,
    height: 23,
  },
});

export const NavStyle = styled.nav({
  position: "fixed",
  bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
  left: "50%",
  transform: "translateX(-50%)",

  width: "90%",
  margin: "0 auto",
  padding: "13px 22px",

  backgroundColor: "#fefefd",
  borderRadius: "80px",
  boxShadow: "0 4px 20px 0 rgb(0 0 0 / 25%)",
  zIndex: 10,
});

export const UlStyle = styled.ul({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 15,
  width: "100%",
});

export const SvgStyle = styled.div({
  width: 18,
  aspectRatio: "1/1",
});

export const LinkStyle = styled(Link)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "3px",

  flexShrink: 0,

  transition: "color 0.15s ease, font-weight 0.15s ease",

  "&:active, &.is-selected": {
    color: "#014D52",
    fontWeight: 600,
  },
  "& .move-loc": {
    fontSize: 15,
  },
});

export const MobileProfile = styled.div({
  minWidth: 20,
  aspectRatio: "1/1",
  borderRadius: "999px",
});
