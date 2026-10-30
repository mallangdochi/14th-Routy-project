import React, { useEffect, useRef, useState } from "react";
import {
  House,
  ChevronRight,
  Check,
  Pencil,
  MoreHorizontal,
  Plus,
  CalendarDays,
  MapPin,
  Wallet,
  ClipboardCheck,
  Cloud,
  CarFront,
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
import { useNavigate, useParams, useSearchParams } from "react-router";
import { getMyTrips, type SavedTrip } from "../../api/trips";
import { useAuth } from "../../contexts/AuthContext";
import defaultTripImage from "../../assets/where.webp";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import * as S from "./ScheduleStyle";
import KakaoMap from "../../components/kakaoMap/KakaoMap";
import KakaoTravelMap, { type KakaoPlace } from "../../map/KakaoTravelMap";
import ShareModal from "../../components/modal/share/ShareModal";
import MobileHeader from "../../components/mobileBanner/MobileHeader";
import MobileNav from "../../components/mobileBanner/MobileFooter";
import Breadcrumb from "../../components/MainSidebar/mainHeader/Breadcrumb";
import Checklist from "../../components/checklist/Checklist";
import type { ChecklistGroup } from "../../data/checklist";
import EmptyChecklist from "../../components/emptyUI/checklist/Checklist";
import TravelBudgetTab from "../../components/travelBudget/TravelBudgetTab";
import { getTripDays, saveTripDays } from "../../api/tripDays";
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

export type PlaceModalSource = Pick<
  PlaceModalProps,
  | "loadPlaces"
  | "savedPlaces"
  | "onToggleSave"
  | "defaultTransport"
  | "defaultTransportLabel"
  | "transportOptions"
>;
type ScheduleProps = { placeModalSource?: PlaceModalSource };
const missingPlacesSource: PlaceModalSource = {
  savedPlaces: [],
  defaultTransport: "",
  loadPlaces: async () => {
    throw new Error(
      "장소 검색 API를 placeModalSource.loadPlaces에 연결해 주세요.",
    );
  },
  onToggleSave: () => {
    throw new Error(
      "저장 장소 API를 placeModalSource.onToggleSave에 연결해 주세요.",
    );
  },
};

type ScheduleTrip = SavedTrip & {
  dates: string[];
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
  lat?: number;
  lng?: number;
};

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

type StopCardProps = {
  stop: Stop;
  index: number;
  isEditMode: boolean;
  menuId: number | null;
  draggingId: number | null;
  dragOverId: number | null;
  onMenuToggle: (id: number) => void;
  onEdit: (stop: Stop) => void;
  onDelete: (id: number) => void;
  onDragStart: (event: React.DragEvent<HTMLButtonElement>, id: number) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDragEnd: () => void;
};

function ScheduleStopCard({
  stop,
  index,
  isEditMode,
  menuId,
  draggingId,
  dragOverId,
  onMenuToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: StopCardProps) {
  const Icon = CATEGORY_ICONS[stop.category];

  return (
    <S.StopRow
      data-stop-row
      $isDragging={draggingId === stop.id}
      $isDragOver={dragOverId === stop.id}
      onDragOver={(event) => onDragOver(event, stop.id)}
      onDrop={(event) => onDrop(event, stop.id)}
    >
      <S.DragSlot data-edit-mode={isEditMode}>
        {isEditMode && (
          <S.DragHandle
            type="button"
            draggable
            aria-label={`${stop.title} 순서 변경`}
            title="드래그하여 순서 변경"
            onDragStart={(event) => onDragStart(event, stop.id)}
            onDragEnd={onDragEnd}
          >
            <GripVertical size={18} />
          </S.DragHandle>
        )}
      </S.DragSlot>

      <S.Timeline>
        <S.TimelineDot>{index + 1}</S.TimelineDot>
      </S.Timeline>

      <S.StopCard data-stop-card>
        <S.StopTime>{stop.time}</S.StopTime>

        <S.StopImage src={stop.image} alt={stop.title} draggable={false} />

        <S.StopDetails>
          <strong>{stop.title}</strong>
          <span>{stop.description}</span>
          <small>
            <MapPin size={11} />
            {stop.address}
          </small>
        </S.StopDetails>

        <S.StopActions>
          {isEditMode && (
            <>
              <S.MoreButton
                type="button"
                onClick={() => onMenuToggle(stop.id)}
                aria-label="일정 메뉴"
                aria-expanded={menuId === stop.id}
              >
                <MoreHorizontal size={19} />
              </S.MoreButton>

              {menuId === stop.id && (
                <S.ActionMenu>
                  <S.ActionMenuButton
                    type="button"
                    onClick={() => onEdit(stop)}
                  >
                    <Pencil size={14} />
                    수정
                  </S.ActionMenuButton>

                  <S.ActionMenuButton
                    type="button"
                    $danger
                    onClick={() => onDelete(stop.id)}
                  >
                    <Trash2 size={14} />
                    삭제
                  </S.ActionMenuButton>
                </S.ActionMenu>
              )}
            </>
          )}

          <S.CategoryCircle>
            <Icon size={18} />
          </S.CategoryCircle>
        </S.StopActions>
      </S.StopCard>
    </S.StopRow>
  );
}

export default function Schedule({
  placeModalSource = missingPlacesSource,
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

  // useEffect(() => {
  //   if (!userId || !tripId) return;
  //   const controller = new AbortController();
  //   void getMyTrips(controller.signal)
  //     .then((savedTrips) => {
  //       if (controller.signal.aborted) return;
  //       const trip =
  //         savedTrips.find((item) => String(item.id) === tripId) ?? null;
  //       setResult({
  //         userId,
  //         tripId,
  //         retry,
  //         trip,
  //         error: trip ? "" : "여행이 없거나 조회 권한이 없습니다.",
  //       });
  //     })
  //     .catch((error: unknown) => {
  //       if (controller.signal.aborted) return;
  //       setResult({
  //         userId,
  //         tripId,
  //         retry,
  //         trip: null,
  //         error:
  //           error instanceof Error
  //             ? error.message
  //             : "여행 정보를 불러오지 못했습니다.",
  //       });
  //     });
  //   return () => controller.abort();
  // }, [userId, tripId, retry]);

  useEffect(() => {
    if (!userId || !tripId) return;

    const controller = new AbortController();

    void Promise.all([
      getMyTrips(controller.signal),
      getTripDays(tripId, controller.signal),
    ])
      .then(([savedTrips, tripDays]) => {
        if (controller.signal.aborted) return;

        const savedTrip = savedTrips.find((item) => String(item.id) === tripId);

        const trip: ScheduleTrip | null = savedTrip
          ? {
              ...savedTrip,
              dates: tripDays.dates,
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
    result?.retry === retry
      ? result
      : null;

  if (userId && tripId && current?.trip) {
    return (
      <ScheduleContent
        key={`${userId}:${tripId}`}
        selectedTrip={current.trip}
        placeModalSource={placeModalSource}
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
}: {
  selectedTrip: ScheduleTrip;
  placeModalSource: PlaceModalSource;
}) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleTimetable = () => navigate(`/trips/${selectedTrip.id}`);
  const [defaultProfileImage] = useState(() => {
    const images = Object.values(DEFAULT_PROFILE_IMAGES);

    return images[Math.floor(Math.random() * images.length)]!;
  });
  const [tripName, setTripName] = useState(selectedTrip.name);
  const [draftTripName, setDraftTripName] = useState(selectedTrip.name);
  const [isEditingTripName, setIsEditingTripName] = useState(false);
  const [isSavingTripName, setIsSavingTripName] = useState(false);
  const [tripNameError, setTripNameError] = useState("");

  const tripNameSavingRef = useRef(false);
  const tripNameEditButtonRef = useRef<HTMLButtonElement>(null);

  const startEditingTripName = () => {
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

  const [activeDayId, setActiveDayId] = useState(1);
  const [showDateModal, setShowDateModal] = useState(false);

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

  const [checklistGroups, setChecklistGroups] = useState<ChecklistGroup[]>([]);

  const hasChecklistItems = checklistGroups.some(
    (group) => group.items.length > 0,
  );

  const [stopsByDay, setStopsByDay] = useState<Record<number, Stop[]>>({});

  const [isEditMode, setIsEditMode] = useState(false);
  const [menuId, setMenuId] = useState<number | null>(null);
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

  const draggingIdRef = useRef<number | null>(null);

  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [placeModalDay, setPlaceModalDay] = useState<Day | null>(null);
  const openPlaceModal = () => {
    setPlaceModalDay(activeDay);
    setIsPlaceModalOpen(true);
  };
  const [editingStop, setEditingStop] = useState<Stop | null>(null);

  const [activeFilter, setActiveFilter] = useState<Filter>("전체");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [showRoute, setShowRoute] = useState(true);
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

  const visibleMapStops = stops.filter(
    (stop) => activeFilter === "전체" || stop.category === activeFilter,
  );

  const kakaoMapStops = React.useMemo(
    () =>
      stops.map((stop) => ({
        ...stop,
        latitude: stop.lat,
        longitude: stop.lng,
      })),
    [stops],
  );

  const updateStops = (updater: (previous: Stop[]) => Stop[]) => {
    setStopsByDay((previous) => ({
      ...previous,
      [activeDayId]: updater(previous[activeDayId] ?? []),
    }));

    setShowSaveStatus(false);
  };

  const resetDrag = () => {
    draggingIdRef.current = null;
    setDraggingId(null);
    setDragOverId(null);
  };

  const toggleEditMode = () => {
    if (!isEditMode) {
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
    if (editSnapshotRef.current) {
      const snapshot = editSnapshotRef.current;

      setStopsByDay((previous) => ({
        ...previous,
        [activeDayId]: snapshot,
      }));
    }

    editSnapshotRef.current = null;
    setIsEditMode(false);
    setMenuId(null);
    setShowSaveStatus(false);
    resetDrag();
  };

  const handleSave = () => {
    setIsEditMode(false);
    setMenuId(null);
    resetDrag();
    editSnapshotRef.current = null;
    setShowSaveStatus(true);
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

    updateStops((previous) => {
      const fromIndex = previous.findIndex((item) => item.id === sourceId);
      const toIndex = previous.findIndex((item) => item.id === targetId);

      if (fromIndex < 0 || toIndex < 0) {
        return previous;
      }

      return moveStop(previous, fromIndex, toIndex);
    });

    resetDrag();
  };

  const toggleMenu = (id: number) => {
    setMenuId((previous) => (previous === id ? null : id));
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

  const deleteStop = (id: number) => {
    if (!window.confirm("이 일정을 삭제하시겠습니까?")) {
      return;
    }

    updateStops((previous) => previous.filter((item) => item.id !== id));

    setMenuId(null);
  };

  const handleAddPlaces = (places: ScheduledPlace[]) => {
    const targetDay = days.find(
      (day) => day.isoDate === placeModalDay?.isoDate,
    );
    if (!targetDay)
      throw new Error("추가할 날짜가 변경되었습니다. 다시 열어 주세요.");
    const added: Stop[] = places.map((place, index) => ({
      id: Date.now() + index,
      placeId: place.id,
      title: place.name,
      time: place.startTime,
      description: "",
      address: place.address,
      category: Object.prototype.hasOwnProperty.call(
        CATEGORY_ICONS,
        place.category,
      )
        ? (place.category as Category)
        : "관광지",
      image: place.image || defaultTripImage,
      x: 50,
      y: 50,
      stayDurationMinutes: place.stayDurationMinutes,
      transport: place.transport,
      ...("lat" in place && typeof place.lat === "number"
        ? { lat: place.lat }
        : {}),
      ...("lng" in place && typeof place.lng === "number"
        ? { lng: place.lng }
        : {}),
    }));
    setStopsByDay((previous) => {
      const existing = previous[targetDay.id] ?? [];
      const unique = added.filter(
        (item) => !existing.some((stop) => stop.placeId === item.placeId),
      );
      return { ...previous, [targetDay.id]: [...existing, ...unique] };
    });
    setShowSaveStatus(false);
    setIsPlaceModalOpen(false);
  };

  // 카카오 지도에서 선택한 장소 추가
  const addPlaceFromKakao = (place: KakaoPlace) => {
    updateStops((previous) => [
      ...previous,
      {
        id: Date.now(),
        title: place.name,
        time: selectedTrip.startTime,
        description: "카카오 지도에서 추가한 장소",
        address: place.address,
        category: "관광지",
        image: defaultTripImage,
        x: 50,
        y: 50,
        lat: place.lat,
        lng: place.lng,
      },
    ]);
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
    <S.Page>
      <S.SidebarArea>
        <MainSidebar />
      </S.SidebarArea>

      <S.MobileHeaderArea>
        <MobileHeader />
      </S.MobileHeaderArea>

      <S.MainContent>
        <S.Container>
          <S.Header>
            <S.BreadcrumbWrapper>
              <Breadcrumb
                items={[
                  {
                    label: "내 여행",
                    to: "/",
                    Icon: House,
                  },
                  {
                    label: "여행 상세",
                  },
                ]}
              />
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
                  {isEditingTripName ? (
                    <S.TripNameEditor aria-busy={isSavingTripName}>
                      <div className="trip-name-controls">
                        <input
                          autoFocus
                          aria-label="여행 이름"
                          aria-invalid={Boolean(tripNameError)}
                          maxLength={50}
                          value={draftTripName}
                          disabled={isSavingTripName}
                          onFocus={(event) => event.currentTarget.select()}
                          onChange={(event) => {
                            setDraftTripName(event.target.value);
                            setTripNameError("");
                          }}
                          onKeyDown={(event) => {
                            if (event.nativeEvent.isComposing) return;

                            if (event.key === "Enter") {
                              event.preventDefault();
                              void handleSaveTripName();
                            }

                            if (event.key === "Escape") {
                              event.preventDefault();
                              event.stopPropagation();
                              cancelEditingTripName();
                            }
                          }}
                        />

                        <S.IconButton
                          className="trip-name-confirm"
                          type="button"
                          aria-label={
                            isSavingTripName ? "저장 중" : "여행 이름 저장"
                          }
                          title={isSavingTripName ? "저장 중" : "저장"}
                          disabled={isSavingTripName}
                          onClick={() => void handleSaveTripName()}
                        >
                          <Check size={17} />
                        </S.IconButton>

                        <S.IconButton
                          className="trip-name-cancel"
                          type="button"
                          aria-label="여행 이름 수정 취소"
                          title="취소"
                          disabled={isSavingTripName}
                          onClick={cancelEditingTripName}
                        >
                          <X size={17} />
                        </S.IconButton>
                      </div>

                      {tripNameError && (
                        <p className="trip-name-error" role="alert">
                          {tripNameError}
                        </p>
                      )}
                    </S.TripNameEditor>
                  ) : (
                    <>
                      <S.TripTitle>{tripName}</S.TripTitle>

                      <S.IconButton
                        ref={tripNameEditButtonRef}
                        type="button"
                        aria-label="여행 이름 편집"
                        title="여행 이름 편집"
                        onClick={startEditingTripName}
                      >
                        <Pencil size={17} />
                      </S.IconButton>
                    </>
                  )}
                </S.TripTitleRow>
                <S.TripDate>{tripDateText}</S.TripDate>
                <S.MemberList>
                  <S.MemberAvatar
                    title={user?.username || "여행 소유자"}
                    aria-label={user?.username || "여행 소유자"}
                  >
                    <img
                      key={user?.avatarUrl || defaultProfileImage}
                      src={user?.avatarUrl || defaultProfileImage}
                      alt={user?.username || "여행 소유자"}
                      onError={(event) => {
                        const image = event.currentTarget;

                        if (image.getAttribute("src") !== defaultProfileImage) {
                          image.src = defaultProfileImage;
                        }
                      }}
                    />
                  </S.MemberAvatar>

                  <S.MemberAdd
                    type="button"
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

              <S.AddDayButton
                type="button"
                onClick={() => setShowDateModal(true)}
              >
                <Pencil size={18} />
                여행 날짜 수정
              </S.AddDayButton>
            </S.DayTabs>
          )}

          {activeTab === "schedule" || activeTab === "map" ? (
            <S.ContentGrid>
              <S.SchedulePanel data-tablet-hidden={activeTab === "map"}>
                <S.ScheduleHeading>
                  <S.ScheduleHeadingLeft>
                    <h2>Day {activeDay.id}</h2>

                    <span>
                      {Number(activeDay.date.split(".")[0])}월{" "}
                      {Number(activeDay.date.split(".")[1])}일 (
                      {activeDay.weekday})
                    </span>

                    <S.Weather>
                      <Cloud size={20} />
                      <span>{selectedTrip.region} · 날씨 정보 없음</span>
                      <ChevronRight size={14} />
                    </S.Weather>
                  </S.ScheduleHeadingLeft>

                  {(stops.length > 0 || isEditMode) && (
                    <S.DesktopEditAction>
                      {isEditMode ? (
                        <S.CancelEditButton
                          type="button"
                          onClick={handleCancelEdit}
                        >
                          취소
                        </S.CancelEditButton>
                      ) : (
                        <S.EditModeButton
                          type="button"
                          $active={false}
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
                        <S.EditActionGroup>
                          <S.CancelEditButton
                            type="button"
                            onClick={handleCancelEdit}
                          >
                            취소
                          </S.CancelEditButton>

                          <S.SaveEditButton type="button" onClick={handleSave}>
                            <Check size={14} />
                            저장하기
                          </S.SaveEditButton>
                        </S.EditActionGroup>
                      ) : (
                        <S.EditModeButton
                          type="button"
                          $active={false}
                          onClick={toggleEditMode}
                        >
                          <Pencil size={15} />
                          편집하기
                        </S.EditModeButton>
                      )}
                    </S.MobileEditAction>
                  )}
                </S.ScheduleHeading>

                {isEditMode && stops.length > 1 && (
                  <S.EditHint>
                    왼쪽의 점 6개를 잡고 드래그하여 일정 순서를 변경하세요.
                  </S.EditHint>
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
                      key={stop.id}
                      stop={stop}
                      index={index}
                      isEditMode={isEditMode}
                      menuId={menuId}
                      draggingId={draggingId}
                      dragOverId={dragOverId}
                      onMenuToggle={toggleMenu}
                      onEdit={(item) => {
                        setEditingStop({
                          ...item,
                        });
                        setMenuId(null);
                      }}
                      onDelete={deleteStop}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={resetDrag}
                    />
                  ))}
                </S.StopList>

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

              <S.MapPanel data-tablet-hidden={activeTab === "schedule"}>
                <S.MapCanvas>
                  {activeTab === "map" ? (
                    <KakaoTravelMap
                      region={selectedTrip.region}
                      stops={visibleMapStops}
                      routeStops={stops}
                      showRoute={showRoute}
                      zoom={mapZoom}
                      onAddPlace={addPlaceFromKakao}
                    />
                  ) : (
                    <KakaoMap
                      stops={kakaoMapStops}
                      category={activeFilter}
                      showRoute={showRoute}
                      zoom={mapZoom}
                    />
                  )}
                </S.MapCanvas>

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

                    <span>{showRoute ? "경로 숨기기" : "전체 경로 보기"}</span>
                  </S.RouteToggle>
                </S.MapToolbar>

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
            </S.ContentGrid>
          ) : activeTab === "checklist" ? (
            hasChecklistItems ? (
              <Checklist
                groups={checklistGroups}
                onChange={setChecklistGroups}
              />
            ) : (
              <EmptyChecklist />
            )
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

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        tripId={selectedTrip.id}
        tripName={selectedTrip.name}
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
        open={isPlaceModalOpen}
        onClose={() => setIsPlaceModalOpen(false)}
        dayLabel={`Day ${placeModalDay?.id ?? activeDay.id}`}
        dateLabel={`${(placeModalDay ?? activeDay).date} (${(placeModalDay ?? activeDay).weekday})`}
        region={selectedTrip.region}
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
