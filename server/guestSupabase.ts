import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { VercelRequest, VercelResponse } from "@vercel/node";

/** 실제 계정 로그인 세션과 분리된 방문자 전용 HttpOnly 쿠키입니다. */
export function createGuestSupabase(request: VercelRequest, response: VercelResponse) {
 const url = process.env.SUPABASE_URL;
 const key = process.env.SUPABASE_PUBLISHABLE_KEY;
 if (!url || !key) throw new Error("서버의 Supabase 환경변수를 확인해주세요.");
 const cookieName = "routy-guest-auth";
 const cookies = new Map(parseCookieHeader(request.headers.cookie ?? "")
  .filter(({ name }) => name === cookieName || name.startsWith(`${cookieName}.`))
  .map(({ name, value }) => [name, value ?? ""]));
 return createServerClient(url, key, {
  auth: { autoRefreshToken: false, detectSessionInUrl: false },
  cookieOptions: { name: cookieName },
  cookies: {
   getAll: () => Array.from(cookies, ([name, value]) => ({ name, value })),
   setAll(values) {
    const previous = response.getHeader("Set-Cookie");
    const headers = previous === undefined ? [] : Array.isArray(previous) ? previous.map(String) : [String(previous)];
    for (const { name, value, options } of values) {
     cookies.set(name, value);
     headers.push(serializeCookieHeader(name, value, {
      ...options, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
      path: "/", domain: undefined, expires: undefined,
      maxAge: value && options.maxAge !== 0 ? 7 * 24 * 60 * 60 : 0,
     }));
    }
    response.setHeader("Set-Cookie", headers);
   },
  },
 });
}
