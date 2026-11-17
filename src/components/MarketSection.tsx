import { PieChart, TimeSeries } from '@propeldata/ui-kit'
import { HOUSING_SIGNAL, MARKET_GROWTH, ONLINE_SHARE, PRICE_TIERS, SPENDING_SIGNALS } from '../data'
import { Callout, Card, ChartNote, Reveal, Section, SourceLink, StatCard } from './ui'

const axis = (max?: number, suffix = '', grace: number | string = 0) => ({
  x: { ticks: { color: '#8f7ea3' }, grid: { display: false } },
  y: {
    max,
    grace,
    ticks: {
      color: '#8f7ea3',
      callback: (v: unknown) => `${v}${suffix}`
    },
    grid: { color: 'rgba(255,255,255,.07)' }
  }
})

export default function MarketSection() {
  return (
    <Section
      id="market"
      eyebrow="أرقام حديثة"
      title="السوق بالأرقام — وإشارات التحذير"
      lead="الأحجام بتختلف بين المصادر لأن كل تقرير بيعرّف السوق بشكل مختلف. كل المصادر متفقة على اتجاه إيجابي، بس اتنين من المؤشرات بيقولوا «خُد حذرك»."
    >
      <div className="grid grid--2">
        <Card title="نمو سوق الأثاث السعودي" icon="↗">
          <div className="chart-box chart-ltr">
            <TimeSeries
              variant="line"
              labels={MARKET_GROWTH.labels}
              values={MARKET_GROWTH.values}
              chartProps={{ grid: true, fillArea: true }}
              chartConfigProps={(config) => {
                const ds = config.data.datasets[0] as unknown as Record<string, unknown>
                ds.borderColor = '#d62976'
                ds.backgroundColor = 'rgba(214,41,118,.16)'
                ds.pointBackgroundColor = '#feda75'
                ds.pointRadius = 4
                ds.tension = 0.35
                config.options = {
                  ...config.options,
                  plugins: { ...config.options?.plugins, legend: { display: false } },
                  scales: axis(undefined, '', '10%') as never
                }
                return config
              }}
            />
          </div>
          <ChartNote>
            بالمليون دولار. {MARKET_GROWTH.note} المصدر: <SourceLink srcKey={MARKET_GROWTH.srcKey} />
          </ChartNote>
        </Card>

        <Card title="حصة البيع الإلكتروني من السوق" icon="◉">
          <div className="chart-box chart-ltr">
            <TimeSeries
              variant="bar"
              labels={ONLINE_SHARE.labels}
              values={ONLINE_SHARE.values}
              chartProps={{ grid: true }}
              chartConfigProps={(config) => {
                const ds = config.data.datasets[0] as unknown as Record<string, unknown>
                ds.backgroundColor = 'rgba(79,91,213,.75)'
                ds.hoverBackgroundColor = '#4f5bd5'
                ds.borderRadius = 7
                config.options = {
                  ...config.options,
                  plugins: { ...config.options?.plugins, legend: { display: false } },
                  scales: axis(24, '%') as never
                }
                return config
              }}
            />
          </div>
          <ChartNote>
            {ONLINE_SHARE.note} المصدر: <SourceLink srcKey={ONLINE_SHARE.srcKey} />
          </ChartNote>
        </Card>
      </div>

      <div className="grid grid--2" style={{ marginTop: 18 }}>
        <Card title="شرائح السعر في السوق" icon="◑">
          <div className="chart-box chart-ltr" style={{ maxWidth: 380, marginInline: 'auto' }}>
            <PieChart
              variant="doughnut"
              headers={PRICE_TIERS.headers}
              rows={PRICE_TIERS.rows}
              chartProps={{ hideTotal: true, legendPosition: 'bottom', showValues: true }}
              chartConfigProps={(config) => {
                const ds = config.data.datasets[0] as unknown as Record<string, unknown>
                ds.backgroundColor = ['#d62976', '#feda75']
                ds.borderColor = 'rgba(14,7,22,.9)'
                ds.borderWidth = 3
                config.options = {
                  ...config.options,
                  plugins: {
                    ...config.options?.plugins,
                    legend: { position: 'bottom', labels: { color: '#c7b6d6', padding: 14 } }
                  }
                }
                return config
              }}
            />
          </div>
          <ChartNote>
            {PRICE_TIERS.note} المصدر: <SourceLink srcKey={PRICE_TIERS.srcKey} />
          </ChartNote>
        </Card>

        <Card title="إشارة تحذير: مؤشر أسعار السكن" icon="⚠">
          <div className="chart-box chart-ltr">
            <TimeSeries
              variant="bar"
              labels={HOUSING_SIGNAL.labels}
              values={HOUSING_SIGNAL.values}
              chartProps={{ grid: true }}
              chartConfigProps={(config) => {
                const ds = config.data.datasets[0] as unknown as Record<string, unknown>
                ds.backgroundColor = HOUSING_SIGNAL.values.map((v) =>
                  v < 0 ? 'rgba(251,113,133,.8)' : 'rgba(74,222,128,.75)'
                )
                ds.borderRadius = 7
                config.options = {
                  ...config.options,
                  plugins: { ...config.options?.plugins, legend: { display: false } },
                  scales: {
                    x: { ticks: { color: '#8f7ea3' }, grid: { display: false } },
                    y: {
                      ticks: { color: '#8f7ea3', callback: (v: unknown) => `${v}%` },
                      grid: { color: 'rgba(255,255,255,.07)' }
                    }
                  } as never
                }
                return config
              }}
            />
          </div>
          <ChartNote>
            {HOUSING_SIGNAL.note} المصدر: <SourceLink srcKey={HOUSING_SIGNAL.srcKey} />
          </ChartNote>
        </Card>
      </div>

      <Reveal>
        <div style={{ marginTop: 26 }}>
          <h3 className="h3">إشارات الاقتصاد والإنفاق</h3>
          <div className="grid grid--4" style={{ marginTop: 14 }}>
            {SPENDING_SIGNALS.map((s) => (
              <StatCard key={s.label} stat={s} small />
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div style={{ marginTop: 22, display: 'grid', gap: 14 }}>
          <Callout icon="⚠">
            <b>الخلاصة اللي لازم تتحوّل لتسعير وعرض:</b> الطلب موجود ومحركه طويل المدى قوي، لكن القرار الشرائي حسّاس
            للتقلّب. يعني: ما تبنيش عرضك على تعاقد سنوي من عميل جديد، وابدأ بفترة اختبار قصيرة بهدف واحد قابل للقياس —
            وده أصلاً موجود في موقعنا، خلّيه واضح أكثر.
          </Callout>
          <Callout tone="info" icon="ℹ">
            <b>ملاحظة على الأحجام:</b> ما تستخدمش رقم «22 مليار دولار» في الإعلانات أو العروض من غير ما تقول إن ده تعريف
            «المفروشات المنزلية» الأوسع (بيشمل المنسوجات والأرضيات والإضاءة)، لأن سوق الأثاث نفسه حوالي 8 إلى 9 مليار.
            الخلط هنا بيضرب مصداقيتك عند أي عميل بيقرأ التقارير.
          </Callout>
        </div>
      </Reveal>
    </Section>
  )
}
