/* Laboratórios das aulas 17 a 21: potência, consumo, conta de luz e sustentabilidade */
(function () {
  'use strict';
  const AU = window.AU, h = AU.h, D = AU.D, C = AU.C, n = AU.n, money = AU.money;
  /* Lê números no formato brasileiro: "1.398" = mil trezentos e noventa e oito; "0,5" = meio */
  const num = v => {
    let t = String(v).trim().replace(/\s/g, '');
    if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
    const x = parseFloat(t); return isFinite(x) ? x : 0;
  };
  const numIn = num;

  /* ================= Aula 17 · Potência: P = U × I ================= */
  AU.labs.potencia = el => {
    el.innerHTML = `<h3>🔌 Calculadora de potência: P = U × I</h3><p class="au-sub">A potência (em watts) diz quanta energia o aparelho usa a cada segundo.</p>`;
    const S = { U: 220, I: 20 };
    const r = AU.row(el);
    const useg = AU.seg(r, [[127, '127 V'], [220, '220 V']], 220, v => { S.U = v; upd(); });
    const isl = AU.slider(el, { label: 'Corrente elétrica (I)', min: 0, max: 40, step: 0.1, value: 20, fmt: v => n(v, 1) + ' A', on: v => { S.I = v; upd(); } });
    const out = h('div'); el.appendChild(out);
    AU.btn(AU.row(el), '🚿 Exercício resolvido: chuveiro em 220 V com 20 A', () => { S.U = 220; S.I = 20; useg.set(220); isl.set(20); upd(); });
    function upd() {
      const P = S.U * S.I, cls = P < 200 ? ['baixo', 'ok'] : P < 1000 ? ['médio', 'warn'] : ['alto', 'bad'];
      out.innerHTML = `<div class="au-note"><b>Passo 1</b> · Dados: U = ${S.U} V e I = ${n(S.I, 1)} A<br><b>Passo 2</b> · Fórmula: P = U × I<br><b>Passo 3</b> · P = ${S.U} × ${n(S.I, 1)}<br><b>Passo 4</b> · <b style="font-size:17px">P = ${n(P, 0)} W</b> (${n(P / 1000, 2)} kW) → consumo <b>${cls[0]}</b></div>`;
    }
    upd();

    /* Quadro com limite de 5 000 W */
    const sec = h('div', 'au-sec', '<h3>🏠 Tudo ligado ao mesmo tempo: o disjuntor aguenta?</h3><p class="au-sub">Atividade da aula: rede de <b>220 V</b> e disjuntor que suporta até <b>5 000 W</b>. Ligue e desligue os aparelhos.</p>'); el.appendChild(sec);
    const AP = [['🧊', 'Geladeira', 1.5, true], ['📺', 'Televisão', 0.8, true], ['🚿', 'Chuveiro elétrico', 18, true], ['👕', 'Ferro de passar', 4.5, false], ['🍿', 'Micro-ondas', 6.4, false], ['🌀', 'Ventilador', 0.3, false], ['💡', 'Lâmpada LED', 0.05, false], ['💻', 'Computador', 0.6, false]];
    const on = AP.map(a => a[3]);
    const tb = h('div'); sec.appendChild(tb);
    function rq() {
      const tot = AP.reduce((s, a, i) => s + (on[i] ? 220 * a[2] : 0), 0), pct = tot / 5000 * 100;
      tb.innerHTML = `<div class="au-scroll"><table class="au-tbl"><thead><tr><th></th><th>Aparelho</th><th class="n">Corrente</th><th class="n">P = 220 × I</th></tr></thead><tbody>${AP.map((a, i) => `<tr><td><input type="checkbox" data-i="${i}" ${on[i] ? 'checked' : ''} style="width:auto"></td><td>${a[0]} ${a[1]}</td><td class="n">${n(a[2], 2)} A</td><td class="n">${on[i] ? '<b>' + n(220 * a[2], 0) + ' W</b>' : '—'}</td></tr>`).join('')}</tbody>
        <tfoot><tr><td></td><td>Total ligado ao mesmo tempo</td><td></td><td class="n">${n(tot, 0)} W</td></tr></tfoot></table></div>
        <div style="margin:8px 0 4px;height:18px;background:#1b2435;border-radius:9px;overflow:hidden;position:relative"><i style="display:block;height:100%;width:${Math.min(100, pct)}%;background:${pct > 100 ? '#ef4444' : pct > 85 ? '#f59e0b' : '#22c55e'}"></i></div>
        <div class="au-note ${pct > 100 ? 'bad' : pct > 85 ? 'warn' : 'ok'}">${pct > 100 ? `🛑 <b>${n(tot, 0)} W passa de 5 000 W:</b> o disjuntor desarma para proteger a instalação.` : pct > 85 ? `⚠️ <b>${n(tot, 0)} W</b> cabe no limite de 5 000 W, mas com <b>pouca margem de segurança</b> (${n(pct, 0)}% do limite).` : `✓ <b>${n(tot, 0)} W</b>: dentro do limite (${n(pct, 0)}% de 5 000 W).`}</div>`;
      tb.querySelectorAll('input[data-i]').forEach(c => c.addEventListener('change', () => { on[+c.dataset.i] = c.checked; rq(); }));
    }
    rq();

    const s2 = h('div', 'au-sec', '<h3>🔁 Classifique pela transformação de energia</h3><p class="au-sub">A energia elétrica se transforma principalmente em quê?</p>'); el.appendChild(s2);
    AU.sorter(s2, {
      bins: [['t', '🔥 Térmica (calor)', 'r'], ['l', '💡 Luminosa', 'y'], ['s', '🔊 Sonora', 'b'], ['m', '⚙️ Mecânica (movimento)', 'g']],
      items: [
        { id: 'ch', label: '🚿 Chuveiro', ok: 't', why: 'O resistor aquece a água (efeito Joule).' }, { id: 'fe', label: '👕 Ferro de passar', ok: 't', why: 'Esquenta a base para passar a roupa.' },
        { id: 'to', label: '🍞 Torradeira', ok: 't', why: 'Resistências incandescentes douram o pão.' }, { id: 'la', label: '💡 Lâmpada LED', ok: 'l', why: 'Transforma a energia elétrica em luz, esquentando pouco.' },
        { id: 'lu', label: '🔦 Lanterna', ok: 'l', why: 'Luz.' }, { id: 'cx', label: '🔊 Caixa de som', ok: 's', why: 'O alto-falante vibra e produz som.' },
        { id: 'ca', label: '🔔 Campainha', ok: 's', why: 'Som.' }, { id: 've', label: '🌀 Ventilador', ok: 'm', why: 'O motor gira as pás.' },
        { id: 'li', label: '🥤 Liquidificador', ok: 'm', why: 'O motor gira as lâminas.' }, { id: 'ml', label: '🧺 Máquina de lavar', ok: 'm', why: 'O motor gira o tambor.' },
      ],
    });
    const s3 = h('div', 'au-sec', '<h3>📊 Classifique pelo consumo</h3>'); el.appendChild(s3);
    AU.sorter(s3, {
      bins: [['b', '🟢 Baixo consumo', 'g'], ['m', '🟡 Médio consumo', 'y'], ['a', '🔴 Alto consumo', 'r']],
      items: [
        { id: 'led', label: '💡 Lâmpada LED (9 W)', ok: 'b', why: 'Pode ficar ligada muito tempo gastando pouco.' }, { id: 'car', label: '📱 Carregador (10 W)', ok: 'b', why: 'Baixíssima potência.' },
        { id: 'pis', label: '🎄 Pisca-pisca de LED', ok: 'b', why: 'LEDs consomem pouca energia.' }, { id: 'tv', label: '📺 Televisão (150 W)', ok: 'm', why: 'Consumo intermediário, mas fica ligada muitas horas.' },
        { id: 'pc', label: '💻 Computador (120 W)', ok: 'm', why: 'Intermediário; em uso prolongado gasta bastante.' }, { id: 'gel', label: '🧊 Geladeira (150 W)', ok: 'm', why: 'Potência média, mas funciona 24 h por dia.' },
        { id: 'chu', label: '🚿 Chuveiro (4 400 W)', ok: 'a', why: 'Transforma muita energia em calor em pouco tempo.' }, { id: 'ar', label: '❄️ Ar-condicionado (2 000 W)', ok: 'a', why: 'Aparelhos de climatização consomem muito.' },
        { id: 'fer', label: '👕 Ferro (1 000 W)', ok: 'a', why: 'Alta potência para gerar calor.' },
      ],
    });
  };

  /* ================= Aula 18 · Consumo em kWh e selo de eficiência ================= */
  AU.labs.consumo = el => {
    el.innerHTML = `<h3>📊 Quanto gasta cada aparelho no mês?</h3><p class="au-sub">Consumo (kWh) = potência (kW) × horas por dia × dias. Valor = consumo × tarifa. Edite os números da tabela.</p>`;
    const CAT = [['❄️ Ar-condicionado', 2000], ['📺 Televisão', 150], ['🧊 Geladeira', 150], ['🌀 Ventilador', 60], ['🚿 Chuveiro', 4400], ['💡 Lâmpada LED', 9], ['💡 Lâmpada incandescente', 60], ['💻 Computador', 120], ['🍿 Micro-ondas', 1400], ['👕 Ferro de passar', 1000], ['📱 Carregador', 10], ['🎮 Videogame', 150], ['🧺 Máquina de lavar', 500]];
    const S = { tar: 0.671, rows: [] };
    const set = rows => { S.rows = rows.map(r => ({ nm: r[0], P: r[1], h: r[2], d: r[3] ?? 30 })); render(); };
    const tr = AU.row(el);
    tr.insertAdjacentHTML('beforeend', '<label class="au-sl" style="flex:0 0 auto;min-width:0">Tarifa (R$ por kWh) <input class="au-inp" id="ctar" value="0,671"></label>');
    tr.querySelector('#ctar').addEventListener('change', e => { S.tar = numIn(e.target.value); render(); });
    const box = h('div'); el.appendChild(box);
    const ar = AU.row(el);
    const sel = h('select'); sel.innerHTML = CAT.map((c, i) => `<option value="${i}">${c[0]} (${n(c[1], 0)} W)</option>`).join(''); ar.appendChild(sel);
    AU.btn(ar, '➕ Acrescentar aparelho', () => { const c = CAT[+sel.value]; S.rows.push({ nm: c[0], P: c[1], h: 1, d: 30 }); render(); });
    const pr = AU.row(el);
    AU.btn(pr, '📘 Exercício da aula: ar-condicionado × TV', () => set([['❄️ Ar-condicionado', 2000, 5], ['📺 Televisão', 150, 6]]));
    AU.btn(pr, '📘 Exemplo: geladeira × ventilador', () => set([['🧊 Geladeira', 150, 24], ['🌀 Ventilador', 60, 8]]));
    const formula = AU.note(el, '');
    function render() {
      const rows = S.rows.map(r => ({ ...r, kwh: r.P * r.h * r.d / 1000 }));
      const tot = rows.reduce((s, r) => s + r.kwh, 0), mx = Math.max(1, ...rows.map(r => r.kwh));
      box.innerHTML = `<div class="au-scroll"><table class="au-tbl"><thead><tr><th>Aparelho</th><th class="n">Potência (W)</th><th class="n">Horas/dia</th><th class="n">Dias</th><th class="n">kWh/mês</th><th class="n">R$/mês</th><th></th></tr></thead><tbody>
        ${rows.map((r, i) => `<tr><td>${r.nm}<div style="height:6px;border-radius:3px;background:#1b2435;margin-top:3px"><i style="display:block;height:100%;width:${r.kwh / mx * 100}%;background:#38bdf8;border-radius:3px"></i></div></td>
          <td class="n"><input data-i="${i}" data-k="P" value="${n(r.P, 1)}"></td><td class="n"><input data-i="${i}" data-k="h" value="${n(r.h, 2)}"></td><td class="n"><input data-i="${i}" data-k="d" value="${r.d}" style="width:52px"></td>
          <td class="n"><b>${n(r.kwh, 2)}</b></td><td class="n">${money(r.kwh * S.tar)}</td><td><button class="au-b" data-del="${i}" title="Remover">✕</button></td></tr>`).join('')}</tbody>
        <tfoot><tr><td>Total</td><td></td><td></td><td></td><td class="n">${n(tot, 2)} kWh</td><td class="n">${money(tot * S.tar)}</td><td></td></tr></tfoot></table></div>`;
      box.querySelectorAll('input[data-i]').forEach(inp => inp.addEventListener('change', () => { S.rows[+inp.dataset.i][inp.dataset.k] = numIn(inp.value); render(); }));
      box.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => { S.rows.splice(+b.dataset.del, 1); render(); }));
      formula.innerHTML = rows.slice(0, 3).map(r => `<div><b>${r.nm}:</b> ${n(r.P, 1)} W × ${n(r.h, 2)} h × ${r.d} dias = ${n(r.P * r.h * r.d, 0)} Wh = <b>${n(r.kwh, 2)} kWh</b> → ${n(r.kwh, 2)} × R$ ${n(S.tar, 3)} = <b>${money(r.kwh * S.tar)}</b></div>`).join('') || 'Acrescente aparelhos à tabela.';
    }
    set([['❄️ Ar-condicionado', 2000, 5], ['📺 Televisão', 150, 6]]);

    /* Etiqueta de eficiência */
    const es = h('div', 'au-sec', '<h3>🏷️ Etiqueta de eficiência energética (Inmetro)</h3><p class="au-sub">Compare duas geladeiras do mesmo tamanho. A classe <b>A</b> é a mais eficiente e a <b>E</b>, a menos eficiente. <span class="muted">(consumos ilustrativos)</span></p>'); el.appendChild(es);
    const CL = [['A', '#16a34a', 23], ['B', '#65a30d', 28], ['C', '#eab308', 33], ['D', '#f97316', 39], ['E', '#dc2626', 45]];
    const E = { a: 0, b: 3, dif: 400 };
    const ew = h('div'); es.appendChild(ew);
    function lab(k) { return `<div style="background:#f8fafc;color:#0f172a;border-radius:10px;padding:10px;min-width:220px"><b>Geladeira ${k === 'a' ? '1' : '2'}</b> · classe ${CL[E[k]][0]}<div style="margin-top:6px">${CL.map(([L, col], i) => `<div style="display:flex;align-items:center;gap:6px;margin:3px 0"><span style="display:inline-block;width:${40 + i * 18}px;background:${col};color:#fff;font-weight:800;padding:1px 6px;border-radius:3px 12px 12px 3px">${L}</span>${i === E[k] ? '<b>◀ ' + CL[i][0] + '</b>' : ''}</div>`).join('')}</div><div style="margin-top:6px;font-size:13px">Consumo: <b>${CL[E[k]][2]} kWh/mês</b></div><div class="au-seg" data-k="${k}" style="margin-top:6px;background:#e2e8f0">${CL.map(([L], i) => `<button data-c="${i}" style="color:#0f172a" class="${i === E[k] ? 'on' : ''}">${L}</button>`).join('')}</div></div>`; }
    function ren() {
      const ca = CL[E.a][2], cb = CL[E.b][2], dm = Math.abs(cb - ca) * S.tar, best = ca <= cb ? 1 : 2;
      ew.innerHTML = `<div class="au-row" style="align-items:stretch">${lab('a')}${lab('b')}</div>
        <div class="au-row">A mais eficiente custa a mais: R$ <input class="au-inp" id="edif" value="${n(E.dif, 2)}"></div>
        <div class="au-note ok">A geladeira ${best} gasta <b>${Math.abs(cb - ca)} kWh a menos por mês</b>: economia de <b>${money(dm)}/mês</b> e <b>${money(dm * 12)}/ano</b>. ${dm > 0 ? `A diferença de preço se paga em cerca de <b>${n(E.dif / dm, 0)} meses</b> (${n(E.dif / dm / 12, 1)} anos), e a geladeira dura mais de 10 anos.` : ''}</div>`;
      ew.querySelectorAll('[data-k]').forEach(sg => sg.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) { E[sg.dataset.k] = +b.dataset.c; ren(); } }));
      ew.querySelector('#edif').addEventListener('change', e => { E.dif = numIn(e.target.value); ren(); });
    }
    ren();
    AU.note(es, '🟢 O <b>selo Procel</b> destaca os aparelhos mais eficientes de cada categoria. Aparelhos com tecnologia <b>inverter</b> (ar-condicionado, geladeira) também economizam energia.');
  };

  /* ================= Aula 19 · A conta de luz e as bandeiras ================= */
  AU.labs.conta = el => {
    el.innerHTML = `<h3>🧾 Monte e interprete a conta de energia</h3><p class="au-sub">Leia o medidor, escolha a tarifa e a bandeira do mês. A conta é calculada na hora.</p>`;
    const BAND = { verde: ['Verde', '#16a34a', 0], amarela: ['Amarela', '#eab308', 1.885], v1: ['Vermelha patamar 1', '#dc2626', 4.463], v2: ['Vermelha patamar 2', '#7f1d1d', 7.877] };
    const S = { ant: 12450, atu: 12650, tar: 0.5, band: 'amarela', imp: 0, eco: new Set() };
    const wrap = h('div', 'au-two'); el.appendChild(wrap);
    const left = h('div'), right = h('div'); wrap.appendChild(left); wrap.appendChild(right);
    left.innerHTML = `<div class="au-box" style="text-align:center"><div style="font-size:12px;color:var(--muted)">MEDIDOR (“relógio de luz”)</div><div id="mdig" style="font:700 30px monospace;letter-spacing:4px;background:#020617;color:#86efac;border-radius:8px;padding:8px;margin:6px 0"></div><div style="font-size:12px;color:var(--muted)">kWh</div></div>
      <table class="au-tbl" style="margin-top:8px"><tbody>
      <tr><td>Leitura anterior (kWh)</td><td class="n"><input id="cant"></td></tr>
      <tr><td>Leitura atual (kWh)</td><td class="n"><input id="catu"></td></tr>
      <tr><td>Tarifa (R$/kWh)</td><td class="n"><input id="ctar"></td></tr>
      <tr><td>Bandeira do mês</td><td class="n"><select id="cband" style="width:150px">${Object.entries(BAND).map(([k, b]) => `<option value="${k}">${b[0]}</option>`).join('')}</select></td></tr>
      <tr><td>Acréscimo da bandeira (R$ a cada 100 kWh)</td><td class="n"><input id="cbv"></td></tr>
      <tr><td>Impostos e encargos (%)</td><td class="n"><input id="cimp"></td></tr></tbody></table>`;
    const $ = s => el.querySelector(s);
    const sync = () => { $('#cant').value = S.ant; $('#catu').value = S.atu; $('#ctar').value = n(S.tar, 3); $('#cband').value = S.band; $('#cbv').value = n(BAND[S.band][2], 3); $('#cimp').value = n(S.imp, 1); };
    $('#cant').addEventListener('change', e => { S.ant = num(e.target.value); upd(); });
    $('#catu').addEventListener('change', e => { S.atu = num(e.target.value); upd(); });
    $('#ctar').addEventListener('change', e => { S.tar = numIn(e.target.value); upd(); });
    $('#cband').addEventListener('change', e => { S.band = e.target.value; sync(); upd(); });
    $('#cbv').addEventListener('change', e => { BAND[S.band][2] = numIn(e.target.value); upd(); });
    $('#cimp').addEventListener('change', e => { S.imp = numIn(e.target.value); upd(); });
    const ex = AU.row(el);
    AU.btn(ex, '📘 Exemplo da aula: 200 kWh, R$ 0,50, bandeira amarela', () => { S.ant = 12450; S.atu = 12650; S.tar = 0.5; S.band = 'amarela'; BAND.amarela[2] = 1.85; S.imp = 0; S.eco.clear(); renderEco(); sync(); upd(); });
    AU.btn(ex, '📘 Atividade: 500 kWh, R$ 0,70, vermelha 1', () => { S.ant = 30120; S.atu = 30620; S.tar = 0.7; S.band = 'v1'; BAND.v1[2] = 4.46; S.imp = 0; S.eco.clear(); renderEco(); sync(); upd(); });
    const ECO = [
      ['🚿', 'Banho de 15 para 8 minutos (4 pessoas, chuveiro de 4 500 W)', 63],
      ['💡', 'Trocar 6 lâmpadas incandescentes (60 W) por LED (9 W)', 45.9],
      ['🔌', 'Tirar da tomada aparelhos em stand-by', 10.8],
      ['❄️', 'Ar-condicionado em 23 °C, com portas e janelas fechadas', 18],
      ['🧊', 'Não abrir a geladeira à toa e afastá-la da parede', 4],
      ['👕', 'Juntar as roupas e passar tudo de uma vez', 2],
      ['🌞', 'Aproveitar a luz natural durante o dia', 3.2],
    ];
    const es = h('div', 'au-sec', '<h3>🌱 Ações de economia</h3><p class="au-sub">Marque as atitudes que a família vai adotar (economias estimadas por mês).</p>'); el.appendChild(es);
    const el2 = h('div'); es.appendChild(el2);
    function renderEco() {
      el2.innerHTML = ECO.map(([e, t, k], i) => `<label class="chk" style="color:var(--text);margin:5px 0"><input type="checkbox" data-i="${i}" ${S.eco.has(i) ? 'checked' : ''}> ${e} ${t} <span class="au-chip">−${n(k, 1)} kWh</span></label>`).join('');
      el2.querySelectorAll('input').forEach(c => c.addEventListener('change', () => { c.checked ? S.eco.add(+c.dataset.i) : S.eco.delete(+c.dataset.i); upd(); }));
    }
    renderEco();
    function upd() {
      const base = Math.max(0, S.atu - S.ant), save = [...S.eco].reduce((s, i) => s + ECO[i][2], 0), kwh = Math.max(0, base - save);
      const b = BAND[S.band], energia = kwh * S.tar, adic = kwh / 100 * b[2], sub = energia + adic, imp = sub * S.imp / 100, tot = sub + imp;
      const totBase = (base * S.tar + base / 100 * b[2]) * (1 + S.imp / 100);
      $('#mdig').textContent = String(Math.round(S.atu)).padStart(6, '0');
      right.innerHTML = `<div class="au-bill"><h4>⚡ CONTA DE ENERGIA ELÉTRICA</h4><div style="font-size:12px;color:#475569;margin-bottom:8px">Exemplo para estudo · Consumidor residencial</div>
        <div class="l"><span>Leitura atual − anterior</span><b>${n(S.atu, 0)} − ${n(S.ant, 0)}</b></div>
        <div class="l"><span>Consumo do mês</span><b>${n(base, 0)} kWh</b></div>
        ${save ? `<div class="l" style="color:#15803d"><span>Economia com as ações</span><b>− ${n(Math.min(save, base), 1)} kWh</b></div><div class="l"><span>Consumo com economia</span><b>${n(kwh, 1)} kWh</b></div>` : ''}
        <div class="l"><span>Energia: ${n(kwh, 1)} kWh × R$ ${n(S.tar, 3)}</span><b>${money(energia)}</b></div>
        <div class="l"><span>Bandeira <span class="flag" style="background:${b[1]};color:#fff">${b[0]}</span><br><small>${n(kwh / 100, 2)} × R$ ${n(b[2], 3)}</small></span><b>${money(adic)}</b></div>
        ${S.imp ? `<div class="l"><span>Impostos e encargos (${n(S.imp, 1)}%)</span><b>${money(imp)}</b></div>` : ''}
        <div class="l tot"><span>TOTAL A PAGAR</span><span>${money(tot)}</span></div>
        ${save ? `<div style="color:#15803d;font-weight:700;margin-top:4px">Economia: ${money(totBase - tot)} por mês · ${money((totBase - tot) * 12)} por ano</div>` : ''}</div>`;
    }
    sync(); upd();

    const hs = h('div', 'au-sec', '<h3>📈 Histórico de consumo (12 meses)</h3><p class="au-sub">As contas mostram o consumo dos meses anteriores. Compare e descubra quando a família gastou mais. Passe o mouse ou toque nas barras.</p>'); el.appendChild(hs);
    const H = [['dez', 228], ['jan', 251], ['fev', 246], ['mar', 192], ['abr', 180], ['mai', 171], ['jun', 185], ['jul', 194], ['ago', 182], ['set', 205], ['out', 221], ['nov', 238]];
    const c = AU.canvas(hs, 800, 230), ctx = c.ctx; let hov = -1;
    AU.drag(c, { hover: p => { hov = Math.floor((p.x - 50) / 60); }, click: p => { hov = Math.floor((p.x - 50) / 60); } });
    AU.loop(() => {
      c.clear('#0b1220');
      H.forEach(([m, v], i) => {
        const x = 60 + i * 60, hh = v / 260 * 170;
        ctx.fillStyle = i === hov ? '#7dd3fc' : v > 230 ? '#f59e0b' : '#38bdf8'; ctx.fillRect(x, 200 - hh, 40, hh);
        D.text(ctx, m, x + 20, 214, { size: 12, color: C.muted });
        if (i === hov || v > 245 || v < 175) D.text(ctx, v + ' kWh', x + 20, 190 - hh, { size: 12, weight: 700 });
      });
      D.text(ctx, 'Verão (dez–fev): mais ventilador e ar-condicionado. Inverno: banhos mais quentes e longos.', 400, 16, { size: 12.5, color: C.yellow });
    });
    AU.note(el, '🚩 <b>Por que existem bandeiras?</b> Quando chove pouco, os reservatórios das hidrelétricas baixam e é preciso ligar <b>termelétricas</b>, que produzem energia mais cara (e poluente). A bandeira avisa o consumidor desse custo extra. Em São Paulo, isso costuma acontecer em setembro e outubro, no fim da estação seca.', 'warn');
  };

  /* ================= Aula 20 · Simulador da casa modelo ================= */
  AU.labs.casa = el => {
    el.innerHTML = `<h3>🏠 Simulador de consumo da casa modelo</h3><p class="au-sub">Compare o uso <b>padrão</b> com o uso <b>econômico</b>. Os tempos e potências iniciais são os da aula e reproduzem os totais do livro (292,15 e 160,01 kWh/mês). Altere à vontade!</p>`;
    // tempos guardados em MINUTOS por dia
    const MODEL = [
      ['Sala de estar', [['📺 Televisão', 180, 240, 120], ['💡 Lâmpada LED', 15, 240, 120], ['❄️ Ar-condicionado', 1000, 180, 60]]],
      ['Quarto', [['🛋️ Abajur', 60, 360, 180], ['🌀 Ventilador', 72, 240, 120]]],
      ['Banheiro', [['🚿 Chuveiro elétrico', 4500, 30, 20]]],
      ['Cozinha', [['🧊 Geladeira', 55, 1440, 1440], ['🍿 Micro-ondas', 1398, 30, 12]]],
      ['Escritório', [['💻 Computador', 118, 480, 240], ['💡 Lâmpada', 15, 360, 180], ['🖨️ Impressora', 14.6, 30, 12]]],
    ];
    const CAT = [['👕 Ferro de passar', 1000, 30, 15], ['🧺 Máquina de lavar', 500, 60, 30], ['🍟 Air fryer', 1500, 30, 15], ['💨 Secador de cabelo', 1900, 15, 8], ['🎮 Videogame', 150, 180, 60], ['📱 Carregador', 10, 180, 120], ['📶 Roteador Wi-Fi', 12, 1440, 1440], ['🧊 Freezer', 100, 1440, 1440], ['🥤 Liquidificador', 300, 10, 5]];
    const BAND = [['Verde', 0], ['Amarela', 1.885], ['Vermelha 1', 4.463], ['Vermelha 2', 7.877]];
    const S = { rooms: [], unit: 'h', dias: 30, tar: 0.671, band: 0 };
    const reset = () => { S.rooms = MODEL.map(([r, ap]) => ({ r, ap: ap.map(a => ({ nm: a[0], P: a[1], t1: a[2], t2: a[3] })) })); };
    reset();
    const top = AU.row(el);
    AU.seg(top, [['h', 'Tempo em horas/dia'], ['min', 'em minutos/dia']], 'h', v => { S.unit = v; render(); });
    top.insertAdjacentHTML('beforeend', `<label>Tarifa R$/kWh <input class="au-inp" id="htar" value="0,671" style="width:80px"></label><label>Bandeira <select id="hband">${BAND.map((b, i) => `<option value="${i}">${b[0]}</option>`).join('')}</select></label>`);
    top.querySelector('#htar').addEventListener('change', e => { S.tar = numIn(e.target.value); render(); });
    top.querySelector('#hband').addEventListener('change', e => { S.band = +e.target.value; render(); });
    const box = h('div'); el.appendChild(box);
    const add = AU.row(el);
    const selA = h('select'); selA.innerHTML = CAT.map((c, i) => `<option value="${i}">${c[0]} (${n(c[1], 0)} W)</option>`).join(''); add.appendChild(selA);
    const selR = h('select'); add.appendChild(selR);
    AU.btn(add, '➕ Acrescentar', () => { const c = CAT[+selA.value]; S.rooms[+selR.value].ap.push({ nm: c[0], P: c[1], t1: c[2], t2: c[3] }); render(); });
    AU.btn(add, '↺ Voltar à casa modelo da aula', () => { reset(); render(); });
    const res = h('div'); el.appendChild(res);
    const cs = h('div', 'au-sec', '<h3>📊 Consumo por aparelho (kWh/mês)</h3>'); el.appendChild(cs);
    const cwrap = h('div'); cs.appendChild(cwrap);
    const fmtT = m => S.unit === 'h' ? n(m / 60, 2) : n(m, 0);
    const kwh = (P, m) => P * (m / 60) * S.dias / 1000;
    function render() {
      selR.innerHTML = S.rooms.map((r, i) => `<option value="${i}">${r.r}</option>`).join('');
      let T1 = 0, T2 = 0; const all = [];
      const rows = S.rooms.map((r, ri) => {
        let r1 = 0, r2 = 0;
        const lines = r.ap.map((a, ai) => { const k1 = kwh(a.P, a.t1), k2 = kwh(a.P, a.t2); r1 += k1; r2 += k2; all.push({ nm: a.nm, k1, k2 });
          return `<tr><td>${a.nm}</td><td class="n"><input data-r="${ri}" data-a="${ai}" data-k="P" value="${n(a.P, 2)}"></td><td class="n"><input data-r="${ri}" data-a="${ai}" data-k="t1" value="${fmtT(a.t1)}" style="width:66px"></td><td class="n"><input data-r="${ri}" data-a="${ai}" data-k="t2" value="${fmtT(a.t2)}" style="width:66px"></td><td class="n">${n(k1, 2)}</td><td class="n"><b>${n(k2, 2)}</b></td><td><button class="au-b" data-del="${ri}:${ai}" title="Remover">✕</button></td></tr>`; }).join('');
        T1 += r1; T2 += r2;
        return `<tr class="room"><td colspan="4">${r.r}</td><td class="n">${n(r1, 2)}</td><td class="n">${n(r2, 2)}</td><td></td></tr>${lines}`;
      }).join('');
      const u = S.unit === 'h' ? 'h/dia' : 'min/dia';
      box.innerHTML = `<div class="au-scroll"><table class="au-tbl"><thead><tr><th>Aparelho</th><th class="n">Potência (W)</th><th class="n">Padrão (${u})</th><th class="n">Econômico (${u})</th><th class="n">kWh padrão</th><th class="n">kWh econ.</th><th></th></tr></thead><tbody>${rows}</tbody>
        <tfoot><tr><td colspan="4">Consumo total por mês (${S.dias} dias)</td><td class="n">${n(T1, 2)}</td><td class="n">${n(T2, 2)}</td><td></td></tr></tfoot></table></div>`;
      box.querySelectorAll('input[data-r]').forEach(inp => inp.addEventListener('change', () => {
        const a = S.rooms[+inp.dataset.r].ap[+inp.dataset.a], k = inp.dataset.k, v = numIn(inp.value);
        a[k] = k === 'P' ? v : Math.min(1440, (S.unit === 'h' ? v * 60 : v)); render();
      }));
      box.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => { const [ri, ai] = b.dataset.del.split(':').map(Number); S.rooms[ri].ap.splice(ai, 1); render(); }));
      const fl = BAND[S.band][1], cost = k => k * S.tar + k / 100 * fl;
      const eco = T1 - T2, pct = T1 ? eco / T1 * 100 : 0;
      const top3 = all.slice().sort((a, b) => b.k1 - a.k1).slice(0, 4).map(a => a.nm).join(', ');
      res.innerHTML = `<div class="au-read"><div><span>Uso padrão</span><b>${n(T1, 2)} kWh</b></div><div><span>Uso econômico</span><b class="ok">${n(T2, 2)} kWh</b></div><div><span>Economia</span><b class="ok">${n(eco, 2)} kWh (${n(pct, 0)}%)</b></div><div><span>Conta padrão</span><b>${money(cost(T1))}</b></div><div><span>Conta econômica</span><b class="ok">${money(cost(T2))}</b></div></div>
        <div class="au-note">Os aparelhos que mais consomem no uso padrão: <b>${top3}</b>. Cálculo: kWh = potência (W) × horas por dia × ${S.dias} dias ÷ 1 000. Ex.: chuveiro de ${n(S.rooms[2]?.ap[0]?.P || 4500, 0)} W por ${fmtT(S.rooms[2]?.ap[0]?.t1 || 30)} ${u}.</div>`;
      drawChart(all);
    }
    let c = null, cn = -1, last = [];
    function drawChart(all) {
      last = all;
      if (!c || cn !== all.length) { cwrap.innerHTML = ''; cn = all.length; c = AU.canvas(cwrap, 800, 40 + all.length * 30); c.onresize = paint; }
      paint();
    }
    function paint() {
      const all = last, ctx = c.ctx, mx = Math.max(1, ...all.map(a => a.k1));
      c.clear('#0b1220');
      all.forEach((a, i) => {
        const y = 24 + i * 30;
        D.text(ctx, a.nm, 210, y + 7, { size: 12.5, align: 'right' });
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(220, y, a.k1 / mx * 470, 10);
        ctx.fillStyle = '#4ade80'; ctx.fillRect(220, y + 11, a.k2 / mx * 470, 10);
        D.text(ctx, n(a.k1, 1), 226 + a.k1 / mx * 470, y + 5, { size: 11, align: 'left', color: '#fde68a' });
        D.text(ctx, n(a.k2, 1), 226 + a.k2 / mx * 470, y + 16, { size: 11, align: 'left', color: '#bbf7d0' });
      });
      D.text(ctx, '■ padrão', 720, 12, { size: 12, color: '#f59e0b', align: 'left' }); D.text(ctx, '■ econômico', 720, 28, { size: 12, color: '#4ade80', align: 'left' });
    }
    render();
    AU.note(el, '⏱️ <b>Cuidado com a unidade:</b> 30 minutos = 0,5 hora; 20 minutos ≈ 0,33 hora. No uso econômico do livro, o banho caiu de 30 para 20 minutos e o micro-ondas de 0,5 h para 0,2 h (12 min).', 'warn');
  };

  /* ================= Aula 21 · Lixo eletrônico e consumo sustentável ================= */
  AU.labs.lixo = el => {
    el.innerHTML = `<h3>♻️ Onde descartar?</h3><p class="au-sub">Clique num resíduo (ou arraste) e depois no destino correto.</p>`;
    const s = AU.sorter(el, {
      bins: [['e', '📱 Ponto de coleta de eletrônicos, pilhas e lâmpadas', 'b'], ['r', '♻️ Coleta seletiva (reciclável)', 'g'], ['o', '🍌 Orgânico (compostagem)', 'y'], ['x', '🗑️ Rejeito (lixo comum)', 'r']],
      items: [
        { id: 'pi', label: '🔋 Pilhas usadas', ok: 'e', why: 'Têm metais pesados: vão para pontos de coleta (supermercados e lojas recebem).' },
        { id: 'bc', label: '🔋 Bateria de celular', ok: 'e', why: 'Bateria de lítio pode pegar fogo e contaminar: ponto de coleta.' },
        { id: 'ce', label: '📱 Celular antigo', ok: 'e', why: 'Lixo eletrônico: tem ouro, cobre e também substâncias tóxicas.' },
        { id: 'lf', label: '💡 Lâmpada fluorescente', ok: 'e', why: 'Contém mercúrio: deve ir para a coleta especial, sem quebrar.' },
        { id: 'cr', label: '🔌 Carregador quebrado', ok: 'e', why: 'Eletrônico: ponto de coleta.' },
        { id: 'fo', label: '🎧 Fone de ouvido', ok: 'e', why: 'Eletrônico: ponto de coleta.' },
        { id: 'te', label: '⌨️ Teclado de computador', ok: 'e', why: 'Eletrônico: ponto de coleta.' },
        { id: 'pet', label: '🧴 Garrafa PET', ok: 'r', why: 'Plástico reciclável.' },
        { id: 'lt', label: '🥫 Lata de alumínio', ok: 'r', why: 'O alumínio pode ser reciclado infinitas vezes.' },
        { id: 'jo', label: '📰 Jornal', ok: 'r', why: 'Papel reciclável.' },
        { id: 'vi', label: '🍯 Pote de vidro', ok: 'r', why: 'Vidro reciclável.' },
        { id: 'ba', label: '🍌 Casca de banana', ok: 'o', why: 'Orgânico: vira adubo na compostagem.' },
        { id: 'cf', label: '☕ Borra de café', ok: 'o', why: 'Orgânico: ótimo para a compostagem.' },
        { id: 'ph', label: '🧻 Papel higiênico usado', ok: 'x', why: 'Rejeito: não pode ser reciclado.' },
        { id: 'es', label: '🧽 Esponja de cozinha', ok: 'x', why: 'Rejeito: lixo comum.' },
      ],
    });
    AU.btn(AU.row(el), '👁 Mostrar respostas', () => s.reveal());

    const cs = h('div', 'au-sec', '<h3>🔍 O que tem dentro de um celular?</h3><p class="au-sub">Clique em cada material para descobrir por que o celular não pode ir para o lixo comum.</p>'); el.appendChild(cs);
    const MAT = [
      ['🥇', 'Ouro', 'v', 'Nos contatos da placa. Uma tonelada de celulares tem mais ouro do que uma tonelada de minério!'],
      ['🥈', 'Prata', 'v', 'Na placa e nas soldas. Valiosa e reciclável.'],
      ['🟠', 'Cobre', 'v', 'Nas trilhas da placa e nos fios: excelente condutor, reciclável.'],
      ['🔋', 'Lítio e cobalto', 'm', 'Na bateria. A mineração causa impactos ambientais e sociais; reciclar diminui a extração.'],
      ['🧲', 'Terras raras', 'm', 'Nos ímãs do alto-falante e do vibracall. Difíceis de extrair.'],
      ['☠️', 'Chumbo', 't', 'Em soldas antigas: tóxico, contamina solo e água e afeta o sistema nervoso.'],
      ['☠️', 'Mercúrio', 't', 'Em telas e lâmpadas antigas: muito tóxico, acumula nos peixes e nas pessoas.'],
      ['☠️', 'Cádmio', 't', 'Em baterias recarregáveis antigas (NiCd): tóxico para os rins.'],
      ['🧪', 'Plásticos e vidro', 'v', 'Carcaça e tela: podem ser reciclados quando separados corretamente.'],
    ];
    const g = h('div', 'au-cards'); cs.appendChild(g);
    g.innerHTML = MAT.map((m, i) => `<button class="au-card" data-i="${i}"><span class="em">${m[0]}</span><b>${m[1]}</b><div class="au-fb" style="margin-top:4px"></div></button>`).join('');
    g.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; const m = MAT[+b.dataset.i]; b.classList.add(m[2] === 't' ? 'badc' : 'good'); b.querySelector('.au-fb').innerHTML = (m[2] === 't' ? '⚠️ <b>Tóxico.</b> ' : m[2] === 'm' ? '⛏️ <b>Recurso escasso.</b> ' : '💰 <b>Valioso.</b> ') + m[3]; });

    const ps = h('div', 'au-sec', '<h3>🌍 Desenvolvimento sustentável</h3>'); el.appendChild(ps);
    ps.insertAdjacentHTML('beforeend', `<div class="au-cards">
      <div class="au-card"><span class="em">🌳</span><b>Ambiental</b><br>Preservar recursos naturais, reduzir resíduos e poluição. Ex.: reciclar o lixo eletrônico.</div>
      <div class="au-card"><span class="em">🤝</span><b>Social</b><br>Justiça e inclusão: benefícios para todos. Ex.: levar energia elétrica a comunidades isoladas.</div>
      <div class="au-card"><span class="em">💼</span><b>Econômico</b><br>Crescer sem sobrecarregar o planeta. Ex.: reaproveitar os metais em vez de extrair novos.</div></div>
      <div class="au-chain" style="margin-top:10px"><span>🤔 Repensar</span><i>→</i><span>🙅 Recusar</span><i>→</i><span>📉 Reduzir</span><i>→</i><span>🔧 Reutilizar e consertar</span><i>→</i><span>♻️ Reciclar</span></div>`);
    AU.note(ps, '<b>ODS 12 · Consumo e produção responsáveis:</b> reduzir resíduos, aumentar a reciclagem e o reúso e usar a energia com eficiência. Pela <b>logística reversa</b> (Política Nacional de Resíduos Sólidos), fabricantes, importadores e lojas devem receber de volta e dar destino correto aos eletrônicos, pilhas e lâmpadas.');
    AU.note(ps, '⚡ <b>Energia para todos?</b> No Brasil, ainda há comunidades (principalmente na Amazônia) sem acesso regular à eletricidade, por falta de infraestrutura e pelo custo alto. Sistemas solares com baterias levam energia a esses lugares.', 'warn');
  };
})();
