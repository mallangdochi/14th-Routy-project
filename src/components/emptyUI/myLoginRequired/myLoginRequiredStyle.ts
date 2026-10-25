import styled from "@emotion/styled";

export const LoginRequiredStyle = styled.div({
  "--page-title-size": "44px",
  "--card-title-size": "28px",
  "--subtitle-size": "22px",
  "--body-size": "18px",
  "--button-size": "17px",
  width: "100%",
  minWidth: 0,
  // padding: "48px 40px",
  backgroundColor: "#FEFBF5",
  color: "#0D3E41",

  "& .login-required-header": {
    width: "100%",
    maxWidth: 1120,
    marginInline: "auto",
    marginBottom: 32,
    "& h1": {
      fontSize: "var(--page-title-size)",
      fontWeight: 800,
      lineHeight: 1.3,
      letterSpacing: "-0.04em",
      overflowWrap: "anywhere",
    },
    "& p": {
      marginTop: 12,
      fontSize: "var(--subtitle-size)",
      color: "#809ABD",
      fontWeight: 500,
      overflowWrap: "anywhere",
    },
  },

  "& .login-required-card": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: 1120,
    marginInline: "auto",
    padding: "40px 32px 36px",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 8px 36px rgba(13, 62, 65, 0.05)",
    textAlign: "center",
    "& h2": {
      marginTop: 24,
      fontSize: "var(--card-title-size)",
      fontWeight: 800,
      lineHeight: 1.4,
      letterSpacing: "-0.035em",
      wordBreak: "keep-all",
      overflowWrap: "anywhere",
    },
  },

  "& .login-required-image": {
    width: 200,
    maxWidth: "100%",
    height: 200,
    objectFit: "contain",
  },

  "& .login-required-description": {
    marginTop: 14,
    color: "#809ABD",
    fontSize: "var(--body-size)",
    fontWeight: 500,
    wordBreak: "keep-all",
    overflowWrap: "anywhere",
  },

  "& .login-required-button": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 480,
    minHeight: 60,
    marginTop: 28,
    padding: "14px 20px",
    borderRadius: 14,
    backgroundColor: "#0D3E41",
    color: "#FFFFFF",
    fontSize: "var(--button-size)",
    fontWeight: 700,
    transition: "background-color 200ms ease",
    "&:hover": { backgroundColor: "#005457" },
  },

  "& .login-required-signup": {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "baseline",
    gap: "6px 10px",
    marginTop: 20,
    fontSize: "var(--body-size)",
    color: "#809ABD",
    "& a": {
      color: "#0D3E41",
      fontWeight: 600,
      textDecoration: "underline",
      textUnderlineOffset: 5,
    },
  },

  "& .login-required-support": {
    display: "none",
  },

  "& a:focus-visible": {
    outline: "3px solid #527F79",
    outlineOffset: 4,
  },

  "@media  (max-width: 1023px)": {
    "--page-title-size": "36px",
    "--card-title-size": "24px",
    "--subtitle-size": "20px",
    "--body-size": "17px",
    "--button-size": "16px",
  },

  "@media (max-width: 767px)": {
    "--page-title-size": "28px",
    "--card-title-size": "20px",
    "--subtitle-size": "18px",
    "--body-size": "16px",
    "--button-size": "16px",
    // padding: "28px 20px 36px",

    "& .login-required-header": {
      marginBottom: 28,
      "& p": { marginTop: 10 },
    },
    "& .login-required-card": {
      padding: "32px 20px 28px",
      borderRadius: 20,
      "& h2": {
        marginTop: 22,
        "& span": { display: "block" },
      },
    },
    "& .login-required-image": { width: 144, height: 144 },
    "& .login-required-description": {
      marginTop: 14,
      "& span": { display: "block" },
    },
    "& .login-required-button": {
      minHeight: 54,
      marginTop: 24,
      borderRadius: 12,
    },
    "& .login-required-support": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      width: "fit-content",
      minHeight: 44,
      margin: "20px auto 0",
      color: "#809ABD",
      fontSize: "var(--body-size)",
      fontWeight: 500,
      "& svg": { flexShrink: 0 },
    },
  },
});
