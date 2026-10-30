import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import { createSupabaseServer } from "../../server/supabase.js";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}

const AVATAR_BUCKET = "profile-avatars";
const MAX_IMAGE_BYTES = 1024 * 1024;

const DEFAULT_AVATAR_IDS = new Set([
  "P1",
  "P2",
  "P3",
  "P7",
  "P8",
  "P9",
  "P10",
  "P11",
  "P12",
  "P13",
]);

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

  const appOrigin = process.env.APP_ORIGIN;

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
      message: "허용되지 않은 접근입니다.",
    });
  }

  if (
    !request.headers["content-type"]
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return response.status(415).json({
      message: "JSON 형식으로 요청해주세요.",
    });
  }

  const body: unknown = request.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return response.status(400).json({
      message: "프로필 정보를 확인해주세요.",
    });
  }

  const values = body as Record<string, unknown>;

  const nickname =
    typeof values.nickname === "string" ? values.nickname.trim() : "";

  if (nickname.length < 2 || nickname.length > 12) {
    return response.status(400).json({
      message: "닉네임은 2~12자로 입력해주세요.",
    });
  }

  const hasImage = values.avatarData !== undefined;
  const hasDefaultAvatar = values.defaultAvatarId !== undefined;

  if (hasImage && hasDefaultAvatar) {
    return response.status(400).json({
      message: "업로드 이미지와 기본 이미지 중 하나만 선택해주세요.",
    });
  }

  let supabase: ReturnType<typeof createSupabaseServer> | undefined;
  let uploadedPath: string | null = null;

  try {
    supabase = createSupabaseServer(request, response);

    // 요청에 담긴 사용자 ID 대신 로그인 쿠키로 본인을 확인합니다.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return response.status(401).json({
        message: "로그인 후 프로필을 설정해주세요.",
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile lookup error:", profileError);

      return response.status(500).json({
        message: "기존 프로필을 조회하지 못했습니다.",
      });
    }

    if (!profile) {
      return response.status(409).json({
        message:
          "회원 정보가 없습니다. 회원가입 데이터 저장 상태를 확인해주세요.",
      });
    }

    // 이미지 변경 요청이 없으면 기존 이미지를 유지합니다.
    let avatarUrl: string | null = profile.avatar_url;

    if (hasImage) {
      const avatarData = values.avatarData;

      // 프론트에서 원본 이미지를 JPEG로 축소 변환해 보낼 예정입니다.
      if (typeof avatarData !== "string" || avatarData.length > 1_400_000) {
        return response.status(400).json({
          message: "이미지 용량을 줄인 후 다시 선택해주세요.",
        });
      }

      const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/]+={0,2})$/.exec(
        avatarData,
      );

      if (!match) {
        return response.status(400).json({
          message: "이미지 데이터 형식이 올바르지 않습니다.",
        });
      }

      const imageBuffer = Buffer.from(match[1], "base64");

      const isJpeg =
        imageBuffer.length >= 4 &&
        imageBuffer[0] === 0xff &&
        imageBuffer[1] === 0xd8 &&
        imageBuffer[2] === 0xff &&
        imageBuffer[imageBuffer.length - 2] === 0xff &&
        imageBuffer[imageBuffer.length - 1] === 0xd9;

      if (!isJpeg || imageBuffer.length > MAX_IMAGE_BYTES) {
        return response.status(400).json({
          message: "이미지 파일 형식이나 용량을 확인해주세요.",
        });
      }

      // Storage 정책에 맞춰 본인 ID 폴더에 저장합니다.
      const filePath = `${user.id}/${randomUUID()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, imageBuffer, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error("Avatar upload error:", uploadError);

        return response.status(500).json({
          message: "프로필 이미지를 업로드하지 못했습니다.",
        });
      }

      uploadedPath = filePath;

      const { data: publicUrlData } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(filePath);

      avatarUrl = publicUrlData.publicUrl;
    } else if (hasDefaultAvatar) {
      const defaultAvatarId = values.defaultAvatarId;

      if (
        typeof defaultAvatarId !== "string" ||
        !DEFAULT_AVATAR_IDS.has(defaultAvatarId)
      ) {
        return response.status(400).json({
          message: "기본 프로필 이미지를 확인해주세요.",
        });
      }

      // 프로젝트에 포함된 기본 이미지는 고정 ID를 저장합니다.
      avatarUrl = `default:${defaultAvatarId}`;
    }

    if (!avatarUrl) {
      return response.status(400).json({
        message: "프로필 이미지를 선택해주세요.",
      });
    }

    const { data: savedProfile, error: saveError } = await supabase
      .from("profiles")
      .update({
        username: nickname,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id)
      .select("id, username, avatar_url")
      .single();

    if (saveError || !savedProfile) {
      throw saveError ?? new Error("프로필 저장 결과가 없습니다.");
    }

    // DB 저장에 성공한 파일은 아래 오류 처리에서 삭제하지 않습니다.
    uploadedPath = null;

    return response.status(200).json({
      success: true,
      profile: {
        id: savedProfile.id,
        username: savedProfile.username,
        avatarUrl: savedProfile.avatar_url,
        profileCompleted: true,
      },
    });
  } catch (error) {
    // 업로드 후 DB 저장이 실패한 경우 새 파일을 정리합니다.
    if (supabase && uploadedPath) {
      try {
        const { error: cleanupError } = await supabase.storage
          .from(AVATAR_BUCKET)
          .remove([uploadedPath]);

        if (cleanupError) {
          console.error("Avatar cleanup error:", cleanupError);
        }
      } catch (cleanupError) {
        console.error("Avatar cleanup error:", cleanupError);
      }
    }

    console.error("Profile setup error:", error);

    return response.status(500).json({
      message: "프로필 저장 중 오류가 발생했습니다.",
    });
  }
}
