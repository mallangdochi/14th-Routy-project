import { useState } from "react";
import * as S from "./MainSidebarStyle";

import RoutyLogo from "../../assets/로고.webp";
import ProfileImage from "../../assets/profile.webp";
import SidebarBanner from "../../assets/mainsidebar.webp";

// 메뉴 ID 타입
type MenuId = "myTrip" | "search" | "saved" | "notification" | "settings";

// 메뉴 데이터 타입
interface MenuItem {
  id: MenuId;
  label: string;
}

// 메인 메뉴
const MENU_ITEMS: MenuItem[] = [
  { id: "myTrip", label: "내 여행" },
  { id: "search", label: "검색" },
  { id: "saved", label: "저장한 장소" },
];

// 하단 메뉴
const BOTTOM_ITEMS: MenuItem[] = [
  { id: "notification", label: "알림" },
  { id: "settings", label: "설정" },
];

// SVG 아이콘 Props
interface MenuIconProps {
  id: MenuId;
}

// 메뉴 SVG 아이콘
const MenuIcon = ({ id }: MenuIconProps) => {
  const icons: Record<MenuId, React.ReactNode> = {
    myTrip: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </>
    ),

    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M16 16l5 5" />
      </>
    ),

    saved: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-5-7 5V4a1 1 0 0 1 1-1z" />,

    notification: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M9.7 3.5h4.6l.6 2.1 1.5.9 2.1-.5 2.3 4-.5 1.5v1.8l.5 1.5-2.3 4-2.1-.5-1.5.9-.6 2.1H9.7l-.6-2.1-1.5-.9-2.1.5-2.3-4 .5-1.5v-1.8l-.5-1.5 2.3-4 2.1.5 1.5-.9z" />
      </>
    ),
  };

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[id]}
    </svg>
  );
};

// 메인 사이드바
const MainSidebar = () => {
  const [activeMenu, setActiveMenu] = useState<MenuId>("myTrip");
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // 메뉴 클릭
  const handleMenuClick = (menuId: MenuId): void => {
    setActiveMenu(menuId);
  };

  // 새 여행 만들기
  const handleCreateTrip = (): void => {
    console.log("새 여행 만들기");
  };

  return (
    <S.SidebarContainer>
      {/* 로고 */}
      <S.LogoWrapper>
        <S.LogoImage src={RoutyLogo} alt="Routy" />
      </S.LogoWrapper>

      {/* 프로필 */}
      <S.ProfileWrapper>
        <S.ProfileButton
          type="button"
          aria-expanded={isProfileOpen}
          onClick={() => setIsProfileOpen((prev) => !prev)}
        >
          <S.ProfileImage src={ProfileImage} alt="프로필 이미지" />

          <S.ProfileName>홍길동님</S.ProfileName>

          <S.ProfileArrow $isOpen={isProfileOpen}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </S.ProfileArrow>
        </S.ProfileButton>

        {/* 프로필 드롭다운 */}
        {isProfileOpen && (
          <S.ProfileDropdown>
            {/* 프로필 수정 */}
            <S.DropdownItem type="button">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>
              <span>프로필 수정</span>
            </S.DropdownItem>

            {/* 계정 설정 */}
            <S.DropdownItem type="button">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M9.7 3.5h4.6l.6 2.1 1.5.9 2.1-.5 2.3 4-.5 1.5v1.8l.5 1.5-2.3 4-2.1-.5-1.5.9-.6 2.1H9.7l-.6-2.1-1.5-.9-2.1.5-2.3-4 .5-1.5v-1.8l-.5-1.5 2.3-4 2.1.5 1.5-.9z" />
              </svg>
              <span>계정 설정</span>
            </S.DropdownItem>

            {/* 구분선 */}
            <S.DropdownDivider />

            {/* 로그아웃 */}
            <S.DropdownItem type="button">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
                <path d="M14 16l4-4-4-4" />
                <path d="M8 12h10" />
              </svg>
              <span>로그아웃</span>
            </S.DropdownItem>
          </S.ProfileDropdown>
        )}
      </S.ProfileWrapper>

      {/* 새 여행 만들기 */}
      <S.CreateTripButton type="button" onClick={handleCreateTrip}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>

        <span>새 여행 만들기</span>
      </S.CreateTripButton>

      {/* 메인 메뉴 */}
      <S.MainNavigation>
        {MENU_ITEMS.map((item) => {
          const isActive = activeMenu === item.id;

          return (
            <S.MenuButton
              key={item.id}
              type="button"
              $active={isActive}
              onClick={() => handleMenuClick(item.id)}
            >
              <S.MenuIcon>
                <MenuIcon id={item.id} />
              </S.MenuIcon>

              <S.MenuLabel>{item.label}</S.MenuLabel>
            </S.MenuButton>
          );
        })}
      </S.MainNavigation>

      {/* 하단 영역 */}
      <S.BottomSection>
        <S.BottomNavigation>
          {BOTTOM_ITEMS.map((item) => {
            const isActive = activeMenu === item.id;

            return (
              <S.MenuButton
                key={item.id}
                type="button"
                $active={isActive}
                onClick={() => handleMenuClick(item.id)}
              >
                <S.MenuIcon>
                  <MenuIcon id={item.id} />
                </S.MenuIcon>

                <S.MenuLabel>{item.label}</S.MenuLabel>
              </S.MenuButton>
            );
          })}
        </S.BottomNavigation>

        {/* 마스코트 배너 */}
        <S.BannerWrapper>
          <S.BannerImage src={SidebarBanner} alt="Routy 여행 마스코트" />
        </S.BannerWrapper>
      </S.BottomSection>
    </S.SidebarContainer>
  );
};

export default MainSidebar;
