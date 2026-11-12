// C4 / ARGON — Android & Desktop Autonomous Shortener Bypass HUD
(function () {
  'use strict';

  try {
    const HUD_ID = 'c4-bypass-hud';
    const FAB_ID = 'c4-bypass-fab';
    const STYLE_ID = 'c4-bypass-styles';

    // Clean re-entry
    const oldHud = document.getElementById(HUD_ID);
    if (oldHud) oldHud.remove();
    const oldFab = document.getElementById(FAB_ID);
    if (oldFab) oldFab.remove();
    const oldStyle = document.getElementById(STYLE_ID);
    if (oldStyle) oldStyle.remove();

    // Protocol Sniffer (Non-blocking, never throws)
    if (!window._c4_trace) {
      window._c4_trace = [];
      const origFetch = window.fetch;
      window.fetch = async function (...args) {
        const urlStr = typeof args[0] === 'string' ? args[0] : (args[0]?.url || String(args[0]));
        const methodStr = args[1]?.method || 'GET';
        let res;
        try {
          res = await origFetch.apply(this, args);
        } catch (fetchErr) {
          window._c4_trace.push({
            url: urlStr,
            method: methodStr,
            error: fetchErr.message,
            timestamp: Date.now()
          });
          throw fetchErr;
        }

        try {
          const entry = {
            url: urlStr,
            method: methodStr,
            status: res.status,
            timestamp: Date.now()
          };
          if (typeof res.clone === 'function') {
            try {
              const c = res.clone();
              c.text().then(t => { entry.response = t; }).catch(() => {});
            } catch (_) {}
          }
          window._c4_trace.push(entry);
        } catch (_) {}

        return res;
      };
    }

    // Stylesheet
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${HUD_ID}, #${FAB_ID} {
        all: initial !important;
        box-sizing: border-box !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        -webkit-font-smoothing: antialiased !important;
        z-index: 2147483647 !important;
        user-select: none !important;
        -webkit-user-select: none !important;
      }
      #${HUD_ID} *, #${FAB_ID} * {
        box-sizing: border-box !important;
        font-family: inherit !important;
      }

      #${FAB_ID} {
        position: fixed !important;
        top: 14px !important;
        right: 14px !important;
        height: 36px !important;
        padding: 0 12px !important;
        border-radius: 18px !important;
        background: #09090b !important;
        border: 1px solid rgba(244, 63, 94, 0.6) !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.9), 0 0 10px rgba(244,63,94,0.3) !important;
        display: none !important;
        align-items: center !important;
        gap: 7px !important;
        cursor: pointer !important;
        touch-action: none !important;
      }
      .c4-dot-live {
        width: 7px !important;
        height: 7px !important;
        border-radius: 50% !important;
        background: #10b981 !important;
        box-shadow: 0 0 8px #10b981 !important;
      }
      .c4-fab-txt {
        font-size: 11px !important;
        font-weight: 800 !important;
        letter-spacing: 1.2px !important;
        color: #ffffff !important;
      }

      #${HUD_ID} {
        position: fixed !important;
        top: 14px !important;
        right: 14px !important;
        width: min(320px, calc(100vw - 28px)) !important;
        background: #09090b !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        border-radius: 14px !important;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
        color: #f4f4f5 !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
      }

      .c4-top-bar {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 9px 12px !important;
        background: #121216 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        cursor: move !important;
        touch-action: none !important;
      }
      .c4-title-group {
        display: flex !important;
        align-items: center !important;
        gap: 7px !important;
      }
      .c4-title-txt {
        font-size: 11px !important;
        font-weight: 800 !important;
        letter-spacing: 1.2px !important;
        color: #ffffff !important;
      }
      .c4-close-btn {
        background: transparent !important;
        border: none !important;
        color: #71717a !important;
        font-size: 20px !important;
        line-height: 1 !important;
        cursor: pointer !important;
        padding: 0 4px !important;
      }
      .c4-close-btn:hover { color: #f43f5e !important; }

      .c4-banner-box {
        position: relative !important;
        width: 100% !important;
        height: 105px !important;
        background: #18181b !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-end !important;
        padding: 10px 12px !important;
      }
      .c4-banner-box svg {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }
      .c4-badge {
        position: relative !important;
        z-index: 2 !important;
        align-self: flex-start !important;
        background: rgba(0,0,0,0.7) !important;
        border: 1px solid rgba(244, 63, 94, 0.5) !important;
        border-radius: 4px !important;
        padding: 2px 6px !important;
        font-size: 9px !important;
        font-weight: 700 !important;
        color: #fda4af !important;
        letter-spacing: 1px !important;
        margin-bottom: 3px !important;
      }
      .c4-heading {
        position: relative !important;
        z-index: 2 !important;
        font-size: 13px !important;
        font-weight: 800 !important;
        color: #ffffff !important;
        letter-spacing: 0.5px !important;
        text-shadow: 0 2px 6px rgba(0,0,0,0.9) !important;
      }

      .c4-deck {
        padding: 12px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 9px !important;
      }
      .c4-clock-row {
        display: flex !important;
        align-items: baseline !important;
        justify-content: space-between !important;
        padding: 7px 11px !important;
        background: #121216 !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 8px !important;
      }
      .c4-clock-tag {
        font-size: 9px !important;
        font-weight: 700 !important;
        color: #71717a !important;
        letter-spacing: 1px !important;
      }
      .c4-timer-digits {
        font-family: monospace !important;
        font-size: 22px !important;
        font-weight: 800 !important;
        color: #ffffff !important;
        font-variant-numeric: tabular-nums !important;
      }

      .c4-pill-grid {
        display: grid !important;
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 5px !important;
      }
      .c4-pill-btn {
        background: #18181b !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
        border-radius: 6px !important;
        color: #a1a1aa !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        padding: 6px 0 !important;
        text-align: center !important;
        cursor: pointer !important;
      }
      .c4-pill-btn.active {
        background: #fafafa !important;
        color: #09090b !important;
        border-color: #fff !important;
      }

      .c4-interval-row {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        font-size: 11px !important;
        color: #71717a !important;
        font-weight: 600 !important;
      }
      .c4-interval-input {
        width: 54px !important;
        background: #18181b !important;
        border: 1px solid rgba(255,255,255,0.12) !important;
        border-radius: 6px !important;
        color: #fafafa !important;
        font-family: monospace !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        text-align: center !important;
        padding: 3px !important;
        outline: none !important;
      }

      .c4-exec-btn {
        width: 100% !important;
        background: #f43f5e !important;
        color: #ffffff !important;
        font-weight: 800 !important;
        font-size: 12px !important;
        letter-spacing: 1px !important;
        padding: 10px 0 !important;
        border: none !important;
        border-radius: 8px !important;
        cursor: pointer !important;
        box-shadow: 0 4px 14px rgba(244, 63, 94, 0.35) !important;
      }
      .c4-exec-btn:active { opacity: 0.85 !important; }
      .c4-exec-btn:disabled {
        background: #3f3f46 !important;
        color: #71717a !important;
        cursor: not-allowed !important;
        box-shadow: none !important;
      }

      .c4-log-btn {
        width: 100% !important;
        background: transparent !important;
        color: #a1a1aa !important;
        font-size: 10px !important;
        font-weight: 700 !important;
        padding: 6px 0 !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
        border-radius: 6px !important;
        cursor: pointer !important;
      }

      .c4-track {
        width: 100% !important;
        height: 3px !important;
        background: rgba(255,255,255,0.08) !important;
        border-radius: 2px !important;
        overflow: hidden !important;
      }
      .c4-bar-fill {
        width: 0% !important;
        height: 100% !important;
        background: #f43f5e !important;
        transition: width 0.2s linear !important;
      }

      .c4-status-line {
        font-family: monospace !important;
        font-size: 10px !important;
        color: #71717a !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        min-height: 14px !important;
      }
    `;

    const targetParent = document.body || document.documentElement;
    targetParent.appendChild(style);

    // Create Mini Pill FAB
    const fab = document.createElement('div');
    fab.id = FAB_ID;
    fab.innerHTML = '<div class="c4-dot-live"></div><span class="c4-fab-txt">ARGON</span>';
    targetParent.appendChild(fab);

    // Create HUD
    const hud = document.createElement('div');
    hud.id = HUD_ID;
    hud.innerHTML = `
      <div class="c4-top-bar" id="c4-drag-header">
        <div class="c4-title-group">
          <div class="c4-dot-live"></div>
          <span class="c4-title-txt">ARGON CONTROLLER</span>
        </div>
        <button type="button" class="c4-close-btn" id="c4-btn-close">×</button>
      </div>

      <div class="c4-banner-box">
        <svg viewBox="0 0 320 105" preserveAspectRatio="none">
          <defs>
            <linearGradient id="c4-bg-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#18181b"/>
              <stop offset="60%" stop-color="#09090b"/>
              <stop offset="100%" stop-color="#020203"/>
            </linearGradient>
            <linearGradient id="c4-rose-glow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.85"/>
              <stop offset="50%" stop-color="#fb7185" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <rect width="320" height="105" fill="url(#c4-bg-grad)"/>
          <path d="M-20,105 L140,-10 L160,-10 L0,105 Z" fill="url(#c4-rose-glow)"/>
          <path d="M80,105 L240,-10 L260,-10 L100,105 Z" fill="url(#c4-rose-glow)" opacity="0.4"/>
          <circle cx="270" cy="52" r="40" fill="none" stroke="#f43f5e" stroke-width="1" opacity="0.3"/>
          <circle cx="270" cy="52" r="30" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.2"/>
          <line x1="210" y1="46" x2="330" y2="46" stroke="#f43f5e" stroke-width="2" opacity="0.75"/>
          <line x1="230" y1="50" x2="310" y2="50" stroke="#ffffff" stroke-width="1" opacity="0.8"/>
        </svg>
        <div class="c4-badge">STAGE CONTROLLER</div>
        <div class="c4-heading">AUTONOMOUS BYPASS</div>
      </div>

      <div class="c4-deck">
        <div class="c4-clock-row">
          <span class="c4-clock-tag">INTERVAL</span>
          <span class="c4-timer-digits" id="c4-digits">00:00</span>
        </div>

        <div class="c4-pill-grid">
          <button type="button" class="c4-pill-btn" data-s="0">0s (Inst)</button>
          <button type="button" class="c4-pill-btn" data-s="30">30s</button>
          <button type="button" class="c4-pill-btn" data-s="60">60s</button>
          <button type="button" class="c4-pill-btn active" data-s="80">80s (Safe)</button>
        </div>

        <div class="c4-interval-row">
          <span>Anti-Detect Pacing</span>
          <div>
            <input class="c4-interval-input" id="c4-custom-sec" type="number" min="0" value="80">
            <span style="margin-left:4px;color:#a1a1aa;font-weight:700;">SEC</span>
          </div>
        </div>

        <button type="button" class="c4-exec-btn" id="c4-btn-exec">EXECUTE BYPASS</button>
        <button type="button" class="c4-log-btn" id="c4-btn-log">COPY PROTOCOL LOG (<span id="c4-trace-cnt">0</span>)</button>

        <div class="c4-track">
          <div class="c4-bar-fill" id="c4-progress-fill"></div>
        </div>

        <div class="c4-status-line" id="c4-status-msg">&gt; ready. sniffer active.</div>
      </div>
    `;
    targetParent.appendChild(hud);

    // Isolate UI Events from page clickjackers & ad popunders
    function isolate(el) {
      ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend'].forEach(evt => {
        el.addEventListener(evt, e => {
          e.stopPropagation();
        }, { passive: false });
      });
    }
    isolate(hud);
    isolate(fab);

    // Toggle HUD & FAB
    fab.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      hud.style.display = 'flex';
      fab.style.display = 'none';
    });

    hud.querySelector('#c4-btn-close').addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      hud.style.display = 'none';
      fab.style.display = 'flex';
    });

    // Touch & Mouse Dragging
    const dragBar = hud.querySelector('#c4-drag-header');
    let isDragging = false, startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    function handleStart(e) {
      isDragging = true;
      const pt = e.touches ? e.touches[0] : e;
      startX = pt.clientX;
      startY = pt.clientY;
      const rect = hud.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      if (e.cancelable) e.preventDefault();
    }

    function handleMove(e) {
      if (!isDragging) return;
      const pt = e.touches ? e.touches[0] : e;
      const newX = initialLeft + (pt.clientX - startX);
      const newY = initialTop + (pt.clientY - startY);
      hud.style.left = Math.max(4, Math.min(window.innerWidth - hud.offsetWidth - 4, newX)) + 'px';
      hud.style.top = Math.max(4, Math.min(window.innerHeight - hud.offsetHeight - 4, newY)) + 'px';
      hud.style.right = 'auto';
    }

    function handleEnd() { isDragging = false; }

    dragBar.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    dragBar.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleEnd);

    // UI Bindings
    const inSec = hud.querySelector('#c4-custom-sec');
    const clock = hud.querySelector('#c4-digits');
    const bar = hud.querySelector('#c4-progress-fill');
    const txtMsg = hud.querySelector('#c4-status-msg');
    const btnRun = hud.querySelector('#c4-btn-exec');
    const btnDump = hud.querySelector('#c4-btn-log');
    const txtCnt = hud.querySelector('#c4-trace-cnt');

    setInterval(() => {
      if (txtCnt && window._c4_trace) txtCnt.textContent = window._c4_trace.length;
    }, 400);

    hud.querySelectorAll('.c4-pill-btn').forEach(pill => {
      pill.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        hud.querySelectorAll('.c4-pill-btn').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        inSec.value = pill.dataset.s;
        setTimeDisplay(+pill.dataset.s);
      });
    });

    inSec.oninput = () => {
      hud.querySelectorAll('.c4-pill-btn').forEach(p => p.classList.remove('active'));
      setTimeDisplay(parseInt(inSec.value, 10) || 0);
    };

    function setTimeDisplay(s) {
      const min = String(Math.floor(s / 60)).padStart(2, '0');
      const sec = String(s % 60).padStart(2, '0');
      clock.textContent = `${min}:${sec}`;
    }
    setTimeDisplay(parseInt(inSec.value, 10) || 80);

    btnDump.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
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
    });

    function playTone() {
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

    btnRun.addEventListener('click', async e => {
      e.preventDefault();
      e.stopPropagation();
      const totalDuration = parseInt(inSec.value, 10) || 0;
      btnRun.disabled = true;
      bar.style.width = '10%';
      txtMsg.textContent = '> resolving link session...';

      try {
        await runTrpcBypass(totalDuration);
      } catch (err) {
        txtMsg.textContent = '> err: ' + (err.message || 'failed');
        btnRun.disabled = false;
      }
    });

    async function runTrpcBypass(delaySec) {
      // 1. Resolve Token and Stage metadata from /api/session-info or URL
      const searchParams = new URLSearchParams(window.location.search);
      let token = searchParams.get('t') || searchParams.get('token');
      let currentStageIndex = parseInt(searchParams.get('i'), 10) || 1;
      let totalStages = 6;
      let stageId = 0;
      let userId = 0;
      let linkId = 0;

      try {
        const sessionRes = await fetch(`${window.location.origin}/api/session-info`, {
          method: 'GET',
          credentials: 'include'
        });
        if (sessionRes && sessionRes.ok) {
          const sData = await sessionRes.json();
          if (sData.sessionToken || sData.token) token = sData.sessionToken || sData.token;
          if (sData.totalStage) totalStages = Number(sData.totalStage);
          if (sData.stageNumber) currentStageIndex = Number(sData.stageNumber);
          if (sData.stageId) stageId = sData.stageId;
          if (sData.userId) userId = sData.userId;
          if (sData.linkId) linkId = sData.linkId;
        }
      } catch (_) {}

      if (!token) {
        txtMsg.textContent = '> session token not found. are you on shortener page?';
        btnRun.disabled = false;
        return false;
      }

      txtMsg.textContent = `> token acquired. [${currentStageIndex}/${totalStages}]`;
      bar.style.width = '15%';

      let destinationLink = null;
      const numStagesToRun = Math.max(1, (totalStages - currentStageIndex + 1));
      const perStageDelay = delaySec > 0 ? delaySec / numStagesToRun : 0;

      // In-place multi-stage loop: stageId remains the persistent Prisma DB record ID
      for (let stage = currentStageIndex; stage <= totalStages; stage++) {
        txtMsg.textContent = `> advancing stage [${stage}/${totalStages}]...`;

        // Optional per-stage interval countdown
        if (perStageDelay > 0) {
          let remaining = Math.ceil(perStageDelay);
          const startTime = Date.now();
          await new Promise(resolve => {
            const timer = setInterval(() => {
              const elapsed = Math.floor((Date.now() - startTime) / 1000);
              remaining = Math.max(0, Math.ceil(perStageDelay - elapsed));
              setTimeDisplay(remaining);
              if (Date.now() - startTime >= perStageDelay * 1000) {
                clearInterval(timer);
                resolve();
              }
            }, 100);
          });
        } else if (stage > currentStageIndex) {
          // 200ms anti-flood pacing
          await new Promise(r => setTimeout(r, 200));
        }

        // Emit telemetry click event to satisfy server-side validation audit
        try {
          const compName = (stage === totalStages) ? 'finish-button' : 'redirect-button';
          const analyticsPayload = {
            '0': {
              json: {
                type: 'click',
                pathname: '',
                payload: {
                  componente: compName,
                  userId: userId,
                  stage: stage,
                  linkId: linkId
                },
                stage: stage,
                userId: userId
              }
            }
          };
          fetch(`${window.location.origin}/api/trpc/analytics.trackEvent?batch=1`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'trpc-accept': 'application/jsonl',
              'x-trpc-source': 'nextjs-react'
            },
            body: JSON.stringify(analyticsPayload)
          }).catch(() => {});
        } catch (_) {}

        const payload = {
          '0': {
            json: {
              token: token,
              progress: stage + 1,
              stageId: stageId
            }
          }
        };
        const jsonStr = JSON.stringify(payload);
        const endpoint = `${window.location.origin}/api/trpc/linkSession.nextStage?batch=1&input=${encodeURIComponent(jsonStr)}`;

        let res;
        try {
          res = await fetch(endpoint, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'trpc-accept': 'application/jsonl',
              'x-trpc-source': 'nextjs-react'
            }
          });

          if (res.status === 405) {
            res = await fetch(endpoint, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'trpc-accept': 'application/jsonl',
                'x-trpc-source': 'nextjs-react'
              },
              body: jsonStr
            });
          }
        } catch (networkErr) {
          throw new Error('stage fetch err: ' + networkErr.message);
        }

        if (!res.ok) {
          throw new Error(`stage ${stage} http ${res.status}`);
        }

        const rawText = await res.text();

        // Robust scan for destinationLink and url (handles single-line and multi-line JSONL)
        const mDest = rawText.match(/"destinationLink"\s*:\s*"([^"]+)"/);
        if (mDest && mDest[1] && mDest[1] !== 'null' && mDest[1] !== 'undefined') {
          destinationLink = mDest[1].replace(/\\/g, '');
        }

        if (!destinationLink) {
          const lines = rawText.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const p = JSON.parse(trimmed);
              const dataObj = p[0]?.result?.data?.json || p.result?.data?.json || p[0]?.result?.data || p.json || p;
              if (dataObj && typeof dataObj.destinationLink === 'string' && dataObj.destinationLink.startsWith('http')) {
                destinationLink = dataObj.destinationLink;
                break;
              }
            } catch (_) {}
          }
        }

        if (destinationLink) {
          break;
        }

        const progressPct = Math.min(95, Math.floor(15 + ((stage - currentStageIndex + 1) / numStagesToRun) * 80));
        bar.style.width = `${progressPct}%`;
      }

      // Check final destination
      if (destinationLink) {
        bar.style.width = '100%';
        setTimeDisplay(0);
        playTone();
        txtMsg.textContent = '> final key reached! redirecting...';
        setTimeout(() => {
          window.location.href = destinationLink;
        }, 500);
        return true;
      }

      // If loop finished but destinationLink was not directly returned, check session-info once
      try {
        const finalCheck = await fetch(`${window.location.origin}/api/session-info`, {
          method: 'GET',
          credentials: 'include'
        });
        if (finalCheck && finalCheck.ok) {
          const fData = await finalCheck.json();
          if (fData.destinationLink) {
            bar.style.width = '100%';
            setTimeDisplay(0);
            playTone();
            txtMsg.textContent = '> final key reached! redirecting...';
            setTimeout(() => {
              window.location.href = fData.destinationLink;
            }, 500);
            return true;
          }
        }
      } catch (_) {}

      // Finished without destinationLink — keep HUD open, never reload
      bar.style.width = '100%';
      setTimeDisplay(0);
      playTone();
      txtMsg.textContent = '> all stages sent. key pending on server.';
      btnRun.disabled = false;
      return true;
    }

    console.log('[c4] ARGON controller mounted successfully.');
  } catch (err) {
    alert('C4 Init Error: ' + (err.stack || err.message));
  }
})();