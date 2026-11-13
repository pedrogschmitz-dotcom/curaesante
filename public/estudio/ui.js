'use strict';
(() => {
const M = window.Motor, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const { W, H } = M;

/* ---------------- dados ---------------- */
const PROCS = {
  ah: { nome: 'Preenchimento com ácido hialurônico', curto: 'Preenchimento', indic: 'Perda de volume e de sustentação, com sulcos e sombras que deixam o rosto com aspecto cansado.', compl: 'Inchaço, roxos e sensibilidade nos primeiros dias. Mais raramente: nódulos, assimetria ou complicação vascular, que exige avaliação imediata.', interval: 'Imediatamente após', regs: ['malar', 'bigode', 'mento'] },
  bio: { nome: 'Bioestimulador de colágeno', curto: 'Bioestimulador', indic: 'Flacidez leve a moderada e perda de firmeza da pele.', compl: 'Inchaço e roxos transitórios; nódulos são possíveis. O resultado é gradual, ao longo de semanas a meses.', interval: '90 dias após', regs: ['malar', 'mandibula', 'prejowl'] },
  tox: { nome: 'Toxina botulínica', curto: 'Toxina botulínica', indic: 'Linhas de expressão que aparecem com o movimento: testa, entre as sobrancelhas e ao redor dos olhos.', compl: 'Pequenos roxos no local e dor de cabeça leve. Raramente, queda transitória da pálpebra ou da sobrancelha.', interval: '15 dias após', regs: ['testa', 'glabela', 'pes'] },
  sb: { nome: 'Hidratação injetável da pele', curto: 'Hidratação injetável', indic: 'Pele desidratada, sem viço e com linhas finas.', compl: 'Pequenas pápulas e inchaço por 1 a 3 dias; roxos pontuais.', interval: '30 dias após', regs: ['malar', 'olheiras'] },
  fio: { nome: 'Fios de PDO', curto: 'Fios de PDO', indic: 'Flacidez leve com perda de contorno do rosto.', compl: 'Inchaço, sensibilidade e pequenas irregularidades transitórias. Raramente, exposição do fio ou infecção.', interval: '30 dias após', regs: ['malar', 'mandibula'] },
  rino: { nome: 'Rinomodelação com ácido hialurônico', curto: 'Rinomodelação', indic: 'Pequenas irregularidades do dorso e da ponta do nariz, para quem não quer cirurgia.', compl: 'Inchaço e roxos leves. Complicação vascular é rara e exige avaliação imediata.', interval: 'Imediatamente após', regs: ['nariz'] },
  lab: { nome: 'Preenchimento labial', curto: 'Preenchimento labial', indic: 'Lábios com pouco volume, contorno apagado ou assimetria.', compl: 'Inchaço e roxos por alguns dias; herpes labial pode ser reativado. Complicação vascular é rara e exige avaliação imediata.', interval: 'Imediatamente após', regs: ['labios'] },
  comb: { nome: 'Protocolo combinado', curto: 'Protocolo combinado', indic: 'Envelhecimento com várias causas ao mesmo tempo: volume, flacidez e qualidade da pele.', compl: 'Inchaço, roxos e sensibilidade transitórios. Cada técnica tem riscos próprios, explicados na consulta.', interval: '60 dias após', regs: ['malar', 'bigode', 'mandibula', 'mento'] },
};
const CIRS = {
  lipoma: { nome: 'Exérese de lipoma', curto: 'Lipoma', indic: 'Nódulo macio sob a pele, de crescimento lento, que incomoda pela aparência, pelo tamanho ou por dor.', tecnica: 'Retirada com anestesia local, por uma incisão sobre o nódulo. A peça vai para análise (anatomopatológico).', cuidados: 'Curativo nas primeiras 24 a 48 horas e evitar esforço na região por cerca de 1 semana. Pontos retirados entre 7 e 14 dias.', compl: 'Hematoma, acúmulo de líquido (seroma), infecção, cicatriz alargada ou queloide e, raramente, volta do lipoma.' },
  cisto: { nome: 'Exérese de cisto epidermoide', curto: 'Cisto epidermoide', indic: 'Bolsa sob a pele, cheia de queratina (o popular cisto sebáceo), que pode inflamar e voltar.', tecnica: 'Com anestesia local: corte pequeno, o conteúdo sai e depois a cápsula é retirada inteira, para reduzir a chance de voltar.', cuidados: 'Curativo nas primeiras 24 a 48 horas e evitar esforço na região por alguns dias. Pontos retirados entre 7 e 14 dias.', compl: 'Infecção, hematoma, cicatriz visível e volta do cisto se ficar parte da cápsula.' },
  lobulo: { nome: 'Lobuloplastia', curto: 'Lobuloplastia', indic: 'Lóbulo da orelha rasgado ou com furo alargado pelo uso de brincos.', tecnica: 'Correção com anestesia local: as bordas do lóbulo são refeitas e suturadas.', cuidados: 'Não usar brinco no local até a liberação, em geral de 6 a 8 semanas. Pontos retirados entre 7 e 10 dias.', compl: 'Cicatriz visível, pequeno entalhe na borda, infecção e, raramente, queloide.' },
  nevo: { nome: 'Exérese de lesão de pele', curto: 'Retirada de lesão', indic: 'Pinta ou lesão com alteração, incômodo ou indicação de análise.', tecnica: 'Retirada com margem, sob anestesia local, e envio para exame anatomopatológico.', cuidados: 'Curativo nas primeiras 24 a 48 horas. Pontos retirados entre 7 e 14 dias, conforme o local.', compl: 'Sangramento, infecção e cicatriz. O resultado da análise define o seguimento.' },
};
const LOCAIS = ['Couro cabeludo', 'Testa', 'Face', 'Pescoço', 'Ombro', 'Costas', 'Tórax', 'Abdome', 'Braço', 'Antebraço', 'Mão', 'Coxa', 'Perna', 'Pé', 'Outro'];
const LOCAIS_LOB = ['Lóbulo direito', 'Lóbulo esquerdo', 'Os dois lóbulos'];
const DIAS_CIR = ['7 dias depois', '14 dias depois', '30 dias depois', '60 dias depois', '90 dias depois', '6 meses depois', '1 ano depois'];
const curP = () => (S.mode === 'cir' ? CIRS[S.proc] || CIRS.lipoma : PROCS[S.proc] || PROCS.ah);
const INTERVALS = ['Imediatamente após', '7 dias após', '15 dias após', '30 dias após', '60 dias após', '90 dias após', '6 meses após'];
const SESS = ['1 sessão', '2 sessões', '3 sessões', '4 sessões', 'Sessão única + retoque'];
const ANGLES = { resultado: 'Resultado', regioes: 'Regiões', planejamento: 'Planejamento', indicacao: 'Para quem é', enquete: 'Enquete', pos: 'O que esperar depois', natural: 'Naturalidade' };
const WEEK = [
  ['SEG', 'cortina', 'resultado', 'O antes e depois', 'Cortina: o resultado do caso.'],
  ['TER', 'zoomreg', 'regioes', 'Região por região', 'Câmera passa por cada área tratada.'],
  ['QUA', 'hightech', 'planejamento', 'Como foi planejado', 'Malha do rosto e as regiões escolhidas.'],
  ['QUI', 'morph', 'indicacao', 'Para quem é indicado', 'Morph de malha com foco na indicação.'],
  ['SEX', 'diagonal', 'enquete', 'Notou a diferença?', 'Diagonal giratória + enquete nos stories.'],
  ['SÁB', 'lupa', 'pos', 'O que pode acontecer depois', 'Efeitos esperados e complicações possíveis.'],
  ['DOM', 'camera25d', 'natural', 'Naturalidade', 'Câmera 2,5D: resultado sem exagero.'],
];

/* ---------------- estado ---------------- */
const S = {
  img: {}, blob: {}, lm: {}, eyes: {}, adj: { dx: 0, dy: 0, ds: 0, dr: 0 },
  frames: {}, proc: 'ah', regs: new Set(PROCS.ah.regs), ml: {}, showMl: false,
  mode: 'est', bgBlack: true, bgDone: {}, cirSel: null, clips: [], sens: true, narr: null, capWords: [], capOn: true, cardT: {}, regOrder: [], dest: 'reel', theme: 'drpedro', style: 'cortina', music: 'suave', sfx: true, tarja: false, angle: 'resultado',
  orig: {}, crop: {}, lmOrig: {}, eyesOrig: {}, checks: {}, caseNo: 1, prof: 0, result: null, roff: {}, mlSide: {}, perSide: false, voice: null, voiceName: '', withProfile: true,
};
const DEF = { p1n: 'Dr. Pedro Schmitz', p1c: 'CRM/SC 38229', p2n: '', p2c: '', marca: 'Curae Santé', handle: '@curaesante', cta1: 'Agende sua', cta2: 'avaliação' };
let CFG = Object.assign({}, DEF);
try { Object.assign(CFG, JSON.parse(localStorage.getItem('estudio-cfg') || '{}')); } catch (e) { }
const saveCfg = () => { try { localStorage.setItem('estudio-cfg', JSON.stringify(CFG)); } catch (e) { } };

/* ---------------- acesso: Face ID (passkey do aparelho) ou senha (só no site) ---------------- */
(async () => {
  if (!/curaesante\.com\.br$/.test(location.hostname)) return;
  const H = 'b3dbed9d716ffed8c1bce4cfa563390efb6f9acf876525044d8406779c2c5f8f';
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } }, del: k => { try { localStorage.removeItem(k); } catch (e) { } } };
  const b64 = a => btoa(String.fromCharCode(...new Uint8Array(a))); const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const rnd = n => crypto.getRandomValues(new Uint8Array(n));
  const temBio = async () => { try { return !!(window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()); } catch (e) { return false; } };
  const sha = async t => { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); };
  let g = null;
  const tela = html => { if (!g) { g = document.createElement('div'); g.className = 'modal on'; g.style.zIndex = 200; g.style.background = 'var(--esc)'; document.body.append(g); } g.innerHTML = '<div class="kick">Curae Santé · estúdio</div>' + html; };
  const sair = () => { if (g) { g.remove(); g = null; } };
  const msg = t => { const m = document.getElementById('gMsg'); if (m) m.textContent = t; };

  async function entrarFace() {
    try {
      await navigator.credentials.get({ publicKey: { challenge: rnd(32), rpId: location.hostname, userVerification: 'required', timeout: 60000, allowCredentials: [{ type: 'public-key', id: unb64(ls.get('estudio-fid')), transports: ['internal', 'hybrid'] }] } });
      sair(); ultimo = Date.now();
    } catch (e) { msg('Não deu certo. Toque de novo ou use a senha.'); }
  }
  async function ativarFace() {
    try {
      const c = await navigator.credentials.create({ publicKey: { challenge: rnd(32), rp: { name: 'Estúdio Curae', id: location.hostname }, user: { id: rnd(16), name: 'estudio-curae', displayName: 'Estúdio Curae' }, pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }], authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'preferred' }, timeout: 60000, attestation: 'none' } });
      ls.set('estudio-fid', b64(c.rawId)); sair(); ultimo = Date.now();
    } catch (e) { msg('Face ID não foi ativado. Você pode tentar de novo depois.'); }
  }
  function telaFace() {
    tela('<div class="serif" style="font-size:34px">Entrar</div><button class="btn" id="gFace" style="min-width:220px">Entrar com Face ID</button><button class="btn small ghost" id="gPw">Usar senha</button><div class="hint" id="gMsg"></div>');
    document.getElementById('gFace').onclick = entrarFace;
    document.getElementById('gPw').onclick = () => telaSenha(true);
    entrarFace();
  }
  async function oferecerFace() {
    if (!(await temBio()) || ls.get('estudio-fid-nao')) return sair();
    tela('<div class="serif" style="font-size:30px">Usar Face ID?</div><div class="hint" style="max-width:300px;text-align:center">Na próxima vez, o app abre com o seu rosto em vez da senha.</div><button class="btn" id="gAt" style="min-width:220px">Ativar Face ID</button><button class="btn small ghost" id="gNao">Agora não</button><div class="hint" id="gMsg"></div>');
    document.getElementById('gAt').onclick = ativarFace;
    document.getElementById('gNao').onclick = () => { ls.set('estudio-fid-nao', '1'); sair(); };
  }
  function telaSenha(voltarFace) {
    tela('<div class="serif" style="font-size:34px">Acesso restrito</div><input type="password" id="pwIn" placeholder="Senha" style="max-width:280px;text-align:center" autocomplete="current-password"><button class="btn" id="pwOk" style="min-width:200px">Entrar</button>' + (voltarFace ? '<button class="btn small ghost" id="gVolta">Voltar ao Face ID</button>' : '') + '<div class="hint" id="gMsg"></div>');
    const ok = async () => { const h = await sha('estudio:' + document.getElementById('pwIn').value.trim()); if (h !== H) return msg('Senha incorreta.'); ls.set('estudio-ok', H); ultimo = Date.now(); if (ls.get('estudio-fid')) sair(); else oferecerFace(); };
    document.getElementById('pwOk').onclick = ok; document.getElementById('pwIn').addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
    if (voltarFace) document.getElementById('gVolta').onclick = telaFace;
  }
  let ultimo = 0;
  async function abrir() {
    if (ls.get('estudio-fid') && await temBio()) return telaFace();
    if (ls.get('estudio-ok') === H) return oferecerFace();
    telaSenha(false);
  }
  abrir();
  // trava de novo se o app ficar mais de 5 minutos em segundo plano
  let saiu = 0;
  document.addEventListener('visibilitychange', () => { if (document.hidden) saiu = Date.now(); else if (saiu && Date.now() - saiu > 5 * 60 * 1000 && ls.get('estudio-fid') && !g) telaFace(); });
  window.__estudioDesativarFace = () => { ls.del('estudio-fid'); ls.del('estudio-fid-nao'); };
})();
const toast = (m, ms = 2400) => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), ms); };

/* ---------------- MediaPipe (local, sem internet externa) ---------------- */
let LM = null, mpP = null, MPMOD = null, MPFS = null, SEG = null, segP = null;
/* ---------------- tirar o fundo (segmentação de pessoa: cabelo, pele, roupa) ---------------- */
function ensureSeg() {
  if (segP) return segP;
  segP = (async () => {
    await ensureMP(); if (!MPMOD) return null;
    try {
      const r = await fetch(new URL('mp/seg_model.wasm', location.href).href); const len = +r.headers.get('content-length') || 0;
      let buf; if (r.body && len) { const rd = r.body.getReader(); const parts = []; let got = 0; for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; $('#mpState').textContent = `fundo: baixando ${Math.round(got / len * 100)}%`; } buf = new Uint8Array(got); let o = 0; parts.forEach(p => { buf.set(p, o); o += p.length; }); }
      else buf = new Uint8Array(await r.arrayBuffer());
      SEG = await MPMOD.ImageSegmenter.createFromOptions(MPFS, { baseOptions: { modelAssetBuffer: buf, delegate: 'CPU' }, runningMode: 'IMAGE', outputCategoryMask: false, outputConfidenceMasks: true });
      $('#mpState').textContent = LM ? 'rosto: 478 pontos ✓' : 'rosto: modo manual';
    } catch (e) { console.warn('segmentação indisponível', e); SEG = null; }
    return SEG;
  })();
  return segP;
}
async function removeBg(cv) {
  await ensureSeg(); if (!SEG) return null;
  const sc = Math.min(1, 1024 / Math.max(cv.width, cv.height));
  const small = M.mk(Math.round(cv.width * sc), Math.round(cv.height * sc)); small.getContext('2d').drawImage(cv, 0, 0, small.width, small.height);
  let res; try { res = SEG.segment(small); } catch (e) { console.warn(e); return null; }
  const m = res.confidenceMasks && res.confidenceMasks[0]; if (!m) return null;
  const mw = m.width, mh = m.height, bg = m.getAsFloat32Array();
  const mc = M.mk(mw, mh), mx = mc.getContext('2d'), id = mx.createImageData(mw, mh);
  for (let i = 0; i < mw * mh; i++) { let a = 1 - bg[i]; a = Math.min(1, Math.max(0, (a - .35) / .3)); id.data[i * 4 + 3] = Math.round(a * 255); }
  mx.putImageData(id, 0, 0); try { res.close(); } catch (e) { }
  // amplia a máscara em etapas (borda suave) e recorta a pessoa
  const m2 = M.mk(Math.min(cv.width, mw * 4), Math.min(cv.height, mh * 4)); const m2x = m2.getContext('2d'); m2x.imageSmoothingQuality = 'high'; m2x.drawImage(mc, 0, 0, m2.width, m2.height);
  const out = M.mk(cv.width, cv.height), ox = out.getContext('2d');
  const person = M.mk(cv.width, cv.height), px = person.getContext('2d');
  px.drawImage(cv, 0, 0); px.globalCompositeOperation = 'destination-in'; px.imageSmoothingQuality = 'high'; px.drawImage(m2, 0, 0, cv.width, cv.height);
  ox.fillStyle = '#000'; ox.fillRect(0, 0, out.width, out.height); ox.drawImage(person, 0, 0);
  return out;
}
function ensureMP() {
  if (mpP) return mpP;
  $('#mpState').textContent = 'rosto: carregando…';
  mpP = (async () => {
    try {
      const fetchProg = async (url, base, span) => {
        const r = await fetch(url); const len = +r.headers.get('content-length') || 0;
        if (!r.body || !len) return new Uint8Array(await r.arrayBuffer());
        const rd = r.body.getReader(); const parts = []; let got = 0;
        for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; $('#mpState').textContent = `rosto: baixando ${Math.round(base + span * got / len)}%`; }
        const out = new Uint8Array(got); let o = 0; parts.forEach(p => { out.set(p, o); o += p.length; }); return out;
      };
      await fetchProg(new URL('mp/wasm/vision_wasm_internal.wasm', location.href).href, 0, 75);
      const model = await fetchProg(new URL('mp/face_model.wasm', location.href).href, 75, 25);
      $('#mpState').textContent = 'rosto: preparando…';
      const mod = await import(new URL('mp/vision_bundle.js', location.href).href);
      const fs = await mod.FilesetResolver.forVisionTasks(new URL('mp/wasm', location.href).href);
      MPMOD = mod; MPFS = fs;
      LM = await mod.FaceLandmarker.createFromOptions(fs, { baseOptions: { modelAssetBuffer: model, delegate: 'CPU' }, runningMode: 'IMAGE', numFaces: 1 });
      $('#mpState').textContent = 'rosto: 478 pontos ✓';
    } catch (e) {
      console.warn('MediaPipe indisponível', e); LM = null;
      $('#mpState').textContent = 'rosto: modo manual';
    }
    return LM;
  })();
  return mpP;
}
async function detect(src) {
  await ensureMP(); if (!LM) return null;
  const sc = Math.min(1, 1280 / Math.max(src.width, src.height));
  const c = M.mk(Math.round(src.width * sc), Math.round(src.height * sc)); c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
  try {
    const r = LM.detect(c); const f = r.faceLandmarks && r.faceLandmarks[0]; if (!f) return null;
    return f.map(p => ({ x: p.x * src.width, y: p.y * src.height, z: p.z * src.width }));
  } catch (e) { console.warn(e); return null; }
}

/* ---------------- fotos ---------------- */
function loadImg(file) {
  return new Promise((res, rej) => { const u = URL.createObjectURL(file); const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = u; });
}
function toCanvas(img, max = 2400) {
  const s = Math.min(1, max / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
  const c = M.mk(Math.round((img.naturalWidth || img.width) * s), Math.round((img.naturalHeight || img.height) * s));
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); return c;
}
const toBlob = (c, type = 'image/jpeg', q = .9) => new Promise(r => c.toBlob(r, type, q));
/* ---------------- marca d'água: detecta texto/logo nas bordas e corta ---------------- */
// Heurística: procura faixas nas bordas com muitos traços finos e contrastados (texto, logo),
// bem mais "riscadas" que a área vizinha, sem nunca invadir o rosto.
function findWatermark(cv, lm) {
  const sc = Math.min(1, 360 / cv.width), w = Math.round(cv.width * sc), h = Math.round(cv.height * sc);
  const t = M.mk(w, h), x = t.getContext('2d'); x.drawImage(cv, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data, g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = .299 * d[i * 4] + .587 * d[i * 4 + 1] + .114 * d[i * 4 + 2];
  const ed = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) for (let xx = 1; xx < w - 1; xx++) {
    const i = y * w + xx; const gx = g[i + 1] - g[i - 1], gy = g[i + w] - g[i - w];
    if (Math.abs(gx) + Math.abs(gy) > 70) ed[i] = 1;
  }
  // caixa protegida: rosto + margem (sem malha: centro da foto)
  let fb;
  if (lm) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; lm.forEach(p => { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); });
    const fw = x1 - x0, fh = y1 - y0; fb = { x0: (x0 - fw * .06) * sc, x1: (x1 + fw * .06) * sc, y0: (y0 - fh * .1) * sc, y1: (y1 + fh * .04) * sc }; }
  else fb = { x0: w * .22, x1: w * .78, y0: h * .2, y1: h * .8 };
  // perfil por linha (máximo entre terço esquerdo, central e direito, para pegar logo de canto)
  const rowD = y => { let a = 0, b = 0, c = 0; const t3 = w / 3; for (let xx = 0; xx < w; xx++) { const v = ed[y * w + xx]; if (xx < t3) a += v; else if (xx < 2 * t3) b += v; else c += v; } return Math.max(a, b, c) / t3; };
  const colD = xx => { let a = 0, b = 0, c = 0; const t3 = h / 3; for (let y = 0; y < h; y++) { const v = ed[y * w + xx]; if (y < t3) a += v; else if (y < 2 * t3) b += v; else c += v; } return Math.max(a, b, c) / t3; };
  const med = arr => { const s2 = arr.slice().sort((p, q) => p - q); return s2[Math.floor(s2.length / 2)] || 0; };
  // varre de fora para dentro numa faixa de até 22% da borda
  const blocked = [];
  function scan(n, prof, limitIn, fromStart, lado) {
    const band = Math.floor(n * .22); const vals = []; for (let i = 0; i < n; i++) vals.push(prof(i));
    const idx = i => fromStart ? i : n - 1 - i;
    const inner = []; for (let i = band; i < band + Math.floor(n * .12) && i < n; i++) inner.push(vals[idx(i)]);
    const base = med(inner), thr = Math.max(.09, base * 3 + .03);
    let last = -1, gap = 0, hits = 0;
    for (let i = 0; i < band; i++) { const v = vals[idx(i)]; if (v > thr) { last = i; gap = 0; hits++; } else if (last >= 0 && ++gap > n * .03) break; }
    if (last < 0 || hits < Math.max(4, n * .008)) return 0; // linha reta (borda, batente) não é marca d'água
    let cut = last + Math.ceil(n * .015);
    const lim = fromStart ? limitIn : n - limitIn; if (cut > lim) { blocked.push(lado); return 0; } // invadiria o rosto: não corta
    return cut;
  }
  const top = scan(h, rowD, fb.y0, true, 'em cima'), bot = scan(h, rowD, fb.y1, false, 'embaixo'), left = scan(w, colD, fb.x0, true, 'à esquerda'), right = scan(w, colD, fb.x1, false, 'à direita');
  findWatermark.blocked = blocked;
  if (!top && !bot && !left && !right) return null;
  const r = { x: left / sc, y: top / sc, w: (w - left - right) / sc, h: (h - top - bot) / sc, lados: [top && 'em cima', bot && 'embaixo', left && 'à esquerda', right && 'à direita'].filter(Boolean) };
  if (r.w < cv.width * .5 || r.h < cv.height * .5) return null;
  return r;
}
function cropCanvas(cv, r) { const c = M.mk(Math.round(r.w), Math.round(r.h)); c.getContext('2d').drawImage(cv, r.x, r.y, r.w, r.h, 0, 0, c.width, c.height); return c; }
const shiftPts = (P, r) => P && P.map(p => Object.assign({}, p, { x: p.x - r.x, y: p.y - r.y }));
async function applyCrop(k, r) {
  const orig = S.orig[k]; S.crop[k] = r || null;
  let c = r ? cropCanvas(orig, r) : orig;
  S.bgDone[k] = false;
  if (S.bgBlack && S.mode !== 'cir') { const st = $(`.slot[data-k="${k}"] .st`); if (st) st.textContent = 'tirando o fundo…'; const nb = await removeBg(c); if (nb) { c = nb; S.bgDone[k] = true; } }
  S.img[k] = c; S.blob[k] = await toBlob(toCanvas(c, 1600));
  S.lm[k] = S.lmOrig[k] ? (r ? shiftPts(S.lmOrig[k], r) : S.lmOrig[k]) : null;
  S.eyes[k] = S.eyesOrig[k] ? (r ? shiftPts(S.eyesOrig[k], r) : S.eyesOrig[k]) : null;
  const slot = $(`.slot[data-k="${k}"]`); const im = slot.querySelector('img'); if (im) im.src = URL.createObjectURL(S.blob[k]);
  slotStatus(k); buildFrames();
}
function base0(k) {}
function addCamBtns() { $$('.slot').forEach(sl => { const k = sl.dataset.k; if (sl.querySelector('.camb')) return; const b = document.createElement('button'); b.className = 'camb'; b.textContent = '📷'; b.title = 'Câmera'; sl.append(b); b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); if (REF[k] && !S.orig[REF[k]]) toast('Dica: suba primeiro a foto do antes para aparecer o fantasma.', 3200); openCam(k); }); }); }
function slotStatus(k) {
  const slot = $(`.slot[data-k="${k}"]`); let st = slot.querySelector('.st'); if (!st) { st = document.createElement('div'); st.className = 'st'; slot.append(st); }
  let b = slot.querySelector('.cropb'); if (!b) { b = document.createElement('button'); b.className = 'cropb'; b.textContent = '✂'; b.title = 'Recortar'; slot.append(b); b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openCrop(k); }); }
  base0(k);
  const base = S.mode === 'cir' ? '✓ foto pronta' : S.lm[k] ? '✓ rosto encontrado' : S.eyes[k] ? '✓ olhos marcados à mão' : (k[0] === 'f' ? 'rosto não achado: toque em “marcar olhos”' : k[0] === 'v' ? 'rosto não achado: sem tarja, confira' : 'perfil: encaixe pela foto');
  st.textContent = base + (S.crop[k] && S.crop[k].auto ? ' · ✂ marca cortada' : S.crop[k] ? ' · ✂ recortada' : '') + (S.bgDone[k] ? ' · fundo preto' : '');
  st.classList.toggle('warn', !S.lm[k] && !S.eyes[k]);
}
async function setPhoto(k, src, opts = {}) {
  const c = src instanceof HTMLCanvasElement ? src : toCanvas(src);
  S.orig[k] = c; S.crop[k] = null;
  const slot = $(`.slot[data-k="${k}"]`); slot.classList.add('ok');
  let im = slot.querySelector('img'); if (!im) { im = document.createElement('img'); slot.prepend(im); }
  let st = slot.querySelector('.st'); if (!st) { st = document.createElement('div'); st.className = 'st'; slot.append(st); }
  if (opts.lm !== undefined || opts.eyes) { S.lmOrig[k] = opts.lm || null; S.eyesOrig[k] = opts.eyes || null; await applyCrop(k, null); return; }
  im.src = URL.createObjectURL(await toBlob(toCanvas(c, 1200)));
  st.textContent = 'procurando o rosto…'; st.classList.remove('warn');
  S.lmOrig[k] = S.mode === 'cir' ? null : await detect(c); S.eyesOrig[k] = null;
  let r = null; try { r = findWatermark(c, S.lmOrig[k]); } catch (e) { console.warn(e); }
  const bl = findWatermark.blocked || [];
  if (r) { r.auto = true; toast('Achei marca d’água ' + r.lados.join(' e ') + ': cortei. Toque em ✂ para ajustar.' + (bl.length ? ' Há outra ' + bl.join(' e ') + ' encostada no rosto: essa não dá para cortar.' : ''), 4500); }
  else if (bl.length) toast('Parece haver marca d’água ' + bl.join(' e ') + ', mas encostada no rosto: cortar tiraria parte do rosto. Use outra foto ou ajuste no ✂.', 5000);
  await applyCrop(k, r);
}
/* ---------------- câmera com fantasma ---------------- */
const REF = { fa: null, fd: 'fa', pa: null, pd: 'pa', k1: null, k2: null, k3: null, v0: 'fa', v7: 'fa', v14: 'fa', v30: 'fa', vx: 'fa' };
let camK = null, camStream = null, camRaf = 0, camRefLuma = null, camFacing = 'environment';
function regionLuma(src, sw, sh) { const c = M.mk(32, 32), x = c.getContext('2d'); x.drawImage(src, sw * .3, sh * .3, sw * .4, sh * .4, 0, 0, 32, 32); const d = x.getImageData(0, 0, 32, 32).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += .2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2]; return s / 1024; }
async function openCam(k) {
  camK = k; const ref = REF[k] && S.orig[REF[k]];
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { toast('A câmera não abre aqui. Use o estúdio pelo site no Safari.', 4000); return; }
  try { camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: camFacing, width: { ideal: 2160 }, height: { ideal: 3840 } }, audio: false }); }
  catch (e) { toast('Sem acesso à câmera. Libere a câmera para o site nas permissões do Safari.', 4500); return; }
  const v = $('#camVid'); v.srcObject = camStream; await v.play().catch(() => { });
  $('#camTitle').textContent = (S.mode === 'cir' ? { fa: 'Antes', fd: 'Depois', pa: 'Antes · outro ângulo', pd: 'Depois · outro ângulo', k1: 'Peça · ângulo 1', k2: 'Peça · ângulo 2', k3: 'Peça · ângulo 3', v0: 'Pós imediato', v7: '7 dias', v14: '14 dias', v30: '30 dias', vx: 'Outro tempo' } : { v0: 'Pós imediato', v7: '7 dias', v14: '14 dias', v30: '30 dias', vx: 'Outro tempo', fa: 'Frente · antes', fd: 'Frente · depois', pa: 'Perfil · antes', pd: 'Perfil · depois' })[k];
  $('#camGhostRow').style.display = ref ? 'grid' : 'none';
  camRefLuma = ref ? regionLuma(ref, ref.width, ref.height) : null;
  $('#camModal').classList.add('on'); camLoop();
}
function camLoop() {
  const v = $('#camVid'), c = $('#cvCam'), x = c.getContext('2d');
  const vw = v.videoWidth || 1080, vh = v.videoHeight || 1920;
  const box = c.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1);
  if (c.width !== Math.round(box.width * dpr)) { c.width = Math.round(box.width * dpr); c.height = Math.round(box.height * dpr); }
  const cover = (iw, ih) => { const s2 = Math.max(c.width / iw, c.height / ih); return [(c.width - iw * s2) / 2, (c.height - ih * s2) / 2, iw * s2, ih * s2]; };
  x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
  if (vw) { x.save(); if (camFacing === 'user') { x.translate(c.width, 0); x.scale(-1, 1); } x.drawImage(v, ...cover(vw, vh)); x.restore(); }
  const ref = REF[camK] && S.orig[REF[camK]];
  if (ref) { x.globalAlpha = +$('#camGhost').value / 100; x.drawImage(ref, ...cover(ref.width, ref.height)); x.globalAlpha = 1; }
  // guias
  x.strokeStyle = 'rgba(188,167,142,.7)'; x.lineWidth = 1.5 * dpr; x.setLineDash([8 * dpr, 8 * dpr]);
  x.beginPath(); x.moveTo(c.width / 2, 0); x.lineTo(c.width / 2, c.height); x.moveTo(0, c.height * .417); x.lineTo(c.width, c.height * .417); x.stroke(); x.setLineDash([]);
  // medidor de luz
  const m = $('#camLight');
  if (camRefLuma != null && vw) { const l = regionLuma(v, vw, vh), d = (l - camRefLuma) / Math.max(camRefLuma, 1);
    const ok = Math.abs(d) <= .08, mid = Math.abs(d) <= .15;
    m.textContent = ok ? 'Luz igual à do antes ✓' : (d > 0 ? `Mais claro que o antes (+${Math.round(d * 100)}%)` : `Mais escuro que o antes (${Math.round(d * 100)}%)`);
    m.style.background = ok ? '#2E7D32' : mid ? '#B26A00' : '#B3261E'; m.style.display = 'block'; }
  else m.style.display = 'none';
  camRaf = requestAnimationFrame(camLoop);
}
function closeCam() { cancelAnimationFrame(camRaf); if (camStream) camStream.getTracks().forEach(t => t.stop()); camStream = null; $('#camModal').classList.remove('on'); }
$('#camClose').onclick = closeCam;
$('#camFlip').onclick = async () => { const k = camK; closeCam(); camFacing = camFacing === 'environment' ? 'user' : 'environment'; openCam(k); };
$('#camShot').onclick = async () => {
  const v = $('#camVid'); const vw = v.videoWidth, vh = v.videoHeight; if (!vw) return;
  const c = M.mk(vw, vh), x = c.getContext('2d'); if (camFacing === 'user') { x.translate(vw, 0); x.scale(-1, 1); } x.drawImage(v, 0, 0);
  const k = camK; closeCam();
  try { const b = await toBlob(c, 'image/jpeg', .95); const a = document.createElement('a'); } catch (e) { }
  await setPhoto(k, c); toast('Foto registrada. Guarde também no seu arquivo (galeria do estúdio fica só neste aparelho).', 3500);
};

/* recorte manual */
let cropK = null, cropR = null;
function openCrop(k) {
  if (!S.orig[k]) return; cropK = k; const o = S.orig[k]; const r = S.crop[k] || { x: 0, y: 0, w: o.width, h: o.height };
  cropR = { t: r.y / o.height * 100, b: (o.height - r.y - r.h) / o.height * 100, l: r.x / o.width * 100, r: (o.width - r.x - r.w) / o.width * 100 };
  ['t', 'b', 'l', 'r'].forEach(s2 => { $('#cr' + s2).value = cropR[s2].toFixed(1); });
  const c = $('#cvCrop'); const sc = Math.min((innerWidth - 40) / o.width, innerHeight * .5 / o.height); c.width = Math.round(o.width * sc); c.height = Math.round(o.height * sc);
  drawCrop(); $('#cropModal').classList.add('on'); if (typeof cropHist !== 'undefined') cropHist.length = 0;
}
function drawCrop() {
  const c = $('#cvCrop'), x = c.getContext('2d'), o = S.orig[cropK]; x.drawImage(o, 0, 0, c.width, c.height);
  const L = cropR.l / 100 * c.width, T = cropR.t / 100 * c.height, R = c.width - cropR.r / 100 * c.width, B = c.height - cropR.b / 100 * c.height;
  x.fillStyle = 'rgba(10,7,5,.72)'; x.fillRect(0, 0, c.width, T); x.fillRect(0, B, c.width, c.height - B); x.fillRect(0, T, L, B - T); x.fillRect(R, T, c.width - R, B - T);
  x.strokeStyle = '#BCA78E'; x.lineWidth = 2; x.strokeRect(L, T, R - L, B - T);
}
['t', 'b', 'l', 'r'].forEach(s2 => $('#cr' + s2).addEventListener('input', e => { cropR[s2] = +e.target.value; drawCrop(); }));
$('#cropNone').onclick = () => { cropR = { t: 0, b: 0, l: 0, r: 0 }; ['t', 'b', 'l', 'r'].forEach(s2 => $('#cr' + s2).value = 0); drawCrop(); };
$('#cropAuto').onclick = () => { const o = S.orig[cropK]; const r = findWatermark(o, S.lmOrig[cropK]); if (!r) { toast('Não encontrei marca d’água nesta foto.'); return; } cropR = { t: r.y / o.height * 100, b: (o.height - r.y - r.h) / o.height * 100, l: r.x / o.width * 100, r: (o.width - r.x - r.w) / o.width * 100 }; ['t', 'b', 'l', 'r'].forEach(s2 => $('#cr' + s2).value = cropR[s2].toFixed(1)); drawCrop(); };
$('#cropCancel').onclick = () => $('#cropModal').classList.remove('on');
$('#cropOk').onclick = async () => {
  const o = S.orig[cropK]; $('#cropModal').classList.remove('on');
  if (cropR.t + cropR.b + cropR.l + cropR.r < .05) return applyCrop(cropK, null);
  const r = { x: cropR.l / 100 * o.width, y: cropR.t / 100 * o.height, w: o.width * (1 - (cropR.l + cropR.r) / 100), h: o.height * (1 - (cropR.t + cropR.b) / 100) };
  if (S.lmOrig[cropK]) { const A = M.anchors(S.lmOrig[cropK]); if (A.eL.x < r.x || A.eR.x > r.x + r.w || A.eL.y < r.y || A.chin.y > r.y + r.h) toast('Atenção: o corte pegou parte do rosto.', 3500); }
  await applyCrop(cropK, r);
};
$$('.slot').forEach(sl => {
  const k = sl.dataset.k, inp = sl.querySelector('input');
  inp.addEventListener('change', async () => {
    const f = inp.files[0]; if (!f) return;
    try { const img = await loadImg(f); await setPhoto(k, img); } catch (e) { toast('Não consegui abrir essa foto. Tente JPG ou PNG.'); }
    inp.value = '';
  });
});

/* ---------------- quadros alinhados ---------------- */
function frameOf(k, adj) {
  const img = S.img[k]; if (!img) return null;
  let Mx, L;
  if (S.lm[k] && S.mode !== 'cir') { Mx = M.eyeXform(S.lm[k], adj); const sc = Math.hypot(Mx[0], Mx[1]); L = S.lm[k].map(p => { const q = M.apply(Mx, p); q.z = (p.z || 0) * sc; return q; }); }
  else if (S.eyes[k] && S.mode !== 'cir') { Mx = M.eyesXform(S.eyes[k][0], S.eyes[k][1], adj); const T = M.composeAdj([1, 0, 0, 1, 0, 0], adj); const sc = Math.hypot(T[0], T[1]); L = CANON.map(p => { const q = M.apply(T, p); q.z = (p.z || 0) * sc; return q; }); }
  else { Mx = M.coverXform(img, adj); L = null; }
  return { M: Mx, L };
}
let bfH = 0;
function buildFrames(only) {
  cancelAnimationFrame(bfH);
  bfH = requestAnimationFrame(() => {
    const keys = only ? [only] : ['fa', 'fd', 'pa', 'pd', 'k1', 'k2', 'k3', 'v0', 'v7', 'v14', 'v30', 'vx'];
    for (const k of keys) {
      if (!S.img[k]) { S.frames[k] = null; continue; }
      const adj = k === 'fd' ? S.adj : null;
      const f = frameOf(k, adj);
      const Lf = S.mode === 'cir' ? null : (f.L || (k[0] === 'f' ? CANON : null));
      // tarja em todas as fotos: pela malha, ou pelos olhos marcados à mão
      const eyesF = !f.L && S.eyes[k] ? S.eyes[k].map(p => M.apply(f.M, p)) : null;
      const tOpts = { tarja: S.tarja && S.mode !== 'cir', L: f.L || (k[0] === 'f' ? CANON : null), eyes: eyesF };
      if (k[0] === 'p' && !f.L && !eyesF) tOpts.L = null;
      tOpts.black = !!S.bgDone[k];
      S.frames[k] = { cv: M.prerender(S.img[k], f.M, tOpts), L: Lf };
    }
    drawAlign(); lightCheck(); drawReg(); $('#profTog').style.display = S.mode !== 'cir' && S.frames.pa && S.frames.pd ? 'flex' : 'none'; refresh(true);
  });
}

/* ---------------- aviso de luz diferente ---------------- */
function luma(cv) {
  const c = M.mk(40, 60), x = c.getContext('2d'); x.drawImage(cv, 340 * M.PR, 620 * M.PR, 400 * M.PR, 600 * M.PR, 0, 0, 40, 60);
  const d = x.getImageData(0, 0, 40, 60).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += .2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2]; return s / (d.length / 4);
}
function lightCheck() {
  const w = $('#lightWarn'); if (!S.frames.fa || !S.frames.fd) { w.style.display = 'none'; return; }
  const a = luma(S.frames.fa.cv), b = luma(S.frames.fd.cv), d = (b - a) / Math.max(a, 1);
  if (Math.abs(d) > .12) { w.style.display = 'block'; w.innerHTML = `<b>Luz diferente entre as fotos:</b> o depois está ${Math.round(Math.abs(d) * 100)}% mais ${d > 0 ? 'claro' : 'escuro'}. Isso pode parecer melhora que não é. O ideal é refazer a foto com a mesma luz (o estúdio não corrige cor, de propósito).`; }
  else w.style.display = 'none';
}
/* ---------------- arrastar regiões ---------------- */
let dragId = null, dragStart = null;
function drawReg() {
  const c = $('#cvReg'), x = c.getContext('2d'); const sc = c.width / W;
  x.fillStyle = '#0d0a07'; x.fillRect(0, 0, c.width, c.height);
  const D = buildD(); if (!D) { x.fillStyle = '#B9A995'; x.font = '600 22px "Red Hat Display"'; x.textAlign = 'center'; x.fillText('Suba as fotos de frente', 270, 480); return; }
  x.drawImage(D.A, 0, 0, c.width, c.height);
  M.regList(D).forEach(r => r.ptsA.forEach(q => {
    x.beginPath(); x.arc(q.x * sc, q.y * sc, Math.max(14, q.r * sc), 0, 7); x.strokeStyle = r.reg.id === dragId ? '#fff' : '#BCA78E'; x.lineWidth = 2.5; x.setLineDash([6, 5]); x.stroke(); x.setLineDash([]);
    x.beginPath(); x.arc(q.x * sc, q.y * sc, 5, 0, 7); x.fillStyle = '#BCA78E'; x.fill();
    x.font = '700 13px "Red Hat Display"'; x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText(r.reg.nome, q.x * sc, q.y * sc - Math.max(14, q.r * sc) - 6);
  }));
}
(() => {
  const c = $('#cvReg');
  const pos = e => { const r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; };
  c.addEventListener('pointerdown', e => {
    const D = buildD(); if (!D) return; const p = pos(e); let best = null, bd = 1e9;
    M.regList(D).forEach(r => r.ptsA.forEach(q => { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = { id: r.reg.id, side: q.lado }; } }));
    if (best && bd < 160) { dragId = best.id; dragStart = { p, o: Object.assign({ dx: 0, dy: 0 }, S.roff[dragId]), side: best.side }; try { c.setPointerCapture(e.pointerId); } catch (_) { } drawReg(); }
  });
  c.addEventListener('pointermove', e => {
    if (!dragId) return; const p = pos(e); const dx = p.x - dragStart.p.x, dy = p.y - dragStart.p.y;
    S.roff[dragId] = { dx: dragStart.o.dx + (dragStart.side === 'R' ? -dx : dx), dy: dragStart.o.dy + dy }; drawReg();
  });
  const up = () => { if (dragId) { dragId = null; drawReg(); refresh(); } };
  c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  $('#regReset').onclick = () => { S.roff = {}; drawReg(); refresh(); };
})();

/* ---------------- encaixe: prévia ---------------- */
let blinkOn = false, blinkT = 0;
function drawAlign() {
  const c = $('#cvAlign'), x = c.getContext('2d');
  x.fillStyle = '#0d0a07'; x.fillRect(0, 0, c.width, c.height);
  const a = S.frames.fa, b = S.frames.fd;
  if (!a && !b) { x.fillStyle = '#B9A995'; x.font = '600 22px "Red Hat Display"'; x.textAlign = 'center'; x.fillText('Suba as duas fotos de frente', 270, 480); return; }
  let mix = +$('#mix').value / 100;
  if (blinkOn) mix = Math.floor(performance.now() / 550) % 2;
  const sc = c.width / W;
  if (a) x.drawImage(a.cv, 0, 0, c.width, c.height);
  if (b) { x.globalAlpha = a ? mix : 1; x.drawImage(b.cv, 0, 0, c.width, c.height); x.globalAlpha = 1; }
  // guias dos olhos
  x.strokeStyle = 'rgba(188,167,142,.8)'; x.lineWidth = 1; x.setLineDash([6, 6]);
  x.beginPath(); x.moveTo(0, M.EYE_Y * sc); x.lineTo(c.width, M.EYE_Y * sc); x.moveTo(c.width / 2, 0); x.lineTo(c.width / 2, c.height); x.stroke(); x.setLineDash([]);
  x.font = '700 16px "Space Mono", monospace'; x.fillStyle = '#F9F6F2'; x.textAlign = 'left';
  x.fillText(blinkOn ? (mix ? 'DEPOIS' : 'ANTES') : `ANTES ${Math.round((1 - mix) * 100)}% · DEPOIS ${Math.round(mix * 100)}%`, 14, 28);
  if (blinkOn) requestAnimationFrame(drawAlign);
}
$('#mix').addEventListener('input', drawAlign);
$('#blink').onclick = () => { blinkOn = !blinkOn; $('#blink').textContent = blinkOn ? 'Parar' : 'Piscar'; drawAlign(); };
['dx', 'dy', 'ds', 'dr'].forEach(k => {
  const el = $('#ad' + k[1]);
  el.addEventListener('input', () => {
    const v = +el.value; S.adj[k] = k === 'ds' ? v / 100 : v; $('#ad' + k[1] + 'v').textContent = v; buildFrames('fd');
  });
});
$('#reAuto').onclick = async () => {
  S.adj = { dx: 0, dy: 0, ds: 0, dr: 0 }; ['x', 'y', 's', 'r'].forEach(k => { $('#ad' + k).value = 0; $('#ad' + k + 'v').textContent = 0; });
  for (const k of ['fa', 'fd']) if (S.orig[k]) { const L = await detect(S.orig[k]); if (L) { S.lmOrig[k] = L; S.eyesOrig[k] = null; await applyCrop(k, S.crop[k]); } }
  buildFrames(); toast(S.lm.fa && S.lm.fd ? 'Rostos reencaixados.' : 'Não achei o rosto em uma das fotos: marque os olhos à mão.');
};

/* olhos à mão */
let eyeQueue = [], eyePts = [], eyeK = null, eyeSc = 1;
function openEye(k) {
  eyeK = k; eyePts = [];
  const img = S.img[k], c = $('#cvEye');
  const maxW = Math.min(innerWidth - 40, 700), maxH = innerHeight * .66;
  eyeSc = Math.min(maxW / img.width, maxH / img.height);
  c.width = Math.round(img.width * eyeSc); c.height = Math.round(img.height * eyeSc);
  $('#eyeTitle').textContent = ({ fa: 'Frente antes', fd: 'Frente depois', pa: 'Perfil antes', pd: 'Perfil depois' })[k] + ': toque no centro de cada olho';
  $('#eyeHint').dataset.p = k[0];
  drawEye(); $('#eyeModal').classList.add('on');
}
function drawEye() {
  const c = $('#cvEye'), x = c.getContext('2d'); x.drawImage(S.img[eyeK], 0, 0, c.width, c.height);
  eyePts.forEach(p => { x.beginPath(); x.arc(p.x * eyeSc, p.y * eyeSc, 9, 0, 7); x.strokeStyle = '#BCA78E'; x.lineWidth = 3; x.stroke(); x.beginPath(); x.arc(p.x * eyeSc, p.y * eyeSc, 2, 0, 7); x.fillStyle = '#fff'; x.fill(); });
  $('#eyeHint').textContent = eyePts.length === 0 ? 'Primeiro o olho que está à esquerda da foto.' : (eyeK && eyeK[0] === 'p' ? 'Agora o outro olho (se não aparece, toque onde ele estaria).' : 'Agora o outro olho.');
}
$('#cvEye').addEventListener('pointerdown', e => {
  const r = e.target.getBoundingClientRect(); const sx = e.target.width / r.width;
  eyePts.push({ x: (e.clientX - r.left) * sx / eyeSc, y: (e.clientY - r.top) * sx / eyeSc }); drawEye();
  if (eyePts.length === 2) {
    S.eyes[eyeK] = eyePts.slice(); S.lm[eyeK] = null; { const r = S.crop[eyeK]; S.eyesOrig[eyeK] = r ? eyePts.map(p => ({ x: p.x + r.x, y: p.y + r.y })) : eyePts.slice(); S.lmOrig[eyeK] = null; }
    const st = $(`.slot[data-k="${eyeK}"] .st`); if (st) { st.textContent = '✓ olhos marcados à mão'; st.classList.remove('warn'); }
    setTimeout(() => { const n = eyeQueue.shift(); if (n) openEye(n); else { $('#eyeModal').classList.remove('on'); buildFrames(); } }, 250);
  }
});
$('#eyeRedo').onclick = () => { eyePts = []; drawEye(); };
$('#eyeCancel').onclick = () => { eyeQueue = []; $('#eyeModal').classList.remove('on'); };
$('#manEyes').onclick = () => { eyeQueue = ['fa', 'fd'].filter(k => S.img[k]); if (!eyeQueue.length) return toast('Suba as fotos de frente primeiro.'); openEye(eyeQueue.shift()); };

/* ---------------- caso ---------------- */
const procSel = $('#proc');
Object.entries(PROCS).forEach(([k, p]) => procSel.add(new Option(p.nome, k)));
INTERVALS.forEach(v => $('#interval').add(new Option('Depois: ' + v.toLowerCase(), v)));
SESS.forEach(v => $('#sess').add(new Option(v, v)));
function applyProc(k, keepRegs) {
  if (S.mode === 'cir') { const c = CIRS[k]; S.proc = k; renderLocais(k); $('#indic').value = c.indic; $('#compl').value = c.compl; $('#tecnica').value = c.tecnica; $('#cuidados').value = c.cuidados; $('#hook1').value = c.curto; $('#hook2').value = 'Antes e depois'; S.regs = new Set(); renderRegs(); return; }
  const p = PROCS[k]; S.proc = k;
  $('#indic').value = p.indic; $('#compl').value = p.compl; $('#interval').value = p.interval;
  if (!keepRegs) S.regs = new Set(p.regs);
  $('#hook1').value = 'Antes e depois'; $('#hook2').value = p.curto;
  renderRegs();
}
procSel.onchange = () => { applyProc(procSel.value); refresh(); };
function renderRegs() {
  const box = $('#regs'); box.innerHTML = '';
  M.REGIOES.forEach(r => {
    const c = document.createElement('span'); c.className = 'chip' + (S.regs.has(r.id) ? ' on' : ''); const oi = S.mode === 'com' ? orderedRegs().indexOf(r.id) : -1; c.textContent = (oi >= 0 ? (oi + 1) + '. ' : '') + r.nome;
    c.onclick = () => { if (S.regs.has(r.id)) { S.regs.delete(r.id); S.regOrder = S.regOrder.filter(x => x !== r.id); } else { S.regs.add(r.id); S.regOrder.push(r.id); } if (S.regs.size > 6) toast('Mais de 6 regiões deixam o vídeo longo.'); renderRegs(); drawReg(); refresh(); };
    box.append(c);
  });
  renderMl();
}
function renderMl() {
  const box = $('#mlBox'); box.style.display = S.showMl ? 'block' : 'none'; box.innerHTML = '';
  if (!S.showMl) return;
  const sw = document.createElement('div'); sw.className = 'tog';
  sw.innerHTML = `<div><b>Separar por lado</b><div class="hint">D = lado direito do paciente (fica à esquerda na foto de frente).</div></div><div class="sw${S.perSide ? ' on' : ''}"></div>`;
  sw.querySelector('.sw').onclick = () => { S.perSide = !S.perSide; if (S.perSide) orderedRegs().forEach(id => { if (M.REG[id].bi && !S.mlSide[id]) { const v = S.ml[id] || 0; S.mlSide[id] = { d: Math.round(v / 2 * 10) / 10, e: Math.round(v / 2 * 10) / 10 }; } }); renderMl(); refresh(); };
  box.append(sw);
  const r1 = v => Math.max(0, Math.round(v * 10) / 10);
  const stepper = (val, set) => {
    const w = document.createElement('div'); w.className = 'step-ml';
    w.innerHTML = `<button>−</button><input type="text" inputmode="decimal" value="${String(val).replace('.', ',')}"><button>+</button>`;
    const [bm, inp, bp] = w.children;
    bm.onclick = () => set(r1(val - .1)); bp.onclick = () => set(r1(val + .1));
    inp.onchange = () => set(r1(parseFloat(inp.value.replace(',', '.')) || 0));
    return w;
  };
  let tot = 0;
  orderedRegs().forEach(id => {
    const bi = M.REG[id].bi && S.perSide;
    const row = document.createElement('div'); row.className = 'mlrow'; row.style.flexWrap = 'wrap'; row.style.gap = '6px';
    const nm = document.createElement('span'); nm.textContent = M.REG[id].nome; nm.style.minWidth = '110px'; row.append(nm);
    if (bi) {
      const sd = S.mlSide[id] || (S.mlSide[id] = { d: 0, e: 0 });
      S.ml[id] = r1(sd.d + sd.e); tot += S.ml[id];
      const g = document.createElement('div'); g.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap';
      [['d', 'D'], ['e', 'E']].forEach(([k, lab]) => { const l = document.createElement('span'); l.textContent = lab; l.style.cssText = 'font-weight:800;color:var(--dour)'; g.append(l, stepper(sd[k], v => { sd[k] = v; S.ml[id] = r1(sd.d + sd.e); renderMl(); refresh(); })); });
      row.append(g);
    } else {
      const v = S.ml[id] || 0; tot += v;
      const g = stepper(v, nv => { S.ml[id] = nv; if (S.mlSide[id]) { S.mlSide[id] = { d: r1(nv / 2), e: r1(nv / 2) }; } renderMl(); refresh(); });
      const u2 = document.createElement('span'); u2.textContent = 'ml'; g.append(u2); row.append(g);
    }
    box.append(row);
  });
  const t = document.createElement('div'); t.className = 'mlrow'; t.innerHTML = `<b>Total</b><b>${String(Math.round(tot * 10) / 10).replace('.', ',')} ml</b>`; box.append(t);
}
const orderedRegs = () => S.mode === 'com' ? S.regOrder.filter(id => S.regs.has(id)).concat(M.REGIOES.map(r => r.id).filter(id => S.regs.has(id) && !S.regOrder.includes(id))) : M.REGIOES.map(r => r.id).filter(id => S.regs.has(id));
$('#swMl').onclick = e => { S.showMl = !S.showMl; e.currentTarget.classList.toggle('on', S.showMl); renderMl(); refresh(); };
['indic', 'compl', 'interval', 'sess', 'hook1', 'hook2', 'tecnica', 'cuidados', 'local', 'tam', 'evx'].forEach(id => $('#' + id).addEventListener('input', () => refresh()));
['hook1', 'hook2'].forEach(id => $('#' + id).addEventListener('input', e => e.target.dataset.touched = 1));
$('#swBg').onclick = async e => { S.bgBlack = !S.bgBlack; e.currentTarget.classList.toggle('on', S.bgBlack); for (const k of ['fa', 'fd', 'pa', 'pd', 'k1', 'k2', 'k3', 'v0', 'v7', 'v14', 'v30', 'vx']) if (S.orig[k]) await applyCrop(k, S.crop[k]); };
$('#swSens').onclick = e => { S.sens = !S.sens; e.currentTarget.classList.toggle('on', S.sens); refresh(); };
function profs() { const l = [{ nome: CFG.p1n, crm: CFG.p1c }]; if (CFG.p2n) l.push({ nome: CFG.p2n, crm: CFG.p2c }); return l; }
function renderProfs() { const s = $('#profSel'); s.innerHTML = ''; profs().forEach((p, i) => s.add(new Option(p.nome + ' · ' + p.crm, i))); s.value = Math.min(S.prof, profs().length - 1); }
$('#profSel').onchange = e => { S.prof = +e.target.value; refresh(); };

/* ---------------- escolha da cirurgia (sem texto livre) ---------------- */
function renderTiles() {
  const box = $('#cirTiles'); box.innerHTML = '';
  Object.entries(CIRS).forEach(([k, c]) => {
    const d = document.createElement('div'); d.className = 'tile' + (S.cirSel === k ? ' on' : '');
    d.innerHTML = `<b>${c.curto}</b><span>${({ lipoma: 'Nódulo de gordura sob a pele', cisto: '“Cisto sebáceo”: bolsa de queratina com cápsula', lobulo: 'Lóbulo da orelha rasgado ou alargado', nevo: 'Pinta ou lesão, com exame da peça' })[k]}</span>`;
    d.onclick = () => { S.cirSel = k; try { PREF['proc_cir'] = k; savePref(); } catch (e) { } document.body.classList.remove('nocir'); applyProc(k); renderTiles(); refresh(true); { const at = WZ.i; wzLater(() => { if (WZ.i === at) wzGo(at + 1); }, 260); } };
    box.append(d);
  });
}
function renderLocais(k) {
  const sel = $('#localSel'); const cur = sel.value; sel.innerHTML = '';
  sel.add(new Option('Escolha o local…', ''));
  (k === 'lobulo' ? LOCAIS_LOB : LOCAIS).forEach(l => sel.add(new Option(l, l)));
  if ([...sel.options].some(o => o.value === cur)) sel.value = cur;
  $('#local').style.display = sel.value === 'Outro' ? 'block' : 'none';
}
$('#localSel').addEventListener('change', e => { $('#local').style.display = e.target.value === 'Outro' ? 'block' : 'none'; refresh(); });
const fmtCm = v => String(v).replace('.', ',');
['tamA', 'tamB'].forEach(id => $('#' + id).addEventListener('input', () => {
  const a = parseFloat($('#tamA').value.replace(',', '.')), b = parseFloat($('#tamB').value.replace(',', '.'));
  $('#tam').value = a > 0 ? (b > 0 ? `${fmtCm(a)} x ${fmtCm(b)} cm` : `${fmtCm(a)} cm`) : ''; refresh();
}));
const noLocal = l => l === 'os dois lóbulos' ? 'nos dois lóbulos' : l === 'costas' ? 'nas costas' : /^(testa|face|perna|mão|coxa)/.test(l) ? 'na ' + l : /^(pé|pescoço|ombro|tórax|abdome|braço|antebraço|couro|lóbulo)/.test(l) ? 'no ' + l : 'em ' + l;
const localTxt = () => { const v = $('#localSel').value; return v === 'Outro' ? $('#local').value.trim() : v; };

/* ---------------- vídeos do procedimento ---------------- */
const CLIP_LAB = ['Incisão', 'Retirada', 'Sutura'];
$('#clipIn').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  if (S.clips.length >= 3) return toast('Até 3 vídeos.');
  const el = document.createElement('video'); el.muted = true; el.playsInline = true; el.preload = 'auto'; el.setAttribute('playsinline', ''); el.src = URL.createObjectURL(f);
  try { await new Promise((res, rej) => { el.onloadeddata = res; el.onerror = rej; el.load(); setTimeout(res, 8000); }); } catch (err) { return toast('Não consegui abrir esse vídeo.'); }
  const c = { el, start: 0, dur: Math.min(4, el.duration || 4), total: el.duration || 4, label: CLIP_LAB[S.clips.length] || 'Procedimento' };
  S.clips.push(c); renderClips(); refresh(true);
});
function renderClips() {
  const box = $('#clips'); box.innerHTML = '';
  S.clips.forEach((c, i) => {
    const row = document.createElement('div'); row.className = 'clip';
    const v = c.el; v.style.cssText = 'width:72px;height:96px;object-fit:cover;border-radius:10px;background:#000';
    const mid = document.createElement('div');
    mid.innerHTML = `<input type="text" value="${c.label}" style="padding:8px;font-size:14px"><div class="adj" style="grid-template-columns:50px 1fr 40px;margin-top:6px"><span>Início</span><input type="range" min="0" max="${Math.max(0, c.total - .5).toFixed(1)}" step=".1" value="${c.start}"><span>${c.start.toFixed(1)}s</span></div>`;
    const [lab, rng] = mid.querySelectorAll('input');
    lab.oninput = () => { c.label = lab.value; refresh(); };
    rng.oninput = () => { c.start = +rng.value; c.dur = Math.min(4, c.total - c.start); mid.querySelector('.adj span:last-child').textContent = c.start.toFixed(1) + 's'; v.currentTime = c.start; refresh(); };
    const del = document.createElement('button'); del.className = 'btn small ghost'; del.textContent = '✕'; del.onclick = () => { S.clips.splice(i, 1); renderClips(); refresh(true); };
    row.append(v, mid, del); box.append(row); try { v.currentTime = c.start + .05; } catch (e) { }
  });
}

/* ---------------- caso comentado ---------------- */
const BRANDS = ['juvederm', 'juvéderm', 'restylane', 'belotero', 'rennova', 'sculptra', 'radiesse', 'ellanse', 'ellansé', 'profhilo', 'botox', 'dysport', 'xeomin', 'prosigne', 'botulift', 'teosyal', 'stylage', 'perfectha', 'hyalmax', 'elleva', 'biogelis', 'saypha', 'volite', 'skinvive', 'nabota', 'letybo', 'voluma', 'volbella', 'volift', 'volux', 'harmonyca', 'diamond', 'princess', 'neauvia', 'yvoire', 'aliaxin', 'hialu', 'hyabell'];
const BRANDS_RE = new RegExp('\\b(' + BRANDS.filter(b => b !== 'hialu').join('|') + ')\\b', 'gi');
$('#c_produto').addEventListener('input', e => { const m = e.target.value.match(BRANDS_RE); const w = $('#brandWarn'); if (m) { w.style.display = 'block'; w.textContent = `“${m[0]}” parece marca. O CFM não permite citar marca: ela é retirada do vídeo. Descreva pelo tipo (ex.: ácido hialurônico de alta reticulação).`; } else w.style.display = 'none'; });
['desejo', 'avaliacao', 'produto', 'estrategia'].forEach(k => $('#c_' + k).addEventListener('input', () => refresh()));
['desejo', 'avaliacao', 'produto', 'estrategia', 'depois'].forEach(k => $('#t_' + k).addEventListener('input', e => { S.cardT[k] = +e.target.value; e.target.nextElementSibling.textContent = (+e.target.value).toFixed(1) + 's'; refresh(); }));
$('#swCap').onclick = e => { S.capOn = !S.capOn; e.currentTarget.classList.toggle('on', S.capOn); refresh(); };
$('#capText').addEventListener('change', e => { // corrige a legenda mantendo os tempos
  const toks = e.target.value.trim().split(/\s+/).filter(Boolean); const old = S.capWords; if (!old.length || !toks.length) return;
  const t0 = old[0].s, t1 = old[old.length - 1].e;
  S.capWords = toks.map((w, i) => { const j = Math.min(old.length - 1, Math.floor(i * old.length / toks.length)); const j2 = Math.min(old.length - 1, Math.floor((i + 1) * old.length / toks.length) - 1); return { w, s: old[j].s, e: Math.max(old[j].s + .05, old[Math.max(j, j2)].e) }; });
  refresh(); toast('Legenda corrigida.');
});
const norm = s2 => s2.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z ]/g, '');
const STEMS = { desejo: ['queria', 'queixa', 'incomod', 'gostaria', 'pediu', 'desej', 'reclam', 'veio'], avaliacao: ['avali', 'percebi', 'notei', 'observ', 'analis', 'vi que', 'perda', 'flacid', 'sulco'], produto: ['produto', 'acido', 'hialur', 'bioestimul', 'toxina', 'escolhi', 'usei', 'utilizei'], estrategia: ['estrateg', 'aplic', 'comecei', 'primeiro', 'plano', 'injet', 'sustent'] };
function autoTimes() {
  const dur = S.narr ? S.narr.dur : 20, W2 = S.capWords.map(w => ({ n: norm(w.w), s: w.s })); const out = {}; let after = 0;
  ['desejo', 'avaliacao', 'produto', 'estrategia'].forEach((k, i) => {
    let f = null;
    for (let j = 0; j < W2.length && f == null; j++) { if (W2[j].s < after) continue; const two = W2[j].n + ' ' + (W2[j + 1] ? W2[j + 1].n : ''); if (STEMS[k].some(st => W2[j].n.startsWith(st) || two.startsWith(st))) f = W2[j].s; }
    out[k] = f != null ? f : Math.max(after, dur * (.05 + i * .2)); after = out[k] + 1;
  });
  out.depois = Math.max(after + 3, dur - 4);
  S.cardT = out;
  ['desejo', 'avaliacao', 'produto', 'estrategia', 'depois'].forEach(k => { const el = $('#t_' + k); el.max = dur.toFixed(1); el.value = out[k]; el.nextElementSibling.textContent = out[k].toFixed(1) + 's'; });
}
let ASR = null;
async function transcribe(buf) {
  const info = $('#narrInfo'), bar = $('#asrBar'), fill = bar.firstElementChild; bar.style.display = 'block';
  try {
    if (!ASR) {
      info.textContent = 'Baixando o transcritor (≈ 77 MB, só na primeira vez)…';
      const T = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.5/+esm');
      T.env.allowLocalModels = false;
      const prog = {};
      ASR = await T.pipeline('automatic-speech-recognition', 'onnx-community/whisper-base_timestamped', { dtype: { encoder_model: 'q8', decoder_model_merged: 'q8' }, device: 'wasm',
        progress_callback: d => { if (d.status === 'progress' && d.total) { prog[d.file] = [d.loaded, d.total]; const a = Object.values(prog).reduce((x, y) => [x[0] + y[0], x[1] + y[1]], [0, 0]); fill.style.width = Math.round(a[0] / a[1] * 100) + '%'; info.textContent = `Baixando o transcritor: ${Math.round(a[0] / 1048576)} de ${Math.round(a[1] / 1048576)} MB…`; } } });
    }
    info.textContent = 'Transcrevendo sua fala (pode levar 1 a 2 minutos)…'; fill.style.width = '100%';
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext; const oc = new OAC(1, Math.ceil(buf.duration * 16000), 16000);
    const src = oc.createBufferSource(); src.buffer = buf; src.connect(oc.destination); src.start(); const r16 = await oc.startRendering();
    const out = await ASR(r16.getChannelData(0), { language: 'portuguese', task: 'transcribe', return_timestamps: 'word', chunk_length_s: 30, stride_length_s: 5 });
    S.capWords = (out.chunks || []).map(c => ({ w: c.text.trim(), s: c.timestamp[0] || 0, e: c.timestamp[1] != null ? c.timestamp[1] : (c.timestamp[0] || 0) + .3 })).filter(w => w.w);
    $('#capText').value = S.capWords.map(w => w.w).join(' ');
    autoTimes(); info.textContent = `Pronto: ${S.capWords.length} palavras. Os cartões já foram colocados no tempo da fala; confira abaixo.`;
  } catch (e) {
    console.warn(e); S.capWords = []; autoTimes();
    info.textContent = 'Não consegui transcrever aqui' + (location.hostname.includes('curaesante') ? '' : ' (dentro do Claude o transcritor é bloqueado; use o estúdio pelo site)') + '. Os cartões foram distribuídos no tempo; ajuste à mão.';
  }
  bar.style.display = 'none'; refresh(true);
}
$('#narrIn').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  const el = document.createElement('video'); el.muted = true; el.playsInline = true; el.setAttribute('playsinline', ''); el.preload = 'auto'; el.src = URL.createObjectURL(f);
  $('#narrInfo').textContent = 'Abrindo o vídeo…';
  try { await new Promise((res, rej) => { el.onloadeddata = res; el.onerror = rej; el.load(); setTimeout(res, 10000); }); } catch (err) { return $('#narrInfo').textContent = 'Não consegui abrir esse vídeo.'; }
  let buf = null;
  try { const ab = await f.arrayBuffer(); const ac = new (window.AudioContext || window.webkitAudioContext)(); buf = await new Promise((res, rej) => { const p = ac.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); }); try { ac.close(); } catch (x) { } }
  catch (err) { $('#narrInfo').textContent = 'Não consegui ler o áudio do vídeo.'; }
  S.narr = { el, dur: el.duration || (buf && buf.duration) || 20 }; if (buf) { S.voice = buf; S.voiceName = f.name; audioCache = null; }
  el.style.cssText = 'width:120px;height:160px;object-fit:cover;border-radius:12px;background:#000'; $('#narrBox').innerHTML = ''; $('#narrBox').append(el); $('#narrDel').style.display = 'inline-flex';
  if (S.mode !== 'com') { S.mode = 'com'; $$('#mode button').forEach(b => b.classList.toggle('on', b.dataset.v === 'com')); applyMode(); }
  autoTimes(); refresh(true);
  if (buf) transcribe(buf);
});
$('#narrDel').onclick = () => { S.narr = null; S.voice = null; S.capWords = []; $('#narrBox').innerHTML = ''; $('#narrDel').style.display = 'none'; $('#narrInfo').textContent = ''; $('#capText').value = ''; refresh(true); };

/* ---------------- estilo ---------------- */
function segCtl(id, key, cb) {
  $$(`#${id} button`).forEach(b => b.onclick = () => { $$(`#${id} button`).forEach(x => x.classList.toggle('on', x === b)); S[key] = b.dataset.v; cb && cb(); refresh(key === 'theme'); });
}
segCtl('mode', 'mode', () => setTimeout(applyMode, 0));
function applyMode() {
  const cir = S.mode === 'cir'; document.body.classList.toggle('cir', cir); document.body.classList.toggle('com', S.mode === 'com');
  const L = cir ? { fa: ['ANTES', 'Antes'], fd: ['CICATRIZ', 'Depois'], pa: ['OUTRO ÂNGULO', 'Antes'], pd: ['OUTRO ÂNGULO', 'Depois'] } : { fa: ['FRENTE', 'Antes'], fd: ['FRENTE', 'Depois'], pa: ['PERFIL OU 3/4', 'Antes'], pd: ['PERFIL OU 3/4', 'Depois'] };
  Object.entries(L).forEach(([k, [a, b]]) => { const sl = $(`.slot[data-k="${k}"]`); sl.querySelector('.lab').textContent = a; sl.querySelector('.big').textContent = b; });
  $('#s2 h2').textContent = cir ? 'Encaixe das fotos' : 'Encaixe pelo rosto';
  $('#s2 .hint').textContent = cir ? 'Ajuste o depois sobre o antes (mesma posição e tamanho). Confira deslizando a mistura.' : 'Alinho os dois rostos pelos olhos. Confira deslizando a mistura.';
  $('#s3 .hd .hint').textContent = cir ? 'Escolha a cirurgia: indicação, técnica, cuidados e complicações já vêm escritos.' : 'Marque só as regiões tratadas. Até 6 deixa o vídeo mais ágil.';
  procSel.innerHTML = ''; Object.entries(cir ? CIRS : PROCS).forEach(([k, p]) => procSel.add(new Option(p.nome, k)));
  $('#interval').innerHTML = ''; (cir ? DIAS_CIR : INTERVALS).forEach(v => $('#interval').add(new Option(cir ? 'Cicatriz: ' + v : 'Depois: ' + v.toLowerCase(), v)));
  $('#sess').style.display = cir ? 'none' : '';
  if (cir) { renderTiles(); if (S.cirSel) applyProc(S.cirSel); else document.body.classList.add('nocir'); } else { document.body.classList.remove('nocir'); applyProc('ah'); }
  S.style = cir ? 'cirurgia' : S.mode === 'com' ? 'comentado' : 'cortina'; renderStyles();
  if (cir) { $('#interval').value = '30 dias depois'; }
  // fotos já carregadas: refaz sem/ com detecção de rosto
  buildFrames(); refresh(true);
}
segCtl('dest', 'dest', () => setTimeout(destUI, 0));
function destUI() {
  const t = { reel: 'Vídeo completo, com cartão do caso e fechamento. Ideal para o feed.', stories: 'Mais curto, com o texto longe das bordas que o Instagram cobre. Saem também 2 imagens: a da enquete e a do caso.', whats: 'Mais curto e leve (720p) para mandar ao paciente pelo WhatsApp.' }[S.dest];
  $('#destHint').textContent = t; $('#savePoll').style.display = $('#saveInfo').style.display = S.dest === 'stories' ? 'inline-flex' : 'none';
}
segCtl('theme', 'theme'); segCtl('music', 'music', () => { if (playing) { stopAudio(); startAudio(Dcur); } });
$('#swSfx').onclick = e => { S.sfx = !S.sfx; e.currentTarget.classList.toggle('on', S.sfx); };
$('#swProf').onclick = e => { S.withProfile = !S.withProfile; e.currentTarget.classList.toggle('on', S.withProfile); refresh(); };
$('#voiceIn').addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return; $('#voiceInfo').textContent = 'Lendo o áudio…';
  try {
    const ab = await f.arrayBuffer(); const ac = new (window.AudioContext || window.webkitAudioContext)();
    const buf = await new Promise((res, rej) => { const p = ac.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
    try { ac.close(); } catch (x) { }
    S.voice = buf; S.voiceName = f.name; $('#voiceDel').style.display = 'inline-flex'; audioCache = null;
    refresh(); const D = buildD();
    $('#voiceInfo').textContent = `Narração: ${buf.duration.toFixed(1).replace('.', ',')} s. ` + (D ? `Vídeo ajustado para ${M.totalDur(D).toFixed(1).replace('.', ',')} s.` : 'Suba as fotos para ajustar o vídeo.');
  } catch (err) { $('#voiceInfo').textContent = 'Não consegui ler esse arquivo. Tente M4A, MP3 ou um vídeo MP4/MOV.'; }
  e.target.value = '';
});
$('#voiceDel').onclick = () => { S.voice = null; S.voiceName = ''; audioCache = null; $('#voiceDel').style.display = 'none'; $('#voiceInfo').textContent = ''; refresh(); };
$('#swTarja').onclick = e => {
  S.tarja = !S.tarja; e.currentTarget.classList.toggle('on', S.tarja); buildFrames();
  const falta = ['pa', 'pd'].filter(k => S.img[k] && !S.lm[k] && !S.eyes[k]);
  if (S.tarja && falta.length) { toast('Na foto de perfil não achei os olhos: toque nos olhos para pôr a tarja.', 3500); eyeQueue = falta.slice(); openEye(eyeQueue.shift()); }
};
const styleBox = $('#styles');
function renderStyles() {
  styleBox.innerHTML = '';
  (S.mode === 'cir' ? ['cirurgia', 'cortina', 'lado', 'diagonal'] : S.mode === 'com' ? ['comentado'] : M.ORDEM).forEach(k => mkStyle(k));
  setTimeout(renderThumbs, 0);
}
function mkStyle(k) { const st = M.ST[k];
  const d = document.createElement('div'); d.className = 'sty' + (k === S.style ? ' on' : ''); d.dataset.k = k;
  d.innerHTML = `<canvas width="216" height="384"></canvas><div class="nm">${st.nome}</div><div class="ds">${st.desc}</div>`;
  d.onclick = () => { S.style = k; $$('.sty').forEach(x => x.classList.toggle('on', x === d)); stopAudio(); playing = false; tNow = 0; refresh(); if (Dcur && !$('#s5').classList.contains('wz-off')) setTimeout(() => { if (!playing) $('#play').click(); }, 350); };
  styleBox.append(d);
}
renderStyles();
let thumbH = 0; const big = M.mk(W, H), bigX = big.getContext('2d');
function renderThumbs() {
  clearTimeout(thumbH);
  thumbH = setTimeout(() => {
    const D = buildD(); if (!D) return;
    $$('.sty').forEach(el => {
      const st = M.ST[el.dataset.k];
      el.classList.toggle('dis', !!st.needsProfile && !(D.PA && D.PB));
      const TH = { cortina: 6.2, morph: 3.8, hightech: 4.6, camera25d: 6.4, zoomreg: 3.9, scanner: 3.4, lupa: 4.0, diagonal: 5.6 };
      const t = (TH[el.dataset.k] || st.dur(D) * .6);
      try { M.drawFrame(bigX, Object.assign({}, D, { style: el.dataset.k, k: 1 }), t); } catch (e) { console.warn(el.dataset.k, e); }
      el.querySelector('canvas').getContext('2d').drawImage(big, 0, 0, 216, 384);
    });
  }, 250);
}

/* ---------------- D: tudo que o motor precisa ---------------- */
function buildD() {
  const fa = S.frames.fa, fd = S.frames.fd; if (!fa || !fd) return null;
  if (S.mode === 'cir' && !S.cirSel) return null;
  const T = M.THEMES[S.theme];
  const regs = orderedRegs();
  const nomes = regs.map(id => M.REG[id].nome.toLowerCase());
  const tot = regs.reduce((a, id) => a + (S.ml[id] || 0), 0);
  const p = profs()[Math.min(S.prof, profs().length - 1)];
  const sess = $('#sess').value, iv = $('#interval').value;
  const D = {
    T, A: fa.cv, B: fd.cv, LA: fa.L, LB: fd.L, PA: S.frames.pa && S.frames.pa.cv, PB: S.frames.pd && S.frames.pd.cv, PC: ['k1', 'k2', 'k3'].map(k => S.frames[k] && S.frames[k].cv).filter(Boolean),
    EV: [['v0', 'Pós imediato'], ['v7', '7 dias'], ['v14', '14 dias'], ['v30', '30 dias'], ['vx', ($('#evx').value.trim() || 'Outro tempo')]].filter(([k]) => S.frames[k]).map(([k, lab]) => ({ cv: S.frames[k].cv, lab })), evDepois: S.mode === 'cir' ? 'Depois' : $('#interval').value,
    regs, ml: S.ml, mlSide: S.mlSide, perSide: S.perSide, showMl: S.showMl && tot > 0,
    indic: $('#indic').value.trim(), compl: $('#compl').value.trim(),
    indicCurta: $('#indic').value.split(/[.,:]/)[0],
    procTxt: curP().nome + (nomes.length ? ' em ' + listaPt(nomes) : '') + (S.showMl && tot > 0 ? '. Total: ' + String(Math.round(tot * 10) / 10).replace('.', ',') + ' ml' : '') + '.',
    procCurto: curP().curto,
    evol: 'Foto do depois: ' + iv.toLowerCase() + ' · ' + sess + '.',
    hook1: $('#hook1').value || 'Antes e depois', hook2: $('#hook2').value || curP().curto,
    style: S.style, music: S.music, sfx: S.sfx,
    prof: p, marca: S.theme === 'curae' ? (CFG.marca || 'Curae Santé') : 'Dr. Pedro Schmitz',
    handle: S.theme === 'curae' ? CFG.handle : '@drpedroschmitz',
    cta1: CFG.cta1, cta2: CFG.cta2, tess: TESS, caseNo: S.caseNo,
    roff: S.roff, voice: S.voice, withProfile: S.withProfile && S.mode !== 'cir', k: 1,
  };
  if (S.mode === 'com') {
    D.k = 1; D.style = 'comentado'; D.mode = 'com'; D.narr = S.narr; D.capWords = S.capWords; D.capOn = S.capOn;
    D.cards = ['desejo', 'avaliacao', 'produto', 'estrategia'].map(k => ({ key: k, text: $('#c_' + k).value.trim().replace(BRANDS_RE, '').replace(/\(\s*\)/g, '').replace(/\s{2,}/g, ' ').replace(/\s+([,.;])/g, '$1').trim(), t: S.cardT[k] != null ? S.cardT[k] : 0 })).sort((a, b) => a.t - b.t);
    D.tDepois = S.cardT.depois;
    if ($('#c_desejo').value.trim() && !$('#hook1').dataset.touched) { D.hook1 = '“' + $('#c_desejo').value.trim().split(/\s+/).slice(0, 6).join(' ') + '”'; D.hook2 = 'Caso comentado'; }
  }
  if (S.mode === 'cir') {
    const c = CIRS[S.proc] || CIRS.lipoma;
    Object.assign(D, { mode: 'cir', regs: [], showMl: false, LA: null, LB: null, PB: null, clips: S.clips, sens: S.sens,
      tecnica: $('#tecnica').value.trim(), cuidados: $('#cuidados').value.trim(), local: localTxt(), tam: $('#tam').value.trim(),
      dias: $('#interval').value, evol: 'Foto da cicatriz: ' + $('#interval').value + '.', procCurto: c.curto, procTxt: c.nome + '.', hook1: $('#hook1').value || c.curto, hook2: $('#hook2').value || 'Antes e depois' });
  }
  D.dest = S.dest; if (S.dest !== 'reel' && S.mode !== 'com') D.k = .82;
  if (S.voice && S.mode !== 'com') { const need = S.voice.duration + M.VOICE_AT + .5 - M.infoD(D) - M.endD(D) - ((S.withProfile && D.PA && D.PB) ? M.PROF_DUR : 0) - M.evoDur(D); D.k = Math.max(.85, Math.min(3, need / M.ST[S.style].dur(D))); }
  return D;
}
const listaPt = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1];

/* ---------------- player ---------------- */
const pv = $('#cvPrev'), pvx = pv.getContext('2d');
let playing = false, pt0 = 0, tNow = 0, Dcur = null, audioCache = null, aCtx = null, aSrc = null;
const audioKey = D => [D.style, D.music, D.sfx, S.voiceName, D.k.toFixed(3), D.regs.join(), D.withProfile].join('|');
async function startAudio(D) {
  try {
    const dur = M.totalDur(D);
    if (!audioCache || audioCache.key !== audioKey(D)) audioCache = { key: audioKey(D), buf: await M.renderAudio(D, dur) };
    if (!audioCache.buf || !playing) return;
    if (aCtx.state === 'suspended') await aCtx.resume();
    aSrc = aCtx.createBufferSource(); aSrc.buffer = audioCache.buf; aSrc.connect(aCtx.destination);
    aSrc.start(0, Math.max(0, (performance.now() - pt0) / 1000));
  } catch (e) { console.warn(e); }
}
function stopAudio() { try { aSrc && aSrc.stop(); } catch (e) { } aSrc = null; }
function showLive() {
  const v = $('#resVideo');
  if (v.style.display !== 'none' && v.style.display !== '') { try { v.pause(); } catch (e) { } v.style.display = 'none'; pv.style.display = 'block'; $('#saveVid').style.display = 'none'; $('#genInfo').textContent = 'Mudou algo: gere o vídeo de novo para salvar esta versão.'; S.result = null; }
}
function refresh(thumbs) {
  showLive();
  Dcur = buildD();
  if (!Dcur) { pvx.fillStyle = '#0d0a07'; pvx.fillRect(0, 0, W, H); pvx.fillStyle = '#B9A995'; pvx.font = '600 44px "Red Hat Display"'; pvx.textAlign = 'center'; pvx.fillText(S.mode === 'cir' && !S.cirSel ? 'Escolha a cirurgia' : 'Suba as fotos de frente', W / 2, H / 2); $('#durInfo').textContent = '—'; captions(); return; }
  const dur = M.totalDur(Dcur);
  $('#durInfo').textContent = `${M.ST[S.style].nome} · ${dur.toFixed(1).replace('.', ',')} s · 1080×1920`;
  if (!playing) M.drawFrame(pvx, Dcur, Math.min(tNow, dur));
  captions(); renderThumbs();
}
$('#play').onclick = () => {
  if (!Dcur) return toast('Suba as duas fotos de frente.');
  playing = !playing; $('#play').textContent = playing ? '❚❚ Pausar' : '▶ Tocar';
  if (playing) { const dur = M.totalDur(Dcur); if (tNow >= dur - .05) tNow = 0; pt0 = performance.now() - tNow * 1000; try { aCtx = aCtx || new (window.AudioContext || window.webkitAudioContext)(); aCtx.resume(); } catch (e) { } loop(); if (aCtx) startAudio(Dcur); } else stopAudio();
};
function loop() {
  if (!playing || !Dcur) return;
  const dur = M.totalDur(Dcur); tNow = (performance.now() - pt0) / 1000;
  if (tNow >= dur) { tNow = dur; playing = false; stopAudio(); $('#play').textContent = '▶ Tocar'; }
  M.syncClips(Dcur, tNow, playing); M.syncNarr(Dcur, tNow, playing); M.drawFrame(pvx, Dcur, tNow); $('#scrub').value = Math.round(tNow / dur * 1000);
  if (playing) requestAnimationFrame(loop);
}
$('#scrub').addEventListener('input', e => { if (!Dcur) return; playing = false; stopAudio(); $('#play').textContent = '▶ Tocar'; tNow = e.target.value / 1000 * M.totalDur(Dcur); M.prepFrame(Dcur, tNow).then(() => M.prepNarr(Dcur, tNow)).then(() => M.drawFrame(pvx, Dcur, tNow)); });

/* ---------------- checklist + geração ---------------- */
$$('.check').forEach(c => c.onclick = () => { S.checks[c.dataset.c] = !S.checks[c.dataset.c]; c.classList.toggle('on', S.checks[c.dataset.c]); });
let DL = null;
(async () => { try { if (window.claude && claude.use) DL = await claude.use('downloads'); } catch (e) { DL = null; } })();
async function saveFile(name, blob) {
  if (!DL) {
    // fora do Claude (no site): compartilhar no iPhone ("Salvar vídeo"), senão baixar
    try {
      const file = new File([blob], name, { type: blob.type || (name.endsWith('.png') ? 'image/png' : 'video/mp4') });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file] }); return true; }
    } catch (e) { if (e && e.name === 'AbortError') return false; }
    try { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); return true; }
    catch (e) { toast('Não consegui salvar neste navegador.', 3500); return false; }
  }
  try { await DL.save({ filename: name, data: blob }); return true; }
  catch (e) { if (e && e.code === 'declined') return false; toast('Não consegui salvar: ' + (e && e.message || e), 4200); return false; }
}
const slug = () => (curP().curto + '-' + M.ST[S.style].nome + '-' + S.dest).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
$('#gen').onclick = async () => {
  const D = buildD(); if (!D) return toast('Suba as duas fotos de frente.');
  if (!S.checks.consent || !S.checks.real) { toast('Marque o termo de imagem e “fotos sem filtro” no checklist.', 3500); $('.check[data-c="consent"]').scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
  if (!D.regs.length) toast('Dica: marque pelo menos uma região tratada.');
  playing = false; stopAudio();
  const btn = $('#gen'); btn.disabled = true; btn.textContent = 'Gerando…';
  const bar = $('#genBar'); bar.style.display = 'block'; const fill = bar.firstElementChild;
  const cv = M.mk(W, H);
  try {
    const prog = p => fill.style.width = (p * 100).toFixed(0) + '%';
    const codec = window.Mp4Muxer ? await M.pickAvc() : null;
    const wantAudio = D.music !== 'nenhuma' || !!D.voice;
    const recMp4 = window.MediaRecorder && ['video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a', 'video/mp4'].some(t => MediaRecorder.isTypeSupported(t));
    let r;
    const out = S.dest === 'whats' ? { w: 720, h: 1280, br: 2.5e6 } : null;
    if (codec && (!wantAudio || await M.aacOk())) { $('#genInfo').textContent = 'Montando quadro a quadro (MP4)…'; r = await M.exportWebCodecs(D, cv, prog, codec, wantAudio ? 'aac' : null, out); }
    else if (recMp4) { $('#genInfo').textContent = 'Gravando em tempo real (MP4 com trilha)…'; r = await M.exportRecorder(D, cv, prog, out); }
    else if (codec && await M.opusOk()) { $('#genInfo').textContent = 'Montando quadro a quadro (MP4)…'; r = await M.exportWebCodecs(D, cv, prog, codec, 'opus', out); }
    else if (codec) { $('#genInfo').textContent = 'Montando quadro a quadro (MP4, sem trilha neste navegador)…'; r = await M.exportWebCodecs(D, cv, prog, codec, null, out); }
    else { $('#genInfo').textContent = 'Gravando em tempo real…'; r = await M.exportRecorder(D, cv, prog, out); }
    S.result = r;
    const v = $('#resVideo'); v.src = URL.createObjectURL(r.blob); v.style.display = 'block'; pv.style.display = 'none';
    $('#saveVid').style.display = 'inline-flex';
    $('#genInfo').textContent = `Pronto: ${(r.blob.size / 1048576).toFixed(1).replace('.', ',')} MB · ${r.ext.toUpperCase()}${r.audio ? ' com trilha' : ' sem áudio'}. Toque em “Salvar vídeo”.`;
  } catch (e) { console.error(e); $('#genInfo').textContent = 'Falhou: ' + (e.message || e); }
  btn.disabled = false; btn.textContent = 'Gerar de novo';
};
$('#saveVid').onclick = async () => { if (S.result) { const ok = await saveFile(`curae-${slug()}.${S.result.ext}`, S.result.blob); if (ok) toast('Vídeo salvo.'); } };
$('#saveCover').onclick = async () => {
  const D = buildD(); if (!D) return toast('Suba as fotos primeiro.');
  const c = M.mk(W, H), x = c.getContext('2d'); const st = M.ST[S.style];
  M.drawFrame(x, Object.assign({}, D, { style: 'lado' }), Math.min(M.ST.lado.dur(D) - .5, 4.5));
  const b = await toBlob(c, 'image/png'); const ok = await saveFile(`capa-${slug()}.png`, b); if (ok) toast('Capa salva.');
};
async function savePng(fn, name) { const D = buildD(); if (!D) return toast('Suba as fotos primeiro.'); const c = M.mk(W, H); fn(c.getContext('2d'), D); const b = await toBlob(c, 'image/png'); if (await saveFile(name + '-' + slug() + '.png', b)) toast('Imagem salva. No Instagram, cole o adesivo no espaço tracejado.', 3500); }
$('#savePoll').onclick = () => savePng(M.storyPoll, 'story-enquete');
$('#saveInfo').onclick = () => savePng(M.storyInfo, 'story-caso');
pv.addEventListener('click', () => { });
$('#resVideo').addEventListener('emptied', () => { });

/* ---------------- legendas (CFM) ---------------- */
const angBox = $('#angle');
Object.entries(ANGLES).forEach(([k, v]) => { const b = document.createElement('button'); b.textContent = v; b.dataset.v = k; if (k === S.angle) b.className = 'on'; b.onclick = () => { S.angle = k; $$('#angle button').forEach(x => x.classList.toggle('on', x === b)); captions(); }; angBox.append(b); });
function captions() {
  if (S.mode === 'cir') return captionsCir();
  const D = Dcur || buildD() || {};
  const p = curP(); const regs = orderedRegs().map(id => M.REG[id].nome.toLowerCase());
  const prof = profs()[Math.min(S.prof, profs().length - 1)];
  const iv = $('#interval').value.toLowerCase(), sess = $('#sess').value.toLowerCase();
  const indic = $('#indic').value.trim(), compl = $('#compl').value.trim();
  const regTxt = regs.length ? listaPt(regs) : 'as regiões avaliadas';
  const tot = orderedRegs().reduce((a, id) => a + (S.ml[id] || 0), 0);
  const f1 = v => String(Math.round(v * 10) / 10).replace('.', ',');
  const dist = S.showMl && tot ? orderedRegs().filter(id => S.ml[id]).map(id => { const sd = S.perSide && M.REG[id].bi && S.mlSide[id]; return M.REG[id].nome.toLowerCase() + ' ' + (sd ? `${f1(sd.d)} ml à direita e ${f1(sd.e)} ml à esquerda` : f1(S.ml[id]) + ' ml'); }).join('; ') : '';
  const mlTxt = S.showMl && tot ? ` Quantidade total: ${f1(tot)} ml (${dist}).` : '';
  const open = {
    resultado: `${p.curto} em ${regTxt}. Um caso real, com a foto do depois ${iv}.`,
    regioes: `Região por região: o que foi tratado neste caso de ${p.curto.toLowerCase()} e por quê.`,
    planejamento: `Antes da agulha, vem o plano. Neste caso, a análise do rosto apontou ${regTxt}.`,
    indicacao: `Para quem ${p.curto.toLowerCase()} costuma ser indicado? Este caso ajuda a entender.`,
    enquete: `Você notou a diferença? Olhe primeiro ${regs[0] || 'o terço médio'} e depois o rosto inteiro.`,
    pos: `O que esperar depois de ${p.curto.toLowerCase()}: o que é normal e o que pede retorno.`,
    natural: `Natural é quando a pessoa parece descansada, e não diferente.`,
  }[S.angle];
  const extraPos = S.angle === 'pos' ? `\n\nNos primeiros dias, o esperado é: ${compl.charAt(0).toLowerCase() + compl.slice(1)}\nDor forte, pele pálida ou arroxeada em placa, ou alteração de visão pedem contato imediato com quem fez o procedimento.` : '';
  const cap = `${open}

Indicação: ${indic}
Procedimento: ${p.nome}${regs.length ? ' em ' + regTxt : ''}, ${sess}.${mlTxt}
Evolução: foto do depois ${iv}.
Possíveis efeitos: ${compl}${extraPos}

Cada rosto responde de um jeito, e o resultado varia de pessoa para pessoa. A indicação é feita em consulta, depois de avaliar a sua anatomia, a sua pele e o que você espera.

Imagens publicadas com autorização do paciente. Conteúdo educativo.
${prof.nome} · ${prof.crm}

Salve para lembrar e mande para quem está pensando em fazer.

#harmonizacaofacial #${p.curto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '')} #saojosesc #florianopolis #kobrasol #curaesante`;
  const pin = {
    enquete: 'Notou primeiro em qual região? Responde aqui embaixo 👇 E marca alguém que sempre pergunta “como fica natural?”',
    pos: 'Já fez algum procedimento e ficou em dúvida se o inchaço era normal? Conta aqui que eu respondo. Marca quem precisa ler isso.',
  }[S.angle] || `Qual região você trataria primeiro: ${regs.slice(0, 3).join(', ') || 'olheiras, malar ou mandíbula'}? Comenta aqui e marca quem também quer entender o procedimento.`;
  const faq = `• “Quanto custa?” → Depende do plano para o seu rosto, que é feito na avaliação. Me chama no direct que a equipe agenda.
• “Dói?” → Usamos anestésico e técnica para deixar o mais confortável possível. A sensibilidade varia de pessoa para pessoa.
• “Fica artificial?” → O objetivo é respeitar a sua anatomia. A quantidade e as regiões são decididas na consulta.
• “Quanto tempo dura?” → Varia com o produto, a região e o seu organismo. Na consulta explico o que esperar no seu caso.
• “Posso ir trabalhar no dia seguinte?” → Na maioria das vezes, sim. Inchaço e roxos podem aparecer nos primeiros dias.
• “Vou ficar igual a ela?” → Não existe resultado igual: cada rosto responde de um jeito. O caso mostra o que é possível, não uma promessa.`;
  $('#cap').textContent = cap; $('#pin').textContent = pin; $('#faq').textContent = faq;
}
function captionsCir() {
  const c = CIRS[S.proc] || CIRS.lipoma; const prof = profs()[Math.min(S.prof, profs().length - 1)];
  const local = localTxt().toLowerCase(), tam = $('#tam').value.trim(), dias = $('#interval').value;
  const open = { resultado: `${c.curto}${local ? ' ' + noLocal(local) : ''}: do antes à cicatriz com ${dias.replace(' depois', '')}.`, regioes: `Passo a passo de uma ${c.nome.toLowerCase()}, do jeito que é feita no consultório.`, planejamento: `Antes do corte, vem o planejamento: tamanho, posição da cicatriz e anestesia.`, indicacao: `Quando vale a pena tirar? Este caso de ${c.curto.toLowerCase()} ajuda a entender.`, enquete: `Você sabia que isso pode ser tirado com anestesia local, no consultório?`, pos: `Depois da retirada: o que é normal e o que pede retorno.`, natural: `A cicatriz amadurece com o tempo: ela muda bastante nos primeiros meses.` }[S.angle];
  const cap = `${open}

Indicação: ${$('#indic').value.trim()}
Técnica: ${$('#tecnica').value.trim()}${tam ? ' Tamanho da peça: ' + tam + '.' : ''}
Cuidados: ${$('#cuidados').value.trim()}
Evolução: foto da cicatriz ${dias}.
Possíveis complicações: ${$('#compl').value.trim()}

A cicatrização varia de pessoa para pessoa. A indicação é feita em consulta, depois de examinar a lesão.

Imagens publicadas com autorização do paciente. Conteúdo educativo.
${prof.nome} · ${prof.crm}

Salve para lembrar e mande para quem tem um caroço assim.

#cirurgiaambulatorial #${c.curto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '')} #saojosesc #florianopolis #kobrasol`;
  $('#cap').textContent = cap;
  $('#pin').textContent = `Você tem algum caroço que incomoda há tempo? Conta aqui embaixo e marca quem precisa ver isso.`;
  $('#faq').textContent = `• “Dói?” → É feito com anestesia local; a pessoa sente a picada da anestesia e depois pressão.
• “Fica cicatriz?” → Sim, toda retirada deixa cicatriz. O planejamento busca a menor e mais discreta possível, e ela melhora nos primeiros meses.
• “Precisa de exame depois?” → A peça vai para análise (anatomopatológico) e o resultado define o seguimento.
• “Quanto tempo de repouso?” → Em geral, volta às atividades leves no mesmo dia ou no seguinte; esforço na região, só depois da liberação.
• “Pode voltar?” → Pode, principalmente se ficar parte da lesão ou da cápsula. Por isso a técnica importa.
• “Quanto custa?” → Depende do tamanho e do local, avaliados na consulta. Me chama no direct que a equipe agenda.`;
}
$$('[data-copy]').forEach(b => b.onclick = async () => { try { await navigator.clipboard.writeText($('#' + b.dataset.copy).textContent); toast('Copiado.'); } catch (e) { toast('Selecione o texto e copie manualmente.'); } });

/* ---------------- legenda com IA (só dentro do Claude) ---------------- */
let SAMPLE = null, MCP = null;
(async () => {
  try { if (window.claude && claude.use) { SAMPLE = await claude.use('sample'); if (SAMPLE) $('#aiBox').style.display = 'block'; MCP = await claude.use('mcp'); } } catch (e) { }
})();
$('#aiGen').onclick = async () => {
  if (!SAMPLE) return; const btn = $('#aiGen'); btn.disabled = true; btn.textContent = 'Escrevendo…'; $('#aiOut').innerHTML = '';
  const p = curP(); const regs = orderedRegs().map(id => M.REG[id].nome.toLowerCase()); const prof = profs()[Math.min(S.prof, profs().length - 1)];
  const dados = { procedimento: p.nome, regioes: regs, ml: S.showMl ? Object.fromEntries(orderedRegs().filter(id => S.ml[id]).map(id => [M.REG[id].nome, S.perSide && M.REG[id].bi && S.mlSide[id] ? `D ${S.mlSide[id].d} / E ${S.mlSide[id].e}` : S.ml[id]])) : null, indicacao: $('#indic').value, evolucao: $('#interval').value + ', ' + $('#sess').value, possiveis_efeitos: $('#compl').value, angulo: ANGLES[S.angle], destino: { reel: 'reel do feed', stories: 'stories', whats: 'mensagem de WhatsApp para o paciente' }[S.dest], profissional: prof.nome + ' · ' + prof.crm };
  const prompt = `Você escreve legendas de Instagram para o ${prof.nome}, médico (nunca chame de dermatologista, nunca cite RQE nem título de especialista; use só nome e CRM).
Tom dele: direto, educativo, sem bajulação, frases curtas, português do Brasil, sem emojis em excesso (no máximo 2), sem exclamações seguidas.
Regras obrigatórias (CFM, Res. 2.336/2023): sem promessa de resultado, sem preço, sem comparação com colegas, sem superlativos ("o melhor", "perfeito", "garantido"). A legenda TEM que trazer: indicação, evolução (tempo/sessões), possíveis efeitos e complicações, a frase "resultados variam de pessoa para pessoa", que as imagens foram autorizadas pelo paciente e, no fim, nome e CRM. Feche com uma chamada para salvar ou mandar para alguém (sem pedir para agendar com urgência).
Dados do caso: ${JSON.stringify(dados)}
Escreva 3 versões diferentes de abertura e ritmo (uma mais curta, uma mais explicativa, uma em formato de pergunta e resposta). Se o destino for stories ou WhatsApp, cada versão com no máximo 450 caracteres. Responda só com um JSON: {"versoes": ["...", "...", "..."]}`;
  try {
    const r = await SAMPLE.json(prompt, { modelTier: 'default' });
    const vs = (r && r.versoes) || [];
    vs.forEach((v, i) => { const box = document.createElement('div'); box.innerHTML = `<div class="copybox"></div><button class="btn small ghost">Copiar versão ${i + 1}</button>`; box.firstChild.textContent = v; box.lastChild.onclick = async () => { try { await navigator.clipboard.writeText(v); toast('Copiado.'); } catch (e) { toast('Selecione e copie manualmente.'); } }; $('#aiOut').append(box); });
    if (!vs.length) $('#aiOut').textContent = 'Não veio resposta. Tente de novo.';
  } catch (e) { $('#aiOut').textContent = e && e.code === 'rate_limited' ? 'Muitos pedidos seguidos: espere um pouco.' : 'Não consegui gerar agora (' + (e && (e.message || e.code) || e) + ').'; }
  btn.disabled = false; btn.textContent = '✦ Escrever de novo';
};

/* ---------------- enviar caso para o Google Drive ---------------- */
const b64 = blob => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); });
const findId = o => { if (!o || typeof o !== 'object') return null; if (typeof o.id === 'string') return o.id; for (const k in o) { const v = findId(o[k]); if (v) return v; } return null; };
function caseFiles() {
  const nm = { fa: 'frente-antes', fd: 'frente-depois', pa: 'perfil-antes', pd: 'perfil-depois' };
  const f = Object.keys(S.blob).filter(k => S.blob[k]).map(k => ({ name: nm[k] + '.jpg', blob: S.blob[k], type: 'image/jpeg' }));
  const info = { data: new Date().toISOString(), procedimento: curP().nome, regioes: orderedRegs().map(id => M.REG[id].nome), ml: S.showMl ? S.ml : null, ml_por_lado: S.perSide ? S.mlSide : null, indicacao: $('#indic').value, evolucao: $('#interval').value + ' · ' + $('#sess').value, possiveis_efeitos: $('#compl').value, termo_assinado: !!S.checks.consent, sem_filtro: !!S.checks.real };
  f.push({ name: 'caso.json', blob: new Blob([JSON.stringify(info, null, 2)], { type: 'application/json' }), type: 'application/json' });
  f.push({ name: 'legenda.txt', blob: new Blob([$('#cap').textContent], { type: 'text/plain' }), type: 'text/plain' });
  if (S.result) f.push({ name: 'video-' + slug() + '.' + S.result.ext, blob: S.result.blob, type: 'video/' + S.result.ext });
  return f;
}
$('#toDrive').onclick = async () => {
  if (!S.img.fa || !S.img.fd) return toast('Suba as fotos de frente primeiro.');
  const files = caseFiles(); const info = $('#driveInfo');
  const pasta = new Date().toISOString().slice(0, 10) + ' · ' + curP().curto + ' · caso ' + String(S.caseNo).padStart(2, '0');
  if (MCP) {
    try {
      info.textContent = 'Criando a pasta no Drive…';
      const gd = await MCP.server('Google Drive');
      let root = null; try { root = localStorage.getItem('estudio-drive-root'); } catch (e) { }
      if (!root) { root = findId(await gd.create_file({ title: 'Estúdio Curae · Casos', contentMimeType: 'application/vnd.google-apps.folder' })); try { localStorage.setItem('estudio-drive-root', root); } catch (e) { } }
      const dir = findId(await gd.create_file({ title: pasta, contentMimeType: 'application/vnd.google-apps.folder', parentId: root }));
      for (let i = 0; i < files.length; i++) { const f = files[i]; info.textContent = `Enviando ${i + 1} de ${files.length}: ${f.name}…`;
        await gd.create_file({ title: f.name, parentId: dir, contentMimeType: f.type, base64Content: await b64(f.blob), disableConversionToGoogleType: true }); }
      info.textContent = `Pronto: pasta “${pasta}” dentro de “Estúdio Curae · Casos” no seu Drive.`; return;
    } catch (e) { console.warn(e); info.textContent = 'O Drive não aceitou daqui (' + (e && (e.code || e.message) || e) + '). Tentando pelo compartilhamento…'; }
  }
  // no site (ou se o conector falhar): menu de compartilhar → app do Google Drive
  try {
    const fl = files.map(f => new File([f.blob], f.name, { type: f.type }));
    if (navigator.canShare && navigator.canShare({ files: fl })) { await navigator.share({ files: fl, title: pasta }); info.textContent = 'Escolha “Drive” no menu para salvar. Dica: crie a pasta “Estúdio Curae · Casos” no Drive.'; }
    else info.textContent = 'Este navegador não deixa enviar vários arquivos. No iPhone, use o Safari.';
  } catch (e) { if (!(e && e.name === 'AbortError')) info.textContent = 'Não consegui abrir o compartilhamento.'; }
};

/* ---------------- semana ---------------- */
WEEK.forEach(([d, style, ang, tit, desc]) => {
  const el = document.createElement('div'); el.className = 'day';
  el.innerHTML = `<div class="d">${d}</div><div class="t"><b>${tit}</b><span>${M.ST[style].nome} · ${desc}</span></div><button class="btn small">Montar</button>`;
  el.querySelector('button').onclick = () => {
    S.style = style; S.angle = ang;
    $$('.sty').forEach(x => x.classList.toggle('on', x.dataset.k === style));
    $$('#angle button').forEach(x => x.classList.toggle('on', x.dataset.v === ang));
    go('criar'); refresh(); setTimeout(() => { WZ.procOk = true; wzGo(wzPages().length - 1); }, 60);
    if (!Dcur) toast('Suba as fotos do caso primeiro.');
  };
  $('#week').append(el);
});

/* ---------------- galeria (IndexedDB local) ---------------- */
function idb() { return new Promise((res, rej) => { try { const r = indexedDB.open('estudio-curae', 1); r.onupgradeneeded = () => r.result.createObjectStore('casos', { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); }
async function dbAll() { const db = await idb(); return new Promise((res, rej) => { const q = db.transaction('casos').objectStore('casos').getAll(); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); }
async function dbPut(v) { const db = await idb(); return new Promise((res, rej) => { const tx = db.transaction('casos', 'readwrite'); tx.objectStore('casos').put(v); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); }
async function dbDel(id) { const db = await idb(); return new Promise((res) => { const tx = db.transaction('casos', 'readwrite'); tx.objectStore('casos').delete(id); tx.oncomplete = res; }); }
const round = L => L && L.map(p => ({ x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10, z: Math.round((p.z || 0) * 10) / 10 }));
$('#saveCase').onclick = async () => {
  if (!S.img.fa || !S.img.fd) return toast('Suba as fotos de frente primeiro.');
  const th = toCanvas(S.img.fa, 300);
  const v = {
    id: S.caseId || ('c' + Date.now()), date: new Date().toISOString(), thumb: th.toDataURL('image/jpeg', .8),
    photos: Object.fromEntries(Object.keys(S.blob).map(k => [k, S.blob[k]])),
    lm: Object.fromEntries(Object.keys(S.img).map(k => [k, round(S.lm[k])])), eyes: S.eyes, adj: S.adj,
    pv: 2, mode: S.mode, proc: S.proc, regs: [...S.regs], ml: S.ml, mlSide: S.mlSide, perSide: S.perSide, showMl: S.showMl, roff: S.roff,
    f: Object.fromEntries(['indic', 'compl', 'interval', 'sess', 'hook1', 'hook2', 'evx'].map(k => [k, $('#' + k).value])),
  };
  try { await dbPut(v); S.caseId = v.id; toast('Caso guardado neste aparelho.'); renderGal(); } catch (e) { toast('Este navegador não deixou guardar. Mantenha as fotos no seu arquivo.', 4000); }
};
async function renderGal() {
  let all = []; try { all = await dbAll(); } catch (e) { }
  const g = $('#gal'); g.innerHTML = ''; $('#galEmpty').style.display = all.length ? 'none' : 'block';
  all.sort((a, b) => b.date.localeCompare(a.date)).forEach((c, i) => {
    const it = document.createElement('div'); it.className = 'it';
    it.innerHTML = `<img src="${c.thumb}"><button class="del" aria-label="Apagar">✕</button><span>${((c.mode === 'cir' ? CIRS : PROCS)[c.proc] || {}).curto || ''} · ${new Date(c.date).toLocaleDateString('pt-BR')}</span>`;
    it.onclick = () => loadCase(c);
    it.querySelector('.del').onclick = async e => { e.stopPropagation();
      if (!it.classList.contains('arm')) { it.classList.add('arm'); toast('Toque no ✕ de novo para apagar este caso.'); setTimeout(() => it.classList.remove('arm'), 3000); return; }
      await dbDel(c.id); renderGal(); toast('Caso apagado.'); };
    g.append(it);
  });
  S.caseNo = all.length + 1;
}
async function loadCase(c) {
  go('criar'); toast('Abrindo o caso…');
  if ((c.mode || 'est') !== S.mode) { S.mode = c.mode || 'est'; $$('#mode button').forEach(b => b.classList.toggle('on', b.dataset.v === S.mode)); applyMode(); }
  S.caseId = c.id; S.proc = c.proc; procSel.value = c.proc; applyProc(c.proc, true);
  S.regs = new Set(c.regs); S.ml = c.ml || {}; S.mlSide = c.mlSide || {}; S.perSide = !!c.perSide; S.roff = c.roff || {}; S.showMl = !!c.showMl; $('#swMl').classList.toggle('on', S.showMl);
  Object.entries(c.f || {}).forEach(([k, v]) => { if ($('#' + k)) $('#' + k).value = v; });
  S.adj = c.adj || S.adj; [['x', 'dx', 1], ['y', 'dy', 1], ['s', 'ds', 100], ['r', 'dr', 1]].forEach(([a, k, m]) => { $('#ad' + a).value = S.adj[k] * m; $('#ad' + a + 'v').textContent = Math.round(S.adj[k] * m); });
  if (c.mode === 'cir' && !c.pv && c.photos.pa && !c.photos.k1) { c.photos = { ...c.photos, k1: c.photos.pa }; delete c.photos.pa; }
  for (const k of ['fa', 'fd', 'pa', 'pd', 'k1', 'k2', 'k3', 'v0', 'v7', 'v14', 'v30', 'vx']) {
    const b = c.photos[k]; const slot = $(`.slot[data-k="${k}"]`);
    if (!b) { S.img[k] = null; continue; }
    const img = await loadImg(b);
    await setPhoto(k, img, { blob: b, lm: c.lm && c.lm[k] || null, eyes: c.eyes && c.eyes[k] });
  }
  renderRegs(); buildFrames();
  WZ.procOk = true; if (S.mode === 'cir') S.cirSel = c.proc; $$('#modeTiles .tile').forEach(x => x.classList.toggle('on', x.dataset.v === S.mode)); renderProcTiles(); wzGo(wzPages().length - 1);
}

/* ---------------- ajustes ---------------- */
['p1n', 'p1c', 'p2n', 'p2c', 'marca', 'handle', 'cta1', 'cta2'].forEach(k => {
  const el = $('#' + k); el.value = CFG[k] || '';
  el.addEventListener('input', () => { CFG[k] = el.value; saveCfg(); renderProfs(); refresh(); });
});

$('#fidOff').onclick = () => { if (window.__estudioDesativarFace) { window.__estudioDesativarFace(); toast('Face ID desativado. Na próxima abertura, entre com a senha.'); } else toast('O Face ID só funciona no site.'); };


/* ---------------- aparência: dia, noite ou automático ---------------- */
(() => {
  let tema = 'auto'; try { tema = localStorage.getItem('estudio-tema') || 'auto'; } catch (e) { }
  const mq = matchMedia('(prefers-color-scheme: light)');
  const aplicar = () => { const dia = tema === 'dia' || (tema === 'auto' && mq.matches); document.documentElement.classList.toggle('light', dia);
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = dia ? '#F7F2EA' : '#1E1610';
    $$('#temaSeg button').forEach(b => b.classList.toggle('on', b.dataset.v === tema)); };
  $$('#temaSeg button').forEach(b => b.onclick = () => { tema = b.dataset.v; try { localStorage.setItem('estudio-tema', tema); } catch (e) { } aplicar(); });
  mq.addEventListener ? mq.addEventListener('change', aplicar) : mq.addListener(aplicar); aplicar();
})();

/* ---------------- navegação ---------------- */
function go(v) { $$('.view').forEach(x => x.classList.toggle('on', x.id === 'v-' + v)); $$('nav.tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v)); $('#scroller').scrollTo(0, 0); if (v === 'galeria') renderGal(); }
$$('nav.tabs button').forEach(b => b.onclick = () => go(b.dataset.v));



/* ---------------- gestos: encaixe (1 dedo move, 2 dedos zoom e giro) ---------------- */
(() => {
  const c = $('#cvAlign'); const pts = new Map(); let base = null, raf = 0;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sync = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
    S.adj.dx = clamp(Math.round(S.adj.dx), -400, 400); S.adj.dy = clamp(Math.round(S.adj.dy), -400, 400); S.adj.ds = clamp(S.adj.ds, -.5, .8); S.adj.dr = clamp(Math.round(S.adj.dr * 2) / 2, -25, 25);
    [['x', S.adj.dx], ['y', S.adj.dy], ['s', Math.round(S.adj.ds * 100)], ['r', S.adj.dr]].forEach(([k, v]) => { $('#ad' + k).value = v; $('#ad' + k + 'v').textContent = v; });
    buildFrames('fd'); }); };
  const st = () => { const a = [...pts.values()]; const r = c.getBoundingClientRect(); const k = W / r.width;
    if (a.length === 1) return { k, x: a[0].x, y: a[0].y, n: 1 };
    const [p, q] = a; return { k, x: (p.x + q.x) / 2, y: (p.y + q.y) / 2, d: Math.hypot(q.x - p.x, q.y - p.y), ang: Math.atan2(q.y - p.y, q.x - p.x), n: 2 }; };
  const begin = () => { base = { g: st(), adj: { ...S.adj } }; };
  c.addEventListener('pointerdown', e => { if (!S.frames.fd) return; try { c.setPointerCapture(e.pointerId); } catch (_) { } pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); begin(); });
  c.addEventListener('pointermove', e => { if (!pts.has(e.pointerId) || !base) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); const g2 = st(), g1 = base.g; if (g2.n !== g1.n) return begin();
    S.adj.dx = base.adj.dx + (g2.x - g1.x) * g1.k; S.adj.dy = base.adj.dy + (g2.y - g1.y) * g1.k;
    if (g2.n === 2) { S.adj.ds = base.adj.ds + Math.log2(g2.d / g1.d); S.adj.dr = base.adj.dr + (g2.ang - g1.ang) * 180 / Math.PI; }
    sync(); });
  const end = e => { pts.delete(e.pointerId); if (pts.size) begin(); else base = null; };
  c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
})();

/* ---------------- gestos: recorte (mover, pinçar, puxar borda) ---------------- */
(() => {
  const c = $('#cvCrop'); const pts = new Map(); let base = null, edge = null;
  const MIN = 20; // % mínimo do quadro
  const rect = () => ({ l: cropR.l, t: cropR.t, w: 100 - cropR.l - cropR.r, h: 100 - cropR.t - cropR.b });
  const setRect = R => { R.w = Math.max(MIN, Math.min(100, R.w)); R.h = Math.max(MIN, Math.min(100, R.h)); R.l = Math.max(0, Math.min(100 - R.w, R.l)); R.t = Math.max(0, Math.min(100 - R.h, R.t));
    cropR = { l: R.l, t: R.t, r: 100 - R.l - R.w, b: 100 - R.t - R.h }; ['t', 'b', 'l', 'r'].forEach(s2 => $('#cr' + s2).value = cropR[s2].toFixed(1)); drawCrop(); };
  const pct = (x, y) => { const r = c.getBoundingClientRect(); return { x: (x - r.left) / r.width * 100, y: (y - r.top) / r.height * 100, kx: 100 / r.width, ky: 100 / r.height }; };
  const st = () => { const a = [...pts.values()]; if (a.length === 1) return { ...pct(a[0].x, a[0].y), n: 1 }; const [p, q] = a; const m = pct((p.x + q.x) / 2, (p.y + q.y) / 2); return { ...m, d: Math.hypot(q.x - p.x, q.y - p.y), n: 2 }; };
  const begin = () => { base = { g: st(), R: rect() }; };
  c.addEventListener('pointerdown', e => { try { c.setPointerCapture(e.pointerId); } catch (_) { } pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); begin();
    edge = null; if (pts.size === 1) { const P = base.g, R = base.R, tol = 6; // % de tolerância
      if (Math.abs(P.x - R.l) < tol) edge = 'l'; else if (Math.abs(P.x - (R.l + R.w)) < tol) edge = 'r'; else if (Math.abs(P.y - R.t) < tol) edge = 't'; else if (Math.abs(P.y - (R.t + R.h)) < tol) edge = 'b'; } });
  c.addEventListener('pointermove', e => { if (!pts.has(e.pointerId) || !base) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); const g2 = st(), g1 = base.g; if (g2.n !== g1.n) return begin();
    const R = { ...base.R }, dx = g2.x - g1.x, dy = g2.y - g1.y;
    if (g2.n === 2) { const f = g1.d / g2.d; const cx = R.l + R.w / 2 - dx, cy = R.t + R.h / 2 - dy; R.w *= f; R.h *= f; R.l = cx - R.w / 2; R.t = cy - R.h / 2; }
    else if (edge === 'l') { const nl = Math.min(R.l + R.w - MIN, Math.max(0, R.l + dx)); R.w += R.l - nl; R.l = nl; }
    else if (edge === 'r') R.w = Math.min(100 - R.l, R.w + dx);
    else if (edge === 't') { const nt = Math.min(R.t + R.h - MIN, Math.max(0, R.t + dy)); R.h += R.t - nt; R.t = nt; }
    else if (edge === 'b') R.h = Math.min(100 - R.t, R.h + dy);
    else { R.l += dx; R.t += dy; }
    setRect(R); });
  const end = e => { pts.delete(e.pointerId); if (pts.size) begin(); else { base = null; edge = null; } };
  c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
})();

/* ---------------- sem zoom da página (iOS) ---------------- */
['gesturestart', 'gesturechange', 'gestureend'].forEach(t => document.addEventListener(t, e => e.preventDefault(), { passive: false }));
document.addEventListener('touchmove', e => { if (e.touches.length > 1 && !e.target.closest('canvas')) e.preventDefault(); }, { passive: false });
let lastTouch = 0; document.addEventListener('touchend', e => { const n = Date.now(); if (n - lastTouch < 300 && !e.target.closest('input,textarea,select,button,label,.tile,.chip')) e.preventDefault(); lastTouch = n; }, { passive: false });


/* ---------------- desfazer, toque duplo, prévia em tela cheia, Drive ao guardar ---------------- */
const adjHist = [], cropHist = [];
const pushAdj = () => { const l = adjHist[adjHist.length - 1], a = { ...S.adj }; if (!l || JSON.stringify(l) !== JSON.stringify(a)) { adjHist.push(a); if (adjHist.length > 40) adjHist.shift(); } };
function setAdj(a) { S.adj = { ...a }; [['x', S.adj.dx], ['y', S.adj.dy], ['s', Math.round(S.adj.ds * 100)], ['r', S.adj.dr]].forEach(([k, v]) => { $('#ad' + k).value = v; $('#ad' + k + 'v').textContent = v; }); buildFrames('fd'); }
$('#adjUndo').onclick = () => { if (!adjHist.length) return toast('Nada para desfazer.'); setAdj(adjHist.pop()); };
['adx', 'ady', 'ads', 'adr'].forEach(id => $('#' + id).addEventListener('pointerdown', pushAdj));
$('#cvAlign').addEventListener('pointerdown', pushAdj, true);
$('#reAuto').addEventListener('click', pushAdj, true);
let tapT = 0, tapX = 0, tapY = 0;
$('#cvAlign').addEventListener('pointerup', e => {
  const n = Date.now(); if (n - tapT < 320 && Math.hypot(e.clientX - tapX, e.clientY - tapY) < 30) { tapT = 0; pushAdj();
    if (S.mode === 'cir') setAdj({ dx: 0, dy: 0, ds: 0, dr: 0 }); else $('#reAuto').click(); toast('Encaixe refeito.'); return; }
  tapT = n; tapX = e.clientX; tapY = e.clientY;
});
const pushCrop = () => { if (cropR) { cropHist.push({ ...cropR }); if (cropHist.length > 40) cropHist.shift(); } };
$('#cvCrop').addEventListener('pointerdown', pushCrop, true);
['crt', 'crb', 'crl', 'crr'].forEach(id => $('#' + id).addEventListener('pointerdown', pushCrop));
['cropAuto', 'cropNone'].forEach(id => $('#' + id).addEventListener('click', pushCrop, true));
$('#cropUndo').onclick = () => { if (!cropHist.length) return toast('Nada para desfazer.'); cropR = cropHist.pop(); ['t', 'b', 'l', 'r'].forEach(s2 => $('#cr' + s2).value = (+cropR[s2]).toFixed(1)); drawCrop(); };

let autoDrive = true; try { autoDrive = localStorage.getItem('estudio-autodrive') !== '0'; } catch (e) { }
$('#swAutoDrive').classList.toggle('on', autoDrive);
$('#swAutoDrive').onclick = e => { autoDrive = !autoDrive; e.currentTarget.classList.toggle('on', autoDrive); try { localStorage.setItem('estudio-autodrive', autoDrive ? '1' : '0'); } catch (_) { } };
$('#saveCase').addEventListener('click', () => { if (autoDrive && S.img.fa && S.img.fd) $('#toDrive').onclick(); });


/* ---------------- rapidez: lembrar escolhas, pular encaixe, gerar rápido, modelos, postar ---------------- */
const PREF = (() => { try { return JSON.parse(localStorage.getItem('estudio-prefs') || '{}'); } catch (e) { return {}; } })();
const savePref = () => { try { localStorage.setItem('estudio-prefs', JSON.stringify(PREF)); } catch (e) { } };
// lembra estilo, trilha, destino e identidade
['theme', 'music', 'dest'].forEach(id => $$(`#${id} button`).forEach(b => b.addEventListener('click', () => { PREF[id] = b.dataset.v; savePref(); })));
document.getElementById('styles').addEventListener('click', e => { const d = e.target.closest('.sty'); if (d) { PREF['style_' + S.mode] = d.dataset.k; savePref(); } });
const TPL = (() => { try { return JSON.parse(localStorage.getItem('estudio-tpl') || '{}'); } catch (e) { return {}; } })();
const saveTpl = () => { try { localStorage.setItem('estudio-tpl', JSON.stringify(TPL)); } catch (e) { } };
function tplUI() { const t = S.mode !== 'cir' && TPL[S.proc]; $('#tplDel').style.display = t ? '' : 'none'; $('#tplInfo').textContent = t ? `Usando o seu padrão de ${curP().curto}.` : ''; }
function applyTpl() { const t = S.mode !== 'cir' && TPL[S.proc]; if (t) { S.regs = new Set(t.regs); S.regOrder = [...t.regs]; S.ml = { ...t.ml }; S.mlSide = { ...t.mlSide }; S.perSide = !!t.perSide; S.showMl = !!t.showMl; $('#swMl').classList.toggle('on', S.showMl); renderRegs(); } tplUI(); }
$('#tplSave').onclick = () => { TPL[S.proc] = { regs: [...S.regs], ml: S.ml, mlSide: S.mlSide, perSide: S.perSide, showMl: S.showMl }; saveTpl(); tplUI(); toast(`Padrão de ${curP().curto} salvo. Vem pronto nos próximos casos.`); };
$('#tplDel').onclick = () => { delete TPL[S.proc]; saveTpl(); tplUI(); toast('Padrão apagado.'); };
// gerar rápido / pular encaixe
function fotosOk() { return !!(S.img.fa && S.img.fd); }
function rostoOk() { return S.mode !== 'cir' && !!((S.lm.fa || S.eyes.fa) && (S.lm.fd || S.eyes.fd)); }
function fastUI() { const ok = fotosOk(); $('#fastGo').style.display = ok ? '' : 'none'; $('#fastHint').style.display = ok ? '' : 'none';
  $('#fastHint').textContent = rostoOk() || S.mode === 'cir' ? 'Usa o encaixe automático e o seu último estilo, trilha e destino. Você confere na prévia.' : 'Rosto não achado em uma das fotos: confira o encaixe antes.'; }
setInterval(() => { if (!$('#s1').classList.contains('wz-off')) fastUI(); }, 700);
$('#fastGo').onclick = () => { if (!fotosOk()) return toast('Suba as fotos obrigatórias.'); if (S.mode !== 'cir' && !rostoOk()) { wzGo(WZ.i + 1); return toast('Confira o encaixe primeiro.'); } wzGo(wzPages().length - 1); toast('Confira a prévia, marque o checklist e gere o vídeo.', 3200); };
// Avançar a partir das fotos pula o encaixe quando os rostos foram achados
$('#wzNext').addEventListener('click', e => {
  const P = wzPages(); if (P[WZ.i] === 's1' && fotosOk() && rostoOk()) { e.stopImmediatePropagation(); wzGo(P.indexOf('s3')); toast('Rostos encaixados sozinhos. Toque em Voltar para conferir o encaixe.', 3200); }
}, true);
// postar no Instagram: copia a legenda e abre o compartilhar com o vídeo
$('#postIg').onclick = async () => {
  if (!S.result) return toast('Gere o vídeo primeiro.');
  try { await navigator.clipboard.writeText($('#cap').textContent); } catch (e) { }
  const f = new File([S.result.blob], `curae-${slug()}.${S.result.ext}`, { type: 'video/' + S.result.ext });
  try { if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); toast('Legenda copiada: cole no Instagram.', 3500); } else toast('Este navegador não compartilha vídeo. Use “Salvar vídeo”.'); }
  catch (e) { if (!(e && e.name === 'AbortError')) toast('Não consegui abrir o compartilhar.'); }
};
new MutationObserver(() => { $('#postIg').style.display = $('#saveVid').style.display; }).observe($('#saveVid'), { attributes: true, attributeFilter: ['style'] });


/* ---------------- estilos em carrossel ---------------- */
function styleList() { return $$('.sty').filter(x => !x.classList.contains('dis')).map(x => x.dataset.k); }
function styleSync(scroll) {
  $('#stName').textContent = M.ST[S.style] ? M.ST[S.style].nome : '';
  const d = $(`.sty[data-k="${S.style}"]`); $$('.sty').forEach(x => x.classList.toggle('on', x === d));
  if (scroll && d) { const box = $('#styles'); box.scrollTo({ left: d.offsetLeft - (box.clientWidth - d.clientWidth) / 2, behavior: 'smooth' }); }
}
function styleStep(dir) { const L = styleList(); if (!L.length) return; let i = L.indexOf(S.style); i = (i + dir + L.length) % L.length; const d = $(`.sty[data-k="${L[i]}"]`); if (d) d.click(); }
$('#stPrev').onclick = () => styleStep(-1);
$('#stNext').onclick = () => styleStep(1);
document.getElementById('styles').addEventListener('click', () => setTimeout(() => styleSync(true), 0));
(() => { // arrastar a prévia para o lado troca o estilo; toque simples = tela cheia
  const c = $('#cvPrev'); let x0 = null, y0 = 0, t0 = 0;
  c.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; t0 = Date.now(); });
  c.addEventListener('pointerup', e => { if (x0 == null) return; const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
    if (c.classList.contains('fs')) { c.classList.remove('fs'); document.body.classList.remove('prevfs'); return; }
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) return styleStep(dx < 0 ? 1 : -1);
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && Date.now() - t0 < 400) { c.classList.add('fs'); document.body.classList.add('prevfs'); toast('Toque de novo para sair.'); } });
})();

/* ---------------- etapas (modo → procedimento → fotos → …) ---------------- */
const WZ = { i: 0, procOk: false, t: 0 };
const wzLater = (fn, ms) => { clearTimeout(WZ.t); WZ.t = setTimeout(fn, ms); };
const wzPages = () => S.mode === 'cir' ? ['sMode', 's0', 's1', 's2', 's3', 's5'] : ['sMode', 'sProc', 's1', 's2', 's3', 's5'];
const WZ_NOMES = { sMode: 'Modo', sProc: 'Procedimento', s0: 'Cirurgia', s1: 'Fotos', s2: 'Encaixe', s3: 'O caso', s5: 'Estilo e vídeo' };
function renderProcTiles() {
  const box = $('#procTiles'); box.innerHTML = '';
  Object.entries(PROCS).forEach(([k, p]) => {
    const d = document.createElement('div'); d.className = 'tile' + (WZ.procOk && S.proc === k ? ' on' : '');
    d.innerHTML = `<b>${p.curto}</b><span>${p.indic.split('.')[0]}.</span>`;
    d.onclick = () => { procSel.value = k; applyProc(k); applyTpl(); WZ.procOk = true; PREF['proc_' + S.mode] = k; savePref(); renderProcTiles(); const at = WZ.i; wzLater(() => { if (WZ.i === at) wzGo(at + 1); }, 260); };
    box.append(d);
  });
}
function wzCan(id) {
  if (id === 'sProc') return WZ.procOk || 'Escolha o procedimento.';
  if (id === 's0') return !!S.cirSel || 'Escolha a cirurgia.';
  if (id === 's1') return (S.img.fa && S.img.fd) ? true : 'Suba as fotos obrigatórias (antes e depois).';
  return true;
}
function wzGo(i) {
  clearTimeout(WZ.t);
  const P = wzPages(); i = Math.max(0, Math.min(P.length - 1, i));
  if (i > WZ.i) for (let k = WZ.i; k < i; k++) { const ok = wzCan(P[k]); if (ok !== true) { toast(ok); i = k; break; } }
  const sai = P[WZ.i], vai = P[i];
  WZ.i = i;
  if (sai === 's5' && vai !== 's5' && playing) { playing = false; stopAudio(); $('#play').textContent = '▶ Tocar'; }
  ['sMode', 'sProc', 's0', 's1', 's2', 's3', 's5'].forEach(id => { const el = $('#' + id); if (el) el.classList.toggle('wz-off', id !== vai); });
  P.forEach((id, k) => { const n = $('#' + id + ' .hd .num'); if (n) n.textContent = k + 1; });
  $('#wzFill').style.width = ((i + 1) / P.length * 100) + '%';
  $('#wzLab').textContent = `Etapa ${i + 1} de ${P.length} · ${WZ_NOMES[vai]}`;
  $('#wzBack').disabled = i === 0; $('#wzNext').style.display = i === P.length - 1 ? 'none' : '';
  $('#wzNext').textContent = i === P.length - 2 ? 'Escolher estilo →' : 'Avançar →';
  $('#scroller').scrollTop = 0;
  if (vai === 's2') requestAnimationFrame(drawAlign);
  if (vai === 's5') { refresh(true); styleSync(true); } else refresh(false);
}
$('#wzBack').onclick = () => wzGo(WZ.i - 1);
$('#wzNext').onclick = () => wzGo(WZ.i + 1);
$$('#modeTiles .tile').forEach(t => t.onclick = () => {
  $$('#modeTiles .tile').forEach(x => x.classList.toggle('on', x === t));
  const b = $(`#mode button[data-v="${t.dataset.v}"]`); PREF.mode = t.dataset.v; savePref(); if (S.mode !== t.dataset.v) { WZ.procOk = false; b.click(); }
  renderProcTiles(); wzLater(() => { if (WZ.i === 0) wzGo(1); }, 120);
});

/* ---------------- início ---------------- */
applyProc('ah'); renderProfs(); renderGal(); addCamBtns(); destUI();
$$('#theme button').forEach(b => b.classList.toggle('on', b.dataset.v === S.theme));
const fontsReady = Promise.all(['500 40px "Cormorant Garamond"', 'italic 500 40px "Cormorant Garamond"', '600 40px "Red Hat Display"', '700 40px "Red Hat Display"', '40px Anton', '800 40px Inter', '600 40px Inter', '700 40px "Space Mono"'].map(f => document.fonts.load(f).catch(() => { })));
fontsReady.then(() => { refresh(); drawAlign(); });
refresh(); drawAlign();
renderProcTiles(); wzGo(0);
(() => { // restaura as últimas escolhas
  ['theme', 'music', 'dest'].forEach(id => { const v = PREF[id]; const b = v && $(`#${id} button[data-v="${v}"]`); if (b) b.click(); });
  if (PREF.mode && PREF.mode !== 'est') { $(`#mode button[data-v="${PREF.mode}"]`).click(); }
  $$('#modeTiles .tile').forEach(x => x.classList.toggle('on', x.dataset.v === (PREF.mode || 'est')));
  setTimeout(() => {
    const st = PREF['style_' + S.mode]; if (st && M.ST[st]) { const d = $(`.sty[data-k="${st}"]`); if (d) d.click(); }
    const pk = PREF['proc_' + S.mode];
    if (pk && S.mode !== 'cir' && PROCS[pk]) { procSel.value = pk; applyProc(pk); applyTpl(); WZ.procOk = true; renderProcTiles(); }
    if (pk && S.mode === 'cir' && CIRS[pk]) { S.cirSel = pk; document.body.classList.remove('nocir'); applyProc(pk); renderTiles(); }
    refresh(true);
  }, 120);
})();

window.__estudio = { S, setPhoto, buildD, refresh, loadImg, findWatermark };
})();
