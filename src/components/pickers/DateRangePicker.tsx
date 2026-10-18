import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Minus,
  X,
} from "lucide-react";
import { DateRangePickerStyle, DateRangeModalStyle } from "./PickerStyle";

export type DateRangeValue = { startDate: string; endDate: string };

export type DateRangePickerProps = {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  label?: string;
  startLabel?: string;
  endLabel?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
  startName?: string;
  endName?: string;
};

const subscribeViewport = (notify: () => void) => {
  const query = window.matchMedia("(max-width: 767px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

const getMobile = () => window.matchMedia("(max-width: 767px)").matches;
const getServerMobile = () => false;

type Field = "start" | "end";

const pad = (n: number) => String(n).padStart(2, "0");

const toValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parse = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return toValue(date) === value ? date : null;
};

const display = (value: string) =>
  value ? value.replaceAll("-", ". ") : "날짜 선택";

const short = (value: string) => {
  const date = parse(value);
  return date ? `${date.getMonth() + 1}월 ${date.getDate()}일` : "";
};

const nights = (start: string, end: string) =>
  (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) /
  86400000;

export default function DateRangePicker({
  value,
  onChange,
  label = "여행 날짜",
  startLabel = "시작일",
  endLabel = "종료일",
  min = toValue(new Date()),
  max,
  disabled = false,
  className,
  startName,
  endName,
}: DateRangePickerProps) {
  const id = useId();

  const mobile = useSyncExternalStore(
    subscribeViewport,
    getMobile,
    getServerMobile,
  );

  const [requestedOpen, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<Field>("start");
  const [draft, setDraft] = useState<DateRangeValue>({
    startDate: "",
    endDate: "",
  });
  const [hoverDate, setHoverDate] = useState("");

  const [baseMonth, setBaseMonth] = useState(() => {
    const date = parse(value.startDate) ?? parse(min) ?? new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDialogElement>(null);

  const open = requestedOpen && !disabled;

  const committedComplete = Boolean(
    parse(value.startDate) &&
    parse(value.endDate) &&
    value.endDate >= value.startDate,
  );

  const committedNights = committedComplete
    ? nights(value.startDate, value.endDate)
    : null;

  const allowed = (candidate: string) =>
    (!min || candidate >= min) && (!max || candidate <= max);

  const complete = Boolean(
    parse(draft.startDate) &&
    parse(draft.endDate) &&
    draft.endDate >= draft.startDate &&
    allowed(draft.startDate) &&
    allowed(draft.endDate),
  );

  const duration = complete ? nights(draft.startDate, draft.endDate) : null;

  const rangeEnd =
    draft.endDate ||
    (active === "end" && hoverDate >= draft.startDate ? hoverDate : "");

  const close = () => {
    setOpen(false);
    setHoverDate("");
  };

  const openPanel = () => {
    const startDate = parse(value.startDate) ? value.startDate : "";

    const endDate =
      startDate && parse(value.endDate) && value.endDate >= startDate
        ? value.endDate
        : "";

    setDraft({ startDate, endDate });

    const date = parse(startDate) ?? parse(min) ?? new Date();

    setBaseMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setActive(startDate && !endDate ? "end" : "start");
    setHoverDate("");
    setMounted(true);
    setOpen(true);
  };

  const choose = (candidate: string) => {
    if (active === "start" || !draft.startDate || candidate < draft.startDate) {
      setDraft({ startDate: candidate, endDate: "" });
      setActive("end");
    } else {
      setDraft((previous) => ({ ...previous, endDate: candidate }));
      setActive("start");
    }

    setHoverDate("");
  };

  const move = (step: number) =>
    setBaseMonth(
      (previous) =>
        new Date(previous.getFullYear(), previous.getMonth() + step, 1),
    );

  const apply = () => {
    if (!complete) return;

    onChange({ ...draft });
    close();
  };

  useLayoutEffect(() => {
    if (!mounted) return;

    const dialog = popupRef.current;
    const trigger = triggerRef.current;

    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = previousOverflow;

    if (!dialog.open) dialog.showModal();

    dialog
      .querySelector<HTMLButtonElement>(".range-close")
      ?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;

      if (trigger?.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [mounted]);

  return (
    <DateRangePickerStyle className={className}>
      <span className="range-label" id={`${id}-label`}>
        {label}
      </span>

      <button
        ref={triggerRef}
        type="button"
        className="range-trigger"
        disabled={disabled}
        data-selected={committedComplete}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={mounted ? `${id}-popup` : undefined}
        onClick={openPanel}
      >
        <CalendarDays aria-hidden="true" />

        <span className="range-value" id={`${id}-value`}>
          {committedComplete ? (
            <>
              <span className="range-start-date">
                {display(value.startDate)}
              </span>
              <span className="range-end-date">
                <Minus size={1} strokeWidth={1.3} /> {display(value.endDate)}
              </span>
            </>
          ) : value.startDate ? (
            <>
              <span className="range-start-date">
                {display(value.startDate)}
              </span>
              <span className="range-end-date">- 종료일 선택</span>
            </>
          ) : (
            "여행 날짜를 선택해주세요"
          )}
        </span>
        {committedNights !== null && (
          <span className="range-trigger-duration">
            {committedNights === 0
              ? "당일 여행"
              : `${committedNights}박 ${committedNights + 1}일`}
          </span>
        )}

        <ChevronRight className="range-chevron" aria-hidden="true" />
      </button>

      {startName && (
        <input
          type="hidden"
          name={startName}
          value={value.startDate}
          disabled={disabled}
        />
      )}

      {endName && (
        <input
          type="hidden"
          name={endName}
          value={value.endDate}
          disabled={disabled}
        />
      )}

      {mounted && (
        <DateRangeModalStyle
          ref={popupRef}
          id={`${id}-popup`}
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-guide`}
          aria-modal="true"
          tabIndex={-1}
          data-open={open}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          // onKeyDown={(event) => {
          //   if (event.key === "Escape") {
          //     event.preventDefault();
          //     close();
          //   }

          //   if (event.key === "Tab") {
          //     const buttons = Array.from(
          //       event.currentTarget.querySelectorAll<HTMLButtonElement>(
          //         "button:not(:disabled)",
          //       ),
          //     );

          //     const first = buttons[0];
          //     const last = buttons[buttons.length - 1];

          //     if (event.shiftKey && document.activeElement === first) {
          //       event.preventDefault();
          //       last?.focus();
          //     } else if (!event.shiftKey && document.activeElement === last) {
          //       event.preventDefault();
          //       first?.focus();
          //     }
          //   }

          //   const target = event.target;

          //   if (
          //     !(target instanceof HTMLButtonElement) ||
          //     !target.matches(".range-day")
          //   ) {
          //     return;
          //   }

          //   const steps: Record<string, number> = {
          //     ArrowLeft: -1,
          //     ArrowRight: 1,
          //     ArrowUp: -7,
          //     ArrowDown: 7,
          //   };

          //   const step = steps[event.key];

          //   if (!step) return;

          //   event.preventDefault();

          //   const current = parse(target.dataset.date ?? "");

          //   if (!current) return;

          //   current.setDate(current.getDate() + step);

          //   const next = toValue(current);

          //   if (!allowed(next)) return;

          //   const dialog = event.currentTarget;

          //   const focusDay = () =>
          //     dialog
          //       .querySelector<HTMLButtonElement>(`[data-date="${next}"]`)
          //       ?.focus();

          //   if (dialog.querySelector(`[data-date="${next}"]`)) {
          //     focusDay();
          //   } else {
          //     setBaseMonth(
          //       new Date(current.getFullYear(), current.getMonth(), 1),
          //     );
          //     requestAnimationFrame(focusDay);
          //   }
          // }}
          onKeyDown={(event) => {
            if (
              !open ||
              event.nativeEvent.isComposing ||
              event.keyCode === 229
            ) {
              return;
            }

            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              close();
              return;
            }

            if (event.key === "Enter" && complete) {
              event.preventDefault();
              event.stopPropagation();

              if (!event.repeat) {
                apply();
              }

              return;
            }

            const dialog = event.currentTarget;

            if (event.key === "Tab") {
              const buttons = Array.from(
                dialog.querySelectorAll<HTMLButtonElement>(
                  "button:not(:disabled)",
                ),
              ).filter(
                (button) =>
                  button.getClientRects().length > 0 &&
                  !button.closest("[inert]"),
              );

              const first = buttons[0];
              const last = buttons[buttons.length - 1];

              if (!first || !last) {
                event.preventDefault();
                dialog.focus();
                return;
              }

              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
              } else if (
                !event.shiftKey &&
                (document.activeElement === last ||
                  document.activeElement === dialog)
              ) {
                event.preventDefault();
                first.focus();
              }

              return;
            }

            const target = event.target;

            if (
              !(target instanceof HTMLButtonElement) ||
              !target.matches(".range-day")
            ) {
              return;
            }

            const steps: Record<string, number> = {
              ArrowLeft: -1,
              ArrowRight: 1,
              ArrowUp: -7,
              ArrowDown: 7,
            };

            const step = steps[event.key];

            if (!step) return;

            event.preventDefault();
            event.stopPropagation();

            const current = parse(target.dataset.date ?? "");

            if (!current) return;

            current.setDate(current.getDate() + step);

            const next = toValue(current);

            if (!allowed(next)) return;

            const focusDay = () => {
              dialog
                .querySelector<HTMLButtonElement>(
                  `.range-day[data-date="${next}"]:not(:disabled)`,
                )
                ?.focus({ preventScroll: true });
            };

            if (dialog.querySelector(`.range-day[data-date="${next}"]`)) {
              focusDay();
            } else {
              setBaseMonth(
                new Date(current.getFullYear(), current.getMonth(), 1),
              );
              requestAnimationFrame(focusDay);
            }
          }}
        >
          <div
            className="range-dialog-content"
            data-open={open}
            inert={!open}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget && !open) {
                setMounted(false);
              }
            }}
          >
            <div className="range-handle" aria-hidden="true" />

            <div className="range-heading">
              <h2 id={`${id}-title`}>여행 날짜 선택</h2>

              <button
                className="range-close"
                type="button"
                aria-label="날짜 선택 닫기"
                onClick={close}
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <p className="range-guide" id={`${id}-guide`} aria-live="polite">
              {active === "start" ? startLabel : endLabel}을 선택해주세요
            </p>

            <div className="range-selection">
              <button
                type="button"
                className="range-date-summary"
                aria-pressed={active === "start"}
                onClick={() => setActive("start")}
              >
                <span>{startLabel}</span>
                <strong>
                  {draft.startDate ? short(draft.startDate) : "선택"}
                </strong>
              </button>

              <span aria-hidden="true">→</span>

              <button
                type="button"
                className="range-date-summary"
                aria-pressed={active === "end"}
                disabled={!draft.startDate}
                onClick={() => setActive("end")}
              >
                <span>{endLabel}</span>
                <strong>{draft.endDate ? short(draft.endDate) : "선택"}</strong>
              </button>

              <span className="range-duration">
                {duration === null
                  ? "기간 선택"
                  : duration === 0
                    ? "당일 여행"
                    : `${duration}박 ${duration + 1}일`}
              </span>
            </div>

            <div className="range-months">
              {(mobile ? [0] : [0, 1]).map((offset) => {
                const date = new Date(
                  baseMonth.getFullYear(),
                  baseMonth.getMonth() + offset,
                  1,
                );

                const year = date.getFullYear();
                const month = date.getMonth();
                const firstDay = date.getDay();
                const count = new Date(year, month + 1, 0).getDate();

                return (
                  <section key={offset} aria-label={`${year}년 ${month + 1}월`}>
                    <div className="range-month-header">
                      {offset === 0 ? (
                        <button
                          className="range-nav"
                          type="button"
                          aria-label="이전 달"
                          onClick={() => move(-1)}
                        >
                          <ChevronLeft size={20} aria-hidden="true" />
                        </button>
                      ) : (
                        <span className="range-nav-space" />
                      )}

                      <strong className="range-month-title">
                        {year}년 {month + 1}월
                      </strong>

                      {mobile || offset === 1 ? (
                        <button
                          className="range-nav"
                          type="button"
                          aria-label="다음 달"
                          onClick={() => move(1)}
                        >
                          <ChevronRight size={20} aria-hidden="true" />
                        </button>
                      ) : (
                        <span className="range-nav-space" />
                      )}
                    </div>

                    <div className="range-week" aria-hidden="true">
                      {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>

                    <div
                      className="range-days"
                      onPointerLeave={() => setHoverDate("")}
                    >
                      {Array.from(
                        {
                          length: mobile
                            ? Math.ceil((firstDay + count) / 7) * 7
                            : 42,
                        },
                        (_, index) => {
                          const day = index - firstDay + 1;

                          if (day < 1 || day > count) {
                            return <span key={index} aria-hidden="true" />;
                          }

                          const candidate = toValue(new Date(year, month, day));

                          const inRange = Boolean(
                            draft.startDate &&
                            rangeEnd &&
                            candidate > draft.startDate &&
                            candidate < rangeEnd,
                          );

                          const hasRange = Boolean(
                            draft.startDate && rangeEnd > draft.startDate,
                          );

                          return (
                            <button
                              key={index}
                              className="range-day"
                              type="button"
                              data-date={candidate}
                              aria-label={`${year}년 ${month + 1}월 ${day}일`}
                              aria-pressed={
                                candidate === draft.startDate ||
                                candidate === draft.endDate
                              }
                              disabled={!allowed(candidate)}
                              data-in-range={inRange}
                              data-range-start={
                                hasRange && candidate === draft.startDate
                              }
                              data-range-end={
                                hasRange && candidate === rangeEnd
                              }
                              data-preview={
                                !draft.endDate && candidate === rangeEnd
                              }
                              onPointerEnter={() => setHoverDate(candidate)}
                              onClick={() => choose(candidate)}
                            >
                              <span>{day}</span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="range-bottom">
              <button
                type="button"
                className="range-reset"
                onClick={() => {
                  setDraft({ startDate: "", endDate: "" });
                  setHoverDate("");
                  setActive("start");
                }}
              >
                초기화
              </button>

              <button
                type="button"
                className="range-apply"
                disabled={!complete}
                onClick={apply}
              >
                날짜 선택 완료
              </button>
            </div>
          </div>
        </DateRangeModalStyle>
      )}
    </DateRangePickerStyle>
  );
}
