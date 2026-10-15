import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type TransitionEvent,
} from "react";

import { useLocation, useNavigate } from "react-router";

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import CoverFront from "./CoverFront";
import coverInside from "../../assets/routy-cover-inside.png";

import RoutySignup, {
  RoutySignupProvider,
  type SignupApiProps,
} from "../RoutySignup/RoutySignup";

import {
  Stage,
  Book,
  CoverLeaf,
  CoverFrontFace,
  CoverInsideFace,
  CoverImage,
  TurningLeaf,
  LoginFace,
  SignupLeftFace,
  SignupRightPage,
  LoginHeading,
  LoginForm,
  InputLabel,
  InputBox,
  InputIcon,
  TextInput,
  PasswordToggle,
  RememberLabel,
  SubmitButton,
  AccountLinks,
  TextButton,
  SignUpButton,
  Feedback,
  Hint,
} from "./RoutyBookLoginStyle";

interface RoutyBookLoginProps extends SignupApiProps {
  onLogin?: (
    email: string,
    password: string,
    remember: boolean,
  ) => void | Promise<void>;

  onFindId?: () => void;
  onFindPassword?: () => void;
}

export default function RoutyBookLogin({
  onLogin,
  onFindId,
  onFindPassword,
  onCheckUsername,
  onSendVerification,
  onConfirmVerification,
  onSignup,
}: RoutyBookLoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const fieldId = useId();

  const initialSignup = location.pathname === "/signup";

  // 여권 펼침 상태
  const [isOpen, setIsOpen] = useState(initialSignup);

  // 앞표지 애니메이션 완료
  const [coverSettled, setCoverSettled] = useState(initialSignup);

  // 회원가입 페이지 표시 상태
  const [isSignup, setIsSignup] = useState(initialSignup);

  // 책장을 넘기는 중인지
  const [isTurning, setIsTurning] = useState(false);

  const turnTarget = useRef<"/login" | "/signup" | null>(null);

  const internalNavigation = useRef<string | null>(null);

  const firstRouteEffect = useRef(true);

  // 로그인 입력값
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false);

  const [loginError, setLoginError] = useState("");

  // ====================================
  // URL 상태 동기화
  // ====================================

  useEffect(() => {
    if (firstRouteEffect.current) {
      firstRouteEffect.current = false;
      return;
    }

    // 자체 책장 애니메이션으로 이동한 경우
    if (internalNavigation.current === location.pathname) {
      internalNavigation.current = null;
      return;
    }

    // 브라우저 뒤로가기 등 외부 주소 변경
    const nextSignup = location.pathname === "/signup";

    setIsOpen(true);
    setCoverSettled(true);
    setIsSignup(nextSignup);
    setIsTurning(false);
    turnTarget.current = null;
  }, [location.pathname]);

  // ====================================
  // 여권 앞표지 열기 / 닫기
  // ====================================

  const handleOpen = () => {
    if (isTurning) return;

    setCoverSettled(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isTurning || isSignup) return;

    setCoverSettled(false);
    setIsOpen(false);
  };

  const handleCoverTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "transform"
    ) {
      return;
    }

    setCoverSettled(isOpen);
  };

  // 애니메이션 종료 이벤트 누락 대비
  useEffect(() => {
    if (!isOpen || coverSettled) return;

    const timer = window.setTimeout(() => {
      setCoverSettled(true);
    }, 1950);

    return () => window.clearTimeout(timer);
  }, [isOpen, coverSettled]);

  // ====================================
  // 회원가입 ↔ 로그인 페이지 넘김
  // ====================================

  const turnPage = (toSignup: boolean) => {
    if (!isOpen || !coverSettled) return;
    if (isTurning) return;
    if (isSignup === toSignup) return;

    turnTarget.current = toSignup ? "/signup" : "/login";

    setIsTurning(true);
    setIsSignup(toSignup);
  };

  const finishTurn = useCallback(() => {
    const target = turnTarget.current;

    if (!target) return;

    // 같은 애니메이션에서 중복 이동 방지
    turnTarget.current = null;

    internalNavigation.current = target;

    setIsTurning(false);

    navigate(target);
  }, [navigate]);

  const handlePageTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "transform"
    ) {
      return;
    }

    finishTurn();
  };

  useEffect(() => {
    if (!isTurning) return;

    const timer = window.setTimeout(() => {
      finishTurn();
    }, 1650);

    return () => window.clearTimeout(timer);
  }, [isTurning, finishTurn]);

  // ====================================
  // 로그인 제출
  // ====================================

  const loginDisabled = !isOpen || !coverSettled || isSignup || isTurning;

  const signupActive = isOpen && coverSettled && isSignup && !isTurning;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loginDisabled || loginLoading) return;

    setLoginError("");

    if (!onLogin) {
      setLoginError("로그인 API가 아직 연결되지 않았습니다.");
      return;
    }

    setLoginLoading(true);

    try {
      await onLogin(email, password, remember);
    } catch {
      setLoginError("로그인에 실패했습니다.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <RoutySignupProvider
      onCheckUsername={onCheckUsername}
      onSendVerification={onSendVerification}
      onConfirmVerification={onConfirmVerification}
      onSignup={onSignup}
      onCompleted={() => turnPage(false)}
    >
      <Stage>
        <Book data-open={isOpen}>
          {/* =================================
              로그인 페이지 아래에 있는
              실제 회원가입 오른쪽 화면
          ================================= */}

          <SignupRightPage aria-hidden={!isSignup}>
            <RoutySignup side="right" active={signupActive} />
          </SignupRightPage>

          {/* =================================
              실제로 넘어가는 종이 한 장
          ================================= */}

          <TurningLeaf
            data-signup={isSignup}
            onTransitionEnd={handlePageTransitionEnd}
          >
            {/* 종이 앞면: 로그인 */}
            <LoginFace aria-hidden={isSignup}>
              <LoginHeading>로그인</LoginHeading>

              <LoginForm onSubmit={handleSubmit}>
                <InputLabel htmlFor={`${fieldId}-email`}>이메일</InputLabel>

                <InputBox>
                  <InputIcon aria-hidden="true">
                    <Mail />
                  </InputIcon>

                  <TextInput
                    id={`${fieldId}-email`}
                    type="email"
                    placeholder="이메일을 입력해주세요."
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loginDisabled || loginLoading}
                    required
                  />
                </InputBox>

                <InputLabel htmlFor={`${fieldId}-password`}>
                  비밀번호
                </InputLabel>

                <InputBox>
                  <InputIcon aria-hidden="true">
                    <LockKeyhole />
                  </InputIcon>

                  <TextInput
                    id={`${fieldId}-password`}
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력해주세요."
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loginDisabled || loginLoading}
                    required
                  />

                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loginDisabled}
                    aria-label="비밀번호 보기"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </PasswordToggle>
                </InputBox>

                <RememberLabel>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    disabled={loginDisabled}
                  />
                  로그인 상태 유지
                </RememberLabel>

                <SubmitButton
                  type="submit"
                  disabled={loginDisabled || loginLoading}
                >
                  {loginLoading ? "로그인 중..." : "로그인"}
                </SubmitButton>

                {loginError && <Feedback role="alert">{loginError}</Feedback>}
              </LoginForm>

              <AccountLinks>
                <TextButton
                  type="button"
                  onClick={onFindId}
                  disabled={loginDisabled || !onFindId}
                >
                  아이디 찾기
                </TextButton>

                <span>|</span>

                <TextButton
                  type="button"
                  onClick={onFindPassword}
                  disabled={loginDisabled || !onFindPassword}
                >
                  비밀번호 찾기
                </TextButton>

                <span>|</span>

                <SignUpButton
                  type="button"
                  onClick={() => turnPage(true)}
                  disabled={loginDisabled}
                >
                  회원가입
                  <ArrowRight />
                </SignUpButton>
              </AccountLinks>
            </LoginFace>

            {/* 종이 뒷면:
                실제 회원가입 왼쪽 입력창 */}
            <SignupLeftFace aria-hidden={!isSignup}>
              <RoutySignup
                side="left"
                active={signupActive}
                onBack={() => turnPage(false)}
              />
            </SignupLeftFace>
          </TurningLeaf>

          {/* =================================
              기존 여권 표지
              SVG 및 텍스트 그대로 유지
          ================================= */}

          <CoverLeaf
            data-open={isOpen}
            data-settled={coverSettled}
            onTransitionEnd={handleCoverTransitionEnd}
          >
            <CoverFrontFace
              type="button"
              onClick={handleOpen}
              disabled={isOpen}
              aria-label="여권 열기"
            >
              <CoverFront />
            </CoverFrontFace>

            <CoverInsideFace
              type="button"
              onClick={handleClose}
              disabled={!isOpen || !coverSettled || isSignup || isTurning}
              aria-label="여권 닫기"
            >
              <CoverImage src={coverInside} alt="" draggable={false} />
            </CoverInsideFace>
          </CoverLeaf>
        </Book>

        <Hint data-open={isOpen}>여권을 클릭해주세요!</Hint>
      </Stage>
    </RoutySignupProvider>
  );
}
