import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  ChevronRight,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { loadWeather, type WeatherData } from "./weatherApi";
import { resolveRegionCoordinates } from "./geocodingApi";
import * as S from "./WeatherPopoverStyle";

export type WeatherPopoverProps = {
  locationName: string;
  className?: string;
};

function describe(code: number | null, isDay = true) {
  if (code === 0) {
    return {
      Icon: isDay ? Sun : Moon,
      label: "맑음",
    };
  }

  if (code === 1 || code === 2) {
    return {
      Icon: isDay ? CloudSun : Cloud,
      label: "구름 조금",
    };
  }

  if (code === 3) {
    return { Icon: Cloud, label: "흐림" };
  }

  if (code === 45 || code === 48) {
    return { Icon: CloudFog, label: "안개" };
  }

  if (code !== null && [51, 53, 55, 56, 57].includes(code)) {
    return { Icon: CloudDrizzle, label: "이슬비" };
  }

  if (code !== null && [61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { Icon: CloudRain, label: "비" };
  }

  if (code !== null && [71, 73, 75, 77, 85, 86].includes(code)) {
    return { Icon: CloudSnow, label: "눈" };
  }

  if (code !== null && [95, 96, 99].includes(code)) {
    return { Icon: CloudLightning, label: "뇌우" };
  }

  return { Icon: Cloud, label: "날씨 정보 없음" };
}

function degrees(value: number | null | undefined) {
  return value == null ? "—" : `${Math.round(value)}°`;
}

function resetForecastScroll(node: HTMLDivElement | null) {
  if (node) node.scrollLeft = 0;
}

function dateLabel(value: string) {
  const date = new Date(`${value}T12:00:00`);

  return {
    weekday: ["일", "월", "화", "수", "목", "금", "토"][date.getDay()],
    short: `${date.getMonth() + 1}.${date.getDate()}`,
  };
}

export default function WeatherPopover(props: WeatherPopoverProps) {
  return <WeatherContent key={props.locationName.trim()} {...props} />;
}

function WeatherContent({ locationName, className }: WeatherPopoverProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (open || !mounted) return;

    const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 1
      : 280;

    const timer = window.setTimeout(() => {
      setMounted(false);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [open, mounted]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const timeout = window.setTimeout(() => {
      controller.abort();
    }, 25_000);

    resolveRegionCoordinates(locationName, controller.signal)
      .then(({ latitude, longitude }) =>
        loadWeather(latitude, longitude, controller.signal),
      )
      .then((data) => {
        if (active) {
          setWeather(data);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (!active) return;

        setError(
          reason instanceof Error && reason.name !== "AbortError"
            ? reason.message
            : "날씨 요청 시간이 초과되었습니다.",
        );
      })
      .finally(() => {
        window.clearTimeout(timeout);
      });

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [locationName, attempt]);

  const { Icon, label } = describe(
    weather?.current.code ?? null,
    weather?.current.isDay,
  );

  const close = () => {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };

  const toggle = () => {
    if (open) {
      close();
      return;
    }

    setMounted(true);
    setOpen(true);
  };

  return (
    <>
      <S.Trigger
        ref={trigger}
        className={className}
        type="button"
        aria-expanded={open}
        aria-controls={mounted ? id : undefined}
        aria-haspopup="dialog"
        onClick={toggle}
      >
        <Icon aria-hidden="true" />

        <span>
          {locationName} ·{" "}
          {weather
            ? `${degrees(weather.current.temperature)} ${label}`
            : error
              ? "날씨 정보 없음"
              : "날씨 불러오는 중"}
        </span>

        <ChevronRight size={16} aria-hidden="true" />
      </S.Trigger>

      {mounted && (
        <Popup open={open} id={id} trigger={trigger} onClose={close}>
          <S.Handle />

          <S.Main>
            <S.Header>
              <div>
                <S.Location id={`${id}-title`}>{locationName}</S.Location>

                <S.Updated>
                  {weather
                    ? `${weather.current.time
                        .slice(5, 10)
                        .replace("-", ".")} · ${weather.current.time.slice(
                        11,
                        16,
                      )} 기준 (한국 시간)`
                    : "현재 날씨"}
                </S.Updated>
              </div>

              <S.Close type="button" aria-label="날씨 닫기" onClick={close}>
                <X aria-hidden="true" />
              </S.Close>
            </S.Header>

            {weather ? (
              <S.Current>
                <div className="condition">
                  <Icon aria-hidden="true" />
                  {label}
                </div>

                <div className="temperature">
                  {degrees(weather.current.temperature)}
                </div>

                <div className="feels">
                  체감온도 {degrees(weather.current.feels)}
                </div>

                <div className="highlow">
                  최고 <b>{degrees(weather.days[0]?.high)}</b>
                  {" · "}
                  최저 <b>{degrees(weather.days[0]?.low)}</b>
                </div>
              </S.Current>
            ) : (
              <S.Message role={error ? "alert" : "status"}>
                {error || "날씨를 불러오고 있어요."}

                {error && (
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setAttempt((value) => value + 1);
                    }}
                  >
                    다시 시도
                  </button>
                )}
              </S.Message>
            )}
          </S.Main>

          {weather && (
            <S.Lower>
              <S.Week aria-label="주간 예보">
                <h3>
                  <span>
                    <CalendarDays aria-hidden="true" />
                    주간 예보
                  </span>

                  <span className="hint">좌우로 밀어보기</span>
                </h3>

                <S.Forecast
                  ref={resetForecastScroll}
                  tabIndex={0}
                  aria-label="주간 예보, 가로 스크롤 가능"
                >
                  {weather.days.length ? (
                    weather.days.map((day, index) => {
                      const { Icon: DayIcon, label: dayLabel } = describe(
                        day.code,
                      );

                      const date = dateLabel(day.date);

                      return (
                        <div
                          className="day"
                          data-today={index === 0 ? "true" : undefined}
                          key={day.date}
                        >
                          <span className="date">
                            <strong>
                              {index === 0 ? "오늘" : date.weekday}
                            </strong>

                            <small>{date.short}</small>
                          </span>

                          <span className="weather">
                            <DayIcon role="img" aria-label={dayLabel} />
                          </span>

                          <span
                            className="rain"
                            aria-label={`예상 강수확률 ${
                              day.rain == null ? "정보 없음" : `${day.rain}%`
                            }`}
                          >
                            {day.rain == null ? "—" : `${day.rain}%`}
                          </span>

                          <span className="range">
                            <span
                              className="low"
                              aria-label={`최저 ${degrees(day.low)}`}
                            >
                              {degrees(day.low)}
                            </span>

                            <span aria-label={`최고 ${degrees(day.high)}`}>
                              {degrees(day.high)}
                            </span>
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <S.Message>주간 예보 정보가 없습니다.</S.Message>
                  )}
                </S.Forecast>
              </S.Week>

              <S.Footer>
                <span>강수확률 · 최저 / 최고</span>

                <a
                  href="https://open-meteo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open-Meteo ↗
                </a>
              </S.Footer>
            </S.Lower>
          )}
        </Popup>
      )}
    </>
  );
}

type PopupProps = {
  open: boolean;
  id: string;
  trigger: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  children: ReactNode;
};

function Popup({ open, id, trigger, onClose, children }: PopupProps) {
  const panel = useRef<HTMLDivElement>(null);
  const closeCallback = useRef(onClose);

  useEffect(() => {
    closeCallback.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const node = panel.current;
    const button = trigger.current;

    if (!node || !button) return;

    const media = window.matchMedia("(max-width: 767px)");

    const previousOverflow = document.body.style.overflow;

    const position = () => {
      // 모바일은 CSS의 바텀시트 위치를 사용합니다.
      if (media.matches) {
        node.style.removeProperty("left");
        node.style.removeProperty("top");
        return;
      }

      // transform을 사용하지 않아 modalAnimation과 충돌하지 않습니다.
      const width = node.offsetWidth;
      const height = node.offsetHeight;

      node.style.left = `${Math.max(12, (window.innerWidth - width) / 2)}px`;

      node.style.top = `${Math.max(12, (window.innerHeight - height) / 2)}px`;
    };

    const sync = () => {
      document.body.style.overflow = media.matches
        ? "hidden"
        : previousOverflow;

      position();
    };

    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !node.contains(event.target) &&
        !button.contains(event.target)
      ) {
        closeCallback.current();
      }
    };

    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCallback.current();
        return;
      }

      if (event.key !== "Tab" || !media.matches) {
        return;
      }

      const items = Array.from(
        node.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], [tabindex="0"]',
        ),
      );

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    sync();

    node
      .querySelector<HTMLButtonElement>("button")
      ?.focus({ preventScroll: true });

    const observer = new ResizeObserver(position);
    observer.observe(node);

    window.addEventListener("resize", sync);
    media.addEventListener("change", sync);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyboard);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      media.removeEventListener("change", sync);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyboard);

      document.body.style.overflow = previousOverflow;
    };
  }, [trigger]);

  return createPortal(
    <S.Layer>
      <S.Backdrop />

      <S.Panel
        data-open={open}
        id={id}
        ref={panel}
        role="dialog"
        aria-labelledby={`${id}-title`}
        tabIndex={-1}
      >
        {children}
      </S.Panel>
    </S.Layer>,
    document.body,
  );
}
