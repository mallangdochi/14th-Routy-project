export type TripDayPlace = {
  id: string;
  name: string;
  startTime?: string;
};

export type TripDay = {
  id: string;
  tripId: string;
  day: number;
  date: string;
  places: TripDayPlace[];
};

export const mockTripDays: TripDay[] = [
  {
    id: "trip-2-day-1",
    tripId: "2",
    day: 1,
    date: "2026-10-16",
    places: [
      {
        id: "trip-2-day-1-place-1",
        name: "부산역",
        startTime: "09:00",
      },
      {
        id: "trip-2-day-1-place-2",
        name: "해운대해수욕장",
        startTime: "11:00",
      },
      {
        id: "trip-2-day-1-place-3",
        name: "광안리",
        startTime: "18:00",
      },
    ],
  },
  {
    id: "trip-2-day-2",
    tripId: "2",
    day: 2,
    date: "2026-10-17",
    places: [
      {
        id: "trip-2-day-2-place-1",
        name: "감천문화마을",
        startTime: "10:00",
      },
      {
        id: "trip-2-day-2-place-2",
        name: "자갈치시장",
        startTime: "13:00",
      },
    ],
  },
  {
    id: "trip-2-day-3",
    tripId: "2",
    day: 3,
    date: "2026-10-18",
    places: [
      {
        id: "trip-2-day-3-place-1",
        name: "자갈치시장",
        startTime: "09:00",
      },
      {
        id: "trip-2-day-3-place-2",
        name: "태종대",
        startTime: "11:00",
      },
      {
        id: "trip-2-day-3-place-3",
        name: "부산역",
        startTime: "16:00",
      },
    ],
  },
];
