import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import TripInviteEntry, {
  type InviteAccessStatus,
  type InviteRequestInput,
} from "../../components/trip-invite/TripInviteEntry";
import { useAuth } from "../../contexts/AuthContext";
import {
  acceptTripInvite,
  getTripJoinStatus,
  previewTripInvite,
  getGuestJoinStatus,
  requestGuestAccess,
  type TripInvitePreview,
} from "../../api/tripSharing";
import {
  clearTripInviteReturn,
  rememberTripInvite,
} from "../../utils/tripInviteReturn";
import Loader from "../../components/loader/Loader";

type View = {
  identity: string;
  preview?: TripInvitePreview;
  status: InviteAccessStatus;
  error: string;
};
function accessStatus(
  status: string,
  fallback: InviteAccessStatus,
): InviteAccessStatus {
  return status === "approved" || status === "pending" || status === "rejected"
    ? status
    : fallback;
}
export default function TripInvitePage() {
  const { tripId } = useParams<{ tripId: string }>();
  const location = useLocation(),
    navigate = useNavigate();
  const { user, error: authError } = useAuth();
  const token = new URLSearchParams(location.hash.slice(1)).get("invite") ?? "";
  const identity = `${tripId ?? ""}:${token}:${user?.id ?? "guest"}`;
  const activeIdentity = useRef(identity);
  useEffect(() => {
    activeIdentity.current = identity;
  }, [identity]);
  const [view, setView] = useState<View | null>(null);
  const [attempt, setAttempt] = useState(0);
  const current = view?.identity === identity ? view : null;
  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const preview = await previewTripInvite(token, controller.signal);
        if (tripId && tripId !== preview.tripId)
          throw new Error("초대받은 여행과 링크가 일치하지 않습니다.");
        let status: InviteAccessStatus = preview.status;
        if (preview.permission === "viewer") {
          const result = await getGuestJoinStatus(
            preview.tripId,
            controller.signal,
          );
          status = accessStatus(result.status, status);
        } else if (user) {
          const result = await getTripJoinStatus(
            preview.tripId,
            controller.signal,
          );
          status = accessStatus(result.status, status);
        }
        if (!controller.signal.aborted)
          setView({ identity, preview, status, error: "" });
      } catch (reason) {
        if (!controller.signal.aborted)
          setView({
            identity,
            status: "invalid",
            error:
              reason instanceof Error
                ? reason.message
                : "초대 정보를 확인하지 못했습니다.",
          });
      }
    })();
    return () => controller.abort();
  }, [identity, token, tripId, user, attempt]);
  const preview = current?.preview;
  const viewer = preview?.permission === "viewer";
  const checkStatus = async () => {
    if (!preview) throw new Error("초대 링크를 확인해주세요.");
    if (!viewer && !user)
      throw new Error("편집자로 참여하려면 로그인해주세요.");
    const result = viewer
      ? await getGuestJoinStatus(preview.tripId)
      : await getTripJoinStatus(preview.tripId);
    const next = accessStatus(result.status, preview.status);
    if (activeIdentity.current === identity)
      setView({ identity, preview, status: next, error: "" });
    return next;
  };
  const requestAccess = async (input: InviteRequestInput) => {
    if (!preview) throw new Error("초대 링크를 확인해주세요.");
    if (!viewer && !user)
      throw new Error("편집자로 참여하려면 로그인해주세요.");
    const result = viewer
      ? await requestGuestAccess(
          preview.tripId,
          token,
          input.displayName?.trim() ?? "",
        )
      : await acceptTripInvite(preview.tripId, token, input.password);
    if (activeIdentity.current === identity)
      setView({
        identity,
        preview,
        status: result.status === "approved" ? "approved" : "pending",
        error: "",
      });
  };
  if (!current) return <Loader />;
  return (
    <TripInviteEntry
      tripName={preview?.tripName ?? "여행 초대"}
      permission={preview?.permission ?? "viewer"}
      status={current.status}
      isLoggedIn={Boolean(user)}
      errorMessage={current.error || (!viewer ? authError : "")}
      onRequestAccess={requestAccess}
      onLogin={() => {
        if (!preview || viewer) return;
        const returnTo = `/trip-invite/${encodeURIComponent(preview.tripId)}#${new URLSearchParams({ invite: token })}`;
        rememberTripInvite(returnTo);
        navigate("/login", { state: { from: returnTo } });
      }}
      onCheckStatus={async () => {
        await checkStatus();
      }}
      onEnterTrip={() => {
        void checkStatus()
          .then((status) => {
            if (
              status !== "approved" ||
              !preview ||
              activeIdentity.current !== identity
            )
              return;
            clearTripInviteReturn();
            navigate(
              `/trips/${encodeURIComponent(preview.tripId)}${viewer ? "?access=viewer" : ""}`,
              { replace: true },
            );
          })
          .catch((reason: unknown) => {
            if (activeIdentity.current === identity)
              setView({
                ...current,
                error:
                  reason instanceof Error
                    ? reason.message
                    : "승인 상태를 확인하지 못했습니다.",
              });
          });
      }}
      onRetry={async () => {
        if (current.status === "rejected" && preview) {
          const fresh = await previewTripInvite(token);
          if (
            fresh.tripId !== preview.tripId ||
            fresh.permission !== preview.permission
          )
            throw new Error("초대 링크를 다시 확인해주세요.");
          if (activeIdentity.current === identity)
            setView({
              identity,
              preview: fresh,
              status: fresh.status,
              error: "",
            });
        } else setAttempt((value) => value + 1);
      }}
      onBack={() => navigate("/")}
    />
  );
}
