import React from 'react';
import type { Metadata } from 'next';
import PolicyLayout, { PolicySection } from '@/components/shared/PolicyLayout';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy | Bhai Jeweller',
  description: 'Read the official Returns & Refunds Policy for Bhai Jeweller. Returns eligible within 7 days.',
};

const returnSections: PolicySection[] = [
  {
    number: '1',
    title: 'Online Orders Only',
    content:
      'This policy applies to purchases made through our website only. Items purchased in-store must be returned directly to our Bradford store and are handled under our in-store policy.',
  },
  {
    number: '2',
    title: 'Return Eligibility',
    content:
      'You may request a return within 7 days of receiving your order. To be eligible, your item must:',
    bullets: [
      'Be unused and unworn',
      'Be in its original condition',
      'Include all original packaging, tags, certificates, and accessories',
      'Be free from scratches, marks, alterations, or damage',
      'Be accompanied by a completed returns form',
      'Include proof of purchase',
    ],
  },
  {
    number: '3',
    title: 'Non-Returnable Items',
    content:
      'For hygiene, customisation, and product-specific reasons, we cannot accept returns or refunds on:',
    bullets: [
      'Earrings',
      'Custom-made jewellery',
      'Bespoke orders',
      'Engraved or personalised items',
      'Resized items',
      'Clearance or sale items',
    ],
  },
  {
    number: '4',
    title: 'How to Start a Return',
    content:
      'To initiate a return, contact our support team at support@bhaijeweller.com or complete our online returns request. Customers are responsible for all return shipping costs. We recommend using a tracked and insured delivery service, as we cannot be responsible for items lost or damaged during return transit.',
  },
  {
    number: '5',
    title: 'Refund Timeline',
    content:
      'Once your returned item has been received and inspected, we will notify you of the outcome. If approved, your refund will be processed to the original payment method used for the purchase. Please allow up to 10 business days after approval, depending on your payment provider.',
    bullets: [
      'Original shipping charges are non-refundable',
      'Express or upgraded shipping charges are non-refundable',
      'Return shipping costs are the customer’s responsibility and are non-refundable',
    ],
  },
  {
    number: '6',
    title: 'Exchanges',
    content:
      'We offer exchanges in-store only. If you would like to exchange an item, visit our Bradford store with your item and proof of purchase. Online exchanges cannot be processed by post.',
  },
  {
    number: '7',
    title: 'Faulty or Damaged Items',
    content:
      'Contact our support team within 7 days of receiving your order. Please provide:',
    bullets: [
      'Your order number',
      'A clear description of the issue',
      'Clear photographs showing the fault or damage',
    ],
  },
  {
    number: '8',
    title: 'Contact Us',
    content:
      'If you have any questions regarding returns, refunds, or damaged items, please contact us via our Contact Us support page or email support@bhaijeweller.com. We are committed to providing a professional, reliable, and customer-focused service.',
  },
];

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout
      title="Returns & Refunds Policy"
      subtitle="We want you to love every purchase. If something isn't right, we make it straightforward to return or exchange your item within 7 days."
      heroImage="/images/about-banner.jpg"
      breadcrumbLabel="Returns & Refunds Policy"
      lastUpdated="September 26, 2026"
      sections={returnSections}
      activeSlug="return-policy"
    />
  );
}
