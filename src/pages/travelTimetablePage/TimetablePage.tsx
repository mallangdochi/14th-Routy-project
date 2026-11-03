import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowRightLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  House,
  Share2,
  Search,
  Check,
  List,
  MapPin,
  Plus,
} from "lucide-react";

import TimetableShareModal from "../../components/modal/TimetableShareModal/TimeTableShareModal";

import Breadcrumb from "../../components/MainSidebar/mainHeader/Breadcrumb";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import MobileHeader from "../../components/mobileBanner/MobileHeader";
import MobileNav from "../../components/mobileBanner/MobileFooter";
import type { TripDay } from "../../data/tripDays";
import { getTripDays } from "../../api/tripDays";
import { appendTripPlaces, type StoredStop, getTripPlaces } from "../../api/tripPlaces";
import { getSharedTripDetail } from "../../api/tripSharing";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../../components/loader/Loader";
import Logout from "../../components/emptyUI/logout/Logout";

import { PlaceCardStyle, TripDaysPageStyle } from "./timetableStyle";

import type { SavedTrip } from "../../api/trips";
import { loadKakaoMaps } from "../../api/kakao/kakaoSdk";
import PlaceAddModal, { type Props as PlaceAddProps, type ScheduledPlace } from "../../components/modal/add-plan/PlaceAddModal";

type KakaoKeywordPlace = {
  id: string;
  place_name: string;
  road_address_name?: string;
  address_name?: string;
  category_name?: string;
  x?: string;
  y?: string;
};

function isKakaoKeywordPlace(value: unknown): value is KakaoKeywordPlace {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || typeof value.id !== "string" || !value.id) return false;
  if (!("place_name" in value) || typeof value.place_name !== "string") return false;
  for (const field of ["road_address_name", "address_name", "category_name", "x", "y"] as const) {
    if (field in value && typeof Reflect.get(value, field) !== "string") return false;
  }
  return true;
}

const loadTimetablePlaces: PlaceAddProps["loadPlaces"] = async ({ region, keyword, category, signal }) => {
  const maps = await loadKakaoMaps();
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  return new Promise((resolve, reject) => {
    const abort = () => reject(new DOMException("Aborted", "AbortError"));
    signal.addEventListener("abort", abort, { once: true });
    const service = new maps.services.Places();
    try {
      service.keywordSearch([region, keyword || category || "관광지"].filter(Boolean).join(" "), (items, status) => {
        signal.removeEventListener("abort", abort);
        if (signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
        // 기존 SDK 타입에는 OK만 선언되어 있어 실제 응답 문자열로 확인합니다.
        if (status === "ZERO_RESULT") return resolve([]);
        if (status !== maps.services.Status.OK) return reject(new Error("장소를 검색하지 못했습니다."));
        const places: Awaited<ReturnType<PlaceAddProps["loadPlaces"]>> = [];
        for (const item of items) {
          // 지도용 PlaceResult와 키워드 검색 응답은 사용하는 필드가 다릅니다.
          if (!isKakaoKeywordPlace(item)) {
            return reject(new Error("장소 검색 응답의 ID 또는 이름을 확인하지 못했습니다."));
          }
          const latitude = item.y?.trim() ? Number(item.y) : NaN;
          const longitude = item.x?.trim() ? Number(item.x) : NaN;
          places.push({
            id: `kakao-${item.id}`, placeId: item.id, provider: "kakao", name: item.place_name,
            address: item.road_address_name || item.address_name || "",
            category: item.category_name || category || "관광지",
            ...(Number.isFinite(latitude) ? { lat: latitude } : {}),
            ...(Number.isFinite(longitude) ? { lng: longitude } : {}),
          });
        }
        resolve(places);
      });
    } catch (error) {
      signal.removeEventListener("abort", abort);
      reject(error);
    }
  });
};

type TimetableResult = {
  userId: string;
  tripId: string;
  attempt: number;
  name: string;
  trip?: SavedTrip;
  permission?: "owner" | "editor" | "viewer";
  stops?: StoredStop[];
  days: TripDay[];
  error: string;
};

function getStayMinutes(place: { stayMinutes?: number }) {
  return typeof place.stayMinutes === "number" && Number.isFinite(place.stayMinutes)
    && place.stayMinutes > 0 ? place.stayMinutes : 60;
}

function formatStayDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}분`;
  if (remainingMinutes === 0) return `${hours}시간`;
  return `${hours}시간 ${remainingMinutes}분`;
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value: string) {
  const date = parseDate(value);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
}

function timeToMinutes(value?: string) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;

  const [hour, minute] = value.split(":").map(Number);

  if (hour > 23 || minute > 59) return null;

  return hour * 60 + minute;
}

function isTimelineTime(value?: string) {
  return timeToMinutes(value) !== null;
}

function getSeoulToday() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function getSeoulWeekRange() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  const getPart = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  const start = new Date(getPart("year"), getPart("month") - 1, getPart("day"));

  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return { start, end };
}

export default function TripDaysPage() {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();

  const { user } = useAuth();
  const userId = user?.id;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<TimetableResult | null>(null);
  const currentResult = result?.userId === userId && result?.tripId === tripId
    && result?.attempt === attempt ? result : null;
  const isLoading = Boolean(userId && tripId) && !currentResult;
  const loadError = currentResult?.error ?? "";
  const days = useMemo(() => currentResult?.days ?? [], [currentResult]);

  useEffect(() => {
    if (!userId || !tripId) return;
    const controller = new AbortController();
    void Promise.all([
      getSharedTripDetail(tripId, controller.signal),
      getTripDays(tripId, controller.signal),
      getTripPlaces(tripId, controller.signal),
    ]).then(([detail, dateResult, schedule]) => {
      if (controller.signal.aborted) return;
      if (dateResult.tripId !== tripId || schedule.tripId !== tripId) {
        throw new Error("선택한 여행의 일정 응답을 확인하지 못했습니다.");
      }
      const dates = [...new Set(dateResult.dates)].sort();
      const loadedDays: TripDay[] = dates.map((date, index) => ({
        id: `${tripId}-${date}`,
        tripId,
        day: index + 1,
        date,
        places: schedule.places.filter((place) => place.date === date).map((place) => ({
          id: String(place.id),
          name: place.title,
          startTime: place.time || undefined,
          stayMinutes: place.stayDurationMinutes,
        })),
      }));
      setResult({ userId, tripId, attempt, name: detail.trip.name, trip: detail.trip, permission: detail.permission, stops: schedule.places, days: loadedDays, error: "" });
    }).catch((error: unknown) => {
      if (controller.signal.aborted) return;
      setResult({
        userId, tripId, attempt, name: "", days: [],
        error: error instanceof Error ? error.message : "여행 일정을 조회하지 못했습니다.",
      });
    });
    return () => controller.abort();
  }, [userId, tripId, attempt]);

  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [datePopoverMounted, setDatePopoverMounted] = useState(false);
  useEffect(() => {
    if (datePopoverOpen || !datePopoverMounted) return;
    const timer = window.setTimeout(() => setDatePopoverMounted(false), 240);
    return () => window.clearTimeout(timer);
  }, [datePopoverOpen, datePopoverMounted]);
  const datePopoverId = useId();
  const datePopoverRef = useRef<HTMLDivElement>(null);
  const addPlaceButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!datePopoverOpen) return;
    const frame = requestAnimationFrame(() => {
      datePopoverRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus({ preventScroll: true });
    });
    const handlePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !datePopoverRef.current?.contains(event.target)) setDatePopoverOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setDatePopoverOpen(false);
      addPlaceButtonRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [datePopoverOpen]);

  const [targetDate, setTargetDate] = useState("");
  const saveLock = useRef(false);
  const pendingStops = useRef<{ key: string; places: Omit<StoredStop, "date">[] } | null>(null);

  const handleAddPlaces = async (places: ScheduledPlace[]) => {
    if (!tripId || !targetDay || !currentResult?.trip || currentResult.permission === "viewer" || saveLock.current) return;
    saveLock.current = true;
    const date = targetDay.date;
    try {
      const key = JSON.stringify({ tripId, date, places });
      if (pendingStops.current?.key !== key) {
        const baseId = Date.now();
        pendingStops.current = { key, places: places.map((place, index) => ({
          id: baseId + index,
          placeId: place.provider === "kakao" || /^\d+$/.test(place.placeId ?? place.id)
            ? `kakao-${(place.placeId ?? place.id).replace(/^kakao-/, "")}` : place.id,
          title: place.name, time: place.startTime, description: place.description ?? "",
          address: place.address, image: place.image ?? "", x: 50, y: 50,
          category: /카페/.test(place.category) ? "카페" : /맛집|음식|식당/.test(place.category) ? "맛집"
            : /숙소|숙박|호텔/.test(place.category) ? "숙소" : /쇼핑/.test(place.category) ? "쇼핑" : "관광지",
          stayDurationMinutes: place.stayDurationMinutes, transport: place.transport,
          ...(typeof place.lat === "number" ? { lat: place.lat } : {}),
          ...(typeof place.lng === "number" ? { lng: place.lng } : {}),
        })) };
      }
      const saved = await appendTripPlaces(tripId, date, pendingStops.current.places);
      setResult((previous) => previous?.tripId === tripId && previous.userId === userId ? {
        ...previous, stops: saved.places,
        days: previous.days.map((day) => ({ ...day, places: saved.places.filter((place) => place.date === day.date).map((place) => ({
          id: String(place.id), name: place.title, startTime: place.time || undefined, stayMinutes: place.stayDurationMinutes,
        })) })),
      } : previous);
      pendingStops.current = null;
      setPlaceModalOpen(false);
      const query = new URLSearchParams({ tab: "schedule", date });
      navigate(`/trip-schedule/${encodeURIComponent(tripId)}?${query.toString()}`);
    } finally { saveLock.current = false; }
  };

  const [view, setView] = useState<"table" | "list">("table");
  const [visibleDayIndex, setVisibleDayIndex] = useState(0);
  const [visibleDayCount, setVisibleDayCount] = useState(5);
  const targetDay = days.find((day) => day.date === targetDate)
    ?? days[Math.min(visibleDayIndex, Math.max(0, days.length - 1))];
  const scheduleRef = useRef<HTMLDivElement>(null);
  const slideFrameRef = useRef(0);
  const slideTargetRef = useRef<number | null>(null);
  const [isTimetableShareOpen, setIsTimetableShareOpen] = useState(false);

  const [scrollState, setScrollState] = useState({
    overflowing: false,
    canPrevious: false,
    canNext: false,
  });

  const timetableDays: TripDay[] = [...days];
  while (timetableDays.length < visibleDayCount) {
    timetableDays.push({ id: `placeholder-${timetableDays.length}`, tripId: tripId ?? "", day: 0, date: "", places: [] });
  }

  const scheduleTimes = days.flatMap((day) =>
    day.places.flatMap((place) => {
      const start = timeToMinutes(place.startTime);
      return start === null
        ? []
        : [{ start, end: start + getStayMinutes(place) }];
    }),
  );
  const firstMinutes = scheduleTimes.reduce(
    (earliest, time) => Math.min(earliest, time.start),
    24 * 60,
  );
  const lastEndMinutes = scheduleTimes.reduce(
    (latest, time) => Math.max(latest, time.end),
    0,
  );
  const startHour =
    scheduleTimes.length > 0
      ? Math.max(0, Math.floor((firstMinutes - 60) / 60))
      : 0;
  const endHour =
    scheduleTimes.length > 0
      ? Math.min(24, Math.ceil((lastEndMinutes + 60) / 60))
      : 24;
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, index) => startHour + index,
  );

  const dayDatesKey = days.map((day) => day.date).join(",");
  const today = getSeoulToday();

  const placeCount = days.reduce((total, day) => total + day.places.length, 0);

  const uniquePlaceCount = new Set(
    days.flatMap((day) => day.places.map((place) => place.name)),
  ).size;

  const { start: weekStart, end: weekEnd } = getSeoulWeekRange();

  const weeklyMoveCount = days.reduce((total, day) => {
    const date = parseDate(day.date);

    if (date < weekStart || date >= weekEnd) return total;

    return total + Math.max(day.places.length - 1, 0);
  }, 0);

  useEffect(() => {
    if (view !== "table") return;

    const element = scheduleRef.current;
    if (!element) return;

    const dates = dayDatesKey ? dayDatesKey.split(",") : [];

    let frame = 0;
    let initialized = false;
    let previousDayWidth = 0;
    let previousVisibleDays = 0;

    const update = () => {
      const viewportWidth = element.clientWidth;
      const styles = getComputedStyle(element);

      const timeWidth =
        parseFloat(styles.getPropertyValue("--time-width")) || 64;

      const visibleDays =
        parseFloat(styles.getPropertyValue("--visible-days")) || 5;

      if (viewportWidth <= timeWidth) return;

      const dayWidth = (viewportWidth - timeWidth) / visibleDays;

      const tableWidth = Math.max(
        viewportWidth,
        timeWidth + dates.length * dayWidth,
      );

      const previousIndex =
        previousDayWidth > 0
          ? Math.round(
              (slideTargetRef.current ?? element.scrollLeft) / previousDayWidth,
            )
          : 0;

      element.style.setProperty("--day-column-width", `${dayWidth}px`);
      element.style.setProperty("--schedule-table-width", `${tableWidth}px`);

      const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);

      if (
        !initialized ||
        previousVisibleDays !== visibleDays ||
        Math.abs(previousDayWidth - dayWidth) > 0.1
      ) {
        cancelAnimationFrame(slideFrameRef.current);
        slideFrameRef.current = 0;
        slideTargetRef.current = null;

        const todayIndex = dates.findIndex((date) => date === today);
        const initialIndex = todayIndex >= 0 ? todayIndex : 0;

        const index = initialized ? previousIndex : initialIndex;

        element.scrollLeft = Math.min(maxScroll, Math.max(0, index * dayWidth));

        initialized = true;
        previousDayWidth = dayWidth;
        previousVisibleDays = visibleDays;

        setVisibleDayCount(visibleDays);
      }

      const position = Math.min(
        maxScroll,
        Math.max(0, slideTargetRef.current ?? element.scrollLeft),
      );

      setVisibleDayIndex(
        Math.max(
          0,
          Math.min(dates.length - 1, Math.round(position / dayWidth)),
        ),
      );

      const nextState = {
        overflowing: maxScroll > 2,
        canPrevious: position > 2,
        canNext:
          position + visibleDays * dayWidth < dates.length * dayWidth - 2,
      };

      setScrollState((previous) =>
        previous.overflowing === nextState.overflowing &&
        previous.canPrevious === nextState.canPrevious &&
        previous.canNext === nextState.canNext
          ? previous
          : nextState,
      );
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(scheduleUpdate);

    observer.observe(element);

    if (element.parentElement) {
      observer.observe(element.parentElement);
    }

    if (element.firstElementChild) {
      observer.observe(element.firstElementChild);
    }

    window.addEventListener("resize", scheduleUpdate);
    element.addEventListener("scroll", scheduleUpdate, { passive: true });

    scheduleUpdate();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(slideFrameRef.current);

      slideFrameRef.current = 0;
      slideTargetRef.current = null;

      observer.disconnect();

      window.removeEventListener("resize", scheduleUpdate);
      element.removeEventListener("scroll", scheduleUpdate);
    };
  }, [view, dayDatesKey, today, isLoading, loadError]);

  const moveSchedule = (direction: -1 | 1) => {
    const element = scheduleRef.current;
    const heading = element?.querySelector<HTMLElement>(".day-heading");

    if (!element || !heading) return;

    const dayWidth = heading.getBoundingClientRect().width;
    if (dayWidth <= 0) return;

    const styles = getComputedStyle(element);
    const visibleDays =
      parseFloat(styles.getPropertyValue("--visible-days")) || 5;

    const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);

    const previousTarget = slideTargetRef.current ?? element.scrollLeft;

    const canNext =
      previousTarget + visibleDays * dayWidth <
      timetableDays.length * dayWidth - 2;

    if (direction === 1 && !canNext) return;
    if (direction === -1 && previousTarget <= 2) return;

    const target = Math.min(
      maxScroll,
      Math.max(0, previousTarget + direction * dayWidth),
    );

    const from = element.scrollLeft;

    cancelAnimationFrame(slideFrameRef.current);

    slideFrameRef.current = 0;
    slideTargetRef.current = target;

    setScrollState({
      overflowing: maxScroll > 2,
      canPrevious: target > 2,
      canNext: target + visibleDays * dayWidth < days.length * dayWidth - 2,
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.scrollLeft = target;
      slideTargetRef.current = null;
      return;
    }

    const startedAt = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / 420, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      element.scrollLeft = from + (target - from) * eased;

      if (progress < 1) {
        slideFrameRef.current = requestAnimationFrame(animate);
      } else {
        slideFrameRef.current = 0;
        slideTargetRef.current = null;
      }
    };

    slideFrameRef.current = requestAnimationFrame(animate);
  };

  const stopSlide = () => {
    cancelAnimationFrame(slideFrameRef.current);
    slideFrameRef.current = 0;
    slideTargetRef.current = null;
  };

  const firstVisibleDay =
    days[Math.min(visibleDayIndex, Math.max(0, days.length - 1))];
  const lastVisibleDay =
    days[
      Math.min(
        visibleDayIndex + visibleDayCount - 1,
        Math.max(0, days.length - 1),
      )
    ];
  const formatNoticeDate = (value: string) => {
    const date = parseDate(value);
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${date.getMonth() + 1}.${date.getDate()} (${weekday})`;
  };

  return (
    <TripDaysPageStyle>
      <aside className="page-sidebar">
        <MainSidebar />
      </aside>

      <div className="page-mobile-header">
        <MobileHeader />
      </div>

      <main className="page-content">
        <div className="trip-days-inner">
          <Breadcrumb
            className="trip-days-breadcrumb"
            items={[
              {
                label: "내 여행",
                to: "/",
                Icon: House,
              },
              {
                label: "일정",
                to: "/schedule",
              },
              {
                label: "여행 시간표",
              },
            ]}
          />

          {!user ? (
            <Logout />
          ) : !tripId ? (
            <div className="empty-state" role="alert">
              <h2>여행을 선택해주세요</h2>
              <button type="button" onClick={() => navigate("/schedule")}>여행 일정으로 이동</button>
            </div>
          ) : isLoading ? (
            <Loader />
          ) : loadError ? (
            <div className="empty-state" role="alert">
              <p>{loadError}</p>
              <button type="button" onClick={() => setAttempt((value) => value + 1)}>다시 시도</button>
            </div>
          ) : (
            <>
          <header className="page-heading">
            <div>
              <h1>{currentResult?.name || "내 여행 일정"}</h1>
              <p>
                한눈에 보는 여행 일정을 확인하고, 나만의 여행을 계획해보세요.
              </p>
            </div>

            <div className="heading-actions">
              <button
                type="button"
                className="share-button"
                aria-label="여행 시간표 공유"
                onClick={() => setIsTimetableShareOpen(true)}
              >
                <Share2 aria-hidden="true" />
              </button>
              <button
                type="button"
                className="view-button"
                onClick={() =>
                  setView((previous) =>
                    previous === "table" ? "list" : "table",
                  )
                }
              >
                {view === "table" ? (
                  <List aria-hidden="true" />
                ) : (
                  <CalendarDays aria-hidden="true" />
                )}
                {view === "table" ? "목록 보기" : "시간표 보기"}
              </button>

              <div
                className="add-place-anchor"
                ref={datePopoverRef}
              >
                <button
                  ref={addPlaceButtonRef}
                  type="button"
                  className="add-button"
                  disabled={!days.length || currentResult?.permission === "viewer"}
                  aria-expanded={datePopoverOpen}
                  aria-controls={datePopoverOpen ? datePopoverId : undefined}
                  onClick={() => {
                    if (!datePopoverOpen) {
                      if (targetDay) setTargetDate(targetDay.date);
                      setDatePopoverMounted(true);
                    }
                    setDatePopoverOpen((previous) => !previous);
                  }}
                >
                  <Plus aria-hidden="true" />
                  장소 추가
                </button>
                {datePopoverMounted && (
                  <div
                    className="add-date-popover"
                    id={datePopoverId}
                    data-open={datePopoverOpen}
                    aria-hidden={!datePopoverOpen}
                    onAnimationEnd={(event) => {
                      if (event.target === event.currentTarget && !datePopoverOpen) setDatePopoverMounted(false);
                    }}
                  >
                    <h2>추가할 날짜</h2>
                    <div className="add-date-options" role="group" aria-label="장소를 추가할 날짜">
                      {days.map((day) => {
                        const selected = targetDay?.date === day.date;
                        return (
                          <label key={day.id} className="add-date-option" data-selected={selected}>
                            <input
                              type="radio"
                              name={`${datePopoverId}-date`}
                              value={day.date}
                              checked={selected}
                              disabled={!datePopoverOpen}
                              onChange={() => setTargetDate(day.date)}
                            />
                            <span className="add-date-copy">
                              <strong>Day {day.day} · {formatDate(day.date)}</strong>
                              <span>{day.places.length ? `일정 ${day.places.length}개` : "일정 없음"}</span>
                            </span>
                            {selected && <Check className="add-date-check" size={18} aria-hidden="true" />}
                          </label>
                        );
                      })}
                    </div>
                    <button
                      className="date-search-button"
                      type="button"
                      disabled={!targetDay || !datePopoverOpen}
                      onClick={() => {
                        setDatePopoverOpen(false);
                        setDatePopoverMounted(false);
                        setPlaceModalOpen(true);
                      }}
                    >
                      <Search aria-hidden="true" />
                      장소 검색
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <section className="summary-grid" aria-label="여행 일정 요약">
            <div className="summary-card summary-days">
              <span className="summary-icon">
                <CalendarDays aria-hidden="true" />
              </span>
              <div>
                <p>여행 기간</p>
                <strong>{days.length}일</strong>
              </div>
            </div>

            <div className="summary-card summary-moves">
              <span className="summary-icon">
                <ArrowRightLeft aria-hidden="true" />
              </span>
              <div>
                <p>이번 주 이동</p>
                <strong>{weeklyMoveCount}회</strong>
              </div>
            </div>

            <div className="summary-card summary-places">
              <span className="summary-icon">
                <List aria-hidden="true" />
              </span>
              <div>
                <p>전체 일정</p>
                <strong>{placeCount}개</strong>
              </div>
            </div>

            <div className="summary-card summary-regions">
              <span className="summary-icon">
                <MapPin aria-hidden="true" />
              </span>
              <div>
                <p>방문 예정 장소</p>
                <strong>{uniquePlaceCount}곳</strong>
              </div>
            </div>
          </section>

          {days.length === 0 ? (
            <div className="empty-state" role="status">
              <CalendarDays aria-hidden="true" />
              <h2>등록된 여행 일정이 없어요</h2>
              <p>다른 여행을 선택해 일정을 확인해주세요.</p>
            </div>
          ) : view === "table" ? (
            <div className="schedule-wrapper">
              {scrollState.overflowing && (
                <div className="mobile-schedule-notice">
                  <div className="mobile-notice-text" aria-live="polite">
                    <strong className="mobile-notice-period">
                      {Math.max(0, days.length - 1)}박 {days.length}일
                    </strong>
                    <p className="mobile-notice-dates">
                      {firstVisibleDay &&
                        lastVisibleDay &&
                        (firstVisibleDay.id === lastVisibleDay.id
                          ? formatNoticeDate(firstVisibleDay.date)
                          : `${formatNoticeDate(firstVisibleDay.date)} – ${formatNoticeDate(lastVisibleDay.date)}`)}
                    </p>
                  </div>
                  <div
                    className="mobile-schedule-controls"
                    role="group"
                    aria-label="날짜 이동"
                  >
                    <button
                      type="button"
                      aria-label="이전 날짜 보기"
                      aria-controls="trip-days-timetable"
                      disabled={!scrollState.canPrevious}
                      onClick={() => moveSchedule(-1)}
                    >
                      <ChevronLeft aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="다음 날짜 보기"
                      aria-controls="trip-days-timetable"
                      disabled={!scrollState.canNext}
                      onClick={() => moveSchedule(1)}
                    >
                      <ChevronRight aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
              {scrollState.overflowing && (
                <div
                  className="schedule-controls"
                  role="group"
                  aria-label="날짜 이동"
                >
                  <button
                    type="button"
                    className="schedule-previous"
                    aria-label="이전 날짜 보기"
                    aria-controls="trip-days-timetable"
                    disabled={!scrollState.canPrevious}
                    style={{
                      visibility: scrollState.canPrevious
                        ? "visible"
                        : "hidden",
                    }}
                    onClick={() => moveSchedule(-1)}
                  >
                    <ChevronLeft aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="schedule-next"
                    aria-label="다음 날짜 보기"
                    aria-controls="trip-days-timetable"
                    disabled={!scrollState.canNext}
                    style={{
                      visibility: scrollState.canNext ? "visible" : "hidden",
                    }}
                    onClick={() => moveSchedule(1)}
                  >
                    <ChevronRight aria-hidden="true" />
                  </button>
                </div>
              )}

              <section className="schedule-panel" aria-label="여행 시간표">
                <div
                  id="trip-days-timetable"
                  ref={scheduleRef}
                  className="schedule-scroll"
                  onPointerDown={stopSlide}
                  onWheel={stopSlide}
                  onKeyDown={stopSlide}
                  tabIndex={0}
                  aria-label="날짜별 시간표"
                >
                  <div
                    className="schedule-table"
                    style={
                      {
                        "--day-count": days.length,
                        "--timeline-hours": endHour - startHour,
                        gridTemplateColumns: `var(--time-width) repeat(${timetableDays.length}, var(--day-column-width, 180px))`,
                      } as CSSProperties
                    }
                  >
                    <div className="time-heading">
                      <Clock3 aria-label="시간" />
                    </div>

                    {timetableDays.map((day, index) => (
                      <div className="day-heading" key={day.id}>
                        <strong>{day.date ? formatDate(day.date) : "—"}</strong>
                        <span>
                          {index < days.length ? `DAY ${day.day}` : ""}
                        </span>
                      </div>
                    ))}

                    <div className="time-axis">
                      {hours.map((hour, index) => (
                        <span
                          key={hour}
                          style={{
                            top: `calc(${index} * var(--hour-height))`,
                          }}
                        >
                          {String(hour).padStart(2, "0")}:00
                        </span>
                      ))}
                    </div>

                    {timetableDays.map((day) => {
                      const otherPlaces = day.places.filter(
                        (place) => !isTimelineTime(place.startTime),
                      );

                      return (
                        <div className="day-column" key={day.id}>
                          <div className="day-timeline">
                            {day.places.map((place, index) => {
                              const minutes = timeToMinutes(place.startTime);

                              if (
                                minutes === null ||
                                !isTimelineTime(place.startTime)
                              ) {
                                return null;
                              }

                              return (
                                <PlaceCardStyle
                                  key={place.id}
                                  className={`place-card palette-${index % 6}`}
                                  startOffsetMinutes={minutes - startHour * 60}
                                  stayMinutes={getStayMinutes(place)}
                                >
                                  <div className="place-content">
                                    <h2 title={place.name}>{place.name}</h2>
                                    <p className="place-time">
                                      <Clock3 aria-hidden="true" />
                                      <span
                                        title={`예상 체류 ${formatStayDuration(getStayMinutes(place))}`}
                                      >
                                        예상{" "}
                                        {formatStayDuration(
                                          getStayMinutes(place),
                                        )}
                                      </span>
                                    </p>
                                  </div>
                                </PlaceCardStyle>
                              );
                            })}
                          </div>

                          {otherPlaces.length > 0 && (
                            <div className="other-places">
                              <p>그 외 일정</p>
                              {otherPlaces.map((place) => (
                                <article key={place.id}>
                                  <strong>{place.name}</strong>
                                  <span>{place.startTime || "시간 미정"}</span>
                                </article>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <section className="day-list" aria-label="날짜별 여행 일정">
              {days.map((day) => (
                <article className="list-day" key={day.id}>
                  <header>
                    <span>DAY {day.day}</span>
                    <h2>{formatDate(day.date)}</h2>
                  </header>

                  {day.places.length > 0 ? (
                    <ol>
                      {day.places.map((place, index) => (
                        <li key={place.id}>
                          <span className="place-order">{index + 1}</span>
                          <strong>{place.name}</strong>
                          <span className="list-time">
                            {place.startTime || "시간 미정"}
                          </span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="no-places">등록된 장소가 없어요.</p>
                  )}
                </article>
              ))}
            </section>
          )}
            </>
          )}
        </div>
      </main>

      <div className="page-mobile-nav">
        <MobileNav />
      </div>
      {currentResult?.trip && targetDay && (
        <PlaceAddModal
          key={`${userId}:${tripId}`}
          open={placeModalOpen && !loadError}
          dayLabel={`DAY ${targetDay.day}`}
          dateLabel={formatDate(targetDay.date)}
          region={currentResult.trip.region}
          defaultTransport={currentResult.trip.transport}
          existingPlaceIds={(currentResult.stops ?? []).filter((place) => place.date === targetDay.date).map((place) => place.placeId ?? String(place.id))}
          loadPlaces={loadTimetablePlaces}
          onClose={() => setPlaceModalOpen(false)}
          onConfirm={handleAddPlaces}
        />
      )}
      <TimetableShareModal
        key={`${userId ?? ""}:${tripId ?? ""}`}
        isOpen={Boolean(currentResult && !loadError && isTimetableShareOpen)}
        onClose={() => setIsTimetableShareOpen(false)}
        days={days}
      />
    </TripDaysPageStyle>
  );
}
