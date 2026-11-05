/** 위치는 브라우저에서만 조회합니다. 좌표를 localStorage/서버에 저장하지 않습니다. */
const LOCATION_KEY = "routy:location-enabled:v1";
export const LOCATION_CHANGE_EVENT = "routy:location-preference-changed";

export type CurrentLocation = {
  lat: number;
  lng: number;
  accuracy: number;
};

export function isLocationEnabled(): boolean {
  try {
    return typeof window !== "undefined" &&
      window.localStorage.getItem(LOCATION_KEY) === "true";
  } catch { return false; }
}

export function saveLocationEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(LOCATION_KEY, String(enabled)); } catch { /* 저장 차단 환경 */ }
  window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
}

export function requestCurrentLocation(): Promise<CurrentLocation> {
  if (typeof window === "undefined" || !window.isSecureContext ||
      !navigator.geolocation) {
    return Promise.reject(new Error("위치 조회는 HTTPS 또는 localhost에서만 가능합니다."));
  }
  return new Promise<CurrentLocation>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        lat: coords.latitude,
        lng: coords.longitude,
        accuracy: coords.accuracy,
      }),
      (err) => {
        const message = err.code === 1
          ? "브라우저에서 위치 권한이 거부되었습니다. 주소창의 사이트 권한을 확인해 주세요."
          : err.code === 2
            ? "현재 위치를 확인할 수 없습니다. 기기 위치 서비스를 확인해 주세요."
            : "위치 조회 시간이 초과되었습니다. 다시 시도해 주세요.";
        reject(new Error(message));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  });
}

/** 마이페이지에서 허용을 저장한 경우에만 위치를 요청합니다. */
export async function getAllowedCurrentLocation(): Promise<CurrentLocation | null> {
  if (!isLocationEnabled()) return null;
  return requestCurrentLocation();
}
