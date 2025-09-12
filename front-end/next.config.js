/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    turbo: {
      resolveAlias: {
        // Prevent accidental cross-workspace resolution during Vercel build
        clarity: false,
      },
    },
  },
};

module.exports = nextConfig;
