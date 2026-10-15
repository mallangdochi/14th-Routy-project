import { useState } from "react";
import {
  Bell,
  CalendarDays,
  CircleAlert,
  Database,
  Mail,
  MapPin,
  Megaphone,
} from "lucide-react";
import * as S from "./settingsStyle";

export type SettingsData = {
  inviteNotifications: boolean;
  itineraryNotifications: boolean;
  tripStartNotifications: boolean;
  locationServiceAllowed: boolean;
  marketingAllowed: boolean;
  defaultItineraryView: "schedule" | "map";
};

type SettingsProps = {
  savedSettings: SettingsData;
  onSave: (settings: SettingsData) => void;
};

type BrowserNotificationPermission =
  | NotificationPermission
  | "unsupported"
  | "insecure";

function getBrowserNotificationPermission(): BrowserNotificationPermission {
  if (typeof window === "undefined") return "unsupported";
  if (!("Notification" in window)) return "unsupported";
  if (!window.isSecureContext) return "insecure";
  return Notification.permission;
}

const permissionText: Record<BrowserNotificationPermission, string> = {
  granted: "허용됨",
  denied: "허용되지 않음",
  default: "허용되지 않음",
  unsupported: "지원하지 않는 브라우저",
  insecure: "보안 연결 필요",
};

function removeTemporaryData() {
  let removedCount = 0;

  for (const storage of [window.localStorage, window.sessionStorage]) {
    const keys: string[] = [];

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key?.startsWith("routy:temp:")) keys.push(key);
    }

    for (const key of keys) {
      storage.removeItem(key);
      removedCount += 1;
    }
  }

  return removedCount;
}

export default function Settings({ savedSettings, onSave }: SettingsProps) {
  const [draft, setDraft] = useState<SettingsData>(savedSettings);
  const [notificationPermission, setNotificationPermission] =
    useState<BrowserNotificationPermission>(getBrowserNotificationPermission);
  const [requestingPermission, setRequestingPermission] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState("");
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [clearMessage, setClearMessage] = useState("");

  const hasChanges = (Object.keys(draft) as (keyof SettingsData)[]).some(
    (key) => draft[key] !== savedSettings[key],
  );

  const setBooleanSetting = (
    key:
      | "inviteNotifications"
      | "itineraryNotifications"
      | "tripStartNotifications"
      | "locationServiceAllowed"
      | "marketingAllowed",
    value: boolean,
  ) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
  };

  const requestBrowserNotifications = async () => {
    const current = getBrowserNotificationPermission();
    setNotificationPermission(current);

    if (current !== "default") {
      setPermissionMessage(
        current === "denied"
          ? "브라우저의 사이트 설정에서 알림 권한을 변경해 주세요."
          : current === "granted"
            ? "이미 알림이 허용되어 있어요."
            : "이 환경에서는 알림 권한을 요청할 수 없어요.",
      );
      return;
    }

    setRequestingPermission(true);
    setPermissionMessage("");

    try {
      const next = await Notification.requestPermission();
      setNotificationPermission(next);
      setPermissionMessage(
        next === "granted"
          ? "브라우저 알림 권한이 허용되었어요."
          : "알림을 받으려면 브라우저에서 권한을 허용해 주세요.",
      );
    } catch {
      setPermissionMessage("알림 권한 요청 중 문제가 발생했어요.");
    } finally {
      setRequestingPermission(false);
    }
  };

  const clearTemporaryData = () => {
    try {
      const count = removeTemporaryData();
      setClearMessage(
        count > 0
          ? `라우티 임시데이터 ${count}건을 삭제했어요.`
          : "삭제할 라우티 임시데이터가 없어요.",
      );
    } catch {
      setClearMessage(
        "임시데이터를 삭제하지 못했어요. 브라우저 설정을 확인해 주세요.",
      );
    }

    setIsClearDialogOpen(false);
  };

  return (
    <S.SettingsContent $hasChanges={hasChanges}>
      <S.SettingsPageHeader>
        <S.SettingsHeading>
          <S.SettingsPageTitle>설정</S.SettingsPageTitle>
          <S.SettingsPageDescription>
            나에게 맞는 이용 환경을 설정해요.
          </S.SettingsPageDescription>
        </S.SettingsHeading>
      </S.SettingsPageHeader>

      <S.SettingsCard>
        <S.SettingsCardTitle>알림 설정</S.SettingsCardTitle>

        <S.SettingRow>
          <S.RowIcon aria-hidden="true">
            <Mail />
          </S.RowIcon>
          <S.SettingText>
            <S.SettingName>여행 초대 알림</S.SettingName>
            <S.SettingDescription>
              여행 초대가 도착하면 알려드려요.
            </S.SettingDescription>
          </S.SettingText>
          <S.ToggleButton
            type="button"
            role="switch"
            $checked={draft.inviteNotifications}
            aria-checked={draft.inviteNotifications}
            aria-label="여행 초대 알림"
            onClick={() =>
              setBooleanSetting(
                "inviteNotifications",
                !draft.inviteNotifications,
              )
            }
          />
        </S.SettingRow>

        <S.SettingDivider />

        <S.SettingRow>
          <S.RowIcon aria-hidden="true">
            <CalendarDays />
          </S.RowIcon>
          <S.SettingText>
            <S.SettingName>일정 변경 알림</S.SettingName>
            <S.SettingDescription>
              함께하는 여행의 일정 변경을 알려드려요.
            </S.SettingDescription>
          </S.SettingText>
          <S.ToggleButton
            type="button"
            role="switch"
            $checked={draft.itineraryNotifications}
            aria-checked={draft.itineraryNotifications}
            aria-label="일정 변경 알림"
            onClick={() =>
              setBooleanSetting(
                "itineraryNotifications",
                !draft.itineraryNotifications,
              )
            }
          />
        </S.SettingRow>

        <S.SettingDivider />

        <S.SettingRow>
          <S.RowIcon aria-hidden="true">
            <Bell />
          </S.RowIcon>
          <S.SettingText>
            <S.SettingName>여행 시작 알림</S.SettingName>
            <S.SettingDescription>
              여행 시작 전 알림을 받아요.
            </S.SettingDescription>
          </S.SettingText>
          <S.ToggleButton
            type="button"
            role="switch"
            $checked={draft.tripStartNotifications}
            aria-checked={draft.tripStartNotifications}
            aria-label="여행 시작 알림"
            onClick={() =>
              setBooleanSetting(
                "tripStartNotifications",
                !draft.tripStartNotifications,
              )
            }
          />
        </S.SettingRow>

        <S.PermissionPanel>
          <S.PermissionInfo>
            <CircleAlert size={25} aria-hidden="true" />
            <S.PermissionText>
              브라우저 알림 권한:
              <S.PermissionStatus
                $allowed={notificationPermission === "granted"}
              >
                {permissionText[notificationPermission]}
              </S.PermissionStatus>
            </S.PermissionText>
          </S.PermissionInfo>
          <S.PermissionButton
            type="button"
            onClick={requestBrowserNotifications}
            disabled={
              requestingPermission ||
              notificationPermission === "granted" ||
              notificationPermission === "unsupported" ||
              notificationPermission === "insecure"
            }
          >
            {requestingPermission ? "확인 중" : "알림 허용하기"}
          </S.PermissionButton>
        </S.PermissionPanel>
        {permissionMessage && (
          <S.Feedback role="status">{permissionMessage}</S.Feedback>
        )}
      </S.SettingsCard>

      <S.SettingsCard>
        <S.SettingsCardTitle>서비스 설정</S.SettingsCardTitle>
        <S.SettingRow>
          <S.RowIcon aria-hidden="true">
            <MapPin />
          </S.RowIcon>
          <S.SettingText>
            <S.SettingName>위치서비스</S.SettingName>
            <S.SettingDescription>
              현재 위치를 이용한 장소 추천을 허용할까요?
            </S.SettingDescription>
          </S.SettingText>
          <S.ChoiceGroup role="group" aria-label="위치서비스">
            <S.ChoiceButton
              type="button"
              $selected={draft.locationServiceAllowed}
              aria-pressed={draft.locationServiceAllowed}
              onClick={() => setBooleanSetting("locationServiceAllowed", true)}
            >
              허용
            </S.ChoiceButton>
            <S.ChoiceButton
              type="button"
              $selected={!draft.locationServiceAllowed}
              aria-pressed={!draft.locationServiceAllowed}
              onClick={() => setBooleanSetting("locationServiceAllowed", false)}
            >
              허용 안 함
            </S.ChoiceButton>
          </S.ChoiceGroup>
        </S.SettingRow>

        <S.SettingDivider />

        <S.SettingRow>
          <S.RowIcon aria-hidden="true">
            <Megaphone />
          </S.RowIcon>
          <S.SettingText>
            <S.SettingName>마케팅 수신</S.SettingName>
            <S.SettingDescription>
              이벤트와 혜택 소식 수신에 동의할까요?
            </S.SettingDescription>
          </S.SettingText>
          <S.ChoiceGroup role="group" aria-label="마케팅 수신">
            <S.ChoiceButton
              type="button"
              $selected={draft.marketingAllowed}
              aria-pressed={draft.marketingAllowed}
              onClick={() => setBooleanSetting("marketingAllowed", true)}
            >
              허용
            </S.ChoiceButton>
            <S.ChoiceButton
              type="button"
              $selected={!draft.marketingAllowed}
              aria-pressed={!draft.marketingAllowed}
              onClick={() => setBooleanSetting("marketingAllowed", false)}
            >
              허용 안 함
            </S.ChoiceButton>
          </S.ChoiceGroup>
        </S.SettingRow>

        <S.SettingDivider />

        <S.SettingRow>
          <S.RowIcon aria-hidden="true">
            <CalendarDays />
          </S.RowIcon>
          <S.SettingText>
            <S.SettingName>여행 일정 기본 보기</S.SettingName>
            <S.SettingDescription>
              여행을 열었을 때 먼저 표시할 화면이에요.
            </S.SettingDescription>
          </S.SettingText>
          <S.ChoiceGroup role="group" aria-label="여행 일정 기본 보기">
            <S.ChoiceButton
              type="button"
              $selected={draft.defaultItineraryView === "schedule"}
              aria-pressed={draft.defaultItineraryView === "schedule"}
              onClick={() =>
                setDraft((previous) => ({
                  ...previous,
                  defaultItineraryView: "schedule",
                }))
              }
            >
              일정표
            </S.ChoiceButton>
            <S.ChoiceButton
              type="button"
              $selected={draft.defaultItineraryView === "map"}
              aria-pressed={draft.defaultItineraryView === "map"}
              onClick={() =>
                setDraft((previous) => ({
                  ...previous,
                  defaultItineraryView: "map",
                }))
              }
            >
              지도
            </S.ChoiceButton>
          </S.ChoiceGroup>
        </S.SettingRow>
      </S.SettingsCard>

      <S.SettingsCard>
        <S.SettingsCardTitle>임시데이터</S.SettingsCardTitle>
        <S.SettingRow>
          <S.RowIcon aria-hidden="true">
            <Database />
          </S.RowIcon>
          <S.SettingText>
            <S.SettingName>
              브라우저에 저장된 임시데이터를 삭제해요.
            </S.SettingName>
            <S.SettingDescription>
              계정과 여행 기록은 유지됩니다.
            </S.SettingDescription>
          </S.SettingText>
          <S.ClearDataButton
            type="button"
            onClick={() => {
              setClearMessage("");
              setIsClearDialogOpen(true);
            }}
          >
            임시데이터 삭제
          </S.ClearDataButton>
        </S.SettingRow>
        {clearMessage && <S.Feedback role="status">{clearMessage}</S.Feedback>}
      </S.SettingsCard>

      <S.FloatingActionBar $visible={hasChanges} aria-hidden={!hasChanges}>
        <S.FloatingActionPanel
          $visible={hasChanges}
          role="region"
          aria-label="변경사항 저장"
        >
          <S.FloatingActionText>변경사항이 있어요.</S.FloatingActionText>

          <S.FloatingActionButtons>
            <S.FloatingResetButton
              type="button"
              disabled={!hasChanges}
              onClick={() => setDraft({ ...savedSettings })}
            >
              초기화
            </S.FloatingResetButton>

            <S.FloatingSaveButton
              type="button"
              disabled={!hasChanges}
              onClick={() => onSave({ ...draft })}
            >
              설정 저장
            </S.FloatingSaveButton>
          </S.FloatingActionButtons>
        </S.FloatingActionPanel>
      </S.FloatingActionBar>

      {isClearDialogOpen && (
        <S.DialogBackdrop>
          <S.DialogBox
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-data-title"
            aria-describedby="clear-data-description"
          >
            <S.DialogTitle id="clear-data-title">
              임시데이터를 삭제할까요?
            </S.DialogTitle>
            <S.DialogDescription id="clear-data-description">
              라우티의 임시 저장 데이터만 삭제하며, 계정과 여행 기록은 삭제하지
              않아요.
            </S.DialogDescription>
            <S.DialogActions>
              <S.DialogCancelButton
                type="button"
                onClick={() => setIsClearDialogOpen(false)}
              >
                취소
              </S.DialogCancelButton>
              <S.DialogConfirmButton type="button" onClick={clearTemporaryData}>
                삭제
              </S.DialogConfirmButton>
            </S.DialogActions>
          </S.DialogBox>
        </S.DialogBackdrop>
      )}
    </S.SettingsContent>
  );
}
