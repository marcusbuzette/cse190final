importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

const urls = ['/','index.html'];


var CACHE_NAME = 'example';
var urlsToCache = [
  '/'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['example'];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


if (workbox) {
	console.log(`Yay! Workbox is loaded 🎉`);
} else {
	console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
	new RegExp('.*\.js'),
	workbox.strategies.networkFirst()
	);

workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'css-cache',
})
  );

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'image-cache',
    plugins: [
    new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 25,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
    })
    ],
})
);


