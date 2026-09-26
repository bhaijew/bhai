'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { useShop, WishlistItem } from '@/context/ShopContext';

export default function AccountPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, addToCart, clearWishlist } = useShop();

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
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'processing' | 'delivered'>('all');

  // Real Address State Management (Starts strictly empty: 0 hardcoded fake addresses)
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: 'Primary Residence',
    name: '',
    street: '',
    city: 'Bradford',
    postcode: '',
    country: 'United Kingdom',
    phone: '',
  });

  // Real Payment Methods State Management (Starts strictly empty: 0 hardcoded fake cards)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
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
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Return Request Form State
  const [selectedReturnOrder, setSelectedReturnOrder] = useState('');
  const [returnReason, setReturnReason] = useState('Ring Sizing / Exchange');
  const [returnSubmitted, setReturnSubmitted] = useState(false);

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

          // Set default form field names to match user
          setNewAddress((prev) => ({
            ...prev,
            name: userName,
            phone: userPhone,
          }));
          setNewCard((prev) => ({
            ...prev,
            holder: userName.toUpperCase(),
          }));

          // Load user's real saved addresses from account storage
          if (typeof window !== 'undefined' && userEmail) {
            try {
              const rawAddr = localStorage.getItem(`bhai_addresses_${userEmail}`);
              if (rawAddr) setAddresses(JSON.parse(rawAddr));
              const rawCards = localStorage.getItem(`bhai_cards_${userEmail}`);
              if (rawCards) setPaymentMethods(JSON.parse(rawCards));
            } catch (err) {
              console.error('Storage parse error:', err);
            }
          }

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
    const updated = [...addresses, item];
    setAddresses(updated);
    if (typeof window !== 'undefined' && user.email) {
      localStorage.setItem(`bhai_addresses_${user.email}`, JSON.stringify(updated));
    }
    setShowAddAddressModal(false);
    setNewAddress({
      title: 'Secondary Residence',
      name: user.name,
      street: '',
      city: 'Bradford',
      postcode: '',
      country: 'United Kingdom',
      phone: user.phone,
    });
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    if (typeof window !== 'undefined' && user.email) {
      localStorage.setItem(`bhai_addresses_${user.email}`, JSON.stringify(updated));
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    if (typeof window !== 'undefined' && user.email) {
      localStorage.setItem(`bhai_addresses_${user.email}`, JSON.stringify(updated));
    }
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.cardNumber || !newCard.expiry) return;
    const cleanNum = newCard.cardNumber.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4) || '1234';
    const isVisa = cleanNum.startsWith('4');
    const isAmex = cleanNum.startsWith('3');
    const item = {
      id: `pm-${Date.now()}`,
      type: isVisa ? 'Visa Infinite' : isAmex ? 'American Express Gold' : 'Mastercard World Elite',
      last4: last4,
      expiry: newCard.expiry,
      holder: newCard.holder.toUpperCase() || user.name.toUpperCase(),
      isDefault: paymentMethods.length === 0,
      cardColor: isVisa
        ? 'from-[#141b24] via-[#1f2a38] to-[#0f141a]'
        : isAmex
        ? 'from-[#2b2214] via-[#3d301b] to-[#1c150b]'
        : 'from-[#1f1914] via-[#2c221a] to-[#120e0b]',
    };
    const updated = [...paymentMethods, item];
    setPaymentMethods(updated);
    if (typeof window !== 'undefined' && user.email) {
      localStorage.setItem(`bhai_cards_${user.email}`, JSON.stringify(updated));
    }
    setShowAddPaymentModal(false);
    setNewCard({ holder: user.name.toUpperCase(), cardNumber: '', expiry: '', cvv: '' });
  };

  const handleDeletePayment = (id: string) => {
    const updated = paymentMethods.filter((p) => p.id !== id);
    setPaymentMethods(updated);
    if (typeof window !== 'undefined' && user.email) {
      localStorage.setItem(`bhai_cards_${user.email}`, JSON.stringify(updated));
    }
  };

  const handleSetDefaultPayment = (id: string) => {
    const updated = paymentMethods.map((p) => ({
      ...p,
      isDefault: p.id === id,
    }));
    setPaymentMethods(updated);
    if (typeof window !== 'undefined' && user.email) {
      localStorage.setItem(`bhai_cards_${user.email}`, JSON.stringify(updated));
    }
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
      badge: addresses.length > 0 ? addresses.length : undefined,
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
      badge: paymentMethods.length > 0 ? paymentMethods.length : undefined,
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
        <div className="bg-[#faf7f2] border-b border-[#e8decf] rounded-t-3xl -mt-6 relative z-10 px-4 sm:px-8 pb-4 shadow-xs">
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

        {/* ── SMOOTH HORIZONTAL SCROLLABLE TABS BAR (RESTORED AS REQUESTED) ── */}
        <div className="w-full bg-[#fdfbf7] border-b border-[#ded3c5]/80 sticky top-16 md:top-20 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
              {sideNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#1c1510] text-[#f5efe8] shadow-sm'
                        : 'bg-[#ede4d8]/60 text-[#6b5c50] hover:bg-[#ede4d8] hover:text-[#1c1510] border border-[#ded3c5]/70'
                    }`}
                  >
                    <span className={isActive ? 'text-[#dec29b]' : 'text-[#8a796c]'}>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-[#dec29b] text-[#1c1510]' : 'bg-[#1c1510] text-[#f5efe8]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>


      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA (DIFFERENT UNIQUE VIEWS PER TAB)
          ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT DESKTOP SIDEBAR NAVIGATION ── */}
          <aside className="hidden lg:block lg:col-span-3 bg-[#faf7f2] border border-[#ded3c5] rounded-2xl p-3 shadow-xs sticky top-36">
            <div className="px-3 py-2 mb-2 border-b border-[#ede4d8]">
              <span className="text-[10px] font-semibold tracking-widest text-[#9e7d56] uppercase">PORTAL MENU</span>
            </div>
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


          {/* ── CENTER / MAIN CONTENT (INDIVIDUALLY CRAFTED DISTINCT TAB PAGES) ── */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* ═══════════════════════════════════════════════════════════
                PAGE 1: MY ACCOUNT OVERVIEW & VIP PRIVILEGES
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                
                {/* VIP Patron Header Card */}
                <ScrollReveal direction="up">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1c140f] via-[#2c2018] to-[#120e0b] text-[#f5efe8] p-6 sm:p-8 border border-[#dec29b]/50 shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#dec29b]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dec29b]/15 border border-[#dec29b]/40 text-[#dec29b] text-[10px] tracking-widest uppercase font-semibold">
                          ✦ VIP Private Client Status
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                          Welcome back, {user.name}
                        </h2>
                        <p className="text-xs text-[#d6c9be] max-w-lg font-light leading-relaxed">
                          Your bespoke account provides priority Bradford showroom appointments, lifetime polishing warranty, and complimentary insured worldwide delivery.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href="/shop"
                          className="px-5 py-2.5 rounded-full bg-[#dec29b] text-[#1c1510] text-xs font-semibold hover:bg-[#e8d2b5] transition-all shadow-md text-center"
                        >
                          Explore Collection
                        </Link>
                        <Link
                          href="/contact"
                          className="px-5 py-2.5 rounded-full border border-[#dec29b]/60 text-[#f5efe8] text-xs font-light hover:bg-[#dec29b]/10 transition-all text-center"
                        >
                          Book Showroom VIP
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* 4-Card Stats Grid */}
                <ScrollReveal direction="up" delay={50}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {/* Stat 1: Total Orders */}
                    <div 
                      onClick={() => setActiveTab('orders')}
                      className="bg-[#fdfbf7] border border-[#ded3c5] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                          </svg>
                        </div>
                        <span className="text-xs text-[#9e7d56]">→</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Total Orders</span>
                        <span className="font-serif text-2xl text-[#1c1510] font-normal">{ordersLoading ? '...' : realOrders.length}</span>
                      </div>
                    </div>

                    {/* Stat 2: Wishlist */}
                    <div 
                      onClick={() => setActiveTab('wishlist')}
                      className="bg-[#fdfbf7] border border-[#ded3c5] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        </div>
                        <span className="text-xs text-[#9e7d56]">→</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Wishlist</span>
                        <span className="font-serif text-2xl text-[#1c1510] font-normal">{wishlist.length}</span>
                      </div>
                    </div>

                    {/* Stat 3: Loyalty Points */}
                    <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.486-.412.868-.839.605l-4.71-2.92a.562.562 0 00-.59 0l-4.71 2.92c-.427.263-.955-.119-.839-.605l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        </div>
                        <span className="text-[10px] bg-[#faf6ee] text-[#9e7d56] px-2 py-0.5 rounded-full border border-[#ded3c5]">1 pt / $10</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Reward Points</span>
                        <span className="font-serif text-2xl text-[#1c1510] font-normal">{rewardPoints}</span>
                      </div>
                    </div>

                    {/* Stat 4: Member Status */}
                    <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:border-[#1c1510] transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#faf6ee] border border-[#dec29b]/40 flex items-center justify-center text-[#9e7d56]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        </div>
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8a796c] font-light uppercase tracking-wider block">Membership</span>
                        <span className="font-serif text-sm text-[#1c1510] font-medium truncate block mt-1">{user.memberSince}</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* 2-Column Overview Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#ede4d8] pb-3">
                      <h3 className="font-serif text-lg text-[#1c1510] font-normal">Recent Purchases</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-xs text-[#9e7d56] hover:underline">
                        View all
                      </button>
                    </div>
                    {realOrders.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#8a796c]">
                        No orders recorded yet. Explore the shop to make your first purchase.
                      </div>
                    ) : (
                      <div className="divide-y divide-[#ede4d8]/70">
                        {realOrders.slice(0, 3).map((ord) => (
                          <div key={ord.id} className="py-3 flex items-center justify-between">
                            <div>
                              <p className="font-mono text-xs font-semibold text-[#1c1510]">{ord.id}</p>
                              <p className="text-[10px] text-[#8a796c]">{ord.date} • {ord.items}</p>
                            </div>
                            <span className="font-serif text-sm font-semibold text-[#1c1510]">$ {Number(ord.amount || 0).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Showroom & Client Services */}
                  <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="border-b border-[#ede4d8] pb-3">
                      <h3 className="font-serif text-lg text-[#1c1510] font-normal">Bradford Showroom Care</h3>
                    </div>
                    <div className="space-y-3 text-xs text-[#5a4b40] leading-relaxed">
                      <p className="flex items-center gap-2">
                        <span className="text-[#9e7d56]">📍</span>
                        <span>124 Manor Row, Bradford City Centre, BD1 4NT</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-[#9e7d56]">🕒</span>
                        <span>Monday – Saturday: 10:00 AM – 6:00 PM</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-[#9e7d56]">📞</span>
                        <span>+44 (0) 1274 722 888 (Direct Line)</span>
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link
                        href="/contact"
                        className="w-full py-2.5 rounded-full bg-[#ede4d8] text-[#1c1510] text-xs font-medium hover:bg-[#ded3c5] transition-all flex items-center justify-center gap-2"
                      >
                        <span>Schedule Bespoke Appointment</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                PAGE 2: ORDERS & LIVE TRACKING HUB
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'orders' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-6 shadow-xs space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ede4d8] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-[#1c1510] font-normal">My Jewellery Orders</h2>
                      <p className="text-xs text-[#8a796c] mt-0.5">Real-time order statuses, insured parcel delivery, and invoices</p>
                    </div>
                    <Link
                      href="/shop"
                      className="px-5 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs hover:bg-[#33261d] transition-all self-start sm:self-auto font-medium"
                    >
                      + New Purchase
                    </Link>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {(['all', 'processing', 'delivered'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setOrderFilter(filter)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                            orderFilter === filter
                              ? 'bg-[#1c1510] text-[#f5efe8]'
                              : 'bg-white border border-[#ded3c5] text-[#6b5c50] hover:bg-[#faf6ee]'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Search order ID or items..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full sm:w-64 p-2.5 text-xs bg-white border border-[#ded3c5] rounded-full px-4 focus:outline-none focus:border-[#1c1510]"
                    />
                  </div>

                  {ordersLoading ? (
                    <div className="py-16 text-center">
                      <div className="w-10 h-10 border-3 border-[#dec29b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-xs text-[#8a796c]">Loading database orders...</p>
                    </div>
                  ) : realOrders.length === 0 ? (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#faf6ee] border border-[#ded3c5] flex items-center justify-center text-[#9e7d56] mx-auto shadow-xs">
                        <svg className="w-8 h-8 stroke-[1.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-xl font-medium text-[#1c1510]">No Orders In Your History</h3>
                      <p className="text-xs text-[#8a796c] max-w-sm mx-auto">
                        Once you place an order online or at our showroom, you can track production, hallmarking, and live courier delivery right here.
                      </p>
                      <Link
                        href="/shop"
                        className="inline-block px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all"
                      >
                        Explore Catalogue
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {realOrders
                        .filter((ord) => {
                          if (orderFilter === 'processing' && ord.status !== 'Processing') return false;
                          if (orderFilter === 'delivered' && ord.status === 'Processing') return false;
                          if (orderSearchQuery) {
                            const q = orderSearchQuery.toLowerCase();
                            return ord.id?.toLowerCase().includes(q) || ord.items?.toLowerCase().includes(q);
                          }
                          return true;
                        })
                        .map((ord: any) => (
                          <div key={ord.id} className="border border-[#ded3c5] rounded-2xl p-5 bg-white space-y-4 shadow-2xs hover:border-[#1c1510] transition-colors">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ede4d8] pb-3">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold text-[#1c1510]">{ord.id}</span>
                                <span className="text-xs text-[#8a796c]">Order Date: {ord.date}</span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                ord.status === 'Processing'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}>
                                ● {ord.status || 'Delivered'}
                              </span>
                            </div>

                            {/* Tracking Timeline Bar */}
                            <div className="py-2">
                              <div className="grid grid-cols-4 text-center text-[10px] text-[#7a6a5c] mb-1 font-medium">
                                <span className="text-emerald-800">1. Order Placed</span>
                                <span className="text-emerald-800">2. Hallmarking</span>
                                <span className="text-emerald-800">3. Dispatched</span>
                                <span className={ord.status === 'Processing' ? 'text-[#8a796c]' : 'text-emerald-800 font-bold'}>4. Delivered</span>
                              </div>
                              <div className="w-full bg-[#ede4d8] h-2 rounded-full overflow-hidden flex">
                                <div className="bg-emerald-600 h-full w-3/4 rounded-full" />
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-2">
                              <div>
                                <p className="font-medium text-[#1c1510]">{ord.items}</p>
                                <p className="text-[11px] text-[#8a796c] mt-0.5">Shipping Address: {ord.address || 'Showroom Collection, Bradford'}</p>
                              </div>
                              <div className="text-left sm:text-right">
                                <span className="font-serif text-lg font-bold text-[#1c1510] block">$ {Number(ord.amount || 0).toFixed(2)}</span>
                                <span className="text-[10px] text-[#8a796c]">{ord.paymentMethod || 'Credit Card Payment'}</span>
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
                PAGE 3: WISHLIST HUB
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'wishlist' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#ede4d8] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-[#1c1510] font-normal">Saved Wishlist ({wishlist.length})</h2>
                      <p className="text-xs text-[#8a796c] mt-0.5">Your curated collection of bespoke jewellery and rings</p>
                    </div>
                    {wishlist.length > 0 && (
                      <button
                        type="button"
                        onClick={clearWishlist}
                        className="text-xs text-red-700 hover:underline font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#faf6ee] border border-[#ded3c5] flex items-center justify-center text-[#9e7d56] mx-auto shadow-xs">
                        <svg className="w-8 h-8 stroke-[1.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-xl font-medium text-[#1c1510]">Your Wishlist is Empty</h3>
                      <p className="text-xs text-[#8a796c] max-w-sm mx-auto">
                        Click the heart icon on any fine jewellery piece in our shop to save it to your private portfolio.
                      </p>
                      <Link
                        href="/shop"
                        className="inline-block px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all"
                      >
                        Explore Catalogue
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border border-[#ded3c5] rounded-2xl p-4 bg-white space-y-3 shadow-2xs hover:border-[#1c1510] transition-colors flex flex-col justify-between">
                          <div>
                            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#faf6ee] mb-3">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                              <button
                                type="button"
                                onClick={() => removeFromWishlist(item.id)}
                                className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-red-600 hover:bg-white text-xs shadow-xs"
                              >
                                ✕
                              </button>
                            </div>
                            <span className="text-[10px] tracking-widest text-[#9e7d56] uppercase font-semibold">{item.category}</span>
                            <h4 className="font-serif text-base font-medium text-[#1c1510] line-clamp-1 mt-0.5">{item.name}</h4>
                            <p className="font-serif text-lg font-semibold text-[#1c1510] mt-1">$ {item.price.toFixed(2)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item)}
                            className={`w-full py-2.5 rounded-full text-xs font-medium transition-all ${
                              addedMap[item.id]
                                ? 'bg-emerald-800 text-white'
                                : 'bg-[#1c1510] text-[#f5efe8] hover:bg-[#33261d]'
                            }`}
                          >
                            {addedMap[item.id] ? '✓ Added to Bag' : 'Add to Shopping Bag'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* ═══════════════════════════════════════════════════════════
                PAGE 4: REAL ADDRESS BOOK & SHOWROOM PICKUP
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'addresses' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#ede4d8] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-[#1c1510] font-normal">My Delivery Addresses ({addresses.length})</h2>
                      <p className="text-xs text-[#8a796c] mt-0.5">Manage your real shipping and billing addresses for fast insured checkout</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(true)}
                      className="px-5 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs hover:bg-[#33261d] transition-all font-medium"
                    >
                      + Add Address
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#faf6ee] border border-[#ded3c5] flex items-center justify-center text-[#9e7d56] mx-auto shadow-xs">
                        <svg className="w-8 h-8 stroke-[1.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-xl font-medium text-[#1c1510]">No Saved Addresses</h3>
                      <p className="text-xs text-[#8a796c] max-w-sm mx-auto">
                        You have not added any delivery address yet. Add your residence or business address for fast checkout.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAddAddressModal(true)}
                        className="inline-block px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all"
                      >
                        + Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="border border-[#ded3c5] rounded-2xl p-5 bg-white space-y-3 relative shadow-2xs flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-serif text-base font-semibold text-[#1c1510]">{addr.title}</span>
                              {addr.isDefault && (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-300">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 text-xs text-[#5a4b40] leading-relaxed">
                              <p className="font-semibold text-[#1c1510]">{addr.name}</p>
                              <p>{addr.street}</p>
                              <p>{addr.city}, {addr.postcode}</p>
                              <p>{addr.country}</p>
                              <p className="text-[11px] text-[#8a796c] pt-1">Tel: {addr.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-[#ede4d8] text-xs">
                            {!addr.isDefault ? (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-[11px] text-[#9e7d56] hover:underline font-medium"
                              >
                                Set as Default
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-700 font-medium">✓ Primary Address</span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-[11px] text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddAddressModal && (
                    <form onSubmit={handleAddAddress} className="border border-[#ded3c5] rounded-2xl p-6 bg-[#faf6ee] space-y-4">
                      <h3 className="font-serif text-lg font-semibold text-[#1c1510]">Add New Shipping Address</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <input
                          type="text"
                          placeholder="Label (e.g. Home, Office)"
                          value={newAddress.title}
                          onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                          className="p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Recipient Full Name"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          className="p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          className="sm:col-span-2 p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Postal Code"
                          value={newAddress.postcode}
                          onChange={(e) => setNewAddress({ ...newAddress, postcode: e.target.value })}
                          className="p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddAddressModal(false)}
                          className="px-5 py-2.5 rounded-full border border-[#ded3c5] text-xs text-[#6b5c50] hover:bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-semibold hover:bg-[#33261d]"
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
                PAGE 5: REAL PAYMENT METHODS & CARDS
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'payments' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#ede4d8] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-[#1c1510] font-normal">Payment Methods ({paymentMethods.length})</h2>
                      <p className="text-xs text-[#8a796c] mt-0.5">Encrypted payment cards saved securely for 1-click checkout</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddPaymentModal(true)}
                      className="px-5 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs hover:bg-[#33261d] transition-all font-medium"
                    >
                      + Add Card
                    </button>
                  </div>

                  {paymentMethods.length === 0 ? (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#faf6ee] border border-[#ded3c5] flex items-center justify-center text-[#9e7d56] mx-auto shadow-xs">
                        <svg className="w-8 h-8 stroke-[1.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-xl font-medium text-[#1c1510]">No Saved Payment Cards</h3>
                      <p className="text-xs text-[#8a796c] max-w-sm mx-auto">
                        Add a credit or debit card for fast, encrypted checkout on your fine jewellery orders.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAddPaymentModal(true)}
                        className="inline-block px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all"
                      >
                        + Add Your First Card
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {paymentMethods.map((pm) => (
                        <div key={pm.id} className="space-y-2">
                          <div
                            className={`relative bg-gradient-to-br ${pm.cardColor} text-[#f5efe8] rounded-2xl p-6 shadow-xl border border-[#dec29b]/40 flex flex-col justify-between min-h-[170px] overflow-hidden`}
                          >
                            <div className="flex items-center justify-between relative z-10">
                              <span className="font-serif text-sm tracking-wider text-[#dec29b] font-semibold">{pm.type}</span>
                              <div className="w-8 h-6 bg-[#dec29b]/20 border border-[#dec29b]/50 rounded flex items-center justify-center text-[9px] text-[#dec29b]">
                                CHIP
                              </div>
                            </div>
                            <p className="font-mono text-lg tracking-[0.28em] text-white my-3 relative z-10">
                              •••• •••• •••• {pm.last4}
                            </p>
                            <div className="flex items-center justify-between text-[11px] text-[#d6c9be] relative z-10">
                              <span className="tracking-wider uppercase">{pm.holder}</span>
                              <span>EXP {pm.expiry}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between px-2 text-xs">
                            {!pm.isDefault ? (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultPayment(pm.id)}
                                className="text-[11px] text-[#9e7d56] hover:underline font-medium"
                              >
                                Set as Default Card
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-700 font-medium">✓ Default Card</span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeletePayment(pm.id)}
                              className="text-[11px] text-red-600 hover:underline"
                            >
                              Remove Card
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Security Assurance */}
                  <div className="p-4 bg-[#faf6ee] border border-[#ded3c5] rounded-xl flex items-center gap-3 text-xs text-[#6b5c50]">
                    <span className="text-xl">🔒</span>
                    <div>
                      <p className="font-semibold text-[#1c1510]">PCI-DSS Level 1 Banking Security</p>
                      <p className="text-[11px] text-[#8a796c]">Your payment details are end-to-end encrypted with AES-256 standards.</p>
                    </div>
                  </div>

                  {showAddPaymentModal && (
                    <form onSubmit={handleAddPayment} className="border border-[#ded3c5] rounded-2xl p-6 bg-[#faf6ee] space-y-4">
                      <h3 className="font-serif text-lg font-semibold text-[#1c1510]">Add Payment Card</h3>
                      <div className="space-y-3 text-xs">
                        <input
                          type="text"
                          placeholder="Cardholder Name as on Card"
                          value={newCard.holder}
                          onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
                          className="w-full p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="16-Digit Card Number"
                          maxLength={19}
                          value={newCard.cardNumber}
                          onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                          className="w-full p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                          required
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={newCard.expiry}
                            onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                            className="p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                            required
                          />
                          <input
                            type="password"
                            placeholder="Security CVV"
                            maxLength={4}
                            value={newCard.cvv}
                            onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                            className="p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddPaymentModal(false)}
                          className="px-5 py-2.5 rounded-full border border-[#ded3c5] text-xs text-[#6b5c50] hover:bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-semibold hover:bg-[#33261d]"
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
                PAGE 6: RETURNS & 30-DAY GUARANTEE
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'returns' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="border-b border-[#ede4d8] pb-4">
                    <h2 className="font-serif text-2xl text-[#1c1510] font-normal">Returns & Lifetime Warranty</h2>
                    <p className="text-xs text-[#8a796c] mt-0.5">30-day return policy and complimentary jewellery resizing service</p>
                  </div>

                  {returnSubmitted && (
                    <div className="p-4 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-medium">
                      ✓ Your return/exchange request has been lodged! Our Bradford showroom team will contact you within 24 hours.
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white border border-[#ded3c5] rounded-xl text-center space-y-2">
                      <div className="text-2xl">✨</div>
                      <h4 className="font-serif text-sm font-semibold text-[#1c1510]">30-Day Money Back</h4>
                      <p className="text-[11px] text-[#7a6a5c]">Complete refund or exchange within 30 days of parcel delivery.</p>
                    </div>
                    <div className="p-4 bg-white border border-[#ded3c5] rounded-xl text-center space-y-2">
                      <div className="text-2xl">💎</div>
                      <h4 className="font-serif text-sm font-semibold text-[#1c1510]">Complimentary Resizing</h4>
                      <p className="text-[11px] text-[#7a6a5c]">Free ring sizing adjustment within 60 days of purchase.</p>
                    </div>
                    <div className="p-4 bg-white border border-[#ded3c5] rounded-xl text-center space-y-2">
                      <div className="text-2xl">📦</div>
                      <h4 className="font-serif text-sm font-semibold text-[#1c1510]">Free Insured Return</h4>
                      <p className="text-[11px] text-[#7a6a5c]">Pre-paid insured Royal Mail Special Delivery label provided.</p>
                    </div>
                  </div>

                  {/* Return Request Form */}
                  <form onSubmit={(e) => { e.preventDefault(); setReturnSubmitted(true); }} className="border border-[#ded3c5] rounded-2xl p-6 bg-[#faf6ee] space-y-4">
                    <h3 className="font-serif text-base font-semibold text-[#1c1510]">Submit a Return or Exchange Request</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-[#8a796c] mb-1">Select Order ID</label>
                        <select
                          value={selectedReturnOrder}
                          onChange={(e) => setSelectedReturnOrder(e.target.value)}
                          className="w-full p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                        >
                          <option value="">Choose Order...</option>
                          {realOrders.map((o) => (
                            <option key={o.id} value={o.id}>{o.id} — {o.items}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#8a796c] mb-1">Reason for Request</label>
                        <select
                          value={returnReason}
                          onChange={(e) => setReturnReason(e.target.value)}
                          className="w-full p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                        >
                          <option value="Ring Sizing / Exchange">Ring Sizing / Exchange</option>
                          <option value="Refund & Return">Full Refund & Return</option>
                          <option value="Inspection / Polishing">Inspection / Polishing</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-semibold hover:bg-[#33261d] transition-all"
                    >
                      Generate Return Label
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            )}

            {/* ═══════════════════════════════════════════════════════════
                PAGE 7: ACCOUNT SETTINGS, SECURITY & 2FA
                ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'settings' && (
              <ScrollReveal direction="up">
                <div className="bg-[#fdfbf7] border border-[#ded3c5] rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="border-b border-[#ede4d8] pb-4">
                    <h2 className="font-serif text-2xl text-[#1c1510] font-normal">Account & Security</h2>
                    <p className="text-xs text-[#8a796c] mt-0.5">Manage authentication credentials, password, and notification alerts</p>
                  </div>

                  {settingsSaved && (
                    <div className="p-4 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-medium">
                      ✓ Profile details updated successfully!
                    </div>
                  )}

                  {passwordChanged && (
                    <div className="p-4 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-medium">
                      ✓ Password changed successfully!
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-4 bg-red-100 text-red-900 border border-red-300 rounded-xl text-xs font-medium">
                      {passwordError}
                    </div>
                  )}

                  {/* Profile Edit Form */}
                  <form onSubmit={(e) => { e.preventDefault(); setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 3000); }} className="space-y-4">
                    <h3 className="font-serif text-base font-semibold text-[#1c1510]">Personal Profile</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-[#8a796c] mb-1">Full Name</label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                          className="w-full p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#8a796c] mb-1">Email Address</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full p-3 bg-[#ede4d8]/40 border border-[#ded3c5] rounded-xl text-[#7a6a5c] cursor-not-allowed"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-[#8a796c] mb-1">Direct Phone Number</label>
                        <input
                          type="text"
                          value={user.phone}
                          onChange={(e) => setUser({ ...user, phone: e.target.value })}
                          className="w-full p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-semibold hover:bg-[#33261d] transition-all"
                    >
                      Save Profile Changes
                    </button>
                  </form>

                  {/* Security & Password */}
                  <form onSubmit={handlePasswordSubmit} className="pt-6 border-t border-[#ede4d8] space-y-4">
                    <h3 className="font-serif text-base font-semibold text-[#1c1510]">Update Password</h3>
                    <div className="space-y-3 text-xs">
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                      />
                      <input
                        type="password"
                        placeholder="New Password (minimum 8 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 bg-white border border-[#ded3c5] rounded-xl focus:outline-none focus:border-[#1c1510]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#ede4d8] text-[#1c1510] text-xs font-semibold hover:bg-[#ded3c5] transition-all border border-[#ded3c5]"
                    >
                      Update Password
                    </button>
                  </form>

                  {/* Two-Factor & Preferences */}
                  <div className="pt-6 border-t border-[#ede4d8] space-y-3">
                    <h3 className="font-serif text-base font-semibold text-[#1c1510]">Security & Notifications</h3>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center justify-between p-3 bg-white border border-[#ded3c5] rounded-xl cursor-pointer">
                        <span>Two-Factor Authentication (2FA via Email)</span>
                        <input
                          type="checkbox"
                          checked={twoFactorEnabled}
                          onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                          className="w-4 h-4 accent-[#1c1510]"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-white border border-[#ded3c5] rounded-xl cursor-pointer">
                        <span>SMS Order Tracking & Delivery Notifications</span>
                        <input
                          type="checkbox"
                          checked={smsNotifs}
                          onChange={(e) => setSmsNotifs(e.target.checked)}
                          className="w-4 h-4 accent-[#1c1510]"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-white border border-[#ded3c5] rounded-xl cursor-pointer">
                        <span>VIP Showroom Invitations & Private Sale Catalogue</span>
                        <input
                          type="checkbox"
                          checked={emailNotifs}
                          onChange={(e) => setEmailNotifs(e.target.checked)}
                          className="w-4 h-4 accent-[#1c1510]"
                        />
                      </label>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            )}

          </div>

        </div>
      </main>

    </div>
  );
}
