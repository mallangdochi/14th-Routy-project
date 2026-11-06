import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isPhotoKeyConfigured } from "../../server/tourPhotoService.js";
import { lookupRegionPhoto } from "../../server/tourRegionPhotoService.js";

function numeric(value: unknown): number | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const v = Number(value);
  return Number.isFinite(v) ? v : NaN;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "GET 요청만 허용됩니다." });
  }
  const name = typeof req.query.name === "string" ? req.query.name.trim() : "";
  const lat = numeric(req.query.lat);
  const lng = numeric(req.query.lng);
  const preferDaum = req.query.prefer === "daum";
  if (
    !name ||
    name.length > 80 ||
    (lat !== undefined && (!Number.isFinite(lat) || lat < 33 || lat > 43)) ||
    (lng !== undefined && (!Number.isFinite(lng) || lng < 124 || lng > 132))
  ) {
    return res
      .status(400)
      .json({ message: "지역 이름이나 좌표가 올바르지 않습니다." });
  }
  if (!isPhotoKeyConfigured()) {
    return res.status(503).json({
      message:
        "사진 조회용 API 키(TOUR_API_SERVICE_KEY 또는 KAKAO_REST_API_KEY)가 서버에 없습니다.",
    });
  }
  try {
    const result = await lookupRegionPhoto(name, lat, lng, preferDaum);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=1800",
    );
    return res.status(200).json(result);
  } catch {
    return res
      .status(502)
      .json({ message: "관광공사/다음 지역 이미지 조회에 실패했습니다." });
  }
}
