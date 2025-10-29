'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { Toaster } from '@/components/ui/sonner'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup'
  const showSidebar = !isPublicPage && user && !loading

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#0A0A0A]">
          {showSidebar && <Sidebar />}
          <div className={showSidebar ? "lg:ml-64" : ""}>
            <Navbar />
            <main className={showSidebar ? "pt-16" : ""}>{children}</main>
          </div>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
