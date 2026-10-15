import styled from "@emotion/styled";

const teal = "#0A414B";
const yellow = "#F5C71D";
const paper = "#FBFAF6";
const border = "#D8DFEB";

const coverDuration = "1800ms";
const pageDuration = "1450ms";

const easing = "cubic-bezier(0.22, 0.62, 0.20, 1)";

// 전체 화면
export const Stage = styled.main`
  --page-width: 700px;
  --page-height: 870px;

  position: relative;

  width: 100%;
  min-width: 1440px;
  min-height: max(100dvh, 1040px);

  display: flex;
  justify-content: center;
  align-items: center;

  background: ${paper};
  color: ${teal};

  font-family: "Pretendard", "Noto Sans KR", sans-serif;

  font-size: 16px;

  &,
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

// 여권 전체
export const Book = styled.div`
  position: absolute;

  top: 50%;
  left: 50%;

  width: calc(var(--page-width) * 2);
  height: var(--page-height);

  perspective: 1800px;
  perspective-origin: center center;

  transform: translate(-75%, -50%);

  transition: transform ${coverDuration} ${easing};

  &[data-open="true"] {
    transform: translate(-50%, -50%);
  }
`;

// ====================================
// 처음 열리는 여권 표지
// ====================================

export const CoverLeaf = styled.div`
  position: absolute;

  top: 0;
  left: 50%;

  width: 50%;
  height: 100%;

  z-index: 6;

  transform-origin: left center;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;

  transform: rotateY(0deg);

  transition: transform ${coverDuration} ${easing};

  will-change: transform;

  &[data-open="true"] {
    transform: rotateY(-180deg);
  }

  /* 다 펼쳐진 표지는
     로그인/회원가입 종이 뒤로 배치 */
  &[data-settled="true"] {
    z-index: 2;
  }
`;

// 표지 앞면
export const CoverFrontFace = styled.button`
  appearance: none;

  position: absolute;
  inset: 0;

  display: block;

  width: 100%;
  height: 100%;

  padding: 0;
  margin: 0;

  border: none;
  border-radius: 6px;

  background: ${teal};

  overflow: hidden;
  cursor: pointer;

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  transform: rotateY(0deg) translateZ(1px);

  box-shadow: 5px 8px 24px rgba(0, 0, 0, 0.18);

  &:disabled {
    pointer-events: none;
  }

  &:focus-visible {
    outline: 3px solid ${yellow};
  }
`;

// 펼친 표지의 안쪽
export const CoverInsideFace = styled.button`
  appearance: none;

  position: absolute;
  inset: 0;

  display: block;

  width: 100%;
  height: 100%;

  padding: 0;
  margin: 0;

  border: none;
  border-radius: 6px;

  background: ${teal};

  overflow: hidden;
  cursor: pointer;

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  transform: rotateY(180deg) translateZ(1px);

  box-shadow: 4px 7px 22px rgba(0, 0, 0, 0.16);

  &:disabled {
    pointer-events: none;
  }
`;

export const CoverImage = styled.img`
  display: block;

  width: 100%;
  height: 100%;

  object-fit: fill;

  user-select: none;
  pointer-events: none;
`;

// ====================================
// 로그인 ↔ 회원가입
// 실제로 회전하는 종이
// ====================================

export const TurningLeaf = styled.div`
  position: absolute;

  top: 0;
  left: 50%;

  width: 50%;
  height: 100%;

  z-index: 4;

  transform-origin: left center;

  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;

  transform: rotateY(0deg);

  transition: transform ${pageDuration} ${easing};

  will-change: transform;

  /* 회원가입 시 왼쪽으로 180도 회전 */
  &[data-signup="true"] {
    transform: rotateY(-180deg);
  }
`;

// ====================================
// 회전하는 종이 앞면: 로그인
// ====================================

export const LoginFace = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  height: 100%;

  padding: 45px 55px;

  border: 9px solid ${teal};
  border-radius: 0 7px 7px 0;

  background: ${paper};
  color: ${teal};

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  transform: rotateY(0deg) translateZ(1px);

  box-shadow: 5px 7px 24px rgba(0, 0, 0, 0.13);

  overflow-y: auto;
  scrollbar-width: thin;
`;

// ====================================
// 회전하는 종이 뒷면:
// 실제 회원가입 왼쪽 입력 화면
// ====================================

export const SignupLeftFace = styled.div`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  border: 9px solid ${teal};
  border-right: none;
  border-radius: 7px 0 0 7px;

  background: ${paper};

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  transform: rotateY(180deg) translateZ(1px);

  box-shadow:
    inset -9px 0 16px -13px rgba(0, 0, 0, 0.3),
    -4px 8px 22px rgba(0, 0, 0, 0.12);

  overflow: hidden;
`;

// ====================================
// 로그인 페이지 아래에 있는
// 실제 회원가입 오른쪽 화면
// ====================================

export const SignupRightPage = styled.div`
  position: absolute;

  top: 0;
  left: 50%;

  width: 50%;
  height: 100%;

  z-index: 1;

  border: 9px solid ${teal};
  border-radius: 0 7px 7px 0;

  background: ${paper};

  overflow: hidden;

  box-shadow: 4px 8px 22px rgba(0, 0, 0, 0.1);
`;

// ====================================
// 로그인 화면 스타일
// ====================================

export const LoginHeading = styled.h1`
  margin: 0 0 36px;

  color: ${teal};

  font-size: 30px;
  font-weight: 800;
  line-height: 1.3;

  text-align: center;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;

  width: 100%;
`;

export const InputLabel = styled.label`
  display: block;

  margin-bottom: 10px;

  color: ${teal};

  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
`;

export const InputBox = styled.div`
  position: relative;

  width: 100%;
  margin-bottom: 26px;
`;

export const InputIcon = styled.span`
  position: absolute;

  top: 50%;
  left: 15px;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  color: #8e9ead;
  pointer-events: none;

  svg {
    width: 20px;
    height: 20px;
  }
`;

// 이메일 및 비밀번호 입력
export const TextInput = styled.input`
  display: block;

  width: 100%;
  height: 52px;

  padding: 0 46px;

  border: 1px solid ${border};
  border-radius: 6px;

  background: #ffffff;
  color: #243e46;

  font-family: inherit;
  font-size: 16px;

  outline: none;

  &::placeholder {
    color: #9ca9b8;
    font-size: 15px;
  }

  &:focus {
    border-color: ${teal};

    box-shadow: 0 0 0 3px rgba(10, 65, 75, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;

  top: 50%;
  right: 12px;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 32px;

  padding: 0;

  border: none;
  background: transparent;

  color: #8e9ead;
  cursor: pointer;

  svg {
    width: 21px;
    height: 21px;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const RememberLabel = styled.label`
  display: flex;
  align-items: center;

  gap: 10px;
  margin-bottom: 28px;

  color: ${teal};

  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;

  cursor: pointer;

  input {
    width: 18px;
    height: 18px;

    margin: 0;

    accent-color: ${teal};
    cursor: pointer;
  }
`;

// 로그인 버튼
export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 54px;

  border: none;
  border-radius: 6px;

  background: linear-gradient(100deg, #0a414b, #00646d);

  color: #ffffff;

  font-family: inherit;
  font-size: 18px;
  font-weight: 700;

  cursor: pointer;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

// 로그인 오류
export const Feedback = styled.p`
  margin: 14px 0 0;

  color: #bd4146;

  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
`;

// 하단 링크
export const AccountLinks = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  column-gap: 10px;
  row-gap: 10px;

  margin-top: 32px;

  font-size: 15px;
  line-height: 1.4;

  span {
    color: #8d9b9d;
  }
`;

export const TextButton = styled.button`
  padding: 0;

  border: none;
  background: transparent;

  color: #243b40;

  font-family: inherit;
  font-size: 15px;
  font-weight: 500;

  white-space: nowrap;
  cursor: pointer;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const SignUpButton = styled(TextButton)`
  display: inline-flex;
  align-items: center;

  gap: 5px;

  color: #00646d;
  font-weight: 800;

  svg {
    width: 17px;
    height: 17px;
  }
`;

// 닫힌 여권 안내 문구
export const Hint = styled.p`
  position: absolute;

  top: calc(50% + var(--page-height) / 2 + 22px);

  left: 50%;

  transform: translateX(-50%);

  margin: 0;

  color: ${teal};

  font-size: 17px;
  font-weight: 800;
  line-height: 1.5;

  text-align: center;
  white-space: nowrap;

  transition: opacity 250ms ease;

  &[data-open="true"] {
    opacity: 0;
    pointer-events: none;
  }
`;
