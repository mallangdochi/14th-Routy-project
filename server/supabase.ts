import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

import { AuthSessionMissingError } from "@supabase/supabase-js";

import type { VercelRequest, VercelResponse } from "@vercel/node";

import {
  SESSION_COOKIE_NAME,
  REMEMBER_SECONDS,
  clearAppSession,
  getAuthCookieName,
  isAuthCookie,
  readAppSession,
  writeAppSession,
} from "./session.js";

interface ServerOptions {
  remember?: boolean;
}

export function createSupabaseServer(
  request: VercelRequest,
  response: VercelResponse,
  options: ServerOptions = {},
) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("서버의 Supabase 환경변수를 확인해주세요.");
  }

  const cookies = new Map(
    parseCookieHeader(request.headers.cookie ?? "").map(({ name, value }) => [
      name,
      value ?? "",
    ]),
  );

  const isLoginAttempt = options.remember !== undefined;

  const session = readAppSession(request);

  const remember = options.remember ?? session?.remember ?? false;

  const secure = process.env.NODE_ENV === "production";

  const authCookieName = getAuthCookieName(supabaseUrl);

  response.setHeader("Cache-Control", "private, no-store");

  if (
    !isLoginAttempt &&
    !session &&
    (cookies.has(SESSION_COOKIE_NAME) ||
      Array.from(cookies.keys()).some((name) =>
        isAuthCookie(name, authCookieName),
      ))
  ) {
    clearAppSession(request, response, supabaseUrl);
  }

  const client = createServerClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },

    cookies: {
      getAll() {
        const all = Array.from(cookies, ([name, value]) => ({
          name,
          value,
        }));

        if (isLoginAttempt || session) {
          return all;
        }

        // 앱 로그인 만료 후에는 남은 Supabase 쿠키로
        // 세션을 다시 연장하지 않습니다.
        return all.filter(({ name }) => !isAuthCookie(name, authCookieName));
      },

      setAll(cookiesToSet) {
        const existingHeader = response.getHeader("Set-Cookie");

        const existingCookies =
          existingHeader === undefined
            ? []
            : Array.isArray(existingHeader)
              ? existingHeader.map(String)
              : [String(existingHeader)];

        const newCookies = cookiesToSet.map(
          ({ name, value, options: cookieOptions }) => {
            cookies.set(name, value);

            const deleting = cookieOptions.maxAge === 0 || value === "";

            return serializeCookieHeader(name, value, {
              ...cookieOptions,
              httpOnly: true,
              secure,
              sameSite: "lax",
              path: "/",
              domain: undefined,
              maxAge: deleting ? 0 : remember ? REMEMBER_SECONDS : undefined,
              expires: undefined,
            });
          },
        );

        response.setHeader("Set-Cookie", [...existingCookies, ...newCookies]);

        const authChanges = cookiesToSet.filter(({ name }) =>
          isAuthCookie(name, authCookieName),
        );

        const hasNewAuthCookie = authChanges.some(
          ({ value, options: cookieOptions }) =>
            value !== "" && cookieOptions.maxAge !== 0,
        );

        if (authChanges.length > 0 && !hasNewAuthCookie) {
          clearAppSession(request, response, supabaseUrl);
        }
      },
    },
  });

  const originalGetUser = client.auth.getUser.bind(client.auth);

  client.auth.getUser = async (jwt?: string) => {
    if (!isLoginAttempt && !session) {
      return {
        data: { user: null },
        error: new AuthSessionMissingError(),
      };
    }

    const result = await originalGetUser(jwt);

    if (
      !isLoginAttempt &&
      session &&
      result.data.user &&
      result.data.user.id !== session.userId
    ) {
      clearAppSession(request, response, supabaseUrl);

      return {
        data: { user: null },
        error: new AuthSessionMissingError(),
      };
    }

    // 로그인 유지를 체크한 경우에만 장기 유지 기간을 갱신합니다.
    if (
      !isLoginAttempt &&
      session?.remember === true &&
      !result.error &&
      result.data.user
    ) {
      writeAppSession(response, result.data.user.id, true);
    }

    return result;
  };

  return client;
}
