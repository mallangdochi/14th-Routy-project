import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const orbit = keyframes({
  from: {
    transform: "rotate(0deg)",
  },
  to: {
    transform: "rotate(360deg)",
  },
});

export const AirplaneLoaderStyle = styled.div({
  "--loader-color": "#246b65",
  "--loader-track": "#cbded8",
  "--loader-pin-background": "#e7efeb",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  width: "100%",
  height: "100vh",

  "& .loader-graphic": {
    position: "relative",
    width: 140,
    height: 140,
    marginBottom: 28,
    flexShrink: 0,
  },

  "& .loader-track": {
    position: "absolute",
    inset: 14,
    border: "1px dashed var(--loader-track)",
    borderRadius: "50%",
  },

  "& .loader-orbit": {
    position: "absolute",
    inset: 14,
    animation: `${orbit} 3.2s linear infinite`,
  },

  "& .loader-tail": {
    position: "absolute",
    inset: -0.5,
    borderRadius: "50%",

    background:
      "conic-gradient(from 270deg, transparent 0deg, var(--loader-color) 65deg, transparent 65deg)",

    maskImage:
      "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",

    WebkitMaskImage:
      "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
  },

  "& .loader-plane": {
    position: "absolute",
    top: -14,
    left: "calc(50% - 14px)",
    width: 28,
    height: 28,
    display: "block",
    fill: "currentColor",
    color: "var(--loader-color)",
    transform: "rotate(90deg)",
    transformOrigin: "center",
  },

  "& .loader-pin": {
    position: "absolute",
    inset: 40,
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    backgroundColor: "var(--loader-pin-background)",
    color: "var(--loader-color)",

    "& svg": {
      display: "block",
      width: 22,
      height: 22,
      fill: "currentColor",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& .loader-orbit": {
      animation: "none",
    },
  },
});

export const Description = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,

  "& p": { fontSize: 18 },
  "& .bold": {
    fontSize: 20,
    color: "var(--loader-color)",
    fontWeight: 700,
  },
  "@media (max-width:1023px)": {
    "& .bold": {
      fontSize: 18,
    },
    "& p": { fontSize: 17 },
  },
  "@media (max-width:767px)": {
    "& p": { fontSize: 16 },
  },
});
