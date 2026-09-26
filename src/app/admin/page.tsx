'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/shared/ScrollReveal';

// Initial Hero / Banner Slider Data for Admin Slider Manager
const INITIAL_SLIDES = [
  {
    id: 'slide-1',
    title: 'The Royal Aurelia Collection',
    subtitle: 'Handcrafted 22k Pure Gold & Diamond Masterpieces',
    ctaText: 'Explore Collection',
    ctaLink: '/shop?category=Necklaces',
    image: '/images/hero-slider-1.jpg',
    status: 'Active',
    order: 1,
  },
  {
    id: 'slide-2',
    title: 'Bespoke Diamond Engagement Rings',
    subtitle: 'Tailored by Master Artisans to Tell Your Unique Love Story',
    ctaText: 'Book Consultation',
    ctaLink: '/bespoke',
    image: '/images/hero-slider-2.jpg',
    status: 'Active',
    order: 2,
  },
  {
    id: 'slide-3',
    title: 'Timeless Heritage Craftsmanship',
    subtitle: 'Discover Fine Jewelry Engineered for Generations',
    ctaText: 'Shop New Arrivals',
    ctaLink: '/shop',
    image: '/images/hero-slider-3.jpg',
    status: 'Inactive',
    order: 3,
  },
];

// Initial Products Data
const INITIAL_PRODUCTS = [
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
    sku: 'BJ-RNG-001',
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
    sku: 'BJ-NCK-002',
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
    sku: 'BJ-ERG-003',
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
    sku: 'BJ-BRC-004',
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
    sku: 'BJ-NCK-005',
  },
];

// Initial Orders Data
const INITIAL_ORDERS = [
  {
    id: 'BJ-98421',
    customer: 'Sophia Reynolds',
    email: 'sophia.r@example.com',
    items: 'Solara Diamond Ring (18k Gold)',
    amount: 1280,
    date: '2026-09-26',
    paymentMethod: 'Credit Card (Visa)',
    status: 'Processing',
    address: 'Bradford, West Yorkshire, UK',
  },
  {
    id: 'BJ-98420',
    customer: 'Alexander Wright',
    email: 'a.wright@example.com',
    items: 'Lumiere Gold Necklace',
    amount: 980,
    date: '2026-09-25',
    paymentMethod: 'Apple Pay',
    status: 'Shipped',
    address: 'London, UK',
  },
  {
    id: 'BJ-98419',
    customer: 'Fatima Al-Mansoor',
    email: 'fatima.m@example.com',
    items: 'Royal Heritage Bangle + Gift Box',
    amount: 1875,
    date: '2026-09-25',
    paymentMethod: 'Direct Bank Wire',
    status: 'Processing',
    address: 'Dubai, UAE',
  },
  {
    id: 'BJ-98418',
    customer: 'James Sterling',
    email: 'james.s@example.com',
    items: 'Valera Diamond Drop Earrings',
    amount: 760,
    date: '2026-09-24',
    paymentMethod: 'Cash on Delivery',
    status: 'Delivered',
    address: 'Leeds, UK',
  },
  {
    id: 'BJ-98417',
    customer: 'Elena Rostova',
    email: 'elena.r@example.com',
    items: 'Solara Ring + Aurelia Pendant',
    amount: 2700,
    date: '2026-09-23',
    paymentMethod: 'Credit Card (MC)',
    status: 'Delivered',
    address: 'Manchester, UK',
  },
];

// Initial Custom Bespoke Enquiries
const INITIAL_ENQUIRIES = [
  {
    id: 'ENQ-101',
    name: 'Tariq Hussain',
    email: 'tariq.h@example.com',
    phone: '+44 7700 900123',
    service: 'Bespoke Engagement Ring Design',
    budget: '$3,000 - $5,000',
    date: '2026-09-26',
    message: 'Looking to customize a 1.5ct Oval Cut diamond ring in 18k yellow gold.',
    status: 'New',
  },
  {
    id: 'ENQ-100',
    name: 'Amara Vance',
    email: 'amara.vance@example.com',
    phone: '+44 7700 900456',
    service: 'Bridal Jewelry Set Customization',
    budget: '$8,000 - $12,000',
    date: '2026-09-24',
    message: 'Require full matching necklace and bangle set in 22k pure gold for wedding in November.',
    status: 'In Design',
  },
  {
    id: 'ENQ-099',
    name: 'Marcus Brody',
    email: 'marcus.b@example.com',
    phone: '+44 7700 900789',
    service: 'Heirloom Ring Restoration',
    budget: '$1,500 - $2,500',
    date: '2026-09-22',
    message: 'Restoration and resizing of vintage emerald gold ring.',
    status: 'Completed',
  },
];

// Initial Registered Customers
const INITIAL_CUSTOMERS = [
  { id: 'CUST-001', name: 'Sophia Reynolds', email: 'sophia.r@example.com', totalOrders: 4, totalSpent: 4850, tier: 'VIP Gold' },
  { id: 'CUST-002', name: 'Alexander Wright', email: 'a.wright@example.com', totalOrders: 2, totalSpent: 2180, tier: 'Silver' },
  { id: 'CUST-003', name: 'Fatima Al-Mansoor', email: 'fatima.m@example.com', totalOrders: 6, totalSpent: 14200, tier: 'Diamond VIP' },
  { id: 'CUST-004', name: 'James Sterling', email: 'james.s@example.com', totalOrders: 1, totalSpent: 760, tier: 'Bronze' },
  { id: 'CUST-005', name: 'Elena Rostova', email: 'elena.r@example.com', totalOrders: 3, totalSpent: 5900, tier: 'VIP Gold' },
];

export default function AdminDashboardPage() {
  // Theme State: Default is 'light' (White Theme) as requested!
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'slides' | 'orders' | 'enquiries' | 'customers' | 'goldrates' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // States for store data
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [customers] = useState(INITIAL_CUSTOMERS);

  // Filter states
  const [productCategory, setProductCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Modal states for Product
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Rings',
    price: '',
    originalPrice: '',
    stock: '',
    metal: '18k Yellow Gold',
    sku: '',
    image: '/images/detail-ring-hero.jpg',
  });

  // Modal states for Slider Banner
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);
  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    ctaText: 'Discover Now',
    ctaLink: '/shop',
    image: '/images/hero-slider-1.jpg',
    status: 'Active',
    order: slides.length + 1,
  });

  // Gold Rate State
  const [gold24kRate, setGold24kRate] = useState('24,500');
  const [gold22kRate, setGold22kRate] = useState('22,450');
  const [shippingThreshold, setShippingThreshold] = useState('500');
  const [noticeBanner, setNoticeBanner] = useState('Complimentary Worldwide Insured Express Shipping on Orders Over $500');

  // Product Handler
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const added = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice || newProduct.price),
      stock: Number(newProduct.stock || 1),
      metal: newProduct.metal,
      status: Number(newProduct.stock) > 0 ? 'In Stock' : 'Out of Stock',
      isFeatured: true,
      image: newProduct.image,
      sku: newProduct.sku || `BJ-PRD-${Math.floor(100 + Math.random() * 900)}`,
    };
    setProducts([added, ...products]);
    setIsAddProductOpen(false);
    setNewProduct({
      name: '',
      category: 'Rings',
      price: '',
      originalPrice: '',
      stock: '',
      metal: '18k Yellow Gold',
      sku: '',
      image: '/images/detail-ring-hero.jpg',
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Slider Slide Handler
  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlide.title) return;
    const addedSlide = {
      id: `slide-${Date.now()}`,
      title: newSlide.title,
      subtitle: newSlide.subtitle,
      ctaText: newSlide.ctaText,
      ctaLink: newSlide.ctaLink,
      image: newSlide.image,
      status: newSlide.status,
      order: Number(newSlide.order) || slides.length + 1,
    };
    setSlides([...slides, addedSlide]);
    setIsAddSlideOpen(false);
    setNewSlide({
      title: '',
      subtitle: '',
      ctaText: 'Discover Now',
      ctaLink: '/shop',
      image: '/images/hero-slider-1.jpg',
      status: 'Active',
      order: slides.length + 2,
    });
  };

  const toggleSlideStatus = (id: string) => {
    setSlides(slides.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
  };

  const handleDeleteSlide = (id: string) => {
    setSlides(slides.filter(s => s.id !== id));
  };

  // Order Handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Enquiry Handler
  const handleUpdateEnquiryStatus = (enqId: string, newStatus: string) => {
    setEnquiries(enquiries.map(e => e.id === enqId ? { ...e, status: newStatus } : e));
  };

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalProductsCount = products.length;
  const activeOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;
  const pendingEnquiriesCount = enquiries.filter(e => e.status === 'New' || e.status === 'In Design').length;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchCat = productCategory === 'All' || p.category === productCategory;
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'All') return true;
    return o.status === orderStatusFilter;
  });

  // Navigation Items list
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', count: null },
    { id: 'products', label: 'Products Catalog', icon: '💎', count: products.length },
    { id: 'slides', label: 'Slider & Banners', icon: '🖼️', count: slides.length },
    { id: 'orders', label: 'Orders & Sales', icon: '📦', count: activeOrdersCount },
    { id: 'enquiries', label: 'Bespoke Enquiries', icon: '🎨', count: pendingEnquiriesCount },
    { id: 'customers', label: 'VIP Clients', icon: '👥', count: customers.length },
    { id: 'goldrates', label: 'Gold Rate Manager', icon: '🪙', count: null },
    { id: 'settings', label: 'Store Settings', icon: '⚙️', count: null },
  ];

  // Theme-dependent styles helper
  const isLight = theme === 'light';

  const containerBg = isLight ? 'bg-[#faf8f5] text-[#1c1510]' : 'bg-[#0d0907] text-[#f4efe6]';
  const sidebarBg = isLight ? 'bg-[#ffffff] border-[#e8dfd3]' : 'bg-[#140e0b] border-[#2a201a]';
  const sidebarHeaderBorder = isLight ? 'border-[#e8dfd3]' : 'border-[#2a201a]';
  const sidebarFooterBg = isLight ? 'bg-[#f7f3eb] border-[#e8dfd3]' : 'bg-[#100b08] border-[#2a201a]';
  const cardBg = isLight ? 'bg-[#ffffff] border-[#e8dfd3] shadow-sm' : 'bg-[#140e0b] border-[#2a201a] shadow-lg';
  const cardHeaderBorder = isLight ? 'border-[#eee7dc]' : 'border-[#261c16]';
  const inputBg = isLight ? 'bg-[#ffffff] border-[#dcd3c5] text-[#1c1510] focus:border-[#b38b40]' : 'bg-[#1a120e] border-[#3a2c23] text-[#faf7f2] focus:border-[#dec29b]';
  const tableHeaderBg = isLight ? 'bg-[#f7f3eb] border-[#e8dfd3] text-[#5c4d40]' : 'bg-[#1a120e] border-[#2a201a] text-[#a89b8c]';
  const tableRowHover = isLight ? 'hover:bg-[#fcfaf7] divide-[#eee7dc]' : 'hover:bg-[#18110d] divide-[#211813]';
  const titleColor = isLight ? 'text-[#1c1510]' : 'text-[#faf7f2]';
  const accentGold = isLight ? 'text-[#a37d38]' : 'text-[#dec29b]';
  const subtitleColor = isLight ? 'text-[#6e5d4f]' : 'text-[#a89b8c]';
  const badgeBg = isLight ? 'bg-[#f4efe6] text-[#8c6b2d] border-[#dfd5c4]' : 'bg-[#211611] text-[#dec29b] border-[#3a2c23]';
  const primaryBtn = isLight ? 'bg-[#b38b40] hover:bg-[#99752b] text-[#ffffff]' : 'bg-[#dec29b] hover:bg-[#c5a059] text-[#140e0b]';

  return (
    <div
      style={{ zoom: '80%' }}
      className={`min-h-screen ${containerBg} flex flex-col md:flex-row font-sans selection:bg-[#c5a059] selection:text-[#ffffff] transition-colors duration-200`}
    >
      {/* MOBILE HEADER BAR */}
      <header className={`md:hidden flex items-center justify-between px-4 py-3 ${sidebarBg} border-b sticky top-0 z-40`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className={`p-2 ${accentGold} hover:bg-[#f4efe6] dark:hover:bg-[#1f1612] rounded-[5px] transition-colors`}
            aria-label="Open Admin Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex flex-col">
            <span className={`font-serif tracking-wider text-sm ${accentGold} uppercase font-bold`}>BHAI JEWELLER</span>
            <span className={`text-[10px] ${subtitleColor} tracking-widest uppercase`}>Admin Portal</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* THEME TOGGLE BUTTON MOBILE */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`px-2.5 py-1.5 rounded-[5px] text-xs font-medium border transition-colors ${
              isLight
                ? 'bg-[#f4efe6] text-[#1c1510] border-[#dcd3c5]'
                : 'bg-[#1f1612] text-[#dec29b] border-[#3a2c23]'
            }`}
          >
            {isLight ? '🌙 Dark' : '☀️ Light'}
          </button>

          <Link
            href="/"
            className={`text-xs px-3 py-1.5 ${
              isLight ? 'bg-[#f4efe6] text-[#1c1510] border-[#dcd3c5]' : 'bg-[#1f1612] text-[#dec29b] border-[#3a2c23]'
            } border rounded-[5px] transition-colors flex items-center space-x-1`}
          >
            <span>Site</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY & SIDEBAR */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className={`relative w-72 max-w-[80vw] ${sidebarBg} border-r flex flex-col h-full z-10 shadow-2xl`}>
            <div className={`p-5 ${sidebarHeaderBorder} border-b flex items-center justify-between`}>
              <div>
                <h1 className={`font-serif text-lg font-bold tracking-wider ${accentGold}`}>BHAI JEWELLER</h1>
                <p className={`text-xs ${subtitleColor} tracking-widest uppercase mt-0.5`}>Admin Environment</p>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className={`${subtitleColor} hover:${accentGold} p-1 rounded-[5px]`}
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[5px] text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? isLight
                        ? 'bg-[#f4efe6] text-[#8c6b2d] border-l-2 border-[#b38b40] font-bold shadow-sm'
                        : 'bg-[#261b15] text-[#dec29b] border-l-2 border-[#dec29b] shadow-md'
                      : isLight
                      ? 'text-[#4a3b2c] hover:bg-[#f7f4ee]'
                      : 'text-[#c2b4a3] hover:bg-[#1a120e] hover:text-[#faf7f2]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className={`text-xs px-2 py-0.5 rounded-[5px] border ${badgeBg}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className={`p-4 ${sidebarFooterBg} border-t`}>
              <Link
                href="/"
                className={`w-full flex items-center justify-center space-x-2 py-2 px-3 ${
                  isLight ? 'bg-[#b38b40] text-white hover:bg-[#99752b]' : 'bg-[#1f1612] text-[#dec29b] border border-[#3a2c23] hover:bg-[#2c201a]'
                } rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-all`}
              >
                <span>Storefront Main Site</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR SLIDER DRAWER */}
      <aside
        className={`hidden md:flex flex-col ${sidebarBg} border-r transition-all duration-300 relative z-30 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className={`p-5 ${sidebarHeaderBorder} border-b flex items-center justify-between`}>
          {sidebarOpen ? (
            <div>
              <h1 className={`font-serif text-lg font-bold tracking-wider ${accentGold}`}>BHAI JEWELLER</h1>
              <p className={`text-[10px] ${subtitleColor} tracking-widest uppercase mt-0.5`}>Admin Management System</p>
            </div>
          ) : (
            <div className={`mx-auto font-serif text-lg font-bold ${accentGold}`}>BJ</div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-[5px] ${subtitleColor} hover:${accentGold} transition-colors`}
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
          </button>
        </div>

        {/* THEME TOGGLE BUTTON DESKTOP SIDEBAR */}
        <div className="px-3 pt-3">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`w-full flex items-center ${
              sidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'
            } py-2.5 rounded-[5px] text-xs font-semibold border transition-all ${
              isLight
                ? 'bg-[#f4efe6] text-[#1c1510] border-[#dcd3c5] hover:bg-[#e8e1d3]'
                : 'bg-[#1f1612] text-[#dec29b] border-[#3a2c23] hover:bg-[#2c201a]'
            }`}
            title="Toggle Admin Theme"
          >
            <div className="flex items-center space-x-2">
              <span className="text-base">{isLight ? '☀️' : '🌙'}</span>
              {sidebarOpen && <span>{isLight ? 'Light Theme (Default)' : 'Dark Theme'}</span>}
            </div>
            {sidebarOpen && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-[5px] bg-[#b38b40] text-white">
                Toggle
              </span>
            )}
          </button>
        </div>

        {/* SIDEBAR NAVIGATION ITEMS */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center ${
                sidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'
              } py-3 rounded-[5px] text-sm font-medium transition-all ${
                activeTab === item.id
                  ? isLight
                    ? 'bg-[#f4efe6] text-[#8c6b2d] border-l-2 border-[#b38b40] font-bold shadow-sm'
                    : 'bg-[#261b15] text-[#dec29b] border-l-2 border-[#dec29b] shadow-md'
                  : isLight
                  ? 'text-[#4a3b2c] hover:bg-[#f7f4ee]'
                  : 'text-[#c2b4a3] hover:bg-[#1a120e] hover:text-[#faf7f2]'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </div>
              {sidebarOpen && item.count !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-[5px] border ${badgeBg}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ADMIN PROFILE FOOTER */}
        <div className={`p-4 ${sidebarFooterBg} border-t flex flex-col space-y-3`}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-[5px] ${isLight ? 'bg-[#b38b40] text-white' : 'bg-[#dec29b] text-[#140e0b]'} font-serif font-bold flex items-center justify-center text-sm`}>
                  AD
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-xs font-semibold ${titleColor} truncate`}>Master Admin</span>
                  <span className={`text-[10px] ${subtitleColor} truncate`}>admin@bhaijeweller.com</span>
                </div>
              </div>
              <Link
                href="/"
                className={`w-full flex items-center justify-center space-x-2 py-2 px-3 ${
                  isLight
                    ? 'bg-[#ffffff] text-[#8c6b2d] border-[#dcd3c5] hover:bg-[#f4efe6]'
                    : 'bg-[#1f1612] text-[#dec29b] border-[#3a2c23] hover:bg-[#2c201a]'
                } border rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-all`}
              >
                <span>Exit Admin</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Link>
            </>
          ) : (
            <Link
              href="/"
              className={`w-full flex justify-center py-2 ${accentGold} hover:bg-opacity-10 rounded-[5px]`}
              title="Exit Admin"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Link>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* TOP STATUS BAR */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b ${cardHeaderBorder} gap-4`}>
          <div>
            <span className={`text-xs uppercase tracking-widest ${accentGold} font-semibold`}>Luxury Management Suite</span>
            <h1 className={`font-serif text-2xl sm:text-3xl ${titleColor} font-semibold tracking-wide capitalize mt-0.5`}>
              {activeTab === 'slides' ? 'Slider & Banner Manager' : activeTab}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            {/* THEME SWITCH BUTTON TOP BAR */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`px-3 py-1.5 rounded-[5px] text-xs font-semibold border flex items-center space-x-1.5 transition-all shadow-sm ${
                isLight
                  ? 'bg-[#ffffff] text-[#1c1510] border-[#dcd3c5] hover:bg-[#f4efe6]'
                  : 'bg-[#1f1612] text-[#dec29b] border-[#3a2c23] hover:bg-[#2c201a]'
              }`}
            >
              <span>{isLight ? '☀️ Light Mode (80% Zoom)' : '🌙 Dark Mode (80% Zoom)'}</span>
            </button>

            <span className={`inline-flex items-center px-3 py-1.5 rounded-[5px] text-xs border ${badgeBg}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Operational
            </span>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className={`px-4 py-2 ${primaryBtn} font-semibold text-xs rounded-[5px] transition-all shadow-md flex items-center space-x-1`}
            >
              <span>+ Add Product</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <ScrollReveal direction="up" delay={100} className="space-y-8">
            {/* KPI METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className={`${cardBg} p-5 rounded-[5px]`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>Total Revenue</p>
                    <p className={`text-2xl sm:text-3xl font-serif ${accentGold} font-bold mt-2`}>${totalRevenue.toLocaleString()}</p>
                  </div>
                  <span className={`p-2 ${isLight ? 'bg-[#f4efe6]' : 'bg-[#211611]'} rounded-[5px] text-lg`}>💰</span>
                </div>
                <div className="mt-4 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>↑ +18.4% from last month</span>
                </div>
              </div>

              <div className={`${cardBg} p-5 rounded-[5px]`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>Active Orders</p>
                    <p className={`text-2xl sm:text-3xl font-serif ${titleColor} font-bold mt-2`}>{activeOrdersCount}</p>
                  </div>
                  <span className={`p-2 ${isLight ? 'bg-[#f4efe6]' : 'bg-[#211611]'} rounded-[5px] text-lg`}>📦</span>
                </div>
                <div className={`mt-4 flex items-center text-xs ${subtitleColor}`}>
                  <span>{orders.length} total orders recorded</span>
                </div>
              </div>

              <div className={`${cardBg} p-5 rounded-[5px]`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>Bespoke Requests</p>
                    <p className={`text-2xl sm:text-3xl font-serif ${accentGold} font-bold mt-2`}>{pendingEnquiriesCount}</p>
                  </div>
                  <span className={`p-2 ${isLight ? 'bg-[#f4efe6]' : 'bg-[#211611]'} rounded-[5px] text-lg`}>✨</span>
                </div>
                <div className="mt-4 flex items-center text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <span>Requires artisan consultation</span>
                </div>
              </div>

              <div className={`${cardBg} p-5 rounded-[5px]`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>Live 24K Gold Rate</p>
                    <p className={`text-2xl sm:text-3xl font-serif ${titleColor} font-bold mt-2`}>Rs. {gold24kRate}</p>
                  </div>
                  <span className={`p-2 ${isLight ? 'bg-[#f4efe6]' : 'bg-[#211611]'} rounded-[5px] text-lg`}>🪙</span>
                </div>
                <div className={`mt-4 flex items-center text-xs ${accentGold}`}>
                  <span>PKR / Gram • Auto-sync on</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS & RECENT ORDERS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders List */}
              <div className={`lg:col-span-2 ${cardBg} rounded-[5px] p-5`}>
                <div className={`flex items-center justify-between mb-4 border-b ${cardHeaderBorder} pb-3`}>
                  <h3 className={`font-serif text-lg ${accentGold} font-semibold`}>Recent Store Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className={`text-xs ${accentGold} hover:underline`}>
                    View All Orders →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b ${cardHeaderBorder} ${subtitleColor} uppercase tracking-wider`}>
                        <th className="pb-2">Order ID</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${tableRowHover}`}>
                      {orders.slice(0, 4).map((o) => (
                        <tr key={o.id} className="transition-colors">
                          <td className={`py-3 font-mono font-medium ${accentGold}`}>{o.id}</td>
                          <td className={`py-3 font-medium ${titleColor}`}>{o.customer}</td>
                          <td className={`py-3 font-semibold ${accentGold}`}>${o.amount}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold uppercase ${
                              o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' :
                              o.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800' :
                              'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Slider & Quick Banner Control Panel */}
              <div className={`${cardBg} rounded-[5px] p-5 flex flex-col justify-between`}>
                <div>
                  <div className={`flex items-center justify-between mb-3 border-b ${cardHeaderBorder} pb-3`}>
                    <h3 className={`font-serif text-lg ${accentGold} font-semibold`}>Active Banners</h3>
                    <span className={`text-xs ${badgeBg} px-2 py-0.5 rounded-[5px]`}>
                      {slides.filter(s => s.status === 'Active').length} Active
                    </span>
                  </div>
                  <p className={`text-xs ${subtitleColor} mb-4`}>
                    Manage storefront hero slider slides, subtitles, and call-to-action buttons.
                  </p>
                  <div className="space-y-3">
                    {slides.map(slide => (
                      <div key={slide.id} className={`p-3 ${isLight ? 'bg-[#f9f6f0] border-[#e8dfd1]' : 'bg-[#1a120e] border-[#2c201a]'} border rounded-[5px] flex items-center justify-between`}>
                        <div className="truncate pr-2">
                          <p className={`text-xs font-semibold ${titleColor} truncate`}>{slide.title}</p>
                          <p className={`text-[10px] ${subtitleColor} uppercase`}>{slide.status}</p>
                        </div>
                        <button
                          onClick={() => toggleSlideStatus(slide.id)}
                          className={`text-[10px] px-2 py-1 rounded-[5px] font-semibold transition-colors ${
                            slide.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          }`}
                        >
                          {slide.status === 'Active' ? 'Hide' : 'Publish'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('slides')}
                  className={`mt-6 w-full py-2 ${
                    isLight ? 'bg-[#f4efe6] text-[#8c6b2d] border-[#dcd3c5] hover:bg-[#e8e1d3]' : 'bg-[#1f1612] text-[#dec29b] border-[#3a2c23] hover:bg-[#2c201a]'
                  } border rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-colors`}
                >
                  Manage Slider Banners →
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* TAB 2: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg} p-4 rounded-[5px]`}>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`text-xs px-3 py-2 rounded-[5px] focus:outline-none w-full sm:w-64 ${inputBg}`}
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`text-xs ${subtitleColor}`}>Category:</span>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className={`text-xs px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                >
                  <option value="All">All Categories</option>
                  <option value="Rings">Rings</option>
                  <option value="Necklaces">Necklaces</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bracelets">Bracelets</option>
                </select>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className={`px-4 py-2 ${primaryBtn} font-semibold text-xs rounded-[5px] transition-all`}
                >
                  + Add Product
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className={`${cardBg} rounded-[5px] overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`${tableHeaderBg} uppercase tracking-wider font-semibold`}>
                    <tr>
                      <th className="p-4">Product Info</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Metal Spec</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${tableRowHover}`}>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="transition-colors">
                        <td className="p-4 flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-[5px] overflow-hidden bg-[#e8dfd1] dark:bg-[#211611] flex-shrink-0 border border-[#dcd3c5] dark:border-[#3a2c23]">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className={`font-semibold ${titleColor}`}>{p.name}</p>
                            <p className={`text-[10px] ${subtitleColor}`}>{p.id}</p>
                          </div>
                        </td>
                        <td className={`p-4 font-mono ${subtitleColor}`}>{p.sku}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 border rounded-[5px] text-[10px] ${badgeBg}`}>
                            {p.category}
                          </span>
                        </td>
                        <td className={`p-4 ${subtitleColor}`}>{p.metal}</td>
                        <td className={`p-4 font-semibold ${accentGold}`}>${p.price.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold ${
                            p.stock > 5 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            p.stock > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          }`}>
                            {p.stock} units ({p.status})
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-950/80 dark:hover:bg-red-900 dark:text-red-200 rounded-[5px] text-[10px] transition-colors border border-red-300 dark:border-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* TAB 3: ADMIN ENVIRONMENT SLIDER & BANNER MANAGER */}
        {activeTab === 'slides' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg} p-5 rounded-[5px]`}>
              <div>
                <h2 className={`font-serif text-lg font-semibold ${accentGold}`}>Homepage Banner & Hero Slider Controls</h2>
                <p className={`text-xs ${subtitleColor}`}>Add, edit, toggle visibility, and reorder full-width banner slides for the storefront.</p>
              </div>
              <button
                onClick={() => setIsAddSlideOpen(true)}
                className={`px-4 py-2 ${primaryBtn} font-semibold text-xs rounded-[5px] transition-all shadow-md`}
              >
                + Add New Hero Slide
              </button>
            </div>

            {/* Slide Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide) => (
                <div key={slide.id} className={`${cardBg} rounded-[5px] overflow-hidden flex flex-col justify-between`}>
                  <div>
                    {/* Slide Image Preview */}
                    <div className="relative w-full h-44 bg-[#e8dfd1] dark:bg-[#1a120e] border-b border-[#e8dfd1] dark:border-[#2a201a]">
                      <Image src={slide.image} alt={slide.title} fill className="object-cover opacity-90" />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2.5 py-1 rounded-[5px] text-[10px] font-semibold uppercase tracking-wider ${
                          slide.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-700'
                        }`}>
                          {slide.status}
                        </span>
                      </div>
                      <div className={`absolute bottom-2 left-2 ${isLight ? 'bg-white/90 text-[#8c6b2d] border-[#e8dfd1]' : 'bg-[#140e0b]/90 text-[#dec29b] border-[#3a2c23]'} px-2 py-0.5 rounded-[5px] text-[10px] font-mono border`}>
                        Order #{slide.order}
                      </div>
                    </div>
                    {/* Slide Content */}
                    <div className="p-4 space-y-2">
                      <h3 className={`font-serif font-bold ${titleColor} text-sm leading-snug`}>{slide.title}</h3>
                      <p className={`text-xs ${subtitleColor} line-clamp-2`}>{slide.subtitle}</p>
                      <div className={`pt-2 text-[10px] ${accentGold} flex items-center space-x-2`}>
                        <span className={`px-2 py-0.5 border rounded-[5px] ${badgeBg}`}>CTA: {slide.ctaText}</span>
                        <span className={`truncate ${subtitleColor}`}>→ {slide.ctaLink}</span>
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className={`p-4 border-t ${cardHeaderBorder} ${isLight ? 'bg-[#fdfbf7]' : 'bg-[#100b08]'} flex items-center justify-between gap-2`}>
                    <button
                      onClick={() => toggleSlideStatus(slide.id)}
                      className={`flex-1 py-1.5 rounded-[5px] text-xs font-semibold transition-colors border ${
                        slide.status === 'Active'
                          ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-[#1f1612] dark:text-amber-300 dark:border-amber-900/50'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {slide.status === 'Active' ? 'Deactivate Slide' : 'Publish Live'}
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-200 rounded-[5px] text-xs transition-colors border border-red-300 dark:border-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* TAB 4: ORDERS & SALES */}
        {activeTab === 'orders' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg} p-4 rounded-[5px]`}>
              <span className={`text-xs ${subtitleColor}`}>Filter Status:</span>
              <div className="flex items-center space-x-2">
                {['All', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all ${
                      orderStatusFilter === st
                        ? isLight ? 'bg-[#b38b40] text-white font-bold' : 'bg-[#dec29b] text-[#140e0b] font-bold'
                        : isLight ? 'bg-[#f4efe6] text-[#5c4d40] border border-[#dcd3c5]' : 'bg-[#1a120e] text-[#c2b4a3] border border-[#3a2c23]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className={`${cardBg} rounded-[5px] p-4 flex flex-col justify-between space-y-3 transition-all hover:border-[#b38b40]`}>
                  {/* Order Box Header */}
                  <div className="flex items-center justify-between border-b pb-2.5 border-opacity-30 border-current">
                    <span className={`font-mono text-xs font-bold ${accentGold}`}>{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-[5px] text-[9px] font-semibold uppercase ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Customer & Details */}
                  <div className="space-y-1 text-xs">
                    <p className={`font-semibold ${titleColor} truncate`} title={order.customer}>{order.customer}</p>
                    <p className={`text-[10px] ${subtitleColor} truncate`} title={order.email}>{order.email}</p>
                    <p className={`text-[10px] ${subtitleColor} pt-1 truncate`} title={order.items}>
                      <span className="font-semibold text-opacity-80">Item:</span> {order.items}
                    </p>
                    <p className={`text-[10px] ${subtitleColor} truncate`} title={order.address}>
                      <span className="font-semibold text-opacity-80">Address:</span> {order.address}
                    </p>
                  </div>

                  {/* Price & Date */}
                  <div className="pt-2 border-t border-opacity-20 border-current flex items-end justify-between">
                    <div>
                      <p className={`text-[9px] ${subtitleColor} uppercase`}>{order.date}</p>
                      <p className={`text-[9px] ${subtitleColor}`}>{order.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-serif ${accentGold} font-bold`}>${order.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1 flex flex-wrap gap-1">
                    {order.status !== 'Processing' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Processing')}
                        className={`flex-1 py-1 px-1.5 border rounded-[5px] text-[9px] font-semibold text-center transition-colors ${
                          isLight ? 'bg-[#f4efe6] text-[#8c6b2d] border-[#dcd3c5]' : 'bg-[#1f1612] text-[#dec29b] border-[#3a2c23]'
                        }`}
                      >
                        Processing
                      </button>
                    )}
                    {order.status !== 'Shipped' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                        className="flex-1 py-1 px-1.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border border-blue-300 dark:border-blue-800 rounded-[5px] text-[9px] font-semibold text-center transition-colors"
                      >
                        Shipped
                      </button>
                    )}
                    {order.status !== 'Delivered' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                        className="flex-1 py-1 px-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 rounded-[5px] text-[9px] font-semibold text-center transition-colors"
                      >
                        Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* TAB 5: BESPOKE ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div key={enq.id} className={`${cardBg} rounded-[5px] p-5 space-y-4`}>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b ${cardHeaderBorder} pb-3 gap-2`}>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-mono text-xs ${accentGold} font-bold`}>{enq.id}</span>
                        <span className={`text-xs ${subtitleColor}`}>• {enq.date}</span>
                        <span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold uppercase ${
                          enq.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          enq.status === 'In Design' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                      <h3 className={`font-serif font-semibold text-lg ${titleColor} mt-1`}>{enq.name}</h3>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className={`text-xs ${subtitleColor}`}>Estimated Budget</p>
                      <p className={`text-sm font-semibold ${accentGold}`}>{enq.budget}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className={subtitleColor}>Service Requested:</p>
                      <p className={`font-medium ${titleColor}`}>{enq.service}</p>
                    </div>
                    <div>
                      <p className={subtitleColor}>Contact Info:</p>
                      <p className={`font-medium ${titleColor}`}>{enq.email}</p>
                      <p className={`font-medium ${accentGold}`}>{enq.phone}</p>
                    </div>
                    <div>
                      <p className={subtitleColor}>Design Notes:</p>
                      <p className={`italic ${subtitleColor}`}>"{enq.message}"</p>
                    </div>
                  </div>

                  <div className={`flex flex-wrap items-center justify-between pt-3 border-t ${cardHeaderBorder} gap-2`}>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-[5px] text-xs transition-colors flex items-center space-x-1"
                      >
                        <span>WhatsApp Client</span>
                      </a>
                      <a
                        href={`mailto:${enq.email}`}
                        className={`px-3 py-1 border rounded-[5px] text-xs transition-colors ${
                          isLight ? 'bg-[#f4efe6] text-[#8c6b2d] border-[#dcd3c5]' : 'bg-[#1f1612] text-[#dec29b] border-[#3a2c23]'
                        }`}
                      >
                        Send Email
                      </a>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] ${subtitleColor}`}>Status:</span>
                      <button
                        onClick={() => handleUpdateEnquiryStatus(enq.id, 'In Design')}
                        className="px-2.5 py-1 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-800 rounded-[5px] text-[10px] transition-colors"
                      >
                        In Design
                      </button>
                      <button
                        onClick={() => handleUpdateEnquiryStatus(enq.id, 'Completed')}
                        className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 rounded-[5px] text-[10px] transition-colors"
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* TAB 6: VIP CUSTOMERS */}
        {activeTab === 'customers' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            <div className={`${cardBg} rounded-[5px] overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`${tableHeaderBg} uppercase tracking-wider font-semibold`}>
                    <tr>
                      <th className="p-4">Customer ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Total Orders</th>
                      <th className="p-4">Lifetime Spend</th>
                      <th className="p-4">VIP Tier</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${tableRowHover}`}>
                    {customers.map((c) => (
                      <tr key={c.id} className="transition-colors">
                        <td className={`p-4 font-mono ${accentGold} font-bold`}>{c.id}</td>
                        <td className={`p-4 font-semibold ${titleColor}`}>{c.name}</td>
                        <td className={`p-4 ${subtitleColor}`}>{c.email}</td>
                        <td className={`p-4 ${titleColor} font-semibold`}>{c.totalOrders}</td>
                        <td className={`p-4 font-serif ${accentGold} font-bold`}>${c.totalSpent.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 border rounded-[5px] text-[10px] font-semibold ${badgeBg}`}>
                            ✨ {c.tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* TAB 7: LIVE GOLD RATE MANAGER */}
        {activeTab === 'goldrates' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            <div className={`${cardBg} rounded-[5px] p-6 max-w-2xl mx-auto space-y-6`}>
              <div>
                <h2 className={`font-serif text-xl font-bold ${accentGold}`}>Live Gold Bullion Pricing Engine</h2>
                <p className={`text-xs ${subtitleColor} mt-1`}>
                  Adjust per-gram rates in PKR to update catalog prices automatically across the entire site.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${subtitleColor} mb-1 font-semibold`}>
                    24K Pure Gold Rate (PKR / Gram)
                  </label>
                  <input
                    type="text"
                    value={gold24kRate}
                    onChange={(e) => setGold24kRate(e.target.value)}
                    className={`w-full text-sm px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs uppercase tracking-wider ${subtitleColor} mb-1 font-semibold`}>
                    22K Jewelry Gold Rate (PKR / Gram)
                  </label>
                  <input
                    type="text"
                    value={gold22kRate}
                    onChange={(e) => setGold22kRate(e.target.value)}
                    className={`w-full text-sm px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>

                <div className={`p-4 ${isLight ? 'bg-[#f7f3eb] border-[#e8dfd3]' : 'bg-[#1a120e] border-[#2c201a]'} border rounded-[5px] text-xs ${subtitleColor}`}>
                  <p className={`font-semibold ${accentGold} mb-1`}>💡 Automated Pricing Formula:</p>
                  <p>Catalog price = (Gold Weight × 22K Rate) + Artisan Making Charges + Diamond Carat Value.</p>
                </div>

                <button
                  onClick={() => alert("Gold Rates Updated Live!")}
                  className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all shadow-md`}
                >
                  Save & Push Gold Rates Live
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* TAB 8: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            <div className={`${cardBg} rounded-[5px] p-6 max-w-2xl mx-auto space-y-6`}>
              <h2 className={`font-serif text-xl font-bold ${accentGold}`}>Storewide Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${subtitleColor} mb-1 font-semibold`}>
                    Free Shipping Threshold ($)
                  </label>
                  <input
                    type="text"
                    value={shippingThreshold}
                    onChange={(e) => setShippingThreshold(e.target.value)}
                    className={`w-full text-sm px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs uppercase tracking-wider ${subtitleColor} mb-1 font-semibold`}>
                    Announcement Top Banner Text
                  </label>
                  <textarea
                    rows={2}
                    value={noticeBanner}
                    onChange={(e) => setNoticeBanner(e.target.value)}
                    className={`w-full text-sm px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>

                <button
                  onClick={() => alert("Store settings updated successfully!")}
                  className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all shadow-md`}
                >
                  Update Store Configuration
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}
      </main>

      {/* MODAL: ADD PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`${cardBg} rounded-[5px] max-w-md w-full p-6 shadow-2xl space-y-4`}>
            <div className={`flex justify-between items-center border-b ${cardHeaderBorder} pb-3`}>
              <h3 className={`font-serif text-lg ${accentGold} font-bold`}>Add New Luxury Item</h3>
              <button onClick={() => setIsAddProductOpen(false)} className={`${subtitleColor} hover:${titleColor}`}>✕</button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className={`block ${subtitleColor} mb-1`}>Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Ruby Ring"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block ${subtitleColor} mb-1`}>Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                  >
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                  </select>
                </div>
                <div>
                  <label className={`block ${subtitleColor} mb-1`}>Metal Purity</label>
                  <input
                    type="text"
                    value={newProduct.metal}
                    onChange={(e) => setNewProduct({ ...newProduct, metal: e.target.value })}
                    className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block ${subtitleColor} mb-1`}>Price ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="1200"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>
                <div>
                  <label className={`block ${subtitleColor} mb-1`}>Stock Qty</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className={`px-4 py-2 ${isLight ? 'bg-[#f4efe6] text-[#5c4d40]' : 'bg-[#1f1612] text-[#c2b4a3]'} border border-opacity-50 rounded-[5px]`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${primaryBtn} font-bold rounded-[5px]`}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD HERO SLIDE */}
      {isAddSlideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`${cardBg} rounded-[5px] max-w-md w-full p-6 shadow-2xl space-y-4`}>
            <div className={`flex justify-between items-center border-b ${cardHeaderBorder} pb-3`}>
              <h3 className={`font-serif text-lg ${accentGold} font-bold`}>Add Hero Slide Banner</h3>
              <button onClick={() => setIsAddSlideOpen(false)} className={`${subtitleColor} hover:${titleColor}`}>✕</button>
            </div>
            <form onSubmit={handleAddSlide} className="space-y-3 text-xs">
              <div>
                <label className={`block ${subtitleColor} mb-1`}>Slide Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Emerald Collection"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                />
              </div>
              <div>
                <label className={`block ${subtitleColor} mb-1`}>Subtitle / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted gold set with certified emeralds"
                  value={newSlide.subtitle}
                  onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block ${subtitleColor} mb-1`}>CTA Button Text</label>
                  <input
                    type="text"
                    value={newSlide.ctaText}
                    onChange={(e) => setNewSlide({ ...newSlide, ctaText: e.target.value })}
                    className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>
                <div>
                  <label className={`block ${subtitleColor} mb-1`}>CTA Target Link</label>
                  <input
                    type="text"
                    value={newSlide.ctaLink}
                    onChange={(e) => setNewSlide({ ...newSlide, ctaLink: e.target.value })}
                    className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>
              <div>
                <label className={`block ${subtitleColor} mb-1`}>Slide Image URL</label>
                <input
                  type="text"
                  value={newSlide.image}
                  onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                  className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddSlideOpen(false)}
                  className={`px-4 py-2 ${isLight ? 'bg-[#f4efe6] text-[#5c4d40]' : 'bg-[#1f1612] text-[#c2b4a3]'} border border-opacity-50 rounded-[5px]`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${primaryBtn} font-bold rounded-[5px]`}
                >
                  Publish Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
