import styled from "@emotion/styled";
import { dropdownAnimation, modalAnimation } from "../../styles/animation";

const CENTERED_FLEX = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;
// 전체 페이지 레이아웃
export const Page = styled.div({
  display: "flex",
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "#FAFAF7",
  color: "#182426",

  "@media (max-width: 767px)": {
    flexDirection: "column",
    minWidth: "320px",
  },
});
// 왼쪽 사이드바
export const SidebarArea = styled.aside({
  position: "sticky",
  top: 0,
  width: "fit-content",
  minWidth: 0,
  height: "100vh",
  flexShrink: 0,
  backgroundColor: "#FFFFFF",
  borderRight: "1px solid #E8EEEE",

  "@media (max-width: 767px)": {
    display: "none",
  },
});
// 오른쪽 메인 콘텐츠
export const MainContent = styled.main({
  flex: 1,
  minWidth: 0,
  minHeight: "100vh",

  "@media (max-width: 767px)": {
    width: "100%",
    minWidth: 0,
    minHeight: 0,
    paddingBottom: 0,
  },
});
// 콘텐츠 내부 여백
export const Container = styled.div({
  width: "100%",
  maxWidth: "1440px",
  margin: "0 auto",
  padding: "24px 24px 40px",
  minWidth: 0,

  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",

  "& > header": {
    flexShrink: 0,
    marginBottom: 12,
  },

  "@media (min-width: 1024px) and (max-width: 1199px)": {
    padding: "12px 10px 24px",
  },

  "@media (max-width: 1023px)": {
    padding: "8px 8px 24px",
  },

  "@media (max-width: 767px)": {
    width: "100%",
    minWidth: 0,
    minHeight: 0,
    padding: "8px 12px calc(90px + env(safe-area-inset-bottom))",
  },
});
// 여행 정보 헤더
export const Header = styled.header({
  display: "flex",
  flexDirection: "column",
  padding: "18px 20px 0",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E8EEEE",
  borderRadius: "12px",
  gap: "18px",

  "@media (max-width: 1023px)": {
    padding: "12px 12px 0",
    gap: "12px",
  },

  "@media (max-width: 767px)": {
    padding: "12px 10px 0",
    gap: "12px",
    borderRadius: "0 0 12px 12px",
  },
});

export const BreadcrumbWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  width: "100%",
  minWidth: 0,

  "@media (max-width: 767px)": {
    display: "none",
  },
});

export const SaveStatus = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "7px",
  alignSelf: "flex-end",
  marginTop: "-32px",
  color: "#006D70",
  fontSize: "12px",

  "@media (max-width: 767px)": {
    display: "none",
  },
});
// 모바일 저장 완료 토스트
export const MobileSaveToast = styled.div({
  display: "none",

  "@media (max-width: 767px)": {
    position: "fixed",
    bottom: "calc(105px + env(safe-area-inset-bottom))",
    left: "50%",
    transform: "translateX(-50%)",

    ...CENTERED_FLEX,
    gap: "12px",

    width: "max-content",
    maxWidth: "calc(100vw - 32px)",
    minHeight: "52px",
    padding: "9px 18px",

    backgroundColor: "#FFFFFF",
    borderRadius: "999px",
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.16)",

    color: "#005259",
    fontSize: "clamp(11px, 3.2vw, 14px)",
    fontWeight: 700,
    whiteSpace: "nowrap",

    zIndex: 101,
    pointerEvents: "none",

    animation: "mobileSaveToastIn 0.3s ease-out both",

    "@keyframes mobileSaveToastIn": {
      "0%": {
        opacity: 0,
        transform: "translate(-50%, 16px)",
      },
      "100%": {
        opacity: 1,
        transform: "translate(-50%, 0)",
      },
    },

    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

export const MobileSaveToastIcon = styled.div({
  ...CENTERED_FLEX,

  width: "32px",
  height: "32px",
  flexShrink: 0,

  borderRadius: "50%",
  backgroundColor: "#005259",
  color: "#FFFFFF",
});

export const TripInfo = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  width: "100%",

  "@media (max-width: 1023px)": {
    gap: "14px",
  },

  "@media (max-width: 767px)": {
    display: "grid",
    gridTemplateColumns: "64px minmax(0, 1fr) 28px",
    alignItems: "center",
    columnGap: "8px",
    rowGap: 0,
    width: "100%",
    minWidth: 0,
  },
});

export const TripThumbnail = styled.img({
  width: "150px",
  height: "90px",
  objectFit: "cover",
  borderRadius: "8px",
  flexShrink: 0,

  "@media (max-width: 1023px)": {
    width: "140px",
    height: "82px",
  },

  "@media (max-width: 767px)": {
    width: "64px",
    height: "76px",
    objectFit: "cover",
  },
});

export const TripDescription = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  flex: 1,
  minWidth: 0,

  "@media (max-width: 767px)": {
    width: "100%",
    minWidth: 0,
    gap: "6px",
    alignSelf: "center",
  },
});

export const TripTitleRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "8px",

  "@media (max-width: 767px)": {
    minWidth: 0,
    gap: "3px",

    "& > button": {
      flexShrink: 0,
      padding: "2px",
    },

    "& > button svg": {
      width: "13px",
      height: "13px",
    },
  },
});

export const TripTitle = styled.h1({
  margin: 0,
  fontSize: "22px",
  fontWeight: 800,
  lineHeight: 1.3,
  letterSpacing: "-0.6px",

  "@media (max-width: 1023px)": {
    fontSize: "18px",
    lineHeight: 1.3,
  },

  "@media (max-width: 767px)": {
    fontSize: "clamp(11px, 3.5vw, 15px)",
    lineHeight: 1.35,
    letterSpacing: "-0.4px",
    overflowWrap: "break-word",
  },
});

export const IconButton = styled.button({
  ...CENTERED_FLEX,
  padding: "4px",
  border: "none",
  backgroundColor: "transparent",
  color: "#222222",
});

export const TripDate = styled.p({
  margin: 0,
  fontSize: "16px",
  color: "#444444",

  "@media (max-width: 767px)": {
    fontSize: "11px",
    lineHeight: 1.4,
    overflowWrap: "anywhere",
  },
});

export const MemberList = styled.div({
  display: "flex",
  alignItems: "center",
  paddingLeft: "4px",
});

export const MemberAvatar = styled.div({
  ...CENTERED_FLEX,
  width: "38px",
  height: "38px",
  marginLeft: "-4px",
  borderRadius: "50%",
  border: "2px solid white",
  backgroundColor: "#E7F2EF",
  fontSize: "17px",
  overflow: "hidden",
  flexShrink: 0,

  "@media (max-width: 767px)": { width: "30px", height: "30px" },

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "inherit",
  },
});

export const MemberRemaining = styled.button({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  minHeight: "38px",
  marginLeft: "-4px",
  padding: "7px 17px",
  borderRadius: "999px",
  backgroundColor: "#E3F7E9",
  color: "#414B45",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: 1.4,
  whiteSpace: "nowrap",
  transition: "background-color 160ms ease",
  "&:focus-visible": { outline: "2px solid #527F79", outlineOffset: "3px" },
  "@media (hover: hover)": {
    "&:hover": { backgroundColor: "#D2EFDB" },
  },
  "@media (max-width: 767px)": {
    minHeight: "32px",
    padding: "6px 13px",
    fontSize: "14px",
  },
});

export const MemberAdd = styled.button({
  ...CENTERED_FLEX,
  width: "36px",
  height: "36px",
  marginLeft: "4px",
  border: "none",
  borderRadius: "50%",
  backgroundColor: "#E7F4F3",
  color: "#075E61",
});

export const HeaderActions = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "10px",

  "@media (max-width: 1023px)": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "15px",
    flexShrink: 0,

    "& > button": {
      // minWidth: 0,
      minHeight: "32px",
      // padding: "0 9px",
      fontSize: "16px",
      whiteSpace: "nowrap",
    },

    "& > button svg": {
      width: "14px",
      height: "14px",
    },
  },

  "@media (max-width: 767px)": {
    gridColumn: "3",
    gridRow: "1",
    width: "28px",
    marginLeft: 0,
    justifyContent: "center",
    alignSelf: "start",
    flexDirection: "column",
    gap: "5px",

    "& > button": {
      width: "28px",
      minWidth: "28px",
      minHeight: "28px",
      padding: 0,
      border: "none",
      // backgroundColor: "transparent",
    },

    "& > button svg": {
      width: "18px",
      height: "18px",
    },

    // 레퍼런스의 일반 상태에서는 더보기 버튼 숨김
    "& > button[aria-label='더보기']": {
      display: "none",
    },
  },
});

export const PrimaryButton = styled.button({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  minWidth: 40,
  minHeight: "38px",
  padding: "0 16px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#004E52",
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 700,
  whiteSpace: "nowrap",
  transition: "background-color 0.2s",

  "&:hover": {
    backgroundColor: "#007176",
  },

  "@media (max-width: 767px)": {
    display: "none",
  },
});

export const SecondaryButton = styled.button({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  minHeight: "38px",
  padding: "0 13px",
  border: "1px solid #E7EBED",
  borderRadius: "7px",
  backgroundColor: "#FFFFFF",
  color: "#222222",
  fontSize: "13px",
  fontWeight: 600,

  "&:hover": {
    backgroundColor: "#F3F8F8",
  },
});

export const ScheduleButton = styled.button({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  minHeight: "38px",
  padding: "0 9px",
  // border: "1px solid #E7EBED",
  borderRadius: "7px",
  backgroundColor: "#005259",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: 600,

  order: -1,

  "&:hover": {
    backgroundColor: "#003E43",
  },

  "@media (max-width:767px)": {
    span: { display: "none" },
  },
});

// 메인 탭
// 메인 탭 - 슬라이딩 밑줄 모션
export const MainTabs = styled.nav<{
  $activeIndex: number;
}>(({ $activeIndex }) => ({
  position: "relative",

  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",

  width: "100%",
  borderTop: "1px solid #EDF0F1",

  // 움직이는 밑줄
  "&::after": {
    content: '""',
    position: "absolute",

    bottom: 0,
    left: 0,

    width: "25%",
    height: "3px",

    backgroundColor: "#006D70",
    borderRadius: "3px 3px 0 0",

    transform: `translateX(${$activeIndex * 100}%)`,

    transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",

    pointerEvents: "none",
  },

  "@media (prefers-reduced-motion: reduce)": {
    "&::after": {
      transition: "none",
    },
  },

  "@media (max-width: 767px)": {
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    width: "100%",
    minWidth: 0,
  },
}));

export const MainTab = styled.button<{
  $active: boolean;
}>(({ $active }) => ({
  ...CENTERED_FLEX,

  gap: "10px",
  height: "48px",

  border: "none",
  backgroundColor: "transparent",

  color: $active ? "#004F53" : "#30383A",
  fontSize: "16px",
  fontWeight: $active ? 700 : 500,

  transition: "color 0.25s ease, background-color 0.25s ease",

  "&:hover": {
    color: "#00787B",
    backgroundColor: "#F4FAF9",
  },

  "@media (max-width: 1023px)": {
    height: "40px",
    gap: "8px",
  },

  "@media (max-width: 767px)": {
    minWidth: 0,
    height: "42px",
    gap: "4px",
    padding: "0 2px",
    fontSize: "11px",
    whiteSpace: "nowrap",

    "& svg": {
      width: "15px",
      height: "15px",
      flexShrink: 0,
    },
  },
}));
// 날짜 선택 카드
export const DayTabs = styled.div({
  display: "flex",
  alignItems: "stretch",
  gap: "10px",
  width: "100%",
  padding: "0 0 12px",
  overflowX: "auto",

  "&::-webkit-scrollbar": {
    height: "4px",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#9BC8C8",
    borderRadius: "4px",
  },

  "@media (max-width: 1023px)": {
    gap: "8px",
    padding: "8px 0",
  },

  "@media (max-width: 767px)": {
    display: "flex",
    gap: "6px",
    width: "100%",
    minWidth: 0,
    overflowX: "auto",
    overflowY: "hidden",
    scrollbarWidth: "none",

    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
});

export const DayButton = styled.button<{
  $active: boolean;
}>(({ $active }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "155px",
  minWidth: "145px",
  height: "58px",
  padding: "6px 8px",
  border: $active ? "1.5px solid #008A8A" : "1px solid #E6EAED",
  borderRadius: "9px",
  backgroundColor: $active ? "#EFFAFA" : "#FFFFFF",
  textAlign: "left",
  transition: "all 0.2s",

  "&:hover": {
    borderColor: "#008A8A",
  },

  "@media (max-width: 1023px)": {
    width: "145px",
    height: "55px",
    gap: "8px",
  },

  "@media (max-width: 767px)": {
    flex: "0 0 120px",
    width: "120px",
    minWidth: "120px",
    height: "46px",
    gap: "5px",
    padding: "5px",
  },
}));

export const DayThumbnail = styled.img({
  width: "46px",
  height: "44px",
  objectFit: "cover",
  borderRadius: "5px",
  flexShrink: 0,

  "@media (max-width: 1023px)": {
    width: "45px",
    height: "43px",
  },

  "@media (max-width: 767px)": {
    width: "38px",
    height: "36px",
  },
});

export const DayButtonText = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  whiteSpace: "nowrap",

  strong: {
    fontSize: "15px",
    fontWeight: 700,
  },

  span: {
    fontSize: "13px",
    color: "#535B5D",
  },

  "@media (max-width: 767px)": {
    minWidth: 0,
    gap: "2px",

    strong: {
      fontSize: "12px",
      lineHeight: 1.3,
    },

    span: {
      fontSize: "11px",
      lineHeight: 1.3,
    },
  },
});

// 일정 / 지도 2열 레이아웃
export const ContentGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  alignItems: "start",
  gap: "20px",
  width: "100%",
  minWidth: 0,
  padding: "24px",
  border: "1px solid #E2E6E9",
  borderRadius: "20px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 3px 14px rgba(13,62,65,.025)",
  "& > section": { width: "100%", minWidth: 0 },
  "@media (min-width: 1100px)": {
    '&[data-edit-mode="true"]': {
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
      gridTemplateRows: "auto auto",
      columnGap: "22px",
      "& > section:first-of-type": { display: "contents" },
      "& > section:first-of-type > div:first-of-type": {
        gridColumn: "1 / -1",
        marginBottom: 0,
      },
      "& > section:first-of-type > div:nth-of-type(2)": {
        gridColumn: "1",
        gridRow: "2",
      },
      "& > section:last-of-type": {
        gridColumn: "2",
        gridRow: "2",
        display: "flex",
        alignSelf: "stretch",
        height: "auto",
        minHeight: "650px",
        maxHeight: "none",
        borderRadius: "12px",
      },
    },
  },
  "@media (max-width: 1023px)": { padding: "18px", borderRadius: "16px" },
  "@media (max-width: 767px)": {
    padding: "12px",
    gap: "14px",
    borderRadius: "14px",
  },
});
// 일정 패널
export const SchedulePanel = styled.section({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  padding: 0,
  border: "none",
  backgroundColor: "transparent",
  '&[data-tablet-hidden="true"]': { display: "none" },
});

export const ScheduleHeading = styled.div({
  flexWrap: "wrap",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  minHeight: "32px",
  marginBottom: "12px",

  "@media (max-width: 1023px)": {
    gap: "13px",
    "@media (min-width: 768px)": {
      "&& button": { fontSize: "16px" },
    },
  },

  "@media (max-width: 767px)": {
    alignItems: "flex-start",
    gap: "6px",
    marginBottom: "12px",
  },
});

export const ScheduleHeadingLeft = styled.div({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "9px",
  minWidth: 0,
  "& .date-wrapper": {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 9,
  },
  h2: {
    margin: 0,
    fontSize: "21px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  "& > span": {
    fontSize: "16px",
    color: "#343434",
    whiteSpace: "nowrap",
  },

  "@media (max-width: 1023px)": {
    gap: "7px",
    flex: "1 1 200px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    h2: {
      fontSize: "20px",
    },
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    // Use the actual date/weather width when deciding whether to wrap.
    flex: "0 1 auto",
    minWidth: "min-content",
  },

  "@media (max-width: 767px)": {
    gap: "5px",
    flexWrap: "wrap",
    minWidth: 0,

    h2: {
      fontSize: "17px",
    },

    "& > span": {
      fontSize: "11px",
    },
  },
});

export const Weather = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  marginLeft: "8px",
  fontSize: "16px",
  whiteSpace: "nowrap",
  flexShrink: 0,

  "@media (max-width: 1023px)": {
    marginLeft: "4px",
    gap: "3px",
    fontSize: "15px",

    svg: {
      width: "17px",
      height: "17px",
    },
  },

  "@media (max-width: 767px)": {
    width: "100%",
    marginLeft: 0,
    fontSize: "10px",
    gap: "3px",

    "& svg": {
      width: "13px",
      height: "13px",
    },
  },
});

export const EditModeButton = styled.button<{
  $active: boolean;
}>(({ $active }) => ({
  ...CENTERED_FLEX,
  gap: "6px",
  flexShrink: 0,
  height: "32px",
  padding: "0 10px",
  border: $active ? "1px solid #006D70" : "1px solid #DDE7E7",
  borderRadius: "7px",
  backgroundColor: $active ? "#006D70" : "#FFFFFF",
  color: $active ? "#FFFFFF" : "#004F53",
  fontSize: "16px",
  fontWeight: 700,
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: $active ? "#005558" : "#EFF8F8",
    borderColor: "#006D70",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    height: "40px",
    padding: "0 12px",
    fontSize: "16px",
    gap: "6px",
    svg: { width: "16px", height: "16px" },
  },
  "@media (max-width: 767px)": {
    height: "29px",
    padding: "0 8px",
    fontSize: "11px",
    gap: "4px",

    svg: {
      width: "13px",
      height: "13px",
    },
  },
}));

export const EditHint = styled.div({
  ...CENTERED_FLEX,
  minHeight: "30px",
  marginBottom: "10px",
  padding: "7px 10px",
  border: "1px dashed #A9D5D2",
  borderRadius: "7px",
  backgroundColor: "#F1FAF9",
  color: "#006D70",
  fontSize: "11px",
  fontWeight: 500,

  "@media (max-width: 767px)": {
    padding: "9px 8px",
    fontSize: "10px",
    lineHeight: 1.5,
    textAlign: "center",
  },
});
// 일정 카드 목록
export const StopList = styled.div({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "100%",
  minWidth: 0,
  isolation: "isolate",

  "@media (max-width: 1023px)": {
    gap: "8px",
  },
});
// 일정 카드 행
// 일정 카드 행 - 드래그 모션
export const StopRow = styled.div<{
  $isDragging?: boolean;
  $dropEdge?: "before" | "after" | null;
}>(({ $isDragging }) => ({
  position: "relative",
  display: "flex",
  alignItems: "stretch",
  gap: "6px",
  width: "100%",
  minWidth: 0,
  minHeight: "90px",

  opacity: 1,
  backgroundColor: "transparent",
  borderRadius: "10px",
  transition:
    "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms ease",
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },

  "& > [data-stop-card]": {
    visibility: $isDragging ? "hidden" : "visible",
  },

  '&[data-editor-present="true"]': { zIndex: 20 },

  // 메뉴가 열린 카드
  "&:has([aria-expanded='true'])": {
    zIndex: 20,
  },

  // 마지막 타임라인 점선 제거
  "&:last-child > div:nth-of-type(2)::after": {
    display: "none",
  },

  "@media (max-width: 1023px)": {
    minHeight: "70px",
    gap: "5px",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    '&[data-edit-mode="true"]': {
      gap: "14px",
    },
  },

  "@media (max-width: 767px)": {
    minHeight: "130px",
    gap: "6px",
    "& > div:first-of-type, & > div:nth-of-type(2)": {
      alignSelf: "start",
      height: "130px",
    },
    '&[data-edit-mode="true"]': {
      display: "grid",
      gridTemplateColumns: "max-content minmax(0, 1fr) max-content",
      gap: "8px",
      padding: 0,
      border: 0,
      backgroundColor: "transparent",
      "& > div:first-of-type": {
        order: 2,
        width: "max-content",
        minWidth: 0,
        justifyContent: "flex-start",
        overflow: "visible",
      },
      "& > div:nth-of-type(2)": {
        order: 0,
        width: "max-content",
        minWidth: 0,
        justifyContent: "flex-end",
      },
      "& > [data-stop-card]": { order: 1 },
      "& > div:first-of-type > button, & > div:nth-of-type(2) > input": {
        transform: "none",
        margin: 0,
        padding: 0,
      },
      "& > div:first-of-type > button": {
        width: "auto",
        minWidth: 0,
        height: "auto",
        minHeight: 0,
        border: 0,
        lineHeight: 0,
        backgroundColor: "transparent",
      },
      "& > div:first-of-type > button > svg": {
        width: "18px",
      },
      "& > div:nth-of-type(2) > input": {
        width: "19.8px",
        height: "19.8px",
        minWidth: 0,
        flexShrink: 0,
      },
    },
  },
}));
// 드래그 핸들 영역
export const DragSlot = styled.div({
  ...CENTERED_FLEX,
  flex: "0 0 18px",
  width: "18px",
  minWidth: "18px",
  alignSelf: "stretch",

  // "@media (max-width: 1023px)": {
  // flex: "0 0 15px",
  // width: "15px",
  // minWidth: "15px",
  // },

  "@media (max-width: 767px)": {
    flex: "0 0 0px",
    width: 0,
    minWidth: 0,
    overflow: "hidden",

    // '&[data-edit-mode="true"]': {
    //   flex: "0 0 12px",
    //   width: "12px",
    //   minWidth: "12px",
    //   overflow: "visible",
    // },
  },
});
// 점 6개 드래그 핸들
export const DragHandle = styled.button({
  touchAction: "none",
  WebkitTouchCallout: "none",
  ...CENTERED_FLEX,

  width: "18px",
  height: "34px",

  border: "none",
  borderRadius: "5px",

  backgroundColor: "transparent",
  color: "#A8B7BA",

  cursor: "grab",

  userSelect: "none",
  WebkitUserSelect: "none",

  transition: "color 0.2s ease, background-color 0.2s ease",

  "&:hover": {
    color: "#006D70",
    backgroundColor: "#E7F5F4",
  },

  "&:active": {
    cursor: "grabbing",
    color: "#004F53",
  },

  "&:focus-visible": {
    outline: "2px solid #008A8A",
    outlineOffset: "2px",
  },

  // "@media (max-width: 1023px)": {
  //   // width: "15px",
  //   height: "30px",
  // },
});
// 타임라인 숫자 및 점선
export const Timeline = styled.div({
  position: "relative",
  ...CENTERED_FLEX,
  flex: "0 0 28px",
  width: "28px",
  minWidth: "28px",
  alignSelf: "stretch",

  '&[data-edit-mode="true"]::after': { display: "none" },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    bottom: "-50%",
    left: "50%",
    transform: "translateX(-50%)",
    borderLeft: "2px dashed #58B6B1",
    zIndex: 0,
    pointerEvents: "none",
  },

  "@media (max-width: 1023px)": {
    flex: "0 0 26px",
    width: "26px",
    minWidth: "26px",
  },

  "@media (max-width: 767px)": {
    flex: "0 0 22px",
    width: "22px",
    minWidth: "22px",
  },
});

export const TimelineDot = styled.span({
  position: "relative",
  zIndex: 1,
  ...CENTERED_FLEX,
  width: "26px",
  height: "26px",
  flexShrink: 0,
  borderRadius: "50%",
  backgroundColor: "#006D70",
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 700,

  "@media (max-width: 1023px)": {
    width: "25px",
    height: "25px",
    fontSize: "12px",
  },

  "@media (max-width: 767px)": {
    width: "22px",
    height: "22px",
    fontSize: "11px",
    backgroundColor: "#005259",
  },
});
// 일정 카드
export const StopCard = styled.div({
  '&[data-expanded="true"]': {
    borderColor: "#00858A",
    borderRadius: "10px 10px 0 0",
    backgroundColor: "#F2FAF9",
  },
  position: "relative",
  display: "flex",
  alignItems: "center",
  flex: 1,
  gap: "10px",
  minWidth: 0,
  minHeight: "104px",
  padding: "10px",
  border: "1px solid #E2E6E9",
  borderRadius: "10px",
  backgroundColor: "#FFFFFF",
  transition: "border-color 160ms ease, box-shadow 160ms ease",
  "@media (hover: hover)": { "&:hover": { borderColor: "#B5D7D5" } },
  "@media (max-width: 1023px)": { gap: "8px", padding: "10px" },
  "@media (max-width: 767px)": {
    display: "block",
    gap: 0,
    padding: "130px 0 0",
    minHeight: "130px",
    boxSizing: "border-box",
    border: 0,
    borderRadius: "16px",
    backgroundColor: "#173D3F",
    isolation: "isolate",
    '&[data-expanded="true"]': {
      borderRadius: "16px",
      backgroundColor: "#F2FAF9",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      inset: "0 0 auto",
      height: "130px",
      zIndex: 1,
      borderRadius: "16px",
      pointerEvents: "none",
      background:
        "linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,.08) 35%, rgba(0,0,0,.82) 100%)",
    },
    "& > [data-stop-image]": {
      display: "block",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "130px",
      borderRadius: "16px",
      objectFit: "cover",
      zIndex: 0,
    },
    "& > [data-stop-time]": {
      position: "absolute",
      top: "14px",
      left: "14px",
      zIndex: 2,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      width: "auto",
      height: "auto",
      color: "#FFF",
      fontSize: "14px",
      lineHeight: 1.4,
    },
    "& > [data-stop-time] > span:first-of-type": {
      padding: "5px 8px",
      borderRadius: "7px",
      backgroundColor: "rgba(0,0,0,.78)",
      color: "#FFF",
      fontWeight: 600,
    },
    "& > [data-stop-details]": {
      position: "absolute",
      bottom: "auto",
      top: "42px",
      left: "16px",
      right: "16px",
      zIndex: 2,
      height: "72px",
      padding: 0,
      justifyContent: "flex-end",
      gap: 0,
      pointerEvents: "none",
    },
    "& > [data-stop-details] strong": {
      color: "#FFF",
      fontSize: "22px",
      fontWeight: 700,
      lineHeight: 1.35,
      textShadow: "0 2px 6px rgba(0,0,0,.65)",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    "& > [data-stop-details] > div > span, & > [data-stop-details] > small": {
      display: "none",
    },
    "& > button": {
      top: 0,
      left: 0,
      right: 0,
      bottom: "auto",
      height: "130px",
      zIndex: 3,
      borderRadius: "16px",
    },
  },
});

export const StopTime = styled.span({
  flex: "0 0 48px",
  fontSize: "16px",
  color: "#4E5B5C",
  whiteSpace: "nowrap",

  "@media (max-width: 1023px)": {
    flex: "0 0 42px",
    fontSize: "14px",
  },

  "@media (max-width: 767px)": {
    flex: "0 0 35px",
    width: "35px",
    height: "auto",
    fontSize: "11px",
    lineHeight: 1.4,
    whiteSpace: "nowrap",
  },
});

export const StopImage = styled.img({
  width: "108px",
  height: "82px",
  flexShrink: 0,
  borderRadius: "10px",
  objectFit: "cover",
  backgroundColor: "#F0F5F4",
  "@media (max-width: 1023px)": {
    width: "96px",
    height: "76px",
  },
  "@media (max-width: 767px)": {
    width: "72px",
    height: "64px",
  },
});

export const StopDetails = styled.div({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
  gap: "14px",
  padding: "14px 0",
  "& strong": {
    fontSize: "17px",
    fontWeight: 700,
    lineHeight: 1.4,
    color: "#172324",
    overflowWrap: "anywhere",
  },
  "& > small": {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    minWidth: 0,
    fontSize: "16px",
    lineHeight: 1.4,
    color: "#596D75",
    whiteSpace: "nowrap",
  },
  "& .stop-address-text": {
    display: "block",
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& > small svg": {
    width: "14px",
    height: "14px",
    flexShrink: 0,
    marginTop: 0,
  },
  "@media (max-width: 1023px)": {
    gap: "12px",
    padding: "12px 0",
    "& strong": { fontSize: "16px" },
    "& > small": { fontSize: "15px" },
  },
  "@media (max-width: 767px)": {
    gap: "10px",
    padding: "10px 0",
    "& strong": { fontSize: "14px" },
    "& > small": { fontSize: "14px" },
  },
});
export const StopTitleLine = styled.div({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "8px",
  minWidth: 0,
});
export const StopCategoryBadge = styled.span<{ $category: string }>(
  ({ $category }) => {
    const tones: Record<string, { backgroundColor: string; color: string }> = {
      관광지: { backgroundColor: "#DDF5F0", color: "#087C78" },
      맛집: { backgroundColor: "#FFF0E6", color: "#9A5131" },
      카페: { backgroundColor: "#F8EEDB", color: "#82602B" },
      숙소: { backgroundColor: "#EEE4FA", color: "#73509D" },
      쇼핑: { backgroundColor: "#FBE9EF", color: "#9B526E" },
      교통: { backgroundColor: "#E7EFF8", color: "#476E96" },
    };
    return {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      padding: "3px 8px",
      borderRadius: "5px",
      fontSize: "13px",
      fontWeight: 600,
      lineHeight: "18px",
      whiteSpace: "nowrap",
      ...(tones[$category] ?? tones.관광지),
    };
  },
);
// 카드 오른쪽 액션
export const StopActions = styled.div({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  flexShrink: 0,

  "@media (max-width: 767px)": {
    flex: "0 0 25px",
    width: "25px",
    gap: "3px",
  },
});

export const MoreButton = styled.button({
  ...CENTERED_FLEX,
  width: "30px",
  height: "22px",
  border: "none",
  backgroundColor: "transparent",
  color: "#263536",

  "&:hover": {
    color: "#00787B",
  },
});

export const CategoryCircle = styled.div({
  ...CENTERED_FLEX,
  width: "35px",
  height: "35px",
  border: "1px solid #E1E9E9",
  borderRadius: "50%",
  backgroundColor: "#FFFFFF",
  color: "#007477",

  "@media (max-width: 1023px)": {
    width: "32px",
    height: "32px",

    svg: {
      width: "17px",
      height: "17px",
    },
  },

  "@media (max-width: 767px)": {
    width: "25px",
    height: "25px",

    "& svg": {
      width: "13px",
      height: "13px",
    },
  },
});

export const ActionMenu = styled.div({
  position: "absolute",
  top: "25px",
  right: 0,
  zIndex: 30,
  display: "flex",
  flexDirection: "column",
  width: "105px",
  padding: "5px",
  border: "1px solid #E4EAEA",
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
});

export const ActionMenuButton = styled.button<{
  $danger?: boolean;
}>(({ $danger }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  padding: "9px 10px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "transparent",
  color: $danger ? "#D34A4A" : "#263536",
  fontSize: "12px",
  textAlign: "left",

  "&:hover": {
    backgroundColor: $danger ? "#FFF2F2" : "#EFF8F8",
  },
}));
// 장소 추가
export const AddPlaceButton = styled.button({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  width: "100%",
  minHeight: "58px",
  marginTop: "10px",
  border: "1px dashed #C8DFE4",
  borderRadius: "9px",
  backgroundColor: "#FFFFFF",
  color: "#004F53",

  "& > span": {
    fontSize: "11px",
    color: "#899497",
  },

  "&:hover": {
    backgroundColor: "#F2FAFA",
    borderColor: "#00888A",
  },
});

export const AddPlaceTitle = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "14px",
  fontWeight: 700,
});

export const AddForm = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "100%",
  marginTop: "12px",
  padding: "14px",
  border: "1px solid #DCE9E9",
  borderRadius: "10px",
  backgroundColor: "#F9FCFC",
});

export const AddFormHeading = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "4px",

  strong: {
    fontSize: "14px",
  },

  button: {
    display: "flex",
    padding: 0,
    border: "none",
    backgroundColor: "transparent",
  },
});

export const FormInput = styled.input({
  width: "100%",
  minHeight: "38px",
  padding: "8px 10px",
  border: "1px solid #DDE6E6",
  borderRadius: "6px",
  backgroundColor: "#FFFFFF",
  fontSize: "12px",
  outline: "none",

  "&:focus": {
    borderColor: "#008A8A",
  },
});

export const FormSelect = styled.select({
  width: "100%",
  minHeight: "38px",
  padding: "8px 34px 8px 10px",
  border: "1px solid #DDE6E6",
  borderRadius: "6px",
  backgroundColor: "#FFFFFF",
  color: "#182426",
  fontSize: "12px",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",

  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23182426' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "16px 16px",

  "&:focus": {
    borderColor: "#008A8A",
  },
});
// 지도 패널
export const MapPanel = styled.section({
  position: "relative",
  top: "auto",

  display: "flex",
  flexDirection: "column",
  alignSelf: "start",

  width: "100%",
  minWidth: 0,

  height: "650px",
  minHeight: "650px",
  maxHeight: "650px",
  flexShrink: 0,

  overflow: "hidden",
  borderRadius: "11px",
  backgroundColor: "#79D9E9",

  "@media (max-width: 1023px)": {
    height: "520px",
    minHeight: "520px",
    maxHeight: "520px",
  },

  '&[data-tablet-hidden="true"]': {
    display: "none",
  },

  "@media (max-width: 767px)": {
    position: "relative",
    width: "100%",
    height: "480px",
    minHeight: "480px",
    maxHeight: "480px",
    overflow: "hidden",
  },
});

export const MapToolbar = styled.div({
  position: "absolute",
  top: "12px",
  left: "10px",
  right: "10px",
  zIndex: 5,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minWidth: 0,

  "@media (min-width: 1024px) and (max-width: 1199px)": {
    top: "8px",
    left: "8px",
    right: "8px",
    gap: "6px",
  },

  "@media (max-width: 1023px)": {
    top: "8px",
    left: "8px",
    right: "8px",
    gap: "4px",
  },

  "@media (max-width: 767px)": {
    top: "10px",
    left: "8px",
    right: "8px",
    gap: "6px",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minWidth: 0,
    overflow: "visible",
  },
});

export const MapFilters = styled.div({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flex: "1 1 auto",
  minWidth: 0,
  paddingBottom: 0,

  overflowX: "auto",
  overflowY: "hidden",
  scrollbarWidth: "thin",
  scrollbarColor: "#9BC8C8 transparent",
  overscrollBehaviorX: "contain",

  "&::-webkit-scrollbar": {
    height: "4px",
  },

  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },

  "@media (max-width: 1023px)": {
    gap: "4px",
    minHeight: 0,
  },

  "@media (max-width: 767px)": {
    display: "none",
  },
});

export const FilterButton = styled.button<{
  $active: boolean;
}>(({ $active }) => ({
  ...CENTERED_FLEX,
  gap: "5px",
  height: "38px",
  minHeight: "38px",
  padding: "0 10px",
  border: "1px solid #DDE9E9",
  borderRadius: "7px",

  position: "relative",
  zIndex: 1,

  backgroundColor: $active ? "#005259" : "#FFFFFF",
  color: $active ? "#FFFFFF" : "#283638",

  transition:
    "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out",
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: 1,
  whiteSpace: "nowrap",
  flexShrink: 0,

  "&:hover": {
    backgroundColor: $active ? "#005259" : "#EAF7F7",
  },

  "@media (min-width: 1024px) and (max-width: 1199px)": {
    padding: "0 6px",
    gap: "3px",
  },

  "@media (max-width: 1023px)": {
    height: "32px",
    minHeight: "32px",
    padding: "0 7px",
    gap: "3px",
    fontSize: "12px",

    svg: {
      width: "14px",
      height: "14px",
    },
  },
}));

export const RouteToggle = styled.button<{ $active: boolean }>(
  ({ $active }) => ({
    ...CENTERED_FLEX,
    gap: "5px",
    height: "38px",
    minHeight: "38px",
    padding: "0 10px",
    flexShrink: 0,
    whiteSpace: "nowrap",

    border: "1px solid #006D70",
    borderRadius: "7px",

    // 경로 표시 상태에 따른 배경색
    backgroundColor: $active ? "#FFFFFF" : "#005259",
    color: $active ? "#000000" : "#FFFFFF",

    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1,

    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    cursor: "pointer",

    // 버튼 애니메이션
    transition:
      "background-color 0.3s ease, " +
      "color 0.3s ease, " +
      "transform 0.25s ease, " +
      "box-shadow 0.25s ease",

    // 아이콘 회전
    "& svg": {
      transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      transform: $active ? "rotate(0deg)" : "rotate(180deg)",
    },

    "&:hover": {
      backgroundColor: $active ? "#EFF8F8" : "#003E43",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,82,89,0.15)",
    },

    "&:active": {
      transform: "scale(0.96)",
    },

    // PC 작은 화면
    "@media (min-width: 1024px) and (max-width: 1199px)": {
      padding: "0 6px",
      gap: "3px",

      svg: {
        width: "16px",
        height: "16px",
        flexShrink: 0,
      },
    },

    "@media (max-width: 1023px)": {
      height: "32px",
      minHeight: "32px",
      padding: "0 7px",
      fontSize: "12px",
      gap: "3px",

      svg: {
        width: "12px",
        height: "12px",
      },
    },

    "@media (max-width: 767px)": {
      flex: "0 0 auto",
      height: "36px",
      minHeight: "36px",
      padding: "0 8px",
      gap: "4px",
      fontSize: "clamp(10px, 3vw, 12px)",
      borderRadius: "8px",

      "& svg": {
        width: "14px",
        height: "14px",
        flexShrink: 0,
      },
    },

    "@media (prefers-reduced-motion: reduce)": {
      transition: "none",

      "& svg": {
        transition: "none",
      },
    },
  }),
);

// 모바일 지도 카테고리 드롭다운
export const MobileFilterWrapper = styled.div({
  display: "none",

  "@media (max-width: 767px)": {
    position: "relative",
    display: "block",
    flex: "0 1 150px",
    minWidth: 0,
    zIndex: 10,
  },
});

export const MobileFilterTrigger = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "5px",
  width: "100%",
  height: "36px",
  padding: "0 9px",
  border: "1px solid #006D70",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#283638",
  fontSize: "12px",
  fontWeight: 700,
  whiteSpace: "nowrap",

  "& span": {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "left",
  },

  "& svg": {
    flexShrink: 0,
  },

  "&:hover": {
    backgroundColor: "#003E43",
  },
});

export const MobileFilterMenu = styled.div({
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  width: "100%",
  minWidth: "145px",
  padding: "5px 0",
  border: "1px solid #E3EBEC",
  borderRadius: "10px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
  zIndex: 20,
});

export const MobileFilterOption = styled.button<{
  $active: boolean;
}>(({ $active }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  minHeight: "38px",
  padding: "0 12px",
  border: "none",
  backgroundColor: $active ? "#EAF7F6" : "#FFFFFF",
  color: "#000",
  fontSize: "12px",
  fontWeight: $active ? 700 : 500,
  textAlign: "left",
  cursor: "pointer",

  "& svg": {
    flexShrink: 0,
  },

  "&:hover": {
    backgroundColor: "#EAF7F6",
  },
}));
// 지도 배경
export const MapCanvas = styled.div({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  backgroundColor: "#76DCEB",
  backgroundImage:
    "radial-gradient(circle at 30% 30%, #A2ECF0 0%, transparent 45%), linear-gradient(135deg, #5FD0E8, #8AE5EF)",
});

export const MapContent = styled.div({
  position: "absolute",
  inset: 0,
  transform: "scale(var(--map-zoom, 1))",
  transformOrigin: "center",
  transition: "transform 0.25s ease",
});

export const IslandShape = styled.div({
  position: "absolute",
  top: "25%",
  left: "4%",
  width: "92%",
  height: "58%",
  backgroundColor: "#C5E8AF",
  border: "9px solid #E3E9B4",
  borderRadius: "49% 51% 45% 55% / 55% 40% 60% 45%",
  transform: "rotate(-12deg)",
  boxShadow: "0 0 0 4px rgba(255,255,255,0.2) inset",
  backgroundImage:
    "repeating-linear-gradient(30deg, transparent 0px, transparent 35px, rgba(255,255,255,0.35) 36px, transparent 38px), radial-gradient(ellipse at center, #A6D68E 0%, #D7EFB8 70%)",

  "@media (min-width: 1024px) and (max-width: 1199px)": {
    top: "18%",
    left: "5%",
    width: "90%",
    height: "68%",
  },
});

export const MapLabel = styled.span<{
  $x: number;
  $y: number;
}>(({ $x, $y }) => ({
  position: "absolute",
  left: `${$x}%`,
  top: `${$y}%`,
  zIndex: 1,
  fontSize: "13px",
  fontWeight: 700,
  color: "#345C50",
  textShadow: "0 1px 2px #FFFFFF",
  pointerEvents: "none",
}));

export const RouteSvg = styled.svg({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 2,
  pointerEvents: "none",
});
// 지도 장소 마커
export const MapMarker = styled.div<{
  $x: number;
  $y: number;
}>(({ $x, $y }) => ({
  position: "absolute",
  left: `${$x}%`,
  top: `${$y}%`,
  zIndex: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
  transform: "translate(-50%, -50%)",
}));

export const MarkerNumber = styled.div({
  ...CENTERED_FLEX,
  width: "27px",
  height: "27px",
  border: "2px solid #FFFFFF",
  borderRadius: "50%",
  backgroundColor: "#00565A",
  color: "#FFFFFF",
  fontSize: "12px",
  fontWeight: 700,
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
});

export const MarkerCard = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  width: "94px",
  padding: "5px",
  border: "2px solid #FFFFFF",
  borderRadius: "9px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 3px 10px rgba(0,0,0,0.12)",

  img: {
    width: "100%",
    height: "45px",
    objectFit: "cover",
    borderRadius: "5px",
  },

  strong: {
    maxWidth: "100%",
    fontSize: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  span: {
    fontSize: "10px",
    color: "#566466",
  },

  "@media (min-width: 1024px) and (max-width: 1199px)": {
    width: "76px",
    padding: "4px",

    img: {
      height: "36px",
    },

    strong: {
      fontSize: "9px",
    },

    span: {
      fontSize: "9px",
    },
  },

  "@media (max-width: 1023px)": {
    width: "85px",

    img: {
      height: "40px",
    },

    strong: {
      fontSize: "9px",
    },

    span: {
      fontSize: "9px",
    },
  },
});

export const MapZoomControls = styled.div({
  position: "absolute",
  right: "12px",
  bottom: "35px",
  zIndex: 6,
  display: "flex",
  flexDirection: "column",
  padding: "5px",
  borderRadius: "9px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",

  button: {
    ...CENTERED_FLEX,
    width: "30px",
    height: "32px",
    padding: 0,
    border: "none",
    backgroundColor: "transparent",
    color: "#233638",

    "&:hover": {
      backgroundColor: "#EEF8F8",
    },
  },

  "@media (max-width: 1023px)": {
    right: "8px",
    bottom: "25px",

    button: {
      width: "27px",
      height: "29px",
    },
  },
});
// 일정 수정 모달
export const EditOverlay = styled.div({
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  ...CENTERED_FLEX,
  padding: "20px",
  backgroundColor: "rgba(0,0,0,0.4)",
});

export const EditModal = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "100%",
  maxWidth: "430px",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: "24px",
  borderRadius: "14px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
});

export const EditModalHeader = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  h3: {
    margin: 0,
    fontSize: "19px",
    fontWeight: 700,
  },

  button: {
    display: "flex",
    padding: "4px",
    border: "none",
    backgroundColor: "transparent",
  },
});

export const EditField = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "7px",

  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#344344",
  },
});

export const EditModalActions = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
  marginTop: "8px",
});
// 예산 / 체크리스트 임시 화면
export const EmptyPanel = styled.section({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  minHeight: "420px",
  border: "1px solid #E8EEEE",
  borderRadius: "11px",
  backgroundColor: "#FFFFFF",
  color: "#006D70",

  h2: {
    margin: 0,
    fontSize: "20px",
    color: "#202A2C",
  },

  p: {
    margin: 0,
    fontSize: "13px",
    color: "#7A8788",
    textAlign: "center",
  },
});
/* 모바일 전용 헤더 */
export const MobileHeaderArea = styled.div({
  display: "none",

  "@media (max-width: 767px)": {
    display: "block",
    position: "relative",
    width: "100%",
    minHeight: "68px",
    flexShrink: 0,
    zIndex: 50,
  },
});

/* 모바일 전용 하단 내비게이션 */
export const MobileNavArea = styled.div({
  display: "none",

  "@media (max-width: 767px)": {
    display: "block",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    width: "100%",
  },
});

export const ShareLabel = styled.span({
  "@media (max-width: 767px)": {
    display: "none",
  },
});

export const EditActionGroup = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

export const CancelEditButton = styled.button({
  ...CENTERED_FLEX,
  minHeight: "40px",
  padding: "8px 16px",
  border: "1px solid #D6E2E4",
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  color: "#243437",
  fontSize: "15px",
  fontWeight: 600,
  whiteSpace: "nowrap",

  "&:hover": {
    backgroundColor: "#F3F8F8",
  },

  "@media (max-width: 767px)": {
    height: "30px",
    padding: "0 10px",
    borderRadius: "6px",
    fontSize: "11px",
  },
});

export const SaveEditButton = styled.button({
  ...CENTERED_FLEX,
  gap: "4px",
  height: "30px",
  padding: "0 10px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#005259",
  color: "#FFFFFF",
  fontSize: "11px",
  fontWeight: 700,
  whiteSpace: "nowrap",
});

export const DesktopEditAction = styled.div({
  "@media (max-width: 1023px)": {
    display: "flex",
    flex: "0 0 auto",
    width: "auto",
    minWidth: 0,
    marginLeft: 0,
    maxWidth: "100%",
    justifyContent: "flex-start",
    // justifyContent: "flex-end",
  },

  "@media (max-width: 767px)": {
    display: "none",
  },
});

export const MobileEditAction = styled.div({
  display: "none",

  "@media (max-width: 767px)": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: "0 0 100%",
    width: "100%",
    minWidth: 0,
  },
});

export const TripNameEditor = styled.div({
  flex: "1 1 auto",
  minWidth: 0,
  maxWidth: "100%",

  "& .trip-name-controls": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },

  "& input": {
    flex: "1 1 0",
    width: "100%",
    minWidth: 0,
    maxWidth: "420px",
    padding: "3px 6px",
    border: "1px solid #527F79",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#0D3E41",
    fontSize: "22px",
    fontWeight: 700,
    lineHeight: 1.4,

    "&:focus-visible": {
      outline: "2px solid #527F79",
      outlineOffset: "2px",
    },

    '&[aria-invalid="true"]': {
      borderColor: "#C74435",
    },

    "&:disabled": {
      opacity: 0.65,
    },
  },

  "& button.trip-name-confirm, & button.trip-name-cancel": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "34px",
    height: "34px",
    padding: "7px",
    border: "1px solid transparent",
    borderRadius: "8px",
    transition:
      "background-color 180ms ease, color 180ms ease, border-color 180ms ease",

    "& svg": {
      width: "18px",
      height: "18px",
      strokeWidth: 2.2,
    },

    "&:focus-visible": {
      outline: "2px solid currentColor",
      outlineOffset: "3px",
    },

    "&:disabled": {
      cursor: "wait",
      opacity: 0.5,
    },
  },

  "& button.trip-name-confirm": {
    color: "#237348",
    backgroundColor: "#E8F5EC",
    borderColor: "#C6E5D1",
  },

  "& button.trip-name-cancel": {
    color: "#C74435",
    backgroundColor: "#FDEDEB",
    borderColor: "#F3CCC6",
  },

  "@media (hover: hover) and (pointer: fine)": {
    "& button.trip-name-confirm:hover:not(:disabled)": {
      color: "#fff",
      backgroundColor: "#237348",
      borderColor: "#237348",
    },

    "& button.trip-name-cancel:hover:not(:disabled)": {
      color: "#fff",
      backgroundColor: "#C74435",
      borderColor: "#C74435",
    },
  },

  "& .trip-name-error": {
    margin: "8px 0 0",
    color: "#C74435",
    fontSize: "16px",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },

  "@media (max-width: 1023px)": {
    "& input": {
      fontSize: "20px",
    },

    "& .trip-name-error": {
      fontSize: "15px",
    },
  },

  "@media (max-width: 767px)": {
    "& input": {
      fontSize: "18px",
    },

    "& .trip-name-error": {
      fontSize: "14px",
    },
  },
});

// 일정이 없는 날짜의 빈 상태
export const EmptyState = styled.div`
  grid-column: 1 / -1;
  width: 100%;
  ${CENTERED_FLEX};
  flex-direction: column;
  gap: 16px;
  padding: 32px 16px 40px;
  text-align: center;
  @media (min-width: 768px) {
    padding: 40px 24px 48px;
  }
`;
export const Illustration = styled.img`
  display: block;
  width: min(100%, 320px);
  height: 190px;
  object-fit: contain;
  @media (max-width: 767px) {
    height: 150px;
    width: min(100%, 250px);
  }
`;
export const Title = styled.h3`
  color: #00545b;
  font-size: 20px;
  font-weight: 700;
  @media (min-width: 768px) {
    font-size: 24px;
  }
  @media (min-width: 1024px) {
    font-size: 28px;
  }
`;
export const Description = styled.p`
  color: #667b84;
  font-size: 16px;
  @media (min-width: 768px) {
    font-size: 17px;
  }
  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;
export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 48px;
  min-width: 220px;
  padding: 12px 24px;
  margin-top: 8px;
  border-radius: 12px;
  background: #00565e;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  transition:
    background-color 160ms ease,
    transform 160ms ease;
  @media (min-width: 1024px) {
    font-size: 17px;
  }
  @media (hover: hover) {
    &:hover {
      background: #00727b;
      transform: translateY(-2px);
    }
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: 3px solid #67cbd0;
    outline-offset: 4px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const TripNameMenuAnchor = styled.div({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
});

export const TripEditButton = styled.button({
  ...CENTERED_FLEX,
  gap: "6px",
  minHeight: "34px",
  padding: "0px 6px",
  // padding: "6px 10px",
  // border: "1px dashed #C9DBDF",
  borderRadius: "999px",
  backgroundColor: "#FFFFFF",
  color: "#004F53",
  fontSize: "16px",
  fontWeight: 600,
  whiteSpace: "nowrap",
  transition: "background-color 160ms ease, border-color 160ms ease",
  "& svg": { flexShrink: 0 },
  "@media (min-width: 768px) and (hover: hover)": {
    "&:hover": { backgroundColor: "#EFFAFA" },
  },
  "&:focus-visible": { outline: "2px solid #527F79", outlineOffset: "3px" },
  "@media  (max-width: 1023px)": { fontSize: "15px" },
  "@media (max-width: 767px)": {
    minHeight: "28px",
    width: "28px",
    padding: "4px",
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
});

export const TripNamePopoverPosition = styled.div({
  position: "absolute",
  zIndex: 100,
  top: 0,
  left: "calc(100% + 12px)",
  transform: "none",
  width: "220px",
  "@media (max-width: 767px)": {
    top: "100%",
    left: "50%",
    right: "auto",
    transform: "translateX(-50%)",
    width: "190px",
  },
});

export const TripNamePopover = styled.div({
  ...dropdownAnimation,
  width: "100%",
  padding: "8px",
  borderRadius: "16px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 10px 32px rgba(13, 62, 65, 0.16)",
});

export const TripNameMenuItem = styled.button({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  width: "100%",
  padding: "14px 12px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "transparent",
  color: "#203D40",
  fontSize: "16px",
  fontWeight: 500,
  textAlign: "left",
  transition: "background-color 160ms ease",
  "& svg": { flexShrink: 0 },
  "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
  "&.trip-menu-delete": {
    color: "#C54848",
    borderTop: "1px solid #E2E6E9",
    borderRadius: "0 0 10px 10px",
    marginTop: "4px",
  },
  "&:focus-visible": { outline: "2px solid #527F79", outlineOffset: "2px" },
  "@media (hover: hover)": {
    "&:hover:not(:disabled)": { backgroundColor: "#EDF6F3" },
  },
  "@media (max-width: 767px)": { padding: "12px 10px", fontSize: "14px" },
});

export const MobileNameDialog = styled.dialog(
  {
    width: "100%",
    maxWidth: "100%",
    maxHeight: "calc(100dvh - 16px)",
    margin: "auto 0 0",
    padding: 0,
    border: 0,
    borderRadius: "22px 22px 0 0",
    backgroundColor: "#FFFFFF",
    color: "#0D3E41",
    overflowY: "auto",
    "&::backdrop": { backgroundColor: "rgba(13, 35, 39, 0.38)" },
    "& form": { padding: "12px 20px max(24px, env(safe-area-inset-bottom))" },
    "& .name-sheet-handle": {
      width: "38px",
      height: "4px",
      margin: "0 auto 18px",
      borderRadius: "4px",
      backgroundColor: "#D8E3DF",
    },
    "& header": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
    },
    "& h2": { margin: 0, fontSize: "21px", fontWeight: 700 },
    "& button": {
      font: "inherit",
      border: 0,
      borderRadius: "10px",
      color: "#0D5357",
      backgroundColor: "#EDF5F2",
      cursor: "pointer",
    },
    "& .name-sheet-close": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "44px",
      height: "44px",
      backgroundColor: "transparent",
    },
    "& .name-sheet-description": {
      margin: "8px 0 24px",
      fontSize: "14px",
      color: "#718596",
      lineHeight: 1.6,
    },
    "& label": {
      display: "block",
      marginBottom: "10px",
      fontSize: "14px",
      fontWeight: 600,
    },
    "& .name-sheet-input-wrap": {
      display: "flex",
      alignItems: "center",
      border: "1px solid #D4DFE5",
      borderRadius: "10px",
      paddingRight: "3px",
    },
    "& .name-sheet-input-wrap:focus-within": {
      borderColor: "#527F79",
      outline: "2px solid #527F79",
      outlineOffset: "2px",
    },
    "& .name-sheet-clear": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "44px",
      height: "44px",
      flexShrink: 0,
      backgroundColor: "transparent",
      color: "#718596",
    },
    "& input": {
      width: "100%",
      minWidth: 0,
      minHeight: "50px",
      padding: "12px",
      border: 0,
      borderRadius: "10px",
      backgroundColor: "#FFFFFF",
      color: "#0D3E41",
      font: "inherit",
      fontSize: "16px",
    },
    '& input[aria-invalid="true"]': { borderColor: "#C54848" },
    "& .name-sheet-caption": {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      marginTop: "9px",
      fontSize: "14px",
      color: "#718596",
      lineHeight: 1.5,
    },
    '& [role="alert"]': { color: "#C54848" },
    "& footer": { display: "flex", gap: "10px", marginTop: "26px" },
    "& footer button": {
      flex: 1,
      minHeight: "48px",
      padding: "12px",
      fontSize: "16px",
      fontWeight: 600,
    },
    "& footer .name-sheet-save": {
      flex: 2,
      backgroundColor: "#005358",
      color: "#FFFFFF",
    },
    "& button:disabled": { opacity: 0.45, cursor: "not-allowed" },
    "& input:focus-visible": { outline: "none" },
    "& button:focus-visible": {
      outline: "2px solid #527F79",
      outlineOffset: "2px",
    },

    // 데스크톱·태블릿: 모바일 구성은 유지하고 중앙 모달로 배치합니다.
    "@media (min-width: 768px)": {
      position: "fixed",
      inset: 0,
      width: "calc(100% - 48px)",
      maxWidth: "500px",
      maxHeight: "calc(100dvh - 48px)",
      margin: "auto",
      borderRadius: "22px",
      overscrollBehavior: "contain",
      boxShadow: "0 18px 60px rgba(13, 62, 65, 0.18)",
      "& form": { padding: "28px 32px 32px" },
      "& .name-sheet-handle": { display: "none" },
      "& h2": { fontSize: "24px", lineHeight: 1.4 },
      "& .name-sheet-description": {
        margin: "12px 0 30px",
        fontSize: "16px",
      },
      "& label": { fontSize: "16px", marginBottom: "12px" },
      "& input": { minHeight: "56px", padding: "14px 16px" },
      "& .name-sheet-caption": { marginTop: "10px", fontSize: "16px" },
      "& footer": { gap: "12px", marginTop: "32px" },
      "& footer button": { minHeight: "56px", fontSize: "18px" },
      "& button": { transition: "background-color 160ms ease" },
      "@media (hover: hover)": {
        "& .name-sheet-close:hover:not(:disabled), & .name-sheet-clear:hover:not(:disabled)":
          {
            backgroundColor: "#EDF5F2",
          },
        "& footer button:hover:not(:disabled)": { backgroundColor: "#DFEDE7" },
        "& footer .name-sheet-save:hover:not(:disabled)": {
          backgroundColor: "#004448",
        },
      },
    },
  },
  modalAnimation,
);

// 여행 상세 페이지 전용 삭제 확인창
export const TripDeleteDialog = styled.dialog(modalAnimation, {
  position: "fixed",
  inset: 0,
  width: "calc(100% - 40px)",
  maxWidth: 420,
  maxHeight: "calc(100dvh - 40px)",
  margin: "auto",
  padding: 0,
  overflowY: "auto",
  overscrollBehavior: "contain",
  border: 0,
  borderRadius: 18,
  backgroundColor: "#FFFFFF",
  color: "#0D3E41",
  boxShadow: "0 18px 60px rgba(13, 62, 65, .18)",
  "&::backdrop": { backgroundColor: "rgba(13, 62, 65, .35)" },
  "& .trip-delete-content": { position: "relative", padding: "52px 26px 24px" },
  "& .trip-delete-handle": { display: "none" },
  "& button:disabled": { opacity: 0.5, cursor: "not-allowed" },
  "& button:focus-visible": { outline: "2px solid #527F79", outlineOffset: 3 },
  "& .trip-delete-close": {
    position: "absolute",
    top: 12,
    right: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    padding: 0,
    border: 0,
    borderRadius: 8,
    backgroundColor: "transparent",
    color: "#718596",
  },
  "& .trip-delete-heading": { display: "flex", alignItems: "center", gap: 12 },
  "& .trip-delete-icon": {
    display: "block",
    width: 28,
    height: 28,
    flexShrink: 0,
    color: "#E34935",
  },
  "& h2": {
    margin: 0,
    minWidth: 0,
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  "& .trip-delete-name": {
    margin: "26px 0 8px",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },
  "& .trip-delete-description": {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.6,
    color: "#596D75",
  },
  "& .trip-delete-warning": {
    marginTop: 22,
    padding: "14px 16px",
    borderRadius: 10,
    backgroundColor: "#FFF0F0",
    color: "#D44332",
    fontSize: 14,
    lineHeight: 1.7,
    "& p": { margin: 0 },
  },
  "& .trip-delete-error": {
    margin: "12px 0 0",
    color: "#BD3E3E",
    fontSize: 14,
    lineHeight: 1.6,
  },
  "& .trip-delete-actions": { display: "flex", gap: 12, marginTop: 18 },
  "& .trip-delete-actions button": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    padding: "12px 14px",
    border: 0,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    transition: "background-color 160ms ease",
  },
  "& .trip-delete-cancel": { backgroundColor: "#E7F4F2", color: "#0D3E41" },
  "& .trip-delete-confirm": { backgroundColor: "#E34935", color: "#FFFFFF" },
  "@media (hover: hover)": {
    "& .trip-delete-close:hover:not(:disabled)": { backgroundColor: "#F0F5F3" },
    "& .trip-delete-cancel:hover:not(:disabled)": {
      backgroundColor: "#D8EBE6",
    },
    "& .trip-delete-confirm:hover:not(:disabled)": {
      backgroundColor: "#C83C2A",
    },
  },
  "@media (max-width: 1023px)": {
    "& .trip-delete-description": { fontSize: 15 },
  },
  "@media (max-width: 767px)": {
    top: "auto",
    bottom: 0,
    width: "100%",
    maxWidth: "none",
    maxHeight: "calc(100dvh - 24px)",
    margin: 0,
    borderRadius: "24px 24px 0 0",
    "& .trip-delete-content": {
      padding: "56px 24px calc(28px + env(safe-area-inset-bottom))",
    },
    "& .trip-delete-handle": {
      display: "block",
      position: "absolute",
      top: 12,
      left: "50%",
      transform: "translateX(-50%)",
      width: 40,
      height: 4,
      borderRadius: 4,
      backgroundColor: "#D3DADD",
    },
    "& .trip-delete-close": { top: 14, right: 12 },
    "& .trip-delete-heading": { gap: 10 },
    "& h2": { fontSize: 20 },
    "& .trip-delete-icon": { width: 26, height: 26 },
    "& .trip-delete-name": { fontSize: 17 },
    "& .trip-delete-description": { fontSize: 14 },
    "& .trip-delete-warning": { fontSize: 14 },
    "& .trip-delete-actions button": { fontSize: 14 },
  },
});

// 편집모드: 일정 목록과 경로 지도만 나란히 배치합니다.
export const StopCheckbox = styled.input({
  appearance: "none",
  width: "22px",
  height: "22px",
  margin: 0,
  border: "1.5px solid #718596",
  borderRadius: "5px",
  backgroundColor: "#FFF",
  cursor: "pointer",
  position: "relative",
  zIndex: 1,
  flexShrink: 0,
  "&:checked": { backgroundColor: "#007C80", borderColor: "#007C80" },
  "&:checked::after": {
    content: '""',
    position: "absolute",
    left: "6px",
    top: "2px",
    width: "6px",
    height: "11px",
    border: "solid white",
    borderWidth: "0 2px 2px 0",
    transform: "rotate(45deg)",
  },
  "&:focus-visible": { outline: "3px solid #9ACAC5", outlineOffset: "3px" },
});

export const BatchActions = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
  "& > .add-place-action": { order: -1 },

  "@media (max-width: 1023px)": {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(64px, 1fr))",
    width: "max-content",
    maxWidth: "100%",
    minWidth: 0,
    alignItems: "stretch",
    gap: "10px",

    "& > .add-place-action": {
      order: 0,
      gridColumn: "1 / -1",
      gridRow: "2",
      width: "100%",
      boxSizing: "border-box",
    },
    "& > :not(.add-place-action)": {
      gridRow: "1",
      minWidth: 0,
    },
    "& > div": { padding: 0 },
    "&& .sort-trigger": {
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
    },
  },
});

export const BatchButton = styled.button<{ $danger?: boolean }>(
  ({ $danger }) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    minHeight: "40px",
    padding: "8px 14px",
    borderRadius: "8px",
    backgroundColor: "#FFF",
    border: `1px solid ${$danger ? "#E78686" : "#00858A"}`,
    color: $danger ? "#D94E4E" : "#007A80",
    fontSize: "16px",
    fontWeight: 600,
    "&:disabled": { opacity: 0.4, cursor: "default" },
    "&:focus-visible": { outline: "3px solid #9ACAC5", outlineOffset: "2px" },
    "@media (hover: hover)": {
      "&:hover:not(:disabled)": {
        backgroundColor: $danger ? "#FFF5F5" : "#F2FAF8",
      },
    },
    "@media (max-width: 767px)": {
      minHeight: "38px",
      fontSize: "14px",
      padding: "7px 10px",
    },
  }),
);
export const BatchMoveDropdown = styled.div({
  "&& .sort-trigger": {
    padding: "8px 14px",
    minHeight: "40px",
    border: "1px solid #00858A",
    borderRadius: "8px",
    color: "#007A80",
    fontSize: "16px",
    fontWeight: 600,
    gap: 0,
  },
  "& .sort-trigger:disabled": { opacity: 0.4 },
  "& .sort-trigger:focus-visible": {
    outline: "3px solid #9ACAC5",
    outlineOffset: "2px",
  },
  "& .dropdown-trigger-icon": {
    display: "none",
  },
  "@media (max-width: 767px)": {
    minHeight: "38px",
    fontSize: "14px",
    padding: "7px 10px",
  },
});

export const EditMapRoot = styled.div({
  position: "relative",
  width: "100%",
  height: "100%",
  ".route-map-marker": { position: "relative", width: "44px", height: "54px" },
  ".route-map-pin-number": {
    position: "absolute",
    top: "7px",
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#FFF",
    fontSize: "20px",
    fontWeight: 700,
    lineHeight: "28px",
    pointerEvents: "none",
  },
  ".route-map-pin:focus-visible": {
    outline: "3px solid #00858A",
    outlineOffset: "3px",
    borderRadius: "22px",
  },
  '.route-map-marker[data-active="true"] .route-map-pin': {
    filter: "drop-shadow(0 2px 4px rgba(13,62,65,.22))",
  },
  ".route-map-pin": {
    position: "relative",
    display: "block",
    width: "44px",
    height: "54px",
    transformOrigin: "50% 100%",
    // transition: "transform 160ms ease",
    filter: "drop-shadow(0 2px 3px rgba(13,62,65,.18))",
    transition: "transform 160ms ease, filter 160ms ease",
  },
  ".route-map-pin path": {
    transition: "fill 160ms ease",
  },
  "@media (hover: hover) and (pointer: fine)": {
    '.route-map-marker:not([data-selected="true"]) .route-map-pin:hover': {
      filter: "drop-shadow(0 3px 5px rgba(0, 124, 128, 0.3))",
    },

    '.route-map-marker:not([data-selected="true"]) .route-map-pin:hover path': {
      fill: "#399C9F",
    },
  },
  '.route-map-marker[data-selected="true"] .route-map-pin': {
    transform: "scale(1.2)",
  },
  '.route-map-marker[data-selected="true"] .route-map-pin path': {
    fill: "#EB654B",
  },
  '.route-map-marker[data-selected="true"] .route-map-tooltip': {
    bottom: "calc(120% + 8px)",
  },
  "@media (prefers-reduced-motion: reduce)": {
    ".route-map-pin": { transition: "none" },
  },
  ".route-map-tooltip": {
    position: "absolute",
    left: "50%",
    bottom: "calc(100% + 8px)",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    width: "max-content",
    maxWidth: "220px",
    whiteSpace: "normal",
    padding: "10px 14px",
    border: "1px solid #DCEBE9",
    borderRadius: "10px",
    backgroundColor: "#FFF",
    boxShadow: "0 3px 12px rgba(13,62,65,.16)",
    color: "#0D3E41",
    fontSize: "14px",
    zIndex: 30,
  },
  ".route-map-tooltip[hidden]": { display: "none" },
  ".route-map-tooltip strong": { fontSize: "15px", fontWeight: 700 },
  ".route-map-tooltip > span": { color: "#596D75" },
});
export const EditMapMessage = styled.div({
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  backgroundColor: "#FFF",
  padding: "20px",
  zIndex: 5,
});
export const EditMapNote = styled.div({
  position: "absolute",
  bottom: "8px",
  left: "8px",
  right: "70px",
  padding: "6px 8px",
  backgroundColor: "rgba(255,255,255,.94)",
  borderRadius: "6px",
  color: "#596D75",
  fontSize: "12px",
  zIndex: 4,
});

export const EditRouteFitButton = styled.button({
  position: "absolute",
  top: "14px",
  right: "14px",
  zIndex: 5,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 14px",
  backgroundColor: "#FFF",
  border: "1px solid #E2E6E9",
  borderRadius: "8px",
  color: "#0D3E41",
  fontSize: "16px",
  fontWeight: 600,
  boxShadow: "0 2px 8px rgba(13,62,65,.1)",
});

// 기본 상태에서는 방문 순서 핀만 표시하고 hover/focus/tap 시 상세를 엽니다.

export const SelectedStopDeleteDialog = styled.dialog({
  ...modalAnimation,
  position: "fixed",
  inset: 0,
  margin: "auto",
  width: "min(440px, calc(100vw - 32px))",
  maxHeight: "calc(100dvh - 32px)",
  overflowY: "auto",
  padding: "28px",
  border: "1px solid #E2E6E9",
  borderRadius: "18px",
  backgroundColor: "#FFF",
  color: "#0D3E41",
  boxShadow: "0 18px 60px rgba(13,62,65,.18)",
  "&::backdrop": { backgroundColor: "rgba(13,35,39,.38)" },
  "& .stop-delete-heading": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  "& .stop-delete-heading > svg": { color: "#D94E4E", flexShrink: 0 },
  "& h2": { fontSize: "20px", fontWeight: 700, lineHeight: 1.4 },
  "& p": { marginTop: "16px", fontSize: "16px", color: "#596D75" },
  "& .stop-delete-actions": {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "26px",
  },
  "& button": {
    minHeight: "42px",
    padding: "9px 20px",
    borderRadius: "8px",
    backgroundColor: "#EDF5F2",
    fontSize: "16px",
    fontWeight: 600,
  },
  "& button.danger": { backgroundColor: "#D94E4E", color: "#FFF" },
  "& button:focus-visible": {
    outline: "3px solid #9ACAC5",
    outlineOffset: "2px",
  },
  "@media (hover: hover)": {
    "& button:hover": { backgroundColor: "#DCEDE7" },
    "& button.danger:hover": { backgroundColor: "#BE3B3B" },
  },
  "@media (max-width: 767px)": {
    top: "auto",
    bottom: 0,
    width: "100%",
    maxHeight: "calc(100dvh - 24px)",
    margin: 0,
    borderRadius: "20px 20px 0 0",
    padding: "24px 20px calc(24px + env(safe-area-inset-bottom))",
    "& h2": { fontSize: "18px" },
  },
});

// Keeps the list and selection control in the same desktop grid cell.
export const ScheduleListArea = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minWidth: 0,
});

export const SelectAllRow = styled.label({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  minHeight: "40px",
  marginBottom: "10px",
  padding: "0 24px",
  boxSizing: "border-box",
  color: "#0D3E41",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
  "& > small": { color: "#718596", fontSize: "14px", fontWeight: 500 },
  "& > input:indeterminate": {
    backgroundColor: "#007C80",
    borderColor: "#007C80",
  },
  "& > input:indeterminate::after": {
    content: '""',
    position: "absolute",
    left: "4px",
    right: "4px",
    top: "50%",
    height: "2px",
    backgroundColor: "#FFFFFF",
    transform: "translateY(-50%)",
  },
  "@media (min-width: 768px) and (max-width: 1023px)": {
    padding: "0 0 0 29px",
    fontSize: "15px",
  },
  "@media (max-width: 767px)": {
    padding: "0 0 0 17px",
    fontSize: "14px",
  },
});

export const AddPlaceButtonLabel = styled.span({
  "& .compact-label": { display: "none" },
  "@media (max-width: 767px)": {
    "& .desktop-label": { display: "none" },
    "& .compact-label": { display: "inline" },
  },
});

// 편집 아코디언: 문서 흐름의 높이는 유지하고 아래 일정 위에 겹칩니다.
export const StopExpandTrigger = styled.button({
  position: "absolute",
  inset: 0,
  zIndex: 1,
  width: "100%",
  height: "100%",
  padding: 0,
  border: 0,
  borderRadius: "inherit",
  background: "transparent",
  cursor: "pointer",
  "&:focus-visible": { outline: "2px solid #527F79", outlineOffset: 3 },
});
export const StopEditor = styled.div({
  ...dropdownAnimation,
  position: "absolute",
  top: "100%",
  left: -1,
  right: -1,
  zIndex: 2,
  padding: "18px",
  border: "1px solid #00858A",
  borderTop: "1px solid #DCEBE9",
  borderRadius: "0 0 10px 10px",
  backgroundColor: "#F2FAF9",
  boxShadow: "0 10px 18px rgba(13,62,65,.12)",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  color: "#0D3E41",
  fontSize: "16px",
  "& small": {
    display: "block",
    marginTop: 8,
    color: "#718596",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  "@media (max-width: 1023px)": { fontSize: "15px" },
  "@media (max-width: 767px)": {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    width: "100%",
    margin: 0,
    boxSizing: "border-box",
    padding: "16px",
    gap: "16px",
    fontSize: "14px",
    border: 0,
    borderTop: "1px solid #DCEBE9",
    borderRadius: "0 0 16px 16px",
    boxShadow: "0 10px 18px rgba(13,62,65,.12)",
  },
});
export const StopEditorRow = styled.div({
  display: "grid",
  gridTemplateColumns: "112px minmax(0, 1fr)",
  alignItems: "center",
  gap: "8px",
  "& > span": { fontWeight: 600 },
  "@media (max-width: 767px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: "8px",
  },
});
export const StopTimePickerField = styled.div({
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  "& > div": { width: "100%", minWidth: 0 },
  "&& .picker-trigger": {
    width: "100%",
    minWidth: 0,
    minHeight: "50px",
    padding: "12px 14px",
    boxSizing: "border-box",
    gap: "10px",
  },
  "&& .picker-time-value": { whiteSpace: "nowrap", flex: 1, minWidth: 0 },
  "&& .picker-chevron": { display: "none" },
  "& .picker-popup": { zIndex: 40 },
});
export const StopDurationFields = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr) auto",
  alignItems: "center",
  gap: "8px",
  "& > span": { whiteSpace: "nowrap" },
  "& input": {
    width: "100%",
    minWidth: 0,
    minHeight: "50px",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #D4DFE5",
    borderRadius: "8px",
    backgroundColor: "#FFF",
    color: "#0D3E41",
    font: "inherit",
  },
  "& input:focus-visible": { outline: "2px solid #527F79", outlineOffset: 2 },
  "@media (max-width: 767px)": { gap: "8px" },
});
export const StopTransportField = styled.div({
  minWidth: 0,
});

export const StopTransportNotice = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "8px",
  minHeight: "42px",
  boxSizing: "border-box",
  padding: "10px 12px",
  borderRadius: "8px",
  backgroundColor: "#E0F2EF",
  color: "#0D6566",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: 1.5,
  "& > svg": { flexShrink: 0 },
  "& > span": { minWidth: 0, overflowWrap: "anywhere" },
});

export const StopTransportDropdownRoot = styled.div({
  position: "relative",
  width: "100%",
  minWidth: 0,
  "& .transport-trigger": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    minHeight: "50px",
    padding: "12px 14px",
    boxSizing: "border-box",
    border: "1px solid #D4DFE5",
    borderRadius: "8px",
    backgroundColor: "#FFF",
    color: "#0D3E41",
    font: "inherit",
    textAlign: "left",
    cursor: "pointer",
  },
  "& .transport-trigger > span": { flex: 1, minWidth: 0 },
  "& .transport-trigger > svg": { flexShrink: 0 },
  "& .transport-chevron": { transition: "transform 240ms ease" },
  '& .transport-trigger[aria-expanded="true"] .transport-chevron': {
    transform: "rotate(180deg)",
  },
  "& button:focus-visible": { outline: "2px solid #527F79", outlineOffset: 2 },
});
export const StopTransportOptions = styled.div({
  ...dropdownAnimation,
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  right: 0,
  zIndex: 45,
  maxHeight: "280px",
  overflowY: "auto",
  overscrollBehavior: "contain",
  padding: "6px",
  border: "1px solid #D4DFE5",
  borderRadius: "10px",
  backgroundColor: "#FFF",
  boxShadow: "0 8px 24px rgba(13,62,65,.14)",
  "& > button": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    minHeight: "44px",
    padding: "10px 12px",
    border: 0,
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "#0D3E41",
    font: "inherit",
    textAlign: "left",
    cursor: "pointer",
  },
  "& > button > span": { flex: 1 },
  "& > button > svg": { flexShrink: 0 },
  '& > button[aria-pressed="true"]': {
    backgroundColor: "#E0F2EF",
    color: "#075653",
  },
  "@media (hover: hover)": {
    "& > button:hover": { backgroundColor: "#EDF6F3" },
  },
});

// 모바일 보기·편집 카드의 좌측 상단 카테고리
export const MobileStopCategory = styled(StopCategoryBadge)({
  display: "none",
  "@media (max-width: 767px)": {
    "[data-stop-card] > [data-stop-time] &": {
      display: "inline-flex",
      backgroundColor: "#DDF5F0",
      color: "#075653",
      textShadow: "none",
    },
  },
});
