/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'pg'],
    serverActions: true,
  },
  webpack: (config) => {
    // Add support for web3 and blockchain libraries
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify'),
      path: require.resolve('path-browserify'),
    };
    return config;
  },
};

module.exports = nextConfig;
