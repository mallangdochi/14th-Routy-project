export type TripPermission = "owner" | "editor" | "viewer";

// Missing permission must never grant host/editor controls.
export function getTripPermission(value: unknown): TripPermission | undefined {
  if (!value || typeof value !== "object" || !("permission" in value)) return undefined;
  const permission = value.permission;
  return permission === "owner" || permission === "editor" || permission === "viewer"
    ? permission
    : undefined;
}

export const tripRoleLabels: Record<TripPermission, string> = {
  owner: "호스트",
  editor: "편집자",
  viewer: "보기전용",
};

export const tripRoleColors: Record<TripPermission, { backgroundColor: string; color: string }> = {
  owner: { backgroundColor: "#EEE7FA", color: "#70529B" },
  editor: { backgroundColor: "#FFF0DF", color: "#94602E" },
  viewer: { backgroundColor: "#ECEFF3", color: "#596575" },
};

export const tripStatusColors = {
  PLANNING: { backgroundColor: "#E5F1FF", color: "#3E6E9F" },
  IN_PROGRESS: { backgroundColor: "#DFF3EA", color: "#367963" },
  COMPLETED: { backgroundColor: "#FBE7ED", color: "#9B566D" },
};
