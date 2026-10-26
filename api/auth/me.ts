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

    return response.status(405).json({
      message: "허용되지 않은 요청입니다.",
    });
  }

  try {
    const supabase = createSupabaseServer(request, response);

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      if (
        error.name === "AuthSessionMissingError" ||
        error.status === 400 ||
        error.status === 401 ||
        error.status === 403
      ) {
        return response.status(401).json({ user: null });
      }

      return response.status(503).json({
        message:
          "로그인 상태를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.",
      });
    }

    if (!data.user) {
      return response.status(401).json({ user: null });
    }
    return response.status(200).json({
      user: {
        id: data.user.id,
        email: data.user.email,
        username:
          typeof data.user.user_metadata.username === "string"
            ? data.user.user_metadata.username
            : null,
        profileCompleted: data.user.user_metadata?.profile_completed !== false,
      },
    });
    // return response.status(200).json({
    //   user: {
    //     id: data.user.id,
    //     email: data.user.email,
    //   },
    // });
  } catch {
    return response.status(500).json({
      message: "로그인 상태 확인 중 오류가 발생했습니다.",
    });
  }
}
