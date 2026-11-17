import { useMemo } from 'react'
import { ALL_TASK_IDS, TASK_GROUPS } from '../data'
import { useAppStore } from '../StoreContext'
import { Callout, Check, Reveal, Section } from './ui'

const priorityPill = (p: string) => (p === 'عاجل' ? 'pill--bad' : p === 'مهم' ? 'pill--warn' : 'pill--info')
const effortPill = (e: string) => (e === 'سريع' ? 'pill--good' : e === 'متوسط' ? 'pill--warn' : 'pill--bad')

export default function Checklist() {
  const { tasks, toggleTask, resetTasks, syncState } = useAppStore()

  const total = ALL_TASK_IDS.length
  const count = useMemo(() => ALL_TASK_IDS.filter((id) => tasks[id]).length, [tasks])
  const pct = total ? Math.round((count / total) * 100) : 0

  return (
    <Section
      id="tasks"
      alt
      eyebrow="التنفيذ"
      title="قائمة التعديلات — علّم على كل ما تخلّص"
      lead="مرتّبة بالأولوية مش بالمجهود. العلامات محفوظة على طول، ولو ربطت جوجل شيت من صفحة الإعدادات هتتحفظ برّه المتصفح كمان."
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
            {syncState === 'ok' && <span className="pill pill--good">محفوظ في جوجل شيت</span>}
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={() => {
                if (confirm('تمسح كل العلامات وتبدأ من جديد؟')) resetTasks()
              }}
            >
              تصفير
            </button>
          </div>

          {TASK_GROUPS.map((g) => {
            const gDone = g.tasks.filter((t) => tasks[t.id]).length
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
                  const isDone = !!tasks[t.id]
                  return (
                    <label className={`task${isDone ? ' is-done' : ''}`} key={t.id}>
                      <input type="checkbox" checked={isDone} onChange={() => toggleTask(t.id)} />
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
