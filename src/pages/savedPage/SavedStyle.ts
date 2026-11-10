import styled from "@emotion/styled";
import { menuAnimation } from "../../styles/animation";

export const SavedPageStyle = styled.div({
  "--page-font-size": "16px",
  fontSize: "var(--page-font-size)",
  display: "flex",
  alignItems: "stretch",
  width: "100%",
  height: "100dvh",
  minHeight: 0,
  overflow: "hidden",
  backgroundColor: "#FEFBF5",

  "& .page-sidebar": {
    flex: "0 0 auto",
    minWidth: 0,
    display: "flex",
    alignSelf: "stretch",
  },

  "& .page-content": {
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    flex: "1 1 0",
    minWidth: 0,
    minHeight: 0,
    height: "100%",
    boxSizing: "border-box",
    overflowY: "auto",
    scrollbarGutter: "stable",

    "@supports not (scrollbar-gutter: stable)": {
      overflowY: "scroll",
    },
    backgroundColor: "#FEFBF5",
    padding: "24px 40px 0",
  },

  "& .page-mobile-header, & .page-mobile-footer": {
    display: "none",
  },

  "@media (max-width: 767px)": {
    "--page-font-size": "14px",

    "& .page-sidebar": {
      display: "none",
    },

    "& .page-mobile-header, & .page-mobile-footer": {
      display: "block",
    },

    "& .page-content": {
      padding: "24px 20px",
    },
  },
});

export const PageInner = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  margin: "0 auto",
  width: "100%",
  maxWidth: "1300px",
  boxSizing: "border-box",
  minWidth: 0,
  fontSize: "var(--page-font-size)",

  "& .page-header": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 15,
    paddingBottom: 24,

    "& h1": {
      fontSize: 35,
      color: "#0D3E41",
    },
  },

  "&:has(.saved-places)": {
    justifyContent: "flex-start",
    alignItems: "stretch",
  },

  "& .saved-places": {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: "100%",
    paddingBottom: 32,
  },

  "& .saved-filters": {
    display: "flex",
    position: "relative",
    flexWrap: "nowrap",
    alignItems: "stretch",
    gap: 0,
    width: "100%",
    borderBottom: "1px solid #E2E6E9",

    "& .saved-filter-indicator": {
      ...menuAnimation.indicator,
      display: "block",
      position: "absolute",
      top: "auto",
      bottom: "-1px",
      left: 0,
      width: "var(--indicator-width, 0px)",
      height: 2,
      borderRadius: 0,
      backgroundColor: "#005358",
      opacity: 1,
      visibility: "visible",
      zIndex: 1,
      transform: "translateX(var(--indicator-left, 0px))",
      pointerEvents: "none",
    },

    "& button": {
      ...menuAnimation.button,
      display: "grid",
      placeItems: "center",

      "&::after": {
        content: "attr(data-label)",
        gridArea: "1 / 1",
        fontWeight: 700,
        visibility: "hidden",
        pointerEvents: "none",
      },

      "& > span": {
        gridArea: "1 / 1",
      },
      flex: "0 0 auto",
      minWidth: 0,
      minHeight: 44,
      padding: "10px 25px",
      border: 0,
      borderRadius: 0,
      backgroundColor: "transparent",
      color: "#718596",
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: 400,
      lineHeight: 1.5,
      whiteSpace: "nowrap",
      cursor: "pointer",

      "&:hover": {
        backgroundColor: "transparent",
        color: "#005358",
      },

      '&[aria-pressed="true"]': {
        backgroundColor: "transparent",
        color: "#005358",
        fontWeight: 700,
      },

      "&:focus-visible": {
        outline: "2px solid #527F79",
        outlineOffset: "-4px",
      },
    },
  },

  "& .saved-toolbar": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },

  "& .saved-toolbar > div": {
    marginLeft: "auto",

    "& .sort-dropdown": {
      left: "auto",
      right: 0,
    },
  },

  "& .saved-count": {
    color: "#596D75",
    lineHeight: 1.5,

    "& strong": {
      fontWeight: 600,
    },
  },

  "& .saved-list": {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    margin: 0,
    padding: 0,
    listStyle: "none",
  },

  "& .saved-card": {
    display: "flex",
    alignItems: "stretch",
    gap: 20,
    padding: 12,
    border: "1px solid #EEEDE7",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 3px 12px rgba(13, 62, 65, 0.05)",
  },

  "& .saved-image": {
    flex: "0 0 200px",
    width: 200,
    minHeight: 160,
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: "#E8EEEA",

    "& img": {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },

  "& .saved-info": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
    minWidth: 0,
    gap: 8,
  },

  "& .saved-heading": {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",

    "& h2": {
      paddingTop: 6,
      color: "#0D3E41",
      fontSize: 22,
      fontWeight: 700,
      lineHeight: 1.4,
      overflowWrap: "anywhere",
    },
  },

  "& .saved-bookmark": {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: 44,
    height: 44,
    border: 0,
    borderRadius: 10,
    backgroundColor: "transparent",
    color: "#0D3E41",
    cursor: "pointer",
    transition: "background-color 0.2s ease, color 0.2s ease",

    "&:hover": {
      backgroundColor: "#EDF4F0",
      color: "#236367",
    },

    "& svg": {
      display: "block",
    },
  },

  "& .saved-category": {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 10px",
    borderRadius: 999,
    backgroundColor: "#F0F2F3",
    color: "#455A63",
    lineHeight: 1.5,
  },

  "& .saved-address": {
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
    color: "#596D75",
    lineHeight: 1.5,

    "& svg": {
      flexShrink: 0,
      marginTop: 3,
    },

    "& span": {
      minWidth: 0,
      overflowWrap: "anywhere",
    },
  },

  "& .saved-description": {
    color: "#596D75",
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },

  "& .saved-actions": {
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 8,
    width: "100%",
    marginTop: "auto",
    paddingTop: 4,

    "& button": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      minHeight: 44,
      padding: "8px 14px",
      borderRadius: 8,
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: 600,
      lineHeight: 1.5,
      cursor: "pointer",
      transition: "background-color 0.2s ease",

      "& svg": {
        flexShrink: 0,
      },

      "& span": {
        whiteSpace: "nowrap",
      },
    },
  },

  "& .saved-map-button": {
    border: "1px solid #D9E2E3",
    backgroundColor: "#FFFFFF",
    color: "#0D3E41",

    "&:hover": {
      backgroundColor: "#F0F5F2",
    },
  },

  "& .saved-add-button": {
    border: "1px solid #0D3E41",
    backgroundColor: "#0D3E41",
    color: "#FFFFFF",

    "&:hover": {
      backgroundColor: "#195357",
    },
  },

  "& .saved-bookmark:focus-visible, & .saved-actions button:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: 3,
  },

  "& .saved-empty": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: "40px 0",
    color: "#596D75",
    textAlign: "center",
  },

  "@media (max-width: 1023px)": {
    "--page-font-size": "15px",
    padding: "24px 0 0",

    "& .saved-card": {
      gap: 16,
    },

    "& .saved-image": {
      flexBasis: 160,
      width: 160,
      minHeight: 150,
    },

    "& .saved-heading h2": {
      fontSize: 20,
    },

    "& .saved-actions button": {
      padding: "8px 12px",
    },
  },

  "@media (max-width: 767px)": {
    "--page-font-size": "14px",
    padding: 0,

    "& .page-header": {
      paddingBottom: 0,

      "& h1": {
        paddingTop: 20,
        fontSize: 24,
        fontWeight: 700,
      },
    },
    "& .saved-filters button": {
      flex: "1 1 0",
      minWidth: 0,
      padding: "10px 0",
      fontSize: "14px",
    },
    "& .saved-places": {
      gap: 12,
      paddingTop: 20,
      paddingBottom: 100,
    },

    "& .saved-list": {
      gap: 12,
    },

    "& .saved-card": {
      position: "relative",
      flexDirection: "column",
      gap: 10,
      padding: 10,
      borderRadius: 12,
    },

    "& .saved-image": {
      flex: "0 0 auto",
      width: "100%",
      height: 150,
      minHeight: 0,
      borderRadius: 8,
    },

    "& .saved-info": {
      flex: "0 0 auto",
      gap: 8,
    },

    "& .saved-heading h2": {
      paddingTop: 0,
      fontSize: 18,
    },

    "& .saved-bookmark": {
      position: "absolute",
      top: 16,
      right: 16,
      backgroundColor: "#FFFFFF",
      boxShadow: "0 2px 8px rgba(13, 62, 65, 0.12)",

      "&:hover": {
        backgroundColor: "#EDF4F0",
      },
    },

    "& .saved-actions": {
      paddingTop: 4,

      "& button": {
        flex: "1 1 auto",
        padding: "8px 10px",
      },
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& .saved-bookmark, & .saved-actions button, & .saved-filters button, & .saved-filter-indicator":
      {
        transition: "none",
      },
  },
});

// 검색 카드와 동일한 카드 스타일 및 반응형 배치
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
  "& a": { color: "inherit", textDecoration: "none" },
  "& a:focus-visible": { outline: "2px solid #527F79", outlineOffset: "3px" },

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
    fontSize: 16,
    fontWeight: 500,
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
    fontSize: 16,
    fontWeight: 50,
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
    justifyContent: "space-between",
    gap: "5px",
    minWidth: 0,
    width: "100%",
  },
});
