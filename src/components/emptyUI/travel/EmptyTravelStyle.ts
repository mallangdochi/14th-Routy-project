import styled from "@emotion/styled";

export const EmptyTravelStyle = styled.div({
  width: "100%",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  gap: 30,

  "@media (max-width: 767px)": {
    gap: 0,
  },
});

export const ImgStyle = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  flexShrink: 0,
  maxWidth: 500,

  "@media (max-width: 767px)": {
    width: "100%",
    marginBottom: "16px",

    "& img": {
      display: "block",
      width: "100%",
      maxWidth: "220px",
      height: "auto",
      objectFit: "contain",
    },
  },
});

export const DescStyle = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,

  "& h2": { color: "#172c3d", fontSize: 28, fontWeight: 700 },
  "& .phrase-wrapper": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
  "& p": {
    fontSize: 19,
  },
  "@media (max-width:1023px)": {
    "& h2": { fontSize: 24 },
    "& p": { fontSize: 17 },
  },

  "@media (max-width: 767px)": {
    width: "100%",
    gap: "8px",

    "& h2": {
      margin: 0,
      color: "#172c3d",
      fontSize: "24px",
      fontWeight: 700,
      letterSpacing: "-2px",
      lineHeight: "150%",
      textAlign: "center",
    },

    "& .phrase-wrapper": {
      gap: 0,
    },

    "& p": {
      margin: 0,
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: 1.4,
      textAlign: "center",
      wordBreak: "keep-all",
    },
  },
});

export const ButtonArea = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",

  "@media (max-width: 767px)": {
    marginTop: "16px",
  },
});

export const ButtonStyle = styled.button({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",

  minWidth: "280px",

  padding: "11px 20px",
  borderRadius: "8px",
  backgroundColor: "#005358",
  color: "#fff",
  fontWeight: 700,
  fontSize: 19,

  "&:hover": {
    backgroundColor: "#00666b",
  },
  "@media (max-width:1023px)": {
    minWidth: "250px",
    fontSize: 17,
  },

  "@media (max-width: 767px)": {
    width: "100%",
    maxWidth: "230px",
    minWidth: 0,

    height: "48px",
    minHeight: "48px",
    padding: "13px 16px",
    boxSizing: "border-box",

    gap: "8px",
    borderRadius: "16px",

    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "22px",

    "& svg": {
      width: "24px",
      height: "24px",
      flexShrink: 0,
    },
  },
});
