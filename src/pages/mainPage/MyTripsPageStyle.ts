import styled from "@emotion/styled";
import { menuAnimation } from "../../styles/animation";

// PC에서 브라우저 110% 확대와 비슷한 밀도를 내도록 크기를 조정합니다.
// 태블릿(1023px 이하)과 모바일(767px 이하)은 기존 값을 유지합니다.
export const MyTripsPageStyle = styled.div({
  display: "flex",
  alignItems: "stretch",
  width: "100%",
  height: "100dvh",
  backgroundColor: "#FEFBF5",

  "& .page-sidebar": {
    display: "flex",
    flex: "0 0 auto",
    minWidth: 0,
    alignSelf: "stretch",
  },

  "& .page-content": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 0",
    minWidth: 0,
    minHeight: "100vh",
    overflowY: "auto",
    scrollbarGutter: "stable",
    backgroundColor: "#fff",
  },

  "& .page-mobile-header, & .page-mobile-footer": {
    display: "none",
  },

  "& .trips-page-inner": {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    width: "100%",
    maxWidth: "1430px",
    margin: "0 auto",
    padding: "32px 32px 0",
  },

  "& .trips-header": {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "36px",
  },

  "& .trips-header-top": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    width: "100%",
  },

  "& .trips-header h1": {
    color: "#172c3d",
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },

  "& .trips-header p": {
    color: "#75899c",
    fontSize: "18px",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    lineHeight: 1.6,
  },

  "& .schedule-button": {
    flexShrink: 0,
    minWidth: "154px",
    padding: "12px 24px",
    borderRadius: "9px",
    backgroundColor: "#005358",
    color: "#fff",
    fontSize: "17px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },

  "& .trips-toolbar": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "17px",
    borderBottom: "1px solid #e5ebef",
  },

  "& .trips-tabs": {
    display: "flex",
    position: "relative",

    "& .trips-tab-indicator": {
      ...menuAnimation.indicator,
      display: "block",
      position: "absolute",
      top: "auto",
      bottom: "-1px",
      left: 0,
      width: "var(--indicator-width, 0px)",
      height: 2,
      borderRadius: 0,
      backgroundColor: "#005358",
      opacity: 1,
      visibility: "visible",
      zIndex: 1,
      transform: "translateX(var(--indicator-left, 0px))",
      pointerEvents: "none",
    },

    "& button": {
      ...menuAnimation.button,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minHeight: "50px",
      padding: "0 27px",
      border: 0,
      backgroundColor: "transparent",
      color: "#718596",
      fontSize: "18px",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",

      "&:focus-visible": {
        outline: "2px solid #527F79",
        outlineOffset: "-4px",
      },

      "&.active": {
        color: "#005358",
      },
    },
  },

  "& .tab-count": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "25px",
    height: "25px",
    padding: "0 6px",
    borderRadius: "20px",
    backgroundColor: "#edf1f4",
    color: "#536b7c",
    fontSize: "15px",
    fontWeight: 600,
  },

  "& .trips-controls": {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    paddingBottom: "7px",
  },

  "& .view-switch": {
    display: "flex",
    gap: "3px",
    padding: "4px",
    borderRadius: "9px",
    backgroundColor: "#f0f3f5",

    "& button": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      borderRadius: "7px",
      color: "#8293a0",

      "&.active": {
        backgroundColor: "#fff",
        color: "#005358",
        boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
      },
    },

    "& svg": {
      width: "21px",
      height: "21px",
    },
  },

  "& .trips-breadcrumb": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "32px",
    color: "#172c3d",
    fontWeight: 600,
  },

  "& .trips-content-region": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: 1,
    minWidth: 0,
    padding: "32px 0",

    "&.is-all": {
      justifyContent: "center",
    },
  },

  "& .trips-grid": {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    alignItems: "stretch",
    gap: "16px",

    "&.view-list": {
      display: "flex",
      flexDirection: "column",
      gap: "11px",
    },
  },

  "& .create-trip-card": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    minHeight: "286px",
    padding: "22px",
    border: "1px dashed #c9dce0",
    borderRadius: "13px",
    backgroundColor: "#fff",
    color: "#005358",

    "& strong": {
      fontSize: "18px",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
  },

  "& .create-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "46px",
    height: "46px",
    border: "2px solid #005358",
    borderRadius: "50%",

    "& svg": {
      width: "28px",
      height: "28px",
    },
  },

  "& .create-description": {
    color: "#7b8d9a",
    fontSize: "16px",
    fontWeight: 600,
    textAlign: "center",
  },

  "& .view-list .create-trip-card": {
    flexDirection: "row",
    minHeight: "99px",
  },

  "& .trips-empty": {
    padding: "77px 22px",
    color: "#718596",
    fontSize: "var(--page-font-size)",
    textAlign: "center",
  },

  "@media (hover: hover) and (pointer: fine)": {
    "& .schedule-button:hover": {
      backgroundColor: "#00666b",
    },

    "& .trips-tabs button:hover": {
      color: "#005358",
    },

    "& .create-trip-card:hover": {
      backgroundColor: "#f4faf9",
      borderColor: "#005358",
    },
  },

  "@media (max-width: 1023px)": {
    "--page-font-size": "15px",

    "& .trips-toolbar": {
      flexWrap: "wrap",
    },

    "& .trips-controls": {
      marginLeft: "auto",
    },

    "& .trips-page-inner": {
      padding: "24px 16px 0",
    },

    "& .trips-tabs": {
      gap: "5px",

      "& button": {
        padding: "0 7px",
      },
    },

    "& .trips-grid": {
      gap: "10px",
    },

    "& .create-trip-card": {
      minHeight: "200px",

      "& strong": {
        fontSize: "var(--page-font-size)",
      },
    },
  },

  "@media (max-width: 800px)": {
    "& .trips-toolbar": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "10px",
      borderBottom: "none",
    },

    "& .trips-tabs": {
      flexWrap: "nowrap",
      alignItems: "stretch",
      gap: 0,
      width: "100%",
      borderBottom: "1px solid #E2E6E9",

      "& button": {
        flex: "1 1 0",
        minWidth: 0,
        minHeight: 44,
        gap: 4,
        padding: "10px 0",
        fontWeight: 400,

        "&.active": {
          fontWeight: 700,
        },
      },
    },

    "& .tab-count": {
      minWidth: 0,
      height: "auto",
      padding: 0,
      borderRadius: 0,
      backgroundColor: "transparent",
      color: "inherit",
    },

    "& .trips-controls": {
      marginLeft: 0,
      justifyContent: "space-between",
      padding: "0 0 4px",
    },
  },

  "@media (max-width: 767px)": {
    "--page-font-size": "14px",
    flexDirection: "column",

    "& .trips-breadcrumb, & .page-sidebar": {
      display: "none",
    },

    "& .page-mobile-header, & .page-mobile-footer": {
      display: "block",
    },

    "& .page-content": {
      width: "100%",
      minHeight: 0,
    },

    "& .trips-page-inner": {
      padding: "80px 14px calc(84px + env(safe-area-inset-bottom))",
    },

    "& .trips-header": {
      gap: "10px",
      marginBottom: "22px",
    },

    "& .trips-header-top": {
      gap: "10px",
    },

    "& .trips-header h1": {
      fontSize: "22px",
      whiteSpace: "nowrap",
    },

    "& .schedule-button": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "auto",
      minWidth: "100px",
      minHeight: "36px",
      padding: "8px 12px",
      whiteSpace: "nowrap",
    },

    "& .trips-content-region": {
      padding: "16px 0",
    },

    "& .trips-grid": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "12px",

      "&.view-list": {
        gap: "12px",
      },
    },

    "& .create-trip-card": {
      minHeight: "180px",
      gap: "9px",
      padding: "12px",
    },

    "& .create-icon": {
      width: "34px",
      height: "34px",

      "& svg": {
        width: "20px",
        height: "20px",
      },
    },

    "& .view-list .create-trip-card": {
      flexWrap: "wrap",
    },
  },
});
