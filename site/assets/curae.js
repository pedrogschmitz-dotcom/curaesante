/* Curae Santé · movimento do site (GSAP + ScrollTrigger + Lenis) */
(function () {
  const doc = document.documentElement;
  doc.classList.remove('no-js');
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
  });

  const pre = document.getElementById('pre');
  const header = document.getElementById('brand');
  const onScroll = () => header && header.classList.toggle('solid', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (!window.gsap || RM) { if (pre) pre.remove(); return; }
  gsap.registerPlugin(ScrollTrigger);

  // rolagem suave
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
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
  const h1 = document.querySelector('.hero h1, .phead h1');
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
    const chars = h1.closest('.hero') ? splitChars(h1) : splitWords(h1);
    const fades = h1.parentElement.querySelectorAll('[data-in]');
    gsap.set(chars, { yPercent: 110 });
    gsap.set(fades, { opacity: 0, y: 24 });
    if (document.querySelector('.hero .bg')) tl.fromTo('.hero .bg', { scale: 1.2 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, t0 - .1);
    tl.to(chars, { yPercent: 0, duration: 1.05, stagger: h1.closest('.hero') ? .035 : .06 }, t0 + .15)
      .to(fades, { opacity: 1, y: 0, duration: .9, stagger: .1 }, t0 + .55);
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

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
