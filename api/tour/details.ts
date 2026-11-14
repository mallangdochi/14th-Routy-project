import type { VercelRequest, VercelResponse } from "@vercel/node";
import { lookupTourPlaceDetail } from "../../server/tourPlaceDetailService.js";

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
  const address =
    typeof req.query.address === "string" ? req.query.address.trim() : "";
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  if (req.query.category !== undefined && (!category || !["관광", "음식점", "카페", "숙소"].includes(category))) {
    return res.status(400).json({ message: "장소 카테고리가 올바르지 않습니다." });
  }
  const contentTypeId = typeof req.query.contentTypeId === "string" ? req.query.contentTypeId : undefined;
  if (contentTypeId !== undefined && !["12", "14", "15", "25", "28", "32", "38", "39"].includes(contentTypeId)) {
    return res.status(400).json({ message: "관광 유형이 올바르지 않습니다." });
  }
  const lat = numeric(req.query.lat);
  const lng = numeric(req.query.lng);
  if (
    !name ||
    name.length > 80 ||
    !address ||
    address.length > 180 ||
    (lat !== undefined && (!Number.isFinite(lat) || lat < 33 || lat > 43)) ||
    (lng !== undefined && (!Number.isFinite(lng) || lng < 124 || lng > 132))
  ) {
    return res
      .status(400)
      .json({ message: "장소 이름, 주소 또는 좌표가 올바르지 않습니다." });
  }
  if (!process.env.TOUR_API_SERVICE_KEY?.trim()) {
    return res
      .status(503)
      .json({
        message:
          "TOUR_API_SERVICE_KEY가 서버에 없습니다.",
      });
  }
  try {
    const result = await lookupTourPlaceDetail(name, address, lat, lng, category ?? contentTypeId);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=1800",
    );
    return res.status(200).json(result);
  } catch {
    return res
      .status(502)
      .json({ message: "장소 상세정보를 불러오지 못했습니다." });
  }
}
