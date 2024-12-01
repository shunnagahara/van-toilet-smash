// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('toilet-smash-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/sp',
        '/sp/battle',
        '/manifest.json',
        '/icons/icon.svg',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== 'toilet-smash-v1')
          .map((name) => caches.delete(name))
      );
    })
  );
});