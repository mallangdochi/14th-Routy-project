import { useEffect, useId, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ClipboardCheck,
  Luggage,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { createEmptyChecklist, type ChecklistGroup, type ChecklistItem } from "../../api/tripChecklist";
import { ChecklistStyle } from "./ChecklistStyle";
import ChecklistModal, {
  type ChecklistEditor,
} from "../../components/modal/addItem/ChecklistModal";

type Props = {
  initialGroups?: ChecklistGroup[];
  groups?: ChecklistGroup[];
  onChange?: (groups: ChecklistGroup[]) => void | Promise<void>;
  canEdit?: boolean;
  onEditComplete?: () => void;
};
export default function Checklist({
  initialGroups = createEmptyChecklist(),
  groups: controlledGroups,
  onChange,
  canEdit = true,
  onEditComplete,
}: Props) {
  const [localGroups, setLocalGroups] = useState<ChecklistGroup[]>(() =>
    initialGroups.map((group) => ({
      ...group,
      items: group.items.map((item) => ({ ...item })),
    })),
  );
  const groups = controlledGroups ?? localGroups;
  const [working, setWorking] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const mutationLock = useRef(false);
  const setGroups = async (
    updater: (current: ChecklistGroup[]) => ChecklistGroup[],
  ) => {
    if (!canEdit) throw new Error("체크리스트를 수정할 권한이 없습니다.");
    if (mutationLock.current) throw new Error("이전 변경사항을 저장하고 있습니다.");
    mutationLock.current = true;
    setWorking(true);
    setMutationError("");
    try {
      const nextGroups = updater(groups);
      await onChange?.(nextGroups);
      if (controlledGroups === undefined) setLocalGroups(nextGroups);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "체크리스트를 저장하지 못했습니다.";
      setMutationError(message);
      throw new Error(message);
    } finally {
      mutationLock.current = false;
      setWorking(false);
    }
  };
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const activeCategory = groups.some(group => group.id === selectedCategory)
    ? selectedCategory
    : groups[0]?.id;
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [editor, setEditor] = useState<ChecklistEditor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const editing = canEdit && isEditing;
  const [deleted, setDeleted] = useState<{
    groupId: string; item: ChecklistItem; index: number;
  } | null>(null);
  useEffect(() => {
    if (!deleted) return;
    const timer = window.setTimeout(() => setDeleted(null), 8000);
    return () => window.clearTimeout(timer);
  }, [deleted]);
  const removeItem = async (groupId: string, itemId: string) => {
    if (!editing) return;
    const group = groups.find(value => value.id === groupId);
    const index = group?.items.findIndex(value => value.id === itemId) ?? -1;
    if (!group || index < 0) return;
    const item = { ...group.items[index] };
    await setGroups(current => current.map(value => value.id === groupId
      ? { ...value, items: value.items.filter(entry => entry.id !== itemId) }
      : value));
    setDeleted({ groupId, item, index });
  };
  const undoDelete = async () => {
    if (!deleted) return;
    const entry = deleted;
    await setGroups(current => {
      const group = current.find(value => value.id === entry.groupId);
      if (!group) throw new Error("복구할 카테고리를 찾지 못했습니다.");
      const normalize = (title: string) => title.trim().replace(/\s+/g, "").toLocaleLowerCase();
      if (current.some(value => value.items.some(item => item.id === entry.item.id || normalize(item.title) === normalize(entry.item.title)))) {
        throw new Error("같은 준비물이 이미 있어 복구하지 못했습니다.");
      }
      return current.map(value => {
        if (value.id !== entry.groupId) return value;
        const nextItems = [...value.items];
        nextItems.splice(Math.min(entry.index, nextItems.length), 0, entry.item);
        return { ...value, items: nextItems };
      });
    });
    setSelectedCategory(entry.groupId);
    setCollapsed(current => current.filter(id => id !== entry.groupId));
    setDeleted(null);
  };
  const headingId = useId();
  const items = groups.flatMap((group) => group.items);
  const completed = items.filter((item) => item.checked).length;
  const percent = items.length
    ? Math.round((completed / items.length) * 100)
    : 0;
  const toggle = (groupId: string, itemId: string) =>
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item,
              ),
            }
          : group,
      ),
    );
  const closeEditor = () => {
    setEditor(null);
  };
  const save = async (editor: ChecklistEditor) => {
    if (!editor.title.trim()) return;
    const normalizedTitle = editor.title.trim().replace(/\s+/g, "").toLocaleLowerCase();
    if (groups.some(group => group.items.some(item => item.id !== editor.itemId && item.title.trim().replace(/\s+/g, "").toLocaleLowerCase() === normalizedTitle))) {
      throw new Error("이미 등록된 준비물입니다.");
    }
    if (!editor.itemId) { await saveBatch([editor]); setCollapsed(current => current.filter(id => id !== editor.groupId)); return; }
    await setGroups((current) =>
      current.map((group) =>
        group.id !== editor.groupId
          ? group
          : {
              ...group,
              items: editor.itemId
                ? group.items.map((item) =>
                    item.id === editor.itemId
                      ? {
                          ...item,
                          title: editor.title.trim(),
                          description: editor.description.trim(),
                        }
                      : item,
                  )
                : [
                    ...group.items,
                    {
                      id: crypto.randomUUID(),
                      title: editor.title.trim(),
                      description: editor.description.trim(),
                      checked: false,
                    },
                  ],
            },
      ),
    );
    setCollapsed((current) => current.filter((id) => id !== editor.groupId));
  };
  const saveBatch = async (values: ChecklistEditor[]) => {
    await setGroups(current => {
      const next = current.map(group => ({ ...group, items: [...group.items] }));
      const known = new Set(next.flatMap(group => group.items.map(item => item.title.trim().replace(/\s+/g, "").toLocaleLowerCase())));
      for (const value of values) {
        const title = value.title.trim();
        const identity = title.replace(/\s+/g, "").toLocaleLowerCase();
        if (!title || known.has(identity)) continue;
        let group = next.find(group => group.id === value.groupId);
        if (!group) {
          const category = ["필수품", "개인용품", "기타"].includes(value.groupId) ? value.groupId : "기타";
          group = next.find(group => group.title === category);
          if (!group) { group = { id: category, title: category, items: [] }; next.push(group); }
        }
        group.items.push({ id: crypto.randomUUID(), title, description: value.description.trim(), checked: false });
        known.add(identity);
      }
      return next;
    });
    if (values[0]) {
      setSelectedCategory(values[0].groupId);
      setCollapsed(current => current.filter(id => id !== values[0].groupId));
    }
  };
  return (
    <ChecklistStyle aria-labelledby={headingId} aria-busy={working} data-editing={editing}>
      <header className="checklist-header">
        <h2 id={headingId}>여행 준비 체크리스트</h2>
        {canEdit && (
          <div className="checklist-actions">
            <button type="button" className="mode-button" disabled={working}
              aria-pressed={editing} onClick={() => {
                if (editing) {
                  setIsEditing(false);
                  setDeleted(null);
                  onEditComplete?.();
                } else {
                  setIsEditing(true);
                }
              }}>
              {editing ? <Check aria-hidden="true" /> : <Pencil aria-hidden="true" />}
              {editing ? "완료" : "편집"}
            </button>
            {(editing || !items.length) && (
              <button type="button" className="primary-button"
                disabled={!groups.length || working}
                onClick={() => setEditor({ groupId: activeCategory ?? groups[0].id, title: "", description: "" })}>
                <Plus aria-hidden="true" />추가
              </button>
            )}
          </div>
        )}
      </header>
      {mutationError && <p role="alert">{mutationError}</p>}
      <div className="checklist-layout">
        <div className="checklist-main">
          <div ref={categoryNavRef} className="category-tabs" role="tablist" aria-label="준비물 카테고리">
            {groups.length > 0 && (
              <span
                className="category-indicator"
                aria-hidden="true"
                style={{
                  width: `calc((100% - ${(groups.length - 1) * 8}px) / ${groups.length})`,
                  transform: `translateX(calc(${Math.max(0, groups.findIndex(group => group.id === activeCategory)) * 100}% + ${Math.max(0, groups.findIndex(group => group.id === activeCategory)) * 8}px))`,
                }}
              />
            )}
            {groups.map((group, index) => (
              <button
                type="button"
                role="tab"
                key={group.id}
                id={`${headingId}-category-${group.id}`}
                aria-controls={`${headingId}-panel-${group.id}`}
                aria-selected={activeCategory === group.id}
                tabIndex={activeCategory === group.id ? 0 : -1}
                onClick={() => {
                  setSelectedCategory(group.id);
                  setCollapsed(current => current.filter(id => id !== group.id));
                }}
                onKeyDown={event => {
                  let next = index;
                  if (event.key === "ArrowRight") next = (index + 1) % groups.length;
                  else if (event.key === "ArrowLeft") next = (index + groups.length - 1) % groups.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = groups.length - 1;
                  else return;
                  event.preventDefault();
                  setSelectedCategory(groups[next].id);
                  setCollapsed(current => current.filter(id => id !== groups[next].id));
                  categoryNavRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
                }}
              >
                {group.title}
              </button>
            ))}
          </div>
        {groups.map((group) => {
          const done = group.items.filter((item) => item.checked).length;
          const isCollapsed = collapsed.includes(group.id);
          return (
            <section
              className="group-card"
              key={group.id}
              id={`${headingId}-panel-${group.id}`}
              role="tabpanel"
              aria-labelledby={`${headingId}-category-${group.id}`}
              data-active={activeCategory === group.id}
            >
              <button
                className="group-heading"
                aria-expanded={!isCollapsed}
                aria-controls={`${headingId}-${group.id}`}
                onClick={() =>
                  setCollapsed((current) =>
                    isCollapsed
                      ? current.filter((id) => id !== group.id)
                      : [...current, group.id],
                  )
                }
              >
                <span className="group-name">
                  <Luggage aria-hidden="true" />
                  {group.title}
                </span>
                {editing && <span className="edit-hint">준비물을 추가하거나 삭제할 수 있어요.</span>}
                <span className="group-count">
                  {done}/{group.items.length} 완료
                </span>
                <ChevronDown
                  className={
                    isCollapsed ? "group-chevron" : "group-chevron is-open"
                  }
                  aria-hidden="true"
                />
              </button>
              <progress
                className="group-progress"
                value={done}
                max={group.items.length || 1}
                aria-label={`${group.title} 준비 현황`}
              />
              <div
                id={`${headingId}-${group.id}`}
                className={`group-body${isCollapsed ? " is-collapsed" : ""}`}
              >
                <ul className="item-list">
                  {group.items.map((item) => (
                    <li className="item-row" key={item.id}>
                      <label className="item-label">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          disabled={!canEdit || working}
                          onChange={() => { void toggle(group.id, item.id).catch(() => undefined); }}
                        />
                        <span className="check-mark">
                          <Check aria-hidden="true" />
                        </span>
                        <span className="item-copy">
                          <span className="item-title">{item.title}</span>
                          {item.description && (
                            <span className="item-description">
                              {item.description}
                            </span>
                          )}
                        </span>
                      </label>
                      {editing && (
                        <button type="button" className="delete-item" disabled={working}
                          aria-label={`${item.title} 삭제`}
                          onClick={() => { void removeItem(group.id, item.id).catch(() => undefined); }}>
                          <Trash2 aria-hidden="true" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                {!group.items.length && (
                  <p className="empty-text">필요한 준비물을 추가해보세요.</p>
                )}
                {canEdit && (editing || !items.length) && <button
                  type="button"
                  className="add-item"
                  disabled={!canEdit || working}
                  onClick={() =>
                    setEditor({ groupId: group.id, title: "", description: "" })
                  }
                >
                  <Plus aria-hidden="true" />
                  준비물 추가
                </button>}
              </div>
            </section>
          );
        })}
        </div>
        <aside className="summary-card" aria-label="전체 준비 현황">
          <h3>준비 현황</h3>
          <div className="summary-numbers">
            <span>
              <strong>
                {completed}/{items.length}
              </strong>{" "}
              완료
            </span>
            <span>{percent}%</span>
          </div>
          <progress
            value={completed}
            max={items.length || 1}
            aria-label="전체 준비율"
          />
          <div className="summary-tip">
            <ClipboardCheck aria-hidden="true" />

            <div>
              <strong>
                {items.length > 0 && completed === items.length
                  ? "여행 준비 완료!"
                  : "출발 전 마지막 확인!"}
              </strong>

              <p>
                <span>준비물을 모두 챙기고</span>
                <span>즐겁게 떠나보세요.</span>
              </p>
            </div>
          </div>
        </aside>
      </div>
      <span className="sr-only" role="status">
        총 {items.length}개 중 {completed}개 준비 완료, {percent}%{working ? ", 저장 중" : ""}
      </span>
      {deleted && canEdit && (
        <div className="delete-toast" aria-label="준비물 삭제 안내">
          <span className="toast-message" role="status">
            <span className="toast-desktop-copy">{deleted.item.title}을(를) 삭제했어요.</span>
            <span className="toast-mobile-copy">
              <Check className="toast-check" aria-hidden="true" />
              <span className="toast-item-name">{deleted.item.title}</span>
              <span className="toast-result">삭제됨</span>
            </span>
          </span>
          <button type="button" className="toast-undo" disabled={working} onClick={() => { void undoDelete().catch(() => undefined); }}>실행 취소</button>
          <button type="button" className="toast-close" aria-label="삭제 안내 닫기" onClick={() => setDeleted(null)}><X aria-hidden="true" /></button>
        </div>
      )}
      {editor && canEdit && (
        <ChecklistModal
          initialValue={editor}
          groups={groups}
          onSave={save}
          onSaveBatch={saveBatch}
          onClose={closeEditor}
        />
      )}
    </ChecklistStyle>
  );
}
