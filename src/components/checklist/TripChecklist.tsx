import { useEffect, useRef, useState } from "react";
import Checklist from "./Checklist";
import EmptyChecklist from "../emptyUI/checklist/Checklist";
import ChecklistModal, { type ChecklistEditor } from "../modal/addItem/ChecklistModal";
import Loader from "../loader/Loader";
import { getTripChecklist, saveTripChecklist, TripChecklistApiError, type TripChecklistResult, type ChecklistGroup } from "../../api/tripChecklist";

type Props = { tripId: string; canEdit: boolean };

export default function TripChecklist({ tripId, canEdit }: Props) {
  const [result, setResult] = useState<TripChecklistResult | null>(null);
  const [adding, setAdding] = useState(false);
  const [keepChecklistVisible, setKeepChecklistVisible] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const snapshot = useRef<TripChecklistResult | null>(null);
  const saving = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    void getTripChecklist(tripId, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      snapshot.current = data;
      setResult(data);
      setError("");
    }).catch(reason => {
      if (controller.signal.aborted) return;
      setError(reason instanceof Error ? reason.message : "체크리스트를 불러오지 못했습니다.");
    });
    return () => { mounted.current = false; controller.abort(); };
  }, [tripId, retry]);

  const persist = async (groups: ChecklistGroup[]) => {
    const current = snapshot.current;
    if (!current || current.tripId !== tripId || !canEdit || !current.canEdit) throw new Error("체크리스트를 수정할 권한이 없습니다.");
    if (saving.current) throw new Error("이전 변경사항을 저장하고 있습니다.");
    saving.current = true;
    try {
      const saved = await saveTripChecklist(tripId, current.version, groups);
      if (mounted.current) { snapshot.current = saved; setKeepChecklistVisible(true); setResult(saved); setError(""); }
    } catch (reason) {
      let message = reason instanceof Error ? reason.message : "체크리스트를 저장하지 못했습니다.";
      // 충돌·응답 유실 시 실제 저장 상태를 다시 읽습니다. 실패한 변경을 자동 재전송하지 않습니다.
      if (mounted.current) {
        try {
          const latest = await getTripChecklist(tripId);
          if (mounted.current) { snapshot.current = latest; setResult(latest); }
          if (reason instanceof TripChecklistApiError && reason.status === 409) message = "다른 참여자가 변경한 최신 목록을 불러왔습니다. 내용을 확인하고 다시 시도해주세요.";
        } catch {
          if (reason instanceof TripChecklistApiError && [401, 403].includes(reason.status)) {
            snapshot.current = null;
            setResult(null);
          }
        }
        if (mounted.current) setError(message);
      }
      throw new Error(message);
    } finally { saving.current = false; }
  };

  const addItems = async (values: ChecklistEditor[]) => {
    const current = snapshot.current;
    if (!current || current.tripId !== tripId) throw new Error("체크리스트를 먼저 불러와주세요.");
    const next = current.groups.map(group => ({ ...group, items: [...group.items] }));
    const normalize = (title: string) => title.trim().replace(/\s+/g, "").toLocaleLowerCase();
    const known = new Set(next.flatMap(group => group.items.map(item => normalize(item.title))));
    let count = 0;
    for (const value of values) {
      const title = value.title.trim();
      if (!title || known.has(normalize(title))) continue;
      const group = next.find(group => group.id === value.groupId);
      if (!group) throw new Error("준비물 카테고리를 확인해주세요.");
      group.items.push({ id: crypto.randomUUID(), title, description: value.description.trim(), checked: false });
      known.add(normalize(title));
      count++;
    }
    if (!count) throw new Error("이미 등록된 준비물이거나 준비물 이름이 비어 있습니다.");
    await persist(next);
  };

  if (!result || result.tripId !== tripId) {
    if (error) return <div role="alert"><p>{error}</p><button type="button" onClick={() => { setError(""); setRetry(value => value + 1); }}>다시 시도</button></div>;
    return <div role="status" aria-label="체크리스트를 불러오는 중"><Loader /></div>;
  }
  return <>
    {error && <p role="alert">{error}</p>}
    {(keepChecklistVisible || result.groups.some(group => group.items.length > 0)) ? (
      <Checklist groups={result.groups} onChange={persist} canEdit={canEdit && result.canEdit} onEditComplete={() => setKeepChecklistVisible(false)} />
    ) : (
      <EmptyChecklist canEdit={canEdit && result.canEdit} onAdd={() => setAdding(true)} />
    )}
    {adding && (
      <ChecklistModal
        initialValue={{ groupId: result.groups[0].id, title: "", description: "" }}
        groups={result.groups}
        onSave={value => addItems([value])}
        onSaveBatch={addItems}
        onClose={() => setAdding(false)}
      />
    )}
  </>;
}
