const CACHE_NAME = 'calc-pro-v2';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json'
];

// Instalação: Baixa e salva os arquivos principais
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto e arquivos salvos');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting(); // Força o SW a ativar imediatamente
});

// Ativação: Limpa os caches antigos se a versão mudar
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Limpando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Assume o controle de todas as páginas abertas
});

// Interceptador: Estratégia Stale-While-Revalidate (Cache primeiro, rede depois)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            }).catch(() => {
                // Em caso de falha de rede (offline), usa o cache silenciosamente
            });

            return cachedResponse || fetchPromise;
        })
    );
});
