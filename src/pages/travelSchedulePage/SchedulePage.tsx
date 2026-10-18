import { useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ChevronRight, House, MapPin, Plus } from "lucide-react";
import {
  createScheduleColorMap,
  getScheduleColorStyle,
} from "../../utils/colorUtils";
import { travelScheduleData } from "../../data/schedule";
import type { TravelSchedule } from "../../data/schedule";
import { SchedulePageLayout, SchedulePageStyle } from "./schedulePageStyle";
import MonthPicker from "../../components/pickers/MonthPicker";
import {
  addDays,
  dateKey,
  monthWeeks,
  parseDate,
  weekSegments,
} from "../../utils/calendarUtils";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import MobileNav from "../../components/mobileBanner/MobileFooter";
import MobileHeader from "../../components/mobileBanner/MobileHeader";

type SchedulePageProps = {
  schedules?: TravelSchedule[];
  initialDate?: string;
  createTripHref?: string;
  getTripHref?: (trip: TravelSchedule) => string;
};

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

const fullDate = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}요일`;

const shortDate = (value: string) => {
  const date = parseDate(value);

  return `${date.getMonth() + 1}. ${date.getDate()} (${weekdays[date.getDay()]})`;
};

export default function SchedulePage({
  schedules = travelScheduleData,
  initialDate = "2026-10-06",
  createTripHref = "/trips/new",
  getTripHref = (trip) => `/trips/${encodeURIComponent(trip.id)}`,
}: SchedulePageProps) {
  const titleId = useId();
  const scheduleColorMap = useMemo(
    () => createScheduleColorMap(schedules),
    [schedules],
  );
  const [selected, setSelected] = useState(() => parseDate(initialDate));
  const [month, setMonth] = useState(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1),
  );

  const dateRefs = useRef(new Map<string, HTMLButtonElement>());
  const selectedKey = dateKey(selected);
  const todayKey = dateKey(new Date());
  const weeks = monthWeeks(month);
  const monthStart = dateKey(month);
  const monthEnd = dateKey(
    new Date(month.getFullYear(), month.getMonth() + 1, 0),
  );

  const monthTrips = schedules
    .filter((trip) => trip.startDate <= monthEnd && trip.endDate >= monthStart)
    .sort(
      (a, b) =>
        a.startDate.localeCompare(b.startDate) ||
        a.startTime.localeCompare(b.startTime),
    );

  const dayTrips = monthTrips.filter(
    (trip) => trip.startDate <= selectedKey && trip.endDate >= selectedKey,
  );

  function selectDate(date: Date) {
    setSelected(date);
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  function changeMonth(value: string) {
    const [year, monthNumber] = value.split("-").map(Number);
    const lastDay = new Date(year, monthNumber, 0).getDate();

    setMonth(new Date(year, monthNumber - 1, 1));
    setSelected(
      new Date(year, monthNumber - 1, Math.min(selected.getDate(), lastDay)),
    );
  }

  function onDateKey(event: KeyboardEvent<HTMLButtonElement>, date: Date) {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -date.getDay(),
      End: 6 - date.getDay(),
    };

    if (!(event.key in offsets)) return;

    event.preventDefault();

    const next = addDays(date, offsets[event.key]);

    selectDate(next);
    requestAnimationFrame(() => dateRefs.current.get(dateKey(next))?.focus());
  }

  function tripCard(trip: TravelSchedule, showDates: boolean) {
    return (
      <li key={trip.id}>
        <a
          className="trip-card"
          style={getScheduleColorStyle(trip.id, scheduleColorMap)}
          href={getTripHref(trip)}
        >
          <MapPin aria-hidden="true" className="pin" />

          <div className="trip-copy">
            <h3>{trip.name}</h3>
            <p>{trip.items.join(" · ")}</p>
          </div>

          {showDates && (
            <span className="trip-period">
              {shortDate(trip.startDate)} ~ {shortDate(trip.endDate)}
            </span>
          )}

          <ChevronRight aria-hidden="true" className="card-chevron" />
        </a>
      </li>
    );
  }

  return (
    <SchedulePageLayout>
      <div className="page-mobile page-mobile-header">
        <MobileHeader />
      </div>

      <aside className="schedule-sidebar" aria-label="주 메뉴">
        <MainSidebar />
      </aside>

      <SchedulePageStyle
        as="main"
        className="page-content"
        aria-labelledby={titleId}
      >
        <nav className="trips-breadcrumb" aria-label="현재 위치">
          <House size={18} aria-hidden="true" />
          <span>내 여행</span>
          <ChevronRight size={18} aria-hidden="true" />
          <span aria-current="page">일정</span>
        </nav>

        <header className="schedule-header">
          <div className="heading-row">
            <div className="heading-copy">
              <h1 id={titleId}>내 여행 일정</h1>
              <p>
                한눈에 보는 여행 일정을 확인하고,
                <br className="mobile-break" /> 나만의 여행을 자유롭게
                수정해보세요.
              </p>
            </div>

            <a className="create-trip" href={createTripHref}>
              <Plus aria-hidden="true" />
              <span>새 여행 만들기</span>
            </a>
          </div>

          <div className="calendar-toolbar">
            <div className="month-navigation">
              <MonthPicker
                className="schedule-month-picker"
                label="여행 일정 연월 선택"
                value={`${month.getFullYear()}-${String(
                  month.getMonth() + 1,
                ).padStart(2, "0")}`}
                onChange={changeMonth}
                placement="bottom"
              />
            </div>

            <button
              className="today-button"
              type="button"
              onClick={() => selectDate(new Date())}
            >
              오늘
            </button>
          </div>
        </header>

        <div
          className="calendar"
          role="group"
          aria-label={`${month.getFullYear()}년 ${month.getMonth() + 1}월 여행 달력`}
        >
          <div className="weekday-row" aria-hidden="true">
            {weekdays.map((day, index) => (
              <span key={day} data-weekday={index}>
                {day}
              </span>
            ))}
          </div>

          {weeks.map((week) => {
            const segments = weekSegments(week, monthTrips);
            const laneCount = Math.max(
              1,
              ...segments.map((segment) => segment.lane + 1),
            );

            return (
              <div
                className="calendar-week"
                key={dateKey(week[0])}
                style={{
                  gridTemplateRows: `40px repeat(${laneCount}, var(--event-height)) minmax(10px, 1fr)`,
                }}
              >
                {week.map((date, col) => {
                  const key = dateKey(date);
                  const count = schedules.filter(
                    (trip) => trip.startDate <= key && trip.endDate >= key,
                  ).length;

                  return (
                    <div
                      className="day-cell"
                      key={key}
                      style={{ gridColumn: col + 1, gridRow: "1 / -1" }}
                      data-outside={date.getMonth() !== month.getMonth()}
                      data-selected={key === selectedKey}
                      data-weekday={date.getDay()}
                    >
                      <button
                        type="button"
                        className="day-button"
                        ref={(node) => {
                          if (node) dateRefs.current.set(key, node);
                          else dateRefs.current.delete(key);
                        }}
                        aria-label={`${fullDate(date)}, 여행 ${count}개`}
                        aria-pressed={key === selectedKey}
                        aria-current={key === todayKey ? "date" : undefined}
                        onKeyDown={(event) => onDateKey(event, date)}
                        onClick={() => selectDate(date)}
                      >
                        <span className="day-number">{date.getDate()}</span>
                      </button>
                    </div>
                  );
                })}

                {segments.map(({ trip, start, end, lane }) => (
                  <a
                    key={trip.id}
                    className="calendar-event"
                    href={getTripHref(trip)}
                    aria-label={`${trip.name}, ${shortDate(trip.startDate)}부터 ${shortDate(trip.endDate)}까지, ${trip.items.join(", ")}`}
                    style={{
                      ...getScheduleColorStyle(trip.id, scheduleColorMap),
                      gridColumn: `${start + 1} / ${end + 2}`,
                      gridRow: lane + 2,
                    }}
                  >
                    <strong>{trip.name}</strong>
                    <span>{trip.items.join(" · ")}</span>
                  </a>
                ))}
              </div>
            );
          })}
        </div>

        <div className="mobile-details">
          <section
            className="selected-panel"
            aria-labelledby={`${titleId}-selected`}
          >
            <div className="section-heading">
              <h2 id={`${titleId}-selected`}>
                {selected.getMonth() + 1}월 {selected.getDate()}일 (
                {weekdays[selected.getDay()]})
              </h2>
              <span>총 {dayTrips.length}개의 여행 일정</span>
            </div>

            <div aria-live="polite">
              {dayTrips.length ? (
                <ul className="trip-list">
                  {dayTrips.map((trip) => tripCard(trip, false))}
                </ul>
              ) : (
                <p className="empty-message">
                  선택한 날짜에 여행 일정이 없어요.
                </p>
              )}
            </div>
          </section>

          <section className="all-trips" aria-labelledby={`${titleId}-all`}>
            <div className="section-heading">
              <h2 id={`${titleId}-all`}>전체 여행 일정</h2>
              <span>{monthTrips.length}개의 여행</span>
            </div>

            {monthTrips.length ? (
              <ul className="trip-list">
                {monthTrips.map((trip) => tripCard(trip, true))}
              </ul>
            ) : (
              <p className="empty-message">이번 달에 등록된 여행이 없어요.</p>
            )}
          </section>
        </div>

        <div className="page-mobile">
          <MobileNav />
        </div>
      </SchedulePageStyle>
    </SchedulePageLayout>
  );
}
