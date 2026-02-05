import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import Fuse from 'fuse.js'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    // Return empty array if query is too short
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Get all available laptops with minimal fields for performance
    const allLaptops = await prisma.laptop.findMany({
      where: { isAvailable: true },
      select: {
        id: true,
        name: true,
        slug: true,
        mainImage: true,
        price: true,
        brand: {
          select: {
            name: true,
          },
        },
      },
    })

    // Configure Fuse.js for fuzzy search with typo tolerance
    const fuse = new Fuse(allLaptops, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'brand.name', weight: 1.5 },
      ],
      threshold: 0.4, // Allows for typos and misspellings
      includeScore: true,
      ignoreLocation: true, // Search anywhere in the string
      minMatchCharLength: 2,
    })

    const results = fuse.search(query)

    // Limit to top 8 suggestions for autocomplete
    const suggestions = results.slice(0, 8).map(result => ({
      id: result.item.id,
      name: result.item.name,
      slug: result.item.slug,
      mainImage: result.item.mainImage,
      price: result.item.price,
      brandName: result.item.brand.name,
      score: result.score, // Include score for debugging/ranking
    }))

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
}
