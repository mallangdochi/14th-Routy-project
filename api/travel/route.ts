import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      message: "GET 요청만 지원합니다.",
    });
  }

  let stage = "load-service";

  try {
    // 모듈 로딩 실패도 catch에서 처리합니다.
    const { lookupTravelRoute, validMode, validPoint } =
      await import("../../server/travelRouteService.js");

    stage = "validate-input";

    const get = (name: string): string => {
      const value = req.query[name];
      return typeof value === "string" ? value.trim() : "";
    };

    const mode = get("mode");
    const transitType = get("transitType") || "all";

    if (
      transitType !== "all" &&
      transitType !== "bus" &&
      transitType !== "subway"
    ) {
      return res.status(400).json({
        message: "대중교통 조건을 확인해주세요.",
      });
    }

    if (mode !== "transit" && transitType !== "all") {
      return res.status(400).json({
        message: "대중교통에서만 전용 조건을 사용할 수 있습니다.",
      });
    }

    const coordinateNames = ["fromLat", "fromLng", "toLat", "toLng"] as const;

    if (coordinateNames.some((name) => get(name) === "")) {
      return res.status(400).json({
        message: "출발지와 도착지의 위도·경도가 필요합니다.",
      });
    }

    const from = {
      lat: Number(get("fromLat")),
      lng: Number(get("fromLng")),
    };

    const to = {
      lat: Number(get("toLat")),
      lng: Number(get("toLng")),
    };

    if (!validMode(mode) || !validPoint(from) || !validPoint(to)) {
      return res.status(400).json({
        message: "교통수단이나 국내 장소 좌표가 올바르지 않습니다.",
      });
    }

    stage = "check-env";

    if (!process.env.KAKAO_REST_API_KEY?.trim()) {
      return res.status(503).json({
        code: "ROUTE_KEY_MISSING",
        message: "서버에 KAKAO_REST_API_KEY를 설정해 주세요.",
      });
    }

    stage = "lookup-route";

    const result = await lookupTravelRoute(mode, from, to, transitType);

    stage = "send-response";

    res.setHeader("Cache-Control", "private, max-age=120");
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "경로를 불러오지 못했습니다.";

    console.error("[travel/route] 요청 실패", {
      stage,
      name: error instanceof Error ? error.name : "UnknownError",
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.setHeader("Cache-Control", "no-store");

    return res.status(stage === "lookup-route" ? 502 : 500).json({
      code: "ROUTE_REQUEST_FAILED",
      stage,
      message:
        stage === "lookup-route"
          ? message
          : "경로 조회 서버 내부 오류가 발생했습니다. 서버 로그를 확인해 주세요.",
    });
  }
}
