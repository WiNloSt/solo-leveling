import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import classNames from 'classnames'
import { Header } from '@/components/Header'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '나 혼자만 레벨업 (영어)',
  description: '나 혼자만 레벨업 (영어)',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={classNames(inter.className)}>
        <Header />
        <div className="max-w-7xl mx-auto py-3 px-4">{children}</div>
        <SpeedInsights />
      </body>
    </html>
  )
}
