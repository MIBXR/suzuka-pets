(() => {
  'use strict';
  const cards = [...document.querySelectorAll('[data-pet-install]')];
  if (!cards.length) return;

  function buildPrompt(pet, packageUrl, activate) {
    const slug = pet.config_path.split('/')[0];
    const mode = activate
      ? '安装完成后，将这只铃鹿设为当前桌宠，并核实启用结果。'
      : '只安装这只铃鹿，保持我当前使用的桌宠不变。';
    return `请帮我安装「${pet.name}」。这是采用 PetDex sprite v2 的便携桌宠，请直接使用现有素材；安装不以存在 codex 命令为前提。

安装要求：${mode}是否启用仅按本条指令执行。

压缩包：${packageUrl}
压缩包 SHA-256：${pet.package_sha256}
原始 spritesheet.png SHA-256：${pet.spritesheet_sha256}
素材版本：${pet.updated_at}，v2，1536×2288 像素。

请完成以下步骤：
1. 确认本次目标应用与用户主目录（Windows 通常为 USERPROFILE，不是项目工作目录）：用户已指定目标时按其执行，否则以当前 Agent 的宿主为目标，按以下顺序选择安装目录：
   - Codex：确认目标客户端支持 sprite v2；读取实际 CODEX_HOME，未设置时使用用户主目录下的 .codex，安装到该目录的 pets/${slug}/。可直接安装文件，不要求运行 codex 命令。若客户端仅支持 v1，保留原图并改用下面的 PetDex 目录。
   - 其他 Agent：确认它支持 PetDex sprite v2，并从该 Agent 的文档或实际配置取得宠物目录，再安装到其中的 ${slug}/；不要猜测目录。
   - 没有可用的 Agent 宠物目录：安装到用户主目录下的 .petdex/pets/${slug}/（即 ~/.petdex/pets/${slug}/）。这是 PetDex 标准目录；文件安装后需 PetDex Desktop 或兼容客户端加载。
2. 下载上面的 ZIP，校验压缩包 SHA-256 后安全解压；这是网页“下载压缩包”按钮提供的同一份包。不要让我另外手动下载或上传已有素材。
3. 阅读包内 ${pet.readme_path} 和 ${pet.config_path}；按配置使用完整名称与描述。导入文件是 ${pet.spritesheet_path}。核对其 SHA-256、透明 PNG 格式、1536×2288 尺寸及 pet.json 中的 sprite.version=2。
4. 原样保留图集与动画。不要重新绘制、生成图片、转换为 v1，也不要用预览 GIF、网页高清展示图或设计稿代替正式 spritesheet.png。
5. 检查目标目录或宠物列表。只有确认名称、格式和素材校验值都一致时才复用已有安装；不能仅凭同名判断是相同版本，也不要覆盖其他宠物。使用目标应用支持的文件安装或导入方式。Codex / PetDex 本地安装时，保留包内元数据，并在目标 pet.json 中设置 id="${slug}"、displayName=包内 name、description=包内 description、spritesheetPath="spritesheet.png"、spriteVersionNumber=2；其他 Agent 按它支持的配置格式适配。不要把生图、云端上传工具或 codex 命令当作安装前置条件。
6. ${mode}按目标应用支持的方式处理启用状态。若只能完成 PetDex 目录安装，明确说明文件已安装、尚待兼容客户端加载；不要声称已经显示或启用。
7. 回读目标目录中的配置和图集校验值；能检查应用时，再核实宠物记录与启用状态。若仍需刷新或应用确认，请清楚说明最后一步。

请在结束时告诉我：目标应用、实际安装路径、安装的是哪一款、文件是否安装成功，以及是否已设为当前桌宠。`;
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
    const response = await fetch('downloads/agent-install.json?v=20261009-petdex');
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
