import type { KakaoMapsSDK } from "./kakaoTypes";

/**
 * 팀원들의 지도와 같은 JavaScript 키를 사용할 수 있도록
 * 두 환경변수 이름을 모두 지원합니다.
 */
export const getKakaoMapKey = () =>
  (
    import.meta.env.VITE_KAKAO_MAP_JS_KEY ||
    import.meta.env.VITE_KAKAO_MAP_KEY ||
    ""
  ).trim();

/**
 * 전역 Window 타입을 재선언하지 않고 SDK를 가져옵니다.
 */
type WindowWithKakaoMaps = Window & {
  kakao?: {
    maps: KakaoMapsSDK;
  };
};

const getLoadedMaps = (): KakaoMapsSDK | undefined =>
  (window as unknown as WindowWithKakaoMaps).kakao?.maps;

let sdkPromise: Promise<KakaoMapsSDK> | undefined;

/**
 * 여러 화면이 동시에 접근하더라도
 * 동일한 SDK 로딩 Promise를 공유합니다.
 */
export function loadKakaoMaps(): Promise<KakaoMapsSDK> {
  const existingMaps = getLoadedMaps();

  if (existingMaps?.services) {
    return Promise.resolve(existingMaps);
  }

  if (sdkPromise) {
    return sdkPromise;
  }

  const key = getKakaoMapKey();

  if (!key) {
    return Promise.reject(
      new Error("카카오 JavaScript 키가 설정되지 않았습니다."),
    );
  }

  sdkPromise = new Promise<KakaoMapsSDK>((resolve, reject) => {
    const script = document.createElement("script");

    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}` +
      "&libraries=services&autoload=false";

    script.async = true;

    script.onload = () => {
      const maps = getLoadedMaps();

      if (!maps) {
        reject(new Error("카카오 지도 SDK를 불러오지 못했습니다."));
        return;
      }

      maps.load(() => resolve(maps));
    };

    script.onerror = () =>
      reject(
        new Error(
          "지도 SDK를 불러올 수 없습니다. 등록 도메인과 네트워크를 확인해 주세요.",
        ),
      );

    document.head.appendChild(script);
  }).catch((error: unknown) => {
    sdkPromise = undefined;
    throw error;
  });

  return sdkPromise;
}
