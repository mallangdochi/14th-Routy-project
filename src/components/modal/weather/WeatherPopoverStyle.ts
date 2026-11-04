import styled from "@emotion/styled";
import { modalAnimation } from "../../../styles/animation";

export const Trigger = styled.button({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  color: "#0d3e41",
  fontSize: 16,
  textAlign: "left",

  svg: {
    width: 22,
    height: 22,
    flexShrink: 0,
  },

  "&:focus-visible": {
    outline: "2px solid #527f79",
    outlineOffset: 4,
  },

  "@media (max-width: 767px)": {
    fontSize: 14,
    minHeight: 44,
    gap: 6,
  },
});

export const Layer = styled.div({
  position: "fixed",
  inset: 0,
  zIndex: 1500,
  pointerEvents: "none",
  color: "#0d3e41",

  "button:focus-visible, a:focus-visible": {
    outline: "2px solid #527f79",
    outlineOffset: 3,
  },
});

export const Backdrop = styled.div({
  display: "none",

  "@media (max-width: 767px)": {
    display: "block",
    position: "absolute",
    inset: 0,
    background: "#0d3e4138",
    pointerEvents: "auto",
  },
});

export const Panel = styled.div(modalAnimation, {
  position: "absolute",
  width: 370,
  maxWidth: "calc(100vw - 24px)",
  maxHeight: "calc(100dvh - 24px)",
  overflowY: "auto",
  overscrollBehavior: "contain",
  pointerEvents: "auto",
  background: "#f4f6ee",
  border: "1px solid #dce5de",
  borderRadius: 22,
  boxShadow: "0 14px 36px #0d3e4114",

  "@media (max-width: 767px)": {
    left: 0,
    top: "auto",
    bottom: 0,
    width: "100%",
    maxWidth: "none",
    maxHeight: "calc(100dvh - 24px)",
    borderRadius: "24px 24px 0 0",
    borderBottom: 0,
    paddingBottom: "env(safe-area-inset-bottom)",
  },
});

export const Handle = styled.div({
  display: "none",

  "@media (max-width: 767px)": {
    display: "block",
    width: 38,
    height: 4,
    borderRadius: 9,
    background: "#bdc9c3",
    margin: "10px auto 0",
  },
});

export const Main = styled.div({
  background: "linear-gradient(165deg, #f9f8ed, #e9f0e5)",
  // padding: "16px 20px 15px",
  padding: 20,
});

export const Header = styled.div({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 10,
});

export const Location = styled.div({
  fontSize: 18,
  fontWeight: 700,
});

export const Updated = styled.div({
  fontSize: 12,
  color: "#718596",
  marginTop: 5,
});

export const Close = styled.button({
  display: "grid",
  placeItems: "center",
  minWidth: 36,
  minHeight: 36,
  color: "#596d75",
  margin: "-5px -6px 0 0",

  svg: {
    width: 19,
    height: 19,
  },

  "@media (pointer: coarse)": {
    minWidth: 44,
    minHeight: 44,
  },
});

export const Current = styled.div({
  textAlign: "center",
  paddingTop: 20,

  ".condition": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    fontSize: 16,
    fontWeight: 600,
  },

  ".condition svg": {
    width: 27,
    height: 27,
    color: "#eb654b",
    strokeWidth: 1.6,
  },

  ".temperature": {
    fontSize: 66,
    fontWeight: 750,
    letterSpacing: -4,
    lineHeight: 1.1,
    marginTop: 4,
  },

  ".feels": {
    fontSize: 14,
    color: "#596d75",
    marginTop: 5,
  },

  ".highlow": {
    fontSize: 14,
    color: "#527f79",
    marginTop: 5,
  },
});

export const Lower = styled.div({
  padding: "0 12px 10px",
});

export const Week = styled.section({
  background: "#fff",
  borderRadius: 15,
  // padding: "13px 0 8px",
  padding: "10px 0 3px",
  // padding: "10px 0",

  h3: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    fontSize: 16,
    padding: "0 16px",
    marginBottom: 8,
  },

  "h3 span": {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
  },

  "h3 svg": {
    width: 18,
    height: 18,
    color: "#527f79",
  },

  ".hint": {
    fontSize: 11,
    fontWeight: 400,
    color: "#718596",
  },
});

export const Forecast = styled.div({
  display: "flex",
  justifyContent: "flex-start",
  direction: "ltr",
  gap: 8,
  minWidth: 0,
  overflowX: "auto",
  overflowY: "hidden",
  // padding: "0 0 6px",
  scrollSnapType: "x mandatory",
  scrollPaddingInline: "16px",
  overscrollBehaviorX: "contain",
  scrollbarWidth: "thin",
  scrollbarColor: "transparent transparent",

  "&::-webkit-scrollbar": {
    height: 8,
  },

  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },

  "&::-webkit-scrollbar-thumb": {
    background: "transparent",
    borderRadius: 999,
  },

  "&::-webkit-scrollbar-button": {
    display: "none",
    width: 0,
    height: 0,
  },

  "@media (hover: hover) and (pointer: fine)": {
    "section:hover &, &:focus-visible": {
      scrollbarColor: "#cbd8d0 transparent",
    },

    "section:hover &::-webkit-scrollbar-thumb, &:focus-visible::-webkit-scrollbar-thumb":
      {
        background: "#cbd8d0",
      },
  },

  "@media (hover: none), (pointer: coarse)": {
    scrollbarWidth: "none",
    paddingBottom: 14,

    "&::-webkit-scrollbar": {
      display: "none",
      height: 0,
    },
  },

  "&::before, &::after": {
    content: '""',
    flex: "0 0 8px",
  },

  ".day": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: "0 0 74px",
    gap: 8,
    minHeight: 42,
    padding: "8px 0",
    border: "1px dashed transparent",
    borderRadius: 10,
    fontSize: 14,
    scrollSnapAlign: "start",
  },

  '.day[data-today="true"]': {
    borderColor: "#527f79",
  },

  ".date": {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
  },

  small: {
    fontSize: 11,
    color: "#718596",
  },

  ".weather": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  ".weather svg": {
    width: 28,
    height: 28,
    flexShrink: 0,
    color: "#527f79",
    margin: "2px 0",
  },

  ".rain": {
    fontSize: 12,
    color: "#527f79",
  },

  ".range": {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    fontVariantNumeric: "tabular-nums",
  },

  ".low": {
    color: "#718596",
  },
});

export const Footer = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 10,
  fontSize: 11,
  color: "#718596",
  padding: "12px 5px 0",

  a: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    marginLeft: "auto",
    textUnderlineOffset: 3,
  },
});

export const Message = styled.div({
  padding: "22px 0",
  fontSize: 14,
  color: "#596d75",
  textAlign: "center",

  button: {
    display: "block",
    margin: "12px auto 0",
    border: "1px solid #cbd8d4",
    background: "#fff",
    color: "#0d5357",
    borderRadius: 8,
    padding: "8px 15px",
  },
});
