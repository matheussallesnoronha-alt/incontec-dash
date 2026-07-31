// ── AI panel (shared logic, two instances) ────────────
// Rule-based for now; replaced by a real model call (via n8n webhook) in a later PR.
const PERGUNTAS = [
  "Qual o saldo total disponível?",
  "Qual banco possui maior saldo?",
  "Como está a situação financeira?",
  "Existem riscos financeiros?",
  "Faça um resumo executivo.",
  "Existe concentração excessiva de recursos?",
];

function gerarResposta(pergunta, state) {
  const { kpis, bancoStats } = state;
  const p = pergunta.toLowerCase();
  const lider = bancoStats.bancoLider ? bancoStats.bancoLider.Descri_banco : "—";
  if (p.includes("total") || p.includes("disponível")) return `O saldo consolidado atual é de ${fmtBRL(kpis.saldo_bancos)}, distribuído entre ${bancoStats.qtdBancos} instituições bancárias.`;
  if (p.includes("maior saldo") || p.includes("banco possui")) return `O banco com maior saldo é ${lider}, com ${fmtBRL(bancoStats.bancoLider ? bancoStats.bancoLider.saldo : 0)} (${bancoStats.concentracao}% do total consolidado).`;
  if (p.includes("situação financeira")) return `O saldo consolidado é de ${fmtBRL(kpis.saldo_bancos)}, com ${fmtBRL(kpis.total_receber)} ainda a receber de ${kpis.total_vendas} vendas registradas.`;
  if (p.includes("risco")) return bancoStats.concentracao > 40 ? `Identificado risco de concentração bancária: ${lider} representa ${bancoStats.concentracao}% dos recursos. Recomenda-se diversificação entre instituições.` : `Não foram identificados riscos críticos de concentração. A distribuição entre bancos está dentro de parâmetros saudáveis.`;
  if (p.includes("resumo executivo")) return `Resumo executivo: saldo consolidado de ${fmtBRL(kpis.saldo_bancos)}, liderado por ${lider} (${bancoStats.concentracao}%). Total a receber de ${fmtBRL(kpis.total_receber)}.`;
  if (p.includes("concentração")) return bancoStats.concentracao > 40 ? `Sim, há concentração excessiva: ${lider} detém ${bancoStats.concentracao}% do saldo total. Sugere-se redistribuir recursos para reduzir exposição a uma única instituição.` : `Não há concentração excessiva. Os recursos estão razoavelmente distribuídos entre as instituições financeiras.`;
  return `Não foi possível localizar essa informação nos dados disponíveis no momento.`;
}

function setupAI(state, messagesId, quickId, inputId, sendId) {
  const msgsEl = document.getElementById(messagesId);
  const inputEl = document.getElementById(inputId);
  const { kpis, bancoStats } = state;
  const lider = bancoStats.bancoLider ? bancoStats.bancoLider.Descri_banco : "—";
  let msgs = [{ role:'ai', text:`Resumo executivo: saldo consolidado de ${fmtBRL(kpis.saldo_bancos)}. ${lider} concentra ${bancoStats.concentracao}% dos recursos.` }];

  function render() {
    msgsEl.innerHTML = '';
    msgs.forEach(m => {
      const d = document.createElement('div');
      d.className = `message ${m.role}`;
      d.textContent = m.text;
      msgsEl.appendChild(d);
    });
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function send(text) {
    if (!text.trim()) return;
    msgs.push({ role:'user', text });
    msgs.push({ role:'ai', text:gerarResposta(text, state) });
    render();
    inputEl.value = '';
  }

  const qEl = document.getElementById(quickId);
  qEl.innerHTML = '';
  PERGUNTAS.forEach(q => {
    const btn = document.createElement('button');
    btn.className = 'quick-btn';
    btn.textContent = q;
    btn.onclick = () => send(q);
    qEl.appendChild(btn);
  });

  document.getElementById(sendId).onclick = () => send(inputEl.value);
  inputEl.addEventListener('keydown', e => { if (e.key==='Enter') send(inputEl.value); });
  render();
}
