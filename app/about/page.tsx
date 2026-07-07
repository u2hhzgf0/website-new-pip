import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AboutPage from '@/components/AboutPage'

export const metadata: Metadata = {
  title: 'About Us | Pipguardianelt',
  description:
    'Learn about Pipguardianelt — our mission, our team of professional forex traders, and how we are making structured investment accessible to everyone.',
}

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950">
        <AboutPage />
      </main>
      <Footer />
    </>
  )
}
