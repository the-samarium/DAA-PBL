'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function LayoutWrapper({ children }) {
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
    <>
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? "lg:ml-64" : ""}>
        <Navbar />
        <main className={showSidebar ? "pt-16" : ""}>{children}</main>
      </div>
    </>
  )
}
