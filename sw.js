const CACHE_NAME = 'scoutpro-push-v1';
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('push', event => {
  let data = { title: 'SCOUTPRO · Agenda', body: 'Tenés una actividad próxima.', url: '/scout-pro-base-de-datos/' };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch (_) {
    try { if (event.data) data.body = event.data.text(); } catch (_) {}
  }
  event.waitUntil(self.registration.showNotification(data.title || 'SCOUTPRO · Agenda', {
    body: data.body || 'Tenés una actividad próxima.',
    icon: '/scout-pro-base-de-datos/favicon.ico',
    badge: '/scout-pro-base-de-datos/favicon.ico',
    tag: data.tag || 'scoutpro-agenda',
    data: { url: data.url || '/scout-pro-base-de-datos/' }
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || '/scout-pro-base-de-datos/', self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
    for (const client of clients) if (client.url.startsWith(self.location.origin) && 'focus' in client) { client.navigate(url); return client.focus(); }
    return self.clients.openWindow(url);
  }));
});