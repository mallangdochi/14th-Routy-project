import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { ChevronLeft, MapPin, Plus, Search, X } from "lucide-react";

import { getMyTrips, type SavedTrip } from "../../../api/trips";
import { getTripDays } from "../../../api/tripDays";
import { getTripPlaces, appendTripPlaces, type TripPlacesResult, type StoredStop } from "../../../api/tripPlaces";
import defaultTripImage from "../../../assets/where.webp";

type TripStatus = "PLANNING" | "IN_PROGRESS" | "COMPLETED";
type Trip = SavedTrip & { title: string; image: string; status: TripStatus };
import type { TripDay } from "../../../data/tripDays";
import { AddPlaceModalStyle } from "./AddPlaceModalStyle";

export type AddPlaceTarget = {
  id: string;
  name: string;
  category: string;
  image: string;
  address?: string;
  categoryPath?: string;
  sourcePlaceId?: string;
  placeId?: string;
  provider?: string;
  lat?: number;
  lng?: number;
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

function formatDate(value: string, includeYear = false) {
  const date = parseDate(value);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  const prefix = includeYear ? `${date.getFullYear()}. ` : "";

  return `${prefix}${date.getMonth() + 1}.${date.getDate()} (${weekday})`;
}

function getSourcePlaceId(place: AddPlaceTarget) {
  const source = place.sourcePlaceId || place.placeId || place.id;
  if (/^\d+$/.test(source)) return `kakao-${source}`;
  if (place.provider === "kakao" && !source.startsWith("kakao-")) return `kakao-${source}`;
  return source;
}

function getScheduleCategory(value: string): StoredStop["category"] {
  if (/카페|cafe/i.test(value)) return "카페";
  if (/맛집|음식|식당|restaurant/i.test(value)) return "맛집";
  if (/숙소|숙박|호텔|accommodation/i.test(value)) return "숙소";
  if (/쇼핑|shopping/i.test(value)) return "쇼핑";
  if (/교통|transport/i.test(value)) return "교통";
  return "관광지";
}

function toTripDays(tripId: string, dates: string[], schedule: TripPlacesResult): TripDay[] {
  return [...dates].sort().map((date, index) => ({
    id: `${tripId}:${date}`, tripId, day: index + 1, date,
    places: schedule.places.filter(item => item.date === date).map(item => ({
      id: String(item.id), name: item.title, startTime: item.time || undefined,
      stayMinutes: item.stayDurationMinutes ?? 60,
      sourcePlaceId: item.placeId ?? undefined,
      address: item.address, category: item.category, image: item.image,
      lat: typeof item.lat === "number" ? item.lat : undefined,
      lng: typeof item.lng === "number" ? item.lng : undefined,
    })),
  }));
}

export default function AddPlaceModal(props: AddPlaceModalProps) {
  if (!props.open) return null;

  return <AddPlaceModalContent key={props.place.id} {...props} />;
}

function AddPlaceModalContent({ place, onClose, onAdd }: AddPlaceModalProps) {
  const navigate = useNavigate();
  const titleId = useId();
  const descriptionId = useId();
  const radioName = useId();

  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const [isClosing, setIsClosing] = useState(false);

  const savingRef = useRef(false);
  const aliveRef = useRef(true);
  const closedRef = useRef(false);
  const dayControllerRef = useRef<AbortController | null>(null);
  const dayRequestRef = useRef(false);
  // 네트워크 오류로 재시도하더라도 같은 요청 ID를 사용합니다.
  const requestIdRef = useRef<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [days, setDays] = useState<TripDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDays, setIsLoadingDays] = useState(false);
  const [tripError, setTripError] = useState("");
  const [dayError, setDayError] = useState("");
  const [listRetry, setListRetry] = useState(0);

  const requestClose = () => {
    if (savingRef.current) return;
    dayControllerRef.current?.abort();
    setIsClosing(true);
  };
  const [step, setStep] = useState<"trip" | "day">("trip");
  const [query, setQuery] = useState("");
  const [selectedTripId, setSelectedTripId] = useState("");
  const [selectedDayId, setSelectedDayId] = useState("");
  const [addError, setAddError] = useState("");

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      dayControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void getMyTrips(controller.signal).then(items => {
      if (controller.signal.aborted) return;
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      setTrips(items.map(trip => ({
        ...trip, title: trip.name || `${trip.region} 여행`, image: defaultTripImage,
        status: trip.startDate > today ? "PLANNING" : trip.endDate < today ? "COMPLETED" : "IN_PROGRESS",
      })));
    }).catch((reason: unknown) => {
      if (!controller.signal.aborted) setTripError(reason instanceof Error ? reason.message : "여행 목록을 조회하지 못했습니다.");
    }).finally(() => {
      if (!controller.signal.aborted) setIsLoading(false);
    });
    return () => controller.abort();
  }, [listRetry]);

  // 애니메이션이 생략되는 환경에서도 닫힘 처리를 보장합니다.
  useEffect(() => {
    if (!isClosing) return;
    const timer = window.setTimeout(() => {
      if (!closedRef.current) {
        closedRef.current = true;
        onCloseRef.current();
      }
    }, 340);
    return () => window.clearTimeout(timer);
  }, [isClosing]);

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId);
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
        if (!savingRef.current) {
          dayControllerRef.current?.abort();
          setIsClosing(true);
        }
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

  const handleNext = async () => {
    if (!selectedTrip || dayRequestRef.current || isClosing) return;
    const trip = selectedTrip;
    const controller = new AbortController();
    dayControllerRef.current = controller;
    dayRequestRef.current = true;
    setIsLoadingDays(true);
    setDayError("");
    setAddError("");
    try {
      const [dateResult, schedule] = await Promise.all([
        getTripDays(trip.id, controller.signal),
        getTripPlaces(trip.id, controller.signal),
      ]);
      if (controller.signal.aborted) return;
      const nextDays = toTripDays(trip.id, dateResult.dates, schedule);
      if (!nextDays.length) throw new Error("추가할 여행 날짜가 없습니다.");
      setDays(nextDays);
      setSelectedDayId(nextDays[0].id);
      setStep("day");
    } catch (reason) {
      if (!controller.signal.aborted) setDayError(reason instanceof Error ? reason.message : "여행 일정을 조회하지 못했습니다.");
    } finally {
      dayRequestRef.current = false;
      if (aliveRef.current) setIsLoadingDays(false);
    }
  };

  const sourcePlaceId = getSourcePlaceId(place);
  const alreadyAdded = selectedDay?.places.some(item => item.sourcePlaceId === sourcePlaceId) ?? false;

  const handleAdd = async () => {
    if (isClosing || savingRef.current || !selectedTrip || !selectedDay || alreadyAdded) return;
    const trip = selectedTrip;
    const day = selectedDay;
    const requestId = requestIdRef.current ?? Date.now();
    requestIdRef.current = requestId;
    savingRef.current = true;
    setIsSaving(true);
    setAddError("");
    let saved: TripPlacesResult;
    try {
      saved = await appendTripPlaces(trip.id, day.date, [{
        id: requestId, placeId: sourcePlaceId,
        title: place.name, time: "", description: "",
        category: getScheduleCategory(place.category),
        address: place.address ?? "", image: place.image || "",
        stayDurationMinutes: 60,
        transport: trip.transport || undefined,
        x: 50, y: 50,
        ...(typeof place.lat === "number" && Number.isFinite(place.lat) ? { lat: place.lat } : {}),
        ...(typeof place.lng === "number" && Number.isFinite(place.lng) ? { lng: place.lng } : {}),
      }]);
    } catch (reason) {
      if (aliveRef.current) setAddError(reason instanceof Error ? reason.message : "일정을 저장하지 못했습니다.");
      return;
    } finally {
      savingRef.current = false;
      if (aliveRef.current) setIsSaving(false);
    }
    if (!aliveRef.current) return;
    const nextDays = toTripDays(trip.id, days.map(item => item.date), saved);
    const savedDay = nextDays.find(item => item.date === day.date)!;
    setDays(nextDays);
    requestClose();
    // 서버 저장 성공 후에만 부모에게 완료를 알립니다.
    const query = new URLSearchParams({ tab: "schedule", date: savedDay.date });
    try {
      onAdd({ place, trip, day: savedDay });
    } finally {
      navigate(`/trip-schedule/${encodeURIComponent(trip.id)}?${query.toString()}`);
    }
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
          if (event.target === event.currentTarget && isClosing && !closedRef.current) {
            closedRef.current = true;
            onCloseRef.current();
          }
        }}
        aria-busy={isSaving || isLoadingDays}
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
                disabled={isSaving || isClosing}
                onClick={() => { setStep("trip"); setAddError(""); setDayError(""); }}
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
            disabled={isSaving || isClosing}
            onClick={requestClose}
          >
            <X size={24} aria-hidden="true" />
          </button>

          {step === "trip" && (
            <p id={descriptionId}>장소를 추가할 여행을 선택해주세요.</p>
          )}
        </header>

        <section className="place-summary" aria-label="추가할 장소">
          <img src={place.image || defaultTripImage} alt="" />

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
                    disabled={isLoadingDays || isClosing}
                    onChange={() => { setSelectedTripId(trip.id); setDays([]); setSelectedDayId(""); setDayError(""); }}
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

              {isLoading && <p className="empty-message" role="status">여행 목록을 불러오고 있습니다.</p>}
              {tripError && <div className="empty-message" role="alert">{tripError}<button type="button" onClick={() => { setTripError(""); setIsLoading(true); setListRetry(value => value + 1); }}>다시 시도</button></div>}
              {dayError && <p className="empty-message" role="alert">{dayError}</p>}
              {!isLoading && !tripError && !filteredTrips.length && (
                <p className="empty-message" role="status">
                  {trips.length ? "검색 결과가 없어요." : "등록된 여행이 없어요."}
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
                  disabled={!selectedTrip || isLoading || !!tripError || isLoadingDays || isClosing}
                  onClick={handleNext}
                >
                  <Plus size={20} aria-hidden="true" />{isLoadingDays ? "일정 불러오는 중…" : "이 장소 추가하기"}
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
                    disabled={isSaving || isClosing}
                    onChange={() => { setSelectedDayId(day.id); setAddError(""); }}
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
              {addError && (
                <p role="alert" style={{ color: "#D85A5A", fontSize: 15 }}>
                  {addError}
                </p>
              )}
              <button
                type="button"
                className="primary-button"
                disabled={!selectedDay || isSaving || isClosing || alreadyAdded}
                onClick={handleAdd}
              >
                <Plus size={20} aria-hidden="true" />{isSaving ? "일정에 추가하는 중…" : alreadyAdded ? "이미 추가된 장소" : "이 장소 추가하기"}
              </button>
            </footer>
          </>
        )}
      </div>
    </AddPlaceModalStyle>,
    document.body,
  );
}
