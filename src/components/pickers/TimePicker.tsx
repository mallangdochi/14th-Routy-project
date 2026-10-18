import { useId, useState } from "react";
import { AlarmClock, ChevronDown, ChevronUp } from "lucide-react";
import { PickerStyle } from "./PickerStyle";
import { usePicker, type Placement } from "./usePicker";
export type TimePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placement?: Placement;
  disabled?: boolean;
  className?: string;
  name?: string;
};
const pad = (n: number) => String(n).padStart(2, "0");
const parseTime = (value: string) => {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return [9, 0];
  return value.split(":").map(Number);
};
const displayTime = (value: string) => {
  const [h, m] = parseTime(value);
  return `${h < 12 ? "오전" : "오후"} ${pad(h % 12 || 12)}:${pad(m)}`;
};
export default function TimePicker({
  label,
  value,
  onChange,
  placement = "bottom",
  disabled = false,
  className,
  name,
}: TimePickerProps) {
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
  } = usePicker(disabled);
  const [initialHour, initialMinute] = parseTime(value);
  const [hour, setHour] = useState(String(initialHour % 12 || 12));
  const [minute, setMinute] = useState(pad(initialMinute));
  const [period, setPeriod] = useState(initialHour < 12 ? "AM" : "PM");
  const valid =
    /^\d{1,2}$/.test(hour) &&
    /^\d{1,2}$/.test(minute) &&
    Number(hour) >= 1 &&
    Number(hour) <= 12 &&
    Number(minute) >= 0 &&
    Number(minute) <= 59;
  const toggle = () => {
    if (!open) {
      const [h, m] = parseTime(value);
      setHour(String(h % 12 || 12));
      setMinute(pad(m));
      setPeriod(h < 12 ? "AM" : "PM");
    }
    togglePicker();
  };
  const confirm = () => {
    if (!valid) return;
    onChange(
      `${pad((Number(hour) % 12) + (period === "PM" ? 12 : 0))}:${pad(Number(minute))}`,
    );
    close(true);
  };
  return (
    <PickerStyle
      ref={rootRef}
      className={className}
      data-open={open}
      data-present={mounted}
      data-placement={placement}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        if (!open || event.nativeEvent.isComposing) return;

        const target = event.target;
        const popup = event.currentTarget;

        if (
          target instanceof HTMLButtonElement &&
          target.matches(".picker-periods .picker-option") &&
          (event.key === "ArrowLeft" || event.key === "ArrowRight")
        ) {
          event.preventDefault();
          event.stopPropagation();

          const buttons = Array.from(
            popup.querySelectorAll<HTMLButtonElement>(
              ".picker-periods .picker-option",
            ),
          );

          const index = buttons.indexOf(target);
          const direction = event.key === "ArrowRight" ? 1 : -1;
          const nextIndex =
            (index + direction + buttons.length) % buttons.length;

          setPeriod(nextIndex === 0 ? "AM" : "PM");
          buttons[nextIndex]?.focus({ preventScroll: true });
          return;
        }

        if (
          target instanceof HTMLInputElement &&
          target.closest(".picker-time-fields")
        ) {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            event.stopPropagation();

            const inputs = Array.from(
              popup.querySelectorAll<HTMLInputElement>(
                ".picker-time-fields input",
              ),
            );

            const index = inputs.indexOf(target);
            const nextIndex = index + (event.key === "ArrowRight" ? 1 : -1);

            inputs[nextIndex]?.focus({ preventScroll: true });
            return;
          }

          if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();

            if (!event.repeat) {
              confirm();
            }
          }
        }
      }}
    >
      {label && (
        <span className="picker-label" id={`${id}-label`}>
          {label}
        </span>
      )}
      {name && (
        <input type="hidden" name={name} value={value} disabled={disabled} />
      )}
      <button
        ref={triggerRef}
        type="button"
        className="picker-trigger"
        disabled={disabled}
        aria-labelledby={label ? `${id}-label ${id}-value` : undefined}
        aria-label={
          label
            ? undefined
            : `시작 시간, ${value ? displayTime(value) : "선택해주세요"}`
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? `${id}-popup` : undefined}
        onClick={toggle}
      >
        <AlarmClock className="picker-time-icon" aria-hidden="true" />
        <span
          id={`${id}-value`}
          className={`picker-time-value${value ? "" : " is-placeholder"}`}
        >
          {value ? displayTime(value) : "선택해주세요"}
        </span>
        <ChevronDown
          className="picker-chevron picker-chevron-desktop"
          data-open={open}
          aria-hidden="true"
        />
        <ChevronUp
          className="picker-chevron picker-chevron-compact"
          data-open={open}
          aria-hidden="true"
        />
      </button>
      {mounted && (
        <div
          data-open={open}
          inert={!open}
          aria-hidden={!open}
          ref={popupRef}
          id={`${id}-popup`}
          className="picker-popup"
          role="dialog"
          aria-labelledby={label ? `${id}-label` : undefined}
          aria-label={label ? undefined : "시작 시간 선택"}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              event.target instanceof HTMLInputElement
            ) {
              event.preventDefault();
              confirm();
            }
          }}
        >
          <div className="picker-periods">
            {(["AM", "PM"] as const).map((p) => (
              <button
                type="button"
                key={p}
                className="picker-option"
                aria-pressed={period === p}
                onClick={() => setPeriod(p)}
              >
                {p === "AM" ? "오전" : "오후"}
              </button>
            ))}
          </div>
          <div className="picker-time-fields">
            <label htmlFor={`${id}-hour`}>
              시
              <input
                id={`${id}-hour`}
                type="number"
                inputMode="numeric"
                min={1}
                max={12}
                step={1}
                value={hour}
                onChange={(e) => setHour(e.target.value)}
              />
            </label>
            <label htmlFor={`${id}-minute`}>
              분
              <input
                id={`${id}-minute`}
                type="number"
                inputMode="numeric"
                min={0}
                max={59}
                step={1}
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                onBlur={() => {
                  if (
                    minute !== "" &&
                    Number(minute) >= 0 &&
                    Number(minute) <= 59
                  )
                    setMinute(pad(Number(minute)));
                }}
              />
            </label>
          </div>
          <button
            type="button"
            className="picker-confirm"
            disabled={!valid}
            onClick={confirm}
          >
            선택 완료
          </button>
        </div>
      )}
    </PickerStyle>
  );
}
