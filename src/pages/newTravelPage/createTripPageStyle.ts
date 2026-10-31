import styled from "@emotion/styled";
import { dropdownAnimation, dropdownSlideDown } from "../../styles/animation";

const focusRing = {
  outline: "3px solid #77BDB2",
  outlineOffset: "3px",
};

export const CreateTripPageStyle = styled.div({
  "--page-font-size": "18px",
  "--color-primary": "#075653",
  "--color-text": "#34445F",
  "--color-muted": "#788BA1",
  "--color-border": "#DAE3EC",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "100%",
  minHeight: "100vh",
  alignSelf: "stretch",
  backgroundColor: "#FEFBF5",
  color: "var(--color-text)",
  fontSize: "var(--page-font-size)",
  padding: "48px 40px",
  gap: "30px",

  "& button:disabled": {
    cursor: "default",
    opacity: 0.4,
  },

  "& button:focus-visible, & input:focus-visible, & select:focus-visible, & a:focus-visible":
    focusRing,

  "& .routy-brand-bar": {
    display: "flex",
    alignItems: "center",

    "& a": {
      display: "inline-flex",
      width: "112px",
    },
  },

  "& .routy-trip-main": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  "& .trip-panel": {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
    alignItems: "stretch",
    columnGap: "36px",
    rowGap: 0,
    width: "100%",
    maxWidth: "1200px",
    padding: "32px",
    border: "1px solid #EEF0F1",
    borderRadius: "20px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 5px 28px rgb(39 64 65 / 9%)",
  },

  "& .trip-form": {
    display: "contents",
    flexDirection: "column",
    flex: "1 1 0",
    minWidth: 0,
    padding: "20px 12px 4px 24px",
  },

  "& .basic-fields": {
    display: "flex",
    flexDirection: "column",
    gridColumn: 1,
    gridRow: 2,
    gap: 8,
  },
  "& .save-error": {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginTop: "16px",
    color: "#C43D32",
    fontSize: "14px",
    lineHeight: 1.5,

    "& svg": {
      flexShrink: 0,
      width: "18px",
      height: "18px",
      marginTop: "2px",
    },
  },

  "& .form-actions button:disabled": {
    opacity: 0.6,
    cursor: "wait",
  },
  "& .field": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 0",
    minWidth: 0,
    gap: "8px",
  },
  "& .trip-name-field": { paddingBottom: 29 },
  "& .field label, & .field-label": {
    fontWeight: 600,
    lineHeight: 1.4,
    fontSize: "16px",
  },

  "& .field > input": {
    width: "100%",
    minWidth: 0,
    minHeight: "44px",
    padding: "10px 14px",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    color: "var(--color-text)",
    colorScheme: "light",
  },

  "& input::placeholder": {
    color: "#637484",
  },

  "& .date-fields, & .time-fields": {
    display: "flex",
    gap: 14,
    paddingBottom: 8,
  },

  "& .date-fields > :first-child": {
    flex: "1 1 0",
    width: "auto",
    minWidth: 0,
  },

  "& .duration-field": {
    flex: "0.65 1 0",
  },

  "& .duration": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "44px",
    padding: "8px",
    border: "1px solid #DCEEEF",
    borderRadius: "8px",
    backgroundColor: "#EAF5F4",
    color: "var(--color-primary)",
    fontSize: "20px",
    fontWeight: 800,
    textAlign: "center",
  },

  "& .preference-section": {
    display: "flex",
    flexDirection: "column",
    gap: "18px",

    padding: "18px 0",
    borderTop: "1px solid var(--color-border)",
    borderBottom: "1px solid var(--color-border)",
  },

  "& .section-heading": {
    "& h2": {
      color: "var(--color-primary)",
      fontWeight: 800,
      lineHeight: 1.5,
      fontSize: "28px",

      "& span": {
        color: "var(--color-muted)",
        fontSize: "16px",
        fontWeight: 600,
      },
    },

    "& p": {
      paddingTop: "4px",
      color: "var(--color-muted)",
      lineHeight: 1.5,
      wordBreak: "keep-all",
      fontSize: "16px",
    },
  },

  "& .preference-row": {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    gap: "14px",
  },

  "& .style-row": {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 10,
  },

  "& .row-label": {
    flex: "0 0 82px",
    fontWeight: 600,
    lineHeight: 1.5,
    whiteSpace: "nowrap",
    fontSize: "16px",
  },

  "& .style-row .style-title": {
    flex: "none",
    paddingTop: 0,
  },

  "& .style-dropdown-wrapper": {
    display: "none",
  },

  "& .style-button:disabled, & .style-dropdown button[aria-disabled='true']": {
    opacity: 0.45,
    cursor: "not-allowed",

    "&:hover": {
      backgroundColor: "transparent",
    },
  },

  "& .style-info": {
    display: "flex",
    justifyContent: "center",
    gap: 15,
  },

  "& .style-desc": {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    color: "var(--color-muted)",
  },

  "& .people-control button:focus, & .people-control button:focus-visible, & .budget-input input:focus, & .budget-input input:focus-visible":
    {
      outline: "none",
      boxShadow: "none",
    },

  "& .people-control:focus-within, & .budget-input:focus-within": focusRing,

  "& .region-select-button": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    minHeight: "48px",
    padding: "12px 14px",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "var(--color-text)",
    textAlign: "left",

    "& svg": {
      width: "20px",
      height: "20px",
      flexShrink: 0,
      color: "#738595",
    },

    "& .region-name": {
      flex: 1,
      minWidth: 0,
      fontWeight: 600,
      overflowWrap: "anywhere",
    },

    "& .region-change": {
      flexShrink: 0,
      color: "#637484",
    },

    "&:hover": {
      borderColor: "#91b8b2",
      backgroundColor: "#fafcfb",
    },
  },

  "& .region-help": {
    color: "#637484",
    lineHeight: 1.5,
    fontSize: "16px",
  },

  "& .people-control": {
    display: "flex",
    alignItems: "stretch",
    minHeight: "36px",
    overflow: "hidden",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",

    "& button": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "38px",
      border: 0,
      backgroundColor: "#F5F8FA",
      color: "var(--color-muted)",

      "& svg": {
        width: "16px",
        height: "16px",
      },

      "&:hover:not(:disabled)": {
        backgroundColor: "#EAF3F0",
      },
    },

    "& output": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "76px",
      padding: "4px 12px",
      borderRight: "1px solid var(--color-border)",
      borderLeft: "1px solid var(--color-border)",
    },
  },

  "& .style-options": {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 0,
    gap: "10px",
  },

  "& .style-button": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minHeight: "38px",
    padding: "7px 14px",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    color: "var(--color-text)",
    transition:
      "background-color 180ms ease, color 180ms ease, border-color 180ms ease",

    "& svg": {
      width: "18px",
      height: "18px",
      flexShrink: 0,
      color: "#81959F",
    },

    "&:hover": {
      backgroundColor: "#F2F7F5",
    },

    '&[aria-pressed="true"]': {
      borderColor: "var(--color-primary)",
      backgroundColor: "var(--color-primary)",
      color: "#FFFFFF",

      "& svg": {
        color: "inherit",
      },

      "&:hover": {
        backgroundColor: "#064744",
      },
    },
  },

  "& .budget-content": {
    display: "flex",
    alignItems: "center",
    flex: "1 1 0",
    minWidth: 0,
    gap: "12px",
  },

  "& .budget-input": {
    display: "flex",
    alignItems: "center",
    flex: "0 1 270px",
    minWidth: 0,
    minHeight: "38px",
    overflow: "hidden",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",

    "& input": {
      flex: "1 1 0",
      width: "100%",
      minWidth: 0,
      padding: "8px 12px",
      border: 0,
      backgroundColor: "transparent",
      color: "var(--color-text)",

      textAlign: "right",
    },

    "& > span:last-child": {
      paddingRight: "12px",
      color: "var(--color-muted)",
    },
  },

  "& .budget-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    width: "42px",
    flexShrink: 0,
    borderRight: "1px solid var(--color-border)",
    backgroundColor: "#F5F8FA",
    color: "#93A4AD",

    "& svg": {
      width: "19px",
      height: "19px",
    },
  },

  "& .budget-help": {
    color: "var(--color-muted)",
    lineHeight: 1.4,
    wordBreak: "keep-all",
    fontSize: "16px",
  },

  "& .form-actions": {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    paddingTop: 20,
    "& button": {
      minHeight: "42px",
      padding: "10px 22px",
      borderRadius: "8px",
      fontWeight: 600,
      transition: "background-color 180ms ease",
    },
  },

  "& .cancel-button": {
    border: "1px solid #CCD8E4",
    backgroundColor: "#FFFFFF",
    color: "var(--color-muted)",

    "&:hover": {
      backgroundColor: "#F5F7F9",
    },
  },

  "& .submit-button": {
    minWidth: "144px",
    border: "1px solid var(--color-primary)",
    backgroundColor: "var(--color-primary)",
    color: "#FFFFFF",

    "&:hover": {
      backgroundColor: "#064744",
    },
  },

  "& .preview-column": {
    display: "flex",
    flexDirection: "column",
    flex: "0 0 37%",
    gridColumn: 2,
    gridRow: "2 / 5",
    minWidth: 0,
    gap: "12px",
  },

  "& .map-preview": {
    flex: "1 1 auto",
    height: "300px",
    overflow: "hidden",
    borderRadius: "14px",
    backgroundColor: "#E8F0EA",

    "& img": {
      objectFit: "contain",
    },
  },

  "& .summary-card": {
    padding: "18px 20px",
    border: "1px solid #EDF0F2",
    borderRadius: "14px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 3px 12px rgb(36 65 69 / 4%)",

    "& h2": {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      paddingBottom: "12px",
      color: "var(--color-primary)",
      fontWeight: 800,
      fontSize: "22px",

      "& svg": {
        width: "22px",
        height: "22px",
      },
    },
  },

  "& .summary-list": {
    "& li": {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      minHeight: "44px",
      padding: "10px 0",
      borderTop: "1px solid #EEF1F4",
      lineHeight: 1.5,

      "& > svg": {
        flexShrink: 0,
        width: "20px",
        height: "20px",
        color: "#81959F",
      },

      "& > span": {
        minWidth: 0,
        overflowWrap: "anywhere",
      },
    },
  },

  "& .separator": {
    padding: "0 8px",
    color: "var(--color-muted)",
  },

  "& .summary-time": {
    display: "flex",
    alignItems: "baseline",
    flexWrap: "wrap",
    columnGap: "12px",
    rowGap: "4px",
    minWidth: 0,
  },

  "& .summary-time-label": {
    color: "#637484",
    whiteSpace: "nowrap",
  },

  "& .summary-time-value": {
    color: "var(--color-primary)",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },

  "& .summary-dates": {
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginTop: "4px",
  },

  "& .trip-dropdown-wrapper": {
    position: "relative",
    minWidth: 0,
  },

  "& .dropdown-trigger": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    minHeight: "44px",
    padding: "10px 12px",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    color: "var(--color-text)",
    backgroundColor: "#fff",
    textAlign: "left",

    "&:focus, &:focus-visible, &[aria-expanded='true']": focusRing,

    "& > span": {
      flex: 1,
    },

    "& svg": {
      width: "20px",
      height: "20px",
      flexShrink: 0,
      color: "#80939e",
    },

    "& .dropdown-chevron": {
      transition: "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
    },

    '& .dropdown-chevron[data-open="true"]': {
      transform: "rotate(180deg)",
    },

    "& .dropdown-chevron-desktop": {
      display: "block",
    },

    "& .dropdown-chevron-compact": {
      display: "none",
    },
  },

  "& .trip-dropdown": {
    ...dropdownAnimation,

    position: "absolute",
    top: "100%",
    right: 0,
    left: 0,
    zIndex: 30,
    display: "none",
    flexDirection: "column",
    gap: "4px",
    padding: "8px",
    maxHeight: "280px",
    overflowY: "auto",
    border: "1px solid #e5e9ed",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 6px 18px rgba(20, 45, 55, 0.12)",
    pointerEvents: "none",
    transition: "display 240ms allow-discrete",
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
      border: "2px solid #FEFBF5",
      borderRadius: "8px",
    },

    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#064744",
    },

    "&::-webkit-scrollbar-button": {
      display: "none",
    },

    '&[data-open="true"]': {
      display: "flex",
      pointerEvents: "auto",
      animation: `${dropdownSlideDown} 240ms cubic-bezier(0.22, 1, 0.36, 1) both`,
    },

    "& button": {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      width: "100%",
      minHeight: "44px",
      padding: "10px 12px",
      border: 0,
      borderRadius: "8px",
      color: "#20394e",
      backgroundColor: "transparent",
      textAlign: "left",
      whiteSpace: "nowrap",

      "& svg": {
        width: "19px",
        height: "19px",
        flexShrink: 0,
      },

      "& span": {
        flex: 1,
      },

      "&:hover, &:focus-visible": {
        backgroundColor: "#f3f6f5",
      },

      "&.is-selected": {
        backgroundColor: "#eaf7f4",
        color: "#005358",
        fontWeight: 700,
      },
    },
  },

  "& [hidden]": {
    display: "none",
  },

  "& .trip-steps": {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    margin: "0 0 24px",
    padding: 0,
    scrollMarginTop: "20px",
    fontSize: "16px",

    "& li": {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "var(--color-muted)",
      fontWeight: 600,
      lineHeight: 1.5,
      minWidth: 0,
    },

    "& li + li::before": {
      content: '""',
      width: "40px",
      height: "1px",
      flexShrink: 0,
      marginRight: "6px",
      backgroundColor: "#B8C9D6",
    },

    '& li[aria-current="step"]': {
      color: "var(--color-primary)",

      "& .step-number": {
        borderColor: "var(--color-primary)",
        backgroundColor: "var(--color-primary)",
        color: "#FFFFFF",
      },
    },
  },

  "& .step-number": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "30px",
    height: "30px",
    border: "1px solid #A6B8C9",
    borderRadius: "50%",
  },

  "& .preview-trip-name": {
    color: "var(--color-primary)",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: 1.5,
    marginBottom: "12px",
    overflowWrap: "anywhere",
  },

  "& .routy-intro": {
    display: "flex",
    flexDirection: "column",
    gridColumn: "1 / -1",
    gap: "12px",
    minWidth: 0,
    flexShrink: 0,
    marginBottom: "28px",
  },

  "& .routy-intro-row": {
    display: "flex",
    alignItems: "stretch",
    gap: "20px",
    minWidth: 0,
  },

  "& .routy-intro-content": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: "1 1 0",
    gap: "24px",
    minWidth: 0,
  },

  "& .routy-intro-copy": {
    display: "flex",
    flexDirection: "column",
    gap: "12px",

    "& p": {
      color: "var(--color-muted)",
      fontSize: "22px",
      lineHeight: 1.6,
      wordBreak: "keep-all",
    },
  },

  "& .routy-intro-title, & .routy-intro-small-title": {
    color: "var(--color-primary)",
    lineHeight: 1.3,
    fontWeight: 800,
    letterSpacing: "-0.04em",
    wordBreak: "keep-all",
  },

  "& .routy-intro-title": {
    fontSize: "44px",
  },

  "& .routy-intro-small-title": {
    display: "none",
  },

  "& .routy-intro-art": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 32%",
    minWidth: 0,

    "& img": {
      objectFit: "contain",
    },
  },

  "& .routy-intro .trip-steps": {
    flexShrink: 0,
    flexWrap: "wrap",
    margin: 0,
  },

  "& button, & input, & select": {
    fontSize: "17px",
  },

  "& .row-desc, & .region-change": {
    fontSize: "16px",
  },

  "& .field-help": {
    display: "flex",
    alignItems: "flex-start",
    gap: "6px",
    //  minHeight: "24px",
    visibility: "hidden",
    color: "#637484",
    fontSize: "16px",
    lineHeight: 1.5,

    "& > svg": {
      flexShrink: 0,
      width: "16px",
      height: "16px",
      marginTop: "4px",
    },

    "&.is-error": {
      visibility: "visible",
      color: "#BD3D2C",
    },
  },

  "& .basic-fields-heading": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: 15,

    "& h2": {
      color: "var(--color-primary)",
      fontSize: "20px",
      fontWeight: 700,
    },
  },

  "& .required-guide": {
    color: "#637484",
    fontSize: "16px",
    whiteSpace: "nowrap",
  },

  "& .required-guide > span, & .required-mark": {
    color: "#BD3D2C",
  },

  "& [data-required-field] > .field-label": {
    color: "var(--color-text)",
    fontWeight: 600,
    lineHeight: 1.4,
  },

  "& .picker-control-only :is(label, span, p):empty": {
    display: "none",
  },

  "& .region-name.is-placeholder": {
    color: "#637484",
    fontWeight: 400,
  },

  "& .is-placeholder, & [data-required-field='dates'][data-empty='true'] .range-value":
    {
      color: "#637484",
    },

  "& .region-select-button > svg, & .dropdown-trigger > svg, & .range-trigger > svg, & .picker-trigger > svg":
    {
      color: "#80939E",
    },

  "& [data-required-field]": {
    "& > button[aria-invalid='true']:focus, & > input[aria-invalid='true']:focus, &[aria-invalid='true'] :is(button, input):focus":
      {
        outline: "1px solid #BD3D2C",
        outlineOffset: "1px",
        boxShadow: "0 0 0 4px rgba(189, 61, 44, 0.12)",
      },
  },
  "@media (max-width: 1023px)": {
    "--page-font-size": "17px",
    padding: "32px 24px",
    gap: 20,

    "& .trip-panel": {
      display: "flex",
      gridTemplateColumns: "none",
      gap: "14px",
      padding: "24px",
    },

    "& .trip-form": {
      display: "flex",
      minHeight: "640px",
      padding: 0,
    },

    "& .basic-fields": {
      gap: 10,
    },
    "& .basic-fields-heading": { padding: "30px 0 20px" },
    "& .field label, & .field-label, & .row-desc": {
      fontSize: "15px",
    },

    "& .field > input": {
      padding: "8px",
    },

    "& .date-fields, & .time-fields": {
      gap: "8px",
    },

    "& .duration": {
      fontSize: "17px",
    },

    "& .preference-section": {
      padding: "40px 0 0",
      borderTop: 0,
      borderBottom: 0,
      gap: "30px",
    },

    "& .section-heading h2": {
      fontSize: "22px",
    },

    "& .preference-row": {
      gap: "10px",
    },

    "& .row-label": {
      flexBasis: "72px",
      fontSize: "15px",
    },

    "& .style-options": {
      gap: "6px",
    },

    "& .style-button": {
      gap: "5px",
      padding: "7px 9px",
    },

    '& .style-button[aria-pressed="true"]': {
      color: "var(--color-primary)",
      backgroundColor: "#EAF5F4",

      "&:hover": {
        backgroundColor: "#DDEFEA",
      },
    },

    "& .budget-content": {
      flexWrap: "wrap",
      gap: "6px",
    },

    "& .preview-column": {
      display: "none",
      flexBasis: "33%",
      gridColumn: "auto",
      gridRow: "auto",
    },

    "& .map-preview, & .map-preview img": {
      minHeight: "330px",
    },

    "& .summary-card": {
      padding: "14px 12px",
    },

    "& .summary-card h2": {
      fontSize: "20px",
    },

    "& .summary-list li": {
      gap: "8px",
    },

    "& .dropdown-trigger .dropdown-chevron-desktop": {
      display: "none",
    },

    "& .dropdown-trigger .dropdown-chevron-compact": {
      display: "block",
    },

    "& .trip-dropdown": {
      top: "auto",
      bottom: "100%",
    },

    "& .preview-trip-name": {
      fontSize: "18px",
    },

    "& .form-actions": {
      paddingTop: 40,
    },

    "& .routy-intro": {
      gridColumn: "auto",
      marginBottom: 0,
    },

    "& button, & input, & select": {
      fontSize: "16px",
    },

    "& .field-help, & .required-guide": {
      fontSize: "15px",
    },
  },

  "@media (max-width: 767px)": {
    "--page-font-size": "16px",
    backgroundColor: "#fff",
    padding: "28px 20px",

    "& .preference-section": {
      gap: "24px",
      marginTop: "20px",
      paddingTop: "16px",
    },

    "& .preference-row": {
      alignItems: "center",
      gap: "16px",
    },

    "& .row-label": {
      flex: "0 0 82px",
      fontSize: "16px",
    },

    "& .people-control": {
      minHeight: "44px",

      "& button": {
        width: "46px",
      },

      "& output": {
        minWidth: "94px",
        padding: "6px 12px",
      },
    },

    "& .style-row": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "14px",
    },

    "& .style-row .style-title": {
      flex: "none",
      paddingTop: 0,
    },

    "& .style-info": {
      width: "100%",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "8px",
    },

    "& .style-desc": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "4px",
      lineHeight: 1.6,
    },

    "& .style-dropdown-wrapper": {
      display: "block",
      width: "100%",
    },

    "& .style-dropdown-wrapper .dropdown-trigger": {
      minHeight: "56px",
      padding: "14px 16px",
      borderRadius: "10px",
    },

    "& .budget-content": {
      flex: "1 1 0",
      flexDirection: "column",
      alignItems: "stretch",
      flexWrap: "nowrap",
      minWidth: 0,
      gap: "8px",
    },

    "& .budget-input": {
      flex: "none",
      width: "100%",
      minHeight: "50px",
    },

    "& .budget-icon": {
      width: "50px",
    },

    "& .budget-help": {
      fontSize: "16px",
      lineHeight: 1.5,
    },

    "& .form-actions": {
      gap: "10px",
      paddingTop: "24px",

      "& button": {
        minHeight: "56px",
        padding: "12px 20px",
        borderRadius: "10px",
        fontSize: "18px",
      },
    },

    "& .cancel-button": {
      flex: "0 0 92px",
    },

    "& .submit-button": {
      flex: "1 1 0",
      minWidth: 0,
    },

    "& .trip-panel": {
      flexDirection: "column",
      gap: "24px",
      padding: 0,
      border: 0,
      borderRadius: 0,
      backgroundColor: "transparent",
      boxShadow: "none",
    },

    "& .trip-form": {
      minHeight: "calc(100dvh - 100px)",
    },

    "& .basic-fields": {
      gap: 8,
    },

    "& .field": {
      gap: 5,
    },

    "& .field > input": {
      borderRadius: "6px",
    },

    "& .date-fields, & .time-fields": {
      flexDirection: "column",
      gap: 8,
    },

    "& .date-fields > :first-child": {
      flex: "none",
      width: "100%",
    },

    "& .duration-field": {
      display: "none",
    },

    // "& .preference-section": {
    //   gap: "16px",
    //   marginTop: "20px",
    //   paddingTop: "16px",
    // },

    "& .section-heading h2": {
      fontSize: "20px",
    },

    "& .section-heading h2 span": {
      fontSize: "14px",
    },

    "& .section-heading p, & .region-help, & .budget-help, & .region-change": {
      fontSize: "15px",
    },

    // "& .preference-row": {
    //   gap: "10px",
    // },

    // "& .row-label": {
    //   flexBasis: "68px",
    // },

    // "& .style-dropdown-wrapper": {
    //   display: "block",
    //   width: "100%",
    // },

    // "& .style-info": {
    //   width: "100%",
    //   flexDirection: "column",
    //   gap: 5,
    // },

    // "& .style-desc": {
    //   flexWrap: "wrap",
    //   gap: 0,
    // },

    "& .style-options": {
      flex: "1 1 0",
      gap: "7px",
    },

    "& .style-button": {
      minHeight: "40px",
      gap: "6px",
      padding: "8px 10px",
    },

    // "& .budget-input": {
    //   flexBasis: "100%",
    // },

    // "& .submit-button": {
    //   flex: "1 1 0",
    //   minWidth: 0,
    // },

    "& .preview-column": {
      flex: "none",
      width: "100%",
    },

    "& .map-preview, & .map-preview img": {
      minHeight: "240px",
      height: "240px",
    },

    "& .summary-card": {
      padding: "16px",
    },

    "& .summary-card h2": {
      fontSize: "18px",
    },

    "& .trip-steps": {
      fontSize: "15px",
      gap: "8px",

      "& li": {
        gap: "6px",
      },

      "& li + li::before": {
        width: "16px",
        marginRight: 0,
      },
    },

    "& .step-number": {
      width: "24px",
      height: "24px",
    },

    "& .routy-intro-row": {
      gap: "10px",
    },

    "& .routy-intro-content": {
      gap: "16px",
    },

    "& .routy-intro-copy p": {
      fontSize: "16px",
    },

    "& .routy-intro-title, & .routy-intro-small-title": {
      fontSize: "28px",
    },

    "& .routy-intro-art": {
      display: "none",
    },

    "& .field-help, & .required-guide": {
      fontSize: "14px",
    },

    "& .style-options-desktop": {
      display: "none",
    },

    "& .style-dropdown": {
      top: "auto",
      bottom: "calc(100% + 8px)",
      maxHeight: "min(280px, 50dvh)",
    },
    "&[data-step='preferences']": {
      justifyContent: "flex-start",
      padding: "30px 24px",
      gap: "44px",

      "& .routy-brand-bar a": {
        width: "140px",
      },

      "& .trip-form": {
        minHeight: 0,
      },

      "& .routy-intro": {
        gap: 0,
        marginBottom: "22px",
      },

      "& .routy-intro-row": {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 0,
      },

      "& .routy-intro-content": {
        display: "flex",
        flexDirection: "column",
        gap: "36px",
      },

      "& .routy-intro-copy": {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      },

      "& .routy-intro-small-title": {
        display: "none",
      },

      "& .routy-intro-title": {
        display: "block",
        // fontSize: "22px",
        // lineHeight: 1.5,
        // letterSpacing: "-0.04em",

        "& span": {
          color: "var(--color-muted)",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: 0,
        },
      },

      "& .routy-intro-copy p": {
        order: "initial",
        flex: "none",
        fontSize: "16px",
        lineHeight: 1.75,
      },

      "& .routy-intro .trip-steps": {
        order: "initial",
        flex: "none",
        flexWrap: "nowrap",
        gap: "8px",
        margin: 0,
        fontSize: "16px",

        "& li": {
          gap: "8px",
          whiteSpace: "nowrap",
        },

        "& li + li::before": {
          width: "20px",
          marginRight: 0,
        },
      },

      "& .step-number": {
        width: "30px",
        height: "30px",
      },

      "& .preference-section": {
        gap: "20px",
        marginTop: 0,
        padding: "20px 3px 0",
      },

      "& .preference-row": {
        gap: "16px",
      },

      "& .row-label": {
        flex: "0 0 82px",
        fontSize: "16px",
      },

      "& .people-control": {
        minWidth: 0,
        minHeight: "44px",

        "& button": {
          flex: "0 1 47px",
          width: "47px",
          minWidth: "36px",
        },

        "& output": {
          flex: "0 1 94px",
          minWidth: "60px",
          width: "94px",
          padding: "6px 10px",
        },
      },

      "& .style-row": {
        flexDirection: "column",
        alignItems: "stretch",
        gap: "14px",
      },

      "& .style-row .style-title": {
        flex: "none",
        paddingTop: 0,
      },

      "& .style-info": {
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
      },

      "& .style-desc": {
        display: "none",
      },

      "& .row-desc": {
        fontSize: "16px",
      },

      "& .style-dropdown-wrapper": {
        display: "block",
        width: "100%",
      },

      "& .style-dropdown-wrapper .dropdown-trigger": {
        minHeight: "56px",
        padding: "14px 16px",
        borderRadius: "10px",
      },

      "& .budget-content": {
        flex: "1 1 0",
        flexDirection: "column",
        alignItems: "stretch",
        flexWrap: "nowrap",
        minWidth: 0,
        gap: "8px",
      },

      "& .budget-input": {
        flex: "none",
        width: "100%",
        minHeight: "50px",
      },

      "& .budget-icon": {
        width: "50px",
      },

      "& .budget-help": {
        fontSize: "16px",
        lineHeight: 1.5,
      },

      "& .form-actions": {
        gap: "10px",
        padding: "46px 3px 0",

        "& button": {
          minHeight: "56px",
          padding: "12px 20px",
          borderRadius: "10px",
          fontSize: "18px",
        },
      },

      "& .cancel-button": {
        flex: "0 0 92px",
      },

      "& .submit-button": {
        flex: "1 1 0",
        minWidth: 0,
      },
    },
    "@media (max-width: 390px)": {
      "& .routy-intro": {
        gap: "10px",
      },

      "& .routy-intro-row": {
        flexWrap: "wrap",
        alignItems: "center",
        rowGap: "20px",
      },

      "& .routy-intro-content, & .routy-intro-copy": {
        display: "contents",
      },

      "& .routy-intro-copy p": {
        order: 0,
        flex: "1 1 0",
        minWidth: 0,
        lineHeight: 1.8,
      },

      "& .routy-intro-title": {
        display: "none",
      },

      "& .routy-intro-small-title": {
        display: "block",
      },

      "& .routy-intro .trip-steps": {
        order: 2,
        flex: "0 0 100%",
        flexWrap: "nowrap",
        alignItems: "center",
        gap: "8px",
        minWidth: 0,
        fontSize: "14px",

        "& li": {
          gap: "6px",
          whiteSpace: "nowrap",
        },

        "& li + li::before": {
          width: "16px",
          marginRight: 0,
        },
      },
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& .trip-dropdown, & button, & .dropdown-chevron": {
      transition: "none",
    },

    "& .trip-sheet[open]": {
      animationDuration: "1ms",
    },
  },
});
