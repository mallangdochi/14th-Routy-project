import styled from "@emotion/styled";

const green = "#005044";
const navy = "#09184d";
const muted = "#60769e";

export const PageLayout = styled.div({
  display: "flex",
  minHeight: "100dvh",
  backgroundColor: "#fcfbf8",

  "@media (max-width: 760px)": {
    flexDirection: "column",
  },
});

export const PageMain = styled.main({
  flex: 1,
  minWidth: 0,
  padding: "72px clamp(26px, 5vw, 86px) 64px",

  "@media (max-width: 760px)": {
    padding: "32px 18px 48px",
  },
});

export const MainInner = styled.div({
  width: "100%",
  maxWidth: 1210,
  margin: "0 auto",
});

export const PageHeader = styled.header({
  marginBottom: 36,

  "@media (max-width: 760px)": {
    marginBottom: 24,
  },
});

export const PageTitle = styled.h1<{ $green: boolean }>(({ $green }) => ({
  color: $green ? green : navy,
  fontSize: 48,
  fontWeight: 800,
  letterSpacing: "-0.05em",
  lineHeight: 1.3,

  "@media (max-width: 1100px)": {
    fontSize: 40,
  },

  "@media (max-width: 760px)": {
    fontSize: 30,
  },
}));

export const PageDescription = styled.p({
  marginTop: 7,
  color: muted,
  fontSize: 24,
  fontWeight: 500,

  "@media (max-width: 760px)": {
    fontSize: 16,
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
    padding: "22px 18px",
  },
});

export const CardTitle = styled.h2({
  color: green,
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: "-0.03em",

  "@media (max-width: 760px)": {
    fontSize: 22,
  },
});

export const ProfileContent = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(225px, 32%) minmax(0, 1fr)",
  minHeight: 355,
  marginTop: 36,

  "@media (max-width: 920px)": {
    gridTemplateColumns: "1fr",
    gap: 32,
  },
});

export const ImageColumn = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "4px 26px 0 0",
  borderRight: "1px solid #d7e0ee",

  "@media (max-width: 920px)": {
    padding: "0 0 28px",
    borderRight: 0,
    borderBottom: "1px solid #d7e0ee",
  },
});

export const ProfileImage = styled.img({
  width: 190,
  height: 190,
  marginBottom: 12,
  borderRadius: "50%",
  objectFit: "cover",

  "@media (max-width: 760px)": {
    width: 150,
    height: 150,
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
    fontSize: 15,
    minHeight: 44,
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
});

export const DefaultImageButton = styled.button({
  ...imageButtonBase,
  marginTop: 12,
  border: "2px solid #d5deeb",
  backgroundColor: "#ffffff",
  color: navy,
  transition: "background-color 0.2s, border-color 0.2s, color 0.2s",

  "&:hover": {
    backgroundColor: "#def7ee",
    borderColor: "#149c89",
    color: green,
  },
});

export const ImageHelp = styled.p({
  marginTop: 14,
  fontSize: 16,
  color: "#8598b6",
  textAlign: "center",

  "@media (max-width: 760px)": {
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
});

export const CharacterCount = styled.span({
  flexShrink: 0,
  paddingLeft: 10,
  color: "#8b9fbd",
  fontSize: 19,

  "@media (max-width: 760px)": {
    fontSize: 13,
  },
});

export const InputHelp = styled.p({
  marginTop: 11,
  color: "#8598b6",
  fontSize: 18,

  "@media (max-width: 760px)": {
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
    marginTop: 30,
    gap: 9,
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
    minWidth: 134,
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
    top: 16,
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
});

export const SecurityCard = styled.section({
  width: "100%",
  padding: "24px 34px 32px",
  border: "2px solid #d6e3fa",
  borderRadius: 12,
  backgroundColor: "#ffffff",

  "@media (max-width: 760px)": {
    padding: "20px 18px 24px",
  },
});

export const SecurityCardHeader = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 66,
  gap: 20,

  "@media (max-width: 760px)": {
    minHeight: 48,
  },
});

export const SecurityCardTitle = styled.h2({
  color: navy,
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: "-0.035em",
  lineHeight: 1.35,

  "@media (max-width: 760px)": {
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
    minWidth: 90,
    minHeight: 48,
    padding: "0 15px",
    fontSize: 17,
  },
});

export const SecurityInfoList = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginTop: 17,

  "@media (max-width: 760px)": {
    gap: 14,
    marginTop: 22,
  },
});

export const SecurityInfoRow = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(160px, 24%) minmax(0, 1fr)",
  alignItems: "center",
  gap: 20,
  minHeight: 58,

  "@media (max-width: 760px)": {
    minHeight: 48,
    gridTemplateColumns: "120px minmax(0, 1fr)",
    gap: 10,
  },

  "@media (max-width: 420px)": {
    gridTemplateColumns: "1fr",
    gap: 4,
  },
});

export const SecurityInfoLabel = styled.label({
  color: "#4e638b",
  fontSize: 22,
  fontWeight: 700,

  "@media (max-width: 760px)": {
    fontSize: 16,
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
    minHeight: 48,
    padding: "0 12px",
    fontSize: 16,
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
    padding: "20px 18px",
    gap: 12,
  },
});

export const SecuritySimpleText = styled.div({
  minWidth: 0,
});

export const SecurityCardDescription = styled.p({
  marginTop: 13,
  color: muted,
  fontSize: 21,
  fontWeight: 500,
  lineHeight: 1.5,

  "@media (max-width: 760px)": {
    fontSize: 15,
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
    minWidth: 100,
    minHeight: 48,
    padding: "0 12px",
    fontSize: 16,
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
    height: 48,
    padding: "0 10px",
    fontSize: 16,
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
});

export const PasswordForm = styled.form({
  display: "flex",
  flexDirection: "column",
  gap: 22,
  marginTop: 32,

  "@media (max-width: 760px)": {
    gap: 14,
    marginTop: 24,
  },
});

export const PasswordRow = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(160px, 24%) minmax(0, 1fr)",
  alignItems: "center",
  gap: 20,
  minHeight: 58,

  "@media (max-width: 760px)": {
    minHeight: 48,
    gridTemplateColumns: "120px minmax(0, 1fr)",
    gap: 10,
  },

  "@media (max-width: 420px)": {
    gridTemplateColumns: "1fr",
    gap: 4,
  },
});

export const PasswordLabel = styled.label({
  color: "#4e638b",
  fontSize: 22,
  fontWeight: 700,

  "@media (max-width: 760px)": {
    fontSize: 16,
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
    height: 48,
    padding: "0 10px 0 12px",
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
