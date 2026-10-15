import styled from "@emotion/styled";

import routyLogo from "../../assets/루티2.svg";
import routyMascot from "../../assets/ROUTY2.svg";

// ===========================
// 색상 설정
// ===========================

const coverColor = "#0A414B";
const goldColor = "#D3B16A";
const yellowColor = "#F5C71D";

// ===========================
// Emotion 스타일
// ===========================

// 여권 표지 배경
const CoverContainer = styled.span`
  display: block;
  width: 100%;
  height: 100%;

  padding: 5%;

  background-color: ${coverColor};
  border-radius: inherit;
  overflow: hidden;

  box-sizing: border-box;
`;

// 금색 테두리
const CoverBorder = styled.span`
  display: block;
  width: 100%;
  height: 100%;

  border: 2px solid ${goldColor};
  border-radius: 6px;

  box-sizing: border-box;
`;

// 내부 배치
const CoverContent = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 100%;

  padding: 10% 4% 12%;

  box-sizing: border-box;
`;

// 상단 문구
const TopText = styled.span`
  display: block;

  margin-top: 2%;

  color: ${goldColor};

  font-family: "Pretendard", "Noto Sans KR", sans-serif;

  font-size: clamp(15px, 1.4vw, 20px);
  font-weight: 700;

  line-height: 1.5;
  letter-spacing: 0.5px;

  text-align: center;
  white-space: nowrap;

  transform: rotate(-8deg);
`;

// Routy 로고
const LogoImage = styled.img`
  display: block;

  width: 78%;
  max-height: 23%;

  object-fit: contain;

  user-select: none;
  pointer-events: none;
`;

// 원형 마스코트
const MascotImage = styled.img`
  display: block;

  width: 65%;
  max-height: 48%;

  object-fit: contain;

  user-select: none;
  pointer-events: none;
`;

// 하단 영문 문구
const BottomText = styled.span`
  display: block;

  color: ${yellowColor};

  font-family: "Pretendard", "Noto Sans KR", sans-serif;

  font-size: clamp(15px, 1.1vw, 18px);
  font-weight: 500;

  line-height: 1.5;
  letter-spacing: -0.3px;

  text-align: center;
  white-space: nowrap;
`;

// ===========================
// 표지 컴포넌트
// ===========================

export default function CoverFront() {
  return (
    <CoverContainer>
      <CoverBorder>
        <CoverContent>
          {/* 상단 텍스트 */}
          <TopText>좋은 여행의 시작</TopText>

          {/* Routy 로고 SVG */}
          <LogoImage src={routyLogo} alt="Routy" draggable={false} />

          {/* 원형 마스코트 SVG */}
          <MascotImage src={routyMascot} alt="" draggable={false} />

          {/* 하단 텍스트 */}
          <BottomText>Travel stories for every traveler</BottomText>
        </CoverContent>
      </CoverBorder>
    </CoverContainer>
  );
}
