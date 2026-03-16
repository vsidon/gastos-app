const VERSION = 'v6';
const CACHE = 'gasterapido-' + VERSION;

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([
      '/gastos-app/',
      '/gastos-app/index.html',
      '/gastos-app/dashboard.html',
      '/gastos-app/manifest.json',
      '/gastos-app/icon-192.png',
      '/gastos-app/icon-512.png',
    ]))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network first — siempre intenta red, cae a caché solo si offline
  e.respondWith(
    fetch(e.request).then(r => {
      const clone = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
