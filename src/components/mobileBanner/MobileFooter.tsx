import { Link, useLocation } from "react-router";
import { Briefcase, Heart, Plus, Search, UserRound } from "lucide-react";
import { LinkStyle, MobileProfile, NavStyle, UlStyle } from "./mobileStyle";

export default function MobileNav() {
  const { pathname } = useLocation();

  const isTravelPage =
    pathname === "/" ||
    pathname === "/schedule" ||
    pathname.startsWith("/trips/");

  const isSearchPage =
    pathname === "/search" || pathname.startsWith("/search/");

  const isSavedPage = pathname === "/saved" || pathname.startsWith("/saved/");

  const isProfilePage =
    pathname === "/mypage" || pathname.startsWith("/mypage/");

  return (
    <NavStyle aria-label="주 메뉴">
      <UlStyle>
        <li>
          <LinkStyle
            to="/"
            className={isTravelPage ? "is-selected" : ""}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <Briefcase size={23} strokeWidth={1.8} aria-hidden="true" />
            <span className="move-loc">내 여행</span>
          </LinkStyle>
        </li>

        <li>
          <LinkStyle
            to="/search"
            className={isSearchPage ? "is-selected" : ""}
            aria-current={pathname === "/search" ? "page" : undefined}
          >
            <Search size={23} aria-hidden="true" />
            <span className="move-loc">검색</span>
          </LinkStyle>
        </li>

        <li>
          <Link
            to="/trips/new"
            aria-current={pathname === "/trips/new" ? "page" : undefined}
          >
            <MobileProfile className="profile-container">
              <Plus size={25} strokeWidth={3} aria-hidden="true" />
            </MobileProfile>
            <span className="sr-only">새 여행 만들기</span>
          </Link>
        </li>

        <li>
          <LinkStyle
            to="/saved"
            className={isSavedPage ? "is-selected" : ""}
            aria-current={pathname === "/saved" ? "page" : undefined}
          >
            <Heart size={23} strokeWidth={1.5} aria-hidden="true" />
            <span className="move-loc">좋아요</span>
          </LinkStyle>
        </li>

        <li>
          <LinkStyle
            to="/mypage/profile"
            className={isProfilePage ? "is-selected" : ""}
            aria-current={pathname === "/mypage/profile" ? "page" : undefined}
          >
            <UserRound size={23} strokeWidth={1.3} aria-hidden="true" />
            <span className="move-loc">프로필</span>
          </LinkStyle>
        </li>
      </UlStyle>
    </NavStyle>
  );
}
