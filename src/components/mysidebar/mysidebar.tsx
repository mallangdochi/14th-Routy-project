import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  UserRound,
  LockKeyhole,
  Settings,
  Headset,
  Plane,
  LogOut,
  LogIn,
  type LucideIcon,
} from "lucide-react";

import routyLogo from "../../assets/routy-logo.svg";
import routyMascot from "../../assets/profile.webp";

import profileAvatar1 from "../../assets/profileAvatars/P1.webp";
import profileAvatar2 from "../../assets/profileAvatars/P2.webp";
import profileAvatar3 from "../../assets/profileAvatars/P3.webp";
import profileAvatar7 from "../../assets/profileAvatars/P7.webp";
import profileAvatar8 from "../../assets/profileAvatars/P8.webp";
import profileAvatar9 from "../../assets/profileAvatars/P9.webp";
import profileAvatar10 from "../../assets/profileAvatars/p10.webp";
import profileAvatar11 from "../../assets/profileAvatars/P11.webp";
import profileAvatar12 from "../../assets/profileAvatars/P12.webp";
import profileAvatar13 from "../../assets/profileAvatars/P13.webp";

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

import { useAuth } from "../../contexts/AuthContext";
import { logout } from "../../api/auth";

type MenuId = "profile" | "security" | "settings" | "support";

interface SidebarProps {
  profileImage?: string;
  onNavigate?: (page: MenuId) => void;
  onBack?: () => void;
}

interface MenuItem {
  id: MenuId;
  label: string;
  icon: LucideIcon;
  strokeWidth: number;
}

const DEFAULT_PROFILE_IMAGES: Record<string, string> = {
  P1: profileAvatar1,
  P2: profileAvatar2,
  P3: profileAvatar3,
  P7: profileAvatar7,
  P8: profileAvatar8,
  P9: profileAvatar9,
  P10: profileAvatar10,
  P11: profileAvatar11,
  P12: profileAvatar12,
  P13: profileAvatar13,
};

function getProfileImage(
  avatarUrl: string | null | undefined,
  fallbackImage: string,
): string {
  if (!avatarUrl) return fallbackImage;

  if (avatarUrl.startsWith("default:")) {
    const avatarId = avatarUrl.slice("default:".length);

    return DEFAULT_PROFILE_IMAGES[avatarId] ?? fallbackImage;
  }

  if (avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }

  return fallbackImage;
}

const menuItems = [
  {
    id: "profile",
    label: "프로필 관리",
    icon: UserRound,
    strokeWidth: 1.5,
  },
  {
    id: "security",
    label: "계정 및 보안",
    icon: LockKeyhole,
    strokeWidth: 1.5,
  },
  {
    id: "settings",
    label: "설정",
    icon: Settings,
    strokeWidth: 1.5,
  },
  {
    id: "support",
    label: "고객센터",
    icon: Headset,
    strokeWidth: 1.5,
  },
] satisfies readonly MenuItem[];

export default function Sidebar({
  profileImage = routyMascot,
  onNavigate,
  onBack,
}: SidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const isLoggedIn = Boolean(user);
  const profileName = user?.username?.trim() || "회원";

  const avatarSrc = getProfileImage(user?.avatarUrl, profileImage);

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const logoutPendingRef = useRef(false);

  const currentSection = pathname.split("/")[2];

  const activeMenu: MenuId | undefined =
    menuItems.find((item) => item.id === currentSection)?.id ??
    (isLoggedIn ? "profile" : undefined);

  const visibleMenuItems = isLoggedIn
    ? menuItems
    : menuItems.filter((item) => item.id === "support");

  const handleMenuClick = (id: MenuId): void => {
    if (onNavigate) {
      onNavigate(id);
      return;
    }

    navigate(`/mypage/${id}`);
  };

  const handleBack = (): void => {
    if (onBack) {
      onBack();
      return;
    }

    navigate("/");
  };

  const handleLogout = async (): Promise<void> => {
    if (logoutPendingRef.current) return;

    logoutPendingRef.current = true;
    setLogoutLoading(true);
    setLogoutError("");

    try {
      await logout();
      await refreshUser();

      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      navigate(isMobile ? "/login" : "/", {
        replace: true,
      });
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "로그아웃 처리 중 오류가 발생했습니다.",
      );
    } finally {
      logoutPendingRef.current = false;
      setLogoutLoading(false);
    }
  };

  return (
    <SidebarContainer data-logged-in={isLoggedIn}>
      <LogoArea to="/" aria-label="Routy 스타트 페이지로 이동">
        <Logo src={routyLogo} alt="Routy" />
      </LogoArea>

      <UserSection>
        {isLoggedIn ? (
          <Avatar
            key={`${user?.id}:${avatarSrc}`}
            src={avatarSrc}
            alt={`${profileName}님의 프로필 이미지`}
            onError={(event) => {
              const image = event.currentTarget;

              if (image.dataset.fallbackApplied === "true") return;

              image.dataset.fallbackApplied = "true";
              image.src = routyMascot;
            }}
          />
        ) : (
          <div className="guest-avatar" aria-hidden="true">
            <UserRound size={44} strokeWidth={1.7} />
          </div>
        )}

        <UserName>
          {isLoggedIn ? `${profileName}님` : "로그인이 필요해요"}
        </UserName>
      </UserSection>

      <Navigation aria-label="계정 메뉴">
        {visibleMenuItems.map(({ id, label, icon: Icon, strokeWidth }) => (
          <MenuButton
            key={id}
            type="button"
            $active={activeMenu === id}
            aria-current={activeMenu === id ? "page" : undefined}
            onClick={() => handleMenuClick(id)}
          >
            <Icon
              size={20}
              strokeWidth={strokeWidth + (activeMenu === id ? 0.8 : 0)}
              aria-hidden="true"
            />
            <span>{label}</span>
          </MenuButton>
        ))}
      </Navigation>

      <Footer>
        <Divider />

        <FooterButton type="button" onClick={handleBack}>
          <Plane size={22} strokeWidth={1.8} aria-hidden="true" />
          <span>여행으로 돌아가기</span>
        </FooterButton>

        {isLoggedIn ? (
          <FooterButton
            type="button"
            disabled={logoutLoading}
            aria-busy={logoutLoading}
            onClick={() => void handleLogout()}
          >
            <LogOut size={21} strokeWidth={1.8} aria-hidden="true" />
            <span>{logoutLoading ? "로그아웃 중..." : "로그아웃"}</span>
          </FooterButton>
        ) : (
          <FooterButton type="button" onClick={() => navigate("/login")}>
            <LogIn size={21} strokeWidth={1.8} aria-hidden="true" />
            <span>로그인</span>
          </FooterButton>
        )}

        {logoutError && <p role="alert">{logoutError}</p>}
      </Footer>
    </SidebarContainer>
  );
}
