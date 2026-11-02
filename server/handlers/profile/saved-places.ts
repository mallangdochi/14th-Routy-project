import type { VercelRequest, VercelResponse } from "@vercel/node";
import { config } from "dotenv";

import { createSupabaseServer } from "../../supabase.js";
import {
  listSavedPlaces,
  addSavedPlace,
  deleteSavedPlace,
  SavedPlacesInputError,
} from "../../savedPlaces.js";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}
function isAllowedOrigin(request: VercelRequest): boolean {
  const origin = request.headers.origin;

  if (!origin || Array.isArray(origin)) {
    return false;
  }

  try {
    const supplied = new URL(origin);

    if (supplied.protocol !== "https:" && supplied.protocol !== "http:") {
      return false;
    }

    const configuredOrigins = [
      process.env.APP_ORIGIN ?? "",
      ...(process.env.ADDITIONAL_ALLOWED_ORIGINS ?? "").split(","),
    ]
      .map((value) => value.trim())
      .filter(Boolean);

    if (configuredOrigins.length > 0) {
      return configuredOrigins.some((value) => {
        try {
          return supplied.origin === new URL(value).origin;
        } catch {
          return false;
        }
      });
    }

    // 허용 주소 설정이 없으면 현재 서비스와 같은 출처만 허용.
    const host = request.headers.host;

    if (!host) return false;

    const forwardedProtocol = request.headers["x-forwarded-proto"];

    const protocol =
      typeof forwardedProtocol === "string"
        ? forwardedProtocol.split(",")[0].trim()
        : process.env.NODE_ENV === "production"
          ? "https"
          : "http";

    return supplied.origin === new URL(`${protocol}://${host}`).origin;
  } catch {
    return false;
  }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader("Cache-Control", "private, no-store");
  response.setHeader("Referrer-Policy", "no-referrer");

  const method = request.method;
  if (method !== "GET" && method !== "POST" && method !== "DELETE") {
    response.setHeader("Allow", "GET, POST, DELETE");
    return response.status(405).json({ message: "허용되지 않은 요청입니다." });
  }

  if (method !== "GET" && !isAllowedOrigin(request)) {
    return response
      .status(403)
      .json({ message: "허용되지 않은 출처의 요청입니다." });
  }

  if (method !== "GET") {
    const contentType = request.headers["content-type"];
    if (
      typeof contentType !== "string" ||
      contentType.split(";")[0].trim().toLowerCase() !== "application/json"
    ) {
      return response
        .status(415)
        .json({ message: "JSON 형식으로 요청해 주세요." });
    }
  }

  try {
    const supabase = createSupabaseServer(request, response);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return response.status(401).json({ message: "로그인 후 이용해 주세요." });
    }

    if (method === "GET") {
      const places = await listSavedPlaces(supabase, user.id);
      return response.status(200).json({ places });
    }

    const input: unknown =
      typeof request.body === "string"
        ? JSON.parse(request.body)
        : request.body;

    if (method === "POST") {
      const place = await addSavedPlace(supabase, user.id, input);
      return response.status(200).json({ place });
    }

    await deleteSavedPlace(supabase, user.id, input);
    return response.status(200).json({ success: true });
  } catch (error: unknown) {
    if (
      error instanceof SavedPlacesInputError ||
      error instanceof SyntaxError
    ) {
      return response.status(400).json({
        message:
          error instanceof SavedPlacesInputError
            ? error.message
            : "요청 데이터가 올바르지 않습니다.",
      });
    }

    console.error("[profile/saved-places]", error);
    return response
      .status(500)
      .json({ message: "저장한 장소를 처리하지 못했어요." });
  }
}
