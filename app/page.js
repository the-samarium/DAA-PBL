'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tractor, Package, Users, Shield, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Connecting Farmers with
            <span className="text-[#0F5132]"> Modern Equipment</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Rent or purchase high-quality harvesters and agricultural equipment. 
            Simplify your farming operations with AgriLink.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-[#0F5132] text-white hover:bg-[#0F5132]/80 text-lg px-8 py-6">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-[#0F5132] text-[#0F5132] hover:bg-[#0F5132] hover:text-white text-lg px-8 py-6">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-8 space-y-4 hover:border-[#0F5132] transition-all">
            <div className="h-12 w-12 bg-[#0F5132]/20 rounded-lg flex items-center justify-center">
              <Tractor className="h-6 w-6 text-[#0F5132]" />
            </div>
            <h3 className="text-xl font-bold">Quality Equipment</h3>
            <p className="text-gray-400">
              Access to top-tier harvesters and agricultural machinery from trusted brands.
            </p>
          </div>

          <div className="bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-8 space-y-4 hover:border-[#0F5132] transition-all">
            <div className="h-12 w-12 bg-[#0F5132]/20 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-[#0F5132]" />
            </div>
            <h3 className="text-xl font-bold">Flexible Options</h3>
            <p className="text-gray-400">
              Choose to rent daily or purchase equipment based on your farming needs.
            </p>
          </div>

          <div className="bg-[#0F5132]/10 border border-[#0F5132]/30 rounded-lg p-8 space-y-4 hover:border-[#0F5132] transition-all">
            <div className="h-12 w-12 bg-[#0F5132]/20 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-[#0F5132]" />
            </div>
            <h3 className="text-xl font-bold">Simple Process</h3>
            <p className="text-gray-400">
              Easy browsing, quick checkout, and transparent pricing for all equipment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-[#0F5132]/20 border border-[#0F5132] rounded-lg p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-gray-300">
            Join AgriLink today and discover how easy it is to access the equipment you need.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-[#0F5132] text-white hover:bg-[#0F5132]/80">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#0F5132]/30 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">© 2024 AgriLink. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#0F5132] text-sm transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-[#0F5132] text-sm transition-colors">Contact</a>
              <a href="#" className="text-gray-400 hover:text-[#0F5132] text-sm transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
