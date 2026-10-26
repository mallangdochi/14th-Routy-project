import { ClipboardCheck, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ChecklistLayout, ChecklistPanel, StatusPanel } from "./ChecklistStyle";
import checkMascot from "../../../assets/checklist.webp";
import { mockChecklist } from "../../../data/checklist";
import ChecklistModal, {
  type ChecklistEditor,
} from "../../modal/addItem/ChecklistModal";

type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
  groupId: string;
  description: string;
};

export default function EmptyChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = items.filter((item) => item.checked).length;
  const progress =
    items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  const addItem = (value: ChecklistEditor) => {
    const text = value.title.trim();
    if (!text) return;

    setItems((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        text,
        checked: false,
        groupId: value.groupId,
        description: value.description.trim(),
      },
    ]);
  };

  const toggleItem = (id: string) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const updateItem = (id: string, text: string) => {
    setItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  };

  const removeItem = (id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  return (
    <ChecklistLayout>
      <header className="checklist-header">
        <h2>여행 준비 체크리스트</h2>

        <div className="checklist-actions">
          <button
            type="button"
            className="add-button"
            aria-expanded={isAdding}
            aria-haspopup="dialog"
            disabled={!mockChecklist.length}
            onClick={() => setIsAdding(true)}
          >
            <Plus size={20} aria-hidden="true" />
            추가
          </button>
        </div>
      </header>

      <div className="checklist-body">
        <ChecklistPanel aria-label="준비물 목록">
          {items.length === 0 ? (
            <div className="checklist-empty">
              <img className="empty-mascot" src={checkMascot} alt="" />

              <h3>아직 체크리스트가 없어요</h3>

              <p>
                여행에 필요한 준비물을 추가하고
                <br />
                빠짐없이 챙겨보세요.
              </p>
            </div>
          ) : (
            <ul className="checklist-items">
              {items.map((item) => (
                <li key={item.id}>
                  {isEditing ? (
                    <>
                      <input
                        className="item-edit-input"
                        aria-label="준비물 수정"
                        value={item.text}
                        onChange={(event) =>
                          updateItem(item.id, event.target.value)
                        }
                      />

                      <button
                        type="button"
                        className="delete-button"
                        aria-label={`${item.text || "준비물"} 삭제`}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={20} aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <label className={item.checked ? "is-checked" : ""}>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id)}
                      />
                      <span>{item.text}</span>
                    </label>
                  )}
                </li>
              ))}
            </ul>
          )}
        </ChecklistPanel>

        <StatusPanel aria-label="준비 현황">
          <h2>준비 현황</h2>

          <div className="status-numbers">
            <p className="status-count">
              <strong>
                {items.length === 0 ? 0 : `${completedCount}/${items.length}`}
              </strong>
              <span>{items.length === 0 ? "개 등록" : "완료"}</span>
            </p>
            <span className="status-percent">{progress}%</span>
          </div>

          <progress
            className="status-progress"
            value={completedCount}
            max={items.length || 1}
            aria-label="여행 준비 완료율"
          />

          <div className="status-guide" aria-live="polite">
            <ClipboardCheck aria-hidden="true" />
            <strong>
              {items.length === 0
                ? "여행 준비를 시작해요"
                : progress === 100
                  ? "여행 준비 완료!"
                  : "출발 전 마지막 확인!"}
            </strong>
            <p>
              {items.length === 0 ? (
                <>
                  <span>준비물을 추가하면</span>
                  <span>완료 현황을 확인할 수 있어요.</span>
                </>
              ) : (
                <>
                  <span>준비물을 모두 챙기고</span>
                  <span>즐겁게 떠나보세요.</span>
                </>
              )}
            </p>
          </div>
        </StatusPanel>
      </div>
      {isAdding && mockChecklist.length > 0 && (
        <ChecklistModal
          initialValue={{
            groupId: mockChecklist[0].id,
            title: "",
            description: "",
          }}
          groups={mockChecklist}
          onSave={addItem}
          onClose={() => setIsAdding(false)}
        />
      )}
    </ChecklistLayout>
  );
}
