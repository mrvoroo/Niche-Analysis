import { useEffect, useMemo, useState } from 'react'
import { ALL_TASK_IDS, TASK_GROUPS } from '../data'
import { Callout, Check, Reveal, Section } from './ui'

const STORE_KEY = 'magmafy-niche-tasks-v1'

function load(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

function save(state: Record<string, boolean>) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state))
  } catch {
    /* التخزين ممكن يكون مقفول — نكمّل بدون حفظ */
  }
}

const priorityPill = (p: string) => (p === 'عاجل' ? 'pill--bad' : p === 'مهم' ? 'pill--warn' : 'pill--info')
const effortPill = (e: string) => (e === 'سريع' ? 'pill--good' : e === 'متوسط' ? 'pill--warn' : 'pill--bad')

export default function Checklist() {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setDone(load())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) save(done)
  }, [done, ready])

  const total = ALL_TASK_IDS.length
  const count = useMemo(() => ALL_TASK_IDS.filter((id) => done[id]).length, [done])
  const pct = total ? Math.round((count / total) * 100) : 0

  const toggle = (id: string) => setDone((prev) => ({ ...prev, [id]: !prev[id] }))

  const resetAll = () => {
    if (confirm('تمسح كل العلامات وتبدأ من جديد؟')) setDone({})
  }

  return (
    <Section
      id="tasks"
      alt
      eyebrow="التنفيذ"
      title="قائمة التعديلات — علّم على كل ما تخلّص"
      lead="مرتّبة بالأولوية مش بالمجهود. العلامات محفوظة في المتصفح بتاعك، فلو قفلت الصفحة ورجعت هتلاقيها زي ما سيبتها."
    >
      <Reveal>
        <div className="card">
          <div className="progress-head">
            <span className="progress-count">
              {count} / {total}
            </span>
            <div className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <i style={{ width: `${pct}%` }} />
            </div>
            <span style={{ fontSize: '.88rem', color: 'var(--c-muted)' }}>
              {pct === 100 ? 'خلّصنا كل حاجة 🎉' : `${pct}% من القائمة`}
            </span>
            <button className="btn btn--ghost btn--sm" onClick={resetAll} type="button">
              تصفير
            </button>
          </div>

          {TASK_GROUPS.map((g) => {
            const gDone = g.tasks.filter((t) => done[t.id]).length
            return (
              <div className="task-group" key={g.id}>
                <div className="task-group__head">
                  <div>
                    <h3 className="task-group__title">{g.title}</h3>
                    <p style={{ fontSize: '.87rem', color: 'var(--c-muted)', margin: '4px 0 0', maxWidth: '72ch', lineHeight: 1.65 }}>
                      {g.subtitle}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`pill ${priorityPill(g.priority)}`}>{g.priority}</span>
                    <span className="pill pill--info num">
                      {gDone}/{g.tasks.length}
                    </span>
                  </div>
                </div>

                {g.tasks.map((t) => {
                  const isDone = !!done[t.id]
                  return (
                    <label className={`task${isDone ? ' is-done' : ''}`} key={t.id}>
                      <input type="checkbox" checked={isDone} onChange={() => toggle(t.id)} />
                      <span className="task__box" aria-hidden="true">
                        <Check />
                      </span>
                      <span className="task__title">
                        {t.title}
                        {t.tag && <span className="pill pill--info">{t.tag}</span>}
                        <span className={`pill ${effortPill(t.effort)}`}>{t.effort}</span>
                      </span>
                      <span className="task__why">{t.why}</span>
                    </label>
                  )
                })}
              </div>
            )
          })}

          <Callout tone="info" icon="ℹ">
            <b>ترتيب التنفيذ المقترح:</b> خلّص «نظّف الثقة» و«عدّل الفورم» الأسبوع ده (كلها بنود سريعة أو متوسطة)، وابدأ
            «اضبط النيش» بالتوازي. بند «500 رسالة» بيفضل شغّال في الخلفية طول الوقت — ابدأه بدري وسجّل العدد كل يوم.
          </Callout>
        </div>
      </Reveal>
    </Section>
  )
}
