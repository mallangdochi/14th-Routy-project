import styled from "@emotion/styled";

const teal = "#0A414B";
const border = "#DCE5E6";

export const Root = styled.section({
  position: "absolute",
  zIndex: 30,
  top: 12,
  left: 12,
  width: "min(372px, calc(100% - 24px))",
  maxHeight: "min(64vh, 480px)",
  display: "flex",
  flexDirection: "column",
  gap: 9,
  padding: 12,
  color: teal,
  borderRadius: 12,
  border: `1px solid ${border}`,
  background: "#FFFEFA",
  boxShadow: "0 5px 20px rgba(0,0,0,.13)",
  "@media (max-width: 600px)": {
    top: 8,
    left: 8,
    width: "calc(100% - 16px)",
    padding: 9,
    gap: 7,
    maxHeight: "min(52vh, 365px)",
  },
});

export const Form = styled.form({ display: "flex", gap: 7, minWidth: 0 });
export const Input = styled.input({
  flex: 1,
  minWidth: 0,
  minHeight: 40,
  border: `1px solid ${border}`,
  borderRadius: 9,
  padding: "0 10px",
  color: teal,
  background: "white",
  fontSize: 15,
});
export const Button = styled.button({
  minHeight: 40,
  padding: "0 12px",
  border: 0,
  borderRadius: 9,
  background: teal,
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  flexShrink: 0,
  "&:disabled": { opacity: 0.55, cursor: "not-allowed" },
  "&:focus-visible": { outline: "3px solid #D3B16A", outlineOffset: 2 },
});
export const NearbyRow = styled.div({ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" });
export const NearbyButton = styled(Button)<{ $active?: boolean }>(({ $active }) => ({
  minHeight: 36,
  padding: "0 8px",
  color: teal,
  background: $active ? "#BCE8E1" : "#E8F3F1",
  fontWeight: $active ? 700 : 500,
}));
export const Status = styled.p<{ $error?: boolean }>(({ $error }) => ({
  margin: 0,
  fontSize: 15,
  lineHeight: 1.5,
  color: $error ? "#B54444" : "#526D70",
}));
export const ResultList = styled.div({
  minHeight: 0,
  overflowY: "auto",
  borderTop: `1px solid ${border}`,
  paddingTop: 3,
});
export const ResultItem = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 0",
  borderBottom: "1px solid #EDF2F2",
});
export const PlaceButton = styled.button({
  textAlign: "left",
  flex: 1,
  minWidth: 0,
  padding: 0,
  background: "none",
  color: teal,
  border: 0,
  cursor: "pointer",
  fontSize: 15,
  "& strong": { display: "block", fontSize: 15, lineHeight: 1.45 },
  "& span": { display: "block", fontSize: 15, color: "#778D90", lineHeight: 1.4 },
});
