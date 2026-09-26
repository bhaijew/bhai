import { NextResponse } from 'next/server';

// Temporary server memory fallback store (can be connected to Pg/SQL pool)
let SERVER_PRODUCTS_DB: any[] = [];

export async function GET() {
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

    SERVER_PRODUCTS_DB.unshift(newProduct);

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

    SERVER_PRODUCTS_DB = SERVER_PRODUCTS_DB.filter(p => p.id !== id);

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
