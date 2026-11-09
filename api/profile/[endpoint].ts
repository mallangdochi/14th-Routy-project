import type { VercelRequest, VercelResponse } from "@vercel/node";
import handler0 from "../../server/handlers/profile/manage.js";
import handler1 from "../../server/handlers/profile/setup.js";

import savedPlacesHandler from "../../server/handlers/profile/saved-places.js";

import notificationsHandler from "../../server/handlers/profile/notifications.js";

type Handler = (request: VercelRequest, response: VercelResponse) => unknown;

const handlers: Record<string, Handler> = {
  "notifications": notificationsHandler,
  "manage": handler0,
  "setup": handler1,
  "saved-places": savedPlacesHandler,
};

export default function handler(request: VercelRequest, response: VercelResponse) {
  // Dispatch by URL so a query parameter cannot override the selected endpoint.
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const match = /^\/api\/profile\/([^/]+)\/?$/.exec(pathname);
  const endpoint = match?.[1];

  if (!endpoint || !Object.prototype.hasOwnProperty.call(handlers, endpoint)) {
    response.setHeader("Cache-Control", "no-store");
    return response.status(404).json({ message: "존재하지 않는 API입니다." });
  }

  return handlers[endpoint](request, response);
}
