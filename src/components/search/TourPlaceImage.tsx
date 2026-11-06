import { useEffect, useRef, useState } from "react";
import type { SavedPlace } from "../../data/saved";
import * as S from "./SearchStyle";

export type SearchPlace = SavedPlace & { lat?: number; lng?: number };
type Photo = { image: string | null; source: string | null; sourceUrl?: string | null };
const EMPTY: Photo = { image: null, source: null };
const cache = new Map<string, { value: Photo; expires: number }>();
const inFlight = new Map<string, Promise<Photo>>();

function validImage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch { return null; }
}
function placeKey(place: SearchPlace): string {
  return `${place.name}|${place.address}|${place.lat ?? ""}|${place.lng ?? ""}`;
}
function getPhoto(place: SearchPlace, preferDaum = false): Promise<Photo> {
  const id = `${placeKey(place)}|${preferDaum ? "daum" : "tour-first"}`;
  const saved = cache.get(id);
  if (saved && saved.expires > Date.now()) return Promise.resolve(saved.value);
  const pending = inFlight.get(id);
  if (pending) return pending;
  const params = new URLSearchParams({ name: place.name, address: place.address, v: "photo-balanced-4" });
  if (Number.isFinite(place.lat)) params.set("lat", String(place.lat));
  if (Number.isFinite(place.lng)) params.set("lng", String(place.lng));
  if (preferDaum) params.set("prefer", "daum");
  const task = fetch(`/api/tour/photos?${params.toString()}`)
    .then(async (res): Promise<Photo> => {
      if (!res.ok) return EMPTY;
      const data = (await res.json()) as Partial<Photo>;
      const image = validImage(data.image);
      return image ? {
        image,
        source: typeof data.source === "string" ? data.source : null,
        sourceUrl: typeof data.sourceUrl === "string" ? data.sourceUrl : null,
      } : EMPTY;
    })
    .catch((): Photo => EMPTY)
    .then((value) => {
      if (cache.size >= 350) cache.clear();
      cache.set(id, { value, expires: Date.now() + (value.image ? 6 * 60 * 60 * 1000 : 30 * 1000) });
      return value;
    })
    .finally(() => inFlight.delete(id));
  inFlight.set(id, task);
  return task;
}

/** 관광공사 우선. 사진이 없으면 서버가 다음 API로 폴백합니다. */
export default function TourPlaceImage({ place }: { place: SearchPlace }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const key = placeKey(place);
  const [initial, setInitial] = useState<{ key: string; value: Photo } | null>(null);
  const [secondary, setSecondary] = useState<{ key: string; value: Photo } | null>(null);
  const [failed, setFailed] = useState<{ key: string; url: string } | null>(null);

  useEffect(() => {
    const node = imageRef.current;
    if (!node) return;
    let active = true;
    let observer: IntersectionObserver | undefined;
    const load = () => {
      void getPhoto(place).then((value) => { if (active) setInitial({ key, value }); });
    };
    if (typeof IntersectionObserver === "undefined") load();
    else {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer?.disconnect();
          load();
        }
      }, { rootMargin: "250px 0px" });
      observer.observe(node);
    }
    return () => { active = false; observer?.disconnect(); };
    // This key includes every place attribute used by the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const first = initial?.key === key ? initial.value : EMPTY;
  const second = secondary?.key === key ? secondary.value : null;
  const active = second ?? first;
  const errorUrl = failed?.key === key ? failed.url : null;
  const photoUrl = active.image && active.image !== errorUrl ? active.image : null;

  return (
    <S.PlaceImage
      ref={imageRef}
      src={photoUrl ?? place.image}
      alt={photoUrl ? `${place.name} 관련 사진` : `${place.name} 기본 이미지`}
      title={photoUrl ? `${active.source ?? "외부"} · ${active.source === "다음 이미지 검색" ? "장소 일치 및 사용 권한을 확인해 주세요" : "관광지 사진"}` : undefined}
      loading="lazy"
      onError={() => {
        if (!photoUrl) return;
        setFailed({ key, url: photoUrl });
        if (!second && active.source === "한국관광공사 TourAPI") {
          void getPhoto(place, true).then((value) => setSecondary((previous) =>
            previous?.key === key ? previous : { key, value }));
        }
      }}
    />
  );
}
