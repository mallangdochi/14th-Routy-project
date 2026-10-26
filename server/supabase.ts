import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

import type { VercelRequest, VercelResponse } from "@vercel/node";

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

  const remember = options.remember ?? cookies.get("routy_remember") === "true";

  const secure = process.env.NODE_ENV === "production";

  response.setHeader("Cache-Control", "private, no-store");

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return Array.from(cookies, ([name, value]) => ({
          name,
          value,
        }));
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
              maxAge: deleting ? 0 : remember ? 60 * 60 * 24 * 30 : undefined,
              expires: undefined,
            });
          },
        );

        response.setHeader("Set-Cookie", [...existingCookies, ...newCookies]);
      },
    },
  });
}
