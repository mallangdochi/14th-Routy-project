import styled from "@emotion/styled";

export const Panel = styled.section`
  background: #fffefa;
  border: 1px solid #dce5e6;
  border-radius: 14px;
  padding: 20px;
  margin: 20px 0;
  color: #0a414b;
  font-size: 15px;
`;
export const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
  strong {
    font-size: 19px;
  }
  span {
    color: #778d90;
    font-size: 15px;
  }
`;
export const Modes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;
export const ModeButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  justify-content: center;
  padding: 9px 13px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ $active }) => ($active ? "#0a414b" : "#dce5e6")};
  background: ${({ $active }) => ($active ? "#0a414b" : "white")};
  color: ${({ $active }) => ($active ? "#fff" : "#0a414b")};
  border-radius: 9px;
  &:focus-visible {
    outline: 3px solid #83bbc1;
    outline-offset: 2px;
  }
`;
export const Total = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  background: #eef7f5;
  font-size: 16px;
  font-weight: 700;
  small {
    font-size: 15px;
    font-weight: 400;
    color: #536e72;
  }
`;
export const Legs = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 12px;
`;
export const Leg = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 11px 8px;
  border-bottom: 1px solid #e9eeef;
  @media (max-width: 620px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
export const LegName = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
  strong {
    font-size: 15px;
    overflow-wrap: anywhere;
  }
  span {
    color: #778d90;
    font-size: 15px;
  }
`;
export const Metric = styled.span`
  color: #0a414b;
  font-weight: 700;
  font-size: 15px;
  a {
    color: #0b626a;
    margin-left: 10px;
    font-size: 15px;
  }
`;
export const Notice = styled.p`
  color: #778d90;
  font-size: 15px;
  line-height: 1.5;
  margin: 10px 0 0;
`;
