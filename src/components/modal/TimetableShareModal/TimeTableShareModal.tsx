import { useEffect, useState } from "react";
import { FileText, Image as ImageIcon, Mail, Share2 } from "lucide-react";
import modalMascote from "../../../assets/go.webp";
import type { TripDay } from "../../../data/tripDays";
import * as S from "./TimeTableShareModalStyle";

type TimetableShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  days: TripDay[];
};

const COLORS = [
  { bg: "#E7F8F0", accent: "#087E64" },
  { bg: "#EAF2FF", accent: "#4774B5" },
  { bg: "#FFF0F0", accent: "#D96A77" },
  { bg: "#FFF4E6", accent: "#D78A3E" },
  { bg: "#F1EBFF", accent: "#8063BC" },
  { bg: "#EAF7F7", accent: "#318E94" },
];

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][
    new Date(year, month - 1, day).getDay()
  ];
  return `${month}월 ${day}일 (${weekday})`;
};

const timeToMinutes = (time?: string) => {
  if (!time || !/^\d{2}:\d{2}$/.test(time)) return null;
  const [hour, minute] = time.split(":").map(Number);
  if (hour > 23 || minute > 59) return null;
  return hour * 60 + minute;
};

const createScheduleText = (days: TripDay[]) => {
  const sortedDays = [...days].sort(
    (a, b) => a.date.localeCompare(b.date) || a.day - b.day,
  );

  const totalPlaces = sortedDays.reduce(
    (total, day) => total + day.places.length,
    0,
  );

  return [
    "✈️ ROUTY | 우리의 여행 시간표",
    "━━━━━━━━━━━━━━━━━━",
    `📍 ${sortedDays.length}일 여행 · 총 ${totalPlaces}개 일정`,
    "",
    ...sortedDays.flatMap((day) => {
      const sortedPlaces = [...day.places].sort((a, b) => {
        const aTime = timeToMinutes(a.startTime);
        const bTime = timeToMinutes(b.startTime);

        if (aTime === null) return 1;
        if (bTime === null) return -1;

        return aTime - bTime;
      });

      return [
        `📅 DAY ${day.day} | ${formatDate(day.date)}`,
        "──────────────────",
        ...(sortedPlaces.length > 0
          ? sortedPlaces.map((place) => {
              const time = place.startTime || "시간 미정";
              return `🕒 ${time}  ${place.name}`;
            })
          : ["등록된 일정이 없어요."]),
        "",
      ];
    }),
    "━━━━━━━━━━━━━━━━━━",
    "🌿 Routy와 함께하는 여행",
  ].join("\n");
};

const roundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string,
) => {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
};

const createScheduleImage = async (days: TripDay[]) => {
  const columnWidth = 190;
  const timeWidth = 72;
  const headerHeight = 160;
  const hourHeight = 100;
  const padding = 30;

  const times = days.flatMap((day) =>
    day.places
      .map((place) => timeToMinutes(place.startTime))
      .filter((value): value is number => value !== null),
  );

  const startHour =
    times.length > 0 ? Math.max(0, Math.floor(Math.min(...times) / 60)) : 8;

  const endHour =
    times.length > 0
      ? Math.min(24, Math.ceil(Math.max(...times) / 60) + 1)
      : 20;

  const gridHeight = (endHour - startHour) * hourHeight;
  const width = padding * 2 + timeWidth + days.length * columnWidth;
  const height = headerHeight + 60 + gridHeight + padding;

  const canvas = document.createElement("canvas");
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("이미지를 생성할 수 없습니다.");

  ctx.scale(scale, scale);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  roundedRect(ctx, padding, 25, width - padding * 2, 105, 14, "#E9FFF7");
  ctx.fillStyle = "#005259";
  ctx.font = "bold 30px sans-serif";
  ctx.fillText("Routy 여행 시간표", padding + 24, 72);
  ctx.fillStyle = "#63827C";
  ctx.font = "16px sans-serif";
  ctx.fillText("우리의 여행 기록", padding + 24, 103);

  const gridX = padding;
  const gridY = headerHeight + 45;

  ctx.fillStyle = "#F7FAFB";
  ctx.fillRect(gridX, gridY, width - padding * 2, gridHeight);

  ctx.strokeStyle = "#E6ECEF";
  ctx.lineWidth = 1;

  for (let hour = startHour; hour <= endHour; hour++) {
    const y = gridY + (hour - startHour) * hourHeight;
    ctx.beginPath();
    ctx.moveTo(gridX, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();

    if (hour < endHour) {
      ctx.fillStyle = "#81919A";
      ctx.font = "13px sans-serif";
      ctx.fillText(`${String(hour).padStart(2, "0")}:00`, gridX + 10, y + 18);
    }
  }

  days.forEach((day, dayIndex) => {
    const x = gridX + timeWidth + dayIndex * columnWidth;

    ctx.strokeStyle = "#E6ECEF";
    ctx.beginPath();
    ctx.moveTo(x, gridY);
    ctx.lineTo(x, gridY + gridHeight);
    ctx.stroke();

    ctx.fillStyle = "#24434A";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(formatDate(day.date), x + 10, gridY - 15, columnWidth - 20);

    day.places.forEach((place, placeIndex) => {
      const minutes = timeToMinutes(place.startTime);
      if (minutes === null) return;

      const palette = COLORS[placeIndex % COLORS.length];
      const cardX = x + 8;
      const cardY = gridY + ((minutes - startHour * 60) / 60) * hourHeight + 4;
      const cardWidth = columnWidth - 16;
      const cardHeight = 75;

      roundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 8, palette.bg);

      ctx.fillStyle = palette.accent;
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(place.name, cardX + 10, cardY + 27, cardWidth - 20);

      ctx.fillStyle = "#627B84";
      ctx.font = "12px sans-serif";
      ctx.fillText(place.startTime || "시간 미정", cardX + 10, cardY + 51);
    });
  });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("이미지 생성 실패"))),
      "image/png",
    );
  });
};

export default function TimetableShareModal({
  isOpen,
  onClose,
  days,
}: TimetableShareModalProps) {
  if (!isOpen) return null;

  return <TimetableShareModalContent onClose={onClose} days={days} />;
}

type TimetableShareModalContentProps = Omit<TimetableShareModalProps, "isOpen">;

function TimetableShareModalContent({
  onClose,
  days,
}: TimetableShareModalContentProps) {
  const [copied, setCopied] = useState<"text" | "image" | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const scheduleText = createScheduleText(days);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(scheduleText);
      setCopied("text");
    } catch {
      alert("텍스트 복사에 실패했습니다.");
    }
  };

  const copyImage = async () => {
    if (busy) return;
    setBusy(true);

    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
        throw new Error("이미지 복사를 지원하지 않습니다.");
      }

      const imagePromise = createScheduleImage(days);

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": imagePromise,
        }),
      ]);

      setCopied("image");
    } catch {
      alert("이미지 복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <S.ShareOverlay onClick={onClose}>
      <S.ShareModal
        role="dialog"
        aria-modal="true"
        aria-label="여행 시간표 공유하기"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 상단 배너 */}
        <S.PreviewBanner>
          <S.PreviewBannerText>
            <h2>여행 시간표를 공유해요!</h2>
            <p>우리의 여행 일정을 공유해요</p>
          </S.PreviewBannerText>

          <S.ShareMascot aria-hidden="true">
            <img src={modalMascote} alt="" />
          </S.ShareMascot>
        </S.PreviewBanner>

        <S.PreviewModalBody>
          {/* 시간표 미리보기 */}
          <S.PreviewSection>
            <S.PreviewTitle>여행 시간표 미리보기</S.PreviewTitle>

            <S.PreviewThumbnail>
              <S.ThumbnailCanvas>
                <S.ThumbnailHeader>
                  <strong>Routy 여행 시간표</strong>
                  <span>
                    {days.length}일 ·{" "}
                    {days.reduce((total, day) => total + day.places.length, 0)}
                    개 일정
                  </span>
                </S.ThumbnailHeader>

                <S.ThumbnailTable>
                  {days.map((day) => (
                    <S.ThumbnailDay key={day.id}>
                      <S.ThumbnailDayTitle>
                        <strong>DAY {day.day}</strong>
                        <span>{formatDate(day.date)}</span>
                      </S.ThumbnailDayTitle>

                      <S.ThumbnailPlaces>
                        {day.places.map((place, index) => (
                          <S.ThumbnailPlace
                            key={place.id}
                            $color={index % COLORS.length}
                          >
                            <span>{place.startTime || "미정"}</span>
                            <strong>{place.name}</strong>
                          </S.ThumbnailPlace>
                        ))}
                      </S.ThumbnailPlaces>
                    </S.ThumbnailDay>
                  ))}
                </S.ThumbnailTable>
              </S.ThumbnailCanvas>
            </S.PreviewThumbnail>
          </S.PreviewSection>

          {/* 복사 버튼 */}
          <S.ShareActionList>
            <S.ShareActionButton type="button" onClick={copyText}>
              <FileText size={20} />
              {copied === "text" ? "텍스트 복사 완료" : "텍스트 공유하기"}
            </S.ShareActionButton>

            <S.ShareActionButton
              type="button"
              disabled={busy}
              onClick={copyImage}
            >
              <ImageIcon size={20} />
              {busy
                ? "이미지 생성 중..."
                : copied === "image"
                  ? "이미지 복사 완료"
                  : "이미지 공유하기"}
            </S.ShareActionButton>
          </S.ShareActionList>

          {/* SNS 공유 */}
          <S.ShareSection>
            <S.ShareSectionTitle>
              <Share2 size={16} />
              <strong>다른 방법으로 공유</strong>
            </S.ShareSectionTitle>

            <S.SharePlatformList>
              <S.SharePlatformButton
                type="button"
                onClick={() => alert("네이버 공유는 추후 연결 예정입니다.")}
              >
                <S.SharePlatformIcon $platform="naver">N</S.SharePlatformIcon>
                네이버
              </S.SharePlatformButton>

              <S.SharePlatformButton
                type="button"
                onClick={() => alert("카카오톡 공유는 추후 연결 예정입니다.")}
              >
                <S.SharePlatformIcon $platform="kakao">
                  <S.KakaoBubble />
                </S.SharePlatformIcon>
                카카오톡
              </S.SharePlatformButton>

              <S.SharePlatformButton
                type="button"
                onClick={() => {
                  window.location.href =
                    `mailto:?subject=${encodeURIComponent("Routy 여행 시간표")}` +
                    `&body=${encodeURIComponent(scheduleText + "\n" + shareUrl)}`;
                }}
              >
                <S.SharePlatformIcon $platform="email">
                  <Mail size={25} />
                </S.SharePlatformIcon>
                이메일
              </S.SharePlatformButton>
            </S.SharePlatformList>
          </S.ShareSection>

          <S.BottomArea>
            <S.BottomCloseButton type="button" onClick={onClose}>
              닫기
            </S.BottomCloseButton>
          </S.BottomArea>
        </S.PreviewModalBody>
      </S.ShareModal>
    </S.ShareOverlay>
  );
}
