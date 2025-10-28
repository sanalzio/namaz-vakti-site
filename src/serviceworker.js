"use strict";

const CACHE_NAME = "namaz-vakti-site-pwa-cache-v2";
/* const EXTRA_PATH =
    location.hostname == "localhost" || location.hostname == "127.0.0.1"
        ? ""
        : "/namaz-vakti-site"; */
const ASSETS = [
    // "../",
    //"./",
    "./index.html",
    "./about.html",
    "./styles/animations.css",
    "./styles/catppuccin.css",
    "./styles/dark.css",
    "./styles/light.css",
    "./styles/palette.css",
    "./styles/phone.css",
    "./styles/style.css",
    "./scripts/index.js"/* ,
    "../",
    "../index.html",
    "../about.html",
    "../styles/animations.css",
    "../styles/catppuccin.css",
    "../styles/dark.css",
    "../styles/light.css",
    "../styles/palette.css",
    "../styles/phone.css",
    "../styles/style.css",
    "../scripts/index.js" */
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys.map((k) => {
                        if (k !== CACHE_NAME) return caches.delete(k);
                    })
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    event.respondWith(
        caches.match(req).then(
            (cached) =>
                cached ||
                fetch(req)
                    .then((resp) => {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(req, resp.clone());
                            return resp;
                        });
                    })
                    .catch(() => {
                        if (req.mode === "navigate")
                            return caches.match("/namaz-vakti-site/src/index.html");
                    })
        )
    );
});
