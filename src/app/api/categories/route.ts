import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

const DEFAULT_CATEGORIES: CategoryData[] = [
  {
    id: 'cat-rings',
    name: 'Rings',
    slug: 'rings',
    description: 'Timeless engagement rings, diamond bands, and 22k pure gold statement rings handcrafted in the UK.',
    image: '/images/category-rings.jpg',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'cat-necklaces',
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Intricate diamond pendants, royal gold chokers, and delicate chains made with immaculate precision.',
    image: '/images/category-necklaces.jpg',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'cat-earrings',
    name: 'Earrings',
    slug: 'earrings',
    description: 'Dazzling diamond studs, chandelier jhumkas, and timeless gold hoops designed for unforgettable moments.',
    image: '/images/category-earrings.jpg',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'cat-bracelets',
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Elegant tennis bracelets, gold charm bangles, and bespoke cuffs engineered for modern luxury.',
    image: '/images/category-bracelets.jpg',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'cat-bangles',
    name: 'Bangles',
    slug: 'bangles',
    description: 'Traditional 22k gold bridal bangles, kada sets, and sleek modern stackable cuffs.',
    image: '/images/category-bracelets.jpg',
    display_order: 5,
    is_active: true,
  },
  {
    id: 'cat-pendants',
    name: 'Pendants',
    slug: 'pendants',
    description: 'Solitaire diamond pendants, bespoke birthstone designs, and 18k pure gold lockets.',
    image: '/images/category-necklaces.jpg',
    display_order: 6,
    is_active: true,
  },
];

let SERVER_CATEGORIES_DB: CategoryData[] = [...DEFAULT_CATEGORIES];

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json(
          {
            success: true,
            source: 'supabase',
            count: data.length,
            data,
          },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
            },
          }
        );
      }
    }
  } catch (err) {
    console.warn('Supabase Categories fetch warning:', err);
  }

  return NextResponse.json(
    {
      success: true,
      source: 'memory_fallback',
      count: SERVER_CATEGORIES_DB.length,
      data: SERVER_CATEGORIES_DB,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.authorized) {
      return auth.errorResponse!;
    }

    const body = await request.json();

    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category name is required.' },
        { status: 400 }
      );
    }

    const name = body.name.trim();
    const slug = (body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).trim();
    const id = body.id || `cat-${slug || Date.now()}`;
    const description = body.description || '';
    const image = body.image || '/images/category-rings.jpg';
    const display_order = typeof body.display_order === 'number' ? body.display_order : (body.displayOrder || SERVER_CATEGORIES_DB.length + 1);
    const is_active = body.is_active !== undefined ? body.is_active : (body.isActive !== undefined ? body.isActive : true);

    const categoryItem: CategoryData = {
      id,
      name,
      slug,
      description,
      image,
      display_order,
      is_active,
      updated_at: new Date().toISOString(),
      created_at: body.created_at || new Date().toISOString(),
    };

    let supabaseSynced = false;
    if (supabase) {
      try {
        const { error } = await supabase.from('categories').upsert({
          id: categoryItem.id,
          name: categoryItem.name,
          slug: categoryItem.slug,
          description: categoryItem.description,
          image: categoryItem.image,
          display_order: categoryItem.display_order,
          is_active: categoryItem.is_active,
        });
        if (!error) {
          supabaseSynced = true;
        } else {
          console.warn('Supabase categories upsert notice:', error.message);
        }
      } catch (e: any) {
        console.warn('Supabase categories error:', e?.message);
      }
    }

    const existingIdx = SERVER_CATEGORIES_DB.findIndex((c) => c.id === id || c.slug === slug);
    if (existingIdx >= 0) {
      SERVER_CATEGORIES_DB[existingIdx] = categoryItem;
    } else {
      SERVER_CATEGORIES_DB.push(categoryItem);
    }

    return NextResponse.json({
      success: true,
      message: 'Category saved successfully.',
      supabaseSynced,
      data: categoryItem,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save category.' },
      { status: 500 }
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
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json(
        { success: false, error: 'Category ID or slug is required for deletion.' },
        { status: 400 }
      );
    }

    let supabaseDeleted = false;
    if (supabase) {
      try {
        let query = supabase.from('categories').delete();
        if (id) {
          query = query.eq('id', id);
        } else if (slug) {
          query = query.eq('slug', slug);
        }
        const { error } = await query;
        if (!error) supabaseDeleted = true;
      } catch (e) {
        console.warn('Supabase category delete warning:', e);
      }
    }

    SERVER_CATEGORIES_DB = SERVER_CATEGORIES_DB.filter(
      (c) => (id ? c.id !== id : true) && (slug ? c.slug !== slug : true)
    );

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully.',
      supabaseDeleted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete category.' },
      { status: 500 }
    );
  }
}
