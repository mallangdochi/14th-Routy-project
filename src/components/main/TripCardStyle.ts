import styled from "@emotion/styled";
import { dropdownAnimation } from "../../styles/animation";

export const TripCardStyle = styled.article({
  "--trip-font-size": "16px",
  fontSize: "var(--trip-font-size)",
  minWidth: 0,
  backgroundColor: "#fff",
  border: "1px solid #e5e9ec",
  borderRadius: "12px",
  boxShadow: "0 3px 12px rgba(20, 45, 55, 0.045)",

  "& .trip-image-button": {
    display: "block",
    width: "100%",

    borderRadius: "12px 12px 0 0",

    overflow: "hidden",
  },

  "& .trip-heading": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    width: "100%",
    minWidth: 0,
  },

  "& .trip-title-button": {
    flex: 1,
    minWidth: 0,

    textAlign: "left",
  },

  "& .trip-menu": {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    flexShrink: 0,
  },

  "& .trip-menu-trigger": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",

    borderRadius: "6px",

    color: "#73859b",
  },

  "& .trip-menu-dropdown": {
    ...dropdownAnimation,
    position: "absolute",
    top: "100%",
    right: 0,
    zIndex: 20,
    display: "flex",
    flexDirection: "column",
    minWidth: "140px",
    padding: "8px 0",
    border: "1px solid #e5e9ed",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.12)",
  },
  "& .trip-menu-trigger svg": {
    width: "20px",
    height: "20px",
  },

  "& .trip-image-wrapper": {
    position: "relative",
    width: "100%",
    aspectRatio: "2 / 1",
    overflow: "hidden",
    backgroundColor: "#edf4f5",
  },

  "& .trip-image-wrapper img": {
    height: "100%",
    objectFit: "cover",
  },

  "& .trip-badge": {
    position: "absolute",
    top: "10px",
    left: "10px",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "var(--trip-font-size)",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  "& .trip-badge.planning": {
    backgroundColor: "#cdece3",
    color: "#006052",
  },

  "& .trip-badge.in_progress": {
    backgroundColor: "#ffe6c9",
    color: "#b84a23",
  },

  "& .trip-badge.completed": {
    backgroundColor: "#e2f0ff",
    color: "#285e91",
  },

  "& .trip-content": {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
    minWidth: 0,
    padding: "14px",
  },

  "& .trip-content h2": {
    overflow: "hidden",
    paddingRight: "20px",
    color: "#152c45",
    fontSize: "17px",
    fontWeight: 700,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  "& .trip-date": {
    overflow: "hidden",
    color: "#73869d",
    fontSize: "var(--trip-font-size)",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  "& .trip-stats": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    marginTop: "4px",
    color: "#687f97",
    fontSize: "var(--trip-font-size)",
  },

  "& .trip-stats span": {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap",
  },

  "& .trip-stats strong": {
    color: "#1a3552",
    fontWeight: 700,
  },

  "& .trip-stats svg": {
    width: "17px",
    height: "17px",
    flexShrink: 0,
    color: "#173e61",
  },

  "& .trip-menu-dropdown button": {
    display: "block",
    width: "100%",
    padding: "10px",

    borderRadius: "5px",

    color: "#20394e",
    fontSize: "var(--trip-font-size)",
    textAlign: "left",
  },

  "& .trip-menu-dropdown .delete": {
    color: "#bd453d",
  },

  "& .trip-menu-dropdown button:hover": {
    backgroundColor: "#eaf7f4",
  },

  "& .trip-menu-dropdown button:focus-visible": {
    outline: "2px solid #005358",
    outlineOffset: "-2px",
    backgroundColor: "#eaf7f4",
  },

  "&.view-list": {
    display: "flex",
    alignItems: "stretch",
    gap: "16px",
    padding: "10px",
  },
  "&.view-list .trip-image-button": {
    flex: "0 0 150px",
    width: "auto",
    borderRadius: "10px",
  },
  "&.view-list .trip-image-wrapper": {
    height: "100%",
    minHeight: "140px",
    aspectRatio: "auto",
  },
  "&.view-list .trip-image-wrapper .trip-badge": {
    display: "none",
  },
  "&.view-list .trip-content": {
    flex: 1,
    justifyContent: "center",
    padding: "4px 0",
    gap: "8px",
  },
  "&.view-list .trip-heading": {
    alignItems: "flex-start",
  },
  "&.view-list .trip-title-button": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "7px",
  },
  "&.view-list .trip-title-button .trip-badge": {
    position: "static",
    padding: "4px 12px",
  },
  "&.view-list .trip-content h2": {
    paddingRight: 0,
    maxWidth: "100%",
  },
  "&.view-list .trip-stats": {
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: "8px 16px",
    marginTop: 0,
  },
  "&.view-list .trip-stats span + span": {
    borderLeft: "1px solid #e5e9ec",
    paddingLeft: "16px",
  },

  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      boxShadow: "0 6px 18px rgba(20,45,55,0.1)",
    },

    "& .trip-menu-trigger:hover": {
      backgroundColor: "#edf3f4",
    },

    "& .trip-menu-dropdown button:hover": {
      backgroundColor: "#f1f5f5",
    },
  },

  "@media (min-width: 768px) and (max-width: 1023px)": {
    "--trip-font-size": "15px",
    "& .trip-content": {
      padding: "10px",
      gap: "6px",
    },

    "& .trip-content h2": {
      fontSize: "var(--trip-font-size)",
    },

    "& .trip-date, & .trip-stats": {
      fontSize: "var(--trip-font-size)",
    },

    "& .trip-stats": {
      flexWrap: "wrap",
    },

    "& .trip-badge": {
      fontSize: "var(--trip-font-size)",
    },
  },

  "@media (max-width: 767px)": {
    "--trip-font-size": "14px",
    "&.view-list": {
      gap: "10px",
      padding: "10px",
    },
    "&.view-list .trip-image-button": {
      flexBasis: "28%",
      minWidth: "78px",
      maxWidth: "140px",
    },
    "&.view-list .trip-image-wrapper": {
      minHeight: "132px",
    },
    "&.view-list .trip-date": {
      whiteSpace: "normal",
      overflowWrap: "anywhere",
    },
    "&.view-list .trip-content h2": {
      whiteSpace: "normal",
      overflowWrap: "anywhere",
    },
    "&.view-list .trip-stats": {
      gap: "6px 10px",
    },
    "& .trip-content": {
      padding: "10px",
      gap: "7px",
    },

    "& .trip-content h2": {
      fontSize: "var(--trip-font-size)",
    },

    "& .trip-date, & .trip-stats": {
      fontSize: "var(--trip-font-size)",
    },

    "& .trip-badge": {
      top: "7px",
      left: "7px",
      padding: "4px 9px",
      fontSize: "var(--trip-font-size)",
    },

    "& .trip-stats": {
      flexWrap: "wrap",
      gap: "5px 10px",
    },

    "& .trip-stats svg": {
      width: "15px",
      height: "15px",
    },

    "& .trip-image-wrapper": {
      aspectRatio: "4 / 3",
    },
  },
});
