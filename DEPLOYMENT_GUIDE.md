# Vercel Deployment Guide

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub repository with this code
- Neon PostgreSQL database (or other PostgreSQL provider)
- Cloudinary account for image hosting

## Environment Variables Required

Configure these in your Vercel project settings:

### Database
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```
**Important**: Use connection pooling URL from Neon for production (ends with `?sslmode=require`)

### Cloudinary (Image Hosting)
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Admin Authentication
```
ADMIN_PASSWORD_HASH=$2a$10$your_bcrypt_hash
```
Generate hash using: `npx bcryptjs-cli hash "your-password" 10`

### WhatsApp Integration
```
NEXT_PUBLIC_WHATSAPP_NUMBER=+923462868512
```
Format: Include country code with + prefix

### Application URL
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```
**Important**: Update this after deployment with your actual Vercel URL

## Deployment Steps

### 1. Connect GitHub Repository to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js framework

### 2. Configure Build Settings

Vercel should auto-detect these, but verify:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

### 3. Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

1. Add all variables listed above
2. Set them for **Production**, **Preview**, and **Development** environments
3. Click "Save"

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Vercel will provide a deployment URL

### 5. Post-Deployment Configuration

#### Update App URL
1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Go to Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` with your actual URL
4. Redeploy

#### Run Database Migrations
```bash
# If you haven't run migrations yet
npx prisma migrate deploy
```

#### Seed Database (Optional)
```bash
# If you need to populate initial data
npm run migrate:laptops
```

## Vercel-Specific Optimizations

### 1. Image Optimization
Next.js Image component is already configured for Cloudinary:
```javascript
// next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
    },
  ],
}
```

### 2. API Routes
All API routes in `/app/api` are automatically deployed as serverless functions.

### 3. Database Connection Pooling
**Critical**: Use Neon's connection pooling URL for production to avoid connection limits:
```
postgresql://user:password@host/database?sslmode=require&pgbouncer=true
```

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `DATABASE_URL` is accessible from Vercel

### Database Connection Errors
- Use connection pooling URL from Neon
- Verify database allows connections from Vercel IPs
- Check SSL mode is enabled (`?sslmode=require`)

### Images Not Loading
- Verify Cloudinary credentials
- Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct
- Ensure images are uploaded to Cloudinary

### Admin Login Not Working
- Verify `ADMIN_PASSWORD_HASH` is correctly generated
- Use bcryptjs to generate hash: `npx bcryptjs-cli hash "password" 10`

### WhatsApp Button Not Working
- Verify `NEXT_PUBLIC_WHATSAPP_NUMBER` includes country code
- Format: `+923462868512` (no spaces or dashes)

## Performance Monitoring

After deployment, monitor:
- **Vercel Analytics**: Built-in performance metrics
- **Database Performance**: Check Neon dashboard for query performance
- **Error Tracking**: Consider adding Sentry for production error tracking

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

## Security Checklist

- ✅ Environment variables stored securely in Vercel
- ✅ Database uses SSL connection
- ✅ Admin password is bcrypt hashed
- ✅ No secrets in code repository
- ✅ `.env` files in `.gitignore`

## Support

For issues:
1. Check Vercel build logs
2. Review Vercel documentation: https://vercel.com/docs
3. Check Next.js deployment guide: https://nextjs.org/docs/deployment

## Production Checklist

Before going live:
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Test admin login
- [ ] Test laptop browsing
- [ ] Test search functionality
- [ ] Test filters
- [ ] Test WhatsApp integration
- [ ] Test wishlist functionality
- [ ] Verify images load correctly
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Update `NEXT_PUBLIC_APP_URL` with production URL
