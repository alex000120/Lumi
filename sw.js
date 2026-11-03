/* Service worker de Aula Lumi: la app abre sin internet y recuerda las librerías externas tras la primera visita.
   Sube CACHE de versión cada vez que cambies archivos para que los usuarios reciban la actualización. */
const CACHE = 'lumi-v72';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'css/style.css', 'css/party.css', 'css/ui.css', 'css/layout.css', 'css/tools.css', 'css/teach.css', 'css/teach2.css', 'css/teach3.css', 'css/teach4.css', 'css/teach5.css', 'css/teach6.css', 'css/teach7.css', 'css/teach8.css', 'css/teach10.css', 'css/teach11.css', 'css/teach12.css', 'css/teach13.css', 'css/teach14.css', 'css/teach15.css', 'css/themefx.css','css/classfx.css','css/themetalk.css','css/player.css', 'css/holo.css', 'css/sync.css', 'css/board2.css', 'css/beat.css', 'css/lumi2.css', 'js/sync.js', 'js/teach.js', 'js/teach2.js', 'js/teach3.js', 'js/teach4.js', 'js/teach5.js', 'js/teach6.js', 'js/teach7.js', 'js/teach8.js', 'js/teach9.js', 'js/teach10.js', 'js/teach11.js', 'js/teach12.js', 'js/teach13.js', 'js/teach14.js', 'js/teach15.js', 'js/themefx.js','js/classfx.js','js/themetalk.js','js/player.js', 'js/beat.js', 'js/graf3d.js', 'js/holo.js', 'js/tools2.js', 'icons/icon-192.png', 'icons/icon-512.png',
  'js/store.js', 'js/bond.js', 'js/mathfix.js', 'js/theme.js', 'js/gemini.js', 'js/board.js', 'js/avatar.js','js/looks.js', 'js/voice.js', 'js/shop.js', 'js/viz3d.js', 'js/export.js', 'js/layout.js', 'js/tools.js', 'js/app.js', 'js/party.js'];
const LIBS = ['https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css', 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js', 'https://cdn.jsdelivr.net/npm/three@0.176.0/examples/jsm/controls/OrbitControls.js'];
const HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CORE);
    await Promise.allSettled(LIBS.map(u => c.add(u))); // si falla alguna, se guardará más tarde al usarla
    self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('lumi-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  if (u.hostname === 'generativelanguage.googleapis.com') return; // la IA siempre va directa a internet
  const same = u.origin === location.origin;
  if (!same && !HOSTS.includes(u.hostname)) return;
  if (r.mode === 'navigate') { // página: red primero (versión nueva), caché si no hay internet
    e.respondWith(fetch(r).then(x => { const k = x.clone(); caches.open(CACHE).then(c => c.put('index.html', k)); return x }).catch(() => caches.match('index.html')));
    return;
  }
  // todo lo demás: caché primero y se actualiza en segundo plano
  e.respondWith((async () => {
    const c = await caches.open(CACHE), hit = await c.match(r, { ignoreSearch: same });
    const net = fetch(r).then(x => { if (x && (x.ok || x.type === 'opaque')) c.put(r, x.clone()); return x }).catch(() => null);
    return hit || (await net) || new Response('', { status: 504 });
  })());
});
