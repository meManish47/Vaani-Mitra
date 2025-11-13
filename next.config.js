/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // 👈 replaces "next export"
   distDir: 'out',
   trailingSlash: true,
  images: {
    unoptimized: true, // 👈 required if you're using next/image
  },
};
module.exports = nextConfig
