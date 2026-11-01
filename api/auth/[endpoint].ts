import type { VercelRequest, VercelResponse } from "@vercel/node";
import handler0 from "../../server/handlers/auth/check-username.js";
import handler1 from "../../server/handlers/auth/login.js";
import handler2 from "../../server/handlers/auth/logout.js";
import handler3 from "../../server/handlers/auth/me.js";
import handler4 from "../../server/handlers/auth/signup.js";
import handler5 from "../../server/handlers/auth/withdraw.js";

type Handler = (request: VercelRequest, response: VercelResponse) => unknown;

const handlers: Record<string, Handler> = {
  "check-username": handler0,
  "login": handler1,
  "logout": handler2,
  "me": handler3,
  "signup": handler4,
  "withdraw": handler5,
};

export default function handler(request: VercelRequest, response: VercelResponse) {
  // Dispatch by URL so a query parameter cannot override the selected endpoint.
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const match = /^\/api\/auth\/([^/]+)\/?$/.exec(pathname);
  const endpoint = match?.[1];

  if (!endpoint || !Object.prototype.hasOwnProperty.call(handlers, endpoint)) {
    response.setHeader("Cache-Control", "no-store");
    return response.status(404).json({ message: "존재하지 않는 API입니다." });
  }

  return handlers[endpoint](request, response);
}
