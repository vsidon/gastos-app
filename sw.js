const VERSION = 'v4';
const CACHE = 'gastrapido-' + VERSION;

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll([
      './',
      './index.html',
      './dashboard.html',
      './manifest.json'
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
  // Network first — siempre jala lo más nuevo
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
