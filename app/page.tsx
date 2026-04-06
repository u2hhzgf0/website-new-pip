import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Plans from '@/components/Plans'
import Calculator from '@/components/Calculator'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
// import InvestingInfo from '@/components/investing-info'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Plans />
      <Calculator />
      {/* <InvestingInfo /> */}
      <Contact />
      <Footer />
    </>
  )
}
