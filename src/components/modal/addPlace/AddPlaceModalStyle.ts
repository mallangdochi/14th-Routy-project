import styled from "@emotion/styled";
import { modalAnimation } from "../../../styles/animation";

export const AddPlaceModalStyle = styled("div")({
  "--modal-title-size": "28px",
  "--modal-item-title-size": "22px",
  "--modal-body-size": "18px",
  "--modal-badge-size": "16px",

  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  overflow: "hidden",
  overscrollBehavior: "contain",
  backgroundColor: "rgba(20, 28, 32, 0.46)",
  color: "#203744",
  fontFamily: "inherit",
  fontSize: "var(--modal-body-size)",
  lineHeight: 1.5,

  "& .add-place-dialog": {
    ...modalAnimation,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    width: "100%",
    maxWidth: 720,
    maxHeight: "min(800px, calc(100dvh - 48px))",
    minHeight: 0,
    padding: 32,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 20px 60px rgba(20, 35, 40, 0.2)",
  },

  "& .is-day-step": {
    maxWidth: 880,
  },

  "& .sheet-handle": {
    display: "none",
  },

  "& button, & input": {
    fontFamily: "inherit",
    fontSize: "var(--modal-body-size)",
    lineHeight: 1.5,
  },

  "& button": {
    cursor: "pointer",
  },

  "& button:disabled": {
    cursor: "not-allowed",
  },

  "& button:focus-visible, & input:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: 3,
  },

  "& .modal-header": {
    position: "relative",
    flexShrink: 0,
    paddingRight: 44,

    "& h2": {
      margin: 0,
      color: "#183B42",
      fontSize: "var(--modal-title-size)",
      fontWeight: 800,
      lineHeight: 1.4,
      wordBreak: "keep-all",
    },

    "& p": {
      margin: "8px 0 0",
      color: "#6B7B85",
      fontSize: "var(--modal-body-size)",
      lineHeight: 1.5,
      wordBreak: "keep-all",
    },
  },

  "& .modal-title-row": {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },

  "& .icon-button": {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    padding: 0,
    border: 0,
    borderRadius: 8,
    backgroundColor: "transparent",
    color: "#74838B",
    transition: "background-color 180ms ease, color 180ms ease",

    "&:hover": {
      backgroundColor: "#F0F5F3",
      color: "#0D3E41",
    },
  },

  "& .close-button": {
    position: "absolute",
    top: -4,
    right: -8,
  },

  "& .back-button": {
    color: "#0D3E41",
  },

  "& .place-summary": {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    gap: 16,
    minWidth: 0,

    "& > img": {
      flexShrink: 0,
      width: 112,
      height: 84,
      borderRadius: 8,
      objectFit: "cover",
    },
  },

  "& .place-info": {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 0,

    "& h3": {
      margin: 0,
      color: "#203744",
      fontSize: "var(--modal-item-title-size)",
      fontWeight: 700,
      lineHeight: 1.4,
      overflowWrap: "anywhere",
    },
  },

  "& .place-meta": {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },

  "& .place-category": {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 10px",
    borderRadius: 999,
    backgroundColor: "#EBF1F3",
    color: "#40545D",
    fontSize: "var(--modal-badge-size)",
    fontWeight: 600,
    lineHeight: 1.5,
  },

  "& .place-address": {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    minWidth: 0,
    color: "#6B7B85",
    fontSize: "var(--modal-body-size)",
    lineHeight: 1.5,
    overflowWrap: "anywhere",

    "& svg": {
      flexShrink: 0,
    },
  },

  "& .trip-search": {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    gap: 10,
    minHeight: 48,
    padding: "0 14px",
    border: "1px solid #D9E1E6",
    borderRadius: 8,
    color: "#60777E",

    "&:focus-within": {
      borderColor: "#527F79",
      boxShadow: "0 0 0 3px rgba(82, 127, 121, 0.14)",
    },

    "& > svg": {
      flexShrink: 0,
    },

    "& input": {
      width: "100%",
      minWidth: 0,
      padding: "12px 0",
      border: 0,
      outline: "none",
      backgroundColor: "transparent",
      color: "#203744",

      "&::placeholder": {
        color: "#7A8A94",
        opacity: 1,
      },

      "&:focus-visible": {
        outline: "none",
      },
    },
  },

  "& .modal-scroll": {
    flex: "0 1 auto",
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    scrollbarColor: "#0D3E41 #EDF3F0",

    "&::-webkit-scrollbar": {
      width: 6,
    },

    "&::-webkit-scrollbar-track": {
      borderRadius: 999,
      backgroundColor: "#EDF3F0",
    },

    "&::-webkit-scrollbar-thumb": {
      borderRadius: 999,
      backgroundColor: "#0D3E41",
    },

    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#17625E",
    },
  },

  "& .trip-options": {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxHeight: 340,
    padding: "4px 8px 4px 4px",
  },

  "& .trip-option, & .day-option": {
    display: "flex",
    gap: 14,
    padding: 16,
    border: "1px solid #E0E6EB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
    transition: "background-color 180ms ease, border-color 180ms ease",

    "&:hover": {
      backgroundColor: "#F6F9F7",
    },

    "&.is-selected": {
      borderColor: "#39A6A0",
      backgroundColor: "#EEF9F6",
    },

    "&:has(input:focus-visible)": {
      outline: "3px solid #527F79",
      outlineOffset: 1,
    },

    "& input[type='radio']": {
      flexShrink: 0,
      width: 20,
      height: 20,
      margin: 0,
      accentColor: "#0D666A",
      cursor: "pointer",

      "&:focus-visible": {
        outline: "none",
      },
    },
  },

  "& .trip-option": {
    flexShrink: 0,
    alignItems: "center",

    "& > img": {
      flexShrink: 0,
      width: 88,
      height: 66,
      borderRadius: 7,
      objectFit: "cover",
    },
  },

  "& .trip-info": {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 6,
    minWidth: 0,

    "& strong": {
      color: "#203744",
      fontSize: "var(--modal-item-title-size)",
      fontWeight: 700,
      lineHeight: 1.4,
      overflowWrap: "anywhere",
    },

    "& > span": {
      color: "#6B7B85",
      fontSize: "var(--modal-body-size)",
      lineHeight: 1.5,
      overflowWrap: "anywhere",
    },
  },

  "& .trip-status": {
    flexShrink: 0,
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: "var(--modal-badge-size)",
    fontWeight: 600,
    lineHeight: 1.5,
    whiteSpace: "nowrap",

    "&.is-PLANNING": {
      backgroundColor: "#D8F5EB",
      color: "#176B61",
    },

    "&.is-IN_PROGRESS": {
      backgroundColor: "#FFE5D9",
      color: "#B74629",
    },

    "&.is-COMPLETED": {
      backgroundColor: "#EDF0F2",
      color: "#63717B",
    },
  },

  "& .day-options": {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    alignItems: "stretch",
    gap: 14,
    maxHeight: 340,
    padding: "4px 8px 4px 4px",
  },

  "& .day-option": {
    alignItems: "flex-start",
    minWidth: 0,

    "& input[type='radio']": {
      marginTop: 4,
    },
  },

  "& .day-info": {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minWidth: 0,
  },

  "& .day-heading": {
    display: "flex",
    flexDirection: "column",
    gap: 2,

    "& strong": {
      color: "#203744",
      fontSize: "var(--modal-item-title-size)",
      fontWeight: 700,
      lineHeight: 1.4,
    },

    "& > span": {
      fontSize: "var(--modal-body-size)",
      lineHeight: 1.5,
    },
  },

  "& .day-places": {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    color: "#6B7B85",
    fontSize: "var(--modal-body-size)",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },

  "& .modal-footer": {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    gap: 12,
  },

  "& .trip-footer": {
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTop: "1px solid #EDF0F2",
  },

  "& .selection-text": {
    flex: "1 1 120px",
    minWidth: 0,
    margin: 0,
    color: "#176B61",
    fontSize: "var(--modal-body-size)",
    fontWeight: 600,
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },

  "& .footer-actions": {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  "& .primary-button, & .secondary-button": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 48,
    padding: "12px 20px",
    border: "1px solid transparent",
    borderRadius: 8,
    fontWeight: 600,
    transition: "background-color 180ms ease, border-color 180ms ease",

    "& svg": {
      flexShrink: 0,
    },
  },

  "& .primary-button": {
    backgroundColor: "#0D5558",
    color: "#FFFFFF",

    "&:hover:not(:disabled)": {
      backgroundColor: "#0D3E41",
    },

    "&:disabled": {
      backgroundColor: "#CBD6D5",
      color: "#FFFFFF",
    },
  },

  "& .secondary-button": {
    borderColor: "#D9E1E6",
    backgroundColor: "#FFFFFF",
    color: "#40545D",

    "&:hover": {
      backgroundColor: "#F1F5F3",
    },
  },

  "& .day-footer .primary-button": {
    width: "100%",
  },

  "& .empty-message": {
    margin: 0,
    padding: "32px 12px",
    color: "#6B7B85",
    fontSize: "var(--modal-body-size)",
    textAlign: "center",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    "--modal-title-size": "24px",
    "--modal-item-title-size": "20px",
    "--modal-body-size": "17px",
    "--modal-badge-size": "15px",

    "& .add-place-dialog": {
      maxWidth: 600,
      maxHeight: "min(720px, calc(100dvh - 48px))",
      padding: 24,
      gap: 16,
    },

    "& .is-day-step": {
      maxWidth: 700,
    },

    "& .place-summary": {
      gap: 14,

      "& > img": {
        width: 96,
        height: 72,
      },
    },

    "& .trip-options": {
      gap: 10,
      maxHeight: 300,
    },

    "& .trip-option, & .day-option": {
      gap: 10,
      padding: 12,
    },

    "& .trip-option > img": {
      width: 72,
      height: 56,
    },

    "& .day-options": {
      gap: 10,
      maxHeight: 300,
    },

    "& .primary-button, & .secondary-button": {
      minHeight: 44,
      padding: "10px 16px",
    },
  },

  "@media (max-width: 767px)": {
    "--modal-title-size": "20px",
    "--modal-item-title-size": "18px",
    "--modal-body-size": "16px",
    "--modal-badge-size": "14px",

    alignItems: "flex-end",
    padding: 0,

    "& .add-place-dialog": {
      gap: 14,
      maxWidth: "100%",
      maxHeight: "calc(100dvh - 16px)",
      padding: "12px 16px calc(16px + env(safe-area-inset-bottom))",
      borderRadius: "20px 20px 0 0",
    },

    "& .sheet-handle": {
      display: "block",
      flexShrink: 0,
      alignSelf: "center",
      width: 36,
      height: 4,
      borderRadius: 999,
      backgroundColor: "#C9D1D5",
    },

    "& .modal-header p": {
      marginTop: 6,
    },

    "& .place-summary": {
      gap: 10,

      "& > img": {
        width: 72,
        height: 56,
      },
    },

    "& .place-info": {
      gap: 5,
    },

    "& .place-meta": {
      gap: 6,
    },

    "& .place-category": {
      padding: "3px 8px",
    },

    "& .trip-search": {
      minHeight: 44,
      padding: "0 10px",

      "& input": {
        padding: "10px 0",
      },
    },

    "& .trip-options": {
      gap: 8,
      maxHeight: 280,
    },

    "& .trip-option": {
      display: "grid",
      gridTemplateColumns: "20px 52px minmax(0, 1fr)",
      columnGap: 8,
      rowGap: 6,
      padding: 10,

      "& > input": {
        gridColumn: 1,
        gridRow: "1 / 3",
        alignSelf: "center",
      },

      "& > img": {
        gridColumn: 2,
        gridRow: "1 / 3",
        width: 52,
        height: 48,
        alignSelf: "center",
      },
    },

    "& .trip-info": {
      gridColumn: 3,
      gridRow: 1,
      gap: 4,

      "&>span": {
        display: "block",
        minWidth: 0,
        maxWidth: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },

    "& .trip-status": {
      gridColumn: 3,
      gridRow: 2,
      justifySelf: "start",
      padding: "2px 8px",
    },

    "& .day-options": {
      gridTemplateColumns: "minmax(0, 1fr)",
      gap: 8,
      maxHeight: 280,
    },

    "& .day-option": {
      gap: 10,
      padding: 12,
    },

    "& .day-info": {
      gap: 6,
    },

    "& .day-heading": {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 8,
    },

    "& .day-places": {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: 10,
      rowGap: 3,
    },

    "& .trip-footer": {
      gap: 10,
      paddingTop: 12,
    },

    "& .selection-text": {
      flexBasis: "100%",
    },

    "& .footer-actions": {
      display: "grid",
      gridTemplateColumns: "auto minmax(0, 1fr)",
      width: "100%",
    },

    "& .primary-button, & .secondary-button": {
      minHeight: 44,
      padding: "10px 12px",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& button, & .trip-option, & .day-option": {
      transition: "none",
    },
  },
});
