// import type { VercelRequest, VercelResponse } from "@vercel/node";
// import { serializeCookieHeader } from "@supabase/ssr";
// import { createSupabaseServer } from "../../server/supabase.js";
// import { config } from "dotenv";

// if (process.env.NODE_ENV !== "production") {
//   config({ path: ".env.local" });
// }

// export default async function handler(
//   request: VercelRequest,
//   response: VercelResponse,
// ) {
//   response.setHeader("Cache-Control", "private, no-store");

//   if (request.method !== "POST") {
//     response.setHeader("Allow", "POST");

//     return response.status(405).json({
//       message: "허용되지 않은 요청입니다.",
//     });
//   }

//   const appOrigin = process.env.APP_ORIGIN;

//   if (!appOrigin) {
//     return response.status(500).json({
//       message: "서버의 APP_ORIGIN 설정을 확인해주세요.",
//     });
//   }

//   const allowedOrigins = new Set([
//     appOrigin,
//     ...(process.env.ADDITIONAL_ALLOWED_ORIGINS ?? "")
//       .split(",")
//       .map((origin) => origin.trim())
//       .filter(Boolean),
//   ]);

//   const origin = request.headers.origin;

//   if (typeof origin !== "string" || !allowedOrigins.has(origin)) {
//     return response.status(403).json({
//       message: "허용되지 않은 출처의 요청입니다.",
//     });
//   }
//   const contentType = request.headers["content-type"] ?? "";

//   if (contentType.split(";")[0].trim().toLowerCase() !== "application/json") {
//     return response.status(415).json({
//       message: "JSON 형식으로 요청해주세요.",
//     });
//   }
//   try {
//     const body: unknown =
//       typeof request.body === "string"
//         ? JSON.parse(request.body)
//         : request.body;

//     if (!body || typeof body !== "object" || Array.isArray(body)) {
//       return response.status(400).json({
//         message: "입력값을 확인해주세요.",
//       });
//     }

//     const { email, password, remember } = body as Record<string, unknown>;

//     if (
//       typeof email !== "string" ||
//       typeof password !== "string" ||
//       typeof remember !== "boolean" ||
//       !email.trim() ||
//       !password ||
//       email.length > 254 ||
//       password.length > 4096
//     ) {
//       return response.status(400).json({
//         message: "이메일과 비밀번호를 확인해주세요.",
//       });
//     }

//     const supabase = createSupabaseServer(request, response, {
//       remember,
//     });

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email: email.trim(),
//       password,
//     });

//     if (error) {
//       if (error.code === "email_not_confirmed") {
//         return response.status(401).json({
//           message: "이메일 인증을 완료한 뒤 로그인해주세요.",
//         });
//       }

//       if (error.status === 429) {
//         return response.status(429).json({
//           message: "요청이 많습니다. 잠시 후 다시 시도해주세요.",
//         });
//       }

//       return response.status(401).json({
//         message: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
//       });
//     }

//     if (!data.user || !data.session) {
//       return response.status(401).json({
//         message: "로그인 세션을 생성하지 못했습니다.",
//       });
//     }

//     const rememberCookie = serializeCookieHeader(
//       "routy_remember",
//       String(remember),
//       {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         path: "/",
//         ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
//       },
//     );

//     const existingHeader = response.getHeader("Set-Cookie");

//     const existingCookies =
//       existingHeader === undefined
//         ? []
//         : Array.isArray(existingHeader)
//           ? existingHeader.map(String)
//           : [String(existingHeader)];

//     response.setHeader("Set-Cookie", [...existingCookies, rememberCookie]);

//     return response.status(200).json({
//       user: {
//         id: data.user.id,
//         email: data.user.email,
//         username:
//           typeof data.user.user_metadata.username === "string"
//             ? data.user.user_metadata.username
//             : null,
//       },
//     });
//   } catch (error) {
//     if (error instanceof SyntaxError) {
//       return response.status(400).json({
//         message: "요청 형식을 확인해주세요.",
//       });
//     }

//     return response.status(500).json({
//       message: "로그인 처리 중 오류가 발생했습니다.",
//     });
//   }
// }

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { serializeCookieHeader } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "../../server/supabase.js";
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
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!appOrigin || !supabaseUrl || !supabaseSecretKey) {
    return response.status(500).json({
      message: "서버의 로그인 환경변수를 확인해주세요.",
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
      message: "허용되지 않은 출처의 요청입니다.",
    });
  }

  const contentType = request.headers["content-type"] ?? "";

  if (contentType.split(";")[0].trim().toLowerCase() !== "application/json") {
    return response.status(415).json({
      message: "JSON 형식으로 요청해주세요.",
    });
  }

  try {
    const body: unknown =
      typeof request.body === "string"
        ? JSON.parse(request.body)
        : request.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return response.status(400).json({
        message: "입력값을 확인해주세요.",
      });
    }

    const { loginId, password, remember } = body as Record<string, unknown>;

    if (
      typeof loginId !== "string" ||
      typeof password !== "string" ||
      typeof remember !== "boolean" ||
      loginId.trim().length < 4 ||
      loginId.trim().length > 30 ||
      !password ||
      password.length > 4096
    ) {
      return response.status(400).json({
        message: "아이디는 4~30자로 입력하고 비밀번호를 확인해주세요.",
      });
    }

    const admin = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const escapedLoginId = loginId.trim().replace(/[\\%_]/g, "\\$&");

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, username")
      .ilike("login_id", escapedLoginId)
      .maybeSingle();

    if (profileError) {
      console.error("Login profile lookup error:", {
        code: profileError.code,
        message: profileError.message,
      });

      return response.status(500).json({
        message: "로그인 처리 중 오류가 발생했습니다.",
      });
    }

    if (!profile) {
      return response.status(401).json({
        message: "아이디 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const { data: account, error: accountError } =
      await admin.auth.admin.getUserById(profile.id);

    if (accountError || !account.user?.email) {
      return response.status(401).json({
        message: "아이디 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const supabase = createSupabaseServer(request, response, {
      remember,
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: account.user.email,
      password,
    });

    if (error) {
      if (error.code === "email_not_confirmed") {
        return response.status(401).json({
          message: "이메일 인증을 완료한 뒤 로그인해주세요.",
        });
      }

      if (error.status === 429) {
        return response.status(429).json({
          message: "요청이 많습니다. 잠시 후 다시 시도해주세요.",
        });
      }

      return response.status(401).json({
        message: "아이디 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    if (!data.user || !data.session) {
      return response.status(401).json({
        message: "로그인 세션을 생성하지 못했습니다.",
      });
    }

    const rememberCookie = serializeCookieHeader(
      "routy_remember",
      String(remember),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
      },
    );

    const existingHeader = response.getHeader("Set-Cookie");

    const existingCookies =
      existingHeader === undefined
        ? []
        : Array.isArray(existingHeader)
          ? existingHeader.map(String)
          : [String(existingHeader)];

    response.setHeader("Set-Cookie", [...existingCookies, rememberCookie]);

    return response.status(200).json({
      user: {
        id: data.user.id,
        email: data.user.email,
        username: profile.username,
        profileCompleted: data.user.user_metadata?.profile_completed !== false,
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return response.status(400).json({
        message: "요청 형식을 확인해주세요.",
      });
    }

    return response.status(500).json({
      message: "로그인 처리 중 오류가 발생했습니다.",
    });
  }
}
