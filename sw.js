// Service worker mínimo: guarda esta página de entrada para que la app abra rápido.
// Los datos NO pasan por acá: la web de Google se carga adentro y siempre está al día.
var CACHE = 'gastos-entrada-v4';
var ARCHIVOS = ['./', 'manifest.webmanifest', 'icono-192.png', 'icono-512.png', 'icono-maskable-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (new URL(e.request.url).origin !== self.location.origin) return;
  // Primero internet (para tener siempre la última versión); si no hay, lo guardado.
  e.respondWith(fetch(e.request).then(function (r) {
    var copia = r.clone();
    caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
    return r;
  }).catch(function () { return caches.match(e.request); }));
});
