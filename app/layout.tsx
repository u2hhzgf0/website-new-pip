import type { Metadata } from 'next'
import './globals.css'
import { ReduxProvider } from '../components/ReduxProvider'
import { FAVICON_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pipguardian Premier',
  description: 'PipGuardian is a smart forex platform built for confident growth. We focus on disciplined trading and capital protection.',
  /** Uses Cloudinary + `?fv=` cache bust (see `lib/site.ts`). Do not add `app/favicon.ico` or it overrides this. */
  icons: {
    icon: [{ url: FAVICON_URL, type: 'image/jpeg' }],
    shortcut: FAVICON_URL,
    apple: FAVICON_URL,
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
