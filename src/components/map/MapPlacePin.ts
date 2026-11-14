import { spreadPinPositions } from "./routeOverlapGeometry";
import type { MapStopInfo } from "./RouteMapInfo";
type PinOptions = {
  stop: MapStopInfo; order: number; total: number; isTouch: boolean;
  container: HTMLElement; sdk: unknown; map: unknown;
  onActiveChange?: (active: boolean) => void;
};
type MapEvents = { event: { addListener(target: object, name: string, fn: () => void): void; removeListener(target: object, name: string, fn: () => void): void; preventMap?(): void } };
const CLOSE = "routy-place-pin-close";
export function closeMapPlacePins(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>("[data-routy-place-pin]").forEach(pin => { pin.dispatchEvent(new Event(CLOSE)); });
}
/** One rich place popup: hover/focus on hover-capable devices, tap to toggle on touch devices. */
export function createMapPlacePin(options: PinOptions): { element: HTMLElement; destroy: () => void } {
  const { stop, order, total, container } = options;
  const sdk = options.sdk as MapEvents;
  const baseColor = order === 1 || order === total ? "#5B8F3B" : "#006D70";
  const marker = document.createElement("div");marker.className="route-map-marker";marker.dataset.routyPlacePin="true";marker.dataset.routyPinOrder=String(order);
  marker.style.cssText="position:relative;width:44px;height:54px;";
  const button=document.createElement("button");button.type="button";button.className="route-map-pin";
  button.style.cssText="position:relative;display:block;width:44px;height:54px;padding:0;border:0;background:transparent;cursor:pointer;transform-origin:50% 100%;";
  const role=total===1?"출발·도착":order===1?"출발지":order===total?"도착지":"경유지";
  button.setAttribute("aria-label",`${order}번 ${role} ${stop.title}${stop.time?` · ${stop.time}`:""}`);
  button.setAttribute("aria-expanded","false");
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("width","44");svg.setAttribute("height","54");svg.setAttribute("viewBox","0 0 44 54");svg.setAttribute("aria-hidden","true");
  const path=document.createElementNS("http://www.w3.org/2000/svg","path");
  path.setAttribute("d","M22 2C11 2 3 10 3 21c0 13 19 30 19 30s19-17 19-30C41 10 33 2 22 2Z");path.setAttribute("fill",baseColor);path.setAttribute("stroke","white");path.setAttribute("stroke-width","3");svg.append(path);
  const number=document.createElement("span");number.className="route-map-pin-number";number.textContent=String(order);number.style.cssText="position:absolute;top:7px;left:0;right:0;text-align:center;color:#fff;font-size:20px;font-weight:700;line-height:28px;pointer-events:none";button.append(svg,number);
  const tooltip=document.createElement("div");tooltip.className="route-map-tooltip";tooltip.hidden=true;
  tooltip.id=`routy-place-${order}-${String(stop.id).replace(/[^a-zA-Z0-9_-]/g,"_")}`;
  tooltip.setAttribute("role", "tooltip");button.setAttribute("aria-describedby",tooltip.id);
  tooltip.style.cssText="position:absolute;left:50%;bottom:calc(100% + 18px);transform:translateX(-50%);display:none;flex-direction:column;gap:6px;width:max-content;max-width:260px;box-sizing:border-box;white-space:normal;padding:12px 14px;border:1px solid #DCEBE9;border-radius:10px;background:#fff;box-shadow:0 3px 12px rgba(13,62,65,.16);color:#0D3E41;font:14px/1.5 Pretendard,sans-serif;z-index:30;overflow-wrap:anywhere;";
  const title=document.createElement("strong");title.textContent=stop.title;title.style.cssText="font-size:15px;color:#0D3E41";
  const time=document.createElement("span");time.textContent=stop.time?`일정 시간 ${stop.time}`:"일정 시간 미정";time.style.color="#596D75";tooltip.append(title,time);
  for(const text of [stop.address,stop.description])if(text?.trim()){const row=document.createElement("span");row.textContent=text;row.style.color="#596D75";tooltip.append(row);}
  // There is intentionally no time-label node below the pin.
  marker.append(button,tooltip);
  let active=false,disposed=false,hideTimer:ReturnType<typeof setTimeout>|undefined,frame=0,ignoreClickUntil=0;
  const positionPopup=()=>{
    if(!active||disposed)return;
    tooltip.style.maxWidth=`${Math.max(0,Math.min(260,container.clientWidth-16))}px`;
    tooltip.style.top="auto";tooltip.style.bottom="calc(100% + 18px)";tooltip.style.transform="translateX(-50%)";
    const bounds=container.getBoundingClientRect();let rect=tooltip.getBoundingClientRect();
    if(rect.top<bounds.top+8){tooltip.style.bottom="auto";tooltip.style.top="calc(100% + 12px)";rect=tooltip.getBoundingClientRect();}
    const dx=rect.left<bounds.left+8?bounds.left+8-rect.left:rect.right>bounds.right-8?bounds.right-8-rect.right:0;
    const dy=rect.bottom>bounds.bottom-8?bounds.bottom-8-rect.bottom:0;
    tooltip.style.transform=`translate(calc(-50% + ${dx}px), ${dy}px)`;
  };
  const hide=()=>{clearTimeout(hideTimer);active=false;path.setAttribute("fill",baseColor);tooltip.hidden=true;tooltip.style.display="none";marker.dataset.selected="false";marker.dataset.active="false";button.setAttribute("aria-expanded","false");options.onActiveChange?.(false);};
  const show=()=>{
    if(disposed)return;
    clearTimeout(hideTimer);
    container.querySelectorAll<HTMLElement>("[data-routy-place-pin]").forEach(other=>{if(other!==marker)other.dispatchEvent(new Event(CLOSE));});
    active=true;path.setAttribute("fill","#EB654B");tooltip.hidden=false;tooltip.style.display="flex";marker.dataset.active="true";marker.dataset.selected="true";button.setAttribute("aria-expanded","true");options.onActiveChange?.(true);
    window.cancelAnimationFrame(frame);frame=window.requestAnimationFrame(positionPopup);
  };
  marker.addEventListener(CLOSE,hide);
  marker.addEventListener("mouseenter",()=>{if(!options.isTouch)show();});
  marker.addEventListener("mouseleave",()=>{if(!options.isTouch){clearTimeout(hideTimer);hideTimer=setTimeout(hide,100);}});
  button.addEventListener("focus",()=>{if(!options.isTouch)show();});
  button.addEventListener("blur",()=>{if(!options.isTouch)hide();});
  button.addEventListener("pointerdown",event=>{event.stopPropagation();sdk.event.preventMap?.();});
  button.addEventListener("click",event=>{event.stopPropagation();sdk.event.preventMap?.();ignoreClickUntil=Date.now()+180;if(options.isTouch){if(active)hide();else show();}});
  button.addEventListener("keydown",event=>{if(event.key==="Escape")hide();});
  const mapClick=()=>{if(Date.now()>=ignoreClickUntil)hide();};
  sdk.event.addListener(options.map as object,"click",mapClick);sdk.event.addListener(options.map as object,"idle",positionPopup);
  return {element:marker,destroy:()=>{disposed=true;clearTimeout(hideTimer);window.cancelAnimationFrame(frame);sdk.event.removeListener(options.map as object,"click",mapClick);sdk.event.removeListener(options.map as object,"idle",positionPopup);marker.removeEventListener(CLOSE,hide);}};
}

/** Recalculate display-only offsets after zoom, pan, resize and initial mounting. */
export function mountPlacePinLayout(options: {
  map: unknown; sdk: unknown; container: HTMLElement;
  pins: Array<{element:HTMLElement;lat:number;lng:number}>;
}): () => void {
  type Coordinate={getLat():number;getLng():number};
  const sdk=options.sdk as MapEvents & {LatLng:new(lat:number,lng:number)=>Coordinate};
  const map=options.map as {getProjection():{containerPointFromCoords(coord:Coordinate):{x:number;y:number}}};
  let frame=0,disposed=false;
  const redraw=()=>{
    if(disposed)return;
    const pins=[...options.pins].sort((a,b)=>Number(a.element.dataset.routyPinOrder??0)-Number(b.element.dataset.routyPinOrder??0));
    const points=pins.map(pin=>map.getProjection().containerPointFromCoords(new sdk.LatLng(pin.lat,pin.lng)));
    const positions=spreadPinPositions(points,{width:options.container.clientWidth,height:options.container.clientHeight});
    pins.forEach((pin,i)=>{
      const dx=positions[i].x-points[i].x,dy=positions[i].y-points[i].y;
      pin.element.style.transform=`translate(${dx}px, ${dy}px)`;
      pin.element.querySelector('[data-pin-leader]')?.remove();
      if(Math.hypot(dx,dy)<1)return;
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.dataset.pinLeader='true';svg.setAttribute('width','44');svg.setAttribute('height','54');svg.setAttribute('aria-hidden','true');
      svg.style.cssText='position:absolute;inset:0;overflow:visible;pointer-events:none;z-index:-1;';
      const line=document.createElementNS(svg.namespaceURI,'line');
      // Attach to the closest edge, preventing a lower pin's leader from crossing its body.
      const targetX=22-dx,targetY=54-dy;
      const endX=targetX<3?3:targetX>41?41:22;
      const endY=targetY<3?3:targetY>51?51:Math.max(10,Math.min(40,targetY));
      line.setAttribute('x1',String(22-dx));line.setAttribute('y1',String(54-dy));line.setAttribute('x2',String(endX));line.setAttribute('y2',String(endY));line.setAttribute('stroke','#0D5C52');line.setAttribute('stroke-width','1.5');
      const dot=document.createElementNS(svg.namespaceURI,'circle');dot.setAttribute('cx',String(22-dx));dot.setAttribute('cy',String(54-dy));dot.setAttribute('r','4');dot.setAttribute('fill','#0D5C52');dot.setAttribute('stroke','white');dot.setAttribute('stroke-width','2');svg.append(line,dot);pin.element.prepend(svg);
    });
    options.container.dispatchEvent(new Event('routy-pin-layout'));
  };
  const refresh=()=>{window.cancelAnimationFrame(frame);frame=window.requestAnimationFrame(redraw);};
  sdk.event.addListener(options.map as object,'idle',refresh);
  const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(refresh);observer?.observe(options.container);
  redraw();
  return ()=>{disposed=true;window.cancelAnimationFrame(frame);observer?.disconnect();sdk.event.removeListener(options.map as object,'idle',refresh);options.pins.forEach(pin=>{pin.element.style.transform='';pin.element.querySelector('[data-pin-leader]')?.remove();});};
}
