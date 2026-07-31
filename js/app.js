// ── Nav ───────────────────────────────────────────────
const NAV = [
  { label:"Dashboard",        iconKey:"dashboard", subtitle:"Visão consolidada de bancos e contas" },
  { label:"Fluxo de Caixa",   iconKey:"wallet",    subtitle:"Entradas e saídas previstas" },
  { label:"Contas a Receber", iconKey:"arrowDown", subtitle:"Recebíveis em aberto" },
  { label:"Contas a Pagar",   iconKey:"arrowUp",   subtitle:"Obrigações pendentes" },
  { label:"Bancos",           iconKey:"landmark",  subtitle:"Saldos por instituição financeira" },
  { label:"Relatórios",       iconKey:"bar",       subtitle:"Exportações e históricos" },
  { label:"Indicadores",      iconKey:"gauge",     subtitle:"Métricas estratégicas" },
  { label:"INCONTEC AI",      iconKey:"sparkles",  subtitle:"Assistente financeiro inteligente" },
];

let activeLabel = "Dashboard";

function setActive(label) {
  activeLabel = label;
  // pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + label);
  if (pg) pg.classList.add('active');
  // sidebar
  document.querySelectorAll('.nav-item').forEach(b => {
    const isActive = b.dataset.label === label;
    b.classList.toggle('active', isActive);
    b.innerHTML = `
      ${isActive ? '<span class="active-bar"></span>' : ''}
      <span class="nav-icon" style="color:${isActive?'var(--accent)':'var(--muted)'}">${I[NAV.find(n=>n.label===b.dataset.label).iconKey]}</span>
      <span style="flex:1">${b.dataset.label}</span>
      ${isActive ? '<span class="nav-dot"></span>' : ''}
    `;
  });
  // mobile tabs
  document.querySelectorAll('.mobile-tab').forEach(b => b.classList.toggle('active', b.dataset.label === label));
  // topbar
  const nav = NAV.find(n => n.label === label);
  document.getElementById('pageTitle').textContent = label;
  document.getElementById('pageSubtitle').textContent = nav ? nav.subtitle : '';
}

// Render sidebar
const sidebarNav = document.getElementById('sidebarNav');
NAV.forEach(item => {
  const btn = document.createElement('button');
  btn.className = 'nav-item' + (item.label === activeLabel ? ' active' : '');
  btn.dataset.label = item.label;
  btn.onclick = () => setActive(item.label);
  btn.innerHTML = `
    ${item.label === activeLabel ? '<span class="active-bar"></span>' : ''}
    <span class="nav-icon" style="color:${item.label===activeLabel?'var(--accent)':'var(--muted)'}">${I[item.iconKey]}</span>
    <span style="flex:1">${item.label}</span>
    ${item.label === activeLabel ? '<span class="nav-dot"></span>' : ''}
  `;
  sidebarNav.appendChild(btn);
});

// Render mobile tabs
const mobileTabs = document.getElementById('mobileTabs');
NAV.forEach(item => {
  const btn = document.createElement('button');
  btn.className = 'mobile-tab' + (item.label === activeLabel ? ' active' : '');
  btn.dataset.label = item.label;
  btn.onclick = () => setActive(item.label);
  btn.innerHTML = `<span style="width:13px;height:13px;display:inline-flex">${I[item.iconKey]}</span>${item.label}`;
  mobileTabs.appendChild(btn);
});
