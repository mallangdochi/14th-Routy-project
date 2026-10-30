import type { VercelRequest, VercelResponse } from "@vercel/node";
import { config } from "dotenv";
import { createSupabaseServer } from "../../server/supabase.js";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}

function validDate(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value.startsWith("0000-")
  ) {
    return false;
  }

  const time = Date.parse(`${value}T00:00:00Z`);

  return (
    Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value
  );
}

function validDates(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(validDate);
}

function validId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");

    return response.status(405).json({
      message: "허용되지 않은 요청입니다.",
    });
  }

  if (request.method === "POST") {
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
        .map((value) => value.trim())
        .filter(Boolean),
    ]);

    if (
      !request.headers.origin ||
      !allowedOrigins.has(request.headers.origin)
    ) {
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
  }

  let tripId: unknown = request.query.tripId;
  let dates: string[] = [];
  let expectedDates: string[] = [];

  if (request.method === "POST") {
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
        message: "여행 날짜를 확인해주세요.",
      });
    }

    const input = body as Record<string, unknown>;
    tripId = input.tripId;

    if (
      !validDates(input.dates) ||
      input.dates.length === 0 ||
      !validDates(input.expectedDates)
    ) {
      return response.status(400).json({
        message: "올바른 날짜를 1개 이상 지정해주세요.",
      });
    }

    dates = [...new Set(input.dates)].sort();
    expectedDates = [...new Set(input.expectedDates)].sort();
  }

  if (!validId(tripId)) {
    return response.status(400).json({
      message: "올바른 여행 ID가 필요합니다.",
    });
  }

  try {
    const supabase = createSupabaseServer(request, response);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      const expired =
        authError.name === "AuthSessionMissingError" ||
        authError.status === 400 ||
        authError.status === 401 ||
        authError.status === 403;

      return response.status(expired ? 401 : 503).json({
        message: expired
          ? "로그인이 필요합니다. 다시 로그인해주세요."
          : "로그인 상태를 확인하지 못했습니다.",
      });
    }

    if (!user) {
      return response.status(401).json({
        message: "로그인이 필요합니다.",
      });
    }

    const { data, error } =
      request.method === "POST"
        ? await supabase.rpc("replace_trip_days", {
            p_trip_id: tripId,
            p_dates: dates,
            p_expected_dates: expectedDates,
          })
        : await supabase.rpc("get_trip_days", {
            p_trip_id: tripId,
          });

    if (error) {
      if (error.message.includes("TRIP_DATES_CONFLICT")) {
        return response.status(409).json({
          message:
            "다른 화면에서 날짜가 변경되었습니다. 모달을 닫고 페이지를 새로고침한 뒤 다시 수정해주세요.",
        });
      }

      if (error.message.includes("TRIP_NOT_FOUND")) {
        return response.status(404).json({
          message: "여행이 없거나 수정 권한이 없습니다.",
        });
      }

      if (
        error.code === "22023" ||
        error.code === "22007" ||
        error.code === "22008"
      ) {
        return response.status(400).json({
          message: "여행 날짜를 확인해주세요.",
        });
      }

      console.error("Trip days API error:", {
        code: error.code,
        message: error.message,
      });

      return response.status(500).json({
        message:
          request.method === "POST"
            ? "날짜를 저장하지 못했습니다."
            : "여행 날짜를 조회하지 못했습니다.",
      });
    }

    if (!data) {
      return response.status(404).json({
        message: "여행이 없거나 조회 권한이 없습니다.",
      });
    }

    return response.status(200).json(data);
  } catch (error) {
    console.error(
      "Trip days handler error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return response.status(500).json({
      message: "여행 날짜 처리 중 오류가 발생했습니다.",
    });
  }
}
