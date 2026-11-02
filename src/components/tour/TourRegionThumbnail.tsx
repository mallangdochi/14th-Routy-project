import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import type { TravelRegion } from "../../data/regions";

type RegionPhoto = {
  image: string | null;
  title: string | null;
  source: string | null;
};
const EMPTY: RegionPhoto = { image: null, title: null, source: null };
const cache = new Map<string, { photo: RegionPhoto; expires: number }>();
const pending = new Map<string, Promise<RegionPhoto>>();

function safeImageUrl(input: unknown): string | null {
  if (typeof input !== "string") return null;
  try {
    const url = new URL(input);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function regionKey(region: TravelRegion) {
  return `${region.name}|${region.latitude ?? ""}|${region.longitude ?? ""}`;
}

function fetchRegionPhoto(region: TravelRegion): Promise<RegionPhoto> {
  const key = regionKey(region);
  const saved = cache.get(key);
  if (saved && Date.now() < saved.expires) return Promise.resolve(saved.photo);
  const existing = pending.get(key);
  if (existing) return existing;

  const query = new URLSearchParams({ name: region.name });
  if (Number.isFinite(region.latitude))
    query.set("lat", String(region.latitude));
  if (Number.isFinite(region.longitude))
    query.set("lng", String(region.longitude));

  const task = fetch(`/api/tour/region-photo?${query.toString()}`)
    .then(async (response) => {
      if (!response.ok) return EMPTY;
      const result = (await response.json()) as Partial<RegionPhoto>;
      const image = safeImageUrl(result.image);
      return image
        ? {
            image,
            title: typeof result.title === "string" ? result.title : null,
            source: "한국관광공사 TourAPI",
          }
        : EMPTY;
    })
    .catch((): RegionPhoto => EMPTY)
    .then((photo) => {
      if (cache.size > 150) cache.clear();
      cache.set(key, {
        photo,
        expires:
          Date.now() + (photo.image ? 6 * 60 * 60 * 1000 : 5 * 60 * 1000),
      });
      return photo;
    })
    .finally(() => pending.delete(key));

  pending.set(key, task);
  return task;
}

/**
 * A thumbnail of a registered attraction IN the selected region.
 * TourAPI doesn't supply an official photo of every administrative region.
 */
export default function TourRegionThumbnail({
  region,
  size = 48,
}: {
  region: TravelRegion | null;
  size?: number;
}) {
  const [result, setResult] = useState<{
    key: string;
    photo: RegionPhoto;
  } | null>(null);
  const [brokenKey, setBrokenKey] = useState<string | null>(null);
  const key = region ? regionKey(region) : "";
  const name = region?.name;
  const latitude = region?.latitude;
  const longitude = region?.longitude;

  useEffect(() => {
    if (!region) return;
    let active = true;
    void fetchRegionPhoto(region).then((photo) => {
      if (active) setResult({ key, photo });
    });
    return () => {
      active = false;
    };
    // The key captures the selected location and its coordinates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, name, latitude, longitude]);

  const photo = result?.key === key && brokenKey !== key ? result.photo : EMPTY;
  const title = photo.title ?? name ?? "여행 지역";

  return (
    <span
      className="routy-region-thumbnail"
      title={
        photo.image
          ? `${title} 관광 사진 · 한국관광공사 TourAPI`
          : "등록된 관광 사진이 없어 기본 아이콘으로 표시합니다."
      }
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        width: size,
        height: size,
        borderRadius: 9,
        backgroundColor: "#E8F1EF",
        overflow: "hidden",
      }}
    >
      {photo.image ? (
        <img
          src={photo.image}
          alt={`${title} 관광 사진 (한국관광공사)`}
          loading="lazy"
          onError={() => setBrokenKey(key)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <MapPin
          aria-hidden="true"
          size={Math.min(24, size / 2)}
          color="#0A414B"
        />
      )}
    </span>
  );
}
