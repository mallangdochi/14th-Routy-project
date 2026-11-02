import styled from "@emotion/styled";

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
  width: "30px",
  height: "30px",
  marginLeft: "-4px",
  borderRadius: "50%",
  border: "2px solid white",
  backgroundColor: "#E7F2EF",
  fontSize: "17px",
});

export const MemberAdd = styled.button({
  ...CENTERED_FLEX,
  width: "30px",
  height: "30px",
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
  marginLeft: "auto",

  "@media (max-width: 1023px)": {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "6px",
    flexShrink: 0,
    marginLeft: "auto",

    "& > button": {
      minWidth: 0,
      minHeight: "32px",
      padding: "0 9px",
      fontSize: "11px",
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
      backgroundColor: "transparent",
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
  padding: "0 13px",
  border: "1px solid #E7EBED",
  borderRadius: "7px",
  backgroundColor: "#005259",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: 600,

  "&:hover": {
    backgroundColor: "#003E43",
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

export const AddDayButton = styled.button({
  ...CENTERED_FLEX,
  gap: "8px",
  minWidth: "145px",
  height: "58px",
  border: "1px dashed #C9DBDF",
  borderRadius: "9px",
  backgroundColor: "#FFFFFF",
  color: "#004F53",
  fontSize: "13px",
  fontWeight: 600,

  "&:hover": {
    backgroundColor: "#EFFAFA",
    borderColor: "#008A8A",
  },

  "@media (max-width: 1023px)": {
    minWidth: "135px",
    height: "55px",
  },

  "@media (max-width: 767px)": {
    flex: "0 0 120px",
    width: "120px",
    minWidth: "120px",
    height: "46px",
    padding: "5px",
    gap: "5px",
    fontSize: "12px",
    whiteSpace: "nowrap",

    "& svg": {
      width: "15px",
      height: "15px",
      flexShrink: 0,
    },
  },
});
// 일정 / 지도 2열 레이아웃
export const ContentGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  alignItems: "start",
  gap: "16px",
  width: "100%",
  minWidth: 0,

  "& > section": {
    width: "100%",
    minWidth: 0,
  },
});
// 일정 패널
export const SchedulePanel = styled.section({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  padding: "12px",
  border: "1px solid #E8EEEE",
  borderRadius: "11px",
  backgroundColor: "#FFFFFF",

  "@media (max-width: 1023px)": {
    padding: "14px",
  },

  '&[data-tablet-hidden="true"]': {
    display: "none",
  },

  "@media (max-width: 767px)": {
    padding: "12px 10px",
    borderRadius: "12px",
  },
});

export const ScheduleHeading = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  minHeight: "32px",
  marginBottom: "12px",

  "@media (max-width: 1023px)": {
    gap: "6px",
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

    h2: {
      fontSize: "20px",
    },
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
    fontSize: "10px",

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

  "@media (max-width: 1023px)": {
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
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
  minWidth: 0,
  isolation: "isolate",

  "@media (max-width: 1023px)": {
    gap: "7px",
  },
});
// 일정 카드 행
// 일정 카드 행 - 드래그 모션
export const StopRow = styled.div<{
  $isDragging?: boolean;
  $isDragOver?: boolean;
}>(({ $isDragging, $isDragOver }) => ({
  position: "relative",
  display: "flex",
  alignItems: "stretch",
  gap: "6px",
  width: "100%",
  minWidth: 0,
  minHeight: "90px",

  // 드래그 중 원래 카드 위치 표시
  opacity: $isDragging ? 0.35 : 1,

  transition: "opacity 0.2s ease, transform 0.2s ease",

  // 다른 카드 위로 이동했을 때
  "& > div:last-child": {
    outline: $isDragOver ? "2px dashed #008A8A" : "2px solid transparent",

    outlineOffset: "2px",

    backgroundColor: $isDragOver ? "#F0FAF9" : "#FFFFFF",

    transition: "outline 0.2s ease, background-color 0.2s ease",
  },

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

  "@media (max-width: 767px)": {
    minHeight: "86px",
    gap: "5px",
  },
}));
// 드래그 핸들 영역
export const DragSlot = styled.div({
  ...CENTERED_FLEX,
  flex: "0 0 18px",
  width: "18px",
  minWidth: "18px",
  alignSelf: "stretch",

  "@media (max-width: 1023px)": {
    flex: "0 0 15px",
    width: "15px",
    minWidth: "15px",
  },

  "@media (max-width: 767px)": {
    flex: "0 0 0px",
    width: 0,
    minWidth: 0,
    overflow: "hidden",

    '&[data-edit-mode="true"]': {
      flex: "0 0 12px",
      width: "12px",
      minWidth: "12px",
      overflow: "visible",
    },
  },
});
// 점 6개 드래그 핸들
export const DragHandle = styled.button({
  ...CENTERED_FLEX,

  width: "18px",
  height: "34px",
  padding: 0,

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

  "@media (max-width: 1023px)": {
    width: "15px",
    height: "30px",

    svg: {
      width: "15px",
      height: "15px",
    },
  },
});
// 타임라인 숫자 및 점선
export const Timeline = styled.div({
  position: "relative",
  ...CENTERED_FLEX,
  flex: "0 0 28px",
  width: "28px",
  minWidth: "28px",
  alignSelf: "stretch",

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
  position: "relative",
  display: "flex",
  alignItems: "center",
  flex: 1,
  gap: "8px",
  minWidth: 0,
  minHeight: "90px",
  padding: "8px",
  border: "1px solid #E5EBEB",
  borderRadius: "10px",
  backgroundColor: "#FFFFFF",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",

  "&:hover": {
    borderColor: "#B5D7D5",
    boxShadow: "0 2px 8px rgba(0,80,80,0.05)",
  },

  "@media (min-width: 1024px) and (max-width: 1199px)": {
    gap: "6px",
    padding: "6px",
  },

  "@media (max-width: 1023px)": {
    minHeight: "66px",
    gap: "6px",
    padding: "6px",
  },

  "@media (max-width: 767px)": {
    width: "100%",
    minWidth: 0,
    minHeight: "86px",
    gap: "5px",
    padding: "8px 6px",
    alignItems: "center",
    borderRadius: "10px",
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
  width: "70px",
  height: "55px",
  flexShrink: 0,
  borderRadius: "7px",
  objectFit: "cover",

  "@media (min-width: 1024px) and (max-width: 1199px)": {
    width: "52px",
    height: "48px",
  },

  "@media (max-width: 1023px)": {
    width: "58px",
    height: "48px",
  },

  "@media (max-width: 767px)": {
    width: "44px",
    height: "52px",
    flexShrink: 0,
    objectFit: "cover",
  },
});

export const StopDetails = styled.div({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
  gap: "4px",

  strong: {
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1.35,
    color: "#172324",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  span: {
    fontSize: "16px",
    lineHeight: 1.35,
    color: "#667174",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    whiteSpace: "normal",
    overflowWrap: "anywhere",
  },

  small: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    fontSize: "16px",
    lineHeight: 1.35,
    color: "#505E60",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },

  "@media (max-width: 1023px)": {
    gap: "3px",

    strong: {
      fontSize: "16px",
    },

    span: {
      fontSize: "16px",
    },

    small: {
      fontSize: "16px",
    },
  },

  "@media (max-width: 767px)": {
    flex: 1,
    minWidth: 0,
    gap: "3px",

    strong: {
      fontSize: "11px",
      lineHeight: 1.35,
      whiteSpace: "normal",
      overflowWrap: "break-word",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
    },

    span: {
      fontSize: "10px",
      lineHeight: 1.4,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
      overflowWrap: "anywhere",
    },

    small: {
      fontSize: "10px",
      lineHeight: 1.3,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },

    "small svg": {
      width: "10px",
      height: "10px",
      flexShrink: 0,
    },
  },
});
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
  padding: 0,
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
  cursor: "pointer",

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
  height: "36px",
  padding: "0 16px",
  border: "1px solid #D6E2E4",
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  color: "#243437",
  fontSize: "15px",
  fontWeight: 600,
  whiteSpace: "nowrap",
  cursor: "pointer",

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
  "@media (max-width: 767px)": {
    display: "none",
  },
});

export const MobileEditAction = styled.div({
  display: "none",

  "@media (max-width: 767px)": {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
});
