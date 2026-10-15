export interface OrcamentoItem {
  descricao: string;
  valor: number;
}

export interface PlanoTratamentoItem {
  area: string;
  produto: string;
  volume: string;
}

export interface OrcamentoData {
  v: 2;
  cliente: string;
  planoNome?: string;
  selo?: string;
  responsavelTecnico?: string;
  crm?: string;
  planoTratamento?: PlanoTratamentoItem[];
  itens: OrcamentoItem[];
  desconto: number;
  sinalPercentual?: number;
  observacoes: string;
  linkPagamento?: string;
  criadoEm: number;
  expiraEm: number;
}

export function formatBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

export function calcularSubtotal(data: OrcamentoData): number {
  return data.itens.reduce((acc, item) => acc + item.valor, 0);
}

export function calcularTotal(data: OrcamentoData): number {
  return Math.max(calcularSubtotal(data) - (data.desconto || 0), 0);
}

export function calcularSinal(data: OrcamentoData): number {
  if (!data.sinalPercentual) return 0;
  return (calcularTotal(data) * data.sinalPercentual) / 100;
}

export function estaExpirado(data: OrcamentoData): boolean {
  return Date.now() > data.expiraEm;
}

export function formatarContagemRegressiva(msRestante: number): string {
  if (msRestante <= 0) return "Orçamento expirado";
  const totalMinutos = Math.floor(msRestante / 60000);
  const dias = Math.floor(totalMinutos / (60 * 24));
  const horas = Math.floor((totalMinutos % (60 * 24)) / 60);
  const minutos = totalMinutos % 60;

  if (dias > 0) return `Disponível por mais ${dias} ${dias === 1 ? "dia" : "dias"}`;
  if (horas > 0) return `Disponível por mais ${horas} ${horas === 1 ? "hora" : "horas"}`;
  return `Disponível por mais ${minutos} min`;
}

export function percentualValidadeRestante(data: OrcamentoData): number {
  const total = data.expiraEm - data.criadoEm;
  if (total <= 0) return 0;
  const restante = data.expiraEm - Date.now();
  return Math.min(100, Math.max(0, (restante / total) * 100));
}

// Os dados do orçamento viajam inteiros na fragment (#) da URL: o navegador
// nunca envia esse trecho ao servidor, então nada fica em logs de acesso.
// Não é criptografia — só ofuscação — então nenhum dado sensível deve entrar aqui.
export function codificarOrcamento(data: OrcamentoData): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodificarOrcamento(encoded: string): OrcamentoData | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json) as OrcamentoData;

    if (
      data.v !== 2 ||
      typeof data.cliente !== "string" ||
      !Array.isArray(data.itens) ||
      typeof data.expiraEm !== "number"
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
