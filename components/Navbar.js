'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup'
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  // Don't show navbar on auth pages
  if (isAuthPage) {
    return null
  }

  // Public landing page navbar
  if (isPublicPage) {
    return (
      <nav className="bg-[#0A0A0A] border-b border-[#0F5132]/30 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-[#0F5132]/20 rounded-lg flex items-center justify-center">
                <span className="text-[#0F5132] font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold text-white">AgriLink</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-[#0F5132] text-[#0F5132] hover:bg-[#0F5132] hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#0F5132] text-white hover:bg-[#0F5132]/80">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Authenticated user top bar
  if (user) {
    return (
      <div className="fixed top-0 right-0 left-64 h-16 bg-[#0A0A0A] border-b border-[#0F5132]/30 z-30 flex items-center justify-end px-6 space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg">
          <User className="h-4 w-4 text-[#0F5132]" />
          <span className="text-sm text-gray-300">{user.email}</span>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-[#0F5132] text-[#0F5132] hover:bg-[#0F5132] hover:text-white"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    )
  }

  return null
}
