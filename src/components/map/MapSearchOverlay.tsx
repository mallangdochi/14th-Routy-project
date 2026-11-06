import { useEffect, useRef, useState, type FormEvent } from "react";
import { loadKakaoMaps } from "../../api/kakao/kakaoSdk";
import type { KakaoMapsSDK } from "../../api/kakao/kakaoTypes";
import {
  getAllowedCurrentLocation,
  isLocationEnabled,
  LOCATION_CHANGE_EVENT,
} from "../../utils/locationService";

export type SearchedMapPlace = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type Options = {
  region: string;
  onAddPlace: (place: SearchedMapPlace) => void;
  canAdd?: boolean;
  onFocus: (lat: number, lng: number) => void;
};

type SearchResult = {
  place_name: string;
  address_name?: string;
  road_address_name?: string;
  x: string;
  y: string;
};

type PlaceSearchOptions = {
  size: number;
  location?: InstanceType<KakaoMapsSDK["LatLng"]>;
  radius?: number;
};

function toPlaces(rows: SearchResult[]): SearchedMapPlace[] {
  return rows.map((row) => ({
    name: row.place_name,
    address: row.road_address_name || row.address_name || "주소 정보 없음",
    lat: Number(row.y), lng: Number(row.x),
  })).filter((p) => p.name && Number.isFinite(p.lat) && Number.isFinite(p.lng));
}

export default function MapSearchOverlay({ region, onAddPlace, canAdd = true, onFocus }: Options) {
  const [keyword, setKeyword] = useState("");
  const [found, setFound] = useState<SearchedMapPlace[]>([]);
  const [busy, setBusy] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(isLocationEnabled);
  const requestId = useRef(0);

  useEffect(() => {
    const update = () => setLocationEnabled(isLocationEnabled());
    window.addEventListener(LOCATION_CHANGE_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      requestId.current++;
      window.removeEventListener(LOCATION_CHANGE_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  async function sdkQuery(
    sdk: KakaoMapsSDK, keywordValue: string, options: PlaceSearchOptions,
  ): Promise<SearchedMapPlace[]> {
    return new Promise((resolve, reject) => {
      const places = new sdk.services.Places();
      places.keywordSearch(keywordValue, (data, status) => {
        if (status === sdk.services.Status.OK) {
          resolve(toPlaces(data as SearchResult[]));
        } else if (status === "ZERO_RESULT") {
          resolve([]);
        } else {
          reject(new Error("카카오 장소 검색에 실패했습니다. 지도 API 설정을 확인하세요."));
        }
      }, options);
    });
  }

  async function search(keywordValue: string, nearMe: boolean): Promise<void> {
    const id = ++requestId.current;
    setBusy(true); setError(""); setSearched(false);
    try {
      const sdk = await loadKakaoMaps();
      let rows: SearchedMapPlace[] = [];
      if (nearMe) {
        const point = await getAllowedCurrentLocation();
        if (!point) throw new Error("마이페이지 → 설정 → 위치서비스에서 허용해 주세요.");
        if (id !== requestId.current) return;
        onFocus(point.lat, point.lng);
        // 반경 제한이 적용되는 내 주변 검색. 위치는 카카오 장소 검색 요청에만 사용합니다.
        rows = await sdkQuery(sdk, keywordValue || "관광지", {
          location: new sdk.LatLng(point.lat, point.lng), radius: 10000, size: 15,
        });
      } else {
        const term = keywordValue.trim();
        if (!term) { setBusy(false); return; }
        rows = await sdkQuery(sdk, `${region} ${term}`.trim(), { size: 15 });
        // 다른 지역의 장소명도 검색할 수 있도록 결과가 없을 때 원래 검색어로 재검색
        if (!rows.length && region.trim()) rows = await sdkQuery(sdk, term, { size: 15 });
      }
      if (id !== requestId.current) return;
      setFound(rows); setSearched(true);
    } catch (reason: unknown) {
      if (id !== requestId.current) return;
      setFound([]);
      setSearched(true);
      setError(reason instanceof Error ? reason.message : "검색에 실패했습니다.");
    } finally {
      if (id === requestId.current) setBusy(false);
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); void search(keyword, false);
  };

  const field: React.CSSProperties = {
    width: "100%", minWidth: 0, minHeight: 38, border: "1px solid #DCE5E6",
    borderRadius: 8, padding: "0 10px", fontSize: 15, color: "#0A414B",
    background: "#FFFFFF",
  };
  const action: React.CSSProperties = {
    background: "#0A414B", color: "#fff", padding: "0 12px",
    borderRadius: 8, border: 0, cursor: "pointer", fontSize: 15,
    minHeight: 38, whiteSpace: "nowrap",
  };
  return (
    <section aria-label="지도 내 장소 검색" style={{
      position: "absolute", zIndex: 30, top: 12, left: 12,
      width: "min(360px, calc(100% - 24px))", borderRadius: 12,
      padding: 10, background: "#FFFEFA", border: "1px solid #DCE5E6",
      boxShadow: "0 4px 18px rgba(0,0,0,.14)", color: "#0A414B",
    }}>
      <form onSubmit={submit} style={{ display: "flex", gap: 7 }}>
        <input aria-label="지도에서 장소 검색" placeholder="지도에서 장소명 검색" value={keyword}
          onChange={(event) => setKeyword(event.target.value)} style={field} />
        <button type="submit" disabled={busy} style={action}>{busy ? "검색 중" : "검색"}</button>
      </form>
      {locationEnabled && (
        <button type="button" disabled={busy} onClick={() => void search(keyword, true)}
          style={{ ...action, marginTop: 8, width: "100%", background: "#E5F3F0", color: "#0A414B" }}>
          내 주변 {keyword.trim() || "관광지"} 찾기
        </button>
      )}
      {error && <p role="alert" style={{ fontSize: 15, margin: "8px 0 0", color: "#C74444" }}>{error}</p>}
      {searched && found.length === 0 && !error && (
        <p role="status" style={{ fontSize: 15, margin: "8px 0 0" }}>검색 결과가 없습니다.</p>
      )}
      {found.length > 0 && (
        <div role="list" style={{ maxHeight: 230, overflowY: "auto", marginTop: 8, borderTop: "1px solid #DCE5E6" }}>
          {found.map((place, index) => (
            <div role="listitem" key={`${place.lat}-${place.lng}-${index}`}
              style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #EDF2F2" }}>
              <button type="button" onClick={() => onFocus(place.lat, place.lng)}
                style={{ flex: 1, minWidth: 0, textAlign: "left", background: "none", border: 0,
                  cursor: "pointer", padding: 0, color: "#0A414B" }}>
                <strong style={{ display: "block", fontSize: 15, overflow: "hidden", textOverflow: "ellipsis" }}>{place.name}</strong>
                <span style={{ display: "block", fontSize: 15, color: "#778D90" }}>{place.address}</span>
              </button>
              {canAdd && <button type="button" style={{ ...action, minHeight: 34 }} onClick={() => {
                onFocus(place.lat, place.lng); onAddPlace(place);
                setFound([]); setSearched(false);
              }}>+ 추가</button>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
