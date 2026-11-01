import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { UserRound, X } from "lucide-react";
import * as S from "./TripParticipantsStyle";

export type TripParticipant = {
  userId: string;
  nickname: string;
  avatarUrl?: string | null;
  permission: "owner" | "editor" | "viewer";
  participating: boolean;
};
export type TripParticipantsSource = (
  tripId: string,
  signal: AbortSignal,
) => Promise<{ tripId: string; participants: TripParticipant[] }>;
// 기본 조회를 컴포넌트에 연결합니다. 기존 loadParticipants prop도 계속 지원합니다.
const loadDefaultParticipants: TripParticipantsSource = async (
  tripId,
  signal,
) => {
  const query = new URLSearchParams({ operation: "participants", tripId });
  const response = await fetch(`/api/trips/share?${query}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    signal,
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "참여자를 불러오지 못했습니다.";
    throw new Error(message);
  }
  if (
    !data ||
    typeof data !== "object" ||
    !("tripId" in data) ||
    data.tripId !== tripId ||
    !("participants" in data) ||
    !Array.isArray(data.participants)
  ) {
    throw new Error("참여자 응답을 확인하지 못했습니다.");
  }
  return { tripId, participants: data.participants };
};
type Props = {
  tripId: string;
  totalPeople: number;
  currentUserId?: string;
  loadParticipants?: TripParticipantsSource;
  resolveAvatar?: (value: string | null | undefined) => string | undefined;
};
function Avatar({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <S.Avatar>
      {src && !failed ? (
        <img src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        <UserRound size={24} aria-hidden="true" />
      )}
    </S.Avatar>
  );
}
export default function TripParticipants(props: Props) {
  // Reset state, requests and animations when switching trips.
  return <ParticipantsContent key={props.tripId} {...props} />;
}
function ParticipantsContent({
  tripId,
  totalPeople,
  currentUserId,
  loadParticipants = loadDefaultParticipants,
  resolveAvatar,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState<{
    source: TripParticipantsSource;
    participants: TripParticipant[];
    error: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const summaryId = useId();
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const source = loadParticipants;
    const controller = new AbortController();
    void source(tripId, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        if (
          !data ||
          data.tripId !== tripId ||
          !Array.isArray(data.participants)
        ) {
          throw new Error("참여자 응답을 확인하지 못했습니다.");
        }
        const unique = new Map<string, TripParticipant>();
        for (const member of data.participants) {
          if (
            !member ||
            typeof member.userId !== "string" ||
            !member.userId ||
            typeof member.nickname !== "string" ||
            typeof member.participating !== "boolean" ||
            !["owner", "editor", "viewer"].includes(member.permission)
          ) {
            throw new Error("참여자 응답 형식을 확인해주세요.");
          }
          unique.set(member.userId, member);
        }
        setResult({ source, participants: [...unique.values()], error: "" });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setResult({
            source,
            participants: [],
            error:
              error instanceof Error
                ? error.message
                : "참여자를 불러오지 못했습니다.",
          });
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [tripId, loadParticipants, refresh]);

  useEffect(() => {
    if (!mounted || open) return;
    const timer = window.setTimeout(() => setMounted(false), 320);
    return () => window.clearTimeout(timer);
  }, [mounted, open]);

  useLayoutEffect(() => {
    if (!mounted) return;
    const place = () => {
      if (window.matchMedia("(max-width: 767px)").matches) return;
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(360, window.innerWidth - 24);
      const availableBelow = window.innerHeight - rect.bottom - 20;
      const above = availableBelow < 240 && rect.top > availableBelow;
      const maxHeight = Math.max(100, above ? rect.top - 20 : availableBelow);
      const height = Math.min(panelRef.current?.offsetHeight ?? 400, maxHeight);
      const panel = panelRef.current;
      if (!panel) return;
      panel.style.setProperty(
        "--trip-popup-left",
        `${Math.max(12, Math.min(rect.left, window.innerWidth - width - 12))}px`,
      );
      panel.style.setProperty(
        "--trip-popup-top",
        `${above ? Math.max(12, rect.top - height - 8) : rect.bottom + 8}px`,
      );
      panel.style.setProperty("--trip-popup-height", `${maxHeight}px`);
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [mounted, result, loading]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !panelRef.current?.contains(event.target) &&
        !triggerRef.current?.contains(event.target)
      )
        close();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key !== "Tab") return;
      const nodes = [
        ...(panelRef.current?.querySelectorAll<HTMLButtonElement>(
          "button:not(:disabled)",
        ) ?? []),
      ].filter((node) => node.getClientRects().length);
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const media = window.matchMedia("(max-width: 767px)");
    const previous = document.body.style.overflow;
    const lock = () => {
      document.body.style.overflow = media.matches ? "hidden" : previous;
    };
    lock();
    media.addEventListener("change", lock);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = previous;
      media.removeEventListener("change", lock);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyboard);
    };
  }, [open, close]);

  const current = result?.source === loadParticipants ? result : null;
  const ready = Boolean(current && !current.error);
  const participants = ready
    ? current!.participants.filter((member) => member.participating)
    : [];
  const editingCount = participants.filter(
    (member) => member.permission !== "viewer",
  ).length;
  const absent = Math.max(0, totalPeople - editingCount);
  const avatar = (member: TripParticipant) =>
    resolveAvatar
      ? resolveAvatar(member.avatarUrl)
      : member.avatarUrl || undefined;
  const busy = !current || loading;
  const error = current?.error;
  const show = () => {
    if (open) {
      close();
      return;
    }
    setMounted(true);
    setOpen(true);
    setLoading(true);
    setRefresh((value) => value + 1);
  };
  return (
    <>
      <S.Trigger
        ref={triggerRef}
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="여행 참여자 목록 보기"
      >
        {ready ? (
          <>
            <span className="avatars">
              {participants.map((member) => (
                <Avatar
                  key={`${member.userId}:${avatar(member)}`}
                  src={avatar(member)}
                />
              ))}
            </span>
            {absent > 0 && <span className="remaining">외 {absent}명</span>}
            {participants.length === 0 && absent === 0 && (
              <span>참여자 보기</span>
            )}
          </>
        ) : (
          <span className="unavailable">
            참여자 {busy ? "확인 중…" : "보기"}
          </span>
        )}
      </S.Trigger>
      {mounted &&
        createPortal(
          <S.Layer data-open={open}>
            <S.Panel
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={summaryId}
              aria-busy={busy}
              data-open={open}
              inert={!open}
              onAnimationEnd={(event) => {
                if (event.target === event.currentTarget && !open)
                  setMounted(false);
              }}
            >
              <div className="handle" aria-hidden="true" />
              <header>
                <h2 id={titleId}>여행 참여자</h2>
                <button
                  ref={closeRef}
                  className="close"
                  type="button"
                  onClick={close}
                  aria-label="참여자 목록 닫기"
                >
                  <X size={22} />
                </button>
              </header>
              <p className="summary" id={summaryId}>
                편집 가능 최대 {totalPeople}명
                {ready
                  ? ` · 현재 ${editingCount}명 · 전체 멤버 ${participants.length}명`
                  : ""}
              </p>
              <div className="list">
                {error ? (
                  <>
                    <p className="status" role="alert">
                      {error}
                    </p>
                    {
                      <button
                        className="retry"
                        type="button"
                        onClick={() => {
                          setLoading(true);
                          setRefresh((value) => value + 1);
                        }}
                      >
                        다시 불러오기
                      </button>
                    }
                  </>
                ) : !ready ? (
                  <p className="status" role="status">
                    참여자를 불러오고 있어요.
                  </p>
                ) : (
                  <>
                    {participants.map((member) => (
                      <div className="row" key={member.userId}>
                        <Avatar key={avatar(member)} src={avatar(member)} />
                        <span className="name">
                          {member.nickname || "참여자"}
                          {member.userId === currentUserId && (
                            <span className="me">나</span>
                          )}
                        </span>
                        <span className="badge" data-role={member.permission}>
                          {member.permission === "owner"
                            ? "여행 소유자"
                            : member.permission === "viewer"
                              ? "보기 전용"
                              : "편집 가능"}
                        </span>
                      </div>
                    ))}
                    {absent > 0 && (
                      <div
                        className="anonymous"
                        role="group"
                        aria-label={`미참여 인원 ${absent}명`}
                      >
                        {Array.from({ length: absent }, (_, index) => (
                          <div
                            className="row"
                            key={index}
                            aria-label="미참여 인원"
                          >
                            <Avatar />
                            <span className="badge" data-role="absent">
                              미참여
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {editingCount > totalPeople && (
                      <p className="status">
                        편집 참여자가 설정된 최대 인원보다 많습니다. 편집 가능
                        인원을 확인해주세요.
                      </p>
                    )}
                  </>
                )}
              </div>
              <button className="confirm" type="button" onClick={close}>
                확인
              </button>
            </S.Panel>
          </S.Layer>,
          document.body,
        )}
    </>
  );
}
