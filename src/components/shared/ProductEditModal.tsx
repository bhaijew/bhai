'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useShop, ProductItem } from '@/context/ShopContext';
import { EditIcon, TrashIcon, XIcon, CheckIcon, CheckCircleIcon, AlertCircleIcon } from '@/components/admin/AdminIcons';

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
        setSuccessMsg('Product updated and synced live in real-time!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setSuccessMsg('Product saved to local catalog.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#ffffff] text-[#1a130e] border border-gray-200 rounded-[10px] shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-900" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-200">
              <EditIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#1a130e] uppercase">
                Edit Product
              </h2>
              <p className="text-[11px] font-mono text-[#78695d]">
                ID: {formData.id} &bull; Real-time Catalog Synchronizer
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8c7a6b] hover:text-[#1a130e] p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircleIcon className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-[#544537] mb-1 uppercase tracking-wider">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-md bg-white border border-gray-300 text-[#1a130e] text-xs outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:ring-1 focus:ring-gray-900/20 transition-all"
            />
          </div>

          {/* Category & Metal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#544537] mb-1 uppercase tracking-wider">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-gray-300 text-[#1a130e] text-xs outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:ring-1 focus:ring-gray-900/20 transition-all"
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
                <label className="block text-[11px] font-semibold text-[#544537] uppercase tracking-wider">
                  Metal Purity & Spec *
                </label>
                <span className="text-[10px] text-gray-900 font-mono">Custom text allowed</span>
              </div>
              <input
                type="text"
                list="modal-gold-purity-presets"
                required
                placeholder="e.g. 21ct Gold, 22k Pure Gold, 24k Bullion..."
                value={formData.metal || ''}
                onChange={(e) => setFormData({ ...formData, metal: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-gray-300 text-[#1a130e] text-xs outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:ring-1 focus:ring-gray-900/20 transition-all"
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
                    className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                      formData.metal === preset
                        ? 'bg-gray-900 text-white border-gray-900 font-semibold'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-900'
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
              <label className="block text-[11px] font-semibold text-[#544537] mb-1 uppercase tracking-wider">
                Price (£ GBP) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-gray-300 text-[#1a130e] text-xs font-semibold outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#544537] mb-1 uppercase tracking-wider">
                Original Price (£)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.originalPrice || formData.price}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-gray-300 text-[#1a130e] text-xs outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#544537] mb-1 uppercase tracking-wider">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-gray-300 text-[#1a130e] text-xs outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* SKU & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#544537] mb-1 uppercase tracking-wider">
                SKU Identifier
              </label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-gray-300 text-[#1a130e] font-mono text-xs outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#544537] mb-1 uppercase tracking-wider">
                Weight (Grams)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weightGrams || 5}
                onChange={(e) => setFormData({ ...formData, weightGrams: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-gray-300 text-[#1a130e] text-xs outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Image URL & Thumbnail preview */}
          <div>
            <label className="block text-[11px] font-semibold text-[#544537] mb-1 uppercase tracking-wider">
              Primary Image URL
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/detail-ring-hero.jpg"
                className="flex-1 px-3.5 py-2.5 rounded-md bg-white border border-gray-300 text-[#1a130e] text-xs outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
              <div className="relative w-11 h-11 rounded-md overflow-hidden border border-gray-300 bg-gray-100 flex-shrink-0">
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
            <label className="block text-[11px] font-semibold text-[#544537] mb-1 uppercase tracking-wider">
              Product Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-md bg-white border border-gray-300 text-[#1a130e] text-xs outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              disabled={deleting || saving}
              onClick={handleDelete}
              className="px-3.5 py-2.5 rounded-md bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4 text-red-600" />
              <span>{deleting ? 'Deleting...' : 'Delete Product'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-md bg-gray-100 border border-gray-300 text-[#6b5847] hover:text-[#1a130e] hover:bg-gray-200 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || deleting}
                className="px-5 py-2.5 rounded-md bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 shadow-md shadow-gray-900/20 flex items-center gap-1.5"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
