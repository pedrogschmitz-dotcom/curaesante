import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";
import OrcamentoCard from "@/components/OrcamentoCard";
import { type OrcamentoData, decodificarOrcamento, estaExpirado } from "@/lib/orcamento";

const WHATSAPP_NUMBER = "5548988064337";

const formatarData = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

const EstadoMensagem = ({
  titulo,
  descricao,
  mensagemWhatsapp,
}: {
  titulo: string;
  descricao: string;
  mensagemWhatsapp: string;
}) => (
  <main className="min-h-screen bg-background flex items-center justify-center px-4">
    <SEO title="Orçamento" noIndex />
    <Card className="max-w-md w-full text-center">
      <CardContent className="pt-10 pb-8 px-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
          <ShieldAlert className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-display text-xl font-semibold text-foreground">{titulo}</h1>
        <p className="text-sm text-muted-foreground">{descricao}</p>
        <Button asChild className="mt-2 gradient-gold">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagemWhatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-4 h-4" />
            Solicitar novo orçamento
          </a>
        </Button>
      </CardContent>
    </Card>
  </main>
);

const OrcamentoPage = () => {
  const location = useLocation();

  const data = useMemo<OrcamentoData | null>(() => {
    const hash = location.hash.replace(/^#/, "");
    if (!hash) return null;
    return decodificarOrcamento(hash);
  }, [location.hash]);

  if (!data) {
    return (
      <EstadoMensagem
        titulo="Não foi possível abrir este orçamento"
        descricao="O link pode estar incompleto ou corrompido. Copie o link inteiro que você recebeu, ou peça um novo."
        mensagemWhatsapp="Olá! Não consegui abrir o link do meu orçamento na Curae Santé. Poderiam me enviar novamente?"
      />
    );
  }

  const expirado = estaExpirado(data);

  if (expirado) {
    return (
      <main className="min-h-screen bg-background py-10 px-4 relative">
        <SEO title={`Orçamento — ${data.cliente}`} noIndex />
        <div className="max-w-2xl mx-auto relative">
          <div className="pointer-events-none select-none blur-sm opacity-40">
            <OrcamentoCard data={data} isPreview />
          </div>
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <Card className="max-w-sm w-full text-center shadow-2xl">
              <CardContent className="pt-10 pb-8 px-6 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <ShieldAlert className="w-7 h-7 text-primary" />
                </div>
                <h1 className="font-display text-xl font-semibold text-foreground">Este orçamento expirou</h1>
                <p className="text-sm text-muted-foreground">
                  Ele era válido até {formatarData(data.expiraEm)}. Fale com a gente para gerar um orçamento
                  atualizado.
                </p>
                <Button asChild className="mt-2 gradient-gold">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Olá! Meu orçamento (${data.cliente}) expirou. Poderiam gerar um novo para mim?`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Solicitar novo orçamento
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-10 px-4 print:py-0 print:bg-white">
      <SEO title={`Orçamento — ${data.cliente}`} noIndex />
      <div className="max-w-2xl mx-auto">
        <OrcamentoCard data={data} />
        <p className="text-center text-xs text-muted-foreground mt-6 print:hidden">
          Curae Santé Clínica Médica — este link é pessoal e deixa de funcionar após o prazo de validade.
        </p>
      </div>
    </main>
  );
};

export default OrcamentoPage;
