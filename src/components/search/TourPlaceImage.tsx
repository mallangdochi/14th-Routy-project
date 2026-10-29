import { useEffect, useRef, useState } from "react";
import type { SavedPlace } from "../../data/saved";
import * as S from "./SearchStyle";

export type SearchPlace = SavedPlace & { lat?: number; lng?: number };

type PhotoResponse = { image: string | null; source: string | null };
const photoCache = new Map<string, string | null>();
const inFlight = new Map<string, Promise<string | null>>();

function getPhoto(place: SearchPlace): Promise<string | null> {
  const id = `${place.name}|${place.address}|${place.lat ?? ""}|${place.lng ?? ""}`;
  if (photoCache.has(id)) return Promise.resolve(photoCache.get(id) ?? null);
  if (inFlight.has(id)) return inFlight.get(id)!;
  const params = new URLSearchParams({
    name: place.name,
    address: place.address,
  });
  if (Number.isFinite(place.lat)) params.set("lat", String(place.lat));
  if (Number.isFinite(place.lng)) params.set("lng", String(place.lng));
  const promise = fetch(`/api/tour/photos?${params.toString()}`)
    .then(async (res) => {
      if (!res.ok) return null;
      const data = (await res.json()) as PhotoResponse;
      if (typeof data.image !== "string") return null;
      const url = new URL(data.image);
      return url.protocol === "https:" ? data.image : null;
    })
    .catch(() => null)
    .then((photo) => {
      photoCache.set(id, photo);
      return photo;
    })
    .finally(() => {
      inFlight.delete(id);
    });
  inFlight.set(id, promise);
  return promise;
}

/** 보이는 카드만 TourAPI 조회하여 하루 호출량을 절약합니다. */
export default function TourPlaceImage({ place }: { place: SearchPlace }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    // 관광공사에서 제공하는 장소 사진에 한해 검색합니다. 일반 카페는 대부분 사진이 없습니다.
    if (place.category === "카페") return;
    const node = imageRef.current;
    if (!node) return;
    let active = true;
    let observer: IntersectionObserver | undefined;
    const load = () => {
      void getPhoto(place).then((result) => {
        if (active) setPhoto(result);
      });
    };
    if (typeof IntersectionObserver === "undefined") load();
    else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            load();
          }
        },
        { rootMargin: "250px 0px" },
      );
      observer.observe(node);
    }
    return () => {
      active = false;
      observer?.disconnect();
    };
  }, [place]);

  const displayed = photo && !broken ? photo : place.image;
  return (
    <S.PlaceImage
      ref={imageRef}
      src={displayed}
      alt={
        photo && !broken
          ? `${place.name} 사진 (한국관광공사 제공)`
          : `${place.name} 기본 안내 이미지`
      }
      title={photo && !broken ? "사진 출처: 한국관광공사 TourAPI" : undefined}
      loading="lazy"
      onError={() => {
        if (photo && !broken) setBroken(true);
      }}
    />
  );
}
