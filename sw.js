const CACHE = "pong-fr-belle-epoque-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./fonts/playfair-display-600.woff2",
  "./fonts/playfair-display-700.woff2",
  "./fonts/playfair-display-900.woff2",
  "./fonts/eb-garamond-400.woff2",
  "./fonts/eb-garamond-600.woff2",
  "./fonts/eb-garamond-400-italic.woff2",
  "./monuments/moulin-rouge.jpg",
  "./monuments/sacre-coeur.jpg",
  "./monuments/cathedrale-reims.jpg",
  "./monuments/negresco.jpg",
  "./monuments/tour-eiffel.jpg",
  "./monuments/napoleon.jpg"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if(res && res.status === 200){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
