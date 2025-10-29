'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, History, PlusCircle, Menu, X, ListChecks, Calendar, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/home/harvesters', icon: Package, label: 'Harvesters' },
    { href: '/dashboard/my-added-equipments', icon: ListChecks, label: 'My Equipments' },
    { href: '/dashboard/my-rented-equipments', icon: Calendar, label: 'My Rentals' },
    { href: '/history', icon: History, label: 'History' },
    { href: '/add-harvester', icon: PlusCircle, label: 'Add Harvester' },
    { href: '/dashboard/subscription', icon: CreditCard, label: 'Subscription' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0F5132] text-white rounded-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-[#0A0A0A] border-r border-[#0F5132]/30 transition-transform duration-300 z-40",
          "w-64 flex flex-col overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#0F5132]/30">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-[#0F5132]/20 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-[#0F5132]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AgriLink</h1>
              <p className="text-xs text-gray-400">Lite</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm",
                  isActive
                    ? "bg-[#0F5132] text-white shadow-lg shadow-[#0F5132]/20"
                    : "text-gray-400 hover:bg-[#0F5132]/10 hover:text-[#0F5132]"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#0F5132]/30">
          <div className="bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Need Help?</p>
            <p className="text-sm text-white">Contact Support</p>
          </div>
        </div>
      </aside>
    </>
  )
}
