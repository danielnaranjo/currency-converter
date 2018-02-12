importScripts('/cache-polyfill.js'); // eslint-disable-line

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
    .then((resp) => {
      // Cache hit - return response
      if (resp) {
        return resp;
      }
      const fetchRequest = event.request.clone();
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
          .catch(() => console.error('Could not open the cache!'));
        return response;
      });
    }));
});
