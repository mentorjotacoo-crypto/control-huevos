const CACHE = 'campo-v6';
const STATIC = ['./manifest.json', './icon-192.png', './icon-512.png', './logo.jpeg'];

// Instalar: cachear solo assets estaticos, NO el HTML
self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
    self.skipWaiting(); // activar inmediatamente sin esperar
});

// Activar: borrar caches viejos
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim(); // tomar control de todos los tabs abiertos
});

// Fetch: HTML siempre desde red, assets desde cache
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // Para el HTML principal: red primero, cache como respaldo
    if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    // Guardar copia fresca en cache
                    const clone = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, clone));
                    return res;
                })
                .catch(() => caches.match(e.request)) // sin internet: usar cache
        );
        return;
    }

    // Para assets: cache primero
    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(res => {
                const clone = res.clone();
                caches.open(CACHE).then(c => c.put(e.request, clone));
                return res;
            });
        })
    );
});

// Notificar a la app cuando hay nueva version
self.addEventListener('message', e => {
    if (e.data === 'skipWaiting') self.skipWaiting();
});
