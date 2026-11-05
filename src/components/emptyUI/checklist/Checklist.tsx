import { ClipboardCheck, Plus } from "lucide-react";
import { ChecklistLayout, ChecklistPanel, StatusPanel } from "./ChecklistStyle";
import checkMascot from "../../../assets/checklist.webp";

type Props = {
  onAdd: () => void;
  canEdit: boolean;
};

// 빈 화면은 표시만 담당합니다. 모달과 저장은 TripChecklist에서 공통으로 처리합니다.
export default function EmptyChecklist({ onAdd, canEdit }: Props) {
  return (
    <ChecklistLayout>
      <header className="checklist-header">
        <h2>여행 준비 체크리스트</h2>
        <div className="checklist-actions">
          <button
            type="button"
            className="add-button"
            aria-haspopup="dialog"
            disabled={!canEdit}
            onClick={onAdd}
          >
            <Plus size={20} aria-hidden="true" />
            추가
          </button>
        </div>
      </header>
      <div className="checklist-body">
        <ChecklistPanel aria-label="준비물 목록">
          <div className="checklist-empty">
            <img className="empty-mascot" src={checkMascot} alt="" />
            <h3>아직 체크리스트가 없어요</h3>
            <p>
              여행에 필요한 준비물을 추가하고
              <br />
              빠짐없이 챙겨보세요.
            </p>
          </div>
        </ChecklistPanel>
        <StatusPanel aria-label="준비 현황">
          <h2>준비 현황</h2>
          <div className="status-numbers">
            <p className="status-count">
              <strong>0</strong>
              <span>개 등록</span>
            </p>
            <span className="status-percent">0%</span>
          </div>
          <progress className="status-progress" value={0} max={1} aria-label="여행 준비 완료율" />
          <div className="status-guide" aria-live="polite">
            <ClipboardCheck aria-hidden="true" />
            <strong>여행 준비를 시작해요</strong>
            <p>
              <span>준비물을 추가하면</span>
              <span>완료 현황을 확인할 수 있어요.</span>
            </p>
          </div>
        </StatusPanel>
      </div>
    </ChecklistLayout>
  );
}
