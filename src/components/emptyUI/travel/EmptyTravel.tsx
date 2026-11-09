import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import emptyImg from "../../../assets/why.webp";

import {
  EmptyTravelStyle,
  ImgStyle,
  DescStyle,
  ButtonArea,
  ButtonStyle,
} from "./EmptyTravelStyle";

export default function EmptyTravel() {
  const navigate = useNavigate();

  return (
    <EmptyTravelStyle>
      {/* 마스코트 이미지 */}
      <ImgStyle>
        <img src={emptyImg} alt="일정 빈화면 마스코트" loading="eager" />
      </ImgStyle>

      {/* 안내 문구 */}
      <DescStyle>
        <h2>아직 등록된 일정이 없어요.</h2>

        <div className="phrase-wrapper">
          <p>지금 바로 새로운 여행을 계획하고,</p>
          <p>잊지 못할 특별한 순간들을 만들어보세요.</p>
        </div>
      </DescStyle>

      {/* 새 여행 만들기 버튼 */}
      <ButtonArea>
        <ButtonStyle type="button" onClick={() => navigate("/trips/new")}>
          <Plus size={20} strokeWidth={3} aria-hidden="true" />
          <span>새 여행 만들기</span>
        </ButtonStyle>
      </ButtonArea>
    </EmptyTravelStyle>
  );
}
