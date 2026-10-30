import { createHmac, timingSafeEqual } from "node:crypto";

import { parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

import type { VercelRequest, VercelResponse } from "@vercel/node";

export const SESSION_COOKIE_NAME = "routy_session";

export const REMEMBER_SECONDS = 60 * 60 * 24 * 400;

interface AppSession {
  userId: string;
  remember: boolean;
  expiresAt: number;
}

function getSigningKey(): string {
  const key =
    process.env.AUTH_SESSION_SECRET ?? process.env.SUPABASE_SECRET_KEY;

  if (!key) {
    throw new Error("서버의 세션 서명 환경변수를 확인해주세요.");
  }

  return key;
}

function createSignature(payload: string): Buffer {
  return createHmac("sha256", getSigningKey())
    .update(`routy-session-v2:${payload}`)
    .digest();
}

function appendCookies(response: VercelResponse, cookies: string[]) {
  const header = response.getHeader("Set-Cookie");

  const existing =
    header === undefined
      ? []
      : Array.isArray(header)
        ? header.map(String)
        : [String(header)];

  response.setHeader("Set-Cookie", [...existing, ...cookies]);
}

export function writeAppSession(
  response: VercelResponse,
  userId: string,
  remember: boolean,
  tokenExpiresAt?: number,
) {
  const now = Math.floor(Date.now() / 1000);

  const expiresAt = remember ? now + REMEMBER_SECONDS : tokenExpiresAt;

  if (
    typeof expiresAt !== "number" ||
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= now
  ) {
    throw new Error("로그인 세션의 만료 시각을 확인하지 못했습니다.");
  }

  const session: AppSession = {
    userId,
    remember,
    expiresAt,
  };

  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");

  const signature = createSignature(payload).toString("base64url");

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(remember ? { maxAge: REMEMBER_SECONDS } : {}),
  };

  appendCookies(response, [
    serializeCookieHeader(
      SESSION_COOKIE_NAME,
      `${payload}.${signature}`,
      cookieOptions,
    ),

    serializeCookieHeader("routy_remember", String(remember), cookieOptions),
  ]);
}

export function readAppSession(request: VercelRequest): AppSession | null {
  const cookies = parseCookieHeader(request.headers.cookie ?? "");

  const raw = cookies.find(({ name }) => name === SESSION_COOKIE_NAME)?.value;

  if (!raw || raw.length > 4096) {
    return null;
  }

  try {
    const parts = raw.split(".");

    if (parts.length !== 2) {
      return null;
    }

    const [payload, signature] = parts;

    const actual = Buffer.from(signature, "base64url");

    const expected = createSignature(payload);

    if (
      actual.length !== expected.length ||
      !timingSafeEqual(actual, expected)
    ) {
      return null;
    }

    const value: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );

    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return null;
    }

    const session = value as Record<string, unknown>;

    if (
      typeof session.userId !== "string" ||
      !session.userId ||
      typeof session.remember !== "boolean" ||
      typeof session.expiresAt !== "number" ||
      !Number.isSafeInteger(session.expiresAt)
    ) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);

    if (session.expiresAt <= now) {
      return null;
    }

    return {
      userId: session.userId,
      remember: session.remember,
      expiresAt: session.expiresAt,
    };
  } catch {
    return null;
  }
}

export function getAuthCookieName(supabaseUrl: string): string {
  const projectRef = new URL(supabaseUrl).hostname.split(".")[0];

  return `sb-${projectRef}-auth-token`;
}

export function isAuthCookie(name: string, authCookieName: string): boolean {
  return name === authCookieName || name.startsWith(`${authCookieName}.`);
}

export function clearAppSession(
  request: VercelRequest,
  response: VercelResponse,
  supabaseUrl: string,
) {
  const authCookieName = getAuthCookieName(supabaseUrl);

  const names = new Set([
    SESSION_COOKIE_NAME,
    "routy_remember",
    authCookieName,
    `${authCookieName}-code-verifier`,
  ]);

  for (const { name } of parseCookieHeader(request.headers.cookie ?? "")) {
    if (isAuthCookie(name, authCookieName)) {
      names.add(name);
    }
  }

  appendCookies(
    response,
    Array.from(names, (name) =>
      serializeCookieHeader(name, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      }),
    ),
  );
}
