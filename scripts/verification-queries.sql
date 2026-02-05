-- ============================================
-- LAPTOP DATA MIGRATION - VERIFICATION QUERIES
-- ============================================

-- 1. COUNT TOTAL RECORDS
-- Expected: 60 laptops, 4 brands
SELECT 'Total Laptops' as metric, COUNT(*)::text as value FROM laptops
UNION ALL
SELECT 'Total Brands', COUNT(*)::text FROM brands;

-- 2. BRAND DISTRIBUTION
-- Expected: HP: 25, DELL: 25, LENOVO: 9, Asus: 3
SELECT
  b.name as brand_name,
  COUNT(l.id) as laptop_count,
  ROUND(COUNT(l.id) * 100.0 / SUM(COUNT(l.id)) OVER (), 2) as percentage
FROM brands b
LEFT JOIN laptops l ON b.id = l.brand_id
GROUP BY b.name
ORDER BY laptop_count DESC;

-- 3. PRICE STATISTICS
SELECT
  MIN(price) as min_price,
  MAX(price) as max_price,
  ROUND(AVG(price), 2) as avg_price,
  ROUND(STDDEV(price), 2) as std_deviation
FROM laptops;

-- 4. PRICE RANGE DISTRIBUTION
SELECT
  CASE
    WHEN price < 30000 THEN 'Budget (< 30k)'
    WHEN price BETWEEN 30000 AND 50000 THEN 'Mid-Range (30k-50k)'
    WHEN price BETWEEN 50001 AND 70000 THEN 'Premium (50k-70k)'
    ELSE 'High-End (> 70k)'
  END as price_category,
  COUNT(*) as laptop_count
FROM laptops
GROUP BY price_category
ORDER BY MIN(price);

-- 5. RAM DISTRIBUTION
SELECT
  ram,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM laptops
GROUP BY ram
ORDER BY count DESC;

-- 6. STORAGE DISTRIBUTION
SELECT
  storage,
  COUNT(*) as count
FROM laptops
GROUP BY storage
ORDER BY count DESC
LIMIT 10;

-- 7. PROCESSOR DISTRIBUTION
SELECT
  processor,
  COUNT(*) as count
FROM laptops
GROUP BY processor
ORDER BY count DESC
LIMIT 15;

-- 8. CHECK FOR NULL VALUES
SELECT
  COUNT(*) FILTER (WHERE name IS NULL) as null_names,
  COUNT(*) FILTER (WHERE processor IS NULL) as null_processors,
  COUNT(*) FILTER (WHERE ram IS NULL) as null_ram,
  COUNT(*) FILTER (WHERE storage IS NULL) as null_storage,
  COUNT(*) FILTER (WHERE price IS NULL OR price = 0) as null_or_zero_prices,
  COUNT(*) FILTER (WHERE description IS NULL) as null_descriptions,
  COUNT(*) FILTER (WHERE slug IS NULL) as null_slugs
FROM laptops;

-- 9. VERIFY SLUG UNIQUENESS
SELECT
  slug,
  COUNT(*) as duplicate_count
FROM laptops
GROUP BY slug
HAVING COUNT(*) > 1;
-- Expected: No results (all slugs should be unique)

-- 10. SAMPLE LAPTOP DATA
SELECT
  l.name,
  b.name as brand,
  l.processor,
  l.ram,
  l.storage,
  l.graphics,
  l.price,
  l.stock_quantity,
  l.fake_rating
FROM laptops l
JOIN brands b ON l.brand_id = b.id
ORDER BY l.price DESC
LIMIT 10;

-- 11. CHEAPEST LAPTOPS
SELECT
  l.name,
  b.name as brand,
  l.processor,
  l.ram,
  l.price
FROM laptops l
JOIN brands b ON l.brand_id = b.id
ORDER BY l.price ASC
LIMIT 5;

-- 12. MOST EXPENSIVE LAPTOPS
SELECT
  l.name,
  b.name as brand,
  l.processor,
  l.ram,
  l.storage,
  l.price
FROM laptops l
JOIN brands b ON l.brand_id = b.id
ORDER BY l.price DESC
LIMIT 5;

-- 13. LAPTOPS WITH HIGH RAM (16GB+)
SELECT
  l.name,
  b.name as brand,
  l.ram,
  l.processor,
  l.price
FROM laptops l
JOIN brands b ON l.brand_id = b.id
WHERE l.ram LIKE '16%' OR l.ram LIKE '32%'
ORDER BY l.price;

-- 14. LAPTOPS WITH SSD STORAGE
SELECT
  b.name as brand,
  COUNT(*) as ssd_count
FROM laptops l
JOIN brands b ON l.brand_id = b.id
WHERE l.storage LIKE '%SSD%'
GROUP BY b.name
ORDER BY ssd_count DESC;

-- 15. AVERAGE PRICE BY BRAND
SELECT
  b.name as brand,
  COUNT(l.id) as laptop_count,
  ROUND(MIN(l.price), 2) as min_price,
  ROUND(MAX(l.price), 2) as max_price,
  ROUND(AVG(l.price), 2) as avg_price
FROM brands b
LEFT JOIN laptops l ON b.id = l.brand_id
GROUP BY b.name
ORDER BY avg_price DESC;

-- 16. STOCK AVAILABILITY
SELECT
  is_available,
  COUNT(*) as count
FROM laptops
GROUP BY is_available;

-- 17. RATING DISTRIBUTION
SELECT
  fake_rating,
  COUNT(*) as count
FROM laptops
GROUP BY fake_rating
ORDER BY fake_rating DESC;

-- 18. SEARCH FOR SPECIFIC BRANDS
-- HP Laptops
SELECT name, processor, ram, storage, price
FROM laptops l
JOIN brands b ON l.brand_id = b.id
WHERE b.name = 'HP'
ORDER BY price
LIMIT 5;

-- 19. FULL TEXT SEARCH TEST
-- Search for "i5" processors
SELECT
  l.name,
  b.name as brand,
  l.processor,
  l.price
FROM laptops l
JOIN brands b ON l.brand_id = b.id
WHERE l.processor ILIKE '%i5%'
ORDER BY l.price
LIMIT 10;

-- 20. DATA QUALITY CHECK
SELECT
  'Total Records' as check_name,
  CASE WHEN COUNT(*) = 60 THEN '✅ PASS' ELSE '❌ FAIL' END as status,
  COUNT(*)::text as value
FROM laptops
UNION ALL
SELECT
  'All Prices Valid',
  CASE WHEN COUNT(*) FILTER (WHERE price IS NULL OR price <= 0) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END,
  COUNT(*) FILTER (WHERE price IS NULL OR price <= 0)::text
FROM laptops
UNION ALL
SELECT
  'All Slugs Unique',
  CASE WHEN COUNT(*) = COUNT(DISTINCT slug) THEN '✅ PASS' ELSE '❌ FAIL' END,
  (COUNT(*) - COUNT(DISTINCT slug))::text || ' duplicates'
FROM laptops
UNION ALL
SELECT
  'All Required Fields Present',
  CASE WHEN COUNT(*) FILTER (WHERE name IS NULL OR processor IS NULL OR ram IS NULL OR storage IS NULL) = 0
    THEN '✅ PASS' ELSE '❌ FAIL' END,
  COUNT(*) FILTER (WHERE name IS NULL OR processor IS NULL OR ram IS NULL OR storage IS NULL)::text
FROM laptops;

-- 21. EXPORT DATA FOR BACKUP (CSV FORMAT)
-- Run this to create a backup of migrated data
COPY (
  SELECT
    l.id,
    b.name as brand,
    l.name,
    l.slug,
    l.processor,
    l.ram,
    l.storage,
    l.graphics,
    l.display,
    l.price,
    l.stock_quantity,
    l.is_available,
    l.fake_rating,
    l.fake_review_count,
    l.created_at
  FROM laptops l
  JOIN brands b ON l.brand_id = b.id
  ORDER BY b.name, l.name
) TO '/tmp/laptop_migration_backup.csv' WITH CSV HEADER;
-- Note: Adjust path as needed for your system
