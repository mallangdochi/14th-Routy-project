export type Category = "교통" | "숙소" | "식비" | "카페" | "관광" | "기타";
export type Member = "김민수" | "이지은" | "박서연";
export type Expense = {
  id: string;
  title: string;
  date: string;
  amount: number;
  category: Category;
  payer: Member;
};
export const BUDGET_CATEGORIES: Category[] = [
  "숙소",
  "교통",
  "식비",
  "카페",
  "관광",
  "기타",
];
export const BUDGET_COLORS: Record<Category, string> = {
  숙소: "#a599f5",
  교통: "#4dcca1",
  식비: "#ffa0be",
  카페: "#ffb044",
  관광: "#69b9f5",
  기타: "#92a8ae",
};
export const WON = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;
const addDays = (start: string, days: number) => {
  const date = new Date(`${start}T12:00:00`);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
export function demoBudgetExpenses(start: string): Expense[] {
  return [
    {
      id: "demo-1",
      title: "렌터카 예약",
      date: addDays(start, -6),
      amount: 120000,
      category: "교통",
      payer: "김민수",
    },
    {
      id: "demo-2",
      title: "숙소 예약",
      date: addDays(start, -4),
      amount: 180000,
      category: "숙소",
      payer: "이지은",
    },
    {
      id: "demo-3",
      title: "점심 식사",
      date: start,
      amount: 54000,
      category: "식비",
      payer: "박서연",
    },
    {
      id: "demo-4",
      title: "카페",
      date: start,
      amount: 18000,
      category: "카페",
      payer: "김민수",
    },
  ];
}
export function loadBudgetExpenses(tripId: string, start: string): Expense[] {
  try {
    const stored = window.localStorage.getItem(`routy-budget-${tripId}`);
    if (stored !== null) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed as Expense[];
    }
  } catch {
    /* 브라우저 저장 공간을 사용할 수 없으면 미리보기 데이터를 보여 줍니다. */
  }
  return tripId === "1" ? demoBudgetExpenses(start) : [];
}
export function loadTripBudget(tripId: string): number {
  try {
    const value = Number(
      window.localStorage.getItem(`routy-total-budget-${tripId}`),
    );
    if (Number.isFinite(value) && value > 0) return value;
  } catch {
    /* use default */
  }
  return 600000;
}
