export type Coordinates = {
  latitude: number;
  longitude: number;
};

type AddressResult = {
  x: string;
  y: string;
  address?: {
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
  };
};

type KakaoServices = {
  Status: {
    OK: string;
    ZERO_RESULT: string;
  };
  Geocoder: new () => {
    addressSearch: (
      query: string,
      callback: (results: AddressResult[], status: string) => void,
    ) => void;
  };
};

type KakaoMaps = {
  load: (callback: () => void) => void;
  services?: KakaoServices;
};

// 기존 프로젝트의 window.kakao 타입 선언과 충돌하지 않도록 별도로 읽습니다.
function getKakaoMaps(): KakaoMaps | undefined {
  return (
    window as unknown as {
      kakao?: { maps?: KakaoMaps };
    }
  ).kakao?.maps;
}

const coordinateCache = new Map<string, Coordinates>();

let sdkPromise: Promise<KakaoServices> | null = null;

function loadKakaoServices(): Promise<KakaoServices> {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<KakaoServices>((resolve, reject) => {
    let settled = false;
    let initializing = false;

    const existingScript = Array.from(document.scripts).find((script) =>
      script.src.includes("dapi.kakao.com/v2/maps/sdk.js"),
    );

    let script: HTMLScriptElement | undefined = existingScript;
    let createdScript = false;

    const cleanup = () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
      script?.removeEventListener("error", handleError);
    };

    const fail = (message: string) => {
      if (settled) return;

      settled = true;
      cleanup();

      // 이 함수에서 만든 스크립트만 제거합니다.
      if (createdScript) script?.remove();

      reject(new Error(message));
    };

    const handleError = () => {
      fail("카카오 지도 SDK를 불러오지 못했습니다.");
    };

    const initialize = () => {
      const maps = getKakaoMaps();

      if (settled || initializing || !maps?.load) return;

      initializing = true;

      try {
        maps.load(() => {
          if (settled) return;

          const services = getKakaoMaps()?.services;

          if (!services?.Geocoder) {
            fail(
              "카카오 SDK에 services 라이브러리가 없습니다. " +
                "기존 SDK 로딩 주소에 libraries=services를 추가해주세요.",
            );
            return;
          }

          settled = true;
          cleanup();
          resolve(services);
        });
      } catch {
        fail("카카오 지도 SDK 초기화에 실패했습니다.");
      }
    };

    const timeout = window.setTimeout(() => {
      fail("카카오 지도 SDK 로딩 시간이 초과되었습니다.");
    }, 12_000);

    const interval = window.setInterval(initialize, 50);

    if (!script && !getKakaoMaps()) {
      const appKey = import.meta.env.VITE_KAKAO_MAP_KEY?.trim();

      if (!appKey) {
        fail("VITE_KAKAO_MAP_KEY가 설정되지 않았습니다.");
        return;
      }

      script = document.createElement("script");
      script.async = true;
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js" +
        `?appkey=${encodeURIComponent(appKey)}` +
        "&autoload=false&libraries=services";

      createdScript = true;
      script.addEventListener("error", handleError);
      document.head.appendChild(script);
    } else {
      script?.addEventListener("error", handleError);
    }

    initialize();
  }).catch((error: unknown) => {
    sdkPromise = null;
    throw error;
  });

  return sdkPromise;
}

function abortError() {
  return new DOMException("요청이 취소되었습니다.", "AbortError");
}

function normalizeRegion(value: string) {
  return value
    .replace(/\s+/g, "")
    .replace(/특별자치시|특별자치도|특별시|광역시/g, "")
    .replace(/시$/, "");
}

export async function resolveRegionCoordinates(
  locationName: string,
  signal?: AbortSignal,
): Promise<Coordinates> {
  const region = locationName.trim().replace(/\s+/g, " ");

  if (!region) {
    throw new Error("지역명이 없습니다.");
  }

  if (signal?.aborted) throw abortError();

  const cached = coordinateCache.get(region);

  if (cached) return cached;

  const services = await loadKakaoServices();

  if (signal?.aborted) throw abortError();

  return new Promise<Coordinates>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      window.clearTimeout(timeout);
      signal?.removeEventListener("abort", handleAbort);
    };

    const fail = (error: Error) => {
      if (settled) return;

      settled = true;
      cleanup();
      reject(error);
    };

    const handleAbort = () => fail(abortError());

    const timeout = window.setTimeout(() => {
      fail(new Error("지역 좌표 조회 시간이 초과되었습니다."));
    }, 10_000);

    signal?.addEventListener("abort", handleAbort, { once: true });

    // 리스너 등록 직전에 취소된 경우도 처리합니다.
    if (signal?.aborted) {
      handleAbort();
      return;
    }

    const geocoder = new services.Geocoder();

    try {
      geocoder.addressSearch(region, (results, status) => {
        if (settled) return;

        if (status !== services.Status.OK || !results.length) {
          fail(new Error(`${region}의 좌표를 찾지 못했어요.`));
          return;
        }

        const requestedParts = region.split(" ").map(normalizeRegion);

        // 같은 이름의 다른 도시 결과가 선택되지 않도록
        // 요청한 행정구역이 모두 일치하는 결과만 사용합니다.
        const matches = results.filter((result) => {
          if (!result.address) return false;

          const addressParts = [
            result.address.region_1depth_name,
            ...result.address.region_2depth_name.split(" "),
            result.address.region_3depth_name,
          ]
            .filter(Boolean)
            .map(normalizeRegion);

          return requestedParts.every((part) => addressParts.includes(part));
        });

        const coordinates = matches
          .map((result) => ({
            latitude: Number(result.y),
            longitude: Number(result.x),
          }))
          .filter(
            ({ latitude, longitude }) =>
              Number.isFinite(latitude) &&
              Number.isFinite(longitude) &&
              Math.abs(latitude) <= 90 &&
              Math.abs(longitude) <= 180,
          );

        const unique = [
          ...new Map(
            coordinates.map((value) => [
              `${value.latitude},${value.longitude}`,
              value,
            ]),
          ).values(),
        ];

        if (unique.length !== 1) {
          fail(
            new Error(
              unique.length
                ? "같은 이름의 지역이 여러 곳입니다. 도시와 구를 함께 입력해주세요."
                : `${region}와 일치하는 지역 좌표를 찾지 못했어요.`,
            ),
          );
          return;
        }

        const result = unique[0];

        if (coordinateCache.size >= 200) coordinateCache.clear();

        coordinateCache.set(region, result);

        settled = true;
        cleanup();
        resolve(result);
      });
    } catch {
      fail(new Error("카카오 지역 좌표 조회에 실패했습니다."));
    }
  });
}
