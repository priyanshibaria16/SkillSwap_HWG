import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dorothydalton.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jcsbalt.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'exchange4media.gumlet.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mojoauth.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
