import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AgriLink Lite - Connecting Farmers with Modern Equipment',
  description: 'Rent or buy harvesters and agricultural equipment easily',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#0A0A0A]">
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
