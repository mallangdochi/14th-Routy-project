import { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import defaultTripImage from "../../assets/where.webp";

import type { Trip, TripStatus } from "../../data/trips";

import { TripCardStyle } from "./TripCardStyle";
// import Dropdown from "../dropdown/Dropdown";

interface TripCardProps {
  trip: Trip;
  view: "grid" | "list";
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
  // onEdit,
  // onDelete,
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
        const value = body && typeof body === "object"
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

  const remoteImage = regionPhoto?.region === trip.region.trim()
    ? regionPhoto.image
    : null;
  const preferredImage = savedImage || remoteImage || defaultTripImage;
  const imageSource = brokenImage === preferredImage
    ? defaultTripImage
    : preferredImage;

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
            onClick={(event) => {
              event.stopPropagation();
              onOpen?.(trip.id);
            }}
          >
            {view === "list" && (
              <span className={`trip-badge ${trip.status.toLowerCase()}`}>
                {statusLabels[trip.status]}
              </span>
            )}

            <h2>{trip.title}</h2>
          </button>

          {/* <div onClick={(event) => event.stopPropagation()}>
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
          </div> */}
        </div>

        <div className="trip-card-desc">
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
      </div>
    </TripCardStyle>
  );
}
