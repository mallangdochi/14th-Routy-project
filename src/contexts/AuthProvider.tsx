import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getCurrentUser, loginWithEmail, logout, type AuthUser } from "../api/auth";
import { AuthContext } from "./AuthContext";
import { useNotificationSync } from "../components/notification/useNotificationSync";

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
  const authChanging = useRef(false);

  const userId = user?.id ?? null;

  useNotificationSync(userId, loading && !userId);

  const loadUser = useCallback((): Promise<void> => {
    // 최초 조회와 백그라운드 조회는 진행 중인 요청을 공유합니다.
    if (authChanging.current) return Promise.resolve();
    if (inFlight.current) {
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
    if (authChanging.current) return Promise.resolve();
    // Background/profile refresh should not replace the already rendered UI.
    if (!userId) setLoading(true);
    setError("");

    // A profile mutation may have happened after the previous read began.
    // Wait for the previous cookie-bearing response before reading again.
    const pending = inFlight.current;
    return pending ? pending.then(() => loadUser()) : loadUser();
  }, [loadUser, userId]);

  const commitUser = useCallback((nextUser: AuthUser | null) => {
    requestId.current += 1;
    inFlight.current = null;
    lastCheckStartedAt.current = Date.now();
    setUser(nextUser);
    setError("");
    setLoading(false);
  }, []);

  const signIn = useCallback(async (loginId: string, password: string, remember: boolean) => {
    if (authChanging.current) throw new Error("인증 요청을 처리 중입니다.");
    authChanging.current = true;
    try {
      // Prevent a concurrent /me response from arriving after login.
      await inFlight.current;
      const nextUser = await loginWithEmail(loginId, password, remember);
      commitUser(nextUser);
      return nextUser;
    } finally {
      authChanging.current = false;
    }
  }, [commitUser]);

  const signOut = useCallback(async () => {
    if (authChanging.current) throw new Error("인증 요청을 처리 중입니다.");
    authChanging.current = true;
    try {
      await inFlight.current;
      // Keep the authenticated UI on server failure; only clear on success.
      await logout();
      commitUser(null);
    } finally {
      authChanging.current = false;
    }
  }, [commitUser]);

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

      if (inFlight.current || authChanging.current) {
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
      signIn,
      signOut,
    }),
    [user, loading, error, refreshUser, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
