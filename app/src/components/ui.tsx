import { useEffect, useRef, useState, type ReactNode } from 'react'
import { srcTitle, srcUrl, type Stat } from '../data'

/* إظهار تدريجي عند التمرير.
   مهم: العنصر ظاهر افتراضياً. بنخفيه فقط لو كان تحت الشاشة وقت التحميل،
   وبنرجّعه أول ما يقرب. كده مستحيل يفضل مخفي لو الـ observer ما اشتغلش. */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const belowFold = el.getBoundingClientRect().top > window.innerHeight * 0.95

    if (reduced || !belowFold || !('IntersectionObserver' in window)) return

    setArmed(true)

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    )
    io.observe(el)

    /* شبكة أمان: لو لأي سبب الـ observer ما نادى، نظهر العنصر بعد ثانيتين */
    const safety = window.setTimeout(() => setSeen(true), 2500)

    return () => {
      io.disconnect()
      window.clearTimeout(safety)
    }
  }, [])

  const cls = armed ? `reveal is-armed${seen ? ' is-in' : ''}` : 'reveal'

  return (
    <div ref={ref} className={cls} style={armed ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  )
}

export function Section({
  id,
  eyebrow,
  title,
  lead,
  alt,
  children
}: {
  id: string
  eyebrow?: string
  title: string
  lead?: string
  alt?: boolean
  children: ReactNode
}) {
  return (
    <section id={id} className={`section${alt ? ' section--alt' : ''}`}>
      <div className="container">
        <div className="section__head">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="h2">{title}</h2>
          {lead && <p className="lead">{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

export function StatCard({ stat, small }: { stat: Stat; small?: boolean }) {
  return (
    <div className="stat">
      <span className="stat__label">{stat.label}</span>
      <span className={`stat__value${small ? ' stat__value--sm' : ''}`}>{stat.value}</span>
      <span className="stat__note">{stat.note}</span>
      <span className="stat__src">
        المصدر:{' '}
        <a href={srcUrl(stat.srcKey)} target="_blank" rel="noopener noreferrer">
          {srcTitle(stat.srcKey)}
        </a>
      </span>
    </div>
  )
}

export function Card({
  title,
  icon,
  children,
  className = ''
}: {
  title?: string
  icon?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <h3 className="card__title">
          {icon && <span aria-hidden="true">{icon}</span>}
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export function Callout({
  tone = 'warn',
  icon = '!',
  children
}: {
  tone?: 'warn' | 'info' | 'good'
  icon?: string
  children: ReactNode
}) {
  return (
    <div className={`callout${tone !== 'warn' ? ` callout--${tone}` : ''}`}>
      <span className="callout__icon" aria-hidden="true">
        {icon}
      </span>
      <div>{children}</div>
    </div>
  )
}

export function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChartNote({ children }: { children: ReactNode }) {
  return <p className="chart-note">{children}</p>
}

export function SourceLink({ srcKey }: { srcKey: string }) {
  return (
    <a href={srcUrl(srcKey)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--m-y)', textDecoration: 'none' }}>
      {srcTitle(srcKey)}
    </a>
  )
}
