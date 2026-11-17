/* Service Worker — بيخلّي التطبيق يفتح أوفلاين.
   الاستراتيجية: الشبكة الأول للصفحة نفسها (عشان التحديثات توصل)،
   والكاش الأول للملفات اللي اسمها فيه بصمة (assets) لأنها ما بتتغيرش.
   أي طلب لجوجل (المزامنة) بيعدّي على الشبكة مباشرة من غير كاش. */

const VERSION = 'v2'
const CACHE = `magmafy-niche-${VERSION}`

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then((c) =>
      c.addAll(['./', './index.html', './manifest.webmanifest']).catch(() => undefined)
    )
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)

  /* المزامنة مع جوجل: شبكة فقط */
  if (url.hostname.endsWith('google.com') || url.hostname.endsWith('googleusercontent.com')) return

  /* طلبات من نطاق تاني: سيبها للمتصفح */
  if (url.origin !== self.location.origin) return

  /* صفحات التنقّل: شبكة أول، وكاش لو مفيش نت */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('./index.html', copy))
          return res
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    )
    return
  }

  /* باقي الملفات: كاش أول وتحديث في الخلفية */
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || fetched
    })
  )
})
