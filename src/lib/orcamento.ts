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
  aceitaPagamento?: boolean;
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

function bytesParaBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlParaBytes(encoded: string): Uint8Array {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function lerStream(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const partes: Uint8Array[] = [];
  const reader = stream.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    partes.push(value);
  }
  const total = partes.reduce((acc, p) => acc + p.length, 0);
  const resultado = new Uint8Array(total);
  let offset = 0;
  for (const parte of partes) {
    resultado.set(parte, offset);
    offset += parte.length;
  }
  return resultado;
}

// Os dados do orçamento viajam comprimidos (gzip) na fragment (#) da URL: o
// navegador nunca envia esse trecho ao servidor, então nada fica em logs de
// acesso. Não é criptografia — só compressão + ofuscação — então nenhum dado
// sensível deve entrar aqui.
export async function codificarOrcamento(data: OrcamentoData): Promise<string> {
  const json = JSON.stringify(data);
  const bytesOriginais = new TextEncoder().encode(json);
  const stream = new Blob([bytesOriginais]).stream().pipeThrough(new CompressionStream("gzip"));
  const bytesComprimidos = await lerStream(stream);
  return bytesParaBase64Url(bytesComprimidos);
}

export async function decodificarOrcamento(encoded: string): Promise<OrcamentoData | null> {
  try {
    const bytesComprimidos = base64UrlParaBytes(encoded);
    const stream = new Blob([bytesComprimidos]).stream().pipeThrough(new DecompressionStream("gzip"));
    const bytes = await lerStream(stream);
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
