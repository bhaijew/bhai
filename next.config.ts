import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,          // gzip/brotli all responses
  reactStrictMode: true,

  images: {
    // Allow Next.js to optimise local /public images (WebP/AVIF conversion + compression)
    localPatterns: [{ pathname: '/images/**' }],
    formats: ['image/avif', 'image/webp'],
    // Cache optimised images for 7 days on the CDN
    minimumCacheTTL: 60 * 60 * 24 * 7,
    deviceSizes: [390, 640, 828, 1080, 1280, 1920],
    imageSizes: [16, 32, 64, 128, 256],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Cache public images for 7 days
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
    ];
  },
};

export default nextConfig;
