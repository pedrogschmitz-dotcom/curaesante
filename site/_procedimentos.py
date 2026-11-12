# Gera site/pages/proc-*.html (páginas de procedimento). Rodar: python3 site/_procedimentos.py
import json, os

MED = {
 'pedro': {'nome': 'Dr. Pedro Schmitz', 'crm': 'CRM/SC 38229', 'perfil': '/equipe/dr-pedro-schmitz/', 'curto': 'o Dr. Pedro', 'wa': 'Olá! Quero agendar uma avaliação com o Dr. Pedro Schmitz sobre {}.'},
 'julia': {'nome': 'Dra. Júlia Schmitz', 'crm': 'CRM/SC 34242', 'perfil': '/equipe/dra-julia-schmitz/', 'curto': 'a Dra. Júlia', 'wa': 'Olá! Quero agendar uma consulta com a Dra. Júlia Schmitz sobre {}.'},
}

PROCS = [
 {
  "slug": "toxina-botulinica", "nome": "Toxina botulínica", "kick": "Rugas de expressão",
  "foto": "/s/img/pedro-toxina.jpg", "assunto": "toxina botulínica",
  "title": "Toxina botulínica em São José/SC | Curae Santé",
  "description": "Toxina botulínica para rugas de expressão da testa, entre as sobrancelhas e ao redor dos olhos. Como funciona, riscos e cuidados. São José/SC.",
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
  "foto": "/s/img/pedro-espelho.jpg", "assunto": "preenchimento com ácido hialurônico",
  "title": "Preenchimento com ácido hialurônico em São José/SC",
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
  "description": "Bioestimuladores de colágeno para firmeza da pele: como funcionam, número de sessões, tempo de resposta e riscos. Curae Santé, São José/SC.",
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
  "foto": "/s/img/pedro-cirurgia.jpg", "assunto": "retirada de cisto, lipoma ou pinta",
  "title": "Retirada de cisto, lipoma e pintas em São José/SC | Curae Santé",
  "description": "Retirada de cisto sebáceo, lipoma e pintas com anestesia local, em consultório, com biópsia quando indicada. Kobrasol, São José/SC.",
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

PROCS += [
 {
  "medico": "julia", "tipo": "terapia",
  "slug": "programa-de-emagrecimento", "nome": "Programa de emagrecimento", "kick": "Emagrecimento com acompanhamento",
  "foto": "/s/img/dra-julia.jpg", "assunto": "o programa de emagrecimento",
  "title": "Programa de emagrecimento em São José/SC | Curae Santé",
  "description": "Emagrecimento com acompanhamento médico: investigação do que trava o peso, alimentação, sono e medicamentos quando indicados. Kobrasol, São José/SC.",
  "lead": "Para quem já tentou de tudo e o peso não sai, ou sai e volta. Primeiro entender o porquê, depois montar um plano que cabe na sua rotina.",
  "oque": "É um acompanhamento médico contínuo, não uma dieta pronta. Começa por investigar o que dificulta o emagrecimento: resistência à insulina, alterações hormonais, sono, estresse, medicamentos em uso e histórico de tentativas. A partir disso, o plano combina alimentação, movimento, sono e, quando há indicação, medicamentos, sempre com retornos para ajustar o caminho e preservar massa muscular.",
  "para": ["Peso que não sai mesmo com esforço", "Efeito sanfona e reganho depois de dietas", "Resistência à insulina, pré-diabetes ou gordura no fígado", "Ganho de peso na perimenopausa e menopausa", "Quem quer emagrecer preservando músculo"],
  "nao_kick": "Para alinhar expectativas", "nao_titulo": "O que o programa não é",
  "nao": ["Prescrição rápida de remédio sem avaliação", "Dieta restritiva genérica", "Promessa de quilos em prazo fixo", "Atendimento sem retornos: o acompanhamento faz parte do tratamento"],
  "como": [["Consulta inicial longa", "História, rotina, alimentação, sono, tentativas anteriores e objetivos."], ["Exames direcionados", "Avaliação metabólica e hormonal pensada para o seu caso."], ["Plano individualizado", "Alimentação, movimento, sono e medicamentos quando indicados, explicados com calma."], ["Retornos", "Acompanhamento de peso, composição corporal e exames, com ajustes do plano."]],
  "riscos_titulo": "Segurança e acompanhamento",
  "riscos": "Quando há uso de medicamentos para obesidade, os efeitos mais comuns são náusea, alteração do intestino e menos apetite, principalmente no início. Por isso a dose é ajustada aos poucos e acompanhada nos retornos. A perda de peso muito rápida também pode causar queda de cabelo e perda de massa muscular, o que o plano busca evitar.",
  "aviso": "<strong>Resultados variam de pessoa para pessoa.</strong> Nenhum medicamento é prescrito sem consulta, exames e acompanhamento.",
  "faq": [
   {"q": "Vou precisar tomar remédio?", "a": "Não necessariamente. Medicamentos são uma ferramenta usada quando há indicação clínica, sempre junto com alimentação, movimento e sono."},
   {"q": "Em quanto tempo vejo resultado?", "a": "Varia muito entre pessoas. O objetivo é uma perda sustentável, que se mantenha depois, e não a mais rápida possível."},
   {"q": "Como evitar o reganho?", "a": "Com acompanhamento na fase de manutenção, preservação de massa muscular e um plano que caiba na rotina. Essa fase é tão importante quanto a de perda."},
   {"q": "Preciso fazer exames antes?", "a": "Os exames são pedidos de forma direcionada na primeira consulta. Se você já tem exames recentes, leve para a consulta."}
  ],
  "rel": ["manutencao-do-peso-emagrecimento", "medicamentos-emagrecimento-quando-indicar", "massa-muscular-emagrecimento"]
 },
 {
  "medico": "julia", "tipo": "terapia",
  "slug": "menopausa-e-insonia", "nome": "Menopausa e insônia", "kick": "Saúde da mulher",
  "foto": "/s/img/recepcao.jpg", "assunto": "menopausa e insônia",
  "title": "Menopausa e insônia em São José/SC | Curae Santé",
  "description": "Perimenopausa, menopausa e insônia: calores, sono ruim e irritabilidade investigados com calma. Reposição hormonal só quando indicada. São José/SC.",
  "lead": "Calores, noites mal dormidas, irritabilidade, ganho de peso. Os sintomas da transição para a menopausa merecem ser levados a sério, e o sono costuma ser o primeiro a sofrer.",
  "oque": "A perimenopausa pode começar anos antes da última menstruação, com mudanças no ciclo, no sono, no humor e no peso. A insônia nessa fase tem muitas causas possíveis: calores noturnos, ansiedade, hábitos, medicamentos, apneia do sono e outras doenças. O atendimento investiga o conjunto, explica as opções com riscos e benefícios, e decide junto com você o que faz sentido, da mudança de rotina ao tratamento medicamentoso, incluindo a reposição hormonal quando indicada.",
  "para": ["Calores e suores noturnos", "Dificuldade para dormir ou acordar várias vezes à noite", "Irritabilidade, ansiedade ou queda de libido", "Ganho de peso e mudança no formato do corpo", "Ciclos irregulares depois dos 40"],
  "nao_kick": "Para alinhar expectativas", "nao_titulo": "O que não fazemos",
  "nao": ["Reposição hormonal para todas, sem avaliação de riscos", "Implantes hormonais para fins estéticos ou de desempenho", "Remédio para dormir como primeira e única resposta", "Conduta sem exames e sem acompanhamento"],
  "como": [["Escuta e história", "Sintomas, ciclo, sono, humor, rotina, histórico pessoal e familiar."], ["Exames", "Avaliação laboratorial e rastreamentos adequados à idade, quando indicados."], ["Plano conjunto", "Hábitos e higiene do sono, tratamento da causa e opções hormonais ou não hormonais, discutidas com você."], ["Acompanhamento", "Retornos para avaliar sintomas, sono e efeitos do tratamento."]],
  "riscos_titulo": "Segurança",
  "riscos": "A reposição hormonal tem benefícios e riscos que dependem da idade, do tempo desde a menopausa e do histórico de cada mulher, como trombose, câncer de mama e doenças do coração. Por isso a decisão é individual, revista ao longo do tempo. Medicamentos para dormir podem causar dependência e sonolência no dia seguinte, e são usados com critério.",
  "aviso": "<strong>Cada mulher vive essa fase de um jeito.</strong> Procure atendimento se houver sangramento fora do padrão depois da menopausa, falta de ar, dor no peito ou ronco com pausas na respiração.",
  "faq": [
   {"q": "Toda mulher precisa de reposição hormonal?", "a": "Não. A reposição tem indicações e contraindicações claras. Muitas mulheres melhoram com outras medidas. A decisão é individual."},
   {"q": "Insônia na menopausa é normal?", "a": "É comum, mas não é algo para simplesmente aguentar. Tem causas que podem ser investigadas e tratadas."},
   {"q": "A partir de que idade começa a perimenopausa?", "a": "Costuma começar entre os 40 e os 50 anos, mas varia. Mudanças no ciclo e no sono podem ser os primeiros sinais."},
   {"q": "Ganhar peso na menopausa é inevitável?", "a": "Não. As mudanças hormonais favorecem o acúmulo de gordura abdominal, mas alimentação, treino de força e sono fazem diferença."}
  ],
  "rel": ["perimenopausa-sinais-iniciais", "menopausa-ganho-peso-abdominal", "sono-e-emagrecimento"]
 },
 {
  "medico": "julia", "tipo": "terapia",
  "slug": "investigacao-metabolica", "nome": "Investigação metabólica", "kick": "Metabolismo",
  "foto": "/s/img/consultorio.jpg", "assunto": "investigação metabólica",
  "title": "Resistência à insulina e metabolismo em São José/SC",
  "description": "Investigação de resistência à insulina, colesterol, gordura no fígado e tireoide, com plano de acompanhamento. Curae Santé, São José/SC.",
  "lead": "Cansaço, ganho de peso, exames alterados que ninguém explicou direito. A investigação metabólica junta as peças e transforma números em um plano.",
  "oque": "É uma avaliação clínica focada em como o seu corpo usa e armazena energia. Inclui história, exame físico, medidas e exames laboratoriais direcionados, como glicose, insulina, hemoglobina glicada, colesterol, função do fígado e da tireoide. O objetivo é entender o risco e a causa, e não apenas tratar um exame isolado.",
  "para": ["Resistência à insulina e pré-diabetes", "Colesterol ou triglicerídeos alterados", "Gordura no fígado (esteatose)", "Alterações da tireoide", "Gordura abdominal e risco cardiovascular"],
  "nao_kick": "Para alinhar expectativas", "nao_titulo": "O que não fazemos",
  "nao": ["Pedido de exames em excesso sem indicação", "Tratar número de exame sem olhar a pessoa", "Soluções milagrosas ou suplementos sem evidência"],
  "como": [["Consulta", "História, sintomas, rotina, histórico familiar e exames anteriores."], ["Exames", "Pedidos de forma direcionada, explicados um a um."], ["Plano", "Alimentação, movimento, sono e medicamentos quando indicados."], ["Retornos", "Reavaliação dos marcadores e ajuste do plano."]],
  "riscos_titulo": "Por que investigar",
  "riscos": "Alterações metabólicas costumam ser silenciosas por anos e aumentam o risco de diabetes, doenças do coração e do fígado. Identificar cedo permite agir com mudanças de rotina antes que os problemas se instalem.",
  "aviso": "<strong>Exame alterado não é diagnóstico isolado.</strong> A interpretação considera a sua história e o conjunto dos resultados.",
  "faq": [
   {"q": "Resistência à insulina tem sintomas?", "a": "Muitas vezes não. Alguns sinais são ganho de gordura abdominal, manchas escuras no pescoço e axilas, cansaço depois das refeições. Os exames ajudam a confirmar."},
   {"q": "Gordura no fígado tem tratamento?", "a": "Sim. A principal estratégia é a perda de peso com mudança de hábitos, e em alguns casos há medicamentos indicados."},
   {"q": "Preciso estar em jejum para os exames?", "a": "Depende dos exames pedidos. As orientações são passadas junto com o pedido."}
  ],
  "rel": ["resistencia-a-insulina-sintomas-exames", "esteatose-hepatica-reversao", "gordura-abdominal-e-risco-cardiovascular"]
 },
]

PROCS += [
 {
  "slug": "unha-encravada", "nome": "Unha encravada", "kick": "Pequena cirurgia",
  "foto": "/s/img/pes.jpg", "assunto": "unha encravada",
  "title": "Unha encravada: tratamento e cirurgia em São José/SC",
  "description": "Unha encravada que inflama ou volta sempre: quando tratar em casa e quando operar. Cirurgia com anestesia local no Kobrasol, São José/SC.",
  "lead": "Dor no canto do dedão, vermelhidão, pus, e a unha que volta a encravar. Nos casos leves dá para cuidar em casa; quando inflama ou se repete, uma pequena cirurgia resolve na maioria das vezes.",
  "oque": "A unha encravada acontece quando a borda da unha entra na pele do canto do dedo, quase sempre o dedão. É muito comum, principalmente em jovens. Os principais gatilhos são cortar a unha curta demais ou arredondar os cantos, usar calçado apertado, suar muito nos pés e pancadas. A cirurgia retira só a faixa lateral da unha que encrava e trata a raiz daquele canto para ela não voltar a crescer torta.",
  "para": ["Unha que inflama, dói ou solta pus", "Unha que já encravou mais de uma vez", "Quando os cuidados em casa não resolveram", "Carne crescida no canto da unha (granuloma)"],
  "nao_kick": "Antes de operar", "nao_titulo": "Quando cuidar em casa ou adiar",
  "nao": ["Casos leves, sem pus: banhos mornos, algodão sob a borda e corte reto podem bastar", "Gravidez: muda a técnica usada na raiz da unha", "Diabetes descompensado ou má circulação nos pés: avaliação antes de qualquer procedimento", "Infecção espalhando pelo dedo ou pelo pé: primeiro tratar a infecção"],
  "como": [["Avaliação", "Exame do dedo, da circulação e do histórico de recidivas."], ["Anestesia", "Anestesia do dedo com uma injeção na base; depois disso, o procedimento não dói."], ["Procedimento", "Retirada da faixa lateral da unha e tratamento da raiz daquele canto. Leva cerca de 30 minutos."], ["Cuidados e retorno", "Pé elevado no primeiro dia, curativo e banhos mornos por 1 a 3 semanas, calçado aberto no início."]],
  "riscos_titulo": "Recuperação e riscos",
  "riscos": "A dor costuma ser leve e controlada com analgésico comum. É normal sair uma secreção clara por 2 a 3 semanas. Mais raramente: infecção, cicatrização lenta ou a unha voltar a encravar. Antibiótico não é necessário de rotina, só quando há infecção espalhando.",
  "aviso": "<strong>Procure a clínica</strong> se houver febre, vermelhidão subindo pelo pé, pus que aumenta ou dor que piora depois do segundo dia.",
  "evid": ["Em revisões sistemáticas de ensaios clínicos, retirar a borda da unha tratando a raiz daquele canto reduz muito a chance de voltar a encravar, em comparação a só arrancar a borda. A qualidade desses estudos é baixa, mas a direção é consistente.", "As diretrizes não recomendam antibiótico de rotina antes ou depois do procedimento, apenas quando há celulite (infecção espalhando pela pele).", "Os cuidados em casa ajudam nos casos leves, mas têm evidência mais fraca e recidiva maior."],
  "refs": ["Exley V et al. Surgical treatments for ingrown toenails, part I and II. J Foot Ankle Res, 2023 (revisão sistemática e metanálise).", "Vinay K et al. Phenol-based partial matricectomy in onychocryptosis. J Eur Acad Dermatol Venereol, 2022 (revisão sistemática).", "Eekhof JA et al. Interventions for ingrowing toenails. Cochrane Database Syst Rev, 2012.", "Mayeaux EJ, Carter C, Murphy TE. Ingrown toenail management. Am Fam Physician, 2019.", "Barreiros H et al. Ácido tricloroacético 80% na unha encravada. An Bras Dermatol, 2013."],
  "faq": [
   {"q": "Vou perder a unha?", "a": "Não. Retira-se só a faixa lateral que encrava. A unha fica um pouco mais estreita, e na maioria das vezes isso quase não aparece."},
   {"q": "Posso trabalhar depois?", "a": "Em geral, sim, já no dia seguinte, com calçado aberto e evitando esforço e impacto nos primeiros dias."},
   {"q": "Como evitar que volte?", "a": "Cortar a unha reta, sem arredondar os cantos e sem deixar curta demais, usar calçado com espaço para os dedos e cuidar do suor excessivo nos pés."},
   {"q": "Criança pode fazer?", "a": "Pode, quando indicado. Em crianças, os cuidados em casa costumam ser tentados primeiro."}
  ],
  "rel": ["mancha-na-pele-quando-avaliar"]
 },
 {
  "slug": "lipoma", "nome": "Lipoma", "kick": "Pequena cirurgia",
  "foto": "/s/img/pedro-cirurgia.jpg", "assunto": "lipoma",
  "title": "Retirada de lipoma em São José/SC | Curae Santé",
  "description": "Lipoma: quando observar, quando investigar e como é a retirada com anestesia local, em consultório. Kobrasol, São José/SC.",
  "lead": "Aquele caroço macio, que mexe sob a pele e cresce devagar. Quase sempre é benigno. Às vezes basta observar; quando incomoda, cresce ou deixa dúvida, a retirada é simples.",
  "oque": "O lipoma é um acúmulo benigno de gordura sob a pele, o tumor de partes moles mais comum. Costuma aparecer entre os 40 e os 60 anos, no pescoço, ombros, costas e braços. É macio, móvel e indolor. A retirada é feita por um corte pequeno, tirando o lipoma inteiro com a sua cápsula, para diminuir a chance de voltar.",
  "para": ["Lipoma que incomoda pela aparência ou pelo atrito da roupa", "Lipoma que cresceu ou ficou dolorido", "Dúvida se é mesmo um lipoma", "Lipomas pequenos e superficiais, que podem ser retirados no consultório"],
  "nao_kick": "Antes de operar", "nao_titulo": "Quando investigar primeiro",
  "nao": ["Caroço maior que 5 cm", "Caroço profundo, duro, preso ou que não mexe", "Crescimento rápido ou recente", "Nesses casos, ultrassom ou ressonância vêm antes, e pode ser preciso centro cirúrgico ou outro profissional"],
  "como": [["Avaliação", "Exame do caroço e, quando indicado, ultrassom."], ["Anestesia", "Anestesia local na região; o procedimento não dói."], ["Retirada", "Corte pequeno, retirada do lipoma inteiro com a cápsula e pontos. A peça pode ir para análise."], ["Cuidados e retorno", "Curativo, compressão leve nos primeiros dias e retirada dos pontos em 1 a 2 semanas."]],
  "riscos_titulo": "Recuperação e riscos",
  "riscos": "A dor costuma ser leve a moderada, controlada com analgésico comum. Podem surgir roxo, acúmulo de líquido ou sangue sob a pele (que às vezes precisa ser drenado), infecção e cicatriz. A volta do lipoma é pouco comum quando ele sai inteiro.",
  "aviso": "<strong>Resultados variam de pessoa para pessoa.</strong> Procure a clínica se houver febre, inchaço que aumenta, sangramento ou dor que piora.",
  "evid": ["A maioria dos lipomas pode ser apenas observada. A retirada é indicada quando incomoda, cresce ou deixa dúvida.", "O ultrassom é o primeiro exame recomendado para caroços de gordura superficiais, com boa precisão em revisão sistemática.", "Caroço grande (acima de 5 cm), profundo, endurecido ou que cresce rápido deve ser investigado com imagem antes de qualquer cirurgia. Retirar sem planejamento uma lesão que não é lipoma pode piorar o tratamento.", "A técnica de referência é a retirada completa com a cápsula. Técnicas alternativas (lipoaspiração, corte mínimo) têm bons resultados em séries de casos, mas ainda sem ensaios comparativos."],
  "refs": ["Rahmani G, McCarthy P, Bergin D. Diagnostic accuracy of ultrasonography for soft tissue lipomas: systematic review. Acta Radiol Open, 2017.", "Salam GA. Lipoma excision. Am Fam Physician, 2002.", "Smolle MA, Leithner A, Grimer RJ. Evaluating the British sarcoma referral form. Ann R Coll Surg Engl, 2015.", "Gahanbani Ardakani AH et al. Soft tissue sarcoma: recognizing a rare disease. Cleve Clin J Med, 2022.", "Gronchi A et al. Soft tissue and visceral sarcomas: ESMO-EURACAN-GENTURIS clinical practice guidelines. Ann Oncol, 2021."],
  "faq": [
   {"q": "Lipoma vira câncer?", "a": "O lipoma comum é benigno e não vira câncer. O cuidado é outro: alguns tumores raros podem parecer lipoma. Por isso caroços grandes, profundos ou que crescem rápido são investigados antes."},
   {"q": "Preciso tirar?", "a": "Não necessariamente. Se é pequeno, macio, estável e não incomoda, pode ser só acompanhado."},
   {"q": "Fica cicatriz?", "a": "Fica uma cicatriz linear, do tamanho do corte, planejada para ficar o mais discreta possível, de preferência nas linhas naturais da pele."},
   {"q": "Pode voltar?", "a": "É pouco comum quando o lipoma sai inteiro com a cápsula. Novos lipomas podem surgir em outros lugares."}
  ],
  "rel": ["mancha-na-pele-quando-avaliar"]
 },
 {
  "slug": "verrugas", "nome": "Verrugas", "kick": "Pele",
  "foto": "/s/img/maos.jpg", "assunto": "verrugas",
  "title": "Verrugas: quando e como tratar em São José/SC | Curae Santé",
  "description": "Verrugas nas mãos e nos pés: quando esperar, quando tratar e o que funciona segundo as diretrizes. Avaliação na Curae Santé, Kobrasol, São José/SC.",
  "lead": "Verruga é uma infecção comum e benigna da pele. Muitas somem sozinhas, mas podem demorar meses ou anos. Quando incomodam, há tratamentos com boa base científica, e a escolha depende do local.",
  "oque": "As verrugas são causadas pelo HPV de pele, tipos diferentes dos que afetam a região genital. Pegam por contato direto ou em pisos úmidos compartilhados e são muito comuns em crianças. As da planta do pé são as mais resistentes. O tratamento combina medicação na pele com sessões no consultório, como a crioterapia (congelamento), e às vezes curetagem ou cauterização.",
  "para": ["Verruga que dói, sangra ou incomoda", "Verrugas que se espalham", "Verruga que não sumiu depois de meses de tratamento em casa", "Dúvida se a lesão é mesmo uma verruga"],
  "nao_kick": "Para alinhar expectativas", "nao_titulo": "Quando observar ou avaliar melhor",
  "nao": ["Verruga pequena que não incomoda: pode-se esperar, muitas somem sozinhas", "Verrugas genitais ou anais: outro tipo de cuidado, com encaminhamento", "Imunidade baixa (transplante, quimioterapia, HIV): avaliação mais ampla", "Lesão escura, que sangra ou cresce rápido: avaliar outros diagnósticos"],
  "como": [["Avaliação", "Confirmar que é verruga e escolher o tratamento pelo local e pela idade."], ["Tratamento em casa", "Medicação na pele todos os dias, com lixamento leve, quando indicado."], ["Sessões no consultório", "Congelamento ou outra técnica, repetidos a cada 2 a 4 semanas, por até cerca de 3 meses."], ["Retorno", "Reavaliar a resposta e ajustar o plano."]],
  "riscos_titulo": "Efeitos e riscos",
  "riscos": "O congelamento arde na hora e por algumas horas, e pode formar bolha nos dias seguintes. Em pele mais escura, pode deixar mancha clara ou escura. Cicatriz é rara e ocorre mais com técnicas agressivas. Verrugas voltam com frequência, por isso o acompanhamento faz parte do tratamento.",
  "aviso": "<strong>Resultados variam de pessoa para pessoa.</strong> Não estoure bolhas e não compartilhe toalhas, lixas ou alicates.",
  "evid": ["Muitas verrugas somem sozinhas: cerca de metade das crianças melhora em 1 ano e dois terços em 2 anos. Em adultos, a resolução costuma ser mais lenta.", "O ácido salicílico na pele funciona melhor que placebo, com efeito moderado, segundo revisão Cochrane de 85 ensaios.", "Somar o congelamento ao ácido salicílico funciona melhor que o ácido sozinho. O congelamento costuma responder melhor nas mãos do que na planta do pé.", "Em um ensaio com 250 pacientes, a verruga comum teve mais cura com congelamento do que com ácido salicílico ou só observação, em 13 semanas."],
  "refs": ["Kwok CS et al. Topical treatments for cutaneous warts. Cochrane Database Syst Rev, 2012.", "Sterling JC et al. British Association of Dermatologists' guidelines for the management of cutaneous warts. Br J Dermatol, 2014.", "Bruggink SC et al. Cryotherapy vs salicylic acid for cutaneous warts in primary care: randomized trial. CMAJ, 2010.", "Bruggink SC et al. Natural course of cutaneous warts among primary schoolchildren. Ann Fam Med, 2013."],
  "faq": [
   {"q": "Verruga pega?", "a": "Pega, por contato direto ou em pisos úmidos compartilhados. Usar chinelo em vestiários e não compartilhar toalhas e lixas ajuda."},
   {"q": "Precisa tratar?", "a": "Não sempre. Se não incomoda, esperar é uma opção razoável, principalmente em crianças."},
   {"q": "Quantas sessões são necessárias?", "a": "Varia. Em geral, sessões a cada 2 a 4 semanas por cerca de 3 meses. As da planta do pé costumam precisar de mais."},
   {"q": "Fita adesiva funciona?", "a": "Nos estudos reunidos, a fita adesiva não mostrou vantagem clara sobre placebo."}
  ],
  "rel": ["mancha-na-pele-quando-avaliar"]
 },
 {
  "slug": "queratose-seborreica", "nome": "Queratose seborreica", "kick": "Pele",
  "foto": "/s/img/queratose.jpg", "assunto": "queratose seborreica",
  "title": "Queratose seborreica: o que é e como remover | Curae Santé",
  "description": "Queratose seborreica: as manchas elevadas que aparecem com a idade. Quando é só estética, quando avaliar e como é a remoção. São José/SC.",
  "lead": "Manchas elevadas, acastanhadas, de aspecto \"colado\" na pele, que aparecem com a idade. São benignas e muito comuns. A remoção é uma escolha, e o exame antes é o que garante que é mesmo uma queratose.",
  "oque": "A queratose seborreica é a lesão benigna mais comum da pele. Surge com a idade, no rosto, no tronco e no pescoço, e tem forte componente genético. Não vira câncer. O ponto de atenção é outro: algumas lesões malignas podem imitar uma queratose. Por isso o exame com dermatoscópio vem antes de qualquer remoção.",
  "para": ["Lesão que incomoda pela aparência", "Lesão que enrosca na roupa, coça ou irrita", "Dúvida se a mancha é mesmo uma queratose", "Lesão que mudou de cor, tamanho ou formato"],
  "nao_kick": "Antes de remover", "nao_titulo": "Quando investigar primeiro",
  "nao": ["Lesão que sangra, ulcera ou cresce rápido", "Pontos escuros irregulares ou cores diferentes na mesma lesão", "Na dúvida, a lesão é retirada e enviada para análise, e não apenas destruída", "Surgimento repentino de muitas lesões ao mesmo tempo merece avaliação clínica"],
  "como": [["Avaliação", "Exame com dermatoscópio para confirmar o diagnóstico."], ["Escolha da técnica", "Congelamento, curetagem, cauterização ou laser, conforme o tamanho, o local e o tom de pele."], ["Procedimento", "Rápido, com anestésico local quando necessário."], ["Cuidados", "Crosta que cai em 1 a 3 semanas, sem arrancar, e protetor solar na área."]],
  "riscos_titulo": "Efeitos e riscos",
  "riscos": "O principal efeito é a mudança de cor na área tratada, mancha clara ou escura, mais frequente em pele morena ou negra. Por isso a técnica é escolhida pelo tom de pele. Cicatriz é pouco comum. Novas queratoses podem surgir com o tempo.",
  "aviso": "<strong>Resultados variam de pessoa para pessoa.</strong> Proteja a área do sol durante a cicatrização para reduzir manchas.",
  "evid": ["A queratose seborreica é benigna e, em geral, não precisa de tratamento; a remoção é estética ou por irritação.", "A dermatoscopia ajuda a diferenciar, mas algumas lesões malignas podem ser muito parecidas. Na dúvida, a lesão deve ser retirada e analisada.", "Em um ensaio clínico pequeno, cauterização e lasers tiveram resultado e satisfação melhores que o congelamento. A evidência ainda é limitada.", "Em pele mais escura, a alteração de cor depois do procedimento é o efeito mais relatado."],
  "refs": ["Barthelmann S et al. Seborrheic keratosis. J Dtsch Dermatol Ges, 2023 (revisão).", "Karadag AS, Parish LC. The status of the seborrheic keratosis. Clin Dermatol, 2018.", "Janowska A et al. Seborrheic keratosis-like melanoma: a diagnostic challenge. Melanoma Res, 2021.", "Zaresharifi S et al. Cryotherapy, electrodesiccation, CO2 and Er:YAG laser in seborrheic keratosis: randomized trial. Dermatol Ther, 2021.", "Jain S, Caire H, Haas CJ. Management of dermatosis papulosa nigra: systematic review. Int J Dermatol, 2025."],
  "faq": [
   {"q": "Queratose seborreica vira câncer?", "a": "Não. Ela é benigna. O cuidado é confirmar o diagnóstico, porque algumas lesões malignas podem se parecer com ela."},
   {"q": "Preciso remover?", "a": "Não é obrigatório. A remoção é indicada quando incomoda ou quando há dúvida no diagnóstico."},
   {"q": "Deixa mancha?", "a": "Pode deixar mancha clara ou escura, principalmente em pele morena ou negra. A técnica e os cuidados com o sol ajudam a reduzir esse risco."},
   {"q": "Pode voltar?", "a": "A lesão tratada raramente volta quando sai inteira, mas novas queratoses aparecem com o tempo."}
  ],
  "rel": ["mancha-na-pele-quando-avaliar", "envelhecimento-pele-prevencao"]
 },
]

ALT = {"/s/img/pedro-toxina.jpg": "Dr. Pedro Schmitz planejando os pontos de aplicação em uma ficha de toxina botulínica", "/s/img/pedro-espelho.jpg": "Dr. Pedro Schmitz explicando um ponto do rosto diante do espelho", "/s/img/pedro-cirurgia.jpg": "Dr. Pedro Schmitz com instrumentos de pequena cirurgia no consultório", "/s/img/consultorio.jpg": "Consultório da Curae Santé, no Kobrasol, em São José/SC", "/s/img/recepcao.jpg": "Recepção da Curae Santé, no Kobrasol, em São José/SC", "/s/img/pele.jpg": "Imagem ilustrativa de cuidado com a pele", "/s/img/dra-julia.jpg": "Dra. Júlia Schmitz, médica da Curae Santé", "/s/img/pes.jpg":"Pés descalços sobre piso de madeira","/s/img/maos.jpg":"Mãos de mulher em luz suave","/s/img/queratose.jpg":"Pele vista de perto","/s/img/bandeja.jpg": "Instrumentos cirúrgicos esterilizados sobre campo azul"}

def li(items): return ''.join(f'<li>{x}</li>' for x in items)

for p in PROCS:
    m = MED[p.get('medico', 'pedro')]
    WA = m['wa']
    url = f"/servicos/{p['slug']}/"
    meta = {"url": url, "nav": "procedimentos", "title": p["title"], "description": p["description"],
            "parent": ["Procedimentos", "/procedimentos/"], "crumb": p["nome"], "faqItems": p["faq"],
            "ld": [{"@type": "MedicalProcedure", "name": p["nome"], "url": "https://curaesante.com.br" + url,
                    "description": p["description"], "howPerformed": p["oque"], "followup": "Retorno combinado na consulta.",
                    "procedureType": "https://schema.org/NoninvasiveProcedure" if p["slug"] != "retirada-de-cisto-lipoma-e-pintas" else "https://schema.org/SurgicalProcedure"} if p.get("tipo") != "terapia" else {"@type": "MedicalTherapy", "name": p["nome"], "url": "https://curaesante.com.br" + url, "description": p["description"]}]}
    steps = ''.join(f'<div class="s"><h3>{t}</h3><p>{d}</p></div>' for t, d in p['como'])
    irmaos = ''.join(f'<a class="btn lined" style="padding:12px 20px;font-size:14px" href="/servicos/{o["slug"]}/">{o["nome"]}</a>' for o in PROCS if o.get('medico','pedro') == p.get('medico','pedro') and o is not p) + (f'<a class="btn lined" style="padding:12px 20px;font-size:14px" href="/metabolismo-feminino/">Metabolismo feminino</a>' if p.get('medico')=='julia' else f'<a class="btn lined" style="padding:12px 20px;font-size:14px" href="/servicos/pequenas-cirurgias/">Pequenas cirurgias</a><a class="btn lined" style="padding:12px 20px;font-size:14px" href="/blog/bigode-chines/">Guia: bigode chinês</a>')
    refs_html = (f'<section class="pad-s"><div class="wrap narrow"><span class="kick" data-fade>Base científica</span><h2 data-split style="font-size:clamp(30px,3.6vw,44px)">O que dizem as diretrizes</h2>' + ''.join(f'<p data-fade>{x}</p>' for x in p['evid']) + '<details class="refs"><summary>Referências</summary><ol>' + ''.join(f'<li>{r}</li>' for r in p['refs']) + '</ol></details><p class="note">Revisado por Dr. Pedro Schmitz (CRM/SC 38229). Conteúdo informativo; não substitui a consulta.</p></div></section>\n\n') if p.get('refs') else ''
    rel = ''.join(f'{{{{POST:{r}}}}}' for r in p['rel'])
    body = f'''<!--meta {json.dumps(meta, ensure_ascii=False)} -->
<section class="phead"><div class="wrap g2" style="align-items:center">
  <div>
    <div class="crumbs" data-in><a href="/">Início</a> · <a href="/procedimentos/">Procedimentos</a> · {p['nome']}</div>
    <span class="kick" data-in>{p['kick']}</span>
    <h1 style="font-size:clamp(44px,6.4vw,88px)">{p['nome']}</h1>
    <p class="lead" data-in>{p['lead']}</p>
    <div class="ctas" data-in><a class="btn gold" href="{{{{WA:{WA.format(p['assunto'])}}}}}" target="_blank" rel="noopener">{{{{ICO_WA}}}} Agendar avaliação</a><a class="btn line" href="#como">Como é feito</a></div>
  </div>
  <div class="ph tall" data-in><img src="{p['foto']}" alt="{ALT.get(p['foto'], '')}" width="1000" height="1250"></div>
</div></section>

<section class="pad">
  <div class="wrap g2" style="align-items:start">
    <div><span class="kick" data-fade>O que é</span><h2 data-split>Entenda {'o tratamento' if p.get('tipo')=='terapia' else 'o procedimento'}</h2></div>
    <div><p class="lead" data-fade>{p['oque']}</p></div>
  </div>
</section>

<section class="pad cr">
  <div class="wrap g2" style="align-items:start">
    <div><span class="kick" data-fade>Para quem é</span><h2 data-split>Quando costuma ser indicado</h2><ul class="chk" data-stagger>{li(p['para'])}</ul></div>
    <div><span class="kick" data-fade>{p.get('nao_kick','Quando não fazer')}</span><h2 data-split>{p.get('nao_titulo','Quando adiar ou evitar')}</h2><ul class="chk" data-stagger>{li(p['nao'])}</ul></div>
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
    <h2 data-split>{p.get('riscos_titulo','Efeitos esperados e riscos')}</h2>
    <div class="warn" data-fade><p>{p['riscos']}</p><p>{p.get('aviso','<strong>Resultados variam de pessoa para pessoa.</strong> Procure a clínica se notar dor forte, mudança de cor da pele, febre ou qualquer sinal fora do esperado.')}</p></div>
  </div>
</section>

{refs_html}<section class="pad cr">
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

<section class="pad-s cr">
  <div class="wrap">
    <span class="kick" data-fade>Outros tratamentos com {m['curto'].split(' ',1)[1]}</span>
    <div class="chips" style="margin-top:16px" data-fade>{irmaos}</div>
  </div>
</section>

<section class="pad dk" style="text-align:center">
  <div class="wrap narrow">
    <h2 data-split>Quer saber se é indicado para você?</h2>
    <p class="lead" data-fade>A avaliação é feita {'pela' if p.get('medico')=='julia' else 'pelo'} {m['nome']} ({m['crm']}), na Curae Santé, no Kobrasol.</p>
    <a class="btn gold" href="{{{{WA:{WA.format(p['assunto'])}}}}}" target="_blank" rel="noopener" data-fade>{{{{ICO_WA}}}} Agendar avaliação</a>
    <p style="margin-top:22px" data-fade><a href="{m['perfil']}" style="color:var(--dour)">Conheça {m['curto']} →</a></p>
  </div>
</section>
'''
    open(os.path.join(os.path.dirname(__file__), 'pages', f"proc-{p['slug']}.html"), 'w').write(body)
print(len(PROCS), 'páginas de procedimento')
