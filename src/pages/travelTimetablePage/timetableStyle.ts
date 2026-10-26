import styled from "@emotion/styled";

type PlaceCardStyleProps = {
  startOffsetMinutes: number;
  stayMinutes?: number;
};

export const PlaceCardStyle = styled("article", {
  shouldForwardProp: (prop) =>
    prop !== "startOffsetMinutes" && prop !== "stayMinutes",
})<PlaceCardStyleProps>(({ startOffsetMinutes, stayMinutes }) => {
  const duration =
    typeof stayMinutes === "number" &&
    Number.isFinite(stayMinutes) &&
    stayMinutes > 0
      ? stayMinutes
      : 60;
  return {
    position: "absolute",
    top: `calc(${startOffsetMinutes / 60} * var(--hour-height))`,
    height: `calc(${duration / 60} * var(--hour-height))`,
    boxSizing: "border-box",
    overflow: "hidden",
    left: "8px",
    right: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
    minHeight: 0,
    padding: "6px 12px 6px 15px",
    borderRadius: "9px",
    backgroundColor: "var(--card-background)",

    "& .place-content": {
      display: "flex",
      flex: "1 1 0",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      minWidth: 0,
      gap: 3,

      "& h2": {
        width: "100%",
        minWidth: 0,
        margin: 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        color: "#304544",
        fontSize: 17,
        fontWeight: 700,
        lineHeight: 1.5,
      },
    },

    "& .place-time": {
      minWidth: 0,
      maxWidth: "100%",
      margin: 0,
      "& > span": {
        minWidth: 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: "5px",

      color: "#65766F",
      lineHeight: 1.4,
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap",

      "& svg": {
        width: "16px",
        height: "16px",
        flexShrink: 0,
      },
    },

    "&.palette-0": {
      "--card-background": "#E6F7EE",
      "--card-accent": "#179565",
    },

    "&.palette-1": {
      "--card-background": "#E7F0FF",
      "--card-accent": "#4B80CC",
    },

    "&.palette-2": {
      "--card-background": "#FFF0F3",
      "--card-accent": "#DA6C8B",
    },

    "&.palette-3": {
      "--card-background": "#FFF2E3",
      "--card-accent": "#DA9145",
    },

    "&.palette-4": {
      "--card-background": "#F0EBFF",
      "--card-accent": "#8B70CE",
    },

    "&.palette-5": {
      "--card-background": "#FFF8DC",
      "--card-accent": "#B99A36",
    },

    "@media (max-width: 767px)": {
      left: "4px",
      right: "4px",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      gap: "6px",
      padding: "6px 12px",

      "& .place-content": {
        flex: "0 1 auto",
        width: "100%",
        minWidth: 0,
        gap: 0,

        "& h2": {
          fontSize: "15px",
        },
      },

      "& .place-time": {
        gap: "4px",
        marginTop: "4px",
        fontSize: "14px",
      },
    },
  };
});

export const TripDaysPageStyle = styled.div({
  "--page-font-size": "16px",
  "--title-size": "30px",
  "--hour-height": "64px",
  "--time-width": "64px",
  "--visible-days": 5,
  "--mobile-header-height": "72px",

  display: "flex",
  width: "100%",
  height: "100dvh",
  minHeight: 0,
  overflow: "hidden",
  backgroundColor: "#FEFBF5",
  color: "#263E40",
  fontFamily: "Pretendard, sans-serif",
  fontSize: "var(--page-font-size)",

  "&, & *": {
    boxSizing: "border-box",
  },

  "& button": {
    fontFamily: "inherit",
    fontSize: "inherit",
    cursor: "pointer",
  },

  "& button:focus-visible, & .schedule-scroll:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: 3,
  },

  "& .page-sidebar": {
    display: "flex",
    flex: "0 0 auto",
    alignSelf: "stretch",
    minWidth: 0,
  },

  "& .page-mobile-header, & .page-mobile-nav": {
    display: "none",
  },

  "& .page-content": {
    flex: "1 1 0",
    minWidth: 0,
    minHeight: 0,
    overflowY: "auto",
    padding: "24px 40px 40px",
    scrollbarWidth: "thin",
    scrollbarColor: "#527F79 transparent",
  },

  "& .trip-days-inner": {
    width: "100%",
    maxWidth: "1440px",
    margin: "0 auto",
  },

  "& .trip-days-breadcrumb": {
    marginBottom: "24px",
  },

  "& .page-heading": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
    marginBottom: "24px",

    "& h1": {
      margin: 0,
      fontSize: "var(--title-size)",
      fontWeight: 800,
      lineHeight: 1.35,
      letterSpacing: "-0.04em",
      color: "#203638",
    },

    "& p": {
      margin: "8px 0 0",
      lineHeight: 1.6,
      color: "#697774",
      wordBreak: "keep-all",
    },
  },

  "& .heading-actions": {
    display: "flex",
    flexShrink: 0,
    gap: "10px",

    "& button": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minHeight: "44px",
      padding: "10px 16px",
      border: 0,
      borderRadius: "8px",
      color: "#FFFFFF",
      fontWeight: 600,
      whiteSpace: "nowrap",
      transition: "background-color 180ms ease",

      "& svg": {
        width: "18px",
        height: "18px",
        flexShrink: 0,
      },
    },

    "& .share-button": {
      width: 42,
      height: 42,
      color: "#0D5357",
      border: "1px solid #CCDCD2",
      backgroundColor: "#EDF4EE",

      "&:hover": {
        backgroundColor: "#E0EDE2",
      },
    },

    "& .view-button": {
      backgroundColor: "#0D5357",

      "&:hover": {
        backgroundColor: "#093E41",
      },
    },

    "& .add-button": {
      backgroundColor: "#347F68",

      "&:hover": {
        backgroundColor: "#286551",
      },
    },
  },

  "& .share-feedback": {
    margin: "-12px 0 16px",
    color: "#347F68",
    lineHeight: 1.5,

    "&:empty": {
      display: "none",
    },
  },

  "& .mobile-schedule-notice": {
    display: "none",
  },

  "& .summary-grid": {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "24px",
  },

  "& .summary-card": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
    padding: "18px 16px",
    borderRadius: "12px",

    "& p": {
      margin: "0 0 5px",
      color: "#5D706D",
      lineHeight: 1.5,
      wordBreak: "keep-all",
    },

    "& strong": {
      fontSize: "22px",
      fontWeight: 800,
      lineHeight: 1.3,
    },
  },

  "& .summary-icon": {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: "40px",
    height: "40px",
    borderRadius: "50%",

    "& svg": {
      width: "22px",
      height: "22px",
    },
  },

  "& .summary-days": {
    backgroundColor: "#EAF7F0",

    "& .summary-icon": {
      color: "#119264",
      backgroundColor: "#DDF3E7",
    },
  },

  "& .summary-moves": {
    backgroundColor: "#FFF0F3",

    "& .summary-icon": {
      color: "#DA6C8B",
      backgroundColor: "#FCE0E8",
    },
  },

  "& .summary-places": {
    backgroundColor: "#FFF3E7",

    "& .summary-icon": {
      color: "#AD702D",
      backgroundColor: "#FBE8CF",
    },
  },

  "& .summary-regions": {
    backgroundColor: "#EBF3FF",

    "& .summary-icon": {
      color: "#1684E8",
      backgroundColor: "#DDEEFF",
    },
  },

  "& .schedule-wrapper": {
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
  },

  "& .schedule-controls": {
    position: "absolute",
    inset: "0 0 auto",
    height: "68px",
    zIndex: 5,
    pointerEvents: "none",

    "& .schedule-previous": {
      left: "calc(var(--time-width) - 22px)",
    },

    "& .schedule-next": {
      right: "-16px",
    },

    "& button": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "auto",
      boxShadow: "0 2px 8px rgba(38, 62, 64, 0.08)",
      display: "grid",
      placeItems: "center",
      width: "44px",
      height: "44px",
      padding: 0,
      border: "1px solid #DCE7DF",
      borderRadius: "999px",
      backgroundColor: "#FFFFFF",
      color: "#0D5357",
      transition: "background-color 180ms ease",

      "& svg": {
        width: "22px",
        height: "22px",
      },

      "&:hover:not(:disabled)": {
        backgroundColor: "#E5F1E8",
      },

      "&:disabled": {
        color: "#A9B8AE",
        backgroundColor: "#F2F5F1",
        borderColor: "#E4EBE4",
        boxShadow: "none",
        cursor: "not-allowed",
      },
    },
  },

  "& .schedule-panel": {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    overflow: "hidden",
    border: "1px solid #DFE7E2",
    borderRadius: "12px",
    backgroundColor: "#FFFFFF",
  },

  "& .schedule-scroll": {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    scrollBehavior: "auto",
    overflowX: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
      width: 0,
      height: 0,
    },
  },

  "& .schedule-table": {
    display: "grid",
    alignItems: "stretch",
    width: "var(--schedule-table-width, 100%)",
    minWidth: "100%",
  },

  "& .time-heading, & .day-heading": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    minHeight: "68px",
    borderBottom: "1px solid #E5EBE7",
    backgroundColor: "#FAFCFA",
  },

  "& .time-heading": {
    position: "sticky",
    left: 0,
    zIndex: 3,

    "& svg": {
      width: "20px",
      height: "20px",
      color: "#788883",
    },
  },

  "& .day-heading": {
    flexDirection: "column",
    gap: "5px",
    padding: "10px 6px",
    borderLeft: "1px solid #E5EBE7",
    whiteSpace: "nowrap",

    "& strong": {
      fontSize: "inherit",
      fontWeight: 700,
    },

    "& span": {
      color: "#7B8C85",
      fontWeight: 500,
    },
  },

  "& .time-axis": {
    position: "sticky",
    left: 0,
    zIndex: 2,
    height: "calc(var(--timeline-hours, 24) * var(--hour-height))",
    backgroundColor: "#FAFCFA",

    "& > span": {
      position: "absolute",
      right: "10px",
      transform: "translateY(-50%)",
      color: "#798780",
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap",

      "&:first-of-type": {
        transform: "translateY(8px)",
      },

      "&:last-of-type": {
        transform: "translateY(-100%)",
      },
    },
  },

  "& .day-column": {
    minHeight: "calc(var(--timeline-hours) * var(--hour-height))",
    borderRight: "1px solid #E4EAEE",
    backgroundColor: "#FFFFFF",
  },

  "& .day-timeline": {
    position: "relative",
    minHeight: "calc(var(--timeline-hours) * var(--hour-height))",
    backgroundImage: "linear-gradient(to bottom, #E4EAEE 1px, transparent 1px)",
    backgroundSize: "100% var(--hour-height)",
  },

  "& .other-places": {
    padding: "12px",

    "& > p": {
      margin: "0 0 10px",
      color: "#697774",
    },

    "& article": {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      marginTop: "8px",
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "#F2F5F1",
      overflowWrap: "anywhere",
    },

    "& span": {
      color: "#697774",
    },
  },

  "& .day-list": {
    display: "grid",
    gap: "20px",
  },

  "& .list-day": {
    overflow: "hidden",
    border: "1px solid #DFE7E2",
    borderRadius: "12px",
    backgroundColor: "#FFFFFF",

    "& > header": {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "18px 20px",
      borderBottom: "1px solid #E8EDE7",
      backgroundColor: "#F2F6F0",

      "& > span": {
        color: "#347F68",
        fontWeight: 800,
        whiteSpace: "nowrap",
      },

      "& h2": {
        margin: 0,
        fontSize: "inherit",
        fontWeight: 700,
      },
    },

    "& ol": {
      margin: 0,
      padding: "0 20px",
      listStyle: "none",
    },

    "& li": {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "18px 0",

      "& + li": {
        borderTop: "1px solid #EDF0EB",
      },

      "& > strong": {
        flex: "1 1 0",
        minWidth: 0,
        lineHeight: 1.5,
        overflowWrap: "anywhere",
      },
    },
  },

  "& .place-order": {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    color: "#347F68",
    backgroundColor: "#EAF4ED",
    fontWeight: 700,
  },

  "& .list-time": {
    flexShrink: 0,
    color: "#697774",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },

  "& .no-places": {
    margin: 0,
    padding: "24px 20px",
    color: "#697774",
  },

  "& .empty-state": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    minHeight: "360px",
    textAlign: "center",

    "& > svg": {
      width: "44px",
      height: "44px",
      color: "#527F79",
    },

    "& h2": {
      margin: 0,
      fontSize: "22px",
    },

    "& p": {
      margin: 0,
      color: "#697774",
      lineHeight: 1.6,
    },
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    "--page-font-size": "15px",
    "--title-size": "26px",
    "--time-width": "60px",
    "--visible-days": 3,

    "& .page-content": {
      padding: "24px",
    },

    "& .page-heading": {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      alignItems: "center",
      columnGap: "20px",
      rowGap: "16px",

      "& > div:first-of-type": {
        display: "contents",
      },

      "& h1": {
        gridColumn: "1 / -1",
        gridRow: 1,
      },

      "& p": {
        gridColumn: 1,
        gridRow: 2,
        minWidth: 0,
        margin: 0,
      },
    },

    "& .heading-actions": {
      gridColumn: 2,
      gridRow: 2,
      alignSelf: "center",
      marginLeft: 0,
      gap: "8px",

      "& button": {
        padding: "10px 12px",
      },

      "& .share-button": {
        padding: 0,
        width: "44px",
        height: "44px",
      },
    },

    "& .summary-grid": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "12px",
    },

    "& .summary-card": {
      padding: "16px",

      "& strong": {
        fontSize: "20px",
      },
    },
  },

  "@media (max-width: 767px)": {
    "--page-font-size": "14px",
    "--title-size": "24px",
    "--hour-height": "64px",
    "--time-width": "52px",
    "--visible-days": 2,

    flexDirection: "column",

    "& .mobile-schedule-notice": {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      alignItems: "center",
      gap: "10px",
      marginBottom: "12px",
      padding: "10px 12px",
      border: "1px solid #D7E4D9",
      borderRadius: "12px",
      backgroundColor: "#EDF4EE",
    },

    "& .mobile-notice-text": {
      minWidth: 0,
    },

    "& .mobile-notice-period": {
      display: "block",
      fontSize: "18px",
      fontWeight: 700,
      lineHeight: 1.4,
      color: "#0D5357",
    },

    "& .mobile-notice-dates": {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.5,
      color: "#000",
      whiteSpace: "nowrap",
      fontVariantNumeric: "tabular-nums",
    },

    "& .mobile-schedule-controls": {
      display: "flex",
      gap: "4px",

      "& button": {
        display: "grid",
        placeItems: "center",
        width: "40px",
        height: "40px",
        padding: 0,
        border: "1px solid #DCE7DF",
        borderRadius: "999px",
        backgroundColor: "#FFFFFF",
        color: "#0D5357",
        transition: "background-color 180ms ease",

        "&:hover:not(:disabled)": {
          backgroundColor: "#E5F1E8",
        },

        "&:disabled": {
          color: "#ADBDB5",
          backgroundColor: "#F2F6F5",
          borderColor: "#DFE7E4",
          cursor: "not-allowed",
        },

        "& svg": {
          width: "20px",
          height: "20px",
        },
      },
    },

    "& .schedule-table": {
      boxSizing: "border-box",
      width: "var(--schedule-table-width, 100%)",
      minWidth: "100%",
      paddingRight: 0,
    },

    "& .day-heading": {
      minHeight: "64px",
      gap: "4px",
      padding: "10px 4px",
      whiteSpace: "nowrap",
    },

    "& .page-sidebar": {
      display: "none",
    },

    "& .page-mobile-header": {
      display: "block",
      flex: "0 0 var(--mobile-header-height)",
      height: "var(--mobile-header-height)",
      position: "relative",
      zIndex: 10,
    },

    "& .page-mobile-nav": {
      display: "block",
      flexShrink: 0,
    },

    "& .page-content": {
      flex: "1 1 0",
      minHeight: 0,
      padding: "8px 16px calc(100px + env(safe-area-inset-bottom))",
      scrollPaddingTop: "20px",
    },

    "& .trip-days-breadcrumb": {
      display: "none",
    },

    "& .page-heading": {
      alignItems: "stretch",
      flexDirection: "column",
      gap: "11px",
      marginBottom: "25px",

      "& p": {
        marginTop: "6px",
      },
    },

    "& .heading-actions": {
      display: "grid",
      gridTemplateColumns: "42px repeat(2, minmax(0, 1fr))",
      width: "100%",
      gap: 7,

      "& button": {
        minWidth: 0,
        minHeight: "40px",
        gap: "5px",
        padding: "8px",
        fontSize: "14px",

        "& svg": {
          width: "16px",
          height: "16px",
        },
      },
    },

    "& .summary-grid": {
      display: "none",
    },

    "& .summary-icon": {
      width: "32px",
      height: "32px",

      "& svg": {
        width: "19px",
        height: "19px",
      },
    },

    "& .schedule-controls": {
      display: "none",
      height: "64px",

      "& .schedule-next": {
        right: "-10px",
      },
    },

    "& .time-axis > span": {
      right: "6px",
    },

    "& .list-day": {
      "& > header": {
        padding: "16px",
      },

      "& ol": {
        padding: "0 14px",
      },

      "& li": {
        gap: "8px",
        padding: "16px 0",
      },
    },
  },

  "@media (max-width: 400px)": {
    "--visible-days": 1,
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& .heading-actions button, & .schedule-controls button, & .mobile-schedule-controls button":
      {
        transition: "none",
      },
  },
});
