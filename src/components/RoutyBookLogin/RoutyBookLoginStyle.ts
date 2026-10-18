import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// ====================================
// 공통 색상과 애니메이션
// ====================================

const teal = "#0A414B";
const yellow = "#F5C71D";
const paper = "#FBFAF6";
const border = "#D8DFEB";

const easing = "cubic-bezier(0.22, 0.62, 0.20, 1)";

// 글자 위로 빛이 지나가는 효과
const hintShine = keyframes({
  "0%, 100%": {
    backgroundPosition: "0% 50%",
  },

  "50%": {
    backgroundPosition: "100% 50%",
  },
});

// 별 반짝임
const hintSparkle = keyframes({
  "0%, 100%": {
    opacity: 0.3,
    transform: "scale(0.7) rotate(0deg)",
  },

  "50%": {
    opacity: 1,
    transform: "scale(1.25) rotate(25deg)",
  },
});

// 호버할 때 빛나는 효과
const hintGlow = keyframes({
  "0%, 100%": {
    filter: "drop-shadow(0 0 2px rgba(245,199,29,0.2))",
  },

  "50%": {
    filter: "drop-shadow(0 0 10px rgba(245,199,29,0.75))",
  },
});

// ====================================
// 전체 배경
// ====================================

export const Stage = styled.main({
  "--page-width": "700px",
  "--page-height": "870px",

  position: "relative",

  width: "100%",
  minWidth: "1440px",
  minHeight: "max(100dvh, 1040px)",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  backgroundColor: paper,
  color: teal,

  fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',

  fontSize: "16px",

  "&, *, *::before, *::after": {
    boxSizing: "border-box",
  },
  // 태블릿: 화면 너비보다 큰 1440px 고정 레이아웃 해제
  "@media (min-width: 768px) and (max-width: 1024px)": {
    "--page-width": "min(470px, calc((100vw - 36px) / 2))",
    "--page-height": "min(640px, calc(100dvh - 52px))",
    width: "100%",
    minWidth: 0,
    height: "100dvh",
    minHeight: "100dvh",
    overflowX: "hidden",
    overflowY: "auto",
  },
});

// ====================================
// 여권 전체
// ====================================

export const Book = styled.div({
  position: "absolute",

  top: "50%",
  left: "50%",

  width: "calc(var(--page-width) * 2)",
  height: "var(--page-height)",

  perspective: "1800px",
  perspectiveOrigin: "center center",

  // 닫힌 상태: 기존보다 왼쪽으로 60px 이동
  transform: "translate(calc(-75% - 60px), -50%)",

  transition: `transform 1800ms ${easing}`,

  // 펼쳐진 상태: 화면 정중앙
  "&[data-open='true']": {
    transform: "translate(-50%, -50%)",
  },
  // 태블릿: 닫힌 여권은 살짝 왼쪽, 펼치면 정확히 정중앙
  "@media (min-width: 768px) and (max-width: 1024px)": {
    transform: "translate(calc(-75% - 22px), -50%)",
    "&[data-open='true']": {
      transform: "translate(-50%, -50%)",
    },
  },
});

// ====================================
// 여권 앞표지 회전
// ====================================

export const CoverLeaf = styled.div({
  position: "absolute",

  top: 0,
  left: "50%",

  width: "50%",
  height: "100%",

  zIndex: 6,

  transformOrigin: "left center",
  transformStyle: "preserve-3d",
  WebkitTransformStyle: "preserve-3d",

  transform: "rotateY(0deg)",

  transition: `transform 1800ms ${easing}`,

  willChange: "transform",

  "&[data-open='true']": {
    transform: "rotateY(-180deg)",
  },

  "&[data-settled='true']": {
    zIndex: 2,
  },
});

// ====================================
// 여권 앞표지 앞면
// ====================================

export const CoverFrontFace = styled.button({
  appearance: "none",

  position: "absolute",
  inset: 0,

  display: "block",

  width: "100%",
  height: "100%",

  padding: 0,
  margin: 0,

  border: "none",
  borderRadius: "6px",

  backgroundColor: teal,

  overflow: "hidden",
  cursor: "pointer",

  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",

  transform: "rotateY(0deg) translateZ(1px)",

  boxShadow: "5px 8px 24px rgba(0,0,0,0.18)",

  "&:disabled": {
    pointerEvents: "none",
  },

  "&:focus-visible": {
    outline: `3px solid ${yellow}`,
  },
});

// ====================================
// 펼쳐진 표지 안쪽
// ====================================

export const CoverInsideFace = styled.button({
  appearance: "none",

  position: "absolute",
  inset: 0,

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  width: "100%",
  height: "100%",

  padding: "28px",
  margin: 0,

  border: "none",
  borderRadius: "6px",

  backgroundColor: teal,

  overflow: "hidden",
  cursor: "pointer",

  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",

  transform: "rotateY(180deg) translateZ(1px)",

  boxShadow: "4px 7px 22px rgba(0,0,0,0.16)",

  "&:disabled": {
    pointerEvents: "none",
  },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    padding: "18px",
  },
});

// ====================================
// 여권 안쪽 SVG
// ====================================

export const CoverImage = styled.img({
  display: "block",

  width: "100%",
  height: "100%",

  objectFit: "contain",
  objectPosition: "center",

  userSelect: "none",
  pointerEvents: "none",
});

// ====================================
// 로그인 ↔ 회원가입 책장 회전
// ====================================

export const TurningLeaf = styled.div({
  position: "absolute",

  top: 0,
  left: "50%",

  width: "50%",
  height: "100%",

  zIndex: 4,

  transformOrigin: "left center",
  transformStyle: "preserve-3d",
  WebkitTransformStyle: "preserve-3d",

  transform: "rotateY(0deg)",

  transition: `transform 1450ms ${easing}`,

  willChange: "transform",

  "&[data-signup='true']": {
    transform: "rotateY(-180deg)",
  },
});

// ====================================
// 로그인 페이지 앞면
// ====================================

export const LoginFace = styled.div({
  position: "absolute",
  inset: 0,

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",

  width: "100%",
  height: "100%",

  padding: "45px 55px",

  border: `9px solid ${teal}`,

  borderRadius: "0 7px 7px 0",

  backgroundColor: paper,
  color: teal,

  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",

  transform: "rotateY(0deg) translateZ(1px)",

  boxShadow: "5px 7px 24px rgba(0,0,0,0.13)",

  overflowY: "auto",
  scrollbarWidth: "thin",
  // 태블릿: 좌우 입력창에 충분한 공간 확보
  "@media (min-width: 768px) and (max-width: 1024px)": {
    padding: "24px 28px",
    borderWidth: "7px",
    overflowY: "auto",
  },
});

// ====================================
// 회원가입 왼쪽 페이지
// ====================================

export const SignupLeftFace = styled.div({
  position: "absolute",
  inset: 0,

  width: "100%",
  height: "100%",

  border: `9px solid ${teal}`,

  borderRight: "none",

  borderRadius: "7px 0 0 7px",

  backgroundColor: paper,

  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",

  transform: "rotateY(180deg) translateZ(1px)",

  boxShadow:
    "inset -9px 0 16px -13px rgba(0,0,0,0.3), " +
    "-4px 8px 22px rgba(0,0,0,0.12)",

  overflow: "hidden",
  "@media (min-width: 768px) and (max-width: 1024px)": {
    borderWidth: "7px",
    borderRight: "none",
    // 기존 RoutySignup의 왼쪽 폼에만 적용
    "& > div": {
      padding: "24px 26px 20px",
      minWidth: 0,
    },
    "& header": { marginBottom: "16px", minHeight: "44px", gap: "10px" },
    "& header img": { width: "110px", maxWidth: "45%" },
    "& header h1": { fontSize: "22px" },
    "& input:not([type='checkbox'])": { height: "42px", fontSize: "15px" },
    "& button": { fontSize: "15px" },
  },
});

// ====================================
// 회원가입 오른쪽 페이지
// ====================================

export const SignupRightPage = styled.div({
  position: "absolute",

  top: 0,
  left: "50%",

  width: "50%",
  height: "100%",

  zIndex: 1,

  border: `9px solid ${teal}`,

  borderRadius: "0 7px 7px 0",

  backgroundColor: paper,

  overflow: "hidden",

  boxShadow: "4px 8px 22px rgba(0,0,0,0.1)",
  "@media (min-width: 768px) and (max-width: 1024px)": {
    borderWidth: "7px",
    // 기존 RoutySignup의 오른쪽 폼을 압축하고 내부 스크롤 유지
    "& > form": {
      padding: "28px 26px 22px",
      minWidth: 0,
      overflowY: "auto",
    },
    "& input:not([type='checkbox'])": { height: "42px", fontSize: "15px" },
    "& button": { fontSize: "15px" },
  },
});

// ====================================
// 로그인 제목
// ====================================

export const LoginHeading = styled.h1({
  margin: "0 0 36px",

  color: teal,

  fontSize: "30px",
  fontWeight: 800,
  lineHeight: 1.3,

  textAlign: "center",
  "@media (min-width: 768px) and (max-width: 1024px)": {
    fontSize: "27px",
    marginBottom: "24px",
  },
});

// ====================================
// 로그인 폼
// ====================================

export const LoginForm = styled.form({
  display: "flex",
  flexDirection: "column",

  width: "100%",
});

// ====================================
// 입력창 라벨
// ====================================

export const InputLabel = styled.label({
  display: "block",

  marginBottom: "10px",

  color: teal,

  fontSize: "16px",
  fontWeight: 700,
  lineHeight: 1.4,
});

// ====================================
// 입력창 컨테이너
// ====================================

export const InputBox = styled.div({
  position: "relative",

  width: "100%",
  marginBottom: "26px",
  "@media (min-width: 768px) and (max-width: 1024px)": {
    marginBottom: "18px",
  },
});

// ====================================
// 입력창 아이콘
// ====================================

export const InputIcon = styled.span({
  position: "absolute",

  top: "50%",
  left: "15px",

  transform: "translateY(-50%)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  color: "#8E9EAD",

  pointerEvents: "none",

  svg: {
    width: "20px",
    height: "20px",
  },
});

// ====================================
// 이메일 / 비밀번호 입력창
// ====================================

export const TextInput = styled.input({
  display: "block",

  width: "100%",
  height: "52px",

  padding: "0 46px",

  border: `1px solid ${border}`,

  borderRadius: "6px",

  backgroundColor: "#FFFFFF",
  color: "#243E46",

  fontFamily: "inherit",
  fontSize: "16px",

  outline: "none",

  "&::placeholder": {
    color: "#9CA9B8",
    fontSize: "15px",
  },

  "&:focus": {
    borderColor: teal,

    boxShadow: "0 0 0 3px rgba(10,65,75,0.1)",
  },

  "&:disabled": {
    cursor: "not-allowed",
  },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    height: "46px",
    fontSize: "16px",
  },
});

// ====================================
// 비밀번호 보기 버튼
// ====================================

export const PasswordToggle = styled.button({
  position: "absolute",

  top: "50%",
  right: "12px",

  transform: "translateY(-50%)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "32px",
  height: "32px",

  padding: 0,

  border: "none",
  backgroundColor: "transparent",

  color: "#8E9EAD",
  cursor: "pointer",

  svg: {
    width: "21px",
    height: "21px",
  },

  "&:disabled": {
    cursor: "not-allowed",
  },
});

// ====================================
// 로그인 상태 유지
// ====================================

export const RememberLabel = styled.label({
  display: "flex",
  alignItems: "center",

  gap: "10px",
  marginBottom: "28px",

  color: teal,

  fontSize: "16px",
  fontWeight: 600,
  lineHeight: 1.4,

  cursor: "pointer",

  input: {
    width: "18px",
    height: "18px",

    margin: 0,

    accentColor: teal,
    cursor: "pointer",
  },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    marginBottom: "20px",
  },
});

// ====================================
// 로그인 버튼
// ====================================

export const SubmitButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "100%",
  height: "54px",

  border: "none",
  borderRadius: "6px",

  background: "linear-gradient(100deg, #0A414B, #00646D)",

  color: "#FFFFFF",

  fontFamily: "inherit",
  fontSize: "18px",
  fontWeight: 700,

  cursor: "pointer",

  "&:hover:not(:disabled)": {
    filter: "brightness(1.1)",
  },

  "&:disabled": {
    opacity: 0.65,
    cursor: "not-allowed",
  },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    height: "48px",
    fontSize: "17px",
  },
});

// ====================================
// 로그인 오류 메시지
// ====================================

export const Feedback = styled.p({
  margin: "14px 0 0",

  color: "#BD4146",

  fontSize: "15px",
  fontWeight: 500,
  lineHeight: 1.5,
});

// ====================================
// 로그인 아래쪽 메뉴
// ====================================

export const AccountLinks = styled.nav({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",

  columnGap: "10px",
  rowGap: "10px",

  marginTop: "32px",

  fontSize: "15px",
  lineHeight: 1.4,

  span: {
    color: "#8D9B9D",
  },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    marginTop: "23px",
    columnGap: "8px",
  },
});

// ====================================
// 아이디 / 비밀번호 찾기
// ====================================

export const TextButton = styled.button({
  padding: 0,

  border: "none",
  backgroundColor: "transparent",

  color: "#243B40",

  fontFamily: "inherit",
  fontSize: "15px",
  fontWeight: 500,

  whiteSpace: "nowrap",
  cursor: "pointer",

  "&:hover:not(:disabled)": {
    textDecoration: "underline",
  },

  "&:disabled": {
    opacity: 0.55,
    cursor: "not-allowed",
  },
});

// ====================================
// 화살표 없는 회원가입 버튼
// ====================================

export const SignUpButton = styled(TextButton)({
  display: "inline-flex",
  alignItems: "center",

  gap: "5px",

  color: "#00646D",
  fontWeight: 800,
});

// ====================================
// 여권 클릭 안내
// ====================================

export const Hint = styled.button({
  position: "absolute",

  top: "50%",

  left: "calc(50% + var(--page-width) / 2 + 40px)",

  transform: "translateY(-50%) scale(1)",

  padding: "12px 8px",
  margin: 0,

  border: "none",
  backgroundColor: "transparent",

  fontFamily: "inherit",

  // 글자 크기
  fontSize: "40px",
  fontWeight: 900,
  lineHeight: 1.4,

  whiteSpace: "nowrap",
  textAlign: "left",

  // 노란빛이 지나가는 글자
  backgroundImage: `linear-gradient(
        110deg,
        ${teal} 0%,
        ${teal} 30%,
        ${yellow} 48%,
        ${teal} 65%,
        ${teal} 100%
      )`,

  backgroundSize: "250% 100%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",

  cursor: "pointer",

  // 기본 상태에서는 숨김
  opacity: 0,
  visibility: "hidden",
  pointerEvents: "none",

  transition:
    "opacity 380ms ease, " +
    "visibility 0s linear 380ms, " +
    "transform 280ms ease",

  animation: `${hintShine} 3.5s ease-in-out infinite`,

  animationPlayState: "paused",

  // 여권을 완전히 닫은 후 표시
  "&[data-visible='true']": {
    opacity: 1,
    visibility: "visible",
    pointerEvents: "auto",

    animationPlayState: "running",

    transition:
      "opacity 380ms ease, " + "visibility 0s, " + "transform 280ms ease",
  },

  // 왼쪽 반짝이는 별
  "&::before": {
    content: '"✦"',

    position: "absolute",

    top: "-10px",
    left: "-25px",

    fontSize: "26px",
    lineHeight: 1,

    color: yellow,
    WebkitTextFillColor: yellow,

    animation: `${hintSparkle} 1.8s ease-in-out infinite`,

    pointerEvents: "none",
  },

  // 오른쪽 반짝이는 별
  "&::after": {
    content: '"✧"',

    position: "absolute",

    right: "-26px",
    bottom: "-5px",

    fontSize: "32px",
    lineHeight: 1,

    color: yellow,
    WebkitTextFillColor: yellow,

    animation: `${hintSparkle} 2.2s ease-in-out infinite 0.5s`,

    pointerEvents: "none",
  },

  // 마우스 올렸을 때
  "&:hover:not(:disabled)": {
    transform: "translateY(-50%) scale(1.08)",

    animation:
      `${hintShine} 1.4s ease-in-out infinite, ` +
      `${hintGlow} 1.5s ease-in-out infinite`,
  },

  "&:hover::before, &:hover::after": {
    animationDuration: "0.8s",
  },

  "&:focus-visible": {
    outline: `2px solid ${yellow}`,

    outlineOffset: "4px",
    borderRadius: "6px",
  },

  "&:disabled": {
    cursor: "default",
  },

  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",

    "&::before, &::after": {
      animation: "none",
    },
  },
  // 태블릿 닫힌 여권 오른쪽에서 글자가 잘리지 않게 조정
  "@media (min-width: 768px) and (max-width: 1024px)": {
    left: "calc(50% + var(--page-width) / 2 + 16px)",
    fontSize: "17px",
    fontWeight: 800,
    maxWidth: "calc(50vw - var(--page-width) / 2 - 28px)",
    whiteSpace: "normal",
    wordBreak: "keep-all",
    padding: "8px 2px",
  },
});

// =========================================================
// 767px 이하 모바일 전용. 데스크톱 여권 스타일은 그대로 둡니다.
// =========================================================

export const DesktopOnly = styled.div({
  display: "block",
  width: "100%",
  "@media (max-width: 767px)": { display: "none" },
});

export const MobileShell = styled.main({
  display: "none",
  "@media (max-width: 767px)": {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    width: "100%",
    height: "100dvh",
    minHeight: "100dvh",
    overflowX: "hidden",
    boxSizing: "border-box",
    backgroundColor: "#FBFAF6",
    color: teal,
    fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
    fontSize: "16px",
    // 모바일 전체 하위 요소도 padding과 border를 너비에 포함
    "& *, & *::before, & *::after": { boxSizing: "border-box" },
  },
});

export const MobileTopBar = styled.div({
  // 모바일 상단 장식 바 숨김
  display: "none",
});

export const MobileHeader = styled.header({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexShrink: 0,
  width: "100%",
  height: "86px",
  padding: "10px 23px",
  "@media (max-width: 359px)": { height: "78px", padding: "8px 18px" },
});

export const MobileLogo = styled.img({
  width: "132px",
  height: "60px",
  maxWidth: "calc(100vw - 116px)",
  objectFit: "contain",
  "@media (max-width: 359px)": { width: "114px", height: "52px" },
  filter:
    "brightness(0) saturate(100%) invert(19%) sepia(30%) saturate(1100%) hue-rotate(145deg) brightness(80%)",
});

export const MobileBack = styled.button({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "36px",
  height: "36px",
  padding: 0,
  border: "none",
  backgroundColor: "transparent",
  color: teal,
  cursor: "pointer",
});

export const MobileContent = styled.section({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  padding: "24px 27px 26px",
  overflowX: "hidden",
  overflowY: "auto",
  "&[data-cover='true']": {
    alignItems: "center",
    paddingTop: "44px",
  },
  "&[data-step='true']": {
    gap: "24px",
    paddingTop: "28px",
    overflowY: "auto",
  },
});

// 닫힌 여권의 안내 문구. 표지가 커지기 시작하면 자연스럽게 사라집니다.
export const MobileCoverPrompt = styled.h1({
  order: 2,
  width: "100%",
  margin: "0",
  color: teal,
  fontSize: "24px",
  lineHeight: 1.4,
  fontWeight: 800,
  textAlign: "center",
  opacity: 1,
  transition: "opacity 250ms ease, transform 250ms ease",
  "&[data-opening='true']": {
    opacity: 0,
    transform: "translateY(8px)",
  },
});

// 모바일에서는 펼쳐지지 않고 닫힌 여권이 중앙에서 확대되며 사라집니다.
export const MobileCoverScene = styled.div({
  order: 1,
  position: "relative",
  flexShrink: 0,
  width: "min(65vw, 254px)",
  height: "min(90vw, 352px)",
  margin: "0 auto",
  transformOrigin: "center center",
});

// 여권 확대 중 배경은 끝까지 불투명하게 유지합니다.
// 따라서 로그인 폼이 표지 뒤로 비치는 현상이 없습니다.
export const MobileCoverOverlay = styled.section({
  position: "absolute",
  inset: 0,
  zIndex: 30,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "24px",
  width: "100%",
  maxWidth: "100%",
  padding: "24px 27px",
  boxSizing: "border-box",
  backgroundColor: "#FBFAF6",
  // 여권을 크게 확대해도 모바일 화면 밖으로 삐져나오지 않도록 합니다.
  overflow: "hidden",
  "&[data-opening='true']": {
    pointerEvents: "none",
  },
});

// 모바일에서 닫힌 여권이 약 5.2배까지 확대됩니다.
// 앞부분은 선명하게 확대하고, 뒤쪽 260ms 동안 자연스럽게 페이드아웃합니다.
// 뒤의 로그인 페이지는 표지 전환이 끝난 다음 렌더링되므로 겹쳐 보이지 않습니다.
export const MobileCoverButton = styled.button({
  appearance: "none",
  position: "absolute",
  inset: 0,
  display: "block",
  width: "100%",
  height: "100%",
  padding: 0,
  margin: 0,
  border: "none",
  borderRadius: "4px",
  overflow: "hidden",
  backgroundColor: teal,
  boxShadow: "0 14px 18px rgba(10, 65, 75, 0.2)",
  transformOrigin: "center center",
  transform: "scale(1)",
  opacity: 1,
  transition:
    // 확대는 0.7초, 페이드는 마지막 0.26초에 진행합니다.
    "transform 700ms cubic-bezier(0.18, 0.7, 0.18, 1), " +
    "opacity 260ms ease-in 440ms",
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
  cursor: "pointer",
  "&[data-opening='true']": {
    // 화면을 완전히 채울 만큼 크게 확대합니다.
    transform: "scale(5.2)",
    opacity: 0,
  },
  "&:focus-visible": { outline: "3px solid #F5C71D", outlineOffset: "5px" },
  "&:disabled": { cursor: "default" },
  "@media (prefers-reduced-motion: reduce)": {
    transitionDuration: "1ms",
  },
});

export const MobileTitle = styled.h1({
  margin: "0 0 20px",
  color: teal,
  fontSize: "28px",
  fontWeight: 800,
  lineHeight: 1.4,
  "@media (max-width: 359px)": { fontSize: "26px" },
  "&[data-login='true']": { textAlign: "center", margin: "28px 0 32px" },
});

export const MobileProgress = styled.div({
  display: "flex",
  flexShrink: 0,
  gap: "6px",
  padding: "4px 27px 0",
});

export const MobileProgressPart = styled.span({
  height: "5px",
  flex: 1,
  borderRadius: "4px",
  backgroundColor: "#D9E3E2",
  "&[data-active='true']": { backgroundColor: teal },
});

export const MobileForm = styled.form({
  display: "flex",
  flexDirection: "column",
  gap: "22px",
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  boxSizing: "border-box",
  "&[data-signup='true']": { flex: 1, minHeight: 0, gap: 0 },
});

export const MobileField = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
});

export const MobileLabel = styled.label({
  color: teal,
  fontSize: "18px",
  fontWeight: 800,
  lineHeight: 1.45,
});

export const MobileInput = styled.input({
  display: "block",
  flex: "none",
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  boxSizing: "border-box",
  height: "54px",
  minHeight: "54px",
  padding: "0 14px",
  border: "1px solid #DCE5E6",
  borderRadius: "6px",
  outline: "none",
  backgroundColor: "#FFFFFF",
  color: teal,
  fontFamily: "inherit",
  fontSize: "17px",
  "&::placeholder": { color: "#A1AAAC", fontSize: "16px" },
  "&:focus": { borderColor: teal, boxShadow: "0 0 0 2px rgba(10,65,75,0.08)" },
  "&:disabled": { backgroundColor: "#EFF1F0", cursor: "not-allowed" },
});

export const MobileInputRow = styled.div({
  display: "flex",
  alignItems: "stretch",
  gap: "8px",
  width: "100%",
  minWidth: 0,
  "& input": {
    flex: "1 1 0%",
    width: 0,
    minWidth: 0,
  },
});

export const MobileMiniButton = styled.button({
  flexShrink: 0,
  minWidth: "72px",
  minHeight: "54px",
  padding: "0 12px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: teal,
  color: "white",
  fontFamily: "inherit",
  fontSize: "16px",
  fontWeight: 700,
  cursor: "pointer",
  "&:disabled": { opacity: 0.55, cursor: "not-allowed" },
});

export const MobilePasswordBox = styled.div({
  position: "relative",
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  boxSizing: "border-box",
  input: { width: "100%", boxSizing: "border-box", paddingRight: "44px" },
});

export const MobileEyeButton = styled.button({
  position: "absolute",
  top: "50%",
  right: "8px",
  transform: "translateY(-50%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "40px",
  height: "40px",
  border: "none",
  backgroundColor: "transparent",
  color: "#778D90",
  cursor: "pointer",
});

export const MobileHelp = styled.p({
  margin: 0,
  color: "#718588",
  fontSize: "16px",
  lineHeight: 1.55,
});

export const MobileStatus = styled.p({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  margin: 0,
  color: "#C55252",
  fontSize: "16px",
  lineHeight: 1.5,
  "&[data-valid='true']": { color: "#2B9876" },
});

export const MobileCheck = styled.label({
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  color: teal,
  fontSize: "16px",
  lineHeight: 1.5,
  cursor: "pointer",
  input: {
    width: "18px",
    height: "18px",
    flexShrink: 0,
    margin: "2px 0 0",
    accentColor: teal,
  },
  "&[data-all='true']": { fontWeight: 800, marginBottom: "10px" },
});

export const MobileAction = styled.div({
  position: "sticky",
  bottom: 0,
  display: "flex",
  flexShrink: 0,
  width: "100%",
  padding: "16px 27px 21px",
  backgroundColor: "#FBFAF6",
});

export const MobilePrimary = styled.button({
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  minHeight: "56px",
  padding: "12px 20px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: teal,
  color: "#FFFFFF",
  fontFamily: "inherit",
  fontSize: "18px",
  fontWeight: 800,
  cursor: "pointer",
  "&:disabled": { opacity: 0.6, cursor: "not-allowed" },
});

export const MobileLinks = styled.nav({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "6px",
  color: "#7A8A8B",
  fontSize: "16px",
});

export const MobileTextButton = styled.button({
  border: "none",
  padding: 0,
  backgroundColor: "transparent",
  color: teal,
  fontFamily: "inherit",
  fontSize: "16px",
  cursor: "pointer",
  "&:disabled": { opacity: 0.4, cursor: "not-allowed" },
});

export const MobileFooterStripe = styled.div({
  // 모바일 하단 장식 바 숨김
  display: "none",
});
