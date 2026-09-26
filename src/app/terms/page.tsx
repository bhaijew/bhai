import React from 'react';
import type { Metadata } from 'next';
import PolicyLayout, { PolicySection } from '@/components/shared/PolicyLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Bhai Jeweller',
  description: 'Read the terms and conditions for shopping with Bhai Jeweller.',
};

const termsSections: PolicySection[] = [
  {
    number: '1',
    title: 'General',
    content:
      'These Terms & Conditions govern your use of the Bhai Jeweller website and the purchase of products from our store. By accessing or using our website, you agree to be bound by these terms.',
  },
  {
    number: '2',
    title: 'Products',
    content:
      'We make every effort to display our products as accurately as possible. However, colors, sizes and images may vary slightly from the actual product due to lighting and screen settings.',
  },
  {
    number: '3',
    title: 'Orders',
    content:
      'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our sole discretion.',
  },
  {
    number: '4',
    title: 'Pricing',
    content:
      'Prices are listed in GBP (or your local currency) and may change without prior notice. We are not responsible for pricing errors that may occur on the website.',
  },
  {
    number: '5',
    title: 'Payment',
    content:
      'We accept secure online payments through trusted providers. Your payment information is encrypted and protected.',
  },
  {
    number: '6',
    title: 'Intellectual Property',
    content:
      'All content, images, and designs on this website are the property of Bhai Jeweller and may not be used without permission.',
  },
  {
    number: '7',
    title: 'Limitation of Liability',
    content:
      'Bhai Jeweller is not responsible for any indirect, incidental, or consequential damages arising from the use of our website or products.',
  },
  {
    number: '8',
    title: 'Changes to Terms',
    content:
      'We reserve the right to update these Terms & Conditions at any time. Changes will be posted on this page with the updated date.',
  },
  {
    number: '9',
    title: 'Contact Us',
    content:
      'If you have any questions regarding these Terms & Conditions, please contact us at support@bhaijeweller.com or call our showroom at +44 1274 722606.',
  },
];

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      subtitle="Please read these terms and conditions carefully before using our website."
      heroImage="/images/auth-necklace-full.jpg"
      breadcrumbLabel="Terms & Conditions"
      lastUpdated="September 25, 2026"
      sections={termsSections}
      activeSlug="terms"
    />
  );
}
