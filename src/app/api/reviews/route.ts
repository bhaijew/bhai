import { NextResponse } from 'next/server';
import { supabase as publicSupabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sanitizeString } from '@/lib/sanitize';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const supabase = supabaseAdmin || publicSupabase;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory fallback map for real reviews: { [productId]: CustomerReview[] }
const MEMORY_REVIEWS_DB: Record<string, any[]> = {};

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

// GET /api/reviews?productId=xyz
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    let productReviews: any[] = [];

    if (supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        productReviews = data.map((r: any) => ({
          id: r.id,
          name: r.reviewer_name || r.name,
          location: r.location || 'United Kingdom',
          rating: Number(r.rating) || 5,
          title: r.title || 'Verified Customer Review',
          comment: r.comment || '',
          verified: r.is_verified ?? true,
          helpfulCount: Number(r.helpful_count) || 0,
          date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
        }));
      }
    }

    // Combine with in-memory fallback (deduplicated by id)
    const memList = MEMORY_REVIEWS_DB[productId] || [];
    const existingIds = new Set(productReviews.map((r) => r.id));
    for (const mem of memList) {
      if (!existingIds.has(mem.id)) {
        productReviews.push(mem);
        existingIds.add(mem.id);
      }
    }

    const totalCount = productReviews.length;
    const avgRating = totalCount > 0
      ? (productReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / totalCount).toFixed(1)
      : '0.0';

    return NextResponse.json(
      {
        success: true,
        count: totalCount,
        avgRating: parseFloat(avgRating),
        reviews: productReviews,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/reviews
import { validateRequestSecurity, isBotSubmission } from '@/lib/securityGuard';

export async function POST(req: Request) {
  try {
    // 1. Payload Size & CSRF Origin Guard
    const securityCheck = validateRequestSecurity(req);
    if (!securityCheck.valid) {
      return securityCheck.errorResponse!;
    }

    const ip = getClientIp(req);
    // Rate limit: max 5 reviews per 10 minutes per IP
    const rateCheck = checkRateLimit(`review_${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many reviews submitted. Please wait ${rateCheck.resetSeconds} seconds before trying again.` },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Honeypot Bot Trap Check
    if (isBotSubmission(body)) {
      return NextResponse.json(
        { success: false, error: 'Review submission failed verification.' },
        { status: 400 }
      );
    }

    const { productId, name, location, rating, title, comment } = body;

    const cleanProductId = sanitizeString(productId, 64);
    const cleanName = sanitizeString(name, 100);
    const cleanLocation = sanitizeString(location || 'United Kingdom', 100);
    const cleanTitle = sanitizeString(title || 'Customer Review', 150);
    const cleanComment = sanitizeString(comment, 2000);

    if (!cleanProductId || !cleanName || !cleanComment) {
      return NextResponse.json(
        { success: false, error: 'Product ID, Name, and Review Comment are required' },
        { status: 400 }
      );
    }

    const parsedRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const reviewId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newReview = {
      id: reviewId,
      name: cleanName,
      location: cleanLocation,
      rating: parsedRating,
      title: cleanTitle,
      comment: cleanComment,
      verified: true,
      helpfulCount: 0,
      date: 'Just now',
      createdAt: new Date().toISOString(),
    };

    // 1. Try to save to Supabase
    if (supabase) {
      try {
        await supabase.from('reviews').insert([
          {
            id: reviewId,
            product_id: productId,
            reviewer_name: newReview.name,
            location: newReview.location,
            rating: newReview.rating,
            title: newReview.title,
            comment: newReview.comment,
            is_verified: true,
            helpful_count: 0,
            created_at: newReview.createdAt,
          },
        ]);
      } catch (err) {
        console.warn('Supabase review insert warning (falling back to memory):', err);
      }
    }

    // 2. Save to in-memory store
    if (!MEMORY_REVIEWS_DB[productId]) {
      MEMORY_REVIEWS_DB[productId] = [];
    }
    MEMORY_REVIEWS_DB[productId].unshift(newReview);

    return NextResponse.json(
      {
        success: true,
        review: newReview,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
