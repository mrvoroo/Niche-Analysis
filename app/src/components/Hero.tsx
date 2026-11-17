import { Counter } from '@propeldata/ui-kit'
import { HERO_STATS, META, TOTAL_MAX, TOTAL_SCORE } from '../data'
import { Reveal, StatCard } from './ui'

const PCT = TOTAL_SCORE / TOTAL_MAX
const R = 84
const C = 2 * Math.PI * R

function verdict(pct: number) {
  if (pct >= 0.82) return 'ينفع بقوة'
  if (pct >= 0.66) return 'ينفع بشروط'
  if (pct >= 0.5) return 'يحتاج تضييق'
  return 'ابحث عن بديل'
}

export default function Hero() {
  return (
    <section className="section" id="top" style={{ paddingTop: 'clamp(40px, 6vw, 72px)' }}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">دراسة داخلية · {META.dateLabel}</p>
          <h1 className="h1">
            هل نيش <span className="grad-text">متاجر الأثاث والديكور</span> هو التخصص الصح لماجمافاي؟
          </h1>
          <p className="lead">
            تقييم مبني على ورقة اختيار التخصص (ستة فلاتر + بونص)، ومدعوم بأرقام سوق حديثة من تقارير 2026، مع تقييم صريح
            لموقعنا <a href={META.siteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--m-y)' }}>{META.site}</a>{' '}
            وقائمة تنفيذ نعلّم عليها كل ما نخلّص خطوة.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="grid grid--2" style={{ marginTop: 34, alignItems: 'center' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="score-ring">
                <svg viewBox="0 0 190 190" aria-hidden="true">
                  <defs>
                    <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#feda75" />
                      <stop offset="40%" stopColor="#d62976" />
                      <stop offset="100%" stopColor="#4f5bd5" />
                    </linearGradient>
                  </defs>
                  <circle cx="95" cy="95" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="13" />
                  <circle
                    cx="95"
                    cy="95"
                    r={R}
                    fill="none"
                    stroke="url(#ringGrad)"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - PCT)}
                  />
                </svg>
                <div className="score-ring__inner">
                  <div className="score-ring__num">
                    <Counter value={String(TOTAL_SCORE)} />
                  </div>
                  <div className="score-ring__den">من {TOTAL_MAX}</div>
                  <div className="score-ring__verdict">{verdict(PCT)}</div>
                </div>
              </div>
              <p className="stat__note" style={{ marginTop: 18, maxWidth: '44ch', marginInline: 'auto' }}>
                مجموع ورقة التقييم. للمقارنة: المرشح الفايز في المثال المعبّى بالملف أخد 29، وخطة (ب) أخدت 23.
                ومفيش فلتر عندنا وقع في قاعدة النقطة الوحدة.
                <br />
                <span style={{ color: 'var(--m-y)' }}>
                  التقدير الأولي كان 25.5 قبل معرفة موضوع أبو عبدالله — البونص طلع من +2 لـ +3 لأن المرجع الداخلي ميزة
                  حقيقية حسب الملف.
                </span>
              </p>
            </div>

            <div className="card">
              <h3 className="h3">الخلاصة في أربع نقاط</h3>
              <ul className="list">
                <li>
                  <span className="bullet bullet--good">✓</span>
                  <span>
                    <b>النيش ينفع.</b> تذكرة الزبون عالية، وأصحاب المعارض المتوسطة بنوصلهم على واتساب وإنستغرام، وعددهم أكبر
                    من الحد اللي الملف بيطلبه.
                  </span>
                </li>
                <li>
                  <span className="bullet bullet--warn">!</span>
                  <span>
                    <b>بس بشروط.</b> الإسكان بيبرد والاقتصاد متقلّب، فالنتيجة بتحتاج تضييق جغرافي وعرض مبني على عائد واضح.
                  </span>
                </li>
                <li>
                  <span className="bullet bullet--bad">×</span>
                  <span>
                    <b>أخطر عيب مش في النيش، في الموقع.</b> أرقام من غير مصدر، وأربع خدمات بتفرّق الرسالة، وفورم بتطلب من
                    العميل يشخّص نفسه.
                  </span>
                </li>
                <li>
                  <span className="bullet bullet--good">★</span>
                  <span>
                    <b>البونص حقيقي.</b> أبو عبدالله بخبرته في التنجيد من الكويت = لغة المجال وحكم فني على وعودنا، والملف
                    بيحسبها نقاط إضافية.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="grid grid--4" style={{ marginTop: 22 }}>
            {HERO_STATS.map((s) => (
              <StatCard key={s.label} stat={s} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
