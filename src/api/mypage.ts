export interface MyPageSettings {
  inviteNotifications: boolean;
  itineraryNotifications: boolean;
  tripStartNotifications: boolean;
  locationServiceAllowed: boolean;
  marketingAllowed: boolean;
  defaultItineraryView: "schedule" | "map";
}

export interface AccountSaveData {
  name?: string;
  phone?: string;
  email?: string;
}

export interface MyPageSaveResult {
  success: true;
  message?: string;
  emailPending: boolean;
}

export const DEFAULT_SETTINGS: MyPageSettings = {
  inviteNotifications: true,
  itineraryNotifications: true,
  tripStartNotifications: true,
  locationServiceAllowed: false,
  marketingAllowed: false,
  defaultItineraryView: "schedule",
};

export class MyPageApiError extends Error {
  readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);

    this.name = "MyPageApiError";
    this.code = code;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function requestSave(
  body: Record<string, unknown>,
): Promise<MyPageSaveResult> {
  const response = await fetch("/api/profile/manage", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const value: unknown = await response.json().catch(() => null);

  const data = isRecord(value) ? value : null;

  if (!response.ok || data?.success !== true) {
    throw new MyPageApiError(
      typeof data?.message === "string"
        ? data.message
        : "저장하지 못했습니다. 다시 시도해주세요.",
      typeof data?.code === "string" ? data.code : undefined,
    );
  }

  return {
    success: true,
    message: typeof data.message === "string" ? data.message : undefined,
    emailPending: data.emailPending === true,
  };
}

export function saveAccount(
  account: AccountSaveData,
): Promise<MyPageSaveResult> {
  return requestSave({
    action: "account",
    ...(account.name !== undefined ? { name: account.name.trim() } : {}),
    ...(account.phone !== undefined ? { phone: account.phone.replace(/\D/g, "") } : {}),
    ...(account.email !== undefined ? { email: account.email.trim() } : {}),
  });
}

export function saveSettings(
  settings: MyPageSettings,
): Promise<MyPageSaveResult> {
  return requestSave({
    action: "settings",
    inviteNotifications: settings.inviteNotifications,
    itineraryNotifications: settings.itineraryNotifications,
    tripStartNotifications: settings.tripStartNotifications,
    locationServiceAllowed: settings.locationServiceAllowed,
    marketingAllowed: settings.marketingAllowed,
    defaultItineraryView: settings.defaultItineraryView,
  }).then((result) => {
    window.dispatchEvent(new Event("routy:notification-settings-changed"));
    return result;
  });
}

export function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<MyPageSaveResult> {
  return requestSave({
    action: "password",
    currentPassword,
    newPassword,
    confirmPassword,
  });
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  if (digits.length <= 10) {
    return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)].join("-");
  }

  return [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7)].join("-");
}
export async function withdrawAccount(): Promise<void> {
  const response = await fetch("/api/auth/withdraw", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      confirm: true,
    }),
  });

  const value: unknown = await response.json().catch(() => null);

  const data =
    value !== null && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;

  if (!response.ok || data?.success !== true) {
    throw new MyPageApiError(
      typeof data?.message === "string"
        ? data.message
        : "회원탈퇴를 완료하지 못했습니다.",
      typeof data?.code === "string" ? data.code : undefined,
    );
  }
}

/** 계정·설정·여행 원본은 제외하고 명시된 임시 저장소만 정리합니다. */
export async function clearRoutyTemporaryData(): Promise<number> {
  // HTTP 캐시 삭제를 먼저 요청합니다. 실패하면 성공으로 표시하지 않습니다.
  const response = await fetch("/api/clear-cache", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) throw new MyPageApiError("캐시 삭제를 요청하지 못했습니다.");

  let count = 0;
  for (const storage of [window.localStorage, window.sessionStorage]) {
    const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index));
    for (const key of keys) {
      if (key?.startsWith("routy:temp:")) {
        storage.removeItem(key);
        count += 1;
      }
    }
  }
  // CacheStorage 전체를 비우면 오프라인 기능 등 다른 데이터가 지워질 수 있습니다.
  if ("caches" in window) {
    for (const key of await window.caches.keys()) {
      if (key.startsWith("routy:temp:")) {
        if (await window.caches.delete(key)) count += 1;
      }
    }
  }
  window.dispatchEvent(new Event("routy:temporary-data-cleared"));
  return count;
}
