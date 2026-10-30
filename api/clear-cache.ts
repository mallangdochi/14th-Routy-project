import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");

    return response.status(405).json({
      message: "허용되지 않은 요청입니다.",
    });
  }

  // 캐시만 삭제 요청. 로그인 쿠키와 저장 데이터는 유지.
  response.setHeader("Clear-Site-Data", '"cache"');

  return response.status(200).json({
    message: "브라우저에 캐시 삭제를 요청했습니다.",
  });
}
