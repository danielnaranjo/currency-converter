importScripts('/cache-polyfill.js');

const CACHE_NAME = 'cache';

// eslint-disable-next-line
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then(cache => cache.addAll(['/', '/scripts.js', '/styles.css']))
    .catch(err => console.error(err)));
});

// eslint-disable-next-line
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request)
    .then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      const fetchRequest = event.request.clone();
      // eslint-disable-next-line
      return fetch(fetchRequest).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open()
          .then((cache) => {
            cache.put(event.request, responseToCache);
          })
          .catch(err => console.error(err));
        return response;
      });
    }));
});
