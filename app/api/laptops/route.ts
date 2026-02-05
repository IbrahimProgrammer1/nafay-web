import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const brandIds = searchParams.get('brandIds')?.split(',').filter(Boolean)
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const ram = searchParams.get('ram')?.split(',').filter(Boolean)
    const storage = searchParams.get('storage')?.split(',').filter(Boolean)
    const processor = searchParams.get('processor')?.split(',').filter(Boolean)
    const graphics = searchParams.get('graphics')?.split(',').filter(Boolean)
    const sortBy = searchParams.get('sortBy') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isAvailable: true,
    }

    if (brandIds && brandIds.length > 0) {
      where.brandId = { in: brandIds }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (ram && ram.length > 0) {
      where.OR = ram.map(r => ({
        ram: { contains: r, mode: 'insensitive' }
      }))
    }

    if (storage && storage.length > 0) {
      const storageConditions = storage.map(s => ({
        storage: { contains: s, mode: 'insensitive' }
      }))

      if (where.OR) {
        // If OR already exists (from RAM), combine with AND
        where.AND = [
          { OR: where.OR },
          { OR: storageConditions }
        ]
        delete where.OR
      } else {
        where.OR = storageConditions
      }
    }

    if (processor && processor.length > 0) {
      const processorConditions = processor.map(p => ({
        processor: { contains: p, mode: 'insensitive' }
      }))

      if (where.AND) {
        // If AND already exists, add to it
        where.AND.push({ OR: processorConditions })
      } else if (where.OR) {
        // If only OR exists, create AND with both
        where.AND = [
          { OR: where.OR },
          { OR: processorConditions }
        ]
        delete where.OR
      } else {
        where.OR = processorConditions
      }
    }

    if (graphics && graphics.length > 0) {
      if (graphics.includes('Integrated')) {
        where.graphics = { contains: 'Integrated', mode: 'insensitive' }
      } else if (graphics.includes('Dedicated')) {
        where.graphics = { not: { contains: 'Integrated', mode: 'insensitive' } }
      }
    }

    // Build orderBy
    let orderBy: any = { createdAt: 'desc' }
    if (sortBy === 'price_asc') {
      orderBy = { price: 'asc' }
    } else if (sortBy === 'price_desc') {
      orderBy = { price: 'desc' }
    }

    const [laptops, total] = await Promise.all([
      prisma.laptop.findMany({
        where,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.laptop.count({ where }),
    ])

    return NextResponse.json({
      laptops,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching laptops:', error)
    return NextResponse.json(
      { error: 'Failed to fetch laptops' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const laptop = await prisma.laptop.create({
      data: {
        ...body,
        price: parseFloat(body.price),
        stockQuantity: parseInt(body.stockQuantity),
        fakeRating: parseFloat(body.fakeRating || 4.5),
        fakeReviewCount: parseInt(body.fakeReviewCount || 0),
      },
      include: {
        brand: true,
      },
    })

    return NextResponse.json(laptop, { status: 201 })
  } catch (error) {
    console.error('Error creating laptop:', error)
    return NextResponse.json(
      { error: 'Failed to create laptop' },
      { status: 500 }
    )
  }
}
