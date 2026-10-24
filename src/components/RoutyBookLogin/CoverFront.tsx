import styled from "@emotion/styled";

import routyLogo from "../../assets/루티2.svg";
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
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
  padding: "10% 4% 12%",
  boxSizing: "border-box",
});

// =============================
// 상단 문구 SVG
// =============================

const TopTextImage = styled.img({
  display: "block",
  width: "34%",
  maxWidth: "220px",
  height: "auto",
  marginTop: "2%",
  objectFit: "contain",
  transform: "rotate(-8deg)",
  userSelect: "none",
  pointerEvents: "none",
});

// =============================
// Routy 로고 SVG
// =============================

const LogoImage = styled.img({
  display: "block",
  width: "78%",
  maxHeight: "23%",
  objectFit: "contain",
  userSelect: "none",
  pointerEvents: "none",
});

// =============================
// 마스코트 SVG
// =============================

const MascotImage = styled.img({
  display: "block",
  width: "65%",
  maxHeight: "48%",
  objectFit: "contain",
  userSelect: "none",
  pointerEvents: "none",
});

// =============================
// 하단 영문 텍스트
// =============================

const BottomText = styled.span({
  display: "block",
  color: yellowColor,
  fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
  fontSize: "clamp(15px, 1.1vw, 18px)",
  fontWeight: 500,
  lineHeight: 1.25,
  letterSpacing: "-0.3px",
  textAlign: "center",
  whiteSpace: "normal",
  width: "100%",
  maxWidth: "100%",
  padding: "0 2px",
  boxSizing: "border-box",
  overflowWrap: "normal",
});

const BottomLine = styled.span({
  display: "block",
});

// =============================
// 표지 컴포넌트
// =============================

export default function CoverFront() {
  return (
    <CoverContainer>
      <CoverBorder>
        <CoverContent>
          {/* 상단 문구 SVG */}
          <TopTextImage
            src={topTextSvg}
            alt="좋은 여행의 시작"
            draggable={false}
          />

          {/* Routy 로고 */}
          <LogoImage src={routyLogo} alt="Routy" draggable={false} />

          {/* Routy 마스코트 */}
          <MascotImage src={routyMascot} alt="" draggable={false} />

          {/* 하단 문구 */}
          <BottomText>
            Travel stories for
            <BottomLine>every traveler</BottomLine>
          </BottomText>
        </CoverContent>
      </CoverBorder>
    </CoverContainer>
  );
}
