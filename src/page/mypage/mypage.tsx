import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import Settings, {
  type SettingsData,
} from "../../components/settings/settings";
import Sidebar from "../../components/mysidebar/mysidebar";
import Support from "../../components/support/support";
import profileAvatar from "../../assets/routy-mascot.png";
import avatarP1 from "../../assets/profileAvatars/P1.webp";
import avatarP2 from "../../assets/profileAvatars/P2.webp";
import avatarP3 from "../../assets/profileAvatars/P3.webp";
import avatarP7 from "../../assets/profileAvatars/P7.webp";
import avatarP8 from "../../assets/profileAvatars/P8.webp";
import avatarP9 from "../../assets/profileAvatars/P9.webp";
import avatarP10 from "../../assets/profileAvatars/p10.webp";
import avatarP11 from "../../assets/profileAvatars/P11.webp";
import avatarP12 from "../../assets/profileAvatars/P12.webp";
import avatarP13 from "../../assets/profileAvatars/P13.webp";
import * as S from "./myPageStyle";

type PageId = "profile" | "security" | "settings" | "support";
type PasswordFieldId = "current" | "new" | "confirm";

type ProfileData = {
  nickname: string;
  image: string;
};

type AccountData = {
  name: string;
  phone: string;
  email: string;
};

const initialProfile: ProfileData = {
  nickname: "홍길동",
  image: profileAvatar,
};

const initialAccount: AccountData = {
  name: "김나은",
  phone: "010-1234-5678",
  email: "naeun@example.com",
};

const initialSettings: SettingsData = {
  inviteNotifications: true,
  itineraryNotifications: true,
  tripStartNotifications: false,
  locationServiceAllowed: true,
  marketingAllowed: false,
  defaultItineraryView: "schedule",
};

const passwordFields = [
  {
    id: "current",
    label: "현재 비밀번호",
    placeholder: "현재 비밀번호를 입력해 주세요.",
    autoComplete: "current-password",
  },
  {
    id: "new",
    label: "새 비밀번호",
    placeholder: "새 비밀번호를 입력해 주세요.",
    autoComplete: "new-password",
  },
  {
    id: "confirm",
    label: "새 비밀번호 확인",
    placeholder: "새 비밀번호를 다시 입력해 주세요.",
    autoComplete: "new-password",
  },
] as const;

const defaultAvatars = [
  avatarP1,
  avatarP2,
  avatarP3,
  avatarP7,
  avatarP8,
  avatarP9,
  avatarP10,
  avatarP11,
  avatarP12,
  avatarP13,
];

const pageText: Record<PageId, { title: string; description: string }> = {
  profile: {
    title: "프로필 관리",
    description: "나의 프로필을 관리해요.",
  },
  security: {
    title: "계정 및 보안",
    description: "계정 정보를 안전하게 관리하세요.",
  },
  settings: {
    title: "설정",
    description: "설정을 관리해요.",
  },
  support: {
    title: "고객지원",
    description: "필요한 도움을 빠르게 찾아보세요.",
  },
};

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-****-${digits.slice(-4)}`;
  }

  return phone;
}

function maskEmail(email: string) {
  const atIndex = email.indexOf("@");

  if (atIndex < 1) return email;

  return `${email[0]}***${email.slice(atIndex)}`;
}

type ProfileViewProps = {
  savedProfile: ProfileData;
  onSave: (profile: ProfileData) => void;
};

function ProfileView({ savedProfile, onSave }: ProfileViewProps) {
  const [nickname, setNickname] = useState(savedProfile.nickname);
  const [profileImage, setProfileImage] = useState(savedProfile.image);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [nameError, setNameError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing =
    nickname !== savedProfile.nickname || profileImage !== savedProfile.image;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImageError("JPG, PNG, WEBP 이미지만 선택할 수 있어요.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("5MB 이하의 이미지를 선택해 주세요.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
        setImageError("");
      }
    };

    reader.onerror = () => {
      setImageError("이미지를 불러오지 못했어요.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleOpenPicker = () => {
    setSelectedAvatar(
      defaultAvatars.find((avatar) => avatar === profileImage) ?? null,
    );
    setIsPickerOpen(true);
  };

  const handleReset = () => {
    setNickname(savedProfile.nickname);
    setProfileImage(savedProfile.image);
    setImageError("");
    setNameError("");
  };

  const handleSave = () => {
    const trimmed = nickname.trim();

    if (trimmed.length < 2 || trimmed.length > 20) {
      setNameError("이름은 2~20자로 입력해 주세요.");
      return;
    }

    setNickname(trimmed);
    setNameError("");
    onSave({ nickname: trimmed, image: profileImage });
  };

  return (
    <S.ProfileCard>
      <S.CardTitle>프로필 정보</S.CardTitle>

      <S.ProfileContent>
        <S.ImageColumn>
          <S.ProfileImage src={profileImage} alt="프로필 이미지 미리보기" />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={handleFileChange}
          />

          <S.ImageChangeButton
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={22} strokeWidth={2} aria-hidden="true" />
            이미지 변경
          </S.ImageChangeButton>

          <S.DefaultImageButton type="button" onClick={handleOpenPicker}>
            기본 이미지로 변경
          </S.DefaultImageButton>

          <S.ImageHelp>JPG, PNG, WEBP · 최대 5MB</S.ImageHelp>

          {imageError && <S.ImageError role="alert">{imageError}</S.ImageError>}
        </S.ImageColumn>

        <S.InputColumn>
          <S.FieldLabel htmlFor="profile-nickname">이름</S.FieldLabel>

          <S.InputBox>
            <S.NameInput
              id="profile-nickname"
              value={nickname}
              maxLength={20}
              onChange={(event) => {
                setNickname(event.target.value);
                setNameError("");
              }}
            />
            <S.CharacterCount>{nickname.length}/20</S.CharacterCount>
          </S.InputBox>

          <S.InputHelp>2~20자로 입력해 주세요.</S.InputHelp>

          {nameError && <S.NameError role="alert">{nameError}</S.NameError>}
        </S.InputColumn>
      </S.ProfileContent>

      <S.ActionRow>
        {isEditing && (
          <S.CancelButton type="button" onClick={handleReset}>
            초기화
          </S.CancelButton>
        )}

        <S.SaveButton type="button" onClick={handleSave}>
          변경사항 저장
        </S.SaveButton>
      </S.ActionRow>

      {isPickerOpen && (
        <S.AvatarModalBackdrop>
          <S.AvatarModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="avatar-modal-title"
          >
            <S.AvatarModalHeader>
              <S.AvatarModalTitle id="avatar-modal-title">
                기본 프로필 이미지 선택
              </S.AvatarModalTitle>
            </S.AvatarModalHeader>

            <S.AvatarModalHelp>
              사용할 프로필 이미지를 선택해 주세요.
            </S.AvatarModalHelp>

            <S.AvatarGrid>
              {defaultAvatars.map((avatar, index) => (
                <S.AvatarOption
                  key={avatar}
                  type="button"
                  $selected={selectedAvatar === avatar}
                  aria-label={`기본 이미지 ${index + 1} 선택`}
                  aria-pressed={selectedAvatar === avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <img src={avatar} alt="" />
                </S.AvatarOption>
              ))}
            </S.AvatarGrid>

            <S.AvatarModalFooter>
              <S.ModalConfirmButton
                type="button"
                onClick={() => {
                  if (selectedAvatar) {
                    setProfileImage(selectedAvatar);
                    setImageError("");
                  }
                  setIsPickerOpen(false);
                }}
              >
                확인
              </S.ModalConfirmButton>
            </S.AvatarModalFooter>
          </S.AvatarModal>
        </S.AvatarModalBackdrop>
      )}
    </S.ProfileCard>
  );
}

type BasicInfoCardProps = {
  account: AccountData;
  editing: boolean;
  onEdit: () => void;
  onSave: (account: AccountData) => void;
};

function BasicInfoCard({
  account,
  editing,
  onEdit,
  onSave,
}: BasicInfoCardProps) {
  const [draft, setDraft] = useState<AccountData>(account);

  const fields = [
    { id: "name", label: "이름", type: "text" },
    { id: "phone", label: "핸드폰번호", type: "tel" },
    { id: "email", label: "이메일", type: "email" },
  ] as const;

  const displayValue: AccountData = {
    name: account.name,
    phone: maskPhone(account.phone),
    email: maskEmail(account.email),
  };

  return (
    <S.SecurityCard>
      <S.SecurityCardHeader>
        <S.SecurityCardTitle>기본 정보</S.SecurityCardTitle>

        <S.SecurityActionButton
          type="button"
          onClick={() => {
            if (editing) {
              onSave(draft);
            } else {
              onEdit();
            }
          }}
        >
          {editing ? "저장" : "수정"}
        </S.SecurityActionButton>
      </S.SecurityCardHeader>

      <S.SecurityInfoList>
        {fields.map((field) => (
          <S.SecurityInfoRow key={field.id}>
            <S.SecurityInfoLabel
              htmlFor={editing ? `account-${field.id}` : undefined}
            >
              {field.label}
            </S.SecurityInfoLabel>

            {editing ? (
              <S.SecurityInput
                id={`account-${field.id}`}
                type={field.type}
                value={draft[field.id]}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    [field.id]: event.target.value,
                  }))
                }
              />
            ) : (
              <S.SecurityInfoValue>
                {displayValue[field.id]}
              </S.SecurityInfoValue>
            )}
          </S.SecurityInfoRow>
        ))}
      </S.SecurityInfoList>
    </S.SecurityCard>
  );
}

type PasswordEditViewProps = {
  onBack: () => void;
};

function PasswordEditView({ onBack }: PasswordEditViewProps) {
  const [passwords, setPasswords] = useState<Record<PasswordFieldId, string>>({
    current: "",
    new: "",
    confirm: "",
  });
  const [visible, setVisible] = useState<Record<PasswordFieldId, boolean>>({
    current: false,
    new: false,
    confirm: false,
  });
  const [showNotice, setShowNotice] = useState(false);

  const toggleVisibility = (id: PasswordFieldId) => {
    setVisible((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  return (
    <S.SecurityCard>
      <S.SecurityCardHeader>
        <S.SecurityCardTitle>비밀번호 변경</S.SecurityCardTitle>
      </S.SecurityCardHeader>

      <S.PasswordDescription>
        계정 보안을 위해 비밀번호를 변경할 수 있어요.
      </S.PasswordDescription>

      <S.PasswordForm
        onSubmit={(event) => {
          event.preventDefault();
          setShowNotice(true);
        }}
      >
        {passwordFields.map((field) => (
          <S.PasswordRow key={field.id}>
            <S.PasswordLabel htmlFor={`password-${field.id}`}>
              {field.label}
            </S.PasswordLabel>

            <S.PasswordInputWrapper>
              <S.PasswordInput
                id={`password-${field.id}`}
                name={`password-${field.id}`}
                type={visible[field.id] ? "text" : "password"}
                value={passwords[field.id]}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                spellCheck={false}
                required
                onChange={(event) => {
                  setPasswords((previous) => ({
                    ...previous,
                    [field.id]: event.target.value,
                  }));
                  setShowNotice(false);
                }}
              />

              <S.PasswordVisibilityButton
                type="button"
                aria-label={`${field.label} ${
                  visible[field.id] ? "숨기기" : "표시"
                }`}
                aria-pressed={visible[field.id]}
                onClick={() => toggleVisibility(field.id)}
              >
                {visible[field.id] ? (
                  <EyeOff size={21} strokeWidth={1.8} aria-hidden="true" />
                ) : (
                  <Eye size={21} strokeWidth={1.8} aria-hidden="true" />
                )}
              </S.PasswordVisibilityButton>
            </S.PasswordInputWrapper>
          </S.PasswordRow>
        ))}

        {showNotice && (
          <S.PasswordNotice role="status">
            현재는 화면 시안으로 실제 비밀번호가 변경되지 않습니다.
          </S.PasswordNotice>
        )}

        <S.PasswordActionRow>
          <S.PasswordCancelButton type="button" onClick={onBack}>
            취소
          </S.PasswordCancelButton>
          <S.PasswordSubmitButton type="submit">
            변경하기
          </S.PasswordSubmitButton>
        </S.PasswordActionRow>
      </S.PasswordForm>
    </S.SecurityCard>
  );
}

type SecurityViewProps = {
  account: AccountData;
  editingAccount: boolean;
  onEditAccount: () => void;
  onSaveAccount: (account: AccountData) => void;
  onChangePassword: () => void;
  onWithdraw: () => void;
};

function SecurityView({
  account,
  editingAccount,
  onEditAccount,
  onSaveAccount,
  onChangePassword,
  onWithdraw,
}: SecurityViewProps) {
  return (
    <S.SecurityContent>
      <BasicInfoCard
        account={account}
        editing={editingAccount}
        onEdit={onEditAccount}
        onSave={onSaveAccount}
      />

      <S.SecuritySimpleCard>
        <S.SecuritySimpleText>
          <S.SecurityCardTitle>비밀번호</S.SecurityCardTitle>
          <S.SecurityCardDescription>
            계정 보안을 위해 비밀번호를 변경할 수 있어요.
          </S.SecurityCardDescription>
        </S.SecuritySimpleText>

        <S.SecurityActionButton type="button" onClick={onChangePassword}>
          수정
        </S.SecurityActionButton>
      </S.SecuritySimpleCard>

      <S.SecuritySimpleCard>
        <S.SecuritySimpleText>
          <S.SecurityCardTitle>계정 삭제</S.SecurityCardTitle>
          <S.SecurityCardDescription>
            탈퇴 전 여행 데이터 처리 내용을 확인해 주세요.
          </S.SecurityCardDescription>
        </S.SecuritySimpleText>

        <S.WithdrawButton type="button" onClick={onWithdraw}>
          회원 탈퇴
        </S.WithdrawButton>
      </S.SecuritySimpleCard>
    </S.SecurityContent>
  );
}

export default function MyPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const pathParts = pathname.split("/");
  const section = pathParts[2];
  const detail = pathParts[3];

  const [savedProfile, setSavedProfile] = useState<ProfileData>(initialProfile);
  const [account, setAccount] = useState<AccountData>(initialAccount);
  const [toastVersion, setToastVersion] = useState(0);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const [savedSettings, setSavedSettings] =
    useState<SettingsData>(initialSettings);

  useEffect(() => {
    if (toastVersion === 0) return;

    const timer = window.setTimeout(() => setToastVersion(0), 2500);
    return () => window.clearTimeout(timer);
  }, [toastVersion]);

  const showSavedToast = () => {
    setToastVersion((version) => version + 1);
  };

  const currentPage: PageId =
    section === "security" || section === "settings" || section === "support"
      ? section
      : "profile";

  const { title, description } = pageText[currentPage];

  const renderContent = () => {
    if (currentPage === "profile") {
      return (
        <ProfileView
          savedProfile={savedProfile}
          onSave={(nextProfile) => {
            setSavedProfile(nextProfile);
            showSavedToast();
          }}
        />
      );
    }

    if (currentPage === "security") {
      if (detail === "password") {
        return <PasswordEditView onBack={() => navigate("/mypage/security")} />;
      }

      return (
        <SecurityView
          key={detail ?? "overview"}
          account={account}
          editingAccount={detail === "edit"}
          onEditAccount={() => navigate("/mypage/security/edit")}
          onSaveAccount={(next) => {
            setAccount(next);
            navigate("/mypage/security");
            showSavedToast();
          }}
          onChangePassword={() => navigate("/mypage/security/password")}
          onWithdraw={() => setIsWithdrawOpen(true)}
        />
      );
    }

    if (currentPage === "settings") {
      return (
        <Settings
          savedSettings={savedSettings}
          onSave={(nextSettings) => {
            setSavedSettings(nextSettings);
            showSavedToast();
          }}
        />
      );
    }

    if (currentPage === "support") {
      return <Support />;
    }

    return (
      <S.EmptyCard>이 화면은 다음 단계에서 추가할 예정이에요.</S.EmptyCard>
    );
  };

  return (
    <S.PageLayout>
      <Sidebar
        profileName={savedProfile.nickname}
        profileImage={savedProfile.image}
        onNavigate={(page) => navigate(`/mypage/${page}`)}
        onBack={() => navigate("/")}
        onLogout={() => navigate("/")}
      />

      <S.PageMain>
        <S.MainInner>
          {currentPage !== "settings" && (
            <S.PageHeader>
              <S.PageTitle
                $green={currentPage === "profile" || currentPage === "support"}
              >
                {title}
              </S.PageTitle>
              <S.PageDescription>{description}</S.PageDescription>
            </S.PageHeader>
          )}

          {renderContent()}
        </S.MainInner>
      </S.PageMain>

      {toastVersion > 0 && (
        <S.SaveToast role="status">저장되었습니다.</S.SaveToast>
      )}

      {isWithdrawOpen && (
        <S.AvatarModalBackdrop>
          <S.WithdrawConfirmDialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-title"
            aria-describedby="withdraw-description"
          >
            <S.WithdrawConfirmTitle id="withdraw-title">
              정말 계정을 삭제하시겠습니까?
            </S.WithdrawConfirmTitle>

            <S.WithdrawConfirmDescription id="withdraw-description">
              회원 탈퇴 여부를 선택해 주세요.
            </S.WithdrawConfirmDescription>

            <S.WithdrawConfirmActions>
              <S.WithdrawYesButton type="button">네</S.WithdrawYesButton>
              <S.WithdrawNoButton
                type="button"
                onClick={() => setIsWithdrawOpen(false)}
              >
                아니요
              </S.WithdrawNoButton>
            </S.WithdrawConfirmActions>
          </S.WithdrawConfirmDialog>
        </S.AvatarModalBackdrop>
      )}
    </S.PageLayout>
  );
}
