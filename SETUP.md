# NAFAY Laptop Catalog - Setup Guide

## Quick Start (5 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Database (Neon PostgreSQL)

1. Go to https://neon.tech and sign up (free)
2. Create a new project
3. Copy the connection string
4. Create `.env.local` file in the root directory
5. Add your database URL:
```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Step 3: Set Up Cloudinary (Image Storage)

1. Go to https://cloudinary.com and sign up (free)
2. Go to Dashboard
3. Copy your credentials
4. Add to `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### Step 4: Configure WhatsApp & App URL

Add to `.env.local`:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER="+923462868512"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 5: Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Seed with sample data (this will also generate admin password hash)
npx prisma db seed
```

**IMPORTANT:** The seed command will output an admin password hash. Copy it and add to `.env.local`:
```env
ADMIN_PASSWORD_HASH="$2a$10$..."
```

### Step 6: Run Development Server

```bash
npm run dev
```

Visit:
- **Customer Site:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin
- **Default Admin Password:** `admin123` (change this!)

---

## Project Structure

```
nafay/
├── app/
│   ├── (customer)/              # Customer pages
│   │   ├── page.tsx            # Homepage
│   │   ├── laptops/            # Browse & detail pages
│   │   ├── wishlist/           # Wishlist page
│   │   └── search/             # Search results
│   ├── admin/                  # Admin dashboard
│   │   ├── page.tsx           # Dashboard
│   │   ├── laptops/           # Laptop CRUD
│   │   ├── brands/            # Brand management
│   │   └── analytics/         # Analytics
│   └── api/                   # API routes
├── components/
│   ├── customer/              # Customer components
│   ├── admin/                 # Admin components
│   └── ui/                    # shadcn/ui components
├── lib/                       # Utilities
├── prisma/                    # Database schema
└── types/                     # TypeScript types
```

---

## Features Implemented

### Customer Features ✅
- ✅ Homepage with hero section
- ✅ Laptop listing with filters (brand, RAM, storage, processor, price)
- ✅ Fuzzy search with typo tolerance (powered by Fuse.js)
- ✅ Laptop detail pages with image galleries (up to 5 images)
- ✅ Wishlist functionality (session-based, no login required)
- ✅ WhatsApp inquiry integration
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ View count tracking
- ✅ Fake ratings/reviews display

### Admin Features ✅
- ✅ Password-protected admin panel
- ✅ Dashboard with stats (total laptops, brands, low stock alerts)
- ✅ Laptop management (Create, Read, Update, Delete)
- ✅ Brand management (CRUD)
- ✅ Image upload to Cloudinary (5 images per laptop)
- ✅ Analytics dashboard:
  - Most searched laptops
  - Most wishlisted laptops
  - Recent search queries
- ✅ Stock management
- ✅ Availability toggle

---

## Database Schema

### Tables

**brands**
- id, name, slug, logoUrl, createdAt, updatedAt

**laptops**
- id, brandId, name, slug, description
- processor, ram, storage, graphics, display
- price, stockQuantity, isAvailable
- mainImage, image2-5 (Cloudinary URLs)
- fakeRating, fakeReviewCount
- viewCount, searchCount, wishlistCount
- createdAt, updatedAt

**wishlist_items**
- id, laptopId, sessionId, createdAt

**search_logs**
- id, searchQuery, resultsCount, createdAt

---

## API Routes

### Public APIs
- `GET /api/laptops` - List laptops with filters & pagination
- `GET /api/laptops/search?q=query` - Fuzzy search
- `GET /api/laptops/[id]` - Get laptop details
- `GET /api/brands` - List all brands
- `GET /api/wishlist?session_id=xxx` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/[id]` - Remove from wishlist

### Admin APIs (Protected)
- `POST /api/auth/admin` - Admin login
- `POST /api/laptops` - Create laptop
- `PUT /api/laptops/[id]` - Update laptop
- `DELETE /api/laptops/[id]` - Delete laptop
- `POST /api/brands` - Create brand
- `PUT /api/brands/[id]` - Update brand
- `DELETE /api/brands/[id]` - Delete brand
- `POST /api/upload` - Upload image to Cloudinary

---

## Testing Checklist

### Customer Flow
1. ✅ Visit homepage - see hero section
2. ✅ Click "Browse Laptops" - see laptop grid
3. ✅ Apply filters (brand, RAM, price) - see filtered results
4. ✅ Search "dell latop" (typo) - see Dell laptops
5. ✅ Click laptop - see detail page with specs
6. ✅ Click "Add to Wishlist" - see success message
7. ✅ Click "Inquire on WhatsApp" - open WhatsApp with pre-filled message
8. ✅ Visit wishlist page - see added laptop
9. ✅ Test on mobile - responsive layout

### Admin Flow
1. ✅ Visit /admin - see password prompt
2. ✅ Enter password - access dashboard
3. ✅ See stats (laptops, brands, low stock)
4. ✅ Click "Add Laptop" - fill form
5. ✅ Upload images - see Cloudinary URLs
6. ✅ Submit - see new laptop in list
7. ✅ Edit laptop - update price
8. ✅ Visit analytics - see most searched/wishlisted
9. ✅ Add brand - upload logo
10. ✅ Delete test laptop - confirm deletion

---

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/nafay-laptop-catalog.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Import your GitHub repository
3. Add environment variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `ADMIN_PASSWORD_HASH`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_APP_URL` (your production URL)
4. Deploy

### 3. Post-Deployment
```bash
# Run migrations on production database
npx prisma migrate deploy

# Seed production database
npx prisma db seed
```

---

## Changing Admin Password

To change the admin password:

```bash
# Generate new hash
node -e "console.log(require('bcryptjs').hashSync('your_new_password', 10))"
```

Copy the output and update `ADMIN_PASSWORD_HASH` in `.env.local`

---

## Free Tier Limits

- **Neon PostgreSQL:** 0.5GB storage (~5,000-10,000 laptops)
- **Cloudinary:** 25GB bandwidth/month (~50,000 image views)
- **Vercel:** 100GB bandwidth/month

---

## Troubleshooting

### "Module not found" errors
```bash
npm install
npx prisma generate
```

### Database connection errors
- Check your `DATABASE_URL` in `.env.local`
- Ensure Neon database is active
- Check SSL mode is set to `require`

### Cloudinary upload fails
- Verify credentials in `.env.local`
- Check Cloudinary dashboard for quota
- Ensure image size is under 5MB

### Admin login fails
- Verify `ADMIN_PASSWORD_HASH` is set correctly
- Check browser cookies are enabled
- Try clearing browser cache

---

## Next Steps

1. ✅ Complete setup (database, Cloudinary, env variables)
2. ✅ Run seed script to populate sample data
3. ✅ Test customer flow (browse, search, wishlist)
4. ✅ Test admin flow (add/edit laptops, brands)
5. ✅ Upload real laptop images
6. ✅ Customize WhatsApp number
7. ✅ Change admin password
8. ✅ Deploy to Vercel
9. ✅ Add custom domain (optional)
10. ✅ Monitor usage (Neon, Cloudinary, Vercel)

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the README.md file
- Check Prisma documentation: https://www.prisma.io/docs
- Check Next.js documentation: https://nextjs.org/docs

---

## License

MIT
