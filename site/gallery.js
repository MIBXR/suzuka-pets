import {draw, frameAt, gazeIndex, motions} from './sprites.js';
const $ = id => document.getElementById(id);
const icon = id => '<svg class="icon" aria-hidden="true"><use href="icons.svg#'+id+'"></use></svg>';
const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));
const number = i => String(i+1).padStart(2,'0');

export function createGallery({getOutfit,setOutfit,leave}){
  const fan=$('fan'), specimen=$('specimen');
  const cardCanvases=[], cards=[], suits=['leaf','sun','shoe','spark'];
  let order=motions.map((_,i)=>i), selected=3, lifted=null, paused=false, start=0, elapsed=0;
  let busy=false, revision=0, active=false, gazeAngle=null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function layout(stacked=false,deal=false){
    if(!active) return;
    const W=cards[0].offsetWidth, width=fan.clientWidth;
    const spread=Math.min(W*.72,(width*.95-W*1.72)/9);
    const mobile=width<650, liftSlot=order.indexOf(lifted);
    order.forEach((id,k)=>{
      const card=cards[id], u=(k-4.5)/4.5;
      let x=(k-4.5)*spread, y=u*u*W*(mobile?.44:.38), r=u*(mobile?24:16.5);
      if(liftSlot>=0){
        const gap=k-liftSlot;
        if(gap===0){ y-=W*(mobile?.23:.18);r*=.32;}
        else x+=Math.sign(gap)*W*(Math.abs(gap)===1?.11:.045);
      }
      if(stacked){x=u*3;y=W*.87;r=u*2;}
      card.style.setProperty('--t','translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+r.toFixed(1)+'deg)');
      card.style.transitionDelay=deal&&!reduced.matches?(k*55)+'ms':'0ms';
      card.style.zIndex=String(lifted===id?40:2+k);
      card.classList.toggle('is-up',lifted===id);
    });
  }
  function lift(id){ if(busy||lifted===id)return;lifted=id;layout(); }
  motions.forEach(([title,caption],id)=>{
    const card=document.createElement('button'), suit=suits[id%4];
    card.className='hand-card';card.dataset.motion=id;card.dataset.suit=id%4;
    card.setAttribute('aria-label',number(id)+' '+title+(id===9?'，十六方向注视':''));
    card.innerHTML='<span class="card-index">'+number(id)+icon(suit)+'</span><span class="card-art"><canvas width="288" height="312"></canvas></span><span class="card-title">'+title+'</span><span class="card-caption">'+caption+'</span><svg class="icon corner-suit" aria-hidden="true"><use href="icons.svg#'+suit+'"></use></svg>';
    cards.push(card);cardCanvases.push(card.querySelector('canvas'));fan.append(card);
    card.onpointerenter=e=>{if(e.pointerType!=='touch')lift(id);};
    card.onfocus=()=>lift(id);
    card.onclick=e=>{if(!busy && e.pointerType!=='touch' && !e.sourceCapabilities?.firesTouchEvents)select(id);};
    card.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();step(e.key==='ArrowLeft'?-1:1,true);}};
  });
  fan.onpointerleave=()=>lift(null);
  fan.addEventListener('focusout',e=>{if(!fan.contains(e.relatedTarget))lift(null);});
  let touchedCard=null;
  fan.onpointerdown=e=>{
    if(e.pointerType!=='touch'||busy)return;
    const card=document.elementFromPoint(e.clientX,e.clientY)?.closest('.hand-card');
    if(!card)return;
    touchedCard={id:Number(card.dataset.motion),x:e.clientX,y:e.clientY};
    fan.setPointerCapture(e.pointerId);e.preventDefault();
  };
  fan.onpointerup=e=>{
    if(!touchedCard)return;
    const {id,x,y}=touchedCard;touchedCard=null;
    if(Math.hypot(e.clientX-x,e.clientY-y)<12){select(id);cards[id].focus({preventScroll:true});}
  };
  fan.onpointercancel=()=>{touchedCard=null;};
  function select(id){
    selected=id;start=performance.now();elapsed=0;gazeAngle=null;paused=reduced.matches;
    $('spotNo').textContent=number(id);$('spotTitle').textContent=motions[id][0];$('spotCaption').textContent=motions[id][1];
    specimen.classList.toggle('compass',id===9);
    if(id===9){specimen.tabIndex=0;specimen.setAttribute('aria-label','十六方向罗盘，可滑动或用左右方向键转向');}
    else{specimen.removeAttribute('tabindex');specimen.removeAttribute('aria-label');}
    cards.forEach((card,n)=>card.setAttribute('aria-pressed',String(id===n)));
    $('filmstrip').replaceChildren(...motions[id][2].map(()=>document.createElement('i')));
    syncPause();render(start);
  }
  function syncPause(){
    $('pauseSpot').innerHTML=icon(paused?'play':'pause');
    $('pauseSpot').setAttribute('aria-label',paused?'播放动作':'暂停动作');
    $('pauseSpot').setAttribute('aria-pressed',String(paused));
  }
  function step(delta,focus=false){
    const id=order[(order.indexOf(selected)+delta+10)%10];select(id);if(focus)cards[id].focus();
  }
  $('previousCard').onclick=()=>step(-1);$('nextCard').onclick=()=>step(1);
  $('pauseSpot').onclick=()=>{
    const now=performance.now();
    if(paused) start=now-elapsed;else elapsed=now-start;
    paused=!paused;syncPause();
  };
  function point(e){
    if(selected!==9||paused)return;
    const r=specimen.getBoundingClientRect(),dx=e.clientX-r.x-r.width/2,dy=e.clientY-r.y-r.height/2;
    if(Math.hypot(dx,dy)>4)gazeAngle=gazeIndex(dx,dy);
  }
  specimen.onpointermove=point;specimen.onpointerdown=e=>{if(selected===9){specimen.setPointerCapture(e.pointerId);point(e);}};
  specimen.onkeydown=e=>{
    if(selected===9 && !paused && ['ArrowLeft','ArrowRight'].includes(e.key)){
      e.preventDefault();gazeAngle=((gazeAngle??0)+(e.key==='ArrowLeft'?15:1))%16;
    }
  };
  function render(now){
    if(!active)return;
    const outfit=getOutfit();
    cards.forEach((_,id)=>draw(cardCanvases[id],outfit,id,frameAt(id,reduced.matches?0:now+id*177)));
    const frame=selected===9 && gazeAngle!==null?gazeAngle:frameAt(selected,paused?elapsed:now-start);
    draw($('spotCanvas'),outfit,selected,frame);
    const label=selected===9?(frame*22.5)+'° · '+(frame+1)+'/16':(frame+1)+' / '+motions[selected][2].length+' 帧';
    if($('frameLabel').textContent!==label){
      $('frameLabel').textContent=label;
      Array.from($('filmstrip').children).forEach((cell,i)=>cell.classList.toggle('active',i===frame));
    }
  }
  async function deal(again){
    if(busy)return;
    const ticket=++revision;busy=true;lifted=null;$('redeal').disabled=true;
    layout(true);
    if(again){
      await sleep(reduced.matches?0:560);if(revision!==ticket)return;
      const old=order.join(',');
      for(let k=order.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[order[k],order[j]]=[order[j],order[k]];}
      if(order.join(',')===old)order.push(order.shift());
    } else await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    if(revision!==ticket)return;
    layout(false,true);
    await sleep(reduced.matches?0:1090);if(revision!==ticket)return;
    cards.forEach(card=>card.style.transitionDelay='0ms');
    busy=false;$('redeal').disabled=false;
  }
  $('redeal').onclick=()=>deal(true);$('backDesk').onclick=leave;
  $('outfitGallery').querySelectorAll('button').forEach(b=>b.onclick=()=>setOutfit(b.dataset.outfitChoice));
  window.addEventListener('resize',()=>layout());
  function close(){active=false;revision++;busy=false;lifted=null;}
  async function gather(){
    revision++;busy=true;lifted=null;layout(true);$('gallery').classList.add('gathering');
    await sleep(reduced.matches?0:250);close();$('gallery').classList.remove('gathering');
  }
  return {open(resume=false){active=true;if(!resume)select(selected);deal(false);},close,gather,render};
}
