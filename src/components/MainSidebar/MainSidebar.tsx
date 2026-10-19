import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";
import * as S from "./MainSidebarStyle";
import smallRouty from "../../../public/favicon.svg";

import ProfileImage from "../../assets/profile.webp";
import SidebarBanner from "../../assets/mainsidebar.webp";
import {
  Bell,
  Bookmark,
  Briefcase,
  ChevronDown,
  ChevronRight,
  LogOut,
  Plus,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

type MenuId = "myTrip" | "search" | "saved" | "notification" | "settings";

const MENU_PATHS: Record<MenuId, string> = {
  myTrip: "/",
  search: "/search",
  saved: "/saved",
  notification: "/notifications",
  settings: "/mypage/settings",
};

interface MenuItem {
  id: MenuId;
  label: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: "myTrip", label: "내 여행" },
  { id: "search", label: "검색" },
  { id: "saved", label: "저장한 장소" },
];

const BOTTOM_ITEMS: MenuItem[] = [
  { id: "notification", label: "알림" },
  { id: "settings", label: "설정" },
];

interface MenuIconProps {
  id: MenuId;
}

const MenuIcon = ({ id }: MenuIconProps) => {
  const icons: Record<MenuId, ReactNode> = {
    myTrip: <Briefcase size={23} strokeWidth={1.8} aria-hidden="true" />,

    search: <Search size={23} aria-hidden="true" />,

    saved: <Bookmark size={23} strokeWidth={1.5} aria-hidden="true" />,

    notification: <Bell size={23} strokeWidth={1.5} aria-hidden="true" />,

    settings: <Settings size={23} strokeWidth={1.5} aria-hidden="true" />,
  };

  return icons[id];
};

const MainSidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownId = useId();
  const tooltipId = useId();
  const [dropdownPosition, setDropdownPosition] = useState<CSSProperties>({});
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeMenu: MenuId | undefined =
    pathname === "/" ||
    pathname.startsWith("/trips/") ||
    pathname === "/schedule"
      ? "myTrip"
      : (Object.keys(MENU_PATHS) as MenuId[]).find((id) => {
          const path = MENU_PATHS[id];

          return (
            path !== "/" &&
            (pathname === path || pathname.startsWith(`${path}/`))
          );
        });
  const [tooltip, setTooltip] = useState<{
    label: string;
    left: number;
    top: number;
  } | null>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  useLayoutEffect(() => {
    if (!isCollapsed || !isProfileOpen) return;

    const updatePosition = () => {
      const button = profileButtonRef.current;
      const dropdown = dropdownRef.current;
      if (!button || !dropdown) return;
      const rect = button.getBoundingClientRect();
      const width = Math.min(220, window.innerWidth - 16);
      const left = Math.max(
        8,
        Math.min(rect.right + 8, window.innerWidth - width - 8),
      );
      const top = Math.max(
        8,
        Math.min(rect.top, window.innerHeight - dropdown.offsetHeight - 8),
      );
      setDropdownPosition({ position: "fixed", left, top, width });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isCollapsed, isProfileOpen]);

  useEffect(() => {
    if (!isProfileOpen) return;
    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (
        !profileButtonRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setIsProfileOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        profileButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    const hideTooltip = () => setTooltip(null);
    window.addEventListener("resize", hideTooltip);
    window.addEventListener("scroll", hideTooltip, true);
    return () => {
      window.removeEventListener("resize", hideTooltip);
      window.removeEventListener("scroll", hideTooltip, true);
    };
  }, []);

  const tooltipProps = (label: string, enabled = isCollapsed) => {
    const show = (event: SyntheticEvent<HTMLButtonElement>) => {
      if (!enabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        label,
        left: rect.right + 10,
        top: rect.top + rect.height / 2,
      });
    };
    return {
      "aria-label": label,
      "aria-describedby":
        enabled && tooltip?.label === label ? tooltipId : undefined,
      onMouseEnter: show,
      onMouseLeave: () => setTooltip(null),
      onFocus: show,
      onBlur: () => setTooltip(null),
      onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Escape") setTooltip(null);
      },
    };
  };

<<<<<<< Updated upstream
  useEffect(() => {
    if (!isLogoutOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLogoutOpen(false);
        profileButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLogoutOpen]);

  const navigateToPage = (path: string) => {
=======
  const handleNavigate = (path: string) => {
>>>>>>> Stashed changes
    setIsProfileOpen(false);
    setTooltip(null);
    navigate(path);
  };

  const profileDropdown = (
    <S.ProfileDropdown
      ref={dropdownRef}
      id={dropdownId}
      data-open={isProfileOpen}
      style={isCollapsed ? dropdownPosition : undefined}
    >
      <S.DropdownItem
        type="button"
        onClick={() => navigateToPage("/mypage/profile")}
      >
        <UserRound size={20} strokeWidth={1.3} aria-hidden="true" />
        <span>프로필 수정</span>
      </S.DropdownItem>
      <S.DropdownItem
        type="button"
        onClick={() => navigateToPage("/mypage/security")}
      >
        <Settings size={20} strokeWidth={1.3} aria-hidden="true" />
        <span>계정 설정</span>
      </S.DropdownItem>
      <S.DropdownDivider />
      <S.DropdownItem
        type="button"
        onClick={() => {
          setIsProfileOpen(false);
          setTooltip(null);
          setIsLogoutOpen(true);
        }}
      >
        <LogOut size={20} strokeWidth={1.5} aria-hidden="true" />
        <span>로그아웃</span>
      </S.DropdownItem>
    </S.ProfileDropdown>
  );

  const handleCreateTrip = () => {
    navigate("/trips/new");
  };

  return (
    <S.SidebarShell>
      <S.SidebarContainer data-collapsed={isCollapsed ? "true" : "false"}>
        <S.HeaderStyle data-sidebar-header="">
          <S.LogoWrapper
            to="/"
            data-sidebar-logo=""
            aria-label="Routy 메인페이지"
          >
            {!isCollapsed ? (
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 625 229"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M579.014 152.122C572.997 157.048 566.78 160.411 558.84 160.953C530.071 162.92 497.639 156.668 495.424 122.225C494.249 103.969 496.343 84.4702 495.442 66.0799C496.111 61.5391 499.036 57.5781 503.345 55.8852C507.858 54.1134 526.77 54.016 531.199 55.8852C534.245 57.1653 536.404 60.0178 536.771 63.3062C538.475 78.4359 534.793 96.7984 537.365 111.877C541.01 133.264 577.668 132.791 579.507 109.238C580.574 95.56 578.248 80.1381 579.497 66.5576C579.971 61.4278 581.944 56.9056 587.056 55.092C590.998 53.696 606.571 53.8444 611.289 54.2665C618.634 54.9251 624.127 59.9853 624.545 67.462C623.398 95.2771 626.008 124.228 624.545 151.914C622.586 189.019 596.254 217.511 559.676 223.012C541.697 225.716 496.752 225.586 492.313 201.867C491.004 194.854 493.46 182.243 499.654 177.897C507.58 172.331 513.978 178.36 521.444 180.656C534.547 184.687 556.138 185.902 567.838 177.827C576.261 172.015 579.316 162.034 579.019 152.127L579.014 152.122Z"
                  fill="#0D3E41"
                />
                <path
                  d="M292.899 55.7787C297.863 55.185 312.577 55.0365 316.704 57.2489C319.597 58.7981 320.609 61.5439 320.874 64.6793C322.086 78.7607 319.792 94.5908 320.841 108.774C321.357 115.741 323.966 121.52 331.075 123.598C343.444 127.216 355.122 122.684 356.167 108.774C357.151 95.6669 354.969 80.9453 356.157 67.9492C357.443 53.8677 373.365 54.7304 384.183 55.7091C392.114 56.428 395.044 59.5727 395.638 67.4575C396.604 80.3284 396.26 98.9739 395.638 112.021C394.979 125.884 390.438 140.073 379.373 149.112C367.036 159.196 331.358 158.444 316.133 155.685C269.572 147.243 282.967 102.193 280.91 67.4529C281.574 60.8203 286.436 56.5439 292.899 55.774V55.7787Z"
                  fill="#0D3E41"
                />
                <path
                  d="M460.619 45.4445C466.641 45.5001 472.812 45.5465 478.713 46.6179C482.205 47.6754 485.186 50.4444 486.179 54.0019C486.941 56.7338 486.959 65.3932 486.62 68.4034C486.059 73.3987 482.191 76.5109 477.446 77.3272C476.48 77.4942 473.192 77.9116 472.459 77.9116H460.619V115.249C460.619 115.717 461.724 118.296 462.086 118.885C466.511 126.065 479.461 119.117 484.22 126.459C486.894 130.587 486.922 144.488 484.995 148.88C481.193 157.526 467.347 156.751 459.439 156.32C435.513 155.016 419.23 144.692 417.883 119.446C417.164 105.926 418.51 91.7936 417.841 78.2085C413.621 75.6204 408.226 78.7187 404.427 74.3124C400.629 69.9062 400.523 53.7282 403.768 49.1875C407.455 44.0345 416.922 46.8359 417.832 45.3796C419.383 33.3389 412.78 12.5321 428.005 7.54143C433.001 5.90416 445.505 5.90416 450.501 7.54143C455.497 9.1787 460.609 14.7445 460.609 20.1711V45.4491L460.619 45.4445Z"
                  fill="#0D3E41"
                />
                <path
                  d="M404.437 186.44C404.627 185.74 404.251 185.67 403.982 185.28C402.788 183.555 398.981 180.211 397.254 178.55C393.962 175.378 390.256 172.544 387.15 169.167C385.4 164.979 390.568 162.451 393.994 161.95C405.012 165.42 415.213 171.245 426.102 175.192C433.688 173.221 450.696 161.946 457.619 168.342C462.402 172.762 455.186 179.612 451.035 181.741C446.239 184.204 440.565 186.073 435.653 188.411L425.103 224.018C423.682 227.933 416.76 229.185 415.422 224.867C413.245 217.831 413.862 207.794 411.842 200.614C411.703 200.113 411.708 199.756 411.174 199.45L393.4 205.113C391.617 208.954 390.117 219.366 385.52 220.196C376.791 221.778 381.435 210.762 379.118 205.92C355.247 214.57 330.885 221.968 305.686 225.795C214.063 239.709 140.933 207.757 80.0989 141C73.8817 134.177 56.7625 115.717 55.7781 107.317C52.9319 83.0599 76.0315 91.7703 91.1218 89.3863C122.561 84.4188 121.53 39.489 90.8014 37.0864C82.1233 36.4092 64.4933 36.2144 56.0103 37.1513C49.691 37.8517 44.7506 41.8823 43.302 48.1113C41.6537 89.0848 43.7477 130.383 42.2341 171.347C39.1742 182.72 24.5297 181.978 15.0763 181.37C6.8115 180.832 0.877555 176.792 0 168.142V41.9472C2.40979 11.9939 23.9122 1.59517 51.3068 0.435634C64.7673 -0.13486 81.074 -0.158051 94.5252 0.435634C122.839 1.6833 148.325 11.0941 155.531 41.0706C163.202 72.9765 150.322 98.0504 121.056 111.385C119.347 112.164 113.195 113.973 112.373 114.766C111.728 115.392 111.816 116.176 112.021 116.983C112.304 118.097 119.57 125.986 120.968 127.544C179.834 193.026 248.757 228.745 339.056 211.342C351.76 208.893 364.543 205.79 376.568 201.05C373.481 198.058 366.767 192.91 374.386 190.512C378.844 189.111 383.38 193.722 387.912 193.856L404.437 186.435V186.44Z"
                  fill="#0D3E41"
                />
                <path
                  d="M216.296 43.2645C250.112 41.4139 277.038 66.0889 272.051 100.819C269.446 118.983 248.046 144.441 235.663 158.161C233.137 160.963 225.824 169.344 222.876 170.434C215.526 173.152 210.72 166.45 206.16 161.644C194.46 149.316 170.97 121.761 167.488 105.657C160.462 73.1668 183.627 45.0502 216.292 43.2645H216.296ZM239.052 94.9476C239.052 84.1128 230.258 75.3282 219.412 75.3282C208.565 75.3282 199.771 84.1128 199.771 94.9476C199.771 105.782 208.565 114.567 219.412 114.567C230.258 114.567 239.052 105.782 239.052 94.9476Z"
                  fill="#EB654B"
                />
              </svg>
            ) : (
              <img src={smallRouty} alt="로고 축소 버전" />
            )}
          </S.LogoWrapper>
        </S.HeaderStyle>

        <S.ProfileWrapper>
          <S.ProfileButton
            data-profile-button=""
            ref={profileButtonRef}
            {...tooltipProps("프로필")}
            type="button"
            aria-label="홍길동님 프로필 메뉴"
            aria-controls={isProfileOpen ? dropdownId : undefined}
            aria-expanded={isProfileOpen}
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setTooltip(null);
            }}
          >
            <S.ProfileImage src={ProfileImage} alt="프로필 이미지" />

            <S.ProfileName data-profile-name="">홍길동님</S.ProfileName>

            <S.ProfileArrow data-profile-arrow="" $isOpen={isProfileOpen}>
              <ChevronDown size={23} strokeWidth={1.5} aria-hidden="true" />
            </S.ProfileArrow>
          </S.ProfileButton>

          {isProfileOpen &&
            (isCollapsed
              ? createPortal(profileDropdown, document.body)
              : profileDropdown)}
        </S.ProfileWrapper>

        <S.CreateTripButton
          data-create-button=""
          type="button"
          {...tooltipProps("새 여행 만들기")}
          onClick={handleCreateTrip}
        >
          <Plus size={20} strokeWidth={2} />
          <span data-create-label="">새 여행 만들기</span>
        </S.CreateTripButton>

        <S.MainNavigation data-main-navigation="">
          {MENU_ITEMS.map((item) => {
            const isActive = activeMenu === item.id;

            return (
              <S.MenuButton
                data-menu-button=""
                key={item.id}
                type="button"
                $active={isActive}
                {...tooltipProps(item.label)}
                onClick={() => handleNavigate(MENU_PATHS[item.id])}
              >
                <S.MenuIcon data-menu-icon="">
                  <MenuIcon id={item.id} />
                </S.MenuIcon>

                <S.MenuLabel data-menu-label="">{item.label}</S.MenuLabel>
              </S.MenuButton>
            );
          })}
        </S.MainNavigation>

        <S.BottomSection>
          <S.BottomNavigation data-bottom-navigation="">
            {BOTTOM_ITEMS.map((item) => {
              const isActive = activeMenu === item.id;

              return (
                <S.MenuButton
                  data-menu-button=""
                  key={item.id}
                  type="button"
                  $active={isActive}
                  {...tooltipProps(item.label)}
<<<<<<< Updated upstream
                  onClick={() => {
                    setActiveMenu(item.id);
                    navigateToPage(
                      item.id === "notification"
                        ? "/mypage/settings#notifications"
                        : "/mypage/settings",
                    );
                  }}
=======
                  onClick={() => handleNavigate(MENU_PATHS[item.id])}
>>>>>>> Stashed changes
                >
                  <S.MenuIcon data-menu-icon="">
                    <MenuIcon id={item.id} />
                  </S.MenuIcon>

                  <S.MenuLabel data-menu-label="">{item.label}</S.MenuLabel>
                </S.MenuButton>
              );
            })}
          </S.BottomNavigation>

          <S.BannerWrapper data-sidebar-banner="">
            <S.BannerImage src={SidebarBanner} alt="Routy 여행 마스코트" />
          </S.BannerWrapper>
        </S.BottomSection>
        {tooltip &&
          createPortal(
            <S.Tooltip
              id={tooltipId}
              role="tooltip"
              ref={(node) => {
                if (!node) return;
                node.style.left = `${Math.max(8, Math.min(tooltip.left, window.innerWidth - node.offsetWidth - 8))}px`;
                node.style.top = `${Math.max(node.offsetHeight / 2 + 8, Math.min(tooltip.top, window.innerHeight - node.offsetHeight / 2 - 8))}px`;
              }}
            >
              {tooltip.label}
            </S.Tooltip>,
            document.body,
          )}
      </S.SidebarContainer>
      <S.CollapseButton
        type="button"
        {...tooltipProps(isCollapsed ? "메뉴 펼치기" : "메뉴 접기", true)}
        aria-expanded={!isCollapsed}
        onClick={() => {
          setIsCollapsed((prev) => !prev);
          setIsProfileOpen(false);
          setTooltip(null);
        }}
      >
        <ChevronRight size={24} strokeWidth={2} aria-hidden="true" />
      </S.CollapseButton>
      {isLogoutOpen &&
        createPortal(
          <S.LogoutBackdrop>
            <S.LogoutDialog
              role="dialog"
              aria-modal="true"
              aria-labelledby="main-sidebar-logout-title"
              aria-describedby="main-sidebar-logout-description"
            >
              <S.LogoutDialogTitle id="main-sidebar-logout-title">
                로그아웃하시겠습니까?
              </S.LogoutDialogTitle>
              <S.LogoutDialogDescription id="main-sidebar-logout-description">
                로그아웃하면 홈 화면으로 이동합니다.
              </S.LogoutDialogDescription>
              <S.LogoutDialogActions>
                <S.LogoutCancelButton
                  type="button"
                  autoFocus
                  onClick={() => {
                    setIsLogoutOpen(false);
                    profileButtonRef.current?.focus();
                  }}
                >
                  취소
                </S.LogoutCancelButton>
                <S.LogoutConfirmButton
                  type="button"
                  onClick={() => {
                    setIsLogoutOpen(false);
                    navigate("/");
                  }}
                >
                  로그아웃
                </S.LogoutConfirmButton>
              </S.LogoutDialogActions>
            </S.LogoutDialog>
          </S.LogoutBackdrop>,
          document.body,
        )}
    </S.SidebarShell>
  );
};

export default MainSidebar;
