/** 계정별 읽음 상태. 서버 readAt을 우선 사용하고, 미연결 시 이 브라우저에 저장합니다. */
const cache = new Map<string, Record<string, string>>();
function read(userId: string) {
  const previous = cache.get(userId);
  if (previous) return previous;
  let value: Record<string, string> = {};
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(`routy:notification-read:${userId}`) ?? "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
      value = Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  } catch { /* 저장소를 사용할 수 없어도 현재 세션에서는 유지합니다. */ }
  cache.set(userId, value);
  return value;
}
export function getNotificationReadAt(userId: string | null | undefined, id: string) {
  return userId ? read(userId)[id] : undefined;
}
export function saveNotificationReadAt(userId: string, id: string, readAt: string) {
  const value = { ...read(userId), [id]: readAt };
  cache.set(userId, value);
  try { localStorage.setItem(`routy:notification-read:${userId}`, JSON.stringify(value)); } catch { /* 메모리 상태 유지 */ }
}
