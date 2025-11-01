'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { PlusCircle } from 'lucide-react'

export default function AddHarvesterPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    pricePerDay: '',
    description: ''
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)

    try {
      const { error } = await supabase
        .from('harvesters')
        .insert({
          name: formData.name,
          image: formData.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
          price_per_day: parseFloat(formData.pricePerDay),
          description: formData.description,
          user_id: user.id  // Store the user_id
        })

      if (error) throw error

      toast.success('Harvester added successfully!')
      router.push('/dashboard/my-added-equipments')
    } catch (error) {
      console.error('Add harvester error:', error)
      toast.error('Failed to add harvester')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <PlusCircle className="h-12 w-12 text-[#0F5132]" />
            </div>
            <h1 className="text-4xl font-bold text-white">Add New Harvester</h1>
            <p className="text-gray-400 mt-2">List a new harvester for rent or sale</p>
          </div>

          <Card className="bg-[#0A0A0A] border-[#0F5132]">
            <CardHeader>
              <CardTitle className="text-white">Harvester Details</CardTitle>
              <CardDescription className="text-gray-400">
                Enter the information for the new harvester
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Harvester Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., John Deere S780"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-[#0A0A0A] border-[#0F5132]/50 text-white focus:border-[#0F5132]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-white">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://example.com/image.jpg (optional)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="bg-[#0A0A0A] border-[#0F5132]/50 text-white focus:border-[#0F5132]"
                  />
                  <p className="text-xs text-gray-500">Leave blank to use default placeholder</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">Price Per Day (Rs.) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 1500.00"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                    required
                    className="bg-[#0A0A0A] border-[#0F5132]/50 text-white focus:border-[#0F5132]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the harvester features, specifications, and condition..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="bg-[#0A0A0A] border-[#0F5132]/50 text-white focus:border-[#0F5132] min-h-[120px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0F5132] text-white hover:bg-[#0F5132]/80 py-6"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : (
                    <>
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Add Harvester
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
