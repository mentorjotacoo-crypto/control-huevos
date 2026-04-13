const CACHE = 'campo-v9';
// Solo cachear assets estaticos — el HTML NUNCA se cachea (siempre viene fresco de la red)
const STATIC = ['./manifest.json', './icon-192.png', './icon-512.png', './logo.jpeg'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
    // Activar inmediatamente para reemplazar versiones viejas del SW
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    // NUNCA interceptar navegacion HTML — el browser lo pide directo a la red
    // Esto garantiza que el PWA siempre cargue el codigo mas reciente
    if (e.request.mode === 'navigate') return;

    // Para assets estaticos (iconos, manifest, etc): cache primero
    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(res => {
                if (res && res.ok) {
                    const clone = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, clone));
                }
                return res;
            });
        })
    );
});

self.addEventListener('message', e => {
    if (e.data === 'skipWaiting') self.skipWaiting();
});
