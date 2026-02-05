'use client'

import { useState, useEffect } from 'react'
import { getSessionId } from '@/lib/session'
import LaptopCard from '@/components/customer/LaptopCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    setLoading(true)
    try {
      const sessionId = getSessionId()
      const response = await fetch(`/api/wishlist?session_id=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#F7F7F8] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-[36px] font-semibold text-text-primary tracking-tighter">My Wishlist</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[420px]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#F7F7F8] min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-white rounded-3xl p-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/[0.04]">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-orange/10 rounded-2xl mb-6">
              <Heart className="h-8 w-8 text-accent-orange" />
            </div>
            <h1 className="text-[32px] font-semibold mb-4 text-text-primary tracking-tighter">Your Wishlist is Empty</h1>
            <p className="text-[15px] leading-[1.6] text-text-secondary mb-8">
              Start adding laptops to your wishlist to keep track of your favorites.
            </p>
            <Button asChild size="lg">
              <Link href="/laptops">Browse Laptops</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F7F7F8] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-[36px] font-semibold text-text-primary tracking-tighter mb-2">My Wishlist</h1>
          <p className="text-[15px] text-text-secondary">{items.length} items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map(item => (
            <LaptopCard key={item.id} laptop={item.laptop} />
          ))}
        </div>
      </div>
    </div>
  )
}
