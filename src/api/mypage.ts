// export type MyPageSettings = {
//   inviteNotifications: boolean;
//   itineraryNotifications: boolean;
//   tripStartNotifications: boolean;
//   locationServiceAllowed: boolean;
//   marketingAllowed: boolean;
//   defaultItineraryView: "schedule" | "map";
// };

// export const DEFAULT_SETTINGS: MyPageSettings = {
//   inviteNotifications: false,
//   itineraryNotifications: false,
//   tripStartNotifications: false,
//   locationServiceAllowed: false,
//   marketingAllowed: false,
//   defaultItineraryView: "schedule",
// };

// export class MyPageApiError extends Error {
//   readonly code?: string;

//   constructor(message: string, code?: string) {
//     super(message);
//     this.name = "MyPageApiError";
//     this.code = code;
//   }
// }

// type SaveResult = {
//   success: true;
//   message?: string;
//   emailPending?: boolean;
// };

// async function save(body: Record<string, unknown>): Promise<SaveResult> {
//   const response = await fetch("/api/profile/manage", {
//     method: "POST",
//     credentials: "same-origin",
//     cache: "no-store",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });

//   const value: unknown = await response.json().catch(() => null);

//   const data =
//     value && typeof value === "object" && !Array.isArray(value)
//       ? (value as Record<string, unknown>)
//       : null;

//   if (!response.ok || data?.success !== true) {
//     throw new MyPageApiError(
//       typeof data?.message === "string"
//         ? data.message
//         : "저장하지 못했습니다. 다시 시도해주세요.",
//       typeof data?.code === "string" ? data.code : undefined,
//     );
//   }

//   return {
//     success: true,
//     message: typeof data.message === "string" ? data.message : undefined,
//     emailPending: data.emailPending === true,
//   };
// }

// export function saveAccount(account: {
//   name: string;
//   phone: string;
//   email: string;
// }) {
//   return save({
//     action: "account",
//     ...account,
//     phone: account.phone.replace(/\D/g, ""),
//   });
// }

// export function saveSettings(settings: MyPageSettings) {
//   return save({
//     action: "settings",
//     ...settings,
//   });
// }

// export function changePassword(
//   currentPassword: string,
//   newPassword: string,
//   confirmPassword: string,
// ) {
//   return save({
//     action: "password",
//     currentPassword,
//     newPassword,
//     confirmPassword,
//   });
// }

// export function formatPhone(value: string) {
//   const digits = value.replace(/\D/g, "").slice(0, 11);

//   if (digits.length <= 3) return digits;

//   if (digits.length <= 7) {
//     return `${digits.slice(0, 3)}-${digits.slice(3)}`;
//   }

//   if (digits.length <= 10) {
//     return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
//   }

//   return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
// }

export interface MyPageSettings {
  inviteNotifications: boolean;
  itineraryNotifications: boolean;
  tripStartNotifications: boolean;
  locationServiceAllowed: boolean;
  marketingAllowed: boolean;
  defaultItineraryView: "schedule" | "map";
}

export interface AccountSaveData {
  name: string;
  phone: string;
  email: string;
}

export interface MyPageSaveResult {
  success: true;
  message?: string;
  emailPending: boolean;
}

export const DEFAULT_SETTINGS: MyPageSettings = {
  inviteNotifications: false,
  itineraryNotifications: false,
  tripStartNotifications: false,
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
    name: account.name.trim(),
    phone: account.phone.replace(/\D/g, ""),
    email: account.email.trim(),
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
