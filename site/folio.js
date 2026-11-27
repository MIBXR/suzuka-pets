import {draw, frameAt, loadOutfit, names} from './sprites.js';
import {installData, buildPrompt, zipURL} from './packages.js';
const $=id=>document.getElementById(id);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let selected, packages, copyTimer, previewStart;

function refreshPrompt(){
  const pet=packages[selected];
  $('promptText').value=buildPrompt(pet,zipURL(pet),$('activate').checked);
  clearTimeout(copyTimer);$('copyPrompt').querySelector('span').textContent='复制 Agent 安装指令';
}
async function choose(outfit){
  selected=outfit;
  const pet=packages[outfit];previewStart=performance.now();
  $('packageTitle').textContent=names[outfit]+' '+pet.updated_at;
  $('packageFile').textContent=pet.package_file;
  $('zip').href=zipURL(pet);
  $('folioPet').setAttribute('aria-label',names[outfit]+'铃鹿动态预览');
  $('folio').querySelectorAll('[data-form]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.form===outfit)));
  refreshPrompt();
  await loadOutfit(outfit);
  if(selected===outfit) renderFolio(performance.now());
}
export async function prepareFolio(outfit){
  packages=await installData;
  $('promptDetails').open=false;
  $('folio').querySelector('.folio-scroll').scrollTop=0;
  await choose(outfit);
}
export function renderFolio(now){
  if(!selected)return;
  const t=(now-previewStart)%6800, row=!reduced.matches && t<1500?3:0;
  draw($('folioPet'),selected,row,frameAt(row,reduced.matches?0:t));
}
$('folio').querySelectorAll('[data-form]').forEach(b=>b.onclick=()=>choose(b.dataset.form));
$('activate').onchange=refreshPrompt;
$('copyPrompt').onclick=async()=>{
  const field=$('promptText'),label=$('copyPrompt').querySelector('span');
  try{await navigator.clipboard.writeText(field.value);}
  catch{
    const wasOpen=$('promptDetails').open;
    $('promptDetails').open=true;field.focus();field.select();
    if(!document.execCommand('copy')){label.textContent='请手动复制选中文字';return;}
    $('promptDetails').open=wasOpen;
  }
  label.textContent='已复制';clearTimeout(copyTimer);copyTimer=setTimeout(()=>label.textContent='复制 Agent 安装指令',2500);
};
