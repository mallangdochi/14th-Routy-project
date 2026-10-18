import { keyframes } from "@emotion/react";
import type { CSSObject } from "@emotion/react";

// 드롭다운 애니메이션
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

// 모달 애니메이션
export const tripSheetSlideUp = keyframes({
  from: { transform: "translateY(100%)" },
  to: { transform: "translateY(0)" },
});

export const tripSheetSlideDown = keyframes({
  from: { transform: "translateY(0)" },
  to: { transform: "translateY(100%)" },
});

export const modalFadeUp = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(16px)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
});

export const modalFadeDown = keyframes({
  from: {
    opacity: 1,
    transform: "translateY(0)",
  },
  to: {
    opacity: 0,
    transform: "translateY(16px)",
  },
});

export const modalAnimation: CSSObject = {
  '&[data-open="true"]': {
    animation: `${modalFadeUp} 300ms cubic-bezier(0.22, 1, 0.36, 1) both`,
  },

  '&[data-open="false"]': {
    animation: `${modalFadeDown} 270ms ease-in both`,
    pointerEvents: "none",
  },

  "@media (max-width: 767px)": {
    '&[data-open="true"]': {
      animationName: `${tripSheetSlideUp}`,
    },

    '&[data-open="false"]': {
      animationName: `${tripSheetSlideDown}`,
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    '&[data-open="true"], &[data-open="false"]': {
      animationDuration: "1ms",
    },
  },
};
