import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Check,
  Crown,
  Pencil,
  PieChart,
  ReceiptText,
  Users,
  Wallet,
  X,
} from "lucide-react";
import MainSidebar from "../MainSidebar/MainSidebar";
import MobileHeader from "../mobileBanner/MobileHeader";
import MobileNav from "../mobileBanner/MobileFooter";
import { trips } from "../../data/trips";
import p1 from "../../assets/profileAvatars/P1.webp";
import p2 from "../../assets/profileAvatars/P2.webp";
import p3 from "../../assets/profileAvatars/P3.webp";
import {
  BUDGET_CATEGORIES,
  BUDGET_COLORS,
  loadBudgetExpenses,
  loadTripBudget,
  WON,
  type Member,
} from "./budgetData";
import { TravelBudgetStatsPageStyle as S } from "./TravelBudgetStatsPageStyle";

const MEMBER_IMAGES: Record<Member, string> = {
  김민수: p1,
  이지은: p2,
  박서연: p3,
};
const CATEGORY_ICON: Record<string, string> = {
  숙소: "🛏️",
  교통: "🚙",
  식비: "🍴",
  카페: "☕",
  관광: "📍",
  기타: "🧾",
};
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const plusDays = (start: string, days: number) => {
  const date = new Date(`${start}T12:00:00`);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const tinyDate = (date: string) => {
  const [, m, d] = date.split("-");
  return `${Number(m)}.${String(d).padStart(2, "0")}`;
};
const percent = (a: number, b: number) => (b ? (a / b) * 100 : 0);

/** 여행 상세 > 예산 > 지출 통계: 같은 여행별 localStorage를 참조합니다. */
export default function TravelBudgetStatsPage() {
  const { tripId = "1" } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const trip = trips.find((item) => item.id === tripId);
  const start = trip?.startDate ?? "2026-10-16";
  const end = trip?.endDate ?? "2026-10-18";
  const [expenses] = useState(() => loadBudgetExpenses(tripId, start));
  const [budget, setBudget] = useState(() => loadTripBudget(tripId));
  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(budget));
  const [viewMode, setViewMode] = useState<"amount" | "ratio">("amount");
  const backUrl = `/trip-schedule/${encodeURIComponent(tripId)}?tab=budget`;
  const back = () => navigate(backUrl);

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categories = BUDGET_CATEGORIES.map((name) => ({
      name,
      color: BUDGET_COLORS[name],
      icon: CATEGORY_ICON[name],
      amount: expenses
        .filter((entry) => entry.category === name)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
    let offset = 0;
    const gradients = categories.map((item) => {
      const from = offset;
      offset += percent(item.amount, total);
      return `${item.color} ${from}% ${offset}%`;
    });
    const donut = total
      ? `conic-gradient(${gradients.join(", ")})`
      : "conic-gradient(#e8eff1 0 100%)";
    const members = (["김민수", "이지은", "박서연"] as Member[]).map(
      (name) => ({
        name,
        image: MEMBER_IMAGES[name],
        amount: expenses
          .filter((item) => item.payer === name)
          .reduce((sum, item) => sum + item.amount, 0),
      }),
    );
    const countDays = Math.max(
      1,
      Math.min(
        90,
        Math.round(
          (new Date(`${end}T12:00:00`).getTime() -
            new Date(`${start}T12:00:00`).getTime()) /
            86400000,
        ) + 1,
      ),
    );
    const daily = Array.from({ length: countDays }, (_, index) => {
      const date = plusDays(start, index);
      return {
        index: index + 1,
        date,
        amount: expenses
          .filter((entry) => entry.date === date)
          .reduce((sum, entry) => sum + entry.amount, 0),
      };
    });
    const prep = expenses
      .filter((entry) => entry.date < start)
      .reduce((sum, entry) => sum + entry.amount, 0);
    const after = expenses
      .filter((entry) => entry.date > end)
      .reduce((sum, entry) => sum + entry.amount, 0);
    const highest = categories[0];
    const highestDay = daily.length
      ? daily.reduce(
          (max, item) => (item.amount > max.amount ? item : max),
          daily[0],
        )
      : undefined;
    return {
      total,
      categories,
      donut,
      members,
      daily,
      prep,
      after,
      countDays,
      highest,
      highestDay,
    };
  }, [expenses, start, end]);

  const remaining = budget - stats.total;
  const used = percent(stats.total, budget);
  const saveBudget = () => {
    const next = Math.floor(Number(budgetInput));
    if (!Number.isFinite(next) || next <= 0) return;
    try {
      window.localStorage.setItem(`routy-total-budget-${tripId}`, String(next));
    } catch {
      /* localStorage 제한 시 현재 화면에만 반영 */
    }
    setBudget(next);
    setEditBudget(false);
  };

  return (
    <S>
      <div className="stats-sidebar">
        <MainSidebar />
      </div>
      <div className="stats-mobile-header">
        <MobileHeader />
      </div>
      <main className="stats-main">
        <header className="stats-topline">
          <button
            type="button"
            className="back-arrow"
            onClick={back}
            aria-label="가계부로 돌아가기"
          >
            <ArrowLeft size={22} />
          </button>
          <h1>지출 통계</h1>
        </header>
        <div className="trip-banner">
          <img className="trip-cover" src={trip?.image} alt="여행 대표 사진" />
          <div className="trip-details">
            <strong>{trip?.title ?? "여행"}</strong>
            <span>
              {start.replaceAll("-", ".")} ~ {end.replaceAll("-", ".")} ·{" "}
              {Math.max(0, stats.countDays - 1)}박 {stats.countDays}일
            </span>
          </div>
          <button type="button" className="back-budget" onClick={back}>
            <ReceiptText size={18} /> 가계부로 돌아가기
          </button>
        </div>
        <div className="stats-layout">
          <div className="stats-left">
            <section className="stats-card total-card">
              <h2>
                <span className="teal-icon">◇</span> 총 지출
              </h2>
              <strong>{WON(stats.total)}</strong>
              <p>여행 전체 누적 지출</p>
            </section>
            <section className="stats-card funds-card">
              <div className="card-heading">
                <h2>
                  <Wallet size={20} /> 예산 현황
                </h2>
                <button
                  type="button"
                  className="edit-budget"
                  onClick={() => {
                    setBudgetInput(String(budget));
                    setEditBudget(true);
                  }}
                >
                  <Pencil size={14} /> 예산 설정 변경
                </button>
              </div>
              <div className="funds-numbers">
                <div>
                  <span>전체 예산</span>
                  <strong>{WON(budget)}</strong>
                </div>
                <div>
                  <span>남은 금액</span>
                  <strong className={remaining < 0 ? "over" : "remaining"}>
                    {WON(remaining)}
                  </strong>
                  <small>({Math.max(0, 100 - used).toFixed(1)}%)</small>
                </div>
              </div>
              <div className="progress-track">
                <div style={{ width: `${Math.min(100, used)}%` }} />
              </div>
              <div className="funds-label">
                <span>
                  {WON(stats.total)} ({used.toFixed(1)}%) 사용
                </span>
                <span>{WON(budget)}</span>
              </div>
            </section>
            <section className="stats-card members-card">
              <h2>
                <Users size={19} /> 멤버별 결제 금액
              </h2>
              {stats.members.map((item, index) => (
                <div className="member-line" key={item.name}>
                  <img src={item.image} alt="" />
                  <span>{item.name}</span>
                  <div className="mini-track">
                    <div
                      className={`member-bar member-${index}`}
                      style={{ width: `${percent(item.amount, stats.total)}%` }}
                    />
                  </div>
                  <strong>{WON(item.amount)}</strong>
                  <small>{percent(item.amount, stats.total).toFixed(1)}%</small>
                </div>
              ))}
              <div className="settlement-note">
                <strong>3인 균등 정산 참고</strong>
                {stats.members.map((member) => {
                  const perPerson = stats.total / stats.members.length;
                  const balance = member.amount - perPerson;
                  return (
                    <div key={member.name}>
                      <span>{member.name}</span>
                      <span className={balance < 0 ? "pay" : "receive"}>
                        {Math.abs(balance) < 1
                          ? "정산 완료"
                          : `${balance >= 0 ? "받을 금액" : "보낼 금액"} ${WON(Math.round(Math.abs(balance)))}`}
                      </span>
                    </div>
                  );
                })}
                <small>
                  모든 지출을 3명이 균등 부담한다고 가정한 참고 금액이에요.
                </small>
              </div>
            </section>
          </div>
          <div className="stats-right">
            <section className="stats-card categories-card">
              <div className="card-heading">
                <h2>
                  <PieChart size={20} /> 카테고리별 지출
                </h2>
                <div
                  className="mode-switch"
                  role="group"
                  aria-label="통계 표시 방식"
                >
                  <button
                    type="button"
                    className={viewMode === "amount" ? "active" : ""}
                    onClick={() => setViewMode("amount")}
                  >
                    금액
                  </button>
                  <button
                    type="button"
                    className={viewMode === "ratio" ? "active" : ""}
                    onClick={() => setViewMode("ratio")}
                  >
                    비율
                  </button>
                </div>
              </div>
              <div className="category-inside">
                <div
                  className="donut"
                  style={{ background: stats.donut }}
                  role="img"
                  aria-label="카테고리별 지출 비율"
                >
                  <div className="donut-hole">
                    <span>총 지출</span>
                    <strong>{WON(stats.total)}</strong>
                    <small>{stats.total ? "100%" : "0%"}</small>
                  </div>
                </div>
                <div className="category-legend">
                  {stats.categories.length ? (
                    stats.categories.map((item) => (
                      <div className="legend-line" key={item.name}>
                        <i style={{ backgroundColor: item.color }} />
                        <span>
                          {item.icon} {item.name}
                        </span>
                        <strong>
                          {viewMode === "amount"
                            ? WON(item.amount)
                            : `${percent(item.amount, stats.total).toFixed(1)}%`}
                        </strong>
                        <small>
                          {viewMode === "amount"
                            ? `${percent(item.amount, stats.total).toFixed(1)}%`
                            : WON(item.amount)}
                        </small>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">아직 지출 내역이 없어요.</p>
                  )}
                </div>
              </div>
            </section>
            <section className="stats-card daily-card">
              <h2>
                <BarChart3 size={20} /> 일별 지출 추이
              </h2>
              <div className="daily-chart">
                {stats.daily.map((day) => {
                  const maxDaily = Math.max(
                    1,
                    ...stats.daily.map((item) => item.amount),
                  );
                  const h = day.amount
                    ? Math.max(7, (day.amount / maxDaily) * 100)
                    : 0;
                  return (
                    <div className="day-column" key={day.index}>
                      <span className="day-heading">Day {day.index}</span>
                      <span className="day-date">
                        {tinyDate(day.date)} (
                        {DAYS[new Date(`${day.date}T12:00:00`).getDay()]})
                      </span>
                      <div className="bar-space">
                        <div
                          className="daily-bar"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <strong>{WON(day.amount)}</strong>
                      <small>
                        {percent(day.amount, stats.total).toFixed(1)}%
                      </small>
                    </div>
                  );
                })}
              </div>
              {(stats.prep > 0 || stats.after > 0) && (
                <p className="out-of-days">
                  여행 준비 {WON(stats.prep)}
                  {stats.after > 0 ? ` · 여행 이후 ${WON(stats.after)}` : ""}는
                  일별 그래프와 별도로 총지출에 포함돼요.
                </p>
              )}
            </section>
          </div>
        </div>
        <section className="stats-card highlights">
          <div>
            <CalendarDays size={24} />
            <span>1일 평균 지출</span>
            <strong>{WON(Math.round(stats.total / stats.countDays))}</strong>
          </div>
          <div>
            <Crown size={24} />
            <span>가장 많이 쓴 항목</span>
            <strong>
              {stats.highest
                ? `${stats.highest.name} · ${WON(stats.highest.amount)}`
                : "기록 없음"}
            </strong>
          </div>
          <div>
            <BarChart3 size={24} />
            <span>최대 지출일</span>
            <strong>
              {stats.highestDay?.amount
                ? `Day ${stats.highestDay.index} · ${WON(stats.highestDay.amount)}`
                : "기록 없음"}
            </strong>
          </div>
        </section>
        <p className="stats-data-note">
          현재 통계는 이 브라우저에 저장된 여행별 가계부 데이터를 기준으로
          계산됩니다. 멤버별 금액은 실제 결제액이며 정산 송금액과는 다릅니다.
        </p>
      </main>
      <div className="stats-mobile-nav">
        <MobileNav />
      </div>
      {editBudget && (
        <div
          className="stats-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditBudget(false);
          }}
        >
          <section
            className="stats-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-dialog-name"
          >
            <header>
              <h2 id="budget-dialog-name">전체 예산 설정</h2>
              <button
                type="button"
                onClick={() => setEditBudget(false)}
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </header>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveBudget();
              }}
            >
              <label htmlFor="trip-total-budget">예산 금액 (원)</label>
              <input
                id="trip-total-budget"
                type="number"
                min={1}
                max={9999999999}
                value={budgetInput}
                onChange={(event) => setBudgetInput(event.target.value)}
                required
                autoFocus
              />
              <footer>
                <button type="button" onClick={() => setEditBudget(false)}>
                  취소
                </button>
                <button type="submit">
                  <Check size={16} /> 저장
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </S>
  );
}
