// Service Worker for push notifications
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/logo.jpg',
      badge: '/logo.jpg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Chat',
          icon: '/logo.jpg'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/logo.jpg'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()

  if (event.action === 'explore') {
    // Open the admin chat page
    event.waitUntil(
      clients.openWindow('/admin/chat')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close()
  } else {
    // Default action - open admin chat
    event.waitUntil(
      clients.openWindow('/admin/chat')
    )
  }
})

self.addEventListener('install', function(event) {
  console.log('Service Worker installing')
  self.skipWaiting()
})

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating')
  event.waitUntil(self.clients.claim())
})
