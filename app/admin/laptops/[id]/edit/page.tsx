import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import LaptopForm from '@/components/admin/LaptopForm'

export default async function EditLaptopPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const laptop = await prisma.laptop.findUnique({
    where: { id },
    include: { brand: true },
  })

  if (!laptop) {
    notFound()
  }

  // Serialize laptop data to plain JSON (convert Decimal to number)
  const serializedLaptop = {
    ...laptop,
    price: Number(laptop.price),
    createdAt: laptop.createdAt.toISOString(),
    updatedAt: laptop.updatedAt.toISOString(),
    brand: {
      ...laptop.brand,
      createdAt: laptop.brand.createdAt.toISOString(),
      updatedAt: laptop.brand.updatedAt.toISOString(),
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Laptop</h1>
      <LaptopForm laptop={serializedLaptop} isEdit />
    </div>
  )
}
