import styled from "@emotion/styled";

export const KakaoSavedPlaceModalStyle = styled.div({
  position: "fixed",
  inset: 0,
  zIndex: 1100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  backgroundColor: "rgba(15, 28, 30, 0.56)",
  fontFamily: "inherit",
  fontSize: 16,

  "& .saved-map-dialog": {
    display: "flex",
    flexDirection: "column",
    width: "min(780px, 100%)",
    height: "min(720px, 90dvh)",
    minHeight: 0,
    backgroundColor: "#FFFEFA",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(0,0,0,0.24)",
  },

  "& .saved-map-heading": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    padding: "20px 24px",
    borderBottom: "1px solid #DCE5E6",
  },

  "& .saved-map-title": {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },

  "& .saved-map-eyebrow": {
    color: "#778D90",
    fontSize: 15,
  },

  "& h2": {
    margin: 0,
    fontSize: 23,
    lineHeight: 1.35,
    color: "#0A414B",
  },

  "& .saved-map-title p": {
    display: "flex",
    alignItems: "center",
    gap: 6,
    margin: 0,
    color: "#596D75",
    fontSize: 15,
    lineHeight: 1.5,
  },

  "& .saved-map-title svg": {
    flexShrink: 0,
  },

  "& .saved-map-close": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid #DCE5E6",
    backgroundColor: "#FFFFFF",
    color: "#0A414B",
    borderRadius: 9,
    width: 42,
    height: 42,
    cursor: "pointer",
  },

  "& .saved-map-display": {
    position: "relative",
    flex: "1 1 0",
    minHeight: 200,
    overflow: "hidden",
  },

  "& .saved-map-footer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    padding: "16px 24px",
    borderTop: "1px solid #DCE5E6",
  },

  "& .saved-map-footer p": {
    margin: 0,
    color: "#778D90",
    fontSize: 15,
  },

  "& .saved-map-footer button": {
    border: 0,
    borderRadius: 9,
    padding: "11px 22px",
    color: "#FFFFFF",
    backgroundColor: "#0A414B",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },

  "@media (max-width: 767px)": {
    padding: 0,

    "& .saved-map-dialog": {
      width: "100%",
      height: "100dvh",
      borderRadius: 0,
    },

    "& .saved-map-heading": {
      padding: "16px",
    },

    "& .saved-map-footer": {
      padding: "14px 16px",
    },

    "& h2": {
      fontSize: 21,
    },

    "& .saved-map-footer button": {
      whiteSpace: "nowrap",
    },
  },
});
