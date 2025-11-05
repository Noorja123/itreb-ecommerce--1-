-- Add category column to products table
ALTER TABLE products ADD COLUMN category TEXT;

-- (Optional but recommended) Create index for better query performance on categories
CREATE INDEX idx_products_category ON products(category);