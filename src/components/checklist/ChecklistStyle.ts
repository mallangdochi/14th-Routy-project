import styled from "@emotion/styled";

export const ChecklistStyle = styled.section({
  "--body-size": "16px",
  "--title-size": "24px",
  width: "100%",
  minWidth: 0,
  padding: "20px",
  color: "#142047",
  backgroundColor: "#FFFFFF",
  border: "1px solid #EBEEF2",
  borderRadius: 16,
  fontSize: "var(--body-size)",

  "& button:disabled": {
    opacity: 0.5,
  },

  "& button:focus-visible, & input:focus-visible, & textarea:focus-visible, & select:focus-visible":
    {
      outline: "3px solid #527F79",
      outlineOffset: 3,
    },

  "& svg": {
    width: 20,
    height: 20,
    flexShrink: 0,
  },

  "& .checklist-header": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },

  "& h2": {
    fontSize: "var(--title-size)",
    fontWeight: 800,
    lineHeight: 1.4,
    wordBreak: "keep-all",
  },

  "& .primary-button": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "8px 18px",
    border: "1px solid #0D3E41",
    borderRadius: 8,
    backgroundColor: "#0D5355",
    color: "#FFFFFF",
    fontWeight: 600,
    whiteSpace: "nowrap",
    flexShrink: 0,

    "&:hover": {
      backgroundColor: "#0D3E41",
    },
  },

  "& .checklist-layout": {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.15fr) minmax(0, 1.15fr) minmax(220px, .9fr)",
    gap: 16,
    alignItems: "stretch",
  },

  "& .group-card, & .summary-card": {
    minWidth: 0,
    border: "1px solid #E8EDF2",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },

  "& .group-heading": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 0,
    textAlign: "left",
  },

  "& .group-name": {
    display: "flex",
    gap: 8,
    alignItems: "center",
    fontSize: "18px",
    fontWeight: 750,

    "& svg": {
      display: "none",
      color: "#08746E",
    },
  },

  "& .group-count": {
    marginLeft: "auto",
    color: "#667398",
    whiteSpace: "nowrap",
  },

  "& .group-chevron": {
    display: "none",
    transition: "transform 180ms ease",

    "&.is-open": {
      transform: "rotate(180deg)",
    },
  },

  "& progress": {
    display: "block",
    appearance: "none",
    border: 0,
    borderRadius: 999,
    overflow: "hidden",
    height: 10,
    width: "100%",
    backgroundColor: "#F0F2F4",

    "&::-webkit-progress-bar": {
      backgroundColor: "#F0F2F4",
      borderRadius: 999,
    },

    "&::-webkit-progress-value": {
      background: "linear-gradient(90deg, #009F9C, #00C5AC)",
      borderRadius: 999,
    },

    "&::-moz-progress-bar": {
      background: "#00B7A4",
      borderRadius: 999,
    },
  },

  "& .group-progress": {
    margin: "10px 0 12px",
  },

  "& .group-body": {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minWidth: 0,

    "&.is-collapsed": {
      display: "none",
    },
  },

  "& .item-list": {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    minWidth: 0,
    padding: 0,
  },

  "& .item-row": {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px",
    border: "1px solid #EDF0F5",
    borderRadius: 9,
    minWidth: 0,
  },

  "& .item-label": {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: "1 1 0",
    minWidth: 0,
    cursor: "pointer",

    "& input": {
      position: "absolute",
      width: 1,
      height: 1,
      opacity: 0,
    },

    "& input:checked + .check-mark": {
      backgroundColor: "#00B6A6",
      borderColor: "#00B6A6",

      "& svg": {
        opacity: 1,
      },
    },

    "& input:focus-visible + .check-mark": {
      outline: "3px solid #527F79",
      outlineOffset: 3,
    },
  },

  "& .check-mark": {
    width: 25,
    height: 25,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    border: "2px solid #CDD2D9",
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",

    "& svg": {
      width: 18,
      height: 18,
      color: "#FFFFFF",
      opacity: 0,
    },
  },

  "& .item-copy": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 0",
    minWidth: 0,
  },

  "& .item-title": {
    display: "block",
    fontWeight: 650,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  "& .item-description": {
    display: "block",
    color: "#7380A0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  "&& .item-actions": {
    position: "relative",
    flex: "0 0 28px",
    width: 28,
    minWidth: 0,
    maxWidth: 28,

    "& > .sort-trigger": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      minWidth: 0,
      minHeight: 44,
      padding: 0,
      gap: 0,
      border: 0,
      borderRadius: 6,
      backgroundColor: "transparent",
      color: "#6C7A99",
      fontSize: 22,

      "&:hover": {
        backgroundColor: "#EEF7F5",
      },
    },

    "& > .sort-dropdown": {
      position: "absolute",
      top: "100%",
      right: 0,
      bottom: "auto",
      left: "auto",
      zIndex: 10,
      width: 110,
      minWidth: 0,
      maxWidth: "calc(100vw - 48px)",
      margin: 0,
      padding: 4,
      border: "1px solid #E2E8E8",
      borderRadius: 8,
      backgroundColor: "#FFFFFF",
      boxShadow: "0 8px 24px #1636381A",
      textAlign: "left",

      "& > button": {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 8,
        width: "100%",
        minWidth: 0,
        padding: 10,
        borderRadius: 5,
        color: "#142047",
        fontSize: "var(--body-size)",
        textAlign: "left",
        whiteSpace: "normal",
        overflowWrap: "anywhere",

        "&:hover": {
          backgroundColor: "#EEF7F5",
        },
      },
    },
  },

  "& .add-item": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 40,
    padding: 6,
    borderRadius: 7,
    backgroundColor: "#ECF9F5",
    color: "#0D6464",
    fontWeight: 600,

    "&:hover": {
      backgroundColor: "#DAF1EA",
    },
  },

  "& .empty-text": {
    padding: "20px 0",
    textAlign: "center",
    color: "#7380A0",
  },

  "& .summary-card h3": {
    fontSize: 18,
    fontWeight: 750,
    marginBottom: 12,
  },

  "& .summary-numbers": {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,

    "& strong": {
      fontSize: 32,
      fontWeight: 800,
      lineHeight: 1.3,
    },
  },

  "& .summary-tip": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
    marginTop: 24,
    padding: "24px 20px",
    border: "1px solid #0E6665",
    borderRadius: 16,
    backgroundColor: "#EDF8F4",
    color: "#0E6665",
    textAlign: "left",
    wordBreak: "keep-all",
    overflowWrap: "break-word",

    "& > svg": {
      width: 36,
      height: 36,
      flexShrink: 0,
    },

    "& > div": {
      width: "100%",
      minWidth: 0,
    },

    "& strong": {
      display: "block",
      fontSize: "18px",
      fontWeight: 750,
    },

    "& p": {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      marginTop: 10,
      color: "#7380A0",
      fontSize: "var(--body-size)",
      lineHeight: 1.7,
    },

    "& p > span": {
      display: "block",
    },
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    "--body-size": "15px",
    "--title-size": "22px",
    padding: 16,

    "& .checklist-layout": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 12,
    },

    "& .summary-card": {
      gridColumn: "1 / -1",
      gridRow: 1,
      display: "flex",
      alignItems: "center",
      gap: 20,
      padding: "12px 16px",
    },

    "& .summary-card h3": {
      margin: 0,
      fontSize: 16,
      whiteSpace: "nowrap",
    },

    "& .summary-numbers": {
      display: "contents",

      "& > span:first-of-type": {
        whiteSpace: "nowrap",
      },

      "& > span:last-of-type": {
        order: 1,
      },

      "& strong": {
        fontSize: 28,
      },
    },

    "& .summary-card progress": {
      flex: "1 1 0",
      width: "auto",
    },

    "& .summary-tip": {
      display: "none",
    },
  },

  "@media (max-width: 767px)": {
    "--body-size": "14px",
    "--title-size": "20px",
    padding: 12,
    borderRadius: 10,

    "& .checklist-header": {
      gap: 8,
      marginBottom: 12,
    },

    "& h2": {
      fontSize: "clamp(17px, 4.5vw, 20px)",
    },

    "& .primary-button": {
      padding: "8px 12px",
      gap: 4,
    },

    "& .checklist-layout": {
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },

    "& .summary-card": {
      order: -1,
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      gap: "4px 12px",
      padding: "10px 12px",
    },

    "& .summary-card h3": {
      fontSize: 14,
      margin: 0,
    },

    "& .summary-numbers": {
      display: "contents",

      "& > span:first-of-type": {
        gridColumn: 1,
        gridRow: 2,
        whiteSpace: "nowrap",
      },

      "& > span:last-of-type": {
        gridColumn: 2,
        gridRow: 1,
        textAlign: "right",
        color: "#0E6665",
        fontWeight: 700,
      },

      "& strong": {
        fontSize: 22,
      },
    },

    "& .summary-card progress": {
      gridColumn: 2,
      gridRow: 2,
      alignSelf: "center",
      height: 8,
    },

    "& .summary-tip": {
      display: "none",
    },

    "& .group-card": {
      padding: 12,
    },

    "& .group-name": {
      fontSize: 16,

      "& svg": {
        display: "block",
        width: 18,
        height: 18,
      },
    },

    "& .group-chevron": {
      display: "block",
      width: 16,
      height: 16,
    },

    "& .group-count": {
      fontSize: 14,
    },

    "& .group-progress": {
      height: 6,
      margin: "8px 0 10px",
    },

    "& .item-list": {
      gap: 4,
    },

    "& .item-row": {
      padding: "4px 0",
      border: 0,
      borderRadius: 0,
    },

    "& .item-label": {
      gap: 8,
      minHeight: 36,
    },

    "& .check-mark": {
      width: 20,
      height: 20,

      "& svg": {
        width: 14,
        height: 14,
      },
    },

    "& .item-description": {
      lineHeight: 1.4,
    },
  },
});
