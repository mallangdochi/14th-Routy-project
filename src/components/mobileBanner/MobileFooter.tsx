import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Briefcase,
  Heart,
  // LockKeyhole,
  Plus,
  Search,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { LinkStyle, MobileProfile, NavStyle, UlStyle } from "./mobileStyle";

type LoginNotice = "trip" | "saved" | null;

interface MobileNavContentProps {
  pathname: string;
  isLoggedIn: boolean;
}

export default function MobileNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const isLoggedIn = Boolean(user);

  return (
    <MobileNavContent
      key={`${pathname}-${isLoggedIn}`}
      pathname={pathname}
      isLoggedIn={isLoggedIn}
    />
  );
}

function MobileNavContent({ pathname, isLoggedIn }: MobileNavContentProps) {
  const [notice, setNotice] = useState<LoginNotice>(null);
  const navRef = useRef<HTMLElement>(null);
  const noticeId = useId();

  const isTravelPage =
    pathname === "/" ||
    pathname === "/schedule" ||
    pathname.startsWith("/trips/");

  const isSearchPage =
    pathname === "/search" || pathname.startsWith("/search/");

  const isSavedPage = pathname === "/saved" || pathname.startsWith("/saved/");

  const isProfilePage =
    pathname === "/mypage" || pathname.startsWith("/mypage/");

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      setNotice(null);
    }, 3000);

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !navRef.current?.contains(event.target)
      ) {
        setNotice(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotice(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notice]);

  const closeNotice = () => {
    setNotice(null);
  };

  const toggleNotice = (target: Exclude<LoginNotice, null>) => {
    setNotice((previous) => (previous === target ? null : target));
  };

  return (
    <NavStyle
      ref={navRef}
      aria-label="주 메뉴"
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;

        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          closeNotice();
        }
      }}
    >
      {notice && !isLoggedIn && (
        <div
          id={noticeId}
          className="login-notice"
          data-target={notice}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {notice === "trip"
            ? "로그인 후 여행을 만들 수 있어요"
            : "로그인 후 좋아요를 저장할 수 있어요"}
        </div>
      )}

      <UlStyle>
        {/* 내 여행 */}
        <li className="nav-trip">
          <LinkStyle
            to="/"
            className={isTravelPage ? "is-selected" : ""}
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={closeNotice}
          >
            <span className="nav-icon">
              <Briefcase size={23} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="move-loc">내 여행</span>
          </LinkStyle>
        </li>

        {/* 검색 */}
        <li className="nav-search">
          <LinkStyle
            to="/search"
            className={isSearchPage ? "is-selected" : ""}
            aria-current={pathname === "/search" ? "page" : undefined}
            onClick={closeNotice}
          >
            <span className="nav-icon">
              <Search size={23} aria-hidden="true" />
            </span>
            <span className="move-loc">검색</span>
          </LinkStyle>
        </li>

        {/* 새 여행 만들기 */}
        <li className="nav-add">
          {isLoggedIn ? (
            <Link
              className="new-trip-link"
              to="/trips/new"
              aria-current={pathname === "/trips/new" ? "page" : undefined}
              onClick={closeNotice}
            >
              <MobileProfile className="profile-container">
                <Plus size={25} strokeWidth={3} aria-hidden="true" />
              </MobileProfile>
              <span className="sr-only">새 여행 만들기</span>
            </Link>
          ) : (
            <button
              className="new-trip-link"
              type="button"
              aria-disabled="true"
              aria-label="새 여행 만들기, 로그인 필요"
              aria-describedby={notice === "trip" ? noticeId : undefined}
              onClick={() => toggleNotice("trip")}
            >
              <MobileProfile className="profile-container is-disabled">
                <Plus size={25} strokeWidth={3} aria-hidden="true" />
              </MobileProfile>
            </button>
          )}
        </li>

        {/* 좋아요 */}
        <li className="nav-saved">
          {isLoggedIn ? (
            <LinkStyle
              to="/saved"
              className={isSavedPage ? "is-selected" : ""}
              aria-current={pathname === "/saved" ? "page" : undefined}
              onClick={closeNotice}
            >
              <span className="nav-icon">
                <Heart size={23} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="move-loc">좋아요</span>
            </LinkStyle>
          ) : (
            <button
              className="guest-saved-button"
              type="button"
              aria-disabled="true"
              aria-label="좋아요, 로그인 필요"
              aria-describedby={notice === "saved" ? noticeId : undefined}
              onClick={() => toggleNotice("saved")}
            >
              <span className="nav-icon saved-icon">
                <Heart size={23} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="move-loc">좋아요</span>
            </button>
          )}
        </li>

        {/* 프로필 */}
        <li className="nav-profile">
          <LinkStyle
            to="/mypage/profile"
            className={isProfilePage ? "is-selected" : ""}
            aria-current={pathname === "/mypage/profile" ? "page" : undefined}
            onClick={closeNotice}
          >
            <span className="nav-icon">
              <UserRound size={23} strokeWidth={1.3} aria-hidden="true" />
            </span>
            <span className="move-loc">프로필</span>
          </LinkStyle>
        </li>
      </UlStyle>
    </NavStyle>
  );
}
