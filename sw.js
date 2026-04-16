const CACHE_NAME = 'freetexttospeech-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/favicon.png',
  '/og-image.svg',
  '/manifest.json',
  '/pages/vs-naturalreader.html',
  '/pages/vs-ttsmp3.html',
  '/pages/text-to-speech-for-studying.html',
  '/pages/text-to-speech-for-accessibility.html',
  '/pages/how-to-convert-text-to-audio.html'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(e.request).then(cached => {
        const networkFetch = fetch(e.request).then(response => {
          if (response.ok) cache.put(e.request, response.clone());
          return response;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    )
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
