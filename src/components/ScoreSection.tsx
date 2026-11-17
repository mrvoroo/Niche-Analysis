import { Leaderboard } from '@propeldata/ui-kit'
import { BENCHMARK, BONUS, FILTERS, SINGLE_POINT_RULE, TOTAL_MAX, TOTAL_SCORE } from '../data'
import { Callout, Card, ChartNote, Reveal, Section } from './ui'

const brandColors = ['#d62976', '#fa7e1e', '#feda75', '#962fbf', '#4f5bd5', '#e9568f']

export default function ScoreSection() {
  return (
    <Section
      id="score"
      alt
      eyebrow="الفلاتر الستة"
      title="ورقة تقييم التخصص"
      lead="كل فلتر من 1 لـ 5، والبونص من 0 لـ 3. والقاعدة الحاسمة: لو «بيقدر يدفع» أو «بتوصله» أخد نقطة واحدة، المرشح مستبعد مهما كان مجموعه."
    >
      <div className="grid grid--2">
        <Card title="الدرجات في رسم واحد" icon="▦">
          <div className="chart-box chart-ltr">
            <Leaderboard
              variant="bar"
              headers={['الفلتر', 'الدرجة']}
              rows={FILTERS.map((f) => [f.name, String(f.score)])}
              chartConfigProps={(config) => {
                const ds = config.data.datasets[0] as unknown as Record<string, unknown>
                ds.backgroundColor = brandColors
                ds.borderColor = brandColors
                ds.borderRadius = 8
                config.options = {
                  ...config.options,
                  indexAxis: 'y',
                  plugins: { ...config.options?.plugins, legend: { display: false } },
                  scales: {
                    ...config.options?.scales,
                    x: { min: 0, max: 5, ticks: { stepSize: 1, color: '#8f7ea3' }, grid: { color: 'rgba(255,255,255,.07)' } },
                    y: { ticks: { color: '#c7b6d6' }, grid: { display: false } }
                  }
                }
                return config
              }}
            />
          </div>
          <ChartNote>
            أعلى درجة: عدد العملاء (5). أقل درجة: «مش خبير تسويق» (3) — لأن السوق جرّب وكالات قبلنا، وده سيف بحدّين:
            بيدفعوا، بس بيقارنوا.
          </ChartNote>
        </Card>

        <Card title="مقارنة بالمثال المعبّى في الملف" icon="⟐">
          <div className="chart-box chart-ltr">
            <Leaderboard
              variant="bar"
              headers={['المرشح', 'المجموع']}
              rows={BENCHMARK.map((b) => [b.label, String(b.value)])}
              chartConfigProps={(config) => {
                const ds = config.data.datasets[0] as unknown as Record<string, unknown>
                ds.backgroundColor = ['#d62976', 'rgba(254,218,117,.55)', 'rgba(143,126,163,.45)']
                ds.borderRadius = 8
                config.options = {
                  ...config.options,
                  indexAxis: 'y',
                  plugins: { ...config.options?.plugins, legend: { display: false } },
                  scales: {
                    ...config.options?.scales,
                    x: { min: 0, max: 33, ticks: { color: '#8f7ea3' }, grid: { color: 'rgba(255,255,255,.07)' } },
                    y: { ticks: { color: '#c7b6d6' }, grid: { display: false } }
                  }
                }
                return config
              }}
            />
          </div>
          <ChartNote>
            مجموعنا {TOTAL_SCORE} من {TOTAL_MAX}. الفايز في مثال الملف كان 29 (ومعاه ميزة شخصية)، وخطة (ب) كانت 23.
            يعني إحنا في منطقة «تخصص منيح كفاية»، واللي بيحسم بعدها هو الالتزام مش كمال الاختيار.
          </ChartNote>
        </Card>
      </div>

      <Reveal>
        <div style={{ marginTop: 22 }}>
          <Card title="تفصيل كل فلتر" icon="☰">
            <div className="score-table">
              {FILTERS.map((f) => (
                <div className="score-row" key={f.id}>
                  <div>
                    <div className="score-row__name">{f.name}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--c-faint)' }}>{f.question}</div>
                  </div>
                  <div className="score-row__score">
                    {f.score} / {f.max}
                  </div>
                  <div className="score-row__bar">
                    <i style={{ width: `${(f.score / f.max) * 100}%` }} />
                  </div>
                  <div className="score-row__why">
                    {f.why}
                    {f.evidence && (
                      <>
                        <br />
                        <span style={{ color: 'var(--m-y)', fontSize: '.82rem' }}>الدليل: {f.evidence}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <div className="score-row" style={{ borderColor: 'rgba(254,218,117,.35)' }}>
                <div>
                  <div className="score-row__name">{BONUS.name}</div>
                  <div style={{ fontSize: '.8rem', color: 'var(--c-faint)' }}>بتعرف المجال أو ناس جوّاه؟</div>
                </div>
                <div className="score-row__score">
                  +{BONUS.score} / {BONUS.max}
                </div>
                <div className="score-row__bar">
                  <i style={{ width: '100%' }} />
                </div>
                <div className="score-row__why">
                  أبو عبدالله (خبرة تنجيد، الكويت) + خبرة أودو التشغيلية. الملف بيقول: ده ميزة حقيقية لأنها بتوفّر لغة
                  المجال وأول علاقات — بخلاف الشغف اللي لوحده مش ميزة. التفصيل في قسم البونص.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <Callout tone={SINGLE_POINT_RULE.passed ? 'good' : 'warn'} icon={SINGLE_POINT_RULE.passed ? '✓' : '!'}>
                <b>قاعدة النقطة الوحدة:</b> {SINGLE_POINT_RULE.note}
              </Callout>
            </div>

            <div style={{ marginTop: 14 }}>
              <Callout tone="info" icon="ℹ">
                <b>حدود التقييم:</b> الدرجات دي بحث مكتبي وتقدير. الملف بيقول صراحة إن أي رقم (عدد الأعمال، قيمة الزبون،
                المواسم) يعتبر فرضية لحد ما يتأكد بالغوص يومين. وأضعف درجة من ناحية التحقّق هي «عددهم كافي» — محتاجة عدّ
                فعلي على خرائط جوجل.
              </Callout>
            </div>
          </Card>
        </div>
      </Reveal>
    </Section>
  )
}
