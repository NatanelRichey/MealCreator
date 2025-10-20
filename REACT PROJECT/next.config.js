/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/meal-creator/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Enable strict mode for better error detection
  reactStrictMode: true,
  // Configure environment variables
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig

