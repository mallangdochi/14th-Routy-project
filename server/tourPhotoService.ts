/**
 * Routy 장소 사진: 한국관광공사 TourAPI 우선, 검증 가능한 경우만 다음 이미지 검색 사용.
 *
 * 다음 이미지 검색 API에는 사진 속 실제 장소를 확인할 수 있는 데이터가 없습니다.
 * 장소명을 찾지 못한 사진은 잘못된 이미지를 보여주는 것보다 비워 둡니다.
 * 기존 /api/tour/photos 및 기존 export를 유지합니다.
 */
import { lookupTourImage as lookupFromTourAPI } from "./tourApiPhotoService.js";

export type PhotoSource = "한국관광공사 TourAPI" | "다음 이미지 검색" | null;
export type PhotoResult = {
  image: string | null;
  source: PhotoSource;
  sourceUrl: string | null;
  title: string | null;
};
export type TourPhotoResult = PhotoResult;
export type DaumImageResult = PhotoResult;

export type DaumDocument = {
  thumbnail_url?: string;
  image_url?: string;
  doc_url?: string;
  display_sitename?: string;
  collection?: string;
  width?: number;
  height?: number;
};
type DaumPayload = { documents?: DaumDocument[] };
export type ImageSearchContext = {
  name: string;
  address?: string;
  kind?: "place" | "region";
};

export const EMPTY_PHOTO: PhotoResult = { image: null, source: null, sourceUrl: null, title: null };

const POLICY_VERSION = "balanced-photos-4";
const cache = new Map<string, { data: PhotoResult; expires: number }>();
const pending = new Map<string, Promise<PhotoResult>>();
const daumCache = new Map<string, { data: PhotoResult; expires: number }>();
const daumPending = new Map<string, Promise<PhotoResult>>();
const SIX_HOURS = 6 * 60 * 60 * 1000;
const TEN_MINUTES = 45 * 1000; // 빈 결과는 오래 고정하지 않음

export function isPhotoKeyConfigured(): boolean {
  return Boolean(process.env.TOUR_API_SERVICE_KEY?.trim() || process.env.KAKAO_REST_API_KEY?.trim());
}
export const isTourKeyConfigured = isPhotoKeyConfigured;

function safeHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch { return null; }
}
/** 다음 검색에서 HTTP로 내려온 신뢰 가능한 CDN 사진 주소만 HTTPS로 올려 사용합니다. */
function safeImageUrl(value: unknown): string | null {
  const secure = safeHttpsUrl(value);
  if (secure) return secure;
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    const domain = url.hostname.toLowerCase();
    if (url.protocol !== "http:") return null;
    if (!/(?:^|\.)(?:daumcdn\.net|kakaocdn\.net|pstatic\.net)$/u.test(domain)) return null;
    url.protocol = "https:";
    return url.toString();
  } catch { return null; }
}
function safeSourceUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch { return null; }
}
function decoded(value: string): string {
  let current = value;
  for (let i = 0; i < 2; i += 1) {
    try {
      const result = decodeURIComponent(current);
      if (result === current) break;
      current = result;
    } catch { break; }
  }
  return current;
}
function compact(value: string): string {
  return decoded(value).replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "").toLocaleLowerCase("ko");
}
function urlText(value: unknown): string {
  if (typeof value !== "string") return "";
  try {
    const url = new URL(value);
    // URL path and query can contain a genuine place name; the protocol and tracking fragments do not.
    return decoded(`${url.hostname} ${url.pathname}`);
  } catch { return ""; }
}
function host(value: unknown): string {
  if (typeof value !== "string") return "";
  try { return new URL(value).hostname.toLowerCase(); }
  catch { return ""; }
}
function officialSource(domain: string): boolean {
  return domain === "go.kr" || domain.endsWith(".go.kr") ||
    domain === "visitkorea.or.kr" || domain.endsWith(".visitkorea.or.kr") ||
    domain === "wikipedia.org" || domain.endsWith(".wikipedia.org") ||
    domain === "wikimedia.org" || domain.endsWith(".wikimedia.org");
}

const REGION_ROMAN: Record<string, string> = {
  서울: "seoul", 부산: "busan", 대구: "daegu", 인천: "incheon",
  광주: "gwangju", 대전: "daejeon", 울산: "ulsan", 세종: "sejong",
  경기: "gyeonggi", 강원: "gangwon", 충북: "chungbuk", 충남: "chungnam",
  전북: "jeonbuk", 전남: "jeonnam", 경북: "gyeongbuk", 경남: "gyeongnam",
  제주: "jeju",
};
function primaryRegion(address: string): string {
  const first = address.trim().split(/\s+/)[0] || "";
  const aliases: Record<string, string> = {
    서울특별시: "서울", 부산광역시: "부산", 대구광역시: "대구",
    인천광역시: "인천", 광주광역시: "광주", 대전광역시: "대전",
    울산광역시: "울산", 세종특별자치시: "세종", 경기도: "경기",
    강원특별자치도: "강원", 강원도: "강원", 충청북도: "충북",
    충청남도: "충남", 전북특별자치도: "전북", 전라북도: "전북",
    전라남도: "전남", 경상북도: "경북", 경상남도: "경남",
    제주특별자치도: "제주", 제주도: "제주",
  };
  return aliases[first] ?? first;
}
function hasRegionEvidence(text: string, address: string): boolean {
  const region = primaryRegion(address);
  if (!region) return false;
  const value = compact(text);
  if (!value) return false;
  const roman = REGION_ROMAN[region];
  return value.includes(compact(region)) || Boolean(roman && value.includes(roman));
}

/** URL에 특정 동물/밈 등 장소와 무관한 주제가 명시된 경우 제외합니다. */
function clearlyWrongSubject(text: string, placeName: string): boolean {
  const animalOrMeme = /(고양이|냥이|강아지|멍멍|반려묘|짤방|밈이미지|웃긴짤|meme|kitten|puppy)/iu;
  const latinAnimal = /(?:^|[\W_])(?:cat|cats|dog|dogs|meme|memes)(?:$|[\W_])/iu;
  const decodedText = decoded(text);
  return (animalOrMeme.test(decodedText) || latinAnimal.test(decodedText)) &&
    !animalOrMeme.test(placeName) && !latinAnimal.test(placeName);
}

/**
 * 다음 이미지 검색은 이미지 내용 검증 API가 아닙니다.
 * 직전 버전의 `URL에 장소명 필수` 조건은 정상적인 숫자 파일명 사진까지 차단했습니다.
 *
 * 현재 정책:
 * 1. URL/출처에 정확한 장소명이 보이면 우선 채택
 * 2. 지역 + 부분 이름 증거가 있으면 그 다음 우선
 * 3. 고유한 장소명으로 *이미 검색한* 상위 결과는, URL에서 반증이 없을 때 제한적으로 허용
 * 4. 이름이 흔하거나 'N코스'처럼 개별 경로 식별이 중요하면 위 1~2 조건만 허용
 * 검색 결과가 실제 그 장소를 촬영했는지 100% 보장하지는 못합니다.
 */
export function selectDaumImage(
  documents: DaumDocument[],
  context?: ImageSearchContext,
): PhotoResult {
  if (!context?.name.trim()) return EMPTY_PHOTO;
  const expected = compact(context.name);
  const kind = context.kind ?? "place";
  if (expected.length < 2) return EMPTY_PHOTO;

  const address = context.address ?? "";
  const generic = /^(중앙공원|중앙시장|전망대|공원|시청|시장|카페|맛집|해수욕장|산|여행지)$/u.test(context.name.trim());
  const course = /(?:제?\s*\d+\s*(?:코스|구간|길)|해파랑길\s*\d+)/u.test(context.name);
  const ambiguous = generic || course || (kind === "place" && expected.length < 3);
  const regionName = primaryRegion(address);
  const evidenceName = expected.replace(/\d+$/u, "");
  const partialName = evidenceName.length >= 4 ? evidenceName.slice(0, Math.max(3, Math.ceil(evidenceName.length * .7))) : "";
  let best: { doc: DaumDocument; score: number; image: string } | null = null;

  documents.forEach((doc, index) => {
    // 원본 우선: 다음 API thumbnail_url은 작은 해상도인 경우가 있습니다.
    const image = safeImageUrl(doc.image_url) ?? safeImageUrl(doc.thumbnail_url);
    if (!image) return;
    if (/\.(?:gif|svg)(?:[?#]|$)/iu.test(doc.image_url ?? "")) return;
    if (doc.width && doc.height && (doc.width < 240 || doc.height < 150)) return;

    const page = urlText(doc.doc_url);
    const original = urlText(doc.image_url);
    const site = doc.display_sitename ?? "";
    const combined = `${page} ${original} ${site}`;
    if (clearlyWrongSubject(combined, context.name)) return;
    if (/(?:상업광고|쿠폰|배너이미지|정치광고|adult|porn|casino)/iu.test(decoded(combined))) return;

    const pageCompact = compact(`${page} ${site}`);
    const originalCompact = compact(original);
    const exactOriginal = originalCompact.includes(expected);
    const exactPage = pageCompact.includes(expected);
    const partial = Boolean(partialName && (pageCompact.includes(partialName) || originalCompact.includes(partialName)));
    const regional = hasRegionEvidence(combined, address);
    const trusted = officialSource(host(doc.doc_url)) || officialSource(host(doc.image_url));

    // URL이 전혀 다른 광역지역을 명시하는 경우 제외합니다.
    const otherRegionMention = Object.keys(REGION_ROMAN).some((item) =>
      item !== regionName && item.length >= 2 &&
      new RegExp(`(?:^|[^가-힣])${item}(?:광역시|특별시|특별자치도|특별자치시)(?:[^가-힣]|$)`).test(decoded(combined))
    );
    if (regionName && otherRegionMention && !regional && !exactOriginal && !exactPage) return;

    let score = 0;
    if (exactOriginal) score = 110;
    else if (exactPage) score = 95;
    else if (partial && regional) score = 88;
    else if (partial) score = 73;
    else if (trusted && regional) score = 68;
    // 숫자 파일명/블로그 이미지에 장소명이 안 담기는 흔한 케이스 허용.
    // 단, 이름이 모호하거나 여러 경로가 같은 이름을 쓰는 코스는 채택 안 함.
    else if (!ambiguous && index < 4) score = (kind === "region" ? 64 : 61) - index * 3;

    if (ambiguous && score < 88 && kind === "place") return;
    if (score < 55) return;
    // 상위 검색 결과와 장소명/지역 관련성을 모두 고려.
    score -= Math.min(index, 20) * 0.6;
    if (!best || score > best.score) best = { doc, score, image };
  });

  const selected = best as { doc: DaumDocument; score: number; image: string } | null;
  if (!selected) return EMPTY_PHOTO;
  const chosen = selected.doc;
  return {
    image: selected.image,
    source: "다음 이미지 검색",
    sourceUrl: safeSourceUrl(chosen.doc_url),
    title: chosen.display_sitename?.trim() || null,
  };
}

function cached(map: Map<string, { data: PhotoResult; expires: number }>, key: string): PhotoResult | undefined {
  const entry = map.get(key);
  return entry && entry.expires > Date.now() ? entry.data : undefined;
}
function remember(map: Map<string, { data: PhotoResult; expires: number }>, key: string, data: PhotoResult) {
  if (map.size >= 400) map.delete(map.keys().next().value ?? "");
  map.set(key, { data, expires: Date.now() + (data.image ? SIX_HOURS : TEN_MINUTES) });
}

/** 서버에서만 호출: REST API 키를 브라우저로 전달하지 않습니다. */
export async function lookupDaumImage(query: string, context?: ImageSearchContext): Promise<PhotoResult> {
  // Context without evidence cannot verify an image; do not query blindly.
  if (!context?.name.trim()) return EMPTY_PHOTO;
  const normalized = query.trim().replace(/\s+/gu, " ").slice(0, 180);
  if (!normalized) return EMPTY_PHOTO;
  const key = JSON.stringify([POLICY_VERSION, normalized, context]);
  const saved = cached(daumCache, key);
  if (saved) return saved;
  const running = daumPending.get(key);
  if (running) return running;

  const task = (async () => {
    const apiKey = process.env.KAKAO_REST_API_KEY?.trim();
    if (!apiKey) throw new Error("KAKAO_REST_API_KEY_MISSING");
    const url = new URL("https://dapi.kakao.com/v2/search/image");
    url.search = new URLSearchParams({ query: normalized, sort: "accuracy", size: "30" }).toString();
    const response = await fetch(url, {
      headers: { Authorization: `KakaoAK ${apiKey}`, Accept: "application/json" },
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) throw new Error(`DAUM_IMAGE_HTTP_${response.status}`);
    const body = (await response.json()) as DaumPayload;
    const result = selectDaumImage(Array.isArray(body.documents) ? body.documents : [], context);
    remember(daumCache, key, result);
    return result;
  })().finally(() => daumPending.delete(key));
  daumPending.set(key, task);
  return task;
}

export async function lookupDaumImageForPlace(name: string, address: string): Promise<PhotoResult> {
  const place = name.trim();
  if (!place) return EMPTY_PHOTO;
  const region = address.trim().split(/\s+/u).slice(0, 2).join(" ");
  // 장소명 우선, 시·군·구로 보조하여 검색 순위 정확도를 높입니다.
  const query = region && !place.includes(region) ? `${place} ${region} 풍경 사진` : `${place} 풍경 사진`;
  return lookupDaumImage(query, { name: place, address, kind: "place" });
}

/** preferDaum=true: 관광공사 URL 이미지 로딩 실패 후 다음을 재시도할 때만 사용 */
export async function lookupTourImage(
  name: string,
  address: string,
  lat?: number,
  lng?: number,
  preferDaum = false,
): Promise<TourPhotoResult> {
  if (!name.trim()) return EMPTY_PHOTO;
  const key = JSON.stringify([POLICY_VERSION, name, address, lat ?? null, lng ?? null, preferDaum]);
  const saved = cached(cache, key);
  if (saved) return saved;
  const running = pending.get(key);
  if (running) return running;

  const task = (async (): Promise<PhotoResult> => {
    let firstError: unknown;
    let hadSuccess = false;
    if (!preferDaum && process.env.TOUR_API_SERVICE_KEY?.trim()) {
      try {
        const tourist = await lookupFromTourAPI(name, address, lat, lng);
        hadSuccess = true;
        if (tourist.image) {
          const result: PhotoResult = {
            image: tourist.image, source: "한국관광공사 TourAPI", sourceUrl: null, title: name,
          };
          remember(cache, key, result);
          return result;
        }
      } catch (error) { firstError = error; }
    }
    if (process.env.KAKAO_REST_API_KEY?.trim()) {
      try {
        const daum = await lookupDaumImageForPlace(name, address);
        hadSuccess = true;
        remember(cache, key, daum);
        return daum;
      } catch (error) { firstError = error; }
    }
    if (!hadSuccess && firstError) throw new Error("PHOTO_SERVICES_UNAVAILABLE");
    remember(cache, key, EMPTY_PHOTO);
    return EMPTY_PHOTO;
  })().finally(() => pending.delete(key));
  pending.set(key, task);
  return task;
}
