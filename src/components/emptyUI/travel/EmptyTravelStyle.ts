import styled from "@emotion/styled";

export const EmptyTravelStyle = styled.div({
  width: "100%",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  gap: 30,
});

export const ImgStyle = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  flexShrink: 0,
  maxWidth: 500,
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
  "@media (max-width:767px)": {
    "& h2": { fontSize: 23 },
    "& p": { fontSize: 16 },
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
  "@media (max-width:767px)": {
    minWidth: "230px",
    fontSize: 16,
  },
});
