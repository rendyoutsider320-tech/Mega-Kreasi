const CACHE_NAME = 'nusalokal-v1';
const ASSETS = [
  '/',
  'index.html',
  'nusalokal_mockup.html',
  'nusalokal_courses.html',
  'nusalokal_chat.html',
  'nusalokal_profile.html',
  'nusalokal_forgot_password.html',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
