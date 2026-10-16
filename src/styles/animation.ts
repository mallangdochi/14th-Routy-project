import { keyframes } from "@emotion/react";
import type { CSSObject } from "@emotion/react";

export const dropdownSlideDown = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(-8px)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
});

export const dropdownSlideUp = keyframes({
  from: {
    opacity: 1,
    transform: "translateY(0)",
  },
  to: {
    opacity: 0,
    transform: "translateY(-8px)",
  },
});

export const dropdownAnimation: CSSObject = {
  '&[data-open="true"]': {
    animation: `${dropdownSlideDown} 240ms cubic-bezier(0.22, 1, 0.36, 1) both`,
  },

  '&[data-open="false"]': {
    animation: `${dropdownSlideUp} 240ms ease-in both`,
    pointerEvents: "none",
  },

  "@media (prefers-reduced-motion: reduce)": {
    '&[data-open="true"], &[data-open="false"]': {
      animationDuration: "1ms",
    },
  },
};

export const tripSheetSlideUp = keyframes({
  from: { transform: "translateY(100%)" },
  to: { transform: "translateY(0)" },
});
