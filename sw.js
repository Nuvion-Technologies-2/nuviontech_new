const CACHE = 'nuvion-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/shapes.css',
  '/resp.css',
  '/index.js',
  '/404.html',
  '/contact.html',
  '/policy.html',
  '/terms.html',
  '/loader.html',
  '/ads.txt',
  '/CNAME',
  '/img/banner_logo_transparent.png',
  '/img/logo_nt.png',
  '/img/NuvionLogoV2.png',
  '/img/nuvion-black-cropped.png',
  '/img/shivam.jpeg',
  '/img/om.jpeg',
  '/img/harsh.jpeg',
  '/img/samarth.jpeg',
  '/img/gsa2.png',
  '/img/cmt.png',
  '/img/gamezotic.png',
  '/img/sahitya.png',
  '/img/django.png',
  '/img/react.png',
  '/img/react_native_3.png',
  '/img/node_js.png',
  '/img/flutter.png',
  '/img/aws.png',
  '/img/bg.jpg',
  '/img/bg.png',
  '/img/bg.jpeg',
  '/img/bg2.png',
  '/img/bg3.png',
  '/img/contact.jpg',
  '/img/contact.png',
  '/img/team.jpg',
  '/img/client.jpg',
  '/img/client.06170f6f78b1.jpg',
  '/img/inno.jpg',
  '/img/digi.png',
  '/img/zs.png',
  '/img/car.png',
  '/img/cmt.png',
  '/waterpark_asset/wp1.jpg',
  '/waterpark_asset/wp4.jpg',
  '/waterpark_asset/Slider1.jpeg',
  '/waterpark_asset/Waterpark.png',
  '/waterpark_asset/Waterslide.png',
  '/waterpark_asset/Waterparkride.png',
  '/waterpark_asset/pool.png',
  '/waterpark_asset/logo.png',
  '/waterpark_asset/map.png',
  '/waterpark_asset/map2.png',
  '/waterpark_asset/map3.png',
  '/waterpark_asset/map4.png',
  '/waterpark_asset/event.jpg',
  '/waterpark_asset/event2.jpg',
  '/waterpark_asset/event3.jpg',
  '/waterpark_asset/event4.jpg',
  '/waterpark_asset/event5.jpg',
  '/waterpark_asset/event6.jpg',
  '/waterpark_asset/kudarat-logo.png',
  '/waterpark_asset/7ocean-logo.png',
  '/audio/scroll-hero.wav',
  '/audio/scroll-about.wav',
  '/audio/scroll-services.wav',
  '/audio/scroll-tech.wav',
  '/audio/scroll-projects.wav',
  '/audio/scroll-team.wav',
  '/audio/scroll-contact.wav',
  '/audio/pop.wav',
  '/audio/water-drop.wav',
  '/audio/whoosh.wav',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(PRECACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        }
        return response;
      }).catch(function() {
        return caches.match('/404.html');
      });
    })
  );
});
