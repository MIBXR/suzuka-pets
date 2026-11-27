const $ = id => document.getElementById(id);
const titles = ['Silent Star', 'Endless Dream'];
const urls = ['silent-star.mp3','endless-dream-suzuka.mp3'].map(file => 'assets/audio/' + file);
const audio = document.createElement('audio');
audio.id = 'bgm';
audio.loop = true;
audio.preload = 'auto';
document.body.append(audio);
let track = 0, fade = 0;
let silentStarURL;

export const soundReady = fetch(urls[0]).then(r => r.blob()).then(blob => {
  silentStarURL = URL.createObjectURL(blob);
  audio.src = silentStarURL;
  return new Promise((resolve, reject) => {
    audio.addEventListener('canplaythrough', resolve, {once:true});
    audio.addEventListener('error', reject, {once:true});
    audio.load();
  });
});

function sync() {
  const active = !audio.paused;
  $('playMusic').querySelector('use').setAttribute('href', 'icons.svg#' + (active ? 'pause' : 'play'));
  $('playMusic').setAttribute('aria-label', active ? '暂停音乐' : '播放音乐');
  $('trackName').textContent = titles[track];
  $('tracks').querySelectorAll('button').forEach((b,i) => b.setAttribute('aria-current', String(i === track)));
}
function play(fadeIn = false) {
  cancelAnimationFrame(fade);
  audio.volume = fadeIn ? .35 : .65;
  if (fadeIn) audio.currentTime = 1.15;
  return audio.play().then(() => {
    if (!fadeIn) return;
    const start = performance.now();
    function rise(now) {
      const progress = Math.min(1, (now-start)/550);
      audio.volume = .35 + .30 * (1 - (1-progress)**2);
      if (progress < 1) fade = requestAnimationFrame(rise);
    }
    fade = requestAnimationFrame(rise);
  }).catch(sync);
}
export function startMusic(enabled) {
  if (!enabled) return;
  return audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA ? play(true) : soundReady.then(() => play(true));
}
function menu(open) {
  $('tracks').hidden = !open;
  $('trackMenu').setAttribute('aria-expanded', String(open));
}
audio.addEventListener('play',sync);
audio.addEventListener('pause',sync);
$('playMusic').onclick = () => audio.paused ? play() : audio.pause();
$('trackMenu').onclick = () => menu($('tracks').hidden);
$('tracks').onclick = event => {
  const button = event.target.closest('[data-track]');
  if (!button) return;
  const next = Number(button.dataset.track);
  if (next !== track) { track = next; audio.src = next===0 && silentStarURL ? silentStarURL : urls[next]; }
  play(); sync(); menu(false); $('trackMenu').focus();
};
document.addEventListener('pointerdown', e => { if (!$('music').contains(e.target)) menu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('tracks').hidden) { menu(false); $('trackMenu').focus(); } });
sync();
