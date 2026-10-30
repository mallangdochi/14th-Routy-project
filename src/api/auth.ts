import type { MyPageSettings } from "./mypage";

export async function loginWithEmail(
  loginId: string,
  password: string,
  remember: boolean,
): Promise<AuthUser> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      loginId: loginId.trim(),
      password,
      remember,
    }),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data !== null &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "로그인 요청에 실패했습니다.";

    throw new Error(message);
  }

  if (
    data === null ||
    typeof data !== "object" ||
    !("user" in data) ||
    data.user === null ||
    typeof data.user !== "object" ||
    !("id" in data.user) ||
    typeof data.user.id !== "string"
  ) {
    throw new Error("로그인 사용자 응답 형식이 올바르지 않습니다.");
  }

  const user = data.user;
  if (typeof user.id !== "string") {
    throw new Error("로그인 사용자 응답 형식이 올바르지 않습니다.");
  }
  return {
    id: user.id,
    email:
      "email" in user && typeof user.email === "string"
        ? user.email
        : undefined,
    username:
      "username" in user && typeof user.username === "string"
        ? user.username
        : null,
    profileCompleted:
      "profileCompleted" in user && typeof user.profileCompleted === "boolean"
        ? user.profileCompleted
        : undefined,
  };
}

export interface AuthUser {
  id: string;
  email?: string;

  loginId?: string | null;
  username: string | null;
  avatarUrl?: string | null;
  profileCompleted?: boolean;
  fullName?: string;
  settings?: MyPageSettings;
  firstName?: string | null;
  lastName?: string | null;
  birth?: string | null;
  phone?: string | null;

  agreeTerms?: boolean | null;
  agreePrivacy?: boolean | null;
  agreeMarketing?: boolean | null;
  agreeLocation?: boolean | null;

  agreedAt?: string | null;
  createdAt?: string | null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data !== null &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "로그인 상태를 확인하지 못했습니다.";

    throw new Error(message);
  }

  if (
    data === null ||
    typeof data !== "object" ||
    !("user" in data) ||
    data.user === null ||
    typeof data.user !== "object" ||
    !("id" in data.user) ||
    typeof data.user.id !== "string"
  ) {
    throw new Error("사용자 응답 형식이 올바르지 않습니다.");
  }

  const user = data.user as Record<string, unknown>;

  const getText = (key: string): string | null => {
    const value = user[key];

    return typeof value === "string" ? value : null;
  };

  const getBoolean = (key: string): boolean | null => {
    const value = user[key];

    return typeof value === "boolean" ? value : null;
  };

  const rawSettings = user.settings;

  const settings: Record<string, unknown> =
    rawSettings !== null &&
    typeof rawSettings === "object" &&
    !Array.isArray(rawSettings)
      ? (rawSettings as Record<string, unknown>)
      : {};

  const agreeLocation = getBoolean("agreeLocation");
  const agreeMarketing = getBoolean("agreeMarketing");

  const fullName =
    getText("fullName") ??
    `${getText("lastName") ?? ""}${getText("firstName") ?? ""}`;

  return {
    id: data.user.id,
    email: getText("email") ?? undefined,

    loginId: getText("loginId"),
    username: getText("username"),
    avatarUrl: getText("avatarUrl"),

    profileCompleted: getBoolean("profileCompleted") ?? false,

    firstName: getText("firstName"),
    lastName: getText("lastName"),
    fullName,

    birth: getText("birth"),
    phone: getText("phone"),

    agreeTerms: getBoolean("agreeTerms"),
    agreePrivacy: getBoolean("agreePrivacy"),
    agreeMarketing,
    agreeLocation,

    settings: {
      inviteNotifications: settings.inviteNotifications === true,

      itineraryNotifications: settings.itineraryNotifications === true,

      tripStartNotifications: settings.tripStartNotifications === true,

      locationServiceAllowed:
        typeof settings.locationServiceAllowed === "boolean"
          ? settings.locationServiceAllowed
          : (agreeLocation ?? false),

      marketingAllowed:
        typeof settings.marketingAllowed === "boolean"
          ? settings.marketingAllowed
          : (agreeMarketing ?? false),

      defaultItineraryView:
        settings.defaultItineraryView === "map" ? "map" : "schedule",
    },

    agreedAt: getText("agreedAt"),
    createdAt: getText("createdAt"),
  };
}

export interface ProfileSaveOptions {
  avatarFile?: File | null;
  defaultAvatarId?: string;
}

// 선택한 이미지를 최대 768px, 1MB 이하 JPEG로 변환합니다.
// 이미지 변환만 브라우저에서 하고, 실제 업로드는 서버 함수가 처리합니다.
async function convertProfileImage(file: File): Promise<string> {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("JPG, PNG, WebP 이미지만 선택할 수 있습니다.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("프로필 이미지는 5MB 이하로 선택해주세요.");
  }

  const previewUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = previewUrl;

    await image.decode();

    if (!image.naturalWidth || !image.naturalHeight) {
      throw new Error("이미지를 읽지 못했습니다.");
    }

    const scale = Math.min(
      1,
      768 / image.naturalWidth,
      768 / image.naturalHeight,
    );

    const canvas = document.createElement("canvas");

    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));

    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("이미지 변환을 지원하지 않는 브라우저입니다.");
    }

    // JPEG는 투명 배경을 지원하지 않으므로 흰색으로 채웁니다.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    // 용량이 클 경우 품질을 조금씩 낮춰 변환합니다.
    for (const quality of [0.85, 0.75, 0.65, 0.55]) {
      const avatarData = canvas.toDataURL("image/jpeg", quality);

      const base64 = avatarData.split(",")[1];

      if (!base64) {
        throw new Error("이미지 변환에 실패했습니다.");
      }

      const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;

      const imageBytes = (base64.length * 3) / 4 - padding;

      if (imageBytes <= 1024 * 1024 && avatarData.length <= 1_400_000) {
        return avatarData;
      }
    }

    throw new Error("이미지 용량을 줄인 후 다시 선택해주세요.");
  } finally {
    URL.revokeObjectURL(previewUrl);
  }
}

export async function completeInitialProfile(
  nickname: string,
  options: ProfileSaveOptions = {},
): Promise<void> {
  const value = nickname.trim();

  if (value.length < 2 || value.length > 12) {
    throw new Error("닉네임은 2~12자로 입력해주세요.");
  }

  const body: {
    nickname: string;
    avatarData?: string;
    defaultAvatarId?: string;
  } = {
    nickname: value,
  };

  if (options.avatarFile) {
    body.avatarData = await convertProfileImage(options.avatarFile);
  } else if (options.defaultAvatarId) {
    body.defaultAvatarId = options.defaultAvatarId;
  }

  const response = await fetch("/api/profile/setup", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data !== null &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "프로필을 저장하지 못했습니다.";

    throw new Error(message);
  }

  if (
    data === null ||
    typeof data !== "object" ||
    !("success" in data) ||
    data.success !== true
  ) {
    throw new Error("프로필 저장 결과가 올바르지 않습니다.");
  }
}

export const updateProfile = completeInitialProfile;

export async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data !== null &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "로그아웃 요청에 실패했습니다.";

    throw new Error(message);
  }

  if (
    data === null ||
    typeof data !== "object" ||
    !("success" in data) ||
    data.success !== true
  ) {
    throw new Error("로그아웃 응답을 확인하지 못했습니다.");
  }
}

export async function checkUsername(username: string): Promise<boolean> {
  const response = await fetch("/api/auth/check-username", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.trim(),
    }),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data !== null &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "아이디 중복 확인에 실패했습니다.";

    throw new Error(message);
  }

  if (
    data === null ||
    typeof data !== "object" ||
    !("available" in data) ||
    typeof data.available !== "boolean"
  ) {
    throw new Error("아이디 중복 확인 응답이 올바르지 않습니다.");
  }

  return data.available;
}
export interface SignupRequest {
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

export async function signupWithEmail(form: SignupRequest): Promise<void> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data: unknown = await response.json().catch(() => null);

  const message =
    data !== null &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
      ? data.message
      : "회원가입 요청에 실패했습니다.";

  if (!response.ok) {
    throw new Error(message);
  }

  if (
    data === null ||
    typeof data !== "object" ||
    !("success" in data) ||
    data.success !== true
  ) {
    throw new Error("회원가입 응답이 올바르지 않습니다.");
  }

  window.alert(message);
}
