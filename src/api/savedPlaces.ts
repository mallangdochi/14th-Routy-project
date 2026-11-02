// src/api/savedPlaces.ts

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
  description?: string;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type SavedPlace = SavePlaceInput & {
  createdAt: string;
};

type SavedPlacesResponse = {
  places: SavedPlace[];
};

type SavePlaceResponse = {
  place: SavedPlace;
};

type DeletePlaceResponse = {
  success: boolean;
};

// 기존 통합 API 라우터에 연결할 주소.
// 라우터 주소가 다르면 이 값도 함께 변경해야 함.
const ENDPOINT = "/api/profile/saved-places";

export class SavedPlacesApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "SavedPlacesApiError";
    this.status = status;
  }
}

function getResponseMessage(data: unknown, fallback: string): string {
  if (
    data !== null &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return fallback;
}

async function request<T>(
  method: "GET" | "POST" | "DELETE",
  body?: unknown,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(ENDPOINT, {
      method,
      credentials: "include",
      cache: "no-store",
      headers:
        body === undefined
          ? undefined
          : {
              "Content-Type": "application/json",
            },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new SavedPlacesApiError(
      "서버에 연결하지 못했어요. 네트워크 상태를 확인해 주세요.",
      0,
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new SavedPlacesApiError(
      getResponseMessage(
        data,
        response.status === 401
          ? "로그인 후 이용해 주세요."
          : "저장한 장소 요청을 처리하지 못했어요.",
      ),
      response.status,
    );
  }

  if (data === null) {
    throw new SavedPlacesApiError(
      "서버 응답을 확인하지 못했어요.",
      response.status,
    );
  }

  return data as T;
}

/**
 * 로그인한 사용자의 저장 목록 조회.
 */
export async function getSavedPlaces(): Promise<SavedPlace[]> {
  const data = await request<SavedPlacesResponse>("GET");

  if (!Array.isArray(data.places)) {
    throw new SavedPlacesApiError("저장 목록 응답이 올바르지 않아요.", 200);
  }

  return data.places;
}

/**
 * 장소 저장.
 */
export async function savePlace(place: SavePlaceInput): Promise<SavedPlace> {
  const data = await request<SavePlaceResponse>("POST", place);

  if (!data.place || typeof data.place !== "object") {
    throw new SavedPlacesApiError("장소 저장 응답이 올바르지 않아요.", 200);
  }

  return data.place;
}

/**
 * 장소 저장 해제.
 */
export async function removeSavedPlace(place: PlaceIdentity): Promise<void> {
  const data = await request<DeletePlaceResponse>("DELETE", {
    provider: place.provider,
    placeId: place.placeId,
  });

  if (data.success !== true) {
    throw new SavedPlacesApiError("장소 저장을 해제하지 못했어요.", 200);
  }
}
