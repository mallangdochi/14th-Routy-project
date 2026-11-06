import styled from "@emotion/styled";

const COLORS = {
  ink: "#0D3E41",
  navy: "#0C293D",
  muted: "#718596",
  outline: "#DCE6E9",
  primary: "#0D5357",
  primaryHover: "#0B4549",
  mint: "#E9FFF7",
  cream: "#FEFBF5",
} as const;

export const Page = styled.main({
  minHeight: "100dvh",
  backgroundColor: COLORS.cream,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 18px",
  color: COLORS.ink,
  "@media (max-width: 767px)": {
    alignItems: "flex-start",
    padding: "20px 12px 36px",
  },
});

export const Container = styled.div({
  width: "100%",
  maxWidth: "470px",
  minWidth: 0,
});

export const BrandBar = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "9px",
  marginBottom: "20px",
});

export const BrandMark = styled.span({
  display: "grid",
  placeItems: "center",
  width: "31px",
  height: "31px",
  borderRadius: "10px",
  backgroundColor: COLORS.primary,
  color: "#FFFFFF",
  fontSize: "19px",
  fontWeight: 800,
});

export const BrandName = styled.span({
  color: COLORS.primary,
  fontSize: "18px",
  fontWeight: 800,
  letterSpacing: "-0.7px",
});

export const BrandDivider = styled.span({
  width: "1px",
  height: "15px",
  backgroundColor: "#CAD9D5",
  margin: "0 2px",
});

export const BrandDescription = styled.span({
  color: COLORS.muted,
  fontSize: "11px",
});

export const Card = styled.article({
  overflow: "hidden",
  borderRadius: "16px",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2E9E6",
  boxShadow: "0 14px 40px rgba(13, 62, 65, 0.08)",
  "@media (max-width: 767px)": { borderRadius: "13px" },
});

export const Banner = styled.header({
  position: "relative",
  display: "flex",
  alignItems: "center",
  minHeight: "173px",
  padding: "25px 27px",
  background: "linear-gradient(110deg, #E9FFF7 0%, #F5FFFB 58%, #D5F8EA 100%)",
  overflow: "hidden",
  "@media (max-width: 767px)": {
    minHeight: "155px",
    padding: "23px 19px",
  },
});

export const BannerContent = styled.div({
  position: "relative",
  zIndex: 1,
  maxWidth: "72%",
  h1: {
    margin: "8px 0 9px",
    color: "#082B3D",
    fontSize: "23px",
    fontWeight: 800,
    letterSpacing: "-1px",
    lineHeight: 1.3,
    wordBreak: "keep-all",
  },
  p: {
    margin: 0,
    color: "#637889",
    fontSize: "13px",
    lineHeight: 1.55,
    wordBreak: "keep-all",
  },
  "@media (max-width: 767px)": {
    maxWidth: "74%",
    h1: { fontSize: "20px" },
    p: { fontSize: "12px" },
  },
});

export const BannerEyebrow = styled.span({
  fontSize: "9px",
  fontWeight: 800,
  color: "#438879",
  letterSpacing: "1px",
});

export const BannerMascot = styled.img({
  position: "absolute",
  bottom: "0",
  right: "5px",
  width: "163px",
  height: "153px",
  objectFit: "contain",
  objectPosition: "center bottom",
  pointerEvents: "none",
  "@media (max-width: 767px)": {
    width: "116px",
    height: "120px",
    right: "0",
  },
});

export const CardBody = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "21px",
  padding: "23px 25px 19px",
  "@media (max-width: 767px)": { padding: "19px 17px 16px", gap: "19px" },
});

export const TripSummary = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
  backgroundColor: "#F5F9F7",
  borderRadius: "11px",
  padding: "14px",
  "@media (max-width: 767px)": { gap: "9px", padding: "11px" },
});

export const SummaryIcon = styled.span({
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  width: "41px",
  height: "41px",
  borderRadius: "11px",
  color: COLORS.primary,
  backgroundColor: "#E0EEE8",
  "@media (max-width: 767px)": { width: "35px", height: "35px" },
});

export const TripSummaryText = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  flex: 1,
  minWidth: 0,
});

export const TripSummaryLabel = styled.span({
  color: COLORS.muted,
  fontSize: "10px",
  fontWeight: 600,
});

export const TripName = styled.strong({
  fontWeight: 800,
  fontSize: "15px",
  color: COLORS.navy,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  "@media (max-width: 767px)": { fontSize: "14px" },
});

export const PermissionLine = styled.span({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "11px",
  color: "#70888B",
  "@media (max-width: 767px)": { fontSize: "10px" },
});

export const PermissionPill = styled.span<{ $editor: boolean }>(({ $editor }) => ({
  flexShrink: 0,
  padding: "6px 8px",
  fontSize: "10px",
  borderRadius: "6px",
  fontWeight: 800,
  color: $editor ? "#87612C" : "#16765E",
  backgroundColor: $editor ? "#FBF1E2" : "#E1F3E9",
}));

export const StepContent = styled.section({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: "10px 8px 4px",
});

export const StepIcon = styled.span({
  display: "grid",
  placeItems: "center",
  width: "60px",
  height: "60px",
  borderRadius: "20px",
  marginBottom: "15px",
  color: COLORS.primary,
  backgroundColor: "#E9F8F1",
});

export const StepTitle = styled.h2({
  margin: 0,
  color: COLORS.navy,
  fontSize: "19px",
  lineHeight: 1.4,
  letterSpacing: "-0.6px",
  fontWeight: 800,
  textAlign: "center",
  "@media (max-width: 767px)": { fontSize: "17px" },
});

export const StepDescription = styled.p({
  margin: "9px 0 19px",
  color: COLORS.muted,
  fontSize: "12px",
  textAlign: "center",
  lineHeight: 1.8,
  wordBreak: "keep-all",
  maxWidth: "330px",
});

export const RequestForm = styled.form({
  display: "flex",
  flexDirection: "column",
  gap: "11px",
  width: "100%",
  maxWidth: "370px",
  margin: "0 auto",
});

export const FormTitle = styled.h2({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  margin: 0,
  fontSize: "15px",
  color: COLORS.navy,
  fontWeight: 800,
  "@media (max-width: 767px)": { fontSize: "14px" },
});

export const FormDescription = styled.p({
  margin: "-2px 0 5px",
  color: COLORS.muted,
  fontSize: "11px",
  lineHeight: 1.65,
});

export const FieldGroup = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const FieldLabel = styled.label({
  color: COLORS.navy,
  fontSize: "12px",
  fontWeight: 700,
});

export const TextInput = styled.input({
  height: "45px",
  width: "100%",
  minWidth: 0,
  padding: "0 12px",
  border: `1px solid ${COLORS.outline}`,
  borderRadius: "8px",
  outline: "none",
  backgroundColor: "#FFFFFF",
  color: COLORS.ink,
  fontSize: "13px",
  "&::placeholder": { color: "#95A2AC" },
  "&:focus-visible": { borderColor: "#527F79", boxShadow: "0 0 0 2px #527F7926" },
  "&[aria-invalid='true']": { borderColor: "#D76B5D" },
  "&:disabled": { opacity: 0.65, cursor: "not-allowed" },
});

export const PasswordField = styled.div({
  display: "flex",
  alignItems: "center",
  border: `1px solid ${COLORS.outline}`,
  borderRadius: "8px",
  overflow: "hidden",
  "&:focus-within": { borderColor: "#527F79", boxShadow: "0 0 0 2px #527F7926" },
  "& > input": {
    flex: 1,
    border: "none",
    boxShadow: "none",
    "&:focus-visible": { border: "none", boxShadow: "none" },
  },
});

export const VisibilityButton = styled.button({
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  width: "42px",
  height: "43px",
  border: "none",
  background: "#FFFFFF",
  color: "#4C7178",
  "&:hover": { backgroundColor: "#F2F8F6" },
  "&:focus-visible": { outline: "2px solid #527F79", outlineOffset: "-3px" },
});

export const PrimaryButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "9px",
  width: "100%",
  minHeight: "46px",
  padding: "10px 12px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: COLORS.primary,
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 800,
  "&:hover:not(:disabled)": { backgroundColor: COLORS.primaryHover },
  "&:disabled": { cursor: "not-allowed", opacity: 0.48 },
  "&:focus-visible": { outline: "2px solid #527F79", outlineOffset: "3px" },
  "& .spin": { animation: "routy-invite-spin 0.9s linear infinite" },
  "@keyframes routy-invite-spin": { to: { transform: "rotate(360deg)" } },
});

export const SecondaryButton = styled.button({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  minHeight: "43px",
  padding: "10px 12px",
  border: "1px solid #C9DDD6",
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  color: COLORS.primary,
  fontSize: "12px",
  fontWeight: 800,
  "&:hover:not(:disabled)": { backgroundColor: "#F4FAF7" },
  "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
  "& .spin": { animation: "routy-invite-spin 0.9s linear infinite" },
  "@keyframes routy-invite-spin": { to: { transform: "rotate(360deg)" } },
});

export const SubtleInfo = styled.p({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  margin: "1px 0 0",
  color: "#85989A",
  fontSize: "10px",
  lineHeight: 1.6,
});

export const StatusContent = styled.section({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "11px 8px 7px",
});

export const StatusIcon = styled.span<{
  $tone: "success" | "pending" | "danger";
}>(({ $tone }) => ({
  display: "grid",
  placeItems: "center",
  width: "65px",
  height: "65px",
  marginBottom: "18px",
  borderRadius: "20px",
  color:
    $tone === "success"
      ? "#138264"
      : $tone === "pending"
        ? "#B37A26"
        : "#C35A4F",
  backgroundColor:
    $tone === "success"
      ? "#E7F6EC"
      : $tone === "pending"
        ? "#FBF2E4"
        : "#FFF0EC",
}));

export const PendingInfo = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  padding: "12px",
  marginBottom: "13px",
  borderRadius: "8px",
  color: "#946820",
  backgroundColor: "#FBF5EA",
  fontSize: "12px",
  fontWeight: 800,
});

export const ErrorMessage = styled.p({
  display: "flex",
  alignItems: "flex-start",
  gap: "7px",
  margin: 0,
  padding: "10px 11px",
  borderRadius: "8px",
  color: "#BA5147",
  backgroundColor: "#FFF3F0",
  fontSize: "11px",
  lineHeight: 1.6,
  "& svg": { flexShrink: 0, marginTop: "1px" },
});

export const CardFooter = styled.footer({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "9px",
  paddingTop: "14px",
  borderTop: "1px solid #EDF0EF",
});

export const BackButton = styled.button({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  padding: "4px 0",
  border: "none",
  background: "transparent",
  color: "#5D7C7F",
  fontSize: "11px",
  fontWeight: 700,
});

export const FooterNotice = styled.span({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  marginLeft: "auto",
  color: "#81949D",
  fontSize: "10px",
});

export const PageFootnote = styled.p({
  margin: "14px 0 0",
  textAlign: "center",
  color: "#83969C",
  fontSize: "11px",
});
