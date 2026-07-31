// ── Derived/computed values from raw Supabase rows ────
const BANK_PALETTE = ["#6FE3A6", "#4FB888", "#3A8E69", "#2A6B4E", "#1D4D38", "#8FE8BC", "#59A57E", "#245A40"];
function colorForIndex(i) { return BANK_PALETTE[i % BANK_PALETTE.length]; }

// "Participação"/"concentração" are shares of gross positive balances, not of
// the net total — some accounts carry a negative saldo (e.g. overdrafts/factoring),
// which would make a share-of-net-total percentage flip sign in a misleading way.
function computeBancoStats(bancos) {
  const saldoTotal = bancos.reduce((s, b) => s + (b.saldo || 0), 0);
  const totalPositivo = bancos.reduce((s, b) => s + Math.max(b.saldo || 0, 0), 0);
  const sorted = [...bancos].sort((a, b) => b.saldo - a.saldo);
  const bancoLider = sorted[0] || null;
  const bancoMenor = sorted[sorted.length - 1] || null;
  const concentracao = bancoLider && totalPositivo ? Math.round((Math.max(bancoLider.saldo, 0) / totalPositivo) * 100) : 0;
  return {
    saldoTotal,
    totalPositivo,
    bancoLider,
    bancoMenor,
    concentracao,
    qtdBancos: bancos.length,
    mediaPorBanco: bancos.length ? saldoTotal / bancos.length : 0,
  };
}

function participacaoPct(saldo, bancoStats) {
  if (!bancoStats.totalPositivo || saldo <= 0) return 0;
  return Math.round((saldo / bancoStats.totalPositivo) * 100);
}

function statusFromRecebivel(row) {
  if (row.StatusVen === "Quitado") return "Pago";
  if (row["Cliente Inadimplente"] === "Sim") return "Vencido";
  return "A vencer";
}

// vw_inadimplencia only contains delinquent sales (Cliente Inadimplente = "Sim"
// for every row) — it's a delinquency ledger, not a full receivables aging report.
// So the summary below reports what this source can honestly say: how much is
// overdue, who's furthest behind, and how many distinct clients are affected.
function computeReceberSummary(rows) {
  const now = new Date();
  let totalAberto = 0;
  const clientes = new Set();
  let maiorAtraso = null;

  rows.forEach(r => {
    const aReceber = r["Total a Receber"] || 0;
    totalAberto += aReceber;
    if (r.Cliente) clientes.add(r.Cliente);

    if (r["Data Venda"]) {
      const dias = Math.round((now - new Date(r["Data Venda"])) / 86400000);
      if (!maiorAtraso || dias > maiorAtraso.dias) {
        maiorAtraso = { cliente: r.Cliente, dias, valor: aReceber };
      }
    }
  });

  return {
    totalAberto,
    vencidosCount: rows.length,
    clientesUnicos: clientes.size,
    maiorAtraso,
  };
}

const MES_LABEL = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function computePMR(rows) {
  const withDays = rows
    .map(r => {
      const start = r["Data Venda"] ? new Date(r["Data Venda"]) : null;
      if (!start) return null;
      const end = r["Data Quitação"] ? new Date(r["Data Quitação"]) : new Date();
      const days = Math.round((end - start) / 86400000);
      return days >= 0 ? { start, days } : null;
    })
    .filter(Boolean);

  if (!withDays.length) return { avgDays: null, monthly: [] };

  const avgDays = Math.round(withDays.reduce((s, x) => s + x.days, 0) / withDays.length);

  const byMonth = new Map();
  withDays.forEach(({ start, days }) => {
    const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key).push(days);
  });

  const monthly = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, arr]) => ({
      mes: MES_LABEL[Number(key.split("-")[1]) - 1],
      dias: Math.round(arr.reduce((s, d) => s + d, 0) / arr.length),
    }));

  return { avgDays, monthly };
}

function fmtDateBR(isoDate) {
  if (!isoDate) return "—";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}`;
}
