import { useLocation } from "react-router";
import {
  UserRound,
  LockKeyhole,
  Settings,
  Headset,
  Plane,
  LogOut,
} from "lucide-react";

import routyLogo from "../../assets/routy-logo.svg";
import routyMascot from "../../assets/profile.webp";

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

type MenuId = "profile" | "security" | "settings" | "support";

interface SidebarProps {
  profileName?: string;
  profileImage?: string;
  onNavigate?: (page: MenuId) => void;
  onBack?: () => void;
  onLogout?: () => void;
}

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
  profileName = "홍길동",
  profileImage = routyMascot,
  onNavigate,
  onBack,
  onLogout,
}: SidebarProps) {
  const { pathname } = useLocation();

  const currentSection = pathname.split("/")[2];

  const activeMenu: MenuId =
    menuItems.find((item) => item.id === currentSection)?.id ?? "profile";

  const handleMenuClick = (id: MenuId): void => {
    onNavigate?.(id);
  };

  return (
    <SidebarContainer>
      <LogoArea>
        <Logo src={routyLogo} alt="Routy" />
      </LogoArea>

      <UserSection>
        <Avatar src={profileImage} alt="프로필" />
        <UserName>{profileName}님</UserName>
      </UserSection>

      <Navigation aria-label="계정 메뉴">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <MenuButton
            key={id}
            type="button"
            $active={activeMenu === id}
            aria-current={activeMenu === id ? "page" : undefined}
            onClick={() => handleMenuClick(id)}
          >
            <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
            <span>{label}</span>
          </MenuButton>
        ))}
      </Navigation>

      <Footer>
        <Divider />

        <FooterButton type="button" onClick={onBack}>
          <Plane size={22} strokeWidth={1.8} aria-hidden="true" />
          <span>여행으로 돌아가기</span>
        </FooterButton>

        <FooterButton type="button" onClick={onLogout}>
          <LogOut size={21} strokeWidth={1.8} aria-hidden="true" />
          <span>로그아웃</span>
        </FooterButton>
      </Footer>
    </SidebarContainer>
  );
}
