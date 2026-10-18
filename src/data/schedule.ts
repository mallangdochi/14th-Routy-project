export type TravelSchedule = {
  id: string;
  name: string;
  region: string;
  startDate: string;
  endDate: string;
  startTime: string;
  items: string[];
};

export const travelScheduleData: TravelSchedule[] = [
  {
    id: "trip-tokyo-01",
    name: "도쿄",
    region: "일본 도쿄",
    startDate: "2026-10-04",
    endDate: "2026-10-05",
    startTime: "10:00",
    items: ["여행 준비 미팅"],
  },
  {
    id: "trip-busan-01",
    name: "부산",
    region: "부산광역시",
    startDate: "2026-10-06",
    endDate: "2026-10-08",
    startTime: "09:00",
    items: ["숙소 예약", "맛집 리스트", "여행 일정"],
  },
  {
    id: "trip-sapporo-01",
    name: "삿포로",
    region: "일본 삿포로",
    startDate: "2026-10-09",
    endDate: "2026-10-09",
    startTime: "08:30",
    items: ["항공권 예매", "숙소 예약"],
  },
  {
    id: "trip-jeju-01",
    name: "제주도",
    region: "제주특별자치도",
    startDate: "2026-10-11",
    endDate: "2026-10-14",
    startTime: "08:00",
    items: ["출발", "한라산 등반", "카페 투어", "우도 여행", "마지막 날"],
  },
  {
    id: "trip-tokyo-01",
    name: "도쿄",
    region: "일본 도쿄",
    startDate: "2026-10-18",
    endDate: "2026-10-22",
    startTime: "09:00",
    items: ["도착", "시부야 관광", "디즈니랜드", "맛집 투어", "귀국"],
  },
  {
    id: "trip-osaka-01",
    name: "오사카",
    region: "일본 오사카",
    startDate: "2026-10-25",
    endDate: "2026-10-28",
    startTime: "09:30",
    items: ["도착", "오사카성 관광", "맛집 투어", "귀국"],
  },
];
