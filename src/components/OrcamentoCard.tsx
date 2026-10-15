import { useEffect, useMemo, useState } from "react";
import { Clock, CreditCard, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import logoFullImage from "@/assets/curae-sante-logo-transparent.png";
import drPedroImage from "@/assets/dr-pedro.jpeg";
import draJuliaImage from "@/assets/dra-julia.jpeg";
import {
  type OrcamentoData,
  calcularSinal,
  calcularSubtotal,
  calcularTotal,
  formatBRL,
  formatarContagemRegressiva,
} from "@/lib/orcamento";

const WHATSAPP_NUMBER = "5548988064337";

const SOBRE_CLINICA =
  "A Curae Santé Clínica Médica atua no Kobrasol, em São José/SC, desde 2024, unindo profundidade técnica e acolhimento. Cada atendimento começa por uma avaliação individualizada — porque não existem dois rostos, nem duas histórias, iguais.";

const MEDICOS: Record<string, { foto: string; bio: string[] }> = {
  pedro: {
    foto: drPedroImage,
    bio: [
      "Médico, atua na Curae Santé Clínica Médica desde 2024. Já realizou mais de 500 procedimentos estéticos, acompanhando de perto a evolução de cada paciente.",
      "Participa de congressos de dermatologia e do AMWC — Aesthetic & Anti-Aging Medicine World Congress. É aluno da Dra. Patrícia Leite, cirurgiã plástica, e do Dr. João Pithon, médico harmonizador.",
    ],
  },
  julia: {
    foto: draJuliaImage,
    bio: [
      "Médica da Curae Santé Clínica Médica, com atendimento focado em emagrecimento, saúde metabólica e saúde hormonal feminina.",
      "Plano individualizado, construído a partir da escuta e da investigação — porque cada corpo e cada história pedem um caminho próprio.",
    ],
  },
};

function encontrarMedico(nome?: string) {
  if (!nome) return null;
  const n = nome.toLowerCase();
  if (n.includes("pedro")) return MEDICOS.pedro;
  if (n.includes("júlia") || n.includes("julia")) return MEDICOS.julia;
  return null;
}

const formatarData = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

function useCountUp(target: number, ativo: boolean, duracaoMs = 900) {
  const [valor, setValor] = useState(ativo ? 0 : target);

  useEffect(() => {
    if (!ativo) {
      setValor(target);
      return;
    }
    let frame: number;
    const inicio = performance.now();
    const tick = (agora: number) => {
      const progresso = Math.min(1, (agora - inicio) / duracaoMs);
      const facilitado = 1 - Math.pow(1 - progresso, 3);
      setValor(target * facilitado);
      if (progresso < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ativo]);

  return valor;
}

function useRelogio(ativo: boolean) {
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    if (!ativo) return;
    const id = setInterval(() => setAgora(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [ativo]);

  return agora;
}

interface OrcamentoCardProps {
  data: OrcamentoData;
  isPreview?: boolean;
}

const OrcamentoCard = ({ data, isPreview = false }: OrcamentoCardProps) => {
  const subtotal = calcularSubtotal(data);
  const total = calcularTotal(data);
  const sinal = calcularSinal(data);
  const temDesconto = data.desconto > 0;
  const temSinal = sinal > 0;

  const agora = useRelogio(!isPreview);
  const msRestante = Math.max(0, data.expiraEm - agora);
  const duracaoTotal = Math.max(1, data.expiraEm - data.criadoEm);
  const pctRestante = Math.min(100, Math.max(0, (msRestante / duracaoTotal) * 100));
  const corBarra = pctRestante > 30 ? "bg-gold" : "bg-gold-dark";

  const totalAnimado = useCountUp(total, !isPreview);
  const medico = encontrarMedico(data.responsavelTecnico);

  const condicoes = useMemo(
    () =>
      data.observacoes
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    [data.observacoes],
  );

  const mensagemConfirmacao = encodeURIComponent(
    `Olá! Vi meu orçamento na Curae Santé (${data.cliente}) no valor de ${formatBRL(total)} e gostaria de confirmar.`,
  );

  const entrada = isPreview ? "" : "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both";
  const delay = (ms: number) => (isPreview ? undefined : { animationDelay: `${ms}ms` });

  return (
    <Card className="overflow-hidden border-gold/30 shadow-gold print:shadow-none print:border-none">
      <div className="gradient-gold h-3" />

      <CardContent className="p-6 sm:p-10 lg:p-14">
        <div className="flex justify-center py-6 sm:py-8">
          <img src={logoFullImage} alt="Curae Santé Clínica Médica" className="h-20 sm:h-24 lg:h-28 max-w-[85%]" />
        </div>

        <div className={`${entrada} text-center py-8 sm:py-10 mb-8 border-b border-border`} style={delay(0)}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Preparado especialmente para
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
            {data.cliente || "sua cliente"}
          </h1>
          <div className="w-14 h-px bg-gold mx-auto mt-5" />
        </div>

        <div className={`${entrada} mb-6 print:hidden`} style={delay(80)}>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1.5">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Válido até {formatarData(data.expiraEm)}
            </span>
            <span className="font-medium text-foreground">{formatarContagemRegressiva(msRestante)}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${corBarra}`}
              style={{ width: `${pctRestante}%` }}
            />
          </div>
        </div>

        <div className={`${entrada} rounded-lg border border-border bg-muted/30 p-5 sm:p-6 mb-8`} style={delay(140)}>
          {medico && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <img
                src={medico.foto}
                alt={`Foto de ${data.responsavelTecnico}`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover object-[50%_28%] border-2 border-gold/40 shadow-gold mx-auto sm:mx-0 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                  Sobre quem vai cuidar de você
                </p>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {data.responsavelTecnico}
                  {data.crm && <span className="font-sans text-sm font-normal text-muted-foreground"> | {data.crm}</span>}
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  {medico.bio.map((paragrafo, i) => (
                    <p key={i}>{paragrafo}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className={medico ? "mt-4 pt-4 border-t border-border/70" : ""}>
            <p className="font-display text-sm text-foreground mb-1">A Clínica</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{SOBRE_CLINICA}</p>
          </div>
        </div>

        {data.planoTratamento && data.planoTratamento.length > 0 && (
          <div className={`${entrada} mb-8`} style={delay(180)}>
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">Plano de tratamento</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gold/50">
                    <th className="text-left font-semibold uppercase text-[11px] tracking-wide px-4 py-3 text-muted-foreground">
                      Área
                    </th>
                    <th className="text-left font-semibold uppercase text-[11px] tracking-wide px-4 py-3 text-muted-foreground">
                      Produto
                    </th>
                    <th className="text-right font-semibold uppercase text-[11px] tracking-wide px-4 py-3 text-muted-foreground">
                      Volume
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.planoTratamento.map((linha, i) => (
                    <tr key={i} className="border-b border-border/60 last:border-b-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-foreground whitespace-nowrap">{linha.area}</td>
                      <td className="px-4 py-3 text-muted-foreground">{linha.produto}</td>
                      <td className="px-4 py-3 text-right text-foreground whitespace-nowrap">{linha.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className={entrada} style={delay(220)}>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">Investimento</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gold/50">
                  <th className="text-left font-semibold uppercase text-[11px] tracking-wide px-4 py-3 text-muted-foreground">
                    Item
                  </th>
                  <th className="text-right font-semibold uppercase text-[11px] tracking-wide px-4 py-3 text-muted-foreground">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.itens.map((item, i) => (
                  <tr key={i} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground">{item.descricao}</td>
                    <td className="px-4 py-3 text-right font-medium text-foreground whitespace-nowrap">
                      {formatBRL(item.valor)}
                    </td>
                  </tr>
                ))}
                {temDesconto && (
                  <tr className="border-b border-border/60">
                    <td className="px-4 py-2 text-muted-foreground text-xs">Subtotal</td>
                    <td className="px-4 py-2 text-right text-muted-foreground text-xs">{formatBRL(subtotal)}</td>
                  </tr>
                )}
                {temDesconto && (
                  <tr className="border-b border-border/60">
                    <td className="px-4 py-2 text-muted-foreground text-xs">Desconto</td>
                    <td className="px-4 py-2 text-right text-muted-foreground text-xs">
                      - {formatBRL(data.desconto)}
                    </td>
                  </tr>
                )}
                <tr className="border-t-2 border-gold/50">
                  <td className="px-4 py-3 font-semibold text-foreground">Total</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      key={Math.round(total)}
                      className="font-display text-xl font-semibold text-gradient-gold inline-block animate-count-pop"
                    >
                      {formatBRL(totalAnimado)}
                    </span>
                  </td>
                </tr>
                {temSinal && (
                  <tr>
                    <td className="px-4 py-2 text-muted-foreground text-xs">
                      Sinal para reserva do horário ({data.sinalPercentual}% do total, abatido no dia do
                      procedimento)
                    </td>
                    <td className="px-4 py-2 text-right text-muted-foreground text-xs whitespace-nowrap">
                      {formatBRL(sinal)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {condicoes.length > 0 && (
          <div className={`${entrada} mt-6 print:hidden`} style={delay(260)}>
            <Accordion type="single" collapsible>
              <AccordionItem value="condicoes" className="border-none">
                <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline bg-muted/40 rounded-lg px-4 py-3">
                  Ver condições e observações
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <ul className="space-y-1.5 text-sm text-muted-foreground pt-1 max-w-prose">
                    {condicoes.map((linha, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-gold-dark mt-1">•</span>
                        <span>{linha}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {condicoes.length > 0 && (
          <div className="hidden print:block mt-6 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Observações</p>
            <ul className="space-y-1">
              {condicoes.map((linha, i) => (
                <li key={i}>• {linha}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={`${entrada} mt-8 flex flex-col gap-3 print:hidden`} style={delay(320)}>
          {data.linkPagamento && (
            <Button
              asChild
              size="lg"
              className="btn-shimmer bg-[position:0%_0%] hover:bg-[position:100%_0%] transition-[background-position,transform] duration-700 text-primary-foreground border-0 shadow-gold hover:scale-[1.02]"
            >
              <a href={data.linkPagamento} target="_blank" rel="noopener noreferrer">
                <CreditCard className="w-4 h-4" />
                Pagar agora (Pix, cartão ou débito)
              </a>
            </Button>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              variant={data.linkPagamento ? "outline" : undefined}
              className={
                data.linkPagamento
                  ? "flex-1"
                  : "flex-1 btn-shimmer bg-[position:0%_0%] hover:bg-[position:100%_0%] transition-[background-position,transform] duration-700 text-primary-foreground border-0 shadow-gold hover:scale-[1.02]"
              }
            >
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensagemConfirmacao}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
                Confirmar pelo WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.print()}>
              <Download className="w-4 h-4" />
              Baixar orçamento
            </Button>
          </div>
        </div>

        {(data.responsavelTecnico || data.crm) && (
          <div className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 text-xs text-muted-foreground">
            <div>
              {data.responsavelTecnico && (
                <p className="font-display text-sm text-foreground">{data.responsavelTecnico}</p>
              )}
              {data.crm && <p>{data.crm}</p>}
            </div>
            <p className="sm:text-right">
              Curae Santé — Clínica Médica
              <br />
              Av. Delamar José da Silva, 186, sala 03 — Kobrasol, São José/SC
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrcamentoCard;
