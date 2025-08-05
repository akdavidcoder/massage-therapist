import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Massage Therapy Booking',
  description: 'Book your massage therapy session',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={inter.className}
        suppressHydrationWarning 
        data-new-gr-c-s-check-loaded="14.1246.0"
        data-gr-ext-installed=""
        cz-shortcut-listen="true"
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}