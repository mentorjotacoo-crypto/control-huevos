const CACHE = 'campo-v8';
const STATIC = ['./manifest.json', './icon-192.png', './icon-512.png', './logo.jpeg'];

// Instalar: cachear assets estaticos. NO skip aqui para que el banner pueda mostrarse.
self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
    // NO llamar skipWaiting() aqui — esperamos instruccion del usuario
});

// Activar: borrar caches viejos y tomar control
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch: HTML siempre desde red (actualizado siempre), assets desde cache
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, clone));
                    return res;
                })
                .catch(() => caches.match(e.request))
        );
        return;
    }

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

// El usuario apreta "Actualizar" en el banner → activar nueva version
self.addEventListener('message', e => {
    if (e.data === 'skipWaiting') self.skipWaiting();
});
