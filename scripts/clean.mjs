/* بنمسح مخرجات البناء القديمة في الجذر قبل كل بناء.
   emptyOutDir مقفول عشان outDir هو جذر المستودع، فالتنظيف يدوي ومحدود
   على الملفات اللي البناء بيولّدها فقط. */
import { rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const generated = ['assets', 'index.html', 'sw.js', 'manifest.webmanifest']

for (const name of generated) {
  await rm(new URL(name, `file://${root}`), { recursive: true, force: true })
}
console.log('cleaned:', generated.join(', '))
