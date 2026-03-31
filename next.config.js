/** @type {import('next').NextConfig} */
const nextConfig = {
  // Full static export — no SSR, all Firebase runs client-side only
  // Perfect for Cloudflare Pages static hosting
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;
