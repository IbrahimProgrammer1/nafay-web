'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import LaptopCard from '@/components/customer/LaptopCard'
import FilterSidebar from '@/components/customer/FilterSidebar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function LaptopsPageContent() {
  const searchParams = useSearchParams()
  const [laptops, setLaptops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<any>(null)
  const [filters, setFilters] = useState<any>({})
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  const fetchLaptops = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
      })

      if (filters.brandIds?.length) {
        params.append('brandIds', filters.brandIds.join(','))
      }
      if (filters.ram?.length) {
        params.append('ram', filters.ram.join(','))
      }
      if (filters.storage?.length) {
        params.append('storage', filters.storage.join(','))
      }
      if (filters.processor?.length) {
        params.append('processor', filters.processor.join(','))
      }
      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice.toString())
      }
      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice.toString())
      }

      const response = await fetch(`/api/laptops?${params}`)
      const data = await response.json()
      setLaptops(data.laptops)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching laptops:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy, currentPage])

  useEffect(() => {
    fetchLaptops()
  }, [fetchLaptops])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  return (
    <div className="bg-[#F7F7F8] min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Header */}
        <div className="mb-12">
          <h1 className="text-[36px] font-semibold text-text-primary tracking-tighter mb-2">
            Browse Laptops
          </h1>
          <p className="text-[15px] text-text-secondary">
            Find the perfect machine for your workflow
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Bar */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-text-secondary">
                {pagination && `${pagination.total} laptops found`}
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] h-9 text-xs bg-[#F6F6F7] border-0">
                  <SelectValue placeholder="Sort by" />
                  <ChevronDown className="h-3 w-3 ml-2" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Laptop Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[420px]" />
                ))}
              </div>
            ) : laptops.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
                <p className="text-[15px] text-text-secondary">No laptops found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {laptops.map(laptop => (
                    <LaptopCard key={laptop.id} laptop={laptop} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? 'default' : 'outline'}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage(p => Math.min(pagination.totalPages, p + 1))
                      }
                      disabled={currentPage === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LaptopsPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#F7F7F8] min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-[36px] font-semibold text-text-primary tracking-tighter mb-2">
              Browse Laptops
            </h1>
            <p className="text-[15px] text-text-secondary">
              Find the perfect machine for your workflow
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <Skeleton className="h-[600px]" />
            </aside>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[420px]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <LaptopsPageContent />
    </Suspense>
  )
}
