import { useEffect, useId, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { MapPin, X } from "lucide-react";

import type { SavedPlace } from "../../../data/saved";
import KakaoRegionPreview from "../../../map/KakaoRegionPreview";
import { KakaoSavedPlaceModalStyle } from "./KakaoSavedPlaceModalStyle";

type Props = {
  place: SavedPlace;
  onClose: () => void;
};

export default function KakaoSavedPlaceModal({ place, onClose }: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const region = useMemo(
    () => ({
      id: place.id,
      name: place.address,
      country: "대한민국",
    }),
    [place.id, place.address],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;

    document.body.style.overflow = "hidden";

    closeRef.current?.focus({
      preventScroll: true,
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], [tabindex="0"]',
        ) ?? [],
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", onKeyDown);

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus({
          preventScroll: true,
        });
      }
    };
  }, [onClose]);

  return createPortal(
    <KakaoSavedPlaceModalStyle
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="saved-map-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {/* 지도 팝업 헤더 */}
        <header className="saved-map-heading">
          <div className="saved-map-title">
            <span className="saved-map-eyebrow">저장한 장소 · 지도 보기</span>

            <h2 id={titleId}>{place.name}</h2>

            <p>
              <MapPin size={18} aria-hidden="true" />
              {place.address}
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="saved-map-close"
            onClick={onClose}
            aria-label="지도 닫기"
          >
            <X size={23} />
          </button>
        </header>

        {/* 실제 카카오 지도 */}
        <div className="saved-map-display">
          <KakaoRegionPreview region={region} />
        </div>

        {/* 지도 팝업 하단 */}
        <footer className="saved-map-footer">
          <p>등록된 주소를 기준으로 위치를 표시합니다.</p>

          <button type="button" onClick={onClose}>
            닫기
          </button>
        </footer>
      </div>
    </KakaoSavedPlaceModalStyle>,
    document.body,
  );
}
