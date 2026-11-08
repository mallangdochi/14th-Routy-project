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
  response.setHeader("X-Routy-Trip-List-Version", "shared-roles-v2");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");

    return response.status(405).json({
      message: "허용되지 않은 요청입니다.",
    });
  }

  try {
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

    const { data, error } = await supabase.rpc("routy_my_trips");

    if (error) {
      console.error("Trip list error:", {
        code: error.code,
        message: error.message,
      });

      return response.status(error.code === "42501" ? 403 : 503).json({
        message: error.code === "42501" ? "로그인이 필요합니다." : "여행 목록을 조회하지 못했습니다. 권한 SQL 적용 여부를 확인해주세요.",
      });
    }

    if (!Array.isArray(data)) {
      return response.status(503).json({ message: "여행 목록 응답을 확인하지 못했습니다." });
    }
    const trips = data;

    return response.status(200).json({ trips });
  } catch (error) {
    console.error(
      "Trip list handler error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return response.status(500).json({
      message: "여행 조회 중 오류가 발생했습니다.",
    });
  }
}
