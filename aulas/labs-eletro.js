/* Laboratórios das aulas 5 a 9: magnetismo, cargas elétricas, corrente, CA e CC */
(function () {
  'use strict';
  const AU = window.AU, h = AU.h, D = AU.D, C = AU.C, n = AU.n;
  const TAU = Math.PI * 2;

  /* ================= Aula 5 · Ímãs, bússolas e campo magnético ================= */
  AU.labs.ima = el => {
    el.innerHTML = `<h3>🧲 Ímãs e bússolas</h3><p class="au-sub">Arraste os ímãs. Cada pequena <b>bússola</b> aponta a ponta vermelha na direção do campo magnético. Ligue as <b>linhas de campo</b> para ver o caminho do polo N ao polo S.</p>`;
    const c = AU.canvas(el, 800, 460), ctx = c.ctx;
    const S = { mode: 'um', lines: true, mags: [], drag: null, off: null };
    const mk = (x, y, a = 0, L = 62) => ({ x, y, a, L });
    const setMode = m => {
      S.mode = m;
      S.mags = m === 'um' ? [mk(400, 230)] : m === 'dois' ? [mk(250, 230), mk(560, 230, Math.PI)] : [mk(400, 235, Math.PI / 2 + 0.19, 46)];
      info();
    };
    const poles = m => { const dx = Math.cos(m.a) * m.L, dy = Math.sin(m.a) * m.L; return [{ x: m.x + dx, y: m.y + dy, q: 1 }, { x: m.x - dx, y: m.y - dy, q: -1 }]; };
    function B(x, y, only) {
      let bx = 0, by = 0;
      (only ? [only] : S.mags).forEach(m => poles(m).forEach(p => { const dx = x - p.x, dy = y - p.y, r2 = dx * dx + dy * dy + 60, r3 = r2 * Math.sqrt(r2); bx += p.q * dx / r3; by += p.q * dy / r3; }));
      return [bx, by];
    }
    const inside = (x, y, pad = 6) => S.mags.some(m => { const dx = x - m.x, dy = y - m.y, u = dx * Math.cos(m.a) + dy * Math.sin(m.a), v = -dx * Math.sin(m.a) + dy * Math.cos(m.a); return Math.abs(u) < m.L + 18 + pad && Math.abs(v) < 17 + pad; });
    function drawMag(m) {
      ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.a);
      ctx.fillStyle = '#dc2626'; ctx.fillRect(0, -17, m.L + 18, 34);
      ctx.fillStyle = '#2563eb'; ctx.fillRect(-m.L - 18, -17, m.L + 18, 34);
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1.5; ctx.strokeRect(-m.L - 18, -17, 2 * m.L + 36, 34);
      ctx.rotate(-m.a);
      const ux = Math.cos(m.a) * (m.L - 2), uy = Math.sin(m.a) * (m.L - 2);
      D.text(ctx, 'N', ux, uy, { size: 18, weight: 800, color: '#fff' }); D.text(ctx, 'S', -ux, -uy, { size: 18, weight: 800, color: '#fff' });
      ctx.restore();
    }
    function draw() {
      c.clear('#0d1424');
      if (S.mode === 'terra') {
        const g = ctx.createRadialGradient(370, 200, 20, 400, 235, 120); g.addColorStop(0, '#2b6cb0'); g.addColorStop(1, '#14315a');
        D.circle(ctx, 400, 235, 115, g, '#60a5fa', 2);
        ctx.fillStyle = 'rgba(74,222,128,.55)'; [[370, 200, 30, 22], [430, 260, 26, 34], [350, 280, 18, 14], [445, 190, 20, 12]].forEach(([x, y, a, b]) => { ctx.beginPath(); ctx.ellipse(x, y, a, b, 0.4, 0, TAU); ctx.fill(); });
        ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(400, 100); ctx.lineTo(400, 370); ctx.stroke(); ctx.setLineDash([]);
        D.text(ctx, 'Polo Norte geográfico', 400, 92, { size: 13, color: C.yellow }); D.text(ctx, 'Polo Sul geográfico', 400, 380, { size: 13, color: C.yellow });
        ctx.globalAlpha = 0.55; drawMag(S.mags[0]); ctx.globalAlpha = 1;
      }
      // linhas de campo
      if (S.lines) {
        ctx.strokeStyle = 'rgba(125,211,252,.35)'; ctx.lineWidth = 1.3;
        S.mags.forEach(m => {
          const pN = poles(m)[0];
          for (let k = 0; k < 16; k++) {
            const a = k / 16 * TAU; let x = pN.x + Math.cos(a) * 10, y = pN.y + Math.sin(a) * 10;
            ctx.beginPath(); ctx.moveTo(x, y);
            for (let i = 0; i < 700; i++) {
              const [bx, by] = B(x, y), L = Math.hypot(bx, by); if (!L) break;
              x += bx / L * 3; y += by / L * 3; ctx.lineTo(x, y);
              if (x < -20 || x > 820 || y < -20 || y > 480) break;
              if (S.mags.some(mm => { const s = poles(mm)[1]; return Math.hypot(x - s.x, y - s.y) < 8; })) break;
            }
            ctx.stroke();
          }
        });
      }
      // bússolas
      for (let y = 24; y < 460; y += 40) for (let x = 24; x < 800; x += 40) {
        if (inside(x, y)) continue;
        if (S.mode === 'terra' && Math.hypot(x - 400, y - 235) < 128) continue;
        const [bx, by] = B(x, y), L = Math.hypot(bx, by); if (!L) continue;
        const a = Math.atan2(by, bx), s = 11, al = Math.min(1, 0.25 + Math.log10(1 + L * 3e4) * 0.35);
        ctx.globalAlpha = al;
        D.circle(ctx, x, y, 13, 'rgba(15,23,42,.8)', 'rgba(148,163,184,.4)', 1);
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(0, -3.5); ctx.lineTo(0, 3.5); ctx.fill();
        ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(0, -3.5); ctx.lineTo(0, 3.5); ctx.fill();
        ctx.restore(); ctx.globalAlpha = 1;
      }
      if (S.mode !== 'terra') S.mags.forEach(drawMag);
      // força entre dois ímãs
      if (S.mode === 'dois' || (S.mode === 'um' && S.mags.length === 2)) {
        const [m1, m2] = S.mags; let fx = 0, fy = 0;
        poles(m2).forEach(p => { const [bx, by] = B(p.x, p.y, m1); fx += p.q * bx; fy += p.q * by; });
        const F = Math.hypot(fx, fy), toward = fx * (m1.x - m2.x) + fy * (m1.y - m2.y) > 0;
        if (F > 1e-7) {
          const L = Math.min(110, 18 + Math.log10(1 + F * 1e6) * 30);
          D.arrow(ctx, m2.x, m2.y - 34, m2.x + fx / F * L, m2.y - 34 + fy / F * L, toward ? '#4ade80' : '#f87171', 4, 13);
          D.arrow(ctx, m1.x, m1.y - 34, m1.x - fx / F * L, m1.y - 34 - fy / F * L, toward ? '#4ade80' : '#f87171', 4, 13);
          D.text(ctx, toward ? 'ATRAÇÃO: polos opostos frente a frente' : 'REPULSÃO: polos iguais frente a frente', 400, 22, { size: 15, color: toward ? '#86efac' : '#fca5a5' });
        }
      }
      c.dirty = false;
    }
    AU.drag(c, {
      down: p => { const m = S.mode === 'terra' ? null : S.mags.find(mm => { const dx = p.x - mm.x, dy = p.y - mm.y, u = dx * Math.cos(mm.a) + dy * Math.sin(mm.a), v = -dx * Math.sin(mm.a) + dy * Math.cos(mm.a); return Math.abs(u) < mm.L + 22 && Math.abs(v) < 24; }); if (!m) return false; S.drag = m; S.off = { x: p.x - m.x, y: p.y - m.y }; return true; },
      move: p => { S.drag.x = AU.clamp(p.x - S.off.x, 40, 760); S.drag.y = AU.clamp(p.y - S.off.y, 30, 430); draw(); },
      up: () => { S.drag = null; },
    });
    const r = AU.row(el);
    AU.seg(r, [['um', '1 ímã'], ['dois', '2 ímãs'], ['terra', '🌎 A Terra é um ímã']], 'um', m => { setMode(m); draw(); });
    const bl = AU.btn(r, '〰 Linhas de campo: ligadas', () => { S.lines = !S.lines; bl.textContent = '〰 Linhas de campo: ' + (S.lines ? 'ligadas' : 'desligadas'); draw(); });
    AU.btn(r, '🔄 Girar o ímã', () => { if (S.mode === 'terra') return; const m = S.mags[S.mags.length - 1]; m.a += Math.PI; draw(); });
    AU.btn(r, '✂️ Cortar o ímã ao meio', () => {
      if (S.mode !== 'um' || S.mags.length !== 1) { AU.toast('Use o modo “1 ímã” para cortar.'); return; }
      const m = S.mags[0], ux = Math.cos(m.a), uy = Math.sin(m.a), L = m.L / 2 - 6;
      S.mags = [mk(m.x - ux * (L + 36), m.y - uy * (L + 36), m.a, L), mk(m.x + ux * (L + 36), m.y + uy * (L + 36), m.a, L)];
      info('✂️ Cortamos o ímã, mas não separamos os polos: <b>cada pedaço virou um ímã completo</b>, com polo N e polo S. Os pedaços se atraem (o N de um fica de frente para o S do outro).');
      draw();
    });
    const nt = AU.note(el, '');
    function info(extra) {
      nt.innerHTML = extra || (S.mode === 'terra'
        ? 'A Terra se comporta como um enorme ímã (William Gilbert, 1600). A ponta N da bússola aponta para o <b>polo Norte geográfico</b>, porque ali fica o <b>polo Sul magnético</b> da Terra (opostos se atraem). O eixo magnético é um pouco inclinado em relação ao eixo de rotação.'
        : S.mode === 'dois' ? 'Gire um dos ímãs para trocar os polos que ficam frente a frente. <b>Polos opostos se atraem, polos iguais se repelem.</b>'
          : 'As linhas de campo saem do polo <b>N</b> e entram no polo <b>S</b>. Onde as linhas ficam mais juntas, o campo é mais forte (perto dos polos).');
    }
    setMode('um'); c.onresize = draw; draw();

    const sec = h('div', 'au-sec', '<h3>🧷 O ímã atrai este objeto?</h3><p class="au-sub">Faça sua previsão e clique para testar.</p>'); el.appendChild(sec);
    const OBJ = [['📎', 'Clipe de aço', true, 'O aço é feito de ferro: é ferromagnético.'], ['🔩', 'Prego de ferro', true, 'O ferro é o principal material ferromagnético.'], ['🥫', 'Lata de alumínio', false, 'O alumínio é metal, mas não é atraído por ímãs.'], ['💰', 'Moeda de níquel', true, 'O níquel é ferromagnético (como o ferro e o cobalto).'],
      ['🔌', 'Fio de cobre', false, 'O cobre conduz eletricidade muito bem, mas não é atraído por ímãs.'], ['🥄', 'Colher de plástico', false, 'Plástico não tem propriedades magnéticas.'], ['✏️', 'Lápis de madeira', false, 'Madeira não é atraída.'], ['🗝️', 'Chave de latão', false, 'O latão (cobre + zinco) não é ferromagnético.'], ['🍳', 'Panela de ferro', true, 'Ferro fundido é atraído. É por isso que funciona em fogão de indução.']];
    const grid = h('div', 'au-cards'); sec.appendChild(grid);
    grid.innerHTML = OBJ.map(([e, t], i) => `<button class="au-card" data-i="${i}"><span class="em">${e}</span>${t}<div class="au-fb" style="margin-top:4px"></div></button>`).join('');
    grid.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; const o = OBJ[+b.dataset.i]; b.classList.add(o[2] ? 'good' : 'badc'); b.querySelector('.au-fb').innerHTML = (o[2] ? '🧲 <b>Atraído!</b> ' : '❌ <b>Não é atraído.</b> ') + o[3]; });
  };

  /* ================= Aula 6 · Átomo, forças entre cargas e polarização ================= */
  AU.labs.cargas = el => {
    el.innerHTML = `<h3>⚛️ Cargas elétricas</h3>`;
    const r = AU.row(el);
    const sub = h('p', 'au-sub'); el.appendChild(sub);
    const c = AU.canvas(el, 800, 420), ctx = c.ctx;
    const ctl = AU.row(el); const nt = AU.note(el, '');
    const ELEM = ['', 'Hidrogênio', 'Hélio', 'Lítio', 'Berílio', 'Boro', 'Carbono', 'Nitrogênio', 'Oxigênio', 'Flúor', 'Neônio'];
    const NEU = [0, 0, 2, 4, 5, 6, 6, 7, 8, 10, 10];
    const S = { mode: 'atomo', Z: 3, e: 3, qA: -2, qB: 2, bx: 520, ball: { x: 230, y: 120 }, bits: [], drag: null, t: 0 };
    for (let i = 0; i < 14; i++) S.bits.push({ x0: 420 + (i % 7) * 40 + (i > 6 ? 18 : 0), y0: 395 - (i > 6 ? 14 : 0), x: 0, y: 0, vy: 0, stuck: false, a: Math.random() * TAU });
    S.bits.forEach(b => { b.x = b.x0; b.y = b.y0; });
    function setMode(m) {
      S.mode = m; ctl.innerHTML = '';
      if (m === 'atomo') {
        sub.innerHTML = 'O átomo tem <b>prótons (+)</b> e nêutrons no núcleo e <b>elétrons (−)</b> girando ao redor. Tire ou coloque elétrons e veja a carga do átomo.';
        AU.slider(ctl, { label: 'Elemento (nº de prótons)', min: 1, max: 10, step: 1, value: S.Z, fmt: v => `${ELEM[v]} (${v})`, on: v => { S.Z = v; S.e = v; } });
        AU.btn(ctl, '➕ Colocar 1 elétron', () => { S.e = Math.min(S.Z + 3, S.e + 1); });
        AU.btn(ctl, '➖ Tirar 1 elétron', () => { S.e = Math.max(0, S.e - 1); });
        AU.btn(ctl, '⚖️ Deixar neutro', () => { S.e = S.Z; });
      } else if (m === 'forca') {
        sub.innerHTML = 'Escolha a carga de cada esfera e arraste a esfera B. As setas mostram a <b>força elétrica</b>: cargas <b>opostas se atraem</b>, cargas <b>iguais se repelem</b>.';
        const mk = (k, lab) => { const w = h('span', '', `<b>${lab}</b> `); ctl.appendChild(w); [-3, -2, -1, 0, 1, 2, 3].forEach(q => AU.btn(w, (q > 0 ? '+' : '') + q, () => { S[k] = q; w.querySelectorAll('button').forEach(b => b.classList.toggle('primary', b.textContent === (q > 0 ? '+' : '') + q)); })); w.querySelectorAll('button').forEach(b => b.classList.toggle('primary', b.textContent === (S[k] > 0 ? '+' : '') + S[k])); };
        mk('qA', 'Esfera A:'); mk('qB', 'Esfera B:');
      } else {
        sub.innerHTML = 'O balão foi esfregado no cabelo e ficou <b>negativo</b>. Arraste-o para perto dos papeizinhos neutros e da barra neutra.';
        AU.btn(ctl, '↺ Recomeçar', () => { S.ball = { x: 230, y: 120 }; S.bits.forEach(b => { b.x = b.x0; b.y = b.y0; b.vy = 0; b.stuck = false; }); });
      }
    }
    AU.seg(r, [['atomo', '⚛️ Átomo'], ['forca', '↔️ Atração e repulsão'], ['polar', '🎈 Polarização']], 'atomo', setMode);
    AU.drag(c, {
      down: p => {
        if (S.mode === 'forca' && Math.hypot(p.x - S.bx, p.y - 200) < 50) { S.drag = 'b'; return true; }
        if (S.mode === 'polar' && Math.hypot(p.x - S.ball.x, p.y - S.ball.y) < 60) { S.drag = 'ball'; return true; }
        return false;
      },
      move: p => { if (S.drag === 'b') S.bx = AU.clamp(p.x, 330, 760); else if (S.drag === 'ball') { S.ball.x = AU.clamp(p.x, 50, 750); S.ball.y = AU.clamp(p.y, 50, 330); } },
      up: () => { S.drag = null; },
    });
    function drawAtom(t) {
      const cx = 300, cy = 210, Z = S.Z, N = NEU[Z];
      [70, 125].forEach(rr => D.circle(ctx, cx, cy, rr, null, 'rgba(148,163,184,.25)', 1.2));
      const tot = Z + N, nuc = [];
      for (let i = 0; i < tot; i++) { const a = i * 2.4, rr = 7 * Math.sqrt(i); nuc.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, i % 2 === 0 && nuc.filter(q => q[2]).length < Z ? 1 : 0]); }
      let p = nuc.filter(q => q[2]).length; nuc.forEach(q => { if (p < Z && !q[2]) { q[2] = 1; p++; } });
      nuc.forEach(([x, y, isP]) => isP ? D.charge(ctx, x, y, 1, 8) : D.circle(ctx, x, y, 8, '#64748b', '#cbd5e1', 1));
      const sh = [Math.min(2, S.e), Math.max(0, S.e - 2)];
      sh.forEach((k, s) => { for (let i = 0; i < k; i++) { const rr = s ? 125 : 70, a = t * (s ? 0.6 : 1.1) + i / k * TAU; D.charge(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, -1, 9); } });
      const q = Z - S.e;
      D.text(ctx, ELEM[Z], 600, 70, { size: 22, weight: 800 });
      D.text(ctx, `${Z} prótons (+)   ·   ${S.e} elétrons (−)`, 600, 110, { size: 15, color: C.muted });
      D.text(ctx, q === 0 ? 'Carga total: 0  →  NEUTRO' : `Carga total: ${q > 0 ? '+' : '−'}${Math.abs(q)}`, 600, 160, { size: 20, weight: 800, color: q === 0 ? C.ok : q > 0 ? C.pos : C.neg });
      D.text(ctx, q === 0 ? 'Prótons e elétrons em mesma quantidade' : q > 0 ? `Perdeu ${q} elétron${q > 1 ? 's' : ''}: ficou POSITIVO` : `Ganhou ${-q} elétron${q < -1 ? 's' : ''}: ficou NEGATIVO`, 600, 195, { size: 15, color: C.text });
      D.charge(ctx, 520, 260, 1, 9); D.text(ctx, 'próton (fica no núcleo)', 536, 260, { size: 13, align: 'left', color: C.muted });
      D.charge(ctx, 520, 290, -1, 9); D.text(ctx, 'elétron (pode passar para outro corpo)', 536, 290, { size: 13, align: 'left', color: C.muted });
      D.circle(ctx, 520, 320, 9, '#64748b', '#cbd5e1', 1); D.text(ctx, 'nêutron (sem carga)', 536, 320, { size: 13, align: 'left', color: C.muted });
      nt.innerHTML = 'Os <b>prótons</b> ficam presos no núcleo. Quem passa de um corpo para outro são os <b>elétrons</b>: um corpo fica <b>positivo</b> quando <b>perde</b> elétrons e <b>negativo</b> quando <b>ganha</b> elétrons.';
    }
    function sphere(x, y, q, lab) {
      D.circle(ctx, x, y, 40, q > 0 ? 'rgba(239,68,68,.25)' : q < 0 ? 'rgba(37,99,235,.28)' : 'rgba(148,163,184,.18)', q > 0 ? '#f87171' : q < 0 ? '#60a5fa' : '#94a3b8', 2);
      for (let i = 0; i < Math.abs(q); i++) { const a = i / Math.max(1, Math.abs(q)) * TAU; D.charge(ctx, x + Math.cos(a) * 20, y + Math.sin(a) * 20, Math.sign(q), 8); }
      if (!q) D.text(ctx, 'neutra', x, y, { size: 12, color: C.muted });
      D.text(ctx, lab, x, y + 58, { size: 14, weight: 700 });
    }
    function drawForce() {
      const ax = 220, y = 200, d = S.bx - ax;
      sphere(ax, y, S.qA, 'Esfera A'); sphere(S.bx, y, S.qB, 'Esfera B (arraste)');
      const prod = S.qA * S.qB;
      if (prod !== 0) {
        const F = Math.abs(prod) / Math.pow(d / 100, 2), L = Math.min(150, 14 + F * 9), at = prod < 0;
        const dir = at ? 1 : -1;
        D.arrow(ctx, ax, y - 70, ax + dir * L, y - 70, at ? C.ok : C.bad, 5, 14);
        D.arrow(ctx, S.bx, y - 70, S.bx - dir * L, y - 70, at ? C.ok : C.bad, 5, 14);
        D.text(ctx, at ? 'ATRAÇÃO' : 'REPULSÃO', 400, 330, { size: 22, weight: 800, color: at ? '#86efac' : '#fca5a5' });
        D.text(ctx, `Distância: ${n(d / 100, 1)} (unid.) · Força relativa: ${n(F, 1)}`, 400, 365, { size: 14, color: C.muted });
        nt.innerHTML = at ? 'Cargas de <b>sinais opostos</b> se atraem. Aproxime a esfera B: a força fica <b>mais forte</b> quanto menor a distância (diminuindo a distância pela metade, a força fica 4 vezes maior).' : 'Cargas de <b>mesmo sinal</b> se repelem. Quanto mais perto, mais forte a repulsão.';
      } else { D.text(ctx, 'Sem força elétrica entre elas', 400, 330, { size: 20, color: C.muted }); nt.innerHTML = 'Se uma das esferas está <b>neutra</b> (e é isolante), não há atração nem repulsão entre elas aqui. No modo Polarização você vai ver que um corpo neutro pode, sim, ser atraído!'; }
    }
    function drawPolar(dt) {
      // mesa
      ctx.fillStyle = '#3b2f2a'; ctx.fillRect(380, 404, 330, 16);
      // barra neutra (condutora) à direita
      const bx = 560, by = 200, bw = 200;
      D.rr(ctx, bx, by - 22, bw, 44, 10); ctx.fillStyle = '#334155'; ctx.fill(); ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.stroke();
      D.text(ctx, 'barra neutra', bx + bw / 2, by + 40, { size: 12, color: C.muted });
      const dB = Math.max(40, Math.hypot(S.ball.x - bx, S.ball.y - by)), sh = AU.clamp(1 / Math.pow(dB / 150, 2), 0, 1);
      for (let i = 0; i < 6; i++) {
        const x0 = bx + 18 + i * 33;
        D.charge(ctx, x0 - 6 * sh, by - 8 + 0, 1, 7);
        const ex = AU.clamp(x0 + 6 + sh * (bw - (x0 - bx)) * 0.55 * (S.ball.x < bx ? 1 : -1), bx + 8, bx + bw - 8);
        D.charge(ctx, ex, by + 8, -1, 7);
      }
      // papeizinhos
      S.bits.forEach(b => {
        const dx = S.ball.x - b.x, dy = (S.ball.y + 46) - b.y, d = Math.hypot(dx, dy);
        if (!b.stuck && d < 120) { b.vy -= (2600 / Math.max(30, d)) * dt; }
        if (b.stuck && Math.hypot(S.ball.x - b.x, S.ball.y - b.y) > 160) b.stuck = false;
        if (b.stuck) { b.x += (S.ball.x + Math.cos(b.a) * 34 - b.x) * 0.3; b.y += (S.ball.y + 40 + Math.sin(b.a) * 8 - b.y) * 0.3; }
        else {
          b.vy += 900 * dt; b.y += b.vy * dt; if (d < 120) b.x += dx * 2.5 * dt;
          if (b.y > b.y0) { b.y = b.y0; b.vy = 0; b.x += (b.x0 - b.x) * 0.05; }
          if (Math.hypot(S.ball.x - b.x, S.ball.y + 40 - b.y) < 26) b.stuck = true;
        }
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = '#f8fafc'; ctx.fillRect(-7, -4, 14, 8); ctx.restore();
      });
      // balão
      const { x, y } = S.ball;
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y + 58); ctx.quadraticCurveTo(x + 15, y + 90, x - 5, y + 120); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x, y, 44, 56, 0, 0, TAU); ctx.fillStyle = 'rgba(244,63,94,.85)'; ctx.fill();
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; D.charge(ctx, x + Math.cos(a) * 26, y + Math.sin(a) * 33, -1, 6.5); }
      D.text(ctx, 'arraste o balão', x, y - 72, { size: 12, color: C.muted });
      const stuck = S.bits.filter(b => b.stuck).length;
      nt.innerHTML = `O balão negativo <b>empurra os elétrons</b> da barra para o lado oposto e deixa o lado mais próximo positivo: as cargas se <b>separam</b> (polarização), mas a barra continua neutra no total. Como a parte positiva fica mais perto, a <b>atração vence</b>. É assim que o balão atrai os papeizinhos${stuck ? ` (${stuck} grudaram!)` : ''}.`;
    }
    AU.loop((dt, t) => {
      c.clear('#0d1424');
      if (S.mode === 'atomo') drawAtom(t); else if (S.mode === 'forca') drawForce(); else drawPolar(dt);
    });
    setMode('atomo');
  };

  /* ================= Aula 7 · Atrito, contato, indução e raios ================= */
  AU.labs.eletrizacao = el => {
    el.innerHTML = `<h3>🌩️ Processos de eletrização</h3>`;
    const r = AU.row(el); const sub = h('p', 'au-sub'); el.appendChild(sub);
    const c = AU.canvas(el, 800, 420), ctx = c.ctx;
    const ctl = AU.row(el); const nt = AU.note(el, '');
    const S = { mode: 'atrito' };
    const resetAll = () => Object.assign(S, {
      ball: { x: 560, y: 170 }, rub: 0, last: null, q: 0, drag: null,
      A: { x: 290, q: -8 }, B: { x: 560, q: 0 }, touched: false, flow: [],
      ind: 0, rodX: -60, grounded: false, lost: 0, gflow: [],
      level: 0, auto: true, rod: true, bolt: null, flash: 0, hit: '', strikes: 0,
    });
    resetAll();
    function setMode(m) {
      S.mode = m; ctl.innerHTML = ''; resetAll(); S.mode = m;
      if (m === 'atrito') {
        sub.innerHTML = 'Arraste o balão <b>esfregando</b> no cabelo (vá e volte várias vezes). Depois afaste o balão e observe.';
        AU.btn(ctl, '↺ Recomeçar', () => setMode('atrito'));
      } else if (m === 'contato') {
        sub.innerHTML = 'A esfera A está eletrizada. Arraste a esfera B (neutra) até <b>encostar</b> em A e depois afaste.';
        AU.btn(ctl, '➖ A negativa', () => { resetAll(); S.mode = 'contato'; S.A.q = -8; });
        AU.btn(ctl, '➕ A positiva', () => { resetAll(); S.mode = 'contato'; S.A.q = 8; });
      } else if (m === 'inducao') {
        sub.innerHTML = 'Siga os passos em ordem. O bastão está eletrizado <b>negativamente</b> e <b>não encosta</b> na esfera.';
        const steps = ['1️⃣ Aproximar o bastão', '2️⃣ Ligar o fio terra', '3️⃣ Desligar o fio terra', '4️⃣ Afastar o bastão'];
        steps.forEach((t, i) => AU.btn(ctl, t, () => {
          if (i !== S.ind) { AU.toast(`Faça o passo ${S.ind + 1} primeiro.`, 'warn'); return; }
          S.ind = i + 1; if (i === 1) S.grounded = true; if (i === 2) S.grounded = false;
        }));
        AU.btn(ctl, '↺ Recomeçar', () => setMode('inducao'));
      } else {
        sub.innerHTML = 'As partículas de gelo e água se atritam dentro da nuvem: a base fica <b>negativa</b> e induz cargas positivas no solo. Quando a diferença fica grande demais, salta o <b>raio</b>.';
        const b = AU.btn(ctl, '🏢 Para-raios: instalado', () => { S.rod = !S.rod; b.textContent = '🏢 Para-raios: ' + (S.rod ? 'instalado' : 'retirado'); });
        AU.btn(ctl, '⚡ Carregar a nuvem mais rápido', () => { S.level = Math.min(99, S.level + 30); });
      }
    }
    AU.seg(r, [['atrito', '🎈 Atrito'], ['contato', '🔵 Contato'], ['inducao', '🧲 Indução'], ['raio', '🌩️ Raios e para-raios']], 'atrito', setMode);
    const head = { x: 240, y: 270 };
    AU.drag(c, {
      down: p => {
        if (S.mode === 'atrito' && Math.hypot(p.x - S.ball.x, p.y - S.ball.y) < 60) { S.drag = 'ball'; S.last = p; return true; }
        if (S.mode === 'contato' && Math.hypot(p.x - S.B.x, p.y - 210) < 55) { S.drag = 'B'; return true; }
        return false;
      },
      move: p => {
        if (S.drag === 'ball') {
          S.ball.x = AU.clamp(p.x, 60, 740); S.ball.y = AU.clamp(p.y, 60, 360);
          if (Math.hypot(S.ball.x - head.x, S.ball.y - (head.y - 70)) < 95 && S.last) { S.rub += Math.hypot(p.x - S.last.x, p.y - S.last.y); const k = Math.min(12, Math.floor(S.rub / 40)); if (k > S.q) S.q = k; }
          S.last = p;
        } else if (S.drag === 'B') {
          S.B.x = AU.clamp(p.x, S.A.x + 70, 740);
          if (S.B.x - S.A.x <= 82 && !S.touched) {
            S.touched = true; const tot = S.A.q + S.B.q, half = Math.trunc(tot / 2);
            const moved = S.A.q - (tot - half); S.A.q = tot - half; S.B.q = half;
            for (let i = 0; i < Math.abs(moved); i++) S.flow.push({ t: -i * 0.08, s: Math.sign(moved) });
          }
          if (S.B.x - S.A.x > 90) S.touched = false;
        }
      },
      up: () => { S.drag = null; },
    });
    function balloon(x, y, q) {
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y + 58); ctx.quadraticCurveTo(x + 15, y + 90, x - 5, y + 120); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x, y, 44, 56, 0, 0, TAU); ctx.fillStyle = 'rgba(244,63,94,.85)'; ctx.fill();
      for (let i = 0; i < q; i++) { const a = i / Math.max(q, 1) * TAU; D.charge(ctx, x + Math.cos(a) * 26, y + Math.sin(a) * 34, -1, 6.5); }
    }
    function sphereQ(x, y, q, R = 42, lab = '') {
      D.circle(ctx, x, y, R, '#475569', '#cbd5e1', 2);
      const g = ctx.createRadialGradient(x - 14, y - 14, 4, x, y, R); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); D.circle(ctx, x, y, R, g);
      for (let i = 0; i < Math.abs(q); i++) { const a = i / Math.abs(q) * TAU + 0.3; D.charge(ctx, x + Math.cos(a) * (R - 11), y + Math.sin(a) * (R - 11), Math.sign(q), 7); }
      ctx.fillStyle = '#64748b'; ctx.fillRect(x - 4, y + R, 8, 150 - R); ctx.fillRect(x - 30, 360, 60, 8);
      if (lab) D.text(ctx, lab, x, 385, { size: 14, weight: 700 });
    }
    function drawAtrito() {
      // cabeça e cabelo
      const q = S.q, near = Math.hypot(S.ball.x - head.x, S.ball.y - head.y) < 260;
      D.circle(ctx, head.x, head.y, 70, '#d6a77a'); D.circle(ctx, head.x - 22, head.y + 5, 6, '#1f2937'); D.circle(ctx, head.x + 22, head.y + 5, 6, '#1f2937');
      ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(head.x, head.y + 25, 18, 0.2, Math.PI - 0.2); ctx.stroke();
      for (let i = 0; i < 26; i++) {
        const a0 = Math.PI + 0.25 + i / 25 * (Math.PI - 0.5), bx = head.x + Math.cos(a0) * 66, by = head.y + Math.sin(a0) * 66;
        let a = a0 - (a0 - 1.5 * Math.PI) * (1 - Math.min(1, q / 9)) * 0.85 + (a0 < 1.5 * Math.PI ? -0.25 : 0.25) * (1 - Math.min(1, q / 9));
        let L = 34 + q * 3.5;
        let ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L;
        if (q > 0 && near) { const k = Math.min(0.6, q / 20); ex += (S.ball.x - ex) * k * 0.6; ey += (S.ball.y - ey) * k * 0.6; }
        ctx.strokeStyle = '#7c4a1e'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo((bx + ex) / 2 + Math.cos(a0) * 6, (by + ey) / 2, ex, ey); ctx.stroke();
      }
      for (let i = 0; i < q; i++) { const a = Math.PI + 0.4 + i / Math.max(1, q - 1) * (Math.PI - 0.8); D.charge(ctx, head.x + Math.cos(a) * 52, head.y + Math.sin(a) * 52, 1, 6.5); }
      balloon(S.ball.x, S.ball.y, q);
      D.text(ctx, `Balão: ${q ? '−' + q : '0'}     Cabelo: ${q ? '+' + q : '0'}     Total: 0`, 560, 30, { size: 16, weight: 700, color: q ? C.yellow : C.muted });
      nt.innerHTML = q === 0 ? 'Esfregue o balão no cabelo: o atrito faz <b>elétrons passarem do cabelo para o balão</b>.' : q < 12
        ? `Já passaram <b>${q} elétrons</b> do cabelo para o balão. O balão fica <b>negativo</b> e o cabelo <b>positivo</b>: cargas <b>opostas</b>. Repare que a soma continua zero: a carga não é criada, só transferida. Os fios de cabelo, todos positivos, se <b>repelem</b> e ficam arrepiados.`
        : 'Carga máxima! Afaste e aproxime o balão: o cabelo positivo é <b>atraído</b> pelo balão negativo.';
    }
    function drawContato(dt) {
      sphereQ(S.A.x, 210, S.A.q, 42, 'A'); sphereQ(S.B.x, 210, S.B.q, 42, 'B (arraste)');
      S.flow = S.flow.filter(f => (f.t += dt * 1.6) < 1);
      S.flow.forEach(f => { if (f.t < 0) return; const x = f.s > 0 ? S.A.x + 40 + f.t * (S.B.x - S.A.x - 80) : S.B.x - 40 - f.t * (S.B.x - S.A.x - 80); D.charge(ctx, x, 200 + Math.sin(f.t * 9) * 6, -1, 6); });
      const d = S.B.x - S.A.x;
      if (S.A.q && S.B.q && d > 90) {
        const same = Math.sign(S.A.q) === Math.sign(S.B.q), L = Math.min(110, 4000 / d);
        D.arrow(ctx, S.A.x, 130, S.A.x - (same ? L : -L), 130, same ? C.bad : C.ok, 4, 12);
        D.arrow(ctx, S.B.x, 130, S.B.x + (same ? L : -L), 130, same ? C.bad : C.ok, 4, 12);
        D.text(ctx, same ? 'REPULSÃO: as duas ficaram com carga de mesmo sinal' : 'ATRAÇÃO', 400, 40, { size: 16, weight: 700, color: same ? '#fca5a5' : '#86efac' });
      }
      nt.innerHTML = S.B.q === 0 ? `Encoste B em A. As cargas em excesso de A vão se espalhar pelas duas esferas.` :
        `Depois do contato: A = ${S.A.q > 0 ? '+' : ''}${S.A.q}, B = ${S.B.q > 0 ? '+' : ''}${S.B.q}. Na eletrização por <b>contato</b>, a esfera neutra fica com carga de <b>mesmo sinal</b> que a outra, e por isso as duas se <b>repelem</b>. ${S.A.q < 0 ? 'Quem se moveu foram os elétrons de A para B.' : 'Quem se moveu foram elétrons de B para A (B ficou com falta de elétrons).'}`;
    }
    function drawInducao(dt) {
      const sx = 470, sy = 200, R = 70;
      const target = S.ind >= 1 && S.ind < 4 ? 300 : -80; S.rodX += (target - S.rodX) * Math.min(1, dt * 4);
      const near = AU.clamp((S.rodX + 80) / 380, 0, 1);
      // bastão
      ctx.save(); ctx.translate(S.rodX, sy); D.rr(ctx, -150, -16, 170, 32, 14); ctx.fillStyle = '#7c3aed'; ctx.fill();
      for (let i = 0; i < 6; i++) D.charge(ctx, -125 + i * 27, 0, -1, 7); ctx.restore();
      D.text(ctx, 'bastão eletrizado (−)', Math.max(70, S.rodX - 65), sy - 34, { size: 12, color: C.muted });
      D.circle(ctx, sx, sy, R, '#475569', '#cbd5e1', 2);
      ctx.fillStyle = '#64748b'; ctx.fillRect(sx - 4, sy + R, 8, 360 - sy - R); ctx.fillRect(sx - 34, 360, 68, 8);
      const nPos = 8, nNeg = 8 - S.lost;
      if (S.ind >= 4) { // bastão longe: o excesso de cargas positivas se espalha pela superfície
        for (let i = 0; i < S.lost; i++) { const a = i / S.lost * TAU; D.charge(ctx, sx + Math.cos(a) * (R - 14), sy + Math.sin(a) * (R - 14), 1, 7); }
      } else {
        for (let i = 0; i < nPos; i++) { const a = Math.PI * 0.55 + i / (nPos - 1) * Math.PI * 0.9; const rr = R - 14; const x = sx + Math.cos(a) * rr * (0.35 + 0.65 * near) + (1 - near) * Math.cos(i * 2.2) * 12, y = sy + Math.sin(a) * rr * (0.35 + 0.65 * near) + (1 - near) * Math.sin(i * 2.2) * 12; D.charge(ctx, x, y, 1, 7); }
        for (let i = 0; i < nNeg; i++) { const a = -Math.PI * 0.45 + i / Math.max(1, nNeg - 1) * Math.PI * 0.9; const rr = R - 14; const x = sx + Math.cos(a) * rr * (0.35 + 0.65 * near) + (1 - near) * Math.cos(i * 2.2 + 1) * 12, y = sy + Math.sin(a) * rr * (0.35 + 0.65 * near) + (1 - near) * Math.sin(i * 2.2 + 1) * 12; D.charge(ctx, x, y, -1, 7); }
      }
      if (S.ind >= 4) D.text(ctx, '(as cargas + que sobraram se espalham pela esfera)', sx, sy + R + 22, { size: 11.5, color: C.muted });
      // fio terra
      if (S.grounded) {
        ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx + R, sy); ctx.lineTo(680, sy); ctx.lineTo(680, 370); ctx.stroke();
        [0, 1, 2].forEach(i => { ctx.beginPath(); ctx.moveTo(680 - 22 + i * 7, 372 + i * 7); ctx.lineTo(680 + 22 - i * 7, 372 + i * 7); ctx.stroke(); });
        D.text(ctx, 'fio terra', 700, sy - 14, { size: 12, color: '#86efac' });
        if (S.lost < 5 && Math.random() < dt * 6) { S.lost++; S.gflow.push({ t: 0 }); }
      }
      S.gflow = S.gflow.filter(f => (f.t += dt * 1.2) < 1);
      S.gflow.forEach(f => { const L1 = 680 - sx - R, L2 = 170, s = f.t * (L1 + L2); const x = s < L1 ? sx + R + s : 680, y = s < L1 ? sy : sy + (s - L1); D.charge(ctx, x, y, -1, 6); });
      const q = S.lost;
      const msgs = [
        'A esfera de metal está <b>neutra</b>: tem a mesma quantidade de cargas + e −, misturadas.',
        'O bastão negativo <b>repele os elétrons</b> da esfera para o lado oposto. As cargas se <b>separam</b> (o indutor não encosta!).',
        'Com o <b>fio terra</b>, os elétrons repelidos escoam para o solo.',
        'Fio terra desligado: os elétrons que saíram não podem mais voltar.',
        `Bastão afastado: a esfera ficou <b>positiva (+${q})</b>, carga <b>oposta</b> à do bastão. Isso é eletrização por <b>indução</b>.`,
      ];
      nt.innerHTML = msgs[Math.min(4, S.ind)];
      D.text(ctx, `Carga da esfera: ${q ? '+' + q : '0'}`, 470, 36, { size: 16, weight: 700, color: q ? C.pos : C.muted });
    }
    function bolt(x0, y0, x1, y1) { const pts = [[x0, y0]]; const N = 14; for (let i = 1; i < N; i++) { const t = i / N; pts.push([x0 + (x1 - x0) * t + (Math.random() - 0.5) * 50, y0 + (y1 - y0) * t]); } pts.push([x1, y1]); return pts; }
    function drawRaio(dt) {
      if (S.auto) S.level = Math.min(100, S.level + dt * 12);
      const lv = S.level / 100;
      ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, 800, 420);
      // nuvem
      ctx.fillStyle = '#334155'; [[260, 80, 70], [340, 60, 80], [430, 75, 75], [510, 85, 60], [380, 100, 90]].forEach(([x, y, rr]) => D.circle(ctx, x, y, rr * 0.75, '#334155'));
      for (let i = 0; i < Math.round(lv * 12); i++) D.charge(ctx, 240 + i * 25, 132, -1, 7);
      for (let i = 0; i < 4; i++) D.charge(ctx, 300 + i * 50, 42, 1, 6);
      // solo
      ctx.fillStyle = '#14532d'; ctx.fillRect(0, 380, 800, 40);
      for (let i = 0; i < Math.round(lv * 12); i++) D.charge(ctx, 240 + i * 25, 395, 1, 6);
      // árvore, casa, prédio
      ctx.fillStyle = '#5b3a1e'; ctx.fillRect(160, 300, 14, 80); D.circle(ctx, 167, 285, 40, '#166534');
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(600, 210, 90, 170); for (let y = 225; y < 370; y += 30) for (let x = 612; x < 680; x += 26) { ctx.fillStyle = '#fde68a'; ctx.fillRect(x, y, 14, 16); }
      if (S.rod) { ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(645, 210); ctx.lineTo(645, 160); ctx.stroke(); D.circle(ctx, 645, 158, 4, '#fde68a'); ctx.strokeStyle = 'rgba(34,197,94,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(688, 210); ctx.lineTo(698, 210); ctx.lineTo(698, 382); ctx.stroke(); D.text(ctx, 'para-raios', 660, 150, { size: 12, color: C.yellow, align: 'left' }); }
      ctx.fillStyle = '#a16207'; ctx.fillRect(330, 320, 90, 60); ctx.fillStyle = '#7f1d1d'; ctx.beginPath(); ctx.moveTo(320, 320); ctx.lineTo(375, 280); ctx.lineTo(430, 320); ctx.fill();
      // barra de carga
      D.text(ctx, 'Carga acumulada na nuvem', 20, 20, { size: 12, color: C.muted, align: 'left' });
      ctx.fillStyle = '#1b2435'; ctx.fillRect(20, 30, 160, 10); ctx.fillStyle = lv > 0.8 ? '#ef4444' : '#f59e0b'; ctx.fillRect(20, 30, 160 * lv, 10);
      if (S.level >= 100 && !S.bolt) {
        const tg = S.rod ? [645, 158, 'para'] : Math.random() < 0.5 ? [167, 250, 'árvore'] : [375, 282, 'casa'];
        S.bolt = { pts: bolt(380 + Math.random() * 60, 135, tg[0], tg[1]), t: 0.5 }; S.flash = 1; S.hit = tg[2]; S.level = 0; S.strikes++;
      }
      if (S.bolt) {
        ctx.strokeStyle = `rgba(255,255,255,${S.bolt.t * 2})`; ctx.lineWidth = 4; ctx.shadowColor = '#bae6fd'; ctx.shadowBlur = 18;
        ctx.beginPath(); S.bolt.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.shadowBlur = 0;
        if (S.hit === 'para') { ctx.strokeStyle = `rgba(253,224,71,${S.bolt.t * 2})`; ctx.beginPath(); ctx.moveTo(645, 160); ctx.lineTo(645, 210); ctx.lineTo(698, 210); ctx.lineTo(698, 382); ctx.stroke(); }
        S.bolt.t -= dt; if (S.bolt.t <= 0) S.bolt = null;
      }
      if (S.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${S.flash * 0.35})`; ctx.fillRect(0, 0, 800, 420); S.flash -= dt * 3; }
      nt.innerHTML = !S.strikes ? 'A nuvem está se carregando… A base negativa <b>induz</b> cargas positivas no solo logo abaixo.'
        : S.hit === 'para' ? '⚡ O raio caiu no <b>para-raios</b>: a ponta metálica concentra as cargas e “atrai” a descarga, que desce pelo cabo até a terra sem passar pelo prédio. Primeiro vemos o relâmpago e depois ouvimos o trovão: a luz é muito mais rápida que o som.'
          : `⚡ Sem para-raios, o raio atingiu a <b>${S.hit}</b>! Durante tempestades, fique longe de árvores isoladas, de campos abertos e da água.`;
    }
    AU.loop(dt => {
      c.clear('#0d1424');
      if (S.mode === 'atrito') drawAtrito(); else if (S.mode === 'contato') drawContato(dt); else if (S.mode === 'inducao') drawInducao(dt); else drawRaio(dt);
    });
    setMode('atrito');
  };

  /* ================= Aula 8 · Corrente, resistência e Lei de Ohm ================= */
  AU.labs.ohm = el => {
    el.innerHTML = `<h3>🔌 Corrente elétrica e Lei de Ohm</h3><p class="au-sub">Escolha a fonte e o fio resistor. As bolinhas azuis são os <b>elétrons</b> andando pelo circuito (do polo − para o polo +): quanto maior a corrente, mais rápido.</p>`;
    const MAT = { cobre: ['Cobre', 0.017, 0.0039], aluminio: ['Alumínio', 0.028, 0.0040], tungstenio: ['Tungstênio (filamento)', 0.056, 0.0045], nicromo: ['Níquel-cromo (chuveiro)', 1.10, 0.0004] };
    const S = { V: 9, mat: 'nicromo', L: 2, A: 0.5, T: 20, ph: 0, pts: [] };
    const R = () => MAT[S.mat][1] * S.L / S.A * (1 + MAT[S.mat][2] * (S.T - 20));
    const c = AU.canvas(el, 800, 300), ctx = c.ctx;
    const RD = AU.readouts(el, [['V', 'Tensão (V)'], ['R', 'Resistência (Ω)'], ['I', 'Corrente (A)'], ['P', 'Potência (W)']]);
    const ohmTxt = h('div', 'au-note'); el.appendChild(ohmTxt);
    const ctl = h('div', 'au-ctl'); el.appendChild(ctl);
    const fw = h('div', 'au-sl', '<label><span>Fonte</span></label>'); ctl.appendChild(fw);
    const fsel = h('select'); fsel.innerHTML = [[1.5, 'Pilha 1,5 V'], [3, '2 pilhas: 3 V'], [4.5, '3 pilhas: 4,5 V'], [6, 'Bateria 6 V'], [9, 'Bateria 9 V'], [12, 'Bateria 12 V'], [127, 'Tomada 127 V'], [220, 'Tomada 220 V']].map(([v, t]) => `<option value="${v}"${v === 9 ? ' selected' : ''}>${t}</option>`).join(''); fsel.style.width = '100%'; fw.appendChild(fsel);
    fsel.addEventListener('change', () => { S.V = +fsel.value; });
    const mw = h('div', 'au-sl', '<label><span>Material do fio</span></label>'); ctl.appendChild(mw);
    const msel = h('select'); msel.style.width = '100%'; msel.innerHTML = Object.entries(MAT).map(([k, v]) => `<option value="${k}"${k === S.mat ? ' selected' : ''}>${v[0]}</option>`).join(''); mw.appendChild(msel);
    msel.addEventListener('change', () => { S.mat = msel.value; });
    const sL = AU.slider(ctl, { label: 'Comprimento do fio', min: 0.1, max: 20, step: 0.1, value: S.L, fmt: v => n(v, 1) + ' m', on: v => { S.L = v; } });
    const sA = AU.slider(ctl, { label: 'Espessura (área do fio)', min: 0.05, max: 4, step: 0.05, value: S.A, fmt: v => n(v, 2) + ' mm²', on: v => { S.A = v; } });
    const sT = AU.slider(ctl, { label: 'Temperatura do fio', min: 20, max: 1000, step: 10, value: 20, fmt: v => v + ' °C', on: v => { S.T = v; } });
    const r2 = AU.row(el);
    const chuv = (L, lab) => () => { S.mat = 'nicromo'; msel.value = 'nicromo'; S.V = 220; fsel.value = '220'; S.L = L; sL.set(L); S.A = 0.5; sA.set(0.5); S.T = 20; sT.set(20); AU.toast(lab); };
    AU.btn(r2, '🚿 Chuveiro no “Verão”', chuv(8.8, 'Verão: resistência mais longa → maior resistência → menos corrente → água morna.'));
    AU.btn(r2, '🚿 Chuveiro no “Inverno”', chuv(5, 'Inverno: só um trecho menor do fio → menor resistência → mais corrente → água quente.'));
    AU.btn(r2, '➕ Registrar medida no gráfico', () => { const r = R(); S.pts.push({ V: S.V, I: S.V / r, R: r }); drawG(); });
    AU.btn(r2, '🧹 Limpar gráfico', () => { S.pts = []; drawG(); });
    const gsec = h('div', 'au-sec', '<h3>📈 Gráfico tensão × corrente</h3><p class="au-sub">Mantenha o mesmo fio, troque a fonte e registre várias medidas. Os pontos formam uma <b>reta</b>: a corrente é proporcional à tensão (Lei de Ohm).</p>'); el.appendChild(gsec);
    const g = AU.canvas(gsec, 800, 300), gx = g.ctx;
    function drawG() {
      g.clear('#0b1220');
      const pts = S.pts, mV = Math.max(12, ...pts.map(p => p.V)) * 1.1, mI = Math.max(1, ...pts.map(p => p.I)) * 1.15;
      const X = v => 70 + v / mV * 700, Y = i => 260 - i / mI * 230;
      gx.strokeStyle = 'rgba(255,255,255,.25)'; gx.lineWidth = 1.5; gx.beginPath(); gx.moveTo(70, 20); gx.lineTo(70, 260); gx.lineTo(780, 260); gx.stroke();
      D.text(gx, 'Tensão (V)', 740, 284, { size: 12, color: C.muted }); gx.save(); gx.translate(22, 140); gx.rotate(-Math.PI / 2); D.text(gx, 'Corrente (A)', 0, 0, { size: 12, color: C.muted }); gx.restore();
      for (let k = 0; k <= 4; k++) { D.text(gx, n(mV * k / 4, 1), X(mV * k / 4), 274, { size: 11, color: C.muted }); D.text(gx, n(mI * k / 4, 2), 62, Y(mI * k / 4), { size: 11, color: C.muted, align: 'right' }); }
      const groups = {}; pts.forEach(p => { const k = p.R.toPrecision(3); (groups[k] = groups[k] || []).push(p); });
      const cols = ['#38bdf8', '#4ade80', '#f59e0b', '#a78bfa', '#f87171'];
      Object.entries(groups).forEach(([k, arr], i) => {
        const col = cols[i % cols.length], r = +k;
        gx.strokeStyle = col; gx.globalAlpha = 0.5; gx.setLineDash([5, 5]); gx.beginPath(); gx.moveTo(X(0), Y(0)); gx.lineTo(X(mV), Y(mV / r)); gx.stroke(); gx.setLineDash([]); gx.globalAlpha = 1;
        arr.forEach(p => D.circle(gx, X(p.V), Y(p.I), 6, col, '#fff', 1.5));
        D.text(gx, `R = ${n(r, 2)} Ω`, 690, 30 + i * 18, { size: 12, color: col, align: 'left' });
      });
      if (!pts.length) D.text(gx, 'Clique em “Registrar medida” para marcar pontos', 420, 140, { size: 14, color: C.muted });
    }
    drawG();
    AU.loop(dt => {
      const r = R(), I = S.V / r, P = S.V * I;
      RD.set('V', n(S.V, 1)); RD.set('R', n(r, r < 1 ? 3 : 2)); RD.set('I', n(I, I < 1 ? 3 : 2), I > 30 ? 'bad' : I > 10 ? 'warn' : ''); RD.set('P', n(P, P < 10 ? 2 : 0), P > 2000 ? 'warn' : '');
      ohmTxt.innerHTML = `<b>Lei de Ohm:</b> I = V ÷ R = ${n(S.V, 1)} ÷ ${n(r, 3)} = <b>${n(I, 3)} A</b> &nbsp;·&nbsp; <b>Potência:</b> P = V × I = ${n(P, 1)} W` +
        (I > 30 ? '<br>⚠️ Corrente altíssima: com um fio de resistência tão baixa, é quase um <b>curto-circuito</b>. O fio esquentaria muito.' : '') +
        (S.T > 20 ? `<br>🌡️ A ${S.T} °C a resistência é ${n((1 + MAT[S.mat][2] * (S.T - 20)) * 100 - 100, 0)}% maior do que a 20 °C.` : '');
      // desenho
      c.clear('#0b1220');
      const path = [[90, 230], [90, 60], [710, 60], [710, 230], [90, 230]];
      ctx.strokeStyle = '#d38c4f'; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath(); path.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
      // resistor (fio enrolado) no topo
      const heat = AU.clamp(P / (S.V > 100 ? 4400 : 60), 0, 1);
      ctx.fillStyle = '#0b1220'; ctx.fillRect(260, 40, 280, 40);
      ctx.strokeStyle = `rgb(${150 + 105 * heat},${150 - 60 * heat},${150 - 120 * heat})`; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(260, 60); for (let i = 0; i <= 28; i++) ctx.lineTo(270 + i * 9.3, 60 + (i % 2 ? -16 : 16)); ctx.lineTo(540, 60); ctx.stroke();
      if (heat > 0.05) D.glow(ctx, 400, 60, 150, `rgba(255,90,20,${0.35 * heat})`);
      D.text(ctx, `${MAT[S.mat][0]} · ${n(S.L, 1)} m · ${n(S.A, 2)} mm²`, 400, 98, { size: 13, color: C.muted });
      // fonte
      ctx.fillStyle = '#0b1220'; ctx.fillRect(60, 110, 60, 80);
      D.battery(ctx, 90, 145, 74, 38, `${n(S.V, 1)} V`, true);
      // amperímetro
      D.rr(ctx, 330, 205, 140, 50, 10); ctx.fillStyle = '#eab308'; ctx.fill(); D.rr(ctx, 340, 212, 120, 36, 6); ctx.fillStyle = '#08160f'; ctx.fill();
      D.text(ctx, n(I, I < 1 ? 3 : 2) + ' A', 400, 231, { size: 18, color: '#86efac', font: 'monospace', weight: 700 });
      // elétrons: do polo − (embaixo da bateria) pelo circuito até o polo +
      const speed = Math.min(220, 8 + Math.log10(1 + I * 20) * 70);
      S.ph = (S.ph + speed * dt) % 40;
      const segs = [[[90, 230], [710, 230]], [[710, 230], [710, 60]], [[710, 60], [90, 60]], [[90, 60], [90, 110]]];
      let off = S.ph;
      segs.forEach(([a, b]) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); for (let s = off; s < L; s += 40) { const t = s / L; D.circle(ctx, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 4.5, '#7dd3fc'); } off = (off - L % 40 + 40) % 40; });
      D.text(ctx, '→ sentido dos elétrons (− para +)', 600, 252, { size: 12, color: '#7dd3fc' });
    });
    AU.note(el, '🔎 <b>Do que depende a resistência?</b> Do <b>material</b> (o níquel-cromo resiste muito mais que o cobre), do <b>comprimento</b> (fio mais longo, mais resistência), da <b>espessura</b> (fio mais grosso, menos resistência) e da <b>temperatura</b> (quente, mais resistência).', 'warn');
  };

  /* ================= Aula 9 · Corrente contínua × alternada e o gerador ================= */
  AU.labs.cacc = el => {
    el.innerHTML = `<h3>〰️ Corrente contínua (CC) × corrente alternada (CA)</h3><p class="au-sub">Na pilha os elétrons andam sempre no mesmo sentido. Na tomada eles <b>vão e voltam</b> 60 vezes por segundo. A animação está em <b>câmera lenta</b>.</p>`;
    const S = { f: 60, slow: 0.5, t: 0, gθ: 0, gw: 1.2, hist: [], ph: 0 };
    const c = AU.canvas(el, 800, 330), ctx = c.ctx;
    const r1 = AU.row(el);
    AU.seg(r1, [[60, 'Brasil: 60 Hz'], [50, 'Europa: 50 Hz']], 60, v => { S.f = v; });
    AU.slider(r1, { label: 'Câmera lenta', min: 0.1, max: 1.5, step: 0.1, value: 0.5, fmt: v => `1 ciclo a cada ${n(1 / v, 1)} s`, on: v => { S.slow = v; } });
    function wire(x0, y0, w, label, sub, ac, t) {
      D.rr(ctx, x0, y0, w, 150, 12); ctx.fillStyle = '#121a28'; ctx.fill();
      D.text(ctx, label, x0 + w / 2, y0 + 20, { size: 15, weight: 800 }); D.text(ctx, sub, x0 + w / 2, y0 + 40, { size: 12, color: C.muted });
      ctx.fillStyle = '#d38c4f'; ctx.fillRect(x0 + 20, y0 + 80, w - 40, 22);
      const disp = ac ? Math.sin(TAU * S.slow * t) * 26 : (t * 40) % 34;
      for (let i = 0; i < 11; i++) { let x = x0 + 26 + i * 34 + disp; if (!ac) x = x0 + 26 + ((i * 34 + disp) % (w - 52)); D.circle(ctx, x, y0 + 91, 6, '#7dd3fc', '#e0f2fe', 1); }
      const v = ac ? Math.cos(TAU * S.slow * t) : 1;
      D.arrow(ctx, x0 + w / 2 - 50 * Math.sign(v || 1), y0 + 125, x0 + w / 2 + 50 * Math.sign(v || 1), y0 + 125, ac ? '#f59e0b' : '#4ade80', 3, 10);
      D.text(ctx, ac ? (v > 0 ? 'indo →' : '← voltando') : 'sempre no mesmo sentido →', x0 + w / 2, y0 + 140, { size: 11.5, color: C.muted });
    }
    function graph(x0, y0, w, hh, ac, t) {
      ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0 + hh / 2); ctx.lineTo(x0 + w, y0 + hh / 2); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + hh); ctx.stroke();
      ctx.strokeStyle = ac ? '#f59e0b' : '#4ade80'; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i <= w; i += 2) { const tt = t - (w - i) / w * 3; const v = ac ? Math.sin(TAU * S.slow * tt) : 0.7; const y = y0 + hh / 2 - v * hh * 0.42; i ? ctx.lineTo(x0 + i, y) : ctx.moveTo(x0 + i, y); }
      ctx.stroke(); D.text(ctx, 'corrente', x0 + 4, y0 + 6, { size: 11, color: C.muted, align: 'left' }); D.text(ctx, 'tempo →', x0 + w - 4, y0 + hh / 2 + 12, { size: 11, color: C.muted, align: 'right' });
    }
    AU.loop((dt, t) => {
      c.clear('#0b1220');
      wire(15, 10, 375, '🔋 Pilha / bateria: CC', 'corrente contínua', false, t);
      wire(410, 10, 375, '🔌 Tomada: CA', `corrente alternada · ${S.f} Hz = ${S.f} ciclos por segundo`, true, t);
      graph(25, 180, 355, 130, false, t); graph(420, 180, 355, 130, true, t);
    });

    const gs = h('div', 'au-sec', '<h3>⚙️ Gerador: indução eletromagnética</h3><p class="au-sub">Gire o ímã dentro da bobina (controle de velocidade ou arraste o ímã). O campo magnético variando “empurra” os elétrons da bobina: surge uma corrente <b>alternada</b>.</p>'); el.appendChild(gs);
    const g = AU.canvas(gs, 800, 300), gx = g.ctx;
    const sp = AU.slider(gs, { label: 'Velocidade de giro', min: 0, max: 3, step: 0.1, value: 1.2, fmt: v => v === 0 ? 'parado' : n(v, 1) + ' voltas/s (câmera lenta)', on: v => { S.gw = v; } });
    let dragA = null;
    AU.drag(g, {
      down: p => { if (Math.hypot(p.x - 190, p.y - 150) < 90) { dragA = Math.atan2(p.y - 150, p.x - 190); S.gw = 0; sp.set(0); return true; } return false; },
      move: p => { const a = Math.atan2(p.y - 150, p.x - 190); let d = a - dragA; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; S.gθ += d; S.dθ = d; dragA = a; },
      up: () => { dragA = null; },
    });
    const rr = AU.row(gs);
    ['🏞️ Hidrelétrica: a água em queda gira a turbina', '🏭 Termelétrica e nuclear: o vapor gira a turbina', '🌬️ Eólica: o vento gira as pás', '🚲 Dínamo de bicicleta: a roda gira o ímã'].forEach(t => rr.appendChild(h('span', 'au-chip', t)));
    AU.loop(dt => {
      const w = dragA != null ? (S.dθ || 0) / Math.max(dt, 1e-3) / TAU : S.gw;
      if (dragA == null) S.gθ += TAU * S.gw * dt; S.dθ = 0;
      const emf = Math.cos(S.gθ) * w * 2 * Math.PI * 0.25;
      S.hist.push(emf); if (S.hist.length > 360) S.hist.shift();
      g.clear('#0b1220');
      // bobina
      gx.strokeStyle = '#d38c4f'; gx.lineWidth = 5;
      for (let i = 0; i < 6; i++) { gx.beginPath(); gx.ellipse(190, 150, 20, 95, 0, Math.PI / 2, Math.PI * 1.5); gx.stroke(); }
      [-28, -14, 0, 14, 28].forEach(dx => { gx.beginPath(); gx.ellipse(190 + dx + 105, 150, 10, 95, 0, -Math.PI / 2, Math.PI / 2); gx.stroke(); });
      // ímã girando
      gx.save(); gx.translate(190, 150); gx.rotate(S.gθ);
      gx.fillStyle = '#dc2626'; gx.fillRect(0, -16, 70, 32); gx.fillStyle = '#2563eb'; gx.fillRect(-70, -16, 70, 32);
      D.text(gx, 'N', 50, 0, { size: 16, weight: 800, color: '#fff' }); D.text(gx, 'S', -50, 0, { size: 16, weight: 800, color: '#fff' });
      gx.restore(); D.circle(gx, 190, 150, 5, '#e2e8f0');
      // fios até a lâmpada e o medidor
      gx.strokeStyle = '#d38c4f'; gx.lineWidth = 3; gx.beginPath(); gx.moveTo(300, 60); gx.lineTo(420, 60); gx.lineTo(420, 110); gx.moveTo(300, 240); gx.lineTo(420, 240); gx.lineTo(420, 190); gx.stroke();
      D.bulb(gx, 420, 150, Math.min(1.2, Math.abs(emf) / 2), 24);
      // galvanômetro
      D.circle(gx, 520, 150, 48, '#121a28', '#94a3b8', 2);
      const a = -Math.PI / 2 + AU.clamp(emf / 4, -1, 1) * 1.1; gx.strokeStyle = '#f87171'; gx.lineWidth = 3; gx.beginPath(); gx.moveTo(520, 170); gx.lineTo(520 + Math.cos(a) * 40, 170 + Math.sin(a) * 40); gx.stroke();
      D.text(gx, '−   0   +', 520, 120, { size: 12, color: C.muted }); D.text(gx, 'medidor', 520, 212, { size: 12, color: C.muted });
      // gráfico
      const x0 = 590, y0 = 40, W = 200, H = 220;
      gx.strokeStyle = 'rgba(255,255,255,.2)'; gx.lineWidth = 1; gx.beginPath(); gx.moveTo(x0, y0 + H / 2); gx.lineTo(x0 + W, y0 + H / 2); gx.stroke();
      gx.strokeStyle = '#f59e0b'; gx.lineWidth = 2.5; gx.beginPath();
      S.hist.forEach((v, i) => { const x = x0 + i / 360 * W, y = y0 + H / 2 - AU.clamp(v / 5, -1, 1) * H * 0.45; i ? gx.lineTo(x, y) : gx.moveTo(x, y); }); gx.stroke();
      D.text(gx, 'tensão gerada', x0 + W / 2, 24, { size: 12, color: C.muted });
      D.text(gx, Math.abs(w) < 0.05 ? 'Parado: sem variação do campo, sem corrente!' : 'Mais rápido → onda mais alta e mais ondas por segundo', 400, 285, { size: 13, color: C.yellow });
    });

    const ts = h('div', 'au-sec', '<h3>📋 Comparando</h3>'); el.appendChild(ts);
    ts.insertAdjacentHTML('beforeend', `<div class="au-scroll"><table class="au-tbl"><thead><tr><th></th><th>Corrente contínua (CC)</th><th>Corrente alternada (CA)</th></tr></thead><tbody>
      <tr><td><b>Sentido</b></td><td>Sempre o mesmo</td><td>Inverte muitas vezes por segundo (60 Hz no Brasil)</td></tr>
      <tr><td><b>De onde vem</b></td><td>Pilhas, baterias, painéis solares, carregadores</td><td>Geradores das usinas (indução eletromagnética)</td></tr>
      <tr><td><b>Vantagens</b></td><td>Energia estável, ideal para eletrônicos; eficiente em curtas distâncias</td><td>Fácil de transformar a tensão; menor perda em longas distâncias</td></tr>
      <tr><td><b>Desvantagens</b></td><td>Perde eficiência em longas distâncias; difícil mudar a tensão</td><td>Precisa de transformadores; não pode ser guardada em baterias diretamente</td></tr>
      <tr><td><b>Usos</b></td><td>Celulares, notebooks, controles remotos, carros</td><td>Tomadas das casas, motores das fábricas, redes de distribuição</td></tr></tbody></table></div>`);
    AU.note(ts, '🔌 O <b>carregador</b> do celular transforma a CA da tomada em CC para a bateria.');
  };
})();
