'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useShop, ProductItem } from '@/context/ShopContext';

interface ProductEditModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export function ProductEditModal({ product, isOpen, onClose, onDeleted }: ProductEditModalProps) {
  const { categories, updateProduct, deleteProduct } = useShop();

  const [formData, setFormData] = useState<ProductItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [product]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setErrorMsg('Product name and price are required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const stock = Math.max(0, Number(formData.stock) || 0);
      const status = stock > 0 ? (stock <= 5 ? 'Low Stock' : 'In Stock') : 'Out of Stock';

      const payload: ProductItem = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        stock,
        status,
        weightGrams: Number(formData.weightGrams || 5.0),
      };

      const ok = await updateProduct(payload);
      setSaving(false);

      if (ok) {
        setSuccessMsg('✓ Product updated and synced live in real-time!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        // Even if server returns false or offline, ShopContext updated local state
        setSuccessMsg('✓ Product saved to local catalog.');
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setSaving(false);
      setErrorMsg(err?.message || 'Failed to update product.');
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${formData.name}"?\nThis will remove it from the database and storefront in real-time.`
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await deleteProduct(formData.id);
      setDeleting(false);
      onClose();
      if (onDeleted) onDeleted();
    } catch {
      setDeleting(false);
      onClose();
      if (onDeleted) onDeleted();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#17110c] text-[#f5efe8] border border-[#dec29b]/40 rounded-[8px] shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Foil Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#dec29b] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2e2117] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xl p-2 rounded-full bg-[#251a13] border border-[#dec29b]/30">✏️</span>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#dec29b] uppercase">
                Edit Product
              </h2>
              <p className="text-[11px] font-mono text-[#a8998c]">
                ID: {formData.id} &bull; Real-time Catalog Synchronizer
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#a8998c] hover:text-[#dec29b] p-1.5 rounded-full hover:bg-[#251a13] transition-colors"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-[5px] bg-red-950/80 border border-red-800 text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-[5px] bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-mono">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#dec29b] mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#0f0b08] border border-[#3d2b1f] text-[#f5efe8] font-mono text-xs outline-none focus:border-[#dec29b]"
            />
          </div>

          {/* Category & Metal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#dec29b] mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#0f0b08] border border-[#3d2b1f] text-[#f5efe8] font-mono text-xs outline-none focus:border-[#dec29b]"
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
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#dec29b]">
                  Metal Purity & Spec *
                </label>
                <span className="text-[10px] text-[#dec29b] font-mono">✍️ Type custom</span>
              </div>
              <input
                type="text"
                list="modal-gold-purity-presets"
                required
                placeholder="e.g. 21ct Gold, 22k Pure Gold, 24k Bullion..."
                value={formData.metal || ''}
                onChange={(e) => setFormData({ ...formData, metal: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#0f0b08] border border-[#3d2b1f] text-[#f5efe8] font-mono text-xs outline-none focus:border-[#dec29b]"
              />
              <datalist id="modal-gold-purity-presets">
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
                    onClick={() => setFormData({ ...formData, metal: preset })}
                    className={`px-2 py-0.5 rounded-[3px] text-[10px] border border-[#dec29b]/30 hover:border-[#dec29b] transition-all ${
                      formData.metal === preset ? 'bg-[#dec29b]/30 text-[#8c6b2d] font-bold' : 'text-[#a8998c]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>


          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#dec29b] mb-1">
                Price (£ GBP) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#0f0b08] border border-[#3d2b1f] text-[#f5efe8] font-mono text-xs outline-none focus:border-[#dec29b]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#dec29b] mb-1">
                Original Price (£)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.originalPrice || formData.price}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#0f0b08] border border-[#3d2b1f] text-[#f5efe8] font-mono text-xs outline-none focus:border-[#dec29b]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#dec29b] mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#0f0b08] border border-[#3d2b1f] text-[#f5efe8] font-mono text-xs outline-none focus:border-[#dec29b]"
              />
            </div>
          </div>

          {/* SKU & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#dec29b] mb-1">
                SKU Identifier
              </label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#0f0b08] border border-[#3d2b1f] text-[#f5efe8] font-mono text-xs outline-none focus:border-[#dec29b]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#dec29b] mb-1">
                Weight (Grams)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weightGrams || 5}
                onChange={(e) => setFormData({ ...formData, weightGrams: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#0f0b08] border border-[#3d2b1f] text-[#f5efe8] font-mono text-xs outline-none focus:border-[#dec29b]"
              />
            </div>
          </div>

          {/* Image URL & Thumbnail preview */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#dec29b] mb-1">
              Primary Image URL
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/detail-ring-hero.jpg"
                className="flex-1 px-3.5 py-2.5 rounded-[5px] bg-[#0f0b08] border border-[#3d2b1f] text-[#f5efe8] font-mono text-xs outline-none focus:border-[#dec29b]"
              />
              <div className="relative w-10 h-10 rounded-[5px] overflow-hidden border border-[#dec29b]/40 bg-[#0f0b08] flex-shrink-0">
                <Image
                  src={formData.image || '/images/detail-ring-hero.jpg'}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#dec29b] mb-1">
              Product Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#0f0b08] border border-[#3d2b1f] text-[#f5efe8] text-xs outline-none focus:border-[#dec29b]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2e2117]">
            <button
              type="button"
              disabled={deleting || saving}
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-[5px] bg-red-950/70 border border-red-800 text-red-200 hover:bg-red-900 transition-colors text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>🗑️</span>
              <span>{deleting ? 'Deleting...' : 'Delete Product'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-[5px] bg-[#251a13] border border-[#3d2b1f] text-[#cfc2b2] hover:text-[#f5efe8] text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || deleting}
                className="px-6 py-2.5 rounded-[5px] bg-gradient-to-r from-[#b38b40] to-[#dec29b] text-[#140e0b] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 shadow-lg shadow-[#b38b40]/20 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#140e0b] border-t-transparent animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <span>✓ Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
