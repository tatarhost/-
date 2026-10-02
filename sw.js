const CACHE_NAME = 'aether-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/auth.js',
    '/messaging.js',
    '/social.js',
    '/bots.js',
    '/app.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});

// Periodic Sync or Background Tasks could be used here for bot hosting
// For now, we simulate background work by ensuring the service worker stays alive
self.addEventListener('activate', (event) => {
    console.log('AETHER Service Worker activated');
});
