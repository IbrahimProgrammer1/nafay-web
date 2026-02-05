import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { Pencil, Plus } from 'lucide-react'

export default async function AdminLaptopsPage() {
  const laptops = await prisma.laptop.findMany({
    include: {
      brand: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Laptops</h1>
        <Button asChild>
          <Link href="/admin/laptops/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Laptop
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Laptops ({laptops.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {laptops.map(laptop => (
              <div
                key={laptop.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={laptop.mainImage}
                    alt={laptop.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{laptop.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {laptop.brand.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium">
                      {formatPrice(Number(laptop.price))}
                    </span>
                    <Badge
                      variant={laptop.isAvailable ? 'success' : 'destructive'}
                    >
                      {laptop.isAvailable ? 'Available' : 'Out of Stock'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Stock: {laptop.stockQuantity}
                    </span>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/laptops/${laptop.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
