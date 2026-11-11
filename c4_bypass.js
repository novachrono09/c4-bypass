// C4 / ARGON — Android & Desktop Universal Luxury Anime Shortener Bypass HUD
// Zero CSP dependency, zero external network dependency, touch-enabled.
(function () {
  'use strict';

  const HUD_ID = 'c4-bypass-hud';
  const STYLE_ID = 'c4-bypass-styles';

  // Always force clean re-inject so multiple taps don't get stuck
  const prevHud = document.getElementById(HUD_ID);
  if (prevHud) prevHud.remove();
  const prevStyle = document.getElementById(STYLE_ID);
  if (prevStyle) prevStyle.remove();

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

  // --- Theme Styles ---
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #${HUD_ID} {
      position: fixed !important; top: 12px !important; right: 12px !important;
      left: auto !important; bottom: auto !important;
      width: min(320px, calc(100vw - 24px)) !important;
      max-height: 92vh !important;
      background: #09090b !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      border-radius: 12px !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      color: #f4f4f5 !important;
      display: flex !important; flex-direction: column !important;
      overflow: hidden !important; z-index: 2147483647 !important;
      user-select: none !important; -webkit-user-select: none !important;
      box-sizing: border-box !important;
      opacity: 1 !important; visibility: visible !important;
    }
    #${HUD_ID} * { box-sizing: border-box !important; }

    .c4-bar-top {
      display: flex !important; align-items: center !important; justify-content: space-between !important;
      padding: 8px 12px !important; background: #121216 !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
      cursor: move !important; touch-action: none !important;
    }
    .c4-brand-wrap { display: flex !important; align-items: center !important; gap: 7px !important; }
    .c4-dot-live { width: 6px !important; height: 6px !important; border-radius: 50% !important; background: #10b981 !important; box-shadow: 0 0 6px #10b981 !important; }
    .c4-brand-txt { font-size: 11px !important; font-weight: 700 !important; letter-spacing: 1.2px !important; color: #fff !important; }
    .c4-btn-x {
      background: transparent !important; border: none !important; color: #71717a !important;
      font-size: 20px !important; line-height: 1 !important; cursor: pointer !important; padding: 0 4px !important;
    }
    .c4-btn-x:hover { color: #f43f5e !important; }

    /* Character Visual Card */
    .c4-visual {
      position: relative !important; width: 100% !important; height: 110px !important;
      background: #18181b !important; overflow: hidden !important;
      display: flex !important; flex-direction: column !important; justify-content: flex-end !important;
      padding: 10px 12px !important;
    }
    .c4-visual img {
      position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important;
      object-fit: cover !important; object-position: center 25% !important;
      opacity: 0.75 !important; pointer-events: none !important;
    }
    .c4-visual-mask {
      position: absolute !important; inset: 0 !important;
      background: linear-gradient(180deg, rgba(9,9,11,0.1) 0%, rgba(9,9,11,0.92) 100%) !important;
      pointer-events: none !important;
    }
    .c4-tag {
      position: relative !important; z-index: 2 !important; align-self: flex-start !important;
      background: rgba(0,0,0,0.65) !important; border: 1px solid rgba(255,255,255,0.15) !important;
      border-radius: 4px !important; padding: 2px 6px !important;
      font-size: 9px !important; font-family: monospace !important; color: #e4e4e7 !important;
      letter-spacing: 1px !important; margin-bottom: 3px !important;
    }
    .c4-subhead {
      position: relative !important; z-index: 2 !important;
      font-size: 14px !important; font-weight: 700 !important; color: #ffffff !important;
      letter-spacing: 0.5px !important; text-shadow: 0 2px 6px rgba(0,0,0,0.9) !important;
    }

    /* Content Area */
    .c4-content { padding: 12px !important; display: flex !important; flex-direction: column !important; gap: 10px !important; }

    .c4-clock-box {
      display: flex !important; align-items: baseline !important; justify-content: space-between !important;
      padding: 8px 12px !important; background: #121216 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important; border-radius: 8px !important;
    }
    .c4-clock-lbl { font-size: 10px !important; font-weight: 600 !important; color: #71717a !important; letter-spacing: 1px !important; }
    .c4-digits {
      font-family: monospace !important; font-size: 24px !important; font-weight: 700 !important;
      color: #ffffff !important; font-variant-numeric: tabular-nums !important;
    }

    .c4-pills { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 5px !important; }
    .c4-pill {
      background: #18181b !important; border: 1px solid rgba(255,255,255,0.08) !important;
      border-radius: 6px !important; color: #a1a1aa !important; font-size: 11px !important;
      font-weight: 600 !important; padding: 6px 0 !important; text-align: center !important;
      cursor: pointer !important;
    }
    .c4-pill.active { background: #fafafa !important; color: #09090b !important; border-color: #fff !important; }

    .c4-input-row {
      display: flex !important; align-items: center !important; justify-content: space-between !important;
      font-size: 11px !important; color: #71717a !important; padding: 2px 0 !important;
    }
    .c4-num-in {
      width: 52px !important; background: #18181b !important; border: 1px solid rgba(255,255,255,0.12) !important;
      border-radius: 6px !important; color: #fafafa !important; font-family: monospace !important;
      font-size: 12px !important; text-align: center !important; padding: 3px !important; outline: none !important;
    }

    .c4-btn-exec {
      width: 100% !important; background: #f43f5e !important; color: #fff !important;
      font-weight: 700 !important; font-size: 12px !important; letter-spacing: 0.8px !important;
      padding: 10px !important; border: none !important; border-radius: 8px !important;
      cursor: pointer !important; box-shadow: 0 4px 14px rgba(244, 63, 94, 0.3) !important;
    }
    .c4-btn-exec:active { opacity: 0.85 !important; }
    .c4-btn-exec:disabled { background: #3f3f46 !important; color: #71717a !important; cursor: not-allowed !important; box-shadow: none !important; }

    .c4-btn-copy {
      width: 100% !important; background: transparent !important; color: #a1a1aa !important;
      font-size: 10px !important; font-weight: 600 !important; padding: 6px !important;
      border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 6px !important;
      cursor: pointer !important;
    }

    .c4-rail { width: 100% !important; height: 2px !important; background: rgba(255,255,255,0.08) !important; border-radius: 1px !important; overflow: hidden !important; }
    .c4-fill { width: 0% !important; height: 100% !important; background: #f43f5e !important; transition: width 0.2s linear !important; }
    .c4-msg {
      font-family: monospace !important; font-size: 10px !important; color: #71717a !important;
      white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;
      min-height: 14px !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  // --- HTML Build ---
  const hud = document.createElement('div');
  hud.id = HUD_ID;
  hud.innerHTML = `
    <div class="c4-bar-top" id="c4-drag">
      <div class="c4-brand-wrap">
        <div class="c4-dot-live"></div>
        <span class="c4-brand-txt">ARGON // C4</span>
      </div>
      <button class="c4-btn-x" id="c4-x">×</button>
    </div>

    <div class="c4-visual">
      <img src="https://raw.githubusercontent.com/novachrono09/c4-bypass/main/assets/banner.jpg"
           referrerpolicy="no-referrer"
           onerror="this.src='https://wallpapercave.com/wp/wp12166668.jpg'" />
      <div class="c4-visual-mask"></div>
      <div class="c4-tag">STAGE BYPASS</div>
      <div class="c4-subhead">SESSION CONTROLLER</div>
    </div>

    <div class="c4-content">
      <div class="c4-clock-box">
        <span class="c4-clock-lbl">INTERVAL</span>
        <span class="c4-digits" id="c4-clock">00:00</span>
      </div>

      <div class="c4-pills">
        <button type="button" class="c4-pill active" data-s="0">0s (Inst)</button>
        <button type="button" class="c4-pill" data-s="5">5s</button>
        <button type="button" class="c4-pill" data-s="15">15s</button>
        <button type="button" class="c4-pill" data-s="30">30s</button>
      </div>

      <div class="c4-input-row">
        <span>Custom Interval</span>
        <div>
          <input class="c4-num-in" id="c4-sec" type="number" min="0" value="0">
          <span style="margin-left:3px;">SEC</span>
        </div>
      </div>

      <button type="button" class="c4-btn-exec" id="c4-run">EXECUTE BYPASS</button>
      <button type="button" class="c4-btn-copy" id="c4-dump">COPY PROTOCOL LOG (<span id="c4-cnt">0</span>)</button>

      <div class="c4-rail"><div class="c4-fill" id="c4-bar"></div></div>
      <div class="c4-msg" id="c4-msg">> ready. sniffer active.</div>
    </div>
  `;
  (document.body || document.documentElement).appendChild(hud);

  // --- Touch & Mouse Draggable ---
  const dragHandle = hud.querySelector('#c4-drag');
  let isMoving = false, startX = 0, startY = 0, hudX = 0, hudY = 0;

  function onPointerStart(e) {
    isMoving = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = clientX;
    startY = clientY;
    const rect = hud.getBoundingClientRect();
    hudX = rect.left;
    hudY = rect.top;
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isMoving) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const newLeft = hudX + (clientX - startX);
    const newTop = hudY + (clientY - startY);
    hud.style.left = Math.max(4, Math.min(window.innerWidth - hud.offsetWidth - 4, newLeft)) + 'px';
    hud.style.top = Math.max(4, Math.min(window.innerHeight - hud.offsetHeight - 4, newTop)) + 'px';
    hud.style.right = 'auto';
  }

  function onPointerEnd() { isMoving = false; }

  dragHandle.addEventListener('mousedown', onPointerStart);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerEnd);

  dragHandle.addEventListener('touchstart', onPointerStart, { passive: false });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerEnd);

  // --- Controls & Handlers ---
  const inSec = hud.querySelector('#c4-sec');
  const clock = hud.querySelector('#c4-clock');
  const bar = hud.querySelector('#c4-bar');
  const txtMsg = hud.querySelector('#c4-msg');
  const btnRun = hud.querySelector('#c4-run');
  const btnDump = hud.querySelector('#c4-dump');
  const txtCnt = hud.querySelector('#c4-cnt');

  hud.querySelector('#c4-x').onclick = () => hud.remove();

  setInterval(() => {
    if (txtCnt) txtCnt.textContent = window._c4_trace.length;
  }, 400);

  hud.querySelectorAll('.c4-pill').forEach(pill => {
    pill.onclick = () => {
      hud.querySelectorAll('.c4-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      inSec.value = pill.dataset.s;
      setTimeDisplay(+pill.dataset.s);
    };
  });

  inSec.oninput = () => {
    hud.querySelectorAll('.c4-pill').forEach(p => p.classList.remove('active'));
    setTimeDisplay(parseInt(inSec.value, 10) || 0);
  };

  function setTimeDisplay(s) {
    const min = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    clock.textContent = `${min}:${sec}`;
  }

  btnDump.onclick = () => {
    const data = JSON.stringify(window._c4_trace, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(data).then(() => {
        txtMsg.textContent = '> trace copied to clipboard.';
      }).catch(() => {
        console.log('C4 TRACE DUMP:', data);
        txtMsg.textContent = '> trace logged to console.';
      });
    } else {
      console.log('C4 TRACE DUMP:', data);
      txtMsg.textContent = '> trace logged to console.';
    }
  };

  function audioPulse() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime);
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
    const totalDuration = parseInt(inSec.value, 10) || 0;
    btnRun.disabled = true;
    bar.style.width = '12%';
    txtMsg.textContent = '> probing link session...';

    try {
      const handled = await runTrpcBypass(totalDuration);
      if (!handled) {
        txtMsg.textContent = '> pulsing dom triggers...';
        runDomFallback();
      }
    } catch (err) {
      txtMsg.textContent = '> err: ' + (err.message || 'failed');
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

    txtMsg.textContent = `> trpc session: ${totalStages} stage(s)`;
    bar.style.width = '25%';

    let remaining = delaySec;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      remaining = Math.max(0, delaySec - elapsed);
      setTimeDisplay(remaining);
      const pct = Math.min(100, Math.floor((elapsed / Math.max(1, delaySec)) * 100));
      bar.style.width = `${Math.max(25, pct)}%`;
    }, 200);

    let destinationLink = null;
    const stageInterval = delaySec > 0 ? (delaySec * 1000) / totalStages : 0;

    for (let stage = 1; stage <= totalStages; stage++) {
      txtMsg.textContent = `> advancing stage [${stage}/${totalStages}]...`;
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
    setTimeDisplay(0);
    bar.style.width = '100%';
    audioPulse();

    if (destinationLink) {
      txtMsg.textContent = '> resolved. redirecting...';
      setTimeout(() => { window.location.href = destinationLink; }, 400);
    } else {
      txtMsg.textContent = '> session complete. reloading...';
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
    txtMsg.textContent = triggered ? '> dom pulsed.' : '> no targets.';
    audioPulse();
  }
})();
