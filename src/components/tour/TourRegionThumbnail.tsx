import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import type { TravelRegion } from "../../data/regions";

type RegionPhoto = {
  image: string | null;
  title: string | null;
  source: string | null;
  sourceUrl?: string | null;
};
const EMPTY: RegionPhoto = { image: null, title: null, source: null };
const cache = new Map<string, { data: RegionPhoto; expires: number }>();
const inflight = new Map<string, Promise<RegionPhoto>>();
function urlOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try { return new URL(value).protocol === "https:" ? value : null; }
  catch { return null; }
}
function regionKey(region: TravelRegion) {
  return `${region.name}|${region.latitude ?? ""}|${region.longitude ?? ""}`;
}
function getRegionPhoto(region: TravelRegion, preferDaum = false): Promise<RegionPhoto> {
  const key = `${regionKey(region)}|${preferDaum ? "daum" : "tour-first"}`;
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return Promise.resolve(cached.data);
  const pending = inflight.get(key);
  if (pending) return pending;
  const params = new URLSearchParams({ name: region.name, v: "photo-balanced-4" });
  if (Number.isFinite(region.latitude)) params.set("lat", String(region.latitude));
  if (Number.isFinite(region.longitude)) params.set("lng", String(region.longitude));
  if (preferDaum) params.set("prefer", "daum");
  const task = fetch(`/api/tour/region-photo?${params}`)
    .then(async (response): Promise<RegionPhoto> => {
      if (!response.ok) return EMPTY;
      const body = (await response.json()) as Partial<RegionPhoto>;
      const image = urlOrNull(body.image);
      return image ? {
        image,
        title: typeof body.title === "string" ? body.title : null,
        source: typeof body.source === "string" ? body.source : null,
        sourceUrl: typeof body.sourceUrl === "string" ? body.sourceUrl : null,
      } : EMPTY;
    })
    .catch((): RegionPhoto => EMPTY)
    .then((data) => {
      if (cache.size >= 150) cache.clear();
      cache.set(key, { data, expires: Date.now() + (data.image ? 6 * 60 * 60 * 1000 : 30 * 1000) });
      return data;
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, task);
  return task;
}

/** 사진 공급자는 source 필드로 구별합니다. 기본 사진이 깨지면 다음으로 재조회합니다. */
export default function TourRegionThumbnail({
  region,
  size = 48,
}: {
  region: TravelRegion | null;
  size?: number;
}) {
  const key = region ? regionKey(region) : "";
  const [first, setFirst] = useState<{ key: string; photo: RegionPhoto } | null>(null);
  const [second, setSecond] = useState<{ key: string; photo: RegionPhoto } | null>(null);
  const [broken, setBroken] = useState<{ key: string; url: string } | null>(null);
  const name = region?.name;
  const latitude = region?.latitude;
  const longitude = region?.longitude;

  useEffect(() => {
    if (!region) return;
    let active = true;
    void getRegionPhoto(region).then((photo) => { if (active) setFirst({ key, photo }); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, name, latitude, longitude]);

  const secondPhoto = second?.key === key ? second.photo : null;
  const photo = secondPhoto ?? (first?.key === key ? first.photo : EMPTY);
  const image = photo.image && !(broken?.key === key && broken.url === photo.image) ? photo.image : null;
  const title = photo.title ?? name ?? "여행 지역";
  return (
    <span
      className="routy-region-thumbnail"
      title={image ? `${title} · ${photo.source ?? "외부 이미지"}${photo.source === "다음 이미지 검색" ? " (실제 장소와 다를 수 있음)" : ""}` : "해당 지역 사진이 없어 기본 아이콘을 표시합니다."}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", width: size, height: size, borderRadius: 9, backgroundColor: "#E8F1EF", overflow: "hidden" }}
    >
      {image ? (
        <img
          src={image}
          alt={`${title} 관련 사진`}
          loading="lazy"
          onError={() => {
            setBroken({ key, url: image });
            if (region && !secondPhoto && photo.source === "한국관광공사 TourAPI") {
              void getRegionPhoto(region, true).then((value) => setSecond((old) => old?.key === key ? old : { key, photo: value }));
            }
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : <MapPin aria-hidden="true" size={Math.min(24, size / 2)} color="#0A414B" />}
    </span>
  );
}
