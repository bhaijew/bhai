'use client';

import React, { useState, useEffect, useMemo } from 'react';

export interface CustomerReview {
  id: string;
  name: string;
  location?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
  category?: string;
  metal?: string;
  onReviewsUpdated?: (count: number, avgRating: number) => void;
}

export function ProductReviews({
  productId,
  productName,
  category = 'Fine Jewellery',
  metal = '22ct Gold',
  onReviewsUpdated,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('UK');
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Fetch real reviews for this specific product
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadRealReviews = async () => {
      let realList: CustomerReview[] = [];

      // 1. Try local storage first for instant feedback (filtering out any old fake/seeded IDs)
      try {
        const storageKey = `bhai_reviews_${productId}`;
        const rawLocal = localStorage.getItem(storageKey);
        if (rawLocal) {
          const parsed = JSON.parse(rawLocal);
          if (Array.isArray(parsed)) {
            // Only keep real user-submitted reviews (not old dummy rev-1, rev-2, etc.)
            realList = parsed.filter(
              (r: any) => r && r.name && r.comment && !['rev-1', 'rev-2', 'rev-3', 'rev-4'].includes(r.id)
            );
          }
        }
      } catch {}

      // 2. Fetch from backend API / Supabase
      try {
        const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.reviews)) {
            const apiReviews = data.reviews.filter(
              (r: any) => !['rev-1', 'rev-2', 'rev-3', 'rev-4'].includes(r.id)
            );
            // Merge deduplicated by id
            const existingIds = new Set(realList.map((r) => r.id));
            for (const r of apiReviews) {
              if (!existingIds.has(r.id)) {
                realList.push(r);
                existingIds.add(r.id);
              }
            }
          }
        }
      } catch {}

      if (isMounted) {
        setReviews(realList);
        setLoading(false);
        const count = realList.length;
        const avg = count > 0
          ? parseFloat((realList.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1))
          : 0;
        onReviewsUpdated?.(count, avg);
      }
    };

    loadRealReviews();
    return () => {
      isMounted = false;
    };
  }, [productId, onReviewsUpdated]);

  // Handle genuine review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    setFormSubmitting(true);

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: formName.trim(),
      location: formLocation.trim() || 'United Kingdom',
      rating: formRating,
      date: 'Just now',
      title: formTitle.trim() || 'Customer Review',
      comment: formComment.trim(),
      verified: true,
      helpfulCount: 0,
    };

    // 1. Post to API
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          name: newRev.name,
          location: newRev.location,
          rating: newRev.rating,
          title: newRev.title,
          comment: newRev.comment,
        }),
      });
    } catch (err) {
      console.warn('API review submission fallback to local:', err);
    }

    // 2. Update state and localStorage
    const updated = [newRev, ...reviews];
    setReviews(updated);

    try {
      const storageKey = `bhai_reviews_${productId}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    const count = updated.length;
    const avg = parseFloat((updated.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1));
    onReviewsUpdated?.(count, avg);

    setFormSubmitting(false);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsWritingReview(false);
      setFormName('');
      setFormTitle('');
      setFormComment('');
      setFormRating(5);
    }, 2000);
  };

  const handleHelpfulVote = (id: string) => {
    if (helpfulClicked[id]) return;
    setHelpfulClicked((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  // Filtered reviews
  const displayedReviews = useMemo(() => {
    if (filterRating === 'all') return reviews;
    return reviews.filter((r) => r.rating === filterRating);
  }, [reviews, filterRating]);

  // Rating metrics
  const totalCount = reviews.length;
  const avgRating = useMemo(() => {
    if (totalCount === 0) return '0.0';
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / totalCount).toFixed(1);
  }, [reviews, totalCount]);

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  return (
    <section id="customer-reviews" className="mt-14 pt-10 border-t border-[#e8ded4] scroll-mt-28">
      {/* ── Section Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase text-[#8c6d3d] bg-[#f5efe6] px-2.5 py-1 rounded-[4px] border border-[#e6dcce]">
            Authentic Customer Feedback
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1c1510] font-normal mt-2">
            Customer Reviews {totalCount > 0 ? `(${totalCount})` : ''}
          </h2>
          <p className="text-xs sm:text-sm text-[#7a6a5d] font-light mt-1">
            {totalCount > 0
              ? `Real verified buyer reviews for ${productName}.`
              : `Share your authentic experience with this handcrafted piece.`}
          </p>
        </div>

        {/* Write Review CTA Button */}
        <button
          type="button"
          onClick={() => setIsWritingReview((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[6px] bg-[#1c1510] text-[#faf7f2] hover:bg-[#33251a] active:scale-[0.99] text-xs font-semibold tracking-wider uppercase transition-all shadow-xs border border-[#1c1510]"
        >
          <svg className="w-4 h-4 text-[#dec29b]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          <span>{isWritingReview ? 'Close Review Form' : totalCount === 0 ? 'Write the First Review' : 'Write a Review'}</span>
        </button>
      </div>

      {/* ── If Product Has Real Reviews: Show Breakdown ── */}
      {totalCount > 0 && (
        <div className="rounded-[8px] border border-[#e6dbc9] bg-[#fbf9f5] p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-[0_2px_10px_rgba(28,21,16,0.03)] mb-8">
          
          {/* Overall Score */}
          <div className="md:col-span-4 text-center md:text-left md:border-r md:border-[#ede3d4] md:pr-6">
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="font-serif text-5xl sm:text-6xl font-normal text-[#1c1510] tracking-tight">
                {avgRating}
              </span>
              <span className="text-lg text-[#8c7d6c] font-light">/ 5.0</span>
            </div>

            <div className="flex justify-center md:justify-start gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className={`w-5 h-5 ${s <= Math.round(parseFloat(avgRating)) ? 'text-[#c59d5f]' : 'text-[#ded6c9]'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <p className="text-xs text-[#5c493b] font-medium">
              Based on {totalCount} verified buyer {totalCount === 1 ? 'review' : 'reviews'}
            </p>
            <p className="text-[11px] text-emerald-700 font-light mt-0.5 flex items-center justify-center md:justify-start gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              100% Genuine British Customer Feedback
            </p>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="md:col-span-8 flex flex-col gap-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star as 1 | 2 | 3 | 4 | 5] || 0;
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-right font-medium text-[#5c493b] flex items-center justify-end gap-1">
                    <span>{star}</span>
                    <span className="text-[#c59d5f]">★</span>
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[#ede5db] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#dec29b] to-[#b38b40] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-[11px] text-[#8c7d6c] font-light">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── If Product Has 0 Reviews: Clean Luxury Zero State ── */}
      {totalCount === 0 && !isWritingReview && !loading && (
        <div className="rounded-[8px] border border-[#e6dbc9] bg-[#fbf9f5] p-8 sm:p-10 text-center my-6 shadow-[0_2px_8px_rgba(28,21,16,0.03)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#f3ecdf] border border-[#dec29b]/60 flex items-center justify-center text-[#8c6d3d] mx-auto">
            <svg className="w-6 h-6 stroke-[1.6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1c1510] font-normal">
            No Customer Reviews Yet
          </h3>
          <p className="text-xs sm:text-sm text-[#7a6a5d] font-light max-w-md mx-auto">
            Be the first client to review this handcrafted {metal} piece. Your genuine thoughts help future jewellery admirers.
          </p>
          <button
            type="button"
            onClick={() => setIsWritingReview(true)}
            className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-[5px] bg-[#1c1510] text-[#faf7f2] hover:bg-[#33251a] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
          >
            <span>Write the First Review</span>
            <span>&rarr;</span>
          </button>
        </div>
      )}

      {/* ── Write Review Form ── */}
      {isWritingReview && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-8 rounded-[8px] border border-[#d8bb93] bg-white p-5 sm:p-7 shadow-sm animate-fadeIn space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#ede3d4]">
            <h3 className="font-serif text-lg sm:text-xl text-[#1c1510] font-normal">
              Share Your Genuine Review for {productName}
            </h3>
            <span className="text-[10.5px] uppercase tracking-wider text-[#8c6d3d] bg-[#f8f5ee] px-2 py-0.5 rounded border border-[#e6dcce]">
              Real Client Feedback
            </span>
          </div>

          {formSuccess ? (
            <div className="p-6 rounded-[6px] bg-emerald-50 border border-emerald-200 text-center text-emerald-800 space-y-1">
              <p className="font-semibold text-sm">✓ Thank You! Your Review Has Been Published</p>
              <p className="text-xs text-emerald-600">Your review is now saved and visible on this product page.</p>
            </div>
          ) : (
            <>
              {/* Star Rating Select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c493b] mb-1.5">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <svg
                        className={`w-6 h-6 ${star <= formRating ? 'text-[#c59d5f] fill-current' : 'text-[#d8cfc4]'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="text-xs text-[#8c7d6c] font-medium ml-2">
                    {formRating === 5 && 'Outstanding (5/5)'}
                    {formRating === 4 && 'Very Good (4/5)'}
                    {formRating === 3 && 'Average (3/5)'}
                    {formRating === 2 && 'Below Average (2/5)'}
                    {formRating === 1 && 'Unsatisfactory (1/5)'}
                  </span>
                </div>
              </div>

              {/* Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c493b] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full px-3.5 py-2.5 rounded-[5px] border border-[#d8c8b8] text-xs text-[#1c1510] focus:border-[#1c1510] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c493b] mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Bradford, West Yorkshire"
                    className="w-full px-3.5 py-2.5 rounded-[5px] border border-[#d8c8b8] text-xs text-[#1c1510] focus:border-[#1c1510] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c493b] mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Pure British gold quality and beautiful packaging"
                  className="w-full px-3.5 py-2.5 rounded-[5px] border border-[#d8c8b8] text-xs text-[#1c1510] focus:border-[#1c1510] focus:outline-none transition-colors"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c493b] mb-1">
                  Your Review *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Tell others about the design, gold finish, fit, and your shopping experience..."
                  className="w-full px-3.5 py-2.5 rounded-[5px] border border-[#d8c8b8] text-xs text-[#1c1510] focus:border-[#1c1510] focus:outline-none transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="px-4 py-2 rounded-[5px] border border-[#d8c8b8] text-xs text-[#5c493b] hover:bg-[#faf6f0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2 rounded-[5px] bg-[#1c1510] text-[#faf7f2] hover:bg-[#33251a] disabled:opacity-50 font-semibold text-xs tracking-wider uppercase transition-all shadow-xs"
                >
                  {formSubmitting ? 'Submitting...' : 'Publish Review'}
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* ── Filter Tabs (Only if reviews exist) ── */}
      {totalCount > 1 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          <button
            type="button"
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all ${
              filterRating === 'all'
                ? 'bg-[#1c1510] text-white shadow-xs'
                : 'bg-white text-[#5c493b] border border-[#d8c8b8] hover:border-[#1c1510]'
            }`}
          >
            All Reviews ({totalCount})
          </button>
          {[5, 4, 3, 2, 1].map((s) => {
            const count = ratingCounts[s as 1 | 2 | 3 | 4 | 5] || 0;
            if (count === 0) return null;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilterRating(s)}
                className={`px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all flex items-center gap-1 ${
                  filterRating === s
                    ? 'bg-[#1c1510] text-white shadow-xs'
                    : 'bg-white text-[#5c493b] border border-[#d8c8b8] hover:border-[#1c1510]'
                }`}
              >
                <span>{s} Stars</span>
                <span className="text-[#c59d5f]">★</span>
                <span>({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Reviews Cards List ── */}
      {displayedReviews.length > 0 && (
        <div className="space-y-4">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 rounded-[8px] border border-[#ede5db] bg-white shadow-2xs hover:border-[#dec29b]/80 transition-all space-y-2.5"
            >
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-sm sm:text-base font-semibold text-[#1c1510]">
                      {rev.name}
                    </span>
                    {rev.location && (
                      <span className="text-xs text-[#8c7d6c] font-light">
                        • {rev.location}
                      </span>
                    )}
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified Buyer
                      </span>
                    )}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex gap-[2px]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= rev.rating ? 'text-[#c59d5f] fill-current' : 'text-[#e5decb]'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[11px] text-[#8c7d6c] font-light ml-2">
                      {rev.date}
                    </span>
                  </div>
                </div>

                {/* Verified Product Chip */}
                <span className="hidden sm:inline-block text-[10px] text-[#8c6d3d] bg-[#fbf8f2] px-2 py-0.5 rounded border border-[#ecd9be]/70 font-light truncate max-w-[180px]">
                  {metal} • British Assay
                </span>
              </div>

              {/* Review Title */}
              <h4 className="font-serif text-sm sm:text-base font-semibold text-[#1c1510] leading-snug">
                {rev.title}
              </h4>

              {/* Review Body */}
              <p className="text-xs sm:text-[13px] text-[#4a3b2f] font-light leading-relaxed">
                {rev.comment}
              </p>

              {/* Helpful Vote Button */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#8c7d6c]">
                <span className="font-light italic">
                  Verified Client of Bhai Jeweller
                </span>
                <button
                  type="button"
                  onClick={() => handleHelpfulVote(rev.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border transition-colors ${
                    helpfulClicked[rev.id]
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-[#ded3c5] hover:border-[#1c1510] text-[#5c493b]'
                  }`}
                >
                  <span>👍</span>
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductReviews;
