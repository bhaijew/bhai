import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory fallback array for non-blocking local operation
let SERVER_PRODUCTS_DB: any[] = [];

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mappedProducts = data.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: Number(p.price),
          originalPrice: Number(p.original_price || p.price),
          stock: Number(p.stock),
          metal: p.metal,
          status: p.status,
          isFeatured: p.is_featured,
          image: p.image,
          images: p.images || [],
          sku: p.sku,
          description: p.description,
          slug: p.slug,
          weightGrams: Number(p.weight_grams || 0),
          seoTitle: p.seo_title,
          seoDescription: p.seo_description,
          focusKeywords: p.focus_keywords || [],
        }));

        // Keep fallback synchronized with database
        SERVER_PRODUCTS_DB = [...mappedProducts];

        return NextResponse.json(
          {
            success: true,
            source: 'supabase',
            count: mappedProducts.length,
            data: mappedProducts,
          },
          { headers: NO_CACHE_HEADERS }
        );
      }
    }
  } catch (err) {
    console.error('Supabase Products fetch error:', err);
  }

  return NextResponse.json(
    {
      success: true,
      source: 'memory_fallback',
      count: SERVER_PRODUCTS_DB.length,
      data: SERVER_PRODUCTS_DB,
    },
    { headers: NO_CACHE_HEADERS }
  );
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.authorized) {
      return auth.errorResponse!;
    }

    const body = await request.json();

    if (!body.name || body.price === undefined || body.price === null) {
      return NextResponse.json(
        { success: false, error: 'Product name and price are required.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const productName = String(body.name).trim();
    const cleanSlug = (body.slug || productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `prod-${Date.now()}`);

    // Check if product with this ID or SAME NAME or SAME SLUG already exists in Supabase
    let existingItem: any = null;

    if (supabase) {
      // 1. Try finding by ID if provided
      if (body.id) {
        const { data } = await supabase.from('products').select('*').eq('id', body.id).maybeSingle();
        if (data) existingItem = data;
      }
      // 2. If not matched by ID, match by exact name (case-insensitive) to prevent duplicate product names!
      if (!existingItem) {
        const { data } = await supabase
          .from('products')
          .select('*')
          .ilike('name', productName)
          .maybeSingle();
        if (data) existingItem = data;
      }
      // 3. If not matched by name, match by slug
      if (!existingItem) {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('slug', cleanSlug)
          .maybeSingle();
        if (data) existingItem = data;
      }
    }

    // Reuse existing ID, slug, and SKU if matched to enforce "1 product per name" and prevent unique constraint errors
    const resolvedId = existingItem ? existingItem.id : (body.id || `prod-${Date.now()}`);
    const resolvedSlug = existingItem ? existingItem.slug : cleanSlug;
    const resolvedSku = existingItem?.sku || body.sku || `BJ-${Date.now()}`;

    const newProduct = {
      id: resolvedId,
      name: productName,
      category: body.category || existingItem?.category || 'Rings',
      price: Number(body.price),
      originalPrice: Number(body.originalPrice || body.price),
      stock: Number(body.stock || 0),
      metal: body.metal || existingItem?.metal || '18k Yellow Gold',
      status: Number(body.stock) > 0 ? (Number(body.stock) <= 5 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
      isFeatured: body.isFeatured ?? (existingItem?.is_featured ?? true),
      image: body.image || existingItem?.image || '/images/detail-ring-hero.jpg',
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : (existingItem?.images || [body.image || '/images/detail-ring-hero.jpg']),
      sku: resolvedSku,
      description: body.description || existingItem?.description || '',
      slug: resolvedSlug,
      weightGrams: Number(body.weightGrams || existingItem?.weight_grams || 5.0),
      seoTitle: body.seoTitle || existingItem?.seo_title || `${productName} | Bhai Jeweller`,
      seoDescription: body.seoDescription || existingItem?.seo_description || `Buy ${productName} online from Bhai Jeweller Bradford.`,
      focusKeywords: Array.isArray(body.focusKeywords) ? body.focusKeywords : (existingItem?.focus_keywords || [productName.toLowerCase()]),
      createdAt: existingItem?.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from('products').upsert({
        id: newProduct.id,
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        original_price: newProduct.originalPrice,
        stock: newProduct.stock,
        metal: newProduct.metal,
        status: newProduct.status,
        is_featured: newProduct.isFeatured,
        image: newProduct.image,
        images: newProduct.images,
        sku: newProduct.sku,
        description: newProduct.description,
        slug: newProduct.slug,
        weight_grams: newProduct.weightGrams,
        seo_title: newProduct.seoTitle,
        seo_description: newProduct.seoDescription,
        focus_keywords: newProduct.focusKeywords,
        updated_at: newProduct.updatedAt,
      }, { onConflict: 'id' });

      if (error) {
        console.error('Supabase Products upsert error:', error);
        return NextResponse.json(
          { success: false, error: `Database error: ${error.message}` },
          { status: 500, headers: NO_CACHE_HEADERS }
        );
      }
    }

    // Keep local fallback in sync (replace if same ID or same name)
    const existingIndex = SERVER_PRODUCTS_DB.findIndex(
      (p) => p.id === newProduct.id || p.name.trim().toLowerCase() === productName.toLowerCase()
    );
    if (existingIndex >= 0) {
      SERVER_PRODUCTS_DB[existingIndex] = newProduct;
    } else {
      SERVER_PRODUCTS_DB.unshift(newProduct);
    }

    return NextResponse.json(
      {
        success: true,
        message: existingItem ? 'Product updated successfully.' : 'Product saved successfully.',
        isUpdated: !!existingItem,
        data: newProduct,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Products POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save product.' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.authorized) {
      return auth.errorResponse!;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('Supabase Products delete error:', error);
        return NextResponse.json(
          { success: false, error: `Database error: ${error.message}` },
          { status: 500, headers: NO_CACHE_HEADERS }
        );
      }
    }

    SERVER_PRODUCTS_DB = SERVER_PRODUCTS_DB.filter((p) => p.id !== id);

    return NextResponse.json(
      {
        success: true,
        message: `Product ${id} permanently deleted from database.`,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Products DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product.' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export const PUT = POST;
