export type TripStatus = "PLANNING" | "IN_PROGRESS" | "COMPLETED";

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  image: string;
  places: number;
  schedules: number;
  updatedAt: string;
}

export const trips: Trip[] = [
  {
    id: "1",
    title: "제주, 천천히 걷는 3일",
    startDate: "2026-10-16",
    endDate: "2026-10-18",
    status: "PLANNING",
    image:
      "https://images.unsplash.com/photo-1572609025690-7e948447d2c1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    places: 8,
    schedules: 12,
    updatedAt: "2026-10-14",
  },
  {
    id: "2",
    title: "부산 주말 여행",
    startDate: "2026-10-07",
    endDate: "2026-10-18",
    status: "IN_PROGRESS",
    image:
      "https://images.unsplash.com/photo-1773809253574-df18be895f2f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    places: 6,
    schedules: 8,
    updatedAt: "2026-10-13",
  },
  {
    id: "3",
    title: "강릉 힐링 여행",
    startDate: "2026-08-01",
    endDate: "2026-08-03",
    status: "COMPLETED",
    image:
      "https://images.unsplash.com/photo-1684042229029-8a899193a8e4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    places: 10,
    schedules: 14,
    updatedAt: "2026-10-10",
  },
  {
    id: "4",
    title: "프랑스 파리 감성여행",
    startDate: "2026-12-10",
    endDate: "2026-12-18",
    status: "PLANNING",
    image:
      "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    places: 18,
    schedules: 26,
    updatedAt: "2026-10-09",
  },
  {
    id: "5",
    title: "이탈리아 로마·아말피",
    startDate: "2027-06-01",
    endDate: "2027-06-10",
    status: "PLANNING",
    image:
      "https://images.unsplash.com/photo-1652707227612-e3c18815ccc7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    places: 14,
    schedules: 28,
    updatedAt: "2026-10-08",
  },
];
