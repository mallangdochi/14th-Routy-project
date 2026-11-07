import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { FormEvent } from "react";
import {
  BarChart3,
  CheckCircle,
  ChevronRight,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Dropdown from "../dropdown/Dropdown";
import DatePicker from "../pickers/DatePicker";
import { TravelBudgetTabStyle } from "./TravelBudgetTabStyle";
import { useTripBudget } from "./useTripBudget";
import {
  setTripBudget,
  addTripExpense,
  editTripExpense,
  removeTripExpense,
  restoreTripExpense,
} from "../../api/tripBudget";

import {
  type Category,
  type Member,
  type Expense,
  calendarTripDays,
} from "./budgetData";
import Loader from "../loader/Loader";
type DayKey = string;
type ExpenseForm = Omit<Expense, "id">;
type Group = {
  key: DayKey;
  label: string;
  dateLabel: string;
  defaultDate: string;
};

const CATEGORIES: Category[] = ["교통", "숙소", "식비", "카페", "관광", "기타"];
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;
const toDate = (value: string) => new Date(`${value}T12:00:00`);
const addDays = (value: string, days: number) => {
  const date = toDate(value);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const shortDate = (date: string) => {
  const [, month, day] = date.split("-").map(Number);
  return `${month}.${String(day).padStart(2, "0")}`;
};

function buildGroups(
  travelDates: string[],
  startDate: string,
  endDate: string,
): Group[] {
  const dates = travelDates.length
    ? travelDates
    : calendarTripDays(startDate, endDate);
  const days = dates.map((date, index) => ({
    key: `day${index + 1}`,
    label: `Day ${index + 1}`,
    dateLabel: `${shortDate(date)} (${WEEKDAYS[toDate(date).getDay()]})`,
    defaultDate: date,
  }));
  return [
    {
      key: "prepare",
      label: "여행 준비",
      dateLabel: "",
      defaultDate: addDays(startDate, -1),
    },
    ...days,
    {
      key: "after",
      label: "기타 날짜",
      dateLabel: "",
      defaultDate: addDays(endDate, 1),
    },
  ];
}

const EMPTY_EXPENSES: Expense[] = [];

/** 기존 여행 상세 화면의 '예산' 탭 내부에만 렌더링합니다. 사이드바/상단 헤더/하단바를 중복 생성하지 않습니다. */
export default function TravelBudgetTab(
  _props: {
    onRequestBudgetEdit?: () => void;
  } = {},
) {
  void _props;
  const params = useParams<{ tripId?: string; id?: string }>();
  const tripId = params.tripId ?? params.id ?? "";
  return <BudgetContents key={tripId} tripId={tripId} />;
}

function BudgetContents({ tripId }: { tripId: string }) {
  const navigate = useNavigate();
  const {
    snapshot,
    setSnapshot,
    members,
    dates,
    loading,
    error,
    membersError,
  } = useTripBudget(tripId);
  const trip = snapshot?.trip;
  const startDate = trip?.startDate ?? "1970-01-01";
  const endDate = trip?.endDate ?? startDate;
  const expenses = snapshot?.expenses ?? EMPTY_EXPENSES;
  const budget = trip?.budget ?? null;
  const canEdit = !!snapshot && snapshot.permission !== "viewer";
  const [saving, setSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const busyRef = useRef(false);
  const groups = useMemo(
    () => buildGroups(dates, startDate, endDate),
    [dates, startDate, endDate],
  );
  const groupForDate = (date: string): DayKey => {
    const index = groups.findIndex(
      (item) => item.defaultDate === date && item.key.startsWith("day"),
    );
    if (index !== -1) return groups[index].key;
    return date < startDate ? "prepare" : "after";
  };
  const [filter, setFilter] = useState<string>("all");
  // Undefined means automatic: open today's travel day or a group with expenses.
  // Explicit toggles remain under the user's control.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [budgetDialogMounted, setBudgetDialogMounted] = useState(false);
  const [budgetInput, setBudgetInput] = useState("0");
  const normalizeBudget = (value: unknown): number => {
    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0 ? Math.floor(amount) : 0;
  };
  const budgetTriggerRef = useRef<HTMLButtonElement>(null);
  const openBudgetDialog = () => {
    setDialogError("");
    setBudgetInput(String(normalizeBudget(budget)));
    setBudgetDialogMounted(true);
    setBudgetDialogOpen(true);
  };
  const closeBudgetDialog = () => setBudgetDialogOpen(false);
  const saveBudget = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = normalizeBudget(budgetInput);
    if (
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      !canEdit ||
      busyRef.current
    )
      return;
    busyRef.current = true;
    setSaving(true);
    try {
      setSnapshot(await setTripBudget(tripId, amount));
      closeBudgetDialog();
      setNotice("예산을 저장했어요.");
    } catch (cause) {
      setDialogError(
        cause instanceof Error ? cause.message : "예산 저장에 실패했습니다.",
      );
    } finally {
      busyRef.current = false;
      setSaving(false);
    }
  };
  useEffect(() => {
    if (budgetDialogOpen || !budgetDialogMounted) return;
    const timer = window.setTimeout(() => {
      setBudgetDialogMounted(false);
      budgetTriggerRef.current?.focus({ preventScroll: true });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [budgetDialogOpen, budgetDialogMounted]);
  useEffect(() => {
    if (!budgetDialogOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setBudgetDialogOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [budgetDialogOpen]);
  const today = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  })();
  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );
  const renderBudgetStatus = () => (
    <section className="budget-status" aria-label="설정 예산 현황">
      <header>
        <strong>예산 현황</strong>
        <button
          ref={budgetTriggerRef}
          type="button"
          onClick={openBudgetDialog}
          disabled={!canEdit || saving}
        >
          {budget === null ? "예산 설정" : "예산 변경"}
        </button>
      </header>
      {budget === null ? (
        <p>설정된 예산이 없어요.</p>
      ) : (
        <>
          <div className="budget-status-line">
            <span>전체 예산</span>
            <b>{formatWon(budget)}</b>
          </div>
          <div className="budget-status-line">
            <span>{budget < total ? "초과 금액" : "남은 금액"}</span>
            <b>{formatWon(Math.abs(budget - total))}</b>
          </div>
          <div
            className="budget-status-track"
            role="progressbar"
            aria-label="예산 사용률"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              budget > 0 ? Math.min(100, (total / budget) * 100) : 0
            }
          >
            <div
              style={{
                width: `${budget > 0 ? Math.min(100, (total / budget) * 100) : 0}%`,
              }}
            />
          </div>
          <div className="budget-status-line">
            <span>예산 사용률</span>
            <span>{(budget > 0 ? (total / budget) * 100 : 0).toFixed(1)}%</span>
          </div>
        </>
      )}
    </section>
  );
  const [form, setForm] = useState<ExpenseForm>({
    title: "",
    date: "",
    amount: 0,
    category: "" as Category,
    payer: "" as Member,
    payerName: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);
  const closeModal = () => {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
    setModalOpen(false);
  };
  useEffect(() => {
    if (modalOpen || !modalMounted) return;
    const timer = window.setTimeout(() => setModalMounted(false), 300);
    return () => window.clearTimeout(timer);
  }, [modalOpen, modalMounted]);
  useEffect(() => {
    if (!modalMounted) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [modalMounted]);
  const statsPath = `/trip-schedule/${encodeURIComponent(tripId)}/budget/stats`;
  const goToStats = () => navigate(statsPath);
  const [notice, setNotice] = useState("");
  const [deleteToast, setDeleteToast] = useState<{
    expense: Expense;
    index: number;
  } | null>(null);
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const pointerStart = useRef<{
    x: number;
    y: number;
    id: string;
    initial: number;
    horizontal: boolean;
  } | null>(null);
  const [drag, setDrag] = useState<{ id: string; offset: number } | null>(null);
  const SWIPE_WIDTH = 84;
  const onSwipeStart = (
    id: string,
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType === "mouse" || !event.isPrimary) return;
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      id,
      initial: swipedId === id ? -SWIPE_WIDTH : 0,
      horizontal: false,
    };
    setDrag(null);
  };
  const onSwipeMove = (
    id: string,
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const start = pointerStart.current;
    if (!start || start.id !== id) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.horizontal) {
      if (Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx)) {
        pointerStart.current = null;
        return;
      }
      if (Math.abs(dx) < 7 || Math.abs(dx) <= Math.abs(dy)) return;
      start.horizontal = true;
    }
    setDrag({
      id,
      offset: Math.max(-SWIPE_WIDTH, Math.min(0, start.initial + dx)),
    });
  };
  const onSwipeEnd = (
    id: string,
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const start = pointerStart.current;
    if (!start || start.id !== id) return;
    if (start.horizontal) {
      const offset = Math.max(
        -SWIPE_WIDTH,
        Math.min(0, start.initial + event.clientX - start.x),
      );
      setSwipedId(offset < -SWIPE_WIDTH / 2 ? id : null);
    }
    pointerStart.current = null;
    setDrag(null);
  };
  const cancelSwipe = () => {
    pointerStart.current = null;
    setDrag(null);
  };
  useEffect(() => {
    if (!deleteToast) return;
    const timer = window.setTimeout(() => setDeleteToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [deleteToast]);

  const visibleGroups = groups.filter(
    (group) =>
      (filter === "all" || filter === group.key) &&
      expenses.some((expense) => groupForDate(expense.date) === group.key),
  );

  useEffect(() => {
    if (!modalOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [modalOpen]);

  const openNew = () => {
    setDialogError("");
    setForm({
      title: "",
      date: "",
      amount: 0,
      category: "" as Category,
      payer: "" as Member,
      payerName: "",
    });
    setEditingId(null);
    setModalMounted(true);
    setModalOpen(true);
  };
  const openEdit = (expense: Expense) => {
    setDialogError("");
    setEditingId(expense.id);
    setModalMounted(true);
    setForm({
      title: expense.title,
      date: expense.date,
      amount: expense.amount,
      category: expense.category,
      payer: expense.payer,
      payerName: expense.payerName,
    });
    setModalOpen(true);
  };
  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEdit || busyRef.current) return;
    const member = members.find((item) => item.userId === form.payer);
    const normalized: ExpenseForm = {
      title: form.title.trim(),
      date: form.date,
      amount: Math.floor(Number(form.amount)),
      category: form.category,
      payer: form.payer,
      payerName: member?.nickname ?? form.payerName,
    };
    if (
      !normalized.title ||
      !normalized.date ||
      !normalized.category ||
      !member ||
      !Number.isSafeInteger(normalized.amount) ||
      normalized.amount <= 0
    ) {
      setDialogError("지출 내용과 결제자를 확인해주세요.");
      return;
    }
    busyRef.current = true;
    setSaving(true);
    try {
      const updated = editingId
        ? await editTripExpense(tripId, editingId, normalized)
        : await addTripExpense(tripId, normalized);
      setSnapshot(updated);
      setExpanded((current) => ({
        ...current,
        [groupForDate(normalized.date)]: true,
      }));
      setFilter("all");
      closeModal();
      setNotice(
        editingId ? "지출 내역을 수정했어요." : "지출 내역을 추가했어요.",
      );
    } catch (cause) {
      setDialogError(
        cause instanceof Error ? cause.message : "지출 저장에 실패했습니다.",
      );
    } finally {
      busyRef.current = false;
      setSaving(false);
    }
  };
  const deleteExpense = async (id: string) => {
    if (!canEdit || busyRef.current) return;
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index < 0) return;
    busyRef.current = true;
    setSaving(true);
    try {
      const updated = await removeTripExpense(tripId, id);
      setSnapshot(updated);
      setDeleteToast({ expense: expenses[index], index });
      setSwipedId(null);
      setNotice("");
    } catch (cause) {
      setNotice(
        cause instanceof Error ? cause.message : "지출 삭제에 실패했습니다.",
      );
    } finally {
      busyRef.current = false;
      setSaving(false);
    }
  };
  const undoDelete = async () => {
    if (!deleteToast || !canEdit || busyRef.current) return;
    busyRef.current = true;
    setSaving(true);
    try {
      setSnapshot(await restoreTripExpense(tripId, deleteToast.expense));
      setDeleteToast(null);
      setNotice("지출 내역을 복원했어요.");
    } catch (cause) {
      setNotice(
        cause instanceof Error ? cause.message : "지출 복원에 실패했습니다.",
      );
    } finally {
      busyRef.current = false;
      setSaving(false);
    }
  };

  if (loading)
    return (
      <TravelBudgetTabStyle>
        {/* <p role="status">가계부 정보를 불러오고 있습니다.</p> */}
        <Loader />
      </TravelBudgetTabStyle>
    );
  if (error || !snapshot)
    return (
      <TravelBudgetTabStyle>
        <p role="alert">{error || "여행 정보를 찾지 못했습니다."}</p>
      </TravelBudgetTabStyle>
    );

  return (
    <TravelBudgetTabStyle>
      {membersError && <p role="alert">{membersError}</p>}
      {deleteToast && (
        <div
          className="budget-delete-toast"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <CheckCircle size={19} aria-hidden="true" />
          <span>
            <span className="toast-desktop-message">
              지출 내역을 삭제했어요.
            </span>
            <span className="toast-mobile-message">지출내역 삭제됨</span>
          </span>
          <button
            type="button"
            className="toast-undo"
            onClick={undoDelete}
            disabled={saving}
          >
            실행취소
          </button>
          <button
            type="button"
            aria-label="삭제 알림 닫기"
            onClick={() => setDeleteToast(null)}
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
      )}
      {expenses.length > 0 && (
        <section className="mobile-spend-summary" aria-label="총 지출">
          <div className="mobile-spend-copy">
            <span>
              <BarChart3 size={16} aria-hidden="true" /> 총 지출
            </span>
            <strong>{formatWon(total)}</strong>
            <small>여행 전체 누적 지출</small>
          </div>
          <button type="button" onClick={goToStats}>
            <BarChart3 size={16} /> 통계 보기 <ChevronRight size={16} />
          </button>
          {renderBudgetStatus()}
        </section>
      )}
      {notice && (
        <div className="budget-notice" role="status">
          <span>{notice}</span>
          <button
            type="button"
            aria-label="알림 닫기"
            onClick={() => setNotice("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      <div className={`budget-grid ${expenses.length === 0 ? "is-empty" : ""}`}>
        <section className="ledger-panel" aria-label="가계부">
          <header className="ledger-toolbar">
            <div className="ledger-tools-left">
              <h2>{expenses.length === 0 ? "여행 가계부" : "가계부"}</h2>
            </div>
            <div className="ledger-tools-right">
              {expenses.length > 0 && (
                <Dropdown
                  className="period-select"
                  label="지출 기간"
                  value={filter}
                  options={[
                    { value: "all", label: "기간 전체" },
                    ...groups.map(({ key, label }) => ({ value: key, label })),
                  ]}
                  onChange={setFilter}
                />
              )}
              {/*  */}
              <button
                type="button"
                className="button-primary add-button"
                onClick={() => openNew()}
                disabled={!canEdit || saving || members.length === 0}
              >
                <Plus size={20} />{" "}
                <span>
                  {expenses.length === 0 ? "가계부 추가" : "비용 추가"}
                </span>
              </button>
            </div>
          </header>
          {expenses.length > 0 ? (
            <div className="expense-groups">
              {visibleGroups.map((group) => {
                const groupExpenses = expenses
                  .filter((expense) => groupForDate(expense.date) === group.key)
                  .sort((a, b) => a.date.localeCompare(b.date));
                const groupTotal = groupExpenses.reduce(
                  (sum, expense) => sum + expense.amount,
                  0,
                );
                const opened =
                  expanded[group.key] ??
                  (groupExpenses.length > 0 ||
                    (group.key.startsWith("day") &&
                      group.defaultDate === today));
                return (
                  <section
                    className="expense-group"
                    key={group.key}
                    aria-label={group.label}
                  >
                    <header className="group-heading">
                      <button
                        type="button"
                        className="group-toggle"
                        onClick={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [group.key]: !opened,
                          }))
                        }
                        aria-expanded={opened}
                      >
                        <ChevronRight
                          size={17}
                          className={opened ? "chevron opened" : "chevron"}
                        />
                        <strong>{group.label}</strong>
                        <span className="group-date">{group.dateLabel}</span>
                        <small>
                          {groupExpenses.length}건 · {formatWon(groupTotal)}
                        </small>
                      </button>
                    </header>
                    {opened && (
                      <div className="group-entries" data-open="true">
                        {groupExpenses.length === 0 ? (
                          <p className="no-group-expense">
                            등록된 비용이 없어요.
                          </p>
                        ) : (
                          groupExpenses.map((expense) => {
                            const member = members.find(
                              (item) => item.userId === expense.payer,
                            );
                            return (
                              <div
                                className="expense-swipe-shell"
                                key={expense.id}
                              >
                                <button
                                  type="button"
                                  className="swipe-delete"
                                  onClick={() => deleteExpense(expense.id)}
                                  disabled={!canEdit || saving}
                                  aria-label={`${expense.title} 삭제`}
                                >
                                  <Trash2 size={18} /> <span>삭제</span>
                                </button>
                                <div
                                  className={`expense-entry${swipedId === expense.id ? " is-swiped" : ""}${drag?.id === expense.id ? " is-dragging" : ""}`}
                                  style={
                                    {
                                      "--swipe-offset": `${drag !== null && drag.id === expense.id ? drag.offset : swipedId === expense.id ? -SWIPE_WIDTH : 0}px`,
                                    } as React.CSSProperties
                                  }
                                  onPointerDown={(event) =>
                                    onSwipeStart(expense.id, event)
                                  }
                                  onPointerMove={(event) =>
                                    onSwipeMove(expense.id, event)
                                  }
                                  onPointerUp={(event) =>
                                    onSwipeEnd(expense.id, event)
                                  }
                                  onPointerCancel={cancelSwipe}
                                >
                                  <span className="expense-date">
                                    {shortDate(expense.date)}{" "}
                                    <small>
                                      (
                                      {
                                        WEEKDAYS[
                                          new Date(
                                            `${expense.date}T00:00:00`,
                                          ).getDay()
                                        ]
                                      }
                                      )
                                    </small>
                                  </span>
                                  <span
                                    className={`category-pill category-${expense.category}`}
                                  >
                                    {expense.category}
                                  </span>
                                  <button
                                    type="button"
                                    className="expense-name"
                                    onClick={() => openEdit(expense)}
                                    disabled={!canEdit || saving}
                                    title="지출 수정"
                                  >
                                    {expense.title}
                                  </button>
                                  <span className="expense-payer">
                                    {member?.image && (
                                      <img src={member.image} alt="" />
                                    )}
                                    {member?.nickname ?? expense.payerName}
                                  </span>
                                  <strong className="expense-money">
                                    {formatWon(expense.amount)}
                                  </strong>
                                  <div className="entry-actions">
                                    <button
                                      type="button"
                                      onClick={() => deleteExpense(expense.id)}
                                      disabled={!canEdit || saving}
                                      title="삭제"
                                      aria-label={`${expense.title} 삭제`}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="budget-blank-slate" role="status">
              <h3>아직 지출 내역이 없습니다</h3>
              <p>지출을 추가하면 여행 날짜별로 가계부가 정리됩니다.</p>
              <button
                type="button"
                className="button-primary"
                onClick={() => openNew()}
              >
                <Plus size={18} aria-hidden="true" /> 첫 지출 추가
              </button>
            </div>
          )}
        </section>

        {expenses.length > 0 && (
          <aside className="summary-panel" aria-label="예산 현황">
            <div className="summary-card">
              <div className="total-display">
                <span className="summary-label">◆ 총 지출</span>
                <strong>{formatWon(total)}</strong>
                <p>여행 전체 누적 지출</p>
              </div>
              {expenses.length > 0 && (
                <button
                  className="stats-button"
                  type="button"
                  onClick={goToStats}
                >
                  <BarChart3 size={20} /> 지출 통계 및 정산 보기{" "}
                  <ChevronRight size={20} />
                </button>
              )}
              {renderBudgetStatus()}
              <div className="summary-tip">
                <strong>지출 내역을 한눈에 관리하세요</strong>
                <p>
                  상세 그래프, 카테고리별 지출, 멤버별 결제 내역을 확인할 수
                  있어요.
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
      {budgetDialogMounted && (
        <div
          className="budget-dialog-overlay"
          data-open={budgetDialogOpen}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeBudgetDialog();
          }}
        >
          <section
            className="budget-dialog budget-settings-dialog"
            data-open={budgetDialogOpen}
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-settings-title"
          >
            <header>
              <h2 id="budget-settings-title">
                {budget === null ? "예산 설정" : "예산 변경"}
              </h2>
              <button
                type="button"
                aria-label="닫기"
                onClick={closeBudgetDialog}
              >
                <X size={21} />
              </button>
            </header>
            <form onSubmit={saveBudget}>
              <label htmlFor="trip-budget-input">
                여행 전체 예산 (원)
                <div className="budget-settings-input-wrap">
                  <input
                    id="trip-budget-input"
                    autoFocus
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="예: 1,000,000"
                    value={normalizeBudget(budgetInput).toLocaleString("ko-KR")}
                    onChange={(event) =>
                      setBudgetInput(
                        event.target.value.replace(/\D/g, "").slice(0, 12),
                      )
                    }
                  />
                  <span>원</span>
                </div>
              </label>
              <p className="budget-settings-help">
                여행 준비부터 여행 종료까지 사용할 총예산을 입력해주세요.
              </p>
              <div className="budget-settings-quick">
                <strong>빠른 금액 설정</strong>
                <div>
                  {[100000, 500000, 1000000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className="budget-settings-quick-button"
                      onClick={() =>
                        setBudgetInput((previous) =>
                          String(
                            Math.min(
                              999999999999,
                              normalizeBudget(previous) + amount,
                            ),
                          ),
                        )
                      }
                    >
                      {amount / 10000}만원
                    </button>
                  ))}
                </div>
              </div>
              <div className="budget-settings-info">
                <strong>ⓘ 예산 안내</strong>
                <p>
                  예산은 언제든 변경할 수 있으며, 이미 등록된 지출 내역은 그대로
                  유지됩니다.
                </p>
              </div>
              {dialogError && (
                <p className="budget-form-error" role="alert">
                  {dialogError}
                </p>
              )}
              <footer>
                <button
                  type="button"
                  className="button-outline"
                  onClick={closeBudgetDialog}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="button-primary"
                  disabled={
                    saving || !canEdit || normalizeBudget(budgetInput) === 0
                  }
                >
                  {budget === null ? "설정하기" : "변경하기"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
      {modalMounted && (
        <div
          className="budget-dialog-overlay"
          data-open={modalOpen}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="budget-dialog"
            data-open={modalOpen}
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-dialog-title"
          >
            <header>
              <h2 id="expense-dialog-title">
                {editingId ? "비용 수정" : "비용 추가"}
              </h2>
              <button type="button" onClick={closeModal} aria-label="닫기">
                <X size={21} />
              </button>
            </header>
            <form onSubmit={submitForm}>
              <label>
                사용 내역
                <input
                  autoFocus
                  required
                  maxLength={36}
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="예: 점심 식사"
                />
              </label>
              <div className="budget-form-field budget-date-field">
                <DatePicker
                  label="날짜"
                  value={form.date}
                  onChange={(date) => setForm((prev) => ({ ...prev, date }))}
                  placement="bottom"
                />
              </div>
              <div className="form-two-cols">
                <div className="budget-form-field">
                  <span className="budget-field-label">카테고리</span>
                  <Dropdown<Category>
                    label="카테고리"
                    value={form.category}
                    options={[
                      { value: "" as Category, label: "비용 구분 선택" },
                      ...CATEGORIES.map((category) => ({
                        value: category,
                        label: category,
                      })),
                    ]}
                    onChange={(category) =>
                      setForm((prev) => ({ ...prev, category }))
                    }
                    className="budget-form-dropdown"
                  />
                </div>
                <div className="budget-form-field">
                  <span className="budget-field-label">결제한 사람</span>
                  <Dropdown<Member>
                    label="결제한 사람"
                    value={form.payer}
                    options={[
                      { value: "" as Member, label: "결제인 선택" },
                      ...members.map((member) => ({
                        value: member.userId,
                        label: member.nickname,
                      })),
                    ]}
                    onChange={(payer) =>
                      setForm((prev) => ({ ...prev, payer }))
                    }
                    className="budget-form-dropdown"
                  />
                </div>
              </div>
              <label
                className="budget-amount-field"
                htmlFor="budget-amount-input"
              >
                금액 (원)
                <input
                  id="budget-amount-input"
                  className="budget-amount-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  value={form.amount ? form.amount.toLocaleString("ko-KR") : ""}
                  onChange={(event) => {
                    const digits = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 9);
                    setForm((prev) => ({
                      ...prev,
                      amount: Number(digits) || 0,
                    }));
                  }}
                  placeholder="금액 입력"
                />
              </label>
              {dialogError && (
                <p className="budget-form-error" role="alert">
                  {dialogError}
                </p>
              )}
              <footer>
                <button
                  type="button"
                  className="button-outline"
                  onClick={(event) => {
                    event.preventDefault();
                    closeModal();
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="button-primary"
                  disabled={!canEdit || saving || members.length === 0}
                >
                  {editingId ? "수정하기" : "추가하기"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </TravelBudgetTabStyle>
  );
}
