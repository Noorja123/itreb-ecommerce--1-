-- Add stock_quantity and in_stock columns to products table
ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT TRUE;

-- Create indexes for better query performance
CREATE INDEX idx_products_stock_quantity ON products(stock_quantity);
CREATE INDEX idx_products_in_stock ON products(in_stock);