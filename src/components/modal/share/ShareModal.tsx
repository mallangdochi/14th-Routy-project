import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Clock3,
  Copy,
  Eye,
  Link,
  LockKeyhole,
  Pencil,
  RefreshCw,
  Users,
  X,
} from "lucide-react";
import modalMascote from "../../../assets/go.webp";
import * as S from "./ShareModalStyle";
import ShareOtherMethods from "../../share/ShareOtherMethods";

async function roomPasswordRequest(
  tripId: string,
  action: "password_ensure" | "password_refresh",
  signal?: AbortSignal,
) {
  const response = await fetch("/api/trips/share", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, tripId }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(data?.message ?? "방 비밀번호를 처리하지 못했습니다.");
  if (
    data?.tripId !== tripId ||
    (data.password !== null && typeof data.password !== "string")
  )
    throw new Error("방 비밀번호 응답을 확인하지 못했습니다.");
  return data.password as string | null;
}

type Permission = "editor" | "viewer";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripName: string;
  /** 소유자 인증을 거친 서버가 제공하는 편집자 전용 비밀번호. */
  roomPassword?: string | null;
  /** 서버에서 비밀번호를 교체하고 새 값을 반환하는 콜백. */
  onRefreshRoomPassword?: () => Promise<string>;
};

export default function ShareModal(props: Props) {
  return <ShareSession key={props.tripId} {...props} />;
}

function ShareSession({ isOpen, ...props }: Props) {
  const [permission, setPermission] = useState<Permission>("viewer");
  const [previousOpen, setPreviousOpen] = useState(isOpen);
  const [mounted, setMounted] = useState(isOpen);
  const [session, setSession] = useState(0);
  const exited = useCallback(() => setMounted(false), []);
  if (previousOpen !== isOpen) {
    setPreviousOpen(isOpen);
    if (isOpen) {
      setMounted(true);
      setSession((value) => value + 1);
    }
  }
  if (!mounted || typeof document === "undefined") return null;
  return (
    <ShareContent
      key={session}
      {...props}
      isOpen={isOpen}
      permission={permission}
      setPermission={setPermission}
      onExited={exited}
    />
  );
}

type Invite = { token: string; expiresAt: number };

function ShareContent({
  isOpen,
  onClose,
  tripId,
  tripName,
  roomPassword,
  onRefreshRoomPassword,
  permission,
  setPermission,
  onExited,
}: Props & {
  permission: Permission;
  setPermission: (permission: Permission) => void;
  onExited: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [links, setLinks] = useState<Partial<Record<Permission, Invite>>>({});
  const [refreshedPassword, setRefreshedPassword] = useState<string | null>(
    null,
  );
  const password = refreshedPassword ?? roomPassword ?? "";
  const editorPasswordRequired = permission === "editor" && !password.trim();
  const [passwordBusy, setPasswordBusy] = useState(permission === "editor");
  const passwordTaskRef = useRef(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const busyRef = useRef(false);
  const aliveRef = useRef(false);
  const openRef = useRef(isOpen);
  const abortRef = useRef<AbortController | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const descriptionId = useId();
  const urlFor = (token: string) => {
    const url = new URL(
      `/trip-invite/${encodeURIComponent(tripId)}`,
      window.location.origin,
    );
    const hash = new URLSearchParams();
    hash.set("invite", token);
    url.hash = hash.toString();
    return url.toString();
  };
  const invite = links[permission];
  const shareUrl = invite ? urlFor(invite.token) : "";

  useEffect(() => {
    aliveRef.current = true;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      aliveRef.current = false;
      abortRef.current?.abort();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  useEffect(() => {
    openRef.current = isOpen;
    if (isOpen) return;
    abortRef.current?.abort();
    const timer = window.setTimeout(onExited, 320);
    return () => window.clearTimeout(timer);
  }, [isOpen, onExited]);

  useEffect(() => {
    if (!isOpen || permission !== "editor") return;
    const controller = new AbortController();
    passwordTaskRef.current = true;
    void roomPasswordRequest(tripId, "password_ensure", controller.signal)
      .then((value) => {
        if (!value?.trim()) throw new Error("자동 생성된 비밀번호를 확인하지 못했습니다.");
        if (!controller.signal.aborted && aliveRef.current && openRef.current) {
          setRefreshedPassword(value);
          setPasswordCopied(false);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted && aliveRef.current && openRef.current)
          setMessage(error instanceof Error ? error.message : "비밀번호 생성에 실패했습니다.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          passwordTaskRef.current = false;
          if (aliveRef.current) setPasswordBusy(false);
        }
      });
    return () => {
      controller.abort();
      passwordTaskRef.current = false;
    };
  }, [isOpen, permission, tripId]);

  const close = () => {
    openRef.current = false;
    abortRef.current?.abort();
    onClose();
  };
  const selectPermission = (next: Permission) => {
    if (busyRef.current || passwordBusy || !openRef.current) return;
    if (next === permission) return;
    setPasswordBusy(next === "editor");
    setPermission(next);
    setCopied(false);
    setMessage("");
  };
  const ensureInvite = async (): Promise<string | null> => {
    if (busyRef.current || passwordBusy || passwordTaskRef.current || !openRef.current) return null;
    if (editorPasswordRequired) {
      setMessage(
        "방 전용 비밀번호를 준비한 후 다시 시도해주세요.",
      );
      return null;
    }
    const cached = links[permission];
    if (cached && cached.expiresAt > Date.now() + 1000)
      return urlFor(cached.token);
    busyRef.current = true;
    setBusy(true);
    setCopied(false);
    setMessage("");
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch("/api/trips/share", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", tripId, permission }),
        signal: controller.signal,
      });
      const value: unknown = await response.json().catch(() => null);
      const data =
        value && typeof value === "object"
          ? (value as Record<string, unknown>)
          : null;
      if (!response.ok)
        throw new Error(
          typeof data?.message === "string"
            ? data.message
            : "초대 링크를 생성하지 못했습니다.",
        );
      if (
        data?.tripId !== tripId ||
        data.permission !== permission ||
        typeof data.token !== "string" ||
        !/^[a-f0-9]{64}$/.test(data.token) ||
        typeof data.expiresAt !== "string" ||
        !Number.isFinite(Date.parse(data.expiresAt)) ||
        Date.parse(data.expiresAt) <= Date.now()
      ) {
        throw new Error("초대 링크 응답을 확인하지 못했습니다.");
      }
      if (controller.signal.aborted || !aliveRef.current || !openRef.current)
        return null;
      const saved = {
        token: data.token,
        expiresAt: Date.parse(data.expiresAt),
      };
      setLinks((previous) => ({ ...previous, [permission]: saved }));
      return urlFor(saved.token);
    } catch (reason) {
      if (!controller.signal.aborted && aliveRef.current && openRef.current) {
        setMessage(
          reason instanceof Error
            ? reason.message
            : "초대 링크를 생성하지 못했습니다.",
        );
      }
      return null;
    } finally {
      busyRef.current = false;
      if (aliveRef.current) setBusy(false);
    }
  };

  const copyShareLink = async () => {
    const url = await ensureInvite();
    if (!url || !openRef.current) return;
    try {
      await navigator.clipboard.writeText(url);
      if (aliveRef.current && openRef.current) {
        setCopied(true);
        setMessage("");
      }
    } catch {
      if (aliveRef.current && openRef.current) {
        setMessage(
          "자동 복사에 실패했습니다. 링크 입력란을 선택해 직접 복사해주세요.",
        );
      }
    }
  };
  // 비밀번호 생성/교체는 반드시 서버에서 이루어져야 하며, UI에서 임의로 만들지 않습니다.
  const refreshRoomPassword = async () => {
    if (passwordBusy || busyRef.current || !openRef.current) return;
    setPasswordBusy(true);
    setPasswordCopied(false);
    setMessage("");
    try {
      const newPassword = onRefreshRoomPassword
        ? await onRefreshRoomPassword()
        : await roomPasswordRequest(tripId, "password_refresh");
      if (!newPassword || !newPassword.trim()) {
        throw new Error("새 비밀번호를 확인하지 못했습니다.");
      }
      if (!aliveRef.current || !openRef.current) return;
      setRefreshedPassword(newPassword);
    } catch (error) {
      if (aliveRef.current && openRef.current) {
        setMessage(
          error instanceof Error
            ? error.message
            : "비밀번호를 변경하지 못했습니다.",
        );
      }
    } finally {
      if (aliveRef.current) setPasswordBusy(false);
    }
  };

  const copyRoomPassword = async () => {
    if (!password || !openRef.current) return;
    try {
      await navigator.clipboard.writeText(password);
      if (aliveRef.current && openRef.current) {
        setPasswordCopied(true);
        setMessage("");
      }
    } catch {
      if (aliveRef.current && openRef.current) {
        setMessage("비밀번호를 복사하지 못했습니다.");
      }
    }
  };

  return createPortal(
    <S.ShareOverlay
      data-open={isOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <S.ShareModal
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="여행 공유하기"
        aria-describedby={message ? descriptionId : undefined}
        aria-busy={busy || passwordBusy}
        data-open={isOpen}
        inert={!isOpen}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && !isOpen) onExited();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            close();
            return;
          }
          if (event.key !== "Tab") return;
          const nodes = Array.from(
            panelRef.current?.querySelectorAll<HTMLElement>(
              'button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]',
            ) ?? [],
          ).filter((node) => node.getClientRects().length > 0);
          const first = nodes[0],
            last = nodes[nodes.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <S.ShareCloseButton
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="닫기"
        >
          <X size={18} />
        </S.ShareCloseButton>
        <S.ShareBanner>
          <S.ShareBannerText>
            <h2>여행 공유하기</h2>
            <p>함께 여행을 계획해 보세요</p>
          </S.ShareBannerText>
          <S.ShareMascot aria-hidden="true">
            <img src={modalMascote} alt="" />
          </S.ShareMascot>
        </S.ShareBanner>
        <S.ShareModalBody>
          <S.ShareSection>
            <S.ShareSectionTitle>
              <Users size={16} />
              <strong>접근 권한</strong>
            </S.ShareSectionTitle>
            <S.PermissionList>
              <S.PermissionCard
                type="button"
                $active={permission === "editor"}
                aria-pressed={permission === "editor"}
                disabled={busy || passwordBusy}
                onClick={() => selectPermission("editor")}
              >
                <S.PermissionRadio $active={permission === "editor"} />
                <S.PermissionInfo>
                  <S.PermissionName>
                    <Pencil size={18} />
                    <strong>편집자</strong>
                  </S.PermissionName>
                  <span>일정 확인 및 수정 가능</span>
                </S.PermissionInfo>
              </S.PermissionCard>
              <S.PermissionCard
                type="button"
                $active={permission === "viewer"}
                aria-pressed={permission === "viewer"}
                disabled={busy || passwordBusy}
                onClick={() => selectPermission("viewer")}
              >
                <S.PermissionRadio $active={permission === "viewer"} />
                <S.PermissionInfo>
                  <S.PermissionName>
                    <Eye size={18} />
                    <strong>보기 전용</strong>
                  </S.PermissionName>
                  <span>일정 확인만 가능</span>
                </S.PermissionInfo>
              </S.PermissionCard>
            </S.PermissionList>
          </S.ShareSection>
          {permission === "editor" && (
            <S.ShareSection>
              <S.RoomSecurityCard>
                <S.ShareSectionTitle>
                  <LockKeyhole size={16} />
                  <strong>방 전용 비밀번호</strong>
                </S.ShareSectionTitle>
                <S.RoomPasswordGroup>
                  <S.RoomPasswordText
                    value={password}
                    placeholder={passwordBusy ? "비밀번호를 준비하고 있어요…" : "새로고침 버튼으로 다시 시도해주세요"}
                    readOnly
                    aria-label="방 전용 비밀번호"
                    onFocus={(event) => event.currentTarget.select()}
                  />
                  <S.RoomPasswordRefreshButton
                    type="button"
                    title={
                      password
                        ? "방 전용 비밀번호 변경"
                        : "방 전용 비밀번호 설정"
                    }
                    aria-label={
                      password
                        ? "방 전용 비밀번호 변경"
                        : "방 전용 비밀번호 설정"
                    }
                    disabled={passwordBusy || busy}
                    onClick={() => void refreshRoomPassword()}
                  >
                    <RefreshCw size={16} />
                  </S.RoomPasswordRefreshButton>
                  <S.RoomPasswordCopyButton
                    type="button"
                    disabled={!password || passwordBusy}
                    onClick={() => void copyRoomPassword()}
                  >
                    <Copy size={14} />
                    {passwordCopied ? "복사 완료" : "복사"}
                  </S.RoomPasswordCopyButton>
                </S.RoomPasswordGroup>
                <S.RoomPasswordHelp>
                  비밀번호는 방장만 조회할 수 있어요. 편집자에게 별도로 전달해
                  주세요. 비밀번호를 입력해도 방장 승인 전에는 입장할 수 없어요.
                </S.RoomPasswordHelp>
              </S.RoomSecurityCard>
            </S.ShareSection>
          )}
          <S.ShareSection>
            <S.ShareSectionTitle>
              <Link size={16} />
              <strong>공유 링크</strong>
            </S.ShareSectionTitle>
            <S.ShareLinkBox>
              <S.ShareLinkText
                value={shareUrl}
                placeholder="링크 복사를 눌러 초대 링크를 생성하세요"
                readOnly
                onFocus={(event) => event.currentTarget.select()}
                aria-label="여행 링크"
              />
              <S.CopyLinkButton
                type="button"
                disabled={busy || passwordBusy || editorPasswordRequired}
                onClick={() => void copyShareLink()}
              >
                <Copy size={15} />
                {busy ? "생성 중…" : copied ? "복사 완료" : "링크 복사"}
              </S.CopyLinkButton>
            </S.ShareLinkBox>
            <S.ShareExpiryNote>
              <Clock3 size={12} />
              초대 링크는 발급 후 72시간 동안 유효해요.
            </S.ShareExpiryNote>
            {message && (
              <p id={descriptionId} role="alert">
                {message}
              </p>
            )}
          </S.ShareSection>

          <ShareOtherMethods
            tripName={tripName}
            shareText={`[Routy] ${tripName} 여행에 초대합니다.\n${
              permission === "editor"
                ? "편집자 초대: 링크 접속 후 로그인하고, 별도로 전달받은 방 비밀번호를 입력해 방장에게 승인을 요청해주세요."
                : "보기 전용 초대: 링크에 접속해 방장에게 승인을 요청해주세요. 비밀번호는 필요하지 않아요."
            }\n방장 승인 후 여행에 참여할 수 있어요.`}
            busy={busy || passwordBusy || editorPasswordRequired}
            ensureInvite={ensureInvite}
            openRef={openRef}
            setMessage={setMessage}
          />
        </S.ShareModalBody>
      </S.ShareModal>
    </S.ShareOverlay>,
    document.body,
  );
}
