import styled from "@emotion/styled";
import { modalAnimation } from "../../../styles/animation";
export const RegionSelectStyle = styled.div({
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  backgroundColor: "rgba(15, 28, 30, 0.55)",
  color: "#172431",
  fontSize: "18px",
  "& .region-dialog": {
    ...modalAnimation,
    display: "flex",
    flexDirection: "column",
    width: "1040px",
    maxWidth: "100%",
    height: "min(680px, calc(100dvh - 48px))",
    minHeight: 0,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderRadius: "18px",
    boxShadow: "0 20px 64px rgba(0,0,0,0.2)",

    "@media (prefers-reduced-motion: reduce)": {
      animationDuration: "1ms",
    },
  },
  "& button:focus-visible": {
    outline: "3px solid rgba(0,84,87,0.18)",
    outlineOffset: "3px",
  },
  "& .region-header": {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    flexShrink: 0,
    padding: "24px 28px",
    borderBottom: "1px solid #E5E9ED",
  },
  "& .heading-copy": {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
    minWidth: 0,
  },
  "& h2": {
    fontSize: "28px",
    lineHeight: 1.4,
  },
  "& .heading-copy p": {
    color: "#647181",
    lineHeight: 1.5,
  },
  "& .icon-button": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "40px",
    height: "40px",
    borderRadius: "8px",
  },
  "& .icon-button:hover:not(:disabled)": {
    backgroundColor: "#F3F0EA",
  },
  "& .back-button": {
    display: "none",
  },
  "& .region-content": {
    display: "flex",
    flex: "1 1 0",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
  },
  "& .region-search-panel": {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    flex: "0 0 38%",
    minHeight: 0,
    minWidth: 0,
    padding: "24px 20px 16px",
    borderRight: "1px solid #E5E9ED",
    overflow: "hidden",
  },
  "& .search-field": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
    minHeight: "52px",
    padding: "4px 10px 4px 14px",
    border: "1px solid #CFD6DD",
    borderRadius: "9px",
  },
  "& .search-field > svg": {
    flexShrink: 0,
    color: "#647181",
  },
  "& .search-field:focus-within": {
    outline: "3px solid rgba(0,84,87,0.18)",
    borderColor: "#005457",
  },
  "& .search-field input": {
    flex: 1,
    width: "100%",
    minWidth: 0,
    border: 0,
    outline: "none",
    backgroundColor: "transparent",
  },
  "& .search-field input:focus-visible": {
    outline: "none",
  },
  "& .clear-button": {
    width: "32px",
    height: "32px",
  },
  "& .clear-button:disabled": {
    visibility: "hidden",
    cursor: "default",
  },
  "& .results-caption": {
    flexShrink: 0,
    minHeight: "24px",
    lineHeight: "24px",
    color: "#647181",
  },
  "& .region-results": {
    flex: "1 1 0",
    minHeight: 0,
    paddingRight: "12px",
    overflowY: "auto",
    overflowX: "hidden",
    overscrollBehavior: "contain",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    scrollbarColor: "#075653 #FEFBF5",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#FEFBF5",
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
  "& .search-empty": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    minHeight: "100%",
    padding: "24px 12px",
    color: "#647181",
    textAlign: "center",
    lineHeight: 1.6,
  },
  "& .region-result": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    position: "relative",
    minHeight: "82px",
    padding: "16px 12px",
    borderBottom: "1px solid #EEF1F1",
    borderRadius: "8px",
    cursor: "pointer",
  },
  "& .region-result > svg": {
    flexShrink: 0,
    color: "#647181",
  },
  "& .region-result:hover": {
    backgroundColor: "#F5F3EC",
  },
  '& .region-result[data-selected="true"]': {
    backgroundColor: "#E5F4F0",
    color: "#005457",
  },
  '& .region-result[data-selected="true"] > svg': {
    color: "#005457",
  },
  "& .region-result:focus-within": {
    // outline: "3px solid #D97861",
    outline: "3px solid rgba(0,84,87,0.18)",
    outlineOffset: "-3px",
  },
  "& .region-result input": {
    position: "absolute",
    width: "1px",
    height: "1px",
    opacity: 0,
  },
  "& .result-copy": {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
    minWidth: 0,
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },
  "& .result-copy span": {
    color: "#647181",
  },
  "& .selection-indicator": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    border: "1px solid #ABB7C3",

    "& > svg": {
      flexShrink: 0,
    },
  },
  '& .region-result[data-selected="true"] .selection-indicator': {
    color: "#005457",
    borderColor: "#005457",
    backgroundColor: "#FFFFFF",
  },
  "& .region-map": {
    display: "flex",
    flex: "1 1 0",
    minWidth: 0,
    minHeight: 0,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#EAF0EB",
  },
  "& .region-map > *": {
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
  },
  "& .map-placeholder": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "24px",
    textAlign: "center",
    color: "#005457",
    backgroundImage:
      "linear-gradient(30deg, transparent 48%, #FFFFFF99 49%, #FFFFFF99 51%, transparent 52%), linear-gradient(120deg, transparent 48%, #FFFFFF99 49%, #FFFFFF99 51%, transparent 52%)",
    backgroundSize: "90px 110px",
  },
  "& .map-placeholder strong": {
    fontSize: "20px",
    lineHeight: 1.5,
  },
  "& .map-placeholder span": {
    color: "#647181",
  },
  "& .region-footer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexShrink: 0,
    minHeight: "92px",
    padding: "20px 28px",
    borderTop: "1px solid #E5E9ED",
    backgroundColor: "#FFFFFF",
  },
  "& .selected-copy": {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flex: "1 1 0",
    minWidth: 0,
    lineHeight: 1.5,
  },
  "& .selected-copy > span": {
    flexShrink: 0,
    color: "#647181",
  },
  "& .selected-copy strong": {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#005457",
    fontSize: "20px",
  },
  '& .selected-copy strong[data-empty="true"]': {
    color: "#8793A1",
    fontWeight: 400,
  },
  "& .footer-actions": {
    display: "flex",
    gap: "10px",
    flexShrink: 0,
  },
  "& .footer-actions button": {
    minHeight: "48px",
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: 700,
  },
  "& .cancel-button": {
    border: "1px solid #CFD6DD",
    backgroundColor: "#FFFFFF",
  },
  "& .cancel-button:hover": {
    backgroundColor: "#F5F3EC",
  },
  "& .confirm-button": {
    border: "1px solid #005457",
    backgroundColor: "#005457",
    color: "#FFFFFF",
  },
  "& .confirm-button:hover:not(:disabled)": {
    backgroundColor: "#003F42",
  },
  "& .confirm-button:disabled": {
    borderColor: "#CFD6DD",
    backgroundColor: "#CFD6DD",
    color: "#7C8794",
    cursor: "not-allowed",
  },
  "& .search-again": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minHeight: "40px",
    borderRadius: "6px",
    color: "#005457",
  },
  "& .search-again:hover": {
    backgroundColor: "#F3F0EA",
  },
  "@media (max-width: 1023px)": {
    fontSize: "17px",
    "& .region-dialog": {
      width: "920px",
      height: "min(640px, calc(100dvh - 48px))",
    },
    "& .region-header": {
      padding: "20px",
    },
    "& h2": {
      fontSize: "24px",
    },
    "& .region-search-panel": {
      flexBasis: "43%",
      padding: "20px 16px 12px",
      gap: "12px",
    },
    "& .region-footer": {
      padding: "16px 20px",
      gap: "12px",
    },
    "& .selected-copy": {
      gap: "10px",
    },
    "& .selected-copy strong": {
      fontSize: "18px",
    },
    "& .footer-actions button": {
      padding: "10px 18px",
    },
    "& button, & input": {
      fontSize: "16px",
    },
  },
  "@media (max-width: 767px)": {
    padding: 0,
    fontSize: "16px",
    "& .region-dialog": {
      width: "100%",
      maxWidth: "100%",
      height: "100dvh",
      borderRadius: 0,
      boxShadow: "none",
    },
    "& .region-header": {
      alignItems: "center",
      gap: "12px",
      minHeight: "64px",
      padding: "calc(12px + env(safe-area-inset-top)) 0px 12px",
    },
    "& .back-button": {
      display: "inline-flex",
    },
    "& .close-button, & .heading-copy p": {
      display: "none",
    },
    "& h2": {
      fontSize: "20px",
    },
    "& .region-content": {
      flexDirection: "column",
    },
    "& .region-search-panel": {
      flex: "1 1 0",
      width: "100%",
      borderRight: 0,
      padding: "20px 16px 0",
      gap: "16px",
    },
    "& .region-result": {
      minHeight: "78px",
    },
    '& .region-dialog[data-view="search"] .region-map': {
      display: "none",
    },
    '& .region-dialog[data-view="map"] .region-search-panel': {
      display: "none",
    },
    "& .region-footer": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "12px",
      minHeight: 0,
      padding: "16px 16px calc(16px + env(safe-area-inset-bottom))",
    },
    "& .selected-copy": {
      flex: "0 0 auto",
      minHeight: "30px",
      gap: "12px",
    },
    "& .selected-copy strong": {
      fontSize: "18px",
    },
    "& .footer-actions": {
      width: "100%",
    },
    "& .cancel-button": {
      display: "none",
    },
    "& .confirm-button": {
      flex: 1,
      minHeight: "52px",
    },
    "& button, & input": {
      fontSize: "16px",
    },
    "& .heading-copy p, & .result-copy span, & .results-caption, & .map-placeholder span, & .selected-copy > span":
      {
        fontSize: "15px",
      },
  },
  "& button, & input": {
    fontSize: "17px",
  },
  "& .heading-copy p, & .result-copy span, & .results-caption, & .map-placeholder span, & .selected-copy > span":
    {
      fontSize: "16px",
    },
});
