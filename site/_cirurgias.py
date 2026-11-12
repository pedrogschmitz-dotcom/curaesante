# Gera site/pages/pequenas-cirurgias.html. Rodar: python3 site/_cirurgias.py
import json, os

CIR = [
 ("cisto", "Cisto epidermoide", "o \"cisto sebáceo\"",
  "Caroço sob a pele, às vezes com um ponto escuro no centro, que pode inflamar e soltar um material de cheiro forte.",
  "Retirada com anestesia local, incluindo a cápsula, para diminuir a chance de voltar. Se estiver inflamado, primeiro trata-se a inflamação.",
  "Pontos retirados em 7 a 14 dias, conforme a região.", "/servicos/retirada-de-cisto-lipoma-e-pintas/"),
 ("lipoma", "Lipoma", "nódulo de gordura",
  "Caroço macio e móvel de gordura sob a pele, benigno, que cresce devagar.",
  "Incisão sobre o lipoma, retirada com anestesia local e pontos. Lipomas muito grandes ou profundos são encaminhados para centro cirúrgico.",
  "Retorno para retirada dos pontos; evitar esforço na região por alguns dias.", "/servicos/lipoma/"),
 ("pintas", "Pintas e nevos", "retirada com biópsia",
  "Pinta que mudou de cor, tamanho ou formato, que coça ou sangra, ou que incomoda por atrito.",
  "Avaliação com dermatoscópio e retirada com margem, com envio da peça para análise (biópsia).",
  "Resultado da biópsia discutido no retorno.", "/servicos/retirada-de-cisto-lipoma-e-pintas/"),
 ("lobulo", "Lóbulo da orelha rasgado", "lobuloplastia",
  "Lóbulo rasgado ou alargado pelo uso de brincos pesados ou alargadores.",
  "Correção com anestesia local: as bordas são refeitas e suturadas para o lóbulo voltar a fechar.",
  "Novo furo, se desejado, só depois da cicatrização completa, em geral após algumas semanas.", "/servicos/lobuloplastia/"),
 ("unha", "Unha encravada", "cantoplastia",
  "Canto da unha que entra na pele, com dor, vermelhidão, inflamação ou pus, muitas vezes de repetição.",
  "Retirada da parte da unha que encrava, com anestesia local. Nos casos de repetição, a matriz daquele canto é tratada (fenolização) para a borda não voltar a crescer.",
  "Curativos em casa por alguns dias e sapato aberto nos primeiros dias.", "/servicos/unha-encravada/"),
 ("acrocordon", "Acrocórdons", "os \"pólipos\" de pele",
  "Pequenas bolinhas de pele, moles e pediculadas, comuns no pescoço, axilas e virilha.",
  "Retirada rápida com anestesia local quando necessário, por corte ou cauterização.",
  "Pequenas crostas que caem em poucos dias.", None),
 ("verrugas", "Verrugas", "causadas por vírus",
  "Lesões ásperas causadas pelo HPV, comuns nas mãos e nos pés, que podem se espalhar.",
  "Tratamento conforme o tipo e o local: cauterização, curetagem ou outras técnicas, às vezes em mais de uma sessão.",
  "Podem voltar; o acompanhamento faz parte do tratamento.", "/servicos/verrugas/"),
 ("queratose", "Queratose seborreica", "as manchas elevadas \"da idade\"",
  "Manchas elevadas, acastanhadas, de superfície áspera ou \"colada\", muito comuns depois dos 40 anos e benignas.",
  "Quando incomodam ou há dúvida no diagnóstico: curetagem ou cauterização com anestesia local, com biópsia se necessário.",
  "Crostas por alguns dias; proteger do sol durante a cicatrização.", "/servicos/queratose-seborreica/"),
 ("biopsia", "Biópsia de pele", "para diagnóstico",
  "Lesão ou mancha cuja causa precisa ser confirmada para definir o tratamento.",
  "Retirada de um pequeno fragmento (punch) ou da lesão inteira, com anestesia local, enviada para análise em laboratório.",
  "Um ou dois pontos; o resultado é discutido no retorno.", None),
 ("abscesso", "Drenagem de abscesso", "acúmulo de pus",
  "Área inchada, quente, vermelha e dolorida com pus sob a pele.",
  "Drenagem com anestesia local, limpeza e, quando indicado, antibiótico.",
  "Curativos e retorno para reavaliar. Febre ou piora pedem atendimento imediato.", None),
 ("corpo-estranho", "Retirada de corpo estranho", "farpas e fragmentos",
  "Farpa, fragmento de vidro, metal ou outro material que ficou sob a pele.",
  "Localização e retirada com anestesia local; em alguns casos, exame de imagem antes.",
  "Curativo simples e orientação sobre vacina antitetânica.", None),
 ("xantelasma", "Xantelasma", "placas amareladas nas pálpebras",
  "Placas amareladas e planas perto dos olhos, ligadas ao acúmulo de gordura na pele.",
  "Avaliação do colesterol e, quando indicado, retirada com técnica delicada adequada à região.",
  "Pode voltar; controle do colesterol ajuda. Casos complexos são encaminhados.", None),
 ("cicatriz", "Cicatrizes e queloides", "revisão e infiltração",
  "Cicatriz alargada, elevada ou que incomoda, e queloides que crescem além da cicatriz original.",
  "Conforme o caso: revisão cirúrgica da cicatriz ou infiltração de medicamento no queloide, às vezes combinadas.",
  "Queloides podem voltar; o tratamento costuma ter mais de uma sessão e acompanhamento.", None),
]

FAQ = [
 {"q": "As pequenas cirurgias são feitas no consultório?", "a": "Sim. São procedimentos com anestesia local, feitos na sala de procedimentos da clínica. Casos que precisam de centro cirúrgico são encaminhados."},
 {"q": "Dói?", "a": "A anestesia local tira a dor durante o procedimento. Depois, o incômodo costuma ser leve e controlado com analgésico comum."},
 {"q": "Preciso de exames antes?", "a": "Na maioria dos casos não. Quem usa medicamentos que afinam o sangue ou tem alguma condição de saúde é avaliado antes."},
 {"q": "Posso trabalhar no mesmo dia?", "a": "Na maioria dos casos, sim. A orientação depende da região e do tipo de procedimento e é passada por escrito."},
 {"q": "Vai ficar cicatriz?", "a": "Toda retirada deixa alguma cicatriz. A técnica e a posição do corte são planejadas para ela ficar o mais discreta possível."},
 {"q": "A peça vai para biópsia?", "a": "Pintas e lesões com qualquer dúvida são enviadas para análise. Em outros casos, a decisão é discutida com você."},
]

WA = "Olá! Quero agendar uma avaliação de pequena cirurgia de pele com o Dr. Pedro Schmitz."
idx = ''.join(f'<a href="#{s}">{n}</a>' for s, n, *_ in CIR)
blocos = ''
for i, (s, n, sub, oque, como, depois, link) in enumerate(CIR, 1):
    mais = f'<a class="more" href="{link}">Página completa</a>' if link else ''
    blocos += f'''
      <article class="cir" id="{s}" data-fade>
        <div class="cir-h"><div><h3>{n}</h3><span class="sub">{sub}</span></div></div>
        <div class="cir-b">
          <div><b>O que é</b><p>{oque}</p></div>
          <div><b>Como é feito</b><p>{como}</p></div>
          <div><b>Depois</b><p>{depois}</p>{mais}</div>
        </div>
      </article>'''

ld = [{"@type": "MedicalWebPage", "name": "Pequenas cirurgias de pele", "url": "https://curaesante.com.br/servicos/pequenas-cirurgias/",
       "reviewedBy": {"@id": "https://curaesante.com.br/#dr-pedro"},
       "about": [{"@type": "MedicalProcedure", "name": n, "procedureType": "https://schema.org/SurgicalProcedure"} for _, n, *_ in CIR]}]
meta = {"url": "/servicos/pequenas-cirurgias/", "nav": "procedimentos", "parent": ["Procedimentos", "/procedimentos/"], "crumb": "Pequenas cirurgias",
        "preload": "/s/img/pedro-cirurgia.jpg",
        "title": "Pequenas cirurgias de pele em São José/SC | Curae Santé",
        "description": "Cisto, lipoma, pintas, unha encravada, verrugas, acrocórdons, queratose, biópsia, lóbulo da orelha e mais, com anestesia local no Kobrasol, São José/SC.",
        "faqItems": FAQ, "ld": ld}

html = f'''<!--meta {json.dumps(meta, ensure_ascii=False)} -->
<section class="phead"><div class="wrap g2" style="align-items:center">
  <div>
    <div class="crumbs" data-in><a href="/">Início</a> · <a href="/procedimentos/">Procedimentos</a> · Pequenas cirurgias</div>
    <span class="kick" data-in>Com anestesia local, no consultório</span>
    <h1 style="font-size:clamp(46px,6.6vw,92px)">Pequenas cirurgias de <em>pele</em></h1>
    <p class="lead" data-in>Do cisto que incomoda há anos à unha encravada que não melhora: avaliação, procedimento com anestesia local e acompanhamento até a cicatrização, com o Dr. Pedro Schmitz.</p>
    <div class="ctas" data-in><a class="btn gold" href="{{{{WA:{WA}}}}}" target="_blank" rel="noopener">{{{{ICO_WA}}}} Agendar avaliação</a><a class="btn line" href="#lista">Ver todas</a></div>
  </div>
  <figure data-in style="margin:0"><div class="ph tall"><img src="/s/img/pedro-cirurgia.jpg" alt="Dr. Pedro Schmitz de máscara segurando pinça e porta-agulha no consultório" width="1100" height="1375"></div><figcaption class="cap" style="color:var(--creme);opacity:.6">Dr. Pedro Schmitz no consultório da Curae Santé</figcaption></figure>
</div></section>

<section class="pad-s" id="lista">
  <div class="wrap">
    <span class="kick" data-fade>O que tratamos</span>
    <h2 data-split>{len(CIR)} procedimentos em um só lugar</h2>
    <nav class="cir-idx" aria-label="Procedimentos" data-fade>{idx}</nav>
    <div class="cir-list">{blocos}
    </div>
    <p class="note" style="margin-top:26px">Conteúdo informativo. A indicação e a técnica são definidas na avaliação. Casos que precisam de centro cirúrgico ou de outro profissional são encaminhados.</p>
  </div>
</section>

<section class="pad dk">
  <div class="wrap g2" style="align-items:start">
    <div><span class="kick" data-fade>Como funciona</span><h2 data-split>Do primeiro contato à cicatrização</h2></div>
    <div class="steps"><span class="fill"></span>
      <div class="s"><h3>Avaliação</h3><p>Exame da lesão, com dermatoscópio quando é pinta ou mancha, e explicação do que fazer.</p></div>
      <div class="s"><h3>Procedimento</h3><p>Anestesia local, no mesmo dia ou em data marcada, conforme o caso.</p></div>
      <div class="s"><h3>Cuidados em casa</h3><p>Orientações por escrito sobre curativo, banho, esforço e sinais de alerta.</p></div>
      <div class="s"><h3>Retorno</h3><p>Retirada de pontos, avaliação da cicatriz e resultado da biópsia, quando houver.</p></div>
    </div>
  </div>
</section>

<section class="pad">
  <div class="wrap narrow">
    <span class="kick" data-fade>Segurança</span>
    <h2 data-split>Riscos e sinais de alerta</h2>
    <div class="warn" data-fade><p>Pode haver dor leve, roxo e inchaço nos primeiros dias. Mais raramente: sangramento, infecção, abertura dos pontos ou cicatriz alargada. Toda retirada deixa uma cicatriz.</p><p><strong>Procure a clínica</strong> se houver febre, vermelhidão que se espalha, pus, sangramento que não para ou dor que piora.</p></div>
  </div>
</section>

<section class="pad cr">
  <div class="wrap narrow faq">
    <span class="kick" data-fade>Perguntas frequentes</span>
    <h2 data-split>Dúvidas comuns</h2>
{{{{FAQITEMS}}}}
  </div>
</section>

<section class="pad dk" style="text-align:center">
  <div class="wrap narrow">
    <h2 data-split>Tem algo na pele que incomoda?</h2>
    <p class="lead" data-fade>Mande uma mensagem pelo WhatsApp. A equipe agenda a avaliação com o Dr. Pedro Schmitz (CRM/SC 38229).</p>
    <a class="btn gold" href="{{{{WA:{WA}}}}}" target="_blank" rel="noopener" data-fade>{{{{ICO_WA}}}} Agendar avaliação</a>
    <p style="margin-top:22px" data-fade><a href="/equipe/dr-pedro-schmitz/" style="color:var(--dour)">Conheça o Dr. Pedro →</a></p>
  </div>
</section>
'''
open(os.path.join(os.path.dirname(__file__), 'pages', 'pequenas-cirurgias.html'), 'w').write(html)
print(len(CIR), 'cirurgias')
