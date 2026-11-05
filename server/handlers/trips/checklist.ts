import type { VercelRequest, VercelResponse } from "@vercel/node";
import { config } from "dotenv";
import { createSupabaseServer } from "../../supabase.js";

if (process.env.NODE_ENV !== "production") config({ path: ".env.local" });
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const categories = ["필수품", "개인용품", "기타"];

export function validChecklist(value: unknown): boolean {
  if (!Array.isArray(value) || value.length !== 3) return false;
  const ids = new Set<string>();
  const titles = new Set<string>();
  let count = 0;
  return value.every((group, index) => {
    if (!group || typeof group !== "object" || group.id !== categories[index] || group.title !== categories[index] || !Array.isArray(group.items)) return false;
    return group.items.every((item: Record<string, unknown>) => {
      if (++count > 1000 || !item || typeof item !== "object" ||
        typeof item.id !== "string" || !uuid.test(item.id) || ids.has(item.id.toLowerCase()) ||
        typeof item.title !== "string" || !item.title.trim() || item.title.length > 60 ||
        typeof item.description !== "string" || item.description.length > 200 || typeof item.checked !== "boolean") return false;
      const title = item.title.trim().replace(/\s+/g, "").toLowerCase();
      if (titles.has(title)) return false;
      ids.add(item.id.toLowerCase()); titles.add(title);
      return true;
    });
  });
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Cache-Control", "private, no-store");
  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ message: "허용되지 않은 요청입니다." });
  }
  let input: Record<string, unknown>;
  if (request.method === "POST") {
    const configured = process.env.APP_ORIGIN?.trim();
    if (!configured) return response.status(500).json({ message: "서버의 APP_ORIGIN 설정을 확인해주세요." });
    const allowed = [configured, ...(process.env.ADDITIONAL_ALLOWED_ORIGINS ?? "").split(",").map(value => value.trim()).filter(Boolean)]
      .map(value => { try { return new URL(value).origin; } catch { return ""; } }).filter(Boolean);
    if (!request.headers.origin || !allowed.includes(request.headers.origin)) return response.status(403).json({ message: "허용되지 않은 요청 출처입니다." });
    if (request.headers["content-type"]?.split(";")[0].trim().toLowerCase() !== "application/json") return response.status(415).json({ message: "JSON 형식으로 요청해주세요." });
    let body: unknown = request.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { return response.status(400).json({ message: "올바른 JSON이 필요합니다." }); }
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) return response.status(400).json({ message: "요청 내용을 확인해주세요." });
    input = body as Record<string, unknown>;
    if (!Number.isSafeInteger(input.version) || Number(input.version) < 0 || !validChecklist(input.groups)) return response.status(400).json({ message: "체크리스트 데이터와 저장 버전을 확인해주세요." });
  } else input = request.query;
  if (typeof input.tripId !== "string" || !uuid.test(input.tripId)) return response.status(400).json({ message: "여행 ID를 확인해주세요." });
  try {
    const supabase = createSupabaseServer(request, response);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      const unavailable = authError && authError.name !== "AuthSessionMissingError" && ![400, 401, 403].includes(authError.status ?? 0);
      return response.status(unavailable ? 503 : 401).json({ message: unavailable ? "로그인 상태를 확인하지 못했습니다." : "로그인이 필요합니다." });
    }
    const { data, error } = await supabase.rpc("routy_checklist", {
      p_trip_id: input.tripId,
      p_action: request.method === "GET" ? "read" : "replace",
      p_groups: request.method === "POST" ? input.groups : null,
      p_expected_version: request.method === "POST" ? input.version : null,
    });
    if (error) {
      const status = error.code === "42501" ? 403 : error.code === "40001" ? 409 : error.code === "22023" ? 400 : 500;
      if (status === 500) console.error("Checklist RPC error:", { code: error.code, message: error.message });
      return response.status(status).json({ message: status === 500 ? "체크리스트를 처리하지 못했습니다. DB 적용 상태를 확인해주세요." : error.message });
    }
    return response.status(200).json(data);
  } catch (error) {
    console.error("Checklist handler error:", error instanceof Error ? error.message : "Unknown error");
    return response.status(500).json({ message: "체크리스트 처리 중 오류가 발생했습니다." });
  }
}
