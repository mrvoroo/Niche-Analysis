import { META, SITE_BAD, SITE_GOOD } from '../data'
import { Callout, Card, Reveal, Section, SourceLink } from './ui'

export default function SiteAudit() {
  return (
    <Section
      id="site"
      eyebrow="تقييم الموقع"
      title={`فحص ${META.site}`}
      lead="التقييم ده على الموقع المنشور حالياً. الأشياء الحلوة فيه حقيقية ولازم نحافظ عليها، والعيوب كلها قابلة للإصلاح في أسبوع."
    >
      <div className="grid grid--2">
        <Reveal>
          <Card title={`شغّال وحافظ عليه (${SITE_GOOD.length})`} icon="✓">
            <ul className="list">
              {SITE_GOOD.map((p) => (
                <li key={p.title}>
                  <span className="bullet bullet--good">✓</span>
                  <span>
                    <b>{p.title}.</b> {p.body}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        <Reveal delay={90}>
          <Card title={`محتاج تعديل (${SITE_BAD.length})`} icon="✎">
            <ul className="list">
              {SITE_BAD.map((p) => (
                <li key={p.title}>
                  <span className="bullet bullet--bad">×</span>
                  <span>
                    <b>{p.title}.</b> {p.body}
                    {p.evidence && (
                      <>
                        <br />
                        <span style={{ fontSize: '.84rem', color: 'var(--c-faint)' }}>
                          {p.evidence}
                          {p.srcKey && (
                            <>
                              {' '}
                              — <SourceLink srcKey={p.srcKey} />
                            </>
                          )}
                        </span>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <div style={{ marginTop: 22, display: 'grid', gap: 14 }}>
          <Callout icon="⚠">
            <b>أخطر بند في القائمة:</b> الأرقام غير المصدَّرة. إحنا كسبنا ثقة لمّا علّمنا الأمثلة إنها تجريبية، وبنخسرها
            لمّا نكتب «7x» في نفس الصفحة من غير مصدر. العميل اللي جرّب وكالة قبلنا بيعرف شكل الرقم المفبرك، والسوق ده
            فعلاً جرّب وكالات.
          </Callout>
          <Callout tone="info" icon="ℹ">
            <b>عن أرقام العرض ثلاثي الأبعاد تحديداً:</b> في دراسات حالة حقيقية سجّلت زيادات كبيرة في التحويل، لكن كلها من
            شركات بتبيع التقنية، وفي أسواق غير السعودية، والزيادة محسوبة على المتسوقين اللي تفاعلوا مع الأداة — ودول أصلاً
            أقرب للشراء. استخدمها كإشارة واذكر المصدر والسوق، وما تقدّمهاش كوعد لعميلك.
          </Callout>
        </div>
      </Reveal>
    </Section>
  )
}
