import { NextResponse } from 'next/server';

let SERVER_ENQUIRIES_DB = [
  {
    id: 'ENQ-101',
    name: 'Tariq Hussain',
    email: 'tariq.h@example.com',
    phone: '+44 7700 900123',
    service: 'Bespoke Engagement Ring Design',
    budget: '$3,000 - $5,000',
    date: '2026-09-26',
    message: 'Looking to customize a 1.5ct Oval Cut diamond ring in 18k yellow gold.',
    status: 'New',
  },
  {
    id: 'ENQ-100',
    name: 'Amara Vance',
    email: 'amara.vance@example.com',
    phone: '+44 7700 900456',
    service: 'Bridal Jewelry Set Customization',
    budget: '$8,000 - $12,000',
    date: '2026-09-24',
    message: 'Require full matching necklace and bangle set in 22k pure gold for wedding in November.',
    status: 'In Design',
  },
  {
    id: 'ENQ-099',
    name: 'Marcus Brody',
    email: 'marcus.b@example.com',
    phone: '+44 7700 900789',
    service: 'Heirloom Ring Restoration',
    budget: '$1,500 - $2,500',
    date: '2026-09-22',
    message: 'Restoration and resizing of vintage emerald gold ring.',
    status: 'Completed',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: SERVER_ENQUIRIES_DB.length,
    data: SERVER_ENQUIRIES_DB,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEnquiry = {
      id: body.id || `ENQ-${Math.floor(100 + Math.random() * 900)}`,
      name: body.name || 'Client',
      email: body.email || 'client@example.com',
      phone: body.phone || '+44 7700 900000',
      service: body.service || 'Bespoke Jewelry Customization',
      budget: body.budget || '$2,000 - $5,000',
      date: new Date().toISOString().split('T')[0],
      message: body.message || '',
      status: body.status || 'New',
    };

    SERVER_ENQUIRIES_DB.unshift(newEnquiry);

    return NextResponse.json({
      success: true,
      message: 'Bespoke enquiry submitted successfully to database.',
      data: newEnquiry,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit enquiry.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Enquiry ID and status are required.' },
        { status: 400 }
      );
    }

    SERVER_ENQUIRIES_DB = SERVER_ENQUIRIES_DB.map(e => e.id === id ? { ...e, status } : e);

    return NextResponse.json({
      success: true,
      message: `Enquiry ${id} status updated to ${status}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update enquiry status.' },
      { status: 500 }
    );
  }
}
