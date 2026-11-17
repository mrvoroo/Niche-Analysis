import BonusSection from './components/BonusSection'
import Checklist from './components/Checklist'
import Footer from './components/Footer'
import FormSection from './components/FormSection'
import Header from './components/Header'
import Hero from './components/Hero'
import MarketSection from './components/MarketSection'
import ScoreSection from './components/ScoreSection'
import SiteAudit from './components/SiteAudit'
import SwotSection from './components/SwotSection'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScoreSection />
        <MarketSection />
        <SwotSection />
        <SiteAudit />
        <Checklist />
        <FormSection />
        <BonusSection />
      </main>
      <Footer />
    </>
  )
}
