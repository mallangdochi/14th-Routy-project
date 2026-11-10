import type { VercelRequest, VercelResponse } from "@vercel/node";

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

import { createSupabaseServer } from "../../supabase.js";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}

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

  if (!body) {
    return response.status(400).json({
      code: "INVALID_BODY",
      message: "입력값을 확인해주세요.",
    });
  }

  if (
    body.action !== "account" &&
    body.action !== "password" &&
    body.action !== "settings"
  ) {
    return response.status(400).json({
      code: "INVALID_ACTION",
      message: "지원하지 않는 요청입니다.",
    });
  }

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

    // ─────────────────────────────
    // 비밀번호 변경
    // ─────────────────────────────
    if (body.action === "password") {
      const currentPassword =
        typeof body.currentPassword === "string" ? body.currentPassword : "";

      const newPassword =
        typeof body.newPassword === "string" ? body.newPassword : "";

      const confirmPassword =
        typeof body.confirmPassword === "string" ? body.confirmPassword : "";

      if (!currentPassword || !newPassword || !confirmPassword) {
        return response.status(400).json({
          code: "REQUIRED",
          message: "비밀번호를 모두 입력해주세요.",
        });
      }

      if (newPassword !== confirmPassword) {
        return response.status(400).json({
          code: "CONFIRM_MISMATCH",
          message: "새 비밀번호가 일치하지 않습니다.",
        });
      }

      if (currentPassword === newPassword) {
        return response.status(400).json({
          code: "SAME_PASSWORD",
          message: "현재 비밀번호와 다른 새 비밀번호를 입력해주세요.",
        });
      }

      if (!user.email) {
        return response.status(400).json({
          code: "UNSUPPORTED_ACCOUNT",
          message: "이 계정에서는 이메일 비밀번호 변경을 사용할 수 없습니다.",
        });
      }

      const supabaseUrl = process.env.SUPABASE_URL;
      const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !publishableKey) {
        return response.status(500).json({
          code: "MISSING_SUPABASE_CONFIG",
          message: "서버의 Supabase 환경변수를 확인해주세요.",
        });
      }

      // 현재 로그인 쿠키에 영향을 주지 않는 검증용 클라이언트입니다.
      const verifier = createClient(supabaseUrl, publishableKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      const { data: verified, error: verificationError } =
        await verifier.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

      if (verificationError) {
        if (verificationError.code === "invalid_credentials") {
          return response.status(400).json({
            code: "CURRENT_PASSWORD_MISMATCH",
            message: "현재 비밀번호와 달라 비밀번호 수정이 실패하였습니다.",
          });
        }

        const rateLimited = verificationError.status === 429;

        return response.status(rateLimited ? 429 : 400).json({
          code: "VERIFICATION_FAILED",
          message: rateLimited
            ? "요청이 많습니다. 잠시 후 다시 시도해주세요."
            : "현재 비밀번호를 확인하지 못했습니다. 다시 시도해주세요.",
        });
      }

      if (!verified.user || verified.user.id !== user.id) {
        return response.status(400).json({
          code: "CURRENT_PASSWORD_MISMATCH",
          message: "현재 비밀번호와 달라 비밀번호 수정이 실패하였습니다.",
        });
      }

      // 현재 비밀번호 확인이 끝난 뒤 새 비밀번호를 저장합니다.
      const passwordUpdate = {
        password: newPassword,
        current_password: currentPassword,
      };

      const { error: passwordError } =
        await supabase.auth.updateUser(passwordUpdate);

      if (passwordError) {
        let code = "PASSWORD_UPDATE_FAILED";
        let message = "비밀번호를 변경하지 못했습니다. 다시 시도해주세요.";

        if (passwordError.code === "current_password_invalid") {
          code = "CURRENT_PASSWORD_MISMATCH";
          message = "현재 비밀번호와 달라 비밀번호 수정이 실패하였습니다.";
        } else if (passwordError.code === "same_password") {
          code = "SAME_PASSWORD";
          message = "현재 비밀번호와 다른 새 비밀번호를 입력해주세요.";
        } else if (passwordError.code === "weak_password") {
          message = "새 비밀번호가 비밀번호 보안 조건을 충족하지 않습니다.";
        } else if (
          passwordError.code === "reauthentication_needed" ||
          passwordError.code === "reauthentication_not_valid"
        ) {
          code = "REAUTHENTICATION_REQUIRED";
          message = "다시 로그인한 뒤 비밀번호를 변경해주세요.";
        }

        return response.status(400).json({
          code,
          message,
        });
      }

      return response.status(200).json({
        success: true,
        emailPending: false,
        message: "비밀번호가 변경되었습니다.",
      });
    }

    // ─────────────────────────────
    // 알림 및 서비스 설정
    // ─────────────────────────────
    if (body.action === "settings") {
      if (
        typeof body.inviteNotifications !== "boolean" ||
        typeof body.itineraryNotifications !== "boolean" ||
        typeof body.tripStartNotifications !== "boolean" ||
        typeof body.locationServiceAllowed !== "boolean" ||
        typeof body.marketingAllowed !== "boolean" ||
        (body.defaultItineraryView !== "schedule" &&
          body.defaultItineraryView !== "map")
      ) {
        return response.status(400).json({
          code: "INVALID_SETTINGS",
          message: "설정값을 확인해주세요.",
        });
      }

      const { data: saved, error: saveError } = await supabase
        .from("profiles")
        .update({
          invite_notifications: body.inviteNotifications,
          itinerary_notifications: body.itineraryNotifications,
          trip_start_notifications: body.tripStartNotifications,
          agree_location: body.locationServiceAllowed,
          agree_marketing: body.marketingAllowed,
          default_itinerary_view: body.defaultItineraryView,
        })
        .eq("id", user.id)
        .select("id")
        .maybeSingle();

      if (saveError) {
        console.error("Settings update error:", {
          code: saveError.code,
          message: saveError.message,
        });

        return response.status(500).json({
          code: "SETTINGS_SAVE_FAILED",
          message: "설정을 저장하지 못했습니다.",
        });
      }

      if (!saved) {
        return response.status(409).json({
          code: "PROFILE_NOT_UPDATED",
          message:
            "수정할 회원 정보가 없습니다. 회원 데이터와 수정 권한을 확인해주세요.",
        });
      }

      return response.status(200).json({
        success: true,
        emailPending: false,
        message: "설정이 저장되었습니다.",
      });
    }

    // ─────────────────────────────
    // 회원정보 수정
    // ─────────────────────────────
    const hasName = Object.prototype.hasOwnProperty.call(body, "name");
    const hasPhone = Object.prototype.hasOwnProperty.call(body, "phone");
    const hasEmail = Object.prototype.hasOwnProperty.call(body, "email");
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (hasName && (!name || name.length > 100)) {
      return response.status(400).json({ code: "INVALID_NAME", message: "이름은 1~100자로 입력해주세요." });
    }
    if (hasPhone && !/^01[016789]\d{7,8}$/.test(phone)) {
      return response.status(400).json({ code: "INVALID_PHONE", message: "핸드폰번호를 확인해주세요." });
    }
    if (hasEmail && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return response.status(400).json({ code: "INVALID_EMAIL", message: "이메일 형식을 확인해주세요." });
    }
    const emailChanged = hasEmail && email !== (user.email ?? "").toLowerCase();
    const profileUpdate: { full_name?: string; phone?: string } = {};
    if (hasName) profileUpdate.full_name = name;
    if (hasPhone) profileUpdate.phone = phone;

    // 관리자 키는 서버에서만 사용하며, 대상은 검증된 세션의 본인 ID로 고정합니다.
    if (emailChanged) {
      const url = process.env.SUPABASE_URL;
      const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
      if (!url || !adminKey) {
        return response.status(500).json({
          code: "EMAIL_SERVER_CONFIG_MISSING",
          message: "서버의 이메일 변경 환경설정을 확인해주세요.",
        });
      }
      const admin = createClient(url, adminKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      });
      const { data, error } = await admin.auth.admin.updateUserById(user.id, {
        email,
        email_confirm: true,
      });
      if (error) {
        const providerCode = error.code ?? "unknown";
        const providerStatus = error.status ?? 0;
        const duplicate = providerCode === "email_exists" || providerCode === "user_already_exists";
        const denied = providerStatus === 401 || providerStatus === 403
          || providerCode === "not_admin" || providerCode === "bad_jwt";
        const databaseError = providerCode === "unexpected_failure";
        // 개인 정보와 키를 제외한 진단 정보만 기록합니다.
        console.error("Account email update failed", { providerCode, providerStatus });
        const explanation = duplicate
          ? "이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요."
          : denied
            ? "API 서버의 Supabase 관리자 키가 유효하지 않거나 권한이 없습니다. SUPABASE_URL과 같은 프로젝트의 service_role 키인지 확인해주세요."
            : databaseError
              ? "Supabase에서 사용자 정보를 저장하지 못했습니다. Auth 로그와 auth.users 관련 DB 트리거를 확인해주세요."
              : "Supabase에서 이메일 변경을 거부했습니다.";
        return response.status(duplicate ? 409 : denied ? 500 : 502).json({
          code: duplicate ? "EMAIL_EXISTS" : denied ? "EMAIL_ADMIN_AUTH_FAILED" : "EMAIL_UPDATE_FAILED",
          providerCode,
          providerStatus,
          message: `${explanation} [${providerCode} / ${providerStatus}]`,
        });
      }
      if (data.user?.id !== user.id || data.user.email?.toLowerCase() !== email) {
        return response.status(502).json({ code: "EMAIL_UPDATE_FAILED", message: "이메일 변경 결과를 확인하지 못했습니다. 다시 확인해주세요." });
      }
    }

    if (Object.keys(profileUpdate).length > 0) {
      const { data: saved, error } = await supabase.from("profiles")
        .update(profileUpdate).eq("id", user.id).select("id").maybeSingle();
      if (error || !saved) {
        return response.status(error ? 500 : 409).json({
          code: "ACCOUNT_SAVE_FAILED",
          message: emailChanged
            ? "이메일은 변경되었습니다. 이름 또는 핸드폰번호를 저장하지 못했습니다. 다시 저장해주세요."
            : "회원 정보를 저장하지 못했습니다. 다시 시도해주세요.",
        });
      }
    }
    return response.status(200).json({
      success: true,
      emailPending: false,
      message: !hasName && !hasPhone && !hasEmail ? "변경된 내용이 없습니다." : "회원 정보가 저장되었습니다.",
    });
  } catch {
    // 비밀번호와 요청 본문은 로그에 남기지 않습니다.
    return response.status(500).json({
      code: "INTERNAL_ERROR",
      message:
        "요청 처리 중 오류가 발생했습니다. 최신 저장 상태를 확인한 뒤 다시 시도해주세요.",
    });
  }
}
