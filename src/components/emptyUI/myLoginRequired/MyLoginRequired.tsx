import { useId } from "react";
import { Link } from "react-router";
import { Headset } from "lucide-react";
import { LoginRequiredStyle } from "./myLoginRequiredStyle";
import mascote from "../../../assets/ROUTY2.svg";

export default function MyLoginRequired() {
  const titleId = useId();

  return (
    <LoginRequiredStyle>
      <header className="login-required-header">
        <h1>마이페이지</h1>
        <p>나만의 여행 설정을 관리해요.</p>
      </header>

      <section className="login-required-card" aria-labelledby={titleId}>
        <img className="login-required-image" src={mascote} alt="" />
        <h2 id={titleId}>
          <span>로그인하고 나만의</span> <span>여행을 준비해요</span>
        </h2>
        <p className="login-required-description">
          <span>프로필부터 알림까지,</span>{" "}
          <span>내 정보를 한곳에서 관리하세요.</span>
        </p>
        <Link className="login-required-button" to="/login">
          로그인하기
        </Link>
        {/* <p className="login-required-signup">
          <span>아직 회원이 아니신가요?</span>
          <Link to="/signup">회원가입</Link>
        </p> */}
      </section>

      <Link className="login-required-support" to="/mypage/support">
        <Headset size={22} aria-hidden="true" />
        <span>고객센터</span>
      </Link>
    </LoginRequiredStyle>
  );
}
