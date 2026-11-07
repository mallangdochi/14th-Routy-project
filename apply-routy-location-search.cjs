/** Apply the map/location integration without overwriting the entire team Schedule page.
 * Usage: node apply-routy-location-search.cjs --dry-run
 *        node apply-routy-location-search.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
const target = path.join(root, 'src/pages/tripDetailPage/Schedule.tsx');
const dryRun = process.argv.includes('--dry-run');
if (!fs.existsSync(path.join(root, 'package.json')) || !fs.existsSync(target)) {
  console.error('⛔ 프로젝트 최상위(package.json 위치)에서 실행해 주세요.');
  process.exit(1);
}
const original = fs.readFileSync(target, 'utf8');
const crlf = original.includes('\r\n');
let source = original.replace(/\r\n/g, '\n');
let currentStep = '';
const changes = [];
const replace = (from, to, name) => {
  currentStep = name;
  if (source.includes(to)) { changes.push(`SKIP: ${name} (already applied)`); return; }
  const n = source.split(from).length - 1;
  if (n !== 1) throw new Error(`${name}: 안전한 삽입 지점을 찾지 못했습니다 (일치 ${n}회). 파일을 수정하지 않습니다.`);
  source = source.replace(from, to);
  changes.push(`PATCH: ${name}`);
};
try {
  replace(
    'import KakaoMap from "../../components/kakaoMap/KakaoMap";',
    'import KakaoMap from "../../components/kakaoMap/KakaoMap";\nimport MapSearchOverlay, { type SearchedMapPlace } from "../../components/map/MapSearchOverlay";\nimport { getAllowedCurrentLocation, LOCATION_CHANGE_EVENT } from "../../utils/locationService";',
    'map search/location imports',
  );
  replace(
    '  const [routePaths, setRoutePaths] = useState<RouteLine[]>([]);',
    '  const [routePaths, setRoutePaths] = useState<RouteLine[]>([]);\n  const [mapPlaceSaving, setMapPlaceSaving] = useState(false);',
    'map place saving state',
  );
  replace(
`  // 카카오 지도에서 선택한 장소 추가
  const addPlaceFromKakao = (place: KakaoPlace) => {
    updateStops((previous) => [
      ...previous,
      {
        id: Date.now(),
        title: place.name,
        time: selectedTrip.startTime,
        description: "카카오 지도에서 추가한 장소",
        address: place.address,
        category: "관광지",
        image: defaultTripImage,
        x: 50,
        y: 50,
        lat: place.lat,
        lng: place.lng,
      },
    ]);
  };`,
`  // 지도 검색 결과의 장소를 DB에 저장합니다. 화면 상태만 바꾸지 않습니다.
  const addPlaceFromKakao = async (place: SearchedMapPlace | KakaoPlace): Promise<void> => {
    if (!canEditTrip) throw new Error("일정을 편집할 권한이 없습니다.");
    if (scheduleSaveLock.current) throw new Error("다른 일정 저장이 진행 중입니다.");

    const added: Stop = {
      id: Date.now(),
      placeId: "id" in place && place.id ? place.id : "map-" + place.lat + "-" + place.lng,
      title: place.name,
      time: selectedTrip.startTime,
      description: "description" in place && place.description ? place.description : "카카오 지도에서 선택한 장소",
      address: place.address,
      category: "category" in place ? place.category : "관광지",
      image: defaultTripImage,
      x: 50,
      y: 50,
      stayDurationMinutes: 60,
      transport: modalDefaultTransport,
      lat: place.lat,
      lng: place.lng,
    };
    scheduleSaveLock.current = true;
    setMapPlaceSaving(true);
    try {
      const saved = await appendTripPlaces(String(selectedTrip.id), activeDay.isoDate, [added]);
      const previousVersion = scheduleVersionRef.current;
      if (!isEditMode || saved.version === previousVersion + 1) {
        scheduleVersionRef.current = saved.version;
      }
      const persisted = createStoredStopsByDay(saved, days.map((day) => day.isoDate));
      const mergeAdded = (previous: Record<number, Stop[]>) => {
        const oldDay = previous[activeDay.id] ?? [];
        const persistedDay = persisted[activeDay.id] ?? [];
        const newStops = persistedDay.filter((stop) =>
          stop.placeId === added.placeId &&
          !oldDay.some((entry) => entry.id === stop.id),
        );
        return { ...previous, [activeDay.id]: [...oldDay, ...newStops] };
      };
      if (isEditMode) {
        setStopsByDay(mergeAdded);
        if (editAllSnapshotRef.current) {
          editAllSnapshotRef.current = mergeAdded(editAllSnapshotRef.current);
        }
      } else {
        setStopsByDay(persisted);
      }
      setShowSaveStatus(true);
    } finally {
      scheduleSaveLock.current = false;
      setMapPlaceSaving(false);
    }
  };`,
    'persist searched places with tripPlaces API',
  );
  replace(
`                    )}
                  </S.MapCanvas>

                  {!(activeTab === "schedule") && (`,
`                    )}
                    {(activeTab === "schedule" || activeTab === "map") && (
                      <MapSearchOverlay
                        key={activeTab + ":" + activeDayId}
                        region={tripRegion}
                        canAdd={canEditTrip && !mapPlaceSaving}
                        onAddPlace={addPlaceFromKakao}
                        onFocus={(lat, lng) => {
                          window.dispatchEvent(new CustomEvent("routy:map:focus", {
                            detail: { lat, lng },
                          }));
                        }}
                      />
                    )}
                  </S.MapCanvas>

                  {!(activeTab === "schedule") && (`,
    'search overlay on schedule and map tabs',
  );
  replace(
`  const layersRef = useRef<OverlayInstance[]>([]);
  const locatedRef = useRef<LocatedStop[]>([]);`,
`  const layersRef = useRef<OverlayInstance[]>([]);
  const userLocationOverlayRef = useRef<OverlayInstance | null>(null);
  const locatedRef = useRef<LocatedStop[]>([]);`,
    'current-location map marker ref',
  );
  replace(
`  // 일정/날짜 변경 시 위치를 다시 찾되, API 응답이 늦게 오면 기존 결과를 표시하지 않습니다.`,
`  // 지도 검색 결과를 선택하거나 현재 위치 버튼을 누르면 지도 중심으로 이동합니다.
  useEffect(() => {
    if (!sdk) return;
    const focus = (event: Event) => {
      const point = (event as CustomEvent<{ lat: number; lng: number }>).detail;
      if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lng)) return;
      const map = mapRef.current;
      if (!map) return;
      map.setCenter(new sdk.LatLng(point.lat, point.lng));
      map.setLevel(4);
    };
    window.addEventListener("routy:map:focus", focus);
    return () => window.removeEventListener("routy:map:focus", focus);
  }, [sdk]);

  // 사용자 위치 좌표는 메모리에서만 사용하며 DB/로컬 저장소에 기록하지 않습니다.
  useEffect(() => {
    const map = mapRef.current;
    if (!sdk || !map) return;
    let cancelled = false;
    const refresh = () => {
      userLocationOverlayRef.current?.setMap(null);
      userLocationOverlayRef.current = null;
      void getAllowedCurrentLocation().then((location) => {
        if (cancelled || !location) return;
        const bubble = document.createElement("div");
        bubble.textContent = "● 현재 위치";
        bubble.setAttribute("aria-label", "내 현재 위치");
        bubble.style.cssText = "background:#0B626A;color:white;padding:6px 10px;border:2px solid white;border-radius:16px;font-size:15px;font-weight:700;box-shadow:0 2px 10px #0004;white-space:nowrap;";
        const overlay = new sdk.CustomOverlay({
          map,
          position: new sdk.LatLng(location.lat, location.lng),
          content: bubble,
          yAnchor: 1,
          zIndex: 15,
        });
        userLocationOverlayRef.current = overlay;
        if (stops.length === 0) {
          map.setCenter(new sdk.LatLng(location.lat, location.lng));
          map.setLevel(5);
        }
      }).catch(() => { /* GPS 거부/실패 시 기존 일정 지도 유지 */ });
    };
    refresh();
    window.addEventListener(LOCATION_CHANGE_EVENT, refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(LOCATION_CHANGE_EVENT, refresh);
      userLocationOverlayRef.current?.setMap(null);
      userLocationOverlayRef.current = null;
    };
  }, [sdk, stops.length]);

  // 일정/날짜 변경 시 위치를 다시 찾되, API 응답이 늦게 오면 기존 결과를 표시하지 않습니다.`,
    'map focus and geolocation marker',
  );
  const newImports = source.includes('import MapSearchOverlay');
  const newHandler = source.includes('const addPlaceFromKakao = async');
  const overlay = source.includes('<MapSearchOverlay');
  const focus = source.includes('window.addEventListener("routy:map:focus", focus)');
  if (![newImports, newHandler, overlay, focus].every(Boolean)) throw new Error('검증 실패: 필수 연결이 일부 누락되었습니다.');
  const output = crlf ? source.replace(/\n/g, '\r\n') : source;
  console.log('Project:', root);
  console.log('Target: ', target);
  for (const change of changes) console.log(' -', change);
  if (dryRun) {
    console.log('✅ 사전 검사 통과: 파일을 변경하지 않았습니다.');
  } else if (output === original) {
    console.log('✅ 이미 모두 적용된 상태입니다.');
  } else {
    const backup = target + `.before-location-search-${Date.now()}.bak`;
    fs.copyFileSync(target, backup);
    fs.writeFileSync(target, output, 'utf8');
    console.log('✅ 수정 완료. 원본 백업:', backup);
  }
} catch (error) {
  console.error(`⛔ ${currentStep}: ${error.message}`);
  process.exitCode = 1;
}
