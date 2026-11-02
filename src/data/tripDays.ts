export type PlaceCategory = "관광" | "음식점" | "카페" | "숙소";

export type TripDayPlace = {
  id: string;
  name: string;
  startTime?: string;
  stayMinutes?: number;
  sourcePlaceId?: string;
  address?: string;
  category?: string | PlaceCategory;
  description?: string;
  image?: string;
  lat?: number;
  lng?: number;

  // address?: string;
  // imageUrl?: string; // 사진 URL을 입력하세요. 비어 있으면 기본 이미지 표시
  // category?: PlaceCategory; // 기존 목데이터도 유지하도록 선택 속성
};

export const PLACE_CATEGORY_FILTERS = [
  "전체",
  "관광",
  "음식점",
  "카페",
  "숙소",
] as const;

export type TripDay = {
  id: string;
  tripId: string;
  day: number;
  date: string;
  places: TripDayPlace[];
};

export function getStayMinutes(place: TripDayPlace): number {
  const minutes = place.stayMinutes;
  return typeof minutes === "number" && Number.isFinite(minutes) && minutes > 0
    ? minutes
    : 60;
}

export const mockTripDays: TripDay[] = [
  // ─────────────────────────────
  // 여행 ID 1 - 제주 여행
  // ─────────────────────────────
  {
    id: "trip-1-day-1",
    tripId: "1",
    day: 1,
    date: "2026-10-29",
    places: [
      {
        id: "trip-1-day-1-place-1",
        name: "제주국제공항",
        address: "제주특별자치도 제주시 공항로",
        image: "",
        category: "관광",
        startTime: "09:00",
        stayMinutes: 60,
      },
      {
        id: "trip-1-day-1-place-2",
        name: "함덕해수욕장",
        address: "제주특별자치도 제주시 조천읍",
        image: "",
        category: "관광",
        startTime: "10:30",
        stayMinutes: 120,
      },
      {
        id: "trip-1-day-1-place-3",
        name: "제주 흑돼지 맛집",
        address: "제주특별자치도 제주시",
        image: "",
        category: "음식점",
        startTime: "13:00",
        stayMinutes: 90,
      },
      {
        id: "trip-1-day-1-place-4",
        name: "카페 멜로드",
        address: "제주특별자치도 제주시",
        image: "",
        category: "카페",
        startTime: "15:00",
        stayMinutes: 90,
      },
      {
        id: "trip-1-day-1-place-5",
        name: "성산일출봉",
        address: "제주특별자치도 서귀포시 성산읍",
        image: "",
        category: "관광",
        startTime: "17:30",
        stayMinutes: 90,
      },
    ],
  },

  {
    id: "trip-1-day-2",
    tripId: "1",
    day: 2,
    date: "2026-10-30",
    places: [],
  },
  {
    id: "trip-1-day-3",
    tripId: "1",
    day: 3,
    date: "2026-10-31",
    places: [],
  },

  // ─────────────────────────────
  // 기존 여행 ID 2 데이터
  // ─────────────────────────────
  {
    id: "trip-2-day-1",
    tripId: "2",
    day: 1,
    date: "2026-10-19",
    places: [
      {
        id: "trip-2-day-1-place-1",
        name: "부산역",
        address: "부산광역시 동구 중앙대로",
        image: "",
        category: "관광",
        startTime: "08:00",
      },
      {
        id: "trip-2-day-1-place-2",
        name: "해운대해수욕장",
        address: "부산광역시 해운대구",
        image: "",
        category: "관광",
        startTime: "11:00",
        stayMinutes: 120,
      },
      {
        id: "trip-2-day-1-place-3",
        name: "광안리",
        address: "부산광역시 수영구",
        image: "",
        category: "관광",
        startTime: "18:00",
        stayMinutes: 120,
      },
    ],
  },
  {
    id: "trip-2-day-2",
    tripId: "2",
    day: 2,
    date: "2026-10-20",
    places: [
      {
        id: "trip-2-day-2-place-1",
        name: "감천문화마을",
        address: "부산광역시 사하구 감내2로",
        image: "",
        category: "관광",
        startTime: "10:00",
        stayMinutes: 120,
      },
      {
        id: "trip-2-day-2-place-2",
        name: "자갈치시장",
        address: "부산광역시 중구 자갈치해안로",
        image: "",
        category: "음식점",
        startTime: "13:00",
        stayMinutes: 90,
      },
    ],
  },
  {
    id: "trip-2-day-3",
    tripId: "2",
    day: 3,
    date: "2026-10-21",
    places: [
      {
        id: "trip-2-day-3-place-1",
        name: "흰여울문화마을",
        address: "부산광역시 영도구 흰여울길",
        image: "",
        category: "관광",
        startTime: "09:00",
        stayMinutes: 90,
      },
      {
        id: "trip-2-day-3-place-2",
        name: "태종대",
        address: "부산광역시 영도구 전망로",
        image: "",
        category: "관광",
        startTime: "11:00",
        stayMinutes: 180,
      },
      {
        id: "trip-2-day-3-place-3",
        name: "영도대교",
        address: "부산광역시 영도구",
        image: "",
        category: "관광",
        startTime: "16:00",
        stayMinutes: 60,
      },
    ],
  },
  {
    id: "trip-2-day-4",
    tripId: "2",
    day: 4,
    date: "2026-10-22",
    places: [
      {
        id: "trip-2-day-4-place-1",
        name: "해동용궁사",
        address: "부산광역시 기장군 기장읍",
        image: "",
        category: "관광",
        startTime: "09:00",
        stayMinutes: 90,
      },
      {
        id: "trip-2-day-4-place-2",
        name: "기장시장",
        address: "부산광역시 기장군 기장읍",
        image: "",
        category: "음식점",
        startTime: "12:00",
        stayMinutes: 90,
      },
      {
        id: "trip-2-day-4-place-3",
        name: "송정해수욕장",
        address: "부산광역시 해운대구 송정동",
        image: "",
        category: "관광",
        startTime: "15:00",
        stayMinutes: 120,
      },
      {
        id: "trip-2-day-4-place-4",
        name: "청사포",
        address: "부산광역시 해운대구 중동",
        image: "",
        category: "관광",
        startTime: "18:00",
        stayMinutes: 150,
      },
    ],
  },
  {
    id: "trip-2-day-5",
    tripId: "2",
    day: 5,
    date: "2026-10-23",
    places: [
      {
        id: "trip-2-day-5-place-1",
        name: "부산시민공원",
        address: "부산광역시 부산진구 시민공원로",
        image: "",
        category: "관광",
        startTime: "09:00",
        stayMinutes: 120,
      },
      {
        id: "trip-2-day-5-place-2",
        name: "전포카페거리",
        address: "부산광역시 부산진구 전포동",
        image: "",
        category: "카페",
        startTime: "12:00",
        stayMinutes: 120,
      },
      {
        id: "trip-2-day-5-place-3",
        name: "부산역",
        address: "부산광역시 동구 중앙대로",
        image: "",
        category: "관광",
        startTime: "16:00",
        stayMinutes: 60,
      },
    ],
  },
  // 서울 여행 · 2026.11.03 ~ 2026.11.05
  {
    id: "seoul-day-1",
    tripId: "0aafbd86-ed23-41f8-b6f6-31ab0517eb1d",
    day: 1,
    date: "2026-11-03",
    places: [
      {
        id: "seoul-day-1-place-1",
        name: "경복궁",
        address: "서울특별시 종로구 사직로",
        image:
          "https://images.unsplash.com/photo-1540998145333-e2eef1a9822d?q=80&w=1083&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "관광",
        startTime: "09:00",
        stayMinutes: 120,
      },
      {
        id: "seoul-day-1-place-2",
        name: "북촌한옥마을",
        address: "서울특별시 종로구 계동",
        image:
          "https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "관광",
        startTime: "11:30",
        stayMinutes: 90,
      },
      {
        id: "seoul-day-1-place-3",
        name: "인사동 한식당",
        address: "서울특별시 종로구 인사동",
        image:
          "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "음식점",
        startTime: "13:30",
        stayMinutes: 60,
      },
      {
        id: "seoul-day-1-place-4",
        name: "익선동 카페",
        address: "서울특별시 종로구 익선동",
        image:
          "https://images.unsplash.com/photo-1622517806875-92161d3fd09d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "카페",
        startTime: "15:00",
        stayMinutes: 90,
      },
      {
        id: "seoul-day-1-place-5",
        name: "청계천",
        address: "서울특별시 종로구 청계천로",
        image:
          "https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "관광",
        startTime: "17:00",
        stayMinutes: 60,
      },
      {
        id: "seoul-day-1-place-6",
        name: "종로 숙소",
        address: "서울특별시 종로구",
        image:
          "https://images.unsplash.com/photo-1648383228240-6ed939727ad6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "숙소",
        startTime: "19:00",
        stayMinutes: 60,
      },
    ],
  },
  {
    id: "seoul-day-2",
    tripId: "0aafbd86-ed23-41f8-b6f6-31ab0517eb1d",
    day: 2,
    date: "2026-11-04",
    places: [
      {
        id: "seoul-day-2-place-1",
        name: "남산서울타워",
        address: "서울특별시 용산구 남산공원길",
        image:
          "https://images.unsplash.com/photo-1746238786708-689cbde5b6b4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "관광",
        startTime: "10:00",
        stayMinutes: 120,
      },

      {
        id: "seoul-day-2-place-2",
        name: "성수동 파스타 식당",
        address: "서울특별시 성동구 성수동",
        image:
          "https://images.unsplash.com/photo-1606021511779-aae22948af3e?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "음식점",
        startTime: "12:00",
        stayMinutes: 60,
      },
      {
        id: "seoul-day-2-place-3",
        name: "성수동 카페",
        address: "서울특별시 성동구 성수동",
        image:
          "https://images.unsplash.com/photo-1621593446047-4db277eef303?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "카페",
        startTime: "13:00",
        stayMinutes: 60,
      },
      {
        id: "seoul-day-2-place-4",
        name: "코엑스 별마당도서관",
        address: "서울특별시 강남구 영동대로",
        image:
          "https://images.unsplash.com/photo-1548701214-948e2c384afa?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "관광",
        startTime: "15:00",
        stayMinutes: 90,
      },
      {
        id: "seoul-day-2-place-5",
        name: "반포한강공원",
        address: "서울특별시 서초구 반포동",
        image:
          "https://images.unsplash.com/photo-1598932248380-2b1c90a6c858?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "관광",
        startTime: "18:00",
        stayMinutes: 120,
      },
      {
        id: "seoul-day-2-place-6",
        name: "종로 숙소",
        address: "서울특별시 종로구",
        image:
          "https://images.unsplash.com/photo-1648383228240-6ed939727ad6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        category: "숙소",
        startTime: "21:00",
        stayMinutes: 60,
      },
    ],
  },
  {
    id: "seoul-day-3",
    tripId: "0aafbd86-ed23-41f8-b6f6-31ab0517eb1d",
    day: 3,
    date: "2026-11-05",
    places: [
      //  {
      //         id: "seoul-day-3-place-1",
      //         name: "서울숲",
      //         address: "서울특별시 성동구 뚝섬로",
      //         imageUrl: "",
      //         category: "관광",
      //         startTime: "10:00",
      //         stayMinutes: 90,
      //       },
      // {
      //   id: "seoul-day-3-place-2",
      //   name: "명동 칼국수 식당",
      //   address: "서울특별시 중구 명동",
      //   imageUrl: "",
      //   category: "음식점",
      //   startTime: "13:00",
      //   stayMinutes: 60,
      // },
      // {
      //   id: "seoul-day-3-place-3",
      //   name: "명동 카페",
      //   address: "서울특별시 중구 명동",
      //   imageUrl: "",
      //   category: "카페",
      //   startTime: "14:00",
      //   stayMinutes: 60,
      // // },
      // {
      //   id: "seoul-day-3-place-4",
      //   name: "남대문시장",
      //   address: "서울특별시 중구 남대문시장길",
      //   imageUrl: "",
      //   category: "관광",
      //   startTime: "15:30",
      //   stayMinutes: 90,
      // },
    ],
  },
];
