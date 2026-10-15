import { Plus } from "lucide-react";
import emptyImg from "../../../assets/why.webp";
import {
  ButtonStyle,
  DescStyle,
  EmptyTravelStyle,
  ImgStyle,
} from "./EmptyTravelStyle";

export default function EmptyTravel() {
  return (
    <EmptyTravelStyle>
      <ImgStyle>
        <img src={emptyImg} alt="일정 빈화면 마스코트" loading="eager" />
      </ImgStyle>
      <DescStyle>
        <h2>아직 등록된 여행 일정이 없어요.</h2>
        <div className="phrase-wrapper">
          <p>지금 바로 새로운 여행을 계획하고,</p>
          <p>잊지 못할 특별한 순간들을 만들어보세요.</p>
        </div>
      </DescStyle>
      <ButtonStyle>
        <Plus size={20} strokeWidth={2} aria-hidden="true" />
        <span>새 여행 만들기</span>
      </ButtonStyle>
    </EmptyTravelStyle>
  );
}
