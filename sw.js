const CACHE = "catalyst-v2";

// Core assets to pre-cache on install
const PRECACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/css/main.css",
  "/js/navbar.js",
  "/js/footer.js",
  "/js/auth.js",
  "/js/avatars.js",
  "/js/utils.js",
  "/js/firebase-config.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Skip cross-origin requests (Firebase, Google Fonts, Unsplash, etc.)
  if (!request.url.startsWith(self.location.origin)) return;

  // Navigation requests (HTML pages) — network first, fallback to offline page
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  // CSS / JS assets — cache first, then network
  if (request.destination === "style" || request.destination === "script") {
    e.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
          return res;
        });
      })
    );
    return;
  }
});
