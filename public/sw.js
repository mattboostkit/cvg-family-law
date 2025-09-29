// Service Worker for Emergency Access
// Critical for domestic abuse law firm - users may need emergency access offline
// Enhanced PWA features for offline-first emergency support

const CACHE_NAME = 'cvg-emergency-v2';
const STATIC_CACHE = 'cvg-static-v2';
const DYNAMIC_CACHE = 'cvg-dynamic-v2';

// Critical emergency resources that must be cached
const EMERGENCY_RESOURCES = [
  '/',
  '/contact',
  '/services/domestic-abuse',
  '/resources',
  '/emergency-contacts',
  '/api/emergency-contact',
];

// Static assets to cache
const STATIC_ASSETS = [
  '/logos/Logo_Flat.svg',
  '/images/Homepage.webp',
  '/favicon/',
  '/manifest.json',
];

// API endpoints that should be cached for offline use
const API_CACHE_PATTERNS = [
  '/api/emergency-contact',
  '/api/booking/availability',
];

// Critical pages for offline fallback
const CRITICAL_PAGES = [
  '/offline-emergency.html',
  '/offline-contact.html',
  '/offline-risk-assessment.html',
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing emergency service worker');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching emergency resources');
        // Cache emergency resources first
        return cache.addAll(EMERGENCY_RESOURCES);
      })
      .then(() => caches.open(STATIC_CACHE))
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Emergency service worker installed');
        // Force activation of new service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating emergency service worker');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Emergency service worker activated');
      return self.clients.claim();
    })
  );
});

// Cache-first strategy for emergency resources
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Emergency resources get cache-first strategy
  if (EMERGENCY_RESOURCES.some(resource => url.pathname === resource || url.pathname.startsWith(resource))) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('[SW] Serving from cache (emergency):', url.pathname);
            return response;
          }

          console.log('[SW] Fetching emergency resource:', url.pathname);
          return fetch(event.request).then((response) => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
        })
        .catch(() => {
          console.log('[SW] Offline emergency fallback');
          // Return offline emergency page if available
          return caches.match('/offline-emergency.html');
        })
    );
  }
  // Static assets get cache-first with network fallback
  else if (STATIC_ASSETS.some(asset => url.pathname.startsWith(asset))) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
        })
    );
  }
  // Default network-first for other requests
  else {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback to cache for failed requests
        return caches.match(event.request);
      })
    );
  }
});

// Background sync for emergency contact forms
self.addEventListener('sync', (event) => {
  if (event.tag === 'emergency-contact') {
    console.log('[SW] Background sync for emergency contact');
    event.waitUntil(syncEmergencyContact());
  }
});

async function syncEmergencyContact() {
  try {
    // Get pending emergency contacts from IndexedDB
    const pendingContacts = await getPendingEmergencyContacts();

    for (const contact of pendingContacts) {
      try {
        const response = await fetch('/api/emergency-contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contact),
        });

        if (response.ok) {
          await removePendingEmergencyContact(contact.id);
          console.log('[SW] Emergency contact synced successfully');
        }
      } catch (error) {
        console.error('[SW] Failed to sync emergency contact:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// IndexedDB helpers for offline emergency contacts
function openEmergencyDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EmergencyContacts', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('contacts')) {
        const store = db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

async function getPendingEmergencyContacts() {
  try {
    const db = await openEmergencyDB();
    const transaction = db.transaction(['contacts'], 'readonly');
    const store = transaction.objectStore('contacts');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error('[SW] Error getting pending contacts:', error);
    return [];
  }
}

async function removePendingEmergencyContact(id) {
  try {
    const db = await openEmergencyDB();
    const transaction = db.transaction(['contacts'], 'readwrite');
    const store = transaction.objectStore('contacts');

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error('[SW] Error removing pending contact:', error);
  }
}

// Enhanced caching strategies
async function cacheApiResponse(request, response) {
  const url = new URL(request.url);
  const isApiRequest = API_CACHE_PATTERNS.some(pattern => url.pathname.includes(pattern));

  if (isApiRequest && response && response.status === 200) {
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
  }
}

// Network-first strategy for dynamic content
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Cache successful responses
      cacheApiResponse(request, networkResponse);
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale-while-revalidate strategy for frequently updated content
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const networkFetch = fetch(request).then((response) => {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch((error) => {
    console.log('[SW] Network update failed:', error);
  });

  return cachedResponse || networkFetch;
}

// Enhanced fetch event handler with multiple strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isApiRequest = API_CACHE_PATTERNS.some(pattern => url.pathname.includes(pattern));

  // Emergency resources get cache-first strategy
  if (EMERGENCY_RESOURCES.some(resource => url.pathname === resource || url.pathname.startsWith(resource))) {
    event.respondWith(cacheFirstStrategy(event.request));
  }
  // API requests get network-first with cache fallback
  else if (isApiRequest) {
    event.respondWith(networkFirstStrategy(event.request));
  }
  // Dynamic content gets stale-while-revalidate
  else if (url.pathname.startsWith('/api/') && !isApiRequest) {
    event.respondWith(staleWhileRevalidateStrategy(event.request));
  }
  // Static assets get cache-first with network fallback
  else if (STATIC_ASSETS.some(asset => url.pathname.startsWith(asset))) {
    event.respondWith(cacheFirstStrategy(event.request));
  }
  // Default network-first for other requests
  else {
    event.respondWith(networkFirstStrategy(event.request));
  }
});

// Enhanced cache-first strategy with better error handling
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }

    console.log('[SW] Fetching resource:', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      const cache = await caches.open(caches.match(request) ? DYNAMIC_CACHE : STATIC_CACHE);
      cache.put(request, responseClone);
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Both cache and network failed for:', request.url);
    // Return offline fallback for critical pages
    if (request.destination === 'document') {
      return caches.match('/offline-emergency.html');
    }
    throw error;
  }
}

// Push notification support for appointment reminders
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  const options = {
    body: event.data ? event.data.text() : 'You have an upcoming appointment',
    icon: '/favicon/android-chrome-192x192.png',
    badge: '/favicon/android-chrome-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Appointment',
        icon: '/favicon/android-chrome-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon/android-chrome-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CVG Family Law - Appointment Reminder', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for multiple data types
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'emergency-contact') {
    event.waitUntil(syncEmergencyContact());
  } else if (event.tag === 'booking-form') {
    event.waitUntil(syncBookingForm());
  } else if (event.tag === 'chat-message') {
    event.waitUntil(syncChatMessage());
  }
});

// Sync booking forms when back online
async function syncBookingForm() {
  try {
    const pendingBookings = await getPendingBookings();
    console.log('[SW] Syncing pending bookings:', pendingBookings.length);

    for (const booking of pendingBookings) {
      try {
        const response = await fetch('/api/booking/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(booking.data),
        });

        if (response.ok) {
          await removePendingBooking(booking.id);
          console.log('[SW] Booking synced successfully');
        }
      } catch (error) {
        console.error('[SW] Failed to sync booking:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Booking sync failed:', error);
  }
}

// Sync chat messages when back online
async function syncChatMessage() {
  try {
    const pendingMessages = await getPendingChatMessages();
    console.log('[SW] Syncing pending messages:', pendingMessages.length);

    for (const message of pendingMessages) {
      try {
        const response = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message.data),
        });

        if (response.ok) {
          await removePendingChatMessage(message.id);
          console.log('[SW] Chat message synced successfully');
        }
      } catch (error) {
        console.error('[SW] Failed to sync chat message:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Chat sync failed:', error);
  }
}

// IndexedDB helpers for bookings
async function getPendingBookings() {
  try {
    const db = await openEmergencyDB();
    const transaction = db.transaction(['bookings'], 'readonly');
    const store = transaction.objectStore('bookings');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error('[SW] Error getting pending bookings:', error);
    return [];
  }
}

async function removePendingBooking(id) {
  try {
    const db = await openEmergencyDB();
    const transaction = db.transaction(['bookings'], 'readwrite');
    const store = transaction.objectStore('bookings');

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error('[SW] Error removing pending booking:', error);
  }
}

// IndexedDB helpers for chat messages
async function getPendingChatMessages() {
  try {
    const db = await openEmergencyDB();
    const transaction = db.transaction(['chat_messages'], 'readonly');
    const store = transaction.objectStore('chat_messages');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error('[SW] Error getting pending messages:', error);
    return [];
  }
}

async function removePendingChatMessage(id) {
  try {
    const db = await openEmergencyDB();
    const transaction = db.transaction(['chat_messages'], 'readwrite');
    const store = transaction.objectStore('chat_messages');

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error('[SW] Error removing pending message:', error);
  }
}

// Database upgrade for new object stores
function openEmergencyDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CVGEmergencyData', 2);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Emergency contacts store
      if (!db.objectStoreNames.contains('contacts')) {
        const contactStore = db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });
        contactStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Bookings store
      if (!db.objectStoreNames.contains('bookings')) {
        const bookingStore = db.createObjectStore('bookings', { keyPath: 'id', autoIncrement: true });
        bookingStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Chat messages store
      if (!db.objectStoreNames.contains('chat_messages')) {
        const chatStore = db.createObjectStore('chat_messages', { keyPath: 'id', autoIncrement: true });
        chatStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Periodic background sync for critical updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'emergency-updates') {
    event.waitUntil(updateEmergencyResources());
  }
});

// Update emergency resources in background
async function updateEmergencyResources() {
  try {
    console.log('[SW] Updating emergency resources in background');

    const criticalResources = [
      '/api/emergency-contact',
      '/services/domestic-abuse',
      '/resources'
    ];

    for (const resource of criticalResources) {
      try {
        const response = await fetch(resource);
        if (response && response.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(resource, response.clone());
          console.log('[SW] Updated emergency resource:', resource);
        }
      } catch (error) {
        console.log('[SW] Failed to update resource:', resource, error);
      }
    }
  } catch (error) {
    console.error('[SW] Background update failed:', error);
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});