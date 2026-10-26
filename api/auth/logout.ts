import type { VercelRequest, VercelResponse } from "@vercel/node";
import { serializeCookieHeader } from "@supabase/ssr";
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

  if (typeof origin !== "string" || !allowedOrigins.has(origin)) {
    return response.status(403).json({
      message: "허용되지 않은 출처의 요청입니다.",
    });
  }
  const contentType = request.headers["content-type"] ?? "";

  if (contentType.split(";")[0].trim().toLowerCase() !== "application/json") {
    return response.status(415).json({
      message: "JSON 형식으로 요청해주세요.",
    });
  }

  try {
    const supabase = createSupabaseServer(request, response);
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      return response.status(503).json({
        message: "로그아웃하지 못했습니다. 잠시 후 다시 시도해주세요.",
      });
    }

    const rememberCookie = serializeCookieHeader("routy_remember", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    const existingHeader = response.getHeader("Set-Cookie");

    const existingCookies =
      existingHeader === undefined
        ? []
        : Array.isArray(existingHeader)
          ? existingHeader.map(String)
          : [String(existingHeader)];

    response.setHeader("Set-Cookie", [...existingCookies, rememberCookie]);

    return response.status(200).json({ success: true });
  } catch {
    return response.status(500).json({
      message: "로그아웃 처리 중 오류가 발생했습니다.",
    });
  }
}
