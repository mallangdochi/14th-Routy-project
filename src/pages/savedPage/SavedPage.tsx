import { Bookmark, Map, MapPin, Plus } from "lucide-react";
import Breadcrumb from "../../components/MainSidebar/mainHeader/Breadcrumb";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import MobileHeader from "../../components/mobileBanner/MobileHeader";
import MobileNav from "../../components/mobileBanner/MobileFooter";
import EmptySaved from "../../components/emptyUI/saved/EmptySaved";
import { PageInner, SavedPageStyle } from "./SavedStyle";
import { mockSavedPlaces } from "../../data/saved";
import { useLayoutEffect, useRef, useState } from "react";
import Dropdown from "../../components/dropdown/Dropdown";

type SortOrder = "newest" | "oldest" | "name";

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "최근 저장순" },
  { value: "oldest", label: "오래된 저장순" },
  { value: "name", label: "이름순" },
];

export default function SavedPage() {
  const categories = ["전체", "관광", "음식점", "카페", "숙소"] as const;

  type CategoryFilter = (typeof categories)[number];

  const [savedPlaces, setSavedPlaces] = useState(() => [...mockSavedPlaces]);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("전체");

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
        "--indicator-top",
        `${selectedButton.offsetTop}px`,
      );
      container.style.setProperty(
        "--indicator-width",
        `${selectedButton.offsetWidth}px`,
      );
      container.style.setProperty(
        "--indicator-height",
        `${selectedButton.offsetHeight}px`,
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
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const filteredPlaces = savedPlaces
    .filter(
      (place) =>
        selectedCategory === "전체" || place.category === selectedCategory,
    )
    .sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name, "ko");
      }

      const difference =
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();

      return sortOrder === "newest" ? difference : -difference;
    });

  const handleRemoveSaved = (id: string) => {
    setSavedPlaces((previous) => previous.filter((place) => place.id !== id));
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
        <header className="page-header">
          <div className="trips-breadcrumb" aria-label="현재 위치">
            <Breadcrumb items={[{ label: "저장한 장소", Icon: Bookmark }]} />
          </div>
          <h1>저장한 장소</h1>
        </header>
        <PageInner>
          <section className="saved-places" aria-label="저장한 장소 목록">
            {/* <div
              className="saved-filters"
              role="group"
              aria-label="장소 카테고리"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div> */}
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
                  type="button"
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="saved-toolbar">
              <p className="saved-count" role="status">
                총 <strong>{savedPlaces.length}개</strong>의 장소를 저장했어요.
              </p>
              <Dropdown
                label="장소 정렬"
                value={sortOrder}
                options={sortOptions}
                onChange={setSortOrder}
              />
            </div>

            {savedPlaces.length === 0 ? (
              <div className="saved-empty">
                <EmptySaved />
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="saved-empty">
                <p>저장한 {selectedCategory} 장소가 없어요.</p>
              </div>
            ) : (
              <ul className="saved-list">
                {filteredPlaces.map((place) => (
                  <li key={place.id}>
                    <article
                      className="saved-card"
                      aria-labelledby={`saved-place-${place.id}`}
                    >
                      <div className="saved-image">
                        <img
                          src={place.image}
                          alt={place.name}
                          loading="lazy"
                        />
                      </div>

                      <div className="saved-info">
                        <div className="saved-heading">
                          <h2 id={`saved-place-${place.id}`}>{place.name}</h2>

                          <button
                            type="button"
                            className="saved-bookmark"
                            aria-label={`${place.name} 저장 해제`}
                            aria-pressed={true}
                            onClick={() => handleRemoveSaved(place.id)}
                          >
                            <Bookmark
                              size={24}
                              fill="currentColor"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <span className="saved-category">{place.category}</span>

                        <p className="saved-address">
                          <MapPin size={18} aria-hidden="true" />
                          <span>{place.address}</span>
                        </p>

                        <p className="saved-description">{place.description}</p>

                        <div className="saved-actions">
                          <button
                            type="button"
                            className="saved-map-button"
                            aria-label={`${place.name} 지도 보기`}
                          >
                            <Map size={18} aria-hidden="true" />
                            <span>지도 보기</span>
                          </button>

                          <button
                            type="button"
                            className="saved-add-button"
                            aria-label={`${place.name} 일정에 추가`}
                          >
                            <Plus size={20} aria-hidden="true" />
                            <span>일정에 추가</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </PageInner>
        {/* <PageInner>
          {mockSavedPlaces.length === 0 ? (
            <EmptySaved />
          ) : (
            <section className="saved-places" aria-label="저장한 장소 목록">
              <p className="saved-count">
                총 <strong>{mockSavedPlaces.length}개</strong>의 장소를
                저장했어요.
              </p>

              <ul className="saved-list">
                {mockSavedPlaces.map((place) => (
                  <li key={place.id}>
                    <article
                      className="saved-card"
                      aria-labelledby={`saved-place-${place.id}`}
                    >
                      <div className="saved-image">
                        <img
                          src={place.image}
                          alt={place.name}
                          loading="lazy"
                        />
                      </div>

                      <div className="saved-info">
                        <div className="saved-heading">
                          <h2 id={`saved-place-${place.id}`}>{place.name}</h2>

                          <button
                            type="button"
                            className="saved-bookmark"
                            aria-label={`${place.name} 저장 해제`}
                            aria-pressed={true}
                          >
                            <Bookmark
                              size={24}
                              fill="currentColor"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <span className="saved-category">{place.category}</span>

                        <p className="saved-address">
                          <MapPin size={18} aria-hidden="true" />
                          <span>{place.address}</span>
                        </p>

                        <p className="saved-description">{place.description}</p>

                        <div className="saved-actions">
                          <button
                            type="button"
                            className="saved-map-button"
                            aria-label={`${place.name} 지도 보기`}
                          >
                            <Map size={18} aria-hidden="true" />
                            <span>지도 보기</span>
                          </button>

                          <button
                            type="button"
                            className="saved-add-button"
                            aria-label={`${place.name} 일정에 추가`}
                          >
                            <Plus size={20} aria-hidden="true" />
                            <span>일정에 추가</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </PageInner> */}
      </main>
      <div className="page-mobile-footer">
        <MobileNav />
      </div>
    </SavedPageStyle>
  );
}
