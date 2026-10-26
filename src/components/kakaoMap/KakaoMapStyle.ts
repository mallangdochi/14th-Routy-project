import styled from "@emotion/styled";

export const MapRoot = styled.div({
  position: "absolute",
  zIndex: 0,
  inset: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "#eaf4f1",
});
export const Message = styled.div({
  position: "absolute",
  inset: 0,
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  padding: 24,
  textAlign: "center",
  backgroundColor: "#f0f8f6",
  color: "#005259",
  fontSize: 14,
  lineHeight: 1.6,
  strong: { fontSize: 16 },
});
export const Note = styled.p({
  position: "absolute",
  bottom: 10,
  left: 10,
  zIndex: 4,
  margin: 0,
  padding: "5px 9px",
  borderRadius: 7,
  backgroundColor: "rgba(255,255,255,0.94)",
  color: "#334a50",
  fontSize: 11,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  pointerEvents: "none",
});
