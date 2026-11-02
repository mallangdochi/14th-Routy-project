import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import * as C from "./SavedStyle";
import { Bookmark, Map, MapPin, Plus } from "lucide-react";

import Breadcrumb from "../../components/MainSidebar/mainHeader/Breadcrumb";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import MobileHeader from "../../components/mobileBanner/MobileHeader";
import MobileNav from "../../components/mobileBanner/MobileFooter";
import EmptySaved from "../../components/emptyUI/saved/EmptySaved";
import Dropdown from "../../components/dropdown/Dropdown";
import AddPlaceModal from "../../components/modal/addPlace/AddPlaceModal";
import type { AddPlaceTarget } from "../../components/modal/addPlace/AddPlaceModal";
import KakaoSavedPlaceModal from "../../components/modal/saved-place/KakaoSavedPlaceModal";

import { useSavedPlaces } from "../../contexts/SavedPlacesContext";

// 기존 모달에 전달할 데이터 구조만 사용.
// mockSavedPlaces는 가져오지 않음.
import type { SavedPlace } from "../../data/saved";

import SearchMascot from "../../assets/SearchMascot.webp";
import { PageInner, SavedPageStyle } from "./SavedStyle";

type SortOrder = "newest" | "oldest" | "name";

type ApiCategory =
  | "attraction"
  | "restaurant"
  | "cafe"
  | "accommodation"
  | "other";

type ServerSavedPlace = {
  provider: string;
  placeId: string;
  name: string;
  category: ApiCategory;
  address: string;
  description?: string;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
};

const categories = ["전체", "관광", "음식점", "카페", "숙소"] as const;

type CategoryFilter = (typeof categories)[number];

const categoryLabels: Record<ApiCategory, string> = {
  attraction: "관광",
  restaurant: "음식점",
  cafe: "카페",
  accommodation: "숙소",
  other: "기타",
};

const categoryFilters: Record<Exclude<CategoryFilter, "전체">, ApiCategory> = {
  관광: "attraction",
  음식점: "restaurant",
  카페: "cafe",
  숙소: "accommodation",
};

const sortOptions: {
  value: SortOrder;
  label: string;
}[] = [
  { value: "newest", label: "최근 저장순" },
  { value: "oldest", label: "오래된 저장순" },
  { value: "name", label: "이름순" },
];

function getPlaceKey(place: ServerSavedPlace): string {
  return JSON.stringify([place.provider, place.placeId]);
}

function getPagePlaceId(place: ServerSavedPlace): string {
  return [
    "saved",
    encodeURIComponent(place.provider),
    encodeURIComponent(place.placeId),
  ].join("-");
}

/**
 * 서버 데이터를 기존 지도·일정 추가 모달 형식으로 변환.
 * 현재 검색 화면에서 저장하는 카카오 장소는 네 카테고리를 사용함.
 */
function toModalPlace(place: ServerSavedPlace): SavedPlace | null {
  let category: SavedPlace["category"];

  switch (place.category) {
    case "attraction":
      category = "관광";
      break;

    case "restaurant":
      category = "음식점";
      break;

    case "cafe":
      category = "카페";
      break;

    case "accommodation":
      category = "숙소";
      break;

    default:
      // 기존 모달 타입에 없는 카테고리는 임의로 변경하지 않음.
      return null;
  }

  return {
    id:
      place.provider === "kakao"
        ? `kakao-${place.placeId}`
        : `${place.provider}-${place.placeId}`,

    name: place.name,
    category,
    address: place.address,
    description: place.description ?? "",
    image: place.imageUrl || SearchMascot,
    savedAt: place.createdAt,

    ...(typeof place.latitude === "number" && Number.isFinite(place.latitude)
      ? { lat: place.latitude }
      : {}),

    ...(typeof place.longitude === "number" && Number.isFinite(place.longitude)
      ? { lng: place.longitude }
      : {}),
  };
}

function detailUrl(place: ServerSavedPlace): string {
  const query = new URLSearchParams({
    id: `${place.provider}-${place.placeId}`,
    name: place.name,
    address: place.address,
    category: categoryLabels[place.category],
  });
  if (typeof place.latitude === "number" && Number.isFinite(place.latitude)) {
    query.set("lat", String(place.latitude));
  }
  if (typeof place.longitude === "number" && Number.isFinite(place.longitude)) {
    query.set("lng", String(place.longitude));
  }
  return `/place/detail?${query.toString()}`;
}

function detailState(place: ServerSavedPlace) {
  return { place: toModalPlace(place) ?? {
    id: `${place.provider}-${place.placeId}`,
    name: place.name,
    category: categoryLabels[place.category],
    address: place.address,
    description: place.description ?? "",
    image: place.imageUrl || SearchMascot,
    savedAt: place.createdAt,
    lat: place.latitude ?? undefined,
    lng: place.longitude ?? undefined,
  } };
}

export default function SavedPage() {
  const navigate = useNavigate();
  const { savedPlaces, isLoading, loadError, isPending, toggleSaved, reload } =
    useSavedPlaces();

  const [targetPlace, setTargetPlace] = useState<AddPlaceTarget | null>(null);

  const [mapPlace, setMapPlace] = useState<SavedPlace | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("전체");

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const [actionError, setActionError] = useState<string | null>(null);

  const filtersRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = filtersRef.current;
    if (!container) return;

    const updateIndicator = () => {
      const selectedButton = container.querySelector<HTMLButtonElement>(
        'button[aria-pressed="true"]',
      );

      if (!selectedButton) return;

      container.style.setProperty(
        "--indicator-left",
        `${selectedButton.offsetLeft}px`,
      );

      container.style.setProperty(
        "--indicator-width",
        `${selectedButton.offsetWidth}px`,
      );
    };

    updateIndicator();

    const observer = new ResizeObserver(updateIndicator);
    observer.observe(container);

    container.querySelectorAll("button").forEach((button) => {
      observer.observe(button);
    });

    return () => observer.disconnect();
  }, [selectedCategory]);

  const filteredPlaces = useMemo(() => {
    return savedPlaces
      .filter(
        (place) =>
          selectedCategory === "전체" ||
          place.category === categoryFilters[selectedCategory],
      )
      .sort((a, b) => {
        if (sortOrder === "name") {
          return a.name.localeCompare(b.name, "ko");
        }

        const difference =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        return sortOrder === "newest" ? difference : -difference;
      });
  }, [savedPlaces, selectedCategory, sortOrder]);

  const handleRemoveSaved = async (place: ServerSavedPlace): Promise<void> => {
    if (isLoading || loadError || isPending(place)) return;

    setActionError(null);

    try {
      // 현재 저장 목록의 장소이므로 toggleSaved는 삭제를 실행.
      await toggleSaved(place);
    } catch (error: unknown) {
      setActionError(
        error instanceof Error
          ? error.message
          : "장소 저장을 해제하지 못했어요.",
      );
    }
  };

  const handleOpenMap = (place: ServerSavedPlace) => {
    const modalPlace = toModalPlace(place);

    if (!modalPlace) {
      setActionError("이 카테고리의 지도 연결은 아직 지원하지 않아요.");
      return;
    }

    setActionError(null);
    setMapPlace(modalPlace);
  };

  const handleOpenAddPlace = (place: ServerSavedPlace) => {
    const modalPlace = toModalPlace(place);

    if (!modalPlace) {
      setActionError("이 카테고리의 일정 추가는 아직 지원하지 않아요.");
      return;
    }

    setActionError(null);
    setTargetPlace(modalPlace);
  };

  return (
    <SavedPageStyle>
      <aside className="page-sidebar">
        <MainSidebar />
      </aside>

      <div className="page-mobile-header">
        <MobileHeader />
      </div>

      <main className="page-content">
        <PageInner>
          <header className="page-header">
            <div className="trips-breadcrumb" aria-label="현재 위치">
              <Breadcrumb
                items={[
                  {
                    label: "저장한 장소",
                    Icon: Bookmark,
                  },
                ]}
              />
            </div>

            <h1>저장한 장소</h1>
          </header>

          <section
            className="saved-places"
            aria-label="저장한 장소 목록"
            aria-busy={isLoading}
          >
            <div
              ref={filtersRef}
              className="saved-filters"
              role="group"
              aria-label="장소 카테고리"
            >
              <span className="saved-filter-indicator" aria-hidden="true" />

              {categories.map((category) => (
                <button
                  key={category}
                  data-label={category}
                  type="button"
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span>{category}</span>
                </button>
              ))}
            </div>

            <div className="saved-toolbar">
              <p className="saved-count" role="status">
                {isLoading ? (
                  "저장한 장소를 불러오고 있어요."
                ) : loadError ? (
                  "저장 목록을 확인해 주세요."
                ) : (
                  <>
                    총 <strong>{savedPlaces.length}개</strong>의 장소를
                    저장했어요.
                  </>
                )}
              </p>

              <Dropdown
                label="장소 정렬"
                value={sortOrder}
                options={sortOptions}
                onChange={setSortOrder}
              />
            </div>

            {actionError && <p role="alert">{actionError}</p>}

            {isLoading ? (
              <div className="saved-empty" role="status">
                <p>저장한 장소를 불러오고 있어요.</p>
              </div>
            ) : loadError ? (
              <div className="saved-empty" role="alert">
                <p>{loadError}</p>

                <button
                  type="button"
                  className="saved-map-button"
                  onClick={() => void reload()}
                >
                  다시 불러오기
                </button>
              </div>
            ) : savedPlaces.length === 0 ? (
              <div className="saved-empty">
                <EmptySaved />
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="saved-empty">
                <p>저장한 {selectedCategory} 장소가 없어요.</p>
              </div>
            ) : (
              <ul className="saved-list">
                {filteredPlaces.map((place) => {
                  const pending = isPending(place);
                  const pagePlaceId = getPagePlaceId(place);

                  return (
                    <li key={getPlaceKey(place)}>
                      <C.PlaceCard
                        aria-labelledby={pagePlaceId}
                        style={{ cursor: "pointer" }}
                        onClick={(event) => {
                          if (!(event.target as HTMLElement).closest("button,a")) {
                            navigate(detailUrl(place), { state: detailState(place) });
                          }
                        }}
                      >
                        <C.PlaceImage
                          src={place.imageUrl || SearchMascot}
                          alt={place.name}
                          loading="lazy"
                          onError={(event) => {
                            if (event.currentTarget.getAttribute("src") !== SearchMascot) {
                              event.currentTarget.src = SearchMascot;
                            }
                          }}
                        />
                        <C.PlaceContent>
                          <C.PlaceHeading>
                            <C.PlaceName id={pagePlaceId}>
                              <Link to={detailUrl(place)} state={detailState(place)}>
                                {place.name}
                              </Link>
                            </C.PlaceName>
                            <C.CategoryTag>{categoryLabels[place.category]}</C.CategoryTag>
                          </C.PlaceHeading>
                          <C.PlaceAddress>
                            <MapPin size={14} color="#6478A5" aria-hidden="true" />
                            {place.address}
                          </C.PlaceAddress>
                          <C.PlaceDescription>{place.description}</C.PlaceDescription>
                        </C.PlaceContent>
                        <C.FavoriteButton
                          type="button"
                          $active={true}
                          aria-label={pending ? `${place.name} 저장 해제 중` : `${place.name} 저장 해제`}
                          aria-pressed={true}
                          aria-busy={pending}
                          disabled={pending}
                          onClick={() => void handleRemoveSaved(place)}
                        >
                          <Bookmark size={24} fill="currentColor" aria-hidden="true" />
                        </C.FavoriteButton>
                        <C.CardActions>
                          <C.MapButton
                            type="button"
                            aria-label={`${place.name} 지도 보기`}
                            onClick={() => handleOpenMap(place)}
                          >
                            <Map size={17} aria-hidden="true" />지도 보기
                          </C.MapButton>
                          <C.AddButton
                            type="button"
                            $added={false}
                            aria-label={`${place.name} 일정에 추가`}
                            onClick={() => handleOpenAddPlace(place)}
                          >
                            <Plus size={17} aria-hidden="true" />일정에 추가
                          </C.AddButton>
                        </C.CardActions>
                      </C.PlaceCard>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </PageInner>
      </main>

      <div className="page-mobile-footer">
        <MobileNav />
      </div>

      {mapPlace && (
        <KakaoSavedPlaceModal
          place={mapPlace}
          onClose={() => setMapPlace(null)}
        />
      )}

      {targetPlace && (
        <AddPlaceModal
          open
          place={targetPlace}
          onClose={() => setTargetPlace(null)}
          onAdd={({ place, trip, day }) => {
            console.log("일정 추가", {
              placeId: place.id,
              tripId: trip.id,
              dayId: day.id,
              date: day.date,
            });
          }}
        />
      )}
    </SavedPageStyle>
  );
}
