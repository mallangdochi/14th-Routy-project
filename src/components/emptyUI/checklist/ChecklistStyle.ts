import styled from "@emotion/styled";

export const ChecklistLayout = styled.div({
  "--checklist-title-size": "24px",
  "--checklist-body-size": "18px",
  "--checklist-small-size": "16px",
  width: "100%",
  minWidth: 0,
  padding: "20px",
  border: "1px solid #E8EDF2",
  borderRadius: "16px",
  backgroundColor: "#FFFFFF",
  color: "#142047",
  fontFamily: "Pretendard, sans-serif",
  fontSize: "var(--checklist-body-size)",
  "&, & *": { boxSizing: "border-box" },
  "& h2, & h3, & p": { margin: 0 },
  "& button, & input": { fontFamily: "inherit", fontSize: "inherit" },
  "& button": { cursor: "pointer" },
  "& button:disabled": { cursor: "not-allowed", opacity: 0.5 },
  "& button:focus-visible, & input:focus-visible": {
    outline: "3px solid #76A69D", outlineOffset: "3px",
  },
  "& .checklist-header": {
    display: "flex", alignItems: "center", justifyContent: "flex-start",
    gap: "12px", marginBottom: "20px", minWidth: 0,
  },
  "& .checklist-header h2": {
    fontSize: "var(--checklist-title-size)", fontWeight: 800,
    lineHeight: 1.4, letterSpacing: "-0.04em", wordBreak: "keep-all",
  },
  "& .checklist-actions": { display: "flex", flexShrink: 0 },
  "& .add-button": {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: "8px", minHeight: "44px", padding: "10px 18px",
    border: "1px solid #075457", borderRadius: "8px",
    backgroundColor: "#075457", color: "#FFFFFF",
    fontSize: "var(--checklist-small-size)", fontWeight: 650, whiteSpace: "nowrap",
    "& svg": { flexShrink: 0 },
    "&:hover": { backgroundColor: "#064548" },
  },
  "& .checklist-body": {
    display: "grid", gridTemplateColumns: "minmax(0, 2.3fr) minmax(250px, 1fr)",
    alignItems: "stretch", gap: "20px", minWidth: 0,
  },
  "@media (min-width: 768px) and (max-width: 1023px)": {
    "--checklist-title-size": "22px", "--checklist-body-size": "17px",
    "--checklist-small-size": "15px", padding: "16px",
    "& .checklist-body": { gridTemplateColumns: "minmax(0, 1fr) 230px", gap: "12px" },
  },
  "@media (max-width: 767px)": {
    "--checklist-title-size": "20px", "--checklist-body-size": "16px",
    "--checklist-small-size": "14px", padding: "12px", borderRadius: "12px",
    "& .checklist-header": { gap: "8px", marginBottom: "12px" },
    "& .checklist-header h2": { fontSize: "clamp(16px, 4.5vw, 20px)" },
    "& .add-button": { padding: "8px 10px", gap: "4px" },
    "& .checklist-body": { gridTemplateColumns: "minmax(0, 1fr)", gap: "12px" },
  },
});

export const ChecklistPanel = styled.section({
  display: "flex", flexDirection: "column", minWidth: 0, minHeight: "480px",
  padding: "28px 24px", border: "1px solid #E8EDF2", borderRadius: "14px",
  backgroundColor: "#FFFFFF",
  "& .checklist-empty": {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", flex: "1 1 auto", padding: "24px 0", textAlign: "center",
  },
  "& .empty-mascot": {
    display: "block", width: "250px", maxWidth: "80%", height: "250px",
    objectFit: "contain", marginBottom: "20px",
  },
  "& .checklist-empty h3": {
    fontSize: "var(--checklist-title-size)", fontWeight: 800, lineHeight: 1.5,
    letterSpacing: "-0.04em", wordBreak: "keep-all", overflowWrap: "break-word",
  },
  "& .checklist-empty p": {
    marginTop: "14px", color: "#7380A0", fontSize: "var(--checklist-body-size)",
    lineHeight: 1.7, wordBreak: "keep-all", overflowWrap: "break-word",
  },
  "& .checklist-add-form": {
    display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px",
    "& input": {
      flex: "1 1 180px", minWidth: 0, minHeight: "44px", padding: "10px 12px",
      border: "1px solid #DCE4E1", borderRadius: "8px", color: "#233D40",
      backgroundColor: "#FFFFFF", "&::placeholder": { color: "#7A8586" },
    },
    "& button": {
      minHeight: "44px", padding: "8px 14px", border: "1px solid #075457",
      borderRadius: "8px", color: "#FFFFFF", backgroundColor: "#075457",
    },
    "& .cancel-button": { borderColor: "#DCE4E1", color: "#40595B", backgroundColor: "#FFFFFF" },
  },
  "& .checklist-items": {
    display: "flex", flexDirection: "column", gap: "10px", margin: 0, padding: 0, listStyle: "none",
    "& li": {
      display: "flex", alignItems: "center", gap: "10px", minWidth: 0,
      padding: "14px", border: "1px solid #E6ECE8", borderRadius: "8px",
    },
    "& label": {
      display: "flex", alignItems: "center", gap: "12px", width: "100%", minWidth: 0, cursor: "pointer",
    },
    '& input[type="checkbox"]': {
      flexShrink: 0, width: "20px", height: "20px", margin: 0, accentColor: "#075457", cursor: "pointer",
    },
    "& label span": {
      display: "block", minWidth: 0, lineHeight: 1.5, overflow: "hidden",
      whiteSpace: "nowrap", textOverflow: "ellipsis",
    },
    "& .is-checked span": { color: "#7D8985", textDecoration: "line-through" },
  },
  "& .item-edit-input": {
    flex: "1 1 0", width: "100%", minWidth: 0, minHeight: "44px", padding: "8px 10px",
    border: "1px solid #DCE4E1", borderRadius: "6px", color: "#233D40", backgroundColor: "#FFFFFF",
  },
  "& .delete-button": {
    display: "grid", flexShrink: 0, placeItems: "center", width: "44px", height: "44px",
    padding: 0, border: 0, borderRadius: "6px", color: "#A64E4E", backgroundColor: "#FFF4F2",
    "&:hover": { backgroundColor: "#FFE9E5" },
  },
  "@media (min-width: 768px) and (max-width: 1023px)": {
    minHeight: "440px", padding: "24px 16px",
    "& .empty-mascot": { width: "210px", height: "210px" },
  },
  "@media (max-width: 767px)": {
    minHeight: "340px", padding: "20px 12px",
    "& .empty-mascot": { width: "180px", height: "180px", marginBottom: "16px" },
    "& .checklist-empty": { padding: "8px 0" },
    "& .checklist-empty p": { marginTop: "10px", fontSize: "var(--checklist-small-size)" },
  },
});

export const StatusPanel = styled.aside({
  minWidth: 0, padding: "24px 20px", border: "1px solid #E8EDF2",
  borderRadius: "14px", backgroundColor: "#FFFFFF",
  "& h2": { fontSize: "var(--checklist-title-size)", fontWeight: 800, lineHeight: 1.4 },
  "& .status-numbers": { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginTop: "24px" },
  "& .status-count": {
    display: "flex", alignItems: "baseline", gap: "8px", fontSize: "var(--checklist-small-size)",
    "& strong": { fontSize: "40px", fontWeight: 800, lineHeight: 1.2, color: "#075457" },
  },
  "& .status-percent": { fontSize: "var(--checklist-small-size)" },
  "& .status-progress": {
    display: "block", appearance: "none", width: "100%", height: "10px", marginTop: "14px",
    border: 0, borderRadius: "999px", overflow: "hidden", backgroundColor: "#F0F2F4",
    "&::-webkit-progress-bar": { backgroundColor: "#F0F2F4", borderRadius: "999px" },
    "&::-webkit-progress-value": { backgroundColor: "#00B7A4", borderRadius: "999px" },
    "&::-moz-progress-bar": { backgroundColor: "#00B7A4", borderRadius: "999px" },
  },
  "& .status-guide": {
    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px",
    marginTop: "28px", padding: "24px 20px", border: "1px solid #B6DAD4",
    borderRadius: "14px", backgroundColor: "#EDF8F4", textAlign: "left",
    wordBreak: "keep-all", overflowWrap: "break-word",
    "& svg": { width: "36px", height: "36px", flexShrink: 0, color: "#0E6665", strokeWidth: 1.8 },
    "& strong": { fontSize: "var(--checklist-body-size)", fontWeight: 750, lineHeight: 1.5, color: "#0E6665" },
    "& p": { color: "#7380A0", fontSize: "var(--checklist-small-size)", lineHeight: 1.7 },
    "& p span": { display: "block" },
  },
  "@media (min-width: 768px) and (max-width: 1023px)": {
    padding: "20px 16px", "& .status-guide": { padding: "20px 14px" },
    "& .status-count strong": { fontSize: "34px" },
  },
  "@media (max-width: 767px)": {
    order: -1, padding: "12px 14px",
    display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: "6px 12px",
    "& h2": { fontSize: "var(--checklist-small-size)", gridColumn: 1, gridRow: 1 },
    "& .status-numbers": { display: "contents" },
    "& .status-count": { gridColumn: 1, gridRow: 2, gap: "4px", "& strong": { fontSize: "24px" } },
    "& .status-percent": { gridColumn: 2, gridRow: 1, textAlign: "right" },
    "& .status-progress": { gridColumn: 2, gridRow: 2, alignSelf: "center", height: "8px", marginTop: 0 },
    "& .status-guide": { display: "none" },
  },
});
