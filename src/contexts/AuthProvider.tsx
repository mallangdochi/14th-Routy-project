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

  const refreshUser = useCallback(async (): Promise<void> => {
    const currentRequest = ++requestId.current;

    setLoading(true);
    setError("");

    try {
      const currentUser = await getCurrentUser();

      if (currentRequest !== requestId.current) return;

      setUser(currentUser);
    } catch (error) {
      if (currentRequest !== requestId.current) return;

      setUser(null);
      setError(
        error instanceof Error
          ? error.message
          : "로그인 상태를 확인하지 못했습니다.",
      );
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const currentRequest = ++requestId.current;

    getCurrentUser()
      .then((currentUser) => {
        if (currentRequest !== requestId.current) return;

        setUser(currentUser);
        setError("");
      })
      .catch((error: unknown) => {
        if (currentRequest !== requestId.current) return;

        setUser(null);
        setError(
          error instanceof Error
            ? error.message
            : "로그인 상태를 확인하지 못했습니다.",
        );
      })
      .finally(() => {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      });

    return () => {
      if (currentRequest === requestId.current) {
        requestId.current += 1;
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
