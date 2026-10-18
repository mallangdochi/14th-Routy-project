import styled from "@emotion/styled";
import { modalAnimation } from "../../../styles/animation";
export const TripPreviewStyle = styled.dialog({
  "&": {
    "&[open]": {
      ...modalAnimation,
    },
    position: "fixed",
    inset: "auto 0 0",
    width: "100%",
    maxWidth: "100%",
    maxHeight: "92dvh",
    margin: 0,
    padding: 0,
    border: 0,
    borderRadius: "24px 24px 0 0",
    overflow: "hidden",
    backgroundColor: "#fff",
    color: "var(--color-text)",
    font: "inherit",
    "&::backdrop": {
      backgroundColor: "rgb(18 31 32 / 48%)",
    },
  },
  "& .sheet-surface": {
    display: "flex",
    flexDirection: "column",
    maxHeight: "92dvh",
    gap: 20,
    padding: "30px 25px",
    scrollbarWidth: "thin",
    scrollbarColor: "#075653 #fff",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#075653",
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#064744",
    },
    "&::-webkit-scrollbar-button": {
      display: "none",
    },
  },
  "& .sheet-content-inner": {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    minWidth: 0,
    flexShrink: 0,
    borderRight: "8px solid transparent",
  },
  "& .sheet-handle": {
    flexShrink: 0,
    width: "44px",
    height: "5px",
    margin: "10px auto 4px",
    borderRadius: "10px",
    backgroundColor: "#d9dce0",
  },
  "& .sheet-heading": {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    flexShrink: 0,
    "& > div": {
      flex: 1,
      minWidth: 0,
    },
    "& h2": {
      fontSize: "20px",
      lineHeight: 1.4,
      color: "var(--color-primary)",
      wordBreak: "keep-all",
    },
    "& p": {
      marginTop: "6px",
      color: "var(--color-muted)",
      lineHeight: 1.5,
    },
  },
  "& .sheet-close": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "44px",
    height: "44px",
    border: 0,
    borderRadius: "8px",
    backgroundColor: "transparent",
    color: "#637484",
  },
  "& .sheet-content": {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
    "& .map-preview, & .map-preview img": {
      flex: "none",
      height: "260px",
      minHeight: "140px",
    },
    "& .summary-card": {
      flexShrink: 0,
    },
  },
  "& .sheet-actions": {
    flexShrink: 0,
    marginTop: 0,
    backgroundColor: "#fff",
    "& button": {
      padding: "10px 12px",
      minHeight: "48px",
    },
    "& .cancel-button": {
      flex: "1 1 0",
    },
    "& .submit-button": {
      flex: "1.6 1 0",
      minWidth: 0,
    },
  },
  "& .sheet-content .summary-card > h2": {
    display: "none",
  },
  "@media screen and (min-width: 768px) and (max-width: 1023px)": {
    "&": {
      inset: 0,
      width: "min(900px, calc(100vw - 48px))",
      minWidth: "700px",
      maxWidth: "calc(100vw - 48px)",
      margin: "auto",
      borderRadius: "20px",
    },
    "& .sheet-handle": {
      display: "none",
    },
    "& .sheet-content": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "24px",
    },
    "& .sheet-content-inner": {
      display: "flex",
      flexDirection: "row",
      alignItems: "stretch",
      gap: "24px",
      width: "100%",
      minWidth: 0,
      "& .map-preview": {
        flex: "1 1 45%",
        minWidth: 0,
        height: "305px",
      },
      "& .map-preview img": {
        height: "100%",
      },
      "& .summary-card": {
        flex: "1 1 55%",
        minWidth: 0,
        padding: 0,
        border: 0,
        boxShadow: "none",
      },
    },
    "& .sheet-actions": {
      "& .cancel-button, & .submit-button": {
        flex: "0 0 auto",
      },
    },
  },
  "@media screen and (max-width: 767px)": {
    "& .sheet-content .map-preview img": {
      objectFit: "cover",
    },
    "& .sheet-content": {
      flex: "1 1 auto",
    },
    "& .sheet-heading p": {
      fontSize: "14px",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    "&[open]": {
      animationDuration: "1ms",
    },
  },
  "& .sheet-heading h2": {
    fontSize: "24px",
  },
  "@media  (max-width: 1023px)": {
    "& .sheet-heading h2": {
      fontSize: "30px",
    },
  },
});
