import styled from "@emotion/styled";

export const TripCardStyle = styled.article({
  cursor: "pointer",
  "--trip-font-size": "16px",
  fontSize: "var(--trip-font-size)",
  minWidth: 0,
  backgroundColor: "#fff",
  border: "1px solid #e5e9ec",
  borderRadius: "16px",
  boxShadow: "0 3px 12px rgba(20, 45, 55, 0.045)",

  "& .trip-image-button": {
    display: "block",
    width: "100%",

    borderRadius: "16px 16px 0 0",

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
    display: "flex",
    gap: 20,

    minWidth: 0,

    textAlign: "left",
  },

  "& .trip-menu": {
    display: "none",
    "& .sort-trigger": {
      justifyContent: "center",
      height: "30px",
      padding: 0,
      borderRadius: "6px",
      color: "#73859b",
    },

    "& .sort-trigger svg": {
      width: "20px",
      height: "20px",
    },

    "& .sort-dropdown": {
      left: "auto",
      right: 0,
      minWidth: "140px",
    },

    "& .sort-dropdown button": {
      fontSize: "var(--trip-font-size)",
    },

    "& .sort-dropdown button:last-child": {
      color: "#bd453d",
    },

    "@media (hover: hover) and (pointer: fine)": {
      "& .sort-trigger:hover": {
        backgroundColor: "#edf3f4",
      },
    },
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
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
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
    gap: "4px",
    minWidth: 0,
    padding: "12px 16px",
  },

  "& .trip-content h2": {
    overflow: "hidden",
    // paddingRight: "20px",
    color: "#152c45",
    fontSize: "18px",
    fontWeight: 600,
    letterSpacing: "-0.015em",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  "& .trip-date": {
    overflow: "hidden",
    color: "#73869d",
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "-0.01em",
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
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "-0.01em",
  },

  "& .trip-stats span": {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap",
  },

  "& .trip-stats strong": {
    color: "#1a3552",
    fontWeight: 600,
  },

  "& .trip-stats svg": {
    width: "17px",
    height: "17px",
    flexShrink: 0,
    color: "#173e61",
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
  "& .trip-card-desc": {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      boxShadow: "0 6px 18px rgba(20,45,55,0.1)",
    },
  },
  "@media (max-width: 1440px)": {
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
      "& .sort-trigger": {
        justifyContent: "center",
        height: "30px",
        padding: 0,
        borderRadius: "6px",
        color: "#73859b",
      },

      "& .sort-trigger svg": {
        width: "20px",
        height: "20px",
      },

      "& .sort-dropdown": {
        left: "auto",
        right: 0,
        minWidth: "140px",
      },

      "& .sort-dropdown button": {
        fontSize: "var(--trip-font-size)",
      },

      "& .sort-dropdown button:last-child": {
        color: "#bd453d",
      },

      "@media (hover: hover) and (pointer: fine)": {
        "& .sort-trigger:hover": {
          backgroundColor: "#edf3f4",
        },
      },
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
      fontSize: "14px",
      fontWeight: 600,
      letterSpacing: "-0.01em",
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
      gap: "4px",
      minWidth: 0,
      padding: "12px 16px",
    },

    "& .trip-content h2": {
      overflow: "hidden",
      // paddingRight: "20px",
      color: "#152c45",
      fontSize: "18px",
      fontWeight: 600,
      letterSpacing: "-0.015em",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },

    "& .trip-date": {
      overflow: "hidden",
      color: "#73869d",
      fontSize: "16px",
      fontWeight: 400,
      letterSpacing: "-0.01em",
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
      fontSize: "16px",
      fontWeight: 400,
      letterSpacing: "-0.01em",
    },

    "& .trip-stats span": {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      whiteSpace: "nowrap",
    },

    "& .trip-stats strong": {
      color: "#1a3552",
      fontWeight: 600,
    },

    "& .trip-stats svg": {
      width: "17px",
      height: "17px",
      flexShrink: 0,
      color: "#173e61",
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
    "& .trip-card-desc": {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
  },

  "@media (max-width: 1023px)": {
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
      fontSize: 18,
      fontWeight: 700,
    },

    "& .trip-date": { fontSize: 16 },
    "& .trip-stats": {
      fontSize: "var(--trip-font-size)",
      flexWrap: "wrap",
      gap: "5px 10px",
    },

    "& .trip-badge": {
      top: "7px",
      left: "7px",
      padding: "4px 8px",
      fontSize: "var(--trip-font-size)",
    },

    "& .trip-stats svg": {
      width: "15px",
      height: "15px",
    },

    "& .trip-image-wrapper": {
      aspectRatio: "4 / 3",
    },
  },
  // 상태별 하단 데이터에만 적용
  "& .trip-stats.trip-status-summary": {
    justifyContent: "flex-start",
    color: "#596D75",
  },

  "& .trip-status-summary .trip-status-line": {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap",
  },

  "& .trip-status-summary .trip-status-line svg": {
    color: "#438B80",
  },

  "& .trip-status-summary .trip-countdown": {
    marginLeft: "2px",
    color: "#438B80",
    fontSize: "1.2em",
    fontWeight: 700,
    lineHeight: 1.2,
  },

  "& .trip-status-summary .trip-completed-summary": {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "4px 12px",
    minWidth: 0,
  },

  "& .trip-status-summary .trip-amount": {
    display: "inline-flex",
    alignItems: "baseline",
    gap: "6px",
    whiteSpace: "nowrap",
  },

  "& .trip-status-summary .trip-amount-label": {
    color: "#687F97",
  },

  "& .trip-status-summary .trip-summary-dot": {
    color: "#687F97",
  },

  // 기존 목록형 하단 구분선이 내부 span에 적용되지 않도록 처리
  "&.view-list .trip-status-summary span + span": {
    borderLeft: 0,
    paddingLeft: 0,
  },
  "& .trip-members-row": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    minWidth: 0,
    margin: "6px 0 4px",
  },
  "& .trip-members": {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
  },
  "& .trip-member-avatars": {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    paddingRight: 0,
  },
  "& .trip-member-avatar": {
    position: "relative",
    display: "grid",
    placeItems: "center",
    width: "30px",
    height: "30px",
    border: 0,
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#E3F3ED",
    color: "#0D3E41",
    fontSize: "12px",
    fontWeight: 600,
    flexShrink: 0,
    "& + .trip-member-avatar": { marginLeft: "-8px" },
    "&:nth-of-type(2)": { backgroundColor: "#F8E7EE" },
    "&:nth-of-type(3)": { backgroundColor: "#FFF1CC" },
    "& img": {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    "& svg": { width: "15px", height: "15px" },
  },
  "& .trip-member-avatars + .trip-member-count": {
    // marginLeft: "-8px",
    marginLeft: 5,
    position: "relative",
    zIndex: 1,
    minHeight: "30px",
    boxSizing: "border-box",
  },
  "& .trip-member-count": {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "4px 9px",
    borderRadius: "999px",
    backgroundColor: "#E3F3ED",
    color: "#0D3E41",
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: 1.4,
    whiteSpace: "nowrap",
    "& svg": { width: "14px", height: "14px", flexShrink: 0 },
  },
});
