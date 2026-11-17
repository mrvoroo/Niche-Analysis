import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base = '/Niche-Analysis/' so the built site works on GitHub Pages
// at https://mrvoroo.github.io/Niche-Analysis/
export default defineConfig({
  base: '/Niche-Analysis/',
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1200
  }
})
