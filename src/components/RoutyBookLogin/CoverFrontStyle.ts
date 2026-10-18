import styled from "@emotion/styled";

// 공통 색상
const teal = "#0A414B";
const yellow = "#F5C71D";
const paper = "#FBFAF6";
const border = "#D8DFEB";

// 여권 회전 애니메이션
const turnDuration = "1800ms";
const turnEase = "cubic-bezier(0.22, 0.62, 0.20, 1)";

// 전체 화면
export const Stage = styled.main`
  --page-width: clamp(360px, 30vw, 430px);
  --page-height: calc(var(--page-width) * 1.32);

  position: relative;

  width: 100%;
  min-width: 760px;
  min-height: max(100dvh, 740px);

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

  perspective: 1400px;
  perspective-origin: center center;

  /* 닫힌 여권 중앙 정렬 */
  transform: translate(-75%, -50%);

  transition: transform ${turnDuration} ${turnEase};

  /* 펼쳐진 여권 중앙 정렬 */
  &[data-open="true"] {
    transform: translate(-50%, -50%);
  }
`;

// 실제 회전하는 표지
export const TurningPage = styled.div`
  position: absolute;

  top: 0;
  left: 50%;

  width: 50%;
  height: 100%;

  z-index: 3;

  transform-origin: left center;

  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;

  transform: rotateY(0deg);

  transition: transform ${turnDuration} ${turnEase};

  will-change: transform;

  /* 오른쪽에서 왼쪽으로 180도 회전 */
  &[data-open="true"] {
    transform: rotateY(-180deg);
  }
`;

// 여권 앞뒷면 공통
const Face = styled.button`
  appearance: none;

  position: absolute;
  inset: 0;

  display: block;

  width: 100%;
  height: 100%;

  margin: 0;
  padding: 0;

  border: none;
  border-radius: 5px;

  background: ${teal};

  overflow: hidden;
  cursor: pointer;

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  box-shadow: 5px 7px 20px rgba(0, 0, 0, 0.2);

  /* 넘길 때 접히는 듯한 그림자 */
  &::after {
    content: "";

    position: absolute;
    inset: 0;

    pointer-events: none;

    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.22) 0%,
      transparent 28%,
      transparent 78%,
      rgba(255, 255, 255, 0.1) 100%
    );
  }

  &[data-active="false"] {
    pointer-events: none;
  }

  &:focus-visible {
    outline: 3px solid ${yellow};
    outline-offset: 3px;
  }
`;

// 닫힌 표지의 앞면
export const FrontFace = styled(Face)`
  transform: rotateY(0deg) translateZ(1px);

  border-radius: 3px 5px 5px 3px;
`;

// 표지 뒷면 - 펼쳤을 때 왼쪽 페이지
export const BackFace = styled(Face)`
  transform: rotateY(180deg) translateZ(1px);

  border-radius: 5px 3px 3px 5px;

  &::after {
    background: linear-gradient(270deg, rgba(0, 0, 0, 0.16), transparent 40%);
  }
`;

// 펼친 여권 안쪽 이미지
export const CoverImage = styled.img`
  display: block;

  width: 100%;
  height: 100%;

  object-fit: fill;

  user-select: none;
  pointer-events: none;
`;

// 오른쪽 로그인 페이지
export const LoginPanel = styled.section`
  position: absolute;

  top: 0;
  left: 50%;

  width: 50%;
  height: 100%;

  padding: 8px;

  display: flex;

  background: ${teal};

  border-radius: 0 5px 5px 0;

  box-shadow: 3px 7px 18px rgba(0, 0, 0, 0.12);

  &[data-open="false"] {
    pointer-events: none;
  }
`;

// 로그인 종이 영역
export const LoginContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  height: 100%;
  min-height: 0;

  padding: 22px 26px;

  background: ${paper};
  color: ${teal};

  border-radius: 0 4px 4px 0;
`;

// 로그인 제목
export const LoginHeading = styled.h1`
  margin: 0 0 26px;

  color: ${teal};

  font-size: 26px;
  font-weight: 800;
  line-height: 1.3;

  text-align: center;
`;

// 로그인 입력 폼
export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;

  width: 100%;
`;

// 입력창 라벨
export const InputLabel = styled.label`
  display: block;

  margin-bottom: 8px;

  color: ${teal};

  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
`;

// 입력창 외부
export const InputBox = styled.div`
  position: relative;

  width: 100%;

  margin-bottom: 20px;
`;

// 입력창 아이콘
export const InputIcon = styled.span`
  position: absolute;

  top: 50%;
  left: 12px;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  color: #8e9ead;

  pointer-events: none;

  svg {
    width: 18px;
    height: 18px;

    stroke-width: 1.8;
  }
`;

// 이메일 / 비밀번호 입력
export const TextInput = styled.input`
  display: block;

  width: 100%;
  height: 46px;

  padding: 0 42px;

  border: 1px solid ${border};
  border-radius: 5px;

  background: #ffffff;

  color: #243e46;

  font-family: inherit;
  font-size: 16px;
  font-weight: 400;

  outline: none;

  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;

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

// 비밀번호 보이기 버튼
export const PasswordToggle = styled.button`
  position: absolute;

  top: 50%;
  right: 9px;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  padding: 0;

  border: none;
  background: transparent;

  color: #8e9ead;
  cursor: pointer;

  svg {
    width: 19px;
    height: 19px;
  }

  &:hover:not(:disabled) {
    color: ${teal};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

// 로그인 상태 유지
export const RememberLabel = styled.label`
  display: flex;
  align-items: center;

  gap: 9px;

  margin-bottom: 22px;

  color: ${teal};

  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;

  cursor: pointer;

  input {
    flex-shrink: 0;

    width: 17px;
    height: 17px;

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
  height: 48px;

  padding: 0 12px;

  border: none;
  border-radius: 5px;

  background: linear-gradient(100deg, #0a414b 0%, #00646d 100%);

  color: #ffffff;

  font-family: inherit;
  font-size: 17px;
  font-weight: 700;

  cursor: pointer;

  transition:
    filter 180ms ease,
    transform 180ms ease;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

// 로그인 오류 메시지
export const Feedback = styled.p`
  margin: 12px 0 0;

  color: #bd4146;

  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
`;

// 아이디 찾기 / 비밀번호 찾기 / 회원가입
export const AccountLinks = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;

  flex-wrap: wrap;

  column-gap: 7px;
  row-gap: 8px;

  margin-top: 24px;

  color: #243b40;

  font-size: 15px;
  line-height: 1.4;

  span {
    color: #8d9b9d;
  }
`;

// 하단 일반 버튼
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

// 회원가입 버튼
export const SignUpButton = styled(TextButton)`
  color: #00646d;

  font-size: 15px;
  font-weight: 800;
`;

export const Hint = styled.p({
  position: "absolute",

  top: "50%",
  left: "calc(50% + var(--page-width) / 2 + 40px)",

  transform: "translateY(-50%)",

  margin: 0,

  color: "#0A414B",

  fontSize: "40px",
  fontWeight: 800,
  lineHeight: 1.5,

  whiteSpace: "nowrap",
  textAlign: "left",

  transition: "opacity 250ms ease",

  "&[data-open='true']": {
    opacity: 0,
    pointerEvents: "none",
  },
});
