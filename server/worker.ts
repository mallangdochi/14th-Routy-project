import type { VercelRequest, VercelResponse } from "@vercel/node";
import { timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

interface Delivery {
 id: string; lease_token: string; endpoint: string; p256dh: string; auth: string;
 event_id: string; title: string; body: string; trip_id: string;
}
export async function runNotificationWorker(req: VercelRequest, res: VercelResponse) {
 if (req.method !== "POST") return res.status(405).json({ message: "POST 요청이 필요합니다." });
 const secret = process.env.NOTIFICATION_CRON_SECRET;
 const actual = req.headers.authorization;
 if (!secret || typeof actual !== "string" || !equal(actual, `Bearer ${secret}`)) return res.status(401).json({ message: "인증되지 않은 작업입니다." });
 const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
 if (!url || !key || !process.env.WEB_PUSH_PUBLIC_KEY || !process.env.WEB_PUSH_PRIVATE_KEY || !process.env.WEB_PUSH_SUBJECT)
  return res.status(503).json({ message: "푸시 서버 환경변수를 설정해주세요." });
 const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
 try {
  const reminder = await db.rpc("routy_enqueue_trip_reminders");
  if (reminder.error) throw new Error("REMINDER_ENQUEUE");
  const claimed = await db.rpc("routy_claim_push", { p_limit: 30 });
  if (claimed.error) throw new Error("PUSH_CLAIM");
  let sent = 0, failed = 0;
  // 소량씩 병렬 전송하고 각 구독의 성공 여부를 따로 기록합니다.
  const jobs = (claimed.data ?? []) as Delivery[];
  for (let index = 0; index < jobs.length; index += 5) {
   await Promise.all(jobs.slice(index, index + 5).map(async job => {
    let outcome = "retry";
    try {
     // claim 이후 설정을 끄거나 여행을 탈퇴한 경우도 재확인합니다.
     const allowed = await db.rpc("routy_push_still_allowed", { p_delivery: job.id, p_token: job.lease_token });
     if (allowed.error) throw new Error("PREFERENCE_LOOKUP");
     if (!allowed.data) outcome = "skip";
     else {
      await webpush.sendNotification({ endpoint: job.endpoint, keys: { p256dh: job.p256dh, auth: job.auth } }, JSON.stringify({
       id: job.event_id, title: job.title, body: job.body, url: `/trips/${encodeURIComponent(job.trip_id)}`,
      }), { TTL: 3600, timeout: 8000, vapidDetails: {
       subject: process.env.WEB_PUSH_SUBJECT!, publicKey: process.env.WEB_PUSH_PUBLIC_KEY!, privateKey: process.env.WEB_PUSH_PRIVATE_KEY!,
      } });
      outcome = "sent"; sent++;
     }
    } catch (reason: unknown) {
     const status = typeof reason === "object" && reason !== null && "statusCode" in reason ? reason.statusCode : 0;
     outcome = status === 404 || status === 410 ? "expired" : "retry"; failed++;
    }
    const result = await db.rpc("routy_finish_push", { p_delivery: job.id, p_token: job.lease_token, p_outcome: outcome });
    if (result.error) throw new Error("PUSH_FINISH");
   }));
  }
  return res.status(200).json({ success: true, sent, failed });
 } catch {
  return res.status(500).json({ message: "알림 예약 또는 발송 처리에 실패했습니다." });
 }
}
function equal(a: string, b: string) {
 const left = Buffer.from(a), right = Buffer.from(b);
 return left.length === right.length && timingSafeEqual(left, right);
}
