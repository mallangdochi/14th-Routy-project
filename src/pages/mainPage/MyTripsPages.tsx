// import { MyTripsPageStyle } from "./MyTripsPageStyle";
// import MobileHeader from "../../components/mobileBanner/MobileHeader";

// import { useLayoutEffect, useRef, useState } from "react";
// import { Grid2X2, List, Plus, House, CalendarDays } from "lucide-react";

// import { trips, type TripStatus } from "../../data/trips";
// import TripCard from "../../components/main/TripCard";
// import MainSidebar from "../../components/MainSidebar/MainSidebar";
// import EmptyTravel from "../../components/emptyUI/travel/EmptyTravel";
// import MobileNav from "../../components/mobileBanner/MobileFooter";
// import { useNavigate } from "react-router";
// import Breadcrumb from "../../components/MainSidebar/mainHeader/Breadcrumb";
// import Dropdown from "../../components/dropdown/Dropdown";
// import { useAuth } from "../../contexts/AuthContext";
// import Logout from "../../components/emptyUI/logout/Logout";

// type FilterType = "ALL" | TripStatus;
// type ViewType = "grid" | "list";
// type SortType = "recent" | "oldest" | "startDate";

// const filters: { label: string; value: FilterType }[] = [
//   { label: "전체", value: "ALL" },
//   { label: "예정", value: "PLANNING" },
//   { label: "진행", value: "IN_PROGRESS" },
//   { label: "완료", value: "COMPLETED" },
// ];

// const sortOptions: { value: SortType; label: string }[] = [
//   { value: "recent", label: "최근 수정순" },
//   { value: "oldest", label: "오래된 수정순" },
//   { value: "startDate", label: "여행 시작일순" },
// ];

// export default function MyTripsPage() {
//   const { user } = useAuth();
//   const [filter, setFilter] = useState<FilterType>("ALL");
//   const [sort, setSort] = useState<SortType>("recent");
//   const [view, setView] = useState<ViewType>("grid");
//   const navigate = useNavigate();

//   const tabsRef = useRef<HTMLDivElement>(null);

//   useLayoutEffect(() => {
//     const container = tabsRef.current;
//     if (!container) return;

//     const updateIndicator = () => {
//       const selectedButton = container.querySelector<HTMLButtonElement>(
//         'button[aria-pressed="true"]',
//       );

//       if (!selectedButton) return;

//       container.style.setProperty(
//         "--indicator-left",
//         `${selectedButton.offsetLeft}px`,
//       );
//       container.style.setProperty(
//         "--indicator-top",
//         `${selectedButton.offsetTop}px`,
//       );
//       container.style.setProperty(
//         "--indicator-width",
//         `${selectedButton.offsetWidth}px`,
//       );
//       container.style.setProperty(
//         "--indicator-height",
//         `${selectedButton.offsetHeight}px`,
//       );
//     };

//     updateIndicator();

//     const observer = new ResizeObserver(updateIndicator);
//     observer.observe(container);

//     container.querySelectorAll("button").forEach((button) => {
//       observer.observe(button);
//     });

//     return () => observer.disconnect();
//   }, [filter, user]);

//   const previewEmpty = false;

//   const tripData: typeof trips = previewEmpty ? [] : trips;

//   const filteredTrips = tripData
//     .filter((trip) => filter === "ALL" || trip.status === filter)
//     .sort((a, b) => {
//       if (sort === "oldest") {
//         return a.updatedAt.localeCompare(b.updatedAt);
//       }

//       if (sort === "startDate") {
//         return a.startDate.localeCompare(b.startDate);
//       }

//       return b.updatedAt.localeCompare(a.updatedAt);
//     });

//   const getCount = (value: FilterType) => {
//     if (value === "ALL") return tripData.length;

//     return tripData.filter((trip) => trip.status === value).length;
//   };

//   const handleCreateTrip = () => {
//     navigate("/trips/new");
//   };

//   const handleOpenTrip = (id: string) => {
//     console.log("여행 선택:", id);
//     navigate(`/trip-schedule/${id}`);
//   };

//   const handleEditTrip = (id: string) => {
//     console.log("여행 수정:", id);
//   };

//   const handleDeleteTrip = (id: string) => {
//     console.log("여행 삭제:", id);
//   };

//   return (
//     <MyTripsPageStyle>
//       <aside className="page-sidebar">
//         <MainSidebar />
//       </aside>
//       <div className="page-mobile-header">
//         <MobileHeader />
//       </div>
//       <main className="page-content">
//         {!user ? (
//           <Logout />
//         ) : (
//           <div className="trips-page-inner">
//             <div className="trips-breadcrumb" aria-label="현재 위치">
//               <Breadcrumb
//                 items={[{ label: "내 여행", to: "/", Icon: House }]}
//               />
//             </div>

//             <header className="trips-header">
//               <div className="trips-header-top">
//                 <h1>내 여행 일정</h1>

//                 <button
//                   type="button"
//                   className="schedule-button"
//                   aria-label="나의 일정표"
//                   onClick={() => navigate("/schedule")}
//                 >
//                   <span className="schedule-button-label">나의 일정표</span>
//                   <CalendarDays
//                     className="schedule-button-icon"
//                     aria-hidden="true"
//                     size={21}
//                   />
//                 </button>
//               </div>

//               <p>설레는 여행을 계획하고, 특별한 추억을 만들어보세요.</p>
//             </header>
//             <div className="trips-toolbar">
//               <div
//                 ref={tabsRef}
//                 className="trips-tabs"
//                 role="group"
//                 aria-label="여행 상태 필터"
//               >
//                 <span className="trips-tab-indicator" aria-hidden="true" />

//                 {filters.map((item) => (
//                   <button
//                     key={item.value}
//                     type="button"
//                     className={filter === item.value ? "active" : ""}
//                     aria-pressed={filter === item.value}
//                     onClick={() => setFilter(item.value)}
//                   >
//                     {item.label}
//                     <span className="tab-count">{getCount(item.value)}</span>
//                   </button>
//                 ))}
//               </div>
//               <div className="trips-controls">
//                 <Dropdown
//                   label="여행 정렬"
//                   value={sort}
//                   options={sortOptions}
//                   onChange={setSort}
//                 />
//                 <div
//                   className="view-switch"
//                   role="group"
//                   aria-label="보기 방식"
//                 >
//                   <button
//                     type="button"
//                     className={view === "grid" ? "active" : ""}
//                     aria-label="그리드 보기"
//                     aria-pressed={view === "grid"}
//                     onClick={() => setView("grid")}
//                   >
//                     <Grid2X2 aria-hidden="true" />
//                   </button>

//                   <button
//                     type="button"
//                     className={view === "list" ? "active" : ""}
//                     aria-label="리스트 보기"
//                     aria-pressed={view === "list"}
//                     onClick={() => setView("list")}
//                   >
//                     <List aria-hidden="true" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <section
//               className={`trips-content-region ${filter === "ALL" ? "is-all" : ""}`}
//               aria-label="여행 목록"
//             >
//               {filteredTrips.length === 0 ? (
//                 <EmptyTravel />
//               ) : (
//                 <div className={`trips-grid view-${view}`}>
//                   {filteredTrips.map((trip) => (
//                     <TripCard
//                       key={trip.id}
//                       trip={trip}
//                       view={view}
//                       onOpen={handleOpenTrip}
//                       onEdit={handleEditTrip}
//                       onDelete={handleDeleteTrip}
//                     />
//                   ))}

//                   {filter === "ALL" && (
//                     <button
//                       type="button"
//                       className="create-trip-card"
//                       onClick={handleCreateTrip}
//                     >
//                       <span className="create-icon">
//                         <Plus aria-hidden="true" />
//                       </span>

//                       <strong>새 여행 만들기</strong>
//                       <span className="create-description">
//                         새로운 여행을 계획해 보세요.
//                       </span>
//                     </button>
//                   )}
//                 </div>
//               )}
//             </section>
//           </div>
//         )}
//       </main>

//       <div className="page-mobile-footer">
//         <MobileNav />
//       </div>
//     </MyTripsPageStyle>
//   );
// }

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Grid2X2, List, Plus, House, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router";

import { MyTripsPageStyle } from "./MyTripsPageStyle";
import MobileHeader from "../../components/mobileBanner/MobileHeader";
import TripCard from "../../components/main/TripCard";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import EmptyTravel from "../../components/emptyUI/travel/EmptyTravel";
import MobileNav from "../../components/mobileBanner/MobileFooter";
import Breadcrumb from "../../components/MainSidebar/mainHeader/Breadcrumb";
import Dropdown from "../../components/dropdown/Dropdown";
import Logout from "../../components/emptyUI/logout/Logout";

import { useAuth } from "../../contexts/AuthContext";
import { getMyTrips, type SavedTrip } from "../../api/trips";
import type { trips, TripStatus } from "../../data/trips";
import Loader from "../../components/loader/Loader";

type TripCardData = (typeof trips)[number];

type FilterType = "ALL" | TripStatus;
type ViewType = "grid" | "list";
type SortType = "recent" | "oldest" | "startDate";

type TripQueryResult = {
  userId: string;
  attempt: number;
  trips: SavedTrip[];
  error: string;
};

const filters: { label: string; value: FilterType }[] = [
  { label: "전체", value: "ALL" },
  { label: "예정", value: "PLANNING" },
  { label: "진행", value: "IN_PROGRESS" },
  { label: "완료", value: "COMPLETED" },
];

const sortOptions: { value: SortType; label: string }[] = [
  { value: "recent", label: "최근 수정순" },
  { value: "oldest", label: "오래된 수정순" },
  { value: "startDate", label: "여행 시작일순" },
];

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTripStatus(
  startDate: string,
  endDate: string,
  today: string,
): TripStatus {
  if (today < startDate) {
    return "PLANNING";
  }

  if (today > endDate) {
    return "COMPLETED";
  }

  return "IN_PROGRESS";
}

function toTripCardData(trip: SavedTrip, today: string): TripCardData {
  return {
    id: trip.id,
    title: trip.name,
    region: trip.region,
    startDate: trip.startDate,
    endDate: trip.endDate,
    startTime: trip.startTime,
    status: getTripStatus(trip.startDate, trip.endDate, today),

    image: "",
    places: 0,
    schedules: 0,
    items: [],

    updatedAt: trip.updatedAt,
  };
}
export default function MyTripsPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  const [filter, setFilter] = useState<FilterType>("ALL");
  const [sort, setSort] = useState<SortType>("recent");
  const [view, setView] = useState<ViewType>("grid");

  const [attempt, setAttempt] = useState(0);
  const [queryResult, setQueryResult] = useState<TripQueryResult | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);

  // 현재 계정과 현재 요청에 해당하는 결과만 사용합니다.
  const currentResult =
    userId && queryResult?.userId === userId && queryResult.attempt === attempt
      ? queryResult
      : null;

  const isLoading = Boolean(userId) && currentResult === null;
  const loadError = currentResult?.error ?? "";

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    void getMyTrips(controller.signal)
      .then((savedTrips) => {
        if (controller.signal.aborted) return;

        setQueryResult({
          userId,
          attempt,
          trips: savedTrips,
          error: "",
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        setQueryResult({
          userId,
          attempt,
          trips: [],
          error:
            error instanceof Error
              ? error.message
              : "여행 목록을 조회하지 못했습니다.",
        });
      });

    return () => {
      controller.abort();
    };
  }, [userId, attempt]);

  useLayoutEffect(() => {
    const container = tabsRef.current;
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
  }, [filter, userId]);

  const today = getTodayDate();

  const tripData = (currentResult?.trips ?? []).map((trip) =>
    toTripCardData(trip, today),
  );

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

  const handleCreateTrip = () => {
    navigate("/trips/new");
  };

  const handleOpenTrip = (id: string) => {
    navigate(`/trip-schedule/${id}`);
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
        {!user ? (
          <Logout />
        ) : (
          <div className="trips-page-inner">
            <div className="trips-breadcrumb" aria-label="현재 위치">
              <Breadcrumb
                items={[{ label: "내 여행", to: "/", Icon: House }]}
              />
            </div>

            <header className="trips-header">
              <div className="trips-header-top">
                <h1>내 여행 일정</h1>

                <button
                  type="button"
                  className="schedule-button"
                  aria-label="나의 일정표"
                  onClick={() => navigate("/schedule")}
                >
                  <span className="schedule-button-label">나의 일정표</span>

                  <CalendarDays
                    className="schedule-button-icon"
                    aria-hidden="true"
                    size={21}
                  />
                </button>
              </div>

              <p>설레는 여행을 계획하고, 특별한 추억을 만들어보세요.</p>
            </header>

            <div className="trips-toolbar">
              <div
                ref={tabsRef}
                className="trips-tabs"
                role="group"
                aria-label="여행 상태 필터"
              >
                <span className="trips-tab-indicator" aria-hidden="true" />

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
                <Dropdown
                  label="여행 정렬"
                  value={sort}
                  options={sortOptions}
                  onChange={setSort}
                />

                <div
                  className="view-switch"
                  role="group"
                  aria-label="보기 방식"
                >
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
              className={`trips-content-region ${
                filter === "ALL" ? "is-all" : ""
              }`}
              aria-label="여행 목록"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <Loader />
              ) : loadError ? (
                <div className="trips-load-error">
                  <p role="alert">{loadError}</p>

                  <button
                    type="button"
                    onClick={() => setAttempt((previous) => previous + 1)}
                  >
                    다시 불러오기
                  </button>
                </div>
              ) : filteredTrips.length === 0 ? (
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
        )}
      </main>

      <div className="page-mobile-footer">
        <MobileNav />
      </div>
    </MyTripsPageStyle>
  );
}
