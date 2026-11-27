import {loadOutfit, draw, names, frameAt, gazeIndex} from './sprites.js';
import {soundReady, startMusic} from './music.js';
import {installData, verifyPackage} from './packages.js';
import {createGallery} from './gallery.js';
import {prepareFolio, renderFolio} from './folio.js';

const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const portrait = matchMedia('(aspect-ratio < 28/25)');
const root = document.body, pet = $('pet'), grip = $('petGrip'), log = $('log');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const welcome = $('welcome');
let outfit = 'half', desiredOutfit = 'half', phase = 'gate', touch, placed, home, perch, size;
let folioOrigin, folioTrigger;
let motion = 0, motionStart = 0, gaze = 0, lastLook = -Infinity, greetUntil = 0, tapCount = 0, bubbleTimer;
let installed = false, installPet, entryTime, absorbStart, absorbFrom;
let position = {x:0, y:0};

const scene = name => { root.dataset.scene = name; };
function state(name) {
  phase = name; root.dataset.phase = name;
  $('sendPrompt').disabled = $('attachPackage').disabled = installed || phase!=='desk';
}
function act(row) {
  if (motion !== row) { motion = row; motionStart = performance.now(); }
}
function place(x,y) {
  position = {x, y};
  pet.style.setProperty('--x', x + 'px');
  pet.style.setProperty('--y', y + 'px');
}
// Screen bounds in the source painting, followed by the crop's focal alignment.
const views = {
  'desk-afternoon.webp': {screen:[442,204,604,370], focus:[.93,.44]},
  'desk-wide.webp': {screen:[1508,44,561,348], focus:[1,.47]},
  'desk-portrait.webp': {screen:[293,775,500,295], focus:[.5,.66]}
};
function geometry() {
  const art=$('art'), plate=$('plate'), screen=$('screen');
  if(!art.naturalWidth) return;
  const w=$('desk').clientWidth, h=$('desk').clientHeight;
  const view=views[art.currentSrc.split('/').pop()], tall=view===views['desk-portrait.webp'];
  const scale=Math.max(w/art.naturalWidth,h/art.naturalHeight);
  const pw=art.naturalWidth*scale, ph=art.naturalHeight*scale;
  const left=(w-pw)*view.focus[0], top=(h-ph)*view.focus[1];
  Object.assign(plate.style,{width:pw+'px',height:ph+'px',left:left+'px',top:top+'px'});
  const [x,y,sw,sh]=view.screen.map(n=>n*scale);
  Object.assign(screen.style,{left:x+'px',top:y+'px',width:sw+'px',height:sh+'px'});
  const sx=left+x, sy=top+y;
  size = tall ? Math.min(sw*.52,h*.24) : Math.min(sw*.37,h*.41);
  pet.style.setProperty('--pet-w',size+'px');
  home = tall ? {x:sx+sw*.5,y:sy-sh*.90} : {x:sx-sw*.40,y:sy+sh*1.05};
  perch = tall ? {x:sx+sw*.56,y:sy-size*.63} : {x:sx-size*.48,y:sy+sh*1.13};
  if (['absorb','typing','review','permission','denied','success','error'].includes(phase)) place(perch.x,perch.y);
  else if (!touch) place(placed ? placed.x*w : home.x, placed ? placed.y*h : home.y);
  requestAnimationFrame(guide);
}
function guide() {
  const drop = $('drop');
  $('guide').style.display = phase === 'desk' && drop && !installed && !touch ? '' : 'none';
  if (phase !== 'desk' || !drop || installed || touch) return;
  const box = drop.querySelector('.icon').getBoundingClientRect(), mobile = portrait.matches;
  const desk=$('desk').getBoundingClientRect(), zoom=desk.width/$('desk').clientWidth;
  const tx=(box.x+box.width/2-desk.x)/zoom, ty=(box.y+box.height/2-desk.y)/zoom, radius=box.width*.66/zoom;
  const ring=$('guideTarget');ring.setAttribute('cx',tx);ring.setAttribute('cy',ty);ring.setAttribute('r',radius);
  const sx = position.x + size*(mobile ? .24 : .4), sy = position.y + size*.2;
  const ex = tx+(mobile?radius:-radius), ey=ty;
  const firstX=mobile?Math.min(innerWidth-12,sx+size*.62):sx+(ex-sx)*.38;
  const firstY=sy+size*(mobile?.12:.15);
  const lastX=mobile?Math.min(innerWidth-12,ex+size*.56):ex-(ex-sx)*.42;
  const lastY=ey-(mobile?5:size*.16);
  $('guideLine').setAttribute('d', 'M '+sx+' '+sy+' C '+firstX+' '+firstY+' '+lastX+' '+lastY+' '+ex+' '+ey);
  const angle = Math.atan2(ey-lastY,ex-lastX);
  const tail = delta => (ex-9*Math.cos(angle+delta))+' '+(ey-9*Math.sin(angle+delta));
  $('guideHead').setAttribute('d','M '+tail(.52)+' L '+ex+' '+ey+' L '+tail(-.52));
}
function whisper(text, duration=1400) {
  clearTimeout(bubbleTimer);
  $('whisper').textContent = text;
  $('whisper').classList.toggle('visible', Boolean(text));
  if (text) bubbleTimer = setTimeout(() => $('whisper').classList.remove('visible'), duration);
}
async function setOutfit(next) {
  desiredOutfit=next;
  if(next===outfit)return;
  await loadOutfit(next);
  if(next!==desiredOutfit || next===outfit)return;
  outfit = next;
  root.dataset.outfit = next;
  document.querySelectorAll('.outfit-label').forEach(el => el.textContent = names[next]);
  $('outfitDesk').setAttribute('aria-label','换装，当前为'+names[next]);
  document.querySelectorAll('[data-outfit-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.outfitChoice===next)));
  if (phase==='desk' && $('compose').dataset.attachment) attachPackage();
  if (phase === 'desk') whisper(next === 'half' ? '换好运动服了。' : '今天，穿这身出发。');
  const target = phase === 'gallery' ? $('specimen') : grip;
  const jewel = document.createElement('img');
  jewel.src = 'assets/official/uma-jewel-cutout.png';
  jewel.className = 'outfit-glint';
  jewel.alt = '';
  target.append(jewel);
  setTimeout(()=>jewel.remove(),700);
}
const gallery = createGallery({getOutfit:()=>outfit, setOutfit, leave:leaveGallery});
function openGallery() {
  state('gallery'); scene('gallery'); whisper('');
  $('desk').inert = true; $('gallery').hidden = false; gallery.open();
  $('backDesk').focus({preventScroll:true});
}
function leaveGallery() {
  gallery.close(); $('gallery').hidden = true; $('desk').inert = false;
  if(portrait.matches){$('sidebar').classList.remove('mobile-open');syncSidebar();}
  scene('desk'); state('desk'); placed = null; geometry(); act(0);
  $('galleryLink').focus({preventScroll:true});
}
$('outfitDesk').onclick = () => setOutfit(desiredOutfit==='half'?'full':'half');
$('galleryLink').onclick = openGallery;
$('installedPet').onclick = openGallery;
async function openFolio(event){
  if(folioOrigin)return;
  folioOrigin=root.dataset.scene;folioTrigger=event.currentTarget;
  $('tracks').hidden=true;$('trackMenu').setAttribute('aria-expanded','false');
  if(folioOrigin==='gallery'){
    $('gallery').inert=true;await gallery.gather();$('gallery').hidden=true;
  }
  $('desk').inert=true;
  await prepareFolio(outfit);
  scene('install');$('folio').hidden=false;
  $('folioBack').querySelector('span').textContent=folioOrigin==='gallery'?'返回动作手札':'返回午后桌边';
  $('folioBack').focus({preventScroll:true});
}
function leaveFolio(){
  if(!folioOrigin || $('folio').hidden)return;
  const origin=folioOrigin;folioOrigin=null;$('folio').hidden=true;scene(origin);
  if(origin==='gallery'){ $('gallery').inert=false;$('gallery').hidden=false;gallery.open(true); }
  else { $('desk').inert=false;guide(); }
  folioTrigger.focus({preventScroll:true});
}
$('takeHome').onclick=$('directDownload').onclick=openFolio;
$('folioBack').onclick=leaveFolio;
document.addEventListener('keydown',e=>{if(e.key==='Escape' && !$('folio').hidden && !$('music').contains(document.activeElement))leaveFolio();});
$('sidebarToggle').onclick = () => {
  const side = $('sidebar');
  if (portrait.matches) side.classList.toggle('mobile-open');
  else side.hidden = !side.hidden;
  $('sidebarToggle').setAttribute('aria-expanded',String(portrait.matches ? side.classList.contains('mobile-open') : !side.hidden));
  guide();
};
window.addEventListener('resize', geometry);
$('art').addEventListener('load', geometry);
portrait.addEventListener('change', () => { $('sidebar').hidden=false; $('sidebar').classList.remove('mobile-open'); syncSidebar(); });
function syncSidebar(){ $('sidebarToggle').setAttribute('aria-expanded', String(!portrait.matches)); }
syncSidebar(); geometry(); root.dataset.outfit = outfit;

const artworkReady = new Promise((resolve,reject) => {
  const art=$('art');
  if(art.complete) {
    if(art.naturalWidth) resolve();
    else reject(new Error('桌景未能载入。'));
    return;
  }
  art.addEventListener('load',resolve,{once:true});
  art.addEventListener('error',reject,{once:true});
});
const ready = Promise.all([soundReady, loadOutfit('half'), installData, artworkReady]);
ready.then(() => {
  root.dataset.ready = 'true';
  $('hint').textContent = '轻触页面任意处 · 随微风进入午后桌面';
}).catch(() => { $('hint').textContent='桌面素材未能载入，轻触重试。'; root.dataset.ready='failed'; });
for (const [id,value] of [['musicOn','on'],['musicOff','off']]) {
  ['pointerenter','focus'].forEach(type=>$(id).addEventListener(type,()=>{if(phase==='gate') $('choices').dataset.choice=value;}));
}
$('choices').onpointerleave = () => { if(phase==='gate') $('choices').dataset.choice=document.activeElement===$('musicOff')?'off':'on'; };
$('musicOff').addEventListener('pointerleave',()=>{ if(phase==='gate' && document.activeElement!==$('musicOff')) $('choices').dataset.choice='on'; });
$('choices').addEventListener('focusout',e=>{ if (phase==='gate' && !$('choices').contains(e.relatedTarget)) $('choices').dataset.choice='on'; });
$('gate').onclick = async e => {
  if (root.dataset.ready === 'failed') { location.reload(); return; }
  if (phase !== 'gate') return;
  const enabled = !e.target.closest('#musicOff');
  state('entering'); $('choices').dataset.choice=enabled?'on':'off';
  try { await Promise.all([startMusic(enabled), ready]); } catch { state('gate'); return; }
  const jewel = $('choices').querySelector('img').getBoundingClientRect();
  $('gate').style.setProperty('--origin-x', (jewel.x+jewel.width/2)+'px');
  $('gate').style.setProperty('--origin-y', (jewel.y+jewel.height/2)+'px');
  $('gate').classList.add('leaving'); scene('desk'); $('world').inert = false;
  setTimeout(()=>{ $('gate').hidden=true; if ($('gate').contains(document.activeElement)) grip.focus({preventScroll:true}); },reduced.matches?5:1260);
  if(!reduced.matches) await sleep(400);
  entryTime = performance.now(); state('entrance'); geometry();
};
function tap() {
  if (phase!=='desk') return;
  const jump = ++tapCount % 2 === 0; act(jump ? 4 : 3);
  greetUntil = performance.now() + (jump ? 840 : 880);
  whisper(jump ? '要一起出去跑一圈吗？' : '午后好。这里有阳光。');
}
grip.onclick = e => { if (e.detail === 0) tap(); };
grip.onpointerdown = e => {
  if (phase!=='desk' || !e.isPrimary || e.button !== 0) return;
  touch = {id:e.pointerId, startX:e.clientX, startY:e.clientY, dx:e.clientX-position.x, dy:e.clientY-position.y, moved:false};
  grip.setPointerCapture(e.pointerId); e.preventDefault();
};
const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
function onTarget(event) {
  if(!$('drop')) return false;
  const r=$('screen').getBoundingClientRect();
  const inside=(x,y)=>x>=r.left && x<=r.right && y>=r.top && y<=r.bottom;
  return inside(position.x,position.y+size*.065) || inside(event.clientX,event.clientY);
}
function showTarget(hot){
  $('screen').classList.toggle('hot',hot);
  if($('dragHint')) $('dragHint').textContent=hot?'松手让铃鹿入座 Codex':'将桌边的铃鹿拖入此窗口安装';
}
let speckTime = 0;
window.addEventListener('pointermove', e => {
  const now = performance.now();
  if (touch && e.pointerId===touch.id) {
    if (!touch.moved && Math.hypot(e.clientX-touch.startX,e.clientY-touch.startY)<5) return;
    touch.moved=true; pet.classList.add('lift');
    const x=clamp(e.clientX-touch.dx,size*.42,innerWidth-size*.42);
    const y=clamp(e.clientY-touch.dy,size*.42,innerHeight-size*.52);
    act(x>=position.x ? 1 : 2); place(x,y); guide();
    showTarget(onTarget(e));
  } else if (phase==='desk') {
    const dx=e.clientX-position.x,dy=e.clientY-position.y;
    if (Math.hypot(dx,dy)>9) {gaze=gazeIndex(dx,dy);lastLook=now;}
  }
  if (!['gate','entering'].includes(phase) && !reduced.matches && now-speckTime>32 && e.pointerType!=='touch') {
    speckTime=now;
    const dot=document.createElement('i'), w=2+Math.random()*5;
    dot.className='speck';
    dot.style.cssText='left:'+e.clientX+'px;top:'+e.clientY+'px;width:'+w+'px;height:'+w+'px;--dx:'+(Math.random()*25-12)+'px';
    $('dust').append(dot); dot.onanimationend=()=>dot.remove();
  }
},{passive:true});
function release(e) {
  if(!touch || e.pointerId!==touch.id) return;
  const {moved,id}=touch; touch=null;
  if(grip.hasPointerCapture(id)) grip.releasePointerCapture(id);
  pet.classList.remove('lift'); showTarget(false);
  if(moved) {
    placed={x:position.x/innerWidth,y:position.y/innerHeight}; act(0);
    if(e.type==='pointerup' && onTarget(e)) beginInstall();
  } else if(e.type==='pointerup') tap();
  guide();
}
window.addEventListener('pointerup',release); window.addEventListener('pointercancel',release);
grip.addEventListener('lostpointercapture',release);
for(let i=0;i<24;i++){
  const mote=document.createElement('i'),w=1.4+i%4;
  mote.className='mote';
  mote.style.cssText='left:'+(5+i*37%91)+'%;top:'+(6+i*19%80)+'%;width:'+w+'px;height:'+w+'px;--t:'+(4+i%6)+'s;--d:-'+(i*.71)+'s';
  $('dust').append(mote);
}

function message(className) {
  const el=document.createElement('div'); el.className='msg '+className; log.append(el); return el;
}
function detail(label,body,klass) {
  const details=document.createElement('details'), summary=document.createElement('summary'), text=document.createElement('pre');
  details.className='msg '+klass; summary.textContent=label; text.textContent=body;
  details.append(summary,text); log.append(details); return details;
}
function action(parent,label,handler){
  const button=document.createElement('button');button.textContent=label;button.onclick=handler;parent.append(button);return button;
}
function bottom(){ log.scrollTop=log.scrollHeight; }
function resetDesk(){
  state('desk'); scene('desk'); act(0); placed=null; whisper(''); log.replaceChildren(welcome);
  delete $('compose').dataset.attachment;
  $('compose').textContent='随心输入'; geometry(); $('invite').focus({preventScroll:true});
}
function retry(){ state('desk'); beginInstall(); }
function denied(){
  state('denied');act(5);log.querySelector('.permit')?.remove();
  const row=message('permit');row.textContent='已拒绝写入。';
  const buttons=document.createElement('div');buttons.className='actions';row.append(buttons);
  action(buttons,'回到桌边',resetDesk);action(buttons,'再试一次',retry).focus({preventScroll:true});
  whisper('那我先只核对校验值，不动你现在的桌宠……可以再试一次吗？',5600);bottom();
}
async function allowed(){
  state('success');act(4);installed=true;
  log.querySelector('.permit')?.remove();
  const row=message('success');row.innerHTML='<img alt="" src="assets/official/uma-jewel-cutout.png"><span>已安装 v1.3 · PetDex sprite v2</span>';
  const side=$('sidebar');side.hidden=false;
  side.classList.toggle('mobile-open',portrait.matches);$('sidebarToggle').setAttribute('aria-expanded','true');
  $('installedPet').hidden=false;$('installedPet').disabled=true;draw($('sidebarPet'),installPet,0,0);
  bottom();whisper('以后，就在这里见。',1200);
  await sleep(690);act(3);await sleep(1100);$('installedPet').disabled=false;$('galleryLink').hidden=false;
  if(folioOrigin){state('desk');placed=null;geometry();act(0);}else openGallery();
}
async function beginInstall(){
  if(phase!=='desk' || installed) return;
  installPet=outfit;
  state('absorb');guide(); whisper(''); absorbFrom={...position}; absorbStart=performance.now();
  const petMeta=(await installData)[installPet];
  const prompt='安装「无声铃鹿 · '+names[installPet]+'」桌宠，校验 SHA-256 并设为当前桌宠。';
  await sleep(reduced.matches?0:400);place(perch.x,perch.y);state('typing');act(7);log.replaceChildren();
  const start=performance.now(), compose=$('compose'), duration=reduced.matches?60:1100;
  await new Promise(resolve=>{
    function type(now){
      const length=Math.min(prompt.length,Math.floor((now-start)/duration*prompt.length));
      compose.textContent=prompt.slice(0,length);compose.scrollLeft=compose.scrollWidth;
      if(length<prompt.length) requestAnimationFrame(type); else resolve();
    }
    requestAnimationFrame(type);
  });
  await sleep(90);
  message('user').textContent=prompt;compose.textContent='随心输入';
  state('review');act(8);
  const thought=detail('正在思考…','读取便携包，核对 ZIP、图集和 PetDex 配置。','tool');
  try {
    const [v]=await Promise.all([verifyPackage(petMeta),sleep(reduced.matches?100:2000)]);
    thought.querySelector('summary').textContent='已思考 2 秒';
    const commands=['$ unzip -l '+petMeta.package_file,...v.listing,'','$ sha256sum '+petMeta.package_file,v.zipHash+'  OK',
      '$ sha256sum '+petMeta.spritesheet_path,v.sheetHash+'  OK','sprite.version = '+v.version,'spritesheet.png  '+v.width+'×'+v.height];
    detail('校验 ZIP 与 spritesheet.png SHA-256 · sprite v2',commands.join('\n'),'tool');
    const row=message('permit'), title=document.createElement('b'), path=document.createElement('code'), controls=document.createElement('div');
    title.textContent='允许写入桌宠文件？';path.textContent='~/.codex/pets/'+petMeta.config_path.split('/')[0]+'/\npet.json · spritesheet.png';
    controls.className='actions';row.append(title,path,controls);action(controls,'拒绝',denied);action(controls,'允许',allowed);
    state('permission');act(6);bottom();
  } catch(error) {
    state('error');act(5);const row=message('permit');row.textContent=error.message;
    const controls=document.createElement('div');controls.className='actions';row.append(controls);
    action(controls,'回到桌边',resetDesk);action(controls,'再试一次',retry);bottom();
  }
}
$('invite').onclick=beginInstall;
async function attachPackage(){
  const entry=(await installData)[outfit];
  $('compose').textContent=entry.package_file;
  $('compose').dataset.attachment=outfit;
}
$('attachPackage').onclick=attachPackage;
$('sendPrompt').onclick=beginInstall;
function tick(now){
  if(root.dataset.scene==='install') renderFolio(now);
  else if(phase==='gallery') gallery.render(now);
  else if(!['entering','gate'].includes(phase)){
    if(phase==='entrance'){
      const t=reduced.matches?2400:now-entryTime;
      if(t<640){const u=t/640;act(1);place(-size*.4+(home.x*.65+size*.4)*u,home.y-Math.abs(Math.sin(u*Math.PI*3))*size*.027);}
      else if(t<1310){const u=(t-640)/670;act(4);place(home.x*(.65+.35*u),home.y-4*u*(1-u)*size*.26);}
      else if(t<2100){place(home.x,home.y);act(3);}
      else{state('desk');place(home.x,home.y);act(0);guide();}
    } else if(phase==='absorb'){
      const u=Math.min(1,(now-absorbStart)/400);
      // CSS times this transform with the same easing as the referenced drag interaction.
      if(!pet.getAnimations().length && u<.7 && !reduced.matches){
        const tf=p=>'translate(calc('+p.x+'px - 50%),calc('+p.y+'px - 50%))';
        pet.animate([{transform:tf(absorbFrom)},{transform:tf(perch)}],{duration:400,easing:'cubic-bezier(.06,.06,.51,1.1)'});
        place(perch.x,perch.y);
      }
    } else if(phase==='desk' && !touch && now>=greetUntil) act(now-lastLook<1800?9:0);
    draw($('petCanvas'),outfit,motion,motion===9?gaze:frameAt(motion,now-motionStart));
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
