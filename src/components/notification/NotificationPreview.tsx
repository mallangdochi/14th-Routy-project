/** UI 확인용 샘플입니다. 실제 API는 호출하지 않습니다. */
import { useState } from "react";
// import Notification from "./Notification";
import NotificationPage from "../../pages/notificationPage/NotificationPage";
import type { NotificationItem } from "./notification.types";

function createNotificationSamples(): NotificationItem[] {
  const now = Date.now();

  return [
    {
      id: "sample-1",
      tripId: "sample-jeju",
      tripName: "제주도 3박 4일 여행",
      requesterName: "김나은",
      permission: "editor",
      status: "pending",
      requestedAt: new Date(now - 5 * 60_000).toISOString(),
    },
    {
      id: "sample-2",
      tripId: "sample-busan",
      tripName: "부산 주말 여행",
      requesterName: "박지민",
      permission: "viewer",
      status: "pending",
      requestedAt: new Date(now - 20 * 60_000).toISOString(),
    },
    {
      id: "sample-3",
      tripId: "sample-jeju",
      tripName: "제주도 3박 4일 여행",
      requesterName: "이서연",
      permission: "editor",
      status: "approved",
      requestedAt: new Date(now - 2 * 86_400_000).toISOString(),
      decidedAt: new Date(now - 86_400_000).toISOString(),
    },
    {
      id: "sample-4",
      tripId: "sample-gangneung",
      tripName: "강릉 여름 여행",
      requesterName: "최민수",
      permission: "viewer",
      status: "rejected",
      requestedAt: new Date(now - 2 * 86_400_000).toISOString(),
      decidedAt: new Date(now - 86_400_000).toISOString(),
    },
  ];
}

export default function NotificationPreview() {
  const [items, setItems] = useState<NotificationItem[]>(
    createNotificationSamples,
  );

  const handleDecision = (
    item: NotificationItem,
    status: "approved" | "rejected",
  ) => {
    const decidedAt = new Date().toISOString();

    setItems((previous) =>
      previous.map((entry) =>
        entry.id === item.id ? { ...entry, status, decidedAt } : entry,
      ),
    );
  };

  // return <Notification items={items} onDecision={handleDecision} />;
  return <NotificationPage items={items} onDecision={handleDecision} />;
}
