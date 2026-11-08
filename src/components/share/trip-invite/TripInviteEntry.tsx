import { useId, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
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

    if (isEditor && !trimmedPassword) {
      setLocalError("방 전용 비밀번호를 입력해 주세요.");
      return;
    }
    if (!isEditor && !trimmedName) {
      setLocalError("요청자 이름을 입력해 주세요.");
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
          {/* <S.BrandMark aria-hidden="true">R</S.BrandMark> */}
          <S.BrandName>
            {" "}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 625 229"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M579.014 152.122C572.997 157.048 566.78 160.411 558.84 160.953C530.071 162.92 497.639 156.668 495.424 122.225C494.249 103.969 496.343 84.4702 495.442 66.0799C496.111 61.5391 499.036 57.5781 503.345 55.8852C507.858 54.1134 526.77 54.016 531.199 55.8852C534.245 57.1653 536.404 60.0178 536.771 63.3062C538.475 78.4359 534.793 96.7984 537.365 111.877C541.01 133.264 577.668 132.791 579.507 109.238C580.574 95.56 578.248 80.1381 579.497 66.5576C579.971 61.4278 581.944 56.9056 587.056 55.092C590.998 53.696 606.571 53.8444 611.289 54.2665C618.634 54.9251 624.127 59.9853 624.545 67.462C623.398 95.2771 626.008 124.228 624.545 151.914C622.586 189.019 596.254 217.511 559.676 223.012C541.697 225.716 496.752 225.586 492.313 201.867C491.004 194.854 493.46 182.243 499.654 177.897C507.58 172.331 513.978 178.36 521.444 180.656C534.547 184.687 556.138 185.902 567.838 177.827C576.261 172.015 579.316 162.034 579.019 152.127L579.014 152.122Z"
                fill="#0D3E41"
              />
              <path
                d="M292.899 55.7787C297.863 55.185 312.577 55.0365 316.704 57.2489C319.597 58.7981 320.609 61.5439 320.874 64.6793C322.086 78.7607 319.792 94.5908 320.841 108.774C321.357 115.741 323.966 121.52 331.075 123.598C343.444 127.216 355.122 122.684 356.167 108.774C357.151 95.6669 354.969 80.9453 356.157 67.9492C357.443 53.8677 373.365 54.7304 384.183 55.7091C392.114 56.428 395.044 59.5727 395.638 67.4575C396.604 80.3284 396.26 98.9739 395.638 112.021C394.979 125.884 390.438 140.073 379.373 149.112C367.036 159.196 331.358 158.444 316.133 155.685C269.572 147.243 282.967 102.193 280.91 67.4529C281.574 60.8203 286.436 56.5439 292.899 55.774V55.7787Z"
                fill="#0D3E41"
              />
              <path
                d="M460.619 45.4445C466.641 45.5001 472.812 45.5465 478.713 46.6179C482.205 47.6754 485.186 50.4444 486.179 54.0019C486.941 56.7338 486.959 65.3932 486.62 68.4034C486.059 73.3987 482.191 76.5109 477.446 77.3272C476.48 77.4942 473.192 77.9116 472.459 77.9116H460.619V115.249C460.619 115.717 461.724 118.296 462.086 118.885C466.511 126.065 479.461 119.117 484.22 126.459C486.894 130.587 486.922 144.488 484.995 148.88C481.193 157.526 467.347 156.751 459.439 156.32C435.513 155.016 419.23 144.692 417.883 119.446C417.164 105.926 418.51 91.7936 417.841 78.2085C413.621 75.6204 408.226 78.7187 404.427 74.3124C400.629 69.9062 400.523 53.7282 403.768 49.1875C407.455 44.0345 416.922 46.8359 417.832 45.3796C419.383 33.3389 412.78 12.5321 428.005 7.54143C433.001 5.90416 445.505 5.90416 450.501 7.54143C455.497 9.1787 460.609 14.7445 460.609 20.1711V45.4491L460.619 45.4445Z"
                fill="#0D3E41"
              />
              <path
                d="M404.437 186.44C404.627 185.74 404.251 185.67 403.982 185.28C402.788 183.555 398.981 180.211 397.254 178.55C393.962 175.378 390.256 172.544 387.15 169.167C385.4 164.979 390.568 162.451 393.994 161.95C405.012 165.42 415.213 171.245 426.102 175.192C433.688 173.221 450.696 161.946 457.619 168.342C462.402 172.762 455.186 179.612 451.035 181.741C446.239 184.204 440.565 186.073 435.653 188.411L425.103 224.018C423.682 227.933 416.76 229.185 415.422 224.867C413.245 217.831 413.862 207.794 411.842 200.614C411.703 200.113 411.708 199.756 411.174 199.45L393.4 205.113C391.617 208.954 390.117 219.366 385.52 220.196C376.791 221.778 381.435 210.762 379.118 205.92C355.247 214.57 330.885 221.968 305.686 225.795C214.063 239.709 140.933 207.757 80.0989 141C73.8817 134.177 56.7625 115.717 55.7781 107.317C52.9319 83.0599 76.0315 91.7703 91.1218 89.3863C122.561 84.4188 121.53 39.489 90.8014 37.0864C82.1233 36.4092 64.4933 36.2144 56.0103 37.1513C49.691 37.8517 44.7506 41.8823 43.302 48.1113C41.6537 89.0848 43.7477 130.383 42.2341 171.347C39.1742 182.72 24.5297 181.978 15.0763 181.37C6.8115 180.832 0.877555 176.792 0 168.142V41.9472C2.40979 11.9939 23.9122 1.59517 51.3068 0.435634C64.7673 -0.13486 81.074 -0.158051 94.5252 0.435634C122.839 1.6833 148.325 11.0941 155.531 41.0706C163.202 72.9765 150.322 98.0504 121.056 111.385C119.347 112.164 113.195 113.973 112.373 114.766C111.728 115.392 111.816 116.176 112.021 116.983C112.304 118.097 119.57 125.986 120.968 127.544C179.834 193.026 248.757 228.745 339.056 211.342C351.76 208.893 364.543 205.79 376.568 201.05C373.481 198.058 366.767 192.91 374.386 190.512C378.844 189.111 383.38 193.722 387.912 193.856L404.437 186.435V186.44Z"
                fill="#0D3E41"
              />
              <path
                d="M216.296 43.2645C250.112 41.4139 277.038 66.0889 272.051 100.819C269.446 118.983 248.046 144.441 235.663 158.161C233.137 160.963 225.824 169.344 222.876 170.434C215.526 173.152 210.72 166.45 206.16 161.644C194.46 149.316 170.97 121.761 167.488 105.657C160.462 73.1668 183.627 45.0502 216.292 43.2645H216.296ZM239.052 94.9476C239.052 84.1128 230.258 75.3282 219.412 75.3282C208.565 75.3282 199.771 84.1128 199.771 94.9476C199.771 105.782 208.565 114.567 219.412 114.567C230.258 114.567 239.052 105.782 239.052 94.9476Z"
                fill="#EB654B"
              />
            </svg>
          </S.BrandName>
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
                      편집자로 참여하려면 Routy 로그인 후 방 전용 비밀번호를
                      확인해야 해요.
                    </S.StepDescription>
                    <S.PrimaryButton
                      type="button"
                      disabled={!onLogin}
                      onClick={onLogin}
                    >
                      로그인하고 계속하기
                      {/* <ArrowRight size={17} /> */}
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
                        : "비밀번호 없이 입장을 요청할 수 있어요."}
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
