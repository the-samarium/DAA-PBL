'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, Home, Package, History, PlusCircle, User } from 'lucide-react'
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

  return (
    <nav className="bg-[#0A0A0A] border-b border-[#0F5132]/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-[#0F5132]" />
            <span className="text-xl font-bold text-white">AgriLink Lite</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-[#0F5132] hover:bg-[#0F5132]/10">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/home/harvesters">
                <Button variant="ghost" className="text-white hover:text-[#0F5132] hover:bg-[#0F5132]/10">
                  <Package className="h-4 w-4 mr-2" />
                  Harvesters
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="ghost" className="text-white hover:text-[#0F5132] hover:bg-[#0F5132]/10">
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </Link>
              <Link href="/add-harvester">
                <Button variant="ghost" className="text-white hover:text-[#0F5132] hover:bg-[#0F5132]/10">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </Link>
              <div className="flex items-center space-x-2 px-3 py-1 bg-[#0F5132]/20 rounded-md">
                <User className="h-4 w-4 text-[#0F5132]" />
                <span className="text-sm text-gray-300">{user.email}</span>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-[#0F5132] text-[#0F5132] hover:bg-[#0F5132] hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            !isPublicPage && (
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
            )
          )}
        </div>
      </div>
    </nav>
  )
}
