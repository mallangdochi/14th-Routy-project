const STATUS_PREFIX = "routy:initial-profile:v2:";
const CURRENT_EMAIL_KEY = "routy:initial-profile:current-email:v2";

type ProfileStatus = "pending" | "completed";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function read(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function write(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    return;
  }
}

function getStatus(email: string): ProfileStatus | null {
  const value = read(window.localStorage, STATUS_PREFIX + email);

  return value === "pending" || value === "completed" ? value : null;
}

function setStatus(email: string, status: ProfileStatus): void {
  if (email) {
    write(window.localStorage, STATUS_PREFIX + email, status);
  }
}

export function markProfilePendingAfterSignup(email: string): void {
  setStatus(normalizeEmail(email), "pending");
}

export function destinationAfterLogin(
  email: string,
  serverProfileCompleted?: boolean,
): "/profile" | "/" {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return serverProfileCompleted === false ? "/profile" : "/";
  }

  write(window.sessionStorage, CURRENT_EMAIL_KEY, normalizedEmail);

  const localStatus = getStatus(normalizedEmail);

  if (localStatus === "pending") return "/profile";
  if (localStatus === "completed") return "/";

  if (serverProfileCompleted === false) {
    setStatus(normalizedEmail, "pending");
    return "/profile";
  }

  return "/";
}

export function markCurrentProfileCompleted(): void {
  const email = read(window.sessionStorage, CURRENT_EMAIL_KEY);

  if (!email) return;

  setStatus(email, "completed");
}

export function needsInitialProfile(
  email?: string,
  serverProfileCompleted?: boolean,
): boolean {
  const normalizedEmail = normalizeEmail(email ?? "");

  if (normalizedEmail) {
    const localStatus = getStatus(normalizedEmail);

    if (localStatus === "pending") return true;
    if (localStatus === "completed") return false;
  }

  return serverProfileCompleted === false;
}
