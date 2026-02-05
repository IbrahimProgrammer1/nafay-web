import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import Fuse from 'fuse.js'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ laptops: [] })
    }

    // Get all laptops
    const allLaptops = await prisma.laptop.findMany({
      where: { isAvailable: true },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    // Configure Fuse.js for fuzzy search
    const fuse = new Fuse(allLaptops, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'brand.name', weight: 1.5 },
        { name: 'processor', weight: 1 },
        { name: 'description', weight: 0.5 },
      ],
      threshold: 0.4,
      includeScore: true,
    })

    const results = fuse.search(query)
    const laptops = results.map(result => result.item)

    // Log search
    await prisma.searchLog.create({
      data: {
        searchQuery: query,
        resultsCount: laptops.length,
      },
    })

    return NextResponse.json({ laptops, query })
  } catch (error) {
    console.error('Error searching laptops:', error)
    return NextResponse.json(
      { error: 'Failed to search laptops' },
      { status: 500 }
    )
  }
}
