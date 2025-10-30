-- Drop the old orders table if it exists
DROP TABLE IF EXISTS orders;

-- Create the new, corrected orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT NOT NULL,
  local_board VARCHAR(255),
  regional_board VARCHAR(255),
  sub_local_board VARCHAR(255), -- ADD THIS LINE
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2),
  order_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);