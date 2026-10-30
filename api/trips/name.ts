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

  const appOrigin = process.env.APP_ORIGIN?.trim();

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

  if (!request.headers.origin || !allowedOrigins.has(request.headers.origin)) {
    return response.status(403).json({
      message: "허용되지 않은 요청 출처입니다.",
    });
  }

  const contentType = request.headers["content-type"]
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return response.status(415).json({
      message: "JSON 형식으로 요청해주세요.",
    });
  }

  let body: unknown = request.body;

  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return response.status(400).json({
        message: "올바른 JSON 형식으로 요청해주세요.",
      });
    }
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return response.status(400).json({
      message: "여행 이름을 확인해주세요.",
    });
  }

  const input = body as Record<string, unknown>;
  const tripId = input.tripId;
  const name = typeof input.name === "string" ? input.name.trim() : "";

  if (
    typeof tripId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      tripId,
    )
  ) {
    return response.status(400).json({
      message: "올바른 여행 ID가 필요합니다.",
    });
  }

  if (!name || name.length > 50) {
    return response.status(400).json({
      message: "여행 이름은 1~50자로 입력해주세요.",
    });
  }

  try {
    const supabase = createSupabaseServer(request, response);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return response.status(401).json({
        message: "로그인 상태를 확인하고 다시 시도해주세요.",
      });
    }

    const { data, error } = await supabase
      .from("trips")
      .update({
        name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tripId)
      .eq("user_id", user.id)
      .select("id, name, updated_at")
      .maybeSingle();

    if (error) {
      console.error("Trip name update error:", {
        code: error.code,
        message: error.message,
      });

      return response.status(500).json({
        message: "여행 이름을 저장하지 못했습니다.",
      });
    }

    if (!data) {
      return response.status(404).json({
        message: "여행이 없거나 수정 권한이 없습니다.",
      });
    }

    return response.status(200).json({
      tripId: data.id,
      name: data.name,
      updatedAt: data.updated_at,
    });
  } catch (error) {
    console.error(
      "Trip name handler error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return response.status(500).json({
      message: "여행 이름 저장 중 오류가 발생했습니다.",
    });
  }
}
