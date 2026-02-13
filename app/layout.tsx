import type { Metadata } from 'next'
import './globals.css'
import { ReduxProvider } from '../components/ReduxProvider'

export const metadata: Metadata = {
  title: 'Pipguardian Premier',
  description: 'PipGuardian is a smart forex platform built for confident growth. We focus on disciplined trading and capital protection.',
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
