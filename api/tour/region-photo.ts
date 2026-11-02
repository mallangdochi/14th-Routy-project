import type { VercelRequest, VercelResponse } from "@vercel/node";
import { lookupRegionPhoto } from "../../server/tourRegionPhotoService";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "GET 요청만 허용됩니다." });
  }
  const name = typeof req.query.name === "string" ? req.query.name.trim() : "";
  const lat =
    typeof req.query.lat === "string" && req.query.lat.trim() !== ""
      ? Number(req.query.lat)
      : undefined;
  const lng =
    typeof req.query.lng === "string" && req.query.lng.trim() !== ""
      ? Number(req.query.lng)
      : undefined;
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
  if (!process.env.TOUR_API_SERVICE_KEY?.trim()) {
    return res
      .status(503)
      .json({ message: "관광공사 API 키가 설정되지 않았습니다." });
  }
  try {
    const photo = await lookupRegionPhoto(name, lat, lng);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    return res.status(200).json(photo);
  } catch {
    return res
      .status(502)
      .json({ message: "지역 관광 사진 조회에 실패했습니다." });
  }
}
