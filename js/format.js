function rand(min, max) { return Math.random() * (max - min) + min; }

const fmtBRL = v => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);
const fmtM = v => `${(v / 1e6).toFixed(1)}M`;
const fmtK = v => `${(v / 1e3).toFixed(0)}k`;
