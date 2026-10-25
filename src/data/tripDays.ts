export type TripDayPlace = {
  id: string;
  name: string;
  startTime?: string;
  stayMinutes?: number;
};

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
        startTime: "09:00",
        stayMinutes: 60,
      },
      {
        id: "trip-1-day-1-place-2",
        name: "함덕해수욕장",
        startTime: "10:30",
        stayMinutes: 120,
      },
      {
        id: "trip-1-day-1-place-3",
        name: "제주 흑돼지 맛집",
        startTime: "13:00",
        stayMinutes: 90,
      },
      {
        id: "trip-1-day-1-place-4",
        name: "카페 멜로드",
        startTime: "15:00",
        stayMinutes: 90,
      },
      {
        id: "trip-1-day-1-place-5",
        name: "성산일출봉",
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
        startTime: "08:00",
      },
      {
        id: "trip-2-day-1-place-2",
        name: "해운대해수욕장",
        startTime: "11:00",
        stayMinutes: 120,
      },
      {
        id: "trip-2-day-1-place-3",
        name: "광안리",
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
        startTime: "10:00",
        stayMinutes: 120,
      },
      {
        id: "trip-2-day-2-place-2",
        name: "자갈치시장",
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
        startTime: "09:00",
        stayMinutes: 90,
      },
      {
        id: "trip-2-day-3-place-2",
        name: "태종대",
        startTime: "11:00",
        stayMinutes: 180,
      },
      {
        id: "trip-2-day-3-place-3",
        name: "영도대교",
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
        startTime: "09:00",
        stayMinutes: 90,
      },
      {
        id: "trip-2-day-4-place-2",
        name: "기장시장",
        startTime: "12:00",
        stayMinutes: 90,
      },
      {
        id: "trip-2-day-4-place-3",
        name: "송정해수욕장",
        startTime: "15:00",
        stayMinutes: 120,
      },
      {
        id: "trip-2-day-4-place-4",
        name: "청사포",
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
        startTime: "09:00",
        stayMinutes: 120,
      },
      {
        id: "trip-2-day-5-place-2",
        name: "전포카페거리",
        startTime: "12:00",
        stayMinutes: 120,
      },
      {
        id: "trip-2-day-5-place-3",
        name: "부산역",
        startTime: "16:00",
        stayMinutes: 60,
      },
    ],
  },
];
