/* Laboratórios das aulas 1 a 4: energia e suas fontes */
(function () {
  'use strict';
  const AU = window.AU, h = AU.h, D = AU.D, C = AU.C, n = AU.n;

  /* ================= Aula 1 · Caça às energias ================= */
  AU.labs.tipos = el => {
    el.innerHTML = `<h3>🔎 Caça às energias</h3><p class="au-sub">Clique num item e depois nas formas de energia que aparecem nele. Muitos itens têm <b>mais de uma</b> resposta: encontre todas!</p>`;
    const TIPOS = [['cin', '🏃 Cinética'], ['pot', '⛰️ Potencial'], ['ele', '⚡ Elétrica'], ['ter', '🔥 Térmica'], ['lum', '💡 Luminosa'], ['son', '🔊 Sonora'], ['qui', '🧪 Química'], ['nuc', '☢️ Nuclear']];
    const ITENS = [
      { em: '🚴', t: 'Ciclista pedalando', ok: ['cin', 'qui'], why: 'Em movimento, tem energia <b>cinética</b>. Os músculos usam a energia <b>química</b> dos alimentos.' },
      { em: '🎢', t: 'Carrinho parado no alto da montanha-russa', ok: ['pot'], why: 'Parado no alto, tem energia <b>potencial gravitacional</b>, que vira cinética na descida.' },
      { em: '🔋', t: 'Pilha', ok: ['qui'], why: 'Guarda energia <b>química</b>, que vira energia elétrica quando o circuito é fechado.' },
      { em: '🌩️', t: 'Relâmpago', ok: ['ele', 'lum', 'son', 'ter'], why: 'Uma descarga <b>elétrica</b> enorme que produz luz (<b>luminosa</b>), o trovão (<b>sonora</b>) e aquece muito o ar (<b>térmica</b>).' },
      { em: '🔥', t: 'Fogueira', ok: ['ter', 'lum', 'qui'], why: 'A energia <b>química</b> da lenha é liberada como <b>térmica</b> (calor) e <b>luminosa</b>.' },
      { em: '💡', t: 'Lâmpada acesa', ok: ['lum', 'ele', 'ter'], why: 'Recebe energia <b>elétrica</b> e a transforma em <b>luminosa</b> e um pouco de <b>térmica</b>.' },
      { em: '🔊', t: 'Caixa de som tocando', ok: ['son', 'ele'], why: 'Transforma energia <b>elétrica</b> em <b>sonora</b>: o alto-falante faz o ar vibrar.' },
      { em: '🏭', t: 'Usina nuclear', ok: ['nuc', 'ter', 'ele'], why: 'A fissão do urânio libera energia <b>nuclear</b>, que aquece a água (<b>térmica</b>); o vapor gira a turbina e gera energia <b>elétrica</b>.' },
      { em: '🍎', t: 'Maçã', ok: ['qui'], why: 'Os alimentos guardam energia <b>química</b>, liberada na digestão.' },
      { em: '🏹', t: 'Arco esticado', ok: ['pot'], why: 'Energia <b>potencial elástica</b>: está armazenada na deformação do arco.' },
      { em: '☀️', t: 'Sol', ok: ['nuc', 'lum', 'ter'], why: 'No núcleo do Sol, a <b>fusão nuclear</b> libera energia que chega até nós como <b>luz</b> e <b>calor</b>.' },
      { em: '🛹', t: 'Skatista descendo a rampa', ok: ['cin', 'pot'], why: 'Descendo, a energia <b>potencial</b> vira <b>cinética</b>: a soma das duas é a energia mecânica.' },
    ];
    const found = ITENS.map(() => new Set());
    let cur = 0;
    const grid = h('div', 'au-cards'); el.appendChild(grid);
    const det = h('div', 'au-box'); det.style.marginTop = '10px'; el.appendChild(det);
    const prog = h('p', 'au-sub'); el.appendChild(prog);
    const ctl = AU.row(el);
    AU.btn(ctl, '👁 Mostrar todas as respostas', () => { ITENS.forEach((it, i) => it.ok.forEach(k => found[i].add(k))); render(); });
    AU.btn(ctl, '↺ Recomeçar', () => { found.forEach(s => s.clear()); cur = 0; render(); });
    const complete = i => ITENS[i].ok.every(k => found[i].has(k));
    function render() {
      grid.innerHTML = ITENS.map((it, i) => `<button class="au-card ${i === cur ? 'on' : ''} ${complete(i) ? 'good' : ''}" data-i="${i}"><span class="em">${it.em}</span>${it.t}${complete(i) ? ' ✓' : ''}</button>`).join('');
      const it = ITENS[cur];
      det.innerHTML = `<div style="display:flex;gap:10px;align-items:center"><span style="font-size:38px">${it.em}</span><div><b style="font-size:16px">${it.t}</b><div class="au-sub" style="margin:2px 0 0">Encontradas: ${found[cur].size} de ${it.ok.length}</div></div></div>
        <div class="au-row">${TIPOS.map(([k, l]) => `<button class="au-b ${found[cur].has(k) ? 'ok' : ''}" data-k="${k}">${l}</button>`).join('')}</div>
        <div class="au-fb ${complete(cur) ? 'ok' : ''}">${complete(cur) ? '✓ ' + it.why : 'Escolha as formas de energia presentes neste item.'}</div>`;
      prog.innerHTML = `Itens completos: <b>${ITENS.filter((_, i) => complete(i)).length}</b> de ${ITENS.length}`;
    }
    grid.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) { cur = +b.dataset.i; render(); } });
    det.addEventListener('click', e => {
      const b = e.target.closest('[data-k]'); if (!b) return;
      const k = b.dataset.k, it = ITENS[cur];
      if (it.ok.includes(k)) { found[cur].add(k); render(); if (complete(cur)) { const nx = ITENS.findIndex((_, i) => !complete(i)); if (nx < 0) AU.toast('🎉 Você encontrou todas as energias!'); } }
      else { b.classList.add('bad'); const fb = det.querySelector('.au-fb'); fb.className = 'au-fb bad'; fb.innerHTML = '✗ Essa forma de energia não é a principal aqui. Pense no que o item faz.'; }
    });
    render();
  };

  /* ================= Aula 2 · Renováveis × não renováveis ================= */
  AU.labs.fontes = el => {
    el.innerHTML = `<h3>🌎 Classifique as fontes de energia</h3><p class="au-sub">Clique numa fonte (ou arraste) e depois na caixa certa.</p>`;
    const items = [
      { id: 'sol', label: '☀️ Sol', ok: 'r', why: 'A luz do Sol chega todos os dias: fonte <b>renovável</b> (energia solar).' },
      { id: 'vento', label: '🌬️ Vento', ok: 'r', why: 'Os ventos se renovam continuamente: energia <b>eólica</b>.' },
      { id: 'rio', label: '🏞️ Água dos rios', ok: 'r', why: 'O ciclo da água repõe os rios: energia <b>hidráulica</b>, base das hidrelétricas.' },
      { id: 'cana', label: '🌾 Bagaço de cana', ok: 'r', why: 'É <b>biomassa</b>: a planta cresce de novo em pouco tempo. Também origina o etanol.' },
      { id: 'lenha', label: '🌲 Lenha de reflorestamento', ok: 'r', why: 'Biomassa: renovável quando as árvores são replantadas.' },
      { id: 'geo', label: '🌋 Calor do interior da Terra', ok: 'r', why: 'Energia <b>geotérmica</b>: o calor interno da Terra não se esgota na escala humana.' },
      { id: 'mare', label: '🌊 Ondas e marés', ok: 'r', why: 'Movidas pela Lua e pelo vento: renováveis.' },
      { id: 'biogas', label: '♻️ Biogás de resíduos', ok: 'r', why: 'Produzido pela decomposição de lixo orgânico e esterco: renovável.' },
      { id: 'petro', label: '🛢️ Petróleo', ok: 'n', why: 'Formou-se em milhões de anos: <b>não renovável</b>. Origina gasolina, diesel e plásticos.' },
      { id: 'carvao', label: '⚫ Carvão mineral', ok: 'n', why: 'Combustível fóssil: <b>não renovável</b> e muito poluente.' },
      { id: 'gas', label: '🔥 Gás natural', ok: 'n', why: 'Combustível fóssil: <b>não renovável</b>, usado em termelétricas e no fogão (GNV, gás encanado).' },
      { id: 'uranio', label: '☢️ Urânio', ok: 'n', why: 'Minério usado nas usinas nucleares: as reservas se esgotam, então é <b>não renovável</b> (embora não emita CO₂).' },
    ];
    const s = AU.sorter(el, { bins: [['r', '♻️ Renováveis', 'g'], ['n', '⛽ Não renováveis', 'r']], items });
    AU.btn(AU.row(el), '👁 Mostrar respostas', () => s.reveal());

    const sec = h('div', 'au-sec', `<h3>📊 O Brasil em números (EPE, ano-base 2024)</h3><p class="au-sub">A <b>matriz energética</b> é toda a energia usada no país (transporte, indústria, casas). A <b>matriz elétrica</b> é só a usada para gerar eletricidade.</p>`);
    el.appendChild(sec);
    const bars = [['Matriz energética: fontes renováveis', 50, '#4ade80', 'cerca de metade'], ['Matriz elétrica: fontes renováveis', 86.8, '#38bdf8', '86,8%'],
      ['Petróleo e derivados (energética)', 34, '#94a3b8', '≈ 34%'], ['Derivados da cana (energética)', 16.7, '#a3e635', '16,7%'], ['Energia solar (energética)', 2.2, '#fde047', '2,2%']];
    sec.insertAdjacentHTML('beforeend', bars.map(([t, v, c, l]) => `<div style="margin:6px 0"><div style="display:flex;justify-content:space-between;font-size:13px"><span>${t}</span><b>${l}</b></div>
      <div style="height:12px;background:#1b2435;border-radius:6px;overflow:hidden"><i style="display:block;height:100%;width:${v}%;background:${c}"></i></div></div>`).join(''));
    AU.note(sec, 'Por que a matriz elétrica é tão mais renovável? Porque nossa eletricidade vem principalmente das <b>hidrelétricas</b>, enquanto carros, caminhões e indústrias ainda usam muito <b>petróleo</b>.');
  };

  /* ================= Aula 3 · Pista de skate: conservação da energia ================= */
  AU.labs.pista = el => {
    el.innerHTML = `<h3>🛹 Pista de skate: a energia se conserva</h3><p class="au-sub">Arraste o skatista para qualquer ponto da pista e solte. Observe as barras: a energia muda de forma, mas o <b>total</b> continua igual.</p>`;
    const c = AU.canvas(el, 800, 420), ctx = c.ctx;
    const m0 = 60, g = 10;
    const TR = {
      u: { t: 'Pista em U', f: x => 0.2 * x * x },
      m: { t: 'Montanha-russa', f: x => 0.17 * x * x + 2.2 * Math.exp(-x * x) },
      r: { t: 'Rampa e plano', f: x => x < -1 ? 0.45 * (x + 1) * (x + 1) : x > 3 ? 0.6 * (x - 3) * (x - 3) : 0 },
    };
    const S = { tr: 'u', x: -4.5, v: 0, E0: 0, k: 0, m: m0, run: true, drag: false, speed: 1 };
    const hf = x => TR[S.tr].f(x);
    const hp = x => (hf(x + 1e-3) - hf(x - 1e-3)) / 2e-3;
    const XM = 5.5, X = x => 290 + x * 50, Y = hh => 385 - hh * 50, toX = px => (px - 290) / 50;
    const reset = x => { S.x = x; S.v = 0; S.E0 = S.m * g * hf(x); };
    reset(-4.5);
    const ctl = h('div', 'au-ctl'); el.appendChild(ctl);
    const rowA = AU.row(el);
    AU.seg(rowA, Object.entries(TR).map(([k, v]) => [k, v.t]), 'u', v => { S.tr = v; reset(-4.5); });
    const play = AU.btn(rowA, '⏸ Pausar', () => { S.run = !S.run; play.textContent = S.run ? '⏸ Pausar' : '▶ Continuar'; });
    AU.btn(rowA, '↺ Soltar do alto', () => reset(-4.5));
    AU.slider(ctl, { label: 'Atrito', min: 0, max: 1, step: 0.05, value: 0, fmt: v => v === 0 ? 'sem atrito' : v < 0.35 ? 'pouco' : v < 0.7 ? 'médio' : 'muito', on: v => { S.k = v * 0.6; } });
    AU.slider(ctl, { label: 'Massa do skatista', min: 30, max: 90, step: 5, value: 60, fmt: v => v + ' kg', on: v => { const r = v / S.m; S.m = v; S.E0 *= r; } });
    AU.slider(ctl, { label: 'Câmera lenta', min: 0.2, max: 1, step: 0.1, value: 1, fmt: v => v === 1 ? 'normal' : n(v, 1) + '×', on: v => { S.speed = v; } });
    AU.note(el, '💡 Sem atrito, o skatista sempre volta à mesma altura de onde saiu. Com atrito, a barra <b style="color:#f59e0b">térmica</b> cresce: a energia não some, ela aquece as rodas, a pista e o ar (e vira som).');

    AU.drag(c, {
      down: p => { const sx = X(S.x), sy = Y(hf(S.x)); if (Math.hypot(p.x - sx, p.y - sy + 20) < 45 || (p.x < 590 && Math.abs(p.y - Y(hf(AU.clamp(toX(p.x), -XM, XM)))) < 40)) { S.drag = true; S.x = AU.clamp(toX(p.x), -XM, XM); S.v = 0; return true; } return false; },
      move: p => { S.x = AU.clamp(toX(p.x), -XM, XM); S.v = 0; S.E0 = S.m * g * hf(S.x); },
      up: () => { S.drag = false; reset(S.x); },
    });

    function step(dt) {
      if (S.drag || !S.run) return;
      const N = 40, ds = dt * S.speed / N;
      for (let i = 0; i < N; i++) {
        const d = hp(S.x), s = Math.sqrt(1 + d * d);
        S.v += (-g * d / s - S.k * S.v) * ds;
        S.x += S.v / s * ds;
        if (S.x < -XM) { S.x = -XM; S.v = Math.abs(S.v) * 0.3; }
        if (S.x > XM) { S.x = XM; S.v = -Math.abs(S.v) * 0.3; }
      }
      if (S.k === 0) { // corrige o pequeno erro numérico: a energia se conserva
        const e = 2 * (S.E0 / S.m - g * hf(S.x));
        if (Math.abs(S.v) > 0.05) S.v = Math.sign(S.v) * Math.sqrt(Math.max(0, e));
      } else if (Math.abs(S.v) < 0.03 && Math.abs(hp(S.x)) < 0.05) S.v = 0;
    }
    function draw() {
      c.clear('#0b1220');
      const sky = ctx.createLinearGradient(0, 0, 0, 420); sky.addColorStop(0, '#13213a'); sky.addColorStop(1, '#0b1220'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 600, 420);
      for (let k = 0; k <= 7; k++) { ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(10, Y(k)); ctx.lineTo(590, Y(k)); ctx.stroke(); D.text(ctx, k + ' m', 22, Y(k) - 8, { size: 11, color: C.muted, align: 'left' }); }
      // pista
      ctx.beginPath(); ctx.moveTo(X(-XM), 420);
      for (let x = -XM; x <= XM + 1e-9; x += 0.05) ctx.lineTo(X(x), Y(hf(x)));
      ctx.lineTo(X(XM), 420); ctx.closePath(); ctx.fillStyle = '#1e293b'; ctx.fill();
      ctx.beginPath(); for (let x = -XM; x <= XM + 1e-9; x += 0.05) { const px = X(x), py = Y(hf(x)); x === -XM ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 5; ctx.stroke();
      // linha da altura inicial
      const h0 = S.E0 / (S.m * g);
      ctx.setLineDash([6, 6]); ctx.strokeStyle = 'rgba(56,189,248,.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(30, Y(h0)); ctx.lineTo(590, Y(h0)); ctx.stroke(); ctx.setLineDash([]);
      D.text(ctx, 'altura de partida', 588, Y(h0) - 9, { size: 11, color: '#7dd3fc', align: 'right' });
      // skatista
      const px = X(S.x), py = Y(hf(S.x)), a = Math.atan(hp(S.x));
      ctx.save(); ctx.translate(px, py); ctx.rotate(-a);
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(-20, -8, 40, 6); D.circle(ctx, -12, -1, 4, '#e2e8f0'); D.circle(ctx, 12, -1, 4, '#e2e8f0');
      ctx.strokeStyle = '#e6ecf5'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-7, -9); ctx.lineTo(0, -28); ctx.lineTo(7, -9); ctx.moveTo(0, -28); ctx.lineTo(0, -46); ctx.moveTo(-12, -38); ctx.lineTo(12, -40); ctx.stroke();
      D.circle(ctx, 0, -54, 8, '#fbbf24');
      ctx.restore();
      if (!S.drag && S.v === 0 && S.k > 0 && Math.abs(hp(S.x)) < 0.05) D.text(ctx, 'Parou: toda a energia mecânica virou térmica e sonora', 300, 30, { size: 14, color: C.yellow });
      // barras de energia
      const Ep = S.m * g * hf(S.x), Ec = 0.5 * S.m * S.v * S.v, Et = Math.max(0, S.E0 - Ep - Ec);
      const max = S.m * g * 6.2, bx = 615, bw = 38, base = 360, H = 290;
      ctx.fillStyle = '#121a28'; ctx.fillRect(600, 0, 200, 420);
      D.text(ctx, 'Energia (kJ)', 700, 22, { size: 13, color: C.muted });
      [['Potencial', Ep, '#38bdf8'], ['Cinética', Ec, '#4ade80'], ['Térmica', Et, '#f59e0b'], ['Total', S.E0, '#e6ecf5']].forEach(([t, v, col], i) => {
        const x = bx + i * 45, hh = Math.min(H, v / max * H);
        ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(x, base - H, bw, H);
        if (i < 3) { ctx.fillStyle = col; ctx.fillRect(x, base - hh, bw, hh); }
        else { // total = pilha das três
          let y = base;[[Ep, '#38bdf8'], [Ec, '#4ade80'], [Et, '#f59e0b']].forEach(([vv, cc]) => { const q = Math.min(H, vv / max * H); ctx.fillStyle = cc; ctx.fillRect(x, y - q, bw, q); y -= q; });
          ctx.strokeStyle = '#e6ecf5'; ctx.lineWidth = 2; ctx.strokeRect(x, base - hh, bw, hh);
        }
        D.text(ctx, n(v / 1000, 2), x + bw / 2, base - hh - 10, { size: 11, color: col });
        D.text(ctx, t, x + bw / 2, base + 16 + (i % 2) * 14, { size: 11, color: col });
      });
      D.text(ctx, `altura ${n(hf(S.x), 1)} m · velocidade ${n(Math.abs(S.v) * 3.6, 0)} km/h`, 700, 405, { size: 11.5, color: C.muted });
    }
    AU.loop(dt => { step(dt); draw(); });

    /* Exemplos de transformações */
    const sec = h('div', 'au-sec', '<h3>🔁 Transformações no dia a dia</h3><p class="au-sub">Clique num exemplo para ver a cadeia de transformações.</p>'); el.appendChild(sec);
    const EX = [
      ['🏞️ Hidrelétrica', ['Potencial (água no alto)', 'Cinética (água descendo)', 'Cinética (turbina girando)', 'Elétrica']],
      ['📺 Televisão', ['Elétrica', 'Luminosa + Sonora + Térmica']],
      ['🚗 Carro freando', ['Cinética', 'Térmica (freios quentes) + Sonora']],
      ['🏀 Jogando basquete', ['Química (alimentos)', 'Cinética (músculos) + Térmica + Sonora (fala)']],
      ['☀️ Painel solar', ['Luminosa', 'Elétrica']],
      ['🔋 Pilha na lanterna', ['Química', 'Elétrica', 'Luminosa + Térmica']],
      ['🚌 Ônibus elétrico', ['Elétrica', 'Cinética (motor) + Térmica + Sonora']],
      ['🌱 Fotossíntese', ['Luminosa (Sol)', 'Química (glicose)']],
    ];
    const r = AU.row(sec); const out = h('div', 'au-chain'); sec.appendChild(out);
    EX.forEach(([t, ch], i) => AU.btn(r, t, () => { out.innerHTML = ch.map(s => `<span>${s}</span>`).join('<i>→</i>'); r.querySelectorAll('button').forEach((b, j) => b.classList.toggle('primary', i === j)); }));
    r.querySelector('button').click();
  };

  /* ================= Aula 4 · Matriz elétrica ao longo de um dia ================= */
  AU.labs.matriz = el => {
    el.innerHTML = `<h3>🌬️ Monte a matriz elétrica de uma região</h3><p class="au-sub">Escolha quanto instalar de cada usina e veja se a geração atende ao consumo ao longo das 24 horas do dia. A linha branca é o <b>consumo</b> da cidade.</p>`;
    const c = AU.canvas(el, 800, 360), ctx = c.ctx;
    const SRC = [
      { k: 'bio', t: 'Biomassa', col: '#65a30d', ren: true },
      { k: 'hid', t: 'Hidrelétrica', col: '#2563eb', ren: true },
      { k: 'eol', t: 'Eólica', col: '#14b8a6', ren: true },
      { k: 'sol', t: 'Solar', col: '#facc15', ren: true },
      { k: 'ter', t: 'Termelétrica (gás/carvão)', col: '#78716c', ren: false },
    ];
    const S = { cap: { bio: 10, hid: 70, eol: 20, sol: 15, ter: 25 }, seca: false, calma: false, nublado: false, t: 0 };
    const dem = x => 62 + 14 * Math.sin(Math.PI * (x - 8) / 12) * (x > 8 && x < 20 ? 1 : 0.4) + 26 * Math.exp(-Math.pow((x - 19.5) / 2, 2)) - 8 * Math.exp(-Math.pow((x - 3.5) / 2.5, 2));
    const sun = x => x > 6 && x < 18 ? Math.pow(Math.sin(Math.PI * (x - 6) / 12), 1.3) : 0;
    const wind = x => 0.5 + 0.22 * Math.cos(2 * Math.PI * (x - 2) / 24) + 0.08 * Math.sin(x * 1.7) + 0.05 * Math.sin(x * 4.1);
    function sim() {
      const P = [], tot = { bio: 0, hid: 0, eol: 0, sol: 0, ter: 0, def: 0, dem: 0, sobra: 0 };
      for (let i = 0; i <= 96; i++) {
        const x = i / 4, d = dem(x);
        const sol = S.cap.sol * sun(x) * (S.nublado ? 0.35 : 1), eol = S.cap.eol * wind(x) * (S.calma ? 0.2 : 1), bio = S.cap.bio * 0.85;
        let vr = sol + eol + bio, sobra = 0, f = 1;
        if (vr > d) { sobra = vr - d; f = d / vr; }
        const p = { x, d, bio: bio * f, eol: eol * f, sol: sol * f };
        let rest = Math.max(0, d - vr);
        p.hid = Math.min(S.cap.hid * (S.seca ? 0.4 : 1), rest); rest -= p.hid;
        p.ter = Math.min(S.cap.ter, rest); rest -= p.ter; p.def = rest; p.sobra = sobra;
        P.push(p);
        if (i < 96) { ['bio', 'hid', 'eol', 'sol', 'ter', 'def', 'sobra'].forEach(k => tot[k] += p[k] / 4); tot.dem += d / 4; }
      }
      return { P, tot };
    }
    const X = x => 50 + x * 30, Y = v => 320 - v * 2.6;
    function draw() {
      const { P, tot } = sim();
      c.clear('#0b1220');
      for (let v = 0; v <= 110; v += 20) { ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.beginPath(); ctx.moveTo(50, Y(v)); ctx.lineTo(770, Y(v)); ctx.stroke(); D.text(ctx, v, 40, Y(v), { size: 11, color: C.muted, align: 'right' }); }
      for (let x = 0; x <= 24; x += 3) D.text(ctx, x + 'h', X(x), 338, { size: 11, color: C.muted });
      // faixa dia/noite
      for (let i = 0; i < 96; i++) { const x = i / 4; ctx.fillStyle = sun(x) > 0 ? `rgba(250,204,21,${0.04 + sun(x) * 0.05})` : 'rgba(30,41,59,.35)'; ctx.fillRect(X(x), 18, 7.6, 10); }
      D.text(ctx, '☀', X(12), 12, { size: 12 }); D.text(ctx, '☾', X(1.5), 12, { size: 12, color: '#94a3b8' }); D.text(ctx, '☾', X(22.5), 12, { size: 12, color: '#94a3b8' });
      // áreas empilhadas
      const order = ['bio', 'hid', 'eol', 'sol', 'ter', 'def'];
      const cols = { bio: '#65a30d', hid: '#2563eb', eol: '#14b8a6', sol: '#facc15', ter: '#78716c', def: 'rgba(239,68,68,.75)' };
      const base = P.map(() => 0);
      order.forEach(k => {
        ctx.beginPath(); P.forEach((p, i) => { const y = Y(base[i] + p[k]); i ? ctx.lineTo(X(p.x), y) : ctx.moveTo(X(p.x), y); });
        for (let i = P.length - 1; i >= 0; i--) ctx.lineTo(X(P[i].x), Y(base[i]));
        ctx.closePath(); ctx.fillStyle = cols[k]; ctx.fill();
        P.forEach((p, i) => base[i] += p[k]);
      });
      ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(X(p.x), Y(p.d)) : ctx.moveTo(X(p.x), Y(p.d))); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
      if (tot.def > 0.5) D.text(ctx, '⚠ Faltou energia (apagão) nas faixas vermelhas', 410, 44, { size: 14, color: '#fca5a5' });
      // indicadores
      const served = tot.dem - tot.def, ren = (tot.bio + tot.hid + tot.eol + tot.sol) / Math.max(1, served) * 100, fos = tot.ter / Math.max(1, served) * 100;
      const band = fos < 5 ? ['Verde', 'ok'] : fos < 15 ? ['Amarela', 'warn'] : fos < 30 ? ['Vermelha 1', 'bad'] : ['Vermelha 2', 'bad'];
      R.set('ren', n(ren, 0) + '%', ren > 80 ? 'ok' : ren > 50 ? 'warn' : 'bad');
      R.set('def', tot.def > 0.5 ? n(tot.def / tot.dem * 100, 1) + '% do dia' : 'nenhuma', tot.def > 0.5 ? 'bad' : 'ok');
      R.set('co2', fos < 1 ? 'quase zero' : fos < 15 ? 'baixas' : fos < 30 ? 'médias' : 'altas', fos < 15 ? 'ok' : fos < 30 ? 'warn' : 'bad');
      R.set('band', band[0], band[1]);
      R.set('sobra', tot.sobra > 1 ? n(tot.sobra / tot.dem * 100, 0) + '% desperdiçada' : '—', tot.sobra > 1 ? 'warn' : '');
    }
    const leg = h('div', 'au-row', SRC.map(s => `<span class="au-chip" style="border-color:${s.col}"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${s.col};margin-right:5px"></i>${s.t}</span>`).join('') + '<span class="au-chip" style="border-color:#ef4444">🟥 Falta de energia</span><span class="au-chip">⬜ Consumo</span>');
    el.appendChild(leg);
    const R = AU.readouts(el, [['ren', 'Energia renovável'], ['def', 'Falta de energia'], ['co2', 'Emissões de CO₂'], ['band', 'Bandeira provável'], ['sobra', 'Sobra de solar/eólica']]);
    const ctl = h('div', 'au-ctl'); el.appendChild(ctl);
    const sl = {};
    SRC.forEach(s => { sl[s.k] = AU.slider(ctl, { label: s.t, min: 0, max: 100, step: 5, value: S.cap[s.k], fmt: v => v + ' un.', on: v => { S.cap[s.k] = v; draw(); } }); });
    const r2 = AU.row(el);
    const tog = (lab, key) => { const b = AU.btn(r2, lab, () => { S[key] = !S[key]; b.classList.toggle('warn', S[key]); draw(); }); return b; };
    tog('🏜️ Estação seca (reservatórios baixos)', 'seca'); tog('🍃 Dia sem vento', 'calma'); tog('☁️ Dia nublado', 'nublado');
    const r3 = AU.row(el);
    const PRE = {
      '🇧🇷 Parecida com o Brasil': { bio: 10, hid: 70, eol: 20, sol: 15, ter: 25 },
      '☀️ Só solar': { bio: 0, hid: 0, eol: 0, sol: 100, ter: 0 },
      '☀️🌬️ Solar + eólica': { bio: 0, hid: 0, eol: 60, sol: 70, ter: 0 },
      '🏭 Só termelétricas': { bio: 0, hid: 0, eol: 0, sol: 0, ter: 100 },
    };
    Object.entries(PRE).forEach(([t, v]) => AU.btn(r3, t, () => { Object.assign(S.cap, v); Object.entries(v).forEach(([k, x]) => sl[k].set(x)); draw(); }));
    c.onresize = draw; draw();

    const sec = h('div', 'au-sec', '<h3>⚖️ Prós e contras de cada fonte</h3>'); el.appendChild(sec);
    const PC = [
      ['☀️ Solar', 'Não emite poluentes ao gerar; painéis podem ficar em telhados, terrenos e até sobre represas (usina flutuante Araucária, na Billings).', 'Só gera de dia e menos com nuvens; precisa de baterias ou outras fontes à noite; o descarte dos painéis exige cuidado.'],
      ['🌬️ Eólica', 'Não emite poluentes; o Nordeste brasileiro tem ventos fortes e constantes.', 'Depende do vento; ruído e impacto sobre aves; muda a paisagem.'],
      ['🏞️ Hidrelétrica', 'Renovável e barata; o reservatório guarda energia para usar quando precisar.', 'Alaga grandes áreas, desloca comunidades e afeta peixes; gera menos nas secas.'],
      ['🌾 Biomassa', 'Aproveita resíduos (bagaço de cana, lenha de reflorestamento, biogás); renovável.', 'A queima emite gases e partículas; pode competir com áreas de alimentos.'],
      ['🏭 Termelétrica fóssil', 'Pode ser ligada a qualquer hora; garante o abastecimento nas emergências.', 'Queima combustíveis não renováveis, emite CO₂ (efeito estufa) e é mais cara: aciona as bandeiras tarifárias.'],
      ['💧 Hidrogênio verde', 'Produzido com energia renovável; ao ser usado só gera água; o Brasil pesquisa e investe nessa tecnologia.', 'Ainda é caro e difícil de armazenar e transportar.'],
    ];
    sec.insertAdjacentHTML('beforeend', `<div class="au-scroll"><table class="au-tbl"><thead><tr><th>Fonte</th><th>✅ Prós</th><th>⚠️ Contras</th></tr></thead><tbody>${PC.map(([a, b, c2]) => `<tr><td><b>${a}</b></td><td>${b}</td><td>${c2}</td></tr>`).join('')}</tbody></table></div>`);
    AU.note(sec, '<b>ODS 7 · Energia limpa e acessível:</b> garantir acesso a energia confiável, sustentável e moderna para todos. Ainda há comunidades no Brasil, como na Amazônia, sem acesso regular à eletricidade.');
  };
})();
