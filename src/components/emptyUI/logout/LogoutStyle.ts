import styled from "@emotion/styled";

const PRIMARY = "#005259";
const TEXT = "#0C293D";
const MUTED = "#72869A";

export const Layout = styled.div({
  display: "flex",
  alignItems: "stretch",
  width: "100%",
  height: "100dvh",
  minHeight: 0,
});

export const PageWrapper = styled.main({
  display: "flex",
  flexDirection: "column",
  flex: "1 1 0",
  minWidth: 0,
  minHeight: 0,
  padding: "42px 40px 32px",
  overflowY: "auto",
  backgroundColor: "#FFFFFF",

  "@media (max-width: 1023px)": {
    padding: "32px 24px 24px",
  },

  "@media (max-width: 767px)": {
    padding: "calc(80px + env(safe-area-inset-top, 0px)) 20px 20px",
  },
});

export const PageHeader = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  flexShrink: 0,
  width: "100%",
  paddingBottom: 24,
  marginBottom: 24,
  borderBottom: "1px solid #E4EAEE",

  "@media (max-width: 1023px)": {
    paddingBottom: 20,
    marginBottom: 20,
  },

  "@media (max-width: 767px)": {
    paddingBottom: 18,
    marginBottom: 18,
  },
});

export const HeaderLoginButton = styled.button({
  minHeight: 44,
  padding: "10px 20px",
  borderRadius: 9,
  backgroundColor: PRIMARY,
  color: "#FFFFFF",
  fontSize: 17,
  fontWeight: 700,

  "@media (max-width: 1023px)": {
    fontSize: 16,
  },
});

export const EmptyBanner = styled.section({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
  alignItems: "center",
  flex: "1 0 auto",
  width: "100%",
  minWidth: 0,
  padding: "32px 26px",
  borderRadius: 20,
  // background: "linear-gradient(110deg, #F1FCFB 0%, #F0FFFC 60%, #E6FAF6 100%)",

  "@media (max-width: 1023px)": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "28px 24px",
  },

  "@media (max-width: 767px)": {
    padding: "24px 20px",
  },
});

export const BannerImageArea = styled.div({
  gridColumn: 1,
  gridRow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minWidth: 0,

  "@media (max-width: 1023px)": {
    order: 2,
    flexShrink: 0,
    margin: "20px 0",
  },

  "@media (max-width: 767px)": {
    margin: "18px 0 22px",
  },
});

export const MascotImage = styled.img({
  width: "100%",
  maxWidth: 400,
  maxHeight: "min(340px, 40dvh)",
  height: "auto",
  objectFit: "contain",
  objectPosition: "center",

  "@media (max-width: 1023px)": {
    width: "85%",
    maxWidth: 340,
    maxHeight: "min(300px, 32dvh)",
  },

  "@media (max-width: 767px)": {
    width: "100%",
    maxWidth: 300,
    maxHeight: "min(280px, 30dvh)",
  },
});

export const BannerContent = styled.div({
  gridColumn: 2,
  gridRow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minWidth: 0,
  padding: "16px 10px",
  textAlign: "center",

  "@media (max-width: 1023px)": {
    display: "contents",
  },
});

export const BannerTitle = styled.h2({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 6,
  marginBottom: 20,
  color: TEXT,
  fontSize: 30,
  fontWeight: 800,
  letterSpacing: "-1.2px",
  lineHeight: 1.3,
  textAlign: "center",
  wordBreak: "keep-all",
  overflowWrap: "anywhere",

  "@media (max-width: 1023px)": {
    order: 0,
    flexShrink: 0,
    fontSize: 30,
    marginBottom: 16,
  },

  "@media (max-width: 767px)": {
    fontSize: 24,
    marginBottom: 14,
  },
});

export const TitleFirstLine = styled.span({
  color: TEXT,
});

export const TitleSecondLine = styled.span({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  color: "#00A99A",

  "& svg": {
    width: 28,
    height: 28,
    flexShrink: 0,
    color: "#17C9B5",
    transform: "rotate(-20deg)",
  },

  "@media (max-width: 767px)": {
    "& svg": {
      width: 24,
      height: 24,
    },
  },
});

export const BannerDescription = styled.p({
  marginBottom: 28,
  color: "#587185",
  fontSize: 18,
  lineHeight: 1.8,
  textAlign: "center",
  wordBreak: "keep-all",
  overflowWrap: "anywhere",
  "&.basic": { marginBottom: 0 },

  "@media (max-width: 1023px)": {
    order: 1,
    flexShrink: 0,
    marginBottom: 0,
    fontSize: 17,
  },

  "@media (max-width: 767px)": {
    fontSize: 16,
    "&.non-mobile": { display: "none" },
  },
});

export const BannerLoginButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  width: "100%",
  maxWidth: 310,
  minHeight: 52,
  padding: "10px 20px",
  borderRadius: 10,
  backgroundColor: PRIMARY,
  color: "#FFFFFF",
  fontSize: 17,
  fontWeight: 700,
  transition: "background-color 0.2s, transform 0.2s",

  "&:hover": {
    backgroundColor: "#003E43",
    transform: "translateY(-2px)",
  },

  "&:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: 4,
  },

  "@media (max-width: 1023px)": {
    order: 3,
    flexShrink: 0,
    maxWidth: 360,
    minHeight: 54,
    borderRadius: 12,
    fontSize: 16,
  },

  "@media (max-width: 767px)": {
    maxWidth: 360,
    minHeight: 52,
  },
});

export const SignupRow = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 18,
  color: MUTED,
  fontSize: 16,
  textAlign: "center",

  "@media (max-width: 1023px)": {
    order: 4,
    flexShrink: 0,
    flexDirection: "column",
    gap: 8,
    marginTop: 20,
  },

  "@media (max-width: 767px)": {
    fontSize: 15,
  },
});

export const SignupButton = styled.button({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  color: "#009F94",
  fontWeight: 700,

  "&:hover": {
    textDecoration: "underline",
  },

  "&:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: 4,
  },
});
