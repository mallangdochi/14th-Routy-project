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
    return response.status(405).json({ message: "허용되지 않은 요청입니다." });
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
      .map((value) => value.trim())
      .filter(Boolean),
  ]);

  const origin = request.headers.origin;
  if (typeof origin !== "string" || !allowedOrigins.has(origin)) {
    return response.status(403).json({ message: "허용되지 않은 출처입니다." });
  }

  const contentType = request.headers["content-type"] ?? "";
  if (contentType.split(";")[0].trim().toLowerCase() !== "application/json") {
    return response
      .status(415)
      .json({ message: "JSON 형식으로 요청해주세요." });
  }

  const body: unknown =
    typeof request.body === "string"
      ? (() => {
          try {
            return JSON.parse(request.body) as unknown;
          } catch {
            return null;
          }
        })()
      : request.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return response.status(400).json({ message: "입력값을 확인해주세요." });
  }

  const value = "nickname" in body ? body.nickname : null;
  const nickname = typeof value === "string" ? value.trim() : "";

  if (nickname.length < 2 || nickname.length > 12) {
    return response.status(400).json({
      message: "닉네임은 2~12자로 입력해주세요.",
    });
  }

  try {
    const supabase = createSupabaseServer(request, response);
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return response.status(401).json({ message: "로그인이 필요합니다." });
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        nickname,
        profile_completed: true,
      },
    });

    if (updateError) {
      console.error("Initial profile save error:", updateError.message);
      return response.status(503).json({
        message: "프로필을 저장하지 못했습니다. 다시 시도해주세요.",
      });
    }

    return response.status(200).json({ success: true });
  } catch {
    return response.status(500).json({
      message: "프로필 저장 중 오류가 발생했습니다.",
    });
  }
}
