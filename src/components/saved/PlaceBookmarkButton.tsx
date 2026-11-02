import { useId, useState } from "react";
import { Bookmark } from "lucide-react";

import { useSavedPlaces } from "../../contexts/SavedPlacesContext";
import * as S from "./bookmarkStyle";

type PlaceCategory =
  | "attraction"
  | "restaurant"
  | "cafe"
  | "accommodation"
  | "other";

type SavePlaceInput = {
  provider: string;
  placeId: string;
  name: string;
  category: PlaceCategory;
  address: string;
  description?: string;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type PlaceBookmarkButtonProps = {
  place: SavePlaceInput;
  className?: string;
  onError?: (message: string) => void;
};

export default function PlaceBookmarkButton({
  place,
  className,
  onError,
}: PlaceBookmarkButtonProps) {
  const { isSaved, isPending, isLoading, loadError, toggleSaved } =
    useSavedPlaces();

  const errorId = useId();

  const [failure, setFailure] = useState<{
    placeKey: string;
    message: string;
  } | null>(null);

  const placeKey = JSON.stringify([place.provider, place.placeId]);

  const error = failure?.placeKey === placeKey ? failure.message : null;

  const saved = isSaved(place);
  const pending = isPending(place);

  const disabled = isLoading || pending || Boolean(loadError);

  const label = pending
    ? saved
      ? `${place.name} 저장 해제 중`
      : `${place.name} 저장 중`
    : saved
      ? `${place.name} 저장 해제`
      : `${place.name} 저장`;

  const title = isLoading
    ? "저장 목록을 불러오고 있어요."
    : loadError
      ? "저장 목록을 다시 불러온 후 이용해 주세요."
      : label;

  async function handleBookmarkClick(): Promise<void> {
    if (disabled) return;

    setFailure(null);

    try {
      await toggleSaved(place);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "저장 상태를 변경하지 못했어요.";

      if (onError) {
        onError(message);
      } else {
        setFailure({
          placeKey,
          message,
        });
      }
    }
  }

  return (
    <>
      <S.BookmarkButton
        type="button"
        className={className}
        aria-label={label}
        aria-pressed={saved}
        aria-busy={pending}
        aria-describedby={error ? errorId : undefined}
        data-saved={saved}
        disabled={disabled}
        title={title}
        onClick={(event) => {
          event.stopPropagation();
          void handleBookmarkClick();
        }}
      >
        <Bookmark
          aria-hidden="true"
          size={24}
          strokeWidth={1.8}
          fill={saved ? "currentColor" : "none"}
        />
      </S.BookmarkButton>

      {error && (
        <S.ErrorMessage id={errorId} role="alert">
          {error}
        </S.ErrorMessage>
      )}
    </>
  );
}
