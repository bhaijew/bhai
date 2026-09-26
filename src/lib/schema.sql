-- ============================================================
-- BHAI JEWELLER - Supabase / PostgreSQL Complete Real-Time Database Schema & Seed Data
-- Copy & Run this SQL directly in Supabase SQL Editor!
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

-- ============================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bespoke_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for API endpoints
CREATE POLICY IF NOT EXISTS "Allow Public Products Access" ON products FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow Public Orders Access" ON orders FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow Public Enquiries Access" ON bespoke_enquiries FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow Public Slides Access" ON hero_slides FOR ALL USING (true);

-- ============================================================
-- SEED DATA (INITIAL SQL INSERTS FOR SUPABASE)
-- ============================================================

-- 1. SEED PRODUCTS
INSERT INTO products (id, name, category, price, original_price, stock, metal, status, is_featured, image, images, sku, description, slug, weight_grams, seo_title, seo_description, focus_keywords)
VALUES 
('solara-ring', 'Solara Diamond Ring', 'Rings', 1280.00, 1650.00, 14, '18k Yellow Gold', 'In Stock', true, '/images/detail-ring-hero.jpg', '["/images/detail-ring-hero.jpg", "/images/shop-prod-1.jpg"]'::jsonb, 'BJ-RNG-001', 'Exquisite 18k yellow gold solitaire ring handcrafted with precision cut brilliant diamonds.', 'solara-diamond-ring', 5.20, 'Solara Diamond Ring | 18k Gold Solitaire | Bhai Jeweller', 'Shop Solara Diamond Ring handcrafted in 18k Yellow Gold.', '["diamond ring", "18k gold ring"]'::jsonb),
('lumiere-necklace', 'Lumiere Gold Necklace', 'Necklaces', 980.00, 1200.00, 8, '22k Gold', 'In Stock', true, '/images/shop-prod-2.jpg', '["/images/shop-prod-2.jpg", "/images/category-necklaces.jpg"]'::jsonb, 'BJ-NCK-002', 'Timeless 22k pure gold necklace with intricate artisan filigree craftsmanship.', 'lumiere-gold-necklace', 14.80, 'Lumiere 22k Gold Necklace | Bhai Jeweller', 'Buy handcrafted 22k gold necklace. Pure gold heritage craftsmanship.', '["gold necklace", "22k gold"]'::jsonb),
('valera-earrings', 'Valera Diamond Drop Earrings', 'Earrings', 760.00, 950.00, 5, '18k White Gold', 'Low Stock', false, '/images/shop-prod-3.jpg', '["/images/shop-prod-3.jpg"]'::jsonb, 'BJ-ERG-003', 'Elegant 18k white gold drop earrings encrusted with pavé set diamonds.', 'valera-diamond-drop-earrings', 6.40, 'Valera Diamond Drop Earrings | Bhai Jeweller', 'Shop Valera Diamond Drop Earrings in 18k White Gold.', '["diamond earrings", "drop earrings"]'::jsonb),
('royal-bangle', 'Royal Heritage Bangle', 'Bracelets', 1850.00, 2100.00, 3, '22k Gold', 'Low Stock', true, '/images/shop-prod-4.jpg', '["/images/shop-prod-4.jpg"]'::jsonb, 'BJ-BRC-004', 'Heritage 22k pure gold handcrafted royal bangle set.', 'royal-heritage-bangle', 28.50, 'Royal Heritage 22k Gold Bangle | Bhai Jeweller', 'Authentic 22k gold royal heritage bangle.', '["22k gold bangle", "royal bangle"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED ORDERS
INSERT INTO orders (id, customer_name, customer_email, items_description, total_amount, payment_method, order_status, shipping_address)
VALUES
('BJ-98421', 'Sophia Reynolds', 'sophia.r@example.com', 'Solara Diamond Ring (18k Gold)', 1280.00, 'Credit Card (Visa)', 'Processing', 'Bradford, West Yorkshire, UK'),
('BJ-98420', 'Alexander Wright', 'a.wright@example.com', 'Lumiere Gold Necklace', 980.00, 'Apple Pay', 'Shipped', 'London, UK'),
('BJ-98419', 'Fatima Al-Mansoor', 'fatima.m@example.com', 'Royal Heritage Bangle + Gift Box', 1875.00, 'Direct Bank Wire', 'Processing', 'Dubai, UAE'),
('BJ-98418', 'James Sterling', 'james.s@example.com', 'Valera Diamond Drop Earrings', 760.00, 'Cash on Delivery', 'Delivered', 'Leeds, UK'),
('BJ-98417', 'Elena Rostova', 'elena.r@example.com', 'Solara Ring + Aurelia Pendant', 2700.00, 'Credit Card (MC)', 'Delivered', 'Manchester, UK')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED BESPOKE ENQUIRIES
INSERT INTO bespoke_enquiries (id, client_name, client_email, client_phone, service_requested, estimated_budget, design_notes, enquiry_status)
VALUES
('ENQ-101', 'Tariq Hussain', 'tariq.h@example.com', '+44 7700 900123', 'Bespoke Engagement Ring Design', '$3,000 - $5,000', 'Looking to customize a 1.5ct Oval Cut diamond ring in 18k yellow gold.', 'New'),
('ENQ-100', 'Amara Vance', 'amara.vance@example.com', '+44 7700 900456', 'Bridal Jewelry Set Customization', '$8,000 - $12,000', 'Require full matching necklace and bangle set in 22k pure gold for wedding in November.', 'In Design'),
('ENQ-099', 'Marcus Brody', 'marcus.b@example.com', '+44 7700 900789', 'Heirloom Ring Restoration', '$1,500 - $2,500', 'Restoration and resizing of vintage emerald gold ring.', 'Completed')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED HERO SLIDES
INSERT INTO hero_slides (id, title, subtitle, cta_text, cta_link, image, status, display_order)
VALUES
('slide-1', 'The Royal Aurelia Collection', 'Handcrafted 22k Pure Gold & Diamond Masterpieces', 'Explore Collection', '/shop?category=Necklaces', '/images/hero-slider-1.jpg', 'Active', 1),
('slide-2', 'Bespoke Diamond Engagement Rings', 'Tailored by Master Artisans to Tell Your Unique Love Story', 'Book Consultation', '/bespoke', '/images/hero-slider-2.jpg', 'Active', 2),
('slide-3', 'Timeless Heritage Craftsmanship', 'Discover Fine Jewelry Engineered for Generations', 'Shop New Arrivals', '/shop', '/images/hero-slider-3.jpg', 'Inactive', 3)
ON CONFLICT (id) DO NOTHING;
