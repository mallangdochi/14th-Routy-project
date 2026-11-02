import styled from "@emotion/styled";
import { dropdownAnimation } from "../../styles/animation";

export const DropdownStyle = styled.div({
  position: "relative",
  flexShrink: 0,

  "& .sort-trigger": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // gap: "10px",
    padding: "8px",
    borderRadius: "8px",
    color: "#40596c",
    fontSize: "16px",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },

  "& .dropdown-trigger-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  "& .sort-trigger svg": {
    marginLeft: 10,
    width: "16px",
    height: "16px",
    flexShrink: 0,
  },

  "& .sort-trigger svg.lucide-chevron-down": {
    transform: "rotate(0deg)",
    transformOrigin: "center",
    transition: "transform 240ms ease",
  },

  '& .sort-trigger[aria-expanded="true"] svg.lucide-chevron-down': {
    transform: "rotate(180deg)",
  },

  "& button:focus-visible": {
    outline: "2px solid #005358",
    outlineOffset: "-2px",
  },

  "@media (max-width: 1023px)": {
    fontSize: "var(--page-font-size, 15px)",

    "& .sort-trigger": {
      fontSize: "inherit",
    },
  },

  "@media (max-width: 1440px)": {
    "& .sort-trigger": { fontSize: 15 },
  },
  "@media (max-width: 767px)": {
    fontSize: "var(--page-font-size, 14px)",
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& .sort-trigger svg.lucide-chevron-down": {
      transition: "none",
    },
  },
});

export const DropdownPositioner = styled.div({
  position: "fixed",
  zIndex: 1000,
  width: "max-content",
  minWidth: "min(170px, calc(100vw - 24px))",
  maxWidth: "calc(100vw - 24px)",

  "& .sort-dropdown": {
    ...dropdownAnimation,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
    maxHeight: "var(--dropdown-max-height, calc(100dvh - 24px))",
    overflowY: "auto",
    overscrollBehavior: "contain",
    padding: "8px",
    border: "1px solid #e5e9ed",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 6px 18px rgba(20, 45, 55, 0.12)",
  },

  "& .sort-dropdown button": {
    flexShrink: 0,
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    color: "#20394e",
    fontSize: "inherit",
    textAlign: "left",
    whiteSpace: "normal",
    overflowWrap: "anywhere",
  },

  "& .sort-dropdown button.is-selected": {
    backgroundColor: "#eaf7f4",
    color: "#005358",
    fontWeight: 700,
  },

  "& button:focus-visible": {
    outline: "2px solid #005358",
    outlineOffset: "-2px",
  },

  "@media (hover: hover) and (pointer: fine)": {
    "& .sort-dropdown button:hover": {
      backgroundColor: "#eaf7f4",
      color: "#005358",
    },
  },
});
