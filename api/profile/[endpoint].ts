import type { VercelRequest, VercelResponse } from "@vercel/node";

type Handler = (request: VercelRequest, response: VercelResponse) => unknown;
type HandlerModule = { default: Handler };

// Keep literal paths so the deployment builder can discover each module.
// Loading only the requested module isolates unrelated import failures.
const loaders: Record<string, () => Promise<HandlerModule>> = {
  manage: () => import("../../server/handlers/profile/manage.js"),
  setup: () => import("../../server/handlers/profile/setup.js"),
  "saved-places": () => import("../../server/handlers/profile/saved-places.js"),
  notifications: () => import("../../server/handlers/profile/notifications.js"),
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader("Cache-Control", "private, no-store");
  let endpoint: string | undefined;
  let stage: "route" | "load" | "execute" = "route";

  try {
    // Query parameters must not override the selected endpoint.
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    endpoint = /^\/api\/profile\/([^/]+)\/?$/.exec(pathname)?.[1];

    if (!endpoint || !Object.prototype.hasOwnProperty.call(loaders, endpoint)) {
      return response.status(404).json({ message: "존재하지 않는 API입니다." });
    }

    stage = "load";
    const module = await loaders[endpoint]();
    if (typeof module.default !== "function") {
      throw new TypeError(`Profile handler has no default function: ${endpoint}`);
    }

    stage = "execute";
    return await module.default(request, response);
  } catch (error) {
    console.error("[profile/endpoint]", { endpoint, stage, error });
    if (response.headersSent) return;

    return response.status(500).json({
      code: stage === "load" ? "PROFILE_HANDLER_LOAD_FAILED" : "PROFILE_REQUEST_FAILED",
      message: "프로필 요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.",
    });
  }
}
