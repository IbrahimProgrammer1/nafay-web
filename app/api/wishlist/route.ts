import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    const items = await prisma.wishlistItem.findMany({
      where: { sessionId },
      include: {
        laptop: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { laptopId, sessionId } = body

    if (!laptopId || !sessionId) {
      return NextResponse.json(
        { error: 'Laptop ID and session ID required' },
        { status: 400 }
      )
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        laptopId_sessionId: {
          laptopId,
          sessionId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Already in wishlist' },
        { status: 400 }
      )
    }

    // Add to wishlist and increment count
    const [item] = await Promise.all([
      prisma.wishlistItem.create({
        data: { laptopId, sessionId },
        include: {
          laptop: {
            include: {
              brand: true,
            },
          },
        },
      }),
      prisma.laptop.update({
        where: { id: laptopId },
        data: { wishlistCount: { increment: 1 } },
      }),
    ])

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}
