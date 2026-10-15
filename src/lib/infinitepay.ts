const HANDLE = import.meta.env.VITE_INFINITEPAY_HANDLE;
const API_URL = "https://api.checkout.infinitepay.io/links";

interface GerarLinkPagamentoParams {
  descricao: string;
  valor: number;
  orderNsu: string;
  redirectUrl?: string;
}

interface InfinitePayResponse {
  url?: string;
  success?: boolean;
  error?: string;
  message?: string;
}

// Valor em reais (ex: 450.90) -> centavos (ex: 45090), como a API exige.
function paraCentavos(valor: number): number {
  return Math.round(valor * 100);
}

export async function gerarLinkPagamento({
  descricao,
  valor,
  orderNsu,
  redirectUrl,
}: GerarLinkPagamentoParams): Promise<string> {
  if (!HANDLE) {
    throw new Error(
      "Handle da InfinitePay não configurado (defina VITE_INFINITEPAY_HANDLE no .env).",
    );
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle: HANDLE,
      order_nsu: orderNsu,
      redirect_url: redirectUrl,
      items: [
        {
          quantity: 1,
          price: paraCentavos(valor),
          description: descricao.slice(0, 100),
        },
      ],
    }),
  });

  const data = (await response.json()) as InfinitePayResponse;

  if (!response.ok || !data.url) {
    throw new Error(data.message || "Não foi possível gerar o link de pagamento.");
  }

  return data.url;
}
