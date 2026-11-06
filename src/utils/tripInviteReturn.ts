const key = "routy_trip_invite_return";
export function isTripInviteReturn(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^\/trip-invite\/[0-9a-f-]{36}(?:#invite=[a-f0-9]{64})$/i.test(value);
}
export function rememberTripInvite(path: string) {
  if (!isTripInviteReturn(path)) return;
  try { sessionStorage.setItem(key, path); } catch { /* Router state also preserves it. */ }
}
export function readTripInviteReturn(): string | null {
  try {
    const value = sessionStorage.getItem(key);
    return value && isTripInviteReturn(value) ? value : null;
  } catch { return null; }
}
export function clearTripInviteReturn() {
  try { sessionStorage.removeItem(key); } catch { /* Storage may be unavailable. */ }
}
