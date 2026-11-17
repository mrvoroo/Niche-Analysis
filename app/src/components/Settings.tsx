import { useEffect, useState } from 'react'
import { useAppStore } from '../StoreContext'
import { Callout, Card, Reveal, Section } from './ui'

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/11Bj1G0nihP82ulaf9u6owj3OtICYCo4dx4pV49gRG48/edit'

const STEPS = [
  {
    t: 'افتح الشيت',
    d: 'الشيت متعمول ومستنّيك: «Magmafy — قاعدة بيانات تحليل النيش» في جوجل درايف بتاعك.',
    link: SHEET_URL,
    linkLabel: 'افتح الشيت'
  },
  {
    t: 'افتح محرّر الأكواد',
    d: 'من داخل الشيت: Extensions ← Apps Script. هيفتحلك تبويب جديد فيه محرّر كود.'
  },
  {
    t: 'الصق الكود',
    d: 'امسح أي كود موجود في المحرّر، وانسخ كود Code.gs من المستودع والصقه مكانه، ثم احفظ.',
    link: 'https://github.com/mrvoroo/Niche-Analysis/blob/main/apps-script/Code.gs',
    linkLabel: 'الكود على جيت هب'
  },
  {
    t: 'انشر كتطبيق ويب',
    d: 'Deploy ← New deployment ← اختار النوع Web app. في خانة Execute as اختار Me، وفي خانة Who has access اختار Anyone. اضغط Deploy ووافق على الصلاحيات.'
  },
  {
    t: 'انسخ الرابط والصقه تحت',
    d: 'الرابط بينتهي بـ /exec. الصقه في الخانة اللي تحت واضغط «اربط».'
  }
]

export default function Settings() {
  const { syncUrl, syncState, syncError, lastSync, connect, disconnect, syncNow, tasks, sheets } = useAppStore()
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [installEvt, setInstallEvt] = useState<Event | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => setUrl(syncUrl), [syncUrl])

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setInstallEvt(e)
    }
    const onInstalled = () => {
      setInstalled(true)
      setInstallEvt(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const doneCount = Object.values(tasks).filter(Boolean).length

  return (
    <Section
      id="settings"
      eyebrow="الإعدادات"
      title="الحفظ الدائم وتطبيق الموبايل"
      lead="شغلك محفوظ في المتصفح على طول. اربطه بجوجل شيت عشان يتحفظ برّه المتصفح ويوصلك من أي جهاز."
    >
      <div className="grid grid--2">
        <Reveal>
          <Card title="الربط بجوجل شيت" icon="▦">
            <div className={`sync-banner sync-banner--${syncState}`}>
              <b>
                {syncState === 'ok' && '✓ متصل بجوجل شيت'}
                {syncState === 'syncing' && '… بيزامن'}
                {syncState === 'error' && '× مشكلة في الاتصال'}
                {(syncState === 'off' || syncState === 'idle') && 'غير متصل — الحفظ في المتصفح فقط'}
              </b>
              <span>
                {syncState === 'error' && syncError}
                {syncState === 'ok' && lastSync && `آخر مزامنة: ${new Date(lastSync).toLocaleString('ar-SA')}`}
                {(syncState === 'off' || syncState === 'idle') &&
                  'لو مسحت بيانات المتصفح أو فتحت من جهاز تاني، الشغل مش هيكون موجود.'}
              </span>
            </div>

            <div className="field" style={{ marginTop: 18 }}>
              <label className="field__label" htmlFor="wurl">
                رابط الـ Web App
              </label>
              <p className="field__hint">بينتهي بـ /exec — اتبع الخطوات اللي على الجنب أول مرة بس.</p>
              <input
                id="wurl"
                className="input"
                dir="ltr"
                placeholder="https://script.google.com/macros/s/..../exec"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="btn"
                type="button"
                disabled={busy || !url.trim().startsWith('https://')}
                style={{ opacity: busy || !url.trim().startsWith('https://') ? 0.45 : 1 }}
                onClick={async () => {
                  setBusy(true)
                  const ok = await connect(url.trim())
                  setBusy(false)
                  if (ok) alert('تم الربط. شغلك دلوقتي محفوظ في جوجل شيت.')
                }}
              >
                {busy ? 'بيربط…' : syncUrl ? 'إعادة الربط' : 'اربط'}
              </button>

              {syncUrl && (
                <>
                  <button
                    className="btn btn--ghost"
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true)
                      await syncNow()
                      setBusy(false)
                    }}
                  >
                    زامن دلوقتي
                  </button>
                  <button
                    className="btn btn--ghost"
                    type="button"
                    onClick={() => {
                      if (confirm('تفصل الربط؟ الشغل هيفضل محفوظ في المتصفح وفي الشيت، بس مش هيتزامن.')) disconnect()
                    }}
                  >
                    افصل الربط
                  </button>
                </>
              )}
              <a className="btn btn--ghost" href={SHEET_URL} target="_blank" rel="noopener noreferrer">
                افتح الشيت
              </a>
            </div>

            <div style={{ marginTop: 18 }}>
              <Callout tone="info" icon="ℹ">
                <b>اللي بيتحفظ:</b> قائمة التنفيذ ({doneCount} بند مخلّص) وأوراق التخصص ({sheets.length} ورقة). الحفظ
                بيحصل تلقائياً بعد ثانيتين من آخر تعديل.
              </Callout>
            </div>

            <div style={{ marginTop: 14 }}>
              <Callout icon="⚠">
                <b>ملاحظة أمان:</b> إعداد «Anyone» معناه إن أي حد معاه رابط الـ Web App يقدر يقرا ويكتب في الشيت. الرابط
                ده خاص بيك — ما تنشرهوش. ولو حبيت تلغيه في أي وقت: Deploy ← Manage deployments ← Archive.
              </Callout>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card title="خطوات الربط — مرة واحدة بس" icon="☰">
            <ol className="steps-list">
              {STEPS.map((s, i) => (
                <li key={s.t}>
                  <span className="steps-list__n num">{i + 1}</span>
                  <div>
                    <b>{s.t}</b>
                    <p>{s.d}</p>
                    {s.link && (
                      <a className="btn btn--ghost btn--sm" href={s.link} target="_blank" rel="noopener noreferrer">
                        {s.linkLabel}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <div style={{ marginTop: 18 }}>
            <Card title="تثبيت التطبيق على الموبايل" icon="▣">
              <p style={{ fontSize: '.93rem', color: 'var(--c-muted)', lineHeight: 1.75, margin: '0 0 16px' }}>
                الموقع متعمول كتطبيق ويب (PWA)، يعني تقدر تثبّته على شاشة الموبايل الرئيسية ويفتح بدون شريط المتصفح،
                ويشتغل برضه وإنت أوفلاين.
              </p>

              {installed ? (
                <Callout tone="good" icon="✓">
                  <b>التطبيق متثبّت.</b> تقدر تفتحه من شاشة الموبايل زي أي تطبيق.
                </Callout>
              ) : installEvt ? (
                <button
                  className="btn"
                  type="button"
                  onClick={async () => {
                    const evt = installEvt as Event & { prompt: () => Promise<void> }
                    await evt.prompt()
                    setInstallEvt(null)
                  }}
                >
                  ثبّت التطبيق دلوقتي
                </button>
              ) : (
                <ul className="list">
                  <li>
                    <span className="bullet bullet--warn">ا</span>
                    <span>
                      <b>أندرويد (كروم):</b> افتح قائمة المتصفح (النقط الثلاثة) ← «تثبيت التطبيق» أو «إضافة إلى الشاشة
                      الرئيسية».
                    </span>
                  </li>
                  <li>
                    <span className="bullet bullet--warn">ب</span>
                    <span>
                      <b>آيفون (سفاري):</b> اضغط زر المشاركة ← «إضافة إلى الشاشة الرئيسية». لازم سفاري تحديداً، مش كروم.
                    </span>
                  </li>
                  <li>
                    <span className="bullet bullet--warn">ج</span>
                    <span>
                      <b>الكمبيوتر (كروم):</b> أيقونة التثبيت في شريط العنوان على اليمين.
                    </span>
                  </li>
                </ul>
              )}
            </Card>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
