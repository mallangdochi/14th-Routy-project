import { useSyncExternalStore } from "react";
import { loadNotificationPreferences, type NotificationPreferences } from "../../api/browserPush";
import { loadNotifications } from "../../api/notifications";
import { setPendingNotificationItems, setPendingNotificationCount } from "./notificationCountState";
import type { NotificationItem } from "./notification.types";
type State = { userId: string | null; items: NotificationItem[]; loading: boolean; error: string; settings?: NotificationPreferences };
const empty: State = { userId: null, items: [], loading: true, error: "" };
let state = empty;
let controller: AbortController | null = null;
let task: Promise<void> | null = null;
let generation = 0;
let preferencesCheckedAt = 0;
const PREFERENCES_INTERVAL = 300_000;
const listeners = new Set<() => void>();
function emit(next: State) { state = next; for (const fn of listeners) fn(); }
function subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }
export function selectNotificationUser(userId: string | null) {
 if (state.userId === userId) return;
 generation++; controller?.abort(); task = null; preferencesCheckedAt = 0;
 if (state.userId) setPendingNotificationCount(state.userId, 0);
 emit({ userId, items: [], loading: Boolean(userId), error: "" });
}
export function refreshNotifications(force = false) {
 if (force) { generation++; controller?.abort(); task = null; }
 if (!state.userId) return Promise.resolve();
 if (task) return task;
 const userId = state.userId, version = generation;
 controller = new AbortController();
 const signal = controller.signal;
 const shouldLoadPreferences = force || !state.settings || Date.now() - preferencesCheckedAt >= PREFERENCES_INTERVAL;
 // Preferences can be reused between feed polls. A settings failure must
 // not prevent the unread badge from being updated.
 const preferences = shouldLoadPreferences
  ? loadNotificationPreferences(signal).then(settings => {
      if (version === generation && !signal.aborted) {
       preferencesCheckedAt = Date.now();
       emit({ ...state, settings });
      }
    }).catch(() => undefined)
  : Promise.resolve();
 const feed = loadNotifications(signal).then(items => {
  if (version !== generation || signal.aborted) return;
  setPendingNotificationItems(userId, items);
  emit({ ...state, userId, items, loading: false, error: "" });
 }).catch((reason: unknown) => {
  if (version === generation && !signal.aborted)
   emit({ ...state, loading: false, error: reason instanceof Error ? reason.message : "알림을 불러오지 못했습니다." });
 });
 const pending = Promise.all([feed, preferences]).then(() => undefined)
  .finally(() => { if (task === pending) task = null; });
 task = pending; return pending;
}
export function updateNotificationItems(userId: string, change: (items: NotificationItem[]) => NotificationItem[]) {
 if (state.userId !== userId) return;
 // 변경 전 시작된 조회가 처리 결과를 덮어쓰지 않도록 무효화합니다.
 generation++; controller?.abort(); task = null;
 const items = change(state.items);
 setPendingNotificationItems(userId, items);
 emit({ ...state, items, error: "" });
}
export function useNotificationState() { return useSyncExternalStore(subscribe, () => state, () => empty); }
