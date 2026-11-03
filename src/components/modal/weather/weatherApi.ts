export type WeatherDay = { date: string; code: number | null; low: number | null; high: number | null; rain: number | null };
export type WeatherData = {
  current: { time: string; temperature: number; feels: number | null; code: number; isDay: boolean };
  days: WeatherDay[];
};
const cache = new Map<string, { expires: number; data: WeatherData }>();
const numberOrNull = (value: unknown): number | null => typeof value === "number" && Number.isFinite(value) ? value : null;
export async function loadWeather(latitude: number, longitude: number, signal?: AbortSignal): Promise<WeatherData> {
  if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) throw new Error("지역 좌표를 확인해주세요.");
  const key = `${latitude},${longitude}`;
  const saved = cache.get(key);
  if (saved && saved.expires > Date.now()) return saved.data;
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), current: "temperature_2m,apparent_temperature,weather_code,is_day", daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max", forecast_days: "7", timezone: "Asia/Seoul" });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  if (!response.ok) throw new Error("날씨 정보를 불러오지 못했습니다.");
  const body = await response.json();
  const c = body.current;
  if (numberOrNull(c?.temperature_2m) === null || numberOrNull(c?.weather_code) === null || typeof c?.time !== "string") throw new Error("현재 날씨 정보가 없습니다.");
  const daily = body.daily;
  const days: WeatherDay[] = Array.isArray(daily?.time) ? daily.time.slice(0, 7).filter((date: unknown) => typeof date === "string").map((date: string, i: number) => ({ date, code: numberOrNull(daily.weather_code?.[i]), low: numberOrNull(daily.temperature_2m_min?.[i]), high: numberOrNull(daily.temperature_2m_max?.[i]), rain: numberOrNull(daily.precipitation_probability_max?.[i]) })) : [];
  const data: WeatherData = { current: { time: c.time, temperature: c.temperature_2m, feels: numberOrNull(c.apparent_temperature), code: c.weather_code, isDay: c.is_day !== 0 }, days };
  if (cache.size >= 100) cache.clear();
  cache.set(key, { data, expires: Date.now() + 10 * 60_000 });
  return data;
}
