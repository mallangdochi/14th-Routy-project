import styled from "@emotion/styled";

const green = "#005044";
const navy = "#09184d";
const muted = "#60769e";
const border = "#d6e3fa";
const greenHover = "#006c5b";
const greenSoft = "#edf8f5";

const media = {
  mobile: "@media (max-width: 760px)",
  tablet: "@media (min-width: 761px) and (max-width: 1199px)",
  narrowMobile: "@media (max-width: 360px)",
  dialogMobile: "@media (max-width: 600px)",
  compactContent: "@media (max-width: 880px)",
  titleTablet: "@media (max-width: 1100px)",
} as const;

const centeredFlex = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

const pageHeadingTypography = {
  fontSize: 48,
  fontWeight: 800,
  letterSpacing: "-0.05em",
  lineHeight: 1.3,
  [media.titleTablet]: { fontSize: 40 },
  [media.mobile]: { fontSize: 30 },
  [media.tablet]: { fontSize: 34 },
} as const;

export const SettingsContent = styled.div<{
  $hasChanges: boolean;
}>(({ $hasChanges }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 20,
  paddingBottom: $hasChanges ? 110 : 0,

  [media.mobile]: {
    paddingBottom: $hasChanges ? 116 : 0,
    gap: 12,
  },
  [media.tablet]: {
    gap: 14,
  },
}));

export const SettingsPageHeader = styled.header({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 24,
  marginBottom: 14,

  [media.mobile]: {
    alignItems: "flex-start",
    flexDirection: "column",
    gap: 10,
    marginBottom: 0,
  },
  [media.tablet]: {
    marginBottom: 7,
  },
});

export const SettingsHeading = styled.div({
  minWidth: 0,
});

export const SettingsPageTitle = styled.h1({
  color: navy,
  ...pageHeadingTypography,
});

export const SettingsPageDescription = styled.p({
  marginTop: 7,
  color: muted,
  fontSize: 24,
  fontWeight: 500,

  [media.mobile]: {
    fontSize: 15,
  },
  [media.tablet]: {
    fontSize: 18,
  },
});

export const SettingsCard = styled.section({
  width: "100%",
  padding: "20px 26px 24px",
  border: `2px solid ${border}`,
  borderRadius: 12,
  backgroundColor: "#ffffff",

  [media.mobile]: {
    padding: "14px 12px 16px",
    borderWidth: 1,
    borderRadius: 10,
  },
  [media.tablet]: {
    padding: "17px 20px 19px",
  },
});

export const SettingsCardTitle = styled.h2({
  marginBottom: 10,
  color: navy,
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: "-0.035em",

  [media.mobile]: {
    fontSize: 20,
    marginBottom: 5,
  },
  [media.tablet]: {
    fontSize: 22,
    marginBottom: 7,
  },
});

export const SettingRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 20,
  minHeight: 78,
  padding: "10px 0",

  [media.mobile]: {
    gap: 9,
    flexWrap: "nowrap",
    minHeight: 60,
    padding: "9px 0",
  },
  [media.narrowMobile]: {
    flexWrap: "wrap",
  },
  [media.tablet]: {
    minHeight: 62,
    gap: 13,
    padding: "8px 0",
  },
});

export const TempDataRow = styled(SettingRow)({
  [media.mobile]: {
    display: "grid",
    gridTemplateColumns: "32px minmax(0, 1fr)",
    columnGap: 9,
    rowGap: 0,
    alignItems: "center",
    "& > button": {
      gridColumn: "1 / -1",
      width: "100%",
      minWidth: 0,
      marginTop: 12,
      justifySelf: "stretch",
    },
  },
});

export const RowIcon = styled.span({
  ...centeredFlex,
  flexShrink: 0,
  width: 40,
  height: 40,
  color: green,

  "& svg": {
    width: 32,
    height: 32,
    strokeWidth: 2,
  },

  [media.mobile]: {
    width: 32,
    height: 32,
    backgroundColor: "#e7f6ef",
    borderRadius: "50%",

    "& svg": {
      width: 19,
      height: 19,
    },
  },
  [media.tablet]: {
    width: 32,
    height: 32,
    "& svg": { width: 24, height: 24 },
  },
});

export const SettingText = styled.div({
  flex: 1,
  minWidth: 0,
});

export const SettingName = styled.h3({
  color: navy,
  fontSize: 20,
  fontWeight: 700,
  lineHeight: 1.4,

  [media.mobile]: {
    fontSize: 16,
    lineHeight: 1.35,
  },
  [media.tablet]: {
    fontSize: 16,
  },
});

export const SettingDescription = styled.p({
  marginTop: 3,
  color: muted,
  fontSize: 16,
  lineHeight: 1.5,

  [media.mobile]: {
    fontSize: 13,
    marginTop: 2,
  },
  [media.tablet]: {
    fontSize: 13,
  },
});

export const SettingDivider = styled.div({
  height: 1,
  backgroundColor: "#e0e8f2",
});

export const ToggleButton = styled.button<{ $checked: boolean }>(
  ({ $checked }) => ({
    position: "relative",
    flexShrink: 0,
    width: 66,
    height: 36,
    borderRadius: 999,
    backgroundColor: $checked ? green : "#d6d7d9",
    transition: "background-color 0.2s",

    "&::after": {
      content: '""',
      position: "absolute",
      top: 4,
      left: 4,
      width: 28,
      height: 28,
      borderRadius: "50%",
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
      transform: $checked ? "translateX(30px)" : "translateX(0)",
      transition: "transform 0.2s",
    },

    [media.mobile]: {
      width: 48,
      height: 28,
      "&::after": {
        width: 22,
        height: 22,
        top: 3,
        left: 3,
        transform: $checked ? "translateX(20px)" : "translateX(0)",
      },
    },
    "&:focus-visible": {
      outline: `2px solid ${green}`,
      outlineOffset: 3,
    },
  }),
);

export const PermissionPanel = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  marginTop: 10,
  padding: "12px 16px",
  borderRadius: 10,
  backgroundColor: "#f2f3f6",

  [media.mobile]: {
    gap: 8,
    flexWrap: "wrap",
    padding: "9px 10px",
    marginTop: 8,
  },
  [media.tablet]: {
    padding: "10px 12px",
  },
});

export const PermissionInfo = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 15,
  minWidth: 0,
  color: "#596782",
  [media.mobile]: {
    gap: 7,
    "& svg": { width: 18, height: 18, flexShrink: 0 },
  },
});

export const PermissionText = styled.p({
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 1.5,

  [media.mobile]: {
    fontSize: 12,
  },
  [media.tablet]: {
    fontSize: 13,
  },
});

export const PermissionStatus = styled.strong<{ $allowed: boolean }>(
  ({ $allowed }) => ({
    marginLeft: 8,
    color: $allowed ? green : "#e63b35",
    fontWeight: 700,
  }),
);

export const PermissionButton = styled.button({
  flexShrink: 0,
  minWidth: 160,
  minHeight: 46,
  padding: "0 16px",
  borderRadius: 8,
  color: "#ffffff",
  backgroundColor: green,
  fontSize: 16,
  fontWeight: 700,

  "&:hover:not(:disabled)": {
    backgroundColor: greenHover,
  },

  "&:disabled": {
    opacity: 0.55,
  },

  [media.mobile]: {
    minWidth: 112,
    minHeight: 34,
    fontSize: 12,
    padding: "0 10px",
  },
  [media.tablet]: {
    minHeight: 38,
    minWidth: 125,
    fontSize: 13,
  },
});

export const ChoiceGroup = styled.div({
  display: "flex",
  flexShrink: 0,
  width: 286,
  minHeight: 48,
  overflow: "hidden",
  border: "1px solid #d1daea",
  borderRadius: 9,
  backgroundColor: "#ffffff",

  [media.compactContent]: {
    width: 190,
  },

  [media.mobile]: {
    width: 132,
    minHeight: 37,
    marginLeft: 0,
  },
  [media.narrowMobile]: {
    width: "calc(100% - 41px)",
    marginLeft: 41,
  },
  [media.tablet]: {
    width: 220,
    minHeight: 42,
  },
});

export const ChoiceButton = styled.button<{ $selected: boolean }>(
  ({ $selected }) => ({
    flex: 1,
    minWidth: 0,
    padding: "0 8px",
    borderRadius: $selected ? 8 : 0,
    color: $selected ? "#ffffff" : navy,
    backgroundColor: $selected ? green : "transparent",
    fontSize: 16,
    fontWeight: 700,
    transition: "background-color 0.2s, color 0.2s",

    "&:hover": {
      backgroundColor: $selected ? greenHover : greenSoft,
    },

    "&:focus-visible": {
      outline: `2px solid ${green}`,
      outlineOffset: -3,
    },

    [media.mobile]: {
      fontSize: 13,
    },
  }),
);

export const ClearDataButton = styled.button({
  flexShrink: 0,
  minHeight: 48,
  minWidth: 188,
  padding: "0 16px",
  border: `2px solid ${green}`,
  borderRadius: 9,
  color: green,
  backgroundColor: "#ffffff",
  fontSize: 17,
  fontWeight: 700,

  "&:hover": {
    backgroundColor: greenSoft,
  },

  [media.dialogMobile]: {
    marginLeft: 0,
    minWidth: 116,
    minHeight: 36,
    padding: "0 8px",
    fontSize: 15,
    borderWidth: 1,
  },
  [media.tablet]: {
    fontSize: 16,
  },
});

export const Feedback = styled.p({
  marginTop: 10,
  color: muted,
  fontSize: 14,
  lineHeight: 1.5,
  [media.mobile]: {
    fontSize: 11,
  },
});

export const FloatingActionBar = styled.div<{ $visible: boolean }>(
  ({ $visible }) => ({
    position: "fixed",
    left: 230,
    right: 0,
    bottom: 24,
    zIndex: 100,
    display: "flex",
    justifyContent: "center",
    padding: "0 24px",
    pointerEvents: "none",
    opacity: $visible ? 1 : 0,
    visibility: $visible ? "visible" : "hidden",
    transform: $visible ? "translateY(0)" : "translateY(calc(100% + 48px))",
    transition: $visible
      ? "transform 440ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms ease-out, visibility 0s"
      : "transform 400ms cubic-bezier(0.4, 0, 0.7, 1), opacity 340ms ease-in, visibility 0s linear 400ms",

    [media.tablet]: {
      left: 200,
    },

    [media.mobile]: {
      left: 0,
      right: 0,
      bottom: "calc(48px + env(safe-area-inset-bottom, 0px))",
      padding: "0 16px",
    },
  }),
);

export const FloatingActionPanel = styled.div<{ $visible: boolean }>(
  ({ $visible }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    width: "100%",
    maxWidth: 760,
    minHeight: 88,
    padding: "16px 20px 16px 28px",
    border: "1px solid #dbe5e9",
    borderRadius: 22,
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 32px rgba(9, 24, 77, 0.18)",
    pointerEvents: $visible ? "auto" : "none",

    [media.dialogMobile]: {
      gap: 8,
      flexWrap: "nowrap",
      minHeight: 62,
      padding: "8px 12px",
    },
  }),
);

export const FloatingActionText = styled.p({
  color: navy,
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.5,

  [media.dialogMobile]: {
    display: "none",
  },
  [media.tablet]: {
    minHeight: 72,
    maxWidth: 620,
    padding: "12px 16px 12px 22px",
  },
});

export const FloatingActionButtons = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: 10,
  flexShrink: 0,

  [media.dialogMobile]: {
    width: "100%",
    flexShrink: 1,
  },
});

export const FloatingResetButton = styled.button({
  minWidth: 110,
  minHeight: 50,
  padding: "0 18px",
  border: "1px solid #cbd7e8",
  borderRadius: 8,
  color: navy,
  backgroundColor: "#ffffff",
  fontSize: 17,
  fontWeight: 700,

  "&:hover": {
    backgroundColor: greenSoft,
  },

  [media.dialogMobile]: {
    flex: 1,
    minWidth: 0,
    minHeight: 42,
    fontSize: 15,
  },
  [media.tablet]: {
    minHeight: 42,
    fontSize: 14,
  },
});

export const FloatingSaveButton = styled.button({
  minWidth: 150,
  minHeight: 50,
  padding: "0 20px",
  borderRadius: 8,
  color: "#ffffff",
  backgroundColor: green,
  fontSize: 17,
  fontWeight: 700,

  "&:hover": {
    backgroundColor: greenHover,
  },

  [media.dialogMobile]: {
    flex: 1,
    minWidth: 0,
    minHeight: 42,
    fontSize: 15,
  },
  [media.tablet]: {
    minHeight: 42,
    fontSize: 14,
  },
});

export const DialogBackdrop = styled.div({
  position: "fixed",
  inset: 0,
  zIndex: 1200,
  ...centeredFlex,
  padding: 20,
  backgroundColor: "rgba(8, 24, 40, 0.55)",
});

export const DialogBox = styled.div({
  width: "100%",
  maxWidth: 460,
  padding: "30px 28px",
  borderRadius: 16,
  backgroundColor: "#ffffff",
  boxShadow: "0 18px 60px rgba(0, 0, 0, 0.16)",
  [media.mobile]: {
    padding: "22px 18px",
  },
});

export const DialogTitle = styled.h2({
  color: navy,
  fontSize: 24,
  fontWeight: 700,
  textAlign: "center",
  [media.mobile]: {
    fontSize: 20,
  },
});

export const DialogDescription = styled.p({
  marginTop: 12,
  color: muted,
  fontSize: 16,
  lineHeight: 1.6,
  textAlign: "center",
  [media.mobile]: {
    fontSize: 14,
  },
});

export const DialogActions = styled.div({
  display: "flex",
  gap: 12,
  marginTop: 28,
});

export const DialogCancelButton = styled.button({
  flex: 1,
  minHeight: 50,
  border: "1px solid #cbd7e8",
  borderRadius: 8,
  color: navy,
  backgroundColor: "#ffffff",
  fontSize: 17,
  fontWeight: 700,

  "&:hover": {
    backgroundColor: "#f5f8fa",
  },
});

export const DialogConfirmButton = styled.button({
  flex: 1,
  minHeight: 50,
  borderRadius: 8,
  color: "#ffffff",
  backgroundColor: green,
  fontSize: 17,
  fontWeight: 700,

  "&:hover": {
    backgroundColor: greenHover,
  },
});
