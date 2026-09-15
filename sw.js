const CACHE_VERSION = "blaise-0";
const OFFLINE_URL   = "/blaise/offline.html";

const PRECACHE_URLS = [
    "/blaise/",
    "/blaise/404.html",
    "/blaise/assets/after.png",
    "/blaise/assets/before.png",
    "/blaise/assets/favicons/apple-touch-icon.png",
    "/blaise/assets/favicons/favicon-96x96.png",
    "/blaise/assets/favicons/favicon.ico",
    "/blaise/assets/favicons/favicon.svg",
    "/blaise/assets/favicons/web-app-manifest-144x144.png",
    "/blaise/assets/favicons/web-app-manifest-192x192.png",
    "/blaise/assets/favicons/web-app-manifest-512x512.png",
    "/blaise/assets/sprite.svg",
    "/blaise/docs.html",
    "/blaise/index.html",
    "/blaise/offline.html",
    "/blaise/pricing.html",
    "/blaise/reference.html",
    "/blaise/script.js",
    "/blaise/signin.html",
    "/blaise/signup.html",
    "/blaise/site.webmanifest",
    "/blaise/style.css",
    "/blaise/libs/basecoat-all.min.js",
    "/blaise/libs/basecoat-vega.min.css",
    "/blaise/libs/tailwindcss-browser@4.js",
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