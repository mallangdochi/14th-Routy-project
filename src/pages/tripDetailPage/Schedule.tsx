import { Global } from "@emotion/react";
import Dropdown from "../../components/dropdown/Dropdown";
import TimePicker from "../../components/pickers/TimePicker";
import { loadKakaoMaps, getKakaoMapKey } from "../../api/kakao/kakaoSdk";
import {
  DEFAULT_MAP_CENTER,
  resolveKakaoPlace,
} from "../../api/kakao/kakaoPlaces";
import type {
  KakaoMapsSDK,
  MapInstance,
  OverlayInstance,
} from "../../api/kakao/kakaoTypes";
import type { KakaoStop, LocatedStop } from "../../api/kakao/kakaoPlaces";

import { renderToStaticMarkup } from "react-dom/server";
import {
  loadTripParticipants,
  getSharedTripDetail,
  getTripMembers,
  saveTripMembers,
  leaveTrip,
  type TripMembersResult,
} from "../../api/tripSharing";
import TripParticipants, {
  type TripParticipantsSource,
} from "../../components/modal/trip-participants/TripParticipants";
import { createPortal } from "react-dom";
import RegionSelectModal from "../../components/modal/travel-region-selector/RegionSelectModal";
import { searchTravelRegions } from "../../api/kakao/searchTravelRegions";
import {
  searchPlaceModal,
  getKnownModalPlace,
} from "../../api/kakao/searchPlaceModal";
import React, { useEffect, useId, useRef, useState } from "react";
import {
  TriangleAlert,
  CircleX,
  Check,
  Pencil,
  Plus,
  CalendarDays,
  MapPin,
  Wallet,
  ClipboardCheck,
  Cloud,
  CarFront,
  TrainFront,
  TramFront,
  BusFront,
  CarTaxiFront,
  Footprints,
  Plane,
  type LucideIcon,
  Camera,
  Utensils,
  Coffee,
  BedDouble,
  ShoppingBag,
  Trash2,
  X,
  Route,
  Minus,
  LocateFixed,
  Save,
  GripVertical,
  ChevronDown,
  LayoutGrid,
  Users,
} from "lucide-react";
import avatarP1 from "../../assets/profileAvatars/P1.webp";
import avatarP2 from "../../assets/profileAvatars/P2.webp";
import avatarP3 from "../../assets/profileAvatars/P3.webp";
import avatarP7 from "../../assets/profileAvatars/P7.webp";
import avatarP8 from "../../assets/profileAvatars/P8.webp";
import avatarP9 from "../../assets/profileAvatars/P9.webp";
import avatarP10 from "../../assets/profileAvatars/p10.webp";
import avatarP11 from "../../assets/profileAvatars/P11.webp";
import avatarP12 from "../../assets/profileAvatars/P12.webp";
import avatarP13 from "../../assets/profileAvatars/P13.webp";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import type { SavedTrip } from "../../api/trips";
import { useAuth } from "../../contexts/AuthContext";
import defaultTripImage from "../../assets/where.webp";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import * as S from "./ScheduleStyle";
import { RouteMapDetails, buildDisplayRoutes, routeColor, useTouchMap, type RouteSelection, type TravelMode } from "../../components/map/RouteMapInfo";
import KakaoMap from "../../components/kakaoMap/KakaoMap";
import { getKakaoMapPointUrl } from "../../api/kakao/kakaoLinks";
import MapSearchOverlay, { type SearchedMapPlace } from "../../components/map/MapSearchOverlay";
import { getAllowedCurrentLocation, LOCATION_CHANGE_EVENT } from "../../utils/locationService";
import TravelRouteSummary, {
  type RouteLine,
} from "../../components/Schedule/TravelRouteSummary";
import KakaoTravelMap, { type KakaoPlace } from "../../map/KakaoTravelMap";
import ShareModal from "../../components/modal/share/ShareModal";
import MobileHeader from "../../components/mobileBanner/MobileHeader";
import MobileNav from "../../components/mobileBanner/MobileFooter";
import Breadcrumb from "../../components/MainSidebar/mainHeader/Breadcrumb";
import TripChecklist from "../../components/checklist/TripChecklist";
import TravelBudgetTab from "../../components/travelBudget/TravelBudgetTab";
import { getTripDays, saveTripDays } from "../../api/tripDays";
import {
  getTripPlaces,
  appendTripPlaces,
  replaceTripPlaces,
  type TripPlacesResult,
} from "../../api/tripPlaces";
import TripDateModal from "../../components/modal/updateTrpDate/TripDateModal";

import {
  normalizeTripDates,
  reindexTripDays,
  remapStopsByDate,
} from "../../utils/tripDateUtils";
import { saveTripName } from "../../api/tripName";
import Loader from "../../components/loader/Loader";

import PlaceAddModal, {
  type Props as PlaceModalProps,
  type ScheduledPlace,
} from "../../components/modal/add-plan/PlaceAddModal";
// 실제 빈 일정 이미지 파일명에 맞게 변경하세요.
import emptyScheduleImage from "../../assets/where2.webp";
import TripPeopleModal, {
  type TripMemberChanges,
} from "../../components/modal/select-trip-people/TripPeopleModal";
import TripInviteGate from "../../components/modal/trip-invite-gate/TripInviteGate";

export type PlaceModalSource = Pick<
  PlaceModalProps,
  | "loadPlaces"
  | "savedPlaces"
  | "onToggleSave"
  | "defaultTransport"
  | "defaultTransportLabel"
  | "transportOptions"
>;
type ScheduleProps = {
  placeModalSource?: PlaceModalSource;
  loadParticipants?: TripParticipantsSource;
};
const livePlacesSource: PlaceModalSource = {
  savedPlaces: [],
  // 기본 교통수단을 비워두면 PlaceAddModal이 일정 추가를 차단합니다.
  defaultTransport: "자동차",
  defaultTransportLabel: "자동차",
  // 각 팀의 PlaceAddModal에서 transportOptions를 필수 속성으로 정의한 경우를 지원합니다.
  transportOptions: [],
  loadPlaces: (async (...args: unknown[]) =>
    searchPlaceModal(...args)) as PlaceModalSource["loadPlaces"],
  onToggleSave: () => {
    // 저장 장소 API는 팀의 별도 기능입니다. 성공한 척하지 않습니다.
    window.alert("저장 장소 기능은 별도 API 연결이 필요합니다.");
  },
};

type ScheduleTrip = SavedTrip & {
  dates: string[];
  schedule: TripPlacesResult;
  permission?: "owner" | "editor" | "viewer";
};

type Category = "맛집" | "카페" | "관광지" | "숙소" | "쇼핑" | "교통";

type Stop = {
  id: number;
  title: string;
  time: string;
  description: string;
  address: string;
  category: Category;
  image: string;
  x: number;
  y: number;
  placeId?: string;
  stayDurationMinutes?: number;
  transport?: string;
  // 다음 장소까지의 경로 API 결과(분). 교통수단별로 보관해 선택 변경 시 잘못된 시간을 표시하지 않습니다.
  travelMinutesByTransport?: Record<string, number>;
  lat?: number;
  lng?: number;
  externalId?: string;
  sourcePlaceId?: string;
};

// DB 응답을 날짜별 카드로 변환합니다. 빈 날짜는 빈 배열을 유지합니다.
function createStoredStopsByDay(
  schedule: TripPlacesResult,
  dates: string[],
): Record<number, Stop[]> {
  return Object.fromEntries(
    dates.map((date, index) => [
      index + 1,
      schedule.places
        .filter((place) => place.date === date)
        .map((place) => ({
          ...place,
          placeId: place.placeId ?? undefined,
          transport: place.transport ?? undefined,
          image: place.image?.trim() || defaultTripImage,
          lat: typeof place.lat === "number" ? place.lat : undefined,
          lng: typeof place.lng === "number" ? place.lng : undefined,
        })),
    ]),
  );
}

type Day = {
  id: number;
  date: string;
  isoDate: string;
  weekday: string;
  image: string;
};

type Tab = "schedule" | "map" | "budget" | "checklist";
type Filter = "전체" | Category;

const CATEGORY_ICONS = {
  맛집: Utensils,
  카페: Coffee,
  관광지: Camera,
  숙소: BedDouble,
  쇼핑: ShoppingBag,
  교통: CarFront,
};

const DEFAULT_PROFILE_IMAGES: Record<string, string> = {
  P1: avatarP1,
  P2: avatarP2,
  P3: avatarP3,
  P7: avatarP7,
  P8: avatarP8,
  P9: avatarP9,
  P10: avatarP10,
  P11: avatarP11,
  P12: avatarP12,
  P13: avatarP13,
};

const FILTERS: {
  key: Filter;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "전체", label: "전체", icon: MapPin },
  { key: "맛집", label: "맛집", icon: Utensils },
  { key: "카페", label: "카페", icon: Coffee },
  { key: "관광지", label: "관광지", icon: Camera },
  { key: "숙소", label: "숙소", icon: BedDouble },
  { key: "쇼핑", label: "쇼핑", icon: ShoppingBag },
];

const MAIN_TABS: {
  key: Tab;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    key: "schedule",
    label: "일정",
    icon: CalendarDays,
  },
  {
    key: "map",
    label: "지도",
    icon: MapPin,
  },
  {
    key: "budget",
    label: "예산",
    icon: Wallet,
  },
  {
    key: "checklist",
    label: "체크리스트",
    icon: ClipboardCheck,
  },
];

function createDay(isoDate: string, id: number, image = defaultTripImage): Day {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return {
    id,
    isoDate,
    date: `${isoDate.slice(5, 7)}.${isoDate.slice(8, 10)}`,
    weekday: weekdays[date.getUTCDay()],
    image,
  };
}

const moveStop = (
  items: Stop[],
  fromIndex: number,
  toIndex: number,
): Stop[] => {
  const result = [...items];
  const times = items.map((item) => item.time);

  const [moved] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, moved);

  return result.map((item, index) => ({
    ...item,
    time: times[index],
  }));
};

const TRANSPORT_ICONS: Record<string, LucideIcon> = {
  자동차: CarFront,
  기차: TrainFront,
  지하철: TramFront,
  버스: BusFront,
  택시: CarTaxiFront,
  도보: Footprints,
  비행기: Plane,
};

// 아이콘을 포함하는 일정 교통 선택기. 공용 Dropdown 파일은 수정하지 않습니다.
function StopTransportDropdown({
  value,
  defaultTransport,
  onChange,
}: {
  value: string;
  defaultTransport: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const options = [
    "",
    ...Object.keys(TRANSPORT_ICONS),
    ...(value && !(value in TRANSPORT_ICONS) ? [value] : []),
  ];
  const TriggerIcon = TRANSPORT_ICONS[value || defaultTransport] ?? MapPin;
  const close = () => setOpen(false);
  useEffect(() => {
    if (!present || open) return;
    const timer = window.setTimeout(() => setPresent(false), 240);
    return () => window.clearTimeout(timer);
  }, [open, present]);
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      )
        setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);
  return (
    <S.StopTransportDropdownRoot
      ref={rootRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          close();
          triggerRef.current?.focus();
        }
        if (
          !open ||
          !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
        )
          return;
        event.preventDefault();
        event.stopPropagation();
        const buttons = Array.from(
          event.currentTarget.querySelectorAll<HTMLButtonElement>(
            "[data-transport-option]",
          ),
        );
        const current = buttons.indexOf(
          document.activeElement as HTMLButtonElement,
        );
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? buttons.length - 1
              : (current +
                  (event.key === "ArrowDown" ? 1 : -1) +
                  buttons.length) %
                buttons.length;
        buttons[next]?.focus();
      }}
    >
      <button
        type="button"
        className="transport-trigger"
        ref={triggerRef}
        aria-label={`이용 예정 교통: ${value || "여행 기본 교통 사용"}`}
        aria-expanded={open}
        aria-controls={present ? id : undefined}
        onClick={() => {
          if (open) close();
          else {
            setPresent(true);
            setOpen(true);
          }
        }}
      >
        {value && <TriggerIcon size={20} aria-hidden="true" />}
        <span>{value || "여행 기본 교통 사용"}</span>
        <ChevronDown
          size={18}
          className="transport-chevron"
          aria-hidden="true"
        />
      </button>
      {present && (
        <S.StopTransportOptions
          id={id}
          data-open={open}
          inert={!open}
          aria-hidden={!open}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && !open)
              setPresent(false);
          }}
        >
          {options.map((option) => {
            const Icon = TRANSPORT_ICONS[option || defaultTransport] ?? MapPin;
            return (
              <button
                type="button"
                key={option}
                data-transport-option
                aria-pressed={value === option}
                onClick={() => {
                  onChange(option);
                  close();
                  triggerRef.current?.focus();
                }}
              >
                {option && <Icon size={20} aria-hidden="true" />}
                <span>{option || "여행 기본 교통 사용"}</span>
                {value === option && <Check size={17} aria-hidden="true" />}
              </button>
            );
          })}
        </S.StopTransportOptions>
      )}
    </S.StopTransportDropdownRoot>
  );
}

type StopCardProps = {
  stop: Stop;
  index: number;
  isEditMode: boolean;
  selected: boolean;
  previewOffset: number;
  defaultTransport: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  onUpdate: (patch: Partial<Stop>) => void;
  onSelect: (id: number) => void;
  draggingId: number | null;
  dragOverId: number | null;
  dragOverEdge: "before" | "after";
  onDragStart: (event: React.DragEvent<HTMLButtonElement>, id: number) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDragEnd: () => void;
  onHandlePointerDown: (
    event: React.PointerEvent<HTMLButtonElement>,
    id: number,
  ) => void;
  onHandlePointerMove: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onHandlePointerUp: (event: React.PointerEvent<HTMLButtonElement>) => void;
};

function ScheduleStopCard({
  stop,
  index,
  isEditMode,
  selected,
  previewOffset,
  defaultTransport,
  expanded,
  onToggleExpanded,
  onUpdate,
  onSelect,
  draggingId,
  dragOverId,
  dragOverEdge,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onHandlePointerDown,
  onHandlePointerMove,
  onHandlePointerUp,
}: StopCardProps) {
  const [editorPresent, setEditorPresent] = useState(expanded);
  const [previousExpanded, setPreviousExpanded] = useState(expanded);
  if (previousExpanded !== expanded) {
    setPreviousExpanded(expanded);
    if (expanded) setEditorPresent(true);
  }
  useEffect(() => {
    if (expanded || !editorPresent) return;
    const timer = window.setTimeout(() => setEditorPresent(false), 240);
    return () => window.clearTimeout(timer);
  }, [expanded, editorPresent]);
  const transport = stop.transport || defaultTransport;
  const TransportIcon = TRANSPORT_ICONS[transport] ?? MapPin;
  const travelMinutes = stop.travelMinutesByTransport?.[transport];
  const roundedMinutes =
    typeof travelMinutes === "number" &&
    Number.isFinite(travelMinutes) &&
    travelMinutes >= 0
      ? Math.ceil(travelMinutes)
      : null;
  const travelTimeLabel =
    roundedMinutes === null
      ? "예상 시간 정보 없음"
      : `약 ${roundedMinutes >= 60 ? `${Math.floor(roundedMinutes / 60)}시간${roundedMinutes % 60 ? ` ${roundedMinutes % 60}분` : ""}` : `${roundedMinutes}분`}`;
  return (
    <S.StopRow
      data-stop-row
      data-preview-offset={previewOffset}
      style={{ transform: `translateY(${previewOffset}px)` }}
      data-editor-present={isEditMode && editorPresent}
      data-stop-id={stop.id}
      data-edit-mode={isEditMode}
      $isDragging={draggingId === stop.id}
      $dropEdge={dragOverId === stop.id ? dragOverEdge : null}
      onDragOver={(event) => onDragOver(event, stop.id)}
      onDrop={(event) => onDrop(event, stop.id)}
    >
      <S.DragSlot data-edit-mode={isEditMode}>
        {isEditMode && (
          <S.DragHandle
            type="button"
            draggable={false}
            aria-label={`${stop.title} 순서 변경`}
            title="드래그하여 순서 변경"
            onDragStart={(event) => onDragStart(event, stop.id)}
            onDragEnd={onDragEnd}
            onPointerDown={(event) => onHandlePointerDown(event, stop.id)}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUp}
            onPointerCancel={onDragEnd}
            onLostPointerCapture={onDragEnd}
            onContextMenu={(event) => event.preventDefault()}
          >
            <GripVertical size={30} />
          </S.DragHandle>
        )}
      </S.DragSlot>

      <S.Timeline data-edit-mode={isEditMode}>
        {isEditMode ? (
          <S.StopCheckbox
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(stop.id)}
            aria-label={`${stop.title} 선택`}
          />
        ) : (
          <S.TimelineDot>{index + 1}</S.TimelineDot>
        )}
      </S.Timeline>

      <S.StopCard
        data-stop-card
        data-edit-mode={isEditMode}
        data-expanded={isEditMode && editorPresent}
      >
        {isEditMode && (
          <S.StopExpandTrigger
            type="button"
            aria-label={`${stop.title} 일정 편집 ${expanded ? "접기" : "펼치기"}`}
            aria-expanded={expanded}
            aria-controls={`stop-editor-${stop.id}`}
            onClick={onToggleExpanded}
          />
        )}
        <S.StopTime data-stop-time>
          <span>{stop.time}</span>
          <S.MobileStopCategory $category={stop.category}>
            {stop.category === "관광지"
              ? "관광"
              : stop.category === "맛집"
                ? "음식점"
                : stop.category}
          </S.MobileStopCategory>
        </S.StopTime>

        <S.StopImage
          data-stop-image
          src={stop.image || defaultTripImage}
          alt={stop.title}
          draggable={false}
          onError={(event) => {
            const image = event.currentTarget;
            if (image.getAttribute("src") !== defaultTripImage) {
              image.src = defaultTripImage;
            }
          }}
        />

        <S.StopDetails data-stop-details>
          <S.StopTitleLine>
            <strong>{stop.title}</strong>
            <S.StopCategoryBadge $category={stop.category}>
              {stop.category === "관광지"
                ? "관광"
                : stop.category === "맛집"
                  ? "음식점"
                  : stop.category}
            </S.StopCategoryBadge>
          </S.StopTitleLine>
          <small>
            <MapPin size={11} />
            <span className="stop-address-text" title={stop.address}>
              {stop.address}
            </span>
          </small>
        </S.StopDetails>
        {isEditMode && editorPresent && (
          <S.StopEditor
            data-open={expanded}
            inert={!expanded}
            aria-hidden={!expanded}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget && !expanded)
                setEditorPresent(false);
            }}
            id={`stop-editor-${stop.id}`}
            role="region"
            aria-label={`${stop.title} 일정 편집`}
          >
            <S.StopEditorRow>
              <span>일정 시작 시간</span>
              <S.StopTimePickerField>
                <TimePicker
                  label=""
                  value={stop.time}
                  placement="bottom"
                  onChange={(value) => onUpdate({ time: value })}
                />
              </S.StopTimePickerField>
            </S.StopEditorRow>
            <S.StopEditorRow>
              <span>예정 체류 시간</span>
              <div>
                <S.StopDurationFields>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    aria-label="예정 체류 시간 (시간)"
                    value={Math.floor((stop.stayDurationMinutes ?? 60) / 60)}
                    onChange={(event) => {
                      const hours = Math.max(
                        0,
                        Math.floor(Number(event.currentTarget.value) || 0),
                      );
                      onUpdate({
                        stayDurationMinutes:
                          hours * 60 + ((stop.stayDurationMinutes ?? 60) % 60),
                      });
                    }}
                  />
                  <span>시간</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    step={1}
                    aria-label="예정 체류 시간 (분)"
                    value={(stop.stayDurationMinutes ?? 60) % 60}
                    onChange={(event) => {
                      const minutes = Math.min(
                        59,
                        Math.max(
                          0,
                          Math.floor(Number(event.currentTarget.value) || 0),
                        ),
                      );
                      onUpdate({
                        stayDurationMinutes:
                          Math.floor((stop.stayDurationMinutes ?? 60) / 60) *
                            60 +
                          minutes,
                      });
                    }}
                  />
                  <span>분</span>
                </S.StopDurationFields>
                {/* <small>입력하지 않으면 1시간으로 설정돼요.</small> */}
              </div>
            </S.StopEditorRow>
            <S.StopEditorRow>
              <span>이용 예정 교통</span>
              <S.StopTransportField>
                <StopTransportDropdown
                  value={stop.transport ?? ""}
                  defaultTransport={defaultTransport}
                  onChange={(value) =>
                    onUpdate({ transport: value || undefined })
                  }
                />
                <S.StopTransportNotice role="status" aria-live="polite">
                  <TransportIcon size={18} aria-hidden="true" />
                  <span>
                    {transport || "여행 기본 교통"} · {travelTimeLabel}
                  </span>
                </S.StopTransportNotice>
              </S.StopTransportField>
            </S.StopEditorRow>
          </S.StopEditor>
        )}
      </S.StopCard>
    </S.StopRow>
  );
}

export default function Schedule(props: ScheduleProps) {
  const location = useLocation();
  const params = useParams();
  const tripId = params.tripId ?? params.id;
  return (
    <TripInviteGate key={tripId} tripId={tripId}>
      <SchedulePage key={location.key} {...props} />
    </TripInviteGate>
  );
}

function SchedulePage({
  placeModalSource = livePlacesSource,
  loadParticipants = loadTripParticipants,
}: ScheduleProps) {
  const params = useParams();
  const tripId = params.tripId ?? params.id;
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState<{
    userId: string;
    tripId: string;
    retry: number;
    trip: ScheduleTrip | null;
    error: string;
  } | null>(null);

  useEffect(() => {
    if (!userId || !tripId) return;

    const controller = new AbortController();

    void Promise.all([
      getSharedTripDetail(tripId, controller.signal),
      getTripDays(tripId, controller.signal),
      getTripPlaces(tripId, controller.signal),
    ])
      .then(([detail, tripDays, schedule]) => {
        if (controller.signal.aborted) return;

        const savedTrip = detail.trip;

        const trip: ScheduleTrip | null = savedTrip
          ? {
              ...savedTrip,
              permission: detail.permission,
              dates: tripDays.dates,
              schedule,
              startDate: tripDays.startDate,
              endDate: tripDays.endDate,
              updatedAt: tripDays.updatedAt,
            }
          : null;

        setResult({
          userId,
          tripId,
          retry,
          trip,
          error: trip ? "" : "여행이 없거나 조회 권한이 없습니다.",
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        setResult({
          userId,
          tripId,
          retry,
          trip: null,
          error:
            error instanceof Error
              ? error.message
              : "여행 정보를 불러오지 못했습니다.",
        });
      });

    return () => controller.abort();
  }, [userId, tripId, retry]);

  const current =
    result?.userId === userId &&
    result?.tripId === tripId &&
    result?.retry === retry &&
    (result.trip === null ||
      (result.trip.schedule != null &&
        Array.isArray(result.trip.schedule.places)))
      ? result
      : null;

  if (userId && tripId && current?.trip) {
    return (
      <ScheduleContent
        key={`${userId}:${tripId}`}
        selectedTrip={current.trip}
        placeModalSource={placeModalSource}
        loadParticipants={loadParticipants}
      />
    );
  }

  const isLoading = Boolean(userId && tripId && !current);

  const message = !userId
    ? "로그인 후 여행을 선택해주세요."
    : !tripId
      ? "내 여행에서 여행 카드를 선택해주세요."
      : current?.error || "여행이 없거나 조회 권한이 없습니다.";

  return (
    <S.Page>
      <S.SidebarArea>
        <MainSidebar />
      </S.SidebarArea>

      <S.MobileHeaderArea>
        <MobileHeader />
      </S.MobileHeaderArea>

      <S.MainContent>
        {isLoading ? (
          <Loader />
        ) : (
          <S.Container>
            <p role={current?.error ? "alert" : "status"}>{message}</p>

            {current?.error && (
              <S.SecondaryButton
                type="button"
                onClick={() => setRetry((value) => value + 1)}
              >
                다시 불러오기
              </S.SecondaryButton>
            )}

            <S.SecondaryButton type="button" onClick={() => navigate("/")}>
              내 여행으로 이동
            </S.SecondaryButton>
          </S.Container>
        )}
      </S.MainContent>

      <S.MobileNavArea>
        <MobileNav />
      </S.MobileNavArea>
    </S.Page>
  );
}

function ScheduleContent({
  selectedTrip,
  placeModalSource,
  loadParticipants,
}: {
  selectedTrip: ScheduleTrip;
  placeModalSource: PlaceModalSource;
  loadParticipants?: TripParticipantsSource;
}) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const canEditTrip =
    selectedTrip.permission === "owner" || selectedTrip.permission === "editor";

  const handleTimetable = () =>
    navigate(`/trips/${selectedTrip.id}`, {
      state: routerLocation.state,
    });

  // 여행 생성 시 선택한 이동수단을 우선 사용합니다.
  // DB 응답에 필드가 없으면 모달이 일정 추가를 차단하지 않도록 자동차를 기본값으로 사용합니다.
  const tripTransportFields = selectedTrip as ScheduleTrip & {
    transport?: string | null;
    defaultTransport?: string | null;
    transportation?: string | null;
  };
  const storedTransport =
    tripTransportFields.transport ||
    tripTransportFields.defaultTransport ||
    tripTransportFields.transportation;
  const modalDefaultTransport =
    (typeof storedTransport === "string" && storedTransport.trim()) ||
    (typeof placeModalSource.defaultTransport === "string" &&
      placeModalSource.defaultTransport.trim()) ||
    "자동차";
  const modalDefaultTransportLabel =
    (typeof storedTransport === "string" && storedTransport.trim()) ||
    (typeof placeModalSource.defaultTransportLabel === "string" &&
      placeModalSource.defaultTransportLabel.trim()) ||
    modalDefaultTransport;

  const [tripName, setTripName] = useState(selectedTrip.name);
  const [draftTripName, setDraftTripName] = useState(selectedTrip.name);
  const [isEditingTripName, setIsEditingTripName] = useState(false);
  const [isSavingTripName, setIsSavingTripName] = useState(false);
  const [tripNameError, setTripNameError] = useState("");

  const tripNameSavingRef = useRef(false);
  const tripNameEditButtonRef = useRef<HTMLButtonElement>(null);

  const [isTripNameMenuOpen, setIsTripNameMenuOpen] = useState(false);
  const tripNameMenuRef = useRef<HTMLDivElement>(null);
  const [isTripNameMenuMounted, setIsTripNameMenuMounted] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteDialogMounted, setIsDeleteDialogMounted] = useState(false);
  const [isDeletingTrip, setIsDeletingTrip] = useState(false);
  const [deleteTripError, setDeleteTripError] = useState("");
  const deletingTripRef = useRef(false);
  const deleteAliveRef = useRef(false);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const deleteCancelRef = useRef<HTMLButtonElement>(null);
  const deleteTitleId = React.useId();
  const deleteDescriptionId = React.useId();
  const deleteErrorId = React.useId();

  useEffect(() => {
    deleteAliveRef.current = true;
    return () => {
      deleteAliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isDeleteDialogMounted) return;

    const dialog = deleteDialogRef.current;
    if (!dialog) return;

    const tripNameEditButton = tripNameEditButtonRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    if (!dialog.open) dialog.showModal();

    deleteCancelRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;

      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      } else if (tripNameEditButton?.isConnected) {
        tripNameEditButton.focus({ preventScroll: true });
      }
    };
  }, [isDeleteDialogMounted]);

  useEffect(() => {
    if (isDeleteDialogOpen || !isDeleteDialogMounted) return;
    const timer = window.setTimeout(() => setIsDeleteDialogMounted(false), 320);
    return () => window.clearTimeout(timer);
  }, [isDeleteDialogOpen, isDeleteDialogMounted]);

  const openTripDeleteDialog = () => {
    if (selectedTrip.permission !== "owner" || deletingTripRef.current) return;
    setIsTripNameMenuOpen(false);
    setDeleteTripError("");
    setIsDeleteDialogMounted(true);
    setIsDeleteDialogOpen(true);
  };

  const closeTripDeleteDialog = () => {
    if (deletingTripRef.current) return;
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmTripDelete = async () => {
    if (
      !isDeleteDialogOpen ||
      deletingTripRef.current ||
      selectedTrip.permission !== "owner"
    )
      return;
    deletingTripRef.current = true;
    setIsDeletingTrip(true);
    setDeleteTripError("");
    try {
      const tripId = String(selectedTrip.id);
      const response = await fetch("/api/trips/delete", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }),
      });
      const value: unknown = await response.json().catch(() => null);
      const result =
        value && typeof value === "object"
          ? (value as Record<string, unknown>)
          : null;
      if (!response.ok) {
        throw new Error(
          typeof result?.message === "string"
            ? result.message
            : "여행을 삭제하지 못했습니다.",
        );
      }
      if (result?.tripId !== tripId || result.deleted !== true) {
        throw new Error(
          "삭제 결과를 확인하지 못했습니다. 내 여행 목록에서 확인해주세요.",
        );
      }
    } catch (reason: unknown) {
      deletingTripRef.current = false;
      if (deleteAliveRef.current) {
        setIsDeletingTrip(false);
        setDeleteTripError(
          reason instanceof Error
            ? reason.message
            : "여행을 삭제하지 못했습니다.",
        );
      }
      return;
    }
    if (deleteAliveRef.current) navigate("/", { replace: true });
  };

  useEffect(() => {
    if (!isTripNameMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !tripNameMenuRef.current?.contains(event.target)
      ) {
        setIsTripNameMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsTripNameMenuOpen(false);
      tripNameEditButtonRef.current?.focus();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTripNameMenuOpen]);

  const startEditingTripName = () => {
    setIsTripNameMenuOpen(false);
    setDraftTripName(tripName);
    setTripNameError("");
    setIsEditingTripName(true);
  };

  const finishEditingTripName = () => {
    setIsEditingTripName(false);
    setTripNameError("");

    requestAnimationFrame(() => {
      tripNameEditButtonRef.current?.focus();
    });
  };

  const cancelEditingTripName = () => {
    if (tripNameSavingRef.current) return;

    setDraftTripName(tripName);
    finishEditingTripName();
  };

  const handleSaveTripName = async () => {
    if (tripNameSavingRef.current) return;

    const name = draftTripName.trim();

    if (!name) {
      setTripNameError("여행 이름을 입력해주세요.");
      return;
    }

    if (name.length > 50) {
      setTripNameError("여행 이름은 50자 이내로 입력해주세요.");
      return;
    }

    if (name === tripName) {
      finishEditingTripName();
      return;
    }

    tripNameSavingRef.current = true;
    setIsSavingTripName(true);
    setTripNameError("");

    try {
      const saved = await saveTripName(String(selectedTrip.id), name);

      setTripName(saved.name);
      setDraftTripName(saved.name);
      finishEditingTripName();
    } catch (error) {
      setTripNameError(
        error instanceof Error
          ? error.message
          : "여행 이름을 저장하지 못했습니다.",
      );
    } finally {
      tripNameSavingRef.current = false;
      setIsSavingTripName(false);
    }
  };
  const [days, setDays] = useState<Day[]>(() =>
    selectedTrip.dates.map((date, index) => createDay(date, index + 1)),
  );

  const [activeDayId, setActiveDayId] = useState(() => {
    const date = searchParams.get("date");
    const index = date ? selectedTrip.dates.indexOf(date) : -1;
    return index >= 0 ? index + 1 : 1;
  });
  const [showDateModal, setShowDateModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [tripPeople, setTripPeople] = useState(selectedTrip.people);
  const [membersRevision, setMembersRevision] = useState(0);
  const [memberData, setMemberData] = useState<TripMembersResult | null>(null);
  const [memberLoadError, setMemberLoadError] = useState("");
  const [memberSession, setMemberSession] = useState(0);
  const [memberRetry, setMemberRetry] = useState(0);
  const openMembersModal = () => {
    setMemberData(null);
    setMemberLoadError("");
    setMemberSession((n) => n + 1);
    setShowPeopleModal(true);
  };
  useEffect(() => {
    if (!showPeopleModal) return;
    const controller = new AbortController();
    void getTripMembers(String(selectedTrip.id), controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setMemberData(result);
          setTripPeople(result.editorLimit);
          setMemberLoadError("");
        }
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setMemberLoadError(
            reason instanceof Error
              ? reason.message
              : "참여자를 불러오지 못했습니다.",
          );
      });
    return () => controller.abort();
  }, [showPeopleModal, selectedTrip.id, memberSession, memberRetry]);
  const handleMembersSaved = (editorLimit: number) => {
    setTripPeople(editorLimit);
    setMembersRevision((n) => n + 1);
  };
  const handleSaveMembers = async (changes: TripMemberChanges) => {
    const tripId = String(selectedTrip.id);
    const result = await saveTripMembers(tripId, changes);
    if (result.tripId !== tripId || result.editorLimit !== changes.editorLimit)
      throw new Error("저장 결과를 확인해주세요.");
    handleMembersSaved(result.editorLimit);
    return true;
  };
  const handleLeaveTrip = async () => {
    const tripId = String(selectedTrip.id);
    const result = await leaveTrip(tripId);
    if (result.tripId !== tripId || !result.left)
      throw new Error("탈퇴 결과를 확인해주세요.");
    setShowPeopleModal(false);
    navigate("/", { replace: true });
    return true;
  };
  const resolveMemberAvatar = (value: string | null | undefined) => {
    if (value?.startsWith("default:"))
      return DEFAULT_PROFILE_IMAGES[value.slice(8).toUpperCase()];
    return value || undefined;
  };
  const [selectedRegion, setSelectedRegion] =
    useState<React.ComponentProps<typeof RegionSelectModal>["value"]>(null);
  const tripRegion = selectedRegion?.name ?? selectedTrip.region;
  const tripRegionSavingRef = useRef(false);

  const handleSaveTripRegion = async (
    region: NonNullable<
      React.ComponentProps<typeof RegionSelectModal>["value"]
    >,
  ): Promise<void> => {
    if (tripRegionSavingRef.current) return;

    const nextRegion = region.name.trim();

    if (nextRegion === tripRegion) return;

    tripRegionSavingRef.current = true;

    try {
      const tripId = String(selectedTrip.id);

      const response = await fetch("/api/trips/share", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update",
          tripId,
          region: nextRegion,
        }),
      });

      const data: unknown = await response.json().catch(() => null);
      const result =
        data !== null && typeof data === "object"
          ? (data as Record<string, unknown>)
          : null;

      if (!response.ok) {
        throw new Error(
          typeof result?.message === "string"
            ? result.message
            : "여행 지역을 저장하지 못했습니다.",
        );
      }

      if (
        result?.tripId !== tripId ||
        result.region !== nextRegion ||
        typeof result.updatedAt !== "string"
      ) {
        throw new Error(
          "저장 결과를 확인하지 못했습니다. 새로고침 후 확인해주세요.",
        );
      }

      // 서버 저장에 성공한 뒤 화면에 반영합니다.
      setSelectedRegion({
        ...region,
        name: nextRegion,
      });
    } catch (error: unknown) {
      window.alert(
        error instanceof Error
          ? error.message
          : "여행 지역을 저장하지 못했습니다.",
      );

      setShowRegionModal(true);
    } finally {
      tripRegionSavingRef.current = false;
    }
  };
  const tripDateText = (() => {
    const first = days[0];
    const last = days[days.length - 1];

    if (!first || !last) return "";

    const calendarDays =
      Math.round(
        (Date.parse(`${last.isoDate}T00:00:00Z`) -
          Date.parse(`${first.isoDate}T00:00:00Z`)) /
          86400000,
      ) + 1;

    const duration =
      days.length === calendarDays
        ? calendarDays === 1
          ? "당일 여행"
          : `${calendarDays - 1}박 ${calendarDays}일`
        : `선택한 일정 ${days.length}일`;

    return (
      `${first.isoDate.replaceAll("-", ".")} - ` +
      `${last.isoDate.replaceAll("-", ".")} · ${duration}`
    );
  })();
  // 통계 화면에서 돌아오면 예산 탭을 다시 엽니다.
  const [activeTab, setActiveTab] = useState<Tab>(() =>
    searchParams.get("tab") === "budget" ? "budget" : "schedule",
  );

  const [stopsByDay, setStopsByDay] = useState<Record<number, Stop[]>>(() =>
    createStoredStopsByDay(selectedTrip.schedule, selectedTrip.dates),
  );

  const scheduleVersionRef = useRef(selectedTrip.schedule.version);
  const scheduleSaveLock = useRef(false);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedStopId, setExpandedStopId] = useState<number | null>(null);
  const [selectedStopIds, setSelectedStopIds] = useState<number[]>([]);
  const [stopDeleteIds, setStopDeleteIds] = useState<number[] | null>(null);
  const [isStopDeleteOpen, setIsStopDeleteOpen] = useState(false);
  const [editMapFitVersion, setEditMapFitVersion] = useState(0);
  const editAllSnapshotRef = useRef<Record<number, Stop[]> | null>(null);
  const toggleStopSelection = (id: number) => {
    setSelectedStopIds((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id],
    );
  };
  const [, setMenuId] = useState<number | null>(null);
  const editSnapshotRef = useRef<Stop[] | null>(null);

  const [showSaveStatus, setShowSaveStatus] = useState(false);

  useEffect(() => {
    if (!showSaveStatus) return;

    const timer = window.setTimeout(() => {
      setShowSaveStatus(false);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [showSaveStatus]);

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const [dragOverEdge, setDragOverEdge] = useState<"before" | "after">(
    "before",
  );
  const draggingIdRef = useRef<number | null>(null);
  const [dragRowStep, setDragRowStep] = useState(0);
  const touchPreviewRef = useRef<HTMLElement | null>(null);
  const previewOriginRef = useRef({ x: 0, y: 0 });
  useEffect(
    () => () => {
      touchPreviewRef.current?.remove();
    },
    [],
  );
  const prepareDragVisual = (handle: HTMLElement) => {
    const row = handle.closest<HTMLElement>("[data-stop-row]");
    if (!row) return;
    const gap = parseFloat(getComputedStyle(row.parentElement!).rowGap) || 0;
    setDragRowStep(row.getBoundingClientRect().height + gap);
    setExpandedStopId(null);
  };
  const moveTouchPreview = (x: number, y: number) => {
    const preview = touchPreviewRef.current;
    const drag = touchDragRef.current;
    if (preview && drag)
      preview.style.transform = `translate3d(${previewOriginRef.current.x + x - drag.startX}px, ${previewOriginRef.current.y + y - drag.startY - 5}px, 0) scale(1.025)`;
  };
  const touchDragRef = useRef<{
    pointerId: number;
    sourceId: number;
    startX: number;
    startY: number;
    list: HTMLElement;
    targetId: number | null;
    edge: "before" | "after";
    active: boolean;
  } | null>(null);

  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [placeModalDay, setPlaceModalDay] = useState<Day | null>(null);
  const openPlaceModal = () => {
    if (!canEditTrip) return;
    setPlaceModalDay(activeDay);
    setIsPlaceModalOpen(true);
  };
  const [editingStop, setEditingStop] = useState<Stop | null>(null);

  const [activeFilter, setActiveFilter] = useState<Filter>("전체");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [showRoute, setShowRoute] = useState(true);
  const [routeMode, setRouteMode] = useState<TravelMode>("walk");
  const [routePaths, setRoutePaths] = useState<RouteLine[]>([]);
  const [locatedStops, setLocatedStops] = useState<Record<number, { lat: number; lng: number }>>({});
  const [mapPlaceSaving, setMapPlaceSaving] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);

  const activeDay =
    days.find((day) => day.id === activeDayId) ??
    days[0] ??
    createDay(selectedTrip.startDate, 1);

  const stops = React.useMemo(
    () => stopsByDay[activeDayId] ?? [],
    [stopsByDay, activeDayId],
  );

  // 경로 API와 두 지도 탭이 동일한 좌표를 사용하도록 저장되지 않은 장소 좌표를 보완합니다.
  // 좌표는 화면의 메모리에서만 유지하며 DB에는 임의로 기록하지 않습니다.
  useEffect(() => {
    let cancelled = false;
    setLocatedStops({});
    if (!stops.some((stop) => !Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)))
      return () => { cancelled = true; };
    void loadKakaoMaps().then(async (sdk) => {
      const places = new sdk.services.Places();
      const resolved = await Promise.all(stops.map((stop) => resolveKakaoPlace(sdk, places, {
        id: stop.id, title: stop.title, address: stop.address,
        latitude: stop.lat, longitude: stop.lng,
      })));
      if (cancelled) return;
      const positions: Record<number, { lat: number; lng: number }> = {};
      resolved.forEach((point, index) => {
        if (point) positions[stops[index].id] = { lat: point.latitude, lng: point.longitude };
      });
      setLocatedStops(positions);
    }).catch(() => { /* 좌표가 조회되지 않은 구간은 경로 추정 없이 미조회로 표시 */ });
    return () => { cancelled = true; };
  }, [stops]);

  const routeStops = React.useMemo(() => stops.map((stop) => ({
    ...stop,
    lat: Number.isFinite(stop.lat) ? stop.lat : locatedStops[stop.id]?.lat,
    lng: Number.isFinite(stop.lng) ? stop.lng : locatedStops[stop.id]?.lng,
  })), [stops, locatedStops]);

  const selectedStopCount = stops.filter((stop) =>
    selectedStopIds.includes(stop.id),
  ).length;
  const allStopsSelected =
    stops.length > 0 && selectedStopCount === stops.length;
  const someStopsSelected = selectedStopCount > 0 && !allStopsSelected;
  const handleSelectAllStops = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEditTrip || !isEditMode) return;
    setSelectedStopIds(
      event.currentTarget.checked ? stops.map((stop) => stop.id) : [],
    );
  };
  const showMapPanel = activeTab === "map" || stops.length > 0;

  const visibleMapStops = routeStops.filter(
    (stop) => activeFilter === "전체" || stop.category === activeFilter,
  );

  const kakaoMapStops = React.useMemo(
    () =>
      routeStops.map((stop) => ({
        ...stop,
        latitude: stop.lat,
        longitude: stop.lng,
      })),
    [routeStops],
  );

  const updateStops = (updater: (previous: Stop[]) => Stop[]) => {
    if (!canEditTrip) return;
    setStopsByDay((previous) => ({
      ...previous,
      [activeDayId]: updater(previous[activeDayId] ?? []),
    }));

    setShowSaveStatus(false);
  };

  const getDragPreviewOffset = (index: number) => {
    if (draggingId === null || dragOverId === null) return 0;
    const sourceIndex = stops.findIndex((stop) => stop.id === draggingId);
    const targetIndex = stops.findIndex((stop) => stop.id === dragOverId);
    if (sourceIndex < 0 || targetIndex < 0) return 0;
    const insertion = targetIndex + (dragOverEdge === "after" ? 1 : 0);
    const destination = insertion - (sourceIndex < insertion ? 1 : 0);
    if (index > sourceIndex && index <= destination) return -dragRowStep;
    if (index < sourceIndex && index >= destination) return dragRowStep;
    return 0;
  };

  const resetDrag = () => {
    touchPreviewRef.current?.remove();
    touchPreviewRef.current = null;
    touchDragRef.current = null;
    draggingIdRef.current = null;
    setDraggingId(null);
    setDragOverId(null);
  };

  const toggleEditMode = () => {
    if (!canEditTrip) return;
    setExpandedStopId(null);
    setSelectedStopIds([]);

    if (!isEditMode) {
      editAllSnapshotRef.current = stopsByDay;
      editSnapshotRef.current = stops.map((stop) => ({
        ...stop,
      }));
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
      editSnapshotRef.current = null;
    }

    setShowSaveStatus(false);
    setMenuId(null);
    resetDrag();
  };

  const handleCancelEdit = () => {
    setExpandedStopId(null);
    setSelectedStopIds([]);

    if (editAllSnapshotRef.current) {
      setStopsByDay(editAllSnapshotRef.current);
      editAllSnapshotRef.current = null;
    } else if (editSnapshotRef.current) {
      const snapshot = editSnapshotRef.current;

      updateStops(() => snapshot);
    }

    editSnapshotRef.current = null;
    setIsEditMode(false);
    setMenuId(null);
    setShowSaveStatus(false);
    resetDrag();
  };

  const handleSave = async () => {
    if (!canEditTrip || scheduleSaveLock.current) return;
    scheduleSaveLock.current = true;
    setScheduleSaving(true);
    setScheduleError("");
    try {
      const payload = days.flatMap((day) =>
        (stopsByDay[day.id] ?? []).map((stop) => ({
          ...stop,
          date: day.isoDate,
        })),
      );
      const saved = await replaceTripPlaces(
        String(selectedTrip.id),
        scheduleVersionRef.current,
        payload,
      );
      scheduleVersionRef.current = saved.version;
      setStopsByDay(
        createStoredStopsByDay(
          saved,
          days.map((day) => day.isoDate),
        ),
      );

      setExpandedStopId(null);
      setSelectedStopIds([]);

      editAllSnapshotRef.current = null;
      setIsEditMode(false);
      setMenuId(null);
      resetDrag();
      editSnapshotRef.current = null;
      setShowSaveStatus(true);
    } catch (error) {
      setScheduleError(
        error instanceof Error ? error.message : "일정을 저장하지 못했습니다.",
      );
    } finally {
      scheduleSaveLock.current = false;
      setScheduleSaving(false);
    }
  };

  // 마우스·터치·펜 모두 포인터 캡처와 불투명한 카드 오버레이를 사용합니다.
  const handleTouchPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    id: number,
  ) => {
    if (!event.isPrimary || event.button !== 0 || !isEditMode) return;
    const list = event.currentTarget.closest("[data-stop-row]")?.parentElement;
    if (!list) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    touchDragRef.current = {
      pointerId: event.pointerId,
      sourceId: id,
      startX: event.clientX,
      startY: event.clientY,
      list,
      targetId: null,
      edge: "before",
      active: false,
    };
  };

  const handleTouchPointerMove = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    const drag = touchDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.active) {
      if (
        Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 6
      )
        return;
      drag.active = true;
      prepareDragVisual(event.currentTarget);
      const card = event.currentTarget
        .closest("[data-stop-row]")
        ?.querySelector<HTMLElement>("[data-stop-card]");
      if (card) {
        const preview = card.cloneNode(true) as HTMLElement;
        preview
          .querySelectorAll("[id]")
          .forEach((node) => node.removeAttribute("id"));
        preview.removeAttribute("id");
        preview
          .querySelectorAll("button, input, [role='region']")
          .forEach((node) => node.remove());
        const rect = card.getBoundingClientRect();
        previewOriginRef.current = { x: rect.left, y: rect.top };
        Object.assign(preview.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: `${Math.min(rect.width, window.innerWidth - 40)}px`,
          boxSizing: "border-box",
          margin: "0",
          pointerEvents: "none",
          zIndex: "10000",
          opacity: "1",
          backgroundColor: "#FFFFFF",
          filter: "none",
          transformOrigin: "center",
          willChange: "transform",
          transition: "none",
          boxShadow:
            "0 18px 42px rgba(13,62,65,.28), 0 4px 12px rgba(13,62,65,.14)",
          borderColor: "#00858A",
          borderRadius: "10px",
        });
        preview.setAttribute("aria-hidden", "true");
        document.body.appendChild(preview);
        touchPreviewRef.current = preview;
      }
      draggingIdRef.current = drag.sourceId;
      setDraggingId(drag.sourceId);
      setMenuId(null);
    }
    event.preventDefault();
    moveTouchPreview(event.clientX, event.clientY);
    const rows = Array.from(
      drag.list.querySelectorAll<HTMLElement>("[data-stop-id]"),
    );
    const listRect = drag.list.getBoundingClientRect();
    const withinX =
      event.clientX >= listRect.left - 32 &&
      event.clientX <= listRect.right + 32;
    const row = withinX
      ? rows.find((item) => {
          const top = listRect.top + item.offsetTop - drag.list.scrollTop;
          return (
            event.clientY >= top - 6 &&
            event.clientY <= top + item.offsetHeight + 6
          );
        })
      : undefined;
    drag.targetId = row ? Number(row.dataset.stopId) : null;
    if (row) {
      const top = listRect.top + row.offsetTop - drag.list.scrollTop;
      drag.edge =
        event.clientY < top + row.offsetHeight / 2 ? "before" : "after";
    }
    setDragOverId(drag.targetId === drag.sourceId ? null : drag.targetId);
    setDragOverEdge(drag.edge);
  };

  const handleTouchPointerUp = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    const drag = touchDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const { sourceId, targetId, edge, active } = drag;
    if (active && targetId !== null && sourceId !== targetId && isEditMode) {
      updateStops((previous) => {
        const fromIndex = previous.findIndex((item) => item.id === sourceId);
        const toIndex = previous.findIndex((item) => item.id === targetId);
        if (fromIndex < 0 || toIndex < 0) return previous;
        const insertionIndex = toIndex + (edge === "after" ? 1 : 0);
        const destinationIndex =
          insertionIndex - (fromIndex < insertionIndex ? 1 : 0);
        return destinationIndex === fromIndex
          ? previous
          : moveStop(previous, fromIndex, destinationIndex);
      });
    }
    resetDrag();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    id: number,
  ) => {
    if (!isEditMode) {
      event.preventDefault();
      return;
    }

    const handle = event.currentTarget;
    prepareDragVisual(handle);
    const row = handle.closest("[data-stop-row]");
    const card = row?.querySelector("[data-stop-card]") as HTMLElement | null;

    draggingIdRef.current = id;
    setDraggingId(id);
    setDragOverId(null);
    setMenuId(null);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(id));

    if (card) {
      const rect = card.getBoundingClientRect();
      const offsetX = Math.min(rect.width / 2, 80);
      const offsetY = rect.height / 2;

      event.dataTransfer.setDragImage(card, offsetX, offsetY);
    }
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    id: number,
  ) => {
    if (!isEditMode || draggingIdRef.current === null) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    const rect = event.currentTarget.getBoundingClientRect();
    setDragOverEdge(
      event.clientY <
        rect.top -
          Number(event.currentTarget.dataset.previewOffset || 0) +
          rect.height / 2
        ? "before"
        : "after",
    );
    setDragOverId(draggingIdRef.current === id ? null : id);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetId: number,
  ) => {
    event.preventDefault();

    const sourceId = draggingIdRef.current;

    if (sourceId === null || sourceId === targetId) {
      resetDrag();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const edge =
      event.clientY <
      rect.top -
        Number(event.currentTarget.dataset.previewOffset || 0) +
        rect.height / 2
        ? "before"
        : "after";

    updateStops((previous) => {
      const fromIndex = previous.findIndex((item) => item.id === sourceId);
      const toIndex = previous.findIndex((item) => item.id === targetId);

      if (fromIndex < 0 || toIndex < 0) {
        return previous;
      }

      const insertionIndex = toIndex + (edge === "after" ? 1 : 0);
      const destinationIndex =
        insertionIndex - (fromIndex < insertionIndex ? 1 : 0);
      if (destinationIndex === fromIndex) return previous;
      return moveStop(previous, fromIndex, destinationIndex);
    });

    resetDrag();
  };

  const hasStopTitle = (stop: Stop | null): stop is Stop => {
    if (stop?.title.trim()) return true;

    alert("장소 이름을 입력해주세요.");
    return false;
  };

  const saveEditedStop = () => {
    if (!hasStopTitle(editingStop)) return;

    const updated = editingStop;

    updateStops((previous) =>
      previous.map((item) => (item.id === updated.id ? updated : item)),
    );

    setEditingStop(null);
    setMenuId(null);
  };

  const deleteSelectedStops = () => {
    if (!canEditTrip || selectedStopIds.length === 0) return;
    setStopDeleteIds([...selectedStopIds]);
    setIsStopDeleteOpen(true);
  };
  const confirmSelectedStopDelete = () => {
    if (!canEditTrip || !stopDeleteIds) return;
    updateStops((previous) =>
      previous.filter((stop) => !stopDeleteIds.includes(stop.id)),
    );
    setSelectedStopIds((previous) =>
      previous.filter((id) => !stopDeleteIds.includes(id)),
    );
    setIsStopDeleteOpen(false);
  };

  const moveSelectedStops = (targetDayId: number) => {
    if (
      !canEditTrip ||
      targetDayId === activeDayId ||
      selectedStopIds.length === 0
    )
      return;
    const selectedIds = new Set(selectedStopIds);
    setStopsByDay((previous) => {
      const source = previous[activeDayId] ?? [];
      const moved = source.filter((stop) => selectedIds.has(stop.id));
      const target = previous[targetDayId] ?? [];
      const usedIds = new Set(target.map((stop) => stop.id));
      let nextId =
        Math.max(
          0,
          ...Object.values(previous)
            .flat()
            .map((stop) => stop.id),
        ) + 1;
      const appended = moved.map((stop) => {
        const id = usedIds.has(stop.id) ? nextId++ : stop.id;
        usedIds.add(id);
        return { ...stop, id };
      });
      return {
        ...previous,
        [activeDayId]: source.filter((stop) => !selectedIds.has(stop.id)),
        [targetDayId]: [...target, ...appended],
      };
    });
    setExpandedStopId(null);
    setSelectedStopIds([]);

    setShowSaveStatus(false);
    resetDrag();
  };

  const handleAddPlaces = async (places: ScheduledPlace[]) => {
    if (!canEditTrip) throw new Error("일정을 추가할 권한이 없습니다.");
    if (scheduleSaveLock.current)
      throw new Error("저장 중입니다. 잠시 후 다시 시도해주세요.");
    const targetDay = days.find(
      (day) => day.isoDate === placeModalDay?.isoDate,
    );
    if (!targetDay)
      throw new Error("추가할 날짜가 변경되었습니다. 다시 열어 주세요.");
    const added: Stop[] = places.map((place, index) => {
      // MY: recover Kakao metadata if PlaceAddModal omits coordinates/images.
      // DEV: keep persisted append and version/conflict detection below unchanged.
      const kakaoPlace = getKnownModalPlace(String(place.id));
      const placeWithCoords = place as ScheduledPlace & {
        lat?: number;
        lng?: number;
      };
      return {
        id: Date.now() + index,
        placeId: place.id,
        title: place.name,
        time: place.startTime,
        description: kakaoPlace?.description ?? "",
        address: place.address || kakaoPlace?.address || "",
        category: Object.prototype.hasOwnProperty.call(
          CATEGORY_ICONS,
          place.category,
        )
          ? (place.category as Category)
          : "관광지",
        image: place.image || kakaoPlace?.image || defaultTripImage,
        x: 50,
        y: 50,
        stayDurationMinutes: place.stayDurationMinutes || 60,
        transport: place.transport || modalDefaultTransport || undefined,
        lat:
          typeof placeWithCoords.lat === "number"
            ? placeWithCoords.lat
            : kakaoPlace?.lat,
        lng:
          typeof placeWithCoords.lng === "number"
            ? placeWithCoords.lng
            : kakaoPlace?.lng,
      };
    });
    scheduleSaveLock.current = true;
    try {
      // append는 이 날짜의 새 장소만 저장합니다. 다른 날짜/편집 중인 변경은 건드리지 않습니다.
      const saved = await appendTripPlaces(
        String(selectedTrip.id),
        targetDay.isoDate,
        added,
      );
      // 편집 중 다른 사용자의 변경이 있으면 이후 전체 저장 시 충돌을 감지하도록
      // 기존 버전을 유지합니다. 우리 append만 있었다면 한 버전 증가합니다.
      const previousVersion = scheduleVersionRef.current;
      if (!isEditMode || saved.version === previousVersion + 1)
        scheduleVersionRef.current = saved.version;
      const persisted = createStoredStopsByDay(
        saved,
        days.map((day) => day.isoDate),
      );
      const mergeAdded = (previous: Record<number, Stop[]>) => {
        const existing = previous[targetDay.id] ?? [];
        const addedIds = new Set(added.map((stop) => stop.placeId));
        const newStops = (persisted[targetDay.id] ?? []).filter(
          (stop) =>
            addedIds.has(stop.placeId) &&
            !existing.some((item) => item.placeId === stop.placeId),
        );
        return { ...previous, [targetDay.id]: [...existing, ...newStops] };
      };
      if (isEditMode) {
        setStopsByDay(mergeAdded);
        // 추가는 이미 DB에 저장되었습니다. 편집 취소로 사라지지 않도록 기준도 갱신합니다.
        if (editAllSnapshotRef.current)
          editAllSnapshotRef.current = mergeAdded(editAllSnapshotRef.current);
      } else setStopsByDay(persisted);
      setShowSaveStatus(false);
      setIsPlaceModalOpen(false);
    } finally {
      scheduleSaveLock.current = false;
    }
  };

  // 지도 검색 결과의 장소를 DB에 저장합니다. 화면 상태만 바꾸지 않습니다.
  const addPlaceFromKakao = async (place: SearchedMapPlace | KakaoPlace): Promise<void> => {
    if (!canEditTrip) throw new Error("일정을 편집할 권한이 없습니다.");
    if (scheduleSaveLock.current) throw new Error("다른 일정 저장이 진행 중입니다.");

    const added: Stop = {
      id: Date.now(),
      placeId: "id" in place && place.id ? place.id : "map-" + place.lat + "-" + place.lng,
      title: place.name,
      time: selectedTrip.startTime,
      description: "description" in place && place.description ? place.description : "카카오 지도에서 선택한 장소",
      address: place.address,
      category: "category" in place ? place.category : "관광지",
      image: defaultTripImage,
      x: 50,
      y: 50,
      stayDurationMinutes: 60,
      transport: modalDefaultTransport,
      lat: place.lat,
      lng: place.lng,
    };
    scheduleSaveLock.current = true;
    setMapPlaceSaving(true);
    try {
      const saved = await appendTripPlaces(String(selectedTrip.id), activeDay.isoDate, [added]);
      const previousVersion = scheduleVersionRef.current;
      if (!isEditMode || saved.version === previousVersion + 1) {
        scheduleVersionRef.current = saved.version;
      }
      const persisted = createStoredStopsByDay(saved, days.map((day) => day.isoDate));
      const mergeAdded = (previous: Record<number, Stop[]>) => {
        const oldDay = previous[activeDay.id] ?? [];
        const persistedDay = persisted[activeDay.id] ?? [];
        const newStops = persistedDay.filter((stop) =>
          stop.placeId === added.placeId &&
          !oldDay.some((entry) => entry.id === stop.id),
        );
        return { ...previous, [activeDay.id]: [...oldDay, ...newStops] };
      };
      if (isEditMode) {
        setStopsByDay(mergeAdded);
        if (editAllSnapshotRef.current) {
          editAllSnapshotRef.current = mergeAdded(editAllSnapshotRef.current);
        }
      } else {
        setStopsByDay(persisted);
      }
      setShowSaveStatus(true);
    } finally {
      scheduleSaveLock.current = false;
      setMapPlaceSaving(false);
    }
  };

  // const addDay = () => {
  //   const lastDay = days[days.length - 1];
  //   if (!lastDay) return;
  //   const nextId = lastDay.id + 1;
  //   const nextDate = new Date(`${lastDay.isoDate}T00:00:00Z`);
  //   nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  //   const nextDay = createDay(nextDate.toISOString().slice(0, 10), nextId);

  //   setDays((previous) => [...previous, nextDay]);

  //   setStopsByDay((previous) => ({
  //     ...previous,
  //     [nextId]: [],
  //   }));

  //   setActiveDayId(nextId);
  //   setIsEditMode(false);
  //   setMenuId(null);
  //   setShowSaveStatus(false);
  //   resetDrag();
  // };
  const handleApplyDates = async (dates: string[]) => {
    const nextDates = normalizeTripDates(dates);

    if (!nextDates.length) {
      throw new Error("여행 날짜는 최소 1개 이상이어야 합니다.");
    }

    const nextDateSet = new Set(nextDates);

    const removedCount = days
      .filter((day) => !nextDateSet.has(day.isoDate))
      .reduce((count, day) => count + (stopsByDay[day.id]?.length ?? 0), 0);

    if (
      removedCount > 0 &&
      !window.confirm(
        `삭제할 날짜에 일정 ${removedCount}개가 있습니다. 해당 날짜와 일정을 삭제할까요?`,
      )
    ) {
      return false;
    }

    // DB 저장에 성공하기 전에는 화면 데이터를 변경하지 않습니다.
    const saved = await saveTripDays(
      selectedTrip.id,
      nextDates,
      days.map((day) => day.isoDate),
    );

    const activeDate = days.find((day) => day.id === activeDayId)?.isoDate;

    const nextDays = reindexTripDays(days, saved.dates, createDay);

    // Day 번호가 변경되어도 기존 일정은 원래 날짜에 유지
    const nextStops = remapStopsByDate<Stop>(days, nextDays, stopsByDay);

    setDays(nextDays);
    setStopsByDay(nextStops);

    setActiveDayId(
      nextDays.find((day) => day.isoDate === activeDate)?.id ?? nextDays[0]!.id,
    );

    setIsEditMode(false);
    setMenuId(null);
    setIsPlaceModalOpen(false);
    setEditingStop(null);
    setShowSaveStatus(false);

    editSnapshotRef.current = null;
    resetDrag();

    return true;
  };
  return (
    <S.Page inert={scheduleSaving} aria-busy={scheduleSaving}>
      {scheduleError && (
        <div role="alert" style={{ color: "#B42318", padding: "12px" }}>
          {scheduleError}
        </div>
      )}
      <Global
        styles={{
          '[role="menu"][aria-label="이동"], [role="menu"][aria-label="이동"] > button':
            { fontSize: "16px" },
        }}
      />
      <S.SidebarArea>
        <MainSidebar />
      </S.SidebarArea>

      <S.MobileHeaderArea>
        <MobileHeader />
      </S.MobileHeaderArea>

      <S.MainContent>
        <S.Container data-checklist={activeTab === "checklist"}>
          <S.Header>
            <S.BreadcrumbWrapper>
              <Breadcrumb />
            </S.BreadcrumbWrapper>

            {showSaveStatus && (
              <S.SaveStatus>
                <Cloud size={17} />
                현재 화면에 변경사항이 적용됨
              </S.SaveStatus>
            )}

            <S.TripInfo>
              <S.TripThumbnail src={defaultTripImage} alt="" />

              <S.TripDescription>
                {/* <S.TripTitleRow>
                  <S.TripTitle>{selectedTrip.name}</S.TripTitle>

                  <S.IconButton type="button" aria-label="여행 제목 편집">
                    <Pencil size={17} />
                  </S.IconButton>
                </S.TripTitleRow> */}
                <S.TripTitleRow>
                  <>
                    <S.TripTitle>{tripName}</S.TripTitle>

                    <S.TripNameMenuAnchor ref={tripNameMenuRef}>
                      <S.TripEditButton
                        ref={tripNameEditButtonRef}
                        type="button"
                        aria-label="여행 편집"
                        title="여행 편집"
                        aria-expanded={isTripNameMenuOpen}
                        onClick={() => {
                          setIsTripNameMenuMounted(true);
                          setIsTripNameMenuOpen(
                            (previous) => canEditTrip && !previous,
                          );
                        }}
                      >
                        <Pencil size={20} />
                      </S.TripEditButton>
                      {isTripNameMenuMounted && (
                        <S.TripNamePopoverPosition>
                          <S.TripNamePopover
                            aria-label="여행 관리"
                            aria-hidden={!isTripNameMenuOpen}
                            inert={!isTripNameMenuOpen}
                            data-open={isTripNameMenuOpen}
                            onAnimationEnd={(event) => {
                              if (
                                event.target === event.currentTarget &&
                                !isTripNameMenuOpen
                              ) {
                                setIsTripNameMenuMounted(false);
                              }
                            }}
                          >
                            <S.TripNameMenuItem
                              type="button"
                              disabled={!canEditTrip}
                              onClick={startEditingTripName}
                            >
                              <Pencil size={18} />
                              <span>여행 제목 수정</span>
                            </S.TripNameMenuItem>
                            <S.TripNameMenuItem
                              type="button"
                              onClick={() => {
                                setIsTripNameMenuOpen(false);
                                setShowRegionModal(true);
                              }}
                            >
                              <MapPin size={18} />
                              <span>여행 지역 수정</span>
                            </S.TripNameMenuItem>
                            <S.TripNameMenuItem
                              type="button"
                              onClick={() => {
                                setIsTripNameMenuOpen(false);
                                setShowDateModal(true);
                              }}
                            >
                              <CalendarDays size={18} />
                              <span>여행 날짜 수정</span>
                            </S.TripNameMenuItem>
                            <S.TripNameMenuItem
                              type="button"
                              onClick={() => {
                                setIsTripNameMenuOpen(false);
                                openMembersModal();
                              }}
                            >
                              <Users size={18} />
                              <span>여행 멤버 수정</span>
                            </S.TripNameMenuItem>
                            <S.TripNameMenuItem
                              className="trip-menu-delete"
                              type="button"
                              disabled={
                                selectedTrip.permission !== "owner" ||
                                isDeletingTrip
                              }
                              onClick={openTripDeleteDialog}
                            >
                              <Trash2 size={18} />
                              <span>여행 삭제</span>
                            </S.TripNameMenuItem>
                          </S.TripNamePopover>
                        </S.TripNamePopoverPosition>
                      )}
                    </S.TripNameMenuAnchor>
                  </>
                </S.TripTitleRow>
                <S.TripDate>{tripDateText}</S.TripDate>
                <S.MemberList>
                  <TripParticipants
                    key={`${selectedTrip.id}:${membersRevision}`}
                    tripId={String(selectedTrip.id)}
                    totalPeople={tripPeople}
                    currentUserId={user?.id}
                    loadParticipants={loadParticipants}
                    resolveAvatar={(value) => {
                      if (value?.startsWith("default:")) {
                        return DEFAULT_PROFILE_IMAGES[
                          value.slice(8).toUpperCase()
                        ];
                      }
                      return value || undefined;
                    }}
                  />

                  <S.MemberAdd
                    type="button"
                    disabled={selectedTrip.permission !== "owner"}
                    aria-label="여행 참여자 초대"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Plus size={17} />
                  </S.MemberAdd>
                </S.MemberList>
              </S.TripDescription>

              <S.HeaderActions>
                {isEditMode && (
                  <S.PrimaryButton type="button" onClick={handleSave}>
                    <Check size={16} />
                    저장하기
                  </S.PrimaryButton>
                )}

                <S.ScheduleButton type="button" onClick={handleTimetable}>
                  <CalendarDays size={17} />
                  <span>시간표 보기</span>
                </S.ScheduleButton>
              </S.HeaderActions>
            </S.TripInfo>

            <S.MainTabs
              $activeIndex={MAIN_TABS.findIndex((tab) => tab.key === activeTab)}
            >
              {MAIN_TABS.map((tab) => {
                const Icon = tab.icon;

                return (
                  <S.MainTab
                    key={tab.key}
                    type="button"
                    $active={activeTab === tab.key}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <Icon size={19} />
                    {tab.label}
                  </S.MainTab>
                );
              })}
            </S.MainTabs>
          </S.Header>

          {(activeTab === "schedule" || activeTab === "map") && (
            <S.DayTabs>
              {days.map((day) => (
                <S.DayButton
                  key={day.isoDate}
                  type="button"
                  $active={activeDayId === day.id}
                  onClick={() => {
                    setExpandedStopId(null);
                    setSelectedStopIds([]);

                    editAllSnapshotRef.current = null;
                    setActiveDayId(day.id);
                    setIsEditMode(false);
                    setMenuId(null);
                    setShowSaveStatus(false);
                    resetDrag();
                  }}
                >
                  <S.DayThumbnail src={day.image} alt="" />

                  <S.DayButtonText>
                    <strong>Day {day.id}</strong>
                    <span>
                      {day.date} ({day.weekday})
                    </span>
                  </S.DayButtonText>
                </S.DayButton>
              ))}
            </S.DayTabs>
          )}

          {activeTab === "schedule" || activeTab === "map" ? (
            <S.ContentGrid
              data-edit-mode={activeTab === "schedule" && showMapPanel}
            >
              <S.SchedulePanel data-tablet-hidden={activeTab === "map"}>
                <S.ScheduleHeading>
                  <S.ScheduleHeadingLeft>
                    <div className="date-wrapper">
                      <h2>Day {activeDay.id}</h2>

                      <span>
                        {Number(activeDay.date.split(".")[0])}월{" "}
                        {Number(activeDay.date.split(".")[1])}일 (
                        {activeDay.weekday})
                      </span>
                    </div>
                    <S.Weather locationName={tripRegion} />
                  </S.ScheduleHeadingLeft>

                  {(stops.length > 0 || isEditMode) && (
                    <S.DesktopEditAction>
                      {isEditMode ? (
                        <S.BatchActions>
                          <S.BatchMoveDropdown>
                            <Dropdown<string>
                              label="이동"
                              value=""
                              trigger={null}
                              disabled={
                                selectedStopIds.length === 0 || days.length < 2
                              }
                              options={days
                                .filter((day) => day.id !== activeDayId)
                                .map((day) => ({
                                  value: String(day.id),
                                  label: `Day ${day.id} · ${day.date}`,
                                }))}
                              onChange={(value) =>
                                moveSelectedStops(Number(value))
                              }
                            />
                          </S.BatchMoveDropdown>
                          <S.BatchButton
                            type="button"
                            $danger
                            disabled={selectedStopIds.length === 0}
                            onClick={deleteSelectedStops}
                          >
                            삭제
                          </S.BatchButton>
                          <S.CancelEditButton
                            type="button"
                            onClick={handleCancelEdit}
                          >
                            취소
                          </S.CancelEditButton>
                          <S.BatchButton
                            className="add-place-action"
                            type="button"
                            onClick={openPlaceModal}
                          >
                            <Plus size={16} />
                            <S.AddPlaceButtonLabel>
                              <span className="desktop-label">
                                장소 추가하기
                              </span>
                              <span className="compact-label">새 장소</span>
                            </S.AddPlaceButtonLabel>
                          </S.BatchButton>
                        </S.BatchActions>
                      ) : (
                        <S.EditModeButton
                          type="button"
                          $active={false}
                          disabled={!canEditTrip}
                          onClick={toggleEditMode}
                        >
                          <Pencil size={15} />
                          편집하기
                        </S.EditModeButton>
                      )}
                    </S.DesktopEditAction>
                  )}

                  {(stops.length > 0 || isEditMode) && (
                    <S.MobileEditAction>
                      {isEditMode ? (
                        <S.BatchActions>
                          <S.BatchMoveDropdown>
                            <Dropdown<string>
                              label="이동"
                              value=""
                              trigger={null}
                              disabled={
                                selectedStopIds.length === 0 || days.length < 2
                              }
                              options={days
                                .filter((day) => day.id !== activeDayId)
                                .map((day) => ({
                                  value: String(day.id),
                                  label: `Day ${day.id} · ${day.date}`,
                                }))}
                              onChange={(value) =>
                                moveSelectedStops(Number(value))
                              }
                            />
                          </S.BatchMoveDropdown>
                          <S.BatchButton
                            type="button"
                            $danger
                            disabled={selectedStopIds.length === 0}
                            onClick={deleteSelectedStops}
                          >
                            삭제
                          </S.BatchButton>
                          <S.CancelEditButton
                            type="button"
                            onClick={handleCancelEdit}
                          >
                            취소
                          </S.CancelEditButton>
                          <S.BatchButton
                            className="add-place-action"
                            type="button"
                            onClick={openPlaceModal}
                          >
                            <Plus size={16} />
                            <S.AddPlaceButtonLabel>
                              <span className="desktop-label">
                                장소 추가하기
                              </span>
                              <span className="compact-label">새 장소</span>
                            </S.AddPlaceButtonLabel>
                          </S.BatchButton>
                        </S.BatchActions>
                      ) : (
                        <S.EditModeButton
                          type="button"
                          $active={false}
                          disabled={!canEditTrip}
                          onClick={toggleEditMode}
                        >
                          <Pencil size={15} />
                          편집하기
                        </S.EditModeButton>
                      )}
                    </S.MobileEditAction>
                  )}
                </S.ScheduleHeading>

                {/* <S.ScheduleListArea> */}
                {isEditMode && stops.length > 0 && (
                  <S.SelectAllRow>
                    <S.StopCheckbox
                      type="checkbox"
                      checked={allStopsSelected}
                      ref={(element) => {
                        if (element) element.indeterminate = someStopsSelected;
                      }}
                      disabled={!canEditTrip}
                      onChange={handleSelectAllStops}
                    />
                    <span>전체선택</span>
                    <small>
                      {selectedStopCount}/{stops.length}
                    </small>
                  </S.SelectAllRow>
                )}
                <S.StopList>
                  {stops.length === 0 && (
                    <S.EmptyState>
                      <S.Illustration src={emptyScheduleImage} alt="" />
                      <S.Title>첫 장소를 추가해 볼까요?</S.Title>
                      <S.Description>
                        가고 싶은 곳을 담아 오늘의 여행을 시작해요.
                      </S.Description>
                      <S.AddButton type="button" onClick={openPlaceModal}>
                        <Plus size={22} aria-hidden="true" />
                        장소 추가
                      </S.AddButton>
                    </S.EmptyState>
                  )}
                  {stops.map((stop, index) => (
                    <ScheduleStopCard
                      key={`${activeDayId}-${isEditMode}-${stop.id}`}
                      stop={stop}
                      index={index}
                      isEditMode={isEditMode}
                      previewOffset={getDragPreviewOffset(index)}
                      defaultTransport={modalDefaultTransport}
                      expanded={expandedStopId === stop.id}
                      onToggleExpanded={() =>
                        setExpandedStopId((previous) =>
                          previous === stop.id ? null : stop.id,
                        )
                      }
                      onUpdate={(patch) =>
                        updateStops((previous) =>
                          previous.map((item) =>
                            item.id === stop.id ? { ...item, ...patch } : item,
                          ),
                        )
                      }
                      selected={selectedStopIds.includes(stop.id)}
                      onSelect={toggleStopSelection}
                      draggingId={draggingId}
                      dragOverId={dragOverId}
                      dragOverEdge={dragOverEdge}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={resetDrag}
                      onHandlePointerDown={handleTouchPointerDown}
                      onHandlePointerMove={handleTouchPointerMove}
                      onHandlePointerUp={handleTouchPointerUp}
                    />
                  ))}
                </S.StopList>

                <TravelRouteSummary
                  stops={routeStops}
                  mode={routeMode}
                  onModeChange={setRouteMode}
                  onRoutesReady={setRoutePaths}
                />

                {isEditMode && stops.length > 0 && (
                  <S.AddPlaceButton type="button" onClick={openPlaceModal}>
                    <S.AddPlaceTitle>
                      <Plus size={17} />
                      장소 추가하기
                    </S.AddPlaceTitle>

                    <span>맛집, 카페, 명소 등 원하는 장소를 추가해보세요.</span>
                  </S.AddPlaceButton>
                )}
              </S.SchedulePanel>

              {showMapPanel && (
                <S.MapPanel
                  data-edit-route={activeTab === "schedule"}
                  data-tablet-hidden={activeTab === "schedule"}
                >
                  <S.MapCanvas>
                    {activeTab === "schedule" ? (
                      <ScheduleEditRouteMap
                        key={`${activeDayId}-${editMapFitVersion}`}
                        stops={kakaoMapStops}
                        category="전체"
                        showRoute={showRoute}
                        routePaths={routePaths}
                        routeMode={routeMode}
                        zoom={mapZoom}
                      />
                    ) : activeTab === "map" ? (
                      <KakaoTravelMap
                        region={tripRegion}
                        stops={visibleMapStops}
                        routeStops={routeStops}
                        routePaths={routePaths}
                        routeMode={routeMode}
                        onRouteModeChange={setRouteMode}
                        showRoute={showRoute}
                        zoom={mapZoom}
                        onAddPlace={addPlaceFromKakao}
                        hideSearch
                      />
                    ) : (
                      <KakaoMap
                        stops={kakaoMapStops}
                        category={activeFilter}
                        routePaths={routePaths}
                        routeMode={routeMode}
                        onRouteModeChange={setRouteMode}
                        showRoute={showRoute}
                        zoom={mapZoom}
                      />
                    )}
                    {(activeTab === "schedule" || activeTab === "map") && (
                      <MapSearchOverlay
                        key={activeTab + ":" + activeDayId}
                        region={tripRegion}
                        canAdd={canEditTrip && !mapPlaceSaving}
                        onAddPlace={addPlaceFromKakao}
                        onFocus={(lat, lng) => {
                          window.dispatchEvent(new CustomEvent("routy:map:focus", {
                            detail: { lat, lng },
                          }));
                        }}
                      />
                    )}
                  </S.MapCanvas>

                  {!(activeTab === "schedule") && (
                    <S.MapToolbar>
                      <S.MapFilters>
                        {FILTERS.map((filter) => {
                          const Icon = filter.icon;

                          return (
                            <S.FilterButton
                              key={filter.key}
                              type="button"
                              $active={activeFilter === filter.key}
                              onClick={() => setActiveFilter(filter.key)}
                            >
                              <Icon size={15} />
                              {filter.label}
                            </S.FilterButton>
                          );
                        })}
                      </S.MapFilters>

                      <S.MobileFilterWrapper>
                        <S.MobileFilterTrigger
                          type="button"
                          aria-expanded={isMobileFilterOpen}
                          aria-label="지도 카테고리 선택"
                          onClick={() =>
                            setIsMobileFilterOpen((previous) => !previous)
                          }
                        >
                          <LayoutGrid size={16} />

                          <span>
                            {activeFilter === "전체"
                              ? "전체 카테고리"
                              : activeFilter}
                          </span>

                          <ChevronDown
                            size={16}
                            style={{
                              transform: isMobileFilterOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s ease",
                            }}
                          />
                        </S.MobileFilterTrigger>

                        {isMobileFilterOpen && (
                          <S.MobileFilterMenu>
                            {FILTERS.map((filter) => {
                              const Icon = filter.icon;

                              return (
                                <S.MobileFilterOption
                                  key={filter.key}
                                  type="button"
                                  $active={activeFilter === filter.key}
                                  onClick={() => {
                                    setActiveFilter(filter.key);
                                    setIsMobileFilterOpen(false);
                                  }}
                                >
                                  {activeFilter === filter.key ? (
                                    <Check size={16} />
                                  ) : (
                                    <Icon size={16} />
                                  )}

                                  <span>
                                    {filter.key === "전체"
                                      ? "전체 카테고리"
                                      : filter.label}
                                  </span>
                                </S.MobileFilterOption>
                              );
                            })}
                          </S.MobileFilterMenu>
                        )}
                      </S.MobileFilterWrapper>

                      <S.RouteToggle
                        type="button"
                        $active={showRoute}
                        onClick={() => setShowRoute((prev) => !prev)}
                      >
                        <Route size={17} />

                        <span>
                          {showRoute ? "경로 숨기기" : "전체 경로 보기"}
                        </span>
                      </S.RouteToggle>
                    </S.MapToolbar>
                  )}

                  {activeTab === "schedule" && (
                    <S.EditRouteFitButton
                      type="button"
                      onClick={() => {
                        setMapZoom(1);
                        setEditMapFitVersion((version) => version + 1);
                      }}
                    >
                      <Route size={17} />
                      전체 경로
                    </S.EditRouteFitButton>
                  )}
                  <S.MapZoomControls>
                    <button
                      type="button"
                      aria-label="확대"
                      onClick={() =>
                        setMapZoom((previous) => Math.min(previous + 0.1, 1.5))
                      }
                    >
                      <Plus size={18} />
                    </button>

                    <button
                      type="button"
                      aria-label="축소"
                      onClick={() =>
                        setMapZoom((previous) => Math.max(previous - 0.1, 0.7))
                      }
                    >
                      <Minus size={18} />
                    </button>

                    <button
                      type="button"
                      aria-label="초기화"
                      onClick={() => setMapZoom(1)}
                    >
                      <LocateFixed size={18} />
                    </button>
                  </S.MapZoomControls>
                </S.MapPanel>
              )}
            </S.ContentGrid>
          ) : activeTab === "checklist" ? (
            <S.ChecklistArea>
              <TripChecklist
                key={String(selectedTrip.id)}
                tripId={String(selectedTrip.id)}
                canEdit={canEditTrip}
              />
            </S.ChecklistArea>
          ) : activeTab === "budget" ? (
            <TravelBudgetTab />
          ) : null}
        </S.Container>
      </S.MainContent>

      {showSaveStatus && (
        <S.MobileSaveToast role="status" aria-live="polite">
          <S.MobileSaveToastIcon>
            <Check size={18} strokeWidth={2.5} />
          </S.MobileSaveToastIcon>
          <span>현재 화면에 변경사항이 적용됨</span>
        </S.MobileSaveToast>
      )}

      <S.MobileNavArea>
        <MobileNav />
      </S.MobileNavArea>

      {editingStop && (
        <S.EditOverlay onClick={() => setEditingStop(null)}>
          <S.EditModal
            role="dialog"
            aria-modal="true"
            aria-label="일정 수정"
            onClick={(event) => event.stopPropagation()}
          >
            <S.EditModalHeader>
              <h3>일정 수정</h3>
              <button type="button" onClick={() => setEditingStop(null)}>
                <X size={19} />
              </button>
            </S.EditModalHeader>

            <S.EditField>
              <label>장소 이름</label>
              <S.FormInput
                value={editingStop.title}
                onChange={(event) =>
                  setEditingStop({
                    ...editingStop,
                    title: event.target.value,
                  })
                }
              />
            </S.EditField>

            <S.EditField>
              <label>방문 시간</label>
              <S.FormInput
                type="time"
                value={editingStop.time}
                onChange={(event) =>
                  setEditingStop({
                    ...editingStop,
                    time: event.target.value,
                  })
                }
              />
            </S.EditField>

            <S.EditField>
              <label>장소 설명</label>
              <S.FormInput
                value={editingStop.description}
                onChange={(event) =>
                  setEditingStop({
                    ...editingStop,
                    description: event.target.value,
                  })
                }
              />
            </S.EditField>

            <S.EditField>
              <label>주소</label>
              <S.FormInput
                value={editingStop.address}
                onChange={(event) =>
                  setEditingStop({
                    ...editingStop,
                    address: event.target.value,
                  })
                }
              />
            </S.EditField>

            <S.EditField>
              <label>카테고리</label>
              <S.FormSelect
                value={editingStop.category}
                onChange={(event) =>
                  setEditingStop({
                    ...editingStop,
                    category: event.target.value as Category,
                  })
                }
              >
                {Object.keys(CATEGORY_ICONS).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </S.FormSelect>
            </S.EditField>

            <S.EditModalActions>
              <S.SecondaryButton
                type="button"
                onClick={() => setEditingStop(null)}
              >
                취소
              </S.SecondaryButton>

              <S.PrimaryButton type="button" onClick={saveEditedStop}>
                <Save size={15} />
                저장하기
              </S.PrimaryButton>
            </S.EditModalActions>
          </S.EditModal>
        </S.EditOverlay>
      )}

      {stopDeleteIds && (
        <SelectedStopsDeleteDialog
          open={isStopDeleteOpen}
          count={stopDeleteIds.length}
          onClose={() => setIsStopDeleteOpen(false)}
          onConfirm={confirmSelectedStopDelete}
          onExited={() => setStopDeleteIds(null)}
        />
      )}

      {isDeleteDialogMounted &&
        createPortal(
          <S.TripDeleteDialog
            ref={deleteDialogRef}
            data-open={isDeleteDialogOpen}
            inert={!isDeleteDialogOpen}
            aria-labelledby={deleteTitleId}
            aria-describedby={`${deleteDescriptionId}${deleteTripError ? ` ${deleteErrorId}` : ""}`}
            aria-busy={isDeletingTrip}
            onCancel={(event) => {
              event.preventDefault();
              closeTripDeleteDialog();
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget) closeTripDeleteDialog();
            }}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget && !isDeleteDialogOpen) {
                setIsDeleteDialogMounted(false);
              }
            }}
          >
            <div
              className="trip-delete-content"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="trip-delete-handle" aria-hidden="true" />
              <button
                className="trip-delete-close"
                type="button"
                aria-label="여행 삭제 창 닫기"
                disabled={isDeletingTrip}
                onClick={closeTripDeleteDialog}
              >
                <X size={20} />
              </button>
              <div className="trip-delete-heading">
                <TriangleAlert
                  className="trip-delete-icon"
                  size={28}
                  aria-hidden="true"
                />
                <h2 id={deleteTitleId}>여행을 삭제할까요?</h2>
              </div>
              <p className="trip-delete-name">{tripName}</p>
              <div id={deleteDescriptionId}>
                <p className="trip-delete-description">
                  여행과 연결된 일정이 함께 삭제됩니다.
                </p>
                <div className="trip-delete-warning">
                  <p>삭제한 여행은 복구할 수 없어요.</p>
                  <p>참여한 사용자도 이 여행에 접근할 수 없게 됩니다.</p>
                </div>
              </div>
              {deleteTripError && (
                <p
                  className="trip-delete-error"
                  id={deleteErrorId}
                  role="alert"
                >
                  {deleteTripError}
                </p>
              )}
              <div className="trip-delete-actions">
                <button
                  ref={deleteCancelRef}
                  className="trip-delete-cancel"
                  type="button"
                  disabled={isDeletingTrip}
                  onClick={closeTripDeleteDialog}
                >
                  취소
                </button>
                <button
                  className="trip-delete-confirm"
                  type="button"
                  disabled={isDeletingTrip}
                  onClick={() => void handleConfirmTripDelete()}
                >
                  <Trash2 size={17} aria-hidden="true" />
                  {isDeletingTrip ? "삭제 중…" : "여행 삭제"}
                </button>
              </div>
            </div>
          </S.TripDeleteDialog>,
          document.body,
        )}

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        tripId={selectedTrip.id}
        tripName={selectedTrip.name}
      />

      <TripPeopleModal
        key={`members:${memberSession}:${memberData ? "ready" : "loading"}`}
        open={showPeopleModal}
        value={memberData?.editorLimit ?? tripPeople}
        max={2147483647}
        tripName={tripName}
        members={memberData?.participants.map((member) => ({
          id: member.userId,
          name: member.nickname || "참여자",
          permission: member.permission,
          avatarUrl: resolveMemberAvatar(member.avatarUrl),
        }))}
        currentUserId={user?.id ?? ""}
        currentPermission={memberData?.permission ?? selectedTrip.permission}
        loading={!memberData && !memberLoadError}
        loadError={memberLoadError}
        onRetry={() => {
          setMemberLoadError("");
          setMemberRetry((n) => n + 1);
        }}
        onClose={() => setShowPeopleModal(false)}
        onConfirm={(limit) =>
          handleSaveMembers({ editorLimit: limit, permissions: [] })
        }
        onSaveMembers={handleSaveMembers}
        onLeave={handleLeaveTrip}
      />
      <RegionSelectModal
        isOpen={showRegionModal}
        value={selectedRegion}
        searchRegions={searchTravelRegions}
        onClose={() => setShowRegionModal(false)}
        onConfirm={(region) => {
          void handleSaveTripRegion(region);
        }}
      />
      <MobileTripNameSheet
        open={isEditingTripName}
        value={draftTripName}
        busy={isSavingTripName}
        error={tripNameError}
        onChange={(value) => {
          setDraftTripName(value);
          setTripNameError("");
        }}
        onSave={() => void handleSaveTripName()}
        onClose={cancelEditingTripName}
      />
      <TripDateModal
        open={showDateModal}
        dates={days.map((day) => day.isoDate)}
        scheduleCounts={Object.fromEntries(
          days.map((day) => [day.isoDate, stopsByDay[day.id]?.length ?? 0]),
        )}
        onClose={() => setShowDateModal(false)}
        onConfirm={handleApplyDates}
      />
      <PlaceAddModal
        {...placeModalSource}
        defaultTransport={modalDefaultTransport}
        defaultTransportLabel={modalDefaultTransportLabel}
        open={isPlaceModalOpen}
        onClose={() => setIsPlaceModalOpen(false)}
        dayLabel={`Day ${placeModalDay?.id ?? activeDay.id}`}
        dateLabel={`${(placeModalDay ?? activeDay).date} (${(placeModalDay ?? activeDay).weekday})`}
        region={tripRegion}
        existingPlaceIds={(
          stopsByDay[
            days.find((day) => day.isoDate === placeModalDay?.isoDate)?.id ??
              activeDayId
          ] ?? []
        ).map((stop) => stop.placeId ?? String(stop.id))}
        onConfirm={handleAddPlaces}
      />
    </S.Page>
  );
}

function MobileTripNameSheet({
  open,
  value,
  busy,
  error,
  onChange,
  onSave,
  onClose,
}: {
  open: boolean;
  value: string;
  busy: boolean;
  error: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const [previousOpen, setPreviousOpen] = useState(open);
  const [mounted, setMounted] = useState(open);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = React.useId();
  const inputId = React.useId();
  const errorId = React.useId();
  if (open !== previousOpen) {
    setPreviousOpen(open);
    if (open) setMounted(true);
  }
  useEffect(() => {
    if (!mounted) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [mounted]);
  useEffect(() => {
    if (!open && mounted) {
      const timer = window.setTimeout(() => setMounted(false), 300);
      return () => window.clearTimeout(timer);
    }
    if (open && mounted) {
      inputRef.current?.focus({ preventScroll: true });
      inputRef.current?.select();
    }
  }, [open, mounted]);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(
    <S.MobileNameDialog
      ref={dialogRef}
      data-open={open}
      inert={!open}
      aria-labelledby={titleId}
      aria-busy={busy}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && !open) setMounted(false);
      }}
    >
      <form
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          if (!busy) onSave();
        }}
      >
        <div className="name-sheet-handle" aria-hidden="true" />
        <header>
          <h2 id={titleId}>여행 제목 수정</h2>
          <button
            className="name-sheet-close"
            type="button"
            aria-label="닫기"
            disabled={busy}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        <p className="name-sheet-description">
          이번 여행에 어울리는 이름을 지어주세요.
        </p>
        <label htmlFor={inputId}>여행 이름</label>
        <div className="name-sheet-input-wrap">
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            maxLength={50}
            disabled={busy}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.nativeEvent.isComposing)
                event.preventDefault();
            }}
          />
          <button
            className="name-sheet-clear"
            type="button"
            aria-label="입력 내용 지우기"
            disabled={busy || !value}
            onClick={() => {
              onChange("");
              inputRef.current?.focus({ preventScroll: true });
            }}
          >
            <CircleX size={18} />
          </button>
        </div>
        <div className="name-sheet-caption">
          <span id={errorId} role={error ? "alert" : undefined}>
            {error || "최대 50자까지 입력할 수 있어요."}
          </span>
          <span>{value.length}/50</span>
        </div>
        <footer>
          <button type="button" disabled={busy} onClick={onClose}>
            취소
          </button>
          <button
            className="name-sheet-save"
            type="submit"
            disabled={busy || !value.trim()}
          >
            {busy ? "저장 중…" : "저장하기"}
          </button>
        </footer>
      </form>
    </S.MobileNameDialog>,
    document.body,
  );
}

const KAKAO_KEY = getKakaoMapKey();

type EditRouteMapProps = {
  stops: KakaoStop[];
  category: string;
  showRoute: boolean;
  routePaths: RouteLine[];
  routeMode: TravelMode;
  zoom: number;
};

function createMarkerContent(
  stop: KakaoStop & { time?: string },
  order: number,
  total: number,
  onActiveChange: (active: boolean) => void,
  onSelect: (selected: boolean) => void,
  onHover: (active: boolean) => void,
): HTMLElement {
  const marker = document.createElement("div");
  marker.className = "route-map-marker";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "route-map-pin";
  const role = total === 1 ? "출발·도착" : order === 1 ? "출발지" : order === total ? "도착지" : "경유지";
  button.setAttribute("aria-label", `${order}번 ${role} ${stop.title}${stop.time ? ` · ${stop.time}` : ""}`);
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = renderToStaticMarkup(
    <svg width="44" height="54" viewBox="0 0 44 54" aria-hidden="true">
      <path
        d="M22 2C11 2 3 10 3 21c0 13 19 30 19 30s19-17 19-30C41 10 33 2 22 2Z"
        fill={order === 1 ? "#269B76" : order === total ? "#D9853C" : "#007C80"}
        stroke="white"
        strokeWidth="3"
      />
    </svg>,
  );
  const number = document.createElement("span");
  number.className = "route-map-pin-number";
  number.textContent = String(order);
  button.append(number);
  const tooltip = document.createElement("span");
  tooltip.className = "route-map-tooltip";
  tooltip.id = `route-stop-${String(stop.id).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  tooltip.setAttribute("role", "tooltip");
  tooltip.hidden = true;
  button.setAttribute("aria-describedby", tooltip.id);
  const title = document.createElement("strong");
  title.textContent = stop.title;
  const time = document.createElement("span");
  time.textContent = stop.time ? `일정 시간 ${stop.time}` : "일정 시간 미정";
  tooltip.append(title, time);
  if (stop.address) {
    const address = document.createElement("span");
    address.textContent = stop.address;
    tooltip.append(address);
  }
  const description = (stop as KakaoStop & { description?: string }).description;
  if (description?.trim()) {
    const info = document.createElement("span");
    info.textContent = description;
    tooltip.append(info);
  }
  const timeLabel = document.createElement("span");
  timeLabel.className = "route-map-pin-time";
  timeLabel.textContent = stop.time || "시간 미정";
  marker.append(button, timeLabel, tooltip);
  const show = (active: boolean) => {
    tooltip.hidden = !active;
    button.setAttribute("aria-expanded", String(active));
    marker.dataset.active = String(active);
    onActiveChange(active || tapped);
  };
  let tapped = false;
  const deselect = () => {
    tapped = false;
    marker.dataset.selected = "false";
    button.setAttribute("aria-pressed", "false");
    show(false);
    onSelect(false);
  };
  marker.addEventListener("route-marker-deselect", deselect);
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const nextSelected = !tapped;
    marker
      .closest("[data-route-map-root]")
      ?.querySelectorAll('.route-map-marker[data-selected="true"]')
      .forEach((other) => {
        if (other !== marker)
          other.dispatchEvent(new Event("route-marker-deselect"));
      });
    tapped = nextSelected;
    marker.dataset.selected = String(tapped);
    button.setAttribute("aria-pressed", String(tapped));
    show(tapped);
    onSelect(tapped);
  });
  button.addEventListener("mouseenter", () => onHover(true));
  button.addEventListener("mouseleave", () => onHover(false));
  button.addEventListener("keydown", (event) => {
    if (event.key === "Escape") deselect();
  });
  return marker;
}

function ScheduleEditRouteMap({
  stops,
  category,
  showRoute,
  routePaths,
  routeMode,
  zoom,
}: EditRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const layersRef = useRef<OverlayInstance[]>([]);
  const userLocationOverlayRef = useRef<OverlayInstance | null>(null);
  const locatedRef = useRef<LocatedStop[]>([]);
  const initialLevelRef = useRef(9);
  const [sdk, setSdk] = useState<KakaoMapsSDK | null>(null);
  const [error, setError] = useState("");
  const [unresolved, setUnresolved] = useState(0);
  const [loading, setLoading] = useState(Boolean(KAKAO_KEY));
  // Routy desktop route hover patch v1. Touch devices use the same expandable detail panel.
  const [routeSelection, setRouteSelection] = useState<RouteSelection | null>(null);
  const isTouchMap = useTouchMap();
  const routePinnedRef = useRef(false);

  useEffect(() => {
    if (!KAKAO_KEY) return;
    let cancelled = false;
    void loadKakaoMaps()
      .then((maps) => {
        if (cancelled || !containerRef.current) return;
        const map = new maps.Map(containerRef.current, {
          center: new maps.LatLng(
            DEFAULT_MAP_CENTER.latitude,
            DEFAULT_MAP_CENTER.longitude,
          ),
          level: 9,
        });
        mapRef.current = map;
        setSdk(maps);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(
            reason instanceof Error
              ? reason.message
              : "지도 연결에 실패했습니다.",
          );
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      layersRef.current.forEach((layer) => layer.setMap(null));
      layersRef.current = [];
      mapRef.current = null;
    };
  }, []);

  // 지도 검색 결과를 선택하거나 현재 위치 버튼을 누르면 지도 중심으로 이동합니다.
  useEffect(() => {
    if (!sdk) return;
    const focus = (event: Event) => {
      const point = (event as CustomEvent<{ lat: number; lng: number }>).detail;
      if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lng)) return;
      const map = mapRef.current;
      if (!map) return;
      map.setCenter(new sdk.LatLng(point.lat, point.lng));
      map.setLevel(4);
    };
    window.addEventListener("routy:map:focus", focus);
    return () => window.removeEventListener("routy:map:focus", focus);
  }, [sdk]);

  // 사용자 위치 좌표는 메모리에서만 사용하며 DB/로컬 저장소에 기록하지 않습니다.
  useEffect(() => {
    const map = mapRef.current;
    if (!sdk || !map) return;
    let cancelled = false;
    const refresh = () => {
      userLocationOverlayRef.current?.setMap(null);
      userLocationOverlayRef.current = null;
      void getAllowedCurrentLocation().then((location) => {
        if (cancelled || !location) return;
        const bubble = document.createElement("div");
        bubble.textContent = "● 현재 위치";
        bubble.setAttribute("aria-label", "내 현재 위치");
        bubble.style.cssText = "background:#0B626A;color:white;padding:6px 10px;border:2px solid white;border-radius:16px;font-size:15px;font-weight:700;box-shadow:0 2px 10px #0004;white-space:nowrap;";
        const overlay = new sdk.CustomOverlay({
          map,
          position: new sdk.LatLng(location.lat, location.lng),
          content: bubble,
          yAnchor: 1,
          zIndex: 15,
        });
        userLocationOverlayRef.current = overlay;
        if (stops.length === 0) {
          map.setCenter(new sdk.LatLng(location.lat, location.lng));
          map.setLevel(5);
        }
      }).catch(() => { /* GPS 거부/실패 시 기존 일정 지도 유지 */ });
    };
    refresh();
    window.addEventListener(LOCATION_CHANGE_EVENT, refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(LOCATION_CHANGE_EVENT, refresh);
      userLocationOverlayRef.current?.setMap(null);
      userLocationOverlayRef.current = null;
    };
  }, [sdk, stops.length]);

  // 일정/날짜 변경 시 위치를 다시 찾되, API 응답이 늦게 오면 기존 결과를 표시하지 않습니다.
  useEffect(() => {
    const map = mapRef.current;
    if (!sdk || !map) return;
    let cancelled = false;
    setLoading(true);
    const places = new sdk.services.Places();
    void Promise.all(stops.map((stop) => resolveKakaoPlace(sdk, places, stop)))
      .then((found) => {
        if (cancelled) return;
        locatedRef.current = found.filter(
          (item): item is LocatedStop => item !== null,
        );
        setUnresolved(found.length - locatedRef.current.length);
        const coordinates = locatedRef.current;
        map.relayout();
        if (coordinates.length > 0) {
          if (coordinates.length === 1) {
            map.setCenter(
              new sdk.LatLng(coordinates[0].latitude, coordinates[0].longitude),
            );
            map.setLevel(4);
          } else {
            const bounds = new sdk.LatLngBounds();
            coordinates.forEach(({ latitude, longitude }) =>
              bounds.extend(new sdk.LatLng(latitude, longitude)),
            );
            map.setBounds(bounds, 70);
          }
          initialLevelRef.current = map.getLevel();
        } else {
          map.setCenter(
            new sdk.LatLng(
              DEFAULT_MAP_CENTER.latitude,
              DEFAULT_MAP_CENTER.longitude,
            ),
          );
          map.setLevel(9);
          initialLevelRef.current = 9;
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("장소 위치를 조회하는 중 문제가 발생했습니다.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sdk, stops]);

  // 마커·순서 연결선은 동일 좌표 데이터를 사용합니다.
  useEffect(() => {
    const map = mapRef.current;
    if (!sdk || !map || loading) return;
    layersRef.current.forEach((layer) => layer.setMap(null));
    layersRef.current = [];
    const coordinatePoints = locatedRef.current;
    const openRouteInfo = (info: RouteSelection, pinned: boolean) => {
      routePinnedRef.current = pinned;
      setRouteSelection(info);
    };
    const hoverRouteInfo = (info: RouteSelection) => {
      if (!isTouchMap && !routePinnedRef.current) setRouteSelection(info);
    };
    const leaveRouteInfo = () => {
      if (!isTouchMap && !routePinnedRef.current) setRouteSelection(null);
    };
    const kakaoEvent = (sdk as KakaoMapsSDK & {
      event?: { addListener(target: object, event: string, listener: () => void): void };
    }).event;
    if (showRoute) {
      const ordered = stops.map((stop) => {
        const found = coordinatePoints.find((point) => String(point.stop.id) === String(stop.id));
        return {
          id: stop.id, title: stop.title, time: stop.time,
          address: stop.address,
          description: "description" in stop && typeof stop.description === "string" ? stop.description : undefined,
          lat: found?.latitude, lng: found?.longitude,
        };
      });
      buildDisplayRoutes(ordered, routePaths, routeMode).forEach((leg) => {
        const line = new sdk.Polyline({
          map,
          path: leg.path.map(({ lat, lng }) => new sdk.LatLng(lat, lng)),
          strokeWeight: leg.isFallback ? 5 : 9,
          strokeColor: leg.isFallback ? "#778D90" : routeColor(leg.mode),
          strokeOpacity: leg.isFallback ? 0.7 : 0.92,
          strokeStyle: leg.isFallback ? "shortdash" : "solid",
        });
        layersRef.current.push(line);
        const info: RouteSelection = { kind: "route", route: leg, order: leg.order ?? 1 };
        kakaoEvent?.addListener(line, "mouseover", () => hoverRouteInfo(info));
        kakaoEvent?.addListener(line, "mouseout", leaveRouteInfo);
        kakaoEvent?.addListener(line, "click", () => openRouteInfo(info, true));
      });
    }
    coordinatePoints.forEach(({ stop, latitude, longitude }) => {
      if (category !== "전체" && stop.category !== category) return;
      const order = stops.findIndex((item) => item.id === stop.id) + 1;
      let overlay:
        | (OverlayInstance & { setZIndex?: (index: number) => void })
        | null = null;
      const content = createMarkerContent(
        stop,
        order,
        stops.length,
        (active) => {
          overlay?.setZIndex?.(active ? 20 : 3);
        },
        (selected) => {
          if (selected) {
            openRouteInfo({
              kind: "stop", order, total: stops.length,
              stop: {
                id: stop.id, title: stop.title, time: stop.time,
                address: stop.address, category: stop.category,
                description: "description" in stop && typeof stop.description === "string" ? stop.description : undefined,
                externalUrl: getKakaoMapPointUrl(stop.title, latitude, longitude),
              },
            }, true);
          } else {
            routePinnedRef.current = false;
            setRouteSelection(null);
          }
        },
        (active) => {
          if (!active || isTouchMap) return;
          hoverRouteInfo({
            kind: "stop", order, total: stops.length,
            stop: { id: stop.id, title: stop.title, time: stop.time,
              address: stop.address, category: stop.category,
              description: "description" in stop && typeof stop.description === "string" ? stop.description : undefined,
              externalUrl: getKakaoMapPointUrl(stop.title, latitude, longitude),
            },
          });
        },
      );
      overlay = new sdk.CustomOverlay({
        map,
        position: new sdk.LatLng(latitude, longitude),
        content,
        yAnchor: 1,
        zIndex: 3,
      });
      layersRef.current.push(overlay);
    });
    return () => {
      layersRef.current.forEach((layer) => layer.setMap(null));
      layersRef.current = [];
    };
  }, [sdk, stops, category, showRoute, routePaths, routeMode, loading, isTouchMap]);

  useEffect(() => {
    routePinnedRef.current = false;
    setRouteSelection(null);
  }, [stops, routePaths, showRoute, routeMode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || loading) return;
    map.setLevel(
      Math.max(
        1,
        Math.min(14, initialLevelRef.current - Math.round((zoom - 1) * 10)),
      ),
      { animate: true },
    );
  }, [zoom, loading]);

  useEffect(() => {
    const map = mapRef.current;
    const element = containerRef.current;
    if (!map || !element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => map.relayout());
    observer.observe(element);
    return () => observer.disconnect();
  }, [sdk]);

  return (
    <S.EditMapRoot data-route-map-root>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%" }}
        aria-label="카카오 지도"
      />
      <RouteMapDetails
        selection={routeSelection}
        isTouch={isTouchMap}
        onClose={() => { routePinnedRef.current = false; setRouteSelection(null); }}
      />
      {!KAKAO_KEY ? (
        <S.EditMapMessage role="status">
          <strong>카카오맵 API 키가 필요해요.</strong>
          <span>
            프로젝트 루트의 .env.local에 VITE_KAKAO_MAP_JS_KEY를 설정해 주세요.
          </span>
        </S.EditMapMessage>
      ) : error ? (
        <S.EditMapMessage role="alert">
          <strong>카카오 지도를 표시할 수 없어요.</strong>
          <span>{error}</span>
          <span>
            카카오맵 사용 설정 및 localhost 도메인 등록을 확인해 주세요.
          </span>
        </S.EditMapMessage>
      ) : loading ? (
        <S.EditMapMessage role="status">
          카카오 지도와 장소를 불러오는 중이에요.
        </S.EditMapMessage>
      ) : (
        <S.EditMapNote>
          {unresolved > 0
            ? `위치를 확인할 수 없는 장소 ${unresolved}개 · `
            : ""}
          {routePaths.some((leg) => leg.path.length >= 2)
            ? "실선은 API 경로, 점선은 조회되지 않은 방문 구간입니다."
            : "점선은 방문 순서만 표시하며 실제 도로 경로가 아닙니다."}
        </S.EditMapNote>
      )}
    </S.EditMapRoot>
  );
}

function SelectedStopsDeleteDialog({
  open,
  count,
  onClose,
  onConfirm,
  onExited,
}: {
  open: boolean;
  count: number;
  onClose: () => void;
  onConfirm: () => void;
  onExited: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    cancelRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(onExited, 300);
    return () => window.clearTimeout(timer);
  }, [open, onExited]);
  return createPortal(
    <S.SelectedStopDeleteDialog
      ref={dialogRef}
      data-open={open}
      inert={!open}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && !open) onExited();
      }}
    >
      <div className="stop-delete-heading">
        <TriangleAlert size={25} aria-hidden="true" />
        <h2 id={titleId}>선택한 일정을 삭제할까요?</h2>
      </div>
      <p id={descriptionId}>선택한 일정 {count}개가 목록에서 삭제됩니다.</p>
      <div className="stop-delete-actions">
        <button ref={cancelRef} type="button" onClick={onClose}>
          취소
        </button>
        <button type="button" className="danger" onClick={onConfirm}>
          삭제
        </button>
      </div>
    </S.SelectedStopDeleteDialog>,
    document.body,
  );
}
