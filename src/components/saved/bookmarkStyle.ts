import styled from "@emotion/styled";

export const BookmarkButton = styled.button({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  width: "44px",
  height: "44px",
  padding: "10px",
  border: 0,
  borderRadius: "8px",

  background: "transparent",
  color: "#0D3E41",
  cursor: "pointer",

  transition: "color 180ms ease, opacity 180ms ease",

  "& svg": {
    display: "block",
    flexShrink: 0,
  },

  "&:disabled": {
    cursor: "default",
    opacity: 0.5,
  },

  "&:focus-visible": {
    outline: "2px solid #527F79",
    outlineOffset: "2px",
  },

  "@media (hover: hover)": {
    "&:not(:disabled):hover": {
      color: "#527F79",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
});

export const ErrorMessage = styled.span({
  display: "block",
  marginTop: "4px",
  color: "#B93828",
  fontSize: "14px",
  lineHeight: 1.5,
  overflowWrap: "anywhere",
});
