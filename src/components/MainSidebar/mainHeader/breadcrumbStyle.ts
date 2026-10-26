import styled from "@emotion/styled";

const breadcrumbColor = "#0D3E41";

export const BreadcrumbStyle = styled.nav({
  minWidth: 0,
  fontSize: "16px",

  "&&, && li, && a, && span, && svg": {
    color: breadcrumbColor,
  },

  "& ol": {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
  },

  "& li": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: 0,
  },

  "&& .breadcrumb-item": {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    minWidth: 0,
    minHeight: "32px",
    borderRadius: "4px",
  },

  "&& svg": {
    flexShrink: 0,
  },

  "&& a:link, && a:visited, && a:hover, && a:focus, && a:active": {
    color: breadcrumbColor,
    textDecoration: "none",
  },

  "&& .breadcrumb-label": {
    display: "inline-block",
    fontWeight: 500,
    textDecoration: "none",
  },

  "&& .breadcrumb-item:hover > .breadcrumb-label, && .breadcrumb-item:focus-visible > .breadcrumb-label":
    {
      fontWeight: 700,
      textDecoration: "underline",
      textUnderlineOffset: "6px",
      textDecorationThickness: "1px",
    },

  "&& a.breadcrumb-item:focus-visible": {
    outline: `2px solid ${breadcrumbColor}`,
    outlineOffset: "4px",
  },

  "& [aria-current='page']": {
    fontWeight: 600,
    overflowWrap: "anywhere",
  },

  "@media (max-width: 1023px)": {
    fontSize: "15px",
  },

  "@media (max-width: 767px)": {
    fontSize: "14px",
  },
});
