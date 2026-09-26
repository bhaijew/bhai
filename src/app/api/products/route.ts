import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory fallback array (strictly 0 fake products)
let SERVER_PRODUCTS_DB: any[] = [];

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
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
          weightGrams: Number(p.weight_grams),
          seoTitle: p.seo_title,
          seoDescription: p.seo_description,
          focusKeywords: p.focus_keywords || [],
        }));
        return NextResponse.json({
          success: true,
          count: mappedProducts.length,
          data: mappedProducts,
        });
      }
    }
  } catch (err) {
    console.error('Supabase Products fetch error:', err);
  }

  return NextResponse.json({
    success: true,
    count: SERVER_PRODUCTS_DB.length,
    data: SERVER_PRODUCTS_DB,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Product name and price are required.' },
        { status: 400 }
      );
    }

    const newProduct = {
      id: body.id || `prod-${Date.now()}`,
      name: body.name,
      category: body.category || 'Rings',
      price: Number(body.price),
      originalPrice: Number(body.originalPrice || body.price),
      stock: Number(body.stock || 10),
      metal: body.metal || '18k Yellow Gold',
      status: Number(body.stock) > 0 ? 'In Stock' : 'Out of Stock',
      isFeatured: body.isFeatured ?? true,
      image: body.image || '',
      images: body.images || [],
      sku: body.sku || `BJ-${Date.now()}`,
      description: body.description || '',
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      weightGrams: Number(body.weightGrams || 5.0),
      seoTitle: body.seoTitle || `${body.name} | Bhai Jeweller`,
      seoDescription: body.seoDescription || `Shop ${body.name} online. Fine jewelry.`,
      focusKeywords: body.focusKeywords || [body.name.toLowerCase()],
      createdAt: new Date().toISOString(),
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
      });

      if (error) {
        console.error('Supabase Products insert error:', error);
      }
    }

    // Also keep local fallback in sync
    const existingIndex = SERVER_PRODUCTS_DB.findIndex((p) => p.id === newProduct.id);
    if (existingIndex >= 0) {
      SERVER_PRODUCTS_DB[existingIndex] = newProduct;
    } else {
      SERVER_PRODUCTS_DB.unshift(newProduct);
    }

    return NextResponse.json({
      success: true,
      message: 'Product saved successfully to database.',
      data: newProduct,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save product.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required.' },
        { status: 400 }
      );
    }

    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('Supabase Products delete error:', error);
      }
    }

    SERVER_PRODUCTS_DB = SERVER_PRODUCTS_DB.filter((p) => p.id !== id);

    return NextResponse.json({
      success: true,
      message: `Product ${id} deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product.' },
      { status: 500 }
    );
  }
}

