import {
  useLayoutEffect,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { ChecklistGroup } from "../../../api/tripChecklist";
import Dropdown from "../../dropdown/Dropdown";
import { ChecklistModalStyle } from "./ChecklistModalStyle";

export type ChecklistEditor = {
  groupId: string;
  itemId?: string;
  title: string;
  description: string;
};

const categories = ["필수품", "개인용품", "기타"] as const;
const recommendations = {
  기본: [
    ["신분증", "본인 확인용", "필수품"],
    ["지갑·결제카드", "이동과 결제에 필요한 수단", "필수품"],
    ["충전기", "휴대폰 충전용", "개인용품"],
    ["보조배터리", "외출 중 충전용", "개인용품"],
    ["세안용품", "개인 세면용품", "개인용품"],
    ["여벌 옷", "갈아 입을 옷", "개인용품"],
  ],
  물놀이: [
    ["수영복", "물놀이용 복장", "개인용품"],
    ["방수팩", "휴대폰 보관용", "개인용품"],
    ["수건", "물놀이 후 사용", "개인용품"],
    ["아쿠아슈즈", "물가에서 신을 신발", "개인용품"],
    ["젖은 옷 보관 봉투", "마른 짐과 분리 보관", "기타"],
  ],
  아웃도어: [
    ["등산복·등산화", "걷기 편한 옷과 신발", "개인용품"],
    ["바람막이", "기온 변화 대비", "개인용품"],
    ["물병", "이동 중 마실 물", "개인용품"],
    ["간식", "이동 중 먹을 간식", "기타"],
    ["텐트", "야외 숙박용", "기타"],
    ["침낭", "취침과 보온용", "개인용품"],
    ["랜턴", "야간 조명", "기타"],
  ],
  "아이 동반": [
    ["아이 여벌 옷", "갈아입을 옷", "개인용품"],
    ["물티슈", "외출 중 위생 관리", "개인용품"],
    ["아이 물병", "아이에게 맞는 물병", "개인용품"],
    ["아이 간식", "이동 중 먹을 간식", "기타"],
    ["유모차", "아이와 일정에 맞게 준비", "기타"],
  ],
  "반려동물 동반": [
    ["이동장", "이동 시 사용", "기타"],
    ["목줄·하네스", "산책과 이동용", "기타"],
    ["사료·간식", "여행 기간에 맞춰 준비", "기타"],
    ["휴대용 급수 용품", "이동 중 급수용", "기타"],
    ["배변봉투·패드", "외출과 숙소 이용 대비", "기타"],
  ],
} as const;
type RecommendationType = keyof typeof recommendations;

type Props = {
  initialValue: ChecklistEditor;
  groups: ChecklistGroup[];
  onSave: (value: ChecklistEditor) => void | Promise<void>;
  onClose: () => void;
  onSaveBatch: (values: ChecklistEditor[]) => void | Promise<void>;
};

export default function ChecklistModal({
  initialValue,
  groups,
  onSave,
  onSaveBatch,
  onClose,
}: Props) {
  const [editor, setEditor] = useState(() => ({
    ...initialValue,
    groupId: initialValue.itemId
      ? initialValue.groupId
      : groups.some(
            (group) =>
              group.id === initialValue.groupId &&
              categories.some((title) => title === group.title),
          )
        ? initialValue.groupId
        : (groups.find((group) => group.title === "기타")?.id ?? "기타"),
  }));
  const [tab, setTab] = useState<"recommended" | "manual">(
    initialValue.itemId ? "manual" : "recommended",
  );
  const [recommendationType, setRecommendationType] =
    useState<RecommendationType>("기본");
  const [selected, setSelected] = useState<string[]>([]);
  const normalize = (value: string) =>
    value.trim().replace(/\s+/g, "").toLocaleLowerCase();
  const existing = new Set(
    groups.flatMap((group) => group.items.map((item) => normalize(item.title))),
  );
  const available = recommendations[recommendationType].filter(
    (item) => !existing.has(normalize(item[0])),
  );
  const selectedItems = Object.values(recommendations)
    .flat()
    .filter(
      (item) => selected.includes(item[0]) && !existing.has(normalize(item[0])),
    );
  const selectAll =
    available.length > 0 &&
    available.every((item) => selected.includes(item[0]));
  const tabsId = useId();
  const [open, setOpen] = useState(true);
  const closing = useRef(false);
  const submitLock = useRef(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const headingId = useId();
  const nameId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    formRef.current
      ?.querySelector<HTMLElement>("button:not(:disabled)")
      ?.focus({ preventScroll: true });
    return () => {
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  useLayoutEffect(() => {
    if (tab !== "recommended") return;
    const container = typesRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;
    const update = () => {
      const button = container.querySelector<HTMLButtonElement>(
        'button[aria-pressed="true"]',
      );
      if (!button) return;
      indicator.style.width = `${button.offsetWidth}px`;
      indicator.style.height = `${button.offsetHeight}px`;
      indicator.style.transform = `translate(${button.offsetLeft}px, ${button.offsetTop}px)`;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    container
      .querySelectorAll("button")
      .forEach((button) => observer.observe(button));
    return () => observer.disconnect();
  }, [recommendationType, tab]);

  const close = () => {
    if (closing.current || submitLock.current) return;
    closing.current = true;
    setOpen(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (closing.current || submitLock.current) return;
    if (tab === "manual" && !editor.title.trim()) return;
    const unique = new Map(
      selectedItems.map((item) => [normalize(item[0]), item]),
    );
    if (tab === "recommended" && !unique.size) return;
    submitLock.current = true;
    setSaving(true);
    setSaveError("");
    try {
      if (tab === "recommended" && !editor.itemId) {
        await onSaveBatch(
          Array.from(unique.values()).map(([title, description, category]) => ({
            groupId:
              groups.find((group) => group.title === category)?.id ?? category,
            title,
            description,
          })),
        );
      } else {
        await onSave({
          ...editor,
          title: editor.title.trim(),
          description: editor.description.trim(),
        });
      }
      submitLock.current = false;
      close();
    } catch (reason) {
      setSaveError(
        reason instanceof Error
          ? reason.message
          : "저장하지 못했습니다. 다시 시도해주세요.",
      );
    } finally {
      submitLock.current = false;
      setSaving(false);
    }
  };

  return createPortal(
    <ChecklistModalStyle>
      <div
        className="editor-backdrop"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <form
          ref={formRef}
          className="item-editor"
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          data-open={open}
          aria-busy={saving}
          onSubmit={submit}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && !open) onClose();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              close();
            }
            if (event.key !== "Tab") return;
            const elements = Array.from(
              formRef.current?.querySelectorAll<HTMLElement>(
                'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
              ) ?? [],
            ).filter(
              (element) =>
                !element.closest('[inert], [aria-hidden="true"]') &&
                element.getClientRects().length > 0,
            );
            const first = elements[0];
            const last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }}
        >
          <div className="editor-heading">
            <h3 id={headingId}>
              {editor.itemId ? "준비물 수정" : "준비물 추가"}
            </h3>
            <button
              type="button"
              className="close-button"
              disabled={saving}
              aria-label="닫기"
              onClick={close}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          {!editor.itemId && (
            <div className="editor-tabs" role="tablist" aria-label="추가 방법">
              <span
                className="tab-indicator"
                aria-hidden="true"
                style={{
                  transform: `translateX(${tab === "manual" ? "100%" : "0%"})`,
                }}
              />
              {(["recommended", "manual"] as const).map((value) => (
                <button
                  type="button"
                  role="tab"
                  disabled={saving}
                  key={value}
                  id={`${tabsId}-${value}-tab`}
                  aria-controls={`${tabsId}-${value}`}
                  aria-selected={tab === value}
                  onClick={() => setTab(value)}
                >
                  {value === "recommended" ? "추천 준비물" : "직접 입력"}
                </button>
              ))}
            </div>
          )}
          <fieldset disabled={saving} className="editor-fields">
            <div
              key={tab}
              className="tab-panel"
              role={editor.itemId ? undefined : "tabpanel"}
              id={`${tabsId}-${tab}`}
              aria-labelledby={
                editor.itemId ? undefined : `${tabsId}-${tab}-tab`
              }
            >
              {tab === "recommended" ? (
                <>
                  <div
                    ref={typesRef}
                    className="recommendation-types"
                    aria-label="추천 유형"
                  >
                    <span
                      ref={indicatorRef}
                      className="recommendation-indicator"
                      aria-hidden="true"
                    />
                    {(Object.keys(recommendations) as RecommendationType[]).map(
                      (value) => (
                        <button
                          type="button"
                          key={value}
                          aria-pressed={recommendationType === value}
                          onClick={() => setRecommendationType(value)}
                        >
                          {value}
                        </button>
                      ),
                    )}
                  </div>
                  <div className="recommendation-heading">
                    <strong>{recommendationType} 준비물</strong>
                    <button
                      type="button"
                      disabled={!available.length}
                      onClick={() =>
                        setSelected((current) =>
                          selectAll
                            ? current.filter(
                                (title) =>
                                  !available.some((item) => item[0] === title),
                              )
                            : Array.from(
                                new Set([
                                  ...current,
                                  ...available.map((item) => item[0]),
                                ]),
                              ),
                        )
                      }
                    >
                      {selectAll ? "선택 해제" : "전체 선택"}
                    </button>
                  </div>
                  <div className="recommendation-viewport">
                    <div className="recommendation-list">
                      {recommendations[recommendationType].map(
                        ([title, description, category]) => {
                          const isExisting = existing.has(normalize(title));
                          return (
                            <label
                              className="recommendation-item"
                              key={title}
                              data-disabled={isExisting}
                            >
                              <input
                                type="checkbox"
                                disabled={isExisting || !open}
                                checked={
                                  !isExisting && selected.includes(title)
                                }
                                onChange={() =>
                                  setSelected((current) =>
                                    current.includes(title)
                                      ? current.filter(
                                          (value) => value !== title,
                                        )
                                      : [...current, title],
                                  )
                                }
                              />
                              <span className="recommendation-copy">
                                <strong>{title}</strong>
                                <span>
                                  {isExisting
                                    ? "이미 추가된 준비물"
                                    : description}
                                </span>
                              </span>
                              <span className="recommendation-category">
                                {category}
                              </span>
                            </label>
                          );
                        },
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="editor-field">
                    <span>카테고리</span>
                    <Dropdown
                      className="category-dropdown"
                      label="카테고리"
                      value={editor.groupId}
                      options={categories.map((title) => ({
                        value:
                          groups.find((group) => group.title === title)?.id ??
                          title,
                        label: title,
                      }))}
                      disabled={Boolean(editor.itemId)}
                      onChange={(groupId) =>
                        setEditor((current) => ({ ...current, groupId }))
                      }
                    />
                  </div>
                  <label className="editor-field" htmlFor={nameId}>
                    준비물 이름
                    <input
                      ref={titleRef}
                      id={nameId}
                      required
                      maxLength={60}
                      value={editor.title}
                      onChange={(event) =>
                        setEditor({ ...editor, title: event.target.value })
                      }
                      placeholder="준비물을 입력해주세요"
                    />
                  </label>
                  <label className="editor-field" htmlFor={descriptionId}>
                    설명 (선택)
                    <textarea
                      id={descriptionId}
                      maxLength={200}
                      value={editor.description}
                      onChange={(event) =>
                        setEditor({
                          ...editor,
                          description: event.target.value,
                        })
                      }
                      placeholder="확인할 내용을 입력해주세요"
                    />
                  </label>
                </>
              )}
            </div>
          </fieldset>
          {saveError && <p role="alert">{saveError}</p>}
          <div className="editor-buttons">
            {tab === "recommended" && (
              <span className="selection-count" role="status">
                {selectedItems.length}개 선택
              </span>
            )}
            <button type="button" disabled={saving} onClick={close}>
              취소
            </button>
            <button
              className="primary-button"
              disabled={
                (tab === "recommended"
                  ? !selectedItems.length
                  : !editor.title.trim()) ||
                !open ||
                saving
              }
              type="submit"
            >
              {saving
                ? "저장 중…"
                : editor.itemId
                  ? "저장"
                  : tab === "recommended"
                    ? "선택한 준비물 추가"
                    : "추가"}
            </button>
          </div>
        </form>
      </div>
    </ChecklistModalStyle>,
    document.body,
  );
}
