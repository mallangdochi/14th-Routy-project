export type TripStatus = "PLANNING" | "IN_PROGRESS" | "COMPLETED";

export interface Trip {
  id: string;
  title: string;
  region: string;
  startDate: string;
  endDate: string;
  startTime: string;
  status: TripStatus;
  image: string;
  places: number;
  schedules: number;
  items: string[];
  updatedAt: string;
}

export const trips: Trip[] = [
  {
    id: "1",
    title: "제주, 천천히 걷는 3일",
    region: "제주특별자치도",
    startDate: "2026-10-29",
    endDate: "2026-11-01",
    startTime: "08:00",
    status: "PLANNING",
    image:
      "https://images.unsplash.com/photo-1572609025690-7e948447d2c1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    places: 8,
    schedules: 12,
    items: ["제주 도착", "해안 산책", "카페 투어", "우도 여행", "귀가"],
    updatedAt: "2026-10-14",
  },
  {
    id: "2",
    title: "부산 주말 여행",
    region: "부산광역시",
    startDate: "2026-10-16",
    endDate: "2026-10-18",
    startTime: "09:00",
    status: "IN_PROGRESS",
    image:
      "https://images.unsplash.com/photo-1773809253574-df18be895f2f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    places: 6,
    schedules: 8,
    items: ["부산 도착", "해운대 산책", "광안리 야경", "맛집 투어", "귀가"],
    updatedAt: "2026-10-13",
  },
  {
    id: "3",
    title: "강릉 힐링 여행",
    region: "강원특별자치도 강릉시",
    startDate: "2026-08-01",
    endDate: "2026-08-03",
    startTime: "09:30",
    status: "COMPLETED",
    image:
      "https://images.unsplash.com/photo-1684042229029-8a899193a8e4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    places: 10,
    schedules: 14,
    items: [
      "강릉 도착",
      "안목해변 카페 투어",
      "경포대 산책",
      "시장 구경",
      "귀가",
    ],
    updatedAt: "2026-10-10",
  },
  {
    id: "4",
    title: "프랑스 파리 감성여행",
    region: "프랑스 파리",
    startDate: "2026-12-10",
    endDate: "2026-12-18",
    startTime: "10:00",
    status: "PLANNING",
    image:
      "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    places: 18,
    schedules: 26,
    items: [
      "파리 도착",
      "에펠탑 방문",
      "루브르 박물관 관람",
      "몽마르트르 산책",
      "센강 유람선",
      "귀국",
    ],
    updatedAt: "2026-10-09",
  },
  {
    id: "5",
    title: "이탈리아 로마·아말피",
    region: "이탈리아 로마·아말피",
    startDate: "2027-06-01",
    endDate: "2027-06-10",
    startTime: "09:00",
    status: "PLANNING",
    image:
      "https://images.unsplash.com/photo-1652707227612-e3c18815ccc7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    places: 14,
    schedules: 28,
    items: [
      "로마 도착",
      "콜로세움 관람",
      "바티칸 투어",
      "아말피 이동",
      "해안 마을 산책",
      "귀국",
    ],
    updatedAt: "2026-10-08",
  },
];
