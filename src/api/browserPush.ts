export type NotificationPreferences = {
 inviteNotifications: boolean;
 itineraryNotifications: boolean;
 tripStartNotifications: boolean;
};
export async function notificationRequest(action: string, body?: object, signal?: AbortSignal) {
 const response = await fetch(`/api/profile/notifications?action=${encodeURIComponent(action)}`, {
  method: body ? "POST" : "GET", credentials: "include", cache: "no-store", signal,
  ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
 });
 const data = await response.json().catch(() => null);
 if (!response.ok) throw new Error(data?.message ?? "알림을 처리하지 못했습니다.");
 return data;
}
export async function loadNotificationPreferences(signal?: AbortSignal): Promise<NotificationPreferences> {
 const data = await notificationRequest("preferences", undefined, signal);
 const settings = data?.settings;
 if (!settings || ["inviteNotifications", "itineraryNotifications", "tripStartNotifications"].some(key => typeof settings[key] !== "boolean"))
  throw new Error("알림 설정을 확인하지 못했습니다.");
 return settings;
}
const disabledKey = "routy:browser-push-disabled";
export const browserPushChangedEvent = "routy:browser-push-changed";
let locallyDisabled = false;
let operation: Promise<unknown> = Promise.resolve();
function queue<T>(work: () => Promise<T>): Promise<T> {
 const next = operation.catch(() => undefined).then(work);
 operation = next;
 return next;
}
function isDisabled() {
 try { return localStorage.getItem(disabledKey) === "1" || locallyDisabled; }
 catch { return locallyDisabled; }
}
function setDisabled(value: boolean) {
 locallyDisabled = value;
 try { if (value) localStorage.setItem(disabledKey, "1"); else localStorage.removeItem(disabledKey); } catch { /* 현재 세션의 선택은 유지합니다. */ }
 window.dispatchEvent(new Event(browserPushChangedEvent));
}
async function getSubscription() {
 if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;
 const registration = await navigator.serviceWorker.getRegistration("/routy-push-sw.js");
 return await registration?.pushManager.getSubscription() ?? null;
}
export async function isBrowserPushConnected(): Promise<boolean> {
 if (isDisabled() || !("Notification" in window) || Notification.permission !== "granted") return false;
 return Boolean(await getSubscription());
}
async function connect() {
 const { publicKey } = await notificationRequest("public-key");
 if (typeof publicKey !== "string" || !publicKey) throw new Error("서버 푸시 설정을 확인해주세요.");
 const registration = await navigator.serviceWorker.register("/routy-push-sw.js", { scope: "/" });
 await navigator.serviceWorker.ready;
 const key = Uint8Array.from(atob(publicKey.replace(/-/g, "+").replace(/_/g, "/")), char => char.charCodeAt(0));
 const existing = await registration.pushManager.getSubscription();
 const subscription = existing ?? await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
 try { await notificationRequest("subscribe", { subscription: subscription.toJSON() }); }
 catch (error) { if (!existing) await subscription.unsubscribe(); throw error; }
}
export async function enableBrowserPush(): Promise<NotificationPermission> {
 if (!window.isSecureContext || !("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window))
  throw new Error("이 환경에서는 웹 푸시를 지원하지 않아요.");
 // 권한 요청은 클릭 이벤트 안에서 즉시 실행합니다.
 const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
 if (permission !== "granted") return permission;
 await queue(async () => { await connect(); setDisabled(false); });
 return permission;
}
export async function disableBrowserPush(): Promise<void> {
 await queue(async () => {
  const subscription = await getSubscription();
  if (subscription) {
   const result = await notificationRequest("unsubscribe", { endpoint: subscription.endpoint });
   if (result?.success !== true) throw new Error("알림 해제 결과를 확인하지 못했습니다.");
   // 서버에서 제거한 뒤 선택을 저장합니다. 브라우저 정리 실패 시에도 자동 연결은 차단합니다.
   setDisabled(true);
   try { await subscription.unsubscribe(); } catch { /* 서버 구독은 제거되었으므로 수신은 중단됩니다. */ }
  } else setDisabled(true);
 });
}
/** 권한이 이미 허용되어도 사용자가 해제한 브라우저는 자동 재연결하지 않습니다. */
export function syncBrowserPushSession(userId: string | null) {
 return queue(async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  if (!userId) {
   const subscription = await getSubscription();
   if (subscription) await subscription.unsubscribe();
   window.dispatchEvent(new Event(browserPushChangedEvent));
  } else if (!isDisabled() && "Notification" in window && Notification.permission === "granted") {
   await connect();
   window.dispatchEvent(new Event(browserPushChangedEvent));
  }
 });
}
