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

// export const NavStyle = styled.nav({
//   position: "fixed",
//   bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
//   left: "50%",
//   transform: "translateX(-50%)",

//   width: "90%",
//   margin: "0 auto",
//   padding: "10px 22px",

//   backgroundColor: "#fefefd",
//   borderRadius: "80px",
//   boxShadow: "0 4px 20px 0 rgb(0 0 0 / 25%)",
//   zIndex: 10,
// });

// export const UlStyle = styled.ul({
//   display: "flex",
//   alignItems: "center",
//   gap: 0,
//   width: "100%",

//   "& > li": {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     flex: "1 1 0",
//     minWidth: 0,
//   },
// });

// export const LinkStyle = styled(Link)({
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   gap: "3px",

//   width: "100%",
//   minWidth: 0,

//   flexShrink: 0,

//   transition: "color 0.15s ease, font-weight 0.15s ease",

//   "&:active, &.is-selected": {
//     color: "#014D52",
//     fontWeight: 600,
//   },
//   "& .move-loc": {
//     flexShrink: 0,
//     whiteSpace: " nowrap",
//     fontSize: 11,
//   },
// });

// export const MobileProfile = styled.div({
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",

//   padding: 8,
//   backgroundColor: " #005358",

//   width: 45,
//   aspectRatio: "1/1",
//   borderRadius: "999px",

//   color: "#fff",
// });

export const NavStyle = styled.nav({
  position: "fixed",
  bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
  left: "50%",
  transform: "translateX(-50%)",

  width: "90%",
  margin: "0 auto",
  padding: "10px 22px",

  backgroundColor: "#fefefd",
  borderRadius: "80px",
  boxShadow: "0 4px 20px 0 rgb(0 0 0 / 25%)",
  zIndex: 10,

  "& .new-trip-link": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    minHeight: 44,
  },

  "& .guest-saved-button": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    width: "100%",
    minWidth: 0,
    minHeight: 44,
    color: "#858B91",
  },

  "& .saved-icon": {
    position: "relative",
  },

  "& .move-loc": {
    flexShrink: 0,
    whiteSpace: "nowrap",
    fontSize: 11,
  },

  "& .login-lock": {
    position: "absolute",
    top: -5,
    right: -7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 17,
    height: 17,
    border: "2px solid #FEFEFD",
    borderRadius: "50%",
    backgroundColor: "#939A9F",
    color: "#FFFFFF",
    pointerEvents: "none",
  },

  "& .login-notice": {
    position: "absolute",
    bottom: "calc(100% + 14px)",
    zIndex: 1,
    width: "max-content",
    maxWidth: "calc(100% - 16px)",
    padding: "11px 14px",
    borderRadius: 14,
    backgroundColor: "#0D3E41",
    color: "#FFFFFF",
    boxShadow: "0 4px 16px rgba(13, 62, 65, 0.16)",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.5,
    textAlign: "center",
    wordBreak: "keep-all",
    overflowWrap: "anywhere",

    "&::after": {
      content: '""',
      position: "absolute",
      top: "100%",
      width: 0,
      height: 0,
      borderLeft: "7px solid transparent",
      borderRight: "7px solid transparent",
      borderTop: "8px solid #0D3E41",
    },

    '&[data-target="trip"]': {
      left: "50%",
      transform: "translateX(-50%)",

      "&::after": {
        left: "50%",
        transform: "translateX(-50%)",
      },
    },

    '&[data-target="saved"]': {
      right: 8,
      width: "calc(100% - 16px)",

      "&::after": {
        left: "auto",
        right: "calc(30% + 5.6px)",
        transform: "translateX(50%)",
      },
    },
  },

  "& a:focus-visible, & button:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: 4,
    borderRadius: 12,
  },
});

export const UlStyle = styled.ul({
  display: "flex",
  alignItems: "center",
  gap: 0,
  width: "100%",

  "& > li": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: "1 1 0",
    minWidth: 0,
  },
});

export const LinkStyle = styled(Link)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "3px",

  width: "100%",
  minWidth: 0,
  minHeight: 44,
  flexShrink: 0,

  transition: "color 0.15s ease, font-weight 0.15s ease",

  "&:active, &.is-selected": {
    color: "#014D52",
    fontWeight: 600,
  },
});

export const MobileProfile = styled.div({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  padding: 8,
  backgroundColor: "#005358",

  width: 45,
  aspectRatio: "1/1",
  borderRadius: "999px",
  color: "#FFFFFF",

  "&.is-disabled": {
    backgroundColor: "#D3DFDF",
    color: "#858B91",
  },

  "& .login-lock": {
    top: -2,
    right: -2,
  },
});
