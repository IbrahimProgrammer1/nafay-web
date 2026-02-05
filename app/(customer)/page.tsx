import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Shield, Headphones } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import LaptopCard from '@/components/customer/LaptopCard'

export default async function HomePage() {
  // Fetch 3 newest laptops for featured section
  const laptopsFromDb = await prisma.laptop.findMany({
    where: {
      isAvailable: true,
    },
    include: {
      brand: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
  })

  // Serialize Decimal fields to numbers for client components
  const featuredLaptops = laptopsFromDb.map(laptop => ({
    ...laptop,
    price: Number(laptop.price),
    fakeRating: Number(laptop.fakeRating),
  }))

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Unboxed & Premium */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-[#FAFAFA] to-[#F6F6F7]" style={{ marginBottom: '80px' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Brand Tagline */}
            <p className="text-[13px] font-medium text-text-secondary uppercase tracking-wider mb-6">
              Professional Laptops, Carefully Selected
            </p>

            {/* Hero Headline - Authority */}
            <h1 className="text-[44px] md:text-[52px] font-semibold text-text-primary mb-6 leading-[1.1] tracking-[-0.03em]">
              Laptops that work as hard as you do
            </h1>

            {/* Subheadline - Compact */}
            <p className="text-[16px] leading-[1.6] text-text-secondary mb-10 max-w-[520px] mx-auto">
              Curated collection from trusted brands. Find your next everyday machine.
            </p>

            {/* CTA - One Primary Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-[15px] font-semibold px-8 h-12">
                <Link href="/laptops">
                  Browse Laptops
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link
                href="/wishlist"
                className="text-[15px] font-medium text-text-secondary hover:text-accent-orange transition-colors underline underline-offset-4"
              >
                View Wishlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Laptops Section */}
      {featuredLaptops.length > 0 && (
        <section className="py-16" style={{ marginBottom: '96px' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-[28px] font-semibold text-text-primary mb-3 tracking-tight">
                  Featured Laptops
                </h2>
                <p className="text-[15px] text-text-secondary">
                  Handpicked for performance and reliability
                </p>
              </div>

              {/* Laptop Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {featuredLaptops.map((laptop) => (
                  <LaptopCard key={laptop.id} laptop={laptop} />
                ))}
              </div>

              {/* View More Link */}
              <div className="text-center">
                <Link
                  href="/laptops"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-text-primary hover:text-accent-orange transition-colors group"
                >
                  View More Products
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section - Refined */}
      <section className="py-16" style={{ marginBottom: '96px' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-7 text-center hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] border border-black/[0.03]">
              <div className="inline-flex items-center justify-center w-11 h-11 bg-blue-50/70 rounded-xl mb-5">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-[17px] font-semibold mb-2.5 text-text-primary">Curated Selection</h3>
              <p className="text-[14px] leading-[1.6] text-text-secondary">
                Trusted brands, carefully selected
              </p>
            </div>

            {/* Card 2 - Slightly elevated */}
            <div className="bg-white rounded-2xl p-7 text-center hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] border border-black/[0.03] md:-translate-y-2">
              <div className="inline-flex items-center justify-center w-11 h-11 bg-green-50/70 rounded-xl mb-5">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-[17px] font-semibold mb-2.5 text-text-primary">Quality Assured</h3>
              <p className="text-[14px] leading-[1.6] text-text-secondary">
                Performance you can rely on
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-7 text-center hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] border border-black/[0.03]">
              <div className="inline-flex items-center justify-center w-11 h-11 bg-purple-50/70 rounded-xl mb-5">
                <Headphones className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-[17px] font-semibold mb-2.5 text-text-primary">Expert Guidance</h3>
              <p className="text-[14px] leading-[1.6] text-text-secondary">
                Personalized recommendations via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Refined Gradient */}
      <section className="py-16" style={{ marginBottom: '96px' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#FF9A4D] to-[#FF7A1A] rounded-3xl p-12 md:p-16 shadow-[0_20px_60px_rgba(255,138,61,0.2)] border border-accent-orange/10">
            <div className="max-w-xl">
              <h2 className="text-[36px] md:text-[40px] font-semibold mb-4 text-white leading-[1.15] tracking-[-0.02em]">
                Ready to find your perfect laptop?
              </h2>
              <p className="text-[16px] leading-[1.6] mb-8 text-white/90">
                Browse our collection and get expert recommendations.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-accent-orange hover:bg-white/95 text-[15px] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] h-12 px-8"
              >
                <Link href="/laptops">
                  Start Browsing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
