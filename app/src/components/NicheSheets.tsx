import { useState } from 'react'
import {
  SCORE_FIELDS,
  SHEET_FIELDS,
  emptySheet,
  sheetFilled,
  sheetPassesRule,
  sheetTotal,
  type NicheSheet
} from '../sheets'
import { useAppStore } from '../StoreContext'
import { Callout, Card, Reveal, Section } from './ui'

/* ---------- محرّر ورقة واحدة ---------- */
function SheetEditor({ sheet }: { sheet: NicheSheet }) {
  const { updateSheet } = useAppStore()

  const setField = (fid: string, v: string) =>
    updateSheet(sheet.id, { fields: { ...sheet.fields, [fid]: v } })

  const setScore = (fid: string, v: number) =>
    updateSheet(sheet.id, { scores: { ...sheet.scores, [fid]: v } })

  const rule = sheetPassesRule(sheet)

  return (
    <div className="acc-body">
      <div className="sheet-scores">
        <h4 className="sheet-sub">ورقة التقييم — كل فلتر من 1 لـ 5</h4>
        {SCORE_FIELDS.map((f) => (
          <div className="scorepick" key={f.id}>
            <div>
              <div className="scorepick__label">{f.label}</div>
              <div className="scorepick__q">{f.q}</div>
            </div>
            <div className="scorepick__btns" role="group" aria-label={f.label}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`sp-btn${Number(sheet.scores[f.id]) === n ? ' is-on' : ''}`}
                  onClick={() => setScore(f.id, Number(sheet.scores[f.id]) === n ? 0 : n)}
                  aria-pressed={Number(sheet.scores[f.id]) === n}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="scorepick">
          <div>
            <div className="scorepick__label">بونص: ميزة عندك</div>
            <div className="scorepick__q">بتعرف المجال أو ناس جوّاه؟ (الشغف لوحده مش ميزة)</div>
          </div>
          <div className="scorepick__btns" role="group" aria-label="بونص">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                className={`sp-btn${Number(sheet.bonus) === n ? ' is-on' : ''}`}
                onClick={() => updateSheet(sheet.id, { bonus: n })}
                aria-pressed={Number(sheet.bonus) === n}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {rule === false && (
          <div style={{ marginTop: 14 }}>
            <Callout icon="×">
              <b>طالع بقاعدة النقطة الوحدة.</b> «بيقدر يدفع» أو «بتوصله» أخد نقطة واحدة، والملف بيقول: ما في عميل ما
              بيدفع، وما في عميل ما بتوصله. المرشح ده مستبعد مهما كان مجموعه.
            </Callout>
          </div>
        )}
      </div>

      <h4 className="sheet-sub" style={{ marginTop: 26 }}>
        ورقة التخصص — الأسئلة العشرة
      </h4>
      <p className="sheet-note">
        عبّيها بكلماتك إنت، مش بكلمات الذكاء الاصطناعي. أي حاجة فاضية معناها إن الغوص لسه ما خلصش.
      </p>

      {SHEET_FIELDS.map((f) => (
        <div className="field" key={f.id}>
          <label className="field__label" htmlFor={`${sheet.id}-${f.id}`}>
            {f.label}
          </label>
          <p className="field__hint">{f.hint}</p>
          {f.long ? (
            <textarea
              id={`${sheet.id}-${f.id}`}
              className="textarea"
              value={sheet.fields[f.id] ?? ''}
              onChange={(e) => setField(f.id, e.target.value)}
            />
          ) : (
            <input
              id={`${sheet.id}-${f.id}`}
              className="input"
              value={sheet.fields[f.id] ?? ''}
              onChange={(e) => setField(f.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/* ---------- المقارنة بين ورقتين ---------- */
function Compare({ a, b, onClose }: { a: NicheSheet; b: NicheSheet; onClose: () => void }) {
  return (
    <div className="card" style={{ marginBottom: 22 }}>
      <div className="task-group__head">
        <h3 className="card__title" style={{ margin: 0 }}>
          مقارنة: {a.name} ← → {b.name}
        </h3>
        <button className="btn btn--ghost btn--sm" type="button" onClick={onClose}>
          إغلاق المقارنة
        </button>
      </div>

      <div className="table-wrap" style={{ marginTop: 14 }}>
        <table className="simple">
          <thead>
            <tr>
              <th style={{ width: 190 }}>الفلتر</th>
              <th>{a.name}</th>
              <th>{b.name}</th>
            </tr>
          </thead>
          <tbody>
            {SCORE_FIELDS.map((f) => {
              const va = Number(a.scores[f.id]) || 0
              const vb = Number(b.scores[f.id]) || 0
              return (
                <tr key={f.id}>
                  <td>{f.label}</td>
                  <td className="num" style={{ color: va > vb ? 'var(--c-good)' : undefined, fontWeight: va > vb ? 700 : 400 }}>
                    {va || '—'}
                  </td>
                  <td className="num" style={{ color: vb > va ? 'var(--c-good)' : undefined, fontWeight: vb > va ? 700 : 400 }}>
                    {vb || '—'}
                  </td>
                </tr>
              )
            })}
            <tr>
              <td>بونص</td>
              <td className="num">+{a.bonus || 0}</td>
              <td className="num">+{b.bonus || 0}</td>
            </tr>
            <tr style={{ background: 'rgba(214,41,118,.08)' }}>
              <td>المجموع من 33</td>
              <td className="num" style={{ fontWeight: 700, color: 'var(--c-text)' }}>
                {sheetTotal(a)}
              </td>
              <td className="num" style={{ fontWeight: 700, color: 'var(--c-text)' }}>
                {sheetTotal(b)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 className="sheet-sub" style={{ marginTop: 24 }}>
        الأسئلة العشرة جنب بعض
      </h4>
      <div className="table-wrap">
        <table className="simple">
          <thead>
            <tr>
              <th style={{ width: 190 }}>السؤال</th>
              <th>{a.name}</th>
              <th>{b.name}</th>
            </tr>
          </thead>
          <tbody>
            {SHEET_FIELDS.map((f) => (
              <tr key={f.id}>
                <td>{f.label}</td>
                <td style={{ whiteSpace: 'pre-wrap' }}>{(a.fields[f.id] ?? '').trim() || <span style={{ color: 'var(--c-faint)' }}>— فاضي</span>}</td>
                <td style={{ whiteSpace: 'pre-wrap' }}>{(b.fields[f.id] ?? '').trim() || <span style={{ color: 'var(--c-faint)' }}>— فاضي</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 18 }}>
        <Callout tone="info" icon="ℹ">
          لو المجموعين متقاربين، الملف بيحسم كده: بيربح اللي عندك فيه ميزة؛ ولو مفيش ميزة، بيربح اللي لقيت منفّذه أسرع.
        </Callout>
      </div>
    </div>
  )
}

/* ---------- الصفحة ---------- */
export default function NicheSheets() {
  const { sheets, addSheet, removeSheet, updateSheet, ready } = useAppStore()
  const [open, setOpen] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [picked, setPicked] = useState<string[]>([])
  const [renaming, setRenaming] = useState<string | null>(null)

  const a = sheets.find((s) => s.id === picked[0])
  const b = sheets.find((s) => s.id === picked[1])

  const togglePick = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 2 ? [p[1], id] : [...p, id]))

  return (
    <Section
      id="sheets"
      eyebrow="من الملف"
      title="أوراق التخصص"
      lead="كل ورقة ملف كامل لمرشح واحد: ورقة التقييم (الفلاتر الستة) + الأسئلة العشرة بتاعة الغوص. كل الأوراق مقفولة، افتح اللي تحب، وتقدر تقارن اتنين جنب بعض."
    >
      <Reveal>
        <div className="sheets-bar">
          <button
            className="btn btn--sm"
            type="button"
            onClick={() => {
              const s = emptySheet(`ورقة جديدة ${sheets.length + 1}`)
              addSheet(s)
              setOpen(s.id)
              setRenaming(s.id)
            }}
          >
            + ورقة جديدة
          </button>
          <button
            className={`btn btn--ghost btn--sm${compareMode ? ' is-on' : ''}`}
            type="button"
            onClick={() => {
              setCompareMode((v) => !v)
              setPicked([])
              setOpen(null)
            }}
          >
            {compareMode ? 'إلغاء وضع المقارنة' : '⚖ قارن بين ورقتين'}
          </button>
          <span style={{ fontSize: '.85rem', color: 'var(--c-faint)', marginInlineStart: 'auto' }}>
            {sheets.length} ورقة
            {compareMode && picked.length < 2 && ' · اختار ورقتين للمقارنة'}
          </span>
        </div>
      </Reveal>

      {compareMode && a && b && <Compare a={a} b={b} onClose={() => { setCompareMode(false); setPicked([]) }} />}

      <div className="acc">
        {!ready && <p style={{ color: 'var(--c-faint)' }}>بيحمّل…</p>}
        {sheets.map((s) => {
          const total = sheetTotal(s)
          const filled = sheetFilled(s)
          const isOpen = open === s.id && !compareMode
          const isPicked = picked.includes(s.id)

          return (
            <div className={`acc-item${isOpen ? ' is-open' : ''}${isPicked ? ' is-picked' : ''}`} key={s.id}>
              <div className="acc-head-wrap">
                <button
                  className="acc-head"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => (compareMode ? togglePick(s.id) : setOpen(isOpen ? null : s.id))}
                >
                  {compareMode && (
                    <span className={`acc-pick${isPicked ? ' is-on' : ''}`} aria-hidden="true">
                      {isPicked ? (picked[0] === s.id ? '1' : '2') : ''}
                    </span>
                  )}
                  {renaming === s.id ? (
                    <input
                      className="input acc-rename"
                      autoFocus
                      value={s.name}
                      onChange={(e) => updateSheet(s.id, { name: e.target.value })}
                      onBlur={() => setRenaming(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setRenaming(null)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="acc-head__title">{s.name}</span>
                  )}
                  <span className="acc-head__meta">
                    <span className="pill pill--info num">{total}/33</span>
                    <span className="pill pill--warn num">
                      {filled}/{SHEET_FIELDS.length} حقل
                    </span>
                  </span>
                  {!compareMode && (
                    <span className="acc-head__chev" aria-hidden="true">
                      ⌄
                    </span>
                  )}
                </button>

                {!compareMode && (
                  <div className="acc-actions">
                    <button
                      className="icon-btn"
                      type="button"
                      title="تغيير الاسم"
                      onClick={() => {
                        setOpen(s.id)
                        setRenaming(s.id)
                      }}
                    >
                      ✎
                    </button>
                    <button
                      className="icon-btn"
                      type="button"
                      title="نسخة من الورقة"
                      onClick={() => {
                        const copy = { ...s, id: emptySheet('x').id, name: `${s.name} (نسخة)`, updatedAt: new Date().toISOString() }
                        addSheet(copy)
                      }}
                    >
                      ⧉
                    </button>
                    <button
                      className="icon-btn icon-btn--danger"
                      type="button"
                      title="حذف الورقة"
                      onClick={() => {
                        if (confirm(`تحذف ورقة «${s.name}»؟ مش هتقدر ترجّعها.`)) removeSheet(s.id)
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {isOpen && <SheetEditor sheet={s} />}
            </div>
          )
        })}
      </div>

      <Reveal>
        <div style={{ marginTop: 22 }}>
          <Card title="إزاي تستخدم الأوراق دي" icon="ℹ">
            <ul className="list">
              <li>
                <span className="bullet bullet--warn">١</span>
                <span>
                  <b>قيّم الأول.</b> حط درجة لكل فلتر من 1 لـ 5. لو «بيقدر يدفع» أو «بتوصله» أخد 1، المرشح طالع مهما كان
                  مجموعه.
                </span>
              </li>
              <li>
                <span className="bullet bullet--warn">٢</span>
                <span>
                  <b>غُص يومين.</b> خرائط جوجل، التقييمات، إنستغرام، مكتبة إعلانات ميتا، قروبات أصحاب الأعمال، وجرّب
                  كزبون — وعبّي الأسئلة العشرة من اللي تطلعه.
                </span>
              </li>
              <li>
                <span className="bullet bullet--warn">٣</span>
                <span>
                  <b>قارن.</b> لو مرشحين متقاربين، افتح وضع المقارنة وشوف الفرق فلتر بفلتر وحقل بحقل.
                </span>
              </li>
              <li>
                <span className="bullet bullet--warn">٤</span>
                <span>
                  <b>التزم.</b> الورقة الأعلى بتاخد التخصص، والثانية بتتحفظ كخطة (ب). وما تغيّرش قبل 500 رسالة.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </Reveal>
    </Section>
  )
}
