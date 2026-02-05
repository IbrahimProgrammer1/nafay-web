import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Helper function to parse price
function parsePrice(priceStr: string): number {
  // Remove commas and convert to number
  const cleaned = priceStr.replace(/,/g, '').trim()
  return parseFloat(cleaned) || 0
}

// Helper function to format RAM
function formatRAM(ramStr: string): string {
  const ram = ramStr.trim()
  if (!ram) return '8GB DDR4' // Default

  // If already has GB, return as is
  if (ram.includes('GB')) return ram

  // Add GB suffix and DDR4
  return `${ram}GB DDR4`
}

// Helper function to format Storage
function formatStorage(storageStr: string): string {
  const storage = storageStr.trim()
  if (!storage) return '256GB SSD' // Default

  // Already formatted correctly
  if (storage.includes('GB')) return storage

  // Add GB to numbers
  return storage.replace(/(\d+)\s*(SSD|HDD)/gi, '$1GB $2')
}

// Helper function to format Processor
function formatProcessor(processorStr: string): string {
  const proc = processorStr.trim()
  if (!proc) return 'Intel Core i5'

  // Handle Intel processors
  if (proc.match(/i[3579]/i)) {
    const match = proc.match(/(i[3579])-?(\d+)(th|rd|nd)?/i)
    if (match) {
      const model = match[1].toUpperCase()
      const gen = match[2]
      return `Intel Core ${model} ${gen}th Gen`
    }
    return `Intel Core ${proc}`
  }

  // Handle AMD processors
  if (proc.includes('AMD') || proc.includes('Ryzen') || proc.includes('A')) {
    return proc.includes('AMD') ? proc : `AMD ${proc}`
  }

  // Handle Celeron
  if (proc.toLowerCase().includes('celeron')) {
    return 'Intel Celeron'
  }

  // Handle M series
  if (proc.includes('M-')) {
    return `Intel Core ${proc}`
  }

  return proc
}

// Helper function to format Graphics
function formatGraphics(graphicsStr: string | undefined): string {
  if (!graphicsStr || graphicsStr.trim() === '') {
    return 'Intel Integrated Graphics'
  }

  const graphics = graphicsStr.trim()

  // If it mentions card size, format it
  if (graphics.includes('GB')) {
    return `Dedicated ${graphics}`
  }

  return graphics
}

// Helper function to generate description
function generateDescription(laptop: any): string {
  const brand = laptop.Brand
  const name = laptop['Laptop Name']
  const processor = formatProcessor(laptop.Processor)
  const ram = formatRAM(laptop.RAM)
  const storage = formatStorage(laptop.Storage)

  return `${brand} ${name} featuring ${processor} processor, ${ram} RAM, and ${storage} storage. ${
    laptop.Features ? `Special features: ${laptop.Features}.` : ''
  } Perfect for professional work and everyday computing needs.`.trim()
}

// Helper function to get default image
function getDefaultImage(brand: string): string {
  // Using placeholder images - you can replace with actual Cloudinary URLs later
  const brandLower = brand.toLowerCase()
  return `https://res.cloudinary.com/demo/image/upload/v1/laptop/${brandLower}-placeholder.jpg`
}

async function main() {
  console.log('🚀 Starting laptop data migration...\n')

  try {
    // Read JSON file
    const jsonPath = path.join(process.cwd(), 'LaptopData.json')
    const jsonData = fs.readFileSync(jsonPath, 'utf-8')
    const laptops = JSON.parse(jsonData)

    console.log(`📦 Found ${laptops.length} laptops in JSON file\n`)

    // Step 1: Create/Verify Brands
    console.log('📋 Step 1: Creating/Verifying Brands...')

    const brandNames = ['HP', 'DELL', 'LENOVO', 'Asus']
    const brandMap = new Map<string, string>() // Map brand name to ID

    for (const brandName of brandNames) {
      const slug = generateSlug(brandName)
      const brand = await prisma.brand.upsert({
        where: { slug },
        update: {},
        create: {
          name: brandName,
          slug,
          logoUrl: `https://res.cloudinary.com/demo/image/upload/v1/logo/${slug}.png`,
        },
      })
      brandMap.set(brandName.toUpperCase(), brand.id)
      console.log(`  ✅ Brand: ${brandName} (${brand.id})`)
    }

    console.log('\n📋 Step 2: Migrating Laptop Data...\n')

    let successCount = 0
    let errorCount = 0
    const errors: Array<{ laptop: string; error: string }> = []

    for (let i = 0; i < laptops.length; i++) {
      const laptop = laptops[i]
      const laptopName = laptop['Laptop Name']

      try {
        // Get brand ID
        const brandName = laptop.Brand.toUpperCase()
        const brandId = brandMap.get(brandName)

        if (!brandId) {
          throw new Error(`Brand not found: ${brandName}`)
        }

        // Generate slug (ensure uniqueness by adding index if needed)
        let slug = generateSlug(laptopName)

        // Check if slug exists
        const existingLaptop = await prisma.laptop.findUnique({
          where: { slug },
        })

        if (existingLaptop) {
          slug = `${slug}-${i + 1}`
        }

        // Transform data
        const laptopData = {
          brandId,
          name: laptopName,
          slug,
          description: generateDescription(laptop),
          processor: formatProcessor(laptop.Processor),
          ram: formatRAM(laptop.RAM),
          storage: formatStorage(laptop.Storage),
          graphics: formatGraphics(laptop['Graphic Card']),
          display: '15.6 inch FHD', // Default display
          price: parsePrice(laptop.Price),
          stockQuantity: Math.floor(Math.random() * 15) + 5, // Random stock 5-20
          isAvailable: true,
          mainImage: getDefaultImage(laptop.Brand),
          fakeRating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)), // Random 4.0-4.9
          fakeReviewCount: Math.floor(Math.random() * 150) + 20, // Random 20-170
        }

        // Insert laptop
        await prisma.laptop.create({
          data: laptopData,
        })

        successCount++
        console.log(`  ✅ [${i + 1}/${laptops.length}] ${laptopName} - PKR ${laptopData.price}`)
      } catch (error: any) {
        errorCount++
        const errorMsg = error.message || 'Unknown error'
        errors.push({ laptop: laptopName, error: errorMsg })
        console.log(`  ❌ [${i + 1}/${laptops.length}] ${laptopName} - ERROR: ${errorMsg}`)
      }
    }

    // Step 3: Verification
    console.log('\n📋 Step 3: Verifying Migration...\n')

    const totalLaptops = await prisma.laptop.count()
    const totalBrands = await prisma.brand.count()

    console.log('═══════════════════════════════════════════════════')
    console.log('📊 MIGRATION SUMMARY')
    console.log('═══════════════════════════════════════════════════')
    console.log(`✅ Successfully migrated: ${successCount} laptops`)
    console.log(`❌ Failed: ${errorCount} laptops`)
    console.log(`📦 Total laptops in database: ${totalLaptops}`)
    console.log(`🏷️  Total brands in database: ${totalBrands}`)
    console.log('═══════════════════════════════════════════════════\n')

    if (errors.length > 0) {
      console.log('❌ ERRORS ENCOUNTERED:')
      errors.forEach(({ laptop, error }) => {
        console.log(`  - ${laptop}: ${error}`)
      })
      console.log('')
    }

    // Sample queries
    console.log('📋 Sample Verification Queries:\n')

    const hpCount = await prisma.laptop.count({
      where: { brand: { name: 'HP' } },
    })
    const dellCount = await prisma.laptop.count({
      where: { brand: { name: 'DELL' } },
    })
    const lenovoCount = await prisma.laptop.count({
      where: { brand: { name: 'LENOVO' } },
    })
    const asusCount = await prisma.laptop.count({
      where: { brand: { name: 'Asus' } },
    })

    console.log(`  HP Laptops: ${hpCount}`)
    console.log(`  DELL Laptops: ${dellCount}`)
    console.log(`  LENOVO Laptops: ${lenovoCount}`)
    console.log(`  Asus Laptops: ${asusCount}`)

    console.log('\n✅ Migration completed successfully!')
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
