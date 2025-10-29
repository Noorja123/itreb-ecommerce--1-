# ITREB India E-Commerce Application

A modern e-commerce web application for ITREB India with public product catalog, fixed admin dashboard, and Google Form integration for orders.

## Features

- **Public Product Catalog**: Browse products without login
- **Fixed Admin Account**: Secure admin dashboard with product management
- **Google Form Integration**: Users place orders via Google Form
- **Order Tracking**: Admin can view all orders from Google Sheets
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Supabase Integration**: Secure database for products and orders

## Admin Credentials

- **Email**: `admin@itrebindia`
- **Password**: `12345`

## Setup Instructions

### 1. Database Setup

First, run the database schema script to create tables:

\`\`\`bash
# The script is located at scripts/01-create-schema.sql
# Run it in your Supabase SQL editor or use the Vercel v0 script runner
\`\`\`

### 2. Environment Variables

Add these environment variables to your Vercel project:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key (optional)
GOOGLE_SHEET_ID=your_google_sheet_id (optional)
NEXT_PUBLIC_GOOGLE_FORM_URL=your_google_form_url
NEXT_PUBLIC_PRODUCT_NAME_ENTRY=entry.xxxxx
\`\`\`

### 3. Google Form Setup

1. Create a Google Form with these fields:
   - Product Name (pre-filled from app)
   - Full Name
   - Phone Number
   - Address

2. Link the form to a Google Sheet

3. Get the form URL and field entry IDs

4. Add to environment variables

### 4. Google Sheets API (Optional)

To view orders in the admin dashboard from Google Sheets:

1. Enable Google Sheets API in Google Cloud Console
2. Create a service account and get API key
3. Share your Google Sheet with the service account email
4. Add credentials to environment variables

## Project Structure

\`\`\`
app/
├── page.tsx                 # Home page
├── products/page.tsx        # Products catalog
├── admin/
│   ├── page.tsx            # Admin login
│   └── dashboard/page.tsx   # Admin dashboard
├── api/
│   ├── products/route.ts    # Get products
│   ├── admin/
│   │   ├── login/route.ts   # Admin login
│   │   └── products/route.ts # Add/delete products
│   └── orders/route.ts      # Get orders
├── globals.css              # Tailwind styles
└── layout.tsx               # Root layout

components/
├── navbar.tsx               # Navigation bar
├── hero.tsx                 # Hero section
├── footer.tsx               # Footer
├── product-card.tsx         # Product card component
├── admin-product-form.tsx   # Add product form
├── admin-product-list.tsx   # Products list
└── admin-orders-list.tsx    # Orders list

lib/
├── supabase/
│   ├── client.ts           # Browser Supabase client
│   └── server.ts           # Server Supabase client
└── auth.ts                 # Authentication utilities

scripts/
└── 01-create-schema.sql    # Database schema
\`\`\`

## How It Works

### For Users

1. Visit the home page
2. Browse products in the catalog
3. Click "Order Now" on any product
4. Fill out the Google Form with your details
5. Submit the order

### For Admin

1. Go to `/admin` and login with credentials
2. **Products Tab**: Add new products or delete existing ones
3. **Orders Tab**: View all orders from Google Sheets or Supabase
4. Click "Logout" to exit

## Database Schema

### Products Table
- `id`: UUID (primary key)
- `name`: Product name
- `description`: Product description
- `price`: Product price
- `image_url`: Product image URL
- `category`: Product category
- `stock_quantity`: Available stock
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Orders Table
- `id`: UUID (primary key)
- `product_id`: Reference to product
- `product_name`: Product name
- `customer_name`: Customer name
- `customer_phone`: Customer phone
- `customer_address`: Customer address
- `quantity`: Order quantity
- `total_price`: Total price
- `order_status`: Order status
- `created_at`: Order timestamp

## Deployment

Deploy to Vercel with one click:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

## Support

For issues or questions, contact ITREB India support.
