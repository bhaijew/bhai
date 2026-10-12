'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
  slug?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  slug: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  metal: string;
  status: string;
  isFeatured: boolean;
  image: string;
  images: string[];
  sku: string;
  description: string;
  slug: string;
  rating?: number;
  reviewCount?: number;
  weightGrams?: number;
  seoTitle?: string;
  seoDescription?: string;
  focusKeywords?: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  display_order?: number;
  is_active?: boolean;
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  products: ProductItem[];
  categories: CategoryItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setCartItems: (items: CartItem[]) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  addProduct: (product: ProductItem) => Promise<boolean>;
  updateProduct: (product: ProductItem) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateProductStock: (id: string, newStock: number) => void;
  refreshProducts: () => Promise<void>;
  addCategory: (category: Partial<CategoryItem>) => Promise<boolean>;
  updateCategory: (category: CategoryItem) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  refreshCategories: () => Promise<void>;
  cartCount: number;
  wishlistCount: number;
  cartSubtotal: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bhai_jeweller_cart';
const WISHLIST_STORAGE_KEY = 'bhai_jeweller_wishlist';
const PRODUCTS_STORAGE_KEY = 'bhai_jeweller_products';
const CATEGORIES_STORAGE_KEY = 'bhai_jeweller_categories';

export const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'solara-ring',
    name: 'Solara Diamond Ring',
    category: 'Rings',
    price: 1280,
    originalPrice: 1650,
    stock: 14,
    metal: '18k Yellow Gold',
    status: 'In Stock',
    isFeatured: true,
    image: '/images/detail-ring-hero.jpg',
    images: ['/images/detail-ring-hero.jpg', '/images/shop-prod-1.jpg', '/images/category-rings.jpg'],
    sku: 'BJ-RNG-001',
    description: 'Exquisite 18k yellow gold solitaire ring handcrafted with precision cut brilliant diamonds.',
    slug: 'solara-diamond-ring',
    weightGrams: 5.2,
    seoTitle: 'Solara Diamond Ring | 18k Gold Solitaire | Bhai Jeweller',
    seoDescription: 'Shop Solara Diamond Ring handcrafted in 18k Yellow Gold. Certified brilliant diamonds.',
    focusKeywords: ['diamond ring', '18k yellow gold ring', 'bhai jeweller ring', 'solitaire ring'],
  },
  {
    id: 'lumiere-necklace',
    name: 'Lumiere Gold Necklace',
    category: 'Necklaces',
    price: 980,
    originalPrice: 1200,
    stock: 8,
    metal: '22k Gold',
    status: 'In Stock',
    isFeatured: true,
    image: '/images/shop-prod-2.jpg',
    images: ['/images/shop-prod-2.jpg', '/images/category-necklaces.jpg'],
    sku: 'BJ-NCK-002',
    description: 'Timeless 22k pure gold necklace with intricate artisan filigree craftsmanship.',
    slug: 'lumiere-gold-necklace',
    weightGrams: 14.8,
    seoTitle: 'Lumiere 22k Gold Necklace | Fine Jewelry | Bhai Jeweller',
    seoDescription: 'Buy handcrafted 22k gold necklace. Pure gold heritage craftsmanship.',
    focusKeywords: ['gold necklace', '22k gold necklace', 'bhai jeweller necklace'],
  },
  {
    id: 'valera-earrings',
    name: 'Valera Diamond Drop Earrings',
    category: 'Earrings',
    price: 760,
    originalPrice: 950,
    stock: 5,
    metal: '18k White Gold',
    status: 'Low Stock',
    isFeatured: false,
    image: '/images/shop-prod-3.jpg',
    images: ['/images/shop-prod-3.jpg', '/images/category-earrings.jpg'],
    sku: 'BJ-ERG-003',
    description: 'Elegant 18k white gold drop earrings encrusted with pavé set diamonds.',
    slug: 'valera-diamond-drop-earrings',
    weightGrams: 6.4,
    seoTitle: 'Valera Diamond Drop Earrings 18k White Gold | Bhai Jeweller',
    seoDescription: 'Shop Valera Diamond Drop Earrings in 18k White Gold.',
    focusKeywords: ['diamond earrings', 'white gold earrings', 'drop earrings'],
  },
  {
    id: 'royal-bangle',
    name: 'Royal Heritage Bangle',
    category: 'Bracelets',
    price: 1850,
    originalPrice: 2100,
    stock: 3,
    metal: '22k Gold',
    status: 'Low Stock',
    isFeatured: true,
    image: '/images/shop-prod-4.jpg',
    images: ['/images/shop-prod-4.jpg', '/images/category-bracelets.jpg'],
    sku: 'BJ-BRC-004',
    description: 'Heritage 22k pure gold handcrafted royal bangle set.',
    slug: 'royal-heritage-bangle',
    weightGrams: 28.5,
    seoTitle: 'Royal Heritage 22k Gold Bangle | Bhai Jeweller',
    seoDescription: 'Authentic 22k gold royal heritage bangle.',
    focusKeywords: ['22k gold bangle', 'gold bracelet', 'royal bangle'],
  },
  {
    id: 'aurelia-solitaire',
    name: 'Aurelia Solitaire Pendant',
    category: 'Necklaces',
    price: 1420,
    originalPrice: 1700,
    stock: 12,
    metal: '18k Rose Gold',
    status: 'In Stock',
    isFeatured: false,
    image: '/images/shop-prod-5.jpg',
    images: ['/images/shop-prod-5.jpg', '/images/category-necklaces.jpg'],
    sku: 'BJ-NCK-005',
    description: 'Stunning 18k Rose Gold solitaire diamond pendant with chain.',
    slug: 'aurelia-solitaire-pendant',
    weightGrams: 8.1,
    seoTitle: 'Aurelia Solitaire Pendant 18k Rose Gold | Bhai Jeweller',
    seoDescription: 'Shop Aurelia Solitaire Pendant in 18k Rose Gold.',
    focusKeywords: ['rose gold pendant', 'solitaire pendant', 'diamond pendant'],
  },
];

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-rings',
    name: 'Rings',
    slug: 'rings',
    description: 'Timeless engagement rings, diamond bands, and 22k pure gold statement rings handcrafted in the UK.',
    image: '/images/category-rings.jpg',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'cat-necklaces',
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Intricate diamond pendants, royal gold chokers, and delicate chains made with immaculate precision.',
    image: '/images/category-necklaces.jpg',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'cat-earrings',
    name: 'Earrings',
    slug: 'earrings',
    description: 'Dazzling diamond studs, chandelier jhumkas, and timeless gold hoops designed for unforgettable moments.',
    image: '/images/category-earrings.jpg',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'cat-bracelets',
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Elegant tennis bracelets, gold charm bangles, and bespoke cuffs engineered for modern luxury.',
    image: '/images/category-bracelets.jpg',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'cat-bangles',
    name: 'Bangles',
    slug: 'bangles',
    description: 'Traditional 22k gold bridal bangles, kada sets, and sleek modern stackable cuffs.',
    image: '/images/category-bracelets.jpg',
    display_order: 5,
    is_active: true,
  },
  {
    id: 'cat-pendants',
    name: 'Pendants',
    slug: 'pendants',
    description: 'Solitaire diamond pendants, bespoke birthstone designs, and 18k pure gold lockets.',
    image: '/images/category-necklaces.jpg',
    display_order: 6,
    is_active: true,
  },
];

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch live products
  const refreshProducts = useCallback(async () => {
    try {
      // 1. Direct Supabase query
      if (supabase) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const mappedProducts: ProductItem[] = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: Number(p.price),
            originalPrice: Number(p.original_price || p.price),
            stock: Number(p.stock),
            metal: p.metal,
            status: p.status,
            isFeatured: Boolean(p.is_featured),
            image: p.image || '/images/detail-ring-hero.jpg',
            images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || '/images/detail-ring-hero.jpg'],
            sku: p.sku || `BJ-${p.id}`,
            description: p.description || '',
            slug: p.slug || p.id,
            weightGrams: Number(p.weight_grams || 0),
            seoTitle: p.seo_title,
            seoDescription: p.seo_description,
            focusKeywords: Array.isArray(p.focus_keywords) ? p.focus_keywords : [],
          }));

          setProducts(mappedProducts);
          try {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mappedProducts));
          } catch (e) {}
          return;
        }
      }

      // 2. Fetch live products from API route with cache-busting
      const res = await fetch(`/api/products?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
        try {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(data.data));
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Failed to refresh products:', err);
    }
  }, []);

  // Fetch live categories
  const refreshCategories = useCallback(async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          setCategories(data);
          try {
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(data));
          } catch (e) {}
          return;
        }
      }

      const res = await fetch(`/api/categories?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setCategories(data.data);
        try {
          localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(data.data));
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Failed to refresh categories:', err);
    }
  }, []);

  // Initial load from storage & API
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      const savedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedProducts) {
        const parsedP = JSON.parse(savedProducts);
        if (Array.isArray(parsedP)) setProducts(parsedP);
      }
      if (savedCategories) {
        const parsedC = JSON.parse(savedCategories);
        if (Array.isArray(parsedC) && parsedC.length > 0) setCategories(parsedC);
      }
    } catch (e) {
      console.error('Failed to load shop state from localStorage:', e);
    }

    refreshProducts();
    refreshCategories();
    setIsLoaded(true);
  }, [refreshProducts, refreshCategories]);

  // Real-time Supabase Realtime channel for instant multi-tab sync
  useEffect(() => {
    if (!supabase) return;

    try {
      const channel = supabase
        .channel('realtime:shop_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          () => {
            refreshProducts();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'categories' },
          () => {
            refreshCategories();
          }
        )
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };

    } catch (err) {
      console.warn('Supabase Realtime subscription notice:', err);
    }
  }, [refreshProducts, refreshCategories]);

  // Sync cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Sync wishlist to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  // Sync products to localStorage
  useEffect(() => {
    if (isLoaded && products.length > 0) {
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      } catch (e) {}
    }
  }, [products, isLoaded]);

  // Sync categories to localStorage
  useEffect(() => {
    if (isLoaded && categories.length > 0) {
      try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      } catch (e) {}
    }
  }, [categories, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);
  const setCartItems = (items: CartItem[]) => setCart(items);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleWishlist = (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const clearWishlist = () => setWishlist([]);

  // Product CRUD
  const addProduct = async (newProd: ProductItem): Promise<boolean> => {
    const trimmedName = newProd.name.trim().toLowerCase();

    // Check if product with this ID or SAME NAME already exists
    const existingMatch = products.find(
      (p) => p.id === newProd.id || p.name.trim().toLowerCase() === trimmedName
    );

    const resolvedProd: ProductItem = existingMatch
      ? {
          ...newProd,
          id: existingMatch.id,
          slug: existingMatch.slug || newProd.slug,
          sku: existingMatch.sku || newProd.sku,
        }
      : newProd;

    // 1. Instant optimistic state and localStorage write (ensures exactly 1 product per name)
    setProducts((prev) => {
      const idx = prev.findIndex(
        (p) => p.id === resolvedProd.id || p.name.trim().toLowerCase() === trimmedName
      );
      let updated: ProductItem[];
      if (idx >= 0) {
        updated = prev.map((p, i) => (i === idx ? resolvedProd : p));
      } else {
        updated = [resolvedProd, ...prev.filter((p) => p.name.trim().toLowerCase() !== trimmedName)];
      }
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    let ok = false;
    // 2. Direct Supabase write
    if (supabase) {
      try {
        // Query to check if matching name exists in DB to reuse its ID and avoid unique constraint error
        let dbTargetId = resolvedProd.id;
        const { data: dbMatch } = await supabase
          .from('products')
          .select('id, slug, sku')
          .ilike('name', newProd.name.trim())
          .maybeSingle();

        if (dbMatch) {
          dbTargetId = dbMatch.id;
        }

        const { error } = await supabase.from('products').upsert({
          id: dbTargetId,
          name: resolvedProd.name,
          category: resolvedProd.category,
          price: resolvedProd.price,
          original_price: resolvedProd.originalPrice,
          stock: resolvedProd.stock,
          metal: resolvedProd.metal,
          status: resolvedProd.status,
          is_featured: resolvedProd.isFeatured,
          image: resolvedProd.image,
          images: resolvedProd.images,
          sku: dbMatch?.sku || resolvedProd.sku,
          description: resolvedProd.description,
          slug: dbMatch?.slug || resolvedProd.slug,
          weight_grams: resolvedProd.weightGrams,
          seo_title: resolvedProd.seoTitle,
          seo_description: resolvedProd.seoDescription,
          focus_keywords: resolvedProd.focusKeywords,
        }, { onConflict: 'id' });

        if (!error) ok = true;
      } catch (e) {
        console.warn('Direct Supabase upsert notice:', e);
      }
    }

    // 3. Server API Route sync with master admin key
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'BhaiAdmin@Bradford2026!',
        },
        body: JSON.stringify(resolvedProd),
      });
      const data = await res.json();
      if (data.success) ok = true;
    } catch (e) {
      console.warn('API Route add product notice:', e);
    }

    // 4. Trigger background refresh to ensure perfect consistency
    refreshProducts().catch(() => {});
    return ok;
  };

  const updateProduct = async (updatedProd: ProductItem): Promise<boolean> => {
    const trimmedName = updatedProd.name.trim().toLowerCase();

    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === updatedProd.id || p.name.trim().toLowerCase() === trimmedName
          ? updatedProd
          : p
      );
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    let ok = false;
    if (supabase) {
      try {
        let dbTargetId = updatedProd.id;
        const { data: dbMatch } = await supabase
          .from('products')
          .select('id, slug, sku')
          .ilike('name', updatedProd.name.trim())
          .maybeSingle();

        if (dbMatch) {
          dbTargetId = dbMatch.id;
        }

        const { error } = await supabase.from('products').upsert({
          id: dbTargetId,
          name: updatedProd.name,
          category: updatedProd.category,
          price: updatedProd.price,
          original_price: updatedProd.originalPrice,
          stock: updatedProd.stock,
          metal: updatedProd.metal,
          status: updatedProd.status,
          is_featured: updatedProd.isFeatured,
          image: updatedProd.image,
          images: updatedProd.images,
          sku: dbMatch?.sku || updatedProd.sku || `BJ-${dbTargetId}`,
          description: updatedProd.description,
          slug: dbMatch?.slug || updatedProd.slug || dbTargetId,
          weight_grams: updatedProd.weightGrams,
          seo_title: updatedProd.seoTitle,
          seo_description: updatedProd.seoDescription,
          focus_keywords: updatedProd.focusKeywords,
        }, { onConflict: 'id' });
        if (!error) ok = true;
      } catch (e) {
        console.warn('Direct Supabase update notice:', e);
      }
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'BhaiAdmin@Bradford2026!',
        },
        body: JSON.stringify(updatedProd),
      });
      const data = await res.json();
      if (data.success) ok = true;
    } catch {}

    refreshProducts().catch(() => {});
    return ok;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    // 1. Instant optimistic state and localStorage deletion
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    let ok = false;
    // 2. Direct Supabase permanent deletion
    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) ok = true;
      } catch (e) {
        console.warn('Direct Supabase delete notice:', e);
      }
    }

    // 3. API Route DELETE with master admin key and cache-busting
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}&_t=${Date.now()}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': 'BhaiAdmin@Bradford2026!',
        },
      });
      const data = await res.json();
      if (data.success) ok = true;
    } catch (e) {
      console.warn('API Route delete notice:', e);
    }

    // 4. Force refresh so the list is guaranteed clean
    await refreshProducts();
    return ok;
  };

  const updateProductStock = (id: string, newStock: number) => {
    const stock = Math.max(0, newStock);
    const status = stock > 0 ? (stock <= 5 ? 'Low Stock' : 'In Stock') : 'Out of Stock';

    setProducts((prev) => {
      const target = prev.find((p) => p.id === id);
      if (!target) return prev;
      const updatedItem = { ...target, stock, status };
      const updated = prev.map((p) => (p.id === id ? updatedItem : p));
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}

      if (supabase) {
        supabase.from('products').update({ stock, status }).eq('id', id).then(() => {});
      }

      fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'BhaiAdmin@Bradford2026!',
        },
        body: JSON.stringify(updatedItem),
      }).catch(() => {});

      return updated;
    });
  };

  // Category CRUD
  const addCategory = async (catData: Partial<CategoryItem>): Promise<boolean> => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'BhaiAdmin@Bradford2026!',
        },
        body: JSON.stringify(catData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCategories((prev) => {
          const updated = [...prev.filter((c) => c.id !== data.data.id && c.slug !== data.data.slug), data.data];
          try {
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        await refreshCategories();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateCategory = async (catData: CategoryItem): Promise<boolean> => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'BhaiAdmin@Bradford2026!',
        },
        body: JSON.stringify(catData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCategories((prev) => {
          const updated = prev.map((c) => (c.id === catData.id ? data.data : c));
          try {
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        await refreshCategories();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}&_t=${Date.now()}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': 'BhaiAdmin@Bradford2026!',
        },
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => {
          const updated = prev.filter((c) => c.id !== id);
          try {
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        await refreshCategories();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        products,
        categories,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        setCartItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        refreshProducts,
        addCategory,
        updateCategory,
        deleteCategory,
        refreshCategories,
        cartCount,
        wishlistCount,
        cartSubtotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
