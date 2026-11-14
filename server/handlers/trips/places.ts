import type { VercelRequest, VercelResponse } from "@vercel/node";
import { config } from "dotenv";
import { createSupabaseServer } from "../../supabase.js";
if (process.env.NODE_ENV !== "production") config({ path: ".env.local" });
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "private, no-store");
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ message: "허용되지 않은 요청입니다." });
  }
  try {
    if (req.method === "POST") {
      const allowed = [process.env.APP_ORIGIN, ...(process.env.ADDITIONAL_ALLOWED_ORIGINS ?? "").split(",")].map(v => v?.trim()).filter(Boolean);
      if (!req.headers.origin || !allowed.includes(req.headers.origin)) return res.status(403).json({ message: "허용되지 않은 요청 출처입니다." });
      if (req.headers["content-type"]?.split(";")[0].trim() !== "application/json") return res.status(415).json({ message: "JSON 형식으로 요청해주세요." });
    }
    const input = req.method === "POST" ? (typeof req.body === "string" ? JSON.parse(req.body) : req.body) : req.query;
    if (!input || typeof input.tripId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.tripId)) return res.status(400).json({ message: "여행 ID를 확인해주세요." });
    const action = req.method === "GET" ? "read" : input.action;
    if (!["read", "append", "replace"].includes(action) || (req.method === "POST" && action === "read")) return res.status(400).json({ message: "작업을 확인해주세요." });
    if (req.method === "POST" && (!Array.isArray(input.places) || input.places.length > 1000)) return res.status(400).json({ message: "일정 데이터를 확인해주세요." });
    if (action === "append" && (typeof input.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input.date))) return res.status(400).json({ message: "날짜를 확인해주세요." });
    const db = createSupabaseServer(req,res);
    const { data: { user }, error: authError } = await db.auth.getUser();
    if (authError || !user) return res.status(401).json({ message: "로그인이 필요합니다." });
    const { data, error } = await db.rpc(req.method === "POST" ? "routy_schedule_with_events" : "routy_schedule", {
      p_trip_id: input.tripId, p_action: action,
      p_date: action === "append" ? input.date : null,
      p_places: req.method === "POST" ? input.places : [],
      p_expected_version: action === "replace" ? input.version : null,
      ...(req.method === "POST" ? { p_dates: input.dates ?? null, p_expected_dates: input.expectedDates ?? null } : {}),
    });
    if (error) {
      const status = error.code === "42501" ? 403 : error.code === "40001" ? 409 : 400;
      return res.status(status).json({ message: error.message });
    }
    return res.status(200).json(data);
  } catch {
    return res.status(400).json({ message: "일정 요청을 처리하지 못했습니다. 입력값과 서버 설정을 확인해주세요." });
  }
}
