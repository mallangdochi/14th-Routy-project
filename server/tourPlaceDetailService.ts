import { getItems, type TourItem } from "./tourApiPhotoService.js";

export type TourPlaceDetail = {
  status?: "matched" | "not_found" | "ambiguous" | "no_details";
  matchedName?: string;
  candidates?: { contentId: string; contentTypeId: string; name: string; address: string }[];
  additionalInfo?: { label: string; value: string }[];
  overview?: string | null;
  overviewStatus?: "provided" | "empty_record" | "missing_field" | "empty_value" | "request_failed";
  commonFields?: string[];
  parking?: string | null;
  parkingHours?: string | null;
  parkingFee?: string | null;
  partial?: boolean;
  hours: string | null;
  hoursLabel: string;
  restDays: string | null;
  menu: string | null;
  fee: string | null;
  source: "한국관광공사 TourAPI" | null;
};
const empty = (): TourPlaceDetail => ({ hours: null, hoursLabel: "영업시간", restDays: null, menu: null, fee: null, source: null });
const cache = new Map<string, { expires: number; data: TourPlaceDetail }>();
const pending = new Map<string, Promise<TourPlaceDetail>>();

// HTML은 렌더링하지 않고 줄바꿈을 보존한 일반 문자열로만 전달합니다.
export function cleanTourText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
  return !text || /^(?:-|정보\s*없음|미등록|null|undefined)$/i.test(text) ? null : text.slice(0, 2000);
}
export function parseTourIntro(type: string, row: Record<string, unknown>): TourPlaceDetail {
  const pick = (...keys: string[]) => keys.map(key => cleanTourText(row[key])).find(Boolean) ?? null;
  const fields: Record<string, [string[], string[]]> = {
    "12": [["usetime"], ["restdate"]],
    "14": [["usetimeculture"], ["restdateculture"]],
    "15": [["playtime"], []],
    "28": [["usetimeleports"], ["restdateleports"]],
    "38": [["opentime"], ["restdateshopping"]],
    "39": [["opentimefood"], ["restdatefood"]],
  };
  const mapping = fields[type];
  const checkin = type === "32" ? pick("checkintime") : null;
  const checkout = type === "32" ? pick("checkouttime") : null;
  return {
    hours: type === "32"
      ? [checkin && `체크인 ${checkin}`, checkout && `체크아웃 ${checkout}`].filter(Boolean).join(" · ") || null
      : mapping ? pick(...mapping[0]) : null,
    hoursLabel: type === "32" ? "체크인·체크아웃" : ["12", "14", "28"].includes(type) ? "이용시간" : type === "15" ? "행사시간" : "영업시간",
    restDays: mapping ? pick(...mapping[1]) : null,
    menu: type === "39" ? pick("firstmenu") : null,
    fee: type === "14" ? pick("usefee") : type === "28" ? pick("usefeeleports") : type === "15" ? pick("usetimefestival") : null,
    source: "한국관광공사 TourAPI",
  };
}

export function parseTourExtra(type: string, intro: Record<string, unknown>, common: Record<string, unknown>, rows: Record<string, unknown>[]) {
  const repeated = (pattern: RegExp) => {
    const values = rows.filter(row => pattern.test(cleanTourText(row.infoname) ?? ""))
      .map(row => cleanTourText(row.infotext)).filter((value): value is string => Boolean(value));
    return [...new Set(values)].join("\n") || null;
  };
  const parkingField: Record<string, string> = {
    "12": "parking", "14": "parkingculture", "28": "parkingleports",
    "32": "parkinglodging", "38": "parkingshopping", "39": "parkingfood",
  };
  // Expose labelled visitor information only, never raw IDs or response metadata.
  const introLabels: Record<string, string> = {
    expguide: "체험 안내", expagerange: "체험 가능 연령", accomcount: "수용 인원",
    useseason: "이용 시기", chkbabycarriage: "유모차 대여",
    chkpet: "반려동물 동반", chkcreditcard: "신용카드 결제",
    infocenter: "문의 및 안내", infocenterculture: "문의 및 안내",
    infocenterleports: "문의 및 안내", infocenterlodging: "예약 문의",
    reservationfood: "예약 안내", reservation: "예약 안내", reservationlodging: "예약 안내",
    treatmenu: "취급 메뉴", packing: "포장 가능 여부", smoking: "금연·흡연 여부",
    kidsfacility: "어린이 놀이방", scale: "규모", scalelodging: "규모",
    roomcount: "객실 수", roomtype: "객실 유형", subfacility: "부대시설",
    foodplace: "식음료장", pickup: "픽업 서비스", refundregulation: "취소·환불 규정",
    eventstartdate: "행사 시작일", eventenddate: "행사 종료일", eventplace: "행사 장소",
    agelimit: "관람 가능 연령", spendtimefestival: "관람 소요시간",
    spendtime: "관람 소요시간", bookingplace: "예매 안내",
    saleitem: "판매 품목", fairday: "장서는 날", shopguide: "매장 안내",
  };
  const additionalInfo: { label: string; value: string }[] = [];
  const add = (label: string | null, value: string | null) => {
    if (!label || !value) return;
    if (!additionalInfo.some(item => item.label === label && item.value === value))
      additionalInfo.push({ label, value });
  };
  for (const [key, label] of Object.entries(introLabels)) add(label, cleanTourText(intro[key]));
  // Repeated information already has human-readable labels supplied by TourAPI.
  const displayed = /^(?:개요|소개|상세소개|소개글)$|주차|입장료|입장요금|이용요금|관람료|관람요금/;
  for (const row of rows) {
    const label = cleanTourText(row.infoname);
    if (label && !displayed.test(label)) add(label, cleanTourText(row.infotext));
  }
  return {
    additionalInfo,
    overview: cleanTourText(common.overview) ?? repeated(/^(?:개요|소개|상세소개|소개글)$/),
    parking: cleanTourText(intro[parkingField[type] ?? "parking"]) ?? repeated(/주차시설|주차장/),
    parkingHours: repeated(/주차.*(?:시간|운영)|(?:시간|운영).*주차/),
    parkingFee: cleanTourText(intro.parkingfee) ?? repeated(/주차.*(?:요금|비용)|(?:요금|비용).*주차/),
    fee: repeated(/입장료|입장요금|이용요금|관람료|관람요금/),
  };
}

const compactName = (text: string) => text.replace(/\([^)]*\)|\[[^\]]*\]/g, "").replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
const compactAddress = (text: string) => text.replace(/서울특별시/g, "서울").replace(/부산광역시/g, "부산").replace(/[^\p{L}\p{N}]/gu, "");

export function detailSearchTerms(name: string): string[] {
  const plain = name.replace(/\([^)]*\)|\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
  // 알려진 명칭 차이만 보조합니다. 임의로 지점명이나 시설명을 잘라내지 않습니다.
  const alias = plain === "롯데월드 어드벤처" ? "롯데월드" : "";
  return [...new Set([name.trim(), plain, alias].filter(Boolean))].slice(0, 3);
}

// 화면 분류와 TourAPI 분류는 서로 다릅니다. 카페는 음식점(39)에 포함됩니다.
export const TOUR_CATEGORY_TYPES: Record<string, readonly string[]> = {
  관광: ["12", "14", "15", "25", "28"],
  음식점: ["39"],
  카페: ["39"],
  숙소: ["32"],
};

export function selectDetailPlace(items: TourItem[], name: string, address: string, lat?: number, lng?: number, expectedType?: string): { item?: TourItem; status: "matched" | "not_found" | "ambiguous"; candidates?: TourItem[] } {
  const terms = detailSearchTerms(name).map(compactName);
  const allowedTypes = expectedType ? TOUR_CATEGORY_TYPES[expectedType] ?? [expectedType] : null;
  const road = (text: string) => text.match(/([가-힣0-9·]+(?:대로|로|길))\s*(\d+(?:-\d+)?)/)?.slice(1).join("") ?? "";
  const expectedRoad = road(address);
  const expectedAddress = compactAddress(address);
  const ranked = [...new Map(items.filter(item => item.contentid && item.contenttypeid && (!allowedTypes || allowedTypes.includes(String(item.contenttypeid)))).map(item => [String(item.contentid), item])).values()]
    .map(item => {
      const title = compactName(item.title ?? "");
      const exact = title === terms[0];
      const alias = terms.includes(title);
      // 부분 이름으로 다른 시설(아쿠아리움/전망대/호텔)을 붙이지 않습니다.
      if (!exact && !alias) return null;
      const itemAddress = compactAddress(item.addr1 ?? "");
      const sameAddress = Boolean(itemAddress && expectedAddress && itemAddress === expectedAddress);
      const sameRoad = Boolean(expectedRoad && expectedRoad === road(item.addr1 ?? ""));
      const coords = Number.isFinite(lat) && Number.isFinite(lng) && Number(item.mapy) !== 0 && Number(item.mapx) !== 0 && Number.isFinite(Number(item.mapy)) && Number.isFinite(Number(item.mapx));
      let distance = Infinity;
      if (coords) {
        distance = Math.hypot((Number(item.mapy) - lat!) * 111320, (Number(item.mapx) - lng!) * 111320 * Math.cos(lat! * Math.PI / 180));
        if (distance > 1500) return null;
      }
      // 대형 시설은 대표 좌표가 다를 수 있어 같은 도로명·번지이면 1.5km까지 허용.
      // 이름이 다른 별칭은 반드시 주소가 일치해야 합니다.
      if (!(sameAddress || sameRoad) && !(exact && distance <= 800)) return null;
      const score = (exact ? 100 : 75) + (sameAddress || sameRoad ? 40 : 0) - (Number.isFinite(distance) ? Math.min(distance / 100, 15) : 0);
      return { item, score };
    }).filter((entry): entry is { item: TourItem; score: number } => entry !== null)
    .sort((a, b) => b.score - a.score);
  if (!ranked.length) return { status: "not_found" };
  if (ranked[1] && ranked[0].score - ranked[1].score < 15) return { status: "ambiguous", candidates: ranked.filter(entry => ranked[0].score - entry.score < 15).slice(0, 5).map(entry => entry.item) };
  return { item: ranked[0].item, status: "matched" };
}

export async function lookupTourPlaceDetail(name: string, address: string, lat?: number, lng?: number, expectedType?: string): Promise<TourPlaceDetail> {
  const key = process.env.TOUR_API_SERVICE_KEY?.trim();
  if (!key) throw new Error("TOUR_API_SERVICE_KEY_MISSING");
  const cacheKey = JSON.stringify(["detail-v8-additional-info", name, address, lat ?? null, lng ?? null, expectedType ?? null]);
  const saved = cache.get(cacheKey);
  if (saved && saved.expires > Date.now()) return saved.data;
  const running = pending.get(cacheKey);
  if (running) return running;
  const task = (async () => {
    const items: TourItem[] = [];
    let selection: ReturnType<typeof selectDetailPlace> = { status: "not_found" };
    for (const keyword of detailSearchTerms(name)) {
      items.push(...await getItems<TourItem>("searchKeyword2", { keyword }, key));
      selection = selectDetailPlace(items, name, address, lat, lng, expectedType);
      if (selection.item || selection.status === "ambiguous") break;
    }
    let result: TourPlaceDetail = {
      ...empty(), status: selection.status,
      ...(selection.candidates ? { candidates: selection.candidates.map(item => ({
        contentId: String(item.contentid), contentTypeId: String(item.contenttypeid),
        name: item.title ?? "", address: item.addr1 ?? "",
      })) } : {}),
    };
    const verified = selection.item;
    if (verified) {
      const params = { contentId: String(verified.contentid), contentTypeId: String(verified.contenttypeid) };
      const requests = await Promise.allSettled([
        getItems<Record<string, unknown>>("detailIntro2", params, key),
        getItems<Record<string, unknown>>("detailCommon2", { contentId: params.contentId }, key),
        getItems<Record<string, unknown>>("detailInfo2", { ...params, numOfRows: "100" }, key),
      ]);
      if (requests.every(request => request.status === "rejected")) throw new Error("TOUR_DETAIL_UNAVAILABLE");
      const intro = requests[0].status === "fulfilled" ? requests[0].value[0] ?? {} : {};
      const common = requests[1].status === "fulfilled" ? requests[1].value[0] ?? {} : {};
      const repeated = requests[2].status === "fulfilled" ? requests[2].value : [];
      const basic = parseTourIntro(String(verified.contenttypeid), intro);
      const extra = parseTourExtra(String(verified.contenttypeid), intro, common, repeated);
      result = {
        ...basic, ...extra, fee: basic.fee ?? extra.fee,
        status: "matched", matchedName: verified.title,
        partial: requests.some(request => request.status === "rejected"),
        overviewStatus: extra.overview ? "provided"
          : requests[1].status === "rejected" ? "request_failed"
          : !requests[1].value.length ? "empty_record"
          : !("overview" in common) ? "missing_field" : "empty_value",
        // 키나 원문 응답 대신 필드 이름만 제공하여 누락 원인을 확인합니다.
        commonFields: Object.keys(common),
      };
    }
    if (cache.size >= 350) cache.delete(cache.keys().next().value ?? "");
    cache.set(cacheKey, { expires: Date.now() + (result.source && !result.partial && result.overview ? 60 * 60 * 1000 : 60 * 1000), data: result });
    return result;
  })().finally(() => pending.delete(cacheKey));
  pending.set(cacheKey, task);
  return task;
}
