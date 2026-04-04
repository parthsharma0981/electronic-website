const CACHE_NAME = 'ecore-store-cash-v1';

const selfWorker = self;

selfWorker.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache core assets for offline viewing
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/pwa-icon-192.png',
        '/pwa-icon-512.png',
      ]);
    })
  );
  selfWorker.skipWaiting();
});

selfWorker.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName !== CACHE_NAME) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
  selfWorker.clients.claim();
});

selfWorker.addEventListener('fetch', (event) => {
  const isApiRequest = event.request.url.includes('/api/');
  
  if (isApiRequest) {
    // Network first for API, fallback to cache if offline (optional)
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    // Cache first for static assets, fallback to network
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          // Cache successful fetch
          return caches.open(CACHE_NAME).then((cache) => {
            if (event.request.method === 'GET' && fetchResponse.status === 200) {
                cache.put(event.request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      }).catch(() => caches.match('/index.html')) // Fallback to index.html for SPA offline
    );
  }
});
