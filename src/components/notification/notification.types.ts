export type NotificationStatus = "pending" | "approved" | "rejected";
export type NotificationTab = "all" | "pending" | "completed";
export type NotificationItem = {
  id: string;
  tripId: string;
  tripName: string;
  requesterName: string;
  avatarUrl?: string | null;
  permission: "editor" | "viewer";
  status: NotificationStatus;
  requestedAt: string;
  decidedAt?: string | null;
};
export type NotificationProps = {
  items?: readonly NotificationItem[];
  loading?: boolean;
  error?: string | null;
  initialTab?: NotificationTab;
  emptyImageSrc?: string;
  /** 서버 처리가 성공한 뒤 상위에서 items를 갱신합니다. */
  onDecision?: (item: NotificationItem, decision: "approved" | "rejected") => Promise<void> | void;
  onRetry?: () => void;
  onDelete?: (item: NotificationItem) => Promise<void>;
  onRestore?: (items: NotificationItem[]) => Promise<void>;
};
