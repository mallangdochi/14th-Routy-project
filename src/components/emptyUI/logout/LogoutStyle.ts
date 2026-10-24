import styled from "@emotion/styled";

const PRIMARY = "#005259";
const TEXT = "#0C293D";
const MUTED = "#72869A";

/* 전체 레이아웃 */

export const Layout = styled.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  width: "100%",
  minHeight: "100dvh",

  "@media (max-width: 767px)": {
    display: "block",
  },
});

export const PageWrapper = styled.main({
  display: "flex",
  flex: "1 1 0%",
  flexDirection: "column",
  width: "100%",
  minWidth: 0,
  minHeight: "100dvh",
  padding: "42px 40px 32px",
  backgroundColor: "#FFFFFF",

  "@media (max-width: 1023px)": {
    padding: "32px 24px 24px",
  },

  "@media (max-width: 767px)": {
    minHeight: "100dvh",
    padding: "24px 16px 20px",
  },
});

/* 페이지 헤더 */

export const PageHeader = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: "0px",
  width: "100%",
  paddingBottom: "24px",
  marginBottom: "24px",
  borderBottom: "1px solid #E4EAEE",

  "@media (max-width: 1023px)": {
    paddingBottom: "20px",
    marginBottom: "20px",
  },

  "@media (max-width: 767px)": {
    paddingBottom: "18px",
    marginBottom: "18px",
  },
});

/* 기존 헤더 버튼 호환용 */

export const HeaderLoginButton = styled.button({
  minHeight: "44px",
  padding: "10px 20px",
  border: "none",
  borderRadius: "9px",
  backgroundColor: PRIMARY,
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
});

/* 메인 배너 */

export const EmptyBanner = styled.section({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
  alignItems: "center",
  width: "100%",
  flex: "1 1 auto",
  minHeight: "430px",
  padding: "40px 26px",
  overflow: "hidden",
  borderRadius: "20px",
  background: "linear-gradient(110deg, #F1FCFB 0%, #F0FFFC 60%, #E6FAF6 100%)",

  "@media (max-width: 1023px)": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "650px",
    padding: "36px 24px",
    gap: 0,
  },

  "@media (max-width: 767px)": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: "1 0 auto",
    minHeight: "620px",
    padding: "32px 20px",
    borderRadius: "20px",
  },
});

/* 마스코트 */

export const BannerImageArea = styled.div({
  gridColumn: 1,
  gridRow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minWidth: 0,
  height: "100%",

  "@media (max-width: 1023px)": {
    order: 2,
    flex: "0 1 auto",
    width: "100%",
    height: "auto",
    minHeight: "220px",
    margin: "24px 0",
  },

  "@media (max-width: 767px)": {
    margin: "20px 0 24px",
  },
});

export const MascotImage = styled.img({
  display: "block",
  width: "100%",
  maxWidth: "400px",
  maxHeight: "340px",
  height: "auto",
  objectFit: "contain",
  objectPosition: "center",

  "@media (max-width: 1023px)": {
    width: "85%",
    maxWidth: "340px",
    maxHeight: "300px",
  },

  "@media (max-width: 767px)": {
    width: "100%",
    maxWidth: "340px",
    maxHeight: "320px",
  },
});

/* 배너 콘텐츠 */

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
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "6px",
  margin: "0 0 20px",
  color: TEXT,
  fontSize: "30px",
  fontWeight: 800,
  letterSpacing: "-1.2px",
  lineHeight: 1.3,
  wordBreak: "keep-all",

  "@media (max-width: 1023px)": {
    order: 0,
    flexDirection: "column",
    gap: "0px",
    marginBottom: "20px",
    fontSize: "32px",
    lineHeight: 1.25,
  },

  "@media (max-width: 767px)": {
    fontSize: "35px",
    marginBottom: "24px",
  },
});

export const TitleFirstLine = styled.span({
  color: TEXT,
});

export const TitleSecondLine = styled.span({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  color: "#00A99A",

  svg: {
    width: "28px",
    height: "28px",
    color: "#17C9B5",
    transform: "rotate(-20deg)",
  },

  "@media (max-width: 767px)": {
    gap: "10px",

    svg: {
      width: "30px",
      height: "30px",
    },
  },
});

export const BannerDescription = styled.p({
  margin: "0 0 28px",
  color: "#587185",
  fontSize: "15px",
  lineHeight: 1.8,
  wordBreak: "keep-all",

  "@media (max-width: 1023px)": {
    order: 1,
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.8,
  },

  "@media (max-width: 767px)": {
    fontSize: "13px",
  },
});

export const BannerLoginButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  width: "100%",
  maxWidth: "310px",
  minHeight: "52px",
  padding: "10px 20px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: PRIMARY,
  color: "#FFFFFF",
  fontSize: "17px",
  fontWeight: 700,
  cursor: "pointer",
  transition: "background-color 0.2s, transform 0.2s",

  "&:hover": {
    backgroundColor: "#003E43",
    transform: "translateY(-2px)",
  },

  "@media (max-width: 1023px)": {
    order: 3,
    width: "100%",
    maxWidth: "360px",
    minHeight: "54px",
    fontSize: "17px",
    borderRadius: "12px",
  },

  "@media (max-width: 767px)": {
    maxWidth: "none",
    minHeight: "56px",
    fontSize: "18px",
  },
});

export const SignupRow = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "18px",
  color: MUTED,
  fontSize: "14px",

  "@media (max-width: 1023px)": {
    order: 4,
    flexDirection: "column",
    justifyContent: "center",
    gap: "8px",
    marginTop: "20px",
    fontSize: "14px",
  },

  "@media (max-width: 767px)": {
    fontSize: "14px",
  },
});

export const SignupButton = styled.button({
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: 0,
  border: "none",
  backgroundColor: "transparent",
  color: "#009F94",
  fontSize: "inherit",
  fontWeight: 700,
  cursor: "pointer",

  "&:hover": {
    textDecoration: "underline",
  },
});
