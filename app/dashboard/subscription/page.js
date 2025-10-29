'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { Check, Crown, Zap, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: Zap,
    color: 'gray',
    features: [
      'List up to 3 equipments',
      'Basic listing visibility',
      'Standard support',
      'View all equipment',
      'Rent equipment'
    ],
    limitations: [
      'No featured listings',
      'Limited to 3 active listings'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    icon: Star,
    color: 'blue',
    popular: false,
    features: [
      'List up to 10 equipments',
      'Priority listing visibility',
      'Email support',
      'Basic analytics',
      'Featured once per month',
      'Reduced platform fee (10%)'
    ],
    limitations: []
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    icon: Crown,
    color: '[#0F5132]',
    popular: true,
    features: [
      'Unlimited equipment listings',
      'Top priority visibility',
      'Featured listings (3x/month)',
      'Advanced analytics dashboard',
      'Priority 24/7 support',
      'Promoted in recommendations',
      'Lowest platform fee (5%)',
      'Verified seller badge'
    ],
    limitations: []
  }
]

export default function SubscriptionPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      fetchCurrentPlan(user.id)
    }
    checkAuth()
  }, [router])

  const fetchCurrentPlan = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setCurrentPlan(data?.plan_type || 'free')
    } catch (error) {
      console.error('Error fetching plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId) => {
    if (!user) return
    
    setSubscribing(planId)
    try {
      // Check if user already has a subscription
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existing) {
        // Update existing subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan_type: planId,
            start_date: new Date().toISOString(),
            end_date: planId === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            is_active: true
          })
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            plan_type: planId,
            start_date: new Date().toISOString(),
            end_date: planId === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            is_active: true
          })

        if (error) throw error
      }

      setCurrentPlan(planId)
      toast.success(`Successfully subscribed to ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan!`)
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setSubscribing(null)
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
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Plan</h1>
          <p className="text-gray-400">Select the perfect subscription for your agricultural business</p>
          {currentPlan && (
            <Badge className="mt-4 bg-[#0F5132]/20 text-[#0F5132] border-[#0F5132]/50 border">
              Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = currentPlan === plan.id
            
            return (
              <Card 
                key={plan.id}
                className={`bg-[#0A0A0A] relative transition-all ${
                  plan.popular 
                    ? 'border-[#0F5132] shadow-lg shadow-[#0F5132]/20 scale-105' 
                    : 'border-[#0F5132]/30 hover:border-[#0F5132]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#0F5132] text-white border-0">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  {(() => {
                    const iconBgClass =
                      plan.id === 'free'
                        ? 'bg-gray-500/20'
                        : plan.id === 'basic'
                        ? 'bg-blue-500/20'
                        : 'bg-[#0F5132]/20'
                    const iconTextClass =
                      plan.id === 'free'
                        ? 'text-gray-500'
                        : plan.id === 'basic'
                        ? 'text-blue-500'
                        : 'text-[#0F5132]'
                    return (
                      <div className={`h-12 w-12 ${iconBgClass} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 ${iconTextClass}`} />
                      </div>
                    )
                  })()}
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline mt-4">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-[#0F5132] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCurrentPlan || subscribing === plan.id}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-[#0F5132] hover:bg-[#0F5132]/80 text-white'
                        : 'bg-[#0F5132]/10 hover:bg-[#0F5132]/20 text-[#0F5132] border border-[#0F5132]/30'
                    }`}
                  >
                    {subscribing === plan.id ? 'Processing...' : isCurrentPlan ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Benefits Section */}
        <Card className="bg-[#0A0A0A] border-[#0F5132]">
          <CardHeader>
            <CardTitle className="text-white">Why Upgrade?</CardTitle>
            <CardDescription className="text-gray-400">
              Premium features help you earn more and grow faster
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="h-10 w-10 bg-[#0F5132]/20 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-[#0F5132]" />
                </div>
                <h3 className="text-white font-semibold">Featured Listings</h3>
                <p className="text-sm text-gray-400">Get your equipment shown first to potential renters</p>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 bg-[#0F5132]/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-[#0F5132]" />
                </div>
                <h3 className="text-white font-semibold">Priority Support</h3>
                <p className="text-sm text-gray-400">Get help faster with dedicated support channels</p>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 bg-[#0F5132]/20 rounded-lg flex items-center justify-center">
                  <Crown className="h-5 w-5 text-[#0F5132]" />
                </div>
                <h3 className="text-white font-semibold">Lower Fees</h3>
                <p className="text-sm text-gray-400">Pay less in platform fees and keep more profit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
