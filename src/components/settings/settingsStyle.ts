import styled from "@emotion/styled";

const green = "#005044";
const navy = "#09184d";
const muted = "#60769e";
const border = "#d6e3fa";

export const SettingsContent = styled.div<{
  $hasChanges: boolean;
}>(({ $hasChanges }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 20,
  paddingBottom: $hasChanges ? 110 : 0,

  "@media (max-width: 760px)": {
    paddingBottom: $hasChanges ? 160 : 0,
  },
}));

export const SettingsPageHeader = styled.header({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 24,
  marginBottom: 14,

  "@media (max-width: 760px)": {
    alignItems: "flex-start",
    flexDirection: "column",
    gap: 18,
  },
});

export const SettingsHeading = styled.div({
  minWidth: 0,
});

export const SettingsPageTitle = styled.h1({
  color: navy,
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
});

export const SettingsPageDescription = styled.p({
  marginTop: 7,
  color: muted,
  fontSize: 24,
  fontWeight: 500,

  "@media (max-width: 760px)": {
    fontSize: 16,
  },
});

export const SettingsCard = styled.section({
  width: "100%",
  padding: "20px 26px 24px",
  border: `2px solid ${border}`,
  borderRadius: 12,
  backgroundColor: "#ffffff",

  "@media (max-width: 760px)": {
    padding: "19px 17px",
  },
});

export const SettingsCardTitle = styled.h2({
  marginBottom: 10,
  color: navy,
  fontSize: 27,
  fontWeight: 800,
  letterSpacing: "-0.035em",

  "@media (max-width: 760px)": {
    fontSize: 22,
  },
});

export const SettingRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 20,
  minHeight: 78,
  padding: "10px 0",

  "@media (max-width: 760px)": {
    gap: 12,
    flexWrap: "wrap",
  },
});

export const RowIcon = styled.span({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 40,
  height: 40,
  color: green,

  "& svg": {
    width: 32,
    height: 32,
    strokeWidth: 2,
  },

  "@media (max-width: 760px)": {
    width: 30,
    height: 30,

    "& svg": {
      width: 25,
      height: 25,
    },
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

  "@media (max-width: 760px)": {
    fontSize: 17,
  },
});

export const SettingDescription = styled.p({
  marginTop: 3,
  color: muted,
  fontSize: 16,
  lineHeight: 1.5,

  "@media (max-width: 760px)": {
    fontSize: 14,
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

  "@media (max-width: 760px)": {
    flexWrap: "wrap",
  },
});

export const PermissionInfo = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 15,
  minWidth: 0,
  color: "#596782",
});

export const PermissionText = styled.p({
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 1.5,

  "@media (max-width: 760px)": {
    fontSize: 14,
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
    backgroundColor: "#006c5b",
  },

  "&:disabled": {
    opacity: 0.55,
  },

  "@media (max-width: 760px)": {
    minWidth: 128,
    minHeight: 42,
    fontSize: 14,
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

  "@media (max-width: 880px)": {
    width: 220,
  },

  "@media (max-width: 600px)": {
    width: "calc(100% - 42px)",
    marginLeft: 42,
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
      backgroundColor: $selected ? "#006c5b" : "#edf8f5",
    },

    "&:focus-visible": {
      outline: `2px solid ${green}`,
      outlineOffset: -3,
    },

    "@media (max-width: 760px)": {
      fontSize: 14,
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
    backgroundColor: "#edf8f5",
  },

  "@media (max-width: 600px)": {
    marginLeft: 42,
    minWidth: 150,
    minHeight: 44,
    fontSize: 15,
  },
});

export const Feedback = styled.p({
  marginTop: 10,
  color: muted,
  fontSize: 14,
  lineHeight: 1.5,
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

    "@media (max-width: 760px)": {
      left: 0,
      bottom: 16,
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
    borderRadius: 9999,
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 32px rgba(9, 24, 77, 0.18)",
    pointerEvents: $visible ? "auto" : "none",

    "@media (max-width: 600px)": {
      gap: 12,
      flexWrap: "wrap",
      minHeight: 0,
      padding: "16px 24px",
    },
  }),
);

export const FloatingActionText = styled.p({
  color: navy,
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.5,

  "@media (max-width: 600px)": {
    width: "100%",
    fontSize: 15,
  },
});

export const FloatingActionButtons = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: 10,
  flexShrink: 0,

  "@media (max-width: 600px)": {
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
    backgroundColor: "#edf8f5",
  },

  "@media (max-width: 600px)": {
    flex: 1,
    minWidth: 0,
    minHeight: 46,
    fontSize: 15,
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
    backgroundColor: "#006c5b",
  },

  "@media (max-width: 600px)": {
    flex: 1,
    minWidth: 0,
    minHeight: 46,
    fontSize: 15,
  },
});

export const DialogBackdrop = styled.div({
  position: "fixed",
  inset: 0,
  zIndex: 1200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
});

export const DialogTitle = styled.h2({
  color: navy,
  fontSize: 24,
  fontWeight: 700,
  textAlign: "center",
});

export const DialogDescription = styled.p({
  marginTop: 12,
  color: muted,
  fontSize: 16,
  lineHeight: 1.6,
  textAlign: "center",
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
    backgroundColor: "#006c5b",
  },
});
