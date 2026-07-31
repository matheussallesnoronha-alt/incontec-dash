const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchView(view, select) {
  const { data, error } = await db.from(view).select(select || "*");
  if (error) throw new Error(`Falha ao consultar ${view}: ${error.message}`);
  return data || [];
}

async function getKpis() {
  const rows = await fetchView("vw_kpis");
  return rows[0] || null;
}

async function getBancos() {
  return fetchView("vw_bancos");
}

async function getFluxoCaixa() {
  const rows = await fetchView("vw_fluxo_caixa");
  return rows.sort((a, b) => a.Data.localeCompare(b.Data));
}

async function getFluxoMensal() {
  const rows = await fetchView("vw_fluxo_mensal");
  return rows.sort((a, b) => a.MonthNumber - b.MonthNumber);
}

async function getRecebiveis() {
  return fetchView("vw_inadimplencia");
}
