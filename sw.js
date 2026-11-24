const CACHE_NAME = 'champions-basketball-v05';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './drills.json',
  './manifest.json',
  './create_a_polished_vector_style_caeb6fe207.png',
  './figure-8-cone-weave.png',
  './one-hand-form-shooting.png',
  './layup-footwork-progression.png',
  './hesitation-and-go.png',
  './retreat-dribble-press-break.png',
  './give-and-go.png',
  './defensive-slide-box.png',
  './drop-step-pivot-footwork.png',
  './hit-find-go-rebounding.png',
  './catch-and-shoot-spots.png',
  './closeout-and-contain.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request)
        .then(cached => cached || caches.match('./index.html')))
  );
});
