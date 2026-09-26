import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

let SERVER_HERO_CONFIG = {
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
  featuredImage: '/images/featured-ring.jpg',
};

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('hero_section')
        .select('*')
        .eq('id', 'main_hero')
        .single();

      if (!error && data) {
        SERVER_HERO_CONFIG = {
          brandPretitle: data.brand_pretitle || SERVER_HERO_CONFIG.brandPretitle,
          headlineLine1: data.headline_line1 || SERVER_HERO_CONFIG.headlineLine1,
          headlineLine2: data.headline_line2 || SERVER_HERO_CONFIG.headlineLine2,
          headlineLine3: data.headline_line3 || SERVER_HERO_CONFIG.headlineLine3,
          description: data.description || SERVER_HERO_CONFIG.description,
          primaryCtaText: data.primary_cta_text || SERVER_HERO_CONFIG.primaryCtaText,
          primaryCtaHref: data.primary_cta_href || SERVER_HERO_CONFIG.primaryCtaHref,
          heroImage: data.hero_image || SERVER_HERO_CONFIG.heroImage,
          featuredTitle: data.featured_title || SERVER_HERO_CONFIG.featuredTitle,
          featuredSubtitle: data.featured_subtitle || SERVER_HERO_CONFIG.featuredSubtitle,
          featuredImage: data.featured_image || SERVER_HERO_CONFIG.featuredImage,
        };
      }
    }
  } catch (err) {
    console.error('Supabase Hero fetch error:', err);
  }

  return NextResponse.json({
    success: true,
    data: SERVER_HERO_CONFIG,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const updatedHero = {
      brandPretitle: body.brandPretitle ?? SERVER_HERO_CONFIG.brandPretitle,
      headlineLine1: body.headlineLine1 ?? SERVER_HERO_CONFIG.headlineLine1,
      headlineLine2: body.headlineLine2 ?? SERVER_HERO_CONFIG.headlineLine2,
      headlineLine3: body.headlineLine3 ?? SERVER_HERO_CONFIG.headlineLine3,
      description: body.description ?? SERVER_HERO_CONFIG.description,
      primaryCtaText: body.primaryCtaText ?? SERVER_HERO_CONFIG.primaryCtaText,
      primaryCtaHref: body.primaryCtaHref ?? SERVER_HERO_CONFIG.primaryCtaHref,
      heroImage: body.heroImage ?? SERVER_HERO_CONFIG.heroImage,
      featuredTitle: body.featuredTitle ?? SERVER_HERO_CONFIG.featuredTitle,
      featuredSubtitle: body.featuredSubtitle ?? SERVER_HERO_CONFIG.featuredSubtitle,
      featuredImage: body.featuredImage ?? SERVER_HERO_CONFIG.featuredImage,
    };

    SERVER_HERO_CONFIG = updatedHero;

    if (supabase) {
      const { error } = await supabase.from('hero_section').upsert({
        id: 'main_hero',
        brand_pretitle: updatedHero.brandPretitle,
        headline_line1: updatedHero.headlineLine1,
        headline_line2: updatedHero.headlineLine2,
        headline_line3: updatedHero.headlineLine3,
        description: updatedHero.description,
        primary_cta_text: updatedHero.primaryCtaText,
        primary_cta_href: updatedHero.primaryCtaHref,
        hero_image: updatedHero.heroImage,
        featured_title: updatedHero.featuredTitle,
        featured_subtitle: updatedHero.featuredSubtitle,
        featured_image: updatedHero.featuredImage,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Supabase Hero update error:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Hero section updated successfully in real-time database.',
      data: SERVER_HERO_CONFIG,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update hero section.' },
      { status: 500 }
    );
  }
}
