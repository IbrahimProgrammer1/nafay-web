import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Star, Package, Eye, Cpu, HardDrive, Monitor, Zap, MemoryStick } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import WhatsAppButton from '@/components/customer/WhatsAppButton'
import WishlistButton from '@/components/customer/WishlistButton'
import { formatPrice } from '@/lib/utils'

export default async function LaptopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const laptop = await prisma.laptop.findUnique({
    where: { slug },
    include: {
      brand: true,
    },
  })

  if (!laptop) {
    notFound()
  }

  // Increment view count
  await prisma.laptop.update({
    where: { id: laptop.id },
    data: { viewCount: { increment: 1 } },
  })

  const images = [
    laptop.mainImage,
    laptop.image2,
    laptop.image3,
    laptop.image4,
    laptop.image5,
  ].filter(Boolean) as string[]

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const laptopUrl = `${appUrl}/laptops/${laptop.slug}`

  return (
    <div className="bg-bg-primary min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card-white border border-black/[0.06] shadow-premium">
              <Image
                src={laptop.mainImage}
                alt={laptop.name}
                fill
                className="object-contain p-8"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-xl bg-card-white border border-black/[0.06] hover:border-accent-orange/30 transition-all duration-300 cursor-pointer"
                  >
                    <Image
                      src={image}
                      alt={`${laptop.name} - Image ${index + 2}`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Brand & Title */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-secondary uppercase tracking-wide">{laptop.brand.name}</p>
              <h1 className="text-[32px] font-semibold text-text-primary leading-tight tracking-tighter">
                {laptop.name}
              </h1>
            </div>

            {/* Rating & Views */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-yellow-50 rounded-lg px-3 py-1.5 border border-yellow-200">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-semibold ml-1.5 text-text-primary">
                    {Number(laptop.fakeRating).toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-text-secondary">
                  ({laptop.fakeReviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                <Eye className="h-4 w-4" />
                <span>{laptop.viewCount} views</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-price-bg rounded-xl p-4 border border-accent-orange/20">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-text-secondary font-medium">Rs</span>
                <span className="text-[28px] font-semibold text-accent-orange">
                  {Number(laptop.price).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              {laptop.isAvailable ? (
                <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                  <Package className="h-3 w-3 mr-1" />
                  In Stock ({laptop.stockQuantity} available)
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Key Specs */}
            <div className="bg-card-white rounded-xl p-6 border border-black/[0.06] space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Key Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Cpu className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-medium">Processor</p>
                    <p className="text-sm text-text-primary font-medium mt-0.5">{laptop.processor}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <MemoryStick className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-medium">RAM</p>
                    <p className="text-sm text-text-primary font-medium mt-0.5">{laptop.ram}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <HardDrive className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-medium">Storage</p>
                    <p className="text-sm text-text-primary font-medium mt-0.5">{laptop.storage}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Monitor className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-medium">Display</p>
                    <p className="text-sm text-text-primary font-medium mt-0.5">{laptop.display}</p>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Zap className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-medium">Graphics</p>
                    <p className="text-sm text-text-primary font-medium mt-0.5">{laptop.graphics}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <WhatsAppButton
                laptopName={laptop.name}
                laptopPrice={Number(laptop.price)}
                laptopUrl={laptopUrl}
              />
              <WishlistButton laptopId={laptop.id} laptopName={laptop.name} />
            </div>

            {/* Description */}
            <div className="bg-card-white rounded-xl p-6 border border-black/[0.06] space-y-3">
              <h2 className="text-xl font-semibold text-text-primary">Description</h2>
              <p className="text-[15px] leading-[1.7] text-text-secondary">
                {laptop.description.length > 200
                  ? laptop.description.substring(0, 200) + '...'
                  : laptop.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
