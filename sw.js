// Very basic service worker to pass PWA installability requirements
self.addEventListener('install', (e) => {
    // Skip waiting forces the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    // Claiming control ensures that updates to the service worker take effect immediately for all open clients.
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Simply pass through all requests to the network. 
    // This satisfies Chrome's requirement for a fetch handler to show the install prompt.
    e.respondWith(
        fetch(e.request).catch(() => {
            console.log("Offline mode - cannot fetch", e.request.url);
        })
    );
});
