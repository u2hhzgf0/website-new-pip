import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import WhyUs from '@/components/home/WhyUs'
import LiveActivity from '@/components/home/LiveActivity'
import TrustBanner from '@/components/home/TrustBanner'
import PlatformFeatures from '@/components/home/PlatformFeatures'
import AppDownload from '@/components/home/AppDownload'
import AccountJourney from '@/components/home/AccountJourney'
import FeatureGrid from '@/components/home/FeatureGrid'
import Plans from '@/components/Plans'
import FundingFlexibility from '@/components/home/FundingFlexibility'
import ProfitBanner from '@/components/home/ProfitBanner'
import Calculator from '@/components/Calculator'
import GrowthInsights from '@/components/home/GrowthInsights'
import TrustStrip from '@/components/home/TrustStrip'
import ReferralCTA from '@/components/home/ReferralCTA'
import FinalCTA from '@/components/home/FinalCTA'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyUs />
      <LiveActivity />
      <TrustBanner />
      <PlatformFeatures />
      <AppDownload />
      <AccountJourney />
      <FeatureGrid />
      <Plans />
      <FundingFlexibility />
      <ProfitBanner />
      <Calculator />
      <GrowthInsights />
      <TrustStrip />
      <ReferralCTA />
      <FinalCTA />
      <Contact />
      <Footer />
    </>
  )
}
