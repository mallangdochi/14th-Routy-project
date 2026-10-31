import styled from "@emotion/styled";
import { modalAnimation } from "../../../styles/animation";

export const Dialog = styled.dialog(
  {
    width: "min(560px, calc(100% - 32px))",
    maxHeight: "min(760px, calc(100dvh - 48px))",
    margin: "auto",
    padding: 0,
    border: "1px solid #E2E6E9",
    borderRadius: "20px",
    background: "#fff",
    color: "#0D3E41",
    fontFamily: "inherit",
    fontSize: "16px",
    overflow: "visible",
    boxShadow: "0 24px 80px rgb(13 62 65 / 18%)",

    "&::backdrop": {
      backgroundColor: "rgb(13 35 39 / 38%)",
    },

    "@media (max-width: 767px)": {
      width: "100%",
      maxWidth: "100%",
      maxHeight: "90dvh",
      margin: "auto 0 0",
      borderRadius: "20px 20px 0 0",
      fontSize: "14px",
    },
  },
  modalAnimation,
);

const hoverMedia =
  "@media (min-width: 768px) and (hover: hover) and (pointer: fine)";

const buttonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  borderRadius: "10px",
  font: "inherit",
  fontWeight: 600,
  cursor: "pointer",

  transition:
    "background-color 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",

  "&:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: "3px",
  },

  "&:disabled": {
    opacity: 0.45,
    cursor: "not-allowed",
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",

    "&&:hover:not(:disabled), &&:active:not(:disabled)": {
      transform: "none",
    },
  },
} as const;

// export const Form = styled.form({
//   display: "flex",
//   flexDirection: "column",
//   maxHeight: "inherit",
//   minHeight: 0,
// });

export const Header = styled.header({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "12px",
  padding: "26px 26px 22px",
  borderBottom: "1px solid #E2E6E9",
  flexShrink: 0,

  "@media (max-width: 767px)": {
    padding: "24px 20px 18px",
  },
});

export const Title = styled.h2({
  display: "flex",
  alignItems: "center",
  gap: "9px",
  margin: 0,
  fontSize: "22px",
  fontWeight: 700,
  lineHeight: 1.4,

  "& svg": {
    width: "23px",
    height: "23px",
    flexShrink: 0,
  },

  "@media (max-width: 767px)": {
    fontSize: "20px",
  },
});

export const Description = styled.p({
  margin: "9px 0 0",
  color: "#718596",
  fontSize: "0.875em",
  lineHeight: 1.6,
});

export const CloseButton = styled.button({
  ...buttonBase,

  width: "36px",
  height: "36px",
  padding: 0,
  flexShrink: 0,
  border: 0,
  background: "transparent",
  color: "#596D75",

  [hoverMedia]: {
    "&:hover:not(:disabled)": {
      transform: "translateY(-1px)",
      backgroundColor: "#EDF7F4",
      color: "#005358",
    },

    "&:active:not(:disabled)": {
      transform: "translateY(0)",
    },
  },
});

// export const Body = styled.div({
//   minHeight: 0,
//   overflowY: "auto",
//   overscrollBehavior: "contain",
//   padding: "22px 26px",

//   "@media (max-width: 767px)": {
//     padding: "20px",
//   },
// });

export const Form = styled.form({
  display: "flex",
  flexDirection: "column",
  maxHeight: "inherit",
  minHeight: 0,
  overflow: "visible",
  borderRadius: "inherit",
});

export const Body = styled.div({
  position: "relative",
  zIndex: 1,
  minHeight: 0,
  overflow: "visible",
  padding: "22px 26px",

  "&&": {
    overflow: "visible",
  },

  "@media (max-width: 767px)": {
    padding: "20px",
  },
});

export const SectionHeading = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  marginBottom: "12px",

  "& span": {
    color: "#718596",
    fontSize: "0.875em",
  },
});

export const DateList = styled.ul({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const DateRow = styled.li({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px",
  border: "1px solid #E2E6E9",
  borderRadius: "12px",
  minWidth: 0,

  "@media (max-width: 767px)": {
    gap: "9px",
    padding: "12px",
  },
});

export const DayBadge = styled.span({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  padding: "7px 10px",
  borderRadius: "8px",
  background: "#EDF7F4",
  color: "#005358",
  fontSize: "0.875em",
  fontWeight: 700,
  whiteSpace: "nowrap",
});

export const DateInfo = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  flex: "1 1 0",
  minWidth: 0,

  "& time": {
    fontWeight: 500,
    overflowWrap: "anywhere",
  },

  "& small": {
    fontSize: "0.8em",
    color: "#718596",
  },
});

export const DeleteButton = styled.button({
  ...buttonBase,

  flexShrink: 0,
  minHeight: "36px",
  padding: "7px",
  border: 0,
  background: "transparent",
  color: "#D9523A",
  fontSize: "0.875em",

  [hoverMedia]: {
    "&:hover:not(:disabled)": {
      transform: "translateY(-1px)",
      backgroundColor: "#FFF0EC",
      color: "#BC3E29",
    },

    "&:active:not(:disabled)": {
      transform: "translateY(0)",
    },
  },

  "@media (max-width: 360px)": {
    "& span": {
      display: "none",
    },
  },
});

export const EmptyText = styled.li({
  padding: "20px 0",
  textAlign: "center",
  color: "#718596",
});

export const AddArea = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "24px",

  "& label": {
    fontWeight: 600,
  },
});

export const AddControls = styled.div({
  display: "flex",
  alignItems: "flex-end",
  gap: "10px",

  "& > button": {
    minHeight: "46px",
  },
});

export const DatePickerArea = styled.div({
  flex: "1 1 0",
  minWidth: 0,

  "& > div": {
    width: "100%",
    minWidth: 0,
    fontSize: "inherit",
  },

  "& .picker-label": {
    display: "block",
    marginBottom: "10px",
    color: "#0D3E41",
    fontSize: "inherit",
    fontWeight: 600,
  },

  "& .picker-trigger": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    width: "100%",
    minWidth: 0,
    minHeight: "46px",
    padding: "10px 12px",
    border: "1px solid #D4DFE5",
    borderRadius: "10px",
    backgroundColor: "#fff",
    color: "#304544",
    font: "inherit",
    boxSizing: "border-box",
    cursor: "pointer",
    transition: "border-color 200ms ease, background-color 200ms ease",
  },

  "& .picker-trigger > span": {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  "& .picker-trigger > svg": {
    width: "19px",
    height: "19px",
    flexShrink: 0,
  },

  "& .picker-trigger:focus-visible": {
    borderColor: "#527F79",
    outline: "2px solid #527F79",
    outlineOffset: "2px",
  },

  "& .picker-trigger:disabled": {
    opacity: 0.45,
    cursor: "not-allowed",
  },

  // 이 모달 안에서만 달력을 일반 흐름에 배치합니다.
  // "& .picker-popup": {
  //   position: "relative",
  //   inset: "auto",
  //   width: "100%",
  //   minWidth: 0,
  //   maxWidth: "100%",
  //   marginTop: "10px",
  //   boxSizing: "border-box",
  // },
  "&& .picker-popup": {
    position: "absolute",
    top: "auto",
    right: "auto",
    bottom: "calc(46px + 8px)",
    left: 0,
    zIndex: 100,
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    margin: 0,
    border: "1px solid #D8E3DC",
    borderRadius: "12px",
    backgroundColor: "#FFFEFB",
    boxShadow: "0 -8px 28px rgb(13 62 65 / 18%)",
    boxSizing: "border-box",
  },

  "@media (min-width: 768px) and (hover: hover) and (pointer: fine)": {
    "& .picker-trigger:hover:not(:disabled)": {
      borderColor: "#527F79",
      backgroundColor: "#F8FBFA",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& .picker-trigger": {
      transition: "none",
    },
  },
});

export const AddButton = styled.button({
  ...buttonBase,

  minHeight: "46px",
  padding: "10px 16px",
  border: "1px solid #B9D2CC",
  background: "#EDF7F4",
  color: "#005358",
  flexShrink: 0,

  [hoverMedia]: {
    "&:hover:not(:disabled)": {
      transform: "translateY(-1px)",
      backgroundColor: "#DDEFE8",
      borderColor: "#8FB8AD",
      boxShadow: "0 3px 8px rgb(0 83 88 / 10%)",
    },

    "&:active:not(:disabled)": {
      transform: "translateY(0)",
      boxShadow: "none",
    },
  },
});

export const Note = styled.p({
  display: "flex",
  alignItems: "flex-start",
  gap: "7px",
  margin: "16px 0 0",
  fontSize: "0.875em",
  color: "#718596",
  lineHeight: 1.6,

  "& svg": {
    flexShrink: 0,
    marginTop: "3px",
  },
});

export const ErrorText = styled.p({
  margin: "12px 0 0",
  color: "#C43D32",
  fontSize: "0.875em",
  lineHeight: 1.5,
});

export const Footer = styled.footer({
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  flexShrink: 0,
  padding: "18px 26px",
  borderTop: "1px solid #E2E6E9",

  "@media (max-width: 767px)": {
    padding: "16px 20px max(20px, env(safe-area-inset-bottom))",
  },
});

export const CancelButton = styled.button({
  ...buttonBase,

  minHeight: "44px",
  padding: "10px 22px",
  border: "1px solid #D4DFE5",
  color: "#596D75",
  background: "#fff",

  [hoverMedia]: {
    "&:hover:not(:disabled)": {
      transform: "translateY(-1px)",
      backgroundColor: "#F3F7F6",
      borderColor: "#AFC4BE",
      color: "#0D3E41",
    },

    "&:active:not(:disabled)": {
      transform: "translateY(0)",
    },
  },
});

export const ConfirmButton = styled.button({
  ...buttonBase,

  minHeight: "44px",
  padding: "10px 24px",
  border: "1px solid #005358",
  color: "#fff",
  background: "#005358",

  [hoverMedia]: {
    "&:hover:not(:disabled)": {
      transform: "translateY(-1px)",
      backgroundColor: "#003F43",
      borderColor: "#003F43",
      boxShadow: "0 4px 10px rgb(0 83 88 / 18%)",
    },

    "&:active:not(:disabled)": {
      transform: "translateY(0)",
      boxShadow: "none",
    },
  },
});
