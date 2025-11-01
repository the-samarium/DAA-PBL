'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { Calendar, DollarSign, Clock } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

export default function MyRentedEquipmentsPage() {
  const router = useRouter()
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      fetchMyRentals(user.id)
    }
    checkAuth()
  }, [router])

  const fetchMyRentals = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('rentals')
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
        .order('rent_date', { ascending: false })

      if (error) throw error
      setRentals(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load your rentals')
    } finally {
      setLoading(false)
    }
  }

  const getDaysRemaining = (returnDate) => {
    const today = new Date()
    const returnDay = new Date(returnDate)
    const daysLeft = differenceInDays(returnDay, today)
    return daysLeft
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
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Rented Equipments</h1>
          <p className="text-gray-400">Track all your current and past equipment rentals</p>
        </div>

        {rentals.length === 0 ? (
          <Card className="bg-[#0A0A0A] border-[#0F5132]">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400">You haven't rented any equipment yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => {
              const daysRemaining = getDaysRemaining(rental.return_date)
              const isActive = daysRemaining >= 0

              return (
                <Card key={rental.id} className="bg-[#0A0A0A] border-[#0F5132]">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 h-32 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={rental.harvesters?.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'}
                          alt={rental.harvesters?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              {rental.harvesters?.name || 'Unknown Equipment'}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge 
                                className={`${
                                  isActive
                                    ? 'bg-[#0F5132]/20 text-[#0F5132] border-[#0F5132]/50' 
                                    : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                                } border`}
                              >
                                {isActive ? 'Active Rental' : 'Completed'}
                              </Badge>
                              {isActive && daysRemaining <= 3 && (
                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 border">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {daysRemaining} days left
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Rental Duration</p>
                            <p className="text-sm text-white font-semibold">{rental.rental_days} days</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Start Date</p>
                            <p className="text-sm text-white">{format(new Date(rental.rent_date), 'MMM dd, yyyy')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Return Date</p>
                            <p className="text-sm text-white">{format(new Date(rental.return_date), 'MMM dd, yyyy')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Price</p>
                            <p className="text-sm text-[#0F5132] font-bold">
                              Rs. {parseFloat(rental.total_price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Delivery Address</p>
                          <p className="text-sm text-white">{rental.delivery_address}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
