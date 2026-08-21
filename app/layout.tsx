import type { Metadata } from 'next'
import './globals.css'
import { ReduxProvider } from '../components/ReduxProvider'
import { ThemeProvider } from '../components/ThemeProvider'
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white antialiased transition-colors duration-200">
        <ThemeProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
