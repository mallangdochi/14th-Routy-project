import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  ChevronDown,
  Bookmark,
  Check,
  ImageOff,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";
import * as S from "./placeAddModalStyle";
// 프로젝트의 기존 TimePicker 경로에 맞춰 이 import만 조정하세요.
import TimePicker from "../../pickers/TimePicker";

export type PlaceCategory = "관광지" | "맛집" | "카페" | "숙소";

export type Place = {
  id: string;
  name: string;
  address: string;
  category: string;
  image?: string;
};

type LoadPlacesParams = {
  region: string;
  keyword: string;
  category: PlaceCategory | null;
  signal: AbortSignal;
};

export type ScheduledPlace = Place & {
  /** HH:mm. 선택하지 않으면 빈 문자열 */
  startTime: string;
  /** 분 단위. 미입력 시 60 */
  stayDurationMinutes: number;
  transport: string;
};
export type TransportOption = { value: string; label: string };
type ScheduleDraft = {
  startTime: string;
  hours: string;
  minutes: string;
  transport: string;
};
const EMPTY_DRAFT: ScheduleDraft = {
  startTime: "",
  hours: "",
  minutes: "",
  transport: "",
};
const DEFAULT_TRANSPORT_OPTIONS: TransportOption[] = [
  { value: "car", label: "자동차" },
  { value: "train", label: "기차" },
  { value: "subway", label: "지하철" },
  { value: "bus", label: "버스" },
  { value: "taxi", label: "택시" },
  { value: "walk", label: "도보" },
  { value: "plane", label: "비행기" },
];
export type Props = {
  open: boolean;
  dayLabel: string;
  dateLabel: string;
  region: string;
  savedPlaces: Place[];
  /** 여행 만들기에 저장된 교통편의 실제 값 (필수) */
  defaultTransport: string;
  defaultTransportLabel?: string;
  /** 프로젝트의 교통편 값 체계에 맞는 옵션을 전달 */
  transportOptions?: TransportOption[];
  /** 이미 해당 날짜 일정에 추가된 장소 ID */
  existingPlaceIds?: string[];
  onClose: () => void;
  /** keyword가 빈 문자열이면 여행 지역 추천 장소를 반환 */
  loadPlaces: (params: LoadPlacesParams) => Promise<Place[]>;
  onToggleSave: (place: Place, nextSaved: boolean) => Promise<void> | void;
  onConfirm: (places: ScheduledPlace[]) => Promise<void> | void;
};

type Tab = "search" | "saved";

const CATEGORIES: Array<PlaceCategory | "전체"> = [
  "전체",
  "관광지",
  "맛집",
  "카페",
  "숙소",
];

const EMPTY_IDS: string[] = [];

export default function PlaceAddModal(props: Props) {
  const [mounted, setMounted] = useState(props.open);
  const [previousOpen, setPreviousOpen] = useState(props.open);

  // effect 안에서 setState로 초기화하지 않고 재오픈 시 새로 마운트
  if (previousOpen !== props.open) {
    setPreviousOpen(props.open);

    if (props.open) {
      setMounted(true);
    }
  }

  const handleExited = useCallback(() => setMounted(false), []);

  if (!mounted) return null;

  return createPortal(
    <PlaceAddModalContent {...props} onExited={handleExited} />,
    document.body,
  );
}

function PlaceAddModalContent({
  open,
  dayLabel,
  dateLabel,
  region,
  savedPlaces,
  defaultTransport,
  defaultTransportLabel,
  transportOptions = DEFAULT_TRANSPORT_OPTIONS,
  existingPlaceIds = EMPTY_IDS,
  onClose,
  loadPlaces,
  onToggleSave,
  onConfirm,
  onExited,
}: Props & { onExited: () => void }) {
  const titleId = useId();
  const compact = useSyncExternalStore(
    subscribeCompact,
    getCompact,
    () => false,
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [drafts, setDrafts] = useState<Record<string, ScheduleDraft>>({});
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<string[]>([]);
  const transportLabel =
    defaultTransportLabel ||
    transportOptions.find((option) => option.value === defaultTransport)
      ?.label ||
    defaultTransport ||
    "미설정";
  function updateDraft(id: string, patch: Partial<ScheduleDraft>) {
    setDrafts((current) => ({
      ...current,
      [id]: { ...(current[id] ?? EMPTY_DRAFT), ...patch },
    }));
    setError("");
  }
  function moveStep(next: 1 | 2) {
    setStep(next);
    setError("");
    requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>(".title-row h2")?.focus(),
    );
  }
  const panelRef = useRef<HTMLDivElement>(null);
  const searchTabRef = useRef<HTMLButtonElement>(null);
  const savedTabRef = useRef<HTMLButtonElement>(null);

  const [tab, setTab] = useState<Tab>("search");
  const [category, setCategory] = useState<PlaceCategory | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [savedInput, setSavedInput] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [selected, setSelected] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const requestId = useRef(0);
  const aliveRef = useRef(false);
  const submitLock = useRef(false);
  const saveLocks = useRef(new Set<string>());

  // API 함수 참조가 부모 렌더링마다 바뀌어도 재요청하지 않도록 보관
  const loaderRef = useRef(loadPlaces);

  useEffect(() => {
    loaderRef.current = loadPlaces;
  }, [loadPlaces]);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // 모달이 닫히는 동안에도 스크롤 잠금과 포커스를 유지
  useEffect(() => {
    const previousFocus = document.activeElement;
    const bodyStyle = document.body.style;
    const previousOverflow = bodyStyle.getPropertyValue("overflow");
    const previousPriority = bodyStyle.getPropertyPriority("overflow");

    bodyStyle.setProperty("overflow", "hidden");
    panelRef.current?.focus();

    return () => {
      if (previousOverflow) {
        bodyStyle.setProperty("overflow", previousOverflow, previousPriority);
      } else {
        bodyStyle.removeProperty("overflow");
      }

      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, []);

  useEffect(() => {
    if (!open || tab !== "search") return;

    const controller = new AbortController();
    const currentId = ++requestId.current;

    // 비동기 콜백에서 로딩 상태 갱신
    void Promise.resolve().then(async () => {
      if (controller.signal.aborted) return;

      setLoading(true);
      setLoadError("");

      try {
        const places = await loaderRef.current({
          region,
          keyword,
          category,
          signal: controller.signal,
        });

        if (!controller.signal.aborted && currentId === requestId.current) {
          setResults(
            Array.from(
              new Map(places.map((place) => [place.id, place])).values(),
            ),
          );
        }
      } catch (cause) {
        if (!controller.signal.aborted && currentId === requestId.current) {
          setLoadError(
            cause instanceof Error
              ? cause.message
              : "장소를 불러오지 못했어요.",
          );
        }
      } finally {
        if (!controller.signal.aborted && currentId === requestId.current) {
          setLoading(false);
        }
      }
    });

    return () => controller.abort();
  }, [open, tab, region, keyword, category, retryKey]);

  // animationend가 발생하지 않는 환경의 닫기 보완
  useEffect(() => {
    if (open) return;

    const timer = window.setTimeout(onExited, 350);
    return () => window.clearTimeout(timer);
  }, [open, onExited]);

  const savedIds = new Set(savedPlaces.map((place) => place.id));
  const existingIds = new Set(existingPlaceIds);
  const selectedIds = new Set(selected.map((place) => place.id));

  const visibleSavedPlaces = savedPlaces.filter((place) => {
    const matchesCategory = !category || place.category === category;
    const text = savedInput.trim().toLocaleLowerCase();
    const matchesText =
      !text ||
      `${place.name} ${place.address}`.toLocaleLowerCase().includes(text);

    return matchesCategory && matchesText;
  });

  const visiblePlaces = tab === "saved" ? visibleSavedPlaces : results;
  const addableSelected = selected.filter(
    (place) => !existingIds.has(place.id),
  );

  const isLoading = tab === "search" && loading;
  const displayedError = error || (tab === "search" ? loadError : "");

  const heading =
    tab === "saved"
      ? "저장해 둔 장소"
      : keyword
        ? "검색 결과"
        : `${region}에서 가볼 만한 곳`;

  const description =
    tab === "saved"
      ? "마음에 담아 둔 곳을 이번 일정에 추가해 보세요."
      : keyword
        ? `“${keyword}” · ${results.length}개 장소`
        : "여행 지역을 기준으로 보여드려요.";

  function changeTab(next: Tab) {
    setTab(next);
    setError("");
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (tab === "search") {
      setKeyword(searchInput.trim());
      setRetryKey((value) => value + 1);
      setLoading(true);
      setLoadError("");
    }
  }

  function clearSearch() {
    if (tab === "saved") {
      setSavedInput("");
      return;
    }

    setSearchInput("");

    if (keyword) {
      setKeyword("");
      setLoading(true);
      setLoadError("");
    }
  }

  function toggleSelection(place: Place) {
    if (existingIds.has(place.id) || submitting) return;

    if (!selectedIds.has(place.id)) setActivePlaceId(place.id);
    setSelected((current) =>
      current.some((item) => item.id === place.id)
        ? current.filter((item) => item.id !== place.id)
        : [...current, place],
    );
  }

  async function toggleSave(place: Place) {
    if (saveLocks.current.has(place.id)) return;

    saveLocks.current.add(place.id);
    setSavingIds((current) => [...current, place.id]);
    setError("");

    try {
      await onToggleSave(place, !savedIds.has(place.id));
    } catch (cause) {
      if (aliveRef.current) {
        setError(
          cause instanceof Error
            ? cause.message
            : "장소 저장 상태를 변경하지 못했어요.",
        );
      }
    } finally {
      saveLocks.current.delete(place.id);

      if (aliveRef.current) {
        setSavingIds((current) => current.filter((id) => id !== place.id));
      }
    }
  }

  async function confirm() {
    if (!addableSelected.length || submitLock.current) return;

    if (!defaultTransport.trim()) {
      setError("여행의 기본 교통편을 불러온 뒤 다시 시도해 주세요.");
      return;
    }
    const payload: ScheduledPlace[] = [];
    for (const place of addableSelected) {
      const draft = drafts[place.id] ?? EMPTY_DRAFT;
      const duration = resolveDuration(draft.hours, draft.minutes);
      if (
        duration === null ||
        (draft.startTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.startTime))
      ) {
        setError(
          `${place.name}: 시작 시간 또는 체류 시간을 확인해 주세요. 체류 시간은 1분 이상, 분은 0~59로 입력해 주세요.`,
        );
        setActivePlaceId(place.id);
        setCollapsedIds((current) => current.filter((id) => id !== place.id));
        if (compact) setStep(2);
        return;
      }
      payload.push({
        ...place,
        startTime: draft.startTime,
        stayDurationMinutes: duration,
        transport: draft.transport || defaultTransport,
      });
    }
    submitLock.current = true;
    setSubmitting(true);
    setError("");

    try {
      await onConfirm(payload);

      if (aliveRef.current) onClose();
    } catch (cause) {
      if (aliveRef.current) {
        setError(
          cause instanceof Error
            ? cause.message
            : "일정에 추가하지 못했어요. 다시 시도해 주세요.",
        );
      }
    } finally {
      submitLock.current = false;

      if (aliveRef.current) setSubmitting(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      // 열린 공통 Picker는 usePicker가 먼저 닫도록 유지
      if (
        event.defaultPrevented ||
        (event.target instanceof Element &&
          event.target.closest('[data-present="true"]'))
      )
        return;
      event.preventDefault();
      event.stopPropagation();

      if (!submitting) onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusables = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), [tabindex="0"]',
      ) ?? [],
    ).filter(
      (element) =>
        element.getClientRects().length > 0 && !element.closest("[inert]"),
    );

    const first = focusables[0];
    const last = focusables.at(-1);

    if (!first || !last) {
      event.preventDefault();
      panelRef.current?.focus();
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last ||
        document.activeElement === panelRef.current)
    ) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <S.Overlay
      data-open={open}
      onClick={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <S.Panel
        ref={panelRef}
        className="place-add-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-open={open}
        onKeyDown={handleKeyDown}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && !open) {
            onExited();
          }
        }}
      >
        <div className="sheet-handle" aria-hidden="true" />

        <header className="modal-header">
          {compact && step === 2 && (
            <button
              type="button"
              className="back-button"
              disabled={submitting}
              onClick={() => moveStep(1)}
            >
              <ArrowLeft size={18} aria-hidden="true" />
              장소 선택
            </button>
          )}
          <span className="day-badge">
            {dayLabel} · {dateLabel}
          </span>

          <div className="title-row">
            <h2 id={titleId} tabIndex={-1}>
              {compact
                ? step === 1
                  ? "장소 선택"
                  : "선택한 장소 일정"
                : "어디로 떠나볼까요?"}
            </h2>
            {compact && (
              <span
                className="step-badge"
                aria-label={`총 2단계 중 ${step}단계`}
              >
                {step} / 2
              </span>
            )}
          </div>
          {compact && (
            <p className="step-description">
              {step === 1
                ? "장소를 선택한 뒤 일정을 설정해요."
                : "선택한 장소의 시간과 이동 수단을 정해요."}
            </p>
          )}

          <button
            type="button"
            className="icon-button close-button"
            aria-label="장소 추가 닫기"
            disabled={submitting}
            onClick={onClose}
          >
            <X size={24} aria-hidden="true" />
          </button>
        </header>

        <div className="modal-body" data-step={step}>
          <div className="selection-pane" hidden={compact && step === 2}>
            <div className="controls">
              <div
                className="tabs"
                role="tablist"
                aria-label="장소 찾기 방식"
                onKeyDown={(event) => {
                  if (
                    !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  ) {
                    return;
                  }

                  event.preventDefault();

                  const next =
                    event.key === "Home"
                      ? "search"
                      : event.key === "End"
                        ? "saved"
                        : tab === "search"
                          ? "saved"
                          : "search";

                  changeTab(next);

                  (next === "search"
                    ? searchTabRef
                    : savedTabRef
                  ).current?.focus();
                }}
              >
                <button
                  ref={searchTabRef}
                  id={`${titleId}-search-tab`}
                  type="button"
                  role="tab"
                  aria-selected={tab === "search"}
                  aria-controls={`${titleId}-results`}
                  tabIndex={tab === "search" ? 0 : -1}
                  onClick={() => changeTab("search")}
                >
                  <Search size={21} aria-hidden="true" />
                  장소 검색
                </button>

                <button
                  ref={savedTabRef}
                  id={`${titleId}-saved-tab`}
                  type="button"
                  role="tab"
                  aria-selected={tab === "saved"}
                  aria-controls={`${titleId}-results`}
                  tabIndex={tab === "saved" ? 0 : -1}
                  onClick={() => changeTab("saved")}
                >
                  <Bookmark size={20} aria-hidden="true" />
                  저장한 장소
                  <span className="tab-count">{savedPlaces.length}</span>
                </button>

                <span
                  className="tab-indicator"
                  data-tab={tab}
                  aria-hidden="true"
                />
              </div>

              <form className="search-form" onSubmit={submitSearch}>
                <div className="search-field">
                  <Search size={21} aria-hidden="true" />

                  <input
                    aria-label={
                      tab === "saved"
                        ? "저장한 장소 검색"
                        : "장소명 또는 주소 검색"
                    }
                    placeholder={
                      tab === "saved"
                        ? "저장한 장소에서 검색"
                        : "장소명이나 주소를 검색해 보세요"
                    }
                    value={tab === "saved" ? savedInput : searchInput}
                    onChange={(event) => {
                      if (tab === "saved") {
                        setSavedInput(event.target.value);
                      } else {
                        setSearchInput(event.target.value);
                      }
                    }}
                  />

                  {(tab === "saved" ? savedInput : searchInput) && (
                    <button
                      type="button"
                      className="clear-button icon-button"
                      aria-label="검색어 지우기"
                      onClick={clearSearch}
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {tab === "search" && (
                  <button type="submit" className="primary search-button">
                    검색
                  </button>
                )}
              </form>

              <div className="categories" aria-label="장소 분류">
                {CATEGORIES.map((item) => {
                  const value = item === "전체" ? null : item;

                  return (
                    <button
                      type="button"
                      key={item}
                      aria-pressed={category === value}
                      onClick={() => {
                        setCategory(value);

                        if (tab === "search" && category !== value) {
                          setLoading(true);
                          setLoadError("");
                        }
                      }}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <section
              id={`${titleId}-results`}
              role="tabpanel"
              aria-labelledby={`${titleId}-${tab}-tab`}
              aria-busy={isLoading}
              className="results"
              tabIndex={0}
            >
              <div className="results-heading">
                <h3>{heading}</h3>
                <p>{description}</p>
              </div>

              {isLoading ? (
                <div className="status" role="status">
                  장소를 불러오고 있어요.
                </div>
              ) : loadError && tab === "search" ? (
                <div className="status">
                  <p>장소를 불러오지 못했어요.</p>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setLoading(true);
                      setLoadError("");
                      setRetryKey((value) => value + 1);
                    }}
                  >
                    다시 시도
                  </button>
                </div>
              ) : visiblePlaces.length === 0 ? (
                <div className="status">
                  <MapPin size={30} aria-hidden="true" />
                  <strong>
                    {tab === "saved" && !savedPlaces.length
                      ? "아직 저장한 장소가 없어요."
                      : "조건에 맞는 장소가 없어요."}
                  </strong>
                  <p>
                    {tab === "saved" && !savedPlaces.length
                      ? "장소 검색에서 책갈피를 눌러 저장해 보세요."
                      : "다른 검색어나 분류로 찾아보세요."}
                  </p>
                </div>
              ) : (
                <ul className="place-list">
                  {visiblePlaces.map((place) => {
                    const isSaved = savedIds.has(place.id);
                    const isExisting = existingIds.has(place.id);
                    const isSelected = selectedIds.has(place.id);

                    return (
                      <li
                        key={place.id}
                        className="place-row"
                        data-selected={isSelected && !isExisting}
                      >
                        <PlaceImage place={place} />

                        <div className="place-info">
                          <div className="place-name-line">
                            <button
                              type="button"
                              className="bookmark-button"
                              aria-label={`${place.name} ${
                                isSaved ? "저장 해제" : "저장"
                              }`}
                              aria-pressed={isSaved}
                              disabled={
                                submitting || savingIds.includes(place.id)
                              }
                              onClick={() => void toggleSave(place)}
                            >
                              <Bookmark
                                size={20}
                                fill={isSaved ? "currentColor" : "none"}
                                aria-hidden="true"
                              />
                            </button>

                            <h4>{place.name}</h4>

                            {isSaved && tab === "search" && (
                              <span className="saved-badge">저장한 장소</span>
                            )}
                          </div>

                          <span className="category-badge">
                            {place.category}
                          </span>

                          <p className="address">
                            <MapPin size={16} aria-hidden="true" />
                            <span>{place.address}</span>
                          </p>
                        </div>

                        <button
                          type="button"
                          className="select-button"
                          data-selected={isSelected || isExisting}
                          aria-label={`${place.name} ${
                            isExisting
                              ? "이미 일정에 추가됨"
                              : isSelected
                                ? "선택 해제"
                                : "선택"
                          }`}
                          aria-pressed={isSelected || isExisting}
                          disabled={submitting || isExisting}
                          onClick={() => toggleSelection(place)}
                        >
                          {isSelected || isExisting ? (
                            <Check size={22} aria-hidden="true" />
                          ) : (
                            <Plus size={22} aria-hidden="true" />
                          )}
                        </button>

                        {isExisting && (
                          <span className="existing-label">추가됨</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
          <aside
            className="schedule-pane"
            hidden={compact && step === 1}
            aria-label="선택한 장소 일정"
          >
            {!compact && (
              <div className="schedule-heading">
                <h3>선택한 장소 일정</h3>
                <p>장소별 시간과 이동 수단을 설정해요.</p>
              </div>
            )}
            {!addableSelected.length ? (
              <div className="status">
                <MapPin size={30} aria-hidden="true" />
                <strong>장소를 먼저 선택해 주세요.</strong>
                <p>선택한 장소의 일정을 여기서 설정할 수 있어요.</p>
              </div>
            ) : (
              addableSelected.map((place, index) => {
                const draft = drafts[place.id] ?? EMPTY_DRAFT;
                const activeId = addableSelected.some(
                  (item) => item.id === activePlaceId,
                )
                  ? activePlaceId
                  : addableSelected[0]?.id;
                const expanded =
                  place.id === activeId &&
                  (!compact || !collapsedIds.includes(place.id));
                const duration = resolveDuration(draft.hours, draft.minutes);
                const durationText =
                  duration === null
                    ? "체류 시간 확인 필요"
                    : `체류 ${Math.floor(duration / 60) ? `${Math.floor(duration / 60)}시간` : ""}${duration % 60 ? ` ${duration % 60}분` : ""}`;
                const selectedTransportLabel =
                  transportOptions.find(
                    (option) => option.value === draft.transport,
                  )?.label ||
                  draft.transport ||
                  transportLabel;
                return (
                  <section
                    className="schedule-card"
                    key={place.id}
                    data-expanded={expanded}
                  >
                    <button
                      type="button"
                      className="schedule-card-trigger"
                      aria-expanded={expanded}
                      aria-controls={`${titleId}-settings-${index}`}
                      disabled={submitting}
                      onClick={() => {
                        if (compact) {
                          setActivePlaceId(place.id);
                          setCollapsedIds((current) =>
                            expanded
                              ? [
                                  ...current.filter((id) => id !== place.id),
                                  place.id,
                                ]
                              : current.filter((id) => id !== place.id),
                          );
                        } else setActivePlaceId(place.id);
                      }}
                    >
                      <span className="place-number">{index + 1}</span>
                      <PlaceImage place={place} />
                      <span className="schedule-card-info">
                        <strong>{place.name}</strong>
                        <span className="schedule-address">
                          {place.address}
                        </span>
                        {!expanded && (
                          <span className="schedule-summary">
                            {draft.startTime || "시작 시간 미설정"} ·{" "}
                            {durationText} · {selectedTransportLabel}
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        size={20}
                        className="accordion-chevron"
                        aria-hidden="true"
                      />
                    </button>
                    {expanded && (
                      <div
                        className="schedule-fields"
                        id={`${titleId}-settings-${index}`}
                      >
                        <div className="schedule-field">
                          <ScheduleTimePicker
                            value={draft.startTime}
                            onChange={(value) =>
                              updateDraft(place.id, { startTime: value })
                            }
                            disabled={submitting}
                          />
                        </div>
                        <div className="schedule-field">
                          <span
                            className="field-label"
                            id={`${titleId}-duration-label-${index}`}
                          >
                            예정 체류 시간
                          </span>
                          <div
                            className="duration-inputs"
                            role="group"
                            aria-labelledby={`${titleId}-duration-label-${index}`}
                            aria-describedby={`${titleId}-duration-help-${index}`}
                          >
                            <label>
                              <input
                                type="number"
                                inputMode="numeric"
                                min={0}
                                max={167}
                                step={1}
                                placeholder="시간"
                                aria-label={`${place.name} 체류 시간 (시간)`}
                                disabled={submitting}
                                value={draft.hours}
                                onChange={(event) =>
                                  updateDraft(place.id, {
                                    hours: event.target.value,
                                  })
                                }
                              />
                              <span>시간</span>
                            </label>
                            <label>
                              <input
                                type="number"
                                inputMode="numeric"
                                min={0}
                                max={59}
                                step={1}
                                placeholder="분"
                                aria-label={`${place.name} 체류 시간 (분)`}
                                disabled={submitting}
                                value={draft.minutes}
                                onChange={(event) =>
                                  updateDraft(place.id, {
                                    minutes: event.target.value,
                                  })
                                }
                              />
                              <span>분</span>
                            </label>
                          </div>
                          <p
                            className="field-help"
                            id={`${titleId}-duration-help-${index}`}
                          >
                            입력하지 않으면 <strong>1시간</strong>으로 설정돼요.
                          </p>
                        </div>
                        <div className="schedule-field">
                          <label
                            className="field-label"
                            htmlFor={`${titleId}-transport-${index}`}
                          >
                            이용 예정 교통
                          </label>
                          <div className="transport-select">
                            <select
                              id={`${titleId}-transport-${index}`}
                              value={draft.transport}
                              disabled={submitting}
                              aria-describedby={`${titleId}-transport-help-${index}`}
                              onChange={(event) =>
                                updateDraft(place.id, {
                                  transport: event.target.value,
                                })
                              }
                            >
                              <option value="">교통편 선택</option>
                              {transportOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown size={18} aria-hidden="true" />
                          </div>
                          <p
                            className="field-help"
                            id={`${titleId}-transport-help-${index}`}
                          >
                            선택하지 않으면{" "}
                            <strong>여행 만들기에서 설정한 교통편</strong>이
                            적용돼요.
                          </p>
                          <div className="default-transport">
                            <Car size={18} aria-hidden="true" />
                            여행 기본 교통 · {transportLabel}
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })
            )}
          </aside>
        </div>
        <footer className="modal-footer">
          {displayedError && (
            <p className="error-message" role="alert">
              {displayedError}
            </p>
          )}

          <div className="footer-content">
            <div className="selection-summary" aria-live="polite">
              <strong>{addableSelected.length}개 장소 선택</strong>
              <p>선택한 장소가 {dayLabel} 일정에 추가돼요.</p>
            </div>

            <div className="footer-actions">
              <button
                type="button"
                className="secondary"
                disabled={submitting}
                onClick={() =>
                  compact && step === 2 ? moveStep(1) : onClose()
                }
              >
                {compact && step === 2 ? "이전" : "취소"}
              </button>

              <button
                type="button"
                className="primary"
                disabled={!addableSelected.length || submitting}
                onClick={() => {
                  if (compact && step === 1) moveStep(2);
                  else void confirm();
                }}
              >
                {submitting ? (
                  "추가 중..."
                ) : compact && step === 1 ? (
                  <>
                    다음 · 일정 설정
                    <ArrowRight size={18} aria-hidden="true" />
                  </>
                ) : (
                  "일정에 추가"
                )}
              </button>
            </div>
          </div>
        </footer>
      </S.Panel>
    </S.Overlay>
  );
}

function PlaceImage({ place }: { place: Place }) {
  const [failedSource, setFailedSource] = useState<string | undefined>();

  return (
    <div className="place-image">
      {place.image && failedSource !== place.image ? (
        <img
          src={place.image}
          alt=""
          loading="lazy"
          onError={() => setFailedSource(place.image)}
        />
      ) : (
        <ImageOff size={24} aria-hidden="true" />
      )}
    </div>
  );
}

function subscribeCompact(callback: () => void) {
  const query = window.matchMedia("(max-width: 1023px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function getCompact() {
  return window.matchMedia("(max-width: 1023px)").matches;
}
function resolveDuration(hours: string, minutes: string): number | null {
  if (hours === "" && minutes === "") return 60;
  if (
    (hours !== "" && !/^\d+$/.test(hours)) ||
    (minutes !== "" && !/^\d+$/.test(minutes))
  )
    return null;
  const h = Number(hours || 0),
    m = Number(minutes || 0);
  const total = h * 60 + m;
  return Number.isInteger(h) &&
    Number.isInteger(m) &&
    h <= 167 &&
    m <= 59 &&
    total > 0
    ? total
    : null;
}

/** 공통 TimePicker는 수정하지 않고 모달 안의 팝업 위치만 보정 */
function ScheduleTimePicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrapper = root.current;
    if (!wrapper) return;
    let frame = 0;
    function position() {
      const popup = wrapper?.querySelector<HTMLElement>(".picker-popup");
      const trigger = wrapper?.querySelector<HTMLElement>(".picker-trigger");
      const panel = wrapper?.closest<HTMLElement>(
        '[role="dialog"].place-add-panel',
      );
      if (!popup || !trigger || !panel) return;
      const t = trigger.getBoundingClientRect(),
        p = panel.getBoundingClientRect();
      // modalAnimation의 transform에 의해 fixed 팝업은 Panel 기준으로 배치
      const width = Math.min(320, p.width - 32);
      popup.style.position = "fixed";
      popup.style.width = `${width}px`;
      popup.style.maxWidth = "none";
      popup.style.right = "auto";
      popup.style.bottom = "auto";
      popup.style.left = `${Math.max(16, Math.min(t.left - p.left, p.width - width - 16))}px`;
      popup.style.maxHeight = `${Math.max(100, p.height - 40)}px`;
      popup.style.overflowY = "auto";
      popup.style.zIndex = "30";
      const height = popup.offsetHeight;
      const below = t.bottom - p.top + 8;
      const top =
        below + height <= p.height - 16
          ? below
          : Math.max(16, t.top - p.top - height - 8);
      popup.style.top = `${Math.min(top, Math.max(16, p.height - height - 16))}px`;
    }
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(position);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(wrapper, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-open", "data-present"],
    });
    window.addEventListener("resize", schedule);
    document.addEventListener("scroll", schedule, true);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("scroll", schedule, true);
    };
  }, []);
  return (
    <div ref={root} className="schedule-time-picker">
      <TimePicker
        label="일정 시작 시간"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placement="top"
      />
    </div>
  );
}
