// C4 / ARGON — Luxury Anime Stage & Shortener Bypass HUD
// Zero telemetry, zero DRM, pure standalone client with integrated protocol sniffer.
(function () {
  'use strict';

  const HUD_ID = 'c4-bypass-hud';
  const existing = document.getElementById(HUD_ID);
  if (existing) {
    existing.style.display = existing.style.display === 'none' ? 'flex' : 'none';
    return;
  }

  // --- Live Protocol Sniffer ---
  if (!window._c4_trace) {
    window._c4_trace = [];
    const origFetch = window.fetch;
    window.fetch = async function (...args) {
      const entry = {
        type: 'fetch',
        url: typeof args[0] === 'string' ? args[0] : (args[0]?.url || String(args[0])),
        method: args[1]?.method || 'GET',
        headers: args[1]?.headers || {},
        body: args[1]?.body ? String(args[1].body) : null,
        timestamp: Date.now()
      };
      try {
        const res = await origFetch.apply(this, args);
        const clone = res.clone();
        try { entry.response = await clone.text(); } catch (_) { entry.response = '<stream>'; }
        entry.status = res.status;
        window._c4_trace.push(entry);
        return res;
      } catch (err) {
        entry.error = err.message;
        window._c4_trace.push(entry);
        throw err;
      }
    };
  }

  // --- CDN Asset URLs (Hosted on user's GitHub repo with fallback) ---
  const BANNER_URL = 'https://raw.githubusercontent.com/novachrono09/c4-bypass/main/assets/banner.jpg';
  const AVATAR_URL = 'https://raw.githubusercontent.com/novachrono09/c4-bypass/main/assets/avatar.jpg';

  // --- Theme & Styles (Obsidian Luxury Anime Aesthetic) ---
  const style = document.createElement('style');
  style.id = 'c4-bypass-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

    #${HUD_ID} {
      position: fixed; top: 24px; right: 24px; z-index: 2147483647;
      width: 340px; background: rgba(10, 10, 12, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(255, 255, 255, 0.05);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #f4f4f5; display: flex; flex-direction: column; overflow: hidden;
      user-select: none; backdrop-filter: blur(28px) saturate(180%);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    #${HUD_ID} * { box-sizing: border-box; }

    .c4-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; background: rgba(18, 18, 22, 0.6);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06); cursor: move;
    }
    .c4-brand { display: flex; align-items: center; gap: 8px; }
    .c4-avatar {
      width: 22px; height: 22px; border-radius: 50%;
      background: url('${AVATAR_URL}') center/cover no-repeat, #27272a;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .c4-title {
      font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
      color: #fafafa; text-transform: uppercase;
    }
    .c4-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; }
    .c4-close {
      background: transparent; border: none; color: #71717a; font-size: 18px;
      cursor: pointer; padding: 0 4px; line-height: 1; transition: color 0.15s;
    }
    .c4-close:hover { color: #f43f5e; }

    /* Character Hero Art Canvas */
    .c4-hero {
      position: relative; width: 100%; height: 140px;
      background: linear-gradient(180deg, rgba(10, 10, 12, 0.1) 0%, rgba(10, 10, 12, 0.95) 100%),
                  url('${BANNER_URL}') center 20%/cover no-repeat, #18181b;
      display: flex; flex-direction: column; justify-content: flex-end; padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .c4-hero-badge {
      align-self: flex-start; background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 4px;
      padding: 2px 7px; font-size: 9px; font-family: 'JetBrains Mono', monospace;
      color: #e4e4e7; letter-spacing: 1px; text-transform: uppercase;
      margin-bottom: 4px; backdrop-filter: blur(8px);
    }
    .c4-hero-name {
      font-size: 16px; font-weight: 700; color: #ffffff;
      letter-spacing: 0.5px; text-shadow: 0 2px 8px rgba(0,0,0,0.8);
    }

    /* Body Controls */
    .c4-body { padding: 14px; display: flex; flex-direction: column; gap: 12px; }

    /* Minimalist Digital Timer Readout */
    .c4-timer-wrap {
      display: flex; align-items: baseline; justify-content: space-between;
      padding: 10px 14px; background: rgba(18, 18, 22, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px;
    }
    .c4-timer-label { font-size: 10px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 1px; }
    .c4-clock {
      font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 700;
      color: #ffffff; letter-spacing: 1px; font-variant-numeric: tabular-nums;
    }

    /* Duration Selector Pills */
    .c4-preset-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    .c4-pill {
      background: rgba(24, 24, 27, 0.7); border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px; color: #a1a1aa; font-size: 11px; font-weight: 600;
      padding: 7px 0; text-align: center; cursor: pointer; transition: all 0.15s;
    }
    .c4-pill:hover { background: rgba(39, 39, 42, 0.9); color: #fafafa; border-color: rgba(255, 255, 255, 0.2); }
    .c4-pill.active {
      background: #fafafa; color: #09090b; border-color: #ffffff;
      box-shadow: 0 2px 10px rgba(255, 255, 255, 0.15);
    }

    .c4-custom-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 4px 0; font-size: 11px; color: #71717a;
    }
    .c4-input-box {
      width: 55px; background: rgba(24, 24, 27, 0.8); border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px; color: #fafafa; font-family: 'JetBrains Mono', monospace; font-size: 12px;
      text-align: center; padding: 4px; outline: none; transition: border-color 0.15s;
    }
    .c4-input-box:focus { border-color: #f43f5e; }

    /* Action Trigger */
    .c4-btn-action {
      background: #f43f5e; color: #ffffff; font-weight: 700; font-size: 12px;
      letter-spacing: 0.8px; padding: 11px; border: none; border-radius: 8px;
      cursor: pointer; transition: all 0.15s; box-shadow: 0 4px 15px rgba(244, 63, 94, 0.25);
    }
    .c4-btn-action:hover { background: #fb7185; box-shadow: 0 6px 20px rgba(244, 63, 94, 0.35); transform: translateY(-1px); }
    .c4-btn-action:active { transform: translateY(0); }
    .c4-btn-action:disabled { background: #3f3f46; color: #71717a; cursor: not-allowed; box-shadow: none; transform: none; }

    .c4-btn-sniff {
      background: transparent; color: #a1a1aa; font-weight: 500; font-size: 11px;
      padding: 6px; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px;
      cursor: pointer; transition: all 0.15s;
    }
    .c4-btn-sniff:hover { background: rgba(255, 255, 255, 0.04); color: #fafafa; border-color: rgba(255, 255, 255, 0.16); }

    /* Hairline Progress */
    .c4-track { width: 100%; height: 2px; background: rgba(255, 255, 255, 0.06); border-radius: 1px; overflow: hidden; }
    .c4-bar { width: 0%; height: 100%; background: #f43f5e; transition: width 0.2s linear; }

    /* Status Ticker */
    .c4-status {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #71717a;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-height: 14px;
    }
  `;
  document.head.appendChild(style);

  // --- HTML Assembly ---
  const hud = document.createElement('div');
  hud.id = HUD_ID;
  hud.innerHTML = `
    <div class="c4-header" id="c4-drag">
      <div class="c4-brand">
        <div class="c4-avatar"></div>
        <span class="c4-title">ARGON // C4</span>
        <div class="c4-dot"></div>
      </div>
      <button class="c4-close" id="c4-btn-close">×</button>
    </div>

    <div class="c4-hero">
      <div class="c4-hero-badge">PROTO BYPASS v2.4</div>
      <div class="c4-hero-name">STAGE CONTROLLER</div>
    </div>

    <div class="c4-body">
      <div class="c4-timer-wrap">
        <span class="c4-timer-label">DURATION</span>
        <span class="c4-clock" id="c4-clock">00:00</span>
      </div>

      <div class="c4-preset-grid">
        <button class="c4-pill active" data-s="0">0s (Inst)</button>
        <button class="c4-pill" data-s="5">5s</button>
        <button class="c4-pill" data-s="15">15s</button>
        <button class="c4-pill" data-s="30">30s</button>
      </div>

      <div class="c4-custom-row">
        <span>Custom Interval</span>
        <div>
          <input class="c4-input-box" id="c4-in-s" type="number" min="0" value="0">
          <span style="margin-left:4px;">SEC</span>
        </div>
      </div>

      <button class="c4-btn-action" id="c4-btn-run">EXECUTE BYPASS</button>
      <button class="c4-btn-sniff" id="c4-btn-dump">COPY PROTOCOL LOG (<span id="c4-count">0</span>)</button>

      <div class="c4-track"><div class="c4-bar" id="c4-bar"></div></div>
      <div class="c4-status" id="c4-status">> idle. sniffer active.</div>
    </div>
  `;
  document.body.appendChild(hud);

  // --- Draggable Header ---
  const header = hud.querySelector('#c4-drag');
  let isDragging = false, dragX = 0, dragY = 0;
  header.onmousedown = (e) => {
    isDragging = true;
    dragX = e.clientX - hud.offsetLeft;
    dragY = e.clientY - hud.offsetTop;
    document.onmousemove = (ev) => {
      if (!isDragging) return;
      hud.style.left = (ev.clientX - dragX) + 'px';
      hud.style.top = (ev.clientY - dragY) + 'px';
      hud.style.right = 'auto';
    };
    document.onmouseup = () => { isDragging = false; document.onmousemove = null; };
  };

  // --- Elements & Handlers ---
  const inSeconds = hud.querySelector('#c4-in-s');
  const clock = hud.querySelector('#c4-clock');
  const bar = hud.querySelector('#c4-bar');
  const txtStatus = hud.querySelector('#c4-status');
  const btnRun = hud.querySelector('#c4-btn-run');
  const btnDump = hud.querySelector('#c4-btn-dump');
  const txtCount = hud.querySelector('#c4-count');

  hud.querySelector('#c4-btn-close').onclick = () => hud.remove();

  setInterval(() => {
    if (txtCount) txtCount.textContent = window._c4_trace.length;
  }, 400);

  hud.querySelectorAll('.c4-pill').forEach(pill => {
    pill.onclick = () => {
      hud.querySelectorAll('.c4-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      inSeconds.value = pill.dataset.s;
      updateClock(+pill.dataset.s);
    };
  });

  inSeconds.oninput = () => {
    hud.querySelectorAll('.c4-pill').forEach(p => p.classList.remove('active'));
    updateClock(parseInt(inSeconds.value, 10) || 0);
  };

  function updateClock(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    clock.textContent = `${m}:${s}`;
  }

  btnDump.onclick = () => {
    const data = JSON.stringify(window._c4_trace, null, 2);
    navigator.clipboard.writeText(data).then(() => {
      txtStatus.textContent = '> trace copied to clipboard.';
    }).catch(() => {
      console.log('C4 PROTOCOL LOG:', data);
      txtStatus.textContent = '> trace logged to console.';
    });
  };

  // Luxury Audio Chime
  function playChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5 note
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (_) {}
  }

  // --- Bypass Pipeline ---
  btnRun.onclick = async () => {
    const totalSec = parseInt(inSeconds.value, 10) || 0;
    btnRun.disabled = true;
    bar.style.width = '10%';
    txtStatus.textContent = '> probing link session...';

    try {
      const handled = await runTrpcBypass(totalSec);
      if (!handled) {
        txtStatus.textContent = '> falling back to dom trigger pulse...';
        runDomFallback();
      }
    } catch (err) {
      txtStatus.textContent = '> err: ' + (err.message || 'interrupted');
      btnRun.disabled = false;
    }
  };

  async function runTrpcBypass(delaySec) {
    let sessionRes;
    try {
      sessionRes = await fetch(`${window.location.origin}/api/session-info`, {
        method: 'GET',
        credentials: 'include'
      });
    } catch (_) {
      return false;
    }

    if (!sessionRes || !sessionRes.ok) return false;

    const sessionData = await sessionRes.json();
    const token = sessionData.sessionToken || sessionData.token;
    const totalStages = sessionData.totalStage || 1;

    if (!token) return false;

    txtStatus.textContent = `> trpc session: ${totalStages} stage(s)`;
    bar.style.width = '25%';

    // Real-time countdown
    let remaining = delaySec;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      remaining = Math.max(0, delaySec - elapsed);
      updateClock(remaining);
      const pct = Math.min(100, Math.floor((elapsed / Math.max(1, delaySec)) * 100));
      bar.style.width = `${Math.max(25, pct)}%`;
    }, 200);

    let destinationLink = null;
    const stageInterval = delaySec > 0 ? (delaySec * 1000) / totalStages : 0;

    for (let stage = 1; stage <= totalStages; stage++) {
      txtStatus.textContent = `> advancing stage [${stage}/${totalStages}]...`;
      const payload = { '0': { json: { token, stageId: stage } } };
      const endpoint = `${window.location.origin}/api/trpc/linkSession.nextStage?batch=1&input=${encodeURIComponent(JSON.stringify(payload))}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'trpc-accept': 'application/jsonl',
          'x-trpc-source': 'nextjs-react'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`stage ${stage} http ${res.status}`);
      const rawText = await res.text();

      try {
        const parsed = JSON.parse(rawText);
        destinationLink = parsed[0]?.result?.data?.json?.destinationLink || parsed.destinationLink || parsed.url;
      } catch (_) {
        const m = rawText.match(/"destinationLink"\s*:\s*"([^"]+)"/);
        if (m) destinationLink = m[1].replace(/\\/g, '');
      }

      if (stage < totalStages && stageInterval > 0) {
        await new Promise(r => setTimeout(r, stageInterval));
      }
    }

    clearInterval(timer);
    updateClock(0);
    bar.style.width = '100%';
    playChime();

    if (destinationLink) {
      txtStatus.textContent = '> target resolved. redirecting...';
      setTimeout(() => { window.location.href = destinationLink; }, 400);
    } else {
      txtStatus.textContent = '> session complete. reloading...';
      setTimeout(() => { window.location.reload(); }, 600);
    }
    return true;
  }

  function runDomFallback() {
    let triggered = false;
    ['timer', 'countdown', 'seconds'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '0';
    });

    const selectors = [
      '#btn-main', '#get-link', '#continue', '.btn-captcha',
      'a[href*="/api/redirect"]', 'button[disabled]'
    ];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(t => {
        if (t.disabled) t.disabled = false;
        if (typeof t.click === 'function') {
          t.click();
          triggered = true;
        }
      });
    }

    bar.style.width = '100%';
    txtStatus.textContent = triggered ? '> dom triggers pulsed.' : '> no targets found.';
    playChime();
  }
})();
