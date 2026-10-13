import styled from "@emotion/styled";

interface MenuButtonProps {
  $active: boolean;
}

export const SidebarContainer = styled.aside`
  width: 186px;
  min-width: 186px;
  height: 100vh;
  height: 100dvh;
  padding: 16px 16px 17px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  background: #005044;
  color: #ffffff;
  font-family: "Pretendard", sans-serif;

  @media (max-height: 520px) {
    overflow-y: auto;
  }
`;

export const LogoArea = styled.div`
  height: 36px;
  padding-left: 6px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const Logo = styled.img`
  width: 88px;
  height: auto;
  display: block;
  object-fit: contain;
`;

export const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 17px;
  flex-shrink: 0;
`;

export const Avatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
`;

export const UserName = styled.span`
  margin-top: 16px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
`;

export const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 24px;
`;

export const MenuButton = styled.button<MenuButtonProps>`
  width: 100%;
  height: 38px;
  padding: 0 13px;

  display: flex;
  align-items: center;
  gap: 11px;

  border: none;
  border-radius: 9px;

  background: ${({ $active }) => ($active ? "#edf8f5" : "transparent")};

  color: ${({ $active }) => ($active ? "#005044" : "#ffffff")};

  font-family: inherit;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-align: left;
  white-space: nowrap;
  cursor: pointer;

  transition:
    background 0.2s,
    color 0.2s;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ $active }) =>
      $active ? "#edf8f5" : "rgba(255,255,255,0.1)"};
  }
`;

export const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 3px;

  @media (max-height: 520px) {
    margin-top: 28px;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  margin-bottom: 14px;
  background: rgba(255, 255, 255, 0.35);
`;

export const FooterButton = styled.button`
  width: 100%;
  min-height: 38px;
  padding: 0 12px;

  display: flex;
  align-items: center;
  gap: 10px;

  border: none;
  border-radius: 8px;
  background: transparent;

  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;

  transition: background 0.2s;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
