/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({ request, url }: { request: Request; url: URL }) => request.mode === 'navigate' && !url.pathname.startsWith('/_') && !url.pathname.match(new RegExp('/[^/?]+\\.[^/]+$')),
    createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

registerRoute(({ url }) => url.origin === self.location.origin && url.pathname.includes('img/'),
    new StaleWhileRevalidate({
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({ maxEntries: 50 })
        ],
    })
);

self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') self.skipWaiting();
});