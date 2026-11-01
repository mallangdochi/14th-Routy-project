import type { VercelRequest, VercelResponse } from "@vercel/node";
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

  const fields = (["name", "region", "people"] as const).filter((field) =>
    Object.prototype.hasOwnProperty.call(input, field),
  );

  if (fields.length !== 1) {
    return response.status(400).json({
      message: "수정할 여행 정보를 하나만 전달해주세요.",
    });
  }

  const field = fields[0]!;
  let updates: {
    name?: string;
    region?: string;
    people?: number;
  };

  if (field === "people") {
    if (
      typeof input.people !== "number" ||
      !Number.isSafeInteger(input.people) ||
      input.people < 1
    ) {
      return response.status(400).json({
        message: "여행 인원은 1명 이상의 정수로 입력해주세요.",
      });
    }

    updates = { people: input.people };
  } else {
    const value = typeof input[field] === "string" ? input[field].trim() : "";
    const maxLength = field === "name" ? 50 : 100;
    const label = field === "name" ? "여행 이름" : "여행 지역";

    if (!value || value.length > maxLength) {
      return response.status(400).json({
        message: `${label}은 1~${maxLength}자로 입력해주세요.`,
      });
    }

    updates = field === "name" ? { name: value } : { region: value };
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
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tripId)
      .eq("user_id", user.id)
      .select("id, name, region, people, updated_at")
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
      ...(field === "name"
        ? { name: data.name }
        : field === "region"
          ? { region: data.region }
          : { people: data.people }),
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
