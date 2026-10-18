import type { CSSProperties } from "react";

const schedulePalette = [
  { background: "#FFE0E9", accent: "#CF6489" },
  { background: "#FFDCE0", accent: "#D56B78" },
  { background: "#FFE3D5", accent: "#CF805C" },
  { background: "#FFEACD", accent: "#C38B42" },
  { background: "#FFF2C6", accent: "#AE9134" },
  { background: "#F7F0C5", accent: "#A79A42" },
  { background: "#F2DEFA", accent: "#AC6BC0" },
  { background: "#E9DFFF", accent: "#9270C9" },
  { background: "#E0E2FF", accent: "#797DCC" },
  { background: "#DCEAFF", accent: "#6893CF" },
  { background: "#DDF1FF", accent: "#579BC5" },
  { background: "#FADFF0", accent: "#C66BA4" },
] as const;

export type ScheduleColor = (typeof schedulePalette)[number]["background"];

export const scheduleColors = schedulePalette.map((color) => color.background);

function getColorIndex(id: string): number {
  let hash = 2166136261;

  for (let i = 0; i < id.length; i += 1) {
    hash = Math.imul(hash ^ id.charCodeAt(i), 16777619) >>> 0;
  }

  hash ^= hash >>> 16;

  return (hash >>> 0) % schedulePalette.length;
}

export function createScheduleColorMap(
  schedules: readonly { id: string }[],
): Map<string, ScheduleColor> {
  const colorMap = new Map<string, ScheduleColor>();
  const usedIndexes = new Set<number>();
  const ids = [...new Set(schedules.map((schedule) => schedule.id))].sort();

  for (const id of ids) {
    if (usedIndexes.size === schedulePalette.length) {
      usedIndexes.clear();
    }

    let index = getColorIndex(id);

    while (usedIndexes.has(index)) {
      index = (index + 1) % schedulePalette.length;
    }

    usedIndexes.add(index);
    colorMap.set(id, schedulePalette[index].background);
  }

  return colorMap;
}

export function getScheduleColor(id: string): ScheduleColor {
  return schedulePalette[getColorIndex(id)].background;
}

type ScheduleColorStyle = CSSProperties & {
  "--trip-bg": ScheduleColor;
  "--trip-ink": string;
  "--trip-accent": string;
};

export function getScheduleColorStyle(
  id: string,
  colorMap: ReadonlyMap<string, ScheduleColor>,
): ScheduleColorStyle {
  const background = colorMap.get(id) ?? getScheduleColor(id);
  const palette = schedulePalette.find(
    (color) => color.background === background,
  )!;

  return {
    "--trip-bg": palette.background,
    "--trip-ink": "#3D3545",
    "--trip-accent": palette.accent,
  };
}
