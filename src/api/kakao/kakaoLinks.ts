export function getKakaoMapSearchUrl(name: string, address = ""): string {
  return `https://map.kakao.com/link/search/${encodeURIComponent(`${name} ${address}`.trim())}`;
}

export function getKakaoMapPointUrl(
  name: string,
  latitude: number,
  longitude: number,
): string {
  return `https://map.kakao.com/link/map/${encodeURIComponent(name)},${latitude},${longitude}`;
}
