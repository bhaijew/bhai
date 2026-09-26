'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface ShopContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  products: ProductItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  addProduct: (product: ProductItem) => void;
  deleteProduct: (id: string) => void;
  cartCount: number;
  wishlistCount: number;
  cartSubtotal: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bhai_jeweller_cart';
const WISHLIST_STORAGE_KEY = 'bhai_jeweller_wishlist';
const PRODUCTS_STORAGE_KEY = 'bhai_jeweller_products';

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

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load shop state from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

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
    if (isLoaded) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, isLoaded]);

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

  const addProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
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
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        addProduct,
        deleteProduct,
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
