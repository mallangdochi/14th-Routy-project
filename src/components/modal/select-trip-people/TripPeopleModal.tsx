import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  CircleAlert,
  LogOut,
  Minus,
  Pencil,
  Plus,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import * as S from "./TripPeopleModalStyle";

export type MemberPermission = "owner" | "editor" | "viewer";
export type TripMember = {
  id: string;
  name: string;
  avatarUrl?: string;
  permission: MemberPermission;
};
export type TripMemberChanges = {
  removedUserIds?: string[];
  editorLimit: number;
  permissions: { userId: string; permission: "editor" | "viewer" }[];
};
export type TripPeopleModalProps = {
  open: boolean;
  /** 소유자를 포함한 편집 가능 최대 인원 */
  value: number;
  tripName?: string;
  min?: number;
  max?: number;
  members?: TripMember[];
  currentUserId?: string;
  currentPermission?: MemberPermission;
  loading?: boolean;
  loadError?: string;
  onRetry?: () => void;
  onClose: () => void;
  /** 기존 인원 저장 연결 유지. 권한도 저장할 때는 onSaveMembers를 사용합니다. */
  onConfirm: (people: number) => void | boolean | Promise<void | boolean>;
  onSaveMembers?: (
    changes: TripMemberChanges,
  ) => void | boolean | Promise<void | boolean>;
  onLeave?: () => void | boolean | Promise<void | boolean>;
};
const labels = {
  owner: "여행 소유자",
  editor: "편집 가능",
  viewer: "보기 전용",
};
export default function TripPeopleModal(props: TripPeopleModalProps) {
  const [wasOpen, setWasOpen] = useState(props.open);
  const [mounted, setMounted] = useState(props.open);
  const [session, setSession] = useState(0);
  if (wasOpen !== props.open) {
    setWasOpen(props.open);
    if (props.open) {
      setMounted(true);
      setSession((n) => n + 1);
    }
  }
  if (!mounted || typeof document === "undefined") return null;
  return (
    <Content key={session} {...props} onExited={() => setMounted(false)} />
  );
}
function Content({
  open,
  value,
  min = 1,
  max,
  members,
  currentUserId,
  currentPermission,
  loading = false,
  loadError,
  onRetry,
  onClose,
  onConfirm,
  onSaveMembers,
  onLeave,
  onExited,
}: TripPeopleModalProps & { onExited: () => void }) {
  const [draft, setDraft] = useState<TripMember[]>(
    () => members?.map((m) => ({ ...m })) ?? [],
  );
  const [removed, setRemoved] = useState<string[]>([]);
  // 새 참여자는 조회 결과에 반영하고 기존 권한 편집값은 유지합니다.
  const source = (members ?? []).filter((m) => !removed.includes(m.id));
  const rows = source.map((m) => ({
    ...m,
    permission: draft.find((d) => d.id === m.id)?.permission ?? m.permission,
  }));
  const permission =
    currentPermission ?? source.find((m) => m.id === currentUserId)?.permission;
  const owner = permission === "owner";
  const editors = rows.filter((m) => m.permission !== "viewer").length;
  const minimum = Math.max(
    1,
    Number.isFinite(min) ? Math.floor(min) : 1,
    editors,
  );
  const maximum =
    max !== undefined && Number.isFinite(max)
      ? Math.max(minimum, Math.floor(max))
      : Number.MAX_SAFE_INTEGER;
  const [limit, setLimit] = useState(() =>
    Math.max(1, Number.isFinite(value) ? Math.floor(value) : 1),
  );
  const editorLimit = Math.min(maximum, Math.max(minimum, limit));
  const [editingLimit, setEditingLimit] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const roleTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [confirmation, setConfirmation] = useState<TripMember | "leave" | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const busyRef = useRef(false);
  const alive = useRef(false);
  const panel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const confirmCancel = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const statusId = useId();
  const confirmId = useId();
  const close = () => {
    if (!busyRef.current) onClose();
  };
  useEffect(() => {
    alive.current = true;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current
      ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
      ?.focus({ preventScroll: true });
    return () => {
      alive.current = false;
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(onExited, 320);
    return () => window.clearTimeout(timer);
  }, [open, onExited]);
  useEffect(() => {
    if (confirmation) confirmCancel.current?.focus({ preventScroll: true });
    else if (returnFocus.current?.isConnected)
      returnFocus.current.focus({ preventScroll: true });
  }, [confirmation]);
  useEffect(() => {
    if (!menuId) return;
    const menu = menuRef.current;
    const trigger = roleTriggerRef.current;
    menu?.showPopover();
    const dismiss = () => setMenuId(null);
    window.addEventListener("resize", dismiss);
    return () => {
      menu?.hidePopover();
      window.removeEventListener("resize", dismiss);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [menuId]);
  useEffect(() => {
    if (!menuId) return;
    const outside = (e: PointerEvent) => {
      if (
        e.target instanceof Element &&
        !e.target.closest("[data-permission-control]")
      )
        setMenuId(null);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [menuId]);
  async function run(
    action: () => void | boolean | Promise<void | boolean>,
    success: () => void,
  ) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await action();
      if (!alive.current) return;
      if (result === false) setError("처리하지 못했어요. 다시 시도해주세요.");
      else success();
    } catch (reason) {
      if (alive.current)
        setError(
          reason instanceof Error
            ? reason.message
            : "처리 중 오류가 발생했어요.",
        );
    } finally {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }
  }
  function save() {
    if (!owner || loading) return;
    const changes = rows
      .filter(
        (m) =>
          m.permission !== "owner" &&
          m.permission !== source.find((s) => s.id === m.id)?.permission,
      )
      .map((m) => ({
        userId: m.id,
        permission: m.permission as "editor" | "viewer",
      }));
    if (onSaveMembers)
      void run(
        () =>
          onSaveMembers({
            editorLimit,
            permissions: changes,
            removedUserIds: removed,
          }),
        onClose,
      );
    else if (changes.length || removed.length)
      setError("권한 저장 함수를 연결해주세요.");
    else void run(() => onConfirm(editorLimit), onClose);
  }
  function selectRole(member: TripMember, next: "editor" | "viewer") {
    if (busy || !owner || !onSaveMembers) return;
    if (
      next === "editor" &&
      member.permission !== "editor" &&
      editors >= editorLimit
    ) {
      setError(
        "편집 가능 인원이 가득 찼어요. 연필 버튼에서 인원을 늘려주세요.",
      );
      return;
    }
    setDraft((previous) => [
      ...previous.filter((m) => m.id !== member.id),
      { ...member, permission: next },
    ]);
    setMenuId(null);
    setError("");
  }
  function ask(target: TripMember | "leave", button: HTMLButtonElement) {
    returnFocus.current = button;
    setMenuId(null);
    setError("");
    setConfirmation(target);
  }
  function confirmAction() {
    if (!confirmation) return;
    if (confirmation === "leave") {
      if (onLeave) void run(onLeave, onClose);
    } else {
      if (!owner || !onSaveMembers || confirmation.permission === "owner")
        return;
      const target = confirmation;
      setRemoved((ids) =>
        ids.includes(target.id) ? ids : [...ids, target.id],
      );
      setConfirmation(null);
    }
  }
  return createPortal(
    <S.Overlay
      data-open={open}
      onClick={(e) => {
        if (e.target === e.currentTarget && !confirmation) close();
      }}
    >
      <S.Panel
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={confirmation ? confirmId : titleId}
        aria-describedby={confirmation ? undefined : descriptionId}
        aria-busy={busy}
        data-open={open}
        inert={!open}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget && !open) onExited();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            if (busyRef.current) return;
            if (menuId) {
              setMenuId(null);
              panel.current
                ?.querySelector<HTMLButtonElement>(
                  `[data-role-trigger="true"]:focus`,
                )
                ?.focus();
            } else if (confirmation) setConfirmation(null);
            else close();
          }
          if (e.key !== "Tab") return;
          const controls = Array.from(
            panel.current?.querySelectorAll<HTMLElement>(
              'button:not(:disabled), input:not(:disabled), [tabindex="0"]',
            ) ?? [],
          ).filter(
            (node) =>
              node.getClientRects().length > 0 && !node.closest("[inert]"),
          );
          const first = controls[0],
            last = controls[controls.length - 1];
          if (!first) {
            e.preventDefault();
            return;
          }
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }}
      >
        <S.Handle aria-hidden="true" />
        {confirmation ? (
          <S.Confirm>
            <h2 id={confirmId}>
              <TriangleAlert size={26} />
              {confirmation === "leave"
                ? "여행에서 탈퇴할까요?"
                : "참여자를 내보낼까요?"}
            </h2>
            {confirmation !== "leave" && <strong>{confirmation.name}</strong>}
            <p>
              {confirmation === "leave"
                ? "탈퇴하면 이 여행에 접근할 수 없어요."
                : "저장하기를 누르면 이 참여자의 접근 권한이 해제돼요."}
              <br />
              초대 링크로 다시 참여할 수 있어요.
            </p>
            {error && <S.Status role="alert">{error}</S.Status>}
            <S.Footer>
              <S.CancelButton
                ref={confirmCancel}
                disabled={busy}
                onClick={() => setConfirmation(null)}
              >
                취소
              </S.CancelButton>
              <S.DangerButton disabled={busy} onClick={confirmAction}>
                {busy
                  ? "처리 중…"
                  : confirmation === "leave"
                    ? "탈퇴하기"
                    : "내보내기"}
              </S.DangerButton>
            </S.Footer>
          </S.Confirm>
        ) : (
          <>
            <S.Header>
              <Users size={27} aria-hidden="true" />
              <h2 id={titleId}>여행 멤버 수정</h2>
              <S.CloseButton
                type="button"
                aria-label="여행 멤버 수정 닫기"
                disabled={busy}
                onClick={close}
              >
                <X size={23} />
              </S.CloseButton>
            </S.Header>
            <S.Description id={descriptionId}>
              {owner
                ? "여행 멤버의 권한을 관리해요."
                : "내 참여 정보와 권한을 확인해요."}
            </S.Description>
            {owner && (
              <S.Tools>
                <S.SectionHeading>
                  <strong>여행 멤버</strong>
                  <S.Capacity>
                    <span aria-live="polite">
                      편집 가능 {editors} / {editorLimit}명
                    </span>
                    <S.IconButton
                      type="button"
                      aria-label="편집 가능 인원 수정"
                      aria-expanded={editingLimit}
                      disabled={busy || loading}
                      onClick={() => {
                        setEditingLimit((v) => !v);
                        setMenuId(null);
                      }}
                    >
                      <Pencil size={17} />
                    </S.IconButton>
                  </S.Capacity>
                </S.SectionHeading>
                {editingLimit && (
                  <>
                    <S.Counter>
                      <span>편집 가능 인원</span>
                      <S.StepButton
                        aria-label="편집 가능 인원 줄이기"
                        disabled={busy || editorLimit <= minimum}
                        onClick={() => setLimit(editorLimit - 1)}
                      >
                        <Minus size={16} />
                      </S.StepButton>
                      <strong>{editorLimit}명</strong>
                      <S.StepButton
                        aria-label="편집 가능 인원 늘리기"
                        disabled={busy || editorLimit >= maximum}
                        onClick={() => setLimit(editorLimit + 1)}
                      >
                        <Plus size={16} />
                      </S.StepButton>
                    </S.Counter>
                    <S.Small>현재 {editors}명 · 소유자 포함</S.Small>
                  </>
                )}
              </S.Tools>
            )}
            {!owner && (
              <S.SectionHeading>
                <strong>내 참여 정보</strong>
              </S.SectionHeading>
            )}
            {owner && (
              <S.Columns>
                <span>이름</span>
                <span>권한</span>
                <span />
              </S.Columns>
            )}
            <S.MemberList
              ref={list}
              tabIndex={owner ? 0 : undefined}
              aria-label={owner ? "여행 참여자 목록" : "내 참여 정보"}
              onScroll={() => setMenuId(null)}
            >
              {loadError ? (
                <S.Empty role="alert">
                  {loadError}
                  {onRetry && (
                    <button type="button" onClick={onRetry}>
                      다시 불러오기
                    </button>
                  )}
                </S.Empty>
              ) : loading ? (
                <S.Empty role="status">참여자를 불러오고 있어요.</S.Empty>
              ) : members === undefined ? (
                <S.Empty>참여자 데이터를 연결해주세요.</S.Empty>
              ) : (owner ? rows : rows.filter((m) => m.id === currentUserId))
                  .length === 0 ? (
                <S.Empty>참여자 정보가 없어요.</S.Empty>
              ) : (
                (owner ? rows : rows.filter((m) => m.id === currentUserId)).map(
                  (member) => (
                    <S.MemberRow key={member.id}>
                      <S.Identity>
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <S.Avatar aria-hidden="true">
                            {member.name.slice(0, 1)}
                          </S.Avatar>
                        )}
                        <span title={member.name}>
                          {member.id === currentUserId ? "나" : member.name}
                        </span>
                      </S.Identity>
                      <S.RoleControl data-permission-control>
                        {owner && member.permission !== "owner" ? (
                          <S.TagButton
                            data-role-trigger="true"
                            $role={member.permission}
                            type="button"
                            disabled={busy || !onSaveMembers}
                            aria-expanded={menuId === member.id}
                            aria-haspopup="menu"
                            aria-label={`${member.name} 권한: ${labels[member.permission]}`}
                            onClick={(e) => {
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              roleTriggerRef.current = e.currentTarget;
                              const bounds =
                                panel.current?.getBoundingClientRect();
                              const bottom =
                                panel.current
                                  ?.querySelector("[data-member-footer]")
                                  ?.getBoundingClientRect().top ??
                                window.innerHeight - 12;
                              const height = 132;
                              const top =
                                rect.bottom + height + 4 < bottom
                                  ? rect.bottom + 4
                                  : Math.max(
                                      (bounds?.top ?? 0) + 12,
                                      rect.top - height - 4,
                                    );
                              setMenuPosition({
                                top,
                                left: Math.max(
                                  12,
                                  Math.min(rect.left, window.innerWidth - 166),
                                ),
                              });
                              setMenuId((id) =>
                                id === member.id ? null : member.id,
                              );
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "ArrowDown") {
                                e.preventDefault();
                                const trigger = e.currentTarget;
                                trigger.click();
                                requestAnimationFrame(() =>
                                  trigger.parentElement
                                    ?.querySelector<HTMLButtonElement>(
                                      '[role="menuitemradio"]',
                                    )
                                    ?.focus(),
                                );
                              }
                            }}
                          >
                            <S.Tag $role={member.permission}>
                              {labels[member.permission]}
                            </S.Tag>
                          </S.TagButton>
                        ) : (
                          <S.Tag $role={member.permission}>
                            {labels[member.permission]}
                          </S.Tag>
                        )}
                        {menuId === member.id && (
                          <S.RoleMenu
                            role="menu"
                            aria-label={`${member.name} 권한 선택`}
                            ref={menuRef}
                            popover="manual"
                            style={menuPosition}
                            onKeyDown={(e) => {
                              const options = Array.from(
                                e.currentTarget.querySelectorAll<HTMLButtonElement>(
                                  "button",
                                ),
                              );
                              const index = options.indexOf(
                                document.activeElement as HTMLButtonElement,
                              );
                              if (
                                e.key === "ArrowDown" ||
                                e.key === "ArrowUp"
                              ) {
                                e.preventDefault();
                                options[
                                  (index +
                                    (e.key === "ArrowDown" ? 1 : -1) +
                                    options.length) %
                                    options.length
                                ]?.focus();
                              }
                            }}
                          >
                            <S.MenuCaption>권한 선택</S.MenuCaption>
                            {(["editor", "viewer"] as const).map((role) => (
                              <S.RoleOption
                                key={role}
                                role="menuitemradio"
                                aria-checked={member.permission === role}
                                disabled={busy}
                                onClick={() => selectRole(member, role)}
                              >
                                <S.Tag $role={role}>{labels[role]}</S.Tag>
                                {member.permission === role && (
                                  <Check size={17} />
                                )}
                              </S.RoleOption>
                            ))}
                          </S.RoleMenu>
                        )}
                      </S.RoleControl>
                      {owner && member.permission !== "owner" ? (
                        <S.Remove
                          type="button"
                          disabled={busy || !onSaveMembers}
                          onClick={(e) => ask(member, e.currentTarget)}
                        >
                          내보내기
                        </S.Remove>
                      ) : owner ? (
                        <S.Dash>−</S.Dash>
                      ) : null}
                    </S.MemberRow>
                  ),
                )
              )}
            </S.MemberList>
            <S.Bottom data-member-footer>
              {error && (
                <S.Status id={statusId} role="alert">
                  {error}
                </S.Status>
              )}
              {owner ? (
                <>
                  <S.Note>
                    <CircleAlert size={18} />
                    <span>인원·권한·내보내기는 저장 후 적용돼요.</span>
                  </S.Note>
                  <S.Footer>
                    <S.CancelButton
                      type="button"
                      disabled={busy}
                      onClick={close}
                    >
                      취소
                    </S.CancelButton>
                    <S.SaveButton
                      type="button"
                      disabled={busy || loading || members === undefined}
                      onClick={save}
                    >
                      {busy ? "저장 중…" : "저장하기"}
                    </S.SaveButton>
                  </S.Footer>
                </>
              ) : (
                <>
                  {permission === "editor" && (
                    <>
                      <S.LeaveButton
                        disabled={busy || !onLeave}
                        onClick={(e) => ask("leave", e.currentTarget)}
                      >
                        <LogOut size={20} />이 여행에서 탈퇴하기
                      </S.LeaveButton>
                      <S.Small>탈퇴하면 이 여행에 접근할 수 없어요.</S.Small>
                    </>
                  )}
                  <S.Footer>
                    <S.CancelButton disabled={busy} onClick={close}>
                      닫기
                    </S.CancelButton>
                  </S.Footer>
                </>
              )}
            </S.Bottom>
          </>
        )}
      </S.Panel>
    </S.Overlay>,
    document.body,
  );
}
