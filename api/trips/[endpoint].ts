// import type { VercelRequest, VercelResponse } from "@vercel/node";
// import handler0 from "../../server/handlers/trips/create.js";
// import handler1 from "../../server/handlers/trips/days.js";
// import handler2 from "../../server/handlers/trips/delete.js";
// import handler3 from "../../server/handlers/trips/detail.js";
// import handler4 from "../../server/handlers/trips/list.js";
// import handler5 from "../../server/handlers/trips/name.js";
// import handler6 from "../../server/handlers/trips/share.js";
// import schedulePlacesHandler from "../../server/handlers/trips/places.js";

// type Handler = (request: VercelRequest, response: VercelResponse) => unknown;

// const handlers: Record<string, Handler> = {
//   create: handler0,
//   days: handler1,
//   delete: handler2,
//   detail: handler3,
//   list: handler4,
//   name: handler5,
//   share: handler6,
//   places: schedulePlacesHandler,
// };

// export default function handler(
//   request: VercelRequest,
//   response: VercelResponse,
// ) {
//   // Dispatch by URL so a query parameter cannot override the selected endpoint.
//   const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
//   const match = /^\/api\/trips\/([^/]+)\/?$/.exec(pathname);
//   const endpoint = match?.[1];

//   if (!endpoint || !Object.prototype.hasOwnProperty.call(handlers, endpoint)) {
//     response.setHeader("Cache-Control", "no-store");
//     return response.status(404).json({ message: "존재하지 않는 API입니다." });
//   }

//   return handlers[endpoint](request, response);
// }

import type { VercelRequest, VercelResponse } from "@vercel/node";
import handler0 from "../../server/handlers/trips/create.js";
import handler1 from "../../server/handlers/trips/days.js";
import handler2 from "../../server/handlers/trips/delete.js";
import handler3 from "../../server/handlers/trips/detail.js";
import handler4 from "../../server/handlers/trips/list.js";
import handler5 from "../../server/handlers/trips/name.js";
import handler6 from "../../server/handlers/trips/share.js";
import schedulePlacesHandler from "../../server/handlers/trips/places.js";

import checklistHandler from "../../server/handlers/trips/checklist.js";
import budgetHandler from "../../server/handlers/trips/budget.js";

type Handler = (request: VercelRequest, response: VercelResponse) => unknown;

const handlers: Record<string, Handler> = {
  create: handler0,
  days: handler1,
  delete: handler2,
  detail: handler3,
  list: handler4,
  name: handler5,
  share: handler6,
  places: schedulePlacesHandler,
  checklist: checklistHandler,
  budget: budgetHandler,
};

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

  const match = /^\/api\/trips\/([^/]+)\/?$/.exec(pathname);
  const endpoint = match?.[1];

  if (!endpoint || !Object.prototype.hasOwnProperty.call(handlers, endpoint)) {
    response.setHeader("Cache-Control", "no-store");

    return response.status(404).json({
      message: "존재하지 않는 API입니다.",
    });
  }

  return handlers[endpoint](request, response);
}
