'use client'

import Link from 'next/link'
import { Heart, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import SearchAutocomplete from './SearchAutocomplete'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-black/[0.05]" style={{ height: '76px' }}>
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Heavier with more breathing room */}
          <Link href="/" className="flex items-center mr-12">
            <div className="text-2xl font-bold text-text-primary font-space-grotesk tracking-wide">NAFAY</div>
          </Link>

          {/* Desktop Search - Premium Feature */}
          <SearchAutocomplete
            placeholder="Search for laptops..."
            className="hidden md:flex flex-1 max-w-lg"
            inputClassName="pr-12 h-11 bg-[#F2F2F3] border-0 rounded-full text-[15px] placeholder:text-text-secondary/70 placeholder:font-medium"
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 ml-8">
            <Link href="/laptops" className="text-[15px] font-semibold text-text-primary hover:text-accent-orange transition-colors">
              Browse Laptops
            </Link>
            <Link href="/wishlist" className="flex items-center space-x-1.5 text-[14px] font-medium text-text-secondary hover:text-accent-orange transition-colors">
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 bg-white rounded-xl mt-2 p-4 border border-black/[0.06]">
            <SearchAutocomplete
              placeholder="Search for laptops..."
              className="w-full"
              inputClassName="pr-10 rounded-full bg-[#F2F2F3] border-0"
            />
            <Link
              href="/laptops"
              className="block text-sm font-medium text-text-primary hover:text-accent-orange transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Laptops
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-accent-orange transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="h-5 w-5" />
              <span>Wishlist</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
