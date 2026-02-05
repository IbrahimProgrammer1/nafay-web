import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const laptop = await prisma.laptop.findUnique({
      where: { id },
      include: {
        brand: true,
      },
    })

    if (!laptop) {
      return NextResponse.json(
        { error: 'Laptop not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.laptop.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json(laptop)
  } catch (error) {
    console.error('Error fetching laptop:', error)
    return NextResponse.json(
      { error: 'Failed to fetch laptop' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const laptop = await prisma.laptop.update({
      where: { id },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        stockQuantity: body.stockQuantity ? parseInt(body.stockQuantity) : undefined,
        fakeRating: body.fakeRating ? parseFloat(body.fakeRating) : undefined,
        fakeReviewCount: body.fakeReviewCount ? parseInt(body.fakeReviewCount) : undefined,
      },
      include: {
        brand: true,
      },
    })

    return NextResponse.json(laptop)
  } catch (error) {
    console.error('Error updating laptop:', error)
    return NextResponse.json(
      { error: 'Failed to update laptop' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.laptop.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting laptop:', error)
    return NextResponse.json(
      { error: 'Failed to delete laptop' },
      { status: 500 }
    )
  }
}
