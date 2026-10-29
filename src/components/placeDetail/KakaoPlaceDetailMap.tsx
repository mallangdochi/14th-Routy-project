import { useEffect, useRef, useState } from "react";
import { loadKakaoMaps } from "../../api/kakao/kakaoSdk";

type Props = { name: string; lat: number; lng: number };
type Marker = { setMap(map: unknown | null): void };

export default function KakaoPlaceDetailMap({ name, lat, lng }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!nodeRef.current || !Number.isFinite(lat) || !Number.isFinite(lng))
      return;
    let active = true;
    let marker: Marker | undefined;
    let observer: ResizeObserver | undefined;
    setError("");
    void loadKakaoMaps()
      .then((sdk) => {
        if (!active || !nodeRef.current) return;
        const coords = new sdk.LatLng(lat, lng);
        const map = new sdk.Map(nodeRef.current, { center: coords, level: 4 });
        const markerSDK = sdk as typeof sdk & {
          Marker: new (options: {
            position: typeof coords;
            map: typeof map;
            title: string;
          }) => Marker;
        };
        marker = new markerSDK.Marker({ map, position: coords, title: name });
        observer = new ResizeObserver(() => map.relayout());
        observer.observe(nodeRef.current);
      })
      .catch((reason: unknown) => {
        if (active)
          setError(
            reason instanceof Error
              ? reason.message
              : "지도를 불러올 수 없습니다.",
          );
      });
    return () => {
      active = false;
      marker?.setMap(null);
      observer?.disconnect();
    };
  }, [name, lat, lng]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: 300,
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        ref={nodeRef}
        role="img"
        aria-label={`${name} 위치 지도`}
        style={{ height: 300, width: "100%" }}
      />
      {error && (
        <p role="alert" style={{ padding: 16, fontSize: 16 }}>
          {error}
        </p>
      )}
    </div>
  );
}
