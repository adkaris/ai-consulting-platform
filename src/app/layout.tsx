import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UniSystems AI Platform',
  description: 'AI Consulting Platform for managing the customer journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex`}>
        <Sidebar className="w-64 border-r border-slate-200 bg-white flex-shrink-0 shadow-sm" />
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <div className="mx-auto max-w-7xl p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
