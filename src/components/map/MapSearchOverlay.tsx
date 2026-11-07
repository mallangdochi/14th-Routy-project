import { useEffect, useRef, useState, type FormEvent } from "react";
import { loadKakaoMaps } from "../../api/kakao/kakaoSdk";
import type { KakaoMapsSDK } from "../../api/kakao/kakaoTypes";
import {
  getAllowedCurrentLocation,
  isLocationEnabled,
  LOCATION_CHANGE_EVENT,
  type CurrentLocation,
} from "../../utils/locationService";
import * as S from "./MapSearchOverlayStyle";

export type SearchedMapPlace = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: "관광지" | "맛집" | "카페" | "숙소";
  description: string;
};

type Props = {
  region: string;
  onAddPlace: (place: SearchedMapPlace) => Promise<void> | void;
  canAdd?: boolean;
  onFocus: (lat: number, lng: number) => void;
};

type KakaoResult = {
  id?: string;
  place_name: string;
  address_name?: string;
  road_address_name?: string;
  category_group_code?: string;
  category_name?: string;
  x: string;
  y: string;
};

type SearchOptions = {
  size: number;
  location?: InstanceType<KakaoMapsSDK["LatLng"]>;
  radius?: number;
};

type NearbyCategory = "관광지" | "맛집" | "카페";

function convert(rows: KakaoResult[]): SearchedMapPlace[] {
  return rows.map((place) => ({
    id: place.id ? `kakao-${place.id}` : `map-${place.y}-${place.x}`,
    name: place.place_name,
    address: place.road_address_name || place.address_name || "주소 정보 없음",
    lat: Number(place.y),
    lng: Number(place.x),
    category: place.category_group_code === "FD6" ? "맛집" as const
      : place.category_group_code === "CE7" ? "카페" as const
      : place.category_group_code === "AD5" ? "숙소" as const
      : "관광지" as const,
    description: place.category_name || "",
  })).filter((place) => Boolean(place.name) && Number.isFinite(place.lat) && Number.isFinite(place.lng));
}

async function kakaoSearch(
  sdk: KakaoMapsSDK,
  keyword: string,
  options: SearchOptions,
): Promise<SearchedMapPlace[]> {
  const places = new sdk.services.Places();
  return new Promise((resolve, reject) => {
    // Local typing only: Kakao JS SDK supports radius/size even when the shared minimal
    // KakaoMapsSDK declaration lists only location.
    const search = places.keywordSearch as unknown as (
      word: string,
      callback: (rows: KakaoResult[], status: string) => void,
      searchOptions?: SearchOptions,
    ) => void;
    search(keyword, (rows, status) => {
      if (status === "OK") resolve(convert(rows));
      else if (status === "ZERO_RESULT") resolve([]);
      else reject(new Error(`카카오 장소 검색에 실패했습니다 (${status}).`));
    }, options);
  });
}

export default function MapSearchOverlay({ region, onAddPlace, canAdd = true, onFocus }: Props) {
  const [keyword, setKeyword] = useState("");
  const [found, setFound] = useState<SearchedMapPlace[]>([]);
  const [busy, setBusy] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(isLocationEnabled);
  const [category, setCategory] = useState<NearbyCategory>("관광지");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [location, setLocation] = useState<CurrentLocation | null>(null);
  const requestId = useRef(0);

  async function runSearch(term: string, nearby: boolean, moveMap = false) {
    const request = ++requestId.current;
    setBusy(true);
    setError("");
    setFeedback("");
    setSearched(false);
    try {
      const sdk = await loadKakaoMaps();
      let rows: SearchedMapPlace[];
      if (nearby) {
        const current = await getAllowedCurrentLocation();
        if (!current) throw new Error("마이페이지의 위치서비스를 허용하고 설정을 저장해 주세요.");
        if (request !== requestId.current) return;
        setLocation(current);
        if (moveMap) onFocus(current.lat, current.lng);
        rows = await kakaoSearch(sdk, term || "관광지", {
          location: new sdk.LatLng(current.lat, current.lng),
          radius: 10000,
          size: 15,
        });
      } else {
        if (!term.trim()) return;
        rows = await kakaoSearch(sdk, `${region} ${term}`.trim(), { size: 15 });
        if (!rows.length && region.trim()) rows = await kakaoSearch(sdk, term, { size: 15 });
      }
      if (request !== requestId.current) return;
      setFound(rows);
      setSearched(true);
    } catch (reason: unknown) {
      if (request !== requestId.current) return;
      setFound([]);
      setSearched(true);
      setError(reason instanceof Error ? reason.message : "장소를 검색하지 못했습니다.");
    } finally {
      if (request === requestId.current) setBusy(false);
    }
  }

  useEffect(() => {
    const refresh = () => setLocationEnabled(isLocationEnabled());
    window.addEventListener(LOCATION_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      requestId.current += 1;
      window.removeEventListener(LOCATION_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Location-enabled users receive real nearby suggestions without automatically
  // changing a trip's destination or inserting places into the itinerary.
  useEffect(() => {
    if (!locationEnabled) {
      requestId.current += 1;
      setLocation(null);
      setFound([]);
      setSearched(false);
      return;
    }
    void runSearch(category, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationEnabled, category]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runSearch(keyword.trim(), false);
  };

  const addPlace = async (place: SearchedMapPlace) => {
    setAddingId(place.id);
    setError("");
    setFeedback("");
    try {
      await onAddPlace(place);
      setFeedback(`${place.name}을(를) 현재 날짜 일정에 저장했습니다.`);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "일정 추가에 실패했습니다.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <S.Root aria-label="지도 내 장소 검색">
      <S.Form onSubmit={submit}>
        <S.Input
          aria-label="지도에서 장소 검색"
          placeholder={`${region} 장소 검색`}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <S.Button type="submit" disabled={busy || Boolean(addingId)}>
          {busy ? "검색 중" : "검색"}
        </S.Button>
      </S.Form>
      {locationEnabled && (
        <>
          <S.NearbyRow aria-label="현재 위치 기반 추천">
            {(["관광지", "맛집", "카페"] as const).map((next) => (
              <S.NearbyButton
                key={next}
                type="button"
                $active={category === next}
                aria-pressed={category === next}
                disabled={busy}
                onClick={() => { if (category === next) void runSearch(next, true); else setCategory(next); }}
              >
                내 주변 {next}
              </S.NearbyButton>
            ))}
          </S.NearbyRow>
          {location && (
            <S.NearbyButton type="button" onClick={() => onFocus(location.lat, location.lng)}>
              내 현재 위치로 지도 이동 · 정확도 약 ±{Math.ceil(location.accuracy)}m
            </S.NearbyButton>
          )}
        </>
      )}
      {error && <S.Status $error role="alert">{error}</S.Status>}
      {feedback && <S.Status role="status">{feedback}</S.Status>}
      {!busy && searched && !error && found.length === 0 && (
        <S.Status role="status">검색 결과가 없습니다.</S.Status>
      )}
      {busy && <S.Status role="status">장소를 찾고 있습니다.</S.Status>}
      {found.length > 0 && (
        <S.ResultList role="list" aria-label="장소 검색 결과">
          {found.map((place) => (
            <S.ResultItem role="listitem" key={place.id}>
              <S.PlaceButton type="button" onClick={() => onFocus(place.lat, place.lng)}>
                <strong>{place.name}</strong>
                <span>{place.address}</span>
              </S.PlaceButton>
              {canAdd && (
                <S.Button
                  type="button"
                  disabled={busy || Boolean(addingId)}
                  onClick={() => { onFocus(place.lat, place.lng); void addPlace(place); }}
                >
                  {addingId === place.id ? "저장 중" : "+ 일정 추가"}
                </S.Button>
              )}
            </S.ResultItem>
          ))}
        </S.ResultList>
      )}
    </S.Root>
  );
}
