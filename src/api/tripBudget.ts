import type { Expense } from "../components/travelBudget/budgetData";

export type BudgetPermission = "owner" | "editor" | "viewer";
export type BudgetTrip = {
  id: string;
  name: string;
  region: string;
  startDate: string;
  endDate: string;
  budget: number | null;
};
export type BudgetSnapshot = {
  trip: BudgetTrip;
  permission: BudgetPermission;
  expenses: Expense[];
};
export type ExpenseInput = Pick<
  Expense,
  "title" | "date" | "amount" | "category" | "payer" | "payerName"
>;

async function request(
  tripId: string,
  action?: "budget" | "create" | "update" | "delete" | "restore",
  payload: Record<string, unknown> = {},
  signal?: AbortSignal,
): Promise<BudgetSnapshot> {
  const response = await fetch(
    action
      ? "/api/trips/budget"
      : `/api/trips/budget?tripId=${encodeURIComponent(tripId)}`,
    {
      method: action ? "POST" : "GET",
      credentials: "include",
      cache: "no-store",
      signal,
      ...(action
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tripId, action, ...payload }),
          }
        : {}),
    },
  );
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      result &&
      typeof result === "object" &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : "가계부 데이터를 처리하지 못했습니다.";
    throw new Error(message);
  }
  if (
    !result ||
    typeof result !== "object" ||
    !("trip" in result) ||
    !("expenses" in result) ||
    !("permission" in result)
  )
    throw new Error("가계부 서버 응답이 올바르지 않습니다.");
  const data = result as BudgetSnapshot;
  if (
    !data.trip ||
    data.trip.id !== tripId ||
    !Array.isArray(data.expenses) ||
    !["owner", "editor", "viewer"].includes(data.permission)
  )
    throw new Error("가계부 서버 응답을 확인해주세요.");
  return data;
}
export const getTripBudget = (tripId: string, signal?: AbortSignal) =>
  request(tripId, undefined, {}, signal);
export const setTripBudget = (tripId: string, budget: number) =>
  request(tripId, "budget", { budget });
export const addTripExpense = (tripId: string, expense: ExpenseInput) =>
  request(tripId, "create", {
    title: expense.title,
    date: expense.date,
    amount: expense.amount,
    category: expense.category,
    payerId: expense.payer,
    payerName: expense.payerName,
  });
export const editTripExpense = (
  tripId: string,
  id: string,
  expense: ExpenseInput,
) =>
  request(tripId, "update", {
    id,
    title: expense.title,
    date: expense.date,
    amount: expense.amount,
    category: expense.category,
    payerId: expense.payer,
    payerName: expense.payerName,
  });
export const removeTripExpense = (tripId: string, id: string) =>
  request(tripId, "delete", { id });
export const restoreTripExpense = (tripId: string, expense: Expense) =>
  request(tripId, "restore", {
    id: expense.id,
    title: expense.title,
    date: expense.date,
    amount: expense.amount,
    category: expense.category,
    payerId: expense.payer,
    payerName: expense.payerName,
  });
