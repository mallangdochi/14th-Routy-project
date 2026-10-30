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
          user: null,
        });
      }

      return response.status(503).json({
        message: "로그인 상태를 확인하지 못했습니다.",
      });
    }

    if (!user) {
      return response.status(401).json({
        user: null,
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
  id,
  login_id,
  username,
  avatar_url,
  first_name,
  last_name,
  full_name,
  birth,
  phone,
  agree_terms,
  agree_privacy,
  agree_marketing,
  agree_location,
  invite_notifications,
  itinerary_notifications,
  trip_start_notifications,
  default_itinerary_view,
  agreed_at,
  created_at
`,
      )
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile lookup error:", profileError);

      return response.status(500).json({
        message: "회원 정보를 조회하지 못했습니다.",
      });
    }

    if (!profile) {
      return response.status(409).json({
        message:
          "회원 정보가 없습니다. 회원가입 데이터 저장 상태를 확인해주세요.",
      });
    }

    const nickname =
      typeof profile.username === "string" ? profile.username.trim() : "";

    const avatarUrl =
      typeof profile.avatar_url === "string" ? profile.avatar_url : null;

    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        loginId: profile.login_id,

        username: nickname || null,
        avatarUrl,

        profileCompleted:
          nickname.length >= 2 && nickname.length <= 12 && Boolean(avatarUrl),

        firstName: profile.first_name,
        lastName: profile.last_name,

        fullName:
          typeof profile.full_name === "string" && profile.full_name.trim()
            ? profile.full_name
            : `${profile.last_name ?? ""}${profile.first_name ?? ""}`,

        birth: profile.birth,
        phone: profile.phone,

        agreeTerms: profile.agree_terms,
        agreePrivacy: profile.agree_privacy,
        agreeMarketing: profile.agree_marketing,
        agreeLocation: profile.agree_location,

        settings: {
          inviteNotifications: profile.invite_notifications === true,

          itineraryNotifications: profile.itinerary_notifications === true,

          tripStartNotifications: profile.trip_start_notifications === true,

          locationServiceAllowed: profile.agree_location === true,

          marketingAllowed: profile.agree_marketing === true,

          defaultItineraryView:
            profile.default_itinerary_view === "map" ? "map" : "schedule",
        },

        agreedAt: profile.agreed_at,
        createdAt: profile.created_at,
      },
    });
  } catch (error) {
    console.error("Current user lookup error:", error);

    return response.status(500).json({
      message: "로그인 상태 확인 중 오류가 발생했습니다.",
    });
  }
}
