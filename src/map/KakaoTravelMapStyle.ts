import styled from "@emotion/styled";

export const MapCanvas = styled.div({
  position: "absolute",
  inset: 0,
  height: "100%",
  width: "100%",
  backgroundColor: "#EAF3EF",
});

export const Status = styled.div({
  position: "absolute",
  zIndex: 8,
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  backgroundColor: "#F2F8F5",
  color: "#0A414B",
  fontSize: 16,
  lineHeight: 1.6,
  textAlign: "center",
});

export const SearchArea = styled.div({
  position: "absolute",
  top: 64,
  left: 12,
  zIndex: 9,
  width: "min(360px, calc(100% - 24px))",
  backgroundColor: "#FFFEFA",
  border: "1px solid #DCE5E6",
  borderRadius: 12,
  padding: 8,
  boxShadow: "0 3px 16px #0002",

  "@media (max-width: 767px)": {
    top: 58,
    left: 8,
  },
});

export const SearchForm = styled.form({
  display: "flex",
  gap: 6,
});

export const SearchInput = styled.input({
  width: 0,
  flex: 1,
  height: 40,
  border: "1px solid #DCE5E6",
  borderRadius: 8,
  padding: "0 10px",
  fontSize: 15,
  color: "#0A414B",
  background: "#FFF",
});

export const SearchButton = styled.button({
  border: 0,
  borderRadius: 8,
  padding: "0 13px",
  backgroundColor: "#0A414B",
  color: "#FFF",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",

  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

export const ResultList = styled.div({
  maxHeight: 230,
  overflowY: "auto",
  marginTop: 6,
  borderTop: "1px solid #DCE5E6",
});

export const ResultButton = styled.button({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "9px 5px",
  border: 0,
  backgroundColor: "transparent",
  cursor: "pointer",
  textAlign: "left",
  gap: 3,

  ":hover": {
    backgroundColor: "#EAF7F5",
  },

  strong: {
    fontSize: 15,
    color: "#0A414B",
  },

  span: {
    fontSize: 15,
    color: "#778D90",
  },
});

export const Help = styled.p({
  margin: "8px 3px 2px",
  color: "#778D90",
  fontSize: 15,
});
