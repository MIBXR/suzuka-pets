const root = 'assets/motion-hd/';
const version = '?v=20261004i';
const manifest = fetch(root + 'manifest.json' + version).then(r => r.json());
const families = {};
const loading = {};
export const names = {half: '运动服半身', full: '胜负服全身'};
export const motions = [
  ['发呆', '窗边很暖，陪你坐一会儿。', [3000,100,100,100,100,3200]],
  ['向右小跑', '那边好像还有一束阳光。', [120,120,120,120,120,120,120,220]],
  ['向左小跑', '绕过书角，再跑回你身边。', [120,120,120,120,120,120,120,220]],
  ['打个招呼', '你来了。这里给你留了位置。', [140,140,140,280]],
  ['轻轻一跳', '脚尖一蹬，发梢也跟着飞起来。', [140,140,140,140,280]],
  ['小失落', '耳朵垂下来，歇一会儿再试。', [140,140,140,140,140,140,140,240]],
  ['等你回应', '三个小点，一个接一个。', [150,150,150,150,150,260]],
  ['认真工作', '小电脑打开了。听，键帽在响。', [120,120,120,120,120,220]],
  ['检查一下', '再看一眼，确认每处细节。', [150,150,150,150,150,280]],
  ['循光注视', '绕着她移动指针，或在罗盘上滑动。', Array(16).fill(180)]
];
export function loadOutfit(outfit) {
  return loading[outfit] ??= manifest.then(async catalog => {
    families[outfit] = await Promise.all(catalog.pets[outfit].rows.map(async (row, index) => {
      const img = new Image();
      img.src = root + outfit + '-body-' + index + '.webp' + version;
      await img.decode();
      return {img, frames: row.frames};
    }));
  });
}
export function frameAt(motion, elapsed) {
  const durations = motions[motion][2];
  let t = Math.max(0, elapsed) % durations.reduce((a,b) => a+b);
  return durations.findIndex(duration => (t -= duration) < 0);
}
export function gazeIndex(x, y) {
  return (Math.round(Math.atan2(x, -y) / (Math.PI / 8)) + 16) % 16;
}
export function draw(canvas, outfit, motion, index) {
  if (!families[outfit]) return;
  const row = motion === 9 ? 9 + (index >> 3) : motion;
  const column = motion === 9 ? index % 8 : index;
  const key = outfit + '/' + row + '/' + column;
  if (canvas.dataset.frame === key) return;
  const {img, frames} = families[outfit][row];
  const f = frames[column], ctx = canvas.getContext('2d');
  const sx = canvas.width / 192, sy = canvas.height / 208;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, column * 576, 0, f.width, f.height, f.x*sx, f.y*sy, f.width*f.scale*sx, f.height*f.scale*sy);
  canvas.dataset.frame = key;
}
