import { Search } from "lucide-react";
import { Link } from "react-router";
import saved from "../../../assets/saved.webp";
import { EmptySavedStyle } from "./EmptySavedStyle";

export default function EmptySaved() {
  return (
    <EmptySavedStyle>
      <div className="mascot-wrapper">
        <img src={saved} alt="" loading="eager" />
      </div>
      <div className="info">
        <h2>아직 저장한 장소가 없어요</h2>
        <div className="desc">
          <p>마음에 드는 장소의 북마크를 눌러</p>
          <p> 저장해보세요.</p>
        </div>
      </div>
      <Link to="/search" className="move-search">
        <Search size={23} />
        <span>여행지 검색하기</span>
      </Link>
    </EmptySavedStyle>
  );
}
