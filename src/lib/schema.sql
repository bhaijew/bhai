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

-- 7. USERS SECURITY TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'client',
    failed_attempts INT DEFAULT 0,
    lock_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. LOGIN SECURITY ATTEMPTS & IP BLOCKING TABLE
CREATE TABLE IF NOT EXISTS login_attempts (
    id VARCHAR(64) PRIMARY KEY,
    ip_address VARCHAR(100) NOT NULL,
    email_attempted VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    failure_reason TEXT,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_login_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_email ON login_attempts(email_attempted);

-- 9. CARTS & ABANDONED CART RECOVERY TABLE
CREATE TABLE IF NOT EXISTS carts (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_name VARCHAR(255),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'GBP',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    recovery_status VARCHAR(50) NOT NULL DEFAULT 'abandoned',
    offered_discount_percent INT DEFAULT 0,
    checkout_url TEXT,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_carts_customer_id ON carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_carts_customer_email ON carts(customer_email);
CREATE INDEX IF NOT EXISTS idx_carts_status ON carts(status);
CREATE INDEX IF NOT EXISTS idx_carts_last_activity ON carts(last_activity_at);

-- 10. VAPI AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS vapi_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    tool_name VARCHAR(100) NOT NULL,
    customer_id VARCHAR(64),
    cart_id VARCHAR(64),
    tool_call_id VARCHAR(100),
    success BOOLEAN NOT NULL,
    result_summary JSONB,
    error_message TEXT,
    ip_address VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vapi_audit_cart ON vapi_audit_logs(cart_id);
CREATE INDEX IF NOT EXISTS idx_vapi_audit_created ON vapi_audit_logs(created_at);

-- 11. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- ============================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bespoke_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_bar ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vapi_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running to prevent "policy already exists" error
DROP POLICY IF EXISTS "Allow Public Products Access" ON products;
DROP POLICY IF EXISTS "Allow Public Categories Access" ON categories;

DROP POLICY IF EXISTS "Allow Public Orders Access" ON orders;
DROP POLICY IF EXISTS "Allow Public Enquiries Access" ON bespoke_enquiries;
DROP POLICY IF EXISTS "Allow Public Slides Access" ON hero_slides;
DROP POLICY IF EXISTS "Allow Public Hero Access" ON hero_section;
DROP POLICY IF EXISTS "Allow Public Announcement Access" ON announcement_bar;
DROP POLICY IF EXISTS "Allow Public Users Access" ON users;
DROP POLICY IF EXISTS "Allow Public Login Attempts Access" ON login_attempts;
DROP POLICY IF EXISTS "Allow Public Carts Access" ON carts;
DROP POLICY IF EXISTS "Allow Public Vapi Logs Access" ON vapi_audit_logs;

-- Allow public read & write access for API endpoints
CREATE POLICY "Allow Public Products Access" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public Categories Access" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public Orders Access" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public Enquiries Access" ON bespoke_enquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public Slides Access" ON hero_slides FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public Hero Access" ON hero_section FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public Announcement Access" ON announcement_bar FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public Users Access" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public Login Attempts Access" ON login_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public Carts Access" ON carts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public Vapi Logs Access" ON vapi_audit_logs FOR ALL USING (true) WITH CHECK (true);

-- Insert initial default categories
INSERT INTO categories (id, name, slug, description, image, display_order)
VALUES 
    ('cat-rings', 'Rings', 'rings', 'Timeless engagement rings, diamond bands, and 22k pure gold statement rings handcrafted in the UK.', '/images/category-rings.jpg', 1),
    ('cat-necklaces', 'Necklaces', 'necklaces', 'Intricate diamond pendants, royal gold chokers, and delicate chains made with immaculate precision.', '/images/category-necklaces.jpg', 2),
    ('cat-earrings', 'Earrings', 'earrings', 'Dazzling diamond studs, chandelier jhumkas, and timeless gold hoops designed for unforgettable moments.', '/images/category-earrings.jpg', 3),
    ('cat-bracelets', 'Bracelets', 'bracelets', 'Elegant tennis bracelets, gold charm bangles, and bespoke cuffs engineered for modern luxury.', '/images/category-bracelets.jpg', 4),
    ('cat-bangles', 'Bangles', 'bangles', 'Traditional 22k gold bridal bangles, kada sets, and sleek modern stackable cuffs.', '/images/category-bracelets.jpg', 5),
    ('cat-pendants', 'Pendants', 'pendants', 'Solitaire diamond pendants, bespoke birthstone designs, and 18k pure gold lockets.', '/images/category-necklaces.jpg', 6)
ON CONFLICT (slug) DO NOTHING;


-- Insert initial default config rows if they don't exist yet
INSERT INTO hero_section (id, brand_pretitle, headline_line1, headline_line2, headline_line3, description, primary_cta_text, primary_cta_href, hero_image, featured_title, featured_subtitle, featured_image)
VALUES ('main_hero', 'BHAI JEWELLER', 'Jewellery, made', 'unforgettable', '', 'Timeless pieces for modern souls. Discover fine jewellery designed to celebrate your most precious moments.', 'Shop Collection', '/shop', '/images/hero-img.jpg', 'Diamond Elegance', 'Classic pieces, endless beauty.', '/images/featured-ring.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO announcement_bar (id, is_enabled, messages)
VALUES ('main_announcement', true, '["Free worldwide shipping on all orders over $150  |  Handcrafted with passion in the UK", "Complimentary luxury gift packaging on every order  |  Bespoke service", "Fine jewellery showroom in Bradford, West Yorkshire  |  Private viewings available"]'::jsonb)
ON CONFLICT (id) DO NOTHING;




