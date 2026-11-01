import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Copy, Eye, Link, Mail, Pencil, Share2, Users, X } from "lucide-react";
import modalMascote from "../../../assets/go.webp";
import * as S from "./ShareModalStyle";

type Permission = "editor" | "viewer";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripName: string;
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
  const busyRef = useRef(false);
  const aliveRef = useRef(false);
  const openRef = useRef(isOpen);
  const abortRef = useRef<AbortController | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const descriptionId = useId();
  const urlFor = (token: string) => {
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.slice(1));
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

  const close = () => {
    openRef.current = false;
    abortRef.current?.abort();
    onClose();
  };
  const selectPermission = (next: Permission) => {
    if (busyRef.current || !openRef.current) return;
    setPermission(next);
    setCopied(false);
    setMessage("");
  };
  const ensureInvite = async (): Promise<string | null> => {
    if (busyRef.current || !openRef.current) return null;
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
  const shareEmail = async () => {
    const url = await ensureInvite();
    if (!url || !openRef.current) return;
    window.location.href = `mailto:?subject=${encodeURIComponent(`${tripName} 일정 공유`)}&body=${encodeURIComponent(url)}`;
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
        aria-busy={busy}
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
        <S.ShareBanner>
          <S.ShareBannerText>
            <h2>여행 공유하기</h2>
            <p>함께 여행을 계획해 보세요</p>
          </S.ShareBannerText>
          <S.ShareMascot aria-hidden="true">
            <img src={modalMascote} alt="" />
          </S.ShareMascot>
          <S.ShareCloseButton
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="닫기"
          >
            <X size={20} />
          </S.ShareCloseButton>
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
                disabled={busy}
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
                disabled={busy}
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
                disabled={busy}
                onClick={() => void copyShareLink()}
              >
                <Copy size={15} />
                {busy ? "생성 중…" : copied ? "복사 완료" : "링크 복사"}
              </S.CopyLinkButton>
            </S.ShareLinkBox>
            {/* <p id={descriptionId} role={message ? "alert" : "status"}>{message || "선택한 권한으로 초대 링크를 생성합니다. 로그인 후 초대를 수락하면 참여자로 등록돼요."}</p> */}
            {message && (
              <p id={descriptionId} role="alert">
                {message}
              </p>
            )}
          </S.ShareSection>
          <S.ShareSection>
            <S.ShareSectionTitle>
              <Share2 size={16} />
              <strong>다른 방법으로 공유</strong>
            </S.ShareSectionTitle>
            <S.SharePlatformList>
              <S.SharePlatformButton
                type="button"
                onClick={() => alert("네이버 공유는 추후 연결 예정입니다.")}
              >
                <S.SharePlatformIcon $platform="naver">N</S.SharePlatformIcon>
                네이버
              </S.SharePlatformButton>
              <S.SharePlatformButton
                type="button"
                onClick={() => alert("카카오톡 공유는 추후 연결 예정입니다.")}
              >
                <S.SharePlatformIcon $platform="kakao">
                  <S.KakaoBubble />
                </S.SharePlatformIcon>
                카카오톡
              </S.SharePlatformButton>
              <S.SharePlatformButton
                type="button"
                disabled={busy}
                onClick={() => void shareEmail()}
              >
                <S.SharePlatformIcon $platform="email">
                  <Mail size={25} />
                </S.SharePlatformIcon>
                이메일
              </S.SharePlatformButton>
            </S.SharePlatformList>
          </S.ShareSection>
        </S.ShareModalBody>
      </S.ShareModal>
    </S.ShareOverlay>,
    document.body,
  );
}
