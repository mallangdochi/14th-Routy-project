/**
 * Routy local schedule store. Search, saved places, detail and timetable share it.
 * Local browser persistence only: not account-synced or a backend database.
 */
import { mockTripDays, type TripDay, type TripDayPlace } from "./tripDays";
import { trips } from "./trips";

const STORAGE_KEY = "routy:trip-schedules:v1";
export const TRIP_SCHEDULE_CHANGE = "routy:trip-schedules-changed";

type DaySnapshots = Record<string, TripDayPlace[]>;

export type NewSchedulePlace = {
  id: string;
  name: string;
  category: string;
  image?: string;
  address?: string;
  lat?: number;
  lng?: number;
};

function dayKey(tripId: string, date: string) {
  return `${tripId}|${date}`;
}

function readSnapshots(): DaySnapshots {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, TripDayPlace[]] =>
          Array.isArray(entry[1]) &&
          entry[1].every(
            (item: unknown) =>
              typeof item === "object" &&
              item !== null &&
              typeof (item as TripDayPlace).id === "string" &&
              typeof (item as TripDayPlace).name === "string",
          ),
      ),
    );
  } catch {
    return {};
  }
}

function writeSnapshots(next: DaySnapshots) {
  if (typeof window === "undefined")
    throw new Error("브라우저에서만 저장할 수 있습니다.");
  // Don't report success when storage is blocked or quota is exceeded.
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(TRIP_SCHEDULE_CHANGE));
}

function buildDateRange(start: string, end: string): string[] {
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);
  if (
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime()) ||
    endDate < startDate
  )
    return [];
  const dates: string[] = [];
  for (
    let current = new Date(startDate);
    current <= endDate && dates.length < 90;
    current.setDate(current.getDate() + 1)
  ) {
    dates.push(
      `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`,
    );
  }
  return dates;
}

export function getTripDaysWithSaved(tripId: string): TripDay[] {
  const trip = trips.find((item) => item.id === tripId);
  const samples = mockTripDays.filter((item) => item.tripId === tripId);
  const datesFromTrip = trip
    ? buildDateRange(trip.startDate, trip.endDate)
    : [];
  const sampleDates = samples.map((day) => day.date);

  // Preserve legacy sample days if their dates differ from the trip data;
  // otherwise extend sample days through the actual trip end date.
  const hasMatchingSample = sampleDates.some((date) =>
    datesFromTrip.includes(date),
  );
  const saved = readSnapshots();
  const savedDates = Object.keys(saved)
    .filter((key) => key.startsWith(`${tripId}|`))
    .map((key) => key.slice(tripId.length + 1))
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date));
  const dates = [
    ...new Set([
      ...(samples.length && !hasMatchingSample
        ? sampleDates
        : [...sampleDates, ...datesFromTrip]),
      ...savedDates,
    ]),
  ].sort();

  return dates.map((date, index) => {
    const original = samples.find((day) => day.date === date);
    return {
      id: original?.id ?? `trip-${tripId}-date-${date}`,
      tripId,
      date,
      day: index + 1,
      places: saved[dayKey(tripId, date)] ?? original?.places ?? [],
    };
  });
}

export function saveTripDayPlaces(
  tripId: string,
  date: string,
  places: TripDayPlace[],
) {
  if (!tripId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("여행 또는 날짜가 올바르지 않습니다.");
  }
  const saved = readSnapshots();
  saved[dayKey(tripId, date)] = places.map((place) => ({ ...place }));
  writeSnapshots(saved);
}

function nextStartTime(places: TripDayPlace[]) {
  const validTimes = places
    .map((p) => p.startTime)
    .filter((t): t is string => !!t && /^([01]\d|2[0-3]):[0-5]\d$/.test(t));
  if (!validTimes.length) return "12:00";
  const latest = validTimes.sort().at(-1)!;
  const [hours, minutes] = latest.split(":").map(Number);
  const next = hours * 60 + minutes + 60;
  return next < 24 * 60
    ? `${String(Math.floor(next / 60)).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}`
    : "12:00";
}

export function addPlaceToTrip(
  tripId: string,
  date: string,
  place: NewSchedulePlace,
): TripDayPlace {
  const day = getTripDaysWithSaved(tripId).find((item) => item.date === date);
  if (!day) throw new Error("선택한 여행 날짜를 찾을 수 없습니다.");
  if (!place.name.trim()) throw new Error("장소 이름이 없습니다.");

  const duplicated = day.places.some(
    (item) =>
      (item.sourcePlaceId && item.sourcePlaceId === place.id) ||
      (item.name.trim() === place.name.trim() &&
        item.address === place.address),
  );
  if (duplicated)
    throw new Error("이 장소는 선택한 날짜의 일정에 이미 있습니다.");

  const record: TripDayPlace = {
    id: `added-${crypto.randomUUID()}`,
    sourcePlaceId: place.id,
    name: place.name.trim(),
    address: place.address,
    category: place.category,
    image: place.image,
    lat: Number.isFinite(place.lat) ? place.lat : undefined,
    lng: Number.isFinite(place.lng) ? place.lng : undefined,
    startTime: nextStartTime(day.places),
    stayMinutes: 60,
  };
  saveTripDayPlaces(tripId, date, [...day.places, record]);
  return record;
}
