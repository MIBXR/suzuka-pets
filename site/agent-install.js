(() => {
  'use strict';
  const cards = [...document.querySelectorAll('[data-pet-install]')];
  if (!cards.length) return;

  function buildPrompt(pet, packageUrl, activate) {
    const mode = activate
      ? '导入完成后，将这只铃鹿设为当前桌宠，并核实启用结果。'
      : '只导入到宠物列表，保持我当前使用的桌宠不变。';
    return `请帮我安装「${pet.name}」。这是已经做好的桌宠，请直接导入现有素材。

安装要求：${mode}是否启用仅按本条指令执行。

压缩包：${packageUrl}
压缩包 SHA-256：${pet.package_sha256}
原始 spritesheet.png SHA-256：${pet.spritesheet_sha256}
素材版本：${pet.updated_at}，v2，1536×2288 像素。

请完成以下步骤：
1. 确认你能下载和解压文件，并且目标环境有支持 v2 的 Pets 导入工具或应用明确支持的导入方式。若缺少能力，请指出需要开启的入口和剩余步骤。
2. 下载上面的 ZIP，校验压缩包 SHA-256 后安全解压；这是网页“下载压缩包”按钮提供的同一份包。不要让我另外手动下载或上传已有素材。
3. 阅读包内 ${pet.readme_path} 和 ${pet.config_path}；按配置使用完整名称与描述。导入文件是 ${pet.spritesheet_path}。核对其 SHA-256、透明 PNG 格式、1536×2288 尺寸及 pet.json 中的 sprite.version=2。
4. 原样保留图集与动画。不要重新绘制、生成图片、转换为 v1，也不要用预览 GIF、网页高清展示图或设计稿代替正式 spritesheet.png。
5. 检查当前环境的宠物列表。只有确认名称、格式和素材校验值都一致时才复用已有记录；不能仅凭同名判断是相同版本。不要覆盖其他宠物。跨账号安装以目标环境返回的新记录身份为准。
6. 若使用 Pets 工具，先对解压后的原始 PNG 调用 validate_pet_spritesheet；通过后调用 prepare_pet_upload，按工具要求完成上传，再使用返回的 upload.upload_session_id 调用 create_pet。以创建返回的新 pet.id 为准；不要保存或复用临时上传会话。若使用其他受支持的导入方式，请遵循目标应用的实际流程。
7. ${mode}重新检查宠物列表或目标应用，确认安装记录、名称、素材版本和启用状态。若仍需刷新、应用确认或显示桌宠，请清楚说明最后一步；不要把“下载成功”当作“安装成功”。

请在结束时告诉我：是否安装成功、安装的是哪一款，以及是否已设为当前桌宠。`;
  }

  async function copyPrompt(textarea, details) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textarea.value);
        return true;
      }
    } catch (_) {
      // The visible text remains usable when clipboard access is blocked.
    }
    const wasOpen = details.open;
    details.open = true;
    textarea.focus();
    textarea.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) {}
    if (copied) details.open = wasOpen;
    return copied;
  }

  async function initialize() {
    const response = await fetch('downloads/agent-install.json?v=20261006-gallery');
    if (!response.ok) throw new Error('Installation information is unavailable');
    const manifest = await response.json();
    const pageUrl = new URL(document.baseURI);
    const localPreview = ['localhost', '127.0.0.1', '[::1]'].includes(pageUrl.hostname);
    if (manifest.schema_version !== 1 || !(pageUrl.protocol === 'https:' || (localPreview && pageUrl.protocol === 'http:'))) {
      throw new Error('Unexpected installation information');
    }
    for (const card of cards) {
      const pet = manifest.pets[card.dataset.petInstall];
      const installCard = card.closest('[data-install-card]');
      const download = installCard.querySelector('[data-manual-download]');
      const textarea = card.querySelector('textarea');
      const activate = card.querySelector('input[type="checkbox"]');
      const button = card.querySelector('[data-copy-install]');
      const details = card.querySelector('details');
      const status = card.querySelector('[role="status"]');
      const packageUrl = new URL(download.getAttribute('href'), pageUrl);
      if (!pet || packageUrl.href !== new URL('downloads/' + pet.package_file, pageUrl).href ||
          !/^[a-f0-9]{64}$/.test(pet.package_sha256) ||
          !/^[a-f0-9]{64}$/.test(pet.spritesheet_sha256)) {
        throw new Error('Download and installation information do not match');
      }
      let resetTimer;
      let welcomeTimer;
      let copying = false;
      function greetPreview(action='waving') {
        document.dispatchEvent(new CustomEvent('suzuka-install-preview', {detail:{pet:card.dataset.petInstall,action}}));
        installCard.classList.remove('welcoming');
        requestAnimationFrame(() => installCard.classList.add('welcoming'));
        clearTimeout(welcomeTimer);
        welcomeTimer = setTimeout(() => installCard.classList.remove('welcoming'), 700);
      }
      download.addEventListener('click', () => greetPreview());
      function refreshPrompt() {
        textarea.value = buildPrompt(pet, packageUrl.href, activate.checked);
        clearTimeout(resetTimer);
        button.textContent = '复制安装指令';
        status.textContent = '';
      }
      refreshPrompt();
      activate.disabled = false;
      button.disabled = false;
      activate.addEventListener('change', refreshPrompt);
      button.addEventListener('click', async () => {
        if (copying) return;
        copying = true;
        clearTimeout(resetTimer);
        const copied = await copyPrompt(textarea, details);
        copying = false;
        if (copied) {
          greetPreview('jumping');
          button.textContent = '已复制';
          status.textContent = '贴给你的 Agent，让它帮你安装。';
          button.focus();
          resetTimer = setTimeout(() => { button.textContent = '复制安装指令'; }, 2500);
        } else {
          details.open = true;
          status.textContent = '浏览器未允许复制，请选中下方指令手动复制。';
          textarea.focus();
          textarea.select();
        }
      });
    }
  }

  initialize().catch(() => {
    for (const card of cards) {
      card.querySelector('[data-copy-install]').disabled = true;
      card.querySelector('textarea').value = '';
      card.querySelector('textarea').placeholder = '指令暂时无法加载，请刷新页面。';
      card.querySelector('[role="status"]').textContent = '指令暂时无法加载。可以刷新页面，或下载压缩包按包内说明导入。';
    }
  });
})();
