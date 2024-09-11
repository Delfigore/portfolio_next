/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'], // Add domains for Image component if needed
  },
  // Add any other necessary configurations
};

export default nextConfig;
