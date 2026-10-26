import styled from "@emotion/styled";

export const EmptySavedStyle = styled.main({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 40,

  "& .mascot-wrapper": {
    width: 250,
  },
  "& .info": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "& h2": {
      fontSize: 36,
      color: "#0D3E41",
    },
    "& .desc": { display: "flex", gap: 5, alignItems: "center" },
    "& p": {
      color: "#69769B",
      fontSize: 20,
    },
  },
  "& .move-search": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,

    padding: "10px 30px",
    borderRadius: 12,

    backgroundColor: "#0D3E41",
    color: "#fff",
    fontSize: 17,

    transition: "background-color 0.3s ease",
    "&:hover": {},
  },
  "@media (max-width:1023px)": {
    gap: 30,

    "& .mascot-wrapper": {
      width: 230,
    },
    "& .info": {
      "& h2": { fontSize: 30 },
      "& p": { fontSize: 18 },
    },
    "& .move-search": {
      fontSize: 16,
    },
  },
  "@media (max-width:767px)": {
    gap: 25,

    "& .mascot-wrapper": {
      width: 200,
    },
    "& .info": {
      "& h2": { fontSize: 24 },
      "& .desc": { display: "flex", alignItems: "center" },
    },
  },
  "@media (max-width:390px)": {
    "& .info": {
      "& .desc": {
        flexDirection: "column",
        gap: 0,
        // alignItems: "flex-start",
      },
    },
  },
});
