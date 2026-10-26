import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { ChecklistGroup } from "../../../data/checklist";
import Dropdown from "../../dropdown/Dropdown";
import { ChecklistModalStyle } from "./ChecklistModalStyle";

export type ChecklistEditor = {
  groupId: string;
  itemId?: string;
  title: string;
  description: string;
};

type Props = {
  initialValue: ChecklistEditor;
  groups: ChecklistGroup[];
  onSave: (value: ChecklistEditor) => void;
  onClose: () => void;
};

export default function ChecklistModal({
  initialValue,
  groups,
  onSave,
  onClose,
}: Props) {
  const [editor, setEditor] = useState(initialValue);
  const [open, setOpen] = useState(true);
  const closing = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const headingId = useId();
  const nameId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    titleRef.current?.focus({ preventScroll: true });
    return () => {
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    setOpen(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (closing.current || !editor.title.trim()) return;
    onSave({
      ...editor,
      title: editor.title.trim(),
      description: editor.description.trim(),
    });
    close();
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
              aria-label="닫기"
              onClick={close}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <div className="editor-field">
            <span>카테고리</span>
            <Dropdown
              className="category-dropdown"
              label="카테고리"
              value={editor.groupId}
              options={groups.map((group) => ({
                value: group.id,
                label: group.title,
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
                setEditor({ ...editor, description: event.target.value })
              }
              placeholder="확인할 내용을 입력해주세요"
            />
          </label>
          <div className="editor-buttons">
            <button type="button" onClick={close}>
              취소
            </button>
            <button
              className="primary-button"
              disabled={!editor.title.trim() || !open}
              type="submit"
            >
              {editor.itemId ? "저장" : "추가"}
            </button>
          </div>
        </form>
      </div>
    </ChecklistModalStyle>,
    document.body,
  );
}
