'use strict';

const VERSION = 'v1.0.0';
const SHELL_CACHE = `pwa-shell-${VERSION}`;
const RUNTIME_CACHE = `pwa-runtime-${VERSION}`;
const FONT_CACHE = `pwa-fonts-${VERSION}`;

const CORE_ASSETS = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/api/dictionary',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch((error) => console.error('[ServiceWorker] Failed to precache core assets', error))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![SHELL_CACHE, RUNTIME_CACHE, FONT_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate') {
      event.respondWith(networkFirst(request, SHELL_CACHE, '/offline'));
      return;
    }

    if (url.pathname.startsWith('/api/dictionary')) {
      event.respondWith(networkFirst(request, RUNTIME_CACHE));
      return;
    }

    if (url.pathname.startsWith('/_next/static/') || STATIC_ASSET_PATTERN.test(url.pathname)) {
      event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
      return;
    }
  }

  if (url.origin.includes('fonts.googleapis.com')) {
    event.respondWith(staleWhileRevalidate(request, FONT_CACHE));
    return;
  }

  if (url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }
});

const STATIC_ASSET_PATTERN = /\.(?:js|css|svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/;

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    return cached;
  }

  return (await fetchPromise) || cached || Response.error();
}

async function networkFirst(request, cacheName, fallbackPath) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    if (fallbackPath) {
      const fallbackResponse = await caches.match(fallbackPath);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    throw error;
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response && response.status === 200) {
    cache.put(request, response.clone());
  }
  return response;
}
