'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import LaptopCard from '@/components/customer/LaptopCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from 'lucide-react'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [laptops, setLaptops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const searchLaptops = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/laptops/search?q=${encodeURIComponent(query)}`
      )
      const data = await response.json()
      setLaptops(data.laptops)
    } catch (error) {
      console.error('Error searching laptops:', error)
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    if (query) {
      searchLaptops()
    }
  }, [query, searchLaptops])

  if (loading) {
    return (
      <div className="bg-[#F7F7F8] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-[36px] font-semibold text-text-primary tracking-tighter">
              Search Results for &quot;{query}&quot;
            </h1>
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

  return (
    <div className="bg-[#F7F7F8] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-[36px] font-semibold text-text-primary tracking-tighter mb-2">
            Search Results
          </h1>
          <p className="text-[15px] text-text-secondary">
            {laptops.length} results for &quot;{query}&quot;
          </p>
        </div>

        {laptops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/[0.04]">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-text-primary/5 rounded-2xl mb-6">
              <Search className="h-8 w-8 text-text-secondary" />
            </div>
            <h2 className="text-[28px] font-semibold mb-3 text-text-primary tracking-tight">No Results Found</h2>
            <p className="text-[15px] leading-[1.6] text-text-secondary">
              Try searching with different keywords or browse all laptops.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {laptops.map(laptop => (
              <LaptopCard key={laptop.id} laptop={laptop} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#F7F7F8] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-[36px] font-semibold text-text-primary tracking-tighter">
              Searching...
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[420px]" />
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
