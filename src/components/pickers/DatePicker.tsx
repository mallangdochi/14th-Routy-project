import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, SyntheticEvent } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { PickerStyle } from "./PickerStyle";
import { usePicker, type Placement } from "./usePicker";

const teal = "#0A414B";
const paper = "#FFFEFA";

const sheetSlideUp = keyframes({
  from: { transform: "translateY(100%)", opacity: 0.95 },
  to: { transform: "translateY(0)", opacity: 1 },
});

const ModalDialog = styled.dialog({
  position: "fixed",
  width: "min(420px, calc(100vw - 32px))",
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "calc(100dvh - 36px)",
  margin: "auto",
  padding: "22px",
  border: "none",
  borderRadius: "16px",
  boxShadow: "0 18px 55px rgba(0, 0, 0, 0.25)",
  backgroundColor: paper,
  color: teal,
  fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
  fontSize: "16px",
  overflowY: "auto",
  boxSizing: "border-box",
  "&::backdrop": { backgroundColor: "rgba(10, 35, 39, 0.52)" },
  "&, & *": { boxSizing: "border-box" },
  "@media (max-width: 767px)": {
    top: "auto",
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    maxWidth: "100%",
    maxHeight: "min(82dvh, 720px)",
    margin: 0,
    padding: "12px 20px calc(20px + env(safe-area-inset-bottom, 0px))",
    borderRadius: "22px 22px 0 0",
    boxShadow: "0 -10px 32px rgba(0, 0, 0, 0.16)",
    animation: `${sheetSlideUp} 260ms ease-out both`,
    overscrollBehavior: "contain",
  },
  "@media (max-width: 767px) and (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});

const BottomSheetHandle = styled.div({
  display: "none",
  "@media (max-width: 767px)": {
    display: "block",
    width: "48px",
    height: "5px",
    margin: "0 auto 18px",
    borderRadius: "999px",
    backgroundColor: "#B9C7C9",
    touchAction: "pan-y",
  },
});

const ModalTop = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "16px",
  fontSize: "21px",
  fontWeight: 800,
});

const ModalClose = styled.button({
  display: "grid",
  placeItems: "center",
  width: "38px",
  height: "38px",
  padding: 0,
  border: "none",
  borderRadius: "50%",
  backgroundColor: "transparent",
  color: teal,
  cursor: "pointer",
  "&:hover": { backgroundColor: "#E7F3F1" },
});

const ModalHeader = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "6px",
  marginBottom: "16px",
  minHeight: "42px",
});

const ModalHeading = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontSize: "20px",
  fontWeight: 800,
  "& button": {
    padding: "6px 3px",
    border: "none",
    backgroundColor: "transparent",
    color: teal,
    fontFamily: "inherit",
    fontSize: "20px",
    fontWeight: 800,
    cursor: "pointer",
  },
});

const ModalNav = styled.button({
  display: "grid",
  placeItems: "center",
  width: "38px",
  height: "38px",
  padding: 0,
  border: "1px solid #DCE5E6",
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  color: teal,
  cursor: "pointer",
  "&:disabled": { opacity: 0.3, cursor: "not-allowed" },
});

const ModalGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  gap: "4px",
});

const ModalWeekday = styled.span({
  display: "grid",
  placeItems: "center",
  height: "34px",
  color: "#627D81",
  fontSize: "15px",
  fontWeight: 700,
});

const ModalDay = styled.button({
  display: "grid",
  placeItems: "center",
  width: "100%",
  aspectRatio: "1 / 1",
  minHeight: "34px",
  padding: 0,
  border: "none",
  borderRadius: "8px",
  backgroundColor: "transparent",
  color: teal,
  fontFamily: "inherit",
  fontSize: "16px",
  cursor: "pointer",
  "&:hover:not(:disabled)": { backgroundColor: "#E6F3F1" },
  "&[data-selected='true']": {
    backgroundColor: teal,
    color: "#FFFFFF",
    fontWeight: 800,
  },
  "&:disabled": { color: "#B7C6C8", cursor: "not-allowed" },
});

const ModalOptions = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "10px",
});

const ModalOption = styled.button({
  minHeight: "48px",
  padding: "5px",
  border: "1px solid #DCE5E6",
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  color: teal,
  fontFamily: "inherit",
  fontSize: "16px",
  cursor: "pointer",
  "&[data-selected='true']": { backgroundColor: teal, color: "#FFFFFF" },
  "&:hover:not(:disabled)": { borderColor: teal },
  "&:disabled": { opacity: 0.35, cursor: "not-allowed" },
});

const ModalFooter = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "16px",
  paddingTop: "12px",
  borderTop: "1px solid #E5EDEC",
  "& button": {
    padding: "6px",
    border: "none",
    backgroundColor: "transparent",
    color: teal,
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
  },
  "& span": { color: "#778D90", fontSize: "15px" },
});

export type DatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placement?: Placement;
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  modal?: boolean;
};
const pad = (n: number) => String(n).padStart(2, "0");
const dateValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const parse = (value: string) => {
  const [y, m, d = 1] = value.split("-").map(Number);
  return y >= 100 && m >= 1 && m <= 12 && d >= 1 && d <= 31
    ? new Date(y, m - 1, d)
    : new Date();
};
function StandardDatePicker({
  label,
  value,
  onChange,
  placement = "bottom",
  min = "1900-01-01",
  max = dateValue(new Date()),
  disabled = false,
  className,
  name,
}: DatePickerProps) {
  const id = useId();
  const {
    open,
    mounted,
    rootRef,
    triggerRef,
    popupRef,
    close,
    toggle: togglePicker,
    handleBlur,
    handleKeyDown,
  } = usePicker(disabled);
  const today = dateValue(new Date());
  const minDate = parse(min);
  const maxDate = parse(max);
  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();
  const clamp = (date: string) => (date < min ? min : date > max ? max : date);
  const initial = parse(clamp(value || today));
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());
  const [view, setView] = useState<"day" | "month" | "year">("day");
  const [yearStart, setYearStart] = useState(
    initial.getFullYear() - (initial.getFullYear() % 12),
  );
  const [draft, setDraft] = useState(value);
  const allowed = (candidate: string) => candidate >= min && candidate <= max;
  const monthAllowed = (y: number, m: number) =>
    dateValue(new Date(y, m + 1, 0)) >= min &&
    dateValue(new Date(y, m, 1)) <= max;
  const choose = (candidate: string) => {
    if (!allowed(candidate)) return;
    setDraft(candidate);
    const date = parse(candidate);
    setYear(date.getFullYear());
    setMonth(date.getMonth());
  };
  const confirm = () => {
    if (draft && !allowed(draft)) return;
    onChange(draft);
    close(true);
  };
  const toggle = () => {
    if (!open) {
      const current = parse(clamp(value || today));
      setYear(current.getFullYear());
      setMonth(current.getMonth());
      setYearStart(current.getFullYear() - (current.getFullYear() % 12));
      setDraft(value);
      setView("day");
    }
    togglePicker();
  };
  const changeYear = (nextYear: number) => {
    const first = nextYear === minYear ? minDate.getMonth() : 0;
    const last = nextYear === maxYear ? maxDate.getMonth() : 11;
    setYear(nextYear);
    setMonth(Math.min(last, Math.max(first, month)));
    setView("day");
  };
  const canMove = (step: number) => {
    if (view === "year")
      return step < 0 ? yearStart > minYear : yearStart + 11 < maxYear;
    if (view === "month")
      return year + step >= minYear && year + step <= maxYear;
    const next = new Date(year, month + step, 1);
    return monthAllowed(next.getFullYear(), next.getMonth());
  };
  const move = (step: number) => {
    if (!canMove(step)) return;
    if (view === "year") {
      setYearStart(yearStart + step * 12);
    } else if (view === "month") {
      changeYear(year + step);
      setView("month");
    } else {
      const next = new Date(year, month + step, 1);
      setYear(next.getFullYear());
      setMonth(next.getMonth());
    }
  };
  const offset = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  return (
    <PickerStyle
      ref={rootRef}
      className={className}
      data-open={open}
      data-present={mounted}
      data-placement={placement}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <span id={`${id}-label`} className="picker-label">
        {label}
      </span>
      {name && (
        <input type="hidden" name={name} value={value} disabled={disabled} />
      )}
      <button
        ref={triggerRef}
        type="button"
        className="picker-trigger"
        disabled={disabled}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-expanded={open}
        aria-controls={open ? `${id}-popup` : undefined}
        aria-haspopup="dialog"
        onClick={toggle}
      >
        <span id={`${id}-value`}>
          {value ? value.replaceAll("-", ". ") : "선택해주세요"}
        </span>
        <CalendarDays aria-hidden="true" />
      </button>
      {mounted && (
        <div
          data-open={open}
          inert={!open}
          aria-hidden={!open}
          ref={popupRef}
          className="picker-popup"
          id={`${id}-popup`}
          role="dialog"
          aria-labelledby={`${id}-label`}
        >
          <div className="picker-header">
            {/* <button
              type="button"
              className="picker-nav"
              aria-label={view === "year" ? "이전 12년" : view === "month" ? "이전 연도" : "이전 달"}
              disabled={!canMove(-1)}
              onClick={() => move(-1)}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button> */}

            {view !== "month" && (
              <button
                type="button"
                className="picker-nav"
                aria-label={view === "year" ? "이전 12년" : "이전 달"}
                disabled={!canMove(-1)}
                onClick={() => move(-1)}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
            )}
            <div className="picker-date-heading">
              <button
                type="button"
                className="picker-heading"
                aria-label="연도 선택"
                aria-expanded={view === "year"}
                onClick={() => {
                  setYearStart(year - (year % 12));
                  setView(view === "year" ? "day" : "year");
                }}
              >
                {year}년
              </button>
              <button
                type="button"
                className="picker-heading"
                aria-label="월 선택"
                aria-expanded={view === "month"}
                onClick={() => setView(view === "month" ? "day" : "month")}
              >
                {month + 1}월
              </button>
            </div>
            {/* <button
              type="button"
              className="picker-nav"
              aria-label={
                view === "year"
                  ? "다음 12년"
                  : view === "month"
                    ? "다음 연도"
                    : "다음 달"
              }
              disabled={!canMove(1)}
              onClick={() => move(1)}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button> */}
            {view !== "month" && (
              <button
                type="button"
                className="picker-nav"
                aria-label={view === "year" ? "다음 12년" : "다음 달"}
                disabled={!canMove(1)}
                onClick={() => move(1)}
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            )}
          </div>
          {view === "year" ? (
            <>
              <div className="picker-range" aria-live="polite">
                {yearStart}년 – {yearStart + 11}년
              </div>
              <div className="picker-options">
                {Array.from({ length: 12 }, (_, i) => {
                  const option = yearStart + i;
                  return (
                    <button
                      key={option}
                      type="button"
                      className="picker-option"
                      aria-pressed={option === year}
                      disabled={option < minYear || option > maxYear}
                      onClick={() => changeYear(option)}
                    >
                      {option}년
                    </button>
                  );
                })}
              </div>
            </>
          ) : view === "month" ? (
            <div className="picker-options">
              {Array.from({ length: 12 }, (_, option) => (
                <button
                  key={option}
                  type="button"
                  className="picker-option"
                  aria-pressed={option === month}
                  disabled={!monthAllowed(year, option)}
                  onClick={() => {
                    setMonth(option);
                    setView("day");
                  }}
                >
                  {option + 1}월
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="picker-week" aria-hidden="true">
                {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="picker-days">
                {Array.from(
                  { length: Math.ceil((offset + count) / 7) * 7 },
                  (_, i) => {
                    const date = new Date(year, month, i - offset + 1);
                    const candidate = dateValue(date);
                    return (
                      <button
                        key={candidate}
                        type="button"
                        className={`picker-day${date.getMonth() !== month ? " is-outside" : ""}${candidate === today ? " is-today" : ""}`}
                        aria-label={`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`}
                        aria-current={candidate === today ? "date" : undefined}
                        aria-pressed={candidate === draft}
                        disabled={!allowed(candidate)}
                        onClick={() => choose(candidate)}
                      >
                        {date.getDate()}
                      </button>
                    );
                  },
                )}
              </div>
            </>
          )}
          {view === "day" && (
            <div className="picker-footer picker-date-footer">
              <span aria-live="polite">
                {draft ? draft.replaceAll("-", ". ") : "날짜를 선택해주세요"}
              </span>
              <div className="picker-date-actions">
                <button
                  type="button"
                  className="picker-text-button"
                  onClick={() => {
                    const current = parse(today);

                    setDraft("");
                    onChange("");
                    setYear(current.getFullYear());
                    setMonth(current.getMonth());
                    setYearStart(
                      current.getFullYear() - (current.getFullYear() % 12),
                    );
                    setView("day");
                  }}
                >
                  초기화
                </button>
                <button
                  type="button"
                  className="picker-confirm picker-date-confirm"
                  disabled={
                    draft === value || Boolean(draft && !allowed(draft))
                  }
                  onClick={confirm}
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </PickerStyle>
  );
}

type CalendarView = "day" | "month" | "year";

const formatModalDate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseModalDate = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  return formatModalDate(parsed) === value ? parsed : null;
};

const firstYearInPage = (year: number) => Math.floor(year / 12) * 12;

function ModalDatePicker({
  label,
  value,
  onChange,
  min = "1900-01-01",
  max = formatModalDate(new Date()),
  disabled = false,
  className,
  name,
}: DatePickerProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<CalendarView>("day");
  const initial = parseModalDate(value) ?? parseModalDate(max) ?? new Date();
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());
  const [yearStart, setYearStart] = useState(
    firstYearInPage(initial.getFullYear()),
  );
  const minYear = (parseModalDate(min) ?? new Date(1900, 0, 1)).getFullYear();
  const maxYear = (parseModalDate(max) ?? new Date()).getFullYear();

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = oldOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const isAllowed = (date: string) => date >= min && date <= max;
  const monthAllowed = (targetYear: number, targetMonth: number) =>
    formatModalDate(new Date(targetYear, targetMonth, 1)) <= max &&
    formatModalDate(new Date(targetYear, targetMonth + 1, 0)) >= min;

  const showCalendar = () => {
    if (disabled) return;
    const selected = parseModalDate(value) ?? parseModalDate(max) ?? new Date();
    setYear(selected.getFullYear());
    setMonth(selected.getMonth());
    setYearStart(firstYearInPage(selected.getFullYear()));
    setView("day");
    setOpen(true);
  };

  const canMove = (direction: number) => {
    if (view === "year") {
      return direction < 0 ? yearStart > minYear : yearStart + 11 < maxYear;
    }
    if (view === "month") {
      return year + direction >= minYear && year + direction <= maxYear;
    }
    const next = new Date(year, month + direction, 1);
    return monthAllowed(next.getFullYear(), next.getMonth());
  };

  const move = (direction: number) => {
    if (!canMove(direction)) return;
    if (view === "year") {
      setYearStart((current) => current + direction * 12);
    } else if (view === "month") {
      setYear((current) => current + direction);
    } else {
      const next = new Date(year, month + direction, 1);
      setYear(next.getFullYear());
      setMonth(next.getMonth());
    }
  };

  const selectDay = (candidate: string) => {
    if (!isAllowed(candidate)) return;
    onChange(candidate);
    setOpen(false);
  };

  const startDay = new Date(year, month, 1).getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const cellsCount = Math.ceil((startDay + daysCount) / 7) * 7;

  return (
    <PickerStyle className={className} data-open={open} data-present={open}>
      <span id={`${id}-label`} className="picker-label">
        {label}
      </span>
      {name && (
        <input type="hidden" name={name} value={value} disabled={disabled} />
      )}
      <button
        ref={triggerRef}
        type="button"
        className="picker-trigger"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? `${id}-dialog` : undefined}
        disabled={disabled}
        onClick={showCalendar}
      >
        <span id={`${id}-value`}>
          {value ? value.replaceAll("-", ". ") : "선택해주세요"}
        </span>
        <CalendarDays aria-hidden="true" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <ModalDialog
            ref={dialogRef}
            id={`${id}-dialog`}
            aria-modal="true"
            aria-label={`${label || "생년월일"} 선택 달력`}
            onCancel={(event: SyntheticEvent<HTMLDialogElement>) => {
              event.preventDefault();
              setOpen(false);
            }}
            onClick={(event: ReactMouseEvent<HTMLDialogElement>) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              if (
                event.clientX < bounds.left ||
                event.clientX > bounds.right ||
                event.clientY < bounds.top ||
                event.clientY > bounds.bottom
              )
                setOpen(false);
            }}
          >
            <BottomSheetHandle aria-hidden="true" />
            <ModalTop>
              <strong>{label || "생년월일 선택"}</strong>
              <ModalClose
                type="button"
                aria-label="달력 닫기"
                onClick={() => setOpen(false)}
              >
                <X size={22} />
              </ModalClose>
            </ModalTop>

            <ModalHeader>
              <ModalNav
                type="button"
                aria-label="이전"
                disabled={!canMove(-1)}
                onClick={() => move(-1)}
              >
                <ChevronLeft size={22} />
              </ModalNav>
              <ModalHeading>
                {view === "year" ? (
                  <strong>
                    {yearStart}–{yearStart + 11}년
                  </strong>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label="연도 선택"
                      onClick={() => {
                        setYearStart(firstYearInPage(year));
                        setView("year");
                      }}
                    >
                      {year}년
                    </button>
                    <button
                      type="button"
                      aria-label="월 선택"
                      onClick={() =>
                        setView(view === "month" ? "day" : "month")
                      }
                    >
                      {month + 1}월
                    </button>
                  </>
                )}
              </ModalHeading>
              <ModalNav
                type="button"
                aria-label="다음"
                disabled={!canMove(1)}
                onClick={() => move(1)}
              >
                <ChevronRight size={22} />
              </ModalNav>
            </ModalHeader>

            {view === "year" ? (
              <ModalOptions>
                {Array.from({ length: 12 }, (_, i) => yearStart + i).map(
                  (candidate) => (
                    <ModalOption
                      key={candidate}
                      type="button"
                      disabled={candidate < minYear || candidate > maxYear}
                      data-selected={candidate === year}
                      onClick={() => {
                        setYear(candidate);
                        setView("month");
                      }}
                    >
                      {candidate}년
                    </ModalOption>
                  ),
                )}
              </ModalOptions>
            ) : view === "month" ? (
              <ModalOptions>
                {Array.from({ length: 12 }, (_, i) => i).map((candidate) => (
                  <ModalOption
                    key={candidate}
                    type="button"
                    disabled={!monthAllowed(year, candidate)}
                    data-selected={candidate === month}
                    onClick={() => {
                      setMonth(candidate);
                      setView("day");
                    }}
                  >
                    {candidate + 1}월
                  </ModalOption>
                ))}
              </ModalOptions>
            ) : (
              <ModalGrid>
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                  <ModalWeekday key={day}>{day}</ModalWeekday>
                ))}
                {Array.from({ length: cellsCount }, (_, i) => {
                  const day = i - startDay + 1;
                  if (day < 1 || day > daysCount)
                    return <span key={i} aria-hidden="true" />;
                  const candidate = formatModalDate(new Date(year, month, day));
                  return (
                    <ModalDay
                      key={candidate}
                      type="button"
                      aria-label={`${year}년 ${month + 1}월 ${day}일`}
                      aria-pressed={candidate === value}
                      disabled={!isAllowed(candidate)}
                      data-selected={candidate === value}
                      onClick={() => selectDay(candidate)}
                    >
                      {day}
                    </ModalDay>
                  );
                })}
              </ModalGrid>
            )}

            <ModalFooter>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                초기화
              </button>
              <span>연도와 월을 눌러 이동할 수 있습니다.</span>
            </ModalFooter>
          </ModalDialog>,
          document.body,
        )}
    </PickerStyle>
  );
}

export default function DatePicker(props: DatePickerProps) {
  return props.modal ? (
    <ModalDatePicker {...props} />
  ) : (
    <StandardDatePicker {...props} />
  );
}
