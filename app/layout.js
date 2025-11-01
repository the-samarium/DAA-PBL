import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import LayoutWrapper from '@/components/LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AgriLink - Connecting Farmers with Modern Equipment',
  description: 'Rent or buy harvesters and agricultural equipment easily',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#0A0A0A]">
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
