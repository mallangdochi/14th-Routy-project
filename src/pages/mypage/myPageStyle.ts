import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const green = "#005044";
const navy = "#09184d";
const muted = "#60769e";

export const MobileTopBar = styled.header({
  display: "none",

  "@media (max-width: 760px)": {
    position: "sticky",
    top: 0,
    zIndex: 50,
    display: "grid",
    gridTemplateColumns: "48px 1fr 48px",
    alignItems: "center",
    height: 68,
    padding: "0 14px",
    backgroundColor: "#fcfbf8",
  },
});

export const MobileTopBack = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  color: "#111827",
});

export const MobileTopLogo = styled.img({
  width: 96,
  maxHeight: 42,
  objectFit: "contain",
  justifySelf: "center",
});

export const MobileMenuToggle = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  justifySelf: "end",
  color: "#111827",
});

export const MobileDrawerBackdrop = styled.div<{ $open: boolean }>(
  ({ $open }) => ({
    display: "none",

    "@media (max-width: 760px)": {
      display: "block",
      position: "fixed",
      inset: 0,
      zIndex: 89,
      backgroundColor: "rgba(9, 24, 35, 0.42)",
      opacity: $open ? 1 : 0,
      visibility: $open ? "visible" : "hidden",
      pointerEvents: $open ? "auto" : "none",
      transition: $open
        ? "opacity 220ms ease, visibility 0s"
        : "opacity 220ms ease, visibility 0s linear 220ms",
    },
  }),
);

export const SidebarShell = styled.div<{ $open: boolean }>(({ $open }) => ({
  width: 230,
  flexShrink: 0,

  "@media (min-width: 761px) and (max-width: 1199px)": {
    width: 200,
    "& > aside": {
      width: 200,
      minWidth: 200,
      paddingLeft: 12,
      paddingRight: 12,
    },
  },

  "@media (max-width: 760px)": {
    position: "fixed",
    inset: "0 0 0 auto",
    zIndex: 90,
    width: 250,
    maxWidth: "84vw",
    height: "100dvh",
    visibility: $open ? "visible" : "hidden",
    transform: $open ? "translateX(0)" : "translateX(100%)",
    transition: $open
      ? "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), visibility 0s"
      : "transform 230ms ease-in, visibility 0s linear 230ms",
    boxShadow: $open ? "-4px 0 18px rgba(0, 0, 0, 0.16)" : "none",

    "& > aside": {
      width: "100%",
      minWidth: 0,
      height: "100dvh",
    },
  },
}));

export const PageLayout = styled.div({
  display: "flex",
  minHeight: "100dvh",
  backgroundColor: "#fcfbf8",

  "@media (max-width: 760px)": {
    flexDirection: "column",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    overflowX: "clip",
  },
});

export const PageMain = styled.main({
  width: "100%",
  flex: 1,
  minWidth: 0,
  padding: "72px clamp(26px, 5vw, 86px) 64px",

  "@media (max-width: 760px)": {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    padding: "26px 16px 96px",
    margin: 0,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    padding: "40px clamp(20px, 3.2vw, 38px) 50px",
  },
});

export const MainInner = styled.div({
  width: "100%",
  minWidth: 0,
  maxWidth: 1210,
  margin: "0 auto",

  zoom: 0.8,
});

export const PageHeader = styled.header({
  marginBottom: 36,

  "@media (max-width: 760px)": {
    marginBottom: 20,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    marginBottom: 24,
  },
});

export const PageTitle = styled.h1<{ $green: boolean }>(({ $green }) => ({
  color: $green ? green : navy,
  fontSize: 35,
  fontWeight: 800,
  letterSpacing: "-0.05em",
  lineHeight: 1.3,

  "@media (max-width: 760px)": {
    fontSize: 30,
  },
}));

export const PageDescription = styled.p({
  marginTop: 4,
  color: muted,
  fontSize: 24,
  fontWeight: 500,

  "@media (max-width: 760px)": {
    fontSize: 15,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 18,
  },
});

export const ProfileCard = styled.section({
  width: "100%",
  minHeight: 588,
  padding: "26px 30px 28px",
  borderRadius: 18,
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 26px rgba(30, 42, 61, 0.075)",

  "@media (max-width: 760px)": {
    minHeight: 0,
    borderRadius: 12,
    padding: "18px 16px 20px",
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    minHeight: 0,
    padding: "22px 22px 24px",
  },
});

export const CardTitle = styled.h2({
  color: green,
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: "-0.03em",

  "@media (max-width: 760px)": {
    fontSize: 20,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 22,
  },
});

export const ProfileContent = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(225px, 32%) minmax(0, 1fr)",
  minHeight: 355,
  marginTop: 36,

  "@media (max-width: 920px)": {
    minHeight: 0,
    marginTop: 20,
    gridTemplateColumns: "1fr",
    gap: 22,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    marginTop: 22,
    minHeight: 0,
  },
});

export const ImageColumn = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "4px 26px 0 0",
  borderRight: "1px solid #d7e0ee",

  "@media (max-width: 920px)": {
    padding: "0 0 22px",
    borderRight: 0,
    borderBottom: "1px solid #d7e0ee",
  },
});

export const AvatarControlRow = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",

  "@media (max-width: 760px)": {
    display: "grid",
    gridTemplateColumns: "104px minmax(0, 1fr)",
    alignItems: "center",
    columnGap: 14,
  },

  "@media (max-width: 350px)": {
    gridTemplateColumns: "92px minmax(0, 1fr)",
    columnGap: 10,
  },
});

export const ImageControls = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",

  "@media (max-width: 760px)": {
    minWidth: 0,
    alignItems: "stretch",
  },
});

export const ProfileImage = styled.img({
  width: 190,
  height: 190,
  marginBottom: 10,
  borderRadius: "50%",
  objectFit: "cover",

  "@media (max-width: 760px)": {
    width: 104,
    height: 104,
    marginBottom: 0,
  },

  "@media (max-width: 350px)": {
    width: 92,
    height: 92,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    width: 152,
    height: 152,
  },
});

const imageButtonBase = {
  width: "100%",
  maxWidth: 290,
  minHeight: 50,
  borderRadius: 8,
  fontSize: 18,
  fontWeight: 700,

  "@media (max-width: 760px)": {
    fontSize: 13,
    minHeight: 39,
    padding: "0 5px",
  },
};

export const ImageChangeButton = styled.button({
  ...imageButtonBase,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
  border: "2px solid #d5deeb",
  backgroundColor: "#ffffff",
  color: green,
  transition: "background-color 0.2s, border-color 0.2s",

  "&:hover": {
    backgroundColor: "#def7ee",
    borderColor: "#149c89",
    color: green,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    minHeight: 42,
    fontSize: 15,
  },
});

export const DefaultImageButton = styled.button({
  ...imageButtonBase,
  marginTop: 10,
  border: "2px solid #d5deeb",
  backgroundColor: "#ffffff",
  color: navy,
  transition: "background-color 0.2s, border-color 0.2s, color 0.2s",

  "&:hover": {
    backgroundColor: "#def7ee",
    borderColor: "#149c89",
    color: green,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    minHeight: 42,
    fontSize: 15,
  },
});

export const ImageHelp = styled.p({
  marginTop: 14,
  fontSize: 16,
  color: "#8598b6",
  textAlign: "center",

  "@media (max-width: 760px)": {
    fontSize: 11,
    marginTop: 8,
    whiteSpace: "normal",
    lineHeight: 1.4,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 13,
  },
});

export const ImageError = styled.p({
  marginTop: 9,
  color: "#dc2626",
  fontSize: 14,
  textAlign: "center",
});

export const InputColumn = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "0 0 42px 44px",

  "@media (max-width: 920px)": {
    padding: 0,
    justifyContent: "flex-start",
  },
});

export const FieldLabel = styled.label({
  display: "block",
  marginBottom: 10,
  fontSize: 22,
  fontWeight: 700,
  color: navy,

  "@media (max-width: 760px)": {
    fontSize: 17,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 18,
  },
});

export const InputBox = styled.div({
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: 61,
  padding: "0 18px",
  border: "2px solid #d4deed",
  borderRadius: 9,
  backgroundColor: "#ffffff",

  "&:focus-within": {
    borderColor: "#159e90",
  },

  "@media (max-width: 760px)": {
    height: 51,
    padding: "0 12px",
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    height: 52,
  },
});

export const NameInput = styled.input({
  width: "100%",
  minWidth: 0,
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  color: navy,
  fontSize: 23,

  "@media (max-width: 760px)": {
    fontSize: 17,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 18,
  },
});

export const CharacterCount = styled.span({
  flexShrink: 0,
  paddingLeft: 10,
  color: "#8b9fbd",
  fontSize: 19,

  "@media (max-width: 760px)": {
    fontSize: 13,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 14,
  },
});

export const InputHelp = styled.p({
  marginTop: 11,
  color: "#8598b6",
  fontSize: 18,

  "@media (max-width: 760px)": {
    fontSize: 14,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 14,
  },
});

export const NameError = styled.p({
  marginTop: 8,
  color: "#dc2626",
  fontSize: 14,
});

export const ActionRow = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  gap: 14,
  marginTop: 19,

  "@media (max-width: 760px)": {
    marginTop: 20,
    gap: 9,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    marginTop: 12,
  },
});

const actionButtonBase = {
  minHeight: 58,
  borderRadius: 9,
  padding: "0 20px",
  fontSize: 20,
  fontWeight: 700,

  "@media (max-width: 760px)": {
    minHeight: 47,
    fontSize: 15,
  },
};

export const CancelButton = styled.button({
  ...actionButtonBase,
  minWidth: 145,
  border: "2px solid #d4deeb",
  backgroundColor: "#ffffff",
  color: navy,

  "&:hover": {
    backgroundColor: "#f5f8fa",
  },

  "@media (max-width: 760px)": {
    minWidth: 96,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    minHeight: 48,
    minWidth: 112,
    fontSize: 16,
  },
});

export const SaveButton = styled.button({
  ...actionButtonBase,
  minWidth: 182,
  backgroundColor: green,
  color: "#ffffff",

  "&:hover": {
    backgroundColor: "#006c5b",
  },

  "@media (max-width: 760px)": {
    minWidth: 124,
    minHeight: 42,
    padding: "0 12px",
    fontSize: 15,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    minHeight: 48,
    minWidth: 148,
    fontSize: 16,
  },
});

export const AvatarModalBackdrop = styled.div({
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  backgroundColor: "rgba(8, 24, 40, 0.55)",
});

export const AvatarModal = styled.div({
  width: "100%",
  maxWidth: 680,
  maxHeight: "85dvh",
  overflowY: "auto",
  padding: 28,
  borderRadius: 18,
  backgroundColor: "#ffffff",
  boxShadow: "0 18px 70px rgba(0, 0, 0, 0.17)",

  "@media (max-width: 600px)": {
    padding: 18,
    maxHeight: "80dvh",
  },
});

export const AvatarModalHeader = styled.div({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: 12,
});

export const AvatarModalTitle = styled.h2({
  fontSize: 23,
  fontWeight: 700,
  color: navy,

  "@media (max-width: 600px)": {
    fontSize: 19,
  },
});

export const AvatarModalHelp = styled.p({
  marginTop: 7,
  color: muted,
  fontSize: 15,
});

export const AvatarGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  gap: 15,
  marginTop: 25,

  "@media (max-width: 600px)": {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
  },
});

export const AvatarOption = styled.button<{
  $selected: boolean;
}>(({ $selected }) => ({
  overflow: "hidden",
  aspectRatio: "1 / 1",
  width: "100%",
  padding: 2,
  borderRadius: "50%",
  border: $selected ? "3px solid #008977" : "3px solid transparent",
  backgroundColor: "#ffffff",

  "&:hover": {
    borderColor: "#52bbaa",
  },

  "&:focus-visible": {
    outline: "2px solid #005044",
    outlineOffset: 3,
  },

  "& img": {
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  },
}));

export const AvatarModalFooter = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 24,
});

export const ModalConfirmButton = styled.button({
  minWidth: 180,
  minHeight: 58,
  padding: "0 20px",
  border: "2px solid #d4deeb",
  borderRadius: 9,
  backgroundColor: "#ffffff",
  color: navy,
  fontSize: 20,
  fontWeight: 700,
  transition: "background-color 0.2s, color 0.2s, border-color 0.2s",

  "&:hover": {
    backgroundColor: green,
    borderColor: green,
    color: "#ffffff",
  },

  "@media (max-width: 760px)": {
    minWidth: 134,
    minHeight: 47,
    fontSize: 15,
  },
});

export const SaveToast = styled.div({
  position: "fixed",
  top: 24,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1100,
  minWidth: 220,
  padding: "14px 26px",
  borderRadius: 12,
  backgroundColor: green,
  color: "#ffffff",
  fontSize: 16,
  fontWeight: 600,
  textAlign: "center",
  boxShadow: "0 6px 24px rgba(0, 0, 0, 0.15)",
  pointerEvents: "none",

  "@media (max-width: 760px)": {
    top: 78,
    minWidth: 190,
    fontSize: 14,
    padding: "12px 20px",
  },
});

export const EmptyCard = styled.div({
  padding: "55px 32px",
  minHeight: 260,
  border: "1px solid #d9e3ee",
  borderRadius: 16,
  backgroundColor: "#ffffff",
  color: muted,
  fontSize: 19,
  textAlign: "center",
});

export const SecurityContent = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 26,
  "@media (max-width: 760px)": {
    gap: 14,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    gap: 18,
  },
});

export const SecurityCard = styled.section({
  width: "100%",
  padding: "24px 34px 32px",
  border: "2px solid #d6e3fa",
  borderRadius: 12,
  backgroundColor: "#ffffff",

  "@media (max-width: 760px)": {
    padding: "16px 14px 18px",
    borderWidth: 1,
    borderRadius: 10,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    padding: "18px 24px 22px",
  },
});

export const SecurityCardHeader = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 66,
  gap: 20,

  "@media (max-width: 760px)": {
    minHeight: 42,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    minHeight: 50,
  },
});

export const SecurityCardTitle = styled.h2({
  color: navy,
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: "-0.035em",
  lineHeight: 1.35,

  "@media (max-width: 760px)": {
    fontSize: 18,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 22,
  },
});

export const SecurityActionButton = styled.button({
  minWidth: 156,
  minHeight: 66,
  padding: "0 24px",
  flexShrink: 0,
  borderRadius: 10,
  backgroundColor: green,
  color: "#ffffff",
  fontSize: 24,
  fontWeight: 700,
  transition: "background-color 0.2s",

  "&:hover": {
    backgroundColor: "#006c5b",
  },

  "@media (max-width: 760px)": {
    minWidth: 72,
    minHeight: 38,
    padding: "0 12px",
    fontSize: 15,
    borderRadius: 7,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    minWidth: 108,
    minHeight: 48,
    fontSize: 18,
    padding: "0 16px",
  },
});

export const SecurityInfoList = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginTop: 17,

  "@media (max-width: 760px)": {
    gap: 0,
    marginTop: 10,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    gap: 8,
    marginTop: 12,
  },
});

export const SecurityInfoRow = styled.div<{ $editing: boolean }>(
  ({ $editing }) => ({
    display: "grid",
    gridTemplateColumns: "minmax(160px, 24%) minmax(0, 1fr)",
    alignItems: "center",
    gap: 20,
    minHeight: 58,

    "@media (max-width: 760px)": {
      minHeight: 48,
      gridTemplateColumns: $editing ? "1fr" : "112px minmax(0, 1fr)",
      gap: $editing ? 5 : 8,
      padding: $editing ? "10px 0" : "6px 0",
      borderBottom: "1px solid #e8eef6",
    },

    "@media (max-width: 420px)": {
      gridTemplateColumns: $editing ? "1fr" : "105px minmax(0, 1fr)",
      gap: $editing ? 5 : 6,
    },
    "@media (min-width: 761px) and (max-width: 1199px)": {
      minHeight: 50,
      gap: 14,
    },
  }),
);

export const SecurityInfoLabel = styled.label({
  color: "#4e638b",
  fontSize: 22,
  fontWeight: 700,

  "@media (max-width: 760px)": {
    fontSize: 15,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 17,
  },
});

export const SecurityInfoValue = styled.span({
  display: "flex",
  alignItems: "center",
  width: "100%",
  minWidth: 0,
  minHeight: 58,
  padding: "0 20px",
  color: navy,
  fontSize: 21,
  fontWeight: 500,
  overflowWrap: "anywhere",

  "@media (max-width: 760px)": {
    minHeight: 38,
    padding: 0,
    fontSize: 15,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 17,
    minHeight: 50,
    padding: "0 14px",
  },
});

export const SecurityCardActions = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  minHeight: 66,
  marginTop: 28,

  "@media (max-width: 760px)": {
    minHeight: 48,
    marginTop: 20,
  },
});

export const SecuritySimpleCard = styled.section({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 24,
  minHeight: 150,
  padding: "24px 34px",
  border: "2px solid #d6e3fa",
  borderRadius: 12,
  backgroundColor: "#ffffff",

  "@media (max-width: 760px)": {
    padding: "18px 14px",
    gap: 12,
    minHeight: 108,
    borderWidth: 1,
    borderRadius: 10,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    minHeight: 112,
    padding: "18px 24px",
    gap: 14,
  },
});

export const SecuritySimpleText = styled.div({
  minWidth: 0,
});

export const SecurityCardDescription = styled.p({
  marginTop: 8,
  color: muted,
  fontSize: 21,
  fontWeight: 500,
  lineHeight: 1.5,

  "@media (max-width: 760px)": {
    fontSize: 14,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 17,
    marginTop: 7,
  },
});

export const WithdrawButton = styled.button({
  minWidth: 214,
  minHeight: 66,
  padding: "0 20px",
  flexShrink: 0,
  border: "2px solid #ff2f37",
  borderRadius: 10,
  backgroundColor: "#ffffff",
  color: "#ff202c",
  fontSize: 24,
  fontWeight: 700,
  transition: "background-color 0.2s",

  "&:hover": {
    backgroundColor: "#fff2f2",
  },

  "@media (max-width: 760px)": {
    minWidth: 88,
    minHeight: 38,
    padding: "0 10px",
    fontSize: 15,
    borderRadius: 7,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    minWidth: 140,
    minHeight: 48,
    fontSize: 18,
  },
});

export const SecurityInput = styled.input({
  width: "100%",
  minWidth: 0,
  height: 58,
  padding: "0 18px",
  border: "2px solid #d4e1f7",
  borderRadius: 9,
  outline: "none",
  backgroundColor: "#ffffff",
  color: navy,
  fontSize: 21,

  "&:focus": {
    borderColor: "#159e90",
  },

  "@media (max-width: 760px)": {
    height: 38,
    padding: "0 10px",
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 6,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    height: 50,
    fontSize: 17,
    padding: "0 14px",
  },
});

export const PasswordDescription = styled.p({
  marginTop: 12,
  color: muted,
  fontSize: 21,
  fontWeight: 500,
  lineHeight: 1.5,

  "@media (max-width: 760px)": {
    fontSize: 15,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 17,
  },
});

export const PasswordForm = styled.form({
  display: "flex",
  flexDirection: "column",
  gap: 22,
  marginTop: 32,

  "@media (max-width: 760px)": {
    gap: 16,
    marginTop: 22,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    marginTop: 22,
    gap: 14,
  },
});

export const PasswordRow = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(160px, 24%) minmax(0, 1fr)",
  alignItems: "center",
  gap: 20,
  minHeight: 58,

  "@media (max-width: 760px)": {
    minHeight: 0,
    gridTemplateColumns: "1fr",
    gap: 7,
  },

  "@media (min-width: 761px) and (max-width: 1199px)": {
    minHeight: 50,
    gap: 14,
  },
});

export const PasswordLabel = styled.label({
  color: "#4e638b",
  fontSize: 22,
  fontWeight: 700,

  "@media (max-width: 760px)": {
    fontSize: 16,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 17,
  },
});

export const PasswordInputWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  width: "100%",
  minWidth: 0,
  height: 58,
  padding: "0 14px 0 20px",
  border: "2px solid #d4e1f7",
  borderRadius: 9,
  backgroundColor: "#ffffff",

  "&:focus-within": {
    borderColor: "#159e90",
  },

  "@media (max-width: 760px)": {
    height: 44,
    padding: "0 10px 0 12px",
    borderWidth: 1,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    height: 50,
  },
});

export const PasswordInput = styled.input({
  flex: 1,
  width: "100%",
  minWidth: 0,
  height: "100%",
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  color: navy,
  fontSize: 19,

  "&::placeholder": {
    color: "#9aa9bf",
  },

  "@media (max-width: 760px)": {
    fontSize: 15,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    fontSize: 17,
  },
});

export const PasswordVisibilityButton = styled.button({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 36,
  height: 36,
  borderRadius: 7,
  color: "#8598b6",

  "&:hover": {
    backgroundColor: "#edf8f5",
    color: green,
  },
});

export const PasswordNotice = styled.p({
  padding: "13px 16px",
  borderRadius: 8,
  backgroundColor: "#edf8f5",
  color: green,
  fontSize: 15,
  lineHeight: 1.5,
});

export const PasswordActionRow = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  gap: 14,
  marginTop: 18,

  "@media (max-width: 760px)": {
    gap: 10,
    marginTop: 8,
  },
});

export const PasswordCancelButton = styled.button({
  minWidth: 145,
  minHeight: 58,
  padding: "0 20px",
  border: "2px solid #d4deeb",
  borderRadius: 9,
  backgroundColor: "#ffffff",
  color: navy,
  fontSize: 20,
  fontWeight: 700,
  transition: "background-color 0.2s, border-color 0.2s, color 0.2s",

  "&:hover": {
    backgroundColor: green,
    borderColor: green,
    color: "#ffffff",
  },

  "@media (max-width: 760px)": {
    minWidth: 96,
    minHeight: 47,
    fontSize: 15,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    minWidth: 110,
    minHeight: 48,
    fontSize: 16,
  },
});

export const PasswordSubmitButton = styled.button({
  minWidth: 182,
  minHeight: 58,
  padding: "0 20px",
  border: `2px solid ${green}`,
  borderRadius: 9,
  backgroundColor: green,
  color: "#ffffff",
  fontSize: 20,
  fontWeight: 700,
  transition: "background-color 0.2s, border-color 0.2s",

  "&:hover": {
    backgroundColor: "#006c5b",
    borderColor: "#006c5b",
  },

  "@media (max-width: 760px)": {
    minWidth: 134,
    minHeight: 47,
    fontSize: 15,
  },
  "@media (min-width: 761px) and (max-width: 1199px)": {
    minWidth: 140,
    minHeight: 48,
    fontSize: 16,
  },
});

export const WithdrawConfirmDialog = styled.div({
  width: "100%",
  maxWidth: 480,
  padding: "36px 32px 30px",
  borderRadius: 16,
  backgroundColor: "#ffffff",
  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.16)",

  "@media (max-width: 600px)": {
    padding: "28px 20px 24px",
  },
});

export const WithdrawConfirmTitle = styled.h2({
  color: navy,
  fontSize: 24,
  fontWeight: 700,
  lineHeight: 1.5,
  textAlign: "center",

  "@media (max-width: 600px)": {
    fontSize: 20,
  },
});

export const WithdrawConfirmDescription = styled.p({
  marginTop: 12,
  color: muted,
  fontSize: 16,
  lineHeight: 1.6,
  textAlign: "center",
});

export const WithdrawConfirmActions = styled.div({
  display: "flex",
  justifyContent: "center",
  gap: 12,
  marginTop: 32,
});

export const WithdrawYesButton = styled.button({
  flex: 1,
  minHeight: 52,
  border: "2px solid #ef4444",
  borderRadius: 9,
  backgroundColor: "#ffffff",
  color: "#dc2626",
  fontSize: 17,
  fontWeight: 700,
  transition: "background-color 0.2s",

  "&:hover": {
    backgroundColor: "#fff1f1",
  },
});

export const WithdrawNoButton = styled.button({
  flex: 1,
  minHeight: 52,
  border: `2px solid ${green}`,
  borderRadius: 9,
  backgroundColor: green,
  color: "#ffffff",
  fontSize: 17,
  fontWeight: 700,
  transition: "background-color 0.2s",

  "&:hover": {
    backgroundColor: "#006c5b",
    borderColor: "#006c5b",
  },
});

const greenBlinkFrames = {
  "0%, 100%": {
    borderColor: "#159e90",
    boxShadow: "0 0 0 0 rgba(21, 158, 144, 0)",
  },
  "25%, 72%": {
    borderColor: "#00a58c",
    boxShadow: "0 0 0 4px rgba(21, 158, 144, 0.19)",
  },
  "48%": {
    borderColor: "#159e90",
    boxShadow: "0 0 0 0 rgba(21, 158, 144, 0)",
  },
};

const greenBlinkFirst = keyframes(greenBlinkFrames);
const greenBlinkSecond = keyframes({
  ...greenBlinkFrames,
  "49%": {
    borderColor: "#159e90",
    boxShadow: "0 0 0 0 rgba(21, 158, 144, 0)",
  },
});

export const ValidationRow = styled(PasswordRow)<{ $hasError: boolean }>(
  ({ $hasError }) => ({
    marginBottom: $hasError ? 44 : 0,
    transition: "margin-bottom 160ms ease",

    "@media (max-width: 760px)": {
      marginBottom: $hasError ? 39 : 0,
    },
  }),
);

export const ValidatedInputWrapper = styled(PasswordInputWrapper)<{
  $hasError: boolean;
  $attempt: number;
}>(({ $hasError, $attempt }) => ({
  position: "relative",
  borderColor: $hasError ? "#159e90" : undefined,
  animation: $hasError
    ? `${$attempt % 2 === 0 ? greenBlinkSecond : greenBlinkFirst} 950ms ease-in-out 1`
    : "none",
}));

export const ValidationMessage = styled.div({
  position: "absolute",
  top: "calc(100% + 8px)",
  left: 0,
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "max-content",
  maxWidth: "100%",
  padding: "9px 12px",
  border: `1px solid ${green}`,
  borderRadius: 8,
  backgroundColor: green,
  boxShadow: "0 4px 12px rgba(9, 24, 77, 0.12)",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.35,
  whiteSpace: "normal",

  "&::before": {
    content: '""',
    position: "absolute",
    top: -6,
    left: 18,
    width: 10,
    height: 10,
    borderTop: `1px solid ${green}`,
    borderLeft: `1px solid ${green}`,
    backgroundColor: green,
    transform: "rotate(45deg)",
  },

  "& svg": {
    flexShrink: 0,
    color: "#ffffff",
  },

  "@media (max-width: 760px)": {
    fontSize: 13,
    padding: "8px 10px",
  },
});
