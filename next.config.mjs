/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "assets.coingecko.com",
      "img.clerk.com",
      "coin-images.coingecko.com",
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
