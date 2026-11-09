import styled from "@emotion/styled";
import { menuAnimation } from "../../styles/animation";

export const Container = styled.section({
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  color: "#0D3E41",
  padding: "32px clamp(24px, 3vw, 56px) 40px",
  maxWidth: 1680,
  marginInline: "auto",
  "@media (max-width: 1023px)": { padding: "28px 24px 32px" },
  "@media (max-width: 767px)": { padding: "20px 16px 28px" },
});

export const BadgeNum = styled.span<{
  $placement: "sidebar" | "header";
  $compact: boolean;
}>(({ $placement, $compact }) => ({
  position: "absolute",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: $placement === "header" ? 18 : 21,
  height: $placement === "header" ? 18 : 21,
  paddingInline: 5,
  borderRadius: 999,
  backgroundColor: "#0D3E41",
  color: "#FFFFFF",
  fontSize: 11,
  fontWeight: 700,
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  ...($placement === "header"
    ? { top: -7, right: -9, boxShadow: "0 0 0 2px #FFFFFF" }
    : $compact
      ? { top: 2, right: 3 }
      : { top: "50%", right: 14, transform: "translateY(-50%)" }),
}));

export const BreadcrumbRow = styled.div({
  marginBottom: 24,
  "@media (max-width: 767px)": { display: "none" },
});
export const Title = styled.h1({
  fontSize: 36,
  fontWeight: 700,
  letterSpacing: "-0.04em",
  marginBottom: 16,
  "@media (max-width: 1023px)": { fontSize: 30, marginBottom: 12 },
  "@media (max-width: 767px)": { fontSize: 24, marginBottom: 8 },
});
export const TabBar = styled.div({
  borderBottom: "1px solid #E2E6E9",
  flexShrink: 0,
});
export const TabTrack = styled.div({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  width: 560,
  maxWidth: "100%",
  "@media (max-width: 767px)": { width: "100%" },
});
export const Tab = styled.button({
  ...menuAnimation.button,
  minHeight: 52,
  padding: "12px 14px",
  fontSize: 17,
  color: "#718596",
  fontWeight: 500,
  whiteSpace: "nowrap",
  '&[aria-selected="true"]': { color: "#0D3E41", fontWeight: 700 },
  "&:focus-visible": {
    outline: "2px solid #527F79",
    outlineOffset: -4,
    borderRadius: 6,
  },
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { color: "#0D3E41" },
  },
  "@media (max-width: 767px)": {
    minHeight: 48,
    fontSize: 13,
    padding: "10px 4px",
  },
});
export const Indicator = styled.span({
  ...menuAnimation.indicator,
  position: "absolute",
  bottom: -1,
  left: 0,
  width: "calc(100% / 4)",
  height: 3,
  borderRadius: "3px 3px 0 0",
  backgroundColor: "#00565B",
  pointerEvents: "none",
});
export const Panel = styled.div({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 360,
  outline: "none",
});
export const Count = styled.p({
  margin: 0,
  fontSize: 16,
  color: "#596D75",
  strong: { fontWeight: 700, color: "#0D3E41" },
  "@media (max-width: 767px)": { fontSize: 13 },
});
export const List = styled.ul({ display: "grid", gap: 12, listStyle: "none", padding: 0, margin: 0 });
export const Card = styled.div({
  position: "relative",
  touchAction: "pan-y",
  willChange: "transform",
  transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
  '&[data-dragging="true"]': { transition: "none" },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
  "@media (hover: hover) and (pointer: fine)": {
    '&[data-deletable="true"]': { paddingRight: 72 },
  },
  display: "grid",
  gridTemplateColumns: "48px minmax(0, 1fr) auto",
  columnGap: 18,
  rowGap: 6,
  padding: "20px 22px",
  border: "1px solid #E2E6E9",
  borderRadius: 14,
  backgroundColor: "#FFFFFF",
  "@media (max-width: 1023px)": { padding: "18px 20px", columnGap: 14 },
  "@media (max-width: 767px)": {
    padding: 16,
    gridTemplateColumns: "40px minmax(0, 1fr) auto",
    columnGap: 12,
  },
});
export const Avatar = styled.div({
  gridColumn: 1,
  gridRow: "1 / span 4",
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  backgroundColor: "#EAF6F2",
  color: "#527F79",
  overflow: "hidden",
  img: { width: "100%", height: "100%", objectFit: "cover" },
  "@media (max-width: 767px)": { width: 40, height: 40 },
});
export const Name = styled.h2({
  gridColumn: 2,
  gridRow: 1,
  fontSize: 19,
  fontWeight: 700,
  overflowWrap: "anywhere",
  "@media (max-width: 767px)": { fontSize: 17 },
});
export const Time = styled.time({
  gridColumn: 3,
  gridRow: 1,
  fontSize: 13,
  color: "#718596",
  whiteSpace: "nowrap",
  paddingTop: 3,
  "@media (max-width: 767px)": { fontSize: 12 },
});
export const TripLine = styled.div({
  gridColumn: "2 / -1",
  display: "flex",
  alignItems: "center",
  gap: "6px 12px",
  flexWrap: "wrap",
  strong: { fontSize: 16, fontWeight: 600, overflowWrap: "anywhere" },
  "@media (max-width: 767px)": {
    alignItems: "flex-start",
    flexDirection: "column",
    gap: 6,
    strong: { fontSize: 14 },
  },
});
export const Badge = styled.span({
  display: "inline-flex",
  alignItems: "center",
  padding: "3px 10px",
  borderRadius: 20,
  backgroundColor: "#E6F5EF",
  color: "#0D6359",
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
  '&[data-tone="rejected"]': { backgroundColor: "#EEF0F2", color: "#596D75" },
});
export const Detail = styled.div({
  gridColumn: "2 / -1",
  color: "#596D75",
  fontSize: 14,
  paddingTop: 2,
  p: { overflowWrap: "anywhere" },
  "@media (max-width: 767px)": { fontSize: 13 },
});
export const Verified = styled.p({
  display: "flex",
  gap: 6,
  alignItems: "center",
  marginBottom: 5,
  color: "#718596",
  fontSize: 13,
  svg: { flexShrink: 0 },
});
export const Actions = styled.div({
  gridColumn: "2 / -1",
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 6,
  "@media (max-width: 767px)": {
    gridColumn: "1 / -1",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    marginTop: 10,
  },
});
export const ActionButton = styled.button({
  minWidth: 88,
  minHeight: 42,
  padding: "8px 20px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  border: "1px solid #D5DEE1",
  color: "#EB654B",
  backgroundColor: "#FFFFFF",
  '&[data-primary="true"]': {
    color: "#FFFFFF",
    backgroundColor: "#00565B",
    borderColor: "#00565B",
  },
  "&:disabled": { opacity: 0.5 },
  "&:focus-visible": { outline: "2px solid #527F79", outlineOffset: 3 },
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover:not(:disabled)": { backgroundColor: "#FFF4F0" },
    '&[data-primary="true"]:hover:not(:disabled)': {
      backgroundColor: "#0D3E41",
    },
  },
});
export const Feedback = styled.p({
  padding: "12px 16px",
  marginTop: 16,
  borderRadius: 8,
  backgroundColor: "#FFF0EB",
  color: "#A43E2C",
  fontSize: 14,
});
export const Empty = styled.div({
  flex: 1,
  minHeight: 360,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "36px 12px 52px",
  img: { width: 168, height: 168, objectFit: "contain", marginBottom: 22 },
  h2: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    marginBottom: 12,
    overflowWrap: "anywhere",
  },
  p: { fontSize: 16, color: "#718596", whiteSpace: "pre-line" },
  "@media (max-width: 767px)": {
    minHeight: 350,
    padding: "28px 0 40px",
    img: { width: 140, height: 140, marginBottom: 20 },
    h2: { fontSize: 20 },
    p: { fontSize: 14 },
  },
});
export const Status = styled.div({
  flex: 1,
  minHeight: 320,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  color: "#596D75",
  textAlign: "center",
  padding: 24,
});

export const SwipeRow = styled.li({
  position: "relative",
  overflow: "hidden",
  borderRadius: 14,
  "& > button": {
    visibility: "hidden",
    opacity: 0,
    pointerEvents: "none",
  },

  '&[data-open="true"] > button': {
    visibility: "visible",
    opacity: 1,
    pointerEvents: "auto",
  },

  // 스와이프하는 동안에도 삭제 버튼 표시
  '&:has(> [data-dragging="true"]) > button': {
    visibility: "visible",
    opacity: 1,
    pointerEvents: "auto",
  },
  '&[data-deletable="true"]': {
    backgroundColor: "#FFFFFF",
  },
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover [data-desktop-delete], &:focus-within [data-desktop-delete]": {
      opacity: 1,
      pointerEvents: "auto",
    },
  },
});
export const SwipeDelete = styled.button({
  position: "absolute",
  inset: "0 0 0 auto",
  width: 76,
  color: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  fontSize: 12,
  backgroundColor: "#EB654B",
  "&:focus-visible": { outline: "2px solid #0D3E41", outlineOffset: -5 },
});
export const DesktopDelete = styled.button({
  position: "absolute",
  right: 16,
  top: "50%",
  transform: "translateY(-50%)",
  width: 40,
  height: 40,
  borderRadius: "50%",
  color: "#EB654B",
  backgroundColor: "#FFF2ED",
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  "&:focus-visible": { outline: "2px solid #527F79", outlineOffset: 2 },
  "@media (hover: hover) and (pointer: fine)": {
    display: "flex",
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 160ms ease",
    "&:hover": { backgroundColor: "#FFE4DA" },
    "&:focus-visible": { opacity: 1, pointerEvents: "auto" },
  },
});
export const ToastLayer = styled.div({
  position: "sticky",
  bottom: 20,
  zIndex: 50,
  height: 0,
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  pointerEvents: "none",
  "@media (max-width: 767px)": { bottom: 12 },
});
export const Toast = styled.div({
  position: "absolute",
  bottom: 0,
  display: "flex",
  alignItems: "center",
  gap: 14,
  width: "max-content",
  maxWidth: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  backgroundColor: "#FFFFFF",
  color: "#0D3E41",
  border: "1px solid #DDE8E5",
  boxShadow: "0 8px 30px rgba(13, 62, 65, 0.14)",
  pointerEvents: "auto",
  "@media (max-width: 767px)": { width: "100%", gap: 8, padding: "12px 10px" },
});
export const ToastMessage = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 8,
  flex: 1,
  minWidth: 0,
  fontSize: 14,
  svg: { flexShrink: 0 },
  span: { overflowWrap: "anywhere" },
  "@media (max-width: 767px)": { fontSize: 13, gap: 6 },
});
export const UndoButton = styled.button({
  color: "#0D3E41",
  fontWeight: 700,
  whiteSpace: "nowrap",
  fontSize: 13,
  minHeight: 36,
  padding: "6px 10px",
  border: "1px solid #C5D7D2",
  borderRadius: 6,
  "&:focus-visible": { outline: "2px solid #527F79", outlineOffset: 2 },
});
export const ToastClose = styled.button({
  display: "grid",
  placeItems: "center",
  width: 32,
  height: 36,
  flexShrink: 0,
  color: "#0D3E41",
  "&:focus-visible": { outline: "2px solid #527F79", outlineOffset: 2 },
});

export const Toolbar = styled.div({ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, margin: "20px 0", "@media (max-width: 767px)": { margin: "14px 0" } });
export const StatusFilter = styled.div({
  position: "relative", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  padding: 3, borderRadius: 12, backgroundColor: "#EEF0F2", border: "1px solid #E2E6E9", flexShrink: 0,
});
export const StatusIndicator = styled.span({
  ...menuAnimation.indicator,
  position: "absolute", top: 3, bottom: 3, left: 3, width: "calc((100% - 6px) / 3)",
  borderRadius: 9, backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px #0D3E4120", pointerEvents: "none",
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
});
export const StatusOption = styled.button({
  ...menuAnimation.button,
  position: "relative", minHeight: 38, padding: "6px 18px", color: "#718596", fontSize: 14,
  fontWeight: 600, borderRadius: 9, whiteSpace: "nowrap", backgroundColor: "transparent",
  '&[aria-pressed="true"]': { color: "#0D3E41" },
  "&:focus-visible": { outline: "2px solid #527F79", outlineOffset: 1 },
  "@media (max-width: 767px)": { fontSize: 12, padding: "6px 10px", minHeight: 38 },
});
export const EventIcon = styled(Avatar)({ color: "#00565B", backgroundColor: "#E0F6EE", '&[data-start="true"]': { color: "#EB654B", backgroundColor: "#FFE9E2" } });
export const UnreadDot = styled.span({ display: "inline-block", width: 7, height: 7, borderRadius: "50%", backgroundColor: "#EB654B", marginLeft: 8, verticalAlign: "middle" });
export const ChangeSummary = styled.div({ gridColumn: "2 / -1", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 16px", padding: "10px 12px", marginTop: 6, borderRadius: 9, backgroundColor: "#EAF6F2", color: "#0D3E41", fontSize: 14, overflowWrap: "anywhere", "& span": { display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }, "& svg": { flexShrink: 0 }, "@media (max-width: 767px)": { fontSize: 12, padding: "8px 10px" } });
export const EventActions = styled(Actions)({ "@media (max-width: 767px)": { gridTemplateColumns: "minmax(0, 1fr)" } });
