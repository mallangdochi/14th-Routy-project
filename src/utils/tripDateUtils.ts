export function isValidTripDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000-")) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}

export function normalizeTripDates(dates: readonly string[]): string[] {
  return [...new Set(dates.filter(isValidTripDate))].sort();
}

// 날짜로 기존 데이터를 찾아 Day 번호만 다시 매깁니다.
export function reindexTripDays<T extends { id: number; isoDate: string }>(
  previousDays: readonly T[],
  dates: readonly string[],
  createDay: (date: string, id: number) => T,
): T[] {
  const previousByDate = new Map(previousDays.map((day) => [day.isoDate, day]));
  return normalizeTripDates(dates).map((date, index) => {
    const existing = previousByDate.get(date);
    return existing ? { ...existing, id: index + 1 } : createDay(date, index + 1);
  });
}

export function remapStopsByDate<T>(
  previousDays: readonly { id: number; isoDate: string }[],
  nextDays: readonly { id: number; isoDate: string }[],
  previousStops: Readonly<Record<number, T[]>>,
): Record<number, T[]> {
  const stopsByDate = new Map(previousDays.map((day) => [day.isoDate, previousStops[day.id] ?? []]));
  return Object.fromEntries(nextDays.map((day) => [day.id, stopsByDate.get(day.isoDate) ?? []]));
}
