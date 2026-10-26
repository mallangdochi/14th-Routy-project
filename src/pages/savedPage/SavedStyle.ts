import styled from "@emotion/styled";
import { menuAnimation } from "../../styles/animation";

export const SavedPageStyle = styled.div({
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
    margin: "0 auto",
    flex: "1 1 0",
    minWidth: 0,
    minHeight: "100vh",
    overflowY: "auto",
    backgroundColor: "#FEFBF5",
    padding: "24px 40px 0",
  },

  "& .page-mobile-header, & .page-mobile-footer": {
    display: "none",
  },

  "@media (max-width: 767px)": {
    "--page-font-size": "14px",

    "& .page-sidebar": {
      display: "none",
    },

    "& .page-mobile-header, & .page-mobile-footer": {
      display: "block",
    },

    "& .page-content": {
      padding: "24px 20px",
    },
  },
});

export const PageInner = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  margin: "0 auto",
  width: "100%",
  maxWidth: "1300px",
  minWidth: 0,
  fontSize: "var(--page-font-size)",

  "& .page-header": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 15,
    paddingBottom: 24,

    "& h1": {
      fontSize: 44,
      color: "#0D3E41",
    },
  },

  "&:has(.saved-places)": {
    justifyContent: "flex-start",
    alignItems: "stretch",
  },

  "& .saved-places": {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: "100%",
    paddingBottom: 32,
  },

  "& .saved-filters": {
    display: "flex",
    position: "relative",
    flexWrap: "nowrap",
    alignItems: "stretch",
    gap: 0,
    width: "100%",
    borderBottom: "1px solid #E2E6E9",

    "& .saved-filter-indicator": {
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
      flex: "0 0 auto",
      minWidth: 0,
      minHeight: 44,
      padding: "10px 25px",
      border: 0,
      borderRadius: 0,
      backgroundColor: "transparent",
      color: "#718596",
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: 400,
      lineHeight: 1.5,
      whiteSpace: "nowrap",
      cursor: "pointer",

      "&:hover": {
        backgroundColor: "transparent",
        color: "#005358",
      },

      '&[aria-pressed="true"]': {
        backgroundColor: "transparent",
        color: "#005358",
        fontWeight: 700,
      },

      "&:focus-visible": {
        outline: "2px solid #527F79",
        outlineOffset: "-4px",
      },
    },
  },

  "& .saved-toolbar": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },

  "& .saved-toolbar > div": {
    marginLeft: "auto",

    "& .sort-dropdown": {
      left: "auto",
      right: 0,
    },
  },

  "& .saved-count": {
    color: "#596D75",
    lineHeight: 1.5,

    "& strong": {
      fontWeight: 600,
    },
  },

  "& .saved-list": {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    listStyle: "none",
  },

  "& .saved-card": {
    display: "flex",
    alignItems: "stretch",
    gap: 20,
    padding: 12,
    border: "1px solid #EEEDE7",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 3px 12px rgba(13, 62, 65, 0.05)",
  },

  "& .saved-image": {
    flex: "0 0 200px",
    width: 200,
    minHeight: 160,
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: "#E8EEEA",

    "& img": {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },

  "& .saved-info": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
    minWidth: 0,
    gap: 8,
  },

  "& .saved-heading": {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",

    "& h2": {
      paddingTop: 6,
      color: "#0D3E41",
      fontSize: 22,
      fontWeight: 700,
      lineHeight: 1.4,
      overflowWrap: "anywhere",
    },
  },

  "& .saved-bookmark": {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: 44,
    height: 44,
    border: 0,
    borderRadius: 10,
    backgroundColor: "transparent",
    color: "#0D3E41",
    cursor: "pointer",
    transition: "background-color 0.2s ease, color 0.2s ease",

    "&:hover": {
      backgroundColor: "#EDF4F0",
      color: "#236367",
    },

    "& svg": {
      display: "block",
    },
  },

  "& .saved-category": {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 10px",
    borderRadius: 999,
    backgroundColor: "#F0F2F3",
    color: "#455A63",
    lineHeight: 1.5,
  },

  "& .saved-address": {
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
    color: "#596D75",
    lineHeight: 1.5,

    "& svg": {
      flexShrink: 0,
      marginTop: 3,
    },

    "& span": {
      minWidth: 0,
      overflowWrap: "anywhere",
    },
  },

  "& .saved-description": {
    color: "#596D75",
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },

  "& .saved-actions": {
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 8,
    width: "100%",
    marginTop: "auto",
    paddingTop: 4,

    "& button": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      minHeight: 44,
      padding: "8px 14px",
      borderRadius: 8,
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: 600,
      lineHeight: 1.5,
      cursor: "pointer",
      transition: "background-color 0.2s ease",

      "& svg": {
        flexShrink: 0,
      },

      "& span": {
        whiteSpace: "nowrap",
      },
    },
  },

  "& .saved-map-button": {
    border: "1px solid #D9E2E3",
    backgroundColor: "#FFFFFF",
    color: "#0D3E41",

    "&:hover": {
      backgroundColor: "#F0F5F2",
    },
  },

  "& .saved-add-button": {
    border: "1px solid #0D3E41",
    backgroundColor: "#0D3E41",
    color: "#FFFFFF",

    "&:hover": {
      backgroundColor: "#195357",
    },
  },

  "& .saved-bookmark:focus-visible, & .saved-actions button:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: 3,
  },

  "& .saved-empty": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: "40px 0",
    color: "#596D75",
    textAlign: "center",
  },

  "@media (max-width: 1023px)": {
    "--page-font-size": "15px",
    padding: "24px 0 0",

    "& .saved-card": {
      gap: 16,
    },

    "& .saved-image": {
      flexBasis: 160,
      width: 160,
      minHeight: 150,
    },

    "& .saved-heading h2": {
      fontSize: 20,
    },

    "& .saved-actions button": {
      padding: "8px 12px",
    },
  },

  "@media (max-width: 767px)": {
    "--page-font-size": "14px",
    padding: 0,

    "& .page-header": {
      paddingBottom: 0,

      "& h1": {
        paddingTop: 20,
        fontSize: 28,
      },
    },
    "& .saved-filters button": {
      flex: "1 1 0",
      minWidth: 0,
      padding: "10px 0",
      fontSize: "14px",
    },
    "& .saved-places": {
      gap: 12,
      paddingTop: 20,
      paddingBottom: 100,
    },

    "& .saved-list": {
      gap: 12,
    },

    "& .saved-card": {
      position: "relative",
      flexDirection: "column",
      gap: 10,
      padding: 10,
      borderRadius: 12,
    },

    "& .saved-image": {
      flex: "0 0 auto",
      width: "100%",
      height: 150,
      minHeight: 0,
      borderRadius: 8,
    },

    "& .saved-info": {
      flex: "0 0 auto",
      gap: 8,
    },

    "& .saved-heading h2": {
      paddingTop: 0,
      fontSize: 18,
    },

    "& .saved-bookmark": {
      position: "absolute",
      top: 16,
      right: 16,
      backgroundColor: "#FFFFFF",
      boxShadow: "0 2px 8px rgba(13, 62, 65, 0.12)",

      "&:hover": {
        backgroundColor: "#EDF4F0",
      },
    },

    "& .saved-actions": {
      paddingTop: 4,

      "& button": {
        flex: "1 1 auto",
        padding: "8px 10px",
      },
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& .saved-bookmark, & .saved-actions button, & .saved-filters button, & .saved-filter-indicator":
      {
        transition: "none",
      },
  },
});
