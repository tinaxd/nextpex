const CACHE_VERSION = 'v1';

const urlsToCache = [
    'level.html',
    'rank.html',
    'check.html',
    'chart.css',
    'rank.css',
    'check.css',
    'menu.css',
    'js/loadsw.js',
    'js/level.js',
    'js/rank.js',
    'js/check.js',
    'js/config.js',
    'js/menu.js',
    'js/RGBmodifier.js',
    'js/util.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(event.request.clone())
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        caches.open(CACHE_VERSION)
                            .then((cache) => {
                                cache.put(event.request, response.clone());
                            });

                        return response;
                    });
            })
    );
});