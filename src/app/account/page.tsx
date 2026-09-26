'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { useShop, WishlistItem } from '@/context/ShopContext';

export default function AccountPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, addToCart } = useShop();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    'account' | 'orders' | 'wishlist' | 'addresses' | 'payments' | 'returns' | 'settings'
  >('account');

  // User Session State (Connected to real database session)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone: string;
    memberSince: string;
    role: string;
  }>({
    name: '',
    email: '',
    phone: '',
    memberSince: '',
    role: 'client',
  });

  const [realOrders, setRealOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Address State Management
  const [addresses, setAddresses] = useState<any[]>([
    {
      id: 'addr-1',
      title: 'Primary Residence (Default)',
      name: 'Syed Zeeshan Haider',
      street: '124 Manor Row, Bradford City Centre',
      city: 'Bradford',
      postcode: 'BD1 4NT',
      country: 'United Kingdom',
      phone: '+44 (0) 1274 722 888',
      isDefault: true,
    },
  ]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: 'Work / Secondary',
    name: '',
    street: '',
    city: 'Bradford',
    postcode: '',
    country: 'United Kingdom',
    phone: '',
  });

  // Payment Methods State Management
  const [paymentMethods, setPaymentMethods] = useState<any[]>([
    {
      id: 'pm-1',
      type: 'Mastercard',
      last4: '8842',
      expiry: '12/28',
      holder: 'S Z HAIDER',
      isDefault: true,
    },
    {
      id: 'pm-2',
      type: 'Visa',
      last4: '4190',
      expiry: '08/27',
      holder: 'S Z HAIDER',
      isDefault: false,
    },
  ]);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newCard, setNewCard] = useState({
    holder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // Settings Form State
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Added to cart feedback map
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      variant: item.category,
      price: item.price,
      image: item.image,
      slug: item.slug,
    });
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  // Check user session on mount from real Supabase auth session
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          const userName = data.user.name || data.user.fullName || 'Valued Client';
          const userEmail = data.user.email || '';
          const userPhone = data.user.phone || '+44 (0) 1274 722 888';
          const userMember = data.user.createdAt
            ? new Date(data.user.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
            : 'Active Client';

          setUser({
            name: userName,
            email: userEmail,
            phone: userPhone,
            memberSince: userMember,
            role: data.user.role || 'client',
          });

          // Fetch orders for this authenticated user
          fetch('/api/orders')
            .then((res) => res.json())
            .then((orderData) => {
              if (orderData.success && Array.isArray(orderData.data)) {
                if (data.user.role === 'admin') {
                  setRealOrders(orderData.data);
                } else {
                  const myOrders = orderData.data.filter(
                    (o: any) => !o.email || o.email.toLowerCase() === userEmail.toLowerCase()
                  );
                  setRealOrders(myOrders);
                }
              } else {
                setRealOrders([]);
              }
              setOrdersLoading(false);
            })
            .catch((err) => {
              console.error('Fetch real orders error:', err);
              setRealOrders([]);
              setOrdersLoading(false);
            });
        } else {
          setIsAuthenticated(false);
          setOrdersLoading(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Session check error:', err);
        setIsAuthenticated(false);
        setLoading(false);
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

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.postcode) return;
    const item = {
      id: `addr-${Date.now()}`,
      title: newAddress.title,
      name: newAddress.name || user.name,
      street: newAddress.street,
      city: newAddress.city,
      postcode: newAddress.postcode,
      country: newAddress.country,
      phone: newAddress.phone || user.phone,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, item]);
    setShowAddAddressModal(false);
    setNewAddress({
      title: 'Secondary Address',
      name: '',
      street: '',
      city: 'Bradford',
      postcode: '',
      country: 'United Kingdom',
      phone: '',
    });
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.cardNumber || !newCard.expiry) return;
    const cleanNum = newCard.cardNumber.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4) || '1234';
    const item = {
      id: `pm-${Date.now()}`,
      type: cleanNum.startsWith('4') ? 'Visa' : 'Mastercard',
      last4: last4,
      expiry: newCard.expiry,
      holder: newCard.holder.toUpperCase() || user.name.toUpperCase(),
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods((prev) => [...prev, item]);
    setShowAddPaymentModal(false);
    setNewCard({ holder: '', cardNumber: '', expiry: '', cvv: '' });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordChanged(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordChanged(false), 4000);
  };

  // Derive initial letter for avatar
  const initialLetter = user.name ? user.name.trim().charAt(0).toUpperCase() : 'B';

  // Calculate dynamic reward points based on real order totals
  const totalSpent = realOrders.reduce((sum, ord) => sum + (Number(ord.amount) || 0), 0);
  const rewardPoints = Math.floor(totalSpent / 10);

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
      badge: realOrders.length > 0 ? realOrders.length : undefined,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
      ),
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      badge: wishlist.length > 0 ? wishlist.length : undefined,
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

  // ── LOADING STATE ──
  if (loading) {
    return (
      <div className="min-h-[75vh] bg-[#faf7f2] text-[#1c1510] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#dec29b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-base text-[#7a6a5c] tracking-wide">Connecting to your account...</p>
      </div>
    );
  }

  // ── AUTHENTICATION REQUIRED (NEW WINDOW / LOGGED OUT USERS) ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-[#faf7f2] text-[#1c1510] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[#fdfbf7] border border-[#ded3c5] rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#1c140f] border border-[#dec29b] text-[#dec29b] font-serif font-bold italic text-2xl flex items-center justify-center mx-auto shadow-md">
            B
          </div>
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#9e7d56] font-medium block">
              BHAI JEWELLER — BRADFORD
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1c1510]">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-[#7a6a5c] leading-relaxed max-w-xs mx-auto">
              Please log in or create an account to view your past orders, active deliveries, and personal details.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/login"
              className="w-full py-3.5 rounded-full bg-[#1c1510] text-[#f5efe8] hover:bg-[#33261d] font-medium text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <span>→</span>
            </Link>
            <Link
              href="/signup"
              className="w-full py-3.5 rounded-full bg-[#ede4d8] text-[#1c1510] hover:bg-[#ded3c5] font-medium text-xs tracking-wider uppercase transition-all border border-[#ded3c5] shadow-xs flex items-center justify-center gap-2"
            >
              <span>Create New Account</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-[#ede4d8] flex items-center justify-center gap-4 text-[11px] text-[#8a796c]">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Live Order Tracking
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Secure 256-bit DB
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── AUTHENTICATED USER VIEW ──
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1510] font-sans selection:bg-[#c5a059] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          HERO COVER BANNER & OVERLAPPING PROFILE CARD
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

        {/* Profile Details Overlay Card */}
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
                  {user.role === 'admin' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1c140f] border border-[#dec29b] text-[#dec29b] text-[10px] font-medium">
                      Admin
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#7a6a5c] font-normal">
                  <span>{user.email}</span>
                  {user.phone && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-[#9e7d56]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        {user.phone}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-start sm:self-end mt-2 sm:mt-0">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-full bg-[#1c140f] border border-[#dec29b] text-[#dec29b] text-xs font-medium hover:bg-[#2b1f17] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Admin Panel</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5 text-[#dec29b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span>Log Out</span>
              </button>
            </div>

          </div>
        </div>
      </div>


      {/* ─────────────────────────────────────────────────────────────
          MAIN GRID LAYOUT (Side Nav + Content + Widgets)
          ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT SIDEBAR NAVIGATION ── */}
          <aside className="lg:col-span-3 bg-[#faf7f2] border border-[#ded3c5] rounded-2xl p-3 shadow-xs sticky top-24">
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


          {/* ── CENTER CONTENT AREA (Dynamic Tab Views) ── */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* ═══════════════════════════════════════════════════════════
                TAB 1: MY ACCOUNT (Overview)
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'account' && (
              <>
                {/* STATS OVERVIEW CARDS */}
                <ScrollReveal direction="up" delay={50}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    
                    {/* Stat 1: Total Real Orders */}
                    <div 
                      onClick={() => setActiveTab('orders')}
                      className="bg-[#fdfbf7] border border-[#ded3c5] rounded-[5px] p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] cursor-pointer transition-colors text-center sm:text-left"
                    >
                      <div className="w-8 h-8 rounded-[5px] bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56] mb-3 mx-auto sm:mx-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Total Orders</span>
                        <span className="font-serif text-2xl text-[#1c1510] font-normal">
                          {ordersLoading ? '...' : realOrders.length}
                        </span>
                      </div>
                    </div>

                    {/* Stat 2: Real Wishlist Items */}
                    <div 
                      onClick={() => setActiveTab('wishlist')}
                      className="bg-[#fdfbf7] border border-[#ded3c5] rounded-[5px] p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] cursor-pointer transition-colors text-center sm:text-left"
                    >
                      <div className="w-8 h-8 rounded-[5px] bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56] mb-3 mx-auto sm:mx-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Wishlist</span>
                        <span className="font-serif text-2xl text-[#1c1510] font-normal">{wishlist.length}</span>
                      </div>
                    </div>

                    {/* Stat 3: Calculated Loyalty Points */}
                    <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-[5px] p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] transition-colors text-center sm:text-left">
                      <div className="w-8 h-8 rounded-[5px] bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56] mb-3 mx-auto sm:mx-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.486-.412.868-.839.605l-4.71-2.92a.562.562 0 00-.59 0l-4.71 2.92c-.427.263-.955-.119-.839-.605l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Points</span>
                        <span className="font-serif text-2xl text-[#1c1510] font-normal">{rewardPoints}</span>
                      </div>
                    </div>

                    {/* Stat 4: Member Status */}
                    <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-[5px] p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] transition-colors text-center sm:text-left">
                      <div className="w-8 h-8 rounded-[5px] bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56] mb-3 mx-auto sm:mx-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Membership</span>
                        <span className="font-serif text-sm text-[#1c1510] font-medium truncate block mt-1">
                          {user.memberSince}
                        </span>
                      </div>
                    </div>

                  </div>
                </ScrollReveal>

                {/* RECENT ORDERS SUMMARY */}
                <ScrollReveal direction="up" delay={90}>
                  <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-4 sm:p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4 border-b border-[#ede4d8] pb-3">
                      <h2 className="font-serif text-xl text-[#1c1510] font-normal">
                        Recent Orders ({ordersLoading ? '...' : realOrders.length})
                      </h2>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-[#9e7d56] font-medium hover:text-[#1c1510] transition-colors flex items-center gap-1"
                      >
                        <span>View All Orders</span>
                        <span>→</span>
                      </button>
                    </div>

                    {ordersLoading ? (
                      <div className="py-10 flex flex-col items-center justify-center text-center">
                        <div className="w-8 h-8 border-2 border-[#dec29b] border-t-transparent rounded-full animate-spin mb-3" />
                        <p className="text-xs text-[#8a796c]">Loading orders from database...</p>
                      </div>
                    ) : realOrders.length === 0 ? (
                      <div className="py-10 px-4 flex flex-col items-center justify-center text-center">
                        <div className="w-14 h-14 rounded-full bg-[#faf6ee] border border-[#ded3c5] flex items-center justify-center text-[#9e7d56] mb-3 shadow-xs">
                          <svg className="w-6 h-6 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                          </svg>
                        </div>
                        <h3 className="font-serif text-lg font-medium text-[#1c1510] mb-1">No Orders Placed Yet</h3>
                        <p className="text-xs text-[#8a796c] max-w-sm mb-4">
                          Browse our jewellery catalogue to view your purchases and delivery updates here.
                        </p>
                        <Link
                          href="/shop"
                          className="px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] hover:bg-[#33261d] text-xs font-medium transition-all shadow-sm"
                        >
                          Shop Collection
                        </Link>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#ede4d8]/60">
                        {realOrders.slice(0, 3).map((ord: any) => (
                          <div key={ord.id} className="flex items-center justify-between py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-[5px] overflow-hidden bg-white border border-[#ded3c5]">
                                <Image src="/images/detail-ring-hero.jpg" alt={ord.id} fill className="object-cover" />
                              </div>
                              <div>
                                <span className="font-mono text-xs font-medium text-[#1c1510] block">{ord.id}</span>
                                <span className="text-[10px] text-[#8a796c]">{ord.date} • {ord.items}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-serif text-sm font-medium text-[#1c1510] block">$ {Number(ord.amount || 0).toFixed(2)}</span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60 font-medium">
                                {ord.status || 'Processing'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════
                TAB 2: ORDERS & TRACKING
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'orders' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#ede4d8] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-[#1c1510] font-normal">Order History</h2>
                      <p className="text-xs text-[#8a796c] font-light mt-0.5">Track and view all your past fine jewellery purchases</p>
                    </div>
                    <Link
                      href="/shop"
                      className="px-4 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs hover:bg-[#33261d] transition-all font-medium"
                    >
                      Shop More
                    </Link>
                  </div>

                  {ordersLoading ? (
                    <div className="py-16 text-center">
                      <div className="w-10 h-10 border-3 border-[#dec29b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-xs text-[#8a796c]">Loading your database orders...</p>
                    </div>
                  ) : realOrders.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-[#faf6ee] border border-[#ded3c5] flex items-center justify-center text-[#9e7d56] mx-auto shadow-xs">
                        <svg className="w-8 h-8 stroke-[1.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-xl font-medium text-[#1c1510]">No Orders Found</h3>
                      <p className="text-xs text-[#8a796c] max-w-sm mx-auto">
                        Your completed purchases and bespoke jewellery orders will be recorded here in real time.
                      </p>
                      <Link
                        href="/shop"
                        className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all"
                      >
                        Explore Catalogue
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {realOrders.map((ord: any) => (
                        <div key={ord.id} className="border border-[#ded3c5] rounded-xl p-4 bg-white/70 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ede4d8] pb-3">
                            <div>
                              <span className="font-mono text-sm font-semibold text-[#1c1510]">{ord.id}</span>
                              <span className="text-xs text-[#8a796c] ml-3">Placed on {ord.date}</span>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                              ✓ {ord.status || 'Delivered'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-[#4a3b30]">
                            <div>
                              <p className="font-medium text-[#1c1510]">{ord.items}</p>
                              <p className="text-[11px] text-[#8a796c] mt-0.5">Shipping to: {ord.address || 'Standard Showroom Delivery'}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-serif text-base font-semibold text-[#1c1510] block">$ {Number(ord.amount || 0).toFixed(2)}</span>
                              <span className="text-[10px] text-[#8a796c]">{ord.paymentMethod || 'Card Payment'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* ═══════════════════════════════════════════════════════════
                TAB 3: WISHLIST
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'wishlist' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#ede4d8] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-[#1c1510] font-normal">My Wishlist ({wishlist.length})</h2>
                      <p className="text-xs text-[#8a796c] font-light mt-0.5">Save and manage your favorite handcrafted jewellery pieces</p>
                    </div>
                    <Link
                      href="/shop"
                      className="px-4 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs hover:bg-[#33261d] transition-all font-medium"
                    >
                      Browse More
                    </Link>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-[#faf6ee] border border-[#ded3c5] flex items-center justify-center text-[#9e7d56] mx-auto shadow-xs">
                        <svg className="w-8 h-8 stroke-[1.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-xl font-medium text-[#1c1510]">Your Wishlist is Empty</h3>
                      <p className="text-xs text-[#8a796c] max-w-sm mx-auto">
                        Explore our timeless rings, necklaces, earrings, and bracelets to add your favorite items here.
                      </p>
                      <Link
                        href="/shop"
                        className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all"
                      >
                        Explore Catalogue
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border border-[#ded3c5] rounded-xl p-4 bg-white/80 flex gap-3 items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#faf6ee] border border-[#ded3c5] flex-shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div>
                              <span className="text-[10px] text-[#9e7d56] uppercase tracking-wider block">{item.category}</span>
                              <h4 className="font-serif text-sm font-semibold text-[#1c1510] line-clamp-1">{item.name}</h4>
                              <span className="font-serif text-sm text-[#1c1510] font-medium block mt-1">$ {item.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAddToCart(item)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                addedMap[item.id]
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-[#1c1510] text-[#f5efe8] hover:bg-[#33261d]'
                              }`}
                            >
                              {addedMap[item.id] ? '✓ Added' : 'Add to Cart'}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-[10px] text-[#8a796c] hover:text-red-700 transition-colors text-center"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* ═══════════════════════════════════════════════════════════
                TAB 4: ADDRESSES
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'addresses' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#ede4d8] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-[#1c1510] font-normal">Shipping Addresses</h2>
                      <p className="text-xs text-[#8a796c] font-light mt-0.5">Manage your delivery and billing locations</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(true)}
                      className="px-4 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs hover:bg-[#33261d] transition-all font-medium flex items-center gap-1.5"
                    >
                      <span>+ Add Address</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="border border-[#ded3c5] rounded-xl p-4 bg-white/80 relative space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm font-semibold text-[#1c1510]">{addr.title}</span>
                          {addr.isDefault && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-medium border border-emerald-300">
                              Default Address
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#4a3b30] font-medium">{addr.name}</p>
                        <p className="text-xs text-[#7a6a5c] leading-relaxed">
                          {addr.street}, {addr.city}, {addr.postcode}, {addr.country}
                        </p>
                        <p className="text-xs text-[#7a6a5c]">Phone: {addr.phone}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Address Modal */}
                  {showAddAddressModal && (
                    <form onSubmit={handleAddAddress} className="border border-[#ded3c5] rounded-2xl p-5 bg-[#faf6ee] space-y-4">
                      <h3 className="font-serif text-base font-semibold text-[#1c1510]">Add New Shipping Address</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <input
                          type="text"
                          placeholder="Address Title (e.g. Home, Office)"
                          value={newAddress.title}
                          onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                          className="p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Recipient Full Name"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          className="p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          className="sm:col-span-2 p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Postcode"
                          value={newAddress.postcode}
                          onChange={(e) => setNewAddress({ ...newAddress, postcode: e.target.value })}
                          className="p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddAddressModal(false)}
                          className="px-4 py-2 rounded-full border border-[#ded3c5] text-xs text-[#6b5c50] hover:bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d]"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* ═══════════════════════════════════════════════════════════
                TAB 5: PAYMENT METHODS
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'payments' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#ede4d8] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-[#1c1510] font-normal">Payment Methods</h2>
                      <p className="text-xs text-[#8a796c] font-light mt-0.5">Secure payment options and cards</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddPaymentModal(true)}
                      className="px-4 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs hover:bg-[#33261d] transition-all font-medium flex items-center gap-1.5"
                    >
                      <span>+ Add Card</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paymentMethods.map((pm) => (
                      <div key={pm.id} className="relative bg-gradient-to-br from-[#1c1510] to-[#2d221a] text-[#f5efe8] rounded-2xl p-5 shadow-lg border border-[#dec29b]/40 flex flex-col justify-between min-h-[140px]">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm tracking-wider text-[#dec29b] font-semibold">{pm.type}</span>
                          {pm.isDefault && (
                            <span className="text-[9px] bg-[#dec29b]/20 text-[#dec29b] px-2 py-0.5 rounded-full border border-[#dec29b]/40">
                              Default Card
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-base tracking-[0.25em] text-[#ffffff] my-2">•••• •••• •••• {pm.last4}</p>
                        <div className="flex items-center justify-between text-[10px] text-[#c7b8aa]">
                          <span>{pm.holder}</span>
                          <span>EXP: {pm.expiry}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Payment Modal */}
                  {showAddPaymentModal && (
                    <form onSubmit={handleAddPayment} className="border border-[#ded3c5] rounded-2xl p-5 bg-[#faf6ee] space-y-4">
                      <h3 className="font-serif text-base font-semibold text-[#1c1510]">Add Payment Card</h3>
                      <div className="space-y-3 text-xs">
                        <input
                          type="text"
                          placeholder="Cardholder Name"
                          value={newCard.holder}
                          onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
                          className="w-full p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Card Number (16 Digits)"
                          maxLength={19}
                          value={newCard.cardNumber}
                          onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                          className="w-full p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={newCard.expiry}
                            onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                            className="p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                            required
                          />
                          <input
                            type="password"
                            placeholder="CVV"
                            maxLength={4}
                            value={newCard.cvv}
                            onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                            className="p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddPaymentModal(false)}
                          className="px-4 py-2 rounded-full border border-[#ded3c5] text-xs text-[#6b5c50] hover:bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d]"
                        >
                          Save Card
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* ═══════════════════════════════════════════════════════════
                TAB 6: RETURNS & REFUNDS
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'returns' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
                  <div className="border-b border-[#ede4d8] pb-4">
                    <h2 className="font-serif text-2xl text-[#1c1510] font-normal">Returns & Exchanges</h2>
                    <p className="text-xs text-[#8a796c] font-light mt-0.5">30-Day complimentary return & bespoke exchange policy</p>
                  </div>

                  <div className="bg-[#faf6ee] border border-[#ded3c5] rounded-xl p-5 space-y-3 text-xs text-[#5a4b40] leading-relaxed">
                    <h3 className="font-serif text-sm font-semibold text-[#1c1510]">Bhai Jeweller Guarantee</h3>
                    <p>
                      All genuine purchases from Bhai Jeweller Bradford showroom and online catalogue come with a 30-day money-back guarantee and complimentary inspection warranty.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[#7a6a5c]">
                      <li>Items must be unworn and in original luxury packaging</li>
                      <li>Certificate of authenticity & valuation invoice required</li>
                      <li>Refunds processed back to original payment within 3-5 working days</li>
                    </ul>
                  </div>

                  <div className="pt-2 text-center">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all"
                    >
                      <span>Contact Showroom for Return Request</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* ═══════════════════════════════════════════════════════════
                TAB 7: SETTINGS & SECURITY
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'settings' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
                  <div className="border-b border-[#ede4d8] pb-4">
                    <h2 className="font-serif text-2xl text-[#1c1510] font-normal">Account & Security</h2>
                    <p className="text-xs text-[#8a796c] font-light mt-0.5">Manage credentials, password and preferences</p>
                  </div>

                  {settingsSaved && (
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-300">
                      ✓ Profile details updated successfully!
                    </div>
                  )}

                  {passwordChanged && (
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-300">
                      ✓ Password updated successfully!
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3 bg-red-100 text-red-800 rounded-lg text-xs font-medium border border-red-300">
                      {passwordError}
                    </div>
                  )}

                  {/* Profile Form */}
                  <form onSubmit={(e) => { e.preventDefault(); setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 3000); }} className="space-y-4">
                    <h3 className="font-serif text-sm font-semibold text-[#1c1510]">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-[#8a796c] mb-1">Full Name</label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                          className="w-full p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#8a796c] mb-1">Email Address</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full p-3 bg-[#ede4d8]/40 border border-[#ded3c5] rounded-lg text-[#7a6a5c] cursor-not-allowed"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-[#8a796c] mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={user.phone}
                          onChange={(e) => setUser({ ...user, phone: e.target.value })}
                          className="w-full p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all"
                    >
                      Save Profile
                    </button>
                  </form>

                  {/* Password Form */}
                  <form onSubmit={handlePasswordSubmit} className="pt-6 border-t border-[#ede4d8] space-y-4">
                    <h3 className="font-serif text-sm font-semibold text-[#1c1510]">Change Password</h3>
                    <div className="space-y-3 text-xs">
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                      />
                      <input
                        type="password"
                        placeholder="New Password (min 8 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 bg-white border border-[#ded3c5] rounded-lg focus:outline-none focus:border-[#1c1510]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-[#ede4d8] text-[#1c1510] text-xs font-medium hover:bg-[#ded3c5] transition-all border border-[#ded3c5]"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            )}

          </div>


          {/* ── RIGHT WIDGET COLUMN (Desktop Quick Links) ── */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* QUICK LINKS CARD */}
            <ScrollReveal direction="up" delay={160}>
              <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-5 shadow-2xs space-y-3">
                <h3 className="font-serif text-sm text-[#1c1510] font-medium border-b border-[#ede4d8] pb-2">
                  Client Services
                </h3>
                <nav className="space-y-1 text-xs">
                  <Link href="/shop" className="flex items-center justify-between p-2 rounded-lg hover:bg-[#faf6ee] text-[#6b5c50] hover:text-[#1c1510] transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-[#9e7d56]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0C2.678 5.572 2.25 6.052 2.25 6.62v.958" />
                      </svg>
                      Browse Catalogue
                    </span>
                    <span>›</span>
                  </Link>

                  <Link href="/locations/bradford" className="flex items-center justify-between p-2 rounded-lg hover:bg-[#faf6ee] text-[#6b5c50] hover:text-[#1c1510] transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-[#9e7d56]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      Bradford Showroom
                    </span>
                    <span>›</span>
                  </Link>

                  <Link href="/return-policy" className="flex items-center justify-between p-2 rounded-lg hover:bg-[#faf6ee] text-[#6b5c50] hover:text-[#1c1510] transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-[#9e7d56]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Return & Refund Policy
                    </span>
                    <span>›</span>
                  </Link>

                  <Link href="/contact" className="flex items-center justify-between p-2 rounded-lg hover:bg-[#faf6ee] text-[#6b5c50] hover:text-[#1c1510] transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-[#9e7d56]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.008v.008H12V18z" />
                      </svg>
                      Need Help?
                    </span>
                    <span>›</span>
                  </Link>
                </nav>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </main>

    </div>
  );
}
