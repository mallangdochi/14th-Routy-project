import styled from "@emotion/styled";
import { dropdownAnimation } from "../../styles/animation";

export const DropdownStyle = styled.div({
  position: "relative",
  flexShrink: 0,

  "& .sort-trigger": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    padding: "8px",
    borderRadius: "8px",
    color: "#40596c",
    fontSize: "var(--page-font-size, 16px)",
    whiteSpace: "nowrap",
  },

  "& .sort-trigger svg": {
    width: "16px",
    height: "16px",
    flexShrink: 0,
  },

  "& .sort-trigger svg.is-open": {
    transform: "rotate(180deg)",
  },

  "& .sort-dropdown": {
    ...dropdownAnimation,

    position: "absolute",
    top: "100%",
    right: 0,
    zIndex: 30,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: "170px",
    marginTop: "6px",
    padding: "8px",
    border: "1px solid #e5e9ed",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 6px 18px rgba(20, 45, 55, 0.12)",

    '&[data-initial="true"]': {
      animation: "none",
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
    },
  },

  "& .sort-dropdown button": {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    color: "#20394e",
    fontSize: "var(--page-font-size, 16px)",
    textAlign: "left",
    whiteSpace: "nowrap",
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
  "@media (max-width: 1023px)": {
    fontSize: "var(--page-font-size, 15px)",
    "& .sort-trigger, & .sort-dropdown button": { fontSize: "inherit" },
  },
  "@media (max-width: 767px)": {
    fontSize: "var(--page-font-size, 14px)",
    "& .sort-dropdown": {
      left: 0,
      right: "auto",
    },
  },
});
