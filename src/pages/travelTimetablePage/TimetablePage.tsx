import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowRightLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  House,
  Share2,
  List,
  MapPin,
  Plus,
} from "lucide-react";

import TimetableShareModal from "../../components/modal/TimetableShareModal/TimeTableShareModal";

import Breadcrumb from "../../components/MainSidebar/mainHeader/Breadcrumb";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import MobileHeader from "../../components/mobileBanner/MobileHeader";
import MobileNav from "../../components/mobileBanner/MobileFooter";
import { mockTripDays, getStayMinutes } from "../../data/tripDays";
import { PlaceCardStyle, TripDaysPageStyle } from "./timetableStyle";

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

  const [view, setView] = useState<"table" | "list">("table");
  const [visibleDayIndex, setVisibleDayIndex] = useState(0);
  const [visibleDayCount, setVisibleDayCount] = useState(5);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const slideFrameRef = useRef(0);
  const slideTargetRef = useRef<number | null>(null);
  const [isTimetableShareOpen, setIsTimetableShareOpen] = useState(false);

  const [scrollState, setScrollState] = useState({
    overflowing: false,
    canPrevious: false,
    canNext: false,
  });

  const days = mockTripDays
    .filter((day) => day.tripId === (tripId ?? "1"))
    .sort((a, b) => a.date.localeCompare(b.date) || a.day - b.day);

  // 시간표는 최소 5일 칸 유지
  const timetableDays = Array.from(
    { length: Math.max(5, days.length) },
    (_, index) => {
      const existingDay = days[index];

      if (existingDay) return existingDay;

      const lastDate = days[days.length - 1]?.date;

      const nextDate = lastDate ? parseDate(lastDate) : new Date();

      nextDate.setDate(nextDate.getDate() + index - days.length + 1);

      const date = [
        nextDate.getFullYear(),
        String(nextDate.getMonth() + 1).padStart(2, "0"),
        String(nextDate.getDate()).padStart(2, "0"),
      ].join("-");

      return {
        id: `empty-day-${index + 1}`,
        tripId: tripId ?? "1",
        day: index + 1,
        date,
        places: [],
      };
    },
  );

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

  const dayDatesKey = timetableDays.map((day) => day.date).join(",");
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
  }, [view, dayDatesKey, today]);

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

          <header className="page-heading">
            <div>
              <h1>내 여행 일정</h1>
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

              <button
                type="button"
                className="add-button"
                onClick={() => navigate("/search")}
              >
                <Plus aria-hidden="true" />
                장소 추가
              </button>
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
                        <strong>{formatDate(day.date)}</strong>
                        <span>
                          {index < days.length ? `DAY ${day.day}` : "일정 없음"}
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
        </div>
      </main>

      <div className="page-mobile-nav">
        <MobileNav />
      </div>
      <TimetableShareModal
        isOpen={isTimetableShareOpen}
        onClose={() => setIsTimetableShareOpen(false)}
        days={days}
      />
    </TripDaysPageStyle>
  );
}
