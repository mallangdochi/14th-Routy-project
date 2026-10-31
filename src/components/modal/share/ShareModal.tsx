import { useState } from "react";
import { Copy, Eye, Link, Mail, Pencil, Share2, Users, X } from "lucide-react";
import modalMascote from "../../../assets/go.webp";
import * as S from "./ShareModalStyle";

type Permission = "editor" | "viewer";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripName: string;
};

export default function ShareModal({ isOpen, onClose, tripId, tripName }: Props) {
  const [permission, setPermission] = useState<Permission>("viewer");
  if (!isOpen) return null;
  return <ShareContent key={tripId} onClose={onClose} tripId={tripId} tripName={tripName}
    permission={permission} setPermission={setPermission} />;
}

function ShareContent({ onClose, tripId, tripName, permission, setPermission }: Omit<Props, "isOpen"> & {
  permission: Permission;
  setPermission: (permission: Permission) => void;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/trip-schedule/${encodeURIComponent(tripId)}` : "";

  const copyShareLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); }
    catch { alert("링크 복사에 실패했습니다."); }
  };

  return (
    <S.ShareOverlay onClick={onClose}>
      <S.ShareModal role="dialog" aria-modal="true" aria-label="여행 공유하기"
        onClick={(event) => event.stopPropagation()}>
        <S.ShareBanner>
          <S.ShareBannerText><h2>여행 공유하기</h2><p>함께 여행을 계획해 보세요</p></S.ShareBannerText>
          <S.ShareMascot aria-hidden="true"><img src={modalMascote} alt="" /></S.ShareMascot>
          <S.ShareCloseButton type="button" onClick={onClose} aria-label="닫기"><X size={20} /></S.ShareCloseButton>
        </S.ShareBanner>
        <S.ShareModalBody>
          <S.ShareSection>
            <S.ShareSectionTitle><Users size={16} /><strong>접근 권한</strong></S.ShareSectionTitle>
            <S.PermissionList>
              <S.PermissionCard type="button" $active={permission === "editor"}
                aria-pressed={permission === "editor"} onClick={() => setPermission("editor")}>
                <S.PermissionRadio $active={permission === "editor"} />
                <S.PermissionInfo>
                  <S.PermissionName><Pencil size={18} /><strong>편집자</strong></S.PermissionName>
                  <span>일정 확인 및 수정 가능</span>
                </S.PermissionInfo>
              </S.PermissionCard>
              <S.PermissionCard type="button" $active={permission === "viewer"}
                aria-pressed={permission === "viewer"} onClick={() => setPermission("viewer")}>
                <S.PermissionRadio $active={permission === "viewer"} />
                <S.PermissionInfo>
                  <S.PermissionName><Eye size={18} /><strong>보기 전용</strong></S.PermissionName>
                  <span>일정 확인만 가능</span>
                </S.PermissionInfo>
              </S.PermissionCard>
            </S.PermissionList>
          </S.ShareSection>
          <S.ShareSection>
            <S.ShareSectionTitle><Link size={16} /><strong>공유 링크</strong></S.ShareSectionTitle>
            <S.ShareLinkBox>
              <S.ShareLinkText value={shareUrl} readOnly aria-label="여행 링크" />
              <S.CopyLinkButton type="button" onClick={copyShareLink}>
                <Copy size={15} />{copied ? "복사 완료" : "링크 복사"}
              </S.CopyLinkButton>
            </S.ShareLinkBox>
            <p>현재는 여행 소유자만 접근할 수 있습니다. 권한 선택은 아직 서버에 반영되지 않습니다.</p>
          </S.ShareSection>
          <S.ShareSection>
            <S.ShareSectionTitle><Share2 size={16} /><strong>다른 방법으로 공유</strong></S.ShareSectionTitle>
            <S.SharePlatformList>
              <S.SharePlatformButton type="button" onClick={() => alert("네이버 공유는 추후 연결 예정입니다.")}>
                <S.SharePlatformIcon $platform="naver">N</S.SharePlatformIcon>네이버
              </S.SharePlatformButton>
              <S.SharePlatformButton type="button" onClick={() => alert("카카오톡 공유는 추후 연결 예정입니다.")}>
                <S.SharePlatformIcon $platform="kakao"><S.KakaoBubble /></S.SharePlatformIcon>카카오톡
              </S.SharePlatformButton>
              <S.SharePlatformButton type="button" onClick={() => {
                window.location.href = `mailto:?subject=${encodeURIComponent(`${tripName} 일정 공유`)}&body=${encodeURIComponent(shareUrl)}`;
              }}>
                <S.SharePlatformIcon $platform="email"><Mail size={25} /></S.SharePlatformIcon>이메일
              </S.SharePlatformButton>
            </S.SharePlatformList>
          </S.ShareSection>
        </S.ShareModalBody>
      </S.ShareModal>
    </S.ShareOverlay>
  );
}
