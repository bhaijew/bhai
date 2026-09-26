import React from 'react';
import type { Metadata } from 'next';
import PolicyLayout, { PolicySection } from '@/components/shared/PolicyLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Bhai Jeweller',
  description: 'Understand how Bhai Jeweller collects, uses, and protects your personal information.',
};

const privacySections: PolicySection[] = [
  {
    number: '1',
    title: 'Who We Are',
    content:
      'Our website address is bhaijeweller.com. We are Bhai Jeweller, based in Bradford, United Kingdom. If you have any questions about this policy or how we handle your information, please contact us at support@bhaijeweller.com.',
  },
  {
    number: '2',
    title: 'Information We Collect',
    content: 'We collect the following types of information when you interact with our website:',
    bullets: [
      'Contact details you provide, such as name, email address, phone number, and postal address',
      'Order and payment information when you make a purchase',
      'Account information if you register with us',
      'Technical information such as IP address, browser type, operating system, and device details',
      'Usage information about how you navigate and interact with our site',
    ],
  },
  {
    number: '3',
    title: 'Reviews',
    content:
      'When visitors leave reviews, we collect the data shown in the comment form, plus the visitor’s IP address and browser user agent. An anonymised hash of your email may be sent to Gravatar to check for spam. Your profile picture is visible publicly alongside your comment once approved.',
  },
  {
    number: '4',
    title: 'Cookies',
    content:
      'We use cookies to improve browsing and provide checkout functionality:',
    bullets: [
      'Essential shopping cart / checkout cookies',
      'Login session cookies',
      'Comment and review cookies',
      'Analytics cookies to improve site experience',
      'Disabling essential cookies may affect site functionality',
    ],
  },
  {
    number: '5',
    title: 'Embedded Content & Analytics',
    content:
      'Pages may include embedded content from other websites (videos, images, social posts), which behaves as if you visited that website directly and may track your interaction. We use Google Site Kit — Google Analytics (traffic sources, visitor behaviour), Google Search Console (search performance), and PageSpeed Insights (site speed) — processed per Google’s own privacy policy.',
  },
  {
    number: '6',
    title: 'Customer Accounts, Orders & Payment',
    content:
      'When you create an account or place an order, we collect your name, email, phone number, billing/shipping addresses, order details, purchase history, and communication preferences — used to process orders, manage your account, and respond to enquiries.\n\nPayment Processing: Payments are handled by trusted third-party payment providers. We do not store full card details on our servers — only the information needed to confirm payment (e.g. last four digits of the card or transaction reference).',
  },
  {
    number: '7',
    title: 'Who We Share Your Data With',
    content:
      'We only share information with third parties where necessary to provide our service:',
    bullets: [
      'Payment processors to handle secure transactions',
      'Shipping and delivery providers to fulfil orders',
      'Email service providers to send confirmations and updates',
      'Analytics providers to understand site usage',
      'Legal authorities where required by law',
      'We never sell your personal information to third parties',
    ],
  },
  {
    number: '8',
    title: 'Data Retention, Your Rights & Security',
    content:
      'How long we keep data: order/transaction records for at least 7 years (tax purposes); account information while your account is active; comments retained indefinitely for follow-up recognition.\n\nYour rights: Access, Correction, Erasure, Restriction, Portability, and Objection — contact us to exercise any of these.\n\nSecurity measures: SSL encryption site-wide, secure hosting with regular updates, restricted need-to-know access, strong passwords/authentication for staff, and regular monitoring for suspicious activity.',
  },
  {
    number: '9',
    title: 'Contact Us',
    content:
      'For any privacy questions or to raise a concern, please contact us at support@bhaijeweller.com or visit our Bradford showroom.',
  },
];

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="We take your privacy seriously. This policy explains what information we collect when you use our website, how we use it, and the choices you have."
      heroImage="/images/auth-ring-full.jpg"
      breadcrumbLabel="Privacy Policy"
      lastUpdated="September 26, 2026"
      sections={privacySections}
      activeSlug="privacy"
    />
  );
}
