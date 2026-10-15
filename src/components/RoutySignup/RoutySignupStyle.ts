import styled from "@emotion/styled";

const teal = "#0A414B";
const tealLight = "#0B626A";
const paper = "#FFFEFA";
const border = "#DCE5E6";
const muted = "#778D90";
const success = "#36AA83";
const error = "#D85A5A";

// 왼쪽 회원가입 페이지 내용
export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  padding: 43px 50px 32px;

  background: ${paper};
  color: ${teal};

  overflow-y: auto;
  scrollbar-width: thin;
`;

// 오른쪽 회원가입 페이지 내용
export const RightContent = styled.form`
  width: 100%;
  height: 100%;

  padding: 52px 52px 35px;

  background: ${paper};
  color: ${teal};

  overflow-y: auto;
  scrollbar-width: thin;
`;

// 상단 로고 및 회원가입 제목
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 18px;
  margin-bottom: 30px;
  min-height: 60px;
`;

export const BrandLogo = styled.img`
  display: block;

  width: 165px;
  max-width: 50%;
  height: auto;

  object-fit: contain;

  /* 노란 SVG 로고를 청록색으로 */
  filter: brightness(0) saturate(100%);
`;

export const PageTitle = styled.h1`
  margin: 0;

  color: ${teal};

  font-size: 30px;
  font-weight: 800;
  line-height: 1.3;

  white-space: nowrap;
`;

// 입력 영역
export const Fields = styled.div`
  display: flex;
  flex-direction: column;

  gap: 22px;
  width: 100%;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;

  gap: 8px;
  min-width: 0;
`;

// 성과 이름 가로 배치
export const FieldPair = styled.div`
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);

  gap: 16px;
`;

// 입력 항목 이름
export const FieldLabel = styled.label`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  column-gap: 8px;
  row-gap: 4px;

  color: ${teal};

  font-size: 16px;
  font-weight: 800;
  line-height: 1.4;
`;

export const EnglishLabel = styled.span`
  color: ${tealLight};

  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
`;

// 기본 입력창
export const Input = styled.input`
  display: block;

  width: 100%;
  min-width: 0;
  height: 48px;

  padding: 0 14px;

  border: 1px solid ${border};
  border-radius: 7px;

  background: #ffffff;
  color: #243f44;

  font-family: inherit;
  font-size: 16px;
  font-weight: 400;

  outline: none;

  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;

  &::placeholder {
    color: #9fa9ab;
    font-size: 15px;
  }

  &:focus {
    border-color: ${tealLight};

    box-shadow: 0 0 0 3px rgba(10, 98, 106, 0.1);
  }

  &:disabled {
    background: #f4f5f4;
    color: ${muted};
    cursor: not-allowed;
  }

  &[type="date"] {
    color-scheme: light;
  }
`;

// 입력창과 오른쪽 버튼
export const InputGroup = styled.div`
  display: flex;
  align-items: stretch;

  gap: 10px;
  width: 100%;
  min-width: 0;

  input {
    flex: 1;
    min-width: 0;
  }
`;

export const SmallButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;

  min-width: 114px;
  height: 48px;

  padding: 0 12px;

  border: none;
  border-radius: 7px;

  background: ${teal};
  color: #ffffff;

  font-family: inherit;
  font-size: 15px;
  font-weight: 700;

  white-space: nowrap;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${tealLight};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// 비밀번호 입력
export const PasswordInput = styled.div`
  position: relative;
  width: 100%;

  input {
    padding-right: 52px;
  }
`;

export const EyeButton = styled.button`
  position: absolute;

  top: 50%;
  right: 10px;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 32px;

  padding: 0;

  border: none;
  background: transparent;

  color: ${muted};
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

// 인증 및 유효성 검사 메시지
export const StatusText = styled.p`
  display: flex;
  align-items: flex-start;

  gap: 8px;
  margin: 2px 0 0;

  color: ${error};

  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;

  &[data-valid="true"] {
    color: ${success};
  }

  svg {
    flex-shrink: 0;

    width: 18px;
    height: 18px;

    margin-top: 2px;
  }
`;

// 약관 동의 영역
export const TermsSection = styled.div`
  display: flex;
  flex-direction: column;

  gap: 13px;

  padding-top: 19px;
  border-top: 1px solid #e6ecea;
`;

export const CheckRow = styled.label`
  display: flex;
  align-items: flex-start;

  gap: 10px;

  color: #627779;

  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;

  cursor: pointer;

  input {
    flex-shrink: 0;

    width: 18px;
    height: 18px;

    margin: 2px 0 0;

    accent-color: ${teal};
    cursor: pointer;
  }

  &[data-all="true"] {
    color: ${teal};

    font-size: 16px;
    font-weight: 800;

    margin-bottom: 4px;
  }
`;

// 회원가입 버튼
export const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  min-height: 52px;

  padding: 10px 20px;

  border: none;
  border-radius: 7px;

  background: linear-gradient(100deg, ${teal}, #00636c);

  color: #ffffff;

  font-family: inherit;
  font-size: 17px;
  font-weight: 800;

  cursor: pointer;

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Message = styled.p`
  margin: 0;

  color: ${error};

  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
`;

// 왼쪽 페이지 하단
export const PageFooter = styled.footer`
  display: flex;
  align-items: flex-end;

  flex: 1;

  margin-top: 30px;
`;

// 로그인 화면으로 돌아가기
export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;

  gap: 8px;

  padding: 5px 0;

  border: none;
  background: transparent;

  color: ${teal};

  font-family: inherit;
  font-size: 16px;
  font-weight: 700;

  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
