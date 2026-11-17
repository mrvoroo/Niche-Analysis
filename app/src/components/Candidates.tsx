import { useState } from 'react'
import { Leaderboard } from '@propeldata/ui-kit'
import {
  CANDIDATES,
  FILTER_LABELS,
  FILTER_ORDER,
  TIE_BREAK_NOTE,
  candidatePassesRule,
  candidateTotal,
  type Candidate
} from '../candidates'
import { srcTitle, srcUrl } from '../data'
import { Callout, Card, ChartNote, Reveal, Section } from './ui'

const COLORS: Record<string, string> = {
  furniture: '#d62976',
  interior: '#fa7e1e',
  kitchens: '#4f5bd5'
}

const ranked = [...CANDIDATES].sort((a, b) => candidateTotal(b) - candidateTotal(a))

function CandidateCard({ c, rank }: { c: Candidate; rank: number }) {
  const total = candidateTotal(c)
  const passes = candidatePassesRule(c)
  return (
    <div className="cand-card" style={{ borderColor: rank === 0 ? 'var(--c-border-strong)' : undefined }}>
      <div className="cand-card__head">
        <div>
          <span className={`pill ${c.verdict === 'الأساسي' ? 'pill--good' : c.verdict === 'خطة ب' ? 'pill--warn' : 'pill--info'}`}>
            {c.verdict}
          </span>
          <h3 className="h3" style={{ margin: '10px 0 4px' }}>
            {c.name}
          </h3>
          <p style={{ fontSize: '.86rem', color: 'var(--c-faint)', margin: 0 }}>{c.tagline}</p>
        </div>
        <div className="cand-card__score">
          <span className="num">{total}</span>
          <small>من 33</small>
        </div>
      </div>

      <div className="cand-bars">
        {FILTER_ORDER.map((fid) => {
          const f = c.filters.find((x) => x.id === fid)!
          return (
            <div className="cand-bar" key={fid}>
              <span className="cand-bar__label">{FILTER_LABELS[fid]}</span>
              <span className="cand-bar__track">
                <i style={{ width: `${(f.score / 5) * 100}%`, background: COLORS[c.id] }} />
              </span>
              <span className="cand-bar__num num">{f.score}</span>
            </div>
          )
        })}
        <div className="cand-bar">
          <span className="cand-bar__label">بونص</span>
          <span className="cand-bar__track">
            <i style={{ width: `${(c.bonus / 3) * 100}%`, background: 'var(--m-y)' }} />
          </span>
          <span className="cand-bar__num num">+{c.bonus}</span>
        </div>
      </div>

      <p className="cand-card__bonus">
        <b>الميزة:</b> {c.bonusWhy}
      </p>
      <p className="cand-card__watch">
        <b>انتبه:</b> {c.watchOut}
      </p>
      <p style={{ fontSize: '.8rem', color: passes ? 'var(--c-good)' : 'var(--c-bad)', margin: '10px 0 0' }}>
        {passes ? '✓ عدّى قاعدة النقطة الوحدة' : '× طالع بقاعدة النقطة الوحدة'}
      </p>
    </div>
  )
}

export default function Candidates() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <Section
      id="candidates"
      eyebrow="خطة ب وخطة ج"
      title="مقارنة المرشحين الثلاثة"
      lead="الملف بيطلب ثلاث مرشحين على ورقة واحدة: الأعلى بياخد التخصص، والثاني بيتحفظ كخطة (ب) عشان لو وصلنا 500 رسالة من غير نتيجة ما نبدأش من الصفر."
    >
      <Reveal>
        <div className="grid grid--3">
          {ranked.map((c, i) => (
            <CandidateCard key={c.id} c={c} rank={i} />
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="card" style={{ marginTop: 22 }}>
          <h3 className="card__title">المجموع في رسم واحد</h3>
          <div className="chart-box chart-ltr">
            <Leaderboard
              variant="bar"
              headers={['المرشح', 'المجموع من 33']}
              rows={ranked.map((c) => [c.short, String(candidateTotal(c))])}
              chartConfigProps={(config) => {
                const ds = config.data.datasets[0] as unknown as Record<string, unknown>
                ds.backgroundColor = ranked.map((c) => COLORS[c.id])
                ds.borderRadius = 8
                config.options = {
                  ...config.options,
                  indexAxis: 'y',
                  plugins: { ...config.options?.plugins, legend: { display: false } },
                  scales: {
                    x: { min: 0, max: 33, ticks: { color: '#8f7ea3' }, grid: { color: 'rgba(255,255,255,.07)' } },
                    y: { ticks: { color: '#c7b6d6' }, grid: { display: false } }
                  } as never
                }
                return config
              }}
            />
          </div>
          <ChartNote>
            الأثاث كسب بفارق نقطتين. الفارق مش ساحق، وده مقصود: الملف بيقول «ما في تخصص مثالي، في تخصص منيح كفاية
            وأنت ملتزم فيه 500 رسالة».
          </ChartNote>
        </div>
      </Reveal>

      <Reveal>
        <div className="card" style={{ marginTop: 22 }}>
          <h3 className="card__title">الجدول الكامل — فلتر بفلتر</h3>
          <div className="table-wrap">
            <table className="simple">
              <thead>
                <tr>
                  <th>الفلتر</th>
                  {ranked.map((c) => (
                    <th key={c.id} style={{ color: COLORS[c.id] }}>
                      {c.short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FILTER_ORDER.map((fid) => {
                  const best = Math.max(...ranked.map((c) => c.filters.find((f) => f.id === fid)!.score))
                  return (
                    <tr key={fid}>
                      <td>{FILTER_LABELS[fid]}</td>
                      {ranked.map((c) => {
                        const sc = c.filters.find((f) => f.id === fid)!.score
                        return (
                          <td key={c.id} className="num" style={{ color: sc === best ? 'var(--c-good)' : undefined, fontWeight: sc === best ? 700 : 400 }}>
                            {sc}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
                <tr>
                  <td>بونص</td>
                  {ranked.map((c) => (
                    <td key={c.id} className="num">
                      +{c.bonus}
                    </td>
                  ))}
                </tr>
                <tr style={{ background: 'rgba(214,41,118,.08)' }}>
                  <td>المجموع</td>
                  {ranked.map((c) => (
                    <td key={c.id} className="num" style={{ fontWeight: 700, color: 'var(--c-text)' }}>
                      {candidateTotal(c)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 18 }}>
            <Callout tone="info" icon="ℹ">
              <b>قاعدة التعادل:</b> {TIE_BREAK_NOTE}
            </Callout>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="card" style={{ marginTop: 22 }}>
          <h3 className="card__title">ليه كل درجة كده؟ (افتح المرشح اللي تحب)</h3>
          <div className="acc">
            {ranked.map((c) => (
              <div className={`acc-item${open === c.id ? ' is-open' : ''}`} key={c.id}>
                <button className="acc-head" onClick={() => setOpen(open === c.id ? null : c.id)} type="button" aria-expanded={open === c.id}>
                  <span className="acc-head__dot" style={{ background: COLORS[c.id] }} />
                  <span className="acc-head__title">{c.name}</span>
                  <span className="num" style={{ color: 'var(--c-faint)', fontSize: '.9rem' }}>
                    {candidateTotal(c)}/33
                  </span>
                  <span className="acc-head__chev" aria-hidden="true">
                    ⌄
                  </span>
                </button>
                {open === c.id && (
                  <div className="acc-body">
                    {FILTER_ORDER.map((fid) => {
                      const f = c.filters.find((x) => x.id === fid)!
                      return (
                        <div className="score-row" key={fid} style={{ marginBottom: 10 }}>
                          <div className="score-row__name">{FILTER_LABELS[fid]}</div>
                          <div className="score-row__score">{f.score} / 5</div>
                          <div className="score-row__bar">
                            <i style={{ width: `${(f.score / 5) * 100}%`, background: COLORS[c.id] }} />
                          </div>
                          <div className="score-row__why">
                            {f.why}
                            {f.evidence && (
                              <>
                                <br />
                                <span style={{ color: 'var(--m-y)', fontSize: '.82rem' }}>
                                  الدليل: {f.evidence}
                                  {f.srcKey && (
                                    <>
                                      {' — '}
                                      <a href={srcUrl(f.srcKey)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--m-y)' }}>
                                        {srcTitle(f.srcKey)}
                                      </a>
                                    </>
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div style={{ marginTop: 22, display: 'grid', gap: 14 }}>
          <Callout icon="⚠">
            <b>الدرجات دي تقديرية ومبنية على بحث مكتبي.</b> أضعف بند في المرشحين التانيين هو «عددهم كافي» — محتاج عدّ
            فعلي على خرائط جوجل زي ما الملف بيطلب. ولو طلع المطابخ تحت 1,000 في الرياض، الملف بيقول: وسّع المنطقة مش
            النوع.
          </Callout>
          <Callout tone="good" icon="✓">
            <b>اللي تعمله بالمقارنة دي:</b> احفظ «التصميم الداخلي» كخطة (ب) وما تلمسهاش. الملف بيمنع تشغيل تخصصين مع
            بعض «لنشوف مين بيمشي»، وبيمنع تغيير التخصص قبل 500 رسالة. ارجعلها بس لو خلّصت 500 رسالة وغيّرت الرسالة
            والقناة ومفيش ولا رد إيجابي.
          </Callout>
        </div>
      </Reveal>
    </Section>
  )
}
