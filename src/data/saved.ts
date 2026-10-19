export type PlaceCategory = "관광" | "음식점" | "카페" | "숙소";

export type SavedPlace = {
  id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  description: string;
  image: string;
  savedAt: string;
};

export const mockSavedPlaces: SavedPlace[] = [
  {
    id: "place-001",
    name: "웨이브온 커피",
    category: "카페",
    address: "부산 기장군 장안읍 해맞이로 286",
    description: "탁 트인 바다를 감상할 수 있는 부산 대표 오션뷰 카페예요.",
    image:
      "https://images.unsplash.com/photo-1772550831603-8352477994ed?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    savedAt: "2026-10-19T14:30:00+09:00",
  },
  {
    id: "place-002",
    name: "모모스커피 영도",
    category: "카페",
    address: "부산 영도구 봉래나루로 160",
    description:
      "바다를 바라보며 커피를 즐길 수 있는 영도의 로스터리 카페예요.",
    image:
      "https://images.unsplash.com/photo-1785156248145-8ce69ba762dc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    savedAt: "2026-10-18T11:20:00+09:00",
  },
  {
    id: "place-003",
    name: "흰여울문화마을 카페",
    category: "카페",
    address: "부산 영도구 절영로 235",
    description: "아기자기한 골목과 바다가 어우러진 감성 카페예요.",
    image:
      "https://images.unsplash.com/photo-1784473759594-ffdb534dee53?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    savedAt: "2026-10-17T16:40:00+09:00",
  },
  {
    id: "place-004",
    name: "감천문화마을",
    category: "관광",
    address: "부산 사하구 감내2로 203",
    description: "알록달록한 집과 골목을 따라 산책하기 좋은 문화마을이에요.",
    image:
      "https://images.unsplash.com/photo-1510869882255-58be9fc697fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    savedAt: "2026-10-16T10:10:00+09:00",
  },
  {
    id: "place-005",
    name: "부산 돼지국밥",
    category: "음식점",
    address: "부산 부산진구 서면 일대",
    description: "든든하고 따뜻한 돼지국밥 한 그릇을 즐길 수 있는 식당이에요.",
    image:
      "https://images.unsplash.com/photo-1604573714289-312a6972f67c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    savedAt: "2026-10-15T12:30:00+09:00",
  },
  {
    id: "place-006",
    name: "광안리 오션뷰 호텔",
    category: "숙소",
    address: "부산 수영구 광안해변로 일대",
    description: "광안대교의 야경을 바라보며 편안하게 쉬어갈 수 있는 숙소예요.",
    image:
      "https://images.unsplash.com/photo-1777498269084-bc465e015146?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    savedAt: "2026-10-14T19:00:00+09:00",
  },
];
