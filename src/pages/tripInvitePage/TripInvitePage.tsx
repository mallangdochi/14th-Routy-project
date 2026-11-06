import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import TripInviteEntry, { type InviteAccessStatus, type InviteRequestInput } from "../../components/trip-invite/TripInviteEntry";
import { useAuth } from "../../contexts/AuthContext";
import {
  acceptTripInvite, getTripJoinStatus, previewTripInvite,
  type TripInvitePreview,
} from "../../api/tripSharing";
import { clearTripInviteReturn, rememberTripInvite } from "../../utils/tripInviteReturn";

type View = {
  identity: string;
  preview?: TripInvitePreview;
  status: InviteAccessStatus;
  error: string;
};
export default function TripInvitePage() {
  const { tripId } = useParams<{ tripId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, error: authError } = useAuth();
  const token = new URLSearchParams(location.hash.slice(1)).get("invite") ?? "";
  const identity = `${tripId ?? "legacy"}:${token}:${user?.id ?? "guest"}`;
  const [view, setView] = useState<View | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const current = view?.identity === identity ? view : null;

  useEffect(() => {
    if (loading && !user) return;
    const controller = new AbortController();
    async function load() {
      try {
        const preview = await previewTripInvite(token, controller.signal);
        if (tripId && tripId !== preview.tripId) throw new Error("초대받은 여행과 링크가 일치하지 않습니다.");
        let status: InviteAccessStatus = preview.status;
        if (user) {
          const result = await getTripJoinStatus(preview.tripId, controller.signal);
          if (["pending", "approved", "rejected"].includes(result.status)) {
            status = result.status as InviteAccessStatus;
            if (result.status === "approved" &&
                (result.permission === "editor" || result.permission === "viewer")) {
              preview.permission = result.permission;
            }
          }
        }
        if (!controller.signal.aborted) {
          setView({ identity, preview, status, error: "" });
          // 이전 공유 모달의 #invite 링크도 새 입장 경로로 정규화합니다.
          if (!tripId) navigate(`/trip-invite/${preview.tripId}#invite=${token}`, { replace: true });
        }
      } catch (reason) {
        if (!controller.signal.aborted) setView({ identity, status: "invalid",
          error: reason instanceof Error ? reason.message : "초대 링크를 확인하지 못했습니다." });
      }
    }
    void load();
    return () => controller.abort();
  }, [identity, loading, user, token, tripId, navigate, retryKey]);

  if (!current) return <main role="status">초대 정보를 확인하고 있습니다.</main>;
  const preview = current.preview;
  const checkStatus = async () => {
    if (!preview || !user) throw new Error("로그인 후 승인 상태를 확인해주세요.");
    const result = await getTripJoinStatus(preview.tripId);
    const next: InviteAccessStatus = result.status === "approved" ? "approved"
      : result.status === "pending" ? "pending"
      : result.status === "rejected" ? "rejected" : preview.status;
    setView({ ...current, status: next, error: "" });
    return next;
  };
  const requestAccess = async (input: InviteRequestInput) => {
    if (!preview || !user) throw new Error("로그인 후 승인 요청을 보내주세요.");
    const result = await acceptTripInvite(preview.tripId, token, input.password);
    setView({ ...current, status: result.status, error: "" });
  };
  return <TripInviteEntry
    tripName={preview?.tripName ?? "여행 초대"}
    permission={preview?.permission ?? "viewer"}
    status={current.status}
    isLoggedIn={Boolean(user)}
    errorMessage={current.error || authError}
    onRequestAccess={requestAccess}
    onLogin={() => {
      if (!preview) return;
      const returnTo = `/trip-invite/${preview.tripId}#invite=${token}`;
      rememberTripInvite(returnTo);
      navigate("/login", { state: { from: returnTo } });
    }}
    onCheckStatus={async () => { await checkStatus(); }}
    onEnterTrip={() => {
      void checkStatus().then((status) => {
        if (status !== "approved" || !preview) return;
        clearTripInviteReturn();
        navigate(`/trips/${preview.tripId}`, { replace: true });
      }).catch((reason: unknown) => setView({ ...current,
        error: reason instanceof Error ? reason.message : "승인 상태를 확인하지 못했습니다." }));
    }}
    onRetry={async () => {
      if (!preview) { setRetryKey((value) => value + 1); return; }
      const fresh = await previewTripInvite(token);
      setView({ identity, preview: fresh, status: fresh.status, error: "" });
    }}
    onBack={() => navigate("/")}
  />;
}
