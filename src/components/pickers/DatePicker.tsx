import { useId, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { PickerStyle } from "./PickerStyle";
import { usePicker, type Placement } from "./usePicker";
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
export default function DatePicker({
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
