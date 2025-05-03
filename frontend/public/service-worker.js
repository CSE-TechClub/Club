self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('club-cache').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/styles.css', // Add all static assets you want to cache
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  