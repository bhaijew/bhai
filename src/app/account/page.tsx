'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function AccountPage() {
  const router = useRouter();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    'account' | 'orders' | 'wishlist' | 'addresses' | 'payments' | 'returns' | 'settings'
  >('account');

  // Mobile drawer state for mobile menu view (matching "Mobile - Menu (Account)" screenshot)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User Session State
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone: string;
    memberSince: string;
    role: string;
  }>({
    name: 'Syed Zeeshan Haider',
    email: 'syedzeeshan@gmail.com',
    phone: '+92 300 1234567',
    memberSince: 'Apr 2025',
    role: 'client',
  });

  const [loading, setLoading] = useState(true);
  const [realOrders, setRealOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Check user session on mount
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser((prev) => ({
            ...prev,
            name: data.user.name || prev.name,
            email: data.user.email || prev.email,
            role: data.user.role || 'client',
          }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Session check error:', err);
        setLoading(false);
      });
  }, []);

  // Fetch real database orders
  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setRealOrders(data.data);
        }
        setOrdersLoading(false);
      })
      .catch((err) => {
        console.error('Fetch real orders error:', err);
        setOrdersLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      window.location.href = '/login';
    }
  };

  // Derive initial letter for avatar (e.g., 'S' for Syed Zeeshan Haider)
  const initialLetter = user.name ? user.name.trim().charAt(0).toUpperCase() : 'S';

  // Sample Orders Data matching exact screenshot details
  const ordersList = [
    {
      id: '#AUR-1025',
      date: '12 Sep 2025',
      itemsCount: '2 Items',
      status: 'Delivered',
      statusColor: 'bg-emerald-100/90 text-emerald-800 border-emerald-300/60',
      total: '$ 248.00',
      image: '/images/detail-ring-hero.jpg',
    },
    {
      id: '#AUR-1024',
      date: '05 Sep 2025',
      itemsCount: '1 Item',
      status: 'Processing',
      statusColor: 'bg-amber-100/90 text-amber-800 border-amber-300/60',
      total: '$ 120.00',
      image: '/images/featured-ring.jpg',
    },
    {
      id: '#AUR-1023',
      date: '28 Aug 2025',
      itemsCount: '3 Items',
      status: 'Delivered',
      statusColor: 'bg-emerald-100/90 text-emerald-800 border-emerald-300/60',
      total: '$ 360.00',
      image: '/images/auth-ring-full.jpg',
    },
    {
      id: '#AUR-1022',
      date: '18 Aug 2025',
      itemsCount: '1 Item',
      status: 'Shipped',
      statusColor: 'bg-blue-100/90 text-blue-800 border-blue-300/60',
      total: '$ 90.00',
      image: '/images/hero-img.jpg',
    },
    {
      id: '#AUR-1021',
      date: '02 Aug 2025',
      itemsCount: '2 Items',
      status: 'Delivered',
      statusColor: 'bg-emerald-100/90 text-emerald-800 border-emerald-300/60',
      total: '$ 450.00',
      image: '/images/detail-ring-hero.jpg',
    },
  ];

  // Navigation Items list
  const sideNavItems = [
    {
      id: 'account',
      label: 'My Account',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
      ),
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      badge: 8,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    },
    {
      id: 'payments',
      label: 'Payment Methods',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
    },
    {
      id: 'returns',
      label: 'Returns & Refunds',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 12h11.25" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1510] font-sans selection:bg-[#c5a059] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          1. LUXURY TOP NAVIGATION BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="w-full bg-[#140e0b] text-[#f5efe8] border-b border-[#2d221a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Left Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile account menu"
            className="md:hidden p-2 text-[#e3c79e] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-[#dec29b]/70 flex items-center justify-center bg-[#1a1410] shadow-sm">
              <span className="font-serif text-sm text-[#dec29b] font-semibold italic">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm sm:text-base tracking-[0.22em] uppercase text-[#f5efe8]">
                AURELIA
              </span>
              <span className="text-[7.5px] tracking-[0.4em] uppercase text-[#b8a798]">— JEWELS —</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-xs tracking-wider uppercase font-light text-[#dfd5ca]">
            <Link href="/" className="hover:text-[#dec29b] transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-[#dec29b] transition-colors">Shop</Link>
            <Link href="/collections" className="hover:text-[#dec29b] transition-colors">Collections</Link>
            <Link href="/about" className="hover:text-[#dec29b] transition-colors">About</Link>
            <Link href="/journal" className="hover:text-[#dec29b] transition-colors">Journal</Link>
            <Link href="/contact" className="hover:text-[#dec29b] transition-colors">Contact</Link>
          </nav>

          {/* Right Utility Icons */}
          <div className="flex items-center gap-3 sm:gap-4 text-[#f5efe8]">
            <button type="button" aria-label="Search" className="hover:text-[#dec29b] transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            <Link href="/wishlist" aria-label="Wishlist" className="relative hover:text-[#dec29b] transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>

            <Link href="/cart" aria-label="Cart" className="relative hover:text-[#dec29b] transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#dec29b] text-[#1c1510] text-[9px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
          </div>
        </div>
      </header>


      {/* ─────────────────────────────────────────────────────────────
          2. HERO COVER BANNER & OVERLAPPING PROFILE CARD (EXACT MATCHING DESIGN 2)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full">
        {/* Cover Image Header */}
        <div className="relative w-full h-44 sm:h-56 bg-[#18110c] overflow-hidden">
          <Image
            src="/images/auth-ring-full.jpg"
            alt="Luxury Jewellery Background"
            fill
            priority
            className="object-cover object-[center_35%] opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Profile Details Overlay Card (White/Beige card overlapping bottom of cover) */}
        <div className="bg-[#faf7f2] border-b border-[#e8decf] rounded-t-3xl -mt-6 relative z-10 px-4 sm:px-8 pb-6 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            
            {/* Left: Avatar Circle + Name & Contacts */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              {/* Avatar Circle Overlapping Cover Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#faf7f2] bg-[#1c140f] text-[#dec29b] font-serif font-semibold italic text-3xl sm:text-4xl flex items-center justify-center shadow-lg flex-shrink-0 -mt-12 sm:-mt-14 relative z-20">
                {initialLetter}
              </div>

              {/* Name, Verified Badge, Email, Phone */}
              <div className="space-y-1 mt-1 sm:mt-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#1c1510] tracking-wide">
                    {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-800 text-[10px] font-medium tracking-wide flex items-center gap-1 shadow-2xs">
                    <svg className="w-3 h-3 text-emerald-600 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Verified Account
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#7a6a5c] font-normal">
                  <span>{user.email}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#9e7d56]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {user.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Edit Profile Button (Sleek Dark Pill Button) */}
            <button
              type="button"
              className="px-5 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all flex items-center justify-center gap-1.5 shadow-sm self-start sm:self-end mt-2 sm:mt-0"
            >
              <svg className="w-3.5 h-3.5 text-[#dec29b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <span>Edit Profile</span>
            </button>

          </div>
        </div>
      </div>


      {/* ─────────────────────────────────────────────────────────────
          3. MAIN DESKTOP GRID LAYOUT (Side Nav + Content + Widgets)
          ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT SIDEBAR NAVIGATION ── */}
          <aside className="hidden lg:block lg:col-span-3 bg-[#faf7f2] border border-[#ded3c5] rounded-2xl p-3 shadow-xs sticky top-24">
            <nav className="space-y-1">
              {sideNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-light transition-all ${
                      isActive
                        ? 'bg-[#ede4d8] text-[#1c1510] font-medium shadow-2xs border border-[#ded3c5]/60'
                        : 'text-[#6b5c50] hover:bg-[#f3ece3] hover:text-[#1c1510]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-[#9e7d56]' : 'text-[#8a796c]'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="w-5 h-5 rounded-full bg-[#1c1510] text-[#f5efe8] text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-[#ede4d8] mt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-light text-red-800 hover:bg-red-50 transition-all"
                >
                  <svg className="w-4 h-4 text-red-700 stroke-[1.7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            </nav>
          </aside>


          {/* ── CENTER CONTENT AREA (Stats, Recent Orders, Account Settings) ── */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* STATS OVERVIEW CARDS (4 CARDS GRID MATCHING IMAGE 3) */}
            <ScrollReveal direction="up" delay={50}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                
                {/* Stat 1: Total Orders */}
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-[5px] p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] transition-colors text-center sm:text-left">
                  <div className="w-8 h-8 rounded-[5px] bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56] mb-3 mx-auto sm:mx-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Total Orders</span>
                    <span className="font-serif text-2xl text-[#1c1510] font-normal">
                      {realOrders.length > 0 ? realOrders.length : 5}
                    </span>
                  </div>
                </div>

                {/* Stat 2: Wishlist Items */}
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-[5px] p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] transition-colors text-center sm:text-left">
                  <div className="w-8 h-8 rounded-[5px] bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56] mb-3 mx-auto sm:mx-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Wishlist</span>
                    <span className="font-serif text-2xl text-[#1c1510] font-normal">8</span>
                  </div>
                </div>

                {/* Stat 3: Points */}
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-[5px] p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] transition-colors text-center sm:text-left">
                  <div className="w-8 h-8 rounded-[5px] bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56] mb-3 mx-auto sm:mx-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.486-.412.868-.839.605l-4.71-2.92a.562.562 0 00-.59 0l-4.71 2.92c-.427.263-.955-.119-.839-.605l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Points</span>
                    <span className="font-serif text-2xl text-[#1c1510] font-normal">120</span>
                  </div>
                </div>

                {/* Stat 4: Member Since */}
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-[5px] p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] transition-colors text-center sm:text-left">
                  <div className="w-8 h-8 rounded-[5px] bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56] mb-3 mx-auto sm:mx-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Member Since</span>
                    <span className="font-serif text-base sm:text-lg text-[#1c1510] font-normal">Apr 2025</span>
                  </div>
                </div>

              </div>
            </ScrollReveal>


            {/* RECENT ORDERS / MY ORDERS SECTION */}
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-[5px] p-5 sm:p-6 shadow-2xs space-y-4">
                
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl text-[#1c1510] font-normal">
                    My Orders
                  </h2>
                  <Link href="/orders" className="text-xs text-[#9e7d56] font-medium hover:text-[#1c1510] transition-colors flex items-center gap-1">
                    <span>View All</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Mobile Orders List View (No inner nested card background, clean rows) */}
                <div className="sm:hidden divide-y divide-[#ede4d8]">
                  {(realOrders.length > 0
                    ? realOrders.map((ro: any) => ({
                        id: ro.id || '#AUR-1025',
                        date: ro.date || '12 Sep 2025',
                        itemsCount: ro.items || '1 Item',
                        status: ro.status || 'Delivered',
                        statusColor:
                          ro.status === 'Processing'
                            ? 'bg-amber-100/90 text-amber-800 border-amber-300/60'
                            : 'bg-emerald-100/90 text-emerald-800 border-emerald-300/60',
                        total: `$ ${Number(ro.amount || 248).toFixed(2)}`,
                        image: '/images/detail-ring-hero.jpg',
                      }))
                    : ordersList
                  ).map((ord) => (
                    <div key={ord.id} className="flex items-center justify-between py-3.5 px-1 bg-transparent hover:bg-[#faf6ee]/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-[5px] overflow-hidden bg-white border border-[#ded3c5] flex-shrink-0">
                          <Image src={ord.image} alt={ord.id} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-medium text-[#1c1510] block">{ord.id}</span>
                          <span className="text-[10px] text-[#8a796c] font-light block">{ord.date}</span>
                          <span className={`inline-block mt-1 px-2 py-0.2 rounded-full text-[9px] font-medium border ${ord.statusColor}`}>
                            + {ord.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-medium text-[#1c1510]">{ord.total}</span>
                        <span className="text-[#8a796c] text-sm font-light">›</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Orders Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#ede4d8] text-[#8a796c] font-light uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-3">Order</th>
                        <th className="py-3 px-3">Items</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Total</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ede4d8]/60">
                      {(realOrders.length > 0
                        ? realOrders.map((ro: any) => ({
                            id: ro.id || '#AUR-1025',
                            date: ro.date || '12 Sep 2025',
                            itemsCount: ro.items || '1 Item',
                            status: ro.status || 'Delivered',
                            statusColor:
                              ro.status === 'Processing'
                                ? 'bg-amber-100/90 text-amber-800 border-amber-300/60'
                                : 'bg-emerald-100/90 text-emerald-800 border-emerald-300/60',
                            total: `$ ${Number(ro.amount || 248).toFixed(2)}`,
                            image: '/images/detail-ring-hero.jpg',
                          }))
                        : ordersList
                      ).map((ord) => (
                        <tr key={ord.id} className="bg-transparent hover:bg-[#faf6ee]/80 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-9 h-9 rounded-[5px] overflow-hidden bg-white border border-[#ded3c5] flex-shrink-0">
                                <Image src={ord.image} alt={ord.id} fill className="object-cover" />
                              </div>
                              <div>
                                <span className="font-mono text-xs font-medium text-[#1c1510] block">{ord.id}</span>
                                <span className="text-[10px] text-[#8a796c] font-light">{ord.date}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-[#6b5c50] font-light">{ord.itemsCount}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${ord.statusColor}`}>
                              + {ord.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-serif font-medium text-[#1c1510]">{ord.total}</td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              type="button"
                              className="px-3 py-1 rounded-[5px] border border-[#ded3c5] text-[10.5px] font-light text-[#1c1510] hover:bg-[#1c1510] hover:text-[#f5efe8] transition-all shadow-2xs"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </ScrollReveal>


            {/* EXCLUSIVE OFFERS BANNER CARD (MATCHING IMAGE 3) */}
            <ScrollReveal direction="up" delay={120}>
              <div className="relative rounded-2xl overflow-hidden bg-[#140e0b] text-[#f5efe8] border border-[#dec29b]/50 p-6 shadow-xl flex flex-col justify-between min-h-[180px]">
                {/* Background Jewellery Cover Image */}
                <Image
                  src="/images/auth-ring-full.jpg"
                  alt="Exclusive Offers Background"
                  fill
                  className="object-cover object-center opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#140e0b]/90 via-[#140e0b]/60 to-transparent pointer-events-none" />

                <div className="relative z-10 max-w-sm space-y-2">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#ffffff] font-normal drop-shadow-md">
                    Exclusive Offers
                  </h3>
                  <p className="text-xs text-[#d6c9be] font-light leading-relaxed">
                    Be the first to know about new collections, exclusive offers and more.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full bg-[#dec29b] text-[#1c1510] font-medium text-xs hover:bg-[#caaa7f] transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>Subscribe Now</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>


            {/* ACCOUNT SETTINGS CARDS SECTION */}
            <ScrollReveal direction="up" delay={150}>
              <div className="space-y-4">
                <div>
                  <h2 className="font-serif text-xl text-[#1c1510] font-normal">Account Settings</h2>
                  <p className="text-xs text-[#8a796c] font-light mt-0.5">Manage your account settings and preferences.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Card 1: Edit Profile */}
                  <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-4 hover:border-[#1c1510] transition-all cursor-pointer shadow-2xs group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <span className="text-xs text-[#8a796c] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <h3 className="font-serif text-sm font-medium text-[#1c1510]">Edit Profile</h3>
                    <p className="text-[11px] text-[#8a796c] font-light mt-0.5">Update your personal information</p>
                  </div>

                  {/* Card 2: Change Password */}
                  <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-4 hover:border-[#1c1510] transition-all cursor-pointer shadow-2xs group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>
                      <span className="text-xs text-[#8a796c] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <h3 className="font-serif text-sm font-medium text-[#1c1510]">Change Password</h3>
                    <p className="text-[11px] text-[#8a796c] font-light mt-0.5">Keep your account secure</p>
                  </div>

                  {/* Card 3: Notification Preferences */}
                  <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-4 hover:border-[#1c1510] transition-all cursor-pointer shadow-2xs group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                      </div>
                      <span className="text-xs text-[#8a796c] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <h3 className="font-serif text-sm font-medium text-[#1c1510]">Notification Preferences</h3>
                    <p className="text-[11px] text-[#8a796c] font-light mt-0.5">Manage your notifications</p>
                  </div>
                </div>

              </div>
            </ScrollReveal>

          </div>


          {/* ── RIGHT WIDGET COLUMN (Desktop Quick Links) ── */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* QUICK LINKS CARD */}
            <ScrollReveal direction="up" delay={160}>
              <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-5 shadow-2xs space-y-3">
                <h3 className="font-serif text-sm text-[#1c1510] font-medium border-b border-[#ede4d8] pb-2">
                  Quick Links
                </h3>
                <nav className="space-y-1 text-xs">
                  <a href="#track" className="flex items-center justify-between p-2 rounded-lg hover:bg-[#faf6ee] text-[#6b5c50] hover:text-[#1c1510] transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-[#9e7d56]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0C2.678 5.572 2.25 6.052 2.25 6.62v.958" />
                      </svg>
                      Track Your Order
                    </span>
                    <span>›</span>
                  </a>

                  <a href="#shipping" className="flex items-center justify-between p-2 rounded-lg hover:bg-[#faf6ee] text-[#6b5c50] hover:text-[#1c1510] transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-[#9e7d56]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-19.432 0A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253" />
                      </svg>
                      Shipping Information
                    </span>
                    <span>›</span>
                  </a>

                  <a href="#return" className="flex items-center justify-between p-2 rounded-lg hover:bg-[#faf6ee] text-[#6b5c50] hover:text-[#1c1510] transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-[#9e7d56]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Return & Refund Policy
                    </span>
                    <span>›</span>
                  </a>

                  <a href="#help" className="flex items-center justify-between p-2 rounded-lg hover:bg-[#faf6ee] text-[#6b5c50] hover:text-[#1c1510] transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-[#9e7d56]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.008v.008H12V18z" />
                      </svg>
                      Need Help?
                    </span>
                    <span>›</span>
                  </a>
                </nav>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </main>


      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE ACCOUNT OVERLAY DRAWER MENU (PURE WHITE LUXURY THEME)
          ───────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[250] md:hidden flex">
          {/* Backdrop overlay covering top header/navbar completely */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity z-[240]"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sliding Pure White Menu Card */}
          <div className="relative w-80 max-w-[85vw] bg-white text-[#1c1510] h-full z-[250] p-6 flex flex-col justify-between shadow-2xl border-r border-[#e8decf] overflow-y-auto">
            <div className="space-y-6">
              {/* Header Close Button */}
              <div className="flex items-center justify-between border-b border-[#f0e6dc] pb-4">
                <span className="font-serif text-sm tracking-[0.2em] text-[#9e7d56] font-semibold">ACCOUNT MENU</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#faf7f2] border border-[#ded3c5] text-[#6b5c50] hover:text-[#1c1510] hover:bg-[#ede4d8] transition-colors flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* User Banner Header displaying Name Initial Avatar */}
              <div className="flex items-center gap-3 bg-[#faf7f2] p-3.5 rounded-[5px] border border-[#ded3c5]">
                <div className="w-12 h-12 rounded-full border border-[#dec29b] bg-[#1c140f] text-[#dec29b] font-serif font-bold italic text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  {initialLetter}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-serif text-sm text-[#1c1510] font-semibold truncate">{user.name}</h4>
                  <p className="text-[10px] text-[#7a6a5c] truncate">{user.email}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-medium border border-emerald-300/60">
                    ✓ Verified Account
                  </span>
                </div>
              </div>

              {/* Menu Links List */}
              <nav className="space-y-1">
                {sideNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-[5px] text-xs font-light transition-all ${
                      activeTab === item.id
                        ? 'bg-[#1c1510] text-[#f5efe8] font-medium shadow-xs'
                        : 'text-[#4a3b30] hover:bg-[#faf7f2] hover:text-[#1c1510]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={activeTab === item.id ? 'text-[#dec29b]' : 'text-[#9e7d56]'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined ? (
                      <span className="w-5 h-5 rounded-full bg-[#1c1510] text-[#f5efe8] text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    ) : (
                      <span>›</span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Promo Banner Card inside Drawer */}
              <div className="relative rounded-[5px] overflow-hidden bg-[#faf7f2] border border-[#ded3c5] p-4 text-center shadow-2xs">
                <h4 className="font-serif text-base text-[#1c1510] font-semibold">Luxury in Every Detail</h4>
                <p className="text-[10px] text-[#9e7d56] tracking-[0.25em] uppercase mt-1">AURELIA JEWELS</p>
              </div>
            </div>

            {/* Bottom Log Out */}
            <div className="pt-4 border-t border-[#f0e6dc]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-[5px] bg-red-50 border border-red-200 text-red-800 text-xs font-medium hover:bg-red-100 transition-all"
              >
                <svg className="w-4 h-4 stroke-[1.8] text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
