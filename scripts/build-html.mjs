// Gera o site estático da Curae Santé (HTML puro) a partir de site/ e content/blog.
// Uso: node scripts/build-html.mjs [pastaSaida]   (padrão: dist)
import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(ROOT, process.argv[2] || 'dist');
const SITE = 'https://curaesante.com.br';
const WA = 'https://wa.me/5548988064337';
const waLink = (msg) => `${WA}?text=${encodeURIComponent(msg)}`;
const WA_PADRAO = waLink('Olá! Vim pelo site da Curae Santé e quero agendar uma consulta.');
const VER = Date.now().toString(36);
const CFG = JSON.parse(readFileSync(path.join(ROOT, 'site/config.json'), 'utf8'));
// título para o Google: até ~62 caracteres com a marca; se não couber, só o título
const seoTitle = (t, suf = ' | Curae Santé') => {
  if ((t + suf).length <= 62) return t + suf;
  if (t.length <= 62) return t;
  const head = t.split(/:| — | - /)[0].trim();
  return (head + suf).length <= 62 ? head + suf : head.slice(0, 60);
};
// imagens: usar WebP nas páginas (o JPG fica para a prévia de link)
const toWebp = (html) => html.replace(/(\/s\/img\/[^"')\s]+)\.jpg/g, '$1.webp');
const crumbLd = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, u], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE}${u}` })) });

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const write = (rel, html) => { const f = path.join(OUT, rel); mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, html); };

// ---------- blog ----------
function parseFM(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return null;
  const a = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':'); if (i < 0) continue;
    const k = line.slice(0, i).trim(); let v = line.slice(i + 1).trim();
    if (/^\[.*\]$/.test(v)) v = v.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    else { v = v.replace(/^["']|["']$/g, ''); if (v === 'true') v = true; else if (v === 'false') v = false; }
    a[k] = v;
  }
  return { ...a, body: m[2] };
}
const CATS = [
  ['pele', /pele|acne|mancha|melasma|ros[áa]cea|protetor|skincare|skin|ruga|colágeno|bioestimul|toxina|botox|preench|harmoniza|peeling|nevo|pinta|dermat|olheira|poro|cicatriz|hidrata|retinol|vitamina c|ácido/i],
  ['cabelo', /cabelo|capilar|queda|alopecia|couro cabeludo|caspa/i],
  ['emagrecimento', /emagrec|peso|metabol|obesidade|tirzepatida|semaglutida|insulina|gordura|dieta|glp/i],
  ['hormonal', /hormon|menopausa|perimenopausa|tireoide|ciclo|libido|feminin/i],
];
const CAT_NOME = { pele: 'Pele', cabelo: 'Cabelo', emagrecimento: 'Emagrecimento', hormonal: 'Saúde hormonal', clinica: 'Clínica' };
function catsOf(p) {
  const hay = `${p.title} ${(p.tags || []).join(' ')}`;
  const c = CATS.filter(([, re]) => re.test(hay)).map(([k]) => k);
  return c.length ? c : ['clinica'];
}
const dataBR = (iso) => new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const posts = readdirSync(path.join(ROOT, 'content/blog')).filter(f => f.endsWith('.md'))
  .map(f => parseFM(readFileSync(path.join(ROOT, 'content/blog', f), 'utf8')))
  .filter(p => p && p.published === true && p.slug)
  .sort((a, b) => new Date(b.data) - new Date(a.data));
const FOTOS = existsSync(path.join(ROOT, 'site/blog-fotos.json')) ? JSON.parse(readFileSync(path.join(ROOT, 'site/blog-fotos.json'), 'utf8')) : {};
posts.forEach(p => { if (existsSync(path.join(ROOT, 'site/img/blog', p.slug + '.jpg'))) { p.capa = `/s/img/blog/${p.slug}.jpg`; p.capaAlt = (FOTOS[p.slug] || {}).alt || ''; p.capaCred = FOTOS[p.slug] || null; } });
posts.forEach(p => { p.cats = catsOf(p); if (/j[uú]lia/i.test(p.autor || '')) { p.autor = 'Dra. Júlia Schmitz'; p.aut = 'julia'; } else if (/pedro/i.test(p.autor || '')) { p.autor = 'Dr. Pedro Schmitz'; p.aut = 'pedro'; } });

// guias (páginas educativas ricas, com fotos) em site/guias/<slug>.html
const guias = existsSync(path.join(ROOT, 'site/guias')) ? readdirSync(path.join(ROOT, 'site/guias')).filter(f => f.endsWith('.html')).map(f => {
  const raw = readFileSync(path.join(ROOT, 'site/guias', f), 'utf8');
  const meta = JSON.parse(raw.match(/<!--meta([\s\S]*?)-->/)[1]);
  return { ...meta, slug: f.replace(/\.html$/, ''), html: raw.replace(/<!--meta[\s\S]*?-->/, '') };
}) : [];

// ---------- partes do layout ----------
const NAV = [['/', 'Início', 'inicio'], ['/sobre/', 'Sobre', 'sobre'], ['/servicos/', 'Serviços', 'servicos'], ['/equipe/', 'Equipe', 'equipe'], ['/blog/', 'Blog', 'blog'], ['/faq/', 'FAQ', 'faq'], ['/contato/', 'Contato', 'contato']];
const ICO_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.2-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-1-1.1-1.3-1.7-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';

const CLINICA_LD = {
  '@type': 'MedicalClinic', '@id': `${SITE}/#clinica`, name: 'Curae Santé Clínica Médica', url: `${SITE}/`,
  telephone: '+55 48 98806-4337', email: 'curaesante@gmail.com', image: `${SITE}/s/img/fachada.jpg`, logo: `${SITE}/s/img/logo-escuro.png`,
  address: { '@type': 'PostalAddress', streetAddress: 'Av. Delamar José da Silva, 186, Sala 3', addressLocality: 'São José', addressRegion: 'SC', postalCode: '88102-100', addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: -27.5935, longitude: -48.6195 },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' }],
  sameAs: ['https://www.instagram.com/curaesante/'],
  medicalSpecialty: ['PrimaryCare', 'Dermatology'],
};
const MEDICOS_LD = [
  { '@type': 'Physician', '@id': `${SITE}/#dr-pedro`, name: 'Dr. Pedro Schmitz', identifier: 'CRM/SC 38229', worksFor: { '@id': `${SITE}/#clinica` }, sameAs: ['https://www.instagram.com/drpedroschmitz/'] },
  { '@type': 'Physician', '@id': `${SITE}/#dra-julia`, name: 'Dra. Júlia Schmitz', identifier: 'CRM/SC 34242', worksFor: { '@id': `${SITE}/#clinica` }, sameAs: ['https://www.instagram.com/drajulialongo/'] },
];

function layout({ title, description, url, nav, body, cta = true, pre = false, ld = [], ogImage = '/og-image.jpg', ogType = 'website', light = false, crumbs = null, preload = null }) {
  const graph = { '@context': 'https://schema.org', '@graph': [CLINICA_LD, ...ld, ...(crumbs ? [crumbLd(crumbs)] : [])] };
  body = toWebp(body);
  const navHtml = NAV.map(([h, t, k]) => `<a href="${h}"${k === nav ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  return `<!doctype html>
<html lang="pt-BR" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}${url}">
${CFG.gsc ? `<meta name="google-site-verification" content="${esc(CFG.gsc)}">` : ''}${CFG.bing ? `<meta name="msvalidate.01" content="${esc(CFG.bing)}">` : ''}
${preload ? `<link rel="preload" as="image" href="${toWebp(preload)}" fetchpriority="high">` : ''}
<meta name="theme-color" content="#2A1F14">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" href="/favicon.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="${ogType}"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Curae Santé">
<meta property="og:url" content="${SITE}${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE}${ogImage}"><meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Red+Hat+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/s/curae.css?v=${VER}">
<script type="application/ld+json">${JSON.stringify(graph)}</script>
<script>window.CURAE_CFG=${JSON.stringify({ ga4: CFG.ga4 || '', metaPixel: CFG.metaPixel || '' })}</script>
</head>
<body${light ? ' class="light-top"' : ''}>
${pre ? '<div id="pre" aria-hidden="true"><img src="/s/img/logo-claro.png" alt=""><div class="bar"></div></div>' : ''}
<header id="brand"><div class="wrap">
  <a class="logo" href="/" aria-label="Curae Santé, página inicial"><img src="/s/img/logo-claro.png" alt="Curae Santé" width="180" height="44"></a>
  <nav aria-label="Principal">${navHtml}${cta ? `<a class="btn gold" href="${WA_PADRAO}" target="_blank" rel="noopener">Agendar</a>` : ''}</nav>
  <button class="burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="mnav"><span></span><span></span><span></span></button>
</div></header>
<nav id="mnav" aria-label="Menu">${navHtml}${cta ? `<a class="btn gold" href="${WA_PADRAO}" target="_blank" rel="noopener">Agendar pelo WhatsApp</a>` : ''}</nav>
<main>
${body}
</main>
<footer><div class="wrap">
  <div class="top">
    <div><img src="/s/img/logo-claro.png" alt="Curae Santé" width="220" height="54"><p>Clínica médica no Kobrasol, São José/SC. Consulta com tempo, investigação e plano individualizado.</p>
      <p class="med">Dr. Pedro Schmitz · CRM/SC 38229<br>Dra. Júlia Schmitz · CRM/SC 34242</p></div>
    <div><h4>Páginas</h4><ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
    <div><h4>Áreas</h4><ul><li><a href="/servicos/#clinica">Saúde clínica</a></li><li><a href="/metabolismo-feminino/">Metabolismo feminino</a></li><li><a href="/servicos/programa-de-emagrecimento/">Programa de emagrecimento</a></li><li><a href="/servicos/menopausa-e-insonia/">Menopausa e insônia</a></li><li><a href="/servicos/#pele">Pele e cabelo</a></li><li><a href="/blog/">Guias e artigos</a></li><li><a href="/servicos/pequenas-cirurgias/">Pequenas cirurgias</a></li><li><a href="/clinica-medica-kobrasol-sao-jose/">Clínica no Kobrasol</a></li></ul></div>
    <div><h4>Contato</h4><ul><li>Av. Delamar José da Silva, 186, Sala 3<br>Kobrasol · São José/SC · 88102-100</li><li><a href="${WA_PADRAO}" target="_blank" rel="noopener">WhatsApp (48) 98806-4337</a></li><li><a href="mailto:curaesante@gmail.com">curaesante@gmail.com</a></li><li><a href="https://www.instagram.com/curaesante/" target="_blank" rel="noopener">@curaesante</a></li><li>Seg a sex · 9h às 18h</li></ul></div>
  </div>
  <div class="bot"><span>© ${new Date().getFullYear()} Curae Santé Clínica Médica</span><span>Conteúdo informativo. Não substitui a consulta médica.</span></div>
</div></footer>
${cta ? `<a class="wa" href="${WA_PADRAO}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp" style="color:#fff">${ICO_WA}</a>` : ''}
<div class="grain" aria-hidden="true"></div>
<script src="/s/vendor/gsap.min.js" defer></script>
<script src="/s/vendor/ScrollTrigger.min.js" defer></script>
<script src="/s/vendor/lenis.min.js" defer></script>
<script src="/s/curae.js?v=${VER}" defer></script>
</body>
</html>`;
}

// ---------- componentes ----------
function cover(p, cls = '') {
  const c = hash(p.slug) % 4;
  return `<div class="cover c${c}${cls}">${p.capa ? `<img src="${p.capa}" alt="${esc(p.capaAlt || '')}" loading="lazy" width="1200" height="750">` : `<span class="ini">${esc(p.title[0])}</span>`}<span class="tg">${esc(p.guia ? 'Guia' : CAT_NOME[p.cats[0]])}</span></div>`;
}
function postCard(p) {
  return `<a class="post" href="/blog/${p.slug}/" data-cat="${p.cats.join(' ')}${p.aut ? ' a-' + p.aut : ''}">${cover(p)}<div class="tx"><h3>${esc(p.title)}</h3><p>${esc(p.resumo)}</p><span class="meta">${esc(p.autor || 'Curae Santé')} · ${dataBR(p.data)}</span></div></a>`;
}
function guiaCard(g) {
  return `<a class="post guia" href="/blog/${g.slug}/" data-cat="${g.cats.join(' ')}">${cover({ ...g, guia: true, title: g.titulo })}<div class="tx"><span class="kick">Guia por queixa</span><h3 style="font-size:32px">${esc(g.titulo)}</h3><p>${esc(g.resumo)}</p><span class="meta">Revisado por ${esc(g.revisor)} · ${dataBR(g.data)}</span></div></a>`;
}
const FAQ = JSON.parse(readFileSync(path.join(ROOT, 'site/faq.json'), 'utf8'));
function faqHtml(items, withCat = true) {
  return items.map(q => `<details${withCat ? ` data-cat="${q.cat}"` : ''}><summary>${esc(q.q)}</summary><p>${q.a}</p></details>`).join('\n');
}
const faqLd = (items) => ({ '@type': 'FAQPage', mainEntity: items.map(q => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a.replace(/<[^>]+>/g, '') } })) });

function fill(html) {
  return html
    .replaceAll('{{WA}}', WA_PADRAO)
    .replace(/\{\{WA:([^}]+)\}\}/g, (_, m) => waLink(m))
    .replace(/\{\{AUTOR:(\w+):(\d+)\}\}/g, (_, a, n) => posts.filter(p => p.aut === a).slice(0, +n).map(postCard).join('\n'))
    .replace(/\{\{NAUTOR:(\w+)\}\}/g, (_, a) => String(posts.filter(p => p.aut === a).length))
    .replace(/\{\{POST:([\w-]+)\}\}/g, (_, sl) => { const g = guias.find(x => x.slug === sl); if (g) return guiaCard(g).replace('post guia', 'post'); const p = posts.find(x => x.slug === sl); return p ? postCard(p) : ''; })
    .replace(/\{\{ULTIMOS:(\d+)\}\}/g, (_, n) => posts.slice(0, +n).map(postCard).join('\n'))
    .replace(/\{\{FAQ:([a-z,]+)\}\}/g, (_, c) => faqHtml(FAQ.filter(q => c === 'all' || c.split(',').includes(q.cat)), c === 'all'))
    .replaceAll('{{ICO_WA}}', ICO_WA);
}

// ---------- páginas ----------
mkdirSync(OUT, { recursive: true });
cpSync(path.join(ROOT, 'site/assets'), path.join(OUT, 's'), { recursive: true });
cpSync(path.join(ROOT, 'site/img'), path.join(OUT, 's/img'), { recursive: true });

const pagesDir = path.join(ROOT, 'site/pages');
const urls = [];
for (const f of readdirSync(pagesDir).filter(f => f.endsWith('.html'))) {
  const raw = readFileSync(path.join(pagesDir, f), 'utf8');
  const meta = JSON.parse(raw.match(/<!--meta([\s\S]*?)-->/)[1]);
  let body = fill(raw.replace(/<!--meta[\s\S]*?-->/, ''));
  const ld = [];
  if (meta.medicos) ld.push(...MEDICOS_LD);
  if (meta.medico) ld.push({ ...MEDICOS_LD[meta.medico === 'pedro' ? 0 : 1], url: `${SITE}${meta.url}`, image: `${SITE}/s/img/${meta.medico === 'pedro' ? 'dr-pedro' : 'dra-julia'}.jpg`, description: meta.description });
  if (meta.faq) ld.push(faqLd(FAQ.filter(q => meta.faq === 'all' || meta.faq.split(',').includes(q.cat))));
  if (meta.faqItems) { ld.push(faqLd(meta.faqItems)); body = body.replace('{{FAQITEMS}}', faqHtml(meta.faqItems, false)); }
  if (meta.ld) ld.push(...meta.ld);
  const crumbs = meta.url === '/' ? null : [['Início', '/'], ...(meta.parent ? [meta.parent] : []), [meta.crumb || meta.title.split(/ [·|] /)[0], meta.url]];
  write(path.join(meta.url, 'index.html'), layout({ ...meta, body, ld, crumbs }));
  urls.push(meta.url);
}

// blog: lista
const blogBody = `<section class="phead"><div class="wrap">
  <div class="crumbs" data-in><a href="/">Início</a> · Blog</div>
  <span class="kick" data-in>Conteúdo educativo</span>
  <h1>Guias e artigos</h1>
  <p class="lead" data-in>Textos curtos e revisados pela equipe médica sobre pele, cabelo, metabolismo e saúde da mulher. Informação para entender, não para se automedicar.</p>
</div></section>
<section class="pad-s"><div class="wrap">
  <div class="chips filters" data-filter-group="#lista"><button aria-pressed="true" data-f="all">Todos</button>${Object.entries(CAT_NOME).map(([k, v]) => `<button aria-pressed="false" data-f="${k}">${v}</button>`).join('')}<button aria-pressed="false" data-f="a-pedro">Dr. Pedro</button><button aria-pressed="false" data-f="a-julia">Dra. Júlia</button></div>
  <div class="posts" id="lista">
${guias.map(guiaCard).join('\n')}
${posts.map(postCard).join('\n')}
  </div>
</div></section>`;
write('blog/index.html', layout({ title: 'Blog: pele, cabelo e metabolismo | Curae Santé', description: 'Conteúdo educativo revisado pela equipe médica da Curae Santé sobre pele, cabelo, emagrecimento e saúde hormonal feminina.', url: '/blog/', nav: 'blog', body: blogBody, crumbs: [['Início', '/'], ['Blog', '/blog/']] }));
urls.push('/blog/');

const SVC = [
  [/tirzepatida|semaglutida|emagrec|peso|obesidade|massa muscular|fome|dieta|plateau|álcool|sono/i, '/servicos/programa-de-emagrecimento/', 'programa de emagrecimento'],
  [/menopausa|perimenopausa|hormon/i, '/servicos/menopausa-e-insonia/', 'menopausa e insônia'],
  [/insulina|glicada|esteatose|fígado|cortisol|tireoid|ferritina|ferro|cardiovascular/i, '/servicos/investigacao-metabolica/', 'investigação metabólica'],
  [/toxina|botox|harmoniza|ruga/i, '/servicos/toxina-botulinica/', 'toxina botulínica'],
  [/bioestimul|flacidez|colágeno|envelhecimento/i, '/servicos/bioestimuladores-de-colageno/', 'bioestimuladores de colágeno'],
  [/mancha na pele|pinta|cisto|lipoma/i, '/servicos/retirada-de-cisto-lipoma-e-pintas/', 'retirada de cistos, lipomas e pintas'],
];
const svcLink = (p) => SVC.filter(([re]) => re.test(p.title + ' ' + (p.tags || []).join(' '))).slice(0, 2).map(([, u, t]) => `<a href="${u}" style="color:var(--dour)">${t}</a>`).join(' e ');
// blog: posts
const related = (p) => posts.filter(o => o !== p && o.cats.some(c => p.cats.includes(c))).slice(0, 3);
for (const p of posts) {
  const html = micromark(p.body, { extensions: [gfm()], htmlExtensions: [gfmHtml()] }).replace(/<h1[^>]*>[\s\S]*?<\/h1>/, '');
  const mod = p.atualizado || p.data;
  const autorLd = /pedro/i.test(p.autor) ? { '@id': `${SITE}/#dr-pedro` } : /j[uú]lia/i.test(p.autor) ? { '@id': `${SITE}/#dra-julia` } : { '@type': 'Organization', name: 'Curae Santé' };
  const body = `<section class="phead"><div class="wrap narrow">
  <div class="crumbs" data-in><a href="/">Início</a> · <a href="/blog/">Blog</a> · ${esc(CAT_NOME[p.cats[0]])}</div>
  <h1 style="font-size:clamp(42px,6vw,76px);max-width:none">${esc(p.title)}</h1>
  <p class="lead" data-in>${esc(p.resumo)}</p>
  <div class="ameta" data-in><span>${esc(p.autor || 'Curae Santé')}</span><span>${dataBR(p.data)}</span>${mod !== p.data ? `<span>Atualizado em ${dataBR(mod)}</span>` : ''}<span>Leitura de ${Math.max(2, Math.round(p.body.split(/\s+/).length / 200))} min</span></div>
</div></section>
<article class="pad-s"><div class="wrap narrow art">
${p.capa ? `<figure style="margin-top:0"><img src="${p.capa}" alt="${esc(p.capaAlt || '')}" width="1200" height="750"><figcaption>Imagem ilustrativa${p.capaCred && p.capaCred.fotografo ? ` · Foto: ${esc(p.capaCred.fotografo)}/Pexels` : ' · Pexels'}</figcaption></figure>` : ''}
${html}
<div class="tags">${(p.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
<p class="note" style="margin-top:30px">Conteúdo informativo. Não substitui a consulta. A indicação de qualquer tratamento depende de avaliação médica individual.</p>
<div class="ctabox"><h3>Quer conversar sobre o seu caso?</h3><p>Na consulta, a equipe ouve sua história, examina e explica as opções com calma.${svcLink(p) ? ` Conheça também: ${svcLink(p)}.` : ''}</p><a class="btn gold" href="${waLink(`Olá! Li o artigo "${p.title}" no site e quero agendar uma consulta.`)}" target="_blank" rel="noopener">Falar com a clínica</a></div>
</div></article>
${related(p).length ? `<section class="pad-s cr"><div class="wrap"><span class="kick">Leia também</span><h2 style="font-size:clamp(32px,4vw,48px)">Artigos relacionados</h2><div class="posts">${related(p).map(postCard).join('')}</div></div></section>` : ''}`;
  const ld = [...MEDICOS_LD, { '@type': 'BlogPosting', headline: p.title, description: p.resumo, datePublished: p.data, dateModified: mod, image: p.capa ? `${SITE}${p.capa}` : undefined, author: autorLd, publisher: { '@id': `${SITE}/#clinica` }, mainEntityOfPage: `${SITE}/blog/${p.slug}/`, keywords: (p.tags || []).join(', '), inLanguage: 'pt-BR' }];
  write(`blog/${p.slug}/index.html`, layout({ title: seoTitle(p.title), description: p.resumo.length > 160 ? p.resumo.slice(0, 157).replace(/\s+\S*$/, '') + '…' : p.resumo, url: `/blog/${p.slug}/`, nav: 'blog', body, ld, ogType: 'article', ogImage: p.capa || '/og-image.jpg', crumbs: [['Início', '/'], ['Blog', '/blog/'], [p.title, `/blog/${p.slug}/`]] }));
  urls.push(`/blog/${p.slug}/`);
}

// guias (sem botão de agendamento: páginas com fotos clínicas, só educativas)
for (const g of guias) {
  const ld = [...MEDICOS_LD, ...(g.ld || [])];
  if (g.faq) ld.push(faqLd(g.faq));
  const body = fill(g.html).replace('{{GUIA_FAQ}}', g.faq ? faqHtml(g.faq, false) : '').replace('{{OUTROS_GUIAS}}', [...guias.filter(o => o !== g).map(guiaCard), ...posts.filter(o => o.cats.some(c => g.cats.includes(c))).slice(0, 3).map(postCard)].join(''));
  write(`blog/${g.slug}/index.html`, layout({ title: g.title, description: g.description, url: `/blog/${g.slug}/`, nav: 'blog', body, ld, cta: false, ogType: 'article', ogImage: g.og || g.capa || '/og-image.jpg', crumbs: [['Início', '/'], ['Blog', '/blog/'], [g.titulo, `/blog/${g.slug}/`]] }));
  urls.push(`/blog/${g.slug}/`);
}

// sitemap
const hoje = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${hoje}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`site estático: ${urls.length} páginas em ${OUT}`);
