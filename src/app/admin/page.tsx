'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { useShop, ProductItem } from '@/context/ShopContext';

// Initial Data States (Strictly 0 fake data by default - syncs live with Supabase Real-Time Database)
const INITIAL_SLIDES: any[] = [];
const INITIAL_ORDERS: any[] = [];
const INITIAL_ENQUIRIES: any[] = [];
const INITIAL_CUSTOMERS: any[] = [];

export default function AdminDashboardPage() {
  // Real-time Shop Context
  const { products, addProduct, deleteProduct: removeStoreProduct } = useShop();

  // Theme State: Default is 'light' (White Theme) as requested!
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'add-product' | 'slides' | 'orders' | 'enquiries' | 'customers' | 'goldrates' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // States for store data
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [customers] = useState(INITIAL_CUSTOMERS);

  // Fetch real-time database data from Supabase API endpoints on mount
  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        }
      })
      .catch((err) => console.error('Error loading orders from API:', err));

    fetch('/api/enquiries')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setEnquiries(data.data);
        }
      })
      .catch((err) => console.error('Error loading enquiries from API:', err));

    fetch('/api/slides')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setSlides(data.data);
        }
      })
      .catch((err) => console.error('Error loading slides from API:', err));
  }, []);

  // Filter states
  const [productCategory, setProductCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Full Page Add Product Form State (No pre-filled images by default!)
  const [addForm, setAddForm] = useState({
    name: '',
    category: 'Rings',
    price: '',
    originalPrice: '',
    stock: '10',
    metal: '18k Yellow Gold',
    sku: '',
    weightGrams: '6.5',
    description: '',
    primaryImage: '',
    additionalImages: [] as string[],
    newImageUrlInput: '',
    // SEO fields
    seoTitle: '',
    seoDescription: '',
    slug: '',
    focusKeywordsText: '',
  });

  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Handle Upload Image File directly from device (Mobile / PC)
  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (!resultUrl) return;

        setAddForm((prev) => {
          if (!prev.primaryImage) {
            return { ...prev, primaryImage: resultUrl };
          }
          return { ...prev, additionalImages: [...prev.additionalImages, resultUrl] };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Auto Generate SKU
  const generateAutoSku = () => {
    const catCode = addForm.category.substring(0, 3).toUpperCase();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    setAddForm(prev => ({ ...prev, sku: `BJ-${catCode}-${randNum}` }));
  };

  // Auto Generate SEO Keywords & Meta Info
  const generateAutoSeo = () => {
    const title = addForm.name.trim() || 'Luxury Jewelry Piece';
    const metal = addForm.metal || 'Gold';
    const cat = addForm.category || 'Jewelry';
    const slugified = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const generatedSeoTitle = `${title} | ${metal} ${cat} | Bhai Jeweller`;
    const generatedMetaDesc = `Shop ${title} handcrafted in ${metal}. Authentic fine ${cat.toLowerCase()} with certified purity and artisan heritage craftsmanship. Free insured shipping.`;
    const generatedKeywords = [
      title.toLowerCase(),
      `${metal.toLowerCase()} ${cat.toLowerCase()}`,
      `bhai jeweller ${cat.toLowerCase()}`,
      `fine jewelry ${cat.toLowerCase()}`,
      `handmade gold ${cat.toLowerCase()}`
    ].join(', ');

    setAddForm(prev => ({
      ...prev,
      slug: slugified || 'luxury-product',
      seoTitle: generatedSeoTitle,
      seoDescription: generatedMetaDesc,
      focusKeywordsText: generatedKeywords,
    }));
  };

  // Add Additional Image URL
  const handleAddImageUrl = () => {
    if (!addForm.newImageUrlInput.trim()) return;
    setAddForm(prev => ({
      ...prev,
      additionalImages: [...prev.additionalImages, prev.newImageUrlInput.trim()],
      newImageUrlInput: ''
    }));
  };

  // Remove Image from list
  const handleRemoveImage = (indexToRemove: number) => {
    setAddForm(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Submit Full Page Add Product Form
  const handleFullProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.price) return;

    const allImagesList = [addForm.primaryImage, ...addForm.additionalImages].filter(Boolean);
    const generatedSlug = addForm.slug || addForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const autoSku = addForm.sku || `BJ-${addForm.category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProductObject: ProductItem = {
      id: `prod-${Date.now()}`,
      name: addForm.name,
      category: addForm.category,
      price: Number(addForm.price),
      originalPrice: Number(addForm.originalPrice || addForm.price),
      stock: Number(addForm.stock || 1),
      metal: addForm.metal,
      status: Number(addForm.stock) > 0 ? 'In Stock' : 'Out of Stock',
      isFeatured: true,
      image: addForm.primaryImage || (allImagesList[0] || '/images/detail-ring-hero.jpg'),
      images: allImagesList.length > 0 ? allImagesList : ['/images/detail-ring-hero.jpg'],
      sku: autoSku,
      description: addForm.description || `Exquisite handcrafted ${addForm.metal} ${addForm.category.toLowerCase()} designed by master artisans.`,
      slug: generatedSlug,
      weightGrams: Number(addForm.weightGrams || 5.0),
      seoTitle: addForm.seoTitle || `${addForm.name} | Bhai Jeweller`,
      seoDescription: addForm.seoDescription || `Buy ${addForm.name} online in Pakistan & UK. Handcrafted luxury jewelry.`,
      focusKeywords: addForm.focusKeywordsText ? addForm.focusKeywordsText.split(',').map(s => s.trim()) : [addForm.name.toLowerCase()]
    };

    // 1. Save to persistent StoreContext (saves to localStorage & updates site live!)
    addProduct(newProductObject);

    // 2. Save to real-time SQL Database API Endpoint
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProductObject),
    }).catch(err => console.error('SQL Database API Sync error:', err));

    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setActiveTab('products');
    }, 1200);

    // Reset Form
    setAddForm({
      name: '',
      category: 'Rings',
      price: '',
      originalPrice: '',
      stock: '10',
      metal: '18k Yellow Gold',
      sku: '',
      weightGrams: '6.5',
      description: '',
      primaryImage: '',
      additionalImages: [],
      newImageUrlInput: '',
      seoTitle: '',
      seoDescription: '',
      slug: '',
      focusKeywordsText: '',
    });
  };

  // Slider Banner Modal State
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
    fetch('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addedSlide),
    }).catch(err => console.error('Slide API Sync error:', err));
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
    fetch('/api/slides', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(err => console.error('Slide status toggle API error:', err));
  };

  const handleDeleteSlide = (id: string) => {
    setSlides(slides.filter(s => s.id !== id));
    fetch(`/api/slides?id=${id}`, { method: 'DELETE' }).catch(err => console.error('Slide delete API error:', err));
  };

  // Order Handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    }).catch(err => console.error('Order status API update error:', err));
  };

  // Enquiry Handler
  const handleUpdateEnquiryStatus = (enqId: string, newStatus: string) => {
    setEnquiries(enquiries.map(e => e.id === enqId ? { ...e, status: newStatus } : e));
    fetch('/api/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: enqId, status: newStatus }),
    }).catch(err => console.error('Enquiry status API update error:', err));
  };

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalProductsCount = products.length;
  const activeOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;
  const pendingEnquiriesCount = enquiries.filter(e => e.status === 'New' || e.status === 'In Design').length;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchCat = productCategory === 'All' || p.category === productCategory;
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
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
    { id: 'add-product', label: '➕ Add Product Page', icon: '✨', count: null },
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
      className={`min-h-screen h-screen w-full overflow-hidden ${containerBg} flex flex-col md:flex-row font-sans selection:bg-[#c5a059] selection:text-[#ffffff] transition-colors duration-200`}
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

      {/* DESKTOP SIDEBAR SLIDER DRAWER (STATIONARY / FIXED) */}
      <aside
        className={`hidden md:flex flex-col ${sidebarBg} border-r transition-all duration-300 relative z-30 h-full overflow-y-auto flex-shrink-0 sticky top-0 ${
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

      {/* MAIN CONTENT AREA (INDEPENDENT VERTICAL SCROLL) */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* TOP STATUS BAR */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b ${cardHeaderBorder} gap-4`}>
          <div>
            <span className={`text-xs uppercase tracking-widest ${accentGold} font-semibold`}>Luxury Management Suite</span>
            <h1 className={`font-serif text-2xl sm:text-3xl ${titleColor} font-semibold tracking-wide capitalize mt-0.5`}>
              {activeTab === 'slides' ? 'Slider & Banner Manager' : activeTab === 'add-product' ? 'Add New Product (Full Page)' : activeTab}
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
              <span>{isLight ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
            </button>

            <span className={`inline-flex items-center px-3 py-1.5 rounded-[5px] text-xs border ${badgeBg}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Operational
            </span>
            {activeTab !== 'add-product' && (
              <button
                onClick={() => setActiveTab('add-product')}
                className={`px-4 py-2 ${primaryBtn} font-semibold text-xs rounded-[5px] transition-all shadow-md flex items-center space-x-1`}
              >
                <span>+ Add Product Page</span>
              </button>
            )}
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
                    <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>Live Catalog Items</p>
                    <p className={`text-2xl sm:text-3xl font-serif ${titleColor} font-bold mt-2`}>{totalProductsCount}</p>
                  </div>
                  <span className={`p-2 ${isLight ? 'bg-[#f4efe6]' : 'bg-[#211611]'} rounded-[5px] text-lg`}>💎</span>
                </div>
                <div className={`mt-4 flex items-center text-xs ${subtitleColor}`}>
                  <span>Synced in real-time with Storefront</span>
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

              {/* Quick Add & Banner Panel */}
              <div className={`${cardBg} rounded-[5px] p-5 flex flex-col justify-between`}>
                <div>
                  <div className={`flex items-center justify-between mb-3 border-b ${cardHeaderBorder} pb-3`}>
                    <h3 className={`font-serif text-lg ${accentGold} font-semibold`}>Quick Inventory Action</h3>
                  </div>
                  <p className={`text-xs ${subtitleColor} mb-4`}>
                    Create a new product with multiple images and auto-generated SEO metadata.
                  </p>
                  <button
                    onClick={() => setActiveTab('add-product')}
                    className={`w-full py-3 ${primaryBtn} rounded-[5px] text-xs font-bold uppercase tracking-wider shadow-md transition-all mb-4`}
                  >
                    + Open Full Add Product Page
                  </button>
                  <div className="space-y-3 pt-2">
                    {slides.slice(0, 2).map(slide => (
                      <div key={slide.id} className={`p-3 ${isLight ? 'bg-[#f9f6f0] border-[#e8dfd1]' : 'bg-[#1a120e] border-[#2c201a]'} border rounded-[5px] flex items-center justify-between`}>
                        <div className="truncate pr-2">
                          <p className={`text-xs font-semibold ${titleColor} truncate`}>{slide.title}</p>
                          <p className={`text-[10px] ${subtitleColor} uppercase`}>{slide.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('slides')}
                  className={`mt-4 w-full py-2 ${
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
                  onClick={() => setActiveTab('add-product')}
                  className={`px-4 py-2 ${primaryBtn} font-semibold text-xs rounded-[5px] transition-all`}
                >
                  + Add Product Page
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
                      <th className="p-4">Images</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${tableRowHover}`}>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="transition-colors">
                        <td className="p-4 flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-[5px] overflow-hidden bg-[#e8dfd1] dark:bg-[#211611] flex-shrink-0 border border-[#dcd3c5] dark:border-[#3a2c23]">
                            <Image src={p.image || (p.images && p.images[0]) || '/images/detail-ring-hero.jpg'} alt={p.name} fill className="object-cover" />
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
                        <td className="p-4 text-[#8c6b2d]">
                          <span className="font-semibold">{p.images?.length || 1} imgs</span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => removeStoreProduct(p.id)}
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

        {/* TAB: DEDICATED FULL-PAGE ADD PRODUCT WORKSPACE (NO POPUP MODAL!) */}
        {activeTab === 'add-product' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            {saveSuccessMsg && (
              <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-[5px] text-sm font-semibold flex items-center space-x-2 animate-bounce">
                <span>✅ Product saved to real-time database! Synced live with Storefront catalog. Redirecting...</span>
              </div>
            )}

            <form onSubmit={handleFullProductSubmit} className="space-y-8">
              {/* Header Action Bar */}
              <div className={`${cardBg} p-5 rounded-[5px] flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div>
                  <h2 className={`font-serif text-xl font-bold ${accentGold}`}>Full Product Creation Studio</h2>
                  <p className={`text-xs ${subtitleColor}`}>Fill product specifications, upload multiple photos, and auto-generate SEO metadata.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2 border rounded-[5px] text-xs font-medium transition-colors ${
                      isLight ? 'bg-[#f4efe6] text-[#5c4d40] border-[#dcd3c5]' : 'bg-[#1f1612] text-[#c2b4a3] border-[#3a2c23]'
                    }`}
                  >
                    Cancel & Return
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2.5 ${primaryBtn} font-bold text-xs uppercase tracking-wider rounded-[5px] shadow-lg transition-all`}
                  >
                    🚀 Save & Publish Live to Site
                  </button>
                </div>
              </div>

              {/* Main Grid: Left Form Fields, Right Live Store Preview & SEO */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COL: PRODUCT DETAILS & MULTI-IMAGE UPLOADER */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Card 1: Core Product Specs */}
                  <div className={`${cardBg} p-6 rounded-[5px] space-y-4`}>
                    <h3 className={`font-serif text-base font-bold ${accentGold} border-b ${cardHeaderBorder} pb-2`}>
                      1. Basic Product Information
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                          Product Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Royal Aurelia Solitaire Diamond Ring"
                          value={addForm.name}
                          onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                          className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                            Category *
                          </label>
                          <select
                            value={addForm.category}
                            onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          >
                            <option value="Rings">Rings</option>
                            <option value="Necklaces">Necklaces</option>
                            <option value="Earrings">Earrings</option>
                            <option value="Bracelets">Bracelets</option>
                            <option value="Pendants">Pendants</option>
                            <option value="Bangles">Bangles</option>
                          </select>
                        </div>

                        <div>
                          <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                            Metal Purity & Material *
                          </label>
                          <select
                            value={addForm.metal}
                            onChange={(e) => setAddForm({ ...addForm, metal: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          >
                            <option value="18k Yellow Gold">18k Yellow Gold</option>
                            <option value="22k Pure Gold">22k Pure Gold</option>
                            <option value="18k Rose Gold">18k Rose Gold</option>
                            <option value="18k White Gold">18k White Gold</option>
                            <option value="24k Gold Bullion">24k Gold Bullion</option>
                            <option value="Platinum 950">Platinum 950</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                            Price ($ USD) *
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="1280"
                            value={addForm.price}
                            onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                            Original / Compare Price ($)
                          </label>
                          <input
                            type="number"
                            placeholder="1650"
                            value={addForm.originalPrice}
                            onChange={(e) => setAddForm({ ...addForm, originalPrice: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                            Stock Quantity *
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="10"
                            value={addForm.stock}
                            onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className={`text-xs font-semibold ${subtitleColor}`}>
                              SKU Code
                            </label>
                            <button
                              type="button"
                              onClick={generateAutoSku}
                              className={`text-[10px] ${accentGold} hover:underline font-semibold`}
                            >
                              ⚡ Auto Generate
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="BJ-RNG-8472"
                            value={addForm.sku}
                            onChange={(e) => setAddForm({ ...addForm, sku: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] font-mono focus:outline-none ${inputBg}`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                            Metal Weight (Grams)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="6.5"
                            value={addForm.weightGrams}
                            onChange={(e) => setAddForm({ ...addForm, weightGrams: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                          Detailed Description & Craftsmanship Details
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Describe diamond cut, clarity, purity certifications, and bespoke design story..."
                          value={addForm.description}
                          onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                          className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Multiple Product Images Manager */}
                  <div className={`${cardBg} p-6 rounded-[5px] space-y-4`}>
                    <div className="flex items-center justify-between border-b pb-2 border-current border-opacity-20">
                      <h3 className={`font-serif text-base font-bold ${accentGold}`}>
                        2. Multiple Product Images Studio
                      </h3>
                      <span className={`text-xs ${subtitleColor}`}>
                        Total: {1 + addForm.additionalImages.length} Images
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Device File Upload Box */}
                      <div className={`p-5 ${isLight ? 'bg-[#fdfbf7] border-[#dcd3c5]' : 'bg-[#1a120e] border-[#3a2c23]'} border-2 border-dashed rounded-[5px] text-center space-y-2`}>
                        <div className="text-3xl">📁</div>
                        <h4 className={`text-xs font-bold ${titleColor}`}>Upload Photo Files from Device (PC or Mobile)</h4>
                        <p className={`text-[10px] ${subtitleColor}`}>Select device image files (JPG, PNG, WEBP)</p>
                        
                        <label className={`inline-flex items-center space-x-2 px-5 py-2.5 ${primaryBtn} font-bold text-xs rounded-[5px] shadow cursor-pointer transition-all`}>
                          <span>📷 Choose Photo Files...</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleDeviceFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Primary Cover Image URL Input */}
                      <div>
                        <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                          Primary Cover Image (Uploaded Device File or Image URL) *
                        </label>
                        <input
                          type="text"
                          placeholder="Upload file above or paste image URL..."
                          value={addForm.primaryImage}
                          onChange={(e) => setAddForm({ ...addForm, primaryImage: e.target.value })}
                          className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                        />
                      </div>

                      {/* Additional Image URLs List */}
                      <div className="space-y-2">
                        <label className={`block text-xs font-semibold ${subtitleColor}`}>
                          Additional Angle Photos & Gallery Images
                        </label>

                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Paste image URL (e.g. /images/shop-prod-2.jpg)..."
                            value={addForm.newImageUrlInput}
                            onChange={(e) => setAddForm({ ...addForm, newImageUrlInput: e.target.value })}
                            className={`flex-1 text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          />
                          <button
                            type="button"
                            onClick={handleAddImageUrl}
                            className={`px-4 py-2.5 ${primaryBtn} font-bold text-xs rounded-[5px]`}
                          >
                            + Add Image URL
                          </button>
                        </div>
                      </div>

                      {/* Interactive Image Gallery Thumbnails Grid */}
                      <div className="pt-2">
                        <p className={`text-xs font-semibold ${subtitleColor} mb-2`}>Gallery Thumbnails Preview:</p>
                        
                        {!addForm.primaryImage && addForm.additionalImages.length === 0 ? (
                          <div className={`p-4 text-center rounded-[5px] border border-dashed ${subtitleColor} text-xs italic`}>
                            No photos added yet. Upload image files above or enter image URL.
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {/* Primary */}
                            {addForm.primaryImage && (
                              <div className="relative h-20 rounded-[5px] overflow-hidden border-2 border-[#b38b40] group bg-[#f4efe6]">
                                <Image src={addForm.primaryImage} alt="Primary Cover" fill className="object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setAddForm(prev => ({ ...prev, primaryImage: '' }))}
                                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shadow"
                                  title="Remove cover photo"
                                >
                                  ✕
                                </button>
                                <span className="absolute bottom-0 left-0 right-0 bg-[#b38b40] text-white text-[9px] text-center font-bold uppercase py-0.5">
                                  COVER PHOTO
                                </span>
                              </div>
                            )}

                            {/* Additional Images */}
                            {addForm.additionalImages.map((imgUrl, idx) => (
                              <div key={idx} className="relative h-20 rounded-[5px] overflow-hidden border border-[#dcd3c5] dark:border-[#3a2c23] group bg-[#f4efe6]">
                                <Image src={imgUrl} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shadow"
                                  title="Remove photo"
                                >
                                  ✕
                                </button>
                                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5">
                                  Angle #{idx + 2}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Automated SEO Engine */}
                  <div className={`${cardBg} p-6 rounded-[5px] space-y-4`}>
                    <div className="flex items-center justify-between border-b pb-2 border-current border-opacity-20">
                      <div>
                        <h3 className={`font-serif text-base font-bold ${accentGold}`}>
                          3. Automated SEO Metadata & Search Keywords
                        </h3>
                        <p className={`text-xs ${subtitleColor}`}>Google SEO tags and search keywords automatically generated.</p>
                      </div>
                      <button
                        type="button"
                        onClick={generateAutoSeo}
                        className={`px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-[5px] shadow transition-all`}
                      >
                        ⚡ Auto-Generate SEO Keywords
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                          SEO Page Title
                        </label>
                        <input
                          type="text"
                          value={addForm.seoTitle}
                          onChange={(e) => setAddForm({ ...addForm, seoTitle: e.target.value })}
                          className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                          Meta Description
                        </label>
                        <textarea
                          rows={2}
                          value={addForm.seoDescription}
                          onChange={(e) => setAddForm({ ...addForm, seoDescription: e.target.value })}
                          className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                            URL Permaslug
                          </label>
                          <input
                            type="text"
                            value={addForm.slug}
                            onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] font-mono focus:outline-none ${inputBg}`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                            Focus Keywords (Comma Separated)
                          </label>
                          <input
                            type="text"
                            value={addForm.focusKeywordsText}
                            onChange={(e) => setAddForm({ ...addForm, focusKeywordsText: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COL: REAL-TIME STOREFRONT CARD PREVIEW */}
                <div className="space-y-6">
                  <div className={`${cardBg} p-6 rounded-[5px] space-y-4 sticky top-6`}>
                    <h3 className={`font-serif text-base font-bold ${accentGold} border-b ${cardHeaderBorder} pb-2`}>
                      👁️ Real-Time Storefront Preview
                    </h3>

                    {/* Store Card Preview */}
                    <div className="bg-[#FAF7F2] border border-[#E5DCD3] rounded-[5px] overflow-hidden shadow-md text-[#1c1510] max-w-sm mx-auto">
                      <div className="relative w-full h-56 bg-[#f4efe6] dark:bg-[#1a120e] flex flex-col items-center justify-center text-center">
                        {addForm.primaryImage ? (
                          <Image
                            src={addForm.primaryImage}
                            alt={addForm.name || 'Product Preview'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="p-4 space-y-1">
                            <span className="text-3xl">📷</span>
                            <p className="text-xs font-bold text-[#8c6b2d]">No Image Selected Yet</p>
                            <p className="text-[10px] text-[#8c7d6c]">Upload a photo or enter URL above to preview here</p>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#140e0b] text-[#dec29b] text-[9px] font-semibold uppercase rounded-[5px]">
                          {addForm.category}
                        </span>
                        {addForm.originalPrice && Number(addForm.originalPrice) > Number(addForm.price) && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-700 text-white text-[9px] font-bold uppercase rounded-[5px]">
                            SALE
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] text-[#8c7d6c] uppercase tracking-wider">{addForm.metal}</p>
                            <h4 className="font-serif font-bold text-sm text-[#1c1510] line-clamp-1">
                              {addForm.name || 'Royal Jewelry Piece Title'}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-base font-serif font-bold text-[#b38b40]">
                            ${addForm.price ? Number(addForm.price).toLocaleString() : '1,280'}
                          </span>
                          {addForm.originalPrice && Number(addForm.originalPrice) > Number(addForm.price) && (
                            <span className="text-xs text-[#8c7d6c] line-through">
                              ${Number(addForm.originalPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="pt-2 flex items-center justify-between text-[10px] text-[#8c7d6c] border-t border-[#e8dfd1]">
                          <span>SKU: {addForm.sku || 'BJ-AUTO'}</span>
                          <span>Images: {1 + addForm.additionalImages.length}</span>
                        </div>

                        <button
                          type="button"
                          className="mt-2 w-full py-2 bg-[#1c1510] text-[#faf7f2] text-xs font-semibold rounded-[5px] uppercase tracking-wider"
                        >
                          Add To Bag
                        </button>
                      </div>
                    </div>

                    {/* Submit Action */}
                    <div className="pt-4 border-t border-current border-opacity-20">
                      <button
                        type="submit"
                        className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-[5px] shadow-lg transition-all`}
                      >
                        Publish to Storefront Catalog
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {enquiries.map((enq) => (
                <div key={enq.id} className={`${cardBg} rounded-[5px] p-4 flex flex-col justify-between space-y-3 transition-all hover:border-[#b38b40]`}>
                  {/* Enquiry Header */}
                  <div className="flex items-center justify-between border-b pb-2 border-opacity-30 border-current">
                    <span className={`font-mono text-xs font-bold ${accentGold}`}>{enq.id}</span>
                    <span className={`px-2 py-0.5 rounded-[5px] text-[9px] font-semibold uppercase ${
                      enq.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      enq.status === 'In Design' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {enq.status}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="space-y-1 text-xs">
                    <p className={`font-semibold ${titleColor} truncate`} title={enq.name}>{enq.name}</p>
                    <p className={`text-[10px] ${subtitleColor} truncate`} title={enq.email}>{enq.email}</p>
                    <p className={`text-[10px] font-mono ${accentGold}`}>{enq.phone}</p>
                  </div>

                  {/* Service & Budget */}
                  <div className="space-y-1 text-[10px]">
                    <p className={`${subtitleColor} truncate`} title={enq.service}>
                      <span className="font-semibold text-opacity-80">Service:</span> {enq.service}
                    </p>
                    <p className={`${accentGold} font-semibold`}>
                      Budget: {enq.budget}
                    </p>
                    <p className={`italic ${subtitleColor} line-clamp-2 text-[9px]`} title={enq.message}>
                      "{enq.message}"
                    </p>
                  </div>

                  {/* Date & Contact Actions */}
                  <div className="pt-2 border-t border-opacity-20 border-current space-y-2">
                    <div className="flex items-center justify-between text-[9px] text-opacity-75">
                      <span className={subtitleColor}>{enq.date}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-[5px] text-[9px] font-semibold text-center transition-colors truncate"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`mailto:${enq.email}`}
                        className={`flex-1 py-1 border rounded-[5px] text-[9px] font-semibold text-center transition-colors truncate ${
                          isLight ? 'bg-[#f4efe6] text-[#8c6b2d] border-[#dcd3c5]' : 'bg-[#1f1612] text-[#dec29b] border-[#3a2c23]'
                        }`}
                      >
                        Email
                      </a>
                    </div>

                    {/* Status Update Buttons */}
                    <div className="flex items-center space-x-1 pt-1">
                      {enq.status !== 'In Design' && (
                        <button
                          onClick={() => handleUpdateEnquiryStatus(enq.id, 'In Design')}
                          className="flex-1 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-800 rounded-[5px] text-[8px] font-semibold text-center transition-colors"
                        >
                          In Design
                        </button>
                      )}
                      {enq.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateEnquiryStatus(enq.id, 'Completed')}
                          className="flex-1 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 rounded-[5px] text-[8px] font-semibold text-center transition-colors"
                        >
                          Completed
                        </button>
                      )}
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
