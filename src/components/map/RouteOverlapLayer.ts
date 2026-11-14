import type { RouteLine, RouteSelection } from "./RouteMapInfo";
import { distanceToSegment, separateRouteLanes, routeMidpoint, pathDistance, findBadgePosition, rectsOverlap, type ScreenRect, type ScreenPoint, type RoutedLane } from "./routeOverlapGeometry";

type Coord = { getLat(): number; getLng(): number };
type Projection = {
  containerPointFromCoords(coord: Coord): ScreenPoint;
  coordsFromContainerPoint(point: ScreenPoint): Coord;
};
type MapSurface = { getProjection(): Projection };
type Layer = { setMap(map: unknown): void; setOptions?(options: Record<string, unknown>): void };
type MapEvent = { latLng?: Coord };
type Listener = (event?: MapEvent) => void;
type SDK = {
  LatLng: new (lat: number, lng: number) => Coord;
  Point: new (x: number, y: number) => ScreenPoint;
  Polyline: new (options: Record<string, unknown>) => Layer;
  CustomOverlay: new (options: Record<string, unknown>) => Layer;
  event: {
    addListener(target: object, event: string, listener: Listener): void;
    removeListener(target: object, event: string, listener: Listener): void;
    preventMap?(): void;
  };
};
type Options = {
  sdk: unknown; map: unknown; container: HTMLElement; routes: RouteLine[]; isTouch: boolean;
  onHover: (selection: RouteSelection | null) => void;
  onSelect: (selection: RouteSelection) => void;
  onClear?: () => void;
  pinPositions?: Array<{ lat: number; lng: number }>;
};
const GREEN = "#0D5C52", CORAL = "#EB654B";
const label = (r: RouteLine) => `${r.order ?? 1} → ${(r.order ?? 1) + 1}`;

/** Owns only route display overlays. All API coordinates, distances and durations remain untouched. */
export function mountRouteOverlapLayer(options: Options): { setMap: (map: unknown) => void; clearSelection: () => void } {
  const sdk = options.sdk as SDK, map = options.map as MapSurface;
  const routes = options.routes.filter(r => r.path.length > 1);
  const layers: Layer[] = [];
  let lines = new Map<number, Layer>();
  let badges = new Map<number, HTMLElement>();
  let lanes: RoutedLane[] = [];
  let selected: number | null = null, hovered: number | null = null;
  let disposed = false, frame = 0;
  let ignoreMapClickUntil = 0;
  let removeLayerListeners: Array<() => void> = [];
  const info = (index: number): RouteSelection => ({ kind: "route", route: routes[index], order: routes[index].order ?? index + 1 });
  const listen = (target: object, name: string, fn: Listener) => {
    sdk.event.addListener(target, name, fn);
    removeLayerListeners.push(() => sdk.event.removeListener(target, name, fn));
  };
  const project = (coord: Coord) => map.getProjection().containerPointFromCoords(coord);
  const unproject = (p: ScreenPoint) => map.getProjection().coordsFromContainerPoint(new sdk.Point(p.x,p.y));
  const color = (index: number) => (hovered ?? selected) === index ? CORAL : GREEN;
  const paint = () => {
    lines.forEach((line,index) => { line.setOptions?.({ strokeColor: color(index), strokeWeight: routes[index].isFallback ? 4 : 6, zIndex: (hovered ?? selected) === index ? 2 : 1 }); });
    badges.forEach((badge,index) => { badge.style.color = color(index); badge.style.borderColor = color(index); badge.setAttribute("aria-pressed",String(selected === index)); });

  };
  const choose = (index: number) => { selected=index;hovered=null;paint();options.onHover(null);options.onSelect(info(index)); };
  const clearLayers = () => {
    removeLayerListeners.forEach(remove => { remove(); }); removeLayerListeners=[];
    layers.forEach(layer => { layer.setMap(null); }); layers.length=0;
    lines=new Map();badges=new Map();
  };
  const stopMap = (event: Event) => { ignoreMapClickUntil=Date.now()+180;event.stopPropagation();sdk.event.preventMap?.(); };
  const makeOverlay = (content: HTMLElement, position: Coord, zIndex=5) => {
    const overlay=new sdk.CustomOverlay({ map, position, content, xAnchor:0.5, yAnchor:0.5, zIndex });
    layers.push(overlay);return overlay;
  };
  const openAt = (index: number) => {
    ignoreMapClickUntil=Date.now()+180;
    choose(index);
  };
  const redraw = () => {
    if(disposed) return;
    clearLayers();
    lanes=separateRouteLanes(routes.map((route,index)=>({index,points:route.path.map(p=>project(new sdk.LatLng(p.lat,p.lng)))})));
    const pinPoints = options.pinPositions ?? routes.flatMap(route => [route.path[0], route.path[route.path.length-1]]);
    let pinBoxes: ScreenRect[] = pinPoints.map(point => {
      const p = project(new sdk.LatLng(point.lat,point.lng));
      return { x:p.x-34, y:p.y-72, width:68, height:84 };
    });
    const bounds=options.container.getBoundingClientRect();
    const displayedBoxes:ScreenRect[]=[];
    options.container.querySelectorAll<HTMLElement>('[data-routy-place-pin]').forEach(pin=>{
      const rect=pin.getBoundingClientRect();
      if(rect.width&&rect.height)displayedBoxes.push({x:rect.left-bounds.left-8,y:rect.top-bounds.top-8,width:rect.width+16,height:rect.height+16});
    });
    if(displayedBoxes.length)pinBoxes=displayedBoxes;
    const occupied: ScreenRect[] = [...pinBoxes];
    // White casings first; then all colored strokes so casings cannot hide another leg.
    lanes.forEach(lane=>{ layers.push(new sdk.Polyline({map,path:lane.points.map(unproject),strokeColor:'#FFFFFF',strokeWeight:routes[lane.index].isFallback?7:10,strokeOpacity:0.95,strokeStyle:routes[lane.index].isFallback?'shortdash':'solid',zIndex:0})); });
    lanes.forEach(lane=>{
      const index=lane.index,route=routes[index];
      const line=new sdk.Polyline({map,path:lane.points.map(unproject),strokeColor:color(index),strokeWeight:route.isFallback?4:6,strokeOpacity:route.isFallback?0.65:0.96,strokeStyle:route.isFallback?'shortdash':'solid',zIndex:1});
      layers.push(line);lines.set(index,line);
      listen(line,'click',()=>{if(options.isTouch){sdk.event.preventMap?.();openAt(index);}});
      // Direction markers follow the geometry, including reverse trips; no arrows on unqueried straight fallback lines.
      let walked=0,count=0;
      for(let i=1;i<lane.points.length&&!route.isFallback;i++){
        const a=lane.points[i-1],b=lane.points[i];walked+=Math.hypot(b.x-a.x,b.y-a.y);
        if(walked<85||count>=18)continue;
        walked=0;const x=(a.x+b.x)/2,y=(a.y+b.y)/2;
        if(x<12||y<12||x>options.container.clientWidth-12||y>options.container.clientHeight-12)continue;
        if(pinBoxes.some(box=>rectsOverlap({x:x-8,y:y-8,width:16,height:16},box)))continue;
        count++;
        const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent='›';
        arrow.style.cssText=`display:block;color:#fff;font:bold 24px/14px sans-serif;pointer-events:none;transform:rotate(${Math.atan2(b.y-a.y,b.x-a.x)}rad);text-shadow:0 0 1px ${GREEN};`;
        makeOverlay(arrow,unproject({x,y}),1);
      }
    });
    // Reserve space beside longer legs before placing crowded, short-leg callouts.
    [...lanes].sort((a,b)=>pathDistance(b.points)-pathDistance(a.points)).forEach(lane=>{
      const index=lane.index,route=routes[index];
      const preferred=routeMidpoint(lane.points);
      const badgeWidth=Math.max(56,label(route).length*7+16),badgeHeight=28;
      const viewport={width:options.container.clientWidth,height:options.container.clientHeight};
      let place:ReturnType<typeof findBadgePosition>=null;
      place??=findBadgePosition(lane.points,occupied,viewport,preferred,badgeWidth,badgeHeight);
      if(!place)return;
      // Connect displaced callouts to the exact leg they describe.
      if(Math.hypot(place.x-place.anchor.x,place.y-place.anchor.y)>40){
        layers.push(new sdk.Polyline({map,path:[unproject(place.anchor),unproject(place)],strokeColor:GREEN,strokeWeight:1,strokeOpacity:0.65,strokeStyle:'shortdash',zIndex:0}));
      }
      occupied.push({x:place.x-badgeWidth/2,y:place.y-badgeHeight/2,width:badgeWidth,height:badgeHeight});
      const badge=document.createElement('button');badge.type='button';badge.textContent=label(route);
      badge.setAttribute('aria-label',`${label(route)} 이동 구간 선택`);
      badge.dataset.routyRouteIndex=String(index);
      badge.style.cssText=`border:1px solid ${color(index)};border-radius:14px;background:#fff;color:${color(index)};padding:4px 9px;box-sizing:border-box;width:${badgeWidth}px;height:${badgeHeight}px;font:600 11px Pretendard,sans-serif;box-shadow:0 2px 5px #0D3E4126;white-space:nowrap;cursor:pointer;`;
      badge.onclick=event=>{stopMap(event);if(options.isTouch)openAt(index);};badge.addEventListener('pointerdown',stopMap);
      badge.onfocus=()=>{if(!options.isTouch){hovered=index;paint();options.onHover(info(index));}};
      badge.onblur=()=>{hovered=null;paint();options.onHover(null);};
      badges.set(index,badge);makeOverlay(badge,unproject(place),6);
    });
    paint();
  };
  // One hover owner avoids late SDK mouseout events clearing a badge's tooltip.
  const setHovered = (index: number | null) => {
    if(hovered===index)return;
    hovered=index;paint();options.onHover(index===null?null:info(index));
  };
  const trackPointer = (event: PointerEvent) => {
    if(options.isTouch||event.pointerType==='touch')return;
    const target=event.target instanceof Element?event.target:null;
    const badge=target?.closest<HTMLElement>('[data-routy-route-index]');
    if(badge&&options.container.contains(badge)){
      setHovered(Number(badge.dataset.routyRouteIndex));return;
    }
    if(target?.closest('[data-routy-place-pin]')){setHovered(null);return;}
    const bounds=options.container.getBoundingClientRect();
    const point={x:event.clientX-bounds.left,y:event.clientY-bounds.top};
    let closest: number|null=null,nearest=12;
    for(const lane of lanes){
      for(let i=1;i<lane.points.length;i++){
        const distance=distanceToSegment(point,lane.points[i-1],lane.points[i]);
        if(distance<nearest){nearest=distance;closest=lane.index;}
      }
    }
    setHovered(closest);
  };
  const leaveMap = () => {if(!options.isTouch)setHovered(null);};
  options.container.addEventListener('pointermove',trackPointer,true);
  options.container.addEventListener('pointerleave',leaveMap);
  const refresh = () => { if(!disposed&&!frame)frame=window.requestAnimationFrame(()=>{frame=0;redraw();}); };
  const clearSelection = () => {selected=null;hovered=null;options.onHover(null);options.onClear?.();paint();};
  const closeOnMap = () => {if(Date.now()<ignoreMapClickUntil)return;clearSelection();};
  options.container.addEventListener('routy-pin-layout',refresh);
  sdk.event.addListener(map,'idle',refresh);
  sdk.event.addListener(map,'click',closeOnMap);
  const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(refresh);
  observer?.observe(options.container);
  redraw();
  return {clearSelection,setMap: target=>{
    if(target!==null||disposed)return;
    disposed=true;window.cancelAnimationFrame(frame);observer?.disconnect();
    options.container.removeEventListener('pointermove',trackPointer,true);
    options.container.removeEventListener('pointerleave',leaveMap);
    options.container.removeEventListener('routy-pin-layout',refresh);
    sdk.event.removeListener(map,'idle',refresh);sdk.event.removeListener(map,'click',closeOnMap);
    clearLayers();
  }};
}
