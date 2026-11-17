import { useMemo, useState } from 'react'
import { BRANCHES, PLAN_RULES, PROBLEMS, TICKETS, TRIED } from '../data'
import { Callout, Card, Reveal, Section } from './ui'

const STEPS = ['وجعك', 'معرضك', 'تواصلك']

interface FormState {
  problems: string[]
  branches: string
  ticket: string
  tried: string
  city: string
  name: string
  whatsapp: string
  note: string
}

const EMPTY: FormState = {
  problems: [],
  branches: '',
  ticket: '',
  tried: '',
  city: '',
  name: '',
  whatsapp: '',
  note: ''
}

export default function FormSection() {
  const [step, setStep] = useState(0)
  const [f, setF] = useState<FormState>(EMPTY)
  const [sent, setSent] = useState(false)

  const toggleProblem = (id: string) =>
    setF((p) => ({
      ...p,
      problems: p.problems.includes(id) ? p.problems.filter((x) => x !== id) : [...p.problems, id]
    }))

  const help = useMemo(
    () => PROBLEMS.filter((p) => f.problems.includes(p.id)).flatMap((p) => p.help),
    [f.problems]
  )

  const context = useMemo(() => {
    const out: string[] = []
    if (f.branches && PLAN_RULES.branches[f.branches]) out.push(PLAN_RULES.branches[f.branches])
    if (f.ticket && PLAN_RULES.tickets[f.ticket]) out.push(PLAN_RULES.tickets[f.ticket])
    if (f.tried && PLAN_RULES.tried[f.tried]) out.push(PLAN_RULES.tried[f.tried])
    return out
  }, [f.branches, f.ticket, f.tried])

  const canNext = step === 0 ? f.problems.length > 0 : step === 1 ? !!f.branches && !!f.ticket : true
  const canSend = f.name.trim().length > 1 && f.whatsapp.trim().length > 7

  const summary = () => {
    const names = PROBLEMS.filter((p) => f.problems.includes(p.id)).map((p) => p.title)
    const branch = BRANCHES.find((b) => b.id === f.branches)?.label ?? '—'
    const ticket = TICKETS.find((t) => t.id === f.ticket)?.label ?? '—'
    const tried = TRIED.find((t) => t.id === f.tried)?.label ?? '—'
    return [
      `الاسم: ${f.name || '—'}`,
      `المدينة: ${f.city || '—'}`,
      `التحديات: ${names.join(' | ') || '—'}`,
      `الفروع: ${branch}`,
      `متوسط سعر القطعة: ${ticket}`,
      `جرّب قبل: ${tried}`,
      f.note ? `ملاحظة: ${f.note}` : ''
    ]
      .filter(Boolean)
      .join('\n')
  }

  return (
    <Section
      id="form"
      eyebrow="التعديل الأهم"
      title="فورم الاستشارة الجديدة"
      lead="الفكرة: العميل يوصف وجعه بكلماته، وإحنا اللي نحدد الخدمة. ومع كل إجابة بيشوف إزاي هنساعده على اليمين — بدل ما يستنى 48 ساعة. جرّبها بنفسك تحت."
    >
      <Reveal>
        <div style={{ marginBottom: 22 }}>
          <Callout tone="info" icon="ℹ">
            <b>ليه التغيير ده؟</b> الفورم الحالية بتسأل «اختر خدمة: دراسة سوق / محتوى وإعلانات / موقع / استشارة». صاحب
            المعرض عارف إن معرضه فاضي، مش عارف إن الحل اسمه «دراسة سوق». لمّا نطلب منه يختار خدمة إحنا بنطلب منه يشخّص
            نفسه، فهو يا بيختار غلط يا بيسيب الصفحة. النسخة الجديدة بتسأل عن النتيجة، وبتسيب التشخيص لنا — وده كمان
            بيخلّي العرض مبنيّ على فهم مش على طلب.
          </Callout>
        </div>
      </Reveal>

      <div className="form-shell">
        <Card>
          <div className="steps">
            {STEPS.map((s, i) => (
              <span key={s} className={`step-chip${i === step ? ' is-active' : ''}${i < step ? ' is-done' : ''}`}>
                <i>{i < step ? '✓' : i + 1}</i> {s}
              </span>
            ))}
          </div>

          {step === 0 && (
            <div>
              <div className="field">
                <label className="field__label">إيه اللي مضايقك في شغلك دلوقتي؟</label>
                <p className="field__hint">اختار كل اللي بينطبق — مش لازم تعرف الحل، إحنا اللي هنحدده.</p>
                <div className="opt-grid">
                  {PROBLEMS.map((p) => (
                    <label className={`opt${f.problems.includes(p.id) ? ' is-on' : ''}`} key={p.id}>
                      <input type="checkbox" checked={f.problems.includes(p.id)} onChange={() => toggleProblem(p.id)} />
                      <span className="opt__mark" aria-hidden="true" />
                      <span className="opt__title">{p.title}</span>
                      <span className="opt__sub">{p.sub}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="field">
                <label className="field__label">معرضك عنده كام فرع؟</label>
                <p className="field__hint">ده بيحدد إحنا هنستهدف نطاق واحد ولا أكثر.</p>
                <div className="opt-grid">
                  {BRANCHES.map((b) => (
                    <label className={`opt${f.branches === b.id ? ' is-on' : ''}`} key={b.id}>
                      <input
                        type="radio"
                        name="branches"
                        checked={f.branches === b.id}
                        onChange={() => setF((p) => ({ ...p, branches: b.id }))}
                      />
                      <span className="opt__mark opt__radio" aria-hidden="true" />
                      <span className="opt__title">{b.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="field__label">متوسط سعر القطعة اللي بتبيعها؟</label>
                <p className="field__hint">أهم سؤال عندنا: بيحدد كام زيارة محتاجين، وميزانية الإعلان المنطقية.</p>
                <div className="opt-grid">
                  {TICKETS.map((t) => (
                    <label className={`opt${f.ticket === t.id ? ' is-on' : ''}`} key={t.id}>
                      <input
                        type="radio"
                        name="ticket"
                        checked={f.ticket === t.id}
                        onChange={() => setF((p) => ({ ...p, ticket: t.id }))}
                      />
                      <span className="opt__mark opt__radio" aria-hidden="true" />
                      <span className="opt__title num">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="field__label">جرّبت إعلانات قبل كده؟</label>
                <div className="opt-grid">
                  {TRIED.map((t) => (
                    <label className={`opt${f.tried === t.id ? ' is-on' : ''}`} key={t.id}>
                      <input
                        type="radio"
                        name="tried"
                        checked={f.tried === t.id}
                        onChange={() => setF((p) => ({ ...p, tried: t.id }))}
                      />
                      <span className="opt__mark opt__radio" aria-hidden="true" />
                      <span className="opt__title">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="field">
                <label className="field__label" htmlFor="nm">
                  اسمك واسم المعرض
                </label>
                <input
                  id="nm"
                  className="input"
                  value={f.name}
                  onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))}
                  placeholder="مثال: عبدالله — معرض دار ليفينغ"
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="ct">
                  المدينة
                </label>
                <input
                  id="ct"
                  className="input"
                  value={f.city}
                  onChange={(e) => setF((p) => ({ ...p, city: e.target.value }))}
                  placeholder="الرياض"
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="wa">
                  رقم الواتساب
                </label>
                <input
                  id="wa"
                  className="input num"
                  value={f.whatsapp}
                  onChange={(e) => setF((p) => ({ ...p, whatsapp: e.target.value }))}
                  placeholder="+966 5X XXX XXXX"
                  inputMode="tel"
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="nt">
                  أي حاجة تحب تقولها؟ (اختياري)
                </label>
                <textarea
                  id="nt"
                  className="textarea"
                  value={f.note}
                  onChange={(e) => setF((p) => ({ ...p, note: e.target.value }))}
                  placeholder="مثال: عندنا عرض الجمعة البيضاء وعايزين نجهّزه"
                />
              </div>

              {sent && (
                <div style={{ marginBottom: 18 }}>
                  <Callout tone="good" icon="✓">
                    <b>دي نسخة تجريبية للتصميم.</b> في الموقع الحقيقي، الإرسال هيبعت الملخص ده للـ CRM وهيفتح واتساب
                    محمّل بنفس الملخص. الملخص اللي اتجمّع:
                    <pre
                      style={{
                        marginTop: 10,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'var(--f-body)',
                        fontSize: '.86rem',
                        color: 'var(--c-muted)'
                      }}
                    >
                      {summary()}
                    </pre>
                  </Callout>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            {step > 0 && (
              <button className="btn btn--ghost" type="button" onClick={() => setStep((s) => s - 1)}>
                رجوع
              </button>
            )}
            {step < 2 && (
              <button
                className="btn"
                type="button"
                disabled={!canNext}
                style={{ opacity: canNext ? 1 : 0.45, cursor: canNext ? 'pointer' : 'not-allowed' }}
                onClick={() => canNext && setStep((s) => s + 1)}
              >
                كمّل
              </button>
            )}
            {step === 2 && (
              <button
                className="btn"
                type="button"
                disabled={!canSend}
                style={{ opacity: canSend ? 1 : 0.45, cursor: canSend ? 'pointer' : 'not-allowed' }}
                onClick={() => canSend && setSent(true)}
              >
                ابعت واحجز المكالمة
              </button>
            )}
            {(step > 0 || f.problems.length > 0) && (
              <button
                className="btn btn--ghost btn--sm"
                type="button"
                onClick={() => {
                  setF(EMPTY)
                  setStep(0)
                  setSent(false)
                }}
              >
                ابدأ من جديد
              </button>
            )}
          </div>
        </Card>

        <div className="plan">
          <h3 className="plan__title">إزاي هنساعدك</h3>
          <p className="plan__sub">
            بتتبنى وأنت بتجاوب. مفيش اسم خدمة هنا — بس اللي هنعمله فعلاً.
          </p>

          {help.length === 0 && context.length === 0 ? (
            <p className="plan__empty">
              اختار أول تحدي من القائمة وهتشوف الخطة بتظهر هنا. ودي بالظبط اللحظة اللي العميل بيحس فيها إننا فهمناه قبل
              المكالمة.
            </p>
          ) : (
            <>
              {help.length > 0 && (
                <div className="plan__block">
                  <h4>اللي هنعمله</h4>
                  <ul>
                    {help.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
              {context.length > 0 && (
                <div className="plan__block">
                  <h4>إزاي هنظبّطها على معرضك</h4>
                  <ul>
                    {context.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="plan__block">
                <h4>الخطوة الجاية</h4>
                <ul>
                  <li>مكالمة 30 دقيقة مجاناً نراجع فيها النقط دي</li>
                  <li>عرض مكتوب بهدف واحد قابل للقياس</li>
                  <li>ميزانية الإعلان بتروح للمنصات مباشرة، مش ضمن أتعابنا</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <Reveal>
        <div className="card" style={{ marginTop: 24 }}>
          <h3 className="h3">إيه اللي اتغيّر بالظبط</h3>
          <div className="table-wrap" style={{ marginTop: 14 }}>
            <table className="simple">
              <thead>
                <tr>
                  <th>الفورم الحالية</th>
                  <th>الفورم الجديدة</th>
                  <th>السبب</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>«اختر خدمة»</td>
                  <td>«إيه اللي مضايقك؟» باختيار متعدد</td>
                  <td>العميل عارف وجعه مش الحل. التشخيص شغلنا مش شغله.</td>
                </tr>
                <tr>
                  <td>نتيجة بعد 48 ساعة</td>
                  <td>خطة مبدئية حيّة وهو بيكمّل</td>
                  <td>بيحسّ إننا فهمناه فوراً، فنسبة إكمال الفورم بتعلى.</td>
                </tr>
                <tr>
                  <td>مفيش تأهيل</td>
                  <td>عدد الفروع + متوسط سعر القطعة</td>
                  <td>بنعرف فوراً لو يقدر يدفع — أهم فلتر في ورقة التقييم.</td>
                </tr>
                <tr>
                  <td>فورم طويلة في صفحة واحدة</td>
                  <td>ثلاث خطوات قصيرة</td>
                  <td>كل خطوة التزام صغير، والعميل شايف إنه قرّب يخلّص.</td>
                </tr>
                <tr>
                  <td>واتساب بديل عن الفورم</td>
                  <td>واتساب في آخر خطوة محمّل بالملخص</td>
                  <td>بناخد البيانات، والعميل بيكمّل على القناة اللي بيرد عليها.</td>
                </tr>
                <tr>
                  <td>مفيش سؤال عن تجارب سابقة</td>
                  <td>«جرّبت إعلانات قبل؟»</td>
                  <td>السوق جرّب وكالات. معرفة اللي ما زبطش بتمنعنا نكرّره وبتدينا زاوية في العرض.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
