import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Banknote,
  CircleAlert,
  Bus,
  CarTaxiFront,
  Check,
  ChevronDown,
  ChevronRight,
  Footprints,
  Plane,
  TrainFront,
  TramFront,
  type LucideIcon,
  Car,
  Coffee,
  Landmark,
  Map,
  MapPin,
  Minus,
  Mountain,
  Plus,
  Users,
  Utensils,
  Calendar,
  AlarmClock,
  ChevronUp,
  Bike,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import KakaoRegionPreview from "../../map/KakaoRegionPreview";
import where from "../../assets/where.webp";
import TripPreviewModal from "../../components/modal/travel-preview/TripPreviewModal";
import { CreateTripPageStyle } from "./createTripPageStyle";
import DateRangePicker from "../../components/pickers/DateRangePicker";
import TimePicker from "../../components/pickers/TimePicker";
import RegionSelectModal from "../../components/modal/travel-region-selector/RegionSelectModal";
import { REGIONS, type TravelRegion } from "../../data/regions";
import { Link } from "react-router";
const styleOptions = [
  { value: "food", label: "맛집", Icon: Utensils },
  { value: "nature", label: "자연", Icon: Mountain },
  { value: "culture", label: "문화", Icon: Landmark },
  { value: "rest", label: "휴식", Icon: Coffee },
  { value: "activity", label: "체험", Icon: Bike },
  { value: "shopping", label: "쇼핑", Icon: ShoppingBag },
];
const transportOptions = [
  { value: "자동차", Icon: Car },
  { value: "기차", Icon: TrainFront },
  { value: "지하철", Icon: TramFront },
  { value: "버스", Icon: Bus },
  { value: "택시", Icon: CarTaxiFront },
  { value: "도보", Icon: Footprints },
  { value: "비행기", Icon: Plane },
];
type DropdownOption = {
  value: string;
  Icon: LucideIcon;
};
function TripDropdown({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = "선택해주세요",
}: {
  id: string;
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const SelectedIcon =
    options.find((item) => item.value === value)?.Icon ?? MapPin;
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  const focusOption = (index: number) => {
    if (!options.length) return;
    optionRefs.current[(index + options.length) % options.length]?.focus();
  };
  return (
    <div
      className="trip-dropdown-wrapper"
      ref={wrapperRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        id={id}
        ref={triggerRef}
        type="button"
        className="dropdown-trigger"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onClick={() => setOpen((previous) => !previous)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            const selectedIndex = options.findIndex(
              (item) => item.value === value,
            );
            const initialIndex =
              selectedIndex >= 0
                ? selectedIndex
                : event.key === "ArrowUp"
                  ? options.length - 1
                  : 0;
            requestAnimationFrame(() => focusOption(initialIndex));
          }
        }}
      >
        <SelectedIcon aria-hidden="true" />
        <span className={value ? undefined : "is-placeholder"}>
          {value || placeholder}
        </span>

        <ChevronDown
          className="dropdown-chevron dropdown-chevron-desktop"
          data-open={open}
          aria-hidden="true"
        />
        <ChevronUp
          className="dropdown-chevron dropdown-chevron-compact"
          data-open={open}
          aria-hidden="true"
        />
      </button>

      <div
        id={`${id}-menu`}
        className="trip-dropdown"
        role="menu"
        aria-label={label}
        data-open={open}
        inert={!open}
      >
        {options.map(({ value: item, Icon }, index) => (
          <button
            key={item}
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            type="button"
            role="menuitemradio"
            aria-checked={value === item}
            tabIndex={open ? 0 : -1}
            className={value === item ? "is-selected" : ""}
            onClick={() => {
              onChange(item);
              setOpen(false);
              triggerRef.current?.focus();
            }}
            onKeyDown={(event) => {
              if (
                ["ArrowDown", "ArrowUp", "Home", "End", "Escape"].includes(
                  event.key,
                )
              ) {
                event.preventDefault();
                if (event.key === "Escape") {
                  setOpen(false);
                  triggerRef.current?.focus();
                } else {
                  focusOption(
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? options.length - 1
                        : index + (event.key === "ArrowDown" ? 1 : -1),
                  );
                }
              }
            }}
          >
            <Icon aria-hidden="true" />
            <span>{item}</span>
            {value === item && (
              <Check className="option-check" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
const TravelStylePlaceholderIcon = Sparkles;

function TravelStyleDropdown({
  values,
  onToggle,
}: {
  values: string[];
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const query = window.matchMedia("(max-width: 767px)");
    const resize = () => setOpen(false);
    document.addEventListener("pointerdown", outside);
    query.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      query.removeEventListener("change", resize);
    };
  }, []);
  const focusOption = (index: number) => {
    optionRefs.current[
      (index + styleOptions.length) % styleOptions.length
    ]?.focus();
  };
  const SelectedStyleIcon =
    styleOptions.find((option) => values.includes(option.value))?.Icon ??
    TravelStylePlaceholderIcon;
  const selectedLabels = styleOptions
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)
    .join(" · ");
  return (
    <div
      className="trip-dropdown-wrapper style-dropdown-wrapper"
      ref={wrapperRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="dropdown-trigger"
        aria-labelledby="styles-label styles-selection"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="travel-styles-menu"
        onClick={() => setOpen((previous) => !previous)}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            const index = event.key === "ArrowUp" ? styleOptions.length - 1 : 0;
            requestAnimationFrame(() => focusOption(index));
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        <SelectedStyleIcon aria-hidden="true" />
        <span
          id="styles-selection"
          className={values.length === 0 ? "is-placeholder" : undefined}
          aria-live="polite"
        >
          {selectedLabels || "최대 3개 선택"}
        </span>
        <ChevronUp
          className="dropdown-chevron"
          data-open={open}
          aria-hidden="true"
        />
      </button>
      <div
        id="travel-styles-menu"
        className="trip-dropdown style-dropdown"
        role="menu"
        aria-labelledby="styles-label"
        data-open={open}
        inert={!open}
      >
        {styleOptions.map(({ value, label, Icon }, index) => {
          const selected = values.includes(value);
          const unavailable = !selected && values.length >= 3;
          return (
            <button
              key={value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="menuitemcheckbox"
              aria-checked={selected}
              aria-disabled={unavailable}
              tabIndex={open ? 0 : -1}
              className={selected ? "is-selected" : ""}
              onClick={() => {
                if (!unavailable) onToggle(value);
              }}
              onKeyDown={(event) => {
                if (
                  ["ArrowDown", "ArrowUp", "Home", "End", "Escape"].includes(
                    event.key,
                  )
                ) {
                  event.preventDefault();
                  if (event.key === "Escape") {
                    setOpen(false);
                    triggerRef.current?.focus();
                  } else {
                    focusOption(
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? styleOptions.length - 1
                          : index + (event.key === "ArrowDown" ? 1 : -1),
                    );
                  }
                }
              }}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
              {selected && <Check aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type TripData = {
  name?: string;
  region: string;
  startDate: string;
  endDate: string;
  startTime: string;
  transport?: string;
  people?: number;
  styles?: string[];
  budget?: number;
};
type Props = {
  onCancel?: () => void;
  onCreate?: (trip: TripData) => void;
};

export default function CreateTripPage({ onCancel, onCreate }: Props) {
  const [name, setName] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<TravelRegion | null>(
    null,
  );
  const region = selectedRegion?.name ?? "";
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });

  const { startDate, endDate } = dates;
  const [startTime, setStartTime] = useState("");
  const [transport, setTransport] = useState("");
  const [people, setPeople] = useState(1);
  const [styles, setStyles] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"basic" | "preferences">("basic");
  const [isCompact, setIsCompact] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches,
  );
  const stepHeadingRef = useRef<HTMLOListElement>(null);
  const previewTriggerRef = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const isMobilePreference = isMobile && step === "preferences";

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsCompact(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const changeStep = (next: "basic" | "preferences") => {
    setStep(next);
    requestAnimationFrame(() => {
      stepHeadingRef.current?.focus({ preventScroll: true });
      stepHeadingRef.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    });
  };
  const sheetHistoryRef = useRef(false);
  const pendingCreateRef = useRef<(() => void) | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  useEffect(() => {
    nameRef.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    const pop = () => {
      sheetHistoryRef.current = false;
      setSheetOpen(false);
      const pending = pendingCreateRef.current;
      pendingCreateRef.current = null;
      pending?.();
    };
    const resize = () => {
      if (window.innerWidth >= 1024 && sheetHistoryRef.current)
        window.history.back();
    };
    window.addEventListener("popstate", pop);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("resize", resize);
    };
  }, []);
  const closeSheet = () => {
    if (sheetHistoryRef.current) window.history.back();
    else setSheetOpen(false);
  };
  const dayDifference =
    startDate && endDate
      ? Math.round((Date.parse(endDate) - Date.parse(startDate)) / 86400000)
      : null;
  const duration =
    dayDifference === null
      ? "날짜 선택"
      : dayDifference < 0
        ? "날짜 확인"
        : dayDifference === 0
          ? "당일 여행"
          : `${dayDifference}박 ${dayDifference + 1}일`;
  const selectedStyleLabels = styleOptions
    .filter((option) => styles.includes(option.value))
    .map((option) => option.label)
    .join(" · ");
  const hasPreferences = people !== 1 || styles.length > 0 || budget !== "";
  const formattedBudget =
    budget !== "" ? Number(budget).toLocaleString("ko-KR") : "";
  const toggleStyle = (value: string) => {
    setStyles((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : previous.length < 3
          ? [...previous, value]
          : previous,
    );
  };
  const regionError = !region.trim() ? "여행할 지역을 선택해주세요." : "";
  const datesError =
    !startDate || !endDate
      ? "여행 시작일과 종료일을 모두 선택해주세요."
      : dayDifference === null || !Number.isFinite(dayDifference)
        ? "올바른 여행 날짜를 선택해주세요."
        : dayDifference < 0
          ? "종료일은 시작일과 같거나 이후여야 해요."
          : "";
  const timeError = !startTime
    ? "여행 시작 시간을 선택해주세요."
    : !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)
      ? "올바른 시작 시간을 선택해주세요."
      : "";
  const renderFieldHelp = (
    id: string,
    error: string,
    defaultMessage: string,
  ) => {
    const showError = hasSubmitted && Boolean(error);
    return (
      <p
        id={id}
        className={`field-help${showError ? " is-error" : ""}`}
        role={showError ? "alert" : undefined}
      >
        <CircleAlert aria-hidden="true" />
        <span>{error || defaultMessage}</span>
      </p>
    );
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    // if (regionError || datesError || timeError) {
    //   if (isCompact && step !== "basic") setStep("basic");
    //   const form = event.currentTarget;
    //   const field = regionError ? "region" : datesError ? "dates" : "time";
    //   requestAnimationFrame(() => {
    //     const control = form.querySelector<HTMLElement>(
    //       `[data-required-field="${field}"] button, [data-required-field="${field}"] input:not([type="hidden"])`,
    //     );
    //     control?.focus();
    //   });
    //   return;
    // }
    if (regionError || datesError || timeError) {
      if (isCompact && step !== "basic") setStep("basic");

      const form = event.currentTarget;
      const errors: Record<string, string> = {
        region: regionError,
        dates: datesError,
        time: timeError,
      };

      requestAnimationFrame(() => {
        const field = Array.from(
          form.querySelectorAll<HTMLElement>("[data-required-field]"),
        ).find((element) => errors[element.dataset.requiredField ?? ""]);

        if (!field) return;

        const control = field.querySelector<HTMLElement>(
          'button:not([disabled]), input:not([type="hidden"]):not([disabled])',
        );

        control?.focus({ preventScroll: true });

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        window.scrollTo({
          top: Math.max(
            0,
            window.scrollY +
              field.getBoundingClientRect().top -
              window.innerHeight / 3,
          ),
          behavior: reducedMotion ? "instant" : "smooth",
        });
      });

      return;
    }
    if (isCompact && step === "basic") {
      changeStep("preferences");
      return;
    }
    if (isCompact) {
      window.history.pushState(
        { ...window.history.state, routyTripPreview: true },
        "",
      );
      sheetHistoryRef.current = true;
      setSheetOpen(true);
      return;
    }
    createTrip();
  };
  const createTrip = () => {
    const trip: TripData = {
      region,
      startDate,
      endDate,
      startTime,
      people,
      ...(name.trim() ? { name: name.trim() } : {}),
      ...(transport ? { transport } : {}),
      ...(styles.length > 0 ? { styles: [...styles] } : {}),
      ...(budget !== "" ? { budget: Number(budget) } : {}),
    };
    onCreate?.(trip);
  };
  const [startHour, startMinute] = startTime.split(":");
  const previewStartTime = startTime
    ? `${Number(startHour) < 12 ? "오전" : "오후"} ${Number(startHour) % 12 || 12}:${startMinute}`
    : "시간 미선택";
  const renderPreview = (prefix: string) => (
    <>
      <div className="map-preview">
        <KakaoRegionPreview region={selectedRegion} />
      </div>

      <section
        className="summary-card"
        aria-labelledby={`${prefix}-summary-title`}
      >
        <h2 id={`${prefix}-summary-title`}>
          <Map aria-hidden="true" />
          여행 미리보기
        </h2>

        <p className="preview-trip-name">{name.trim() || "새 여행"}</p>
        <ul className="summary-list">
          <li>
            <MapPin aria-hidden="true" />
            <span>
              {region || "여행 지역 미선택"}{" "}
              <span className="separator">·</span> {duration}
            </span>
          </li>
          <li>
            <Calendar aria-hidden="true" />

            <span className="summary-dates">
              {startDate && endDate ? (
                <>
                  {startDate.replaceAll("-", ".")} <Minus size={10} />
                  {endDate.replaceAll("-", ".")}
                </>
              ) : (
                "날짜를 선택해주세요"
              )}
            </span>
          </li>
          <li>
            <Users aria-hidden="true" />
            <span>
              {people}명 <span className="separator">·</span>{" "}
              {transport || "이동수단 미선택"}
            </span>
          </li>
          <li>
            <AlarmClock aria-hidden="true" />
            <span className="summary-time">
              <span className="summary-time-label">시작 시간</span>
              <strong className="summary-time-value">{previewStartTime}</strong>
            </span>
          </li>
          <li>
            <Utensils aria-hidden="true" />
            <span>{selectedStyleLabels || "선택한 취향이 없어요"}</span>
          </li>
          <li>
            <Banknote aria-hidden="true" />
            <span>
              {" "}
              {budget !== ""
                ? `예상 예산 ${formattedBudget}원`
                : "예상 예산 미입력"}
            </span>
          </li>
        </ul>
      </section>
    </>
  );
  return (
    <CreateTripPageStyle data-step={step}>
      <div className="routy-brand-bar">
        <Link to="/" aria-label="Routy 홈">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 625 229"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M579.014 152.122C572.997 157.048 566.78 160.411 558.84 160.953C530.071 162.92 497.639 156.668 495.424 122.225C494.249 103.969 496.343 84.4702 495.442 66.0799C496.111 61.5391 499.036 57.5781 503.345 55.8852C507.858 54.1134 526.77 54.016 531.199 55.8852C534.245 57.1653 536.404 60.0178 536.771 63.3062C538.475 78.4359 534.793 96.7984 537.365 111.877C541.01 133.264 577.668 132.791 579.507 109.238C580.574 95.56 578.248 80.1381 579.497 66.5576C579.971 61.4278 581.944 56.9056 587.056 55.092C590.998 53.696 606.571 53.8444 611.289 54.2665C618.634 54.9251 624.127 59.9853 624.545 67.462C623.398 95.2771 626.008 124.228 624.545 151.914C622.586 189.019 596.254 217.511 559.676 223.012C541.697 225.716 496.752 225.586 492.313 201.867C491.004 194.854 493.46 182.243 499.654 177.897C507.58 172.331 513.978 178.36 521.444 180.656C534.547 184.687 556.138 185.902 567.838 177.827C576.261 172.015 579.316 162.034 579.019 152.127L579.014 152.122Z"
              fill="#0D3E41"
            />
            <path
              d="M292.899 55.7787C297.863 55.185 312.577 55.0365 316.704 57.2489C319.597 58.7981 320.609 61.5439 320.874 64.6793C322.086 78.7607 319.792 94.5908 320.841 108.774C321.357 115.741 323.966 121.52 331.075 123.598C343.444 127.216 355.122 122.684 356.167 108.774C357.151 95.6669 354.969 80.9453 356.157 67.9492C357.443 53.8677 373.365 54.7304 384.183 55.7091C392.114 56.428 395.044 59.5727 395.638 67.4575C396.604 80.3284 396.26 98.9739 395.638 112.021C394.979 125.884 390.438 140.073 379.373 149.112C367.036 159.196 331.358 158.444 316.133 155.685C269.572 147.243 282.967 102.193 280.91 67.4529C281.574 60.8203 286.436 56.5439 292.899 55.774V55.7787Z"
              fill="#0D3E41"
            />
            <path
              d="M460.619 45.4445C466.641 45.5001 472.812 45.5465 478.713 46.6179C482.205 47.6754 485.186 50.4444 486.179 54.0019C486.941 56.7338 486.959 65.3932 486.62 68.4034C486.059 73.3987 482.191 76.5109 477.446 77.3272C476.48 77.4942 473.192 77.9116 472.459 77.9116H460.619V115.249C460.619 115.717 461.724 118.296 462.086 118.885C466.511 126.065 479.461 119.117 484.22 126.459C486.894 130.587 486.922 144.488 484.995 148.88C481.193 157.526 467.347 156.751 459.439 156.32C435.513 155.016 419.23 144.692 417.883 119.446C417.164 105.926 418.51 91.7936 417.841 78.2085C413.621 75.6204 408.226 78.7187 404.427 74.3124C400.629 69.9062 400.523 53.7282 403.768 49.1875C407.455 44.0345 416.922 46.8359 417.832 45.3796C419.383 33.3389 412.78 12.5321 428.005 7.54143C433.001 5.90416 445.505 5.90416 450.501 7.54143C455.497 9.1787 460.609 14.7445 460.609 20.1711V45.4491L460.619 45.4445Z"
              fill="#0D3E41"
            />
            <path
              d="M404.437 186.44C404.627 185.74 404.251 185.67 403.982 185.28C402.788 183.555 398.981 180.211 397.254 178.55C393.962 175.378 390.256 172.544 387.15 169.167C385.4 164.979 390.568 162.451 393.994 161.95C405.012 165.42 415.213 171.245 426.102 175.192C433.688 173.221 450.696 161.946 457.619 168.342C462.402 172.762 455.186 179.612 451.035 181.741C446.239 184.204 440.565 186.073 435.653 188.411L425.103 224.018C423.682 227.933 416.76 229.185 415.422 224.867C413.245 217.831 413.862 207.794 411.842 200.614C411.703 200.113 411.708 199.756 411.174 199.45L393.4 205.113C391.617 208.954 390.117 219.366 385.52 220.196C376.791 221.778 381.435 210.762 379.118 205.92C355.247 214.57 330.885 221.968 305.686 225.795C214.063 239.709 140.933 207.757 80.0989 141C73.8817 134.177 56.7625 115.717 55.7781 107.317C52.9319 83.0599 76.0315 91.7703 91.1218 89.3863C122.561 84.4188 121.53 39.489 90.8014 37.0864C82.1233 36.4092 64.4933 36.2144 56.0103 37.1513C49.691 37.8517 44.7506 41.8823 43.302 48.1113C41.6537 89.0848 43.7477 130.383 42.2341 171.347C39.1742 182.72 24.5297 181.978 15.0763 181.37C6.8115 180.832 0.877555 176.792 0 168.142V41.9472C2.40979 11.9939 23.9122 1.59517 51.3068 0.435634C64.7673 -0.13486 81.074 -0.158051 94.5252 0.435634C122.839 1.6833 148.325 11.0941 155.531 41.0706C163.202 72.9765 150.322 98.0504 121.056 111.385C119.347 112.164 113.195 113.973 112.373 114.766C111.728 115.392 111.816 116.176 112.021 116.983C112.304 118.097 119.57 125.986 120.968 127.544C179.834 193.026 248.757 228.745 339.056 211.342C351.76 208.893 364.543 205.79 376.568 201.05C373.481 198.058 366.767 192.91 374.386 190.512C378.844 189.111 383.38 193.722 387.912 193.856L404.437 186.435V186.44Z"
              fill="#0D3E41"
            />
            <path
              d="M216.296 43.2645C250.112 41.4139 277.038 66.0889 272.051 100.819C269.446 118.983 248.046 144.441 235.663 158.161C233.137 160.963 225.824 169.344 222.876 170.434C215.526 173.152 210.72 166.45 206.16 161.644C194.46 149.316 170.97 121.761 167.488 105.657C160.462 73.1668 183.627 45.0502 216.292 43.2645H216.296ZM239.052 94.9476C239.052 84.1128 230.258 75.3282 219.412 75.3282C208.565 75.3282 199.771 84.1128 199.771 94.9476C199.771 105.782 208.565 114.567 219.412 114.567C230.258 114.567 239.052 105.782 239.052 94.9476Z"
              fill="#EB654B"
            />
          </svg>
        </Link>
      </div>

      <main className="routy-trip-main">
        <div className="trip-panel">
          <form className="trip-form" onSubmit={handleSubmit} noValidate>
            {/* <div className="routy-intro">
              <h1 className="routy-intro-small-title">어디로 떠날까요?</h1>
              <div className="routy-intro-row">
                <div className="routy-intro-content">
                  <div className="routy-intro-copy">
                    <h1 className="routy-intro-title">어디로 떠날까요?</h1>
                    <p>
                      여행의 기본 정보를 입력하고, 나에게 맞는 일정을 시작해요.
                    </p>
                  </div>
                  {isCompact && (
                    <ol
                      className="trip-steps"
                      aria-label="여행 만들기 단계"
                      ref={stepHeadingRef}
                      tabIndex={-1}
                    >
                      <li aria-current={step === "basic" ? "step" : undefined}>
                        <span className="step-number" aria-hidden="true">
                          1
                        </span>
                        기본 여행 정보
                      </li>
                      <li
                        aria-current={
                          step === "preferences" ? "step" : undefined
                        }
                      >
                        <span className="step-number" aria-hidden="true">
                          2
                        </span>
                        여행 취향
                      </li>
                    </ol>
                  )}
                </div>
                <div className="routy-intro-art" aria-hidden="true">
                  <img src={where} alt="" />
                </div>
              </div>
            </div> */}

            <div className="routy-intro">
              <h1 className="routy-intro-small-title">
                {isMobilePreference ? (
                  <>
                    여행 취향 <span>· 선택 사항</span>
                  </>
                ) : (
                  "어디로 떠날까요?"
                )}
              </h1>

              <div className="routy-intro-row">
                <div className="routy-intro-content">
                  <div className="routy-intro-copy">
                    <h1 className="routy-intro-title">
                      {isMobilePreference ? (
                        <>
                          여행 취향 <span>· 선택 사항</span>
                        </>
                      ) : (
                        "어디로 떠날까요?"
                      )}
                    </h1>

                    <p>
                      {isMobilePreference
                        ? "선택한 취향을 반영해 나에게 맞는 여행을 준비해요."
                        : "여행의 기본 정보를 입력하고, 나에게 맞는 일정을 시작해요."}
                    </p>
                  </div>

                  {isCompact && (
                    <ol
                      className="trip-steps"
                      aria-label="여행 만들기 단계"
                      ref={stepHeadingRef}
                      tabIndex={-1}
                    >
                      <li aria-current={step === "basic" ? "step" : undefined}>
                        <span className="step-number" aria-hidden="true">
                          1
                        </span>
                        기본 여행 정보
                      </li>

                      <li
                        aria-current={
                          step === "preferences" ? "step" : undefined
                        }
                      >
                        <span className="step-number" aria-hidden="true">
                          2
                        </span>
                        여행 취향
                      </li>
                    </ol>
                  )}
                </div>

                <div className="routy-intro-art" aria-hidden="true">
                  <img src={where} alt="" />
                </div>
              </div>
            </div>
            <fieldset
              className="basic-fields"
              hidden={isCompact && step !== "basic"}
              disabled={isCompact && step !== "basic"}
              aria-label="기본 여행 정보"
            >
              <div className="basic-fields-heading">
                <h2>기본 정보</h2>
                <p className="required-guide">
                  <span aria-hidden="true">*</span> 필수 입력
                </p>
              </div>
              <div className="field trip-name-field">
                <label htmlFor="trip-name">여행 이름</label>
                <input
                  ref={nameRef}
                  id="trip-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="여행 이름을 입력해주세요"
                  maxLength={50}
                />
              </div>

              <div className="field" data-required-field="region">
                <label htmlFor="trip-region">
                  여행 지역{" "}
                  <span className="required-mark" aria-hidden="true">
                    *
                  </span>
                </label>
                <button
                  id="trip-region"
                  type="button"
                  className="region-select-button"
                  onClick={() => setRegionModalOpen(true)}
                  aria-label={
                    region
                      ? `여행 지역 변경, 현재 ${region}`
                      : "여행할 지역 선택"
                  }
                  aria-describedby="region-help"
                  aria-invalid={hasSubmitted && Boolean(regionError)}
                >
                  <MapPin aria-hidden="true" />
                  <span
                    className={`region-name${region ? "" : " is-placeholder"}`}
                  >
                    {region || "여행할 지역을 입력해주세요"}
                  </span>
                  {region && <span className="region-change">변경</span>}
                  <ChevronRight aria-hidden="true" />
                </button>
                {renderFieldHelp(
                  "region-help",
                  regionError,
                  "여행 지역을 선택해주세요.",
                )}
              </div>

              <div
                className="field"
                data-required-field="dates"
                data-empty={!startDate || !endDate}
                role="group"
                aria-labelledby="trip-dates-label"
                aria-describedby="trip-dates-help"
                aria-invalid={hasSubmitted && Boolean(datesError)}
              >
                <span id="trip-dates-label" className="field-label">
                  여행 날짜{" "}
                  <span className="required-mark" aria-hidden="true">
                    *
                  </span>
                </span>
                <div className="picker-control-only">
                  <DateRangePicker
                    label=""
                    value={dates}
                    onChange={setDates}
                    startName="startDate"
                    endName="endDate"
                  />
                </div>
                {renderFieldHelp(
                  "region-help",
                  datesError,
                  "여행 날짜를 선택해주세요.",
                )}
              </div>
              <div className="time-fields">
                <div
                  className="field"
                  data-required-field="time"
                  role="group"
                  aria-labelledby="trip-time-label"
                  aria-describedby="trip-time-help"
                  aria-invalid={hasSubmitted && Boolean(timeError)}
                >
                  <span id="trip-time-label" className="field-label">
                    시작 시간{" "}
                    <span className="required-mark" aria-hidden="true">
                      *
                    </span>
                  </span>
                  <div className="picker-control-only">
                    <TimePicker
                      label=""
                      name="startTime"
                      value={startTime}
                      placement={isCompact ? "top" : "bottom"}
                      onChange={setStartTime}
                    />
                  </div>
                  {renderFieldHelp(
                    "region-help",
                    timeError,
                    "여행 시작 시간을 선택해주세요.",
                  )}
                </div>

                <div className="field">
                  <label htmlFor="transport">이동 수단</label>
                  <TripDropdown
                    id="transport"
                    label="이동 수단"
                    value={transport}
                    options={transportOptions}
                    onChange={setTransport}
                  />
                </div>
              </div>
            </fieldset>

            <section
              className="preference-section"
              hidden={isCompact && step !== "preferences"}
              aria-labelledby={isMobile ? undefined : "preference-title"}
              aria-label={isMobile ? "여행 취향" : undefined}
            >
              <div className="section-heading" hidden={isMobile}>
                <h2 id="preference-title">
                  여행 취향 <span>· 선택 사항</span>
                </h2>
                <p>선택한 취향을 반영해 나에게 맞는 여행을 준비해요.</p>
              </div>

              <div className="preference-row">
                <span id="people-label" className="row-label">
                  여행 인원
                </span>

                <div
                  className="people-control"
                  role="group"
                  aria-labelledby="people-label"
                >
                  <button
                    type="button"
                    aria-label="여행 인원 줄이기"
                    disabled={people <= 1}
                    onClick={() => setPeople((value) => value - 1)}
                  >
                    <Minus aria-hidden="true" />
                  </button>

                  <output aria-live="polite">{people}명</output>

                  <button
                    type="button"
                    aria-label="여행 인원 늘리기"
                    disabled={people >= 99}
                    onClick={() => setPeople((value) => value + 1)}
                  >
                    <Plus aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="preference-row style-row">
                <div className="style-info">
                  <span id="styles-label" className="row-label style-title">
                    여행 스타일
                  </span>
                  <div className="style-desc">
                    <span className="row-desc">어떤 여행을 좋아하세요?</span>
                    <span className="row-desc">최대 3개까지 선택해주세요.</span>
                  </div>
                </div>

                <div
                  className="style-options style-options-desktop"
                  role="group"
                  aria-labelledby="styles-label"
                >
                  {styleOptions.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      className="style-button"
                      aria-pressed={styles.includes(value)}
                      disabled={styles.length >= 3 && !styles.includes(value)}
                      onClick={() => toggleStyle(value)}
                    >
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <TravelStyleDropdown values={styles} onToggle={toggleStyle} />
              </div>

              <div className="preference-row budget-row">
                <label className="row-label" htmlFor="trip-budget">
                  예상 예산
                </label>

                <div className="budget-content">
                  <div className="budget-input">
                    <span className="budget-icon">
                      <Banknote aria-hidden="true" />
                    </span>
                    <input
                      id="trip-budget"
                      type="text"
                      inputMode="numeric"
                      value={formattedBudget}
                      onChange={(event) =>
                        setBudget(
                          event.target.value.replace(/\D/g, "").slice(0, 12),
                        )
                      }
                      placeholder="0"
                      aria-describedby="budget-help"
                    />
                    <span>원</span>
                  </div>

                  <span id="budget-help" className="budget-help">
                    여행 전체 기준
                  </span>
                </div>
              </div>
            </section>

            <div className="form-actions">
              <button
                className="cancel-button"
                type="button"
                onClick={() =>
                  isCompact && step === "preferences"
                    ? changeStep("basic")
                    : onCancel?.()
                }
              >
                {isCompact && step === "preferences" ? "이전" : "취소"}
              </button>
              <button
                ref={previewTriggerRef}
                className="submit-button"
                type="submit"
              >
                {isCompact
                  ? step === "basic"
                    ? "다음"
                    : hasPreferences
                      ? "미리보기"
                      : "건너뛰기"
                  : "여행 만들기"}
              </button>
            </div>
          </form>

          <aside className="preview-column" aria-label="여행 미리보기">
            {renderPreview("desktop")}
          </aside>
        </div>
      </main>
      <RegionSelectModal
        isOpen={regionModalOpen}
        value={selectedRegion ?? REGIONS[0]}
        onClose={() => setRegionModalOpen(false)}
        onConfirm={setSelectedRegion}
      />
      <TripPreviewModal
        open={sheetOpen}
        onClose={closeSheet}
        onCreate={() => {
          if (!onCreate || pendingCreateRef.current) return;
          if (sheetHistoryRef.current) {
            pendingCreateRef.current = createTrip;
            closeSheet();
          } else createTrip();
        }}
        triggerRef={previewTriggerRef}
      >
        {renderPreview("dialog")}
      </TripPreviewModal>
    </CreateTripPageStyle>
  );
}
