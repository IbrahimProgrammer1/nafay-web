import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create brands
  const dell = await prisma.brand.upsert({
    where: { slug: 'dell' },
    update: {},
    create: {
      name: 'Dell',
      slug: 'dell',
      logoUrl: 'https://res.cloudinary.com/demo/image/upload/v1/logo/dell.png',
    },
  })

  const hp = await prisma.brand.upsert({
    where: { slug: 'hp' },
    update: {},
    create: {
      name: 'HP',
      slug: 'hp',
      logoUrl: 'https://res.cloudinary.com/demo/image/upload/v1/logo/hp.png',
    },
  })

  const asus = await prisma.brand.upsert({
    where: { slug: 'asus' },
    update: {},
    create: {
      name: 'Asus',
      slug: 'asus',
      logoUrl: 'https://res.cloudinary.com/demo/image/upload/v1/logo/asus.png',
    },
  })

  const lenovo = await prisma.brand.upsert({
    where: { slug: 'lenovo' },
    update: {},
    create: {
      name: 'Lenovo',
      slug: 'lenovo',
      logoUrl: 'https://res.cloudinary.com/demo/image/upload/v1/logo/lenovo.png',
    },
  })

  console.log('Brands created')

  // Create sample laptops
  const laptops = [
    {
      brandId: dell.id,
      name: 'Dell XPS 15 9520',
      slug: 'dell-xps-15-9520',
      description: 'Premium laptop with stunning display and powerful performance for professionals.',
      processor: 'Intel Core i7 12th Gen',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      graphics: 'NVIDIA RTX 3050',
      display: '15.6 inch FHD+',
      price: 185000,
      stockQuantity: 8,
      isAvailable: true,
      mainImage: 'https://res.cloudinary.com/demo/image/upload/v1/laptop/dell-xps-15.jpg',
      fakeRating: 4.7,
      fakeReviewCount: 142,
    },
    {
      brandId: hp.id,
      name: 'HP Pavilion 15',
      slug: 'hp-pavilion-15',
      description: 'Versatile laptop perfect for everyday computing and entertainment.',
      processor: 'Intel Core i5 11th Gen',
      ram: '8GB DDR4',
      storage: '512GB SSD',
      graphics: 'Intel Iris Xe Graphics',
      display: '15.6 inch FHD',
      price: 95000,
      stockQuantity: 15,
      isAvailable: true,
      mainImage: 'https://res.cloudinary.com/demo/image/upload/v1/laptop/hp-pavilion.jpg',
      fakeRating: 4.3,
      fakeReviewCount: 89,
    },
    {
      brandId: asus.id,
      name: 'Asus ROG Strix G15',
      slug: 'asus-rog-strix-g15',
      description: 'Gaming powerhouse with high refresh rate display and RGB lighting.',
      processor: 'AMD Ryzen 7 5800H',
      ram: '16GB DDR4',
      storage: '1TB SSD',
      graphics: 'NVIDIA RTX 3060',
      display: '15.6 inch FHD 144Hz',
      price: 225000,
      stockQuantity: 5,
      isAvailable: true,
      mainImage: 'https://res.cloudinary.com/demo/image/upload/v1/laptop/asus-rog.jpg',
      fakeRating: 4.8,
      fakeReviewCount: 203,
    },
    {
      brandId: lenovo.id,
      name: 'Lenovo ThinkPad E15',
      slug: 'lenovo-thinkpad-e15',
      description: 'Business laptop with legendary ThinkPad durability and security features.',
      processor: 'Intel Core i5 11th Gen',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      graphics: 'Intel UHD Graphics',
      display: '15.6 inch FHD',
      price: 85000,
      stockQuantity: 12,
      isAvailable: true,
      mainImage: 'https://res.cloudinary.com/demo/image/upload/v1/laptop/lenovo-thinkpad.jpg',
      fakeRating: 4.5,
      fakeReviewCount: 156,
    },
    {
      brandId: dell.id,
      name: 'Dell Inspiron 14',
      slug: 'dell-inspiron-14',
      description: 'Compact and affordable laptop for students and home users.',
      processor: 'Intel Core i3 11th Gen',
      ram: '4GB DDR4',
      storage: '256GB SSD',
      graphics: 'Intel UHD Graphics',
      display: '14 inch HD',
      price: 65000,
      stockQuantity: 20,
      isAvailable: true,
      mainImage: 'https://res.cloudinary.com/demo/image/upload/v1/laptop/dell-inspiron.jpg',
      fakeRating: 4.1,
      fakeReviewCount: 67,
    },
  ]

  for (const laptop of laptops) {
    await prisma.laptop.upsert({
      where: { slug: laptop.slug },
      update: {},
      create: laptop,
    })
  }

  console.log('Sample laptops created')

  // Generate admin password hash
  const adminPassword = 'admin123' // Change this!
  const hash = await bcrypt.hash(adminPassword, 10)
  console.log('\n=================================')
  console.log('Admin password hash generated:')
  console.log(hash)
  console.log('\nAdd this to your .env.local file:')
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`)
  console.log('=================================\n')

  console.log('Seed completed successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
