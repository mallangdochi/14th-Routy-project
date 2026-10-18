import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { X } from "lucide-react";
import { TripPreviewStyle } from "./tripPreviewStyle";
type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  children: ReactNode;
};
export default function TripPreviewModal({
  open,
  onClose,
  onCreate,
  triggerRef,
  children,
}: Props) {
  const [previousOpen, setPreviousOpen] = useState(open);
  const [mounted, setMounted] = useState(open);
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (previousOpen !== open) {
    setPreviousOpen(open);
    if (open) setMounted(true);
  }

  useEffect(() => {
    if (!mounted) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;

    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [mounted, triggerRef]);
  return (
    <TripPreviewStyle
      ref={dialogRef}
      className="trip-sheet"
      data-open={open}
      inert={!open}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && !open) {
          setMounted(false);
        }
      }}
      aria-labelledby="sheet-title"
      aria-describedby="sheet-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="sheet-surface">
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-heading">
          <div>
            <h2 id="sheet-title">여행 미리보기</h2>
            <p id="sheet-description">
              여행을 만들기 전에 입력한 정보를 확인해주세요.
            </p>
          </div>
          <button
            type="button"
            className="sheet-close"
            aria-label="여행 미리보기 닫기"
            onClick={onClose}
            autoFocus
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="sheet-content">
          <div className="sheet-content-inner">{children}</div>
        </div>

        <div className="form-actions sheet-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            이전
          </button>
          <button type="button" className="submit-button" onClick={onCreate}>
            여행 만들기
          </button>
        </div>
      </div>
    </TripPreviewStyle>
  );
}
