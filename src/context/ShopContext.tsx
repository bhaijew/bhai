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

export const DEFAULT_PRODUCTS: ProductItem[] = [];

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
      const res = await fetch('/api/products');
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
      const res = await fetch('/api/categories');
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
    setProducts((prev) => {
      const updated = [newProd, ...prev.filter((p) => p.id !== newProd.id)];
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return false;
    }
  };

  const updateProduct = async (updatedProd: ProductItem): Promise<boolean> => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === updatedProd.id ? updatedProd : p));
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProd),
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return false;
    }
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts((prev) => {
      const target = prev.find((p) => p.id === id);
      if (!target) return prev;
      const stock = Math.max(0, newStock);
      const status = stock > 0 ? (stock <= 5 ? 'Low Stock' : 'In Stock') : 'Out of Stock';
      const updatedItem = { ...target, stock, status };

      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      }).catch(() => {});

      const updated = prev.map((p) => (p.id === id ? updatedItem : p));
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Category CRUD
  const addCategory = async (catData: Partial<CategoryItem>): Promise<boolean> => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
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
