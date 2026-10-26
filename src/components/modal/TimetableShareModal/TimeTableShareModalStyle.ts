import styled from "@emotion/styled";
import { ShareBanner, ShareBannerText } from "../../Schedule/ShareModalStyle";

export {
  ShareOverlay,
  ShareModal,
  ShareMascot,
  ShareCloseButton,
  ShareSection,
  ShareSectionTitle,
  SharePlatformList,
  SharePlatformButton,
  SharePlatformIcon,
  KakaoBubble,
} from "../../Schedule/ShareModalStyle";

export const PreviewBanner = styled(ShareBanner)({
  height: "155px",

  "@media (max-width: 767px)": {
    height: "138px",
  },
});

export const PreviewBannerText = styled(ShareBannerText)({
  maxWidth: "calc(100% - 155px)",

  "& h2": {
    fontSize: "22px",
  },

  "& p": {
    fontSize: "12px",
  },

  "@media (max-width: 767px)": {
    width: "calc(100% - 120px)",
    maxWidth: "none",
    marginLeft: 0,

    "& h2": {
      fontSize: "17px",
      whiteSpace: "nowrap",
    },

    "& p": {
      fontSize: "11px",
      whiteSpace: "nowrap",
    },
  },
});

export const PreviewModalBody = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "20px 24px 24px",
  overflowY: "auto",

  "@media (max-width: 767px)": {
    gap: "16px",
    padding: "16px 14px 20px",
  },
});

export const PreviewSection = styled.section({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const PreviewTitle = styled.h3({
  margin: 0,
  color: "#0C293D",
  fontSize: "13px",
  fontWeight: 700,
});

export const PreviewThumbnail = styled.div({
  width: "100%",
  height: "230px",
  overflow: "hidden",
  border: "1px solid #E1EAE8",
  borderRadius: "10px",
  backgroundColor: "#F6FAF9",
  padding: "10px",

  "@media (max-width: 767px)": {
    height: "180px",
    padding: "7px",
  },
});

export const ThumbnailCanvas = styled.div({
  width: "100%",
  height: "100%",
  overflow: "hidden",
  borderRadius: "6px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
});

export const ThumbnailHeader = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px",
  backgroundColor: "#E9FFF7",
  color: "#005259",

  strong: {
    fontSize: "11px",
  },

  span: {
    fontSize: "9px",
  },

  "@media (max-width: 767px)": {
    padding: "8px",

    strong: {
      fontSize: "9px",
    },

    span: {
      fontSize: "8px",
    },
  },
});

export const ThumbnailTable = styled.div({
  display: "flex",
  width: "100%",
  height: "calc(100% - 40px)",
  overflow: "hidden",
});

export const ThumbnailDay = styled.div({
  display: "flex",
  flex: "1 1 0",
  flexDirection: "column",
  minWidth: 0,
  borderRight: "1px solid #EDF1F2",

  "&:last-child": {
    borderRight: "none",
  },
});

export const ThumbnailDayTitle = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  padding: "8px 2px",
  borderBottom: "1px solid #EDF1F2",

  strong: {
    color: "#005259",
    fontSize: "9px",
  },

  span: {
    color: "#81929A",
    fontSize: "7px",
    whiteSpace: "nowrap",
  },

  "@media (max-width: 767px)": {
    padding: "5px 2px",

    strong: {
      fontSize: "8px",
    },

    span: {
      fontSize: "6px",
    },
  },
});

export const ThumbnailPlaces = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  padding: "6px 4px",
  overflow: "hidden",
});

export const ThumbnailPlace = styled.div<{ $color: number }>(({ $color }) => {
  const colors = [
    { bg: "#E7F8F0", text: "#087E64" },
    { bg: "#EAF2FF", text: "#4774B5" },
    { bg: "#FFF0F0", text: "#D96A77" },
    { bg: "#FFF4E6", text: "#D78A3E" },
    { bg: "#F1EBFF", text: "#8063BC" },
    { bg: "#EAF7F7", text: "#318E94" },
  ];

  const color = colors[$color % colors.length];

  return {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
    padding: "6px 4px",
    borderRadius: "4px",
    backgroundColor: color.bg,

    span: {
      color: color.text,
      fontSize: "7px",
    },

    strong: {
      color: "#27424A",
      fontSize: "8px",
      lineHeight: 1.3,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },

    "@media (max-width: 767px)": {
      padding: "4px 2px",

      span: {
        fontSize: "6px",
      },

      strong: {
        fontSize: "7px",
      },
    },
  };
});

export const ShareActionList = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "10px",

  "@media (max-width: 767px)": {
    gap: "7px",
  },
});

export const ShareActionButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  minHeight: "45px",
  padding: "10px",
  border: "1px solid #C5EEE5",
  borderRadius: "8px",
  backgroundColor: "#E1FAF3",
  color: "#005259",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "#CBF4E9",
  },

  "&:disabled": {
    opacity: 0.6,
    cursor: "wait",
  },

  "@media (max-width: 767px)": {
    gap: "5px",
    padding: "9px 5px",
    fontSize: "11px",

    "& svg": {
      width: "16px",
      height: "16px",
      flexShrink: 0,
    },
  },
});

export const BottomArea = styled.div({
  paddingTop: "12px",
  borderTop: "1px solid #E8EBF0",
});

export const BottomCloseButton = styled.button({
  width: "100%",
  height: "38px",
  border: "1px solid #C8D2DF",
  borderRadius: "7px",
  backgroundColor: "#F7F9FC",
  color: "#0C293D",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "#EDF4F5",
  },
});
