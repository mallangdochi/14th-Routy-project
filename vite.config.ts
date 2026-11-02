// import { defineConfig, loadEnv, type Plugin } from "vite";
// import react from "@vitejs/plugin-react";
// import {
//   isTourKeyConfigured,
//   lookupTourImage,
// } from "./server/tourPhotoService.js";
// import { lookupRegionPhoto } from "./server/tourRegionPhotoService.js";
// import {
//   lookupTravelRoute,
//   validMode,
//   validPoint,
// } from "./server/travelRouteService.js";

// /** 기존 /api 프록시는 유지하고 관광공사 사진 경로만 로컬에서 처리합니다. */
// function localTourPhotoApi(): Plugin {
//   return {
//     name: "routy-local-tour-photos",
//     apply: "serve",
//     configureServer(server) {
//       server.middlewares.use(async (req, res, next) => {
//         const url = new URL(req.url ?? "/", "http://localhost");
//         if (
//           url.pathname !== "/api/tour/photos" &&
//           url.pathname !== "/api/tour/region-photo" &&
//           url.pathname !== "/api/travel/route"
//         )
//           return next();
//         res.setHeader("Content-Type", "application/json; charset=utf-8");
//         if (req.method !== "GET") {
//           res.statusCode = 405;
//           res.end(JSON.stringify({ message: "GET 요청만 허용됩니다." }));
//           return;
//         }
//         if (url.pathname === "/api/travel/route") {
//           const mode = url.searchParams.get("mode") ?? "";
//           const from = {
//             lat: Number(url.searchParams.get("fromLat")),
//             lng: Number(url.searchParams.get("fromLng")),
//           };
//           const to = {
//             lat: Number(url.searchParams.get("toLat")),
//             lng: Number(url.searchParams.get("toLng")),
//           };
//           if (!validMode(mode) || !validPoint(from) || !validPoint(to)) {
//             res.statusCode = 400;
//             res.end(
//               JSON.stringify({
//                 message: "교통수단이나 국내 장소 좌표가 올바르지 않습니다.",
//               }),
//             );
//             return;
//           }
//           if (!process.env.KAKAO_REST_API_KEY?.trim()) {
//             res.statusCode = 503;
//             res.end(
//               JSON.stringify({
//                 message: "서버에 KAKAO_REST_API_KEY를 설정해 주세요.",
//               }),
//             );
//             return;
//           }
//           try {
//             const route = await lookupTravelRoute(mode, from, to);
//             res.setHeader("Cache-Control", "private, max-age=120");
//             res.end(JSON.stringify(route));
//           } catch (error) {
//             res.statusCode = 502;
//             res.end(
//               JSON.stringify({
//                 message:
//                   error instanceof Error
//                     ? error.message
//                     : "경로 조회에 실패했습니다.",
//               }),
//             );
//           }
//           return;
//         }
//         const name = url.searchParams.get("name")?.trim() ?? "";
//         if (url.pathname === "/api/tour/region-photo") {
//           const latText = url.searchParams.get("lat");
//           const lngText = url.searchParams.get("lng");
//           const lat = latText ? Number(latText) : undefined;
//           const lng = lngText ? Number(lngText) : undefined;
//           if (
//             !name ||
//             name.length > 80 ||
//             (lat !== undefined &&
//               (!Number.isFinite(lat) || lat < 33 || lat > 43)) ||
//             (lng !== undefined &&
//               (!Number.isFinite(lng) || lng < 124 || lng > 132))
//           ) {
//             res.statusCode = 400;
//             res.end(
//               JSON.stringify({
//                 message: "지역 이름이나 좌표가 올바르지 않습니다.",
//               }),
//             );
//             return;
//           }
//           if (!isTourKeyConfigured()) {
//             res.statusCode = 503;
//             res.end(
//               JSON.stringify({
//                 message: "서버에 TOUR_API_SERVICE_KEY가 없습니다.",
//               }),
//             );
//             return;
//           }
//           try {
//             const data = await lookupRegionPhoto(name, lat, lng);
//             res.setHeader("Cache-Control", "private, max-age=3600");
//             res.end(JSON.stringify(data));
//           } catch {
//             res.statusCode = 502;
//             res.end(
//               JSON.stringify({
//                 message: "지역 관광 사진 조회에 실패했습니다.",
//               }),
//             );
//           }
//           return;
//         }
//         const address = url.searchParams.get("address")?.trim() ?? "";
//         const latText = url.searchParams.get("lat");
//         const lngText = url.searchParams.get("lng");
//         const lat = latText ? Number(latText) : undefined;
//         const lng = lngText ? Number(lngText) : undefined;
//         if (
//           !name ||
//           name.length > 80 ||
//           !address ||
//           address.length > 180 ||
//           (lat !== undefined &&
//             (!Number.isFinite(lat) || lat < 33 || lat > 43)) ||
//           (lng !== undefined &&
//             (!Number.isFinite(lng) || lng < 124 || lng > 132))
//         ) {
//           res.statusCode = 400;
//           res.end(
//             JSON.stringify({
//               message: "장소 이름이나 주소가 올바르지 않습니다.",
//             }),
//           );
//           return;
//         }
//         if (!isTourKeyConfigured()) {
//           res.statusCode = 503;
//           res.end(
//             JSON.stringify({
//               message: "서버에 TOUR_API_SERVICE_KEY가 없습니다.",
//             }),
//           );
//           return;
//         }
//         try {
//           const data = await lookupTourImage(name, address, lat, lng);
//           res.setHeader("Cache-Control", "private, max-age=3600");
//           res.end(JSON.stringify(data));
//         } catch {
//           res.statusCode = 502;
//           res.end(
//             JSON.stringify({ message: "관광공사 사진 조회에 실패했습니다." }),
//           );
//         }
//       });
//     },
//   };
// }

// export default defineConfig(({ mode }) => {
//   // Vite의 클라이언트 import.meta.env로는 노출하지 않는 서버 전용 변수입니다.
//   const env = loadEnv(mode, process.cwd(), "");
//   if (env.TOUR_API_SERVICE_KEY)
//     process.env.TOUR_API_SERVICE_KEY = env.TOUR_API_SERVICE_KEY;
//   if (env.KAKAO_REST_API_KEY)
//     process.env.KAKAO_REST_API_KEY = env.KAKAO_REST_API_KEY;

//   return {
//     plugins: [react(), localTourPhotoApi()],
//     server: {
//       port: 5173,
//       strictPort: true,
//       proxy: {
//         "/api": {
//           target: "https://14th-routy-project.vercel.app/",
//           changeOrigin: true,
//           cookieDomainRewrite: "",
//         },
//       },
//     },
//   };
// });

import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import {
  isTourKeyConfigured,
  lookupTourImage,
} from "./server/tourPhotoService.js";
import { lookupRegionPhoto } from "./server/tourRegionPhotoService.js";
import {
  lookupTravelRoute,
  validMode,
  validPoint,
} from "./server/travelRouteService.js";

/** 기존 /api 프록시는 유지하고 관광공사 사진 경로만 로컬에서 처리합니다. */
function localTourPhotoApi(): Plugin {
  return {
    name: "routy-local-tour-photos",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        if (
          url.pathname !== "/api/tour/photos" &&
          url.pathname !== "/api/tour/region-photo" &&
          url.pathname !== "/api/travel/route"
        )
          return next();
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        if (req.method !== "GET") {
          res.statusCode = 405;
          res.end(JSON.stringify({ message: "GET 요청만 허용됩니다." }));
          return;
        }
        if (url.pathname === "/api/travel/route") {
          const mode = url.searchParams.get("mode") ?? "";
          const from = {
            lat: Number(url.searchParams.get("fromLat")),
            lng: Number(url.searchParams.get("fromLng")),
          };
          const to = {
            lat: Number(url.searchParams.get("toLat")),
            lng: Number(url.searchParams.get("toLng")),
          };
          if (!validMode(mode) || !validPoint(from) || !validPoint(to)) {
            res.statusCode = 400;
            res.end(
              JSON.stringify({
                message: "교통수단이나 국내 장소 좌표가 올바르지 않습니다.",
              }),
            );
            return;
          }
          if (!process.env.KAKAO_REST_API_KEY?.trim()) {
            res.statusCode = 503;
            res.end(
              JSON.stringify({
                message: "서버에 KAKAO_REST_API_KEY를 설정해 주세요.",
              }),
            );
            return;
          }
          try {
            const route = await lookupTravelRoute(mode, from, to);
            res.setHeader("Cache-Control", "private, max-age=120");
            res.end(JSON.stringify(route));
          } catch (error) {
            res.statusCode = 502;
            res.end(
              JSON.stringify({
                message:
                  error instanceof Error
                    ? error.message
                    : "경로 조회에 실패했습니다.",
              }),
            );
          }
          return;
        }
        const name = url.searchParams.get("name")?.trim() ?? "";
        if (url.pathname === "/api/tour/region-photo") {
          const latText = url.searchParams.get("lat");
          const lngText = url.searchParams.get("lng");
          const lat = latText ? Number(latText) : undefined;
          const lng = lngText ? Number(lngText) : undefined;
          if (
            !name ||
            name.length > 80 ||
            (lat !== undefined &&
              (!Number.isFinite(lat) || lat < 33 || lat > 43)) ||
            (lng !== undefined &&
              (!Number.isFinite(lng) || lng < 124 || lng > 132))
          ) {
            res.statusCode = 400;
            res.end(
              JSON.stringify({
                message: "지역 이름이나 좌표가 올바르지 않습니다.",
              }),
            );
            return;
          }
          if (!isTourKeyConfigured()) {
            res.statusCode = 503;
            res.end(
              JSON.stringify({
                message: "서버에 TOUR_API_SERVICE_KEY가 없습니다.",
              }),
            );
            return;
          }
          try {
            const data = await lookupRegionPhoto(name, lat, lng);
            res.setHeader("Cache-Control", "private, max-age=3600");
            res.end(JSON.stringify(data));
          } catch {
            res.statusCode = 502;
            res.end(
              JSON.stringify({
                message: "지역 관광 사진 조회에 실패했습니다.",
              }),
            );
          }
          return;
        }
        const address = url.searchParams.get("address")?.trim() ?? "";
        const latText = url.searchParams.get("lat");
        const lngText = url.searchParams.get("lng");
        const lat = latText ? Number(latText) : undefined;
        const lng = lngText ? Number(lngText) : undefined;
        if (
          !name ||
          name.length > 80 ||
          !address ||
          address.length > 180 ||
          (lat !== undefined &&
            (!Number.isFinite(lat) || lat < 33 || lat > 43)) ||
          (lng !== undefined &&
            (!Number.isFinite(lng) || lng < 124 || lng > 132))
        ) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "장소 이름이나 주소가 올바르지 않습니다.",
            }),
          );
          return;
        }
        if (!isTourKeyConfigured()) {
          res.statusCode = 503;
          res.end(
            JSON.stringify({
              message: "서버에 TOUR_API_SERVICE_KEY가 없습니다.",
            }),
          );
          return;
        }
        try {
          const data = await lookupTourImage(name, address, lat, lng);
          res.setHeader("Cache-Control", "private, max-age=3600");
          res.end(JSON.stringify(data));
        } catch {
          res.statusCode = 502;
          res.end(
            JSON.stringify({ message: "관광공사 사진 조회에 실패했습니다." }),
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Vite의 클라이언트 import.meta.env로는 노출하지 않는 서버 전용 변수입니다.
  const env = loadEnv(mode, process.cwd(), "");
  if (env.TOUR_API_SERVICE_KEY)
    process.env.TOUR_API_SERVICE_KEY = env.TOUR_API_SERVICE_KEY;
  if (env.KAKAO_REST_API_KEY)
    process.env.KAKAO_REST_API_KEY = env.KAKAO_REST_API_KEY;

  return {
    plugins: [react(), localTourPhotoApi()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: "https://14th-routy-project.vercel.app/",
          changeOrigin: true,
          cookieDomainRewrite: "",
        },
      },
    },
  };
});
