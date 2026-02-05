# NAFAY Laptop Catalog

A premium laptop catalog website with admin dashboard built with Next.js 16, Prisma, PostgreSQL, and Cloudinary.

## Features

### Customer-Facing
- Browse laptops with advanced filtering (brand, RAM, storage, processor, price)
- Fuzzy search with typo tolerance
- Laptop detail pages with image galleries
- Wishlist functionality (session-based, no auth required)
- WhatsApp inquiry integration
- Responsive design

### Admin Dashboard
- Password-protected admin panel
- Laptop management (CRUD operations)
- Brand management
- Image upload to Cloudinary (up to 5 images per laptop)
- Analytics dashboard (most searched, most wishlisted)
- Low stock alerts

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Image Storage:** Cloudinary
- **Styling:** Tailwind CSS + shadcn/ui
- **Search:** Fuse.js (fuzzy search)
- **Deployment:** Vercel

## Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Cloudinary account

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (Get from Neon: https://neon.tech)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Cloudinary (Get from: https://cloudinary.com)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Admin Password (will be generated during seed)
ADMIN_PASSWORD_HASH="$2a$10$..."

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+923462868512"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed
```

**Important:** The seed script will generate an admin password hash. Copy it to your `.env.local` file.

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- Customer site: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

Default admin password: `admin123` (change this in production!)

## Project Structure

```
nafay/
├── app/
│   ├── (customer)/          # Customer-facing pages
│   │   ├── page.tsx         # Homepage
│   │   ├── laptops/         # Laptop listing & detail
│   │   ├── wishlist/        # Wishlist page
│   │   └── search/          # Search results
│   ├── admin/               # Admin dashboard
│   │   ├── page.tsx         # Dashboard
│   │   ├── laptops/         # Laptop management
│   │   ├── brands/          # Brand management
│   │   └── analytics/       # Analytics
│   └── api/                 # API routes
├── components/
│   ├── customer/            # Customer components
│   ├── admin/               # Admin components
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utilities
├── prisma/                  # Database schema & seed
└── types/                   # TypeScript types
```

## Database Schema

### Tables
- **brands** - Laptop brands (Dell, HP, Asus, etc.)
- **laptops** - Laptop products with specs and images
- **wishlist_items** - User wishlist (session-based)
- **search_logs** - Search query logs for analytics

## API Routes

### Public APIs
- `GET /api/laptops` - List laptops with filters
- `GET /api/laptops/search?q=query` - Fuzzy search
- `GET /api/laptops/[id]` - Get laptop details
- `GET /api/brands` - List all brands
- `GET /api/wishlist?session_id=xxx` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/[id]` - Remove from wishlist

### Admin APIs (Protected)
- `POST /api/laptops` - Create laptop
- `PUT /api/laptops/[id]` - Update laptop
- `DELETE /api/laptops/[id]` - Delete laptop
- `POST /api/brands` - Create brand
- `PUT /api/brands/[id]` - Update brand
- `DELETE /api/brands/[id]` - Delete brand
- `POST /api/upload` - Upload image to Cloudinary
- `POST /api/auth/admin` - Admin authentication

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in Vercel:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ADMIN_PASSWORD_HASH`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_APP_URL` - Your production URL

### Post-Deployment

1. Run migrations: `npx prisma migrate deploy`
2. Seed database: `npx prisma db seed`
3. Test admin login
4. Upload real laptop images

## Free Tier Limits

- **Neon:** 0.5GB storage (~5,000-10,000 laptops)
- **Cloudinary:** 25GB bandwidth/month (~50,000 image views)
- **Vercel:** 100GB bandwidth/month

## Admin Password

To change the admin password:

1. Generate a new hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your_new_password', 10))"
```

2. Update `ADMIN_PASSWORD_HASH` in `.env.local`

## Features to Add (Future)

- Real customer reviews
- Email notifications
- Advanced analytics
- Bulk import/export
- Image optimization
- SEO improvements
- Multi-language support

## License

MIT

## Support

For issues or questions, contact: [Your Contact Info]
