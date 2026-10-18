import styled from "@emotion/styled";

// ====================================
// 공통 색상
// ====================================

const teal = "#0A414B";
const tealLight = "#0B626A";
const paper = "#FFFEFA";
const border = "#DCE5E6";
const muted = "#778D90";
const success = "#36AA83";
const error = "#D85A5A";

// ====================================
// 회원가입 왼쪽 페이지
// ====================================

export const LeftContent = styled.div({
  display: "flex",
  flexDirection: "column",

  width: "100%",
  height: "100%",

  padding: "43px 50px 32px",

  backgroundColor: paper,
  color: teal,

  overflowY: "auto",
  scrollbarWidth: "thin",
});

// ====================================
// 회원가입 오른쪽 페이지
// ====================================

export const RightContent = styled.form({
  width: "100%",
  height: "100%",

  padding: "52px 52px 35px",

  backgroundColor: paper,
  color: teal,

  overflowY: "auto",
  scrollbarWidth: "thin",
});

// ====================================
// 회원가입 상단 헤더
// ====================================

export const Header = styled.header({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  gap: "18px",
  marginBottom: "30px",
  minHeight: "60px",
});

// ====================================
// Routy 로고
// ====================================

export const BrandLogo = styled.img({
  display: "block",

  width: "165px",
  maxWidth: "50%",
  height: "auto",

  objectFit: "contain",

  filter: "brightness(0) saturate(100%)",
});

// ====================================
// 회원가입 제목
// ====================================

export const PageTitle = styled.h1({
  margin: 0,

  color: teal,

  fontSize: "30px",
  fontWeight: 800,
  lineHeight: 1.3,

  whiteSpace: "nowrap",
});

// ====================================
// 입력 필드 목록
// ====================================

export const Fields = styled.div({
  display: "flex",
  flexDirection: "column",

  gap: "22px",
  width: "100%",
});

// ====================================
// 개별 입력 필드
// ====================================

export const Field = styled.div({
  display: "flex",
  flexDirection: "column",

  gap: "8px",
  minWidth: 0,
});

// ====================================
// 성 / 이름 가로 배치
// ====================================

export const FieldPair = styled.div({
  display: "grid",

  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",

  gap: "16px",
});

// ====================================
// 필드 라벨
// ====================================

export const FieldLabel = styled.label({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",

  columnGap: "8px",
  rowGap: "4px",

  color: teal,

  fontSize: "16px",
  fontWeight: 800,
  lineHeight: 1.4,
});

// ====================================
// 영문 보조 라벨
// ====================================

export const EnglishLabel = styled.span({
  color: tealLight,

  fontSize: "15px",
  fontWeight: 500,
  lineHeight: 1.4,
});

// ====================================
// 공통 입력창
// ====================================

export const Input = styled.input({
  display: "block",

  width: "100%",
  minWidth: 0,
  height: "48px",

  padding: "0 14px",

  border: "1px solid " + border,
  borderRadius: "7px",

  backgroundColor: "#FFFFFF",
  color: "#243F44",

  fontFamily: "inherit",
  fontSize: "16px",
  fontWeight: 400,

  outline: "none",

  transition: "border-color 180ms ease, box-shadow 180ms ease",

  "&::placeholder": {
    color: "#9FA9AB",
    fontSize: "15px",
  },

  "&:focus": {
    borderColor: tealLight,
    boxShadow: "0 0 0 3px rgba(10, 98, 106, 0.1)",
  },

  "&:disabled": {
    backgroundColor: "#F4F5F4",
    color: muted,
    cursor: "not-allowed",
  },

  "&[type='date']": {
    colorScheme: "light",
  },
});

// ====================================
// 입력창 + 인증 버튼 배치
// ====================================

export const InputGroup = styled.div({
  display: "flex",
  alignItems: "stretch",

  gap: "10px",
  width: "100%",
  minWidth: 0,

  input: {
    flex: 1,
    minWidth: 0,
  },
});

// ====================================
// 인증번호 / 중복확인 버튼
// ====================================

export const SmallButton = styled.button({
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",

  flexShrink: 0,

  minWidth: "114px",
  height: "48px",

  padding: "0 12px",

  border: "none",
  borderRadius: "7px",

  backgroundColor: teal,
  color: "#FFFFFF",

  fontFamily: "inherit",
  fontSize: "15px",
  fontWeight: 700,

  whiteSpace: "nowrap",
  cursor: "pointer",

  "&:hover:not(:disabled)": {
    backgroundColor: tealLight,
  },

  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

// ====================================
// 비밀번호 입력 영역
// ====================================

export const PasswordInput = styled.div({
  position: "relative",
  width: "100%",

  input: {
    paddingRight: "52px",
  },
});

// ====================================
// 비밀번호 보기 버튼
// ====================================

export const EyeButton = styled.button({
  position: "absolute",

  top: "50%",
  right: "10px",

  transform: "translateY(-50%)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "32px",
  height: "32px",

  padding: 0,

  border: "none",
  backgroundColor: "transparent",

  color: muted,
  cursor: "pointer",

  svg: {
    width: "20px",
    height: "20px",
  },

  "&:disabled": {
    cursor: "not-allowed",
  },
});

// ====================================
// 인증 / 유효성 검사 메시지
// ====================================

export const StatusText = styled.p({
  display: "flex",
  alignItems: "flex-start",

  gap: "8px",
  margin: "2px 0 0",

  color: error,

  fontSize: "15px",
  fontWeight: 500,
  lineHeight: 1.5,

  "&[data-valid='true']": {
    color: success,
  },

  svg: {
    flexShrink: 0,

    width: "18px",
    height: "18px",

    marginTop: "2px",
  },
});

// ====================================
// 약관 동의 영역
// ====================================

export const TermsSection = styled.div({
  display: "flex",
  flexDirection: "column",

  gap: "13px",

  paddingTop: "19px",
  borderTop: "1px solid #E6ECEA",
});

// ====================================
// 개별 약관 체크박스
// ====================================

export const CheckRow = styled.label({
  display: "flex",
  alignItems: "flex-start",

  gap: "10px",

  color: "#627779",

  fontSize: "15px",
  fontWeight: 500,
  lineHeight: 1.5,

  cursor: "pointer",

  input: {
    flexShrink: 0,

    width: "18px",
    height: "18px",

    margin: "2px 0 0",

    accentColor: teal,
    cursor: "pointer",
  },

  "&[data-all='true']": {
    color: teal,

    fontSize: "16px",
    fontWeight: 800,

    marginBottom: "4px",
  },
});

// ====================================
// 회원가입 완료 버튼
// ====================================

export const SubmitButton = styled.button({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  width: "100%",
  minHeight: "52px",

  padding: "10px 20px",

  border: "none",
  borderRadius: "7px",

  background: "linear-gradient(100deg, " + teal + ", #00636C)",

  color: "#FFFFFF",

  fontFamily: "inherit",
  fontSize: "17px",
  fontWeight: 800,

  cursor: "pointer",

  "&:hover:not(:disabled)": {
    filter: "brightness(1.08)",
  },

  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

// ====================================
// 오류 메시지
// ====================================

export const Message = styled.p({
  margin: 0,

  color: error,

  fontSize: "15px",
  fontWeight: 600,
  lineHeight: 1.5,
});

// ====================================
// 왼쪽 페이지 하단
// ====================================

export const PageFooter = styled.footer({
  display: "flex",
  alignItems: "flex-end",

  flex: 1,

  marginTop: "30px",
});

// ====================================
// 로그인 화면으로 돌아가기
// ====================================

export const BackButton = styled.button({
  display: "inline-flex",
  alignItems: "center",

  gap: "8px",

  padding: "5px 0",

  border: "none",
  backgroundColor: "transparent",

  color: teal,

  fontFamily: "inherit",
  fontSize: "16px",
  fontWeight: 700,

  cursor: "pointer",

  svg: {
    width: "20px",
    height: "20px",
  },

  "&:hover:not(:disabled)": {
    textDecoration: "underline",
  },

  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});
