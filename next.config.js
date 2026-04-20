/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  typescript: {
    // Use the renderer-specific tsconfig that excludes main/preload
    tsconfigPath: 'tsconfig.renderer.json',
  },
};

module.exports = nextConfig;
