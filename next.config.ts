import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '10.2.0.2:3000', '10.10.12.213:3000'],
    },
  },
  allowedDevOrigins: ['10.10.12.213', '10.2.0.2'],
}

export default nextConfig
