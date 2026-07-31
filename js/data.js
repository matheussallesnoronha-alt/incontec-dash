// ── Mock data (temporary — replaced by real Supabase queries in a later PR) ──
const BANCOS = [
  { nome:"Itaú",      cor:"#6FE3A6", ag:"0042 / 12345-6" },
  { nome:"Bradesco",  cor:"#4FB888", ag:"1830 / 98765-4" },
  { nome:"BB",        cor:"#3A8E69", ag:"3307 / 54321-0" },
  { nome:"Caixa",     cor:"#2A6B4E", ag:"0075 / 11223-3" },
  { nome:"Santander", cor:"#1D4D38", ag:"0285 / 44556-7" },
];
const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun"];

const saldosPorBanco = BANCOS.map((b,i)=>({
  banco:b.nome, cor:b.cor, ag:b.ag,
  saldo:Math.round(180000+rand(0,900000)-i*60000),
  contas:2+Math.floor(rand(0,4)),
}));

const evolucao = MESES.map((m,idx)=>({
  mes:m,
  saldo:Math.round(1850000+idx*95000+(rand(0,1)-0.3)*120000),
}));

const saldoTotal  = saldosPorBanco.reduce((s,b)=>s+b.saldo,0);
const qtdBancos   = saldosPorBanco.length;
const qtdContas   = saldosPorBanco.reduce((s,b)=>s+b.contas,0);
const saldoMedio  = saldoTotal/qtdContas;
const bancoLider  = [...saldosPorBanco].sort((a,b)=>b.saldo-a.saldo)[0];
const concentracao= Math.round((bancoLider.saldo/saldoTotal)*100);

const receber = [
  {cliente:"Construtora Alpha",   obra:"Res. Itaim",     venc:"2026-06-28", valor:95000,  status:"A vencer"},
  {cliente:"Prefeitura SP",       obra:"Viaduto Norte",  venc:"2026-07-05", valor:212000, status:"A vencer"},
  {cliente:"Banco do Brasil",     obra:"Ag. Centro",     venc:"2026-05-20", valor:48000,  status:"Vencido"},
  {cliente:"CDHU",                obra:"HIS Guarulhos",  venc:"2026-05-10", valor:87000,  status:"Vencido"},
  {cliente:"MRV Engenharia",      obra:"Cond. Sunrise",  venc:"2026-04-30", valor:60000,  status:"Vencido"},
  {cliente:"Brookfield",          obra:"Torre C",        venc:"2026-07-15", valor:205000, status:"A vencer"},
  {cliente:"Cyrela",              obra:"Loft SP",        venc:"2026-07-22", valor:140000, status:"A vencer"},
];

const pagar = [
  {forn:"Votorantim Cimentos",  cat:"Material",       venc:"2026-06-22", valor:43000,  status:"Hoje"},
  {forn:"Engesep Estruturas",   cat:"Subempreiteiro", venc:"2026-06-22", valor:28000,  status:"Hoje"},
  {forn:"Sindicato dos Const.", cat:"Encargo",        venc:"2026-06-27", valor:38000,  status:"Pendente"},
  {forn:"Receita Federal",      cat:"Imposto",        venc:"2026-06-30", valor:22000,  status:"Pendente"},
  {forn:"Localfrio Equip.",     cat:"Locação",        venc:"2026-07-01", valor:15000,  status:"Pendente"},
  {forn:"Gerdau Açominas",      cat:"Material",       venc:"2026-07-03", valor:75000,  status:"Pendente"},
];

const fluxoDays = Array.from({length:30},(_,i)=>i+1);
const fluxoData = fluxoDays.map(d => Math.round(1850000 + d*4800 + (Math.random()-0.4)*80000));
