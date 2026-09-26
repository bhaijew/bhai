import React from 'react';
import type { Metadata } from 'next';
import PolicyLayout, { PolicySection } from '@/components/shared/PolicyLayout';

export const metadata: Metadata = {
  title: 'Refund Policy | Bhai Jeweller',
  description: 'Understand the refund terms, eligibility, and process for Bhai Jeweller items.',
};

const refundSections: PolicySection[] = [
  {
    number: '1',
    title: 'Eligibility',
    content: 'You may be eligible for a refund if:',
    bullets: [
      'The item is unused, in its original condition',
      'You request a refund within 7 days of receiving your order',
      'The item is not a custom-made or personalized product (unless faulty)',
    ],
  },
  {
    number: '2',
    title: 'Non-Refundable Items',
    content: 'The following items are non-refundable:',
    bullets: [
      'Custom-made or personalized jewellery',
      'Earrings (for hygiene reasons)',
      'Sale or discounted items',
    ],
  },
  {
    number: '3',
    title: 'Refund Process',
    content:
      'Once we receive and inspect your returned item, we will notify you via email. If approved, your refund will be processed within 7-14 business days. The amount will be credited to your original payment method.',
  },
  {
    number: '4',
    title: 'Shipping Costs',
    content:
      'Return shipping costs are the responsibility of the customer, unless the item is faulty or incorrect.',
  },
  {
    number: '5',
    title: 'Late or Missing Refunds',
    content:
      "If you haven't received your refund yet, please check with your bank or payment provider. If you're still facing issues, contact us at support@bhaijeweller.com.",
  },
  {
    number: '6',
    title: 'Contact Us',
    content:
      'For any questions regarding refunds, please reach out to us at support@bhaijeweller.com.',
  },
];

export default function RefundPolicyPage() {
  return (
    <PolicyLayout
      title="Refund Policy"
      subtitle="We want you to love your purchase. If you're not completely satisfied, this policy explains how refunds work."
      heroImage="/images/category-necklaces.jpg"
      breadcrumbLabel="Refund Policy"
      lastUpdated="September 25, 2026"
      sections={refundSections}
      activeSlug="refund-policy"
    />
  );
}
