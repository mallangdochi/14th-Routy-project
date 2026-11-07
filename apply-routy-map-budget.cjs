/* Routy targeted feature patch. Run from repository root with Node.js.
   --dry-run checks compatibility and does not write anything.
   Without flags, backs up every changed target before applying the patch.
*/
const fs = require("node:fs");
const path = require("node:path");
const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const files = {
  route: "src/components/Schedule/TravelRouteSummary.tsx",
  schedule: "src/pages/tripDetailPage/Schedule.tsx",
  budget: "src/components/travelBudget/TravelBudgetTab.tsx",
  data: "src/components/travelBudget/budgetData.ts",
  budgetStyle: "src/components/travelBudget/TravelBudgetTabStyle.ts",
};
const originals = Object.fromEntries(
  Object.entries(files).map(([id, rel]) => {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) throw new Error(`파일이 없습니다: ${rel}`);
    return [id, fs.readFileSync(full, "utf8").replace(/\r\n/g, "\n")];
  }),
);
function assertReplace(source, before, after, label) {
  if (after && source.includes(after)) return source; // already patched
  if (!source.includes(before))
    throw new Error(`예상 코드와 달라 적용 중단: ${label}`);
  return source.replace(before, after);
}
function requireAnchor(source, anchor, label) {
  if (!source.includes(anchor))
    throw new Error(`예상 코드와 달라 적용 중단: ${label}`);
}
function patchRoute(source) {
  if (
    source.includes("fromName: leg.from.title") &&
    source.includes("durationSeconds: leg.data?.durationSeconds")
  )
    return source;
  source = assertReplace(
    source,
    `export type TravelMode = "walk" | "bike" | "car" | "transit";
export type RoutePoint = { lat: number; lng: number };
export type RouteLine = { path: RoutePoint[] };`,
    `import type { RouteLine, RoutePoint, TravelMode } from "../map/RouteMapInfo";
export type { RouteLine, RoutePoint, TravelMode } from "../map/RouteMapInfo";`,
    "TravelRouteSummary 경로 타입",
  );
  source = assertReplace(
    source,
    `  title: string;
  lat?: number;
  lng?: number;
};`,
    `  title: string;
  time?: string;
  address?: string;
  description?: string;
  lat?: number;
  lng?: number;
};`,
    "TravelRouteSummary 방문 장소 타입",
  );
  source = assertReplace(
    source,
    `        onRoutesReady(
          next.flatMap((leg) =>
            leg.data?.path?.length ? [{ path: leg.data.path }] : [],
          ),
        );`,
    `        onRoutesReady(
          next.flatMap((leg, legIndex): RouteLine[] => {
            if (!leg.data || leg.data.path.length < 2) return [];
            return [{
              path: leg.data.path,
              order: legIndex + 1,
              fromId: leg.from.id,
              toId: leg.to.id,
              fromName: leg.from.title,
              toName: leg.to.title,
              fromTime: leg.from.time,
              toTime: leg.to.time,
              fromAddress: leg.from.address,
              toAddress: leg.to.address,
              fromDescription: leg.from.description,
              toDescription: leg.to.description,
              mode,
              distanceMeters: leg.data.distanceMeters,
              durationSeconds: leg.data.durationSeconds,
              transfers: leg.data.transfers,
              fareWon: leg.data.fareWon,
              link: leg.data.link,
            }];
          }),
        );`,
    "TravelRouteSummary 경로별 정보 전달",
  );
  return source;
}
function patchSchedule(source) {
  if (source.includes("Routy desktop route hover patch v1")) return source;
  source = assertReplace(
    source,
    `import * as S from "./ScheduleStyle";`,
    `import * as S from "./ScheduleStyle";
import { RouteMapDetails, routeColor, useTouchMap, type RouteSelection } from "../../components/map/RouteMapInfo";`,
    "Schedule 지도 정보 컴포넌트 import",
  );
  requireAnchor(source, "function createMarkerContent(", "일정 마커 함수");
  source = assertReplace(
    source,
    `  if (stop.address) {
    const address = document.createElement("span");
    address.textContent = stop.address;
    tooltip.append(address);
  }
  marker.append(button, tooltip);`,
    `  if (stop.address) {
    const address = document.createElement("span");
    address.textContent = stop.address;
    tooltip.append(address);
  }
  const description = (stop as KakaoStop & { description?: string }).description;
  if (description?.trim()) {
    const info = document.createElement("span");
    info.textContent = description;
    tooltip.append(info);
  }
  marker.append(button, tooltip);`,
    "Schedule 마커 상세 설명",
  );
  source = assertReplace(
    source,
    `  const [loading, setLoading] = useState(Boolean(KAKAO_KEY));

  useEffect(() => {`,
    `  const [loading, setLoading] = useState(Boolean(KAKAO_KEY));
  // Routy desktop route hover patch v1. Touch devices use the same expandable detail panel.
  const [routeSelection, setRouteSelection] = useState<RouteSelection | null>(null);
  const isTouchMap = useTouchMap();
  const routePinnedRef = useRef(false);

  useEffect(() => {`,
    "일정 지도 상세 상태",
  );
  // Replace only the map polyline construction block in ScheduleEditRouteMap,
  // bounded by the coordinatePoints marker loop to avoid replacing entire Schedule.
  const beginning =
    "    if (showRoute) {\n      const actualRoutes = routePaths.filter((leg) => leg.path.length >= 2);";
  const ending =
    "    coordinatePoints.forEach(({ stop, latitude, longitude }) => {";
  const start = source.indexOf(
    beginning,
    source.indexOf("function ScheduleEditRouteMap("),
  );
  const end = source.indexOf(ending, start);
  if (start < 0 || end < 0)
    throw new Error("예상 코드와 달라 적용 중단: 일정 지도 경로선 블록");
  source =
    source.slice(0, start) +
    `    const openRouteInfo = (info: RouteSelection, pinned: boolean) => {
      routePinnedRef.current = pinned;
      setRouteSelection(info);
    };
    const hoverRouteInfo = (info: RouteSelection) => {
      if (!isTouchMap && !routePinnedRef.current) setRouteSelection(info);
    };
    const leaveRouteInfo = () => {
      if (!isTouchMap && !routePinnedRef.current) setRouteSelection(null);
    };
    const kakaoEvent = (sdk as KakaoMapsSDK & {
      event?: { addListener(target: object, event: string, listener: () => void): void };
    }).event;
    if (showRoute) {
      const actualRoutes = routePaths.filter((leg) => leg.path.length >= 2);
      if (actualRoutes.length > 0) {
        actualRoutes.forEach((leg, index) => {
          const line = new sdk.Polyline({
            map,
            path: leg.path.map(({ lat, lng }) => new sdk.LatLng(lat, lng)),
            strokeWeight: 7,
            strokeColor: routeColor(leg.mode),
            strokeOpacity: 0.92,
            strokeStyle: "solid",
          });
          layersRef.current.push(line);
          const info: RouteSelection = { kind: "route", route: leg, order: leg.order ?? index + 1 };
          kakaoEvent?.addListener(line, "mouseover", () => hoverRouteInfo(info));
          kakaoEvent?.addListener(line, "mouseout", leaveRouteInfo);
          kakaoEvent?.addListener(line, "click", () => openRouteInfo(info, true));
        });
      } else if (coordinatePoints.length > 1) {
        // Route API failed or has not returned yet: straight visit-order lines only.
        // Never fabricate a road distance or travel duration.
        coordinatePoints.slice(1).forEach((to, i) => {
          const from = coordinatePoints[i];
          const line = new sdk.Polyline({
            map,
            path: [new sdk.LatLng(from.latitude, from.longitude), new sdk.LatLng(to.latitude, to.longitude)],
            strokeWeight: 4,
            strokeColor: "#6C9295",
            strokeOpacity: 0.75,
            strokeStyle: "shortdash",
          });
          layersRef.current.push(line);
          const info: RouteSelection = {
            kind: "route",
            order: i + 1,
            route: {
              path: [{ lat: from.latitude, lng: from.longitude }, { lat: to.latitude, lng: to.longitude }],
              order: i + 1,
              fromName: from.stop.title,
              toName: to.stop.title,
              fromTime: from.stop.time,
              toTime: to.stop.time,
              fromAddress: from.stop.address,
              toAddress: to.stop.address,
            },
          };
          kakaoEvent?.addListener(line, "mouseover", () => hoverRouteInfo(info));
          kakaoEvent?.addListener(line, "mouseout", leaveRouteInfo);
          kakaoEvent?.addListener(line, "click", () => openRouteInfo(info, true));
        });
      }
    }
` +
    source.slice(end);
  // Expand the existing dependency list for the map polyline / marker effect only.
  const fromIndex = source.indexOf("function ScheduleEditRouteMap(");
  const oldDeps =
    "  }, [sdk, stops, category, showRoute, routePaths, loading]);";
  const depIndex = source.indexOf(oldDeps, fromIndex);
  if (depIndex < 0)
    throw new Error("예상 코드와 달라 적용 중단: 지도 경로선 effect");
  source =
    source.slice(0, depIndex) +
    oldDeps.replace("loading]);", "loading, isTouchMap]);") +
    source.slice(depIndex + oldDeps.length);
  // Add an overlay for hover/click route details on the editable schedule map.
  const afterFunction = source.indexOf("function ScheduleEditRouteMap(");
  const oldCanvas = `    <S.EditMapRoot data-route-map-root>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%" }}
        aria-label="카카오 지도"
      />`;
  const canvasIndex = source.indexOf(oldCanvas, afterFunction);
  if (canvasIndex < 0)
    throw new Error("예상 코드와 달라 적용 중단: 일정 지도 캔버스");
  source =
    source.slice(0, canvasIndex) +
    oldCanvas +
    `
      <RouteMapDetails
        selection={routeSelection}
        isTouch={isTouchMap}
        onClose={() => { routePinnedRef.current = false; setRouteSelection(null); }}
      />` +
    source.slice(canvasIndex + oldCanvas.length);
  return source;
}
function patchBudget(source) {
  if (
    source.includes("budget-blank-slate") &&
    source.includes("expenses.some((expense) => groupForDate(expense.date)")
  )
    return source.replace(
      'import budgetMascot from \"../../assets/budgetMascot.png\";\n',
      "",
    );
  source = assertReplace(
    source,
    `import budgetMascot from "../../assets/budgetMascot.png";\n`,
    ``,
    "예산 기존 마스코트 빈 화면 import",
  );
  // Auto-generated empty Day groups are hidden; groups are shown when they have expenses.
  source = assertReplace(
    source,
    `  const visibleGroups = groups.filter(
    (group) => filter === "all" || filter === group.key,
  );`,
    `  const visibleGroups = groups.filter((group) =>
    (filter === "all" || filter === group.key) &&
    expenses.some((expense) => groupForDate(expense.date) === group.key),
  );`,
    "예산 Day 자동 빈 행 제거",
  );
  const oldEmpty = `            <div className="empty-ledger">
              <img src={budgetMascot} alt="계산기를 들고 있는 라우티 캐릭터" />
              <h3>아직 등록된 지출이 없어요</h3>
              <p>
                여행 중 사용한 비용을 기록하고
                <br />
                함께 예산을 관리해보세요.
              </p>
            </div>`;
  const newEmpty = `            <div className="budget-blank-slate" role="status">
              <h3>아직 지출 내역이 없습니다</h3>
              <p>지출을 추가하면 여행 날짜별로 가계부가 정리됩니다.</p>
              <button type="button" className="button-primary" onClick={() => openNew()}>
                <Plus size={18} aria-hidden="true" /> 첫 지출 추가
              </button>
            </div>`;
  source = assertReplace(source, oldEmpty, newEmpty, "예산 빈 화면 교체");
  // Remove the old redundant 0-won empty sidebar completely (normal expense sidebar stays).
  source = assertReplace(
    source,
    `        <aside className="summary-panel" aria-label="예산 현황">
          <div className="summary-card">
            {expenses.length > 0 ? (
              <div className="total-display">
                <span className="summary-label">◆ 총 지출</span>
                <strong>{formatWon(total)}</strong>
                <p>여행 전체 누적 지출</p>
              </div>
            ) : (
              <div className="empty-total">
                <h2>예산 현황</h2>
                <p>
                  총 지출 <strong>0</strong> 원
                </p>
                <div className="empty-progress" aria-hidden="true" />
              </div>
            )}`,
    `        {expenses.length > 0 && <aside className="summary-panel" aria-label="예산 현황">
          <div className="summary-card">
            <div className="total-display">
              <span className="summary-label">◆ 총 지출</span>
              <strong>{formatWon(total)}</strong>
              <p>여행 전체 누적 지출</p>
            </div>`,
    "예산 중복된 비어있는 예산현황 제거",
  );
  // The sidebar is shown only when expenses exist, so its previous empty tip is redundant.
  const oldTip = `            <div className="summary-tip">
              {expenses.length === 0 ? (
                <>
                  <Wallet size={49} strokeWidth={1.9} aria-hidden="true" />
                  <p>
                    지출을 추가하면
                    <br />
                    예산 현황을 확인할 수 있어요.
                  </p>
                </>
              ) : (
                <>
                  <strong>지출 내역을 한눈에 관리하세요</strong>
                  <p>
                    상세 그래프, 카테고리별 지출, 멤버별 결제 내역을 확인할 수
                    있어요.
                  </p>
                </>
              )}
            </div>`;
  source = assertReplace(
    source,
    oldTip,
    `            <div className="summary-tip">
              <strong>지출 내역을 한눈에 관리하세요</strong>
              <p>상세 그래프, 카테고리별 지출, 멤버별 결제 내역을 확인할 수 있어요.</p>
            </div>`,
    "기존 예산 현황 빈 설명 제거",
  );
  source = assertReplace(
    source,
    `        </aside>
      </div>`,
    `        </aside>}
      </div>`,
    "예산 현황 조건부 표시",
  );
  // Avoid duplicate buttons on the new empty page.
  const editButton = `              {expenses.length === 0 && (
                <button
                  type="button"
                  className="button-outline edit-button"
                  onClick={() => openNew()}
                >
                  <Pencil size={17} /> 편집
                </button>
              )}
`;
  // Some Routy versions have no empty-state edit button, or format it differently.
  // Its absence is not an error: do not abort the other validated patches.
  if (source.includes(editButton)) {
    source = source.replace(editButton, "");
  } else {
    // Remove only an explicitly empty-expenses-gated edit button when present.
    // Do not touch the normal edit controls for a populated ledger.
    const optionalEditButton =
      /\{expenses\.length\s*===\s*0\s*&&\s*\(\s*<button\b(?:(?!<\/button>)[\s\S])*?className=["']button-outline edit-button["'](?:(?!<\/button>)[\s\S])*?<\/button>\s*\)\}/g;
    const matches = [...source.matchAll(optionalEditButton)];
    if (matches.length === 1) {
      source = source.replace(optionalEditButton, "");
      console.log(
        "[안내] 예산 빈 화면 편집 버튼을 다른 서식에서 찾아 제거했습니다.",
      );
    } else if (matches.length === 0) {
      console.log("[안내] 예산 빈 화면 편집 버튼이 없어 제거를 건너뜁니다.");
    } else {
      throw new Error(
        "예산 빈 화면 편집 버튼이 여러 개 발견되어 안전하게 중단합니다.",
      );
    }
  }
  // Drop icon imports that became unused after removing the former empty states.
  // Only Wallet/Pencil in lucide-react imports are considered; other imports stay intact.
  source = source.replace(
    /import\s*\{([^}]*)\}\s*from\s*(["'])lucide-react\2\s*;?/g,
    (statement, members, quote) => {
      const rest = source.replace(statement, "");
      const icons = members
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
      const kept = icons.filter((item) => {
        const parts = item.split(/\s+as\s+/);
        const imported = parts[0];
        const local = parts[1] || imported;
        if (!["Wallet", "Pencil"].includes(imported)) return true;
        return new RegExp(`\\b${local}\\b`).test(rest);
      });
      if (kept.length === icons.length) return statement;
      return kept.length
        ? `import { ${kept.join(", ")} } from ${quote}lucide-react${quote};`
        : "";
    },
  );
  // Make the empty grid one column when the project has a literal grid class.
  // Keep existing dynamic className expressions unchanged.
  if (source.includes('className="budget-grid"')) {
    source = source.replace(
      'className="budget-grid"',
      'className={`budget-grid ${expenses.length === 0 ? "is-empty" : ""}`}',
    );
  }
  return source;
}
function patchBudgetStyle(source) {
  // The old script demanded one exact padding value, which differs across versions.
  // Find a real CSS-in-JS selector instead; do not silently omit the empty-state styles.
  if (/^[ \t]*["']& \.budget-blank-slate["']\s*:/m.test(source)) {
    return source; // already added
  }

  const anchor =
    /^[ \t]*(["'])& \.(?:ledger-panel|budget-grid|empty-ledger|summary-panel)\1\s*:/m.exec(
      source,
    );
  if (!anchor) {
    throw new Error(
      "가계부 스타일의 삽입 위치를 확인할 수 없습니다. " +
        "TravelBudgetTabStyle.ts에서 ledger-panel/budget-grid 선택자를 확인하세요.",
    );
  }

  // Insert sibling rules into the existing Emotion style object, retaining indentation.
  const start = anchor.index;
  const indentation = /^[ \t]*/.exec(anchor[0])[0];
  const additions = [
    '"& .budget-grid.is-empty": { gridTemplateColumns: "minmax(0, 1fr)" },',
    '"& .budget-blank-slate": {',
    '  minHeight: 300, padding: "32px 18px", display: "flex",',
    '  flexDirection: "column", alignItems: "center", justifyContent: "center",',
    '  gap: 15, textAlign: "center",',
    "},",
    '"& .budget-blank-slate h3": { margin: 0, fontSize: 22, fontWeight: 750, color: "#0A414B" },',
    '"& .budget-blank-slate p": { margin: 0, fontSize: 16, lineHeight: 1.5, color: "#778D90" },',
    '"& .budget-blank-slate .button-primary": { marginTop: 10, fontSize: 16, minHeight: 46 },',
  ];
  const added = additions.map((line) => indentation + line).join("\n") + "\n";
  return source.slice(0, start) + added + source.slice(start);
}
function patchBudgetData(source) {
  // 기존 데모 지출 주입 형태를 확인한 경우에만 수정합니다.
  // 이미 제거됐거나 데모 코드가 없는 프로젝트에서는 건너뜁니다.
  const demoReturn =
    /return\s+tripId\s*===\s*(["\'])(?:1)\1\s*\?\s*demoBudgetExpenses\(start\)\s*:\s*\[\]\s*;/g;
  const matches = [...source.matchAll(demoReturn)];
  if (matches.length > 1) {
    throw new Error("예산 데모 지출 자동 삽입 구문이 여러 개여서 중단합니다.");
  }
  if (matches.length === 1) {
    return source.replace(
      demoReturn,
      "// 신규 여행은 데모 지출 없이 시작합니다. 저장된 내역은 기존 로드 로직을 따릅니다.\n  void demoBudgetExpenses;\n  void start;\n  return [];",
    );
  }
  if (
    source.includes("demoBudgetExpenses(") &&
    !/^\s*(?:function|const)\s+demoBudgetExpenses\b/m.test(source)
  ) {
    throw new Error(
      "데모 지출 호출 방식이 달라 자동 수정을 중단합니다. budgetData.ts를 확인하세요.",
    );
  }
  console.log(
    "[안내] 기존 데모 지출 자동 삽입 구문이 없습니다. budgetData.ts 수정을 건너뜁니다.",
  );
  return source;
}

const updated = {
  route: patchRoute(originals.route),
  schedule: patchSchedule(originals.schedule),
  budget: patchBudget(originals.budget),
  data: patchBudgetData(originals.data),
  budgetStyle: patchBudgetStyle(originals.budgetStyle),
};
console.log(`프로젝트: ${root}`);
for (const [id, rel] of Object.entries(files)) {
  console.log(
    `${updated[id] === originals[id] ? "[변경 없음]" : "[수정 대상]"} ${rel}`,
  );
}
if (dryRun) {
  console.log(
    "\n점검 완료. 파일은 변경하지 않았습니다. 실제 적용: node apply-routy-map-budget.cjs",
  );
  process.exit(0);
}
const changed = Object.keys(updated).filter(
  (id) => updated[id] !== originals[id],
);
if (!changed.length) {
  console.log("이미 적용돼 있습니다. 변경사항이 없습니다.");
  process.exit(0);
}
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = path.join(root, "routy-map-budget-backup", stamp);
for (const id of changed) {
  const relative = files[id];
  const dest = path.join(backupDir, relative);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, originals[id], "utf8");
}
for (const id of changed) {
  fs.writeFileSync(path.join(root, files[id]), updated[id], "utf8");
}
console.log(`적용 완료. 백업 폴더: ${backupDir}`);
console.log("확인: npm run build");
