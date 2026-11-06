import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
const budgetBarX = keyframes({
  from: { transform: "scaleX(0)" },
  to: { transform: "scaleX(1)" },
});
const budgetBarY = keyframes({
  from: { transform: "scaleY(0)" },
  to: { transform: "scaleY(1)" },
});

export const TravelBudgetStatsPageStyle = styled.div({
  display: "flex",
  minHeight: "100dvh",
  minWidth: 0,
  background: "#fafaf8",
  color: "#0c1d4d",
  "& button:focus-visible, & input:focus-visible": {
    outline: "2px solid #006e70",
    outlineOffset: 2,
  },
  "& .stats-sidebar": {
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
    flexShrink: 0,
    height: "100dvh",
    zIndex: 3,
  },
  "& .stats-main": {
    width: "100%",
    maxWidth: 1420,
    margin: "0 auto",
    minWidth: 0,
    padding: "28px 28px 42px",
  },
  "& .stats-mobile-header, & .stats-mobile-nav": {
    display: "none",
  },
  "& .stats-topline": {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 0 16px",
    minHeight: 38,
  },
  "& .stats-topline h1": {
    fontSize: 23,
    fontWeight: 800,
    margin: 0,
  },
  "& .back-arrow": {
    position: "absolute",
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    border: 0,
    background: "transparent",
    color: "#122a62",
  },
  "& .trip-banner, & .stats-card": {
    background: "#fff",
    border: "1px solid #edf0f5",
    borderRadius: 14,
    boxShadow: "0 2px 17px #15385208",
  },
  "& .trip-banner": {
    display: "flex",
    alignItems: "center",
    gap: 18,
    padding: 16,
    marginBottom: 14,
    minWidth: 0,
  },
  "& .trip-cover": {
    width: 80,
    height: 75,
    flexShrink: 0,
    objectFit: "cover",
    borderRadius: 9,
    background: "#eff3f6",
  },
  "& .trip-cover-placeholder": {
    display: "grid",
    placeItems: "center",
    color: "#8295a5",
  },
  "& .trip-details": {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 0,
    flex: 1,
  },
  "& .trip-details strong": {
    fontSize: 23,
    fontWeight: 800,
    lineHeight: 1.15,
    overflowWrap: "anywhere",
  },
  "& .trip-details span": {
    fontSize: 15,
    color: "#8092b9",
  },
  "& .back-budget": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    background: "#007b76",
    color: "#fff",
    border: 0,
    padding: "12px 22px",
    borderRadius: 9,
    fontSize: 15,
    fontWeight: 750,
    whiteSpace: "nowrap",
  },
  "& .back-budget:hover": {
    background: "#005e5c",
  },
  "& .stats-layout": {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    gap: 13,
    alignItems: "stretch",
  },
  "& .stats-left, & .stats-right": {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    gap: 12,
  },
  "& .stats-card": {
    minWidth: 0,
    padding: 19,
  },
  "& .stats-card h2": {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "0 0 18px",
    color: "#0a2856",
    fontSize: 18,
    fontWeight: 800,
  },
  "& .stats-card h2 svg, & .teal-icon": {
    color: "#008378",
    flexShrink: 0,
  },
  "& .total-card": {
    minHeight: 188,
  },
  "& .total-card h2": {
    color: "#008378",
  },
  "& .total-card > strong": {
    display: "block",
    marginTop: 20,
    fontSize: "clamp(30px, 4vw, 54px)",
    letterSpacing: "-.045em",
    fontWeight: 850,
    lineHeight: 1.1,
  },
  "& .total-card > p": {
    margin: "7px 0 0",
    color: "#7890b3",
    fontSize: 15,
  },
  "& .card-heading": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  "& .card-heading h2": {
    margin: 0,
  },
  "& .funds-numbers": {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
    marginBottom: 12,
  },
  "& .funds-numbers > div": {
    display: "flex",
    flexWrap: "wrap",
    columnGap: 5,
    alignItems: "baseline",
    flexDirection: "row",
  },
  "& .funds-numbers > div:first-child": {
    borderRight: "1px solid #dce4ee",
  },
  "& .funds-numbers span": {
    width: "100%",
    color: "#8799b9",
    fontSize: 13,
    marginBottom: 2,
  },
  "& .funds-numbers strong": {
    fontWeight: 800,
    fontSize: 24,
    whiteSpace: "nowrap",
    overflowWrap: "anywhere",
  },
  "& .funds-numbers .remaining": {
    color: "#008f80",
  },
  "& .funds-numbers .over": {
    color: "#db5966",
  },
  "& .funds-numbers small": {
    color: "#8699ba",
    fontSize: 12,
  },
  "& .progress-track": {
    height: 12,
    background: "#edf0f1",
    borderRadius: 99,
    overflow: "hidden",
  },
  "& .progress-track > div": {
    height: "100%",
    background: "linear-gradient(90deg,#17b69b,#00a68f)",
    borderRadius: 99,
    transition: "width .3s ease",
    transformOrigin: "left",
    animation: `${budgetBarX} 850ms cubic-bezier(0.22, 1, 0.36, 1) both`,
  },
  "& .funds-label": {
    display: "flex",
    justifyContent: "space-between",
    color: "#8095b6",
    fontSize: 12,
    marginTop: 7,
  },
  "& .members-card": {
    paddingBottom: 16,
    flex: 1,
  },
  "& .categories-card": {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  "& .member-line": {
    display: "grid",
    gridTemplateColumns: "27px 70px minmax(40px,1fr) 92px 44px",
    gap: 8,
    alignItems: "center",
    margin: "10px 0",
    fontSize: 12,
  },
  "& .member-line img": {
    width: 25,
    height: 25,
    borderRadius: "50%",
    objectFit: "cover",
  },
  "& .member-line span": {
    whiteSpace: "nowrap",
  },
  "& .member-line strong": {
    fontSize: 12,
    textAlign: "right",
    whiteSpace: "nowrap",
  },
  "& .member-line small": {
    color: "#91a1bd",
    textAlign: "right",
    fontSize: 11,
  },
  "& .mini-track": {
    height: 11,
    borderRadius: 12,
    background: "#ecf0f3",
    overflow: "hidden",
  },
  "& .mini-track > div": {
    height: "100%",
    borderRadius: 12,
    transformOrigin: "left",
    animation: `${budgetBarX} 850ms cubic-bezier(0.22, 1, 0.36, 1) both`,
  },
  "& .settlement-note": {
    borderTop: "1px solid #edf1f4",
    marginTop: 15,
    paddingTop: 12,
    fontSize: 12,
  },
  "& .settlement-note > strong": {
    display: "block",
    marginBottom: 9,
    color: "#006f6a",
  },
  "& .settlement-note > div": {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
    padding: "4px 0",
  },
  "& .settlement-note .receive": {
    color: "#008b7d",
    fontWeight: 750,
  },
  "& .settlement-note .pay": {
    color: "#d56871",
    fontWeight: 750,
  },
  "& .settlement-note small": {
    display: "block",
    marginTop: 8,
    color: "#8b9db5",
    fontSize: 11,
  },
  "& .member-0": {
    background: "#4e9dfc",
  },
  "& .member-1": {
    background: "#a996ee",
  },
  "& .member-2": {
    background: "#f89abb",
  },
  "& .mode-switch": {
    display: "flex",
    borderRadius: 8,
    background: "#eff3f5",
    padding: 3,
    gap: 2,
  },
  "& .mode-switch button": {
    padding: "6px 12px",
    fontSize: 12,
    color: "#8091b2",
    fontWeight: 750,
    border: 0,
    background: "transparent",
    borderRadius: 6,
  },
  "& .mode-switch button.active": {
    color: "#fff",
    background: "#00827c",
  },
  "& .category-inside": {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 17,
    minWidth: 0,
  },
  "& .donut": {
    width: "min(75%, 225px)",
    flexShrink: 0,
    aspectRatio: "1",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    position: "relative",
  },
  "& .donut-hole": {
    width: "54%",
    height: "54%",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    background: "#fff",
    padding: 4,
    position: "relative",
  },
  "& .donut-hole span, & .donut-hole small": {
    color: "#8194b7",
    fontSize: 11,
  },
  "& .donut-hole strong": {
    margin: "3px 0",
    fontSize: 16,
    fontWeight: 850,
    whiteSpace: "nowrap",
  },
  "& .category-legend": {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 11,
    minWidth: 0,
  },
  "& .legend-line": {
    display: "grid",
    // gridTemplateColumns: "9px minmax(48px,1fr) auto 48px",
    gridTemplateColumns: "9px minmax(48px,1fr) auto auto",
    gap: 9,
    alignItems: "center",
    fontSize: 12,
  },
  "& .legend-line i": {
    width: 9,
    height: 9,
    borderRadius: 99,
  },
  "& .legend-line span": {
    whiteSpace: "nowrap",
  },
  "& .legend-line strong": {
    whiteSpace: "nowrap",
    fontSize: 12,
    textAlign: "right",
  },
  "& .legend-line small": {
    color: "#8ca2c0",
    textAlign: "right",
    fontSize: 11,
  },
  "& .no-data": {
    color: "#98a7bc",
    fontSize: 13,
  },
  "& .daily-card": {
    minHeight: 244,
    width: "100%",
    marginTop: 13,
  },
  "& .daily-chart": {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    minHeight: 200,
    overflowX: "auto",
  },
  "& .day-column": {
    minWidth: 80,
    padding: "0 8px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 4,
    borderRight: "1px solid #e7edf2",
  },
  "& .day-column:last-child": {
    borderRight: "none",
  },
  "& .day-heading": {
    fontSize: 13,
    fontWeight: 700,
  },
  "& .day-date": {
    fontSize: 11,
    color: "#93a3bf",
  },
  "& .bar-space": {
    width: "100%",
    maxWidth: 130,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: 100,
    padding: "0 4px",
  },
  "& .daily-bar": {
    width: "100%",
    minHeight: 0,
    background: "linear-gradient(180deg,#50ceae,#45bea6)",
    borderRadius: "7px 7px 3px 3px",
    transformOrigin: "bottom",
    animation: `${budgetBarY} 850ms cubic-bezier(0.22, 1, 0.36, 1) both`,
  },
  "& .day-column strong": {
    fontSize: 14,
    whiteSpace: "nowrap",
  },
  "& .day-column small": {
    color: "#8da1c4",
    fontSize: 11,
  },
  "& .highlights": {
    display: "grid",
    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
    marginTop: 12,
    padding: "14px 8px",
  },
  "& .highlights > div": {
    minWidth: 0,
    padding: "8px 20px",
    borderRight: "1px solid #dee6ee",
  },
  "& .highlights > div:last-child": { borderRight: "none" },
  "& .highlights h3": {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 13,
  },
  "& .highlights h3 svg": { flexShrink: 0, color: "#00897e" },
  "& .highlights ul": { display: "flex", flexDirection: "column", gap: 8 },
  "& .highlights li": {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: "3px 8px",
    position: "relative",
    fontSize: 13,
  },
  "& .highlights li > span": { color: "#718596", flexShrink: 0 },
  "& .highlights strong": {
    fontSize: 16,
    fontWeight: 800,
    overflowWrap: "anywhere",
  },
  "& .stats-data-note": {
    color: "#8b9ab2",
    fontSize: 11,
    lineHeight: 1.6,
    padding: "10px 4px",
  },
  "& .stats-summary-row": {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
    gap: 13,
    alignItems: "stretch",
    marginBottom: 13,
  },
  "& .donut-chart": {
    width: "100%",
    height: "100%",
    position: "absolute",
    inset: 0,
    ".donut-reveal": {
      animation: "donutFill 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
    },

    "@keyframes donutFill": {
      from: {
        strokeDasharray: "0 100",
      },
      to: {
        strokeDasharray: "100 100",
      },
    },

    "@media (prefers-reduced-motion: reduce)": {
      ".donut-reveal": {
        animation: "none",
      },
    },
  },
  "@media (max-width: 1023px)": {
    "& .stats-main": {
      padding: "18px 16px 34px",
    },
    "& .trip-details strong": {
      fontSize: 18,
    },
    "& .stats-card": {
      padding: 14,
    },
    "& .category-inside": {
      gap: 8,
    },
    "& .legend-line": {
      gridTemplateColumns: "7px minmax(38px,1fr) auto",
      gap: 4,
    },
    "& .legend-line small": {
      display: "none",
    },
    "& .donut-hole strong": {
      fontSize: 11,
    },
    "& .funds-numbers strong": {
      fontSize: 17,
    },
    "& .member-line": {
      gridTemplateColumns: "24px 70px minmax(25px, 1fr) 70px",
      gap: 4,
    },
    "& .member-line small": {
      display: "none",
    },
    "& .highlights strong": {
      fontSize: 14,
    },
  },
  "@media (max-width: 767px)": {
    display: "block",
    minWidth: 320,
    background: "#fafaf8",
    "& .stats-sidebar": {
      display: "none",
    },
    "& .stats-mobile-header": {
      display: "block",
      position: "sticky",
      top: 0,
      zIndex: 5,
      background: "#fafaf8",
    },
    "& .stats-mobile-nav": {
      display: "block",
    },
    "& .stats-main": {
      padding: "calc(90px + env(safe-area-inset-top, 0px)) 14px 125px",
      scrollMarginTop: 90,
    },
    "& .stats-topline": {
      minHeight: 32,
      marginBottom: 9,
    },
    "& .stats-topline h1": {
      fontSize: 17,
    },
    "& .trip-banner": {
      display: "grid",
      gridTemplateColumns: "85px minmax(0,1fr)",
      gap: "12px 13px",
      padding: 11,
      marginBottom: 12,
      borderRadius: 11,
    },
    "& .trip-cover": {
      width: 85,
      height: 77,
    },
    "& .trip-details strong": {
      fontSize: 16,
    },
    "& .trip-details span": {
      fontSize: 11,
      whiteSpace: "normal",
      lineHeight: 1.4,
    },
    "& .back-budget": {
      gridColumn: "1 / -1",
      width: "100%",
      minHeight: 43,
      fontSize: 13,
      padding: "9px 12px",
    },
    "& .stats-layout": {
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    "& .stats-left, & .stats-right": {
      display: "contents",
    },
    "& .total-card": {
      order: 0,
      minHeight: 0,
    },
    "& .categories-card": {
      order: 2,
    },
    "& .funds-card": {
      order: 1,
    },
    "& .members-card": {
      order: 4,
    },
    "& .daily-card": {
      marginTop: 12,
    },
    "& .stats-card": {
      width: "100%",
      borderRadius: 10,
      padding: 13,
    },
    "& .stats-card h2": {
      fontSize: 14,
      marginBottom: 12,
    },
    "& .total-card > strong": {
      marginTop: 3,
      fontSize: 30,
    },
    "& .total-card > p": {
      fontSize: 12,
    },
    "& .category-inside": {
      gap: 10,
    },
    "& .donut": {
      width: "min(70%, 200px)",
    },
    "& .donut-hole strong": {
      fontSize: 12,
    },
    "& .donut-hole span, & .donut-hole small": {
      fontSize: 9,
    },
    "& .legend-line": {
      gridTemplateColumns: "7px minmax(36px,1fr) auto 36px",
      gap: 5,
      fontSize: 10,
    },
    "& .legend-line strong, & .legend-line small": {
      fontSize: 10,
    },
    "& .card-heading": {
      marginBottom: 11,
    },
    "& .funds-numbers strong": {
      fontSize: 17,
    },
    "& .funds-numbers small": {
      fontSize: 10,
    },
    "& .member-line": {
      gridTemplateColumns: "25px 70px minmax(12px, 1fr) 75px 35px",
      gap: 4,
      fontSize: 10,
    },
    "& .member-line strong": {
      fontSize: 10,
    },
    "& .member-line small": {
      fontSize: 9,
    },
    "& .day-column": {
      minWidth: 68,
    },
    "& .day-column strong": {
      fontSize: 11,
    },
    "& .highlights": {
      display: "flex",
      flexDirection: "column",
      gap: 0,
      padding: 3,
      marginTop: 11,
    },
    "& .highlights > div": {
      padding: "11px 12px",
      borderRight: 0,
      borderBottom: "1px solid #e8eef2",
    },
    "& .highlights > div:last-child": {
      borderBottom: 0,
    },
    "& .highlights strong": {
      fontSize: 14,
    },
    "& .stats-summary-row": {
      gridTemplateColumns: "minmax(0,1fr)",
      gap: 12,
    },
  },
});
