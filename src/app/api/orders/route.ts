import { NextResponse } from 'next/server';

let SERVER_ORDERS_DB = [
  {
    id: 'BJ-98421',
    customer: 'Sophia Reynolds',
    email: 'sophia.r@example.com',
    items: 'Solara Diamond Ring (18k Gold)',
    amount: 1280,
    date: '2026-09-26',
    paymentMethod: 'Credit Card (Visa)',
    status: 'Processing',
    address: 'Bradford, West Yorkshire, UK',
  },
  {
    id: 'BJ-98420',
    customer: 'Alexander Wright',
    email: 'a.wright@example.com',
    items: 'Lumiere Gold Necklace',
    amount: 980,
    date: '2026-09-25',
    paymentMethod: 'Apple Pay',
    status: 'Shipped',
    address: 'London, UK',
  },
  {
    id: 'BJ-98419',
    customer: 'Fatima Al-Mansoor',
    email: 'fatima.m@example.com',
    items: 'Royal Heritage Bangle + Gift Box',
    amount: 1875,
    date: '2026-09-25',
    paymentMethod: 'Direct Bank Wire',
    status: 'Processing',
    address: 'Dubai, UAE',
  },
  {
    id: 'BJ-98418',
    customer: 'James Sterling',
    email: 'james.s@example.com',
    items: 'Valera Diamond Drop Earrings',
    amount: 760,
    date: '2026-09-24',
    paymentMethod: 'Cash on Delivery',
    status: 'Delivered',
    address: 'Leeds, UK',
  },
  {
    id: 'BJ-98417',
    customer: 'Elena Rostova',
    email: 'elena.r@example.com',
    items: 'Solara Ring + Aurelia Pendant',
    amount: 2700,
    date: '2026-09-23',
    paymentMethod: 'Credit Card (MC)',
    status: 'Delivered',
    address: 'Manchester, UK',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: SERVER_ORDERS_DB.length,
    data: SERVER_ORDERS_DB,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = {
      id: body.id || `BJ-${Math.floor(10000 + Math.random() * 90000)}`,
      customer: body.customer || 'Guest Client',
      email: body.email || 'client@example.com',
      items: body.items || 'Fine Jewelry Purchase',
      amount: Number(body.amount || 0),
      date: new Date().toISOString().split('T')[0],
      paymentMethod: body.paymentMethod || 'Credit Card',
      status: body.status || 'Processing',
      address: body.address || 'Standard Delivery Address',
    };

    SERVER_ORDERS_DB.unshift(newOrder);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully in database.',
      data: newOrder,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and new status are required.' },
        { status: 400 }
      );
    }

    SERVER_ORDERS_DB = SERVER_ORDERS_DB.map(o => o.id === id ? { ...o, status } : o);

    return NextResponse.json({
      success: true,
      message: `Order ${id} status updated to ${status}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order status.' },
      { status: 500 }
    );
  }
}
