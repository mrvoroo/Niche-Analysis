import { BONUS } from '../data'
import { Callout, Card, Reveal, Section } from './ui'

export default function BonusSection() {
  return (
    <Section
      id="bonus"
      alt
      eyebrow="البونص في ورقة التقييم"
      title="الميزة اللي معانا"
      lead="الملف بيفرّق بين الشغف والميزة: «إنك بتحب القهوة ما بيعني إن الكافيهات بتقدر تدفعلك». الميزة الحقيقية هي إنك تفهم لغة المجال وعندك ناس جوّاه — وده اللي عندنا."
    >
      <div className="grid grid--2">
        {BONUS.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 90}>
            <Card title={item.title} icon="★">
              <p style={{ fontSize: '.94rem', color: 'var(--c-muted)', lineHeight: 1.75, margin: '0 0 14px' }}>{item.why}</p>
              <div
                style={{
                  padding: '13px 16px',
                  borderRadius: 'var(--radius-s)',
                  background: 'rgba(254,218,117,.07)',
                  border: '1px solid rgba(254,218,117,.22)',
                  fontSize: '.89rem',
                  lineHeight: 1.7
                }}
              >
                <b style={{ color: 'var(--m-y)' }}>إزاي نستخدمها:</b> {item.use}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="card" style={{ marginTop: 22 }}>
          <h3 className="h3">أسئلة جاهزة لجلسة مع أبو عبدالله</h3>
          <p className="lead" style={{ fontSize: '.95rem' }}>
            الملف بيقول: «احكي مع حدا من جوا، عشر دقايق، وطلّع أكبر وجع عنده في جملة وحدة». دي الأسئلة اللي تستحق السؤال،
            وأجوبتها بتروح مباشرة في قاموس التخصص وفي العرض.
          </p>
          <ul className="list" style={{ marginTop: 16 }}>
            <li>
              <span className="bullet bullet--warn">١</span>
              <span>إيه أكبر سبب بيخلّي الزبون يجي المعرض ويمشي من غير ما يشتري؟</span>
            </li>
            <li>
              <span className="bullet bullet--warn">٢</span>
              <span>إيه الوعد اللي لو كتبناه في إعلان هيحرق سمعة المعرض؟ (التوصيل؟ المدة؟ المقاسات؟ القماش؟)</span>
            </li>
            <li>
              <span className="bullet bullet--warn">٣</span>
              <span>مواسم الشغل الحقيقية عندكم إمتى، وإمتى بيهدى خالص؟</span>
            </li>
            <li>
              <span className="bullet bullet--warn">٤</span>
              <span>الزبون بيسأل عن إيه أول حاجة في الواتساب؟ وإيه السؤال اللي لو جاوبناه صح بيحجز معاينة؟</span>
            </li>
            <li>
              <span className="bullet bullet--warn">٥</span>
              <span>إيه الفرق بين المعرض اللي بيصنّع واللي بيستورد من ناحية إيه اللي يقدر يوعد بيه؟</span>
            </li>
            <li>
              <span className="bullet bullet--warn">٦</span>
              <span>١٥ كلمة بتستخدموها بينكم وما بتظهرش في كلام الوكالات؟</span>
            </li>
            <li>
              <span className="bullet bullet--warn">٧</span>
              <span>مين في معارفك في الكويت ممكن يقعد معانا نص ساعة كأول مكالمة اكتشاف؟</span>
            </li>
          </ul>
        </div>
      </Reveal>

      <Reveal>
        <div style={{ marginTop: 20, display: 'grid', gap: 14 }}>
          <Callout tone="good" icon="★">
            <b>الميزة دي بتفتح باب تاني:</b> الملف بيسمح بتغيير المنطقة قبل 500 رسالة (نفس التخصص، مدينة تانية). فالكويت
            مش تشتيت — هي امتداد مشروع لنفس النيش، ومعانا فيها مرجع موجود فعلاً. بس الأولوية تفضل الرياض لحد ما يبقى
            عندنا أول نتيجة موثّقة.
          </Callout>
          <Callout icon="⚠">
            <b>وحذر واحد:</b> خبرة التنجيد تخصص فرعي داخل الأثاث. ما تخليهاش تضيّق النيش لمحلات التنجيد بس — دي شريحة
            أصغر وميزانياتها أقل. استخدم الخبرة كمرجع فني، وخلّي النيش على معارض الأثاث والديكور.
          </Callout>
        </div>
      </Reveal>
    </Section>
  )
}
