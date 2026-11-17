import logo from '../assets/img/logo-mark.webp'

const LINKS = [
  { href: '#score', label: 'ورقة التقييم' },
  { href: '#market', label: 'أرقام السوق' },
  { href: '#swot', label: 'القوة والضعف' },
  { href: '#site', label: 'تقييم الموقع' },
  { href: '#tasks', label: 'قائمة التنفيذ' },
  { href: '#form', label: 'الفورم الجديد' },
  { href: '#bonus', label: 'البونص' }
]

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#top">
          <img src={logo} alt="ماجمافاي" width={34} height={34} />
          <span>
            ماجمافاي
            <small>تحليل النيش · نوفمبر 2026</small>
          </span>
        </a>
        <nav className="nav" aria-label="أقسام الصفحة">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
