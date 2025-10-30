-- Remove the unused category column from the products table
ALTER TABLE products DROP COLUMN IF EXISTS category;