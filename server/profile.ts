import type { VercelRequest, VercelResponse } from "@vercel/node";

export function allowProfileWrite(
  request: VercelRequest,
  response: VercelResponse,
): boolean {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");

    response.status(405).json({
      message: "허용되지 않은 요청입니다.",
    });

    return false;
  }

  const appOrigin = process.env.APP_ORIGIN;

  if (!appOrigin) {
    response.status(500).json({
      message: "서버의 APP_ORIGIN 설정을 확인해주세요.",
    });

    return false;
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
    response.status(403).json({
      message: "허용되지 않은 접근입니다.",
    });

    return false;
  }

  const contentType = request.headers["content-type"]
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    response.status(415).json({
      message: "JSON 형식으로 요청해주세요.",
    });

    return false;
  }

  return true;
}
