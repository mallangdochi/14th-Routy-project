// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
//   type ReactNode,
// } from "react";
// import { getCurrentUser, type AuthUser } from "../api/auth";
// import { AuthContext } from "./AuthContext";

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export default function AuthProvider({ children }: AuthProviderProps) {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const requestId = useRef(0);

//   const refreshUser = useCallback(async (): Promise<void> => {
//     const currentRequest = ++requestId.current;

//     setLoading(true);
//     setError("");

//     try {
//       const currentUser = await getCurrentUser();

//       if (currentRequest !== requestId.current) return;

//       setUser(currentUser);
//     } catch (error) {
//       if (currentRequest !== requestId.current) return;

//       setUser(null);
//       setError(
//         error instanceof Error
//           ? error.message
//           : "로그인 상태를 확인하지 못했습니다.",
//       );
//     } finally {
//       if (currentRequest === requestId.current) {
//         setLoading(false);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const currentRequest = ++requestId.current;

//     getCurrentUser()
//       .then((currentUser) => {
//         if (currentRequest !== requestId.current) return;

//         setUser(currentUser);
//         setError("");
//       })
//       .catch((error: unknown) => {
//         if (currentRequest !== requestId.current) return;

//         setUser(null);
//         setError(
//           error instanceof Error
//             ? error.message
//             : "로그인 상태를 확인하지 못했습니다.",
//         );
//       })
//       .finally(() => {
//         if (currentRequest === requestId.current) {
//           setLoading(false);
//         }
//       });

//     return () => {
//       if (currentRequest === requestId.current) {
//         requestId.current += 1;
//       }
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, error, refreshUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getCurrentUser, type AuthUser } from "../api/auth";

import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const requestId = useRef(0);
  const backgroundBusy = useRef(false);

  const userId = user?.id ?? null;

  const loadUser = useCallback((): Promise<void> => {
    const currentRequest = ++requestId.current;

    return getCurrentUser()
      .then((currentUser) => {
        if (currentRequest !== requestId.current) {
          return;
        }

        // 서버가 401을 반환하면 getCurrentUser()는 null을 반환합니다.
        setUser(currentUser);
        setError("");
      })
      .catch((caught: unknown) => {
        if (currentRequest !== requestId.current) {
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
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      });
  }, []);

  const refreshUser = useCallback((): Promise<void> => {
    setLoading(true);
    setError("");

    return loadUser();
  }, [loadUser]);

  useEffect(() => {
    void loadUser();

    return () => {
      requestId.current += 1;
    };
  }, [loadUser]);

  useEffect(() => {
    let disposed = false;

    const checkSession = async (): Promise<void> => {
      if (
        disposed ||
        document.visibilityState !== "visible" ||
        backgroundBusy.current
      ) {
        return;
      }

      backgroundBusy.current = true;

      try {
        await loadUser();
      } finally {
        backgroundBusy.current = false;
      }
    };

    const handleFocus = () => {
      void checkSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkSession();
      }
    };

    const handleOnline = () => {
      void checkSession();
    };

    window.addEventListener("focus", handleFocus);

    window.addEventListener("online", handleOnline);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const timer = window.setInterval(() => {
      if (userId) {
        void checkSession();
      }
    }, 60_000);

    return () => {
      disposed = true;

      window.clearInterval(timer);

      window.removeEventListener("focus", handleFocus);

      window.removeEventListener("online", handleOnline);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId, loadUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
