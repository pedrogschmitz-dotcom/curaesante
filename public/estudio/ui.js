'use strict';
(() => {
const M = window.Motor, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const { W, H } = M;

/* ---------------- dados ---------------- */
const PROCS = {
  ah: { nome: 'Preenchimento com ácido hialurônico', curto: 'Preenchimento', indic: 'Perda de volume e de sustentação, com sulcos e sombras que deixam o rosto com aspecto cansado.', compl: 'Inchaço, roxos e sensibilidade nos primeiros dias. Mais raramente: nódulos, assimetria ou complicação vascular, que exige avaliação imediata.', interval: 'Imediatamente após', regs: ['malar', 'bigode', 'mento'] },
  bio: { nome: 'Bioestimulador de colágeno', curto: 'Bioestimulador', indic: 'Flacidez leve a moderada e perda de firmeza da pele.', compl: 'Inchaço e roxos transitórios; nódulos são possíveis. O resultado é gradual, ao longo de semanas a meses.', interval: '90 dias após', regs: ['malar', 'mandibula', 'prejowl'] },
  tox: { nome: 'Toxina botulínica', curto: 'Toxina botulínica', indic: 'Linhas de expressão que aparecem com o movimento: testa, entre as sobrancelhas e ao redor dos olhos.', compl: 'Pequenos roxos no local e dor de cabeça leve. Raramente, queda transitória da pálpebra ou da sobrancelha.', interval: '15 dias após', regs: ['testa', 'glabela', 'pes'] },
  sb: { nome: 'Skinbooster', curto: 'Skinbooster', indic: 'Pele desidratada, sem viço e com linhas finas.', compl: 'Pequenas pápulas e inchaço por 1 a 3 dias; roxos pontuais.', interval: '30 dias após', regs: ['malar', 'olheiras'] },
  fio: { nome: 'Fios de PDO', curto: 'Fios de PDO', indic: 'Flacidez leve com perda de contorno do rosto.', compl: 'Inchaço, sensibilidade e pequenas irregularidades transitórias. Raramente, exposição do fio ou infecção.', interval: '30 dias após', regs: ['malar', 'mandibula'] },
  rino: { nome: 'Rinomodelação com ácido hialurônico', curto: 'Rinomodelação', indic: 'Pequenas irregularidades do dorso e da ponta do nariz, para quem não quer cirurgia.', compl: 'Inchaço e roxos leves. Complicação vascular é rara e exige avaliação imediata.', interval: 'Imediatamente após', regs: ['nariz'] },
  lab: { nome: 'Preenchimento labial', curto: 'Preenchimento labial', indic: 'Lábios com pouco volume, contorno apagado ou assimetria.', compl: 'Inchaço e roxos por alguns dias; herpes labial pode ser reativado. Complicação vascular é rara e exige avaliação imediata.', interval: 'Imediatamente após', regs: ['labios'] },
  comb: { nome: 'Protocolo combinado', curto: 'Protocolo combinado', indic: 'Envelhecimento com várias causas ao mesmo tempo: volume, flacidez e qualidade da pele.', compl: 'Inchaço, roxos e sensibilidade transitórios. Cada técnica tem riscos próprios, explicados na consulta.', interval: '60 dias após', regs: ['malar', 'bigode', 'mandibula', 'mento'] },
};
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
  theme: 'curae', style: 'cortina', music: 'suave', sfx: true, tarja: false, angle: 'resultado',
  orig: {}, crop: {}, lmOrig: {}, eyesOrig: {}, checks: {}, caseNo: 1, prof: 0, result: null, roff: {}, mlSide: {}, perSide: false, voice: null, voiceName: '', withProfile: true,
};
const DEF = { p1n: 'Dr. Pedro Schmitz', p1c: 'CRM/SC 38229', p2n: '', p2c: '', marca: 'Curae Santé', handle: '@curaesante', cta1: 'Agende sua', cta2: 'avaliação' };
let CFG = Object.assign({}, DEF);
try { Object.assign(CFG, JSON.parse(localStorage.getItem('estudio-cfg') || '{}')); } catch (e) { }
const saveCfg = () => { try { localStorage.setItem('estudio-cfg', JSON.stringify(CFG)); } catch (e) { } };

const toast = (m, ms = 2400) => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), ms); };

/* ---------------- MediaPipe (local, sem internet externa) ---------------- */
let LM = null, mpP = null;
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
  const c = r ? cropCanvas(orig, r) : orig;
  S.img[k] = c; S.blob[k] = await toBlob(toCanvas(c, 1600));
  S.lm[k] = S.lmOrig[k] ? (r ? shiftPts(S.lmOrig[k], r) : S.lmOrig[k]) : null;
  S.eyes[k] = S.eyesOrig[k] ? (r ? shiftPts(S.eyesOrig[k], r) : S.eyesOrig[k]) : null;
  const slot = $(`.slot[data-k="${k}"]`); const im = slot.querySelector('img'); if (im) im.src = URL.createObjectURL(S.blob[k]);
  slotStatus(k); buildFrames();
}
function slotStatus(k) {
  const slot = $(`.slot[data-k="${k}"]`); let st = slot.querySelector('.st'); if (!st) { st = document.createElement('div'); st.className = 'st'; slot.append(st); }
  let b = slot.querySelector('.cropb'); if (!b) { b = document.createElement('button'); b.className = 'cropb'; b.textContent = '✂'; b.title = 'Recortar'; slot.append(b); b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openCrop(k); }); }
  const base = S.lm[k] ? '✓ rosto encontrado' : S.eyes[k] ? '✓ olhos marcados à mão' : (k[0] === 'f' ? 'rosto não achado: toque em “marcar olhos”' : 'perfil: encaixe pela foto');
  st.textContent = base + (S.crop[k] && S.crop[k].auto ? ' · ✂ marca cortada' : S.crop[k] ? ' · ✂ recortada' : '');
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
  S.lmOrig[k] = await detect(c); S.eyesOrig[k] = null;
  let r = null; try { r = findWatermark(c, S.lmOrig[k]); } catch (e) { console.warn(e); }
  const bl = findWatermark.blocked || [];
  if (r) { r.auto = true; toast('Achei marca d’água ' + r.lados.join(' e ') + ': cortei. Toque em ✂ para ajustar.' + (bl.length ? ' Há outra ' + bl.join(' e ') + ' encostada no rosto: essa não dá para cortar.' : ''), 4500); }
  else if (bl.length) toast('Parece haver marca d’água ' + bl.join(' e ') + ', mas encostada no rosto: cortar tiraria parte do rosto. Use outra foto ou ajuste no ✂.', 5000);
  await applyCrop(k, r);
}
/* recorte manual */
let cropK = null, cropR = null;
function openCrop(k) {
  if (!S.orig[k]) return; cropK = k; const o = S.orig[k]; const r = S.crop[k] || { x: 0, y: 0, w: o.width, h: o.height };
  cropR = { t: r.y / o.height * 100, b: (o.height - r.y - r.h) / o.height * 100, l: r.x / o.width * 100, r: (o.width - r.x - r.w) / o.width * 100 };
  ['t', 'b', 'l', 'r'].forEach(s2 => { $('#cr' + s2).value = cropR[s2].toFixed(1); });
  const c = $('#cvCrop'); const sc = Math.min((innerWidth - 40) / o.width, innerHeight * .5 / o.height); c.width = Math.round(o.width * sc); c.height = Math.round(o.height * sc);
  drawCrop(); $('#cropModal').classList.add('on');
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
  if (S.lm[k]) { Mx = M.eyeXform(S.lm[k], adj); const sc = Math.hypot(Mx[0], Mx[1]); L = S.lm[k].map(p => { const q = M.apply(Mx, p); q.z = (p.z || 0) * sc; return q; }); }
  else if (S.eyes[k]) { Mx = M.eyesXform(S.eyes[k][0], S.eyes[k][1], adj); const T = M.composeAdj([1, 0, 0, 1, 0, 0], adj); const sc = Math.hypot(T[0], T[1]); L = CANON.map(p => { const q = M.apply(T, p); q.z = (p.z || 0) * sc; return q; }); }
  else { Mx = M.coverXform(img, adj); L = null; }
  return { M: Mx, L };
}
let bfH = 0;
function buildFrames(only) {
  cancelAnimationFrame(bfH);
  bfH = requestAnimationFrame(() => {
    const keys = only ? [only] : ['fa', 'fd', 'pa', 'pd'];
    for (const k of keys) {
      if (!S.img[k]) { S.frames[k] = null; continue; }
      const adj = k === 'fd' ? S.adj : null;
      const f = frameOf(k, adj);
      const Lf = f.L || (k[0] === 'f' ? CANON : null);
      // tarja em todas as fotos: pela malha, ou pelos olhos marcados à mão
      const eyesF = !f.L && S.eyes[k] ? S.eyes[k].map(p => M.apply(f.M, p)) : null;
      const tOpts = { tarja: S.tarja, L: f.L || (k[0] === 'f' ? CANON : null), eyes: eyesF };
      if (k[0] === 'p' && !f.L && !eyesF) tOpts.L = null;
      S.frames[k] = { cv: M.prerender(S.img[k], f.M, tOpts), L: Lf };
    }
    drawAlign(); lightCheck(); drawReg(); $('#profTog').style.display = S.frames.pa && S.frames.pd ? 'flex' : 'none'; refresh(true);
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
    if (best && bd < 160) { dragId = best.id; dragStart = { p, o: Object.assign({ dx: 0, dy: 0 }, S.roff[dragId]), side: best.side }; c.setPointerCapture(e.pointerId); drawReg(); }
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
    const c = document.createElement('span'); c.className = 'chip' + (S.regs.has(r.id) ? ' on' : ''); c.textContent = r.nome;
    c.onclick = () => { S.regs.has(r.id) ? S.regs.delete(r.id) : S.regs.add(r.id); if (S.regs.size > 6) toast('Mais de 6 regiões deixam o vídeo longo.'); renderRegs(); drawReg(); refresh(); };
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
const orderedRegs = () => M.REGIOES.map(r => r.id).filter(id => S.regs.has(id));
$('#swMl').onclick = e => { S.showMl = !S.showMl; e.currentTarget.classList.toggle('on', S.showMl); renderMl(); refresh(); };
['indic', 'compl', 'interval', 'sess', 'hook1', 'hook2'].forEach(id => $('#' + id).addEventListener('input', () => refresh()));
function profs() { const l = [{ nome: CFG.p1n, crm: CFG.p1c }]; if (CFG.p2n) l.push({ nome: CFG.p2n, crm: CFG.p2c }); return l; }
function renderProfs() { const s = $('#profSel'); s.innerHTML = ''; profs().forEach((p, i) => s.add(new Option(p.nome + ' · ' + p.crm, i))); s.value = Math.min(S.prof, profs().length - 1); }
$('#profSel').onchange = e => { S.prof = +e.target.value; refresh(); };

/* ---------------- estilo ---------------- */
function segCtl(id, key, cb) {
  $$(`#${id} button`).forEach(b => b.onclick = () => { $$(`#${id} button`).forEach(x => x.classList.toggle('on', x === b)); S[key] = b.dataset.v; cb && cb(); refresh(key === 'theme'); });
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
M.ORDEM.forEach(k => { const st = M.ST[k];
  const d = document.createElement('div'); d.className = 'sty' + (k === S.style ? ' on' : ''); d.dataset.k = k;
  d.innerHTML = `<canvas width="216" height="384"></canvas><div class="nm">${st.nome}</div><div class="ds">${st.desc}</div>`;
  d.onclick = () => { S.style = k; $$('.sty').forEach(x => x.classList.toggle('on', x === d)); stopAudio(); playing = false; tNow = 0; refresh(); document.getElementById('s5').scrollIntoView({ behavior: 'smooth', block: 'start' }); if (Dcur) setTimeout(() => { if (!playing) $('#play').click(); }, 450); };
  styleBox.append(d);
});
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
  const T = M.THEMES[S.theme];
  const regs = orderedRegs();
  const nomes = regs.map(id => M.REG[id].nome.toLowerCase());
  const tot = regs.reduce((a, id) => a + (S.ml[id] || 0), 0);
  const p = profs()[Math.min(S.prof, profs().length - 1)];
  const sess = $('#sess').value, iv = $('#interval').value;
  const D = {
    T, A: fa.cv, B: fd.cv, LA: fa.L, LB: fd.L, PA: S.frames.pa && S.frames.pa.cv, PB: S.frames.pd && S.frames.pd.cv,
    regs, ml: S.ml, mlSide: S.mlSide, perSide: S.perSide, showMl: S.showMl && tot > 0,
    indic: $('#indic').value.trim(), compl: $('#compl').value.trim(),
    indicCurta: $('#indic').value.split(/[.,:]/)[0],
    procTxt: PROCS[S.proc].nome + (nomes.length ? ' em ' + listaPt(nomes) : '') + (S.showMl && tot > 0 ? '. Total: ' + String(Math.round(tot * 10) / 10).replace('.', ',') + ' ml' : '') + '.',
    procCurto: PROCS[S.proc].curto,
    evol: 'Foto do depois: ' + iv.toLowerCase() + ' · ' + sess + '.',
    hook1: $('#hook1').value || 'Antes e depois', hook2: $('#hook2').value || PROCS[S.proc].curto,
    style: S.style, music: S.music, sfx: S.sfx,
    prof: p, marca: S.theme === 'curae' ? (CFG.marca || 'Curae Santé') : 'Dr. Pedro Schmitz',
    handle: S.theme === 'curae' ? CFG.handle : '@drpedroschmitz',
    cta1: CFG.cta1, cta2: CFG.cta2, tess: TESS, caseNo: S.caseNo,
    roff: S.roff, voice: S.voice, withProfile: S.withProfile, k: 1,
  };
  if (S.voice) { const need = S.voice.duration + M.VOICE_AT + .5 - M.INFO_DUR - M.END_DUR - ((S.withProfile && D.PA && D.PB) ? M.PROF_DUR : 0); D.k = Math.max(.85, Math.min(3, need / M.ST[S.style].dur(D))); }
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
  if (!Dcur) { pvx.fillStyle = '#0d0a07'; pvx.fillRect(0, 0, W, H); pvx.fillStyle = '#B9A995'; pvx.font = '600 44px "Red Hat Display"'; pvx.textAlign = 'center'; pvx.fillText('Suba as fotos de frente', W / 2, H / 2); $('#durInfo').textContent = '—'; captions(); return; }
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
  M.drawFrame(pvx, Dcur, tNow); $('#scrub').value = Math.round(tNow / dur * 1000);
  if (playing) requestAnimationFrame(loop);
}
$('#scrub').addEventListener('input', e => { if (!Dcur) return; playing = false; stopAudio(); $('#play').textContent = '▶ Tocar'; tNow = e.target.value / 1000 * M.totalDur(Dcur); M.drawFrame(pvx, Dcur, tNow); });

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
const slug = () => (PROCS[S.proc].curto + '-' + M.ST[S.style].nome).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
    if (codec && (!wantAudio || await M.aacOk())) { $('#genInfo').textContent = 'Montando quadro a quadro (MP4)…'; r = await M.exportWebCodecs(D, cv, prog, codec, wantAudio ? 'aac' : null); }
    else if (recMp4) { $('#genInfo').textContent = 'Gravando em tempo real (MP4 com trilha)…'; r = await M.exportRecorder(D, cv, prog); }
    else if (codec && await M.opusOk()) { $('#genInfo').textContent = 'Montando quadro a quadro (MP4)…'; r = await M.exportWebCodecs(D, cv, prog, codec, 'opus'); }
    else if (codec) { $('#genInfo').textContent = 'Montando quadro a quadro (MP4, sem trilha neste navegador)…'; r = await M.exportWebCodecs(D, cv, prog, codec, null); }
    else { $('#genInfo').textContent = 'Gravando em tempo real…'; r = await M.exportRecorder(D, cv, prog); }
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
pv.addEventListener('click', () => { });
$('#resVideo').addEventListener('emptied', () => { });

/* ---------------- legendas (CFM) ---------------- */
const angBox = $('#angle');
Object.entries(ANGLES).forEach(([k, v]) => { const b = document.createElement('button'); b.textContent = v; b.dataset.v = k; if (k === S.angle) b.className = 'on'; b.onclick = () => { S.angle = k; $$('#angle button').forEach(x => x.classList.toggle('on', x === b)); captions(); }; angBox.append(b); });
function captions() {
  const D = Dcur || buildD() || {};
  const p = PROCS[S.proc]; const regs = orderedRegs().map(id => M.REG[id].nome.toLowerCase());
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
$$('[data-copy]').forEach(b => b.onclick = async () => { try { await navigator.clipboard.writeText($('#' + b.dataset.copy).textContent); toast('Copiado.'); } catch (e) { toast('Selecione o texto e copie manualmente.'); } });

/* ---------------- semana ---------------- */
WEEK.forEach(([d, style, ang, tit, desc]) => {
  const el = document.createElement('div'); el.className = 'day';
  el.innerHTML = `<div class="d">${d}</div><div class="t"><b>${tit}</b><span>${M.ST[style].nome} · ${desc}</span></div><button class="btn small">Montar</button>`;
  el.querySelector('button').onclick = () => {
    S.style = style; S.angle = ang;
    $$('.sty').forEach(x => x.classList.toggle('on', x.dataset.k === style));
    $$('#angle button').forEach(x => x.classList.toggle('on', x.dataset.v === ang));
    go('criar'); refresh(); setTimeout(() => $('#s5').scrollIntoView({ behavior: 'smooth' }), 60);
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
    proc: S.proc, regs: [...S.regs], ml: S.ml, mlSide: S.mlSide, perSide: S.perSide, showMl: S.showMl, roff: S.roff,
    f: Object.fromEntries(['indic', 'compl', 'interval', 'sess', 'hook1', 'hook2'].map(k => [k, $('#' + k).value])),
  };
  try { await dbPut(v); S.caseId = v.id; toast('Caso guardado neste aparelho.'); renderGal(); } catch (e) { toast('Este navegador não deixou guardar. Mantenha as fotos no seu arquivo.', 4000); }
};
async function renderGal() {
  let all = []; try { all = await dbAll(); } catch (e) { }
  const g = $('#gal'); g.innerHTML = ''; $('#galEmpty').style.display = all.length ? 'none' : 'block';
  all.sort((a, b) => b.date.localeCompare(a.date)).forEach((c, i) => {
    const it = document.createElement('div'); it.className = 'it';
    it.innerHTML = `<img src="${c.thumb}"><button class="del" aria-label="Apagar">✕</button><span>${PROCS[c.proc] ? PROCS[c.proc].curto : ''} · ${new Date(c.date).toLocaleDateString('pt-BR')}</span>`;
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
  S.caseId = c.id; S.proc = c.proc; procSel.value = c.proc; applyProc(c.proc, true);
  S.regs = new Set(c.regs); S.ml = c.ml || {}; S.mlSide = c.mlSide || {}; S.perSide = !!c.perSide; S.roff = c.roff || {}; S.showMl = !!c.showMl; $('#swMl').classList.toggle('on', S.showMl);
  Object.entries(c.f || {}).forEach(([k, v]) => { if ($('#' + k)) $('#' + k).value = v; });
  S.adj = c.adj || S.adj; [['x', 'dx', 1], ['y', 'dy', 1], ['s', 'ds', 100], ['r', 'dr', 1]].forEach(([a, k, m]) => { $('#ad' + a).value = S.adj[k] * m; $('#ad' + a + 'v').textContent = Math.round(S.adj[k] * m); });
  for (const k of ['fa', 'fd', 'pa', 'pd']) {
    const b = c.photos[k]; const slot = $(`.slot[data-k="${k}"]`);
    if (!b) { S.img[k] = null; continue; }
    const img = await loadImg(b);
    await setPhoto(k, img, { blob: b, lm: c.lm && c.lm[k] || null, eyes: c.eyes && c.eyes[k] });
  }
  renderRegs(); buildFrames();
}

/* ---------------- ajustes ---------------- */
['p1n', 'p1c', 'p2n', 'p2c', 'marca', 'handle', 'cta1', 'cta2'].forEach(k => {
  const el = $('#' + k); el.value = CFG[k] || '';
  el.addEventListener('input', () => { CFG[k] = el.value; saveCfg(); renderProfs(); refresh(); });
});

/* ---------------- navegação ---------------- */
function go(v) { $$('.view').forEach(x => x.classList.toggle('on', x.id === 'v-' + v)); $$('nav.tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v)); scrollTo(0, 0); if (v === 'galeria') renderGal(); }
$$('nav.tabs button').forEach(b => b.onclick = () => go(b.dataset.v));

/* ---------------- início ---------------- */
applyProc('ah'); renderProfs(); renderGal();
const fontsReady = Promise.all(['500 40px "Cormorant Garamond"', 'italic 500 40px "Cormorant Garamond"', '600 40px "Red Hat Display"', '700 40px "Red Hat Display"', '40px Anton', '800 40px Inter', '600 40px Inter', '700 40px "Space Mono"'].map(f => document.fonts.load(f).catch(() => { })));
fontsReady.then(() => { refresh(); drawAlign(); });
refresh(); drawAlign();

window.__estudio = { S, setPhoto, buildD, refresh, loadImg, findWatermark };
})();
