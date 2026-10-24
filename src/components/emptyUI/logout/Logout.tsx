import { useNavigate } from "react-router";
import { ChevronRight, Plane } from "lucide-react";
import mascot from "../../../assets/where.webp";
import * as S from "./LogoutStyle";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <S.Layout>
      <S.PageWrapper>
        {/* 페이지 상단 */}
        <S.PageHeader>
          <h1>내 여행 일정</h1>
          <p>여행을 계획하고, 추억을 만들어보세요.</p>
        </S.PageHeader>

        {/* 로그아웃 상태 메인 배너 */}
        <S.EmptyBanner>
          {/* 마스코트 이미지 */}
          <S.BannerImageArea>
            <S.MascotImage
              src={mascot}
              alt="지도를 들고 여행지를 찾는 Routy 마스코트"
            />
          </S.BannerImageArea>

          {/* 로그인 안내 */}
          <S.BannerContent>
            <S.BannerTitle>
              어디로 <span>떠나볼까요?</span>
              <Plane aria-hidden="true" />
            </S.BannerTitle>

            <S.BannerDescription>
              로그인하고 나만의 여행을 계획해보세요.
              <br />
              Routy가 특별한 여정을 함께 만들어드릴게요.
            </S.BannerDescription>

            <S.BannerLoginButton type="button" onClick={handleLogin}>
              로그인하기
            </S.BannerLoginButton>

            <S.SignupRow>
              <span>아직 계정이 없으신가요?</span>

              <S.SignupButton type="button" onClick={handleSignup}>
                회원가입하기
                <ChevronRight size={17} />
              </S.SignupButton>
            </S.SignupRow>
          </S.BannerContent>
        </S.EmptyBanner>
      </S.PageWrapper>
    </S.Layout>
  );
}
