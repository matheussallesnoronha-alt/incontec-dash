// ── AI panel (shared logic, two instances) ────────────
const PERGUNTAS = [
  "Qual o saldo total disponível?",
  "Qual banco possui maior saldo?",
  "Como está a situação financeira?",
  "Existem riscos financeiros?",
  "Faça um resumo executivo.",
  "Existe concentração excessiva de recursos?",
];

function gerarResposta(pergunta) {
  const p = pergunta.toLowerCase();
  if (p.includes("total") || p.includes("disponível")) return `O saldo consolidado atual é de ${fmtBRL(saldoTotal)}, distribuído entre ${saldosPorBanco.length} instituições bancárias.`;
  if (p.includes("maior saldo") || p.includes("banco possui")) return `O banco com maior saldo é ${bancoLider.banco}, com ${fmtBRL(bancoLider.saldo)} (${concentracao}% do total consolidado).`;
  if (p.includes("situação financeira")) return `A situação financeira encontra-se estável. O saldo consolidado de ${fmtBRL(saldoTotal)} apresenta tendência de crescimento nos últimos meses, sem sinais de estresse de caixa.`;
  if (p.includes("risco")) return concentracao > 40 ? `Identificado risco de concentração bancária: ${bancoLider.banco} representa ${concentracao}% dos recursos. Recomenda-se diversificação entre instituições.` : `Não foram identificados riscos críticos. A distribuição entre bancos está dentro de parâmetros saudáveis.`;
  if (p.includes("resumo executivo")) return `Resumo executivo: saldo consolidado de ${fmtBRL(saldoTotal)}, liderado por ${bancoLider.banco} (${concentracao}%). Tendência mensal positiva. Nenhum alerta crítico no momento.`;
  if (p.includes("concentração")) return concentracao > 40 ? `Sim, há concentração excessiva: ${bancoLider.banco} detém ${concentracao}% do saldo total. Sugere-se redistribuir recursos para reduzir exposição a uma única instituição.` : `Não há concentração excessiva. Os recursos estão razoavelmente distribuídos entre as instituições financeiras.`;
  return `Não foi possível localizar essa informação nos dados disponíveis no momento.`;
}

function setupAI(messagesId, quickId, inputId, sendId) {
  const msgsEl = document.getElementById(messagesId);
  const inputEl = document.getElementById(inputId);
  let msgs = [{ role:'ai', text:`Resumo executivo: saldo consolidado de ${fmtBRL(saldoTotal)}. ${bancoLider.banco} concentra ${concentracao}% dos recursos. Não foram identificados riscos críticos.` }];

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
    msgs.push({ role:'ai', text:gerarResposta(text) });
    render();
    inputEl.value = '';
  }

  const qEl = document.getElementById(quickId);
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

setupAI('messages',  'quickBtns',  'aiInput',  'sendBtn');
setupAI('messages2', 'quickBtns2', 'aiInput2', 'sendBtn2');
