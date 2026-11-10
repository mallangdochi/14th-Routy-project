import styled from "@emotion/styled";

/** Keeps a reserved map viewport above the details rather than covering the route. */
export const MapDock = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  background: #f9fcfa;
`;
export const MapViewport = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 165px;
  min-width: 0;
  overflow: hidden;
`;
export const HoverHint = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 18;
  width: max-content;
  max-width: min(255px, calc(100% - 24px));
  padding: 9px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border: 1px solid #dce5e6;
  border-radius: 10px;
  background: rgba(255, 254, 250, .98);
  box-shadow: 0 3px 14px rgba(3, 40, 46, .15);
  pointer-events: none;
  color: #0a414b;
  font-size: 15px;
  line-height: 1.4;
  strong { font-weight: 700; }
  span { color: #44636b; }
`;
export const ModePicker = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 8;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: calc(100% - 24px);
  padding: 5px;
  background: rgba(255, 255, 255, .96);
  border: 1px solid #dce5e6;
  border-radius: 11px;
  box-shadow: 0 3px 12px rgba(3, 40, 46, .12);
  @media (max-width: 1100px) {
    top: auto;
    bottom: 62px;
    right: 8px;
    left: 8px;
    justify-content: center;
  }
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
export const DetailPanel = styled.section<{ $touch: boolean; $expanded: boolean }>`
  position: relative;
  z-index: 3;
  flex: 0 0 auto;
  width: 100%;
  max-height: ${({ $touch, $expanded }) => $touch ? ($expanded ? "46%" : "132px") : "46%"};
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  color: #173d44;
  background: #fffefa;
  border-top: 1px solid #dce5e6;
  box-shadow: 0 -2px 8px rgba(0,0,0,.06);
  pointer-events: auto;
  @media (max-width: 767px) {
    max-height: ${({ $expanded }) => $expanded ? "48%" : "132px"};
  }
`;
export const DrawerHandle = styled.div`
  width: 38px;
  height: 5px;
  margin: 8px auto 0;
  border-radius: 99px;
  background: #bfcecc;
`;
export const DetailHeader = styled.div`
  padding: 11px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;
export const TitleButton = styled.button`
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0,1fr) auto;
  gap: 3px 10px;
  text-align: left;
  align-items: center;
  background: transparent;
  color: inherit;
  border: 0;
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  strong {
    grid-column: 1;
    overflow-wrap: anywhere;
    line-height: 1.45;
  }
  span:not(:last-child) {
    grid-column: 1;
    color: #44636b;
    font-weight: 500;
    font-size: 15px;
  }
  &:focus-visible { outline: 2px solid #26a89b; outline-offset: 2px; }
`;
export const ExpandIndicator = styled.span`
  grid-row: 1 / 3;
  grid-column: 2;
  color: #44636b;
  font-size: 22px;
`;
export const CloseButton = styled.button`
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  background: transparent;
  border: 0;
  border-radius: 7px;
  font: inherit;
  font-size: 24px;
  cursor: pointer;
  color: #42606a;
  &:focus-visible { outline: 2px solid #26a89b; outline-offset: 2px; }
`;
export const DetailBody = styled.div`
  padding: 0 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 15px;
  line-height: 1.5;
  > div:not(:last-child) { display: flex; gap: 12px; justify-content: space-between; }
  > div strong { flex-shrink: 0; }
  > div span { text-align: right; overflow-wrap: anywhere; }
`;
export const Description = styled.p`
  margin: 4px 0;
  line-height: 1.5;
  font-size: 15px;
`;
export const Disclaimer = styled.small`
  font-size: 15px;
  color: #778d90;
`;
export const ExternalLink = styled.a`
  text-decoration: underline;
  color: #0b626a;
  font-weight: 600;
  font-size: 15px;
`;
