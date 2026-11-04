export type ChecklistCategory = "필수품" | "개인용품" | "기타";
export type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  checked: boolean;
};
export type ChecklistGroup = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

export function createEmptyChecklist(): ChecklistGroup[] {
  return (["필수품", "개인용품", "기타"] as const).map(title => ({
    id: title, title, items: [],
  }));
}

export type TripChecklistResult = {
  tripId: string;
  version: number;
  groups: ChecklistGroup[];
  canEdit: boolean;
};
export class TripChecklistApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "TripChecklistApiError";
    this.status = status;
  }
}

async function request(
  tripId: string,
  body?: { version: number; groups: ChecklistGroup[] },
  signal?: AbortSignal,
): Promise<TripChecklistResult> {
  const response = await fetch(`/api/trips/checklist${body ? "" : `?tripId=${encodeURIComponent(tripId)}`}`, {
    method: body ? "POST" : "GET",
    credentials: "include",
    cache: "no-store",
    signal,
    ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, tripId }) } : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new TripChecklistApiError(data?.message ?? "체크리스트를 처리하지 못했습니다.", response.status);
  if (data?.tripId !== tripId || !Number.isSafeInteger(data.version) || data.version < 0 || typeof data.canEdit !== "boolean" || !Array.isArray(data.groups)) {
    throw new TripChecklistApiError("체크리스트 응답을 확인해주세요.", 502);
  }
  const categories = ["필수품", "개인용품", "기타"];
  if (data.groups.length !== 3 || data.groups.some((group: ChecklistGroup, i: number) =>
    !group || group.id !== categories[i] || group.title !== categories[i] || !Array.isArray(group.items) ||
    group.items.some(item => !item || typeof item.id !== "string" || typeof item.title !== "string" || typeof item.description !== "string" || typeof item.checked !== "boolean"))) {
    throw new TripChecklistApiError("체크리스트 항목을 확인해주세요.", 502);
  }
  return data as TripChecklistResult;
}
export const getTripChecklist = (tripId: string, signal?: AbortSignal) => request(tripId, undefined, signal);
export const saveTripChecklist = (tripId: string, version: number, groups: ChecklistGroup[]) => request(tripId, { version, groups });
