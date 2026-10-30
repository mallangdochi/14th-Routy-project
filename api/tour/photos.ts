import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isTourKeyConfigured, lookupTourImage } from "../../server/tourPhotoService.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "GET 요청만 허용됩니다." });
  }
  const name = typeof req.query.name === "string" ? req.query.name.trim() : "";
  const address = typeof req.query.address === "string" ? req.query.address.trim() : "";
  const lat = typeof req.query.lat === "string" ? Number(req.query.lat) : undefined;
  const lng = typeof req.query.lng === "string" ? Number(req.query.lng) : undefined;
  if (!name || name.length > 80 || !address || address.length > 180 ||
      (lat !== undefined && (!Number.isFinite(lat) || lat < 33 || lat > 43)) ||
      (lng !== undefined && (!Number.isFinite(lng) || lng < 124 || lng > 132))) {
    return res.status(400).json({ message: "장소 이름이나 주소가 올바르지 않습니다." });
  }
  if (!isTourKeyConfigured()) {
    return res.status(503).json({ message: "서버에 관광공사 API 키가 없습니다." });
  }
  try {
    const result = await lookupTourImage(name, address, lat, lng);
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json(result);
  } catch {
    // 클라이언트에는 인증키와 원본 URL을 내보내지 않습니다.
    return res.status(502).json({ message: "관광공사 사진 조회에 실패했습니다." });
  }
}
