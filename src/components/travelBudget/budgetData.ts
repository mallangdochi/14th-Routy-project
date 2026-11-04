export type Category = "교통" | "숙소" | "식비" | "카페" | "관광" | "기타";
/** 결제자는 닉네임이 아니라 인증 사용자 UUID로 식별합니다. */
export type Member = string;
export type Expense = {
  id: string;
  title: string;
  date: string;
  amount: number;
  category: Category;
  payer: Member;
  payerName: string;
};
export const BUDGET_CATEGORIES: Category[] = ["숙소", "교통", "식비", "카페", "관광", "기타"];
export const BUDGET_COLORS: Record<Category, string> = {
  숙소: "#a599f5",
  교통: "#4dcca1",
  식비: "#ffa0be",
  카페: "#ffb044",
  관광: "#69b9f5",
  기타: "#92a8ae",
};
export const WON = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;
export type BudgetMember = {
  userId: string;
  nickname: string;
  image: string | null;
  permission: "owner" | "editor" | "viewer";
};
const dateValue = (value: string) => new Date(`${value}T12:00:00`);
export const addDays = (start: string, days: number) => {
  const date = dateValue(start);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
export function calendarTripDays(start: string, end: string): string[] {
  const valid = /^\d{4}-\d{2}-\d{2}$/;
  if (!valid.test(start) || !valid.test(end) || end < start) return [];
  const span = Math.min(365, Math.round((dateValue(end).getTime() - dateValue(start).getTime()) / 86400000) + 1);
  return Array.from({ length: span }, (_, index) => addDays(start, index));
}
