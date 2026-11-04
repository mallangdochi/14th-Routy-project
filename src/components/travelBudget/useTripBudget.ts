import { useEffect, useState } from "react";
import { getTripBudget, type BudgetSnapshot } from "../../api/tripBudget";
import { getTripMembers } from "../../api/tripSharing";
import { getTripDays } from "../../api/tripDays";
import { calendarTripDays, type BudgetMember } from "./budgetData";
import defaultAvatar1 from "../../assets/profileAvatars/P1.webp";
import defaultAvatar2 from "../../assets/profileAvatars/P2.webp";
import defaultAvatar3 from "../../assets/profileAvatars/P3.webp";

const FALLBACK_AVATARS = [defaultAvatar1, defaultAvatar2, defaultAvatar3];

function mapMember(member: { userId: string; nickname: string; permission: "owner" | "editor" | "viewer" }, index: number): BudgetMember {
  const value = member as unknown as Record<string, unknown>;
  const image = [value.avatarUrl, value.profileImageUrl, value.imageUrl, value.avatar].find(
    (item): item is string => typeof item === "string" && /^https?:\/\//.test(item),
  );
  return {
    userId: member.userId,
    nickname: member.nickname,
    permission: member.permission,
    image: image ?? FALLBACK_AVATARS[index % FALLBACK_AVATARS.length],
  };
}

/** 두 화면 모두 실제 trips/참여자/여행일자를 서버에서 가져옵니다. */
export function useTripBudget(tripId: string) {
  const [snapshot, setSnapshot] = useState<BudgetSnapshot | null>(null);
  const [members, setMembers] = useState<BudgetMember[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [membersError, setMembersError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    void Promise.allSettled([
      getTripBudget(tripId, controller.signal),
      getTripMembers(tripId, controller.signal).then((value) => value.participants.map(mapMember)),
      getTripDays(tripId, controller.signal).then((value) => value.dates),
    ]).then(([budgetResult, membersResult, daysResult]) => {
      if (controller.signal.aborted) return;
      if (budgetResult.status === "rejected") {
        setError(budgetResult.reason instanceof Error ? budgetResult.reason.message : "가계부 조회에 실패했습니다.");
      } else {
        setSnapshot(budgetResult.value);
        setDates(daysResult.status === "fulfilled" && daysResult.value.length > 0
          ? [...new Set(daysResult.value)].sort()
          : calendarTripDays(budgetResult.value.trip.startDate, budgetResult.value.trip.endDate));
      }
      if (membersResult.status === "fulfilled") setMembers(membersResult.value);
      else setMembersError("참여자를 불러오지 못했습니다. 참여자 관리 기능을 확인해주세요.");
      setLoading(false);
    });
    return () => controller.abort();
  }, [tripId]);
  return { snapshot, setSnapshot, members, dates, loading, error, membersError };
}
