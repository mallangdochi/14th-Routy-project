import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createSupabaseServer } from "../../supabase.js";
import { runNotificationWorker } from "../../notifications/worker.js";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export default async function handler(req: VercelRequest, res: VercelResponse) {
 res.setHeader("Cache-Control", "private, no-store");
 const action = typeof req.query.action === "string" ? req.query.action : "";
 if (action === "run") return runNotificationWorker(req, res);
 if (!["GET", "POST"].includes(req.method ?? "")) return res.status(405).json({ message: "허용되지 않은 요청입니다." });
 if (req.method === "POST") {
  const allowed = [process.env.APP_ORIGIN, ...(process.env.ADDITIONAL_ALLOWED_ORIGINS ?? "").split(",")].map(v => v?.trim()).filter(Boolean);
  if (!req.headers.origin || !allowed.includes(req.headers.origin)) return res.status(403).json({ message: "허용되지 않은 요청입니다." });
  if (req.headers["content-type"]?.split(";")[0].trim() !== "application/json") return res.status(415).json({ message: "JSON 형식으로 요청해주세요." });
 }
 try {
  const db = createSupabaseServer(req, res);
  const { data: { user }, error: authError } = await db.auth.getUser();
  if (authError || !user) return res.status(401).json({ message: "로그인 후 다시 시도해주세요." });
  if (req.method === "GET" && action === "public-key") {
   if (!process.env.WEB_PUSH_PUBLIC_KEY) throw new Error("PUSH_CONFIG");
   return res.status(200).json({ publicKey: process.env.WEB_PUSH_PUBLIC_KEY });
  }
  if (req.method === "GET" && action === "preferences") {
   const { data, error } = await db.from("profiles").select("invite_notifications,itinerary_notifications,trip_start_notifications").eq("id", user.id).single();
   if (error || !data) throw new Error("SETTINGS_LOOKUP");
   return res.status(200).json({ settings: {
    inviteNotifications: data.invite_notifications ?? true,
    itineraryNotifications: data.itinerary_notifications ?? true,
    tripStartNotifications: data.trip_start_notifications ?? true,
   } });
  }
  if (req.method === "GET" && action === "feed") {
   const { data, error } = await db.rpc("routy_notification_feed", { p_action: "list", p_ids: [] });
   if (error) throw new Error("FEED_LOOKUP");
   return res.status(200).json(data);
  }
  const body: unknown = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  if (req.method !== "POST" || !body || typeof body !== "object" || Array.isArray(body)) return res.status(400).json({ message: "요청 내용을 확인해주세요." });
  const input = body as Record<string, unknown>;
  if (action === "dismiss" || action === "restore") {
   if (!Array.isArray(input.ids) || !input.ids.length || input.ids.length > 100 || input.ids.some(id => typeof id !== "string" || !uuid.test(id)))
    return res.status(400).json({ message: "알림 ID를 확인해주세요." });
   const { data, error } = await db.rpc("routy_notification_feed", { p_action: action, p_ids: input.ids });
   if (error) throw new Error("FEED_MUTATION");
   return res.status(200).json(data);
  }
  if (action === "subscribe") {
   const sub = input.subscription as { endpoint?: unknown; keys?: { auth?: unknown; p256dh?: unknown } } | undefined;
   if (!sub || typeof sub.endpoint !== "string" || sub.endpoint.length > 2048 || !validPushEndpoint(sub.endpoint)
    || typeof sub.keys?.auth !== "string" || !/^[\w-]{22}={0,2}$/.test(sub.keys.auth)
    || typeof sub.keys.p256dh !== "string" || !/^[\w-]{87}=?$/.test(sub.keys.p256dh))
    return res.status(400).json({ message: "브라우저 푸시 구독 정보를 확인해주세요." });
   // endpoint는 DB에서 유일하게 관리합니다. 계정 변경 시 동일 브라우저의 소유자를 전환합니다.
   const { error } = await db.rpc("routy_register_push", { p_endpoint: sub.endpoint, p_p256dh: sub.keys.p256dh, p_auth: sub.keys.auth });
   if (error) throw new Error("PUSH_SUBSCRIBE");
   return res.status(200).json({ success: true });
  }
  if (action === "unsubscribe") {
   const { error } = await db.rpc("routy_remove_push", { p_endpoint: String(input.endpoint ?? "") });
   if (error) throw new Error("PUSH_UNSUBSCRIBE");
   return res.status(200).json({ success: true });
  }
  return res.status(400).json({ message: "지원하지 않는 알림 작업입니다." });
 } catch {
  return res.status(500).json({ message: "알림을 처리하지 못했습니다. 서버 설정과 알림 SQL 적용 상태를 확인해주세요." });
 }
}
// 임의 내부 URL로 서버 요청이 전달되지 않도록 표준 브라우저 푸시 서비스만 허용합니다.
export function validPushEndpoint(value: string) {
 try {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password && (!url.port || url.port === "443") && (
   url.hostname === "fcm.googleapis.com" || url.hostname === "updates.push.services.mozilla.com"
   || url.hostname.endsWith(".push.services.mozilla.com") || url.hostname === "web.push.apple.com"
   || url.hostname.endsWith(".notify.windows.com") || url.hostname === "wns2-par02p.notify.windows.com"
  );
 } catch { return false; }
}
