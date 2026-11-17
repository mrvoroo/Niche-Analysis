import { useEffect, useState } from 'react'
import BonusSection from './components/BonusSection'
import Candidates from './components/Candidates'
import Checklist from './components/Checklist'
import Footer from './components/Footer'
import FormSection from './components/FormSection'
import Header from './components/Header'
import Hero from './components/Hero'
import MarketSection from './components/MarketSection'
import NicheSheets from './components/NicheSheets'
import ScoreSection from './components/ScoreSection'
import Settings from './components/Settings'
import SiteAudit from './components/SiteAudit'
import SwotSection from './components/SwotSection'
import { StoreProvider } from './StoreContext'

const KNOWN = ['', 'candidates', 'sheets', 'settings']

function parseHash(): string {
  const h = window.location.hash.replace(/^#\/?/, '')
  const base = h.split('?')[0]
  /* الروابط القديمة اللي بتشاور على أقسام جوّا التحليل (#score مثلاً) بتفضل شغالة */
  return KNOWN.includes(base) ? base : ''
}

function Analysis() {
  return (
    <>
      <Hero />
      <ScoreSection />
      <MarketSection />
      <SwotSection />
      <SiteAudit />
      <Checklist />
      <FormSection />
      <BonusSection />
    </>
  )
}

export default function App() {
  const [route, setRoute] = useState(parseHash())

  useEffect(() => {
    const onHash = () => {
      const next = parseHash()
      setRoute((prev) => {
        if (prev !== next) window.scrollTo({ top: 0, behavior: 'auto' })
        return next
      })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <StoreProvider>
      <Header route={route} />
      <main>
        {route === '' && <Analysis />}
        {route === 'candidates' && <Candidates />}
        {route === 'sheets' && <NicheSheets />}
        {route === 'settings' && <Settings />}
      </main>
      <Footer />
    </StoreProvider>
  )
}
