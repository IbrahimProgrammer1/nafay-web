-- Quick verification queries to run in Prisma Studio or pgAdmin

-- 1. Total counts
SELECT
  'Laptops' as table_name,
  COUNT(*) as total
FROM laptops
UNION ALL
SELECT
  'Brands',
  COUNT(*)
FROM brands;

-- 2. Laptops by brand (corrected query)
SELECT
  b.name as brand,
  COUNT(l.id) as laptop_count
FROM brands b
LEFT JOIN laptops l ON l.brand_id = b.id
GROUP BY b.name
ORDER BY laptop_count DESC;

-- 3. Recently added laptops (from migration)
SELECT
  l.name,
  b.name as brand,
  l.processor,
  l.ram,
  l.storage,
  l.price,
  l.created_at
FROM laptops l
JOIN brands b ON l.brand_id = b.id
ORDER BY l.created_at DESC
LIMIT 20;

-- 4. Price statistics
SELECT
  MIN(price) as min_price,
  MAX(price) as max_price,
  ROUND(AVG(price)::numeric, 2) as avg_price
FROM laptops;

-- 5. Check for any null values
SELECT
  COUNT(*) FILTER (WHERE name IS NULL) as null_names,
  COUNT(*) FILTER (WHERE price IS NULL OR price = 0) as invalid_prices,
  COUNT(*) FILTER (WHERE slug IS NULL) as null_slugs
FROM laptops;
