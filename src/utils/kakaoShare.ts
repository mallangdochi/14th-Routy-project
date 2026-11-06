export type KakaoShareSDK = {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (options: {
      objectType: "text";
      text: string;
      link: { mobileWebUrl: string; webUrl: string };
      buttonTitle?: string;
    }) => void;
  };
};

const SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.8.4/kakao.min.js";
const SDK_INTEGRITY =
  "sha384-BGX7Wb16GmRFagri4bLJV2DgipVZaU2AI812GZtHtHzzDQJnfHasDXN5houxv45w";
let sdkPromise: Promise<KakaoShareSDK> | null = null;

function getSDK(): KakaoShareSDK | undefined {
  return (window as Window & { Kakao?: KakaoShareSDK }).Kakao;
}

function initialize(sdk: KakaoShareSDK): KakaoShareSDK {
  const key = import.meta.env.VITE_KAKAO_SHARE_KEY?.trim();
  if (!key) {
    throw new Error("카카오톡 공유용 JavaScript 키가 설정되지 않았습니다.");
  }
  if (!sdk.isInitialized()) sdk.init(key);
  if (!sdk.isInitialized() || !sdk.Share?.sendDefault) {
    throw new Error("카카오톡 공유 SDK를 초기화하지 못했습니다.");
  }
  return sdk;
}

/** 동시 호출은 같은 Promise를 사용하며, 로드 실패 후에는 재시도할 수 있습니다. */
export function loadKakaoShareSDK(): Promise<KakaoShareSDK> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("브라우저에서만 공유할 수 있습니다."));
  }
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<KakaoShareSDK>((resolve, reject) => {
    const existingSDK = getSDK();
    if (existingSDK) {
      try {
        resolve(initialize(existingSDK));
      } catch (error) {
        reject(error);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.integrity = SDK_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.async = true;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      script.onload = null;
      script.onerror = null;
    };
    const fail = (error: unknown) => {
      cleanup();
      script.remove();
      reject(error);
    };
    const timeoutId = window.setTimeout(() => {
      fail(
        new Error(
          "카카오톡 공유 SDK 로딩 시간이 초과되었습니다. 다시 시도해주세요.",
        ),
      );
    }, 15000);

    script.onload = () => {
      try {
        const sdk = getSDK();
        if (!sdk) throw new Error("카카오톡 공유 SDK를 확인할 수 없습니다.");
        const initializedSDK = initialize(sdk);
        cleanup();
        resolve(initializedSDK);
      } catch (error) {
        fail(error);
      }
    };
    script.onerror = () => {
      fail(
        new Error(
          "카카오톡 공유 SDK를 불러오지 못했습니다. 네트워크를 확인해주세요.",
        ),
      );
    };
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    sdkPromise = null;
    throw error;
  });

  return sdkPromise;
}
