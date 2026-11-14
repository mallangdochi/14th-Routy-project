import styled from "@emotion/styled";

export const MapCanvas = styled.div({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
});

export const Status = styled.div({
  position: "absolute",
  top: 16,
  left: 16,
  right: 16,
  zIndex: 10,
  padding: "12px 16px",
  borderRadius: 10,
  backgroundColor: "#FFFFFF",
  color: "#0D3E41",
  fontSize: 14,
  lineHeight: 1.5,
  boxShadow: "0 2px 12px rgba(13, 62, 65, 0.12)",
});

export const SearchArea = styled.div({
  position: "absolute",
  left: 16,
  right: 16,
  bottom: 16,
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: 12,
  border: "1px solid #E2E6E9",
  borderRadius: 12,
  backgroundColor: "#FFFFFF",
  color: "#0D3E41",
  boxShadow: "0 2px 12px rgba(13, 62, 65, 0.12)",
  "@media (max-width: 767px)": {
    left: 12,
    right: 12,
    bottom: 12,
  },
});

export const SearchForm = styled.form({
  display: "flex",
  alignItems: "stretch",
  gap: 8,
  minWidth: 0,
});

export const SearchInput = styled.input({
  flex: "1 1 0",
  minWidth: 0,
  minHeight: 44,
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "1px solid #E2E6E9",
  borderRadius: 8,
  backgroundColor: "#FFFFFF",
  color: "#0D3E41",
  font: "inherit",
  fontSize: 14,
  "&::placeholder": { color: "#718596" },
  "&:focus-visible": {
    outline: "2px solid #527F79",
    outlineOffset: 2,
  },
});

export const SearchButton = styled.button({
  flexShrink: 0,
  minHeight: 44,
  padding: "10px 16px",
  border: 0,
  borderRadius: 8,
  backgroundColor: "#0D5357",
  color: "#FFFFFF",
  font: "inherit",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  "&:disabled": { opacity: 0.5, cursor: "default" },
  "&:focus-visible": {
    outline: "2px solid #527F79",
    outlineOffset: 2,
  },
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover:not(:disabled)": { backgroundColor: "#0D3E41" },
  },
});

export const Help = styled.p({
  margin: 0,
  padding: "4px 0",
  color: "#596D75",
  fontSize: 14,
  lineHeight: 1.5,
});

export const ResultList = styled.div({
  display: "flex",
  flexDirection: "column",
  maxHeight: 220,
  overflowY: "auto",
  overscrollBehavior: "contain",
});

export const ResultButton = styled.button({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 5,
  width: "100%",
  padding: "12px 8px",
  border: 0,
  borderBottom: "1px solid #E2E6E9",
  backgroundColor: "#FFFFFF",
  color: "#0D3E41",
  font: "inherit",
  fontSize: 14,
  lineHeight: 1.5,
  textAlign: "left",
  overflowWrap: "anywhere",
  cursor: "pointer",
  "&:last-child": { borderBottom: 0 },
  "& strong": { fontWeight: 700 },
  "& span": { color: "#596D75" },
  "&:focus-visible": {
    outline: "2px solid #527F79",
    outlineOffset: -2,
  },
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { backgroundColor: "#F0F8F6" },
  },
});
