import styled from "@emotion/styled";

import routyMascot from "../../assets/ROUTY2.svg";
import topTextSvg from "../../assets/routy-top-text.svg";

// =============================
// 색상 설정
// =============================

const coverColor = "#0A414B";
const goldColor = "#D3B16A";
const yellowColor = "#F5C71D";

// =============================
// 여권 표지 배경
// =============================

const CoverContainer = styled.span({
  display: "block",
  width: "100%",
  height: "100%",
  padding: "5%",
  backgroundColor: coverColor,
  borderRadius: "inherit",
  overflow: "hidden",
  boxSizing: "border-box",
});

// =============================
// 금색 테두리
// =============================

const CoverBorder = styled.span({
  display: "block",
  width: "100%",
  height: "100%",
  border: `2px solid ${goldColor}`,
  borderRadius: "6px",
  boxSizing: "border-box",
});

// =============================
// 표지 내부 레이아웃
// =============================

const CoverContent = styled.span({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-around",

  width: "100%",
  height: "100%",

  padding: "10% 4% 12%",
  boxSizing: "border-box",
});

// =============================
// 상단 SVG
// 노란색 표시: 크게 변경
// =============================

const TopTextImage = styled.img({
  display: "block",

  width: "78%",
  maxWidth: "520px",
  maxHeight: "34%",
  height: "auto",

  objectFit: "contain",

  userSelect: "none",
  pointerEvents: "none",
});

// =============================
// 중앙 마스코트 SVG
// 파란색 표시: 살짝 축소
// =============================

const MascotImage = styled.img({
  display: "block",

  width: "58%",
  maxHeight: "43%",
  height: "auto",

  objectFit: "contain",

  userSelect: "none",
  pointerEvents: "none",
});

// =============================
// 하단 영문 문구
// 노란색 표시: 크게 변경
// =============================

const BottomText = styled.span({
  display: "block",

  color: yellowColor,

  fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',

  fontSize: "clamp(16px, 2.1vw, 25px)",
  fontWeight: 600,
  lineHeight: 1.5,
  letterSpacing: "-0.3px",

  textAlign: "center",
  whiteSpace: "nowrap",
});

// =============================
// 여권 표지 컴포넌트
// =============================

export default function CoverFront() {
  return (
    <CoverContainer>
      <CoverBorder>
        <CoverContent>
          {/* 상단 SVG */}
          <TopTextImage
            src={topTextSvg}
            alt="좋은 여행의 시작 Routy"
            draggable={false}
          />

          {/* 중앙 마스코트 */}
          <MascotImage src={routyMascot} alt="" draggable={false} />

          {/* 하단 영문 문구 */}
          <BottomText>Travel stories for every traveler</BottomText>
        </CoverContent>
      </CoverBorder>
    </CoverContainer>
  );
}
