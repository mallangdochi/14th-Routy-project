export type RouteMode = "walk" | "bike" | "car" | "transit";
export type TransitType = "all" | "bus" | "subway";
export type TransportChoice = {
  label: string;
  mode?: RouteMode;
  transitType?: TransitType;
};

/** A stop's transport always describes its outgoing leg. Never replace an unknown value with car. */
export function resolveScheduleTransport(value?: string | null, defaultValue?: string | null): TransportChoice {
  const label = value?.trim() || defaultValue?.trim() || "교통수단 미설정";
  switch (label) {
    case "자동차": case "택시": case "자동차·택시": case "car":
      return { label, mode: "car" };
    case "도보": case "walk": return { label, mode: "walk" };
    case "자전거": case "bike": return { label, mode: "bike" };
    case "버스": return { label, mode: "transit", transitType: "bus" };
    case "지하철": return { label, mode: "transit", transitType: "subway" };
    case "대중교통": case "대중교통(혼합)": case "transit":
      return { label, mode: "transit", transitType: "all" };
    default: return { label };
  }
}

export function formatLegDistance(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${Math.round(meters)}m`;
}
export function formatLegDuration(seconds: number): string {
  const minutes = Math.max(0, Math.ceil(seconds / 60));
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}시간${minutes % 60 ? ` ${minutes % 60}분` : ""}`
    : `${minutes}분`;
}
