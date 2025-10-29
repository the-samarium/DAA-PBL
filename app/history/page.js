'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { History, Package } from 'lucide-react'
import { format } from 'date-fns'

export default function HistoryPage() {
  const router = useRouter()
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      fetchPurchases(user.id)
    }
    checkAuth()
  }, [router])

  const fetchPurchases = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          harvesters (
            id,
            name,
            image,
            price_per_day
          )
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) throw error
      setPurchases(data || [])
    } catch (error) {
      toast.error('Failed to load purchase history')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white">Loading history...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <History className="h-12 w-12 text-[#0F5132]" />
            </div>
            <h1 className="text-4xl font-bold text-white">Purchase History</h1>
            <p className="text-gray-400 mt-2">View all your orders and rentals</p>
          </div>

          {purchases.length === 0 ? (
            <Card className="bg-[#0A0A0A] border-[#0F5132]">
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No purchase history yet.</p>
                <p className="text-gray-500 text-sm mt-2">Your orders will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <Card key={purchase.id} className="bg-[#0A0A0A] border-[#0F5132] hover:border-[#0F5132] transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 h-32 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={purchase.harvesters?.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'}
                          alt={purchase.harvesters?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              {purchase.harvesters?.name || 'Unknown Harvester'}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {(() => {
                                const orderDate = purchase?.date || purchase?.created_at
                                return orderDate
                                  ? `Order Date: ${format(new Date(orderDate), 'MMM dd, yyyy')}`
                                  : 'Order Date: N/A'
                              })()}
                            </p>
                          </div>
                          <Badge 
                            className={`${
                              purchase.type === 'rent' 
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' 
                                : 'bg-[#0F5132]/20 text-[#0F5132] border-[#0F5132]/50'
                            } border`}
                          >
                            {purchase.type === 'rent' ? 'Rental' : 'Purchase'}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Customer Name</p>
                            <p className="text-sm text-white">{purchase.customer_name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Contact</p>
                            <p className="text-sm text-white">{purchase.contact_number}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Daily Rate</p>
                            <p className="text-sm text-[#0F5132] font-semibold">
                              ${parseFloat(purchase.harvesters?.price_per_day || 0).toFixed(2)}/day
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Delivery Address</p>
                          <p className="text-sm text-white">{purchase.delivery_address}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
