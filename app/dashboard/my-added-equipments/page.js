'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { Trash2, DollarSign } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function MyAddedEquipmentsPage() {
  const router = useRouter()
  const [equipments, setEquipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      fetchMyEquipments(user.id)
    }
    checkAuth()
  }, [router])

  const fetchMyEquipments = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('harvesters')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEquipments(data || [])
    } catch (error) {
      toast.error('Failed to load your equipments')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('harvesters')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Equipment deleted successfully')
      setEquipments(equipments.filter(eq => eq.id !== id))
    } catch (error) {
      toast.error('Failed to delete equipment')
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
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Added Equipments</h1>
          <p className="text-gray-400">Manage all equipment you've listed on AgriLink</p>
        </div>

        {equipments.length === 0 ? (
          <Card className="bg-[#0A0A0A] border-[#0F5132]">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 mb-4">You haven't added any equipment yet.</p>
              <Button
                onClick={() => router.push('/add-harvester')}
                className="bg-[#0F5132] text-white hover:bg-[#0F5132]/80"
              >
                Add Your First Equipment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipments.map((equipment) => (
              <Card key={equipment.id} className="bg-[#0A0A0A] border-[#0F5132] hover:border-[#0F5132] transition-all">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
                    <img
                      src={equipment.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'}
                      alt={equipment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{equipment.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                      {equipment.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-[#0F5132] font-bold">
                    <span>Rs. {parseFloat(equipment.price_per_day).toFixed(2)}</span>
                    <span className="text-xs text-gray-400 font-normal">/day</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#0A0A0A] border-[#0F5132]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            This will permanently delete this equipment listing. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-[#0A0A0A] border-[#0F5132] text-white hover:bg-[#0F5132]/10">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(equipment.id)}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
