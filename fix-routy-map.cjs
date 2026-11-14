#!/usr/bin/env node
/** Routy 지도 호환성 복구: 기존 파일을 덮어쓰지 않고 4가지 누락 export만 보완 */
const fs = require('node:fs');
const path = require('node:path');
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const checkOnly = args.has('--check');
const root = process.cwd();
const relative = 'src/components/map/RouteMapInfo.tsx';
const file = path.resolve(root, relative);
const REQUIRED = ['MapViewport','RouteHoverHint','buildDisplayRoutes','setRouteLineHoverStyle'];
const PATCH_MARKER = '// ROUTY_COMPAT_EXPORTS_V2';

// 전체 RouteMapInfo.tsx 교체 금지: 추가 함수만 연결해 기존 대중교통/택시비 코드를 보존합니다.
const PATCH = String.raw`
// ROUTY_COMPAT_EXPORTS_V2
/** Schedule 내부의 지도 SDK가 100% 크기를 갖도록 하는 뷰포트 */
export function MapViewport({ children }: { children: import('react').ReactNode }) {
  return <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 0 }}>{children}</div>;
}

/** 데스크톱에서 지도 경로/마커 위에 포인터를 올렸을 때 표시하는 안내 */
export function RouteHoverHint({ selection }: { selection: RouteSelection | null }) {
  if (!selection) return null;
  const heading = selection.kind === 'stop'
    ? String(selection.order) + '번 · ' + selection.stop.title
    : (selection.route.fromName || '출발') + ' → ' + (selection.route.toName || '도착');
  const description = selection.kind === 'stop'
    ? selection.stop.time || selection.stop.address || '등록된 장소'
    : ('isFallback' in selection.route && selection.route.isFallback === true)
      ? '방문 순서를 표시한 직선 안내선입니다. 실제 도로 경로가 아닙니다.'
      : [modeName(selection.route.mode), distanceLabel(selection.route.distanceMeters), durationLabel(selection.route.durationSeconds)].join(' · ');
  return <div role="status" style={{ position: 'absolute', zIndex: 10, top: 12, left: 12,
      maxWidth: 'min(360px, calc(100% - 24px))', pointerEvents: 'none',
      border: '1px solid #D7E6E5', borderRadius: 10, background: '#FFF',
      boxShadow: '0 4px 14px #0002', padding: '10px 14px', color: '#0A414B', fontSize: 15 }}>
    <strong style={{ display: 'block', marginBottom: 3 }}>{heading}</strong><span>{description}</span>
  </div>;
}

type RoutyRouteStop = {
  id: string | number;
  title: string;
  lat?: number;
  lng?: number;
  time?: string;
  address?: string;
  description?: string;
};

/** 실제 API 경로를 먼저 매칭하고, 없으면 방문순서 안내 직선으로만 표시 (요금/시간은 추정하지 않음). */
export function buildDisplayRoutes(
  stops: RoutyRouteStop[],
  routePaths: RouteLine[] = [],
  mode: TravelMode,
): Array<RouteLine & { isFallback: boolean }> {
  const isValid = (s: RoutyRouteStop) => typeof s.lat === 'number' && Number.isFinite(s.lat) &&
    typeof s.lng === 'number' && Number.isFinite(s.lng);
  const routes = routePaths.filter((line) => Array.isArray(line.path) && line.path.length >= 2 &&
    (line.mode === undefined || line.mode === mode));
  return stops.slice(0, -1).flatMap((from, idx) => {
    const to = stops[idx + 1];
    const order = idx + 1;
    // 다른 구간에 전용 경로를 잘못 적용하지 않도록 ID -> 순번 -> 전체 일치 순서를 사용합니다.
    const matched = routes.find((line) => line.fromId !== undefined && line.toId !== undefined &&
      String(line.fromId) === String(from.id) && String(line.toId) === String(to.id)) ??
      routes.find((line) => line.fromId === undefined && line.toId === undefined && line.order === order) ??
      (routes.length === stops.length - 1 && routes.every((line) =>
        line.fromId === undefined && line.toId === undefined && line.order === undefined)
        ? routes[idx] : undefined);
    if (!matched && (!isValid(from) || !isValid(to))) return [];
    const path: RoutePoint[] = matched ? matched.path
      : [{ lat: from.lat!, lng: from.lng! }, { lat: to.lat!, lng: to.lng! }];
    return [{
      ...(matched ?? {}),
      path,
      isFallback: !matched,
      order,
      fromId: from.id, toId: to.id,
      fromName: from.title, toName: to.title,
      fromAddress: from.address, toAddress: to.address,
      fromDescription: from.description, toDescription: to.description,
      fromTime: from.time, toTime: to.time,
      mode: matched?.mode ?? mode,
    }];
  });
}

/** 카카오 Polyline의 hover 상태 표시. 지도 SDK 인스턴스 형식과 충돌하지 않도록 구조적 타입 사용. */
export function setRouteLineHoverStyle(
  polyline: unknown,
  route: RouteLine & { isFallback?: boolean },
  hovered: boolean,
): void {
  const line = polyline as { setOptions?: (options: { strokeWeight: number; strokeOpacity: number }) => void } | null;
  if (!line || typeof line.setOptions !== 'function') return;
  const normalWeight = route.isFallback ? 5 : 9;
  line.setOptions({
    strokeWeight: hovered ? normalWeight + 3 : normalWeight,
    strokeOpacity: hovered ? 1 : route.isFallback ? 0.7 : 0.92,
  });
}
// END_ROUTY_COMPAT_EXPORTS_V2
`;

function hasExport(source, name) {
  const regex = new RegExp('\\bexport\\s+(?:declare\\s+)?(?:async\\s+)?(?:function|const|class)\\s+' + name + '\\b');
  return regex.test(source);
}
function hasDeclaration(source, name) {
  return new RegExp('\\b(?:function|const|class)\\s+' + name + '\\b').test(source);
}
try {
  if (!fs.existsSync(path.join(root, 'package.json'))) throw new Error('package.json이 없습니다. 프로젝트 최상위 폴더에서 실행하세요.');
  if (!fs.existsSync(file)) throw new Error(relative + ' 파일이 없습니다. 프로젝트 경로를 확인하세요.');
  const source = fs.readFileSync(file, 'utf8');
  const requiredTypes = ['RouteSelection','RouteLine','RoutePoint','TravelMode','modeName','distanceLabel','durationLabel'];
  for (const name of requiredTypes) if (!new RegExp('\\b' + name + '\\b').test(source)) {
    throw new Error(name + ' 타입/함수를 찾지 못했습니다. 현재 코드와 패치의 구조가 달라 중단합니다.');
  }
  const missing = REQUIRED.filter((name) => !hasExport(source, name));
  console.log('[대상] ' + relative);
  console.log('[완료된 항목] ' + REQUIRED.filter((name) => !missing.includes(name)).join(', '));
  console.log('[누락된 항목] ' + (missing.join(', ') || '없음'));
  if (checkOnly) {
    if (missing.length) throw new Error('누락 export ' + missing.length + '개가 남아 있습니다.');
    console.log('네 가지 export가 모두 존재합니다. npm run build로 타입도 확인하세요.');
    process.exit(0);
  }
  if (!missing.length) { console.log('이미 복구되어 수정하지 않았습니다.'); process.exit(0); }
  if (source.includes(PATCH_MARKER)) throw new Error('호환 코드가 일부만 적용되어 있습니다. 현재 파일 상태 확인이 필요합니다.');
  // 기존에 export 없이 선언되어 있다면 중복 함수 생성을 방지합니다.
  for (const name of missing) if (hasDeclaration(source, name)) {
    throw new Error(name + '이 이미 선언되어 있습니다. 중복 정의 위험으로 중단합니다.');
  }
  // 한 덩어리로 추가해 네 함수가 서로 참조하는 타입도 정상 적용되도록 합니다.
  if (missing.length !== REQUIRED.length) throw new Error('일부 export만 있는 비표준 상태입니다. 자동 수정하지 않습니다.');
  if (dryRun) { console.log('사전 검사 통과: 아래 네 export만 추가 가능하며 파일은 변경하지 않았습니다.'); process.exit(0); }
  const backup = file + '.before-routy-mapfix-' + new Date().toISOString().replace(/[:.]/g, '-') + '.bak';
  fs.writeFileSync(backup, source, { flag: 'wx' });
  fs.writeFileSync(file, source.replace(/\s*$/, '') + '\n' + PATCH + '\n');
  const updated = fs.readFileSync(file, 'utf8');
  if (!REQUIRED.every((name) => hasExport(updated, name))) throw new Error('쓰기 후 검사에서 누락 export가 발견되었습니다. 백업: ' + backup);
  console.log('[성공] 기존 코드를 유지하면서 네 가지 함수 추가 완료');
  console.log('[백업] ' + path.basename(backup));
  console.log('[다음] node fix-routy-map.cjs --check && npm run build');
} catch (e) {
  console.error('안전 중단: ' + (e instanceof Error ? e.message : String(e)));
  process.exitCode = 1;
}
