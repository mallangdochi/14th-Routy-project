import { useEffect, useState, type ReactNode, type SubmitEvent } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Eye,
  EyeClosed,
} from "lucide-react";

import routyLogo from "../../assets/루티1.svg";
import DatePicker from "../pickers/DatePicker";
import { checkUsername, signupWithEmail } from "../../api/auth";
import { markProfilePendingAfterSignup } from "../../utils/firstLoginProfile";

import {
  SignupForm,
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
  PageFooter,
  SignupToastBox,
} from "./RoutySignupStyle";

import { SignupContext, useSignup } from "./SignupContext";

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

interface RoutySignupProps {
  side: "left" | "right";
  active: boolean;
  onBack?: () => void;
}

const FORM_ID = "routy-signup-form";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  const middleEnd = digits.length === 11 ? 7 : 6;

  return [
    digits.slice(0, 3),
    digits.slice(3, middleEnd),
    digits.slice(middleEnd),
  ].join("-");
}

function getLocalToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 컴포넌트는 Provider 바깥에 선언합니다.
function SignupErrorToast({ message }: { message: string }) {
  const [dismissedMessage, setDismissedMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDismissedMessage(message);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [message]);

  if (
    !message ||
    dismissedMessage === message ||
    typeof document === "undefined"
  ) {
    return null;
  }

  return createPortal(
    <SignupToastBox role="alert" aria-atomic="true">
      <CircleAlert size={20} aria-hidden="true" />
      <span>{message}</span>
    </SignupToastBox>,
    document.body,
  );
}

function useSignupState({
  onCheckUsername = checkUsername,
  onSendVerification,
  onConfirmVerification,
  onSignup = signupWithEmail,
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

  // 같은 오류로 다시 제출해도 토스트를 새로 표시합니다.
  const [toastVersion, setToastVersion] = useState(0);

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

  const passwordValid =
    form.password.length >= 8 &&
    /[A-Za-z]/.test(form.password) &&
    /\d/.test(form.password) &&
    /[^A-Za-z0-9]/.test(form.password);

  const passwordMatched =
    confirmPassword.length > 0 && form.password === confirmPassword;

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

  const submitSignup = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (busy) return;

    setFormMessage("");
    setToastVersion((prev) => prev + 1);

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

    if (!/^01[016789]\d{7,8}$/.test(form.phone.replace(/\D/g, ""))) {
      setFormMessage("올바른 휴대폰 번호를 입력해주세요.");
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
      const data: SignupData = {
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.replace(/\D/g, ""),
        email: form.email.trim(),
        username: form.username.trim(),
      };

      await onSignup(data);
      markProfilePendingAfterSignup(data.email);
      onCompleted();
    } catch (error) {
      setFormMessage(
        error instanceof Error ? error.message : "회원가입에 실패했습니다.",
      );
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
    toastVersion,
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

export type SignupState = ReturnType<typeof useSignupState>;

export function RoutySignupProvider({ children, ...props }: ProviderProps) {
  const value = useSignupState(props);

  return (
    <SignupContext.Provider value={value}>
      <SignupForm id={FORM_ID} onSubmit={value.submitSignup} hidden>
        <input type="hidden" name="birth" value={value.form.birth} />
      </SignupForm>

      {children}

      {value.formMessage && (
        <SignupErrorToast
          key={value.toastVersion}
          message={value.formMessage}
        />
      )}
    </SignupContext.Provider>
  );
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
                name="firstName"
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
                name="lastName"
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
              modal
              label=""
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
              휴대폰 번호
              <EnglishLabel>/ PHONE</EnglishLabel>
            </FieldLabel>

            <Input
              id="signup-phone"
              name="phone"
              form={FORM_ID}
              type="tel"
              inputMode="tel"
              placeholder="010-0000-0000"
              autoComplete="tel"
              maxLength={13}
              value={formatPhone(s.form.phone)}
              onChange={(event) =>
                s.updateField(
                  "phone",
                  event.target.value.replace(/\D/g, "").slice(0, 11),
                )
              }
              disabled={disabled}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-email">
              이메일
              <EnglishLabel>/ EMAIL</EnglishLabel>
            </FieldLabel>

            <Input
              id="signup-email"
              name="email"
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

  return (
    <RightContent>
      <Fields>
        <Field>
          <FieldLabel htmlFor="signup-username">
            아이디
            <EnglishLabel>/ USERNAME</EnglishLabel>
          </FieldLabel>

          <InputGroup>
            <Input
              id="signup-username"
              name="username"
              form={FORM_ID}
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
              name="password"
              form={FORM_ID}
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
              name="confirmPassword"
              form={FORM_ID}
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
              {s.showConfirm ? <Eye size={20} /> : <EyeClosed size={20} />}
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
              name="agreeTerms"
              form={FORM_ID}
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
              name="agreePrivacy"
              form={FORM_ID}
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
              name="agreeMarketing"
              form={FORM_ID}
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
              name="agreeLocation"
              form={FORM_ID}
              checked={s.form.agreeLocation}
              onChange={(e) => s.updateField("agreeLocation", e.target.checked)}
              disabled={disabled}
            />
            [선택] 위치 기반 서비스 이용
          </CheckRow>
        </TermsSection>

        <SubmitButton type="submit" form={FORM_ID} disabled={disabled}>
          {s.busy ? "회원가입 처리 중..." : "회원가입"}
        </SubmitButton>
      </Fields>
    </RightContent>
  );
}
