export interface TravelRegion {
  id: string;
  name: string;
  country: string;
  latitude?: number;
  longitude?: number;
  keywords?: string[];
}

const regionGroups = [
  {
    id: "seoul",
    name: "서울특별시",
    keywords: ["서울"],
    areas:
      "종로구 중구 용산구 성동구 광진구 동대문구 중랑구 성북구 강북구 도봉구 노원구 은평구 서대문구 마포구 양천구 강서구 구로구 금천구 영등포구 동작구 관악구 서초구 강남구 송파구 강동구",
  },
  {
    id: "busan",
    name: "부산광역시",
    keywords: ["부산"],
    areas:
      "중구 서구 동구 영도구 부산진구 동래구 남구 북구 해운대구 사하구 금정구 강서구 연제구 수영구 사상구 기장군",
  },
  {
    id: "daegu",
    name: "대구광역시",
    keywords: ["대구"],
    areas: "중구 동구 서구 남구 북구 수성구 달서구 달성군 군위군",
  },
  {
    id: "incheon",
    name: "인천",
    keywords: ["인천"],
    areas: "송도 영종 청라 강화도 옹진",
  },
  {
    id: "gwangju",
    name: "광주",
    keywords: ["광주", "전남광주"],
    areas: "동구 서구 남구 북구 광산구",
  },
  {
    id: "daejeon",
    name: "대전광역시",
    keywords: ["대전"],
    areas: "동구 중구 서구 유성구 대덕구",
  },
  {
    id: "ulsan",
    name: "울산광역시",
    keywords: ["울산"],
    areas: "중구 남구 동구 북구 울주군",
  },
  {
    id: "sejong",
    name: "세종특별자치시",
    keywords: ["세종", "세종시"],
    areas: "조치원읍",
  },
  {
    id: "gyeonggi",
    name: "경기도",
    keywords: ["경기", "경기도"],
    areas:
      "수원시 성남시 의정부시 안양시 부천시 광명시 평택시 동두천시 안산시 고양시 과천시 구리시 남양주시 오산시 시흥시 군포시 의왕시 하남시 용인시 파주시 이천시 안성시 김포시 화성시 광주시 양주시 포천시 여주시 연천군 가평군 양평군",
  },
  {
    id: "gangwon",
    name: "강원특별자치도",
    keywords: ["강원", "강원도"],
    areas:
      "춘천시 원주시 강릉시 동해시 태백시 속초시 삼척시 홍천군 횡성군 영월군 평창군 정선군 철원군 화천군 양구군 인제군 고성군 양양군",
  },
  {
    id: "chungbuk",
    name: "충청북도",
    keywords: ["충북", "충청북도"],
    areas:
      "청주시 충주시 제천시 보은군 옥천군 영동군 증평군 진천군 괴산군 음성군 단양군",
  },
  {
    id: "chungnam",
    name: "충청남도",
    keywords: ["충남", "충청남도"],
    areas:
      "천안시 공주시 보령시 아산시 서산시 논산시 계룡시 당진시 금산군 부여군 서천군 청양군 홍성군 예산군 태안군",
  },
  {
    id: "jeonbuk",
    name: "전북특별자치도",
    keywords: ["전북", "전라북도"],
    areas:
      "전주시 군산시 익산시 정읍시 남원시 김제시 완주군 진안군 무주군 장수군 임실군 순창군 고창군 부안군",
  },
  {
    id: "jeonnam",
    name: "전남",
    keywords: ["전남", "전라남도", "전남광주"],
    areas:
      "목포시 여수시 순천시 나주시 광양시 담양군 곡성군 구례군 고흥군 보성군 화순군 장흥군 강진군 해남군 영암군 무안군 함평군 영광군 장성군 완도군 진도군 신안군",
  },
  {
    id: "gyeongbuk",
    name: "경상북도",
    keywords: ["경북", "경상북도"],
    areas:
      "포항시 경주시 김천시 안동시 구미시 영주시 영천시 상주시 문경시 경산시 의성군 청송군 영양군 영덕군 청도군 고령군 성주군 칠곡군 예천군 봉화군 울진군 울릉군",
  },
  {
    id: "gyeongnam",
    name: "경상남도",
    keywords: ["경남", "경상남도"],
    areas:
      "창원시 진주시 통영시 사천시 김해시 밀양시 거제시 양산시 의령군 함안군 창녕군 고성군 남해군 하동군 산청군 함양군 거창군 합천군",
  },
  {
    id: "jeju",
    name: "제주특별자치도",
    keywords: ["제주", "제주도"],
    areas: "제주시 서귀포시",
  },
];

export const REGIONS: TravelRegion[] = regionGroups.flatMap((group) => [
  {
    id: group.id,
    name: group.name,
    country: "대한민국",
    keywords: group.keywords,
  },
  ...group.areas.split(" ").map((area) => ({
    id: `${group.id}-${area}`,
    name: `${group.name} ${area}`,
    country: "대한민국",
    keywords: group.keywords.map((keyword) => `${keyword} ${area}`),
  })),
]);

const normalize = (text: string) => text.replace(/\s+/g, "").toLowerCase();

export function filterRegions(
  regions: TravelRegion[],
  query: string,
): TravelRegion[] {
  const keyword = normalize(query);

  if (!keyword) return [];

  return regions.filter((region) =>
    [region.name, ...(region.keywords ?? [])].some((text) =>
      normalize(text).includes(keyword),
    ),
  );
}
