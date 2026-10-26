import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
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

  const appOrigin = process.env.APP_ORIGIN;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!appOrigin || !supabaseUrl || !supabaseKey) {
    return response.status(500).json({
      message: "서버의 환경변수를 확인해주세요.",
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

  const body: unknown = request.body;

  if (body === null || typeof body !== "object") {
    return response.status(400).json({
      message: "회원가입 정보를 확인해주세요.",
    });
  }

  const getText = (key: string): string => {
    if (!(key in body)) return "";

    const value = (body as Record<string, unknown>)[key];

    return typeof value === "string" ? value : "";
  };

  const getAgreement = (key: string): boolean =>
    key in body && (body as Record<string, unknown>)[key] === true;

  const firstName = getText("firstName").trim();
  const lastName = getText("lastName").trim();
  const birth = getText("birth");
  const phone = getText("phone").replace(/\D/g, "");
  const email = getText("email").trim();
  const loginId = getText("username").trim();
  const password = getText("password");

  if (!firstName || !lastName) {
    return response.status(400).json({
      message: "이름과 성을 입력해주세요.",
    });
  }

  const birthDate = new Date(`${birth}T00:00:00.000Z`);
  const today = new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(birth) ||
    Number.isNaN(birthDate.getTime()) ||
    birthDate.toISOString().slice(0, 10) !== birth ||
    birth < "1900-01-01" ||
    birth > today
  ) {
    return response.status(400).json({
      message: "올바른 생년월일을 선택해주세요.",
    });
  }

  if (!/^01[016789]\d{7,8}$/.test(phone)) {
    return response.status(400).json({
      message: "올바른 휴대폰 번호를 입력해주세요.",
    });
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({
      message: "올바른 이메일을 입력해주세요.",
    });
  }

  if (loginId.length < 4 || loginId.length > 30) {
    return response.status(400).json({
      message: "아이디는 4자 이상 30자 이하로 입력해주세요.",
    });
  }

  if (
    password.length < 8 ||
    password.length > 128 ||
    !/[A-Za-z]/.test(password) ||
    !/\d/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    return response.status(400).json({
      message:
        "비밀번호는 영문, 숫자, 특수문자를 포함해 8~128자로 입력해주세요.",
    });
  }

  if (!getAgreement("agreeTerms") || !getAgreement("agreePrivacy")) {
    return response.status(400).json({
      message: "필수 약관에 동의해주세요.",
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data: available, error: checkError } = await supabase.rpc(
      "is_login_id_available",
      {
        p_login_id: loginId,
      },
    );

    if (checkError || typeof available !== "boolean") {
      return response.status(500).json({
        message: "아이디 중복 확인에 실패했습니다.",
      });
    }

    if (!available) {
      return response.status(409).json({
        message: "이미 사용 중인 아이디입니다.",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          login_id: loginId,
          first_name: firstName,
          last_name: lastName,
          birth,
          phone,
          agree_terms: getAgreement("agreeTerms"),
          agree_privacy: getAgreement("agreePrivacy"),
          agree_marketing: getAgreement("agreeMarketing"),
          agree_location: getAgreement("agreeLocation"),
        },
      },
    });

    if (error) {
      console.error("Supabase signup error:", {
        code: error.code,
        status: error.status,
        message: error.message,
      });
      if (error.status === 429) {
        return response.status(429).json({
          message: "요청이 많습니다. 잠시 후 다시 시도해주세요.",
        });
      }

      if (
        error.code === "user_already_exists" ||
        error.code === "email_exists"
      ) {
        return response.status(409).json({
          message: "이미 가입된 이메일입니다.",
        });
      }

      return response.status(400).json({
        message:
          "회원가입에 실패했습니다. 입력 정보와 아이디 중복 여부를 확인해주세요.",
      });
    }

    if (!data.user) {
      return response.status(500).json({
        message: "회원가입 결과를 확인하지 못했습니다.",
      });
    }

    return response.status(200).json({
      success: true,
      message: data.session
        ? "회원가입이 완료되었습니다. 로그인해주세요."
        : "이메일을 확인해주세요. 신규 가입인 경우 인증 메일의 링크를 누른 뒤 로그인해주세요.",
    });
  } catch {
    return response.status(500).json({
      message: "회원가입 처리 중 오류가 발생했습니다.",
    });
  }
}
