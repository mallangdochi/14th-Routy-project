import { useId, useState } from "react";
import {
  Check,
  ChevronDown,
  ClipboardCheck,
  Luggage,
  Plus,
} from "lucide-react";
import { mockChecklist, type ChecklistGroup } from "../../data/checklist";
import { ChecklistStyle } from "./ChecklistStyle";
import Dropdown from "../dropdown/Dropdown";
import ChecklistModal, {
  type ChecklistEditor,
} from "../../components/modal/addItem/ChecklistModal";

type Props = {
  initialGroups?: ChecklistGroup[];
  groups?: ChecklistGroup[];
  onChange?: (groups: ChecklistGroup[]) => void;
};
export default function Checklist({
  initialGroups = mockChecklist,
  groups: controlledGroups,
  onChange,
}: Props) {
  const [localGroups, setLocalGroups] = useState<ChecklistGroup[]>(() =>
    initialGroups.map((group) => ({
      ...group,
      items: group.items.map((item) => ({ ...item })),
    })),
  );
  const groups = controlledGroups ?? localGroups;
  const setGroups = (
    updater: (current: ChecklistGroup[]) => ChecklistGroup[],
  ) => {
    const nextGroups = updater(groups);
    if (controlledGroups === undefined) setLocalGroups(nextGroups);
    onChange?.(nextGroups);
  };
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [editor, setEditor] = useState<ChecklistEditor | null>(null);
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
  const save = (editor: ChecklistEditor) => {
    if (!editor.title.trim()) return;
    setGroups((current) =>
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
  return (
    <ChecklistStyle aria-labelledby={headingId}>
      <header className="checklist-header">
        <h2 id={headingId}>여행 준비 체크리스트</h2>
        <button
          className="primary-button"
          disabled={!groups.length}
          onClick={() =>
            setEditor({ groupId: groups[0].id, title: "", description: "" })
          }
        >
          <Plus aria-hidden="true" />
          추가
        </button>
      </header>
      <div className="checklist-layout">
        {groups.map((group) => {
          const done = group.items.filter((item) => item.checked).length;
          const isCollapsed = collapsed.includes(group.id);
          return (
            <section className="group-card" key={group.id}>
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
                          onChange={() => toggle(group.id, item.id)}
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
                      <Dropdown<"" | "edit" | "delete">
                        className="item-actions"
                        label={`${item.title} 관리`}
                        value=""
                        options={[
                          { value: "edit", label: "수정" },
                          { value: "delete", label: "삭제" },
                        ]}
                        trigger={<span aria-hidden="true">⋮</span>}
                        showLabel={false}
                        onChange={(action) => {
                          if (action === "edit") {
                            setEditor({
                              groupId: group.id,
                              itemId: item.id,
                              title: item.title,
                              description: item.description,
                            });
                            return;
                          }
                          setGroups((current) =>
                            current.map((value) =>
                              value.id === group.id
                                ? {
                                    ...value,
                                    items: value.items.filter(
                                      (value) => value.id !== item.id,
                                    ),
                                  }
                                : value,
                            ),
                          );
                        }}
                      />
                    </li>
                  ))}
                </ul>
                {!group.items.length && (
                  <p className="empty-text">필요한 준비물을 추가해보세요.</p>
                )}
                <button
                  className="add-item"
                  onClick={() =>
                    setEditor({ groupId: group.id, title: "", description: "" })
                  }
                >
                  <Plus aria-hidden="true" />
                  준비물 추가
                </button>
              </div>
            </section>
          );
        })}
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
        총 {items.length}개 중 {completed}개 준비 완료, {percent}%
      </span>
      {editor && (
        <ChecklistModal
          initialValue={editor}
          groups={groups}
          onSave={save}
          onClose={closeEditor}
        />
      )}
    </ChecklistStyle>
  );
}
