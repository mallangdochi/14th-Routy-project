import { CalendarDays, MapPin, MoreVertical } from "lucide-react";
import type { Trip, TripStatus } from "../../data/trips";
import { TripCardStyle } from "./TripCardStyle";
import Dropdown from "../dropdown/Dropdown";

interface TripCardProps {
  trip: Trip;
  view: "grid" | "list";
  onOpen?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

type TripMenuAction = "" | "edit" | "delete";

const tripMenuOptions: {
  value: TripMenuAction;
  label: string;
}[] = [
  { value: "edit", label: "여행 수정" },
  { value: "delete", label: "여행 삭제" },
];

const statusLabels: Record<TripStatus, string> = {
  PLANNING: "계획중",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
};

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${year}.${month}.${day}`;
};

const getTripDuration = (start: string, end: string) => {
  const startTime = Date.parse(`${start}T00:00:00Z`);
  const endTime = Date.parse(`${end}T00:00:00Z`);
  const days = Math.round((endTime - startTime) / 86400000) + 1;

  if (!Number.isFinite(days) || days <= 0) return "";

  return `${days - 1}박 ${days}일`;
};

export default function TripCard({
  trip,
  view,
  onOpen,
  onEdit,
  onDelete,
}: TripCardProps) {
  return (
    <TripCardStyle
      className={`trip-card view-${view}`}
      onClick={() => onOpen?.(trip.id)}
    >
      <button
        type="button"
        className="trip-image-button"
        onClick={() => onOpen?.(trip.id)}
        aria-label={`${trip.title} 여행 일정 보기`}
      >
        <div className="trip-image-wrapper">
          <img src={trip.image} alt="" loading="lazy" />

          <span className={`trip-badge ${trip.status.toLowerCase()}`}>
            {statusLabels[trip.status]}
          </span>
        </div>
      </button>

      <div className="trip-content">
        <div className="trip-heading">
          <button
            type="button"
            className="trip-title-button"
            onClick={() => onOpen?.(trip.id)}
          >
            {view === "list" && (
              <span className={`trip-badge ${trip.status.toLowerCase()}`}>
                {statusLabels[trip.status]}
              </span>
            )}
            <h2>{trip.title}</h2>
          </button>

          <Dropdown<TripMenuAction>
            className="trip-menu"
            label={`${trip.title} 관리 메뉴`}
            value=""
            showLabel={false}
            trigger={<MoreVertical aria-hidden="true" />}
            options={tripMenuOptions}
            onChange={(action) => {
              if (action === "edit") {
                onEdit?.(trip.id);
              } else if (action === "delete") {
                onDelete?.(trip.id);
              }
            }}
          />
        </div>

        <p className="trip-date">
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          {" · "}
          {getTripDuration(trip.startDate, trip.endDate)}
        </p>

        <div className="trip-stats">
          <span>
            <MapPin aria-hidden="true" />
            추천 장소 <strong>{trip.places}</strong>
          </span>

          <span>
            <CalendarDays aria-hidden="true" />
            일정 <strong>{trip.schedules}</strong>
          </span>
        </div>
      </div>
    </TripCardStyle>
  );
}
