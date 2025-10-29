'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { Package, History, PlusCircle, User } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">Welcome to AgriLink</h1>
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <User className="h-5 w-5 text-[#0F5132]" />
              <p>{user?.email}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/home/harvesters" className="block">
              <Card className="bg-[#0A0A0A] border-[#0F5132] hover:border-[#0F5132] hover:shadow-lg hover:shadow-[#0F5132]/20 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="h-12 w-12 bg-[#0F5132]/20 rounded-lg flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-[#0F5132]" />
                  </div>
                  <CardTitle className="text-white">Browse Harvesters</CardTitle>
                  <CardDescription className="text-gray-400">
                    View all available harvesters for rent or purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-[#0F5132] text-white hover:bg-[#0F5132]/80">
                    View Equipment
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/history" className="block">
              <Card className="bg-[#0A0A0A] border-[#0F5132] hover:border-[#0F5132] hover:shadow-lg hover:shadow-[#0F5132]/20 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="h-12 w-12 bg-[#0F5132]/20 rounded-lg flex items-center justify-center mb-4">
                    <History className="h-6 w-6 text-[#0F5132]" />
                  </div>
                  <CardTitle className="text-white">My History</CardTitle>
                  <CardDescription className="text-gray-400">
                    View your purchase and rental history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-[#0F5132] text-white hover:bg-[#0F5132]/80">
                    View History
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/add-harvester" className="block">
              <Card className="bg-[#0A0A0A] border-[#0F5132] hover:border-[#0F5132] hover:shadow-lg hover:shadow-[#0F5132]/20 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="h-12 w-12 bg-[#0F5132]/20 rounded-lg flex items-center justify-center mb-4">
                    <PlusCircle className="h-6 w-6 text-[#0F5132]" />
                  </div>
                  <CardTitle className="text-white">Add Harvester</CardTitle>
                  <CardDescription className="text-gray-400">
                    Add a new harvester to the marketplace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-[#0F5132] text-white hover:bg-[#0F5132]/80">
                    Add Equipment
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
