'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { getSessionId } from '@/lib/session'

interface WishlistButtonProps {
  laptopId: string
  laptopName: string
}

export default function WishlistButton({ laptopId, laptopName }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  const checkWishlistStatus = useCallback(async () => {
    try {
      const sessionId = getSessionId()
      const response = await fetch(`/api/wishlist?session_id=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        const inWishlist = data.items.some((item: any) => item.laptopId === laptopId)
        setIsInWishlist(inWishlist)
      }
    } catch (error) {
      console.error('Error checking wishlist:', error)
    }
  }, [laptopId])

  useEffect(() => {
    checkWishlistStatus()
  }, [checkWishlistStatus])

  const toggleWishlist = async () => {
    setLoading(true)
    try {
      const sessionId = getSessionId()

      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist/${laptopId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })

        if (response.ok) {
          setIsInWishlist(false)
          toast.success('Removed from wishlist')
        } else {
          toast.error('Failed to remove from wishlist')
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ laptopId, sessionId }),
        })

        if (response.ok) {
          setIsInWishlist(true)
          toast.success(`${laptopName} added to wishlist`)
        } else {
          toast.error('Failed to add to wishlist')
        }
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={toggleWishlist}
      variant="outline"
      size="lg"
      disabled={loading}
      className="w-full border-2 border-text-primary/20 hover:border-accent-orange hover:bg-accent-orange/5 text-text-primary"
    >
      <Heart className={`mr-2 h-5 w-5 ${isInWishlist ? 'fill-current text-accent-orange' : ''}`} />
      {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
    </Button>
  )
}
