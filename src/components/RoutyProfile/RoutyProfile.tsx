import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Pencil, Plane, X } from "lucide-react";

import routyLogo from "../../assets/루티2.svg";
import sampleAvatar from "../../assets/profileimg.png";
import routyMascot from "../../assets/ROUTY2.svg";

import {
  ProfileStage,
  Passport,
  PassportLeft,
  PassportRight,
  CenterSeam,
  StepHeading,
  Eyebrow,
  LeftForm,
  AvatarFrame,
  AvatarImage,
  AvatarEditButton,
  NicknameField,
  NicknameLabel,
  NicknameInputWrap,
  NicknameInput,
  ClearButton,
  HelpLine,
  CharCount,
  MainButton,
  StatusText,
  BrandLogo,
  WelcomeLeft,
  WelcomeRight,
  MiniFlight,
  SelectedCaption,
  TravelerPill,
  StampWrap,
  StampImpact,
  StampImage,
  WelcomeTitle,
  WelcomeSubTitle,
  SecondaryButton,
  MobileLayout,
  MobileTopStripe,
  MobileFooterStripe,
  MobilePage,
  MobileHeader,
  MobileLogo,
  MobileProfileForm,
  MobileProfileHeading,
  MobileAvatarFrame,
  MobileAvatarImage,
  MobileAvatarEditButton,
  MobileNicknameField,
  MobileNicknameLabel,
  MobileNicknameInputWrap,
  MobileNicknameInput,
  MobileClearButton,
  MobileHelpLine,
  MobileCharCount,
  MobileActionButton,
  MobileWelcomePage,
  MobileWelcomeTitle,
  MobileTravelerPill,
  MobileMascot,
  MobilePillText,
  MobileSelectedCaption,
  MobileStatusText,
} from "./RoutyProfileStyle";

type ProfilePayload = {
  nickname: string;
  avatarFile: File | null;
};

interface RoutyProfileProps {
  onSaveProfile?: (profile: ProfilePayload) => void | Promise<void>;
  onFinish?: () => void;
}

export default function RoutyProfile({
  onSaveProfile,
  onFinish,
}: RoutyProfileProps) {
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [screen, setScreen] = useState<"profile" | "welcome">("profile");
  const [nickname, setNickname] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const onSelectAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 선택할 수 있습니다.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("사진은 5MB 이하로 선택해주세요.");
      event.target.value = "";
      return;
    }

    setError("");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    event.target.value = "";
  };

  const onSubmitProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = nickname.trim();

    if (value.length < 2 || value.length > 12) {
      setError("닉네임은 2~12자로 입력해주세요.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await onSaveProfile?.({ nickname: value, avatarFile });
      setNickname(value);
      setScreen("welcome");
    } catch {
      setError("프로필 설정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc = avatarPreview ?? sampleAvatar;

  const avatar = (
    <AvatarFrame>
      <AvatarImage src={avatarSrc} alt="선택한 프로필 사진" />
      {screen === "profile" && (
        <AvatarEditButton
          type="button"
          aria-label="프로필 사진 변경"
          title="프로필 사진 변경"
          onClick={() => imageInputRef.current?.click()}
        >
          <Pencil size={19} strokeWidth={2.3} />
        </AvatarEditButton>
      )}
    </AvatarFrame>
  );

  return (
    <ProfileStage>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={onSelectAvatar}
        aria-label="프로필 사진 선택"
      />
      <Passport data-screen={screen}>
        <CenterSeam aria-hidden="true" />

        <PassportLeft key={`left-${screen}`}>
          {screen === "profile" ? (
            <LeftForm onSubmit={onSubmitProfile}>
              <StepHeading>
                <Eyebrow>여행에서 사용할</Eyebrow>
                프로필을 설정해주세요!
              </StepHeading>

              {avatar}
              <NicknameField>
                <NicknameLabel htmlFor="routy-nickname">닉네임</NicknameLabel>
                <NicknameInputWrap>
                  <NicknameInput
                    id="routy-nickname"
                    type="text"
                    value={nickname}
                    maxLength={12}
                    placeholder="여행에서 사용할 닉네임"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setNickname(e.target.value);
                      setError("");
                    }}
                    autoComplete="nickname"
                    required
                  />
                  {nickname && (
                    <ClearButton
                      type="button"
                      aria-label="닉네임 지우기"
                      onClick={() => setNickname("")}
                    >
                      <X size={17} />
                    </ClearButton>
                  )}
                </NicknameInputWrap>
                <HelpLine>
                  <span>여행 중 다른 여행자에게 표시될 이름이에요.</span>
                  <CharCount>{nickname.length}/12</CharCount>
                </HelpLine>
              </NicknameField>

              {error && <StatusText role="alert">{error}</StatusText>}

              <MainButton type="submit" disabled={loading}>
                {loading ? "설정 중..." : "프로필 설정 완료"}
                <ChevronRight size={19} strokeWidth={2.5} />
              </MainButton>
            </LeftForm>
          ) : (
            <WelcomeLeft>
              <MiniFlight aria-hidden="true">
                <span /> <Plane size={20} /> <span />
              </MiniFlight>
              {avatar}
              <TravelerPill>
                <SelectedCaption>새로운 여행자</SelectedCaption>
                <strong>{nickname}</strong>
              </TravelerPill>
            </WelcomeLeft>
          )}
        </PassportLeft>

        <PassportRight key={`right-${screen}`}>
          {screen === "profile" ? (
            <BrandLogo src={routyLogo} alt="Routy" />
          ) : (
            <WelcomeRight>
              <BrandLogo src={routyLogo} alt="Routy" />
              <StampWrap>
                <StampImpact aria-hidden="true" />
                <StampImage role="img" aria-label="Routy 가입 환영 도장" />
              </StampWrap>
              <WelcomeTitle>
                환영합니다,
                <span>{nickname}님!</span>
              </WelcomeTitle>
              <WelcomeSubTitle>
                Routy와 함께 특별한 여행을 시작해보세요.
              </WelcomeSubTitle>
              <SecondaryButton
                type="button"
                onClick={() => (onFinish ? onFinish() : navigate("/"))}
              >
                여행 시작하기 <ChevronRight size={18} />
              </SecondaryButton>
            </WelcomeRight>
          )}
        </PassportRight>
      </Passport>

      <MobileLayout data-screen={screen}>
        <MobileTopStripe aria-hidden="true" />
        <MobilePage>
          <MobileHeader>
            <MobileLogo src={routyLogo} alt="Routy" draggable={false} />
          </MobileHeader>

          {screen === "profile" ? (
            <MobileProfileForm onSubmit={onSubmitProfile}>
              <MobileProfileHeading>
                <span>여행에서 사용할</span>
                <strong>프로필을 설정해주세요!</strong>
              </MobileProfileHeading>

              <MobileAvatarFrame>
                <MobileAvatarImage src={avatarSrc} alt="프로필 사진" />
                <MobileAvatarEditButton
                  type="button"
                  aria-label="프로필 사진 변경"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Pencil size={20} strokeWidth={2.3} />
                </MobileAvatarEditButton>
              </MobileAvatarFrame>

              <MobileNicknameField>
                <MobileNicknameLabel htmlFor="routy-mobile-nickname">
                  닉네임
                </MobileNicknameLabel>
                <MobileNicknameInputWrap>
                  <MobileNicknameInput
                    id="routy-mobile-nickname"
                    type="text"
                    value={nickname}
                    maxLength={12}
                    placeholder="여행에서 사용할 닉네임"
                    onChange={(event) => {
                      setNickname(event.target.value);
                      setError("");
                    }}
                    autoComplete="nickname"
                    required
                  />
                  {nickname && (
                    <MobileClearButton
                      type="button"
                      aria-label="닉네임 지우기"
                      onClick={() => setNickname("")}
                    >
                      <X size={18} />
                    </MobileClearButton>
                  )}
                </MobileNicknameInputWrap>
                <MobileHelpLine>
                  <span>여행 중에 다른 여행자들에게 보여질 이름이에요.</span>
                  <MobileCharCount>{nickname.length}/12</MobileCharCount>
                </MobileHelpLine>
                {error && (
                  <MobileStatusText role="alert">{error}</MobileStatusText>
                )}
              </MobileNicknameField>

              <MobileActionButton type="submit" disabled={loading}>
                {loading ? "설정 중..." : "다음"}
              </MobileActionButton>
            </MobileProfileForm>
          ) : (
            <MobileWelcomePage>
              <MobileWelcomeTitle>환영합니다!</MobileWelcomeTitle>
              <MobileAvatarFrame>
                <MobileAvatarImage src={avatarSrc} alt="설정한 프로필 사진" />
              </MobileAvatarFrame>
              <MobileTravelerPill>
                <MobileMascot src={routyMascot} alt="" />
                <MobilePillText>
                  <MobileSelectedCaption>선택한 닉네임</MobileSelectedCaption>
                  <strong>{nickname}</strong>
                </MobilePillText>
              </MobileTravelerPill>
              <MobileActionButton
                type="button"
                onClick={() => (onFinish ? onFinish() : navigate("/"))}
              >
                확인
              </MobileActionButton>
            </MobileWelcomePage>
          )}
        </MobilePage>
        <MobileFooterStripe aria-hidden="true" />
      </MobileLayout>
    </ProfileStage>
  );
}
