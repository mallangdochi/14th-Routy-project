import styled from "@emotion/styled";

const CENTERED_FLEX = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

// 공유하기 모달
export const ShareOverlay = styled.div({
  position: "fixed",
  inset: 0,
  zIndex: 2000,
  ...CENTERED_FLEX,
  padding: "20px",
  backgroundColor: "rgba(0,0,0,0.38)",

  "@media (max-width: 767px)": {
    padding: "12px",
    alignItems: "center",
  },
});

export const ShareModal = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "420px",
  maxHeight: "90vh",
  minHeight: "500px",
  overflow: "hidden",
  borderRadius: "12px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 12px 35px rgba(0,0,0,0.15)",

  "@media (max-width: 767px)": {
    width: "100%",
    maxWidth: "380px",
    minWidth: 0,
    minHeight: 0,
    maxHeight: "calc(100dvh - 24px)",
    borderRadius: "14px",
  },
});

export const ShareBanner = styled.div({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  height: "155px",
  padding: "20px 30px",
  overflow: "hidden",
  background: "linear-gradient(110deg, #E9FFF7 0%, #F5FFFB 50%, #D5F8EA 100%)",
  flexShrink: 0,

  "@media (max-width: 767px)": {
    height: "138px",
    minHeight: "138px",
    padding: "18px 14px",
    alignItems: "center",
  },
});

export const ShareBannerText = styled.div({
  position: "relative",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  gap: "8px",

  h2: {
    margin: 0,
    color: "#082B3D",
    fontSize: "26px",
    fontWeight: 800,
    letterSpacing: "-1px",
  },

  p: {
    margin: 0,
    color: "#637889",
    fontSize: "14px",
  },

  "@media (max-width: 767px)": {
    position: "relative",
    zIndex: 1,
    width: "calc(100% - 125px)",
    minWidth: 0,
    marginLeft: "8px",
    gap: "7px",

    h2: {
      fontSize: "18px",
      lineHeight: 1.3,
      whiteSpace: "nowrap",
    },

    p: {
      fontSize: "13px",
      lineHeight: 1.4,
      whiteSpace: "normal",
      wordBreak: "keep-all",
    },
  },
});

export const ShareMascot = styled.div({
  position: "absolute",
  right: "12px",
  bottom: "0",

  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",

  width: "180px",
  height: "150px",

  pointerEvents: "none",
  zIndex: 1,

  "& img": {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center bottom",
  },

  "@media (max-width: 1023px)": {
    right: "10px",
    width: "170px",
    height: "145px",
  },

  "@media (max-width: 767px)": {
    right: "6px",
    bottom: 0,
    width: "132px",
    height: "124px",
    objectFit: "contain",
    objectPosition: "right bottom",
  },
});

export const ShareCloseButton = styled.button({
  position: "absolute",
  top: "10px",
  right: "10px",
  zIndex: 5,
  ...CENTERED_FLEX,
  width: "28px",
  height: "28px",
  padding: 0,
  border: "none",
  borderRadius: "50%",
  backgroundColor: "transparent",
  color: "#607789",

  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.06)",
  },
});

export const ShareModalBody = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "14px 24px 32px",
  overflowY: "auto",

  "@media (max-width: 767px)": {
    minHeight: 0,
    gap: "14px",
    padding: "14px 14px 20px",
    overflowY: "auto",
    overscrollBehavior: "contain",
  },
});

export const ShareSection = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "100%",
});

export const ShareSectionTitle = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#0C293D",

  strong: {
    fontSize: "13px",
    fontWeight: 700,
  },
});
// 공유 접근 권한
export const PermissionList = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "7px",
  padding: "6px",
  border: "1px solid #E8EBF0",
  borderRadius: "10px",

  "@media (max-width: 767px)": {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    width: "100%",
    gap: "6px",
    padding: 0,
    margin: 0,
    border: "none",
    backgroundColor: "transparent",
  },
});

export const PermissionCard = styled.button<{
  $active: boolean;
}>(({ $active }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  minWidth: 0,
  minHeight: "64px",
  padding: "11px 9px",
  border: $active ? "1px solid #00B982" : "1px solid #E2E8F0",
  borderRadius: "8px",
  backgroundColor: $active ? "#EDFFF8" : "#FFFFFF",
  textAlign: "left",
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: "#00B982",
  },

  "@media (max-width: 767px)": {
    minWidth: 0,
    minHeight: 0,
    height: "auto",
    padding: "8px 6px",
    gap: "4px",
    alignItems: "flex-start",
  },
}));

export const PermissionRadio = styled.span<{
  $active: boolean;
}>(({ $active }) => ({
  position: "relative",
  display: "block",
  width: "18px",
  height: "18px",
  flexShrink: 0,
  border: $active ? "1.5px solid #008C72" : "1.5px solid #C8D2DF",
  borderRadius: "50%",
  backgroundColor: "#FFFFFF",

  "&::after": {
    content: '""',
    display: $active ? "block" : "none",
    position: "absolute",
    inset: "3px",
    borderRadius: "50%",
    backgroundColor: "#008C72",
  },

  "@media (max-width: 767px)": {
    width: "15px",
    height: "15px",
  },
}));

export const PermissionInfo = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  minWidth: 0,

  "& > span": {
    color: "#738197",
    fontSize: "10px",
    whiteSpace: "nowrap",
  },

  "@media (max-width: 767px)": {
    flex: 1,
    minWidth: 0,
    gap: "5px",

    "& > span": {
      fontSize: "9px",
      lineHeight: 1.4,
      whiteSpace: "normal",
      wordBreak: "keep-all",
    },
  },
});

export const PermissionName = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#092A40",

  strong: {
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  "@media (max-width: 767px)": {
    gap: "4px",
    minWidth: 0,

    "& svg": {
      width: "13px",
      height: "13px",
      flexShrink: 0,
    },

    strong: {
      fontSize: "11px",
      whiteSpace: "nowrap",
    },
  },
});
// 공유 링크
export const ShareLinkBox = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  width: "100%",
  padding: "4px",
  border: "1px solid #D9E2EC",
  borderRadius: "7px",
  backgroundColor: "#FFFFFF",

  "@media (max-width: 767px)": {
    minWidth: 0,
    gap: "4px",
    padding: "4px",
  },
});

export const ShareLinkText = styled.input({
  flex: 1,
  minWidth: 0,
  height: "30px",
  padding: "0 10px",
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  color: "#203B53",
  fontSize: "12px",
  fontWeight: 500,

  "@media (max-width: 767px)": {
    flex: "1 1 0",
    minWidth: 0,
    padding: "0 6px",
    fontSize: "10px",
    textOverflow: "ellipsis",
  },
});

export const CopyLinkButton = styled.button({
  ...CENTERED_FLEX,
  gap: "7px",
  height: "31px",
  padding: "0 12px",
  flexShrink: 0,
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#00594F",
  color: "#FFFFFF",
  fontSize: "11px",
  fontWeight: 600,

  "&:hover": {
    backgroundColor: "#00786B",
  },

  "@media (max-width: 767px)": {
    flexShrink: 0,
    height: "30px",
    padding: "0 8px",
    gap: "4px",
    fontSize: "10px",

    "& svg": {
      width: "12px",
      height: "12px",
    },
  },
});
// 다른 방법으로 공유
export const SharePlatformList = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "12px",
  padding: "8px 10px 0",

  "@media (max-width: 767px)": {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    alignItems: "start",
    justifyItems: "center",
    width: "100%",
    minWidth: 0,
    gap: "6px",
    padding: "8px 0 0",
  },
});

export const SharePlatformButton = styled.button({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  padding: 0,
  border: "none",
  backgroundColor: "transparent",
  color: "#33465D",
  fontSize: "11px",
  fontWeight: 600,

  "&:hover": {
    opacity: 0.75,
  },

  "@media (max-width: 767px)": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    minWidth: 0,
    gap: "7px",
    padding: "0 2px",
    border: "none",
    backgroundColor: "transparent",

    "& span": {
      fontSize: "11px",
      lineHeight: 1.3,
      whiteSpace: "nowrap",
      wordBreak: "keep-all",
      textAlign: "center",
    },
  },
});

export const SharePlatformIcon = styled.div<{
  $platform: "naver" | "kakao" | "email";
}>(({ $platform }) => ({
  ...CENTERED_FLEX,
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  backgroundColor:
    $platform === "naver"
      ? "#03C75A"
      : $platform === "kakao"
        ? "#FEE500"
        : "#F1F6F7",
  color: $platform === "naver" ? "#FFFFFF" : "#102C3D",
  fontSize: "27px",
  fontWeight: 900,
  fontFamily: "Arial, sans-serif",

  "@media (max-width: 767px)": {
    width: "42px",
    height: "42px",
    minWidth: "42px",
    minHeight: "42px",
    flexShrink: 0,
    fontSize: "20px",

    "& svg": {
      width: "20px",
      height: "20px",
    },
  },
}));

export const KakaoBubble = styled.div({
  position: "relative",
  width: "26px",
  height: "22px",
  borderRadius: "50%",
  backgroundColor: "#211D1D",

  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-3px",
    left: "5px",
    width: "9px",
    height: "8px",
    backgroundColor: "#211D1D",
    clipPath: "polygon(0 0, 100% 0, 0 100%)",
  },
});
