const CACHE_NAME = 'toilet-smash-v1';
const basePath = '/van-toilet-smash';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        `${basePath}/`,
        `${basePath}/sp`,
        `${basePath}/sp/battle`,
        `${basePath}/manifest.webmanifest`,
        `${basePath}/icons/icon-192x192.png`,
        `${basePath}/icons/icon-512x512.png`
      ]);
    })
  );
});