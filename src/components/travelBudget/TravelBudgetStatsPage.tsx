import { useEffect, useId, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronLeft,
  BarChart3,
  CalendarDays,
  Crown,
  PieChart,
  Users,
  Wallet,
} from "lucide-react";
import MainSidebar from "../MainSidebar/MainSidebar";
import MobileHeader from "../mobileBanner/MobileHeader";
import MobileNav from "../mobileBanner/MobileFooter";
import fallbackAvatar from "../../assets/profileAvatars/P1.webp";
import {
  BUDGET_CATEGORIES,
  BUDGET_COLORS,
  calendarTripDays,
  WON,
} from "./budgetData";
import { TravelBudgetStatsPageStyle as S } from "./TravelBudgetStatsPageStyle";
import { useTripBudget } from "./useTripBudget";
import type { Expense } from "./budgetData";
import Loader from "../loader/Loader";

const EMPTY_EXPENSES: Expense[] = [];
const CATEGORY_ICON: Record<string, string> = {
  숙소: "🛏️",
  교통: "🚙",
  식비: "🍴",
  카페: "☕",
  관광: "📍",
  기타: "🧾",
};
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const tinyDate = (date: string) => {
  const [, m, d] = date.split("-");
  return `${Number(m)}.${String(d).padStart(2, "0")}`;
};
const percent = (a: number, b: number) => (b ? (a / b) * 100 : 0);

/** 여행 상세 > 예산 > 지출 통계: Supabase 가계부 API 데이터를 사용합니다. */
export default function TravelBudgetStatsPage() {
  const { tripId = "" } = useParams<{ tripId: string }>();
  return <BudgetStatsContents key={tripId} tripId={tripId} />;
}

function BudgetStatsContents({ tripId }: { tripId: string }) {
  const navigate = useNavigate();
  const { snapshot, members, dates, loading, error, membersError } =
    useTripBudget(tripId);
  const trip = snapshot?.trip;
  const start = trip?.startDate ?? "1970-01-01";
  const end = trip?.endDate ?? start;
  const expenses = snapshot?.expenses ?? EMPTY_EXPENSES;
  const budget = trip?.budget ?? null;
  const [tripImage, setTripImage] = useState<string | null>(null);
  useEffect(() => {
    if (!trip?.region) return;
    const controller = new AbortController();
    void fetch(
      `/api/tour/region-photo?name=${encodeURIComponent(trip.region)}`,
      {
        credentials: "include",
        signal: controller.signal,
      },
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        if (controller.signal.aborted) return;
        if (
          data &&
          typeof data === "object" &&
          "image" in data &&
          typeof data.image === "string" &&
          /^https:\/\//.test(data.image)
        ) {
          setTripImage(data.image);
        }
      })
      .catch(() => {
        /* 사진이 없으면 기본 이미지 영역을 사용합니다. */
      });
    return () => controller.abort();
  }, [trip?.region]);
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
    const allMembers = [...members];
    // 탈퇴한 결제자의 과거 내역도 지출 통계에서 사라지지 않도록 표시합니다.
    expenses.forEach((entry) => {
      if (!allMembers.some((member) => member.userId === entry.payer)) {
        allMembers.push({
          userId: entry.payer,
          nickname: entry.payerName || "이전 참여자",
          image: fallbackAvatar,
          permission: "viewer",
        });
      }
    });
    const memberStats = allMembers.map((member) => ({
      id: member.userId,
      name: member.nickname,
      image: member.image ?? fallbackAvatar,
      amount: expenses
        .filter((item) => item.payer === member.userId)
        .reduce((sum, item) => sum + item.amount, 0),
    }));
    const tripDates = dates.length ? dates : calendarTripDays(start, end);
    const countDays = Math.max(1, tripDates.length);
    const datesSet = new Set(tripDates);
    expenses.forEach((entry) => datesSet.add(entry.date));
    const amountsByDate = new Map<string, number>();
    expenses.forEach((entry) =>
      amountsByDate.set(
        entry.date,
        (amountsByDate.get(entry.date) ?? 0) + entry.amount,
      ),
    );
    const daily = [...datesSet].sort().map((date) => {
      const index = tripDates.indexOf(date);
      return {
        date,
        label:
          index !== -1
            ? `Day ${index + 1}`
            : date < start
              ? "여행 준비"
              : "기타 날짜",
        amount: amountsByDate.get(date) ?? 0,
      };
    });
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
      members: memberStats,
      daily,
      countDays,
      highest,
      highestDay,
    };
  }, [expenses, start, end, members, dates]);

  const remaining = budget === null ? 0 : budget - stats.total;
  const used = percent(stats.total, budget ?? 0);
  const maskId = `budget-donut-${useId().replace(/:/g, "")}`;

  if (loading)
    return (
      <S>
        <div className="stats-sidebar">
          <MainSidebar />
        </div>

        <div className="stats-mobile-header">
          <MobileHeader />
        </div>

        <main className="stats-main">
          <Loader />
        </main>

        <div className="stats-mobile-nav">
          <MobileNav />
        </div>
      </S>
    );

  if (error || !snapshot)
    return (
      <S>
        <main className="stats-main">
          <p role="alert">{error || "여행 데이터를 찾지 못했습니다."}</p>
        </main>
      </S>
    );

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
            <ChevronLeft size={22} />
          </button>
          <h1>지출 통계</h1>
        </header>
        <div className="trip-banner">
          {tripImage ? (
            <img
              className="trip-cover"
              src={tripImage}
              alt={`${trip?.region ?? "여행"} 지역 사진`}
            />
          ) : (
            <div
              className="trip-cover trip-cover-placeholder"
              role="img"
              aria-label="여행 이미지 없음"
            >
              <CalendarDays size={28} aria-hidden="true" />
            </div>
          )}
          <div className="trip-details">
            <strong>{trip?.name ?? "여행"}</strong>
            <span>
              {start.replaceAll("-", ".")} ~ {end.replaceAll("-", ".")} ·{" "}
              {Math.max(0, stats.countDays - 1)}박 {stats.countDays}일
            </span>
          </div>
          <button type="button" className="back-budget" onClick={back}>
            가계부로 돌아가기
          </button>
        </div>
        {membersError && <p role="alert">{membersError}</p>}
        <div className="stats-summary-row">
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
            </div>
            {budget === null ? (
              <p className="no-data">설정된 예산이 없어요.</p>
            ) : (
              <>
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
              </>
            )}
          </section>
        </div>
        <div className="stats-layout">
          <div className="stats-left">
            <section className="stats-card members-card">
              <h2>
                <Users size={19} /> 멤버별 결제 금액
              </h2>
              {stats.members.map((item, index) => (
                <div className="member-line" key={item.id}>
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
                <strong>{stats.members.length}인 균등 정산 참고</strong>
                {stats.members.map((member) => {
                  const perPerson = stats.members.length
                    ? stats.total / stats.members.length
                    : 0;
                  const balance = member.amount - perPerson;
                  return (
                    <div key={member.id}>
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
                  표시된 결제자가 지출을 균등 부담한다고 가정한 참고 금액이에요.
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
                  role="img"
                  aria-label="카테고리별 지출 비율"
                >
                  <svg
                    className="donut-chart"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                  >
                    <defs>
                      <mask
                        id={maskId}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="100"
                        height="100"
                      >
                        {/* <circle
                          cx="50"
                          cy="50"
                          r="38.5"
                          fill="none"
                          stroke="white"
                          strokeWidth="23"
                          pathLength="100"
                          strokeDasharray={`${reveal * 100} 100`}
                          transform="rotate(-90 50 50)"
                        /> */}
                        <circle
                          className="donut-reveal"
                          cx="50"
                          cy="50"
                          r="38.5"
                          fill="none"
                          stroke="white"
                          strokeWidth="23"
                          pathLength="100"
                          strokeDasharray="100 100"
                          transform="rotate(-90 50 50)"
                        />
                      </mask>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="38.5"
                      fill="none"
                      stroke="#e8eff1"
                      strokeWidth="23"
                    />
                    <g mask={`url(#${maskId})`}>
                      {stats.categories.map((item, index) => {
                        const offset = stats.categories
                          .slice(0, index)
                          .reduce(
                            (sum, category) =>
                              sum + percent(category.amount, stats.total),
                            0,
                          );
                        const length = percent(item.amount, stats.total);
                        return (
                          <circle
                            key={item.name}
                            cx="50"
                            cy="50"
                            r="38.5"
                            fill="none"
                            stroke={item.color}
                            strokeWidth="23"
                            pathLength="100"
                            strokeDasharray={`${length} ${100 - length}`}
                            strokeDashoffset={-offset}
                            transform="rotate(-90 50 50)"
                          />
                        );
                      })}
                    </g>
                  </svg>
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
          </div>
        </div>
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
                <div className="day-column" key={day.date}>
                  <span className="day-heading">{day.label}</span>
                  <span className="day-date">
                    {tinyDate(day.date)} (
                    {DAYS[new Date(`${day.date}T12:00:00`).getDay()]})
                  </span>
                  <div className="bar-space">
                    <div className="daily-bar" style={{ height: `${h}%` }} />
                  </div>
                  <strong>{WON(day.amount)}</strong>
                  <small>{percent(day.amount, stats.total).toFixed(1)}%</small>
                </div>
              );
            })}
          </div>
        </section>
        <section className="stats-card highlights" aria-label="지출 요약">
          <div>
            <h3>
              <CalendarDays size={22} aria-hidden="true" />
              1일 평균 지출
            </h3>
            <ul>
              <li>
                <span>평균 금액</span>
                <strong>
                  {WON(Math.round(stats.total / stats.countDays))}
                </strong>
              </li>
            </ul>
          </div>
          <div>
            <h3>
              <Crown size={22} aria-hidden="true" />
              가장 많이 쓴 항목
            </h3>
            <ul>
              {stats.highest ? (
                <>
                  <li>
                    <span>카테고리</span>
                    <strong>{stats.highest.name}</strong>
                  </li>
                  <li>
                    <span>지출 금액</span>
                    <strong>{WON(stats.highest.amount)}</strong>
                  </li>
                </>
              ) : (
                <li>기록 없음</li>
              )}
            </ul>
          </div>
          <div>
            <h3>
              <BarChart3 size={22} aria-hidden="true" />
              최대 지출일
            </h3>
            <ul>
              {stats.highestDay?.amount ? (
                <>
                  <li>
                    <span>구분</span>
                    <strong>{stats.highestDay.label}</strong>
                  </li>
                  <li>
                    <span>날짜</span>
                    <strong>{tinyDate(stats.highestDay.date)}</strong>
                  </li>
                  <li>
                    <span>지출 금액</span>
                    <strong>{WON(stats.highestDay.amount)}</strong>
                  </li>
                </>
              ) : (
                <li>기록 없음</li>
              )}
            </ul>
          </div>
        </section>
        <p className="stats-data-note">
          현재 통계는 Supabase에 저장된 여행별 지출 내역을 기준으로 계산됩니다.
          멤버별 금액은 실제 결제액이며 정산 송금액과는 다릅니다.
        </p>
      </main>
      <div className="stats-mobile-nav">
        <MobileNav />
      </div>
    </S>
  );
}
