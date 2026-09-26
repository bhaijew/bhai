import React from 'react';
import type { Metadata } from 'next';
import PolicyLayout, { PolicySection } from '@/components/shared/PolicyLayout';

export const metadata: Metadata = {
  title: 'Return Policy | Bhai Jeweller',
  description: 'Learn how to start a return or exchange with Bhai Jeweller.',
};

const returnSections: PolicySection[] = [
  {
    number: '1',
    title: 'Return Window',
    content:
      'You can return most items within 7 days of receiving your order, provided they are in their original condition and packaging.',
  },
  {
    number: '2',
    title: 'How to Return',
    content:
      'To start a return, please contact our support team at support@bhaijeweller.com with your order number and reason for return. We will provide you with return instructions and the delivery address.',
  },
  {
    number: '3',
    title: 'Condition of Items',
    content:
      'Items must be unworn, undamaged, and in their original packaging with all tags and certificates (if applicable).',
  },
  {
    number: '4',
    title: 'Refunds & Exchanges',
    content:
      'Once we receive your returned item, we will inspect it and process your refund or exchange within 7-14 business days. If you requested an exchange, we will ship the new item after the return is approved.',
  },
  {
    number: '5',
    title: 'Non-Returnable Items',
    content:
      'Custom-made or personalized jewellery, earrings (for hygiene reasons), and sale items cannot be returned.',
  },
  {
    number: '6',
    title: 'Damaged or Incorrect Items',
    content:
      'If you receive a damaged or incorrect item, please contact us within 48 hours of delivery. We will arrange a replacement or full refund at no extra cost.',
  },
  {
    number: '7',
    title: 'Contact Us',
    content:
      'For any return-related questions, please reach out to us at support@bhaijeweller.com.',
  },
];

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout
      title="Return Policy"
      subtitle="We're here to make your experience smooth and stress-free. Learn how to return your item."
      heroImage="/images/about-banner.jpg"
      breadcrumbLabel="Return Policy"
      lastUpdated="September 25, 2026"
      sections={returnSections}
      activeSlug="return-policy"
    />
  );
}
