import React from 'react';
import type { Metadata } from 'next';
import PolicyLayout, { PolicySection } from '@/components/shared/PolicyLayout';

export const metadata: Metadata = {
  title: 'Our Privacy Policy | Bhai Jeweller',
  description: 'Understand how Bhai Jeweller collects, uses, and protects your personal information.',
};

const privacySections: PolicySection[] = [
  {
    number: '1',
    title: 'Information We Collect',
    content: 'We may collect the following types of information:',
    bullets: [
      'Personal Information (name, email, phone number, address)',
      'Order information (products, payment details, delivery address)',
      'Usage data (pages visited, time spent, device information)',
    ],
  },
  {
    number: '2',
    title: 'How We Use Your Information',
    content: 'We use your information to:',
    bullets: [
      'Process and fulfill your orders',
      'Communicate with you about your orders',
      'Improve our website and customer experience',
      'Send promotional offers (only if you opt-in)',
    ],
  },
  {
    number: '3',
    title: 'How We Protect Your Information',
    content:
      'We take reasonable security measures to protect your personal information from unauthorized access, alteration, or disclosure.',
  },
  {
    number: '4',
    title: 'Sharing Your Information',
    content:
      'We do not sell or rent your personal information. We may share it with trusted third-party service providers (such as payment processors and delivery companies) only to the extent necessary to complete your order.',
  },
  {
    number: '5',
    title: 'Cookies',
    content:
      'Our website uses cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings, but this may affect some features of our site.',
  },
  {
    number: '6',
    title: 'Your Rights',
    content:
      'You have the right to access, correct, or delete your personal information. To make a request, please contact us at support@bhaijeweller.com.',
  },
  {
    number: '7',
    title: 'Contact Us',
    content:
      'If you have any questions about this Privacy Policy, please contact us at support@bhaijeweller.com.',
  },
];

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Our Privacy Policy"
      subtitle="Your privacy is important to us. This policy explains how we collect, use and protect your information."
      heroImage="/images/auth-ring-full.jpg"
      breadcrumbLabel="Privacy Policy"
      lastUpdated="September 25, 2026"
      sections={privacySections}
      activeSlug="privacy"
    />
  );
}
