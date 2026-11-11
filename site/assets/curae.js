/* Curae Santé · movimento do site (GSAP + ScrollTrigger + Lenis) */
(function () {
  const doc = document.documentElement;
  doc.classList.remove('no-js');
  // sempre abrir a página no topo (exceto quando o link aponta para uma seção)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const toTop = () => { if (location.hash) return; window.scrollTo(0, 0); if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true }); };
  toTop(); window.addEventListener('pageshow', () => { toTop(); requestAnimationFrame(toTop); setTimeout(toTop, 60); setTimeout(toTop, 300); });
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) doc.classList.add('rm');

  // menu do celular
  const burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('#mnav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  // filtros (FAQ e blog)
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const target = document.querySelector(group.dataset.filterGroup);
    group.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      group.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
      const f = b.dataset.f;
      target.querySelectorAll('[data-cat]').forEach(el => { el.hidden = f !== 'all' && !el.dataset.cat.split(' ').includes(f); });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }));
    const want = new URLSearchParams(location.search).get('f');
    const pre = want && group.querySelector(`button[data-f="${want}"]`);
    if (pre) pre.click();
  });

  const pre = document.getElementById('pre');
  const header = document.getElementById('brand');
  const onScroll = () => header && header.classList.toggle('solid', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (!window.gsap || RM) { if (pre) pre.remove(); return; }
  gsap.registerPlugin(ScrollTrigger);

  // rolagem suave
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true }); window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    if (!location.hash) lenis.scrollTo(0, { immediate: true });
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -70 }); }
    }));
  }

  function splitWords(el) {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const i = document.createElement('span'); i.textContent = p; w.appendChild(i); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(el); return el.querySelectorAll('.w > span');
  }
  function splitChars(el) {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(word => {
          if (!word) return;
          if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(' ')); return; }
          const wd = document.createElement('span'); wd.className = 'wd';
          [...word].forEach(c => { const w = document.createElement('span'); w.className = 'w'; const i = document.createElement('span'); i.textContent = c; w.appendChild(i); wd.appendChild(w); });
          frag.appendChild(wd);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(el); return el.querySelectorAll('.w > span');
  }

  // entrada: hero (início) ou cabeçalho de página
  const h1 = document.querySelector('.hero h1, .phead h1, .prof-hero h1');
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  let t0 = .1;
  let seen = false; try { seen = sessionStorage.getItem('cs_pre') === '1'; sessionStorage.setItem('cs_pre', '1'); } catch (e) {}
  if (pre && !seen) {
    tl.to('#pre img', { opacity: 1, duration: .6 }, .1)
      .to('#pre .bar', { scaleX: 1, duration: .9, ease: 'power2.inOut' }, .1)
      .to('#pre', { yPercent: -100, duration: .9, ease: 'power4.inOut' }, 1.1)
      .add(() => pre.remove());
    t0 = 1.35;
  } else if (pre) pre.remove();
  if (h1) {
    const big = h1.closest('.hero, .prof-hero');
    const chars = big ? splitChars(h1) : splitWords(h1);
    const fades = h1.parentElement.querySelectorAll('[data-in]');
    gsap.set(chars, { yPercent: 110 });
    gsap.set(fades, { opacity: 0, y: 24 });
    if (document.querySelector('.hero .bg')) tl.fromTo('.hero .bg', { scale: 1.2 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, t0 - .1);
    tl.to(chars, { yPercent: 0, duration: 1.05, stagger: big ? .035 : .06 }, t0 + .15)
      .to(fades, { opacity: 1, y: 0, duration: .9, stagger: .1 }, t0 + .55);
  }

  if (document.querySelector('.prof-hero')) {
    tl.fromTo('.prof-hero .ph-big', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'power4.inOut' }, t0 - .2)
      .fromTo('.prof-hero .ph-big img', { scale: 1.25 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, t0 - .2);
    gsap.to('.prof-hero .ph-big img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.prof-hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
  // hero: parallax e luz
  if (document.querySelector('.hero')) {
    gsap.to('.hero .bg', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero .wrap', { yPercent: -24, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });
  }
  if (document.getElementById('leak')) gsap.to('#leak', { x: '60vw', y: '30vh', duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  // faixa de palavras
  const mq = document.querySelector('.marq .t');
  if (mq) {
    let mx = 0, vel = 0;
    ScrollTrigger.create({ onUpdate: s => { vel = s.getVelocity() / 300; } });
    gsap.ticker.add(() => { const half = mq.scrollWidth / 2; mx -= 1 + Math.abs(vel); vel *= .92; if (-mx >= half) mx += half; mq.style.transform = `translate3d(${mx}px,0,0)`; });
  }

  gsap.utils.toArray('[data-fade]').forEach(el => gsap.from(el, { opacity: 0, y: 36, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
  gsap.utils.toArray('[data-stagger]').forEach(el => gsap.from(el.children, { opacity: 0, y: 40, duration: .9, ease: 'power3.out', stagger: .09, scrollTrigger: { trigger: el, start: 'top 88%' } }));
  gsap.utils.toArray('[data-split]').forEach(el => {
    const ws = splitWords(el);
    gsap.from(ws, { yPercent: 110, rotate: 3, duration: 1.1, ease: 'power4.out', stagger: .05, scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  gsap.utils.toArray('[data-clip]').forEach(el => gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0 round 24px)' }, { clipPath: 'inset(0% 0 0 0 round 24px)', duration: 1.4, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 88%' } }));
  gsap.utils.toArray('[data-par]').forEach(img => gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

  // texto que acende
  gsap.utils.toArray('.read').forEach(r => {
    const ws = splitWords(r); ws.forEach(s => s.parentElement.classList.add('rw'));
    gsap.to(r.querySelectorAll('.rw'), { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: r, start: 'top 80%', end: 'bottom 50%', scrub: true } });
  });

  // contadores
  gsap.utils.toArray('[data-count]').forEach(el => {
    const o = { v: 0 }, to = +el.dataset.count;
    gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' }, onUpdate: () => el.textContent = Math.round(o.v) });
  });

  // trilho horizontal travado (desktop) / empilhado (celular)
  const rail = document.getElementById('rail');
  if (rail) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      const dist = () => rail.scrollWidth - window.innerWidth + 48;
      gsap.to(rail, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#pil', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
    });
    mm.add('(max-width: 860px)', () => {
      rail.style.cssText = 'width:auto;flex-direction:column;padding:0 24px 90px';
      rail.querySelectorAll('.card').forEach(c => { c.style.width = '100%'; c.style.minHeight = '0'; });
      return () => { rail.style.cssText = ''; rail.querySelectorAll('.card').forEach(c => { c.style.width = ''; c.style.minHeight = ''; }); };
    });
  }

  // linha do processo
  document.querySelectorAll('.steps').forEach(st => {
    const fill = st.querySelector('.fill');
    if (fill) gsap.to(fill, { height: '100%', ease: 'none', scrollTrigger: { trigger: st, start: 'top 70%', end: 'bottom 60%', scrub: true } });
    st.querySelectorAll('.s').forEach(s => ScrollTrigger.create({ trigger: s, start: 'top 68%', onEnter: () => s.classList.add('on'), onLeaveBack: () => s.classList.remove('on') }));
  });

  // botões magnéticos
  if (matchMedia('(hover:hover)').matches) document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .3, duration: .4 }); });
    b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }));
  });

  window.addEventListener('load', () => { toTop(); ScrollTrigger.refresh(); toTop(); });
})();

/* Medição (só liga quando houver IDs em site/config.json) + aviso de cookies */
(function () {
  const C = window.CURAE_CFG || {};
  if (!C.ga4 && !C.metaPixel) return;
  const KEY = 'cs_consent';
  let choice = null; try { choice = localStorage.getItem(KEY); } catch (e) {}
  function load() {
    if (C.ga4 && !window.gtag) {
      const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.ga4; document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', C.ga4, { anonymize_ip: true });
    }
    if (C.metaPixel && !window.fbq) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', C.metaPixel); fbq('track', 'PageView');
    }
  }
  // clique no WhatsApp = conversão
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="wa.me"]'); if (!a) return;
    if (window.gtag) gtag('event', 'whatsapp_click', { page_path: location.pathname, link_text: (a.textContent || '').trim().slice(0, 60) });
    if (window.fbq) fbq('track', 'Contact');
  });
  if (choice === 'sim') return load();
  if (choice === 'nao') return;
  const bar = document.createElement('div');
  bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-label', 'Aviso de cookies');
  bar.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:95;max-width:560px;margin:0 auto;background:#2A1F14;color:#EAE4DA;border-radius:18px;padding:18px 20px;box-shadow:0 20px 50px rgba(0,0,0,.35);font:15px/1.5 "Red Hat Display",system-ui,sans-serif;display:flex;flex-wrap:wrap;gap:12px;align-items:center';
  bar.innerHTML = '<span style="flex:1 1 260px">Usamos cookies para medir as visitas e melhorar o site. Nenhum dado de saúde é coletado.</span><button data-c="nao" style="font:inherit;font-weight:700;background:none;border:1px solid rgba(234,228,218,.4);color:#EAE4DA;border-radius:99px;padding:9px 16px;cursor:pointer">Recusar</button><button data-c="sim" style="font:inherit;font-weight:700;background:#BCA78E;border:0;color:#2A1F14;border-radius:99px;padding:10px 18px;cursor:pointer">Aceitar</button>';
  bar.addEventListener('click', e => { const c = e.target.dataset && e.target.dataset.c; if (!c) return; try { localStorage.setItem(KEY, c); } catch (x) {} bar.remove(); if (c === 'sim') load(); });
  document.body.appendChild(bar);
})();
