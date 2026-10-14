import { Link } from "react-router";
import { useState, type MouseEvent } from "react";

import { LinkStyle, MobileProfile, NavStyle, UlStyle } from "./mobileStyle";
import { Briefcase, Heart, Plus, Search, UserRound } from "lucide-react";

type MenuName = "travel" | "search" | "saved" | "settings";

export default function MobileNav() {
  const [selectedMenu, setSelectedMenu] = useState<MenuName | null>(null);

  const handleMenuClick = (
    event: MouseEvent<HTMLAnchorElement>,
    menu: MenuName,
  ) => {
    event.preventDefault();
    setSelectedMenu(menu);
  };

  return (
    <NavStyle>
      <UlStyle>
        <li>
          <LinkStyle
            to="#"
            className={selectedMenu === "travel" ? "is-selected" : ""}
            onClick={(event) => handleMenuClick(event, "travel")}
          >
            <Briefcase size={23} strokeWidth={1.8} aria-hidden="true" />
            <span className="move-loc">내 여행</span>
          </LinkStyle>
        </li>
        <li>
          <LinkStyle
            to="#"
            className={selectedMenu === "search" ? "is-selected" : ""}
            onClick={(event) => handleMenuClick(event, "search")}
          >
            <Search size={23} aria-hidden="true" />
            <span className="move-loc">검색</span>
          </LinkStyle>
        </li>
        <li>
          <Link to="#">
            <MobileProfile className="profile-container">
              <Plus size={25} strokeWidth={3} />
            </MobileProfile>
            <span className="sr-only">새 여행 만들기</span>
          </Link>
        </li>
        <li>
          <LinkStyle
            to="#"
            className={selectedMenu === "saved" ? "is-selected" : ""}
            onClick={(event) => handleMenuClick(event, "saved")}
          >
            <Heart size={23} strokeWidth={1.5} aria-hidden="true" />
            <span className="move-loc">좋아요</span>
          </LinkStyle>
        </li>
        <li>
          <LinkStyle
            to="#"
            className={selectedMenu === "settings" ? "is-selected" : ""}
            onClick={(event) => handleMenuClick(event, "settings")}
          >
            <UserRound size={23} strokeWidth={1.3} aria-hidden="true" />
            <span className="move-loc">프로필</span>
          </LinkStyle>
        </li>
      </UlStyle>
    </NavStyle>
  );
}
