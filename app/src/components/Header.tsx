import logo from '../assets/img/logo-mark.webp'
import { useAppStore } from '../StoreContext'

export const ROUTES = [
  { id: '', label: 'التحليل', icon: '◈' },
  { id: 'candidates', label: 'مقارنة المرشحين', icon: '⚖' },
  { id: 'sheets', label: 'أوراق التخصص', icon: '▤' },
  { id: 'settings', label: 'الإعدادات', icon: '⚙' }
]

const dot: Record<string, { c: string; t: string }> = {
  off: { c: 'var(--c-faint)', t: 'محلي فقط' },
  idle: { c: 'var(--c-faint)', t: 'محلي فقط' },
  syncing: { c: 'var(--m-y)', t: 'بيزامن…' },
  ok: { c: 'var(--c-good)', t: 'متزامن مع جوجل شيت' },
  error: { c: 'var(--c-bad)', t: 'خطأ في المزامنة' }
}

export default function Header({ route }: { route: string }) {
  const { syncState } = useAppStore()
  const d = dot[syncState] ?? dot.off

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#/">
          <img src={logo} alt="ماجمافاي" width={34} height={34} />
          <span>
            ماجمافاي
            <small>تحليل النيش · نوفمبر 2026</small>
          </span>
        </a>

        <nav className="tabs" aria-label="أقسام التطبيق">
          {ROUTES.map((r) => (
            <a key={r.id} href={`#/${r.id}`} className={`tab${route === r.id ? ' is-active' : ''}`}>
              <span aria-hidden="true">{r.icon}</span>
              {r.label}
            </a>
          ))}
        </nav>

        <a className="sync-dot" href="#/settings" title={d.t} aria-label={d.t}>
          <i style={{ background: d.c }} className={syncState === 'syncing' ? 'is-pulsing' : ''} />
          <span>{d.t}</span>
        </a>
      </div>
    </header>
  )
}
