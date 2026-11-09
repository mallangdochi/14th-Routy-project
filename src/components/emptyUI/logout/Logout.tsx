import { useNavigate } from "react-router";
import { Plane } from "lucide-react";
import mascot from "../../../assets/where.webp";
import * as S from "./LogoutStyle";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <S.Layout>
      <S.PageWrapper>
        {/* 페이지 상단 */}
        <S.PageHeader>
          <h1>내 여행 일정</h1>

          <S.PageSubtitle>여행을 계획하고, 추억을 만들어보세요.</S.PageSubtitle>
        </S.PageHeader>

        {/* 로그아웃 메인 배너 */}
        <S.EmptyBanner>
          <S.BannerContent>
            {/* 제목 + 설명 */}
            <S.BannerTextGroup>
              <S.BannerTitle>
                어디로 떠나볼까요?
                <Plane aria-hidden="true" />
              </S.BannerTitle>

              <S.BannerDescription className="basic">
                로그인하고 나만의 여행을
                <br />
                계획해보세요.
              </S.BannerDescription>

              <S.BannerDescription className="non-mobile">
                Routy가 특별한 여정을 함께 만들어드릴게요.
              </S.BannerDescription>
            </S.BannerTextGroup>

            {/* 마스코트 */}
            <S.BannerImageArea>
              <S.MascotImage
                src={mascot}
                alt="지도를 들고 여행지를 찾는 Routy 마스코트"
              />
            </S.BannerImageArea>

            {/* 로그인 버튼 */}
            <S.BannerButtonArea>
              <S.BannerLoginButton type="button" onClick={handleLogin}>
                로그인하기
              </S.BannerLoginButton>
            </S.BannerButtonArea>
          </S.BannerContent>
        </S.EmptyBanner>
      </S.PageWrapper>
    </S.Layout>
  );
}
