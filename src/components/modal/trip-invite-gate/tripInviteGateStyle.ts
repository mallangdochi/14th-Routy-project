import styled from "@emotion/styled";

export const Page = styled.main({
  minHeight: "100dvh",
  background: "#FEFBF5",
  display: "grid",
  placeItems: "center",
  padding: 20,
  boxSizing: "border-box",
});

export const Card = styled.section({
  width: "100%",
  maxWidth: 420,
  padding: 28,
  boxSizing: "border-box",
  background: "#FFFFFF",
  borderRadius: 22,
  color: "#0D3E41",
});

export const Title = styled.h1({
  fontSize: 24,
});

export const Description = styled.p({});

export const ErrorMessage = styled.p({
  color: "#BD3E3E",
});

export const AcceptButton = styled.button({
  width: "100%",
  border: 0,
  borderRadius: 12,
  padding: 16,
  font: "inherit",
  background: "#0D5357",
  color: "#FFFFFF",
  cursor: "pointer",

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  "&:focus-visible": {
    outline: "2px solid #527F79",
    outlineOffset: 3,
  },
});
