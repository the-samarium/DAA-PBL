'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { DollarSign } from 'lucide-react'

export default function HarvestersPage() {
  const router = useRouter()
  const [harvesters, setHarvesters] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState('asc')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      fetchHarvesters()
    }
    checkAuth()
  }, [router])

  const fetchHarvesters = async () => {
    try {
      const { data, error } = await supabase
        .from('harvesters')
        .select('*')
        .order('price_per_day', { ascending: sortOrder === 'asc' })

      if (error) throw error
      setHarvesters(data || [])
    } catch (error) {
      toast.error('Failed to load harvesters')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      fetchHarvesters()
    }
  }, [sortOrder])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white">Loading harvesters...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white">Available Harvesters</h1>
              <p className="text-gray-400 mt-2">Browse and select equipment for your needs</p>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-white text-sm">Sort by Price:</label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px] bg-[#0A0A0A] border-[#0F5132] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border-[#0F5132]">
                  <SelectItem value="asc" className="text-white">Low to High</SelectItem>
                  <SelectItem value="desc" className="text-white">High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Harvesters Grid */}
          {harvesters.length === 0 ? (
            <Card className="bg-[#0A0A0A] border-[#0F5132]">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400">No harvesters available yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {harvesters.map((harvester) => (
                <Card key={harvester.id} className="bg-[#0A0A0A] border-[#0F5132] hover:border-[#0F5132] hover:shadow-lg hover:shadow-[#0F5132]/20 transition-all">
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
                      <img
                        src={harvester.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'}
                        alt={harvester.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <CardTitle className="text-white">{harvester.name}</CardTitle>
                      <CardDescription className="text-gray-400 mt-2">
                        {harvester.description?.substring(0, 80)}...
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 text-[#0F5132] font-bold text-xl">
                      <span>Rs. {parseFloat(harvester.price_per_day).toFixed(2)}</span>
                      <span className="text-sm text-gray-400 font-normal">/day</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/home/harvesters/${harvester.id}?type=rent`} className="flex-1">
                        <Button className="w-full bg-[#0F5132] text-white hover:bg-[#0F5132]/80">
                          Rent Now
                        </Button>
                      </Link>
                      <Link href={`/home/harvesters/${harvester.id}?type=buy`} className="flex-1">
                        <Button variant="outline" className="w-full border-[#0F5132] text-[#0F5132] hover:bg-[#0F5132] hover:text-white">
                          Buy Now
                        </Button>
                      </Link>
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
