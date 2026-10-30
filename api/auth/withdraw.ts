import type { VercelRequest, VercelResponse } from "@vercel/node";

import { createClient } from "@supabase/supabase-js";

import { parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

import { config } from "dotenv";

import { createSupabaseServer } from "../../server/supabase.js";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}
function createAdminClient(supabaseUrl: string, secretKey: string) {
  return createClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

type AdminClient = ReturnType<typeof createAdminClient>;
function parseBody(value: unknown): Record<string, unknown> | null {
  let body = value;

  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return null;
    }
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  return body as Record<string, unknown>;
}

// 본인 프로필 이미지 폴더 안의 파일을 정리합니다.
async function removeAvatarFolder(
  admin: AdminClient,
  folder: string,
): Promise<void> {
  const bucket = admin.storage.from("profile-avatars");

  const files: string[] = [];
  const folders: string[] = [];

  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, error } = await bucket.list(folder, {
      limit,
      offset,
      sortBy: {
        column: "name",
        order: "asc",
      },
    });

    if (error) {
      throw new Error("프로필 이미지 목록을 확인하지 못했습니다.");
    }

    if (!data?.length) {
      break;
    }

    for (const item of data) {
      const path = `${folder}/${item.name}`;

      if (item.id) {
        files.push(path);
      } else {
        folders.push(path);
      }
    }

    if (data.length < limit) {
      break;
    }

    offset += data.length;
  }

  for (const childFolder of folders) {
    await removeAvatarFolder(admin, childFolder);
  }

  for (let index = 0; index < files.length; index += 100) {
    const { error } = await bucket.remove(files.slice(index, index + 100));

    if (error) {
      throw new Error("프로필 이미지를 삭제하지 못했습니다.");
    }
  }
}

function clearLoginCookies(
  request: VercelRequest,
  response: VercelResponse,
  supabaseUrl: string,
) {
  const projectRef = new URL(supabaseUrl).hostname.split(".")[0];

  const authCookieName = `sb-${projectRef}-auth-token`;

  const cookieNames = new Set([
    authCookieName,
    `${authCookieName}-code-verifier`,
    "routy_remember",
    "routy_session",
  ]);

  const requestCookies = parseCookieHeader(request.headers.cookie ?? "");

  for (const { name } of requestCookies) {
    if (
      name === authCookieName ||
      name.startsWith(`${authCookieName}.`) ||
      name === `${authCookieName}-code-verifier`
    ) {
      cookieNames.add(name);
    }
  }

  const existingHeader = response.getHeader("Set-Cookie");

  const existingCookies =
    existingHeader === undefined
      ? []
      : Array.isArray(existingHeader)
        ? existingHeader.map(String)
        : [String(existingHeader)];

  const deletedCookies = Array.from(cookieNames, (name) =>
    serializeCookieHeader(name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }),
  );

  response.setHeader("Set-Cookie", [...existingCookies, ...deletedCookies]);
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");

    return response.status(405).json({
      code: "METHOD_NOT_ALLOWED",
      message: "허용되지 않은 요청입니다.",
    });
  }

  const appOrigin = process.env.APP_ORIGIN;

  if (!appOrigin) {
    return response.status(500).json({
      code: "MISSING_APP_ORIGIN",
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

  if (typeof origin !== "string" || !allowedOrigins.has(origin)) {
    return response.status(403).json({
      code: "INVALID_ORIGIN",
      message: "허용되지 않은 접근입니다.",
    });
  }

  const contentType = request.headers["content-type"]
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return response.status(415).json({
      code: "INVALID_CONTENT_TYPE",
      message: "JSON 형식으로 요청해주세요.",
    });
  }

  const body = parseBody(request.body);

  if (body?.confirm !== true) {
    return response.status(400).json({
      code: "CONFIRM_REQUIRED",
      message: "회원탈퇴 여부를 확인해주세요.",
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    return response.status(500).json({
      code: "MISSING_ADMIN_CONFIG",
      message: "서버의 Supabase 환경변수를 확인해주세요.",
    });
  }

  let deleted = false;

  try {
    const supabase = createSupabaseServer(request, response);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return response.status(401).json({
        code: "UNAUTHORIZED",
        message: "로그인 후 다시 시도해주세요.",
      });
    }

    const admin = createAdminClient(supabaseUrl, secretKey);

    try {
      await removeAvatarFolder(admin, user.id);
    } catch {
      return response.status(500).json({
        code: "AVATAR_DELETE_FAILED",
        message:
          "프로필 이미지 정리 중 오류가 발생해 탈퇴를 완료하지 못했습니다. 다시 시도해주세요.",
      });
    }

    // 요청 본문의 ID가 아닌 로그인한 본인 계정을 삭제합니다.
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Account deletion failed:", {
        code: deleteError.code,
        status: deleteError.status,
      });

      return response.status(500).json({
        code: "ACCOUNT_DELETE_FAILED",
        message:
          "계정을 삭제하지 못했습니다. 연결된 데이터의 삭제 설정을 확인해주세요.",
      });
    }

    deleted = true;

    clearLoginCookies(request, response, supabaseUrl);

    return response.status(200).json({
      success: true,
      message: "회원탈퇴가 완료되었습니다.",
    });
  } catch {
    // 계정 삭제 이후 부가 처리 오류를 탈퇴 실패로 표시하지 않습니다.
    if (deleted) {
      return response.status(200).json({
        success: true,
        message: "회원탈퇴가 완료되었습니다.",
      });
    }

    return response.status(500).json({
      code: "INTERNAL_ERROR",
      message: "회원탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
    });
  }
}
