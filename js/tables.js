// ── Dashboard: banner + cards ─────────────────────────
const warnHtml = concentracao > 40
  ? `<span class="warn">${I.alert} Atenção à concentração bancária.</span>`
  : 'Nenhum risco crítico identificado.';
document.getElementById('banner').innerHTML = `
  <span style="color:var(--accent);flex-shrink:0;margin-top:2px;width:18px;height:18px">${I.trending}</span>
  <span><span class="hi">Resumo executivo:</span> saldo consolidado de <span class="val">${fmtBRL(saldoTotal)}</span>.
  ${bancoLider.banco} concentra <span class="val">${concentracao}%</span> dos recursos. ${warnHtml}</span>`;

const cardsEl = document.getElementById('cards');
[
  { label:"Saldo Consolidado", value:fmtBRL(saldoTotal), ik:"wallet",   trend:3.2 },
  { label:"Qtd. de Bancos",    value:qtdBancos,           ik:"landmark", trend:undefined },
  { label:"Qtd. de Contas",    value:qtdContas,           ik:"bar",      trend:undefined },
  { label:"Saldo Médio",       value:fmtBRL(saldoMedio),  ik:"gauge",    trend:undefined },
  { label:"Banco Líder",       value:bancoLider.banco,    ik:"trending", trend:concentracao },
].forEach(m => {
  const badge = m.trend!==undefined ? `<span class="badge ${m.trend>=0?'pos':'neg'}">${m.trend>=0?'+':''}${m.trend}%</span>` : '';
  const d = document.createElement('div');
  d.className = 'card';
  d.innerHTML = `<div class="card-top"><div class="card-icon">${I[m.ik]}</div>${badge}</div>
    <div><div class="card-label">${m.label}</div><div class="card-value">${m.value}</div></div>`;
  cardsEl.appendChild(d);
});

// ── Contas a Receber table ────────────────────────────
const statusColor = s => s==="Vencido" ? "#E38C8C" : s==="Pago" ? "#6FE3A6" : "#E3C26A";
const recTbody = document.getElementById('receber-tbody');
receber.forEach(r => {
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${r.cliente}</td><td style="color:var(--muted)">${r.obra}</td><td style="color:var(--muted)">${r.venc}</td><td style="font-weight:500;color:var(--accent)">${fmtBRL(r.valor)}</td>
    <td><span style="font-size:11px;padding:2px 8px;border-radius:4px;background:${statusColor(r.status)}22;color:${statusColor(r.status)}">${r.status}</span></td>`;
  recTbody.appendChild(tr);
});

// ── Contas a Pagar table ──────────────────────────────
const pagTbody = document.getElementById('pagar-tbody');
pagar.forEach(p => {
  const sc = p.status==="Hoje" ? "#E3C26A" : "#7E9389";
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${p.forn}</td><td style="color:var(--muted)">${p.cat}</td><td style="color:var(--muted)">${p.venc}</td><td style="font-weight:500;color:#E38C8C">${fmtBRL(p.valor)}</td>
    <td><span style="font-size:11px;padding:2px 8px;border-radius:4px;background:${sc}22;color:${sc}">${p.status}</span></td>`;
  pagTbody.appendChild(tr);
});

// ── Bancos page ───────────────────────────────────────
const bancosCards = document.getElementById('banco-cards');
[
  { label:"Saldo Total",   value:fmtBRL(saldoTotal), ik:"wallet",   trend:undefined },
  { label:"Qtd. Bancos",   value:qtdBancos,           ik:"landmark", trend:undefined },
  { label:"Qtd. Contas",   value:qtdContas,           ik:"bar",      trend:undefined },
  { label:"Banco Líder",   value:bancoLider.banco,    ik:"trending", trend:concentracao },
  { label:"Saldo Médio",   value:fmtBRL(saldoMedio),  ik:"gauge",    trend:undefined },
].forEach(m => {
  const badge = m.trend!==undefined ? `<span class="badge ${m.trend>=0?'pos':'neg'}">${m.trend>=0?'+':''}${m.trend}%</span>` : '';
  const d = document.createElement('div');
  d.className = 'card';
  d.innerHTML = `<div class="card-top"><div class="card-icon">${I[m.ik]}</div>${badge}</div>
    <div><div class="card-label">${m.label}</div><div class="card-value">${m.value}</div></div>`;
  bancosCards.appendChild(d);
});

const bancosTbody = document.getElementById('bancos-tbody');
saldosPorBanco.forEach(b => {
  const pct = Math.round((b.saldo/saldoTotal)*100);
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><span class="banco-dot" style="background:${b.cor}"></span>${b.banco}</td>
    <td style="color:var(--muted)">${b.ag}</td>
    <td style="color:var(--muted)">${b.contas}</td>
    <td style="font-weight:500;color:var(--accent)">${fmtBRL(b.saldo)}</td>
    <td style="min-width:120px"><div style="font-size:11px;color:var(--muted);margin-bottom:4px">${pct}%</div>
      <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${b.cor}"></div></div></td>`;
  bancosTbody.appendChild(tr);
});

// ── Indicadores page ──────────────────────────────────
const indGrid = document.getElementById('ind-grid');
[
  { label:"Índice de Liquidez",       value:"2.34",  sub:"Meta: > 1.5" },
  { label:"Prazo Médio Recebimento",  value:"32 d",  sub:"Meta: < 45 dias" },
  { label:"Prazo Médio Pagamento",    value:"28 d",  sub:"Mantido em dia" },
  { label:"Giro de Caixa",           value:"4.1x",  sub:"Ciclo mensal" },
  { label:"Endividamento",            value:"18%",   sub:"Patrimônio líquido" },
  { label:"Margem Operacional",       value:"11.2%", sub:"Acumulado no ano" },
].forEach(ind => {
  const d = document.createElement('div');
  d.className = 'ind-card';
  d.innerHTML = `<div class="ind-label">${ind.label}</div><div class="ind-value">${ind.value}</div><div class="ind-sub">${ind.sub}</div>`;
  indGrid.appendChild(d);
});
