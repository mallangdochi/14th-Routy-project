import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  lookupTravelRoute,
  validMode,
  validPoint,
} from "../../server/travelRouteService.ts";

/** Vercel 배포에서 /api/travel/route 경로 처리 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "GET 요청만 지원합니다." });
  const query = req.query;
  const get = (name: string) =>
    typeof query[name] === "string" ? (query[name] as string) : "";
  const mode = get("mode");
  const transitType = get("transitType") || "all";
  if (
    transitType !== "all" &&
    transitType !== "bus" &&
    transitType !== "subway"
  ) {
    return res.status(400).json({ message: "대중교통 조건을 확인해주세요." });
  }
  if (mode !== "transit" && transitType !== "all") {
    return res
      .status(400)
      .json({ message: "대중교통에서만 전용 조건을 사용할 수 있습니다." });
  }
  const from = { lat: Number(get("fromLat")), lng: Number(get("fromLng")) };
  const to = { lat: Number(get("toLat")), lng: Number(get("toLng")) };
  if (!validMode(mode) || !validPoint(from) || !validPoint(to)) {
    return res
      .status(400)
      .json({ message: "교통수단이나 국내 장소 좌표가 올바르지 않습니다." });
  }
  if (!process.env.KAKAO_REST_API_KEY?.trim()) {
    return res
      .status(503)
      .json({ message: "서버에 KAKAO_REST_API_KEY를 설정해 주세요." });
  }
  try {
    const result = await lookupTravelRoute(mode, from, to, transitType);
    res.setHeader("Cache-Control", "private, max-age=120");
    return res.status(200).json(result);
  } catch (error) {
    return res.status(502).json({
      message:
        error instanceof Error ? error.message : "경로를 불러오지 못했습니다.",
    });
  }
}
