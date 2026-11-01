import { useRef, useState, type ReactNode } from "react";
import { acceptTripInvite } from "../../../api/tripSharing";
import { useAuth } from "../../../contexts/AuthContext";
import * as S from "./tripInviteGateStyle";

type Props = {
  tripId?: string;
  children: ReactNode;
};

export default function TripInviteGate({ tripId, children }: Props) {
  const { user } = useAuth();

  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;

    return new URLSearchParams(window.location.hash.slice(1)).get("invite");
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const savingRef = useRef(false);

  const accept = async () => {
    if (!user || !tripId || !token || savingRef.current) return;

    savingRef.current = true;
    setBusy(true);
    setError("");

    try {
      await acceptTripInvite(tripId, token);

      const hash = new URLSearchParams(window.location.hash.slice(1));

      hash.delete("invite");

      const nextHash = hash.toString();

      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}${
          nextHash ? `#${nextHash}` : ""
        }`,
      );

      setToken(null);
    } catch (reason: unknown) {
      setError(
        reason instanceof Error
          ? reason.message
          : "초대를 수락하지 못했습니다.",
      );
    } finally {
      savingRef.current = false;
      setBusy(false);
    }
  };

  if (!token) return <>{children}</>;

  return (
    <S.Page>
      <S.Card aria-labelledby="trip-invite-title" aria-busy={busy}>
        <S.Title id="trip-invite-title">여행 초대</S.Title>

        <S.Description>
          초대를 수락하면 이 여행의 참여자로 등록됩니다.
        </S.Description>

        {!user && (
          <S.Description role="status">
            로그인이 필요합니다. 로그인한 뒤 이 초대 링크를 다시 열어주세요.
          </S.Description>
        )}

        {error && <S.ErrorMessage role="alert">{error}</S.ErrorMessage>}

        <S.AcceptButton
          type="button"
          disabled={!user || busy || !tripId}
          onClick={() => void accept()}
        >
          {busy ? "수락 중…" : "초대 수락"}
        </S.AcceptButton>
      </S.Card>
    </S.Page>
  );
}
