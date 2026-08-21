import Navbar from '@/components/Navbar'
import InvestingInfoContent from '@/components/InvestingInfoContent'
import Plans from '@/components/Plans'
import Calculator from '@/components/Calculator'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <InvestingInfoContent />
      <Plans />
      <Calculator />
      <Contact />
      <Footer />
    </>
  )
}
