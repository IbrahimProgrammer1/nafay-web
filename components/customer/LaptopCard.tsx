'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Laptop } from '@/types'

interface LaptopCardProps {
  laptop: Laptop & { brand: { name: string } }
}

export default function LaptopCard({ laptop }: LaptopCardProps) {
  return (
    <Link href={`/laptops/${laptop.slug}`}>
      <Card className="group h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)] border-0 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
        <CardContent className="p-6">
          {/* Image */}
          <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-2xl bg-[#F8F8F9]">
            <Image
              src={laptop.mainImage}
              alt={laptop.name}
              fill
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!laptop.isAvailable && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
              </div>
            )}
          </div>

          {/* Brand - Small & Muted */}
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1.5 font-medium">
            {laptop.brand.name}
          </p>

          {/* Model Name - Hero */}
          <h3 className="text-lg font-semibold text-text-primary mb-3 line-clamp-2 leading-tight tracking-tight group-hover:text-accent-orange transition-colors">
            {laptop.name}
          </h3>

          {/* Specs - Short & Sharp */}
          <div className="mb-4">
            <p className="text-xs text-text-secondary">
              {laptop.processor.split(' ').slice(0, 2).join(' ')} • {laptop.ram} • {laptop.storage}
            </p>
          </div>

          {/* Price - Anchor */}
          <div className="mb-4">
            <span className="text-[22px] font-semibold text-text-primary">
              {formatPrice(Number(laptop.price))}
            </span>
          </div>

          {/* Rating & Views - Whispered Social Proof */}
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{laptop.fakeRating}</span>
              <span className="text-text-secondary/60">({laptop.fakeReviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{laptop.viewCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
