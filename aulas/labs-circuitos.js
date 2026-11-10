/* Laboratórios das aulas 10 a 16: materiais, distribuição e circuitos elétricos */
(function () {
  'use strict';
  const AU = window.AU, h = AU.h, D = AU.D, C = AU.C, n = AU.n;
  const TAU = Math.PI * 2;

  /* Bolinhas de corrente andando sobre segmentos: segs = [{pts:[[x,y],...], I}] */
  function flowDots(ctx, segs, st, dt, col = '#7dd3fc') {
    segs.forEach((s, k) => {
      if (Math.abs(s.I) < 1e-6) return;
      const v = (18 + 55 * Math.log10(1 + Math.abs(s.I) * 10)) * Math.sign(s.I);
      st[k] = ((st[k] || 0) + v * dt) % 28; if (st[k] < 0) st[k] += 28;
      let off = st[k];
      for (let i = 0; i < s.pts.length - 1; i++) {
        const [x0, y0] = s.pts[i], [x1, y1] = s.pts[i + 1], L = Math.hypot(x1 - x0, y1 - y0);
        for (let d = off; d < L; d += 28) D.circle(ctx, x0 + (x1 - x0) * d / L, y0 + (y1 - y0) * d / L, 3.8, col);
        off = (off - L % 28 + 28) % 28;
      }
    });
  }
  function resistorBox(ctx, x, y, vertical, label, sub, broken, heat = 0) {
    ctx.save(); ctx.translate(x, y); if (vertical) ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#0b1220'; ctx.fillRect(-48, -18, 96, 36);
    D.rr(ctx, -40, -14, 80, 28, 7); ctx.fillStyle = broken ? '#3f3a36' : `rgb(${216 + 39 * heat},${194 - 80 * heat},${154 - 110 * heat})`; ctx.fill();
    if (broken) { ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-12, -10); ctx.lineTo(12, 10); ctx.moveTo(12, -10); ctx.lineTo(-12, 10); ctx.stroke(); }
    else { ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-32, 0); for (let i = 0; i < 8; i++) ctx.lineTo(-28 + i * 8, i % 2 ? -8 : 8); ctx.lineTo(32, 0); ctx.stroke(); }
    ctx.restore();
    const ox = vertical ? 54 : 0, oy = vertical ? 0 : -30;
    D.text(ctx, label, x + ox, y + oy - (vertical ? 9 : 0), { size: 13, weight: 800, color: '#fde68a', align: vertical ? 'left' : 'center' });
    if (sub) D.text(ctx, sub, x + ox, y + (vertical ? 9 : 34), { size: 12, color: '#bae6fd', align: vertical ? 'left' : 'center' });
  }

  /* ================= Aula 10 · Condutores e isolantes ================= */
  AU.labs.materiais = el => {
    el.innerHTML = `<h3>🧪 Bancada de teste: conduz ou não conduz?</h3><p class="au-sub">Escolha um material para fechar o espaço entre as duas garras. Antes de testar, faça sua <b>previsão</b>!</p>`;
    const MAT = [
      ['cobre', '🟠', 'Fio de cobre', 1, 'c', 'Metal com muitos elétrons livres: ótimo condutor. Por isso os fios são de cobre.'],
      ['aluminio', '🥫', 'Papel-alumínio', 0.95, 'c', 'Metal: condutor. Usado nas linhas de transmissão por ser leve.'],
      ['ouro', '💍', 'Anel de ouro', 0.97, 'c', 'Excelente condutor que não enferruja: usado nos contatos de placas eletrônicas.'],
      ['prata', '🥄', 'Talher de prata', 1, 'c', 'A prata é o metal que melhor conduz eletricidade (mas é cara).'],
      ['ferro', '🔩', 'Prego de ferro', 0.85, 'c', 'Metal: condutor, embora conduza menos que o cobre.'],
      ['grafite', '✏️', 'Grafite do lápis', 0.45, 'c', 'O grafite (carbono) não é metal, mas tem elétrons livres e conduz.'],
      ['salgada', '🧂', 'Água com sal', 0.3, 'c', 'O sal dissolvido forma <b>íons</b> que se movem e conduzem a corrente.'],
      ['torneira', '🚰', 'Água da torneira', 0.05, 'f', 'Tem poucos sais minerais: conduz fracamente. A lâmpada quase não acende, mas o amperímetro detecta corrente, e para o corpo humano já é perigoso!'],
      ['destilada', '⚗️', 'Água destilada', 0, 'i', 'Sem sais minerais, a água pura praticamente não conduz eletricidade.'],
      ['borracha', '🧤', 'Borracha', 0, 'i', 'Isolante: por isso os eletricistas usam luvas e botas de borracha.'],
      ['plastico', '🥤', 'Plástico', 0, 'i', 'Isolante: reveste os fios, tomadas e interruptores.'],
      ['vidro', '🥛', 'Vidro', 0, 'i', 'Isolante: usado nos isoladores das torres de transmissão (junto com a cerâmica).'],
      ['madeira', '🚪', 'Madeira seca', 0, 'i', 'Isolante quando seca. Molhada, pode conduzir!'],
      ['papel', '📄', 'Papel', 0, 'i', 'Isolante.'],
      ['ar', '💨', 'Nada (só ar)', 0, 'i', 'O ar é isolante: com as garras separadas, o circuito fica aberto.'],
    ];
    const S = { m: null, t: 0, tested: {} };
    const c = AU.canvas(el, 800, 330), ctx = c.ctx;
    const pick = h('div', 'au-cards'); pick.style.gridTemplateColumns = 'repeat(auto-fit,minmax(118px,1fr))'; el.appendChild(pick);
    pick.innerHTML = MAT.map((m, i) => `<button class="au-card" data-i="${i}" style="padding:7px"><span class="em" style="font-size:22px">${m[1]}</span>${m[2]}</button>`).join('');
    const fb = AU.note(el, 'Clique num material para colocá-lo entre as garras.');
    const tb = h('div', 'au-sec', '<h3>📋 Resultados</h3><div class="au-two"><div><b style="color:#4ade80">Condutores</b><div id="cdl" class="au-row"></div></div><div><b style="color:#f87171">Isolantes</b><div id="isl" class="au-row"></div></div></div>'); el.appendChild(tb);
    pick.addEventListener('click', e => {
      const b = e.target.closest('[data-i]'); if (!b) return;
      S.m = MAT[+b.dataset.i]; S.tested[S.m[0]] = S.m;
      pick.querySelectorAll('.au-card').forEach(x => x.classList.toggle('on', x === b));
      fb.className = 'au-note ' + (S.m[4] === 'i' ? 'bad' : 'ok'); fb.innerHTML = `<b>${S.m[2]}:</b> ${S.m[4] === 'i' ? 'ISOLANTE' : S.m[4] === 'f' ? 'CONDUTOR FRACO' : 'CONDUTOR'}. ${S.m[5]}`;
      tb.querySelector('#cdl').innerHTML = Object.values(S.tested).filter(m => m[4] !== 'i').map(m => `<span class="au-chip">${m[1]} ${m[2]}</span>`).join('');
      tb.querySelector('#isl').innerHTML = Object.values(S.tested).filter(m => m[4] === 'i').map(m => `<span class="au-chip">${m[1]} ${m[2]}</span>`).join('');
    });
    const atoms = []; for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) atoms.push([590 + i * 34, 112 + j * 34]);
    const free = []; for (let k = 0; k < 18; k++) free.push({ x: 580 + Math.random() * 200, y: 100 + Math.random() * 130, ph: Math.random() * TAU });
    AU.loop((dt, t) => {
      const b = S.m ? S.m[3] : 0, I = 0.45 * b;
      c.clear('#0b1220');
      // circuito
      ctx.strokeStyle = '#d38c4f'; ctx.lineWidth = 5; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(150, 250); ctx.lineTo(70, 250); ctx.lineTo(70, 60); ctx.lineTo(260, 60); ctx.moveTo(320, 60); ctx.lineTo(470, 60); ctx.lineTo(470, 250); ctx.lineTo(370, 250); ctx.moveTo(190, 250); ctx.lineTo(210, 250); ctx.stroke();
      D.bulb(ctx, 290, 64, b * b * 1.1, 22);
      D.battery(ctx, 170, 250, 70, 32, '4,5 V');
      // garras
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(210, 250); ctx.lineTo(250, 250); ctx.moveTo(370, 250); ctx.lineTo(330, 250); ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.fillRect(244, 240, 16, 20); ctx.fillStyle = '#111827'; ctx.fillRect(320, 240, 16, 20);
      if (S.m && S.m[0] !== 'ar') {
        D.rr(ctx, 258, 232, 64, 36, 8);
        ctx.fillStyle = { cobre: '#d38c4f', aluminio: '#cbd5e1', ouro: '#eab308', prata: '#e5e7eb', ferro: '#6b7280', grafite: '#374151', salgada: '#7dd3fc', torneira: '#93c5fd', destilada: '#bfdbfe', borracha: '#1f2937', plastico: '#f472b6', vidro: 'rgba(186,230,253,.5)', madeira: '#a16207', papel: '#f8fafc' }[S.m[0]] || '#888';
        ctx.fill(); D.text(ctx, S.m[1], 290, 251, { size: 20 });
      }
      D.text(ctx, S.m ? S.m[2] : 'escolha um material', 290, 292, { size: 13, color: C.muted });
      // amperímetro
      D.rr(ctx, 380, 120, 80, 50, 8); ctx.fillStyle = '#eab308'; ctx.fill(); D.rr(ctx, 386, 126, 68, 32, 5); ctx.fillStyle = '#08160f'; ctx.fill();
      D.text(ctx, I < 1e-6 ? '0 mA' : n(I * 1000, I < 0.1 ? 0 : 0) + ' mA', 420, 142, { size: 14, color: '#86efac', font: 'monospace', weight: 700 });
      D.text(ctx, 'amperímetro', 420, 182, { size: 11, color: C.muted });
      // zoom nos átomos
      D.rr(ctx, 565, 70, 220, 190, 12); ctx.fillStyle = '#121a28'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.stroke();
      D.text(ctx, '🔍 por dentro do material', 675, 86, { size: 12, color: C.muted });
      const cond = S.m && S.m[4] !== 'i' && S.m[0] !== 'ar';
      atoms.forEach(([x, y]) => D.circle(ctx, x, y, 9, cond ? 'rgba(248,113,113,.55)' : 'rgba(148,163,184,.5)'));
      if (cond) {
        free.forEach(f => { f.x += (25 + 140 * b) * dt; if (f.x > 780) f.x = 572; f.ph += dt * 6; D.circle(ctx, f.x, f.y + Math.sin(f.ph) * 3, 3.5, '#7dd3fc'); });
        D.text(ctx, S.m[0] === 'salgada' || S.m[0] === 'torneira' ? 'íons se movendo' : 'elétrons livres andando', 675, 250, { size: 12, color: '#7dd3fc' });
      } else {
        atoms.forEach(([x, y], i) => { const a = t * 4 + i; D.circle(ctx, x + Math.cos(a) * 13, y + Math.sin(a) * 13, 3, '#7dd3fc'); });
        D.text(ctx, 'elétrons presos aos átomos', 675, 250, { size: 12, color: '#7dd3fc' });
      }
    });
    AU.note(el, '⚠️ <b>Atenção:</b> o corpo humano tem água e sais minerais, por isso <b>conduz</b> eletricidade. Nunca mexa em aparelhos elétricos com as mãos molhadas ou descalço em piso molhado.', 'warn');
  };

  /* ================= Aula 11 · Da usina até a casa ================= */
  AU.labs.rede = el => {
    el.innerHTML = `<h3>🏭 O caminho da energia: da usina até a sua casa</h3><p class="au-sub">Clique em cada etapa para saber o que acontece nela. As cores indicam o nível da tensão.</p>`;
    const USI = {
      hidro: ['🏞️', 'Hidrelétrica', 'A água represada desce pelas tubulações e gira a turbina: potencial → cinética → elétrica. Ex.: Ilha Solteira (SP), a maior do estado.'],
      termo: ['🏭', 'Termelétrica', 'Queima gás natural, carvão ou biomassa (bagaço de cana) para ferver água; o vapor gira a turbina: química → térmica → cinética → elétrica.'],
      nuclear: ['☢️', 'Nuclear', 'A fissão do urânio aquece a água; o vapor gira a turbina: nuclear → térmica → cinética → elétrica. Ex.: Angra 1 e 2 (RJ).'],
      eolica: ['🌬️', 'Eólica', 'O vento gira as pás ligadas ao gerador: cinética → elétrica.'],
      solar: ['☀️', 'Solar fotovoltaica', 'Os painéis transformam luz diretamente em eletricidade, sem turbina. Ex.: usina flutuante Araucária, na represa Billings (SP).'],
    };
    const STG = [
      { x: 70, t: 'Usina', kv: '13,8 kV', col: '#f59e0b', info: () => USI[S.u][2] + ' O gerador produz corrente alternada em cerca de 13 800 V.' },
      { x: 175, t: 'Transformador elevador', kv: '↑ 500 kV', col: '#ef4444', info: () => 'Eleva a tensão para centenas de milhares de volts (138 kV a 765 kV). Com tensão alta, a corrente na linha fica baixa e <b>perde-se menos energia</b> em calor nos fios.' },
      { x: 330, t: 'Linhas de transmissão', kv: '500 kV', col: '#ef4444', info: () => 'Cabos de alumínio presos a torres altas por isoladores de vidro ou cerâmica levam a energia por centenas de quilômetros. Nunca solte pipa perto delas!' },
      { x: 500, t: 'Subestação abaixadora', kv: '↓ 13,8 kV', col: '#a855f7', info: () => 'Perto das cidades, transformadores reduzem a tensão para a rede de distribuição (cerca de 13 800 V).' },
      { x: 610, t: 'Rede de distribuição', kv: '13,8 kV', col: '#a855f7', info: () => 'Os fios dos postes da rua levam a energia pelos bairros.' },
      { x: 690, t: 'Transformador do poste', kv: '↓ 127/220 V', col: '#22c55e', info: () => 'O “barril” no alto do poste abaixa a tensão para 127 V ou 220 V, a tensão das tomadas.' },
      { x: 765, t: 'Casa', kv: '127/220 V', col: '#22c55e', info: () => 'A energia passa pelo <b>medidor</b> (relógio de luz) e pelo <b>quadro de disjuntores</b> e chega às tomadas e lâmpadas.' },
    ];
    const S = { u: 'hidro', sel: 0, ph: 0, kv: 500 };
    const r = AU.row(el);
    AU.seg(r, Object.entries(USI).map(([k, v]) => [k, v[0] + ' ' + v[1]]), 'hidro', v => { S.u = v; showInfo(); });
    const c = AU.canvas(el, 800, 300), ctx = c.ctx;
    const info = AU.note(el, '');
    function showInfo() { const s = STG[S.sel]; info.innerHTML = `<b>${s.t} (${s.kv}):</b> ${s.info()}`; }
    AU.drag(c, { click: p => { let best = 0, bd = 1e9; STG.forEach((s, i) => { const d = Math.abs(p.x - s.x); if (d < bd) { bd = d; best = i; } }); S.sel = best; showInfo(); } });
    function tower(x, y) { ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 14, y + 90); ctx.lineTo(x, y); ctx.lineTo(x + 14, y + 90); ctx.moveTo(x - 20, y + 14); ctx.lineTo(x + 20, y + 14); ctx.moveTo(x - 9, y + 45); ctx.lineTo(x + 9, y + 45); ctx.moveTo(x - 10, y + 30); ctx.lineTo(x + 6, y + 60); ctx.moveTo(x + 10, y + 30); ctx.lineTo(x - 6, y + 60); ctx.stroke(); }
    AU.loop(dt => {
      c.clear('#0b1220');
      ctx.fillStyle = '#14532d'; ctx.fillRect(0, 250, 800, 50);
      const lossF = lossPct() / 100;
      // linhas
      const segs = [[70, 175, 150, '#f59e0b'], [175, 500, 85, '#ef4444'], [500, 690, 150, '#a855f7'], [690, 765, 175, '#22c55e']];
      segs.forEach(([a, b, y, col]) => { ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a, y); if (a === 175) { ctx.quadraticCurveTo(250, y + 30, 330, y); ctx.quadraticCurveTo(415, y + 30, b, y); } else ctx.lineTo(b, y); ctx.stroke(); });
      [250, 330, 415].forEach(x => tower(x, x === 330 ? 80 : 95));
      // pulsos de energia
      S.ph = (S.ph + dt * 0.25) % 1;
      for (let k = 0; k < 6; k++) {
        const u = (S.ph + k / 6) % 1, x = 70 + u * 695;
        const seg = segs.find(([a, b]) => x >= a && x <= b) || segs[0];
        let y = seg[2]; if (seg[0] === 175) { const t = (x - 175) / 325; y = 85 + Math.sin(t * Math.PI * 2) * 12 + 10; }
        const fade = x > 175 && x < 500 ? 1 - lossF * (x - 175) / 325 : x >= 500 ? 1 - lossF : 1;
        if (fade > 0.02) D.glow(ctx, x, y, 16, 'rgba(253,224,71,.9)', Math.max(0, fade));
      }
      if (lossF > 0.02) D.glow(ctx, 330, 100, 170, `rgba(239,68,68,${Math.min(0.45, lossF * 0.6)})`);
      // ícones
      const ic = [USI[S.u][0], '🔺', '', '🏗️', '', '🛢️', '🏠'];
      STG.forEach((s, i) => {
        if (ic[i]) D.text(ctx, ic[i], s.x, i === 0 ? 205 : i === 6 ? 205 : i === 5 ? 160 : 210, { size: i === 0 || i === 6 ? 40 : 30 });
        if (i === 4) { ctx.fillStyle = '#78716c'; ctx.fillRect(606, 150, 8, 100); }
        if (i === 5) { ctx.fillStyle = '#78716c'; ctx.fillRect(686, 150, 8, 100); }
        const on = i === S.sel;
        const lx = Math.min(s.x, 745); D.rr(ctx, lx - 52, 18 + (i % 2) * 34, 104, 30, 8); ctx.fillStyle = on ? 'rgba(56,189,248,.25)' : 'rgba(18,26,40,.9)'; ctx.fill(); ctx.strokeStyle = on ? '#38bdf8' : s.col; ctx.lineWidth = 1.5; ctx.stroke();
        D.text(ctx, s.kv, lx, 33 + (i % 2) * 34, { size: 12, weight: 800, color: s.col });
      });
      D.text(ctx, '👆 clique nas etapas', 400, 285, { size: 12, color: C.muted });
    });
    showInfo();

    const ls = h('div', 'au-sec', '<h3>🔥 Por que elevar a tensão? Experimento das perdas</h3><p class="au-sub">Uma usina envia <b>1 000 MW</b> por uma linha com resistência total de <b>10 Ω</b>. Como P = V × I, quanto <b>maior a tensão</b>, <b>menor a corrente</b>, e a perda em calor nos fios (P = R × I²) cai muito.</p>'); el.appendChild(ls);
    const KV = [13.8, 69, 138, 230, 500, 765];
    const lossPct = () => { const I = 1e9 / (S.kv * 1e3); return Math.min(100, I * I * 10 / 1e9 * 100); };
    const out = h('div'); ls.appendChild(out);
    const sl = AU.slider(ls, { label: 'Tensão da linha de transmissão', min: 0, max: KV.length - 1, step: 1, value: 4, fmt: v => n(KV[v], 1) + ' kV', on: v => { S.kv = KV[v]; upd(); } });
    function upd() {
      const I = 1e9 / (S.kv * 1e3), loss = I * I * 10 / 1e6, p = lossPct();
      out.innerHTML = `<div class="au-read"><div><span>Corrente na linha</span><b>${n(I, 0)} A</b></div><div><span>Perda em calor</span><b class="${p > 30 ? 'bad' : p > 8 ? 'warn' : 'ok'}">${loss > 1000 ? 'mais que tudo!' : n(loss, 0) + ' MW'}</b></div><div><span>Chega às cidades</span><b class="${p > 30 ? 'bad' : 'ok'}">${n(100 - p, 1)}%</b></div></div>
        <div style="height:16px;border-radius:8px;overflow:hidden;background:#1b2435;display:flex"><i style="width:${100 - p}%;background:#22c55e"></i><i style="width:${p}%;background:#ef4444"></i></div>
        <p class="au-sub" style="margin-top:6px">${p >= 100 ? 'Em 13,8 kV a corrente seria tão grande que <b>toda</b> a energia viraria calor nos fios: impossível transmitir!' : p > 30 ? 'Perda enorme: a maior parte da energia esquentaria os fios.' : 'É por isso que as linhas de transmissão usam tensões altíssimas e transformadores nas duas pontas.'}</p>`;
    }
    upd(); void sl;
    AU.note(el, '🇧🇷 Cerca de <b>86,8%</b> da eletricidade gerada no Brasil vem de fontes renováveis (EPE, 2025). O <b>Sistema Interligado Nacional</b> conecta usinas de todo o país por milhares de quilômetros de linhas de transmissão.');
  };

  /* ================= Aula 12 · Componentes do circuito ================= */
  const SYM = {
    pilha: '<path d="M4 16h22M38 16h22M26 4v24M38 10v12"/><path d="M48 4h6M51 1v6"/>',
    fio: '<path d="M4 16h56"/><circle cx="4" cy="16" r="2.5"/><circle cx="60" cy="16" r="2.5"/>',
    resistor: '<path d="M2 16h12l4-9 6 18 6-18 6 18 6-18 4 9h12"/>',
    lampada: '<path d="M2 16h16M46 16h16"/><circle cx="32" cy="16" r="13"/><path d="M23 7l18 18M41 7 23 25"/>',
    interruptor: '<path d="M2 20h16M46 20h16"/><circle cx="18" cy="20" r="2.5"/><circle cx="46" cy="20" r="2.5"/><path d="M20 19 44 6"/>',
    amperimetro: '<path d="M2 16h16M46 16h16"/><circle cx="32" cy="16" r="13"/><path d="M27 23l5-14 5 14M29 18h6"/>',
    voltimetro: '<path d="M2 16h16M46 16h16"/><circle cx="32" cy="16" r="13"/><path d="M27 9l5 14 5-14"/>',
    fusivel: '<path d="M2 16h14M48 16h14"/><rect x="16" y="9" width="32" height="14" rx="3"/><path d="M16 16h32"/>',
    motor: '<path d="M2 16h16M46 16h16"/><circle cx="32" cy="16" r="13"/><path d="M26 22V10l6 8 6-8v12"/>',
  };
  const SYMN = { pilha: 'Pilha / bateria', fio: 'Fio condutor', resistor: 'Resistor', lampada: 'Lâmpada', interruptor: 'Interruptor (chave)', amperimetro: 'Amperímetro', voltimetro: 'Voltímetro', fusivel: 'Fusível', motor: 'Motor' };
  const svg = k => `<svg viewBox="0 0 64 32" style="width:150px;height:75px;stroke:#e6ecf5;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;background:#0d1420;border-radius:10px;padding:6px">${SYM[k]}</svg>`;
  AU.labs.componentes = el => {
    el.innerHTML = `<h3>💡 Teste o circuito: quando a lâmpada acende?</h3><p class="au-sub">Clique no <b>interruptor</b> do desenho para abri-lo ou fechá-lo. Use os botões para provocar defeitos e descubra por que a lâmpada apaga.</p>`;
    const S = { sw: true, cut: false, bat: true, broken: false, flip: false, st: {} };
    const c = AU.canvas(el, 800, 300), ctx = c.ctx;
    const r = AU.row(el);
    const B = {};
    const mk = (k, a, b) => { B[k] = AU.btn(r, '', () => { S[k] = !S[k]; lab(); }); B[k].dataset.a = a; B[k].dataset.b = b; };
    mk('cut', '✂️ Cortar um fio', '🔧 Consertar o fio'); mk('bat', '🔋 Tirar a pilha', '🔋 Colocar a pilha'); mk('broken', '💥 Queimar a lâmpada', '💡 Trocar a lâmpada'); mk('flip', '🔄 Inverter a pilha', '🔄 Desvirar a pilha');
    function lab() { B.cut.textContent = S.cut ? B.cut.dataset.b : B.cut.dataset.a; B.bat.textContent = S.bat ? B.bat.dataset.a : B.bat.dataset.b; B.broken.textContent = S.broken ? B.broken.dataset.b : B.broken.dataset.a; B.flip.textContent = S.flip ? B.flip.dataset.b : B.flip.dataset.a; }
    lab();
    const nt = AU.note(el, '');
    AU.drag(c, { click: p => { if (Math.abs(p.x - 560) < 60 && Math.abs(p.y - 250) < 40) S.sw = !S.sw; } });
    AU.loop(dt => {
      const closed = S.sw && !S.cut && S.bat && !S.broken;
      c.clear('#0b1220');
      ctx.strokeStyle = '#d38c4f'; ctx.lineWidth = 6; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(150, 250); ctx.lineTo(100, 250); ctx.lineTo(100, 70); ctx.lineTo(370, 70); ctx.moveTo(430, 70); ctx.lineTo(700, 70); ctx.lineTo(700, 250); ctx.lineTo(600, 250); ctx.moveTo(520, 250); ctx.lineTo(S.cut ? 390 : 330, 250); ctx.moveTo(S.cut ? 350 : 330, 250); ctx.lineTo(250, 250); ctx.stroke();
      if (S.cut) { D.text(ctx, '✂️', 370, 250, { size: 22 }); }
      D.bulb(ctx, 400, 74, closed ? 1 : 0, 26);
      if (S.broken) D.text(ctx, '💥 filamento rompido', 400, 128, { size: 12, color: '#fca5a5' });
      if (S.bat) D.battery(ctx, 200, 250, 96, 40, '3 V (2 pilhas)', false);
      else { ctx.strokeStyle = '#ef4444'; ctx.setLineDash([6, 5]); ctx.lineWidth = 2; ctx.strokeRect(152, 230, 96, 40); ctx.setLineDash([]); D.text(ctx, 'sem pilha', 200, 250, { size: 12, color: '#fca5a5' }); }
      if (S.flip && S.bat) { ctx.save(); ctx.translate(200, 250); ctx.scale(-1, 1); ctx.restore(); D.text(ctx, '(invertida)', 200, 288, { size: 11, color: C.muted }); }
      // interruptor
      ctx.fillStyle = '#e8e6df'; ctx.fillRect(515, 258, 90, 10); D.circle(ctx, 522, 250, 5, '#cbd5e1'); D.circle(ctx, 598, 250, 5, '#cbd5e1');
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(522, 250); const a = S.sw ? 0 : -0.55; ctx.lineTo(522 + Math.cos(a) * 76, 250 + Math.sin(a) * 76); ctx.stroke();
      D.text(ctx, S.sw ? 'interruptor FECHADO' : 'interruptor ABERTO', 560, 215, { size: 12, color: S.sw ? '#86efac' : '#fde68a' });
      D.text(ctx, '👆 clique', 560, 290, { size: 11, color: C.muted });
      if (closed) {
        const dir = S.flip ? -1 : 1;
        flowDots(ctx, [{ pts: [[150, 250], [100, 250], [100, 70], [700, 70], [700, 250], [250, 250]], I: 0.3 * -dir }], S.st, dt);
      }
      nt.className = 'au-note ' + (closed ? 'ok' : 'warn');
      nt.innerHTML = closed ? `✓ <b>Circuito fechado:</b> existe um caminho contínuo saindo de um polo da pilha, passando pela lâmpada e voltando ao outro polo.${S.flip ? ' Inverter a pilha só muda o <b>sentido</b> da corrente: a lâmpada continua acesa.' : ''}`
        : `✗ <b>Circuito aberto:</b> ${!S.bat ? 'sem a pilha não há <b>fonte</b> de tensão para empurrar os elétrons.' : S.cut ? 'o fio cortado interrompeu o caminho da corrente.' : S.broken ? 'o filamento rompido da lâmpada interrompeu o caminho (por isso a lâmpada queimada “apaga” um circuito em série).' : 'o interruptor aberto deixa um espaço de <b>ar</b> (isolante) no caminho.'}`;
    });

    const sec = h('div', 'au-sec', '<h3>✏️ Que símbolo é este?</h3><p class="au-sub">Nos esquemas elétricos, cada componente tem um símbolo.</p>'); el.appendChild(sec);
    const keys = AU.shuffle(Object.keys(SYM)); let qi = 0, hits = 0;
    const box = h('div'); sec.appendChild(box);
    function ask() {
      if (qi >= keys.length) { box.innerHTML = `<div class="au-note ok">🎉 Fim! Você acertou <b>${hits}</b> de ${keys.length} na primeira tentativa. <button class="au-b" id="symR">Jogar de novo</button></div>`; box.querySelector('#symR').onclick = () => { AU.shuffle(keys); qi = 0; hits = 0; ask(); }; return; }
      const k = keys[qi], opts = AU.shuffle([k, ...AU.shuffle(Object.keys(SYM).filter(x => x !== k)).slice(0, 3)]);
      let first = true;
      box.innerHTML = `<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">${svg(k)}<div class="au-qo" style="flex:1;min-width:220px">${opts.map(o => `<button data-o="${o}">${SYMN[o]}</button>`).join('')}</div></div><div class="au-fb">Símbolo ${qi + 1} de ${keys.length}</div>`;
      box.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
        if (b.dataset.o === k) { b.classList.add('right'); if (first) hits++; box.querySelector('.au-fb').innerHTML = '✓ Isso mesmo!'; setTimeout(() => { qi++; ask(); }, 700); }
        else { b.classList.add('wrong'); first = false; }
      });
    }
    ask();
    const fs = h('div', 'au-sec', '<h3>🧰 Função de cada componente</h3>'); el.appendChild(fs);
    fs.insertAdjacentHTML('beforeend', `<div class="au-scroll"><table class="au-tbl"><thead><tr><th>Componente</th><th>Função</th><th>Exemplo</th></tr></thead><tbody>
      <tr><td><b>Fonte</b> (pilha, bateria, tomada)</td><td>Fornece tensão elétrica ao circuito</td><td>Pilha 1,5 V, bateria 9 V, tomada 127/220 V</td></tr>
      <tr><td><b>Condutor</b> (fio)</td><td>Conecta os componentes e conduz a corrente</td><td>Fios de cobre ou alumínio</td></tr>
      <tr><td><b>Resistor</b></td><td>Limita a corrente e transforma energia em calor</td><td>Resistência do chuveiro, filamento da lâmpada</td></tr>
      <tr><td><b>Interruptor</b></td><td>Liga e desliga o circuito</td><td>Interruptor de luz, botão liga/desliga</td></tr>
      <tr><td><b>Fusível / disjuntor</b></td><td>Protege, desligando quando a corrente é excessiva</td><td>Quadro de disjuntores da casa</td></tr>
      <tr><td><b>Amperímetro</b></td><td>Mede a corrente (em série)</td><td>Multímetro na função A</td></tr>
      <tr><td><b>Voltímetro</b></td><td>Mede a tensão entre dois pontos (em paralelo)</td><td>Multímetro na função V</td></tr></tbody></table></div>`);
  };

  /* ================= Aula 13 · Série, paralelo e misto: calculadora visual ================= */
  AU.labs.associacao = el => {
    el.innerHTML = `<h3>🔀 Associação de resistores</h3><p class="au-sub">Monte a associação, ajuste a tensão e as resistências e confira os cálculos passo a passo. As bolinhas mostram a corrente em cada parte.</p>`;
    const S = { tipo: 'serie', V: 9, N: 2, R: [10, 10, 10, 10], off: [false, false, false, false], st: {} };
    const r1 = AU.row(el);
    const tipoSeg = AU.seg(r1, [['serie', '🔗 Série'], ['paralelo', '🔀 Paralelo'], ['misto', '🧩 Misto']], 'serie', v => { S.tipo = v; if (v === 'misto') S.N = 3; nSeg.set(S.N); build(); });
    const nSeg = AU.seg(r1, [[2, '2 resistores'], [3, '3'], [4, '4']], 2, v => { if (S.tipo === 'misto') { AU.toast('O circuito misto usa 3 resistores.'); nSeg.set(3); return; } S.N = v; build(); });
    const c = AU.canvas(el, 800, 330), ctx = c.ctx;
    const calc = h('div', 'au-note'); el.appendChild(calc);
    const ctl = h('div', 'au-ctl'); el.appendChild(ctl);
    const r2 = AU.row(el);
    AU.btn(r2, '📘 Exercício da aula: 12 V; 2 Ω, 6 Ω e 3 Ω em paralelo', () => setAll('paralelo', 12, [2, 6, 3, 10], 3));
    AU.btn(r2, '9 V; 10 Ω + 10 Ω em série', () => setAll('serie', 9, [10, 10, 10, 10], 2));
    AU.btn(r2, '9 V; 10 Ω ∥ 10 Ω', () => setAll('paralelo', 9, [10, 10, 10, 10], 2));
    AU.btn(r2, '9 V; misto 10 + (10 ∥ 10)', () => setAll('misto', 9, [10, 10, 10, 10], 3));
    const r3 = AU.row(el);
    AU.btn(r3, '💥 Queimar/consertar R2', () => { S.off[1] = !S.off[1]; });
    function setAll(t, V, R, N) { S.tipo = t; S.V = V; S.R = R.slice(); S.N = N; S.off = [false, false, false, false]; tipoSeg.set(t); nSeg.set(N); build(); }
    let sl = [];
    function build() {
      ctl.innerHTML = ''; sl = [];
      AU.slider(ctl, { label: 'Tensão da fonte', min: 1.5, max: 24, step: 0.5, value: S.V, fmt: v => n(v, 1) + ' V', on: v => { S.V = v; } });
      for (let i = 0; i < S.N; i++) sl.push(AU.slider(ctl, { label: `R${i + 1}`, min: 1, max: 100, step: 1, value: S.R[i], fmt: v => v + ' Ω', on: v => { S.R[i] = v; } }));
    }
    build();
    const fR = r => n(r, r < 10 ? 2 : 1);
    function solve() {
      const N = S.N, R = S.R.slice(0, N), off = S.off.slice(0, N), V = S.V;
      const res = { I: 0, Req: Infinity, V: R.map(() => 0), Ir: R.map(() => 0), lines: [] };
      const sumTxt = arr => arr.join(' + ');
      if (S.tipo === 'serie') {
        if (off.some(x => x)) { res.lines.push('Um resistor queimou: o <b>único caminho</b> foi interrompido e a corrente parou em <b>todos</b>.'); return res; }
        res.Req = R.reduce((a, b) => a + b, 0); res.I = V / res.Req;
        res.V = R.map(r => r * res.I); res.Ir = R.map(() => res.I);
        res.lines.push(`Req = ${sumTxt(R.map(fR))} = <b>${fR(res.Req)} Ω</b>`);
        res.lines.push(`I = V ÷ Req = ${n(V, 1)} ÷ ${fR(res.Req)} = <b>${n(res.I, 3)} A</b> (a mesma em todos)`);
        res.lines.push(R.map((r, i) => `V${i + 1} = ${fR(r)} × ${n(res.I, 3)} = <b>${n(res.V[i], 2)} V</b>`).join(' · '));
        res.lines.push(`Lei das Malhas: ${res.V.map(v => n(v, 2)).join(' + ')} = ${n(res.V.reduce((a, b) => a + b, 0), 2)} V = tensão da fonte ✓`);
      } else if (S.tipo === 'paralelo') {
        const on = R.map((r, i) => off[i] ? 0 : 1 / r), G = on.reduce((a, b) => a + b, 0);
        res.Req = G ? 1 / G : Infinity; res.Ir = R.map((r, i) => off[i] ? 0 : V / r); res.I = res.Ir.reduce((a, b) => a + b, 0); res.V = R.map((_, i) => off[i] ? 0 : V);
        res.lines.push(`1/Req = ${R.map((r, i) => off[i] ? '<s>1/' + fR(r) + '</s>' : '1/' + fR(r)).join(' + ')} = ${n(G, 3)} → Req = <b>${fR(res.Req)} Ω</b>`);
        res.lines.push(R.map((r, i) => off[i] ? `I${i + 1} = 0 (queimado)` : `I${i + 1} = ${n(V, 1)} ÷ ${fR(r)} = <b>${n(res.Ir[i], 3)} A</b>`).join(' · '));
        res.lines.push(`Lei dos Nós: I total = ${res.Ir.map(x => n(x, 3)).join(' + ')} = <b>${n(res.I, 3)} A</b>`);
        res.lines.push(`Tensão em cada resistor: <b>${n(V, 1)} V</b> (a mesma da fonte)`);
        if (off.some(x => x)) res.lines.push('R2 queimou, mas os <b>outros ramos continuam funcionando</b>, como as lâmpadas de uma casa.');
      } else {
        const [R1, R2, R3] = R;
        if (off[0]) { res.lines.push('R1 está em série com tudo: se ele queima, a corrente para em todo o circuito.'); return res; }
        const Rp = off[1] ? R3 : off[2] ? R2 : R2 * R3 / (R2 + R3);
        res.Req = R1 + Rp; res.I = V / res.Req; const V1 = R1 * res.I, Vp = Rp * res.I;
        res.V = [V1, off[1] ? 0 : Vp, off[2] ? 0 : Vp]; res.Ir = [res.I, off[1] ? 0 : Vp / R2, off[2] ? 0 : Vp / R3];
        res.lines.push(`Paralelo R2 ∥ R3: ${off[1] ? `só R3 = ${fR(R3)} Ω (R2 queimado)` : `(${fR(R2)} × ${fR(R3)}) ÷ (${fR(R2)} + ${fR(R3)}) = <b>${fR(Rp)} Ω</b>`}`);
        res.lines.push(`Req = R1 + R∥ = ${fR(R1)} + ${fR(Rp)} = <b>${fR(res.Req)} Ω</b> → I = ${n(V, 1)} ÷ ${fR(res.Req)} = <b>${n(res.I, 3)} A</b>`);
        res.lines.push(`V1 = ${fR(R1)} × ${n(res.I, 3)} = <b>${n(V1, 2)} V</b> · no paralelo sobram ${n(V, 1)} − ${n(V1, 2)} = <b>${n(Vp, 2)} V</b>`);
        res.lines.push(`I2 = <b>${n(res.Ir[1], 3)} A</b> · I3 = <b>${n(res.Ir[2], 3)} A</b> (somam ${n(res.I, 3)} A)`);
      }
      return res;
    }
    AU.loop(dt => {
      const s = solve();
      calc.innerHTML = s.lines.map(l => `<div>${l}</div>`).join('');
      c.clear('#0b1220');
      const top = 80, bot = 280, xl = 80, xr = 740;
      ctx.strokeStyle = '#d38c4f'; ctx.lineWidth = 4; ctx.lineJoin = 'round';
      const L = (pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
      D.battery(ctx, xl, 180, 80, 40, '', true);
      D.text(ctx, n(S.V, 1) + ' V', xl + 34, 180, { size: 14, weight: 800, color: C.yellow, align: 'left' });
      L([[xl, 140], [xl, top]]); L([[xl, 220], [xl, bot]]);
      const segs = [], lab = (i) => [`R${i + 1} = ${fR(S.R[i])} Ω`, S.off[i] ? 'queimado' : `${n(s.V[i], 2)} V · ${n(s.Ir[i], 3)} A`];
      const heat = i => AU.clamp(s.V[i] * s.Ir[i] / 20, 0, 1);
      if (S.tipo === 'serie') {
        L([[xl, top], [xr, top], [xr, bot], [xl, bot]]);
        const xs = S.R.slice(0, S.N).map((_, i) => 170 + (i + 0.5) * (560 / S.N));
        xs.forEach((x, i) => resistorBox(ctx, x, top, false, ...lab(i), S.off[i], heat(i)));
        segs.push({ pts: [[xl, 140], [xl, top], [xr, top], [xr, bot], [xl, bot], [xl, 220]], I: s.I });
      } else if (S.tipo === 'paralelo') {
        const xs = S.R.slice(0, S.N).map((_, i) => 220 + i * (400 / (S.N - 1)));
        const xm = xs[xs.length - 1];
        L([[xl, top], [xm, top]]); L([[xl, bot], [xm, bot]]);
        xs.forEach((x, i) => { L([[x, top], [x, bot]]); resistorBox(ctx, x, (top + bot) / 2, true, ...lab(i), S.off[i], heat(i)); });
        segs.push({ pts: [[xl, 140], [xl, top], [xs[0], top]], I: s.I });
        segs.push({ pts: [[xs[0], bot], [xl, bot], [xl, 220]], I: s.I });
        xs.forEach((x, i) => {
          const rest = s.Ir.slice(i).reduce((a, b) => a + b, 0), restNext = s.Ir.slice(i + 1).reduce((a, b) => a + b, 0);
          segs.push({ pts: [[x, top], [x, bot]], I: s.Ir[i] });
          if (i < xs.length - 1) { segs.push({ pts: [[x, top], [xs[i + 1], top]], I: restNext }); segs.push({ pts: [[xs[i + 1], bot], [x, bot]], I: restNext }); }
          void rest;
        });
        D.text(ctx, 'nó', xs[0] + 14, top - 12, { size: 11, color: C.muted });
      } else {
        const xa = 440, xb = 600;
        L([[xl, top], [xb, top]]); L([[xl, bot], [xb, bot]]); L([[xa, top], [xa, bot]]); L([[xb, top], [xb, bot]]);
        resistorBox(ctx, 260, top, false, ...lab(0), S.off[0], heat(0));
        resistorBox(ctx, xa, (top + bot) / 2, true, ...lab(1), S.off[1], heat(1));
        resistorBox(ctx, xb, (top + bot) / 2, true, ...lab(2), S.off[2], heat(2));
        segs.push({ pts: [[xl, 140], [xl, top], [xa, top]], I: s.I }, { pts: [[xa, top], [xa, bot]], I: s.Ir[1] }, { pts: [[xa, top], [xb, top], [xb, bot], [xa, bot]], I: s.Ir[2] }, { pts: [[xa, bot], [xl, bot], [xl, 220]], I: s.I });
      }
      flowDots(ctx, segs, S.st, dt);
      D.text(ctx, `Req = ${isFinite(s.Req) ? fR(s.Req) + ' Ω' : '∞ (aberto)'}     ·     I total = ${n(s.I, 3)} A`, 400, 312, { size: 15, weight: 800, color: '#7dd3fc' });
      D.text(ctx, 'bolinhas: sentido convencional da corrente (+ → −)', 400, 22, { size: 11.5, color: C.muted });
    });
    AU.note(el, '<b>Série:</b> corrente igual, tensão dividida, Req = soma. <b>Paralelo:</b> tensão igual, corrente dividida, Req menor que o menor resistor.', 'warn');
  };

  /* ================= Aula 14 · Segurança: quadro, disjuntor e aterramento ================= */
  AU.labs.seguranca = el => {
    el.innerHTML = `<h3>⚠️ Quadro de energia: sobrecarga e disjuntor</h3><p class="au-sub">Ligue aparelhos no <b>benjamim</b> (todos no mesmo circuito, com fio de 2,5 mm², que aguenta cerca de 20 A). Observe a corrente, o aquecimento do fio e o disjuntor.</p>`;
    const AP = [['🚿', 'Chuveiro', 4400], ['👕', 'Ferro de passar', 1000], ['🍿', 'Micro-ondas', 1400], ['💨', 'Secador de cabelo', 1900], ['🍟', 'Air fryer', 1500], ['📺', 'TV', 150], ['🧊', 'Geladeira', 250], ['🌀', 'Ventilador', 70], ['📱', 'Carregador', 10]];
    const S = { V: 127, brk: 20, has: true, on: new Set(), trip: false, tAcc: 0, T: 25, fire: 0, short: false, st: {} };
    const r = AU.row(el);
    AU.seg(r, [[127, '127 V'], [220, '220 V']], 127, v => { S.V = v; });
    AU.seg(r, [[10, 'Disjuntor 10 A'], [20, '20 A'], [32, '32 A']], 20, v => { S.brk = v; });
    const c = AU.canvas(el, 800, 300), ctx = c.ctx;
    const grid = h('div', 'au-cards'); grid.style.gridTemplateColumns = 'repeat(auto-fit,minmax(110px,1fr))'; el.appendChild(grid);
    grid.innerHTML = AP.map(([e, t, p], i) => `<button class="au-card" data-i="${i}" style="padding:7px"><span class="em" style="font-size:22px">${e}</span>${t}<br><small style="color:var(--muted)">${n(p, 0)} W</small></button>`).join('');
    grid.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; const i = +b.dataset.i; S.on.has(i) ? S.on.delete(i) : S.on.add(i); b.classList.toggle('on', S.on.has(i)); });
    const r2 = AU.row(el);
    AU.btn(r2, '🔁 Religar o disjuntor', () => { S.trip = false; S.tAcc = 0; S.short = false; });
    const hb = AU.btn(r2, '🚫 Retirar o disjuntor (perigo!)', () => { S.has = !S.has; hb.textContent = S.has ? '🚫 Retirar o disjuntor (perigo!)' : '✅ Recolocar o disjuntor'; hb.classList.toggle('bad', !S.has); S.trip = false; });
    AU.btn(r2, '⚡ Provocar curto-circuito', () => { S.short = true; }, 'bad');
    AU.btn(r2, '↺ Desligar tudo', () => { S.on.clear(); grid.querySelectorAll('.au-card').forEach(b => b.classList.remove('on')); S.short = false; S.trip = false; S.T = 25; S.fire = 0; });
    const RD = AU.readouts(el, [['P', 'Potência total'], ['I', 'Corrente no fio'], ['T', 'Temperatura do fio'], ['D', 'Disjuntor']]);
    const nt = AU.note(el, '');
    AU.loop(dt => {
      const P = [...S.on].reduce((a, i) => a + AP[i][2], 0);
      let I = S.short ? 400 : P / S.V;
      if (S.has && !S.trip) {
        if (I > S.brk) { S.tAcc += dt * (I / S.brk > 3 ? 50 : (I / S.brk - 1) * 3 + 0.4); if (S.tAcc > 1) { S.trip = true; } } else S.tAcc = Math.max(0, S.tAcc - dt);
      }
      if (S.trip) I = 0;
      const Teq = 25 + 45 * Math.pow(I / 20, 2);
      S.T += (Math.min(Teq, 900) - S.T) * Math.min(1, dt * (S.short ? 3 : 0.6));
      if (S.T > 160) S.fire = Math.min(1, S.fire + dt * 0.5); else S.fire = Math.max(0, S.fire - dt * 0.2);
      RD.set('P', S.short ? 'curto!' : n(P, 0) + ' W'); RD.set('I', n(I, 1) + ' A', I > 20 ? 'bad' : I > 15 ? 'warn' : 'ok');
      RD.set('T', n(S.T, 0) + ' °C', S.T > 90 ? 'bad' : S.T > 60 ? 'warn' : 'ok'); RD.set('D', !S.has ? 'AUSENTE' : S.trip ? 'DESARMOU' : 'ligado', !S.has ? 'bad' : S.trip ? 'warn' : 'ok');
      // desenho
      c.clear('#0b1220');
      D.rr(ctx, 30, 40, 150, 220, 10); ctx.fillStyle = '#e2e8f0'; ctx.fill(); D.text(ctx, 'Quadro de disjuntores', 105, 58, { size: 12, color: '#0f172a', weight: 800 });
      D.rr(ctx, 80, 90, 50, 110, 6); ctx.fillStyle = S.has ? '#1e293b' : '#fecaca'; ctx.fill();
      if (S.has) { ctx.fillStyle = S.trip ? '#f59e0b' : '#22c55e'; ctx.fillRect(95, S.trip ? 155 : 105, 20, 30); D.text(ctx, S.trip ? 'OFF' : 'ON', 105, 215, { size: 13, color: '#0f172a', weight: 800 }); D.text(ctx, S.brk + ' A', 105, 240, { size: 13, color: '#0f172a', weight: 800 }); }
      else D.text(ctx, 'sem disjuntor', 105, 145, { size: 11, color: '#991b1b', weight: 800 });
      // fio
      const hot = AU.clamp((S.T - 25) / 150, 0, 1);
      ctx.strokeStyle = `rgb(${211 + 44 * hot},${140 - 100 * hot},${79 - 60 * hot})`; ctx.lineWidth = 7 + hot * 3;
      ctx.beginPath(); ctx.moveTo(180, 140); ctx.lineTo(560, 140); ctx.stroke();
      if (hot > 0.15) D.glow(ctx, 370, 140, 160, `rgba(255,80,0,${hot * 0.5})`);
      if (I > 0.01) flowDots(ctx, [{ pts: [[180, 140], [560, 140]], I: I / 3 }], S.st, dt, '#fde68a');
      // benjamim
      D.rr(ctx, 560, 110, 210, 60, 10); ctx.fillStyle = '#f1f5f9'; ctx.fill();
      for (let k = 0; k < 6; k++) { D.circle(ctx, 590 + k * 32, 140, 11, '#cbd5e1'); }
      [...S.on].slice(0, 6).forEach((i, k) => D.text(ctx, AP[i][0], 590 + k * 32, 140, { size: 18 }));
      if (S.on.size > 6) D.text(ctx, `+${S.on.size - 6}`, 665, 186, { size: 13, color: C.yellow });
      D.text(ctx, 'benjamim', 665, 98, { size: 12, color: C.muted });
      if (S.short) { D.text(ctx, '⚡', 370, 118, { size: 30 }); }
      if (S.fire > 0) { for (let k = 0; k < 7; k++) { const x = 260 + k * 30 + Math.sin(performance.now() / 120 + k) * 4; D.text(ctx, '🔥', x, 115 - S.fire * 20 - (k % 2) * 8, { size: 18 + S.fire * 16 }); } D.text(ctx, 'O fio derreteu o isolamento e pegou fogo!', 400, 260, { size: 15, color: '#fca5a5', weight: 800 }); }
      nt.className = 'au-note ' + (S.fire > 0.2 || !S.has ? 'bad' : S.trip ? 'warn' : 'ok');
      nt.innerHTML = S.fire > 0.2 ? '🔥 <b>Incêndio!</b> Sem proteção, a corrente alta esquentou o fio (efeito Joule) até derreter o plástico isolante. É exatamente isso que o disjuntor evita.'
        : S.trip ? `🛑 <b>O disjuntor desarmou</b> e cortou a corrente ${S.short ? 'na hora (curto-circuito)' : 'porque a corrente passou de ' + S.brk + ' A (sobrecarga)'}. Desligue alguns aparelhos e religue o disjuntor.`
          : !S.has ? '⚠️ <b>Sem disjuntor:</b> nada vai interromper a corrente se ela ficar alta demais. Ligue vários aparelhos e veja o fio esquentar.'
            : `Corrente = Potência ÷ Tensão = ${n(P, 0)} ÷ ${S.V} = <b>${n(P / S.V, 1)} A</b>. ${P / S.V > S.brk ? 'Acima do limite: o disjuntor vai desarmar!' : 'Dentro do limite do disjuntor.'} Repare: em 220 V, a mesma potência precisa de <b>menos corrente</b>.`;
    });

    /* Aterramento */
    const gs = h('div', 'au-sec', '<h3>🌍 Aterramento: para onde vai a corrente de uma falha?</h3><p class="au-sub">Um fio solto encostou na carcaça de metal da máquina de lavar. Uma pessoa encosta na máquina.</p>'); el.appendChild(gs);
    const G = { fault: true, ground: false, touch: true, t: 0, st: {} };
    const g = AU.canvas(gs, 800, 300), gx = g.ctx;
    const gr = AU.row(gs);
    const b1 = AU.btn(gr, '', () => { G.fault = !G.fault; lb(); }), b2 = AU.btn(gr, '', () => { G.ground = !G.ground; lb(); }), b3 = AU.btn(gr, '', () => { G.touch = !G.touch; lb(); });
    function lb() { b1.textContent = G.fault ? '🔧 Consertar o defeito' : '⚠️ Criar o defeito'; b2.textContent = G.ground ? '🔌 Desligar o fio terra' : '🌍 Ligar o fio terra (pino do meio)'; b3.textContent = G.touch ? '✋ Pessoa se afasta' : '✋ Pessoa encosta'; b2.classList.toggle('ok', G.ground); }
    lb();
    const gn = AU.note(gs, '');
    AU.loop(dt => {
      g.clear('#0b1220'); G.t += dt;
      gx.fillStyle = '#334155'; gx.fillRect(0, 260, 800, 40);
      // tomada de 3 pinos
      D.rr(gx, 40, 90, 80, 90, 10); gx.fillStyle = '#f8fafc'; gx.fill(); [[65, 125], [95, 125], [80, 150]].forEach(([x, y], i) => D.circle(gx, x, y, 6, i === 2 ? (G.ground ? '#22c55e' : '#94a3b8') : '#334155'));
      D.text(gx, 'tomada', 80, 195, { size: 12, color: C.muted });
      gx.strokeStyle = '#1e293b'; gx.lineWidth = 6; gx.beginPath(); gx.moveTo(120, 125); gx.lineTo(300, 125); gx.stroke();
      // máquina
      D.rr(gx, 300, 80, 170, 180, 12); gx.fillStyle = G.fault ? '#cbd5e1' : '#e2e8f0'; gx.fill(); D.circle(gx, 385, 175, 50, '#94a3b8', '#64748b', 4); D.circle(gx, 385, 175, 34, '#1e3a8a');
      if (G.fault) { D.text(gx, '⚡', 445, 110, { size: 24 }); gx.strokeStyle = '#ef4444'; gx.lineWidth = 3; gx.beginPath(); gx.moveTo(300, 125); gx.lineTo(440, 105); gx.stroke(); D.text(gx, 'fio encostado na carcaça', 385, 68, { size: 12, color: '#fca5a5' }); }
      // fio terra
      if (G.ground) { gx.strokeStyle = '#22c55e'; gx.lineWidth = 3; gx.beginPath(); gx.moveTo(80, 156); gx.lineTo(80, 230); gx.lineTo(300, 230); gx.moveTo(80, 230); gx.lineTo(80, 262); gx.stroke(); [0, 1, 2].forEach(i => { gx.beginPath(); gx.moveTo(62 + i * 6, 266 + i * 6); gx.lineTo(98 - i * 6, 266 + i * 6); gx.stroke(); }); D.text(gx, 'fio terra', 190, 245, { size: 12, color: '#86efac' }); }
      // pessoa
      const px = G.touch ? 520 : 640;
      gx.strokeStyle = '#e2e8f0'; gx.lineWidth = 6; gx.lineCap = 'round';
      gx.beginPath(); gx.moveTo(px, 150); gx.lineTo(px, 210); gx.moveTo(px, 210); gx.lineTo(px - 15, 258); gx.moveTo(px, 210); gx.lineTo(px + 15, 258); gx.moveTo(px, 165); gx.lineTo(G.touch ? 470 : px + 30, G.touch ? 150 : 195); gx.moveTo(px, 165); gx.lineTo(px + 28, 195); gx.stroke();
      D.circle(gx, px, 130, 17, '#fbbf24');
      const shock = G.fault && G.touch && !G.ground, safe = G.fault && G.ground;
      if (shock) {
        if (Math.sin(G.t * 20) > 0) { gx.strokeStyle = '#ef4444'; gx.lineWidth = 4; gx.beginPath(); gx.moveTo(470, 150); gx.lineTo(px, 165); gx.lineTo(px, 210); gx.lineTo(px - 15, 258); gx.stroke(); }
        D.text(gx, '⚡ CHOQUE! A corrente passa pelo corpo até o chão', 560, 40, { size: 16, weight: 800, color: '#fca5a5' });
      }
      if (safe) {
        flowDots(gx, [{ pts: [[300, 230], [80, 230], [80, 262]], I: 2 }], G.st, dt, '#86efac');
        D.text(gx, '✓ A corrente da falha vai pelo fio terra; o disjuntor (ou DR) desliga', 520, 40, { size: 14, weight: 700, color: '#86efac' });
      }
      gn.className = 'au-note ' + (shock ? 'bad' : 'ok');
      gn.innerHTML = !G.fault ? 'Sem defeito, a carcaça de metal não tem tensão: é seguro tocar.' : shock ? 'Sem aterramento, a carcaça ficou <b>energizada</b>. Ao encostar, a pessoa vira o caminho da corrente até o chão: <b>choque elétrico</b>, que pode causar queimaduras e parada cardíaca.' : G.ground ? 'Com o <b>fio terra</b> ligado ao pino do meio da tomada, a corrente da falha encontra um caminho muito mais fácil até o solo. A carcaça não fica perigosa e a proteção desarma.' : 'A carcaça está energizada! Se alguém encostar, leva choque.';
    });

    /* Seguro ou perigoso */
    const qs = h('div', 'au-sec', '<h3>🚦 Seguro ou perigoso?</h3>'); el.appendChild(qs);
    const SIT = [
      ['🪁', 'Soltar pipa perto dos fios da rua', 0, 'A linha pode encostar nos cabos de alta tensão e conduzir a corrente até a pessoa.'],
      ['🔌', 'Desligar o disjuntor antes de trocar a resistência do chuveiro', 1, 'Correto: sem corrente, não há risco de choque durante o reparo.'],
      ['💧', 'Usar o secador de cabelo com as mãos molhadas, perto da pia', 0, 'A água com sais minerais conduz eletricidade e aumenta muito o risco de choque.'],
      ['🧩', 'Ligar o chuveiro, o forno e o aquecedor no mesmo benjamim', 0, 'Sobrecarga: a corrente alta aquece os fios e pode causar incêndio.'],
      ['🌩️', 'Ficar longe de um fio caído na rua e avisar a concessionária', 1, 'Correto: o fio pode estar energizado mesmo parado no chão.'],
      ['🧤', 'Eletricista usando luvas e botas isolantes (NR-10)', 1, 'Correto: os EPIs isolantes protegem contra choques.'],
      ['🩹', 'Emendar fios com fita adesiva comum e deixar parte desencapada', 0, 'Fios expostos causam choques e curtos-circuitos. Emendas devem ser bem isoladas, por um profissional.'],
      ['🏠', 'Usar tomada de 3 pinos com o fio terra instalado', 1, 'Correto: o aterramento protege contra choques em caso de defeito.'],
    ];
    const sg = h('div', 'au-cards'); qs.appendChild(sg);
    sg.innerHTML = SIT.map(([e, t], i) => `<div class="au-card" data-i="${i}"><span class="em">${e}</span>${t}<div class="au-row" style="margin:6px 0 0"><button class="au-b ok" data-a="1">✅ Seguro</button><button class="au-b bad" data-a="0">⛔ Perigoso</button></div><div class="au-fb"></div></div>`).join('');
    sg.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (!b) return; const card = b.closest('[data-i]'), s = SIT[+card.dataset.i], ok = +b.dataset.a === s[2]; card.classList.remove('good', 'badc'); card.classList.add(ok ? 'good' : 'badc'); card.querySelector('.au-fb').innerHTML = (ok ? '✓ ' : '✗ Não. ') + s[3]; });
  };

  /* ================= Aulas 15 e 16 · Folha de registro para os roteiros 3D ================= */
  function sheet(el, groups) {
    groups.forEach(g => {
      const sec = h('div', 'au-sec'); el.appendChild(sec);
      sec.innerHTML = `<div class="au-row sp" style="margin-top:0"><h3 style="margin:0">${g.t}</h3>${g.guide ? `<button class="au-b primary" data-g="${g.guide}">▶ Fazer no laboratório 3D</button>` : ''}</div><p class="au-sub">${g.d}</p>
        <div class="au-scroll"><table class="au-tbl"><tbody>${g.rows.map(([q, v, u], i) => `<tr><td>${q}</td><td class="n"><input data-v="${v}" inputmode="decimal" placeholder="?"> ${u}</td><td style="width:34px" data-r="${i}"></td></tr>`).join('')}</tbody></table></div>`;
      const gb = sec.querySelector('[data-g]'); if (gb) gb.addEventListener('click', () => window.LAB.startGuide(g.guide));
      sec.querySelectorAll('input').forEach(inp => inp.addEventListener('change', () => check(inp)));
    });
    function check(inp) {
      const v = parseFloat(String(inp.value).replace(',', '.')), exp = +inp.dataset.v, cell = inp.closest('tr').lastElementChild;
      if (inp.value.trim() === '') { cell.textContent = ''; return; }
      const ok = Math.abs(v - exp) <= Math.max(0.011, Math.abs(exp) * 0.03);
      cell.innerHTML = ok ? '✅' : '❌'; inp.style.borderColor = ok ? '#4ade80' : '#ef4444';
    }
    const r = AU.row(el);
    AU.btn(r, '👁 Mostrar as respostas', () => el.querySelectorAll('input[data-v]').forEach(inp => { inp.value = n(+inp.dataset.v, 3); check(inp); }));
    AU.btn(r, '🧹 Limpar', () => el.querySelectorAll('input[data-v]').forEach(inp => { inp.value = ''; inp.style.borderColor = ''; check(inp); }));
  }
  AU.labs.sim15 = el => {
    el.innerHTML = `<h3>🖥️ Simulador de circuitos: Parte 1</h3><p class="au-sub">As atividades desta aula (feitas no PhET no livro) estão prontas no <b>laboratório 3D</b>, com os mesmos valores: bateria de 9 V e resistores de 10 Ω. Faça cada roteiro e anote as medidas na folha abaixo: ela confere na hora.</p>`;
    AU.note(el, '<b>Do PhET para este simulador:</b> “clicar duas vezes no resistor” = escolher <b>Selecionar</b> e clicar no resistor (o valor muda no painel da direita, pelo controle ou digitando). “Ver corrente” = opção <b>Corrente</b> no topo. Os medidores estão na barra de ferramentas da esquerda.');
    sheet(el, [
      { t: 'Atividade 1 · Circuito simples', guide: 'a15_1', d: 'Bateria, resistor, interruptor e fios.', rows: [['b) Resistência utilizada', 10, 'Ω'], ['c) Tensão da bateria', 9, 'V'], ['d) Corrente elétrica', 0.9, 'A']] },
      { t: 'Atividade 2 · Segundo resistor em série', guide: 'a15_2', d: 'Dois resistores de 10 Ω em série.', rows: [['a) Resistência equivalente', 20, 'Ω'], ['b) Corrente elétrica', 0.45, 'A'], ['c) Tensão da bateria', 9, 'V']] },
      { t: 'Atividade 3 · Alterando a resistência', guide: 'a15_3', d: 'Um dos resistores passa para 20 Ω.', rows: [['Resistência equivalente', 30, 'Ω'], ['Corrente elétrica', 0.3, 'A'], ['Tensão no resistor de 20 Ω', 6, 'V'], ['Tensão no resistor de 10 Ω', 3, 'V']] },
      { t: 'Atividade 4 · Removendo peças', guide: 'a15_4', d: 'Sem resistores (só fios) há curto-circuito; sem bateria, não há tensão nem corrente.', rows: [['Corrente sem a bateria', 0, 'A'], ['Tensão sem a bateria', 0, 'V']] },
      { t: 'Atividade 5 · Amperímetro e voltímetro', guide: 'a15_5', d: 'Amperímetro em série e voltímetro em paralelo ao resistor de 10 Ω.', rows: [['Leitura do amperímetro', 0.9, 'A'], ['Leitura do voltímetro', 9, 'V']] },
    ]);
  };
  AU.labs.sim16 = el => {
    el.innerHTML = `<h3>🧩 Simulador de circuitos: Parte 2</h3><p class="au-sub">Circuitos em série, em paralelo e mistos com a bateria de 9 V e resistores de 10 Ω, iguais aos do livro. Cada atividade abre o circuito pronto no laboratório 3D, com perguntas guiadas.</p>`;
    AU.note(el, '💡 Dica para medir: com a ferramenta <b>Selecionar</b>, clique em cada resistor: o painel mostra a tensão, a corrente e a potência nele. Passe o mouse para uma leitura rápida.');
    sheet(el, [
      { t: 'Atividade 1 · Resistores em série', guide: 'a16_1', d: 'Dois resistores de 10 Ω em série.', rows: [['b) Corrente elétrica', 0.45, 'A'], ['c) Tensão em cada resistor', 4.5, 'V']] },
      { t: 'Atividades 2 e 3 · Resistores em paralelo', guide: 'a16_2', d: 'Dois resistores de 10 Ω em paralelo.', rows: [['Resistência equivalente', 5, 'Ω'], ['b) Corrente total', 1.8, 'A'], ['Corrente em cada ramo', 0.9, 'A'], ['c) Tensão em cada resistor', 9, 'V']] },
      { t: 'Atividade 4 · Mudando um ramo', guide: 'a16_4', d: 'O resistor do ramo 2 passa para 20 Ω.', rows: [['Corrente no ramo de 10 Ω', 0.9, 'A'], ['Corrente no ramo de 20 Ω', 0.45, 'A'], ['Corrente total', 1.35, 'A'], ['Tensão em cada resistor', 9, 'V']] },
      { t: 'Atividades 5 e 6 · Circuito misto', guide: 'a16_5', d: 'R1 = 10 Ω em série com dois resistores de 10 Ω em paralelo.', rows: [['Resistência equivalente', 15, 'Ω'], ['Corrente total', 0.6, 'A'], ['Tensão em R1', 6, 'V'], ['Tensão no paralelo', 3, 'V'], ['Corrente em cada ramo do paralelo', 0.3, 'A']] },
    ]);
    AU.note(el, '<b>Série</b>: caminho único (corrente igual, tensão dividida). <b>Paralelo</b>: bifurcações (tensão igual, corrente dividida). <b>Misto</b>: combina as duas, como nas instalações elétricas.', 'warn');
  };
})();
