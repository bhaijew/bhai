import { NextResponse } from 'next/server';

let SERVER_SLIDES_DB = [
  {
    id: 'slide-1',
    title: 'The Royal Aurelia Collection',
    subtitle: 'Handcrafted 22k Pure Gold & Diamond Masterpieces',
    ctaText: 'Explore Collection',
    ctaLink: '/shop?category=Necklaces',
    image: '/images/hero-slider-1.jpg',
    status: 'Active',
    order: 1,
  },
  {
    id: 'slide-2',
    title: 'Bespoke Diamond Engagement Rings',
    subtitle: 'Tailored by Master Artisans to Tell Your Unique Love Story',
    ctaText: 'Book Consultation',
    ctaLink: '/bespoke',
    image: '/images/hero-slider-2.jpg',
    status: 'Active',
    order: 2,
  },
  {
    id: 'slide-3',
    title: 'Timeless Heritage Craftsmanship',
    subtitle: 'Discover Fine Jewelry Engineered for Generations',
    ctaText: 'Shop New Arrivals',
    ctaLink: '/shop',
    image: '/images/hero-slider-3.jpg',
    status: 'Inactive',
    order: 3,
  },
];

export async function GET() {
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
      image: body.image || '/images/hero-slider-1.jpg',
      status: body.status || 'Active',
      order: Number(body.order) || SERVER_SLIDES_DB.length + 1,
    };

    SERVER_SLIDES_DB.push(newSlide);

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

    SERVER_SLIDES_DB = SERVER_SLIDES_DB.map(s => {
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

    SERVER_SLIDES_DB = SERVER_SLIDES_DB.filter(s => s.id !== id);

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
