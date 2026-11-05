import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { DropdownPositioner, DropdownStyle } from "./DropdownStyle";

export type DropdownOption<T extends string> = {
  value: T;
  label: string;
};

export type DropdownProps<T extends string> = {
  label: string;
  value: T;
  options: readonly DropdownOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
  trigger?: ReactNode;
  showLabel?: boolean;
};

type MenuStyle = CSSProperties & {
  "--dropdown-max-height"?: string;
};

const EDGE_GAP = 12;
const MENU_GAP = 6;
// Allow the existing close animation to finish before removing the Portal.
const MENU_EXIT_MS = 340;

export default function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
  disabled = false,
  trigger = <ChevronDown aria-hidden="true" />,
  showLabel = true,
}: DropdownProps<T>) {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState<MenuStyle>({
    left: 0,
    top: 0,
    visibility: "hidden",
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const positionerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedIndex = options.findIndex((option) => option.value === value);

  const isOpen = open && !disabled && options.length > 0;

  const containsTarget = (target: EventTarget | null) =>
    target instanceof Node &&
    Boolean(
      wrapperRef.current?.contains(target) ||
      positionerRef.current?.contains(target),
    );

  const openMenu = () => {
    if (disabled || options.length === 0) return;

    setHasOpened(true);
    setFocusIndex(Math.max(0, selectedIndex));
    setOpen(true);
  };

  // A closed dropdown must not leave an invisible Portal over other controls.
  // Keep it only long enough for the existing exit animation, then unmount it.
  useEffect(() => {
    if (isOpen || !hasOpened) return;

    const timer = window.setTimeout(() => {
      setHasOpened(false);
      setMenuStyle((previous) => ({
        ...previous,
        visibility: "hidden",
      }));
    }, MENU_EXIT_MS);

    return () => window.clearTimeout(timer);
  }, [isOpen, hasOpened]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const triggerElement = triggerRef.current;
    const positioner = positionerRef.current;
    const menu = menuRef.current;

    if (!triggerElement || !positioner || !menu) return;

    const updatePosition = () => {
      const rect = triggerElement.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;

      const triggerStyle = window.getComputedStyle(triggerElement);

      positioner.style.fontSize = triggerStyle.fontSize;
      positioner.style.fontFamily = triggerStyle.fontFamily;

      const menuWidth = positioner.offsetWidth;
      const menuStyle = window.getComputedStyle(menu);
      const borderHeight =
        parseFloat(menuStyle.borderTopWidth) +
        parseFloat(menuStyle.borderBottomWidth);

      const naturalHeight = menu.scrollHeight + borderHeight;

      const spaceBelow = Math.max(
        0,
        viewportHeight - rect.bottom - MENU_GAP - EDGE_GAP,
      );

      const spaceAbove = Math.max(0, rect.top - MENU_GAP - EDGE_GAP);

      const openAbove = naturalHeight > spaceBelow && spaceAbove > spaceBelow;

      const maxHeight = openAbove ? spaceAbove : spaceBelow;
      const visibleHeight = Math.min(naturalHeight, maxHeight);

      const left = Math.max(
        EDGE_GAP,
        Math.min(rect.left, viewportWidth - menuWidth - EDGE_GAP),
      );

      const desiredTop = openAbove
        ? rect.top - MENU_GAP - visibleHeight
        : rect.bottom + MENU_GAP;

      const top = Math.max(
        EDGE_GAP,
        Math.min(desiredTop, viewportHeight - visibleHeight - EDGE_GAP),
      );

      setMenuStyle({
        left,
        top,
        visibility: "visible",
        fontSize: triggerStyle.fontSize,
        fontFamily: triggerStyle.fontFamily,
        "--dropdown-max-height": `${maxHeight}px`,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    const observer = new ResizeObserver(updatePosition);
    observer.observe(triggerElement);
    observer.observe(menu);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      observer.disconnect();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    optionRefs.current[focusIndex]?.focus({
      preventScroll: true,
    });
  }, [isOpen, focusIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !wrapperRef.current?.contains(target) &&
        !positionerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutside);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, [isOpen]);

  return (
    <DropdownStyle
      ref={wrapperRef}
      className={className}
      onBlur={(event) => {
        if (!containsTarget(event.relatedTarget)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
          return;
        }

        if (event.key === "Tab" && isOpen) {
          setOpen(false);
          triggerRef.current?.focus();
          return;
        }

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();

          if (!isOpen) {
            openMenu();
            return;
          }

          const direction = event.key === "ArrowDown" ? 1 : -1;

          setFocusIndex(
            (index) => (index + direction + options.length) % options.length,
          );

          return;
        }

        if (isOpen && (event.key === "Home" || event.key === "End")) {
          event.preventDefault();
          setFocusIndex(event.key === "Home" ? 0 : options.length - 1);
        }
      }}
    >
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        className="sort-trigger"
        disabled={disabled || options.length === 0}
        aria-label={
          showLabel
            ? `${label}: ${options[selectedIndex]?.label ?? label}`
            : label
        }
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? `${id}-menu` : undefined}
        onClick={() => {
          if (isOpen) setOpen(false);
          else openMenu();
        }}
      >
        {showLabel && <span>{options[selectedIndex]?.label ?? label}</span>}

        <span className="dropdown-trigger-icon">{trigger}</span>
      </button>

      {hasOpened &&
        createPortal(
          <DropdownPositioner
            ref={positionerRef}
            data-open={isOpen}
            aria-hidden={!isOpen}
            inert={!isOpen}
            style={{
              ...menuStyle,
              // Important: inert on the menu alone does not disable its parent.
              pointerEvents: isOpen ? "auto" : "none",
            }}
          >
            <div
              ref={menuRef}
              id={`${id}-menu`}
              className="sort-dropdown"
              role="menu"
              data-open={isOpen}
              aria-hidden={!isOpen}
              aria-label={label}
              inert={!isOpen}
            >
              {options.map((option, index) => (
                <button
                  key={option.value}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="menuitemradio"
                  aria-checked={value === option.value}
                  tabIndex={isOpen && focusIndex === index ? 0 : -1}
                  className={value === option.value ? "is-selected" : ""}
                  onFocus={() => setFocusIndex(index)}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </DropdownPositioner>,
          document.body,
        )}
    </DropdownStyle>
  );
}
