import styled from "@emotion/styled";

export const ModePicker = styled.div`
  position: absolute;
  left: 12px;
  top: 12px;
  z-index: 8;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: calc(100% - 24px);
  padding: 5px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #dce5e6;
  border-radius: 11px;
  box-shadow: 0 3px 12px rgba(3, 40, 46, .12);
`;
export const ModeButton = styled.button<{ $active: boolean }>`
  border: 0;
  padding: 7px 9px;
  border-radius: 7px;
  font: inherit;
  font-size: 15px;
  line-height: 1.3;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "white" : "#0A414B")};
  background: ${({ $active }) => ($active ? "#0A414B" : "transparent")};
  &:focus-visible { outline: 2px solid #26A89B; outline-offset: 2px; }
`;
export const DetailPanel = styled.section<{ $touch: boolean }>`
  position: absolute;
  z-index: 15;
  right: ${({ $touch }) => ($touch ? "0" : "12px")};
  left: ${({ $touch }) => ($touch ? "0" : "auto")};
  top: ${({ $touch }) => ($touch ? "auto" : "64px")};
  bottom: ${({ $touch }) => ($touch ? "0" : "auto")};
  width: ${({ $touch }) => ($touch ? "100%" : "min(330px, calc(100% - 24px))")};
  max-height: ${({ $touch }) => ($touch ? "60%" : "calc(100% - 80px)")};
  overflow-y: auto;
  color: #173D44;
  background: rgba(255,255,255,.98);
  border: 1px solid #DCE5E6;
  border-radius: ${({ $touch }) => ($touch ? "16px 16px 0 0" : "12px")};
  box-shadow: 0 -3px 24px rgba(0,0,0,.16);
  pointer-events: auto;
`;
export const DetailHeader = styled.div`
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #ecf0ef;
`;
export const TitleButton = styled.button`
  flex: 1;
  display: flex;
  text-align: left;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: transparent;
  color: inherit;
  border: 0;
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
`;
export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  background: transparent;
  border: 0;
  border-radius: 6px;
  font: inherit;
  font-size: 24px;
  cursor: pointer;
  color: #42606A;
`;
export const DetailBody = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  font-size: 15px;
  > div:not(:last-child) { display: flex; gap: 12px; justify-content: space-between; }
  > div strong { flex-shrink: 0; }
  > div span { text-align: right; overflow-wrap: anywhere; }
`;
export const Description = styled.p`
  margin: 5px 0;
  line-height: 1.5;
  font-size: 15px;
`;
export const Disclaimer = styled.small`
  font-size: 15px;
  color: #778D90;
`;
export const ExternalLink = styled.a`
  text-decoration: underline;
  color: #0B626A;
  font-weight: 600;
  font-size: 15px;
`;
