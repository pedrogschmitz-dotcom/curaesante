# Gera site/pages/proc-*.html (páginas de procedimento). Rodar: python3 site/_procedimentos.py
import json, os

WA = 'Olá! Quero agendar uma avaliação com o Dr. Pedro Schmitz sobre {}.'

PROCS = [
 {
  "slug": "toxina-botulinica", "nome": "Toxina botulínica", "kick": "Rugas de expressão",
  "foto": "/s/img/consultorio.jpg", "assunto": "toxina botulínica",
  "title": "Toxina botulínica em São José/SC | Curae Santé",
  "description": "Toxina botulínica para rugas de expressão na testa, entre as sobrancelhas e ao redor dos olhos. Como funciona, para quem é, cuidados e riscos. Kobrasol, São José/SC.",
  "lead": "Suaviza as rugas que aparecem com o movimento: testa, entre as sobrancelhas e pés de galinha. O objetivo é relaxar o músculo, não congelar a expressão.",
  "oque": "A toxina botulínica é um medicamento que reduz temporariamente a força de músculos específicos. Com menos contração, a pele por cima marca menos e as rugas de expressão suavizam. A dose e os pontos são definidos para cada rosto, conforme a força dos músculos e o que incomoda você.",
  "para": ["Rugas da testa", "Linhas entre as sobrancelhas", "Pés de galinha", "Algumas situações específicas, como o sorriso que mostra muita gengiva, avaliadas caso a caso"],
  "nao": ["Gestação e amamentação", "Algumas doenças neuromusculares", "Infecção ativa no local", "Expectativa de tratar flacidez ou volume, que pedem outras técnicas"],
  "como": [["Avaliação", "Análise do rosto em repouso e em movimento, histórico de saúde e medicamentos."], ["Aplicação", "Pequenas aplicações com agulha fina, em poucos minutos, no consultório."], ["Efeito", "Começa a aparecer em alguns dias e se completa em cerca de duas semanas."], ["Retorno", "Revisão combinada para avaliar a resposta e, se preciso, ajustar."]],
  "riscos": "É esperado ter pequenos pontos vermelhos ou roxos e leve sensibilidade. Menos comuns: dor de cabeça, assimetria ou queda da pálpebra, que costumam ser temporárias. O efeito dura alguns meses e varia entre pessoas.",
  "faq": [
   {"q": "Vou ficar sem expressão?", "a": "O objetivo é suavizar as marcas mantendo a expressão. A dose é ajustada ao seu rosto e pode ser revista no retorno."},
   {"q": "Quanto tempo dura?", "a": "Em geral alguns meses. Varia conforme a região, a dose e o organismo de cada pessoa."},
   {"q": "Posso fazer exercício depois?", "a": "A orientação costuma ser evitar exercício intenso, deitar e massagear a região nas primeiras horas. As recomendações são passadas por escrito no dia."},
   {"q": "Existe idade certa para começar?", "a": "Não há idade fixa. A indicação depende de as marcas já aparecerem ou não, e é discutida na avaliação."}
  ],
  "rel": ["botox-harmonizacao-facial-o-que-faz-de-verdade", "envelhecimento-pele-prevencao"]
 },
 {
  "slug": "preenchimento-acido-hialuronico", "nome": "Preenchimento com ácido hialurônico", "kick": "Volume e sustentação",
  "foto": "/s/img/recepcao.jpg", "assunto": "preenchimento com ácido hialurônico",
  "title": "Preenchimento com ácido hialurônico | Curae Santé",
  "description": "Preenchimento com ácido hialurônico para sulcos, malar, lábios, olheiras e contorno. Indicação, como é feito, riscos e cuidados. Curae Santé, São José/SC.",
  "lead": "Repõe volume e sustentação onde o rosto perdeu estrutura. Bem indicado, suaviza sulcos e olheiras e define contornos sem mudar quem você é.",
  "oque": "O ácido hialurônico é uma substância que já existe na pele. Na forma de gel, ele é aplicado em pontos planejados para devolver volume e suporte. Diferentes géis têm diferentes firmezas, escolhidas conforme a região e o objetivo. É um procedimento médico: a região do rosto tem vasos importantes, e o conhecimento da anatomia é parte da segurança.",
  "para": ["Sulco nasolabial (bigode chinês)", "Malar e meio do rosto", "Lábios", "Olheiras, em casos selecionados", "Queixo e contorno da mandíbula"],
  "nao": ["Gestação e amamentação", "Infecção ou inflamação ativa na região", "Algumas doenças autoimunes em atividade, avaliadas caso a caso", "Expectativa de resultado igual a fotos de outras pessoas"],
  "como": [["Avaliação", "Análise da anatomia, da proporção do rosto e do que incomoda você."], ["Planejamento", "Escolha das regiões, do produto e da quantidade, explicados antes de começar."], ["Aplicação", "Com anestésico e técnica com agulha ou cânula, conforme a região."], ["Retorno", "Revisão para avaliar o resultado e orientar a manutenção."]],
  "riscos": "Inchaço, roxos e sensibilidade por alguns dias são esperados. Mais raramente: nódulos, assimetria e, em casos raros, obstrução de um vaso, que exige atendimento imediato. Por isso o procedimento é feito por médico, com preparo para agir em caso de complicação.",
  "faq": [
   {"q": "Fica artificial?", "a": "O planejamento respeita a anatomia e as proporções do rosto. Quantidade e regiões são decididas na avaliação, e o resultado varia de pessoa para pessoa."},
   {"q": "Dá para reverter?", "a": "O ácido hialurônico pode ser dissolvido com uma enzima específica em situações indicadas, o que é uma vantagem de segurança desse tipo de produto."},
   {"q": "Quanto tempo dura?", "a": "Depende do produto, da região e do organismo. Em geral, de meses a mais de um ano."},
   {"q": "Preciso de repouso?", "a": "Em geral não. Algumas atividades são evitadas nos primeiros dias, conforme orientação por escrito."}
  ],
  "rel": ["bigode-chines", "flacidez-facial-tratamentos"]
 },
 {
  "slug": "bioestimuladores-de-colageno", "nome": "Bioestimuladores de colágeno", "kick": "Firmeza da pele",
  "foto": "/s/img/pele.jpg", "assunto": "bioestimulador de colágeno",
  "title": "Bioestimuladores de colágeno em São José/SC | Curae Santé",
  "description": "Bioestimuladores de colágeno para firmeza e flacidez do rosto e do corpo: como funcionam, sessões, tempo de resposta e riscos. Curae Santé, Kobrasol, São José/SC.",
  "lead": "Estimulam a sua pele a produzir colágeno novo. O resultado é gradual, ao longo de semanas e meses, com melhora de firmeza e qualidade da pele.",
  "oque": "Bioestimuladores são substâncias aplicadas na pele que provocam uma resposta do próprio organismo: a produção de colágeno. Os mais usados são o ácido poli-L-lático, a hidroxiapatita de cálcio e a policaprolactona, cada um com características próprias. A escolha depende da região, da pele e do objetivo.",
  "para": ["Flacidez leve a moderada do rosto", "Perda de firmeza e qualidade da pele", "Pescoço, colo e mãos, em casos selecionados", "Algumas regiões do corpo, conforme avaliação"],
  "nao": ["Gestação e amamentação", "Infecção ativa no local", "Tendência a quelóides ou doenças autoimunes em atividade, avaliadas caso a caso", "Flacidez intensa, que pode precisar de outra abordagem"],
  "como": [["Avaliação", "Grau de flacidez, qualidade da pele e expectativas."], ["Plano", "Produto, número de sessões e intervalo definidos para você."], ["Aplicação", "Com anestesia local e técnica específica para cada região."], ["Acompanhamento", "A resposta é avaliada ao longo dos meses, nos retornos."]],
  "riscos": "É esperado inchaço, roxos e sensibilidade por alguns dias. Mais raramente podem surgir nódulos, principalmente quando o preparo ou a técnica não são adequados. A resposta varia bastante entre pessoas.",
  "faq": [
   {"q": "Em quanto tempo vejo resultado?", "a": "A melhora é gradual, ao longo de semanas a meses, porque depende da produção de colágeno pelo seu organismo."},
   {"q": "Quantas sessões são necessárias?", "a": "Depende do produto, da indicação e da resposta de cada pessoa. O plano é explicado na avaliação."},
   {"q": "Bioestimulador substitui o preenchimento?", "a": "Não. São técnicas diferentes que muitas vezes se complementam: o preenchimento repõe volume, o bioestimulador melhora a firmeza."}
  ],
  "rel": ["bioestimuladores-de-colageno-como-funcionam", "flacidez-facial-tratamentos"]
 },
 {
  "slug": "retirada-de-cisto-lipoma-e-pintas", "nome": "Retirada de cistos, lipomas e pintas", "kick": "Pequenas cirurgias de pele",
  "foto": "/s/img/equipamento.jpg", "assunto": "retirada de cisto, lipoma ou pinta",
  "title": "Retirada de cisto, lipoma e pintas em São José/SC | Curae Santé",
  "description": "Avaliação e retirada de cisto sebáceo (epidermoide), lipoma e pintas com anestesia local, em consultório, com envio para biópsia quando indicado. Kobrasol, São José/SC.",
  "lead": "Aquele caroço que cresce devagar, a pinta que mudou ou que incomoda: avaliação, retirada com anestesia local em consultório e análise da peça quando indicado.",
  "oque": "São pequenas cirurgias feitas no consultório, com anestesia local. O cisto epidermoide (popularmente chamado de cisto sebáceo) precisa ser retirado com a sua cápsula para diminuir a chance de voltar. O lipoma é um acúmulo benigno de gordura sob a pele. Pintas são retiradas quando há mudança, suspeita ou incômodo, e a peça pode ser enviada para análise (biópsia).",
  "para": ["Cisto epidermoide (cisto sebáceo)", "Lipoma", "Pintas e outras lesões de pele", "Correção do lóbulo da orelha rasgado ou alargado"],
  "nao": ["Cisto inflamado ou infectado no momento: primeiro trata-se a inflamação", "Lesões muito grandes ou em regiões que pedem centro cirúrgico, encaminhadas quando necessário", "Uso de anticoagulantes sem orientação médica prévia"],
  "como": [["Avaliação", "Exame da lesão, com dermatoscópio quando é uma pinta, e explicação do procedimento."], ["Procedimento", "Anestesia local, retirada e pontos, em geral em menos de uma hora."], ["Cuidados", "Curativo simples e orientações por escrito para casa."], ["Retorno", "Retirada dos pontos e, quando houve biópsia, conversa sobre o resultado."]],
  "riscos": "Pode haver dor leve, roxo e inchaço nos primeiros dias. Mais raramente: sangramento, infecção, abertura dos pontos ou cicatriz alargada. Toda retirada deixa uma cicatriz, planejada para ficar o mais discreta possível.",
  "faq": [
   {"q": "Dói?", "a": "A anestesia local tira a dor durante o procedimento. Depois, o incômodo costuma ser leve e controlado com analgésico comum."},
   {"q": "O cisto pode voltar?", "a": "Pode, principalmente se a cápsula não for retirada inteira ou se a retirada for feita durante uma inflamação. Por isso o momento e a técnica importam."},
   {"q": "Preciso de exames antes?", "a": "Na maioria dos casos não. Se você usa medicamentos que afinam o sangue ou tem alguma condição de saúde, isso é avaliado antes."},
   {"q": "A peça vai para biópsia?", "a": "Pintas e lesões com qualquer dúvida são enviadas para análise. Em cistos e lipomas típicos, a decisão é discutida com você."}
  ],
  "rel": ["mancha-na-pele-quando-avaliar"]
 }
]

def li(items): return ''.join(f'<li>{x}</li>' for x in items)

for p in PROCS:
    url = f"/servicos/{p['slug']}/"
    meta = {"url": url, "nav": "servicos", "title": p["title"], "description": p["description"],
            "parent": ["Serviços", "/servicos/"], "crumb": p["nome"], "faqItems": p["faq"],
            "ld": [{"@type": "MedicalProcedure", "name": p["nome"], "url": "https://curaesante.com.br" + url,
                    "description": p["description"], "howPerformed": p["oque"], "followup": "Retorno combinado na consulta.",
                    "procedureType": "https://schema.org/NoninvasiveProcedure" if p["slug"] != "retirada-de-cisto-lipoma-e-pintas" else "https://schema.org/SurgicalProcedure"}]}
    steps = ''.join(f'<div class="s"><h3>{t}</h3><p>{d}</p></div>' for t, d in p['como'])
    rel = ''.join(f'{{{{POST:{r}}}}}' for r in p['rel'])
    body = f'''<!--meta {json.dumps(meta, ensure_ascii=False)} -->
<section class="phead"><div class="wrap g2" style="align-items:center">
  <div>
    <div class="crumbs" data-in><a href="/">Início</a> · <a href="/servicos/">Serviços</a> · {p['nome']}</div>
    <span class="kick" data-in>{p['kick']}</span>
    <h1 style="font-size:clamp(44px,6.4vw,88px)">{p['nome']}</h1>
    <p class="lead" data-in>{p['lead']}</p>
    <div class="ctas" data-in><a class="btn gold" href="{{{{WA:{WA.format(p['assunto'])}}}}}" target="_blank" rel="noopener">{{{{ICO_WA}}}} Agendar avaliação</a><a class="btn line" href="#como">Como é feito</a></div>
  </div>
  <div class="ph tall" data-in><img src="{p['foto']}" alt="" width="1000" height="1250"></div>
</div></section>

<section class="pad">
  <div class="wrap g2" style="align-items:start">
    <div><span class="kick" data-fade>O que é</span><h2 data-split>Entenda o procedimento</h2></div>
    <div><p class="lead" data-fade>{p['oque']}</p></div>
  </div>
</section>

<section class="pad cr">
  <div class="wrap g2" style="align-items:start">
    <div><span class="kick" data-fade>Para quem é</span><h2 data-split>Quando costuma ser indicado</h2><ul class="chk" data-stagger>{li(p['para'])}</ul></div>
    <div><span class="kick" data-fade>Quando não fazer</span><h2 data-split>Quando adiar ou evitar</h2><ul class="chk" data-stagger>{li(p['nao'])}</ul></div>
  </div>
</section>

<section class="pad dk" id="como">
  <div class="wrap g2" style="align-items:start">
    <div><span class="kick" data-fade>Passo a passo</span><h2 data-split>Como é feito</h2><p class="lead" data-fade>A indicação é sempre definida em consulta, depois de entender o que incomoda você.</p></div>
    <div class="steps"><span class="fill"></span>{steps}</div>
  </div>
</section>

<section class="pad">
  <div class="wrap narrow">
    <span class="kick" data-fade>Segurança</span>
    <h2 data-split>Efeitos esperados e riscos</h2>
    <div class="warn" data-fade><p>{p['riscos']}</p><p><strong>Resultados variam de pessoa para pessoa.</strong> Procure a clínica se notar dor forte, mudança de cor da pele, febre ou qualquer sinal fora do esperado.</p></div>
  </div>
</section>

<section class="pad cr">
  <div class="wrap narrow faq">
    <span class="kick" data-fade>Perguntas frequentes</span>
    <h2 data-split>Dúvidas comuns</h2>
{{{{FAQITEMS}}}}
  </div>
</section>

<section class="pad">
  <div class="wrap">
    <span class="kick" data-fade>Para ler antes</span>
    <h2 data-split>Artigos relacionados</h2>
    <div class="posts" data-stagger style="margin-top:20px">{rel}</div>
  </div>
</section>

<section class="pad dk" style="text-align:center">
  <div class="wrap narrow">
    <h2 data-split>Quer saber se é indicado para você?</h2>
    <p class="lead" data-fade>A avaliação é feita pelo Dr. Pedro Schmitz (CRM/SC 38229), na Curae Santé, no Kobrasol.</p>
    <a class="btn gold" href="{{{{WA:{WA.format(p['assunto'])}}}}}" target="_blank" rel="noopener" data-fade>{{{{ICO_WA}}}} Agendar avaliação</a>
    <p style="margin-top:22px" data-fade><a href="/equipe/dr-pedro-schmitz/" style="color:var(--dour)">Conheça o Dr. Pedro →</a></p>
  </div>
</section>
'''
    open(os.path.join(os.path.dirname(__file__), 'pages', f"proc-{p['slug']}.html"), 'w').write(body)
print(len(PROCS), 'páginas de procedimento')
