(() => {
  'use strict';
  const CELL_W=192,CELL_H=208;
  const WEB_CELL_W=576,WEB_CELL_H=624;
  const ASSET_VERSION='20261004i';
  const pets={full:{name:'胜负服铃鹿',file:'full-body'},half:{name:'运动服铃鹿',file:'half-body'}};
  const states=[
    {id:'idle',label:'发呆',durations:[3000,100,100,100,100,3200],description:'先在这里待一会儿。'},
    {id:'running-right',label:'向右跑',durations:[120,120,120,120,120,120,120,220],description:'往右边，出发。'},
    {id:'running-left',label:'向左跑',durations:[120,120,120,120,120,120,120,220],description:'换个方向，小跑几步。'},
    {id:'waving',label:'打个招呼',durations:[140,140,140,280],description:'你好呀。'},
    {id:'jumping',label:'跳一下',durations:[140,140,140,140,280],description:'轻轻跳起来，再落回原地。'},
    {id:'failed',label:'小失落',durations:[140,140,140,140,140,140,140,240],description:'没关系，休息一下再试。'},
    {id:'waiting',label:'等你回应',durations:[150,150,150,150,150,260],description:'不着急，我等你。'},
    {id:'running',label:'认真工作',durations:[120,120,120,120,120,220],description:'小电脑打开了，开始干活。'},
    {id:'review',label:'检查一下',durations:[150,150,150,150,150,280],description:'托着下巴，再认真看一眼。'}
  ];
  const directionNames=['向上','偏右上','右上','偏上右','向右','偏下右','右下','偏右下','向下','偏左下','左下','偏下左','向左','偏上左','左上','偏左上'];
  const motionRows={full:new Map(),half:new Map()};
  const motionCatalog=fetch('assets/motion-hd/manifest.json?v='+ASSET_VERSION).then(response=>{
    if(!response.ok)throw new Error('Animation manifest could not be loaded');
    return response.json();
  }).then(catalog=>{
    const counts=[6,8,8,4,5,8,6,6,6,8,8];
    if(catalog.version!==2||catalog.cell_width!==WEB_CELL_W||catalog.cell_height!==WEB_CELL_H)throw new Error('Unexpected animation layout');
    for(const pet of ['full','half']){
      const rows=catalog.pets?.[pet]?.rows;
      if(!rows||rows.length!==counts.length)throw new Error('Incomplete animation family');
      rows.forEach((row,index)=>{
        if(row.frames.length!==counts[index])throw new Error('Incomplete action');
        row.frames.forEach(frame=>{
          if(![frame.width,frame.height,frame.x,frame.y,frame.scale].every(Number.isFinite)||frame.width<=0||frame.height<=0||frame.width>WEB_CELL_W||frame.height>WEB_CELL_H||frame.scale<=0)throw new Error('Invalid animation registration');
        });
      });
    }
    return catalog;
  });
  const actionButtons=document.getElementById('action-buttons');
  const directionButtons=document.getElementById('direction-buttons');
  const pauseButton=document.getElementById('pause');
  const followInput=document.getElementById('follow-pointer');
  const gazeZone=document.getElementById('gaze-zone');
  const modeTabs=[document.getElementById('motion-tab'),document.getElementById('gaze-tab')];
  const modePanels=[document.getElementById('motion-panel'),document.getElementById('gaze')];
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const sprites=[...document.querySelectorAll('.sprite-frame')].map(element=>({
    element,pet:element.dataset.pet,context:element.dataset.context,
    canvas:element.querySelector('canvas'),visible:true,lastFrame:''
  }));
  let ready=false,selectedState=0,selectedDirection=0,mode='motion';
  let paused=reducedMotion.matches,clock=0,clockOrigin=performance.now(),stateStarted=0;
  let highlightTimer;
  const greetings={full:0,half:0};
  const installResponses={full:null,half:null};
  function assetStatus(){
    const row=mode==='motion'?selectedState:9+Math.floor(selectedDirection/8);
    const current=['full','half'].flatMap(pet=>[0,row].map(r=>motionRows[pet].get(r)));
    const pending=current.some(asset=>asset?.status==='loading');
    const failed=current.some(asset=>asset?.status==='error');
    const status=document.getElementById('asset-status');
    status.classList.toggle('ready',ready&&!pending&&!failed);
    status.setAttribute('role',failed?'alert':'status');
    status.textContent=failed?'这个动作暂时没载入，可以刷新再试。':pending?'动作载入中…':'动画已载入。';
  }
  function loadRow(pet,row){
    if(motionRows[pet].has(row))return motionRows[pet].get(row);
    const asset={image:new Image(),status:'loading',frames:null};
    motionRows[pet].set(row,asset);
    asset.promise=motionCatalog.then(catalog=>new Promise((resolve,reject)=>{
      const definition=catalog.pets[pet].rows[row];
      asset.frames=definition.frames;asset.revision=definition.sha256;
      asset.image.onload=()=>{
        if(asset.image.naturalWidth!==WEB_CELL_W*asset.frames.length||asset.image.naturalHeight!==WEB_CELL_H){reject(new Error('Animation pixels do not match the manifest'));return;}
        asset.status='ready';resolve(asset);
      };
      asset.image.onerror=()=>reject(new Error('Animation could not be loaded'));
      asset.image.decoding='async';
      asset.image.src='assets/motion-hd/'+pets[pet].file+'-'+row+'.webp?v='+definition.sha256.slice(0,16);
    })).catch(error=>{asset.status='error';throw error;});
    asset.promise.then(()=>{assetStatus();render(performance.now(),true);}).catch(()=>{
      const status=document.getElementById('asset-status');status.setAttribute('role','alert');status.classList.remove('ready');status.textContent='这个动作暂时没载入，可以刷新再试。';
    });
    return asset;
  }
  function playTime(now=performance.now()){return paused?clock:clock+now-clockOrigin;}
  function frameAt(state,elapsed){
    const durations=states[state].durations;
    let remaining=Math.max(0,elapsed)%durations.reduce((a,b)=>a+b,0),frame=0;
    while(remaining>=durations[frame]){remaining-=durations[frame];frame++;}
    return frame;
  }
  function fitCanvases(){
    const density=Math.max(1,Math.min(devicePixelRatio||1,4));
    sprites.forEach(sprite=>{
      const bounds=sprite.element.getBoundingClientRect();
      if(!bounds.width||!bounds.height)return;
      const width=Math.ceil(bounds.width*density),height=Math.ceil(bounds.height*density);
      if(sprite.canvas.width!==width||sprite.canvas.height!==height){
        sprite.canvas.width=width;sprite.canvas.height=height;sprite.lastFrame='';
      }
    });
    render(performance.now(),true);
  }
  function draw(sprite,row,column){
    if(!ready||!sprite.visible)return;
    const asset=loadRow(sprite.pet,row);
    if(asset.status!=='ready'){sprite.element.classList.remove('loaded');sprite.lastFrame='';return;}
    const image=asset.image;
    const frame=asset.frames[column];
    const key=row+':'+column+':original';
    if(sprite.lastFrame===key)return;
    const canvas=sprite.canvas,context=canvas.getContext('2d');
    context.clearRect(0,0,canvas.width,canvas.height);
    context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
    const scaleX=canvas.width/CELL_W,scaleY=canvas.height/CELL_H;
    context.drawImage(image,column*WEB_CELL_W,0,frame.width,frame.height,frame.x*scaleX,frame.y*scaleY,frame.width*frame.scale*scaleX,frame.height*frame.scale*scaleY);
    sprite.lastFrame=key;sprite.element.dataset.frame=row+':'+column;
    sprite.element.dataset.source='original-hd';
    sprite.element.dataset.sourceCell=frame.width+'x'+frame.height;
    sprite.element.dataset.assetRevision=asset.revision;
    sprite.element.classList.add('loaded');
    sprite.element.querySelector('.sprite-poster').setAttribute('aria-hidden','true');
  }
  function render(now,force=false){
    if(!ready||document.hidden)return;
    const time=playTime(now);
    sprites.forEach(sprite=>{
      if(force)sprite.lastFrame='';
      if(sprite.context==='hero'){
        const greetingEnd=greetings[sprite.pet];
        const greeting=time<greetingEnd;
        const row=greeting?3:0;
        const offset=sprite.pet==='half'?600:0;
        draw(sprite,row,frameAt(row,greeting?time-(greetingEnd-1600):time+offset));
      }else if(sprite.context==='install'){
        const response=installResponses[sprite.pet];
        const responding=response&&time<response.ends;
        const row=responding?response.row:0;
        const offset=sprite.pet==='half'?600:0;
        draw(sprite,row,frameAt(row,responding?time-response.started:time+offset));
      }else if(sprite.context==='motion'&&mode==='motion'){
        draw(sprite,selectedState,frameAt(selectedState,time-stateStarted));
      }else if(sprite.context==='gaze'&&mode==='gaze'){
        draw(sprite,9+Math.floor(selectedDirection/8),selectedDirection%8);
      }
    });
  }
  function setDemoMode(value,focus=false){
    if(!['motion','gaze'].includes(value))throw new Error('Unknown demo mode');
    mode=value;const selected=value==='motion'?0:1;
    modeTabs.forEach((tab,index)=>{tab.setAttribute('aria-selected',String(index===selected));tab.tabIndex=index===selected?0:-1;});
    modePanels.forEach((panel,index)=>panel.hidden=index!==selected);
    pauseButton.hidden=selected===1;
    if(ready){const row=value==='motion'?selectedState:9+Math.floor(selectedDirection/8);['full','half'].forEach(pet=>loadRow(pet,row));assetStatus();}
    if(focus)modeTabs[selected].focus();
    fitCanvases();render(performance.now(),true);
    return {mode};
  }
  function selectAction(index){
    if(!Number.isInteger(index)||index<0||index>=states.length)throw new Error('Unknown action');
    selectedState=index;stateStarted=playTime();
    if(ready){['full','half'].forEach(pet=>loadRow(pet,index));assetStatus();}
    [...actionButtons.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    const state=states[index];
    document.querySelectorAll('.state-caption').forEach(element=>element.textContent=state.label);
    document.getElementById('action-description').textContent=state.description;
    sprites.filter(s=>s.context==='motion').forEach(s=>s.canvas.setAttribute('aria-label',pets[s.pet].name+'：'+state.label+'动画'));
    render(performance.now(),true);return {action:state.id,label:state.label,paused};
  }
  function selectDirection(index){
    if(!Number.isInteger(index)||index<0||index>15)throw new Error('Unknown direction');
    selectedDirection=index;
    if(ready){['full','half'].forEach(pet=>loadRow(pet,9+Math.floor(index/8)));assetStatus();}
    document.getElementById('gaze-label').textContent=directionNames[index]+' · '+(index*22.5)+'°';
    [...directionButtons.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    sprites.filter(s=>s.context==='gaze').forEach(s=>s.canvas.setAttribute('aria-label',pets[s.pet].name+'：'+directionNames[index]+'注视'));
    render(performance.now(),true);
    return {direction:index,degrees:index*22.5,label:directionNames[index]};
  }
  function setPaused(value){
    if(typeof value!=='boolean')throw new Error('paused must be boolean');
    if(value!==paused){clock=playTime();clockOrigin=performance.now();paused=value;}
    pauseButton.textContent=paused?'播放动画':'暂停动画';
    pauseButton.setAttribute('aria-pressed',String(paused));render(performance.now(),true);
    return {paused};
  }
  function previewPet(pet,scroll=true){
    if(!Object.hasOwn(pets,pet))throw new Error('Unknown pet');
    clearTimeout(highlightTimer);
    document.querySelectorAll('.stage-pet.highlighted').forEach(element=>element.classList.remove('highlighted'));
    setDemoMode('motion');selectAction(3);
    if(!reducedMotion.matches)setPaused(false);
    const stage=document.getElementById(pet+'-stage');stage.classList.add('highlighted');
    document.getElementById('preview-status').textContent='正在展示'+pets[pet].name+'，对应位置已高亮。';
    if(scroll){
      history.replaceState(null,'','#motion');
      stage.focus({preventScroll:true});
      const target=innerWidth<=560?stage:document.getElementById('playground');
      target.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'});
    }
    highlightTimer=setTimeout(()=>stage.classList.remove('highlighted'),3600);
    return {pet,name:pets[pet].name,action:'waving',mode,paused};
  }
  states.forEach((state,index)=>{
    const button=document.createElement('button');button.type='button';button.className='action-button';
    button.textContent=state.label;button.dataset.action=state.id;button.setAttribute('aria-pressed',String(index===0));
    button.addEventListener('click',()=>selectAction(index));actionButtons.append(button);
  });
  directionNames.forEach((name,index)=>{
    const button=document.createElement('button');button.type='button';button.className='direction-button';
    button.textContent=(index*22.5)+'°';button.setAttribute('aria-label',name+'，'+(index*22.5)+'度');button.setAttribute('aria-pressed',String(index===0));
    button.addEventListener('click',()=>{followInput.checked=false;selectDirection(index);});directionButtons.append(button);
  });
  modeTabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>setDemoMode(index===0?'motion':'gaze'));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?1:1-index;
      setDemoMode(next===0?'motion':'gaze',true);
    });
  });
  document.querySelectorAll('[data-preview]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();previewPet(link.dataset.preview);}));
  document.querySelectorAll('[data-greet]').forEach(button=>button.addEventListener('click',()=>{
    if(reducedMotion.matches||paused)return;
    greetings[button.dataset.greet]=playTime()+1600;render(performance.now(),true);
  }));
  function respondInstall(pet,action='waving'){
    if(!Object.hasOwn(pets,pet)||!['waving','jumping'].includes(action)||reducedMotion.matches||paused)return;
    const row=action==='jumping'?4:3;
    const duration=row===4?states[row].durations.reduce((sum,value)=>sum+value,0):1600;
    const response={row,started:0,ends:0};
    installResponses[pet]=response;
    const asset=loadRow(pet,row);
    function startResponse(){
      if(installResponses[pet]!==response||reducedMotion.matches||paused)return;
      response.started=playTime();response.ends=response.started+duration;
      render(performance.now(),true);
    }
    if(asset.status==='ready')startResponse();
    else asset.promise.then(startResponse).catch(()=>{});
  }
  document.querySelectorAll('[data-install-preview]').forEach(button=>{
    button.addEventListener('click',()=>respondInstall(button.dataset.installPreview));
    button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')respondInstall(button.dataset.installPreview);});
  });
  document.addEventListener('suzuka-install-preview',event=>respondInstall(event.detail?.pet,event.detail?.action));
  pauseButton.addEventListener('click',()=>setPaused(!paused));
  function pointDirection(event){
    if(mode!=='gaze'||!followInput.checked)return;
    const bounds=gazeZone.getBoundingClientRect();
    const dx=event.clientX-(bounds.left+bounds.width/2),dy=event.clientY-(bounds.top+bounds.height/2);
    if(Math.hypot(dx,dy)<12)return;
    const degree=(Math.atan2(dx,-dy)*180/Math.PI+360)%360,next=Math.round(degree/22.5)%16;
    if(next!==selectedDirection)selectDirection(next);
  }
  gazeZone.addEventListener('pointermove',pointDirection);gazeZone.addEventListener('pointerdown',pointDirection);
  const visibilityObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    entries.forEach(entry=>{const sprite=sprites.find(s=>s.element===entry.target);if(sprite){sprite.visible=entry.isIntersecting;sprite.lastFrame='';}});
    render(performance.now(),true);
  },{rootMargin:'100px'}):null;
  sprites.forEach(sprite=>visibilityObserver?.observe(sprite.element));
  const resizeObserver='ResizeObserver' in window?new ResizeObserver(fitCanvases):null;
  sprites.forEach(sprite=>resizeObserver?.observe(sprite.element));
  window.addEventListener('resize',fitCanvases);
  window.addEventListener('hashchange',()=>{if(location.hash==='#gaze')setDemoMode('gaze');else if(location.hash==='#motion')setDemoMode('motion');});
  reducedMotion.addEventListener('change',event=>{if(event.matches)setPaused(true);});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)render(performance.now(),true);});
  function animate(now){render(now);requestAnimationFrame(animate);}
  setDemoMode(location.hash==='#gaze'?'gaze':'motion');setPaused(paused);selectAction(0);selectDirection(0);requestAnimationFrame(animate);
  Promise.all(['full','half'].map(pet=>loadRow(pet,0).promise)).then(()=>{
    ready=true;fitCanvases();render(performance.now(),true);
    const row=mode==='motion'?selectedState:9+Math.floor(selectedDirection/8);
    ['full','half'].forEach(pet=>loadRow(pet,row));assetStatus();
    const primeGreeting=()=>['full','half'].forEach(pet=>loadRow(pet,3));
    if('requestIdleCallback' in window)requestIdleCallback(primeGreeting,{timeout:2000});else setTimeout(primeGreeting,600);
  }).catch(()=>{
    const status=document.getElementById('asset-status');status.setAttribute('role','alert');status.textContent='动画暂时没载入，先显示静态形象。可以刷新再试。';
  });
  const context=document.modelContext;
  if(context?.registerTool){
    const lifecycle=new AbortController();
    const tools=[
      {name:'preview_suzuka_action',title:'预览铃鹿动作',description:'打开日常动作模式并选择九种动作之一，两只铃鹿同步展示，首屏继续独立待机。',inputSchema:{type:'object',properties:{action:{type:'string',enum:states.map(state=>state.id)}},required:['action'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:async input=>{if(!input||typeof input.action!=='string')throw new Error('action is required');const index=states.findIndex(state=>state.id===input.action);if(index<0)throw new Error('Unknown action');setDemoMode('motion');return selectAction(index);}},
      {name:'preview_suzuka_direction',title:'预览铃鹿注视方向',description:'打开注视模式并选择0至15的方向，按从上方开始顺时针每22.5度展示。',inputSchema:{type:'object',properties:{direction:{type:'integer',minimum:0,maximum:15}},required:['direction'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:async input=>{if(!input||!Number.isInteger(input.direction)||input.direction<0||input.direction>15)throw new Error('Invalid direction');setDemoMode('gaze');followInput.checked=false;return selectDirection(input.direction);}},
      {name:'set_suzuka_animation_playback',title:'设置铃鹿动画播放',description:'暂停或继续首屏与动作剧场的网页动画。',inputSchema:{type:'object',properties:{paused:{type:'boolean'}},required:['paused'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:async input=>{if(!input||typeof input.paused!=='boolean')throw new Error('Invalid playback state');return setPaused(input.paused);}},
      {name:'preview_suzuka_pet',title:'查看一只铃鹿的动作',description:'跳到动作剧场，展示打招呼并高亮胜负服全身款或运动服半身款。',inputSchema:{type:'object',properties:{pet:{type:'string',enum:['full','half']}},required:['pet'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:async input=>{if(!input||!Object.hasOwn(pets,input.pet))throw new Error('Unknown pet');return previewPet(input.pet);}}
    ];
    tools.forEach(tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}});
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
})();
