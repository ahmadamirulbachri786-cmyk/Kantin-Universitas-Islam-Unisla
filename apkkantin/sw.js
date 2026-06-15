const CACHE_NAME = 'kantin-unisla-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './admin.html',
    './merchant.html',
    './customer.html',
    './styles.css',
    './app.js',
    './assets/logo.png',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request);
        })
    );
});
