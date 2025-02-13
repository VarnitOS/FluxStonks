import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import BackgroundEffects from '@/components/BackgroundEffects'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FluxStonks',
  description: 'Real-time stock market tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A0B0F]`}>
        <main className="min-h-screen relative">
          <BackgroundEffects />
          <Header />
          {children}
        </main>
      </body>
    </html>
  )
}
