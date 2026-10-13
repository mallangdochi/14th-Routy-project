import { Link } from "react-router";
import { useState, type MouseEvent } from "react";
import reactLogo from "../../assets/react.svg";
import {
  LinkStyle,
  MobileProfile,
  NavStyle,
  SvgStyle,
  UlStyle,
} from "./mobileStyle";

type MenuName = "travel" | "search" | "favorites" | "settings";

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
            <SvgStyle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="currentColor"
                className="bi bi-suitcase-lg"
                viewBox="0 0 16 16"
              >
                <path d="M5 2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2h3.5A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5H14a.5.5 0 0 1-1 0H3a.5.5 0 0 1-1 0h-.5A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2zm1 0h4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1M1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H3V3zM15 12.5v-9a.5.5 0 0 0-.5-.5H13v10h1.5a.5.5 0 0 0 .5-.5m-3 .5V3H4v10z" />
              </svg>
            </SvgStyle>
            <span className="move-loc">내 여행</span>
          </LinkStyle>
        </li>
        <li>
          <LinkStyle
            to="#"
            className={selectedMenu === "search" ? "is-selected" : ""}
            onClick={(event) => handleMenuClick(event, "search")}
          >
            <SvgStyle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </SvgStyle>
            <span className="move-loc">검색</span>
          </LinkStyle>
        </li>
        <li>
          <LinkStyle
            to="#"
            className={selectedMenu === "favorites" ? "is-selected" : ""}
            onClick={(event) => handleMenuClick(event, "favorites")}
          >
            <SvgStyle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="currentColor"
                className="bi bi-bookmark"
                viewBox="0 0 16 16"
              >
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
              </svg>
            </SvgStyle>
            <span className="move-loc">즐겨찾기</span>
          </LinkStyle>
        </li>
        <li>
          <LinkStyle
            to="#"
            className={selectedMenu === "settings" ? "is-selected" : ""}
            onClick={(event) => handleMenuClick(event, "settings")}
          >
            <SvgStyle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="currentColor"
                className="bi bi-gear"
                viewBox="0 0 16 16"
              >
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
              </svg>
            </SvgStyle>
            <span className="move-loc">설정</span>
          </LinkStyle>
        </li>
        <li>
          <Link to="#">
            <MobileProfile className="profile-container">
              <img src={reactLogo} alt="프로필이미지" loading="lazy" />
            </MobileProfile>
            <span className="sr-only">마이페이지</span>
          </Link>
        </li>
      </UlStyle>
    </NavStyle>
  );
}
