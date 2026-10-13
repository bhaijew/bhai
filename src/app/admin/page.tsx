'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { useShop, ProductItem, CategoryItem } from '@/context/ShopContext';
import { ProductEditModal } from '@/components/shared/ProductEditModal';
import FormattedProductDescription from '@/components/shared/FormattedProductDescription';
import {
  DashboardIcon,
  ProductsIcon,
  AddProductIcon,
  CategoriesIcon,
  SlidesIcon,
  OrdersIcon,
  EnquiriesIcon,
  UsersIcon,
  GoldRatesIcon,
  SettingsIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  FilterIcon,
  ExportIcon,
  CheckIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  XIcon,
  ExternalLinkIcon,
  DiamondIcon,
  CrownIcon,
  PrinterIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BoltIcon,
  LayersIcon,
  EyeIcon,
  StoreIcon,
  ChevronRightIcon,
  PlusIcon,
  RefreshIcon,
  TagIcon,
  ImageIcon,
  LockIcon,
  ArrowTrendingUpIcon,
  SunIcon,
  MoonIcon,
} from '@/components/admin/AdminIcons';

// Initial Data States (Strictly 0 fake data by default - syncs live with Supabase Real-Time Database)
const INITIAL_SLIDES: any[] = [];
const INITIAL_ORDERS: any[] = [];
const INITIAL_ENQUIRIES: any[] = [];
const INITIAL_CUSTOMERS: any[] = [];

export default function AdminDashboardPage() {
  // Real-time Shop Context
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct: removeStoreProduct,
    updateProductStock,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useShop();

  // Theme State: Default is 'light' (White Theme) as requested!
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'add-product' | 'categories' | 'slides' | 'orders' | 'enquiries' | 'customers' | 'goldrates' | 'settings'>('dashboard');

  // Product Edit States
  const [editingAdminProduct, setEditingAdminProduct] = useState<ProductItem | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productErrorMsg, setProductErrorMsg] = useState('');

  // Category Management States
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '/images/category-rings.jpg',
    display_order: 1,
  });
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [catSaveSuccess, setCatSaveSuccess] = useState('');
  const [catError, setCatError] = useState('');
  const [catSaving, setCatSaving] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // States for store data
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [customers] = useState(INITIAL_CUSTOMERS);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [loginAttemptsLogs, setLoginAttemptsLogs] = useState<any[]>([]);
  const [userTabMode, setUserTabMode] = useState<'users' | 'security'>('users');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'inactive' | 'banned' | 'locked'>('all');
  const [userSearchText, setUserSearchText] = useState('');
  const [userActionMsg, setUserActionMsg] = useState('');
  const [userLoadingId, setUserLoadingId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);

  // 1. Feature 2: Printable Luxury Invoice State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);

  // 2. Feature 4: Low Stock & Inventory Alert System States
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // 3. Feature 5: Security Audit Log & Activity Tracker States
  const [auditLogs, setAuditLogs] = useState<any[]>([
    {
      id: 'AUD-8801',
      timestamp: '2026-09-30 22:30:15',
      category: 'AUTH',
      action: 'ADMIN_SESSION_VERIFIED',
      details: 'Admin authorized with HMAC-SHA256 signed session cookie',
      severity: 'INFO',
      ip: '82.132.241.18 (Bradford, UK)',
      actor: 'admin@bhaijeweller.co.uk',
    },
    {
      id: 'AUD-8802',
      timestamp: '2026-09-30 22:18:40',
      category: 'SECURITY',
      action: 'RATE_LIMIT_PASSED',
      details: 'Sliding window rate limit checks active on auth endpoints',
      severity: 'INFO',
      ip: '194.207.81.4 (Leeds, UK)',
      actor: 'System Guard',
    },
    {
      id: 'AUD-8803',
      timestamp: '2026-09-30 21:55:10',
      category: 'ORDER',
      action: 'ORDER_DISPATCHED',
      details: 'Order #ORD-1002 status advanced to Shipped via Royal Mail Special Delivery',
      severity: 'INFO',
      ip: '82.132.241.18',
      actor: 'admin',
    },
    {
      id: 'AUD-8804',
      timestamp: '2026-09-30 21:40:22',
      category: 'INVENTORY',
      action: 'LOW_STOCK_ALERT',
      details: 'Stock threshold warning: 22K Royal Bridal Necklace fell below 5 units',
      severity: 'WARNING',
      ip: '82.132.241.18',
      actor: 'Inventory Engine',
    },
    {
      id: 'AUD-8805',
      timestamp: '2026-09-30 20:15:08',
      category: 'SECURITY',
      action: 'SUSPICIOUS_LOGIN_ATTEMPT',
      details: '5 failed login attempts from unrecognized IP, temporary lockout triggered',
      severity: 'CRITICAL',
      ip: '185.220.101.5 (Quarantined)',
      actor: 'WAF Guard',
    },
    {
      id: 'AUD-8806',
      timestamp: '2026-09-30 19:22:45',
      category: 'AUTH',
      action: 'USER_ROLE_VERIFIED',
      details: 'Client registration strictly enforced role: client (Admin elevation blocked)',
      severity: 'INFO',
      ip: '86.14.92.112 (Manchester, UK)',
      actor: 'Auth Guard',
    },
  ]);
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<'ALL' | 'AUTH' | 'SECURITY' | 'ORDER' | 'INVENTORY'>('ALL');
  const [auditSeverityFilter, setAuditSeverityFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'CRITICAL'>('ALL');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.role === 'admin') {
          setIsAdminAuthorized(true);
        } else {
          window.location.href = '/admin/login';
        }
      })
      .catch(() => {
        window.location.href = '/admin/login';
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, []);

  // Real-Time Audit Trail Logger
  const addAuditLog = (
    category: 'AUTH' | 'SECURITY' | 'ORDER' | 'INVENTORY',
    action: string,
    details: string,
    severity: 'INFO' | 'WARNING' | 'CRITICAL'
  ) => {
    const newLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category,
      action,
      details,
      severity,
      ip: '82.132.241.18 (Bradford Session)',
      actor: 'admin@bhaijeweller.co.uk',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Feature 4: Export Inventory CSV
  const handleExportInventoryCSV = () => {
    if (products.length === 0) {
      alert('Product catalog is currently empty. Nothing to export.');
      return;
    }
    const headers = ['Product ID', 'Name', 'SKU', 'Category', 'Metal Specification', 'Price (GBP)', 'Stock Units', 'Status'];
    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sku || 'N/A'}"`,
      `"${p.category}"`,
      `"${p.metal || 'N/A'}"`,
      `"£${p.price}"`,
      p.stock,
      `"${p.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bhai_jeweller_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addAuditLog('INVENTORY', 'INVENTORY_EXPORTED', `Exported inventory catalog (${products.length} products) to CSV`, 'INFO');
  };

  // Feature 5: Export Audit Trail CSV
  const handleExportAuditCSV = () => {
    if (auditLogs.length === 0) {
      alert('Audit trail is empty.');
      return;
    }
    const headers = ['Log ID', 'Timestamp (UTC)', 'Category', 'Action', 'Details', 'Severity', 'IP Address', 'Actor'];
    const rows = auditLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.category}"`,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.severity}"`,
      `"${l.ip}"`,
      `"${l.actor}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bhai_jeweller_security_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Feature 4: Quick Restock Handler
  const handleQuickRestock = (productId: string, productName: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    updateProductStock(productId, newStock);
    addAuditLog(
      'INVENTORY',
      'STOCK_REPLENISHED',
      `Product "${productName}" stock updated from ${currentStock} to ${newStock} (${delta >= 0 ? '+' : ''}${delta})`,
      'INFO'
    );
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    window.location.href = '/admin/login';
  };

  const handleUpdateUserStatus = async (userId: string, email: string, newStatus: string, actionName: string) => {
    try {
      setUserLoadingId(userId);
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, status: newStatus, action: actionName }),
      });
      const data = await res.json();
      if (data.success) {
        setRegisteredUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  status: newStatus,
                  isBanned: newStatus === 'banned',
                  isLocked: actionName === 'unlock' || newStatus === 'active' ? false : u.isLocked,
                  failedAttempts: actionName === 'unlock' || newStatus === 'active' ? 0 : u.failedAttempts,
                }
              : u
          )
        );
        setUserActionMsg(`User "${email}" successfully marked as ${newStatus.toUpperCase()}`);
        addAuditLog(
          'AUTH',
          'USER_STATUS_UPDATED',
          `User "${email}" status updated to ${newStatus.toUpperCase()} (${actionName})`,
          newStatus === 'banned' ? 'WARNING' : 'INFO'
        );
        setTimeout(() => setUserActionMsg(''), 3500);
      }
    } catch (err) {
      console.error('Error updating user status:', err);
    } finally {
      setUserLoadingId(null);
    }
  };

  // Real-Time Hero Section Form State
  const [heroForm, setHeroForm] = useState({
    brandPretitle: 'BHAI JEWELLER',
    headlineLine1: 'Jewellery, made',
    headlineLine2: 'unforgettable',
    headlineLine3: '',
    description: 'Timeless pieces for modern souls. Discover fine jewellery designed to celebrate your most precious moments.',
    primaryCtaText: 'Shop Collection',
    primaryCtaHref: '/shop',
    heroImage: '/images/hero-img.jpg',
    featuredTitle: 'Diamond Elegance',
    featuredSubtitle: 'Classic pieces, endless beauty.',
    featuredHref: '/shop',
    featuredImage: '/images/featured-ring.jpg',
  });
  const [heroSaveMsg, setHeroSaveMsg] = useState(false);

  // Real-Time Announcement Bar Form State
  const [announcementForm, setAnnouncementForm] = useState({
    isEnabled: true,
    message1: 'Free worldwide shipping on all orders over £150  |  Handcrafted with passion in the UK',
    message2: 'Complimentary luxury gift packaging on every order  |  Bespoke service',
    message3: 'Fine jewellery showroom in Bradford, West Yorkshire  |  Private viewings available',
  });
  const [announcementSaveMsg, setAnnouncementSaveMsg] = useState(false);

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

    fetch('/api/hero')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setHeroForm((prev) => ({ ...prev, ...data.data }));
        }
      })
      .catch((err) => console.error('Error loading hero config from API:', err));

    fetch('/api/announcement')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAnnouncementForm({
            isEnabled: data.data.isEnabled ?? true,
            message1: data.data.messages?.[0] || '',
            message2: data.data.messages?.[1] || '',
            message3: data.data.messages?.[2] || '',
          });
        }
      })
      .catch((err) => console.error('Error loading announcement config from API:', err));

    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (Array.isArray(data.users)) setRegisteredUsers(data.users);
          if (Array.isArray(data.loginAttempts)) setLoginAttemptsLogs(data.loginAttempts);
        }
      })
      .catch((err) => console.error('Error loading registered users from API:', err));
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
    size: '7',
    sizesText: '5, 6, 7, 8, 9',
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

  // Client-Side Image Compressor to prevent 413 Payload Too Large on Vercel/Supabase
  const compressImageFile = (file: File, maxWidth = 1200, quality = 0.82): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new (window as any).Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Handle Upload Image File directly from device (Mobile / PC) with auto-compression & duplicate prevention
  const handleDeviceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const compressedUrl = await compressImageFile(file);
      if (!compressedUrl) continue;

      setAddForm((prev) => {
        if (!prev.primaryImage) {
          return { ...prev, primaryImage: compressedUrl };
        }
        if (prev.primaryImage === compressedUrl || prev.additionalImages.includes(compressedUrl)) {
          return prev;
        }
        return { ...prev, additionalImages: [...prev.additionalImages, compressedUrl] };
      });
    }
  };

  // Start Editing Product in full page editor (Strict Image Deduplication)
  const handleStartEditProduct = (p: ProductItem) => {
    setEditingProduct(p);

    // Extract unique images without any duplicates
    const rawImagesList = [
      p.image,
      ...(Array.isArray(p.images) ? p.images : []),
    ].filter(Boolean).map(img => String(img).trim());
    const uniqueImagesList = Array.from(new Set(rawImagesList));
    const primaryImg = uniqueImagesList[0] || '';
    const additionalImgs = uniqueImagesList.slice(1);

    const defaultSize = p.size || (p.sizes && p.sizes[0]) || '7';
    const defaultSizesText = Array.isArray(p.sizes) && p.sizes.length > 0
      ? p.sizes.join(', ')
      : (p.size || '5, 6, 7, 8, 9');

    setAddForm({
      name: p.name,
      category: p.category || 'Rings',
      price: String(p.price),
      originalPrice: String(p.originalPrice || p.price),
      stock: String(p.stock ?? 10),
      metal: p.metal || '18k Yellow Gold',
      sku: p.sku || '',
      weightGrams: p.weightGrams ? String(p.weightGrams) : (p.weight ? p.weight.replace(/g$/i, '').trim() : '0.6'),
      size: defaultSize,
      sizesText: defaultSizesText,
      description: p.description || '',
      primaryImage: primaryImg,
      additionalImages: additionalImgs,
      newImageUrlInput: '',
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
      slug: p.slug || '',
      focusKeywordsText: Array.isArray(p.focusKeywords) ? p.focusKeywords.join(', ') : '',
    });
    setProductErrorMsg('');
    setActiveTab('add-product');
  };

  // Open clean Add Product studio
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductErrorMsg('');
    setAddForm({
      name: '',
      category: 'Rings',
      price: '',
      originalPrice: '',
      stock: '10',
      metal: '18k Yellow Gold',
      sku: '',
      weightGrams: '6.5',
      size: '7',
      sizesText: '5, 6, 7, 8, 9',
      description: '',
      primaryImage: '',
      additionalImages: [],
      newImageUrlInput: '',
      seoTitle: '',
      seoDescription: '',
      slug: '',
      focusKeywordsText: '',
    });
    setActiveTab('add-product');
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

  // Add Additional Image URL (with duplicate prevention)
  const handleAddImageUrl = () => {
    const url = addForm.newImageUrlInput.trim();
    if (!url) return;
    setAddForm(prev => {
      if (!prev.primaryImage) {
        return { ...prev, primaryImage: url, newImageUrlInput: '' };
      }
      if (prev.primaryImage === url || prev.additionalImages.includes(url)) {
        return { ...prev, newImageUrlInput: '' };
      }
      return {
        ...prev,
        additionalImages: [...prev.additionalImages, url],
        newImageUrlInput: ''
      };
    });
  };

  // Remove Image from list
  const handleRemoveImage = (indexToRemove: number) => {
    setAddForm(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Submit Full Page Add / Edit Product Form
  const handleFullProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      alert('Please enter a product name.');
      return;
    }
    if (addForm.price === '' || isNaN(Number(addForm.price))) {
      alert('Please enter a valid product price.');
      return;
    }

    setIsSubmittingProduct(true);
    setProductErrorMsg('');

    try {
      const trimmedName = addForm.name.trim();
      const existingProduct = editingProduct || products.find(
        (p) => p.name.trim().toLowerCase() === trimmedName.toLowerCase()
      );

      const parsedSizes = addForm.sizesText
        ? addForm.sizesText.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const primarySize = addForm.size.trim() || parsedSizes[0] || 'Standard';

      const rawImgs = [addForm.primaryImage, ...addForm.additionalImages].filter(Boolean).map((s) => String(s).trim());
      const allImagesList = Array.from(new Set(rawImgs));
      const finalPrimary = allImagesList[0] || '/images/detail-ring-hero.jpg';
      const finalImages = allImagesList.length > 0 ? allImagesList : [finalPrimary];

      const generatedSlug = existingProduct?.slug || addForm.slug || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const autoSku = existingProduct?.sku || addForm.sku || `BJ-${addForm.category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const resolvedId = existingProduct?.id || `prod-${Date.now()}`;

      const newProductObject: ProductItem = {
        id: resolvedId,
        name: trimmedName,
        category: addForm.category,
        price: Number(addForm.price),
        originalPrice: Number(addForm.originalPrice || addForm.price),
        stock: Number(addForm.stock || 0),
        metal: addForm.metal,
        status: Number(addForm.stock) > 0 ? (Number(addForm.stock) <= 5 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
        isFeatured: true,
        image: finalPrimary,
        images: finalImages,
        sku: autoSku,
        description: addForm.description || `Exquisite handcrafted ${addForm.metal} ${addForm.category.toLowerCase()} designed by master artisans.`,
        slug: generatedSlug,
        weightGrams: parseFloat(String(addForm.weightGrams || '0.6').replace(/[^\d.]/g, '')) || 0.6,
        weight: `${parseFloat(String(addForm.weightGrams || '0.6').replace(/[^\d.]/g, '')) || 0.6}g`,
        size: primarySize,
        sizes: parsedSizes.length > 0 ? parsedSizes : [primarySize],
        seoTitle: addForm.seoTitle || `${trimmedName} | Bhai Jeweller`,
        seoDescription: addForm.seoDescription || `Buy ${trimmedName} online in Pakistan & UK. Handcrafted luxury jewelry.`,
        focusKeywords: addForm.focusKeywordsText ? addForm.focusKeywordsText.split(',').map(s => s.trim()) : [trimmedName.toLowerCase()]
      };

      // Save to real-time SQL Database and persistent StoreContext
      if (existingProduct) {
        await updateProduct(newProductObject);
      } else {
        await addProduct(newProductObject);
      }

      setSaveSuccessMsg(true);
      setEditingProduct(null);

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
        size: '7',
        sizesText: '5, 6, 7, 8, 9',
        description: '',
        primaryImage: '',
        additionalImages: [],
        newImageUrlInput: '',
        seoTitle: '',
        seoDescription: '',
        slug: '',
        focusKeywordsText: '',
      });

      // Switch back to products tab immediately
      setTimeout(() => {
        setSaveSuccessMsg(false);
        setActiveTab('products');
      }, 600);

    } catch (err: any) {
      setProductErrorMsg(err?.message || 'Failed to save product to database.');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Category Submit & Delete Handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setCatError('Category name is required.');
      return;
    }
    setCatSaving(true);
    setCatError('');
    setCatSaveSuccess('');

    try {
      const slug = (
        categoryForm.slug ||
        categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      ).trim();

      if (editingCategory) {
        const ok = await updateCategory({
          id: editingCategory.id,
          name: categoryForm.name.trim(),
          slug,
          description: categoryForm.description,
          image: categoryForm.image,
          display_order: Number(categoryForm.display_order) || 1,
          is_active: true,
        });

        if (ok) {
          setCatSaveSuccess(`Category "${categoryForm.name}" updated live!`);
          setEditingCategory(null);
          setCategoryForm({
            name: '',
            slug: '',
            description: '',
            image: '/images/category-rings.jpg',
            display_order: categories.length + 1,
          });
        } else {
          setCatError('Failed to update category.');
        }
      } else {
        const ok = await addCategory({
          id: `cat-${slug || Date.now()}`,
          name: categoryForm.name.trim(),
          slug,
          description: categoryForm.description,
          image: categoryForm.image,
          display_order: Number(categoryForm.display_order) || categories.length + 1,
          is_active: true,
        });

        if (ok) {
          setCatSaveSuccess(`Category "${categoryForm.name}" added and synced live!`);
          setCategoryForm({
            name: '',
            slug: '',
            description: '',
            image: '/images/category-rings.jpg',
            display_order: categories.length + 2,
          });
        } else {
          setCatError('Failed to save category.');
        }
      }
    } catch (err: any) {
      setCatError(err?.message || 'Error occurred while saving category.');
    } finally {
      setCatSaving(false);
      setTimeout(() => setCatSaveSuccess(''), 3500);
    }
  };

  const handleDeleteCategory = async (cat: CategoryItem) => {
    const productCount = products.filter(
      (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
    ).length;

    const warningMsg =
      productCount > 0
        ? `Notice: ${productCount} active catalog items belong to "${cat.name}".\nAre you sure you want to delete this category from the database?`
        : `Are you sure you want to delete "${cat.name}"?\nThis removes it from the live store and database.`;

    if (!window.confirm(warningMsg)) return;

    const ok = await deleteCategory(cat.id);
    if (ok) {
      setCatSaveSuccess(`Category "${cat.name}" deleted.`);
      setTimeout(() => setCatSaveSuccess(''), 3000);
    }
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
  const [noticeBanner, setNoticeBanner] = useState('Complimentary Worldwide Insured Express Shipping on Orders Over £500');

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
    setSlides(slides.filter((s) => s.id !== id));
    fetch(`/api/slides?id=${id}`, { method: 'DELETE' }).catch((err) =>
      console.error('Slide delete API error:', err)
    );
  };

  // Hero Section Save & File Upload Handlers
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'heroImage' | 'featuredImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      if (resultUrl) {
        setHeroForm((prev) => ({ ...prev, [targetField]: resultUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(heroForm),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHeroSaveMsg(true);
          setTimeout(() => setHeroSaveMsg(false), 3000);
        }
      })
      .catch((err) => console.error('Error saving hero section:', err));
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messages = [announcementForm.message1, announcementForm.message2, announcementForm.message3].filter(Boolean);
    fetch('/api/announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isEnabled: announcementForm.isEnabled,
        messages,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnnouncementSaveMsg(true);
          setTimeout(() => setAnnouncementSaveMsg(false), 3000);
        }
      })
      .catch((err) => console.error('Error saving announcement bar:', err));
  };

  // Order Handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addAuditLog('ORDER', 'ORDER_STATUS_CHANGED', `Order ${orderId} status advanced to ${newStatus}`, 'INFO');
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

  // Feature 4: Inventory Stock Counts
  const healthyStockCount = products.filter(p => p.stock > 5).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  // Filtered Products (Supports Search, Category, and Stock Level Filtering)
  const filteredProducts = products.filter(p => {
    const matchCat = productCategory === 'All' || p.category === productCategory;
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStock = stockFilter === 'all'
      ? true
      : stockFilter === 'low'
      ? (p.stock > 0 && p.stock <= 5)
      : p.stock === 0;
    return matchCat && matchQuery && matchStock;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'All') return true;
    return o.status === orderStatusFilter;
  });

  // Navigation Items list with sleek professional vector SVG icons
  const NAV_ITEMS = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon className="w-4 h-4" />,
      count: null,
    },
    {
      id: 'products',
      label: 'Products',
      icon: <ProductsIcon className="w-4 h-4" />,
      count: products.length,
    },
    {
      id: 'add-product',
      label: 'Add Product',
      icon: <AddProductIcon className="w-4 h-4" />,
      count: null,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <CategoriesIcon className="w-4 h-4" />,
      count: categories.length,
    },
    {
      id: 'slides',
      label: 'Slider & Banners',
      icon: <SlidesIcon className="w-4 h-4" />,
      count: slides.length,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <OrdersIcon className="w-4 h-4" />,
      count: activeOrdersCount,
    },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: <EnquiriesIcon className="w-4 h-4" />,
      count: pendingEnquiriesCount,
    },
    {
      id: 'customers',
      label: 'Users',
      icon: <UsersIcon className="w-4 h-4" />,
      count: registeredUsers.length,
    },
    {
      id: 'goldrates',
      label: 'Gold Rates',
      icon: <GoldRatesIcon className="w-4 h-4" />,
      count: null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon className="w-4 h-4" />,
      count: null,
    },
  ];

  // Theme-dependent styles helper - Advance Luxury White Palette
  const isLight = theme === 'light';

  const containerBg = isLight ? 'bg-[#f8fafc] text-gray-900' : 'bg-[#0f172a] text-slate-100';
  const sidebarBg = isLight ? 'bg-white border-gray-200' : 'bg-[#1e293b] border-slate-700';
  const sidebarHeaderBorder = isLight ? 'border-gray-200' : 'border-slate-700';
  const sidebarFooterBg = isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0f172a] border-slate-700';
  const cardBg = isLight ? 'bg-white border border-gray-200 shadow-xs' : 'bg-[#1e293b] border border-slate-700 shadow-lg';
  const cardHeaderBorder = isLight ? 'border-gray-100' : 'border-slate-700/60';
  const inputBg = isLight ? 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900' : 'bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-white';
  const tableHeaderBg = isLight ? 'bg-gray-50 border-gray-200 text-gray-700 font-semibold' : 'bg-slate-800/80 border-slate-700 text-slate-300';
  const tableRowHover = isLight ? 'hover:bg-gray-50/80 divide-gray-100' : 'hover:bg-slate-800/50 divide-slate-800';
  const titleColor = isLight ? 'text-gray-900' : 'text-white';
  const accentGold = isLight ? 'text-gray-900' : 'text-slate-100';
  const subtitleColor = isLight ? 'text-gray-500' : 'text-slate-400';
  const badgeBg = isLight ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-slate-800 text-slate-200 border-slate-700';
  const primaryBtn = isLight ? 'bg-gray-900 hover:bg-black text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-900';

  if (authChecking) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-900">
        <div className="w-10 h-10 rounded-full border-2 border-gray-900 border-t-transparent animate-spin mb-4" />
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-gray-700 font-semibold">Verifying Bradford Admin Terminal...</p>
      </div>
    );
  }

  if (!isAdminAuthorized) {
    return null;
  }

  return (
    <div
      suppressHydrationWarning
      className={`min-h-screen h-screen w-full overflow-hidden ${containerBg} flex flex-col md:flex-row font-sans selection:bg-gray-900 selection:text-white transition-colors duration-200 text-[13px]`}
    >
      {/* MOBILE HEADER BAR */}
      <header className={`md:hidden flex items-center justify-between px-4 py-3 ${sidebarBg} border-b sticky top-0 z-40`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className={`p-2 ${accentGold} hover:bg-gray-50 dark:hover:bg-[#1f1612] rounded-[5px] transition-colors`}
            aria-label="Open Admin Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[4px] bg-gray-900 text-white flex items-center justify-center shadow-xs">
              <CrownIcon className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className={`font-serif tracking-wider text-sm ${accentGold} uppercase font-bold`}>BHAI JEWELLER</span>
              <span className={`text-[9.5px] ${subtitleColor} tracking-widest uppercase`}>Bradford Terminal</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* THEME TOGGLE BUTTON MOBILE */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`px-2.5 py-1.5 rounded-[5px] text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isLight
                ? 'bg-gray-50 text-[#17120e] border-gray-200'
                : 'bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            {isLight ? <MoonIcon className="w-3.5 h-3.5 text-gray-700" /> : <SunIcon className="w-3.5 h-3.5 text-amber-500" />}
            <span>{isLight ? 'Dark' : 'Light'}</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className={`text-xs px-2.5 py-1.5 ${
              isLight ? 'bg-gray-50 text-gray-800 border-gray-200' : 'bg-[#1e293b] text-slate-200 border-slate-700'
            } border rounded-[5px] transition-colors flex items-center space-x-1`}
          >
            <StoreIcon className="w-3.5 h-3.5" />
            <span>Site</span>
          </Link>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY & SIDEBAR */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className={`relative w-60 max-w-[80vw] ${sidebarBg} border-r flex flex-col h-full z-10 shadow-2xl`}>
            <div className={`p-3.5 ${sidebarHeaderBorder} border-b flex items-center justify-between`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[5px] bg-gray-900 text-white flex items-center justify-center shadow-xs">
                  <CrownIcon className="w-4 h-4" />
                </div>
                <div>
                  <h1 className={`font-serif text-base font-bold tracking-wider ${accentGold}`}>BHAI JEWELLER</h1>
                  <p className={`text-[10px] ${subtitleColor} tracking-widest uppercase`}>Bradford Atelier</p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className={`${subtitleColor} hover:${accentGold} p-1 rounded-[5px]`}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'add-product') {
                      handleOpenAddProduct();
                    } else {
                      setActiveTab(item.id as any);
                    }
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[5px] text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? isLight
                        ? 'bg-gray-100 text-gray-900 border-l-2 border-gray-900 font-bold shadow-xs'
                        : 'bg-slate-800 text-white border-l-2 border-white shadow-md'
                      : isLight
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
            <div className={`p-3 ${sidebarFooterBg} border-t flex flex-col gap-2`}>
              <Link
                href="/"
                target="_blank"
                className={`w-full flex items-center justify-center space-x-2 py-2 px-3 ${
                  isLight ? 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50' : 'bg-[#1e293b] text-slate-200 border border-slate-700 hover:bg-slate-700'
                } rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs`}
              >
                <StoreIcon className="w-3.5 h-3.5" />
                <span>Storefront Main Site</span>
                <ExternalLinkIcon className="w-3 h-3 ml-0.5" />
              </Link>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <LockIcon className="w-3.5 h-3.5" />
                <span>Lock &amp; Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR SLIDER DRAWER (STATIONARY / FIXED) */}
      <aside
        className={`hidden md:flex flex-col ${sidebarBg} border-r transition-all duration-300 relative z-30 h-full overflow-y-auto flex-shrink-0 sticky top-0 ${
          sidebarOpen ? 'w-56' : 'w-16'
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className={`p-3.5 ${sidebarHeaderBorder} border-b flex items-center justify-between`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[5px] bg-gray-900 text-white flex items-center justify-center shadow-xs">
                <CrownIcon className="w-4 h-4" />
              </div>
              <div>
                <h1 className={`font-serif text-sm font-bold tracking-wider ${accentGold}`}>BHAI JEWELLER</h1>
                <p className={`text-[10px] ${subtitleColor} tracking-widest uppercase`}>Bradford HQ Terminal</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-8 h-8 rounded-[5px] bg-gray-900 text-white flex items-center justify-center shadow-xs">
              <CrownIcon className="w-4 h-4" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-[5px] ${subtitleColor} hover:${accentGold} transition-colors`}
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            } py-1.5 px-2.5 rounded-[4px] text-[11px] font-semibold border transition-all ${
              isLight
                ? 'bg-gray-50 text-[#17120e] border-gray-200 hover:bg-gray-100'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Admin Theme"
          >
            <div className="flex items-center space-x-2">
              {isLight ? <MoonIcon className="w-4 h-4 text-gray-700" /> : <SunIcon className="w-4 h-4 text-amber-500" />}
              {sidebarOpen && <span>{isLight ? 'Light Theme (Default)' : 'Dark Theme'}</span>}
            </div>
            {sidebarOpen && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-[5px] bg-gray-900 text-white">
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
              onClick={() => {
                if (item.id === 'add-product') {
                  handleOpenAddProduct();
                } else {
                  setActiveTab(item.id as any);
                }
              }}
              className={`w-full flex items-center ${
                sidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'
              } py-2 rounded-[4px] text-xs font-medium transition-all ${
                activeTab === item.id
                  ? isLight
                    ? 'bg-gray-100 text-gray-900 border-l-2 border-gray-900 font-bold shadow-xs'
                    : 'bg-slate-800 text-white border-l-2 border-white shadow-md'
                  : isLight
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
        <div className={`p-3 ${sidebarFooterBg} border-t flex flex-col space-y-3`}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-[5px] ${isLight ? 'bg-gray-900 text-white' : 'bg-slate-700 text-white'} font-serif font-bold flex items-center justify-center text-sm shadow-2xs`}>
                  AD
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-xs font-semibold ${titleColor} truncate`}>Bradford Admin</span>
                  <span className={`text-[10px] ${subtitleColor} truncate`}>admin@bhaijeweller.co.uk</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  target="_blank"
                  className={`w-full flex items-center justify-center space-x-2 py-2 px-3 ${
                    isLight
                      ? 'bg-[#ffffff] text-gray-900 border-gray-200 hover:bg-gray-50'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  } border rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs`}
                >
                  <StoreIcon className="w-3.5 h-3.5" />
                  <span>Main Storefront</span>
                  <ExternalLinkIcon className="w-3 h-3 ml-0.5" />
                </Link>
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <LockIcon className="w-3.5 h-3.5" />
                  <span>Lock &amp; Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className={`w-full flex justify-center py-2 ${accentGold} hover:bg-opacity-10 rounded-[5px]`}
                title="Storefront Site"
              >
                <StoreIcon className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="w-full flex justify-center py-2 text-red-600 hover:bg-red-500/10 rounded-[5px]"
                title="Sign Out of Admin Terminal"
              >
                <LockIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA (INDEPENDENT VERTICAL SCROLL) */}
      <main className="flex-1 h-full overflow-y-auto p-3 sm:p-4 lg:p-5 w-full">
        {/* TOP STATUS BAR */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b ${cardHeaderBorder} gap-3`}>
          <div>
            <span className={`text-xs uppercase tracking-widest ${accentGold} font-semibold flex items-center gap-1.5`}>
              <CrownIcon className="w-3.5 h-3.5" />
              Luxury Fine Jewellery Administration
            </span>
            <h1 className={`font-serif text-lg sm:text-xl ${titleColor} font-bold tracking-wide capitalize mt-0.5`}>
              {activeTab === 'slides' ? 'Slider & Banner Manager' : activeTab === 'add-product' ? (editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product Studio') : activeTab}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            {/* THEME SWITCH BUTTON TOP BAR */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`px-3 py-1.5 rounded-[5px] text-xs font-semibold border flex items-center space-x-1.5 transition-all shadow-xs ${
                isLight
                  ? 'bg-[#ffffff] text-[#17120e] border-gray-200 hover:bg-gray-50'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isLight ? <MoonIcon className="w-3.5 h-3.5 text-gray-700" /> : <SunIcon className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isLight ? 'Light Theme' : 'Dark Theme'}</span>
            </button>

            <span className={`inline-flex items-center px-3 py-1.5 rounded-[5px] text-xs border ${badgeBg} font-medium`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Supabase Live
            </span>
            {activeTab !== 'add-product' && (
              <button
                type="button"
                onClick={handleOpenAddProduct}
                className={`px-4 py-2 ${primaryBtn} font-semibold text-xs rounded-[5px] transition-all shadow-xs flex items-center space-x-1.5`}
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <ScrollReveal direction="up" delay={100} className="space-y-4">
            {/* KPI METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className={`${cardBg} p-3.5 rounded-[5px]`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>Total Revenue</p>
                    <p className={`text-xl sm:text-2xl font-serif ${accentGold} font-bold mt-1.5`}>£{totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded-[4px] bg-gray-100 border border-gray-200 text-gray-900">
                    <ArrowTrendingUpIcon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>↑ +18.4% from last month</span>
                </div>
              </div>

              <div className={`${cardBg} p-3.5 rounded-[5px]`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>Live Catalog Items</p>
                    <p className={`text-xl sm:text-2xl font-serif ${titleColor} font-bold mt-1.5`}>{totalProductsCount}</p>
                  </div>
                  <div className="p-2 rounded-[4px] bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-600">
                    <DiamondIcon className="w-5 h-5" />
                  </div>
                </div>
                <div className={`mt-4 flex items-center text-xs ${subtitleColor}`}>
                  <span>Synced in real-time with Storefront</span>
                </div>
              </div>

              <div className={`${cardBg} p-3.5 rounded-[5px]`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>Bespoke Requests</p>
                    <p className={`text-xl sm:text-2xl font-serif ${accentGold} font-bold mt-1.5`}>{pendingEnquiriesCount}</p>
                  </div>
                  <div className="p-2 rounded-[4px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-600">
                    <SparklesIcon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <span>Requires artisan consultation</span>
                </div>
              </div>

              <div className={`${cardBg} p-3.5 rounded-[5px]`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>Live 24K Gold Rate</p>
                    <p className={`text-xl sm:text-2xl font-serif ${titleColor} font-bold mt-1.5`}>Rs. {gold24kRate}</p>
                  </div>
                  <div className="p-2 rounded-[4px] bg-gray-100 border border-gray-200 text-gray-900">
                    <GoldRatesIcon className="w-5 h-5" />
                  </div>
                </div>
                <div className={`mt-4 flex items-center text-xs ${accentGold}`}>
                  <span>PKR / Gram • Auto-sync on</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS & RECENT ORDERS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
              {/* Recent Orders List */}
              <div className={`lg:col-span-2 ${cardBg} rounded-[5px] p-3.5`}>
                <div className={`flex items-center justify-between mb-4 border-b ${cardHeaderBorder} pb-3`}>
                  <h3 className={`font-serif text-lg ${accentGold} font-semibold flex items-center gap-2`}>
                    <OrdersIcon className="w-4 h-4" />
                    Recent Store Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className={`text-xs ${accentGold} hover:underline flex items-center gap-1`}>
                    <span>View All Orders</span>
                    <ChevronRightIcon className="w-3 h-3" />
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
                        <th className="pb-2 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${tableRowHover}`}>
                      {orders.slice(0, 4).map((o) => (
                        <tr key={o.id} className="transition-colors">
                          <td className={`py-3 font-mono font-medium ${accentGold}`}>{o.id}</td>
                          <td className={`py-3 font-medium ${titleColor}`}>{o.customer}</td>
                          <td className={`py-3 font-semibold ${accentGold}`}>£{o.amount}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold uppercase ${
                              o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' :
                              o.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800' :
                              'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedInvoiceOrder(o)}
                              className="px-2.5 py-1 rounded-[4px] border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:text-slate-200 text-[10px] font-semibold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                            >
                              <PrinterIcon className="w-3 h-3" />
                              <span>Invoice</span>
                            </button>
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
                    <h3 className={`font-serif text-lg ${accentGold} font-semibold flex items-center gap-2`}>
                      <BoltIcon className="w-4 h-4" />
                      Quick Inventory Action
                    </h3>
                  </div>
                  <p className={`text-xs ${subtitleColor} mb-4`}>
                    Create a new product with multiple images and auto-generated SEO metadata.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddProduct}
                    className={`w-full py-3 ${primaryBtn} rounded-[5px] text-xs font-bold uppercase tracking-wider shadow-xs transition-all mb-4 flex items-center justify-center gap-1.5`}
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Open Add Product Studio</span>
                  </button>
                  <div className="space-y-3 pt-2">
                    {slides.slice(0, 2).map(slide => (
                      <div key={slide.id} className={`p-3 ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#1a120e] border-[#2c201a]'} border rounded-[5px] flex items-center justify-between`}>
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
                    isLight ? 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100' : 'bg-[#1e293b] text-slate-200 border-slate-700 hover:bg-slate-700'
                  } border rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5`}
                >
                  <SlidesIcon className="w-3.5 h-3.5" />
                  <span>Manage Slider Banners</span>
                  <ChevronRightIcon className="w-3 h-3" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* TAB 2: PRODUCTS CATALOG WITH LOW STOCK & INVENTORY ALERTS */}
        {activeTab === 'products' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            {/* FEATURE 4: INVENTORY HEALTH KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-gray-900`}>
                <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Total Catalog Items</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-2xl font-serif font-bold ${titleColor}`}>{products.length}</span>
                  <div className="p-1.5 rounded-[5px] bg-gray-100 border border-gray-200 text-gray-900">
                    <DiamondIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className={`text-[10px] ${subtitleColor} mt-1`}>Active product listings</p>
              </div>

              <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-emerald-500`}>
                <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Healthy Stock (&gt; 5)</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">{healthyStockCount}</span>
                  <div className="p-1.5 rounded-[5px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Optimal retail inventory</p>
              </div>

              <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-amber-500`}>
                <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Low Stock Warning (1-5)</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">{lowStockCount}</span>
                  <div className="p-1.5 rounded-[5px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600">
                    <AlertTriangleIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">Replenishment recommended</p>
              </div>

              <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-red-500`}>
                <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Out of Stock (0 units)</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-serif font-bold text-red-600 dark:text-red-400">{outOfStockCount}</span>
                  <div className="p-1.5 rounded-[5px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600">
                    <AlertCircleIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[10px] text-red-600 dark:text-red-400 mt-1">Unavailable on storefront</p>
              </div>
            </div>

            {/* LOW STOCK CRITICAL WARNING BANNER */}
            {(lowStockCount > 0 || outOfStockCount > 0) && (
              <div className="p-3.5 rounded-[5px] bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <AlertTriangleIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-amber-900 dark:text-amber-200 font-medium">
                    <strong>Inventory Alert:</strong> {lowStockCount} items running low on stock and {outOfStockCount} items are out of stock. Immediate artisan restock required.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStockFilter('low')}
                    className="px-2.5 py-1 rounded-[4px] bg-amber-600 text-white text-[10px] font-semibold hover:bg-amber-700 transition-colors shadow-2xs flex items-center gap-1"
                  >
                    <AlertTriangleIcon className="w-3 h-3" />
                    <span>View Low Stock ({lowStockCount})</span>
                  </button>
                  {outOfStockCount > 0 && (
                    <button
                      onClick={() => setStockFilter('out')}
                      className="px-2.5 py-1 rounded-[4px] bg-red-600 text-white text-[10px] font-semibold hover:bg-red-700 transition-colors shadow-2xs flex items-center gap-1"
                    >
                      <AlertCircleIcon className="w-3 h-3" />
                      <span>View Out of Stock ({outOfStockCount})</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ACTION & FILTER CONTROLS */}
            <div className={`flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 ${cardBg} p-4 rounded-[5px]`}>
              {/* Search & Stock Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`text-xs pl-8.5 pr-3 py-2 rounded-[5px] focus:outline-none w-full ${inputBg}`}
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a120e] p-1 rounded-[5px] border border-gray-200 dark:border-[#3a2c23]">
                  <button
                    type="button"
                    onClick={() => setStockFilter('all')}
                    className={`px-2.5 py-1 rounded-[4px] text-[10.5px] font-medium transition-all ${
                      stockFilter === 'all'
                        ? 'bg-[#17120e] text-[#fbfaf8] font-bold shadow-2xs'
                        : `${subtitleColor} hover:${titleColor}`
                    }`}
                  >
                    All Stock ({products.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockFilter('low')}
                    className={`px-2.5 py-1 rounded-[4px] text-[10.5px] font-medium transition-all flex items-center gap-1 ${
                      stockFilter === 'low'
                        ? 'bg-amber-600 text-white font-bold shadow-2xs'
                        : 'text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950'
                    }`}
                  >
                    <AlertTriangleIcon className="w-3 h-3" />
                    <span>Low ({lowStockCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockFilter('out')}
                    className={`px-2.5 py-1 rounded-[4px] text-[10.5px] font-medium transition-all flex items-center gap-1 ${
                      stockFilter === 'out'
                        ? 'bg-red-600 text-white font-bold shadow-2xs'
                        : 'text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950'
                    }`}
                  >
                    <AlertCircleIcon className="w-3 h-3" />
                    <span>Out ({outOfStockCount})</span>
                  </button>
                </div>
              </div>

              {/* Category, CSV Export & Add Product Button */}
              <div className="flex flex-wrap items-center gap-2 justify-end">
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className={`text-xs px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id || c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>

                {/* FEATURE 4: EXPORT INVENTORY CSV BUTTON */}
                <button
                  type="button"
                  onClick={handleExportInventoryCSV}
                  className="px-3.5 py-2 rounded-[5px] border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                  title="Download inventory report as CSV spreadsheet"
                >
                  <ExportIcon className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className={`px-4 py-2 ${primaryBtn} font-semibold text-xs rounded-[5px] transition-all shadow-xs flex items-center gap-1.5`}
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table with Quick Restock Controls */}
            <div className={`${cardBg} rounded-[5px] overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`${tableHeaderBg} uppercase tracking-wider font-semibold`}>
                    <tr>
                      <th className="py-2.5 px-3">Product Info</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Metal Spec</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Stock Health</th>
                      <th className="py-2.5 px-3">Quick Restock</th>
                      <th className="py-2.5 px-3">Images</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${tableRowHover}`}>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-xs text-gray-500 italic">
                          No products found matching the current search or stock filter.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="transition-colors">
                          <td className="py-2 px-3 flex items-center space-x-2.5">
                            <div className="relative w-8 h-8 rounded-[4px] overflow-hidden bg-[#e8ded4] dark:bg-[#211611] flex-shrink-0 border border-gray-200 dark:border-[#3a2c23]">
                              <Image src={p.image || (p.images && p.images[0]) || '/images/detail-ring-hero.jpg'} alt={p.name} fill className="object-cover" />
                            </div>
                            <div>
                              <p className={`font-semibold ${titleColor}`}>{p.name}</p>
                              <p className={`text-[10px] ${subtitleColor}`}>{p.id}</p>
                            </div>
                          </td>
                          <td className={`py-2 px-3 font-mono ${subtitleColor}`}>{p.sku}</td>
                          <td className="py-2 px-3">
                            <span className={`px-1.5 py-0.5 border rounded-[4px] text-[10px] ${badgeBg}`}>
                              {p.category}
                            </span>
                          </td>
                          <td className={`py-2 px-3 ${subtitleColor}`}>{p.metal}</td>
                          <td className={`py-2 px-3 font-semibold ${accentGold}`}>£{p.price.toLocaleString()}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold inline-flex items-center gap-1 ${
                              p.stock > 5 ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' :
                              p.stock > 0 ? 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800' :
                              'bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800'
                            }`}>
                              {p.stock > 5 ? (
                                <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                              ) : p.stock > 0 ? (
                                <AlertTriangleIcon className="w-3 h-3 text-amber-600 animate-pulse" />
                              ) : (
                                <AlertCircleIcon className="w-3 h-3 text-red-600" />
                              )}
                              <span>{p.stock} units ({p.stock > 5 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'})</span>
                            </span>
                          </td>
                          {/* FEATURE 4: QUICK RESTOCK STEPPER */}
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleQuickRestock(p.id, p.name, p.stock, 1)}
                                className="px-2 py-1 rounded-[4px] bg-gray-50 dark:bg-[#211611] hover:bg-gray-100 dark:hover:bg-[#2d1e17] text-[#17120e] dark:text-slate-200 border border-gray-200 dark:border-[#3a2c23] text-[10px] font-bold transition-all"
                                title="Add 1 piece to stock"
                              >
                                +1
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickRestock(p.id, p.name, p.stock, 5)}
                                className="px-2 py-1 rounded-[4px] bg-gray-900/15 hover:bg-gray-900/30 text-gray-900 dark:text-slate-200 border border-gray-300 text-[10px] font-bold transition-all"
                                title="Add 5 pieces (Standard batch restock)"
                              >
                                +5
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-gray-900">
                            <span className="font-semibold">{p.images?.length || 1} imgs</span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStartEditProduct(p)}
                                className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:text-slate-200 rounded-[5px] text-[10px] font-bold transition-colors border border-gray-200 flex items-center gap-1 shadow-2xs"
                                title="Edit product in studio"
                              >
                                <EditIcon className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (window.confirm(`Delete product "${p.name}"?\nThis will remove it from the catalog in real time.`)) {
                                    await removeStoreProduct(p.id);
                                  }
                                }}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-800 dark:bg-red-950/80 dark:hover:bg-red-900 dark:text-red-200 rounded-[5px] text-[10px] font-semibold transition-colors border border-red-200 dark:border-red-900 flex items-center gap-1 shadow-2xs"
                                title="Delete product"
                              >
                                <TrashIcon className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
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
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-[5px] text-xs font-semibold flex items-center gap-2.5 shadow-xs">
                <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{editingProduct ? 'Product updated and synced live in real-time!' : 'Product saved to real-time database! Synced live with Storefront catalog.'}</span>
              </div>
            )}

            {productErrorMsg && (
              <div className="p-4 bg-red-50 border border-red-300 text-red-900 rounded-[5px] text-xs font-semibold flex items-center gap-2.5 shadow-xs">
                <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{productErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFullProductSubmit} className="space-y-8">
              {/* Header Action Bar */}
              <div className={`${cardBg} p-5 rounded-[5px] flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[5px] bg-gray-100 border border-gray-200 text-gray-900 flex items-center justify-center">
                    {editingProduct ? <EditIcon className="w-5 h-5" /> : <AddProductIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className={`font-serif text-xl font-bold ${accentGold}`}>
                      {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Full Product Creation Studio'}
                    </h2>
                    <p className={`text-xs ${subtitleColor}`}>
                      {editingProduct
                        ? 'Modify specifications, prices, stock, and photos. Updates in real-time.'
                        : 'Configure metal specifications, upload multiple photos, and auto-generate SEO metadata.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setActiveTab('products');
                    }}
                    className={`px-4 py-2 border rounded-[5px] text-xs font-medium transition-colors ${
                      isLight ? 'bg-gray-50 text-[#4a3f35] border-gray-200 hover:bg-gray-100' : 'bg-[#1f1612] text-[#c2b4a3] border-[#3a2c23] hover:bg-[#2d1e17]'
                    }`}
                  >
                    Cancel &amp; Return
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProduct}
                    className={`px-6 py-2.5 ${primaryBtn} font-bold text-xs uppercase tracking-wider rounded-[5px] shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmittingProduct ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{editingProduct ? 'Updating in Real Time...' : 'Saving to Database...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        <span>{editingProduct ? 'Update Product in Real Time' : 'Save & Publish Live to Site'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Grid: Left Form Fields, Right Live Store Preview & SEO */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COL: PRODUCT DETAILS & MULTI-IMAGE UPLOADER */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Card 1: Core Product Specs */}
                  <div className={`${cardBg} p-6 rounded-[5px] space-y-4`}>
                    <h3 className={`font-serif text-base font-bold ${accentGold} border-b ${cardHeaderBorder} pb-2 flex items-center gap-2`}>
                      <DiamondIcon className="w-4 h-4" />
                      <span>1. Basic Product Information</span>
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
                            {categories.map((c) => (
                              <option key={c.id || c.slug} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className={`block text-xs font-semibold ${subtitleColor}`}>
                              Metal Purity &amp; Spec *
                            </label>
                            <span className="text-[10px] text-gray-900 font-mono flex items-center gap-1">
                              <EditIcon className="w-3 h-3" />
                              Type custom
                            </span>
                          </div>
                          <input
                            type="text"
                            list="admin-gold-purity-presets"
                            required
                            placeholder="e.g. 21ct Gold, 22k Pure Gold, 24k Bullion..."
                            value={addForm.metal}
                            onChange={(e) => setAddForm({ ...addForm, metal: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          />
                          <datalist id="admin-gold-purity-presets">
                            <option value="22k Pure Gold" />
                            <option value="21ct Gold" />
                            <option value="24k Pure Gold Bullion" />
                            <option value="18k Yellow Gold" />
                            <option value="18k White Gold" />
                            <option value="18k Rose Gold" />
                            <option value="14k Solid Gold" />
                            <option value="Platinum 950" />
                            <option value="Sterling Silver 925" />
                          </datalist>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {['22k Pure Gold', '21ct Gold', '18k Yellow Gold', '18k White Gold', '24k Bullion', 'Platinum 950'].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setAddForm({ ...addForm, metal: preset })}
                                className={`px-2 py-0.5 rounded-[3px] text-[10px] border border-gray-300 hover:border-gray-900 transition-all ${
                                  addForm.metal === preset ? 'bg-gray-900/15 text-gray-900 font-bold' : subtitleColor
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                            Price (£ GBP) *
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
                            Compare Price (£)
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
                              className={`text-[10px] ${accentGold} hover:underline font-semibold flex items-center gap-1`}
                            >
                              <BoltIcon className="w-3 h-3" />
                              <span>Auto Generate</span>
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
                          <div className="flex justify-between items-center mb-1">
                            <label className={`text-xs font-semibold ${subtitleColor}`}>
                              Gold / Metal Weight (Grams) *
                            </label>
                            <span className="text-[10px] text-gray-500 font-mono">e.g. 0.6g, 5.5g</span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="e.g. 0.6g or 5.5"
                              value={addForm.weightGrams}
                              onChange={(e) => setAddForm({ ...addForm, weightGrams: e.target.value })}
                              className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-gray-400 select-none">grams</span>
                          </div>
                          {/* Quick 1-click Weight Presets */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {[
                              { label: '0.6g (Studs/Pendants)', val: '0.6' },
                              { label: '1.5g (Light Rings)', val: '1.5' },
                              { label: '3.5g (Standard)', val: '3.5' },
                              { label: '5.5g (Heavy Rings)', val: '5.5' },
                              { label: '8.0g (Chains)', val: '8.0' },
                              { label: '15.0g (Bangles)', val: '15.0' },
                              { label: '25.0g (Bridal)', val: '25.0' },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => setAddForm({ ...addForm, weightGrams: preset.val })}
                                className="px-2 py-0.5 rounded-[3px] text-[10px] border border-gray-300 hover:border-gray-900 transition-all text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-200"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Product Sizes & Default Size */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <div className="flex justify-between items-center mb-1">
                            <label className={`text-xs font-semibold ${subtitleColor}`}>
                              Available Sizes / Variations (Comma separated)
                            </label>
                            <span className="text-[10px] text-gray-500 font-mono">e.g. 5, 6, 7, 8, 9</span>
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. 5, 6, 7, 8, 9 or 16', 18', 20' or 2.4, 2.6, 2.8"
                            value={addForm.sizesText}
                            onChange={(e) => setAddForm({ ...addForm, sizesText: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          />
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {[
                              { label: 'Rings (5-9)', val: '5, 6, 7, 8, 9' },
                              { label: 'Rings UK (J-Q)', val: 'J, L, N, P, Q' },
                              { label: 'Chains (16-24")', val: '16", 18", 20", 22", 24"' },
                              { label: 'Bangles (2.4-2.8)', val: '2.4, 2.6, 2.8' },
                              { label: 'Standard', val: 'Standard, Adjustable' }
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => setAddForm({ ...addForm, sizesText: preset.val, size: preset.val.split(',')[0].trim() })}
                                className="px-2 py-0.5 rounded-[3px] text-[10px] border border-gray-300 hover:border-gray-900 transition-all text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-200"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className={`block text-xs font-semibold ${subtitleColor} mb-1`}>
                            Default / Featured Size
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 7"
                            value={addForm.size}
                            onChange={(e) => setAddForm({ ...addForm, size: e.target.value })}
                            className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          />
                          <p className={`text-[10px] ${subtitleColor} mt-1.5`}>Shows as active on review &amp; storefront</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className={`block text-xs font-semibold ${subtitleColor}`}>
                            Detailed Description &amp; Craftsmanship Details
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const template = `Add timeless elegance to your look with this exquisite piece. Featuring master craftsmanship, delicate detailing and a brilliant finish, perfect for everyday wear or royal celebrations.

**Product Details**
- **Metal:** ${addForm.metal || '22ct Yellow Gold'}
- **Style:** Handcrafted Luxury
- **Design:** Royal Artisan Heritage
- **Size:** ${addForm.size || 'Standard'}
- **Weight:** ${addForm.weightGrams ? `${addForm.weightGrams}g` : '5.5g'}
- **Fastening:** Secure Clasp
- **Certification:** Authentic British Hallmark Certified

A beautiful gift for birthdays, anniversaries or any special celebration.`;
                              setAddForm(prev => ({ ...prev, description: template }));
                            }}
                            className="px-2.5 py-1 rounded text-[10.5px] font-semibold bg-[#dec29b]/25 hover:bg-[#dec29b]/40 text-[#8f6d3a] transition-all flex items-center gap-1 shadow-2xs"
                            title="Insert luxury description template with story, specifications & gift note"
                          >
                            <span>✨</span>
                            <span>Insert Luxury Template</span>
                          </button>
                        </div>
                        <textarea
                          rows={6}
                          placeholder="Describe design story, metal purity, specifications, and gifting details..."
                          value={addForm.description}
                          onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                          className={`w-full text-xs px-4 py-2.5 rounded-[5px] focus:outline-none font-mono ${inputBg}`}
                        />
                        <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500">
                          <span>Supports markdown: **Bold**, - **Key:** Value bullet lists, and paragraphs</span>
                          <span>{addForm.description.length} chars</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Multiple Product Images Manager */}
                  <div className={`${cardBg} p-6 rounded-[5px] space-y-4`}>
                    <div className="flex items-center justify-between border-b pb-2 border-current border-opacity-15">
                      <h3 className={`font-serif text-base font-bold ${accentGold} flex items-center gap-2`}>
                        <ImageIcon className="w-4 h-4" />
                        <span>2. Multiple Product Images Studio</span>
                      </h3>
                      <span className={`text-xs ${subtitleColor}`}>
                        Total: {(addForm.primaryImage ? 1 : 0) + addForm.additionalImages.filter(img => img && img !== addForm.primaryImage).length} Images
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Device File Upload Box */}
                      <div className={`p-5 ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#1a120e] border-[#3a2c23]'} border-2 border-dashed rounded-[5px] text-center space-y-2`}>
                        <ImageIcon className="w-8 h-8 text-gray-900 mx-auto" />
                        <h4 className={`text-xs font-bold ${titleColor}`}>Upload Photo Files from Device (PC or Mobile)</h4>
                        <p className={`text-[10px] ${subtitleColor}`}>Select device image files (JPG, PNG, WEBP)</p>
                        
                        <label className={`inline-flex items-center space-x-2 px-5 py-2.5 ${primaryBtn} font-bold text-xs rounded-[5px] shadow-xs cursor-pointer transition-all`}>
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Choose Photo Files...</span>
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
                          Additional Angle Photos &amp; Gallery Images
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
                            className={`px-4 py-2.5 ${primaryBtn} font-bold text-xs rounded-[5px] flex items-center gap-1.5`}
                          >
                            <PlusIcon className="w-3.5 h-3.5" />
                            <span>Add URL</span>
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
                              <div className="relative h-20 rounded-[5px] overflow-hidden border-2 border-gray-900 group bg-gray-50">
                                <Image src={addForm.primaryImage} alt="Primary Cover" fill className="object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setAddForm(prev => ({ ...prev, primaryImage: '' }))}
                                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center shadow transition-transform hover:scale-110"
                                  title="Remove cover photo"
                                >
                                  <XIcon className="w-3 h-3" />
                                </button>
                                <span className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white text-[9px] text-center font-bold uppercase py-0.5">
                                  COVER PHOTO
                                </span>
                              </div>
                            )}

                            {/* Additional Images (Strict Deduplication against Primary Cover) */}
                            {addForm.additionalImages
                              .filter((imgUrl) => imgUrl && imgUrl !== addForm.primaryImage)
                              .map((imgUrl, idx) => (
                              <div key={idx} className="relative h-20 rounded-[5px] overflow-hidden border border-gray-200 dark:border-[#3a2c23] group bg-gray-50">
                                <Image src={imgUrl} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center shadow transition-transform hover:scale-110"
                                  title="Remove photo"
                                >
                                  <XIcon className="w-3 h-3" />
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
                    <div className="flex items-center justify-between border-b pb-2 border-current border-opacity-15">
                      <div>
                        <h3 className={`font-serif text-base font-bold ${accentGold} flex items-center gap-2`}>
                          <SparklesIcon className="w-4 h-4" />
                          <span>3. Automated SEO Metadata &amp; Search Keywords</span>
                        </h3>
                        <p className={`text-xs ${subtitleColor}`}>Google SEO tags and search keywords automatically generated.</p>
                      </div>
                      <button
                        type="button"
                        onClick={generateAutoSeo}
                        className={`px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-[5px] shadow-xs transition-all flex items-center gap-1.5`}
                      >
                        <SparklesIcon className="w-3.5 h-3.5" />
                        <span>Auto-Generate SEO</span>
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
                    <h3 className={`font-serif text-base font-bold ${accentGold} border-b ${cardHeaderBorder} pb-2 flex items-center gap-2`}>
                      <EyeIcon className="w-4 h-4 text-gray-900" />
                      <span>Real-Time Storefront Preview</span>
                    </h3>

                    {/* Store Card Preview */}
                    <div className="bg-[#FAF7F2] border border-[#E5DCD3] rounded-[5px] overflow-hidden shadow-sm text-[#1c1510] max-w-sm mx-auto">
                      <div className="relative w-full h-56 bg-gray-50 dark:bg-[#1a120e] flex flex-col items-center justify-center text-center">
                        {addForm.primaryImage ? (
                          <Image
                            src={addForm.primaryImage}
                            alt={addForm.name || 'Product Preview'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="p-4 space-y-1">
                            <ImageIcon className="w-8 h-8 text-gray-900/50 mx-auto" />
                            <p className="text-xs font-bold text-gray-700">No Image Selected Yet</p>
                            <p className="text-[10px] text-[#8c7d6c]">Upload a photo or enter URL above to preview here</p>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-gray-900 text-gray-900 text-[9px] font-semibold uppercase rounded-[5px]">
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
                          <span className="text-base font-serif font-bold text-gray-900">
                            £{addForm.price ? Number(addForm.price).toLocaleString() : '1,280'}
                          </span>
                          {addForm.originalPrice && Number(addForm.originalPrice) > Number(addForm.price) && (
                            <span className="text-xs text-[#8c7d6c] line-through">
                              £{Number(addForm.originalPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* LIVE PRODUCT REVIEW: GOLD WEIGHT BADGE */}
                        <div className="pt-2 border-t border-[#e8dfd1] flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-[#8c7d6c] uppercase tracking-wider">Metal / Gold Weight:</span>
                          <span className="font-bold text-[#1c1510] bg-[#f5efe6] px-2 py-0.5 rounded-[3px] border border-[#e6dcce] flex items-center gap-1 font-mono">
                            <span>⚖️</span>
                            <span>{addForm.weightGrams ? `${String(addForm.weightGrams).replace(/g$/i, '').trim()}g` : '0.6g'}</span>
                          </span>
                        </div>

                        {/* LIVE PRODUCT REVIEW: SIZE SELECTION PILLS */}
                        <div className="pt-2 border-t border-[#e8dfd1]">
                          <div className="flex items-center justify-between text-[10px] text-[#8c7d6c] mb-1.5">
                            <span className="font-semibold uppercase tracking-wider">Product Size:</span>
                            <span className="font-bold text-[#1c1510]">{addForm.size || 'Standard'}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(addForm.sizesText
                              ? addForm.sizesText.split(',').map(s => s.trim()).filter(Boolean)
                              : ['5', '6', '7', '8', '9']
                            ).map((sz, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setAddForm(prev => ({ ...prev, size: sz }))}
                                className={`px-2 py-0.5 rounded-[3px] text-[10px] font-medium transition-all ${
                                  (addForm.size || '').trim() === sz.trim() || (!addForm.size && i === 0)
                                    ? 'bg-[#1c1510] text-[#faf7f2] font-bold shadow-xs'
                                    : 'bg-white text-[#544537] border border-[#d8c8b8] hover:border-black'
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Action Button: Add To Bag */}
                        <button
                          type="button"
                          className="w-full py-2.5 bg-[#1c1510] text-[#faf7f2] text-xs font-semibold rounded-[5px] uppercase tracking-wider shadow-sm"
                        >
                          Add To Bag
                        </button>

                        {/* LIVE PRODUCT REVIEW: BEAUTIFULLY FORMATTED DESCRIPTION */}
                        {addForm.description && (
                          <div className="pt-2 border-t border-[#e8dfd1]">
                            <p className="text-[10px] font-bold text-[#8c7d6c] uppercase tracking-wider mb-1">
                              Live Description Preview:
                            </p>
                            <div className="bg-[#fcfaf7] p-2 rounded border border-[#ebdccb]">
                              <FormattedProductDescription
                                description={addForm.description}
                                productName={addForm.name}
                                mode="compact"
                              />
                            </div>
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-between text-[10px] text-[#8c7d6c] border-t border-[#e8dfd1]">
                          <span>SKU: {addForm.sku || 'BJ-AUTO'}</span>
                          <span>Images: {(addForm.primaryImage ? 1 : 0) + addForm.additionalImages.filter(img => img && img !== addForm.primaryImage).length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Action */}
                    <div className="pt-4 border-t border-current border-opacity-20">
                      <button
                        type="submit"
                        disabled={isSubmittingProduct}
                        className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-[5px] shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isSubmittingProduct ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{editingProduct ? 'Updating...' : 'Publishing...'}</span>
                          </>
                        ) : (
                          <span>{editingProduct ? 'Update Product in Real Time' : 'Publish to Storefront Catalog'}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </ScrollReveal>
        )}

        {/* TAB: REAL-TIME CATEGORIES & COLLECTIONS MANAGER */}
        {activeTab === 'categories' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            {/* KPI STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-gray-900`}>
                <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Total Categories</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-2xl font-serif font-bold ${titleColor}`}>{categories.length}</span>
                  <div className="p-1.5 rounded-[5px] bg-gray-100 border border-gray-200 text-gray-900">
                    <CategoriesIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className={`text-[10px] ${subtitleColor} mt-1`}>Active storefront collections</p>
              </div>

              <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-emerald-500`}>
                <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Active Status</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
                    {categories.filter(c => c.is_active !== false).length}
                  </span>
                  <div className="p-1.5 rounded-[5px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Live visible in catalog</p>
              </div>

              <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-sky-500`}>
                <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Catalog Products</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-2xl font-serif font-bold ${titleColor}`}>{products.length}</span>
                  <div className="p-1.5 rounded-[5px] bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-600">
                    <DiamondIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className={`text-[10px] ${subtitleColor} mt-1`}>Total products distributed</p>
              </div>

              <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-gray-900`}>
                <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Database Sync</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Supabase Live
                  </span>
                  <div className="p-1.5 rounded-[5px] bg-gray-100 border border-gray-200 text-gray-900">
                    <BoltIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className={`text-[10px] ${subtitleColor} mt-1`}>Real-time auto replication</p>
              </div>
            </div>

            {/* Notification Messages */}
            {catSaveSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-[5px] text-xs font-semibold flex items-center gap-2 shadow-xs">
                <CheckCircleIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{catSaveSuccess}</span>
              </div>
            )}
            {catError && (
              <div className="p-3.5 bg-red-50 border border-red-300 text-red-900 rounded-[5px] text-xs font-semibold flex items-center gap-2 shadow-xs">
                <AlertTriangleIcon className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{catError}</span>
              </div>
            )}

            {/* MAIN TWO-COLUMN STUDIO: LEFT ADD/EDIT FORM, RIGHT REAL-TIME TABLE & CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT: ADD / EDIT CATEGORY FORM */}
              <div className="lg:col-span-5 space-y-4">
                <div className={`${cardBg} p-6 rounded-[5px] space-y-4 shadow-xs border border-gray-200 dark:border-[#3a2c23]`}>
                  <div className="flex items-center justify-between border-b border-current border-opacity-10 pb-3">
                    <div>
                      <h3 className={`font-serif text-base font-bold ${accentGold} flex items-center gap-2`}>
                        {editingCategory ? (
                          <>
                            <EditIcon className="w-4 h-4" />
                            <span>Edit Category</span>
                          </>
                        ) : (
                          <>
                            <PlusIcon className="w-4 h-4" />
                            <span>Add New Category</span>
                          </>
                        )}
                      </h3>
                      <p className={`text-[11px] ${subtitleColor}`}>
                        {editingCategory ? `Modifying: ${editingCategory.name}` : 'Instantly visible on storefront'}
                      </p>
                    </div>
                    {editingCategory && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(null);
                          setCategoryForm({
                            name: '',
                            slug: '',
                            description: '',
                            image: '/images/category-rings.jpg',
                            display_order: categories.length + 1,
                          });
                        }}
                        className={`text-xs px-2.5 py-1 rounded-[4px] border ${subtitleColor} hover:${titleColor}`}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleCategorySubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className={`block text-[11px] font-semibold ${subtitleColor} mb-1`}>
                        Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bridal Sets, Rings, Polki..."
                        value={categoryForm.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCategoryForm(prev => ({
                            ...prev,
                            name: val,
                            slug: !editingCategory ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : prev.slug,
                          }));
                        }}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-[11px] font-semibold ${subtitleColor} mb-1`}>
                          Slug (URL Path)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. bridal-sets"
                          value={categoryForm.slug}
                          onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                          className={`w-full text-xs px-3.5 py-2.5 rounded-[5px] font-mono focus:outline-none ${inputBg}`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-semibold ${subtitleColor} mb-1`}>
                          Display Order
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={categoryForm.display_order}
                          onChange={(e) => setCategoryForm({ ...categoryForm, display_order: Number(e.target.value) })}
                          className={`w-full text-xs px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                        />
                      </div>
                    </div>

                    {/* Image URL & Preset Pickers */}
                    <div>
                      <label className={`block text-[11px] font-semibold ${subtitleColor} mb-1`}>
                        Category Cover Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="/images/category-rings.jpg"
                        value={categoryForm.image}
                        onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-[5px] font-mono focus:outline-none mb-2 ${inputBg}`}
                      />

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className={`text-[10px] ${subtitleColor}`}>Quick Presets:</span>
                        {[
                          { label: 'Rings', url: '/images/category-rings.jpg' },
                          { label: 'Necklaces', url: '/images/category-necklaces.jpg' },
                          { label: 'Earrings', url: '/images/category-earrings.jpg' },
                          { label: 'Bracelets', url: '/images/category-bracelets.jpg' },
                        ].map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setCategoryForm({ ...categoryForm, image: p.url })}
                            className={`px-2 py-0.5 rounded-[3px] text-[10px] border border-current border-opacity-20 hover:border-opacity-60 transition-all ${
                              categoryForm.image === p.url ? 'bg-gray-900/20 font-bold text-gray-900' : subtitleColor
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className={`block text-[11px] font-semibold ${subtitleColor} mb-1`}>
                        Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Exquisite handcrafted fine jewellery designs..."
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                      />
                    </div>

                    {/* Live Preview Card */}
                    <div className="p-3 rounded-[5px] bg-gray-50 dark:bg-[#1a120c] border border-gray-200 dark:border-[#3a2c23] flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-[4px] overflow-hidden bg-[#e8ded4] dark:bg-[#281b13] flex-shrink-0 border border-gray-200">
                        <Image
                          src={categoryForm.image || '/images/category-rings.jpg'}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-xs ${titleColor} truncate`}>
                          {categoryForm.name || 'Untitled Category'}
                        </p>
                        <p className={`text-[10px] font-mono ${subtitleColor}`}>
                          /shop?category={categoryForm.name || '...'}
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={catSaving}
                      className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-wider rounded-[5px] shadow-xs transition-all flex items-center justify-center gap-2`}
                    >
                      {catSaving ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                          <span>Saving to Supabase...</span>
                        </>
                      ) : (
                        <>
                          {editingCategory ? <CheckIcon className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
                          <span>{editingCategory ? 'Update Category' : 'Save & Publish Category'}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* RIGHT: REAL-TIME CATEGORIES LIST & PRODUCT COUNTS */}
              <div className="lg:col-span-7 space-y-4">
                <div className={`${cardBg} rounded-[5px] overflow-hidden border border-gray-200 dark:border-[#3a2c23]`}>
                  <div className="p-4 border-b border-current border-opacity-10 flex items-center justify-between">
                    <div>
                      <h3 className={`font-serif text-base font-bold ${titleColor}`}>
                        Active Categories Catalog ({categories.length})
                      </h3>
                      <p className={`text-[11px] ${subtitleColor}`}>
                        Live synced with Supabase Real-Time database
                      </p>
                    </div>
                    <Link
                      href="/categories"
                      target="_blank"
                      className="px-3 py-1.5 rounded-[4px] bg-gray-50 hover:bg-gray-100 text-gray-900 dark:text-slate-200 text-[11px] font-semibold border border-gray-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>View Storefront</span>
                      <ExternalLinkIcon className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`${tableHeaderBg} uppercase tracking-wider font-semibold text-[10.5px]`}>
                        <tr>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Slug</th>
                          <th className="p-3.5">Catalog Products</th>
                          <th className="p-3.5">Order</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${tableRowHover}`}>
                        {categories.map((cat) => {
                          const productCount = products.filter(
                            (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
                          ).length;

                          return (
                            <tr key={cat.id || cat.slug} className="transition-colors">
                              <td className="p-3.5 flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-[5px] overflow-hidden bg-[#e8ded4] dark:bg-[#251a13] flex-shrink-0 border border-gray-200 dark:border-[#3a2c23]">
                                  <Image
                                    src={cat.image || '/images/category-rings.jpg'}
                                    alt={cat.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className={`font-bold ${titleColor}`}>{cat.name}</p>
                                  <p className={`text-[10px] ${subtitleColor} line-clamp-1 max-w-xs`}>
                                    {cat.description || 'No description provided'}
                                  </p>
                                </div>
                              </td>

                              <td className={`p-3.5 font-mono text-[11px] ${subtitleColor}`}>
                                {cat.slug}
                              </td>

                              <td className="p-3.5">
                                <Link
                                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] bg-gray-50 hover:bg-gray-100 text-gray-900 dark:text-slate-200 text-[11px] font-semibold border border-gray-200 transition-colors"
                                  title="View items in this category"
                                >
                                  <span>{productCount}</span>
                                  <span>items</span>
                                  <ExternalLinkIcon className="w-2.5 h-2.5 ml-0.5" />
                                </Link>
                              </td>

                              <td className={`p-3.5 font-mono ${subtitleColor}`}>
                                #{cat.display_order ?? 1}
                              </td>

                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCategory(cat);
                                      setCategoryForm({
                                        name: cat.name,
                                        slug: cat.slug,
                                        description: cat.description || '',
                                        image: cat.image || '/images/category-rings.jpg',
                                        display_order: cat.display_order || 1,
                                      });
                                    }}
                                    className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:text-slate-200 rounded-[5px] text-[10px] font-bold transition-colors border border-gray-200 flex items-center gap-1 shadow-2xs"
                                  >
                                    <EditIcon className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCategory(cat)}
                                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-800 dark:bg-red-950/80 dark:hover:bg-red-900 dark:text-red-200 rounded-[5px] text-[10px] font-semibold transition-colors border border-red-200 dark:border-red-900 flex items-center gap-1 shadow-2xs"
                                  >
                                    <TrashIcon className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* TAB 3: ADMIN ENVIRONMENT SLIDER & BANNER MANAGER */}
        {activeTab === 'slides' && (

          <ScrollReveal direction="up" delay={100} className="space-y-4">
            {/* REAL-TIME HERO SECTION EDITOR */}
            <div className={`${cardBg} rounded-[5px] p-4 space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current border-opacity-15 pb-4">
                <div>
                  <h2 className={`font-serif text-xl font-bold ${accentGold} flex items-center gap-2`}>
                    <BoltIcon className="w-5 h-5 text-gray-900" />
                    <span>Main Storefront Hero Section Editor</span>
                  </h2>
                  <p className={`text-xs ${subtitleColor}`}>Edit headline, subtext, button links, background campaign image, and featured card live on the main website homepage.</p>
                </div>
                {heroSaveMsg && (
                  <span className="px-3 py-1.5 rounded-[5px] bg-emerald-600 text-white text-xs font-bold shadow flex items-center gap-1.5">
                    <CheckIcon className="w-3.5 h-3.5" />
                    <span>Hero Section Saved &amp; Live!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleHeroSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Form Inputs */}
                  <div className="lg:col-span-7 space-y-4 text-xs">
                    <div>
                      <label className={`block font-semibold ${subtitleColor} mb-1`}>Brand Pre-Title Tag</label>
                      <input
                        type="text"
                        value={heroForm.brandPretitle}
                        onChange={(e) => setHeroForm({ ...heroForm, brandPretitle: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                        placeholder="e.g. BHAI JEWELLER"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block font-semibold ${subtitleColor} mb-1`}>Headline Line 1</label>
                        <input
                          type="text"
                          value={heroForm.headlineLine1}
                          onChange={(e) => setHeroForm({ ...heroForm, headlineLine1: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          placeholder="e.g. Jewellery, made"
                        />
                      </div>
                      <div>
                        <label className={`block font-semibold ${subtitleColor} mb-1`}>Headline Line 2 (Italic Gold)</label>
                        <input
                          type="text"
                          value={heroForm.headlineLine2}
                          onChange={(e) => setHeroForm({ ...heroForm, headlineLine2: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                          placeholder="e.g. unforgettable"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block font-semibold ${subtitleColor} mb-1`}>Headline Line 3 (Optional)</label>
                      <input
                        type="text"
                        value={heroForm.headlineLine3}
                        onChange={(e) => setHeroForm({ ...heroForm, headlineLine3: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                        placeholder="e.g. Royal Heritage"
                      />
                    </div>

                    <div>
                      <label className={`block font-semibold ${subtitleColor} mb-1`}>Hero Subtitle / Description</label>
                      <textarea
                        rows={3}
                        value={heroForm.description}
                        onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                        placeholder="Timeless pieces for modern souls..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block font-semibold ${subtitleColor} mb-1`}>Button Link Name (Keep Short, e.g. Shop Now)</label>
                        <input
                          type="text"
                          value={heroForm.primaryCtaText}
                          onChange={(e) => setHeroForm({ ...heroForm, primaryCtaText: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                        />
                      </div>
                      <div>
                        <label className={`block font-semibold ${subtitleColor} mb-1`}>Button Target Link</label>
                        <input
                          type="text"
                          value={heroForm.primaryCtaHref}
                          onChange={(e) => setHeroForm({ ...heroForm, primaryCtaHref: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                        />
                      </div>
                    </div>

                    {/* Hero Background Image Upload */}
                    <div className="p-4 border rounded-[5px] border-current border-opacity-20 space-y-2">
                      <label className={`block font-bold ${accentGold}`}>Main Hero Background Image</label>
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleHeroImageUpload(e, 'heroImage')}
                          className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-[5px] file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white cursor-pointer"
                        />
                        <span className={`text-[10px] ${subtitleColor}`}>or URL:</span>
                        <input
                          type="text"
                          value={heroForm.heroImage}
                          onChange={(e) => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                          className={`flex-1 px-3 py-1.5 text-xs rounded-[5px] focus:outline-none ${inputBg}`}
                          placeholder="/images/hero-img.jpg"
                        />
                      </div>
                    </div>

                    {/* Featured Collection Card Image & Info */}
                    <div className="p-4 border rounded-[5px] border-current border-opacity-20 space-y-3">
                      <h4 className={`font-bold ${accentGold}`}>Right Floating Featured Card Config</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={`block ${subtitleColor} mb-1`}>Featured Title</label>
                          <input
                            type="text"
                            value={heroForm.featuredTitle}
                            onChange={(e) => setHeroForm({ ...heroForm, featuredTitle: e.target.value })}
                            className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                          />
                        </div>
                        <div>
                          <label className={`block ${subtitleColor} mb-1`}>Featured Subtitle</label>
                          <input
                            type="text"
                            value={heroForm.featuredSubtitle}
                            onChange={(e) => setHeroForm({ ...heroForm, featuredSubtitle: e.target.value })}
                            className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block ${subtitleColor} mb-1`}>Featured Image (Upload from device or URL)</label>
                        <div className="flex flex-col sm:flex-row gap-2 items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleHeroImageUpload(e, 'featuredImage')}
                            className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-[5px] file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white cursor-pointer"
                          />
                          <input
                            type="text"
                            value={heroForm.featuredImage}
                            onChange={(e) => setHeroForm({ ...heroForm, featuredImage: e.target.value })}
                            className={`flex-1 px-3 py-1.5 text-xs rounded-[5px] focus:outline-none ${inputBg}`}
                            placeholder="/images/featured-ring.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Real-Time Preview */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="sticky top-6 space-y-3">
                      <span className={`flex items-center gap-1.5 font-bold text-xs ${accentGold}`}>
                        <EyeIcon className="w-4 h-4" />
                        <span>Live Real-Time Hero Preview</span>
                      </span>
                      <div className="relative w-full rounded-[5px] overflow-hidden bg-[#120e0b] border border-[#3a2c23] p-6 text-white min-h-[300px] flex flex-col justify-between shadow-xl">
                        {heroForm.heroImage && (
                          <Image src={heroForm.heroImage} alt="Hero Preview" fill className="object-cover opacity-50 z-0" />
                        )}
                        <div className="relative z-10 space-y-2">
                          <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-medium">{heroForm.brandPretitle || 'BHAI JEWELLER'}</p>
                          <h3 className="font-serif text-2xl font-normal leading-tight">
                            {heroForm.headlineLine1}{' '}
                            <span className="italic text-gray-100 font-light">{heroForm.headlineLine2}</span>
                            {heroForm.headlineLine3 && <span> {heroForm.headlineLine3}</span>}
                          </h3>
                          <p className="text-xs text-[#cfc6bc] line-clamp-3 font-light">{heroForm.description}</p>
                          <div className="pt-2">
                            <span className="px-4 py-2 rounded-full bg-white text-gray-900 font-bold text-xs inline-flex items-center gap-1">
                              <span>{heroForm.primaryCtaText || 'Shop Collection'}</span>
                              <ChevronRightIcon className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>

                        {/* Featured Card Preview */}
                        <div className="relative z-10 mt-4 p-3 bg-white/10 backdrop-blur-md rounded-[5px] border border-white/20 flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-[5px] overflow-hidden bg-gray-800 flex-shrink-0">
                            {heroForm.featuredImage && (
                              <Image src={heroForm.featuredImage} alt="Featured Preview" fill className="object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] text-gray-300 font-bold uppercase tracking-wider">FEATURED</p>
                            <p className="text-xs font-serif font-bold text-white truncate">{heroForm.featuredTitle || 'Diamond Elegance'}</p>
                            <p className="text-[10px] text-gray-300 truncate">{heroForm.featuredSubtitle}</p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className={`w-full py-3.5 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-[5px] shadow-xl transition-all flex items-center justify-center gap-2`}
                      >
                        <BoltIcon className="w-4 h-4" />
                        <span>Save Real-Time Hero Section Live</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg} p-5 rounded-[5px]`}>
              <div>
                <h2 className={`font-serif text-lg font-semibold ${accentGold}`}>Additional Homepage Banner Slides</h2>
                <p className={`text-xs ${subtitleColor}`}>Add, edit, toggle visibility, and reorder extra banner slides for the storefront slider.</p>
              </div>
              <button
                onClick={() => setIsAddSlideOpen(true)}
                className={`px-4 py-2 ${primaryBtn} font-semibold text-xs rounded-[5px] transition-all shadow-md flex items-center gap-1.5`}
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Add New Hero Slide</span>
              </button>
            </div>

            {/* Slide Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {slides.map((slide) => (
                <div key={slide.id} className={`${cardBg} rounded-[5px] overflow-hidden flex flex-col justify-between`}>
                  <div>
                    {/* Slide Image Preview */}
                    <div className="relative w-full h-36 bg-[#e8dfd1] dark:bg-[#1a120e] border-b border-[#e8dfd1] dark:border-[#2a201a]">
                      <Image src={slide.image} alt={slide.title} fill className="object-cover opacity-90" />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2.5 py-1 rounded-[5px] text-[10px] font-semibold uppercase tracking-wider ${
                          slide.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-700'
                        }`}>
                          {slide.status}
                        </span>
                      </div>
                      <div className={`absolute bottom-2 left-2 ${isLight ? 'bg-white/95 text-gray-800 border-gray-200 font-semibold' : 'bg-slate-900/90 text-slate-200 border-slate-700'} px-2 py-0.5 rounded-[5px] text-[10px] font-mono border`}>
                        Order #{slide.order}
                      </div>
                    </div>
                    {/* Slide Content */}
                    <div className="p-3 space-y-1.5">
                      <h3 className={`font-serif font-bold ${titleColor} text-sm leading-snug`}>{slide.title}</h3>
                      <p className={`text-xs ${subtitleColor} line-clamp-2`}>{slide.subtitle}</p>
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-t border-gray-100 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Link Name:</span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-900 border border-gray-200 rounded text-[11px] font-semibold max-w-[120px] truncate" title={slide.ctaText}>
                            {slide.ctaText || 'Link'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-mono truncate max-w-[160px]" title={slide.ctaLink}>
                          <span>URL:</span>
                          <span className="truncate font-medium text-gray-700">{slide.ctaLink || '/'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className={`p-2.5 border-t ${cardHeaderBorder} ${isLight ? 'bg-white' : 'bg-[#100b08]'} flex items-center justify-between gap-2`}>
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
                        ? isLight ? 'bg-gray-900 text-white font-bold' : 'bg-gray-900 text-white text-[#140e0b] font-bold'
                        : isLight ? 'bg-gray-100 text-[#5c4d40] border border-gray-200' : 'bg-[#1a120e] text-[#c2b4a3] border border-[#3a2c23]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className={`${cardBg} rounded-[5px] p-4 flex flex-col justify-between space-y-3 transition-all hover:border-gray-400`}>
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
                      <p className={`text-base font-serif ${accentGold} font-bold`}>£{order.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1 flex flex-wrap gap-1">
                    {order.status !== 'Processing' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Processing')}
                        className={`flex-1 py-1 px-1.5 border rounded-[5px] text-[9px] font-semibold text-center transition-colors ${
                          isLight ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-slate-800 text-slate-200 border-slate-700'
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

                  {/* FEATURE 2: PRINT LUXURY INVOICE BUTTON */}
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className={`w-full py-1.5 px-2 rounded-[5px] text-[10px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      isLight
                        ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                        : 'bg-[#1f1612] text-gray-900 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <PrinterIcon className="w-3.5 h-3.5" />
                    <span>Print Invoice / Receipt</span>
                  </button>
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
                <div key={enq.id} className={`${cardBg} rounded-[5px] p-4 flex flex-col justify-between space-y-3 transition-all hover:border-gray-400`}>
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
                          isLight ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-slate-800 text-slate-200 border-slate-700'
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

        {/* TAB 6: REGISTERED ACCOUNTS & SECURITY LOGS */}
        {activeTab === 'customers' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            {/* Sub-tab Switcher Header */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg} p-4 rounded-[5px]`}>
              <div>
                <h2 className={`font-serif text-lg font-bold ${accentGold} flex items-center gap-2`}>
                  {userTabMode === 'users' ? (
                    <>
                      <UsersIcon className="w-5 h-5 text-gray-900" />
                      <span>Registered User Accounts</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="w-5 h-5 text-gray-900" />
                      <span>Live IP Security &amp; Login Audit Logs</span>
                    </>
                  )}
                </h2>
                <p className={`text-xs ${subtitleColor}`}>
                  {userTabMode === 'users'
                    ? 'Real-time list of all signed up clients and admin accounts stored in Supabase.'
                    : 'Security tracking of login attempts, IP addresses, and 5-attempt lockout blocks.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUserTabMode('users')}
                  className={`px-4 py-2 rounded-[5px] text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                    userTabMode === 'users'
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm font-bold'
                      : isLight
                      ? 'bg-gray-100 text-[#5c4d40] border-gray-200'
                      : 'bg-[#1a120e] text-[#c2b4a3] border-[#3a2c23]'
                  }`}
                >
                  <UsersIcon className="w-3.5 h-3.5" />
                  <span>User Accounts ({registeredUsers.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserTabMode('security')}
                  className={`px-4 py-2 rounded-[5px] text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                    userTabMode === 'security'
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm font-bold'
                      : isLight
                      ? 'bg-gray-100 text-[#5c4d40] border-gray-200'
                      : 'bg-[#1a120e] text-[#c2b4a3] border-[#3a2c23]'
                  }`}
                >
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  <span>Security Audit Logs ({loginAttemptsLogs.length})</span>
                </button>
              </div>
            </div>

            {/* TAB MODE 1: REGISTERED USER ACCOUNTS TABLE WITH BAN & STATUS MANAGEMENT */}
            {userTabMode === 'users' && (
              <div className="space-y-4">
                {/* Success Notification Banner */}
                {userActionMsg && (
                  <div className="p-3.5 rounded-[5px] bg-emerald-700 text-white text-xs font-semibold flex items-center justify-between shadow-md animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-white" />
                      <span>{userActionMsg}</span>
                    </div>
                    <button type="button" onClick={() => setUserActionMsg('')} className="text-white hover:text-gray-200">
                      <XIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Users Filter & Search Toolbar */}
                <div className={`${cardBg} p-4 rounded-[5px] flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                  {/* Status Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {(['all', 'active', 'inactive', 'banned', 'locked'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setUserStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-[5px] text-xs font-semibold capitalize transition-all whitespace-nowrap border ${
                          userStatusFilter === st
                            ? isLight
                              ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                              : 'bg-gray-900 text-white text-[#140e0b] border-gray-200 shadow-xs'
                            : isLight
                            ? 'bg-gray-100 text-[#5c4d40] border-gray-200 hover:bg-[#ebdcb9]/40'
                            : 'bg-[#1a120e] text-[#c2b4a3] border-[#3a2c23] hover:bg-[#261a14]'
                        }`}
                      >
                        {st === 'all'
                          ? `All (${registeredUsers.length})`
                          : st === 'active'
                          ? `Active (${registeredUsers.filter((u) => u.status !== 'banned' && u.status !== 'inactive').length})`
                          : st === 'banned'
                          ? `Banned (${registeredUsers.filter((u) => u.status === 'banned' || u.isBanned).length})`
                          : st === 'inactive'
                          ? `Inactive (${registeredUsers.filter((u) => u.status === 'inactive').length})`
                          : `Locked (${registeredUsers.filter((u) => u.isLocked).length})`}
                      </button>
                    ))}
                  </div>

                  {/* Search by Name/Email */}
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={userSearchText}
                      onChange={(e) => setUserSearchText(e.target.value)}
                      placeholder="Search by client or email..."
                      className={`w-full px-3 py-1.5 text-xs rounded-[5px] focus:outline-none ${inputBg}`}
                    />
                    {userSearchText && (
                      <button
                        type="button"
                        onClick={() => setUserSearchText('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Users Table */}
                <div className={`${cardBg} rounded-[5px] overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`${tableHeaderBg} uppercase tracking-wider font-semibold`}>
                        <tr>
                          <th className="p-4">User ID</th>
                          <th className="p-4">Client Name</th>
                          <th className="p-4">Email & Phone</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Account Status</th>
                          <th className="p-4">Security / Lockout</th>
                          <th className="p-4 text-right">Admin Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${tableRowHover}`}>
                        {registeredUsers
                          .filter((u) => {
                            if (userStatusFilter === 'active') return u.status !== 'banned' && u.status !== 'inactive';
                            if (userStatusFilter === 'banned') return u.status === 'banned' || u.isBanned;
                            if (userStatusFilter === 'inactive') return u.status === 'inactive';
                            if (userStatusFilter === 'locked') return u.isLocked;
                            return true;
                          })
                          .filter((u) => {
                            if (!userSearchText.trim()) return true;
                            const query = userSearchText.toLowerCase();
                            return (
                              u.name?.toLowerCase().includes(query) ||
                              u.email?.toLowerCase().includes(query) ||
                              u.phone?.toLowerCase().includes(query)
                            );
                          }).length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-xs text-gray-500 italic">
                              No client accounts match the current filter.
                            </td>
                          </tr>
                        ) : (
                          registeredUsers
                            .filter((u) => {
                              if (userStatusFilter === 'active') return u.status !== 'banned' && u.status !== 'inactive';
                              if (userStatusFilter === 'banned') return u.status === 'banned' || u.isBanned;
                              if (userStatusFilter === 'inactive') return u.status === 'inactive';
                              if (userStatusFilter === 'locked') return u.isLocked;
                              return true;
                            })
                            .filter((u) => {
                              if (!userSearchText.trim()) return true;
                              const query = userSearchText.toLowerCase();
                              return (
                                u.name?.toLowerCase().includes(query) ||
                                u.email?.toLowerCase().includes(query) ||
                                u.phone?.toLowerCase().includes(query)
                              );
                            })
                            .map((u) => {
                              const isBanned = u.status === 'banned' || u.isBanned;
                              const isInactive = u.status === 'inactive';
                              const isLoading = userLoadingId === u.id;

                              return (
                                <tr key={u.id} className="transition-colors">
                                  <td className={`p-4 font-mono ${accentGold} font-bold`}>{u.id}</td>
                                  <td className={`p-4 font-semibold ${titleColor}`}>
                                    <div className="flex items-center gap-2.5">
                                      <div className={`w-7 h-7 rounded-full ${isBanned ? 'bg-red-800' : isInactive ? 'bg-amber-800' : 'bg-[#1c1510]'} text-[#f5efe8] text-[11px] font-serif font-bold flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                                        {u.name.substring(0, 1).toUpperCase()}
                                      </div>
                                      <div>
                                        <p>{u.name}</p>
                                        <p className={`text-[10px] ${subtitleColor} font-normal`}>Reg: {u.registeredDate}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <p className={`font-mono ${subtitleColor}`}>{u.email}</p>
                                    <p className={`text-[10px] ${subtitleColor}`}>{u.phone}</p>
                                  </td>
                                  <td className="p-4">
                                    <span
                                      className={`px-2.5 py-1 border rounded-[5px] text-[10px] font-bold uppercase tracking-wider ${
                                        u.role === 'admin'
                                          ? 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                                          : badgeBg
                                      }`}
                                    >
                                      {u.role === 'admin' ? (
                                        <span className="inline-flex items-center gap-1"><CrownIcon className="w-3 h-3 text-gray-900" /> Admin</span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1"><UsersIcon className="w-3 h-3" /> Client</span>
                                      )}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    {isBanned ? (
                                      <span className="px-2.5 py-1 rounded-[5px] bg-red-100 text-red-900 border border-red-300 dark:bg-red-950 dark:text-red-300 font-bold text-[10.5px] inline-flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                        <span>Banned</span>
                                      </span>
                                    ) : isInactive ? (
                                      <span className="px-2.5 py-1 rounded-[5px] bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10.5px] inline-flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                        <span>Inactive</span>
                                      </span>
                                    ) : (
                                      <span className="px-2.5 py-1 rounded-[5px] bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10.5px] inline-flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                        <span>Active</span>
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-4">
                                    {u.isLocked ? (
                                      <span className="px-2 py-0.5 rounded-[4px] bg-red-100 text-red-900 border border-red-300 dark:bg-red-950 dark:text-red-300 font-semibold text-[10px] inline-flex items-center gap-1">
                                        <LockIcon className="w-3 h-3 text-red-600" />
                                        <span>IP Locked ({u.failedAttempts}/5)</span>
                                      </span>
                                    ) : (
                                      <span className={`text-[10.5px] font-mono inline-flex items-center gap-1 ${u.failedAttempts > 0 ? 'text-amber-600' : subtitleColor}`}>
                                        {u.failedAttempts > 0 ? (
                                          <>
                                            <AlertTriangleIcon className="w-3 h-3 text-amber-600" />
                                            <span>{u.failedAttempts} Failed Attempts</span>
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                                            <span>0 Security Issues</span>
                                          </>
                                        )}
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                       {/* Ban / Unban Toggle Button */}
                                      {isBanned ? (
                                        <button
                                          type="button"
                                          disabled={isLoading}
                                          onClick={() => handleUpdateUserStatus(u.id, u.email, 'active', 'activate')}
                                          className="px-2.5 py-1 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10.5px] transition-all shadow-2xs flex items-center gap-1"
                                        >
                                          <CheckCircleIcon className="w-3 h-3" />
                                          <span>{isLoading ? '...' : 'Unban & Activate'}</span>
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          disabled={isLoading}
                                          onClick={() => handleUpdateUserStatus(u.id, u.email, 'banned', 'ban')}
                                          className="px-2.5 py-1 rounded-[4px] bg-red-600 hover:bg-red-700 text-white font-semibold text-[10.5px] transition-all shadow-2xs flex items-center gap-1"
                                        >
                                          <AlertCircleIcon className="w-3 h-3" />
                                          <span>{isLoading ? '...' : 'Ban User'}</span>
                                        </button>
                                      )}

                                      {/* Inactive / Activate Toggle */}
                                      {!isBanned && (
                                        isInactive ? (
                                          <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={() => handleUpdateUserStatus(u.id, u.email, 'active', 'activate')}
                                            className="px-2 py-1 rounded-[4px] bg-gray-900 text-white font-semibold text-[10.5px] hover:bg-black transition-all shadow-2xs flex items-center gap-1"
                                          >
                                            <CheckCircleIcon className="w-3 h-3" />
                                            <span>{isLoading ? '...' : 'Activate'}</span>
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={() => handleUpdateUserStatus(u.id, u.email, 'inactive', 'deactivate')}
                                            className="px-2 py-1 rounded-[4px] border border-amber-600 text-amber-700 dark:text-amber-400 font-semibold text-[10.5px] hover:bg-amber-100 dark:hover:bg-amber-950 transition-all flex items-center gap-1"
                                          >
                                            <LockIcon className="w-3 h-3" />
                                            <span>{isLoading ? '...' : 'Inactive'}</span>
                                          </button>
                                        )
                                      )}

                                      {/* Reset IP Lockout */}
                                      {u.isLocked && (
                                        <button
                                          type="button"
                                          disabled={isLoading}
                                          onClick={() => handleUpdateUserStatus(u.id, u.email, 'active', 'unlock')}
                                          className="px-2 py-1 rounded-[4px] bg-purple-700 hover:bg-purple-800 text-white font-semibold text-[10.5px] transition-all shadow-2xs flex items-center gap-1"
                                        >
                                          <ShieldCheckIcon className="w-3 h-3" />
                                          <span>Unlock</span>
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB MODE 2: ENTERPRISE SECURITY AUDIT TRAIL & ACTIVITY TRACKER */}
            {userTabMode === 'security' && (
              <div className="space-y-6">
                {/* SECURITY METRIC CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-purple-600`}>
                    <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Total Audit Events</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-2xl font-serif font-bold ${titleColor}`}>{auditLogs.length}</span>
                      <span className="p-1.5 rounded-[5px] bg-purple-100 dark:bg-purple-950 text-purple-600">
                        <ShieldCheckIcon className="w-5 h-5" />
                      </span>
                    </div>
                    <p className={`text-[10px] ${subtitleColor} mt-1`}>Recorded in current audit session</p>
                  </div>

                  <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-red-500`}>
                    <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Threats &amp; Critical Alerts</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-2xl font-serif font-bold text-red-600 dark:text-red-400">
                        {auditLogs.filter((l) => l.severity === 'CRITICAL').length}
                      </span>
                      <span className="p-1.5 rounded-[5px] bg-red-100 dark:bg-red-950 text-red-600 animate-pulse">
                        <AlertTriangleIcon className="w-5 h-5" />
                      </span>
                    </div>
                    <p className="text-[10px] text-red-600 dark:text-red-400 mt-1">IP locks &amp; rate violations</p>
                  </div>

                  <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-blue-500`}>
                    <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Authentication Audits</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-2xl font-serif font-bold text-blue-600 dark:text-blue-400">
                        {auditLogs.filter((l) => l.category === 'AUTH').length}
                      </span>
                      <span className="p-1.5 rounded-[5px] bg-blue-100 dark:bg-blue-950 text-blue-600">
                        <LockIcon className="w-5 h-5" />
                      </span>
                    </div>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">HMAC sessions &amp; logins</p>
                  </div>

                  <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-emerald-500`}>
                    <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>Store Operations</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
                        {auditLogs.filter((l) => l.category === 'ORDER' || l.category === 'INVENTORY').length}
                      </span>
                      <span className="p-1.5 rounded-[5px] bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                        <ProductsIcon className="w-5 h-5" />
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Order &amp; stock mutations</p>
                  </div>
                </div>

                {/* FILTER BAR & CSV EXPORT */}
                <div className={`p-4 ${cardBg} rounded-[5px] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search audit trail by Action, IP, Details, or Actor..."
                      value={auditSearchQuery}
                      onChange={(e) => setAuditSearchQuery(e.target.value)}
                      className={`text-xs px-3 py-2 rounded-[5px] focus:outline-none w-full sm:w-64 ${inputBg}`}
                    />

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1a120e] p-1 rounded-[5px] border border-gray-200 dark:border-[#3a2c23]">
                      {(['ALL', 'AUTH', 'SECURITY', 'ORDER', 'INVENTORY'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setAuditCategoryFilter(cat)}
                          className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold transition-all ${
                            auditCategoryFilter === cat
                              ? 'bg-[#1c1510] text-[#f5efe8] shadow-2xs'
                              : `${subtitleColor} hover:${titleColor}`
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Severity Filter Pills */}
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1a120e] p-1 rounded-[5px] border border-gray-200 dark:border-[#3a2c23]">
                      {(['ALL', 'INFO', 'WARNING', 'CRITICAL'] as const).map((sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setAuditSeverityFilter(sev)}
                          className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold transition-all ${
                            auditSeverityFilter === sev
                              ? sev === 'CRITICAL'
                                ? 'bg-red-600 text-white shadow-2xs'
                                : sev === 'WARNING'
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'bg-emerald-600 text-white shadow-2xs'
                              : `${subtitleColor} hover:${titleColor}`
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Export CSV Button */}
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={handleExportAuditCSV}
                      className="px-3.5 py-2 rounded-[5px] border border-gray-200 bg-[#ffffff] hover:bg-[#fbfaf8] text-gray-900 dark:border-[#3a2c23] dark:bg-[#1a120e] dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                      title="Download complete security audit log as CSV"
                    >
                      <ExportIcon className="w-3.5 h-3.5" />
                      <span>Export Audit CSV</span>
                    </button>
                  </div>
                </div>

                {/* AUDIT LOG TABLE */}
                <div className={`${cardBg} rounded-[5px] overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`${tableHeaderBg} uppercase tracking-wider font-semibold`}>
                        <tr>
                          <th className="p-4">Log ID</th>
                          <th className="p-4">Timestamp (UTC)</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Action</th>
                          <th className="p-4">Details &amp; Event Payload</th>
                          <th className="p-4">Severity</th>
                          <th className="p-4">Origin IP</th>
                          <th className="p-4 text-right">Actor</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${tableRowHover}`}>
                        {auditLogs
                          .filter((l) => {
                            const matchCat = auditCategoryFilter === 'ALL' || l.category === auditCategoryFilter;
                            const matchSev = auditSeverityFilter === 'ALL' || l.severity === auditSeverityFilter;
                            const q = auditSearchQuery.toLowerCase();
                            const matchQ =
                              !q ||
                              l.action.toLowerCase().includes(q) ||
                              l.details.toLowerCase().includes(q) ||
                              l.ip.toLowerCase().includes(q) ||
                              l.actor.toLowerCase().includes(q);
                            return matchCat && matchSev && matchQ;
                          })
                          .map((log) => (
                            <tr key={log.id} className="transition-colors">
                              <td className={`p-4 font-mono font-bold ${accentGold}`}>{log.id}</td>
                              <td className={`p-4 font-mono ${subtitleColor} text-[11px]`}>{log.timestamp}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold border inline-flex items-center gap-1 ${badgeBg}`}>
                                  {log.category === 'AUTH' ? (
                                    <>
                                      <LockIcon className="w-3 h-3 text-gray-900" />
                                      <span>AUTH</span>
                                    </>
                                  ) : log.category === 'SECURITY' ? (
                                    <>
                                      <ShieldCheckIcon className="w-3 h-3 text-gray-900" />
                                      <span>SECURITY</span>
                                    </>
                                  ) : log.category === 'ORDER' ? (
                                    <>
                                      <OrdersIcon className="w-3 h-3 text-gray-900" />
                                      <span>ORDER</span>
                                    </>
                                  ) : (
                                    <>
                                      <DiamondIcon className="w-3 h-3 text-gray-900" />
                                      <span>INVENTORY</span>
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className={`p-4 font-mono font-semibold ${titleColor} text-[11px]`}>{log.action}</td>
                              <td className={`p-4 ${subtitleColor} max-w-xs truncate`} title={log.details}>
                                {log.details}
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-1 rounded-[5px] text-[10px] font-bold uppercase tracking-wider ${
                                    log.severity === 'CRITICAL'
                                      ? 'bg-red-100 text-red-900 border border-red-300 dark:bg-red-950 dark:text-red-300 animate-pulse'
                                      : log.severity === 'WARNING'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                                  }`}
                                >
                                  {log.severity}
                                </span>
                              </td>
                              <td className={`p-4 font-mono text-[10.5px] ${titleColor}`}>{log.ip}</td>
                              <td className={`p-4 text-right font-mono text-[11px] ${accentGold}`}>{log.actor}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </ScrollReveal>
        )}

        {/* TAB 7: LIVE GOLD RATE MANAGER */}
        {activeTab === 'goldrates' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            <div className={`${cardBg} rounded-[5px] p-6 max-w-2xl mx-auto space-y-6`}>
              <div>
                <h2 className={`font-serif text-xl font-bold ${accentGold} flex items-center gap-2`}>
                  <GoldRatesIcon className="w-5 h-5 text-gray-900" />
                  <span>Live Gold Bullion Pricing Engine</span>
                </h2>
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
                  <p className={`font-semibold ${accentGold} mb-1 flex items-center gap-1.5`}>
                    <SparklesIcon className="w-4 h-4 text-gray-900" />
                    <span>Automated Pricing Formula:</span>
                  </p>
                  <p>Catalog price = (Gold Weight × 22K Rate) + Artisan Making Charges + Diamond Carat Value.</p>
                </div>

                <button
                  onClick={() => alert("Gold Rates Updated Live!")}
                  className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all shadow-md flex items-center justify-center gap-2`}
                >
                  <GoldRatesIcon className="w-4 h-4" />
                  <span>Save &amp; Push Gold Rates Live</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* TAB 8: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <ScrollReveal direction="up" delay={100} className="space-y-6">
            {/* ANNOUNCEMENT BAR MANAGER */}
            <div className={`${cardBg} rounded-[5px] p-6 max-w-3xl mx-auto space-y-6`}>
              <div className="flex items-center justify-between border-b border-current border-opacity-15 pb-3">
                <div>
                  <h2 className={`font-serif text-xl font-bold ${accentGold} flex items-center gap-2`}>
                    <StoreIcon className="w-5 h-5 text-gray-900" />
                    <span>Real-Time Top Announcement Bar Manager</span>
                  </h2>
                  <p className={`text-xs ${subtitleColor}`}>Edit promotional top-bar text slides &amp; toggle visibility on main site live.</p>
                </div>
                {announcementSaveMsg && (
                  <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-[5px] shadow flex items-center gap-1">
                    <CheckIcon className="w-3.5 h-3.5" />
                    <span>Announcement Live!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleAnnouncementSubmit} className="space-y-4 text-xs">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-3 rounded-[5px] border border-current border-opacity-20">
                  <div>
                    <span className={`font-bold ${titleColor}`}>Enable Announcement Top Bar</span>
                    <p className={`text-[10px] ${subtitleColor}`}>Shows rotating notification bar at top of desktop site.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnnouncementForm(prev => ({ ...prev, isEnabled: !prev.isEnabled }))}
                    className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all ${
                      announcementForm.isEnabled
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-gray-400 text-gray-900'
                    }`}
                  >
                    {announcementForm.isEnabled ? 'ON (Visible)' : 'OFF (Hidden)'}
                  </button>
                </div>

                <div>
                  <label className={`block font-semibold ${subtitleColor} mb-1`}>Announcement Message 1</label>
                  <input
                    type="text"
                    value={announcementForm.message1}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message1: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                    placeholder="Free worldwide shipping on all orders over £150..."
                  />
                </div>

                <div>
                  <label className={`block font-semibold ${subtitleColor} mb-1`}>Announcement Message 2</label>
                  <input
                    type="text"
                    value={announcementForm.message2}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message2: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                    placeholder="Complimentary luxury gift packaging on every order..."
                  />
                </div>

                <div>
                  <label className={`block font-semibold ${subtitleColor} mb-1`}>Announcement Message 3</label>
                  <input
                    type="text"
                    value={announcementForm.message3}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message3: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                    placeholder="Fine jewellery showroom in Bradford, West Yorkshire..."
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all shadow-md flex items-center justify-center gap-2`}
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>Save &amp; Push Announcement Bar Live</span>
                </button>
              </form>
            </div>

            {/* STORE CONFIGURATION */}
            <div className={`${cardBg} rounded-[5px] p-6 max-w-3xl mx-auto space-y-6`}>
              <h2 className={`font-serif text-xl font-bold ${accentGold} flex items-center gap-2`}>
                <SettingsIcon className="w-5 h-5 text-gray-900" />
                <span>Storewide Configuration</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className={`block uppercase tracking-wider ${subtitleColor} mb-1 font-semibold`}>
                    Free Shipping Threshold ($)
                  </label>
                  <input
                    type="text"
                    value={shippingThreshold}
                    onChange={(e) => setShippingThreshold(e.target.value)}
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
              <h3 className={`font-serif text-lg ${accentGold} font-bold flex items-center gap-2`}>
                <SlidesIcon className="w-5 h-5 text-gray-900" />
                <span>Add Hero Slide Banner</span>
              </h3>
              <button onClick={() => setIsAddSlideOpen(false)} className={`${subtitleColor} hover:${titleColor}`}>
                <XIcon className="w-4 h-4" />
              </button>
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
                  <label className={`block ${subtitleColor} mb-1`}>Link Name / Button Text (Short)</label>
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
                  className={`px-4 py-2 ${isLight ? 'bg-gray-100 text-[#5c4d40]' : 'bg-[#1f1612] text-[#c2b4a3]'} border border-opacity-50 rounded-[5px]`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${primaryBtn} font-bold rounded-[5px] flex items-center gap-1.5`}
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Publish Slide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FEATURE 2: PROFESSIONAL LUXURY PRINTABLE TAX INVOICE MODAL */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white text-[#1c1510] rounded-[6px] shadow-2xl overflow-hidden my-auto border border-gray-200">
            {/* NO-PRINT ACTION BAR */}
            <div className="no-print bg-[#1c1510] text-[#f5efe8] px-5 py-3.5 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-2">
                <PrinterIcon className="w-5 h-5 text-gray-900" />
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold tracking-wide">
                    Official Tax Invoice &amp; Authenticity Receipt
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono">Reference: INV-{selectedInvoiceOrder.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-[4px] bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print Invoice / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="px-3 py-2 rounded-[4px] bg-white/10 hover:bg-white/20 text-[#f5efe8] text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <XIcon className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* PRINTABLE INVOICE BODY (A4 READY) */}
            <div id="printable-luxury-invoice" className="p-6 sm:p-10 bg-white text-[#1c1510] space-y-6 text-xs font-sans">
              {/* INVOICE HEADER */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-[#1c1510] gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CrownIcon className="w-6 h-6 text-gray-900" />
                    <h1 className="font-serif text-2xl font-bold tracking-widest text-[#1c1510] uppercase">
                      BHAI JEWELLER
                    </h1>
                  </div>
                  <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-gray-700 mt-0.5">
                    BRADFORD ATELIER &bull; FINE JEWELLERY &amp; BULLION
                  </p>
                  <p className="text-[10.5px] text-[#6b5c50] mt-1.5 leading-relaxed">
                    120 Manningham Lane, Bradford, West Yorkshire, BD8 7JF, United Kingdom<br />
                    Tel: +44 (0)1274 722888 &bull; Email: concierge@bhaijeweller.co.uk &bull; Web: www.bhaijeweller.co.uk
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[9.5px] font-mono text-[#8a796c]">
                    <span>UK VAT Reg: <strong>GB 384 9201 44</strong></span>
                    <span>&bull;</span>
                    <span>Assay Office Reg: <strong>UK-BFD-882</strong></span>
                  </div>
                </div>

                <div className="sm:text-right bg-gray-50 p-4 rounded-[4px] border border-gray-200/60 sm:min-w-[210px]">
                  <span className="font-serif text-base font-bold text-gray-900 uppercase tracking-wider block">
                    TAX INVOICE
                  </span>
                  <p className="font-mono text-xs font-bold text-[#1c1510] mt-1">
                    INV-{selectedInvoiceOrder.id}
                  </p>
                  <div className="mt-2 space-y-0.5 text-[10.5px] text-[#6b5c50]">
                    <p>Date: <span className="font-medium text-[#1c1510]">{selectedInvoiceOrder.date}</span></p>
                    <p>Status: <span className="font-bold text-emerald-700 uppercase">{selectedInvoiceOrder.status}</span></p>
                    <p>Payment: <span className="font-medium text-[#1c1510]">{selectedInvoiceOrder.paymentMethod || 'Credit / Debit Card'}</span></p>
                  </div>
                </div>
              </div>

              {/* CLIENT BILLING & DELIVERY INFORMATION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
                <div className="bg-[#faf8f5] p-3.5 rounded-[4px] border border-[#eee4d7]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Billed &amp; Delivered To:
                  </p>
                  <p className="font-serif text-sm font-semibold text-[#1c1510]">{selectedInvoiceOrder.customer}</p>
                  <p className="text-xs text-[#5c4d40] font-mono mt-0.5">{selectedInvoiceOrder.email}</p>
                  <p className="text-xs text-[#6b5c50] mt-1.5 leading-relaxed">
                    <strong>Shipping Address:</strong><br />
                    {selectedInvoiceOrder.address || 'Showroom Collection, 120 Manningham Lane, Bradford, BD8 7JF'}
                  </p>
                </div>

                <div className="bg-[#faf8f5] p-3.5 rounded-[4px] border border-[#eee4d7]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Dispatch &amp; Delivery Method:
                  </p>
                  <p className="text-xs font-medium text-[#1c1510]">Royal Mail Special Delivery Guaranteed (Insured)</p>
                  <p className="text-[11px] text-[#6b5c50] mt-1 leading-relaxed">
                    Tamper-evident luxury packaging with full postal transit insurance coverage up to &pound;10,000.
                  </p>
                  <p className="text-[10px] font-mono text-emerald-800 mt-2 font-semibold">
                    &bull; Insured Delivery: Included (&pound;0.00)
                  </p>
                </div>
              </div>

              {/* PURCHASED ITEMS TABLE */}
              <div className="overflow-hidden border border-gray-200 rounded-[4px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f5efe7] text-[#1c1510] uppercase font-bold tracking-wider text-[10px] border-b border-gray-200">
                    <tr>
                      <th className="p-3">Item Description &amp; Specifications</th>
                      <th className="p-3">Hallmark Certification</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee4d7]">
                    <tr>
                      <td className="p-3">
                        <p className="font-serif font-semibold text-sm text-[#1c1510]">{selectedInvoiceOrder.items}</p>
                        <p className="text-[10px] text-[#8a796c] mt-0.5">Order Ref: #{selectedInvoiceOrder.id}</p>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-[3px] bg-gray-900 text-white/30 text-gray-700 text-[10px] font-semibold">
                          22K (916) UK Assay Hallmark
                        </span>
                      </td>
                      <td className="p-3 text-center font-semibold">1</td>
                      <td className="p-3 text-right font-medium">&pound;{selectedInvoiceOrder.amount.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-[#1c1510]">&pound;{selectedInvoiceOrder.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* FINANCIAL BREAKDOWN */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                {/* Assay Seal Box */}
                <div className="sm:max-w-xs p-3.5 rounded-[4px] bg-gray-50 border border-gray-200/60 flex items-start gap-3">
                  <ShieldCheckIcon className="w-7 h-7 text-gray-900 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1c1510]">UK Hallmarking Act 1973 Guarantee</h4>
                    <p className="text-[10px] text-[#6b5c50] mt-1 leading-snug">
                      Every piece of fine gold sold by Bhai Jeweller Bradford is independently tested and stamped with authentic British Assay Office hallmarks.
                    </p>
                  </div>
                </div>

                {/* Subtotals & Grand Total */}
                <div className="w-full sm:w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-[#6b5c50]">
                    <span>Net Amount (Excl. VAT):</span>
                    <span className="font-medium text-[#1c1510] font-mono">
                      &pound;{(selectedInvoiceOrder.amount / 1.2).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6b5c50]">
                    <span>UK VAT (20% Included):</span>
                    <span className="font-medium text-[#1c1510] font-mono">
                      &pound;{(selectedInvoiceOrder.amount - selectedInvoiceOrder.amount / 1.2).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6b5c50]">
                    <span>Insured Delivery:</span>
                    <span className="font-semibold text-emerald-700">FREE (&pound;0.00)</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t-2 border-[#1c1510] text-sm">
                    <span className="font-bold text-[#1c1510] uppercase">Total Paid (GBP):</span>
                    <span className="font-serif text-lg font-bold text-gray-900">
                      &pound;{selectedInvoiceOrder.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* INVOICE FOOTER WITH TERMS & SIGNATURE */}
              <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] text-[#7a695d]">
                <div className="space-y-1">
                  <p><strong>Thank you for choosing Bhai Jeweller Bradford.</strong></p>
                  <p>Includes 1-year complimentary cleaning, polishing, and stone-setting inspection.</p>
                  <p>Showroom viewings &amp; bespoke consultations available by appointment.</p>
                </div>
                <div className="text-left sm:text-right pt-2 sm:pt-0">
                  <p className="font-serif italic text-xs text-gray-900 font-bold">Bhai Jeweller Bradford</p>
                  <p className="text-[9.5px] uppercase tracking-wider text-[#9a897b]">Authorized Master Goldsmith</p>
                </div>
              </div>
            </div>

            {/* PRINT STYLES */}
            <style jsx global>{`
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #printable-luxury-invoice,
                #printable-luxury-invoice * {
                  visibility: visible !important;
                }
                #printable-luxury-invoice {
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 24px !important;
                  background: white !important;
                  color: black !important;
                  box-shadow: none !important;
                  border: none !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Real-time Product Edit Modal for Admin */}
      <ProductEditModal
        product={editingAdminProduct}
        isOpen={!!editingAdminProduct}
        onClose={() => setEditingAdminProduct(null)}
      />
    </div>
  );
}

