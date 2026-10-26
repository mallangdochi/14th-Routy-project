import type { VercelRequest, VercelResponse } from "@vercel/node";
import { config } from "dotenv";
import { createSupabaseServer } from "../../server/supabase.js";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");

    return response.status(405).json({
      message: "허용되지 않은 요청입니다.",
    });
  }

  const appOrigin = process.env.APP_ORIGIN;

  if (!appOrigin) {
    return response.status(500).json({
      message: "서버의 APP_ORIGIN 설정을 확인해주세요.",
    });
  }

  const allowedOrigins = new Set([
    appOrigin,
    ...(process.env.ADDITIONAL_ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ]);

  const origin = request.headers.origin;

  if (!origin || !allowedOrigins.has(origin)) {
    return response.status(403).json({
      message: "허용되지 않은 접근입니다.",
    });
  }

  const body: unknown = request.body;

  if (
    body === null ||
    typeof body !== "object" ||
    !("username" in body) ||
    typeof body.username !== "string"
  ) {
    return response.status(400).json({
      message: "아이디를 입력해주세요.",
    });
  }

  const loginId = body.username.trim();

  if (loginId.length < 4 || loginId.length > 30) {
    return response.status(400).json({
      message: "아이디는 4자 이상 30자 이하로 입력해주세요.",
    });
  }

  try {
    const supabase = createSupabaseServer(request, response);

    const { data, error } = await supabase.rpc("is_login_id_available", {
      p_login_id: loginId,
    });

    if (error || typeof data !== "boolean") {
      return response.status(500).json({
        message: "아이디 중복 확인에 실패했습니다.",
      });
    }

    return response.status(200).json({
      available: data,
    });
  } catch {
    return response.status(500).json({
      message: "아이디 중복 확인 중 오류가 발생했습니다.",
    });
  }
}
