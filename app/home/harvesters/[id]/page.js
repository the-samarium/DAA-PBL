'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { DollarSign, ArrowLeft, Package } from 'lucide-react'

export default function HarvesterDetailPage({ params }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'rent'
  const [harvester, setHarvester] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      fetchHarvester()
    }
    checkAuth()
  }, [router, params.id])

  const fetchHarvester = async () => {
    try {
      const { data, error } = await supabase
        .from('harvesters')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setHarvester(data)
    } catch (error) {
      toast.error('Failed to load harvester details')
      router.push('/home/harvesters')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = () => {
    router.push(`/checkout?harvesterId=${params.id}&type=${type}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!harvester) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white">Harvester not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Link href="/home/harvesters">
            <Button variant="ghost" className="text-white hover:text-[#0F5132]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Harvesters
            </Button>
          </Link>

          {/* Harvester Detail Card */}
          <Card className="bg-[#0A0A0A] border-[#0F5132]">
            <CardHeader>
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-6">
                <img
                  src={harvester.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'}
                  alt={harvester.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl text-white">{harvester.name}</CardTitle>
                  <CardDescription className="text-gray-400 mt-2">
                    {type === 'rent' ? 'Available for Rental' : 'Available for Purchase'}
                  </CardDescription>
                </div>
                <div className="bg-[#0F5132]/20 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2 text-[#0F5132] font-bold text-2xl">
                    <DollarSign className="h-6 w-6" />
                    <span>{parseFloat(harvester.price_per_day).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-400 text-center mt-1">/day</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-400 leading-relaxed">{harvester.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Model</p>
                    <p className="text-white font-semibold">{harvester.name}</p>
                  </div>
                  <div className="bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Daily Rate</p>
                    <p className="text-white font-semibold">${parseFloat(harvester.price_per_day).toFixed(2)}</p>
                  </div>
                  <div className="bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Type</p>
                    <p className="text-white font-semibold">{type === 'rent' ? 'Rental' : 'Purchase'}</p>
                  </div>
                  <div className="bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Availability</p>
                    <p className="text-[#0F5132] font-semibold">Available Now</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-[#0F5132] text-white hover:bg-[#0F5132]/80 py-6 text-lg"
              >
                <Package className="mr-2 h-5 w-5" />
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
