import {
  createContext,
  useContext,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Eye,
  EyeClosed,
} from "lucide-react";

import routyLogo from "../../assets/루티1.svg";
import DatePicker from "../pickers/DatePicker";

import {
  LeftContent,
  RightContent,
  Header,
  BrandLogo,
  PageTitle,
  Fields,
  Field,
  FieldPair,
  FieldLabel,
  EnglishLabel,
  Input,
  InputGroup,
  SmallButton,
  StatusText,
  PasswordInput,
  EyeButton,
  TermsSection,
  CheckRow,
  SubmitButton,
  BackButton,
  Message,
  PageFooter,
} from "./RoutySignupStyle";

export interface SignupData {
  firstName: string;
  lastName: string;
  birth: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
  agreeLocation: boolean;
}

export interface SignupApiProps {
  onCheckUsername?: (username: string) => Promise<boolean>;

  onSendVerification?: (phone: string) => Promise<void>;

  onConfirmVerification?: (phone: string, code: string) => Promise<boolean>;

  onSignup?: (data: SignupData) => Promise<void>;
}

interface ProviderProps extends SignupApiProps {
  children: ReactNode;
  onCompleted: () => void;
}

const FORM_ID = "routy-signup-form";

// UTC가 아닌 사용자의 현지 날짜를 최대 선택 날짜로 사용합니다.
function getLocalToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function useSignupState({
  onCheckUsername,
  onSendVerification,
  onConfirmVerification,
  onSignup,
  onCompleted,
}: Omit<ProviderProps, "children">) {
  const [form, setForm] = useState<SignupData>({
    firstName: "",
    lastName: "",
    birth: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
    agreeLocation: false,
  });

  const [verificationCode, setVerificationCode] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [usernameChecked, setUsernameChecked] = useState(false);

  const [phoneVerified, setPhoneVerified] = useState(false);

  const [codeSent, setCodeSent] = useState(false);

  const [usernameMessage, setUsernameMessage] = useState("");

  const [phoneMessage, setPhoneMessage] = useState("");

  const [formMessage, setFormMessage] = useState("");

  const [busy, setBusy] = useState(false);

  // 입력값 변경
  const updateField = <K extends keyof SignupData>(
    key: K,
    value: SignupData[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "username") {
      setUsernameChecked(false);
      setUsernameMessage("");
    }

    if (key === "phone") {
      setPhoneVerified(false);
      setCodeSent(false);
      setVerificationCode("");
      setPhoneMessage("");
    }

    setFormMessage("");
  };

  // 비밀번호 검사
  const passwordValid =
    form.password.length >= 8 &&
    /[A-Za-z]/.test(form.password) &&
    /\d/.test(form.password) &&
    /[^A-Za-z0-9]/.test(form.password);

  const passwordMatched =
    confirmPassword.length > 0 && form.password === confirmPassword;

  // 아이디 중복 확인
  const checkUsername = async () => {
    const username = form.username.trim();

    if (username.length < 4) {
      setUsernameChecked(false);
      setUsernameMessage("아이디는 4자 이상 입력해주세요.");
      return;
    }

    if (!onCheckUsername) {
      setUsernameMessage("아이디 중복 확인 API가 연결되지 않았습니다.");
      return;
    }

    setBusy(true);

    try {
      const available = await onCheckUsername(username);

      setUsernameChecked(available);

      setUsernameMessage(
        available
          ? "사용 가능한 아이디입니다."
          : "이미 사용 중인 아이디입니다.",
      );
    } catch {
      setUsernameChecked(false);
      setUsernameMessage("중복 확인 중 오류가 발생했습니다.");
    } finally {
      setBusy(false);
    }
  };

  // 휴대폰 인증번호 발송
  const sendCode = async () => {
    const phone = form.phone.replace(/\D/g, "");

    if (!/^01[016789]\d{7,8}$/.test(phone)) {
      setPhoneMessage("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    if (!onSendVerification) {
      setPhoneMessage("휴대폰 인증 API가 연결되지 않았습니다.");
      return;
    }

    setBusy(true);

    try {
      await onSendVerification(phone);

      setCodeSent(true);
      setPhoneVerified(false);
      setVerificationCode("");
      setPhoneMessage("인증번호가 발송되었습니다.");
    } catch {
      setPhoneMessage("인증번호 발송에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  // 인증번호 확인
  const verifyCode = async () => {
    if (!codeSent || !verificationCode.trim()) {
      setPhoneMessage("인증번호를 확인해주세요.");
      return;
    }

    if (!onConfirmVerification) {
      setPhoneMessage("인증 확인 API가 연결되지 않았습니다.");
      return;
    }

    setBusy(true);

    try {
      const verified = await onConfirmVerification(
        form.phone.replace(/\D/g, ""),
        verificationCode.trim(),
      );

      setPhoneVerified(verified);

      setPhoneMessage(
        verified
          ? "본인 인증이 완료되었습니다."
          : "인증번호가 올바르지 않습니다.",
      );
    } catch {
      setPhoneVerified(false);
      setPhoneMessage("인증 확인에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  // 약관 전체 동의
  const allAgreed =
    form.agreeTerms &&
    form.agreePrivacy &&
    form.agreeMarketing &&
    form.agreeLocation;

  const agreeAll = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
      agreeLocation: checked,
    }));
  };

  // 회원가입 완료
  const submitSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (busy) return;

    setFormMessage("");

    // DatePicker는 기본 form 소속 input이 아니므로 생년월일을 직접 검증합니다.
    if (!form.birth) {
      setFormMessage("생년월일을 선택해주세요.");
      return;
    }

    if (form.birth < "1900-01-01" || form.birth > getLocalToday()) {
      setFormMessage("올바른 생년월일을 선택해주세요.");
      return;
    }

    if (!usernameChecked) {
      setFormMessage("아이디 중복 확인을 완료해주세요.");
      return;
    }

    if (!phoneVerified) {
      setFormMessage("휴대폰 본인 인증을 완료해주세요.");
      return;
    }

    if (!passwordValid || !passwordMatched) {
      setFormMessage("비밀번호 조건과 일치 여부를 확인해주세요.");
      return;
    }

    if (!form.agreeTerms || !form.agreePrivacy) {
      setFormMessage("필수 약관에 동의해주세요.");
      return;
    }

    if (!onSignup) {
      setFormMessage("회원가입 API가 연결되지 않았습니다.");
      return;
    }

    setBusy(true);

    try {
      await onSignup(form);
      onCompleted();
    } catch {
      setFormMessage("회원가입에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return {
    form,
    verificationCode,
    setVerificationCode,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    usernameChecked,
    phoneVerified,
    codeSent,
    usernameMessage,
    phoneMessage,
    formMessage,
    busy,
    passwordValid,
    passwordMatched,
    allAgreed,
    updateField,
    checkUsername,
    sendCode,
    verifyCode,
    agreeAll,
    submitSignup,
  };
}

type SignupState = ReturnType<typeof useSignupState>;

const SignupContext = createContext<SignupState | null>(null);

// 왼쪽과 오른쪽 페이지가 공유할 상태
export function RoutySignupProvider({ children, ...props }: ProviderProps) {
  const value = useSignupState(props);

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error("RoutySignupProvider가 필요합니다.");
  }

  return context;
}

interface RoutySignupProps {
  side: "left" | "right";
  active: boolean;
  onBack?: () => void;
}

export default function RoutySignup({
  side,
  active,
  onBack,
}: RoutySignupProps) {
  const s = useSignup();
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const disabled = !active || s.busy;

  // ==================================
  // 왼쪽 회원가입 페이지
  // ==================================

  if (side === "left") {
    return (
      <LeftContent>
        <Header>
          <BrandLogo src={routyLogo} alt="Routy" />
          <PageTitle>회원가입</PageTitle>
        </Header>

        <Fields>
          <FieldPair>
            <Field>
              <FieldLabel htmlFor="signup-first">
                이름
                <EnglishLabel>/ FIRSTNAME</EnglishLabel>
              </FieldLabel>

              <Input
                id="signup-first"
                form={FORM_ID}
                type="text"
                placeholder="이름을 입력해주세요."
                autoComplete="given-name"
                value={s.form.firstName}
                onChange={(e) => s.updateField("firstName", e.target.value)}
                disabled={disabled}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="signup-last">
                성<EnglishLabel>/ LASTNAME</EnglishLabel>
              </FieldLabel>

              <Input
                id="signup-last"
                form={FORM_ID}
                type="text"
                placeholder="성을 입력해주세요."
                autoComplete="family-name"
                value={s.form.lastName}
                onChange={(e) => s.updateField("lastName", e.target.value)}
                disabled={disabled}
                required
              />
            </Field>
          </FieldPair>

          <Field>
            <FieldLabel htmlFor="signup-birth">
              생년월일
              <EnglishLabel>/ BIRTH</EnglishLabel>
            </FieldLabel>

            <DatePicker
              label=""
              name="birth"
              value={s.form.birth}
              onChange={(value) => s.updateField("birth", value)}
              min="1900-01-01"
              max={getLocalToday()}
              placement="bottom"
              disabled={disabled}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-phone">
              본인 인증
              <EnglishLabel>/ VERIFICATION</EnglishLabel>
            </FieldLabel>

            <InputGroup>
              <Input
                id="signup-phone"
                form={FORM_ID}
                type="tel"
                placeholder="휴대폰 번호를 입력해주세요."
                autoComplete="tel"
                value={s.form.phone}
                onChange={(e) => s.updateField("phone", e.target.value)}
                disabled={disabled}
                required
              />

              <SmallButton
                type="button"
                onClick={s.sendCode}
                disabled={disabled}
              >
                인증번호 발송
              </SmallButton>
            </InputGroup>

            <InputGroup>
              <Input
                form={FORM_ID}
                type="text"
                inputMode="numeric"
                placeholder="인증번호를 입력해주세요."
                aria-label="휴대폰 인증번호"
                value={s.verificationCode}
                onChange={(e) => s.setVerificationCode(e.target.value)}
                disabled={disabled || !s.codeSent || s.phoneVerified}
              />

              <SmallButton
                type="button"
                onClick={s.verifyCode}
                disabled={disabled || !s.codeSent || s.phoneVerified}
              >
                인증 확인
              </SmallButton>
            </InputGroup>

            {s.phoneMessage && (
              <StatusText data-valid={s.phoneVerified} role="status">
                {s.phoneVerified ? <CheckCircle2 /> : <CircleAlert />}
                {s.phoneMessage}
              </StatusText>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-email">
              이메일
              <EnglishLabel>/ EMAIL</EnglishLabel>
            </FieldLabel>

            <Input
              id="signup-email"
              form={FORM_ID}
              type="email"
              placeholder="이메일을 입력해주세요."
              autoComplete="email"
              value={s.form.email}
              onChange={(e) => s.updateField("email", e.target.value)}
              disabled={disabled}
              required
            />
          </Field>
        </Fields>

        <PageFooter>
          <BackButton
            type="button"
            onClick={onBack}
            disabled={disabled || !onBack}
          >
            <ArrowLeft />
            로그인 화면으로 돌아가기
          </BackButton>
        </PageFooter>
      </LeftContent>
    );
  }

  // ==================================
  // 오른쪽 회원가입 페이지
  // ==================================

  return (
    <RightContent id={FORM_ID} onSubmit={s.submitSignup}>
      <Fields>
        <Field>
          <FieldLabel htmlFor="signup-username">
            아이디
            <EnglishLabel>/ USERNAME</EnglishLabel>
          </FieldLabel>

          <InputGroup>
            <Input
              id="signup-username"
              type="text"
              placeholder="아이디를 입력해주세요."
              autoComplete="username"
              value={s.form.username}
              onChange={(e) => s.updateField("username", e.target.value)}
              minLength={4}
              disabled={disabled}
              required
            />

            <SmallButton
              type="button"
              onClick={s.checkUsername}
              disabled={disabled}
            >
              중복확인
            </SmallButton>
          </InputGroup>

          {s.usernameMessage && (
            <StatusText data-valid={s.usernameChecked} role="status">
              {s.usernameChecked ? <CheckCircle2 /> : <CircleAlert />}
              {s.usernameMessage}
            </StatusText>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="signup-password">
            비밀번호
            <EnglishLabel>/ PASSWORD</EnglishLabel>
          </FieldLabel>

          <PasswordInput>
            <Input
              id="signup-password"
              type={s.showPassword ? "text" : "password"}
              placeholder="8자 이상, 영문/숫자/특수문자"
              autoComplete="new-password"
              value={s.form.password}
              onChange={(e) => s.updateField("password", e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              minLength={8}
              disabled={disabled}
              aria-invalid={passwordTouched && !s.passwordValid}
              required
            />

            <EyeButton
              type="button"
              onClick={() => s.setShowPassword(!s.showPassword)}
              disabled={disabled}
              aria-label={s.showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {s.showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
            </EyeButton>
          </PasswordInput>

          {passwordTouched && !s.passwordValid && (
            <StatusText data-valid={false} role="alert">
              <CircleAlert />
              {s.form.password.length === 0
                ? "비밀번호를 입력해주세요."
                : "영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요."}
            </StatusText>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="signup-confirm">
            비밀번호 확인
            <EnglishLabel>/ CONFIRMED</EnglishLabel>
          </FieldLabel>

          <PasswordInput>
            <Input
              id="signup-confirm"
              type={s.showConfirm ? "text" : "password"}
              placeholder="비밀번호를 다시 입력해주세요."
              autoComplete="new-password"
              value={s.confirmPassword}
              onChange={(e) => s.setConfirmPassword(e.target.value)}
              onBlur={() => setConfirmTouched(true)}
              disabled={disabled}
              aria-invalid={confirmTouched && !s.passwordMatched}
              required
            />

            <EyeButton
              type="button"
              onClick={() => s.setShowConfirm(!s.showConfirm)}
              disabled={disabled}
              aria-label={
                s.showConfirm ? "비밀번호 확인 숨기기" : "비밀번호 확인 보기"
              }
              aria-pressed={s.showConfirm}
            >
              {s.showConfirm ? <EyeClosed /> : <Eye />}
            </EyeButton>
          </PasswordInput>

          {confirmTouched && !s.passwordMatched && (
            <StatusText data-valid={false} role="alert">
              <CircleAlert />
              {s.confirmPassword.length === 0
                ? "비밀번호를 다시 입력해주세요."
                : "비밀번호가 일치하지 않습니다."}
            </StatusText>
          )}
        </Field>

        <TermsSection>
          <CheckRow data-all="true">
            <input
              type="checkbox"
              checked={s.allAgreed}
              onChange={(e) => s.agreeAll(e.target.checked)}
              disabled={disabled}
            />
            전체 약관 동의
          </CheckRow>

          <CheckRow>
            <input
              type="checkbox"
              checked={s.form.agreeTerms}
              onChange={(e) => s.updateField("agreeTerms", e.target.checked)}
              disabled={disabled}
              required
            />
            [필수] 이용약관에 동의합니다.
          </CheckRow>

          <CheckRow>
            <input
              type="checkbox"
              checked={s.form.agreePrivacy}
              onChange={(e) => s.updateField("agreePrivacy", e.target.checked)}
              disabled={disabled}
              required
            />
            [필수] 개인정보 수집 및 이용에 동의합니다.
          </CheckRow>

          <CheckRow>
            <input
              type="checkbox"
              checked={s.form.agreeMarketing}
              onChange={(e) =>
                s.updateField("agreeMarketing", e.target.checked)
              }
              disabled={disabled}
            />
            [선택] 이벤트 및 마케팅 정보 수신
          </CheckRow>

          <CheckRow>
            <input
              type="checkbox"
              checked={s.form.agreeLocation}
              onChange={(e) => s.updateField("agreeLocation", e.target.checked)}
              disabled={disabled}
            />
            [선택] 위치 기반 서비스 이용
          </CheckRow>
        </TermsSection>

        {s.formMessage && <Message role="alert">{s.formMessage}</Message>}

        <SubmitButton type="submit" disabled={disabled}>
          {s.busy ? "회원가입 처리 중..." : "회원가입"}
        </SubmitButton>
      </Fields>
    </RightContent>
  );
}
