import styled from "@emotion/styled";
import { modalAnimation } from "../../../styles/animation";
const colors = {
  owner: ["#FFF2DD", "#9B601D"],
  editor: ["#E2F4EF", "#0D5357"],
  viewer: ["#F0E7FF", "#8345D8"],
};
export const Overlay = styled.div({
  position: "fixed",
  inset: 0,
  zIndex: 2000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  background: "rgba(13,62,65,.35)",
  '&[data-open="false"]': { pointerEvents: "none" },
  "@media(max-width:767px)": { padding: 0, alignItems: "flex-end" },
});
export const Panel = styled.div(modalAnimation, {
  boxSizing: "border-box",
  width: "100%",
  maxWidth: 580,
  maxHeight: "calc(100dvh - 48px)",
  display: "flex",
  flexDirection: "column",
  padding: "28px 30px 24px",
  overflow: "hidden",
  borderRadius: 22,
  background: "#FFF",
  color: "#0D3E41",
  boxShadow: "0 18px 60px rgba(13,62,65,.15)",
  fontFamily: "inherit",
  fontSize: 16,
  "& > *": { flexShrink: 0 },
  "& button": {
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "background-color 160ms ease",
    boxSizing: "border-box",
  },
  "& button:disabled": { opacity: 0.45, cursor: "not-allowed" },
  "& button:focus-visible, & [tabindex]:focus-visible": {
    outline: "2px solid #527F79",
    outlineOffset: 2,
  },
  "@media(min-width:768px) and (max-width:1023px)": {
    maxWidth: 480,
    padding: "24px",
    fontSize: 15,
  },
  "@media(max-width:767px)": {
    maxWidth: "none",
    maxHeight: "calc(100dvh - 24px)",
    borderRadius: "24px 24px 0 0",
    padding: "12px 20px calc(20px + env(safe-area-inset-bottom))",
    fontSize: 14,
  },
});
export const Handle = styled.div({
  display: "none",
  "@media(max-width:767px)": {
    display: "block",
    width: 40,
    height: 4,
    margin: "0 auto 18px",
    borderRadius: 4,
    background: "#D8E3DF",
  },
});
export const Header = styled.header({
  display: "flex",
  alignItems: "center",
  gap: 10,
  "& h2": { margin: 0, fontSize: 25, lineHeight: 1.4 },
  "@media(max-width:1023px)": { "& h2": { fontSize: 22 } },
  "@media(max-width:767px)": { "& h2": { fontSize: 20 } },
});
export const IconButton = styled.button({
  border: 0,
  background: "transparent",
  color: "#0D5357",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  padding: 6,
  borderRadius: 8,
  flexShrink: 0,
  "@media(hover:hover)": {
    "&:hover:not(:disabled)": { background: "#EDF5F2" },
  },
});
export const CloseButton = styled(IconButton)({ marginLeft: "auto" });
export const Description = styled.p({
  margin: "8px 0 22px",
  color: "#718596",
  lineHeight: 1.6,
  "@media(max-width:767px)": { marginBottom: 18 },
});
export const Tools = styled.div({
  borderTop: "1px solid #E2E6E9",
  paddingTop: 16,
  paddingBottom: 10,
});
export const SectionHeading = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  marginBottom: 10,
  "& > strong": { fontSize: 18 },
  "@media(max-width:767px)": { "& > strong": { fontSize: 16 } },
});
export const Capacity = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 2,
  color: "#0D5357",
  fontSize: 14,
  fontWeight: 600,
  whiteSpace: "nowrap",
  "@media(max-width:360px)": { fontSize: 13 },
});
export const Counter = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "6px 10px",
  background: "#F0F4F7",
  borderRadius: 8,
  fontSize: 14,
  "& > span": { marginRight: "auto", color: "#718596" },
  "& strong": { minWidth: 30, textAlign: "center" },
});
export const StepButton = styled(IconButton)({
  width: 30,
  height: 30,
  background: "#FFF",
  border: "1px solid #DFE7EB",
  borderRadius: 6,
});
export const Small = styled.p({
  margin: "7px 0 0",
  color: "#718596",
  fontSize: 14,
  lineHeight: 1.5,
  "@media(max-width: 767px)": { display: "none" },
});
const grid = {
  display: "grid",
  gridTemplateColumns: "minmax(90px,1fr) 140px 76px",
  columnGap: 12,
  alignItems: "center",
  "@media(max-width:1023px)": {
    gridTemplateColumns: "minmax(80px,1fr) 112px 70px",
    columnGap: 8,
  },
  "@media(max-width:767px)": {
    gridTemplateColumns: "minmax(64px,1fr) 98px 66px",
    columnGap: 6,
  },
} as const;
export const Columns = styled.div(grid, {
  color: "#718596",
  padding: "8px 14px 8px 0",
  fontSize: 14,
});
export const MemberList = styled.div({
  flex: "0 1 auto",
  flexShrink: 1,
  minHeight: 0,
  maxHeight: "min(360px, 42dvh)",
  overflowY: "auto",
  overscrollBehavior: "contain",
  scrollbarGutter: "stable",
  scrollbarWidth: "thin",
  scrollbarColor: "#AABBC3 #F0F4F7",
  paddingRight: 6,
  "&::-webkit-scrollbar": { width: 6 },
  "&::-webkit-scrollbar-thumb": { background: "#AABBC3", borderRadius: 6 },
  "@media(max-width:767px)": { maxHeight: "min(360px, 43dvh)" },
});
export const MemberRow = styled.div(grid, {
  minHeight: 68,
  borderTop: "1px solid #EDF0F2",
  "@media(max-width:767px)": { minHeight: 60 },
});
export const Identity = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
  fontWeight: 600,
  "& img": {
    width: 40,
    height: 40,
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  "& > span:last-child": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "@media(max-width:767px)": { gap: 8, "& img": { width: 32, height: 32 } },
});
export const Avatar = styled.span({
  width: 40,
  height: 40,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
  borderRadius: "50%",
  background: "#EDF5F2",
  color: "#527F79",
  "@media(max-width:767px)": { width: 32, height: 32 },
});
export const Tag = styled.span<{ $role: keyof typeof colors }>(({ $role }) => ({
  display: "inline-flex",
  alignItems: "center",
  width: "max-content",
  flexShrink: 0,
  padding: "6px 10px",
  borderRadius: 7,
  background: colors[$role][0],
  color: colors[$role][1],
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1.4,
  whiteSpace: "nowrap",
  "@media(max-width:767px)": { padding: "5px 8px" },
}));
export const TagButton = styled.button<{ $role: keyof typeof colors }>({
  display: "inline-flex",
  width: "max-content",
  maxWidth: "100%",
  minHeight: 40,
  alignItems: "center",
  padding: 0,
  border: 0,
  borderRadius: 7,
  background: "transparent",
});
export const RoleControl = styled.div({ position: "relative", minWidth: 0 });
// Native popover top layer keeps the menu outside the scrolling list's clipping boundary.
export const RoleMenu = styled.div({
  position: "fixed",
  inset: "auto",
  margin: 0,
  zIndex: 5,
  width: 154,
  boxSizing: "border-box",
  padding: 8,
  border: "1px solid #E2E6E9",
  borderRadius: 10,
  background: "#FFF",
  color: "#0D5357",
  boxShadow: "0 6px 22px rgba(13,62,65,.14)",
  "@media(max-width:767px)": { width: 144 },
});
export const MenuCaption = styled.div({
  padding: "2px 6px 7px",
  color: "#718596",
  fontSize: 14,
});
// 선택 상태는 체크로만 표시합니다. 태그 배경은 글자 너비로 유지합니다.
export const RoleOption = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  width: "100%",
  minHeight: 40,
  padding: "3px 4px",
  border: 0,
  borderRadius: 6,
  background: "#FFF",
  color: "#0D5357",
});
export const Remove = styled.button({
  border: 0,
  padding: "8px 0",
  minHeight: 40,
  color: "#D44332",
  background: "transparent",
  fontSize: 14,
  whiteSpace: "nowrap",
  "@media(hover:hover)": {
    "&:hover:not(:disabled)": { textDecoration: "underline" },
  },
});
export const Dash = styled.span({ textAlign: "center", color: "#718596" });
export const Empty = styled.p({
  padding: "24px 0",
  margin: 0,
  color: "#718596",
  textAlign: "center",
});
export const Bottom = styled.div({
  borderTop: "1px solid #E2E6E9",
  paddingTop: 14,
});
export const Note = styled.div({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  color: "#718596",
  fontSize: 14,
  lineHeight: 1.5,
  marginBottom: 16,
  "& svg": { flexShrink: 0, marginTop: 1 },
});
export const Footer = styled.footer({
  display: "flex",
  gap: 12,
  marginTop: 14,
});
export const CancelButton = styled.button({
  flex: 1,
  minWidth: 0,
  minHeight: 50,
  padding: "12px",
  border: 0,
  borderRadius: 10,
  fontSize: 16,
  fontWeight: 600,
  color: "#0D5357",
  background: "#EDF5F2",
  "@media(hover:hover)": {
    "&:hover:not(:disabled)": { background: "#DDEDE6" },
  },
});
export const SaveButton = styled(CancelButton)({
  color: "#FFF",
  background: "#005358",
  "@media(hover:hover)": {
    "&:hover:not(:disabled)": { background: "#004448" },
  },
});
export const DangerButton = styled(SaveButton)({
  background: "#D44332",
  "@media(hover:hover)": {
    "&:hover:not(:disabled)": { background: "#BA3527" },
  },
});
export const LeaveButton = styled.button({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
  width: "100%",
  minHeight: 48,
  border: "1px solid #D44332",
  borderRadius: 10,
  background: "#FFF",
  color: "#D44332",
  fontSize: 14,
});
export const Status = styled.p({
  margin: "0 0 12px",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#C54848",
  overflowWrap: "anywhere",
});
export const Confirm = styled.div({
  "& h2": {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "8px 0 24px",
    fontSize: 22,
  },
  "& h2 svg": { color: "#D44332", flexShrink: 0 },
  "& p": { color: "#718596", lineHeight: 1.7 },
  "@media(max-width:767px)": { "& h2": { fontSize: 20 } },
});
