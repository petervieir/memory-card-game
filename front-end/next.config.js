/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Remove experimental turbo config that was causing issues
  // experimental: {
  //   turbo: {
  //     resolveAlias: {
  //       // Prevent accidental cross-workspace resolution during Vercel build
  //       clarity: false,
  //     },
  //   },
  // },
};

module.exports = nextConfig;
