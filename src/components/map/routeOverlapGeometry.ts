export type ScreenPoint = { x: number; y: number };
export type ScreenRoute = { points: ScreenPoint[]; index: number };
export type RoutedLane = ScreenRoute & { original: ScreenPoint[]; shared: boolean[] };
const STEP = 12;
const CELL = 32;
const GAP = 12;
const sq = (n: number) => n * n;
export function distanceToSegment(p: ScreenPoint, a: ScreenPoint, b: ScreenPoint): number {
  const dx = b.x-a.x, dy = b.y-a.y;
  const t = Math.max(0, Math.min(1, ((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy || 1)));
  return Math.hypot(p.x-a.x-t*dx, p.y-a.y-t*dy);
}
export function samplePath(points: ScreenPoint[]): ScreenPoint[] {
  if (points.length < 2) return points.map(p=>({...p}));
  const length = points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-points[i].x,p.y-points[i].y),0);
  const step = Math.max(STEP, length/2500);
  const result = [{...points[0]}];
  for(let i=1;i<points.length;i++){
    const a=points[i-1],b=points[i],d=Math.hypot(b.x-a.x,b.y-a.y);
    if(d<0.01) continue;
    const n=Math.max(1,Math.ceil(d/step));
    for(let j=1;j<=n;j++) result.push({x:a.x+(b.x-a.x)*j/n,y:a.y+(b.y-a.y)*j/n});
  }
  return result;
}
type Segment={a:ScreenPoint;b:ScreenPoint;index:number;dx:number;dy:number};
/** Screen-space display only. Source geometry/metrics are never modified. Parallel roads must be within 5px. */
export function separateRouteLanes(routes: ScreenRoute[]): RoutedLane[] {
  const sampled=routes.map(r=>({...r,points:samplePath(r.points)}));
  const grid=new Map<string,Segment[]>();
  for(const route of sampled){
    for(let i=1;i<route.points.length;i++){
      const a=route.points[i-1],b=route.points[i],length=Math.hypot(b.x-a.x,b.y-a.y);
      if(length<0.01) continue;
      const seg={a,b,index:route.index,dx:(b.x-a.x)/length,dy:(b.y-a.y)/length};
      for(let x=Math.floor(Math.min(a.x,b.x)/CELL);x<=Math.floor(Math.max(a.x,b.x)/CELL);x++)
        for(let y=Math.floor(Math.min(a.y,b.y)/CELL);y<=Math.floor(Math.max(a.y,b.y)/CELL);y++){
          const key=`${x}:${y}`,cell=grid.get(key)??[];cell.push(seg);grid.set(key,cell);
        }
    }
  }
  return sampled.map(route=>{
    const raw=route.points.map((p,i)=>{
      const a=route.points[Math.max(0,i-1)],b=route.points[Math.min(route.points.length-1,i+1)];
      const length=Math.hypot(b.x-a.x,b.y-a.y)||1,dx=(b.x-a.x)/length,dy=(b.y-a.y)/length;
      const matches=new Map<number,{distance:number;dx:number;dy:number}>();
      matches.set(route.index,{distance:0,dx,dy});
      const cx=Math.floor(p.x/CELL),cy=Math.floor(p.y/CELL);
      for(let x=cx-1;x<=cx+1;x++)for(let y=cy-1;y<=cy+1;y++)for(const seg of grid.get(`${x}:${y}`)??[]){
        if(seg.index===route.index || Math.abs(seg.dx*dx+seg.dy*dy)<0.94) continue;
        const distance=distanceToSegment(p,seg.a,seg.b);
        if(distance<=5 && distance<(matches.get(seg.index)?.distance??Infinity))matches.set(seg.index,{distance,dx:seg.dx,dy:seg.dy});
      }
      const indices=[...matches.keys()].sort((x,y)=>x-y),reference=matches.get(indices[0])!;
      const lane=(indices.indexOf(route.index)-(indices.length-1)/2)*GAP;
      // Keep the route endpoints attached to the original pins.
      const taper=Math.min(1,i/2,(route.points.length-1-i)/2);
      return {x:-reference.dy*lane*taper,y:reference.dx*lane*taper,shared:indices.length>1};
    });
    const shifted=route.points.map((p,i)=>{
      if(i===0||i===route.points.length-1)return {...p};
      const neighbours=raw.slice(Math.max(0,i-1),Math.min(raw.length,i+2));
      return {x:p.x+neighbours.reduce((s,v)=>s+v.x,0)/neighbours.length,y:p.y+neighbours.reduce((s,v)=>s+v.y,0)/neighbours.length};
    });
    return {...route,original:route.points,points:shifted,shared:raw.map(p=>p.shared)};
  });
}
export function nearbyRouteIndices(point: ScreenPoint, routes: ScreenRoute[], radius=20): number[] {
  return routes.filter(r=>r.points.slice(1).some((b,i)=>distanceToSegment(point,r.points[i],b)<=radius)).map(r=>r.index);
}
export function pathDistance(points: ScreenPoint[]): number {
  return points.slice(1).reduce((sum,p,i)=>sum+Math.sqrt(sq(p.x-points[i].x)+sq(p.y-points[i].y)),0);
}

export type ScreenRect = { x: number; y: number; width: number; height: number };
export function rectsOverlap(a: ScreenRect, b: ScreenRect): boolean {
  return a.x < b.x+b.width && a.x+a.width > b.x && a.y < b.y+b.height && a.y+a.height > b.y;
}
/** Labels stay in the middle portion of their own leg, measured by path length. */
export function routeMidpoint(points: ScreenPoint[]): ScreenPoint {
  const half=pathDistance(points)/2;let walked=0;
  for(let i=1;i<points.length;i++){
    const a=points[i-1],b=points[i],length=Math.hypot(b.x-a.x,b.y-a.y);
    if(walked+length>=half&&length>0){const t=(half-walked)/length;return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
    walked+=length;
  }
  return points[0]??{x:0,y:0};
}
export function findBadgePosition(points: ScreenPoint[], obstacles: ScreenRect[], bounds: { width: number; height: number }, preferred?: ScreenPoint, width=64, height=32): (ScreenPoint & { anchor: ScreenPoint }) | null {
  if(!points.length)return null;
  const anchor=preferred??routeMidpoint(points),total=pathDistance(points);
  let walked=0;
  const candidates=points.filter((p,i)=>{if(i)walked+=Math.hypot(p.x-points[i-1].x,p.y-points[i-1].y);return walked>=total*.2&&walked<=total*.8;});
  const stride=Math.max(1,Math.ceil(candidates.length/80));
  const sources=[anchor,...candidates.filter((_,i)=>i%stride===0)];
  // Search the whole middle stretch beside the line before allowing remote callouts.
  // Offset by the badge's projected half-size so its edge clears the route stroke.
  for(const remote of [false,true]){
    const placements=sources.flatMap(p=>{
      let nearest=Infinity,normal={x:0,y:1};
      for(let i=1;i<points.length;i++){
        const a=points[i-1],b=points[i],length=Math.hypot(b.x-a.x,b.y-a.y);
        if(length<0.01)continue;
        const distance=distanceToSegment(p,a,b);
        if(distance<nearest){nearest=distance;normal={x:-(b.y-a.y)/length,y:(b.x-a.x)/length};}
      }
      const clearance=Math.abs(normal.x)*width/2+Math.abs(normal.y)*height/2+9;
      const offsets=remote
        ? [[0,-56],[0,56],[60,0],[-60,0],[84,0],[-84,0],[104,0],[-104,0]]
        : [1,-1].map(sign=>[normal.x*clearance*sign,normal.y*clearance*sign]);
      return offsets.map(([dx,dy])=>({center:{x:p.x+dx,y:p.y+dy},anchor:p,
        score:0.35*Math.hypot(p.x-anchor.x,p.y-anchor.y)+Math.hypot(dx,dy)}));
    }).sort((a,b)=>a.score-b.score);
    for(const {center,anchor:source} of placements){
      const box={x:center.x-width/2,y:center.y-height/2,width,height};
      if(box.x<8||box.y<8||box.x+width>bounds.width-8||box.y+height>bounds.height-8)continue;
      if(!obstacles.some(obstacle=>rectsOverlap(box,obstacle)))return {...center,anchor:source};
    }
  }
  return null;
}

/** Nearby markers form compact vertical stacks preserving their geographic north/south order. API coordinates are untouched. */
export function spreadPinPositions(points: ScreenPoint[], bounds: {width:number;height:number}): ScreenPoint[] {
  const result=points.map(p=>({...p}));
  const visible=(p:ScreenPoint)=>p.x>=0&&p.y>=0&&p.x<=bounds.width&&p.y<=bounds.height;
  const box=(p:ScreenPoint):ScreenRect=>({x:p.x-26,y:p.y-58,width:52,height:62});
  const inside=(p:ScreenPoint)=>p.x>=26&&p.x<=bounds.width-26&&p.y>=58&&p.y<=bounds.height-4;
  const parent=points.map((_,i)=>i);
  const root=(i:number):number=>{while(parent[i]!==i)i=parent[i];return i;};
  for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
    if(visible(points[i])&&visible(points[j])&&rectsOverlap(box(points[i]),box(points[j])))parent[root(j)]=root(i);
  }
  const groups=new Map<number,number[]>();
  points.forEach((p,i)=>{if(visible(p)){const key=root(i);const group=groups.get(key)??[];group.push(i);groups.set(key,group);}});
  const occupied:ScreenRect[]=[];
  // Reserve isolated markers first so a stack cannot cover another place.
  for(const group of groups.values())if(group.length===1){
    const i=group[0],p=points[i];result[i]={x:Math.max(26,Math.min(bounds.width-26,p.x)),y:Math.max(58,Math.min(bounds.height-4,p.y))};occupied.push(box(result[i]));
  }
  for(const indices of groups.values()){
    if(indices.length<2)continue;
    // Screen y increases southward. Stop number must never decide geographic order.
    indices.sort((a,b)=>points[a].y-points[b].y||points[a].x-points[b].x||a-b);
    const center={x:indices.reduce((sum,i)=>sum+points[i].x,0)/indices.length,y:indices.reduce((sum,i)=>sum+points[i].y,0)/indices.length};
    let chosen:ScreenPoint[]|undefined;
    // First try a single vertical column. More columns are only a dense-group fallback.
    for(const columns of [1,2,3]){
      const rows=Math.ceil(indices.length/columns);
      if(rows>4)continue;
      for(const dx of [-36,36,0,-64,64]){
        for(const dy of [0,-24,24,-48,48]){
          const height=(rows-1)*64;
          const top=Math.max(58,Math.min(bounds.height-4-height,center.y+27-height/2+dy));
          const x=Math.max(26,Math.min(bounds.width-26-(columns-1)*56,center.x+dx-(columns-1)*28));
          const candidate=indices.map((_,n)=>({x:x+Math.floor(n/rows)*56,y:top+(n%rows)*64}));
          if(candidate.every((p,n)=>inside(p)&&Math.hypot(p.x-points[indices[n]].x,p.y-points[indices[n]].y)<=128&&!occupied.some(o=>rectsOverlap(box(p),o)))){chosen=candidate;break;}
        }
        if(chosen)break;
      }
      if(chosen)break;
    }
    // At extreme density retain true positions rather than send pins far across the map.
    indices.forEach((index,n)=>{result[index]=chosen?.[n]??{...points[index]};occupied.push(box(result[index]));});
  }
  return result;
}
