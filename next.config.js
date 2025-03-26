/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'], // Add any domains you'll load images from
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig; 