'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/shared/ScrollReveal';

// Initial Mock Products Data
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

// Initial Mock Orders Data
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
    name: 'Camilla Vance',
    email: 'camilla.v@example.com',
    phone: '+44 7700 900456',
    service: 'Bridal Set Consultation',
    budget: '$5,000+',
    date: '2026-09-24',
    message: 'Requesting a private consultation at Bradford Showroom for bridal jewelry set.',
    status: 'Contacted',
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'enquiries' | 'settings'>('overview');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // New Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Rings',
    price: '',
    originalPrice: '',
    stock: '10',
    metal: '18k Yellow Gold',
    image: '/images/detail-ring-hero.jpg',
  });

  // Settings State
  const [goldRate24K, setGoldRate24K] = useState('78.40');
  const [goldRate22K, setGoldRate22K] = useState('71.80');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('150');
  const [announcementText, setAnnouncementText] = useState('Complimentary Express Worldwide Shipping on Orders Over $150');

  // Calculate Overview Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Processing').length;
  const totalProductsCount = products.length;

  // Handlers
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const created = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : Number(newProduct.price) * 1.2,
      stock: Number(newProduct.stock),
      metal: newProduct.metal,
      status: Number(newProduct.stock) > 5 ? 'In Stock' : 'Low Stock',
      isFeatured: true,
      image: newProduct.image,
      sku: `BJ-${newProduct.category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    };
    setProducts([created, ...products]);
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      category: 'Rings',
      price: '',
      originalPrice: '',
      stock: '10',
      metal: '18k Yellow Gold',
      image: '/images/detail-ring-hero.jpg',
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1510] flex flex-col font-sans selection:bg-[#dec29b]/30">

      {/* ── TOP LUXURY ADMIN HEADER BAR ── */}
      <header className="w-full bg-[#140e0b] border-b border-[#2d221a] text-[#f5efe8] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Brand Monogram & Title */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-[5px] border border-[#dec29b]/80 bg-[#1e1713] flex items-center justify-center shadow-xs group-hover:border-[#dec29b] transition-all">
                <span className="font-serif text-sm text-[#dec29b] font-bold italic">B</span>
              </div>
              <div>
                <span className="font-serif text-xs tracking-[0.24em] uppercase text-[#f5efe8] font-medium block">
                  BHAI JEWELLER
                </span>
                <span className="text-[8.5px] tracking-[0.3em] uppercase text-[#b8a798] font-light block">
                  ADMIN CONSOLE
                </span>
              </div>
            </Link>

            {/* Live Store Pill */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[5px] bg-[#2e231c] border border-[#3e3027] text-[10.5px] text-[#dec29b] font-light">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d7a48] animate-pulse" />
              <span>Bradford Live</span>
            </span>
          </div>

          {/* Middle: Live Gold Rate Ticker */}
          <div className="hidden md:flex items-center gap-4 bg-[#1e1713] border border-[#2d221a] px-3.5 py-1.5 rounded-[5px] text-xs font-light text-[#c8bdb5]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#dec29b] font-medium">24K Gold:</span>
              <span>${goldRate24K}/g</span>
              <span className="text-[#2d7a48] text-[10px]">▲ +1.2%</span>
            </div>
            <div className="w-[1px] h-3 bg-[#3a2e25]" />
            <div className="flex items-center gap-1.5">
              <span className="text-[#dec29b] font-medium">22K Gold:</span>
              <span>${goldRate22K}/g</span>
            </div>
          </div>

          {/* Right: Search, Store Link & Admin Badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-[5px] border border-[#dec29b]/50 text-[#dec29b] hover:bg-[#dec29b] hover:text-[#1c1510] text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>View Store</span>
              <span className="text-[10px]">↗</span>
            </Link>

            <div className="w-8 h-8 rounded-[5px] bg-[#faf6ee] border border-[#dec29b] flex items-center justify-center text-[#1c1510] font-serif text-xs font-bold shadow-xs">
              A
            </div>
          </div>

        </div>
      </header>

      {/* ── SECONDARY NAVIGATION BAR ── */}
      <div className="w-full bg-white border-b border-[#ede5db] sticky top-[57px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between overflow-x-auto scrollbar-hide py-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 text-xs font-medium rounded-[5px] whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-[#1c1510] text-[#f5efe8] shadow-xs'
                  : 'text-[#6b5c50] hover:text-[#1c1510] hover:bg-[#faf6ee]'
              }`}
            >
              <span>📊</span>
              <span>Dashboard Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 text-xs font-medium rounded-[5px] whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-[#1c1510] text-[#f5efe8] shadow-xs'
                  : 'text-[#6b5c50] hover:text-[#1c1510] hover:bg-[#faf6ee]'
              }`}
            >
              <span>💍</span>
              <span>Products ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 text-xs font-medium rounded-[5px] whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-[#1c1510] text-[#f5efe8] shadow-xs'
                  : 'text-[#6b5c50] hover:text-[#1c1510] hover:bg-[#faf6ee]'
              }`}
            >
              <span>📦</span>
              <span>Orders ({orders.length})</span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-[5px] bg-[#9e7d56] text-white text-[10px] font-semibold">
                  {pendingOrdersCount} new
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('enquiries')}
              className={`px-4 py-2.5 text-xs font-medium rounded-[5px] whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'enquiries'
                  ? 'bg-[#1c1510] text-[#f5efe8] shadow-xs'
                  : 'text-[#6b5c50] hover:text-[#1c1510] hover:bg-[#faf6ee]'
              }`}
            >
              <span>💌</span>
              <span>Custom Enquiries ({enquiries.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 text-xs font-medium rounded-[5px] whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-[#1c1510] text-[#f5efe8] shadow-xs'
                  : 'text-[#6b5c50] hover:text-[#1c1510] hover:bg-[#faf6ee]'
              }`}
            >
              <span>⚙️</span>
              <span>Store Controls</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="hidden lg:flex items-center min-w-[220px]">
            <input
              type="text"
              placeholder="Search catalog, order #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── MAIN DASHBOARD BODY CONTAINER ── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: OVERVIEW (KPI Cards, Charts, Recent Activity)
            ───────────────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top KPI Cards */}
            <ScrollReveal direction="up">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Revenue */}
                <div className="bg-white rounded-[5px] border border-[#ede5db] p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#8a796c] font-light">
                    <span>Total Sales Revenue</span>
                    <span className="w-7 h-7 rounded-[5px] bg-[#faf6ee] text-[#9e7d56] flex items-center justify-center text-xs font-semibold">
                      $
                    </span>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1510] font-semibold">
                      ${totalRevenue.toLocaleString()}
                    </h3>
                    <p className="text-[11px] text-[#2d7a48] font-medium mt-1 flex items-center gap-1">
                      <span>↑ 14.8%</span>
                      <span className="text-[#8a796c] font-light">vs previous month</span>
                    </p>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-[5px] border border-[#ede5db] p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#8a796c] font-light">
                    <span>Total Orders</span>
                    <span className="w-7 h-7 rounded-[5px] bg-[#faf6ee] text-[#9e7d56] flex items-center justify-center text-xs font-semibold">
                      📦
                    </span>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1510] font-semibold">
                      {totalOrdersCount}
                    </h3>
                    <p className="text-[11px] text-[#9e7d56] font-medium mt-1 flex items-center gap-1">
                      <span>{pendingOrdersCount} pending dispatch</span>
                    </p>
                  </div>
                </div>

                {/* Active Catalog */}
                <div className="bg-white rounded-[5px] border border-[#ede5db] p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#8a796c] font-light">
                    <span>Active Jewelry Catalog</span>
                    <span className="w-7 h-7 rounded-[5px] bg-[#faf6ee] text-[#9e7d56] flex items-center justify-center text-xs font-semibold">
                      💎
                    </span>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1510] font-semibold">
                      {totalProductsCount} Items
                    </h3>
                    <p className="text-[11px] text-[#8a796c] font-light mt-1">
                      18k & 22k Gold & Diamond Certified
                    </p>
                  </div>
                </div>

                {/* Avg Order Value */}
                <div className="bg-white rounded-[5px] border border-[#ede5db] p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#8a796c] font-light">
                    <span>Avg Order Value</span>
                    <span className="w-7 h-7 rounded-[5px] bg-[#faf6ee] text-[#9e7d56] flex items-center justify-center text-xs font-semibold">
                      ✨
                    </span>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1510] font-semibold">
                      ${Math.round(totalRevenue / (totalOrdersCount || 1)).toLocaleString()}
                    </h3>
                    <p className="text-[11px] text-[#2d7a48] font-medium mt-1">
                      High Luxury Conversion
                    </p>
                  </div>
                </div>

              </div>
            </ScrollReveal>

            {/* Sales Breakdown & Stock Alert Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Recent Orders List (Col 8) */}
              <div className="lg:col-span-8">
                <ScrollReveal delay={100}>
                  <div className="bg-white rounded-[5px] border border-[#ede5db] p-5 sm:p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e8ded4]">
                      <div>
                        <h2 className="font-serif text-lg text-[#1c1510] font-normal">Recent Store Orders</h2>
                        <p className="text-xs text-[#8a796c] font-light mt-0.5">Live customer purchases across website</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-[#9e7d56] hover:underline font-medium"
                      >
                        View All Orders →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-light text-[#57493e]">
                        <thead>
                          <tr className="border-b border-[#e8ded4] text-[#8a796c] uppercase text-[10px] tracking-wider pb-2">
                            <th className="py-2.5 font-medium">Order ID</th>
                            <th className="py-2.5 font-medium">Customer</th>
                            <th className="py-2.5 font-medium">Product Purchased</th>
                            <th className="py-2.5 font-medium">Amount</th>
                            <th className="py-2.5 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0e8dc]">
                          {orders.slice(0, 4).map((ord) => (
                            <tr key={ord.id} className="hover:bg-[#faf6ee] transition-colors">
                              <td className="py-3 font-mono font-medium text-[#1c1510]">{ord.id}</td>
                              <td className="py-3">
                                <span className="font-medium text-[#1c1510] block">{ord.customer}</span>
                                <span className="text-[10.5px] text-[#8a796c]">{ord.email}</span>
                              </td>
                              <td className="py-3 truncate max-w-[180px]">{ord.items}</td>
                              <td className="py-3 font-semibold text-[#1c1510]">${ord.amount.toLocaleString()}</td>
                              <td className="py-3">
                                <span
                                  className={`px-2.5 py-1 rounded-[5px] text-[10.5px] font-medium ${
                                    ord.status === 'Processing'
                                      ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                                      : ord.status === 'Shipped'
                                      ? 'bg-[#e0e7ff] text-[#3730a3] border border-[#c7d2fe]'
                                      : 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]'
                                  }`}
                                >
                                  {ord.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Category Breakdown & Quick Actions (Col 4) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Category Sales Share */}
                <ScrollReveal delay={150}>
                  <div className="bg-white rounded-[5px] border border-[#ede5db] p-5 sm:p-6 shadow-xs">
                    <h2 className="font-serif text-lg text-[#1c1510] font-normal pb-3 border-b border-[#e8ded4] mb-4">
                      Category Share
                    </h2>
                    
                    <div className="space-y-3.5 text-xs font-light">
                      <div>
                        <div className="flex justify-between mb-1 text-[#1c1510]">
                          <span>Diamond Rings</span>
                          <span className="font-medium">42%</span>
                        </div>
                        <div className="w-full h-2 rounded-[5px] bg-[#f0e8dc] overflow-hidden">
                          <div className="h-full bg-[#1c1510] rounded-[5px]" style={{ width: '42%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1 text-[#1c1510]">
                          <span>Gold Necklaces</span>
                          <span className="font-medium">28%</span>
                        </div>
                        <div className="w-full h-2 rounded-[5px] bg-[#f0e8dc] overflow-hidden">
                          <div className="h-full bg-[#9e7d56] rounded-[5px]" style={{ width: '28%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1 text-[#1c1510]">
                          <span>Drop Earrings</span>
                          <span className="font-medium">18%</span>
                        </div>
                        <div className="w-full h-2 rounded-[5px] bg-[#f0e8dc] overflow-hidden">
                          <div className="h-full bg-[#dec29b] rounded-[5px]" style={{ width: '18%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1 text-[#1c1510]">
                          <span>Bangles & Bracelets</span>
                          <span className="font-medium">12%</span>
                        </div>
                        <div className="w-full h-2 rounded-[5px] bg-[#f0e8dc] overflow-hidden">
                          <div className="h-full bg-[#6b5c50] rounded-[5px]" style={{ width: '12%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Quick Add Product Card */}
                <ScrollReveal delay={200}>
                  <div className="bg-[#140e0b] rounded-[5px] border border-[#2d221a] p-5 text-[#f5efe8] shadow-md relative overflow-hidden">
                    <div className="w-9 h-9 rounded-[5px] bg-[#1e1713] border border-[#dec29b]/60 flex items-center justify-center text-[#dec29b] text-base mb-3 shadow-xs">
                      ✨
                    </div>
                    <h3 className="font-serif text-lg text-[#f5efe8] font-normal mb-1">
                      Add New Jewelry Piece
                    </h3>
                    <p className="text-xs text-[#c8bdb5] font-light leading-relaxed mb-4">
                      Upload fresh 18k or 22k gold and diamond inventory directly to the live store.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="w-full py-2.5 rounded-[5px] bg-[#dec29b] text-[#1c1510] font-medium text-xs hover:bg-[#ebd5b5] transition-all shadow-sm"
                    >
                      + Add New Product
                    </button>
                  </div>
                </ScrollReveal>

              </div>

            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: PRODUCTS CATALOG MANAGEMENT
            ───────────────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Header & Category Filters */}
            <ScrollReveal direction="up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[5px] border border-[#ede5db] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl text-[#1c1510] font-normal">Jewelry Catalog Management</h2>
                  <p className="text-xs text-[#8a796c] font-light mt-0.5">Manage inventory, prices, and product visibility</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 rounded-[5px] bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all shadow-xs"
                  >
                    + Add Product
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Category Switcher Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-[5px] text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1c1510] text-[#f5efe8] shadow-xs'
                      : 'bg-white border border-[#ded3c5] text-[#6b5c50] hover:bg-[#faf6ee]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Table */}
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-[5px] border border-[#ede5db] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-light text-[#57493e]">
                    <thead className="bg-[#faf6ee] border-b border-[#e8ded4] text-[#8a796c] uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4 font-medium">Product</th>
                        <th className="p-4 font-medium">SKU</th>
                        <th className="p-4 font-medium">Metal & Category</th>
                        <th className="p-4 font-medium">Price</th>
                        <th className="p-4 font-medium">Stock</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0e8dc]">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#fbf9f5] transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-[5px] overflow-hidden bg-[#f5efe7] border border-[#e8ded4] flex-shrink-0">
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            </div>
                            <div>
                              <h4 className="font-serif text-xs font-medium text-[#1c1510]">{p.name}</h4>
                              {p.isFeatured && (
                                <span className="inline-block text-[9.5px] px-1.5 py-0.2 rounded-[5px] bg-[#dec29b]/25 text-[#5a4329] font-semibold mt-0.5">
                                  Featured
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-[#8a796c]">{p.sku}</td>
                          <td className="p-4">
                            <span className="block font-medium text-[#1c1510]">{p.category}</span>
                            <span className="text-[10.5px] text-[#8a796c]">{p.metal}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-serif text-sm font-semibold text-[#1c1510]">${p.price.toLocaleString()}</span>
                            {p.originalPrice && (
                              <span className="block text-[10px] text-[#9a897b] line-through">${p.originalPrice.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="p-4 font-medium text-[#1c1510]">{p.stock} units</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-[5px] text-[10.5px] font-medium ${
                                p.stock > 5
                                  ? 'bg-[#dcfce7] text-[#166534]'
                                  : 'bg-[#fef3c7] text-[#92400e]'
                              }`}
                            >
                              {p.stock > 5 ? 'In Stock' : 'Low Stock'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id)}
                              className="px-2.5 py-1 rounded-[5px] bg-[#fee2e2] text-[#991b1b] text-[10.5px] font-medium hover:bg-[#fca5a5] transition-colors"
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

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 3: ORDERS MANAGEMENT
            ───────────────────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Header & Filter */}
            <ScrollReveal direction="up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[5px] border border-[#ede5db] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl text-[#1c1510] font-normal">Customer Orders</h2>
                  <p className="text-xs text-[#8a796c] font-light mt-0.5">Track, fulfill, and manage store orders</p>
                </div>

                {/* Filter Status */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8a796c] font-light">Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </ScrollReveal>

            {/* Orders Table */}
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-[5px] border border-[#ede5db] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-light text-[#57493e]">
                    <thead className="bg-[#faf6ee] border-b border-[#e8ded4] text-[#8a796c] uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4 font-medium">Order ID & Date</th>
                        <th className="p-4 font-medium">Customer Details</th>
                        <th className="p-4 font-medium">Items Ordered</th>
                        <th className="p-4 font-medium">Payment</th>
                        <th className="p-4 font-medium">Total</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0e8dc]">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#fbf9f5] transition-colors">
                          <td className="p-4">
                            <span className="font-mono font-medium text-[#1c1510] block">{ord.id}</span>
                            <span className="text-[10.5px] text-[#8a796c]">{ord.date}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-[#1c1510] block">{ord.customer}</span>
                            <span className="text-[10.5px] text-[#8a796c] block">{ord.email}</span>
                            <span className="text-[10px] text-[#9a897b]">{ord.address}</span>
                          </td>
                          <td className="p-4 font-serif text-xs text-[#1c1510]">{ord.items}</td>
                          <td className="p-4 text-[11px] text-[#6b5c50]">{ord.paymentMethod}</td>
                          <td className="p-4 font-serif text-sm font-semibold text-[#1c1510]">${ord.amount.toLocaleString()}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-[5px] text-[10.5px] font-medium ${
                                ord.status === 'Processing'
                                  ? 'bg-[#fef3c7] text-[#92400e]'
                                  : ord.status === 'Shipped'
                                  ? 'bg-[#e0e7ff] text-[#3730a3]'
                                  : 'bg-[#dcfce7] text-[#166534]'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1.5">
                            {ord.status !== 'Shipped' && ord.status !== 'Delivered' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(ord.id, 'Shipped')}
                                className="px-2.5 py-1 rounded-[5px] bg-[#1c1510] text-[#f5efe8] text-[10.5px] font-medium hover:bg-[#33261d] transition-all"
                              >
                                Mark Shipped
                              </button>
                            )}
                            {ord.status !== 'Delivered' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                                className="px-2.5 py-1 rounded-[5px] bg-[#2d7a48] text-white text-[10.5px] font-medium hover:bg-[#236139] transition-all"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 4: CUSTOM ENQUIRIES
            ───────────────────────────────────────────────────────────── */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <ScrollReveal direction="up">
              <div className="bg-white p-5 rounded-[5px] border border-[#ede5db] shadow-xs">
                <h2 className="font-serif text-xl text-[#1c1510] font-normal">Bespoke Custom Orders & Enquiries</h2>
                <p className="text-xs text-[#8a796c] font-light mt-0.5">High-value custom engagement ring & bridal set design requests</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {enquiries.map((enq, idx) => (
                <ScrollReveal key={enq.id} delay={idx * 50}>
                  <div className="bg-white rounded-[5px] border border-[#ede5db] p-5 shadow-xs flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#e8ded4] mb-3">
                        <div>
                          <span className="font-mono text-[11px] text-[#9e7d56] font-medium">{enq.id}</span>
                          <h3 className="font-serif text-base text-[#1c1510] font-medium mt-0.5">{enq.service}</h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-[5px] bg-[#faf6ee] border border-[#dec29b]/40 text-[#5a4329] text-[10.5px] font-semibold">
                          Budget: {enq.budget}
                        </span>
                      </div>

                      <p className="text-xs text-[#57493e] font-light leading-relaxed mb-4 italic bg-[#faf7f2] p-3 rounded-[5px] border border-[#ede5db]">
                        &quot;{enq.message}&quot;
                      </p>

                      <div className="space-y-1 text-xs text-[#7d6e62] font-light">
                        <p><strong>Client:</strong> {enq.name}</p>
                        <p><strong>Email:</strong> {enq.email}</p>
                        <p><strong>Phone:</strong> {enq.phone}</p>
                        <p><strong>Date:</strong> {enq.date}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#e8ded4] flex items-center justify-between">
                      <span className="text-[11px] text-[#2d7a48] font-medium">Status: {enq.status}</span>
                      <a
                        href={`mailto:${enq.email}?subject=Bhai Jeweller Bespoke Consultation (${enq.id})`}
                        className="px-3 py-1.5 rounded-[5px] bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all"
                      >
                        Reply via Email →
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 5: STORE CONTROLS & SETTINGS
            ───────────────────────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <ScrollReveal direction="up">
            <div className="max-w-3xl mx-auto bg-white rounded-[5px] border border-[#ede5db] p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="font-serif text-xl text-[#1c1510] font-normal pb-3 border-b border-[#e8ded4]">
                Store Control Panel & Settings
              </h2>

              <div className="space-y-4 text-xs">
                {/* Live Gold Rates */}
                <div>
                  <h3 className="font-serif text-base text-[#1c1510] font-medium mb-2">Live Gold Rates Display ($/gram)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#6b5c50] mb-1">24K Gold Rate ($/g)</label>
                      <input
                        type="text"
                        value={goldRate24K}
                        onChange={(e) => setGoldRate24K(e.target.value)}
                        className="w-full px-3 py-2 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6b5c50] mb-1">22K Gold Rate ($/g)</label>
                      <input
                        type="text"
                        value={goldRate22K}
                        onChange={(e) => setGoldRate22K(e.target.value)}
                        className="w-full px-3 py-2 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Free Shipping */}
                <div className="pt-3 border-t border-[#e8ded4]">
                  <label className="block text-[#6b5c50] mb-1">Free Shipping Order Minimum ($)</label>
                  <input
                    type="text"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                    className="w-full px-3 py-2 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none"
                  />
                </div>

                {/* Announcement Bar */}
                <div className="pt-3 border-t border-[#e8ded4]">
                  <label className="block text-[#6b5c50] mb-1">Store Header Announcement Text</label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full px-3 py-2 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => alert('Store settings saved successfully!')}
                    className="px-6 py-2.5 rounded-[5px] bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

      </main>

      {/* ─────────────────────────────────────────────────────────────
          ADD NEW PRODUCT MODAL
          ───────────────────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[5px] border border-[#ede5db] w-full max-w-lg p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-xs text-[#8a796c] hover:text-[#1c1510]"
            >
              ✕
            </button>

            <h3 className="font-serif text-xl text-[#1c1510] font-normal pb-3 mb-4 border-b border-[#e8ded4]">
              Add New Jewelry Product
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#1c1510] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Emerald Cut Solara Ring"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none focus:border-[#1c1510]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1c1510] mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none cursor-pointer"
                  >
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#1c1510] mb-1">Metal Purity *</label>
                  <select
                    value={newProduct.metal}
                    onChange={(e) => setNewProduct({ ...newProduct, metal: e.target.value })}
                    className="w-full px-3 py-2 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none cursor-pointer"
                  >
                    <option value="18k Yellow Gold">18k Yellow Gold</option>
                    <option value="22k Gold">22k Gold</option>
                    <option value="18k Rose Gold">18k Rose Gold</option>
                    <option value="18k White Gold">18k White Gold</option>
                    <option value="Platinum 950">Platinum 950</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#1c1510] mb-1">Price ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1280"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1c1510] mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    placeholder="1650"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1c1510] mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#e8ded4] mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-[5px] border border-[#ded3c5] text-xs font-medium text-[#6b5c50] hover:bg-[#faf6ee]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[5px] bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
