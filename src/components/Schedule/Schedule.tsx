import React, { useEffect, useRef, useState } from "react";
import {
  House,
  ChevronRight,
  Check,
  Pencil,
  Share2,
  MoreHorizontal,
  Plus,
  CalendarDays,
  MapPin,
  Wallet,
  ClipboardCheck,
  Cloud,
  Sun,
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

import { useParams } from "react-router";
import { trips } from "../../data/trips";

import MainSidebar from "../MainSidebar/MainSidebar";
import * as S from "./ScheduleStyle";
import KakaoTravelMap, { type KakaoPlace } from "../../map/KakaoTravelMap";

import ShareModal from "./ShareModal";
import MobileHeader from "../mobileBanner/MobileHeader";
import MobileNav from "../mobileBanner/MobileFooter";
import Breadcrumb from "../MainSidebar/mainHeader/Breadcrumb";
import Checklist from "../checklist/Checklist";
import { mockChecklist, type ChecklistGroup } from "../../data/checklist";
import EmptyChecklist from "../emptyUI/checklist/Checklist";

// ===========================
// 타입
// ===========================

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
  lat?: number;
  lng?: number;
};

type Day = {
  id: number;
  date: string;
  weekday: string;
  image: string;
};

type Tab = "schedule" | "map" | "budget" | "checklist";
type Filter = "전체" | Category;

// ===========================
// 이미지
// ===========================

const IMG = {
  airport: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
  food: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
  cafe: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400",
  nature: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
};

// ===========================
// 카테고리 및 탭
// ===========================

const CATEGORY_ICONS = {
  맛집: Utensils,
  카페: Coffee,
  관광지: Camera,
  숙소: BedDouble,
  쇼핑: ShoppingBag,
  교통: CarFront,
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
  { key: "schedule", label: "일정", icon: CalendarDays },
  { key: "map", label: "지도", icon: MapPin },
  { key: "budget", label: "예산", icon: Wallet },
  {
    key: "checklist",
    label: "체크리스트",
    icon: ClipboardCheck,
  },
];

// ===========================
// 샘플 일정
// ===========================

const INITIAL_DAYS: Day[] = [
  {
    id: 1,
    date: "10.16",
    weekday: "금",
    image: IMG.nature,
  },
  {
    id: 2,
    date: "10.17",
    weekday: "토",
    image: IMG.airport,
  },
  {
    id: 3,
    date: "10.18",
    weekday: "일",
    image: IMG.beach,
  },
];

const INITIAL_STOPS: Stop[] = [
  {
    id: 1,
    title: "제주국제공항",
    time: "09:00",
    description: "렌터카 픽업 후 출발해요.",
    address: "제주시",
    category: "교통",
    image: IMG.airport,
    x: 15,
    y: 56,
    lat: 33.5104,
    lng: 126.4929,
  },
  {
    id: 2,
    title: "함덕해수욕장",
    time: "10:30",
    description: "에메랄드빛 바다와 여유로운 산책",
    address: "제주시 조천읍",
    category: "관광지",
    image: IMG.beach,
    x: 36,
    y: 35,
    lat: 33.5434,
    lng: 126.6694,
  },
  {
    id: 3,
    title: "제주 흑돼지 맛집",
    time: "13:00",
    description: "제주에서 꼭 먹어야 할 점심",
    address: "제주시",
    category: "맛집",
    image: IMG.food,
    x: 58,
    y: 55,
  },
  {
    id: 4,
    title: "카페 멜로드",
    time: "15:00",
    description: "오션뷰 카페에서 여유로운 시간",
    address: "제주시",
    category: "카페",
    image: IMG.cafe,
    x: 70,
    y: 75,
  },
  {
    id: 5,
    title: "성산일출봉",
    time: "17:30",
    description: "제주의 대표 명소, 멋진 일몰 감상",
    address: "서귀포시 성산읍",
    category: "관광지",
    image: IMG.nature,
    x: 85,
    y: 40,
    lat: 33.4586,
    lng: 126.9424,
  },
];

// ===========================
// 일정 유틸
// ===========================

const createEmptyStop = (): Stop => ({
  id: Date.now(),
  title: "",
  time: "12:00",
  description: "",
  address: "",
  category: "관광지",
  image: IMG.beach,
  x: 50,
  y: 50,
});

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

// ===========================
// 일정 카드
// ===========================

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

// ===========================
// 메인 Schedule
// ===========================

export default function Schedule() {
  const { tripId } = useParams<{ tripId: string }>();

  const selectedTrip = trips.find((trip) => trip.id === tripId);

  const tripDateText = (() => {
    if (!selectedTrip) return "";

    const start = new Date(`${selectedTrip.startDate}T00:00:00`);
    const end = new Date(`${selectedTrip.endDate}T00:00:00`);

    const nights = Math.round((end.getTime() - start.getTime()) / 86400000);

    return `${selectedTrip.startDate.replaceAll("-", ".")} - ${selectedTrip.endDate.replaceAll("-", ".")} · ${nights}박 ${nights + 1}일`;
  })();

  const [days, setDays] = useState<Day[]>(INITIAL_DAYS);
  const [activeDayId, setActiveDayId] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("schedule");

  const [checklistGroups, setChecklistGroups] = useState<ChecklistGroup[]>(() =>
    mockChecklist.map((group) => ({
      ...group,
      items: group.items.map((item) => ({ ...item })),
    })),
  );

  const hasChecklistItems = checklistGroups.some(
    (group) => group.items.length > 0,
  );

  const [stopsByDay, setStopsByDay] = useState<Record<number, Stop[]>>({
    1: INITIAL_STOPS,
    2: [],
    3: [],
  });

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

  const [showAddForm, setShowAddForm] = useState(false);
  const [newStop, setNewStop] = useState<Stop>(createEmptyStop());
  const [editingStop, setEditingStop] = useState<Stop | null>(null);

  // 지도 관련 상태
  const [activeFilter, setActiveFilter] = useState<Filter>("전체");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [showRoute, setShowRoute] = useState(true);
  const [mapZoom, setMapZoom] = useState(1);

  const [showShareModal, setShowShareModal] = useState(false);

  const activeDay = days.find((day) => day.id === activeDayId) ?? days[0];

  const stops = stopsByDay[activeDayId] ?? [];

  const visibleMapStops = stops.filter(
    (stop) => activeFilter === "전체" || stop.category === activeFilter,
  );

  // ===========================
  // 일정 데이터 업데이트
  // ===========================

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

  // ===========================
  // 드래그 순서 변경
  // ===========================

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

  // ===========================
  // 일정 수정 및 삭제
  // ===========================

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

  const addStop = () => {
    if (!hasStopTitle(newStop)) return;

    updateStops((previous) =>
      [
        ...previous,
        {
          ...newStop,
          id: Date.now(),
          title: newStop.title.trim(),
        },
      ].sort((a, b) => a.time.localeCompare(b.time)),
    );

    setNewStop(createEmptyStop());
    setShowAddForm(false);
  };

  // ===========================
  // 카카오 지도 장소 추가
  // ===========================

  const addPlaceFromKakao = (place: KakaoPlace) => {
    updateStops((previous) => [
      ...previous,
      {
        id: Date.now(),
        title: place.name,
        time: "12:00",
        description: "카카오 지도에서 추가한 장소",
        address: place.address,
        category: "관광지",
        image: IMG.nature,
        x: 50,
        y: 50,
        lat: place.lat,
        lng: place.lng,
      },
    ]);
  };

  // ===========================
  // 날짜 추가
  // ===========================

  const addDay = () => {
    const lastDay = days[days.length - 1];
    const nextId = Math.max(...days.map((d) => d.id)) + 1;

    const date = new Date(`2026-${lastDay.date.replace(".", "-")}T12:00:00`);

    date.setDate(date.getDate() + 1);

    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    const nextDay: Day = {
      id: nextId,
      date: `${String(date.getMonth() + 1).padStart(2, "0")}.${String(
        date.getDate(),
      ).padStart(2, "0")}`,
      weekday: weekdays[date.getDay()],
      image: IMG.beach,
    };

    setDays((previous) => [...previous, nextDay]);

    setStopsByDay((previous) => ({
      ...previous,
      [nextId]: [],
    }));

    setActiveDayId(nextId);
    setIsEditMode(false);
    setMenuId(null);
    setShowSaveStatus(false);
    resetDrag();
  };

  // ===========================
  // 화면
  // ===========================

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
          {/* 여행 헤더 */}
          <S.Header>
            <S.BreadcrumbWrapper>
              <Breadcrumb
                items={[
                  {
                    label: "내 여행",
                    to: "/",
                    Icon: House,
                  },
                  { label: "여행 상세" },
                ]}
              />
            </S.BreadcrumbWrapper>

            {showSaveStatus && (
              <S.SaveStatus>
                <Cloud size={17} />
                모든 변경사항이 저장됨
              </S.SaveStatus>
            )}

            <S.TripInfo>
              <S.TripThumbnail
                src={selectedTrip?.image ?? IMG.nature}
                alt={selectedTrip?.title ?? "여행 이미지"}
              />

              <S.TripDescription>
                <S.TripTitleRow>
                  <S.TripTitle>
                    {selectedTrip?.title ?? "여행 정보 없음"}
                  </S.TripTitle>

                  <S.IconButton type="button" aria-label="여행 제목 편집">
                    <Pencil size={17} />
                  </S.IconButton>
                </S.TripTitleRow>

                <S.TripDate>{tripDateText}</S.TripDate>

                <S.MemberList>
                  <S.MemberAvatar>👩</S.MemberAvatar>
                  <S.MemberAvatar>👨</S.MemberAvatar>
                  <S.MemberAvatar>👩🏻</S.MemberAvatar>

                  <S.MemberAdd
                    type="button"
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

                <S.SecondaryButton
                  type="button"
                  aria-label="공유"
                  onClick={() => setShowShareModal(true)}
                >
                  <Share2 size={18} />
                  <S.ShareLabel>공유</S.ShareLabel>
                </S.SecondaryButton>

                <S.SecondaryButton type="button" aria-label="더보기">
                  <MoreHorizontal size={19} />
                </S.SecondaryButton>
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

          {/* 날짜 선택 */}
          {(activeTab === "schedule" || activeTab === "map") && (
            <S.DayTabs>
              {days.map((day) => (
                <S.DayButton
                  key={day.id}
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

              <S.AddDayButton type="button" onClick={addDay}>
                <Plus size={18} />날 추가
              </S.AddDayButton>
            </S.DayTabs>
          )}

          {/* 일정 + 지도 */}
          {activeTab === "schedule" || activeTab === "map" ? (
            <S.ContentGrid>
              {/* 일정 패널 */}
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
                      <Sun size={20} color="#FFAA18" fill="#FFAA18" />
                      <span>제주 20°C / 14°C</span>
                      <ChevronRight size={14} />
                    </S.Weather>
                  </S.ScheduleHeadingLeft>

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
                </S.ScheduleHeading>

                {isEditMode && stops.length > 1 && (
                  <S.EditHint>
                    왼쪽의 점 6개를 잡고 드래그하여 일정 순서를 변경하세요.
                  </S.EditHint>
                )}

                {/* 일정 카드 */}
                <S.StopList>
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

                {/* 장소 추가 */}
                {!showAddForm && (
                  <S.AddPlaceButton
                    type="button"
                    onClick={() => {
                      setNewStop(createEmptyStop());
                      setShowAddForm(true);
                    }}
                  >
                    <S.AddPlaceTitle>
                      <Plus size={17} />
                      장소 추가하기
                    </S.AddPlaceTitle>

                    <span>맛집, 카페, 명소 등 원하는 장소를 추가해보세요.</span>
                  </S.AddPlaceButton>
                )}

                {showAddForm && (
                  <S.AddForm>
                    <S.AddFormHeading>
                      <strong>새 장소 추가</strong>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                      >
                        <X size={17} />
                      </button>
                    </S.AddFormHeading>

                    <S.FormInput
                      placeholder="장소 이름"
                      value={newStop.title}
                      onChange={(event) =>
                        setNewStop({
                          ...newStop,
                          title: event.target.value,
                        })
                      }
                    />

                    <S.FormInput
                      type="time"
                      value={newStop.time}
                      onChange={(event) =>
                        setNewStop({
                          ...newStop,
                          time: event.target.value,
                        })
                      }
                    />

                    <S.FormInput
                      placeholder="장소 설명"
                      value={newStop.description}
                      onChange={(event) =>
                        setNewStop({
                          ...newStop,
                          description: event.target.value,
                        })
                      }
                    />

                    <S.FormInput
                      placeholder="주소"
                      value={newStop.address}
                      onChange={(event) =>
                        setNewStop({
                          ...newStop,
                          address: event.target.value,
                        })
                      }
                    />

                    <S.FormSelect
                      value={newStop.category}
                      onChange={(event) =>
                        setNewStop({
                          ...newStop,
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

                    <S.PrimaryButton type="button" onClick={addStop}>
                      <Plus size={16} />
                      추가하기
                    </S.PrimaryButton>
                  </S.AddForm>
                )}
              </S.SchedulePanel>

              {/* =======================
                  실제 카카오 지도
              ======================= */}
              <S.MapPanel data-tablet-hidden={activeTab === "schedule"}>
                <S.MapCanvas>
                  <KakaoTravelMap
                    region={selectedTrip?.region ?? "제주"}
                    stops={visibleMapStops}
                    routeStops={stops}
                    showRoute={showRoute}
                    zoom={mapZoom}
                    onAddPlace={addPlaceFromKakao}
                  />
                </S.MapCanvas>

                {/* 카테고리 필터 */}
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

                  {/* 모바일 필터 */}
                  <S.MobileFilterWrapper>
                    <S.MobileFilterTrigger
                      type="button"
                      aria-expanded={isMobileFilterOpen}
                      aria-label="지도 카테고리 선택"
                      onClick={() => setIsMobileFilterOpen((prev) => !prev)}
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
                    onClick={() => setShowRoute((previous) => !previous)}
                  >
                    <Route size={17} />
                    {showRoute ? "경로 숨기기" : "전체 경로 보기"}
                  </S.RouteToggle>
                </S.MapToolbar>

                {/* 지도 줌 */}
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
          ) : (
            <S.EmptyPanel>
              <Wallet size={38} />
              <h2>여행 예산</h2>
              <p>해당 화면은 추후 연결 예정입니다.</p>
            </S.EmptyPanel>
          )}
        </S.Container>
      </S.MainContent>

      {/* 저장 완료 토스트 */}
      {showSaveStatus && (
        <S.MobileSaveToast role="status" aria-live="polite">
          <S.MobileSaveToastIcon>
            <Check size={18} strokeWidth={2.5} />
          </S.MobileSaveToastIcon>
          <span>모든 변경사항이 저장됨</span>
        </S.MobileSaveToast>
      )}

      <S.MobileNavArea>
        <MobileNav />
      </S.MobileNavArea>

      {/* 일정 수정 모달 */}
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
      />
    </S.Page>
  );
}
