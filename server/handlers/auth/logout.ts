import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clearAppSession } from "../../session.js";
import { config } from "dotenv";
import { createSupabaseServer } from "../../supabase.js";

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

  if (typeof origin !== "string" || !allowedOrigins.has(origin)) {
    return response.status(403).json({
      message: "허용되지 않은 출처의 요청입니다.",
    });
  }

  try {
    const startedAt = performance.now();
    const supabase = createSupabaseServer(request, response);
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      return response.status(503).json({
        message: "로그아웃하지 못했습니다. 잠시 후 다시 시도해주세요.",
      });
    }

    // signOut must succeed before removing the app session.
    clearAppSession(request, response, process.env.SUPABASE_URL!);
    response.setHeader("Server-Timing", `signout;dur=${(performance.now() - startedAt).toFixed(1)}`);

    return response.status(200).json({ success: true });
  } catch {
    return response.status(500).json({
      message: "로그아웃 처리 중 오류가 발생했습니다.",
    });
  }
}
