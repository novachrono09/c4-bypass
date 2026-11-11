(function () {
  'use strict';

  const HOST_ID = 'c4-bypass-host';
  const existing = document.getElementById(HOST_ID);
  if (existing) {
    existing.remove();
  }

  // Sniffer
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

  const host = document.createElement('div');
  host.id = HOST_ID;
  host.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;';

  const shadow = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

  const style = document.createElement('style');
  style.textContent=`*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}.c4-fab{position:fixed;top:14px;right:14px;height:38px;padding:0 14px;border-radius:19px;background:#09090b;border:1px solid rgba(244,63,94,0.45);box-shadow:0 8px 24px rgba(0,0,0,0.85),0 0 12px rgba(244,63,94,0.25);display:flex;align-items:center;gap:8px;cursor:pointer;pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none;transition:transform 0.15s ease,border-color 0.15s ease;}.c4-fab:active{transform:scale(0.96);}.c4-dot{width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;}.c4-fab-txt{font-size:11px;font-weight:800;letter-spacing:1.2px;color:#fff;}.c4-hud{position:fixed;top:60px;right:14px;width:min(320px,calc(100vw - 28px));background:#09090b;border:1px solid rgba(255,255,255,0.14);border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,0.95),0 0 0 1px rgba(255,255,255,0.06);color:#f4f4f5;display:flex;flex-direction:column;overflow:hidden;pointer-events:auto;user-select:none;-webkit-user-select:none;animation:c4-slide 0.2s cubic-bezier(0.16,1,0.3,1);}@keyframes c4-slide{from{opacity:0;transform:translateY(-8px) scale(0.98);}to{opacity:1;transform:translateY(0) scale(1);}}.c4-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#121216;border-bottom:1px solid rgba(255,255,255,0.08);cursor:move;touch-action:none;}.c4-title-wrap{display:flex;align-items:center;gap:8px;}.c4-title{font-size:12px;font-weight:800;letter-spacing:1.2px;color:#ffffff;}.c4-close{background:transparent;border:none;color:#71717a;font-size:20px;line-height:1;cursor:pointer;padding:0 4px;transition:color 0.15s ease;}.c4-close:hover{color:#f43f5e;}.c4-banner{position:relative;width:100%;height:110px;background:#18181b;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:12px 14px;}.c4-banner svg{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;}.c4-tag{position:relative;z-index:2;align-self:flex-start;background:rgba(0,0,0,0.7);border:1px solid rgba(244,63,94,0.4);border-radius:4px;padding:2px 7px;font-size:9px;font-weight:700;color:#fda4af;letter-spacing:1px;margin-bottom:4px;}.c4-subhead{position:relative;z-index:2;font-size:14px;font-weight:800;color:#ffffff;letter-spacing:0.5px;text-shadow:0 2px 8px rgba(0,0,0,0.9);}.c4-body{padding:14px;display:flex;flex-direction:column;gap:10px;}.c4-clock-box{display:flex;align-items:baseline;justify-content:space-between;padding:8px 12px;background:#121216;border:1px solid rgba(255,255,255,0.08);border-radius:8px;}.c4-clock-lbl{font-size:10px;font-weight:700;color:#71717a;letter-spacing:1px;}.c4-digits{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:24px;font-weight:800;color:#ffffff;font-variant-numeric:tabular-nums;}.c4-pills{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}.c4-pill{background:#18181b;border:1px solid rgba(255,255,255,0.08);border-radius:6px;color:#a1a1aa;font-size:11px;font-weight:700;padding:7px 0;text-align:center;cursor:pointer;transition:all 0.15s ease;}.c4-pill.active{background:#fafafa;color:#09090b;border-color:#fff;}.c4-input-row{display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#71717a;font-weight:600;padding:2px 0;}.c4-num-in{width:56px;background:#18181b;border:1px solid rgba(255,255,255,0.12);border-radius:6px;color:#fafafa;font-family:monospace;font-size:12px;font-weight:700;text-align:center;padding:4px;outline:none;}.c4-btn-exec{width:100%;background:#f43f5e;color:#ffffff;font-weight:800;font-size:12px;letter-spacing:1px;padding:11px 0;border:none;border-radius:8px;cursor:pointer;box-shadow:0 4px 16px rgba(244,63,94,0.35);transition:opacity 0.15s ease;}.c4-btn-exec:active{opacity:0.85;}.c4-btn-exec:disabled{background:#3f3f46;color:#71717a;cursor:not-allowed;box-shadow:none;}.c4-btn-copy{width:100%;background:transparent;color:#a1a1aa;font-size:10px;font-weight:700;padding:7px 0;border:1px solid rgba(255,255,255,0.08);border-radius:6px;cursor:pointer;}.c4-rail{width:100%;height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;}.c4-fill{width:0%;height:100%;background:#f43f5e;transition:width 0.2s linear;}.c4-msg{font-family:ui-monospace,SFMono-Regular,monospace;font-size:10px;color:#71717a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-height:14px;}`;
  shadow.appendChild(style);

  // Floating Pill Button (Always visible on mobile)
  const fab = document.createElement('div');
  fab.className = 'c4-fab';
  fab.innerHTML = '<div class="c4-dot"></div><span class="c4-fab-txt">ARGON</span>';
  shadow.appendChild(fab);

  // Full HUD Panel
  const hud = document.createElement('div');
  hud.className = 'c4-hud';
  hud.innerHTML=`<div class="c4-header" id="drag"><div class="c4-title-wrap"><div class="c4-dot"></div><span class="c4-title">ARGON CONTROLLER</span></div><button type="button" class="c4-close" id="x">×</button></div><div class="c4-banner"><svg viewBox="0 0 320 110" preserveAspectRatio="none"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#18181b"/><stop offset="60%" stop-color="#09090b"/><stop offset="100%" stop-color="#020203"/></linearGradient><linearGradient id="neon" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#f43f5e" stop-opacity="0.8"/><stop offset="50%" stop-color="#fb7185" stop-opacity="0.3"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></linearGradient></defs><rect width="320" height="110" fill="url(#bg)"/><path d="M-20,110 L140,-10 L160,-10 L0,110 Z" fill="url(#neon)"/><path d="M80,110 L240,-10 L260,-10 L100,110 Z" fill="url(#neon)" opacity="0.4"/><circle cx="270" cy="55" r="42" fill="none" stroke="#f43f5e" stroke-width="1" opacity="0.25"/><circle cx="270" cy="55" r="32" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.15"/><line x1="210" y1="48" x2="330" y2="48" stroke="#f43f5e" stroke-width="2" opacity="0.7"/><line x1="230" y1="52" x2="310" y2="52" stroke="#ffffff" stroke-width="1" opacity="0.8"/></svg><div class="c4-tag">STAGE CONTROLLER</div><div class="c4-subhead">AUTONOMOUS BYPASS</div></div><div class="c4-body"><div class="c4-clock-box"><span class="c4-clock-lbl">INTERVAL</span><span class="c4-digits" id="clock">00:00</span></div><div class="c4-pills"><button type="button" class="c4-pill active" data-s="0">0s (Inst)</button><button type="button" class="c4-pill" data-s="5">5s</button><button type="button" class="c4-pill" data-s="15">15s</button><button type="button" class="c4-pill" data-s="30">30s</button></div><div class="c4-input-row"><span>Custom Interval</span><div><input class="c4-num-in" id="sec" type="number" min="0" value="0"><span style="margin-left:4px;color:#a1a1aa;font-weight:700;">SEC</span></div></div><button type="button" class="c4-btn-exec" id="run">EXECUTE BYPASS</button><button type="button" class="c4-btn-copy" id="dump">COPY PROTOCOL LOG (<span id="cnt">0</span>)</button><div class="c4-rail"><div class="c4-fill" id="bar"></div></div><div class="c4-msg" id="msg">&gt; ready. sniffer active.</div></div>`;
  shadow.appendChild(hud);

  // Mount to documentElement (guaranteed to succeed even if body is null)
  (document.documentElement || document.body).appendChild(host);

  // State & Controls
  let isHudOpen = true;
  fab.onclick = () => {
    isHudOpen = !isHudOpen;
    hud.style.display = isHudOpen ? 'flex' : 'none';
  };
  hud.querySelector('#x').onclick = () => {
    isHudOpen = false;
    hud.style.display = 'none';
  };

  // Dragging logic for HUD & FAB
  const dragHandle = hud.querySelector('#drag');
  let isMoving = false, startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

  function onPointerStart(e) {
    isMoving = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = clientX;
    startY = clientY;
    const rect = hud.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    if (e.cancelable) e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isMoving) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const newLeft = initialLeft + (clientX - startX);
    const newTop = initialTop + (clientY - startY);
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

  // UI elements
  const inSec = hud.querySelector('#sec');
  const clock = hud.querySelector('#clock');
  const bar = hud.querySelector('#bar');
  const txtMsg = hud.querySelector('#msg');
  const btnRun = hud.querySelector('#run');
  const btnDump = hud.querySelector('#dump');
  const txtCnt = hud.querySelector('#cnt');

  setInterval(() => {
    if (txtCnt && window._c4_trace) txtCnt.textContent = window._c4_trace.length;
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
