import MobileFooter from "../../components/mobileBanner/MobileFooter";

import { MyTripsPageStyle } from "./MyTripsPageStyle";
import MobileHeader from "../../components/mobileBanner/MobileHeader";

import { useEffect, useRef, useState } from "react";
import { Grid2X2, List, Plus, ChevronDown, House } from "lucide-react";

import { trips, type TripStatus } from "../../data/trips";
import TripCard from "../../components/main/TripCard";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import EmptyTravel from "../../components/emptyUI/travel/EmptyTravel";

type FilterType = "ALL" | TripStatus;
type ViewType = "grid" | "list";
type SortType = "recent" | "oldest" | "startDate";

const filters: { label: string; value: FilterType }[] = [
  { label: "전체", value: "ALL" },
  { label: "예정", value: "PLANNING" },
  { label: "진행", value: "IN_PROGRESS" },
  { label: "지난 여행", value: "COMPLETED" },
];

const sortOptions: { value: SortType; label: string }[] = [
  { value: "recent", label: "최근 수정순" },
  { value: "oldest", label: "오래된 수정순" },
  { value: "startDate", label: "여행 시작일순" },
];

export default function MyTripsPage() {
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [sort, setSort] = useState<SortType>("recent");
  const [view, setView] = useState<ViewType>("grid");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortFocusIndex, setSortFocusIndex] = useState(0);

  const sortWrapperRef = useRef<HTMLDivElement>(null);
  const sortTriggerRef = useRef<HTMLButtonElement>(null);
  const sortOptionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedSortIndex = sortOptions.findIndex(
    (option) => option.value === sort,
  );

  useEffect(() => {
    if (!isSortOpen) return;

    sortOptionRefs.current[sortFocusIndex]?.focus();
  }, [isSortOpen, sortFocusIndex]);

  useEffect(() => {
    if (!isSortOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (!sortWrapperRef.current?.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isSortOpen]);

  const openSortMenu = () => {
    setSortFocusIndex(Math.max(0, selectedSortIndex));
    setIsSortOpen(true);
  };

  const previewEmpty = false;

  const tripData: typeof trips = previewEmpty ? [] : trips;

  const filteredTrips = tripData
    .filter((trip) => filter === "ALL" || trip.status === filter)
    .sort((a, b) => {
      if (sort === "oldest") {
        return a.updatedAt.localeCompare(b.updatedAt);
      }

      if (sort === "startDate") {
        return a.startDate.localeCompare(b.startDate);
      }

      return b.updatedAt.localeCompare(a.updatedAt);
    });

  const getCount = (value: FilterType) => {
    if (value === "ALL") return tripData.length;

    return tripData.filter((trip) => trip.status === value).length;
  };

  const handleCreateTrip = () => {};

  const handleOpenTrip = (id: string) => {
    console.log("여행 선택:", id);
  };

  const handleEditTrip = (id: string) => {
    console.log("여행 수정:", id);
  };

  const handleDeleteTrip = (id: string) => {
    console.log("여행 삭제:", id);
  };

  return (
    <MyTripsPageStyle>
      <aside className="page-sidebar">
        <MainSidebar />
      </aside>
      <div className="page-mobile-header">
        <MobileHeader />
      </div>
      <main className="page-content">
        <div className="trips-page-inner">
          <nav className="trips-breadcrumb" aria-label="현재 위치">
            <House size={18} aria-hidden="true" />
            <span aria-current="page">내 여행</span>
          </nav>

          <header className="trips-header">
            <div className="trips-header-top">
              <h1>내 여행 일정</h1>

              <button type="button" className="schedule-button">
                나의 일정표
              </button>
            </div>

            <p>설레는 여행을 계획하고, 특별한 추억을 만들어보세요.</p>
          </header>
          <div className="trips-toolbar">
            <div
              className="trips-tabs"
              role="group"
              aria-label="여행 상태 필터"
            >
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={filter === item.value ? "active" : ""}
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                  <span className="tab-count">{getCount(item.value)}</span>
                </button>
              ))}
            </div>

            <div className="trips-controls">
              <div
                ref={sortWrapperRef}
                className="sort-wrapper"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsSortOpen(false);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape" && isSortOpen) {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsSortOpen(false);
                    sortTriggerRef.current?.focus();
                    return;
                  }

                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();

                    if (!isSortOpen) {
                      openSortMenu();
                      return;
                    }

                    const direction = event.key === "ArrowDown" ? 1 : -1;

                    setSortFocusIndex(
                      (index) =>
                        (index + direction + sortOptions.length) %
                        sortOptions.length,
                    );
                  }

                  if (
                    isSortOpen &&
                    (event.key === "Home" || event.key === "End")
                  ) {
                    event.preventDefault();
                    setSortFocusIndex(
                      event.key === "Home" ? 0 : sortOptions.length - 1,
                    );
                  }
                }}
              >
                <button
                  ref={sortTriggerRef}
                  type="button"
                  className="sort-trigger"
                  aria-label={`여행 정렬: ${sortOptions[selectedSortIndex]?.label}`}
                  aria-haspopup="menu"
                  aria-expanded={isSortOpen}
                  onClick={() => {
                    if (isSortOpen) {
                      setIsSortOpen(false);
                    } else {
                      openSortMenu();
                    }
                  }}
                >
                  {sortOptions[selectedSortIndex]?.label}
                  <ChevronDown
                    aria-hidden="true"
                    className={isSortOpen ? "is-open" : ""}
                  />
                </button>

                <div
                  className="sort-dropdown"
                  role="menu"
                  data-open={isSortOpen}
                  aria-hidden={!isSortOpen}
                  aria-label="여행 정렬"
                >
                  {sortOptions.map((option, index) => (
                    <button
                      key={option.value}
                      ref={(element) => {
                        sortOptionRefs.current[index] = element;
                      }}
                      type="button"
                      role="menuitemradio"
                      aria-checked={sort === option.value}
                      tabIndex={isSortOpen && sortFocusIndex === index ? 0 : -1}
                      className={sort === option.value ? "is-selected" : ""}
                      onFocus={() => setSortFocusIndex(index)}
                      onClick={() => {
                        setSort(option.value);
                        setIsSortOpen(false);
                        sortTriggerRef.current?.focus();
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="view-switch" role="group" aria-label="보기 방식">
                <button
                  type="button"
                  className={view === "grid" ? "active" : ""}
                  aria-label="그리드 보기"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                >
                  <Grid2X2 aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className={view === "list" ? "active" : ""}
                  aria-label="리스트 보기"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                >
                  <List aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <section
            className={`trips-content-region ${filter === "ALL" ? "is-all" : ""}`}
            aria-label="여행 목록"
          >
            {filteredTrips.length === 0 ? (
              <EmptyTravel />
            ) : (
              <div className={`trips-grid view-${view}`}>
                {filteredTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    view={view}
                    onOpen={handleOpenTrip}
                    onEdit={handleEditTrip}
                    onDelete={handleDeleteTrip}
                  />
                ))}

                {filter === "ALL" && (
                  <button
                    type="button"
                    className="create-trip-card"
                    onClick={handleCreateTrip}
                  >
                    <span className="create-icon">
                      <Plus aria-hidden="true" />
                    </span>

                    <strong>새 여행 만들기</strong>
                    <span className="create-description">
                      새로운 여행을 계획해 보세요.
                    </span>
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <div className="page-mobile-footer">
        <MobileFooter />
      </div>
    </MyTripsPageStyle>
  );
}
