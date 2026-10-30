import styled from "@emotion/styled";
import { modalAnimation, menuAnimation } from "../../../styles/animation";

export const Overlay = styled.div({
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  backgroundColor: "rgba(15, 29, 31, 0.52)",
  overscrollBehavior: "contain",
  transition: "background-color 270ms ease",

  '&[data-open="false"]': {
    backgroundColor: "rgba(15, 29, 31, 0)",
    pointerEvents: "none",
  },

  "@media (max-width: 767px)": {
    alignItems: "flex-end",
    padding: 0,
  },
});

const BasePanel = styled.div({
  ...modalAnimation,

  "--body-size": "18px",
  "--secondary-size": "16px",
  "--caption-size": "15px",
  "--button-size": "17px",
  "--input-size": "17px",
  "--badge-size": "14px",
  "--place-title-size": "22px",
  "--modal-title-size": "36px",
  "--result-title-size": "28px",
  "--label-size": "16px",

  display: "flex",
  flexDirection: "column",
  width: "min(100%, 1180px)",
  height: "min(840px, calc(100dvh - 48px))",
  minHeight: 0,
  overflow: "hidden",
  borderRadius: "20px",
  backgroundColor: "#fff",
  color: "#0D3E41",
  boxShadow: "0 24px 80px rgba(9, 34, 36, 0.2)",
  fontSize: "var(--body-size)",
  outline: "none",

  "& button, & input": {
    WebkitTapHighlightColor: "transparent",
  },

  "& button:focus-visible, & input:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: "3px",
  },

  "& button:disabled": {
    opacity: 0.5,
  },

  "& .sheet-handle": {
    display: "none",
  },

  "& .modal-header": {
    position: "relative",
    flexShrink: 0,
    padding: "28px 32px 18px",
  },

  "& .day-badge": {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 12px",
    borderRadius: "10px",
    backgroundColor: "#E7F5F2",
    color: "#005358",
    fontSize: "var(--badge-size)",
    fontWeight: 600,
  },

  "& .modal-header h2": {
    marginTop: "10px",
    paddingRight: "36px",
    fontSize: "var(--modal-title-size)",
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: "-0.035em",
    wordBreak: "keep-all",
  },

  "& .icon-button": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    color: "#596D75",
    transition: "background-color 180ms ease, color 180ms ease",
  },

  "& .close-button": {
    position: "absolute",
    top: "24px",
    right: "24px",
  },

  "& .controls": {
    flexShrink: 0,
    padding: "0 32px 18px",
  },

  "& .tabs": {
    position: "relative",
    display: "flex",
    borderBottom: "1px solid #E2E6E9",
    marginBottom: "18px",
  },

  "& .tabs > button": {
    ...menuAnimation.button,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    flex: "1 1 0",
    minWidth: 0,
    minHeight: "56px",
    padding: "10px 6px",
    color: "#718596",
    fontSize: "var(--button-size)",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  '& .tabs > button[aria-selected="true"]': {
    color: "#005358",
  },

  "& .tab-count": {
    fontSize: "var(--badge-size)",
  },

  "& .tab-indicator": {
    ...menuAnimation.indicator,
    position: "absolute",
    bottom: "-1px",
    left: 0,
    width: "50%",
    height: "3px",
    borderRadius: "3px 3px 0 0",
    backgroundColor: "#005358",
    pointerEvents: "none",
    transform: "translateX(0)",
  },

  '& .tab-indicator[data-tab="saved"]': {
    transform: "translateX(100%)",
  },

  "& .search-form": {
    display: "flex",
    alignItems: "stretch",
    gap: "10px",
  },

  "& .search-field": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: "1 1 0",
    minWidth: 0,
    minHeight: "52px",
    padding: "7px 12px",
    border: "1px solid #CBD9DE",
    borderRadius: "11px",
    color: "#596D75",
    transition: "border-color 180ms ease, box-shadow 180ms ease",
  },

  "& .search-field:focus-within": {
    borderColor: "#527F79",
    boxShadow: "0 0 0 3px rgba(82, 127, 121, 0.12)",
  },

  "& .search-field > svg": {
    flexShrink: 0,
  },

  "& .search-field input": {
    flex: "1 1 0",
    width: "100%",
    minWidth: 0,
    border: 0,
    outline: "none",
    backgroundColor: "transparent",
    color: "#0D3E41",
    fontSize: "var(--input-size)",
  },

  "& .search-field input:focus-visible": {
    outline: "none",
  },

  "& .search-field input::placeholder": {
    color: "#8A99A4",
  },

  "& .clear-button": {
    width: "30px",
    height: "30px",
  },

  "& .primary, & .secondary": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minHeight: "48px",
    padding: "10px 22px",
    borderRadius: "10px",
    fontSize: "var(--button-size)",
    fontWeight: 600,
    whiteSpace: "nowrap",
    transition:
      "background-color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
  },

  "& .primary": {
    backgroundColor: "#005358",
    color: "#fff",
    border: "1px solid #005358",
  },

  "& .secondary": {
    backgroundColor: "#fff",
    color: "#005358",
    border: "1px solid #B8CED2",
  },

  "& .search-button": {
    minWidth: "88px",
  },

  "& .categories": {
    display: "flex",
    gap: "8px",
    marginTop: "14px",
    padding: "3px",
    overflowX: "auto",
    scrollbarWidth: "thin",
  },

  "& .categories button": {
    ...menuAnimation.button,
    flexShrink: 0,
    minHeight: "40px",
    padding: "7px 18px",
    border: "1px solid #CFDBE0",
    borderRadius: "999px",
    color: "#405960",
    fontSize: "var(--button-size)",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },

  '& .categories button[aria-pressed="true"]': {
    backgroundColor: "#005358",
    borderColor: "#005358",
    color: "#fff",
  },

  "& .results": {
    flex: "1 1 0",
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
    scrollbarGutter: "stable",
    padding: "4px 32px 20px",
    outlineOffset: "-3px",
  },

  "& .results-heading": {
    marginBottom: "16px",
  },

  "& .results-heading h3": {
    fontSize: "var(--result-title-size)",
    fontWeight: 700,
    lineHeight: 1.35,
    letterSpacing: "-0.025em",
  },

  "& .results-heading p": {
    marginTop: "5px",
    color: "#718596",
    fontSize: "var(--secondary-size)",
    wordBreak: "keep-all",
  },

  "& .place-list": {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  "& .place-row": {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "10px",
    border: "1px solid #E2E6E9",
    borderRadius: "12px",
    backgroundColor: "#fff",
    transition:
      "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
  },

  '& .place-row[data-selected="true"]': {
    backgroundColor: "#EDF9F6",
    borderColor: "#C4E5DD",
  },

  "& .place-image": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 132px",
    width: "132px",
    height: "96px",
    overflow: "hidden",
    borderRadius: "9px",
    backgroundColor: "#F0F4F3",
    color: "#91A5A1",
  },

  "& .place-image img": {
    height: "100%",
    objectFit: "cover",
  },

  "& .place-info": {
    flex: "1 1 0",
    minWidth: 0,
  },

  "& .place-name-line": {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "5px 8px",
  },

  "& .bookmark-button": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "30px",
    height: "32px",
    borderRadius: "7px",
    color: "#005358",
    transition: "background-color 180ms ease, transform 180ms ease",
  },

  "& .place-name-line h4": {
    flex: "1 1 80px",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "var(--place-title-size)",
    fontWeight: 700,
    lineHeight: 1.4,
    color: "#183C40",
  },

  "& .saved-badge, & .category-badge": {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    padding: "2px 9px",
    borderRadius: "999px",
    backgroundColor: "#E2F3EF",
    color: "#005358",
    fontSize: "var(--badge-size)",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },

  "& .category-badge": {
    marginTop: "3px",
  },

  "& .address": {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "6px",
    color: "#718596",
    fontSize: "var(--secondary-size)",
  },

  "& .address svg": {
    flexShrink: 0,
  },

  "& .address span": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  "& .select-button": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "42px",
    height: "42px",
    margin: "0 5px",
    border: "1px solid #005358",
    borderRadius: "50%",
    color: "#005358",
    transition:
      "background-color 180ms ease, color 180ms ease, transform 180ms ease",
  },

  '& .select-button[data-selected="true"]': {
    backgroundColor: "#005358",
    color: "#fff",
  },

  "& .existing-label": {
    position: "absolute",
    bottom: "7px",
    right: "13px",
    color: "#718596",
    fontSize: "var(--badge-size)",
  },

  "& .status": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    minHeight: "180px",
    padding: "24px 12px",
    color: "#718596",
    textAlign: "center",
    fontSize: "var(--secondary-size)",
  },

  "& .status strong": {
    color: "#405960",
    fontSize: "var(--body-size)",
  },

  "& .modal-footer": {
    flexShrink: 0,
    padding: "18px 32px",
    borderTop: "1px solid #E2E6E9",
    backgroundColor: "#fff",
  },

  "& .footer-content": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  "& .selection-summary": {
    minWidth: 0,
  },

  "& .selection-summary strong": {
    fontSize: "var(--body-size)",
    fontWeight: 700,
  },

  "& .selection-summary p": {
    marginTop: "3px",
    color: "#718596",
    fontSize: "var(--caption-size)",
    wordBreak: "keep-all",
  },

  "& .footer-actions": {
    display: "flex",
    flexShrink: 0,
    gap: "10px",
  },

  "& .error-message": {
    marginBottom: "12px",
    color: "#B44536",
    fontSize: "var(--secondary-size)",
  },

  "@media (hover: hover) and (pointer: fine)": {
    "& .icon-button:hover:not(:disabled)": {
      backgroundColor: "#EDF5F3",
      color: "#005358",
    },

    "& .tabs > button:hover": {
      backgroundColor: "#F5FAF8",
      color: "#005358",
    },

    '& .categories button:hover:not([aria-pressed="true"])': {
      backgroundColor: "#EDF5F3",
      borderColor: "#A9C7C0",
    },

    "& .primary:hover:not(:disabled)": {
      backgroundColor: "#08666B",
      borderColor: "#08666B",
      boxShadow: "0 4px 10px rgba(0, 83, 88, 0.14)",
      transform: "translateY(-1px)",
    },

    "& .secondary:hover:not(:disabled)": {
      backgroundColor: "#EDF5F3",
      borderColor: "#527F79",
      transform: "translateY(-1px)",
    },

    "& .place-row:hover": {
      borderColor: "#BDD5CF",
      boxShadow: "0 3px 10px rgba(13, 62, 65, 0.04)",
    },

    "& .bookmark-button:hover:not(:disabled)": {
      backgroundColor: "#DFF0EA",
      transform: "translateY(-1px)",
    },

    '& .select-button:hover:not(:disabled):not([data-selected="true"])': {
      backgroundColor: "#DFF0EA",
      transform: "scale(1.06)",
    },

    '& .select-button[data-selected="true"]:hover:not(:disabled)': {
      backgroundColor: "#08666B",
      transform: "scale(1.06)",
    },
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    "--body-size": "17px",
    "--caption-size": "14px",
    "--button-size": "16px",
    "--input-size": "16px",
    "--place-title-size": "20px",
    "--label-size": "15px",
    "--modal-title-size": "30px",
    "--result-title-size": "24px",

    width: "min(100%, 760px)",

    "& .modal-header": {
      padding: "24px 24px 16px",
    },

    "& .controls": {
      padding: "0 24px 16px",
    },

    "& .results": {
      padding: "4px 24px 18px",
    },

    "& .modal-footer": {
      padding: "16px 24px",
    },

    "& .place-image": {
      flexBasis: "112px",
      width: "112px",
      height: "90px",
    },
  },

  "@media (max-width: 767px)": {
    "--body-size": "16px",
    "--secondary-size": "15px",
    "--caption-size": "14px",
    "--button-size": "16px",
    "--input-size": "16px",
    "--badge-size": "13px",
    "--place-title-size": "18px",
    "--label-size": "15px",
    "--modal-title-size": "24px",
    "--result-title-size": "20px",

    width: "100%",
    height: "92dvh",
    maxHeight: "calc(100dvh - 12px)",
    borderRadius: "20px 20px 0 0",

    "& .sheet-handle": {
      display: "block",
      flexShrink: 0,
      alignSelf: "center",
      width: "38px",
      height: "4px",
      marginTop: "10px",
      borderRadius: "99px",
      backgroundColor: "#D4DEDD",
    },

    "& .modal-header": {
      padding: "16px 18px 12px",
    },

    "& .close-button": {
      top: "13px",
      right: "12px",
    },

    "& .controls": {
      padding: "0 16px 12px",
    },

    "& .tabs": {
      marginBottom: "14px",
    },

    "& .tabs > button": {
      gap: "6px",
      minHeight: "48px",
    },

    "& .tabs > button svg": {
      width: "18px",
      height: "18px",
    },

    "& .search-form": {
      gap: "8px",
    },

    "& .search-field": {
      gap: "7px",
      minHeight: "48px",
      padding: "6px 10px",
    },

    "& .search-field > svg": {
      width: "18px",
      height: "18px",
    },

    "& .search-button": {
      minWidth: "62px",
      padding: "9px 13px",
    },

    "& .categories": {
      gap: "7px",
      marginTop: "10px",
    },

    "& .categories button": {
      padding: "7px 14px",
    },

    "& .results": {
      padding: "4px 16px 16px",
    },

    "& .results-heading": {
      marginBottom: "12px",
    },

    "& .place-row": {
      gap: "9px",
      padding: "9px",
    },

    "& .place-image": {
      flexBasis: "76px",
      width: "76px",
      height: "84px",
    },

    "& .place-name-line": {
      gap: "3px",
    },

    "& .bookmark-button": {
      width: "28px",
      height: "32px",
    },

    "& .saved-badge": {
      display: "none",
    },

    "& .select-button": {
      width: "36px",
      height: "36px",
      margin: 0,
    },

    "& .select-button svg": {
      width: "20px",
      height: "20px",
    },

    "& .existing-label": {
      right: "9px",
      bottom: "4px",
    },

    "& .modal-footer": {
      padding: "14px 16px calc(14px + env(safe-area-inset-bottom))",
    },

    "& .footer-content": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "12px",
    },

    "& .footer-actions": {
      gap: "10px",
    },

    "& .footer-actions .secondary": {
      flex: "0 0 28%",
    },

    "& .footer-actions .primary": {
      flex: "1 1 0",
    },
  },
});

export const Panel = styled(BasePanel)({
  position: "relative",
  // 닫기 애니메이션 종료 후까지 fixed 팝업의 기준을 유지
  transform: "translateY(0)",
  "& [hidden]": { display: "none" },
  "& .title-row": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "10px",
    paddingRight: "30px",
  },
  "& .title-row h2": {
    marginTop: 0,
    paddingRight: 0,
    minWidth: 0,
    outline: "none",
  },
  "& .step-badge": {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "54px",
    padding: "3px 10px",
    borderRadius: "999px",
    backgroundColor: "#DFF4EF",
    color: "#005358",
    fontSize: "var(--badge-size)",
    fontWeight: 700,
  },
  "& .step-description": {
    marginTop: "7px",
    color: "#596D75",
    fontSize: "var(--secondary-size)",
  },
  "& .back-button": {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minHeight: "34px",
    marginBottom: "8px",
    color: "#596D75",
    fontSize: "var(--button-size)",
    ...menuAnimation.button,
  },
  "& .modal-body": {
    display: "flex",
    flex: "1 1 0",
    minHeight: 0,
    minWidth: 0,
    gap: "20px",
    padding: "0 24px 20px",
  },
  "& .selection-pane": {
    display: "flex",
    flexDirection: "column",
    flex: "1.25 1 0",
    minHeight: 0,
    minWidth: 0,
  },
  "& .selection-pane .controls": { padding: "0 8px 16px" },
  "& .selection-pane .results": { padding: "4px 8px 16px" },
  "& .schedule-pane": {
    flex: "1 1 0",
    minWidth: 0,
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
    padding: "20px 16px",
    borderRadius: "14px",
    backgroundColor: "#F5F7F7",
    scrollbarGutter: "stable",
  },
  "& .schedule-heading": { marginBottom: "16px" },
  "& .schedule-heading h3": {
    fontSize: "var(--result-title-size)",
    fontWeight: 700,
  },
  "& .schedule-heading p": {
    marginTop: "6px",
    color: "#718596",
    fontSize: "var(--secondary-size)",
  },
  "& .schedule-card": {
    border: "1px solid #E2E6E9",
    borderRadius: "12px",
    backgroundColor: "#fff",
    marginBottom: "12px",
  },
  '& .schedule-card:has([data-present="true"])': {
    position: "relative",
    zIndex: 10,
  },
  "& .schedule-card-trigger": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "12px",
    textAlign: "left",
    borderRadius: "12px",
    ...menuAnimation.button,
  },
  "& .place-number": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "25px",
    height: "25px",
    backgroundColor: "#EDF1F2",
    borderRadius: "50%",
    fontSize: "var(--badge-size)",
    color: "#596D75",
  },
  "& .schedule-card-trigger .place-image": {
    flexBasis: "58px",
    width: "58px",
    height: "54px",
  },
  "& .schedule-card-info": {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
    flex: "1 1 0",
  },
  "& .schedule-card-info strong": {
    fontSize: "var(--place-title-size)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  "& .schedule-address, & .schedule-summary": {
    color: "#718596",
    fontSize: "var(--caption-size)",
    overflowWrap: "anywhere",
  },
  "& .accordion-chevron": { flexShrink: 0, transition: "transform 240ms ease" },
  '& .schedule-card[data-expanded="true"] .accordion-chevron': {
    transform: "rotate(180deg)",
  },
  "& .schedule-fields": {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "4px 16px 18px",
  },
  "& .schedule-field": { minWidth: 0 },
  "& .field-label, & .schedule-time-picker .picker-label": {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
    fontSize: "var(--label-size)",
    color: "#183C40",
  },
  "& .schedule-time-picker": { minWidth: 0 },
  "& .schedule-time-picker > div": { width: "100%", minWidth: 0 },
  "& .schedule-time-picker .picker-trigger": {
    width: "100%",
    minHeight: "46px",
    fontSize: "var(--input-size)",
    border: "1px solid #CBD9DE",
    borderRadius: "9px",
    backgroundColor: "#fff",
  },
  "& .schedule-time-picker .picker-popup": { fontSize: "var(--input-size)" },
  "& .duration-inputs": { display: "flex", gap: "12px" },
  "& .duration-inputs label": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: "1 1 0",
    minWidth: 0,
    fontSize: "var(--body-size)",
  },
  "& .duration-inputs input": {
    width: "100%",
    minWidth: 0,
    minHeight: "46px",
    padding: "9px 10px",
    border: "1px solid #CBD9DE",
    borderRadius: "9px",
    backgroundColor: "#fff",
    fontSize: "var(--input-size)",
  },
  "& .duration-inputs label > span": { flexShrink: 0 },
  "& .field-help": {
    marginTop: "7px",
    fontSize: "var(--secondary-size)",
    color: "#718596",
    wordBreak: "keep-all",
    overflowWrap: "anywhere",
  },
  "& .field-help strong": { fontWeight: 600 },
  "& .transport-select": { position: "relative" },
  "& .transport-select select": {
    appearance: "none",
    width: "100%",
    minWidth: 0,
    minHeight: "46px",
    padding: "9px 36px 9px 12px",
    border: "1px solid #CBD9DE",
    borderRadius: "9px",
    backgroundColor: "#fff",
    fontSize: "var(--input-size)",
  },
  "& .transport-select > svg": {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  "& select:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: "3px",
  },
  "& .default-transport": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "10px",
    padding: "10px 12px",
    borderRadius: "9px",
    backgroundColor: "#E4F5F1",
    color: "#005358",
    fontSize: "var(--badge-size)",
    fontWeight: 600,
  },
  "& .default-transport svg": { flexShrink: 0 },
  "@media (min-width: 1024px)": {
    "& .place-row": { gap: "9px", padding: "9px" },
    "& .place-image": { flexBasis: "96px", width: "96px", height: "88px" },
    "& .saved-badge": { fontSize: "14px" },
  },
  "@media (max-width: 1023px)": {
    "& .modal-body": { padding: "0 24px 16px", gap: 0 },
    "& .selection-pane": { flex: "1 1 0" },
    "& .selection-pane .controls": { padding: "0 0 14px" },
    "& .selection-pane .results": { padding: "4px 0 14px" },
    "& .schedule-pane": {
      padding: "4px 2px 12px",
      backgroundColor: "transparent",
      borderRadius: 0,
    },
    "& .schedule-card-trigger .place-image": {
      flexBasis: "70px",
      width: "70px",
      height: "58px",
    },
    "& .schedule-fields": { padding: "6px 18px 18px" },
  },
  "@media (max-width: 767px)": {
    "& .modal-body": { padding: "0 16px 12px" },
    "& .title-row": { gap: "9px", paddingRight: "24px" },
    "& .step-badge": { minWidth: "46px", padding: "3px 8px" },
    "& .schedule-card-trigger": { gap: "8px", padding: "10px" },
    "& .schedule-card-trigger .place-image": {
      flexBasis: "54px",
      width: "54px",
      height: "52px",
    },
    "& .place-number": { width: "22px", height: "22px" },
    "& .schedule-fields": { padding: "6px 12px 16px", gap: "18px" },
    "& .duration-inputs": { gap: "10px" },
    "& .duration-inputs label": { gap: "6px" },
    "& .footer-actions .primary": { padding: "10px 12px" },
  },
  "@media (hover: hover) and (pointer: fine)": {
    "& .schedule-card-trigger:hover:not(:disabled)": {
      backgroundColor: "#F1F8F5",
    },
    "& .back-button:hover:not(:disabled)": { color: "#005358" },
  },
});
