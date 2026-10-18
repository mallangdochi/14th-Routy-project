import styled from "@emotion/styled";

const green = "#005044";
const navy = "#09184d";
const muted = "#60769e";
const border = "#d6e3fa";
const greenSoft = "#edf8f5";

const media = {
  mobile: "@media (max-width: 760px)",
  tablet: "@media (min-width: 761px) and (max-width: 1199px)",
  sectionTablet: "@media (min-width: 761px) and (max-width: 920px)",
  wideTablet: "@media (max-width: 1040px)",
} as const;

const centeredFlex = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

export const SupportContent = styled.div({
  width: "100%",
});

export const QuickCardGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 16,

  [media.wideTablet]: {
    gap: 12,
  },

  [media.sectionTablet]: {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },

  [media.mobile]: {
    gridTemplateColumns: "1fr",
    gap: 10,
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
    backgroundColor: greenSoft,
  },

  [media.wideTablet]: {
    minHeight: 200,
    padding: "20px 12px",
  },

  [media.mobile]: {
    display: "grid",
    gridTemplateColumns: "48px minmax(0, 1fr)",
    gridTemplateRows: "auto auto",
    columnGap: 14,
    rowGap: 2,
    justifyContent: "stretch",
    minHeight: 88,
    padding: "16px 18px",
    textAlign: "left",
    borderWidth: 1,
  },
  [media.tablet]: {
    minHeight: 166,
    padding: "16px 12px",
  },
});

export const QuickCardIcon = styled.span({
  ...centeredFlex,
  color: green,
  marginBottom: 17,
  [media.mobile]: {
    gridColumn: 1,
    gridRow: "1 / span 2",
    alignSelf: "center",
    marginBottom: 0,
    "& svg": { width: 38, height: 38 },
  },
  [media.tablet]: {
    marginBottom: 10,
    "& svg": { width: 44, height: 44 },
  },
});

export const QuickCardTitle = styled.span({
  display: "block",
  color: navy,
  fontSize: 28,
  fontWeight: 800,
  lineHeight: 1.35,
  letterSpacing: "-0.03em",

  [media.wideTablet]: {
    fontSize: 23,
  },
  [media.mobile]: {
    gridColumn: 2,
    gridRow: 1,
    fontSize: 18,
    textAlign: "left",
  },
  [media.tablet]: {
    fontSize: 20,
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

  [media.wideTablet]: {
    fontSize: 15,
  },
  [media.mobile]: {
    gridColumn: 2,
    gridRow: 2,
    marginTop: 0,
    fontSize: 12,
    textAlign: "left",
  },
  [media.tablet]: {
    fontSize: 13,
    marginTop: 5,
  },
});

export const FaqSection = styled.section({
  marginTop: 43,

  [media.mobile]: {
    marginTop: 26,
  },
  [media.tablet]: {
    marginTop: 28,
  },
});

export const FaqHeading = styled.h2({
  marginBottom: 16,
  color: navy,
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: "-0.035em",

  [media.mobile]: {
    fontSize: 20,
    marginBottom: 12,
  },
  [media.tablet]: {
    fontSize: 22,
    marginBottom: 10,
  },
});

export const FaqList = styled.div({
  overflow: "hidden",
  border: `2px solid ${border}`,
  borderRadius: 14,
  backgroundColor: "#ffffff",
  [media.mobile]: {
    borderWidth: 1,
    borderRadius: 10,
  },
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

  [media.mobile]: {
    minHeight: 58,
    padding: "13px 14px",
    fontSize: 15,
    gap: 10,
  },
  [media.tablet]: {
    minHeight: 60,
    fontSize: 16,
    padding: "12px 19px",
  },
});

export const FaqChevron = styled.span<{
  $expanded: boolean;
}>(({ $expanded }) => ({
  ...centeredFlex,
  flexShrink: 0,
  color: "#536d9d",
  transform: $expanded ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 180ms ease",
  [media.mobile]: {
    "& svg": { width: 19, height: 19 },
  },
}));

export const FaqAnswerWrapper = styled.div<{ $expanded: boolean }>(
  ({ $expanded }) => ({
    display: "grid",
    gridTemplateRows: $expanded ? "1fr" : "0fr",
    opacity: $expanded ? 1 : 0,
    transition:
      "grid-template-rows 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease",
  }),
);

export const FaqAnswerClip = styled.div({
  minHeight: 0,
  overflow: "hidden",
});

export const FaqAnswer = styled.div({
  margin: "0 28px",
  padding: "20px 0 25px",
  borderTop: "1px solid #e0e8f2",
  backgroundColor: "transparent",
  color: muted,
  fontSize: 18,
  lineHeight: 1.65,
  wordBreak: "keep-all",

  [media.mobile]: {
    margin: "0 14px",
    padding: "12px 0 16px",
    fontSize: 14,
  },
  [media.tablet]: {
    fontSize: 14,
    padding: "14px 0 18px",
    margin: "0 19px",
  },
});
