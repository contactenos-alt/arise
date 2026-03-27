const CACHE = 'arise-system-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './assets/icon-192.svg',
  './assets/icon-512.svg',
  './modules/core/constants.js',
  './modules/core/player.js',
  './modules/core/missions.js',
  './modules/core/achievements.js',
  './modules/core/shadows.js',
  './modules/core/timer.js',
  './modules/data/storage.js',
  './modules/ui/render.js',
  './modules/ai/systemVoice.js',
  './components/chart.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') return response;
          const cloned = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
