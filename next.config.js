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
      {
        protocol: 'https',
        hostname: 'media.cookbookmanager.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Enable strict mode for better error detection
  reactStrictMode: true,
}

module.exports = nextConfig

