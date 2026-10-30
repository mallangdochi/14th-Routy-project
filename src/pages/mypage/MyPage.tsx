import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";

import { useLocation, useNavigate } from "react-router";

import {
  Image as ImageIcon,
  ChevronLeft,
  Menu,
  CircleAlert,
} from "lucide-react";

import Settings from "../../components/settings/settings";
import Sidebar from "../../components/mysidebar/mysidebar";
import Support from "../../components/support/support";

import MyLoginRequired from "../../components/emptyUI/myLoginRequired/MyLoginRequired";

import { useAuth } from "../../contexts/AuthContext";

import {
  completeInitialProfile,
  getCurrentUser,
  type AuthUser,
  type ProfileSaveOptions,
} from "../../api/auth";

import {
  DEFAULT_SETTINGS,
  MyPageApiError,
  changePassword,
  formatPhone,
  saveAccount,
  saveSettings,
  withdrawAccount,
  type MyPageSettings,
} from "../../api/mypage";

import profileAvatar from "../../assets/profile.webp";
import routyLogo from "../../assets/routy-logo.svg";

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

interface ProfileData {
  nickname: string;
  image: string;
}

interface AccountData {
  name: string;
  phone: string;
  email: string;
}

const DEFAULT_PROFILE_IMAGES: Record<string, string> = {
  P1: avatarP1,
  P2: avatarP2,
  P3: avatarP3,
  P7: avatarP7,
  P8: avatarP8,
  P9: avatarP9,
  P10: avatarP10,
  P11: avatarP11,
  P12: avatarP12,
  P13: avatarP13,
};

const defaultAvatars = Object.entries(DEFAULT_PROFILE_IMAGES);

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

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function resolveProfileImage(avatarUrl?: string | null): string {
  if (!avatarUrl) {
    return profileAvatar;
  }

  if (avatarUrl.startsWith("default:")) {
    const avatarId = avatarUrl.slice("default:".length);

    return DEFAULT_PROFILE_IMAGES[avatarId] ?? profileAvatar;
  }

  if (avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }

  return profileAvatar;
}

function getProfileData(user: AuthUser): ProfileData {
  return {
    nickname: user.username ?? "",
    image: resolveProfileImage(user.avatarUrl),
  };
}

function getAccountData(user: AuthUser): AccountData {
  return {
    name: user.fullName ?? `${user.lastName ?? ""}${user.firstName ?? ""}`,
    phone: user.phone ?? "",
    email: user.email ?? "",
  };
}

function getSettingsData(user: AuthUser): MyPageSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...user.settings,

    locationServiceAllowed:
      user.settings?.locationServiceAllowed ?? user.agreeLocation ?? false,

    marketingAllowed:
      user.settings?.marketingAllowed ?? user.agreeMarketing ?? false,
  };
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-****-${digits.slice(-4)}`;
  }

  return formatPhone(phone);
}

function maskEmail(email: string): string {
  const atIndex = email.indexOf("@");

  if (atIndex < 1) {
    return email;
  }

  return `${email[0]}***${email.slice(atIndex)}`;
}

function PasswordEyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="23"
        viewBox="0 0 256 256"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M16 128C47 82 86 48 128 48S209 82 240 128C209 174 170 208 128 208S47 174 16 128Z"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="128"
          cy="128"
          r="48"
          stroke="currentColor"
          strokeWidth="15"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 128C66 218 190 218 240 128" />
      <path d="M36 157L16 182M74 188L66 212M128 201V228M182 188L190 212M220 157L240 182" />
    </svg>
  );
}

interface ProfileViewProps {
  savedProfile: ProfileData;
  onSave: (profile: ProfileData, options: ProfileSaveOptions) => Promise<void>;
}

function ProfileView({ savedProfile, onSave }: ProfileViewProps) {
  const [nickname, setNickname] = useState(savedProfile.nickname);
  const [profileImage, setProfileImage] = useState(savedProfile.image);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

  const [imageError, setImageError] = useState("");
  const [nameError, setNameError] = useState("");
  const [saveError, setSaveError] = useState("");

  const [isReadingImage, setIsReadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);
  const imageReadVersionRef = useRef(0);

  const isBusy = isReadingImage || isSaving;

  const isEditing =
    nickname !== savedProfile.nickname || profileImage !== savedProfile.image;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file || isBusy) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImageError("JPG, PNG, WEBP 이미지만 선택할 수 있어요.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("5MB 이하의 이미지를 선택해 주세요.");
      return;
    }

    imageReadVersionRef.current += 1;

    const readVersion = imageReadVersionRef.current;
    const reader = new FileReader();

    setIsReadingImage(true);
    setImageError("");
    setSaveError("");

    reader.onload = () => {
      if (readVersion !== imageReadVersionRef.current) {
        return;
      }

      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
        setAvatarFile(file);
      } else {
        setImageError("이미지를 불러오지 못했어요.");
      }

      setIsReadingImage(false);
    };

    reader.onerror = () => {
      if (readVersion !== imageReadVersionRef.current) {
        return;
      }

      setImageError("이미지를 불러오지 못했어요.");
      setIsReadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleOpenPicker = () => {
    if (isBusy) {
      return;
    }

    const current = defaultAvatars.find(([, image]) => image === profileImage);

    setSelectedAvatarId(current?.[0] ?? null);
    setIsPickerOpen(true);
  };

  const handleReset = () => {
    if (isBusy) {
      return;
    }

    setNickname(savedProfile.nickname);
    setProfileImage(savedProfile.image);
    setAvatarFile(null);
    setImageError("");
    setNameError("");
    setSaveError("");
  };

  const handleSave = async () => {
    if (savingRef.current || isReadingImage) {
      return;
    }

    const trimmed = nickname.trim();

    if (trimmed.length < 2 || trimmed.length > 12) {
      setNameError("닉네임은 2~12자로 입력해 주세요.");
      return;
    }

    const options: ProfileSaveOptions = {};

    if (profileImage !== savedProfile.image) {
      if (avatarFile) {
        options.avatarFile = avatarFile;
      } else {
        const selected = defaultAvatars.find(
          ([, image]) => image === profileImage,
        );

        if (!selected) {
          setSaveError("프로필 이미지를 다시 선택해주세요.");
          return;
        }

        options.defaultAvatarId = selected[0];
      }
    }

    savingRef.current = true;

    setIsSaving(true);
    setNameError("");
    setSaveError("");

    try {
      await onSave(
        {
          nickname: trimmed,
          image: profileImage,
        },
        options,
      );
    } catch (error) {
      setSaveError(getErrorMessage(error, "프로필을 저장하지 못했습니다."));
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <S.ProfileCard>
      <S.CardTitle>프로필 정보</S.CardTitle>

      <S.ProfileContent>
        <S.ImageColumn>
          <S.AvatarControlRow>
            <S.ProfileImage src={profileImage} alt="프로필 이미지 미리보기" />

            <S.ImageControls>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                disabled={isBusy}
                onChange={handleFileChange}
              />

              <S.ImageChangeButton
                type="button"
                disabled={isBusy}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={20} strokeWidth={2} aria-hidden="true" />
                이미지 변경
              </S.ImageChangeButton>

              <S.DefaultImageButton
                type="button"
                disabled={isBusy}
                onClick={handleOpenPicker}
              >
                기본 이미지로 변경
              </S.DefaultImageButton>

              <S.ImageHelp>
                {isReadingImage
                  ? "이미지를 불러오고 있어요."
                  : "JPG, PNG, WEBP · 최대 5MB"}
              </S.ImageHelp>

              {imageError && (
                <S.ImageError role="alert">{imageError}</S.ImageError>
              )}
            </S.ImageControls>
          </S.AvatarControlRow>
        </S.ImageColumn>

        <S.InputColumn>
          <S.FieldLabel htmlFor="profile-nickname">닉네임</S.FieldLabel>

          <S.InputBox>
            <S.NameInput
              id="profile-nickname"
              value={nickname}
              maxLength={12}
              disabled={isBusy}
              onChange={(event) => {
                setNickname(event.target.value);
                setNameError("");
                setSaveError("");
              }}
            />

            <S.CharacterCount>{nickname.length}/12</S.CharacterCount>
          </S.InputBox>

          <S.InputHelp>2~12자로 입력해 주세요.</S.InputHelp>

          {nameError && <S.NameError role="alert">{nameError}</S.NameError>}
        </S.InputColumn>
      </S.ProfileContent>

      {saveError && <S.NameError role="alert">{saveError}</S.NameError>}

      <S.ActionRow>
        {isEditing && (
          <S.CancelButton type="button" disabled={isBusy} onClick={handleReset}>
            초기화
          </S.CancelButton>
        )}

        <S.SaveButton
          type="button"
          disabled={isBusy}
          onClick={() => void handleSave()}
        >
          {isSaving ? "저장 중..." : "변경사항 저장"}
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
              {defaultAvatars.map(([id, image], index) => (
                <S.AvatarOption
                  key={id}
                  type="button"
                  $selected={selectedAvatarId === id}
                  aria-label={`기본 이미지 ${index + 1} 선택`}
                  aria-pressed={selectedAvatarId === id}
                  onClick={() => setSelectedAvatarId(id)}
                >
                  <img src={image} alt="" />
                </S.AvatarOption>
              ))}
            </S.AvatarGrid>

            <S.AvatarModalFooter>
              <S.ModalConfirmButton
                type="button"
                onClick={() => {
                  if (selectedAvatarId) {
                    setProfileImage(DEFAULT_PROFILE_IMAGES[selectedAvatarId]);
                    setAvatarFile(null);
                    setImageError("");
                    setSaveError("");
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

interface BasicInfoCardProps {
  account: AccountData;
  editing: boolean;
  onEdit: () => void;
  onSave: (account: AccountData) => Promise<void>;
  mobileEditLayout?: boolean;
  onCancel?: () => void;
}

function BasicInfoCard({
  account,
  editing,
  onEdit,
  onSave,
  mobileEditLayout = false,
  onCancel,
}: BasicInfoCardProps) {
  const [draft, setDraft] = useState<AccountData>(account);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const savingRef = useRef(false);

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

  const handleSave = async () => {
    if (savingRef.current) {
      return;
    }

    const next: AccountData = {
      name: draft.name.trim(),
      phone: draft.phone.replace(/\D/g, ""),
      email: draft.email.trim(),
    };

    if (!next.name || next.name.length > 100) {
      setSaveError("이름은 1~100자로 입력해주세요.");
      return;
    }

    if (!/^01[016789]\d{7,8}$/.test(next.phone)) {
      setSaveError("핸드폰번호를 확인해주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) {
      setSaveError("이메일 형식을 확인해주세요.");
      return;
    }

    savingRef.current = true;

    setIsSaving(true);
    setSaveError("");

    try {
      await onSave(next);
    } catch (error) {
      setSaveError(getErrorMessage(error, "회원 정보를 저장하지 못했습니다."));
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <S.SecurityCard>
      <S.SecurityCardHeader>
        <S.SecurityCardTitle>기본 정보</S.SecurityCardTitle>

        {!mobileEditLayout && (
          <S.SecurityActionButton
            type="button"
            disabled={isSaving}
            onClick={() => {
              if (editing) {
                void handleSave();
              } else {
                onEdit();
              }
            }}
          >
            {isSaving ? "저장 중..." : editing ? "저장" : "수정"}
          </S.SecurityActionButton>
        )}
      </S.SecurityCardHeader>

      <S.SecurityInfoList>
        {fields.map((field) => (
          <S.SecurityInfoRow key={field.id} $editing={editing}>
            <S.SecurityInfoLabel
              htmlFor={editing ? `account-${field.id}` : undefined}
            >
              {field.label}
            </S.SecurityInfoLabel>

            {editing ? (
              <S.SecurityInput
                id={`account-${field.id}`}
                type={field.type}
                disabled={isSaving}
                inputMode={field.id === "phone" ? "tel" : undefined}
                maxLength={field.id === "phone" ? 13 : undefined}
                value={
                  field.id === "phone"
                    ? formatPhone(draft.phone)
                    : draft[field.id]
                }
                onChange={(event) => {
                  const value =
                    field.id === "phone"
                      ? event.target.value.replace(/\D/g, "").slice(0, 11)
                      : event.target.value;

                  setDraft((previous) => ({
                    ...previous,
                    [field.id]: value,
                  }));

                  setSaveError("");
                }}
              />
            ) : (
              <S.SecurityInfoValue>
                {displayValue[field.id] || "등록된 정보 없음"}
              </S.SecurityInfoValue>
            )}
          </S.SecurityInfoRow>
        ))}
      </S.SecurityInfoList>

      {saveError && <S.NameError role="alert">{saveError}</S.NameError>}

      {mobileEditLayout && (
        <S.PasswordActionRow>
          <S.PasswordCancelButton
            type="button"
            disabled={isSaving}
            onClick={onCancel}
          >
            취소
          </S.PasswordCancelButton>

          <S.PasswordSubmitButton
            type="button"
            disabled={isSaving}
            onClick={() => void handleSave()}
          >
            {isSaving ? "저장 중..." : "저장"}
          </S.PasswordSubmitButton>
        </S.PasswordActionRow>
      )}
    </S.SecurityCard>
  );
}

interface PasswordEditViewProps {
  onBack: () => void;
  onSaved: () => void;
}

function PasswordEditView({ onBack, onSaved }: PasswordEditViewProps) {
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

  const [isSaving, setIsSaving] = useState(false);

  const [validationError, setValidationError] = useState<{
    field: PasswordFieldId;
    message: string;
    attempt: number;
  } | null>(null);

  const inputRefs = useRef<Record<PasswordFieldId, HTMLInputElement | null>>({
    current: null,
    new: null,
    confirm: null,
  });

  const attemptRef = useRef(0);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!validationError) {
      return;
    }

    inputRefs.current[validationError.field]?.focus();
  }, [validationError]);

  const showValidation = (field: PasswordFieldId, message: string) => {
    attemptRef.current += 1;

    setValidationError({
      field,
      message,
      attempt: attemptRef.current,
    });
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (savingRef.current) {
      return;
    }

    const emptyField = passwordFields.find(
      ({ id }) => passwords[id].length === 0,
    );

    if (emptyField) {
      showValidation(emptyField.id, "이 입력란을 작성하세요.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      showValidation("confirm", "새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (passwords.current === passwords.new) {
      showValidation("new", "현재 비밀번호와 다른 새 비밀번호를 입력해주세요.");
      return;
    }

    savingRef.current = true;

    setIsSaving(true);
    setValidationError(null);

    try {
      await changePassword(passwords.current, passwords.new, passwords.confirm);

      setPasswords({
        current: "",
        new: "",
        confirm: "",
      });

      onSaved();
    } catch (error) {
      let field: PasswordFieldId = "current";

      if (error instanceof MyPageApiError) {
        if (error.code === "CONFIRM_MISMATCH") {
          field = "confirm";
        } else if (
          error.code === "SAME_PASSWORD" ||
          error.code === "PASSWORD_UPDATE_FAILED"
        ) {
          field = "new";
        }
      }

      showValidation(
        field,
        getErrorMessage(error, "비밀번호를 변경하지 못했습니다."),
      );
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <S.SecurityCard>
      <S.SecurityCardHeader>
        <S.SecurityCardTitle>비밀번호 변경</S.SecurityCardTitle>
      </S.SecurityCardHeader>

      <S.PasswordDescription>
        계정 보안을 위해 비밀번호를 변경할 수 있어요.
      </S.PasswordDescription>

      <S.PasswordForm noValidate onSubmit={handleSubmit}>
        {passwordFields.map((field) => {
          const hasError = validationError?.field === field.id;

          return (
            <S.ValidationRow key={field.id} $hasError={hasError}>
              <S.PasswordLabel htmlFor={`password-${field.id}`}>
                {field.label}
              </S.PasswordLabel>

              <S.ValidatedInputWrapper
                $hasError={hasError}
                $attempt={validationError?.attempt ?? 0}
              >
                <S.PasswordInput
                  ref={(node) => {
                    inputRefs.current[field.id] = node;
                  }}
                  id={`password-${field.id}`}
                  name={`password-${field.id}`}
                  type={visible[field.id] ? "text" : "password"}
                  value={passwords[field.id]}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  disabled={isSaving}
                  spellCheck={false}
                  aria-invalid={hasError}
                  aria-describedby={
                    hasError ? `password-${field.id}-error` : undefined
                  }
                  onChange={(event) => {
                    setPasswords((previous) => ({
                      ...previous,
                      [field.id]: event.target.value,
                    }));

                    if (hasError) {
                      setValidationError(null);
                    }
                  }}
                />

                <S.PasswordVisibilityButton
                  type="button"
                  disabled={isSaving}
                  aria-label={`${field.label} ${
                    visible[field.id] ? "숨기기" : "표시"
                  }`}
                  aria-pressed={visible[field.id]}
                  onClick={() => {
                    setVisible((previous) => ({
                      ...previous,
                      [field.id]: !previous[field.id],
                    }));
                  }}
                >
                  <PasswordEyeIcon visible={visible[field.id]} />
                </S.PasswordVisibilityButton>

                {hasError && validationError && (
                  <S.ValidationMessage
                    id={`password-${field.id}-error`}
                    role="alert"
                  >
                    <CircleAlert size={18} strokeWidth={2} aria-hidden="true" />
                    {validationError.message}
                  </S.ValidationMessage>
                )}
              </S.ValidatedInputWrapper>
            </S.ValidationRow>
          );
        })}

        <S.PasswordActionRow>
          <S.PasswordCancelButton
            type="button"
            disabled={isSaving}
            onClick={onBack}
          >
            취소
          </S.PasswordCancelButton>

          <S.PasswordSubmitButton type="submit" disabled={isSaving}>
            {isSaving ? "변경 중..." : "변경하기"}
          </S.PasswordSubmitButton>
        </S.PasswordActionRow>
      </S.PasswordForm>
    </S.SecurityCard>
  );
}

interface SecurityViewProps {
  account: AccountData;
  editingAccount: boolean;
  onEditAccount: () => void;
  onSaveAccount: (account: AccountData) => Promise<void>;
  onChangePassword: () => void;
  onWithdraw: () => void;
}

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
  const { user, loading, error, refreshUser } = useAuth();

  // 기존 사용자가 있으면 재조회 중에도 본문을 유지합니다.
  if (!user && (loading || error)) {
    return (
      <S.PageLayout>
        <S.PageMain>
          <S.MainInner>
            <S.EmptyCard role={error ? "alert" : "status"}>
              {error ? (
                <>
                  <p>{error}</p>

                  <button type="button" onClick={() => void refreshUser()}>
                    다시 불러오기
                  </button>
                </>
              ) : (
                "사용자 정보를 불러오고 있어요."
              )}
            </S.EmptyCard>
          </S.MainInner>
        </S.PageMain>
      </S.PageLayout>
    );
  }

  return <MyPageContent key={user?.id ?? "guest"} />;
}

function MyPageContent() {
  const { user, refreshUser } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");

  const withdrawingRef = useRef(false);
  const isLoggedIn = Boolean(user);

  const pathParts = pathname.split("/");
  const section = pathParts[2];
  const detail = pathParts[3];

  const currentPage: PageId =
    section === "security" || section === "settings" || section === "support"
      ? section
      : "profile";

  const { title, description } = pageText[currentPage];

  const [savedProfile, setSavedProfile] = useState<ProfileData>(() =>
    user
      ? getProfileData(user)
      : {
          nickname: "",
          image: profileAvatar,
        },
  );

  const [account, setAccount] = useState<AccountData>(() =>
    user
      ? getAccountData(user)
      : {
          name: "",
          phone: "",
          email: "",
        },
  );

  const [savedSettings, setSavedSettings] = useState<MyPageSettings>(() =>
    user ? getSettingsData(user) : { ...DEFAULT_SETTINGS },
  );

  const [toastVersion, setToastVersion] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const [settingsVersion, setSettingsVersion] = useState(0);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const settingsSavingRef = useRef(false);

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isMobileViewport, setIsMobileViewport] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateViewport = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);

      if (!event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !isMobileViewport || !isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleEscape);
    };
  }, [isLoggedIn, isMobileViewport, isMobileMenuOpen]);

  useEffect(() => {
    if (toastVersion === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToastVersion(0);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toastVersion]);

  const showSavedToast = (message = "저장되었습니다.") => {
    setToastMessage(message);
    setToastVersion((version) => version + 1);
  };

  const loadLatestUser = async (): Promise<AuthUser> => {
    const latest = await getCurrentUser();

    if (!latest) {
      throw new Error(
        "저장 후 로그인 상태를 확인하지 못했습니다. 다시 로그인해주세요.",
      );
    }

    return latest;
  };

  const handleProfileSave = async (
    nextProfile: ProfileData,
    options: ProfileSaveOptions,
  ) => {
    await completeInitialProfile(nextProfile.nickname, options);

    let latest: AuthUser;

    try {
      latest = await loadLatestUser();
    } catch {
      throw new Error(
        "프로필은 저장되었지만 최신 정보를 불러오지 못했습니다. 새로고침 후 확인해주세요.",
      );
    }

    setSavedProfile(getProfileData(latest));

    await refreshUser();

    showSavedToast("프로필이 저장되었습니다.");
  };

  const handleAccountSave = async (nextAccount: AccountData) => {
    const result = await saveAccount(nextAccount);

    let latest: AuthUser;

    try {
      latest = await loadLatestUser();
    } catch {
      throw new Error(
        "회원 정보는 저장되었지만 최신 정보를 불러오지 못했습니다. 새로고침 후 확인해주세요.",
      );
    }

    setAccount(getAccountData(latest));

    await refreshUser();

    navigate("/mypage/security");

    showSavedToast(
      result.message ??
        (result.emailPending
          ? "이름과 핸드폰번호가 저장되었습니다. 이메일 변경은 확인 메일 인증 후 반영됩니다."
          : "회원 정보가 저장되었습니다."),
    );
  };

  // 기존 Settings의 onSave에는 동기 함수를 전달합니다.
  // 내부에서 비동기 요청과 오류를 모두 처리합니다.
  const handleSettingsSave = (nextSettings: MyPageSettings): void => {
    if (settingsSavingRef.current) {
      return;
    }

    const isSame =
      nextSettings.inviteNotifications === savedSettings.inviteNotifications &&
      nextSettings.itineraryNotifications ===
        savedSettings.itineraryNotifications &&
      nextSettings.tripStartNotifications ===
        savedSettings.tripStartNotifications &&
      nextSettings.locationServiceAllowed ===
        savedSettings.locationServiceAllowed &&
      nextSettings.marketingAllowed === savedSettings.marketingAllowed &&
      nextSettings.defaultItineraryView === savedSettings.defaultItineraryView;

    if (isSame) {
      return;
    }

    settingsSavingRef.current = true;

    setIsSavingSettings(true);
    setSettingsError("");

    // 요청 시작 시점의 값을 복사해 저장합니다.
    const next: MyPageSettings = {
      ...nextSettings,
    };

    const persist = async () => {
      try {
        await saveSettings(next);

        setSavedSettings(next);
        showSavedToast("설정이 저장되었습니다.");

        // 다른 화면도 변경된 동의 값을 사용하도록 갱신합니다.
        try {
          await refreshUser();
        } catch {
          showSavedToast(
            "설정은 저장되었습니다. 다른 화면에 반영되지 않으면 새로고침해주세요.",
          );
        }
      } catch (error) {
        setSettingsError(getErrorMessage(error, "설정을 저장하지 못했습니다."));

        // Settings 내부의 임시 선택값도 저장 전 상태로 복구합니다.
        setSettingsVersion((version) => version + 1);
      } finally {
        settingsSavingRef.current = false;
        setIsSavingSettings(false);
      }
    };

    void persist();
  };
  const handleWithdraw = async () => {
    if (withdrawingRef.current) {
      return;
    }

    withdrawingRef.current = true;

    setIsWithdrawing(true);
    setWithdrawError("");

    try {
      await withdrawAccount();
    } catch (error) {
      setWithdrawError(
        getErrorMessage(error, "회원탈퇴를 완료하지 못했습니다."),
      );

      withdrawingRef.current = false;
      setIsWithdrawing(false);

      return;
    }

    // 전체 페이지를 이동해 기존 AuthContext 상태도 초기화합니다.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    window.location.replace(isMobile ? "/login" : "/");
  };
  const renderContent = () => {
    if (!isLoggedIn && currentPage !== "support") {
      return <MyLoginRequired />;
    }

    if (currentPage === "profile") {
      return (
        <ProfileView
          key={JSON.stringify([savedProfile.nickname, savedProfile.image])}
          savedProfile={savedProfile}
          onSave={handleProfileSave}
        />
      );
    }

    if (currentPage === "security") {
      if (detail === "password") {
        return (
          <PasswordEditView
            onBack={() => {
              navigate("/mypage/security");
            }}
            onSaved={() => {
              navigate("/mypage/security");
              showSavedToast("비밀번호가 변경되었습니다.");
            }}
          />
        );
      }

      if (detail === "edit" && isMobileViewport) {
        return (
          <BasicInfoCard
            key={JSON.stringify(["mobile-edit", account])}
            account={account}
            editing
            mobileEditLayout
            onCancel={() => {
              navigate("/mypage/security");
            }}
            onEdit={() => {
              navigate("/mypage/security/edit");
            }}
            onSave={handleAccountSave}
          />
        );
      }

      return (
        <SecurityView
          key={JSON.stringify([detail ?? "overview", account])}
          account={account}
          editingAccount={detail === "edit"}
          onEditAccount={() => {
            navigate("/mypage/security/edit");
          }}
          onSaveAccount={handleAccountSave}
          onChangePassword={() => {
            navigate("/mypage/security/password");
          }}
          onWithdraw={() => {
            setWithdrawError("");
            setIsWithdrawOpen(true);
          }}
        />
      );
    }

    if (currentPage === "settings") {
      return (
        <>
          <S.SettingsSaveBoundary
            disabled={isSavingSettings}
            aria-busy={isSavingSettings}
          >
            <Settings
              key={settingsVersion}
              savedSettings={savedSettings}
              onSave={handleSettingsSave}
            />
          </S.SettingsSaveBoundary>

          {isSavingSettings && (
            <S.SaveFeedback role="status">
              설정을 저장하고 있어요.
            </S.SaveFeedback>
          )}

          {settingsError && (
            <S.SaveErrorMessage role="alert">
              {settingsError}
            </S.SaveErrorMessage>
          )}
        </>
      );
    }

    return <Support />;
  };

  return (
    <S.PageLayout>
      <S.MobileTopBar>
        <S.MobileTopBack
          type="button"
          aria-label="뒤로 가기"
          onClick={() => {
            navigate(
              currentPage === "security" && detail ? "/mypage/security" : "/",
            );
          }}
        >
          <ChevronLeft size={26} strokeWidth={1.8} aria-hidden="true" />
        </S.MobileTopBack>

        <S.MobileTopLogo src={routyLogo} alt="Routy" />

        {isLoggedIn && (
          <S.MobileMenuToggle
            type="button"
            aria-label="계정 메뉴 열기"
            aria-controls="mypage-sidebar"
            aria-expanded={isMobileMenuOpen}
            onClick={() => {
              setIsMobileMenuOpen(true);
            }}
          >
            <Menu size={26} strokeWidth={1.9} aria-hidden="true" />
          </S.MobileMenuToggle>
        )}
      </S.MobileTopBar>

      {isLoggedIn && isMobileViewport && (
        <S.MobileDrawerBackdrop
          $open={isMobileMenuOpen}
          aria-hidden="true"
          onClick={() => {
            setIsMobileMenuOpen(false);
          }}
        />
      )}

      {(isLoggedIn || !isMobileViewport) && (
        <S.SidebarShell
          id="mypage-sidebar"
          $open={isLoggedIn && isMobileMenuOpen}
        >
          <Sidebar
            profileImage={savedProfile.image}
            onNavigate={(page) => {
              setIsMobileMenuOpen(false);
              navigate(`/mypage/${page}`);
            }}
            onBack={() => {
              setIsMobileMenuOpen(false);
              navigate("/");
            }}
          />
        </S.SidebarShell>
      )}

      <S.PageMain>
        <S.MainInner>
          {(isLoggedIn || currentPage === "support") &&
            currentPage !== "settings" && (
              <S.PageHeader>
                <S.PageTitle
                  $green={
                    currentPage === "profile" || currentPage === "support"
                  }
                >
                  {title}
                </S.PageTitle>

                <S.PageDescription>{description}</S.PageDescription>
              </S.PageHeader>
            )}

          {renderContent()}
        </S.MainInner>
      </S.PageMain>

      {isLoggedIn && toastVersion > 0 && (
        <S.SaveToast role="status">{toastMessage}</S.SaveToast>
      )}

      {/* {isLoggedIn && isWithdrawOpen && (
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
              <S.WithdrawYesButton
                type="button"
                disabled
                title="회원 탈퇴 기능은 아직 연결되지 않았습니다."
              >
                네
              </S.WithdrawYesButton>

              <S.WithdrawNoButton
                type="button"
                onClick={() => {
                  setIsWithdrawOpen(false);
                }}
              >
                아니요
              </S.WithdrawNoButton>
            </S.WithdrawConfirmActions>
          </S.WithdrawConfirmDialog>
        </S.AvatarModalBackdrop>
      )} */}
      {isLoggedIn && isWithdrawOpen && (
        <S.AvatarModalBackdrop>
          <S.WithdrawConfirmDialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-title"
            aria-describedby="withdraw-description"
            aria-busy={isWithdrawing}
          >
            <S.WithdrawConfirmTitle id="withdraw-title">
              정말 회원탈퇴 하시겠습니까?
            </S.WithdrawConfirmTitle>

            <S.WithdrawConfirmDescription id="withdraw-description">
              계정과 회원 프로필이 삭제되며 복구할 수 없습니다.
            </S.WithdrawConfirmDescription>

            {withdrawError && (
              <S.NameError role="alert">{withdrawError}</S.NameError>
            )}

            <S.WithdrawConfirmActions>
              <S.WithdrawYesButton
                type="button"
                disabled={isWithdrawing}
                onClick={() => void handleWithdraw()}
              >
                {isWithdrawing ? "탈퇴 처리 중..." : "네"}
              </S.WithdrawYesButton>

              <S.WithdrawNoButton
                type="button"
                disabled={isWithdrawing}
                onClick={() => {
                  setWithdrawError("");
                  setIsWithdrawOpen(false);
                }}
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
