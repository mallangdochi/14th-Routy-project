import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  getSavedPlaces,
  savePlace,
  removeSavedPlace,
} from "../api/savedPlaces";

type PlaceCategory =
  | "attraction"
  | "restaurant"
  | "cafe"
  | "accommodation"
  | "other";

type PlaceIdentity = {
  provider: string;
  placeId: string;
};

type SavePlaceInput = PlaceIdentity & {
  name: string;
  category: PlaceCategory;
  address: string;
  description?: string;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type SavedPlace = SavePlaceInput & {
  createdAt: string;
};

type SavedPlacesContextValue = {
  savedPlaces: SavedPlace[];
  isLoading: boolean;
  loadError: string | null;

  isSaved: (place: PlaceIdentity) => boolean;
  isPending: (place: PlaceIdentity) => boolean;

  toggleSaved: (place: SavePlaceInput) => Promise<void>;
  reload: () => Promise<void>;
};

type SavedPlacesProviderProps = {
  userId: string | null;
  children: ReactNode;
};

const SavedPlacesContext = createContext<SavedPlacesContextValue | null>(null);

function getPlaceKey(place: PlaceIdentity): string {
  return JSON.stringify([place.provider, place.placeId]);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "저장한 장소를 처리하지 못했어요.";
}

/**
 * 로그인 계정이 바뀌면 내부 상태도 새로 생성.
 * 로그아웃 시 이전 사용자의 저장 목록을 비움.
 */
export function SavedPlacesProvider({
  userId,
  children,
}: SavedPlacesProviderProps) {
  return (
    <SavedPlacesSession key={userId ?? "guest"} userId={userId}>
      {children}
    </SavedPlacesSession>
  );
}

function SavedPlacesSession({ userId, children }: SavedPlacesProviderProps) {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  const [isLoading, setIsLoading] = useState(Boolean(userId));

  const [loadError, setLoadError] = useState<string | null>(null);

  const [pendingKeys, setPendingKeys] = useState<Set<string>>(() => new Set());

  // 렌더링 전 연속 클릭까지 차단하기 위한 값.
  const pendingKeysRef = useRef(new Set<string>());

  // 클릭 처리에서는 가장 최근 저장 목록을 확인.
  const savedPlacesRef = useRef<SavedPlace[]>([]);

  const loadingRef = useRef(Boolean(userId));
  const loadErrorRef = useRef<string | null>(null);

  // 이전 조회 응답이 최신 상태를 덮어쓰지 않도록 구분.
  const requestVersionRef = useRef(0);

  // 언마운트 이후 요청 결과 반영 방지.
  const mountedRef = useRef(false);

  const applyPlaces = useCallback((places: SavedPlace[]) => {
    savedPlacesRef.current = places;
    setSavedPlaces(places);
  }, []);

  /**
   * 로그인한 사용자의 저장 목록 최초 조회.
   */
  useEffect(() => {
    mountedRef.current = true;

    if (!userId) {
      return () => {
        mountedRef.current = false;
      };
    }

    let active = true;
    const requestVersion = ++requestVersionRef.current;

    void getSavedPlaces()
      .then((places) => {
        if (!active || requestVersion !== requestVersionRef.current) {
          return;
        }

        applyPlaces(places);

        loadErrorRef.current = null;
        setLoadError(null);
      })
      .catch((error: unknown) => {
        if (!active || requestVersion !== requestVersionRef.current) {
          return;
        }

        const message = getErrorMessage(error);

        loadErrorRef.current = message;
        setLoadError(message);
      })
      .finally(() => {
        if (!active || requestVersion !== requestVersionRef.current) {
          return;
        }

        loadingRef.current = false;
        setIsLoading(false);
      });

    return () => {
      active = false;
      mountedRef.current = false;
      requestVersionRef.current += 1;
    };
  }, [userId, applyPlaces]);

  /**
   * 저장 목록 다시 조회.
   * 저장·삭제 처리 중이거나 이미 조회 중이면 중복 실행하지 않음.
   */
  const reload = useCallback(async (): Promise<void> => {
    if (
      !userId ||
      !mountedRef.current ||
      loadingRef.current ||
      pendingKeysRef.current.size > 0
    ) {
      return;
    }

    const requestVersion = ++requestVersionRef.current;

    loadingRef.current = true;
    loadErrorRef.current = null;

    setIsLoading(true);
    setLoadError(null);

    try {
      const places = await getSavedPlaces();

      if (!mountedRef.current || requestVersion !== requestVersionRef.current) {
        return;
      }

      applyPlaces(places);
    } catch (error) {
      if (!mountedRef.current || requestVersion !== requestVersionRef.current) {
        return;
      }

      const message = getErrorMessage(error);

      loadErrorRef.current = message;
      setLoadError(message);
    } finally {
      if (mountedRef.current && requestVersion === requestVersionRef.current) {
        loadingRef.current = false;
        setIsLoading(false);
      }
    }
  }, [userId, applyPlaces]);

  const savedKeys = useMemo(
    () => new Set(savedPlaces.map(getPlaceKey)),
    [savedPlaces],
  );

  /**
   * 해당 장소의 저장 여부.
   */
  const isSaved = useCallback(
    (place: PlaceIdentity): boolean => {
      return savedKeys.has(getPlaceKey(place));
    },
    [savedKeys],
  );

  /**
   * 해당 장소의 저장·삭제 요청 진행 여부.
   */
  const isPending = useCallback(
    (place: PlaceIdentity): boolean => {
      return pendingKeys.has(getPlaceKey(place));
    },
    [pendingKeys],
  );

  /**
   * 저장되지 않은 장소 → 저장.
   * 저장된 장소 → 저장 해제.
   *
   * 서버 요청 성공 후에만 목록을 변경.
   */
  const toggleSaved = useCallback(
    async (place: SavePlaceInput): Promise<void> => {
      if (!userId) {
        throw new Error("로그인 후 장소를 저장할 수 있어요.");
      }

      if (!mountedRef.current) return;

      if (loadingRef.current) {
        throw new Error(
          "저장 목록을 불러오는 중이에요. 잠시 후 다시 시도해 주세요.",
        );
      }

      if (loadErrorRef.current) {
        throw new Error(
          "저장 목록을 불러오지 못했어요. 목록을 다시 불러온 후 시도해 주세요.",
        );
      }

      const key = getPlaceKey(place);

      if (pendingKeysRef.current.has(key)) return;

      const wasSaved = savedPlacesRef.current.some(
        (item) => getPlaceKey(item) === key,
      );

      pendingKeysRef.current.add(key);
      setPendingKeys(new Set(pendingKeysRef.current));

      try {
        if (wasSaved) {
          await removeSavedPlace({
            provider: place.provider,
            placeId: place.placeId,
          });

          if (!mountedRef.current) return;

          applyPlaces(
            savedPlacesRef.current.filter((item) => getPlaceKey(item) !== key),
          );
        } else {
          const savedPlace = await savePlace(place);

          if (!mountedRef.current) return;

          applyPlaces([
            savedPlace,
            ...savedPlacesRef.current.filter(
              (item) => getPlaceKey(item) !== key,
            ),
          ]);
        }
      } finally {
        pendingKeysRef.current.delete(key);

        if (mountedRef.current) {
          setPendingKeys(new Set(pendingKeysRef.current));
        }
      }
    },
    [userId, applyPlaces],
  );

  const value = useMemo<SavedPlacesContextValue>(
    () => ({
      savedPlaces,
      isLoading,
      loadError,
      isSaved,
      isPending,
      toggleSaved,
      reload,
    }),
    [
      savedPlaces,
      isLoading,
      loadError,
      isSaved,
      isPending,
      toggleSaved,
      reload,
    ],
  );

  return (
    <SavedPlacesContext.Provider value={value}>
      {children}
    </SavedPlacesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSavedPlaces(): SavedPlacesContextValue {
  const context = useContext(SavedPlacesContext);

  if (context === null) {
    throw new Error(
      "useSavedPlaces는 SavedPlacesProvider 안에서 사용해야 합니다.",
    );
  }

  return context;
}
