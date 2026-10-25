import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { trips } from "../../data/trips";
import type { FormEvent } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Utensils,
  Wallet,
  X,
} from "lucide-react";
import budgetMascot from "../../assets/budgetMascot.png";
import memberOne from "../../assets/profileAvatars/P1.webp";
import memberTwo from "../../assets/profileAvatars/P2.webp";
import memberThree from "../../assets/profileAvatars/P3.webp";
import { TravelBudgetTabStyle } from "./TravelBudgetTabStyle";

import {
  type Category,
  type Member,
  type Expense,
  loadBudgetExpenses,
} from "./budgetData";
type DayKey = string;
type ExpenseForm = Omit<Expense, "id">;
type Group = {
  key: DayKey;
  label: string;
  dateLabel: string;
  defaultDate: string;
};

const MEMBERS: { name: Member; image: string }[] = [
  { name: "김민수", image: memberOne },
  { name: "이지은", image: memberTwo },
  { name: "박서연", image: memberThree },
];
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
const createKey = () =>
  `expense-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function buildGroups(startDate: string, endDate: string): Group[] {
  const length = Math.max(
    1,
    Math.min(
      90,
      Math.round(
        (toDate(endDate).getTime() - toDate(startDate).getTime()) / 86400000,
      ) + 1,
    ),
  );
  const days = Array.from({ length }, (_, index) => {
    const date = addDays(startDate, index);
    return {
      key: `day${index + 1}`,
      label: `Day ${index + 1}`,
      dateLabel: `${shortDate(date)} (${WEEKDAYS[toDate(date).getDay()]})`,
      defaultDate: date,
    };
  });
  return [
    {
      key: "prepare",
      label: "여행 준비",
      dateLabel: "",
      defaultDate: addDays(startDate, -6),
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

/** 기존 여행 상세 화면의 '예산' 탭 내부에만 렌더링합니다. 사이드바/상단 헤더/하단바를 중복 생성하지 않습니다. */
export default function TravelBudgetTab() {
  const params = useParams<{ tripId?: string; id?: string }>();
  const tripId = params.tripId ?? params.id ?? "1";
  const selectedTrip = trips.find((trip) => trip.id === tripId);
  const startDate = selectedTrip?.startDate ?? "2026-10-16";
  const endDate = selectedTrip?.endDate ?? "2026-10-18";
  return (
    <BudgetContents
      key={tripId}
      tripId={tripId}
      startDate={startDate}
      endDate={endDate}
    />
  );
}

function BudgetContents({
  tripId,
  startDate,
  endDate,
}: {
  tripId: string;
  startDate: string;
  endDate: string;
}) {
  const navigate = useNavigate();
  const storageKey = `routy-budget-${tripId}`;
  const groups = useMemo(
    () => buildGroups(startDate, endDate),
    [startDate, endDate],
  );
  const groupForDate = (date: string): DayKey => {
    if (date < startDate) return "prepare";
    if (date > endDate) return "after";
    const index = Math.round(
      (toDate(date).getTime() - toDate(startDate).getTime()) / 86400000,
    );
    return `day${index + 1}`;
  };
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    loadBudgetExpenses(tripId, startDate),
  );
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    prepare: true,
    day1: true,
  });
  const [form, setForm] = useState<ExpenseForm>({
    title: "",
    date: startDate,
    amount: 0,
    category: "식비",
    payer: "김민수",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [periodMounted, setPeriodMounted] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);
  const statsPath = `/trip-schedule/${encodeURIComponent(tripId)}/budget/stats`;
  const goToStats = () => navigate(statsPath);
  const openPeriod = () => {
    setPeriodMounted(true);
    setPeriodOpen(true);
  };
  const closePeriod = () => setPeriodOpen(false);
  const [notice, setNotice] = useState("");

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );
  const visibleGroups = groups.filter(
    (group) => filter === "all" || filter === group.key,
  );

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (!periodRef.current?.contains(event.target as Node)) closePeriod();
    };
    const esc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePeriod();
    };
    document.addEventListener("pointerdown", clickOutside);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", clickOutside);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  // 브라우저 저장용 샘플 데이터. 서버나 팀원들과 동기화하지 않습니다.
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(expenses));
    } catch {
      /* 저장소 접근이 불가능한 경우 */
    }
  }, [expenses, storageKey]);

  useEffect(() => {
    if (!modalOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [modalOpen]);

  const openNew = (date = startDate) => {
    setForm({ title: "", date, amount: 0, category: "식비", payer: "김민수" });
    setEditingId(null);
    setModalOpen(true);
  };
  const openEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      date: expense.date,
      amount: expense.amount,
      category: expense.category,
      payer: expense.payer,
    });
    setModalOpen(true);
  };
  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized: ExpenseForm = {
      title: form.title.trim(),
      date: form.date,
      amount: Math.floor(Number(form.amount)),
      category: form.category,
      payer: form.payer,
    };
    if (
      !normalized.title ||
      !Number.isFinite(normalized.amount) ||
      normalized.amount <= 0
    )
      return;
    if (editingId) {
      setExpenses((current) =>
        current.map((expense) =>
          expense.id === editingId ? { ...normalized, id: editingId } : expense,
        ),
      );
    } else {
      setExpenses((current) => [
        ...current,
        { ...normalized, id: createKey() },
      ]);
    }
    setExpanded((current) => ({
      ...current,
      [groupForDate(normalized.date)]: true,
    }));
    setFilter("all");
    setModalOpen(false);
    setNotice(
      editingId ? "지출 내역을 수정했어요." : "지출 내역을 추가했어요.",
    );
  };
  const deleteExpense = (id: string) => {
    if (!window.confirm("이 지출 내역을 삭제할까요?")) return;
    setExpenses((current) => current.filter((expense) => expense.id !== id));
    setNotice("지출 내역을 삭제했어요.");
  };

  return (
    <TravelBudgetTabStyle>
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
              {expenses.length > 0 && (
                <div className="period-select" ref={periodRef}>
                  <button
                    type="button"
                    className="period-trigger"
                    aria-haspopup="listbox"
                    aria-expanded={periodOpen}
                    onClick={() => (periodOpen ? closePeriod() : openPeriod())}
                  >
                    {filter === "all"
                      ? "기간 전체"
                      : (groups.find((group) => group.key === filter)?.label ??
                        "기간 전체")}
                    <ChevronDown
                      size={16}
                      className={
                        periodOpen ? "period-chevron open" : "period-chevron"
                      }
                      aria-hidden="true"
                    />
                  </button>
                  {periodMounted && (
                    <div
                      className="period-menu"
                      role="listbox"
                      aria-label="기간 선택"
                      data-open={String(periodOpen)}
                      onAnimationEnd={() => {
                        if (!periodOpen) setPeriodMounted(false);
                      }}
                    >
                      {[{ key: "all", label: "기간 전체" }, ...groups].map(
                        (item) => (
                          <button
                            type="button"
                            role="option"
                            aria-selected={filter === item.key}
                            key={item.key}
                            onClick={() => {
                              setFilter(item.key);
                              closePeriod();
                            }}
                          >
                            {item.label}
                            {filter === item.key && (
                              <CheckCheck size={14} aria-hidden="true" />
                            )}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="ledger-tools-right">
              {expenses.length === 0 && (
                <button
                  type="button"
                  className="button-outline edit-button"
                  onClick={() => openNew()}
                >
                  <Pencil size={17} /> 편집
                </button>
              )}
              <button
                type="button"
                className="button-primary add-button"
                onClick={() => openNew()}
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
                const opened = expanded[group.key] ?? false;
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
                            [group.key]: !prev[group.key],
                          }))
                        }
                        aria-expanded={opened}
                      >
                        <ChevronRight
                          size={17}
                          className={opened ? "chevron opened" : "chevron"}
                        />
                        {group.key === "prepare" ? (
                          <Wallet className="group-symbol" size={18} />
                        ) : group.key === "day1" ? (
                          <Utensils className="group-symbol" size={18} />
                        ) : null}
                        <strong>{group.label}</strong>
                        <span className="group-date">{group.dateLabel}</span>
                        <small>
                          {groupExpenses.length}건 · {formatWon(groupTotal)}
                        </small>
                      </button>
                      <button
                        type="button"
                        className="group-add"
                        onClick={() => openNew(group.defaultDate)}
                      >
                        <Plus size={14} /> 비용 추가
                      </button>
                    </header>
                    {opened && (
                      <div className="group-entries">
                        {groupExpenses.length === 0 ? (
                          <p className="no-group-expense">
                            등록된 비용이 없어요.
                          </p>
                        ) : (
                          groupExpenses.map((expense) => {
                            const member = MEMBERS.find(
                              (item) => item.name === expense.payer,
                            );
                            return (
                              <div className="expense-entry" key={expense.id}>
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
                                  title="지출 수정"
                                >
                                  {expense.title}
                                </button>
                                <span className="expense-payer">
                                  {member && <img src={member.image} alt="" />}
                                  {expense.payer}
                                </span>
                                <strong className="expense-money">
                                  {formatWon(expense.amount)}
                                </strong>
                                <div className="entry-actions">
                                  <button
                                    type="button"
                                    onClick={() => openEdit(expense)}
                                    title="수정"
                                    aria-label={`${expense.title} 수정`}
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteExpense(expense.id)}
                                    title="삭제"
                                    aria-label={`${expense.title} 삭제`}
                                  >
                                    <Trash2 size={14} />
                                  </button>
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
            <div className="empty-ledger">
              <img src={budgetMascot} alt="계산기를 들고 있는 라우티 캐릭터" />
              <h3>아직 등록된 지출이 없어요</h3>
              <p>
                여행 중 사용한 비용을 기록하고
                <br />
                함께 예산을 관리해보세요.
              </p>
            </div>
          )}
        </section>

        <aside className="summary-panel" aria-label="예산 현황">
          <div className="summary-card">
            {expenses.length > 0 ? (
              <div className="total-display">
                <span className="summary-label">◆ 총 지출</span>
                <strong>{formatWon(total)}</strong>
                <p>여행 전체 누적 지출</p>
              </div>
            ) : (
              <div className="empty-total">
                <h2>예산 현황</h2>
                <p>
                  총 지출 <strong>0</strong> 원
                </p>
                <div className="empty-progress" aria-hidden="true" />
              </div>
            )}
            {expenses.length > 0 && (
              <button
                className="stats-button"
                type="button"
                onClick={goToStats}
              >
                <BarChart3 size={20} /> 지출 통계 및 정산 보기{" "}
                <ArrowRight size={18} />
              </button>
            )}
            <div className="summary-tip">
              {expenses.length === 0 ? (
                <>
                  <Wallet size={49} strokeWidth={1.9} aria-hidden="true" />
                  <p>
                    지출을 추가하면
                    <br />
                    예산 현황을 확인할 수 있어요.
                  </p>
                </>
              ) : (
                <>
                  <strong>지출 내역을 한눈에 관리하세요</strong>
                  <p>
                    상세 그래프, 카테고리별 지출, 멤버별 결제 내역을 확인할 수
                    있어요.
                  </p>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
      {modalOpen && (
        <div
          className="budget-dialog-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <section
            className="budget-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-dialog-title"
          >
            <header>
              <h2 id="expense-dialog-title">
                {editingId ? "비용 수정" : "비용 추가"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="닫기"
              >
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
              <label>
                날짜
                <input
                  type="date"
                  required
                  min={addDays(startDate, -365)}
                  max={addDays(endDate, 365)}
                  value={form.date}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, date: event.target.value }))
                  }
                />
              </label>
              <div className="form-two-cols">
                <label>
                  카테고리
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        category: event.target.value as Category,
                      }))
                    }
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label>
                  결제한 사람
                  <select
                    value={form.payer}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        payer: event.target.value as Member,
                      }))
                    }
                  >
                    {MEMBERS.map((member) => (
                      <option key={member.name}>{member.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                금액 (원)
                <input
                  type="number"
                  min="1"
                  max="999999999"
                  step="1"
                  required
                  value={form.amount || ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      amount: Number(event.target.value),
                    }))
                  }
                  placeholder="금액 입력"
                />
              </label>
              <footer>
                <button
                  type="button"
                  className="button-outline"
                  onClick={() => setModalOpen(false)}
                >
                  취소
                </button>
                <button type="submit" className="button-primary">
                  <CheckCheck size={17} /> {editingId ? "수정하기" : "추가하기"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </TravelBudgetTabStyle>
  );
}
