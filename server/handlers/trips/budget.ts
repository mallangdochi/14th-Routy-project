import type { VercelRequest, VercelResponse } from "@vercel/node";
import { config } from "dotenv";
import { createSupabaseServer } from "../../supabase.js";

if (process.env.NODE_ENV !== "production") config({ path: ".env.local" });

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CATEGORIES = new Set(["교통", "숙소", "식비", "카페", "관광", "기타"]);
const ACTIONS = new Set(["budget", "create", "update", "delete", "restore"]);
const validMoney = (value: unknown, positive: boolean) =>
  typeof value === "number" && Number.isSafeInteger(value) &&
  value >= (positive ? 1 : 0) && value <= 999_999_999_999;

function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE.test(value) || value.startsWith("0000-")) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function sameOrigin(request: VercelRequest) {
  const origins = [process.env.APP_ORIGIN, ...(process.env.ADDITIONAL_ALLOWED_ORIGINS ?? "").split(",")]
    .map((value) => { try { return new URL((value ?? "").trim()).origin; } catch { return ""; } })
    .filter(Boolean);
  return !!request.headers.origin && origins.includes(request.headers.origin);
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Cache-Control", "private, no-store");
  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ message: "허용되지 않은 요청입니다." });
  }
  if (request.method === "POST") {
    if (!process.env.APP_ORIGIN) return response.status(500).json({ message: "APP_ORIGIN 환경변수를 확인해주세요." });
    if (!sameOrigin(request)) return response.status(403).json({ message: "허용되지 않은 요청 출처입니다." });
    if (request.headers["content-type"]?.split(";")[0].trim().toLowerCase() !== "application/json")
      return response.status(415).json({ message: "JSON 형식으로 요청해주세요." });
  }

  let body: unknown = request.method === "GET" ? request.query : request.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return response.status(400).json({ message: "올바른 JSON 형식이 아닙니다." }); }
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    return response.status(400).json({ message: "요청 내용을 확인해주세요." });
  const input = body as Record<string, unknown>;
  const tripId = input.tripId;
  const action = request.method === "GET" ? "read" : input.action;
  if (typeof tripId !== "string" || !UUID.test(tripId))
    return response.status(400).json({ message: "여행 ID를 확인해주세요." });
  if (typeof action !== "string" || (action !== "read" && !ACTIONS.has(action)) || (request.method === "POST" && action === "read"))
    return response.status(400).json({ message: "작업을 확인해주세요." });

  if (action === "budget" && !validMoney(input.budget, false))
    return response.status(400).json({ message: "예산은 0 이상 정수로 입력해주세요." });
  if (action === "delete" || action === "update" || action === "restore") {
    if (typeof input.id !== "string" || !UUID.test(input.id))
      return response.status(400).json({ message: "지출 ID를 확인해주세요." });
  }
  if (["create", "update", "restore"].includes(action)) {
    if (typeof input.title !== "string" || !input.title.trim() || input.title.trim().length > 36 ||
        !validDate(input.date) || !validMoney(input.amount, true) ||
        typeof input.category !== "string" || !CATEGORIES.has(input.category) ||
        typeof input.payerId !== "string" || !UUID.test(input.payerId) ||
        typeof input.payerName !== "string" || input.payerName.length > 100) {
      return response.status(400).json({ message: "지출 항목, 날짜, 금액, 카테고리, 결제자를 확인해주세요." });
    }
  }

  try {
    const supabase = createSupabaseServer(request, response);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      const expired = !authError || authError.name === "AuthSessionMissingError" || [400, 401, 403].includes(authError.status ?? 0);
      return response.status(expired ? 401 : 503).json({ message: expired ? "로그인이 필요합니다." : "로그인 상태를 확인할 수 없습니다." });
    }
    const payload = action === "read" ? {} :
      action === "budget" ? { budget: input.budget } :
      action === "delete" ? { id: input.id } : {
        ...(action !== "create" ? { id: input.id } : {}),
        title: (input.title as string).trim(), date: input.date, amount: input.amount,
        category: input.category, payerId: input.payerId, payerName: input.payerName,
      };
    const { data, error } = await supabase.rpc("routy_budget", {
      p_trip_id: tripId, p_action: action, p_payload: payload,
    });
    if (error) {
      const status = error.code === "42501" ? 403 : error.code === "28000" ? 401 :
        error.code === "22023" || error.code === "23505" || error.code === "23514" ? 400 : 500;
      if (status === 500) console.error("Budget RPC failed:", { code: error.code, message: error.message });
      return response.status(status).json({ message: status === 500 ? "가계부 요청을 처리하지 못했습니다. 추가 SQL 적용 여부를 확인해주세요." : error.message });
    }
    return response.status(200).json(data);
  } catch (error) {
    console.error("Budget handler failed:", error instanceof Error ? error.message : "Unknown error");
    return response.status(500).json({ message: "가계부 처리 중 오류가 발생했습니다." });
  }
}
