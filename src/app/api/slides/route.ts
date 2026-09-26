import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Clean in-memory fallback array (strictly 0 fake slides)
let SERVER_SLIDES_DB: any[] = [];

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        const mappedSlides = data.map((s) => ({
          id: s.id,
          title: s.title,
          subtitle: s.subtitle || '',
          ctaText: s.cta_text || 'Explore Collection',
          ctaLink: s.cta_link || '/shop',
          image: s.image,
          status: s.status || 'Active',
          order: Number(s.display_order || 1),
        }));
        return NextResponse.json({
          success: true,
          count: mappedSlides.length,
          data: mappedSlides,
        });
      }
    }
  } catch (err) {
    console.error('Supabase Hero Slides fetch error:', err);
  }

  return NextResponse.json({
    success: true,
    count: SERVER_SLIDES_DB.length,
    data: SERVER_SLIDES_DB,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSlide = {
      id: body.id || `slide-${Date.now()}`,
      title: body.title || 'New Banner Slide',
      subtitle: body.subtitle || '',
      ctaText: body.ctaText || 'Discover Now',
      ctaLink: body.ctaLink || '/shop',
      image: body.image || '',
      status: body.status || 'Active',
      order: Number(body.order) || SERVER_SLIDES_DB.length + 1,
    };

    if (supabase) {
      const { error } = await supabase.from('hero_slides').upsert({
        id: newSlide.id,
        title: newSlide.title,
        subtitle: newSlide.subtitle,
        cta_text: newSlide.ctaText,
        cta_link: newSlide.ctaLink,
        image: newSlide.image,
        status: newSlide.status,
        display_order: newSlide.order,
      });

      if (error) {
        console.error('Supabase Hero Slides insert error:', error);
      }
    }

    const existingIndex = SERVER_SLIDES_DB.findIndex((s) => s.id === newSlide.id);
    if (existingIndex >= 0) {
      SERVER_SLIDES_DB[existingIndex] = newSlide;
    } else {
      SERVER_SLIDES_DB.push(newSlide);
    }

    return NextResponse.json({
      success: true,
      message: 'Slide banner saved to database.',
      data: newSlide,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save slide banner.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Slide ID is required.' },
        { status: 400 }
      );
    }

    const currentSlide = SERVER_SLIDES_DB.find((s) => s.id === id);
    const newStatus = currentSlide?.status === 'Active' ? 'Inactive' : 'Active';

    if (supabase) {
      const { error } = await supabase
        .from('hero_slides')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Supabase Hero Slides update error:', error);
      }
    }

    SERVER_SLIDES_DB = SERVER_SLIDES_DB.map((s) => {
      if (s.id === id) {
        return { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return s;
    });

    return NextResponse.json({
      success: true,
      message: `Slide ${id} status toggled.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update slide.' },
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
        { success: false, error: 'Slide ID is required.' },
        { status: 400 }
      );
    }

    if (supabase) {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) {
        console.error('Supabase Hero Slides delete error:', error);
      }
    }

    SERVER_SLIDES_DB = SERVER_SLIDES_DB.filter((s) => s.id !== id);

    return NextResponse.json({
      success: true,
      message: `Slide ${id} deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete slide.' },
      { status: 500 }
    );
  }
}

