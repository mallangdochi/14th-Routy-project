import { Mail, Share2 } from "lucide-react";
import * as S from "../modal/share/ShareModalStyle";
import * as O from "./ShareOtherMethodsStyle";
import { loadKakaoShareSDK } from "../../utils/kakaoShare";
import { useEffect } from "react";

type Props = {
  tripName: string;
  /** 시간표 등 별도로 공유할 본문. 생략하면 기존 여행 초대 문구를 사용합니다. */
  shareText?: string;
  busy: boolean;
  ensureInvite: () => Promise<string | null>;
  openRef: { current: boolean };
  setMessage: (message: string) => void;
};

/** 카카오톡·LINE·이메일 공유 UI와 클릭 동작을 관리합니다. */
export default function ShareOtherMethods({
  tripName,
  shareText,
  busy,
  ensureInvite,
  openRef,
  setMessage,
}: Props) {
  useEffect(() => {
    void loadKakaoShareSDK().catch(() => {
      // 사전 로드 실패 시 공유 버튼 클릭으로 재시도합니다.
    });
  }, []);

  const shareEmail = async () => {
    const url = await ensureInvite();
    if (!url || !openRef.current) return;
    const body = shareText ? `${shareText}\n\n${url}` : url;
    window.location.href = `mailto:?subject=${encodeURIComponent(`${tripName} 일정 공유`)}&body=${encodeURIComponent(body)}`;
  };

  // LINE 공식 공유 URL로 문구와 초대 링크를 전달합니다.
  const shareLine = async () => {
    const popup = window.open("about:blank", "_blank");
    if (popup) popup.opener = null;

    try {
      const url = await ensureInvite();
      if (!url || !openRef.current) {
        popup?.close();
        return;
      }

      const params = new URLSearchParams({
        url,
        text: shareText?.trim() || `[Routy] ${tripName} 여행에 초대합니다.`,
      });
      const lineUrl =
        `https://social-plugins.line.me/lineit/share?${params.toString()}`;

      if (popup && !popup.closed) {
        popup.location.replace(lineUrl);
      } else {
        window.location.assign(lineUrl);
      }
    } catch {
      popup?.close();
      if (openRef.current) {
        setMessage("LINE 공유를 준비하지 못했습니다. 다시 시도해주세요.");
      }
    }
  };

  const shareKakao = async () => {
    try {
      const kakao = await loadKakaoShareSDK();
      if (!openRef.current) return;

      const url = await ensureInvite();
      if (!url || !openRef.current) return;

      kakao.Share.sendDefault({
        objectType: "text",
        text: shareText?.trim() || `[Routy] ${tripName} 여행에 초대합니다.`,
        link: {
          webUrl: url,
          mobileWebUrl: url,
        },
        buttonTitle: "여행 일정 보기",
      });
    } catch (error: unknown) {
      if (!openRef.current) return;

      setMessage(
        error instanceof Error
          ? error.message
          : "카카오톡 공유 창을 열지 못했습니다. 다시 시도해주세요.",
      );
    }
  };

  return (
    <S.ShareSection>
      <S.ShareSectionTitle>
        <Share2 size={16} />
        <strong>다른 방법으로 공유</strong>
      </S.ShareSectionTitle>
      <O.SharePlatformList>
        <O.SharePlatformButton
          type="button"
          disabled={busy}
          onClick={() => void shareKakao()}
        >
          <O.SharePlatformIcon $platform="kakao">
            <O.KakaoBubble />
          </O.SharePlatformIcon>
          <span>카카오톡</span>
        </O.SharePlatformButton>

        <O.SharePlatformButton
          type="button"
          disabled={busy}
          onClick={() => void shareLine()}
        >
          <O.SharePlatformIcon $platform="line">
            <svg
              width="29"
              height="29"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
          </O.SharePlatformIcon>
          <span>LINE</span>
        </O.SharePlatformButton>
        <O.SharePlatformButton
          type="button"
          disabled={busy}
          onClick={() => void shareEmail()}
        >
          <O.SharePlatformIcon $platform="email">
            <Mail size={25} />
          </O.SharePlatformIcon>
          <span>이메일</span>
        </O.SharePlatformButton>
      </O.SharePlatformList>
    </S.ShareSection>
  );
}
