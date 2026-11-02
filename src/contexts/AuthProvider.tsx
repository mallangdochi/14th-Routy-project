import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getCurrentUser, type AuthUser } from "../api/auth";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

const SESSION_CHECK_INTERVAL = 60_000;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mounted = useRef(false);
  const requestId = useRef(0);
  const inFlight = useRef<Promise<void> | null>(null);
  const lastCheckStartedAt = useRef<number | null>(null);

  const userId = user?.id ?? null;

  const loadUser = useCallback((force = false): Promise<void> => {
    // 최초 조회와 백그라운드 조회는 진행 중인 요청을 공유합니다.
    if (!force && inFlight.current) {
      return inFlight.current;
    }

    const currentRequest = ++requestId.current;

    lastCheckStartedAt.current = Date.now();

    const pending = getCurrentUser()
      .then((currentUser) => {
        if (!mounted.current || currentRequest !== requestId.current) {
          return;
        }

        setUser((previousUser) => {
          // 동일한 응답이면 기존 객체를 유지합니다.
          if (JSON.stringify(previousUser) === JSON.stringify(currentUser)) {
            return previousUser;
          }

          return currentUser;
        });

        setError("");
      })
      .catch((caught: unknown) => {
        if (!mounted.current || currentRequest !== requestId.current) {
          return;
        }

        // 일시적인 통신 오류만으로 기존 사용자를 지우지 않습니다.
        setError(
          caught instanceof Error
            ? caught.message
            : "로그인 상태를 확인하지 못했습니다.",
        );
      })
      .finally(() => {
        if (currentRequest !== requestId.current) {
          return;
        }

        inFlight.current = null;

        if (mounted.current) {
          setLoading(false);
        }
      });

    inFlight.current = pending;

    return pending;
  }, []);

  const refreshUser = useCallback((): Promise<void> => {
    setLoading(true);
    setError("");

    // 변경 전부터 진행 중이던 요청 대신 새로운 상태를 조회합니다.
    // 이전 요청의 응답은 requestId 검사로 무시됩니다.
    return loadUser(true);
  }, [loadUser]);

  useEffect(() => {
    mounted.current = true;

    void loadUser();

    return () => {
      mounted.current = false;
    };
  }, [loadUser]);

  useEffect(() => {
    const checkSession = (): void => {
      if (document.visibilityState !== "visible") {
        return;
      }

      if (inFlight.current) {
        return;
      }

      const lastStartedAt = lastCheckStartedAt.current;

      if (
        lastStartedAt !== null &&
        Date.now() - lastStartedAt < SESSION_CHECK_INTERVAL
      ) {
        return;
      }

      void loadUser();
    };

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    window.addEventListener("focus", checkSession);
    window.addEventListener("online", checkSession);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const timer = window.setInterval(() => {
      if (userId) {
        checkSession();
      }
    }, SESSION_CHECK_INTERVAL);

    return () => {
      window.clearInterval(timer);

      window.removeEventListener("focus", checkSession);
      window.removeEventListener("online", checkSession);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId, loadUser]);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      error,
      refreshUser,
    }),
    [user, loading, error, refreshUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
