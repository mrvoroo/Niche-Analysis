import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@propeldata/ui-kit'
import App from './App'
import './styles.css'

/* ألوان ماجمافاي كـ tokens عشان مكوّنات Propel تطلع بنفس الهوية */
const brandTokens: React.CSSProperties = {
  // @ts-expect-error custom CSS variables for the Propel theme
  '--propel-accent': '#d62976',
  '--propel-accent-hover': '#962fbf',
  '--propel-bg-primary': 'transparent',
  '--propel-bg-secondary': 'rgba(14, 7, 22, 0.5)',
  '--propel-color-primary': '#fff4fa',
  '--propel-color-secondary': '#c7b6d6',
  '--propel-font-family': "'Tajawal', 'Inter', system-ui, sans-serif"
}

/* تسجيل الـ Service Worker عشان التطبيق يفتح أوفلاين وينفع يتثبّت على الموبايل */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = new URL('sw.js', document.baseURI).href
    navigator.serviceWorker.register(swUrl).catch(() => {
      /* التسجيل ممكن يفشل في وضع التصفح الخفي — التطبيق بيفضل شغّال عادي */
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider
      appearance="dark"
      accentColor="crimson"
      grayColor="mauve"
      radius="large"
      panelBackground="translucent"
      style={brandTokens}
    >
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
