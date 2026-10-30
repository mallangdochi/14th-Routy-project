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

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ message: "허용되지 않은 요청입니다." });
  }

  const id = request.query.id;

  if (
    typeof id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    return response.status(400).json({ message: "올바른 여행 ID가 필요합니다." });
  }

  try {
    const supabase = createSupabaseServer(request, response);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

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
      return response.status(401).json({ message: "로그인이 필요합니다." });
    }

    const { data: trip, error } = await supabase
      .from("trips")
      .select(`
        id, name, region, start_date, end_date, start_time,
        transport, people, styles, budget, created_at, updated_at
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Trip detail lookup error:", {
        code: error.code,
        message: error.message,
      });
      return response.status(500).json({ message: "여행 정보를 조회하지 못했습니다." });
    }

    if (!trip) {
      return response.status(404).json({ message: "여행이 없거나 조회 권한이 없습니다." });
    }

    return response.status(200).json({
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
      "Trip detail handler error:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return response.status(500).json({ message: "여행 조회 중 오류가 발생했습니다." });
  }
}
