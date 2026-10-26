import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, MapPin, Plus, Search, X } from "lucide-react";

import { trips, type Trip, type TripStatus } from "../../../data/trips";
import { mockTripDays, type TripDay } from "../../../data/tripDays";
import { AddPlaceModalStyle } from "./AddPlaceModalStyle";

export type AddPlaceTarget = {
  id: string;
  name: string;
  category: string;
  image: string;
  address?: string;
};

export type AddPlaceResult = {
  place: AddPlaceTarget;
  trip: Trip;
  day: TripDay;
};

type AddPlaceModalProps = {
  open: boolean;
  place: AddPlaceTarget;
  onClose: () => void;
  onAdd: (result: AddPlaceResult) => void;
};

const statusLabels: Record<TripStatus, string> = {
  PLANNING: "예정",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
};

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDate(value: string, includeYear = false) {
  const date = parseDate(value);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  const prefix = includeYear ? `${date.getFullYear()}. ` : "";

  return `${prefix}${date.getMonth() + 1}.${date.getDate()} (${weekday})`;
}

function getTripDays(trip: Trip): TripDay[] {
  const tripDays = mockTripDays.filter((item) => item.tripId === trip.id);
  const dates = (
    tripDays.length
      ? tripDays.map((item) => item.date)
      : [trip.startDate, trip.endDate]
  ).sort();
  const current = parseDate(dates[0]);
  const end = parseDate(dates[dates.length - 1]);
  const savedDays = new Map(tripDays.map((item) => [item.date, item]));
  const days: TripDay[] = [];

  while (current <= end) {
    const date = dateKey(current);
    const day = days.length + 1;
    const savedDay = savedDays.get(date);

    days.push({
      ...savedDay,
      id: savedDay?.id ?? `trip-${trip.id}-date-${date}`,
      tripId: trip.id,
      day,
      date,
      places: savedDay?.places ?? [],
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
}

export default function AddPlaceModal(props: AddPlaceModalProps) {
  if (!props.open) return null;

  return <AddPlaceModalContent key={props.place.id} {...props} />;
}

function AddPlaceModalContent({ place, onClose, onAdd }: AddPlaceModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const radioName = useId();

  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const [isClosing, setIsClosing] = useState(false);

  const requestClose = () => setIsClosing(true);
  const [step, setStep] = useState<"trip" | "day">("trip");
  const [query, setQuery] = useState("");
  const [selectedTripId, setSelectedTripId] = useState("");
  const [selectedDayId, setSelectedDayId] = useState("");

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId);
  const days = selectedTrip ? getTripDays(selectedTrip) : [];
  const selectedDay = days.find((day) => day.id === selectedDayId);

  const keyword = query.trim().toLocaleLowerCase();
  const filteredTrips = trips.filter((trip) =>
    `${trip.title} ${trip.region}`.toLocaleLowerCase().includes(keyword),
  );

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const frame = requestAnimationFrame(() => {
      searchRef.current?.focus({ preventScroll: true });
    });

    const preventBackgroundScroll = (event: WheelEvent | TouchEvent) => {
      if (
        event.target instanceof Node &&
        !dialogRef.current?.contains(event.target)
      ) {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsClosing(true);
        return;
      }

      if (event.key !== "Tab") return;

      const elements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex="0"]',
        ) ?? [],
      ).filter(
        (element) =>
          element.getClientRects().length > 0 &&
          !(
            element instanceof HTMLInputElement &&
            element.type === "radio" &&
            !element.checked &&
            dialogRef.current?.querySelector(
              `input[name="${element.name}"]:checked`,
            )
          ),
      );

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement;
      const outside = !dialogRef.current?.contains(active);

      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", preventBackgroundScroll, {
      passive: false,
    });
    document.addEventListener("touchmove", preventBackgroundScroll, {
      passive: false,
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", preventBackgroundScroll);
      document.removeEventListener("touchmove", preventBackgroundScroll);

      if (previousFocus?.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (step === "trip") {
        searchRef.current?.focus({ preventScroll: true });
      } else {
        backRef.current?.focus({ preventScroll: true });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [step]);

  const handleNext = () => {
    if (!selectedTrip || !days.length) return;

    setSelectedDayId(days[0].id);
    setStep("day");
  };

  const handleAdd = () => {
    if (isClosing || !selectedTrip || !selectedDay) return;

    onAdd({
      place,
      trip: selectedTrip,
      day: selectedDay,
    });

    requestClose();
  };

  return createPortal(
    <AddPlaceModalStyle
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`add-place-dialog is-${step}-step`}
        data-open={!isClosing}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && isClosing) {
            onCloseRef.current();
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={step === "trip" ? descriptionId : undefined}
      >
        <div className="sheet-handle" aria-hidden="true" />

        <header className="modal-header">
          <div className="modal-title-row">
            {step === "day" && (
              <button
                ref={backRef}
                type="button"
                className="icon-button back-button"
                aria-label="여행 다시 선택"
                onClick={() => setStep("trip")}
              >
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
            )}

            <h2 id={titleId}>
              {step === "trip"
                ? "어떤 여행에 추가할까요?"
                : "어느 날에 추가할까요?"}
            </h2>
          </div>

          <button
            type="button"
            className="icon-button close-button"
            aria-label="모달 닫기"
            onClick={requestClose}
          >
            <X size={24} aria-hidden="true" />
          </button>

          {step === "trip" && (
            <p id={descriptionId}>장소를 추가할 여행을 선택해주세요.</p>
          )}
        </header>

        <section className="place-summary" aria-label="추가할 장소">
          <img src={place.image} alt="" />

          <div className="place-info">
            <h3>{place.name}</h3>

            <div className="place-meta">
              <span className="place-category">{place.category}</span>

              {step === "day" && place.address && (
                <span className="place-address">
                  <MapPin size={16} aria-hidden="true" />
                  {place.address}
                </span>
              )}
            </div>
          </div>
        </section>

        {step === "trip" ? (
          <>
            <label className="trip-search">
              <Search size={20} aria-hidden="true" />

              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="여행 이름 또는 여행지 검색"
                aria-label="여행 이름 또는 여행지 검색"
              />
            </label>

            <div
              className="trip-options modal-scroll"
              role="group"
              aria-label="여행 선택"
            >
              {filteredTrips.map((trip) => (
                <label
                  key={trip.id}
                  className={`trip-option ${
                    selectedTripId === trip.id ? "is-selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`${radioName}-trip`}
                    value={trip.id}
                    checked={selectedTripId === trip.id}
                    onChange={() => setSelectedTripId(trip.id)}
                  />

                  <img src={trip.image} alt="" />

                  <span className="trip-info">
                    <strong>{trip.title}</strong>
                    <span>
                      {formatDate(trip.startDate, true)} –{" "}
                      {formatDate(trip.endDate)}
                    </span>
                  </span>

                  <span className={`trip-status is-${trip.status}`}>
                    {statusLabels[trip.status]}
                  </span>
                </label>
              ))}

              {!filteredTrips.length && (
                <p className="empty-message" role="status">
                  검색 결과가 없어요.
                </p>
              )}
            </div>

            <footer className="modal-footer trip-footer">
              <p className="selection-text" role="status">
                {selectedTrip
                  ? `${selectedTrip.title} 선택됨`
                  : "여행을 선택해주세요."}
              </p>

              <div className="footer-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={requestClose}
                >
                  취소
                </button>

                <button
                  type="button"
                  className="primary-button"
                  disabled={!selectedTrip || !days.length}
                  onClick={handleNext}
                >
                  <Plus size={20} aria-hidden="true" />이 장소 추가하기
                </button>
              </div>
            </footer>
          </>
        ) : (
          <>
            <div
              className={`day-options modal-scroll ${days.length >= 7 ? "is-day-list" : days.length >= 5 ? "is-day-grid" : ""}`}
              role="group"
              data-day-count={days.length}
              aria-label={`${selectedTrip?.title} 날짜 선택`}
            >
              {days.map((day) => (
                <label
                  key={day.id}
                  className={`day-option ${
                    selectedDayId === day.id ? "is-selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`${radioName}-day`}
                    value={day.id}
                    checked={selectedDayId === day.id}
                    onChange={() => setSelectedDayId(day.id)}
                  />

                  <span className="day-info">
                    <span className="day-heading">
                      <strong>Day {day.day}</strong>
                      <span>{formatDate(day.date)}</span>
                    </span>

                    <span className="day-places">
                      {day.places.length ? (
                        day.places.map((item) => (
                          <span key={item.id}>
                            {item.name}
                            {item.startTime && ` ${item.startTime}`}
                          </span>
                        ))
                      ) : (
                        <span>등록된 일정이 없어요.</span>
                      )}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <footer className="modal-footer day-footer">
              <button
                type="button"
                className="primary-button"
                disabled={!selectedDay}
                onClick={handleAdd}
              >
                <Plus size={20} aria-hidden="true" />이 장소 추가하기
              </button>
            </footer>
          </>
        )}
      </div>
    </AddPlaceModalStyle>,
    document.body,
  );
}
