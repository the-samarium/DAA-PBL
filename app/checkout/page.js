'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { ShoppingCart, Check } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const harvesterId = searchParams.get('harvesterId')
  const type = searchParams.get('type')
  
  const [harvester, setHarvester] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    deliveryAddress: ''
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      fetchHarvester()
    }
    checkAuth()
  }, [router, harvesterId])

  const fetchHarvester = async () => {
    try {
      const { data, error } = await supabase
        .from('harvesters')
        .select('*')
        .eq('id', harvesterId)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          harvester_id: harvesterId,
          type: type,
          customer_name: formData.customerName,
          contact_number: formData.contactNumber,
          delivery_address: formData.deliveryAddress
        })

      if (error) throw error

      toast.success('Order placed successfully!')
      router.push('/history')
    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

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
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Checkout</h1>
            <p className="text-gray-400 mt-2">Complete your order details</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card className="bg-[#0A0A0A] border-[#0F5132] h-fit">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={harvester?.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'}
                    alt={harvester?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{harvester?.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {type === 'rent' ? 'Rental' : 'Purchase'}
                  </p>
                </div>
                <div className="bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Daily Rate</p>
                  <p className="text-[#0F5132] font-bold text-2xl">
                    ${parseFloat(harvester?.price_per_day || 0).toFixed(2)}/day
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Form */}
            <Card className="bg-[#0A0A0A] border-[#0F5132]">
              <CardHeader>
                <CardTitle className="text-white">Your Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Please provide your contact and delivery information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                      className="bg-[#0A0A0A] border-[#0F5132]/50 text-white focus:border-[#0F5132]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-white">Contact Number</Label>
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      required
                      className="bg-[#0A0A0A] border-[#0F5132]/50 text-white focus:border-[#0F5132]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">Delivery Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your full delivery address"
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      required
                      className="bg-[#0A0A0A] border-[#0F5132]/50 text-white focus:border-[#0F5132] min-h-[100px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#0F5132] text-white hover:bg-[#0F5132]/80 py-6"
                    disabled={submitting}
                  >
                    {submitting ? (
                      'Processing...'
                    ) : (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Confirm Order
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
