import styled from "@emotion/styled";

const CENTERED_FLEX = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

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
  fontSize: "12px",
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
  $platform: "line" | "kakao" | "email";
}>(({ $platform }) => ({
  ...CENTERED_FLEX,
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  background:
    $platform === "line"
      ? "#06C755"
      : $platform === "kakao"
        ? "#FEE500"
        : "#F1F6F7",
  color: $platform === "line" ? "#FFFFFF" : "#102C3D",
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
