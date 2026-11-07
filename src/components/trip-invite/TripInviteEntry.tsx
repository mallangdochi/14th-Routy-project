import { useId, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  Pencil,
  RefreshCw,
  ShieldCheck,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import mascot from "../../assets/go.webp";
import * as S from "./TripInviteEntryStyle";

export type InvitePermission = "editor" | "viewer";

export type InviteAccessStatus =
  | "ready"
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "invalid";

export type InviteRequestInput = {
  permission: InvitePermission;
  /** 편집자 전용. 서버에서 비밀번호 검증이 필요합니다. */
  password?: string;
  /** 보기 전용 요청에 표시할 이름. 인증 수단으로 사용하면 안 됩니다. */
  displayName?: string;
};

export type TripInviteEntryProps = {
  tripName: string;
  permission: InvitePermission;
  /** 서버가 검증한 초대 상태를 전달합니다. */
  status?: InviteAccessStatus;
  /** 편집자 초대에만 필요. 로그인 상태는 서버 세션 기준으로 전달합니다. */
  isLoggedIn?: boolean;
  /** 보기 전용 사용자의 이름 초기값. */
  requesterName?: string;
  /** 초대 요청 API를 연결합니다. 성공 시 승인 대기 UI가 표시됩니다. */
  onRequestAccess: (input: InviteRequestInput) => Promise<void> | void;
  onLogin?: () => void;
  onCheckStatus?: () => Promise<void> | void;
  onEnterTrip?: () => void;
  onRetry?: () => Promise<void> | void;
  onBack?: () => void;
  /** 서버에서 받은 오류 메시지. */
  errorMessage?: string | null;
};

/**
 * URL의 초대 토큰 검증, 만료 확인, 권한 부여는 서버/상위 페이지가 담당합니다.
 * 이 컴포넌트는 수신자용 UI와 폼 상호작용만 담당합니다.
 *
 * 위치 예시: src/components/invite/TripInviteEntry.tsx
 */
export default function TripInviteEntry(props: TripInviteEntryProps) {
  const identity = `${props.tripName}:${props.permission}`;
  return <InviteEntryContent key={identity} {...props} />;
}

function InviteEntryContent({
  tripName,
  permission,
  status = "ready",
  isLoggedIn = false,
  requesterName = "",
  onRequestAccess,
  onLogin,
  onCheckStatus,
  onEnterTrip,
  onRetry,
  onBack,
  errorMessage,
}: TripInviteEntryProps) {
  const nameId = useId();
  const passwordId = useId();
  const errorId = useId();
  const [displayName, setDisplayName] = useState(requesterName);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requested, setRequested] = useState(false);
  const [working, setWorking] = useState(false);
  const [checking, setChecking] = useState(false);
  const [localError, setLocalError] = useState("");

  // 서버 응답이 있으면 서버 상태가 우선입니다. 승인 완료는 UI가 임의로 결정하지 않습니다.
  const currentStatus: InviteAccessStatus =
    status === "ready" && requested ? "pending" : status;
  const isEditor = permission === "editor";
  const isBlocked = currentStatus === "expired" || currentStatus === "invalid";
  const isReady = currentStatus === "ready";
  const needsLogin = isReady && isEditor && !isLoggedIn;
  const visibleError = localError || errorMessage;

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (working || checking || !isReady || needsLogin) return;

    setLocalError("");
    const trimmedName = displayName.trim();
    const trimmedPassword = password.trim();

    if (!isEditor && (!trimmedName || trimmedName.length > 30)) {
      setLocalError("이름을 1~30자로 입력해 주세요.");
      return;
    }
    if (isEditor && !trimmedPassword) {
      setLocalError("방 전용 비밀번호를 입력해 주세요.");
      return;
    }

    setWorking(true);
    try {
      await onRequestAccess(
        isEditor
          ? { permission: "editor", password: trimmedPassword }
          : { permission: "viewer", displayName: trimmedName },
      );
      setPassword("");
      setRequested(true);
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : "입장 요청을 보내지 못했어요. 다시 시도해 주세요.",
      );
    } finally {
      setWorking(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!onCheckStatus || checking) return;
    setChecking(true);
    setLocalError("");
    try {
      await onCheckStatus();
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : "승인 상태를 확인하지 못했어요.",
      );
    } finally {
      setChecking(false);
    }
  };

  const handleRetry = async () => {
    if (!onRetry || working) return;
    setWorking(true);
    setLocalError("");
    try {
      await onRetry();
      setRequested(false);
      // 상위 페이지가 status를 ready로 갱신하면 입력 화면을 다시 표시합니다.
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : "요청을 다시 시작하지 못했어요.",
      );
    } finally {
      setWorking(false);
    }
  };

  return (
    <S.Page>
      <S.Container>
        <S.BrandBar>
          <S.BrandMark aria-hidden="true">R</S.BrandMark>
          <S.BrandName>Routy</S.BrandName>
          <S.BrandDivider aria-hidden="true" />
          <S.BrandDescription>함께 만드는 여행 일정</S.BrandDescription>
        </S.BrandBar>

        <S.Card>
          <S.Banner>
            <S.BannerContent>
              <S.BannerEyebrow>ROUTY TRIP INVITATION</S.BannerEyebrow>
              <h1>
                {isBlocked
                  ? "초대 링크를 확인해 주세요"
                  : "여행에 초대되었어요!"}
              </h1>
              <p>
                {isBlocked
                  ? "초대 링크가 유효하지 않거나 만료되었어요."
                  : "함께 여행을 계획해 보세요"}
              </p>
            </S.BannerContent>
            <S.BannerMascot src={mascot} alt="" aria-hidden="true" />
          </S.Banner>

          <S.CardBody>
            {!isBlocked && (
              <S.TripSummary>
                <S.SummaryIcon aria-hidden="true">
                  <MapPin size={21} />
                </S.SummaryIcon>
                <S.TripSummaryText>
                  <S.TripSummaryLabel>초대받은 여행</S.TripSummaryLabel>
                  <S.TripName title={tripName}>{tripName}</S.TripName>
                  <S.PermissionLine>
                    {isEditor ? <Pencil size={13} /> : <Eye size={14} />}
                    {isEditor
                      ? "편집자 · 일정 확인 및 수정"
                      : "보기 전용 · 일정 확인만 가능"}
                  </S.PermissionLine>
                </S.TripSummaryText>
                <S.PermissionPill $editor={isEditor}>
                  {isEditor ? "편집자" : "보기 전용"}
                </S.PermissionPill>
              </S.TripSummary>
            )}

            {isReady && (
              <>
                {needsLogin ? (
                  <S.StepContent>
                    <S.StepIcon aria-hidden="true">
                      <UserRound size={27} />
                    </S.StepIcon>
                    <S.StepTitle>로그인이 필요해요</S.StepTitle>
                    <S.StepDescription>
                      편집자로 참여하려면 로그인 후 방 전용 비밀번호를 입력해주세요.
                    </S.StepDescription>
                    <S.PrimaryButton
                      type="button"
                      disabled={!onLogin}
                      onClick={onLogin}
                    >
                      로그인하고 계속하기
                      <ChevronRight size={17} />
                    </S.PrimaryButton>
                  </S.StepContent>
                ) : (
                  <S.RequestForm
                    onSubmit={(event) => void handleRequest(event)}
                  >
                    <S.FormTitle>
                      {isEditor ? (
                        <KeyRound size={18} />
                      ) : (
                        <UsersRound size={18} />
                      )}
                      {isEditor
                        ? "방 전용 비밀번호 확인"
                        : "방장에게 입장 요청"}
                    </S.FormTitle>
                    <S.FormDescription>
                      {isEditor
                        ? "소유자로부터 전달받은 비밀번호를 입력해 주세요."
                        : "로그인·비밀번호 없이 이름을 입력해 승인을 요청해주세요."}
                    </S.FormDescription>

                    {isEditor ? (
                      <S.FieldGroup>
                        <S.FieldLabel htmlFor={passwordId}>
                          방 전용 비밀번호
                        </S.FieldLabel>
                        <S.PasswordField>
                          <S.TextInput
                            id={passwordId}
                            type={showPassword ? "text" : "password"}
                            autoComplete="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            maxLength={80}
                            placeholder="비밀번호를 입력해 주세요"
                            value={password}
                            disabled={working}
                            aria-invalid={Boolean(visibleError)}
                            aria-describedby={
                              visibleError ? errorId : undefined
                            }
                            onChange={(event) => {
                              setPassword(event.target.value);
                              setLocalError("");
                            }}
                          />
                          <S.VisibilityButton
                            type="button"
                            aria-label={
                              showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                            }
                            title={
                              showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                            }
                            onClick={() =>
                              setShowPassword((previous) => !previous)
                            }
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </S.VisibilityButton>
                        </S.PasswordField>
                      </S.FieldGroup>
                    ) : (
                      <S.FieldGroup>
                        <S.FieldLabel htmlFor={nameId}>
                          요청자 이름
                        </S.FieldLabel>
                        <S.TextInput
                          id={nameId}
                          type="text"
                          required
                          autoComplete="name"
                          maxLength={30}
                          placeholder="이름을 입력해 주세요"
                          value={displayName}
                          disabled={working}
                          aria-invalid={Boolean(visibleError)}
                          aria-describedby={visibleError ? errorId : undefined}
                          onChange={(event) => {
                            setDisplayName(event.target.value);
                            setLocalError("");
                          }}
                        />
                      </S.FieldGroup>
                    )}

                    <S.PrimaryButton type="submit" disabled={working}>
                      {working ? (
                        <LoaderCircle size={18} className="spin" />
                      ) : (
                        <ShieldCheck size={18} />
                      )}
                      {working ? "요청 중…" : "방장에게 입장 요청하기"}
                    </S.PrimaryButton>
                    <S.SubtleInfo>
                      <LockKeyhole size={13} /> 방장 승인 전에는 여행에 접근할
                      수 없어요.
                    </S.SubtleInfo>
                  </S.RequestForm>
                )}
              </>
            )}

            {currentStatus === "pending" && (
              <S.StatusContent>
                <S.StatusIcon $tone="pending">
                  <Clock3 size={30} />
                </S.StatusIcon>
                <S.StepTitle>방장의 승인을 기다리고 있어요</S.StepTitle>
                <S.StepDescription>
                  입장 요청이 전달되었어요. 방장이 요청한 여행과 권한을 확인한
                  후 승인하면 참여할 수 있어요.
                </S.StepDescription>
                <S.PendingInfo>
                  <Clock3 size={16} /> 승인 대기 중
                </S.PendingInfo>
                {onCheckStatus && (
                  <S.SecondaryButton
                    type="button"
                    disabled={checking}
                    onClick={() => void handleCheckStatus()}
                  >
                    {checking ? (
                      <LoaderCircle size={16} className="spin" />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                    {checking ? "확인 중…" : "승인 상태 확인하기"}
                  </S.SecondaryButton>
                )}
              </S.StatusContent>
            )}

            {currentStatus === "approved" && (
              <S.StatusContent>
                <S.StatusIcon $tone="success">
                  <CheckCircle2 size={32} />
                </S.StatusIcon>
                <S.StepTitle>여행 참여가 승인되었어요!</S.StepTitle>
                <S.StepDescription>
                  {isEditor
                    ? "이제 여행 일정을 확인하고 수정할 수 있어요."
                    : "이제 여행 일정을 확인할 수 있어요."}
                </S.StepDescription>
                {onEnterTrip && (
                  <S.PrimaryButton type="button" onClick={onEnterTrip}>
                    여행 일정 확인하기
                    <ChevronRight size={17} />
                  </S.PrimaryButton>
                )}
              </S.StatusContent>
            )}

            {currentStatus === "rejected" && (
              <S.StatusContent>
                <S.StatusIcon $tone="danger">
                  <XCircle size={32} />
                </S.StatusIcon>
                <S.StepTitle>입장 요청이 거절되었어요</S.StepTitle>
                <S.StepDescription>
                  현재 이 여행에 참여할 수 없어요. 필요한 경우 여행 소유자에게
                  문의해 주세요.
                </S.StepDescription>
                {onRetry && (
                  <S.SecondaryButton
                    type="button"
                    disabled={working}
                    onClick={() => void handleRetry()}
                  >
                    <RefreshCw size={16} /> 다시 요청하기
                  </S.SecondaryButton>
                )}
              </S.StatusContent>
            )}

            {isBlocked && (
              <S.StatusContent>
                <S.StatusIcon $tone="danger">
                  <AlertCircle size={32} />
                </S.StatusIcon>
                <S.StepTitle>
                  {currentStatus === "expired"
                    ? "초대 링크가 만료되었어요"
                    : "유효하지 않은 초대 링크예요"}
                </S.StepTitle>
                <S.StepDescription>
                  {currentStatus === "expired"
                    ? "초대 링크는 발급 후 72시간 동안 유효해요. 여행 소유자에게 새로운 링크를 요청해 주세요."
                    : "초대 링크를 다시 확인하거나 여행 소유자에게 문의해 주세요."}
                </S.StepDescription>
              </S.StatusContent>
            )}

            {visibleError && (
              <S.ErrorMessage id={errorId} role="alert">
                <AlertCircle size={15} /> {visibleError}
              </S.ErrorMessage>
            )}

            <S.CardFooter>
              {onBack && (
                <S.BackButton type="button" onClick={onBack}>
                  <ChevronLeft size={16} />
                  돌아가기
                </S.BackButton>
              )}
              <S.FooterNotice>
                <ShieldCheck size={14} /> Routy의 안전한 여행 공유
              </S.FooterNotice>
            </S.CardFooter>
          </S.CardBody>
        </S.Card>
        <S.PageFootnote>초대 링크 유효기간 · 발급 후 72시간</S.PageFootnote>
      </S.Container>
    </S.Page>
  );
}
