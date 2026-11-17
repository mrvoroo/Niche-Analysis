import { CHALLENGES, STRENGTHS, type Point } from '../data'
import { Card, Reveal, Section, SourceLink } from './ui'

function PointList({ points, tone }: { points: Point[]; tone: 'good' | 'bad' }) {
  return (
    <ul className="list">
      {points.map((p) => (
        <li key={p.title}>
          <span className={`bullet bullet--${tone}`}>{tone === 'good' ? '✓' : '×'}</span>
          <span>
            <b>{p.title}.</b> {p.body}
            {p.evidence && (
              <>
                {' '}
                <span style={{ color: 'var(--m-y)', fontSize: '.84rem' }}>({p.evidence})</span>
              </>
            )}
            {p.srcKey && (
              <>
                {' '}
                <span style={{ fontSize: '.78rem', color: 'var(--c-faint)' }}>
                  — <SourceLink srcKey={p.srcKey} />
                </span>
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function SwotSection() {
  return (
    <Section
      id="swot"
      alt
      eyebrow="الميزات والتحديات"
      title="ليه ينفع، وإيه اللي هنقابله"
      lead="المميزات بتقول ليه نكمّل. التحديات مش أسباب للتراجع، دي بنود لازم تظهر في التسعير وفي كلامنا مع العميل من أول مكالمة."
    >
      <div className="grid grid--2">
        <Reveal>
          <Card title={`المميزات (${STRENGTHS.length})`} icon="✓">
            <PointList points={STRENGTHS} tone="good" />
          </Card>
        </Reveal>
        <Reveal delay={90}>
          <Card title={`التحديات (${CHALLENGES.length})`} icon="⚠">
            <PointList points={CHALLENGES} tone="bad" />
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <div className="card" style={{ marginTop: 22 }}>
          <h3 className="h3">إزاي نحوّل كل تحدي لجملة نقولها للعميل</h3>
          <div className="table-wrap" style={{ marginTop: 14 }}>
            <table className="simple">
              <thead>
                <tr>
                  <th>التحدي</th>
                  <th>الجملة اللي نقولها قبل التعاقد</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>دورة بيع طويلة</td>
                  <td>«شراء الأثاث قرار بياخد أسابيع، فأول أسبوعين بنقيس المحادثات والزيارات مش المبيعات.»</td>
                </tr>
                <tr>
                  <td>تقلّب الاقتصاد</td>
                  <td>«بنبدأ بميزانية اختبار صغيرة. لو السوق هدي، بنقلّل الصرف مش بنوقف الحملة فجأة.»</td>
                </tr>
                <tr>
                  <td>جرّب وكالة قبلنا</td>
                  <td>«قولّي إيه اللي ما زبطش بالظبط. أول حاجة هنعملها إننا ما نكرّرهاش.»</td>
                </tr>
                <tr>
                  <td>مفيش دليل عندنا بعد</td>
                  <td>«إحنا في بداية التخصص، وده سببه إن السعر أقل والاهتمام أعلى. المقابل الوحيد: حق توثيق النتيجة بإذنك.»</td>
                </tr>
                <tr>
                  <td>الإسكان بيبرد</td>
                  <td>«الطلب مش رايح، بس بقى أبطأ. يعني العرض لازم يكون أقوى، والاستهداف أضيق.»</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
