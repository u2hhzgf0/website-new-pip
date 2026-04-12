import type { Metadata } from 'next'
import './globals.css'
import { ReduxProvider } from '../components/ReduxProvider'
import { SITE_LOGO_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pipguardian Premier',
  description: 'PipGuardian is a smart forex platform built for confident growth. We focus on disciplined trading and capital protection.',
  /**
   * Browser tab icon. If you also have `app/favicon.ico`, delete or replace that file
   * — Next.js may prefer it over this URL unless you remove it.
   */
  icons: {
    icon: [{ url: SITE_LOGO_URL, type: 'image/jpeg' }],
    shortcut: SITE_LOGO_URL,
    apple: SITE_LOGO_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
