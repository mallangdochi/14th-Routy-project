import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
export type Placement = "top" | "bottom";
export function usePicker(disabled = false) {
  const [requestedOpen, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const open = requestedOpen && !disabled;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
  };
  const toggle = () => {
    if (disabled) return;
    setMounted(true);
    setOpen((value) => !value);
  };
  useEffect(() => {
    if (open || !mounted) return;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 1
      : 240;
    const timer = window.setTimeout(() => setMounted(false), duration);
    return () => window.clearTimeout(timer);
  }, [open, mounted]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const frame = requestAnimationFrame(() => {
      const popup = popupRef.current;
      const target =
        popup?.querySelector<HTMLElement>(
          'button[aria-pressed="true"]:not(:disabled)',
        ) ??
        popup?.querySelector<HTMLElement>(
          "button:not(:disabled), input:not(:disabled)",
        );
      target?.focus({ preventScroll: true });
    });
    document.addEventListener("pointerdown", outside);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    }
  };
  return {
    open,
    mounted,
    rootRef,
    triggerRef,
    popupRef,
    close,
    toggle,
    handleBlur,
    handleKeyDown,
  };
}
