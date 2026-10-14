import styled from "@emotion/styled";

const green = "#005044";
const navy = "#09184d";
const muted = "#60769e";
const border = "#d6e3fa";

export const SupportContent = styled.div({
  width: "100%",
});

export const QuickCardGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 16,

  "@media (max-width: 1040px)": {
    gap: 12,
  },

  "@media (max-width: 740px)": {
    gridTemplateColumns: "1fr",
  },
});

export const QuickCard = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 0,
  minHeight: 226,
  padding: "24px 16px",
  border: `2px solid ${border}`,
  borderRadius: 13,
  backgroundColor: "#ffffff",
  textAlign: "center",
  transition:
    "border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease",

  "&:hover": {
    borderColor: "#93c8bf",
    backgroundColor: "#f2faf7",
    boxShadow: "0 5px 20px rgba(0, 80, 68, 0.06)",
  },

  "&:active": {
    backgroundColor: "#edf8f5",
  },

  "@media (max-width: 1040px)": {
    minHeight: 200,
    padding: "20px 12px",
  },

  "@media (max-width: 740px)": {
    minHeight: 164,
  },
});

export const QuickCardIcon = styled.span({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: green,
  marginBottom: 17,
});

export const QuickCardTitle = styled.span({
  display: "block",
  color: navy,
  fontSize: 27,
  fontWeight: 800,
  lineHeight: 1.35,
  letterSpacing: "-0.03em",

  "@media (max-width: 1040px)": {
    fontSize: 23,
  },
});

export const QuickCardDescription = styled.span({
  display: "block",
  marginTop: 10,
  color: muted,
  fontSize: 18,
  fontWeight: 500,
  lineHeight: 1.5,
  wordBreak: "keep-all",

  "@media (max-width: 1040px)": {
    fontSize: 15,
  },
});

export const FaqSection = styled.section({
  marginTop: 43,

  "@media (max-width: 760px)": {
    marginTop: 32,
  },
});

export const FaqHeading = styled.h2({
  marginBottom: 16,
  color: navy,
  fontSize: 29,
  fontWeight: 800,
  letterSpacing: "-0.035em",

  "@media (max-width: 760px)": {
    fontSize: 23,
  },
});

export const FaqList = styled.div({
  overflow: "hidden",
  border: `2px solid ${border}`,
  borderRadius: 14,
  backgroundColor: "#ffffff",
});

export const FaqItem = styled.div({
  "& + &": {
    borderTop: "1px solid #dce5f1",
  },
});

export const FaqQuestionButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 20,
  width: "100%",
  minHeight: 77,
  padding: "17px 28px",
  color: navy,
  backgroundColor: "transparent",
  fontSize: 21,
  fontWeight: 700,
  textAlign: "left",
  lineHeight: 1.5,
  wordBreak: "keep-all",
  transition: "background-color 160ms ease",

  "&:hover": {
    backgroundColor: "#f8fafc",
  },

  "&:focus-visible": {
    outline: `2px solid ${green}`,
    outlineOffset: -4,
  },

  "@media (max-width: 760px)": {
    minHeight: 68,
    padding: "16px 18px",
    fontSize: 16,
  },
});

export const FaqChevron = styled.span<{
  $expanded: boolean;
}>(({ $expanded }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  color: "#536d9d",
  transform: $expanded ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 180ms ease",
}));

export const FaqAnswer = styled.div({
  margin: "0 28px",
  padding: "20px 0 25px",
  borderTop: "1px solid #e0e8f2",
  backgroundColor: "transparent",
  color: muted,
  fontSize: 18,
  lineHeight: 1.65,
  wordBreak: "keep-all",

  "@media (max-width: 760px)": {
    margin: "0 18px",
    padding: "17px 0 20px",
    fontSize: 15,
  },
});
