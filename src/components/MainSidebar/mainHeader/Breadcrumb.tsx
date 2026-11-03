import { Link, matchPath, useLocation } from "react-router";
import {
  Bookmark,
  ChevronRight,
  House,
  Search,
  type LucideIcon,
} from "lucide-react";
import { BreadcrumbStyle } from "./breadcrumbStyle";

type BreadcrumbItem = {
  label: string;
  to?: string;
  Icon?: LucideIcon;
};

type BreadcrumbProps = {
  items?: BreadcrumbItem[];
  className?: string;
};

type BreadcrumbRoot = "search" | "saved" | "schedule";

type BreadcrumbLocationState = {
  breadcrumbRoot?: BreadcrumbRoot;
};

const myTripsRoot: BreadcrumbItem = {
  label: "내 여행",
  to: "/",
  Icon: House,
};

const searchRoot: BreadcrumbItem = {
  label: "검색",
  to: "/search",
  Icon: Search,
};

const savedRoot: BreadcrumbItem = {
  label: "저장한 장소",
  to: "/saved",
  Icon: Bookmark,
};

function getAutomaticItems(
  pathname: string,
  root?: BreadcrumbRoot,
): BreadcrumbItem[] {
  if (pathname === "/") {
    return [myTripsRoot];
  }

  if (pathname === "/search") {
    return [searchRoot];
  }

  if (pathname === "/saved") {
    return [savedRoot];
  }

  if (pathname === "/place/detail") {
    return [root === "saved" ? savedRoot : searchRoot, { label: "장소 상세" }];
  }

  if (pathname === "/trips/new") {
    return [myTripsRoot, { label: "여행 만들기" }];
  }

  const budgetMatch = matchPath(
    "/trip-schedule/:tripId/budget/stats",
    pathname,
  );

  if (budgetMatch) {
    return [
      myTripsRoot,
      {
        label: "여행 상세",
        to: `/trip-schedule/${budgetMatch.params.tripId}`,
      },
      { label: "여행 경비 통계" },
    ];
  }

  if (matchPath("/trip-schedule/:tripId", pathname)) {
    return root === "schedule"
      ? [
          myTripsRoot,
          { label: "여행 일정", to: "/schedule" },
          { label: "여행 상세" },
        ]
      : [myTripsRoot, { label: "여행 상세" }];
  }

  // const timetableMatch = matchPath("/trips/:tripId", pathname);

  // if (timetableMatch) {
  //   return [
  //     myTripsRoot,
  //     {
  //       label: "여행 상세",
  //       to: `/trip-schedule/${timetableMatch.params.tripId}`,
  //     },
  //     { label: "시간표" },
  //   ];
  // }

  const timetableMatch = matchPath("/trips/:tripId", pathname);

  if (timetableMatch) {
    return [
      myTripsRoot,
      ...(root === "schedule" ? [{ label: "여행 일정", to: "/schedule" }] : []),
      {
        label: "여행 상세",
        to: `/trip-schedule/${timetableMatch.params.tripId}`,
      },
      { label: "시간표" },
    ];
  }

  if (pathname === "/schedule") {
    return [myTripsRoot, { label: "여행 일정" }];
  }

  if (pathname === "/profile") {
    return [myTripsRoot, { label: "프로필 설정" }];
  }

  const myPageRoot: BreadcrumbItem = {
    label: "마이페이지",
    to: "/mypage/profile",
  };

  switch (pathname) {
    case "/mypage":
    case "/mypage/profile":
      return [myTripsRoot, myPageRoot, { label: "프로필" }];

    case "/mypage/security":
      return [myTripsRoot, myPageRoot, { label: "계정 보안" }];

    case "/mypage/security/edit":
      return [
        myTripsRoot,
        myPageRoot,
        { label: "계정 보안", to: "/mypage/security" },
        { label: "계정 정보 수정" },
      ];

    case "/mypage/security/password":
      return [
        myTripsRoot,
        myPageRoot,
        { label: "계정 보안", to: "/mypage/security" },
        { label: "비밀번호 변경" },
      ];

    case "/mypage/settings":
      return [myTripsRoot, myPageRoot, { label: "설정" }];

    case "/mypage/support":
      return [myTripsRoot, myPageRoot, { label: "고객 지원" }];

    default:
      return [];
  }
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  const location = useLocation();
  const state = location.state as BreadcrumbLocationState | null;

  const breadcrumbItems =
    items ?? getAutomaticItems(location.pathname, state?.breadcrumbRoot);

  if (breadcrumbItems.length === 0) return null;

  return (
    <BreadcrumbStyle aria-label="현재 위치" className={className}>
      <ol>
        {breadcrumbItems.map(({ label, to, Icon }, index) => {
          const isCurrentPage = index === breadcrumbItems.length - 1;

          const content = (
            <>
              {Icon && <Icon size={18} aria-hidden="true" />}
              <span className="breadcrumb-label">{label}</span>
            </>
          );

          return (
            <li key={`${to ?? "current"}-${label}-${index}`}>
              {index > 0 && <ChevronRight size={16} aria-hidden="true" />}

              {to && !isCurrentPage ? (
                <Link
                  to={to}
                  state={location.state}
                  className="breadcrumb-item"
                >
                  {content}
                </Link>
              ) : (
                <span
                  className="breadcrumb-item"
                  aria-current={isCurrentPage ? "page" : undefined}
                >
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </BreadcrumbStyle>
  );
}
