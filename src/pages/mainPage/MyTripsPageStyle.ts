import styled from "@emotion/styled";

export const MyTripsPageStyle = styled.div({
  "--page-font-size": "16px",
  fontSize: "var(--page-font-size)",
  display: "flex",
  alignItems: "stretch",
  width: "100%",
  height: "100dvh",
  backgroundColor: "#FEFBF5",

  "& .page-sidebar": {
    flex: "0 0 auto",
    minWidth: 0,
    display: "flex",
    alignSelf: "stretch",
  },

  "& .page-content": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 0",
    minWidth: 0,
    minHeight: "100vh",
    overflowY: "auto",
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
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "24px 40px 0",
  },

  "& .trips-header": {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    marginBottom: "32px",
  },

  "& .trips-header-top": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    width: "100%",
  },

  "& .trips-header h1": {
    color: "#172c3d",
    fontSize: "28px",
    fontWeight: 800,
  },

  "& .trips-header p": {
    color: "#75899c",
    fontSize: "var(--page-font-size)",
    lineHeight: 1.6,
  },

  "& .schedule-button": {
    flexShrink: 0,
    minWidth: "140px",
    padding: "11px 20px",

    borderRadius: "8px",
    backgroundColor: "#005358",
    color: "#fff",
    fontSize: "var(--page-font-size)",
    fontWeight: 700,
  },

  "& .trips-toolbar": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    borderBottom: "1px solid #e5ebef",
  },

  "& .trips-tabs": {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    minWidth: 0,
  },

  "& .trips-tabs button": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    minHeight: "45px",
    padding: "0 12px",

    borderBottom: "2px solid transparent",

    color: "#718596",
    fontSize: "var(--page-font-size)",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  "& .trips-tabs button.active": {
    borderBottomColor: "#005358",
    color: "#005358",
  },

  "& .tab-count": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "23px",
    height: "23px",
    padding: "0 5px",
    borderRadius: "20px",
    backgroundColor: "#edf1f4",
    color: "#536b7c",
    fontSize: "var(--page-font-size)",
  },

  "& .trips-controls": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "6px",
  },

  "& .view-switch": {
    display: "flex",
    gap: "3px",
    padding: "4px",
    borderRadius: "8px",
    backgroundColor: "#f0f3f5",
  },

  "& .view-switch button": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",

    borderRadius: "6px",

    color: "#8293a0",
  },

  "& .view-switch button.active": {
    backgroundColor: "#fff",
    color: "#005358",
    boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
  },

  "& .view-switch svg": {
    width: "19px",
    height: "19px",
  },

  "& .trips-breadcrumb": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
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
  },
  "& .trips-content-region.is-all": {
    justifyContent: "center",
  },
  "& .trips-grid": {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",

    alignItems: "stretch",
    gap: "16px",
  },

  "& .trips-grid.view-list": {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  "& .create-trip-card": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    minHeight: "260px",
    padding: "20px",
    border: "1px dashed #c9dce0",
    borderRadius: "12px",
    backgroundColor: "#fff",
    color: "#005358",
  },

  "& .create-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    border: "2px solid #005358",
    borderRadius: "50%",
  },

  "& .create-icon svg": {
    width: "25px",
    height: "25px",
  },

  "& .create-trip-card strong": {
    fontSize: "17px",
  },

  "& .create-description": {
    color: "#7b8d9a",
    fontSize: "var(--page-font-size)",
    textAlign: "center",
  },

  "& .view-list .create-trip-card": {
    flexDirection: "row",
    minHeight: "90px",
  },

  "& .trips-empty": {
    padding: "70px 20px",
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

    "& .trips-header h1": {
      fontSize: "24px",
    },

    "& .trips-header p": {
      fontSize: "var(--page-font-size)",
    },

    "& .schedule-button": {
      fontSize: "var(--page-font-size)",
    },

    "& .trips-tabs": {
      gap: "5px",
    },

    "& .trips-tabs button": {
      padding: "0 7px",
      fontSize: "var(--page-font-size)",
    },

    "& .tab-count": {
      fontSize: "var(--page-font-size)",
    },

    "& .trips-grid": {
      gap: "10px",
    },

    "& .create-trip-card": {
      minHeight: "200px",
    },

    "& .create-trip-card strong, & .create-description": {
      fontSize: "var(--page-font-size)",
    },
  },

  "@media (max-width: 767px)": {
    "--page-font-size": "14px",

    "& .trips-breadcrumb": {
      display: "none",
    },
    "& .trips-content-region": {
      padding: "16px 0",
    },
    flexDirection: "column",

    "& .page-sidebar": {
      display: "none",
    },

    "& .page-mobile-header": {
      display: "block",
    },

    "& .page-mobile-footer": {
      display: "block",
    },

    "& .trips-toolbar": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "10px",
      borderBottom: "none",
    },

    "& .trips-tabs": {
      flexWrap: "nowrap",
      width: "100%",
      maxWidth: "100%",
      gap: "7px",
      overflowX: "auto",
      overscrollBehaviorX: "contain",
      scrollbarWidth: "none",
    },

    "& .trips-tabs::-webkit-scrollbar": {
      display: "none",
    },

    "& .trips-tabs button": {
      flexShrink: 0,
      minHeight: "40px",
      padding: "0 11px",
      border: "1px solid #e3e9ed",
      borderRadius: "24px",
      fontSize: "var(--page-font-size)",
    },

    "& .trips-tabs button.active": {
      borderColor: "#005358",
      backgroundColor: "#005358",
      color: "#fff",
    },

    "& .trips-tabs button.active .tab-count": {
      backgroundColor: "rgba(255,255,255,0.16)",
      color: "#fff",
    },

    "& .trips-controls": {
      marginLeft: 0,
      justifyContent: "space-between",
      padding: "0 0 4px",
    },

    "& .trips-grid": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "12px",
    },

    "& .trips-grid.view-list": {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },

    "& .create-trip-card": {
      minHeight: "180px",
      gap: "9px",
      padding: "12px",
    },

    "& .create-icon": {
      width: "34px",
      height: "34px",
    },

    "& .create-icon svg": {
      width: "20px",
      height: "20px",
    },

    "& .create-trip-card strong, & .create-description": {
      fontSize: "var(--page-font-size)",
    },

    "& .view-list .create-trip-card": {
      minHeight: "90px",
      flexWrap: "wrap",
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
    },

    "& .trips-header h1": {
      fontSize: "22px",
      whiteSpace: "nowrap",
    },

    "& .trips-header p": {
      fontSize: "var(--page-font-size)",
      lineHeight: 1.6,
    },

    "& .schedule-button": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "auto",
      minWidth: "100px",
      minHeight: "36px",
      padding: "8px 12px",
      fontSize: "var(--page-font-size)",
      whiteSpace: "nowrap",
    },
  },
});
