import { useAuth } from "../../contexts/AuthContext";
import { useNotificationSync } from "./useNotificationSync";
export default function NotificationSync() {
 const { user, loading } = useAuth();
 useNotificationSync(user?.id ?? null, loading);
 return null;
}
