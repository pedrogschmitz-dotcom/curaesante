// Estúdio Curae · antes e depois — motor (render, estilos, áudio, exportação)
// Tudo roda no aparelho: as fotos nunca saem do navegador.
'use strict';
const W = 1080, H = 1920, CX = 540, EYE_Y = 800, IED = 290, PR = 1.5; // PR: escala de pré-render
const FPS = 30;

/* ---------------- utilidades ---------------- */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  io: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: t => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  sine: t => .5 - Math.cos(Math.PI * t) / 2,
};
const pt = (x, y) => ({ x, y });
const add = (a, b) => pt(a.x + b.x, a.y + b.y);
const mid = (a, b, t = .5) => pt(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
function mlLabel(D, id) {
  const sd = D.perSide && REG[id] && REG[id].bi && D.mlSide && D.mlSide[id];
  if (sd) return `D ${fmtMl(sd.d || 0)} · E ${fmtMl(sd.e || 0)} ml`;
  return fmtMl(D.ml[id]) + ' ml';
}
const fmtMl = v => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');

/* ---------------- temas de marca ---------------- */
const THEMES = {
  curae: {
    nome: 'Curae Santé', bg: '#1E1610', bg2: '#2A1F14', ink: '#F9F6F2', sub: '#CDBFAE', ac: '#BCA78E', ac2: '#BC9FA5', dark: '#5D4424',
    disp: '"Cormorant Garamond", Georgia, serif', dispW: '500', dispI: 'italic', upper: false,
    sans: '"Red Hat Display", system-ui, sans-serif', mono: '"Red Hat Display", system-ui, sans-serif',
  },
  drpedro: {
    nome: 'Dr. Pedro Schmitz', bg: '#111111', bg2: '#1A1A1A', ink: '#FFFFFF', sub: '#BDBDBD', ac: '#E8650A', ac2: '#C4A060', dark: '#8A3406',
    disp: 'Anton, Impact, sans-serif', dispW: '400', dispI: 'normal', upper: true,
    sans: 'Inter, system-ui, sans-serif', mono: '"Space Mono", ui-monospace, monospace',
  },
};

/* ---------------- regiões ---------------- */
// Âncoras na malha (MediaPipe 478 pontos). Posições derivadas por geometria para serem robustas.
const REGIOES = [
  { id: 'testa', nome: 'Testa', bi: false },
  { id: 'glabela', nome: 'Glabela', bi: false },
  { id: 'temporas', nome: 'Têmporas', bi: true },
  { id: 'pes', nome: 'Pés de galinha', bi: true },
  { id: 'olheiras', nome: 'Olheiras', bi: true },
  { id: 'malar', nome: 'Malar', bi: true },
  { id: 'nariz', nome: 'Nariz', bi: false },
  { id: 'bigode', nome: 'Bigode chinês', bi: true },
  { id: 'labios', nome: 'Lábios', bi: false },
  { id: 'marionete', nome: 'Marionete', bi: true },
  { id: 'mento', nome: 'Mento', bi: false },
  { id: 'prejowl', nome: 'Pré-jowl', bi: true },
  { id: 'mandibula', nome: 'Mandíbula', bi: true },
];
const REG = Object.fromEntries(REGIOES.map(r => [r.id, r]));

function anchors(L) {
  const g = i => L[i];
  const e1 = L.length > 470 ? g(468) : mid(g(33), g(133));
  const e2 = L.length > 470 ? g(473) : mid(g(362), g(263));
  // e1 = olho à esquerda da imagem
  const [eL, eR] = e1.x < e2.x ? [e1, e2] : [e2, e1];
  const u = Math.hypot(eR.x - eL.x, eR.y - eL.y);
  const m1 = g(61), m2 = g(291);
  const [mL, mR] = m1.x < m2.x ? [m1, m2] : [m2, m1];
  const j1 = g(172), j2 = g(397);
  const [jL, jR] = j1.x < j2.x ? [j1, j2] : [j2, j1];
  return { eL, eR, u, n: g(1), mL, mR, chin: g(152), lt: g(0), lb: g(17), jL, jR, eM: mid(eL, eR) };
}
// Retorna lista de pontos {x,y,r,lado}
function regiaoPts(id, L) {
  const A = anchors(L), u = A.u;
  const two = (fL, fR) => [Object.assign(fL, { lado: 'L' }), Object.assign(fR, { lado: 'R' })];
  const one = p => [Object.assign(p, { lado: 'C' })];
  switch (id) {
    case 'testa': return one(Object.assign(add(A.eM, pt(0, -1.0 * u)), { r: .42 * u }));
    case 'glabela': return one(Object.assign(add(A.eM, pt(0, -.36 * u)), { r: .2 * u }));
    case 'temporas': return two(Object.assign(add(A.eL, pt(-.92 * u, -.5 * u)), { r: .26 * u }), Object.assign(add(A.eR, pt(.92 * u, -.5 * u)), { r: .26 * u }));
    case 'pes': return two(Object.assign(add(A.eL, pt(-.62 * u, .02 * u)), { r: .18 * u }), Object.assign(add(A.eR, pt(.62 * u, .02 * u)), { r: .18 * u }));
    case 'olheiras': return two(Object.assign(add(A.eL, pt(.02 * u, .3 * u)), { r: .19 * u }), Object.assign(add(A.eR, pt(-.02 * u, .3 * u)), { r: .19 * u }));
    case 'malar': return two(Object.assign(add(A.eL, pt(-.38 * u, .66 * u)), { r: .26 * u }), Object.assign(add(A.eR, pt(.38 * u, .66 * u)), { r: .26 * u }));
    case 'nariz': return one(Object.assign(add(A.n, pt(0, -.25 * u)), { r: .25 * u }));
    case 'bigode': {
      const aL = add(A.n, pt(-.34 * u, -.08 * u)), aR = add(A.n, pt(.34 * u, -.08 * u));
      return two(Object.assign(add(mid(aL, A.mL), pt(-.1 * u, 0)), { r: .2 * u }), Object.assign(add(mid(aR, A.mR), pt(.1 * u, 0)), { r: .2 * u }));
    }
    case 'labios': return one(Object.assign(mid(A.lt, A.lb), { r: .36 * u }));
    case 'marionete': return two(Object.assign(add(A.mL, pt(-.04 * u, .33 * u)), { r: .17 * u }), Object.assign(add(A.mR, pt(.04 * u, .33 * u)), { r: .17 * u }));
    case 'mento': return one(Object.assign(add(A.chin, pt(0, -.24 * u)), { r: .27 * u }));
    case 'prejowl': return two(Object.assign(add(mid(A.chin, A.jL, .42), pt(0, -.14 * u)), { r: .17 * u }), Object.assign(add(mid(A.chin, A.jR, .42), pt(0, -.14 * u)), { r: .17 * u }));
    case 'mandibula': return two(Object.assign(add(A.jL, pt(.05 * u, -.05 * u)), { r: .24 * u }), Object.assign(add(A.jR, pt(-.05 * u, -.05 * u)), { r: .24 * u }));
  }
  return [];
}

/* ---------------- alinhamento ---------------- */
// Similaridade que leva os olhos (imagem) para os olhos canônicos (quadro)
function eyeXform(L, adj) { const A = anchors(L); return eyesXform(A.eL, A.eR, adj); }
function eyesXform(e1, e2, adj) {
  const [eL, eR] = e1.x < e2.x ? [e1, e2] : [e2, e1];
  const u = Math.hypot(eR.x - eL.x, eR.y - eL.y);
  const q1 = pt(CX - IED / 2, EYE_Y);
  const s = IED / u;
  const th = -Math.atan2(eR.y - eL.y, eR.x - eL.x);
  const a = s * Math.cos(th), b = s * Math.sin(th), c = -b, d = a;
  const e = q1.x - (a * eL.x + c * eL.y), f = q1.y - (b * eL.x + d * eL.y);
  return composeAdj([a, b, c, d, e, f], adj);
}
function composeAdj(M, adj) {
  if (!adj) return M;
  const ds = Math.pow(2, adj.ds || 0), dr = (adj.dr || 0) * Math.PI / 180;
  const ca = Math.cos(dr) * ds, sa = Math.sin(dr) * ds;
  const ox = CX, oy = EYE_Y + 200; // pivô
  // T = translate(ox+dx, oy+dy) * R*S * translate(-ox,-oy)
  const T = [ca, sa, -sa, ca, ox + (adj.dx || 0) - (ca * ox - sa * oy), oy + (adj.dy || 0) - (sa * ox + ca * oy)];
  return mul(T, M);
}
function mul(A, B) { // A*B, matrizes 2x3 no formato canvas [a,b,c,d,e,f]
  return [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
}
const apply = (M, p) => pt(M[0] * p.x + M[2] * p.y + M[4], M[1] * p.x + M[3] * p.y + M[5]);
// Encaixe "cobrir" quando não há olhos detectados (perfil, por ex.)
function coverXform(img, adj) {
  const s = Math.max(W / img.width, H / img.height);
  return composeAdj([s, 0, 0, s, (W - img.width * s) / 2, (H - img.height * s) / 2], adj);
}

/* ---------------- pré-render dos quadros alinhados ---------------- */
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function prerender(img, M, opts = {}) {
  const c = mk(W * PR, H * PR), x = c.getContext('2d');
  x.scale(PR, PR);
  // fundo: a própria foto ampliada e desfocada (sem filtro de canvas: reduz e amplia)
  const sm = mk(54, 96), sx = sm.getContext("2d");
  const s = Math.max(54 / img.width, 96 / img.height);
  sx.drawImage(img, (54 - img.width * s) / 2, (96 - img.height * s) / 2, img.width * s, img.height * s);
  const md = mk(216, 384); const mdx = md.getContext("2d"); mdx.imageSmoothingQuality = "high"; mdx.drawImage(sm, 0, 0, 216, 384);
  x.imageSmoothingQuality = 'high';
  if (opts.black) { x.fillStyle = '#000'; x.fillRect(0, 0, W, H); }
  else { x.drawImage(md, 0, 0, W, H); x.fillStyle = 'rgba(10,8,6,.45)'; x.fillRect(0, 0, W, H); }
  // foto alinhada
  x.save(); x.setTransform(M[0] * PR, M[1] * PR, M[2] * PR, M[3] * PR, M[4] * PR, M[5] * PR);
  x.drawImage(img, 0, 0); x.restore();
  // borda suave da foto
  x.save(); x.setTransform(M[0] * PR, M[1] * PR, M[2] * PR, M[3] * PR, M[4] * PR, M[5] * PR);
  if (!opts.black) { x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 6 / Math.hypot(M[0], M[1]); x.strokeRect(0, 0, img.width, img.height); } x.restore();
  // tarja nos olhos (anonimização)
  if (opts.tarja && (opts.L || opts.eyes)) {
    let eL, eR, fw = 0;
    if (opts.L) { const A = anchors(opts.L); eL = A.eL; eR = A.eR; const s1 = opts.L[234], s2 = opts.L[454]; if (s1 && s2) fw = Math.hypot(s2.x - s1.x, s2.y - s1.y); }
    else { [eL, eR] = opts.eyes[0].x < opts.eyes[1].x ? opts.eyes : [opts.eyes[1], opts.eyes[0]]; }
    const u = Math.hypot(eR.x - eL.x, eR.y - eL.y);
    const ang = Math.atan2(eR.y - eL.y, eR.x - eL.x);
    // em 3/4 ou perfil a distância entre os olhos encolhe: usa a largura do rosto como piso
    const w = Math.max(u * 2.15, fw * .78, 200), h = Math.max(u * .52, w * .24);
    const cx = (eL.x + eR.x) / 2 + (opts.L ? 0 : 0), cy = (eL.y + eR.y) / 2;
    x.save(); x.translate(cx, cy); x.rotate(ang);
    const px = mk(14, 4); const pxx = px.getContext('2d');
    pxx.drawImage(c, (cx - w / 2) * PR, (cy - h / 2) * PR, w * PR, h * PR, 0, 0, 14, 4);
    x.imageSmoothingEnabled = false; x.drawImage(px, -w / 2, -h / 2, w, h); x.imageSmoothingEnabled = true;
    x.fillStyle = 'rgba(20,16,12,.35)'; x.fillRect(-w / 2, -h / 2, w, h);
    x.restore();
  }
  return c;
}

/* ---------------- desenho base ---------------- */
// desenha quadro alinhado com câmera: ponto (fx,fy) do quadro vai para (tx,ty) com escala s
function face(ctx, fr, s = 1, fx = CX, fy = H / 2, tx = CX, ty = H / 2, alpha = 1) {
  if (!fr || alpha <= 0) return;
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.drawImage(fr, tx - fx * s, ty - fy * s, W * s, H * s);
  ctx.restore();
}
function font(T, kind, size, weight) {
  if (kind === 'disp') return `${T.dispI} ${weight || T.dispW} ${size}px ${T.disp}`;
  if (kind === 'mono') return `${weight || 700} ${size}px ${T.mono}`;
  return `${weight || 600} ${size}px ${T.sans}`;
}
function txt(ctx, s, x, y, o = {}) {
  ctx.save();
  ctx.font = o.font; ctx.fillStyle = o.color || '#fff'; ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'alphabetic';
  if (o.ls) try { ctx.letterSpacing = o.ls + 'px'; } catch (e) { }
  ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
  if (o.maxW) { const w = ctx.measureText(s).width; if (w > o.maxW) { const k = o.maxW / w; ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); } }
  if (o.shadow) { ctx.shadowColor = o.shadow; ctx.shadowBlur = o.blur || 24; ctx.shadowOffsetY = o.sy || 6; }
  if (o.depth) { // efeito 3D em camadas
    const c0 = ctx.fillStyle; ctx.fillStyle = o.depthColor;
    for (let i = o.depth; i > 0; i--) ctx.fillText(s, x + i, y + i);
    ctx.fillStyle = c0; ctx.shadowColor = 'transparent';
  }
  ctx.fillText(s, x, y);
  ctx.restore();
}
function wrap(ctx, s, maxW) {
  const words = String(s).split(/\s+/); const lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
function para(ctx, s, x, y, maxW, lh, o) {
  ctx.save(); ctx.font = o.font; const L = wrap(ctx, s, maxW); ctx.restore();
  L.forEach((l, i) => txt(ctx, l, x, y + i * lh, o)); return L.length;
}
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
// título com a voz da marca (sobe e aparece)
function titulo(ctx, D, s, y, size, p, o = {}) {
  const T = D.T; if (p <= 0) return;
  const e = E.out(clamp(p));
  const str = T.upper ? s.toUpperCase() : s;
  txt(ctx, str, o.x || CX, y + (1 - e) * 50, {
    font: font(T, 'disp', size), color: o.color || T.ink, alpha: e * (o.alpha == null ? 1 : o.alpha), align: o.align,
    shadow: o.noShadow ? null : 'rgba(0,0,0,.55)', blur: 30, maxW: o.maxW || 960,
    depth: T.upper && o.d3 ? Math.round(size / 14) : 0, depthColor: o.dc || T.dark,
  });
}
function kicker(ctx, D, s, y, p, o = {}) {
  const T = D.T; if (p <= 0) return; const e = E.out(clamp(p));
  ctx.save(); ctx.font = font(T, 'mono', 26, 700); try { ctx.letterSpacing = '6px'; } catch (e) { }
  const w = ctx.measureText(s.toUpperCase()).width + 48; ctx.restore();
  const x = (o.x || CX) - (o.align === 'left' ? 0 : w / 2);
  ctx.save(); ctx.globalAlpha *= e;
  ctx.fillStyle = o.bg || T.ac; rr(ctx, x, y - 40 + (1 - e) * 20, w, 56, T.upper ? 4 : 28); ctx.fill();
  txt(ctx, s.toUpperCase(), x + w / 2, y - 3 + (1 - e) * 20, { font: font(T, 'mono', 26, 700), color: o.fg || (T.upper ? '#111' : '#2A1F14'), ls: 6 });
  ctx.restore();
}
function vignette(ctx, top = .55, bot = .9) {
  let g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, `rgba(8,6,4,${top})`); g.addColorStop(.2, 'rgba(8,6,4,0)'); g.addColorStop(.66, 'rgba(8,6,4,0)'); g.addColorStop(1, `rgba(8,6,4,${bot})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
// etiqueta ANTES / DEPOIS
function tag(ctx, D, s, x, y, alpha = 1, align = 'center') {
  if (alpha <= 0) return; const T = D.T; if (isStory(D) && y > 1450) y = 1450;
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.font = font(T, 'mono', 30, 700); try { ctx.letterSpacing = '8px'; } catch (e) { }
  const w = ctx.measureText(s).width + 56;
  const x0 = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
  ctx.fillStyle = 'rgba(15,11,8,.62)'; rr(ctx, x0, y - 44, w, 64, 32); ctx.fill();
  ctx.strokeStyle = T.ac; ctx.lineWidth = 2; ctx.stroke();
  txt(ctx, s, x0 + w / 2, y - 1, { font: font(T, 'mono', 30, 700), color: T.ink, ls: 8 });
  ctx.restore();
}
// marcador de região com cartão lateral
function regCard(ctx, D, i, reg, pts, p, opts = {}) {
  if (p <= 0) return; const T = D.T; const e = E.out(clamp(p));
  const side = opts.side || (pts[0].lado === 'R' ? 'R' : (pts[0].x > CX ? 'R' : 'L'));
  const cardW = 300, cardH = D.showMl && D.ml[reg.id] ? 124 : 98;
  const anchor = pts.reduce((a, b) => (side === 'L' ? (b.x < a.x ? b : a) : (b.x > a.x ? b : a)), pts[0]);
  const y = clamp(opts.y || anchor.y, 300, H - 420) - cardH / 2;
  const x = side === 'L' ? 44 - (1 - e) * 80 : W - 44 - cardW + (1 - e) * 80;
  ctx.save(); ctx.globalAlpha *= e;
  // pontos na pele
  for (const q of pts) {
    ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (0.6 + .4 * e), 0, Math.PI * 2);
    ctx.strokeStyle = T.ac; ctx.lineWidth = 3; ctx.setLineDash([10, 9]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(q.x, q.y, 7, 0, Math.PI * 2); ctx.fillStyle = T.ac; ctx.fill();
  }
  // linha guia
  const lx = side === 'L' ? x + cardW : x;
  ctx.beginPath(); ctx.moveTo(lx, y + cardH / 2); ctx.lineTo(anchor.x + (side === 'L' ? -anchor.r : anchor.r) * .9, anchor.y);
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2; ctx.stroke();
  // cartão
  ctx.fillStyle = 'rgba(18,13,9,.78)'; rr(ctx, x, y, cardW, cardH, 14); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = T.ac; ctx.fillRect(x + 22, y + cardH - 18, (cardW - 44) * e, 3);
  txt(ctx, String(i + 1).padStart(2, '0') + ' · REGIÃO', x + 22, y + 34, { font: font(T, 'mono', 20, 700), color: T.sub, align: 'left', ls: 3 });
  txt(ctx, reg.nome, x + 22, y + 72, { font: font(T, T.upper ? 'sans' : 'disp', T.upper ? 34 : 40, T.upper ? 800 : 600), color: T.ink, align: 'left', maxW: cardW - 44 });
  if (D.showMl && D.ml[reg.id]) txt(ctx, mlLabel(D, reg.id), x + 22, y + 104, { font: font(T, 'mono', 22, 700), color: T.ac, align: 'left', maxW: cardW - 44 });
  // valor de cada lado junto do ponto
  const sd = D.showMl && D.perSide && reg.bi && D.mlSide && D.mlSide[reg.id];
  if (sd) for (const q of pts) { const v = q.lado === 'L' ? sd.d : sd.e; if (!v) continue; ctx.save(); ctx.globalAlpha *= e;
    const s = fmtMl(v) + ' ml'; ctx.font = font(T, 'mono', 22, 700); const tw = ctx.measureText(s).width + 22;
    const by = q.y - q.r - 46, bx = q.x - tw / 2;
    ctx.fillStyle = T.ac; rr(ctx, bx, by, tw, 36, 18); ctx.fill(); txt(ctx, s, q.x, by + 26, { font: font(T, 'mono', 22, 700), color: '#111' }); ctx.restore(); }
  ctx.restore();
}
function chrome(ctx, D, t, T0) {
  // barra de marca no topo + rodapé ético (sempre visíveis)
  const T = D.T, st = isStory(D);
  const a = clamp(t / .4);
  ctx.save(); ctx.globalAlpha = a;
  if (!st) { // nos stories o próprio Instagram cobre o topo e já tem barra de progresso
    let x0 = 60;
    if (D.T === THEMES.curae) { const w = logo(ctx, 'cs', 92, 52, 64, .95); if (w) x0 = 92 + w / 2 + 16; }
    txt(ctx, (D.marca || T.nome).toUpperCase(), x0, 96, { font: font(T, 'mono', 24, 700), color: T.ink, align: 'left', ls: 6, alpha: .9 });
    ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(60, 130, W - 120, 3);
    ctx.fillStyle = T.ac; ctx.fillRect(60, 130, (W - 120) * clamp(t / T0), 3);
  }
  const fy = st ? H - 360 : H - 74;
  txt(ctx, D.prof.nome + ' · ' + D.prof.crm, CX, fy, { font: font(T, 'sans', 24, 600), color: T.ink, alpha: .85 });
  txt(ctx, 'Imagens autorizadas pelo paciente · resultados variam de pessoa para pessoa', CX, fy + 34, { font: font(T, 'sans', 19, 500), color: T.sub, alpha: .8, maxW: 980 });
  ctx.restore();
}
function malha(ctx, D, L, n, color, alpha, dotR = 2.6) {
  if (!L || alpha <= 0) return;
  ctx.save(); ctx.globalAlpha *= alpha;
  const t = D.tess; if (t && n > 300) {
    ctx.strokeStyle = color; ctx.lineWidth = 0.8; ctx.globalAlpha *= .35; ctx.beginPath();
    const lim = Math.min(t.length, Math.floor((n - 300) / 178 * t.length));
    for (let i = 0; i < lim; i += 2) { const p = L[t[i]], q = L[t[i + 1]]; if (p && q) { ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); } }
    ctx.stroke(); ctx.globalAlpha /= .35;
  }
  ctx.fillStyle = color;
  for (let i = 0; i < Math.min(n, L.length); i++) { ctx.beginPath(); ctx.arc(L[i].x, L[i].y, dotR, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

/* ---------------- cartões finais (comuns a todos os estilos) ---------------- */
const INFO_DUR = 4.2, END_DUR = 2.8;
const infoD = D => (D.dest && D.dest !== 'reel') ? 3.2 : INFO_DUR;
const endD = D => (D.dest && D.dest !== 'reel') ? 2.0 : END_DUR;
const isStory = D => D.dest === 'stories';
/* logos oficiais */
const LOGO = {}; const tintCache = {};
if (window.LOGOS) for (const k in LOGOS) { const im = new Image(); im.src = LOGOS[k]; LOGO[k] = im; }
function tinted(k, color) {
  const im = LOGO[k]; if (!im || !im.complete || !im.naturalWidth) return null; const key = k + color; if (tintCache[key]) return tintCache[key];
  const c = mk(im.naturalWidth, im.naturalHeight), x = c.getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
  return tintCache[key] = c;
}
function logo(ctx, k, x, y, h, alpha = 1, color) {
  const im = color ? tinted(k, color) : LOGO[k]; if (!im || (im.complete === false) || !(im.naturalWidth || im.width)) return 0;
  const iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height, w = iw * h / ih;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.drawImage(im, x - w / 2, y, w, h); ctx.restore(); return w;
}
function infoCard(ctx, D, t) {
  const T = D.T;
  ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
  if (isStory(D)) { ctx.save(); ctx.translate(CX, H / 2); ctx.scale(.86, .86); ctx.translate(-CX, -H / 2); infoBody(ctx, D, t); ctx.restore(); return; }
  infoBody(ctx, D, t);
}
function infoBody(ctx, D, t) {
  const T = D.T;
  // miniatura lado a lado
  const p0 = E.out(seg(t, 0, .6));
  ctx.save(); ctx.globalAlpha = p0;
  const bw = 400, bh = 560, y0 = 250;
  [[D.A, 'ANTES', CX - bw - 14], [D.B, 'DEPOIS', CX + 14]].forEach(([fr, lab, x]) => {
    ctx.save(); rr(ctx, x, y0, bw, bh, 18); ctx.clip();
    face(ctx, fr, .82, CX, EYE_Y + 120, x + bw / 2, y0 + bh / 2);
    ctx.restore();
    tag(ctx, D, lab, x + bw / 2, y0 + bh - 26, 1);
  });
  ctx.restore();
  titulo(ctx, D, 'Sobre este caso', 940, T.upper ? 84 : 92, seg(t, .3, .9), { d3: true });
  const rows = D.mode === 'cir' ? [
    ['INDICAÇÃO', D.indic],
    ['TÉCNICA', D.tecnica],
    ['CUIDADOS', D.cuidados + ' ' + D.evol],
    ['POSSÍVEIS COMPLICAÇÕES', D.compl],
  ] : [
    ['INDICAÇÃO', D.indic],
    ['PROCEDIMENTO', D.procTxt],
    ['EVOLUÇÃO', D.evol],
    ['POSSÍVEIS EFEITOS', D.compl],
  ];
  let y = 1060;
  rows.forEach((r, i) => {
    const p = E.out(seg(t, .55 + i * .28, 1.1 + i * .28)); if (p <= 0) { y += 150; return; }
    ctx.save(); ctx.globalAlpha = p;
    txt(ctx, r[0], 90, y + (1 - p) * 20, { font: font(T, 'mono', 22, 700), color: T.ac, align: 'left', ls: 5 });
    const n = para(ctx, r[1], 90, y + 44 + (1 - p) * 20, 900, 40, { font: font(T, 'sans', 32, 500), color: T.ink, align: 'left' });
    ctx.restore(); y += 70 + n * 40;
  });
}
function endCard(ctx, D, t) {
  const T = D.T;
  ctx.fillStyle = T.upper ? T.ac : T.bg2; ctx.fillRect(0, 0, W, H);
  if (!T.upper) { ctx.strokeStyle = T.ac; ctx.lineWidth = 2; ctx.strokeRect(60, 160, W - 120, H - 320); }
  const ink = T.upper ? '#111' : T.ink;
  if (!T.upper) logo(ctx, 'cs', CX, 380, 230, E.out(seg(t, 0, .6)));
  titulo(ctx, D, D.cta1, 760, T.upper ? 130 : 120, seg(t, 0, .5), { color: T.upper ? '#FFFFFF' : ink, d3: true, dc: T.upper ? '#A9470A' : T.dark, noShadow: T.upper });
  titulo(ctx, D, D.cta2, 900, T.upper ? 130 : 120, seg(t, .15, .65), { color: T.upper ? '#1A1A1A' : T.ac, d3: true, dc: T.upper ? '#A9470A' : T.dark, noShadow: T.upper });
  const p = E.out(seg(t, .5, 1.1));
  txt(ctx, D.prof.nome, CX, 1140, { font: font(T, 'sans', 44, 700), color: ink, alpha: p });
  txt(ctx, D.prof.crm, CX, 1196, { font: font(T, 'mono', 30, 700), color: ink, alpha: p * .85, ls: 4 });
  if (D.handle) txt(ctx, D.handle, CX, 1290, { font: font(T, 'sans', 36, 600), color: T.upper ? '#fff' : T.ac, alpha: p });
  logo(ctx, 'full', CX, 1360, 110, p * (T.upper ? .9 : .95), T.upper ? '#1A1A1A' : null);
  txt(ctx, 'Resultados variam de pessoa para pessoa.', CX, 1560, { font: font(T, 'sans', 26, 500), color: ink, alpha: p * .8 });
  txt(ctx, 'Conteúdo educativo · imagens autorizadas pelo paciente', CX, 1604, { font: font(T, 'sans', 24, 500), color: ink, alpha: p * .7 });
}

/* ---------------- estilos ---------------- */
// Cada estilo: {nome, desc, dur(D), draw(ctx,D,t), cues(D) -> tempos de transição p/ áudio}
const ST = {};
function offPts(P, o) { if (!o) return P; return P.map(q => Object.assign({}, q, { x: q.x + (q.lado === 'R' ? -o.dx : o.dx), y: q.y + o.dy })); }
const regList = D => (!D.LA || !D.LB || !D.regs) ? [] : D.regs.map(id => ({ reg: REG[id], ptsA: offPts(regiaoPts(id, D.LA), D.roff && D.roff[id]), ptsB: offPts(regiaoPts(id, D.LB), D.roff && D.roff[id]) }));
function cardLayout(R, key = 'ptsA') {
  const out = R.map((r, i) => ({ i, side: i % 2 ? 'R' : 'L', y: Math.min(...r[key].map(q => q.y)) }));
  for (const side of ['L', 'R']) {
    const col = out.filter(o => o.side === side).sort((a, b) => a.y - b.y);
    let last = 250; col.forEach(o => { o.y = Math.max(o.y, last + 150); last = o.y; });
    const over = last - (H - 470); if (over > 0) col.forEach(o => o.y -= over);
  }
  return out;
}
const hook = (ctx, D, t, a = 0, b = 2) => {
  const T = D.T, p1 = seg(t, a + .1, a + .7), out = 1 - seg(t, b - .3, b);
  if (out <= 0) return;
  ctx.save(); ctx.globalAlpha = out;
  titulo(ctx, D, D.hook1, 300, T.upper ? 120 : 104, p1, { d3: true });
  titulo(ctx, D, D.hook2, T.upper ? 430 : 410, T.upper ? 120 : 104, seg(t, a + .35, a + .95), { color: T.ac, d3: true });
  ctx.restore();
};

ST.cortina = {
  nome: 'Cortina', desc: 'Linha que revela o depois',
  dur: D => 9 + D.regs.length * .55,
  cues: D => [2.2, 4.4, 6.6],
  draw(ctx, D, t) {
    const z = 1 + .04 * E.sine(seg(t, 0, this.dur(D)));
    face(ctx, D.A, z, CX, EYE_Y + 150, CX, EYE_Y + 150);
    // varredura: 2.2→4.0 vai até direita; 4.4→5.4 volta ao meio
    let x = -10;
    if (t > 2.2) x = lerp(-10, W + 10, E.io(seg(t, 2.2, 4.0)));
    if (t > 4.4) x = lerp(W + 10, CX, E.io(seg(t, 4.4, 5.4)));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, Math.max(0, x), H); ctx.clip();
    face(ctx, D.B, z, CX, EYE_Y + 150, CX, EYE_Y + 150); ctx.restore();
    vignette(ctx);
    if (t > 2.2) {
      ctx.fillStyle = D.T.ac; ctx.fillRect(x - 2, 0, 4, H);
      ctx.beginPath(); ctx.arc(x, EYE_Y + 520, 34, 0, Math.PI * 2); ctx.fillStyle = D.T.ac; ctx.fill();
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.moveTo(x - 8, EYE_Y + 506); ctx.lineTo(x - 20, EYE_Y + 520); ctx.lineTo(x - 8, EYE_Y + 534); ctx.moveTo(x + 8, EYE_Y + 506); ctx.lineTo(x + 20, EYE_Y + 520); ctx.lineTo(x + 8, EYE_Y + 534); ctx.fill();
    }
    hook(ctx, D, t, 0, 2.2);
    tag(ctx, D, 'ANTES', 60, H - 220, seg(t, .3, .8) * (x < 300 || t > 5.4 ? 1 : 0), 'left');
    tag(ctx, D, 'DEPOIS', W - 60, H - 220, seg(t, 3, 3.4) * (t > 5.4 || x > W - 200 ? 1 : 0), 'right');
    // regiões depois que a cortina para no meio
    { const R = regList(D), LY = cardLayout(R, 'ptsB'); R.forEach((r, i) => regCard(ctx, D, i, r.reg, r.ptsB, seg(t, 5.8 + i * .55, 6.3 + i * .55), LY[i])); }
  },
};

ST.lado = {
  nome: 'Lado a lado', desc: 'Antes e depois em duas colunas',
  dur: D => 8 + D.regs.length * .5,
  cues: () => [1.6, 3.2],
  draw(ctx, D, t) {
    ctx.fillStyle = D.T.bg; ctx.fillRect(0, 0, W, H);
    const pw = 520, ph = 1100, y0 = 470;
    const pA = E.out(seg(t, .2, 1)), pB = E.out(seg(t, 1.4, 2.2));
    const zoom = .78 + .05 * seg(t, 0, this.dur(D));
    [[D.A, 'ANTES', 14, pA, D.LA], [D.B, 'DEPOIS', W - 14 - pw, pB, D.LB]].forEach(([fr, lab, x, p], k) => {
      if (p <= 0) return;
      ctx.save(); ctx.globalAlpha = p; ctx.translate(0, (1 - p) * 60);
      rr(ctx, x, y0, pw, ph, 22); ctx.clip();
      face(ctx, fr, zoom, CX, EYE_Y + 230, x + pw / 2, y0 + ph / 2);
      ctx.restore();
      tag(ctx, D, lab, x + pw / 2, y0 + ph - 30, p);
    });
    titulo(ctx, D, D.hook1, 260, D.T.upper ? 100 : 92, seg(t, 0, .6), { d3: true });
    titulo(ctx, D, D.hook2, D.T.upper ? 370 : 360, D.T.upper ? 100 : 92, seg(t, .2, .8), { color: D.T.ac, d3: true });
    // lista de regiões abaixo
    const regs = D.regs.map(id => REG[id].nome + (D.showMl && D.ml[id] ? ' ' + mlLabel(D, id) : ''));
    const s = regs.join('  ·  ');
    ctx.save(); ctx.globalAlpha = E.out(seg(t, 2.6, 3.4));
    para(ctx, s, CX, 1650, 940, 40, { font: font(D.T, 'sans', 30, 600), color: D.T.ink });
    ctx.restore();
  },
};

ST.hightech = {
  nome: 'High-tech', desc: 'Malha de 478 pontos e cartões',
  dur: D => 9.5 + D.regs.length * .6,
  cues: D => [3.2, 5.2 + D.regs.length * .6],
  draw(ctx, D, t) {
    const T = D.T, n = D.regs.length, tB = 5.2 + n * .6;
    face(ctx, D.A, 1.02, CX, EYE_Y + 150, CX, EYE_Y + 150);
    face(ctx, D.B, 1.02, CX, EYE_Y + 150, CX, EYE_Y + 150, E.io(seg(t, tB, tB + 1.2)));
    ctx.fillStyle = `rgba(10,8,6,${.25 * (1 - seg(t, tB, tB + 1))})`; ctx.fillRect(0, 0, W, H);
    vignette(ctx);
    const L = t < tB ? D.LA : D.LB;
    const np = Math.floor(478 * E.out(seg(t, .4, 3.0)));
    const ma = (1 - seg(t, tB + .4, tB + 1.4)) * .9;
    malha(ctx, D, L, np, T.ac, ma);
    // linha de varredura
    if (t > .4 && t < 3.2) { const y = lerp(300, 1400, seg(t, .4, 3.0)); const g = ctx.createLinearGradient(0, y - 60, 0, y + 6); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, T.ac); ctx.fillStyle = g; ctx.globalAlpha = .45; ctx.fillRect(0, y - 60, W, 66); ctx.globalAlpha = 1; }
    txt(ctx, 'PONTOS ' + String(np).padStart(3, '0') + '/478', 60, 1650, { font: font(T, 'mono', 24, 700), color: T.ink, align: 'left', ls: 3, alpha: ma });
    txt(ctx, 'REGIÕES ' + String(Math.min(n, Math.max(0, Math.floor((t - 3.2) / .6) + 1))).padStart(2, '0') + '/' + String(n).padStart(2, '0'), W - 60, 1650, { font: font(T, 'mono', 24, 700), color: T.ink, align: 'right', ls: 3, alpha: ma * seg(t, 3, 3.3) });
    { const R = regList(D), LY = cardLayout(R); R.forEach((r, i) => {
      const p = seg(t, 3.2 + i * .6, 3.7 + i * .6) * (1 - seg(t, tB - .2, tB + .3));
      regCard(ctx, D, i, r.reg, r.ptsA, p, LY[i]);
    }); }
    hook(ctx, D, t, 0, 3.0);
    tag(ctx, D, 'ANTES', CX, 1560, seg(t, 3, 3.4) * (1 - seg(t, tB - .3, tB)));
    tag(ctx, D, 'DEPOIS', CX, 1560, seg(t, tB + .6, tB + 1));
  },
};

ST.lupa = {
  nome: 'Lupa', desc: 'Lente passeia pelas regiões',
  dur: D => 3 + Math.max(1, D.regs.length) * 1.7 + 1.5,
  cues: D => D.regs.map((_, i) => 2.6 + i * 1.7),
  draw(ctx, D, t) {
    const T = D.T, R = regList(D);
    face(ctx, D.A, 1, CX, H / 2, CX, H / 2);
    ctx.fillStyle = 'rgba(10,8,6,.35)'; ctx.fillRect(0, 0, W, H);
    vignette(ctx);
    hook(ctx, D, t, 0, 2.6);
    if (!R.length) return;
    const k = clamp(Math.floor((t - 2.6) / 1.7), 0, R.length - 1);
    const lt = (t - 2.6 - k * 1.7);
    const cur = R[k], prev = R[Math.max(0, k - 1)];
    const pc = cur.ptsA[0], pp = prev.ptsA[0];
    const mv = E.io(seg(lt, 0, .55));
    const c = k === 0 ? pc : mid(pp, pc, mv);
    const lr = 230 * E.back(seg(t, 2.4, 3.0));
    if (lr <= 0) return;
    const zoom = 1.9;
    ctx.save(); ctx.beginPath(); ctx.arc(c.x, c.y, lr, 0, Math.PI * 2); ctx.clip();
    const showB = lt > .75 || k > 0 && lt < .55;
    face(ctx, D.A, zoom, c.x, c.y, c.x, c.y);
    face(ctx, D.B, zoom, c.x, c.y, c.x, c.y, k === 0 && lt < .55 ? 0 : E.io(seg(lt, .75, 1.15)) * (lt > .55 ? 1 : 0) + (lt <= .55 && k > 0 ? 1 - mv : 0));
    ctx.restore();
    ctx.beginPath(); ctx.arc(c.x, c.y, lr, 0, Math.PI * 2); ctx.strokeStyle = T.ac; ctx.lineWidth = 8; ctx.stroke();
    ctx.beginPath(); ctx.arc(c.x, c.y, lr + 14, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.stroke();
    // legenda da lente
    const lab = cur.reg.nome + (D.showMl && D.ml[cur.reg.id] ? ' · ' + mlLabel(D, cur.reg.id) : '');
    const ly = c.y + lr + 80 > 1700 ? c.y - lr - 40 : c.y + lr + 80;
    txt(ctx, T.upper ? lab.toUpperCase() : lab, CX, ly, { font: font(T, 'disp', T.upper ? 70 : 76), color: T.ink, shadow: 'rgba(0,0,0,.7)', depth: T.upper ? 5 : 0, depthColor: T.dark, maxW: 940 });
    txt(ctx, lt > .9 ? 'DEPOIS' : 'ANTES', CX, ly + 54, { font: font(T, 'mono', 26, 700), color: T.ac, ls: 6 });
  },
};

ST.vaivolta = {
  nome: 'Vai e volta', desc: 'Alterna antes e depois no ritmo',
  dur: () => 8.5,
  cues: () => [1.8, 2.6, 3.4, 4.2, 5.0, 5.8, 6.6],
  draw(ctx, D, t) {
    const T = D.T;
    // alternância: cortes que ficam mais lentos
    const cuts = [1.8, 2.6, 3.4, 4.2, 5.0, 5.8, 6.6];
    let k = cuts.filter(c => t >= c).length; const showB = k % 2 === 1;
    const lastCut = cuts[k - 1] || 0; const fl = 1 - seg(t, lastCut, lastCut + .12);
    const z = 1.0 + .06 * seg(t, 0, 8.5);
    face(ctx, showB ? D.B : D.A, z, CX, EYE_Y + 150, CX, EYE_Y + 150);
    if (k && fl > 0) { ctx.fillStyle = `rgba(255,255,255,${.25 * fl})`; ctx.fillRect(0, 0, W, H); }
    vignette(ctx);
    hook(ctx, D, t, 0, 1.8);
    if (t > 1.8) {
      const s = showB ? 'DEPOIS' : 'ANTES';
      txt(ctx, s, CX, 1500, { font: font(T, 'disp', T.upper ? 150 : 140), color: showB ? T.ac : T.ink, shadow: 'rgba(0,0,0,.6)', depth: T.upper ? 9 : 0, depthColor: T.dark, alpha: E.out(seg(t, lastCut, lastCut + .2)) });
    }
  },
};

ST.linhameio = {
  nome: 'Linha do meio', desc: 'Metade antes, metade depois',
  dur: () => 8,
  cues: () => [2, 5],
  draw(ctx, D, t) {
    const T = D.T;
    const swap = t > 5 ? E.io(seg(t, 5, 5.8)) : 0;
    face(ctx, D.A, 1.04, CX, EYE_Y + 150, CX, EYE_Y + 150);
    const xLine = t < 2 ? W + 20 : lerp(W + 20, CX, E.io(seg(t, 2, 3)));
    ctx.save(); ctx.beginPath();
    if (swap < .5) ctx.rect(xLine, 0, W, H); else ctx.rect(0, 0, CX, H);
    ctx.clip(); face(ctx, D.B, 1.04, CX, EYE_Y + 150, CX, EYE_Y + 150); ctx.restore();
    if (swap > 0 && swap < 1) { ctx.fillStyle = `rgba(255,255,255,${Math.sin(swap * Math.PI) * .5})`; ctx.fillRect(0, 0, W, H); }
    vignette(ctx);
    if (t > 2) {
      ctx.fillStyle = T.ac; ctx.fillRect(xLine - 2, 200, 4, 1450);
      const L = swap < .5 ? ['ANTES', 'DEPOIS'] : ['DEPOIS', 'ANTES'];
      tag(ctx, D, L[0], CX - 30, 1560, seg(t, 3, 3.4), 'right');
      tag(ctx, D, L[1], CX + 30, 1560, seg(t, 3, 3.4), 'left');
    }
    hook(ctx, D, t, 0, 2.2);
  },
};

ST.polaroid = {
  nome: 'Polaroid', desc: 'Fotos reveladas como polaroid',
  dur: () => 8,
  cues: () => [1.4, 3.0],
  draw(ctx, D, t) {
    const T = D.T;
    ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
    // textura sutil
    ctx.fillStyle = 'rgba(255,255,255,.03)'; for (let i = 0; i < 40; i++) ctx.fillRect((i * 97) % W, 0, 1, H);
    const pol = (fr, x, y, rot, p, lab, dev) => {
      if (p <= 0) return; const e = E.back(clamp(p));
      ctx.save(); ctx.translate(x, y - (1 - e) * 900); ctx.rotate(rot * e);
      ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
      ctx.fillStyle = '#F6F1E8'; ctx.fillRect(-250, -330, 500, 640); ctx.shadowColor = 'transparent';
      ctx.save(); ctx.beginPath(); ctx.rect(-220, -300, 440, 500); ctx.clip();
      face(ctx, fr, .62, CX, EYE_Y + 160, 0, -50);
      // revelação (fica escura e clareia)
      ctx.fillStyle = `rgba(30,24,18,${1 - dev})`; ctx.fillRect(-220, -300, 440, 500);
      ctx.restore();
      txt(ctx, lab, 0, 270, { font: `italic 500 56px "Cormorant Garamond", Georgia, serif`, color: '#3B2A1A' });
      ctx.restore();
    };
    pol(D.A, 330, 780, -.07, seg(t, .3, 1.2), 'antes', seg(t, .9, 2.4));
    pol(D.B, 750, 1060, .06, seg(t, 1.4, 2.3), 'depois', seg(t, 2.1, 3.8));
    titulo(ctx, D, D.hook1, 260, T.upper ? 96 : 92, seg(t, 3.6, 4.2), { d3: true });
    titulo(ctx, D, D.hook2, T.upper ? 365 : 360, T.upper ? 96 : 92, seg(t, 3.8, 4.4), { color: T.ac, d3: true });
    const regs = D.regs.map(id => REG[id].nome).join(' · ');
    ctx.save(); ctx.globalAlpha = E.out(seg(t, 4.6, 5.3));
    para(ctx, regs, CX, 1590, 900, 40, { font: font(T, 'sans', 30, 600), color: T.sub });
    ctx.restore();
  },
};

ST.editorial = {
  nome: 'Editorial', desc: 'Revista: serifa grande e respiro',
  dur: () => 8.5,
  cues: () => [3.8],
  draw(ctx, D, t) {
    const T = D.T;
    ctx.fillStyle = T.upper ? '#F4EFE8' : '#F9F6F2'; ctx.fillRect(0, 0, W, H);
    const ink = '#2A1F14';
    txt(ctx, 'Nº ' + String(D.caseNo || 1).padStart(2, '0') + ' — ' + (D.procCurto || 'Harmonização'), 70, 140, { font: font(T, 'mono', 22, 700), color: ink, align: 'left', ls: 4, alpha: seg(t, 0, .5) });
    ctx.fillStyle = ink; ctx.fillRect(70, 166, (W - 140) * E.out(seg(t, .1, 1)), 2);
    // foto grande com moldura
    const fx = 70, fy = 230, fw = W - 140, fh = 1180;
    ctx.save(); rr(ctx, fx, fy, fw, fh, 4); ctx.clip();
    const z = .95 + .06 * seg(t, 0, 8.5);
    face(ctx, D.A, z, CX, EYE_Y + 130, CX, fy + fh / 2);
    face(ctx, D.B, z, CX, EYE_Y + 130, CX, fy + fh / 2, E.io(seg(t, 3.8, 5.2)));
    ctx.restore();
    const big = (s, y, p, it) => txt(ctx, s, 70, y + (1 - E.out(p)) * 40, { font: `${it ? 'italic' : 'normal'} 500 118px "Cormorant Garamond", Georgia, serif`, color: ink, align: 'left', alpha: E.out(p), maxW: 940 });
    big(D.hook1, 1540, seg(t, .6, 1.4), false);
    big(D.hook2, 1650, seg(t, .9, 1.7), true);
    txt(ctx, t < 4.4 ? 'antes' : 'depois', W - 90, fy + fh - 40, { font: `italic 500 64px "Cormorant Garamond", Georgia, serif`, color: '#fff', align: 'right', shadow: 'rgba(0,0,0,.6)' });
  },
};

ST.tresatos = {
  nome: 'Três atos', desc: 'Antes · regiões · depois',
  dur: D => 10.5 + D.regs.length * .45,
  cues: D => [2.4, 5 + D.regs.length * .45],
  draw(ctx, D, t) {
    const T = D.T, n = D.regs.length, a2 = 2.4, a3 = 5 + n * .45;
    const act = t < a2 ? 1 : t < a3 ? 2 : 3;
    const s0 = act === 1 ? 0 : act === 2 ? a2 : a3;
    const z = 1 + .05 * seg(t, s0, s0 + 3);
    face(ctx, act === 3 ? D.B : D.A, z, CX, EYE_Y + 150, CX, EYE_Y + 150);
    if (act === 2) { ctx.fillStyle = 'rgba(10,8,6,.35)'; ctx.fillRect(0, 0, W, H); }
    vignette(ctx);
    // cartão de ato
    const roman = ['I', 'II', 'III'][act - 1], nm = ['O antes', 'O plano', 'O depois'][act - 1];
    const p = seg(t, s0, s0 + .5) * (1 - seg(t, s0 + 1.6, s0 + 2));
    txt(ctx, 'ATO ' + roman, CX, 300, { font: font(T, 'mono', 30, 700), color: T.ac, ls: 10, alpha: E.out(p) });
    titulo(ctx, D, nm, 420, T.upper ? 120 : 116, p, { d3: true });
    if (act === 1) titulo(ctx, D, D.indicCurta || D.hook1, 1520, T.upper ? 60 : 64, seg(t, .8, 1.4), { maxW: 940 });
    if (act === 2) { const R = regList(D), LY = cardLayout(R); R.forEach((r, i) => regCard(ctx, D, i, r.reg, r.ptsA, seg(t, a2 + .8 + i * .45, a2 + 1.3 + i * .45), LY[i])); }
    if (act === 3) { tag(ctx, D, 'DEPOIS', CX, 1560, seg(t, a3 + .4, a3 + .8));
      // fecha com divisão
      const xs = lerp(W, CX, E.io(seg(t, a3 + 2.2, a3 + 3)));
      if (t > a3 + 2.2) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, xs, H); ctx.clip(); face(ctx, D.A, z, CX, EYE_Y + 150, CX, EYE_Y + 150); ctx.restore(); ctx.fillStyle = T.ac; ctx.fillRect(xs - 2, 0, 4, H); tag(ctx, D, 'ANTES', 60, 1460, seg(t, a3 + 2.8, a3 + 3.1), 'left'); }
    }
  },
};

ST.topografia = {
  nome: 'Topografia', desc: 'Curvas de nível nas regiões',
  dur: D => 8.5 + D.regs.length * .3,
  cues: () => [2.2, 5.2],
  draw(ctx, D, t) {
    const T = D.T, R = regList(D);
    face(ctx, D.A, 1.02, CX, EYE_Y + 150, CX, EYE_Y + 150);
    face(ctx, D.B, 1.02, CX, EYE_Y + 150, CX, EYE_Y + 150, E.io(seg(t, 5.2, 6.4)));
    ctx.fillStyle = 'rgba(10,8,6,.3)'; ctx.fillRect(0, 0, W, H); vignette(ctx);
    const a = seg(t, 2.2, 3) * (1 - seg(t, 6.4, 7.2));
    R.forEach((r, i) => r.ptsA.forEach(q => {
      for (let k = 1; k <= 6; k++) {
        const ph = (t * .6 + k / 6) % 1;
        ctx.beginPath(); ctx.ellipse(q.x, q.y, q.r * (.25 + ph * 1.1), q.r * (.18 + ph * .8), 0, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 ? T.ac2 : T.ac; ctx.globalAlpha = a * (1 - ph) * .9; ctx.lineWidth = 3; ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }));
    hook(ctx, D, t, 0, 2.2);
    const lab = R.map(r => r.reg.nome).join(' · ');
    ctx.save(); ctx.globalAlpha = a; para(ctx, lab, CX, 1560, 940, 42, { font: font(T, 'sans', 32, 700), color: T.ink }); ctx.restore();
    tag(ctx, D, 'DEPOIS', CX, 1560, seg(t, 6.6, 7));
  },
};

ST.constelacao = {
  nome: 'Constelação', desc: 'Pontos ligados entre regiões',
  dur: D => 8.5 + D.regs.length * .4,
  cues: () => [2.4, 6],
  draw(ctx, D, t) {
    const T = D.T, R = regList(D);
    face(ctx, D.A, 1.02, CX, EYE_Y + 150, CX, EYE_Y + 150);
    face(ctx, D.B, 1.02, CX, EYE_Y + 150, CX, EYE_Y + 150, E.io(seg(t, 6, 7)));
    ctx.fillStyle = `rgba(6,5,4,${.62 * (1 - seg(t, 6, 7))})`; ctx.fillRect(0, 0, W, H); vignette(ctx);
    // estrelas: pontos de malha esparsos
    const L = D.LA; ctx.fillStyle = '#fff';
    for (let i = 0; i < L.length; i += 7) { const tw = .5 + .5 * Math.sin(t * 3 + i); ctx.globalAlpha = .55 * tw * seg(t, .3, 1.6) * (1 - seg(t, 6, 6.8)); ctx.beginPath(); ctx.arc(L[i].x, L[i].y, 2.4, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
    const P = R.flatMap(r => r.ptsA);
    const pr = seg(t, 2.4, 2.4 + P.length * .35);
    ctx.strokeStyle = T.ac; ctx.lineWidth = 2.5; ctx.globalAlpha = 1 - seg(t, 6, 6.8);
    ctx.beginPath();
    for (let i = 0; i < P.length; i++) { const lim = pr * P.length - i; if (lim <= 0) break; if (i === 0) ctx.moveTo(P[0].x, P[0].y); else { const q = mid(P[i - 1], P[i], clamp(lim)); ctx.lineTo(q.x, q.y); } }
    ctx.stroke();
    P.forEach((q, i) => { const p = clamp(pr * P.length - i + 1); if (p <= 0) return; ctx.beginPath(); ctx.arc(q.x, q.y, 10 * E.back(p), 0, 7); ctx.fillStyle = T.ac; ctx.fill(); ctx.beginPath(); ctx.arc(q.x, q.y, 22 * p, 0, 7); ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 1.5; ctx.stroke(); });
    ctx.globalAlpha = 1;
    hook(ctx, D, t, 0, 2.4);
    R.forEach((r, i) => { const p = seg(t, 2.6 + i * .4, 3 + i * .4) * (1 - seg(t, 5.8, 6.2)); txt(ctx, r.reg.nome.toUpperCase(), CX, 1430 + i * 0, { alpha: 0 }); });
    const lab = R.map(r => r.reg.nome).join('  ✦  ');
    ctx.save(); ctx.globalAlpha = seg(t, 3, 3.6) * (1 - seg(t, 5.8, 6.2)); para(ctx, lab, CX, 1560, 940, 42, { font: font(T, 'sans', 30, 700), color: T.ink }); ctx.restore();
    tag(ctx, D, 'DEPOIS', CX, 1560, seg(t, 6.6, 7));
  },
};

ST.respiracao = {
  nome: 'Respiração', desc: 'Transição lenta e suave',
  dur: () => 9,
  cues: () => [3],
  draw(ctx, D, t) {
    const T = D.T;
    const b = E.sine(seg(t, 2.6, 5.4)) - E.sine(seg(t, 6.2, 7.6)) * 0; // vai para o depois
    const z = 1 + .05 * Math.sin(t / 9 * Math.PI);
    face(ctx, D.A, z, CX, EYE_Y + 150, CX, EYE_Y + 150);
    face(ctx, D.B, z, CX, EYE_Y + 150, CX, EYE_Y + 150, b);
    vignette(ctx, .4, .8);
    titulo(ctx, D, D.hook1, 300, T.upper ? 100 : 100, seg(t, .3, 1.1) * (1 - seg(t, 7.6, 8.2)), { d3: true });
    titulo(ctx, D, D.hook2, T.upper ? 410 : 400, T.upper ? 100 : 100, seg(t, .5, 1.3) * (1 - seg(t, 7.6, 8.2)), { color: T.ac, d3: true });
    tag(ctx, D, b < .5 ? 'ANTES' : 'DEPOIS', CX, 1560, 1);
  },
};

ST.zoomreg = {
  nome: 'Câmera nas regiões', desc: 'Zoom em cada área tratada',
  dur: D => 2.4 + Math.max(1, D.regs.length) * 2.1 + 1.6,
  cues: D => D.regs.map((_, i) => 2.4 + i * 2.1),
  draw(ctx, D, t) {
    const T = D.T, R = regList(D);
    const n = R.length, tEnd = 2.4 + n * 2.1;
    if (t < 2.4 || !n) {
      face(ctx, D.A, 1, CX, H / 2, CX, H / 2); vignette(ctx); hook(ctx, D, t, 0, 2.4); return;
    }
    if (t >= tEnd) { // volta para o rosto inteiro com depois
      const p = E.io(seg(t, tEnd, tEnd + .8));
      const last = R[n - 1].ptsA[0];
      const s = lerp(1.9, 1, p), f = mid(last, pt(CX, H / 2), p);
      face(ctx, D.B, s, f.x, f.y, CX, H / 2); vignette(ctx); tag(ctx, D, 'DEPOIS', CX, 1560, seg(t, tEnd + .5, tEnd + .9)); return;
    }
    const k = Math.floor((t - 2.4) / 2.1), lt = t - 2.4 - k * 2.1;
    const r = R[k], q = r.ptsA.length > 1 ? mid(r.ptsA[0], r.ptsA[1], 0) : r.ptsA[0];
    const fromP = k === 0 ? pt(CX, H / 2) : (R[k - 1].ptsA[0]);
    const mv = E.io(seg(lt, 0, .6));
    const s = k === 0 ? lerp(1, 1.9, mv) : 1.9;
    const f = mid(fromP, q, mv);
    const showB = E.io(seg(lt, .9, 1.4));
    face(ctx, D.A, s, f.x, f.y, CX, H / 2 - 80);
    face(ctx, D.B, s, f.x, f.y, CX, H / 2 - 80, showB);
    vignette(ctx, .5, .95);
    const lab = (T.upper ? r.reg.nome.toUpperCase() : r.reg.nome);
    txt(ctx, String(k + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'), CX, 1430, { font: font(T, 'mono', 26, 700), color: T.ac, ls: 6, alpha: seg(lt, .3, .6) });
    txt(ctx, lab, CX, 1530, { font: font(T, 'disp', T.upper ? 100 : 96), color: T.ink, shadow: 'rgba(0,0,0,.6)', depth: T.upper ? 6 : 0, depthColor: T.dark, alpha: E.out(seg(lt, .3, .7)), maxW: 940 });
    if (D.showMl && D.ml[r.reg.id]) txt(ctx, mlLabel(D, r.reg.id), CX, 1590, { font: font(T, 'mono', 30, 700), color: T.ac, alpha: seg(lt, .5, .8) });
    tag(ctx, D, showB > .5 ? 'DEPOIS' : 'ANTES', CX, 1700, seg(lt, .4, .7));
  },
};

ST.perfil = {
  nome: 'Frente + perfil', desc: 'Usa as fotos de perfil também',
  needsProfile: true,
  dur: () => 10,
  cues: () => [2, 5],
  draw(ctx, D, t) {
    const T = D.T;
    if (t < 5 || !D.PA) { ST.cortina.draw.call(ST.cortina, ctx, D, Math.min(t, 5.4) * (5.4 / 5)); return; }
    ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
    const pw = 520, ph = 1150, y0 = 420, pp = E.out(seg(t, 5, 5.8));
    [[D.PA, 'ANTES', 14], [D.PB, 'DEPOIS', W - 14 - pw]].forEach(([fr, lab, x], k) => {
      const p = E.out(seg(t, 5 + k * .4, 5.8 + k * .4)); if (p <= 0) return;
      ctx.save(); ctx.globalAlpha = p; rr(ctx, x, y0, pw, ph, 22); ctx.clip();
      face(ctx, fr, .82, CX, H / 2, x + pw / 2, y0 + ph / 2); ctx.restore();
      tag(ctx, D, lab, x + pw / 2, y0 + ph - 30, p);
    });
    titulo(ctx, D, 'De perfil', 300, T.upper ? 110 : 104, pp, { d3: true });
  },
};


/* ================= v2: malha triangulada, efeitos novos ================= */
const BORDER = (() => { const b = []; const xs = [-400, W * .25, W * .5, W * .75, W + 400], ys = [-400, H * .25, H * .5, H * .75, H + 400];
  xs.forEach(x => { b.push(pt(x, -400)); b.push(pt(x, H + 400)); }); [H * .25, H * .5, H * .75].forEach(y => { b.push(pt(-400, y)); b.push(pt(W + 400, y)); }); return b; })();
function delaunay(P) {
  const n = P.length; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const p of P) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
  const d = Math.max(x1 - x0, y1 - y0) * 20, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const pts = P.concat([pt(mx - d, my - d), pt(mx, my + d), pt(mx + d, my - d)]);
  const mkT = (a, b, c) => { const A = pts[a], B = pts[b], C = pts[c]; const D2 = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) || 1e-9;
    const ux = ((A.x * A.x + A.y * A.y) * (B.y - C.y) + (B.x * B.x + B.y * B.y) * (C.y - A.y) + (C.x * C.x + C.y * C.y) * (A.y - B.y)) / D2;
    const uy = ((A.x * A.x + A.y * A.y) * (C.x - B.x) + (B.x * B.x + B.y * B.y) * (A.x - C.x) + (C.x * C.x + C.y * C.y) * (B.x - A.x)) / D2;
    return { v: [a, b, c], x: ux, y: uy, r: (A.x - ux) ** 2 + (A.y - uy) ** 2 }; };
  let tris = [mkT(n, n + 1, n + 2)];
  for (let i = 0; i < n; i++) {
    const p = pts[i]; const bad = [], keep = [];
    for (const t of tris) ((p.x - t.x) ** 2 + (p.y - t.y) ** 2 < t.r ? bad : keep).push(t);
    const cnt = new Map();
    for (const t of bad) for (let k = 0; k < 3; k++) { const a = t.v[k], b = t.v[(k + 1) % 3]; const key = a < b ? a + '_' + b : b + '_' + a; cnt.set(key, (cnt.get(key) || 0) + 1); }
    for (const t of bad) for (let k = 0; k < 3; k++) { const a = t.v[k], b = t.v[(k + 1) % 3]; const key = a < b ? a + '_' + b : b + '_' + a; if (cnt.get(key) === 1) keep.push(mkT(a, b, i)); }
    tris = keep;
  }
  return tris.filter(t => t.v.every(v => v < n)).flatMap(t => t.v);
}
let TRI = null, TRIF = null;
function tris() {
  if (TRI) return TRI;
  const C = window.CANON; if (!C) return null;
  const P = C.slice(0, 468).concat(BORDER);
  TRI = delaunay(P);
  TRIF = []; for (let i = 0; i < TRI.length; i += 3) if (TRI[i] < 468 && TRI[i + 1] < 468 && TRI[i + 2] < 468) TRIF.push(TRI[i], TRI[i + 1], TRI[i + 2]);
  return TRI;
}
const extL = L => L.slice(0, 468).concat(BORDER);
function warpTri(ctx, img, s0, s1, s2, d0, d1, d2) {
  const ux = s1.x - s0.x, uy = s1.y - s0.y, vx = s2.x - s0.x, vy = s2.y - s0.y; const det = ux * vy - vx * uy; if (Math.abs(det) < 1e-6) return;
  const px = d1.x - d0.x, py = d1.y - d0.y, qx = d2.x - d0.x, qy = d2.y - d0.y;
  const a = (px * vy - qx * uy) / det, c = (-px * vx + qx * ux) / det, b = (py * vy - qy * uy) / det, d = (-py * vx + qy * ux) / det;
  const e = d0.x - a * s0.x - c * s0.y, f = d0.y - b * s0.x - d * s0.y;
  const cx = (d0.x + d1.x + d2.x) / 3, cy = (d0.y + d1.y + d2.y) / 3, g = q => { const dx = q.x - cx, dy = q.y - cy, l = Math.hypot(dx, dy) || 1; return pt(q.x + dx / l * .9, q.y + dy / l * .9); };
  const A = g(d0), B = g(d1), C = g(d2);
  ctx.save(); ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath(); ctx.clip();
  ctx.transform(a, b, c, d, e, f); ctx.drawImage(img, 0, 0, W, H); ctx.restore();
}
// desenha img (quadro alinhado, com malha Ls) deformada para Ld; só rosto (face=true) ou tudo
function warp(ctx, img, Ls, Ld, alpha = 1, face = true) {
  if (!tris() || alpha <= 0) return;
  const T = face ? TRIF : TRI, S = face ? Ls : extL(Ls), Dd = face ? Ld : extL(Ld);
  ctx.save(); ctx.globalAlpha *= alpha;
  for (let i = 0; i < T.length; i += 3) warpTri(ctx, img, S[T[i]], S[T[i + 1]], S[T[i + 2]], Dd[T[i]], Dd[T[i + 1]], Dd[T[i + 2]]);
  ctx.restore();
}
const lerpL = (A, B, s) => A.map((p, i) => ({ x: lerp(p.x, B[i].x, s), y: lerp(p.y, B[i].y, s), z: lerp(p.z || 0, B[i].z || 0, s) }));
function rot3(L, yaw, pitch, cx = CX, cy = EYE_Y + 200) {
  const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  return L.map(p => { const x = p.x - cx, y = p.y - cy, z = Math.min(0, p.z || 0) * 1.2; const x1 = x * cyw - z * syw, z1 = x * syw + z * cyw; const y1 = y * cp - z1 * sp; return { x: cx + x1, y: cy + y1, z: z1 }; });
}
function meshLines(ctx, L, color, alpha, w = 1) {
  if (!L || alpha <= 0 || !window.TESS) return; const t = window.TESS;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath();
  for (let i = 0; i < t.length; i += 2) { const p = L[t[i]], q = L[t[i + 1]]; if (p && q) { ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); } }
  ctx.stroke(); ctx.restore();
}
function regChips(ctx, D, y, alpha) {
  if (alpha <= 0) return; const T = D.T;
  const items = D.regs.map(id => REG[id].nome + (D.showMl && D.ml[id] ? ' · ' + mlLabel(D, id) : ''));
  ctx.save(); ctx.globalAlpha *= alpha; ctx.font = font(T, 'sans', 28, 700);
  const rows = [[]]; let w = 0; items.forEach(s => { const sw = ctx.measureText(s).width + 52; if (w + sw > 960 && rows[rows.length - 1].length) { rows.push([]); w = 0; } rows[rows.length - 1].push([s, sw]); w += sw + 12; });
  rows.forEach((r, ri) => { const tw = r.reduce((a, b) => a + b[1] + 12, -12); let x = CX - tw / 2; r.forEach(([s, sw], k) => {
    const e = E.out(clamp(alpha * 2 - (ri * r.length + k) * .12)); ctx.globalAlpha = alpha * e;
    ctx.fillStyle = 'rgba(15,11,8,.66)'; rr(ctx, x, y + ri * 70 - 42 + (1 - e) * 16, sw, 56, 28); ctx.fill(); ctx.strokeStyle = T.ac; ctx.lineWidth = 1.5; ctx.stroke();
    txt(ctx, s, x + sw / 2, y + ri * 70 - 5 + (1 - e) * 16, { font: font(T, 'sans', 28, 700), color: T.ink }); x += sw + 12; }); });
  ctx.restore();
}

ST.morph = {
  nome: 'Morph de malha', desc: 'O antes vira o depois pelos 478 pontos',
  dur: () => 9.6,
  cues: () => [2.2, 6.6, 7.8],
  draw(ctx, D, t) {
    const T = D.T;
    const s = t < 2.2 ? 0 : t < 5.4 ? E.io(seg(t, 2.2, 5.4)) : t < 6.6 ? 1 : t < 7.6 ? 1 - E.io(seg(t, 6.6, 7.6)) : E.io(seg(t, 7.8, 8.8));
    const P = lerpL(D.LA, D.LB, s);
    face(ctx, D.A, 1, CX, H / 2, CX, H / 2); face(ctx, D.B, 1, CX, H / 2, CX, H / 2, s);
    if (s > 0 && s < 1) { warp(ctx, D.A, D.LA, P, 1); warp(ctx, D.B, D.LB, P, s); }
    vignette(ctx);
    const meshA = (t < 2.2 ? seg(t, .6, 2) : 1) * (1 - seg(t, 5.2, 6)) * .55 + (t > 6.6 && t < 8.8 ? Math.sin(seg(t, 6.6, 8.8) * Math.PI) * .35 : 0);
    meshLines(ctx, P, T.ac, meshA, 1);
    malha(ctx, D, P, 478, T.ink, meshA * .9, 1.8);
    hook(ctx, D, t, 0, 2.2);
    // barra de progresso do morph
    const ba = seg(t, 2.2, 2.6) * (1 - seg(t, 8.9, 9.4));
    if (ba > 0) { ctx.save(); ctx.globalAlpha = ba; ctx.fillStyle = 'rgba(255,255,255,.2)'; rr(ctx, 190, 1560, 700, 8, 4); ctx.fill(); ctx.fillStyle = T.ac; rr(ctx, 190, 1560, 700 * s, 8, 4); ctx.fill();
      txt(ctx, 'ANTES', 190, 1530, { font: font(T, 'mono', 24, 700), color: T.ink, align: 'left', ls: 4, alpha: 1 - s * .6 }); txt(ctx, 'DEPOIS', 890, 1530, { font: font(T, 'mono', 24, 700), color: T.ink, align: 'right', ls: 4, alpha: .4 + s * .6 });
      ctx.beginPath(); ctx.arc(190 + 700 * s, 1564, 16, 0, 7); ctx.fillStyle = T.ac; ctx.fill(); ctx.restore(); }
    regChips(ctx, D, 1440, seg(t, 5.5, 6.2) * (1 - seg(t, 6.5, 6.8)));
  },
};

ST.camera25d = {
  nome: 'Câmera 2,5D', desc: 'Rosto com profundidade e câmera girando',
  dur: () => 9.4,
  cues: () => [2.0, 4.6],
  draw(ctx, D, t) {
    const T = D.T;
    const isB = t >= 4.6, lt = isB ? t - 4.6 : t;
    const yaw = (isB ? lerp(.14, -.14, E.io(seg(lt, 0, 4.4))) : lerp(-.14, .14, E.io(seg(lt, 0, 4.6)))) * (1 - seg(t, 8.4, 9.2));
    const pitch = .05 * Math.sin(t * .9);
    const L0 = isB ? D.LB : D.LA, img = isB ? D.B : D.A;
    const L1 = rot3(L0, yaw, pitch);
    const z = 1.04 + .06 * seg(t, 0, 9.4);
    ctx.save(); ctx.translate(CX, H / 2); ctx.scale(z, z); ctx.translate(-CX, -H / 2);
    // fundo com paralaxe (move ao contrário)
    face(ctx, img, 1, CX, H / 2, CX, H / 2);
    warp(ctx, img, L0, L1, 1, false);
    ctx.restore();
    // flash de troca
    const fl = 1 - seg(t, 4.6, 5.0); if (t > 4.4 && fl > 0) { ctx.fillStyle = `rgba(255,255,255,${(t < 4.6 ? seg(t, 4.4, 4.6) : fl) * .55})`; ctx.fillRect(0, 0, W, H); }
    vignette(ctx);
    // grade de profundidade sutil
    ctx.save(); ctx.globalAlpha = .18; ctx.strokeStyle = T.ac; ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(CX + i * 120 - yaw * 400, 1380); ctx.lineTo(CX + i * 260 - yaw * 900, H); ctx.stroke(); }
    for (let j = 0; j < 5; j++) { const y = 1380 + j * j * 26; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
    hook(ctx, D, t, 0, 2.2);
    tag(ctx, D, isB ? 'DEPOIS' : 'ANTES', CX, 1560, isB ? seg(t, 4.8, 5.2) : seg(t, 2, 2.4) * (1 - seg(t, 4.3, 4.6)));
    regChips(ctx, D, 1400, seg(t, 6.2, 6.9) * (1 - seg(t, 8.6, 9.1)));
  },
};

ST.scanner = {
  nome: 'Raio de luz', desc: 'Faixa de luz revela o depois',
  dur: () => 9.8,
  cues: () => [2.2, 5.4, 7.4],
  draw(ctx, D, t) {
    const T = D.T, top = 220, bot = 1720;
    let y, dirDown = true, on = true;
    if (t < 2.2) { y = top; on = false; }
    else if (t < 4.6) y = lerp(top, bot, E.io(seg(t, 2.2, 4.6)));
    else if (t < 5.4) { y = bot; on = false; }
    else if (t < 7.0) { y = lerp(bot, top + 200, E.io(seg(t, 5.4, 7.0))); dirDown = false; }
    else if (t < 7.4) { y = top + 200; on = false; dirDown = false; }
    else if (t < 8.4) y = lerp(top + 200, bot, E.io(seg(t, 7.4, 8.4)));
    else { y = bot; on = false; }
    // acima da linha: depois (quando descendo) ; ao subir, abaixo mostra depois
    face(ctx, D.A, 1.02, CX, EYE_Y + 150, CX, EYE_Y + 150);
    ctx.save(); ctx.beginPath();
    if (dirDown) ctx.rect(0, 0, W, Math.max(0, y)); else ctx.rect(0, y, W, H - y);
    if (t < 2.2) { ctx.restore(); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 0, 0); }
    ctx.clip(); face(ctx, D.B, 1.02, CX, EYE_Y + 150, CX, EYE_Y + 150); ctx.restore();
    vignette(ctx);
    if (t >= 2.2 && t <= 8.6) {
      // faixa luminosa
      const g = ctx.createLinearGradient(0, y - 140, 0, y + 140);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, T.ac); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save(); ctx.globalAlpha = on ? .5 : .25; ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(0, y - 140, W, 280); ctx.restore();
      ctx.fillStyle = '#fff'; ctx.globalAlpha = .9; ctx.fillRect(0, y - 1.5, W, 3); ctx.globalAlpha = 1;
      // pontos da malha acendem perto da faixa
      const L = D.LB; ctx.fillStyle = T.ink;
      for (let i = 0; i < L.length; i += 2) { const dd = Math.abs(L[i].y - y); if (dd < 90) { ctx.globalAlpha = (1 - dd / 90) * .95; ctx.beginPath(); ctx.arc(L[i].x, L[i].y, 2.6, 0, 7); ctx.fill(); } }
      ctx.globalAlpha = 1;
      txt(ctx, 'SCAN ' + String(Math.round(seg(y, top, bot) * 100)).padStart(3, '0') + '%', W - 60, y - 18, { font: font(T, 'mono', 22, 700), color: T.ink, align: 'right', ls: 3 });
    }
    hook(ctx, D, t, 0, 2.2);
    const showB = (t > 4.6 && t < 5.4) || t > 8.4;
    tag(ctx, D, 'DEPOIS', CX, 1560, showB ? seg(t, t > 8.4 ? 8.4 : 4.6, t > 8.4 ? 8.7 : 4.9) : 0);
    // regiões acendem quando a luz passa
    if (t > 7.4) { const R = regList(D), LY = cardLayout(R, 'ptsB'); R.forEach((r, i) => { const py = Math.min(...r.ptsB.map(q => q.y)); regCard(ctx, D, i, r.reg, r.ptsB, seg(y, py - 40, py + 60) * (1 - seg(t, 9.3, 9.7)), LY[i]); }); }
  },
};

ST.diagonal = {
  nome: 'Diagonal giratória', desc: 'Corte diagonal que gira e troca os lados',
  dur: () => 9.2,
  cues: () => [2.2, 4.4, 6.8],
  draw(ctx, D, t) {
    const T = D.T, cx = CX, cy = EYE_Y + 230;
    const ang = (t < 4.4 ? -55 : lerp(-55, 125, E.io(seg(t, 4.4, 6.8)))) * Math.PI / 180;
    const enter = E.io(seg(t, 2.2, 3.2)); // linha entra do canto
    const off = (1 - enter) * 1600;
    const nx = -Math.sin(ang), ny = Math.cos(ang); // normal
    const ox = cx + nx * off, oy = cy + ny * off;
    face(ctx, D.A, 1.03, CX, EYE_Y + 150, CX, EYE_Y + 150);
    if (t >= 2.2) {
      ctx.save(); ctx.beginPath();
      const L = 3000, dx = Math.cos(ang) * L, dy = Math.sin(ang) * L;
      ctx.moveTo(ox - dx, oy - dy); ctx.lineTo(ox + dx, oy + dy); ctx.lineTo(ox + dx + nx * L, oy + dy + ny * L); ctx.lineTo(ox - dx + nx * L, oy - dy + ny * L); ctx.closePath(); ctx.clip();
      face(ctx, D.B, 1.03, CX, EYE_Y + 150, CX, EYE_Y + 150); ctx.restore();
    }
    vignette(ctx);
    if (t >= 2.2) {
      const L = 3000, dx = Math.cos(ang) * L, dy = Math.sin(ang) * L;
      ctx.save(); ctx.shadowColor = T.ac; ctx.shadowBlur = 30; ctx.strokeStyle = T.ac; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ox - dx, oy - dy); ctx.lineTo(ox + dx, oy + dy); ctx.stroke(); ctx.restore();
      // rótulos de cada lado, perpendiculares à linha
      const la = seg(t, 3.0, 3.4);
      const pA = pt(ox - nx * 230 + Math.cos(ang) * 420, oy - ny * 230 + Math.sin(ang) * 420), pB = pt(ox + nx * 230 + Math.cos(ang) * 420, oy + ny * 230 + Math.sin(ang) * 420);
      const clampP = p => pt(clamp(p.x, 170, W - 170), clamp(p.y, 300, 1640));
      tag(ctx, D, 'ANTES', clampP(pA).x, clampP(pA).y, la); tag(ctx, D, 'DEPOIS', clampP(pB).x, clampP(pB).y, la);
      ctx.beginPath(); ctx.arc(ox, oy, 26, 0, 7); ctx.fillStyle = T.ac; ctx.fill(); ctx.beginPath(); ctx.arc(ox, oy, 9, 0, 7); ctx.fillStyle = '#111'; ctx.fill();
    }
    hook(ctx, D, t, 0, 2.2);
    regChips(ctx, D, 1420, seg(t, 7.2, 7.9) * (1 - seg(t, 8.8, 9.2)));
  },
};

// Lupa refeita: lente percorre cada região; dentro, o antes vira depois com uma cortina
ST.lupa = {
  nome: 'Lupa', desc: 'Lente aproxima cada região',
  dur: D => 2.4 + Math.max(1, D.regs.length) * 2.3 + 1.4,
  cues: D => D.regs.map((_, i) => 2.4 + i * 2.3 + 1.0),
  draw(ctx, D, t) {
    const T = D.T, R = regList(D), n = R.length;
    face(ctx, D.A, 1, CX, H / 2, CX, H / 2);
    ctx.fillStyle = 'rgba(10,8,6,.42)'; ctx.fillRect(0, 0, W, H); vignette(ctx);
    hook(ctx, D, t, 0, 2.4);
    if (!n) return;
    const tEnd = 2.4 + n * 2.3;
    if (t < 2.2) return;
    const k = clamp(Math.floor((t - 2.4) / 2.3), 0, n - 1), lt = t - 2.4 - k * 2.3;
    const cen = r => { const p = r.ptsA.length > 1 ? (r.ptsA[0].x < CX ? r.ptsA[0] : r.ptsA[1]) : r.ptsA[0]; return p; };
    const cur = cen(R[k]), prev = k ? cen(R[k - 1]) : pt(CX, EYE_Y + 200);
    const c = t >= tEnd ? cur : mid(prev, cur, E.io(seg(lt, 0, .6)));
    let lr = 240 * E.back(seg(t, 2.2, 2.8));
    let wipe = t >= tEnd ? 1 : E.io(seg(lt, .9, 1.5));
    if (t >= tEnd) lr = lerp(240, 1500, E.io(seg(t, tEnd, tEnd + .9)));
    const zoom = t >= tEnd ? lerp(2, 1, E.io(seg(t, tEnd, tEnd + .9))) : 2;
    ctx.save(); ctx.beginPath(); ctx.arc(c.x, c.y, lr, 0, 7); ctx.clip();
    face(ctx, D.A, zoom, c.x, c.y, c.x, c.y);
    ctx.beginPath(); ctx.rect(c.x - lr, c.y - lr, lr * 2 * wipe, lr * 2); ctx.clip();
    face(ctx, D.B, zoom, c.x, c.y, c.x, c.y);
    ctx.restore();
    if (t < tEnd) {
      if (wipe > 0 && wipe < 1) { ctx.fillStyle = T.ac; ctx.fillRect(c.x - lr + lr * 2 * wipe - 2, c.y - lr, 4, lr * 2); }
      ctx.beginPath(); ctx.arc(c.x, c.y, lr, 0, 7); ctx.strokeStyle = T.ac; ctx.lineWidth = 8; ctx.stroke();
      ctx.beginPath(); ctx.arc(c.x, c.y, lr + 16, 0, 7); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.stroke();
      const lab = (T.upper ? R[k].reg.nome.toUpperCase() : R[k].reg.nome);
      const ly = c.y + lr + 110 > 1690 ? c.y - lr - 60 : c.y + lr + 100;
      const la = E.out(seg(lt, .3, .7));
      txt(ctx, String(k + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'), CX, ly - (T.upper ? 100 : 92), { font: font(T, 'mono', 24, 700), color: T.ac, ls: 6, alpha: la });
      txt(ctx, lab, CX, ly, { font: font(T, 'disp', T.upper ? 84 : 84), color: T.ink, shadow: 'rgba(0,0,0,.7)', depth: T.upper ? 6 : 0, depthColor: T.dark, maxW: 940, alpha: la });
      txt(ctx, (wipe > .5 ? 'DEPOIS' : 'ANTES') + (D.showMl && D.ml[R[k].reg.id] ? ' · ' + mlLabel(D, R[k].reg.id) : ''), CX, ly + 56, { font: font(T, 'mono', 26, 700), color: T.ac, ls: 6, alpha: la });
    } else tag(ctx, D, 'DEPOIS', CX, 1560, seg(t, tEnd + .6, tEnd + 1));
  },
};

// Relevo: malha do rosto sombreada por luz rasante (ilustrativo, não é medida de volume)
ST.relevo = {
  nome: 'Relevo 3D', desc: 'Luz rasante mostra o volume do rosto',
  dur: () => 9.8,
  cues: () => [2.2, 4.8, 6.6],
  draw(ctx, D, t) {
    const T = D.T;
    const s = E.io(seg(t, 4.8, 6.4));
    const P = lerpL(D.LA, D.LB, s);
    face(ctx, D.A, 1.02, CX, EYE_Y + 150, CX, EYE_Y + 150);
    face(ctx, D.B, 1.02, CX, EYE_Y + 150, CX, EYE_Y + 150, s);
    const ra = seg(t, 2.0, 3.0) * (1 - seg(t, 8.4, 9.4));
    ctx.fillStyle = `rgba(8,6,4,${.55 * ra})`; ctx.fillRect(0, 0, W, H);
    vignette(ctx);
    if (ra > 0 && tris()) {
      // luz gira de um lado ao outro (rasante)
      const ang = t < 4.8 ? lerp(-1.1, 1.1, E.io(seg(t, 2.0, 4.8))) : t < 6.6 ? 1.1 : lerp(1.1, -1.1, E.io(seg(t, 6.6, 8.6)));
      const lx = Math.sin(ang), ly = -.35, lz = -Math.cos(ang) * .9; const ll = Math.hypot(lx, ly, lz);
      const Lx = lx / ll, Ly = ly / ll, Lz = lz / ll;
      const Pz = s > 0 && s < 1 ? P : (s >= 1 ? D.LB : D.LA);
      const col = T.ac, rgb = [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)];
      ctx.save(); ctx.translate(CX, EYE_Y + 150); ctx.scale(1.02, 1.02); ctx.translate(-CX, -(EYE_Y + 150));
      if (!ST.relevo.F) { // triângulos do rosto sem os "grandes" que atravessam olhos e boca
        const C = window.CANON, F0 = TRIF, out = [];
        for (let i = 0; i < F0.length; i += 3) { const a = C[F0[i]], b = C[F0[i + 1]], c = C[F0[i + 2]]; const m = Math.max(Math.hypot(a.x - b.x, a.y - b.y), Math.hypot(b.x - c.x, b.y - c.y), Math.hypot(a.x - c.x, a.y - c.y)); if (m < 125) out.push(F0[i], F0[i + 1], F0[i + 2]); }
        ST.relevo.F = out;
      }
      const F = ST.relevo.F, dots = new Float32Array(F.length / 3);
      for (let i = 0, j = 0; i < F.length; i += 3, j++) {
        const a = Pz[F[i]], b = Pz[F[i + 1]], c = Pz[F[i + 2]];
        const ux = b.x - a.x, uy = b.y - a.y, uz = ((b.z || 0) - (a.z || 0)) * 1.4, vx = c.x - a.x, vy = c.y - a.y, vz = ((c.z || 0) - (a.z || 0)) * 1.4;
        let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
        if (nz > 0) { nx = -nx; ny = -ny; nz = -nz; }
        dots[j] = -(nx * Lx + ny * Ly + nz * Lz);
      }
      const srt = Array.from(dots).sort((p, q) => p - q), lo = srt[Math.floor(srt.length * .05)], hi = srt[Math.floor(srt.length * .97)];
      for (let i = 0, j = 0; i < F.length; i += 3, j++) {
        const a = Pz[F[i]], b = Pz[F[i + 1]], c = Pz[F[i + 2]];
        const k = clamp((dots[j] - lo) / Math.max(.0001, hi - lo));
        const kk = k * k;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath();
        ctx.fillStyle = `rgba(${Math.round(lerp(14, rgb[0], kk) + 60 * Math.max(0, k - .85) / .15)},${Math.round(lerp(10, rgb[1], kk) + 60 * Math.max(0, k - .85) / .15)},${Math.round(lerp(8, rgb[2], kk))},${(.55 + .35 * kk) * ra})`;
        ctx.fill(); ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = .8; ctx.stroke();
      }
      // malha fina por cima
      meshLines(ctx, Pz, 'rgba(255,255,255,.9)', .07 * ra, .6);
      ctx.restore();
      // regiões tratadas pulsando
      if (t > 6.4) { const R = regList(D); R.forEach((r, i) => r.ptsB.forEach(q => { const pp = (t * .8 + i * .2) % 1; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (.5 + pp * .8), 0, 7); ctx.strokeStyle = `rgba(255,255,255,${(1 - pp) * .7 * ra})`; ctx.lineWidth = 3; ctx.stroke(); })); }
      txt(ctx, 'RELEVO ILUSTRATIVO · LUZ RASANTE', CX, 1660, { font: font(T, 'mono', 22, 700), color: T.sub, ls: 4, alpha: ra * .9 });
    }
    hook(ctx, D, t, 0, 2.2);
    tag(ctx, D, s < .5 ? 'ANTES' : 'DEPOIS', CX, 1560, seg(t, 2.4, 2.8));
    regChips(ctx, D, 1420, seg(t, 6.8, 7.4) * (1 - seg(t, 8.8, 9.3)));
  },
};
['lado', 'vaivolta', 'linhameio', 'polaroid', 'editorial', 'tresatos', 'topografia', 'constelacao', 'respiracao', 'perfil'].forEach(k => ST[k].hidden = true);
// ordem de exibição
const ORDEM = ['cortina', 'morph', 'relevo', 'hightech', 'camera25d', 'zoomreg', 'scanner', 'lupa', 'diagonal'];

/* ================= modo cirúrgico ================= */
function desat(ctx, amt) { // tira cor de cenas fortes (funciona no Safari: modo de mistura)
  if (amt <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.globalAlpha = amt; ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.save(); ctx.globalAlpha = amt * .18; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function cover(ctx, src, sw, sh, z = 1, fx = .5, fy = .5) {
  if (!src || !sw) return; const s0 = Math.max(W / sw, H / sh) * z; const w = sw * s0, h = sh * s0;
  ctx.drawImage(src, (W - w) * fx, (H - h) * fy, w, h);
}
function cirSegs(D) {
  const segs = []; let t = 0; const PC = D.PC || []; const has = (D.clips && D.clips.length) || PC.length;
  if (D.sens && has) { segs.push({ type: 'aviso', t0: t, t1: t + 1.4 }); t += 1.4; }
  segs.push({ type: 'antes', t0: t, t1: t + 2.6 }); t += 2.6;
  if (D.PA) { segs.push({ type: 'antes2', t0: t, t1: t + 2 }); t += 2; }
  (D.clips || []).forEach((c, i) => { const d = c.dur; segs.push({ type: 'clip', clip: c, i, t0: t, t1: t + d }); t += d; });
  PC.forEach((fr, i) => { const d = i ? 1.8 : 2.8; segs.push({ type: 'peca', fr, i, n: PC.length, t0: t, t1: t + d }); t += d; });
  segs.push({ type: 'depois', t0: t, t1: t + 2.8 }); t += 2.8;
  if (D.PB) { segs.push({ type: 'depois2', t0: t, t1: t + 2 }); t += 2; }
  segs.push({ type: 'split', t0: t, t1: t + 2.8 }); t += 2.8;
  return segs;
}
ST.cirurgia = {
  nome: 'Cirurgia em etapas', desc: 'Antes, procedimento, peça, cicatriz',
  dur: D => cirSegs(D).reduce((a, s2) => Math.max(a, s2.t1), 0),
  cues: D => cirSegs(D).map(s2 => s2.t0).filter(x => x > 0),
  draw(ctx, D, t) {
    const T = D.T, segs = cirSegs(D);
    const sg = segs.find(s2 => t >= s2.t0 && t < s2.t1) || segs[segs.length - 1];
    const lt = t - sg.t0, d = sg.t1 - sg.t0, ein = E.out(seg(lt, 0, .35));
    ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
    const z = 1.02 + .06 * seg(lt, 0, d);
    if (sg.type === 'aviso') {
      ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, H);
      txt(ctx, 'AVISO', CX, 820, { font: font(T, 'mono', 34, 700), color: T.ac, ls: 12, alpha: ein });
      titulo(ctx, D, T.upper ? 'IMAGENS DE' : 'Imagens de', 960, T.upper ? 96 : 90, seg(lt, .1, .5));
      titulo(ctx, D, T.upper ? 'PROCEDIMENTO' : 'procedimento médico', T.upper ? 1070 : 1060, T.upper ? 96 : 90, seg(lt, .2, .6), { color: T.ac });
      txt(ctx, 'conteúdo educativo', CX, 1170, { font: font(T, 'sans', 30, 500), color: T.sub, alpha: seg(lt, .4, .8) });
      return;
    }
    if (sg.type === 'antes') {
      face(ctx, D.A, z, CX, H / 2, CX, H / 2); vignette(ctx);
      hook(ctx, D, lt, 0, d + 2);
      if (D.local) kicker(ctx, D, D.local, 1300, seg(lt, .5, .9));
      tag(ctx, D, 'ANTES', CX, 1560, seg(lt, .3, .7));
    } else if (sg.type === 'clip') {
      const c = sg.clip; const el = c.el;
      if (el && el.videoWidth) cover(ctx, el, el.videoWidth, el.videoHeight, 1.02 + .04 * seg(lt, 0, d));
      if (D.sens) desat(ctx, .65);
      vignette(ctx, .5, .85);
      kicker(ctx, D, 'Etapa ' + (sg.i + 1), 330, seg(lt, .1, .4));
      titulo(ctx, D, c.label || 'Procedimento', 470, T.upper ? 100 : 96, seg(lt, .15, .55), { d3: true });
    } else if (sg.type === 'antes2') {
      face(ctx, D.PA, z, CX, H / 2, CX, H / 2); vignette(ctx);
      kicker(ctx, D, 'Outro ângulo', 330, seg(lt, .1, .4));
      tag(ctx, D, 'ANTES', CX, 1560, seg(lt, .3, .7));
    } else if (sg.type === 'peca') {
      face(ctx, sg.fr, z, CX, H / 2, CX, H / 2); if (D.sens) desat(ctx, .55); vignette(ctx);
      kicker(ctx, D, 'Peça retirada' + (sg.n > 1 ? ' · ' + (sg.i + 1) + '/' + sg.n : ''), 330, seg(lt, .1, .4));
      if (D.tam && sg.i === 0) titulo(ctx, D, D.tam, 470, T.upper ? 110 : 104, seg(lt, .2, .6), { color: T.ac, d3: true });
      if (sg.i === sg.n - 1) txt(ctx, 'enviada para análise (anatomopatológico)', CX, 1520, { font: font(T, 'sans', 32, 600), color: T.ink, alpha: seg(lt, .4, .9), shadow: 'rgba(0,0,0,.7)' });
    } else if (sg.type === 'depois2') {
      face(ctx, D.PB, z, CX, H / 2, CX, H / 2); vignette(ctx);
      kicker(ctx, D, 'Outro ângulo', 330, seg(lt, .1, .4));
      tag(ctx, D, 'DEPOIS', CX, 1560, seg(lt, .3, .7));
    } else if (sg.type === 'depois') {
      face(ctx, D.B, z, CX, H / 2, CX, H / 2); vignette(ctx);
      kicker(ctx, D, 'Cicatriz', 330, seg(lt, .1, .4));
      titulo(ctx, D, D.dias || 'Depois', 470, T.upper ? 110 : 104, seg(lt, .2, .6), { color: T.ac, d3: true });
      tag(ctx, D, 'DEPOIS', CX, 1560, seg(lt, .4, .8));
    } else {
      const xs = lerp(W, CX, E.io(seg(lt, 0, .7)));
      face(ctx, D.B, 1.02, CX, H / 2, CX, H / 2);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, xs, H); ctx.clip(); face(ctx, D.A, 1.02, CX, H / 2, CX, H / 2); ctx.restore();
      vignette(ctx); ctx.fillStyle = T.ac; ctx.fillRect(xs - 2, 0, 4, H);
      tag(ctx, D, 'ANTES', 60, 1560, seg(lt, .7, 1), 'left'); tag(ctx, D, 'DEPOIS', W - 60, 1560, seg(lt, .7, 1), 'right');
    }
    if (lt < .18 && sg.t0 > 0) { ctx.fillStyle = `rgba(255,255,255,${(1 - lt / .18) * .35})`; ctx.fillRect(0, 0, W, H); }
  },
};
async function prepFrame(D, t) {
  if (D.style !== 'cirurgia' || !D.clips || !D.clips.length) return;
  if (t >= mainDur(D)) return; const tt = t / K(D);
  const sg = cirSegs(D).find(s2 => s2.type === 'clip' && tt >= s2.t0 && tt < s2.t1); if (!sg) return;
  const el = sg.clip.el, want = sg.clip.start + (tt - sg.t0);
  if (Math.abs(el.currentTime - want) < .012) return;
  await new Promise(res => { let done = false; const f = () => { if (done) return; done = true; el.removeEventListener('seeked', f); res(); }; el.addEventListener('seeked', f); el.currentTime = want; setTimeout(f, 600); });
}
function syncClips(D, t, playing) {
  if (!D || D.style !== 'cirurgia' || !D.clips) return; const tt = t / K(D);
  const segs = cirSegs(D);
  D.clips.forEach(c => { const sg = segs.find(s2 => s2.clip === c); const inSeg = sg && tt >= sg.t0 && tt < sg.t1;
    if (!inSeg) { if (!c.el.paused) c.el.pause(); return; }
    const want = c.start + (tt - sg.t0);
    if (Math.abs(c.el.currentTime - want) > .25) c.el.currentTime = want;
    if (playing && c.el.paused) c.el.play().catch(() => { }); if (!playing && !c.el.paused) c.el.pause(); });
}

/* ================= caso comentado (vídeo do médico narrando) ================= */
const NARR_R = 150, NARR_C = () => pt(W - 60 - NARR_R, 300 + NARR_R);
function narrFrame(ctx, D, x, y, w, h, round) {
  const el = D.narr && D.narr.el; if (!el || !el.videoWidth) return;
  const vw = el.videoWidth, vh = el.videoHeight, s0 = Math.max(w / vw, h / vh);
  ctx.save();
  if (round) { ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 7); ctx.clip(); }
  ctx.drawImage(el, x + (w - vw * s0) / 2, y + (h - vh * s0) / 2, vw * s0, vh * s0);
  ctx.restore();
}
function capChunks(words) {
  const out = []; let cur = [];
  (words || []).forEach(w => { cur.push(w); const dur = cur[cur.length - 1].e - cur[0].s; if (cur.length >= 4 || dur > 1.6 || /[.!?,;:]$/.test(w.w)) { out.push(cur); cur = []; } });
  if (cur.length) out.push(cur); return out;
}
function drawCaption(ctx, D, t) {
  if (!D.capOn || !D.capWords || !D.capWords.length) return; const T = D.T;
  const tv = t - VOICE_AT; const ch = (D._chunks || (D._chunks = capChunks(D.capWords))).find(c => tv >= c[0].s - .05 && tv <= c[c.length - 1].e + .25); if (!ch) return;
  const y = isStory(D) ? 1380 : 1600, fs = T.upper ? 58 : 52;
  ctx.save(); ctx.font = font(T, T.upper ? 'disp' : 'sans', fs, T.upper ? null : 800);
  const parts = ch.map(w => (T.upper ? w.w.toUpperCase() : w.w)); const sp = ctx.measureText(' ').width;
  const ws = parts.map(p => ctx.measureText(p).width); const tw = ws.reduce((a, b) => a + b, 0) + sp * (parts.length - 1);
  const sc = Math.min(1, 960 / tw); ctx.translate(CX, y); ctx.scale(sc, sc);
  ctx.fillStyle = 'rgba(12,9,6,.72)'; rr(ctx, -tw / 2 - 26, -fs - 10, tw + 52, fs + 34, 18); ctx.fill();
  let x = -tw / 2; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ch.forEach((w, i) => { const on = tv >= w.s && tv <= w.e + .08; ctx.fillStyle = on ? T.ac : T.ink; ctx.fillText(parts[i], x, 0); x += ws[i] + sp; });
  ctx.restore();
}
function cardAt(D, t) { const tv = t - VOICE_AT; let c = null; (D.cards || []).forEach(k => { if (k.text && tv >= k.t) c = k; }); return c; }
function leftBlock(ctx, D, kick, body, y0, p, big) {
  const T = D.T; if (p <= 0) return;
  kicker(ctx, D, kick, y0, p, { x: 60, align: 'left' });
  ctx.save(); ctx.globalAlpha *= E.out(p);
  if (big) para(ctx, (T.upper ? body.toUpperCase() : '“' + body + '”'), 60, y0 + (T.upper ? 110 : 100), 470, T.upper ? 84 : 78, { font: font(T, 'disp', T.upper ? 76 : 72), color: T.ink, align: 'left', shadow: 'rgba(0,0,0,.7)' });
  else { ctx.fillStyle = 'rgba(12,9,6,.66)'; ctx.save(); ctx.font = font(T, 'sans', 34, 600); const L = wrap(ctx, body, 450); ctx.restore(); rr(ctx, 44, y0 + 30, 490, L.length * 46 + 40, 18); ctx.fill();
    para(ctx, body, 70, y0 + 82, 450, 46, { font: font(T, 'sans', 34, 600), color: T.ink, align: 'left' }); }
  ctx.restore();
}
ST.comentado = {
  nome: 'Caso comentado', desc: 'Você narra; cartões e regiões seguem a fala',
  dur: D => Math.max(8, (D.narr ? D.narr.dur : 20) + VOICE_AT + .2),
  cues: D => (D.cards || []).filter(c => c.text).map(c => c.t + VOICE_AT),
  draw(ctx, D, t) {
    const T = D.T, dur = this.dur(D);
    const first = (D.cards || []).filter(c => c.text).map(c => c.t)[0];
    const tOpen = Math.min(3.4, first != null ? Math.max(1.6, first + VOICE_AT) : 3.4);
    const tDep = D.tDepois != null ? D.tDepois + VOICE_AT : Math.max(tOpen + 3, dur - 4.2);
    if (t < tOpen) { // abertura: você em tela cheia
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
      if (D.narr && D.narr.el && D.narr.el.videoWidth) narrFrame(ctx, D, 0, 0, W, H, false); else face(ctx, D.A, 1, CX, H / 2, CX, H / 2);
      vignette(ctx, .55, .7);
      hook(ctx, D, t, 0, tOpen + 1);
      // encolhe para o círculo
      return;
    }
    const lt = t - tOpen; const sh = E.io(seg(lt, 0, .5));
    // fundo: o caso
    const isB = t >= tDep, z = 1.02 + .04 * seg(t, tOpen, dur);
    face(ctx, D.A, z, CX, EYE_Y + 150, CX, EYE_Y + 150);
    if (t > tDep - .1) face(ctx, D.B, z, CX, EYE_Y + 150, CX, EYE_Y + 150, E.io(seg(t, tDep, tDep + .9)));
    vignette(ctx, .6, .9);
    const card = cardAt(D, t); const ck = card ? card.key : null; const cp = card ? seg(t - VOICE_AT, card.t, card.t + .4) : 0;
    // malha durante avaliação e estratégia
    if (D.LA && (ck === 'avaliacao' || ck === 'estrategia') && !isB) malha(ctx, D, D.LA, 478, T.ac, .5 * seg(t - VOICE_AT, card.t, card.t + .8), 1.8);
    if (!isB && card) {
      if (ck === 'desejo') leftBlock(ctx, D, 'O que a paciente queria', card.text, 330, cp, true);
      if (ck === 'avaliacao') leftBlock(ctx, D, 'O que eu vi', card.text, 330, cp);
      if (ck === 'produto') leftBlock(ctx, D, 'Produto e por quê', card.text, 330, cp);
      if (ck === 'estrategia') {
        leftBlock(ctx, D, 'Estratégia', card.text, 330, cp);
        const R = regList(D); const tEnd = tDep - VOICE_AT; const span = Math.max(1, tEnd - card.t); const per = span / Math.max(1, R.length);
        R.forEach((r, i) => { const p = seg(t - VOICE_AT, card.t + .5 + i * per, card.t + .9 + i * per); if (p <= 0) return;
          r.ptsA.forEach(q => { ctx.save(); ctx.globalAlpha = E.out(p); ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 7); ctx.strokeStyle = T.ac; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.stroke(); ctx.setLineDash([]);
            ctx.beginPath(); ctx.arc(q.x, q.y, 26, 0, 7); ctx.fillStyle = T.ac; ctx.fill(); txt(ctx, String(i + 1), q.x, q.y + 11, { font: font(T, 'mono', 30, 700), color: '#111' });
            const sd = D.showMl && D.perSide && r.reg.bi && D.mlSide && D.mlSide[r.reg.id]; const v = sd ? (q.lado === 'L' ? sd.d : sd.e) : (D.showMl && !r.reg.bi && q.lado === 'C' ? D.ml[r.reg.id] : 0);
            if (v) txt(ctx, fmtMl(v) + ' ml', q.x, q.y - q.r - 14, { font: font(T, 'mono', 24, 700), color: T.ink, shadow: 'rgba(0,0,0,.8)' });
            ctx.restore(); });
        });
        // lista da ordem
        const lst = R.map((r, i) => (i + 1) + '. ' + r.reg.nome + (D.showMl && D.ml[r.reg.id] ? ' · ' + mlLabel(D, r.reg.id) : ''));
        ctx.save(); ctx.globalAlpha = seg(t - VOICE_AT, card.t + .5, card.t + 1); lst.forEach((s2, i) => txt(ctx, s2, 60, 1240 + i * 40, { font: font(T, 'mono', 26, 700), color: T.ink, align: 'left', shadow: 'rgba(0,0,0,.8)', alpha: seg(t - VOICE_AT, card.t + .5 + i * per, card.t + .9 + i * per) })); ctx.restore();
      }
    }
    if (isB) { tag(ctx, D, 'DEPOIS', 60, 1460, seg(t, tDep + .4, tDep + .8), 'left'); regChips(ctx, D, 1360, seg(t, tDep + 1, tDep + 1.6)); }
    else tag(ctx, D, 'ANTES', 60, 1460, seg(lt, .4, .8), 'left');
    // você no círculo
    const c0 = NARR_C(); const r0 = lerp(W, NARR_R, sh);
    const cx = lerp(CX, c0.x, sh), cy = lerp(H / 2, c0.y, sh);
    if (D.narr && D.narr.el && D.narr.el.videoWidth) {
      if (sh < 1) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r0 * (sh < 1 ? 1.1 : 1), 0, 7); ctx.clip(); narrFrame(ctx, D, cx - r0 * 1.2, cy - r0 * 1.2, r0 * 2.4, r0 * 2.4, false); ctx.restore(); }
      else narrFrame(ctx, D, cx - NARR_R, cy - NARR_R, NARR_R * 2, NARR_R * 2, true);
      ctx.beginPath(); ctx.arc(cx, cy, Math.min(r0, 2000), 0, 7); ctx.strokeStyle = T.ac; ctx.lineWidth = 6; ctx.stroke();
    }
    drawCaption(ctx, D, t);
  },
};
async function prepNarr(D, t) {
  if (D.style !== 'comentado' || !D.narr || !D.narr.el) return;
  const el = D.narr.el, want = clamp(t - VOICE_AT, 0, Math.max(0, D.narr.dur - .05));
  if (Math.abs(el.currentTime - want) < .012) return;
  await new Promise(res => { let done = false; const f = () => { if (done) return; done = true; el.removeEventListener('seeked', f); res(); }; el.addEventListener('seeked', f); el.currentTime = want; setTimeout(f, 600); });
}
function syncNarr(D, t, playing) {
  if (!D || D.style !== 'comentado' || !D.narr || !D.narr.el) return; const el = D.narr.el;
  const want = t - VOICE_AT; if (want < 0 || want > D.narr.dur) { if (!el.paused) el.pause(); if (want < 0 && Math.abs(el.currentTime) > .05) el.currentTime = 0; return; }
  if (Math.abs(el.currentTime - want) > .25) el.currentTime = want;
  if (playing && el.paused) el.play().catch(() => { }); if (!playing && !el.paused) el.pause();
}

/* perfil no final (opcional) */
const PROF_DUR = 3.0;
function profileSeg(ctx, D, t) {
  const T = D.T; ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
  const pw = 520, ph = 1150, y0 = 420;
  [[D.PA, 'ANTES', 14], [D.PB, 'DEPOIS', W - 14 - pw]].forEach(([fr, lab, x], k) => {
    const p = E.out(seg(t, .1 + k * .35, .8 + k * .35)); if (p <= 0) return;
    ctx.save(); ctx.globalAlpha = p; ctx.translate(0, (1 - p) * 60); rr(ctx, x, y0, pw, ph, 22); ctx.clip();
    face(ctx, fr, .82 + .04 * t / 3, CX, H / 2, x + pw / 2, y0 + ph / 2); ctx.restore();
    tag(ctx, D, lab, x + pw / 2, y0 + ph - 30, p);
  });
  titulo(ctx, D, 'De perfil', 300, T.upper ? 110 : 104, seg(t, 0, .6), { d3: true });
}

/* ---------------- montagem do roteiro ---------------- */
const K = D => D.k || 1;
const mainDur = D => ST[D.style].dur(D) * K(D);
const profDur = D => (D.withProfile && D.PA && D.PB) ? PROF_DUR : 0;
function totalDur(D) { return mainDur(D) + profDur(D) + infoD(D) + endD(D); }
function drawFrame(ctx, D, t) {
  const st = ST[D.style];
  const T0 = mainDur(D), Tp = T0 + profDur(D), T1 = Tp + infoD(D), TT = T1 + endD(D);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (t < T0) st.draw(ctx, D, t / K(D));
  if (Tp > T0 && t >= T0 - .4 && t < Tp) { ctx.save(); ctx.globalAlpha = E.io(seg(t, T0 - .4, T0)); profileSeg(ctx, D, Math.max(0, t - T0 + .2)); ctx.restore(); }
  if (t >= Tp - .45 && t < T1) {
    const a = E.io(seg(t, Tp - .45, Tp));
    ctx.save(); ctx.globalAlpha = a; infoCard(ctx, D, Math.max(0, t - Tp + .2)); ctx.restore();
  }
  if (t >= T1 - .35) { const a = E.io(seg(t, T1 - .35, T1)); ctx.save(); ctx.globalAlpha = a; endCard(ctx, D, Math.max(0, t - T1 + .1)); ctx.restore(); }
  if (t < T1 - .2) chrome(ctx, D, t, TT);
  ctx.restore();
}

/* ---------------- áudio (trilha original, sintetizada) ---------------- */
const VOICE_AT = .35;
async function renderAudio(D, dur, sr = 48000) {
  if (D.music === 'nenhuma' && !D.voice) return null;
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new OAC(2, Math.ceil(dur * sr), sr);
  const master = ctx.createGain(); master.gain.value = .9;
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
  master.connect(comp); comp.connect(ctx.destination);
  // eco
  const dl = ctx.createDelay(1.5); dl.delayTime.value = .42; const fb = ctx.createGain(); fb.gain.value = .32; const wet = ctx.createGain(); wet.gain.value = .3;
  dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(master);
  const elegante = D.music === 'elegante';
  const bpm = elegante ? 84 : 72, beat = 60 / bpm;
  const prog = elegante
    ? [[146.83, 220, 277.18, 329.63], [123.47, 185, 246.94, 293.66], [98, 196, 246.94, 293.66], [110, 220, 277.18, 329.63]]   // Dmaj9 Bm7 Gmaj7 A
    : [[130.81, 196, 246.94, 329.63], [110, 164.81, 220, 261.63], [87.31, 174.61, 220, 261.63], [98, 196, 246.94, 293.66]]; // Cmaj7 Am7 Fmaj7 G
  const bar = beat * 4;
  const env = (g, t0, a, sus, rel, peak) => { g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(peak, t0 + a); g.gain.setValueAtTime(peak, t0 + a + sus); g.gain.linearRampToValueAtTime(0, t0 + a + sus + rel); };
  const fadeOut = Math.max(0, dur - 1.8);
  for (let b = 0; D.music !== 'nenhuma' && b * bar < dur; b++) {
    const t0 = b * bar, ch = prog[b % 4];
    // pad
    ch.forEach((f, i) => {
      [-4, 4].forEach(dt => {
        const o = ctx.createOscillator(); o.type = i === 0 ? 'sine' : 'triangle'; o.frequency.value = f * (i === 0 ? 1 : 2); o.detune.value = dt;
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
        const g = ctx.createGain(); env(g, t0, bar * .35, bar * .45, bar * .5, (i === 0 ? .09 : .035));
        o.connect(lp); lp.connect(g); g.connect(master); o.start(t0); o.stop(t0 + bar * 1.35);
      });
    });
    // arpejo dedilhado
    if (b >= 1) for (let k = 0; k < 8; k++) {
      const tt = t0 + k * beat / 2; if (tt > fadeOut) break;
      const f = ch[1 + (k % 3)] * (k % 4 === 3 ? 4 : 2);
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(elegante ? .05 : .04, tt + .01); g.gain.exponentialRampToValueAtTime(.0005, tt + .7);
      o.connect(g); g.connect(master); g.connect(dl); o.start(tt); o.stop(tt + .75);
    }
    // batida leve (só no elegante)
    if (elegante && b >= 2) for (let k = 0; k < 4; k++) {
      const tt = t0 + k * beat; if (tt > fadeOut) break;
      const o = ctx.createOscillator(); o.frequency.setValueAtTime(110, tt); o.frequency.exponentialRampToValueAtTime(45, tt + .18);
      const g = ctx.createGain(); g.gain.setValueAtTime(.16, tt); g.gain.exponentialRampToValueAtTime(.001, tt + .3);
      o.connect(g); g.connect(master); o.start(tt); o.stop(tt + .32);
    }
  }
  // efeitos discretos nas transições
  const nb = ctx.createBuffer(1, sr * 1, sr); const nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const cues = (ST[D.style].cues(D) || []).map(c => c * K(D)).concat([mainDur(D) - .3, mainDur(D) + profDur(D) + infoD(D) - .25]);
  if (D.sfx) cues.forEach(c => {
    if (c < 0 || c > dur) return;
    const s = ctx.createBufferSource(); s.buffer = nb;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2; bp.frequency.setValueAtTime(400, c - .3); bp.frequency.exponentialRampToValueAtTime(3200, c + .1);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, c - .35); g.gain.linearRampToValueAtTime(.05, c); g.gain.linearRampToValueAtTime(0, c + .25);
    s.connect(bp); bp.connect(g); g.connect(master); s.start(Math.max(0, c - .35)); s.stop(c + .3);
  });
  // voz do médico por cima, trilha abaixa
  const mv = D.voice ? .3 : .9;
  if (D.voice) {
    const vs = ctx.createBufferSource(); vs.buffer = D.voice;
    const vg = ctx.createGain(); vg.gain.value = 1.0;
    const vc = ctx.createDynamicsCompressor(); vc.threshold.value = -20; vc.ratio.value = 3; vc.attack.value = .005; vc.release.value = .2;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 80;
    vs.connect(hp); hp.connect(vc); vc.connect(vg); vg.connect(ctx.destination); vs.start(VOICE_AT);
  }
  // fade in/out
  master.gain.setValueAtTime(0, 0); master.gain.linearRampToValueAtTime(mv, 1.2);
  master.gain.setValueAtTime(mv, fadeOut); master.gain.linearRampToValueAtTime(0, dur);
  return await ctx.startRendering();
}

/* ---------------- exportação ---------------- */
async function pickAvc() {
  if (!window.VideoEncoder) return null;
  for (const codec of ['avc1.640028', 'avc1.4d0028', 'avc1.42e028', 'avc1.640032']) {
    try { const r = await VideoEncoder.isConfigSupported({ codec, width: W, height: H, bitrate: 9e6, framerate: FPS }); if (r.supported) return codec; } catch (e) { }
  }
  return null;
}
async function aacOk() {
  if (!window.AudioEncoder) return false;
  try { return (await AudioEncoder.isConfigSupported({ codec: 'mp4a.40.2', sampleRate: 48000, numberOfChannels: 2, bitrate: 128000 })).supported; } catch (e) { return false; }
}
// Exporta MP4 quadro a quadro (mais rápido que tempo real e sem engasgos)
async function opusOk() {
  if (!window.AudioEncoder) return false;
  try { return (await AudioEncoder.isConfigSupported({ codec: 'opus', sampleRate: 48000, numberOfChannels: 2, bitrate: 128000 })).supported; } catch (e) { return false; }
}
async function exportWebCodecs(D, canvas, onProg, codec, acodec, out) {
  const ctx = canvas.getContext('2d');
  const OW = out ? out.w : W, OH = out ? out.h : H, BR = out ? out.br : 9e6;
  const oc = out ? mk(OW, OH) : canvas, ox = out ? oc.getContext('2d') : null; if (ox) ox.imageSmoothingQuality = 'high';
  const dur = totalDur(D), N = Math.round(dur * FPS);
  const audio = acodec ? await renderAudio(D, dur) : null;
  const useAudio = !!audio;
  const muxer = new Mp4Muxer.Muxer({
    target: new Mp4Muxer.ArrayBufferTarget(), fastStart: 'in-memory',
    video: { codec: 'avc', width: OW, height: OH, frameRate: FPS },
    audio: useAudio ? { codec: acodec, numberOfChannels: 2, sampleRate: 48000 } : undefined,
  });
  let err = null;
  const ve = new VideoEncoder({ output: (c, m) => muxer.addVideoChunk(c, m), error: e => err = e });
  ve.configure({ codec, width: OW, height: OH, bitrate: BR, framerate: FPS, avc: { format: 'avc' } });
  for (let i = 0; i < N; i++) {
    if (err) throw err;
    await prepFrame(D, i / FPS); await prepNarr(D, i / FPS);
    drawFrame(ctx, D, i / FPS);
    if (ox) ox.drawImage(canvas, 0, 0, OW, OH);
    const vf = new VideoFrame(oc, { timestamp: Math.round(i * 1e6 / FPS), duration: Math.round(1e6 / FPS) });
    ve.encode(vf, { keyFrame: i % (FPS * 2) === 0 }); vf.close();
    if (ve.encodeQueueSize > 6) await new Promise(r => { const f = () => ve.encodeQueueSize > 2 ? setTimeout(f, 4) : r(); f(); });
    if (i % 6 === 0) { onProg(i / N * (useAudio ? .92 : 1)); await new Promise(r => setTimeout(r, 0)); }
  }
  await ve.flush();
  if (useAudio) {
    const ae = new AudioEncoder({ output: (c, m) => muxer.addAudioChunk(c, m), error: e => err = e });
    ae.configure({ codec: acodec === 'aac' ? 'mp4a.40.2' : 'opus', sampleRate: 48000, numberOfChannels: 2, bitrate: 160000 });
    const L = audio.getChannelData(0), R = audio.getChannelData(1), CH = 1024;
    for (let i = 0; i < L.length; i += CH) {
      const n = Math.min(CH, L.length - i); const buf = new Float32Array(n * 2); buf.set(L.subarray(i, i + n), 0); buf.set(R.subarray(i, i + n), n);
      const ad = new AudioData({ format: 'f32-planar', sampleRate: 48000, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round(i / 48000 * 1e6), data: buf });
      ae.encode(ad); ad.close();
    }
    await ae.flush();
  }
  if (err) throw err;
  muxer.finalize();
  onProg(1);
  return { blob: new Blob([muxer.target.buffer], { type: 'video/mp4' }), ext: 'mp4', audio: !!useAudio };
}
// Alternativa: grava em tempo real (navegadores sem WebCodecs)
async function exportRecorder(D, canvas, onProg, out) {
  const ctx0 = canvas.getContext('2d');
  const oc = out ? mk(out.w, out.h) : canvas, ox = out ? oc.getContext('2d') : null;
  const ctx = { _draw: (t) => { drawFrame(ctx0, D, t); if (ox) ox.drawImage(canvas, 0, 0, out.w, out.h); } };
  const dur = totalDur(D);
  const audio = await renderAudio(D, dur);
  const stream = oc.captureStream(FPS);
  let ac = null, src = null;
  if (audio) {
    ac = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
    const dest = ac.createMediaStreamDestination(); src = ac.createBufferSource(); src.buffer = audio; src.connect(dest);
    dest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr));
  }
  const types = ['video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm'];
  const mime = types.find(t => window.MediaRecorder && MediaRecorder.isTypeSupported(t));
  if (!mime) throw new Error('Este navegador não grava vídeo.');
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: out ? out.br : 9e6 });
  const chunks = []; rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  const done = new Promise(r => rec.onstop = r);
  ctx._draw(0);
  rec.start(250); if (src) src.start();
  const t0 = performance.now();
  await new Promise(res => {
    const step = () => { const t = (performance.now() - t0) / 1000; syncClips(D, t, true); syncNarr(D, t, true); ctx._draw(Math.min(t, dur)); onProg(t / dur); if (t >= dur) return res(); requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
  rec.stop(); await done; if (ac) ac.close();
  const ext = mime.includes('mp4') ? 'mp4' : 'webm';
  return { blob: new Blob(chunks, { type: mime.split(';')[0] }), ext, audio: !!audio };
}

function storyPoll(ctx, D) {
  const T = D.T; ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
  titulo(ctx, D, T.upper ? 'NOTOU A' : 'Notou a', 330, T.upper ? 120 : 112, 1, { d3: true });
  titulo(ctx, D, T.upper ? 'DIFERENÇA?' : 'diferença?', T.upper ? 450 : 440, T.upper ? 120 : 112, 1, { color: T.ac, d3: true });
  const bw = 440, bh = 640, y0 = 520;
  [[D.A, 'ANTES', CX - bw - 12], [D.B, 'DEPOIS', CX + 12]].forEach(([fr, lab, x]) => {
    ctx.save(); rr(ctx, x, y0, bw, bh, 20); ctx.clip(); face(ctx, fr, .82, CX, EYE_Y + 140, x + bw / 2, y0 + bh / 2); ctx.restore();
    tag(ctx, D, lab, x + bw / 2, y0 + bh - 28, 1);
  });
  // espaço para o adesivo de enquete do Instagram
  ctx.save(); ctx.setLineDash([14, 12]); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3; rr(ctx, 170, 1210, 740, 230, 30); ctx.stroke(); ctx.restore();
  txt(ctx, D.prof.nome + ' · ' + D.prof.crm, CX, H - 360, { font: font(T, 'sans', 24, 600), color: T.ink, alpha: .85 });
  txt(ctx, 'Imagens autorizadas pelo paciente · resultados variam de pessoa para pessoa', CX, H - 326, { font: font(T, 'sans', 19, 500), color: T.sub, alpha: .8, maxW: 980 });
}
function storyInfo(ctx, D) {
  infoCard(ctx, Object.assign({}, D, { dest: 'stories' }), 12);
}
window.Motor = { prepNarr, syncNarr, prepFrame, syncClips, cirSegs, storyPoll, storyInfo, infoD, endD, ORDEM, mainDur, PROF_DUR, VOICE_AT, regList, cardLayout, offPts, tris, W, H, CX, EYE_Y, IED, PR, FPS, THEMES, REGIOES, REG, ST, anchors, regiaoPts, eyeXform, eyesXform, composeAdj, coverXform, prerender, drawFrame, totalDur, renderAudio, pickAvc, aacOk, opusOk, exportWebCodecs, exportRecorder, apply, mk, INFO_DUR, END_DUR };
