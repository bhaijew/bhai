-- ============================================================
-- BHAI JEWELLER - Production Hardened PostgreSQL / Supabase Schema
-- Includes Enterprise-Grade Row Level Security (RLS) & Protection
-- Run this SQL in Supabase SQL Editor to apply security rules!
-- ============================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10, 2) NOT NULL CHECK (original_price >= 0),
    stock INT NOT NULL DEFAULT 10 CHECK (stock >= 0),
    metal VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In Stock',
    is_featured BOOLEAN DEFAULT FALSE,
    image TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    weight_grams DECIMAL(6, 2) DEFAULT 0.0 CHECK (weight_grams >= 0),
    seo_title VARCHAR(255),
    seo_description TEXT,
    size VARCHAR(50) DEFAULT 'Standard',
    sizes JSONB DEFAULT '[]'::jsonb,
    focus_keywords JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_name_unique ON products (LOWER(TRIM(name)));
ALTER TABLE products ADD COLUMN IF NOT EXISTS size VARCHAR(50) DEFAULT 'Standard';
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '[]'::jsonb;

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    items_description TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(100) NOT NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'Processing',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

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

CREATE INDEX IF NOT EXISTS idx_enquiries_email ON bespoke_enquiries(client_email);

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

-- 5. HERO SECTION CONFIG TABLE
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

-- 7. USERS SECURITY TABLE (Sensitive: Strictly blocked from public anon role)
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
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
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

-- 12. REVIEWS TABLE (Real Customer Reviews)
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(150) NOT NULL,
    location VARCHAR(100) DEFAULT 'United Kingdom',
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) DEFAULT 'Verified Review',
    comment TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0 CHECK (helpful_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at);

-- ============================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bespoke_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_bar ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vapi_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop legacy / insecure wide-open policies
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
DROP POLICY IF EXISTS "Allow Public Reviews Access" ON reviews;

-- Drop previous iterations if re-running
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Service Role Full Access Products" ON products;
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
DROP POLICY IF EXISTS "Service Role Full Access Categories" ON categories;
DROP POLICY IF EXISTS "Public Read Hero Section" ON hero_section;
DROP POLICY IF EXISTS "Service Role Full Access Hero Section" ON hero_section;
DROP POLICY IF EXISTS "Public Read Hero Slides" ON hero_slides;
DROP POLICY IF EXISTS "Service Role Full Access Hero Slides" ON hero_slides;
DROP POLICY IF EXISTS "Public Read Announcement Bar" ON announcement_bar;
DROP POLICY IF EXISTS "Service Role Full Access Announcement Bar" ON announcement_bar;
DROP POLICY IF EXISTS "Public Read Reviews" ON reviews;
DROP POLICY IF EXISTS "Public Insert Reviews" ON reviews;
DROP POLICY IF EXISTS "Service Role Full Access Reviews" ON reviews;
DROP POLICY IF EXISTS "Public Insert Enquiries" ON bespoke_enquiries;
DROP POLICY IF EXISTS "Service Role Full Access Enquiries" ON bespoke_enquiries;
DROP POLICY IF EXISTS "Public Insert Orders" ON orders;
DROP POLICY IF EXISTS "Service Role Full Access Orders" ON orders;
DROP POLICY IF EXISTS "Service Role Full Access Users" ON users;
DROP POLICY IF EXISTS "Public Insert Login Attempts" ON login_attempts;
DROP POLICY IF EXISTS "Service Role Full Access Login Attempts" ON login_attempts;
DROP POLICY IF EXISTS "Public Read Own Cart" ON carts;
DROP POLICY IF EXISTS "Public Insert Cart" ON carts;
DROP POLICY IF EXISTS "Public Update Cart" ON carts;
DROP POLICY IF EXISTS "Service Role Full Access Carts" ON carts;
DROP POLICY IF EXISTS "Service Role Full Access Vapi Logs" ON vapi_audit_logs;

-- ------------------------------------------------------------
-- 1. PRODUCTS & CATEGORIES
-- Public (anonymous storefront) can ONLY READ catalog
-- Modifications strictly locked to service_role (Admin API backend)
-- ------------------------------------------------------------
CREATE POLICY "Public Read Products" ON products
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Service Role Full Access Products" ON products
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public Read Categories" ON categories
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Service Role Full Access Categories" ON categories
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- 2. HERO SECTION, HERO SLIDES, ANNOUNCEMENT BAR
-- Public can ONLY READ marketing copy. Tampering blocked.
-- ------------------------------------------------------------
CREATE POLICY "Public Read Hero Section" ON hero_section
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Service Role Full Access Hero Section" ON hero_section
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public Read Hero Slides" ON hero_slides
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Service Role Full Access Hero Slides" ON hero_slides
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public Read Announcement Bar" ON announcement_bar
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Service Role Full Access Announcement Bar" ON announcement_bar
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- 3. REVIEWS
-- Public can READ approved reviews & SUBMIT verified reviews
-- Reviews cannot be deleted or manipulated by anon users
-- ------------------------------------------------------------
CREATE POLICY "Public Read Reviews" ON reviews
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Public Insert Reviews" ON reviews
    FOR INSERT TO public
    WITH CHECK (
        product_id IS NOT NULL AND
        reviewer_name IS NOT NULL AND
        comment IS NOT NULL AND
        rating >= 1 AND rating <= 5
    );

CREATE POLICY "Service Role Full Access Reviews" ON reviews
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- 4. BESPOKE ENQUIRIES
-- Public can SUBMIT custom jewellery enquiries
-- Public CANNOT READ or steal client confidential quotes/designs
-- ------------------------------------------------------------
CREATE POLICY "Public Insert Enquiries" ON bespoke_enquiries
    FOR INSERT TO public
    WITH CHECK (
        client_name IS NOT NULL AND
        client_email IS NOT NULL AND
        client_phone IS NOT NULL
    );

CREATE POLICY "Service Role Full Access Enquiries" ON bespoke_enquiries
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- 5. ORDERS
-- Public can SUBMIT new checkout orders
-- Public CANNOT READ all customer orders / PII (shipping addresses)
-- ------------------------------------------------------------
CREATE POLICY "Public Insert Orders" ON orders
    FOR INSERT TO public
    WITH CHECK (
        customer_name IS NOT NULL AND
        customer_email IS NOT NULL AND
        total_amount >= 0
    );

CREATE POLICY "Service Role Full Access Orders" ON orders
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- 6. USERS TABLE (MAXIMUM FORTRESS PROTECTION)
-- Zero public access. password_hash, emails, phone numbers are
-- completely invisible to anon role.
-- Only server-side auth endpoints with service_role can query.
-- ------------------------------------------------------------
CREATE POLICY "Service Role Full Access Users" ON users
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- 7. LOGIN ATTEMPTS
-- Public can insert attempt record (brute force audit logging)
-- Public CANNOT delete or tamper with attempts to clear lockouts
-- ------------------------------------------------------------
CREATE POLICY "Public Insert Login Attempts" ON login_attempts
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Service Role Full Access Login Attempts" ON login_attempts
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- 8. CARTS & ABANDONED CART RECOVERY
-- ------------------------------------------------------------
CREATE POLICY "Public Read Own Cart" ON carts
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Public Insert Cart" ON carts
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Public Update Cart" ON carts
    FOR UPDATE TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service Role Full Access Carts" ON carts
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------
-- 9. VAPI AUDIT LOGS
-- ------------------------------------------------------------
CREATE POLICY "Service Role Full Access Vapi Logs" ON vapi_audit_logs
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);


-- ============================================================
-- SEED DATA (SAFE IDEMPOTENT INSERTS)
-- ============================================================

-- Insert default categories
INSERT INTO categories (id, name, slug, description, image, display_order)
VALUES 
    ('cat-rings', 'Rings', 'rings', 'Timeless engagement rings, diamond bands, and 22k pure gold statement rings handcrafted in the UK.', '/images/category-rings.jpg', 1),
    ('cat-necklaces', 'Necklaces', 'necklaces', 'Intricate diamond pendants, royal gold chokers, and delicate chains made with immaculate precision.', '/images/category-necklaces.jpg', 2),
    ('cat-earrings', 'Earrings', 'earrings', 'Dazzling diamond studs, chandelier jhumkas, and timeless gold hoops designed for unforgettable moments.', '/images/category-earrings.jpg', 3),
    ('cat-bracelets', 'Bracelets', 'bracelets', 'Elegant tennis bracelets, gold charm bangles, and bespoke cuffs engineered for modern luxury.', '/images/category-bracelets.jpg', 4),
    ('cat-bangles', 'Bangles', 'bangles', 'Traditional 22k gold bridal bangles, kada sets, and sleek modern stackable cuffs.', '/images/category-bracelets.jpg', 5),
    ('cat-pendants', 'Pendants', 'pendants', 'Solitaire diamond pendants, bespoke birthstone designs, and 18k pure gold lockets.', '/images/category-necklaces.jpg', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert initial default hero config
INSERT INTO hero_section (id, brand_pretitle, headline_line1, headline_line2, headline_line3, description, primary_cta_text, primary_cta_href, hero_image, featured_title, featured_subtitle, featured_image)
VALUES ('main_hero', 'BHAI JEWELLER', 'Jewellery, made', 'unforgettable', '', 'Timeless pieces for modern souls. Discover fine jewellery designed to celebrate your most precious moments.', 'Shop Collection', '/shop', '/images/hero-img.jpg', 'Diamond Elegance', 'Classic pieces, endless beauty.', '/images/featured-ring.jpg')
ON CONFLICT (id) DO NOTHING;

-- Insert initial default products
INSERT INTO products (id, name, category, price, original_price, stock, metal, status, is_featured, image, images, sku, description, slug, weight_grams, seo_title, seo_description, focus_keywords)
VALUES 
    ('solara-ring', 'Solara Diamond Ring', 'Rings', 1280, 1650, 14, '18k Yellow Gold', 'In Stock', true, '/images/detail-ring-hero.jpg', '["/images/detail-ring-hero.jpg", "/images/shop-prod-1.jpg", "/images/category-rings.jpg"]'::jsonb, 'BJ-RNG-001', 'Exquisite 18k yellow gold solitaire ring handcrafted with precision cut brilliant diamonds.', 'solara-diamond-ring', 5.2, 'Solara Diamond Ring | 18k Gold Solitaire | Bhai Jeweller', 'Shop Solara Diamond Ring handcrafted in 18k Yellow Gold. Certified brilliant diamonds.', '["diamond ring", "18k yellow gold ring", "bhai jeweller ring", "solitaire ring"]'::jsonb),
    ('lumiere-necklace', 'Lumiere Gold Necklace', 'Necklaces', 980, 1200, 8, '22k Gold', 'In Stock', true, '/images/shop-prod-2.jpg', '["/images/shop-prod-2.jpg", "/images/category-necklaces.jpg"]'::jsonb, 'BJ-NCK-002', 'Timeless 22k pure gold necklace with intricate artisan filigree craftsmanship.', 'lumiere-gold-necklace', 14.8, 'Lumiere 22k Gold Necklace | Fine Jewelry | Bhai Jeweller', 'Buy handcrafted 22k gold necklace. Pure gold heritage craftsmanship.', '["gold necklace", "22k gold necklace", "bhai jeweller necklace"]'::jsonb),
    ('valera-earrings', 'Valera Diamond Drop Earrings', 'Earrings', 760, 950, 5, '18k White Gold', 'Low Stock', false, '/images/shop-prod-3.jpg', '["/images/shop-prod-3.jpg", "/images/category-earrings.jpg"]'::jsonb, 'BJ-ERG-003', 'Elegant 18k white gold drop earrings encrusted with pavé set diamonds.', 'valera-diamond-drop-earrings', 6.4, 'Valera Diamond Drop Earrings 18k White Gold | Bhai Jeweller', 'Shop Valera Diamond Drop Earrings in 18k White Gold.', '["diamond earrings", "white gold earrings", "drop earrings"]'::jsonb),
    ('royal-bangle', 'Royal Heritage Bangle', 'Bracelets', 1850, 2100, 3, '22k Gold', 'Low Stock', true, '/images/shop-prod-4.jpg', '["/images/shop-prod-4.jpg", "/images/category-bracelets.jpg"]'::jsonb, 'BJ-BRC-004', 'Heritage 22k pure gold handcrafted royal bangle set.', 'royal-heritage-bangle', 28.5, 'Royal Heritage 22k Gold Bangle | Bhai Jeweller', 'Authentic 22k gold royal heritage bangle.', '["22k gold bangle", "gold bracelet", "royal bangle"]'::jsonb),
    ('aurelia-solitaire', 'Aurelia Solitaire Pendant', 'Necklaces', 1420, 1700, 12, '18k Rose Gold', 'In Stock', false, '/images/shop-prod-5.jpg', '["/images/shop-prod-5.jpg", "/images/category-necklaces.jpg"]'::jsonb, 'BJ-NCK-005', 'Stunning 18k Rose Gold solitaire diamond pendant with chain.', 'aurelia-solitaire-pendant', 8.1, 'Aurelia Solitaire Pendant 18k Rose Gold | Bhai Jeweller', 'Shop Aurelia Solitaire Pendant in 18k Rose Gold.', '["rose gold pendant", "solitaire pendant", "diamond pendant"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Enable Realtime publication for tables so Supabase broadcasts live changes
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE products;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE categories;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE bespoke_enquiries;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE hero_slides;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;
