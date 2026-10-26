// import type { TravelSchedule } from "../data/schedule";

// export function dateKey(date: Date): string {
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
// }
// export function parseDate(value: string): Date {
//   const [year, month, day] = value.split("-").map(Number);
//   return new Date(year, month - 1, day);
// }
// export function addDays(date: Date, amount: number): Date {
//   return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
// }
// export function monthWeeks(month: Date): Date[][] {
//   const first = new Date(month.getFullYear(), month.getMonth(), 1);
//   const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
//   const start = addDays(first, -first.getDay());
//   const count = Math.ceil((first.getDay() + last.getDate()) / 7);
//   return Array.from({ length: count }, (_, row) =>
//     Array.from({ length: 7 }, (_, col) => addDays(start, row * 7 + col)),
//   );
// }
// export function weekSegments(week: Date[], trips: TravelSchedule[]) {
//   const first = dateKey(week[0]);
//   const last = dateKey(week[6]);
//   const lanes: number[] = [];
//   return trips
//     .filter((trip) => trip.startDate <= last && trip.endDate >= first)
//     .sort(
//       (a, b) =>
//         a.startDate.localeCompare(b.startDate) ||
//         a.endDate.localeCompare(b.endDate) ||
//         a.id.localeCompare(b.id),
//     )
//     .map((trip) => {
//       const start = week.findIndex((date) => dateKey(date) >= trip.startDate);
//       let end = 6;
//       while (end > start && dateKey(week[end]) > trip.endDate) end--;
//       let lane = lanes.findIndex((occupiedEnd) => occupiedEnd < start);
//       if (lane === -1) lane = lanes.length;
//       lanes[lane] = end;
//       return { trip, start, end, lane };
//     });
// }
import type { Trip } from "../data/trips";

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function monthWeeks(month: Date): Date[][] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const start = addDays(first, -first.getDay());
  const count = Math.ceil((first.getDay() + last.getDate()) / 7);

  return Array.from({ length: count }, (_, row) =>
    Array.from({ length: 7 }, (_, col) => addDays(start, row * 7 + col)),
  );
}

export function weekSegments(week: Date[], trips: Trip[]) {
  const first = dateKey(week[0]);
  const last = dateKey(week[6]);
  const lanes: number[] = [];

  return trips
    .filter((trip) => trip.startDate <= last && trip.endDate >= first)
    .sort(
      (a, b) =>
        a.startDate.localeCompare(b.startDate) ||
        a.endDate.localeCompare(b.endDate) ||
        a.id.localeCompare(b.id),
    )
    .map((trip) => {
      const start = week.findIndex((date) => dateKey(date) >= trip.startDate);
      let end = 6;

      while (end > start && dateKey(week[end]) > trip.endDate) end--;

      let lane = lanes.findIndex((occupiedEnd) => occupiedEnd < start);

      if (lane === -1) lane = lanes.length;

      lanes[lane] = end;

      return { trip, start, end, lane };
    });
}
