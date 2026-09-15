const CACHE_VERSION = "blaise-0";
const OFFLINE_URL   = "./offline.html";

const PRECACHE_URLS = [
    "./",
    "./404.html",
    "./assets/after.png",
    "./assets/before.png",
    "./assets/favicons/apple-touch-icon.png",
    "./assets/favicons/favicon-96x96.png",
    "./assets/favicons/favicon.ico",
    "./assets/favicons/favicon.svg",
    "./assets/favicons/web-app-manifest-144x144.png",
    "./assets/favicons/web-app-manifest-192x192.png",
    "./assets/favicons/web-app-manifest-512x512.png",
    "./assets/sprite.svg",
    "./docs.html",
    "./index.html",
    "./offline.html",
    "./pricing.html",
    "./reference.html",
    "./script.js",
    "./signin.html",
    "./signup.html",
    "./site.webmanifest",
    "./style.css",
    "libs/basecoat-all.min.js",
    "libs/basecoat-vega.min.css",
    "libs/tailwindcss-browser@4.js",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) =>
            Promise.all(
                PRECACHE_URLS.map((url) =>
                    cache.add(url).catch((err) => console.warn("Precache failed:", url, err))
                )
            )
        )
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(
                    () => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
                )
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => cached);
        })
    );
});
