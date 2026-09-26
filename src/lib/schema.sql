-- ============================================================
-- BHAI JEWELLER - PostgreSQL / Supabase Real-Time Database Schema
-- Run this SQL in Supabase SQL Editor to create clean tables!
-- ============================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 10,
    metal VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In Stock',
    is_featured BOOLEAN DEFAULT FALSE,
    image TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    weight_grams DECIMAL(6, 2) DEFAULT 0.0,
    seo_title VARCHAR(255),
    seo_description TEXT,
    focus_keywords JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    items_description TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'Processing',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BESPOKE ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS bespoke_enquiries (
    id VARCHAR(64) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    service_requested VARCHAR(255) NOT NULL,
    estimated_budget VARCHAR(100) NOT NULL,
    design_notes TEXT,
    enquiry_status VARCHAR(50) NOT NULL DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. HERO SLIDES / BANNER TABLE
CREATE TABLE IF NOT EXISTS hero_slides (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    cta_text VARCHAR(100) DEFAULT 'Explore Collection',
    cta_link VARCHAR(255) DEFAULT '/shop',
    image TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. HERO SECTION CONFIG TABLE (Real-Time Main Hero)
CREATE TABLE IF NOT EXISTS hero_section (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'main_hero',
    brand_pretitle VARCHAR(255) DEFAULT 'BHAI JEWELLER',
    headline_line1 VARCHAR(255) DEFAULT 'Jewellery, made',
    headline_line2 VARCHAR(255) DEFAULT 'unforgettable',
    headline_line3 VARCHAR(255) DEFAULT '',
    description TEXT DEFAULT 'Timeless pieces for modern souls. Discover fine jewellery designed to celebrate your most precious moments.',
    primary_cta_text VARCHAR(100) DEFAULT 'Shop Collection',
    primary_cta_href VARCHAR(255) DEFAULT '/shop',
    hero_image TEXT DEFAULT '/images/hero-img.jpg',
    featured_title VARCHAR(255) DEFAULT 'Diamond Elegance',
    featured_subtitle TEXT DEFAULT 'Classic pieces, endless beauty.',
    featured_image TEXT DEFAULT '/images/featured-ring.jpg',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ANNOUNCEMENT BAR TABLE
CREATE TABLE IF NOT EXISTS announcement_bar (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'main_announcement',
    is_enabled BOOLEAN DEFAULT TRUE,
    messages JSONB DEFAULT '["Free worldwide shipping on all orders over $150 | Handcrafted with passion in the UK", "Complimentary luxury gift packaging on every order | Bespoke service", "Fine jewellery showroom in Bradford, West Yorkshire | Private viewings available"]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bespoke_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_bar ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for API endpoints
CREATE POLICY "Allow Public Products Access" ON products FOR ALL USING (true);
CREATE POLICY "Allow Public Orders Access" ON orders FOR ALL USING (true);
CREATE POLICY "Allow Public Enquiries Access" ON bespoke_enquiries FOR ALL USING (true);
CREATE POLICY "Allow Public Slides Access" ON hero_slides FOR ALL USING (true);
CREATE POLICY "Allow Public Hero Access" ON hero_section FOR ALL USING (true);
CREATE POLICY "Allow Public Announcement Access" ON announcement_bar FOR ALL USING (true);

