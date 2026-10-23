import styled from "@emotion/styled";
import stamp from "../../assets/stamp.svg";
import { keyframes } from "@emotion/react";

const teal = "#0A414B";
const gold = "#F5C71D";
const paper = "#FFFEFA";
const muted = "#778D90";

const appear = keyframes({
  from: { opacity: 0, transform: "translateY(8px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const stampPress = keyframes({
  "0%": {
    opacity: 0,
    transform: "translate3d(0, -72px, 0) scale(1.32) rotate(-10deg)",
    animationTimingFunction: "cubic-bezier(0.35, 0, 0.65, 1)",
  },
  "18%": {
    opacity: 1,
    transform: "translate3d(0, -51px, 0) scale(1.22) rotate(-9deg)",
    animationTimingFunction: "linear",
  },
  "63%": {
    opacity: 1,
    transform: "translate3d(0, 2px, 0) scale(0.92) rotate(-6deg)",
    animationTimingFunction: "cubic-bezier(0.2, 0.8, 0.25, 1)",
  },
  "82%": {
    opacity: 1,
    transform: "translate3d(0, -2px, 0) scale(1.035) rotate(-6deg)",
    animationTimingFunction: "ease-out",
  },
  "100%": {
    opacity: 1,
    transform: "translate3d(0, 0, 0) scale(1) rotate(-6deg)",
  },
});

const stampRipple = keyframes({
  "0%": { opacity: 0.5, transform: "scale(0.88)" },
  "100%": { opacity: 0, transform: "scale(1.24)" },
});

export const ProfileStage = styled.main({
  width: "100%",
  minWidth: "1440px",
  minHeight: "max(100dvh, 1040px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  backgroundColor: "#FBFAF6",
  color: teal,
  fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
  fontSize: "16px",
  boxSizing: "border-box",
  "&, *, *::before, *::after": { boxSizing: "border-box" },
  "@media (max-width: 1439px)": {
    minWidth: 0,
    minHeight: "100dvh",
  },
  "@media (min-width: 1025px) and (max-width: 1439px)": {
    minHeight: "max(100dvh, calc((100vw - 40px) * 0.62143 + 48px))",
  },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    padding: "18px",
  },
  "@media (max-width: 767px)": {
    padding: 0,
    minHeight: "100dvh",
  },
});

export const Passport = styled.div({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
  width: "1400px",
  height: "870px",
  minWidth: 0,
  flexShrink: 0,
  backgroundColor: paper,
  border: `9px solid ${teal}`,
  borderRadius: "9px",
  boxShadow: "0 18px 38px rgba(10, 65, 75, 0.11)",
  overflow: "hidden",
  "@media (min-width: 1025px) and (max-width: 1439px)": {
    width: "calc(100vw - 40px)",
    height: "clamp(630px, calc((100vw - 40px) * 0.62143), 870px)",
  },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    width: "min(940px, 100%)",
    height: "min(640px, calc(100dvh - 36px))",
  },
  "@media (max-width: 767px)": {
    display: "none",
    flexDirection: "column",
    width: "min(430px, 100%)",
    minHeight: "min(820px, calc(100dvh - 28px))",
    height: "auto",
    borderWidth: "6px",
  },
});

export const CenterSeam = styled.div({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: "50%",
  width: "1px",
  zIndex: 2,
  borderLeft: "1px dashed #D6DDDB",
  backgroundColor: "#E6E8E4",
  boxShadow: "0 0 15px rgba(10,65,75,0.13)",
  pointerEvents: "none",
  "@media (max-width: 767px)": { display: "none" },
});

export const PassportLeft = styled.section({
  position: "relative",
  minWidth: 0,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "clamp(20px, 3.6vw, 56px)",
  animation: `${appear} 420ms ease both`,
  "@media (max-width: 767px)": {
    flex: "1 1 auto",
    padding: "24px 18px 16px",
  },
});

export const PassportRight = styled.section({
  minWidth: 0,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "clamp(20px, 3.6vw, 56px)",
  backgroundColor: paper,
  animation: `${appear} 420ms ease both`,
  "[data-screen='welcome'] &": {
    animation: "none",
  },
  "@media (max-width: 767px)": {
    "[data-screen='profile'] &": { display: "none" },
    padding: "10px 22px 24px",
  },
});

export const StepHeading = styled.h1({
  alignSelf: "flex-start",
  width: "100%",
  margin: "0 0 16px",
  fontSize: "clamp(22px, 2.1vw, 32px)",
  lineHeight: 1.35,
  fontWeight: 850,
  "@media (max-width: 767px)": { fontSize: "23px" },
});

export const Eyebrow = styled.span({
  display: "block",
  marginBottom: "2px",
  color: muted,
  fontSize: "15px",
  fontWeight: 500,
});

export const LeftForm = styled.form({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "min(100%, 490px)",
  minWidth: 0,
});

export const AvatarFrame = styled.div({
  position: "relative",
  flexShrink: 0,
  width: "min(100%, 500px)",
  aspectRatio: "1 / 1",
  padding: "5px",
  border: "3px solid #D7F0F3",
  borderRadius: "12px",
  backgroundColor: "#EDF8F9",
  boxShadow: "0 4px 12px rgba(10,65,75,0.08)",
  "@media (min-width: 1025px) and (max-width: 1199px)": {
    width: "min(100%, 390px)",
  },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    width: "min(76%, 340px)",
  },
  "@media (max-width: 767px)": {
    width: "min(76vw, 300px)",
  },
});

export const AvatarImage = styled.img({
  display: "block",
  width: "100%",
  height: "100%",
  borderRadius: "8px",
  objectFit: "cover",
  objectPosition: "center",
});

export const AvatarEditButton = styled.button({
  position: "absolute",
  right: "-9px",
  bottom: "-9px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "43px",
  height: "43px",
  padding: 0,
  border: "2px solid #DBE8EA",
  borderRadius: "50%",
  backgroundColor: "#FFFFFF",
  color: teal,
  cursor: "pointer",
  boxShadow: "0 5px 10px rgba(10,65,75,0.15)",
  "&:hover": { backgroundColor: "#E7F5F4" },
  "&:focus-visible": { outline: `3px solid ${gold}`, outlineOffset: "2px" },
});

export const NicknameField = styled.div({
  width: "100%",
  marginTop: "18px",
});

export const NicknameLabel = styled.label({
  display: "block",
  marginBottom: "8px",
  fontSize: "16px",
  fontWeight: 800,
});

export const NicknameInputWrap = styled.div({
  position: "relative",
  display: "flex",
  width: "100%",
  minWidth: 0,
});

export const NicknameInput = styled.input({
  width: "100%",
  minWidth: 0,
  height: "54px",
  padding: "0 44px 0 13px",
  border: "1px solid #CEDFE1",
  borderRadius: "7px",
  outline: "none",
  backgroundColor: "#FFFFFF",
  color: teal,
  fontFamily: "inherit",
  fontSize: "16px",
  "&:focus": { borderColor: teal, boxShadow: "0 0 0 2px rgba(10,65,75,0.09)" },
  "&::placeholder": { color: "#98A6A9", fontSize: "15px" },
});

export const ClearButton = styled.button({
  position: "absolute",
  top: "50%",
  right: "9px",
  transform: "translateY(-50%)",
  width: "29px",
  height: "29px",
  padding: 0,
  display: "grid",
  placeItems: "center",
  border: "none",
  borderRadius: "50%",
  backgroundColor: "#E7EDEC",
  color: "#73898D",
  cursor: "pointer",
});

export const HelpLine = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "7px",
  marginTop: "7px",
  color: muted,
  fontSize: "15px",
  lineHeight: 1.5,
  "& span": { minWidth: 0 },
});

export const CharCount = styled.span({
  flexShrink: 0,
  fontSize: "15px",
});

export const MainButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  width: "100%",
  minHeight: "54px",
  marginTop: "16px",
  padding: "9px 13px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: teal,
  color: "#FFFFFF",
  fontFamily: "inherit",
  fontSize: "16px",
  fontWeight: 750,
  cursor: "pointer",
  "&:hover:not(:disabled)": { backgroundColor: "#0B626A" },
  "&:disabled": { opacity: 0.6, cursor: "not-allowed" },
});

export const StatusText = styled.p({
  alignSelf: "stretch",
  margin: "10px 0 0",
  color: "#D85A5A",
  fontSize: "15px",
  lineHeight: 1.4,
});

export const BrandLogo = styled.img({
  display: "block",
  flexShrink: 0,
  width: "clamp(125px, 21vw, 200px)",
  maxWidth: "100%",
  height: "auto",
  maxHeight: "110px",
  objectFit: "contain",
  backgroundColor: paper,
  filter: "none",
  "@media (min-width: 1025px) and (max-width: 1199px)": {
    width: "220px",
    maxHeight: "80px",
  },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    width: "195px",
    maxHeight: "75px",
  },
  "@media (max-width: 767px)": {
    width: "min(55vw, 195px)",
    maxHeight: "75px",
  },
});

export const WelcomeLeft = styled.div({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "23px",
  "@media (min-width: 768px) and (max-width: 1024px)": {
    gap: "15px",
  },
  "@media (max-width: 767px)": { gap: "16px" },
});

export const MiniFlight = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  width: "min(100%, 500px)",
  color: gold,
  "& span": { height: "1px", flex: 1, backgroundColor: gold, opacity: 0.65 },
});

export const TravelerPill = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  columnGap: "13px",
  rowGap: "5px",
  minHeight: "72px",
  maxWidth: "100%",
  padding: "18px 28px",
  borderRadius: "999px",
  backgroundColor: "#E9F7F5",
  color: teal,
  fontSize: "23px",
  fontWeight: 800,
  lineHeight: 1.35,
  textAlign: "center",
  overflowWrap: "anywhere",
  "@media (min-width: 768px) and (max-width: 1024px)": {
    fontSize: "18px",
    padding: "14px 20px",
    minHeight: "62px",
    columnGap: "8px",
  },
  "@media (max-width: 767px)": {
    fontSize: "18px",
    padding: "14px 17px",
    minHeight: "54px",
    columnGap: "8px",
  },
});

export const SelectedCaption = styled.span({
  color: muted,
  fontSize: "19px",
  fontWeight: 600,
  "@media (min-width: 768px) and (max-width: 1024px)": {
    fontSize: "15px",
  },
  "@media (max-width: 767px)": { fontSize: "16px" },
});

export const WelcomeRight = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
  minHeight: 0,
  backgroundColor: paper,
  gap: "8px",
  "@media (max-width: 767px)": {
    justifyContent: "center",
    gap: "16px",
  },
});

export const StampWrap = styled.div({
  position: "relative",
  display: "grid",
  placeItems: "center",
  flex: "0 1 auto",
  width: "clamp(255px, 26vw, 405px)",
  maxWidth: "100%",
  maxHeight: "50%",
  aspectRatio: "1 / 1",
  isolation: "isolate",
  "@media (min-width: 1025px) and (max-width: 1199px)": {
    width: "260px",
    maxHeight: "45%",
  },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    width: "min(26vw, 218px)",
    maxHeight: "44%",
  },
  "@media (max-width: 767px)": {
    width: "min(48vw, 175px)",
    maxHeight: "175px",
  },
});

export const StampImpact = styled.span({
  position: "absolute",
  inset: "-12%",
  zIndex: 0,
  borderRadius: "50%",
  border: "3px solid rgba(245, 199, 29, 0.32)",
  backgroundColor: "transparent",
  opacity: 0,
  transform: "scale(0.88)",
  pointerEvents: "none",
  willChange: "transform, opacity",
  animation: `${stampRipple} 350ms ease-out 350ms both`,
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
    opacity: 0,
  },
});

export const StampImage = styled.div({
  position: "relative",
  zIndex: 1,
  display: "block",
  width: "100%",
  height: "100%",
  minHeight: 0,
  backgroundColor: "#F5C71D",
  WebkitMaskImage: `url("${stamp}")`,
  maskImage: `url("${stamp}")`,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  transformOrigin: "center center",
  opacity: 0,
  transform: "translate3d(0, -72px, 0) scale(1.32) rotate(-10deg)",
  animation: `${stampPress} 560ms linear both`,
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  userSelect: "none",
  pointerEvents: "none",
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
    opacity: 1,
    transform: "rotate(-6deg)",
  },
});

export const WelcomeTitle = styled.h1({
  margin: 0,
  maxWidth: "100%",
  color: teal,
  fontSize: "clamp(29px, 3.5vw, 46px)",
  lineHeight: 1.18,
  fontWeight: 900,
  textAlign: "center",
  overflowWrap: "anywhere",
  "& span": { display: "block" },
  "@media (min-width: 1025px) and (max-width: 1199px)": {
    fontSize: "clamp(27px, 3vw, 35px)",
  },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    fontSize: "28px",
  },
  "@media (max-width: 767px)": { fontSize: "28px" },
});

export const WelcomeSubTitle = styled.p({
  margin: 0,
  color: muted,
  fontSize: "17px",
  textAlign: "center",
  lineHeight: 1.5,
  "@media (min-width: 768px) and (max-width: 1199px)": {
    fontSize: "15px",
  },
  "@media (max-width: 767px)": { fontSize: "15px" },
});

export const SecondaryButton = styled.button({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  gap: "5px",
  width: "min(100%, 310px)",
  minHeight: "52px",
  marginTop: "8px",
  border: `1px solid ${teal}`,
  borderRadius: "6px",
  backgroundColor: paper,
  color: teal,
  fontFamily: "inherit",
  fontSize: "17px",
  fontWeight: 750,
  cursor: "pointer",
  "&:hover": { backgroundColor: "#E9F7F5" },
  "@media (min-width: 768px) and (max-width: 1024px)": {
    minHeight: "42px",
    fontSize: "15px",
  },
  "@media (max-width: 767px)": {
    minHeight: "48px",
    fontSize: "16px",
  },
});

export const MobileLayout = styled.div({
  display: "none",
  "@media (max-width: 767px)": {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100dvh",
    minHeight: "100dvh",
    minWidth: 0,
    overflowY: "auto",
    backgroundColor: paper,
  },
});

export const MobileTopStripe = styled.div({
  height: "15px",
  flexShrink: 0,
  backgroundColor: teal,
});

export const MobileFooterStripe = styled.div({
  height: "15px",
  flexShrink: 0,
  backgroundColor: teal,
});

export const MobilePage = styled.div({
  display: "flex",
  flexDirection: "column",
  flex: "1 0 auto",
  minWidth: 0,
  width: "100%",
  padding: "0 24px",
  backgroundColor: paper,
});

export const MobileHeader = styled.header({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  height: "86px",
  width: "100%",
});

export const MobileLogo = styled.img({
  display: "block",
  width: "115px",
  maxHeight: "52px",
  objectFit: "contain",
  objectPosition: "left center",
  filter:
    "brightness(0) saturate(100%) invert(19%) sepia(36%) saturate(933%) hue-rotate(144deg) brightness(87%) contrast(102%)",
  userSelect: "none",
  pointerEvents: "none",
});

export const MobileProfileForm = styled.form({
  display: "flex",
  flex: "1 0 auto",
  flexDirection: "column",
  alignItems: "center",
  minWidth: 0,
  width: "100%",
  padding: "15px 0 26px",
});

export const MobileProfileHeading = styled.h1({
  display: "flex",
  flexDirection: "column",
  alignSelf: "stretch",
  margin: "0 0 22px",
  color: teal,
  fontSize: "21px",
  fontWeight: 800,
  lineHeight: 1.35,
  "& span": {
    display: "block",
    marginBottom: "3px",
    color: muted,
    fontSize: "15px",
    fontWeight: 500,
  },
  "& strong": { fontWeight: 800 },
});

export const MobileAvatarFrame = styled.div({
  position: "relative",
  width: "min(calc(100vw - 60px), 290px)",
  maxWidth: "100%",
  aspectRatio: "1 / 1",
  padding: "5px",
  backgroundColor: "#EFF9FA",
  border: "2px solid #D7F0F3",
  borderRadius: "12px",
  flexShrink: 0,
});

export const MobileAvatarImage = styled.img({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "8px",
});

export const MobileAvatarEditButton = styled.button({
  position: "absolute",
  right: "-9px",
  bottom: "-9px",
  display: "grid",
  placeItems: "center",
  width: "42px",
  height: "42px",
  padding: 0,
  border: "none",
  borderRadius: "50%",
  backgroundColor: "#FFFFFF",
  color: teal,
  boxShadow: "0 4px 10px rgba(10,65,75,0.15)",
  cursor: "pointer",
});

export const MobileNicknameField = styled.div({
  alignSelf: "stretch",
  width: "100%",
  minWidth: 0,
  marginTop: "22px",
});

export const MobileNicknameLabel = styled.label({
  display: "block",
  marginBottom: "8px",
  color: teal,
  fontSize: "16px",
  fontWeight: 800,
});

export const MobileNicknameInputWrap = styled.div({
  display: "flex",
  position: "relative",
  width: "100%",
  minWidth: 0,
});

export const MobileNicknameInput = styled.input({
  width: "100%",
  minWidth: 0,
  height: "49px",
  padding: "0 46px 0 12px",
  border: "1px solid #CDE0E2",
  borderRadius: "6px",
  backgroundColor: "#FFFFFF",
  color: teal,
  fontFamily: "inherit",
  fontSize: "16px",
  outline: "none",
  "&::placeholder": { color: "#99AAAD", fontSize: "15px" },
  "&:focus": {
    borderColor: teal,
    boxShadow: "0 0 0 2px rgba(10, 65, 75, 0.08)",
  },
});

export const MobileClearButton = styled.button({
  position: "absolute",
  right: "8px",
  top: "50%",
  transform: "translateY(-50%)",
  display: "grid",
  placeItems: "center",
  width: "30px",
  height: "30px",
  padding: 0,
  border: "none",
  borderRadius: "50%",
  backgroundColor: "#EFF1F1",
  color: "#7A8B8E",
  cursor: "pointer",
});

export const MobileHelpLine = styled.div({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "8px",
  marginTop: "8px",
  color: muted,
  fontSize: "15px",
  lineHeight: 1.5,
  "& span": { minWidth: 0 },
});

export const MobileCharCount = styled.span({
  flexShrink: 0,
  fontSize: "15px",
});

export const MobileStatusText = styled.p({
  margin: "10px 0 0",
  color: "#D85A5A",
  fontSize: "15px",
  lineHeight: 1.4,
});

export const MobileActionButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "100%",
  minHeight: "54px",
  marginTop: "auto",
  padding: "10px 16px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: teal,
  color: "#FFFFFF",
  fontFamily: "inherit",
  fontSize: "17px",
  fontWeight: 800,
  cursor: "pointer",
  "&:disabled": { opacity: 0.6, cursor: "not-allowed" },
});

export const MobileWelcomePage = styled.div({
  display: "flex",
  flex: "1 0 auto",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  minWidth: 0,
  padding: "36px 0 26px",
});

export const MobileWelcomeTitle = styled.h1({
  margin: "8px 0 24px",
  color: teal,
  fontSize: "28px",
  fontWeight: 850,
  textAlign: "center",
  lineHeight: 1.35,
});

export const MobileTravelerPill = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "14px",
  width: "min(100%, 360px)",
  minHeight: "82px",
  marginTop: "18px",
  padding: "14px 20px",
  backgroundColor: "#E9F7F5",
  borderRadius: "999px",
  color: teal,
  textAlign: "left",
});

export const MobileMascot = styled.img({
  display: "block",
  width: "62px",
  height: "62px",
  padding: 0,
  backgroundColor: "#FFFFFF",
  borderRadius: "50%",
  objectFit: "contain",
  flexShrink: 0,
});

export const MobilePillText = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  minWidth: 0,
  textAlign: "left",
  "& strong": {
    fontSize: "20px",
    fontWeight: 800,
    lineHeight: 1.25,
    overflowWrap: "anywhere",
    textAlign: "left",
  },
});

export const MobileSelectedCaption = styled.span({
  color: muted,
  fontSize: "16px",
  fontWeight: 600,
});
