const CACHE_NAME = "pwa-cache-v1";
const URLS_TO_CACHE = [
    // "/namaz-vakti-site/src/",
    "/namaz-vakti-site/src/index.html",
    "/namaz-vakti-site/src/styles/",
    "/namaz-vakti-site/src/scripts/index.js",
    // "/namaz-vakti-site/src/manifest.json"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});
