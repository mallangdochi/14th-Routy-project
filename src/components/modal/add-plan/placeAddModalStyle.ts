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
  "&[data-open=\"false\"]": {
    backgroundColor: "rgba(15, 29, 31, 0)",
    pointerEvents: "none"
  },
  "@media (max-width: 767px)": {
    alignItems: "flex-end",
    padding: 0,
    boxSizing: "border-box",
    left: 0,
    right: 0,
    width: "100%",
    maxWidth: "none",
    margin: 0
  }
});

export const Panel = styled.div(modalAnimation, {
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
    WebkitTapHighlightColor: "transparent"
  },
  "& button:focus-visible, & input:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: "3px"
  },
  "& button:disabled": {
    opacity: 0.5
  },
  "& .sheet-handle": {
    display: "none"
  },
  "& .modal-header": {
    position: "relative",
    flexShrink: 0,
    padding: "28px 32px 18px"
  },
  "& .day-badge": {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 12px",
    borderRadius: "10px",
    backgroundColor: "#E7F5F2",
    color: "#005358",
    fontSize: "var(--badge-size)",
    fontWeight: 600
  },
  "& .modal-header h2": {
    marginTop: "10px",
    paddingRight: "36px",
    fontSize: "var(--modal-title-size)",
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: "-0.035em",
    wordBreak: "keep-all"
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
    transition: "background-color 180ms ease, color 180ms ease"
  },
  "& .close-button": {
    position: "absolute",
    top: "24px",
    right: "24px"
  },
  "& .controls": {
    flexShrink: 0,
    padding: "0 32px 18px"
  },
  "& .tabs": {
    position: "relative",
    display: "flex",
    borderBottom: "1px solid #E2E6E9",
    marginBottom: "18px"
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
    whiteSpace: "nowrap"
  },
  "& .tabs > button[aria-selected=\"true\"]": {
    color: "#005358"
  },
  "& .tab-count": {
    fontSize: "var(--badge-size)"
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
    transform: "translateX(0)"
  },
  "& .tab-indicator[data-tab=\"saved\"]": {
    transform: "translateX(100%)"
  },
  "& .search-form": {
    display: "flex",
    alignItems: "stretch",
    gap: "10px"
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
    transition: "border-color 180ms ease, box-shadow 180ms ease"
  },
  "& .search-field:focus-within": {
    borderColor: "#527F79",
    boxShadow: "0 0 0 3px rgba(82, 127, 121, 0.12)"
  },
  "& .search-field > svg": {
    flexShrink: 0
  },
  "& .search-field input": {
    flex: "1 1 0",
    width: "100%",
    minWidth: 0,
    border: 0,
    outline: "none",
    backgroundColor: "transparent",
    color: "#0D3E41",
    fontSize: "var(--input-size)"
  },
  "& .search-field input:focus-visible": {
    outline: "none"
  },
  "& .search-field input::placeholder": {
    color: "#8A99A4"
  },
  "& .clear-button": {
    width: "30px",
    height: "30px"
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
    transition: "background-color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease"
  },
  "& .primary": {
    backgroundColor: "#005358",
    color: "#fff",
    border: "1px solid #005358"
  },
  "& .secondary": {
    backgroundColor: "#fff",
    color: "#005358",
    border: "1px solid #B8CED2"
  },
  "& .search-button": {
    minWidth: "88px"
  },
  "& .categories": {
    display: "flex",
    gap: "8px",
    marginTop: "14px",
    padding: "3px",
    overflowX: "auto",
    scrollbarWidth: "thin"
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
    whiteSpace: "nowrap"
  },
  "& .categories button[aria-pressed=\"true\"]": {
    backgroundColor: "#005358",
    borderColor: "#005358",
    color: "#fff"
  },
  "& .results": {
    flex: "1 1 0",
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
    scrollbarGutter: "stable",
    padding: "4px 32px 20px",
    outlineOffset: "-3px"
  },
  "& .results-heading": {
    marginBottom: "16px"
  },
  "& .results-heading h3": {
    fontSize: "var(--result-title-size)",
    fontWeight: 700,
    lineHeight: 1.35,
    letterSpacing: "-0.025em"
  },
  "& .results-heading p": {
    marginTop: "5px",
    color: "#718596",
    fontSize: "var(--secondary-size)",
    wordBreak: "keep-all"
  },
  "& .place-list": {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  "& .place-row": {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "9px",
    border: "1px solid #E2E6E9",
    borderRadius: "12px",
    backgroundColor: "#fff",
    transition: "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease"
  },
  "& .place-row[data-selected=\"true\"]": {
    backgroundColor: "#EDF9F6",
    borderColor: "#C4E5DD"
  },
  "& .place-image": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 132px",
    width: "96px",
    height: "88px",
    overflow: "hidden",
    borderRadius: "9px",
    backgroundColor: "#F0F4F3",
    color: "#91A5A1",
    flexBasis: "96px"
  },
  "& .place-image img": {
    height: "100%",
    objectFit: "cover"
  },
  "& .place-info": {
    flex: "1 1 0",
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: "max-content minmax(0, 1fr)",
    columnGap: "8px",
    rowGap: "7px",
    alignItems: "center"
  },
  "& .place-name-line": {
    display: "contents",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "5px 8px"
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
    transition: "background-color 180ms ease, transform 180ms ease"
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
    gridColumn: "2",
    gridRow: "1",
    margin: 0
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
    whiteSpace: "nowrap"
  },
  "& .category-badge": {
    marginTop: "3px"
  },
  "& .address": {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "6px",
    color: "#718596",
    fontSize: "var(--secondary-size)"
  },
  "& .address svg": {
    flexShrink: 0
  },
  "& .address span": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
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
    transition: "background-color 180ms ease, color 180ms ease, transform 180ms ease"
  },
  "& .select-button[data-selected=\"true\"]": {
    backgroundColor: "#005358",
    color: "#fff"
  },
  "& .existing-label": {
    position: "absolute",
    bottom: "7px",
    right: "13px",
    color: "#718596",
    fontSize: "var(--badge-size)"
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
    fontSize: "var(--secondary-size)"
  },
  "& .status strong": {
    color: "#405960",
    fontSize: "var(--body-size)"
  },
  "& .modal-footer": {
    flexShrink: 0,
    padding: "18px 32px",
    borderTop: "1px solid #E2E6E9",
    backgroundColor: "#fff"
  },
  "& .footer-content": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px"
  },
  "& .selection-summary": {
    minWidth: 0
  },
  "& .selection-summary strong": {
    fontSize: "var(--body-size)",
    fontWeight: 700
  },
  "& .selection-summary p": {
    marginTop: "3px",
    color: "#718596",
    fontSize: "var(--caption-size)",
    wordBreak: "keep-all"
  },
  "& .footer-actions": {
    display: "flex",
    flexShrink: 0,
    gap: "10px"
  },
  "& .error-message": {
    marginBottom: "12px",
    color: "#B44536",
    fontSize: "var(--secondary-size)"
  },
  position: "relative",
  transform: "translateY(0)",
  "& [hidden]": {
    display: "none"
  },
  "& .title-row": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "10px",
    paddingRight: "30px"
  },
  "& .title-row h2": {
    marginTop: 0,
    paddingRight: 0,
    minWidth: 0,
    outline: "none"
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
    fontWeight: 700
  },
  "& .step-description": {
    marginTop: "7px",
    color: "#596D75",
    fontSize: "var(--secondary-size)"
  },
  "& .modal-body": {
    display: "flex",
    flex: "1 1 0",
    minHeight: 0,
    minWidth: 0,
    gap: "20px",
    padding: "0 24px 20px"
  },
  "& .selection-pane": {
    display: "flex",
    flexDirection: "column",
    flex: "1.25 1 0",
    minHeight: 0,
    minWidth: 0
  },
  "& .selection-pane .controls": {
    padding: "0 8px 16px"
  },
  "& .selection-pane .results": {
    padding: "4px 8px 16px"
  },
  "& .schedule-pane": {
    flex: "1 1 0",
    minWidth: 0,
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
    padding: "20px 16px",
    borderRadius: "14px",
    backgroundColor: "#F5F7F7",
    scrollbarGutter: "stable"
  },
  "& .schedule-heading": {
    marginBottom: "10px"
  },
  "& .schedule-heading-actions": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px 12px"
  },
  "& .selection-reset-button, & .selection-remove-button": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    gap: "6px",
    border: 0,
    backgroundColor: "transparent",
    color: "#A26056",
    fontSize: "var(--caption-size)",
    fontWeight: 500,
    whiteSpace: "nowrap",
    transition: "background-color 180ms ease, color 180ms ease"
  },
  "& .selection-reset-button": {
    marginLeft: "auto",
    padding: "6px 8px",
    borderRadius: "8px"
  },
  "& .schedule-card-actions": {
    display: "flex",
    justifyContent: "flex-end",
    padding: "0 8px",
    borderTop: "1px solid #E2E6E9",
    borderRadius: "0 0 12px 12px",
    backgroundColor: "#fff"
  },
  "& .selection-remove-button": {
    padding: "8px",
    borderRadius: "8px"
  },
  "& .selection-reset-button svg, & .selection-remove-button svg": {
    flexShrink: 0
  },
  "& .schedule-heading h3": {
    fontSize: "var(--result-title-size)",
    fontWeight: 700
  },
  "& .schedule-heading p": {
    display: "none"
  },
  "& .schedule-card": {
    border: "1px solid #E2E6E9",
    borderRadius: "12px",
    backgroundColor: "#fff",
    marginBottom: "12px"
  },
  "& .schedule-card:has([data-present=\"true\"])": {
    position: "relative",
    zIndex: 10
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
    color: "#596D75"
  },
  "& .schedule-card-trigger .place-image": {
    flexBasis: "58px",
    width: "110px",
    height: "80px",
    display: "flex",
    gridColumn: "1",
    gridRow: "1",
    minWidth: 0
  },
  "& .schedule-address, & .schedule-summary": {
    color: "#718596",
    fontSize: "var(--caption-size)",
    overflowWrap: "anywhere"
  },
  "& .accordion-chevron": {
    flexShrink: 0,
    transition: "transform 240ms ease"
  },
  "& .schedule-card[data-expanded=\"true\"] .accordion-chevron": {
    transform: "rotate(180deg)"
  },
  "& .schedule-fields": {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "4px 16px 18px"
  },
  "& .schedule-field": {
    minWidth: 0
  },
  "& .field-label, & .schedule-time-picker .picker-label": {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
    fontSize: "var(--label-size)",
    color: "#183C40"
  },
  "& .schedule-time-picker": {
    minWidth: 0
  },
  "& .schedule-time-picker > div": {
    width: "100%",
    minWidth: 0
  },
  "& .schedule-time-picker .picker-trigger": {
    width: "100%",
    minHeight: "46px",
    fontSize: "var(--input-size)",
    border: "1px solid #CBD9DE",
    borderRadius: "9px",
    backgroundColor: "#fff",
    whiteSpace: "nowrap",
    minWidth: 0
  },
  "& .schedule-time-picker .picker-popup": {
    fontSize: "var(--input-size)"
  },
  "& .duration-inputs": {
    display: "flex",
    gap: "12px"
  },
  "& .duration-inputs label": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: "1 1 0",
    minWidth: 0,
    fontSize: "var(--body-size)"
  },
  "& .duration-inputs input": {
    width: "100%",
    minWidth: 0,
    minHeight: "46px",
    padding: "9px 10px",
    border: "1px solid #CBD9DE",
    borderRadius: "9px",
    backgroundColor: "#fff",
    fontSize: "var(--input-size)"
  },
  "& .duration-inputs label > span": {
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  "& .field-help": {
    marginTop: "7px",
    fontSize: "var(--secondary-size)",
    color: "#718596",
    wordBreak: "keep-all",
    overflowWrap: "anywhere"
  },
  "& .field-help strong": {
    fontWeight: 600
  },
  "& .transport-select": {
    position: "relative"
  },
  "& .transport-dropdown": {
    width: "100%",
    minWidth: 0
  },
  "& .transport-dropdown .sort-trigger": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    width: "100%",
    minWidth: 0,
    minHeight: "46px",
    padding: "9px 12px",
    border: "1px solid #CBD9DE",
    borderRadius: "9px",
    backgroundColor: "#fff",
    color: "#596D75",
    fontFamily: "inherit",
    fontSize: "var(--input-size)",
    textAlign: "left"
  },
  "& .transport-dropdown .sort-trigger > span:first-of-type": {
    minWidth: 0,
    whiteSpace: "normal",
    overflowWrap: "anywhere"
  },
  "& .transport-dropdown .dropdown-trigger-icon": {
    display: "inline-flex",
    flexShrink: 0
  },
  "& .transport-dropdown .sort-trigger:focus-visible": {
    outline: "2px solid #527F79",
    outlineOffset: "2px"
  },
  "& .schedule-place-meta .schedule-address svg": {
    flexShrink: 0
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
    fontWeight: 600
  },
  "& .default-transport svg": {
    flexShrink: 0
  },
  "& .schedule-card .schedule-card-trigger": {
    display: "grid",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "12px",
    textAlign: "left",
    borderRadius: "12px",
    ...menuAnimation.button,
    gridTemplateColumns: "110px minmax(0, 1fr) 20px"
  },
  "& .schedule-card-trigger .schedule-card-info": {
    display: "grid",
    flexDirection: "column",
    gap: "8px",
    minWidth: 0,
    flex: "1 1 0",
    gridTemplateColumns: "30px minmax(0, 1fr)",
    alignItems: "center",
    gridColumn: "2",
    gridRow: "1"
  },
  "& .schedule-card-trigger .schedule-bookmark-indicator": {
    gridColumn: "1",
    gridRow: "1",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "30px",
    height: "32px",
    paddingLeft: "7px",
    color: "#005358"
  },
  "& .schedule-card-trigger .schedule-card-info strong": {
    fontSize: "var(--place-title-size)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    gridColumn: "2",
    gridRow: "1",
    minWidth: 0
  },
  "& .schedule-card-trigger .schedule-place-meta": {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: "8px",
    gridColumn: "1 / -1",
    gridRow: "2",
    minWidth: 0
  },
  "& .schedule-card-trigger .category-badge": {
    marginTop: 0,
    flex: "0 1 auto",
    minWidth: 0,
    maxWidth: "58%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block"
  },
  "& .schedule-card-trigger .schedule-address": {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    minWidth: 0,
    flex: "1 1 0",
    overflow: "hidden"
  },
  "& .schedule-card-trigger .schedule-address > span": {
    display: "block",
    minWidth: 0,
    flex: "1 1 0",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  "& .schedule-card-trigger .schedule-summary": {
    gridColumn: "1 / -1",
    minWidth: 0
  },
  "& .schedule-card-trigger .accordion-chevron": {
    gridColumn: "3",
    justifySelf: "end",
    gridRow: "1"
  },
  "& .place-info .bookmark-button": {
    gridColumn: "1",
    gridRow: "1"
  },
  "& .place-info > .category-badge": {
    gridColumn: "1",
    gridRow: "2",
    marginTop: 0
  },
  "& .place-info > .address": {
    gridColumn: "2",
    gridRow: "2",
    minWidth: 0,
    marginTop: 0,
    overflow: "hidden"
  },
  "& .place-info > .address span": {
    display: "block",
    flex: "1 1 0",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  "& .place-name-line .saved-badge": {
    display: "none"
  },
  "& .place-row .select-button": {
    width: "37.8px",
    height: "37.8px"
  },
  "& .place-row .select-button svg": {
    width: "19.8px",
    height: "19.8px"
  },
  "& .saved-badge": {
    fontSize: "14px"
  },
  "@media (hover: hover) and (pointer: fine)": {
    "& .icon-button:hover:not(:disabled)": {
      backgroundColor: "#EDF5F3",
      color: "#005358"
    },
    "& .tabs > button:hover": {
      backgroundColor: "#F5FAF8",
      color: "#005358"
    },
    "& .categories button:hover:not([aria-pressed=\"true\"])": {
      backgroundColor: "#EDF5F3",
      borderColor: "#A9C7C0"
    },
    "& .primary:hover:not(:disabled)": {
      backgroundColor: "#08666B",
      borderColor: "#08666B",
      boxShadow: "0 4px 10px rgba(0, 83, 88, 0.14)",
      transform: "translateY(-1px)"
    },
    "& .secondary:hover:not(:disabled)": {
      backgroundColor: "#EDF5F3",
      borderColor: "#527F79",
      transform: "translateY(-1px)"
    },
    "& .place-row:hover": {
      borderColor: "#BDD5CF",
      boxShadow: "0 3px 10px rgba(13, 62, 65, 0.04)"
    },
    "& .bookmark-button:hover:not(:disabled)": {
      backgroundColor: "#DFF0EA",
      transform: "translateY(-1px)"
    },
    "& .select-button:hover:not(:disabled):not([data-selected=\"true\"])": {
      backgroundColor: "#DFF0EA",
      transform: "scale(1.06)"
    },
    "& .select-button[data-selected=\"true\"]:hover:not(:disabled)": {
      backgroundColor: "#08666B",
      transform: "scale(1.06)"
    },
    "& .selection-reset-button:hover:not(:disabled), & .selection-remove-button:hover:not(:disabled)": {
      backgroundColor: "#FFF5F2",
      color: "#BC4C38"
    },
    "& .schedule-card-trigger:hover:not(:disabled)": {
      backgroundColor: "#F1F8F5"
    }
  },
  "@media (max-width: 1023px)": {
    "--body-size": "17px",
    "--caption-size": "14px",
    "--button-size": "16px",
    "--input-size": "16px",
    "--place-title-size": "18px",
    "--label-size": "15px",
    "--modal-title-size": "28px",
    "--result-title-size": "22px",
    width: "min(680px, calc(100vw - 64px))",
    "& .modal-header": {
      padding: "22px 26px 3px"
    },
    "& .controls": {
      padding: "0 24px 16px"
    },
    "& .results": {
      padding: "4px 24px 18px"
    },
    "& .modal-footer": {
      padding: "14px 26px"
    },
    "& .place-image": {
      flexBasis: "112px",
      width: "112px",
      height: "90px"
    },
    "& .modal-body": {
      flexDirection: "column",
      alignItems: "stretch",
      padding: "0 26px 16px",
      gap: 0,
      overflow: "hidden"
    },
    "& .selection-pane": {
      flex: "1 1 0",
      width: "100%",
      minWidth: 0
    },
    "& .selection-pane .controls": {
      padding: "0 0 14px"
    },
    "& .selection-pane .results": {
      padding: "4px 0 14px"
    },
    "& .schedule-pane": {
      flex: "1 1 0",
      width: "100%",
      minWidth: 0,
      overflowX: "hidden",
      padding: "2px 0 12px",
      backgroundColor: "transparent",
      borderRadius: 0
    },
    "& .schedule-card-trigger .place-image": {
      flexBasis: "88px",
      width: "88px",
      height: "64px"
    },
    "& .schedule-fields": {
      padding: "2px 16px 20px",
      gap: "22px"
    },
    height: "min(820px, calc(100dvh - 48px))",
    "& .schedule-card": {
      borderRadius: "9px",
      marginBottom: "12px"
    },
    "& .schedule-field": {
      display: "grid",
      gridTemplateColumns: "104px minmax(0, 1fr)",
      columnGap: "8px",
      alignItems: "center"
    },
    "& .schedule-field > .field-label": {
      marginBottom: 0
    },
    "& .schedule-field > .field-help, & .schedule-field > .default-transport": {
      gridColumn: "2"
    },
    "& .schedule-time-picker": {
      gridColumn: "1 / -1",
      width: "100%"
    },
    "& .schedule-time-picker > div": {
      display: "grid",
      gridTemplateColumns: "104px minmax(0, 1fr)",
      columnGap: "8px",
      alignItems: "center"
    },
    "& .schedule-time-picker .picker-label": {
      marginBottom: 0,
      gridColumn: "1"
    },
    "& .schedule-time-picker .picker-trigger": {
      gridColumn: "2"
    },
    "& .duration-inputs": {
      gap: "8px"
    },
    "& .field-help": {
      fontSize: "14px",
      lineHeight: 1.5
    },
    "& .selection-pane .place-image": {
      flexBasis: "120px",
      width: "120px",
      height: "96px"
    },
    "& .place-row": {
      gap: "14px",
      padding: "10px"
    },
    "& .saved-badge": {
      fontSize: "var(--badge-size)"
    },
    "& .schedule-card .schedule-card-trigger": {
      padding: "14px",
      gap: "12px"
    }
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
    width: "100vw",
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
      backgroundColor: "#D4DEDD"
    },
    "& .modal-header": {
      padding: "16px 18px 5px"
    },
    "& .close-button": {
      top: "13px",
      right: "12px"
    },
    "& .controls": {
      padding: "0 16px 12px"
    },
    "& .tabs": {
      marginBottom: "14px"
    },
    "& .tabs > button": {
      gap: "6px",
      minHeight: "48px"
    },
    "& .tabs > button svg": {
      width: "18px",
      height: "18px"
    },
    "& .search-form": {
      gap: "8px"
    },
    "& .search-field": {
      gap: "7px",
      minHeight: "48px",
      padding: "6px 10px"
    },
    "& .search-field > svg": {
      width: "18px",
      height: "18px"
    },
    "& .search-button": {
      minWidth: "62px",
      padding: "9px 13px"
    },
    "& .categories": {
      gap: "7px",
      marginTop: "10px"
    },
    "& .categories button": {
      padding: "7px 14px"
    },
    "& .results": {
      padding: "4px 16px 16px"
    },
    "& .results-heading": {
      marginBottom: "12px"
    },
    "& .place-row": {
      gap: "12px",
      padding: "14px 12px",
      alignItems: "center"
    },
    "& .place-image": {
      flexBasis: "76px",
      width: "76px",
      height: "84px",
      display: "none"
    },
    "& .place-name-line": {
      gap: "3px",
      display: "contents"
    },
    "& .bookmark-button": {
      width: "28px",
      height: "32px"
    },
    "& .saved-badge": {
      display: "none"
    },
    "& .select-button": {
      width: "36px",
      height: "36px",
      margin: 0
    },
    "& .select-button svg": {
      width: "20px",
      height: "20px"
    },
    "& .existing-label": {
      right: "9px",
      bottom: "4px"
    },
    "& .modal-footer": {
      padding: "14px 16px calc(14px + env(safe-area-inset-bottom))"
    },
    "& .footer-content": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "12px"
    },
    "& .footer-actions": {
      gap: "10px",
      justifyContent: "center"
    },
    "& .footer-actions .secondary": {
      flex: "0 0 28%"
    },
    "& .footer-actions .primary": {
      flex: "1 1 0",
      padding: "10px 12px"
    },
    "& .step-description": {
      display: "none"
    },
    "& .place-info": {
      display: "grid",
      gridTemplateColumns: "28px minmax(0, 1fr)",
      alignItems: "center",
      columnGap: "8px",
      rowGap: "7px"
    },
    "& .place-info .bookmark-button": {
      gridColumn: "1",
      gridRow: "1"
    },
    "& .place-info > .category-badge": {
      gridColumn: "2",
      gridRow: "1",
      marginTop: 0
    },
    "& .place-name-line h4": {
      gridColumn: "1 / -1",
      gridRow: "2",
      margin: 0,
      whiteSpace: "normal",
      overflowWrap: "anywhere",
      overflow: "visible",
      textOverflow: "clip"
    },
    "& .place-info > .address": {
      gridColumn: "1 / -1",
      gridRow: "3",
      marginTop: 0,
      alignItems: "flex-start",
      lineHeight: 1.5
    },
    "& .place-info > .address span": {
      whiteSpace: "normal",
      overflowWrap: "anywhere",
      overflow: "visible",
      textOverflow: "clip"
    },
    "& .place-row .select-button": {
      width: "32.4px",
      height: "32.4px",
      margin: 0
    },
    "& .place-row .select-button svg": {
      width: "18px",
      height: "18px"
    },
    "& .selection-summary": {
      textAlign: "center"
    },
    "& .selection-summary p": {
      display: "none"
    },
    "& .footer-actions .secondary, & .footer-actions .primary": {
      flex: "0 1 auto",
      minWidth: "88px"
    },
    "& .modal-body": {
      padding: "0 16px 12px"
    },
    "& .title-row": {
      gap: "9px",
      paddingRight: "24px"
    },
    "& .step-badge": {
      minWidth: "46px",
      padding: "3px 8px"
    },
    "& .schedule-card-trigger .place-image": {
      display: "none"
    },
    "& .place-number": {
      width: "22px",
      height: "22px"
    },
    "& .schedule-fields": {
      padding: "6px 12px 16px",
      gap: "18px"
    },
    "& .duration-inputs": {
      gap: "10px"
    },
    "& .duration-inputs label": {
      gap: "6px"
    },
    "& .schedule-pane": {
      padding: "4px 2px 12px"
    },
    "& .schedule-card": {
      borderRadius: "12px"
    },
    "& .schedule-field": {
      display: "flex",
      gridTemplateColumns: "none",
      columnGap: "normal",
      alignItems: "stretch",
      flexDirection: "column",
      gap: 0,
      minWidth: 0,
      width: "100%"
    },
    "& .schedule-field > .field-label": {
      marginBottom: "8px"
    },
    "& .schedule-field > .field-help, & .schedule-field > .default-transport": {
      gridColumn: "auto"
    },
    "& .schedule-time-picker": {
      gridColumn: "auto",
      width: "100%",
      minWidth: 0
    },
    "& .schedule-time-picker > div": {
      display: "flex",
      gridTemplateColumns: "none",
      columnGap: "normal",
      alignItems: "stretch",
      flexDirection: "column",
      gap: 0,
      width: "100%",
      minWidth: 0
    },
    "& .schedule-time-picker .picker-label": {
      marginBottom: "8px",
      gridColumn: "auto",
      whiteSpace: "nowrap"
    },
    "& .schedule-time-picker .picker-trigger": {
      gridColumn: "auto",
      width: "100%",
      minWidth: 0,
      whiteSpace: "nowrap"
    },
    "& .field-help": {
      fontSize: "var(--secondary-size)",
      lineHeight: "inherit"
    },
    "& .selection-pane .place-image": {
      flexBasis: "76px",
      width: "76px",
      height: "84px"
    },
    "& .schedule-card .schedule-card-trigger": {
      gap: "8px",
      padding: "10px",
      gridTemplateColumns: "minmax(0, 1fr) 20px"
    },
    "& .schedule-card-trigger .schedule-card-info": {
      gridColumn: "1",
      gridRow: "1"
    },
    "& .schedule-card-trigger .accordion-chevron": {
      gridColumn: "2",
      gridRow: "1"
    },
    "& .schedule-card-trigger .schedule-card-info strong": {
      whiteSpace: "normal",
      overflowWrap: "anywhere"
    },
    "& .schedule-card-trigger .schedule-place-meta": {
      alignItems: "flex-start"
    },
    "& .schedule-card-trigger .schedule-address": {
      lineHeight: 1.5,
      alignItems: "flex-start"
    },
    "& .duration-inputs, & .transport-select": {
      width: "100%",
      minWidth: 0
    },
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    minWidth: 0,
    maxWidth: "100vw",
    margin: 0,
    boxSizing: "border-box",
    flexShrink: 0
  }
});
