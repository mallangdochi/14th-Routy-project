export type NotificationStatus = "pending" | "approved" | "rejected";
export type NotificationTab = "all" | "pending" | "completed";
export type NotificationKind = "invite" | "schedule_changed" | "trip_start";
export type NotificationCategory = "all" | NotificationKind;
export type NotificationItem = {
  /** 기존 응답에서 생략되면 여행 초대 요청입니다. */
  kind?: NotificationKind;
  readAt?: string | null;
  message?: string;
  placeName?: string;
  previousTime?: string;
  nextTime?: string;
  day?: number;
  tripDateLabel?: string;
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
  /** 일정 변경/시작 알림만 호출. 성공 후 읽음 처리합니다. */
  onRead?: (item: NotificationItem) => Promise<void> | void;
  /** 미지정 시 /trips/:tripId 로 이동합니다. */
  onOpen?: (item: NotificationItem) => Promise<void> | void;
  onRetry?: () => void;
  onDelete?: (item: NotificationItem) => Promise<void>;
  onRestore?: (items: NotificationItem[]) => Promise<void>;
};
