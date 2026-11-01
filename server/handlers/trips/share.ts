import type { VercelRequest, VercelResponse } from "@vercel/node";
import { config } from "dotenv";
import { createSupabaseServer } from "../../supabase.js";

if (process.env.NODE_ENV !== "production") config({ path: ".env.local" });
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader("X-Routy-Share-Version", "members-save-v2");
  response.setHeader("Cache-Control", "private, no-store");
  response.setHeader("Referrer-Policy", "no-referrer");
  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ message: "허용되지 않은 요청입니다." });
  }
  let input: Record<string, unknown>;
  if (request.method === "POST") {
    const origin = process.env.APP_ORIGIN?.trim();
    if (!origin)
      return response
        .status(500)
        .json({ message: "서버의 APP_ORIGIN 설정을 확인해주세요." });
    const allowed = new Set([
      origin,
      ...(process.env.ADDITIONAL_ALLOWED_ORIGINS ?? "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    ]);
    if (!request.headers.origin || !allowed.has(request.headers.origin)) {
      return response
        .status(403)
        .json({ message: "허용되지 않은 요청 출처입니다." });
    }
    if (
      request.headers["content-type"]?.split(";")[0].trim().toLowerCase() !==
      "application/json"
    ) {
      return response
        .status(415)
        .json({ message: "JSON 형식으로 요청해주세요." });
    }
    let body: unknown = request.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return response
          .status(400)
          .json({ message: "올바른 JSON이 필요합니다." });
      }
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      return response
        .status(400)
        .json({ message: "요청 내용을 확인해주세요." });
    input = body as Record<string, unknown>;
  } else input = { ...request.query, action: request.query.operation };
  const { action, tripId } = input;

  const actions =
    request.method === "GET"
      ? ["participants", "detail"]
      : [
          "create",
          "accept",
          "revoke",
          "update",
          "members_save",
          "member_remove",
          "leave",
        ];

  if (typeof action !== "string" || !actions.includes(action)) {
    return response.status(400).json({
      message: `지원하지 않는 작업입니다: ${String(action)}`,
    });
  }

  if (typeof tripId !== "string" || !uuid.test(tripId)) {
    return response.status(400).json({
      message: "여행 ID가 올바른 UUID 형식이 아닙니다.",
    });
  }

  if (
    action === "accept" &&
    (typeof input.token !== "string" || !/^[a-f0-9]{64}$/.test(input.token))
  ) {
    return response
      .status(400)
      .json({ message: "유효하지 않은 초대 링크입니다." });
  }
  const patch = Object.fromEntries(
    ["name", "region", "people"]
      .filter((key) => Object.prototype.hasOwnProperty.call(input, key))
      .map((key) => [key, input[key]]),
  );
  if (action === "update" && Object.keys(patch).length !== 1) {
    return response
      .status(400)
      .json({ message: "수정할 항목을 하나만 전달해주세요." });
  }
  if (action === "members_save") {
    if (
      !Number.isInteger(input.editorLimit) ||
      Number(input.editorLimit) < 1 ||
      Number(input.editorLimit) > 2147483647 ||
      !Array.isArray(input.permissions) ||
      input.permissions.length > 1000
    ) {
      return response
        .status(400)
        .json({ message: "편집 가능 인원과 권한을 확인해주세요." });
    }
    const removed = input.removedUserIds ?? [];
    if (
      !Array.isArray(removed) ||
      removed.length > 1000 ||
      removed.some((id) => typeof id !== "string" || !uuid.test(id)) ||
      new Set(removed.map((id) => id.toLowerCase())).size !== removed.length
    ) {
      return response
        .status(400)
        .json({ message: "내보낼 참여자를 확인해주세요." });
    }
    input.removedUserIds = removed;
    const seen = new Set<string>();
    for (const item of input.permissions) {
      if (
        !item ||
        typeof item !== "object" ||
        typeof item.userId !== "string" ||
        !uuid.test(item.userId) ||
        seen.has(item.userId) ||
        !["editor", "viewer"].includes(item.permission)
      )
        return response
          .status(400)
          .json({ message: "변경할 참여자 권한을 확인해주세요." });
      seen.add(item.userId);
    }
  }
  if (
    action === "member_remove" &&
    (typeof input.userId !== "string" || !uuid.test(input.userId))
  )
    return response.status(400).json({ message: "참여자 ID를 확인해주세요." });
  try {
    const supabase = createSupabaseServer(request, response);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return response
        .status(401)
        .json({ message: "로그인 후 다시 시도해주세요." });
    const { data, error } = await supabase.rpc("routy_trip_share", {
      p_action: action,
      p_trip_id: tripId,
      p_permission:
        action === "create" || action === "revoke"
          ? String(input.permission)
          : "viewer",
      p_token: action === "accept" ? String(input.token) : null,

      p_patch:
        action === "update"
          ? patch
          : action === "members_save"
            ? {
                editorLimit: input.editorLimit,
                permissions: input.permissions,
                removedUserIds: input.removedUserIds ?? [],
              }
            : action === "member_remove"
              ? { userId: input.userId }
              : {},
    });
    if (error) {
      const status =
        error.code === "42501"
          ? 403
          : error.code === "22023"
            ? 400
            : error.code === "28000"
              ? 401
              : 500;
      // Never log request bodies or invite tokens.
      console.error("Trip sharing RPC failed", { code: error.code, action });
      return response.status(status).json({
        message:
          status === 500
            ? "공유 기능을 처리하지 못했습니다. SQL 적용 여부를 확인해주세요."
            : error.message,
      });
    }
    return response.status(200).json(data);
  } catch {
    return response
      .status(500)
      .json({ message: "여행 공유 처리 중 오류가 발생했습니다." });
  }
}
