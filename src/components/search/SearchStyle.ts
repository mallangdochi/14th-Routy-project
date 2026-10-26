import styled from "@emotion/styled";
import { menuAnimation } from "../../styles/animation";

// ========================================
// 전체 레이아웃
// ========================================

export const Page = styled.div({
  display: "flex",
  width: "100%",
  minWidth: 0,
  minHeight: "100vh",
  backgroundColor: "#FAFAF7",
  color: "#172C40",

  "@media (max-width: 767px)": {
    display: "block",
    minWidth: "320px",
    overflowX: "clip",
  },
});

export const SidebarArea = styled.aside({
  position: "sticky",
  top: 0,
  alignSelf: "flex-start",

  display: "flex",
  flex: "0 0 auto",
  width: "fit-content",
  minWidth: 0,

  height: "100vh",
  backgroundColor: "#FFFFFF",
  borderRight: "1px solid #E7EBE9",

  "@media (max-width: 767px)": {
    display: "none",
  },
});

export const MainContent = styled.main({
  flex: "1 1 0%",
  minWidth: 0,
  minHeight: "100vh",

  "@media (max-width: 767px)": {
    width: "100%",
    minWidth: 0,
    minHeight: "100dvh",
  },
});

export const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "1440px",
  minWidth: 0,
  minHeight: "100vh",
  margin: "0 auto",
  padding: "26px 30px 50px",

  "@media (max-width: 1199px)": {
    padding: "24px 20px 40px",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    padding: "22px 18px 36px",
  },

  "@media (max-width: 767px)": {
    maxWidth: "100%",
    minHeight: "100dvh",
    padding: "96px 16px calc(110px + env(safe-area-inset-bottom, 0px))",
  },
});

// ========================================
// 상단 헤더
// ========================================

export const BreadcrumbArea = styled.div({
  display: "flex",
  alignItems: "center",
  minHeight: "24px",
  marginBottom: "24px",

  "@media (max-width: 767px)": {
    display: "none",
  },
});

export const PageTitle = styled.h1({
  margin: "0 0 18px",
  fontSize: "32px",
  fontWeight: 800,
  lineHeight: 1.35,
  letterSpacing: "-0.8px",
  color: "#142D4A",

  "@media (min-width: 768px) and (max-width: 1023px)": {
    fontSize: "24px",
    marginBottom: "16px",
  },

  "@media (max-width: 767px)": {
    fontSize: "23px",
    margin: "0 0 12px",
    letterSpacing: "-0.6px",
  },
});

// ========================================
// 검색창
// ========================================

export const SearchForm = styled.form({
  display: "flex",
  alignItems: "center",
  gap: "11px",
  width: "100%",
  height: "49px",
  padding: "0 16px",
  border: "1px solid #E1E6EB",
  borderRadius: "9px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 2px 5px rgba(22, 42, 53, 0.035)",
  color: "#31486C",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",

  "&:focus-within": {
    borderColor: "#005259",
    boxShadow: "0 0 0 3px rgba(0, 82, 89, 0.09)",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    height: "46px",
    padding: "0 14px",
  },

  "@media (max-width: 767px)": {
    height: "43px",
    gap: "9px",
    padding: "0 12px",
  },
});

export const SearchInput = styled.input({
  flex: 1,
  width: "100%",
  minWidth: 0,
  height: "100%",
  padding: 0,
  border: 0,
  outline: 0,
  backgroundColor: "transparent",
  color: "#172C40",
  fontFamily: "inherit",
  fontSize: "15px",

  "&::placeholder": {
    color: "#9BA5B7",
  },

  "&::-webkit-search-cancel-button": {
    display: "none",
  },

  "@media (max-width: 767px)": {
    fontSize: "13px",
  },
});

export const ClearButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "28px",
  height: "28px",
  padding: 0,
  border: 0,
  borderRadius: "50%",
  backgroundColor: "transparent",
  color: "#8190A6",
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "#F0F5F5",
    color: "#005259",
  },
});

// ========================================
// 카테고리
// ========================================

export const CategoryList = styled.div({
  display: "flex",
  alignItems: "stretch",
  gap: "0",
  width: "100%",
  marginTop: "30px", // 검색창과 카테고리 사이 간격
  borderBottom: "1px solid #DCE4E7",
  position: "relative",

  "@media (min-width: 768px) and (max-width: 1023px)": {
    marginTop: "26px",
  },

  "@media (max-width: 767px)": {
    marginTop: "24px",
    gap: "0",
    overflowX: "hidden",
  },
});

export const CategoryButton = styled.button<{
  $active: boolean;
}>(({ $active }) => ({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "0 0 105px",
  minWidth: 0,
  height: "48px",
  padding: "0 12px",
  border: 0,
  borderRadius: 0,
  backgroundColor: "transparent",

  color: $active ? "#005259" : "#718096",
  borderBottom: "none",
  ...menuAnimation.button,
  fontFamily: "inherit",
  fontSize: "15px",
  fontWeight: $active ? 700 : 500,
  whiteSpace: "nowrap",
  cursor: "pointer",

  "&:hover": {
    color: "#005259",
  },

  "&:focus-visible": {
    outline: "2px solid #005259",
    outlineOffset: "-3px",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    flexBasis: "90px",
    height: "44px",
    fontSize: "13px",
  },

  "@media (max-width: 767px)": {
    flex: "1 1 0",
    height: "43px",
    padding: "0 2px",
    fontSize: "12px",
  },
}));

// ========================================
// 빈 화면
// ========================================

export const EmptyState = styled.section({
  display: "flex",
  flex: "1 0 auto",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "420px",
  padding: "30px 16px 100px",
  textAlign: "center",

  "@media (min-width: 768px) and (max-width: 1023px)": {
    minHeight: "360px",
    padding: "24px 12px 70px",
  },

  "@media (max-width: 767px)": {
    minHeight: "calc(100dvh - 340px)",
    padding: "28px 12px 70px",
  },
});

export const EmptyIcon = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "220px",
  height: "220px",
  marginBottom: "20px",
  color: "#8D9BB6",

  "@media (min-width: 768px) and (max-width: 1023px)": {
    width: "190px",
    height: "190px",
    marginBottom: "18px",
  },

  "@media (max-width: 767px)": {
    width: "170px",
    height: "170px",
    marginBottom: "16px",
  },
});

export const MascotImage = styled.img({
  width: "300px",
  height: "300x",
  objectFit: "contain",

  "@media (min-width: 768px) and (max-width: 1023px)": {
    width: "240px",
    height: "240px",
  },

  "@media (max-width: 767px)": {
    width: "210px",
    height: "210px",
  },
});

export const EmptyTitle = styled.h2({
  margin: "0 0 10px",
  fontSize: "28px",
  fontWeight: 800,
  lineHeight: 1.4,
  letterSpacing: "-0.6px",
  color: "#152D4B",

  "@media (min-width: 768px) and (max-width: 1023px)": {
    fontSize: "25px",
  },

  "@media (max-width: 767px)": {
    fontSize: "19px",
    marginBottom: "8px",
  },
});

export const EmptyDescription = styled.p({
  margin: 0,
  fontSize: "18px",
  lineHeight: 1.6,
  color: "#7D8BA4",

  "@media (min-width: 768px) and (max-width: 1023px)": {
    fontSize: "15px",
  },

  "@media (max-width: 767px)": {
    fontSize: "12px",
  },
});

export const ScreenReaderOnly = styled.span({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
});

// ========================================
// 검색 결과 화면
// ========================================

export const ResultsSection = styled.section({
  display: "flex",
  flexDirection: "column",
  flex: "1 0 auto",
  width: "100%",
  minHeight: "420px",
  marginTop: "14px",

  "@media (min-width: 768px) and (max-width: 1023px)": {
    minHeight: "360px",
  },

  "@media (max-width: 767px)": {
    minHeight: "calc(100dvh - 340px)",
    marginTop: "10px",
  },
});

export const ResultsToolbar = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "12px",
  minHeight: "24px",

  "@media (max-width: 767px)": {
    marginBottom: "9px",
  },
});

export const ResultsCount = styled.p({
  margin: 0,
  fontSize: "13px",
  color: "#53658A",

  "& strong": {
    fontWeight: 700,
  },

  "@media (max-width: 767px)": {
    fontSize: "12px",
  },
});

// ========================================
// 정렬 드롭다운
// ========================================

export const SortArea = styled.div({
  position: "relative",
  zIndex: 5,

  "& .sort-dropdown": {
    left: "auto",
    right: 0,
  },
});

// ========================================
// 장소 카드 목록
// ========================================

export const ResultList = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const PlaceCard = styled.article({
  position: "relative",
  display: "flex",
  alignItems: "stretch",
  gap: "18px",
  width: "100%",
  minHeight: "153px",
  padding: "10px 12px",
  border: "1px solid #E5E9EF",
  borderRadius: "11px",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 9px rgba(31, 56, 68, 0.035)",

  "@media (min-width: 1024px) and (max-width: 1199px)": {
    display: "grid",
    gridTemplateColumns: "150px minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr) auto",
    columnGap: "12px",
    rowGap: "8px",
    minHeight: "174px",
    padding: "12px",
    alignItems: "stretch",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    display: "grid",
    gridTemplateColumns: "150px minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr) auto",
    columnGap: "12px",
    rowGap: "8px",
    minHeight: "174px",
    padding: "12px",
    alignItems: "stretch",
  },

  "@media (max-width: 767px)": {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "0",
    minHeight: 0,
    padding: "10px",
    borderRadius: "12px",
  },
});

export const PlaceImage = styled.img({
  width: "205px",
  height: "133px",
  flexShrink: 0,
  objectFit: "cover",
  borderRadius: "8px",
  backgroundColor: "#E5EDEE",

  "@media (min-width: 1024px) and (max-width: 1199px)": {
    width: "150px",
    height: "150px",
    aspectRatio: "1 / 1",
    objectFit: "cover",
    gridColumn: "1",
    gridRow: "1 / 3",
    alignSelf: "start",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    width: "150px",
    height: "150px",
    aspectRatio: "1 / 1",
    objectFit: "cover",
    gridColumn: "1",
    gridRow: "1 / 3",
    alignSelf: "start",
  },

  "@media (max-width: 767px)": {
    display: "block",
    width: "100%",
    height: "auto",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
  },
});

export const PlaceContent = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  flex: "1 1 0%",
  minWidth: 0,
  padding: "3px 160px 2px 0",

  "@media (min-width: 1024px) and (max-width: 1199px)": {
    gridColumn: "2",
    gridRow: "1",
    padding: "2px 32px 0 0",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    gridColumn: "2",
    gridRow: "1",
    padding: "2px 32px 0 0",
  },

  "@media (max-width: 767px)": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: "none",
    width: "100%",
    padding: "10px 2px 0",
    minWidth: 0,
  },
});

export const PlaceName = styled.h2({
  margin: "0 0 5px",
  color: "#102C4B",
  fontSize: "18px",
  fontWeight: 800,
  lineHeight: 1.35,
  letterSpacing: "-0.5px",

  "@media (min-width: 768px) and (max-width: 1023px)": {
    fontSize: "17px",
    marginBottom: "0",
    overflowWrap: "anywhere",
  },

  "@media (max-width: 767px)": {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.35,
  },
});

export const CategoryTag = styled.span({
  display: "inline-flex",
  alignItems: "center",
  minHeight: "21px",
  padding: "1px 9px",
  borderRadius: "999px",
  backgroundColor: "#EDF1F7",
  color: "#3E5070",
  fontSize: "11px",
  fontWeight: 700,

  "@media (max-width: 767px)": {
    fontSize: "10px",
    minHeight: "19px",
    padding: "1px 8px",
  },
});

export const PinIcon = styled.span({
  display: "inline-flex",
  flexShrink: 0,
  color: "#6478A5",
});

export const PlaceAddress = styled.p({
  display: "flex",
  alignItems: "flex-start",
  gap: "5px",
  minWidth: 0,
  margin: "8px 0 5px",
  color: "#54678E",
  fontSize: "12px",
  lineHeight: 1.45,
  overflowWrap: "anywhere",

  "& svg": {
    flexShrink: 0,
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    fontSize: "12px",
    margin: "10px 0 6px",
  },

  "@media (max-width: 767px)": {
    margin: "7px 0 4px",
    fontSize: "11px",
    lineHeight: 1.4,
  },
});

export const PlaceDescription = styled.p({
  margin: 0,
  color: "#536A94",
  fontSize: "12px",
  lineHeight: 1.55,
  overflowWrap: "anywhere",

  "@media (min-width: 768px) and (max-width: 1023px)": {
    fontSize: "12px",
    lineHeight: 1.5,
  },

  "@media (max-width: 767px)": {
    fontSize: "11px",
    lineHeight: 1.5,
  },
});

// ========================================
// 찜하기 버튼
// ========================================

export const FavoriteButton = styled.button<{
  $active: boolean;
}>(({ $active }) => ({
  position: "absolute",
  top: "12px",
  right: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "30px",
  height: "30px",
  padding: 0,
  border: 0,
  backgroundColor: "transparent",
  color: $active ? "#005259" : "#7484AC",
  transition: "color 0.2s ease, transform 0.2s ease",
  cursor: "pointer",

  "&:hover": {
    transform: "scale(1.08)",
  },

  "@media (max-width: 767px)": {
    top: "17px",
    right: "17px",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
    zIndex: 1,
  },
}));

// ========================================
// 카드 하단 버튼
// ========================================

export const CardActions = styled.div({
  position: "absolute",
  right: "12px",
  bottom: "10px",
  display: "flex",
  alignItems: "center",
  gap: "8px",

  "@media (min-width: 1024px) and (max-width: 1199px)": {
    position: "static",
    gridColumn: "2",
    gridRow: "2",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "end",
    gap: "8px",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    position: "static",
    gridColumn: "2",
    gridRow: "2",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "10px",
    width: "100%",
    minWidth: 0,
    marginTop: "8px",
    padding: 0,
  },

  "@media (max-width: 767px)": {
    position: "static",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: "10px",
    width: "100%",
    minWidth: 0,
    marginTop: "18px",
    padding: "0 2px",
  },
});

export const MapButton = styled.button({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  height: "36px",
  padding: "0 12px",
  border: "1px solid #DCE5F0",
  borderRadius: "7px",
  backgroundColor: "#FFFFFF",
  color: "#233E66",
  fontSize: "12px",
  fontWeight: 700,
  whiteSpace: "nowrap",
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "#F4F8FA",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
    height: "40px",
    minWidth: "110px",
    padding: "0 12px",
    border: "1px solid #D8E1E5",
    borderRadius: "9px",
    backgroundColor: "#FFFFFF",
    color: "#005259",
    fontSize: "13px",
    fontWeight: 600,
    gap: "6px",
    whiteSpace: "nowrap",
  },

  "@media (max-width: 767px)": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "1 1 0",
    minWidth: 0,
    height: "44px",
    padding: "0 8px",
    border: "1px solid #D8E1E5",
    borderRadius: "9px",
    backgroundColor: "#FFFFFF",
    color: "#005259",
    fontSize: "13px",
    fontWeight: 600,
    gap: "6px",
    whiteSpace: "nowrap",
  },
});

export const AddButton = styled.button<{
  $added: boolean;
}>(({ $added }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  height: "36px",
  padding: "0 13px",
  border: 0,
  borderRadius: "7px",
  backgroundColor: $added ? "#317C78" : "#005259",
  color: "#FFFFFF",
  fontSize: "12px",
  fontWeight: 700,
  whiteSpace: "nowrap",
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "#003E43",
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
    height: "40px",
    minWidth: "125px",
    padding: "0 12px",
    borderRadius: "9px",
    backgroundColor: "#005259",
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: 600,
    gap: "6px",
    whiteSpace: "nowrap",
  },

  "@media (max-width: 767px)": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "1 1 0",
    minWidth: 0,
    height: "44px",
    padding: "0 8px",
    borderRadius: "9px",
    backgroundColor: "#005259",
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: 600,
    gap: "6px",
    whiteSpace: "nowrap",
  },
}));

// ========================================
// 반응형 제목·카테고리
// ========================================

export const PlaceHeading = styled.div({
  display: "contents",
  "@media (min-width: 768px) and (max-width: 1023px)": {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
    minWidth: 0,
  },

  "@media (max-width: 767px)": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "5px",
    minWidth: 0,
    width: "100%",
  },
});

// 모바일 공통 헤더 / 하단바 래퍼: 기존 컴포넌트 자체는 변경하지 않습니다.
export const MobileHeaderArea = styled.div({
  display: "none",
  "@media (max-width: 767px)": {
    display: "block",
    width: "100%",
    position: "relative",
    zIndex: 20,
  },
});

export const MobileNavArea = styled.div({
  display: "none",
  "@media (max-width: 767px)": {
    display: "block",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
});

export const CategoryIndicator = styled.span({
  position: "absolute",
  bottom: 0,
  left: 0,
  height: "3px",
  backgroundColor: "#005259",
  borderRadius: "2px 2px 0 0",
  pointerEvents: "none",

  ...menuAnimation.indicator,
});
