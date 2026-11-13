/* Estúdio Curae: funciona sem internet depois do primeiro acesso.
   Arquivos do app: busca na rede e guarda; sem rede, usa o guardado.
   Modelos grandes (mp/): guarda no primeiro uso e reaproveita. */
const V = 'estudio-v6';
const BASE = ['/estudio/', '/estudio/index.html', '/estudio/app.js', '/estudio/ui.js', '/estudio/canon.js', '/estudio/logos.js', '/estudio/mp/mp4-muxer.js', '/estudio/manifest.webmanifest', '/estudio/icon-192.png', '/estudio/icon-512.png', '/estudio/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(BASE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const pesado = u.pathname.startsWith('/estudio/mp/') && !u.pathname.endsWith('mp4-muxer.js');
  const fonte = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (pesado || fonte) { // cache primeiro
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })));
    return;
  }
  if (u.origin === location.origin && u.pathname.startsWith('/estudio/')) { // rede primeiro
    e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('/estudio/'))));
  }
});
