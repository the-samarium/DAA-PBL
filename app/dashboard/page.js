'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabaseClient'
import { Package, TrendingUp, Clock, DollarSign, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalHarvesters: 0,
    myPurchases: 0,
    activeRentals: 0
  })
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        await Promise.all([
          fetchStats(user.id),
          fetchPromotions()
        ])
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  const fetchStats = async (userId) => {
    try {
      // Get total harvesters
      const { count: harvestersCount } = await supabase
        .from('harvesters')
        .select('*', { count: 'exact', head: true })

      // Get user's purchases
      const { data: purchases } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId)

      // Get user's rentals
      const { data: rentals } = await supabase
        .from('rentals')
        .select('*')
        .eq('user_id', userId)

      const activeRentals = rentals?.filter(r => {
        const returnDate = new Date(r.return_date)
        const today = new Date()
        return returnDate >= today
      }).length || 0
      
      setStats({
        totalHarvesters: harvestersCount || 0,
        myPurchases: purchases?.length || 0,
        activeRentals: activeRentals
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .limit(3)

      if (error) throw error
      setPromotions(data || [])
    } catch (error) {
      console.error('Error fetching promotions:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back! 👋</h1>
          <p className="text-gray-400">Here's what's happening with your agricultural equipment</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-[#0A0A0A] border-[#0F5132] hover:shadow-lg hover:shadow-[#0F5132]/10 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Available Equipment</CardTitle>
              <div className="h-10 w-10 bg-[#0F5132]/20 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-[#0F5132]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalHarvesters}</div>
              <p className="text-xs text-gray-500 mt-1">Ready for rent or purchase</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#0F5132] hover:shadow-lg hover:shadow-[#0F5132]/10 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">My Orders</CardTitle>
              <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.myPurchases}</div>
              <p className="text-xs text-gray-500 mt-1">Total purchases & rentals</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#0F5132] hover:shadow-lg hover:shadow-[#0F5132]/10 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Rentals</CardTitle>
              <div className="h-10 w-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.activeRentals}</div>
              <p className="text-xs text-gray-500 mt-1">Currently renting</p>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Promotions */}
        {promotions.length > 0 && (
          <Card className="bg-[#0A0A0A] border-[#0F5132]">
            <CardHeader>
              <CardTitle className="text-white">Recommended for You</CardTitle>
              <CardDescription className="text-gray-400">
                Special offers and featured listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {promotions.map((promo) => (
                  <Link key={promo.id} href={promo.link || '#'}>
                    <div className="bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg overflow-hidden hover:border-[#0F5132] transition-all cursor-pointer group">
                      <div className="aspect-video bg-gray-800 overflow-hidden">
                        <img
                          src={promo.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'}
                          alt={promo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-1 group-hover:text-[#0F5132] transition-colors">
                          {promo.title}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{promo.description}</p>
                        <div className="flex items-center mt-2 text-[#0F5132] text-sm">
                          <span>Learn more</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="bg-[#0A0A0A] border-[#0F5132]">
          <CardHeader>
            <CardTitle className="text-white">Quick Start</CardTitle>
            <CardDescription className="text-gray-400">
              Start exploring equipment or manage your listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-4">
                <Package className="h-8 w-8 text-[#0F5132] mb-3" />
                <h3 className="text-white font-semibold mb-1">Browse Equipment</h3>
                <p className="text-sm text-gray-400 mb-3">Explore available harvesters for rent or purchase</p>
                <a href="/home/harvesters" className="text-[#0F5132] text-sm font-medium hover:underline">
                  View Harvesters →
                </a>
              </div>
              <div className="flex-1 bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-4">
                <DollarSign className="h-8 w-8 text-[#0F5132] mb-3" />
                <h3 className="text-white font-semibold mb-1">List Equipment</h3>
                <p className="text-sm text-gray-400 mb-3">Add your harvester to the marketplace</p>
                <a href="/add-harvester" className="text-[#0F5132] text-sm font-medium hover:underline">
                  Add Harvester →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
