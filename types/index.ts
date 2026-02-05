export interface Brand {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Laptop {
  id: string
  brandId: string
  name: string
  slug: string
  description: string
  processor: string
  ram: string
  storage: string
  graphics: string
  display: string
  price: number
  stockQuantity: number
  isAvailable: boolean
  mainImage: string
  image2: string | null
  image3: string | null
  image4: string | null
  image5: string | null
  fakeRating: number
  fakeReviewCount: number
  viewCount: number
  searchCount: number
  wishlistCount: number
  createdAt: Date
  updatedAt: Date
  brand?: Brand
}

export interface WishlistItem {
  id: string
  laptopId: string
  sessionId: string
  createdAt: Date
  laptop?: Laptop
}

export interface SearchLog {
  id: string
  searchQuery: string
  resultsCount: number
  createdAt: Date
}

export interface LaptopFilters {
  brandIds?: string[]
  minPrice?: number
  maxPrice?: number
  ram?: string[]
  storage?: string[]
  processor?: string[]
  graphics?: string[]
  sortBy?: 'price_asc' | 'price_desc' | 'newest'
  page?: number
  limit?: number
}
