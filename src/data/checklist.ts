export type ChecklistItem = { id: string; title: string; description: string; checked: boolean };
export type ChecklistGroup = { id: string; title: string; items: ChecklistItem[] };
export const mockChecklist: ChecklistGroup[] = [
  { id: 'essential', title: '필수 준비물', items: [
    { id: 'ticket', title: '항공권 티켓', description: '항공권 예약, e티켓 출력', checked: true },
    { id: 'guide', title: '오프라인 가이드 다운로드', description: '제주도 지도, 맛집 리스트', checked: true },
    { id: 'id-card', title: '신분증', description: '주민등록증 또는 운전면허증', checked: true },
    { id: 'hotel', title: '숙소 예약 확인', description: '예약번호, 체크인 시간 재확인하기', checked: false },
  ] },
  { id: 'packing', title: '기본 짐싸기', items: [
    { id: 'wash', title: '세면용품', description: '칫솔, 치약, 샴푸, 스킨케어 등', checked: true },
    { id: 'clothes', title: '여벌 옷', description: '3일치, 날씨에 맞게 준비', checked: false },
    { id: 'charger', title: '충전기', description: '휴대폰, 카메라 등', checked: false },
    { id: 'battery', title: '보조 배터리', description: '여행 중 필수', checked: false },
    { id: 'medicine', title: '상비약', description: '진통제, 소화제, 밴드 등', checked: false },
  ] },
];
