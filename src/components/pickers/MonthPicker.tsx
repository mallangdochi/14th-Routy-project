import { useId, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PickerStyle } from "./PickerStyle";
import { usePicker, type Placement } from "./usePicker";
export type MonthPickerProps = {
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
export default function MonthPicker({
  label,
  value,
  onChange,
  placement = "bottom",
  min,
  max,
  disabled = false,
  className,
  name,
}: MonthPickerProps) {
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
  const currentYear = () =>
    /^\d{4}-\d{2}$/.test(value)
      ? Number(value.slice(0, 4))
      : new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [view, setView] = useState<"month" | "year">("month");
  const [yearPage, setYearPage] = useState(
    () => Math.floor(currentYear() / 12) * 12,
  );
  const allowed = (candidate: string) =>
    (!min || candidate >= min) && (!max || candidate <= max);
  const choose = (candidate: string) => {
    if (allowed(candidate)) {
      onChange(candidate);
      close(true);
    }
  };
  const today = new Date();
  const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const toggle = () => {
    if (!open) {
      const y = currentYear();
      setYear(y);
      setYearPage(Math.floor(y / 12) * 12);
      setView("month");
    }
    togglePicker();
  };
  const move = (step: number) => {
    if (view === "year") setYearPage((p) => Math.max(100, p + step * 12));
    else setYear((y) => Math.max(100, y + step));
  };
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
          {value
            ? `${value.slice(0, 4)}년 ${Number(value.slice(5, 7))}월`
            : "연도와 월을 선택해주세요"}
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
            <button
              type="button"
              className="picker-nav"
              aria-label="이전 기간"
              onClick={() => move(-1)}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="picker-heading"
              aria-label="연도 선택"
              onClick={() => {
                setYearPage(Math.floor(year / 12) * 12);
                setView(view === "year" ? "month" : "year");
              }}
            >
              {year}년<ChevronDown aria-hidden="true" />
            </button>
            <button
              type="button"
              className="picker-nav"
              aria-label="다음 기간"
              onClick={() => move(1)}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
          {view === "year" ? (
            <>
              <div className="picker-range" aria-live="polite">
                {yearPage} – {yearPage + 11}
              </div>
              <div className="picker-options">
                {Array.from({ length: 12 }, (_, i) => yearPage + i).map((y) => (
                  <button
                    key={y}
                    type="button"
                    className="picker-option"
                    aria-pressed={y === year}
                    disabled={
                      (!!min && y < Number(min.slice(0, 4))) ||
                      (!!max && y > Number(max.slice(0, 4)))
                    }
                    onClick={() => {
                      setYear(y);
                      setView("month");
                    }}
                  >
                    {y}년
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="picker-options">
              {Array.from({ length: 12 }, (_, m) => {
                const candidate = `${year}-${String(m + 1).padStart(2, "0")}`;
                return (
                  <button
                    key={candidate}
                    type="button"
                    className="picker-option"
                    aria-pressed={candidate === value}
                    disabled={!allowed(candidate)}
                    onClick={() => choose(candidate)}
                  >
                    {m + 1}월
                  </button>
                );
              })}
            </div>
          )}
          <div className="picker-footer">
            <button
              type="button"
              className="picker-text-button"
              disabled={!allowed(thisMonth)}
              onClick={() => choose(thisMonth)}
            >
              이번 달
            </button>
            <span aria-live="polite">
              {view === "year" ? "연도" : "월"} 선택
            </span>
          </div>
        </div>
      )}
    </PickerStyle>
  );
}
