import type { SupabaseClient } from "@supabase/supabase-js";

type PlaceCategory =
  | "attraction"
  | "restaurant"
  | "cafe"
  | "accommodation"
  | "other";

type PlaceIdentity = {
  provider: string;
  placeId: string;
};

type SavePlaceInput = PlaceIdentity & {
  name: string;
  category: PlaceCategory;
  address: string;
  description: string;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
};

type SavedPlace = SavePlaceInput & {
  createdAt: string;
};

type SavedPlaceRow = {
  provider: string;
  place_id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  description: string;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

const CATEGORY_VALUES = new Set<string>([
  "attraction",
  "restaurant",
  "cafe",
  "accommodation",
  "other",
]);

const SELECT_COLUMNS = `
  provider,
  place_id,
  name,
  category,
  address,
  description,
  image_url,
  latitude,
  longitude,
  created_at
`;

export class SavedPlacesInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SavedPlacesInputError";
  }
}

function readObject(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new SavedPlacesInputError("요청 데이터가 올바르지 않습니다.");
  }

  return value as Record<string, unknown>;
}

function readText(
  value: unknown,
  label: string,
  maxLength: number,
  required = true,
): string {
  if (value === undefined || value === null) {
    if (!required) return "";

    throw new SavedPlacesInputError(`${label} 값이 필요합니다.`);
  }

  if (typeof value !== "string") {
    throw new SavedPlacesInputError(`${label} 값이 올바르지 않습니다.`);
  }

  const result = value.trim();

  if (required && result.length === 0) {
    throw new SavedPlacesInputError(`${label} 값이 필요합니다.`);
  }

  if (result.length > maxLength) {
    throw new SavedPlacesInputError(
      `${label}은(는) ${maxLength}자 이하여야 합니다.`,
    );
  }

  return result;
}

function readCategory(value: unknown): PlaceCategory {
  if (typeof value !== "string" || !CATEGORY_VALUES.has(value)) {
    throw new SavedPlacesInputError("장소 카테고리가 올바르지 않습니다.");
  }

  return value as PlaceCategory;
}

function readCoordinate(
  value: unknown,
  label: string,
  min: number,
  max: number,
): number | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  ) {
    throw new SavedPlacesInputError(`${label} 값이 올바르지 않습니다.`);
  }

  return value;
}

function readImageUrl(value: unknown): string | null {
  const text = readText(value, "이미지 주소", 4096, false);

  if (!text) return null;

  let url: URL;

  try {
    url = new URL(text);
  } catch {
    throw new SavedPlacesInputError("이미지 주소가 올바르지 않습니다.");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new SavedPlacesInputError(
      "이미지 주소는 http 또는 https 주소여야 합니다.",
    );
  }

  return url.href;
}

function parseIdentity(input: unknown): PlaceIdentity {
  const body = readObject(input);

  return {
    provider: readText(body.provider, "장소 출처", 50),
    placeId: readText(body.placeId, "장소 ID", 200),
  };
}

function parsePlace(input: unknown): SavePlaceInput {
  const body = readObject(input);
  const identity = parseIdentity(body);

  return {
    ...identity,
    name: readText(body.name, "장소명", 300),
    category: readCategory(body.category),
    address: readText(body.address, "주소", 1000, false),
    description: readText(body.description, "설명", 5000, false),
    imageUrl: readImageUrl(body.imageUrl),
    latitude: readCoordinate(body.latitude, "위도", -90, 90),
    longitude: readCoordinate(body.longitude, "경도", -180, 180),
  };
}

function toSavedPlace(row: SavedPlaceRow): SavedPlace {
  return {
    provider: row.provider,
    placeId: row.place_id,
    name: row.name,
    category: row.category,
    address: row.address,
    description: row.description,
    imageUrl: row.image_url,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.created_at,
  };
}

/**
 * 로그인한 사용자의 저장 목록을 최근 저장순으로 조회.
 */
export async function listSavedPlaces(
  supabase: SupabaseClient,
  userId: string,
): Promise<SavedPlace[]> {
  const places: SavedPlace[] = [];
  const pageSize = 500;

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("saved_places")
      .select(SELECT_COLUMNS)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .order("provider", { ascending: true })
      .order("place_id", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw error;

    const rows = (data ?? []) as SavedPlaceRow[];

    places.push(...rows.map(toSavedPlace));

    if (rows.length < pageSize) {
      break;
    }
  }

  return places;
}

/**
 * 장소 저장.
 * 이미 저장된 장소이면 기존 저장 데이터를 반환.
 */
export async function addSavedPlace(
  supabase: SupabaseClient,
  userId: string,
  input: unknown,
): Promise<SavedPlace> {
  const place = parsePlace(input);

  const { error: insertError } = await supabase.from("saved_places").insert({
    user_id: userId,
    provider: place.provider,
    place_id: place.placeId,
    name: place.name,
    category: place.category,
    address: place.address,
    description: place.description,
    image_url: place.imageUrl,
    latitude: place.latitude,
    longitude: place.longitude,
  });

  // 23505: 기본키 또는 UNIQUE 제약에 의한 중복.
  if (insertError && insertError.code !== "23505") {
    throw insertError;
  }

  const { data, error } = await supabase
    .from("saved_places")
    .select(SELECT_COLUMNS)
    .eq("user_id", userId)
    .eq("provider", place.provider)
    .eq("place_id", place.placeId)
    .single();

  if (error) throw error;

  return toSavedPlace(data as SavedPlaceRow);
}

/**
 * 장소 저장 해제.
 * 이미 삭제된 장소여도 정상 완료.
 */
export async function deleteSavedPlace(
  supabase: SupabaseClient,
  userId: string,
  input: unknown,
): Promise<void> {
  const place = parseIdentity(input);

  const { error } = await supabase
    .from("saved_places")
    .delete()
    .eq("user_id", userId)
    .eq("provider", place.provider)
    .eq("place_id", place.placeId);

  if (error) throw error;
}
