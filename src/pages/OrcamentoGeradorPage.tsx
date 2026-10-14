import { useMemo, useState } from "react";
import { Copy, Lock, MessageCircle, Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import OrcamentoCard from "@/components/OrcamentoCard";
import {
  codificarOrcamento,
  formatBRL,
  type OrcamentoData,
  type OrcamentoItem,
  type PlanoTratamentoItem,
} from "@/lib/orcamento";

const SENHA_ADMIN = import.meta.env.VITE_ORCAMENTO_SENHA || "curaesante-orcamento";
const SESSION_KEY = "orcamento_admin_unlocked";

const DIAS_VALIDADE_PADRAO = 7;

const PortaoDeSenha = ({ onUnlock }: { onUnlock: () => void }) => {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

  const tentar = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha === SENHA_ADMIN) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setErro(true);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <SEO title="Gerador de orçamento" noIndex />
      <Card className="max-w-sm w-full">
        <CardContent className="pt-10 pb-8 px-6 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display text-lg font-semibold text-foreground">Área interna</h1>
          <p className="text-sm text-muted-foreground">
            Digite a senha para acessar o gerador de orçamentos.
          </p>
          <form onSubmit={tentar} className="w-full space-y-3">
            <Input
              type="password"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErro(false);
              }}
              placeholder="Senha"
              autoFocus
            />
            {erro && <p className="text-xs text-destructive">Senha incorreta.</p>}
            <Button type="submit" className="w-full gradient-gold">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

const novoItem = (): OrcamentoItem => ({ descricao: "", valor: 0 });
const novaLinhaPlano = (): PlanoTratamentoItem => ({ area: "", produto: "", volume: "" });

const OrcamentoGeradorPage = () => {
  const { toast } = useToast();
  const [desbloqueado, setDesbloqueado] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );

  const [cliente, setCliente] = useState("");
  const [planoNome, setPlanoNome] = useState("");
  const [selo, setSelo] = useState("");
  const [responsavelTecnico, setResponsavelTecnico] = useState("Dr. Pedro Schmitz");
  const [crm, setCrm] = useState("CRM/SC 38229");
  const [planoTratamento, setPlanoTratamento] = useState<PlanoTratamentoItem[]>([]);
  const [itens, setItens] = useState<OrcamentoItem[]>([novoItem()]);
  const [desconto, setDesconto] = useState(0);
  const [sinalPercentual, setSinalPercentual] = useState(0);
  const [observacoes, setObservacoes] = useState("");
  const [validadeDias, setValidadeDias] = useState(DIAS_VALIDADE_PADRAO);
  const [link, setLink] = useState<string | null>(null);

  const previewData: OrcamentoData = useMemo(() => {
    const criadoEm = Date.now();
    return {
      v: 2,
      cliente: cliente.trim(),
      planoNome: planoNome.trim() || undefined,
      selo: selo.trim() || undefined,
      responsavelTecnico: responsavelTecnico.trim() || undefined,
      crm: crm.trim() || undefined,
      planoTratamento: planoTratamento.filter((l) => l.area.trim() || l.produto.trim() || l.volume.trim()),
      itens: itens.filter((item) => item.descricao.trim() && item.valor > 0),
      desconto: desconto || 0,
      sinalPercentual: sinalPercentual || undefined,
      observacoes: observacoes.trim(),
      criadoEm,
      expiraEm: criadoEm + validadeDias * 24 * 60 * 60 * 1000,
    };
  }, [cliente, planoNome, selo, responsavelTecnico, crm, planoTratamento, itens, desconto, sinalPercentual, observacoes, validadeDias]);

  if (!desbloqueado) {
    return <PortaoDeSenha onUnlock={() => setDesbloqueado(true)} />;
  }

  const atualizarItem = (index: number, campo: keyof OrcamentoItem, valor: string) => {
    setItens((atual) =>
      atual.map((item, i) =>
        i === index
          ? { ...item, [campo]: campo === "valor" ? Number(valor) || 0 : valor }
          : item,
      ),
    );
  };

  const removerItem = (index: number) => {
    setItens((atual) => (atual.length > 1 ? atual.filter((_, i) => i !== index) : atual));
  };

  const atualizarLinhaPlano = (index: number, campo: keyof PlanoTratamentoItem, valor: string) => {
    setPlanoTratamento((atual) =>
      atual.map((linha, i) => (i === index ? { ...linha, [campo]: valor } : linha)),
    );
  };

  const removerLinhaPlano = (index: number) => {
    setPlanoTratamento((atual) => atual.filter((_, i) => i !== index));
  };

  const gerarLink = () => {
    const itensValidos = itens.filter((item) => item.descricao.trim() && item.valor > 0);

    if (!cliente.trim() || itensValidos.length === 0) {
      toast({
        title: "Faltam dados",
        description: "Informe o nome da cliente e ao menos um item com valor.",
        variant: "destructive",
      });
      return;
    }

    const encoded = codificarOrcamento({ ...previewData, itens: itensValidos });
    setLink(`${window.location.origin}/orcamento#${encoded}`);
  };

  const copiarLink = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    toast({ title: "Link copiado!" });
  };

  const dataExpiraFormatada = new Date(previewData.expiraEm).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const mensagemWhatsapp = link
    ? encodeURIComponent(
        `Olá! Preparei seu orçamento na Curae Santé: ${link}\nEle fica disponível até ${dataExpiraFormatada}.`,
      )
    : "";

  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <SEO title="Gerador de orçamento" noIndex />
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-foreground">Gerador de orçamento</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monte o orçamento e acompanhe a pré-visualização em tempo real, ao lado.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_480px] gap-8 items-start">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">Cliente e plano</CardTitle>
                <CardDescription>Nome da cliente e o tratamento proposto.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Nome da cliente</Label>
                  <Input
                    id="cliente"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planoNome">Nome do tratamento (opcional)</Label>
                    <Input
                      id="planoNome"
                      value={planoNome}
                      onChange={(e) => setPlanoNome(e.target.value)}
                      placeholder="Ex: Harmonização Facial Individualizada"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="selo">Selo de urgência (opcional)</Label>
                    <Input
                      id="selo"
                      value={selo}
                      onChange={(e) => setSelo(e.target.value)}
                      placeholder="Ex: Vagas limitadas — 15 e 16/10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável técnico</Label>
                    <Input
                      id="responsavel"
                      value={responsavelTecnico}
                      onChange={(e) => setResponsavelTecnico(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crm">CRM</Label>
                    <Input id="crm" value={crm} onChange={(e) => setCrm(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">Plano de tratamento (opcional)</CardTitle>
                <CardDescription>Área, produto e volume — aparece como tabela no orçamento.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {planoTratamento.map((linha, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={linha.area}
                      onChange={(e) => atualizarLinhaPlano(i, "area", e.target.value)}
                      placeholder="Área"
                      className="flex-1"
                    />
                    <Input
                      value={linha.produto}
                      onChange={(e) => atualizarLinhaPlano(i, "produto", e.target.value)}
                      placeholder="Produto"
                      className="flex-1"
                    />
                    <Input
                      value={linha.volume}
                      onChange={(e) => atualizarLinhaPlano(i, "volume", e.target.value)}
                      placeholder="Volume"
                      className="w-24"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removerLinhaPlano(i)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPlanoTratamento((atual) => [...atual, novaLinhaPlano()])}
                >
                  <Plus className="w-4 h-4" />
                  Adicionar linha
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">Investimento</CardTitle>
                <CardDescription>Itens, desconto, sinal e validade do link.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label>Itens</Label>
                  {itens.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={item.descricao}
                        onChange={(e) => atualizarItem(i, "descricao", e.target.value)}
                        placeholder="Procedimento"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.valor || ""}
                        onChange={(e) => atualizarItem(i, "valor", e.target.value)}
                        placeholder="R$"
                        className="w-28"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removerItem(i)}
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setItens((atual) => [...atual, novoItem()])}
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar item
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="desconto">Desconto (R$)</Label>
                    <Input
                      id="desconto"
                      type="number"
                      min={0}
                      step="0.01"
                      value={desconto || ""}
                      onChange={(e) => setDesconto(Number(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sinal">Sinal (%)</Label>
                    <Input
                      id="sinal"
                      type="number"
                      min={0}
                      max={100}
                      value={sinalPercentual || ""}
                      onChange={(e) => setSinalPercentual(Number(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validade">Válido por (dias)</Label>
                    <Input
                      id="validade"
                      type="number"
                      min={1}
                      value={validadeDias}
                      onChange={(e) => setValidadeDias(Number(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Condições e observações (uma por linha)</Label>
                  <Textarea
                    id="observacoes"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder={"Condição válida por 48h.\nPagamento em até 3x no cartão.\nSujeito à avaliação presencial."}
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="font-semibold text-foreground">
                    {formatBRL(
                      Math.max(
                        itens.reduce((acc, item) => acc + (item.valor || 0), 0) - (desconto || 0),
                        0,
                      ),
                    )}
                  </span>
                </div>

                <Button onClick={gerarLink} className="w-full gradient-gold" size="lg">
                  Gerar link do orçamento
                </Button>
              </CardContent>
            </Card>

            {link && (
              <Card className="border-gold/40">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Link gerado</CardTitle>
                  <CardDescription>Válido até {dataExpiraFormatada}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input readOnly value={link} className="flex-1 text-xs sm:text-sm" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copiarLink}
                      aria-label="Copiar link"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" asChild aria-label="Pré-visualizar">
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                  <Button asChild variant="secondary" className="w-full">
                    <a
                      href={`https://wa.me/?text=${mensagemWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Enviar pelo WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:sticky lg:top-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 text-center lg:text-left">
              Pré-visualização ao vivo
            </p>
            <OrcamentoCard data={previewData} isPreview />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrcamentoGeradorPage;
