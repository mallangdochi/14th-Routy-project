import styled from "@emotion/styled";

const teal = "#0A414B";
const paper = "#FFFEFA";

export const ModalDialog = styled.dialog({
  position: "fixed",
  width: "min(420px, calc(100vw - 32px))",
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "calc(100dvh - 36px)",
  margin: "auto",
  padding: "22px",
  border: "none",
  borderRadius: "16px",
  boxShadow: "0 18px 55px rgba(0, 0, 0, 0.25)",
  backgroundColor: paper,
  color: teal,
  fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
  fontSize: "16px",
  overflowY: "auto",
  boxSizing: "border-box",

  "&::backdrop": {
    backgroundColor: "rgba(10, 35, 39, 0.52)",
  },

  "&, & *": {
    boxSizing: "border-box",
  },

  "@media (max-width: 767px)": {
    padding: "18px 16px",
  },
});

export const ModalTop = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "16px",
  fontSize: "21px",
  fontWeight: 800,
});

export const ModalClose = styled.button({
  display: "grid",
  placeItems: "center",
  width: "38px",
  height: "38px",
  padding: 0,
  border: "none",
  borderRadius: "50%",
  backgroundColor: "transparent",
  color: teal,
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "#E7F3F1",
  },
});

export const ModalHeader = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "6px",
  marginBottom: "16px",
  minHeight: "42px",
});

export const ModalHeading = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontSize: "20px",
  fontWeight: 800,

  "& button": {
    padding: "6px 3px",
    border: "none",
    backgroundColor: "transparent",
    color: teal,
    fontFamily: "inherit",
    fontSize: "20px",
    fontWeight: 800,
    cursor: "pointer",
  },
});

export const ModalNav = styled.button({
  display: "grid",
  placeItems: "center",
  width: "38px",
  height: "38px",
  padding: 0,
  border: "1px solid #DCE5E6",
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  color: teal,
  cursor: "pointer",

  "&:disabled": {
    opacity: 0.3,
    cursor: "not-allowed",
  },
});

export const ModalGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  gap: "4px",
});

export const ModalWeekday = styled.span({
  display: "grid",
  placeItems: "center",
  height: "34px",
  color: "#627D81",
  fontSize: "15px",
  fontWeight: 700,
});

export const ModalDay = styled.button({
  display: "grid",
  placeItems: "center",
  width: "100%",
  aspectRatio: "1 / 1",
  minHeight: "34px",
  padding: 0,
  border: "none",
  borderRadius: "8px",
  backgroundColor: "transparent",
  color: teal,
  fontFamily: "inherit",
  fontSize: "16px",
  cursor: "pointer",

  "&:hover:not(:disabled)": {
    backgroundColor: "#E6F3F1",
  },

  "&[data-selected='true']": {
    backgroundColor: teal,
    color: "#FFFFFF",
    fontWeight: 800,
  },

  "&:disabled": {
    color: "#B7C6C8",
    cursor: "not-allowed",
  },
});

export const ModalOptions = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "10px",
});

export const ModalOption = styled.button({
  minHeight: "48px",
  padding: "5px",
  border: "1px solid #DCE5E6",
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  color: teal,
  fontFamily: "inherit",
  fontSize: "16px",
  cursor: "pointer",

  "&[data-selected='true']": {
    backgroundColor: teal,
    color: "#FFFFFF",
  },

  "&:hover:not(:disabled)": {
    borderColor: teal,
  },

  "&:disabled": {
    opacity: 0.35,
    cursor: "not-allowed",
  },
});

export const ModalFooter = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "16px",
  paddingTop: "12px",
  borderTop: "1px solid #E5EDEC",

  "& button": {
    padding: "6px",
    border: "none",
    backgroundColor: "transparent",
    color: teal,
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
  },

  "& span": {
    color: "#778D90",
    fontSize: "15px",
  },
});
