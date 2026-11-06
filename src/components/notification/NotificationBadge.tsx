import { BadgeNum } from "./notificationStyle";

export default function NotificationBadge({
  count,
  placement,
  compact = false,
}: {
  count: number;
  placement: "sidebar" | "header";
  compact?: boolean;
}) {
  if (!Number.isFinite(count) || count < 1) return null;
  return (
    <BadgeNum $placement={placement} $compact={compact} aria-hidden="true">
      {Math.trunc(count)}
    </BadgeNum>
  );
}
