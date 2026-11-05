const CACHE_NAME = "pcp-portfolio-demo-v6";
const FILES_TO_CACHE = ["./", "./index.html", "./demo-data.js", "./manifest.json", "./icons/logo.svg"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))); self.skipWaiting(); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("pcp-portfolio-demo-") && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const allowed = FILES_TO_CACHE.map(file => new URL(file, self.registration.scope).href);
  if (url.origin !== self.location.origin || !allowed.includes(url.href)) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && response.type === "basic") { const copy = response.clone(); event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy))); }
    return response;
  }).catch(() => caches.match(event.request)));
});
