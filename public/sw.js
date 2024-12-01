// public/sw.js
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('toilet-smash-v1').then(function(cache) {
      return cache.addAll([
        '/van-toilet-smash/',
        '/van-toilet-smash/sp',
        '/van-toilet-smash/sp/battle',
        '/van-toilet-smash/manifest.json',
        '/van-toilet-smash/icons/icon.svg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return cacheName !== 'toilet-smash-v1';
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});