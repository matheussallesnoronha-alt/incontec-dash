// ── Chart defaults ────────────────────────────────────
Chart.defaults.color = '#7E9389';
Chart.defaults.font.family = "'Inter',sans-serif";
Chart.defaults.font.size = 11;
const TP = { backgroundColor:'#141C17', borderColor:'#1E2823', borderWidth:1, titleColor:'#EAF2ED', bodyColor:'#EAF2ED', cornerRadius:8, padding:10 };

// Dashboard charts
new Chart(document.getElementById('lineChart'),{
  type:'line', data:{ labels:evolucao.map(d=>d.mes), datasets:[{ data:evolucao.map(d=>d.saldo), borderColor:'#6FE3A6', borderWidth:2, pointRadius:0, tension:.4, fill:false }] },
  options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} },
    scales:{ x:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}}, y:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{callback:fmtM}} } }
});
new Chart(document.getElementById('barChart'),{
  type:'bar', data:{ labels:saldosPorBanco.map(d=>d.banco), datasets:[{ data:saldosPorBanco.map(d=>d.saldo), backgroundColor:saldosPorBanco.map(d=>d.cor), borderRadius:4 }] },
  options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} },
    scales:{ x:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{callback:fmtK}}, y:{grid:{display:false}, border:{display:false}} } }
});
new Chart(document.getElementById('pieChart'),{
  type:'doughnut', data:{ labels:saldosPorBanco.map(d=>d.banco), datasets:[{ data:saldosPorBanco.map(d=>d.saldo), backgroundColor:saldosPorBanco.map(d=>d.cor), borderWidth:0, hoverOffset:4 }] },
  options:{ responsive:true, maintainAspectRatio:false, cutout:'65%',
    plugins:{ legend:{display:true, position:'right', labels:{color:'#7E9389', font:{size:11}, padding:12}}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} } }
});
const aCtx = document.getElementById('areaChart').getContext('2d');
const grad = aCtx.createLinearGradient(0,0,0,200);
grad.addColorStop(0,'rgba(111,227,166,.35)'); grad.addColorStop(1,'rgba(111,227,166,0)');
new Chart(aCtx,{
  type:'line', data:{ labels:evolucao.map(d=>d.mes), datasets:[{ data:evolucao.map(d=>d.saldo), borderColor:'#6FE3A6', borderWidth:2, backgroundColor:grad, pointRadius:0, tension:.4, fill:true }] },
  options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} },
    scales:{ x:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}}, y:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{callback:fmtM}} } }
});

// ── Fluxo de Caixa chart ──────────────────────────────
new Chart(document.getElementById('fluxoChart'),{
  type:'line', data:{ labels:fluxoDays.map(d=>`D+${d}`), datasets:[{ data:fluxoData, borderColor:'#6FE3A6', borderWidth:2, pointRadius:0, tension:.3, fill:true, backgroundColor:'rgba(111,227,166,.1)' }] },
  options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} },
    scales:{ x:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{maxTicksLimit:10}}, y:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{callback:fmtM}} } }
});

// ── Bancos page chart ─────────────────────────────────
new Chart(document.getElementById('bancosChart'),{
  type:'bar', data:{ labels:saldosPorBanco.map(d=>d.banco), datasets:[{ data:saldosPorBanco.map(d=>d.saldo), backgroundColor:saldosPorBanco.map(d=>d.cor), borderRadius:6 }] },
  options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} },
    scales:{ x:{grid:{display:false}, border:{display:false}}, y:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{callback:fmtK}} } }
});

// ── Indicadores charts ────────────────────────────────
new Chart(document.getElementById('liqChart'),{
  type:'bar', data:{ labels:MESES, datasets:[{ label:'Liquidez', data:[1.9,2.1,1.8,2.3,2.0,2.34], backgroundColor:'rgba(111,227,166,.7)', borderRadius:4 }] },
  options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP} },
    scales:{ x:{grid:{display:false}, border:{display:false}}, y:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, min:0, max:3} } }
});
new Chart(document.getElementById('pmrChart'),{
  type:'line', data:{ labels:MESES, datasets:[{ data:[45,42,38,35,33,32], borderColor:'#6FE3A6', borderWidth:2, pointRadius:3, pointBackgroundColor:'#6FE3A6', tension:.4, fill:false }] },
  options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>`${c.raw} dias`}} },
    scales:{ x:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}}, y:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}} } }
});
