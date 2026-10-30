import styled from "@emotion/styled";

const colors = {
  primary: "#005358",
  primaryDark: "#00474c",
  ink: "#172c3d",
  muted: "#697d8f",
  line: "#e7ebee",
  soft: "#fdfbf7",
  white: "#fff",
  star: "#ffb619",
};

const surface = {
  borderRadius: "16px",
  backgroundColor: colors.white,
  boxShadow: "0 5px 22px rgba(20, 40, 52, 0.045)",
};

const center = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const PlaceDetailPageStyle = styled.div({
  "& .photo-placeholder": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    minHeight: 558,
    height: "100%",
    background: "#ecf3f2",
    color: "#0A414B",
    borderRadius: 11,
    textAlign: "center",
    padding: 24,
    fontSize: 20,
    fontWeight: 600,
  },
  "& .photo-placeholder small": { fontSize: 15, fontWeight: 400 },
  "& .verified-detail": { marginTop: 16, fontSize: 15, color: "#697d8f" },
  "& .inline-warning": { margin: "12px 0", fontSize: 15, color: "#9c5428" },
  "& .detail-subheading": {
    fontSize: 20,
    fontWeight: 700,
    margin: "24px 0 12px",
  },
  "& .external-map-link": {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
    padding: "12px 16px",
    border: "1px solid #0A414B",
    borderRadius: 9,
    color: "#0A414B",
    fontSize: 16,
    fontWeight: 600,
    textDecoration: "none",
  },
  "& .missing-place": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
    padding: 70,
    textAlign: "center",
  },
  "& .missing-place h1": { fontSize: 24 },
  "& .missing-place p, & .missing-place a": { fontSize: 16 },

  display: "flex",
  minHeight: "100vh",
  backgroundColor: colors.soft,
  color: colors.ink,

  "& .page-sidebar": {
    display: "flex",
    flex: "0 0 auto",
    alignSelf: "stretch",
    minWidth: 0,
  },

  "& .page-mobile-header, & .page-mobile-footer": {
    display: "none",
  },

  "& .page-content": {
    flex: "1 1 0",
    minWidth: 0,
    minHeight: "100vh",
    backgroundColor: colors.soft,
  },

  "& .detail-inner": {
    width: "100%",
    maxWidth: "1510px",
    margin: "0 auto",
    padding: "24px 30px 100px",
  },

  "& .breadcrumb": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
    fontSize: "16px",
    fontWeight: 700,
    color: "#253642",
  },

  "& .breadcrumb span:last-child": {
    color: "#111e27",
  },

  "& .hero-section": {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.58fr) minmax(310px, 1fr)",
    gap: "16px",
    alignItems: "stretch",
  },

  "& .hero-image-card": {
    ...surface,
    minWidth: 0,
    minHeight: "570px",
    overflow: "hidden",
    padding: "6px",
  },

  "& .hero-image-card img": {
    display: "block",
    width: "100%",
    height: "100%",
    minHeight: "558px",
    objectFit: "cover",
    borderRadius: "11px",
  },

  "& .summary-column": {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    gap: "14px",
  },

  "& .summary-card, & .info-card": {
    ...surface,
    padding: "20px 22px",
  },

  "& .summary-card": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
  },

  "& .tag-row": {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginBottom: "16px",
  },

  "& .tag-chip": {
    ...center,
    minHeight: "35px",
    padding: "0 14px",
    border: "1px solid #dce4eb",
    borderRadius: "999px",
    backgroundColor: colors.white,
    color: "#3b4651",
    fontSize: "14px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  "& .summary-card h1": {
    color: "#131b22",
    fontSize: "30px",
    fontWeight: 800,
    lineHeight: 1.35,
    wordBreak: "keep-all",
  },

  "& .location-row": {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginTop: "13px",
    color: "#222d38",
    fontSize: "15px",
    lineHeight: 1.5,
    fontWeight: 500,
    wordBreak: "keep-all",
  },

  "& .location-row svg": {
    marginTop: "2px",
    flexShrink: 0,
  },

  "& .rating-row": {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginTop: "22px",
    color: colors.star,
  },

  "& .rating-row strong": {
    color: "#101820",
    fontSize: "26px",
    fontWeight: 800,
  },

  "& .rating-row span": {
    color: "#222c35",
    fontSize: "16px",
    fontWeight: 700,
  },

  "& .action-row": {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 54px",
    gap: "9px",
    marginTop: "auto",
    paddingTop: "23px",
  },

  "& .primary-action-button": {
    ...center,
    gap: "12px",
    minHeight: "58px",
    padding: "0 10px",
    borderRadius: "10px",
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: "17px",
    fontWeight: 700,
  },

  "& .icon-outline-button": {
    ...center,
    width: "54px",
    minHeight: "58px",
    border: "1px solid #9abfbd",
    borderRadius: "10px",
    backgroundColor: colors.white,
    color: colors.primaryDark,
  },

  "& .info-card h2": {
    paddingBottom: "9px",
    borderBottom: `1px solid ${colors.line}`,
    color: "#101820",
    fontSize: "22px",
    fontWeight: 800,
  },

  "& .info-list li": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    minHeight: "57px",
    padding: "12px 2px",
    borderBottom: `1px solid ${colors.line}`,
  },

  "& .info-list li:last-child": {
    borderBottom: 0,
    paddingBottom: 0,
  },

  "& .info-label": {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minWidth: 0,
    fontSize: "15px",
    color: "#101820",
  },

  "& .info-label svg": {
    flexShrink: 0,
    width: "27px",
    height: "27px",
    strokeWidth: 2.3,
  },

  "& .info-value": {
    flexShrink: 1,
    overflowWrap: "anywhere",
    textAlign: "right",
    fontSize: "15px",
    fontWeight: 500,
    color: "#222c35",
  },

  "& .tab-card": {
    ...surface,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "10px",
    marginTop: "15px",
    padding: "0 14px",
  },

  "& .tab-item": {
    ...center,
    position: "relative",
    gap: "10px",
    minWidth: 0,
    minHeight: "61px",
    color: "#202b32",
    fontSize: "17px",
    fontWeight: 700,
    transition: "color 0.2s ease",
  },

  "& .tab-item.is-active": {
    color: colors.primary,
  },

  "& .tab-item.is-active::after": {
    position: "absolute",
    content: '""',
    bottom: 0,
    left: 0,
    right: 0,
    height: "3px",
    borderRadius: "999px",
    backgroundColor: colors.primary,
  },

  "& .tab-content": {
    minWidth: 0,
  },

  "& .content-card": {
    ...surface,
    marginTop: "15px",
    padding: "22px 24px",
  },

  "& .section-heading": {
    paddingBottom: "12px",
    borderBottom: `1px solid ${colors.line}`,
  },

  "& .section-heading h2": {
    color: "#182631",
    fontSize: "21px",
    fontWeight: 800,
  },

  "& .section-description": {
    marginTop: "14px",
    fontSize: "16px",
    lineHeight: 1.8,
    wordBreak: "keep-all",
  },

  "& .gallery-grid": {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "16px",
  },

  "& .gallery-item": {
    minWidth: 0,
    overflow: "hidden",
    borderRadius: "10px",
  },

  "& .gallery-item img": {
    width: "100%",
    aspectRatio: "1.25 / 1",
    height: "auto",
    objectFit: "cover",
  },

  "& .filter-row": {
    display: "flex",
    flexWrap: "wrap",
    gap: "9px",
    marginBottom: "16px",
  },

  "& .filter-chip": {
    ...center,
    minHeight: "38px",
    padding: "0 19px",
    border: `1px solid ${colors.line}`,
    borderRadius: "999px",
    backgroundColor: colors.white,
    color: "#2b3742",
    fontSize: "15px",
    fontWeight: 600,
  },

  "& .filter-chip.is-active": {
    borderColor: "#2fdabe",
    backgroundColor: "#bffbf0",
    color: "#0c3537",
    fontWeight: 700,
  },

  "& .nearby-grid": {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "15px",
  },

  "& .nearby-card": {
    paddingTop: 6,
    minWidth: 0,
    overflow: "hidden",
    border: `1px solid ${colors.line}`,
    borderRadius: "13px",
    backgroundColor: colors.white,
  },

  "& .nearby-image": {
    position: "relative",
    width: "100%",
    overflow: "hidden",
  },

  "& .nearby-image img": {
    width: "100%",
    height: "175px",
    objectFit: "cover",
  },

  "& .place-category": {
    position: "absolute",
    top: "10px",
    left: "10px",
    display: "inline-flex",
    padding: "5px 13px",
    borderRadius: "999px",
    backgroundColor: colors.white,
    color: "#293945",
    fontSize: "13px",
    fontWeight: 700,
  },

  "& .nearby-body": {
    padding: "12px 13px 13px",
  },

  "& .nearby-body h3": {
    fontSize: "18px",
    fontWeight: 800,
    color: "#14212b",
  },

  "& .nearby-body p": {
    marginTop: "4px",
    minHeight: "46px",
    color: "#35444e",
    fontSize: "14px",
    lineHeight: 1.6,
    wordBreak: "keep-all",
  },

  "& .nearby-category-inline": {
    display: "none",
  },

  "& .nearby-meta": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    marginTop: "8px",
  },

  "& .nearby-rating": {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap",
    fontSize: "13px",
  },

  "& .nearby-rating svg": {
    color: colors.star,
    flexShrink: 0,
  },

  "& .nearby-rating strong": {
    color: "#121b23",
    fontSize: "16px",
    fontWeight: 800,
  },

  "& .nearby-rating span": {
    color: "#35444e",
    fontWeight: 600,
  },

  "& .nearby-details-button": {
    ...center,
    gap: "5px",
    padding: "6px 8px",
    border: `1px solid ${colors.primary}`,
    borderRadius: "7px",
    color: colors.primary,
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  "& .review-toolbar": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "16px",
  },

  "& .review-score": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    whiteSpace: "nowrap",
    color: colors.star,
  },

  "& .review-score strong": {
    color: "#111b23",
    fontSize: "29px",
    fontWeight: 800,
  },

  "& .review-score span": {
    color: "#253642",
    fontSize: "16px",
    fontWeight: 700,
  },

  "& .review-actions": {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "9px",
  },

  "& .review-filter-button, & .review-sort, & .write-review-button": {
    ...center,
    minHeight: "41px",
    gap: "8px",
    padding: "0 13px",
    border: `1px solid ${colors.line}`,
    borderRadius: "10px",
    color: "#22313e",
    fontSize: "14px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  "& .review-filter-button.is-active": {
    borderColor: colors.primary,
    color: colors.primary,
    backgroundColor: "#edfaf7",
  },

  "& .review-sort": {
    position: "relative",
    padding: "0 10px 0 14px",
  },

  "& .review-sort select": {
    appearance: "none",
    backgroundColor: "transparent",
    outlineOffset: "4px",
    paddingRight: "7px",
    border: 0,
    cursor: "pointer",
  },

  "& .review-sort svg": {
    pointerEvents: "none",
  },

  "& .write-review-button": {
    minWidth: "133px",
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    color: colors.white,
  },

  "& .review-grid": {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
  },

  "& .review-card": {
    minWidth: 0,
    padding: "16px",
    border: `1px solid ${colors.line}`,
    borderRadius: "12px",
    backgroundColor: colors.white,
  },

  "& .review-user-row": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  "& .review-avatar": {
    ...center,
    width: "41px",
    height: "41px",
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: "#bce9dc",
    color: colors.primary,
    fontSize: "17px",
    fontWeight: 800,
  },

  "& .review-identity": {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
  },

  "& .review-identity strong": {
    fontSize: "15px",
    fontWeight: 800,
    color: "#17242e",
  },

  "& .review-stars": {
    display: "flex",
    gap: "1px",
    color: colors.star,
  },

  "& .review-user-row time": {
    marginLeft: "auto",
    flexShrink: 0,
    fontSize: "12px",
    color: "#79869c",
  },

  "& .review-text": {
    marginTop: "12px",
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#263640",
    wordBreak: "keep-all",
  },

  "& .review-photos": {
    marginTop: "11px",
    width: "100%",
    overflow: "hidden",
    borderRadius: "9px",
  },

  "& .review-photos img": {
    width: "100%",
    height: "145px",
    objectFit: "cover",
  },

  "& button:focus-visible, & select:focus-visible": {
    outline: `2px solid ${colors.primary}`,
    outlineOffset: "3px",
  },

  "@media (max-width: 1200px)": {
    "& .detail-inner": {
      padding: "20px 20px 90px",
    },
    "& .hero-section": {
      gridTemplateColumns: "minmax(0, 1.3fr) minmax(260px, 1fr)",
      gap: "12px",
    },
    "& .hero-image-card": {
      minHeight: "475px",
    },
    "& .hero-image-card img": {
      minHeight: "463px",
    },
    "& .summary-card, & .info-card": {
      padding: "16px",
    },
    "& .summary-card h1": {
      fontSize: "25px",
    },
    "& .tag-chip": {
      fontSize: "13px",
      padding: "0 11px",
      minHeight: "32px",
    },
    "& .info-card h2": {
      fontSize: "19px",
    },
    "& .info-label": {
      gap: "8px",
      fontSize: "13px",
    },
    "& .info-label svg": {
      width: "22px",
      height: "22px",
    },
    "& .info-value": {
      fontSize: "13px",
    },
    "& .action-row": {
      gridTemplateColumns: "minmax(0, 1fr) 45px",
    },
    "& .primary-action-button, & .icon-outline-button": {
      minHeight: "49px",
    },
    "& .icon-outline-button": {
      width: "45px",
    },
    "& .primary-action-button": {
      fontSize: "14px",
    },
    "& .nearby-grid": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    "& .nearby-image img": {
      height: "145px",
    },
  },

  "@media (min-width: 721px) and (max-width: 990px)": {
    "& .detail-inner": {
      padding: "20px 14px 80px",
    },
    "& .breadcrumb": {
      fontSize: "14px",
    },
    "& .hero-section": {
      gridTemplateColumns: "minmax(0, 1fr) minmax(225px, 0.9fr)",
      gap: "10px",
    },
    "& .hero-image-card": {
      minHeight: "410px",
      padding: "4px",
    },
    "& .hero-image-card img": {
      minHeight: "402px",
      borderRadius: "10px",
    },
    "& .summary-column": {
      gap: "9px",
    },
    "& .summary-card, & .info-card": {
      padding: "12px",
    },
    "& .tag-row": {
      gap: "4px",
      marginBottom: "10px",
    },
    "& .tag-chip": {
      fontSize: "11px",
      padding: "0 8px",
      minHeight: "26px",
    },
    "& .summary-card h1": {
      fontSize: "21px",
    },
    "& .location-row": {
      fontSize: "12px",
      marginTop: "8px",
    },
    "& .rating-row": {
      marginTop: "9px",
      gap: "6px",
    },
    "& .rating-row strong": {
      fontSize: "21px",
    },
    "& .rating-row span": {
      fontSize: "13px",
    },
    "& .action-row": {
      paddingTop: "10px",
    },
    "& .info-list li": {
      minHeight: "42px",
      padding: "8px 0",
    },
    "& .info-card h2": {
      fontSize: "18px",
    },
    "& .info-label": {
      fontSize: "12px",
    },
    "& .info-value": {
      fontSize: "12px",
    },
    "& .tab-item": {
      minHeight: "53px",
      fontSize: "14px",
    },
    "& .nearby-grid": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    "& .review-grid": {
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },

  "@media (max-width: 720px)": {
    display: "block",
    "& .page-sidebar": {
      display: "none",
    },
    "& .page-mobile-header": {
      display: "block",
    },
    "& .page-mobile-footer": {
      display: "block",
    },
    "& .detail-inner": {
      padding: "72px 16px 135px",
    },
    "& .breadcrumb": {
      gap: "6px",
      marginBottom: "12px",
      fontSize: "13px",
    },
    "& .hero-section": {
      gridTemplateColumns: "minmax(0, 1fr)",
      gap: "8px",
    },
    "& .hero-image-card": {
      minHeight: 0,
      padding: 0,
      borderRadius: "9px",
    },
    "& .hero-image-card img": {
      height: "auto",
      minHeight: 0,
      aspectRatio: "2.5 / 1",
      objectFit: "cover",
      borderRadius: "9px",
    },
    "& .summary-column": {
      gap: "9px",
    },
    "& .summary-card, & .info-card": {
      padding: "13px 12px",
      borderRadius: "12px",
    },
    "& .summary-card": {
      gap: 0,
    },
    "& .tag-row": {
      marginBottom: "8px",
      gap: "5px",
    },
    "& .tag-chip": {
      minHeight: "25px",
      padding: "0 9px",
      fontSize: "11px",
    },
    "& .summary-card h1": {
      fontSize: "23px",
    },
    "& .location-row": {
      marginTop: "5px",
      fontSize: "12px",
    },
    "& .location-row svg": {
      width: "13px",
      height: "13px",
      marginTop: "2px",
    },
    "& .rating-row": {
      marginTop: "10px",
      gap: "6px",
    },
    "& .rating-row svg": {
      width: "22px",
      height: "22px",
    },
    "& .rating-row strong": {
      fontSize: "21px",
    },
    "& .rating-row span": {
      fontSize: "13px",
    },
    "& .action-row": {
      gridTemplateColumns: "minmax(0, 1fr) 44px",
      gap: "6px",
      marginTop: "12px",
      paddingTop: 0,
    },
    "& .primary-action-button, & .icon-outline-button": {
      minHeight: "39px",
      borderRadius: "7px",
    },
    "& .primary-action-button": {
      fontSize: "13px",
      gap: "8px",
    },
    "& .primary-action-button svg": {
      width: "19px",
      height: "19px",
    },
    "& .icon-outline-button": {
      width: "44px",
    },
    "& .icon-outline-button svg": {
      width: "19px",
      height: "19px",
    },
    "& .info-card h2": {
      paddingBottom: "7px",
      fontSize: "17px",
    },
    "& .info-list li": {
      minHeight: "34px",
      padding: "7px 0",
    },
    "& .info-label": {
      gap: "9px",
      fontSize: "12px",
    },
    "& .info-label svg": {
      width: "18px",
      height: "18px",
    },
    "& .info-value": {
      fontSize: "12px",
    },
    "& .tab-card": {
      gap: "2px",
      marginTop: "9px",
      padding: "0 6px",
      borderRadius: "10px",
    },
    "& .tab-item": {
      minHeight: "43px",
      gap: "6px",
      fontSize: "12px",
    },
    "& .tab-item svg": {
      width: "18px",
      height: "18px",
    },
    "& .content-card": {
      marginTop: "9px",
      padding: "13px 12px",
      borderRadius: "11px",
    },
    "& .section-heading h2": {
      fontSize: "16px",
    },
    "& .section-description": {
      fontSize: "13px",
      lineHeight: 1.7,
    },
    "& .gallery-grid": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "7px",
      marginTop: "12px",
    },
    "& .filter-row": {
      gap: "5px",
      marginBottom: "9px",
    },
    "& .filter-chip": {
      minHeight: "28px",
      padding: "0 11px",
      fontSize: "11px",
    },
    "& .nearby-grid": {
      gridTemplateColumns: "minmax(0, 1fr)",
      gap: "8px",
    },
    "& .nearby-card": {
      display: "flex",
      alignItems: "stretch",
      minHeight: "101px",
      borderRadius: "10px",
    },
    "& .nearby-image": {
      display: "none",
    },
    "& .nearby-body": {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      padding: "10px 11px",
    },
    "& .nearby-name-row": {
      display: "flex",
      alignItems: "center",
      gap: "9px",
    },
    "& .nearby-body h3": {
      fontSize: "15px",
    },
    "& .nearby-category-inline": {
      display: "inline-flex",
      padding: "3px 8px",
      backgroundColor: "#e2f2f8",
      borderRadius: "999px",
      fontSize: "11px",
      color: "#314563",
      fontWeight: 700,
    },
    "& .nearby-body p": {
      flex: 1,
      marginTop: "5px",
      minHeight: 0,
      fontSize: "12px",
      lineHeight: 1.4,
    },
    "& .nearby-meta": {
      marginTop: "4px",
    },
    "& .nearby-rating strong": {
      fontSize: "13px",
    },
    "& .nearby-rating svg": {
      width: "15px",
      height: "15px",
    },
    "& .nearby-rating span": {
      fontSize: "11px",
    },
    "& .nearby-details-button": {
      padding: "4px 7px",
      fontSize: "11px",
    },
    "& .nearby-details-button svg": {
      width: "14px",
      height: "14px",
    },
    "& .review-toolbar": {
      gap: "7px",
    },
    "& .review-score": {
      width: "100%",
      justifyContent: "center",
    },
    "& .review-score svg": {
      width: "24px",
      height: "24px",
    },
    "& .review-score strong": {
      fontSize: "23px",
    },
    "& .review-score span": {
      fontSize: "13px",
    },
    "& .review-actions": {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      width: "100%",
      gap: "6px",
    },
    "& .review-filter-button, & .review-sort, & .write-review-button": {
      minHeight: "33px",
      padding: "0 8px",
      gap: "5px",
      fontSize: "11px",
      borderRadius: "7px",
    },
    "& .write-review-button": {
      gridColumn: "1 / -1",
      width: "100%",
    },
    "& .review-grid": {
      gridTemplateColumns: "minmax(0, 1fr)",
      gap: "7px",
    },
    "& .review-card": {
      padding: "9px",
    },
    "& .review-avatar": {
      width: "31px",
      height: "31px",
      fontSize: "13px",
    },
    "& .review-user-row": {
      gap: "6px",
    },
    "& .review-identity strong": {
      fontSize: "12px",
    },
    "& .review-stars svg": {
      width: "12px",
      height: "12px",
    },
    "& .review-user-row time": {
      fontSize: "10px",
    },
    "& .review-text": {
      marginTop: "7px",
      fontSize: "12px",
      lineHeight: 1.5,
    },
    "& .review-photos": {
      marginTop: "7px",
    },
    "& .review-photos img": {
      height: "95px",
    },
  },
});
