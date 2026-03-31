/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.ibb.co', 'ibb.co', 'images.unsplash.com'],
    unoptimized: true,
  },
  // For Cloudflare Pages deployment
  // When deploying with @cloudflare/next-on-pages, uncomment:
  // experimental: {
  //   runtime: 'edge',
  // },
};

module.exports = nextConfig;
