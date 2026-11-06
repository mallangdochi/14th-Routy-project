// import styled from "@emotion/styled";
// import {
//   ShareBanner,
//   ShareBannerText,
//   ShareMascot as BaseShareMascot,
//   ShareCloseButton as BaseShareCloseButton,
//   ShareModal as BaseShareModal,
// } from "../share/ShareModalStyle";
// import { modalAnimation } from "../../../styles/animation";

// export {
//   ShareOverlay,
//   ShareSection,
//   ShareSectionTitle,
//   SharePlatformList,
//   SharePlatformButton,
//   SharePlatformIcon,
//   KakaoBubble,
// } from "../share/ShareModalStyle";

// export const ShareModal = styled(BaseShareModal)(modalAnimation);

// export const PreviewBanner = styled(ShareBanner)({
//   "--share-header-height": "120px",
//   "--share-mascot-height": "calc(var(--share-header-height) * 0.95)",
//   "--share-mascot-width": "calc(var(--share-mascot-height) * 100 / 96)",

//   position: "relative",
//   display: "grid",
//   gridTemplateColumns: "minmax(0, 1fr) var(--share-mascot-width)",
//   columnGap: "20px",
//   alignItems: "center",
//   boxSizing: "border-box",
//   width: "100%",
//   height: "var(--share-header-height)",
//   minHeight: "var(--share-header-height)",
//   padding: "0 64px 0 32px",
//   overflow: "hidden",
//   background: "#E9FFF7",
//   flexShrink: 0,

//   "@media (max-width: 767px)": {
//     "--share-header-height": "104px",
//     "--share-mascot-width": "calc(var(--share-mascot-height) * 100 / 96)",

//     display: "grid",
//     gridTemplateColumns: "minmax(0, 1fr) var(--share-mascot-width)",
//     columnGap: "12px",
//     height: "var(--share-header-height)",
//     minHeight: "var(--share-header-height)",
//     padding: "0 56px 0 16px",
//   },
// });

// export const PreviewBannerText = styled(ShareBannerText)({
//   width: "100%",
//   minWidth: 0,
//   maxWidth: "none",
//   margin: 0,
//   gap: "6px",

//   "& h2": {
//     margin: 0,
//     fontSize: "20px",
//     lineHeight: 1.3,
//     whiteSpace: "normal",
//     wordBreak: "keep-all",
//   },

//   "& p": {
//     margin: 0,
//     fontSize: "12px",
//     lineHeight: 1.4,
//     whiteSpace: "normal",
//     wordBreak: "keep-all",
//   },

//   "@media (max-width: 767px)": {
//     width: "100%",
//     minWidth: 0,
//     maxWidth: "none",
//     marginLeft: 0,
//     gap: "5px",

//     "& h2": {
//       fontSize: "17px",
//       whiteSpace: "normal",
//     },

//     "& p": {
//       fontSize: "11px",
//       whiteSpace: "normal",
//     },
//   },
// });

// export const ShareMascot = styled(BaseShareMascot)({
//   position: "static",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   alignSelf: "center",
//   width: "var(--share-mascot-width)",
//   height: "var(--share-mascot-height)",
//   minWidth: 0,
//   overflow: "visible",
//   pointerEvents: "none",

//   "& img": {
//     display: "block",
//     width: "100%",
//     height: "100%",
//     maxWidth: "none",
//     objectFit: "contain",
//     objectPosition: "center",
//     transform: "scale(1.25)",
//     transformOrigin: "center",
//   },

//   "@media (max-width: 1023px)": {
//     width: "var(--share-mascot-width)",
//     height: "var(--share-mascot-height)",
//   },

//   "@media (max-width: 767px)": {
//     width: "var(--share-mascot-width)",
//     height: "var(--share-mascot-height)",
//   },
// });

// export const ShareCloseButton = styled(BaseShareCloseButton)({
//   position: "absolute",
//   top: "12px",
//   right: "12px",
//   zIndex: 5,
//   width: "32px",
//   height: "32px",
//   minWidth: "32px",
//   padding: 0,
//   backgroundColor: "rgba(255, 255, 255, 0.85)",

//   "@media (hover: hover) and (pointer: fine)": {
//     "&:hover": {
//       backgroundColor: "#E2E6E9",
//     },
//   },
// });

// export const PreviewModalBody = styled.div({
//   display: "flex",
//   flexDirection: "column",
//   gap: "20px",
//   padding: "20px 24px 24px",
//   minHeight: 0,
//   overscrollBehavior: "contain",
//   overflowY: "auto",

//   "@media (max-width: 767px)": {
//     gap: "16px",
//     padding: "16px 14px 20px",
//   },
// });

// export const PreviewSection = styled.section({
//   display: "flex",
//   flexDirection: "column",
//   gap: "10px",
// });

// export const PreviewTitle = styled.h3({
//   color: "#0C293D",
//   fontSize: "13px",
//   fontWeight: 700,
// });

// export const PreviewThumbnail = styled.div({
//   width: "100%",
//   height: "210px",
//   overflow: "hidden",
//   border: "1px solid #E1EAE8",
//   borderRadius: "10px",
//   backgroundColor: "#F6FAF9",
//   padding: "10px",

//   "@media (max-width: 767px)": {
//     height: "180px",
//     padding: "7px",
//   },
// });

// export const ThumbnailCanvas = styled.div({
//   width: "100%",
//   height: "100%",
//   overflow: "hidden",
//   borderRadius: "6px",
//   backgroundColor: "#FFFFFF",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
// });

// export const ThumbnailHeader = styled.div({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   padding: "8px 12px",
//   backgroundColor: "#E9FFF7",
//   color: "#005259",

//   strong: {
//     fontSize: "11px",
//   },

//   span: {
//     fontSize: "9px",
//   },

//   "@media (max-width: 767px)": {
//     padding: "8px",

//     strong: {
//       fontSize: "9px",
//     },

//     span: {
//       fontSize: "8px",
//     },
//   },
// });

// export const ThumbnailTable = styled.div({
//   display: "flex",
//   width: "100%",
//   height: "calc(100% - 40px)",
//   overflow: "hidden",
// });

// export const ThumbnailDay = styled.div({
//   display: "flex",
//   flex: "1 1 0",
//   flexDirection: "column",
//   minWidth: 0,
//   borderRight: "1px solid #EDF1F2",

//   "&:last-child": {
//     borderRight: "none",
//   },
// });

// export const ThumbnailDayTitle = styled.div({
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   gap: "3px",
//   padding: "8px 2px",
//   borderBottom: "1px solid #EDF1F2",

//   strong: {
//     color: "#005259",
//     fontSize: "9px",
//   },

//   span: {
//     color: "#81929A",
//     fontSize: "7px",
//     whiteSpace: "nowrap",
//   },

//   "@media (max-width: 767px)": {
//     padding: "5px 2px",

//     strong: {
//       fontSize: "8px",
//     },

//     span: {
//       fontSize: "6px",
//     },
//   },
// });

// export const ThumbnailPlaces = styled.div({
//   display: "flex",
//   flexDirection: "column",
//   gap: "5px",
//   padding: "6px 4px",
//   overflow: "hidden",
// });

// export const ThumbnailPlace = styled.div<{ $color: number }>(({ $color }) => {
//   const colors = [
//     { bg: "#E7F8F0", text: "#087E64" },
//     { bg: "#EAF2FF", text: "#4774B5" },
//     { bg: "#FFF0F0", text: "#D96A77" },
//     { bg: "#FFF4E6", text: "#D78A3E" },
//     { bg: "#F1EBFF", text: "#8063BC" },
//     { bg: "#EAF7F7", text: "#318E94" },
//   ];

//   const color = colors[$color % colors.length];

//   return {
//     display: "flex",
//     flexDirection: "column",
//     gap: "3px",
//     minWidth: 0,
//     padding: "6px 4px",
//     borderRadius: "4px",
//     backgroundColor: color.bg,

//     span: {
//       color: color.text,
//       fontSize: "7px",
//     },

//     strong: {
//       color: "#27424A",
//       fontSize: "8px",
//       lineHeight: 1.3,
//       overflow: "hidden",
//       textOverflow: "ellipsis",
//       whiteSpace: "nowrap",
//     },

//     "@media (max-width: 767px)": {
//       padding: "4px 2px",

//       span: {
//         fontSize: "6px",
//       },

//       strong: {
//         fontSize: "7px",
//       },
//     },
//   };
// });

// export const ShareActionList = styled.div({
//   display: "grid",
//   gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
//   gap: "13px",

//   "@media (max-width: 767px)": {
//     gap: "7px",
//   },
// });

// export const ShareActionButton = styled.button({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: "8px",
//   minHeight: "45px",
//   padding: "10px",
//   border: "1px solid #C5EEE5",
//   borderRadius: "8px",
//   backgroundColor: "#E1FAF3",
//   color: "#005259",
//   fontSize: "13px",
//   fontWeight: 700,

//   "&:hover": {
//     backgroundColor: "#CBF4E9",
//   },

//   "&:disabled": {
//     opacity: 0.6,
//     cursor: "wait",
//   },

//   "@media (max-width: 767px)": {
//     gap: "5px",
//     padding: "9px 5px",
//     fontSize: "11px",

//     "& svg": {
//       width: "16px",
//       height: "16px",
//       flexShrink: 0,
//     },
//   },
// });

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  ShareOverlay as BaseShareOverlay,
  ShareBanner,
  ShareBannerText,
  ShareMascot as BaseShareMascot,
  ShareCloseButton as BaseShareCloseButton,
  ShareModal as BaseShareModal,
} from "../share/ShareModalStyle";
import { modalAnimation } from "../../../styles/animation";

export {
  ShareSection,
  ShareSectionTitle,
  SharePlatformList,
  SharePlatformButton,
  SharePlatformIcon,
  KakaoBubble,
} from "../share/ShareModalStyle";

const sheetEnter = keyframes({
  from: {
    transform: "translateY(100%)",
  },
  to: {
    transform: "translateY(0)",
  },
});

const sheetExit = keyframes({
  from: {
    transform: "translateY(0)",
  },
  to: {
    transform: "translateY(100%)",
  },
});

export const ShareOverlay = styled(BaseShareOverlay)({
  "@media (max-width: 767px)": {
    alignItems: "flex-end",
    justifyContent: "center",
    padding: 0,
  },
});

export const ShareModal = styled(BaseShareModal)(modalAnimation, {
  "@media (max-width: 767px)": {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    minHeight: 0,
    maxHeight: "calc(100dvh - env(safe-area-inset-top) - 12px)",
    margin: 0,
    borderRadius: "20px 20px 0 0",
    transformOrigin: "center bottom",
    opacity: 1,
    animation: `${sheetEnter} 320ms cubic-bezier(0.22, 1, 0.36, 1) both`,

    '&[data-open="false"]': {
      pointerEvents: "none",
      animation: `${sheetExit} 270ms ease-in both`,
    },
  },

  "@media (max-width: 767px) and (prefers-reduced-motion: reduce)": {
    animationDuration: "1ms",

    '&[data-open="false"]': {
      animationDuration: "1ms",
    },
  },
});

export const PreviewBanner = styled(ShareBanner)({
  "--share-header-height": "120px",
  "--share-mascot-height": "calc(var(--share-header-height) * 0.95)",
  "--share-mascot-width": "calc(var(--share-mascot-height) * 100 / 96)",

  position: "relative",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) var(--share-mascot-width)",
  columnGap: "20px",
  alignItems: "center",
  boxSizing: "border-box",
  width: "100%",
  height: "var(--share-header-height)",
  minHeight: "var(--share-header-height)",
  padding: "0 64px 0 32px",
  overflow: "hidden",
  background: "#E9FFF7",
  flexShrink: 0,

  "@media (max-width: 767px)": {
    "--share-header-height": "104px",
    "--share-mascot-width": "calc(var(--share-mascot-height) * 100 / 96)",

    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) var(--share-mascot-width)",
    columnGap: "12px",
    height: "var(--share-header-height)",
    minHeight: "var(--share-header-height)",
    padding: "0 56px 0 16px",
  },
});

export const PreviewBannerText = styled(ShareBannerText)({
  width: "100%",
  minWidth: 0,
  maxWidth: "none",
  margin: 0,
  gap: "6px",

  "& h2": {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.3,
    whiteSpace: "normal",
    wordBreak: "keep-all",
  },

  "& p": {
    margin: 0,
    fontSize: "12px",
    lineHeight: 1.4,
    whiteSpace: "normal",
    wordBreak: "keep-all",
  },

  "@media (max-width: 767px)": {
    width: "100%",
    minWidth: 0,
    maxWidth: "none",
    marginLeft: 0,
    gap: "5px",

    "& h2": {
      fontSize: "17px",
      whiteSpace: "normal",
    },

    "& p": {
      fontSize: "11px",
      whiteSpace: "normal",
    },
  },
});

export const ShareMascot = styled(BaseShareMascot)({
  position: "static",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "center",
  width: "var(--share-mascot-width)",
  height: "var(--share-mascot-height)",
  minWidth: 0,
  overflow: "visible",
  pointerEvents: "none",

  "& img": {
    display: "block",
    width: "100%",
    height: "100%",
    maxWidth: "none",
    objectFit: "contain",
    objectPosition: "center",
    transform: "scale(1.2)",
    transformOrigin: "center",
  },

  "@media (max-width: 1023px)": {
    width: "var(--share-mascot-width)",
    height: "var(--share-mascot-height)",
  },

  "@media (max-width: 767px)": {
    width: "var(--share-mascot-width)",
    height: "var(--share-mascot-height)",
  },
});

export const ShareCloseButton = styled(BaseShareCloseButton)({
  position: "absolute",
  top: "12px",
  right: "12px",
  zIndex: 5,
  width: "32px",
  height: "32px",
  minWidth: "32px",
  padding: 0,
  backgroundColor: "rgba(255, 255, 255, 0.85)",

  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      backgroundColor: "#E2E6E9",
    },
  },
});

export const PreviewModalBody = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "20px 24px 24px",
  minHeight: 0,
  overscrollBehavior: "contain",
  overflowY: "auto",

  "@media (max-width: 767px)": {
    gap: "16px",
    padding: "16px 14px calc(20px + env(safe-area-inset-bottom))",
  },
});

export const PreviewSection = styled.section({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const PreviewTitle = styled.h3({
  color: "#0C293D",
  fontSize: "13px",
  fontWeight: 700,
});

export const PreviewThumbnail = styled.div({
  width: "100%",
  height: "210px",
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
  padding: "8px 12px",
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
  gap: "13px",

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
