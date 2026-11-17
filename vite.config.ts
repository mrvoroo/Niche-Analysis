import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

/* المصدر في app/ والبناء بيطلع في جذر المستودع، عشان GitHub Pages
   يخدم الموقع سواء كان مضبوط على الجذر أو على فرع. و base نسبي ('./')
   عشان الموقع يشتغل من أي مسار من غير ما نعدّل أي حاجة. */
export default defineConfig({
  root: fileURLToPath(new URL('./app', import.meta.url)),
  base: './',
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  plugins: [react()],
  build: {
    outDir: fileURLToPath(new URL('./', import.meta.url)),
    emptyOutDir: false,
    chunkSizeWarningLimit: 1200
  }
})
