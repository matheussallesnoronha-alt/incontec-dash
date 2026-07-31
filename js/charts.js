const TP = { backgroundColor:'#141C17', borderColor:'#1E2823', borderWidth:1, titleColor:'#EAF2ED', bodyColor:'#EAF2ED', cornerRadius:8, padding:10 };
const charts = {};

function initChartDefaults() {
  Chart.defaults.color = '#7E9389';
  Chart.defaults.font.family = "'Inter',sans-serif";
  Chart.defaults.font.size = 11;
}

function destroyChart(key) {
  if (charts[key]) { charts[key].destroy(); delete charts[key]; }
}

// Dashboard: evolução mensal (linha/área) + saldo por banco (barra/pizza)
function renderDashboardCharts(state) {
  const { fluxoMensal, bancos } = state;
  const mensalLabels = fluxoMensal.map(m => MES_LABEL[m.MonthNumber - 1] || m.MonthNumber);
  const mensalSaldo = fluxoMensal.map(m => m.saldo);
  const bancoLabels = bancos.map(b => b.Descri_banco);
  const bancoSaldos = bancos.map(b => b.saldo);
  const bancoCores = bancos.map(b => colorForBank(b.Descri_banco));

  destroyChart('line'); destroyChart('bar'); destroyChart('pie'); destroyChart('area');

  charts.line = new Chart(document.getElementById('lineChart'),{
    type:'line', data:{ labels:mensalLabels, datasets:[{ data:mensalSaldo, borderColor:'#6FE3A6', borderWidth:2, pointRadius:0, tension:.4, fill:false }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} },
      scales:{ x:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}}, y:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{callback:fmtM}} } }
  });
  charts.bar = new Chart(document.getElementById('barChart'),{
    type:'bar', data:{ labels:bancoLabels, datasets:[{ data:bancoSaldos, backgroundColor:bancoCores, borderRadius:4 }] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} },
      scales:{ x:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{callback:fmtK}}, y:{grid:{display:false}, border:{display:false}} } }
  });
  charts.pie = new Chart(document.getElementById('pieChart'),{
    type:'doughnut', data:{ labels:bancoLabels, datasets:[{ data:bancoSaldos, backgroundColor:bancoCores, borderWidth:0, hoverOffset:4 }] },
    options:{ responsive:true, maintainAspectRatio:false, cutout:'65%',
      plugins:{ legend:{display:true, position:'right', labels:{color:'#7E9389', font:{size:11}, padding:12}}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} } }
  });
  const aCtx = document.getElementById('areaChart').getContext('2d');
  const grad = aCtx.createLinearGradient(0,0,0,200);
  grad.addColorStop(0,'rgba(111,227,166,.35)'); grad.addColorStop(1,'rgba(111,227,166,0)');
  charts.area = new Chart(aCtx,{
    type:'line', data:{ labels:mensalLabels, datasets:[{ data:mensalSaldo, borderColor:'#6FE3A6', borderWidth:2, backgroundColor:grad, pointRadius:0, tension:.4, fill:true }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} },
      scales:{ x:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}}, y:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{callback:fmtM}} } }
  });
}

function renderFluxoChart(state) {
  const { fluxoCaixa } = state;
  destroyChart('fluxo');
  charts.fluxo = new Chart(document.getElementById('fluxoChart'),{
    type:'line', data:{ labels:fluxoCaixa.map(d=>fmtDateBR(d.Data)), datasets:[{ data:fluxoCaixa.map(d=>d.saldo_atual), borderColor:'#6FE3A6', borderWidth:2, pointRadius:0, tension:.3, fill:true, backgroundColor:'rgba(111,227,166,.1)' }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} },
      scales:{ x:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{maxTicksLimit:10}}, y:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{callback:fmtM}} } }
  });
}

function renderBancosChart(state) {
  const { bancos } = state;
  destroyChart('bancos');
  charts.bancos = new Chart(document.getElementById('bancosChart'),{
    type:'bar', data:{ labels:bancos.map(b=>b.Descri_banco), datasets:[{ data:bancos.map(b=>b.saldo), backgroundColor:bancos.map(b=>colorForBank(b.Descri_banco)), borderRadius:6 }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>fmtBRL(c.raw)}} },
      scales:{ x:{grid:{display:false}, border:{display:false}}, y:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}, ticks:{callback:fmtK}} } }
  });
}

function renderIndicadoresChart(state) {
  destroyChart('pmr');
  const monthly = state.pmr.monthly;
  if (!monthly.length) return;
  charts.pmr = new Chart(document.getElementById('pmrChart'),{
    type:'line', data:{ labels:monthly.map(m=>m.mes), datasets:[{ data:monthly.map(m=>m.dias), borderColor:'#6FE3A6', borderWidth:2, pointRadius:3, pointBackgroundColor:'#6FE3A6', tension:.4, fill:false }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TP, callbacks:{label:c=>`${c.raw} dias`}} },
      scales:{ x:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}}, y:{grid:{color:'#1E2823', drawTicks:false}, border:{display:false}} } }
  });
}
