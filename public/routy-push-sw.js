self.addEventListener("push", event => {
 let data = {};
 try { data = event.data ? event.data.json() : {}; } catch { /* 기본 안내를 표시합니다. */ }
 event.waitUntil(self.registration.showNotification(data.title || "Routy 알림", {
  body: data.body || "새로운 여행 알림이 도착했어요.", tag: data.id || "routy-notification",
  data: { url: data.url || "/" },
 }));
});
self.addEventListener("notificationclick", event => {
 event.notification.close();
 const target = new URL(event.notification.data?.url || "/", self.location.origin);
 if (target.origin !== self.location.origin) return;
 event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(async windows => {
  for (const client of windows) {
   if (new URL(client.url).origin === target.origin && "navigate" in client) {
    await client.navigate(target.href); return client.focus();
   }
  }
  return clients.openWindow(target.href);
 }));
});
