import type { VercelRequest, VercelResponse } from "@vercel/node";
import { config } from "dotenv";
import { createSupabaseServer } from "../../server/supabase.js";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}

const TRANSPORT_OPTIONS = new Set([
  "자동차",
  "기차",
  "지하철",
  "버스",
  "택시",
  "도보",
  "비행기",
]);

const STYLE_OPTIONS = new Set([
  "food",
  "nature",
  "culture",
  "rest",
  "activity",
  "shopping",
]);

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  if (value.startsWith("0000-")) return false;

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
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

  // 쿠키를 사용하는 저장 요청이므로 허용한 Origin만 받습니다.
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

  const origin = request.headers.origin;

  if (!origin || !allowedOrigins.has(origin)) {
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

  try {
    // 기존 HttpOnly 쿠키와 앱 세션 검사 사용
    const supabase = createSupabaseServer(request, response);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      if (
        authError.name === "AuthSessionMissingError" ||
        authError.status === 400 ||
        authError.status === 401 ||
        authError.status === 403
      ) {
        return response.status(401).json({
          message: "로그인이 필요합니다. 다시 로그인해주세요.",
        });
      }

      return response.status(503).json({
        message: "로그인 상태를 확인하지 못했습니다.",
      });
    }

    if (!user) {
      return response.status(401).json({
        message: "로그인이 필요합니다. 다시 로그인해주세요.",
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
        message: "여행 정보를 확인해주세요.",
      });
    }

    const input = body as Record<string, unknown>;

    // 여행 이름
    if (input.name !== undefined && typeof input.name !== "string") {
      return response.status(400).json({
        message: "여행 이름을 확인해주세요.",
      });
    }

    // 여행 지역
    if (typeof input.region !== "string" || !input.region.trim()) {
      return response.status(400).json({
        message: "여행할 지역을 선택해주세요.",
      });
    }

    const region = input.region.trim();

    // 여행 날짜
    if (!isValidDate(input.startDate) || !isValidDate(input.endDate)) {
      return response.status(400).json({
        message: "올바른 여행 시작일과 종료일을 선택해주세요.",
      });
    }

    const startDate = input.startDate;
    const endDate = input.endDate;

    if (endDate < startDate) {
      return response.status(400).json({
        message: "종료일은 시작일과 같거나 이후여야 합니다.",
      });
    }

    // 시작 시간
    if (
      typeof input.startTime !== "string" ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.startTime)
    ) {
      return response.status(400).json({
        message: "올바른 시작 시간을 선택해주세요.",
      });
    }

    // 이동 수단: 미선택 시 null
    let transport: string | null = null;

    if (
      input.transport !== undefined &&
      input.transport !== null &&
      input.transport !== ""
    ) {
      if (
        typeof input.transport !== "string" ||
        !TRANSPORT_OPTIONS.has(input.transport)
      ) {
        return response.status(400).json({
          message: "이동 수단을 확인해주세요.",
        });
      }

      transport = input.transport;
    }

    // 여행 인원: 미입력 시 1명
    const people = input.people === undefined ? 1 : input.people;

    if (
      typeof people !== "number" ||
      !Number.isInteger(people) ||
      people < 1 ||
      people > 2147483647
    ) {
      return response.status(400).json({
        message: "여행 인원은 1명 이상의 정수로 입력해주세요.",
      });
    }

    // 여행 스타일: 최대 3개, 중복 선택 금지
    const styles = input.styles === undefined ? [] : input.styles;

    if (!Array.isArray(styles)) {
      return response.status(400).json({
        message: "여행 스타일을 확인해주세요.",
      });
    }

    if (
      styles.length > 3 ||
      styles.some(
        (style) => typeof style !== "string" || !STYLE_OPTIONS.has(style),
      ) ||
      new Set(styles).size !== styles.length
    ) {
      return response.status(400).json({
        message: "여행 스타일은 중복 없이 최대 3개 선택해주세요.",
      });
    }

    // 예상 예산: 미입력 null, 0원은 0으로 저장
    let budget: number | null = null;

    if (input.budget !== undefined && input.budget !== null) {
      if (
        typeof input.budget !== "number" ||
        !Number.isSafeInteger(input.budget) ||
        input.budget < 0 ||
        input.budget > 999999999999
      ) {
        return response.status(400).json({
          message: "예상 예산을 올바르게 입력해주세요.",
        });
      }

      budget = input.budget;
    }

    const name =
      typeof input.name === "string" && input.name.trim()
        ? input.name.trim()
        : `${region} 여행`;

    // 프론트에서 보낸 user_id는 사용하지 않습니다.
    // 서버에서 확인한 로그인 사용자 ID만 저장합니다.
    const { data: trip, error: insertError } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        name,
        region,
        start_date: startDate,
        end_date: endDate,
        start_time: input.startTime,
        transport,
        people,
        styles,
        budget,
      })
      .select(
        `
          id,
          name,
          region,
          start_date,
          end_date,
          start_time,
          transport,
          people,
          styles,
          budget,
          created_at,
          updated_at
        `,
      )
      .single();

    if (insertError) {
      console.error("Trip create error:", {
        code: insertError.code,
        message: insertError.message,
      });

      return response.status(500).json({
        message: "여행 정보를 저장하지 못했습니다.",
      });
    }

    return response.status(201).json({
      message: "여행이 저장되었습니다.",
      trip: {
        id: trip.id,
        name: trip.name,
        region: trip.region,
        startDate: trip.start_date,
        endDate: trip.end_date,
        startTime: trip.start_time.slice(0, 5),
        transport: trip.transport,
        people: trip.people,
        styles: trip.styles,
        budget: trip.budget,
        createdAt: trip.created_at,
        updatedAt: trip.updated_at,
      },
    });
  } catch (error) {
    console.error(
      "Trip create handler error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return response.status(500).json({
      message: "여행 저장 중 오류가 발생했습니다.",
    });
  }
}
