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

import { ChevronLeft, CheckCircle2, CircleAlert, Eye, EyeOff, EyeClosed, LockKeyhole, Mail } from "lucide-react";

import CoverFront from "./CoverFront";
import DatePicker from "../pickers/DatePicker";
import routyLogoMobile from "../../assets/루티1.svg";

import coverInside from "../../assets/routy-cover-inside.svg";

import RoutySignup, {
  RoutySignupProvider,
  type SignupApiProps,
  useSignup,
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
  DesktopOnly,
  MobileShell,
  MobileTopBar,
  MobileHeader,
  MobileLogo,
  MobileBack,
  MobileProgress,
  MobileProgressPart,
  MobileContent,
  MobileCoverPrompt,
  MobileCoverScene,
  MobileCoverOverlay,
  MobileCoverButton,
  MobileTitle,
  MobileField,
  MobileLabel,
  MobileInput,
  MobileInputRow,
  MobileMiniButton,
  MobileHelp,
  MobileStatus,
  MobileCheck,
  MobileAction,
  MobilePrimary,
  MobileLinks,
  MobileTextButton,
  MobileFooterStripe,
  MobileForm,
  MobilePasswordBox,
  MobileEyeButton,
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

type CoverPhase = "closed" | "opening" | "open" | "closing";

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

  // 최초 진입 및 새로고침 시에는 항상 닫힌 여권부터 표시합니다.
  const [isOpen, setIsOpen] = useState(false);
  const [coverPhase, setCoverPhase] = useState<CoverPhase>("closed");
  const [isSignup, setIsSignup] = useState(false);
  const [isTurning, setIsTurning] = useState(false);
  const [mobilePage, setMobilePage] = useState<MobileView>("cover");

  const targetPath = useRef<"/login" | "/signup" | null>(null);
  const internalNavigation = useRef<string | null>(null);
  const initialRoute = useRef(true);
  const previousPath = useRef(location.pathname);

  // ==================================
  // 로그인 입력 상태
  // ==================================

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false);

  const [loginError, setLoginError] = useState("");

  // ==================================
  // URL 상태 동기화
  // ==================================

  useEffect(() => {
    if (initialRoute.current) {
      initialRoute.current = false;
      // 직접 /signup에서 새로고침했더라도 표지부터 시작합니다.
      if (location.pathname === "/signup") {
        internalNavigation.current = "/login";
        navigate("/login", { replace: true });
      }
      return;
    }

    // React StrictMode에서 같은 URL의 효과가 재실행되는 경우를 무시합니다.
    if (previousPath.current === location.pathname) return;
    previousPath.current = location.pathname;

    // 자체 버튼이 변경한 URL은 페이지 상태를 덮어쓰지 않습니다.
    if (internalNavigation.current === location.pathname) {
      internalNavigation.current = null;
      return;
    }

    // 브라우저의 뒤로가기/앞으로가기 등 외부 URL 변경에 대응합니다.
    const nextSignup = location.pathname === "/signup";
    setMobilePage(nextSignup ? "signup" : "login");
    setIsSignup(nextSignup);
    setIsTurning(false);
    setIsOpen(true);
    setCoverPhase("open");
    targetPath.current = null;
  }, [location.pathname, navigate]);

  const changeMobilePage = (next: MobileView) => {
    setMobilePage(next);
    // 화면 너비가 변경되어도 데스크톱 여권 상태가 올바르도록 동기화합니다.
    setIsSignup(next === "signup");
    setIsOpen(next !== "cover");
    setCoverPhase(next === "cover" ? "closed" : "open");
    setIsTurning(false);
    targetPath.current = null;

    const target = next === "signup" ? "/signup" : "/login";
    if (location.pathname !== target) {
      internalNavigation.current = target;
      navigate(target);
    }
  };

  // ==================================
  // 여권 열기
  // ==================================

  const handleOpen = () => {
    if (isTurning || coverPhase !== "closed") {
      return;
    }

    setCoverPhase("opening");
    setIsOpen(true);
  };

  // ==================================
  // 여권 닫기
  // ==================================

  const handleClose = () => {
    if (isTurning || isSignup || coverPhase !== "open") {
      return;
    }

    // 닫기 시작하면 안내 문구 숨김 유지
    setCoverPhase("closing");
    setIsOpen(false);
  };

  // ==================================
  // 표지 회전 완료
  // ==================================

  const handleCoverTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "transform"
    ) {
      return;
    }

    // 완전히 닫힌 다음에만
    // Hint가 등장하도록 변경
    setCoverPhase(isOpen ? "open" : "closed");
  };

  // 애니메이션 종료 이벤트 누락 대비
  useEffect(() => {
    if (coverPhase !== "opening" && coverPhase !== "closing") {
      return;
    }

    const timer = window.setTimeout(() => {
      setCoverPhase(isOpen ? "open" : "closed");
    }, 1950);

    return () => {
      window.clearTimeout(timer);
    };
  }, [coverPhase, isOpen]);

  // ==================================
  // 로그인 ↔ 회원가입 책장 넘김
  // ==================================

  const turnPage = (toSignup: boolean) => {
    if (!isOpen || coverPhase !== "open" || isTurning) {
      return;
    }

    if (isSignup === toSignup) {
      return;
    }

    targetPath.current = toSignup ? "/signup" : "/login";

    setIsTurning(true);
    setIsSignup(toSignup);
  };

  const finishTurn = useCallback(() => {
    const target = targetPath.current;

    if (!target) return;

    targetPath.current = null;

    internalNavigation.current = target;

    setIsTurning(false);

    navigate(target);
  }, [navigate]);

  // 페이지 회전 종료
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

    const timer = window.setTimeout(finishTurn, 1650);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isTurning, finishTurn]);

  // ==================================
  // 로그인 활성화 상태
  // ==================================

  const loginDisabled =
    !isOpen || coverPhase !== "open" || isSignup || isTurning;

  const signupActive =
    isOpen && coverPhase === "open" && isSignup && !isTurning;

  // ==================================
  // 로그인 처리
  // ==================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loginDisabled || loginLoading) {
      return;
    }

    setLoginError("");

    if (!onLogin) {
      setLoginError("로그인 API가 아직 연결되지 않았습니다.");
      return;
    }

    setLoginLoading(true);

    try {
      await onLogin(email, password, remember);
    } catch {
      setLoginError("로그인에 실패했습니다. 다시 확인해주세요.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ==================================
  // 화면
  // ==================================

  return (
    <RoutySignupProvider
      onCheckUsername={onCheckUsername}
      onSendVerification={onSendVerification}
      onConfirmVerification={onConfirmVerification}
      onSignup={onSignup}
      onCompleted={() => {
        if (window.matchMedia("(max-width: 767px)").matches) {
          changeMobilePage("login");
        } else {
          turnPage(false);
        }
      }}
    >
      <DesktopOnly>
      <Stage>
        <Book data-open={isOpen}>
          {/* 회원가입 오른쪽 페이지 */}
          <SignupRightPage aria-hidden={!isSignup}>
            <RoutySignup side="right" active={signupActive} />
          </SignupRightPage>

          {/* 회전하는 로그인 / 회원가입 종이 */}
          <TurningLeaf
            data-signup={isSignup}
            onTransitionEnd={handlePageTransitionEnd}
          >
            {/* 종이 앞면: 로그인 */}
            <LoginFace aria-hidden={isSignup}>
              <LoginHeading>로그인</LoginHeading>

              <LoginForm onSubmit={handleSubmit}>
                {/* 이메일 */}
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
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={loginDisabled || loginLoading}
                    required
                  />
                </InputBox>

                {/* 비밀번호 */}
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
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loginDisabled || loginLoading}
                    required
                  />

                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loginDisabled}
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </PasswordToggle>
                </InputBox>

                {/* 로그인 상태 유지 */}
                <RememberLabel>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    disabled={loginDisabled}
                  />
                  로그인 상태 유지
                </RememberLabel>

                {/* 로그인 버튼 */}
                <SubmitButton
                  type="submit"
                  disabled={loginDisabled || loginLoading}
                >
                  {loginLoading ? "로그인 중..." : "로그인"}
                </SubmitButton>

                {loginError && <Feedback role="alert">{loginError}</Feedback>}
              </LoginForm>

              {/* 계정 관련 메뉴 */}
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

                {/* 화살표 제거 */}
                <SignUpButton
                  type="button"
                  onClick={() => turnPage(true)}
                  disabled={loginDisabled}
                >
                  회원가입
                </SignUpButton>
              </AccountLinks>
            </LoginFace>

            {/* 종이 뒷면: 회원가입 왼쪽 */}
            <SignupLeftFace aria-hidden={!isSignup}>
              <RoutySignup
                side="left"
                active={signupActive}
                onBack={() => turnPage(false)}
              />
            </SignupLeftFace>
          </TurningLeaf>

          {/* 기존 Routy 여권 표지 */}
          <CoverLeaf
            data-open={isOpen}
            data-settled={coverPhase === "open"}
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
              disabled={coverPhase !== "open" || isSignup || isTurning}
              aria-label="여권 닫기"
            >
              <CoverImage
                src={coverInside}
                alt="Routy 여행 안내"
                draggable={false}
              />
            </CoverInsideFace>
          </CoverLeaf>
        </Book>

        {/* 여권이 완전히 닫힌 뒤 표시 */}
        <Hint
          type="button"
          data-visible={coverPhase === "closed"}
          onClick={handleOpen}
          disabled={coverPhase !== "closed"}
        >
          여권을 클릭해주세요!
        </Hint>
      </Stage>
      </DesktopOnly>

      <MobileFlow
        page={mobilePage}
        onPageChange={changeMobilePage}
        onLogin={onLogin}
        onFindId={onFindId}
        onFindPassword={onFindPassword}
        hasPhoneApi={Boolean(onSendVerification && onConfirmVerification)}
        hasUsernameApi={Boolean(onCheckUsername)}
      />
    </RoutySignupProvider>
  );
}

// =========================================================
// 모바일 화면: 기존 회원가입 Context를 그대로 사용합니다.
// 데스크톱용 여권의 JSX와 3D 애니메이션에는 영향을 주지 않습니다.
// =========================================================

type MobileView = "cover" | "login" | "signup";

type MobileFlowProps = {
  page: MobileView;
  onPageChange: (next: MobileView) => void;
  onLogin?: (email: string, password: string, remember: boolean) => void | Promise<void>;
  onFindId?: () => void;
  onFindPassword?: () => void;
  hasPhoneApi: boolean;
  hasUsernameApi: boolean;
};

const STEP_TITLES = [
  "이메일",
  "휴대전화번호 인증",
  "생년월일",
  "이름",
  "아이디 · 비밀번호",
  "약관 동의",
] as const;

function MobileFlow({
  page,
  onPageChange,
  onLogin,
  onFindId,
  onFindPassword,
  hasPhoneApi,
  hasUsernameApi,
}: MobileFlowProps) {
  const signup = useSignup();
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [mobilePasswordTouched, setMobilePasswordTouched] = useState(false);
  const [mobileConfirmTouched, setMobileConfirmTouched] = useState(false);

  // 모바일 표지: 터치하면 닫힌 여권이 확대되며 사라지고 로그인 화면이 나타납니다.
  const [mobileOpening, setMobileOpening] = useState(false);
  const mobileOpeningPending = useRef(false);
  const mobileOpeningTimer = useRef<number | null>(null);

  // 전환이 완료되면 한 번만 로그인 페이지로 이동합니다.
  const finishMobileOpen = () => {
    if (!mobileOpeningPending.current) return;
    mobileOpeningPending.current = false;
    if (mobileOpeningTimer.current !== null) {
      window.clearTimeout(mobileOpeningTimer.current);
      mobileOpeningTimer.current = null;
    }
    // 표지가 완전히 커진 뒤에 로그인 화면을 표시합니다.
    // 전환 도중에는 로그인 폼을 렌더링하지 않아 서로 겹쳐 보이지 않습니다.
    setMobileOpening(false);
    onPageChange("login");
  };

  const handleMobileOpen = () => {
    if (page !== "cover" || mobileOpeningPending.current) return;
    mobileOpeningPending.current = true;
    setMobileOpening(true);
    // 로그인 화면은 여권 확대 애니메이션이 끝난 뒤 표시합니다.
    // transitionend가 생략되는 기기/탭 전환 상황에 대비합니다.
    // 움직임 감소 설정에서는 대기 시간을 짧게 합니다.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    mobileOpeningTimer.current = window.setTimeout(
      finishMobileOpen,
      reducedMotion ? 60 : 850,
    );
  };

  useEffect(() => {
    // 다른 화면으로 이동하거나 컴포넌트가 해제되면 타이머가 남지 않도록 정리합니다.
    // 표지가 커지는 동안 로그인 주소로 바뀌어도 애니메이션은 유지합니다.
    if (page === "login" && mobileOpeningPending.current) return;
    if (page !== "cover") {
      mobileOpeningPending.current = false;
      setMobileOpening(false);
      if (mobileOpeningTimer.current !== null) {
        window.clearTimeout(mobileOpeningTimer.current);
        mobileOpeningTimer.current = null;
      }
    }
  }, [page]);

  useEffect(() => () => {
    if (mobileOpeningTimer.current !== null) {
      window.clearTimeout(mobileOpeningTimer.current);
    }
  }, []);

  useEffect(() => {
    if (page === "signup") {
      setStep(0);
      setStepError("");
      setMobilePasswordTouched(false);
      setMobileConfirmTouched(false);
    }
  }, [page]);

  const handleBack = () => {
    setStepError("");
    if (page === "signup") {
      if (step > 0) {
        setStep((value) => value - 1);
      } else {
        onPageChange("login");
      }
    } else if (page === "login") {
      onPageChange("cover");
    }
  };

  const handleMobileLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loginBusy) return;
    setLoginError("");
    if (!onLogin) {
      setLoginError("로그인 서버가 아직 연결되지 않았습니다.");
      return;
    }
    try {
      setLoginBusy(true);
      await onLogin(loginEmail, loginPassword, remember);
    } catch {
      setLoginError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setLoginBusy(false);
    }
  };

  const validateAndAdvance = () => {
    setStepError("");
    const values = signup.form;

    if (step === 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      setStepError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    if (step === 1) {
      if (!/^01[016789]\d{7,8}$/.test(values.phone.replace(/\D/g, ""))) {
        setStepError("올바른 휴대전화번호를 입력해주세요.");
        return;
      }
      if (hasPhoneApi && !signup.phoneVerified) {
        setStepError("휴대전화 인증을 완료해주세요.");
        return;
      }
    }

    if (step === 2) {
      const value = values.birth;
      const parsed = new Date(`${value}T00:00:00`);
      if (!value || Number.isNaN(parsed.getTime()) || parsed > new Date()) {
        setStepError("올바른 생년월일을 입력해주세요.");
        return;
      }
    }

    if (step === 3 && (!values.firstName.trim() || !values.lastName.trim())) {
      setStepError("성과 이름을 모두 입력해주세요.");
      return;
    }

    if (step === 4) {
      if (values.username.trim().length < 4) {
        setStepError("아이디는 4자 이상 입력해주세요.");
        return;
      }
      if (hasUsernameApi && !signup.usernameChecked) {
        setStepError("아이디 중복 확인을 완료해주세요.");
        return;
      }
      if (!signup.passwordValid || !signup.passwordMatched) {
        setStepError("비밀번호 조건과 일치 여부를 확인해주세요.");
        return;
      }
    }

    setStep((value) => Math.min(value + 1, STEP_TITLES.length - 1));
  };

  const handleSignupNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (signup.busy) return;
    if (step === STEP_TITLES.length - 1) {
      void signup.submitSignup(event);
    } else {
      validateAndAdvance();
    }
  };

  return (
    <MobileShell>
      <MobileTopBar />

      {page !== "cover" && (
        <>
          <MobileHeader>
            <MobileBack type="button" onClick={handleBack} aria-label="이전 화면">
              <ChevronLeft size={26} strokeWidth={2} />
            </MobileBack>
            {page === "signup" ? (
              <MobileLogo src={routyLogoMobile} alt="Routy" draggable={false} />
            ) : (
              <span />
            )}
            <span style={{ width: 32 }} />
          </MobileHeader>

          {page === "login" ? (
            <MobileContent>
              <MobileTitle data-login="true">로그인</MobileTitle>
              <MobileForm onSubmit={handleMobileLogin}>
                <MobileField>
                  <MobileLabel htmlFor="mobile-login-email">이메일</MobileLabel>
                  <MobileInput
                    id="mobile-login-email"
                    type="email"
                    autoComplete="username"
                    placeholder="이메일을 입력해주세요."
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    required
                  />
                </MobileField>
                <MobileField>
                  <MobileLabel htmlFor="mobile-login-password">비밀번호</MobileLabel>
                  <MobilePasswordBox>
                    <MobileInput
                      id="mobile-login-password"
                      type={loginPasswordVisible ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="비밀번호를 입력해주세요."
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      required
                    />
                    <MobileEyeButton
                      type="button"
                      aria-label={loginPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
                      onClick={() => setLoginPasswordVisible((value) => !value)}
                    >
                      {loginPasswordVisible ? <EyeClosed size={24} /> : <Eye size={24} />}
                    </MobileEyeButton>
                  </MobilePasswordBox>
                </MobileField>
                <MobileCheck>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  로그인 상태 유지
                </MobileCheck>
                {loginError && <MobileStatus role="alert">{loginError}</MobileStatus>}
                <MobilePrimary type="submit" disabled={loginBusy}>
                  {loginBusy ? "로그인 중..." : "로그인"}
                </MobilePrimary>
              </MobileForm>
              <MobileLinks>
                <MobileTextButton type="button" disabled={!onFindId} onClick={onFindId}>
                  아이디 찾기
                </MobileTextButton>
                <span>|</span>
                <MobileTextButton type="button" disabled={!onFindPassword} onClick={onFindPassword}>
                  비밀번호 찾기
                </MobileTextButton>
                <span>|</span>
                <MobileTextButton type="button" onClick={() => onPageChange("signup")}>
                  회원가입
                </MobileTextButton>
              </MobileLinks>
            </MobileContent>
          ) : (
            <>
              <MobileProgress aria-label={`회원가입 ${step + 1} / ${STEP_TITLES.length} 단계`}>
                {STEP_TITLES.map((name, index) => (
                  <MobileProgressPart
                    key={name}
                    data-active={index <= step}
                  />
                ))}
              </MobileProgress>
              <MobileForm data-signup="true" onSubmit={handleSignupNext} noValidate>
                <MobileContent data-step="true">
                  <MobileTitle>{STEP_TITLES[step]}</MobileTitle>

                  {step === 0 && (
                    <MobileField>
                      <MobileLabel htmlFor="mobile-email">이메일</MobileLabel>
                      <MobileInput
                        id="mobile-email"
                        type="email"
                        placeholder="이메일을 입력해주세요."
                        autoComplete="email"
                        value={signup.form.email}
                        onChange={(event) => signup.updateField("email", event.target.value)}
                      />
                      <MobileHelp>이후 로그인과 여행 정보 안내에 사용됩니다.</MobileHelp>
                    </MobileField>
                  )}

                  {step === 1 && (
                    <MobileField>
                      <MobileLabel htmlFor="mobile-phone">휴대전화번호 인증</MobileLabel>
                      <MobileInputRow>
                        <MobileInput
                          id="mobile-phone"
                          type="tel"
                          inputMode="tel"
                          placeholder="010-1234-5678"
                          autoComplete="tel"
                          value={signup.form.phone}
                          onChange={(event) => signup.updateField("phone", event.target.value)}
                        />
                        <MobileMiniButton
                          type="button"
                          disabled={signup.busy}
                          onClick={() => void signup.sendCode()}
                        >
                          발송
                        </MobileMiniButton>
                      </MobileInputRow>
                      <MobileInputRow>
                        <MobileInput
                          type="text"
                          inputMode="numeric"
                          aria-label="휴대전화 인증번호"
                          placeholder="인증번호 입력"
                          value={signup.verificationCode}
                          onChange={(event) => signup.setVerificationCode(event.target.value)}
                          disabled={!signup.codeSent || signup.phoneVerified}
                        />
                        <MobileMiniButton
                          type="button"
                          disabled={!signup.codeSent || signup.busy || signup.phoneVerified}
                          onClick={() => void signup.verifyCode()}
                        >
                          확인
                        </MobileMiniButton>
                      </MobileInputRow>
                      {signup.phoneMessage && (
                        <MobileStatus data-valid={signup.phoneVerified} role="status">
                          {signup.phoneVerified ? <CheckCircle2 size={17} /> : <CircleAlert size={17} />}
                          {signup.phoneMessage}
                        </MobileStatus>
                      )}
                      {!hasPhoneApi && (
                        <MobileHelp>인증 API 미연결: 화면은 다음 단계까지 확인할 수 있지만 실제 가입은 인증 연결 후 가능합니다.</MobileHelp>
                      )}
                    </MobileField>
                  )}

                  {step === 2 && (
                    <MobileField>
                      <MobileLabel>생년월일</MobileLabel>
                      <DatePicker modal
                        label=""
                        name="birth"
                        value={signup.form.birth}
                        onChange={(value) => signup.updateField("birth", value)}
                        min="1900-01-01"
                        placement="bottom"
                      />
                      <MobileHelp>주민등록번호는 입력받지 않습니다.</MobileHelp>
                    </MobileField>
                  )}

                  {step === 3 && (
                    <>
                      <MobileField>
                        <MobileLabel htmlFor="mobile-last-name">성</MobileLabel>
                        <MobileInput
                          id="mobile-last-name"
                          type="text"
                          autoComplete="family-name"
                          placeholder="성을 입력해주세요."
                          value={signup.form.lastName}
                          onChange={(event) => signup.updateField("lastName", event.target.value)}
                        />
                      </MobileField>
                      <MobileField>
                        <MobileLabel htmlFor="mobile-first-name">이름</MobileLabel>
                        <MobileInput
                          id="mobile-first-name"
                          type="text"
                          autoComplete="given-name"
                          placeholder="이름을 입력해주세요."
                          value={signup.form.firstName}
                          onChange={(event) => signup.updateField("firstName", event.target.value)}
                        />
                      </MobileField>
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <MobileField>
                        <MobileLabel htmlFor="mobile-username">아이디</MobileLabel>
                        <MobileInputRow>
                          <MobileInput
                            id="mobile-username"
                            type="text"
                            autoComplete="username"
                            placeholder="아이디 4자 이상"
                            value={signup.form.username}
                            onChange={(event) => signup.updateField("username", event.target.value)}
                          />
                          <MobileMiniButton
                            type="button"
                            disabled={signup.busy}
                            onClick={() => void signup.checkUsername()}
                          >
                            중복 확인
                          </MobileMiniButton>
                        </MobileInputRow>
                        {signup.usernameMessage && (
                          <MobileStatus data-valid={signup.usernameChecked} role="status">
                            {signup.usernameMessage}
                          </MobileStatus>
                        )}
                        {!hasUsernameApi && (
                          <MobileHelp>중복 확인 API가 없어 화면 진행만 가능합니다.</MobileHelp>
                        )}
                      </MobileField>
                      <MobileField>
                        <MobileLabel htmlFor="mobile-signup-password">비밀번호</MobileLabel>
                        <MobilePasswordBox>
                          <MobileInput
                            id="mobile-signup-password"
                            type={signup.showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="영문·숫자·특수문자 포함 8자 이상"
                            value={signup.form.password}
                            onChange={(event) => signup.updateField("password", event.target.value)}
                            onBlur={() => setMobilePasswordTouched(true)}
                            aria-invalid={mobilePasswordTouched && !signup.passwordValid}
                          />
                          <MobileEyeButton
                            type="button"
                            aria-label={signup.showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                            onClick={() => signup.setShowPassword(!signup.showPassword)}
                          >
                            {signup.showPassword ? <EyeClosed size={24} /> : <Eye size={24} />}
                          </MobileEyeButton>
                        </MobilePasswordBox>
                        {mobilePasswordTouched && !signup.passwordValid && (
                          <MobileStatus role="alert">
                            <CircleAlert size={18} aria-hidden="true" />
                            {signup.form.password.length === 0
                              ? "비밀번호를 입력해주세요."
                              : "영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요."}
                          </MobileStatus>
                        )}
                      </MobileField>
                      <MobileField>
                        <MobileLabel htmlFor="mobile-confirm-password">비밀번호 확인</MobileLabel>
                        <MobilePasswordBox>
                          <MobileInput
                            id="mobile-confirm-password"
                            type={signup.showConfirm ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="비밀번호를 다시 입력해주세요."
                            value={signup.confirmPassword}
                            onChange={(event) => signup.setConfirmPassword(event.target.value)}
                            onBlur={() => setMobileConfirmTouched(true)}
                            aria-invalid={mobileConfirmTouched && !signup.passwordMatched}
                          />
                          <MobileEyeButton
                            type="button"
                            aria-label={signup.showConfirm ? "비밀번호 확인 숨기기" : "비밀번호 확인 보기"}
                            onClick={() => signup.setShowConfirm(!signup.showConfirm)}
                          >
                            {signup.showConfirm ? <EyeClosed size={24} /> : <Eye size={24} />}
                          </MobileEyeButton>
                        </MobilePasswordBox>
                        {mobileConfirmTouched && !signup.passwordMatched && (
                          <MobileStatus role="alert">
                            <CircleAlert size={18} aria-hidden="true" />
                            {signup.confirmPassword.length === 0
                              ? "비밀번호를 다시 입력해주세요."
                              : "비밀번호가 일치하지 않습니다."}
                          </MobileStatus>
                        )}
                      </MobileField>
                    </>
                  )}

                  {step === 5 && (
                    <MobileField>
                      <MobileCheck data-all="true">
                        <input
                          type="checkbox"
                          checked={signup.allAgreed}
                          onChange={(event) => signup.agreeAll(event.target.checked)}
                        />
                        전체 약관 동의
                      </MobileCheck>
                      <MobileCheck>
                        <input
                          type="checkbox"
                          checked={signup.form.agreeTerms}
                          onChange={(event) => signup.updateField("agreeTerms", event.target.checked)}
                        />
                        [필수] 이용약관에 동의합니다.
                      </MobileCheck>
                      <MobileCheck>
                        <input
                          type="checkbox"
                          checked={signup.form.agreePrivacy}
                          onChange={(event) => signup.updateField("agreePrivacy", event.target.checked)}
                        />
                        [필수] 개인정보 수집 및 이용에 동의합니다.
                      </MobileCheck>
                      <MobileCheck>
                        <input
                          type="checkbox"
                          checked={signup.form.agreeMarketing}
                          onChange={(event) => signup.updateField("agreeMarketing", event.target.checked)}
                        />
                        [선택] 마케팅 정보 수신
                      </MobileCheck>
                      <MobileCheck>
                        <input
                          type="checkbox"
                          checked={signup.form.agreeLocation}
                          onChange={(event) => signup.updateField("agreeLocation", event.target.checked)}
                        />
                        [선택] 위치 기반 서비스 이용
                      </MobileCheck>
                      {signup.formMessage && <MobileStatus role="alert">{signup.formMessage}</MobileStatus>}
                      <MobileHelp>실제 가입 처리는 서버 API 연결 후 가능합니다.</MobileHelp>
                    </MobileField>
                  )}

                  {stepError && <MobileStatus role="alert">{stepError}</MobileStatus>}
                </MobileContent>
                <MobileAction>
                  <MobilePrimary type="submit" disabled={signup.busy}>
                    {signup.busy
                      ? "처리 중..."
                      : step === STEP_TITLES.length - 1
                        ? "회원가입"
                        : "다음"}
                  </MobilePrimary>
                </MobileAction>
              </MobileForm>
            </>
          )}
        </>
      )}

      {/* 모바일 닫힌 여권은 확대되며 사라집니다.
          기존 안쪽 홍보 SVG나 빈 중간 페이지는 렌더링하지 않습니다. */}
      {(page === "cover" || mobileOpening) && (
        <MobileCoverOverlay data-opening={mobileOpening}>
          <MobileCoverPrompt data-opening={mobileOpening}>
            여권을 클릭해주세요!
          </MobileCoverPrompt>
          <MobileCoverScene>
            <MobileCoverButton
              type="button"
              data-opening={mobileOpening}
              onClick={handleMobileOpen}
              onTransitionEnd={(event: TransitionEvent<HTMLButtonElement>) => {
                if (
                  event.target === event.currentTarget &&
                  event.propertyName === "transform"
                ) {
                  finishMobileOpen();
                }
              }}
              disabled={mobileOpening}
              aria-label="Routy 여권을 확대하여 로그인 화면 열기"
            >
              <CoverFront />
            </MobileCoverButton>
          </MobileCoverScene>
        </MobileCoverOverlay>
      )}
      <MobileFooterStripe />
    </MobileShell>
  );
}
