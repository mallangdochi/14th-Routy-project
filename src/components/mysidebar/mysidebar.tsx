import { useState } from "react";

import {
  UserRound,
  LockKeyhole,
  Settings,
  Headset,
  Plane,
  LogOut,
} from "lucide-react";

// 이미지 불러오기
import routyLogo from "../../assets/routy-logo.svg";
import routyMascot from "../../assets/routy-mascot.png";

// Emotion 스타일
import {
  SidebarContainer,
  LogoArea,
  Logo,
  UserSection,
  Avatar,
  UserName,
  Navigation,
  MenuButton,
  Footer,
  Divider,
  FooterButton,
} from "./mysidebarStyle";

// 메뉴 타입
type MenuId = "profile" | "security" | "settings" | "support";

// Props 타입
interface SidebarProps {
  onNavigate?: (page: MenuId) => void;
  onBack?: () => void;
  onLogout?: () => void;
}

// 메뉴 데이터
const menuItems = [
  {
    id: "profile",
    label: "프로필 관리",
    icon: UserRound,
  },
  {
    id: "security",
    label: "계정 및 보안",
    icon: LockKeyhole,
  },
  {
    id: "settings",
    label: "설정",
    icon: Settings,
  },
  {
    id: "support",
    label: "고객센터",
    icon: Headset,
  },
] as const;

export default function Sidebar({
  onNavigate,
  onBack,
  onLogout,
}: SidebarProps) {
  const [activeMenu, setActiveMenu] = useState<MenuId>("profile");

  const handleMenuClick = (id: MenuId): void => {
    setActiveMenu(id);
    onNavigate?.(id);
  };

  return (
    <SidebarContainer>
      {/* 로고 */}
      <LogoArea>
        <Logo src={routyLogo} alt="Routy" />
      </LogoArea>

      {/* 프로필 */}
      <UserSection>
        <Avatar src={routyMascot} alt="프로필" />
        <UserName>홍길동님</UserName>
      </UserSection>

      {/* 메인 메뉴 */}
      <Navigation aria-label="계정 메뉴">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <MenuButton
            key={id}
            type="button"
            $active={activeMenu === id}
            aria-current={activeMenu === id ? "page" : undefined}
            onClick={() => handleMenuClick(id)}
          >
            <Icon size={17} strokeWidth={1.7} />
            <span>{label}</span>
          </MenuButton>
        ))}
      </Navigation>

      {/* 하단 메뉴 */}
      <Footer>
        <Divider />

        <FooterButton type="button" onClick={onBack}>
          <Plane size={20} strokeWidth={1.6} />
          <span>여행으로 돌아가기</span>
        </FooterButton>

        <FooterButton type="button" onClick={onLogout}>
          <LogOut size={18} strokeWidth={1.6} />
          <span>로그아웃</span>
        </FooterButton>
      </Footer>
    </SidebarContainer>
  );
}
