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
export async function enableBrowserPush(): Promise<NotificationPermission> {
 if (!window.isSecureContext || !("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window))
  throw new Error("이 환경에서는 웹 푸시를 지원하지 않아요.");
 // 클릭 이벤트에서 바로 요청해야 하는 브라우저를 지원합니다.
 const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
 if (permission !== "granted") return permission;
 const { publicKey } = await notificationRequest("public-key");
 if (typeof publicKey !== "string" || !publicKey) throw new Error("서버 푸시 설정을 확인해주세요.");
 const registration = await navigator.serviceWorker.register("/routy-push-sw.js", { scope: "/" });
 await navigator.serviceWorker.ready;
 const key = Uint8Array.from(atob(publicKey.replace(/-/g, "+").replace(/_/g, "/")), char => char.charCodeAt(0));
 const existing = await registration.pushManager.getSubscription();
 const subscription = existing ?? await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
 try { await notificationRequest("subscribe", { subscription: subscription.toJSON() }); }
 catch (error) { if (!existing) await subscription.unsubscribe(); throw error; }
 return permission;
}

let sessionSync: Promise<void> = Promise.resolve();
/** 자동 권한 요청은 하지 않고, 이미 승인한 브라우저 구독만 계정에 연결합니다. */
export function syncBrowserPushSession(userId: string | null) {
 sessionSync = sessionSync.catch(() => undefined).then(async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  if (!userId) {
   const registration = await navigator.serviceWorker.getRegistration("/routy-push-sw.js");
   const subscription = await registration?.pushManager.getSubscription();
   if (subscription) await subscription.unsubscribe();
  } else if ("Notification" in window && Notification.permission === "granted") {
   await enableBrowserPush();
  }
 });
 return sessionSync;
}
