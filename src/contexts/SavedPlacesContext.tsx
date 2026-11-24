import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getSavedPlaces, savePlace, removeSavedPlace } from "../api/savedPlaces";

type PlaceCategory = "attraction" | "restaurant" | "cafe" | "accommodation" | "other";
type PlaceIdentity = { provider: string; placeId: string };
type SavePlaceInput = PlaceIdentity & {
  name: string;
  category: PlaceCategory;
  address: string;
  description?: string;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};
type SavedPlace = SavePlaceInput & { createdAt: string };
type SavedPlacesContextValue = {
  savedPlaces: SavedPlace[];
  isLoading: boolean;
  loadError: string | null;
  isSaved: (place: PlaceIdentity) => boolean;
  isPending: (place: PlaceIdentity) => boolean;
  toggleSaved: (place: SavePlaceInput) => Promise<void>;
  reload: () => Promise<void>;
};
type SavedPlacesProviderProps = { userId: string | null; children: ReactNode };
const SavedPlacesContext = createContext<SavedPlacesContextValue | null>(null);
const getPlaceKey = (place: PlaceIdentity) => JSON.stringify([place.provider, place.placeId]);
const getErrorMessage = (error: unknown) => error instanceof Error
  ? error.message : "저장한 장소를 처리하지 못했어요.";

/** Each account receives a separate store, but App stays mounted. */
function createSavedPlacesStore(userId: string | null) {
  const listeners = new Set<() => void>();
  const pendingKeys = new Set<string>();
  let active = false;
  let task: Promise<void> | null = null;
  let initialLoadStarted = false;
  let snapshot: SavedPlacesContextValue = {
    savedPlaces: [],
    isLoading: Boolean(userId),
    loadError: null,
    isSaved: () => false,
    isPending: () => false,
    toggleSaved,
    reload,
  };

  function emit(change: Partial<SavedPlacesContextValue>) {
    const next = { ...snapshot, ...change };
    const savedKeys = new Set(next.savedPlaces.map(getPlaceKey));
    const keys = new Set(pendingKeys);
    snapshot = {
      ...next,
      isSaved: place => savedKeys.has(getPlaceKey(place)),
      isPending: place => keys.has(getPlaceKey(place)),
    };
    for (const listener of listeners) listener();
  }

  function reload(): Promise<void> {
    if (!userId || !active || pendingKeys.size) return Promise.resolve();
    if (task) return task;
    emit({ isLoading: true, loadError: null });
    const pending = getSavedPlaces().then(places => {
      emit({ savedPlaces: places });
    }).catch((error: unknown) => {
      emit({ loadError: getErrorMessage(error) });
    }).finally(() => {
      if (task === pending) {
        task = null;
        emit({ isLoading: false });
      }
    });
    task = pending;
    return pending;
  }

  async function toggleSaved(place: SavePlaceInput): Promise<void> {
    if (!userId) throw new Error("로그인 후 장소를 저장할 수 있어요.");
    if (!active) return;
    if (snapshot.isLoading) throw new Error("저장 목록을 불러오는 중이에요. 잠시 후 다시 시도해 주세요.");
    if (snapshot.loadError) throw new Error("저장 목록을 불러오지 못했어요. 목록을 다시 불러온 후 시도해 주세요.");
    const key = getPlaceKey(place);
    if (pendingKeys.has(key)) return;
    const wasSaved = snapshot.isSaved(place);
    pendingKeys.add(key);
    emit({});
    try {
      if (wasSaved) {
        await removeSavedPlace({ provider: place.provider, placeId: place.placeId });
        if (active) emit({ savedPlaces: snapshot.savedPlaces.filter(item => getPlaceKey(item) !== key) });
      } else {
        const savedPlace = await savePlace(place);
        if (active) emit({
          savedPlaces: [savedPlace, ...snapshot.savedPlaces.filter(item => getPlaceKey(item) !== key)],
        });
      }
    } finally {
      pendingKeys.delete(key);
      if (active) emit({});
    }
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    getSnapshot: () => snapshot,
    start() {
      active = true;
      if (!initialLoadStarted) {
        initialLoadStarted = true;
        if (userId) void reload();
      }
      return () => { active = false; };
    },
  };
}

export function SavedPlacesProvider({ userId, children }: SavedPlacesProviderProps) {
  // No key on the provider or children. Old account responses belong only
  // to their old store, even if they arrive after a new login.
  const store = useMemo(() => createSavedPlacesStore(userId), [userId]);
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  useEffect(() => store.start(), [store]);
  return <SavedPlacesContext.Provider value={value}>{children}</SavedPlacesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSavedPlaces(): SavedPlacesContextValue {
  const context = useContext(SavedPlacesContext);
  if (!context) throw new Error("useSavedPlaces는 SavedPlacesProvider 안에서 사용해야 합니다.");
  return context;
}
