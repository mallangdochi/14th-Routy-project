import { useState } from "react";
import {
  UserRound,
  LockKeyhole,
  Settings,
  Headset,
  Plane,
  LogOut,
} from "lucide-react";

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

const menuItems = [
  { id: "profile", label: "프로필 관리", icon: UserRound },
  { id: "security", label: "계정 및 보안", icon: LockKeyhole },
  { id: "settings", label: "설정", icon: Settings },
  { id: "support", label: "고객센터", icon: Headset },
];

export default function Sidebar({ onNavigate, onBack, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("profile");

  const handleMenuClick = (id) => {
    setActiveMenu(id);
    onNavigate?.(id);
  };

  return (
    <SidebarContainer>
      <LogoArea>
        <Logo src="/images/routy-logo-white.png" alt="Routy" />
      </LogoArea>

      <UserSection>
        <Avatar src="/images/routy-mascot.png" alt="프로필" />
        <UserName>홍길동님</UserName>
      </UserSection>

      <Navigation>
        {menuItems.map(({ id, label, icon: Icon }) => (
          <MenuButton
            key={id}
            type="button"
            $active={activeMenu === id}
            onClick={() => handleMenuClick(id)}
          >
            <Icon size={17} strokeWidth={1.7} />
            <span>{label}</span>
          </MenuButton>
        ))}
      </Navigation>

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
