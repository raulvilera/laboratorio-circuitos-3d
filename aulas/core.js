/* =====================================================================
   Aulas do 8º ano · 4º bimestre: Energia e eletricidade
   Núcleo do módulo: tela de aulas, navegação e ferramentas comuns
   (canvas com coordenadas virtuais, controles deslizantes, questões).
   Script comum (não-módulo): funciona também abrindo o index.html
   direto do computador.
   ===================================================================== */
(function () {
  'use strict';
  const AU = window.AU = { labs: {}, aulas: [], blocos: [], cur: null };

  /* ---------- utilidades ---------- */
  const h = AU.h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  AU.n = (x, d = 2, min = 0) => Number(x).toLocaleString('pt-BR', { minimumFractionDigits: min, maximumFractionDigits: d });
  AU.money = x => 'R$ ' + Number(x).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  AU.clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  AU.shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  AU.store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } },
  };
  AU.toast = (m, k) => (window.LAB && window.LAB.toast ? window.LAB.toast(m, k) : console.log(m));
  AU.onCleanup = fn => AU.cur && AU.cur.cleanup.push(fn);
  AU.loop = fn => AU.cur && AU.cur.loops.push(fn);

  /* Cores (as mesmas do laboratório 3D) */
  AU.C = {
    bg: '#0b111b', panel: '#121a28', line: 'rgba(255,255,255,.12)', text: '#e6ecf5', muted: '#8a97ab',
    accent: '#38bdf8', ok: '#4ade80', warn: '#f59e0b', bad: '#ef4444', pos: '#f87171', neg: '#60a5fa',
    copper: '#d38c4f', yellow: '#fde68a', purple: '#a78bfa',
  };

  /* ---------- canvas com coordenadas virtuais (vw × vh) ---------- */
  AU.canvas = (parent, vw = 800, vh = 450) => {
    const wrap = h('div', 'au-cv'); const cv = document.createElement('canvas'); wrap.appendChild(cv); parent.appendChild(wrap);
    const o = { cv, ctx: cv.getContext('2d'), vw, vh, s: 1, dirty: true };
    const fit = () => {
      const W = wrap.clientWidth; if (!W) return;
      const s = W / vw, d = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * d); cv.height = Math.round(vh * s * d); cv.style.height = (vh * s) + 'px';
      o.s = s; o.ctx.setTransform(s * d, 0, 0, s * d, 0, 0); o.dirty = true;
      if (o.onresize) o.onresize();
    };
    const ro = new ResizeObserver(fit); ro.observe(wrap); AU.onCleanup(() => ro.disconnect()); fit();
    o.pt = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * vw, y: (e.clientY - r.top) / r.height * vh }; };
    o.clear = (bg = AU.C.bg) => { o.ctx.fillStyle = bg; o.ctx.fillRect(0, 0, vw, vh); };
    return o;
  };
  /* Arrastar/clicar dentro de um canvas */
  AU.drag = (c, { down, move, up, hover, click }) => {
    let active = false, start = null;
    c.cv.addEventListener('pointerdown', e => {
      const p = c.pt(e); start = p;
      if (down && down(p, e) === true) { active = true; c.cv.setPointerCapture(e.pointerId); e.preventDefault(); }
    });
    c.cv.addEventListener('pointermove', e => { const p = c.pt(e); if (active) { if (move) move(p, e); } else if (hover) hover(p, e); });
    const end = e => {
      const p = c.pt(e);
      if (click && start && Math.hypot(p.x - start.x, p.y - start.y) < 6) click(p, e);
      start = null; if (!active) return; active = false; if (up) up(p, e);
    };
    c.cv.addEventListener('pointerup', end);
    c.cv.addEventListener('pointercancel', () => { active = false; start = null; });
  };

  /* ---------- desenho ---------- */
  const D = AU.D = {
    rr(ctx, X, Y, W, H, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(X, Y, W, H, r); else ctx.rect(X, Y, W, H); },
    text(ctx, s, x, y, { size = 14, color = AU.C.text, align = 'center', weight = 600, base = 'middle', font = 'system-ui,Segoe UI,sans-serif' } = {}) {
      ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = base; ctx.fillText(s, x, y);
    },
    arrow(ctx, x1, y1, x2, y2, color = AU.C.accent, w = 3, head = 10) {
      const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1); if (L < 1) return;
      const hh = Math.min(head, L * 0.6);
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * hh * 0.8, y2 - Math.sin(a) * hh * 0.8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - Math.cos(a - 0.45) * hh, y2 - Math.sin(a - 0.45) * hh);
      ctx.lineTo(x2 - Math.cos(a + 0.45) * hh, y2 - Math.sin(a + 0.45) * hh); ctx.closePath(); ctx.fill();
    },
    circle(ctx, x, y, r, fill, stroke, lw = 2) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } },
    charge(ctx, x, y, sign, r = 8) {
      D.circle(ctx, x, y, r, sign > 0 ? '#ef4444' : '#2563eb', sign > 0 ? '#fecaca' : '#bfdbfe', 1.2);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - r * .5, y); ctx.lineTo(x + r * .5, y);
      if (sign > 0) { ctx.moveTo(x, y - r * .5); ctx.lineTo(x, y + r * .5); } ctx.stroke();
    },
    glow(ctx, x, y, r, color, a = 1) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    },
    bulb(ctx, x, y, b, r = 26) { // lâmpada vista de lado; b = brilho 0..1
      if (b > 0.02) D.glow(ctx, x, y - 4, r * (2 + b * 2.2), `rgba(255,214,120,${0.55 * Math.min(1, b)})`);
      D.circle(ctx, x, y - 4, r, b > 0.02 ? `rgba(255,${200 + 40 * Math.min(1, b)},${110 + 80 * Math.min(1, b)},${0.35 + 0.6 * Math.min(1, b)})` : 'rgba(220,230,240,.12)', '#cbd5e1', 2);
      ctx.strokeStyle = b > 0.02 ? '#fff7d6' : '#8a7a66'; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(x - 8, y + 14); ctx.lineTo(x - 6, y - 4); ctx.quadraticCurveTo(x, y - 14, x + 6, y - 4); ctx.lineTo(x + 8, y + 14); ctx.stroke();
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(x - 12, y + r - 8, 24, 14);
      ctx.fillStyle = '#64748b'; ctx.fillRect(x - 10, y + r + 6, 20, 5);
    },
    battery(ctx, x, y, w = 70, hgt = 34, label = '', vertical = false) {
      ctx.save(); ctx.translate(x, y); if (vertical) ctx.rotate(-Math.PI / 2);
      D.rr(ctx, -w / 2, -hgt / 2, w, hgt, 6); ctx.fillStyle = '#1c2230'; ctx.fill();
      D.rr(ctx, 0, -hgt / 2, w / 2, hgt, 6); ctx.fillStyle = '#f59e0b'; ctx.fill();
      ctx.fillStyle = '#cbd5e1'; ctx.fillRect(w / 2, -6, 6, 12);
      D.text(ctx, '+', w / 4, 0, { size: 18, color: '#1a1205', weight: 800 });
      D.text(ctx, '−', -w / 4, 0, { size: 18, color: '#e6ecf5', weight: 800 });
      ctx.restore();
      if (label) D.text(ctx, label, x, y + (vertical ? w / 2 + 16 : hgt / 2 + 14), { size: 13, color: AU.C.yellow });
    },
  };

  /* ---------- controles ---------- */
  AU.slider = (parent, { label, min, max, step = 1, value, fmt = v => v, on }) => {
    const w = h('div', 'au-sl');
    w.innerHTML = `<label><span>${label}</span><b></b></label><input type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
    const inp = w.querySelector('input'), b = w.querySelector('b');
    const upd = () => { b.innerHTML = fmt(+inp.value); };
    inp.addEventListener('input', () => { upd(); if (on) on(+inp.value); });
    upd(); parent.appendChild(w);
    return { el: w, input: inp, get value() { return +inp.value; }, set(v) { inp.value = v; upd(); } };
  };
  /* Grupo de botões (apenas um ligado) */
  AU.seg = (parent, opts, value, on, cls = '') => {
    const w = h('div', 'au-seg ' + cls); parent.appendChild(w);
    const render = () => { w.innerHTML = opts.map(([v, l]) => `<button data-v="${v}" class="${String(v) === String(value) ? 'on' : ''}">${l}</button>`).join(''); };
    w.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; value = opts.find(o => String(o[0]) === b.dataset.v)[0]; render(); if (on) on(value); });
    render();
    return { el: w, set(v) { value = v; render(); }, get value() { return value; } };
  };
  AU.btn = (parent, label, on, cls = '') => { const b = h('button', 'au-b ' + cls, label); b.addEventListener('click', on); parent.appendChild(b); return b; };
  AU.row = (parent, cls = '') => { const r = h('div', 'au-row ' + cls); parent.appendChild(r); return r; };
  AU.note = (parent, html, cls = '') => { const n = h('div', 'au-note ' + cls, html); parent.appendChild(n); return n; };
  /* Leituras (mostradores) */
  AU.readouts = (parent, items) => {
    const w = h('div', 'au-read'); parent.appendChild(w);
    const els = {};
    items.forEach(([k, label]) => { const d = h('div', '', `<span>${label}</span><b>—</b>`); w.appendChild(d); els[k] = d.querySelector('b'); });
    return { el: w, set(k, v, cls) { els[k].innerHTML = v; els[k].className = cls || ''; } };
  };

  /* ---------- questões (verifique) ---------- */
  AU.quiz = (parent, qs, key) => {
    const done = new Set();
    const score = h('div', 'au-score'); parent.appendChild(score);
    const upd = () => { score.innerHTML = `Acertos: <b>${done.size}</b> de ${qs.length}`; };
    qs.forEach((q, qi) => {
      const box = h('div', 'au-q'); parent.appendChild(box);
      box.innerHTML = `<div class="au-qt"><b>${qi + 1}.</b> ${q.q}</div>`;
      const ord = AU.shuffle(q.opts.map((_, i) => i));
      const opts = h('div', 'au-qo'); box.appendChild(opts);
      const fb = h('div', 'au-fb'); box.appendChild(fb);
      ord.forEach(i => {
        const b = h('button', '', q.opts[i]); opts.appendChild(b);
        b.addEventListener('click', () => {
          if (done.has(qi)) return;
          if (i === 0) {
            b.classList.add('right'); done.add(qi); fb.className = 'au-fb ok'; fb.innerHTML = '✓ Correto! ' + (q.why || ''); upd();
            if (done.size === qs.length && key) { const d = AU.store.get('au_quiz') || {}; d[key] = true; AU.store.set('au_quiz', d); renderSide(); }
          } else { b.classList.add('wrong'); fb.className = 'au-fb bad'; fb.innerHTML = '✗ Ainda não. ' + (q.hint || 'Releia as ideias-chave ou teste no laboratório e tente de novo.'); }
        });
      });
    });
    upd();
  };

  /* Jogo de classificar: itens → caixas. items: [{id, label, ok:'chave da caixa', why}] */
  AU.sorter = (parent, { bins, items, onDone, compact = false }) => {
    const w = h('div', 'au-sorter' + (compact ? ' compact' : '')); parent.appendChild(w);
    const pool = h('div', 'au-pool'); w.appendChild(pool);
    const binsEl = h('div', 'au-bins'); w.appendChild(binsEl);
    const fb = h('div', 'au-fb'); w.appendChild(fb);
    let sel = null; const placed = {};
    const bEls = {};
    bins.forEach(([k, label, cls]) => {
      const b = h('div', 'au-bin ' + (cls || ''), `<div class="au-bin-h">${label}</div><div class="au-bin-items"></div>`);
      b.dataset.k = k; binsEl.appendChild(b); bEls[k] = b.querySelector('.au-bin-items');
      b.addEventListener('click', () => drop(k));
      b.addEventListener('dragover', e => { e.preventDefault(); b.classList.add('over'); });
      b.addEventListener('dragleave', () => b.classList.remove('over'));
      b.addEventListener('drop', e => { e.preventDefault(); b.classList.remove('over'); sel = e.dataTransfer.getData('text/plain'); drop(k); });
    });
    const itemEl = {};
    AU.shuffle(items.slice()).forEach(it => {
      const e = h('button', 'au-item', it.label); e.draggable = true; e.dataset.id = it.id; pool.appendChild(e); itemEl[it.id] = e;
      e.addEventListener('click', ev => { ev.stopPropagation(); if (placed[it.id]) return; sel = it.id; Object.values(itemEl).forEach(x => x.classList.toggle('sel', x === e)); fb.className = 'au-fb'; fb.innerHTML = 'Agora clique na caixa certa para <b>' + it.label.replace(/<[^>]+>/g, '') + '</b>.'; });
      e.addEventListener('dragstart', ev => { ev.dataTransfer.setData('text/plain', it.id); });
    });
    function drop(k) {
      if (!sel) return; const it = items.find(x => x.id === sel); if (!it || placed[it.id]) return;
      const ok = Array.isArray(it.ok) ? it.ok.includes(k) : it.ok === k;
      if (ok) {
        placed[it.id] = k; const e = itemEl[it.id]; e.classList.remove('sel'); e.classList.add('done'); e.draggable = false; bEls[k].appendChild(e);
        fb.className = 'au-fb ok'; fb.innerHTML = '✓ ' + (it.why || 'Isso mesmo!');
        if (Object.keys(placed).length === items.length) { fb.innerHTML += '<br><b>🎉 Você classificou todos os itens!</b>'; if (onDone) onDone(); }
      } else { fb.className = 'au-fb bad'; fb.innerHTML = '✗ Não é essa caixa. ' + (it.hint || 'Pense de novo!'); }
      sel = null;
    }
    return {
      reveal() { items.forEach(it => { if (placed[it.id]) return; const k = Array.isArray(it.ok) ? it.ok[0] : it.ok; placed[it.id] = k; const e = itemEl[it.id]; e.classList.add('done'); bEls[k].appendChild(e); }); fb.className = 'au-fb'; fb.innerHTML = 'Respostas mostradas.'; },
    };
  };

  /* ---------- CSS do módulo ---------- */
  const css = `
#aulas{position:fixed;inset:0;z-index:45;display:none;background:radial-gradient(1200px 700px at 15% -10%,#18233a,#0a0e16 60%);color:var(--text);font-size:14px}
#aulas.on{display:grid;grid-template-columns:268px minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)}
#aulas.big{font-size:16.5px}
.au-top{grid-column:1/-1;display:flex;align-items:center;gap:10px;margin:12px 12px 0;padding:8px 12px;flex-wrap:wrap}
.au-top .brand{margin-right:auto;font-size:16px}
.au-top select{display:none;max-width:100%}
.au-side{overflow:auto;padding:12px 8px 24px 12px}
.au-side h4{margin:14px 6px 6px;font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--muted)}
.au-side button{display:flex;gap:8px;align-items:flex-start;width:100%;text-align:left;background:none;border:1px solid transparent;border-radius:10px;padding:7px 8px;color:#c4cfdf;font-size:13px;line-height:1.3}
.au-side button:hover{background:rgba(255,255,255,.04)}
.au-side button.on{background:rgba(56,189,248,.14);border-color:rgba(56,189,248,.45);color:var(--text)}
.au-side button i{font-style:normal;flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#1b2435;font-size:11px;font-weight:700;color:var(--muted)}
.au-side button.ok i{background:#14532d;color:#86efac}
.au-main{overflow:auto;padding:12px 16px 48px}
.au-head{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap;margin:4px 0 12px}
.au-head .ic{font-size:40px;line-height:1}
.au-head .kick{font-size:12px;text-transform:uppercase;letter-spacing:.8px;color:var(--accent);font-weight:700}
.au-head h2{margin:2px 0 4px;font-size:24px}
.au-head p{margin:0;color:#b6c3d6;max-width:860px;line-height:1.45}
.au-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.au-chip{font-size:11.5px;background:#121a28;border:1px solid var(--line);border-radius:999px;padding:2px 9px;color:#b6c3d6}
.au-grid{display:grid;grid-template-columns:minmax(0,1fr) 350px;gap:14px;align-items:start}
.au-lab{background:#0f1622;border:1px solid var(--line);border-radius:14px;padding:12px;min-width:0}
.au-lab h3,.au-aside h3{margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:.8px;color:var(--muted)}
.au-lab h3+.au-sub{margin-top:-4px}
.au-sub{color:#b6c3d6;font-size:13.5px;margin:0 0 10px;line-height:1.45}
.au-sec{margin-top:16px;padding-top:12px;border-top:1px solid var(--line)}
.au-aside{display:flex;flex-direction:column;gap:12px}
.au-box{background:#0f1622;border:1px solid var(--line);border-radius:14px;padding:12px}
.au-key{margin:0;padding-left:18px;color:#c4cfdf;line-height:1.5;font-size:13.5px}
.au-key li{margin-bottom:6px}
.au-key b,.au-sub b,.au-note b{color:#fde68a}
.au-prof{font-size:13px;color:#b6c3d6;line-height:1.5}
.au-prof summary{cursor:pointer;font-weight:700;color:var(--text)}
.au-3d{display:flex;flex-direction:column;gap:6px}
.au-3d button{text-align:left;line-height:1.3;padding:8px 10px}
.au-3d button small{display:block;color:var(--muted);font-size:11.5px}
.au-3d button .ok{color:#4ade80}
.au-foot{display:flex;justify-content:space-between;gap:8px;margin-top:16px}
.au-cv{width:100%;border-radius:10px;overflow:hidden;background:#0b111b;border:1px solid var(--line)}
.au-cv canvas{width:100%;display:block}
.au-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0}
.au-row.sp{justify-content:space-between}
.au-b{padding:6px 11px}
.au-b.primary{background:#0ea5e9;border-color:#0ea5e9;color:#04121c;font-weight:700}
.au-b.warn{border-color:rgba(245,158,11,.6);color:#fde68a}
.au-b.bad{border-color:rgba(239,68,68,.6);color:#fecaca}
.au-b.ok{border-color:rgba(74,222,128,.6);color:#bbf7d0}
.au-seg{display:inline-flex;flex-wrap:wrap;gap:3px;background:#121a28;border:1px solid var(--line);border-radius:10px;padding:3px}
.au-seg button{border:none;background:none;color:var(--muted);padding:5px 10px;font-weight:600}
.au-seg button.on{background:#1f2a3f;color:var(--text);box-shadow:inset 0 0 0 1px rgba(56,189,248,.45)}
.au-sl{margin:6px 0;min-width:200px;flex:1}
.au-sl label{display:flex;justify-content:space-between;gap:8px;color:var(--muted);font-size:12.5px}
.au-sl label b{color:var(--text);font-variant-numeric:tabular-nums}
.au-sl input{width:100%;accent-color:var(--accent)}
.au-ctl{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:4px 16px;margin-top:8px}
.au-read{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;margin:8px 0}
.au-read div{background:#121a28;border:1px solid var(--line);border-radius:10px;padding:7px 8px;text-align:center}
.au-read span{display:block;font-size:11.5px;color:var(--muted)}
.au-read b{font-variant-numeric:tabular-nums;font-size:15px}
.au-read b.ok{color:#4ade80}.au-read b.warn{color:#fbbf24}.au-read b.bad{color:#f87171}
.au-note{font-size:13px;line-height:1.5;color:#c4cfdf;background:rgba(56,189,248,.07);border:1px solid rgba(56,189,248,.25);border-radius:10px;padding:8px 10px;margin:8px 0}
.au-note.warn{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.3)}
.au-note.bad{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.4);color:#fecaca}
.au-note.ok{background:rgba(74,222,128,.08);border-color:rgba(74,222,128,.35)}
.au-score{font-size:12.5px;color:var(--muted);margin-bottom:8px}
.au-q{background:#121a28;border:1px solid var(--line);border-radius:10px;padding:9px 10px;margin-bottom:8px}
.au-qt{font-size:13.5px;line-height:1.45;margin-bottom:6px}
.au-qo{display:flex;flex-direction:column;gap:5px}
.au-qo button{text-align:left;line-height:1.35;padding:6px 9px;font-size:13px}
.au-qo button.right{border-color:#4ade80;background:rgba(74,222,128,.14)}
.au-qo button.wrong{border-color:#ef4444;background:rgba(239,68,68,.12)}
.au-fb{font-size:13px;line-height:1.45;margin-top:6px;color:#b6c3d6}
.au-fb.ok{color:#bbf7d0}.au-fb.bad{color:#fecaca}
.au-pool{display:flex;flex-wrap:wrap;gap:6px;min-height:40px;padding:8px;background:#0b111b;border:1px dashed var(--line);border-radius:10px}
.au-item{padding:6px 10px;font-size:13px;line-height:1.25}
.au-item.sel{border-color:#fbbf24;background:rgba(245,158,11,.18)}
.au-item.done{cursor:default;opacity:.95;border-color:rgba(74,222,128,.5);background:rgba(74,222,128,.08)}
.au-bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-top:8px}
.au-bin{background:#121a28;border:2px solid var(--line);border-radius:12px;padding:8px;min-height:90px;cursor:pointer}
.au-bin.over,.au-bin:hover{border-color:rgba(56,189,248,.6)}
.au-bin-h{font-weight:700;font-size:13.5px;margin-bottom:6px}
.au-bin-items{display:flex;flex-wrap:wrap;gap:5px}
.au-bin.g{border-color:rgba(74,222,128,.4)} .au-bin.r{border-color:rgba(239,68,68,.4)} .au-bin.y{border-color:rgba(245,158,11,.4)} .au-bin.b{border-color:rgba(56,189,248,.4)}
.au-tbl{width:100%;border-collapse:collapse;font-size:13px}
.au-tbl th,.au-tbl td{border-bottom:1px solid var(--line);padding:6px 6px;text-align:left;vertical-align:middle}
.au-tbl th{font-size:11.5px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);font-weight:700}
.au-tbl td.n,.au-tbl th.n{text-align:right;font-variant-numeric:tabular-nums}
.au-tbl input,.au-tbl select{font:inherit;font-size:13px;color:var(--text);background:#0d1420;border:1px solid var(--line);border-radius:7px;padding:3px 6px;width:86px}
.au-tbl tr.room td{background:#152033;font-weight:700;color:#7dd3fc}
.au-tbl tfoot td{font-weight:700;border-top:2px solid var(--line)}
.au-scroll{overflow-x:auto}
.au-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
.au-card{background:#121a28;border:1px solid var(--line);border-radius:12px;padding:10px;text-align:left;line-height:1.35}
.au-card .em{font-size:28px;display:block;margin-bottom:4px}
.au-card.on{border-color:rgba(56,189,248,.6);background:#152033}
.au-card.good{border-color:rgba(74,222,128,.6)} .au-card.badc{border-color:rgba(239,68,68,.6)}
.au-chain{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:8px 0}
.au-chain span{background:#121a28;border:1px solid var(--line);border-radius:999px;padding:4px 10px;font-size:13px}
.au-chain i{font-style:normal;color:var(--accent);font-weight:700}
.au-bill{background:#f8fafc;color:#0f172a;border-radius:12px;padding:14px 16px;font-size:13.5px;max-width:460px;box-shadow:0 10px 30px rgba(0,0,0,.35)}
.au-bill h4{margin:0 0 2px;font-size:16px;color:#0f172a}
.au-bill .l{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed #cbd5e1}
.au-bill .tot{font-size:18px;font-weight:800;border-bottom:none;padding-top:8px}
.au-bill .flag{display:inline-block;padding:2px 10px;border-radius:999px;font-weight:700;font-size:12px}
.au-inp{font:inherit;color:var(--text);background:#0d1420;border:1px solid var(--line);border-radius:7px;padding:4px 7px;width:110px}
.au-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media (max-width:1150px){.au-grid{grid-template-columns:minmax(0,1fr)}}
@media (max-width:820px){
  #aulas.on{grid-template-columns:minmax(0,1fr)}
  .au-side{display:none}
  .au-top{margin:8px 8px 0}
  .au-top select{display:block;flex:1 1 100%}
  .au-main{padding:10px 8px 40px}
  .au-head h2{font-size:20px}
  .au-two{grid-template-columns:1fr}
}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- tela principal ---------- */
  const root = h('div'); root.id = 'aulas';
  root.innerHTML = `
    <header class="au-top glass">
      <div class="brand">📚 <span>Energia e eletricidade · 8º ano · 4º bimestre</span></div>
      <select id="auSel" aria-label="Escolher aula"></select>
      <button id="auBig" title="Letras maiores para projetar na sala">🔍 Projetor</button>
      <button id="auFull" title="Tela cheia">⛶ Tela cheia</button>
      <button id="auClose">✕ Laboratório 3D</button>
    </header>
    <nav class="au-side" id="auSide"></nav>
    <main class="au-main" id="auMain"></main>`;
  document.body.appendChild(root);
  const side = root.querySelector('#auSide'), main = root.querySelector('#auMain'), sel = root.querySelector('#auSel');

  function renderSide() {
    const quiz = AU.store.get('au_quiz') || {};
    const curN = AU.cur && AU.cur.aula.n;
    side.innerHTML = AU.blocos.map(b => `<h4>${b.t}</h4>` + AU.aulas.filter(a => a.bloco === b.id).map(a =>
      `<button data-n="${a.n}" class="${a.n === curN ? 'on' : ''} ${quiz['a' + a.n] ? 'ok' : ''}"><i>${quiz['a' + a.n] ? '✓' : a.n}</i><span>${a.t}</span></button>`).join('')).join('');
    sel.innerHTML = AU.aulas.map(a => `<option value="${a.n}"${a.n === curN ? ' selected' : ''}>Aula ${a.n} · ${a.t}</option>`).join('');
  }
  AU.renderSide = renderSide;
  side.addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(+b.dataset.n); });
  sel.addEventListener('change', () => show(+sel.value));
  root.querySelector('#auClose').addEventListener('click', () => AU.close());
  root.querySelector('#auBig').addEventListener('click', () => { root.classList.toggle('big'); AU.store.set('au_big', root.classList.contains('big')); });
  root.querySelector('#auFull').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.().catch(() => {});
  });
  if (AU.store.get('au_big')) root.classList.add('big');

  function unmount() {
    if (!AU.cur) return;
    AU.cur.cleanup.forEach(f => { try { f(); } catch (e) { console.error(e); } });
    AU.cur = null;
  }

  function threeDButtons(a) {
    const L = window.LAB; if (!L || !a.lab3d || !a.lab3d.length) return '';
    const done = L.done(), guides = L.guides();
    return `<div class="au-box"><h3>🧪 No laboratório 3D</h3><div class="au-3d">${a.lab3d.map((x, i) => {
      const g = x.guide && guides.find(q => q.id === x.guide);
      const sub = x.sub || (g ? `${g.steps} passos · roteiro guiado` : '');
      const ok = g && done.includes(g.id) ? ' <span class="ok">✓ concluído</span>' : '';
      return `<button data-i="${i}">${x.label}${ok}${sub ? `<small>${sub}</small>` : ''}</button>`;
    }).join('')}</div></div>`;
  }

  function show(n) {
    const a = AU.aulas.find(x => x.n === n) || AU.aulas[0];
    unmount();
    AU.cur = { aula: a, cleanup: [], loops: [] };
    AU.store.set('au_last', a.n);
    main.scrollTop = 0;
    const i = AU.aulas.indexOf(a), prev = AU.aulas[i - 1], next = AU.aulas[i + 1];
    main.innerHTML = `
      <div class="au-head"><div class="ic">${a.ic}</div><div style="flex:1;min-width:240px">
        <div class="kick">Aula ${a.n} · ${AU.blocos.find(b => b.id === a.bloco).t}</div>
        <h2>${a.t}</h2><p>${a.obj}</p>
        <div class="au-chips">${(a.hab || []).map(c => `<span class="au-chip">${c}</span>`).join('')}${(a.temas || []).map(c => `<span class="au-chip">${c}</span>`).join('')}</div>
      </div></div>
      <div class="au-grid">
        <section class="au-lab" id="auLab"></section>
        <aside class="au-aside">
          ${threeDButtons(a)}
          <div class="au-box"><h3>💡 Ideias-chave</h3><ul class="au-key">${a.resumo.map(r => `<li>${r}</li>`).join('')}</ul></div>
          ${a.prof ? `<div class="au-box"><details class="au-prof"><summary>👩‍🏫 Como usar na aula</summary><div style="margin-top:6px">${a.prof}</div></details></div>` : ''}
          <div class="au-box" id="auQuiz"><h3>✅ Verifique o que aprendeu</h3></div>
        </aside>
      </div>
      <div class="au-foot">${prev ? `<button data-go="${prev.n}">◀ Aula ${prev.n}: ${prev.t}</button>` : '<span></span>'}${next ? `<button class="primary" data-go="${next.n}">Aula ${next.n}: ${next.t} ▶</button>` : ''}</div>`;
    main.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => show(+b.dataset.go)));
    main.querySelectorAll('.au-3d button').forEach(b => b.addEventListener('click', () => {
      const x = a.lab3d[+b.dataset.i], L = window.LAB;
      if (x.guide) L.startGuide(x.guide);
      else if (x.preset) L.loadPreset(x.preset, { ideal: !!x.ideal });
      else if (x.cell) L.openCellView(x.cell);
    }));
    AU.quiz(main.querySelector('#auQuiz'), a.quiz || [], 'a' + a.n);
    const labEl = main.querySelector('#auLab');
    const lab = AU.labs[a.lab];
    if (lab) { try { lab(labEl, a); } catch (err) { console.error(err); labEl.innerHTML = '<p class="au-sub">Não foi possível abrir este laboratório.</p>'; } }
    else labEl.innerHTML = '<p class="au-sub">Laboratório em preparação.</p>';
    renderSide();
  }
  AU.show = show;

  let raf = 0, last = 0;
  function tick(t) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, last ? (t - last) / 1000 : 0); last = t;
    if (!AU.cur) return;
    for (const f of AU.cur.loops) { try { f(dt, t / 1000); } catch (err) { console.error(err); } }
  }
  AU.open = n => {
    root.classList.add('on'); window.AU_OPEN = true;
    if (!raf) { last = 0; raf = requestAnimationFrame(tick); }
    show(n || (AU.cur && AU.cur.aula.n) || AU.store.get('au_last') || 1);
  };
  AU.close = () => {
    unmount(); root.classList.remove('on'); window.AU_OPEN = false;
    cancelAnimationFrame(raf); raf = 0;
  };
  document.addEventListener('keydown', e => { if (window.AU_OPEN && e.key === 'Escape' && !document.fullscreenElement) AU.close(); });
})();
