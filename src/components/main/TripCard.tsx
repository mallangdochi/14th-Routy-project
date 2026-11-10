import { CalendarDays, MoreVertical, Users } from "lucide-react";
import { useEffect, useState } from "react";
import TripRoleBadge from "./TripRoleBadge";
import {
  tripStatusColors,
  // type TripPermission,
} from "../../utils/tripPermissions";
// import { useEffect, useState } from "react";
// import { CalendarDays, MapPin } from "lucide-react";
import defaultTripImage from "../../assets/where.webp";

import type { Trip, TripStatus } from "../../data/trips";
import { getTripBudget, type BudgetSnapshot } from "../../api/tripBudget";
import { TripCardStyle } from "./TripCardStyle";

export interface TripCardParticipant {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
}

interface TripCardProps {
  participants?: TripCardParticipant[];
  participantCount?: number;
  trip: Trip;
  view: "grid" | "list";
  permission?: "owner" | "editor" | "viewer";
  onOpen?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// type TripMenuAction = "" | "edit" | "delete";

// const tripMenuOptions: {
//   value: TripMenuAction;
//   label: string;
// }[] = [
//   { value: "edit", label: "여행 수정" },
//   { value: "delete", label: "여행 삭제" },
// ];

const statusLabels: Record<TripStatus, string> = {
  PLANNING: "계획중",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
};

const DAY_MS = 86400000;

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${year}.${month}.${day}`;
};

const getDateValue = (date: string) => Date.parse(`${date}T00:00:00Z`);

const getTripDuration = (start: string, end: string) => {
  const days =
    Math.round((getDateValue(end) - getDateValue(start)) / DAY_MS) + 1;

  if (!Number.isFinite(days) || days <= 0) return "";

  return `${days - 1}박 ${days}일`;
};

const getTodayValue = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const getPart = (type: "year" | "month" | "day") =>
    parts.find((part) => part.type === type)?.value ?? "";

  return getDateValue(
    `${getPart("year")}-${getPart("month")}-${getPart("day")}`,
  );
};

const getCountdown = (startDate: string) => {
  const days = Math.round((getDateValue(startDate) - getTodayValue()) / DAY_MS);

  if (!Number.isFinite(days)) return "-";
  if (days === 0) return "D-day";

  return days > 0 ? `D-${days}` : `D+${Math.abs(days)}`;
};

const getCurrentTripDay = (startDate: string, endDate: string) => {
  const start = getDateValue(startDate);
  const end = getDateValue(endDate);
  const today = getTodayValue();

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !Number.isFinite(today) ||
    end < start
  ) {
    return "-";
  }

  const duration = Math.round((end - start) / DAY_MS) + 1;
  const currentDay = Math.floor((today - start) / DAY_MS) + 1;

  return Math.min(duration, Math.max(1, currentDay));
};

const formatWon = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;

/**
 * 완료 카드에만 마운트합니다.
 * 기존 가계부 API로 예산과 전체 지출을 함께 조회합니다.
 */
function CompletedTripSummary({ tripId }: { tripId: string }) {
  const [result, setResult] = useState<
    | { status: "loading" }
    | { status: "success"; snapshot: BudgetSnapshot }
    | { status: "error"; message: string }
  >({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    void getTripBudget(tripId, controller.signal)
      .then((snapshot) => {
        if (controller.signal.aborted) return;

        setResult({ status: "success", snapshot });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        setResult({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "예산과 지출을 불러오지 못했습니다.",
        });
      });

    return () => controller.abort();
  }, [tripId]);

  if (result.status === "loading") {
    return (
      <span className="trip-summary-message" role="status">
        예산·지출 불러오는 중…
      </span>
    );
  }

  if (result.status === "error") {
    return (
      <span
        className="trip-summary-message"
        role="status"
        title={result.message}
      >
        예산·지출 조회 실패
      </span>
    );
  }

  const { trip, expenses } = result.snapshot;
  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <div className="trip-completed-summary">
      <span className="trip-amount">
        <span className="trip-amount-label">예산</span>
        {trip.budget === null ? "미설정" : formatWon(trip.budget)}
      </span>

      <span className="trip-summary-dot" aria-hidden="true">
        ·
      </span>

      <span className="trip-amount">
        <span className="trip-amount-label">지출</span>
        {formatWon(totalExpense)}
      </span>
    </div>
  );
}

export default function TripCard({
  trip,
  view,
  onOpen,
  permission,
  onEdit,
  onDelete,
  participants: suppliedParticipants,
  participantCount,
}: TripCardProps) {
  const savedImage = trip.image?.trim() || "";
  const [regionPhoto, setRegionPhoto] = useState<{
    region: string;
    image: string | null;
  } | null>(null);
  const [brokenImage, setBrokenImage] = useState<string | null>(null);

  // DB의 여행 목록에는 이미지 필드가 없는 경우가 있어, 지역명으로 사진을 조회합니다.
  useEffect(() => {
    const region = trip.region?.trim();
    if (savedImage || !region) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ name: region });
    void fetch(`/api/tour/region-photo?${params.toString()}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const body: unknown = await response.json();
        const value =
          body && typeof body === "object"
            ? (body as { image?: unknown }).image
            : null;
        if (typeof value !== "string") return null;
        try {
          return new URL(value).protocol === "https:" ? value : null;
        } catch {
          return null;
        }
      })
      .then((image) => {
        if (!controller.signal.aborted) setRegionPhoto({ region, image });
      })
      .catch(() => {
        if (!controller.signal.aborted) setRegionPhoto({ region, image: null });
      });

    return () => controller.abort();
  }, [trip.region, savedImage]);

  const remoteImage =
    regionPhoto?.region === trip.region.trim() ? regionPhoto.image : null;
  const preferredImage = savedImage || remoteImage || defaultTripImage;
  const imageSource =
    brokenImage === preferredImage ? defaultTripImage : preferredImage;
  const [menuOpen, setMenuOpen] = useState(false);

  const [memberResult, setMemberResult] = useState<{
    tripId: string;
    participants: TripCardParticipant[];
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (suppliedParticipants !== undefined) return;
    const controller = new AbortController();
    const query = new URLSearchParams({
      operation: "participants",
      tripId: trip.id,
    });
    void fetch(`/api/trips/share?${query}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data: unknown = await response.json().catch(() => null);
        if (!response.ok) throw new Error("참여자를 불러오지 못했습니다.");
        if (
          !data ||
          typeof data !== "object" ||
          !("tripId" in data) ||
          data.tripId !== trip.id ||
          !("participants" in data) ||
          !Array.isArray(data.participants)
        ) {
          throw new Error("참여자 응답을 확인하지 못했습니다.");
        }
        const unique = new Map<string, TripCardParticipant>();
        for (const value of data.participants as unknown[]) {
          if (
            !value ||
            typeof value !== "object" ||
            !("userId" in value) ||
            typeof value.userId !== "string" ||
            !value.userId ||
            !("nickname" in value) ||
            typeof value.nickname !== "string" ||
            !("participating" in value) ||
            typeof value.participating !== "boolean" ||
            !("permission" in value) ||
            !["owner", "editor", "viewer"].includes(String(value.permission))
          ) {
            throw new Error("참여자 응답 형식을 확인해주세요.");
          }
          if (!value.participating) continue;
          unique.set(value.userId, {
            id: value.userId,
            name: value.nickname,
            avatarUrl:
              value.permission !== "viewer" &&
              "avatarUrl" in value &&
              typeof value.avatarUrl === "string"
                ? value.avatarUrl
                : null,
          });
        }
        if (!controller.signal.aborted) {
          setMemberResult({
            tripId: trip.id,
            participants: [...unique.values()],
          });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setMemberResult({
            tripId: trip.id,
            participants: [],
            error: error instanceof Error ? error.message : "참여자 조회 실패",
          });
        }
      });
    return () => controller.abort();
  }, [trip.id, suppliedParticipants]);

  const currentMembers = memberResult?.tripId === trip.id ? memberResult : null;
  const participants =
    suppliedParticipants ?? currentMembers?.participants ?? [];
  const membersLoading =
    suppliedParticipants === undefined && currentMembers === null;
  const membersError =
    suppliedParticipants === undefined ? currentMembers?.error : undefined;
  const totalParticipants = Math.max(
    participants.length,
    typeof participantCount === "number" && Number.isFinite(participantCount)
      ? Math.max(0, Math.floor(participantCount))
      : 0,
  );
  const visibleParticipants = participants.slice(0, 2);
  const remainingCount = totalParticipants - visibleParticipants.length;

  return (
    <TripCardStyle
      className={`trip-card view-${view}`}
      onClick={() => onOpen?.(trip.id)}
    >
      <button
        type="button"
        className="trip-image-button"
        onClick={(event) => {
          event.stopPropagation();
          onOpen?.(trip.id);
        }}
        aria-label={`${trip.title} 여행 일정 보기`}
      >
        <div className="trip-image-wrapper">
          <img
            key={imageSource}
            src={imageSource}
            alt={`${trip.region} 여행 이미지`}
            loading="lazy"
            style={{ width: "100%" }}
            onError={() => setBrokenImage(imageSource)}
          />

          <span
            className={`trip-badge ${trip.status.toLowerCase()}`}
            style={tripStatusColors[trip.status]}
          >
            {statusLabels[trip.status]}
          </span>
        </div>
      </button>

      <div className="trip-content">
        <div className="trip-heading">
          <button
            type="button"
            className="trip-title-button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen?.(trip.id);
            }}
          >
            {view === "list" && (
              <span
                className={`trip-badge ${trip.status.toLowerCase()}`}
                style={tripStatusColors[trip.status]}
              >
                {statusLabels[trip.status]}
              </span>
            )}

            <h2>{trip.title}</h2>
          </button>

          {permission === "owner" && (
            <div className="trip-menu">
              <button
                type="button"
                className="trip-menu-trigger"
                aria-label={`${trip.title} 관리 메뉴`}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <MoreVertical aria-hidden="true" />
              </button>

              {menuOpen && (
                <div className="trip-menu-dropdown">
                  <button
                    type="button"
                    onClick={() => {
                      onEdit?.(trip.id);
                      setMenuOpen(false);
                    }}
                  >
                    여행 수정
                  </button>

                  <button
                    type="button"
                    className="delete"
                    onClick={() => {
                      onDelete?.(trip.id);
                      setMenuOpen(false);
                    }}
                  >
                    여행 삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="trip-card-desc">
          <p className="trip-date">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            {" · "}
            {getTripDuration(trip.startDate, trip.endDate)}
          </p>

          <div className="trip-members-row">
            <div
              className="trip-members"
              aria-busy={membersLoading}
              aria-label={
                membersLoading
                  ? "참여자 확인 중"
                  : membersError
                    ? "참여자 조회 실패"
                    : `참여 인원 ${totalParticipants}명`
              }
            >
              {(membersLoading || membersError) && (
                <span
                  className="trip-member-count"
                  role="status"
                  title={membersError}
                >
                  {membersLoading ? "참여자 확인 중…" : "참여자 조회 실패"}
                </span>
              )}
              {visibleParticipants.length > 0 && (
                <div className="trip-member-avatars" aria-hidden="true">
                  {visibleParticipants.map((participant) => (
                    <span className="trip-member-avatar" key={participant.id}>
                      <span>
                        {participant.name?.trim().slice(0, 1) || <Users />}
                      </span>
                      {participant.avatarUrl && (
                        <img
                          src={participant.avatarUrl}
                          alt=""
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </span>
                  ))}
                </div>
              )}
              {!membersLoading &&
                !membersError &&
                (remainingCount > 0 || visibleParticipants.length === 0) && (
                  <span className="trip-member-count">
                    {visibleParticipants.length === 0 && (
                      <Users aria-hidden="true" />
                    )}
                    {visibleParticipants.length > 0
                      ? `외 ${remainingCount}명`
                      : `${totalParticipants}명`}
                  </span>
                )}
            </div>
            <TripRoleBadge permission={permission} />
          </div>

          <div className="trip-stats trip-status-summary">
            {trip.status === "PLANNING" && (
              <span className="trip-status-line">
                <CalendarDays aria-hidden="true" strokeWidth={1.5} />

                <strong className="trip-countdown">
                  {getCountdown(trip.startDate)}
                </strong>
              </span>
            )}

            {trip.status === "IN_PROGRESS" && (
              <span className="trip-status-line">
                <CalendarDays aria-hidden="true" strokeWidth={1.5} />
                여행 {getCurrentTripDay(trip.startDate, trip.endDate)}일차
              </span>
            )}

            {trip.status === "COMPLETED" && (
              <CompletedTripSummary key={trip.id} tripId={trip.id} />
            )}
          </div>
        </div>
      </div>
    </TripCardStyle>
  );
}
