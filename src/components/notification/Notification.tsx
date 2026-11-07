import { useAuth } from "../../contexts/AuthContext";
import { setPendingNotificationItems } from "./notificationCountStore";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Bell, LockKeyhole, UserRound, Trash2, CheckCircle2, X } from "lucide-react";
import Breadcrumb from "../MainSidebar/mainHeader/Breadcrumb";
import defaultEmptyImage from "../../assets/go.webp";
import type { NotificationItem, NotificationProps, NotificationTab } from "./notification.types";
import * as S from "./notificationStyle";
import { filterNotifications, relativeTime } from "./notification.utils";

export type { NotificationItem, NotificationProps, NotificationTab } from "./notification.types";
const tabs: { key: NotificationTab; label: string }[] = [
  { key: "all", label: "전체" }, { key: "pending", label: "승인 요청" }, { key: "completed", label: "처리 완료" },
];
const emptyCopy = {
  all: ["아직 도착한 알림이 없어요", "여행 참여 요청이 도착하면\n이곳에서 확인하고 승인할 수 있어요."],
  pending: ["새로운 승인 요청이 없어요", "참여 요청이 도착하면\n여기에서 확인할 수 있어요."],
  completed: ["처리 완료된 요청이 없어요", "승인하거나 거절한 요청이\n여기에 표시돼요."],
} satisfies Record<NotificationTab, [string, string]>;
type SwipeRowProps = {
  item: NotificationItem;
  open: boolean;
  onOpen: (id: string | null) => void;
  onDelete: (item: NotificationItem) => void;
  children: ReactNode;
  busy?: boolean;
};
function SwipeRow({ item, open, onOpen, onDelete, children, busy }: SwipeRowProps) {
  const completed = item.status === "approved" || item.status === "rejected";
  const [offset, setOffset] = useState<number | null>(null);
  const gesture = useRef<{ id: number; x: number; y: number; start: number; axis: "x" | "y" | null; value: number } | null>(null);
  const suppressClick = useRef(false);
  const start = (event: PointerEvent<HTMLDivElement>) => {
    if (!completed || event.pointerType === "mouse" || !event.isPrimary) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY,
      start: open ? -76 : 0, axis: null, value: open ? -76 : 0 };
    suppressClick.current = false;
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x, dy = event.clientY - current.y;
    if (!current.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
      current.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
      if (current.axis === "x") event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (current.axis !== "x") return;
    if (event.cancelable) event.preventDefault();
    suppressClick.current = true;
    current.value = Math.max(-76, Math.min(0, current.start + dx));
    setOffset(current.value);
  };
  const finish = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    if (current.axis === "x") onOpen(cancelled ? (open ? item.id : null) : current.value < -30 ? item.id : null);
    setOffset(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <S.SwipeRow data-open={open} data-deletable={completed}
    onKeyDown={(event) => { if (event.key === "Escape") onOpen(null); }}>
    {completed && <S.SwipeDelete type="button" disabled={!open} tabIndex={open ? 0 : -1}
      aria-hidden={!open} aria-label={`${item.requesterName}님의 처리완료 알림 삭제`}
      onClick={() => onDelete(item)}><Trash2 size={20} /><span>삭제</span></S.SwipeDelete>}
    <S.Card aria-busy={busy} data-deletable={completed} data-dragging={offset !== null}
      style={{ transform: `translateX(${completed ? offset ?? (open ? -76 : 0) : 0}px)` }}
      onPointerDown={start} onPointerMove={move} onPointerUp={(event) => finish(event)}
      onPointerCancel={(event) => finish(event, true)}
      onClickCapture={(event) => {
        if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
      }}>
      {children}
      {completed && <S.DesktopDelete data-desktop-delete="" type="button" aria-label={`${item.requesterName}님의 처리완료 알림 삭제`}
        onClick={() => onDelete(item)}><Trash2 size={19} /></S.DesktopDelete>}
    </S.Card>
  </S.SwipeRow>;
}
function Avatar({ item }: { item: NotificationItem }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return <S.Avatar aria-hidden="true">
    {item.avatarUrl && item.avatarUrl !== failedSrc
      ? <img src={item.avatarUrl} alt="" onError={() => setFailedSrc(item.avatarUrl ?? null)} />
      : <UserRound size={25} strokeWidth={1.5} />}
  </S.Avatar>;
}
export default function Notification({
  items = [], loading = false, error, initialTab = "all", emptyImageSrc = defaultEmptyImage,
  onDecision, onRetry, onDelete, onRestore,
}: NotificationProps) {
  const { user } = useAuth();
  useEffect(() => {
    if (user?.id && !loading && !error) setPendingNotificationItems(user.id, items);
  }, [user?.id, items, loading, error]);
  const [tab, setTab] = useState<NotificationTab>(initialTab);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [undoIds, setUndoIds] = useState<string[]>([]);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const undoRef = useRef<string[]>([]);
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deletedRef = useRef(new Set<string>());
  useEffect(() => () => { if (deleteTimer.current !== null) clearTimeout(deleteTimer.current); }, []);
  const closeToast = () => {
    if (deleteTimer.current !== null) clearTimeout(deleteTimer.current);
    deleteTimer.current = null; undoRef.current = []; setUndoIds([]);
  };
  const deletedItems = useRef(new Map<string, NotificationItem>());
  const deleteBusy = useRef(false);
  const removeNotification = async (item: NotificationItem) => {
    if (!onDelete || deleteBusy.current) return;
    deleteBusy.current = true;
    try {
      await onDelete(item);
      deletedItems.current.set(item.id, item);
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : "알림을 삭제하지 못했습니다.");
      return;
    } finally { deleteBusy.current = false; }
    if (item.status === "pending" || deletedRef.current.has(item.id)) return;
    deletedRef.current.add(item.id);
    setDeletedIds(new Set(deletedRef.current));
    setOpenRow(null);
    const batch = [...undoRef.current, item.id];
    undoRef.current = batch; setUndoIds(batch);
    if (deleteTimer.current !== null) clearTimeout(deleteTimer.current);
    deleteTimer.current = setTimeout(() => {
      undoRef.current = []; setUndoIds([]); deleteTimer.current = null;
    }, 3000);
  };
  const undoDelete = async () => {
    const restored = undoRef.current;
    if (!restored.length) return;
    if (!onRestore || deleteBusy.current) return;
    deleteBusy.current = true;
    // 복원 요청 도중 토스트 만료로 실행취소 대상이 사라지지 않게 합니다.
    if (deleteTimer.current !== null) clearTimeout(deleteTimer.current);
    try {
      await onRestore(restored.flatMap(id => { const item = deletedItems.current.get(id); return item ? [item] : []; }));
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : "알림을 복원하지 못했습니다.");
      return;
    } finally { deleteBusy.current = false; }
    for (const deletedId of restored) deletedRef.current.delete(deletedId);
    setDeletedIds(new Set(deletedRef.current));
    closeToast();
  };
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const actionRef = useRef(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const selectedIndex = Math.max(0, tabs.findIndex((item) => item.key === tab));
  const selectedLabel = tabs[selectedIndex]?.label ?? "전체";
  const visible = filterNotifications(items.filter((item) => item.status === "pending" || !deletedIds.has(item.id)), tab);
  const changeTab = (next: NotificationTab) => { setTab(next); setActionError(""); setOpenRow(null); };
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    const nextTab = tabs[next];
    if (!nextTab) return;
    event.preventDefault(); changeTab(nextTab.key); buttonRefs.current[next]?.focus();
  };
  const decide = async (item: NotificationItem, decision: "approved" | "rejected") => {
    if (!onDecision || item.status !== "pending" || actionRef.current) return;
    actionRef.current = true; setPendingId(item.id); setActionError("");
    try { await onDecision(item, decision); }
    catch (reason) { setActionError(reason instanceof Error ? reason.message : "요청을 처리하지 못했습니다. 다시 시도해주세요."); }
    finally { actionRef.current = false; setPendingId(null); }
  };
  return <S.Container aria-labelledby={`${id}-title`}>
    <S.BreadcrumbRow><Breadcrumb items={[{ label: "알림", Icon: Bell }]} /></S.BreadcrumbRow>
    <S.Title id={`${id}-title`}>알림내역</S.Title>
    <S.TabBar>
      <S.TabTrack role="tablist" aria-label="알림 분류">
        {tabs.map(({ key, label }, index) => <S.Tab key={key} type="button" role="tab"
          id={`${id}-${key}-tab`} aria-controls={`${id}-panel`} aria-selected={tab === key}
          tabIndex={tab === key ? 0 : -1} ref={(node) => { buttonRefs.current[index] = node; }}
          onClick={() => changeTab(key)} onKeyDown={(event) => onTabKeyDown(event, index)}>{label}</S.Tab>)}
        <S.Indicator aria-hidden="true" style={{ transform: `translateX(${selectedIndex * 100}%)` }} />
      </S.TabTrack>
    </S.TabBar>
    <S.Panel role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${tab}-tab`} tabIndex={0} aria-busy={loading}>
      {actionError && <S.Feedback role="alert">{actionError}</S.Feedback>}
      {loading ? <S.Status role="status">알림을 불러오고 있어요.</S.Status> : error ?
        <S.Status role="alert"><p>{error}</p>{onRetry && <S.ActionButton type="button" onClick={onRetry}>다시 시도</S.ActionButton>}</S.Status> : <>
          <S.Count aria-live="polite">총 <strong>{visible.length}건</strong>의 {tab === "pending" ? "승인 요청이" : tab === "completed" ? "처리 완료된 요청이" : "알림이"} 있어요.</S.Count>
          {visible.length ? <S.List aria-label={`${selectedLabel} 목록`}>
            {visible.map((item) => {
              const pending = item.status === "pending";
              const time = pending ? item.requestedAt : item.decidedAt ?? item.requestedAt;
              const timeLabel = relativeTime(time, now);
              return <SwipeRow key={item.id} item={item} open={openRow === item.id}
                onOpen={setOpenRow} onDelete={(item) => { void removeNotification(item); }} busy={pendingId === item.id}>
                <Avatar item={item} />
                <S.Name>{item.requesterName}</S.Name>
                {timeLabel && <S.Time dateTime={time}>{timeLabel}</S.Time>}
                <S.TripLine><strong>{item.tripName}</strong>
                  <S.Badge data-tone={item.status}>{pending ? `${item.permission === "editor" ? "편집" : "보기"} 권한 요청` : item.status === "approved" ? "승인 완료" : "거절 완료"}</S.Badge>
                </S.TripLine>
                {pending && <>
                  <S.Detail>
                    {item.permission === "editor" && <S.Verified><LockKeyhole size={14} />방 비밀번호 확인 완료</S.Verified>}
                    <p>{item.permission === "editor" ? "여행에 편집자로 참여하고 싶어요." : "여행 일정을 확인하고 싶어요."}</p>
                  </S.Detail>
                  <S.Actions>
                    <S.ActionButton type="button" disabled={!onDecision || pendingId !== null}
                      aria-label={`${item.requesterName}님의 ${item.tripName} 참여 요청 거절`}
                      onClick={() => void decide(item, "rejected")}>거절</S.ActionButton>
                    <S.ActionButton type="button" data-primary="true" disabled={!onDecision || pendingId !== null}
                      aria-label={`${item.requesterName}님의 ${item.tripName} 참여 요청 승인`}
                      onClick={() => void decide(item, "approved")}>{pendingId === item.id ? "처리 중…" : "승인"}</S.ActionButton>
                  </S.Actions>
                </>}
              </SwipeRow>;
            })}
          </S.List> : <S.Empty>
            <img src={emptyImageSrc} alt="" aria-hidden="true" />
            <h2>{emptyCopy[tab][0]}</h2><p>{emptyCopy[tab][1]}</p>
          </S.Empty>}
        </>}
    </S.Panel>
    {undoIds.length > 0 && <S.ToastLayer>
      <S.Toast aria-label="알림 삭제 안내">
        <S.ToastMessage role="status" aria-live="polite" aria-atomic="true">
          <CheckCircle2 size={19} aria-hidden="true" />
          <span>{undoIds.length === 1 ? "알림이 삭제됐어요" : `알림 ${undoIds.length}건이 삭제됐어요`}</span>
        </S.ToastMessage>
        <S.UndoButton type="button" onClick={() => { void undoDelete(); }}>실행취소</S.UndoButton>
        <S.ToastClose type="button" aria-label="삭제 안내 닫기" onClick={closeToast}><X size={17} /></S.ToastClose>
      </S.Toast>
    </S.ToastLayer>}
  </S.Container>;
}
