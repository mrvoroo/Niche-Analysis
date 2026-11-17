import { META, SOURCES } from '../data'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <h2 className="h3" id="sources">
          المصادر ({SOURCES.length})
        </h2>
        <p style={{ fontSize: '.88rem', color: 'var(--c-muted)', maxWidth: '72ch', lineHeight: 1.75, margin: '0 0 18px' }}>
          كل رقم في الصفحة مربوط بمصدره. أرقام أحجام السوق بتختلف بين التقارير لأن كل واحد بيعرّف السوق بشكل مختلف، وده
          مذكور عند كل رقم. أي رقم تقديري مكتوب عليه «تقديري» صراحة.
        </p>
        <div className="sources">
          {SOURCES.map((s, i) => (
            <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </a>
          ))}
        </div>
        <p className="footer-meta">
          دراسة داخلية لماجمافاي · {META.dateLabel} · مبنية على معايير ورقة اختيار التخصص.
          <br />
          الموقع المُقيَّم:{' '}
          <a href={META.siteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--m-y)' }}>
            {META.site}
          </a>
          <br />
          شغلك (قائمة التنفيذ وأوراق التخصص) محفوظ في المتصفح بتاعك، ولو ربطت جوجل شيت من{' '}
          <a href="#/settings" style={{ color: 'var(--m-y)' }}>
            صفحة الإعدادات
          </a>{' '}
          بيتحفظ هناك كمان ويوصلك من أي جهاز.
        </p>
      </div>
    </footer>
  )
}
