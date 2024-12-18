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
  // 新しいService Workerをすぐにアクティブにする
  self.skipWaiting();
});

// アクティベーション時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // 新しいService Workerをすぐに制御下に置く
  self.clients.claim();
});

// ネットワークファーストの戦略を実装
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // レスポンスのクローンを作成してキャッシュに保存
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // ネットワークが利用できない場合はキャッシュから返す
        return caches.match(event.request);
      })
  );
});