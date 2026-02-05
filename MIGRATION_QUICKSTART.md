# 🚀 Quick Start - Laptop Data Migration

## Prerequisites Checklist
- ✅ Node.js installed
- ✅ Database connection configured in `.env.local`
- ✅ Prisma schema synced
- ✅ `LaptopData.json` file present

## Migration Steps

### 1. Install Dependencies (if needed)
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Sync Database Schema
```bash
# Push schema to database
npx prisma db push
```

### 4. Run Migration
```bash
npm run migrate:laptops
```

### 5. Verify Results
```bash
# Open Prisma Studio
npx prisma studio
```

## Expected Results
- ✅ 60 laptops migrated
- ✅ 4 brands created (HP, DELL, LENOVO, Asus)
- ✅ All data normalized and formatted
- ✅ No errors

## Troubleshooting

### Error: "Cannot find module"
```bash
npm install
npx prisma generate
```

### Error: "Database connection failed"
Check `.env.local` file for correct `DATABASE_URL`

### Error: "Prisma schema not synced"
```bash
npx prisma db push
```

## Files Created
- `scripts/migrate-laptops.ts` - Migration script
- `scripts/verification-queries.sql` - SQL verification queries
- `MIGRATION_DOCUMENTATION.md` - Complete documentation

## Next Steps After Migration
1. Replace placeholder images with actual product images
2. Update descriptions if needed
3. Adjust stock quantities
4. Test search and filter functionality
5. Verify data in production environment
